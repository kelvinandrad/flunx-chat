# Checklist – Eventos por etapa (Chat ↔ Evolution ↔ API ↔ Supabase)

**Instância de teste:** `flunx-teste-n1v2-ozoiagev`  
**Objetivo:** Entender o fluxo completo de cada tipo de evento em cada camada para analisar logs e diagnosticar falhas.

---

## Como analisar os logs (onde olhar)

- **Chat (front):** Console do navegador (F12 → Console); rede (Network) para ver chamadas à API.
- **Evolution:** `docker service logs evolution_evolution --tail 500`
- **API (flunx-api):** `docker service logs flunx-api_api --tail 500` — cada requisição loga `[YYYY-MM-DD] METHOD path status ms`; webhook loga `[webhook] event=... instance=...`.
- **Supabase:** Dashboard → Logs (Postgres, API, Realtime).

---

## Análise de logs (VPS) – instância flunx-teste-n1v2-ozoiagev

### O que a Evolution envia (logs reais)

- **URL webhook:** `https://api.flunx.com.br/webhook/evolution` (e subpaths). **Usar apenas api.flunx.com.br** (não api-canais.flunx.com.br). Evolution e front devem apontar para essa URL.
- **Eventos observados:** `messages.upsert`, `contacts.update`, `chats.update`, `chats.upsert`, `presence.update`, `messages.update`.
- **Exemplo messages.upsert:** `key`: `remoteJid` (ex.: `120363406347716983@g.us`), `fromMe`, `id`, `participant` (grupos); `message.conversation` (texto); `messageTimestamp`.
- **Erro Evolution:** Em vários eventos a Evolution loga **"Request failed with status code 500"** e **"Todas as tentativas falharam"** ao chamar a API — ou seja, a API está devolvendo **500** em parte das requisições de webhook.

### O que a API processa e erros encontrados

1. **Webhook recebido (200):** A API loga `[webhook] event=X instance=flunx-teste-n1v2-ozoiagev` e responde 200. Porém, quando o **handler** falha com exceção não tratada ou quando o Express trata um erro, a resposta pode ser **500** (e a Evolution faz retry até 10x).
2. **Erro 42P10 (MESSAGES):** Nos logs apareceu: *"there is no unique or exclusion constraint matching the ON CONFLICT specification"* no upsert de `chat_messages`. O código usa `upsert(..., { onConflict: "evolution_message_id" })`; no Supabase onde a API aponta pode não existir a constraint **UNIQUE(evolution_message_id)** (migração `20260210150000_chat_messages_unique_evolution_message_id.sql`). **Correção aplicada:** fallback: se 42P10, fazer `insert`; se 23505 (duplicata), ignorar.
3. **Erro 23502 (CHATS):** *"null value in column \"organization_id\" of relation \"chat_conversations\" violates not-null constraint"* ao inserir conversa. Isso ocorre se `inbox.organization_id` for null (ex.: inbox antigo sem org). **Correção aplicada:** não inserir conversa se `inbox.organization_id` for null e logar; logar também erro de insert de conversa.

### Resumo por evento (flunx-teste-n1v2-ozoiagev)

| Evento Evolution | API recebe | API processa | Supabase |
|------------------|------------|--------------|----------|
| connection.update | POST /webhook/evolution | handleConnectionUpdate → update chat_inboxes; syncInboxAfterConnect (findContacts + findChats) | chat_inboxes.connection_status, perfil; depois contatos/conversas |
| qrcode.updated | POST /webhook/evolution | handleQrcodeUpdated → update chat_inboxes (qr_code, qr_code_generated_at) | chat_inboxes.qr_code |
| contacts.set/upsert/update | POST /webhook/evolution | handleContactsSetUpsertUpdate → upsert chat_contacts + chat_contact_inboxes; updateInboxCounts; enrichment job | chat_contacts, chat_contact_inboxes, chat_inboxes.contacts_count |
| chats.set/upsert/update | POST /webhook/evolution | handleChatsSetUpsertUpdate → contact + contact_inbox; para cada chat: abrir ou criar conversa (organization_id obrigatório) | chat_conversations, chat_inboxes.conversations_count |
| messages.set/upsert | POST /webhook/evolution | handleMessagesUpsertSet → ensureContactAndConversation; upsert chat_messages (onConflict evolution_message_id; fallback insert se 42P10) | chat_messages |
| presence.update / messages.update | POST /webhook/evolution | handleMessagesPlaceholder — só log, sem persistência | — |

