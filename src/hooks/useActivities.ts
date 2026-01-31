import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Activity = Tables<"activities">;
export type ActivityInsert = TablesInsert<"activities">;
export type ActivityUpdate = TablesUpdate<"activities">;

export type ActivityWithRelations = Activity & {
  opportunities?: { id: string; name: string } | null;
  people?: { id: string; name: string } | null;
  profiles?: { id: string; full_name: string | null } | null;
};

export function useActivities(filters?: { type?: string; status?: string; ownerId?: string; search?: string }) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["activities", organizationId, filters],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("activities")
        .select(`
          *,
          opportunities:opportunity_id (id, name),
          people:person_id (id, name),
          profiles:owner_id (id, full_name)
        `)
        .eq("organization_id", organizationId)
        .order("due_at", { ascending: true });

      if (filters?.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.ownerId && filters.ownerId !== "all") {
        query = query.eq("owner_id", filters.ownerId);
      }

      if (filters?.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      return (data || []) as ActivityWithRelations[];
    },
    enabled: !!organizationId,
  });
}

export function useActivitiesByOpportunity(opportunityId: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["activities", "opportunity", opportunityId, organizationId],
    queryFn: async () => {
      if (!opportunityId || !organizationId) return [];

      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          profiles:owner_id (id, full_name)
        `)
        .eq("organization_id", organizationId)
        .eq("opportunity_id", opportunityId)
        .order("due_at", { ascending: true });

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      return (data || []) as ActivityWithRelations[];
    },
    enabled: !!opportunityId && !!organizationId,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (activity: Omit<ActivityInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("activities")
        .insert({
          ...activity,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", organizationId] });
      toast.success("Atividade criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating activity:", error);
      toast.error("Erro ao criar atividade");
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...activity }: ActivityUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("activities")
        .update(activity)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", organizationId] });
      toast.success("Atividade atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating activity:", error);
      toast.error("Erro ao atualizar atividade");
    },
  });
}
