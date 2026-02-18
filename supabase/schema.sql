-- Smart Bookmark App schema (run in Supabase SQL Editor)
-- This creates a per-user bookmarks table with RLS + Realtime.

create extension if not exists "pgcrypto";

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookmarks_user_created_idx
  on public.bookmarks (user_id, created_at desc);

alter table public.bookmarks enable row level security;

drop policy if exists "Users can view their own bookmarks" on public.bookmarks;
create policy "Users can view their own bookmarks"
on public.bookmarks
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own bookmarks" on public.bookmarks;
create policy "Users can insert their own bookmarks"
on public.bookmarks
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own bookmarks" on public.bookmarks;
create policy "Users can delete their own bookmarks"
on public.bookmarks
for delete
using (auth.uid() = user_id);

-- Realtime: ensure delete payload includes old row data.
alter table public.bookmarks replica identity full;

-- Realtime: add table to publication (safe if already added).
alter publication supabase_realtime add table public.bookmarks;

