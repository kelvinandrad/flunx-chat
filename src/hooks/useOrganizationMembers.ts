import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

export type OrganizationMemberWithProfile = {
  id: string;
  user_id: string;
  organization_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
};

export function useOrganizationMembers() {
  const { organizationId } = useTenant();

  return useQuery({
    queryKey: ["organization_members", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("organization_members")
        .select(`
          id,
          user_id,
          organization_id,
          role,
          created_at,
          profiles:user_id (id, full_name, email, avatar_url)
        `)
        .eq("organization_id", organizationId);

      if (error) {
        console.error("Error fetching organization members:", error);
        throw error;
      }

      return (data || []) as OrganizationMemberWithProfile[];
    },
    enabled: !!organizationId,
  });
}
