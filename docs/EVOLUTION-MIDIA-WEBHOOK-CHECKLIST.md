# Checklist – Mídia no webhook Evolution (Fase 1.1)

**Objetivo:** Garantir que mensagens de mídia recebidas via Evolution tenham URL disponível no Flunx (campo `media_url` em `chat_messages`).

---

## 1. Configuração na Evolution API

- [ ] **Storage (S3 ou compatível)**  
  Habilitar storage na Evolution para que as mídias baixadas do WhatsApp sejam enviadas para um bucket e a Evolution inclua a **URL** no payload do webhook.
  - Documentação Evolution: [Configuração de storage](https://github.com/EvolutionAPI/evolution-api) (ver seção de variáveis de ambiente / config).
  - Quando o storage está ativo, a Evolution faz upload das mídias e pode incluir a URL no objeto da mensagem (ex.: `message.mediaUrl` ou campo equivalente no payload).

- [ ] **Webhook com payload enriquecido**  
  Garantir que o webhook configurado (o que o Flunx recebe) seja chamado com o payload que **inclui o campo de mídia** (ex.: `mediaUrl`) quando a mensagem for de tipo imagem, áudio, vídeo, documento, etc.
  - Se a Evolution publicar em fila (RabbitMQ/SQS) e o Flunx consumir da fila, confirmar que o corpo da mensagem inclui `mediaUrl` (ou equivalente) quando há storage.

- [ ] **Nome do campo no payload**  
  O Flunx hoje procura por `message.mediaUrl` em `extractMessageContent` (webhook). Se a sua versão da Evolution usar outro nome (ex.: `mediaUrl`, `url`, `fileUrl`), pode ser necessário ajustar o mapeamento no `webhookEvolution.js` ou garantir que a Evolution envie `mediaUrl`.

---

## 2. Validação

- [ ] Enviar uma mensagem de **imagem** de um número de teste para o WhatsApp conectado à Evolution.
- [ ] Verificar no Flunx (banco ou API de mensagens) se a mensagem correspondente tem `media_url` preenchido.
- [ ] Repetir para **áudio** (e opcionalmente vídeo/documento) se necessário.

---

## 3. Fallback (Fase 1.2)

Se o webhook **não** trouxer `mediaUrl` (ex.: Evolution sem storage ou versão que não enriquece o payload):

- O Flunx oferece o endpoint **POST /conversations/:conversationId/messages/:messageId/fetch-media** que:
  1. Busca a mídia na Evolution via API (Get Base64),
  2. Faz upload no **Supabase Storage** (bucket `chat-media`),
  3. Atualiza `chat_messages.media_url` com a URL pública do arquivo.

**Requisito:** Criar o bucket **chat-media** no projeto Supabase (Storage) e deixá-lo **público para leitura** (ou a URL retornada por `getPublicUrl` não funcionará para o front). Se preferir bucket privado, será necessário usar URLs assinadas (signed URLs) ao expor a mídia para o cliente.

---

**Referências**

- [Evolution API – Get Base64](https://docs.evoapicloud.com/api-reference/chat-controller/get-base64)
- [PLANO-IMPLEMENTACAO-ESTILO-CHATWOOT.md](./PLANO-IMPLEMENTACAO-ESTILO-CHATWOOT.md) (Fase 1)
