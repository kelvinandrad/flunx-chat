import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export function useProducts(searchQuery?: string) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["products", organizationId, searchQuery],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("products")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function useProduct(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["product", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId || id === "novo") return null;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && !!organizationId && id !== "novo",
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (product: Omit<ProductInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("products")
        .insert({
          ...product,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
      toast.success("Produto criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Erro ao criar produto");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...product }: ProductUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Erro ao atualizar produto");
    },
  });
}
