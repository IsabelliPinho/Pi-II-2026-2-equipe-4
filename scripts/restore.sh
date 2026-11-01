#!/usr/bin/env bash
# Restaura um backup no banco do Gabi Cake.
# Uso: bash scripts/restore.sh [arquivo.sql]   (padrão: o backup mais recente)
# ATENÇÃO: o conteúdo atual do banco é SUBSTITUÍDO pelo do backup.
set -euo pipefail
cd "$(dirname "$0")/.."

ULTIMO="$(ls -t backups/gabicake-*.sql 2>/dev/null | head -1 || true)"
ARQUIVO="${1:-$ULTIMO}"

if [ -z "$ARQUIVO" ] || [ ! -f "$ARQUIVO" ]; then
  echo "ERRO: backup não encontrado. Rode antes: bash scripts/backup.sh"
  exit 1
fi

echo "Será restaurado: $ARQUIVO"
echo "O conteúdo atual do banco será substituído."
read -r -p "Digite SIM para continuar: " RESPOSTA
if [ "$RESPOSTA" != "SIM" ]; then
  echo "Cancelado."
  exit 1
fi

# Com o backend parado não há conexões abertas durante a restauração.
docker compose stop backend

if docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 --single-transaction' < "$ARQUIVO"; then
  docker compose start backend
  echo "Restauração concluída."
else
  echo "ERRO na restauração. A transação foi desfeita, e o banco ficou como estava."
  echo "Para religar o backend: docker compose start backend"
  exit 1
fi
