-- =====================================================================
-- Gabi Cake - Bateria de testes de integridade (FK e UNIQUE)
--
-- Tenta inserir/alterar/apagar registros INVÁLIDOS e confere se o banco
-- recusa cada um com o erro esperado (SQLSTATE e nome da constraint).
--
-- Como rodar (banco com 01-schema.sql e 02-seed.sql aplicados):
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/testes/testes-integridade.sql
--
-- É seguro: cada teste roda em uma subtransação que é desfeita no fim, e o
-- script inteiro termina com ROLLBACK. Nada é gravado no banco.
-- Se algum teste FALHAR, o psql termina com código de saída diferente de 0.
--
-- Códigos SQLSTATE usados:  23503 = violação de chave estrangeira (FK)
--                           23505 = violação de unicidade (UNIQUE / PK)
-- =====================================================================
\set QUIET on
\pset border 1
\pset null '-'
SET client_encoding = 'UTF8';
BEGIN;

CREATE TEMP TABLE resultados (
    ordem     SERIAL,
    id        TEXT,
    teste     TEXT,
    esperado  TEXT,
    obtido    TEXT,
    resultado TEXT
);

-- Executa um comando e compara o erro obtido com o esperado.
--   p_esperado   : '23503', '23505' ou 'OK' (o comando deve ser aceito)
--   p_constraint : nome da constraint que deve aparecer no erro (opcional)
--   p_info       : true = achado informativo; divergência vira ALERTA, não FALHOU
-- Qualquer efeito do comando é desfeito (a subtransação sempre sofre rollback).
CREATE FUNCTION pg_temp.testar(p_id TEXT, p_teste TEXT, p_sql TEXT,
                               p_esperado TEXT, p_constraint TEXT DEFAULT NULL,
                               p_info BOOLEAN DEFAULT FALSE)
RETURNS VOID LANGUAGE plpgsql AS $f$
DECLARE
    v_state  TEXT;
    v_constr TEXT;
    v_obtido TEXT;
    v_res    TEXT;
    v_esp    TEXT := p_esperado || COALESCE(' ' || p_constraint, '');
BEGIN
    BEGIN
        EXECUTE p_sql;
        RAISE EXCEPTION 'comando aceito' USING ERRCODE = 'T0001';  -- força o rollback
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_constr = CONSTRAINT_NAME;
        v_state := SQLSTATE;
    END;

    IF v_state = 'T0001' THEN
        v_obtido := 'aceito pelo banco';
        v_res := CASE WHEN p_esperado = 'OK' THEN 'PASSOU'
                      WHEN p_info THEN 'ALERTA' ELSE 'FALHOU' END;
    ELSE
        v_obtido := v_state || COALESCE(' ' || v_constr, '');
        v_res := CASE WHEN p_esperado = v_state
                           AND (p_constraint IS NULL OR p_constraint = v_constr) THEN 'PASSOU'
                      WHEN p_info THEN 'ALERTA' ELSE 'FALHOU' END;
    END IF;

    INSERT INTO resultados (id, teste, esperado, obtido, resultado)
    VALUES (p_id, p_teste, v_esp, v_obtido, v_res);
END $f$;

-- (as chamadas abaixo não imprimem nada; o relatório vem no final)
\o /dev/null

-- =====================================================================
-- GRUPO 1 - Chave estrangeira (FK): inserir/alterar com referência inexistente
-- =====================================================================
SELECT pg_temp.testar('FK-01', 'INSERT pedido com cliente inexistente',
 $q$ INSERT INTO pedido (cliente_id, data_prevista, forma_entrega)
     VALUES (999999, CURRENT_DATE + 7, 'RETIRADA') $q$,
 '23503', 'fk_pedido_cliente');

SELECT pg_temp.testar('FK-02', 'INSERT pedido com gerente inexistente',
 $q$ INSERT INTO pedido (cliente_id, gerente_id, data_prevista, forma_entrega, status_pedido)
     VALUES ((SELECT min(id) FROM cliente), 999999, CURRENT_DATE + 7, 'RETIRADA', 'CONFIRMADO') $q$,
 '23503', 'fk_pedido_gerente');

