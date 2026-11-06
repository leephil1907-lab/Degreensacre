-- De-Greenacres production CMS and administration migration
-- Run after supabase-schema.sql in the Supabase SQL Editor.
-- Idempotent: safe to re-run. No listings, reviews, profiles or articles are seeded.
-- Back up the database before applying any production migration.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- A narrow, safe admin check for RLS policies. It returns only a boolean and
-- prevents recursive profile-policy lookups.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE((
    SELECT p.is_admin FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())
  ), FALSE);
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Core property fields and moderation
-- ---------------------------------------------------------------------------
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS toilets INTEGER DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lga TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS land_size INTEGER;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS negotiable BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE public.properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('draft', 'pending_review', 'available', 'sold', 'rented', 'withdrawn'));
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_verification_status_check;
ALTER TABLE public.properties ADD CONSTRAINT properties_verification_status_check
  CHECK (verification_status IN ('verified', 'pending', 'unverified'));
ALTER TABLE public.properties ALTER COLUMN status SET DEFAULT 'pending_review';
ALTER TABLE public.properties ALTER COLUMN verification_status SET DEFAULT 'pending';
ALTER TABLE public.properties ALTER COLUMN featured SET DEFAULT FALSE;

DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "properties_select_all" ON public.properties;
DROP POLICY IF EXISTS "Public can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can view own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
CREATE POLICY "Public can view available properties" ON public.properties
  FOR SELECT TO anon, authenticated USING (status = 'available' AND COALESCE(sample, FALSE) = FALSE);
CREATE POLICY "Owners can view own properties" ON public.properties
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = owner_id);
CREATE POLICY "Admins can view all properties" ON public.properties
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Owners and agents can submit properties" ON public.properties;
CREATE POLICY "Owners and agents can submit properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid())
        AND (p.account_type IN ('seller', 'agent') OR p.is_admin = TRUE)
    )
  );

DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can update all properties" ON public.properties;
CREATE POLICY "Owners can update own properties" ON public.properties
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);
CREATE POLICY "Admins can update all properties" ON public.properties
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
CREATE POLICY "Owners can delete own properties" ON public.properties
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = owner_id);
CREATE POLICY "Admins can delete properties" ON public.properties
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.guard_property_publication()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.status = 'available' THEN
        RAISE EXCEPTION 'An administrator must approve a listing before publication.';
      END IF;
      NEW.verification_status := 'pending';
      NEW.featured := FALSE;
    ELSE
      IF NEW.status = 'available' AND OLD.status IS DISTINCT FROM 'available' THEN
        RAISE EXCEPTION 'An administrator must approve a listing before publication.';
      END IF;

      -- An owner cannot edit the substance of a live listing while retaining
      -- its approval. View counters and timestamps alone do not trigger review.
      IF OLD.status = 'available' AND NEW.status = 'available'
        AND (to_jsonb(NEW) - 'views' - 'updated_at' - 'published_at')
          IS DISTINCT FROM
            (to_jsonb(OLD) - 'views' - 'updated_at' - 'published_at') THEN
        NEW.status := 'pending_review';
        NEW.verification_status := 'pending';
        NEW.featured := FALSE;
      ELSE
        NEW.verification_status := OLD.verification_status;
        NEW.featured := OLD.featured;
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'available' THEN
      NEW.published_at := COALESCE(NEW.published_at, NOW());
    END IF;
  ELSIF NEW.status = 'available' AND OLD.status IS DISTINCT FROM 'available' THEN
    NEW.published_at := COALESCE(NEW.published_at, NOW());
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_property_publication() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_property_publication ON public.properties;
CREATE TRIGGER guard_property_publication BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.guard_property_publication();

CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS properties_public_status_idx ON public.properties(status, date_added DESC);
CREATE INDEX IF NOT EXISTS properties_slug_idx ON public.properties(slug);

-- Uploaded property-image records. The properties.images URL array remains the
-- portable cover/gallery field used by public listing pages.
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS property_images_select_all ON public.property_images;
DROP POLICY IF EXISTS property_images_select_public_or_owner ON public.property_images;
DROP POLICY IF EXISTS property_images_insert_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_insert_owner_or_admin ON public.property_images;
DROP POLICY IF EXISTS property_images_update_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_update_owner_or_admin ON public.property_images;
DROP POLICY IF EXISTS property_images_delete_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_delete_owner_or_admin ON public.property_images;
CREATE POLICY property_images_select_public_or_owner ON public.property_images FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.status = 'available' OR p.owner_id = (SELECT auth.uid()))) OR public.is_admin()
);
CREATE POLICY property_images_insert_owner_or_admin ON public.property_images FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = (SELECT auth.uid())) OR public.is_admin()
);
CREATE POLICY property_images_update_owner_or_admin ON public.property_images FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = (SELECT auth.uid())) OR public.is_admin()
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = (SELECT auth.uid())) OR public.is_admin()
);
CREATE POLICY property_images_delete_owner_or_admin ON public.property_images FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = (SELECT auth.uid())) OR public.is_admin()
);
ALTER TABLE public.property_images ADD COLUMN IF NOT EXISTS alt_text TEXT;
CREATE INDEX IF NOT EXISTS property_images_property_idx ON public.property_images(property_id, display_order);

