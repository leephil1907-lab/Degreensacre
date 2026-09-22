-- ============================================
-- De-Greenacres — Seed agencies, agents, developments
-- Run in Supabase Dashboard → SQL Editor
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================
-- Requires: pgcrypto or uuid-ossp (either works)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1) AGENCIES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agencies are viewable by everyone" ON public.agencies;
CREATE POLICY "Agencies are viewable by everyone" ON public.agencies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated can insert agencies" ON public.agencies;
CREATE POLICY "Authenticated can insert agencies" ON public.agencies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Owners can update agencies" ON public.agencies;
CREATE POLICY "Owners can update agencies" ON public.agencies FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- 2) AGENTS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  photo_url TEXT,
  bio TEXT,
  title TEXT,
  specialization TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agents are viewable by everyone" ON public.agents;
CREATE POLICY "Agents are viewable by everyone" ON public.agents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated can insert agents" ON public.agents;
CREATE POLICY "Authenticated can insert agents" ON public.agents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Owners can update agents" ON public.agents;
CREATE POLICY "Owners can update agents" ON public.agents FOR UPDATE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_agents_agency_id ON public.agents(agency_id);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON public.agencies(slug);
CREATE INDEX IF NOT EXISTS idx_agencies_verified ON public.agencies(is_verified);

