-- Инициализация базы данных Supabase для Хань-Лаб
-- Выполнить в SQL Editor панели Supabase

-- Таблица профилей пользователей
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Таблица для синхронизации данных (local-first)
create table public.sync_records (
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('card','review','tone_attempt','diagnostic','settings','note')),
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  primary key (user_id, kind, id)
);

-- Индекс для синхронизации по времени
create index sync_records_server_updated_at_idx on public.sync_records (user_id, server_updated_at);

-- Таблица для проверки активности (keepalive)
create table public.keepalive (
  id int primary key
);

insert into public.keepalive (id) values (1);

-- Включаем RLS
alter table public.profiles enable row level security;
alter table public.sync_records enable row level security;
alter table public.keepalive enable row level security;

-- Политики доступа
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own records" on public.sync_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "public read keepalive" on public.keepalive
  for select using (true);

-- Триггер для автоматического обновления server_updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.server_updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sync_records_updated_at
  before update on public.sync_records
  for each row execute function public.handle_updated_at();

-- Триггер для создания профиля при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
