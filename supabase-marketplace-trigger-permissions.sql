-- Revoke direct API execution from additional trigger-only functions.
-- PostgreSQL triggers continue to invoke these functions normally.
BEGIN;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_property_enquiries_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_property_saves_count() FROM PUBLIC, anon, authenticated;
COMMIT;
