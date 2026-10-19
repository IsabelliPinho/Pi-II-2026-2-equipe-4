# Estratégia de indexação do banco de dados – Gabi Cake

Projeto Integrador II 2026/2 – Equipe 4
Banco de dados: PostgreSQL 16
Arquivos relacionados: `db/init/01-schema.sql`, `db/init/03-indices.sql` e `db/perf/carga-teste-indices.sql`

## 1. O que fizemos e por quê

Um índice funciona como o índice remissivo de um livro: em vez de ler a tabela inteira para achar uma linha, o banco consulta uma estrutura auxiliar que aponta direto para o lugar certo. Nesta tarefa, o nosso objetivo foi descobrir quais colunas do sistema são mais usadas para filtrar e ligar tabelas (`WHERE` e `JOIN`), criar índices para elas e deixar registrado o motivo de cada escolha, inclusive das colunas que decidimos **não** indexar.

Para isso, lemos os repositórios e serviços do backend (`ClienteRepository`, `PedidoService`, entre outros) e as consultas do arquivo `db/verificar.sql`, para descobrir o que o sistema realmente pergunta ao banco, e não apenas o que imaginamos que ele pergunta.

## 2. O que o sistema consulta

A busca de clientes (`GET /clientes/busca`) procura o texto digitado dentro do nome **ou** do telefone, sem diferenciar maiúsculas de minúsculas. O Spring Data traduz isso para algo como `upper(nome) LIKE upper('%texto%') OR upper(telefone) LIKE upper('%texto%')`. Essa é a consulta mais "pesada" do sistema, porque o `%` no começo obriga o banco a olhar o meio de cada texto.

A listagem de pedidos por status (`GET /pedidos?status=`) filtra pela coluna `status_pedido`, e a tela de um pedido carrega os itens dele, filtrando `item_pedido` por `pedido_id`. Além disso, as ligações entre as tabelas (pedido com cliente, pedido com gerente, item com produto) usam as chaves estrangeiras, e o PostgreSQL **não** cria índice automático para chave estrangeira, diferente do que acontece com chave primária e com colunas `UNIQUE`.

## 3. Índices que o projeto passa a ter

Os cinco primeiros já estavam no final do `01-schema.sql`. Os dois últimos são novos e estão no `03-indices.sql`.

| Índice | Coluna(s) | Para que serve |
|---|---|---|
| `idx_pedido_cliente` | `pedido.cliente_id` | Ligar o pedido ao cliente e listar os pedidos de um cliente. |
| `idx_pedido_gerente` | `pedido.gerente_id` | Ligar o pedido ao gerente e acelerar a verificação quando um gerente é excluído. |
| `idx_pedido_status_data` | `pedido.status_pedido`, `pedido.data_prevista` | Listar pedidos por status já ordenados por data prevista. |
| `idx_item_pedido_pedido` | `item_pedido.pedido_id` | Buscar os itens de um pedido. |
| `idx_item_pedido_produto` | `item_pedido.produto_id` | Ligar o item ao produto e verificar a exclusão de produto. |
| `idx_cliente_nome_trgm` | `upper(cliente.nome)` | Busca de cliente por trecho do nome. |
| `idx_cliente_telefone_trgm` | `upper(cliente.telefone)` | Busca de cliente por trecho do telefone. |

No índice composto de pedidos, colocamos `status_pedido` primeiro porque ele é comparado por igualdade, e `data_prevista` depois porque serve para ordenar. A ordem das colunas importa: invertida, o índice ajudaria bem menos.

Os dois índices de cliente merecem uma explicação à parte. Um índice comum (B-tree) só ajuda quando sabemos o começo do texto, como em `LIKE 'Mar%'`. Como a nossa busca procura o trecho em qualquer posição (`LIKE '%mar%'`), ele seria ignorado. A solução foi usar a extensão `pg_trgm`, que quebra cada texto em pedaços de três letras (trigramas) e indexa esses pedaços, com um índice do tipo GIN. Isso permite encontrar o trecho no meio do texto. Outro detalhe: criamos o índice sobre `upper(nome)` e não sobre `nome`, porque a consulta gerada pelo Spring usa `upper()`, e o banco só aproveita o índice quando a expressão da consulta é igual à do índice. Por sorte, a nossa API já exige no mínimo 3 caracteres na busca, que é justamente o tamanho mínimo para o trigrama funcionar.

## 4. O que decidimos não indexar

Não criamos índice em `pedido.forma_entrega`, porque só tem dois valores (retirada ou entrega) e o índice quase não reduziria o trabalho do banco. Também deixamos de fora `pedido.data_entrega`, o endereço do cliente (`rua`, `num_casa`, `bairro`, `cep`), `produto.preco` e os detalhes do item (`tema`, `peso`, `tipo_massa`, `tipo_recheio`), pois nenhuma consulta do sistema filtra por essas colunas hoje. Indexar sem necessidade só deixa as gravações mais lentas e ocupa espaço. Se uma tela nova passar a filtrar por alguma delas, vale reavaliar.

## 5. Como testamos

