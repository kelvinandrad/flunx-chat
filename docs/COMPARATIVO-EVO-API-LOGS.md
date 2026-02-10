# Comparativo: eventos enviados pela Evolution x processados pela API

Baseado nos logs da **Evolution** (container evolution) e da **flunx-api** para as instâncias recentes (flunx-testen6-rw9relwc, flunx-teste-n7-rvo8iagd, **flunx-teste-n8-if95yw69**).

---

## Tabela resumo

| Recebido da Evo | Processado pela API? | O que foi feito |
|-----------------|----------------------|------------------|
| **connection.update** | Sim | Handler executado. Atualiza `chat_inboxes` (connection_status, perfil quando state=open), chama `updateInboxCounts` e dispara `syncInboxAfterConnect`. Resposta 200. |
| **qrcode.updated** | Sim | Handler executado. Atualiza `chat_inboxes` (qr_code, qr_code_generated_at). Resposta 200. |
| **labels.edit** | Sim | Handler executado. Upsert em `chat_inbox_labels` (id, name, color, deleted, etc.). Resposta 200. Nenhum erro "LABELS_EDIT upsert error" nos logs. |
| **contacts.upsert** | Sim (com erro) | Handler executado, mas **upsert em `chat_contacts` falha** com erro PostgreSQL **42P10**: *"there is no unique or exclusion constraint matching the ON CONFLICT specification"*. Nenhum contato persistido; `updateInboxCounts` não é chamado após sucesso. Resposta 200 (webhook responde 200 mesmo com falha interna). |
| **chats.set** | Sim (com erro) | Handler executado. Primeiro passo (upsert de contatos a partir dos chats) **falha com o mesmo 42P10** em `chat_contacts`. Conversas não são criadas em `chat_conversations`. Resposta 200. |
| **messages.set** | Sim | Handler executado. Depende de contato e conversa existirem (`ensureContactAndConversation`). Como contatos não foram criados por causa do 42P10, as mensagens **não chegam a ser persistidas** (ou só as que encontram conversa já existente). Resposta 200. |
| **contacts.update** | Sim (com erro) | Mesmo handler de CONTACTS_*; **mesmo erro 42P10** no upsert. Nada persistido. Resposta 200. |

---

## Conclusão dos logs

- **Recebido:** A API **recebe** todos os eventos que a Evolution envia (connection.update, qrcode.updated, labels.edit, contacts.upsert, chats.set, messages.set, contacts.update). Os requests chegam em **POST /webhook/evolution** (ou /webhook/evolution/...) e retornam 200.
- **Processado (handler rodou):** Todos os eventos entram no `switch` e disparam o handler correto (log `[webhook] event=... instance=...`).
- **Persistência:**
  - **OK:** CONNECTION_UPDATE, QRCODE_UPDATED, LABELS_EDIT (atualizam `chat_inboxes` e `chat_inbox_labels`).
  - **Falha:** CONTACTS_* e CHATS_* (primeiro passo de CHATS é upsert em `chat_contacts`) falham por falta de constraint UNIQUE em `(inbox_id, remote_jid)` no banco que a API usa — erro **42P10**. Com isso, contadores (contacts_count, conversations_count) não são preenchidos e mensagens não têm conversa para serem vinculadas.

**Causa raiz:** O banco usado pela API em produção (Supabase) não tinha, no momento dos logs, o índice único `idx_chat_contacts_inbox_remote_jid_unique` em `chat_contacts`, ou a API aponta para outro banco onde a migration ainda não foi aplicada.

---

## Como resolver os erros 42P10

### 1. Garantir o índice UNIQUE no banco que a API usa

Foi criada a migration **`20260210120000_chat_contacts_unique_inbox_remote_jid.sql`**, que:

- Remove a constraint antiga `chat_contacts_organization_id_source_id_key` (se existir).
- Remove duplicatas em `(inbox_id, remote_jid)` mantendo o registro com `id` menor.
- Cria o índice único `idx_chat_contacts_inbox_remote_jid_unique` em `(inbox_id, remote_jid)` (com `WHERE inbox_id IS NOT NULL AND remote_jid IS NOT NULL`).

**Aplicar no Supabase usado pela API:**

```bash
cd flunx-chat && supabase db push
```

(Se o projeto já estiver linkado ao Supabase correto.) O push já foi executado; o remoto indicou que o índice já existia. Se os erros 42P10 **continuarem** após um novo teste (nova conexão ou botão Sincronizar), verifique o passo 2.

### 2. Se o erro persistir: conferir qual banco a API usa

- A API lê `SUPABASE_URL` (e `SUPABASE_SERVICE_ROLE_KEY`) do ambiente onde roda (ex.: Docker/Produção).
- Confirme que esse ambiente aponta para o **mesmo** projeto Supabase onde você rodou `supabase db push` (ex.: `rcteeqvosthccuepebmr`).
- No Supabase Dashboard → SQL Editor, execute:

```sql
SELECT indexname FROM pg_indexes
WHERE tablename = 'chat_contacts' AND indexname = 'idx_chat_contacts_inbox_remote_jid_unique';
```

Se retornar uma linha, o índice existe naquele projeto. Se a API usar outro projeto ou outra conexão, aplique a mesma migration nesse banco (ou rode o SQL da migration manualmente no SQL Editor desse projeto).

### 3. Reiniciar a API e testar de novo

Após garantir o índice no banco correto:

- Reinicie o serviço da flunx-api (para descartar qualquer cache de conexão).
- Conecte uma instância nova ou use **Sincronizar** em um canal já conectado.

Os eventos CONTACTS_* e CHATS_* devem passar a persistir e os contadores (contacts_count, conversations_count) a serem preenchidos.

*Documento gerado a partir dos logs dos containers Evolution e flunx-api em 2026-02-10.*
