# Resolução definitiva: PayloadTooLarge e PGRST204

## O que precisa estar certo

| Problema | Causa | O que resolve |
|----------|--------|----------------|
| **PayloadTooLarge** | Body do webhook > limite do Express (ex. 2 MB na VPS) | API com `express.json({ limit: "200mb" })` e **deploy dessa versão** na VPS |
| **PGRST204 (inbox_id em chat_contacts)** | Payload com coluna que não existe (Fase 2) | Código **não** enviar `inbox_id` no upsert de `chat_contacts` + **deploy** |
| **PGRST204 (updated_at em chat_contact_inboxes)** | Payload com coluna que o PostgREST não vê no cache | Código **não** enviar `updated_at` no upsert de `chat_contact_inboxes` **ou** coluna no DB + reload do schema + enviar se quiser |
| **Webhooks indo para api-canais** | Evolution com URL errada | Evolution com `WEBHOOK_GLOBAL_URL=https://api.flunx.com.br/webhook/evolution` e **redeploy**; desativar api-canais |

No repositório isso já está assim:
- `flunx-api`: limite 200 MB; `chat_contacts` sem `inbox_id`; `chat_contact_inboxes` sem `updated_at` nos upserts.
- `evolution.yaml`: `WEBHOOK_GLOBAL_URL` = api.flunx.com.br.

Ou seja: a **resolução definitiva é garantir que a VPS use esse código e essa configuração**.

---

## Passos na VPS (definitivo)

### 1. API (api.flunx.com.br)

No servidor onde está o repositório e o Docker Swarm:

```bash
cd /root/flunx-api   # ou o path do projeto
docker build -t flunx-api:latest .
docker service update --force flunx-api_api
```

Assim o serviço que atende **api.flunx.com.br** passa a usar:
- Limite de body **200 MB** (acaba PayloadTooLarge).
- Upsert em `chat_contacts` **sem** `inbox_id`.
- Upsert em `chat_contact_inboxes` **sem** `updated_at`.

Confirme que o **host api.flunx.com.br** aponta para esse mesmo serviço (ex.: `flunx-api_api` no Traefik).

### 2. Evolution (webhook único)

Garantir que a Evolution use só **api.flunx.com.br**:

```bash
cd /root   # ou onde está o evolution.yaml
docker stack deploy -c evolution.yaml evolution
```

No `evolution.yaml` deve estar:

```yaml
WEBHOOK_GLOBAL_URL: "https://api.flunx.com.br/webhook/evolution"
```

Se na VPS existir **outro stack** (ou variável de ambiente) que define **api-canais.flunx.com.br** como webhook:

- **Opção A:** Remover esse stack ou essa config para não haver mais api-canais.
- **Opção B:** Fazer **api-canais.flunx.com.br** apontar para o **mesmo** serviço da API (mesmo container `flunx-api_api`), para um único backend.

Assim todos os webhooks passam a ir para a API com limite 200 MB e payloads corretos.

### 3. Supabase (schema cache)

Para o PostgREST parar de reclamar de colunas que já existem no banco:

1. **Dashboard** do projeto → **Project Settings** → **API**.
2. Clicar em **“Reload schema”** (ou equivalente) para atualizar o cache do PostgREST.

Opcional: se a tabela `chat_contact_inboxes` não tiver `updated_at`, rodar a migração que a adiciona (ex.: `docs/supabase-ensure-contact-inboxes-updated_at.sql`) e depois dar **Reload schema** de novo.

---

## Checklist rápido

- [ ] Build da imagem `flunx-api:latest` com o código atual.
- [ ] `docker service update --force flunx-api_api` (ou o nome do serviço da API).
- [ ] `docker stack deploy -c evolution.yaml evolution` com `WEBHOOK_GLOBAL_URL` = api.flunx.com.br.
- [ ] Nenhum webhook apontando para api-canais (ou api-canais apontando para o mesmo serviço da API).
- [ ] Supabase: Reload schema em Project Settings → API.

Depois disso, PayloadTooLarge e PGRST204 ficam resolvidos de forma definitiva, desde que não voltem a subir uma versão antiga da API ou da config da Evolution na VPS.
