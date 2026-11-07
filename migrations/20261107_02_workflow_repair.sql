-- Compatibility additions preserve existing data types and rows.
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS specialization text;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';
ALTER TABLE public.agencies ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.agents ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.developments ALTER COLUMN is_published SET DEFAULT false;
-- Retain the legacy inspection text for inspection/audit; application uses a boolean.
DO $$BEGIN
 IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='developments' AND column_name='site_inspection' AND data_type<>'boolean') THEN
  ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS site_inspection_legacy text;
  UPDATE public.developments SET site_inspection_legacy=site_inspection::text WHERE site_inspection_legacy IS NULL;
  ALTER TABLE public.developments ALTER COLUMN site_inspection DROP DEFAULT;
  ALTER TABLE public.developments ALTER COLUMN site_inspection TYPE boolean USING(lower(COALESCE(site_inspection::text,'')) IN ('true','yes','available','1'));
 END IF;
END$$;
ALTER TABLE public.developments ALTER COLUMN site_inspection SET DEFAULT false;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
UPDATE public.conversations c SET created_by=(SELECT m.sender_id FROM public.messages m WHERE m.conversation_id=c.id ORDER BY m.created_at,m.id LIMIT 1) WHERE created_by IS NULL;
ALTER TABLE public.admin_activity ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS ip_address text;

-- Replace legacy permissive policies on precisely these application-managed tables.
DO $$DECLARE p record; BEGIN FOR p IN SELECT tablename,policyname FROM pg_policies WHERE schemaname='public' AND tablename IN
 ('agencies','agents','developments','conversations','conversation_participants','messages','notifications','viewing_requests','contact_messages','enquiries','sent_emails','admin_activity','audit_logs','property_images')
 LOOP EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,p.tablename); END LOOP; END$$;
DO $$DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['agencies','agents','developments'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('CREATE POLICY cms_public_read ON public.%I FOR SELECT TO anon,authenticated USING(is_published)',t);
 EXECUTE format('CREATE POLICY cms_admin_all ON public.%I FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin())',t);
 END LOOP; END$$;
DO $$DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['contact_messages','enquiries','sent_emails','admin_activity','audit_logs','viewing_requests','property_images','messages','conversations','conversation_participants','notifications'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 END LOOP; END$$;
CREATE POLICY contact_public_insert ON public.contact_messages FOR INSERT TO anon,authenticated WITH CHECK(status='new');
CREATE POLICY contact_admin_all ON public.contact_messages FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY enquiries_public_insert ON public.enquiries FOR INSERT TO anon,authenticated WITH CHECK(status='new' AND (buyer_id IS NULL OR buyer_id=auth.uid()));
CREATE POLICY enquiries_own_read ON public.enquiries FOR SELECT TO authenticated USING(buyer_id=auth.uid());
CREATE POLICY enquiries_admin_all ON public.enquiries FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY sent_emails_admin_all ON public.sent_emails FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY activity_admin_read ON public.admin_activity FOR SELECT TO authenticated USING(public.is_admin());
CREATE POLICY activity_admin_insert ON public.admin_activity FOR INSERT TO authenticated WITH CHECK(public.is_admin() AND admin_id=auth.uid());
CREATE POLICY audit_admin_read ON public.audit_logs FOR SELECT TO authenticated USING(public.is_admin());
CREATE POLICY audit_admin_insert ON public.audit_logs FOR INSERT TO authenticated WITH CHECK(public.is_admin() AND user_id=auth.uid());
CREATE POLICY viewing_own_read ON public.viewing_requests FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.is_admin());
CREATE POLICY viewing_own_insert ON public.viewing_requests FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND status='requested');
CREATE POLICY viewing_admin_update ON public.viewing_requests FOR UPDATE TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY images_public_or_owner ON public.property_images FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND ((p.status='available' AND NOT COALESCE(p.sample,false)) OR p.owner_id=auth.uid())) OR public.is_admin());
CREATE POLICY images_owner_insert ON public.property_images FOR INSERT TO authenticated WITH CHECK(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND p.owner_id=auth.uid()) OR public.is_admin());
CREATE POLICY images_owner_update ON public.property_images FOR UPDATE TO authenticated USING(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND p.owner_id=auth.uid()) OR public.is_admin()) WITH CHECK(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND p.owner_id=auth.uid()) OR public.is_admin());
CREATE POLICY images_owner_delete ON public.property_images FOR DELETE TO authenticated USING(EXISTS(SELECT 1 FROM public.properties p WHERE p.id=property_id AND p.owner_id=auth.uid()) OR public.is_admin());
CREATE OR REPLACE FUNCTION public.remoderate_property_images() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
BEGIN
 IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
  IF TG_OP='UPDATE' AND NEW.property_id IS DISTINCT FROM OLD.property_id THEN RAISE EXCEPTION 'Image cannot be moved between listings'; END IF;
  UPDATE public.properties SET status='pending_review',verification_status='pending',featured=false WHERE id=CASE WHEN TG_OP='DELETE' THEN OLD.property_id ELSE NEW.property_id END AND status='available' AND owner_id=auth.uid();
 END IF;
 RETURN NULL;
