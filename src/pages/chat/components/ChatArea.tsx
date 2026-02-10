import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  User,
  Archive,
  Ban,
  Trash2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { MessageBubble, DateSeparator, Message } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { PlayingAudioProvider } from "../contexts/PlayingAudioContext";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  isOnline?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
}

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleContactPanel: () => void;
  isContactPanelOpen: boolean;
  isConversationsColumnOpen?: boolean;
  onToggleConversationsColumn?: () => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  sendError?: string | null;
  onRetrySend?: () => void;
}

export function ChatArea({
  contact,
  messages,
  onSendMessage,
  onToggleContactPanel,
  isContactPanelOpen,
  isConversationsColumnOpen = true,
  onToggleConversationsColumn,
  isLoading,
  hasMoreMessages,
  onLoadMore,
  isLoadingMore,
  sendError,
  onRetrySend,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const getStatusText = () => {
    if (!contact) return "";
    if (contact.isTyping) return "Digitando...";
    if (contact.isOnline) return "Online";
    if (contact.lastSeen) {
      const lastSeenDate = new Date(contact.lastSeen);
      const now = new Date();
      const diff = now.getTime() - lastSeenDate.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `Visto há ${minutes}min`;
      if (hours < 24) return `Visto há ${hours}h`;
      if (days === 1) return "Visto ontem";
      return `Visto em ${lastSeenDate.toLocaleDateString("pt-BR")}`;
    }
    return "";
  };

  // Toggle button for conversations column (used in header and empty state)
  const ToggleConversationsButton = () =>
    onToggleConversationsColumn ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={onToggleConversationsColumn}
          >
            {isConversationsColumnOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isConversationsColumnOpen ? "Ocultar conversas" : "Mostrar conversas"}
        </TooltipContent>
      </Tooltip>
    ) : null;

  // Empty state
  if (!contact) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="h-14 px-4 flex items-center gap-3 border-b border-border bg-card flex-shrink-0">
          {ToggleConversationsButton()}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-1">Selecione uma conversa</h3>
          <p className="text-sm">
            Escolha uma conversa na lista para começar a interagir
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      {/* Header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-border bg-card flex-shrink-0">
        {/* Toggle conversations column */}
        {ToggleConversationsButton()}

        {/* Contact info */}
        <button
          onClick={onToggleContactPanel}
          className="flex items-center gap-3 flex-1 min-w-0 hover:bg-muted/50 -ml-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors"
        >
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {contact.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-card rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-medium truncate">{contact.name}</h3>
            <p
              className={cn(
                "text-xs truncate",
                contact.isTyping
                  ? "text-primary"
                  : contact.isOnline
                  ? "text-green-500"
                  : "text-muted-foreground"
              )}
            >
              {getStatusText()}
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Buscar na conversa</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isContactPanelOpen ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={onToggleContactPanel}
              >
                <User className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dados do contato</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Video className="h-4 w-4 mr-2" />
                Chamada de vídeo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar conversa
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ban className="h-4 w-4 mr-2" />
                Bloquear contato
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir conversa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin bg-muted/20"
      >
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  i % 2 === 0 ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "h-12 rounded-lg animate-pulse",
                    i % 2 === 0 ? "bg-primary/20 w-48" : "bg-muted w-64"
                  )}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 opacity-30 mb-3" />
            <p className="font-medium">Nenhuma mensagem ainda</p>
            <p className="text-sm">Envie a primeira mensagem para iniciar</p>
          </div>
        ) : (
          <>
            {hasMoreMessages && onLoadMore && (
              <div className="flex justify-center pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
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
            <PlayingAudioProvider>
              {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                <div key={date}>
                  <DateSeparator date={date} />
                  {dayMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      contactName={contact.name}
                      contactAvatar={contact.avatar}
                    />
                  ))}
                </div>
              ))}
            </PlayingAudioProvider>
          </>
        )}
      </div>

      {/* Input */}
      <div>
        {sendError && onRetrySend && (
          <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2">
            <p className="text-xs text-destructive flex-1">{sendError}</p>
            <Button variant="ghost" size="sm" onClick={onRetrySend} className="h-6 text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              Tentar novamente
            </Button>
          </div>
        )}
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
