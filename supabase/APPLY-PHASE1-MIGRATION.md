# Aplicar migration Phase 1 (chat Evolution) no Supabase

O projeto remoto (rcteeqvosthccuepebmr) foi configurado a partir do **flunx-v2**, então o `supabase db push` a partir do flunx-chat falha por divergência de histórico de migrations. Aplique a migration **manualmente** no SQL Editor.

## Passos

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) → projeto **Flunx-v2** (rcteeqvosthccuepebmr).
2. Vá em **SQL Editor** → **New query**.
3. Cole o conteúdo do arquivo `migrations/20260202100000_phase1_chat_evolution_schema.sql` (ou o SQL abaixo).
4. Execute (**Run**).

## SQL (Phase 1 – schema chat Evolution)

```sql
-- Fase 1.1: Garantir schema para Flunx-Chat + Evolution (idempotente: ADD COLUMN IF NOT EXISTS).
-- As tabelas chat_inboxes, chat_contacts, chat_conversations, chat_messages já existem no remoto.

-- 1) chat_inboxes: colunas Evolution
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS evolution_instance_name TEXT;
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS evolution_base_url TEXT;
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS qr_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_inboxes_evolution_instance
  ON public.chat_inboxes(evolution_instance_name)
  WHERE evolution_instance_name IS NOT NULL;

-- 2) chat_contacts
ALTER TABLE public.chat_contacts ADD COLUMN IF NOT EXISTS inbox_id UUID;
ALTER TABLE public.chat_contacts ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.chat_contacts ADD COLUMN IF NOT EXISTS remote_jid TEXT;
ALTER TABLE public.chat_contacts ADD COLUMN IF NOT EXISTS name TEXT;
CREATE INDEX IF NOT EXISTS idx_chat_contacts_inbox_remote_jid ON public.chat_contacts(inbox_id, remote_jid) WHERE inbox_id IS NOT NULL AND remote_jid IS NOT NULL;

-- 3) chat_conversations
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS inbox_id UUID;
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS contact_id UUID;
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
CREATE INDEX IF NOT EXISTS idx_chat_conversations_inbox ON public.chat_conversations(inbox_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_conversations_inbox_contact ON public.chat_conversations(inbox_id, contact_id) WHERE inbox_id IS NOT NULL AND contact_id IS NOT NULL;

-- 4) chat_messages
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS conversation_id UUID;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS direction TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'received';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS evolution_message_id TEXT;
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_messages_evolution_id ON public.chat_messages(evolution_message_id) WHERE evolution_message_id IS NOT NULL;
```

Após rodar, o schema estará alinhado para o webhook Evolution (MESSAGES_UPSERT, CONNECTION_UPDATE, QRCODE_UPDATED).
