-- ============================================
-- CAMADA 2: CATÁLOGO E ESTRUTURA
-- Tabelas: products, services, plans, payment_methods, installment_rules
-- ============================================

-- ============================================
-- 1. TABELA: products
-- ============================================
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  sku text,
  type text, -- assinatura, servico, digital, setup, fisico
  billing_model text, -- one-time, recorrente, hibrido
  delivery_type text, -- digital, humano, automatico, hibrido
  delivery_duration_value int,
  delivery_duration_unit text, -- imediato, horas, dias, semanas
  status text DEFAULT 'active',
  can_upsell boolean DEFAULT true,
  can_downsell boolean DEFAULT true,
  can_standalone boolean DEFAULT true,
  can_bundle boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para products
CREATE INDEX idx_products_organization_id ON public.products(organization_id);
CREATE INDEX idx_products_org_status ON public.products(organization_id, status);
CREATE INDEX idx_products_org_created ON public.products(organization_id, created_at);

-- RLS para products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products from their organizations"
ON public.products FOR SELECT
USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create products in their organizations"
ON public.products FOR INSERT
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update products in their organizations"
ON public.products FOR UPDATE
USING (is_member_of(auth.uid(), organization_id))
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete products from their organizations"
ON public.products FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));

-- Trigger updated_at para products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. TABELA: services
-- ============================================
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  duration text, -- ex: "40 horas", "Mensal"
  delivery text, -- Humano, Híbrido
  status text DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para services
CREATE INDEX idx_services_organization_id ON public.services(organization_id);
CREATE INDEX idx_services_org_status ON public.services(organization_id, status);

-- RLS para services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services from their organizations"
ON public.services FOR SELECT
USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create services in their organizations"
ON public.services FOR INSERT
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update services in their organizations"
ON public.services FOR UPDATE
USING (is_member_of(auth.uid(), organization_id))
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete services from their organizations"
ON public.services FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));

-- Trigger updated_at para services
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. TABELA: plans
-- ============================================
CREATE TABLE public.plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(12,2),
  currency text DEFAULT 'BRL',
  period text, -- mês, trimestre, ano
  is_popular boolean DEFAULT false,
  features jsonb DEFAULT '[]'::jsonb,
  limitations jsonb DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para plans
CREATE INDEX idx_plans_organization_id ON public.plans(organization_id);
CREATE INDEX idx_plans_org_sort ON public.plans(organization_id, sort_order);

-- RLS para plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view plans from their organizations"
ON public.plans FOR SELECT
USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create plans in their organizations"
ON public.plans FOR INSERT
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update plans in their organizations"
ON public.plans FOR UPDATE
USING (is_member_of(auth.uid(), organization_id))
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete plans from their organizations"
ON public.plans FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));

-- Trigger updated_at para plans
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. TABELA: payment_methods
-- ============================================
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code text NOT NULL, -- credit_card, boleto, pix, transfer
  name text NOT NULL,
  enabled boolean DEFAULT true,
  max_installments int DEFAULT 1,
  fee_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para payment_methods
CREATE INDEX idx_payment_methods_organization_id ON public.payment_methods(organization_id);

-- RLS para payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payment methods from their organizations"
ON public.payment_methods FOR SELECT
USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create payment methods in their organizations"
ON public.payment_methods FOR INSERT
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update payment methods in their organizations"
ON public.payment_methods FOR UPDATE
USING (is_member_of(auth.uid(), organization_id))
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete payment methods from their organizations"
ON public.payment_methods FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));

-- Trigger updated_at para payment_methods
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. TABELA: installment_rules
-- ============================================
CREATE TABLE public.installment_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  installments_count int NOT NULL DEFAULT 1, -- 1 = à vista, 2-12
  discount_percent numeric(5,2) DEFAULT 0,
  min_value numeric(12,2) DEFAULT 0,
  enabled boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para installment_rules
CREATE INDEX idx_installment_rules_organization_id ON public.installment_rules(organization_id);

-- RLS para installment_rules
ALTER TABLE public.installment_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view installment rules from their organizations"
ON public.installment_rules FOR SELECT
USING (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can create installment rules in their organizations"
ON public.installment_rules FOR INSERT
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Users can update installment rules in their organizations"
ON public.installment_rules FOR UPDATE
USING (is_member_of(auth.uid(), organization_id))
WITH CHECK (is_member_of(auth.uid(), organization_id));

CREATE POLICY "Admins can delete installment rules from their organizations"
ON public.installment_rules FOR DELETE
USING (is_org_admin(auth.uid(), organization_id));