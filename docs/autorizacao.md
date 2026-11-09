# Autorização por perfil (Matriz de Autorização)

## Como funciona
1. `POST /auth/login` valida usuário e senha (BCrypt) e cria uma linha em `sessao`. O token (32 bytes aleatórios, base64url) volta na resposta; no banco fica só o SHA-256 dele.
2. O front envia `Authorization: Bearer <token>` em toda chamada.
3. O `AuthInterceptor` roda antes dos controllers: valida a sessão (não revogada, dentro das 8 h, com uso nos últimos 30 min, usuário ativo), renova o último acesso e confere a tabela de `RegrasDeAcesso`.
4. Respostas: **401** sem token/token inválido ou expirado; **403** perfil sem permissão. Corpo: `{"error":"FORBIDDEN","message":"..."}`.

## Regras
| Rota | Gerente | Funcionário | Sem login |
|---|---|---|---|
| R001 `POST /clientes/cadastro`, R002 `GET /clientes/busca` | 200 | 200 | 401 |
| R003 `POST /pedidos/cadastro`, R004 `GET /pedidos/consulta`, R010 `GET /pedidos/{id}` | 200 | 200 | 401 |
| R005 `PATCH /pedidos/{id}` | tudo | altera e marca atendido; **cancelar = 403** | 401 |
| R006 `GET /agenda`, R007 `GET /lembretes/pedidos-proximos`, R009 `GET /listar/produtos` | 200 | 200 | 401 |
| R008 `GET /financeiro/acesso` | permitido | **403** | 401 |
| Fora da matriz: `POST /verificar/entrega` | login | login | 401 |
| Fora da matriz: `POST /usuarios/cadastro` | permitido | 403 | 401 |
Públicas: `POST /auth/login`, `OPTIONS` (CORS), `/actuator/**`, Swagger.

## Limitações
- Bloqueio após 3 falhas (RN006) não está incluído.
- Rotas fora da matriz seguem decisão provisória (acima), a confirmar com a equipe.
- `APP_AUTH_ENABLED=false` desliga a checagem (só enquanto o front usa o login de mentira).

## Teste
`bash scripts/testar-autorizacao.sh` (usa os usuários de `docs/seed-usuarios-teste.md`).
