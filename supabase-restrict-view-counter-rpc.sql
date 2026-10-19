-- Restrict privileged view-counter RPC to server-side service-role calls.
-- Applied to Supabase project rvwirpfclysapqtnrlvx.

BEGIN;

REVOKE ALL ON FUNCTION public.increment_property_views(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_property_views(uuid) TO service_role;

CREATE POLICY "deny_direct_property_moderation_notes_access"
  ON public.property_moderation_notes
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMIT;