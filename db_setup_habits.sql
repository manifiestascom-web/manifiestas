-- 1. TABLA DE HÁBITOS (HABITS)
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  frequency jsonb default '["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]'::jsonb not null, -- días de la semana activos
  streak_current integer default 0 check (streak_current >= 0) not null,
  streak_longest integer default 0 check (streak_longest >= 0) not null,
  category text default 'routine' check (category in ('mind', 'health', 'focus', 'routine')) not null,
  is_archived boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para seguridad de hábitos
alter table public.habits enable row level security;

create policy "Users can view their own habits." on public.habits
  for select using (auth.uid() = user_id);

create policy "Users can insert their own habits." on public.habits
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own habits." on public.habits
  for update using (auth.uid() = user_id);

create policy "Users can delete their own habits." on public.habits
  for delete using (auth.uid() = user_id);


-- 2. TABLA DE LOGS DE HÁBITOS (HABIT_LOGS)
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  completed_at date default current_date not null,
  notes text,
  mood text check (mood in ('excelente', 'bien', 'neutral', 'cansado', 'mal')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint habit_logs_habit_id_completed_at_key unique (habit_id, completed_at)
);

-- Habilitar RLS para seguridad de logs de hábitos
alter table public.habit_logs enable row level security;

create policy "Users can view their own habit logs." on public.habit_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own habit logs." on public.habit_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own habit logs." on public.habit_logs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own habit logs." on public.habit_logs
  for delete using (auth.uid() = user_id);
