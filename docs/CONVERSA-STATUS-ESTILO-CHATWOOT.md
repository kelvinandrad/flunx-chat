# Status de conversas (estilo Chatwoot)

Alinhamento com o [Chatwoot](https://www.chatwoot.com/) para **conversas** (open, pending, resolved) e exibição de **contatos** / informações de contato.

## Referência Chatwoot

- **Backend:** [conversation.rb](https://github.com/chatwoot/chatwoot/blob/develop/app/models/conversation.rb)  
  - `enum status: { open: 0, resolved: 1, pending: 2, snoozed: 3 }`  
  - `toggle_status`: open → resolved; pending/snoozed → open.  
  - Criação: resolved se contato bloqueado; pending se inbox tem bot ativo; senão open.
- **API:** Filtro por status (ex.: [Conversations Filter](https://developers.chatwoot.com/api-reference/conversations/conversations-filter)).
- **Front:** Abas/filtros por status (Todas, Não lidas, Abertas, Pendentes, Resolvidas).

## No Flunx

### Backend (flunx-api)

- **GET /inboxes/:inboxId/conversations**  
  - Query param opcional: `status=open|pending|resolved`.  
  - Quando enviado, filtra no servidor por `chat_conversations.status`.
- **PATCH /conversations/:conversationId**  
  - Body: `{ status: "open" | "pending" | "resolved" }` (já existente).

### Front (flunx-chat)

- **Abas de status:** Todas, Não lidas, Abertas, Pendentes, Resolvidas.  
  - **Abertas / Pendentes / Resolvidas:** enviam `status` na listagem; a API retorna só conversas com aquele status.  
  - **Todas:** sem filtro de status. **Não lidas:** filtro apenas no cliente (por enquanto).
- **useConversations:** aceita `filter.status` (`open` | `pending` | `resolved` | `all`); inclui no `queryKey` e na chamada à API.
- **ConversationListPanel:** pode ser controlado com `activeStatusTab` e `onStatusTabChange` (ChatPage passa e usa para refetch com status).
- **ConversationItem:** indicador visual para status resolvida (•) e pendente (• âmbar).

### Contatos e informações de contato

- **Lista de contatos (ContatosPage):** nome, avatar, `remote_jid`, `contact_type` (individual/group), alinhado ao que o Chatwoot exibe por contato.
- **Painel do contato (ContactPanel):** notas, propostas, perfil comercial (business profile), agendamentos, lembretes; refresh de perfil e importação de histórico.
- **Conversação:** contato associado com `name`, `remote_jid`, `contact_type`, `avatar_url`; status da conversa (open/pending/resolved) aplicado à conversa, não ao contato.

## Snoozed (opcional)

O Chatwoot tem status **snoozed** (adiar até próxima resposta do contato). No Flunx não há `snoozed` no schema nem na API; os tipos permitem "snoozed" no front apenas para compatibilidade de tipo. Incluir snoozed no futuro exigiria coluna/estado no backend e regras de reabertura.
