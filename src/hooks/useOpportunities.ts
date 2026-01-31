import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Opportunity = Tables<"opportunities">;
export type OpportunityInsert = TablesInsert<"opportunities">;
export type OpportunityUpdate = TablesUpdate<"opportunities">;

export type OpportunityWithRelations = Opportunity & {
  people?: { id: string; name: string; email: string | null; phone: string | null; company: string | null } | null;
  pipeline_stages?: { id: string; name: string; color: string | null; sort_order: number | null } | null;
  profiles?: { id: string; full_name: string | null; email: string | null } | null;
  offers?: { id: string; name: string } | null;
};

export function useOpportunities(filters?: { stageId?: string; ownerId?: string; search?: string }) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["opportunities", organizationId, filters],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("opportunities")
        .select(`
          *,
          people:person_id (id, name, email, phone, company),
          pipeline_stages:stage_id (id, name, color, sort_order),
          profiles:owner_id (id, full_name, email),
          offers:offer_id (id, name)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (filters?.stageId && filters.stageId !== "all") {
        query = query.eq("stage_id", filters.stageId);
      }

      if (filters?.ownerId && filters.ownerId !== "all") {
        query = query.eq("owner_id", filters.ownerId);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
      }

      return (data || []) as OpportunityWithRelations[];
    },
    enabled: !!organizationId,
  });
}

export function useOpportunity(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["opportunity", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId || id === "nova") return null;

      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          people:person_id (id, name, email, phone, company),
          pipeline_stages:stage_id (id, name, color, sort_order),
          profiles:owner_id (id, full_name, email),
          offers:offer_id (id, name)
        `)
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching opportunity:", error);
        throw error;
      }

      return data as OpportunityWithRelations;
    },
    enabled: !!id && !!organizationId && id !== "nova",
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (opportunity: Omit<OpportunityInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("opportunities")
        .insert({
          ...opportunity,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities", organizationId] });
      toast.success("Oportunidade criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating opportunity:", error);
      toast.error("Erro ao criar oportunidade");
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...opportunity }: OpportunityUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("opportunities")
        .update(opportunity)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["opportunity", data.id] });
      toast.success("Oportunidade atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating opportunity:", error);
      toast.error("Erro ao atualizar oportunidade");
    },
  });
}

export function useOpportunitiesByStage() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["opportunities_by_stage", organizationId],
    queryFn: async () => {
      if (!organizationId) return {};

      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          people:person_id (id, name),
          pipeline_stages:stage_id (id, name, color, sort_order),
          profiles:owner_id (id, full_name)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
      }

      // Group by stage_id
      const grouped: Record<string, OpportunityWithRelations[]> = {};
      for (const opp of (data || []) as OpportunityWithRelations[]) {
        const stageId = opp.stage_id;
        if (!grouped[stageId]) {
          grouped[stageId] = [];
        }
        grouped[stageId].push(opp);
      }

      return grouped;
    },
    enabled: !!organizationId,
  });
}
