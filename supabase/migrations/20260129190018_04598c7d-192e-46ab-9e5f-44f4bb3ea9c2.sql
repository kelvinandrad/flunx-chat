-- Drop the buggy policy
DROP POLICY IF EXISTS "Admins can insert members" ON public.organization_members;

-- Create a corrected policy that allows:
-- 1. Org admins to add members
-- 2. First member of an organization (the creator) to add themselves
CREATE POLICY "Admins can insert members"
ON public.organization_members
FOR INSERT
WITH CHECK (
  is_org_admin(auth.uid(), organization_id)
  OR (
    -- Allow first member if user is adding themselves
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
    )
  )
);