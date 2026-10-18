-- =====================================================================
-- Gabi Cake - Índices de busca (PostgreSQL 16)
-- Roda depois de 01-schema.sql e 02-seed.sql (ordem alfabética do initdb).
-- Idempotente: pode ser executado de novo em um banco já existente:
--   docker compose exec -T db psql -U gabicake -d gabicake < db/init/03-indices.sql
--
-- Os índices de chave estrangeira e de status/data do pedido já são criados
-- no final do 01-schema.sql. Aqui ficam os que faltavam para a busca de
-- clientes (GET /clientes/busca). Veja a justificativa completa em
-- docs/estrategia-indexacao.md.
-- =====================================================================

-- pg_trgm: permite índice para LIKE '%trecho%' (um B-tree comum não ajuda
-- quando o padrão começa com curinga).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ClienteRepository.findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCase
-- O Spring Data/Hibernate gera:  upper(nome) LIKE upper(?) OR upper(telefone) LIKE upper(?)
-- Por isso o índice é sobre a EXPRESSÃO upper(coluna): sem isso o planner o ignora.
-- A API só aceita busca com 3+ caracteres (ClienteService), que é o mínimo
-- para o trigrama ser efetivo.
CREATE INDEX IF NOT EXISTS idx_cliente_nome_trgm
    ON cliente USING gin (upper(nome) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_cliente_telefone_trgm
    ON cliente USING gin (upper(telefone) gin_trgm_ops);

ANALYZE cliente;