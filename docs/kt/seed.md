# Carga dos seeds

A massa padrão de teste é carregada pelos scripts 02 e 06 durante a inicialização de um volume vazio. O seed do Marco Final roda sob demanda e pode ser aplicado em uma base exclusiva para a demonstração. [Massa inicial](../../db/init/02-seed.sql) · [Usuários de teste](../../db/init/06-seed-usuarios.sql) · [Seed do Marco Final](../../db/seed/09-demonstracao-final.sql)

## Carga automática da base local

1. Na raiz do projeto, configure o Docker Compose com os valores do seu ambiente local. Use um volume vazio de um ambiente de teste para executar a inicialização automática. [Modelo de configuração](../../.env.example)
2. Suba o serviço de banco e confira os logs.

   ```bash
   docker compose up -d --wait db
   docker compose logs db
   ```

3. Confira nos logs a execução de `02-seed.sql` e `06-seed-usuarios.sql`. Em seguida, rode a bateria da massa inicial.

   ```bash
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -
   ' < db/testes/testes-seed-usuarios.sql
   ```

   Após a carga padrão, a base tem 12 clientes, 12 produtos, 15 pedidos, 26 itens e 13 usuários de teste. As contas de 02 e 06 são destinadas a uso local. [Usuários da massa inicial](../seed-usuarios-teste.md) · [Evidência da reconstrução](../evidencias/evidencia-ciclo-banco.txt)

## Carga da base exclusiva do Marco Final

1. Com o serviço `db` no ar, crie `gabicake_marco_final` e aplique apenas os scripts de estrutura. Execute o bloco em Bash na raiz do repositório.

   ```bash
   (
       set -e
       docker compose up -d --wait db
       docker compose exec -T db sh -c '
           createdb -U "$POSTGRES_USER" gabicake_marco_final
       '

       for script in db/init/0{1,3,4,5,7,8}-*.sql; do
           docker compose exec -T db sh -c '
               psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d gabicake_marco_final -f -
           ' < "$script"
       done
   )
   ```

2. Defina duas senhas distintas, com 12 a 72 bytes, e execute o script com `psql` 16 ou superior. As senhas são informadas pelo terminal e entram no banco como hashes BCrypt.

   ```bash
   (
       set -e
       read -rs -p 'Senha de demo.marco.gerente: ' DEMO_SENHA_GERENTE
       printf '\n'
       read -rs -p 'Senha de demo.marco.funcionario: ' DEMO_SENHA_FUNCIONARIO
       printf '\n'
       export DEMO_SENHA_GERENTE DEMO_SENHA_FUNCIONARIO

       docker compose exec -T -e DEMO_SENHA_GERENTE -e DEMO_SENHA_FUNCIONARIO db sh -c '
           psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d gabicake_marco_final -f -
       ' < db/seed/09-demonstracao-final.sql
   )
   ```

   Na primeira carga, o script usa a data local de Fortaleza como referência. Uma reaplicação reutiliza a carga quando as duas contas estão ativas com os perfis esperados. [Implementação do seed](../../db/seed/09-demonstracao-final.sql)

3. Verifique as contagens e os perfis. A consulta exibe a quantidade de caracteres do hash.

   ```bash
   docker compose exec -T db sh -c '
       psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d gabicake_marco_final -f -
   ' <<'SQL'
   SELECT (SELECT count(*) FROM cliente) AS clientes,
          (SELECT count(*) FROM produto) AS produtos,
          (SELECT count(*) FROM pedido) AS pedidos,
          (SELECT count(*) FROM item_pedido) AS itens;

   SELECT p.nome AS perfil, u.login, u.ativo, length(u.senha_hash) AS tamanho_hash
   FROM usuario u
   JOIN usuario_perfil up ON up.usuario_id = u.id
   JOIN perfil p ON p.id = up.perfil_id
   ORDER BY p.nome;
   SQL
   ```

   O resultado esperado é 30 clientes, 8 produtos, 84 pedidos e 168 itens. A base exclusiva carrega `demo.marco.gerente` e `demo.marco.funcionario`, ambos ativos e com hash BCrypt de 60 caracteres. [Evidência da carga e dos logins](../evidencias/evidencia-seed-demonstracao-final.txt)

4. Aponte a aplicação para o banco de demonstração.

   ```bash
   POSTGRES_DB=gabicake_marco_final docker compose up -d --build backend frontend
   ```

   Em **Consultar Pedido**, a consulta geral mostra 17 páginas. No dia da primeira carga, o filtro **Hoje** mostra 11 pedidos em 3 páginas. [Roteiro de demonstração](../seed-demonstracao-final.md)