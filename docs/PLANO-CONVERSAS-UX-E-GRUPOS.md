# Plano: UX de Conversas + Suporte a Grupos

**Data:** 2 de fevereiro de 2026  
**Última atualização de status:** 2 de fevereiro de 2026

---

## Status de Implementação (resumo)

| Fase | Status | Observação |
|------|--------|------------|
| **A** — UX de carregamento | ✅ Concluída | Paginação, `limit`/`days`/`before`, botão "Carregar mais" |
| **B** — Suporte a grupos | ✅ Concluída | `contact_type`, `participant_remote_jid`, sync `fetchAllGroups`, frontend ícone + nome remetente |
| **D** — Identidade (avatar, nome, etiquetas) | ✅ Concluída | D1–D5: avatar no sync, webhook atualiza name, API retorna avatar_url e labels, frontend exibe |
| **E** — Timestamps e remetente | ✅ Concluída | E1–E4: messageTimestamp no webhook, participant_remote_jid, frontend nome remetente |
| **C** — Archive/Pin | ⬜ Pendente | Aguarda payload real de CHATS_* |

---

## Parte 1 — Análise do Sistema e Dados Evolution

### 1.1 Formatos de `remoteJid` (identificador do chat)

| Sufixo | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `@s.whatsapp.net` | Individual | Conversa 1:1 | `556796813187@s.whatsapp.net` |
| `@g.us` | Grupo | Várias pessoas numa conversa | `120363123456789012@g.us` |
| `@lid` | LID / Ephemeral | IDs vinculados, status, etc. | `252609088778404@lid` |
| `status@broadcast` | Status | Stories/status (opcional ignorar) | — |

### 1.2 Payload MESSAGES_UPSERT (webhook)

**Individual:**
```json
{
  "event": "messages.upsert",
  "instance": "flunx-kelvin-andrade-6tt3ojaf",
  "data": {
    "key": {
      "remoteJid": "556296915758@s.whatsapp.net",
      "fromMe": false,
      "id": "A5C3F2963B90C72F64168A8E0734F553"
    },
    "message": { "conversation": "Olá" },
    "pushName": "Nome do Contato"
  }
}
```

**Grupo:**
```json
{
  "data": {
    "key": {
      "remoteJid": "120363123456789012@g.us",
      "participant": "5562999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "..."
    },
    "message": { "conversation": "Mensagem no grupo" }
  }
}
```
- `remoteJid` = JID do grupo
- `participant` = JID de quem enviou dentro do grupo

### 1.3 Eventos Evolution relacionados

| Evento | Uso |
|--------|-----|
| `MESSAGES_UPSERT` | Mensagens (individual + grupo) |
| `CHATS_SET` | Lista inicial de chats (archive, pin?) |
| `CHATS_UPDATE` / `CHATS_UPSERT` | Atualização de chat (archive, pin, mute?) |
| `GROUPS_UPSERT` | Novo grupo criado |
| `GROUPS_UPDATE` | Nome/descrição do grupo atualizado |

### 1.4 Estado atual do nosso sistema

| Componente | Grupos | Archive/Pin |
|------------|--------|-------------|
| **Sync** | ✅ Inclui `fetchAllGroups`; cria contact com `contact_type=group` | Não |
| **Webhook** | ✅ Processa `@g.us`; grava `participant_remote_jid` | Não |
| **chat_contacts** | ✅ `contact_type` (`individual` \| `group`) | — |
| **chat_messages** | ✅ `participant_remote_jid` (remetente em grupo) | — |
| **chat_conversations** | — | Sem `is_archived`, `is_pinned` |

---

### 1.5 Dados por conversa: imagem, nome, etiquetas, data/hora, mensagens

Cada conversa (individual ou grupo) possui identidade própria e metadados. A tabela abaixo mapeia origem (Evolution) → destino (nosso modelo).

#### Imagem de perfil (avatar)

| Tipo | Origem Evolution | Nosso destino | Estado atual |
|------|------------------|---------------|--------------|
| **Individual** | `findContacts[].profilePicUrl`; `fetchProfilePictureUrl` | `chat_contacts.avatar_url` | ✅ Sync salva `profilePicUrl` |
| **Grupo** | `fetchAllGroups[].pictureUrl`; `fetchProfilePictureUrl` | `chat_contacts.avatar_url` | ✅ Sync salva `pictureUrl` |

