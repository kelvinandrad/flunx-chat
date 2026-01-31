import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Person = Tables<"people">;
export type PersonInsert = TablesInsert<"people">;
export type PersonUpdate = TablesUpdate<"people">;

export function usePeople(searchQuery?: string) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["people", organizationId, searchQuery],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("people")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        const search = `%${searchQuery.trim()}%`;
        query = query.or(`name.ilike.${search},email.ilike.${search},phone.ilike.${search}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching people:", error);
        throw error;
      }

      return data as Person[];
    },
    enabled: !!organizationId,
  });
}

export function usePerson(id: string | undefined) {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["person", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId) return null;

      const { data, error } = await supabase
        .from("people")
        .select("*")
        .eq("id", id)
        .eq("organization_id", organizationId)
        .single();

      if (error) {
        console.error("Error fetching person:", error);
        throw error;
      }

      return data as Person;
    },
    enabled: !!id && !!organizationId,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (person: Omit<PersonInsert, "organization_id">) => {
      if (!organizationId) {
        throw new Error("No organization selected");
      }

      const { data, error } = await supabase
        .from("people")
        .insert({
          ...person,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating person:", error);
        throw error;
      }

      return data as Person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people", organizationId] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PersonUpdate & { id: string }) => {
      if (!organizationId) {
        throw new Error("No organization selected");
      }

      const { data, error } = await supabase
        .from("people")
        .update(updates)
        .eq("id", id)
        .eq("organization_id", organizationId)
        .select()
        .single();

      if (error) {
        console.error("Error updating person:", error);
        throw error;
      }

      return data as Person;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["people", organizationId] });
      queryClient.invalidateQueries({ queryKey: ["person", data.id, organizationId] });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  const { organizationId } = useTenant();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!organizationId) {
        throw new Error("No organization selected");
      }

      const { error } = await supabase
        .from("people")
        .delete()
        .eq("id", id)
        .eq("organization_id", organizationId);

      if (error) {
        console.error("Error deleting person:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people", organizationId] });
    },
  });
}
