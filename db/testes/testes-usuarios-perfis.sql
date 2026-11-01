
-- Testes da migration 04 (usuários e perfis)
--
-- Parte 1: confere o resultado da migration (perfis criados, gerentes migrados).
-- Parte 2: tenta gravar dados INVÁLIDOS e confere se o banco recusa com o erro
--          esperado (FK, UNIQUE, CHECK, NOT NULL), e se dados válidos passam.
--
-- Como rodar (banco com 01 a 04 aplicados):
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/testes/testes-usuarios-perfis.sql
--
-- É seguro: cada caso roda em subtransação desfeita no fim e o script termina com
-- ROLLBACK. Se algum teste FALHAR, o psql sai com código diferente de 0.
--
-- SQLSTATE: 23503 FK | 23505 UNIQUE/PK | 23514 CHECK | 23502 NOT NULL

\set QUIET on
\pset border 1
\pset null '-'
SET client_encoding = 'UTF8';
BEGIN;

CREATE TEMP TABLE resultados (
    ordem SERIAL, id TEXT, teste TEXT, esperado TEXT, obtido TEXT, resultado TEXT
);

-- Executa um comando e compara o erro obtido com o esperado.
--   p_esperado: SQLSTATE esperado ou 'OK' (o comando deve ser aceito)
--   p_constraint: nome da constraint que deve aparecer no erro (opcional)
-- O efeito do comando é sempre desfeito.
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
                           AND (p_constraint IS NULL OR p_constraint = v_constr) THEN 'PASSOU'
                      ELSE 'FALHOU' END;
    END IF;
    INSERT INTO resultados (id, teste, esperado, obtido, resultado)
    VALUES (p_id, p_teste, v_esp, v_obtido, v_res);
END $f$;

-- Registra uma afirmação sobre o estado do banco (usada na parte 1).
CREATE FUNCTION pg_temp.afirmar(p_id TEXT, p_teste TEXT, p_ok BOOLEAN)
RETURNS VOID LANGUAGE sql AS $f$
    INSERT INTO resultados (id, teste, esperado, obtido, resultado)
    VALUES (p_id, p_teste, 'verdadeiro', CASE WHEN p_ok THEN 'verdadeiro' ELSE 'falso' END,
            CASE WHEN p_ok THEN 'PASSOU' ELSE 'FALHOU' END);
$f$;

\o /dev/null

-- PARTE 1 - Resultado da migration

SELECT pg_temp.afirmar('MIG-01', 'perfis GERENTE e FUNCIONARIO existem',
    (SELECT count(*) = 2 FROM perfil WHERE nome IN ('GERENTE', 'FUNCIONARIO')));

SELECT pg_temp.afirmar('MIG-02', 'todo gerente virou usuário (1 para 1)',
    (SELECT count(*) FROM gerente) = (SELECT count(*) FROM usuario WHERE gerente_id IS NOT NULL)
    AND NOT EXISTS (SELECT 1 FROM gerente g WHERE NOT EXISTS (SELECT 1 FROM usuario u WHERE u.gerente_id = g.id)));

SELECT pg_temp.afirmar('MIG-03', 'todo usuário vindo de gerente tem o perfil GERENTE',
    NOT EXISTS (SELECT 1 FROM usuario u WHERE u.gerente_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM usuario_perfil up JOIN perfil p ON p.id = up.perfil_id
         WHERE up.usuario_id = u.id AND p.nome = 'GERENTE')));

SELECT pg_temp.afirmar('MIG-04', 'o hash de senha foi copiado sem alteração',
    NOT EXISTS (SELECT 1 FROM usuario u JOIN gerente g ON g.id = u.gerente_id WHERE u.senha_hash <> g.senha));

SELECT pg_temp.afirmar('MIG-05', 'nenhum usuário está sem perfil',
    NOT EXISTS (SELECT 1 FROM usuario u WHERE NOT EXISTS (SELECT 1 FROM usuario_perfil up WHERE up.usuario_id = u.id)));

-- PARTE 2a - Chave estrangeira (FK)

