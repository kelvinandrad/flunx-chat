# Modelagem: backend idêntico ao Chatwoot + front Flunx-Chat

Este documento descreve como seria usar um **backend no modelo Chatwoot** (dados e APIs iguais ao Chatwoot) com o **frontend Flunx-Chat**. Objetivo: servir de referência para modelar armazenamento e processamento em cima do Chatwoot, sem propor correções pontuais no código atual.

---

## 1. Visão geral

- **Backend (modelo Chatwoot):** Account → Inboxes (canais) → ContactInbox (vínculo contato–inbox com `source_id`) → Contact (nome, avatar, identifier, phone_number) → Conversation (por contact_inbox) → Message (content, content_type, message_type) → Attachment (file_type, data_url/external_url).
- **Frontend (Flunx-Chat):** Consome APIs de listagem de conversas, mensagens e envio; exibe lista de conversas (contato, preview, avatar), área de chat (mensagens, áudio, mídia) e painel do contato (nome, avatar, dados).

O contrato entre os dois é o **formato das APIs**: o que o front espera receber e enviar deve ser o que um backend “idêntico ao Chatwoot” expõe.

---

## 2. Modelo de dados Chatwoot (resumo)

Fonte: `flunx-appchat/db/schema.rb` e modelos em `app/models`.

### 2.1 Conta e canais

- **accounts** – Conta (tenant).
- **inboxes** – Canal de atendimento; `channel_id` + `channel_type` (ex.: Channel::Whatsapp, Channel::Api).
- **channel_*** – Tabelas específicas por canal (ex.: channel_whatsapp com phone_number, provider_config).

### 2.2 Contato e vínculo com inbox

- **contacts**
  - `id`, `account_id`, `name` (default ""), `email`, `phone_number`, `identifier`
  - `additional_attributes` (jsonb), `custom_attributes` (jsonb)
  - Avatar: **não fica na tabela**; Chatwoot usa `has_one_attached :avatar` (Active Storage). Na API o contato expõe `thumbnail` / `avatar_url` (URL do avatar).
- **contact_inboxes**
  - `contact_id`, `inbox_id`, **`source_id`** (text, único por inbox) – identificador do contato no canal (ex.: JID WhatsApp, waid).
  - Um contato pode ter vários contact_inboxes (um por inbox).

Regra Chatwoot: contato é por **account**; o vínculo com um canal é **contact_inbox** com `source_id`. Nome e avatar vêm do **Contact** (nome no `contacts.name`, avatar via Active Storage → URL).

### 2.3 Conversação

- **conversations**
  - `account_id`, `inbox_id`, **`contact_id`**, **`contact_inbox_id`**
  - `status`, `assignee_id`, `display_id`, `uuid`
  - `last_activity_at`, timestamps, etc.

Cada conversa é “uma thread” por (inbox + contact_inbox). O **contato** (nome, avatar) é sempre resolvido via `conversation.contact`.

### 2.4 Mensagens e anexos

- **messages**
  - `conversation_id`, `inbox_id`, `account_id`
  - **`content`** (texto ou legenda)
  - **`message_type`** (enum: incoming, outgoing, activity, template)
  - **`content_type`** (enum: text, input_text, …)
  - **`source_id`** (id externo da mensagem, ex.: id da Evolution/Meta)
  - `sender_type`, `sender_id` (Contact ou User)
  - `content_attributes` (json), `additional_attributes` (jsonb)

- **attachments**
  - **`message_id`**, **`file_type`** (enum: image, audio, video, file, location, fallback, …)
  - **`external_url`** – URL externa da mídia (usado quando o arquivo não está no Active Storage; ex.: Instagram, links)
  - Opcional: `file` (Active Storage) – quando a mídia foi baixada e armazenada
  - `extension`, `fallback_title`, `meta` (jsonb; ex.: transcribed_text para áudio)

No Chatwoot, áudio/imagem/vídeo/arquivo são **attachments** ligados à mensagem. A mensagem pode ter `content` vazio ou com legenda. A URL de reprodução/download vem do attachment: `data_url` (blob) ou **`external_url`** quando não há arquivo anexado.

Referência: `app/models/attachment.rb` – `file_metadata` usa `external_url` para Instagram quando `message.incoming?`; `audio_metadata` herda `data_url`/file; `embed_data` e `fallback_data` usam `external_url`.

---

## 3. APIs Chatwoot relevantes ao front Flunx-Chat

Baseado em `app/views/api/v1/accounts/` e `app/models/*.rb` (push_event_data, jbuilder).

### 3.1 Listar conversas (lista lateral)

**Endpoint (estilo Chatwoot):** `GET /api/v1/accounts/:account_id/conversations` (com filtros e paginação).

**Resposta (estrutura simplificada):**

