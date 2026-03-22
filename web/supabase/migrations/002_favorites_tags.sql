-- Add favorite and tags to evaluations
alter table public.evaluations add column if not exists is_favorite boolean default false;
alter table public.evaluations add column if not exists tags text[] default '{}';
