# Investigação Evolution API — Resultados e Plano de Correção

**Data:** 2 de fevereiro de 2026  
**Evolution:** `atendai/evolution-api:latest`  
**Base URL:** `https://apiwpp.flunx.com.br`

---

## 1. Validações realizadas

### 1.1 findChats (Evolution)

```bash
curl -X POST "https://apiwpp.flunx.com.br/chat/findChats/flunx-kelvin-andrade-6tt3ojaf" \
  -H "apikey: $EVOLUTION_API_KEY" -H "Content-Type: application/json" -d '{}'
```

**Resultado:** Status 200, retorna **1 chat** apenas.  
**Formato:** Array com objetos `{ id, remoteJid, pushName, profilePicUrl, ... }`.  
**Exemplo:** `remoteJid: "252609088778404@lid"` (formato LID/ephemeral).

**Conclusão:** `findChats` retorna poucos chats (1) e não representa as 46 conversas exibidas no card. Não é adequado para sincronizar conversas.

---

### 1.2 findContacts (Evolution)

```bash
curl -X POST "https://apiwpp.flunx.com.br/chat/findContacts/flunx-kelvin-andrade-6tt3ojaf" \
  -H "apikey: $EVOLUTION_API_KEY" -H "Content-Type: application/json" -d '{}'
```

**Resultado:** Status 200, retorna **1245 contatos**.  
**Formato:** Array com objetos `{ id, remoteJid, pushName, profilePicUrl, createdAt, ... }`.  
**Exemplo:** `remoteJid: "556796813187@s.whatsapp.net"`, `pushName: "Atendimento Cliente"`.

**Conclusão:** `findContacts` retorna todos os contatos com `remoteJid` em formato `@s.whatsapp.net`. É o endpoint adequado para popular contatos e conversas.

---

### 1.3 Webhook configurado (Evolution)

```bash
curl -X GET "https://apiwpp.flunx.com.br/webhook/get/flunx-kelvin-andrade-6tt3ojaf" -H "apikey: ..."
```

**Resultado:** 404 — `Cannot GET /webhook/get/flunx-kelvin-andrade-6tt3ojaf`.

**Conclusão:** O fork atendai usa rotas diferentes. Não foi possível validar a config do webhook via API. O webhook é registrado na criação do canal via `POST /webhook/set/{instance}`.

---

### 1.4 Schema Supabase (chat_contacts, chat_conversations)

**chat_contacts:**
- `source_id` **NOT NULL**, sem default.
- UNIQUE (organization_id, source_id).

**chat_conversations:**
- `organization_id` **NOT NULL**, sem default.

---

### 1.5 Webhook — inserts atuais

**chat_contacts:**
```javascript
.insert({ inbox_id, organization_id, remote_jid, name })
// source_id ausente → viola NOT NULL
```

**chat_conversations:**
```javascript
.insert({ inbox_id, contact_id, status })
// organization_id ausente → viola NOT NULL
```

**Conclusão:** Ambos os inserts falham por violar constraints NOT NULL. Mensagens recebidas nunca são persistidas.

---

## 2. Diagnóstico

| Problema | Causa | Impacto |
|----------|-------|---------|
| Sync retorna 0 conversas | `findChats` retorna apenas 1 chat (não representa conversas) | Sincronização praticamente vazia |
| Mensagens não chegam | Webhook falha ao inserir contato (sem `source_id`) e conversa (sem `organization_id`) | Nenhuma mensagem recebida é salva |

---

## 3. Plano de correção

### 3.1 Webhook (mensagens recebidas)

**Arquivo:** `flunx-channels-api/src/webhookEvolution.js`

1. **chat_contacts** — adicionar `source_id` no insert de novo contato:
   ```javascript
   source_id: remoteJid  // ou `${inbox.id}_${remoteJid}` para unicidade
   ```

2. **chat_conversations** — adicionar `organization_id` no insert de nova conversa:
   ```javascript
   organization_id: inbox.organization_id
   ```

**Impacto:** Mensagens recebidas passam a ser persistidas e exibidas no chat.

---

### 3.2 Sync (sincronização de conversas)

**Arquivo:** `flunx-channels-api/src/evolution.js`

1. **Novo método:** `findContacts(instanceName)`  
   - Endpoint: `POST /chat/findContacts/{instanceName}`  
   - Retorno: array de contatos com `remoteJid`, `pushName`, etc.

**Arquivo:** `flunx-channels-api/src/index.js`

2. **POST /inboxes/:inboxId/sync** — usar `findContacts` em vez de `findChats`:
   - Chamar `findContacts(instanceName)` em vez de `findChats`.
   - Iterar sobre contatos em vez de chats.
   - Extrair `remoteJid` e `pushName` de cada contato.
   - Ignorar `@g.us` (grupos); aceitar `@s.whatsapp.net` e opcionalmente `@lid`.
   - Criar/atualizar `chat_contacts` e `chat_conversations` como hoje, usando `remote_jid` e `source_id`.

**Impacto:** Sync passa a popular conversas a partir dos contatos retornados pela Evolution.

---

### 3.3 Ordem de implementação

1. **Webhook** (bloqueador para mensagens recebidas)
2. **findContacts + Sync** (sincronização de conversas existentes)

---

## 4. Implementação (concluída)

- **Fase 1 — Webhook** (`webhookEvolution.js`): `source_id` adicionado em `chat_contacts`, `organization_id` em `chat_conversations`.
- **Fase 2 — Sync** (`evolution.js`): `findContacts` implementado. `index.js` passou a usar `findContacts` em vez de `findChats` no endpoint de sync.

---

## 5. Referências

- [Evolution API — findContacts](https://doc.evolution-api.com/v2/api-reference/chat-controller/find-contacts)
- [Evolution API — findChats](https://doc.evolution-api.com/v2/api-reference/chat-controller/find-chats)
- [evoapicloud — findContacts](https://docs.evoapicloud.com/api-reference/chat-controller/find-contacts)
- Schema Supabase: `chat_contacts.source_id` NOT NULL, `chat_conversations.organization_id` NOT NULL
