-- Follow-up: private documents, analytics privacy, atomic viewing reservations.
ALTER TABLE public.property_documents ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
DO $$DECLARE p record; BEGIN FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='property_documents' LOOP EXECUTE format('DROP POLICY %I ON public.property_documents',p.policyname); END LOOP; END$$;
CREATE POLICY documents_admin_all ON public.property_documents FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY documents_owner_read ON public.property_documents FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND p.owner_id=auth.uid()));
-- Documents remain private regardless of historical sharing flags. No public URL is generated here.
DROP POLICY IF EXISTS property_views_select_all ON public.property_views;
DROP POLICY IF EXISTS property_views_insert_public ON public.property_views;
DROP POLICY IF EXISTS analytics_admin_read ON public.property_views;
CREATE POLICY analytics_admin_read ON public.property_views FOR SELECT TO authenticated USING(public.is_admin());
CREATE UNIQUE INDEX IF NOT EXISTS viewing_requests_active_slot ON public.viewing_requests(property_id,preferred_date,preferred_time) WHERE status IN ('requested','confirmed');
REVOKE ALL ON FUNCTION public.can_access_conversation(uuid),public.can_send_message(uuid,uuid),public.conversation_profile_summaries(uuid[]),public.auth_profile_email(uuid) FROM anon;
-- Avoid introducing an unsubstantiated claim into migrated company copy.
UPDATE public.site_settings SET settings=jsonb_set(settings,'{tagline}','"Properties, land and real-estate services across Nigeria."'::jsonb) WHERE id=1 AND settings->>'tagline'='Homes, land and investment opportunities — documentation reviewed.';
NOTIFY pgrst,'reload schema';
