-- =====================================================================
-- Gabi Cake - Seed com dados SINTÉTICOS (fictícios) para demonstração
-- Roda logo após 01-schema.sql, em banco vazio: os IDs gerados são 1..N
-- na ordem dos INSERTs, e é nessa ordem que as FKs abaixo se apoiam.
-- =====================================================================

-- pgcrypto: gera hashes BCrypt ($2a$), compatíveis com BCryptPasswordEncoder do Spring
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- GERENTE (10) - senha de todos: Senha@123 (só para demo) ----------
INSERT INTO gerente (nome, senha) VALUES
 ('Gabriela Almeida',  crypt('Senha@123', gen_salt('bf', 10))),
 ('Rafael Monteiro',   crypt('Senha@123', gen_salt('bf', 10))),
 ('Camila Duarte',     crypt('Senha@123', gen_salt('bf', 10))),
 ('Lucas Ferreira',    crypt('Senha@123', gen_salt('bf', 10))),
 ('Beatriz Nogueira',  crypt('Senha@123', gen_salt('bf', 10))),
 ('Thiago Carvalho',   crypt('Senha@123', gen_salt('bf', 10))),
 ('Larissa Pinheiro',  crypt('Senha@123', gen_salt('bf', 10))),
 ('Felipe Barros',     crypt('Senha@123', gen_salt('bf', 10))),
 ('Juliana Castro',    crypt('Senha@123', gen_salt('bf', 10))),
 ('Henrique Lima',     crypt('Senha@123', gen_salt('bf', 10)));

-- ---------- CLIENTE (12) ----------
INSERT INTO cliente (nome, telefone, rua, num_casa, bairro, cep) VALUES
 ('Mariana Souza',     '(85) 98812-3401', 'Rua das Acácias',        '120', 'Centro',        '60110-210'),
 ('Carlos Eduardo Lima','(85) 99743-1182', 'Av. Brasil',             '845', 'Jardim América','60410-100'),
 ('Fernanda Oliveira', '(85) 98655-7720', 'Rua Padre Cícero',        '33',  'Aldeota',       '60140-050'),
 ('João Pedro Alves',  '(88) 99231-4506', 'Rua Santos Dumont',       '410', 'Centro',        '62010-120'),
 ('Patrícia Gomes',    '(85) 98190-6644', 'Rua das Palmeiras',       '77',  'Messejana',     '60871-300'),
 ('Ricardo Mendes',    '(85) 99622-0913', 'Av. Beira Mar',           '2200','Meireles',      '60165-121'),
 ('Aline Rodrigues',   '(88) 98874-2257', 'Rua do Sol',              '15',  'São Francisco', '62030-210'),
 ('Marcos Vinícius Rocha','(85) 99408-5531','Rua Ipê Amarelo',       '502', 'Parquelândia',  '60455-310'),
 ('Tatiane Cavalcante','(85) 98733-9028', 'Travessa Esperança',      '9',   'Bom Jardim',    '60540-440'),
 ('Eduardo Teixeira',  '(88) 99107-6312', 'Rua Boa Vista',           '288', 'Alto Bonito',   '62040-070'),
 ('Sabrina Martins',   '(85) 98521-4079', 'Rua Rio Branco',          '651', 'Benfica',       '60020-190'),
 ('Diego Araújo',      '(85) 99356-8840', 'Av. Santos Dumont',       '1500','Papicu',        '60175-047');

-- ---------- PRODUTO (12) - preço base: por kg (bolos/tortas) ou por unidade (doces) ----------
INSERT INTO produto (nome, preco) VALUES
 ('Bolo de Chocolate',            85.00),   -- 1
 ('Bolo de Ninho com Morango',    95.00),   -- 2
 ('Bolo Red Velvet',             110.00),   -- 3
 ('Bolo de Cenoura com Brigadeiro',75.00),  -- 4
 ('Bolo de Limão',                80.00),   -- 5
 ('Torta de Maracujá',            70.00),   -- 6
 ('Cupcake Decorado',              9.50),   -- 7
 ('Brigadeiro Gourmet',            2.80),   -- 8
 ('Beijinho',                      2.50),   -- 9
 ('Cento de Docinhos Sortidos',  220.00),   -- 10
 ('Brownie',                       7.00),   -- 11
 ('Naked Cake',                  120.00);   -- 12