Com os dados do `02-seed.sql` (12 clientes e 15 pedidos) o teste não mostra nada, porque o PostgreSQL decide corretamente que ler uma tabela minúscula inteira é mais rápido do que usar índice. Por isso criamos um banco de teste separado com dados sintéticos: 100.000 clientes, 300.000 pedidos e 600.000 itens (script em `db/perf/carga-teste-indices.sql`). Usamos o comando `EXPLAIN ANALYZE`, que mostra o plano escolhido pelo banco e o tempo real de execução.

Na busca de clientes, antes dos índices novos o plano era `Seq Scan` (leitura da tabela inteira, descartando 99.000 linhas). Depois, passou a ser `Bitmap Index Scan` nos dois índices de trigrama, combinados com `BitmapOr`, que nada mais é do que a união dos resultados dos dois índices para atender ao `OR` entre nome e telefone.

| Busca | Antes | Depois |
|---|---|---|
| nome `carlos lima` (1.000 resultados) | 109 ms | 5,6 ms |
| fragmento raro `7f3a9` (3 resultados) | 112 ms | 0,3 ms |
| texto `mari` (10.000 resultados, 10% da tabela) | 120 ms | 16,4 ms |

Também medimos o efeito dos índices que já existiam, removendo cada um dentro de uma transação que depois foi desfeita (`ROLLBACK`), para não alterar o banco. Buscar os itens de um pedido caiu de 54 ms para 0,07 ms com `idx_item_pedido_pedido`. Buscar os pedidos de um cliente foi de 30 ms para 0,11 ms com `idx_pedido_cliente`. Listar pedidos pendentes foi de 44 ms para 20 ms com `idx_pedido_status_data`.

Os tempos dependem do computador e podem variar de uma execução para outra. O que importa é a mudança de plano e a ordem de grandeza da diferença. Para repetir o teste:

```bash
docker compose exec db createdb -U gabicake gabitest
docker compose exec -T db psql -U gabicake -d gabitest < db/init/01-schema.sql
docker compose exec -T db psql -U gabicake -d gabitest < db/perf/carga-teste-indices.sql
docker compose exec -T db psql -U gabicake -d gabitest < db/init/03-indices.sql
docker compose exec -T db psql -U gabicake -d gabitest -c \
  "EXPLAIN ANALYZE SELECT * FROM cliente
   WHERE upper(nome) LIKE upper('%carlos%') OR upper(telefone) LIKE upper('%carlos%')
   ORDER BY id;"
```

Em um banco já existente, basta rodar o `03-indices.sql`, que pode ser executado mais de uma vez sem causar erro. Em um banco novo (`docker compose down -v && docker compose up`), ele roda sozinho depois do `01` e do `02`.

## 6. O que os índices custam

Índice não é de graça. Cada inserção, alteração ou exclusão também precisa atualizar os índices. No nosso teste, inserir 30.000 clientes de uma só vez levou 281 ms sem os índices de trigrama e 1.683 ms com eles, ou seja, cerca de seis vezes mais lento. Eles também ocupam espaço: os dois juntos têm cerca de 15 MB, para uma tabela de clientes de 13 MB.

Para a realidade de uma confeitaria, com poucos cadastros por dia, esse custo não faz diferença. Mas é preciso ser honesto sobre o outro lado: com algumas centenas de clientes, a busca já é instantânea sem índice nenhum, então o ganho dos índices de trigrama só aparece quando a base cresce. Nós os criamos pensando nesse crescimento. Além disso, quando o texto buscado aparece em uma fração grande da tabela (como o `mari`, com 10%), o ganho diminui, e o banco pode até preferir ler a tabela inteira. Isso é normal.

## 7. Um ponto que ainda precisa ser ajustado no código

Ao analisar o `PedidoService`, percebemos que os métodos `buscar` e `consultarPedidosResumidos` fazem `findAll()` e só depois filtram o status com `stream().filter(...)`. Ou seja, o banco devolve todos os pedidos e o filtro acontece no Java, então o `idx_pedido_status_data` não chega a ser usado. Para aproveitar o índice, o filtro deve ser feito pelo próprio banco:

```java
// PedidoRepository
List<PedidoEntity> findByStatusPedido(String statusPedido, Sort sort);

// PedidoService (os status são gravados em MAIÚSCULAS)
List<PedidoEntity> pedidos = (status == null || status.isBlank())
        ? pedidoRepository.findAll(Sort.by("id"))
        : pedidoRepository.findByStatusPedido(status.trim().toUpperCase(), Sort.by("id"));
```

É importante **não** usar `findByStatusPedidoIgnoreCase`. Esse método gera `upper(status_pedido) = upper(?)`, e o índice comum não funciona com essa expressão. No teste, a consulta com `upper()` levou 118 ms (leitura da tabela inteira) contra 12 ms com a igualdade simples.

Daqui para frente, sempre que o grupo criar uma consulta nova com `WHERE` ou `JOIN`, vale rodar o `EXPLAIN ANALYZE` e atualizar este documento. O log do backend já mostra o SQL gerado, pois `spring.jpa.show-sql=true` está ativado.
