-- Performance hardening: add indexes for foreign-key columns identified by Supabase advisors.
-- These indexes are additive and do not change row access policies or application behavior.
CREATE INDEX IF NOT EXISTS idx_contact_requests_assigned_to_fk ON public.contact_requests (assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_property_id_fk ON public.conversations (property_id);
CREATE INDEX IF NOT EXISTS idx_development_images_development_id_fk ON public.development_images (development_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id_fk ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_property_alerts_user_id_fk ON public.property_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_property_documents_uploaded_by_fk ON public.property_documents (uploaded_by);
CREATE INDEX IF NOT EXISTS idx_property_moderation_notes_admin_id_fk ON public.property_moderation_notes (admin_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id_fk ON public.reports (reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reviewed_by_fk ON public.reports (reviewed_by);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id_fk ON public.reviews (property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id_fk ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sender_id_fk ON public.sent_emails (sender_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_by_fk ON public.site_settings (updated_by);
CREATE INDEX IF NOT EXISTS idx_verification_documents_uploaded_by_fk ON public.verification_documents (uploaded_by);
CREATE INDEX IF NOT EXISTS idx_verification_documents_verification_id_fk ON public.verification_documents (verification_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_property_id_fk ON public.verification_records (property_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_verified_by_fk ON public.verification_records (verified_by);
CREATE INDEX IF NOT EXISTS idx_viewing_requests_agent_id_fk ON public.viewing_requests (agent_id);
CREATE INDEX IF NOT EXISTS idx_viewing_requests_property_id_fk ON public.viewing_requests (property_id);
CREATE INDEX IF NOT EXISTS idx_viewings_property_id_fk ON public.viewings (property_id);
CREATE INDEX IF NOT EXISTS idx_viewings_user_id_fk ON public.viewings (user_id);
