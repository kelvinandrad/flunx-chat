/**
 * Hooks para dados do painel do contato: notas, propostas, agendamentos, lembretes.
 * Usa Supabase diretamente (RLS).
 */
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ---- NOTAS ----

export function useContactNotes(contactId: string | null | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat_contact_notes", contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("contactId required");
      const { data, error } = await supabase
        .from("chat_contact_notes")
        .select("*, author:profiles(id, full_name, avatar_url)")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!contactId,
  });

  const addNote = useMutation({
    mutationFn: async ({ contactId, organizationId, content }: { contactId: string; organizationId: string; content: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("chat_contact_notes")
        .insert({ contact_id: contactId, organization_id: organizationId, author_id: user.id, content })
        .select("*, author:profiles(id, full_name, avatar_url)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_contact_notes", contactId] }),
  });

  const editNote = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      const { error } = await supabase.from("chat_contact_notes").update({ content }).eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_contact_notes", contactId] }),
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("chat_contact_notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_contact_notes", contactId] }),
  });

  const togglePinNote = useMutation({
    mutationFn: async ({ noteId, isPinned }: { noteId: string; isPinned: boolean }) => {
      const { error } = await supabase.from("chat_contact_notes").update({ is_pinned: !isPinned }).eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_contact_notes", contactId] }),
  });

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addNote,
    editNote,
    deleteNote,
    togglePinNote,
  };
}

// ---- PROPOSTAS ----

export function useContactProposals(contactId: string | null | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat_proposals", contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("contactId required");
      const { data, error } = await supabase
        .from("chat_proposals")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!contactId,
  });

  const createProposal = useMutation({
    mutationFn: async ({ contactId, organizationId, proposal }: any) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("chat_proposals")
        .insert({
          contact_id: contactId,
          organization_id: organizationId,
          author_id: user.id,
          title: proposal.title,
          total_value: proposal.totalValue ?? 0,
          items: proposal.items ?? [],
          status: "draft",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_proposals", contactId] }),
  });

  const sendProposal = useMutation({
    mutationFn: async (proposalId: string) => {
      const { error } = await supabase
        .from("chat_proposals")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", proposalId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_proposals", contactId] }),
  });

  const closeProposal = useMutation({
    mutationFn: async ({ proposalId, status }: { proposalId: string; status: "accepted" | "rejected" }) => {
      const { error } = await supabase.from("chat_proposals").update({ status }).eq("id", proposalId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_proposals", contactId] }),
  });

  return {
    proposals: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProposal,
    sendProposal,
    closeProposal,
  };
}

// ---- MENSAGENS AGENDADAS ----

export function useScheduledMessages(contactId: string | null | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat_scheduled_messages", contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("contactId required");
      const { data, error } = await supabase
        .from("chat_scheduled_messages")
        .select("*")
        .eq("contact_id", contactId)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!contactId,
  });

  const scheduleMessage = useMutation({
    mutationFn: async ({ contactId, organizationId, conversationId, message }: any) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("chat_scheduled_messages")
        .insert({
          contact_id: contactId,
          conversation_id: conversationId ?? null,
          organization_id: organizationId,
          author_id: user.id,
          content: message.content,
          scheduled_at: message.scheduledAt,
          type: message.type ?? "follow-up",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_scheduled_messages", contactId] }),
  });

  const cancelMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("chat_scheduled_messages")
        .update({ status: "cancelled" })
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_scheduled_messages", contactId] }),
  });

  return {
    scheduledMessages: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    scheduleMessage,
    cancelMessage,
  };
}

// ---- LEMBRETES ----

export function useReminders(contactId: string | null | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat_reminders", contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("contactId required");
      const { data, error } = await supabase
        .from("chat_reminders")
        .select("*")
        .eq("contact_id", contactId)
        .order("due_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!contactId,
  });

  const createReminder = useMutation({
    mutationFn: async ({ contactId, organizationId, reminder }: any) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("chat_reminders")
        .insert({
          contact_id: contactId,
          organization_id: organizationId,
          author_id: user.id,
          title: reminder.title,
          description: reminder.description ?? null,
          due_at: reminder.dueAt,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_reminders", contactId] }),
  });

  const completeReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from("chat_reminders")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", reminderId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat_reminders", contactId] }),
  });

  return {
    reminders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createReminder,
    completeReminder,
  };
}
