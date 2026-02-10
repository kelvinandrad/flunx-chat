# Investigação: onde estão os logs (flunx-chat, workers, Supabase, RabbitMQ)

Documento **somente de pesquisa** — onde procurar logs em cada componente e como o fluxo se conecta. Nenhuma alteração de código ou execução é feita aqui.

---

## 1. Visão geral do fluxo

```
[WhatsApp] ←→ [Evolution API] → [RabbitMQ exchange: evo_cloud]
                                       ↓
                              [Fila: flunx_evolution_events]
                                       ↓
                              [flunx-rabbitmq-api = "worker"]
                                       ↓
                              [Supabase: chat_inboxes, chat_contacts, chat_conversations, chat_messages]

[flunx-chat (front)] ←→ [flunx-channels-api] ←→ [Supabase REST + Realtime]
```

- **Evolution** publica eventos (messages.upsert, connection.update, qrcode.updated, etc.) no exchange **evo_cloud** (configuração `RABBITMQ_GLOBAL_ENABLED` na Evolution).
- A fila **flunx_evolution_events** consome esses eventos (binding no exchange).
- O **flunx-rabbitmq-api** (o “worker”) consome essa fila e grava/atualiza no **Supabase**.
- O **flunx-chat** (front) chama a **flunx-channels-api** para listar conversas/mensagens e usa **Supabase Realtime** para atualizações ao vivo.

---

## 2. Onde ver logs por componente

### 2.1 flunx-rabbitmq-api (worker)

**O que é:** Consumer Node.js que lê da fila `flunx_evolution_events` e persiste no Supabase.

**Onde rodam os logs:** stdout/stderr do processo (Docker/Swarm, PM2, ou terminal onde você roda `node src/index.js`).

**Mensagens que aparecem no código (src/):**

| Arquivo        | Tipo   | Mensagem / condição |
|----------------|--------|----------------------|
| index.js       | log    | `[Startup] flunx-rabbitmq-api iniciando...` |
| index.js       | log    | `[RabbitMQ] Consumindo de flunx_evolution_events` |
| index.js       | error  | `[RabbitMQ] Connection error:` |
| index.js       | warn   | `[RabbitMQ] Connection closed. Reconnecting in 5s...` |
| index.js       | log    | `[RabbitMQ] Fila flunx_evolution_events não existe, ignorando` (só se NOT_FOUND e NODE_ENV !== production) |
| index.js       | warn   | `[RabbitMQ] Erro ao consumir flunx_evolution_events:` |
| index.js       | error  | `[RabbitMQ] Erro ao processar mensagem:` (parse ou processEvent falhou; mensagem é nackada e volta pra fila) |
| index.js       | error  | `[Startup] SUPABASE_URL e SUPABASE_SERVICE_KEY obrigatórios` |
| index.js       | error  | `[Startup] Falha:` |
| handlers.js    | log    | `[RabbitMQ] Evento: ${event}, Instância: ${instanceName}` (em dev) |
| handlers.js    | error  | `[RabbitMQ] Inbox não encontrado: ${instanceName}` |
| handlers.js    | warn   | `[RabbitMQ] messages.upsert: ignorando item sem remoteJid` |
| handlers.js    | error  | `[RabbitMQ] Erro ao inserir mensagem:` + detalhe (insert em chat_messages falhou) |
| handlers.js    | error  | `[RabbitMQ] Erro ao criar contato:` |
| handlers.js    | error  | `[RabbitMQ] Erro ao criar conversa:` |
| handlers.js    | error  | `[RabbitMQ] handleConnectionUpdate error:` |
| handlers.js    | error  | `[RabbitMQ] Error fetching instance info:` |
| handlers.js    | log    | `[RabbitMQ] Canal marcado como conectado: instance=..., inbox_id=...` |
| handlers.js    | warn   | `[RabbitMQ] Evento sem instance:` + trecho do payload |
| handlers.js    | log    | `[RabbitMQ] Evento não tratado: ${event}` |
| handlers.js    | error  | `[RabbitMQ] Erro processando ${event}:` |

**Como acessar na prática:**

- **Docker/Swarm:** `docker service logs <nome_do_serviço_flunx_rabbitmq_api>` ou equivalente (ex.: `flunx-rabbitmq-api_worker`).
- **Docker Compose:** `docker compose logs -f <serviço>` do stack que sobe o worker.
- **PM2:** `pm2 logs` ou `pm2 logs <id>`.

