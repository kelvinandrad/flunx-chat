import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Zap,
  QrCode,
  Trash2,
  RefreshCw,
  Download,
  Users,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannels } from "@/hooks/useChannels";
import { useAuth } from "@/contexts/AuthContext";
import { syncInbox } from "@/lib/chat-api";
import { toast } from "sonner";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { RefreshQRDialog } from "./RefreshQRDialog";
import { DeleteChannelDialog } from "./DeleteChannelDialog";
import { ReconnectDialog } from "./ReconnectDialog";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  whatsapp_non_official: WhatsAppIcon,
};

function getChannelIcon(channelType: string) {
  return CHANNEL_ICONS[channelType] ?? WhatsAppIcon;
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

export default function ChannelsList() {
  const { session } = useAuth();
  const { channels, isLoading, invalidate } = useChannels();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshQROpen, setRefreshQROpen] = useState(false);
  const [refreshQRInboxId, setRefreshQRInboxId] = useState<string | null>(null);
  const [refreshQRChannelName, setRefreshQRChannelName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteInboxId, setDeleteInboxId] = useState<string | null>(null);
  const [deleteChannelName, setDeleteChannelName] = useState("");
  const [reconnectOpen, setReconnectOpen] = useState(false);
  const [reconnectInboxId, setReconnectInboxId] = useState<string | null>(null);
  const [reconnectChannelName, setReconnectChannelName] = useState("");
  const [reconnectIsConnected, setReconnectIsConnected] = useState(false);
  const [syncingInboxId, setSyncingInboxId] = useState<string | null>(null);

  const openRefreshQR = (inboxId: string, channelName: string) => {
    setRefreshQRInboxId(inboxId);
    setRefreshQRChannelName(channelName);
    setRefreshQROpen(true);
  };

  const closeRefreshQR = () => {
    setRefreshQROpen(false);
    setRefreshQRInboxId(null);
    setRefreshQRChannelName("");
  };

  const openDelete = (inboxId: string, channelName: string) => {
    setDeleteInboxId(inboxId);
    setDeleteChannelName(channelName);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteInboxId(null);
    setDeleteChannelName("");
  };

  const openReconnect = (inboxId: string, channelName: string, isConnected: boolean) => {
    setReconnectInboxId(inboxId);
    setReconnectChannelName(channelName);
    setReconnectIsConnected(isConnected);
    setReconnectOpen(true);
  };

  const closeReconnect = () => {
    setReconnectOpen(false);
    setReconnectInboxId(null);
    setReconnectChannelName("");
    setReconnectIsConnected(false);
  };

  const handleSync = async (inboxId: string) => {
    if (!session?.access_token) return;
    setSyncingInboxId(inboxId);
    try {
      const result = await syncInbox(inboxId, session.access_token);
      await invalidate();
      toast.success(
        `Sincronização concluída: ${result.conversations_created} conversas criadas, ${result.contacts_created} contatos criados.`
      );
    } catch (e) {
      console.error("Erro ao sincronizar:", e);
      toast.error(e instanceof Error ? e.message : "Erro ao sincronizar conversas");
    } finally {
      setSyncingInboxId(null);
    }
  };

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
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10">
                <WhatsAppIcon className="h-10 w-10 text-emerald-500" />
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
              const isConnected = channel.connection_status === "connected";
              const hasProfile = isConnected && channel.whatsapp_profile_name;
              return (
                <Card
                  key={channel.id}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {/* Avatar: foto do WhatsApp se conectado, ícone se não */}
                        {hasProfile && channel.whatsapp_profile_pic_url ? (
                          <Avatar className="h-14 w-14 rounded-2xl">
                            <AvatarImage src={channel.whatsapp_profile_pic_url} alt={channel.whatsapp_profile_name || ""} />
                            <AvatarFallback className="rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <Icon className="h-7 w-7" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Icon className="h-7 w-7" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {channel.name}
                          </h3>
                          {hasProfile && channel.whatsapp_phone_number && (
                            <p className="text-xs text-muted-foreground">{channel.whatsapp_phone_number}</p>
                          )}
                          <div className="mt-1.5">{StatusBadge({ status: channel.connection_status })}</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats: Contatos e Conversas (se conectado) */}
                    {isConnected ? (
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            Contatos
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {channel.contacts_count?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            Conversas
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {channel.conversations_count?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                    ) : (
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
                    )}

                    <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">
                          {channel.evolution_instance_name}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {/* Botão Conectar (para não conectados) */}
                        {!isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-lg flex-1 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                            onClick={() => openRefreshQR(channel.id, channel.name)}
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            Conectar
                          </Button>
                        )}
                        {/* Botão Reconectar (sempre visível para WhatsApp) */}
                        {channel.channel_type === "whatsapp" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => openReconnect(channel.id, channel.name, isConnected)}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reconectar
                          </Button>
                        )}
                        {/* Botão Sincronizar (conversas e mensagens) */}
                        {channel.channel_type === "whatsapp" && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-lg border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
                            onClick={() => handleSync(channel.id)}
                            disabled={syncingInboxId === channel.id}
                          >
                            {syncingInboxId === channel.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            Sincronizar
                          </Button>
                        )}
                        {/* Botão Excluir */}
                        {channel.channel_type === "whatsapp" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() => openDelete(channel.id, channel.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Excluir
                          </Button>
                        )}
                      </div>
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
      <RefreshQRDialog
        open={refreshQROpen}
        onOpenChange={(open) => !open && closeRefreshQR()}
        inboxId={refreshQRInboxId}
        channelName={refreshQRChannelName}
        onSuccess={invalidate}
      />
      <DeleteChannelDialog
        open={deleteOpen}
        onOpenChange={(open) => !open && closeDelete()}
        channelId={deleteInboxId}
        channelName={deleteChannelName}
        onSuccess={() => {
          invalidate();
          closeDelete();
        }}
      />
      <ReconnectDialog
        open={reconnectOpen}
        onOpenChange={(open) => !open && closeReconnect()}
        channelId={reconnectInboxId}
        channelName={reconnectChannelName}
        isConnected={reconnectIsConnected}
        onSuccess={() => {
          invalidate();
          closeReconnect();
        }}
      />
    </AppLayout>
  );
}
