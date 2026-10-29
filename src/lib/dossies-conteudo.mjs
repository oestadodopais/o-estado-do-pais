/** DO1: composição a partir das publicações, dos registos e do livro. */
import { DOSSIES } from '../data/dossies.mjs';
import { EXPLICACOES } from '../data/explicacoes/index.mjs';
import { WORKS } from '../data/studies.mjs';
import { getClaim } from './ledger.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';
import { explicacaoResolvida, resolverExplicacao } from './explicacoes.mjs';
import { itensResolvidos } from './discussao.mjs';
/** Os anos dos títulos e dos âmbitos também se rendem pelo livro.
 * @param {string} texto */
export function partesDoDossie(texto) {
  const id = 'pm-q3-3-r37-c3', valor = String(getClaim(id).reference_date);
  return texto.split(/(\d+)/).filter(Boolean).map(p => {
    if (!/\d/.test(p)) return p;
    if (p !== valor) throw new Error(`DO1: número sem token: ${p}`);
    return { data: { id, campo: 'reference_date', valor } };
  });
}
/** A data mais recente lê os mesmos campos que os blocos imprimem.
 * @param {{estudos: {data: string|null}[], itens: {escrita: string}[], explicacoes: {data: string}[]}} pecas */
export function pecaMaisRecente({estudos, itens, explicacoes}) {
  const datas = [...estudos.map(e => ({data:e.data, origem:'publicacao.declarada'})),
    ...itens.map(e => ({data:e.escrita, origem:'escrita.declarada'})),
    ...explicacoes.map(e => ({data:e.data, origem:'publicacao.declarada'}))].flatMap(e => e.data ? [{...e, data:e.data}] : []);
  const recente = datas.sort((a,b) => b.data.localeCompare(a.data))[0];
  if (!recente) throw new Error('DO1: assunto sem data impressa.');
  return recente;
}
/** @param {'pt'|'en'} lang @param {string} [porta] */
export function dossiesDaLista(lang, porta) {
  return DOSSIES.filter(d => !porta || d.portas.includes(porta)).map(d => {
    const estudos = d.pecas.estudos.map(slug => {
      const w = WORKS.find(w => w.slug === slug);
      if (!w) throw new Error(`DO1: estudo ausente: ${slug}`);
      return fichaDoEstudo(w,lang);
    });
    const explicacoes = d.pecas.explicacoes.map(slug => {
      const e = EXPLICACOES.find(e => e.slug === slug);
      if (!e) throw new Error(`DO1: explicação ausente: ${slug}`);
      return {...explicacaoResolvida(slug,lang), data:e.publicado};
    });
    const itens = itensResolvidos(lang).filter(e => d.pecas.itens.includes(e.slug));
    const recente = pecaMaisRecente({estudos,itens,explicacoes});
    return {...d, estudos, explicacoes, itens, recente:recente.data, origemRecente:recente.origem};
  }).sort((a,b) => b.recente.localeCompare(a.recente) || a.slug.localeCompare(b.slug));
}
/** @param {string} slug @param {'pt'|'en'} lang */
export function dossieResolvido(slug, lang) {
  const d = dossiesDaLista(lang).find(d => d.slug === slug);
  if (!d) throw new Error(`DO1: dossiê desconhecido: ${slug}`);
  const abertura = resolverExplicacao({...d, titulo:{pt:[],en:[]}, seccoes:[], naoDiz:[], portas:[{rota:'livro'}]},lang).abertura;
  return {...d, abertura, calendario:d.calendario.map(getClaim)};
}
