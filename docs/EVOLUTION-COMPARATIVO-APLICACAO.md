# Documento comparativo: Aplicação vs Evolution API

**Data:** 2 de fevereiro de 2026  
**Evolution instalada:** `atendai/evolution-api:latest` (fork)  
**Base URL Evolution:** `https://apiwpp.flunx.com.br`  
**Flunx-channels-api:** `https://api-canais.flunx.com.br`

---

## 1. Problemas relatados

1. **Sync retorna 0 conversas** — WhatsApp tem 46 conversas, mas o botão Sincronizar reporta "0 conversas criadas, 0 contatos criados".
2. **Mensagens não chegam** — Mensagens enviadas para o WhatsApp conectado não aparecem no chat.

---

## 2. Configuração atual da Evolution (evolution.yaml)

| Config | Valor | Impacto |
|--------|-------|---------|
| `WEBHOOK_GLOBAL_ENABLED` | `false` | Webhook global desabilitado; depende de webhook por instância |
| `WEBHOOK_GLOBAL_URL` | `""` | Sem URL global |
| `RABBITMQ_ENABLED` | `true` | Eventos publicados no RabbitMQ (evo_cloud) |
| `CHATWOOT_ENABLED` | `true` | Integração Chatwoot ativa; Evolution pode enviar dados ao Chatwoot |
| `DATABASE_ENABLED` | `true` | Evolution persiste chats/contatos/mensagens no PostgreSQL |
| `WEBHOOK_EVENTS_MESSAGES_UPSERT` | `true` | Evento MESSAGES_UPSERT habilitado para webhook |

---

## 3. Webhook — Como está vs como deveria ser

### 3.1 Set Webhook (configuração por instância)

**Documentação Evolution (evoapicloud):**
- **Path:** `POST /webhook/set/{instance}`
- **Body:** `{ enabled, url, webhookByEvents, webhookBase64, events }`
- **Header:** `apikey: <API_KEY>`

**Nossa implementação (`evolution.js`):**
```javascript
POST ${baseUrl}/webhook/set/${instanceName}
Body: { webhook: { enabled: true, url, webhook_by_events: false, events } }
Header: apikey
```

| Item | Atual | Documentação | Observação |
|------|-------|--------------|------------|
| Path | `/webhook/set/{instanceName}` | `/webhook/set/{instance}` | OK |
| Body | `{ webhook: { ... } }` | `{ enabled, url, ... }` (sem wrapper) | **Possível divergência** — Evolution v2.2.3 pode exigir wrapper `webhook` |
| Eventos | `MESSAGES_UPSERT`, `MESSAGES_UPDATE`, `CONNECTION_UPDATE`, `QRCODE_UPDATED` | Lista inclui `MESSAGES_UPSERT` | OK |

**Verificar:** Confirmar na Evolution instalada qual formato de body é aceito (com ou sem wrapper `webhook`).

---

### 3.2 Recebimento de mensagens (webhook HTTP)

**Fluxo esperado:**
1. Mensagem chega no WhatsApp → Evolution dispara `MESSAGES_UPSERT`
2. Evolution faz POST para a URL configurada (nosso `POST /webhook/evolution`)
3. Nosso handler cria/atualiza `chat_contacts`, `chat_conversations`, `chat_messages` no Supabase

**Problema identificado — `chat_contacts.source_id`:**

O schema do Supabase exige `source_id` NOT NULL em `chat_contacts`:
```sql
"source_id" "text" NOT NULL
```

O webhook insere **sem** `source_id`:
```javascript
.insert({
  inbox_id, organization_id, remote_jid, name
  // source_id ausente!
})
```

**Consequência:** O INSERT em `chat_contacts` **falha** por violar NOT NULL. O fluxo para antes de criar contato e conversa; a mensagem nunca é persistida.

| Item | Atual | Deveria ser |
|------|-------|-------------|
| Insert contact | Sem `source_id` | Incluir `source_id` (ex.: `remote_jid` ou `${inboxId}_${remoteJid}`) |

**Ação:** Ajustar `webhookEvolution.js` para enviar `source_id` em todo insert de `chat_contacts`.

---

### 3.3 Acessibilidade do webhook

A Evolution chama nossa URL a partir da internet. Verificar:

