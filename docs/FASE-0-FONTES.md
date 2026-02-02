# Fase 0 — Fontes e Referências Consultadas

Documento complementar ao `FLUNX-CHAT-EVOLUTION-PLANO.md` listando todas as fontes consultadas para análise e planejamento da Fase 0.

---

## Documentação Oficial — Evolution API v2

| Recurso | URL | Consultado |
|---------|-----|------------|
| **API Reference (Overview)** | https://doc.evolution-api.com/v2/api-reference/ | ✅ |
| **Create Instance** | https://doc.evolution-api.com/v2/api-reference/instance-controller/create-instance-basic | ✅ |
| **Instance Connect (QR Code)** | https://doc.evolution-api.com/v2/api-reference/instance-controller/instance-connect | ✅ |
| **Connection State** | https://doc.evolution-api.com/v2/api-reference/instance-controller/connection-state | ✅ |
| **Set Webhook** | https://doc.evolution-api.com/v2/api-reference/webhook/set | ✅ |
| **Find Webhook** | https://doc.evolution-api.com/v2/api-reference/webhook/get | ✅ |
| **Send Plain Text** | https://doc.evolution-api.com/v2/api-reference/message-controller/send-text | ✅ |
| **Webhooks Configuration** | https://doc.evolution-api.com/v2/en/configuration/webhooks | ✅ |
| **Chatwoot Integration** | https://doc.evolution-api.com/v2/en/integrations/chatwoot | ✅ |

---

## Documentação Oficial — Chatwoot

| Recurso | URL | Consultado |
|---------|-----|------------|
| **How to setup WhatsApp channel** | https://www.chatwoot.com/hc/user-guide/articles/1677832735-how-to-setup-a-whats_app-channel | ✅ |
| **How to create an API channel inbox** | https://www.chatwoot.com/hc/user-guide/articles/1677839703-how-to-create-an-api-channel-inbox | ✅ |
| **Receive messages (callback URL)** | https://www.chatwoot.com/docs/product/channels/api/receive-messages | ✅ |
| **API Reference — Contacts** | https://developers.chatwoot.com/api-reference/contacts/create-contact | ✅ (via docs internos) |
| **API Reference — Conversations** | https://developers.chatwoot.com/ | ✅ (via docs internos) |

---

## Código-fonte analisado (Flunx)

### Backend (flunx-channels-api)

| Arquivo | Função | Problemas identificados |
|---------|--------|-------------------------|
| `src/index.js` | Endpoint `POST /channels` (cria instância + persiste) | Race condition, webhook não obrigatório, sem rollback |
| `src/evolution.js` | Cliente Evolution API (`createInstance`, `connectInstance`, `setWebhook`) | Sem tratamento de erro 409 (instância já existe) |
| `src/supabase.js` | Cliente Supabase (RLS + service role) | OK |
| `src/webhookEvolution.js` | Handler webhook (`handleConnectionUpdate`, `handleMessagesUpsert`) | Sem autenticação, sem validação de `instance` existente |

### Frontend (flunx-chat)

| Arquivo | Função | Problemas identificados |
|---------|--------|-------------------------|
| `src/pages/communication/channels/CreateChannelDialog.tsx` | Dialog de criação (form → loading → QR → done) | Sem polling após exibir QR, sem botão "Reexibir QR" |
| `src/pages/communication/channels/ChannelsList.tsx` | Lista canais com status visual | Sem polling, sem botão "Reconectar" |
| `src/hooks/useChannels.ts` | React Query hook (busca `chat_inboxes`) | Sem `refetchInterval`, sem Realtime subscription |

### Banco de dados (Supabase)

| Arquivo | Função | Status |
|---------|--------|--------|
| `flunx-v2/supabase/apply-chat-inboxes.sql` | Schema `chat_inboxes` + RLS | ✅ OK (UNIQUE em `evolution_instance_name`) |
| `flunx-chat/supabase/migrations/20260202100000_phase1_chat_evolution_schema.sql` | Migration Fase 1 (colunas Evolution) | ✅ Aplicada |

---

## Documentos internos consultados (flunx-v2/docs)

| Documento | Conteúdo | Relevância para Fase 0 |
|-----------|----------|------------------------|
| `chatwoot-evolution-integration.md` | Como Chatwoot + Evolution se integram (quem chama quem, webhooks) | ⭐⭐⭐ Alta — modelo de referência |
| `pesquisa-evolution-chatwoot-api.md` | Endpoints da Evolution (webhook, sendText), autenticação (`apikey`) | ⭐⭐⭐ Alta — detalhes técnicos |
| `diferenca-nosso-sistema-vs-chatwoot-evolution.md` | Comparação: o que é igual, o que é diferente, checklist | ⭐⭐⭐ Alta — gap analysis |
| `api-canais.md` | Contrato da API de canais (POST/GET /channels) | ⭐⭐ Média — já implementado |
| `estrutura-chat-com-filas.md` | Filas RabbitMQ e workers (Fase 4) | ⭐ Baixa — não aplicável à Fase 0 |

---

## Análise de código (subagent)

**ID do subagent:** `35181c52-75b5-4a04-919a-6e4c35842d48`  
**Prompt:** "Explore o código atual relacionado à criação de canais/caixas de entrada (inboxes) e conexão com Evolution nos projetos flunx-channels-api, flunx-chat e flunx-v2. Retorne fluxo completo passo a passo, arquivos envolvidos, problemas identificados, o que está funcionando e o que não está. Seja very thorough."

**Relatório completo:** Disponível no histórico do subagent (7.600+ linhas de análise detalhada)

### Principais descobertas do subagent:

1. **Fluxo atual funciona basicamente:** Criação de instância → QR code → persistência → webhook (Fase 1)
2. **Problema crítico 1:** Frontend não faz polling após exibir QR (usuário precisa recarregar página)
3. **Problema crítico 2:** Endpoint `GET /channels/:inboxId/qrcode` existe no backend, mas frontend não usa
4. **Problema crítico 3:** Race conditions no fluxo de criação (falha após criar instância → registro órfão)
5. **Problema crítico 4:** Webhook sem autenticação (security through obscurity)
6. **Problema médio:** Validação insuficiente (não verifica se `evolution_instance_name` já existe antes de criar)
7. **Problema médio:** `setWebhook()` falha silenciosamente (apenas loga warning, não retorna erro)

---

## Consultas ao banco de dados (Supabase)

**Método:** Tentativa de `supabase db pull` (falhou por autenticação), mas schema foi confirmado via:
- Leitura de `flunx-v2/supabase/apply-chat-inboxes.sql`
- Análise de migrations em `flunx-chat/supabase/migrations/`
- Tipos TypeScript gerados em `flunx-v2/src/integrations/supabase/types.ts`

**Tabelas confirmadas:**
- `chat_inboxes` (evolution_instance_name UNIQUE, qr_code, connection_status, RLS habilitado)
- `chat_contacts` (inbox_id, remote_jid, name)
- `chat_conversations` (inbox_id, contact_id, status)
- `chat_messages` (conversation_id, content, direction, evolution_message_id)

---

## Buscas na web (Google Search via WebSearch tool)

| Query | Resultado | Usado para |
|-------|-----------|------------|
| "Evolution API v2 create instance connect QR code documentation 2026" | Links para doc.evolution-api.com | Confirmar endpoints corretos |
| "Chatwoot WhatsApp channel setup creation flow documentation 2026" | Chatwoot User Guide + Embedded Signup | Entender fluxo de referência |

---

## Comparação: Chatwoot+Evolution vs Flunx-Chat+Evolution

### O que Chatwoot faz que nós NÃO fazemos:

1. **Polling automático:** Chatwoot atualiza status do inbox em tempo real (WebSocket ou polling)
2. **Botão "Reconnect":** Permite reexibir QR Code expirado sem deletar inbox
3. **Validação robusta:** Verifica se inbox já existe antes de criar
4. **Rollback em falhas:** Deleta recursos criados se fluxo falhar no meio
5. **Webhook autenticado:** Chatwoot valida token no webhook da Evolution

### O que nós fazemos DIFERENTE (e está OK):

1. **Sem `/chatwoot/set`:** Não configuramos Evolution com dados do Chatwoot (não somos Chatwoot)
2. **Webhook genérico:** Usamos `POST /webhook/set/:instance` em vez de integração nativa
3. **RLS do Supabase:** Segurança via Row Level Security (Chatwoot usa permissões de aplicação)
4. **React Query:** Caching e invalidação via TanStack Query (Chatwoot usa Redux)

---

## Ferramentas de análise utilizadas

| Ferramenta | Uso |
|------------|-----|
| **Task (subagent explore)** | Análise profunda do código-fonte (fluxo, problemas, arquivos) |
| **WebSearch** | Busca de documentações oficiais atualizadas (2026) |
| **WebFetch** | Leitura de páginas específicas da documentação Evolution/Chatwoot |
| **Read** | Leitura de arquivos locais (código, docs, SQL) |
| **Glob** | Busca de arquivos por padrão (docs/*chatwoot*, docs/*evolution*) |
| **Shell** | Tentativa de `supabase db pull` (falhou por autenticação) |

---

## Decisões de design (por quê fizemos assim)

### Por que não usamos `/chatwoot/set`?

- **Chatwoot:** Evolution configurada com `chatwootUrl`, `chatwootToken`, `chatwootAccountId` → Evolution chama API do Chatwoot quando recebe mensagem
- **Nós:** Evolution configurada com webhook genérico → Evolution chama **nossa** API quando recebe mensagem
- **Vantagem:** Desacoplamento (não dependemos de integração específica Chatwoot)
- **Desvantagem:** Precisamos implementar handlers para todos os eventos (Chatwoot já tem)

### Por que usamos Supabase em vez de banco próprio?

- **Vantagem 1:** RLS (Row Level Security) — segurança no nível do banco
- **Vantagem 2:** Realtime subscriptions — podemos usar para polling (Fase 0)
- **Vantagem 3:** REST API automática — não precisamos criar endpoints CRUD manualmente
- **Desvantagem:** Dependência de serviço externo (mitigado por auto-hosting do Supabase)

### Por que React Query em vez de Redux?

- **Vantagem 1:** Caching automático (staleTime, refetch)
- **Vantagem 2:** Menos boilerplate (sem actions, reducers)
- **Vantagem 3:** Integração natural com APIs REST
- **Desvantagem:** Curva de aprendizado para desenvolvedores acostumados com Redux

---

## Conclusão da análise

A implementação atual está **funcional para casos básicos** (criar canal, exibir QR, conectar, receber mensagens via webhook), mas tem **lacunas críticas para produção**:

1. **UX ruim:** Usuário não vê status atualizar automaticamente
2. **QR expira:** Sem forma de reexibir (precisa deletar canal)
3. **Fragilidade:** Race conditions podem gerar instâncias órfãs
4. **Segurança:** Webhook sem autenticação

**Recomendação:** Implementar **Fase 0** (correções) antes de avançar para Fases 2 e 3 (APIs e frontend de conversas).

---

**Data da análise:** 2 de fevereiro de 2026  
**Documentado por:** Assistente AI (Claude Sonnet 4.5) via Cursor  
**Revisão:** Pendente (aguardando feedback do desenvolvedor)
