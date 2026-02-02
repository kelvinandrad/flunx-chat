import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageCircle,
  Plus,
  Settings,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannels } from "@/hooks/useChannels";
import { CreateChannelDialog } from "./CreateChannelDialog";

const CHANNEL_ICONS: Record<string, typeof MessageCircle> = {
  whatsapp_non_official: MessageCircle,
};

function getChannelIcon(channelType: string) {
  return CHANNEL_ICONS[channelType] ?? MessageCircle;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "connected":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-medium">
          <CheckCircle2 className="h-3.5 w-3 mr-1.5" />
          Conectado
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 font-medium">
          <Loader2 className="h-3.5 w-3 mr-1.5 animate-spin" />
          Aguardando QR
        </Badge>
      );
    case "error":
    case "disconnected":
      return (
        <Badge className="bg-destructive/15 text-destructive border-destructive/25 font-medium">
          <XCircle className="h-3.5 w-3 mr-1.5" />
          Desconectado
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="font-medium">
          <AlertTriangle className="h-3.5 w-3 mr-1.5" />
          {status}
        </Badge>
      );
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/** No flunx-chat, "Configurar" leva para as conversas do inbox (mesma tela que v2, destino diferente). */
function getChannelDetailPath(channelId: string) {
  return `/inboxes/${channelId}/conversations`;
}

export default function ChannelsList() {
  const navigate = useNavigate();
  const { channels, isLoading, invalidate } = useChannels();
  const [createOpen, setCreateOpen] = useState(false);

  const connectedCount = channels.filter((c) => c.connection_status === "connected").length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header — idêntico ao flunx-v2 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Canais de Comunicação
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie suas conexões e monitore a performance de cada canal
            </p>
          </div>
          <Button
            className="gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium shadow-sm transition-all hover:bg-primary/90 hover:shadow"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Conectar canal
          </Button>
        </div>

        {/* Summary strip — idêntico ao flunx-v2 */}
        {channels.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/20 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {channels.length} canal{channels.length !== 1 ? "is" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {connectedCount} conectado{connectedCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content — idêntico ao flunx-v2 (só o destino do link muda para conversas) */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-14 w-14 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : channels.length === 0 ? (
          <Card className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                Nenhum canal conectado
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Conecte seu primeiro canal para começar a receber conversas pelo WhatsApp ou outros canais.
              </p>
              <Button
                className="mt-6 gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium shadow-sm hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Conectar primeiro canal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = getChannelIcon(channel.channel_type);
              const detailPath = getChannelDetailPath(channel.id);
              return (
                <Card
                  key={channel.id}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{channel.name}</h3>
                          <div className="mt-1.5">{StatusBadge({ status: channel.connection_status })}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg opacity-70 transition-opacity hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(detailPath);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Tipo
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          WhatsApp
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Criado em
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {formatDate(channel.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {channel.evolution_instance_name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 rounded-lg text-primary hover:bg-primary/10"
                        onClick={() => navigate(detailPath)}
                      >
                        Configurar
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <CreateChannelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={invalidate}
      />
    </AppLayout>
  );
}
