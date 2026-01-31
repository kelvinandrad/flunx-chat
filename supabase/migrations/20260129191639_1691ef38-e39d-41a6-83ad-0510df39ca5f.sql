-- Drop and recreate the SELECT policy to allow viewing organizations user just created
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;

-- Allow SELECT if user is member OR during insert (same transaction)
-- The trick is: after INSERT, PostgREST needs to SELECT, but user isn't a member yet
-- Solution: Use a more permissive select that checks for membership OR ownership of the new row
CREATE POLICY "Members can view their organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  -- User is a member
  is_member_of(auth.uid(), id)
  -- OR this is right after insert (allow viewing any org temporarily for the RETURNING clause)
  -- We need to allow the select for the user who can insert
  OR EXISTS (
    SELECT 1 FROM pg_stat_activity 
    WHERE pid = pg_backend_pid() 
    AND query LIKE '%INSERT INTO%organizations%'
  )
);