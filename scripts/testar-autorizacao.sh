#!/usr/bin/env bash
# Testa a autorização por perfil (Matriz de Autorização). Uso: bash scripts/testar-autorizacao.sh
# Usa os usuários de teste do docs/seed-usuarios-teste.md. Backend precisa estar no ar.
API="${API:-http://localhost:8080}"
SENHA="Senha@123"
FALHAS=0

login() { # $1 = login
  curl -s -X POST "$API/auth/login" -H 'Content-Type: application/json' \
    -d "{\"login\":\"$1\",\"senha\":\"$SENHA\"}" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p'
}
codigo() { # $1 metodo $2 rota $3 token (opcional) $4 corpo (opcional)
  local args=(-s -o /dev/null -w '%{http_code}' -X "$1" "$API$2")
  [ -n "$3" ] && args+=(-H "Authorization: Bearer $3")
  [ -n "$4" ] && args+=(-H 'Content-Type: application/json' -d "$4")
  curl "${args[@]}"
}
checa() { # descricao esperado obtido
  if [ "$2" = "$3" ]; then printf 'OK     %-62s esperado=%s obtido=%s\n' "$1" "$2" "$3"
  else printf 'FALHOU %-62s esperado=%s obtido=%s\n' "$1" "$2" "$3"; FALHAS=$((FALHAS+1)); fi
}

TG=$(login gabriela.almeida); TF=$(login marina.costa)
[ -z "$TG" ] || [ -z "$TF" ] && { echo "ERRO: login não devolveu token (backend no ar? seed aplicado?)"; exit 1; }

echo "== Sem login =="
checa "GET  /listar/produtos sem token"            401 "$(codigo GET /listar/produtos)"
checa "GET  /financeiro/acesso sem token"          401 "$(codigo GET /financeiro/acesso)"
checa "GET  /listar/produtos token inválido"       401 "$(codigo GET /listar/produtos lixo)"
echo "== Funcionário (marina.costa) =="
checa "GET  /listar/produtos"                      200 "$(codigo GET /listar/produtos "$TF")"
checa "GET  /clientes/busca?busca=mar"             200 "$(codigo GET '/clientes/busca?busca=mar' "$TF")"
checa "GET  /pedidos/consulta"                     200 "$(codigo GET /pedidos/consulta "$TF")"
checa "GET  /financeiro/acesso (proibido)"         403 "$(codigo GET /financeiro/acesso "$TF")"
checa "POST /usuarios/cadastro (só gerente)"       403 "$(codigo POST /usuarios/cadastro "$TF" '{}')"
checa "PATCH /pedidos/1 cancelar (só gerente)"     403 "$(codigo PATCH /pedidos/1 "$TF" '{"statusPedido":"CANCELADO"}')"
echo "== Gerente (gabriela.almeida) =="
checa "GET  /listar/produtos"                      200 "$(codigo GET /listar/produtos "$TG")"
checa "GET  /pedidos/consulta"                     200 "$(codigo GET /pedidos/consulta "$TG")"
G=$(codigo GET /financeiro/acesso "$TG")
[ "$G" != "401" ] && [ "$G" != "403" ] && checa "GET  /financeiro/acesso não é barrado (rota ainda pode ser 404)" ok ok \
  || checa "GET  /financeiro/acesso não é barrado" "!=40x" "$G"
echo "== Logout =="
codigo POST /auth/logout "$TF" >/dev/null
checa "token do funcionário após logout"           401 "$(codigo GET /listar/produtos "$TF")"

echo; [ $FALHAS -eq 0 ] && echo "TODOS OS TESTES PASSARAM" || { echo "$FALHAS teste(s) falharam"; exit 1; }
