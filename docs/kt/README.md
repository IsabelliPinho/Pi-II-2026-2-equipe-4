# KT de banco de dados

O Gabi Cake usa PostgreSQL 16 para persistir clientes, pedidos, produtos, contas de acesso e a configuração da loja. O modelo abaixo corresponde à estrutura após a migração 08. A configuração do ambiente local fica no Docker Compose. [Docker Compose](../../docker-compose.yml) · [Scripts de inicialização](../../db/init/)

| Documento | Conteúdo |
|---|---|
| [MER final](mer-final.md) | Entidades, vínculos, cardinalidades e efeitos de exclusão |
| [Dicionário de dados](dicionario-de-dados.md) | Tipos, nulabilidade, valores padrão, chaves e restrições das 10 tabelas |
| [Criar e aplicar migrações](migracoes.md) | Sequência de inicialização, exemplo de migração e verificação em base existente |
| [Carregar o seed](seed.md) | Carga automática local e base exclusiva do Marco Final |
| [Fazer backup e restaurar](backup-restauracao.md) | Geração da cópia, restauração local e conferência dos dados recuperados |

Os tutoriais de terminal partem da raiz do repositório e usam Bash, Docker Compose v2 e a configuração local do projeto. Use o guia de deploy para identificar o ambiente hospedado antes de operar o banco do cliente. [Configuração local](../../.env.example) · [Deploy do cliente](../deploy.md)