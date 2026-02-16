# Tamanho dos bodies dos eventos (webhook Evolution → API)

## Análise

Os eventos que a Evolution envia em `POST /webhook/evolution` têm estrutura e tamanho aproximados:

| Evento | Conteúdo típico do `data` | Tamanho estimado por item | Fórmula (N = quantidade) |
|--------|----------------------------|----------------------------|--------------------------|
| **connection.update** | state, profileName, profilePictureUrl, wuid | ~0,5–2 KB | ~1–2 KB total |
| **qrcode.updated** | base64 do QR (PNG) | ~2–15 KB | ~2–15 KB total |
| **contacts.set / contacts.upsert / contacts.update** | Array de contatos: `id`/`remoteJid`, `pushName`, `profilePicUrl` (URL longa), etc. | **~400–700 bytes/contato** (JSON) | **~0,4–0,7 KB × N contatos** |
| **chats.set / chats.upsert / chats.update** | Array de chats: `id`/`remoteJid`, `pushName`, `archive`, `pin`, etc. | **~300–500 bytes/chat** | **~0,3–0,5 KB × N chats** |
| **messages.set / messages.upsert** | 1 mensagem ou array: `key`, `message`, `pushName`, `messageTimestamp`, etc. | **~0,5–5 KB/msg** (com contexto/citação maior) | **~1–5 KB por request** |
| **labels.edit** | id, name, color, deleted | ~0,2 KB | ~0,2 KB |
| **presence.update / messages.update** | Objeto pequeno | ~0,5–2 KB | ~2 KB |

Envelope fixo por request: `event`, `instance`, `destination`, `date_time`, `sender`, `server_url`, `apikey` → ~0,3–0,5 KB.

---

## Cálculo dos MB

- **CONTACTS_SET** com **N = 2.000** contatos:  
  `0,5 KB × 2.000 + 0,5 KB ≈ 1.000 KB ≈ 1 MB`

- **CONTACTS_SET** com **N = 3.000** contatos (e JSON não minificado):  
  `0,7 KB × 3.000 ≈ 2,1 MB` → **acima do limite antigo de 2 MB**

- **CONTACTS_SET** com **N = 5.000** contatos:  
  `0,6 KB × 5.000 ≈ 3 MB`

- **CHATS_SET** com **N = 2.000** chats:  
  `0,4 KB × 2.000 ≈ 0,8 MB`

- **CONTACTS + CHATS** no mesmo batch ou em sequência (cada um grande):  
  Contas que deram **PayloadTooLarge** batem com **~1.200–1.300 contatos** nos logs de sync; com `profilePicUrl` e JSON verboso, **2–4 MB** por request é plausível.

Conclusão: os bodies que estouram são sobretudo **contacts.set / contacts.upsert** (e eventualmente **chats.set**) com **muitos contatos/chats** (milhares), gerando **2–5+ MB** por request. O limite de **2 MB** na API era insuficiente; **20 MB** cobre esses casos.

---

## Tamanho real (após deploy)

Foi adicionado na API um middleware que loga **Content-Length** em todo `POST /webhook/evolution`:

```
[webhook] body size: 2345678 bytes (2.24 MB)
```

Após **rebuild e redeploy** da API, os logs (`docker service logs flunx-api_api`) passarão a mostrar o tamanho real em bytes e MB para cada webhook. Use isso para conferir os números acima.

---

## Base64 vs URL (política na API)

- **Não processamos base64 de arquivos de mídia** no webhook: em mensagens, só persistimos **URL** (http/https). Se a Evolution enviar `mediaUrl` como `data:image/...;base64,...`, o valor é **ignorado** e `media_url` fica null (o front pode usar o endpoint **fetch-media** depois, que busca na Evolution e grava URL do Storage).
- **QR code:** o único base64 que aceitamos e persistimos é o do QR (evento `qrcode.updated`), necessário para exibir a imagem no modal; tamanho típico 2–15 KB.
- Assim evitamos inflar o body ou o banco com base64 de fotos/áudios/vídeos; mídia entra só por URL (webhook com URL ou fetch-media → Storage → URL).
