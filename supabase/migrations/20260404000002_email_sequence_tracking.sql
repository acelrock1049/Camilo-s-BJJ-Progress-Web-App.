-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: survey_email_logs
-- Tracks which emails from the drip sequence have been sent to a survey result.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.survey_email_logs (
  id               uuid primary key default gen_random_uuid(),
  survey_result_id uuid not null references public.survey_results(id) on delete cascade,
  email_type       text not null check (email_type in ('email_2', 'email_3', 'email_4')),
  sent_at          timestamptz not null default now(),
  unique(survey_result_id, email_type)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: unsubscribed_emails
-- Tracks users who have opted out of marketing emails.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.unsubscribed_emails (
  email            text primary key,
  unsubscribed_at  timestamptz not null default now()
);

-- Indexes for performance
create index if not exists survey_email_logs_survey_result_id_idx on public.survey_email_logs(survey_result_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.survey_email_logs enable row level security;
alter table public.unsubscribed_emails enable row level security;

-- Anon can insert into unsubscribed_emails via Edge Function (using service role, or we can allow anon if we want direct POST, but service role is better).
-- Service role bypasses RLS for reading logs.

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: get_pending_survey_emails
-- Fetches the next email to send for each survey result based on timeline.
-- Email 2: 2 days after survey
-- Email 3: 4 days after survey (must have received Email 2)
-- Email 4: 7 days after survey (must have received Email 3)
-- Excludes unsubscribed emails.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_pending_survey_emails()
returns table (
  survey_result_id uuid,
  name text,
  email text,
  dominant_belt_color text,
  next_email_type text
) language plpgsql security definer as $$
begin
  return query
  with email_status as (
    select 
      sr.id as sr_id,
      sr.name as sr_name,
      sr.email as sr_email,
      sr.dominant_belt_color as sr_dominant_belt_color,
      sr.survey_completed_at,
      exists (select 1 from public.survey_email_logs sel where sel.survey_result_id = sr.id and sel.email_type = 'email_2') as sent_2,
      exists (select 1 from public.survey_email_logs sel where sel.survey_result_id = sr.id and sel.email_type = 'email_3') as sent_3,
      exists (select 1 from public.survey_email_logs sel where sel.survey_result_id = sr.id and sel.email_type = 'email_4') as sent_4
    from public.survey_results sr
    left join public.unsubscribed_emails ue on lower(sr.email) = lower(ue.email)
    where ue.email is null
  )
  select 
    es.sr_id,
    es.sr_name,
    es.sr_email,
    es.sr_dominant_belt_color,
    case 
      when not es.sent_2 and es.survey_completed_at < now() - interval '2 days' then 'email_2'
      when es.sent_2 and not es.sent_3 and es.survey_completed_at < now() - interval '4 days' then 'email_3'
      when es.sent_3 and not es.sent_4 and es.survey_completed_at < now() - interval '7 days' then 'email_4'
      else null
    end as next_email_type
  from email_status es
  where (
    (not es.sent_2 and es.survey_completed_at < now() - interval '2 days') or
    (es.sent_2 and not es.sent_3 and es.survey_completed_at < now() - interval '4 days') or
    (es.sent_3 and not es.sent_4 and es.survey_completed_at < now() - interval '7 days')
  );
end;
$$;
