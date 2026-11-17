-- Security & Data Remediation (2026-11-17)
-- Applied to Supabase project rvwirpfclysapqtnrlvx.

BEGIN;

-- 1. Migrate any properties.admin_notes to private property_moderation_notes and drop admin_notes column
DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  SELECT id INTO v_admin_id
  FROM public.profiles
  WHERE is_admin = true
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_admin_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'admin_notes'
  ) THEN
    INSERT INTO public.property_moderation_notes (property_id, admin_id, note)
    SELECT p.id, v_admin_id, left(trim(p.admin_notes), 5000)
    FROM public.properties p
    WHERE p.admin_notes IS NOT NULL
      AND length(trim(p.admin_notes)) > 0
      AND NOT EXISTS (
        SELECT 1 FROM public.property_moderation_notes m
        WHERE m.property_id = p.id AND m.note = left(trim(p.admin_notes), 5000)
      );
  END IF;
END $$;

ALTER TABLE public.properties DROP COLUMN IF EXISTS admin_notes;
REVOKE ALL ON public.property_moderation_notes FROM PUBLIC, anon, authenticated;

-- 2. Quarantine synthetic @example.com reviews out of public.reviews (snapshots preserved)
INSERT INTO launch_repair_private.snapshots (entity, entity_id, payload)
SELECT 'review', id::text, to_jsonb(r)
FROM public.reviews r
WHERE lower(email) LIKE '%@example.com'
ON CONFLICT DO NOTHING;

DELETE FROM public.reviews
WHERE lower(email) LIKE '%@example.com';

-- 3. Tighten reviews table access: no direct SELECT for anon/non-admin authenticated; public reads use public_reviews view
DROP POLICY IF EXISTS reviews_public_read ON public.reviews;
REVOKE ALL ON public.reviews FROM PUBLIC, anon;
GRANT INSERT (id, user_id, name, email, rating, title, message, location, property_id, status, is_verified_buyer)
  ON public.reviews TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.reviews TO authenticated;

CREATE OR REPLACE VIEW public.public_reviews WITH (security_barrier = true) AS
SELECT id, name, rating, title, message, location, created_at, is_verified_buyer
FROM public.reviews
WHERE status = 'approved' AND lower(email) NOT LIKE '%@example.com';

REVOKE ALL ON public.public_reviews FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_reviews TO anon, authenticated;

-- 4. Reconcile is_admin() (block suspended admins) and guard_profile_privileges() (lock role/suspension fields)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $$
  SELECT COALESCE(
    (
      SELECT (COALESCE(is_admin, false) AND NOT COALESCE(is_suspended, false))
      FROM public.profiles
      WHERE id = auth.uid()
    ),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'pg_catalog', 'public'
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Profile identity cannot be changed';
    END IF;
    NEW.email := COALESCE(public.auth_profile_email(OLD.id), OLD.email);
    IF NOT public.is_admin() THEN
      NEW.is_admin := OLD.is_admin;
      NEW.admin_role := OLD.admin_role;
      NEW.is_verified := OLD.is_verified;
      NEW.is_suspended := OLD.is_suspended;
      NEW.suspended_at := OLD.suspended_at;
      NEW.suspended_reason := OLD.suspended_reason;
      NEW.last_login_at := OLD.last_login_at;
      IF NEW.account_type NOT IN ('buyer', 'seller', 'agent') THEN
        NEW.account_type := OLD.account_type;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Restrict RPC execute grants and unused anon-writable contact_requests policy
REVOKE ALL ON FUNCTION public.mark_saved_searches_notified(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_saved_searches_notified(uuid[]) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.set_admin_for_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_admin_for_email(text) TO service_role;

DROP POLICY IF EXISTS contact_requests_insert_public ON public.contact_requests;

NOTIFY pgrst, 'reload schema';

COMMIT;
