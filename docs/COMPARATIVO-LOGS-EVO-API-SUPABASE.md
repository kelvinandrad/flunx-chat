# Comparativo: Evolution × API × Supabase (e RLS)

## 1. Poderia ser RLS?

**Não.** O erro que apareceu foi **42P10** (PostgreSQL): *"there is no unique or exclusion constraint matching the ON CONFLICT specification"*. Isso é erro de **constraint/índice**, não de permissão.

Além disso:

- **chat_contacts** não tem RLS habilitado em nenhuma migration do projeto (não há `ALTER TABLE chat_contacts ENABLE ROW LEVEL SECURITY`).
- A API usa **service_role** (`supabaseService` com `SUPABASE_SERVICE_ROLE_KEY`). No Supabase, a **service_role** ignora RLS. Ou seja, mesmo que RLS estivesse ligado em `chat_contacts`, a API não seria bloqueada por política.

Conclusão: o problema era **falta de UNIQUE constraint/índice** para o `ON CONFLICT (inbox_id, remote_jid)`, não RLS.

---

## 2. O que cada um “logou” (Evolution → API → Supabase)

O Supabase não expõe uma API pública para ler logs do Postgres ou do PostgREST. O que temos é:

- **Evolution:** loga envio dos webhooks (evento, instance, destination).
- **API (flunx-api):** loga recebimento, handler executado e **o erro que o Supabase devolveu** (objeto com `code`, `message`, etc.).
- **Supabase:** o “log” do Supabase que temos é exatamente **essa resposta de erro** que a API recebe e imprime. Ou seja, o log da API **é** o reflexo do que o Supabase/Postgres retornou.

Comparativo direto:

| Camada      | O que “logou” / aconteceu |
|------------|----------------------------|
| **Evolution** | Enviou POST para api.flunx.com.br com eventos: connection.update, qrcode.updated, labels.edit, contacts.upsert, chats.set, messages.set, contacts.update, etc. |
| **API**       | Recebeu os POSTs (200), executou os handlers, chamou `supabase.from('chat_contacts').upsert(...)` com `onConflict: 'inbox_id,remote_jid'`. |
| **Supabase**  | Postgres executou o upsert e **retornou erro 42P10** ao client (API), porque não existia constraint/índice UNIQUE em `(inbox_id, remote_jid)` compatível com o ON CONFLICT. A API então logou: `[webhook] CONTACTS upsert error: { code: '42P10', message: '...' }`. |

Ou seja: **o “problema com o Supabase”** foi exatamente esse comportamento do Postgres (falta de constraint/índice), não RLS nem outro tipo de log escondido.

---

## 3. Resumo do fluxo do erro (até a correção)

```
Evolution                    API (flunx-api)                    Supabase (Postgres)
    |                               |                                    |
    | POST contacts.upsert          |                                    |
    | ----------------------------> |  supabase.from('chat_contacts')     |
    |                               |    .upsert(rows, { onConflict:     |
    |                               |      'inbox_id,remote_jid' })       |
    |                               | ---------------------------------->|
    |                               |                                    | ON CONFLICT (inbox_id, remote_jid)
    |                               |                                    | → não encontra unique constraint
    |                               |                                    | → retorna 42P10
    |                               | <-----------------------------------|
    |                               |  { code: '42P10', message: '...' } |
    | 200 OK                        |                                    |
    | <----------------------------|  (API responde 200 ao webhook;      |
    |                               |   internamente não persiste)        |
```

O “log do Supabase” que temos é esse retorno 42P10 que a API registrou.

---

## 4. Como ver mais logs no Supabase (server-side)

Para ver logs **no servidor** do Supabase (Postgres, Auth, API, etc.):

1. Abra o **Dashboard** do projeto: https://supabase.com/dashboard/project/rcteeqvosthccuepebmr  
2. Menu **Logs** (ou **Logging**).  
3. Escolha o tipo (ex.: **Postgres**, **API**) e o intervalo.

Lá você pode ver, por exemplo, a query que falhou e a linha de log do Postgres com 42P10. Para o problema que tivemos, a correção foi aplicar a **UNIQUE constraint** em `chat_contacts(inbox_id, remote_jid)` (migration `20260210130000_chat_contacts_unique_constraint.sql`), não alterar RLS.
