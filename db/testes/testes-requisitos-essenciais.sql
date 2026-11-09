-- PostgreSQL 16.
-- Executar após db/init/01 a 07.
-- Não deixa dados de teste.

BEGIN;

DO $$
DECLARE
    cliente_teste INTEGER;
    pedido_teste INTEGER;
    usuario_teste INTEGER;
BEGIN
    INSERT INTO cliente(
        nome, telefone, rua, num_casa, bairro, cep
    )
    VALUES (
        'Teste persistência',
        '(88) 99999-1111',
        'Rua teste',
        '10',
        'Centro',
        '63000-000'
    )
    RETURNING id INTO cliente_teste;

    INSERT INTO pedido(
        cliente_id,
        nome_gerente,
        data_prevista,
        forma_entrega,
        desconto
    )
    VALUES (
        cliente_teste,
        'Gerente teste',
        '2027-03-10 15:45:00',
        'RETIRADA',
        5.50
    )
    RETURNING id INTO pedido_teste;

    IF NOT EXISTS (
        SELECT 1
        FROM pedido
        WHERE id = pedido_teste
          AND data_prevista = TIMESTAMP '2027-03-10 15:45:00'
          AND desconto = 5.50
          AND data_pedido IS NOT NULL
          AND atualizado_em IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Falha de persistência dos campos do pedido';
    END IF;

    UPDATE pedido
    SET status_pedido = 'ATENDIDO',
        data_entrega = CURRENT_DATE
    WHERE id = pedido_teste;

    BEGIN
        UPDATE pedido
        SET desconto = -1
        WHERE id = pedido_teste;

        RAISE EXCEPTION 'Desconto negativo foi aceito';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    BEGIN
        UPDATE pedido
        SET data_entrega = NULL
        WHERE id = pedido_teste;

        RAISE EXCEPTION 'ATENDIDO sem data de entrega foi aceito';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    BEGIN
        INSERT INTO configuracao_loja(
            id, endereco_loja, raio_entrega_km
        )
        VALUES (2, 'Rua teste', 5);

        RAISE EXCEPTION 'Configuração com id diferente de 1 foi aceita';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    BEGIN
        INSERT INTO configuracao_loja(
            id, endereco_loja, raio_entrega_km
        )
        VALUES (1, 'Rua teste', -1)
        ON CONFLICT (id)
        DO UPDATE SET raio_entrega_km = -1;

        RAISE EXCEPTION 'Raio negativo foi aceito';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    SELECT id INTO usuario_teste
    FROM usuario
    ORDER BY id
    LIMIT 1;

    IF usuario_teste IS NULL THEN
        RAISE EXCEPTION 'Execute os seeds de usuários antes do teste';
    END IF;

    BEGIN
        UPDATE usuario
        SET tentativas_falhas = -1
        WHERE id = usuario_teste;

        RAISE EXCEPTION 'Contagem negativa de tentativas foi aceita';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    INSERT INTO sessao(
        usuario_id, token_hash, expira_em
    )
    VALUES (
        usuario_teste,
        repeat('a', 64),
        CURRENT_TIMESTAMP + INTERVAL '1 hour'
    );

    BEGIN
        INSERT INTO sessao(
            usuario_id, token_hash, expira_em
        )
        VALUES (
            usuario_teste,
            'token-em-texto-puro',
            CURRENT_TIMESTAMP + INTERVAL '1 hour'
        );

        RAISE EXCEPTION 'Token que não é hash SHA-256 foi aceito';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    BEGIN
        INSERT INTO sessao(
            usuario_id, token_hash, expira_em
        )
        VALUES (
            usuario_teste,
            repeat('b', 64),
            CURRENT_TIMESTAMP - INTERVAL '1 hour'
        );

        RAISE EXCEPTION 'Sessão com validade anterior à criação foi aceita';
    EXCEPTION
        WHEN check_violation THEN NULL;
    END;

    RAISE NOTICE 'Testes de integridade dos requisitos essenciais passaram.';
END $$;

ROLLBACK;