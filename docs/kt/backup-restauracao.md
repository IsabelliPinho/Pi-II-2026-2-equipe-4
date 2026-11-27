# Backup e restauração do banco

O procedimento local usa `pg_dump` para gerar uma cópia lógica em SQL. A cópia contém esquema, linhas, índices, restrições, extensões e valores de sequências. O restaurador aplica o arquivo ao banco definido no serviço `db` do Compose. [Script de backup](../../scripts/backup.sh) · [Script de restauração](../../scripts/restore.sh)

## Conferir o ambiente

Execute os comandos na raiz do projeto. Verifique o serviço do banco e confirme o destino antes de gerar a cópia ou iniciar uma restauração. Use a mesma versão do PostgreSQL ou uma versão compatível mais recente para restaurar.

```bash
docker compose up -d --wait db
docker compose ps
docker compose exec -T db sh -c '
    psql -X -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT current_database(), version();"
'
```

## Gerar a cópia de segurança

1. Rode o script. O padrão retém as sete cópias `.sql` mais recentes. Passe um número como argumento para alterar a retenção.

   ```bash
   bash scripts/backup.sh
   ```

2. Anote o caminho exibido pelo script, no formato `backups/gabicake-AAAAMMDD-HHMMSS.sql`. Substitua o nome de exemplo abaixo pelo arquivo criado e registre o SHA-256 para verificar a cópia antes de restaurar.

   ```bash
   ARQUIVO=backups/gabicake-AAAAMMDD-HHMMSS.sql
   test -s "$ARQUIVO" && sha256sum "$ARQUIVO"
   ```

3. Guarde a cópia e o checksum em local privado. O SQL inclui dados de clientes e hashes de credenciais, por isso a pasta `backups/` fica fora do Git. [Política de armazenamento local](../backup-restore.md) · [Arquivo de exclusões do Git](../../.gitignore)

## Restaurar a cópia

1. Suba o serviço `db` e confira o banco de destino. O script recria os objetos incluídos na cópia e substitui os dados dessas tabelas. Para testar a recuperação, use um ambiente isolado.
2. Confirme se o SHA-256 corresponde ao checksum registrado. Execute a restauração informando o caminho conferido.

   ```bash
   sha256sum "$ARQUIVO"
   bash scripts/restore.sh "$ARQUIVO"
   ```

3. Quando o script mostrar o arquivo a restaurar, digite `SIM` para confirmar. Ele para o backend, usa `psql` com `ON_ERROR_STOP` e `--single-transaction` e sobe os serviços após aplicar o SQL.
4. Se houver erro no SQL, confira a mensagem do `psql`. A transação será revertida. Após o diagnóstico, use `docker compose up -d` para voltar a servir a base. [Procedimento de recuperação](../backup-restore.md)

## Conferir a recuperação

1. Confira a saúde dos serviços. Com as portas padrão, a API responde com status `UP` e o frontend retorna HTTP 200.

   ```bash
   docker compose ps
   curl -fsS http://localhost:8080/actuator/health
   curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000/
   ```

2. Compare as contagens com as registradas antes do backup. Em uma cópia de teste, confira pelo menos um cliente, o pedido e os itens vinculados, além das contagens.

   ```bash
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -
   ' <<'SQL'
   SELECT (SELECT count(*) FROM cliente) AS clientes,
          (SELECT count(*) FROM produto) AS produtos,
          (SELECT count(*) FROM pedido) AS pedidos,
          (SELECT count(*) FROM item_pedido) AS itens,
          (SELECT count(*) FROM usuario) AS usuarios;
   SQL
   ```

3. Valide uma busca e um login na aplicação restaurada. No teste do projeto, o cliente 43, o pedido 100 e o item 195 voltaram com os mesmos vínculos e os dumps de dados e sequências coincidiram. A mesma evidência registra a reconstrução de um volume apagado e a reversão de uma restauração com SQL inválido. [Relatório do ciclo do banco](../evidencias/evidencia-ciclo-banco.txt) · [Captura do cliente recuperado](../evidencias/ciclo-banco-marcador-restaurado.png)

Para o Supabase, siga o procedimento do ambiente hospedado, que usa a conexão do Session pooler ou os backups do painel quando disponíveis no plano. [Deploy e operação](../deploy.md)