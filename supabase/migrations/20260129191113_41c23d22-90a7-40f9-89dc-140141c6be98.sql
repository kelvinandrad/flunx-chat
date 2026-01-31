-- Drop ALL existing policies on organizations table
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admins can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;

-- Recreate policies as PERMISSIVE (default) with explicit authenticated role
CREATE POLICY "Users can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Members can view their organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (is_member_of(auth.uid(), id));

CREATE POLICY "Admins can update their organizations"
ON public.organizations
FOR UPDATE
TO authenticated
USING (is_org_admin(auth.uid(), id))
WITH CHECK (is_org_admin(auth.uid(), id));

-- Drop ALL existing policies on organization_members table
DROP POLICY IF EXISTS "Admins can insert members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can delete members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON public.organization_members;

-- Recreate organization_members policies as PERMISSIVE
-- INSERT: Allow admins OR first member (bootstrapping)
CREATE POLICY "Users can insert members"
ON public.organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- Either user is an admin of the org
  is_org_admin(auth.uid(), organization_id)
  OR (
    -- Or this is the first member (bootstrapping) and inserting themselves
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.organization_members om 
      WHERE om.organization_id = organization_members.organization_id
    )
  )
);

-- SELECT: Users can view their own memberships
CREATE POLICY "Users can view own memberships"
ON public.organization_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- UPDATE: Only admins
CREATE POLICY "Admins can update members"
ON public.organization_members
FOR UPDATE
TO authenticated
USING (is_org_admin(auth.uid(), organization_id))
WITH CHECK (is_org_admin(auth.uid(), organization_id));

-- DELETE: Only admins
CREATE POLICY "Admins can delete members"
ON public.organization_members
FOR DELETE
TO authenticated
USING (is_org_admin(auth.uid(), organization_id));