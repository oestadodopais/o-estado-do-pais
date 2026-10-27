import { dataPublicacao } from './publicacao.mjs';
import { WORKS } from '../data/studies.mjs';
import { ITENS } from '../data/discussao.mjs';
import { EXPLICACOES } from '../data/explicacoes/index.mjs';
import { resolverExplicacao } from './explicacoes.mjs';
import { mudancasDoRegisto } from './mudancas.mjs';
import { routePath } from './routes.mjs';
import { portaDoItem } from './discussao.mjs';
import { ROTULOS_B1 } from '../data/rotulos-b1.mjs';
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
  const ultima = mudancasDoRegisto(lang)[0];
  if (ultima) pecas.push({ id:'atualizacao:registo', tipo:'atualizacao', data:ultima.data, origem:'mudancas.ultima', rota:routePath('correcoes',lang), mudanca:ultima, edicao:ultima.tipo === 'publicacao' ? ultima.estudo.edicao : null, prefixo:ultima.tipo === 'publicacao' ? ROTULOS_B1[lang].estudoPublicado + ' · ' : '', titulo:ultima.tipo === 'publicacao' ? [] : [String(ultima.tipo === 'correcao' ? ultima.motivo : ultima.texto[lang]).split(/(?<=[.!?])\s/)[0]] });
  return pecas.sort((a,b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id));
}
