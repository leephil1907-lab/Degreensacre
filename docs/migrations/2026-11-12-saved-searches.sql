-- Saved searches + instant e-mail alerts
-- Applied to project rvwirpfclysapqtnrlvx on 2026-11-12 (phase 5).
--
-- A customer saves the filters they used on /properties. When a property is
-- published that still matches those filters, the site e-mails them once per
-- (search, property) pair — the idempotency key in notifyEvents() prevents
-- duplicate sends.

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  filters jsonb not null default '{}'::jsonb,
  frequency text not null default 'instant' check (frequency in ('instant', 'daily', 'weekly')),
  is_active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now() -- maintained by the API on PATCH
);

create index if not exists saved_searches_user_idx on public.saved_searches (user_id);
create index if not exists saved_searches_active_idx on public.saved_searches (is_active) where is_active;

-- One search name per customer, so the dashboard list stays readable.
create unique index if not exists saved_searches_user_name_key
  on public.saved_searches (user_id, lower(name));

alter table public.saved_searches enable row level security;

drop policy if exists "saved_searches owner access" on public.saved_searches;
create policy "saved_searches owner access" on public.saved_searches
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "saved_searches admin read" on public.saved_searches;
create policy "saved_searches admin read" on public.saved_searches
  for select
  using (public.is_admin());
