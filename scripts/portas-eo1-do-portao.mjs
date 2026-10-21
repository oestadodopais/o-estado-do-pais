import fs from 'node:fs';
import { ESTUDO_EO1, PORTAS_EO1 } from '../src/data/portas-eo1.mjs';
import { WORKS } from '../src/data/studies.mjs';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { nomeDoProjeto } from '../src/data/nomes-das-medidas.mjs';
import { routePath } from '../src/lib/routes.mjs';
const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const records = Object.fromEntries(['pt','en'].map(lang => [lang,
  JSON.parse(fs.readFileSync(new URL(`../registos/${ESTUDO_EO1}/${lang}.record.json`, import.meta.url), 'utf8'))]));

/** A porta existe apenas nos dois itens nomeados e na explicação do Orçamento. */
export function conferirPortasDeEntradaEo1(root, rota) {
  const erros = [], portas = new Set();
  const lang = rota?.lang;
  const itens = ['saude-no-orcamento', 'parcerias-rodoviarias'];
  const discussao = rota?.key === 'discussao';
  const explicacao = rota?.key === 'explicacao' && rota.params?.slug === 'dinheiro-do-estado-2026';
  const esperadas = discussao ? itens.length : explicacao ? 1 : 0;
  const contentores = root.querySelectorAll('[data-eo1-porta]');
  if (contentores.length !== esperadas) erros.push(`EO1: portas de entrada: esperadas ${esperadas}, encontradas ${contentores.length}`);
  if (discussao) for (const id of itens)
    if (root.querySelectorAll(`[data-discussao="${id}"] [data-eo1-porta]`).length !== 1)
      erros.push(`EO1: porta de entrada ausente ou repetida no item ${id}`);
  const destino = routePath('estudo', lang, {slug:ESTUDO_EO1});
  const titulo = WORKS.find(w => w.slug === ESTUDO_EO1)?.editions.find(e => e.lang === lang)?.title;
  for (const el of contentores) {
    const links = el.querySelectorAll('a[href]');
    if (discussao && !itens.includes(el.closest('[data-discussao]')?.getAttribute('data-discussao')))
      erros.push('EO1: porta de entrada fora dos dois itens nomeados');
    if (links.length !== 1 || links[0]?.getAttribute('href') !== destino ||
        normal(el.textContent) !== `${lang === 'pt' ? 'O estudo: ' : 'The study: '}${titulo} →`)
      erros.push('EO1: porta de entrada com título ou destino diferente');
    else portas.add(links[0]);
  }
  return {erros, portas, esperadas, encontradas:contentores.length};
}

/** Só devolve nós concretos depois de conferir nomes, destinos e multiplicidade. */
export function portasObrigatoriasEo1(root, rota) {
  const {portas, erros} = conferirPortasDeEntradaEo1(root, rota);
  if (rota?.params?.slug !== ESTUDO_EO1 || !['estudo','documento'].includes(rota.key))
    return { portas, erros };
  const lang = rota.lang;
  if (rota.key === 'documento') {
    // A faixa faz de cabeçalho do documento. Só a marca e a porta conferidas
    // pertencem à mobília; uma ligação acrescentada continua na conta.
    const marca = root.querySelectorAll('[data-oedp-faixa] a[data-oedp-marca]');
    const voltar = root.querySelectorAll('[data-oedp-faixa] a[data-oedp-voltar]');
    const destino = routePath('estudo',lang,{slug:ESTUDO_EO1});
    if (root.querySelectorAll('[data-oedp-faixa] a[href]').length !== 4 || marca.length !== 1 || voltar.length !== 1 ||
        marca[0]?.getAttribute('href') !== destino || voltar[0]?.getAttribute('href') !== destino ||
        normal(marca[0]?.textContent) !== 'O Estado do País' ||
        normal(voltar[0]?.textContent) !== (lang === 'pt' ? 'Ler ↑' : 'Read ↑'))
      erros.push('EO1: cabeçalho do documento diferente da forma da casa');
    else { portas.add(marca[0]); portas.add(voltar[0]); }
    for (const [id, nomes] of Object.entries(PORTAS_EO1)) {
      const href = (lang === 'pt' ? '/o-que-se-discute/' : '/en/under-discussion/') + '#' + id;
      const links = root.querySelectorAll('[data-oedp-moldura] a[href]').filter(a => a.getAttribute('href') === href);
      if (links.length !== 1 || normal(links[0]?.textContent) !== nomes[lang])
        erros.push(`EO1: porta temática diferente: ${id}`);
      else portas.add(links[0]);
    }
    return { portas, erros };
  }
  const blocos = records[lang].blocks.filter(b => b.kind === 'paragraph' && b.source_rows?.length);
  if (root.querySelectorAll('[data-fontes-da-unidade]').length !== blocos.length)
    erros.push('EO1: quantidade de portas de fontes diferente dos parágrafos');
  for (const b of blocos) {
    const key = `${ESTUDO_EO1}/${lang}#${b.i}`;
    const containers = root.querySelectorAll(`[data-fontes-da-unidade="${key}"]`);
    const links = containers[0]?.querySelectorAll('a[href]') ?? [];
    if (containers.length !== 1 || links.length !== b.source_rows.length) {
      erros.push(`EO1: multiplicidade de portas diferente: ${key}`); continue;
    }
    links.forEach((a,i) => {
      const id = b.source_rows[i];
      if (a.getAttribute('href') !== routePath('linha',lang,{slug:id}) ||
          normal(a.textContent) !== (nomeDoProjeto(id)?.[lang] ?? ROTULOS_B1[lang].fonte))
        erros.push(`EO1: porta sem correspondência com a linha: ${id}`);
      else portas.add(a);
    });
  }
  return { portas, erros };
}
