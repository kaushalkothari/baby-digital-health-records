-- Capture actual administration site (may differ from recommended site)
alter table public.vaccinations
  add column if not exists administration_site text;

