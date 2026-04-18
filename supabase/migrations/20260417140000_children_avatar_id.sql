-- Optional preset avatar key for child profile (emoji-style picks in the app).
alter table public.children
  add column if not exists avatar_id text null;
