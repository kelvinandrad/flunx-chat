import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PaymentMethod = Tables<"payment_methods">;
export type PaymentMethodInsert = TablesInsert<"payment_methods">;
export type PaymentMethodUpdate = TablesUpdate<"payment_methods">;

export type InstallmentRule = Tables<"installment_rules">;
export type InstallmentRuleInsert = TablesInsert<"installment_rules">;
export type InstallmentRuleUpdate = TablesUpdate<"installment_rules">;

// Payment Methods Hooks
export function usePaymentMethods() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["payment_methods", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching payment methods:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (method: Omit<PaymentMethodInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("payment_methods")
        .insert({
          ...method,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_methods", organizationId] });
      toast.success("Método de pagamento criado!");
    },
    onError: (error) => {
      console.error("Error creating payment method:", error);
      toast.error("Erro ao criar método de pagamento");
    },
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...method }: PaymentMethodUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("payment_methods")
        .update(method)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_methods", organizationId] });
      toast.success("Método de pagamento atualizado!");
    },
    onError: (error) => {
      console.error("Error updating payment method:", error);
      toast.error("Erro ao atualizar método de pagamento");
    },
  });
}

// Installment Rules Hooks
export function useInstallmentRules() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["installment_rules", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("installment_rules")
        .select("*")
        .eq("organization_id", organizationId)
        .order("installments_count", { ascending: true });

      if (error) {
        console.error("Error fetching installment rules:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
}

export function useCreateInstallmentRule() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (rule: Omit<InstallmentRuleInsert, "organization_id">) => {
      if (!organizationId) throw new Error("No organization selected");

      const { data, error } = await supabase
        .from("installment_rules")
        .insert({
          ...rule,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installment_rules", organizationId] });
      toast.success("Regra de parcelamento criada!");
    },
    onError: (error) => {
      console.error("Error creating installment rule:", error);
      toast.error("Erro ao criar regra de parcelamento");
    },
  });
}

export function useUpdateInstallmentRule() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...rule }: InstallmentRuleUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("installment_rules")
        .update(rule)
        .eq("id", id)
        .eq("organization_id", organizationId!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installment_rules", organizationId] });
      toast.success("Regra de parcelamento atualizada!");
    },
    onError: (error) => {
      console.error("Error updating installment rule:", error);
      toast.error("Erro ao atualizar regra de parcelamento");
    },
  });
}
