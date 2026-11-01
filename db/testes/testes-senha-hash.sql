-- =====================================================================
-- Gabi Cake - Testes de armazenamento de senha (hash BCrypt)
--
-- Confere que NENHUMA senha está em texto puro no banco e que o próprio banco
-- recusa texto puro. Cobre as duas tabelas com credencial: usuario e gerente.
--
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/testes/testes-senha-hash.sql
--
-- É seguro: nada é gravado (cada caso é desfeito e o script termina com ROLLBACK).
-- Se algum teste FALHAR, o psql sai com código diferente de 0.
-- SQLSTATE: 23514 = violação de CHECK
-- =====================================================================
\set QUIET on
\pset border 1
\pset null '-'
SET client_encoding = 'UTF8';
BEGIN;

CREATE TEMP TABLE resultados (
    ordem SERIAL, id TEXT, teste TEXT, esperado TEXT, obtido TEXT, resultado TEXT
);

CREATE FUNCTION pg_temp.afirmar(p_id TEXT, p_teste TEXT, p_ok BOOLEAN)
RETURNS VOID LANGUAGE sql AS $f$
    INSERT INTO resultados (id, teste, esperado, obtido, resultado)
    VALUES (p_id, p_teste, 'verdadeiro', CASE WHEN p_ok THEN 'verdadeiro' ELSE 'falso' END,
            CASE WHEN p_ok THEN 'PASSOU' ELSE 'FALHOU' END);
$f$;

