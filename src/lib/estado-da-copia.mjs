/** RP4-n-i: o estado de um endereço não prova uma leitura desta linha. */
export function copiaSemLeitura(claim) {
  return claim.access_date_kind === 'hosted-copy' && !(claim.verifications ?? []).length;
}
export function estadoDaCopia(claim, estadoDoEndereco) {
  return copiaSemLeitura(claim) ? null : estadoDoEndereco;
}
