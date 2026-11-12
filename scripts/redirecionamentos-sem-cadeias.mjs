/** O destino de uma retirada tem de ser servido diretamente na origem canónica. */
export function conferirCadeias(entradas, tabela) {
  return entradas.filter(r => tabela.some(outro => outro.status >= 300 && outro.status < 400 &&
    !outro.has && !outro.missing && new RegExp('^' + outro.src + '$').test(r.headers.Location)))
    .map(r => `RET1 cadeia de redirecionamentos: ${r.src} -> ${r.headers.Location}`);
}
