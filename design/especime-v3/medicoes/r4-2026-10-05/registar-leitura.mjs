/** JD1-c: uma leitura refeita substitui a entrada do autor, dia e âmbito. */
export function registarLeitura(leituras, leitura) {
  // Os dois compositores R4 têm âmbitos distintos no mesmo dia.
  const ambito = l => l.ambito ?? (/^o bloco R4, as séries:/.test(l.o_que) ? 'r4-series' : /^o bloco R4:/.test(l.o_que) ? 'r4-familias' : 'leitura');
  const igual = l => l.quem === leitura.quem && l.quando === leitura.quando && ambito(l) === ambito(leitura);
  const posicao = leituras.findIndex(igual);
  if (posicao < 0) return [...leituras, leitura];
  return leituras.flatMap((l, i) => i === posicao ? [leitura] : igual(l) ? [] : [l]);
}
