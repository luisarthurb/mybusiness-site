-- Newsletter da mybusiness (lista própria, separada do MyPan).
-- Padrão igual a mypan.early_access_submissions: sem acesso direto pela API;
-- o site só chama as 2 funções abaixo; ninguém lê a lista pelo site.

create table mypan.mybusiness_subscribers (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  email             text not null,
  interests         text[] not null default '{}',   -- produtos em que clicou "Me avise"
  source            text not null default 'site',
  status            text not null default 'subscribed',
  consent_version   text not null,
  consented_at      timestamptz not null default now(),
  unsubscribed_at   timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid(),
  constraint mybusiness_subscribers_email_key unique (email),
  constraint mybusiness_subscribers_token_key unique (unsubscribe_token),
  constraint mybusiness_subscribers_email_check check (
    char_length(email) <= 254
    and email = lower(btrim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint mybusiness_subscribers_interests_check check (
    cardinality(interests) <= 30 and array_position(interests, null) is null
  ),
  constraint mybusiness_subscribers_source_check check (source ~ '^[a-z0-9-]{1,32}$'),
  constraint mybusiness_subscribers_status_check check (
    (status = 'subscribed' and unsubscribed_at is null)
    or (status = 'unsubscribed' and unsubscribed_at is not null)
  )
);

comment on table mypan.mybusiness_subscribers is
  'Newsletter semanal da mybusiness. Escrita só via subscribe_/unsubscribe_mybusiness_newsletter. Sem leitura pública. Single opt-in por enquanto: confirmação por email entra antes da 1ª edição.';

alter table mypan.mybusiness_subscribers enable row level security;
revoke all on table mypan.mybusiness_subscribers from anon, authenticated;

-- Inscrever (ou somar um interesse a quem já está inscrito).
create function mypan.subscribe_mybusiness_newsletter(p_response jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email    text;
  v_interest text;
begin
  if p_response is null
     or jsonb_typeof(p_response) <> 'object'
     or octet_length(p_response::text) > 2000 then
    raise exception 'Invalid submission' using errcode = '22023';
  end if;
  if (p_response -> 'consent') is distinct from 'true'::jsonb then
    raise exception 'Consent required' using errcode = '22023';
  end if;

  v_email    := lower(btrim(p_response ->> 'email'));
  v_interest := nullif(btrim(coalesce(p_response ->> 'interest', '')), '');
  if v_interest is not null and v_interest !~ '^[a-z0-9-]{1,64}$' then
    raise exception 'Invalid interest' using errcode = '22023';
  end if;

  insert into mypan.mybusiness_subscribers as s (email, interests, consent_version)
  values (v_email,
          case when v_interest is null then '{}'::text[] else array[v_interest] end,
          '2026-11-24')
  on conflict (email) do update set
    interests = case
      when v_interest is null
        or v_interest = any (s.interests)
        or cardinality(s.interests) >= 30 then s.interests
      else s.interests || v_interest
    end,
    consented_at    = case when s.status = 'unsubscribed' then now() else s.consented_at end,
    status          = 'subscribed',
    unsubscribed_at = null,
    consent_version = excluded.consent_version,
    updated_at      = now();
  -- Sucesso igual para email novo ou repetido: não revela quem já está na lista.
end;
$$;

-- Descadastrar pelo link do email. Token inexistente = não faz nada (sem pista).
create function mypan.unsubscribe_mybusiness_newsletter(p_token uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update mypan.mybusiness_subscribers
     set status = 'unsubscribed',
         unsubscribed_at = coalesce(unsubscribed_at, now()),
         updated_at = now()
   where unsubscribe_token = p_token;
$$;

revoke all on function mypan.subscribe_mybusiness_newsletter(jsonb) from public;
revoke all on function mypan.unsubscribe_mybusiness_newsletter(uuid) from public;
grant execute on function mypan.subscribe_mybusiness_newsletter(jsonb) to anon, authenticated;
grant execute on function mypan.unsubscribe_mybusiness_newsletter(uuid) to anon, authenticated;