END$$;
REVOKE ALL ON FUNCTION public.remoderate_property_images() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS remoderate_property_images ON public.property_images;
CREATE TRIGGER remoderate_property_images AFTER INSERT OR UPDATE OR DELETE ON public.property_images FOR EACH ROW EXECUTE FUNCTION public.remoderate_property_images();

-- Non-recursive, security-definer membership checks never return message bodies or emails.
CREATE OR REPLACE FUNCTION public.can_access_conversation(cid uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT auth.uid() IS NOT NULL AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.conversations c WHERE c.id=cid AND c.created_by=auth.uid()) OR EXISTS(SELECT 1 FROM public.messages m WHERE m.conversation_id=cid AND (m.sender_id=auth.uid() OR m.recipient_id=auth.uid())))
$$;
CREATE OR REPLACE FUNCTION public.can_send_message(cid uuid,target uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT auth.uid() IS NOT NULL AND target<>auth.uid() AND EXISTS(SELECT 1 FROM public.profiles WHERE id=target) AND (
 (EXISTS(SELECT 1 FROM public.conversations WHERE id=cid AND created_by=auth.uid()) AND NOT EXISTS(SELECT 1 FROM public.messages WHERE conversation_id=cid))
 OR EXISTS(SELECT 1 FROM public.messages WHERE conversation_id=cid AND ((sender_id=auth.uid() AND recipient_id=target) OR (recipient_id=auth.uid() AND sender_id=target))))
$$;
REVOKE ALL ON FUNCTION public.can_access_conversation(uuid),public.can_send_message(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_conversation(uuid),public.can_send_message(uuid,uuid) TO authenticated;
CREATE POLICY conversation_read ON public.conversations FOR SELECT TO authenticated USING(public.can_access_conversation(id));
CREATE POLICY conversation_insert ON public.conversations FOR INSERT TO authenticated WITH CHECK(created_by=auth.uid());
CREATE POLICY participant_read ON public.conversation_participants FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.is_admin());
CREATE POLICY message_read ON public.messages FOR SELECT TO authenticated USING(sender_id=auth.uid() OR recipient_id=auth.uid() OR public.is_admin());
CREATE POLICY message_insert ON public.messages FOR INSERT TO authenticated WITH CHECK(sender_id=auth.uid() AND public.can_send_message(conversation_id,recipient_id));
CREATE POLICY message_mark_read ON public.messages FOR UPDATE TO authenticated USING(recipient_id=auth.uid()) WITH CHECK(recipient_id=auth.uid());
CREATE OR REPLACE FUNCTION public.guard_message_read_update() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN IF (to_jsonb(NEW)-'is_read') IS DISTINCT FROM (to_jsonb(OLD)-'is_read') THEN RAISE EXCEPTION 'Only the read state can be changed'; END IF; RETURN NEW; END$$;
REVOKE ALL ON FUNCTION public.guard_message_read_update() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_message_read_update ON public.messages;
CREATE TRIGGER guard_message_read_update BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.guard_message_read_update();
CREATE POLICY notification_read ON public.notifications FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY notification_mark_read ON public.notifications FOR UPDATE TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE POLICY notification_insert ON public.notifications FOR INSERT TO authenticated WITH CHECK(public.is_admin() OR user_id=auth.uid() OR (type='new_message' AND EXISTS(SELECT 1 FROM public.messages m WHERE m.conversation_id::text=data->>'conversation_id' AND m.sender_id=auth.uid() AND m.recipient_id=notifications.user_id AND m.sender_id::text=data->>'sender_id')));
CREATE OR REPLACE FUNCTION public.guard_notification_read_update() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
BEGIN IF (to_jsonb(NEW)-'is_read') IS DISTINCT FROM (to_jsonb(OLD)-'is_read') THEN RAISE EXCEPTION 'Only the read state can be changed'; END IF; RETURN NEW; END$$;
REVOKE ALL ON FUNCTION public.guard_notification_read_update() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_notification_read_update ON public.notifications;
CREATE TRIGGER guard_notification_read_update BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.guard_notification_read_update();
CREATE OR REPLACE FUNCTION public.conversation_profile_summaries(ids uuid[]) RETURNS TABLE(id uuid,first_name text,last_name text,avatar_url text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
 SELECT p.id,p.first_name,p.last_name,p.avatar_url FROM public.profiles p WHERE p.id=ANY(ids) AND auth.uid() IS NOT NULL AND
 (p.id=auth.uid() OR public.is_admin() OR EXISTS(SELECT 1 FROM public.messages m WHERE (m.sender_id=auth.uid() AND m.recipient_id=p.id) OR (m.recipient_id=auth.uid() AND m.sender_id=p.id)))
$$;
REVOKE ALL ON FUNCTION public.conversation_profile_summaries(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.conversation_profile_summaries(uuid[]) TO authenticated;
NOTIFY pgrst,'reload schema';