**Observação:** `findContacts` retorna `profilePicUrl` em cada contato. Para grupos, `fetchAllGroups` pode retornar `pictureUrl` ou usar `fetchProfilePictureUrl` com o JID do grupo.

#### Nome

| Tipo | Origem Evolution | Nosso destino | Estado atual |
|------|------------------|---------------|--------------|
| **Individual** | `findContacts[].pushName`; `MESSAGES_UPSERT.data.pushName` | `chat_contacts.name` | ✅ Sync com `pushName`; webhook usa fallback `remoteJid` |
| **Grupo** | `fetchAllGroups[].subject`; `GROUPS_UPDATE` | `chat_contacts.name` | ✅ Sync com `subject` |

#### Etiquetas (labels/tags)

| Aspecto | Situação |
|---------|----------|
| **WhatsApp Business API** | Suporta labels oficiais (20 por conta, cores, etc.). |
| **Evolution/Baileys** | Não expõe labels nativamente; Evolution conecta via WhatsApp pessoal/não-oficial. |
| **Nossa solução** | Etiquetas **internas** no Flunx: `chat_conversations.labels` (array de tags) ou tabela `chat_conversation_labels` vinculada à org. Usuários definem e aplicam no painel, independente do WhatsApp. |

#### Data e hora

| Dado | Origem | Nosso destino | Estado atual |
|------|--------|---------------|--------------|
| Última atividade da conversa | `updated_at` ao receber/alterar mensagem | `chat_conversations.updated_at`, `last_message_at` | `updated_at` existe; `last_message_at` existe e é atualizado no webhook |
| Criação da conversa | — | `chat_conversations.created_at` | Existe |
| Data/hora de cada mensagem | `messageTimestamp` (unix) | `chat_messages.created_at` | ✅ Webhook usa `messageTimestamp` do payload |

#### Mensagens

| Campo | Origem | Nosso destino | Estado atual |
|-------|--------|---------------|--------------|
| Conteúdo | `data.message.conversation`, `extendedTextMessage.text`, etc. | `chat_messages.content` | ✅ |
| Direção | `key.fromMe` | `chat_messages.direction` | ✅ |
| Data/hora | `messageTimestamp` (epoch) | `chat_messages.created_at` | ✅ Webhook usa `messageTimestamp` |
| Remetente (grupo) | `key.participant` | `chat_messages.participant_remote_jid` | ✅ Implementado |
| Tipo | `messageType` | `chat_messages.message_type` (opcional) | — |

---

## Parte 2 — Objetivos do Plano

1. **UX de carregamento:** Últimos X dias, paginação e “carregar mais”.
2. **Grupos:** Tratar conversas em grupo como um único canal, com várias pessoas conversando.
3. **Identidade da conversa:** Imagem de perfil, nome e etiquetas próprios para cada contato/grupo.
4. **Data/hora e mensagens:** Garantir que timestamps e remetente (em grupos) sejam salvos corretamente.
5. **Metadados opcionais:** Archive e pin (se quisermos refletir estado do WhatsApp).

---

## Parte 3 — Plano de Implementação

### Fase A — UX: Carregamento progressivo de conversas ✅ CONCLUÍDA

**Objetivo:** Carregar inicialmente só conversas recentes e permitir “carregar mais”.

| Etapa | Camada | Alteração | Status |
|-------|--------|-----------|--------|
| A1 | **flunx-channels-api** | `GET /inboxes/:inboxId/conversations` aceita `limit`, `days` e `before`; retorna `has_more` e `cursor` | ✅ |
| A2 | **flunx-chat** | `listConversations` e `useConversations` aceitam parâmetros de paginação | ✅ |
| A3 | **flunx-chat** | Botão “Carregar mais conversas” e append na lista |

**Detalhes A1:**
- `limit` (default 30): quantas conversas por página
- `days` (default 7): filtrar por `updated_at >= now - X days`
- `before` (cursor): `updated_at` ISO da última conversa para próxima página
- Resposta: `{ conversations, has_more, cursor }`

