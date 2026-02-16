-- Recarrega o schema cache do PostgREST (evita PGRST204 quando colunas existem no DB mas o cache está desatualizado).
-- Execute no SQL Editor do Supabase (Dashboard → SQL Editor) ou via: psql $DATABASE_URL -f este arquivo.
NOTIFY pgrst, 'reload schema';
