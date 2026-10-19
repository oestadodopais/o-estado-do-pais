/** V2-b: dados dos itens pelo resolvedor comum das explicações. */
import { ITENS } from '../data/discussao.mjs';
import { resolverExplicacao } from './explicacoes.mjs';
import { routePath } from './routes.mjs';
import { getClaim, parsePtNumber } from './ledger.mjs';
/** @param {'pt'|'en'} lang */
export function itensResolvidos(lang) {
  const valor = parsePtNumber(getClaim('afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09').value);
  const ids = ['rodoviario-encargos-brutos', 'rodoviario-receitas', 'rodoviario-encargos-liquidos', 'total-encargos-liquidos'];
  if (valor === null || ids.some(id => {const n = parsePtNumber(getClaim(`oe-2027-ppp-${id}-2027`).value); return n === null || n === valor;})) throw new Error('V2B: a comparação das parcerias deixou de estar apoiada.');
  const a = parsePtNumber(getClaim('oe-2027-saude-despesa-efetiva-consolidada-variacao').value);
  const b = parsePtNumber(getClaim('oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao').value);
  if (a === null || b === null || a * b >= 0) throw new Error('V2B: a conclusão da Saúde deixou de ter sinais contrários.');
  return [...ITENS].sort((a,b) => b.escrita.localeCompare(a.escrita)).map(e => ({...resolverExplicacao(e, lang), afirmacoes:e.afirmacoes}));
}
/** @param {string} slug @param {'pt'|'en'} lang */
export function portaDoItem(slug, lang) { return `${routePath('discussao', lang)}#${slug}`; }
/** @param {string[]} linhas @param {'pt'|'en'} lang @param {boolean} tematica */
export function itensSobreLinhas(linhas, lang, tematica = false) {
  return itensResolvidos(lang).filter(e => e.linhas.some(id => linhas.includes(id)) || (tematica && e.slug === 'saude-no-orcamento'));
}
