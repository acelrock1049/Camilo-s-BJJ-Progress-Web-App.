-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: leads
-- Captures all lead sources: scroll popup, exit popup, and survey gate.
-- email is UNIQUE — upserts merge popup + survey data for the same person.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  instagram_handle text,
  source           text not null check (source in ('popup', 'survey')),
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: survey_results
-- One row per quiz submission. email is NOT unique here — re-takes are allowed.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.survey_results (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  email                text not null,
  dominant_belt_color  text not null check (dominant_belt_color in ('white','red','blue','orange','green','yellow')),
  scores               jsonb not null,
  survey_completed_at  timestamptz not null,
  created_at           timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists survey_results_email_idx on public.survey_results(email);
create index if not exists leads_source_idx on public.leads(source);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- Anon can INSERT (public-facing forms). No anon SELECT/UPDATE/DELETE.
-- Service role (used in edge functions) bypasses RLS entirely.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.leads enable row level security;
alter table public.survey_results enable row level security;

create policy "anon_insert_leads"
  on public.leads for insert
  to anon
  with check (true);

create policy "anon_insert_survey_results"
  on public.survey_results for insert
  to anon
  with check (true);
