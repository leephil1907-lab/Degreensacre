-- Degreensacre marketplace submission and moderation migration
-- Run once in Supabase SQL Editor before enabling public owner/agent submissions.
-- This preserves currently available listings, allows new submissions to remain drafts,
-- and prevents a non-admin account from publishing or self-verifying a listing.

BEGIN;

-- Preserve the selected owner/agent role when Supabase creates a profile.
-- Never accept 'admin' from user-editable auth metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
DECLARE
  requested_role TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'account_type';
  IF requested_role NOT IN ('buyer', 'seller', 'agent') THEN
    requested_role := 'buyer';
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, state, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'state', ''),
    requested_role
  )
  ON CONFLICT (id) DO UPDATE SET
    account_type = EXCLUDED.account_type,
    first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), public.profiles.first_name),
    last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    state = COALESCE(EXCLUDED.state, public.profiles.state);

  RETURN NEW;
END;
$;

-- The application creates submissions with status='draft'. The original schema
-- constraint did not include that status, which would cause inserts to fail.
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE public.properties
  ADD CONSTRAINT properties_status_check
  CHECK (status IN ('draft', 'pending_review', 'available', 'sold', 'rented', 'withdrawn'));

CREATE INDEX IF NOT EXISTS properties_owner_id_idx
  ON public.properties (owner_id);

CREATE INDEX IF NOT EXISTS properties_public_status_idx
  ON public.properties (status, date_added DESC);

-- Replace the unrestricted read policy. Public visitors see only published/available
-- inventory; owners can still see their own drafts and administrators can review all.
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "Public can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can view own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;

CREATE POLICY "Public can view available properties"
  ON public.properties FOR SELECT
  USING (status = 'available');

CREATE POLICY "Owners can view own properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

-- Enforce owner/agent eligibility at the database boundary as well as in the API.
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
CREATE POLICY "Owners and agents can submit properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.account_type IN ('seller', 'agent') OR p.is_admin = TRUE)
    )
  );

-- Keep ownership on updates. Admins may update any listing to approve or reject it.
DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can update all properties" ON public.properties;

CREATE POLICY "Owners can update own properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update all properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;

CREATE POLICY "Owners can delete own properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

-- Only administrators can publish a draft/pending listing or change its
-- verification/featured flags. This protects both INSERT and UPDATE paths.
-- Service-role operations (auth.uid() IS NULL) remain available for trusted
-- server-side administration and migrations.
CREATE OR REPLACE FUNCTION public.guard_property_publication()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_is_admin BOOLEAN := FALSE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(p.is_admin, FALSE)
    INTO requester_is_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();

  IF NOT requester_is_admin THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.status = 'available' THEN
        RAISE EXCEPTION 'A Degreensacre administrator must approve a listing before publication.';
      END IF;
      NEW.verification_status := 'pending';
      NEW.featured := FALSE;
    ELSE
      IF NEW.status = 'available' AND OLD.status IS DISTINCT FROM 'available' THEN
        RAISE EXCEPTION 'A Degreensacre administrator must approve a listing before publication.';
      END IF;

      NEW.verification_status := OLD.verification_status;
      NEW.featured := OLD.featured;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_property_publication ON public.properties;
CREATE TRIGGER guard_property_publication
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_property_publication();

COMMIT;
