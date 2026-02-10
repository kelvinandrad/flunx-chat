import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromContact: boolean;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  type?: "text" | "image" | "audio" | "video" | "document";
  mediaUrl?: string;
  /** Duração do áudio em segundos */
  durationSeconds?: number;
  /** Waveform em base64 (WhatsApp) para barras do player */
  waveform?: string;
  /** Em grupos: nome/número de quem enviou (quando isFromContact) */
  senderName?: string;
  replyTo?: {
    id: string;
    content: string;
    contactName: string;
  };
}

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  contactName?: string;
  contactAvatar?: string;
}

export function MessageBubble({ message, showAvatar, contactName, contactAvatar }: MessageBubbleProps) {
  const { content, timestamp, isFromContact, status, replyTo, senderName, type, mediaUrl, durationSeconds, waveform } = message;

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatus = () => {
    if (isFromContact) return null;

    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-1",
        isFromContact ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 shadow-sm",
          isFromContact
            ? "bg-card border border-border rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}
      >
        {/* Reply preview */}
        {replyTo && (
          <div
            className={cn(
              "mb-2 pl-2 border-l-2 text-xs",
              isFromContact
                ? "border-primary/50 text-muted-foreground"
                : "border-primary-foreground/50 text-primary-foreground/80"
            )}
          >
            <p className="font-medium">{replyTo.contactName}</p>
            <p className="truncate">{replyTo.content}</p>
          </div>
        )}

        {/* Sender name (grupos: quem enviou) */}
        {isFromContact && senderName && (
          <p className="text-xs font-medium text-muted-foreground mb-1">{senderName}</p>
        )}

        {/* Imagem */}
        {type === "image" && mediaUrl && (
          <div className="space-y-1">
            <img
              src={mediaUrl}
              alt=""
              className="max-w-full max-h-64 rounded object-contain"
            />
            {content && content !== "[Mídia]" && (
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            )}
          </div>
        )}

        {/* Vídeo */}
        {type === "video" && mediaUrl && (
          <div className="space-y-1">
            <video
              src={mediaUrl}
              controls
              className="max-w-full max-h-64 rounded"
            />
            {content && content !== "[Mídia]" && (
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            )}
          </div>
        )}

        {/* Documento: link para abrir */}
        {type === "document" && mediaUrl && (
          <div className="space-y-1">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline break-all"
            >
              {content && content !== "[Mídia]" ? content : "Abrir arquivo"}
            </a>
          </div>
        )}

        {/* Áudio: player estilo WhatsApp */}
        {type === "audio" && mediaUrl ? (
          <AudioPlayer
            messageId={message.id}
            mediaUrl={mediaUrl}
            durationSeconds={durationSeconds}
            waveformBase64={waveform}
            isFromContact={isFromContact}
            contactAvatar={contactAvatar}
            contactName={contactName}
          />
        ) : null}

        {/* Texto (quando não é mídia ou quando não tem mediaUrl) */}
        {type !== "image" && type !== "video" && type !== "document" && (type !== "audio" || !mediaUrl) && (
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        )}

        {/* Timestamp and status */}
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1",
            isFromContact ? "text-muted-foreground" : "text-primary-foreground/70"
          )}
        >
          <span className="text-[10px]">{formatTime(timestamp)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}

// Date separator component
export function DateSeparator({ date }: { date: string }) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
        {formatDate(date)}
      </span>
    </div>
  );
}
