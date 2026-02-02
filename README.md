# Flunx Chat

Gestão de canais e conversas. Parte do ecossistema Flunx.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth, mesmo projeto do flunx-v2)

## Desenvolvimento

```sh
npm i
npm run dev
```

## Deploy

Docker Swarm ou `docker-compose.dev.yml` para hot reload em desenvolvimento.

## Estrutura

- `/` – Visão geral
- `/canais` – Gerenciar canais WhatsApp (criar, conectar, reconectar)
- `/chat` – Chat unificado (canais, conversas, mensagens). Aceita `?channel=<id>` para pré-selecionar canal

Ver `docs/MODELAGEM.md` para o modelo de dados.
