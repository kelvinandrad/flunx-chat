import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

export type ChatInbox = {
  id: string;
  organization_id: string;
  name: string;
  channel_type: string;
  evolution_instance_name: string;
  evolution_base_url: string | null;
  connection_status: "pending" | "connected" | "disconnected" | "error";
  qr_code: string | null;
  created_at: string;
  updated_at: string;
};

export function useChannels() {
  const { organizationId } = useTenant();
  const queryClient = useQueryClient();

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

  return { ...query, channels: query.data ?? [], invalidate };
}