-- ---------- PEDIDO (15) ----------
-- (cliente, gerente, data_prevista, data_entrega, status, forma, rua, num, bairro, cep)
INSERT INTO pedido (cliente_id, gerente_id, data_prevista, data_entrega, status_pedido, forma_entrega,
                    entrega_rua, entrega_num_casa, entrega_bairro, entrega_cep) VALUES
 ( 1, 1,    '2026-09-12', '2026-09-12', 'ENTREGUE',    'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 1
 ( 2, 2,    '2026-09-14', '2026-09-14', 'ENTREGUE',    'ENTREGA',  'Av. Brasil', '845', 'Jardim América', '60410-100'),      -- 2
 ( 3, 1,    '2026-09-20', '2026-09-21', 'ENTREGUE',    'ENTREGA',  'Rua Pasteur', '1020', 'Aldeota', '60140-120'),            -- 3
 ( 4, 3,    '2026-09-27', '2026-09-27', 'ENTREGUE',    'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 4
 ( 5, 2,    '2026-10-02', '2026-10-02', 'ENTREGUE',    'ENTREGA',  'Rua das Palmeiras', '77', 'Messejana', '60871-300'),      -- 5
 ( 6, 4,    '2026-10-03', NULL,         'PRONTO',      'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 6
 ( 7, 1,    '2026-10-05', NULL,         'EM_PRODUCAO', 'ENTREGA',  'Rua do Sol', '15', 'São Francisco', '62030-210'),         -- 7
 ( 8, 5,    '2026-10-08', NULL,         'EM_PRODUCAO', 'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 8
 ( 9, 3,    '2026-10-10', NULL,         'CONFIRMADO',  'ENTREGA',  'Salão Vila Verde, Rua Ceará', '300', 'Bom Jardim', '60540-500'), -- 9
 (10, 2,    '2026-10-12', NULL,         'CONFIRMADO',  'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 10
 (11, NULL, '2026-10-15', NULL,         'PENDENTE',    'ENTREGA',  'Rua Rio Branco', '651', 'Benfica', '60020-190'),          -- 11
 (12, NULL, '2026-10-18', NULL,         'PENDENTE',    'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 12
 ( 1, 6,    '2026-10-24', NULL,         'CONFIRMADO',  'ENTREGA',  'Espaço Jardim das Flores, Av. Washington Soares', '4100', 'Edson Queiroz', '60811-341'), -- 13
 ( 3, NULL, '2026-10-30', NULL,         'CANCELADO',   'RETIRADA', NULL, NULL, NULL, NULL),                                   -- 14
 ( 5, 7,    '2026-11-02', NULL,         'CONFIRMADO',  'RETIRADA', NULL, NULL, NULL, NULL);                                   -- 15

-- ---------- ITEM_PEDIDO (26) ----------
-- (pedido, produto, quantidade, tema, peso kg, massa, recheio) - itens não personalizados ficam com NULL
INSERT INTO item_pedido (pedido_id, produto_id, quantidade, tema, peso, tipo_massa, tipo_recheio) VALUES
 ( 1,  1,  1, 'Aniversário',            2.000, 'Chocolate',          'Brigadeiro'),
 ( 1,  8, 50, NULL,                     NULL,  NULL,                 NULL),
 ( 2,  2,  1, 'Princesa',               3.000, 'Baunilha',           'Ninho com morango'),
 ( 2,  7, 10, NULL,                     NULL,  NULL,                 NULL),
 ( 3,  3,  1, 'Casamento',              5.000, 'Red Velvet',         'Cream cheese'),
 ( 3, 10,  2, NULL,                     NULL,  NULL,                 NULL),
 ( 4,  4,  1, 'Chá de bebê',            2.500, 'Cenoura',            'Brigadeiro'),
 ( 4,  9, 30, NULL,                     NULL,  NULL,                 NULL),
 ( 5, 12,  1, 'Floral',                 3.500, 'Baunilha',           'Doce de leite'),
 ( 5,  7, 12, NULL,                     NULL,  NULL,                 NULL),
 ( 6,  5,  1, 'Aniversário',            1.500, 'Limão',              'Mousse de limão'),
 ( 6, 11, 10, NULL,                     NULL,  NULL,                 NULL),
 ( 7,  1,  1, 'Futebol',                4.000, 'Chocolate',          'Brigadeiro de ninho'),
 ( 7,  9, 40, NULL,                     NULL,  NULL,                 NULL),
 ( 8,  2,  1, 'Fundo do mar',           2.500, 'Baunilha',           'Ninho com morango'),
 ( 9,  3,  1, 'Aniversário de 15 anos', 4.500, 'Red Velvet',         'Cream cheese'),
 ( 9,  8,100, NULL,                     NULL,  NULL,                 NULL),
 (10,  6,  1, NULL,                     1.200, 'Massa amanteigada',  'Creme de maracujá'),
 (10,  7,  6, NULL,                     NULL,  NULL,                 NULL),
 (11, 12,  1, 'Super-herói',            3.000, 'Chocolate',          'Mousse de chocolate'),
 (12,  4,  2, 'Aniversário',            2.000, 'Cenoura',            'Brigadeiro'),
 (13,  3,  1, 'Casamento',              6.000, 'Red Velvet',         'Doce de leite'),
 (13, 10,  3, NULL,                     NULL,  NULL,                 NULL),
 (14,  5,  1, 'Chá de bebê',            1.800, 'Limão',              'Mousse de limão'),
 (15,  1,  1, 'Boteco',                 2.500, 'Chocolate',          'Brigadeiro'),
 (15, 11, 24, NULL,                     NULL,  NULL,                 NULL);