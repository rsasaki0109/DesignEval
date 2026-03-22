create table public.custom_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null default 'カスタム',
  problem text not null,
  created_at timestamptz default now()
);

alter table public.custom_templates enable row level security;

create policy "Users can manage own templates"
  on public.custom_templates for all
  using (auth.uid() = user_id);
