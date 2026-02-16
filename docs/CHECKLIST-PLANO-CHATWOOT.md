# Checklist – Plano estilo Chatwoot

**Atualizado em:** 10 de fevereiro de 2026  
**Referência:** [PLANO-IMPLEMENTACAO-ESTILO-CHATWOOT.md](./PLANO-IMPLEMENTACAO-ESTILO-CHATWOOT.md)

---

## Fase 0 – Quick wins (envio + mensagens sem id)

### 0.1 POST /conversations/:conversationId/messages (envio pelo agente)

| Item | Status | Observação |
|------|--------|------------|
| Implementar `sendText` em `flunx-api/src/evolution.js` | ✅ Concluído | POST /message/sendText/{instance}, body number + text, retorna keyId |
| Implementar `sendMedia` em `flunx-api/src/evolution.js` | ✅ Concluído | POST /message/sendMedia/{instance}, opções mediatype, mimetype, caption, media, fileName |
| Handler `postMessage` em `routes/channels.js` | ✅ Concluído | Auth, conversa → inbox → contact, Evolution sendText, insert chat_messages |
| Registrar rota em `index.js` | ✅ Concluído | `POST /conversations/:conversationId/messages` com requireAuth |
| Body: `content` obrigatório; persistir `evolution_message_id` do response | ✅ Concluído | keyId da Evolution usado em chat_messages |
| **Critério de conclusão 0.1** | ✅ Concluído | Agente pode enviar mensagem pelo Flunx e aparece na conversa e no WhatsApp |

### 0.2 Persistir mensagens sem key.id

| Item | Status | Observação |
|------|--------|------------|
| Em `webhookEvolution.js`: gerar id interno (ex. `temp_` + uuid) quando não houver key.id | ✅ Concluído | `evolution_message_id = key?.id ? String(key.id) : 'temp_' + crypto.randomUUID()` |
| Política para duplicata (mesma mensagem depois com key.id) | ⬜ Opcional | Se Evolution reenviar com key.id depois, será outra linha (evolution_message_id diferente) |
| **Critério de conclusão 0.2** | ✅ Concluído | Mensagens recebidas sem key.id passam a ser persistidas |

---

## Fase 1 – Mídia recebida

| Item | Status | Observação |
|------|--------|------------|
| 1.1 Doc/checklist Evolution (mediaUrl no webhook) | ✅ Concluído | [EVOLUTION-MIDIA-WEBHOOK-CHECKLIST.md](./EVOLUTION-MIDIA-WEBHOOK-CHECKLIST.md) |
| 1.2 getBase64FromMediaMessage em evolution.js | ✅ Concluído | POST /chat/getBase64FromMediaMessage/{instance}, body message.key (id, remoteJid?) |
| 1.2 Endpoint fetch-media (Storage → media_url) | ✅ Concluído | POST /conversations/:conversationId/messages/:messageId/fetch-media; bucket `chat-media` |
| **Critério de conclusão Fase 1** | ✅ Concluído | Política clara (webhook + endpoint fallback); criar bucket chat-media no Supabase |

---

## Fase 2 – Contact + ContactInbox

| Item | Status | Observação |
|------|--------|------------|
| Schema: chat_contacts (org) + chat_contact_inboxes + migração | ✅ Concluído | Migração `20260212100000_chat_contact_inboxes_fase2.sql` |
| Webhook: CONTACTS/CHATS/MESSAGES usar contact + contact_inbox | ✅ Concluído | handleContactsSetUpsertUpdate, handleChatsSetUpsertUpdate, ensureContactAndConversation, handleChatsDelete |
| Rotas: listagens (getConversations, getConversationsInbox, getContacts) com join contact_inbox + contact | ✅ Concluído | remote_jid = source_id; contact = chat_contacts |
| Rotas: postMessage, postFetchMessageMedia, patchConversation, business-profile, refresh, import com contact_inbox_id/source_id | ✅ Concluído | Obtenção de remote_jid via contact_inbox.source_id ou contact.identifier |
| **Critério de conclusão Fase 2** | ✅ Concluído | Mesmo contato (identifier) em mais de um inbox; conversas referenciam contact_inbox |

---

## Fase 3 – Múltiplas conversas

| Item | Status | Observação |
|------|--------|------------|
| Schema: remover UNIQUE(inbox_id, contact_inbox_id); índices | ✅ Concluído | Migração `20260213100000_chat_conversations_multiple_fase3.sql` |
| Webhook: reutilizar open; reabrir última resolved; senão criar nova | ✅ Concluído | ensureContactAndConversation + handleChatsSetUpsertUpdate (ensure open conv por contact_inbox) |
| API: PATCH conversa com status (open/pending/resolved) | ✅ Concluído | patchConversation aceita `status` |
| API: POST nova conversa (mesmo contato) | ✅ Concluído | POST /inboxes/:inboxId/conversations { contact_inbox_id ou contact_id } |
| Front: múltiplas threads, Resolver/Reabrir | ⬜ Pendente | UI: listar várias conversas por contato; botões Resolver/Reabrir/Nova conversa |
| **Critério de conclusão Fase 3** | ✅ Backend | Backend pronto; front pode usar PATCH status e POST conversations |

---

## Fase 4 – Refinos (opcional)

| Item | Status |
|------|--------|
| Labels por tabela de junção | ⬜ Pendente |
| Import automático na conexão | ⬜ Pendente |
| Enriquecimento de perfil (sync/async) | ⬜ Pendente |

---

## Resumo

- **Fase 0.1:** ✅ **Concluída** (envio de mensagem pelo agente).
- **Fase 0.2:** ✅ **Concluída** (mensagens sem key.id persistidas com `temp_` + uuid).
- **Fase 1:** ✅ **Concluída** (doc/checklist Evolution + getBase64 + endpoint fetch-media).
- **Fase 2:** ✅ **Concluída** (schema + migração + webhook + rotas).
- **Fase 3:** ✅ **Concluída** no backend (migração + reabertura no webhook + PATCH status + POST nova conversa).
- **Fase 4:** ⬜ Opcional (refinos).

**Próximo passo recomendado:** Aplicar as migrações no Supabase na ordem (Fase 2 depois Fase 3). Ver [COMO-APLICAR-MIGRACOES.md](./COMO-APLICAR-MIGRACOES.md). No front: usar PATCH `status: "resolved"` para resolver e `status: "open"` para reabrir; POST `/inboxes/:inboxId/conversations` com `contact_inbox_id` ou `contact_id` para nova conversa.
