# Criar e aplicar migrações

O projeto versiona o esquema em arquivos SQL numerados em `db/init/`. O Docker Compose monta essa pasta no diretório de inicialização do PostgreSQL, que executa os arquivos em ordem de nome ao preparar um volume vazio. Para um volume existente, aplique os scripts pendentes com `psql`. No Compose, o Hibernate valida o esquema quando o backend inicia. [Docker Compose](../../docker-compose.yml) · [Reconstrução verificada](../evidencias/evidencia-ciclo-banco.txt)

## Ordem atual

| Arquivo | Efeito |
|---|---|
| [01-schema.sql](../../db/init/01-schema.sql) | Cria cliente, gerente, produto, pedido e item de pedido. |
| [02-seed.sql](../../db/init/02-seed.sql) | Carrega a massa inicial local. |
| [03-indices.sql](../../db/init/03-indices.sql) | Instala `pg_trgm` e cria os índices de busca de clientes. |
| [04-usuarios-perfis.sql](../../db/init/04-usuarios-perfis.sql) | Cria usuários, perfis e seus vínculos. Migra os gerentes cadastrados. |
| [05-senha-hash-gerente.sql](../../db/init/05-senha-hash-gerente.sql) | Exige formato BCrypt na coluna legada de senha do gerente. |
| [06-seed-usuarios.sql](../../db/init/06-seed-usuarios.sql) | Acrescenta funcionários de teste e verifica a presença de usuário ativo por perfil. |
| [07-requisitos-essenciais.sql](../../db/init/07-requisitos-essenciais.sql) | Ajusta pedidos e autenticação. Cria a configuração de loja e as sessões. |
| [08-unicidade-cadastros.sql](../../db/init/08-unicidade-cadastros.sql) | Define a unicidade normalizada para clientes, gerentes e produtos. |

## Escrever uma migração

1. Reserve o próximo número disponível em `db/init/` e escolha um nome que identifique a mudança. Mantenha as alterações já publicadas no histórico de arquivos.
2. Escreva a mudança em uma transação quando as instruções do PostgreSQL permitirem. Para uma nova restrição sobre dados já gravados, confira quais linhas violariam a regra. A migração 08 mostra como interromper o processo ao encontrar conflitos e informar os IDs envolvidos. [Migração 08](../../db/init/08-unicidade-cadastros.sql)
3. Atualize o mapeamento JPA quando a mudança afetar campos usados pelo backend. Atualize também o MER, o dicionário e as verificações que cobrem a regra alterada. [Entidades JPA](../../backend/src/main/java/com/gabicake/api/entity/) · [Dicionário de dados](dicionario-de-dados.md)
4. Registre como recuperar a base se houver falha. Se o script alterar ou remover dados, prepare uma cópia de segurança antes da aplicação. [Backup e restauração](backup-restauracao.md)

Este exemplo adiciona uma descrição opcional a `produto`. Em uma base de teste, salve o SQL como `db/init/09-produto-descricao.sql`.

```sql
BEGIN;

ALTER TABLE produto
    ADD COLUMN IF NOT EXISTS descricao varchar(300);

COMMIT;
```

## Aplicar em uma base existente

1. Suba o banco e confirme o destino. Os exemplos de terminal partem da raiz do projeto.

   ```bash
   docker compose up -d --wait db
   docker compose exec -T db sh -c '
       psql -X -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT current_database(), version();"
   '
   ```

2. Em uma cópia de teste, execute apenas os arquivos pendentes em ordem. Para testar a nova coluna do exemplo, use o comando abaixo. O `ON_ERROR_STOP` faz o `psql` encerrar ao encontrar um erro.

   ```bash
   MIGRACAO=db/init/09-produto-descricao.sql
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -
   ' < "$MIGRACAO"
   ```

3. Confira a mudança no catálogo. No exemplo, o resultado esperado é `descricao` com tipo `character varying`, limite 300 e `is_nullable = YES`.

   ```bash
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -
   ' <<'SQL'
   SELECT column_name, data_type, character_maximum_length, is_nullable
   FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'produto'
     AND column_name = 'descricao';
   SQL
   ```

4. Execute os testes do banco e inicie a aplicação para conferir a validação do esquema. Use uma base local com a massa de teste padrão para a bateria de integridade.

   ```bash
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -
   ' < db/testes/testes-integridade.sql
   docker compose up -d --build backend
   docker compose logs --tail=50 backend
   ```

5. Teste também a instalação do conjunto de scripts em um volume vazio de um projeto Compose isolado. Confira os arquivos executados com `docker compose logs db` e a integridade após a subida. A evidência da migração 08 cobre inicialização limpa, aplicação com dados e reaplicação. [Evidência da migração 08](../evidencias/evidencia-migracao-08.txt)

No ambiente do cliente, confirme primeiro a versão do esquema e o backup disponível. O guia de deploy registra a configuração do Supabase e a forma de acesso para a operação. [Deploy e operação](../deploy.md)