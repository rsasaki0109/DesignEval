create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  problem text not null,
  answer text not null,
  result jsonb not null,
  model text not null,
  average_score numeric(3,1),
  decision text,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.evaluations enable row level security;

create policy "Users can manage own evaluations"
  on public.evaluations for all
  using (auth.uid() = user_id);

create policy "Anyone can view public evaluations"
  on public.evaluations for select
  using (is_public = true);

-- Indexes
create index idx_evaluations_user_created
  on public.evaluations(user_id, created_at desc);
