# Testes de integridade: chaves estrangeiras e unicidade – Gabi Cake

Projeto Integrador II 2026/2 – Equipe 4
Banco de dados: PostgreSQL 16
Arquivos relacionados: `db/testes/testes-integridade.sql` e `docs/evidencias/resultado-testes-integridade.txt`

## 1. O que queríamos descobrir

Chave estrangeira (FK) e restrição de unicidade (UNIQUE) são as regras que impedem o banco de aceitar dados que não fazem sentido: um pedido de um cliente que não existe, um item de um produto inexistente, dois gerentes com o mesmo nome. Só que essas regras estão escritas no `01-schema.sql`, e escrever a regra não prova que ela funciona. Por isso, nesta tarefa, fizemos o contrário do que o sistema faz no dia a dia: tentamos de propósito inserir, alterar e apagar dados inválidos e conferimos se o banco recusava cada tentativa com o erro certo.

## 2. Como o teste funciona

Escrevemos um único script SQL que executa 21 casos, um depois do outro. Para cada caso ele registra qual erro era esperado, qual erro realmente veio e se os dois batem. O PostgreSQL identifica cada tipo de erro por um código chamado SQLSTATE: `23503` significa violação de chave estrangeira e `23505` significa violação de unicidade. Além do código, o script confere o **nome da constraint** que apareceu no erro (por exemplo `fk_item_produto`). Isso é importante: se conferíssemos só o código, um teste poderia "passar" por causa de outra constraint e esconder um problema real.

O script é seguro de rodar: cada caso acontece dentro de uma subtransação que é desfeita ao final, e o script inteiro termina com `ROLLBACK`. Conferimos que, depois da execução, o banco continua com as mesmas contagens do seed (12 clientes, 15 pedidos, 10 gerentes, 12 produtos e 26 itens). Se algum teste falhar, o `psql` termina com código de saída diferente de zero, o que permite usar o mesmo script em uma automação no futuro.

## 3. Resultados

### Chaves estrangeiras

Testamos as duas formas de quebrar uma FK: apontar para algo que não existe (inserindo ou alterando) e apagar algo que ainda está sendo usado. As FKs de `pedido` e `item_pedido` foram criadas com `ON DELETE RESTRICT`, exceto a de item para pedido, que é `CASCADE`.

| Caso | O que tentamos | Erro obtido |
|---|---|---|
| FK-01 | Inserir pedido com cliente inexistente | `23503` `fk_pedido_cliente` |
| FK-02 | Inserir pedido com gerente inexistente | `23503` `fk_pedido_gerente` |
| FK-03 | Inserir item com pedido inexistente | `23503` `fk_item_pedido` |
| FK-04 | Inserir item com produto inexistente | `23503` `fk_item_produto` |
| FK-05 | Alterar um pedido para um cliente inexistente | `23503` `fk_pedido_cliente` |
| FK-06 | Alterar um item para um produto inexistente | `23503` `fk_item_produto` |
| FK-07 | Apagar um cliente que tem pedidos | `23503` `fk_pedido_cliente` |
| FK-08 | Apagar um gerente que confirmou pedidos | `23503` `fk_pedido_gerente` |
| FK-09 | Apagar um produto que já foi vendido | `23503` `fk_item_produto` |

Os nove casos foram rejeitados pelo banco com a constraint esperada.

### Unicidade

Testamos as colunas com `UNIQUE` (nome do gerente e nome do produto), tanto ao inserir quanto ao alterar, e também a repetição de chave primária.

| Caso | O que tentamos | Erro obtido |
|---|---|---|
| UQ-01 | Inserir gerente com nome já existente | `23505` `uq_gerente_nome` |
| UQ-02 | Inserir produto com nome já existente | `23505` `uq_produto_nome` |
| UQ-03 | Alterar um gerente para o nome de outro | `23505` `uq_gerente_nome` |
| UQ-04 | Alterar um produto para o nome de outro | `23505` `uq_produto_nome` |
| UQ-05 | Inserir cliente repetindo um id existente | `23505` `cliente_pkey` |
| UQ-06 | Inserir pedido repetindo um id existente | `23505` `pedido_pkey` |

