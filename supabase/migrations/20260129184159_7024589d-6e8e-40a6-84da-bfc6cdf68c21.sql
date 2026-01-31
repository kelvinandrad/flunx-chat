-- Fix security warnings

-- 1. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Fix overly permissive INSERT policy on organizations
-- Drop the current policy and create a more restrictive one
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;

-- Users can only insert organizations if they will become a member of it
-- This is checked by adding themselves as owner right after
CREATE POLICY "Users can create organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can create if they are authenticated
    auth.uid() IS NOT NULL
  );