# Investigação: Chatwoot + Evolution — Como Funciona e O Que Podemos Reaproveitar

**Data:** 2 de fevereiro de 2026

---

## 1. Arquitetura da Integração Chatwoot + Evolution

### 1.1 Fluxo geral

```
[WhatsApp] ←→ [Evolution API] ←→ [Chatwoot]
                      ↑                  ↑
                      │                  │
              Evolution chama     Chatwoot chama
              API do Chatwoot     webhook da Evolution
              (recebidos)         (envio pelo agente)
```

- **Evolution → Chatwoot:** Evolution chama a **API REST do Chatwoot** (criar/atualizar contact, conversation, message) quando recebe mensagem no WhatsApp.
- **Chatwoot → Evolution:** Quando o agente envia mensagem no Chatwoot, o Chatwoot dispara **webhook** para `https://evolution.../chatwoot/webhook/{instance}`; a Evolution envia no WhatsApp.

### 1.2 Configuração na Evolution

- **Criação:** `POST /instance/create` com `chatwootAccountId`, `chatwootToken`, `chatwootUrl`, etc.
- **Instância existente:** `POST /chatwoot/set/{instance}` com `enabled`, `accountId`, `token`, `url`, `nameInbox`, `importContacts`, `importMessages`, `daysLimitImportMessages`, `mergeBrazilContacts`, `reopenConversation`, `conversationPending`, `autoCreate`, `signMsg`, etc.

### 1.3 No Chatwoot

- Cria-se um **Inbox tipo API**.
- Configura-se **callback URL** = `https://evolution.../chatwoot/webhook/{instance}` para envio.

---

## 2. Schema do Chatwoot (banco de dados)

### 2.1 Tabelas principais

| Tabela | Propósito |
|--------|-----------|
| **contacts** | Contato do cliente. `name`, `email`, `phone_number`, `identifier`, `account_id`, `contact_type`, `additional_attributes`, `custom_attributes`. |
| **contact_inboxes** | Vínculo contato ↔ inbox. **`source_id`** (text, NOT NULL) = identificador único do contato naquele inbox. UNIQUE(inbox_id, source_id). |
| **conversations** | Conversa. `account_id`, `inbox_id`, `contact_id`, `contact_inbox_id`, `status`, `assignee_id`, `display_id`, `last_activity_at`, etc. |
| **messages** | Mensagem. `conversation_id`, `content`, `message_type` (incoming/outgoing), `sender_type`, `sender_id`, `source_id`, `content_type`, `content_attributes`, `additional_attributes`. |
| **inboxes** | Canal. `channel_id`, `channel_type`, `account_id`, `name`. O channel pode ser `ChannelApi`, `ChannelWhatsapp`, etc. |

### 2.2 Relacionamentos

- **Contact** → 1:N **contact_inboxes** (um contato pode estar em vários inboxes)
- **contact_inboxes** = `(contact_id, inbox_id, source_id)` — `source_id` é o ID externo (ex.: número WhatsApp ou remoteJid)
- **Conversation** → `contact_id`, `inbox_id`, `contact_inbox_id`
- **Message** → `conversation_id`; `sender_type` = "Contact" ou "User"; `sender_id` = contact_id ou user_id

### 2.3 Diferença Contact vs Conversation

- **Contact** = pessoa/entidade (identidade)
- **contact_inbox** = "sessão" do contato naquele inbox (source_id único por inbox)
- **Conversation** = thread de mensagens (uma por contact_inbox, ou pode haver várias conversas por contact_inbox — ex.: reopen)

---

## 3. API do Chatwoot (o que a Evolution chama)

### 3.1 Autenticação

- Header: **`api_access_token`** (token do usuário admin do Chatwoot)
- Base: `https://app.chatwoot.com/api/v1/accounts/{account_id}/`

### 3.2 Criar contato

**POST** `/api/v1/accounts/{account_id}/contacts`

Body: `inbox_id`, `name`, `email`, `phone_number`, `identifier`, `avatar_url`, `additional_attributes`, `custom_attributes`

- `identifier` = identificador externo (Evolution usa remoteJid ou número)
- Retorno inclui `contact_inboxes` com `source_id` por inbox

### 3.3 Criar contact inbox (vincular contato a inbox)

**POST** `/api/v1/accounts/{account_id}/contacts/{contact_id}/contact_inboxes`

Body: `inbox_id`, `source_id`

- `source_id` = identificador único do contato naquele inbox (Evolution usa remoteJid)

### 3.4 Criar conversa

**POST** `/api/v1/accounts/{account_id}/conversations`

Body: `source_id`, `inbox_id`, `contact_id`, `status`, etc.

- Ou via Client API: `/public/api/v1/inboxes/{inbox_id}/contacts/{contact_identifier}/conversations`

### 3.5 Criar mensagem

**POST** `/api/v1/accounts/{account_id}/conversations/{conversation_id}/messages`

Body: `content`, `message_type` (incoming/outgoing), `private`, attachments

- `message_type: "incoming"` = do contato; `"outgoing"` = do agente

---

## 4. O que a Evolution envia ao Chatwoot (lógica interna)

Com base na documentação e no fluxo:

1. **Ao receber MESSAGES_UPSERT:**
   - Busca/cria **contact** por identifier (remoteJid ou número)
   - Cria/atualiza **contact_inbox** com source_id = remoteJid
   - Cria ou reabre **conversation** (conforme `reopenConversation`)
   - Cria **message** com `message_type: "incoming"` e conteúdo extraído

