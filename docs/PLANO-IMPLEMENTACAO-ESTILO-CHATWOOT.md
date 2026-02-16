# Plano de implementação – correções estilo Chatwoot

**Data:** 10 de fevereiro de 2026  
**Base:** [COMPARATIVO-CHATWOOT-EVO-VS-FLUNX-ASPECTOS.md](./COMPARATIVO-CHATWOOT-EVO-VS-FLUNX-ASPECTOS.md)  
**Objetivo:** Ordenar as correções em fases executáveis, com menor risco e menor impacto quebrador no início.

---

## Visão geral das fases

| Fase | Nome | Objetivo principal | Quebra compatibilidade? |
|------|------|--------------------|------------------------|
| **0** | Quick wins | Envio de mensagem + mensagens sem key.id | Não |
| **1** | Mídia recebida | Garantir URL de mídia (Evolution ou job) | Não |
| **2** | Contact + ContactInbox | Contato por organização; vínculo inbox com source_id | **Sim** (schema + API) |
| **3** | Múltiplas conversas | Várias threads por (inbox, contact); reabertura = nova conversa | **Sim** (schema + UI) |
| **4** | Refinos | Labels por junção, import automático opcional, etc. | Opcional |

Recomendação: **executar Fase 0 e Fase 1 primeiro** (envio funcionando + mídia melhorada). Fases 2 e 3 exigem migração de dados e mudança de contrato (API e front).

---

## Fase 0 – Quick wins (envio + mensagens sem id)

**Objetivo:** Corrigir o que está claramente quebrado ou perdendo dados, sem mudar modelo de dados.

### 0.1 Implementar POST /conversations/:conversationId/messages (flunx-api)

- **Problema:** Front chama essa rota mas ela não existe no `index.js` → 404.
- **Ação:**
  1. Em **flunx-api**: criar handler `postMessage` em `routes/channels.js`.
  2. Handler: validar auth, obter conversa (e inbox, contact, `evolution_instance_name`), validar body (`content`, opcionalmente `attachments` ou tipo de mídia).
  3. Chamar **Evolution API** para enviar (ex.: `POST /message/sendText/:instance` com `number` + `text`; para mídia, `sendMedia` se existir na Evolution).
  4. Inserir em **chat_messages** uma linha com `direction: 'out'`, `sender_type: 'agent'`, `content`, `conversation_id`, `evolution_message_id` (se a Evolution devolver um id no response; senão null ou gerado).
  5. Registrar rota em **index.js**: `app.post("/conversations/:conversationId/messages", requireAuth, postMessage)`.
