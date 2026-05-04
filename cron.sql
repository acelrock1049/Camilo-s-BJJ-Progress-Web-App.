-- Ensure required extensions are available
create extension if not exists pg_net;
create extension if not exists pg_cron;



-- Schedule the job (Runs every day at 10:00 AM UTC)
select cron.schedule(
  'process-survey-drip-daily',
  '0 10 * * *',
  $$
    select net.http_post(
      url:='https://bjlbhyklmuorvpedisnl.supabase.co/functions/v1/process-survey-drip',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGJoeWtsbXVvcnZwZWRpc25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODY4MTEsImV4cCI6MjA4NzM2MjgxMX0.QZ0AHIB0QVu9PU6Cp0BwLaj_fy15g8pZPIxiR3klKlE"}'::jsonb
    );
  $$
);