SELECT pg_temp.testar('FK-03', 'INSERT item_pedido com pedido inexistente',
 $q$ INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
     VALUES (999999, (SELECT min(id) FROM produto), 1) $q$,
 '23503', 'fk_item_pedido');

SELECT pg_temp.testar('FK-04', 'INSERT item_pedido com produto inexistente',
 $q$ INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
     VALUES ((SELECT min(id) FROM pedido), 999999, 1) $q$,
 '23503', 'fk_item_produto');

SELECT pg_temp.testar('FK-05', 'UPDATE pedido apontando para cliente inexistente',
 $q$ UPDATE pedido SET cliente_id = 999999 WHERE id = (SELECT min(id) FROM pedido) $q$,
 '23503', 'fk_pedido_cliente');

SELECT pg_temp.testar('FK-06', 'UPDATE item_pedido apontando para produto inexistente',
 $q$ UPDATE item_pedido SET produto_id = 999999 WHERE id = (SELECT min(id) FROM item_pedido) $q$,
 '23503', 'fk_item_produto');

-- =====================================================================
-- GRUPO 2 - Chave estrangeira (FK): apagar registro que ainda é referenciado
-- (ON DELETE RESTRICT)
-- =====================================================================
SELECT pg_temp.testar('FK-07', 'DELETE cliente que possui pedidos',
 $q$ DELETE FROM cliente WHERE id = (SELECT cliente_id FROM pedido ORDER BY id LIMIT 1) $q$,
 '23503', 'fk_pedido_cliente');

SELECT pg_temp.testar('FK-08', 'DELETE gerente que confirmou pedidos',
 $q$ DELETE FROM gerente WHERE id = (SELECT gerente_id FROM pedido
                                     WHERE gerente_id IS NOT NULL ORDER BY id LIMIT 1) $q$,
 '23503', 'fk_pedido_gerente');

SELECT pg_temp.testar('FK-09', 'DELETE produto que já foi vendido',
 $q$ DELETE FROM produto WHERE id = (SELECT produto_id FROM item_pedido ORDER BY id LIMIT 1) $q$,
 '23503', 'fk_item_produto');

-- =====================================================================
-- GRUPO 3 - Unicidade (UNIQUE e PRIMARY KEY)
-- =====================================================================
SELECT pg_temp.testar('UQ-01', 'INSERT gerente com nome já existente',
 $q$ INSERT INTO gerente (nome, senha)
     SELECT nome, senha FROM gerente ORDER BY id LIMIT 1 $q$,
 '23505', 'uq_gerente_nome');

SELECT pg_temp.testar('UQ-02', 'INSERT produto com nome já existente',
 $q$ INSERT INTO produto (nome, preco)
     SELECT nome, 10 FROM produto ORDER BY id LIMIT 1 $q$,
 '23505', 'uq_produto_nome');

SELECT pg_temp.testar('UQ-03', 'UPDATE gerente para nome de outro gerente',
 $q$ UPDATE gerente
        SET nome = (SELECT nome FROM gerente ORDER BY id LIMIT 1)
      WHERE id = (SELECT id FROM gerente ORDER BY id OFFSET 1 LIMIT 1) $q$,
 '23505', 'uq_gerente_nome');

SELECT pg_temp.testar('UQ-04', 'UPDATE produto para nome de outro produto',
 $q$ UPDATE produto
        SET nome = (SELECT nome FROM produto ORDER BY id LIMIT 1)
      WHERE id = (SELECT id FROM produto ORDER BY id OFFSET 1 LIMIT 1) $q$,
 '23505', 'uq_produto_nome');

SELECT pg_temp.testar('UQ-05', 'INSERT cliente repetindo um id (chave primária)',
 $q$ INSERT INTO cliente (id, nome, telefone, rua, num_casa, bairro, cep)
     OVERRIDING SYSTEM VALUE
     SELECT id, 'Teste', '(85) 98888-7777', 'Rua A', '1', 'Centro', '60000-000'
       FROM cliente ORDER BY id LIMIT 1 $q$,
 '23505', 'cliente_pkey');

