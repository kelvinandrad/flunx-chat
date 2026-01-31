-- Create people table
CREATE TABLE public.people (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  whatsapp text,
  document text,
  company text,
  avatar_url text,
  status text DEFAULT 'Ativo',
  origin text,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_people_organization_id ON public.people(organization_id);
CREATE INDEX idx_people_org_email ON public.people(organization_id, email);
CREATE INDEX idx_people_org_created ON public.people(organization_id, created_at DESC);
CREATE INDEX idx_people_org_name ON public.people(organization_id, name);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- SELECT: Users can view people from organizations they are members of
CREATE POLICY "Users can view people from their organizations"
  ON public.people
  FOR SELECT
  USING (public.is_member_of(auth.uid(), organization_id));

-- INSERT: Users can create people in organizations they are members of
CREATE POLICY "Users can create people in their organizations"
  ON public.people
  FOR INSERT
  WITH CHECK (public.is_member_of(auth.uid(), organization_id));

-- UPDATE: Users can update people in organizations they are members of
CREATE POLICY "Users can update people in their organizations"
  ON public.people
  FOR UPDATE
  USING (public.is_member_of(auth.uid(), organization_id))
  WITH CHECK (public.is_member_of(auth.uid(), organization_id));

-- DELETE: Only admins can delete people from their organizations
CREATE POLICY "Admins can delete people from their organizations"
  ON public.people
  FOR DELETE
  USING (public.is_org_admin(auth.uid(), organization_id));