- Por conversa:
  - **meta.sender** = contato:
    - `id`, **`name`**, **`thumbnail`** (avatar_url), `identifier`, `phone_number`, `email`, `type: 'contact'`
  - **id** (display_id), **uuid**, **status**, **inbox_id**
  - **last_non_activity_message** ou **messages** (última mensagem):
    - `content`, `message_type`, `content_type`, **attachments** (array)
  - **timestamp** / **last_activity_at**, **unread_count**, **labels**, etc.

O front Flunx-Chat precisa, por conversa:

- **contact:** `id`, `name`, `avatar_url` (thumbnail)
- **preview** (texto da última mensagem; se for mídia, pode ser “[Áudio]”, “[Imagem]” etc., ou o `content` da mensagem)
- **preview_at** / **updated_at**
- **status**, **id** (conversation id)

Ou seja: o backend “idêntico ao Chatwoot” deve expor, na listagem, **contact.name** e **contact.thumbnail** (avatar) e um **preview** derivado da última mensagem (content ou tipo de attachment).

### 3.2 Detalhe da conversa + mensagens

**Estilo Chatwoot:**  
`GET /api/v1/accounts/:account_id/conversations/:id` (detalhe)  
`GET /api/v1/accounts/:account_id/conversations/:id/messages` (mensagens).

**Conversa (show):**

- **meta.contact** (ou sender) = mesmo contrato: **name**, **thumbnail**
- **contact_inbox.source_id** (para envio no canal)

**Mensagens (index):**

- **meta.contact** – de novo: **name**, **thumbnail** (para header do chat e painel do contato).
- **payload:** array de mensagens; cada uma:
  - **id**, **content**, **message_type** (incoming/outgoing), **content_type**
  - **created_at**, **status**, **source_id**
  - **sender** (se existir; para grupos)
  - **attachments** (array):
    - **file_type** (image, audio, video, file, …)
    - **data_url** ou **external_url** – URL para reproduzir/baixar mídia
    - Para áudio: pode haver **meta** (ex.: transcribed_text)

Para o front Flunx-Chat funcionar “em cima do Chatwoot”:

- Cada mensagem deve expor **attachments[]** com **file_type** e **data_url** ou **external_url**.
- Áudio: attachment com `file_type: 'audio'` e URL em `data_url`/`external_url`; opcionalmente metadados (duração, waveform) em **meta** ou **content_attributes**.
- Contato na conversa e nas mensagens: sempre **name** e **thumbnail** (avatar) preenchidos a partir do Contact.

---

## 4. Contrato que o Flunx-Chat espera (hoje)

Tipos em `flunx-chat/src/lib/chat-api-types.ts` e uso em `ChatPage`, `ConversationListPanel`, `ChatArea`, `MessageBubble`.

### 4.1 Listagem de conversas

- **ConversationListItem**
  - **contact:** `id`, **name**, **remote_jid** (ou equivalente), **avatar_url**, contact_type
  - **preview**, **preview_at**, **status**, **updated_at**, **id**

Ou seja: o backend deve retornar, por conversa, um objeto **contact** com **name** e **avatar_url** (e, se o front usar, remote_jid/source_id).

### 4.2 Mensagens

- **MessageListItem**
  - **content**, **direction** (incoming/outgoing), **message_type**, **status**, **created_at**, **id**
  - **media_url** – URL única da mídia (áudio, imagem, vídeo, documento)
  - **duration_seconds**, **waveform** (para áudio)
  - **participant_remote_jid** (grupos)

Ou seja: o front espera **uma** URL de mídia por mensagem (**media_url**) e, para áudio, **duration_seconds** e **waveform**. No modelo Chatwoot isso equivale a: mensagem com um attachment (ou o primeiro) do tipo image/audio/video/file, onde a URL é **external_url** ou **data_url** do attachment; duração e waveform podem vir em **content_attributes** ou **attachment.meta**.

### 4.3 Contato no header e no painel

- O front usa **contact.name** e **contact.avatar** (ou **avatar_url**) no header do chat e no painel “Dados do contato”.
- Esses dados devem vir da mesma fonte que a listagem: **Contact** do backend com **name** e **avatar** (thumbnail) preenchidos.

---

## 5. Mapeamento: backend Chatwoot → contrato Flunx-Chat

Para um backend **idêntico ao Chatwoot** (tabelas e fluxos iguais) servir o **Flunx-Chat**, basta uma camada de **adaptação de API** (ou o próprio backend expor um “formato Flunx”) que faça o seguinte.

### 5.1 Conversas

| Flunx-Chat (front) | Backend Chatwoot |
|--------------------|------------------|
| `conversations[].id` | conversation.uuid ou display_id |
| `conversations[].contact.name` | conversation.contact.name |
| `conversations[].contact.avatar_url` | conversation.contact.thumbnail (avatar_url) |
| `conversations[].contact.remote_jid` | conversation.contact_inbox.source_id |
| `conversations[].preview` | last message content ou “[Áudio]”/“[Imagem]” se for attachment |
| `conversations[].preview_at` | last_activity_at / last message created_at |
| `conversations[].status` | conversation.status |

