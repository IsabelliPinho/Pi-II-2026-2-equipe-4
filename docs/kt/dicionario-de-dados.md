# Dicionário de dados do Gabi Cake

As 10 tabelas abaixo pertencem ao esquema `public` no PostgreSQL 16 após a migração 08. `PK` indica chave primária, `FK` indica chave estrangeira e `UK` indica unicidade. Na coluna **Padrão**, **Identidade** significa `GENERATED ALWAYS AS IDENTITY` e **—** indica ausência de valor padrão. Todos os campos `timestamp` são `timestamp without time zone`. [MER final](mer-final.md) · [Scripts de inicialização](../../db/init/)

## cliente

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do cliente. |
| `nome` | `varchar(120)` | Não | — | Nome preenchido após aparar espaços. |
| `telefone` | `varchar(20)` | Não | — | DDD e número no formato `(88) 90000-0000` ou `(88) 3000-0000`. |
| `rua` | `varchar(120)` | Não | — | Logradouro do cadastro. |
| `num_casa` | `varchar(10)` | Não | — | Número do endereço em texto. |
| `bairro` | `varchar(80)` | Não | — | Bairro do endereço. |
| `cep` | `varchar(9)` | Não | — | CEP no formato `00000-000`. |

`uq_cliente_nome_normalizado_telefone` garante a unicidade do par `lower(btrim(nome))` e `telefone`. Pessoas de nomes diferentes podem compartilhar telefone, e homônimos podem ter telefones diferentes. Os índices GIN `idx_cliente_nome_trgm` e `idx_cliente_telefone_trgm` dão suporte à busca por trecho. [Esquema inicial](../../db/init/01-schema.sql) · [Índices de busca](../../db/init/03-indices.sql) · [Unicidade de cadastros](../../db/init/08-unicidade-cadastros.sql)

## gerente

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do registro de gerente. |
| `nome` | `varchar(120)` | Não | — | Nome preenchido após aparar espaços. UK pelo valor original e por `lower(btrim(nome))`. |
| `senha` | `varchar(100)` | Não | — | Hash BCrypt legado. A autenticação atual consulta `usuario.senha_hash`. |

O formato BCrypt é exigido por `ck_gerente_senha_hash`. O índice criado na migração 08 é `uq_gerente_nome_normalizado`. [Senha em hash](../../db/init/05-senha-hash-gerente.sql) · [Unicidade de cadastros](../../db/init/08-unicidade-cadastros.sql)

## produto

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do produto. |
| `nome` | `varchar(120)` | Não | — | Nome no catálogo. UK pelo valor original e por `lower(btrim(nome))`. |
| `preco` | `numeric(10,2)` | Não | — | Preço de catálogo maior que zero. |

`uq_produto_nome_normalizado` aplica a mesma regra de caixa e espaços usada para gerente. [Esquema inicial](../../db/init/01-schema.sql) · [Unicidade de cadastros](../../db/init/08-unicidade-cadastros.sql)

## pedido

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do pedido. |
| `cliente_id` | `integer` | Não | — | FK para `cliente.id`. |
| `gerente_id` | `integer` | Sim | — | FK para `gerente.id`. A exigência varia por status. |
| `data_prevista` | `timestamp` | Não | — | Data e hora previstas de retirada ou entrega. |
| `data_entrega` | `date` | Sim | — | Data efetiva exigida para `ENTREGUE` e `ATENDIDO`. |
| `status_pedido` | `varchar(20)` | Não | `'PENDENTE'` | `PENDENTE`, `CONFIRMADO`, `EM_PRODUCAO`, `PRONTO`, `ENTREGUE`, `ATENDIDO` ou `CANCELADO`. |
| `forma_entrega` | `varchar(10)` | Não | — | `RETIRADA` ou `ENTREGA`. |
| `entrega_rua` | `varchar(120)` | Sim | — | Logradouro de entrega. Obrigatório em `ENTREGA`. |
| `entrega_num_casa` | `varchar(10)` | Sim | — | Número do endereço de entrega. Obrigatório em `ENTREGA`. |
| `entrega_bairro` | `varchar(80)` | Sim | — | Bairro de entrega. Obrigatório em `ENTREGA`. |
| `entrega_cep` | `varchar(9)` | Sim | — | CEP de entrega no formato `00000-000`. Obrigatório em `ENTREGA`. |
| `nome_gerente` | `varchar(120)` | Sim | — | Nome textual da pessoa responsável pelo pedido. |
| `data_pedido` | `date` | Não | `CURRENT_DATE` | Data de registro. |
| `atualizado_em` | `timestamp` | Não | `CURRENT_TIMESTAMP` | Data e hora registradas para atualização. |
| `desconto` | `numeric(10,2)` | Não | `0` | Desconto não negativo. |

`ck_pedido_data_entrega` exige data efetiva para `ENTREGUE` e `ATENDIDO` e `NULL` nos demais status. `ck_pedido_gerente` permite `gerente_id` vazio em `PENDENTE` e `CANCELADO`, além de `ATENDIDO` com `nome_gerente` preenchido. `ck_pedido_endereco` exige as quatro colunas de endereço em `ENTREGA`. [Regras de pedido](../../db/init/01-schema.sql) · [Migração 07](../../db/init/07-requisitos-essenciais.sql)

Os índices `idx_pedido_cliente` e `idx_pedido_gerente` apoiam buscas pelas FKs. `idx_pedido_status_data` indexa status e data prevista. O índice parcial `idx_pedido_agenda_ativa` cobre `data_prevista` e `id` para pedidos fora dos status `CANCELADO`, `ATENDIDO` e `ENTREGUE`. [Esquema inicial](../../db/init/01-schema.sql) · [Migração 07](../../db/init/07-requisitos-essenciais.sql)

