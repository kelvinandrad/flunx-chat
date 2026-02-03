# Plano: Contatos unificados (org-level) e origens

## Objetivo

- **Uma única página de contatos** para todos os canais (não por canal).
- **Cada contato** pode aparecer em um ou mais canais → **tag/origem** por fonte (ex.: "WhatsApp - Loja", "WhatsApp - Suporte", depois "Google", "Importado").
- **Deduplicação**: ao incluir contato, verificar se já existe na lista; se existir, não duplicar (apenas registrar nova origem).
- **Futuro**: importação, Google Contatos, etc. → lista geral de contatos com **origem** (tag) por fonte.
- **Desconectar instância**: contatos dessa instância **não** devem ser eliminados nem perder a origem definida.

---

## Estado atual

- **`chat_contacts`**: uma linha por **(inbox_id, remote_jid)**. Mesma pessoa em dois canais = duas linhas.
- **Listagem**: `GET /inboxes/:inboxId/contacts` → contatos **só daquele canal**.
- **Frontend**: página Contatos com **seletor de canal**; exige escolher canal para ver contatos.
- **Webhook/sync**: sempre cria nova linha em `chat_contacts` para (inbox, remote_jid) se não existir **nesse inbox** (não verifica outros inboxes da org).
- **Notas/propostas/lembretes**: referenciam `chat_contacts.id`. Se a mesma pessoa tiver duas linhas (dois canais), hoje seriam dois “contatos” diferentes para o painel.
- **Desconexão**: hoje não há DELETE em massa de `chat_contacts` ao desconectar; apenas `connection_status` do inbox é atualizado. Se existir FK `chat_contacts.inbox_id → chat_inboxes.id` com ON DELETE CASCADE, ao **deletar** o inbox os contatos seriam apagados; ao apenas “desconectar” (status), não.

---

## Opções de modelo

### Opção A – Mínima (sem novas tabelas)

- **Listagem**: novo endpoint **GET /contacts** (org a partir do JWT). Lê todos os `chat_contacts` da org (via `inbox_id → chat_inboxes.organization_id`), **agrupa por** `normalized(remote_jid)` + `contact_type` e devolve **um item por identidade**, com:
  - `sources: [{ inbox_id, inbox_name }]`
- **Frontend**: página Contatos **sem** seletor de canal; uma única lista; cada contato com **tags** (um badge por origem/canal).
- **Inclusão (webhook/sync)**: mantém lógica atual (cria uma linha em `chat_contacts` por (inbox, remote_jid)). A “não duplicação” na lista é feita **na leitura** (agrupamento).
- **Desconectar**: não deletar inbox; ao desconectar, só atualizar status. Garantir que **não** haja CASCADE de inbox → chat_contacts (ou alterar para SET NULL) para o dia em que inbox for deletado.
- **Prós**: rápido, sem migração de schema, compatível com conversas atuais.
- **Contras**: notas/propostas continuam por `chat_contacts.id`; mesma pessoa em dois canais = dois IDs; para painel do contato “unificado” seria preciso agregar por identidade (ex.: buscar notas de qualquer um dos `chat_contacts` do grupo). Preparação para Google/Import é limitada (só origens WhatsApp por enquanto).

### Opção B – Modelo com `contacts` (org) + `contact_sources` (origens)

- Nova tabela **`contacts`** (org-level): `id`, `organization_id`, `normalized_phone`, `email`, `name`, `avatar_url`, `contact_type`, `created_at`, `updated_at`. Um registro por “pessoa/grupo” na org.
- Nova tabela **`contact_sources`**: `id`, `contact_id`, `source_type` ('whatsapp_inbox' | 'google' | 'import'), `source_ref` (ex.: inbox_id), `label`, `remote_jid`, `metadata`, `created_at`. **Ao desconectar**, não apagar linhas aqui (origem preservada).
- **`chat_contacts`**: vira “contato visto neste inbox”: mantém `inbox_id`, `remote_jid`, nome/avatar; adiciona **`contact_id`** FK para `contacts.id`. Conversas continuam usando `chat_contacts` (ou passam a usar `contact_id` + `remote_jid` na conversa).
- **Inclusão**: antes de criar `chat_contacts`, buscar/criar `contacts` por (org, normalized_jid); criar/atualizar `contact_sources`; então criar `chat_contacts` (inbox, contact_id, remote_jid). Assim **não duplica** identidade; só adiciona origem.
- **Listagem**: GET /contacts (org) → lista `contacts` com `sources` de `contact_sources` (tags por canal/Google/Import).
- **Notas/propostas/lembretes**: migrar para referenciar **`contacts.id`** em vez de `chat_contacts.id` (permite um único painel por contato).
- **Prós**: modelo claro, escalável para Google/Import, um único “contato” por pessoa, origens explícitas, desconectar não perde origem.
- **Contras**: migração de schema e de dados; mais alterações em API, webhook e frontend.

---

## Recomendações

1. **Curto prazo (agora)**  
   - Implementar **Opção A**:  
     - Novo **GET /contacts** (org) com agrupamento por identidade e `sources[]`.  
     - Página Contatos **única**, sem seletor de canal, com tags de origem por canal.  
     - Garantir que **desconectar** não delete contatos (evitar CASCADE inbox → chat_contacts, ou não deletar inbox ao desconectar).
2. **Médio prazo (quando for fazer import/Google)**  
   - Migrar para **Opção B**: tabelas `contacts` + `contact_sources`, `chat_contacts.contact_id`, e migrar notas/propostas/lembretes para `contacts.id`. Assim a “lista de contatos” fica realmente única, com tags por origem (WhatsApp, Google, Import) e sem duplicar ao incluir.

---

## Checklist de implementação (Opção A – agora)

- [ ] **Backend**
  - [ ] Novo endpoint **GET /contacts** (org via JWT): listar todos os `chat_contacts` da org, agrupar por `normalized(remote_jid)` + `contact_type`, retornar um item por identidade com `sources: [{ inbox_id, inbox_name }]`, paginação por cursor.
  - [ ] Garantir que nenhum código delete `chat_contacts` ao desconectar inbox (apenas atualizar status); se existir FK CASCADE inbox → chat_contacts, planejar migração para SET NULL ou não deletar inbox.
- [ ] **Frontend**
  - [ ] Remover seletor de canal da página Contatos; usar apenas GET /contacts (sem inboxId).
  - [ ] Ajustar `useContacts()` para não depender de inbox (org apenas).
  - [ ] Exibir cada contato com **tags** (badges) por origem (nome do canal).
- [ ] **Webhook/Sync**
  - [ ] Opcional: ao criar `chat_contacts`, verificar se já existe contato na org com mesmo `normalized(remote_jid)` (em qualquer inbox); se existir, ainda criar a nova linha em `chat_contacts` para este inbox (para conversas), mas a listagem já agrupa e não “duplica” na UI. Nenhuma mudança obrigatória para “não duplicar na lista”; a deduplicação é visual/por agrupamento.

---

## Referências

- [Supabase – Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL – TRUNCATE / CASCADE](https://www.postgresql.org/docs/current/sql-truncate.html)
