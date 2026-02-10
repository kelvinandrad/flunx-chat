import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { updateChannelImportConfig, CHANNELS_API_URL, getAuthHeaders } from "@/lib/chat-api";
import type { ChatInbox } from "@/hooks/useChannels";

interface ChannelImportConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: ChatInbox | null;
  onSuccess: () => void;
}

/** Settings da Evolution API (Set Settings). Todos false por padrão. */
export type EvolutionSettings = {
  rejectCall: boolean;
  msgCall: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
};

const DEFAULT_EVOLUTION_SETTINGS: EvolutionSettings = {
  rejectCall: false,
  msgCall: "",
  groupsIgnore: false,
  alwaysOnline: false,
  readMessages: false,
  readStatus: false,
  syncFullHistory: false,
};

async function fetchChannelSettings(
  inboxId: string,
  accessToken: string
): Promise<EvolutionSettings> {
  const res = await fetch(`${CHANNELS_API_URL}/channels/${inboxId}/settings`, {
    headers: getAuthHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return DEFAULT_EVOLUTION_SETTINGS;
  return {
    rejectCall: data.rejectCall ?? false,
    msgCall: data.msgCall ?? "",
    groupsIgnore: data.groupsIgnore ?? false,
    alwaysOnline: data.alwaysOnline ?? false,
    readMessages: data.readMessages ?? false,
    readStatus: data.readStatus ?? false,
    syncFullHistory: data.syncFullHistory ?? false,
  };
}

async function saveChannelSettings(
  inboxId: string,
  accessToken: string,
  settings: EvolutionSettings
): Promise<void> {
  const res = await fetch(`${CHANNELS_API_URL}/channels/${inboxId}/settings`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`);
}

export function ChannelImportConfigDialog({
  open,
  onOpenChange,
  channel,
  onSuccess,
}: ChannelImportConfigDialogProps) {
  const { session } = useAuth();
  const [importContacts, setImportContacts] = useState(false);
  const [importMessages, setImportMessages] = useState(false);
  const [days, setDays] = useState(3);
  const [evolutionSettings, setEvolutionSettings] = useState<EvolutionSettings>(DEFAULT_EVOLUTION_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (channel && open) {
      setImportContacts(channel.import_contacts_on_connect ?? false);
      setImportMessages(channel.import_messages_on_connect ?? false);
      setDays(Math.min(30, Math.max(0, channel.import_messages_days ?? 3)));
      setEvolutionSettings(DEFAULT_EVOLUTION_SETTINGS);
      setLoadingSettings(true);
      if (session?.access_token) {
        fetchChannelSettings(channel.id, session.access_token)
          .then(setEvolutionSettings)
          .catch(() => setEvolutionSettings(DEFAULT_EVOLUTION_SETTINGS))
          .finally(() => setLoadingSettings(false));
      } else {
        setLoadingSettings(false);
      }
    }
  }, [channel, open, session?.access_token]);

  const handleSave = async () => {
    if (!channel?.id || !session?.access_token) return;
    setSaving(true);
    try {
      await updateChannelImportConfig(channel.id, session.access_token, {
        import_contacts_on_connect: importContacts,
        import_messages_on_connect: importMessages,
        import_messages_days: importMessages ? days : 0,
      });
      await saveChannelSettings(channel.id, session.access_token, evolutionSettings);
      onSuccess();
      onOpenChange(false);
      toast.success("Configurações salvas.");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Erro ao salvar configuração");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do canal</DialogTitle>
          <DialogDescription>
            Sincronização ao conectar e opções da instância (Evolution API).
          </DialogDescription>
        </DialogHeader>

        {/* Sincronização ao conectar */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Sincronização ao conectar</h4>
          <div className="grid gap-3 pl-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="import-contacts"
                checked={importContacts}
                onCheckedChange={(v) => setImportContacts(v === true)}
              />
              <Label htmlFor="import-contacts" className="text-sm font-normal cursor-pointer">
                Importar contatos ao conectar
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="import-messages"
                checked={importMessages}
                onCheckedChange={(v) => setImportMessages(v === true)}
              />
              <Label htmlFor="import-messages" className="text-sm font-normal cursor-pointer">
                Importar mensagens ao conectar
              </Label>
            </div>
            {importMessages && (
              <div className="grid gap-2">
                <Label htmlFor="days" className="text-sm">
                  Dias de histórico (0 = só contatos)
                </Label>
                <Input
                  id="days"
                  type="number"
                  min={0}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.min(30, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Configurações da instância (Evolution API) — todas false por padrão */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-medium text-foreground">Instância WhatsApp (Evolution API)</h4>
          {loadingSettings ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : (
            <div className="grid gap-3 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reject-call"
                  checked={evolutionSettings.rejectCall}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, rejectCall: v === true }))
                  }
                />
                <Label htmlFor="reject-call" className="text-sm font-normal cursor-pointer">
                  Rejeitar ligações automaticamente
                </Label>
              </div>
              {evolutionSettings.rejectCall && (
                <div className="grid gap-2 pl-6">
                  <Label htmlFor="msg-call" className="text-sm">
                    Mensagem ao rejeitar ligação
                  </Label>
                  <Input
                    id="msg-call"
                    value={evolutionSettings.msgCall}
                    onChange={(e) =>
                      setEvolutionSettings((s) => ({ ...s, msgCall: e.target.value }))
                    }
                    placeholder="Ex: Ligação não disponível"
                    className="max-w-xs"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="groups-ignore"
                  checked={evolutionSettings.groupsIgnore}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, groupsIgnore: v === true }))
                  }
                />
                <Label htmlFor="groups-ignore" className="text-sm font-normal cursor-pointer">
                  Ignorar mensagens de grupos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="always-online"
                  checked={evolutionSettings.alwaysOnline}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, alwaysOnline: v === true }))
                  }
                />
                <Label htmlFor="always-online" className="text-sm font-normal cursor-pointer">
                  Sempre aparecer online
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="read-messages"
                  checked={evolutionSettings.readMessages}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, readMessages: v === true }))
                  }
                />
                <Label htmlFor="read-messages" className="text-sm font-normal cursor-pointer">
                  Marcar mensagens como lidas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="read-status"
                  checked={evolutionSettings.readStatus}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, readStatus: v === true }))
                  }
                />
                <Label htmlFor="read-status" className="text-sm font-normal cursor-pointer">
                  Ver status (stories)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sync-full-history"
                  checked={evolutionSettings.syncFullHistory}
                  onCheckedChange={(v) =>
                    setEvolutionSettings((s) => ({ ...s, syncFullHistory: v === true }))
                  }
                />
                <Label htmlFor="sync-full-history" className="text-sm font-normal cursor-pointer">
                  Sincronizar histórico completo com a API
                </Label>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loadingSettings}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
