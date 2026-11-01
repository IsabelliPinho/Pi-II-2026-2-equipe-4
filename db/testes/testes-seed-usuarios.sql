
-- Gabi Cake - Testes do seed de usuários e da massa de dados
--
-- Confere que o ambiente de banco está pronto para a equipe testar e avaliar:
--   Parte 1: existe usuário válido (ativo, com senha em hash) para TODOS os perfis,
--            além de um usuário inativo para testar a recusa de login.
--   Parte 2: a massa de dados (clientes, produtos, pedidos...) está populada.
--
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/testes/testes-seed-usuarios.sql
--
-- Não grava nada (termina com ROLLBACK). Se algum teste FALHAR, o psql sai com
-- código diferente de 0.

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

-- Usuário de teste existe, tem exatamente o perfil dado e o estado (ativo) esperado.
CREATE FUNCTION pg_temp.usuario_ok(p_login TEXT, p_perfil TEXT, p_ativo BOOLEAN) RETURNS BOOLEAN
LANGUAGE sql AS $f$
    SELECT EXISTS (
        SELECT 1
          FROM usuario u
          JOIN usuario_perfil up ON up.usuario_id = u.id
          JOIN perfil p          ON p.id = up.perfil_id
         WHERE u.login = p_login AND p.nome = p_perfil AND u.ativo = p_ativo);
$f$;

\o /dev/null

-- =====================================================================
-- PARTE 1 - Usuários de teste
-- =====================================================================
SELECT pg_temp.afirmar('USR-01', 'todo perfil tem ao menos um usuário ATIVO',
    NOT EXISTS (SELECT 1 FROM perfil p WHERE NOT EXISTS (
        SELECT 1 FROM usuario_perfil up JOIN usuario u ON u.id = up.usuario_id
         WHERE up.perfil_id = p.id AND u.ativo))
    AND (SELECT count(*) FROM perfil) >= 2);

SELECT pg_temp.afirmar('USR-02', 'GERENTE: gabriela.almeida existe e está ativa',
    pg_temp.usuario_ok('gabriela.almeida', 'GERENTE', TRUE));

SELECT pg_temp.afirmar('USR-03', 'FUNCIONARIO: marina.costa e paulo.ribeiro existem e estão ativos',
    pg_temp.usuario_ok('marina.costa', 'FUNCIONARIO', TRUE) AND pg_temp.usuario_ok('paulo.ribeiro', 'FUNCIONARIO', TRUE));

SELECT pg_temp.afirmar('USR-04', 'existe um usuário INATIVO (renata.dias) para testar a recusa de login',
    pg_temp.usuario_ok('renata.dias', 'FUNCIONARIO', FALSE));

SELECT pg_temp.afirmar('USR-05', 'todas as senhas estão em hash BCrypt com custo 10 ou mais',
    NOT EXISTS (SELECT 1 FROM usuario
                 WHERE senha_hash !~ '^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$'
                    OR substring(senha_hash from 5 for 2)::int < 10));

SELECT pg_temp.afirmar('USR-06', 'todos os usuários de demonstração validam a senha Senha@123',
    (SELECT bool_and(crypt('Senha@123', senha_hash) = senha_hash) FROM usuario));

SELECT pg_temp.afirmar('USR-07', 'nenhum hash se repete (salt próprio em cada usuário)',
    (SELECT count(DISTINCT senha_hash) = count(*) FROM usuario));

SELECT pg_temp.afirmar('USR-08', 'gerentes têm gerente_id; funcionários não têm',
    NOT EXISTS (SELECT 1 FROM usuario u JOIN usuario_perfil up ON up.usuario_id = u.id
                  JOIN perfil p ON p.id = up.perfil_id
                 WHERE (p.nome = 'GERENTE' AND u.gerente_id IS NULL)
                    OR (p.nome = 'FUNCIONARIO' AND u.gerente_id IS NOT NULL)));

SELECT pg_temp.afirmar('USR-09', 'nenhum usuário está sem perfil',
    NOT EXISTS (SELECT 1 FROM usuario u WHERE NOT EXISTS (SELECT 1 FROM usuario_perfil up WHERE up.usuario_id = u.id)));

-- =====================================================================
-- PARTE 2 - Massa de dados
-- =====================================================================
SELECT pg_temp.afirmar('DAD-01', 'ao menos 10 linhas em cliente, gerente, produto, pedido e item_pedido',
    (SELECT count(*) FROM cliente) >= 10 AND (SELECT count(*) FROM gerente) >= 10
    AND (SELECT count(*) FROM produto) >= 10 AND (SELECT count(*) FROM pedido) >= 10
    AND (SELECT count(*) FROM item_pedido) >= 10);

SELECT pg_temp.afirmar('DAD-02', 'todos os status de pedido aparecem na massa',
    (SELECT count(DISTINCT status_pedido) FROM pedido
      WHERE status_pedido IN ('PENDENTE','CONFIRMADO','EM_PRODUCAO','PRONTO','ENTREGUE','CANCELADO')) = 6);

SELECT pg_temp.afirmar('DAD-03', 'as duas formas de entrega aparecem (RETIRADA e ENTREGA)',
    (SELECT count(DISTINCT forma_entrega) FROM pedido WHERE forma_entrega IN ('RETIRADA','ENTREGA')) = 2);

SELECT pg_temp.afirmar('DAD-04', 'todo pedido tem ao menos um item',
    NOT EXISTS (SELECT 1 FROM pedido p WHERE NOT EXISTS (SELECT 1 FROM item_pedido i WHERE i.pedido_id = p.id)));

\o
\set QUIET off
\echo
\echo '=== Resultado: seed de usuários e massa de dados ==='
SELECT id, teste, resultado FROM resultados ORDER BY ordem;

\echo '=== Resumo ==='
SELECT resultado, count(*) AS qtd FROM resultados GROUP BY resultado ORDER BY resultado;

DO $$
DECLARE n INTEGER;
BEGIN
    SELECT count(*) INTO n FROM resultados WHERE resultado = 'FALHOU';
    IF n > 0 THEN RAISE EXCEPTION '% teste(s) FALHARAM', n; END IF;
END $$;

ROLLBACK;