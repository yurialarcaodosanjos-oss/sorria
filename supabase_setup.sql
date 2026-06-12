-- ============================================================
-- #Smile — database schema
-- Run this once in your Supabase SQL editor:
--   1. Go to your Supabase project
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New query"
--   4. Paste this entire file
--   5. Click "Run" (or press Cmd/Ctrl + Enter)
-- ============================================================

-- ============================================================
-- TABLE: shirts
-- One row per shirt code. Optional claimed_email if someone
-- claimed it on the scan page.
-- ============================================================
create table if not exists public.shirts (
  code           text primary key,
  claimed_email  text,
  claimed_at     timestamptz,
  created_at     timestamptz default now()
);

-- ============================================================
-- TABLE: smiles
-- One row per logged smile.
-- ============================================================
create table if not exists public.smiles (
  id           bigserial primary key,
  shirt_code   text not null references public.shirts(code) on delete cascade,
  city         text,
  story        text,
  visitor_id   text,
  created_at   timestamptz default now()
);

-- index for fast lookups by shirt code
create index if not exists smiles_shirt_code_idx on public.smiles (shirt_code);
create index if not exists smiles_created_at_idx on public.smiles (created_at desc);

-- ============================================================
-- ROW-LEVEL SECURITY
-- We allow public reads of shirts and smiles (the map needs to
-- show everyone's smiles to everyone). Writes are also public
-- but rate-limited — for the test phase this is fine. Later you
-- can lock this down further.
-- ============================================================
alter table public.shirts enable row level security;
alter table public.smiles enable row level security;

-- shirts: anyone can read, anyone can insert (to mint new codes on first scan)
drop policy if exists "shirts_select_all" on public.shirts;
create policy "shirts_select_all" on public.shirts for select using (true);

drop policy if exists "shirts_insert_all" on public.shirts;
create policy "shirts_insert_all" on public.shirts for insert with check (true);

-- shirts: allow upserts (so claiming a shirt works)
drop policy if exists "shirts_update_all" on public.shirts;
create policy "shirts_update_all" on public.shirts for update using (true) with check (true);

-- smiles: anyone can read, anyone can insert
drop policy if exists "smiles_select_all" on public.smiles;
create policy "smiles_select_all" on public.smiles for select using (true);

drop policy if exists "smiles_insert_all" on public.smiles;
create policy "smiles_insert_all" on public.smiles for insert with check (true);

-- ============================================================
-- OPTIONAL: a few seed shirts so the test starts with data
-- Comment these out if you'd rather start empty.
-- ============================================================
insert into public.shirts (code) values
  ('SMILE1'), ('SMILE2'), ('SMILE3'), ('DEMO1')
on conflict (code) do nothing;

-- ============================================================
-- All set! Switch back to the editor and start building.
-- To view your data later: Table Editor → shirts / smiles
-- ============================================================
