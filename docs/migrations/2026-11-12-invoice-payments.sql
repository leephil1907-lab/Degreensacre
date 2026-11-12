-- ============================================================
-- Invoice payments — automatic balance and status tracking
-- Safe to re-run.
-- ============================================================

create table if not exists public.invoice_payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  method text not null default 'bank_transfer'
    check (method in ('bank_transfer', 'cash', 'cheque', 'card', 'pos', 'other')),
  reference text,
  paid_at date not null default current_date,
  notes text,
  recorded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists invoice_payments_invoice_id_idx on public.invoice_payments (invoice_id);
create index if not exists invoice_payments_paid_at_idx on public.invoice_payments (paid_at desc);

-- Whatever path writes a payment (UI, API, SQL), the invoice totals and status
-- follow automatically. amount_paid is always the sum of recorded payments.
create or replace function public.sync_invoice_payment_totals()
returns trigger
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $$
declare
  target uuid;
  paid numeric(14, 2);
begin
  target := case when tg_op = 'DELETE' then old.invoice_id else new.invoice_id end;

  select coalesce(sum(amount), 0) into paid
    from public.invoice_payments
   where invoice_id = target;

  update public.invoices i
     set amount_paid = least(paid, i.total),
         status = case
                    when i.status = 'void' then 'void'
                    when paid >= i.total and i.total > 0 then 'paid'
                    when paid > 0 then 'partially_paid'
                    when i.status in ('paid', 'partially_paid') then 'sent'
                    else i.status
                  end,
         updated_at = now()
   where i.id = target
     and (i.amount_paid is distinct from least(paid, i.total)
          or i.status is distinct from case
                    when i.status = 'void' then 'void'
                    when paid >= i.total and i.total > 0 then 'paid'
                    when paid > 0 then 'partially_paid'
                    when i.status in ('paid', 'partially_paid') then 'sent'
                    else i.status
                  end);

  return null;
end;
$$;

drop trigger if exists invoice_payments_sync on public.invoice_payments;
create trigger invoice_payments_sync
  after insert or update or delete on public.invoice_payments
  for each row execute function public.sync_invoice_payment_totals();

alter table public.invoice_payments enable row level security;

drop policy if exists invoice_payments_admin_all on public.invoice_payments;
create policy invoice_payments_admin_all on public.invoice_payments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Clients may read the invoices and receipts addressed to their own e-mail.
drop policy if exists invoices_client_read_own on public.invoices;
create policy invoices_client_read_own on public.invoices
  for select to authenticated
  using (
    client_email is not null
    and lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists invoice_items_client_read_own on public.invoice_items;
create policy invoice_items_client_read_own on public.invoice_items
  for select to authenticated
  using (
    exists (
      select 1
        from public.invoices i
       where i.id = invoice_items.invoice_id
         and i.client_email is not null
         and lower(i.client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists invoice_payments_client_read_own on public.invoice_payments;
create policy invoice_payments_client_read_own on public.invoice_payments
  for select to authenticated
  using (
    exists (
      select 1
        from public.invoices i
       where i.id = invoice_payments.invoice_id
         and i.client_email is not null
         and lower(i.client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

grant select, insert, update, delete on public.invoice_payments to authenticated;
grant select on public.invoices to authenticated;
grant select on public.invoice_items to authenticated;

-- Keep amount_paid consistent with existing rows on first run.
update public.invoices i
   set amount_paid = coalesce((select sum(p.amount) from public.invoice_payments p where p.invoice_id = i.id), 0);
