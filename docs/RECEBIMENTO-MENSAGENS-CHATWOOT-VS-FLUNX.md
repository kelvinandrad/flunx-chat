# Recebimento de mensagens: Chatwoot (Evolution) vs Flunx

**Data:** 6 de fevereiro de 2026  
**Objetivo:** Usar o Chatwoot (e o código aberto da Evolution) como referência para entender o que estamos fazendo diferente no recebimento de mensagens, em especial áudio/mídia.

---

## 1. Quem recebe o quê

| Aspecto | Chatwoot (via Evolution) | Flunx |
|--------|---------------------------|--------|
| **Quem recebe o evento** | A **própria Evolution API** (processo que está conectado ao Baileys/WhatsApp). | **Worker flunx-rabbitmq-api**, que consome da fila RabbitMQ `flunx_evolution_events`. |
| **Origem do evento** | Baileys emite `messages.upsert` **dentro** do processo da Evolution. | Evolution publica o mesmo evento no Rabbit (webhook ou integração com fila). O worker consome o **JSON** da fila. |
| **Acesso ao “mundo” WhatsApp** | Evolution tem **waInstance** (cliente Baileys). Pode chamar `downloadMediaMessage()`, `profilePicture()`, etc. | Worker **não** tem acesso à instância Baileys. Só enxerga o **payload JSON** que chegou na mensagem Rabbit. |

Consequência direta: para **mídia** (áudio, imagem, vídeo), a Evolution pode **baixar o arquivo** e enviá-lo ao Chatwoot. Nós só podemos usar o que já vier no payload (ex.: `mediaUrl` se a Evolution tiver colocado).

---

## 2. Fluxo Evolution → Chatwoot (recebimento)

Baseado no código aberto: [EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api), `src/api/integrations/chatbot/chatwoot/services/chatwoot.service.ts`.

1. **Evento** `messages.upsert` (ou `send.message`) é tratado **dentro** do processo Evolution, em `eventWhatsapp()`.
2. **Conversa no Chatwoot:**  
   `createConversation(instance, body)` → Contact → ContactInbox → Conversation (ou reabre). Usa cache e lock para evitar duplicar conversa.
3. **Tipo de mensagem:**
   - **Mídia** (`isMediaMessage`): a Evolution obtém o **buffer/stream do arquivo** (via Baileys, ex. `downloadMediaMessage` ou equivalente). Monta um `Readable` com esse buffer e chama **`sendData(conversationId, fileStream, fileName, messageType, content, ...)`**.
   - **`sendData`** faz **POST multipart/form-data** para:
     - `POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages`
     - Com `attachments[]` = stream do arquivo, `content`, `message_type`, `source_id` (ex.: `WAID:messageId`).
   - O Chatwoot persiste a mensagem e o **anexo** (storage); o front usa `attachments[].data_url` para tocar/baixar (ex.: áudio).
   - **Texto (sem mídia):** chama `createMessage(..., content, messageType, [], body, 'WAID:' + body.key.id, quotedMsg)` → POST JSON com `content` e `message_type`, sem attachment.

Ou seja: no fluxo Chatwoot, a **mídia é o arquivo em si** enviado no POST; a Evolution **já tem o arquivo** porque está no mesmo processo que o Baileys.

---

## 3. Fluxo Evolution → Rabbit → Flunx (recebimento)

1. A Evolution emite o evento (ex.: ao receber mensagem do WhatsApp) e **publica no Rabbit** (ou envia para um webhook que nós consumimos e republimos). O **corpo da mensagem** é um JSON com `event`, `instance`, `data` (key, message, messageTimestamp, etc.).
2. O **worker flunx-rabbitmq-api** consome essa mensagem, chama `processEvent(payload)` e, para `MESSAGES_UPSERT`, chama `handleMessagesUpsert(instanceName, data)`.
3. No handler nós:
   - Normalizamos a lista de mensagens (um item com `data.key` + `data.message` ou array em `data.messages`).
   - Buscamos o inbox por `evolution_instance_name`.
   - Para cada mensagem: `findOrCreateContact` → `findOrCreateConversation` → extraímos conteúdo com `extractMessageContent(msg)` (para áudio devolve `"[Áudio]"`).
   - Inserimos em **chat_messages** com `content`, `message_type`, `evolution_message_id`, e, **se** existir no payload, `media_url`, `duration_seconds`, `waveform` (para áudio).

Diferença crítica: nós **não baixamos** nenhum arquivo. Só lemos o que vem em `data` (ex.: `data.message.mediaUrl`). Se a Evolution **não incluir** `mediaUrl` (ou `media_url`) no payload que vai para o Rabbit, nosso worker nunca terá a URL do áudio e gravará só `content: "[Áudio]"` e `media_url: null`.

