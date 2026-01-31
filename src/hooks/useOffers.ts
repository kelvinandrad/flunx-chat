import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Offer = Tables<"offers">;
export type OfferInsert = TablesInsert<"offers">;
export type OfferUpdate = TablesUpdate<"offers">;

export type OfferWithRelations = Offer & {
  products?: { id: string; name: string } | null;
  services?: { id: string; name: string } | null;
  plans?: { id: string; name: string } | null;
};

export function useOffers(status?: string) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["offers", organizationId, status],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("offers")
        .select(`
          *,
          products:product_id (id, name),
          services:service_id (id, name),
          plans:plan_id (id, name)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching offers:", error);
        throw error;
      }

      return (data || []) as OfferWithRelations[];
    },
    enabled: !!organizationId,
  });
}

export function useOffer(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["offer", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId || id === "nova") return null;

      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          products:product_id (id, name),
          services:service_id (id, name),
          plans:plan_id (id, name)
        `)
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching offer:", error);
        throw error;
      }

      return data as OfferWithRelations;
    },
    enabled: !!id && !!organizationId && id !== "nova",
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (offer: Omit<OfferInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("offers")
        .insert({
          ...offer,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers", organizationId] });
      toast.success("Oferta criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating offer:", error);
      toast.error("Erro ao criar oferta");
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...offer }: OfferUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("offers")
        .update(offer)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["offers", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["offer", data.id] });
      toast.success("Oferta atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating offer:", error);
      toast.error("Erro ao atualizar oferta");
    },
  });
}