**Variáveis que afetam o worker:** `RABBITMQ_URI`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `NODE_ENV`.

---

### 2.2 flunx-channels-api (API REST)

**O que é:** API Express que o flunx-chat usa (canais, conversas, mensagens, sync, envio).

**Onde rodam os logs:** stdout/stderr do processo (Docker, PM2, etc.).

**Mensagens que aparecem no código (src/):**

| Arquivo   | Tipo   | Mensagem / contexto |
|-----------|--------|----------------------|
| index.js  | log    | `[flunx-channels-api] Rodando na porta ${PORT}` |
| index.js  | warn   | `[POST /channels] setInstanceSettings failed:` |
| index.js  | error  | `[POST /channels] Erro:` |
| index.js  | error  | `[GET /channels/:id/info] Erro:` |
| index.js  | error  | `[POST /channels/:id/reconnect] Error:` |
| index.js  | error  | `[DELETE /channels/:id] Error:` |
| index.js  | log    | `[POST /inboxes/:inboxId/sync] OK:` + objeto com counts |
| index.js  | error  | `[POST /inboxes/:inboxId/sync] Error:` |
| index.js  | error  | `[GET /inboxes/:inboxId/conversations] Error:` |
| index.js  | error  | `[GET /inboxes/:inboxId/contacts] Error:` |
| index.js  | error  | `[GET /conversations/:conversationId/messages] Error:` |
| index.js  | error  | `[POST /conversations/:conversationId/messages] Error:` |
| index.js  | error  | `[PATCH /conversations/:conversationId] Error:` |
| auth.js   | error  | `[Auth] Erro:` |
| supabase.js | warn | SUPABASE_URL or SUPABASE_SERVICE_KEY missing |

**Como acessar:** logs do container/serviço que roda a API (ex.: `api-canais.flunx.com.br` → mesmo padrão Docker/PM2 acima).

**Variáveis:** `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`.

---

### 2.3 flunx-chat (frontend)

**O que é:** SPA React (Vite). Não há servidor de logs centralizado; só o que roda no navegador ou no processo de build.

**Onde aparecem “logs”:**

- **Console do navegador (F12 → Console):**
  - `[ChatPage] Sync concluído:` (após sync do inbox).
  - `[useChannels] Refreshing channel info:` (ao atualizar info do canal).
  - Erros de rede (fetch falhou, 4xx/5xx da API) e possíveis `console.error` de libs (React Query, etc.).
- **Build (npm run build / vite build):** erros de TypeScript/build no terminal onde rodou o build.

**Variáveis (env):** `VITE_CHANNELS_API_URL` ou `VITE_EVOLUTION_API_URL` (definem para qual API o front chama).

Não há Sentry ou outro serviço de log remoto configurado no código atual; tudo é local no devtools.

---

### 2.4 RabbitMQ

**O que é:** Message broker. Exchange **evo_cloud**; fila **flunx_evolution_events** (ou nome configurado).

**Onde ver “logs” e estado:**

- **Management UI:** se estiver exposto (ex.: `rabbitmq.yaml` com porta 15672 e Traefik em `rabbit.flunx.com.br`):
  - **Queues:** ver fila `flunx_evolution_events` — mensagens prontas, não confirmadas, taxa de publish/consume.
  - **Exchanges:** exchange `evo_cloud` e bindings.
  - **Connections/Channels:** conexão do consumer (flunx-rabbitmq-api); se cair, some da lista.
- **Logs do servidor RabbitMQ:** stdout do container `rabbitmq` (Docker/Swarm). Menos úteis para conteúdo das mensagens; mais para erros de conexão/cluster.

**Variáveis (rabbitmq.yaml / env):** usuário/senha (ex.: admin), portas 5672 (AMQP) e 15672 (management). A URI usada pelo worker está em `RABBITMQ_URI` no .env do flunx-rabbitmq-api.

---

### 2.5 Supabase (projeto Flunx)

**Projeto:** URL `https://rcteeqvosthccuepebmr.supabase.co` (e ref `rcteeqvosthccuepebmr`).

**Onde ver logs (sem executar nada no código):**

- **Dashboard:** https://supabase.com/dashboard → selecionar o projeto → **Logs**.
  - **API Logs (Edge Logs):** requisições REST/GraphQL ao Supabase (PostgREST). Útil para ver chamadas do flunx-chat e da flunx-channels-api ao Supabase (auth, tabelas).
  - **Postgres Logs:** queries e erros no banco. Pode exigir extensão/audit conforme plano (ver doc oficial).
  - **Realtime:** se habilitado, logs de conexões/inscrições.
  - **Auth:** logins, tokens, erros de auth.

