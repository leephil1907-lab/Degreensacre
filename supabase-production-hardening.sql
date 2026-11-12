-- ============================================================
-- De-Greenacres — production hardening migration
-- Reviewed: 12 November 2026
-- Target: existing Supabase project (safe to re-run)
--
-- Fixes found during the production audit:
--   1. verification_records was readable by every visitor (anon), including
--      internal moderator notes. The application does not read this table
--      publicly, so access is now restricted to administrators.
--   3. contact_requests accepted inserts from anon with no constraints
--      (spam bypassing the app's rate limits). Insert payloads are now
--      constrained to unassigned, status='new' rows.
--   4. development_images was world-readable even for unpublished
--      developments; access now follows the parent development.
--   5. Missing indexes on hot foreign-key paths (RLS join predicates).
-- ============================================================

begin;

-- 1. verification_records -----------------------------------------------------
drop policy if exists verification_records_select_all on public.verification_records;

drop policy if exists verification_records_select_admin on public.verification_records;
create policy verification_records_select_admin
  on public.verification_records
  for select
  to authenticated
  using (public.is_admin());

-- Property owners may see that a verification exists, but not moderator notes.
revoke select on public.verification_records from anon;

-- 2. properties.admin_notes ---------------------------------------------------
-- DELIBERATELY NOT CHANGED HERE.
-- `properties.admin_notes` is currently selectable by the public anon key
-- (verified against the live REST API). Revoking the column would break every
-- `select('*')` call in the app, so it must ship together with an application
-- change: replace `select('*')` on properties with explicit column lists and
-- then run:
--   revoke select (admin_notes) on public.properties from anon, authenticated;
-- Preferred long-term fix: move moderator notes to property_moderation_notes
-- (already admin-only) and drop the column from properties.

-- 3. contact_requests ---------------------------------------------------------
drop policy if exists contact_requests_insert_public on public.contact_requests;
create policy contact_requests_insert_public
  on public.contact_requests
  for insert
  to anon, authenticated
  with check (
    status = 'new'
    and assigned_to is null
  );

-- 4. development_images -------------------------------------------------------
drop policy if exists development_images_public_select on public.development_images;
create policy development_images_public_select
  on public.development_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.developments d
      where d.id = development_images.development_id
        and (d.is_published or public.is_admin())
    )
  );

-- 5. Foreign-key indexes used by RLS predicates and joins ---------------------
create index if not exists agents_user_id_idx on public.agents (user_id);
create index if not exists agents_agency_id_idx on public.agents (agency_id);
create index if not exists conversation_participants_conversation_id_idx
  on public.conversation_participants (conversation_id);
create index if not exists conversation_participants_user_id_idx
  on public.conversation_participants (user_id);
create index if not exists conversations_created_by_idx on public.conversations (created_by);
create index if not exists conversations_property_id_idx on public.conversations (property_id);
create index if not exists development_images_development_id_idx
  on public.development_images (development_id);
create index if not exists property_documents_property_id_idx
  on public.property_documents (property_id);
create index if not exists property_moderation_notes_property_id_idx
  on public.property_moderation_notes (property_id);
create index if not exists verification_records_property_id_idx
  on public.verification_records (property_id);
create index if not exists verification_documents_verification_id_idx
  on public.verification_documents (verification_id);
create index if not exists viewing_requests_property_id_idx on public.viewing_requests (property_id);
create index if not exists viewing_requests_user_id_idx on public.viewing_requests (user_id);
create index if not exists viewing_requests_agent_id_idx on public.viewing_requests (agent_id);
create index if not exists saved_searches_user_id_idx on public.saved_searches (user_id);
create index if not exists property_alerts_user_id_idx on public.property_alerts (user_id);
create index if not exists property_views_property_id_idx on public.property_views (property_id);
create index if not exists reports_reporter_id_idx on public.reports (reporter_id);
create index if not exists reports_reviewed_by_idx on public.reports (reviewed_by);
create index if not exists admin_activity_admin_id_idx on public.admin_activity (admin_id);
create index if not exists audit_logs_user_id_idx on public.audit_logs (user_id);
create index if not exists sent_emails_sender_id_idx on public.sent_emails (sender_id);
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);
create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);

commit;
