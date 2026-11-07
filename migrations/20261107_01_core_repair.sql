-- Existing-project repair. Rehearsed against an isolated legacy-schema fixture.
-- Preserves all rows; only confirmed example-domain reviews are unpublished.
CREATE SCHEMA IF NOT EXISTS launch_repair_private;
REVOKE ALL ON SCHEMA launch_repair_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS launch_repair_private.snapshots (
  entity text NOT NULL, entity_id text NOT NULL, payload jsonb NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(entity,entity_id)
);
REVOKE ALL ON launch_repair_private.snapshots FROM PUBLIC, anon, authenticated;
INSERT INTO launch_repair_private.snapshots(entity,entity_id,payload)
 SELECT 'site_settings',id::text,to_jsonb(s) FROM public.site_settings s
 ON CONFLICT DO NOTHING;
INSERT INTO launch_repair_private.snapshots(entity,entity_id,payload)
 SELECT 'review',id::text,to_jsonb(r) FROM public.reviews r WHERE lower(email) LIKE '%@example.com'
 ON CONFLICT DO NOTHING;
INSERT INTO launch_repair_private.snapshots(entity,entity_id,payload)
 SELECT 'policy',schemaname||'.'||tablename||'.'||policyname,to_jsonb(p)
 FROM pg_policies p WHERE schemaname IN ('public','storage') ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public
 AS $$ SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id=auth.uid()),false) $$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon,authenticated;

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS settings jsonb;
UPDATE public.site_settings SET settings=jsonb_build_object(
 'company_name',company_name,'tagline','Properties, land and real-estate services across Nigeria.',
 'contact_email',email,'contact_phone',phone,
 'whatsapp_number',CASE WHEN regexp_replace(whatsapp,'[^0-9]','','g') ~ '^0[0-9]{10}$'
  THEN '234'||substring(regexp_replace(whatsapp,'[^0-9]','','g') FROM 2)
  ELSE regexp_replace(whatsapp,'[^0-9]','','g') END,
 'address',address,'inspection_fee',inspection_fee,
 'facebook_url','','instagram_url','','twitter_url','','linkedin_url','') WHERE settings IS NULL;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT TO anon,authenticated USING(id=1);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK(public.is_admin() AND id=1);

-- Replace all legacy profile policies: no anonymous profile reads or self-created privileged profiles.
DO $$DECLARE p record; BEGIN FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='profiles'
 LOOP EXECUTE format('DROP POLICY %I ON public.profiles',p.policyname); END LOOP; END$$;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_read_self ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
