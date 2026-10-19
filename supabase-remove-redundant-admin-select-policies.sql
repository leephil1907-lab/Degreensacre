-- Remove redundant admin SELECT policies where an identical admin ALL policy
-- already grants SELECT, preserving the effective permissions.
DROP POLICY IF EXISTS property_documents_select_admin ON public.property_documents;
DROP POLICY IF EXISTS verification_documents_select_admin ON public.verification_documents;
