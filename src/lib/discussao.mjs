/** V2-b: dados dos itens pelo resolvedor comum das explicações. */
import { ITENS } from '../data/discussao.mjs';
import { resolverExplicacao } from './explicacoes.mjs';
import { routePath } from './routes.mjs';
import { getClaim, parsePtNumber } from './ledger.mjs';
/** @param {'pt'|'en'} lang */
export function itensResolvidos(lang) {
  // A comparação é feita dentro de cada ano; a quebra de perímetro entre anos não altera estes pares.
  for (let ano = 2020; ano <= 2025; ano++) {
    const inicial = getClaim(`saude-total-${ano}-orcamento-oe${ano}`);
    const executado = getClaim(`saude-total-${ano}-execucao-cge${ano}`);
    const a = parsePtNumber(inicial.value), b = parsePtNumber(executado.value);
    if (inicial.reference_date !== String(ano) || executado.reference_date !== String(ano) || a === null || b === null || b <= a) throw new Error(`V2D: a execução da Saúde em ${ano} não sustenta «todos os anos».`);
  }
  const valor = parsePtNumber(getClaim('afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09').value);
  const ids = ['rodoviario-encargos-brutos', 'rodoviario-receitas', 'rodoviario-encargos-liquidos', 'total-encargos-liquidos'];
  if (valor === null || ids.some(id => {const n = parsePtNumber(getClaim(`oe-2027-ppp-${id}-2027`).value); return n === null || n === valor;})) throw new Error('V2B: a comparação das parcerias deixou de estar apoiada.');
  const a = parsePtNumber(getClaim('oe-2027-saude-despesa-efetiva-consolidada-variacao').value);
  const b = parsePtNumber(getClaim('oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao').value);
  if (a === null || b === null || a * b >= 0) throw new Error('V2B: a conclusão da Saúde deixou de ter sinais contrários.');
  return [...ITENS].sort((a,b) => b.escrita.localeCompare(a.escrita)).map(e => {
    const resolvido = resolverExplicacao(e, lang);
    const linhas = new Set([...resolvido.linhas, ...(e.linhas ?? [])]);
    for (const id of [...linhas]) {
      const componentes = getClaim(id).derived_from;
      if (Array.isArray(componentes)) for (const componente of componentes) linhas.add(componente);
    }
    return {...resolvido, linhas: [...linhas], afirmacoes: e.afirmacoes};
  });
}
/** @param {string} slug @param {'pt'|'en'} lang */
export function portaDoItem(slug, lang) { return `${routePath('discussao', lang)}#${slug}`; }
/** @param {string[]} linhas @param {'pt'|'en'} lang @param {boolean} tematica */
export function itensSobreLinhas(linhas, lang, tematica = false) {
  return itensResolvidos(lang).filter(e => e.linhas.some(id => linhas.includes(id)) || (tematica && e.slug === 'saude-no-orcamento'));
}
