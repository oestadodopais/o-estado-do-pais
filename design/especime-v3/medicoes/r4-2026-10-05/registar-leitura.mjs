/** JD1-b, achado 17: a identidade da leitura inclui o autor, o dia e o objeto inteiro. */
export function registarLeitura(leituras, leitura) {
  const igual = l => l.quem === leitura.quem && l.quando === leitura.quando && l.o_que === leitura.o_que;
  if (leituras.some(igual)) return leituras;
  return [...leituras, leitura];
}
