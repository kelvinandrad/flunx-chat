-- Fase 3 (painel do contato): notas, propostas, mensagens agendadas, lembretes.
-- Tabelas específicas do chat, vinculadas a chat_contacts.

-- 1) chat_contact_notes: notas sobre o contato
CREATE TABLE IF NOT EXISTS public.chat_contact_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.chat_contacts(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_contact_notes_contact ON public.chat_contact_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_chat_contact_notes_org ON public.chat_contact_notes(organization_id);

-- RLS: usuários veem notas da própria org
ALTER TABLE public.chat_contact_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view contact notes from their org"
  ON public.chat_contact_notes FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can create contact notes in their org"
  ON public.chat_contact_notes FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id) AND author_id = auth.uid());

CREATE POLICY "Authors can update their notes"
  ON public.chat_contact_notes FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their notes"
  ON public.chat_contact_notes FOR DELETE
  USING (author_id = auth.uid());

CREATE TRIGGER update_chat_contact_notes_updated_at
  BEFORE UPDATE ON public.chat_contact_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) chat_proposals: propostas vinculadas a contatos
CREATE TABLE IF NOT EXISTS public.chat_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.chat_contacts(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  total_value NUMERIC(12,2) DEFAULT 0,
  items JSONB DEFAULT '[]'::jsonb, -- Array de {productId?, productName, quantity, unitPrice}
  notes TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_proposals_contact ON public.chat_proposals(contact_id);
CREATE INDEX IF NOT EXISTS idx_chat_proposals_org ON public.chat_proposals(organization_id);

ALTER TABLE public.chat_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view proposals from their org"
  ON public.chat_proposals FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can create proposals in their org"
  ON public.chat_proposals FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id) AND author_id = auth.uid());

CREATE POLICY "Members can update proposals in their org"
  ON public.chat_proposals FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can delete proposals in their org"
  ON public.chat_proposals FOR DELETE
  USING (is_member_of(auth.uid(), organization_id));

CREATE TRIGGER update_chat_proposals_updated_at
  BEFORE UPDATE ON public.chat_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) chat_scheduled_messages: mensagens agendadas para contatos
CREATE TABLE IF NOT EXISTS public.chat_scheduled_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.chat_contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
  type TEXT DEFAULT 'follow-up', -- ex.: 'follow-up', 'reminder', 'campaign'
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_scheduled_messages_contact ON public.chat_scheduled_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_chat_scheduled_messages_org ON public.chat_scheduled_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_scheduled_messages_scheduled ON public.chat_scheduled_messages(scheduled_at);

ALTER TABLE public.chat_scheduled_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view scheduled messages from their org"
  ON public.chat_scheduled_messages FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can create scheduled messages in their org"
  ON public.chat_scheduled_messages FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id) AND author_id = auth.uid());

CREATE POLICY "Members can update scheduled messages in their org"
  ON public.chat_scheduled_messages FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can delete scheduled messages in their org"
  ON public.chat_scheduled_messages FOR DELETE
  USING (is_member_of(auth.uid(), organization_id));

CREATE TRIGGER update_chat_scheduled_messages_updated_at
  BEFORE UPDATE ON public.chat_scheduled_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) chat_reminders: lembretes vinculados a contatos
CREATE TABLE IF NOT EXISTS public.chat_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.chat_contacts(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_reminders_contact ON public.chat_reminders(contact_id);
CREATE INDEX IF NOT EXISTS idx_chat_reminders_org ON public.chat_reminders(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_reminders_due ON public.chat_reminders(due_at);

ALTER TABLE public.chat_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view reminders from their org"
  ON public.chat_reminders FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can create reminders in their org"
  ON public.chat_reminders FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id) AND author_id = auth.uid());

CREATE POLICY "Members can update reminders in their org"
  ON public.chat_reminders FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Members can delete reminders in their org"
  ON public.chat_reminders FOR DELETE
  USING (is_member_of(auth.uid(), organization_id));

CREATE TRIGGER update_chat_reminders_updated_at
  BEFORE UPDATE ON public.chat_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
