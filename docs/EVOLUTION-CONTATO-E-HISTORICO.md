# Contato, histórico e Business Profile (Evolution API)

Documento de estudo para: ao **criar/abrir uma conversa** no Flunx Chat, carregar **histórico de mensagens**, **dados do contato** (nome, imagem de perfil) e, se existir, **perfil comercial** (WhatsApp Business).

---

## Fases da implementação

As fases gerais do Flunx Chat + Evolution estão em **FLUNX-CHAT-EVOLUTION-PLANO.md** e **README.md**:

| Fase | Nome | Status (resumo) |
|------|------|------------------|
| **Fase 0** | Canais e conexão QR | ✅ Concluída |
| **Fase 1** | Schema e webhook (mensagens no Supabase) | ✅ Concluída |
| **Fase 2** | APIs de listagem (conversas, mensagens) e envio | ✅ Em uso (GET/POST conversas e mensagens) |
| **Fase 3** | Frontend com dados reais (substituir mocks) | ✅ Em uso (ChatPage, listas, envio) |
| **Fase 4** | Robustez (filas/workers) | 📝 Opcional |

Para **contato, histórico e business profile** ao abrir conversa, a implementação pode ser dividida em subfases:

| Subfase | O quê | Onde | Esforço |
|--------|--------|------|--------|
| **F2.1** | Histórico: já vem do Supabase ao abrir conversa | Nada (já existe GET /conversations/:id/messages) | — |
| **F2.2** | (Opcional) Importar histórico antigo da Evolution | flunx-api: endpoint que chama `findMessages`, persiste em `chat_messages`, front recarrega lista | Médio |
| **F2.3** | Nome e avatar do contato | Já coberto por enrichment + fallback no backend; front já usa `contact.name` / `avatar_url` | — |
| **F2.4** | (Opcional) Refresh perfil sob demanda | flunx-api: endpoint “atualizar perfil” (fetchProfile + fetchProfilePictureUrl, update em `chat_contacts`) | Baixo |
| **F2.5** | Business profile (dados comerciais) | flunx-api: novo endpoint (ex.: GET …/contact/business-profile) que chama `fetchBusinessProfile`; front: aba “Ver perfil” com descrição, horário, site | Médio |
| **F2.6** | (Opcional) Persistir business profile no Supabase | Migration (coluna JSONB ou tabela) + preencher ao buscar | Baixo |

Ordem sugerida para implementar o que falta: **F2.5** (business profile) → depois **F2.2** (importar histórico) e **F2.4** (refresh perfil) se fizerem sentido para o produto.

---

## 1. Visão geral do fluxo desejado

| O quê | Onde está hoje | Como obter (Evolution) |
|-------|----------------|------------------------|
| **Histórico da conversa** | Supabase `chat_messages` (webhook já persiste mensagens novas) | Histórico antigo: Evolution **findMessages** por `remoteJid`; resultado pode ser importado para `chat_messages` (sync sob demanda). |
| **Nome do contato** | `chat_contacts.name` ou `whatsapp_profile_name` | **fetchProfile** (já usado no enrichment); ao abrir conversa pode chamar de novo para atualizar. |
| **Imagem de perfil** | `chat_contacts.whatsapp_profile_pic_url` | **fetchProfilePictureUrl** (já no enrichment); idem. |
| **Business profile** | Ainda não persistido | **fetchBusinessProfile** (descrição, horário, site, categoria etc.). |

---

## 2. Endpoints Evolution API utilizados

Base: repositório [EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api) (Chat Controller e Profile).

### 2.1 Perfil do contato (nome, foto)

- **fetchProfile**  
  - `POST /profile/fetchProfile/{instanceName}`  
  - Body: `{ "remoteJid": "5562999999999@s.whatsapp.net" }`  
  - Retorno: `profile.pushName`, `profile.pictureUrl` (entre outros).  
  - Uso na flunx-api: já em `evolution.js` e no job de enrichment.

- **fetchProfilePictureUrl**  
  - `POST /chat/fetchProfilePictureUrl/{instanceName}`  
  - Body: `{ "remoteJid": "5562999999999@s.whatsapp.net" }`  
  - Retorno: `pictureUrl` (ou `url`).  
  - Uso na flunx-api: idem.

### 2.2 Histórico de mensagens do chat

