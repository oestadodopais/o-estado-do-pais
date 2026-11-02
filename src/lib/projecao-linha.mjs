/**
 * Os bytes protegidos de uma linha: só sai o bloco verifications, desde a
 * chave de topo até à chave de topo seguinte ou ao fim. Não normaliza espaços,
 * comentários, quebras de linha, números nem fontes. O Python usa este módulo
 * por scripts/projetar-linha.mjs, para haver uma única implementação.
 * @param {Buffer} bytes
 * @returns {Buffer}
 */
export function projecaoLinha(bytes) {
  // latin1 conserva uma posição por byte, incluindo os caracteres portugueses.
  const texto = bytes.toString('latin1');
  const partes = [];
  let omitir = false;
  let inicio = 0;
  for (const linha of texto.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    if (/^verifications[ \t]*:/.test(linha)) omitir = true;
    else if (/^(?:[A-Za-z_][\w-]*|"[^"\r\n]+"|'[^'\r\n]+')[ \t]*:/.test(linha)) omitir = false;
    if (!omitir) partes.push(bytes.subarray(inicio, inicio + linha.length));
    inicio += linha.length;
  }
  return Buffer.concat(partes);
}
