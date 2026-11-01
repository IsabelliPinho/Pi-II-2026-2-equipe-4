-- =====================================================================
-- Gabi Cake - Migration 05: nenhuma senha em texto puro em gerente.senha
--
-- usuario.senha_hash já só aceita hash BCrypt (ck_usuario_senha_hash, migration 04).
-- gerente.senha, porém, aceitava qualquer texto. Esta migration:
--   1) converte para BCrypt qualquer senha legada que ainda esteja em texto puro;
--   2) cria ck_gerente_senha_hash, para o banco recusar texto puro daqui em diante.
--
-- Idempotente e atômica. Em banco já existente:
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/init/05-senha-hash-gerente.sql
-- Para desfazer:
--   ALTER TABLE gerente DROP CONSTRAINT ck_gerente_senha_hash;
-- =====================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash BCrypt ($2a$, custo 10) para o que não estiver no formato BCrypt.
-- Em um banco que já passou pelo seed, nenhuma linha é afetada.
UPDATE gerente
   SET senha = crypt(senha, gen_salt('bf', 10))
 WHERE senha !~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$';

ALTER TABLE gerente DROP CONSTRAINT IF EXISTS ck_gerente_senha_hash;
ALTER TABLE gerente ADD CONSTRAINT ck_gerente_senha_hash
    CHECK (senha ~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$');

COMMIT;