- **findMessages**  
  - `POST /chat/findMessages/{instanceName}`  
  - Body: `{ "where": { "key": { "remoteJid": "5562999999999@s.whatsapp.net" } }, "limit": 50 }`  
  - Retorno: array `messages` com objetos no formato Baileys/Evolution (`key`, `message`, `messageTimestamp`).  
  - Referência: [chat.router.ts – findMessages](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/routes/chat.router.ts), [messageValidateSchema](https://github.com/EvolutionAPI/evolution-api/blob/main/src/validate/chat.schema.ts) (`messageValidateSchema`).  
  - Nota: há relatos de filtro por `remoteJid` não funcionar em algumas versões ([issue #1632](https://github.com/EvolutionAPI/evolution-api/issues/1632)); pode ser necessário filtrar no cliente ou usar alternativa (ex.: buscar todas e filtrar por `key.remoteJid`).

Uso sugerido no Flunx:

- Ao abrir uma conversa: se quiser “puxar” histórico que ainda não está no Supabase, a flunx-api pode chamar `findMessages(instanceName, { remoteJid, limit })`, mapear para o formato de `chat_messages` e persistir (reutilizando a lógica de `handleMessagesUpsertSet`).

### 2.3 Perfil comercial (WhatsApp Business)

- **fetchBusinessProfile**  
  - `POST /chat/fetchBusinessProfile/{instanceName}`  
  - Body: `{ "number": "5562999999999@s.whatsapp.net" }` (Evolution usa o campo `number` no schema `profilePictureSchema` para esse endpoint).  
  - Retorno: dados do perfil comercial (descrição, horário de funcionamento, website, categoria, etc.).  
  - Referência: [chat.controller.ts – fetchBusinessProfile](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/controllers/chat.controller.ts), [chat.router.ts](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/routes/chat.router.ts).

Uso sugerido no Flunx:

- Ao abrir o painel “Dados do contato” (ou “Ver perfil”): a flunx-api chama `fetchBusinessProfile(instanceName, remoteJid)` e devolve ao frontend; o frontend exibe descrição, horário, site, etc., como no exemplo do WhatsApp Business.

---

## 3. O que já existe na flunx-api

- **evolution.js**:  
  - `fetchProfile(instanceName, remoteJid)`  
  - `fetchProfilePictureUrl(instanceName, remoteJid)`  
  - `findMessages(instanceName, { remoteJid, limit })`  
  - `fetchBusinessProfile(instanceName, remoteJid)`  

- **webhookEvolution.js**:  
  - Enrichment job (após CONTACTS/CHATS/MESSAGES) que atualiza `chat_contacts` com `whatsapp_profile_name` e `whatsapp_profile_pic_url` via `fetchProfile` e `fetchProfilePictureUrl`.

- **Rotas atuais**:  
  - Mensagens da conversa: `GET /conversations/:conversationId/messages` (lê do Supabase).  
  - Contato: vem no payload da conversa (`chat_contacts`); nome/avatar já podem vir do enrichment.

---

## 4. Próximos passos sugeridos (implementação)

1. **Ao abrir uma conversa**  
   - Frontend já chama `GET /conversations/:id/messages` → histórico que está no Supabase.  
   - (Opcional) Novo endpoint ou parâmetro tipo “importar histórico da Evolution”: flunx-api chama `findMessages`, persiste em `chat_messages` (reaproveitando `handleMessagesUpsertSet` ou função similar) e o frontend recarrega as mensagens.

2. **Dados do contato ao abrir conversa**  
   - Garantir que a lista de conversas e o header da conversa usem `contact.name` / `contact.avatar_url` (já vindo do Supabase com fallback no backend).  
   - (Opcional) Endpoint “refresh contact profile”: flunx-api chama `fetchProfile` + `fetchProfilePictureUrl`, atualiza `chat_contacts` e retorna o contato atualizado.

3. **Business profile**  
   - Novo endpoint na flunx-api, por exemplo:  
     `GET /inboxes/:inboxId/contacts/:contactId/business-profile`  
     ou  
     `GET /conversations/:conversationId/contact/business-profile`  
   - Backend: obtém `remote_jid` do contato, chama `fetchBusinessProfile(instanceName, remote_jid)` e devolve o JSON ao frontend.  
   - Frontend: na aba “Dados do contato” ou “Ver perfil”, exibir descrição, horário, site, etc., como na imagem de referência do WhatsApp Business.

4. **Persistir business profile (opcional)**  
   - Se quiser guardar no Supabase: nova coluna em `chat_contacts` (ex.: `business_profile JSONB`) ou tabela auxiliar; preencher ao chamar `fetchBusinessProfile` e, se desejado, em job periódico ou sob demanda.

---

## 5. Checklist de implementação

Atualizado conforme conclusão das subfases.

| Item | Feito? | Observação |
|------|--------|------------|
| **F2.1** Histórico do Supabase ao abrir conversa | ✅ | GET /conversations/:id/messages já existia. |
| **F2.2** Importar histórico Evolution (findMessages → chat_messages) | ✅ | POST /conversations/:id/messages/import + botão "Importar histórico" no painel. |
| **F2.3** Nome e avatar do contato | ✅ | Enrichment + fallback no backend; front usa contact.name / avatar_url. |
| **F2.4** Refresh perfil do contato sob demanda | ✅ | POST /conversations/:id/contact/refresh + botão "Atualizar nome e foto" no painel. |
| **F2.5** Business profile – API | ✅ | GET /conversations/:conversationId/contact/business-profile (flunx-api). |
| **F2.5** Business profile – Front | ✅ | Botão "Ver perfil" abre modal com descrição, site, email, endereço, horário. |
| **F2.6** Persistir business_profile no Supabase | ✅ | Colunas business_profile + business_profile_fetched_at; cache em falha da Evolution; doc F2.6. |

---

## 6. Referências

- Evolution API (GitHub): [EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)  
- Chat Controller (rotas): [src/api/routes/chat.router.ts](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/routes/chat.router.ts)  
- Chat Controller (lógica): [src/api/controllers/chat.controller.ts](https://github.com/EvolutionAPI/evolution-api/blob/main/src/api/controllers/chat.controller.ts)  
- Schemas (findMessages, profile): [src/validate/chat.schema.ts](https://github.com/EvolutionAPI/evolution-api/blob/main/src/validate/chat.schema.ts)  
- Find Messages issue (remoteJid filter): [Issue #1632](https://github.com/EvolutionAPI/evolution-api/issues/1632)  
- Documentação oficial (endpoints): [doc.evolution-api.com](https://doc.evolution-api.com) / [docs.evoapicloud.com](https://docs.evoapicloud.com) (Find Messages, Fetch Profile, Fetch Business Profile)
