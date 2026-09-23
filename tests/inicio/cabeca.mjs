/** C1: um H1; nas páginas interiores, a marca é um p menor do que o título.
 * O portão check:cabeca e o captor B2 usam este mesmo predicado.
 */
export function falhasDaCabeca({ ficheiro, familia, wordmark, h1 }) {
  const falhas = [];
  if (h1?.quantidade !== 1) falhas.push(`${ficheiro}: C1, ${h1?.quantidade ?? 0} H1`);
  if (familia === 'pais') {
    if (wordmark?.elemento !== 'h1') falhas.push(`${ficheiro}: C1, o nome do projeto deixou de ser H1`);
  } else if (wordmark?.elemento !== 'p' || !Number.isFinite(wordmark.tamanho) ||
      !Number.isFinite(h1?.tamanho) || !(wordmark.tamanho < h1.tamanho)) {
    falhas.push(`${ficheiro}: C1, wordmark ${wordmark?.tamanho ?? 'ausente'} px, H1 ${h1?.tamanho ?? 'ausente'} px`);
  }
  return falhas;
}