**Ação recomendada:** Garantir no Supabase que a constraint `chat_messages_evolution_message_id_key` (UNIQUE em `evolution_message_id`) exista — rodar a migração `20260210150000_chat_messages_unique_evolution_message_id.sql` se ainda não foi aplicada. Rebuild/redeploy da API para subir o fallback e o guard de `organization_id`.

---

## 1. Criar canal (instância) e conectar

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Usuário preenche nome, org; clica criar. Front chama `POST /channels` com `{ type, name, organization_id }`. | — | API valida auth e org; gera `instanceName` (slug- nome-sufixo); chama Evolution `POST /instance/create` com `instanceName`, `integration: WHATSAPP-BAILEYS`, `qrcode: true`. | — |
| **Resposta / efeito** | Recebe 201 com `inbox`, `qrCode` (data URL); exibe modal com QR; pode subscrever Realtime em `chat_inboxes` para novo QR. | Cria instância; pode enviar webhook `QRCODE_UPDATED` para a URL configurada (Flunx: `/webhook/evolution`). | Após criar instância, chama `GET /instance/connect/:instanceName`; normaliza QR; insere em `chat_inboxes` (org_id, name, channel_type, evolution_instance_name, connection_status, qr_code, qr_code_generated_at). | Linha em `chat_inboxes` com `evolution_instance_name = flunx-teste-n1v2-ozoiagev` (ou nome usado). |

**Fluxo resumido:** Front → API POST /channels → Evolution create + connect → API insere `chat_inboxes` no Supabase → Front mostra QR.

---

## 2. QR Code atualizado (antes de escanear)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Pode fazer polling em `GET /channels/:inboxId/qrcode` ou usar Realtime em `chat_inboxes` (coluna `qr_code`). | Gera novo QR periodicamente; envia webhook `QRCODE_UPDATED` (event + instance + qrcode/base64). | Rota webhook `POST /webhook/evolution`: identifica evento `QRCODE_UPDATED`; chama `updateInboxByInstance(instance, { qr_code, qr_code_generated_at })`. | UPDATE em `chat_inboxes` onde `evolution_instance_name = instance` (qr_code, qr_code_generated_at, updated_at). |
| **Resposta / efeito** | Se usar Realtime, recebe novo `qr_code` e atualiza a imagem. Se polling, próximo GET retorna novo QR. | — | Responde 200 ao webhook. | QR e data/hora persistidos. |

---

## 3. CONNECTION_UPDATE (conexão aberta / escaneou QR)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Pode chamar `GET /channels/:inboxId/info` para ver `connection_status`; ou Realtime em `chat_inboxes.connection_status`. | Ao conectar, envia webhook `CONNECTION_UPDATE` com `state: open` (ou `connected`), opcionalmente profileName, profilePictureUrl, wuid/wid. | Webhook: `handleConnectionUpdate`; define `connection_status` (open/connected → "connected"; close → "disconnected"; connecting → "pending"); atualiza também whatsapp_profile_name, whatsapp_profile_pic_url, whatsapp_jid, whatsapp_phone_number em `chat_inboxes`; chama `updateInboxCounts(inboxId)`; agenda `syncInboxAfterConnect(instance)`. | UPDATE `chat_inboxes`: connection_status, perfil WhatsApp, updated_at. Depois: sync contatos/chats (ver eventos 4 e 5). |
| **Resposta / efeito** | Status "connected"; modal pode fechar. | — | 200; em dev log `[webhook] CONNECTION_UPDATE instance state -> connectionStatus`. | Contadores (contacts_count, conversations_count) atualizados; se sync rodar, contatos e conversas criados/atualizados. |

---

## 4. CONTACTS_SET / CONTACTS_UPSERT / CONTACTS_UPDATE

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Não envia este evento. Lista contatos via `GET /inboxes/:inboxId/contacts`. | Envia webhook com `data` = contato ou array de contatos (id/remoteJid/jid, pushName/name). Também pode ser disparado após conexão via sync (API chama findContacts e reutiliza o mesmo handler). | Webhook: `handleContactsSetUpsertUpdate`; obtém inbox por instance; normaliza JIDs; upsert em `chat_contacts` (org: organization_id, identifier, name, contact_type, updated_at); depois upsert em `chat_contact_inboxes` (inbox_id, contact_id, source_id); `updateInboxCounts(inboxId)`; agenda job de enriquecimento (fetchProfile/fetchProfilePictureUrl). | `chat_contacts`: uma linha por (organization_id, identifier). `chat_contact_inboxes`: uma linha por (inbox_id, source_id). `chat_inboxes`: contacts_count e conversations_count atualizados. |
| **Resposta / efeito** | — | — | 200; em dev log `[webhook] CONTACTS upserted instance N`. | Contatos e contact_inboxes persistidos; contador do canal atualizado. |

