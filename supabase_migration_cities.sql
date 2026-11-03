-- ============================================================
-- #Smile — city coordinates migration
-- Run this in Supabase → SQL Editor → New query → Run
-- Safe to run more than once.
-- ============================================================


-- ------------------------------------------------------------
-- STEP 1 (required) — store coordinates with each smile
--
-- The city picker now captures exact coordinates when someone
-- chooses their city, so the map plots directly instead of
-- looking the name up every time it loads.
-- ------------------------------------------------------------
alter table public.smiles add column if not exists lat double precision;
alter table public.smiles add column if not exists lng double precision;


-- ------------------------------------------------------------
-- STEP 2 (optional) — see the duplicates you already have
--
-- Run this on its own to list every city spelling currently in
-- your data and how many smiles use each one. This is where
-- "Chicago" and "Chicago, IL" show up as separate rows.
-- ------------------------------------------------------------
-- select city, count(*) as smiles
-- from public.smiles
-- where city is not null
-- group by city
-- order by smiles desc, city;


-- ------------------------------------------------------------
-- STEP 3 (optional) — merge the duplicates
--
-- Edit the pairs below to match what STEP 2 showed you, then
-- uncomment and run. The left side is the canonical label the
-- picker now produces; the right side lists the old spellings.
--
-- Canonical labels are "City, ST" for US cities
-- (Chicago, IL · San Jose, CA · New York City, NY)
-- and "City, Country" elsewhere (Lisbon, Portugal).
-- ------------------------------------------------------------
-- update public.smiles set city = 'Chicago, IL'
--   where lower(trim(city)) in ('chicago', 'chicago il', 'chicago, illinois');

-- update public.smiles set city = 'San Jose, CA'
--   where lower(trim(city)) in ('san jose', 'san jose ca', 'san jose, california');


-- ------------------------------------------------------------
-- STEP 4 (optional) — clear stale coordinates after merging
--
-- If STEP 3 renamed any cities, wipe their stored coordinates so
-- the map re-derives them from the corrected name on next load.
-- ------------------------------------------------------------
-- update public.smiles set lat = null, lng = null
--   where city in ('Chicago, IL', 'San Jose, CA');


-- ============================================================
-- Done. Only STEP 1 is required for the new picker to work.
-- ============================================================
