-- RLS: membros da org podem ler etiquetas do canal (chat_inbox_labels via chat_inboxes.organization_id).
ALTER TABLE public.chat_inbox_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view inbox labels from their org"
  ON public.chat_inbox_labels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_inboxes bi
      WHERE bi.id = chat_inbox_labels.inbox_id
        AND public.is_member_of(auth.uid(), bi.organization_id)
    )
  );

-- INSERT/UPDATE/DELETE ficam apenas com service role (webhook flunx-api).
