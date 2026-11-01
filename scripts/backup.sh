#!/usr/bin/env bash
# Cria um backup do banco do Gabi Cake na pasta backups/ (que fica fora do Git).
# Uso: bash scripts/backup.sh [quantos_backups_manter]   (padrão: 7)
set -euo pipefail
cd "$(dirname "$0")/.."

MANTER="${1:-7}"
mkdir -p backups
ARQUIVO="backups/gabicake-$(date +%Y%m%d-%H%M%S).sql"

if ! docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' > "$ARQUIVO"; then
  rm -f "$ARQUIVO"
  echo "ERRO: não foi possível gerar o backup. O Docker Desktop está aberto e o banco está no ar?"
  exit 1
fi

if [ ! -s "$ARQUIVO" ]; then
  rm -f "$ARQUIVO"
  echo "ERRO: o backup saiu vazio e foi descartado."
  exit 1
fi

echo "Backup criado: $ARQUIVO ($(du -h "$ARQUIVO" | cut -f1))"

# Mantém só os backups mais recentes.
ls -t backups/gabicake-*.sql | tail -n +"$((MANTER + 1))" | xargs -r rm --