---

## 5. CHATS_SET / CHATS_UPSERT / CHATS_UPDATE

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Não envia. Lista conversas via `GET /inboxes/:inboxId/conversations`. | Envia webhook com `data` = chat ou array (id/remoteJid, pushName/name, archive, pin). Ou disparado no sync pós-conexão (findChats). | Webhook: `handleChatsSetUpsertUpdate`; garante contact (org) + contact_inbox para cada JID; para cada chat: se já existe conversa **open** para esse contact_inbox, atualiza is_archived/is_pinned; senão insere nova conversa (status open). `updateInboxCounts`; agenda enriquecimento. | `chat_contacts` e `chat_contact_inboxes` como no CONTACTS; `chat_conversations`: uma ou mais linhas por (inbox_id, contact_inbox_id), status open, is_archived, is_pinned. `chat_inboxes`: conversations_count atualizado. |
| **Resposta / efeito** | — | — | 200; em dev `[webhook] CHATS synced instance N`. | Conversas disponíveis para listagem no front. |

---

## 6. MESSAGES_UPSERT / MESSAGES_SET (mensagem recebida ou enviada pelo WhatsApp)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Não envia este evento. Exibe mensagens via `GET /conversations/:conversationId/messages`; Realtime em `chat_messages` para atualização ao vivo. | Ao receber ou ao enviar mensagem, envia webhook com `data` ou `data.messages`: cada item com `key` (remoteJid, fromMe, id), `message` (conteúdo), messageTimestamp; se sem key.id usa id interno (Fase 0.2). | Webhook: `handleMessagesUpsertSet`; para cada mensagem: `ensureContactAndConversation` (contact + contact_inbox + conversa open ou reaberta); extrai content, messageType, mediaUrl, etc.; evolution_message_id = key.id ou `temp_<uuid>`; upsert em `chat_messages` (conversation_id, content, direction, status, evolution_message_id, message_type, sender_type, participant_remote_jid, media_url, …). Agenda enriquecimento. | `chat_messages`: uma linha por mensagem (upsert por evolution_message_id). Conversa e contact/contact_inbox já existem ou são criados por ensureContactAndConversation. |
| **Resposta / efeito** | Se Realtime ativo, nova linha em `chat_messages` dispara invalidação e re-render. | — | 200; em dev `[webhook] MESSAGES upserted instance N`. | Mensagem armazenada; conversa com preview/updated_at se aplicável. |

---

## 7. Enviar mensagem (agente pelo Chat)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Usuário digita e envia; front chama `POST /conversations/:conversationId/messages` com `{ content: "..." }` (Bearer token). | — | `postMessage`: valida conversa e auth; obtém remote_jid do contact_inbox (source_id) ou do contact (identifier); chama Evolution `sendText(instanceName, remoteJid, content)`; insere em `chat_messages` (conversation_id, content, direction out, sender_type agent, status sent, evolution_message_id = keyId da Evolution). | INSERT em `chat_messages`. A Evolution depois pode enviar webhook SEND_MESSAGE ou MESSAGES_UPSERT (tratado como placeholder ou upsert). |
| **Resposta / efeito** | Recebe 201 com mensagem (id, content, direction outgoing, status sent); pode invalidar query de mensagens. | Recebe POST sendText; envia mensagem no WhatsApp; retorna key.id. | 201 + body da mensagem criada. | Linha em chat_messages; front pode atualizar via Realtime ou refetch. |

---

## 8. Listar conversas (Chat abre lista)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Chama `GET /inboxes/:inboxId/conversations?limit=30&only_with_messages=true` (e opcionais: before, include_archived, pinned, days). | — | `getConversationsInbox`: auth por inbox; query em `chat_conversations` com join `chat_contact_inboxes` e `chat_contacts`; filtra por is_archived, pinned, days; ordena por updated_at; retorna lista com contact (id, name, remote_jid, avatar_url, …), status, labels, preview, etc. | SELECT em chat_conversations + chat_contact_inboxes + chat_contacts; nenhuma escrita. |
| **Resposta / efeito** | Recebe `{ conversations, has_more, cursor }`; exibe lista. | — | 200 + JSON. | — |

---

