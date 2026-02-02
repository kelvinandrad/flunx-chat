# Documentação — Flunx-Chat

Este diretório contém a documentação técnica do projeto **Flunx-Chat**, incluindo planejamento de implementação, modelagem de dados e referências.

---

## Índice de documentos

### 📋 Planejamento principal

**[FLUNX-CHAT-EVOLUTION-PLANO.md](./FLUNX-CHAT-EVOLUTION-PLANO.md)**  
Documento mestre do planejamento da integração **Flunx-Chat + Evolution API**.

**Conteúdo:**
- **Fase 0:** Criação de caixa de entrada e conexão WhatsApp (QR Code) — Estado atual, problemas identificados, correções propostas
- **Fase 1:** Schema e webhook para receber mensagens (✅ concluída)
- **Fase 2:** APIs de listagem (conversas, mensagens) e envio
- **Fase 3:** Frontend com dados reais (substituir mocks)
- **Fase 4:** Robustez com filas e workers (opcional)

**Quando consultar:**
- Para entender o roadmap completo da integração
- Para ver o que já está implementado vs o que falta
- Para planejar próximas sprints/tarefas

---

### 🔍 Análise e fontes

**[FASE-0-FONTES.md](./FASE-0-FONTES.md)**  
Documentação complementar listando **todas as fontes consultadas** para análise da Fase 0.

**Conteúdo:**
- Links para documentação oficial (Evolution API v2, Chatwoot)
- Arquivos de código analisados (backend, frontend, banco de dados)
- Documentos internos consultados (flunx-v2/docs)
- Relatório do subagent (análise profunda do código)
- Decisões de design (por quê fizemos assim)

**Quando consultar:**
- Para verificar fontes e referências usadas na análise
- Para entender o raciocínio por trás das decisões
- Para validar informações com documentação oficial
- Para auditar a análise técnica

---

### 🗂️ Modelagem de dados

**[MODELAGEM.md](./MODELAGEM.md)**  
Modelagem inicial do banco de dados para chat (contatos, conversas, mensagens).

**Status:** Documento antigo, pode estar desatualizado. Consultar **Fase 1** do `FLUNX-CHAT-EVOLUTION-PLANO.md` para schema atual.

---

## Documentação adicional (em outros projetos)

### flunx-v2/docs

Documentos de apoio consultados durante o planejamento:

- **[chatwoot-evolution-integration.md](../../flunx-v2/docs/chatwoot-evolution-integration.md)** — Como Chatwoot + Evolution se integram (modelo de referência)
- **[pesquisa-evolution-chatwoot-api.md](../../flunx-v2/docs/pesquisa-evolution-chatwoot-api.md)** — Endpoints da Evolution (webhook, sendText), autenticação
- **[diferenca-nosso-sistema-vs-chatwoot-evolution.md](../../flunx-v2/docs/diferenca-nosso-sistema-vs-chatwoot-evolution.md)** — Comparação: o que é igual, o que é diferente
- **[api-canais.md](../../flunx-v2/docs/api-canais.md)** — Contrato da API de canais (POST/GET /channels)
- **[estrutura-chat-com-filas.md](../../flunx-v2/docs/estrutura-chat-com-filas.md)** — Filas RabbitMQ e workers (Fase 4)

### flunx-channels-api

Documentação da API de canais:

- **[README.md](../../flunx-channels-api/README.md)** — Como rodar, endpoints, variáveis de ambiente
- **[docs/EVOLUTION-WEBHOOK-ENDPOINT-CONFIRMACAO.md](../../flunx-channels-api/docs/EVOLUTION-WEBHOOK-ENDPOINT-CONFIRMACAO.md)** — Conferência do endpoint de webhook da Evolution

---

## Guia de leitura por perfil

### Para desenvolvedores (implementação)

1. Leia **FLUNX-CHAT-EVOLUTION-PLANO.md** (seção da fase que vai implementar)
2. Consulte **FASE-0-FONTES.md** se precisar de links para docs oficiais
3. Veja código-fonte nos arquivos listados em cada fase

### Para product owners / gestores

1. Leia **FLUNX-CHAT-EVOLUTION-PLANO.md** (seção 7. Sumário Executivo)
2. Revise tabela de status (seção 4. Resumo: o que já temos vs o que falta)
3. Consulte estimativas de esforço (seção 7. Sumário Executivo)

### Para revisores técnicos / QA

1. Leia **Fase 0** completa (seção 0.3. Problemas identificados)
2. Consulte **FASE-0-FONTES.md** (seção "Análise de código (subagent)")
3. Valide problemas apontados testando fluxo de criação de canais

---

## Status das fases (atualizado em 2/2/2026)

| Fase | Status | Prioridade |
|------|--------|------------|
| **Fase 0** | ✅ Concluída | — |
| **Fase 1** | ✅ Concluída | — |
| **Fase 2** | 📝 Planejada | 🟡 Média |
| **Fase 3** | 📝 Planejada | 🟡 Média |
| **Fase 4** | 📝 Planejada | 🟢 Baixa (opcional) |

---

## Como contribuir

1. **Ao adicionar nova documentação:** Atualizar este README.md com link e descrição
2. **Ao implementar uma fase:** Marcar como ✅ no `FLUNX-CHAT-EVOLUTION-PLANO.md` e adicionar seção "Implementação (concluída)"
3. **Ao identificar novos problemas:** Documentar em seção 0.3 da Fase 0 ou criar issue/task

---

**Mantido por:** Time de desenvolvimento Flunx  
**Última atualização:** 2 de fevereiro de 2026
