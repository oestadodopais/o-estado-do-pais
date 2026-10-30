/** DO1: um assunto vivo, com as peças declaradas pelo lugar de direção. */
import { getClaim } from '../lib/ledger.mjs';
import { WORKS } from './studies.mjs';
import { EXPLICACOES } from './explicacoes/index.mjs';
import { ITENS } from './discussao.mjs';
import { ENTRADAS } from './primeira-pagina.mjs';
export const DOSSIES = [
  {
    slug: 'orcamento-2027',
    titulo: { pt: 'O Orçamento de 2027', en: 'The 2027 Budget' },
    ambito: { pt: 'A proposta de Orçamento do Estado para 2027: o que muda e para quem, para onde vai o dinheiro, o que se discute e o calendário.', en: 'The proposed State Budget for 2027: what changes and for whom, where the money goes, what is under discussion and the calendar.' },
    escrita: '2026-10-29',
    abertura: [
      { pt: ['A proposta de Orçamento do Estado para ', { periodo: 'pm-q3-3-r37-c3' }, ' foi aprovada na generalidade a ', { periodo: 'og1-votacao-generalidade-oficial' }, ' e segue para a especialidade até à votação final global, marcada para ', { periodo: 'oe-2027-calendario-final-global' }, '.'], en: ['The proposed State Budget for ', { periodo: 'pm-q3-3-r37-c3' }, ' passed at the general vote on ', { periodo: 'og1-votacao-generalidade-oficial' }, ' and goes to the detailed stage until the final global vote, scheduled for ', { periodo: 'oe-2027-calendario-final-global' }, '.'] },
      { pt: ['Os textos abaixo dizem o que a proposta muda e para quem, para onde vai o dinheiro, o que a Saúde e as parcerias rodoviárias recebem, e como cada partido votou e o que disse.'], en: ['The texts below say what the proposal changes and for whom, where the money goes, what Health and the road partnerships receive, and how each party voted and what it said.'] },
    ],
    portas: ['estado-e-economia'],
    pecas: { estudos: ['orcamento-2027-o-que-muda-e-para-quem'], explicacoes: ['dinheiro-do-estado-2027'], itens: ['orcamento-2027-generalidade', 'saude-no-orcamento', 'parcerias-rodoviarias'] },
    leitura: [
      {id:'bloco-2', pt:'Em resumo', en:'In brief'},
      {id:'bloco-6', pt:'O que este projeto conclui', en:'What this project concludes'},
      {id:'bloco-30', pt:'O que muda para quem trabalha por conta de outrem', en:'What changes for employees'},
      {id:'bloco-34', pt:'O que muda para quem ganha o salário mínimo e para quem trabalha para o Estado', en:'What changes for those on the minimum wage and for those who work for the State'},
      {id:'bloco-37', pt:'O que muda para quem recebe pensão', en:'What changes for pensioners'},
      {id:'bloco-39', pt:'O que muda para quem arrenda ou compra casa', en:'What changes for those who rent or buy a home'},
      {id:'bloco-41', pt:'O que muda para as empresas', en:'What changes for companies'},
    ],
    calendario: ['oe-2027-calendario-final-global'],
  },

];
/** @param {typeof DOSSIES} dossies */
export function conferirDossies(dossies) {
  const slugs = new Set(), pecas = new Set();
  /** @type {Record<string, {slug: string}[]>} */
  const origens = { estudos: WORKS, explicacoes: EXPLICACOES, itens: ITENS };
  for (const d of dossies) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug) || slugs.has(d.slug)) throw new Error(`DO1: slug inválido ou repetido: ${d.slug}`);
    slugs.add(d.slug);
    for (const id of d.calendario) getClaim(id);
    if (!Object.values(d.pecas).flat().length) throw new Error(`DO1: dossiê sem peça: ${d.slug}`);
    if (d.portas.some(id => !ENTRADAS.some(e => e.id === id))) throw new Error(`DO1: porta desconhecida: ${d.slug}`);
    for (const [tipo, lista] of Object.entries(d.pecas)) for (const slug of lista) {
      if (!origens[tipo].some(e => e.slug === slug)) throw new Error(`DO1: peça inexistente: ${tipo}:${slug}`);
      const chave = `${tipo}:${slug}`;
      if (pecas.has(chave)) throw new Error(`DO1: peça repetida: ${chave}`);
      pecas.add(chave);
    }
  }
}
conferirDossies(DOSSIES);
