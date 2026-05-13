-- ═══════════════════════════════════════════════════════════════════════════════
-- YELK FINANCE — Complete Database Schema
-- Project: yelk-saas (hiojwzvucapbiwlyycgs)
-- Run this on a fresh Supabase project to set up the full schema.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('klant', 'admin');
CREATE TYPE customer_status AS ENUM ('actief', 'proef', 'geannuleerd', 'openstaand');
CREATE TYPE payment_status AS ENUM ('betaald', 'openstaand', 'mislukt', 'terugbetaald');
CREATE TYPE plan_key AS ENUM ('start', 'groei', 'pro');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
CREATE TYPE payment_provider AS ENUM ('stripe', 'mollie', 'manual');
CREATE TYPE document_kind AS ENUM ('bon', 'factuur', 'bankafschrift', 'overig');
CREATE TYPE transaction_direction AS ENUM ('in', 'out');
CREATE TYPE vat_return_status AS ENUM ('concept', 'ingediend', 'betaald');

-- ─── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  full_name  text,
  role       user_role NOT NULL DEFAULT 'klant',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gebruiker leest eigen profiel" ON public.profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Gebruiker bewerkt eigen profiel" ON public.profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin leest alle profielen" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Packages ─────────────────────────────────────────────────────────────────
CREATE TABLE public.packages (
  key               plan_key PRIMARY KEY,
  name              text NOT NULL,
  monthly_price_eur numeric NOT NULL,
  setup_fee_eur     numeric NOT NULL DEFAULT 199,
  features          text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Iedereen leest pakketten" ON public.packages FOR SELECT USING (true);

INSERT INTO public.packages (key, name, monthly_price_eur, setup_fee_eur, features) VALUES
  ('start', 'Yelk Start', 99.00, 199.00, ARRAY[
    'Facturatie en klantenbeheer',
    'Bonnen scannen (OCR)',
    'Bankkoppeling voorbereid',
    'WhatsApp-support'
  ]),
  ('groei', 'Yelk Groei', 150.00, 199.00, ARRAY[
    'Alles uit Start',
    'Yelk AI assistent',
    'Bankkoppelingen actief',
    'Aangiftevoorbereiding'
  ]),
  ('pro', 'Yelk E-commerce', 199.00, 199.00, ARRAY[
    'Alles uit Groei',
    'Maandelijkse rapportages',
    'Audit-export',
    'Prioriteit ondersteuning'
  ]);

-- ─── Customers ────────────────────────────────────────────────────────────────
CREATE TABLE public.customers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name   text NOT NULL,
  contact_name   text,
  email          text,
  phone          text,
  vat_number     text,
  kvk_number     text,
  status         customer_status NOT NULL DEFAULT 'openstaand',
  payment_status payment_status NOT NULL DEFAULT 'openstaand',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant leest eigen klantprofiel" ON public.customers
  FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Klant bewerkt eigen klantprofiel" ON public.customers
  FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admin leest alle klanten" ON public.customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Subscriptions ────────────────────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id             uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  plan_key                plan_key NOT NULL,
  status                  subscription_status NOT NULL DEFAULT 'trialing',
  provider                payment_provider NOT NULL DEFAULT 'manual',
  provider_subscription_id text,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_plan FOREIGN KEY (plan_key) REFERENCES public.packages(key)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant leest eigen abonnement" ON public.subscriptions
  FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admin beheert abonnementen" ON public.subscriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Documents ────────────────────────────────────────────────────────────────
CREATE TABLE public.documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  uploaded_by  uuid NOT NULL REFERENCES public.profiles(id),
  kind         document_kind NOT NULL DEFAULT 'bon',
  file_name    text NOT NULL,
  storage_path text NOT NULL,
  size_bytes   bigint NOT NULL DEFAULT 0,
  mime_type    text NOT NULL DEFAULT 'application/octet-stream',
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant beheert eigen documenten" ON public.documents
  FOR ALL USING (
    customer_id IN (SELECT id FROM public.customers WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admin beheert alle documenten" ON public.documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Invoices ─────────────────────────────────────────────────────────────────
CREATE TABLE public.invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  invoice_number    text NOT NULL,
  amount_eur        numeric NOT NULL DEFAULT 0,
  status            text NOT NULL DEFAULT 'open' CHECK (status IN ('open','paid','overdue','canceled')),
  due_date          date,
  paid_at           timestamptz,
  mollie_payment_id text,
  description       text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant leest eigen facturen" ON public.invoices
  FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admin beheert alle facturen" ON public.invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text NOT NULL,
  message    text NOT NULL,
  kind       text NOT NULL DEFAULT 'info' CHECK (kind IN ('info','warning','error','success')),
  read       boolean NOT NULL DEFAULT false,
  link       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gebruiker beheert eigen meldingen" ON public.notifications
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admin beheert alle meldingen" ON public.notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Transactions ─────────────────────────────────────────────────────────────
CREATE TABLE public.transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booked_on   date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount_eur  numeric NOT NULL DEFAULT 0,
  vat_eur     numeric NOT NULL DEFAULT 0,
  category    text,
  direction   transaction_direction NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant leest eigen transacties" ON public.transactions
  FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE owner_id = auth.uid())
  );
CREATE POLICY "Admin beheert alle transacties" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Support tickets ──────────────────────────────────────────────────────────
CREATE TABLE public.support_tickets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     text NOT NULL,
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  priority    text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Klant beheert eigen tickets" ON public.support_tickets
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admin beheert alle tickets" ON public.support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_customers_owner_id ON public.customers(owner_id);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_payment_status ON public.customers(payment_status);
CREATE INDEX idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_documents_customer_id ON public.documents(customer_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', false, 10485760,
  ARRAY['application/pdf','image/jpeg','image/png','image/webp',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Klant uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.customers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Klant downloads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.customers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Klant verwijdert" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.customers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Admin storage" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
