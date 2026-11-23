# Deploy em ambiente para o cliente

Documento da Sprint 5 (validação com o cliente). Descreve onde o Gabi Cake está publicado, como foi configurado, como operar e quais são os limites do ambiente.

Última atualização: 23/11/2026.

## 1. Visão geral

| Camada | Serviço | Plano | Região | Endereço |
|---|---|---|---|---|
| Front-end (React/Vite) | Vercel | Hobby (gratuito) | automática | https://gabicake-mu.vercel.app |
| Back-end (Java 25 + Spring Boot, Docker) | Render (Web Service) | Free | Oregon (US West) | https://gabicake-api.onrender.com |
| Banco (PostgreSQL) | Supabase | Free | West US (Oregon) | acesso apenas pelo back-end (Session pooler) |

Fluxo: navegador → Vercel (arquivos estáticos) → chamadas à API em `VITE_API_URL` (Render) → PostgreSQL no Supabase.

O Vercel não executa o back-end Java; por isso o back-end roda no Render (Docker). O front usa Vercel, como sugerido no enunciado da Sprint 5.

## 2. Configuração

### 2.1 Banco (Supabase)
- Projeto `GabiCake`. O schema e os dados iniciais vêm dos scripts `db/init/01` a `07`, executados em ordem no SQL Editor.
- **RLS ligado em todas as 10 tabelas** (`cliente`, `configuracao_loja`, `gerente`, `item_pedido`, `pedido`, `perfil`, `produto`, `sessao`, `usuario`, `usuario_perfil`), sem policies. Com isso a Data API do Supabase (chave `anon`) não devolve dados. O back-end acessa pelo usuário `postgres`, que ignora o RLS.
- O back-end conecta pelo **Session pooler** (IPv4), porque o Render não alcança a conexão direta (IPv6).

### 2.2 Back-end (Render)
- Serviço `gabicake-api`, repositório `IsabelliPinho/Pi-II-2026-2-equipe-4`, branch `main`.
- Root Directory `backend`; Dockerfile `backend/Dockerfile`; contexto `backend`.
- Health check: `/actuator/health`.
- Deploy automático a cada merge na `main` que altere `backend/`.

Variáveis de ambiente (valores sensíveis ficam só no painel do Render, nunca no repositório):

| Variável | Finalidade |
|---|---|
| `SPRING_DATASOURCE_URL` | JDBC do Session pooler do Supabase, com `sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | usuário do pooler (`postgres.<id-do-projeto>`) |
| `SPRING_DATASOURCE_PASSWORD` | senha do banco (segredo) |
| `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE` | `5`, para respeitar o limite de conexões do plano gratuito |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `none`: o schema só muda pelos scripts SQL |
| `SPRING_JPA_SHOW_SQL` | `false`: evita SQL e dados nos logs |
| `SERVER_PORT` e `PORT` | `8080` |
| `JAVA_TOOL_OPTIONS` | `-Xmx320m -XX:+UseSerialGC` (instância de 512 MB) |
| `APP_CORS_ORIGINS` | origens permitidas pelo CORS: `https://gabicake-mu.vercel.app` |

`APP_AUTH_ENABLED` não é definida: o padrão é `true` (autorização por perfil ativa).

### 2.3 Front-end (Vercel)
- Projeto `gabicake`, publicado a partir da pasta `frontend` (framework Vite, saída `dist`).
- Variável `VITE_API_URL=https://gabicake-api.onrender.com` (lida na hora do build; é um endereço público, não um segredo).
- Publicação feita pela CLI (`npx vercel --prod`). O projeto não está ligado ao Git; uma nova versão do front exige novo `npx vercel --prod` na pasta `frontend`.

## 3. Segurança do ambiente

- As contas de teste do seed (senha padrão) foram **desativadas**. Ficam ativas apenas duas contas, com senhas fortes definidas fora do repositório:
  - `gabriela.almeida`: perfil GERENTE
  - `marina.costa`: perfil FUNCIONARIO
- As senhas são entregues ao cliente por canal privado. Não ficam em issue, PR, commit ou neste documento.
- CORS restrito à origem do front. Uma origem desconhecida recebe 403.
- Rotas protegidas exigem token (sem token: 401; perfil sem permissão: 403), conforme `docs/autorizacao.md`.
- O banco não está aberto pela Data API (RLS), e a senha do banco existe só no painel do Render.

## 4. Operação

**Ver se está no ar**
```bash
curl -s https://gabicake-api.onrender.com/actuator/health
```
Esperado: `{"groups":["liveness","readiness"],"status":"UP"}`.

**Reiniciar o back-end:** Render → `gabicake-api` → Manual Deploy → Restart / Deploy latest commit.

**Voltar a uma versão anterior:** Render → `gabicake-api` → Events/Deploys → escolher o deploy anterior → Rollback.

**Atualizar o back-end:** merge na `main`; o Render faz o deploy sozinho.

**Atualizar o front:**
```bash
cd frontend
npx vercel --prod --yes
```

**Trocar uma senha de usuário** (SQL Editor do Supabase; não salvar a query):
```sql
UPDATE usuario
SET senha_hash = extensions.crypt($pw$NOVA_SENHA$pw$, extensions.gen_salt('bf', 10)),
    tentativas_falhas = 0, bloqueado_ate = NULL
WHERE login = 'LOGIN_DO_USUARIO';
```

**Encerrar todas as sessões:** `DELETE FROM sessao;`

**Alterar a origem permitida no CORS:** Render → Environment → `APP_CORS_ORIGINS` (várias origens separadas por vírgula) → Save and deploy.

**Backup:** o `scripts/backup.sh` e o `docs/backup-restore.md` tratam o banco local. Para o Supabase, usar `pg_dump` pela conexão do Session pooler, ou o backup do painel do Supabase quando disponível no plano.

## 5. Limitações do plano gratuito

- **Render Free:** a instância "dorme" após cerca de 15 minutos sem requisições. A primeira chamada depois disso pode levar de 50 segundos a 1 minuto. Antes de uma demonstração, abrir o endereço da API ou o front alguns minutos antes.
- **Supabase Free:** o projeto é pausado após cerca de 1 semana sem atividade (pode ser retomado pelo painel) e tem limite de 500 MB.
- **Vercel Hobby:** uso não comercial; o deploy é manual (CLI).
- Sem alta disponibilidade e sem backup automático garantido. Adequado para validação, não para produção real.

## 6. Verificação (23/11/2026)

| Teste | Resultado |
|---|---|
| `GET /actuator/health` | `UP` |
| `GET /pedidos` sem token | 401 |
| Login GERENTE pelo front | Dashboard e Controle Financeiro acessíveis |
| Login FUNCIONARIO pelo front | menu sem Controle Financeiro |
| Preflight CORS, origem do front | 200 |
| Preflight CORS, origem desconhecida | 403 |

Evidências (prints) anexadas nos comentários da issue do deploy.

## 7. Pendências conhecidas

- No Dashboard da funcionária ainda aparece o link "Ver controle financeiro" (a rota da API continua protegida e responde 403; a correção é de front).
- Botão de cancelar pedido deve aparecer só para o gerente (a API já bloqueia com 403).
- Recuperação de senha (`/auth/recuperar-senha`) ainda não existe no back-end.
