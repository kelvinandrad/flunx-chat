# Áudio: Chatwoot vs nosso fluxo — o que está errado

## Como o Chatwoot faz

- **Modelo:** Mensagem tem **vários anexos** (tabela `attachments`). Cada anexo tem `file_type` (audio, image, video, …), arquivo em storage **ou** `external_url`, e a API expõe **`data_url`** (URL para tocar/baixar).
- **Áudio:** Anexo com `file_type: :audio`. O front recebe `attachments[].data_url` (e opcional `transcribed_text`). O player usa essa URL no `<audio src="...">`.
- **Fonte da URL:** Pode ser arquivo enviado pelo usuário (ActiveStorage) ou `external_url` quando a mídia vem de canal externo (ex.: WhatsApp). O importante é que a **URL de reprodução fica no anexo**, não só o texto "[Áudio]".

## O que estamos fazendo de errado

1. **Banco:** Em `chat_messages` só guardamos **`content`** (ex.: "[Áudio]") e **`message_type`** (ex.: "audioMessage"). **Não temos coluna para URL do áudio** (nem duração, nem waveform). Ou seja, a URL que a Evolution envia em `data.message.mediaUrl` **nunca é persistida**.

2. **Worker (flunx-rabbitmq-api):** Em `handleMessagesUpsert` usamos só `extractMessageContent(msg)`, que devolve a string "[Áudio]". O insert em `chat_messages` não lê `msg.message.mediaUrl` nem `msg.message.audioMessage.seconds` / `waveform`. Ou seja: **ignoramos a URL e os metadados de áudio**.

3. **API (flunx-channels-api):** O GET de mensagens faz `select("id, content, direction, message_type, ...")` e **não inclui** `media_url`, `duration_seconds`, `waveform` (até porque hoje essas colunas não existem na tabela). O front espera `media_url` para mostrar o player; como a API não devolve, o player nunca recebe URL.

4. **Front:** O fluxo está certo: se `type === "audio"` e existir `mediaUrl`, renderiza o `AudioPlayer`. O que falta é o **backend** gravar e devolver `media_url` (e, se quiser, duração e waveform).

## Payload Evolution (referência)

No evento `messages.upsert`, para áudio vem algo como:

- `data.message.messageType` = `"audioMessage"`
- `data.message.mediaUrl` = URL do arquivo (ex.: S3) — **esta é a URL que devemos guardar**
- `data.message.audioMessage.seconds` = duração em segundos
- `data.message.audioMessage.waveform` = base64 do waveform

Hoje usamos só o conteúdo de texto "[Áudio]" e não persistimos `mediaUrl`, `seconds` nem `waveform`.

## Resumo

| Onde        | Chatwoot                         | Nosso fluxo atual                    | Correção                          |
|------------|-----------------------------------|--------------------------------------|-----------------------------------|
| Banco      | Anexo com URL (ou file)          | Só `content` + `message_type`        | Colunas `media_url`, `duration_seconds`, `waveform` em `chat_messages` |
| Worker     | Cria anexo com URL               | Só grava `content = "[Áudio]"`      | Ler `mediaUrl` / `audioMessage` e gravar nas novas colunas |
| API        | Retorna `attachments[].data_url` | Não retorna URL de mídia            | Incluir `media_url`, `duration_seconds`, `waveform` no GET de mensagens |
| Front      | Usa `data_url` no player         | Já usa `mediaUrl` se vier da API   | Nada; só passa a receber os dados do backend |

Ou seja: o erro é **não armazenar nem expor a URL do áudio (e metadados)** no backend; o front já está preparado para usar quando a API enviar.
