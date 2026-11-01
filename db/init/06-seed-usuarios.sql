-- Seed 06: usuários de teste para TODOS os perfis
--
-- Por que é um arquivo separado do 02-seed.sql: o 02 roda antes de as tabelas
-- usuario/perfil existirem (elas nascem na migration 04), então os usuários só
-- podem ser criados depois. A ordem em db/init é: 01 schema, 02 seed da massa
-- de dados, 03 índices, 04 usuários/perfis, 05 hash em gerente, 06 este arquivo.
--
-- Resultado (senha de TODOS os usuários de demonstração: Senha@123):
--   GERENTE      os 10 gerentes do 02-seed, já migrados para usuario pela
--                migration 04 (ex.: gabriela.almeida)
--   FUNCIONARIO  marina.costa   (ativa)
--                paulo.ribeiro  (ativo)
--                renata.dias    (INATIVA: o login dela deve ser recusado)
--
-- As senhas são gravadas só como hash BCrypt (pgcrypto, custo 10, o mesmo do
-- 02-seed.sql e compatível com o BCryptPasswordEncoder do Spring).
--
-- Idempotente e atômico. Pode rodar de novo em banco existente sem duplicar nem
-- alterar os usuários já criados:
--   docker compose exec -T db psql -U gabicake -d gabicake -v ON_ERROR_STOP=1 \
--       < db/init/06-seed-usuarios.sql
--
-- ATENÇÃO: são credenciais de DEMONSTRAÇÃO, públicas no repositório. Este arquivo
-- não deve ser usado em um ambiente de produção.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cria os funcionários e, só para os que foram criados agora, o vínculo com o perfil.
-- (gen_salt é chamado uma vez por linha, então cada hash tem o seu próprio salt.)
WITH dados (login, nome, perfil, ativo) AS (
    VALUES
        ('marina.costa',  'Marina Costa',  'FUNCIONARIO', TRUE),
        ('paulo.ribeiro', 'Paulo Ribeiro', 'FUNCIONARIO', TRUE),
        ('renata.dias',   'Renata Dias',   'FUNCIONARIO', FALSE)
),
novos AS (
    INSERT INTO usuario (login, senha_hash, nome, ativo)
    SELECT login, crypt('Senha@123', gen_salt('bf', 10)), nome, ativo
      FROM dados
    ON CONFLICT (login) DO NOTHING
    RETURNING id, login
)
INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT n.id, p.id
  FROM novos n
  JOIN dados d  ON d.login = n.login
  JOIN perfil p ON p.nome  = d.perfil;

-- Garantia: o seed só termina com sucesso se TODO perfil tiver ao menos um usuário
-- ATIVO. Se um dia alguém criar um perfil novo e esquecer de dar usuário de teste
-- a ele, a inicialização do banco falha na hora, em vez de passar despercebido.
DO $$
DECLARE
    sem_usuario TEXT;
BEGIN
    SELECT string_agg(p.nome, ', ' ORDER BY p.nome) INTO sem_usuario
      FROM perfil p
     WHERE NOT EXISTS (
            SELECT 1
              FROM usuario_perfil up
              JOIN usuario u ON u.id = up.usuario_id
             WHERE up.perfil_id = p.id AND u.ativo);

    IF sem_usuario IS NOT NULL THEN
        RAISE EXCEPTION 'Seed incompleto: nenhum usuário ativo para o(s) perfil(is): %', sem_usuario;
    END IF;
END $$;

COMMIT;