
-- Migration 04: usuários e perfis (autenticação / autorização)
--
-- Cria:   perfil, usuario e usuario_perfil (relação N:N entre os dois).
-- Migra:  os gerentes existentes viram usuários com o perfil GERENTE.
-- Não altera nenhuma tabela existente (gerente, pedido... continuam iguais).
--
-- Perfis (conforme a Matriz de Autorização):
--   GERENTE      pedidos, clientes, agenda e financeiro.
--   FUNCIONARIO  rotina de clientes e pedidos; sem financeiro e configurações.
--   ("Sem login" não é perfil: é a ausência de autenticação.)
--
-- Idempotente e atômico (tudo ou nada). Pode rodar em banco novo (o
-- docker-entrypoint executa db/init em ordem) ou em um banco já existente:
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/init/04-usuarios-perfis.sql
-- Para desfazer: db/rollback/04-usuarios-perfis-rollback.sql

BEGIN;

CREATE TABLE IF NOT EXISTS perfil (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome       VARCHAR(30)  NOT NULL,   -- sem prefixo ROLE_ (o Spring Security o adiciona)
    descricao  VARCHAR(200) NOT NULL,
    CONSTRAINT uq_perfil_nome UNIQUE (nome),
    CONSTRAINT ck_perfil_nome CHECK (nome ~ '^[A-Z][A-Z_]*$'),
    CONSTRAINT ck_perfil_descricao CHECK (length(btrim(descricao)) > 0)
);

CREATE TABLE IF NOT EXISTS usuario (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login       VARCHAR(60)  NOT NULL,   -- minúsculo, sem espaços (o CHECK garante)
    senha_hash  VARCHAR(100) NOT NULL,   -- hash BCrypt (60 chars), nunca a senha pura
    nome        VARCHAR(120) NOT NULL,   -- nome para exibição
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,   -- FALSE bloqueia o login sem apagar o usuário
    gerente_id  INTEGER,                 -- liga o usuário ao registro de gerente (NULL p/ funcionário)
    criado_em   TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT uq_usuario_login   UNIQUE (login),
    CONSTRAINT uq_usuario_gerente UNIQUE (gerente_id),   -- um gerente, no máximo um usuário
    CONSTRAINT fk_usuario_gerente FOREIGN KEY (gerente_id)
        REFERENCES gerente (id) ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT ck_usuario_login      CHECK (login ~ '^[a-z0-9._-]{3,60}$'),
    CONSTRAINT ck_usuario_nome       CHECK (length(btrim(nome)) > 0),
    CONSTRAINT ck_usuario_senha_hash CHECK (senha_hash ~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$')
);

------- USUARIO_PERFIL (N:N) ----------
CREATE TABLE IF NOT EXISTS usuario_perfil (
    usuario_id  INTEGER NOT NULL,
    perfil_id   INTEGER NOT NULL,
    PRIMARY KEY (usuario_id, perfil_id),
    CONSTRAINT fk_usuario_perfil_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuario (id) ON UPDATE CASCADE ON DELETE CASCADE,   -- apagar o usuário apaga os vínculos
    CONSTRAINT fk_usuario_perfil_perfil  FOREIGN KEY (perfil_id)
        REFERENCES perfil (id)  ON UPDATE CASCADE ON DELETE RESTRICT   -- não deixa apagar perfil em uso
);

-- A PK já atende buscas por usuário; este atende "quais usuários têm o perfil X".
CREATE INDEX IF NOT EXISTS idx_usuario_perfil_perfil ON usuario_perfil (perfil_id);

-- ---------- DADOS: perfis ----------
INSERT INTO perfil (nome, descricao) VALUES
 ('GERENTE',     'Gerencia pedidos, clientes, agenda e informações financeiras.'),
 ('FUNCIONARIO', 'Cuida da rotina de clientes e pedidos, sem acesso ao financeiro e às configurações da loja.')
ON CONFLICT (nome) DO NOTHING;

-- ---------- DADOS: gerentes existentes viram usuários ----------
-- login = nome sem acentos, em minúsculas, espaços trocados por ponto
--         (ex.: 'Gabriela Almeida' -> 'gabriela.almeida').
-- O hash BCrypt é copiado de gerente.senha, então as senhas atuais continuam
-- valendo. A partir daqui, usuario.senha_hash é a fonte de verdade para o login.
INSERT INTO usuario (login, senha_hash, nome, gerente_id)
SELECT regexp_replace(
           regexp_replace(
               lower(translate(btrim(g.nome),
                   'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
                   'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN')),
               '\s+', '.', 'g'),
           '[^a-z0-9._-]', '', 'g'),
       g.senha, g.nome, g.id
  FROM gerente g
 WHERE NOT EXISTS (SELECT 1 FROM usuario u WHERE u.gerente_id = g.id);
-- Sem ON CONFLICT de propósito: se dois gerentes gerarem o mesmo login (ex.: 'Ana Lima'
-- e 'ANA LIMA'), a migration falha inteira (rollback) em vez de deixar um gerente sem usuário.
-- O NOT EXISTS acima é o que torna a migration repetível.

INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id
  FROM usuario u
  JOIN perfil p ON p.nome = 'GERENTE'
 WHERE u.gerente_id IS NOT NULL
ON CONFLICT DO NOTHING;

COMMIT;