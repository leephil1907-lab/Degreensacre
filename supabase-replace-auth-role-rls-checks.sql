-- Replace deprecated per-row auth.role() checks with the policy role clause.
-- These policies previously allowed the authenticated Postgres role only.
ALTER POLICY conversations_insert_auth ON public.conversations
  TO authenticated
  WITH CHECK (true);

ALTER POLICY reports_insert_auth ON public.reports
  TO authenticated
  WITH CHECK (true);