SELECT pg_temp.testar('UQ-06', 'INSERT pedido repetindo um id (chave primária)',
 $q$ INSERT INTO pedido (id, cliente_id, data_prevista, forma_entrega)
     OVERRIDING SYSTEM VALUE
     SELECT id, cliente_id, CURRENT_DATE + 7, 'RETIRADA'
       FROM pedido ORDER BY id LIMIT 1 $q$,
 '23505', 'pedido_pkey');

-- =====================================================================
-- GRUPO 4 - Controles (dados VÁLIDOS devem ser aceitos; prova que os testes
-- acima falham pelo motivo certo e não por outro erro qualquer)
-- =====================================================================
SELECT pg_temp.testar('OK-01', 'INSERT pedido válido é aceito',
 $q$ INSERT INTO pedido (cliente_id, data_prevista, forma_entrega)
     VALUES ((SELECT min(id) FROM cliente), CURRENT_DATE + 7, 'RETIRADA') $q$,
 'OK');

SELECT pg_temp.testar('OK-02', 'INSERT item_pedido válido é aceito',
 $q$ INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
     VALUES ((SELECT min(id) FROM pedido), (SELECT min(id) FROM produto), 1) $q$,
 'OK');

SELECT pg_temp.testar('OK-03', 'DELETE pedido apaga seus itens (ON DELETE CASCADE)',
 $q$ DO $$
     DECLARE v_id INTEGER;
     BEGIN
         SELECT pedido_id INTO v_id FROM item_pedido ORDER BY id LIMIT 1;
         DELETE FROM pedido WHERE id = v_id;
         IF EXISTS (SELECT 1 FROM item_pedido WHERE pedido_id = v_id) THEN
             RAISE EXCEPTION 'os itens do pedido % continuam no banco', v_id;
         END IF;
     END $$ $q$,
 'OK');

-- =====================================================================
-- GRUPO 5 - Achados informativos: situações que o banco ACEITA hoje.
-- Se aceitar, o resultado é ALERTA (não é falha da bateria, mas merece decisão).
-- =====================================================================
SELECT pg_temp.testar('INFO-01', 'gerente com mesmo nome mudando só maiúsculas/minúsculas',
 $q$ INSERT INTO gerente (nome, senha)
     SELECT upper(nome), senha FROM gerente ORDER BY id LIMIT 1 $q$,
 '23505', NULL, TRUE);

SELECT pg_temp.testar('INFO-02', 'produto com mesmo nome + espaço no final',
 $q$ INSERT INTO produto (nome, preco)
     SELECT nome || ' ', 10 FROM produto ORDER BY id LIMIT 1 $q$,
 '23505', NULL, TRUE);

SELECT pg_temp.testar('INFO-03', 'cliente duplicado (mesmo nome e telefone)',
 $q$ INSERT INTO cliente (nome, telefone, rua, num_casa, bairro, cep)
     SELECT nome, telefone, rua, num_casa, bairro, cep FROM cliente ORDER BY id LIMIT 1 $q$,
 '23505', NULL, TRUE);

-- =====================================================================
-- Relatório
-- =====================================================================
\o
\set QUIET off
\echo
\echo '=== Resultado da bateria de testes de integridade ==='
SELECT id, teste, esperado, obtido, resultado FROM resultados ORDER BY ordem;

\echo '=== Resumo ==='
SELECT resultado, count(*) AS qtd FROM resultados GROUP BY resultado ORDER BY resultado;

-- Falha o script (código de saída != 0) se algum teste não passou
DO $$
DECLARE n INTEGER;
BEGIN
    SELECT count(*) INTO n FROM resultados WHERE resultado = 'FALHOU';
    IF n > 0 THEN
        RAISE EXCEPTION '% teste(s) de integridade FALHARAM', n;
    END IF;
END $$;

ROLLBACK;