- **Dependência Evolution:** Em `evolution.js` não existe `sendText`/`sendMedia`; implementar: **Send Text** – `POST {baseUrl}/message/sendText/{instanceName}`, body `{ "number": "<remoteJid ou E.164>", "text": "<conteúdo>" }` ([Evolution Send Text](https://docs.evoapicloud.com/api-reference/message-controller/send-text)); resposta 201 traz `key.id` → usar como `evolution_message_id`. **Send Media** – `POST {baseUrl}/message/sendMedia/{instanceName}`, body `{ number, mediatype, mimetype, caption, media, fileName }` ([Evolution Send Media](https://docs.evoapicloud.com/api-reference/message-controller/send-media)).
- **Entrega:** Agente consegue enviar mensagem pelo Flunx Chat e a mensagem aparece na conversa e no WhatsApp.

### 0.2 Persistir mensagens sem key.id (evitar perda silenciosa)

- **Problema:** Webhook MESSAGES_UPSERT ignora mensagens sem `key.id` → histórico incompleto.
- **Ação:**
  1. Em **webhookEvolution.js** (`handleMessagesUpsertSet`): quando `evolution_message_id` for null, gerar um **id interno** (ex.: `uuid` ou `evt_${Date.now()}_${random}`) e usar como `evolution_message_id` para o upsert (ou criar coluna `internal_message_id` e usar como fallback para unicidade).
  2. Atenção: se a Evolution reenviar a mesma mensagem depois com key.id, o upsert por `evolution_message_id` pode criar duplicata se antes tivermos usado um id gerado. Estratégia possível: coluna `evolution_message_id` nullable; quando null, UNIQUE não se aplica; usar `(conversation_id, created_at, content hash)` ou só aceitar possível duplicata em casos raros.
  3. Alternativa mais simples: gerar `evolution_message_id = 'temp_' + uuid()` para mensagens sem key.id; manter upsert por `evolution_message_id`; se depois chegar a mesma mensagem com key.id, tratar como atualização (ou ignorar duplicata por conteúdo+conversation_id em janela de tempo).
- **Entrega:** Mensagens recebidas sem key.id passam a ser persistidas (com id interno), reduzindo perda de histórico.

**Critério de conclusão Fase 0:** Envio pelo agente funcionando via API; mensagens sem key.id persistidas (com política definida para duplicatas).

---

## Fase 1 – Mídia recebida

**Objetivo:** Ter URL (ou arquivo) de mídia nas mensagens recebidas, o mais próximo possível do Chatwoot (que recebe o arquivo).

### 1.1 Garantir mediaUrl no webhook (configuração Evolution)

- **Ação:** Documentar que a Evolution deve enviar no webhook (ou no payload que alimenta o Flunx) o campo **mediaUrl** (ou equivalente) quando a mensagem for de mídia. Se a Evolution tiver opção de “enriquecer” o evento com URL (ex.: após upload em S3), ativar.
- **Entrega:** Doc/checklist para deploy Evolution (webhook + storage/enrichment).

### 1.2 Fallback: buscar mídia na Evolution por message id (job ou sob demanda)

- **Problema:** Se o webhook não trouxer mediaUrl, hoje ficamos com `media_url` null.
- **Ação:**
  1. Evolution API: **Get Base64** – `POST {baseUrl}/chat/getBase64FromMediaMessage/{instanceName}`, body `{ "message": { "key": { "id": "<evolution_message_id>" } }, "convertToMp4": true }` ([Evolution Get Base64](https://docs.evoapicloud.com/api-reference/chat-controller/get-base64)); validar se a versão em uso exige também `remoteJid` no `key`.
  2. Se existir: no Flunx, para mensagens já salvas com `media_url` null e `evolution_message_id` preenchido, rodar um **job** (ou endpoint “buscar mídia” por conversa) que chama a Evolution, obtém a URL ou base64, faz upload para **Supabase Storage** (bucket privado) e atualiza `chat_messages.media_url` com a URL do Storage.
  3. Se não existir endpoint público na Evolution para isso, manter apenas 1.1 (depender do webhook enriquecido).
- **Entrega:** Mídia recebida ou aparece via webhook enriquecido, ou via job/endpoint que preenche `media_url` a partir da Evolution.

**Critério de conclusão Fase 1:** Política clara de mídia (webhook + opcional job); `media_url` preenchido na maior parte dos casos quando a Evolution tiver a mídia disponível.

---

## Fase 2 – Modelo Contact + ContactInbox (estilo Chatwoot)

**Objetivo:** Contato = identidade por **organização**; vínculo contato↔inbox = **ContactInbox** com **source_id** único no inbox.

**Atenção:** Esta fase altera schema e todas as leituras/escritas que usam `chat_contacts` e `chat_conversations`. Exige migração de dados e atualização da API e do front.

### 2.1 Schema (migrações Supabase)

1. **Nova tabela `chat_contacts` (identidade por organização)**  
   - Manter nome ou renomear a atual para `chat_contact_inboxes` (veja abaixo).  
   - Proposta:  
     - **chat_contacts** (nova semântica): `id`, `organization_id`, `identifier` (ex.: remoteJid ou phone), `phone_number`, `name`, `avatar_url`, `custom_attributes` (jsonb), `created_at`, `updated_at`. UNIQUE(organization_id, identifier).  
     - **chat_contact_inboxes**: `id`, `inbox_id`, `contact_id`, `source_id` (string, ex.: remoteJid no canal), `created_at`, `updated_at`. UNIQUE(inbox_id, source_id).

2. **Migração dos dados atuais**  
   - Hoje: `chat_contacts` tem inbox_id, remote_jid, etc.  
   - Para cada (organization_id, inbox_id, remote_jid):  
     - Inserir ou localizar **contact** em `chat_contacts` por (organization_id, identifier) onde identifier = remote_jid (ou phone extraído).  
     - Inserir **contact_inbox** em `chat_contact_inboxes` com (inbox_id, contact_id, source_id = remote_jid).

3. **chat_conversations**  
   - Trocar **contact_id** por **contact_inbox_id** (FK para `chat_contact_inboxes`), ou manter contact_id e adicionar contact_inbox_id (redundante mas facilita queries).  
   - Ajustar UNIQUE: uma conversa por (inbox_id, contact_inbox_id) na Fase 2; na Fase 3 poderá ser múltiplas conversas por contact_inbox_id.

4. **chat_messages**  
   - Sem mudança de estrutura; continua com conversation_id.

5. **RLS e índices**  
   - Ajustar RLS para `chat_contacts` (por organization_id) e `chat_contact_inboxes` (por inbox_id / organization via inbox).  
   - Índices para listagens: contact_inboxes por inbox; contacts por organization.

### 2.2 API (flunx-api)

- **webhookEvolution.js:**  
  - CONTACTS/CHATS: criar ou buscar **contact** por (organization_id, identifier); criar ou buscar **contact_inbox** por (inbox_id, source_id); usar contact_inbox_id onde hoje usa contact_id.  
  - MESSAGES: garantir contact + contact_inbox; conversa por (inbox_id, contact_inbox_id); mensagem em conversation_id.
- **routes/channels.js:**  
  - Listagem de conversas: join com contact_inboxes e contacts; retornar contact (nome, avatar) e source_id quando fizer sentido.  
  - Contatos por inbox: listar contact_inboxes do inbox com dados do contact.  
  - Envio de mensagem: obter remote_jid do contact_inbox (source_id) ou do contact (identifier).

### 2.3 Front (flunx-chat)

- Listagens e detalhe de conversa continuam usando “contact” como hoje; a API passa a montar esse objeto a partir de contact + contact_inbox.
- Nenhuma mudança obrigatória de tela se a API manter o mesmo contrato de resposta (objeto “contact” com nome, avatar, etc.).

**Critério de conclusão Fase 2:** Um mesmo contato (mesmo identifier em uma org) pode aparecer em mais de um inbox; em cada inbox há um contact_inbox com source_id; conversas referenciam contact_inbox; webhook e rotas usam o novo modelo.

---

## Fase 3 – Múltiplas conversas por contact_inbox (reabertura)

**Objetivo:** Permitir várias conversas (threads) por (inbox, contact); “resolver” e “reabrir” pode criar ou reutilizar conversa, estilo Chatwoot.

### 3.1 Schema

- Remover UNIQUE(inbox_id, contact_id) ou UNIQUE(inbox_id, contact_inbox_id) de **chat_conversations**.
- Adicionar índice para “conversa ativa” por contact_inbox (ex.: status = open, ou última por updated_at).
- Manter **status** (open, pending, resolved) em chat_conversations.

### 3.2 Lógica de “conversa ativa”

- **Webhook (nova mensagem):**  
  - Se config “reopenConversation”: buscar última conversa do contact_inbox com status open; se não houver, buscar última resolved e reabrir (status = open) ou criar nova conversa.  
  - Se não reabrir: sempre criar nova conversa por mensagem (não recomendado).  
  - Política recomendada: reutilizar conversa open; se só existir resolved, reabrir a última (ou criar nova – configurável).

- **API:**  
  - Listar conversas por inbox: todas as conversas (ou filtrar por status); ordenar por last_activity_at ou updated_at.  
  - “Resolver” = atualizar status para resolved.  
  - “Nova conversa” com mesmo contato = criar nova linha em chat_conversations (contact_inbox_id igual).

### 3.3 Front

- Lista de conversas: exibir múltiplas linhas por “contato” quando houver mais de uma thread (ex.: “João – conversa 1”, “João – conversa 2” ou “João (reaberta)”).
- Botão “Resolver” e “Reabrir” ou “Nova conversa” com esse contato.
- Ao abrir conversa, carregar mensagens da conversation_id correta.

**Critério de conclusão Fase 3:** Múltiplas conversas por (inbox, contact/contact_inbox); reabertura e resolução alinhadas ao fluxo Chatwoot.

---

## Fase 4 – Refinos (opcional)

- **Mensagens sem key.id:** já coberto na Fase 0.2.
- **Labels por tabela de junção:** criar `chat_conversation_labels` (conversation_id, label_id) e migrar labels de JSON para essa tabela; opcional e pode ficar para depois.
- **Import automático na conexão:** flag em chat_inboxes (ex.: `auto_import_messages_on_connect`) e, no CONNECTION_UPDATE (open), chamar findMessages para cada conversa existente (ou só as recentes) e importar; limitar por dias para não sobrecarregar.
- **Enriquecimento de perfil síncrono:** no webhook, ao criar/buscar contact, chamar fetchProfile/fetchProfilePictureUrl antes de responder (pode aumentar latência do webhook); manter assíncrono como padrão e deixar síncrono como opção configurável.

---

## Ordem de execução sugerida e dependências

```
Fase 0.1 (POST messages)     → 0.2 (mensagens sem id)   [independentes entre si]
        ↓
Fase 1.1 (doc Evolution)     → 1.2 (job mídia)          [1.2 opcional]
        ↓
Fase 2 (Contact + ContactInbox)  [requer migração + deploy coordenado]
        ↓
Fase 3 (múltiplas conversas)
        ↓
Fase 4 (refinos)
```

- **Fase 0** pode ser feita imediatamente; não depende de mudança de schema.
- **Fase 1** não depende de Fase 2/3; pode ser feita em paralelo ou logo após Fase 0.
- **Fase 2** é pré-requisito para Fase 3 (múltiplas conversas por contact_inbox fazem mais sentido com contact_inbox no schema).
- **Fase 3** depende da Fase 2 (contact_inbox_id em conversas).

---

## Resumo por prioridade

| Prioridade | Item | Fase | Esforço estimado |
|------------|------|------|-------------------|
| P0 | POST /conversations/:id/messages (envio pelo agente) | 0.1 | 1–2 dias |
| P1 | Persistir mensagens sem key.id | 0.2 | 0,5 dia |
| P2 | Mídia: doc Evolution + (opcional) job/endpoint | 1 | 1–2 dias |
| P3 | Modelo Contact + ContactInbox + migração | 2 | 3–5 dias |
| P4 | Múltiplas conversas + reabertura | 3 | 2–3 dias |
| P5 | Refinos (labels, import auto, etc.) | 4 | sob demanda |

---

## Próximo passo recomendado

1. **Implementar Fase 0.1** (POST messages na flunx-api + chamada à Evolution sendText/sendMedia).  
2. Validar envio de ponta a ponta (front → API → Evolution → WhatsApp e mensagem na lista).  
3. Em seguida Fase 0.2 (mensagens sem key.id) e Fase 1 (mídia).  
4. Planejar janela de deploy e migração para Fase 2 (comunicação com usuários se houver impacto em dados/UI).

Documentos de apoio: `COMPARATIVO-CHATWOOT-EVO-VS-FLUNX-ASPECTOS.md`, `ANALISE-CHATWOOT-BACKEND-E-FLUXO-EVOLUTION.md`, `CHATWOOT-EVOLUTION-INTEGRACAO-NATIVA.md`.

---

## Avaliação do plano conforme documentação oficial

Esta seção confronta cada fase do plano com as documentações do **Chatwoot** ([developers.chatwoot.com](https://developers.chatwoot.com)) e da **Evolution API** ([docs.evoapicloud.com](https://docs.evoapicloud.com)), e registra referências exatas para implementação.

### Fase 0 – Quick wins

| Item | Documentação consultada | Conclusão | Ajuste no plano |
|------|-------------------------|-----------|-----------------|
| **0.1 Envio de mensagem** | Evolution: [Send Plain Text](https://docs.evoapicloud.com/api-reference/message-controller/send-text) – `POST /message/sendText/{instance}`, body: `number` (obrigatório, “with country code”), `text` (obrigatório). Resposta 201: `key.id`, `key.remoteJid`, `messageTimestamp`, `status`. | O plano está correto. Falta precisar path e body na flunx-api. | Incluídos path e body exatos abaixo (referência Evolution). |
| **0.1 Envio de mídia** | Evolution: [Send Media](https://docs.evoapicloud.com/api-reference/message-controller/send-media) – `POST /message/sendMedia/{instance}`, body: `number`, `mediatype`, `mimetype`, `caption`, `media` (URL ou base64), `fileName`. | Coerente com Fase 0.1; implementar após sendText. | Referência explícita em 0.1. |
| **0.2 Mensagens sem key.id** | N/A (comportamento interno Flunx). | Estratégia `temp_<uuid>` e política de duplicata estão adequadas. | Nenhum. |

**Referências Evolution para Fase 0.1 (implementação):**

- **Send Text:** `POST {EVOLUTION_BASE_URL}/message/sendText/{instanceName}`  
  - Body: `{ "number": "<remoteJid ou número E.164>", "text": "<conteúdo>" }`  
  - Header: `apikey` (se configurado).  
  - Resposta 201: usar `key.id` como `evolution_message_id` ao persistir em `chat_messages`.
- **Send Media:** `POST {EVOLUTION_BASE_URL}/message/sendMedia/{instanceName}`  
  - Body: `{ "number", "mediatype", "mimetype", "caption", "media", "fileName" }` ([Send Media](https://docs.evoapicloud.com/api-reference/message-controller/send-media)).

### Fase 1 – Mídia recebida

| Item | Documentação consultada | Conclusão | Ajuste no plano |
|------|-------------------------|-----------|-----------------|
| **1.1 mediaUrl no webhook** | Evolution: webhook e opções de storage/enrichment dependem da instalação. | Plano correto (documentar/checklist). | Nenhum. |
| **1.2 Job/endpoint mídia** | Evolution: [Get Base64](https://docs.evoapicloud.com/api-reference/chat-controller/get-base64) – `POST /chat/getBase64FromMediaMessage/{instance}`, body: `{ "message": { "key": { "id": "<message_id>" } }, "convertToMp4": true }` (vídeo). | Path e body confirmados; o `key` pode exigir `remoteJid` em algumas versões – validar na Evolution usada. | Incluída referência exata abaixo. |

**Referência Evolution para Fase 1.2:**

- **Get Base64 (mídia):** `POST {EVOLUTION_BASE_URL}/chat/getBase64FromMediaMessage/{instanceName}`  
  - Body: `{ "message": { "key": { "id": "<evolution_message_id>", "remoteJid": "<opcional, se exigido>" } }, "convertToMp4": true }` para vídeos.  
  - Usar resposta para upload no Supabase Storage e preencher `chat_messages.media_url`.

### Fase 2 – Contact + ContactInbox

| Item | Documentação consultada | Conclusão | Ajuste no plano |
|------|-------------------------|-----------|-----------------|
| **Contact por organização** | Chatwoot: Contact é por conta (account); identifier e contact_inboxes com source_id. | Plano alinhado ao modelo Chatwoot. | Nenhum. |
| **Criação de conversa** | Chatwoot: [Create New Conversation](https://developers.chatwoot.com/api-reference/conversations/create-new-conversation) – `POST /api/v1/accounts/{account_id}/conversations` com `source_id`, `inbox_id`, `contact_id`, `status` (open/pending/resolved). | O plano (conversa por inbox + contact_inbox, source_id) está correto. | Nenhum. |
| **Contact Inbox / source_id** | Chatwoot: contact_inbox liga contact ao inbox com `source_id` único por canal. | Fase 2 descreve corretamente UNIQUE(inbox_id, source_id). | Nenhum. |

### Fase 3 – Múltiplas conversas

| Item | Documentação consultada | Conclusão | Ajuste no plano |
|------|-------------------------|-----------|-----------------|
| **Reabertura / status** | Chatwoot: conversas com status open/resolved/pending; reabrir = nova conversa ou reutilizar. Evolution (integração Chatwoot): parâmetro `reopenConversation`. | Plano coerente com ambos. | Nenhum. |

### Fase 4 – Refinos

| Item | Documentação consultada | Conclusão | Ajuste no plano |
|------|-------------------------|-----------|-----------------|
| **Labels, import, enriquecimento** | Chatwoot e Evolution suportam labels, histórico e perfil. | Itens opcionais adequados. | Nenhum. |

**Resumo da avaliação:** O plano está **correto** em relação às documentações do Chatwoot e da Evolution. As únicas alterações feitas foram **especificar referências de API** (paths e bodies) nas Fases 0.1 e 1.2 para implementação precisa, sem mudar escopo ou ordem das fases.