2. **Importação (se habilitado):**
   - `importContacts`: busca contatos do WhatsApp e cria no Chatwoot
   - `importMessages`: importa histórico com `daysLimitImportMessages`
   - `mergeBrazilContacts`: normaliza números BR (9 dígitos)

3. **Envio (webhook Chatwoot → Evolution):**
   - Chatwoot envia POST para `/chatwoot/webhook/{instance}` com evento `message_created`
   - Payload inclui: `content`, `conversation`, `contact`, `sender`
   - Evolution extrai destination (source_id/remoteJid) e envia via `sendText`

---

## 5. Nosso Modelo vs Chatwoot

| Conceito | Chatwoot | Nosso (Flunx) |
|----------|----------|---------------|
| **Contato** | `contacts` (account_id, name, phone, identifier) | `chat_contacts` (organization_id, inbox_id, remote_jid, name, source_id, contact_type) |
| **Vínculo contato-inbox** | `contact_inboxes` (contact_id, inbox_id, source_id) | Implícito: `chat_contacts.inbox_id` — contato já é por inbox |
| **Conversa** | `conversations` (contact_id, inbox_id, contact_inbox_id, status) | `chat_conversations` (inbox_id, contact_id, organization_id, status) |
| **Mensagem** | `messages` (conversation_id, content, message_type, sender_type, sender_id, source_id) | `chat_messages` (conversation_id, content, direction, sender_type, participant_remote_jid, evolution_message_id) |

### 5.1 O que já fazemos igual

- Webhook recebendo MESSAGES_UPSERT
- Criar contact, conversation, message no nosso banco
- Envio: nosso backend chama Evolution sendText (não precisamos de callback Chatwoot→Evolution)
- `source_id` único por inbox (usamos `${inbox_id}_${remoteJid}`)

### 5.2 O que o Chatwoot tem e nós temos diferente

| Recurso | Chatwoot | Nosso |
|---------|----------|-------|
| **contact_inboxes** separado | Sim — contato pode existir em vários inboxes; contact_inbox = sessão | Não — `chat_contacts` já tem `inbox_id`; 1 contact = 1 inbox |
| **Múltiplas conversas por contato** | Sim — `reopenConversation` cria nova ou reabre | Não — 1 conversa por (inbox, contact) |
| **Participant em grupos** | `sender` na message (contact ou user) | `participant_remote_jid` na message |
| **Labels/Etiquetas** | `labels` + `taggings` | `chat_conversations.labels` (planejado) |
| **Archive/Pin** | Status da conversation, atributos | `is_archived`, `is_pinned` (planejado) |
| **Avatar** | `avatar_url` no contact | `chat_contacts.avatar_url` (existe, pouco usado) |

---

## 6. Migrations do Chatwoot (referência)

O Chatwoot usa Rails migrations. Estrutura relevante (do schema.rb):

- `contact_inboxes`: `contact_id`, `inbox_id`, `source_id` (NOT NULL), UNIQUE(inbox_id, source_id)
- `contacts`: `contact_type` (enum, default 0), `identifier`, `phone_number`, `name`, etc.
- `conversations`: `contact_inbox_id`, `contact_id`, `inbox_id`, `status`, `assignee_id`, `last_activity_at`
- `messages`: `source_id` (text), `sender_type`, `sender_id`, `content_attributes` (json), `additional_attributes` (jsonb)

---

## 7. Conclusões e Recomendações

### 7.1 O que NÃO precisamos reinventar

- **Fluxo de recebimento:** webhook MESSAGES_UPSERT → criar contact, conversation, message. ✅ Já fazemos.
- **Fluxo de envio:** chamar Evolution sendText. ✅ Já fazemos.
- **source_id único por inbox:** ✅ Já usamos.
- **Participant em grupos:** ✅ Já implementamos (participant_remote_jid).

### 7.2 O que podemos adotar do Chatwoot

1. **contact_inboxes:** Se um dia quisermos o mesmo contato em vários inboxes, criar tabela `chat_contact_inboxes` (contact_id, inbox_id, source_id). Hoje não é necessário.
2. **Avatar:** Popular `chat_contacts.avatar_url` no sync e webhook (pushName, profilePicUrl) — Fase D do plano.
3. **Etiquetas:** `labels` em `chat_conversations` ou tabela de tags — Fase D.
4. **Archive/Pin:** Colunas em `chat_conversations` — Fase C.

### 7.3 Não precisamos da integração nativa Evolution→Chatwoot

- A Evolution tem integração pronta para **enviar para o Chatwoot**.
- Nós **não somos Chatwoot** — usamos webhook genérico para nosso backend.
- O Chatwoot é uma referência de **modelo de dados** e **fluxo**, não de integração direta.

---

## 8. Referências

- [Evolution API — Chatwoot Integration](https://doc.evolution-api.com/v2/en/integrations/chatwoot)
- [Chatwoot API — Create Contact](https://developers.chatwoot.com/api-reference/contacts/create-contact)
- [Chatwoot schema.rb](https://github.com/chatwoot/chatwoot/blob/develop/db/schema.rb)
- [chatwoot-evolution-integration.md](../../flunx-v2/docs/chatwoot-evolution-integration.md)
- [diferenca-nosso-sistema-vs-chatwoot-evolution.md](../../flunx-v2/docs/diferenca-nosso-sistema-vs-chatwoot-evolution.md)
- [pesquisa-evolution-chatwoot-api.md](../../flunx-v2/docs/pesquisa-evolution-chatwoot-api.md)
