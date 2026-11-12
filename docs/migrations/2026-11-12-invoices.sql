-- ============================================================
-- De-Greenacres — invoice creator (administration)
-- Safe to re-run.
-- ============================================================

create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'void')),
  issue_date date not null default current_date,
  due_date date,
  client_name text not null,
  client_email text,
  client_phone text,
  client_address text,
  property_id uuid references public.properties (id) on delete set null,
  property_title text,
  currency text not null default 'NGN',
  subtotal numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  tax_rate numeric(5, 2) not null default 0,
  tax_amount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  amount_paid numeric(14, 2) not null default 0,
  notes text,
  terms text,
  bank_name text,
  bank_account_name text,
  bank_account_number text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(14, 2) not null default 0,
  amount numeric(14, 2) not null default 0,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists invoices_issue_date_idx on public.invoices (issue_date desc);
create index if not exists invoices_property_id_idx on public.invoices (property_id);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items (invoice_id);

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- Sequential, human-readable numbers: INV-2026-0001
create or replace function public.next_invoice_number()
returns text
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $$
declare
  yr text := to_char(now(), 'YYYY');
  next_seq integer;
begin
  select coalesce(max(nullif(regexp_replace(invoice_number, '^INV-' || yr || '-', ''), '')::integer), 0) + 1
    into next_seq
    from public.invoices
   where invoice_number like 'INV-' || yr || '-%';

  return 'INV-' || yr || '-' || lpad(next_seq::text, 4, '0');
end;
$$;

revoke all on function public.next_invoice_number() from public, anon;
grant execute on function public.next_invoice_number() to authenticated;

alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

drop policy if exists invoices_admin_all on public.invoices;
create policy invoices_admin_all on public.invoices
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists invoice_items_admin_all on public.invoice_items;
create policy invoice_items_admin_all on public.invoice_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.invoice_items to authenticated;

-- Defaults for new documents (edited later in Site Settings).
comment on table public.invoices is 'Sales invoices issued by De-Greenacres Properties Limited.';
