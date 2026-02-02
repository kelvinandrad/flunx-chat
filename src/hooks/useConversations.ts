import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listConversations } from "@/lib/chat-api";
import type { ListConversationsResponse } from "@/lib/chat-api-types";

export function useConversations(inboxId: string | null | undefined) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const token = session?.access_token ?? null;

  const query = useQuery({
    queryKey: ["chat_conversations", inboxId],
    queryFn: async (): Promise<ListConversationsResponse> => {
      if (!inboxId || !token) throw new Error("inboxId and auth required");
      return listConversations(inboxId, token);
    },
    enabled: !!inboxId && !!token,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["chat_conversations", inboxId] });

  // Realtime: conversas do inbox (novas conversas ou updated_at quando chega mensagem)
  useEffect(() => {
    if (!inboxId) return;

    const channel = supabase
      .channel(`chat_conversations_${inboxId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
          filter: `inbox_id=eq.${inboxId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["chat_conversations", inboxId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inboxId, queryClient]);

  return {
    ...query,
    conversations: query.data?.conversations ?? [],
    invalidate,
  };
}