**Tabelas relevantes para o chat:**

- `chat_inboxes` — canais; `evolution_instance_name` deve bater com o `instance` dos eventos.
- `chat_contacts` — contatos por inbox.
- `chat_conversations` — conversas (uma por contato/inbox).
- `chat_messages` — mensagens; inseridas pelo worker a partir de `messages.upsert`.

Consultar dados (para investigar “0 conversas”): usar o **Table Editor** do Dashboard ou um cliente SQL com a connection string do projeto (não usar as chaves em scripts sem necessidade; o usuário pediu só investigação).

**Credenciais que você citou:** anon key, service_role, access token (sbp_...) — servem para API e possível uso no Table Editor / SQL; não são “logs” em si, mas permitem checar se há linhas em `chat_inboxes`, `chat_conversations`, `chat_messages` após um evento.

---

## 3. Ordem sugerida para investigar “mensagem não apareceu / 0 conversas”

1. **Worker (flunx-rabbitmq-api):**
   - Procurar por `[RabbitMQ] Inbox não encontrado:` (instance do evento ≠ nenhum `evolution_instance_name` em `chat_inboxes`).
   - Procurar por `[RabbitMQ] Erro ao inserir mensagem:` (falha ao inserir em `chat_messages`).
   - Procurar por `[RabbitMQ] Erro ao processar mensagem:` (erro geral; mensagem é nackada).

2. **RabbitMQ Management:**
   - Ver se a fila existe e se há consumer conectado.
   - Ver se há mensagens acumuladas (possível falha contínua do consumer).

3. **Supabase – dados:**
   - Em `chat_inboxes`: conferir `evolution_instance_name` do canal que você usa no chat.
   - Comparar com o `instance` que vem no payload do evento (ex.: no body do messages.upsert).
   - Em `chat_conversations` e `chat_messages`: ver se existem linhas para esse inbox após enviar/receber a mensagem.

4. **flunx-channels-api:**
   - Se listar conversas falhar, deve aparecer `[GET /inboxes/:inboxId/conversations] Error:` nos logs da API.

5. **flunx-chat (navegador):**
   - Console (F12): erros de fetch, 401/403/500, e o `[ChatPage] Sync concluído` para ver se o sync retornou counts.

6. **Supabase Logs (Dashboard):**
   - API Logs: ver se as chamadas do front/API ao Supabase estão 200 ou com erro.
   - Postgres (se disponível): ver se há erro de constraint ou permissão nas tabelas de chat.

---

## 4. Referências rápidas no código

- **Worker – fila e exchange:** `flunx-rabbitmq-api/src/index.js` (fila `flunx_evolution_events`; exchange configurado na Evolution).
- **Worker – tratamento de eventos:** `flunx-rabbitmq-api/src/handlers.js` (`processEvent`, `handleMessagesUpsert`, etc.).
- **API – listagem de conversas:** `flunx-channels-api/src/index.js` (GET `/inboxes/:inboxId/conversations`; filtro `only_with_messages`).
- **API – listagem de mensagens:** GET `/conversations/:conversationId/messages`.
- **Front – chamadas à API:** `flunx-chat/src/lib/chat-api.ts` e hooks `useConversations`, `useMessages` em `src/hooks/`.
- **Doc de debug conversas vazias:** `flunx-rabbitmq-api/docs/DEBUG-CONVERSAS-VAZIAS.md`.

---

## 5. Resumo

| Componente           | Onde ver logs / estado |
|----------------------|------------------------|
| flunx-rabbitmq-api   | stdout do processo (Docker/PM2); prefixo `[RabbitMQ]` / `[Startup]` |
| flunx-channels-api   | stdout do processo; prefixo `[flunx-channels-api]`, `[POST /...]`, `[GET /...]`, `[Auth]` |
| flunx-chat           | Console do navegador (F12); build no terminal |
| RabbitMQ             | Management UI (filas, exchange, consumers); logs do container RabbitMQ |
| Supabase             | Dashboard → Logs (API, Postgres, Realtime, Auth); Table Editor / SQL para dados |

Nenhum ajuste foi executado; este documento é apenas para orientar a investigação dos logs e do fluxo de ponta a ponta.
