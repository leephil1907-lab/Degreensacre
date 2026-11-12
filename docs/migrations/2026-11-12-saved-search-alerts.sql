-- Saved-search alerts — applied to project rvwirpfclysapqtnrlvx on 2026-11-12 (phase 5).
--
-- public.saved_searches already existed (id, user_id, name, criteria, alert_enabled,
-- alert_frequency, last_notified_at, created_at) with owner-only RLS, and
-- /api/searches could list/create/delete rows — but nothing in the UI ever wrote
-- to it and nothing ever sent an alert. This migration adds what the alert
-- sender and the dashboard need, without changing the existing column names.

alter table public.saved_searches
  add column if not exists updated_at timestamptz not null default now();

alter table public.saved_searches alter column name set default 'Saved search';
alter table public.saved_searches alter column alert_frequency set default 'instant';

create index if not exists saved_searches_user_idx on public.saved_searches (user_id);
create index if not exists saved_searches_alert_idx on public.saved_searches (alert_enabled) where alert_enabled;

-- One name per customer, so the dashboard list stays readable.
create unique index if not exists saved_searches_user_name_key
  on public.saved_searches (user_id, lower(name));

-- Administrators can read every saved search (support + alert diagnostics);
-- they cannot create or edit another customer's search.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_searches'
      and policyname = 'saved_searches_admin_read'
  ) then
    create policy "saved_searches_admin_read" on public.saved_searches
      for select using (public.is_admin());
  end if;
end $$;
