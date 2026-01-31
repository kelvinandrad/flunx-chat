-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;

-- Create a simpler SELECT policy
CREATE POLICY "Members can view their organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (is_member_of(auth.uid(), id));

-- Create a function to create organization with member in one transaction
-- This uses SECURITY DEFINER to bypass RLS within the function
CREATE OR REPLACE FUNCTION public.create_organization_with_owner(
  p_name text,
  p_slug text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
  v_result json;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Insert the organization
  INSERT INTO public.organizations (name, slug)
  VALUES (p_name, p_slug)
  RETURNING id INTO v_org_id;

  -- Add user as owner
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (v_org_id, v_user_id, 'owner');

  -- Update user's current organization
  UPDATE public.profiles
  SET current_organization_id = v_org_id
  WHERE id = v_user_id;

  -- Return the created organization
  SELECT json_build_object(
    'id', o.id,
    'name', o.name,
    'slug', o.slug,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  ) INTO v_result
  FROM public.organizations o
  WHERE o.id = v_org_id;

  RETURN v_result;
END;
$$;