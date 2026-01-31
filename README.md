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

- `/inboxes` – Lista de inboxes (canais)
- `/inboxes/:id/conversations` – Conversas do inbox
- `/inboxes/:id/conversations/:id` – Visualização da conversa

Ver `docs/MODELAGEM.md` para o modelo de dados.
