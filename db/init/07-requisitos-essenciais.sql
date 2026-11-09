-- PostgreSQL 16.
-- Executar após 01 a 06.
-- Migração atômica e repetível.

BEGIN;

ALTER TABLE pedido
    ALTER COLUMN data_prevista TYPE TIMESTAMP
        USING data_prevista::timestamp,
    ADD COLUMN IF NOT EXISTS nome_gerente VARCHAR(120),
    ADD COLUMN IF NOT EXISTS data_pedido DATE
        NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS desconto NUMERIC(10,2)
        NOT NULL DEFAULT 0;

UPDATE pedido p
SET nome_gerente = g.nome
FROM gerente g
WHERE p.gerente_id = g.id
  AND p.nome_gerente IS NULL;

ALTER TABLE pedido
    DROP CONSTRAINT IF EXISTS ck_pedido_status;

ALTER TABLE pedido
    ADD CONSTRAINT ck_pedido_status CHECK (
        status_pedido IN (
            'PENDENTE',
            'CONFIRMADO',
            'EM_PRODUCAO',
            'PRONTO',
            'ENTREGUE',
            'ATENDIDO',
            'CANCELADO'
        )
    );

ALTER TABLE pedido
    DROP CONSTRAINT IF EXISTS ck_pedido_data_entrega;

ALTER TABLE pedido
    ADD CONSTRAINT ck_pedido_data_entrega CHECK (
        (status_pedido IN ('ENTREGUE', 'ATENDIDO'))
        = (data_entrega IS NOT NULL)
    );

ALTER TABLE pedido
    DROP CONSTRAINT IF EXISTS ck_pedido_gerente;

ALTER TABLE pedido
    ADD CONSTRAINT ck_pedido_gerente CHECK (
        status_pedido IN ('PENDENTE', 'CANCELADO')
        OR gerente_id IS NOT NULL
        OR (
            status_pedido = 'ATENDIDO'
            AND length(btrim(nome_gerente)) > 0
            AND nome_gerente IS NOT NULL
        )
    );

ALTER TABLE pedido
    DROP CONSTRAINT IF EXISTS ck_pedido_desconto;

ALTER TABLE pedido
    ADD CONSTRAINT ck_pedido_desconto CHECK (desconto >= 0);

CREATE TABLE IF NOT EXISTS configuracao_loja (
    id INTEGER PRIMARY KEY DEFAULT 1
        CHECK (id = 1),

    endereco_loja VARCHAR(300) NOT NULL
        CHECK (length(btrim(endereco_loja)) > 0),

    latitude NUMERIC(9,6)
        CHECK (latitude BETWEEN -90 AND 90),

    longitude NUMERIC(9,6)
        CHECK (longitude BETWEEN -180 AND 180),

    raio_entrega_km NUMERIC(8,3) NOT NULL
        CHECK (raio_entrega_km > 0),

    antecedencia_minima_horas INTEGER NOT NULL DEFAULT 0
        CHECK (antecedencia_minima_horas >= 0),

    url_planilha_financeira VARCHAR(2048),

    CONSTRAINT ck_configuracao_coordenadas CHECK (
        (latitude IS NULL) = (longitude IS NULL)
    )
);

-- A configuração real será cadastrada pela aplicação.
-- Não são inseridos endereço ou URL fictícios.

ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS tentativas_falhas INTEGER
        NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS bloqueado_ate TIMESTAMP;

ALTER TABLE usuario
    DROP CONSTRAINT IF EXISTS ck_usuario_tentativas;

ALTER TABLE usuario
    ADD CONSTRAINT ck_usuario_tentativas CHECK (
        tentativas_falhas >= 0
    );

CREATE TABLE IF NOT EXISTS sessao (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    usuario_id INTEGER NOT NULL
        REFERENCES usuario(id) ON DELETE CASCADE,

    token_hash VARCHAR(64) NOT NULL UNIQUE
        CHECK (token_hash ~ '^[0-9a-f]{64}$'),

    criada_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    ultimo_acesso_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    expira_em TIMESTAMP NOT NULL,
    revogada_em TIMESTAMP,

    CONSTRAINT ck_sessao_prazo CHECK (
        expira_em > criada_em
    ),

    CONSTRAINT ck_sessao_acesso CHECK (
        ultimo_acesso_em >= criada_em
    ),

    CONSTRAINT ck_sessao_revogacao CHECK (
        revogada_em IS NULL
        OR revogada_em >= criada_em
    )
);

CREATE INDEX IF NOT EXISTS idx_sessao_usuario
    ON sessao(usuario_id);

CREATE INDEX IF NOT EXISTS idx_sessao_expiracao
    ON sessao(expira_em);

CREATE INDEX IF NOT EXISTS idx_pedido_agenda_ativa
    ON pedido(data_prevista, id)
    WHERE status_pedido NOT IN (
        'CANCELADO',
        'ATENDIDO',
        'ENTREGUE'
    );

COMMIT;