---

## 4. Onde está a diferença (resumo)

| Etapa | Chatwoot (Evolution) | Flunx |
|-------|----------------------|--------|
| Onde o evento é tratado | Dentro da Evolution (mesmo processo que Baileys). | Worker separado; só recebe JSON do Rabbit. |
| Acesso ao arquivo de mídia | Evolution usa Baileys para **baixar** o mídia (buffer/stream) e envia esse arquivo no POST ao Chatwoot (`attachments[]`). | Worker **não** tem como baixar; usa apenas o que vier no JSON (ex.: `message.mediaUrl`). |
| Persistência de mídia | Chatwoot guarda o **anexo** (arquivo) e expõe URL (ex.: `data_url`). | Guardamos em **chat_messages** as colunas `media_url`, `duration_seconds`, `waveform` **somente se** o payload já trouxer (ex.: `message.mediaUrl`). |
| Quando a URL existe | Sempre que a Evolution envia o arquivo: o Chatwoot gera a URL do anexo. | Só quando a Evolution **inclui** `mediaUrl` (ou equivalente) no payload que é publicado no Rabbit. |

Ou seja: **não é que o Chatwoot “recebe de outro jeito”** — é que quem envia para o Chatwoot é a **própria Evolution**, com acesso ao Baileys, então ela **entrega o arquivo**. Para nós, quem “entrega” é o **payload da fila**; se esse payload não tiver URL de mídia (porque a Evolution não coloca ou coloca em outro momento/canal), nosso fluxo fica sem `media_url`.

---

## 5. O que a Evolution pode colocar no payload (webhook/fila)

- Em muitos setups, o evento `messages.upsert` que vai para webhook/Rabbit é o **mesmo** que a Evolution usa internamente para o Chatwoot, mas **antes** de processar/baixar mídia ou **sem** enriquecer com URL.
- Se a Evolution usar **storage** (ex.: S3) e **enriquecer** o objeto da mensagem com `mediaUrl` antes de publicar no Rabbit (ou no webhook), esse campo pode chegar ao nosso worker e aí conseguimos gravar `media_url` em **chat_messages**.
- Referência de formato (doc/issue Evolution): em `messages.upsert`, para áudio pode existir `data.message.mediaUrl`, `data.message.audioMessage.seconds`, `data.message.audioMessage.waveform`. Nosso worker já lê esses campos quando existem; o que falta é o **payload que chega na fila** realmente trazê-los.

---

## 6. Referências (código aberto)

- **Evolution – integração Chatwoot:**  
  [evolution-api/src/api/integrations/chatbot/chatwoot/services/chatwoot.service.ts](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/integrations/chatbot/chatwoot/services/chatwoot.service.ts)  
  - `eventWhatsapp('messages.upsert', ...)`: tratamento de mídia com `sendData` (multipart com `attachments[]`).  
  - `createMessage(...)`: mensagem só texto (sem anexo).  
  - `isMediaMessage()`, `getConversationMessage()`, etc.
- **Documentação Evolution – Chatwoot:**  
  [Chatwoot - Evolution API](https://doc.evolution-api.com/v2/en/integrations/chatwoot)
- **Chatwoot – criar mensagem com anexo:**  
  [Create a message (multipart)](https://developers.chatwoot.com/api-reference/messages-api/create-a-message) (POST multipart com `attachments[]`).
- **Docs locais:**  
  `AUDIO-URL-CHATWOOT-VS-NOSSO.md`, `ANALISE-CHATWOOT-BACKEND-E-FLUXO-EVOLUTION.md`, `INVESTIGACAO-CHATWOOT-EVOLUCAO.md`.

---

## 7. Conclusão

- **Chatwoot “funciona”** para áudio/mídia porque a Evolution está no mesmo processo que o Baileys e **envia o arquivo** (stream) para a API do Chatwoot; o Chatwoot armazena e gera a URL.
- **No Flunx** nós **não temos** o arquivo; temos só o JSON do Rabbit. Por isso:
  - Precisamos que o **payload** que a Evolution envia para a fila (ou webhook que alimenta a fila) já venha com **`mediaUrl`** (e, se possível, `seconds`/`waveform` para áudio), **ou**
  - Implementar um passo extra (ex.: chamar API da Evolution para obter mídia por `messageId` e gravar a URL ou o arquivo em nosso storage e então gravar `media_url` em **chat_messages**).

Usar o Chatwoot como referência mostra que o “segredo” é **quem tem o arquivo e quem o entrega**: no caso deles, a Evolution entrega o arquivo; no nosso, dependemos do que vier no payload ou de uma segunda chamada à Evolution.