## item_pedido

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do item. |
| `pedido_id` | `integer` | Não | — | FK para `pedido.id`. |
| `produto_id` | `integer` | Não | — | FK para `produto.id`. |
| `quantidade` | `integer` | Não | `1` | Número de unidades, maior que zero. |
| `tema` | `varchar(80)` | Sim | — | Tema do item personalizado. |
| `peso` | `numeric(6,3)` | Sim | — | Peso em kg. O banco exige valor positivo quando informado. |
| `tipo_massa` | `varchar(60)` | Sim | — | Massa escolhida para o item. |
| `tipo_recheio` | `varchar(60)` | Sim | — | Recheio escolhido para o item. |

O cadastro pela API exige peso de pelo menos 2 kg quando o campo é informado. Os índices `idx_item_pedido_pedido` e `idx_item_pedido_produto` apoiam as consultas por pedido e produto. [Esquema inicial](../../db/init/01-schema.sql) · [Serviço de pedidos](../../backend/src/main/java/com/gabicake/api/service/PedidoService.java)

## usuario

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK da conta. |
| `login` | `varchar(60)` | Não | — | UK. Aceita de 3 a 60 caracteres de `a-z`, `0-9`, ponto, hífen ou sublinhado. |
| `senha_hash` | `varchar(100)` | Não | — | Hash BCrypt usado no login. |
| `nome` | `varchar(120)` | Não | — | Nome de exibição preenchido após aparar espaços. |
| `ativo` | `boolean` | Não | `true` | Indica se a conta pode autenticar. |
| `gerente_id` | `integer` | Sim | — | FK única para `gerente.id`. |
| `criado_em` | `timestamp` | Não | `now()` | Data e hora de criação da conta. |
| `tentativas_falhas` | `integer` | Não | `0` | Contador não negativo reservado ao controle de tentativas. |
| `bloqueado_ate` | `timestamp` | Sim | — | Campo para o fim de um bloqueio temporário. |

O vínculo de um usuário com seus perfis está em `usuario_perfil`. [Usuários e perfis](../../db/init/04-usuarios-perfis.sql) · [Colunas de autenticação](../../db/init/07-requisitos-essenciais.sql)

## perfil

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK do perfil. |
| `nome` | `varchar(30)` | Não | — | UK. Inicia com letra maiúscula e aceita letras maiúsculas ou sublinhado. Perfis criados pelo script 04 são `GERENTE` e `FUNCIONARIO`. |
| `descricao` | `varchar(200)` | Não | — | Descrição de acesso preenchida após aparar espaços. |

[Usuários e perfis](../../db/init/04-usuarios-perfis.sql) · [Autorização por perfil](../autorizacao.md)

## usuario_perfil

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `usuario_id` | `integer` | Não | — | FK para `usuario.id`, parte da PK composta. |
| `perfil_id` | `integer` | Não | — | FK para `perfil.id`, parte da PK composta. |

A PK `(usuario_id, perfil_id)` impede vínculo duplicado. O índice `idx_usuario_perfil_perfil` permite localizar vínculos a partir de um perfil. [Usuários e perfis](../../db/init/04-usuarios-perfis.sql)

## sessao

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | Identidade | PK da sessão. |
| `usuario_id` | `integer` | Não | — | FK para `usuario.id`. |
| `token_hash` | `varchar(64)` | Não | — | UK. SHA-256 do token, em 64 caracteres hexadecimais minúsculos. |
| `criada_em` | `timestamp` | Não | `CURRENT_TIMESTAMP` | Início da sessão. |
| `ultimo_acesso_em` | `timestamp` | Não | `CURRENT_TIMESTAMP` | Último uso registrado. Deve ser igual ou posterior à criação. |
| `expira_em` | `timestamp` | Não | — | Prazo de expiração posterior à criação. |
| `revogada_em` | `timestamp` | Sim | — | Se preenchido, indica revogação em horário igual ou posterior à criação. |

A aplicação cria sessões com duração total de 8 horas e verifica 30 minutos de inatividade. Os índices `idx_sessao_usuario` e `idx_sessao_expiracao` cobrem a conta e o prazo. [Esquema de sessão](../../db/init/07-requisitos-essenciais.sql) · [Serviço de sessões](../../backend/src/main/java/com/gabicake/api/service/SessaoService.java)

## configuracao_loja

| Coluna | Tipo | Nulo | Padrão | Regra e uso |
|---|---|---|---|---|
| `id` | `integer` | Não | `1` | PK fixa em `1`, com capacidade para uma configuração. |
| `endereco_loja` | `varchar(300)` | Não | — | Endereço preenchido após aparar espaços. |
| `latitude` | `numeric(9,6)` | Sim | — | Entre -90 e 90 graus. |
| `longitude` | `numeric(9,6)` | Sim | — | Entre -180 e 180 graus. |
| `raio_entrega_km` | `numeric(8,3)` | Não | — | Raio de entrega em quilômetros, maior que zero. |
| `antecedencia_minima_horas` | `integer` | Não | `0` | Antecedência mínima em horas, maior ou igual a zero. |
| `url_planilha_financeira` | `varchar(2048)` | Sim | — | Endereço da planilha financeira da loja. |

Em `ck_configuracao_coordenadas`, latitude e longitude devem ser fornecidas juntas ou ambas ficar nulas. [Configuração da loja](../../db/init/07-requisitos-essenciais.sql)