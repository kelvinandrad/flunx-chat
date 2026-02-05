-- Sincronizar contador do modal de QR com o date_time do evento qrcode.updated da Evolution.
ALTER TABLE public.chat_inboxes ADD COLUMN IF NOT EXISTS qr_code_generated_at TIMESTAMPTZ;
COMMENT ON COLUMN public.chat_inboxes.qr_code_generated_at IS 'Quando a Evolution gerou este QR (date_time do evento qrcode.updated)';