CREATE POLICY profiles_read_admin ON public.profiles FOR SELECT TO authenticated USING(public.is_admin());
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE POLICY profiles_update_admin ON public.profiles FOR UPDATE TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE OR REPLACE FUNCTION public.auth_profile_email(pid uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT email::text FROM auth.users WHERE id=pid AND (pid=auth.uid() OR public.is_admin())
$$;
REVOKE ALL ON FUNCTION public.auth_profile_email(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_profile_email(uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_profile_privileges() RETURNS trigger
 LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN
 IF auth.uid() IS NOT NULL THEN
  IF NEW.id IS DISTINCT FROM OLD.id THEN RAISE EXCEPTION 'Profile identity cannot be changed'; END IF;
  NEW.email:=COALESCE(public.auth_profile_email(OLD.id),OLD.email);
  IF NOT public.is_admin() THEN
   NEW.is_admin:=OLD.is_admin; NEW.is_verified:=OLD.is_verified;
   IF NEW.account_type NOT IN ('buyer','seller','agent') THEN NEW.account_type:=OLD.account_type; END IF;
  END IF;
 END IF;
 RETURN NEW;
END$$;
REVOKE ALL ON FUNCTION public.guard_profile_privileges() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_profile_privileges ON public.profiles;
CREATE TRIGGER guard_profile_privileges BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges();

-- Auth's trusted trigger, not a public profile INSERT, creates ordinary profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
 SET search_path=pg_catalog,public AS $$
BEGIN
 INSERT INTO public.profiles(id,email,first_name,last_name,phone,state,country,account_type,is_admin,is_verified)
 VALUES(NEW.id,NEW.email,COALESCE(NEW.raw_user_meta_data->>'first_name',''),COALESCE(NEW.raw_user_meta_data->>'last_name',''),
 NEW.raw_user_meta_data->>'phone',NEW.raw_user_meta_data->>'state',COALESCE(NEW.raw_user_meta_data->>'country','Nigeria'),
 CASE WHEN NEW.raw_user_meta_data->>'account_type' IN ('buyer','seller','agent') THEN NEW.raw_user_meta_data->>'account_type' ELSE 'buyer' END,false,false)
 ON CONFLICT(id) DO NOTHING; RETURN NEW;
END$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.sync_auth_profile_email() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN UPDATE public.profiles SET email=NEW.email WHERE id=NEW.id; RETURN NEW; END$$;
REVOKE ALL ON FUNCTION public.sync_auth_profile_email() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS sync_auth_profile_email ON auth.users;
CREATE TRIGGER sync_auth_profile_email AFTER UPDATE OF email ON auth.users FOR EACH ROW WHEN (OLD.email IS DISTINCT FROM NEW.email) EXECUTE FUNCTION public.sync_auth_profile_email();

-- Public inserts cannot choose approval, verified-buyer status or another user's identity.
DO $$DECLARE p record; BEGIN FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='reviews'
 LOOP EXECUTE format('DROP POLICY %I ON public.reviews',p.policyname); END LOOP; END$$;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.reviews ALTER COLUMN is_verified_buyer SET DEFAULT false;
UPDATE public.reviews SET status='pending',is_verified_buyer=false,updated_at=now() WHERE lower(email) LIKE '%@example.com' AND status='approved';
CREATE POLICY reviews_public_read ON public.reviews FOR SELECT TO anon,authenticated USING(status='approved' AND lower(email) NOT LIKE '%@example.com');
CREATE POLICY reviews_pending_insert ON public.reviews FOR INSERT TO anon,authenticated WITH CHECK(status='pending' AND is_verified_buyer=false AND (user_id IS NULL OR user_id=auth.uid()));
CREATE POLICY reviews_admin_all ON public.reviews FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE OR REPLACE FUNCTION public.guard_review_submission() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 IF NOT public.is_admin() THEN NEW.status:='pending'; NEW.is_verified_buyer:=false; NEW.user_id:=auth.uid(); END IF;
 RETURN NEW;
END$$;
REVOKE ALL ON FUNCTION public.guard_review_submission() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_review_submission ON public.reviews;
CREATE TRIGGER guard_review_submission BEFORE INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.guard_review_submission();

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS negotiable boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.property_images ADD COLUMN IF NOT EXISTS alt_text text;
ALTER TABLE public.properties ALTER COLUMN status SET DEFAULT 'pending_review';
ALTER TABLE public.properties ALTER COLUMN verification_status SET DEFAULT 'pending';
ALTER TABLE public.properties ALTER COLUMN featured SET DEFAULT false;
DROP POLICY IF EXISTS "Public can view available properties" ON public.properties;
CREATE POLICY "Public can view available properties" ON public.properties FOR SELECT TO anon,authenticated USING(status='available' AND COALESCE(sample,false)=false);
CREATE OR REPLACE FUNCTION public.guard_property_publication() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
  IF TG_OP='INSERT' THEN
   IF NEW.status='available' THEN RAISE EXCEPTION 'Administrator approval is required'; END IF;
   NEW.verification_status:='pending'; NEW.featured:=false; NEW.sample:=false;
  ELSE
   IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN RAISE EXCEPTION 'Owner cannot be reassigned'; END IF;
   NEW.sample:=OLD.sample;
   IF NEW.status='available' AND OLD.status IS DISTINCT FROM 'available' THEN RAISE EXCEPTION 'Administrator approval is required'; END IF;
   IF OLD.status='available' AND (to_jsonb(NEW)-'views'-'saves'-'enquiries_count'-'updated_at'-'published_at') IS DISTINCT FROM (to_jsonb(OLD)-'views'-'saves'-'enquiries_count'-'updated_at'-'published_at') THEN
    NEW.status:='pending_review'; NEW.verification_status:='pending'; NEW.featured:=false;
   ELSE NEW.verification_status:=OLD.verification_status; NEW.featured:=OLD.featured; END IF;
  END IF;
 END IF;
 IF NEW.status='available' THEN NEW.published_at:=COALESCE(NEW.published_at,now()); END IF;
 RETURN NEW;
END$$;
REVOKE ALL ON FUNCTION public.guard_property_publication() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_property_publication ON public.properties;
CREATE TRIGGER guard_property_publication BEFORE INSERT OR UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.guard_property_publication();

CREATE TABLE IF NOT EXISTS public.articles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),slug text UNIQUE NOT NULL,title text NOT NULL,
 excerpt text NOT NULL,content text NOT NULL,category text NOT NULL,author text NOT NULL DEFAULT 'De-Greenacres Team',
 published_at timestamptz NOT NULL DEFAULT now(),read_time integer NOT NULL DEFAULT 5 CHECK(read_time BETWEEN 1 AND 120),
 image text NOT NULL,featured boolean DEFAULT false,tags text[] DEFAULT '{}',
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
 created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS articles_public_read ON public.articles;
DROP POLICY IF EXISTS articles_admin_all ON public.articles;
CREATE POLICY articles_public_read ON public.articles FOR SELECT TO anon,authenticated USING(status='published');
CREATE POLICY articles_admin_all ON public.articles FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
GRANT SELECT ON public.articles TO anon,authenticated;
GRANT INSERT,UPDATE,DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
NOTIFY pgrst,'reload schema';
