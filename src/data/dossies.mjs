/** DO1: dois assuntos vivos, com as peças declaradas pelo lugar de direção. */
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
    calendario: ['oe-2027-calendario-final-global'],
  },
  {
    slug: 'a-casa-em-portugal',
    titulo: { pt: 'A casa em Portugal', en: 'Housing in Portugal' },
    ambito: { pt: 'O custo da casa em Portugal e na Europa, quem a paga, quem fica de fora e o que o Estado faz.', en: 'The cost of a home in Portugal and in Europe, who pays for it, who is left out and what the State does.' },
    escrita: '2026-10-29',
    abertura: [
      { pt: ['O estudo lê os preços, as rendas, o crédito e as leis deste ano nos números do Eurostat, do INE e do Banco de Portugal, e cada atualização traz a sua data.'], en: ["The study reads prices, rents, credit and this year's laws in Eurostat's, the INE's and the Bank of Portugal's figures, and each update carries its date."] },
      { pt: ['A porta «Habitação» tem os números do país; o que se disser a seguir sobre a casa junta-se aqui.'], en: ["The «Housing» door has the country's figures; whatever is said next about housing gathers here."] },
    ],
    portas: ['habitacao'],
    pecas: { estudos: ['a-casa-em-portugal-e-na-europa'], explicacoes: [], itens: [] },
    calendario: [],
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
