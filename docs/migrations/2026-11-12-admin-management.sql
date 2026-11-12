-- Administrative roles, suspension state and activity-log access.
-- Applied to project rvwirpfclysapqtnrlvx on 2026-11-12.

alter table public.profiles add column if not exists admin_role text;
alter table public.profiles add column if not exists is_suspended boolean not null default false;
alter table public.profiles add column if not exists suspended_at timestamptz;
alter table public.profiles add column if not exists suspended_reason text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_admin_role_check') then
    alter table public.profiles add constraint profiles_admin_role_check
      check (admin_role is null or admin_role in ('super_admin','admin','editor','support'));
  end if;
end $$;

update public.profiles set admin_role = 'super_admin' where is_admin = true and admin_role is null;

grant select, insert, update, delete on public.admin_activity to authenticated;
grant select, insert, update, delete on public.audit_logs to authenticated;

alter table public.admin_activity enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists admin_activity_admin_rw on public.admin_activity;
create policy admin_activity_admin_rw on public.admin_activity
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs
  for select to authenticated using (public.is_admin());

drop policy if exists audit_logs_service_insert on public.audit_logs;
create policy audit_logs_service_insert on public.audit_logs
  for insert to authenticated with check (public.is_admin());

create index if not exists admin_activity_created_at_idx on public.admin_activity (created_at desc);
create index if not exists admin_activity_admin_id_idx on public.admin_activity (admin_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists profiles_admin_role_idx on public.profiles (admin_role) where admin_role is not null;
