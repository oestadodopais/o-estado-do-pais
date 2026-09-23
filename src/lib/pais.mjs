/** B1, peça 3. A pertença é só a tabela da carta; a ordem é a declaração.
 * As duas taxas de desemprego são a mesma medida. Fica a do procedimento,
 * com a comparação europeia e o valor de referência na régua existente. */
import { DOMINIOS, DOMINIO_DAS_MEDIDAS } from '../data/dominios.mjs';
import { getClaim } from './ledger.mjs';
import { WORKS } from '../data/studies.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';

/** @type {Record<string, string>} */
export const MEDIDA_REUNIDA = { 'taxa-de-desemprego-2025': 'taxa-de-desemprego-mip-2025' };
export const CITADAS_NA_LEITURA = ['divida-publica-2025', 'taxa-de-desemprego-mip-2025', 'precos-da-habitacao-2025'];

/**
 * AS LINHAS QUE A LEITURA DO PAÍS CITA (B1c, 22.09.2026; nove desde o R1, 23.09.2026).
 *
 * `CITADAS_NA_LEITURA` é outra coisa: são as três que não voltam a abrir a fila
 * dos cartões. Esta é a lista inteira, e existe porque o âmbito da página do
 * país é a tabela da carta MAIS o que a leitura cita, e isso tem de estar
 * escrito num sítio só. `LeituraDoPais.astro` confere-a contra os valores
 * aprovados, e o `check:pais` lê-a da página construída: são três leituras
 * independentes da mesma lista.
 */
export const LINHAS_DA_LEITURA_DO_PAIS = [
  'divida-publica-2024',
  'divida-publica-2025',
  /* As duas leituras da 2.ª notificação do INE (bloco R1, 23.09.2026, I147). */
  'divida-publica-2025-notificacao-ine-2026-09',
  'divida-publica-2024-notificacao-ine-2026-09',
  'divida-publica-2025-ue',
  'taxa-de-desemprego-2025',
  'taxa-de-desemprego-2025-ue',
  'precos-da-habitacao-2025',
  'precos-da-habitacao-2025-ue',
];

/** @param {'pt'|'en'} lang @param {boolean} resumo */
export function temasDoPais(lang, resumo = false) {
  return DOMINIOS.map(d => {
    const ids = [...new Set(Object.keys(DOMINIO_DAS_MEDIDAS)
      .filter(id => id !== 'indice-de-divida-limite-legal')
      .filter(id => DOMINIO_DAS_MEDIDAS[id] === d.slug).map(id => MEDIDA_REUNIDA[id] ?? id))];
    const todas = ids.map(id => getClaim(id));
    return { slug: d.slug, nome: d.nome[lang], medidas: resumo
      /* A contagem das câmaras ocupa o lugar do antigo cartão do limite legal. */
      ? todas.filter(c => !CITADAS_NA_LEITURA.includes(c.id)).slice(0, d.slug === 'economia-e-financas-publicas' ? 3 : 4) : todas };
  }).filter(d => d.medidas.length);
}
/** @param {'pt'|'en'} lang */
export function estudosRecentes(lang) {
  return WORKS.map(w => fichaDoEstudo(w, lang)).sort((a, b) =>
    (b.data ?? '').localeCompare(a.data ?? '') || WORKS.indexOf(a.work) - WORKS.indexOf(b.work));
}
/* «O que mudou» mudou de casa a 22.09.2026 (B1c): a lista da primeira página,
 * a de cada lugar e o registo inteiro saem agora de `src/lib/mudancas.mjs`, que
 * é onde o âmbito de cada página está escrito, uma vez só. A primeira página
 * deixou de reunir o registo do projeto inteiro: mostra as mudanças das linhas
 * do país, os estudos publicados e as mudanças declaradas, no máximo oito. */
