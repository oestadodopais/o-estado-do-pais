import { dossiesDaLista } from './dossies-conteudo.mjs';
import { dossieDaPeca } from './dossies.mjs';
import { dataPublicacao } from './publicacao.mjs';
import { WORKS } from '../data/studies.mjs';
import { ITENS } from '../data/discussao.mjs';
import { EXPLICACOES } from '../data/explicacoes/index.mjs';
import { resolverExplicacao } from './explicacoes.mjs';
import { mudancasDoRegisto } from './mudancas.mjs';
import { routePath } from './routes.mjs';
import { portaDoItem } from './discussao.mjs';
import { atualizacaoDaNovidade } from './atualizacao-da-novidade.mjs';
/** @param {'pt'|'en'} lang */
export function pecasPublicadas(lang) {
  /** @type {any[]} */
  const pecas = [];
  for (const w of WORKS) {
    const edicao = w.editions.find(e => e.lang === lang) ?? [...w.editions].sort((a,b) => (dataPublicacao(w,b) ?? '').localeCompare(dataPublicacao(w,a) ?? ''))[0];
    const data = edicao && dataPublicacao(w,edicao);
    if (!data) continue;
    pecas.push({ id: `estudo:${w.slug}`, tipo: 'estudo', data, origem: w.publication === 'declared' ? 'publicacao.declarada' : 'publicacao.gerada', rota: routePath('estudo', lang, {slug:w.slug}), edicao });
  }
  for (const [tipo, lista] of [['discussao', ITENS], ['explicacao', EXPLICACOES]]) for (const e of /** @type {any[]} */ (lista)) {
    if (!e.publicado) continue;
    pecas.push({ id: `${tipo}:${e.slug}`, tipo, data: e.publicado, origem: 'publicacao.declarada', rota: tipo === 'discussao' ? portaDoItem(e.slug,lang) : routePath('explicacao',lang,{slug:e.slug}), titulo: resolverExplicacao(e,lang).titulo });
  }
  for (const p of pecas) p.dossie = dossieDaPeca(p.tipo, p.id.slice(p.id.indexOf(':') + 1));
  const atualizacao = atualizacaoDaNovidade(mudancasDoRegisto(lang)[0],lang);
  if (atualizacao) pecas.push(atualizacao);
  // Empate: estudo antes das outras peças; depois identidade, para uma ordem estável nas duas línguas.
  return pecas.sort((a,b) => b.data.localeCompare(a.data) || Number(b.tipo==='estudo')-Number(a.tipo==='estudo') || a.id.localeCompare(b.id));
}

/** DO2: a posição segue a publicação; a data segue o bloco da peça mais recente.
 * @param {any[]} pecas @param {any[]} dossies @param {'pt'|'en'} lang */
export function agruparNovidades(pecas, dossies, lang) {
  const vistos = new Set(), entradas = [];
  for (const peca of pecas) {
    if (!peca.dossie) { entradas.push(peca); continue; }
    const slug = peca.dossie.slug;
    if (vistos.has(slug)) continue;
    vistos.add(slug);
    const d = dossies.find(d => d.slug === slug);
    if (!d) throw new Error(`DO2: dossiê sem composição: ${slug}`);
    entradas.push({id:`dossie:${slug}`, tipo:'dossie', dossie:d, data:d.recente, origem:d.origemRecente, rota:routePath('dossie',lang,{slug})});
  }
  return entradas.slice(0,5);
}
/** @param {'pt'|'en'} lang */
export function entradasDasNovidades(lang) {
  return agruparNovidades(pecasPublicadas(lang), dossiesDaLista(lang), lang);
}
