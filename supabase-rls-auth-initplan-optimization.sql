-- Optimize simple RLS auth.uid() expressions by wrapping them in SELECT so
-- Postgres can evaluate the stable auth function once per statement.
-- Policies that already contain a scalar SELECT auth.uid() are intentionally
-- skipped to avoid double-wrapping mixed expressions.
DO $$
DECLARE
  p record;
  stmt text;
  new_qual text;
  new_check text;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        coalesce(qual, '') ~* 'auth\.uid\(\)'
        OR coalesce(with_check, '') ~* 'auth\.uid\(\)'
      )
      AND coalesce(qual, '') || ' ' || coalesce(with_check, '') !~* 'select[[:space:]]+auth\.uid\(\)'
  LOOP
    new_qual := CASE WHEN p.qual IS NULL THEN NULL
      ELSE regexp_replace(p.qual, 'auth\.uid\(\)', '(select auth.uid())', 'gi') END;
    new_check := CASE WHEN p.with_check IS NULL THEN NULL
      ELSE regexp_replace(p.with_check, 'auth\.uid\(\)', '(select auth.uid())', 'gi') END;
    stmt := format('ALTER POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    IF new_qual IS NOT NULL THEN
      stmt := stmt || format(' USING (%s)', new_qual);
    END IF;
    IF new_check IS NOT NULL THEN
      stmt := stmt || format(' WITH CHECK (%s)', new_check);
    END IF;
    EXECUTE stmt;
  END LOOP;
END $$;
