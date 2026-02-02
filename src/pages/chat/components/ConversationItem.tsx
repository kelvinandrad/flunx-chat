import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isFromContact: boolean;
  };
  unreadCount: number;
  status: "open" | "pending" | "resolved" | "snoozed";
  isTyping?: boolean;
  isOnline?: boolean;
  labels?: string[];
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const { contact, lastMessage, unreadCount, isTyping, isOnline, labels } = conversation;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Ontem";
    } else if (days < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-border/50",
        isSelected
          ? "bg-primary/10 border-l-2 border-l-primary"
          : "hover:bg-muted/50"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "font-medium truncate",
            unreadCount > 0 && "text-foreground"
          )}>
            {contact.name}
          </span>
          <span className={cn(
            "text-xs flex-shrink-0",
            unreadCount > 0 ? "text-primary font-medium" : "text-muted-foreground"
          )}>
            {formatTime(lastMessage.timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            "text-sm truncate flex-1",
            unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground",
            isTyping && "text-primary italic"
          )}>
            {isTyping ? (
              "Digitando..."
            ) : (
              <>
                {!lastMessage.isFromContact && (
                  <span className="text-muted-foreground">Você: </span>
                )}
                {lastMessage.content}
              </>
            )}
          </p>
          {unreadCount > 0 && (
            <Badge className="h-5 min-w-5 flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>

        {/* Labels */}
        {labels && labels.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {labels.slice(0, 2).map((label) => (
              <Badge key={label} variant="outline" className="text-xs py-0 h-5">
                {label}
              </Badge>
            ))}
            {labels.length > 2 && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                +{labels.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
