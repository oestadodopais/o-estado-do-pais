/** B1, peça 3. A pertença é só a tabela da carta; a ordem é a declaração.
 * As duas taxas de desemprego são a mesma medida. Fica a do procedimento,
 * com a comparação europeia e o valor de referência na régua existente. */
import { DOMINIOS, DOMINIO_DAS_MEDIDAS } from '../data/dominios.mjs';
import { getClaim, entradasDoRegisto } from './ledger.mjs';
import { WORKS } from '../data/studies.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';
import { nomeDoCartao, nomeDaLinhaDerivada } from './nomes.mjs';
import { MUDANCAS_DO_PROJETO } from '../data/mudancas-do-projeto.mjs';

/** @type {Record<string, string>} */
export const MEDIDA_REUNIDA = { 'taxa-de-desemprego-2025': 'taxa-de-desemprego-mip-2025' };
export const CITADAS_NA_LEITURA = ['divida-publica-2025', 'taxa-de-desemprego-mip-2025', 'precos-da-habitacao-2025'];

/** @param {'pt'|'en'} lang @param {boolean} resumo */
export function temasDoPais(lang, resumo = false) {
  return DOMINIOS.map(d => {
    const ids = [...new Set(Object.keys(DOMINIO_DAS_MEDIDAS)
      .filter(id => DOMINIO_DAS_MEDIDAS[id] === d.slug).map(id => MEDIDA_REUNIDA[id] ?? id))];
    const todas = ids.map(id => getClaim(id));
    return { slug: d.slug, nome: d.nome[lang], medidas: resumo
      ? todas.filter(c => !CITADAS_NA_LEITURA.includes(c.id)).slice(0, 4) : todas };
  }).filter(d => d.medidas.length);
}
/** @param {'pt'|'en'} lang */
export function estudosRecentes(lang) {
  return WORKS.map(w => fichaDoEstudo(w, lang)).sort((a, b) =>
    (b.data ?? '').localeCompare(a.data ?? '') || WORKS.indexOf(a.work) - WORKS.indexOf(b.work));
}
/** Cada entrada nasce de uma correção inteira, mesmo quando partilha a data.
 * As publicações são factos da edição, sem repetir a porta dos três estudos.
 * @param {'pt'|'en'} lang */
export function mudancasDoPais(lang) {
  const publicacoes = estudosRecentes(lang).map(e => {
    if (!e.data) throw new Error(`Publicação sem data: ${e.work.slug}.`);
    return { tipo: 'publicacao', data: e.data, estudo: e };
  });
  // A primeira página reúne o registo do projeto inteiro, incluindo os lugares.
  const correcoes = entradasDoRegisto().filter(e => ['correcao', 'atualizacao'].includes(e.kind))
    .map(e => {
      if (!e.date) throw new Error(`Correção sem data: ${e.claimId}, entrada ${e.n}.`);
      const linha = getClaim(e.claimId);
      return { tipo: 'correcao', data: e.date, n: e.n, claim: e.claimId,
        nome: nomeDaLinhaDerivada(linha, lang) ?? nomeDoCartao(linha, lang),
        antes: e.old_value, depois: e.new_value,
        unidade: typeof linha.unit === 'string' ? linha.unit : null };
    }).sort((a, b) => a.claim.localeCompare(b.claim) || a.n - b.n);
  const projeto = MUDANCAS_DO_PROJETO.map(e => ({ ...e, tipo: 'projeto' }));
  return [...projeto, ...publicacoes, ...correcoes].sort((a,b) => b.data.localeCompare(a.data));
}
