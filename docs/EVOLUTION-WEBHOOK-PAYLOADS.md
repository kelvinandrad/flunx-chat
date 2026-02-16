# Schema dos payloads dos webhooks Evolution API

Documentação extraída do uso em `flunx-api/src/webhookEvolution.js`. A Evolution pode enviar `event` com ponto (ex.: `connection.update`) ou hífen; a API normaliza para `CONNECTION_UPDATE` com `.toUpperCase().replace(/-/g, "_").replace(/\./g, "_")`.

---

## Nomenclatura Evolution vs Flunx

| Na Evolution API | No Flunx (Supabase / UI) | Descrição |
|------------------|--------------------------|-----------|
| **Contact** | **Contato** (`chat_contacts`) | Pessoa ou grupo: identificado por JID (ex.: `5562999999999@s.whatsapp.net` ou `xxx@g.us`). Evolution: `contacts.set`, `findContacts`. |
| **Chat** | **Conversa** (`chat_conversations`) | Um “chat” na Evolution = uma conversa com um contato (1:1 ou grupo). Um chat tem um único `id`/`remoteJid`. Evolution: `chats.set`, `findChats`. No Flunx: 1 conversa = 1 linha por `(inbox_id, contact_id)`. |
| **Message** | **Mensagem** (`chat_messages`) | Uma mensagem dentro de um chat. Evolution: `messages.upsert`, `key.remoteJid` indica o chat; no Flunx: `conversation_id` liga à conversa. |

**Regra importante:** 1 chat (Evolution) = 1 contato + 1 conversa (Flunx). Se o mesmo contato aparecer com dois JIDs diferentes (ex.: `5562...` e `5562...@s.whatsapp.net`), a API normaliza para um único `remote_jid` canônico para evitar duplicar contato e conversa. A listagem do Flunx Chat usa `only_with_messages: true` por padrão, então só aparecem conversas que têm pelo menos uma mensagem (comportamento alinhado ao WhatsApp Web).

---

**Campos comuns em todos os payloads (quando aplicável):**

- `event` ou `eventType` ou `type`: string — tipo do evento (ex.: `"connection.update"`, `"chats.set"`).
- `instance` ou `instanceName` ou `data.instance`: string — nome da instância (ex.: `"flunx-teste-n8-if95yw69"`).
- `data`: objeto ou array — corpo do evento (em muitos eventos os dados vêm em `payload.data` ou o próprio `payload` é o dado).

---

## 1. CONNECTION_UPDATE (`connection.update`)

**Uso:** Atualizar `chat_inboxes` (connection_status, perfil WhatsApp quando conectado) e disparar sync após `open`.

| Campo | Tipo | Onde | Descrição |
|-------|------|------|-----------|
| `state` | string | `payload.state` ou `payload.data.state` ou `payload.connectionStatus` ou `payload.status` | `"open"` \| `"connected"` \| `"connecting"` \| `"close"` \| `"disconnected"` \| `"logout"` |
| `data` | object | opcional | Quando state é open, pode conter perfil |
| `data.profileName` / `data.profile_name` | string | | Nome do perfil WhatsApp |
| `data.profilePictureUrl` / `data.profile_picture_url` / `data.profilePicUrl` | string | | URL da foto de perfil |
| `data.wuid` / `data.wid` / `payload.sender` | string | | JID do usuário (ex.: `5562999999999@s.whatsapp.net`) |

**Exemplo mínimo:**  
`{ "event": "connection.update", "instance": "minha-instancia", "state": "open", "data": { "profileName": "João", "wuid": "5562999999999@s.whatsapp.net" } }`

---

## 2. QRCODE_UPDATED (`qrcode.updated`)

**Uso:** Atualizar QR em `chat_inboxes` para exibição no front.

| Campo | Tipo | Onde | Descrição |
|-------|------|------|-----------|
| `qrcode` / `base64` / `qrCode` | string | `payload` ou `payload.data` | QR em base64 |
| `date_time` / `dateTime` | string | `payload` ou `payload.data` | Data/hora do QR (ex.: ISO 8601) |

---

## 3. LABELS_EDIT (`labels.edit`)

**Uso:** Upsert em `chat_inbox_labels` (etiquetas do WhatsApp).

| Campo | Tipo | Onde | Descrição |
|-------|------|------|-----------|
| `data` | object | | Um objeto por evento (não array na prática) |
| `data.id` | string/number | | ID da etiqueta na Evolution (evolution_label_id) |
| `data.name` | string | | Nome da etiqueta |
| `data.color` | number | | Cor (número) |
| `data.deleted` | boolean | | Se a etiqueta foi deletada |
| `data.predefinedId` | string/number | | ID pré-definido (opcional) |

---

## 4. CONTACTS_SET / CONTACTS_UPSERT / CONTACTS_UPDATE (`contacts.set`, `contacts.upsert`, `contacts.update`)

**Uso:** Upsert em `chat_contacts` e atualizar contadores.

`data` pode ser **um objeto** (um contato) ou **um array** de contatos. A API usa `normalizeToArray(data)` para sempre trabalhar com array.

