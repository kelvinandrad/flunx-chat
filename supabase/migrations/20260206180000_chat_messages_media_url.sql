-- Armazenar URL e metadados de mídia (áudio, etc.) para exibir player no front.
-- Evolution envia mediaUrl, audioMessage.seconds, audioMessage.waveform no evento messages.upsert.

ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS media_url TEXT;

ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS duration_seconds SMALLINT;

ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS waveform TEXT;

COMMENT ON COLUMN public.chat_messages.media_url IS 'URL do arquivo de mídia (ex.: áudio S3) para reprodução no player';
COMMENT ON COLUMN public.chat_messages.duration_seconds IS 'Duração do áudio em segundos (Evolution audioMessage.seconds)';
COMMENT ON COLUMN public.chat_messages.waveform IS 'Waveform em base64 (Evolution audioMessage.waveform) para visualização';
