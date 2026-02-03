# O que ainda falta (pós ajustes)

**Data:** 3 de fevereiro de 2026  
**Contexto:** Ajustes pós-refatoração da flunx-channels-api e migration Supabase já foram implantados. Este doc lista o que **ainda está pendente**.

---

## 1. Ajustes pós-refatoração (opcional)

| Item | Status | Descrição |
|------|--------|-----------|
| Toast da sincronização | **Feito** | `ChannelsList.tsx` já exibe `contacts_processed` (ou `chats_processed`) no toast após sincronização. O tipo `SyncInboxResponse` inclui o campo. |

Todo o restante do doc **AJUSTES-FLUNX-CHAT-POS-REFATORACAO.md** já foi implementado (QR, auth no refresh, body sem `type`, `normalizeQrCode`, etc.).

---

## 2. Fase 0 — Canais e QR (Evolution)

Conforme **FLUNX-CHAT-EVOLUTION-PLANO.md** § 0.7, ainda podem ser feitos:

| ID | Etapa | Onde | Prioridade |
|----|-------|------|------------|
| **0.4** | Polling no CreateChannelDialog: enquanto o QR está visível, refetch `connection_status` a cada 3–5 s por até 2 min (para fechar o dialog automaticamente ao conectar, sem depender só do Realtime) | `CreateChannelDialog.tsx` | Média |
| **0.5** | Garantir que o botão "Reexibir QR" / "Conectar" está visível e claro para canais `pending`/`disconnected` | `ChannelsList.tsx` | Já existe RefreshQRDialog; verificar UX |
| **0.7** | Webhook com autenticação | API já suporta `WEBHOOK_SECRET_TOKEN`; falta configurar o token em produção e registrar a URL com `?token=...` |

**0.1, 0.2, 0.3** (validação prévia, rollback, webhook obrigatório): a API refatorada já faz rollback e trata webhook como obrigatório; validação de org está em `validateOrganizationAccess`.

---

## 3. Fase C — Archive e Pin (conversas)

Conforme **PLANO-CONVERSAS-UX-E-GRUPOS.md**:

| Etapa | Descrição | Status |
|-------|-----------|--------|
| C1 | Schema: `chat_conversations.is_archived`, `chat_conversations.is_pinned` | **Feito** — migration `20260203110000_chat_conversations_archive_pin.sql` |
| C2 | Webhook: handler para `CHATS_UPDATE` / `CHATS_UPSERT` (mapear archive/pin) | **Stub feito** — aguarda payload real da Evolution para refinar |
| C3 | API: parâmetro `include_archived` e `pinned` na listagem; PATCH para labels/archive/pin | **Feito** — `GET /inboxes/:id/conversations`, `PATCH /conversations/:id` |
| C4 | Frontend: abas "Todas" / "Arquivadas" / "Fixadas" | **Feito** — `ConversationListPanel` com `listView` e `useConversations` com filtros |

**Observação:** Quando a Evolution enviar payload real de `CHATS_UPDATE`/`CHATS_UPSERT`, ajustar o handler em `webhookEvolution.js` se o formato for diferente.

---

## 4. Melhorias opcionais

| Item | Onde | Descrição |
|------|------|-----------|
| Edição de etiquetas | API + Frontend | **Feito** — `PATCH /conversations/:id` na API; no frontend, botão "Etiquetas" no painel com popover para editar labels da conversa selecionada. |
| Tratamento de erro quando QR não vem | CreateChannelDialog | **Feito** — mensagem clara quando a API retorna sucesso mas sem QR. |

---

## 5. Resumo em uma frase

- **Crítico:** Nada pendente para o fluxo atual (criar canal, QR, conversas, mensagens, sync) funcionar.
- **Desejável:** Polling no dialog do QR (0.4), configurar `WEBHOOK_SECRET_TOKEN` em produção.
- **Fase C e etiquetas:** Schema, API, webhook (stub), abas Arquivadas/Fixadas e edição de etiquetas já implementados. Refinar webhook C2 quando houver payload real da Evolution.