SELECT pg_temp.testar('FK-01', 'vincular perfil a usuário inexistente',
 $q$ INSERT INTO usuario_perfil (usuario_id, perfil_id)
     VALUES (999999, (SELECT min(id) FROM perfil)) $q$,
 '23503', 'fk_usuario_perfil_usuario');

SELECT pg_temp.testar('FK-02', 'vincular usuário a perfil inexistente',
 $q$ INSERT INTO usuario_perfil (usuario_id, perfil_id)
     VALUES ((SELECT min(id) FROM usuario), 999999) $q$,
 '23503', 'fk_usuario_perfil_perfil');

SELECT pg_temp.testar('FK-03', 'criar usuário ligado a gerente inexistente',
 $q$ INSERT INTO usuario (login, senha_hash, nome, gerente_id)
     VALUES ('novo.usuario', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'Novo Usuario', 999999) $q$,
 '23503', 'fk_usuario_gerente');

SELECT pg_temp.testar('FK-04', 'UPDATE do vínculo apontando para perfil inexistente',
 $q$ UPDATE usuario_perfil SET perfil_id = 999999
      WHERE usuario_id = (SELECT min(id) FROM usuario) $q$,
 '23503', 'fk_usuario_perfil_perfil');

SELECT pg_temp.testar('FK-05', 'apagar perfil que está em uso',
 $q$ DELETE FROM perfil WHERE nome = 'GERENTE' $q$,
 '23503', 'fk_usuario_perfil_perfil');

SELECT pg_temp.testar('FK-06', 'apagar gerente que já tem usuário',
 $q$ DO $$
     DECLARE v_g INTEGER;
     BEGIN
         INSERT INTO gerente (nome, senha)
         VALUES ('Gerente Sem Pedidos', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1))
         RETURNING id INTO v_g;
         INSERT INTO usuario (login, senha_hash, nome, gerente_id)
         VALUES ('gerente.sem.pedidos', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'Gerente Sem Pedidos', v_g);
         DELETE FROM gerente WHERE id = v_g;
     END $$ $q$,
 '23503', 'fk_usuario_gerente');

-- PARTE 2b - Unicidade (UNIQUE e PK)

SELECT pg_temp.testar('UQ-01', 'perfil com nome já existente',
 $q$ INSERT INTO perfil (nome, descricao) VALUES ('GERENTE', 'duplicado') $q$,
 '23505', 'uq_perfil_nome');

SELECT pg_temp.testar('UQ-02', 'usuário com login já existente',
 $q$ INSERT INTO usuario (login, senha_hash, nome)
     SELECT login, senha_hash, 'Outro Nome' FROM usuario ORDER BY id LIMIT 1 $q$,
 '23505', 'uq_usuario_login');

SELECT pg_temp.testar('UQ-03', 'dois usuários para o mesmo gerente',
 $q$ INSERT INTO usuario (login, senha_hash, nome, gerente_id)
     SELECT 'outro.login', senha_hash, 'Outro Nome', gerente_id FROM usuario
      WHERE gerente_id IS NOT NULL ORDER BY id LIMIT 1 $q$,
 '23505', 'uq_usuario_gerente');

SELECT pg_temp.testar('UQ-04', 'mesmo perfil vinculado duas vezes ao mesmo usuário',
 $q$ INSERT INTO usuario_perfil (usuario_id, perfil_id)
     SELECT usuario_id, perfil_id FROM usuario_perfil ORDER BY usuario_id LIMIT 1 $q$,
 '23505', 'usuario_perfil_pkey');

SELECT pg_temp.testar('UQ-05', 'UPDATE do login para o de outro usuário',
 $q$ UPDATE usuario SET login = (SELECT login FROM usuario ORDER BY id LIMIT 1)
      WHERE id = (SELECT id FROM usuario ORDER BY id OFFSET 1 LIMIT 1) $q$,
 '23505', 'uq_usuario_login');

-- PARTE 2c - CHECK e NOT NULL

SELECT pg_temp.testar('CK-01', 'login com letras maiúsculas',
 $q$ INSERT INTO usuario (login, senha_hash, nome)
     VALUES ('GABRIELA.ALMEIDA', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'X Y') $q$,
 '23514', 'ck_usuario_login');

