# Ajustes no flunx-chat (pós refatoração API + Supabase)

**Contexto:** A flunx-channels-api foi refatorada (auth JWT, rotas alinhadas à especificação) e o Supabase teve migration aplicada (chat_contacts, chat_messages). O frontend precisa de pequenos ajustes para continuar funcionando.

---

## 1. Resposta QR Code (POST /channels e POST /channels/:id/reconnect)

**Problema:** A API retorna `qrcode: { base64: "..." }` (e não `qrCode`). O frontend usa `data.qrCode` para exibir a imagem.

**Onde:** 
- `CreateChannelDialog.tsx` — linha ~121: `setQrCode(data?.qrCode ?? null)`
- `ReconnectDialog.tsx` — linha ~125: `setQrCode(data.qrCode || null)`

**Ajuste:** Normalizar a resposta para aceitar tanto `data.qrCode` (string) quanto `data.qrcode?.base64`, e garantir que o valor seja uma data URL para `<img src>` (ex.: `data:image/png;base64,...`).

**Sugestão:** Criar um helper `normalizeQrCode(data)` e usá-lo nos dois diálogos.

---

## 2. GET /channels/:id/info sem Authorization

**Problema:** Em `useChannels.ts`, `refreshChannelInfo(channelId)` chama a API **sem** o header `Authorization: Bearer <token>`. Todas as rotas de canais exigem auth e retornam 401 sem o token.

**Onde:** `src/hooks/useChannels.ts` — linha ~29-31.

**Ajuste:** Passar o token do Supabase (ex.: do `useAuth()` ou do cliente Supabase) e enviar `Authorization: Bearer ${token}` na requisição.

---

## 3. POST /channels — body opcional

**Problema:** O frontend envia `type: "whatsapp_non_official"`. A API refatorada aceita apenas `organization_id` e `name` (o `type` é ignorado). Não quebra, mas pode remover do body para ficar alinhado à spec.

**Onde:** `CreateChannelDialog.tsx` — body do `fetch` em POST /channels.

**Ajuste:** (Opcional) Remover `type` do body; manter só `name` e `organization_id`.

---

## 4. Sync: tipo e toast

**Problema:** Em `chat-api.ts`, `SyncInboxResponse` usa `chats_processed`; a API retorna `contacts_processed`. O toast em `ChannelsList.tsx` usa `conversations_created` e `contacts_created`, que a API já retorna — está correto.

**Ajuste:** (Opcional) Atualizar o tipo para `contacts_processed` (ou adicionar os dois) para refletir a API e, se quiser, exibir “X contatos processados” no toast.

---

## 5. GET /channels/:inboxId/qrcode — formato do QR

**Problema:** A rota retorna `{ qrCode, connection_status }`. O valor de `qrCode` pode ser base64 puro ou já data URL. O `<img src={qrCode}>` precisa de data URL.

**Ajuste:** Usar o mesmo helper `normalizeQrCode` em `RefreshQRDialog.tsx` ao definir `setQrCode(data.qrCode ?? null)`.

---

## Resumo de prioridade

| # | Ajuste | Prioridade | Quebra sem? |
|---|--------|------------|-------------|
| 1 | QR: normalizar `qrcode.base64` → data URL em Create + Reconnect | Alta | Sim (QR não aparece ao criar/reconectar) |
| 2 | useChannels: enviar Bearer em refreshChannelInfo | Alta | Sim (401 ao atualizar info do canal) |
| 3 | RefreshQRDialog: normalizar qrCode para data URL | Média | Só se a API devolver base64 puro |
| 4 | Remover `type` do POST /channels | Baixa | Não |
| 5 | Tipo SyncInboxResponse: contacts_processed | Baixa | Não |

---

## Referências

- Especificação flunx-channels-api (auth, rotas, formato de resposta)
- Migration Supabase `20260203100000_align_chat_contacts_and_messages.sql`