-- Core account/dashboard tables used by the application APIs.
CREATE TABLE IF NOT EXISTS public.viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  alternative_date DATE,
  alternative_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  alert_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  alert_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS viewing_requests_user_idx ON public.viewing_requests (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS saved_searches_user_idx ON public.saved_searches (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON public.messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_participants_idx ON public.messages (sender_id, recipient_id);

-- ---------------------------------------------------------------------------
-- Agencies, agents and developments
-- ---------------------------------------------------------------------------
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
  is_published BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.agencies ALTER COLUMN is_published SET DEFAULT FALSE;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agencies are viewable by everyone" ON public.agencies;
DROP POLICY IF EXISTS "Authenticated can insert agencies" ON public.agencies;
DROP POLICY IF EXISTS "Owners can update agencies" ON public.agencies;
DROP POLICY IF EXISTS "Public can view published agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admins can view all agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admins can insert agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admins can update agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admins can delete agencies" ON public.agencies;
CREATE POLICY "Public can view published agencies" ON public.agencies FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Admins can view all agencies" ON public.agencies FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert agencies" ON public.agencies FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update agencies" ON public.agencies FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete agencies" ON public.agencies FOR DELETE TO authenticated USING (public.is_admin());

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
  is_published BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.agents ALTER COLUMN is_published SET DEFAULT FALSE;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agents are viewable by everyone" ON public.agents;
DROP POLICY IF EXISTS "Authenticated can insert agents" ON public.agents;
DROP POLICY IF EXISTS "Owners can update agents" ON public.agents;
DROP POLICY IF EXISTS "Public can view published agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can view all agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can insert agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can update agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can delete agents" ON public.agents;
CREATE POLICY "Public can view published agents" ON public.agents FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Admins can view all agents" ON public.agents FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert agents" ON public.agents FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update agents" ON public.agents FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete agents" ON public.agents FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX IF NOT EXISTS idx_agents_agency_id ON public.agents(agency_id);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON public.agencies(slug);

CREATE TABLE IF NOT EXISTS public.developments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  developer TEXT,
  description TEXT,
  location TEXT,
  state TEXT,
  status TEXT DEFAULT 'planning',
  completion_date TEXT,
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  unit_types JSONB DEFAULT '[]',
  amenities TEXT[] DEFAULT '{}',
  payment_plans JSONB DEFAULT '[]',
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  documentation TEXT,
  site_inspection BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS documentation TEXT;
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.developments ALTER COLUMN is_published SET DEFAULT FALSE;
ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Developments are viewable by everyone" ON public.developments;
DROP POLICY IF EXISTS "Public can view published developments" ON public.developments;
DROP POLICY IF EXISTS "Admins can view all developments" ON public.developments;
DROP POLICY IF EXISTS "Admins can insert developments" ON public.developments;
DROP POLICY IF EXISTS "Admins can update developments" ON public.developments;
DROP POLICY IF EXISTS "Admins can delete developments" ON public.developments;
CREATE POLICY "Public can view published developments" ON public.developments FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Admins can view all developments" ON public.developments FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert developments" ON public.developments FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update developments" ON public.developments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete developments" ON public.developments FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX IF NOT EXISTS developments_public_idx ON public.developments(is_published, created_at DESC);

-- ---------------------------------------------------------------------------
-- Articles / insights
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'De-Greenacres Team',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_time INTEGER NOT NULL DEFAULT 5 CHECK (read_time BETWEEN 1 AND 120),
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can view all articles" ON public.articles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update articles" ON public.articles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete articles" ON public.articles FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX IF NOT EXISTS articles_public_idx ON public.articles(status, published_at DESC);

-- ---------------------------------------------------------------------------
-- Reviews: public submissions stay pending; admins control approval/editing.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  message TEXT NOT NULL,
  location TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified_buyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Public can submit pending reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND is_verified_buyer = FALSE);
CREATE POLICY "Admins can view all reviews" ON public.reviews FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status, created_at DESC);

CREATE OR REPLACE FUNCTION public.guard_review_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL AND NOT public.is_admin() THEN
    NEW.status := 'pending';
    NEW.is_verified_buyer := FALSE;
    NEW.user_id := (SELECT auth.uid());
  ELSIF (SELECT auth.uid()) IS NULL THEN
    NEW.status := 'pending';
    NEW.is_verified_buyer := FALSE;
    NEW.user_id := NULL;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_review_submission() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_review_submission ON public.reviews;
