import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeQrCode } from "@/lib/chat-api";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { QRCodeTimer } from "@/components/QRCodeTimer";

const CHANNELS_API_URL = import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

type Step = "form" | "loading" | "qrcode" | "done" | "error";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateChannelDialog({ open, onOpenChange, onSuccess }: CreateChannelDialogProps) {
  const { session } = useAuth();
  const { organizationId } = useTenant();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [inboxId, setInboxId] = useState<string | null>(null);
  const [qrExpired, setQrExpired] = useState(false);
  const [qrStartTime, setQrStartTime] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const POLL_INTERVAL_MS = 4000;
  const POLL_TIMEOUT_MS = 2 * 60 * 1000;

  useEffect(() => {
    if (step !== "qrcode" || !inboxId) return;
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
        setStep("done");
        onSuccessRef.current();
        setTimeout(() => handleClose(false), 1500);
      }
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [step, inboxId]);

  const reset = () => {
    setStep("form");
    setName("");
    setErrorMessage("");
    setQrCode(null);
    setInboxId(null);
    setQrExpired(false);
    setQrStartTime(0);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !name.trim()) return;

    setStep("loading");
    setErrorMessage("");

    try {
      const token = session?.access_token;
      const res = await fetch(`${CHANNELS_API_URL}/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: "whatsapp_non_official",
          name: name.trim(),
          organization_id: organizationId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data?.error || data?.detail || `Erro ${res.status}`);
        setStep("error");
        return;
      }

      setInboxId(data?.inbox?.id ?? null);
      setQrCode(normalizeQrCode(data) ?? null);

      if (normalizeQrCode(data)) {
        setQrStartTime(Date.now());
        setStep("qrcode");
      } else if (data?.inbox?.connection_status === "connected") {
        setStep("done");
        setTimeout(() => {
          onSuccess();
          handleClose(false);
        }, 1500);
      } else {
        setErrorMessage(
          "Canal criado, mas não foi possível gerar o QR Code. Use \"Conectar\" no canal para gerar um novo QR."
        );
        setStep("error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isNetworkError = msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("CONNECTION_REFUSED");
      setErrorMessage(
        isNetworkError
          ? "Serviço de canais indisponível. Verifique se a API está em execução (ex.: flunx-channels-api na porta 3001) ou a URL configurada (VITE_CHANNELS_API_URL)."
          : msg
      );
      setStep("error");
    }
  };

  const handleDone = () => {
    onSuccess();
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "form" && "Conectar canal"}
            {step === "loading" && "Criando canal..."}
            {step === "qrcode" && "Escaneie o QR Code"}
            {step === "done" && "Canal conectado"}
            {step === "error" && "Erro ao conectar"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" && "WhatsApp não-oficial via Evolution API. Dê um nome ao canal."}
            {step === "loading" && "Estamos criando a instância e gerando o QR code."}
            {step === "qrcode" && "Abra o WhatsApp no celular e escaneie para vincular."}
            {step === "done" && "O canal foi conectado com sucesso."}
            {step === "error" && errorMessage}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <WhatsAppIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">WhatsApp (não-oficial)</p>
                <p className="text-xs text-muted-foreground">Conexão via Evolution API</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel-name">Nome do canal</Label>
              <Input
                id="channel-name"
                placeholder="Ex: Atendimento WhatsApp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1 rounded-lg" onClick={() => handleClose(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 rounded-lg gap-2" disabled={!name.trim()}>
                Criar e gerar QR
              </Button>
            </div>
          </form>
        )}

        {step === "loading" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Aguarde...</p>
          </div>
        )}

        {step === "qrcode" && (
          <div className="space-y-4 pt-2">
            {qrCode && !qrExpired && (
              <>
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
                  Escaneie com o WhatsApp. O status será atualizado automaticamente ao conectar.
                </p>
              </>
            )}
            {qrExpired && (
              <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                O QR expirou. Feche este diálogo e use &quot;Conectar&quot; no canal para gerar um novo.
              </p>
            )}
            <Button className="w-full rounded-lg gap-2" onClick={handleDone}>
              <CheckCircle2 className="h-4 w-4" />
              Fechar
            </Button>
          </div>
        )}

        {step === "done" && (
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">Redirecionando...</p>
          </div>
        )}

        {step === "error" && (
          <div className="pt-2 space-y-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setStep("form")}>
                Tentar novamente
              </Button>
              <Button className="flex-1 rounded-lg" onClick={() => handleClose(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