- `WEBHOOK_BASE_URL` no `.env` da flunx-channels-api: deve ser `https://api-canais.flunx.com.br`
- A rota `POST /webhook/evolution` deve estar acessível publicamente (sem auth obrigatória)
- Traefik/firewall devem permitir POST nessa rota

---

## 4. Find Chats (sincronização) — Como está vs como deveria ser

### 4.1 Documentação Evolution

**evoapicloud:**
- **Path:** `POST /chat/findChats/{instance}`
- **Header:** `apikey`
- **Response 200:** Documentação indica "This response has no body data" (pode estar desatualizada)

**EvolutionAPI GitHub (issue #2041):** Em algumas versões (ex.: 2.2.3), `findChats` retorna **500 Internal Server Error** com falha em `prisma.$queryRaw()`.

### 4.2 Nossa implementação

```javascript
POST ${baseUrl}/chat/findChats/${instanceName}
Body: {}
Response esperada: array de chats (data, data.chats, ou array direto)
```

**Problema:** O sync retorna "0 conversas criadas". Possíveis causas:

1. **Evolution retorna array vazio** — `findChats` pode estar retornando `[]` ou estrutura diferente.
2. **Bug conhecido** — `findChats` retorna 500 em algumas versões; nesse caso nossa API retornaria 502.
3. **Formato de resposta** — Chats podem vir em `data`, `chats`, `data.chats` ou outro campo; nosso parser pode não estar correto.
4. **Estrutura do chat** — `remoteJid` pode estar em `id`, `id.remoteJid`, `remoteJid` ou `key.remoteJid`.

**Ação:** Logar a resposta bruta de `findChats` no backend para inspecionar estrutura e conteúdo.

---

### 4.3 Alternativas ao Find Chats

Se `findChats` não for confiável:

| Endpoint | Uso |
|----------|-----|
| `POST /chat/findContacts/{instance}` | Listar contatos; cada contato pode corresponder a um chat 1:1 |
| `GET /group/fetchAllGroups/{instance}` | Listar apenas grupos |
| `GET /instance/fetchInstances?instanceName=xxx` | Já usamos; retorna `_count.Contact`, `_count.Chat` |

---

## 5. Envio de mensagens — Como está vs como deveria ser

### 5.1 Send Text

**Documentação:** `POST /message/sendText/{instance}`  
**Body:** `{ number, text }` (number sem `@s.whatsapp.net`)

**Nossa implementação:** Alinhada. Enviamos via Evolution e persiste em `chat_messages`.

---

### 5.2 Mensagens recebidas não aparecem

Se o envio funciona mas as mensagens recebidas não aparecem, o fluxo quebrado é o webhook:

1. Evolution recebe a mensagem no WhatsApp.
2. Evolution deveria fazer POST para nossa URL de webhook.
3. Nosso handler deveria inserir em `chat_contacts` (com `source_id`) e `chat_messages`.
4. Por causa do `source_id` ausente, o insert em `chat_contacts` falha e nada é salvo.

**Ação prioritária:** Corrigir o insert de `chat_contacts` no webhook.

---

## 6. Checklist de correções

| # | Item | Ação |
|---|------|------|
| 1 | **Webhook: source_id** | Incluir `source_id` em todo insert de `chat_contacts` em `webhookEvolution.js` |
| 2 | **Find Chats: debug** | Logar resposta completa de `findChats` para ajustar parsing |
| 3 | **Find Chats: fallback** | Avaliar uso de `findContacts` se `findChats` continuar vazio/instável |
| 4 | **Set Webhook: body** | Conferir se a Evolution aceita body com wrapper `webhook` ou formato alternativo |
| 5 | **WEBHOOK_BASE_URL** | Garantir que está correta e acessível pela Evolution |

---

## 7. Referências

- [Evolution API v2 — doc.evolution-api.com](https://doc.evolution-api.com/v2/)
- [Evolution API — evoapicloud (Find Chats)](https://docs.evoapicloud.com/api-reference/chat-controller/find-chats)
- [Evolution API — evoapicloud (Set Webhook)](https://docs.evoapicloud.com/api-reference/webhook/set)
- [EvolutionAPI GitHub — Issue #2041 (findChats 500)](https://github.com/EvolutionAPI/evolution-api/issues/2041)

---

**Próximo passo recomendado:** Corrigir o webhook (adicionar `source_id` no insert de `chat_contacts`) e validar se mensagens recebidas passam a aparecer no chat.
