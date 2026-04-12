-- Extra admin details when marking a dose as given
alter table public.vaccinations
  add column if not exists vaccine_manufacturer text,
  add column if not exists manufacturing_date date;
