-- Degreensacre profile privacy and function hardening
-- Applied to Supabase project rvwirpfclysapqtnrlvx on 2026-10-19.

BEGIN;

DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
-- Admin APIs use the server-side service client after checking the current
-- user's own is_admin flag; avoid a recursive profiles policy subquery.

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE OR REPLACE FUNCTION public.increment_property_views(property_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  UPDATE public.properties
     SET views = COALESCE(views, 0) + 1
   WHERE id = property_uuid
     AND status = 'available';
END;
$function$;

ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_updated_at() SET search_path = pg_catalog, public;

COMMIT;
