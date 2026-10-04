-- Roda com:  docker compose exec -T db psql -U gabicake -d gabicake < db/verificar.sql
-- (troque gabicake pelos valores de POSTGRES_USER e POSTGRES_DB do seu .env, se forem diferentes)

\echo '== 1) Quantidade de linhas por tabela (mínimo 10) =='
SELECT 'cliente' AS tabela, count(*) FROM cliente
UNION ALL SELECT 'gerente',     count(*) FROM gerente
UNION ALL SELECT 'produto',     count(*) FROM produto
UNION ALL SELECT 'pedido',      count(*) FROM pedido
UNION ALL SELECT 'item_pedido', count(*) FROM item_pedido;

\echo '== 2) JOIN completo: pedido -> cliente -> gerente -> itens -> produto =='
SELECT p.id AS pedido, c.nome AS cliente, COALESCE(g.nome, '(sem gerente)') AS gerente,
       p.status_pedido, pr.nome AS produto, i.quantidade, i.peso
FROM pedido p
JOIN cliente c       ON c.id = p.cliente_id
LEFT JOIN gerente g  ON g.id = p.gerente_id
JOIN item_pedido i   ON i.pedido_id = p.id
JOIN produto pr      ON pr.id = i.produto_id
ORDER BY p.id, i.id
LIMIT 12;

\echo '== 3) Faturamento estimado por pedido (bolo = preço*kg; doce = preço*unid) =='
SELECT p.id, p.status_pedido,
       round(sum(pr.preco * COALESCE(i.peso, 1) * i.quantidade), 2) AS total
FROM pedido p
JOIN item_pedido i ON i.pedido_id = p.id
JOIN produto pr    ON pr.id = i.produto_id
GROUP BY p.id, p.status_pedido
ORDER BY p.id;

\echo '== 4) Testes de integridade (cada um DEVE falhar com ERRO) =='
\set ON_ERROR_STOP off
\echo '-- FK: pedido com cliente inexistente'
INSERT INTO pedido (cliente_id, data_prevista, forma_entrega) VALUES (999, '2026-12-01', 'RETIRADA');
\echo '-- CHECK: quantidade <= 0'
INSERT INTO item_pedido (pedido_id, produto_id, quantidade) VALUES (1, 1, 0);
\echo '-- CHECK: entrega a domicílio sem endereço'
INSERT INTO pedido (cliente_id, data_prevista, forma_entrega) VALUES (1, '2026-12-01', 'ENTREGA');
\echo '-- CHECK: status inválido'
INSERT INTO pedido (cliente_id, gerente_id, data_prevista, forma_entrega, status_pedido) VALUES (1, 1, '2026-12-01', 'RETIRADA', 'XYZ');
\echo '-- UNIQUE: gerente com nome repetido'
INSERT INTO gerente (nome, senha) VALUES ('Gabriela Almeida', 'x');
\echo '-- RESTRICT: apagar produto que já foi vendido'
DELETE FROM produto WHERE id = 1;
\echo '-- CHECK: preço negativo'
INSERT INTO produto (nome, preco) VALUES ('Teste', -1); 