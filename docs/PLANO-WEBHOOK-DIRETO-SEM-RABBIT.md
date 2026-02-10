# Plano: Webhook direto Evolution → API Flunx (sem RabbitMQ)

**Data:** 6 de fevereiro de 2026  
**Objetivo:** Remover o RabbitMQ do fluxo de eventos da Evolution. A Evolution envia eventos direto para a API Flunx (webhook); a API processa e persiste no Supabase. flunx-chat e flunx-v2 continuam usando a mesma API.

---

## 1. Arquitetura atual vs desejada

**Atual:**
```
Evolution (recebe msg) → publica no Rabbit → Worker (flunx-rabbitmq-api) consome → Supabase
                              ↑
                    flunx-chat / flunx-v2 leem via API (GET messages)
```

**Desejada:**
```
Evolution (recebe msg) → POST webhook → API Flunx (flunx-channels-api) processa → Supabase
                              ↑
                    flunx-chat / flunx-v2 leem via API (GET messages) — sem mudança
```

---

## 2. Escopo

- **In scope:** Eventos de mensagem e conexão (MESSAGES_UPSERT, MESSAGES_UPDATE, CONNECTION_UPDATE, QRCODE_UPDATED, CHATS_*, CONTACTS_* conforme o worker hoje). Processamento igual ao do worker: findOrCreateContact, findOrCreateConversation, insert em chat_messages, atualização de chat_inboxes (connection_status, qr_code, etc.).
- **Fora do escopo (neste plano):** Não remover o Rabbit de outros usos se existirem (ex.: outros consumidores). Só deixar de usar Rabbit para eventos Evolution que hoje vão para o worker; o worker deixa de ser necessário para esses eventos.

---

## 3. Tarefas de implementação

### 3.1 Evolution: configurar webhook por instância

- **Onde:** Evolution API (configuração por instância).
- **O quê:**
  - Adicionar em **flunx-channels-api** a função que chama a Evolution para registrar o webhook: `setWebhook(instanceName, webhookUrl, events)`.
  - Endpoint Evolution (v2): `POST /webhook/set/{instanceName}` com body: `{ enabled: true, url, webhook_by_events: false, events: ["QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT", "MESSAGES_UPDATE", "MESSAGES_SET", "CHATS_SET", "CHATS_UPSERT", "CHATS_UPDATE", "CONTACTS_UPSERT", "CONTACTS_UPDATE"] }`.
  - URL do webhook: `https://api-canais.flunx.com.br/webhook/evolution` (ou a base da API que for usada em produção).
- **Quando chamar:**
  - Ao **criar canal** (POST /channels): depois de `createInstance` e `setInstanceSettings`, chamar `setWebhook(instanceName, webhookUrl, events)`.
  - Ao **reconectar** (POST /channels/:id/reconnect): após recriar/conectar a instância, garantir webhook configurado (chamar `setWebhook` de novo).
  - Para **canais já existentes** (criados antes desta mudança): rodar um script ou endpoint administrativo que, para cada `chat_inboxes` com `evolution_instance_name`, chame `setWebhook` na Evolution. Opcional: endpoint `POST /channels/:id/set-webhook` para um canal específico.
