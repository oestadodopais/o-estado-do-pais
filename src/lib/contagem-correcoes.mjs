/** Uma atualização de estudo não é uma correção publicada.
 * @param {number} correcoesDoLivro
 * @param {{kind: string}[]} textos
 */
export function contarCorrecoesPublicadas(correcoesDoLivro, textos) {
  return correcoesDoLivro + textos.filter(e => e.kind === 'texto').length;
}
