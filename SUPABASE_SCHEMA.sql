create table if not exists public.bouquets (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('color', 'mono')),
  flowers jsonb not null default '[]'::jsonb,
  greens  jsonb not null default '[]'::jsonb,
  bush    text  not null,
  title   text,
  created_at timestamptz not null default now()
);

-- Caso a tabela já exista, garantir a coluna title
alter table public.bouquets add column if not exists title text;

create index if not exists bouquets_created_at_idx
  on public.bouquets (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.bouquets enable row level security;

drop policy if exists "bouquets_select_public" on public.bouquets;
create policy "bouquets_select_public"
  on public.bouquets
  for select
  to anon, authenticated
  using (true);

drop policy if exists "bouquets_insert_public" on public.bouquets;
create policy "bouquets_insert_public"
  on public.bouquets
  for insert
  to anon, authenticated
  with check (
    jsonb_typeof(flowers) = 'array'
    and jsonb_array_length(flowers) between 6 and 10
  );
