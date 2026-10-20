-- ============================================================
-- #Smile — database schema
-- Run once in Supabase SQL Editor
-- ============================================================

create table if not exists public.shirts (
  code           text primary key,
  claimed_email  text,
  claimed_at     timestamptz,
  created_at     timestamptz default now()
);

create table if not exists public.smiles (
  id           bigserial primary key,
  shirt_code   text not null references public.shirts(code) on delete cascade,
  city         text,
  story        text,
  visitor_id   text,
  created_at   timestamptz default now()
);

create index if not exists smiles_shirt_code_idx on public.smiles (shirt_code);
create index if not exists smiles_created_at_idx on public.smiles (created_at desc);

-- Row-level security: allow public reads and writes for the test phase
alter table public.shirts enable row level security;
alter table public.smiles enable row level security;

drop policy if exists "shirts_select_all" on public.shirts;
create policy "shirts_select_all" on public.shirts for select using (true);

drop policy if exists "shirts_insert_all" on public.shirts;
create policy "shirts_insert_all" on public.shirts for insert with check (true);

drop policy if exists "shirts_update_all" on public.shirts;
create policy "shirts_update_all" on public.shirts for update using (true) with check (true);

drop policy if exists "smiles_select_all" on public.smiles;
create policy "smiles_select_all" on public.smiles for select using (true);

drop policy if exists "smiles_insert_all" on public.smiles;
create policy "smiles_insert_all" on public.smiles for insert with check (true);

-- Pre-create your three test shirt codes
insert into public.shirts (code) values
  ('SMILE1'), ('SMILE2'), ('SMILE3'), ('DEMO1')
on conflict (code) do nothing;
