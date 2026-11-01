-- Desfaz a migration 04. Não mexe em gerente, pedido nem nas demais tabelas.
-- Atenção: apaga TODOS os usuários, perfis e vínculos (inclusive os criados depois da migration).
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/rollback/04-usuarios-perfis-rollback.sql
BEGIN;
DROP TABLE IF EXISTS usuario_perfil;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS perfil;
COMMIT;