---

### Fase B — Suporte a grupos ✅ CONCLUÍDA

**Objetivo:** Grupos aparecem como uma conversa única; mensagens mostram quem enviou.

| Etapa | Camada | Alteração | Status |
|-------|--------|-----------|--------|
| B1 | **Schema** | `chat_contacts.contact_type` (`individual` \| `group`) | ✅ |
| B2 | **Schema** | `chat_messages.participant_remote_jid` (nullable) — para grupos, quem enviou | ✅ |
| B3 | **Sync** | Incluir grupos: usar `fetchAllGroups` além de `findContacts`; criar contact com `contact_type=group` | ✅ |
| B4 | **Webhook** | Para `@g.us`: definir `contact_type=group`; extrair `participant` e gravar em `participant_remote_jid` | ✅ |
| B5 | **API listagem** | Incluir `contact_type` na resposta de conversas | ✅ |
| B6 | **Frontend** | Exibir ícone/indicador de grupo e nome do remetente em mensagens de grupo | ✅ |

**Detalhes B3:**
- Evolution: `GET /group/fetchAllGroups/{instanceName}` retorna grupos com `id` (remoteJid), `subject` (nome).
- Sync: iterar grupos; criar/atualizar `chat_contacts` com `remote_jid=xxx@g.us`, `name=subject`, `contact_type=group`.
- `findContacts` não retorna grupos; é necessário `fetchAllGroups`.

---

### Fase D — Identidade da conversa: avatar, nome, etiquetas ✅ CONCLUÍDA

**Objetivo:** Cada conversa (contato ou grupo) tem imagem de perfil, nome e etiquetas próprios.

| Etapa | Camada | Alteração | Status |
|-------|--------|-----------|--------|
| D1 | **Sync** | Ao criar/atualizar contact: salvar `avatar_url` de `findContacts[].profilePicUrl`; para grupos, `avatar_url` de `fetchAllGroups[].pictureUrl` | ✅ |
| D2 | **Webhook** | Em MESSAGES_UPSERT: se `pushName` vier no payload e contact existir, fazer `UPDATE chat_contacts SET name = pushName` | ✅ |
| D3 | **API listagem** | Incluir `avatar_url` no objeto `contact` retornado por `GET /inboxes/:inboxId/conversations` | ✅ |
| D4 | **Schema** | `chat_conversations.labels` (TEXT[]) para etiquetas internas do Flunx | ✅ |
| D5 | **Frontend** | Exibir avatar na lista de conversas e no header do chat; exibir etiquetas na lista | ✅ |

**Detalhes D1–D2:**
- `chat_contacts` já tem `avatar_url` e `name`. Basta popular no sync (profilePicUrl, pushName) e no webhook (pushName quando disponível).
- Para avatar sob demanda: endpoint `fetchProfilePictureUrl` da Evolution pode ser chamado ao abrir conversa e cachear em `avatar_url`.

**Etiquetas (D4–D5):**
- Etiquetas são **internas** (Flunx), não vêm do WhatsApp.
- Tabela opcional: `chat_conversation_labels` (conversation_id, label_id) ou coluna `labels TEXT[]` em `chat_conversations`.
- Labels da org: reutilizar `chat_departments.tags` ou criar `chat_labels` (organization_id, name, color).

---

### Fase E — Timestamps e remetente em mensagens ✅ CONCLUÍDA

| Etapa | Camada | Alteração | Status |
|-------|--------|-----------|--------|
| E1 | **Webhook** | Usar `messageTimestamp` (epoch) do payload para `chat_messages.created_at` em vez de `now()` | ✅ |
| E2 | **Schema** | `chat_messages.participant_remote_jid` (Fase B2) | ✅ |
| E3 | **API mensagens** | Retornar `participant_remote_jid` na listagem de mensagens | ✅ |
| E4 | **Frontend** | Em grupos, exibir nome do remetente em cada mensagem | ✅ |

---

### Fase C — Metadados de chat (archive, pin) ⬜ PENDENTE (opcional)

**Objetivo:** Refletir archive e pin do WhatsApp, se os eventos chegarem.

