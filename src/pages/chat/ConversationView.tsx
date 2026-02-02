import { useState, useCallback, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Loader2, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { listMessages } from "@/lib/chat-api";
import type { MessageListItem } from "@/lib/chat-api-types";

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ConversationView = () => {
  const navigate = useNavigate();
  const { inboxId, conversationId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [olderMessages, setOlderMessages] = useState<MessageListItem[]>([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();

  const { conversations } = useConversations(inboxId);
  const { messages: latestMessages, isLoading, error, cursor, hasMore } = useMessages(conversationId ?? null);
  const { send, isReady } = useSendMessage(conversationId ?? null);

  // Todas as mensagens: antigas carregadas manualmente + últimas da query
  const allMessages = [...olderMessages, ...latestMessages];
  // Para exibição: reverter (API retorna desc, queremos asc para UI)
  const displayMessages = allMessages.slice().reverse();

  // Scroll to bottom on new messages (when latestMessages changes and not loading older)
  useEffect(() => {
    if (!loadingOlder && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [latestMessages, loadingOlder]);

  // Reset older messages when conversation changes
  useEffect(() => {
    setOlderMessages([]);
  }, [conversationId]);

  const selectedConv = conversationId
    ? conversations.find((c) => c.id === conversationId)
    : null;
  const contactName =
    selectedConv?.contact?.name ?? selectedConv?.contact?.remote_jid ?? "Contato";

  const handleSend = useCallback(async () => {
    const content = inputValue.trim();
    if (!content || !isReady) return;
    setSendError(null);
    setInputValue("");
    try {
      await send({ content });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setSendError(msg);
    }
  }, [inputValue, isReady, send]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoadOlder = useCallback(async () => {
    if (!conversationId || !session?.access_token || !cursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const result = await listMessages(conversationId, session.access_token, { before: cursor });
      setOlderMessages((prev) => [...prev, ...result.messages]);
    } catch (e) {
      console.error("Erro ao carregar mensagens antigas:", e);
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, session, cursor, loadingOlder]);

  const handleRetry = useCallback(() => {
    setSendError(null);
    if (inputValue.trim()) {
      handleSend();
    }
  }, [inputValue, handleSend]);

  return (
    <AppLayout>
      <div className="animate-fade-in h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/inboxes/${inboxId}/conversations`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(contactName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px]">
                {contactName}
              </h1>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <Card className="flex-1 min-h-0 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 m-4 text-sm text-destructive">
                {error.message}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center flex-1 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {/* Botão carregar mais antigas (no topo) */}
                  {hasMore && (
                    <div className="flex justify-center pb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadOlder}
                        disabled={loadingOlder}
                      >
                        {loadingOlder ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          "Carregar mensagens antigas"
                        )}
                      </Button>
                    </div>
                  )}

                  {displayMessages.length === 0 && !error && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      Nenhuma mensagem ainda.
                    </div>
                  )}
                  {displayMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.direction === "outgoing"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(msg.created_at)}
                          {msg.status === "failed" && " • Falha no envio"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Input */}
            <div className="border-t p-4 flex gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                className="flex-1 min-h-[44px] max-h-32 resize-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isReady}
                rows={1}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim() || !isReady}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {sendError && (
              <div className="px-4 pb-2 flex items-center gap-2">
                <p className="text-xs text-destructive flex-1">{sendError}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="h-6 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ConversationView;
