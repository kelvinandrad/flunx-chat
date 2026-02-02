import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export interface Channel {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "webchat" | "instagram" | "telegram";
  avatar?: string;
  unreadCount: number;
  status: "connected" | "disconnected" | "connecting";
  phoneNumber?: string;
}

interface ChannelSidebarProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  onAddChannel?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  whatsapp: WhatsAppIcon,
};

export function ChannelSidebar({
  channels,
  selectedChannelId,
  onSelectChannel,
  onAddChannel,
  isCollapsed = false,
  onToggleCollapse,
}: ChannelSidebarProps) {
  const getChannelIcon = (type: string) => {
    return CHANNEL_ICONS[type] || WhatsAppIcon;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      default:
        return "bg-gray-500";
    }
  };

  const totalUnread = channels.reduce((acc, ch) => acc + ch.unreadCount, 0);

  return (
    <div
      className={cn(
        "h-full bg-muted/30 border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-border flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">Canais</span>
            {totalUnread > 0 && (
              <Badge className="h-5 min-w-5 flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs">
                {totalUnread > 99 ? "99+" : totalUnread}
              </Badge>
            )}
          </div>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Channel list */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {/* All conversations option */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelectChannel("all")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 transition-colors",
                  selectedChannelId === "all"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">ALL</span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate text-sm">Todas</p>
                    <p className="text-xs text-muted-foreground">
                      {channels.length} canais
                    </p>
                  </div>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Todas conversas</TooltipContent>
            )}
          </Tooltip>

          {/* Separator */}
          <div className="mx-3 my-2 border-t border-border" />

          {/* Channels */}
          {channels.map((channel) => {
            const Icon = getChannelIcon(channel.type);
            return (
              <Tooltip key={channel.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelectChannel(channel.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 transition-colors relative",
                      selectedChannelId === channel.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {/* Avatar or Icon */}
                    <div className="relative flex-shrink-0">
                      {channel.avatar ? (
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback>
                            <Icon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                      {/* Status indicator */}
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                          getStatusColor(channel.status)
                        )}
                      />
                    </div>

                    {!isCollapsed && (
                      <>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium truncate text-sm">{channel.name}</p>
                          {channel.phoneNumber && (
                            <p className="text-xs text-muted-foreground truncate">
                              {channel.phoneNumber}
                            </p>
                          )}
                        </div>
                        {channel.unreadCount > 0 && (
                          <Badge className="h-5 min-w-5 flex items-center justify-center px-1.5 bg-primary text-primary-foreground text-xs">
                            {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
                          </Badge>
                        )}
                      </>
                    )}

                    {isCollapsed && channel.unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {channel.name}
                    {channel.unreadCount > 0 && ` (${channel.unreadCount})`}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-2 flex-shrink-0">
        {onAddChannel && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full text-muted-foreground hover:text-foreground",
                  isCollapsed ? "h-9 w-9 p-0" : "justify-start gap-2"
                )}
                onClick={onAddChannel}
              >
                <Plus className="h-4 w-4" />
                {!isCollapsed && "Adicionar"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Adicionar canal</TooltipContent>
            )}
          </Tooltip>
        )}
      </div>
    </div>
  );
}
