# Cópia de segurança e restauração do banco

Este documento descreve como fazer e restaurar um backup do banco do Gabi Cake (PostgreSQL em Docker), e o teste que comprova que a restauração funciona.

## O que o backup contém

Um arquivo `.sql` gerado pelo `pg_dump`, com tudo o que está no banco:

- as tabelas e os dados de todas elas;
- as chaves, restrições e índices;
- as extensões usadas pelos índices e as sequências (para os próximos ids continuarem de onde pararam).

Ele **não** contém o arquivo `.env` nem o código do projeto.

## Cuidados

- Os backups ficam na pasta `backups/`, que está no `.gitignore` e **nunca deve ir para o GitHub**. Eles guardam dados pessoais de clientes e, com o módulo de usuários, também os hashes das senhas.
- Não envie o arquivo por mensagem nem deixe cópias em máquinas compartilhadas.
- O volume do Docker (`db_data`) **não é um backup**: `docker compose down -v` apaga o volume e os dados junto.

## Fazer um backup

Com o ambiente no ar (`docker compose up -d`), na raiz do projeto:

```bash
bash scripts/backup.sh
```

Cria `backups/gabicake-AAAAMMDD-HHMMSS.sql` e mantém só os 7 mais recentes (para mudar, passe o número: `bash scripts/backup.sh 10`).

O mesmo, sem o script:

```bash
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' > backups/gabicake-$(date +%Y%m%d-%H%M%S).sql
```

Use o Git Bash. O redirecionamento do PowerShell altera a codificação do arquivo e pode corrompê-lo.

## Restaurar um backup

```bash
bash scripts/restore.sh                     # restaura o backup mais recente
bash scripts/restore.sh backups/ARQUIVO.sql # restaura um backup específico
```

O script mostra qual arquivo será usado, pede para digitar `SIM`, para o backend, restaura e religa o backend.

O mesmo, sem o script (troque `ARQUIVO` pelo nome real do arquivo):

```bash
docker compose stop backend
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 --single-transaction' < backups/ARQUIVO.sql
docker compose start backend
```

Por que essas opções:

| Opção | Para que serve |
|---|---|
| `--clean --if-exists` (no backup) | A restauração apaga as tabelas existentes antes de recriá-las, então funciona também sobre um banco que já tem dados |
| `-v ON_ERROR_STOP=1` | Para no primeiro erro, em vez de seguir com o banco pela metade |
| `--single-transaction` | Se algo falhar, tudo é desfeito e o banco fica como estava |
| `docker compose stop backend` | Evita conexões abertas durante a restauração |

## Teste realizado

Realizado em 01/11/2026, em ambiente de desenvolvimento.

| Passo | Resultado |
|---|---|
| 1. Gravar um cliente marcador (`Marcador Backup`) | `INSERT 0 1` |
| 2. Fazer o backup | Arquivo `gabicake-20261101-182532.sql` (25 KB) |
| 3. Destruir o banco (`docker compose down -v` e `up -d db`) | O banco voltou só com o seed, e a consulta pelo marcador devolveu `(0 rows)` |
| 4. Restaurar o backup mais recente | 8 tabelas recriadas e preenchidas, índices e extensões recriados, sem erro |
| 5. Consultar o marcador | O cliente `Marcador Backup` voltou (id 13) |
| 6. Subir o ambiente e apagar o marcador | `Healthy`, `Started` nos três serviços e `DELETE 1` |

Evidências (prints dos passos 2 a 5) nos comentários da issue.

## Limitações

- É um backup **manual e lógico** (`pg_dump`): reflete o banco no momento em que foi feito. Não há agendamento automático.
- A restauração **substitui** o conteúdo atual do banco.
- O backup só deve ser restaurado em um PostgreSQL de mesma versão ou mais nova que a de origem (hoje, a 16).
- Se o schema mudar depois do backup (tabelas novas, por exemplo), um backup antigo traz o schema antigo.

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `failed to connect to the docker API` | O Docker Desktop está fechado | Abrir o Docker Desktop e esperar iniciar |
| `ERRO: não foi possível gerar o backup` | O banco não está no ar | `docker compose up -d` e repetir |
| `backup não encontrado` | Nunca foi feito um backup, ou o nome está errado | `ls backups/` e usar o nome exato |
| `ERRO na restauração` | O arquivo está corrompido ou veio de uma versão diferente | O banco ficou como estava; testar com outro backup |
| O script reclama de `\r` ou de `command not found` | O arquivo `.sh` está com quebra de linha do Windows | Conferir que o `.gitattributes` tem `*.sh text eol=lf` e baixar de novo |
