-- PostgreSQL 16. Executar após 07-requisitos-essenciais.sql.
BEGIN;

-- Impede escritas entre a verificação e a criação dos índices.
LOCK TABLE cliente, gerente, produto IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
    colisao RECORD;
BEGIN
    WITH colisoes AS (
        SELECT 'cliente' AS tabela, array_agg(id ORDER BY id) AS ids
        FROM cliente
        GROUP BY lower(btrim(nome)), telefone
        HAVING count(*) > 1

        UNION ALL

        SELECT 'gerente', array_agg(id ORDER BY id)
        FROM gerente
        GROUP BY lower(btrim(nome))
        HAVING count(*) > 1

        UNION ALL

        SELECT 'produto', array_agg(id ORDER BY id)
        FROM produto
        GROUP BY lower(btrim(nome))
        HAVING count(*) > 1
    )
    SELECT tabela, ids INTO colisao
    FROM colisoes
    ORDER BY tabela, ids[1]
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'Cadastros conflitantes em % (IDs %).', colisao.tabela, colisao.ids
            USING ERRCODE = '23505',
                  HINT = 'Revise os registros e seus vínculos antes de executar novamente a migração.';
    END IF;
END $$;

-- O telefone já tem um formato único por ck_cliente_telefone.
CREATE UNIQUE INDEX IF NOT EXISTS uq_cliente_nome_normalizado_telefone
    ON cliente (lower(btrim(nome)), telefone);

CREATE UNIQUE INDEX IF NOT EXISTS uq_gerente_nome_normalizado
    ON gerente (lower(btrim(nome)));

CREATE UNIQUE INDEX IF NOT EXISTS uq_produto_nome_normalizado
    ON produto (lower(btrim(nome)));

COMMIT;