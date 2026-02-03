import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";

const CHANNELS_API_URL = import.meta.env.VITE_CHANNELS_API_URL || "http://localhost:3001";

export type ChatInbox = {
  id: string;
  organization_id: string;
  name: string;
  channel_type: string;
  evolution_instance_name: string;
  evolution_base_url: string | null;
  connection_status: "pending" | "connected" | "disconnected" | "error";
  qr_code: string | null;
  // WhatsApp profile data
  whatsapp_profile_name: string | null;
  whatsapp_profile_pic_url: string | null;
  whatsapp_phone_number: string | null;
  whatsapp_jid: string | null;
  contacts_count: number;
  conversations_count: number;
  created_at: string;
  updated_at: string;
};

// Busca dados atualizados do canal via API (força sync com Evolution)
async function refreshChannelInfo(channelId: string, accessToken: string | undefined): Promise<void> {
  if (!accessToken) return;
  try {
    await fetch(`${CHANNELS_API_URL}/channels/${channelId}/info`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    console.warn("[useChannels] Failed to refresh channel info:", err);
  }
}

export function useChannels() {
  const { session } = useAuth();
  const { organizationId } = useTenant();
  const queryClient = useQueryClient();
  const refreshingRef = useRef<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["chat_inboxes", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("chat_inboxes")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ChatInbox[];
    },
    enabled: !!organizationId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["chat_inboxes", organizationId] });

  // Quando canais carregam, verifica se algum conectado precisa de refresh dos dados
  useEffect(() => {
    if (!query.data) return;

    query.data.forEach((channel) => {
      // Se está conectado mas não tem dados do WhatsApp, força refresh
      if (
        channel.connection_status === "connected" &&
        channel.contacts_count === 0 &&
        !refreshingRef.current.has(channel.id)
      ) {
        refreshingRef.current.add(channel.id);
        console.log("[useChannels] Refreshing channel info:", channel.id);
        refreshChannelInfo(channel.id, session?.access_token).finally(() => {
          // Remove do set após 5s para permitir retry se necessário
          setTimeout(() => refreshingRef.current.delete(channel.id), 5000);
        });
      }
    });
  }, [query.data, session?.access_token]);

  // Supabase Realtime: escuta mudanças na tabela chat_inboxes
  useEffect(() => {
    if (!organizationId) return;

    const channel = supabase
      .channel(`chat_inboxes_${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "chat_inboxes",
          filter: `organization_id=eq.${organizationId}`,
        },
        async (payload) => {
          console.log("[Realtime] chat_inboxes changed:", payload.eventType);

          // Se um canal acabou de conectar, aguarda um pouco e força refresh dos dados
          const newData = payload.new as ChatInbox | undefined;
          if (
            payload.eventType === "UPDATE" &&
            newData?.connection_status === "connected" &&
            newData?.contacts_count === 0
          ) {
            // Aguarda 2s para Evolution sincronizar os contatos
            setTimeout(async () => {
              await refreshChannelInfo(newData.id, session?.access_token);
              invalidate();
            }, 2000);
          }

          // Invalida a query para refetch dos dados atualizados
          invalidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, queryClient, session?.access_token]);

  return { ...query, channels: query.data ?? [], invalidate };
}
