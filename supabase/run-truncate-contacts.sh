#!/usr/bin/env bash
# Executa o TRUNCATE das tabelas de chat.
# Necessário: URL do Postgres do Supabase (Dashboard → Project Settings → Database).
# Uso:
#   export DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[SENHA]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
#   ./supabase/run-truncate-contacts.sh
# Ou com senha separada (project ref rcteeqvosthccuepebmr):
#   export PGPASSWORD="sua-senha"
#   psql "postgresql://postgres.rcteeqvosthccuepebmr@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f supabase/truncate_contacts.sql

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="${SCRIPT_DIR}/truncate_contacts.sql"

if [[ -z "$DATABASE_URL" && -z "$PGPASSWORD" ]]; then
  echo "Defina DATABASE_URL ou PGPASSWORD + conexão."
  echo "Exemplo: export DATABASE_URL='postgresql://postgres.XXX:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres'"
  exit 1
fi

if [[ -n "$DATABASE_URL" ]]; then
  psql "$DATABASE_URL" -f "$SQL_FILE"
else
  psql "postgresql://postgres.rcteeqvosthccuepebmr@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f "$SQL_FILE"
fi

echo "TRUNCATE executado com sucesso."
