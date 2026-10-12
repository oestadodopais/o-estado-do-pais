/** RP4-n-i: o estado de um endereço não prova uma leitura desta linha. */
/** @param {{access_date_kind?: string, verifications?: unknown[]}} claim */
export function copiaSemLeitura(claim) {
  return claim.access_date_kind === 'hosted-copy' && !(claim.verifications ?? []).length;
}
/**
 * @template T
 * @param {{access_date_kind?: string, verifications?: unknown[]}} claim
 * @param {T} estadoDoEndereco
 */
export function estadoDaCopia(claim, estadoDoEndereco) {
  return copiaSemLeitura(claim) ? null : estadoDoEndereco;
}
