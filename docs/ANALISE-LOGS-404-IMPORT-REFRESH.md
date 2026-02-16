# Análise dos logs – 404 em Importar histórico e Atualizar nome e foto

## 1. O que os logs mostram

### API (flunx-api)

- **As requisições chegam na API.** Nos logs do serviço `flunx-api_api` aparecem:
  - `POST /conversations/78626c21-1a58-4d6f-8bcd-86f8585afc14/contact/refresh 404 2ms`
  - `POST /conversations/78626c21-1a58-4d6f-8bcd-86f8585afc14/messages/import 404 1ms`
  (várias vezes, ~21:35 e 21:39 UTC)

- Ou seja: o Traefik encaminha certo para a API, e **quem responde 404 é o Express** (a rota não existe no processo que está rodando).

- A **imagem `flunx-api:latest` no disco** (build atual) **tem** as rotas no `index.js`:
  - `app.post("/conversations/:conversationId/contact/refresh", ...)`
  - `app.post("/conversations/:conversationId/messages/import", ...)`

- Conclusão: o **container que está em execução** (task `laenhyov88mk`, criada ~20:14) foi iniciado com **outra versão da imagem** (sem essas rotas). O Swarm pode ter usado uma imagem em cache no nó. Por isso o processo Node dentro desse container não registra essas rotas e devolve 404.

### Outros erros nos logs da API (webhook → Supabase)

- `CHATS conversations upsert error: there is no unique or exclusion constraint matching the ON CONFLICT specification` (código 42P10)
- `null value in column "organization_id" of relation "chat_conversations" violates not-null constraint` (23502)
- `CHATS contacts upsert error: 42P10` (mesmo tipo de constraint)

Esses erros são do **webhook** (Evolution → flunx-api → Supabase), não dos endpoints de refresh/import. Indicam schema/constraints no Supabase (conversations e contacts) que precisam ser alinhados com o que o código espera.

### Traefik

- Configuração correta: `Host(api.flunx.com.br)` → serviço flunx-api, porta 3001.
- Não há 404 nem regras que bloqueiem POST nesses paths; o 404 vem da API.

### Evolution

- Logs normais (instâncias, webhooks para api.flunx.com.br, alguns WARN/ERROR de validação).
- Nada que impeça os endpoints refresh/import.

### Front

- Não há “log de servidor” do front neste servidor: o chat é app estático (Vite); o que você vê é o **console do navegador** (Network + “Erro 404”).
- As URLs chamadas estão corretas: `api.flunx.com.br/conversations/.../contact/refresh` e `.../messages/import`.

### Supabase

- Supabase não roda neste servidor; logs ficam no **dashboard do Supabase** (Logs / API).
- Os erros que aparecem são **indiretos**: a API loga as falhas ao fazer upsert no Supabase (constraints acima).

---

## 2. Resumo

| Camada        | Situação |
|---------------|----------|
| **Front**     | Chama as URLs certas; o 404 aparece no console. |
| **Traefik**   | Encaminha api.flunx.com.br para a API. |
| **API**       | Recebe o POST mas **responde 404** porque a **instância em execução** não tem as rotas `contact/refresh` e `messages/import` (imagem antiga no container). |
| **Evolution** | Sem indício de bloqueio desses endpoints. |
| **Supabase**  | Fora do servidor; erros de constraint vistos via logs da API (webhook). |

---

## 3. O que fazer para os 404 sumirem

- Forçar o serviço a usar a **imagem nova** (a que já tem as rotas no código):
  1. Rebuild: `docker build -t flunx-api:latest /root/flunx-api`
  2. Forçar atualização da task: `docker service update --force flunx-api_api`

- Assim o Swarm recria o container com a `flunx-api:latest` atual e os endpoints passam a responder (200 em vez de 404).

- Os erros do **webhook/Supabase** (42P10, organization_id null) são outro tema: exigem ajuste de schema/constraints ou do código do webhook no Supabase; não estão ligados ao 404 de refresh/import.

---

## 4. Atualização: depois do force update – 200 OK mas “nada atualizou”

Depois do `docker service update --force`, os logs mostram:

- `POST .../contact/refresh 200` (~892ms, 905ms)
- `POST .../messages/import 200` (~1559ms, 758ms)
- Em seguida o front chama `GET .../messages 304` (invalidação após import).

Ou seja: **a API está respondendo 200** e fazendo o fluxo. O que pode explicar “não atualizou nada”:

### Refresh (Atualizar nome e foto)

- A API chama Evolution `fetchProfile` + `fetchProfilePictureUrl` para o `remote_jid` do contato.
- Se a Evolution **não retornar** nome ou foto (ex.: contato tipo `...@lid`, número sem perfil, ou Evolution sem dados), o código **não grava** nada novo no Supabase e devolve o contato como já estava. Ou seja: “nada atualizou” é esperado nesses casos.
- Foi adicionado log `[channels] refreshConversationContactProfile no new data from Evolution` quando não há nome/foto novos, para confirmar nos próximos acessos.

### Import (Importar histórico)

- A API chama Evolution `findMessages(instanceName, { remoteJid, limit: 100 })`.
- Se a Evolution **devolver 0 mensagens** (ex.: filtro por `remoteJid` não funcionar em algumas versões, ou esse chat não ter histórico na Evolution), a resposta é `{ imported: 0, total: 0 }` e a lista de mensagens não muda.
- Se devolver mensagens que **já existem** no Supabase (mesmo `evolution_message_id`), o upsert não altera a lista visível; pode ser `imported > 0` por conta do upsert, mas o conteúdo na tela é o mesmo.
- Foi adicionado log `[channels] importConversationHistory conversationId ... imported: N total: M` para ver nos próximos imports quantas mensagens a Evolution retornou e quantas foram consideradas importadas.

### Resumo

| Endpoint   | Status nos logs | Por que pode “não atualizar nada” |
|-----------|------------------|-----------------------------------|
| contact/refresh | 200 OK        | Evolution não retornou nome/foto (ex.: @lid, sem perfil). |
| messages/import | 200 OK        | Evolution retornou 0 mensagens ou todas já existiam no Supabase. |

Para o próximo teste: após clicar de novo em “Importar histórico” e “Atualizar nome e foto”, conferir nos logs da API as linhas `[channels] importConversationHistory` e `[channels] refreshConversationContactProfile no new data` para ver `imported/total` e se o refresh recebeu dados da Evolution.


---

## 5. "Tem mais de uma mensagem" (conversa @lid)

No chat com "Kelvin Andrade" há **várias mensagens** visíveis, mas o log mostrou `imported: 0 total: 1`. Conclusão: a Evolution está devolvendo só 1 mensagem para esse chat (remoteJid ...@lid). Para @lid a Evolution pode armazenar com outro identificador ou a única mensagem não tem key.id. Logs de diagnóstico foram adicionados na API (remoteJid + messages without key.id).
