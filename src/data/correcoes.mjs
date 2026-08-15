/**
 * As duas naturezas de uma entrada do registo.
 *
 * Não são a mesma coisa e não se mostram da mesma maneira:
 *
 *   correcao      — o valor publicado estava ERRADO. É uma confissão, e é a
 *                   razão de o registo existir. Conta para «N correções
 *                   publicadas».
 *   actualizacao  — o valor publicado estava CERTO e deixou de estar, porque
 *                   aquilo que mede mudou. Não é um erro, e não conta.
 *   proveniencia  — o valor NÃO mudou; mudou a maneira de lá chegar. Uma fonte
 *                   que muda de endereço é o caso típico. Traz um campo a mais,
 *                   `field`, que diz QUAL o campo de proveniência que mudou —
 *                   e `old_value`/`new_value` são os valores desse campo, não
 *                   os do número publicado. Não conta para as correções nem
 *                   para as actualizações: dizer «o valor mudou de X para X»
 *                   era o que a natureza `actualizacao` obrigava a escrever, e
 *                   era falso. Ver ledger/README.md e DECISIONS §1.36.
 *
 * Misturar as duas faria do registo um diário de alterações, e uma confissão
 * diluída vale menos. Ver DECISIONS §1.11.
 *
 * Os identificadores levam a grafia que a direção fixou (`actualizacao`);
 * os rótulos visíveis levam a grafia do texto publicado («atualização»).
 * O portão aceita, para cada natureza, o identificador ou um dos seus rótulos —
 * e mais nada. Uma entrada rotulada «atualização» com `kind: correcao` no
 * livro-razão falha o build.
 */

export const KINDS = ['correcao', 'actualizacao', 'proveniencia'];

/** As naturezas que o registo do Método lista uma a uma. Ver RegistoCorrecoes. */
export const KINDS_NO_REGISTO = ['correcao', 'actualizacao'];

/**
 * Os campos de proveniência que uma revisão pode nomear. Lista fechada: um
 * `field` escrito à mão («endereço», «url») passaria a parecer um campo e não
 * seria nenhum.
 */
export const CAMPOS_DE_PROVENIENCIA = [
  'source',
  'source_url',
  'document.title',
  'document.edition',
  'document.locator',
  'access_date',
  'excerpt',
];

export const KIND_LABELS = {
  correcao: { pt: 'correção', en: 'correction' },
  actualizacao: { pt: 'atualização', en: 'update' },
  proveniencia: { pt: 'revisão de proveniência', en: 'provenance revision' },
};

/** Todas as formas que o portão aceita ver renderizadas para uma natureza. */
export function renderizacoesAceites(kind) {
  const labels = KIND_LABELS[kind];
  if (!labels) return [];
  return [kind, ...Object.values(labels)];
}