CREATE FUNCTION pg_temp.testar(p_id TEXT, p_teste TEXT, p_sql TEXT,
                               p_esperado TEXT, p_constraint TEXT DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql AS $f$
DECLARE
    v_state TEXT; v_constr TEXT; v_obtido TEXT; v_res TEXT;
    v_esp TEXT := p_esperado || COALESCE(' ' || p_constraint, '');
BEGIN
    BEGIN
        EXECUTE p_sql;
        RAISE EXCEPTION 'comando aceito' USING ERRCODE = 'T0001';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_constr = CONSTRAINT_NAME;
        v_state := SQLSTATE;
    END;
    IF v_state = 'T0001' THEN
        v_obtido := 'aceito pelo banco';
        v_res := CASE WHEN p_esperado = 'OK' THEN 'PASSOU' ELSE 'FALHOU' END;
    ELSE
        v_obtido := v_state || COALESCE(' ' || v_constr, '');
        v_res := CASE WHEN p_esperado = v_state
                           AND (p_constraint IS NULL OR p_constraint = v_constr) THEN 'PASSOU' ELSE 'FALHOU' END;
    END IF;
    INSERT INTO resultados (id, teste, esperado, obtido, resultado) VALUES (p_id, p_teste, v_esp, v_obtido, v_res);
END $f$;

-- Varre TODAS as colunas de texto do schema public procurando um valor exato.
-- Devolve quantas ocorrências existem (0 = o valor não aparece em lugar nenhum).
CREATE FUNCTION pg_temp.ocorrencias_em_todo_o_banco(p_valor TEXT) RETURNS BIGINT
LANGUAGE plpgsql AS $f$
DECLARE r RECORD; n BIGINT; total BIGINT := 0;
BEGIN
    FOR r IN SELECT table_name, column_name FROM information_schema.columns
              WHERE table_schema = 'public'
                AND data_type IN ('character varying', 'text', 'character')
    LOOP
        EXECUTE format('SELECT count(*) FROM %I WHERE %I = $1', r.table_name, r.column_name)
           INTO n USING p_valor;
        total := total + n;
    END LOOP;
    RETURN total;
END $f$;

\o /dev/null

-- =====================================================================
-- PARTE 1 - O que está gravado hoje
-- =====================================================================
SELECT pg_temp.afirmar('SEG-01', 'usuario.senha_hash: todas as linhas no formato BCrypt',
    NOT EXISTS (SELECT 1 FROM usuario WHERE senha_hash !~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$'));

SELECT pg_temp.afirmar('SEG-02', 'gerente.senha: todas as linhas no formato BCrypt',
    NOT EXISTS (SELECT 1 FROM gerente WHERE senha !~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$'));

SELECT pg_temp.afirmar('SEG-03', 'custo (work factor) mínimo 10 em todos os hashes',
    NOT EXISTS (SELECT 1 FROM usuario WHERE substring(senha_hash from 5 for 2)::int < 10)
    AND NOT EXISTS (SELECT 1 FROM gerente WHERE substring(senha from 5 for 2)::int < 10));

SELECT pg_temp.afirmar('SEG-04', 'salt único: usuários com a MESMA senha têm hashes DIFERENTES',
    (SELECT count(DISTINCT senha_hash) = count(*) FROM usuario WHERE crypt('Senha@123', senha_hash) = senha_hash)
    AND (SELECT count(*) FROM usuario WHERE crypt('Senha@123', senha_hash) = senha_hash) > 1);

SELECT pg_temp.afirmar('SEG-05', 'o hash armazenado valida a senha certa e recusa a errada',
    (SELECT bool_and(crypt('Senha@123', senha_hash) = senha_hash
                 AND crypt('senha-errada', senha_hash) <> senha_hash) FROM usuario));

SELECT pg_temp.afirmar('SEG-06', 'varredura: a senha do seed (Senha@123) não aparece em texto puro em nenhuma coluna',
    pg_temp.ocorrencias_em_todo_o_banco('Senha@123') = 0);

-- =====================================================================
-- PARTE 2 - O banco recusa texto puro
-- =====================================================================
SELECT pg_temp.testar('CK-01', 'INSERT em usuario com senha em texto puro',
 $q$ INSERT INTO usuario (login, senha_hash, nome) VALUES ('texto.puro', 'Senha@123', 'Texto Puro') $q$,
 '23514', 'ck_usuario_senha_hash');

SELECT pg_temp.testar('CK-02', 'INSERT em gerente com senha em texto puro',
 $q$ INSERT INTO gerente (nome, senha) VALUES ('Gerente Texto Puro', 'Senha@123') $q$,
 '23514', 'ck_gerente_senha_hash');

SELECT pg_temp.testar('CK-03', 'UPDATE de usuario.senha_hash para texto puro',
 $q$ UPDATE usuario SET senha_hash = 'minhasenha' WHERE id = (SELECT min(id) FROM usuario) $q$,
 '23514', 'ck_usuario_senha_hash');

SELECT pg_temp.testar('CK-04', 'UPDATE de gerente.senha para texto puro',
 $q$ UPDATE gerente SET senha = 'minhasenha' WHERE id = (SELECT min(id) FROM gerente) $q$,
 '23514', 'ck_gerente_senha_hash');

SELECT pg_temp.testar('CK-05', 'hash truncado (menos de 60 caracteres)',
 $q$ UPDATE usuario SET senha_hash = left(senha_hash, 40) WHERE id = (SELECT min(id) FROM usuario) $q$,
 '23514', 'ck_usuario_senha_hash');

SELECT pg_temp.testar('CK-06', 'hash de outro algoritmo (MD5) é recusado',
 $q$ UPDATE gerente SET senha = md5('Senha@123') WHERE id = (SELECT min(id) FROM gerente) $q$,
 '23514', 'ck_gerente_senha_hash');

SELECT pg_temp.testar('OK-01', 'hash BCrypt válido é aceito (controle)',
 $q$ UPDATE gerente SET senha = crypt('NovaSenha#456', gen_salt('bf', 10)) WHERE id = (SELECT min(id) FROM gerente) $q$,
 'OK');

\o
\set QUIET off
\echo
\echo '=== Resultado: senhas armazenadas com hash BCrypt ==='
SELECT id, teste, esperado, obtido, resultado FROM resultados ORDER BY ordem;

\echo '=== Resumo ==='
SELECT resultado, count(*) AS qtd FROM resultados GROUP BY resultado ORDER BY resultado;

DO $$
DECLARE n INTEGER;
BEGIN
    SELECT count(*) INTO n FROM resultados WHERE resultado = 'FALHOU';
    IF n > 0 THEN RAISE EXCEPTION '% teste(s) FALHARAM', n; END IF;
END $$;

ROLLBACK;