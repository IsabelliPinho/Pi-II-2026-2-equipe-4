-- =====================================================================
-- Carga SINTÉTICA para validar índices com EXPLAIN ANALYZE.
-- NÃO usar no banco do sistema: rodar em um banco de teste descartável,
-- com o schema aplicado e SEM o seed (01-schema.sql, depois este arquivo):
--
--   docker compose exec db createdb -U gabicake gabitest
--   docker compose exec -T db psql -U gabicake -d gabitest < db/init/01-schema.sql
--   docker compose exec -T db psql -U gabicake -d gabitest < db/perf/carga-teste-indices.sql
--   docker compose exec -T db psql -U gabicake -d gabitest < db/init/03-indices.sql
--
-- Volume: 100.000 clientes, 300.000 pedidos (5% PENDENTE), 600.000 itens.
-- =====================================================================

INSERT INTO gerente (nome, senha) SELECT 'Gerente '||g, '$2a$10$eb4pycYl7zdZ1G/c2gVU8Opw6oEeybaWu6nG3RzKh/t3xsGEGnQ2e' FROM generate_series(1,10) g;
INSERT INTO produto (nome, preco) SELECT 'Produto '||g, 10+g%90 FROM generate_series(1,50) g;

INSERT INTO cliente (nome, telefone, rua, num_casa, bairro, cep)
SELECT (ARRAY['Maria','Joao','Ana','Carlos','Fernanda','Pedro','Julia','Marcos','Patricia','Ricardo'])[1+g%10]||' '||
       (ARRAY['Souza','Lima','Alves','Gomes','Mendes','Rocha','Araujo','Teixeira','Martins','Silva'])[1+(g/10)%10]||' '||md5(g::text),
       '(85) 9'||lpad((g%10000)::text,4,'0')||'-'||lpad(((g*7)%10000)::text,4,'0'),
       'Rua '||g%500, (g%999)::text, 'Bairro '||g%80, '60'||lpad((g%1000)::text,3,'0')||'-'||lpad((g%1000)::text,3,'0')
FROM generate_series(1,100000) g;

INSERT INTO pedido (cliente_id, gerente_id, data_prevista, data_entrega, status_pedido, forma_entrega)
SELECT 1+(g*13)%100000, 1+g%10,
       DATE '2024-01-01' + (g%1000),
       CASE WHEN s='ENTREGUE' THEN DATE '2024-01-01' + (g%1000) END,
       s, 'RETIRADA'
FROM (SELECT g, CASE WHEN g%100<5 THEN 'PENDENTE' WHEN g%100<10 THEN 'CANCELADO' ELSE 'ENTREGUE' END AS s
      FROM generate_series(1,300000) g) t(g,s);

-- PENDENTE/CANCELADO podem ficar sem gerente (ck_pedido_gerente)
UPDATE pedido SET gerente_id = NULL WHERE status_pedido IN ('PENDENTE','CANCELADO');

INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
SELECT 1+g%300000, 1+g%50, 1+g%5 FROM generate_series(1,600000) g;

ANALYZE;