## 9. Listar mensagens (Chat abre conversa)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **O que acontece** | Chama `GET /conversations/:conversationId/messages?limit=50` (e opcional `before` para paginação). | — | `getMessagesByConversationId`: valida conversa e inbox; SELECT em `chat_messages` por conversation_id; ordena por created_at; retorna array com id, content, direction, message_type, status, created_at, media_url, etc. | SELECT em chat_messages; nenhuma escrita. |
| **Resposta / efeito** | Recebe `{ messages, has_more, cursor }`; exibe thread. | — | 200 + JSON. | — |

---

## 10. Resolver / Reabrir / Nova conversa (Fase 3)

| Etapa | Chat (front) | Evolution | API | Supabase |
|-------|--------------|-----------|-----|----------|
| **Resolver** | Menu ⋯ → "Resolver conversa" → `PATCH /conversations/:id` com `{ status: "resolved" }`. | — | `patchConversation`: UPDATE chat_conversations SET status = 'resolved', updated_at. | status e updated_at atualizados. |
| **Reabrir** | Menu ⋯ → "Reabrir conversa" → `PATCH /conversations/:id` com `{ status: "open" }`. | — | UPDATE chat_conversations SET status = 'open'. | status e updated_at atualizados. |
| **Nova conversa** | Menu ⋯ → "Nova conversa com contato" → `POST /inboxes/:inboxId/conversations` com `{ contact_id: "..." }`. | — | Resolve contact_inbox_id pelo contact_id; INSERT chat_conversations (inbox_id, contact_id, contact_inbox_id, status open). Retorna conversa criada. | Nova linha em chat_conversations. Front seleciona novo id e invalida lista. |

---

## 11. Outros eventos (webhook)

| Evento | API (webhook) | Supabase |
|--------|----------------|----------|
| **INSTANCE_CREATE** | Apenas log em dev. | — |
| **INSTANCE_DELETE** | updateInboxByInstance(connection_status: disconnected). | chat_inboxes.connection_status, updated_at. |
| **LABELS_EDIT** | handleLabelsEdit: upsert chat_inbox_labels (inbox_id, evolution_label_id, name, color, deleted, predefined_id). | chat_inbox_labels. |
| **CHATS_DELETE** | handleChatsDelete: por cada JID em data, busca contact_inbox, DELETE chat_conversations onde inbox_id + contact_inbox_id; updateInboxCounts. | Conversas removidas; contadores atualizados. |
| **MESSAGES_UPDATE / MESSAGES_DELETE / SEND_MESSAGE / GROUPS_* / PRESENCE_UPDATE** | handleMessagesPlaceholder: só log em dev; sem persistência. | — |

---

## Checklist rápido – instância flunx-teste-n1v2-ozoiagev

Use para marcar o que já verificou nos logs:

- [ ] **Criar canal:** API recebeu POST /channels; Evolution respondeu create + connect; Supabase tem linha em chat_inboxes com evolution_instance_name = flunx-teste-n1v2-ozoiagev.
- [ ] **QR:** Evolution enviou QRCODE_UPDATED para o webhook; API atualizou chat_inboxes.qr_code no Supabase.
- [ ] **Conexão:** Evolution enviou CONNECTION_UPDATE (state open); API atualizou connection_status e perfil em chat_inboxes; syncInboxAfterConnect chamou findContacts e findChats.
- [ ] **Contatos:** CONTACTS_SET ou sync enviou dados; API fez upsert em chat_contacts e chat_contact_inboxes; contacts_count em chat_inboxes atualizado.
- [ ] **Conversas:** CHATS_SET ou sync; API criou/atualizou chat_conversations; conversations_count atualizado.
- [ ] **Mensagens recebidas:** MESSAGES_UPSERT com key.remoteJid, key.fromMe, key.id (ou temp_); API ensureContactAndConversation + upsert chat_messages.
- [ ] **Mensagem enviada pelo agente:** Front POST /conversations/:id/messages; API sendText na Evolution; INSERT chat_messages com evolution_message_id.

---

## Correção aplicada no código

- **updateInboxCounts:** Após Fase 2, o contato por inbox é em `chat_contact_inboxes`. O contador de contatos foi alterado de `chat_contacts` (onde não existe mais inbox_id) para `chat_contact_inboxes` com `inbox_id`, para que os contadores do painel fiquem corretos.

Referências: [Evolution API](https://docs.evoapicloud.com), [Chatwoot API](https://developers.chatwoot.com), plano em `PLANO-IMPLEMENTACAO-ESTILO-CHATWOOT.md`.
