-- ============================================================
-- DIGIBOUQUET — schema do banco de dados
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN
-- ============================================================

-- Tabela principal de buquês salvos no jardim
create table if not exists public.bouquets (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('color', 'mono')),
  flowers jsonb not null default '[]'::jsonb,   -- ex: ["rose","peony","rose",...]
  greens  jsonb not null default '[]'::jsonb,   -- ex: ["eucalyptus","fern"]
  bush    text  not null,                       -- ex: "bush-1"
  created_at timestamptz not null default now()
);

-- Índice para listar do mais recente pro mais antigo
create index if not exists bouquets_created_at_idx
  on public.bouquets (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.bouquets enable row level security;

-- Qualquer pessoa (anon) pode ler todos os buquês
drop policy if exists "bouquets_select_public" on public.bouquets;
create policy "bouquets_select_public"
  on public.bouquets
  for select
  to anon, authenticated
  using (true);

-- Qualquer pessoa (anon) pode criar um buquê
drop policy if exists "bouquets_insert_public" on public.bouquets;
create policy "bouquets_insert_public"
  on public.bouquets
  for insert
  to anon, authenticated
  with check (
    -- valida tamanho do array de flores (entre 6 e 10)
    jsonb_typeof(flowers) = 'array'
    and jsonb_array_length(flowers) between 6 and 10
  );

-- Sem políticas de UPDATE/DELETE = ninguém apaga ou edita pelo client
