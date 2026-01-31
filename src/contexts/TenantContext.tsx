import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationMembership {
  id: string;
  organization_id: string;
  role: "owner" | "admin" | "member";
  organizations: Organization;
}

interface TenantContextType {
  organization: Organization | null;
  organizationId: string | null;
  memberships: OrganizationMembership[];
  loading: boolean;
  /** true apenas após resposta bem-sucedida da API; evita redirect errado para create-organization */
  membershipsFetched: boolean;
  setOrganization: (org: Organization) => Promise<void>;
  refreshMemberships: () => Promise<void>;
  userRole: "owner" | "admin" | "member" | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipsFetched, setMembershipsFetched] = useState(false);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member" | null>(null);

  const refreshMemberships = async () => {
    if (!user) {
      setMemberships([]);
      setOrganizationState(null);
      setUserRole(null);
      setMembershipsFetched(false);
      setLoading(false);
      return;
    }

    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from("organization_members")
        .select(`
          id,
          organization_id,
          role,
          organizations (
            id,
            name,
            slug,
            created_at,
            updated_at
          )
        `)
        .eq("user_id", user.id);

      if (membershipError) {
        console.error("Error fetching memberships:", membershipError);
        setMembershipsFetched(false);
        setLoading(false);
        return;
      }

      const typedMemberships = (membershipData || []) as unknown as OrganizationMembership[];
      setMemberships(typedMemberships);
      setMembershipsFetched(true);

      if (typedMemberships.length > 0) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_organization_id")
          .eq("id", user.id)
          .single();

        let currentMembership = typedMemberships[0];
        if (profile?.current_organization_id) {
          const found = typedMemberships.find(
            m => m.organization_id === profile.current_organization_id
          );
          if (found) {
            currentMembership = found;
          }
        }

        setOrganizationState(currentMembership.organizations);
        setUserRole(currentMembership.role);
      } else {
        setOrganizationState(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error in refreshMemberships:", error);
      setMembershipsFetched(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      refreshMemberships();
    } else {
      setMemberships([]);
      setOrganizationState(null);
      setUserRole(null);
      setMembershipsFetched(false);
      setLoading(false);
    }
  }, [session, user?.id]);

  const setOrganization = async (org: Organization) => {
    if (!user) return;

    // Update the current_organization_id in profiles
    await supabase
      .from("profiles")
      .update({ current_organization_id: org.id })
      .eq("id", user.id);

    // Find the membership for this org to get the role
    const membership = memberships.find(m => m.organization_id === org.id);
    
    setOrganizationState(org);
    setUserRole(membership?.role ?? null);
  };

  return (
    <TenantContext.Provider
      value={{
        organization,
        organizationId: organization?.id ?? null,
        memberships,
        loading,
        membershipsFetched,
        setOrganization,
        refreshMemberships,
        userRole,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
