-- Optional city/state for vaccination facility (stored separately from hospital name).
alter table public.vaccinations
  add column if not exists location_city text null,
  add column if not exists location_state text null;
