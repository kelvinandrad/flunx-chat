# Flunx Chat – Modelagem de Dados

Modelo baseado no Chatwoot, adaptado para o ecossistema Flunx: **mesmo Supabase** (auth, organizations), **multi-canal**, **extensível**.

## Convenção de Nomenclatura

Todas as tabelas **pertinentes ao chat** usam o prefixo **`chat_`**: `chat_inboxes`, `chat_contacts`, `chat_conversations`, `chat_messages`, etc. Tabelas compartilhadas do Flunx permanecem sem prefixo: `organizations`, `profiles`, `organization_members`.

## Tabelas Principais

| Grupo | Tabelas |
|-------|---------|
| Canais | chat_inboxes, chat_channel_whatsapp, chat_channel_email, chat_channel_sms, etc. |
| Contatos | chat_contacts, chat_contact_inboxes |
| Conversas | chat_conversations, chat_messages, chat_attachments |
| Equipes | chat_teams, chat_team_members, chat_inbox_members |
| Outros | chat_labels, chat_webhooks, chat_working_hours |

Ver documentação completa na raiz do repositório.
