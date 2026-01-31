import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Service = Tables<"services">;
export type ServiceInsert = TablesInsert<"services">;
export type ServiceUpdate = TablesUpdate<"services">;

export function useServices(searchQuery?: string) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["services", organizationId, searchQuery],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("services")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function useService(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["service", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId || id === "novo") return null;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching service:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && !!organizationId && id !== "novo",
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (service: Omit<ServiceInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("services")
        .insert({
          ...service,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", organizationId] });
      toast.success("Serviço criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço");
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...service }: ServiceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("services")
        .update(service)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["service", data.id] });
      toast.success("Serviço atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating service:", error);
      toast.error("Erro ao atualizar serviço");
    },
  });
}