| Etapa | Camada | Alteração | Status |
|-------|--------|-----------|--------|
| C1 | **Schema** | `chat_conversations.is_archived`, `chat_conversations.is_pinned` (boolean, default false) | ⬜ |
| C2 | **Webhook** | Handler para `CHATS_UPDATE`, `CHATS_UPSERT`: mapear `archive`/`pin` para nossas colunas | ⬜ |
| C3 | **API** | Parâmetro `include_archived` (default false) na listagem | ⬜ |
| C4 | **Frontend** | Abas ou filtros "Arquivadas" e "Fixadas" | ⬜ |


**Observação:** Precisamos ver o payload real de CHATS_* para implementar; pode ficar para fase posterior.

---

## Parte 4 — Ordem sugerida e próximos passos

### Ordem original (atualizada com status)

1. ~~**Fase A**~~ — ✅ Concluída
2. ~~**Fase B**~~ — ✅ Concluída
3. ~~**Fase D**~~ — ✅ Concluída
4. ~~**Fase E**~~ — ✅ Concluída
5. **Fase C** — Archive/Pin (pendente; aguarda payload real de CHATS_*)

### Pendências

- **Fase C** (C1–C4): Archive e Pin — implementar quando tivermos o payload real dos eventos `CHATS_UPDATE` / `CHATS_UPSERT` da Evolution.
- **D5 (edição de etiquetas)**: Exibição feita; permitir editar etiquetas requer endpoint `PATCH /conversations/:id` para atualizar `labels`.

---

## Parte 5 — Resumo técnico

### Schema (migrations)

```sql
-- B1: contact_type em chat_contacts
ALTER TABLE chat_contacts ADD COLUMN IF NOT EXISTS contact_type TEXT 
  DEFAULT 'individual' CHECK (contact_type IN ('individual', 'group'));

-- B2: participant em chat_messages (grupos)
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS participant_remote_jid TEXT;

-- D4: etiquetas internas (opcional)
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

-- C1 (opcional): archive/pin em chat_conversations
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
```

**Colunas já existentes que passam a ser usadas:**
- `chat_contacts.avatar_url` — popular com profilePicUrl (sync) ou fetchProfilePictureUrl (sob demanda)
- `chat_contacts.name` — pushName (individual), subject (grupo)
- `chat_messages.created_at` — preferir messageTimestamp do payload quando disponível

### Evolution API

| Endpoint | Uso |
|----------|-----|
| `POST /chat/findContacts/{instance}` | Contatos individuais: `remoteJid`, `pushName`, `profilePicUrl` |
| `GET /group/fetchAllGroups/{instance}` | Grupos: `id` (remoteJid), `subject`, possivelmente `pictureUrl` |
| `POST /chat/fetchProfilePictureUrl/{instance}` | Body `{ number: remoteJid }` → retorna `profilePictureUrl` (individual ou grupo) |

### Fluxo de dados (resumo)

| Dado | Individual | Grupo |
|------|------------|-------|
| **Nome** | findContacts.pushName; MESSAGES_UPSERT.pushName | fetchAllGroups.subject |
| **Avatar** | findContacts.profilePicUrl; fetchProfilePictureUrl | fetchAllGroups.pictureUrl; fetchProfilePictureUrl |
| **Etiquetas** | Internas (chat_conversations.labels) | Idem |
| **Data/hora msg** | messageTimestamp → created_at | Idem |
| **Remetente** | fromMe → direction | participant → participant_remote_jid |

### Referências

- [Evolution API — Webhooks](https://doc.evolution-api.com/v2/en/configuration/webhooks)
- [Evolution API — Fetch All Groups](https://doc.evolution-api.com/v2/api-reference/group-controller/fetch-all-groups)
- [Evolution API — Fetch Profile Picture URL](https://docs.evoapicloud.com/api-reference/chat-controller/fetch-profilepic-url)
- [Evolution API — Archive Chat](https://doc.evolution-api.com/v2/api-reference/chat-controller/archive-chat)
- Payload real (logs): `remoteJid` `@s.whatsapp.net`, `@g.us`, `@lid`; `participant` em mensagens de grupo; `pushName` em MESSAGES_UPSERT.
