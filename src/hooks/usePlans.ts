import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Plan = Tables<"plans">;
export type PlanInsert = TablesInsert<"plans">;
export type PlanUpdate = TablesUpdate<"plans">;

export function usePlans() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["plans", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("organization_id", organizationId)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching plans:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function usePlan(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["plan", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId) return null;

      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching plan:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && !!organizationId,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (plan: Omit<PlanInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("plans")
        .insert({
          ...plan,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", organizationId] });
      toast.success("Plano criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating plan:", error);
      toast.error("Erro ao criar plano");
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...plan }: PlanUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("plans")
        .update(plan)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["plan", data.id] });
      toast.success("Plano atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating plan:", error);
      toast.error("Erro ao atualizar plano");
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", id)
        .eq("organization_id", organizationId!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", organizationId] });
      toast.success("Plano removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting plan:", error);
      toast.error("Erro ao remover plano");
    },
  });
}
