-- ============================================================
-- Projeto Supabase "mybusiness" (NÃO o mypan2). Conteúdo trancado do minicurso.
-- Só a ESTRUTURA mora aqui. O conteúdo (texto das aulas, skills prontas) NUNCA entra
-- neste arquivo: o repositório é público. Ele é carregado direto no banco.
--
-- Regra: quem está logado (qualquer email que entrou pelo link) lê o conteúdo.
-- Ninguém sem login lê nada. Ninguém escreve pela API (só o painel / chave secreta).
-- ============================================================

create table if not exists public.course_content (
  course     text primary key check (course ~ '^[a-z0-9-]{1,40}$'),
  payload    jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.course_content enable row level security;

revoke all on table public.course_content from anon, authenticated;
grant select on table public.course_content to authenticated;

drop policy if exists "logado le conteudo do curso" on public.course_content;
create policy "logado le conteudo do curso"
  on public.course_content
  for select
  to authenticated
  using (true);

-- Teste depois de aplicar (deve dar erro de permissão como anon e funcionar logado):
--   select course from public.course_content;            -- via API sem login: 0 linhas / 401
--   GET /rest/v1/course_content?select=course (com token) -- deve listar 'skills'
