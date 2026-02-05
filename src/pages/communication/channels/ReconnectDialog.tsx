import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeQrCode, QR_CODE_VALIDITY_MS } from "@/lib/chat-api";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeTimer } from "@/components/QRCodeTimer";

const CHANNELS_API_URL =
  import.meta.env.VITE_EVOLUTION_API_URL || import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

interface ReconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string | null;
  channelName: string;
  isConnected: boolean;
  onSuccess: () => void;
}

type Step = "confirm" | "reconnecting" | "qrcode" | "done" | "error";

export function ReconnectDialog({
  open,
  onOpenChange,
  channelId,
  channelName,
  isConnected,
  onSuccess,
}: ReconnectDialogProps) {
  const { session } = useAuth();
  const [step, setStep] = useState<Step>("confirm");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrStartTime, setQrStartTime] = useState<number>(0);
  const [qrExpired, setQrExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const finishConnection = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setStep("done");
    onSuccessRef.current();
    setTimeout(() => onOpenChange(false), 1500);
  };

  const forceRefreshConnection = async (id: string) => {
    if (!session?.access_token) return false;
    try {
      const res = await fetch(`${CHANNELS_API_URL}/channels/${id}/info`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data?.connection_status === "connected") {
        return true;
      }
    } catch (err) {
      console.warn("[ReconnectDialog] refresh connection failed:", err);
    }
    return false;
  };

  useEffect(() => {
    if (!open) {
      setStep("confirm");
      setQrCode(null);
      setQrStartTime(0);
      setQrExpired(false);
      setErrorMessage("");
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [open]);

  // Realtime: quando o worker recebe qrcode.updated e atualiza chat_inboxes.qr_code, atualizar o QR na tela
  useEffect(() => {
    if (step !== "qrcode" || !channelId) return;
    const channel = supabase
      .channel(`reconnect-qr-${channelId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_inboxes", filter: `id=eq.${channelId}` },
        (payload) => {
          const row = payload.new as { qr_code?: string | null; qr_code_generated_at?: string | null };
          const newQr = row?.qr_code;
          if (newQr && typeof newQr === "string") {
            setQrCode(newQr.startsWith("data:") ? newQr : `data:image/png;base64,${newQr}`);
            const generatedAt = row?.qr_code_generated_at;
            setQrStartTime(
              generatedAt ? new Date(generatedAt).getTime() : Date.now()
            );
            setQrExpired(false);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [step, channelId]);

  useEffect(() => {
    if (step !== "qrcode" || !channelId || !qrCode) return;
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
        .eq("id", channelId)
        .single();
      if (data?.connection_status === "connected") {
        finishConnection();
        return;
      }
      const refreshed = await forceRefreshConnection(channelId);
      if (refreshed) {
        finishConnection();
      }
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [step, channelId, qrCode, session?.access_token]);

  const handleReconnect = async () => {
    if (!channelId) return;

    setStep("reconnecting");
    setErrorMessage("");

    try {
      const token = session?.access_token;
      const res = await fetch(`${CHANNELS_API_URL}/channels/${channelId}/reconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data?.error || data?.detail || `Erro ${res.status}`);
        setStep("error");
        return;
      }

      setQrCode(normalizeQrCode(data) || null);
      setQrStartTime(Date.now());
      setStep("qrcode");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao reconectar");
      setStep("error");
    }
  };

  // Confirmation dialog
  if (step === "confirm") {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reconectar "{channelName}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {isConnected
                ? "O canal será desconectado do WhatsApp atual e uma nova conexão será criada. Você precisará escanear o QR Code novamente."
                : "Uma nova instância será criada. Você precisará escanear o QR Code para conectar."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReconnect}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // QR Code dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "reconnecting" && "Reconectando..."}
            {step === "qrcode" && "Escaneie o QR Code"}
            {step === "done" && "Canal reconectado"}
            {step === "error" && "Erro ao reconectar"}
          </DialogTitle>
          <DialogDescription>
            {step === "reconnecting" && "Criando nova conexão..."}
            {step === "qrcode" && "Escaneie com o WhatsApp no celular para vincular."}
            {step === "done" && "O canal foi reconectado com sucesso."}
            {step === "error" && errorMessage}
          </DialogDescription>
        </DialogHeader>

        {step === "reconnecting" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Aguarde...</p>
          </div>
        )}

        {step === "qrcode" && qrCode && !qrExpired && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48 object-contain rounded-lg" />
            </div>
            {qrStartTime > 0 && (
              <QRCodeTimer
                startTime={qrStartTime}
                durationMs={QR_CODE_VALIDITY_MS}
                onExpire={() => setQrExpired(true)}
              />
            )}
            <p className="text-center text-sm text-muted-foreground">
              O status será atualizado automaticamente ao conectar.
            </p>
          </div>
        )}

        {qrExpired && (
          <div className="py-4">
            <p className="text-center text-sm text-amber-600 dark:text-amber-400">
              O QR expirou. Feche e tente reconectar novamente.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">Canal reconectado!</p>
          </div>
        )}

        {step === "error" && (
          <div className="pt-2 space-y-4">
            <Button
              variant="outline"
              className="w-full rounded-lg"
              onClick={handleReconnect}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {(step === "qrcode" || step === "error") && (
          <Button
            variant="outline"
            className="w-full rounded-lg mt-2"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