-- ============================================
-- 3) SEED AGENCIES (2)
-- ============================================
INSERT INTO public.agencies (id, slug, name, description, logo_url, cover_image_url, email, phone, whatsapp, address, city, state, is_verified, is_featured)
VALUES
  (
    'a11a11a1-1111-4111-a111-111111111111'::uuid,
    'de-greenacres-properties-limited',
    'De-Greenacres Properties Limited',
    'Nigeria''s trusted property intelligence platform. Homes, land and investment opportunities — documentation reviewed. CAC RC: 1856064.',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'degreenacrespropertieslimited@gmail.com',
    '+2348065019971',
    '+2347041754800',
    'Shelter Afrique Extension, Uyo',
    'Uyo',
    'Akwa Ibom',
    true,
    true
  ),
  (
    'a22a22a2-2222-4222-a222-222222222222'::uuid,
    'prime-estates-abuja',
    'Prime Estates Abuja',
    'Abuja-based agency specializing in luxury sales, lettings and development advisory across FCT.',
    'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'hello@primeestates-abuja.ng',
    '+2348035000001',
    '+2348035000002',
    'Central Business District, Abuja',
    'Abuja',
    'FCT',
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_verified = EXCLUDED.is_verified,
  updated_at = now();

-- ============================================
-- 4) SEED AGENTS (3) — linked to De-Greenacres agency
-- Note: user_id left NULL until real auth profiles are linked.
-- Property ownership linkage: properties.owner_id = agents.user_id (profiles.id).
-- After creating auth users, update agents.user_id to match.
-- ============================================
INSERT INTO public.agents (id, slug, agency_id, user_id, name, email, phone, whatsapp, photo_url, bio, title, specialization, is_verified, is_featured)
VALUES
  (
    'b11b11b1-1111-4111-b111-111111111111'::uuid,
    'chisom-okonkwo',
    'a11a11a1-1111-4111-a111-111111111111'::uuid,
    NULL,
    'Chisom Okonkwo',
    'chisom@degreenacres.ng',
    '+2347041754800',
    '+2347041754800',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'Lead sales agent — Lekki & Victoria Island. 8+ years, 300+ closings, documentation & site inspection specialist.',
    'Senior Sales Agent',
    'Lagos Luxury & Investment',
    true,
    true
  ),
  (
    'b22b22b2-2222-4222-b222-222222222222'::uuid,
    'tunde-adebayo',
    'a11a11a1-1111-4111-a111-111111111111'::uuid,
    NULL,
    'Tunde Adebayo',
    'tunde@degreenacres.ng',
    '+2348065019971',
    '+2348065019972',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'Uyo & Calabar corridor specialist — land investment, new Coastal Highway plots, title verification.',
    'Land Investment Specialist',
    'Land & Coastal Highway',
    true,
    true
  ),
  (
    'b33b33b3-3333-4333-b333-333333333333'::uuid,
    'amina-bello',
    'a22a22a2-2222-4222-a222-222222222222'::uuid,
    NULL,
    'Amina Bello',
    'amina@primeestates-abuja.ng',
    '+2348035000003',
    '+2348035000004',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    'Abuja FCT lead — Maitama, Asokoro, Wuse. Verified documentation & diaspora buyer advisory.',
    'Lead Agent, Abuja',
    'FCT Luxury',
    true,
    false
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  agency_id = EXCLUDED.agency_id,
  is_verified = EXCLUDED.is_verified,
  updated_at = now();

-- ============================================
-- 5) SEED DEVELOPMENTS (2) — if table exists
-- Uses existing public.developments schema
-- ============================================
INSERT INTO public.developments (id, slug, name, developer, description, location, state, status, completion_date, total_units, available_units, unit_types, amenities, payment_plans, gallery, features, documentation, site_inspection, featured)
VALUES
  (
    'd11d11d1-1111-4111-d111-111111111111'::uuid,
    'greenacres-estate-uyo',
    'Greenacres Estate Uyo',
    'De-Greenacres Properties',
    'Premium residential estate featuring 50 luxury plots with modern infrastructure, 24/7 security, and excellent road networks. Located in the prestigious Shelter Afrique Extension area of Uyo.',
    'Shelter Afrique Extension',
    'Akwa Ibom',
    'under-construction',
    '2027-06',
    50,
    32,
    '[{"type":"Standard Plot","size":600,"price":15000000,"available":20},{"type":"Premium Plot","size":800,"price":22000000,"available":8},{"type":"Corner Plot","size":1000,"price":30000000,"available":4}]'::jsonb,
    ARRAY['Perimeter Fence','Gate House','24/7 Security','Tarred Roads','Street Lights','Drainage System','Water Treatment','Recreational Park','Commercial Area'],
    '[{"name":"Outright Payment","description":"Full payment with 5% discount","duration":"Immediate"},{"name":"6-Month Plan","description":"30% initial deposit, balance over 6 months","duration":"6 months"},{"name":"12-Month Plan","description":"20% initial deposit, balance over 12 months","duration":"12 months"}]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'],
    ARRAY['C of O Documentation','Government Approved','Dry Land','Excellent Topography','Close to Main Road','Growing Area'],
    'C of O',
    true,
    true
  ),
  (
    'd22d22d2-2222-4222-d222-222222222222'::uuid,
    'luxury-court-lekki',
    'Luxury Court Lekki',
    'De-Greenacres Properties',
    'Exclusive gated community featuring 24 luxury 4 & 5 bedroom duplexes with modern amenities, smart home features, and premium finishes.',
    'Chevron Drive',
    'Lagos',
    'under-construction',
    '2027-12',
    24,
    16,
    '[{"type":"4 Bedroom Semi-Detached","bedrooms":4,"size":320,"price":120000000,"available":10},{"type":"5 Bedroom Fully Detached","bedrooms":5,"size":450,"price":180000000,"available":6}]'::jsonb,
    ARRAY['Swimming Pool','Gym','Tennis Court','Children''s Playground','Clubhouse','24/7 Security','CCTV Surveillance','Backup Power','Water Treatment','Estate Management'],
    '[{"name":"Outright Payment","description":"Full payment with 10% discount","duration":"Immediate"},{"name":"Construction Milestone Plan","description":"Payments tied to construction milestones","duration":"24 months"}]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'],
    ARRAY['Smart Home Automation','Premium Finishes','All Rooms Ensuite','Boys Quarter','Ample Parking','Modern Kitchen'],
    'Governor''s Consent',
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  available_units = EXCLUDED.available_units,
  updated_at = now();

-- ============================================
-- 6) VERIFY
-- ============================================
-- SELECT 'agencies' as tbl, count(*) from public.agencies
-- UNION ALL SELECT 'agents', count(*) from public.agents
-- UNION ALL SELECT 'developments', count(*) from public.developments;

-- After seeding, link real properties to agents:
-- UPDATE public.properties SET owner_id = (SELECT user_id FROM public.agents WHERE slug='chisom-okonkwo') WHERE slug='your-property-slug';
-- Or keep demo owners (admin profile) and showcase DemoBanner until linked.
