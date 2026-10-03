-- S1-b (03.10.2026), pela leitura a frio do Sol (o achado 2, Blocking: a função da base era chamável diretamente com a
-- chave pública, e a marca era do chamador). Aplicado pelo lugar de direção a 03.10.2026 pelo conector. A função só aceita
-- chamadas que tragam a chave que só a Vercel conhece (o resumo sha256 dela fica numa tabela privada; a chave em claro só na
-- variável sensível SUGESTOES_CHAVE da Vercel, nos três ambientes); uma tranca serializa a contagem do teto diário; a marca
-- tem de ter 64 caracteres; as marcas expiradas apagam-se de hora a hora (tarefa sugestoes-marcas). A função antiga, sem
-- chave, é apagada. Este ficheiro não tem segredo nenhum: o resumo da chave vive só na base, e a chave só na Vercel.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.sugestoes_segredos (
  nome text primary key,
  resumo text not null
);
alter table public.sugestoes_segredos enable row level security;
revoke all on table public.sugestoes_segredos from anon, authenticated;

drop function if exists public.enviar_sugestao(text, text, text, text, text, text, text);

create or replace function public.enviar_sugestao(
  p_chave text, p_lingua text, p_pagina text, p_procurou text, p_estudo text, p_outro text, p_contacto text, p_marca text
) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_id uuid;
  v_n integer;
  v_dia integer;
  v_resumo text;
begin
  select resumo into v_resumo from sugestoes_segredos where nome = 'chave';
  if v_resumo is null or p_chave is null or encode(digest(p_chave, 'sha256'), 'hex') <> v_resumo then
    raise exception 'chave';
  end if;
  if coalesce(btrim(p_procurou), '') = '' and coalesce(btrim(p_estudo), '') = '' and coalesce(btrim(p_outro), '') = '' then
    raise exception 'vazia';
  end if;
  if p_lingua not in ('pt', 'en') then
    raise exception 'lingua';
  end if;
  if p_marca is null or length(p_marca) <> 64 then
    raise exception 'marca';
  end if;
  perform pg_advisory_xact_lock(hashtext('sugestoes'));
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

revoke execute on function public.enviar_sugestao(text, text, text, text, text, text, text, text) from public, authenticated;
grant execute on function public.enviar_sugestao(text, text, text, text, text, text, text, text) to anon;

select cron.schedule('sugestoes-marcas', '7 * * * *', $$delete from public.sugestoes_limites where ate < now();$$);
