# Plano de implementação: mídia no fluxo estilo Chatwoot (Rabbit + workers)

**Data:** 6 de fevereiro de 2026  
**Objetivo:** Deixar nosso processo o mais semelhante possível ao do Chatwoot no recebimento de mensagens (incluindo áudio/imagem/vídeo), **mantendo** RabbitMQ e workers.

---

## 1. Princípio: mesmo resultado, caminhos diferentes

No Chatwoot, a Evolution **entrega o arquivo** (stream) na API. No nosso caso, queremos o **mesmo resultado** (mensagem com URL reproduzível no front), mas com duas fontes possíveis de URL:

1. **Payload já traz `mediaUrl`** (Evolution com storage habilitado e payload enriquecido).
2. **Fallback:** worker obtém mídia via API da Evolution e grava URL (nosso storage ou URL da Evolution).

Ambos os caminhos terminam em `chat_messages.media_url` preenchido; o front já consome esse campo.

---

## 2. Fases do plano

### Fase 1 — Evolution: payload com `mediaUrl` (recomendado primeiro)

**Objetivo:** Fazer o payload que a Evolution publica no Rabbit (ou envia ao webhook) já vir com `mediaUrl` para mensagens de mídia.

- **1.1** Habilitar **storage (S3 ou Minio)** na Evolution.
  - Documentação: [S3/Minio - Evolution API](https://doc.evolution-api.com/v2/en/integrations/s3minio).
  - Quando o storage está ativo, a Evolution faz upload das mídias e **inclui a URL nos payloads** (webhook e, em geral, no mesmo objeto que é publicado no Rabbit).
- **1.2** Garantir que o evento **MESSAGES_UPSERT** que alimenta nossa fila use esse payload enriquecido.
  - Se a fila for alimentada por **webhook** da Evolution, o webhook já recebe o payload com `mediaUrl` quando storage está on; basta o serviço que republica no Rabbit manter o corpo.
  - Se a Evolution publica **diretamente** no Rabbit, em muitos setups o payload é o mesmo do webhook; confirmar na doc/versão da Evolution que o publish para Rabbit inclui `message.mediaUrl` quando há storage.
- **1.3** Nosso worker **já** lê `inner.mediaUrl ?? inner.media_url` e grava em `chat_messages.media_url` para áudio. Não exige alteração de código para esse cenário; só garantir que o payload chegue com a URL.

**Resultado:** Mensagens de áudio (e, se a Evolution enriquecer também imagem/vídeo, esses) passam a ter `media_url` preenchido sem mudança no worker.

---

### Fase 2 — Worker: mídia para todos os tipos e fallback opcional

**Objetivo:** Alinhar ao comportamento “estilo Chatwoot” (toda mídia com URL) e, se quiser, cobrir o caso em que o payload ainda não traz `mediaUrl`.

- **2.1** Gravar `media_url` para **qualquer** tipo de mídia quando `mediaUrl`/`media_url` existir no payload (não só áudio).
  - Hoje: `...(isAudio && mediaUrl && { media_url: mediaUrl })`.
  - Ajuste: usar algo como `...(mediaUrl && { media_url: mediaUrl })` (e manter `duration_seconds`/`waveform` apenas para áudio).
  - Tipos a considerar: `audioMessage`, `imageMessage`, `videoMessage`, `documentMessage`, `stickerMessage`, etc., desde que o payload traga a URL.
- **2.2** (Opcional) **Fallback quando não houver URL no payload:** para mensagens de mídia **sem** `mediaUrl`:
  - Worker chama a **API da Evolution** para obter a mídia (ex.: endpoint de base64 ou de download por `instance` + `messageId`).
  - Worker faz **upload** do arquivo para nosso storage (ex.: Supabase Storage) e obtém URL pública (ou signed).
  - Worker grava essa URL em `chat_messages.media_url` (e, para áudio, preenche `duration_seconds`/`waveform` se a API devolver).
  - Exige: configuração da URL da Evolution no worker, possível autenticação, e tratamento de erro (ex.: não bloquear a inserção da mensagem se o fetch falhar; deixar `media_url` null e opcionalmente retentar depois).

**Resultado:** Comportamento equivalente ao Chatwoot (toda mídia com URL quando possível), mantendo Rabbit e worker; fallback cobre instâncias sem storage na Evolution.

---

### Fase 3 — API e front (checagem)

**Objetivo:** Garantir que a API exponha e o front use `media_url` como no Chatwoot (`data_url`).

- **3.1** **API (flunx-channels-api):** GET de mensagens já deve incluir `media_url`, `duration_seconds`, `waveform` no `select`. Confirmar e documentar.
- **3.2** **Front:** Já usa `mediaUrl`/`media_url` para exibir o player de áudio (e, se aplicável, imagem/vídeo). Apenas validar com dados reais quando `media_url` vier preenchido.

**Resultado:** Fim a fim igual ao Chatwoot: mensagem com anexo = URL em `media_url` → API retorna → front exibe.

---

### Fase 4 — Ordem e idempotência (opcional, alinhado ao Chatwoot)

**Objetivo:** Evitar problemas de ordem de eventos (ex.: mensagem antes de contato/conversa) e duplicidade.

- **4.1** Manter **findOrCreateContact** e **findOrCreateConversation** como hoje (já idempotentes).
- **4.2** Se no futuro a Evolution enviar eventos de chat (CHATS_UPSERT/CHATS_UPDATE) para a mesma fila, tratar no worker para criar contato + conversa quando fizer sentido, deixando o fluxo “estilo Chatwoot”: tanto mensagem quanto chat podem criar contato/conversa.
- **4.3** Evitar duplicata de mensagem: já usamos `evolution_message_id` (checagem antes do insert). Manter.

**Resultado:** Fluxo robusto independente da ordem de chegada dos eventos, como no Chatwoot.

---

## 3. Ordem sugerida de implementação

| Ordem | Item | Esforço | Impacto |
|-------|------|--------|--------|
| 1 | Fase 1: Configurar storage (S3/Minio) na Evolution e validar payload no Rabbit | Baixo (config) | Alto: resolve áudio/mídia na raiz |
| 2 | Fase 2.1: Worker gravar `media_url` para todos os tipos de mídia quando vier no payload | Baixo (pequena alteração no handler) | Consistência com Chatwoot |
| 3 | Fase 3: Checar API e front com `media_url` preenchido | Baixo | Garantir fim a fim |
| 4 | Fase 2.2 (opcional): Fallback — worker buscar mídia na Evolution e upload no nosso storage | Médio | Cobre Evolution sem storage |

---

## 4. Resumo

- **Manter:** RabbitMQ, fila única, worker flunx-rabbitmq-api, Supabase (chat_messages com media_url/duration_seconds/waveform).
- **Fazer primeiro:** Evolution com storage para o payload já trazer `mediaUrl`; worker gravar `media_url` para qualquer mídia quando a URL vier.
- **Opcional depois:** Fallback no worker (chamar Evolution para baixar mídia, upload em nosso storage, gravar URL).

Assim o processo fica o mais semelhante possível ao do Chatwoot (mensagem com anexo = URL utilizável), mantendo nossa arquitetura com Rabbit e workers.

---

## 5. Referências

- [Evolution API – S3/Minio](https://doc.evolution-api.com/v2/en/integrations/s3minio)
- [Evolution API – RabbitMQ](https://doc.evolution-api.com/v2/en/integrations/rabbitmq)
- [RECEBIMENTO-MENSAGENS-CHATWOOT-VS-FLUNX.md](./RECEBIMENTO-MENSAGENS-CHATWOOT-VS-FLUNX.md)
- [AUDIO-URL-CHATWOOT-VS-NOSSO.md](./AUDIO-URL-CHATWOOT-VS-NOSSO.md)
