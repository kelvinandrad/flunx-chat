# Como aplicar as migrações (Fase 2 e Fase 3)

As migrações do plano estilo Chatwoot estão em `flunx-chat/supabase/migrations/` com os prefixos de data.

## Ordem obrigatória

1. **20260212100000_chat_contact_inboxes_fase2.sql** – Modelo Contact + ContactInbox (troca de tabela `chat_contacts`, cria `chat_contact_inboxes`, adiciona `contact_inbox_id` em conversas).
2. **20260213100000_chat_conversations_multiple_fase3.sql** – Múltiplas conversas por contact_inbox (remove UNIQUE, adiciona índices).

A Fase 3 depende da Fase 2 já aplicada.

## Opção 1: Supabase CLI (recomendado)

No diretório do projeto (onde está `supabase/config.toml` ou onde você inicializa o Supabase):

```bash
cd flunx-chat   # ou o diretório que contém supabase/
supabase db push
```

Isso aplica todas as migrações pendentes na ordem.

## Opção 2: SQL direto no dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → **SQL Editor**.
2. Abra o conteúdo de `supabase/migrations/20260212100000_chat_contact_inboxes_fase2.sql`, cole no editor e execute.
3. Depois abra `supabase/migrations/20260213100000_chat_conversations_multiple_fase3.sql`, cole e execute.

## Antes de aplicar

- Faça backup do banco (export ou snapshot).
- A migração da Fase 2 renomeia e recria a tabela `chat_contacts` e atualiza FKs; há janela de indisponibilidade mínima durante a execução.
- Garanta que não há processos escrevendo em `chat_contacts` / `chat_conversations` durante a execução (ou agende em janela de baixo uso).

## Depois de aplicar

- Reinicie ou redeploy da **flunx-api** (ela já está preparada para o novo schema).
- Teste: listar conversas, enviar mensagem, webhook de nova mensagem (reabertura de conversa resolved).
- Para mídia: crie o bucket **chat-media** no Storage (se ainda não existir) e deixe-o público para leitura, se for usar o endpoint fetch-media.
