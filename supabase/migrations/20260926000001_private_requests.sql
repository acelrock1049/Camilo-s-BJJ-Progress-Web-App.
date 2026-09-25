-- Requests for 1-on-1 private coaching (BJJ or MMA), at the academy or at home.
--
-- Separate from `leads` on purpose: a private request carries details a lead
-- doesn't (location, suburb, who is training, preferred times), and `leads.email`
-- is unique, so a returning person would be rejected there.
--
-- RLS on with no policies: only the ingest-private-request edge function
-- (service role) writes, and nothing is readable with the public anon key.
create table if not exists public.private_requests (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  email            text not null,
  discipline       text not null check (discipline in ('BJJ', 'MMA', 'Not sure')),
  location         text not null check (location in ('academy', 'home')),
  suburb           text,
  participants     text not null,
  preferred_times  text,
  notes            text,
  origen_url       text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  -- Lightweight pipeline so requests can be worked from the Table Editor.
  status           text not null default 'new'
                   check (status in ('new', 'contacted', 'booked', 'lost')),
  constraint home_needs_suburb check (location <> 'home' or coalesce(trim(suburb), '') <> '')
);

alter table public.private_requests enable row level security;

create index if not exists private_requests_created_at_idx
  on public.private_requests (created_at desc);

comment on table public.private_requests is
  'Solicitudes de clases privadas 1 a 1 desde la web. status: new → contacted → booked | lost.';