CREATE TRIGGER guard_review_submission BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.guard_review_submission();

-- ---------------------------------------------------------------------------
-- Global site settings. Legacy columns are retained for compatibility; the
-- application uses the settings JSONB document so new global fields can evolve.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name TEXT DEFAULT 'De-Greenacres Properties Limited',
  rc_number TEXT DEFAULT 'RC: 1856064',
  email TEXT DEFAULT 'degreenacrespropertieslimited@gmail.com',
  phone TEXT DEFAULT '08065019971',
  whatsapp TEXT DEFAULT '07041754800',
  address TEXT DEFAULT 'Lagos, Nigeria',
  inspection_fee INTEGER DEFAULT 20000,
  notify_new_user BOOLEAN DEFAULT TRUE,
  notify_new_property BOOLEAN DEFAULT TRUE,
  notify_new_enquiry BOOLEAN DEFAULT TRUE,
  notify_payment BOOLEAN DEFAULT TRUE,
  settings JSONB,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS settings JSONB;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
UPDATE public.site_settings
SET settings = jsonb_build_object(
  'company_name', COALESCE(company_name, 'De-Greenacres Properties Limited'),
  'tagline', 'Homes, land and investment opportunities — documentation reviewed.',
  'contact_email', COALESCE(email, 'degreenacrespropertieslimited@gmail.com'),
  'contact_phone', COALESCE(phone, '+2348065019971'),
  'whatsapp_number', regexp_replace(COALESCE(whatsapp, '2347041754800'), '[^0-9]', '', 'g'),
  'address', COALESCE(address, 'Lagos, Nigeria'),
  'facebook_url', '', 'instagram_url', '', 'twitter_url', '', 'linkedin_url', '',
  'inspection_fee', COALESCE(inspection_fee, 20000)
)
WHERE settings IS NULL;
INSERT INTO public.site_settings (id, settings)
VALUES (1, jsonb_build_object(
  'company_name', 'De-Greenacres Properties Limited',
  'tagline', 'Homes, land and investment opportunities — documentation reviewed.',
  'contact_email', 'degreenacrespropertieslimited@gmail.com',
  'contact_phone', '+2348065019971',
  'whatsapp_number', '2347041754800',
  'address', '5 Borogade Crescent, Off Okengbero Street, New Oko-Oba, Lagos, Nigeria',
  'facebook_url', '', 'instagram_url', '', 'twitter_url', '', 'linkedin_url', '',
  'inspection_fee', 20000
))
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Admin operations: users, enquiries, inspections, email and audit history.
-- ---------------------------------------------------------------------------
-- Profile fields used by account dashboards, admin user activity and login
-- tracking. IF NOT EXISTS keeps this safe for databases that already added them.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL AND NOT public.is_admin() THEN
    NEW.is_admin := OLD.is_admin;
    NEW.is_verified := OLD.is_verified;
    IF NEW.account_type = 'admin' AND OLD.account_type IS DISTINCT FROM 'admin' THEN
      NEW.account_type := OLD.account_type;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_profile_privileges() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_profile_privileges ON public.profiles;
CREATE TRIGGER guard_profile_privileges BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges();

ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;
DROP POLICY IF EXISTS "Admins can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admins can update enquiries" ON public.enquiries;
CREATE POLICY "Admins can view enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view viewing requests" ON public.viewing_requests;
DROP POLICY IF EXISTS "Admins can update viewing requests" ON public.viewing_requests;
CREATE POLICY "Admins can view viewing requests" ON public.viewing_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update viewing requests" ON public.viewing_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_type TEXT NOT NULL DEFAULT 'all',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  recipients TEXT[] DEFAULT '{}',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  template TEXT DEFAULT 'custom',
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view sent emails" ON public.sent_emails;
DROP POLICY IF EXISTS "Admins can insert sent emails" ON public.sent_emails;
CREATE POLICY "Admins can view sent emails" ON public.sent_emails FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert sent emails" ON public.sent_emails FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can insert activity" ON public.admin_activity;
CREATE POLICY "Admins can view activity" ON public.admin_activity FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert activity" ON public.admin_activity FOR INSERT TO authenticated WITH CHECK (public.is_admin() AND admin_id = (SELECT auth.uid()));

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- Safe profile creation for new auth users. Client metadata can never grant
-- administrator privileges or the protected admin account type.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, state, country, account_type, is_admin, is_verified)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'state',
    COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria'),
    CASE WHEN NEW.raw_user_meta_data->>'account_type' IN ('buyer', 'seller', 'agent') THEN NEW.raw_user_meta_data->>'account_type' ELSE 'buyer' END,
    FALSE, FALSE
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Account, viewing, notification and private-message access.
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS viewing_requests_owner_select ON public.viewing_requests;
DROP POLICY IF EXISTS viewing_requests_owner_insert ON public.viewing_requests;
CREATE POLICY viewing_requests_owner_select ON public.viewing_requests FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY viewing_requests_owner_insert ON public.viewing_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) AND status = 'requested');
DROP POLICY IF EXISTS saved_searches_owner_all ON public.saved_searches;
CREATE POLICY saved_searches_owner_all ON public.saved_searches FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS notifications_owner_select ON public.notifications;
DROP POLICY IF EXISTS notifications_owner_update ON public.notifications;
DROP POLICY IF EXISTS notifications_valid_insert ON public.notifications;
CREATE POLICY notifications_owner_select ON public.notifications FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY notifications_owner_update ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY notifications_valid_insert ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR user_id = (SELECT auth.uid())
    OR (
      type = 'new_message'
      AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.conversation_id::text = notifications.data->>'conversation_id'
          AND m.sender_id = (SELECT auth.uid())
          AND m.recipient_id = notifications.user_id
          AND m.sender_id::text = notifications.data->>'sender_id'
      )
    )
  );
