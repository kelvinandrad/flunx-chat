# O que nos bodies gera PayloadTooLargeError e PGRST204

## 1. PayloadTooLargeError

### Onde ocorre
No **body da requisição HTTP** que a **Evolution envia para a API** (`POST /webhook/evolution` ou subpaths). O Express usa `express.json({ limit: "200mb" })`; se o limite for menor (ex.: 2 MB na VPS), qualquer body **maior que esse limite** é rejeitado **antes** de o handler rodar.

### O “body” que estoura
É o **JSON inteiro do webhook** que a Evolution manda em cada POST. Exemplo de envelope:

```json
{
  "event": "contacts.upsert",
  "instance": "flunx-teste-n5v2-yah96jnl",
  "destination": "https://api.flunx.com.br/webhook/evolution/contacts-upsert",
  "data": [ ... ]
}
```

O que **engorda** o body é o **`data`**:

| Evento | O que vem em `data` | O que gera o tamanho |
|--------|----------------------|------------------------|
| **contacts.set / contacts.upsert / contacts.update** | Array de **muitos** contatos | Cada item: `id`, `remoteJid`, `pushName`, às vezes `profilePicUrl` (URL longa). ~400–700 bytes/contato em JSON. **3.000 contatos ≈ 2–3 MB**. |
| **chats.set / chats.upsert / chats.update** | Array de **muitos** chats | Cada item: `id`/`remoteJid`, `pushName`, `archive`, `pin`. ~300–500 bytes/chat. **4.000+ chats ≈ 2+ MB**. |
| **messages.set / messages.upsert** | 1 ou várias mensagens | Menos comum estourar; se vier **base64 de mídia** dentro de `message`, o body dispara (política atual: não usar base64, só URL). |

Ou seja: **o que gera o erro** é o **volume de itens em `data`** (milhares de contatos ou de chats) e, em mensagens, eventual base64 de mídia. Com limite 2 MB, um único POST de **contacts.upsert** com ~3.000 contatos já passa e dá **PayloadTooLargeError**.

### Resumo (PayloadTooLarge)
- **Body:** o JSON completo do POST do webhook (Evolution → API).
- **Causa:** `data` com **muitos contatos ou muitos chats** (e, em mensagens, base64 de mídia).
- **Solução:** Aumentar o limite do body na API (ex.: 200 MB no código; na VPS garantir que o deploy use esse valor).

---

## 2. PGRST204

### Onde ocorre
No **body da requisição** que **a nossa API envia ao Supabase** (PostgREST): um **upsert** ou **insert** com um objeto (ou array de objetos) que contém um **nome de coluna** que o PostgREST **não conhece** para aquela tabela no schema cache. O PostgREST responde com algo como:

`Could not find the 'X' column of 'table_name' in the schema cache`

Ou seja: o “body” que importa aqui **não** é o da Evolution; é o **payload que a API monta e manda para o Supabase**.

### Casos que já apareceram nos logs

**A) “Could not find the 'inbox_id' column of 'chat_contacts'”**
- **Body que gera o erro:** o objeto (ou cada elemento do array) que a API envia no **upsert em `chat_contacts`**.
- **O que está errado:** o payload inclui a propriedade **`inbox_id`**. Na Fase 2, a tabela **`chat_contacts`** não tem coluna `inbox_id` (contato é por `organization_id` + `identifier`; a relação com inbox é em `chat_contact_inboxes`).
- **Origem:** Código antigo (pré-Fase 2) que ainda montava algo como `{ organization_id, identifier, name, ..., inbox_id }` para `chat_contacts`. Esse `inbox_id` no body do upsert causa PGRST204.

**B) “Could not find the 'updated_at' column of 'chat_contact_inboxes'”**
- **Body que gera o erro:** o objeto (ou cada elemento do array) que a API envia no **upsert em `chat_contact_inboxes`**.
- **O que está errado:** o payload inclui a propriedade **`updated_at`**. O PostgREST (schema cache do projeto) não está vendo a coluna `updated_at` na tabela `chat_contact_inboxes` — por exemplo, cache desatualizado ou migração que adiciona `updated_at` ainda não refletida no PostgREST.
- **Origem:** Código que monta linhas como `{ inbox_id, contact_id, source_id, updated_at }` para o upsert. O `updated_at` no body causa PGRST204 se a coluna não existir no schema cache (ou na tabela).

### Resumo (PGRST204)
- **Body:** o payload que a **API envia ao Supabase** (objeto/array no upsert ou insert).
- **Causa:** Incluir no body uma **chave (coluna)** que não existe na tabela ou no schema cache do PostgREST: ex. `inbox_id` em `chat_contacts`, `updated_at` em `chat_contact_inboxes`.
- **Solução:** (1) Não enviar `inbox_id` para `chat_contacts`. (2) Não enviar `updated_at` para `chat_contact_inboxes` até o schema cache ter essa coluna, ou garantir a coluna + reload do schema no Supabase (Project Settings → API).

---

## Referências

- `WEBHOOK-BODY-SIZES.md` – tamanhos estimados dos bodies Evolution → API.
- `webhookEvolution.js` – onde são montados os objetos para Supabase (contactRows, inboxRows, etc.).
- [PostgRST errors](https://postgrest.org/en/stable/errors.html) (ex.: PGRST204).
