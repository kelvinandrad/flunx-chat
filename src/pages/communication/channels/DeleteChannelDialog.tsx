import { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const CHANNELS_API_URL = import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

interface DeleteChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string | null;
  channelName: string;
  onSuccess: () => void;
}

export function DeleteChannelDialog({
  open,
  onOpenChange,
  channelId,
  channelName,
  onSuccess,
}: DeleteChannelDialogProps) {
  const { session } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!channelId) return;

    setDeleting(true);
    try {
      const token = session?.access_token;
      const res = await fetch(`${CHANNELS_API_URL}/channels/${channelId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Erro ${res.status}`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao excluir canal:", err);
      alert(err instanceof Error ? err.message : "Erro ao excluir canal");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir canal "{channelName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. O canal será desconectado do WhatsApp e todos os dados
            associados serão removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
