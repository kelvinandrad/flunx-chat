# Como a integração Chatwoot ↔ Evolution API funciona

**Data:** 10 de fevereiro de 2026  
**Objetivo:** Esclarecer quem “gerencia” a integração (Chatwoot vs Evolution) e descrever a API da Evolution (repositório, webhooks, integração Chatwoot).

---

## 1. Quem tem integração “nativa” com quem?

### 1.1 Chatwoot **não** tem integração nativa com Evolution API

No repositório oficial do **Chatwoot** ([github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)) **não existe** nenhum código específico para “Evolution API”. O que existe é:

- **Channel::Whatsapp** – integração com **360Dialog** e **WhatsApp Cloud API** (Meta).
- **Channel::Api** – canal genérico (API Channel) com `identifier`, `webhook_url`, HMAC. Qualquer sistema externo (incluindo um backend que fale com Evolution) pode usar esse canal.

Ou seja: o Chatwoot **não** “gerencia” a integração com a Evolution. Ele só expõe a **API pública** (contacts, conversations, messages) e o **webhook do Inbox** para receber eventos (ex.: mensagem enviada pelo agente). Quem “puxa” a integração é a Evolution.

### 1.2 Evolution API **tem** integração nativa com Chatwoot

No repositório da **Evolution API** ([github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)) a integração com Chatwoot está no código:

