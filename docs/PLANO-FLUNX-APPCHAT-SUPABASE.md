# Plano: flunx-appchat + Supabase único + Canais no Flunx

Objetivo: parar o deploy do `chatwoot.yaml`, usar **flunx-appchat** como backend de chat, com **um único Supabase** (mesmo do flunx-v2/flunx-chat), **canais** criados só no Flunx (chat ou v2), e **flunx-appchat** em repositório separado integrado por API + Supabase.

---

## 1. Como funciona o schema `chatwoot` no Supabase

### 1.1 O que é schema no Postgres

No PostgreSQL, **schema** é um namespace dentro de um mesmo banco. Um mesmo banco pode ter:

- `public` – padrão; onde hoje estão as tabelas do Flunx (organizations, profiles, organization_members, etc.)
- `auth` – usado pelo Supabase Auth (auth.users, auth.sessions, etc.)
- `apichat` – onde ficarão **todas** as tabelas do Chatwoot (accounts, users, inboxes, conversations, messages, etc.)

Assim evita-se conflito de nomes: por exemplo, `users` do Chatwoot ficam em `apichat.users`, e o Supabase continua com `auth.users`. O Flunx segue usando `public.organizations`, `public.profiles`, etc.

Referência: [PostgreSQL Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html).

### 1.2 Como o Rails (flunx-appchat) usa o schema

O Rails não “sabe” de schema por tabela; ele usa o **search_path** da conexão PostgreSQL:

- Se `schema_search_path = 'apichat'`, então `SELECT * FROM accounts` vira `SELECT * FROM apichat.accounts`.
- As migrations do flunx-appchat continuam iguais (criam `accounts`, `users`, etc.); a diferença é que, com o search_path apontando para `apichat`, essas tabelas são criadas e lidas **dentro do schema apichat**.

Na prática:

1. No **Supabase**: criar o schema vazio uma vez, por exemplo em uma migration SQL no projeto flunx-chat (ou direto no SQL do Supabase):
   ```sql
   CREATE SCHEMA IF NOT EXISTS apichat;
   ```
2. No **flunx-appchat**: configurar a conexão para usar esse schema. No `config/database.yml` (ou via variável de ambiente), na conexão que aponta para o Supabase, definir:
   - `schema_search_path: apichat`
   Assim, ao rodar `rails db:migrate`, todas as tabelas do Chatwoot passam a ser criadas em `apichat.*`.

### 1.3 Onde fica cada coisa (resumo)

| Onde              | Schema   | Exemplos de tabelas |
|-------------------|----------|----------------------|
| Supabase Auth     | `auth`   | users, sessions      |
| Flunx (v2, chat)  | `public` | organizations, profiles, organization_members, chat_inboxes (se ainda existirem), etc. |
| Chatwoot          | `apichat` | accounts, users, account_users, inboxes, conversations, messages, contacts, etc. |

Um único projeto Postgres (Supabase), três namespaces. O flunx-appchat só “enxerga” o schema `chatwoot` (e o que mais for colocado no search_path, se necessário).

---

## 2. Visão geral na prática

```
[Usuário]
    │
    ▼
[flunx-chat ou flunx-v2]  ← login Supabase, UI de Canais, lista de conversas (via API)
    │
    │  Auth: Bearer (Supabase JWT)
    │  Canais: criar/editar canal aqui; tipos = os do flunx-appchat (WhatsApp, API, Email, etc.)
    ▼
[flunx-channels-api ou BFF]  ← opcional: pode falar com flunx-appchat em nome do usuário
    │
    │  Resolve org → account_id, user → token; chama flunx-appchat
    ▼
[flunx-appchat]  ← API Chatwoot (conversations, messages, inboxes, etc.)
    │
    │  Conexão Postgres com schema_search_path = apichat
    ▼
[Supabase Postgres]
    ├── auth.*
    ├── public.*   (Flunx)
    └── apichat.* (Chatwoot / flunx-appchat)
```

- **Canais**: definidos no Flunx (chat ou v2). A criação/edição de um canal no Flunx deve resultar em criação/atualização do **Inbox** correspondente no flunx-appchat (via API ou job que chama a API do Chatwoot).
- **Deploy**: você para o stack do `chatwoot.yaml` e sobe o **flunx-appchat** (Rails + Sidekiq) apontando para o mesmo Supabase, com schema `apichat`.

---

## 3. Passos práticos (ordem sugerida)

### Fase 1: Supabase e schema apichat

