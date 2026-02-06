# Plano: modelo Chatwoot no Flunx (conversa só quando há mensagem)

**Implementado:** Fase 1 (comentário worker) + Fase 2 (sync com fallback findContacts+findMessages).

Objetivo: conversas aparecem **só quando existe mensagem**, e a **fonte principal** é o **evento de mensagem** (worker), não a listagem findChats. Sync vira complemento com fallback quando findChats vier vazio.

---

## 1. Estado atual

| Componente | Hoje |
|------------|------|
| **Worker** | Trata MESSAGES_SET / MESSAGES_UPSERT: cria contato → conversa → mensagem. Já tem tratamento de 23505 em findOrCreateContact. Parte das réplicas ainda pode estar com imagem antiga ("Evento não tratado"). |
| **Sync** | Depende de findChats. Se findChats retorna [], `limitedChats = []` e nunca chama findMessages (bloco `import_messages_days` só roda se `limitedChats.length > 0`). |
| **Frontend** | Com 0 conversas, dispara sync com `import_messages_days: 7`. Lista vem da API (conversas com mensagem). |

---

## 2. Visão do modelo Chatwoot no Flunx

- **Fonte primária:** eventos de mensagem (RabbitMQ → worker), como o webhook no Chatwoot.
- **Regra:** conversa só existe quando há pelo menos uma mensagem (já é a regra hoje).
- **Sync:** não depender de findChats. Se findChats vier vazio, usar **findContacts + findMessages por contato** para criar conversas com histórico (fallback).

---

## 3. Plano de implementação

### Fase 1 – Worker como fonte primária (já quase pronto)

**Objetivo:** garantir que todo MESSAGES_SET / MESSAGES_UPSERT seja processado e crie conversa + mensagem.

1. **Conferir deploy do worker**
   - Garantir que **todas** as réplicas do `flunx-rabbitmq-api_worker` usem a imagem que trata MESSAGES_SET e MESSAGES_UPSERT (e que tem o tratamento de 23505 em findOrCreateContact).
   - Rebuild da imagem e `docker service update --image ...` se ainda houver "Evento não tratado: MESSAGES_SET" nos logs.

2. **Não mudar lógica do worker**
   - Manter: CHATS_* e CONTACTS_* só criam contato; conversa + mensagem só em MESSAGES_*.
   - Opcional: log de sucesso ao inserir mensagem (ex.: "Mensagem inserida conversation_id=...") para debug.

**Resultado:** quando a Evolution enviar MESSAGES_SET (ex.: ao conectar com histórico) ou MESSAGES_UPSERT (mensagem nova), a conversa será criada/atualizada sem depender de findChats.

---

### Fase 2 – Sync: fallback sem findChats

**Objetivo:** quando findChats retornar vazio, o sync ainda conseguir criar conversas usando **findContacts + findMessages** (como “importar histórico por contato”).

**Arquivo:** `flunx-channels-api/src/index.js` (POST /inboxes/:inboxId/sync).

1. **Manter fluxo atual quando findChats trouxer chats**
   - Continuar usando `limitedChats` para lastMessage e para o bloco de `import_messages_days` como hoje.

2. **Novo bloco: fallback quando findChats vazio**
   - Condição: `importMessagesDays > 0` e `chats.length === 0` (ou `limitedChats.length === 0`).
   - Fontes de “contatos” para iterar:
     - `contacts` (findContacts) – contatos individuais.
     - `groups` (fetchAllGroups) – opcional, se quiser histórico de grupos.
   - Para cada item (ex.: até 80 contatos, para não estourar tempo/API):
     - `remoteJid` = do contato/grupo.
     - Chamar `findMessages(inbox.evolution_instance_name, remoteJid, limit)` (ex.: 100 ou 500).
     - Se `success && Array.isArray(msgs) && msgs.length > 0`:
       - `upsertContactOnly(remoteJid, name, ...)` (já existe).
       - `getOrCreateConversation(contactId)`.
       - Para cada mensagem no intervalo `importMessagesDays`, chamar `upsertMessageFromChat(...)` (evitar duplicata por evolution_message_id, como hoje).
   - Limitar número de contatos (ex.: 80) e, se quiser, número de mensagens por contato para manter o sync em tempo aceitável.

3. **Métricas de retorno**
   - Manter `conversations_created`, `messages_inserted`, etc. Atualizar contadores também no caminho do fallback.

**Resultado:** com findChats vazio, o sync ainda preenche conversas a partir dos contatos que têm mensagens nos últimos N dias, sem depender de findChats.

---

### Fase 3 – Frontend (opcional)

**Objetivo:** UX clara quando ainda não há conversas.

1. **Mensagem quando 0 conversas**
   - Ex.: “Conversas aparecerão aqui quando houver mensagens” ou “Nenhuma conversa ainda. Envie ou receba uma mensagem no WhatsApp.”
2. **Manter disparo do sync ao abrir o canal**
   - Continuar chamando sync com `import_messages_days: 7` quando a lista estiver vazia; o novo fallback (Fase 2) fará efeito quando findChats vier vazio.

---

### Fase 4 – Verificação Evolution (opcional)

**Objetivo:** saber se a Evolution envia MESSAGES_SET com histórico ao conectar.

- Consultar documentação ou código da Evolution: após connection open, ela envia eventos de tipo messages.set com mensagens existentes?
- Se sim: o worker (Fase 1) já é suficiente para popular conversas ao conectar.
- Se não: o sync com fallback (Fase 2) é o que trará o histórico na primeira abertura.

---

## 4. Ordem sugerida

1. **Fase 1** – Garantir worker atualizado e estável (rápido).
2. **Fase 2** – Implementar fallback no sync (principal ganho quando findChats vem vazio).
3. **Fase 3** – Ajustes de texto/UX no front (opcional).
4. **Fase 4** – Confirmar comportamento da Evolution (opcional).

---

## 5. Resumo

- **Chatwoot:** conversa só quando há mensagem; lista vem 100% de eventos de mensagem (webhook).
- **Flunx após o plano:**  
  - **Worker** = fonte primária (eventos MESSAGES_*), como o webhook no Chatwoot.  
  - **Sync** = complemento: usa findChats quando tiver dados; quando findChats vier vazio, usa findContacts + findMessages por contato para criar conversas com histórico.  
Assim deixamos de depender de findChats para “dar certo” e nos alinhamos ao modelo do Chatwoot.
