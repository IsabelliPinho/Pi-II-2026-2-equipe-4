-- Seed opcional para o Marco Final. Execute com psql 16+ após a migração 08.
\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO public, extensions, pg_temp;
SET LOCAL TIME ZONE 'America/Fortaleza';

-- Serializa aplicações do seed, inclusive quando duas sessões começam juntas.
SELECT pg_advisory_xact_lock(hashtext('gabicake.seed.demonstracao-final'));

WITH contas (login, perfil) AS (
    VALUES ('demo.marco.gerente', 'GERENTE'),
           ('demo.marco.funcionario', 'FUNCIONARIO')
)
SELECT count(u.id) = 0 AS demo_nova,
       count(*) FILTER (WHERE u.ativo
           AND (u.gerente_id IS NOT NULL) = (c.perfil = 'GERENTE')
           AND (SELECT array_agg(p.nome::text)
                FROM usuario_perfil up
                JOIN perfil p ON p.id = up.perfil_id
                WHERE up.usuario_id = u.id) = ARRAY[c.perfil]) = 2 AS demo_existente
FROM contas c
LEFT JOIN usuario u ON u.login = c.login
\gset

\if :demo_nova

\set demo_senha_gerente ''
\set demo_senha_funcionario ''
\getenv demo_senha_gerente DEMO_SENHA_GERENTE
\getenv demo_senha_funcionario DEMO_SENHA_FUNCIONARIO

SELECT octet_length($1::text) BETWEEN 12 AND 72
   AND octet_length($2::text) BETWEEN 12 AND 72
   AND $1 <> $2 AS senhas_validas
\bind :demo_senha_gerente :demo_senha_funcionario
\gset

\if :senhas_validas
\else
DO $$
BEGIN
    RAISE EXCEPTION 'Informe DEMO_SENHA_GERENTE e DEMO_SENHA_FUNCIONARIO distintas, de 12 a 72 bytes.';
END $$;
\endif

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH hashes AS MATERIALIZED (
    SELECT crypt($1::text, gen_salt('bf', 10)) AS gerente,
           crypt($2::text, gen_salt('bf', 10)) AS funcionario
),
nova_gerente AS (
    INSERT INTO gerente (nome, senha)
    SELECT 'Helena Siqueira', h.gerente FROM hashes h
    RETURNING id, nome, senha
),
novos_usuarios AS (
    INSERT INTO usuario (login, nome, senha_hash, gerente_id)
    SELECT 'demo.marco.gerente', g.nome, g.senha, g.id FROM nova_gerente g
    UNION ALL
    SELECT 'demo.marco.funcionario', 'Caio Menezes', h.funcionario, NULL FROM hashes h
    RETURNING id, gerente_id
)
INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id
FROM novos_usuarios u
LEFT JOIN perfil p ON p.nome = CASE WHEN u.gerente_id IS NOT NULL
                                   THEN 'GERENTE' ELSE 'FUNCIONARIO' END
\bind :demo_senha_gerente :demo_senha_funcionario
\g
\unset demo_senha_gerente
\unset demo_senha_funcionario

CREATE TEMP TABLE demo_clientes ON COMMIT DROP AS
WITH enderecos (ordem, rua, bairro, cep) AS (
    VALUES (1, 'Rua das Aroeiras', 'Centro', '63700-901'),
           (2, 'Travessa do Mandacaru', 'Fátima', '63700-902'),
           (3, 'Rua dos Jacarandás', 'São Vicente', '63700-903'),
           (4, 'Avenida dos Ipês', 'Planalto', '63700-904'),
           (5, 'Rua das Carnaúbas', 'Cidade 2000', '63700-905'),
           (6, 'Rua do Açude', 'Maratoan', '63700-906')
),
nomes (ordem, nome) AS (
    VALUES (1, 'Ana Luísa Tavares'), (2, 'Bruno Alencar'), (3, 'Clara Viana'),
           (4, 'Daniel Morais'), (5, 'Elisa Farias'), (6, 'Fábio Nunes'),
           (7, 'Giovana Ribeiro'), (8, 'Hugo Vasconcelos'), (9, 'Isabela Torres'),
           (10, 'Júlio Santana'), (11, 'Lívia Sampaio'), (12, 'Marcelo Batista'),
           (13, 'Nádia Queiroz'), (14, 'Otávio Sales'), (15, 'Paula Azevedo'),
           (16, 'Renato Brito'), (17, 'Sílvia Coelho'), (18, 'Tomás Andrade'),
           (19, 'Valéria Fonseca'), (20, 'Yasmin Rocha'), (21, 'Ana Clara Moreira'),
           (22, 'Breno Freitas'), (23, 'Cecília Lopes'), (24, 'Davi Barros'),
           (25, 'Érica Paiva'), (26, 'Francisco Xavier'), (27, 'Gabriela Ramos'),
           (28, 'Ícaro Duarte'), (29, 'Joana Nascimento'), (30, 'Leandro Matos')
),
contatos AS (
    SELECT n.ordem, n.nome, format('(88) 90000-%s', lpad(n.ordem::text, 4, '0')) AS telefone,
           e.rua, (18 + n.ordem * 13)::text AS num_casa, e.bairro, e.cep
    FROM nomes n
    JOIN enderecos e ON e.ordem = 1 + (n.ordem - 1) % 6
),
novos AS (
    INSERT INTO cliente (nome, telefone, rua, num_casa, bairro, cep)
    SELECT nome, telefone, rua, num_casa, bairro, cep FROM contatos
    RETURNING id, telefone, rua, num_casa, bairro, cep
)
SELECT c.ordem, n.id, n.rua, n.num_casa, n.bairro, n.cep
FROM novos n
JOIN contatos c USING (telefone);