- **Caminho:** `src/api/integrations/chatbot/chatwoot/`
- **Rotas:** montadas em `/chatwoot/` (via `ChatbotRouter`).
- **Documentação oficial:** [doc.evolution-api.com – Chatwoot](https://doc.evolution-api.com/v2/en/integrations/chatwoot).

Resumo:

| Lado        | Tem código específico para o outro? | O que faz |
|------------|--------------------------------------|-----------|
| **Chatwoot** | Não (Evolution não existe no código) | Oferece API Channel + webhook; Evolution usa isso. |
| **Evolution** | Sim (módulo Chatwoot completo)       | Configura Chatwoot por instância, recebe webhook do Chatwoot, chama API do Chatwoot para contact/conversation/message. |

---

## 2. Como a Evolution API gerencia a integração com o Chatwoot

### 2.1 Configuração por instância

A Evolution guarda, **por instância** (nome da conexão WhatsApp), os dados do Chatwoot:

- `accountId` – ID da account no Chatwoot  
- `token` – token de acesso (api_access_token)  
- `url` – base URL do Chatwoot (sem barra no final)  
- `nameInbox` – nome do inbox no Chatwoot (ex.: "evolution" ou nome da instância)  
- `signMsg`, `reopenConversation`, `conversationPending`, `mergeBrazilContacts`  
- `importContacts`, `importMessages`, `daysLimitImportMessages`  
- `autoCreate` – se deve criar o inbox no Chatwoot automaticamente  

Configuração possível de duas formas:

1. **Na criação da instância:** `POST /instance/create` com body contendo `chatwootAccountId`, `chatwootToken`, `chatwootUrl`, `chatwootNameInbox`, etc.  
2. **Em instância já criada:** `POST /chatwoot/set/:instanceName` com body no formato da doc (ex.: `enabled`, `accountId`, `token`, `url`, `nameInbox`, …).

### 2.2 Endpoints da Evolution relacionados ao Chatwoot

| Método | Caminho (exemplo) | Uso |
|--------|-------------------|-----|
| POST   | `/chatwoot/set/:instanceName` | Configurar ou alterar integração Chatwoot da instância (com guards de API key e instância). |
| GET    | `/chatwoot/find/:instanceName` | Obter configuração atual do Chatwoot da instância. |
| POST   | `/chatwoot/webhook/:instanceName` | **Webhook que o Chatwoot chama** quando há evento no inbox (ex.: agente envia mensagem). **Sem guard** – o Chatwoot envia POST aqui. |

A URL que o usuário configura no **Inbox do Chatwoot** (API Channel) é exatamente:

`https://<evolution-server>/chatwoot/webhook/<instanceName>`

Assim, quando um agente responde no Chatwoot, o Chatwoot faz POST nessa URL; a Evolution recebe, identifica a instância e envia a mensagem no WhatsApp (Baileys ou Cloud).

### 2.3 Fluxo de mensagem recebida no WhatsApp (Evolution → Chatwoot)

1. WhatsApp entrega a mensagem à instância (Baileys/Cloud) controlada pela Evolution.  
2. A **Evolution** (lógica interna do módulo Chatwoot), ao processar a mensagem:
   - Usa o **Chatwoot SDK** (`@figuro/chatwoot-sdk`) com `url`, `token`, `accountId` da instância.
   - **Contact:** cria ou busca por `phone_number`/`identifier` (ex.: JID) no account; usa `contacts/filter` ou `contacts/search`.
   - **ContactInbox:** garante vínculo contact + inbox (inbox encontrado por `nameInbox`); `source_id` = identificador no canal (ex.: JID).
   - **Conversation:** lista conversas do contact; se `reopenConversation`, reutiliza conversa existente (e opcionalmente reabre/pending); senão cria nova com `conversations.create`.
   - **Message:** cria mensagem **incoming** na conversa com `content`, `message_type: 'incoming'`, anexos se houver, `source_id` (ID da mensagem no WhatsApp).

Ou seja: a Evolution **chama a API REST do Chatwoot** (contacts, conversations, messages); o Chatwoot persiste no PostgreSQL e o front do Chatwoot atualiza via API/WebSocket.

### 2.4 Fluxo de mensagem enviada pelo agente (Chatwoot → Evolution)

1. Agente envia mensagem no Chatwoot (front).  
2. Chatwoot persiste a mensagem e **dispara o webhook do Inbox** (API Channel).  
3. A URL do webhook é a da Evolution: `POST /chatwoot/webhook/:instanceName`.  
4. A Evolution recebe o payload no `receiveWebhook(instance, data)` e:
   - Identifica contact/conversation/message (incl. anexos).
   - Envia a mensagem para o WhatsApp via instância (Baileys ou Cloud).

Nenhum código do Chatwoot “sabe” que é Evolution; ele só envia para a URL configurada no canal.

### 2.5 Auto-create do Inbox no Chatwoot

Se na configuração da instância (ou no `chatwoot/set`) vier `autoCreate: true`, a Evolution pode:

- Chamar a API do Chatwoot para **listar inboxes** e ver se já existe um com `nameInbox`.
- Se não existir, **criar inbox** com `channel.type: 'api'` e `webhook_url: https://<evolution>/chatwoot/webhook/<instanceName>`.
- Opcionalmente criar um “contato bot” (ex.: telefone +123456) e uma conversa inicial com mensagem “init” ou “init:&lt;number&gt;” para pairing/QR.

Isso está em `initInstanceChatwoot` no `chatwoot.service.ts` da Evolution.

---

## 3. Evolution API – repositório e estrutura (resumo)

- **Repositório:** [EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api) (branch principal: `main`).  
- **Stack:** Node/TypeScript, Baileys (WhatsApp Web), opcional WhatsApp Cloud API.  
- **Documentação:** [doc.evolution-api.com](https://doc.evolution-api.com).

### 3.1 Estrutura relevante (src)

- **`src/api/routes/`** – Rotas principais: `instance`, `message`, `chat`, `group`, etc., e montagem de `ChannelRouter`, `EventRouter`, `ChatbotRouter`.  
- **`src/api/integrations/channel/`** – Canais (evolution, meta, whatsapp); ex.: `evolution.router.ts` com `POST webhook/evolution` (webhook genérico).  
- **`src/api/integrations/chatbot/`** – Chatbots: **chatwoot**, typebot, dify, openai, n8n, etc.  
- **`src/api/integrations/chatbot/chatwoot/`** – Integração Chatwoot:
  - **routes:** `chatwoot.router.ts` (set, find, webhook).  
  - **services:** `chatwoot.service.ts` (create/find contact, conversation, message; receiveWebhook; initInstanceChatwoot; merge contacts Brasil; etc.).  
  - **controllers:** `chatwoot.controller.ts` (createChatwoot, findChatwoot, receiveWebhook).  
  - **libs, dto, utils, validate** – suporte (ex.: cliente Postgres opcional para tags Chatwoot).

### 3.2 Extras Chatwoot (n8n)

Na pasta **`Extras/chatwoot/`** do repositório Evolution há **workflows n8n** (JSON):

- **`criador_de_inbox.json`** – Webhook n8n que:
  - Recebe um trigger (ex.: mensagem no Chatwoot com “start:” ou “new_instance:”).
  - Chama `POST {{evolution_url}}/instance/create` com `chatwootAccountId`, `chatwootToken`, `chatwootUrl`, `chatwootNameInbox`, etc.
  - Lista inboxes no Chatwoot, atualiza ou cria inbox e **configura no Chatwoot o webhook_url** para `{{evolution_url}}/chatwoot/webhook/{{instanceName}}`.

- **`configurar_admin.json`** – Cria no Chatwoot inbox “Start”, contato bot, e regras de automação (webhook para n8n) para criar empresas/inboxes.

Ou seja: a integração “oficial” Evolution ↔ Chatwoot está no **código da Evolution**; os Extras são automações opcionais (n8n) para criar instâncias e inbox a partir do Chatwoot.

### 3.3 Eventos / webhook genérico da Evolution

A Evolution emite eventos (ex.: `connection.update`, `messages.upsert`, `contacts.set`, `chats.set`) para:

- **Webhook HTTP** configurado por instância (global).  
- **RabbitMQ, Kafka, SQS**, etc., se configurados.  
- **Integrações** como Chatwoot: a parte Chatwoot **não** depende do webhook HTTP genérico; ela está ligada ao fluxo interno da instância (ao receber mensagem do WhatsApp, a própria Evolution chama a API do Chatwoot).

No **Flunx**, vocês usam o **webhook HTTP** da Evolution para o **flunx-api** (e Supabase), que é um fluxo paralelo ao “Chatwoot oficial”: Evolution → webhook → flunx-api → Supabase; não passam pelo Chatwoot.

---

## 4. Comparação rápida: integração “Evolution ↔ Chatwoot” vs “Evolution ↔ Flunx”

| Aspecto | Evolution ↔ Chatwoot (nativo) | Evolution ↔ Flunx (seu fluxo) |
|--------|--------------------------------|--------------------------------|
| Quem inicia | Evolution (código em `chatbot/chatwoot`) | Evolution (webhook) → flunx-api |
| Persistência | Banco do Chatwoot (Rails/PostgreSQL) | Supabase (chat_contacts, chat_conversations, chat_messages, etc.) |
| Envio de mensagem agente | Chatwoot chama webhook Evolution (`/chatwoot/webhook/:instance`) | Flunx-chat/front chama flunx-api → Evolution API (sendMessage) |
| Contato / Conversa | Contact + ContactInbox + Conversation (modelo Chatwoot) | chat_contacts, chat_conversations (modelo Flunx) |
| Documentação | Doc oficial Evolution + código em `chatwoot/` | Seus docs (EVOLUTION-WEBHOOK-PAYLOADS, ANALISE-CHATWOOT-BACKEND-E-FLUXO-EVOLUTION, etc.) |

O Chatwoot **não** gerencia a integração com a Evolution; a **Evolution** gerencia a integração com o Chatwoot (config, webhook recebido, chamadas à API do Chatwoot). Para o Flunx, a Evolution é apenas a origem dos eventos (webhook) e o destino das mensagens enviadas (API sendMessage); o “cérebro” da persistência e da UX é o Supabase + flunx-api + flunx-chat.

---

## 5. Links úteis

- Chatwoot – API / estrutura: [github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) (branch `develop`).  
- Evolution API – repositório: [github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api).  
- Evolution – doc integração Chatwoot: [doc.evolution-api.com/v2/en/integrations/chatwoot](https://doc.evolution-api.com/v2/en/integrations/chatwoot).  
- Evolution – integração no código: `src/api/integrations/chatbot/chatwoot/` (routes, services, controllers).  
- Chatwoot – API pública (API Channel): [doc. chatwoot – inbox API](https://www.chatwoot.com/help-center) (contacts, conversations, messages).
