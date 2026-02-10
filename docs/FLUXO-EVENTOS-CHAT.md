# Fluxo de eventos: Front → API → Evolution → Supabase

Visão da ordem dos eventos entre **Frontend (Flunx Chat)**, **API (Flunx API)**, **Evolution API** e **Supabase** para canais, contatos e conversas.

---

## 1. Criação do canal e conexão (QR / Conectado)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Front (Flunx Chat)
    participant API as Flunx API
    participant Evo as Evolution API
    participant SB as Supabase

    U->>F: Cria canal (nome, instância)
    F->>API: POST /channels (cria inbox + instância)
    API->>SB: INSERT chat_inboxes
    API->>Evo: createInstance(instanceName)
    Evo-->>API: OK
    API-->>F: inbox + evolution_instance_name

    Evo->>Evo: Gera QR
    Evo->>API: POST /webhook/evolution (QRCODE_UPDATED)
    API->>SB: UPDATE chat_inboxes (qr_code, qr_code_generated_at)
    SB-->>F: Realtime UPDATE chat_inboxes
    F->>F: invalidate() → refetch chat_inboxes
    F->>U: Exibe QR

    U->>U: Escaneia QR no WhatsApp
    Evo->>API: POST /webhook/evolution (CONNECTION_UPDATE, state=open)
    API->>SB: UPDATE chat_inboxes (connection_status=connected, perfil WhatsApp)
    API->>API: updateInboxCounts(inboxId)  ← contadores ainda 0
    API->>API: setImmediate(syncInboxAfterConnect(instance))

    Note over API: syncInboxAfterConnect
    API->>Evo: findContacts(instance)
    API->>Evo: findChats(instance)
    Evo-->>API: contacts[] / chats[]

    alt contacts/chats não vazios
        API->>API: handleContactsSetUpsertUpdate(payload)
        API->>SB: UPSERT chat_contacts (onConflict: inbox_id, remote_jid)
        API->>API: updateInboxCounts(inboxId)
        API->>SB: UPDATE chat_inboxes (contacts_count, conversations_count)
        API->>API: handleChatsSetUpsertUpdate(payload)
        API->>SB: UPSERT chat_contacts + UPSERT chat_conversations
        API->>API: updateInboxCounts(inboxId)
        API->>SB: UPDATE chat_inboxes (contacts_count, conversations_count)
    end

    SB-->>F: Realtime UPDATE chat_inboxes
    F->>F: invalidate() → refetch
    F->>U: Mostra CONTATOS / CONVERSAS (ou 0 se Evolution devolveu vazio)
```

---

## 2. Botão "Sincronizar" no painel (manual)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Front (Flunx Chat)
    participant API as Flunx API
    participant Evo as Evolution API
    participant SB as Supabase

    U->>F: Clica "Sincronizar" no canal
    F->>API: POST /inboxes/:inboxId/sync (Bearer token)
    API->>API: getInboxWithAuth(inboxId)
    API->>SB: SELECT chat_inboxes (inbox + evolution_instance_name)

    par Busca na Evolution
        API->>Evo: findContacts(instanceName)
        Evo-->>API: contacts[]
        and
        API->>Evo: findChats(instanceName)
        Evo-->>API: chats[]
    end

    alt contacts.length > 0
        API->>API: handleContactsSetUpsertUpdate({ instance, data: contacts })
        API->>SB: UPSERT chat_contacts
        API->>SB: UPDATE chat_inboxes (contacts_count, conversations_count)
    end
    alt chats.length > 0
        API->>API: handleChatsSetUpsertUpdate({ instance, data: chats })
        API->>SB: UPSERT chat_contacts + UPSERT chat_conversations
        API->>SB: UPDATE chat_inboxes (contacts_count, conversations_count)
    end

    API->>API: updateInboxCounts(inboxId)
    API->>SB: UPDATE chat_inboxes (contacts_count, conversations_count)
    API-->>F: 200 { ok: true }

    F->>F: invalidate() (queryKey: chat_inboxes)
    F->>SB: Refetch chat_inboxes (select *)
    SB-->>F: channels com contacts_count, conversations_count
    F->>U: Atualiza contadores e lista
```

---

## 3. Webhooks Evolution → API (automático)

A Evolution chama a API em **POST /webhook/evolution** quando algo muda na instância. A API persiste no Supabase; o front lê do Supabase (e Realtime atualiza a UI).

