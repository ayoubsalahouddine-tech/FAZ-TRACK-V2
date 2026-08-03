create extension if not exists pgcrypto;

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique default (
    'SH-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6))
  ),
  client_id uuid references public.clients(id) on delete set null,
  sender_name text not null,
  receiver_name text not null,
  origin text not null,
  destination text not null,
  weight numeric not null,
  price numeric not null,
  status text not null default 'Pending',
  shipping_date date not null,
  delivery_date date,
  created_at timestamptz not null default now(),
  constraint shipments_status_check check (status in ('Pending', 'In Transit', 'Delivered', 'Cancelled'))
);

create index if not exists idx_shipments_client_id on public.shipments (client_id);
create index if not exists idx_shipments_status on public.shipments (status);
create index if not exists idx_shipments_shipping_date on public.shipments (shipping_date);
create index if not exists idx_shipments_created_at on public.shipments (created_at desc);

alter table public.shipments enable row level security;

drop policy if exists "Public can read shipments" on public.shipments;
create policy "Public can read shipments"
  on public.shipments
  for select
  to public
  using (true);

drop policy if exists "Public can insert shipments" on public.shipments;
create policy "Public can insert shipments"
  on public.shipments
  for insert
  to public
  with check (true);

drop policy if exists "Public can update shipments" on public.shipments;
create policy "Public can update shipments"
  on public.shipments
  for update
  to public
  using (true)
  with check (true);

drop policy if exists "Public can delete shipments" on public.shipments;
create policy "Public can delete shipments"
  on public.shipments
  for delete
  to public
  using (true);