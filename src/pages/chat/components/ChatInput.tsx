import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  FileText,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onAttachment?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊",
  "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘",
  "👍", "👎", "👌", "✌️", "🤝", "👋", "🙏", "💪",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
  "✅", "❌", "⭐", "🔥", "💯", "🎉", "🎊", "🚀",
];

export function ChatInput({
  onSendMessage,
  onAttachment,
  disabled,
  placeholder = "Digite uma mensagem...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (type: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      type === "image"
        ? "image/*"
        : type === "video"
        ? "video/*"
        : type === "document"
        ? ".pdf,.doc,.docx,.xls,.xlsx,.txt"
        : "*/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onAttachment) {
        onAttachment(file);
      }
    };
    input.click();
  };

  return (
    <div className="border-t bg-card p-3">
      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="grid gap-1">
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => handleFileSelect("image")}
              >
                <Image className="h-4 w-4 text-blue-500" />
                Imagem
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => handleFileSelect("video")}
              >
                <Video className="h-4 w-4 text-purple-500" />
                Vídeo
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => handleFileSelect("document")}
              >
                <FileText className="h-4 w-4 text-orange-500" />
                Documento
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Text input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none pr-12 py-3"
            rows={1}
          />
          {/* Emoji button inside textarea */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="end">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Send or Audio button */}
        {message.trim() ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                onClick={handleSend}
                disabled={disabled}
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar (Enter)</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                className={cn(
                  "h-10 w-10 flex-shrink-0",
                  !isRecording && "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
              >
                {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Cancelar gravação" : "Gravar áudio"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
          <span className="h-2 w-2 bg-destructive rounded-full animate-pulse" />
          Gravando... Clique no X para cancelar
        </div>
      )}
    </div>
  );
}
