/**
 * As duas naturezas de uma entrada do registo.
 *
 * Não são a mesma coisa e não se mostram da mesma maneira:
 *
 *   correcao      — o valor publicado estava ERRADO. É uma confissão, e é a
 *                   razão de o registo existir. Conta para «N correções
 *                   publicadas».
 *   atualizacao  — o valor publicado estava CERTO e deixou de estar, porque
 *                   aquilo que mede mudou. Não é um erro, e não conta.
 *   proveniencia  — o valor NÃO mudou; mudou a maneira de lá chegar. Uma fonte
 *                   que muda de endereço é o caso típico. Traz um campo a mais,
 *                   `field`, que diz QUAL o campo de proveniência que mudou —
 *                   e `old_value`/`new_value` são os valores desse campo, não
 *                   os do número publicado. Não conta para as correções nem
 *                   para as actualizações: dizer «o valor mudou de X para X»
 *                   era o que a natureza `atualizacao` obrigava a escrever, e
 *                   era falso. Ver ledger/README.md e DECISIONS §1.36.
 *
 * Misturar as duas faria do registo um diário de alterações, e uma confissão
 * diluída vale menos. Ver DECISIONS §1.11.
 *
 * Os identificadores levam a grafia que a direção fixou (`atualizacao`);
 * os rótulos visíveis levam a grafia do texto publicado («atualização»).
 * O portão aceita, para cada natureza, o identificador ou um dos seus rótulos —
 * e mais nada. Uma entrada rotulada «atualização» com `kind: correcao` no
 * livro-razão falha o build.
 */

export const KINDS_DO_LIVRO = /** @type {const} */ (['correcao', 'atualizacao', 'proveniencia']);

export const KINDS = /** @type {const} */ ([...KINDS_DO_LIVRO, 'texto']);

/** As naturezas que o registo do Método lista uma a uma. Ver RegistoCorrecoes. */
export const KINDS_NO_REGISTO = ['correcao', 'atualizacao'];

/**
 * Os campos de proveniência que uma revisão pode nomear. Lista fechada: um
 * `field` escrito à mão («endereço», «url») passaria a parecer um campo e não
 * seria nenhum.
 */
export const CAMPOS_DE_PROVENIENCIA = /** @type {const} */ ([
  'source',
  'source_url',
  'document.title',
  'document.edition',
  'document.locator',
  'access_date',
  'excerpt',
]);

/** @type {Record<string, ParDeLinguas>} */
export const KIND_LABELS = {
  texto: { pt: 'Estudo corrigido', en: 'Study corrected' },
  correcao: { pt: 'correção', en: 'correction' },
  atualizacao: { pt: 'atualização', en: 'update' },
  proveniencia: { pt: 'revisão de proveniência', en: 'provenance revision' },
};

/**
 * Todas as formas que o portão aceita ver renderizadas para uma natureza.
 *
 * @param {string} kind
 */
export function renderizacoesAceites(kind) {
  const labels = KIND_LABELS[kind];
  if (!labels) return [];
  return [kind, ...Object.values(labels)];
}

/** Correções do texto dos estudos. Uma entrada por estudo e data, com as duas línguas. */
export const CORRECOES_TEXTO = [
  { kind: 'texto', slug: 'evora-contas-da-camara-2010-2025', data: '2026-10-30', frase: {
    pt: 'Quatro passagens diziam como facto causas que o relatório de contas de 2025 do município apresenta como leitura ou como explicação parcial; passaram a dizê-lo assim, com a ressalva do valor de 2024 e com o orçamento corrigido explicado.',
    en: "Four passages stated as fact causes that the municipality's 2025 accounts report presents as a reading or as a partial explanation; they now say so, with the caveat on the 2024 value and with the corrected budget explained.",
  } },
  { kind: 'texto', slug: 'orcamento-2027-o-que-muda-e-para-quem', data: '2026-11-02', frase: {
    pt: 'Cinco citações apresentavam o primeiro-ministro e o PS a dizer palavras que são o relato da comunicação do Governo e da página do partido; passaram a nomear esse documento, e uma frase sobre o emprego público deixou de apresentar a UTAO com os dados da DGAEP.',
    en: "Five quotations presented the Prime Minister and the PS as saying words that are the account given by the Government's communication and by the party's web page; they now name that document, and a sentence on public employment no longer presents the UTAO as using the DGAEP's data.",
  } },
  { kind: 'texto', slug: 'a-casa-em-portugal-e-na-europa', data: '2026-11-02', frase: {
    pt: 'As citações passaram a declarar se reproduzem palavras ou um relato, e a identificar a atribuição na página de leitura. O texto do documento alojado foi conservado.',
    en: 'Quotations now declare whether they reproduce words or an account, and identify attribution on the reading page. The text of the hosted document was preserved.',
  } },
];
