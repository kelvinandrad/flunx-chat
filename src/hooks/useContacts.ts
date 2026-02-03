import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listContacts } from "@/lib/chat-api";
import type { ListContactsResponse } from "@/lib/chat-api-types";

const DEFAULT_LIMIT = 50;

export function useContacts(inboxId: string | null | undefined) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const token = session?.access_token ?? null;

  const query = useInfiniteQuery({
    queryKey: ["chat_contacts", inboxId],
    queryFn: async ({
      pageParam,
    }: {
      pageParam?: string | null;
    }): Promise<ListContactsResponse> => {
      if (!inboxId || !token) throw new Error("inboxId and auth required");
      return listContacts(inboxId, token, {
        limit: DEFAULT_LIMIT,
        before: pageParam ?? undefined,
      });
    },
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.cursor : undefined),
    initialPageParam: null as string | null,
    enabled: !!inboxId && !!token,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["chat_contacts", inboxId] });

  const contacts = (query.data?.pages ?? []).flatMap((p) => p.contacts);
  const hasMore = query.hasNextPage ?? false;
  const fetchNextPage = query.fetchNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;

  return {
    ...query,
    contacts,
    hasMore,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
    invalidate,
  };
}
