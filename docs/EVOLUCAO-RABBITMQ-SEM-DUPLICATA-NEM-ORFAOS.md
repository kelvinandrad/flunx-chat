# Evolução para RabbitMQ — Sem duplicação nem código órfão

**Objetivo:** Ao implementar flunx-evolution-api + flunx-rabbitmq-api (eventos via RabbitMQ em vez de webhook HTTP), garantir que nada fique duplicado e nenhum código fique órfão.

---

## 1. Princípio

- **Uma única fonte de verdade** para cada responsabilidade: criar/configurar instância numa API; processar eventos (QR, connection, mensagens) noutra.
- **Remover** o que deixar de ser usado; **mover** lógica que mudar de serviço; **não** manter dois caminhos fazendo a mesma coisa.

---

## 2. Mapa atual (flunx-channels-api)

| Arquivo / trecho | Responsabilidade | O que fazer na migração |
|------------------|------------------|--------------------------|
| `index.js` | Rotas: POST/GET /channels, /inboxes/:id/sync, /conversations, /webhook/evolution | Renomear projeto; **remover** rota `POST /webhook/evolution` e **remover** chamadas a `setWebhook()` ao criar/reconectar canal. Manter resto (canais, sync, conversas, mensagens) até quando decidir mover. |
| `webhookEvolution.js` | Receber POST da Evolution → atualizar `chat_inboxes` (QR, connection), criar contato/conversa/mensagem | **Toda** essa lógica passa a ser responsabilidade da **flunx-rabbitmq-api**. Em flunx-evolution-api: **remover** o arquivo e o import/rota. |
| `evolution.js` | `createInstance`, `setWebhook`, `connectInstance`, `findContacts`, `findChats`, etc. | Manter; adicionar `setInstanceSettings` e `setRabbitMQ` (Evolution API). **Remover** `setWebhook` (e qualquer uso) quando webhook for desativado. |
| `auth.js`, `supabase.js`, `utils.js` | Auth JWT, Supabase, helpers | Manter (sem duplicar em flunx-rabbitmq-api; essa API terá seu próprio auth/supabase se precisar). |
| `extractMessageContent` | Usado em `webhookEvolution.js` e em `index.js` (sync) | Hoje exportado de webhookEvolution e usado no sync. Ao apagar webhookEvolution: **manter** a função em um único lugar na flunx-evolution-api (ex.: `evolution.js` ou `utils.js`) para o sync; na **flunx-rabbitmq-api** terá sua **própria** cópia só para eventos (ou um pacote compartilhado para não duplicar). |

---

## 3. O que NÃO duplicar

- **Processamento de eventos Evolution (QR, CONNECTION_UPDATE, MESSAGES_*):** só na **flunx-rabbitmq-api**. Não manter webhook HTTP processando os mesmos eventos.
- **Criação/configuração de instância na Evolution:** só na **flunx-evolution-api** (create + set settings + set RabbitMQ). Não fazer isso na flunx-rabbitmq-api.
- **Definição de “canal” (chat_inboxes):** só na flunx-evolution-api (ou no app que chama essa API). flunx-rabbitmq-api só atualiza estado (QR, connection_status) e depois contatos/conversas/mensagens.

---

## 4. O que remover (evitar órfãos)

| Onde | O que remover | Conferir antes |
|------|----------------|----------------|
| flunx-evolution-api (ex-channels-api) | Rota `POST /webhook/evolution` | Nenhum cliente deve depender dessa URL após migração. |
| flunx-evolution-api | Chamadas a `setWebhook(instanceName, url)` em POST /channels e POST /channels/:id/reconnect | Substituir por setInstanceSettings + setRabbitMQ. |
| flunx-evolution-api | Arquivo `webhookEvolution.js` inteiro | Mover lógica útil (ex.: `extractMessageContent`) para `evolution.js` ou `utils.js` se o **sync** ainda usar; o restante (handlers de evento) vai para flunx-rabbitmq-api. |
| flunx-evolution-api | Função `setWebhook` em `evolution.js` | Só remover depois de não ser chamada em lugar nenhum. |
| flunx-chat (e outros clientes) | `VITE_CHANNELS_API_URL` / referências a “channels-api” | Trocar para URL/nome da flunx-evolution-api (ex.: `VITE_EVOLUTION_API_URL` ou manter nome da URL se for só renomear serviço). |
| Deploy / Docker / docs | Nome do serviço e imagem `flunx-channels-api` | Renomear para flunx-evolution-api; atualizar todos os YAMLs, README e referências. |

---

## 5. O que mover (não duplicar)

| De | Para | Observação |
|----|------|------------|
| Lógica de `handleQRCodeUpdate`, `handleConnectionUpdate`, `handleMessagesUpsert`, `handleMessagesUpdate`, `handleChatsUpdate` em webhookEvolution.js | **flunx-rabbitmq-api** (novo serviço) | Consumidor RabbitMQ chama funções equivalentes; payload é o mesmo (event + instance + data). |
| Helpers `findOrCreateContact`, `findOrCreateConversation`, `extractMessageContent` (usados por esses handlers) | **flunx-rabbitmq-api** | Copiar ou extrair para lib compartilhada. Se copiar, deixar comentário “Fonte: ex-webhookEvolution; manter alinhado com flunx-evolution-api se houver regra de negócio compartilhada”. |
| `extractMessageContent` para uso no **sync** (POST /inboxes/:id/sync) | Manter em **flunx-evolution-api** (evolution.js ou utils.js) | Sync continua na flunx-evolution-api; não depender de webhookEvolution.js após remoção. |

---

## 6. Checklist antes de cada PR / merge

- [ ] Nenhuma rota ou função pública removida sem que todos os chamadores tenham sido atualizados ou a rota descontinuada em doc.
- [ ] Busca por “channels-api”, “webhook/evolution”, “setWebhook”, “handleEvolutionWebhook” no monorepo/repos: nenhum uso órfão.
- [ ] Eventos Evolution processados em **um só lugar** (flunx-rabbitmq-api); webhook HTTP não usado para os mesmos eventos.
- [ ] `extractMessageContent` (ou equivalente) existe em no máximo dois lugares: flunx-evolution-api (sync) e flunx-rabbitmq-api (eventos), ou num pacote compartilhado.
- [ ] Variáveis de ambiente e nomes de serviço (Docker, stack) atualizados; nenhum `.env.example` ou README referenciando nome/URL antiga sem aviso.

---

## 7. Referências rápidas no código atual

- **Rota webhook:** `index.js` linha ~55 (`app.post("/webhook/evolution", ...)`).
- **setWebhook chamado:** `index.js` ~93-97 (POST /channels), ~323-326 (reconnect).
- **Handlers de evento:** `webhookEvolution.js` (handleQRCodeUpdate, handleConnectionUpdate, handleMessagesUpsert, etc.).
- **extractMessageContent:** exportado em `webhookEvolution.js`, usado em `index.js` no sync (upsertMessageFromChat).
- **Frontend:** `VITE_CHANNELS_API_URL` em chat-api.ts, useChannels.ts, CreateChannelDialog, ReconnectDialog, RefreshQRDialog, DeleteChannelDialog.

Documentar aqui qualquer outro trecho que for removido ou movido para não perder referência.
