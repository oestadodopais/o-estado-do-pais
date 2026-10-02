-- A caixa das sugestões dos leitores (bloco S1). Aplicado pelo lugar de direção a 02.10.2026 no projeto da base
-- (Supabase, região eu-west-1, Irlanda), em duas migrações pelo conector da sessão, e guardado aqui como o registo
-- do que a base é. Ninguém lê nem escreve nas tabelas pela chave pública: a única porta é a função enviar_sugestao,
-- que só insere, limita por marca horária (5 por marca e por hora), por dia (200 na caixa inteira) e aceita só o que
-- o formulário traz. A retenção: uma sugestão decidida apaga-se ao fim de 90 dias; uma por decidir, ao fim de 1 ano.
-- Este ficheiro não tem segredo nenhum: a chave pública vive no código da função da Vercel, e o sal da marca só na Vercel.

create table public.sugestoes (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  lingua text not null check (lingua in ('pt', 'en')),
  pagina text check (char_length(pagina) <= 300),
  procurou text check (char_length(procurou) <= 2000),
  estudo text check (char_length(estudo) <= 2000),
  outro text check (char_length(outro) <= 2000),
  contacto text check (char_length(contacto) <= 200),
  decisao text check (decisao in ('aceite', 'recusada', 'juntada')),
  decidido_em timestamptz,
  razao text,
  bloco text
);
alter table public.sugestoes enable row level security;

create table public.sugestoes_limites (
  marca text primary key,
  contagem integer not null default 0,
  ate timestamptz not null
);
alter table public.sugestoes_limites enable row level security;

create or replace function public.enviar_sugestao(
  p_lingua text, p_pagina text, p_procurou text, p_estudo text, p_outro text, p_contacto text, p_marca text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_n integer;
  v_dia integer;
begin
  if coalesce(btrim(p_procurou), '') = '' and coalesce(btrim(p_estudo), '') = '' and coalesce(btrim(p_outro), '') = '' then
    raise exception 'vazia';
  end if;
  if p_lingua not in ('pt', 'en') then
    raise exception 'lingua';
  end if;
  select count(*) into v_dia from sugestoes where criado_em > now() - interval '24 hours';
  if v_dia >= 200 then
    raise exception 'cheia';
  end if;
  delete from sugestoes_limites where ate < now();
  insert into sugestoes_limites (marca, contagem, ate) values (p_marca, 1, now() + interval '1 hour')
    on conflict (marca) do update set contagem = sugestoes_limites.contagem + 1
    returning contagem into v_n;
  if v_n > 5 then
    raise exception 'limite';
  end if;
  insert into sugestoes (lingua, pagina, procurou, estudo, outro, contacto)
    values (p_lingua, left(p_pagina, 300), left(p_procurou, 2000), left(p_estudo, 2000), left(p_outro, 2000), left(p_contacto, 200))
    returning id into v_id;
  return v_id;
end
$$;

revoke all on table public.sugestoes from anon, authenticated;
revoke all on table public.sugestoes_limites from anon, authenticated;
revoke execute on function public.enviar_sugestao(text, text, text, text, text, text, text) from public, authenticated;
grant execute on function public.enviar_sugestao(text, text, text, text, text, text, text) to anon;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
  'sugestoes-retencao',
  '17 4 * * *',
  $$delete from public.sugestoes where (decidido_em is not null and decidido_em < now() - interval '90 days') or (decidido_em is null and criado_em < now() - interval '1 year'); delete from public.sugestoes_limites where ate < now();$$
);
