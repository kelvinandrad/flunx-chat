import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listMessages, sendMessage } from "@/lib/chat-api";
import type { ListMessagesParams } from "@/lib/chat-api";
import type { ListMessagesResponse, SendMessageBody } from "@/lib/chat-api-types";

export function useMessages(
  conversationId: string | null | undefined,
  params?: ListMessagesParams
) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const token = session?.access_token ?? null;

  const query = useQuery({
    queryKey: ["chat_messages", conversationId, params?.before],
    queryFn: async (): Promise<ListMessagesResponse> => {
      if (!conversationId || !token) throw new Error("conversationId and auth required");
      return listMessages(conversationId, token, params);
    },
    enabled: !!conversationId && !!token,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["chat_messages", conversationId] });

  // Realtime: novas/atualizações de mensagens na conversa atual
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat_messages_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["chat_messages", conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return {
    ...query,
    messages: query.data?.messages ?? [],
    cursor: query.data?.cursor ?? null,
    hasMore: query.data?.has_more ?? false,
    invalidate,
  };
}

export function useSendMessage(conversationId: string | null | undefined) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const token = session?.access_token ?? null;

  const send = async (body: SendMessageBody) => {
    if (!conversationId || !token) throw new Error("conversationId and auth required");
    const result = await sendMessage(conversationId, body, token);
    queryClient.invalidateQueries({ queryKey: ["chat_messages", conversationId] });
    queryClient.invalidateQueries({ queryKey: ["chat_conversations"] });
    return result;
  };

  return { send, isReady: !!conversationId && !!token };
}