Os seis casos também foram rejeitados com o erro esperado.

### Controles

Incluímos três casos que devem **funcionar**: inserir um pedido válido, inserir um item válido e apagar um pedido, conferindo que os itens dele somem junto (o `ON DELETE CASCADE`). Eles servem para provar que os testes anteriores falham pelo motivo certo, e não porque o ambiente está quebrado. Os três passaram.

## 4. Será que os testes realmente detectam problemas?

Um teste que sempre passa não vale nada, então fizemos uma verificação extra: copiamos o banco e, nessa cópia, removemos de propósito a FK `fk_item_produto` e a restrição `uq_gerente_nome`. Ao rodar o script, ele acusou falha exatamente nos cinco casos ligados a essas duas regras (FK-04, FK-06, FK-09, UQ-01 e UQ-03), apontou "aceito pelo banco" em cada um e terminou com código de saída 3. Ou seja, se alguém apagar uma dessas constraints no futuro, a bateria percebe.

## 5. O que descobrimos além do esperado

Todas as regras que existem estão funcionando. Mas a bateria também mostra situações que o banco **aceita** hoje, e que talvez a equipe queira decidir se deve aceitar. Marcamos esses três casos como ALERTA, e não como falha, porque o banco está fazendo exatamente o que o schema manda.

O primeiro é que a unicidade diferencia maiúsculas de minúsculas. Hoje o banco aceita um gerente "GABRIELA ALMEIDA" mesmo já existindo "Gabriela Almeida", e o mesmo vale para produtos. O segundo é parecido: um produto chamado `Brownie ` (com um espaço no final) é aceito ao lado de `Brownie`. Para um sistema em que o nome do gerente será usado para entrar, isso pode gerar confusão. Uma correção possível é trocar a comparação por uma versão normalizada:

```sql
CREATE UNIQUE INDEX uq_gerente_nome_normalizado ON gerente (lower(btrim(nome)));
CREATE UNIQUE INDEX uq_produto_nome_normalizado ON produto (lower(btrim(nome)));
```

Testamos essa correção em uma cópia do banco: os dois casos passam a ser recusados com `23505`, e o seed existente não conflita com os novos índices. Não alteramos o `01-schema.sql` por conta própria, porque mexer no schema é uma decisão da equipe. Se for aplicada, as constraints antigas (`uq_gerente_nome` e `uq_produto_nome`) podem continuar, pois não atrapalham.

O terceiro é que o cadastro de cliente não tem nenhuma restrição de unicidade: o mesmo nome com o mesmo telefone pode ser cadastrado duas vezes. Aqui não recomendamos corrigir sem pensar, porque duas pessoas da mesma família podem dividir um telefone, e duas pessoas diferentes podem ter o mesmo nome. É uma decisão de regra de negócio, e vale conversar com a cliente.

## 6. Limites desta bateria

Os testes foram feitos direto no banco, sem passar pela API, então comprovam que a última linha de defesa funciona, mas não testam as validações do backend. Também não testamos `ON UPDATE CASCADE`, porque os ids são `GENERATED ALWAYS` e não podem ser alterados no uso normal. As regras `CHECK` (telefone, CEP, status, quantidade) já têm alguns testes manuais na seção 4 do `db/verificar.sql` e não foram o foco desta tarefa. Por fim, os casos usam como base os dados do `02-seed.sql`, e por isso o script espera que o seed esteja carregado.

## 7. Como repetir

```bash
docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
    < db/testes/testes-integridade.sql
```

A saída completa da nossa execução está em `docs/evidencias/resultado-testes-integridade.txt`: 18 casos PASSOU e 3 ALERTA, com código de saída 0.