| Campo (por contato) | Tipo | Descrição |
|--------------------|------|-----------|
| `id` / `remoteJid` / `jid` | string | JID (ex.: `5562999999999@s.whatsapp.net`) — obrigatório |
| `pushName` / `name` | string | Nome exibido |

**Exemplo:**  
`{ "event": "contacts.upsert", "instance": "x", "data": [ { "id": "5562999999999@s.whatsapp.net", "pushName": "Maria" } ] }`  
ou `"data": { "id": "5562...", "pushName": "Maria" }`

---

## 5. CHATS_SET / CHATS_UPSERT / CHATS_UPDATE (`chats.set`, `chats.upsert`, `chats.update`)

**Uso:** Garantir contatos e upsert em `chat_conversations` (e contadores).

`data` pode ser **um chat** ou **array de chats**. Cada item:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` / `remoteJid` / `jid` | string | JID do chat — obrigatório |
| `pushName` / `name` | string | Nome do chat/contato |
| `archive` / `archived` | boolean | Chat arquivado |
| `pin` / `pinned` | boolean | Chat fixado |

---

## 6. CHATS_DELETE (`chats.delete`)

**Uso:** Remover conversa em `chat_conversations` (contato permanece).

**Formato real da Evolution:** `data` é **array de JIDs** (strings), ex.: `data: [ '252609088778404@lid' ]`. A API aceita array ou objeto único.

| Campo | Tipo | Onde | Descrição |
|-------|------|------|-----------|
| `data` | array ou object | | Array de JIDs (strings) ou um objeto com id/remoteJid/jid |
| `data[i]` (se array) | string | | JID do chat removido (ex.: `252609088778404@lid`) |
| `data.id` / `data.remoteJid` / `data.jid` | string | (se data for objeto) | JID do chat removido |

**Comparar logs:** Evolution loga `event: 'chats.delete'`, `data: [ '...@lid' ]`; API loga `[webhook] event=chats.delete` e `[webhook] CHATS_DELETE <instance> conversa removida jid: ...` (ou "contato não encontrado").

---

## 7. MESSAGES_SET / MESSAGES_UPSERT (`messages.set`, `messages.upsert`)

**Uso:** Persistir mensagens em `chat_messages`.

Estrutura possível:

- **Opção A:** `data` é um objeto com array em `data.messages`.
- **Opção B:** `data` é a própria mensagem ou array de mensagens.

Cada **mensagem bruta** esperada:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `key` (ou a raiz é o key) | object | |
| `key.remoteJid` / `key.id` | string | JID do chat |
| `key.fromMe` | boolean | Se a mensagem é do usuário da instância |
| `key.id` | string | ID da mensagem (evolution_message_id) — obrigatório para persistir |
| `key.participant` | string | Em grupos: JID do participante que enviou |
| `message` / `messageStub` | object | Conteúdo (estrutura Baileys/Evolution) |
| `message.conversation` | string | Texto simples |
| `message.extendedTextMessage.text` | string | Texto extendido |
| `message.imageMessage` | object | Imagem (caption opcional) |
| `message.audioMessage` | object | Áudio (seconds, waveform, transcript) |
| `message.videoMessage` | object | Vídeo (caption opcional) |
| `message.documentMessage` | object | Documento |
| `message.stickerMessage` | object | Sticker |
| `message.mediaUrl` | string | URL da mídia (quando disponível) |

**Exemplo mínimo:**  
`{ "event": "messages.upsert", "instance": "x", "data": { "messages": [ { "key": { "remoteJid": "5562...@s.whatsapp.net", "fromMe": false, "id": "msg-id-123" }, "message": { "conversation": "Olá" } } ] } }`

---

## 8. MESSAGES_UPDATE / MESSAGES_DELETE / SEND_MESSAGE / PRESENCE_UPDATE / etc.

**Uso na API:** Apenas log (placeholder); não persiste. Payload não documentado aqui porque não é usado para escrita no banco.

---

## Resumo rápido (por evento)

| Evento (Evolution) | Identificador no body | Dado principal | Uso na API |
|--------------------|------------------------|----------------|------------|
| CONNECTION_UPDATE | `event` / `eventType` / `type` | `state`, `data` (perfil) | connection_status + perfil + sync |
| QRCODE_UPDATED | idem | `qrcode`/`base64`, `date_time` | qr_code em chat_inboxes |
| LABELS_EDIT | idem | `data`: id, name, color, deleted | chat_inbox_labels |
| CONTACTS_* | idem | `data`: objeto ou array de { id/remoteJid/jid, pushName/name } | chat_contacts |
| CHATS_* (set/upsert/update) | idem | `data`: objeto ou array de { id/remoteJid/jid, pushName/name, archive, pin } | chat_contacts + chat_conversations |
| CHATS_DELETE | idem | `data`: { id/remoteJid/jid } | remove conversa |
| MESSAGES_SET / MESSAGES_UPSERT | idem | `data` ou `data.messages`: array de { key, message } | chat_messages |

*Documento gerado a partir do código em flunx-api. A Evolution API não documenta publicamente o schema exato de cada evento; este reflete o que a flunx-api lê e persiste.*
