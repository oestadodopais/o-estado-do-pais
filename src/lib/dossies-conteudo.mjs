/** DO1: composição a partir das publicações, dos registos e do livro. */
import { DOSSIES } from '../data/dossies.mjs';
import { WORKS } from '../data/studies.mjs';
import { pecasPublicadas } from './novidades.mjs';
import { getClaim } from './ledger.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';
import { explicacaoResolvida, resolverExplicacao } from './explicacoes.mjs';
import { itensResolvidos } from './discussao.mjs';
import { registoDaEdicao, manifestoDosRegistos } from './registos.mjs';
import { linhasDoDocumento } from './registo-html.mjs';
import { linhaDoSitioDoEstudo } from './cruzamento.mjs';
import { mudancasDoRegisto } from './mudancas.mjs';
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
/** @param {'pt'|'en'} lang @param {string} [porta] */
export function dossiesDaLista(lang, porta) {
  const publicadas = pecasPublicadas(lang);
  return DOSSIES.filter(d => !porta || d.portas.includes(porta)).map(d => {
    const datas = publicadas.filter(p => p.dossie?.slug === d.slug).map(p => p.data).sort();
    if (!datas.length) throw new Error(`DO1: sem data de publicação: ${d.slug}`);
    return { ...d, recente: datas.at(-1) };
  }).sort((a,b) => b.recente.localeCompare(a.recente) || a.slug.localeCompare(b.slug));
}
/** @param {string} slug @param {'pt'|'en'} lang */
export function dossieResolvido(slug, lang) {
  const d = dossiesDaLista(lang).find(d => d.slug === slug);
  if (!d) throw new Error(`DO1: dossiê desconhecido: ${slug}`);
  const estudos = d.pecas.estudos.map(slug => { const w = WORKS.find(w => w.slug === slug); if (!w) throw new Error(`DO1: estudo ausente: ${slug}`); return fichaDoEstudo(w, lang); });
  const explicacoes = d.pecas.explicacoes.map(slug => explicacaoResolvida(slug, lang));
  const itens = itensResolvidos(lang).filter(e => d.pecas.itens.includes(e.slug));
  const linhas = new Set([...itens, ...explicacoes].flatMap(e => e.linhas));
  for (const e of estudos) {
    const chave = `${e.work.slug}/${e.edicao.lang}`, entrada = /** @type {any} */ (manifestoDosRegistos().registos[chave]);
    const registo = registoDaEdicao(e.work.slug, e.edicao.lang);
    if (!registo || !entrada) throw new Error(`DO1: estudo sem registo: ${chave}`);
    const cruzar = linhaDoSitioDoEstudo(entrada.rh_study, entrada.rh_origens ?? {});
    for (const l of linhasDoDocumento(registo, chave, cruzar)) if (l.siteId) linhas.add(l.siteId);
  }
  const abertura = resolverExplicacao({ ...d, titulo: { pt: [], en: [] }, seccoes: [], naoDiz: [], portas: [{ rota: 'livro' }] }, lang).abertura;
  return { ...d, estudos, explicacoes, itens, abertura, linhas: [...linhas], calendario: d.calendario.map(getClaim), correcoes: mudancasDoRegisto(lang).filter(e => e.tipo === 'correcao' && linhas.has(e.claim)) };
}