- **Referência:** [Evolution API - Set Webhook](https://doc.evolution-api.com/v2/api-reference/webhook/set), doc local `EVOLUTION-WEBHOOK-ENDPOINT-CONFIRMACAO.md`.

---

### 3.2 API Flunx: rota POST /webhook/evolution

- **Onde:** flunx-channels-api (express).
- **O quê:**
  - Nova rota: `POST /webhook/evolution` (sem auth Bearer; a Evolution não envia JWT).
  - Body: payload da Evolution (ex.: `{ event, instance, data }`).
  - Resposta: `200 OK` assim que o payload for aceito (processar em background ou em linha; se em linha, manter resposta rápida < timeout da Evolution, ex.: 30s).
  - Opcional: validar um token compartilhado (header `X-Webhook-Token` ou query `token`) se a Evolution permitir enviar; caso contrário, aceitar qualquer POST nessa URL (a URL é “secreta” por ser pouco óbvia).
- **CORS:** Permitir origem da Evolution se necessário; em geral webhook é server-to-server, então pode não precisar.

---

### 3.3 API Flunx: lógica de processamento (igual ao worker)

- **O quê:** A mesma lógica que hoje está em **flunx-rabbitmq-api** (handlers.js + processEvent): normalizar evento, buscar inbox por `evolution_instance_name`, para MESSAGES_UPSERT fazer findOrCreateContact, findOrCreateConversation, insert em chat_messages, etc.
- **Onde colocar:**
  - **Opção A (recomendada para entregar rápido):** Copiar/adaptar os handlers do worker para um módulo dentro da API (ex.: `src/webhook/evolutionHandlers.js`) que use `supabaseAdmin` e as funções já existentes em `evolution.js` (fetchInstanceInfo, formatBrazilianPhone). A rota `/webhook/evolution` chama `processEvent(payload)` desse módulo.
  - **Opção B (menos duplicação, mais refactor):** Extrair a lógica para um pacote compartilhado (ex.: `@flunx/evolution-events`) que receba `supabase` e helpers (fetchInstanceInfo, formatBrazilianPhone) por injeção; o worker e a API passam a usar esse pacote. Exige mover código e ajustar ambos os projetos.
- **Dependências:** O handler precisa de Supabase (service role) e de funções da Evolution (fetchInstanceInfo, formatBrazilianPhone). A API já tem `supabaseAdmin` e `evolution.js`; só falta o arquivo de handlers que chame esses.

---

### 3.4 Garantir envio rápido e não travar a resposta

- A Evolution pode fazer retry se o webhook demorar ou retornar erro. O processamento (várias chamadas ao Supabase) pode levar centenas de ms.
- **Recomendação:** Dentro da rota, chamar `processEvent(payload)` de forma **assíncrona** e responder `200 OK` logo em seguida (await processEvent e depois res.status(200).json({ ok: true }) — ou, se processEvent for rápido, await e responder; se quiser não bloquear, fazer processEvent sem await e responder 200 de imediato, aceitando risco de não logar erro na resposta ao cliente). Preferir await processEvent e responder 200 para que erros sejam logados e a Evolution não retente em vão; otimizar o próprio processamento se necessário.

---

### 3.5 Desligar o uso do Rabbit para eventos Evolution

- **Evolution:** Parar de publicar eventos no Rabbit para as instâncias que usam Flunx (ou desabilitar globalmente o Rabbit para esses eventos, se a Evolution for só nossa). Isso depende de como a Evolution está configurada (variáveis de ambiente, config por instância). Objetivo: nenhum evento MESSAGES_*, CONNECTION_*, etc. ir para a fila que o worker consome.
- **Worker (flunx-rabbitmq-api):** Ou bem **desativar o deploy** desse serviço (já que não haverá mensagens Evolution na fila), ou bem **manter o serviço** mas sem filas Evolution (para não consumir nada). Se não houver outro consumidor da mesma fila, pode desligar o worker.

---

### 3.6 Canais já existentes

- Para cada inbox que já tem `evolution_instance_name` e que deve passar a usar só webhook: chamar na Evolution o set webhook (via script ou endpoint administrativo na API). Sem isso, instâncias antigas continuariam só publicando no Rabbit (se ainda estiver ligado) e não na nossa API.

---

## 4. Ordem sugerida

| # | Tarefa | Responsável |
|---|--------|-------------|
| 1 | Adicionar `setWebhook` em evolution.js (flunx-channels-api) e chamar em POST /channels e em reconnect | Backend |
| 2 | Adicionar módulo de handlers (evolutionHandlers.js ou webhook/evolutionHandlers.js) na API, reutilizando lógica do worker com supabaseAdmin | Backend |
| 3 | Adicionar rota POST /webhook/evolution que recebe o body e chama processEvent | Backend |
| 4 | Testar com uma instância: configurar webhook manualmente na Evolution, enviar mensagem, conferir se aparece no flunx-chat | QA/Dev |
| 5 | Garantir que novos canais (POST /channels) já registrem webhook; opcional: script ou endpoint para canais existentes | Backend |
| 6 | Desligar publicação Evolution → Rabbit (ou desligar worker) e validar que tudo segue funcionando só via webhook | DevOps/Backend |

---

## 5. Riscos e mitigações

- **Evolution não conseguir chamar nossa API (firewall, DNS, SSL):** Garantir que `https://api-canais.flunx.com.br` seja acessível a partir do servidor onde a Evolution roda; certificado válido.
- **Webhook lento ou instável:** Evolution pode fazer retry; processamento deve ser idempotente (evitar duplicar mensagem graças a evolution_message_id). Manter processamento rápido (poucas queries, sem lógica pesada).
- **Perda de eventos se a API estiver fora:** Enquanto a API estiver indisponível, eventos não serão persistidos. Não há fila como buffer. Mitigação: monitorar saúde da API; opcional no futuro: fila de retry na própria API (processar depois).

---

## 6. Resumo

- **Configurar Evolution** para enviar webhook para a API Flunx (set webhook por instância na criação e no reconnect).
- **Implementar** POST /webhook/evolution na flunx-channels-api e a lógica de processamento (igual ao worker, usando supabaseAdmin).
- **Parar** de usar Rabbit para esses eventos (não publicar da Evolution e/ou desligar o worker).
- **flunx-chat e flunx-v2** não precisam de mudança; continuam usando a API para listar mensagens e conversas.

Assim o fluxo fica direto (Evolution → API → Supabase), com latência menor e sem Rabbit no meio.