```mermaid
flowchart LR
    subgraph Evolution
        E[Instância WhatsApp]
    end
    subgraph Flunx API
        W[POST /webhook/evolution]
        H1[handleConnectionUpdate]
        H2[handleQrcodeUpdated]
        H3[handleContactsSetUpsertUpdate]
        H4[handleChatsSetUpsertUpdate]
        H5[handleChatsDelete]
        H6[handleMessagesUpsertSet]
        UC[updateInboxCounts]
    end
    subgraph Supabase
        IN[chat_inboxes]
        CC[chat_contacts]
        CV[chat_conversations]
        MS[chat_messages]
    end
    subgraph Frontend
        Q[useChannels: select chat_inboxes]
        R[Realtime chat_inboxes]
    end

    E -->|CONNECTION_UPDATE| W
    E -->|QRCODE_UPDATED| W
    E -->|CONTACTS_SET / UPSERT / UPDATE| W
    E -->|CHATS_SET / UPSERT / UPDATE| W
    E -->|CHATS_DELETE| W
    E -->|MESSAGES_UPSERT| W

    W --> H1
    W --> H2
    W --> H3
    W --> H4
    W --> H5
    W --> H6

    H1 --> IN
    H1 --> UC
    H2 --> IN
    H3 --> CC
    H3 --> UC
    H4 --> CC
    H4 --> CV
    H4 --> UC
    H5 --> CV
    H5 --> UC
    H6 --> MS
    UC --> IN

    IN --> Q
    IN --> R
    R --> Q
```

---

## 4. Onde os contadores (CONTATOS / CONVERSAS) são preenchidos

| Origem | O que acontece |
|--------|-----------------|
| **chat_inboxes.contacts_count** | `updateInboxCounts(inboxId)` faz `COUNT(*)` em `chat_contacts` onde `inbox_id = inboxId` e grava em `chat_inboxes`. |
| **chat_inboxes.conversations_count** | Mesmo `updateInboxCounts`: `COUNT(*)` em `chat_conversations` onde `inbox_id = inboxId`. |
| **Quando updateInboxCounts é chamado** | (1) Após `CONNECTION_UPDATE` (open); (2) Após `handleContactsSetUpsertUpdate`; (3) Após `handleChatsSetUpsertUpdate`; (4) Após `handleChatsDelete`; (5) No final de `POST /inboxes/:id/sync`. |
| **Frontend** | Lê `chat_inboxes` do Supabase (`useChannels` → `select *`). Exibe `channel.contacts_count` e `channel.conversations_count`. Atualiza via Realtime (UPDATE em `chat_inboxes`) ou após `invalidate()` (ex.: depois do Sync). |

---

## 5. Por que pode ficar 0 mesmo após "Sincronizar" ou nova instância

1. **Evolution devolve vazio**  
   `findContacts` e `findChats` retornam `[]`. Não há nada para upsert → contadores continuam 0.

2. **Webhook da Evolution não apontando para a API**  
   Se a Evolution não estiver configurada com a URL da flunx-api (ex.: `WEBHOOK_PUBLIC_URL/webhook/evolution`), eventos como `CONNECTION_UPDATE`, `CONTACTS_SET`, `CHATS_SET` não chegam → só o Sync manual traz dados (e mesmo assim só se findContacts/findChats retornarem algo).

3. **Instância nova**  
   Até o WhatsApp/Evolution popular contatos/chats, as chamadas à Evolution podem retornar vazio; após usar o número e ter conversas, Sync ou webhooks passam a preencher contadores.

4. **Erro no upsert (já corrigido)**  
   Antes: falta de UNIQUE em `(inbox_id, remote_jid)` em `chat_contacts` ou colunas de perfil faltando geravam erro no upsert e os contadores não subiam. Com as migrations aplicadas, isso não deve mais ocorrer.

---

## 6. Resumo em fluxograma único (alto nível)

```mermaid
flowchart TB
    subgraph Frontend
        A[Canais de Comunicação]
        B[Botão Sincronizar]
        C[useChannels: Supabase chat_inboxes]
        D[Realtime: chat_inboxes]
    end

    subgraph Flunx API
        E[POST /inboxes/:id/sync]
        F[GET /channels, /channels/:id/info]
        G[POST /webhook/evolution]
        H[findContacts + findChats]
        I[handleContactsSetUpsertUpdate]
        J[handleChatsSetUpsertUpdate]
        K[updateInboxCounts]
    end

    subgraph Evolution API
        L[findContacts / findChats]
        M[Eventos: CONNECTION_UPDATE, CONTACTS_*, CHATS_*, MESSAGES_*]
    end

    subgraph Supabase
        N[(chat_inboxes)]
        O[(chat_contacts)]
        P[(chat_conversations)]
        Q[(chat_messages)]
    end

    A --> C
    B --> E
    C --> N
    D --> N
    E --> H
    H --> L
    L --> I
    I --> O
    I --> K
    K --> N
    J --> O
    J --> P
    J --> K
    G --> I
    G --> J
    M --> G
    N --> C
```

---

*Documento gerado a partir do código em flunx-api e flunx-chat. Atualizar se rotas ou handlers mudarem.*
