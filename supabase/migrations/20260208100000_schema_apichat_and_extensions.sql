-- Migration: Schema apichat para backend flunx-appchat (Chatwoot)
-- Todas as tabelas do flunx-appchat serão criadas neste schema no mesmo Supabase.
-- Extensões necessárias para o Rails/Chatwoot (idempotente).

-- 1) Schema onde o flunx-appchat vai criar e ler tabelas
CREATE SCHEMA IF NOT EXISTS apichat;

COMMENT ON SCHEMA apichat IS 'Namespace do backend flunx-appchat (Chatwoot); evita conflito com public e auth.';

-- 2) Extensões exigidas pelo flunx-appchat (CREATE EXTENSION é no nível do banco, não do schema)
-- plpgsql já vem habilitada no Supabase por padrão
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;
-- pg_stat_statements pode não estar disponível em todos os planos Supabase; descomente se tiver permissão
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
