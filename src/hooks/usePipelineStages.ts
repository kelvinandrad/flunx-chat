import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PipelineStage = Tables<"pipeline_stages">;
export type PipelineStageInsert = TablesInsert<"pipeline_stages">;
export type PipelineStageUpdate = TablesUpdate<"pipeline_stages">;

const DEFAULT_STAGES = [
  { name: "Descoberta", sort_order: 0, color: "bg-muted" },
  { name: "Qualificação", sort_order: 1, color: "bg-blue-500" },
  { name: "Proposta Enviada", sort_order: 2, color: "bg-amber-500" },
  { name: "Negociação", sort_order: 3, color: "bg-purple-500" },
  { name: "Fechamento", sort_order: 4, color: "bg-emerald-500" },
];

export function usePipelineStages() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["pipeline_stages", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq("organization_id", organizationId)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching pipeline stages:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function useCreatePipelineStage() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (stage: Omit<PipelineStageInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("pipeline_stages")
        .insert({
          ...stage,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", organizationId] });
      toast.success("Etapa criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating pipeline stage:", error);
      toast.error("Erro ao criar etapa");
    },
  });
}

export function useUpdatePipelineStage() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...stage }: PipelineStageUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("pipeline_stages")
        .update(stage)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", organizationId] });
      toast.success("Etapa atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating pipeline stage:", error);
      toast.error("Erro ao atualizar etapa");
    },
  });
}

export function useSeedDefaultStages() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error("No organization selected");

      // Check if stages already exist
      const { data: existing } = await supabase
        .from("pipeline_stages")
        .select("id")
        .eq("organization_id", organizationId)
        .limit(1);

      if (existing && existing.length > 0) {
        return existing;
      }

      // Create default stages
      const { data, error } = await supabase
        .from("pipeline_stages")
        .insert(
          DEFAULT_STAGES.map((stage) => ({
            ...stage,
            organization_id: organizationId,
          }))
        )
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline_stages", organizationId] });
    },
  });
}
