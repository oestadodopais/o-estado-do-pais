/** Nenhuma referência a uma linha retirada pode sobreviver no HTML publicado. */
export function conferirRetiradas(html, linhas) {
 return [...linhas.values()].filter(l => l.publication === 'withdrawn' && html.includes(l.id))
  .map(l => `RP4N-e: uma linha retirada chegou a uma página: ${l.id}`);
}
