# Raiz do problema: "0 conversas" / mensagens não aparecem

Investigação focada em encontrar a causa raiz. Sem correções aplicadas.

---

## Causa 1 (front) — Canal "Todos os canais" selecionado

**Onde:** `ChatPage.tsx` + `useConversations.ts`

**O que acontece:**
- `inboxIdForConversations` só tem valor quando um **canal específico** está selecionado:  
  `selectedChannelId && selectedChannelId !== "all" ? selectedChannelId : null`
- Com **"Todos os canais"** selecionado, `inboxIdForConversations` fica **null**.
- Em `useConversations`, a query está com `enabled: !!inboxId && !!token`. Com `inboxId === null`, a query **nunca roda**.
- Resultado: a lista de conversas não é buscada e a tela mostra **0 conversas**.

**Quando ocorre:**
1. Usuário escolhe "Todos os canais" no dropdown → lista fica vazia até trocar para um canal.
2. Não existe nenhum canal na organização (`chat_inboxes` vazio para a org):  
   `channels.length === 0`, o `useEffect` que faz `setSelectedChannelId(channels[0].id)` não roda, continuamos com `"all"` → mesma situação.

**Como confirmar:** Abrir o chat, olhar o seletor de canais. Se estiver em "Todos os canais", selecionar um canal concreto e ver se as conversas aparecem.

---

## Causa 2 (worker) — Inbox não encontrado (nome da instância)

**Onde:** `flunx-rabbitmq-api/src/handlers.js` → `handleMessagesUpsert`

**O que acontece:**
- O worker busca o inbox com:  
  `supabase.from("chat_inboxes").select(...).eq("evolution_instance_name", instanceName).single()`
- O `instanceName` vem do payload (ex.: `payload.instance` = `"flunx-teste-historico-76-5yvb866g"`).
- Se **não existir** nenhuma linha em `chat_inboxes` com esse `evolution_instance_name` exato, o worker loga **"Inbox não encontrado"** e **retorna sem inserir** mensagem nem atualizar conversa.
- Efeito: nenhuma mensagem nova é gravada para esse canal → a API de conversas (com `only_with_messages: true`) não devolve essa conversa → **0 conversas** naquele canal.

**Quando ocorre:**
- Canal foi **reconectado** (novo QR) e ganhou outro `evolution_instance_name` (ex.: novo sufixo), mas a Evolution ainda envia eventos com o **nome antigo**.
- Ou o canal usado no app é de outra organização/outro projeto e o `evolution_instance_name` no Supabase não coincide com o `instance` dos eventos.

**Como confirmar:** Logs do flunx-rabbitmq-api com `[RabbitMQ] Inbox não encontrado: <nome>`. No Supabase, em `chat_inboxes`, comparar `evolution_instance_name` com o `instance` que aparece nesses logs (ou no payload do evento).

---

## Causa 3 (worker) — Payload com `data` aninhado

**Onde:** `flunx-rabbitmq-api/src/handlers.js` → `processEvent` e `handleMessagesUpsert`

**O que acontece:**
- Em `processEvent`: `data = payload.data ?? payload` e depois `handleMessagesUpsert(instanceName, data)`.
- Em `handleMessagesUpsert` a lista de mensagens é montada assim:  
  `data?.key || data?.message ? [data] : []`
- Ou seja, o código espera que **no primeiro nível** de `data` existam `key` e/ou `message`.

Se quem publica no RabbitMQ enviar o body **com um nível a mais**, por exemplo:
```json
{ "event": "messages.upsert", "instance": "...", "data": { "event": "messages.upsert", "instance": "...", "data": { "key": {...}, "message": {...} } } }
```
então:
- `payload.data` = `{ event, instance, data: { key, message } }`
- Esse objeto é passado como `data` para `handleMessagesUpsert`.
- Nesse objeto, `data.key` e `data.message` são **undefined** (o que tem `key`/`message` está em `data.data`).
- Resultado: `list = []`, **nenhuma mensagem é processada** → nenhuma inserção em `chat_messages` → **0 conversas**.

**Quando ocorre:** Quando o produtor (Evolution ou um bridge em cima dela) publica no RabbitMQ com esse aninhamento extra.

**Como confirmar:** Log do body recebido no consumer (ex.: primeiro log em `processEvent` ou no `onMessage` do index). Ver se o primeiro nível de `data` tem `key` e `message` ou se eles estão dentro de `data.data`.

---

## Causa 4 (worker) — Erro ao inserir em `chat_messages`

**Onde:** `handleMessagesUpsert` → `supabase.from("chat_messages").insert(...)`

**O que acontece:**
- Se o `insert` falhar (constraint, coluna obrigatória, RLS, etc.), o worker loga **"Erro ao inserir mensagem"** e dá **throw** → a mensagem do RabbitMQ é **nackada** (volta para a fila).
- Nenhuma linha nova em `chat_messages` → conversa não é atualizada com mensagem → com `only_with_messages: true` a API pode não devolver essa conversa ou a conversa fica sem preview.

**Como confirmar:** Logs do flunx-rabbitmq-api com `[RabbitMQ] Erro ao inserir mensagem:` + detalhe do erro. Conferir no Supabase (schema, RLS, constraints) a tabela `chat_messages`.

---

## Ordem prática para achar a raiz

1. **No front:** Ver se o canal selecionado é "Todos os canais". Se for, escolher um canal específico e ver se as conversas carregam → **Causa 1**.
2. **Logs do worker:** Procurar por "Inbox não encontrado" → **Causa 2**. Procurar por "Erro ao inserir mensagem" → **Causa 4**.
3. **Supabase:** Para o canal que deveria ter conversas, ver se existe linha em `chat_inboxes` com `evolution_instance_name` igual ao `instance` do evento e se há linhas em `chat_messages` para esse inbox → distingue Causa 2 (inbox não achado) de Causa 3/4 (payload ou insert).
4. **Formato do payload:** Se inbox existe e não há "Erro ao inserir" mas também não há mensagens novas, logar o body recebido no consumer e ver se `data.key`/`data.message` estão no nível esperado → **Causa 3**.

Nenhuma alteração de código foi feita; este doc só descreve onde está o problema e como validar cada causa.