| # | Ação | Onde | Detalhe |
|---|------|------|--------|
| 1.1 | Criar schema `apichat` no Supabase | Supabase (SQL ou migration no flunx-chat) | `CREATE SCHEMA IF NOT EXISTS apichat;` |
| 1.2 | Garantir extensões no DB (se o Chatwoot precisar) | Supabase | pg_trgm, pgcrypto, plpgsql; vector se o Chatwoot usar. Normalmente o mesmo projeto já tem. |

### Fase 2: flunx-appchat apontando para o Supabase

| # | Ação | Onde | Detalhe |
|---|------|------|--------|
| 2.1 | Configurar conexão Postgres para o Supabase | flunx-appchat `config/database.yml` (ou env) | Host, port, database, user, password = dados do Supabase (Connection string / Pooler). |
| 2.2 | Definir `schema_search_path = apichat` para essa conexão | flunx-appchat | Em `database.yml` na seção da env (ex. production): em `variables` ou opção equivalente do adapter: `schema_search_path: apichat`. |
| 2.3 | Rodar migrations do Chatwoot | flunx-appchat | `rails db:migrate` (ou `db:chatwoot_prepare`) contra o Supabase; todas as tabelas serão criadas em `apichat.*`. No Swarm: ver seção **Migrations no Docker Swarm** abaixo. |
| 2.4 | (Opcional) Seed mínimo | flunx-appchat | Se precisar de Platform App ou usuário inicial, rodar após migrations. |

#### Migrations no Docker Swarm

Com a estrutura atual (Docker Swarm), as migrations podem ser feitas de duas formas:

**Opção 1 – Automático no deploy (recomendado)**  
O serviço web do flunx-appchat usa o mesmo padrão do `chatwoot.yaml`: o *command* do container executa `rails db:chatwoot_prepare` **antes** de `rails s`. Ou seja:

- Ao fazer o **deploy do stack** flunx-appchat (Fase 3c) com as variáveis do Supabase (`POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_SCHEMA=apichat`, etc.), o **primeiro** container que subir vai:
  1. Entrar no entrypoint (`rails.sh`): esperar o Postgres (Supabase) ficar acessível.
  2. Executar o command: `bundle exec rails db:chatwoot_prepare` (roda as migrations no schema `apichat`) e depois `rails s`.

Assim **não é necessário rodar migrate à mão**: basta fazer o deploy do stack com o env correto. Requisito: os **nós do Swarm** precisam ter acesso de rede ao Supabase (`db.xxx.supabase.co`, porta 5432).

**Opção 2 – One-off (migrar antes de subir o app)**  
Se quiser rodar as migrations **uma vez** antes de colocar o serviço no ar (por exemplo para validar conexão ou rodar em horário controlado):

- Num **manager node** do Swarm, com a **imagem** do flunx-appchat já buildada e publicada (ou carregada localmente), rode um container que só executa o migrate e sai:

```bash
docker run --rm \
  --env-file /caminho/para/flunx-appchat.env \
  sua-registry/flunx-appchat:tag \
  bundle exec rails db:chatwoot_prepare
```

O arquivo `flunx-appchat.env` deve ter as mesmas variáveis do stack (Supabase + `POSTGRES_SCHEMA=apichat`). Esse container usa a mesma rede do host e consegue acessar o Supabase se o nó tiver saída para a internet.

**Resumo:** Com Swarm, o fluxo normal é **Opção 1** (migrations no startup do serviço web). A **Opção 2** serve para rodar migrate manualmente quando fizer sentido.

### Fase 3: Deploy – parar chatwoot.yaml e subir flunx-appchat

| # | Ação | Onde | Detalhe |
|---|------|------|--------|
| 3.1 | Parar e remover deploy do `chatwoot.yaml` | Infra (Docker Swarm / onde estiver) | `docker stack rm chatwoot` ou equivalente; deixar de usar a imagem antiga (ex. sendingtk/chatwoot). |
| 3.2 | Build da imagem do flunx-appchat | Repo flunx-appchat | Usar o Dockerfile do próprio repo (ex. `docker/Dockerfile`) e publicar em um registry (ex. seu Docker Hub ou registry privado). |
| 3.3 | Novo stack (ex. `flunx-appchat.yaml`) | Infra | Serviços: Rails (web) + Sidekiq (worker). Variáveis de ambiente: `POSTGRES_*` apontando para o **Supabase** (host do pooler, database, user, password), e variável ou config que define `schema_search_path=apichat`. |
| 3.4 | Traefik / DNS | Igual hoje | Mesmo host (ex. appchat.flunx.com.br) apontando para o novo serviço Rails do flunx-appchat. |
| 3.5 | Storage (S3/Active Storage) | Env do flunx-appchat | Manter config de S3 compatível (ex. mesmo bucket/credenciais que já usa), para anexos e mídia. |

