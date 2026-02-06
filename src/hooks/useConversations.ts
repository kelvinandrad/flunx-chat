import { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listConversations } from "@/lib/chat-api";
import type { ListConversationsResponse } from "@/lib/chat-api-types";

const DEFAULT_LIMIT = 30;
const DEFAULT_DAYS = 7;

export type UseConversationsFilter = {
  includeArchived?: boolean;
  pinnedOnly?: boolean;
};

export function useConversations(
  inboxId: string | null | undefined,
  filter?: UseConversationsFilter
) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const token = session?.access_token ?? null;
  const includeArchived = filter?.includeArchived ?? false;
  const pinnedOnly = filter?.pinnedOnly ?? false;

  const query = useInfiniteQuery({
    queryKey: ["chat_conversations", inboxId, includeArchived, pinnedOnly],
    queryFn: async ({
      pageParam,
    }: {
      pageParam?: string | null;
    }): Promise<ListConversationsResponse> => {
      if (!inboxId || !token) throw new Error("inboxId and auth required");
      return listConversations(inboxId, token, {
        limit: DEFAULT_LIMIT,
        days: pageParam == null ? DEFAULT_DAYS : undefined,
        before: pageParam ?? undefined,
        include_archived: includeArchived || undefined,
        pinned: pinnedOnly || undefined,
        only_with_messages: true, // só conversas com mensagens (igual WhatsApp Web); contatos sem conversa não aparecem na lista
      });
    },
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.cursor : undefined),
    initialPageParam: null as string | null,
    enabled: !!inboxId && !!token,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["chat_conversations", inboxId, includeArchived, pinnedOnly],
    });

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
          queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "chat_conversations" &&
              q.queryKey[1] === inboxId,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inboxId, queryClient]);

  const conversations = (query.data?.pages ?? []).flatMap((p) => p.conversations);
  const hasMore = query.hasNextPage ?? false;
  const fetchNextPage = query.fetchNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;

  return {
    ...query,
    conversations,
    hasMore,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
    invalidate,
  };
}