CREATE TEMP TABLE demo_produtos ON COMMIT DROP AS
WITH catalogo (ordem, nome, preco, massa, recheio) AS (
    VALUES (1, 'Bolo de Paçoca com Doce de Leite', 88.00, 'Baunilha', 'Doce de leite com paçoca'),
           (2, 'Bolo de Pistache com Framboesa', 128.00, 'Pistache', 'Creme de framboesa'),
           (3, 'Bolo de Coco com Abacaxi', 92.00, 'Coco', 'Creme de abacaxi'),
           (4, 'Torta Banoffee', 78.00, 'Biscoito amanteigado', 'Banana com doce de leite'),
           (5, 'Brigadeiro de Café', 3.20, NULL, NULL),
           (6, 'Mini Brownie com Nozes', 5.80, NULL, NULL),
           (7, 'Cupcake de Baunilha', 8.50, NULL, NULL),
           (8, 'Trufa de Maracujá', 4.50, NULL, NULL)
),
novos AS (
    INSERT INTO produto (nome, preco)
    SELECT nome, preco FROM catalogo
    RETURNING id, nome
)
SELECT c.ordem, n.id, c.massa, c.recheio
FROM novos n
JOIN catalogo c USING (nome);

-- Doze pedidos por status. Os pedidos abertos cobrem hoje e os próximos dias.
WITH status (ordem, nome, encerrado) AS (
    VALUES (0, 'PENDENTE', FALSE), (1, 'CONFIRMADO', FALSE),
           (2, 'EM_PRODUCAO', FALSE), (3, 'PRONTO', FALSE),
           (4, 'ENTREGUE', TRUE), (5, 'ATENDIDO', TRUE), (6, 'CANCELADO', TRUE)
),
agenda AS (
    SELECT s.numero, st.nome AS status_pedido,
           CURRENT_DATE + CASE WHEN st.encerrado THEN -2 * ((s.numero - 1) / 7)
                               ELSE ((s.numero - 1) / 7) % 7 END AS dia,
           time '09:00' + ((s.numero - 1) % 9) * interval '1 hour' AS horario,
           s.numero % 2 = 0 AS entrega
    FROM generate_series(1, 84) AS s(numero)
    JOIN status st ON st.ordem = (s.numero - 1) % 7
),
responsavel AS (
    SELECT g.id, g.nome
    FROM gerente g
    JOIN usuario u ON u.gerente_id = g.id
    WHERE u.login = 'demo.marco.gerente'
),
novos_pedidos AS (
    INSERT INTO pedido (
        cliente_id, gerente_id, nome_gerente, data_pedido, data_prevista, data_entrega,
        atualizado_em, status_pedido, forma_entrega, desconto,
        entrega_rua, entrega_num_casa, entrega_bairro, entrega_cep
    )
    SELECT c.id,
           CASE WHEN a.status_pedido NOT IN ('PENDENTE', 'CANCELADO') THEN g.id END,
           CASE WHEN a.status_pedido NOT IN ('PENDENTE', 'CANCELADO') THEN g.nome END,
           least(a.dia, CURRENT_DATE) - (1 + a.numero % 10),
           a.dia + a.horario,
           CASE WHEN a.status_pedido IN ('ENTREGUE', 'ATENDIDO') THEN a.dia END,
           least(a.dia + a.horario, LOCALTIMESTAMP),
           a.status_pedido,
           CASE WHEN a.entrega THEN 'ENTREGA' ELSE 'RETIRADA' END,
           CASE WHEN a.numero % 9 = 0 THEN 12.50 ELSE 0.00 END,
           CASE WHEN a.entrega THEN c.rua END,
           CASE WHEN a.entrega THEN c.num_casa END,
           CASE WHEN a.entrega THEN c.bairro END,
           CASE WHEN a.entrega THEN c.cep END
    FROM agenda a
    JOIN pg_temp.demo_clientes c ON c.ordem = 1 + (a.numero - 1) % 30
    CROSS JOIN responsavel g
    ORDER BY a.numero
    RETURNING id
),
pedidos_numerados AS (
    SELECT id, row_number() OVER (ORDER BY id)::integer AS ordem
    FROM novos_pedidos
)
INSERT INTO item_pedido (pedido_id, produto_id, quantidade, tema, peso, tipo_massa, tipo_recheio)
SELECT p.id, c.id,
       CASE WHEN c.ordem <= 4 THEN 1 ELSE 6 * (1 + p.ordem % 4) END,
       CASE WHEN c.ordem <= 3 THEN (ARRAY['Aniversário', 'Floral', 'Chá de bebê',
                                           'Formatura', 'Festa junina'])[1 + p.ordem % 5] END,
       CASE WHEN c.ordem <= 4 THEN 2.0 + 0.5 * (p.ordem % 5) END,
       c.massa, c.recheio
FROM pedidos_numerados p
JOIN pg_temp.demo_produtos c
  ON c.ordem IN (1 + (p.ordem - 1) % 4, 5 + ((p.ordem - 1) / 3) % 4);

\elif :demo_existente
\echo 'As duas contas do Marco Final já existem. Carga preservada.'
\else
DO $$
BEGIN
    RAISE EXCEPTION 'As contas do Marco Final estão incompletas ou com perfis diferentes dos esperados.';
END $$;
\endif

COMMIT;