-- Fix: Organization member bootstrap policy - remove the dangerous bootstrap condition
-- The create_organization_with_owner RPC handles initial membership creation with SECURITY DEFINER
-- This policy should only allow admins to add new members
DROP POLICY IF EXISTS "Users can insert members" ON public.organization_members;

CREATE POLICY "Admins can insert members"
  ON public.organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (is_org_admin(auth.uid(), organization_id));

-- Fix: Organizations INSERT policy - restrict to authenticated users only
-- The actual creation happens through create_organization_with_owner RPC
-- This policy is a fallback and should still require authentication
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;

CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);