### Fase 4: Canais só no Flunx (chat ou v2)

| # | Ação | Onde | Detalhe |
|---|------|------|--------|
| 4.1 | Definir “fonte da verdade” dos canais | Flunx (flunx-chat ou flunx-v2) | Lista e configuração de canais (nome, tipo: WhatsApp, API, Email, etc.) ficam no Flunx; tipos = os suportados pelo flunx-appchat. |
| 4.2 | Sincronizar canal Flunx → Inbox Chatwoot | flunx-channels-api ou flunx-chat backend | Ao criar/editar um canal no Flunx, chamar a API do flunx-appchat (Platform ou Application, conforme o caso) para criar/atualizar o Inbox correspondente e guardar o mapeamento (ex. channel_id Flunx ↔ inbox_id Chatwoot) no Flunx ou no BFF. |
| 4.3 | Mapeamento org → account | BFF ou Flunx | Quando uma organização é criada no Flunx, criar Account no Chatwoot (via Platform API) e guardar `organization_id` ↔ `chatwoot_account_id`. Idem para usuário → agent (User + AccountUser) e canal → Inbox. |

### Fase 5: Integração de produto (resumo)

| # | Ação | Detalhe |
|---|------|--------|
| 5.1 | Auth | flunx-chat/flunx-v2 continuam com login Supabase. Chamadas ao flunx-appchat usam token de “agente” (por org/usuário) obtido no BFF ou via integração auth Flunx no flunx-appchat (futuro). |
| 5.2 | Listagem de conversas/canais | Front chama seu BFF (ou flunx-channels-api); BFF usa account_id + token Chatwoot e chama flunx-appchat, devolvendo dados no formato que o front já espera. |
| 5.3 | Canais | Usuário cria/edita canais apenas na tela “Canais” do Flunx; tipos = os do flunx-appchat; persistência do “canal” no Flunx + criação/atualização do Inbox no Chatwoot. |

---

## 4. Configuração do schema no flunx-appchat (exemplo)

Exemplo de como ficar a conexão no **flunx-appchat** para usar o schema `chatwoot` no Supabase.

**Opção A – `config/database.yml` (ex. production):**

```yaml
production:
  <<: *default
  host: "<%= ENV.fetch('POSTGRES_HOST') %>"   # host do Supabase (pooler)
  port: "<%= ENV.fetch('POSTGRES_PORT', '5432') %>"
  database: "<%= ENV.fetch('POSTGRES_DATABASE') %>"
  username: "<%= ENV.fetch('POSTGRES_USERNAME') %>"
  password: "<%= ENV.fetch('POSTGRES_PASSWORD') %>"
  variables:
    statement_timeout: "<%= ENV['POSTGRES_STATEMENT_TIMEOUT'] || '14s' %>"
    schema_search_path: "apichat"
```

**Opção B – via initializer (se preferir não tocar no database.yml):**

```ruby
# config/initializers/supabase_schema.rb
if ENV['SUPABASE_APICHAT_SCHEMA'].present?
  ActiveRecord::Base.connection.execute("SET search_path TO #{ENV['SUPABASE_APICHAT_SCHEMA']}")
end
```

Recomendação: usar **variables** no `database.yml` para que toda conexão do pool já nasça com `search_path = apichat`.

---

## 5. Checklist rápido

- [ ] Schema `apichat` criado no Supabase.
- [ ] flunx-appchat configurado com Postgres do Supabase e `schema_search_path = apichat`.
- [ ] Migrations do flunx-appchat rodadas (tabelas em `apichat.*`).
- [ ] Deploy do `chatwoot.yaml` parado/removido.
- [ ] Novo stack flunx-appchat (Rails + Sidekiq) no ar usando Supabase.
- [ ] Canais criados/editados só no Flunx (chat ou v2); tipos = flunx-appchat; sync Flunx → Inbox (Chatwoot).
- [ ] Mapeamento org → account, user → agent, canal → inbox definido e implementado (BFF ou Flunx + API flunx-appchat).

---

## 6. Referências

- [PostgreSQL Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [Rails / Postgres schema_search_path](https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/PostgreSQLAdapter.html) (connection variables)
- Supabase: connection string e pooler em Project Settings → Database
