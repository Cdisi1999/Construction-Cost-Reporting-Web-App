create extension if not exists "uuid-ossp";

create table if not exists public.daily_entries (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  foreman_name text not null,
  crew_name text not null,
  cost_code text not null,
  cost_code_description text not null,
  scope_of_work text not null,
  location_area text not null,
  quantity_installed numeric(12,2) not null default 0,
  unit_of_measure text not null default 'EA',
  labor_hours numeric(12,2) not null default 0,
  headcount integer not null default 0,
  equipment_hours numeric(12,2) not null default 0,
  overtime_hours numeric(12,2) not null default 0,
  delay_flag boolean not null default false,
  delay_reason text,
  out_of_scope_flag boolean not null default false,
  notes text,
  photo_url text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_cost_summary (
  id bigint generated always as identity primary key,
  week_ending_date date not null,
  cost_code text not null,
  cost_code_description text not null,
  total_quantity numeric(12,2) not null,
  total_labor_hours numeric(12,2) not null,
  total_equipment_hours numeric(12,2) not null,
  total_overtime_hours numeric(12,2) not null,
  entry_count integer not null,
  disruptions_notes text not null default '',
  ai_summary text,
  created_at timestamptz not null default now(),
  unique (week_ending_date, cost_code, cost_code_description)
);

create or replace function public.generate_weekly_report(week_ending_input date)
returns void
language plpgsql
security definer
as $$
begin
  delete from public.weekly_cost_summary where week_ending_date = week_ending_input;

  insert into public.weekly_cost_summary (
    week_ending_date,
    cost_code,
    cost_code_description,
    total_quantity,
    total_labor_hours,
    total_equipment_hours,
    total_overtime_hours,
    entry_count,
    disruptions_notes,
    ai_summary
  )
  select
    week_ending_input,
    d.cost_code,
    d.cost_code_description,
    sum(d.quantity_installed) as total_quantity,
    sum(d.labor_hours) as total_labor_hours,
    sum(d.equipment_hours) as total_equipment_hours,
    sum(d.overtime_hours) as total_overtime_hours,
    count(*) as entry_count,
    string_agg(
      concat(
        to_char(d.entry_date, 'YYYY-MM-DD'),
        ': ',
        case when d.delay_flag then '[DELAY] ' else '' end,
        case when d.out_of_scope_flag then '[OUT-OF-SCOPE] ' else '' end,
        coalesce(d.delay_reason, ''),
        case when d.delay_reason is not null and d.notes is not null then ' | ' else '' end,
        coalesce(d.notes, '')
      ),
      E'\n'
      order by d.entry_date
    ) as disruptions_notes,
    null as ai_summary
  from public.daily_entries d
  where d.entry_date >= (week_ending_input - interval '6 day')
    and d.entry_date <= week_ending_input
  group by d.cost_code, d.cost_code_description;
end;
$$;

alter table public.daily_entries enable row level security;
alter table public.weekly_cost_summary enable row level security;

create policy if not exists "Authenticated can read daily entries"
  on public.daily_entries for select
  to authenticated
  using (true);

create policy if not exists "Authenticated can insert daily entries"
  on public.daily_entries for insert
  to authenticated
  with check (true);

create policy if not exists "Authenticated can read weekly summary"
  on public.weekly_cost_summary for select
  to authenticated
  using (true);

create or replace function public.run_friday_weekly_summary_job()
returns void
language plpgsql
as $$
declare
  week_ending date;
begin
  week_ending := (date_trunc('week', current_date)::date + interval '4 days')::date;
  perform public.generate_weekly_report(week_ending);
end;
$$;

-- Requires pg_cron extension in your Supabase project.
select cron.schedule(
  'friday-weekly-summary',
  '0 16 * * 5',
  $$select public.run_friday_weekly_summary_job();$$
)
on conflict do nothing;
