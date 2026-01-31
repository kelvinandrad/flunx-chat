-- Drop the restrictive INSERT policy on organizations
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;

-- Create a PERMISSIVE INSERT policy (default behavior)
CREATE POLICY "Users can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (true);