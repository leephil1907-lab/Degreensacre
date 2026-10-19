-- Degreensacre marketplace security hardening
-- Prevent public RPC calls to privileged SECURITY DEFINER functions and prevent
-- account holders from changing protected profile flags through the Data API.

BEGIN;

-- Trigger functions are invoked by PostgreSQL triggers, not directly by users.
REVOKE ALL ON FUNCTION public.guard_property_publication() FROM PUBLIC, anon, authenticated;

-- This function promotes an account to administrator. It must never be callable
-- by anonymous or ordinary authenticated API clients.
REVOKE ALL ON FUNCTION public.set_admin_for_email(text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Browser/session-authenticated profile updates must not be able to self-verify
  -- or grant administrator privileges. Trusted service-role/dashboard changes
  -- run with auth.uid() IS NULL and remain available.
  IF auth.uid() IS NOT NULL THEN
    NEW.is_admin := OLD.is_admin;
    NEW.is_verified := OLD.is_verified;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_profile_privileges() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_profile_privileges ON public.profiles;
CREATE TRIGGER guard_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_privileges();

COMMIT;
