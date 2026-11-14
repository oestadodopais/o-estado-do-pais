/** A releitura só acrescenta uma data quando ocorreu depois da leitura.
 * @param {unknown} leitura
 * @param {unknown} releitura
 */
export function releituraPosteriorALeitura(leitura, releitura) {
  /** @param {unknown} valor */
  const dia = valor => /^\d{4}-\d{2}-\d{2}/.exec(String(valor ?? ''))?.[0];
  const primeira = dia(leitura), ultima = dia(releitura);
  return Boolean(primeira && ultima && ultima > primeira);
}
