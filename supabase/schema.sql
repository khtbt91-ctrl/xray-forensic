-- X-Ray Supabase schema

-- Waitlist for Phase 4 / Phase 5 expressions of interest
create table if not exists waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        unique not null,
  created_at timestamptz default now(),
  source     text        default 'about_page'
);

-- Index for fast email lookups / dedup checks
create index if not exists waitlist_email_idx on waitlist (email);
