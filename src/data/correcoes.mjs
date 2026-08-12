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

export const KINDS = ['correcao', 'actualizacao'];

export const KIND_LABELS = {
  correcao: { pt: 'correção', en: 'correction' },
  actualizacao: { pt: 'atualização', en: 'update' },
};

/** Todas as formas que o portão aceita ver renderizadas para uma natureza. */
export function renderizacoesAceites(kind) {
  const labels = KIND_LABELS[kind];
  if (!labels) return [];
  return [kind, ...Object.values(labels)];
}