SELECT pg_temp.testar('CK-02', 'login com espaço',
 $q$ INSERT INTO usuario (login, senha_hash, nome)
     VALUES ('maria silva', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'Maria Silva') $q$,
 '23514', 'ck_usuario_login');

SELECT pg_temp.testar('CK-03', 'login curto demais (2 caracteres)',
 $q$ INSERT INTO usuario (login, senha_hash, nome)
     VALUES ('ab', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'Ab') $q$,
 '23514', 'ck_usuario_login');

SELECT pg_temp.testar('CK-04', 'senha gravada em texto puro (sem hash)',
 $q$ INSERT INTO usuario (login, senha_hash, nome) VALUES ('texto.puro', 'Senha@123', 'Texto Puro') $q$,
 '23514', 'ck_usuario_senha_hash');

SELECT pg_temp.testar('CK-05', 'nome de perfil em minúsculas',
 $q$ INSERT INTO perfil (nome, descricao) VALUES ('gerente_geral', 'teste') $q$,
 '23514', 'ck_perfil_nome');

SELECT pg_temp.testar('CK-06', 'nome do usuário só com espaços',
 $q$ INSERT INTO usuario (login, senha_hash, nome)
     VALUES ('nome.vazio', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), '   ') $q$,
 '23514', 'ck_usuario_nome');

SELECT pg_temp.testar('NN-01', 'usuário sem senha (NOT NULL)',
 $q$ INSERT INTO usuario (login, senha_hash, nome) VALUES ('sem.senha', NULL, 'Sem Senha') $q$,
 '23502');

-- PARTE 2d - Controles: dados válidos devem ser aceitos

SELECT pg_temp.testar('OK-01', 'criar funcionário válido (sem gerente) com perfil FUNCIONARIO',
 $q$ DO $$
     DECLARE v_u INTEGER;
     BEGIN
         INSERT INTO usuario (login, senha_hash, nome)
         VALUES ('func.teste', (SELECT senha_hash FROM usuario ORDER BY id LIMIT 1), 'Funcionário Teste')
         RETURNING id INTO v_u;
         INSERT INTO usuario_perfil (usuario_id, perfil_id)
         VALUES (v_u, (SELECT id FROM perfil WHERE nome = 'FUNCIONARIO'));
     END $$ $q$,
 'OK');

SELECT pg_temp.testar('OK-02', 'apagar usuário apaga seus vínculos (ON DELETE CASCADE)',
 $q$ DO $$
     DECLARE v_u INTEGER;
     BEGIN
         SELECT usuario_id INTO v_u FROM usuario_perfil ORDER BY usuario_id LIMIT 1;
         DELETE FROM usuario WHERE id = v_u;
         IF EXISTS (SELECT 1 FROM usuario_perfil WHERE usuario_id = v_u) THEN
             RAISE EXCEPTION 'os vínculos do usuário % continuam no banco', v_u;
         END IF;
     END $$ $q$,
 'OK');

SELECT pg_temp.testar('OK-03', 'um usuário pode ter dois perfis (relação N:N)',
 $q$ INSERT INTO usuario_perfil (usuario_id, perfil_id)
     SELECT up.usuario_id, p.id FROM usuario_perfil up JOIN perfil p ON p.nome = 'FUNCIONARIO'
      ORDER BY up.usuario_id LIMIT 1 $q$,
 'OK');

-- Relatório

\o
\set QUIET off
\echo
\echo '=== Resultado: migration 04 (usuários e perfis) ==='
SELECT id, teste, esperado, obtido, resultado FROM resultados ORDER BY ordem;

\echo '=== Resumo ==='
SELECT resultado, count(*) AS qtd FROM resultados GROUP BY resultado ORDER BY resultado;

DO $$
DECLARE n INTEGER;
BEGIN
    SELECT count(*) INTO n FROM resultados WHERE resultado = 'FALHOU';
    IF n > 0 THEN
        RAISE EXCEPTION '% teste(s) FALHARAM', n;
    END IF;
END $$;

ROLLBACK;