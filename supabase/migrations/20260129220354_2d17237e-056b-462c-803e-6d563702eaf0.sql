-- =====================================================
-- LAYER 3: Offers and CRM (Commercial)
-- =====================================================

-- 1. PIPELINE STAGES TABLE
CREATE TABLE public.pipeline_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for pipeline_stages
CREATE INDEX idx_pipeline_stages_org ON public.pipeline_stages(organization_id);
CREATE INDEX idx_pipeline_stages_org_sort ON public.pipeline_stages(organization_id, sort_order);

-- RLS for pipeline_stages
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipeline stages from their organizations"
  ON public.pipeline_stages FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create pipeline stages in their organizations"
  ON public.pipeline_stages FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update pipeline stages in their organizations"
  ON public.pipeline_stages FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete pipeline stages from their organizations"
  ON public.pipeline_stages FOR DELETE
  USING (is_org_admin(auth.uid(), organization_id));

-- Trigger for updated_at
CREATE TRIGGER update_pipeline_stages_updated_at
  BEFORE UPDATE ON public.pipeline_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. OFFERS TABLE
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  offer_type TEXT,
  price NUMERIC(12,2),
  currency TEXT DEFAULT 'BRL',
  recurrence TEXT,
  status TEXT DEFAULT 'active',
  headline TEXT,
  benefits TEXT,
  channels TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for offers
CREATE INDEX idx_offers_org ON public.offers(organization_id);
CREATE INDEX idx_offers_org_status ON public.offers(organization_id, status);
CREATE INDEX idx_offers_product ON public.offers(product_id);
CREATE INDEX idx_offers_service ON public.offers(service_id);

-- RLS for offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offers from their organizations"
  ON public.offers FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create offers in their organizations"
  ON public.offers FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update offers in their organizations"
  ON public.offers FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete offers from their organizations"
  ON public.offers FOR DELETE
  USING (is_org_admin(auth.uid(), organization_id));

-- Trigger for updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. OPPORTUNITIES TABLE
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.pipeline_stages(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  value NUMERIC(12,2),
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  origin TEXT,
  expected_close_at DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for opportunities
CREATE INDEX idx_opportunities_org ON public.opportunities(organization_id);
CREATE INDEX idx_opportunities_person ON public.opportunities(person_id);
CREATE INDEX idx_opportunities_stage ON public.opportunities(stage_id);
CREATE INDEX idx_opportunities_owner ON public.opportunities(owner_id);
CREATE INDEX idx_opportunities_org_stage ON public.opportunities(organization_id, stage_id);

-- RLS for opportunities
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view opportunities from their organizations"
  ON public.opportunities FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create opportunities in their organizations"
  ON public.opportunities FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update opportunities in their organizations"
  ON public.opportunities FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete opportunities from their organizations"
  ON public.opportunities FOR DELETE
  USING (is_org_admin(auth.uid(), organization_id));

-- Trigger for updated_at
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. ACTIVITIES TABLE
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for activities
CREATE INDEX idx_activities_org ON public.activities(organization_id);
CREATE INDEX idx_activities_opportunity ON public.activities(opportunity_id);
CREATE INDEX idx_activities_person ON public.activities(person_id);
CREATE INDEX idx_activities_owner ON public.activities(owner_id);
CREATE INDEX idx_activities_status ON public.activities(organization_id, status);

-- RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities from their organizations"
  ON public.activities FOR SELECT
  USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create activities in their organizations"
  ON public.activities FOR INSERT
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update activities in their organizations"
  ON public.activities FOR UPDATE
  USING (is_member_of(auth.uid(), organization_id))
  WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete activities from their organizations"
  ON public.activities FOR DELETE
  USING (is_org_admin(auth.uid(), organization_id));