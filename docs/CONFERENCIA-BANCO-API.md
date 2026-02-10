# Conferência: banco da API (Supabase)

## Dados do Supabase Flunx (referência)

- **URL:** `https://rcteeqvosthccuepebmr.supabase.co`
- **anon:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdGVlcXZvc3RoY2N1ZXBlYm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDY1MjUsImV4cCI6MjA4NTI4MjUyNX0.R8mHdq2m_sku0LnLSYKPjmbjIUmEXZoo4CDukpGm1d0`
- **service_role:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdGVlcXZvc3RoY2N1ZXBlYm1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTcwNjUyNSwiZXhwIjoyMDg1MjgyNTI1fQ.PaExqXrK3Wc1ZY5HbgcVBEga675pa4Q8Jj2V908-Pls`

## O que a API usa

| Onde | Variável | Valor |
|------|----------|--------|
| **flunx-api/.env** | `SUPABASE_URL` | `https://rcteeqvosthccuepebmr.supabase.co` |
| **flunx-api/.env** | `SUPABASE_ANON_KEY` | (igual ao anon acima) |
| **flunx-api/.env** | `SUPABASE_SERVICE_ROLE_KEY` | (igual ao service_role acima) |
| **flunx-api/flunx-api.yaml** | env | `env_file: .env` → usa o .env do diretório do stack |

## Resultado da conferência

- O **.env** do repositório (**flunx-api/.env**) está **igual** aos dados do Supabase Flunx (mesma URL e mesma service_role).
- O stack Docker (**flunx-api.yaml**) usa `env_file: .env`, então o container em produção usa o .env do **diretório de onde o deploy foi feito** (onde está o `flunx-api.yaml`).
- Conclusão: **a API está configurada para o projeto Supabase correto** (`rcteeqvosthccuepebmr`). O índice `idx_chat_contacts_inbox_remote_jid_unique` foi aplicado nesse projeto via `supabase db push`.

Se os erros 42P10 continuarem após reiniciar a API e testar de novo, no servidor de produção confira se o arquivo **.env** na pasta onde fica o **flunx-api.yaml** tem exatamente esses valores (e não um .env antigo ou de outro ambiente).
