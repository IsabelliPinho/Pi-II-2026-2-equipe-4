-- =====================================================================
-- Gabi Cake - Esquema físico (PostgreSQL 16), derivado do MER/DER
-- Entidades: CLIENTE, GERENTE, PRODUTO, PEDIDO, ITEM_PEDIDO
-- Relacionamentos: CLIENTE realiza PEDIDO | GERENTE confirma PEDIDO
--                  PEDIDO contém ITEM_PEDIDO | PRODUTO compõe ITEM_PEDIDO
-- =====================================================================

CREATE TABLE cliente (
    id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome      VARCHAR(120) NOT NULL,
    telefone  VARCHAR(20)  NOT NULL,
    rua       VARCHAR(120) NOT NULL,
    num_casa  VARCHAR(10)  NOT NULL,
    bairro    VARCHAR(80)  NOT NULL,
    cep       VARCHAR(9)   NOT NULL,
    CONSTRAINT ck_cliente_nome     CHECK (length(btrim(nome)) > 0),
    CONSTRAINT ck_cliente_telefone CHECK (telefone ~ '^\(\d{2}\) \d{4,5}-\d{4}$'),
    CONSTRAINT ck_cliente_cep      CHECK (cep ~ '^\d{5}-\d{3}$')
);

CREATE TABLE gerente (
    id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome   VARCHAR(120) NOT NULL,
    senha  VARCHAR(100) NOT NULL,  -- guarda o HASH (BCrypt = 60 chars), nunca a senha pura
    CONSTRAINT uq_gerente_nome  UNIQUE (nome),
    CONSTRAINT ck_gerente_nome  CHECK (length(btrim(nome)) > 0)
);

CREATE TABLE produto (
    id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome   VARCHAR(120)   NOT NULL,
    preco  NUMERIC(10, 2) NOT NULL,
    CONSTRAINT uq_produto_nome  UNIQUE (nome),
    CONSTRAINT ck_produto_preco CHECK (preco > 0)
);

CREATE TABLE pedido (
    id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id        INTEGER      NOT NULL,
    gerente_id        INTEGER,                       -- NULL até um gerente confirmar
    data_prevista     DATE         NOT NULL,
    data_entrega      DATE,                          -- preenchida só quando ENTREGUE
    status_pedido     VARCHAR(20)  NOT NULL DEFAULT 'PENDENTE',
    forma_entrega     VARCHAR(10)  NOT NULL,
    entrega_rua       VARCHAR(120),
    entrega_num_casa  VARCHAR(10),
    entrega_bairro    VARCHAR(80),
    entrega_cep       VARCHAR(9),

    CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id)
        REFERENCES cliente (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pedido_gerente FOREIGN KEY (gerente_id)
        REFERENCES gerente (id) ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT ck_pedido_status CHECK (status_pedido IN
        ('PENDENTE','CONFIRMADO','EM_PRODUCAO','PRONTO','ENTREGUE','CANCELADO')),
    CONSTRAINT ck_pedido_forma  CHECK (forma_entrega IN ('RETIRADA','ENTREGA')),
    CONSTRAINT ck_pedido_cep    CHECK (entrega_cep IS NULL OR entrega_cep ~ '^\d{5}-\d{3}$'),

    -- entrega a domicílio exige endereço completo de entrega
    CONSTRAINT ck_pedido_endereco CHECK (
        forma_entrega <> 'ENTREGA'
        OR (entrega_rua IS NOT NULL AND entrega_num_casa IS NOT NULL
            AND entrega_bairro IS NOT NULL AND entrega_cep IS NOT NULL)),

    -- data_entrega existe se, e somente se, o pedido está ENTREGUE
    CONSTRAINT ck_pedido_data_entrega CHECK (
        (status_pedido = 'ENTREGUE') = (data_entrega IS NOT NULL)),

    -- só PENDENTE/CANCELADO podem ficar sem gerente responsável
    CONSTRAINT ck_pedido_gerente CHECK (
        status_pedido IN ('PENDENTE','CANCELADO') OR gerente_id IS NOT NULL)
);

CREATE TABLE item_pedido (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id     INTEGER      NOT NULL,
    produto_id    INTEGER      NOT NULL,
    quantidade    INTEGER      NOT NULL DEFAULT 1,
    tema          VARCHAR(80),                -- só para itens personalizados (bolos)
    peso          NUMERIC(6, 3),              -- kg
    tipo_massa    VARCHAR(60),
    tipo_recheio  VARCHAR(60),

    CONSTRAINT fk_item_pedido  FOREIGN KEY (pedido_id)
        REFERENCES pedido (id)  ON UPDATE CASCADE ON DELETE CASCADE,   -- apagou o pedido, some os itens
    CONSTRAINT fk_item_produto FOREIGN KEY (produto_id)
        REFERENCES produto (id) ON UPDATE CASCADE ON DELETE RESTRICT,  -- produto vendido não pode sumir

    CONSTRAINT ck_item_quantidade CHECK (quantidade > 0),
    CONSTRAINT ck_item_peso       CHECK (peso IS NULL OR peso > 0)
);

-- O PostgreSQL NÃO cria índice automático para FK: criamos para acelerar JOINs
CREATE INDEX idx_pedido_cliente      ON pedido (cliente_id);
CREATE INDEX idx_pedido_gerente      ON pedido (gerente_id);
CREATE INDEX idx_pedido_status_data  ON pedido (status_pedido, data_prevista);
CREATE INDEX idx_item_pedido_pedido  ON item_pedido (pedido_id);
CREATE INDEX idx_item_pedido_produto ON item_pedido (produto_id);