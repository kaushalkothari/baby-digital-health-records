-- Link follow-up visits to a prior visit (same child).

alter table public.hospital_visits
  add column if not exists linked_visit_id uuid references public.hospital_visits (id) on delete set null;

create index if not exists hospital_visits_linked_visit_id_idx on public.hospital_visits (linked_visit_id);

comment on column public.hospital_visits.linked_visit_id is 'Optional link to the visit this appointment follows up on; must be same child.';

create or replace function public.hospital_visits_linked_visit_valid()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.linked_visit_id is null then
    return new;
  end if;
  if new.linked_visit_id = new.id then
    raise exception 'linked_visit_id cannot reference the same visit';
  end if;
  if exists (
    select 1
    from public.hospital_visits pv
    where pv.id = new.linked_visit_id
      and pv.child_id is distinct from new.child_id
  ) then
    raise exception 'linked_visit_id must reference a visit for the same child';
  end if;
  return new;
end;
$$;

drop trigger if exists hospital_visits_linked_visit_valid_trg on public.hospital_visits;

create trigger hospital_visits_linked_visit_valid_trg
  before insert or update of linked_visit_id, child_id, id on public.hospital_visits
  for each row execute function public.hospital_visits_linked_visit_valid();