Regra de ouro: **nome e avatar vêm sempre do Contact**; no Chatwoot o Contact é único por account e identificado por identifier/phone_number/email; o vínculo ao canal é contact_inbox.source_id. Ou seja: ao criar/atualizar contato a partir do canal (ex.: Evolution), o backend deve persistir **name** e **avatar** (ou URL do avatar) no Contact e expor como **name** e **thumbnail** na API.

### 5.2 Mensagens

| Flunx-Chat (front) | Backend Chatwoot |
|--------------------|------------------|
| `messages[].id` | message.id |
| `messages[].content` | message.content (ou fallback “[Mídia]” se só houver attachment) |
| `messages[].direction` | message.message_type (incoming/outgoing) |
| `messages[].message_type` | derivado de message.content_type + attachments[].file_type |
| `messages[].media_url` | attachments[0].data_url ou attachments[0].external_url |
| `messages[].duration_seconds` | attachment.meta ou content_attributes (audio) |
| `messages[].waveform` | attachment.meta ou content_attributes (audio) |
| `messages[].participant_remote_jid` | sender ou additional_attributes (grupos) |

Regra: mensagens com mídia no Chatwoot têm **attachments**; a URL de exibição é **external_url** (quando não há file em Active Storage) ou **data_url** (blob). O front Flunx-Chat espera uma única **media_url** por mensagem: equivale ao primeiro attachment de mídia (image/audio/video/file).

### 5.3 Envio de mensagem

- Front envia **content** (texto).
- Backend Chatwoot: cria Message (content_type: text, message_type: outgoing) e, se o canal exigir, envia via provider (ex.: Evolution/WhatsApp). Para mídia, o front poderia enviar **attachment** com URL ou arquivo; o backend criaria Message + Attachment (external_url ou file).

---

## 6. Processamento e armazenamento “igual ao Chatwoot”

Para o **processamento e armazenamento** ficarem idênticos ao Chatwoot, ao receber eventos do canal (ex.: webhook Evolution):

1. **Contato**
   - Identificar por **source_id** (ex.: remoteJid) no **contact_inbox** daquele inbox.
   - Se não existir, criar **Contact** (account_id, **name** a partir de pushName/profile, identifier/phone_number) e **ContactInbox** (inbox_id, contact_id, **source_id**).
   - Atualizar **Contact.name** quando o canal enviar nome (pushName, profile).
   - **Avatar:** Chatwoot usa `avatar_url` no create/update do contact e dispara job para baixar e anexar (Active Storage); na API expõe **thumbnail**. Ou seja: persistir ou buscar URL da foto de perfil e associar ao Contact (via avatar_url ou attachment).

2. **Conversa**
   - Buscar ou criar **Conversation** por (inbox_id, contact_inbox_id). Garantir que conversation.contact_id aponte para o Contact correto (nome e avatar).

3. **Mensagem**
   - Criar **Message** (conversation_id, content, message_type, content_type, source_id, sender = contact quando incoming).
   - Se houver mídia (áudio, imagem, vídeo, documento):
     - Criar **Attachment** (message_id, **file_type**, **external_url** = mediaUrl quando não for armazenar arquivo; ou file se for armazenar).
     - Para áudio: preencher **meta** (ou content_attributes na message) com duration, waveform se o canal enviar.

4. **Preview na listagem**
   - Última mensagem: usar **content** se presente; se for só attachment, usar texto tipo “[Áudio]”, “[Imagem]” conforme file_type do attachment.

Com isso, o **armazenamento** fica alinhado ao Chatwoot (contacts com nome e avatar; contact_inboxes com source_id; messages com attachments com external_url/data_url), e a **API** pode expor exatamente o que o Flunx-Chat precisa (contact.name, contact.avatar_url, messages[].media_url, etc.), seja nativamente no formato Chatwoot e o front se adaptando, seja numa camada que traduz Chatwoot → contrato Flunx.

---

## 7. Resumo

- **Backend “idêntico ao Chatwoot”:** Contact (name + avatar), ContactInbox (source_id), Conversation (por contact_inbox), Message (content, content_type, message_type), Attachment (file_type, external_url/data_url).
- **Front Flunx-Chat:** Espera por conversa **contact.name** e **contact.avatar_url**; por mensagem **media_url** (e para áudio duration_seconds, waveform).
- **Modelagem:** Garantir que (1) nome e avatar do contato sejam sempre persistidos e expostos na API; (2) mídia seja armazenada como attachment com external_url (ou data_url) e exposta como media_url (e metadados de áudio); (3) preview da última mensagem reflita conteúdo ou tipo de mídia.

Assim, “usar um backend idêntico ao Chatwoot com o front Flunx-Chat” fica bem definido: mesmo modelo de dados e fluxos do Chatwoot, com contrato de API (ou adaptador) que preencha os campos que o Flunx-Chat consome.