DROP POLICY IF EXISTS conversations_participant_select ON public.conversations;
DROP POLICY IF EXISTS conversations_owner_insert ON public.conversations;
CREATE POLICY conversations_participant_select ON public.conversations FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.conversation_id = conversations.id
        AND (m.sender_id = (SELECT auth.uid()) OR m.recipient_id = (SELECT auth.uid()))
    )
  );
CREATE POLICY conversations_owner_insert ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));
DROP POLICY IF EXISTS messages_participant_select ON public.messages;
DROP POLICY IF EXISTS messages_participant_insert ON public.messages;
CREATE POLICY messages_participant_select ON public.messages FOR SELECT TO authenticated
  USING (public.is_admin() OR sender_id = (SELECT auth.uid()) OR recipient_id = (SELECT auth.uid()));
CREATE POLICY messages_participant_insert ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND recipient_id <> sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (
          c.created_by = (SELECT auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.messages existing
            WHERE existing.conversation_id = c.id
              AND (existing.sender_id = (SELECT auth.uid()) OR existing.recipient_id = (SELECT auth.uid()))
          )
        )
    )
  );
DROP POLICY IF EXISTS messages_recipient_mark_read ON public.messages;
CREATE POLICY messages_recipient_mark_read ON public.messages FOR UPDATE TO authenticated
  USING (recipient_id = (SELECT auth.uid())) WITH CHECK (recipient_id = (SELECT auth.uid()));
CREATE OR REPLACE FUNCTION public.guard_message_read_update() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
    OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
    OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
    OR NEW.recipient_id IS DISTINCT FROM OLD.recipient_id
    OR NEW.content IS DISTINCT FROM OLD.content
    OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Only the message read state can be changed';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS guard_message_read_update ON public.messages;
CREATE TRIGGER guard_message_read_update BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.guard_message_read_update();
DROP TRIGGER IF EXISTS set_viewing_requests_updated_at ON public.viewing_requests;
CREATE TRIGGER set_viewing_requests_updated_at BEFORE UPDATE ON public.viewing_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
    ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END;
$$;

-- Public property-image bucket and owner/admin-only object writes.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-images', 'property-images', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
DROP POLICY IF EXISTS property_images_public_read ON storage.objects;
DROP POLICY IF EXISTS property_images_owner_insert ON storage.objects;
DROP POLICY IF EXISTS property_images_owner_update ON storage.objects;
DROP POLICY IF EXISTS property_images_owner_delete ON storage.objects;
CREATE POLICY property_images_public_read ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'property-images');
CREATE POLICY property_images_owner_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id::text = split_part(storage.objects.name, '/', 1)
          AND p.owner_id = (SELECT auth.uid())
      )
    )
  );
CREATE POLICY property_images_owner_update ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id::text = split_part(storage.objects.name, '/', 1)
          AND p.owner_id = (SELECT auth.uid())
      )
    )
  )
  WITH CHECK (bucket_id = 'property-images');
CREATE POLICY property_images_owner_delete ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id::text = split_part(storage.objects.name, '/', 1)
          AND p.owner_id = (SELECT auth.uid())
      )
    )
  );

-- Public content is created and explicitly published through the admin CMS.
-- This migration intentionally inserts no listings, reviews, profiles or articles.

COMMIT;

-- Verification (optional):
-- SELECT 'articles' AS table_name, count(*) FROM public.articles
-- UNION ALL SELECT 'developments', count(*) FROM public.developments
-- UNION ALL SELECT 'agencies', count(*) FROM public.agencies
-- UNION ALL SELECT 'agents', count(*) FROM public.agents;
