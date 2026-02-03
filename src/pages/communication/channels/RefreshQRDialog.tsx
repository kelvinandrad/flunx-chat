import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeQrCode } from "@/lib/chat-api";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeTimer } from "@/components/QRCodeTimer";

const CHANNELS_API_URL = import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

interface RefreshQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inboxId: string | null;
  channelName: string;
  onSuccess: () => void;
}

export function RefreshQRDialog({
  open,
  onOpenChange,
  inboxId,
  channelName,
  onSuccess,
}: RefreshQRDialogProps) {
  const { session } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [qrStartTime, setQrStartTime] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onOpenChangeRef = useRef(onOpenChange);
  onSuccessRef.current = onSuccess;
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (!open || !inboxId) return;
    setQrCode(null);
    setLoading(true);
    setErrorMessage("");
    setConnected(false);
    setQrExpired(false);
    setQrStartTime(0);

    const token = session?.access_token;
    fetch(`${CHANNELS_API_URL}/channels/${inboxId}/qrcode`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        setLoading(false);
        if (data.connection_status === "connected") {
          setConnected(true);
          onSuccessRef.current();
          setTimeout(() => onOpenChangeRef.current(false), 1500);
          return;
        }
        setQrCode(normalizeQrCode(data) ?? null);
        if (normalizeQrCode(data)) {
          setQrStartTime(Date.now());
        }
        if (!normalizeQrCode(data) && !data.connection_status) {
          setErrorMessage(data?.error || "Não foi possível obter o QR Code.");
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage("Serviço de canais indisponível.");
      });
  }, [open, inboxId, session?.access_token]);

  useEffect(() => {
    if (!open || !inboxId || loading || connected || !qrCode) return;
    const start = Date.now();
    pollRef.current = setInterval(async () => {
      if (Date.now() - start > POLL_TIMEOUT_MS) {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setQrExpired(true);
        return;
      }
      const { data } = await supabase
        .from("chat_inboxes")
        .select("connection_status")
        .eq("id", inboxId)
        .single();
      if (data?.connection_status === "connected") {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setConnected(true);
        onSuccessRef.current();
        setTimeout(() => onOpenChangeRef.current(false), 1500);
      }
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [open, inboxId, loading, connected, qrCode]);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {connected ? "Canal conectado" : "Reexibir QR Code"}
          </DialogTitle>
          <DialogDescription>
            {channelName}
            {connected && " — O canal foi conectado com sucesso."}
            {!connected && !loading && " — Escaneie com o WhatsApp no celular."}
            {loading && " — Carregando novo QR Code..."}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Gerando novo QR Code...</p>
          </div>
        )}

        {!loading && errorMessage && (
          <p className="text-sm text-destructive py-2">{errorMessage}</p>
        )}

        {!loading && !errorMessage && qrCode && !qrExpired && !connected && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48 object-contain rounded-lg" />
            </div>
            {qrStartTime > 0 && (
              <QRCodeTimer
                startTime={qrStartTime}
                durationMs={POLL_TIMEOUT_MS}
                onExpire={() => setQrExpired(true)}
              />
            )}
            <p className="text-center text-sm text-muted-foreground">
              O status será atualizado automaticamente ao conectar.
            </p>
          </div>
        )}

        {qrExpired && (
          <p className="text-center text-sm text-amber-600 dark:text-amber-400 py-2">
            O QR expirou. Feche e clique em &quot;Conectar&quot; novamente para gerar um novo.
          </p>
        )}

        {connected && (
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">Redirecionando...</p>
          </div>
        )}

        {!loading && !connected && (
          <Button className="w-full rounded-lg gap-2 mt-2" variant="outline" onClick={() => handleClose(false)}>
            Fechar
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
