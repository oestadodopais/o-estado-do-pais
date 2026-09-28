/** A história do número, distinta da história da sua proveniência. */
/** @param {Record<string, any>} linha */
export const entradasDoValor = (linha) => (Array.isArray(linha.corrections) ? linha.corrections : []).filter((c) => c && ['correcao', 'atualizacao'].includes(c.kind));
/** @param {Record<string, any>} c */
export const assinaturaDoValor = (c) => ({ date: c.date, kind: c.kind, old_value: c.old_value, new_value: c.new_value });

/** Normaliza só a forma da casa, sem arredondar nem passar por float.
 * @param {unknown} valor */
export function numeroDaCasa(valor) {
  if (typeof valor !== 'string' || !/^[−-]?\d+(?:[ \u00a0\u202f]\d{3})*(?:,\d+)?$/.test(valor)) return null;
  let s = valor.replace(/[ \u00a0\u202f]/g, '').replace('−', '-');
  let [inteiro, fracao = ''] = s.split(',');
  inteiro = inteiro.replace(/^(-?)0+(?=\d)/, '$1');
  fracao = fracao.replace(/0+$/, '');
  s = inteiro + (fracao ? ',' + fracao : '');
  return s === '-0' ? '0' : s;
}

/** @param {Record<string, any>} linha @param {Array<Record<string, any>> | undefined} seladas
 * @param {string} onde @param {string[]} erros */
export function conferirHistoriaDoValor(linha, seladas, onde, erros) {
  const entradas = entradasDoValor(linha);
  if (seladas && JSON.stringify(entradas.slice(0, seladas.length).map(assinaturaDoValor)) !== JSON.stringify(seladas)) {
    erros.push(`${onde} história do valor: uma entrada selada foi retirada ou alterada.`);
  }
  if (entradas.length !== (seladas?.length ?? 0)) {
    erros.push(`${onde} história do valor: a lista tem ${entradas.length} entradas e o registo sela ${seladas?.length ?? 0}.`);
  }
  let anterior = seladas?.[0]?.old_value ?? entradas[0]?.old_value;
  let dia = '';
  for (const c of entradas) {
    if (String(c.date) < dia) erros.push(`${onde} história do valor: as entradas não estão por ordem cronológica.`);
    dia = String(c.date);
    if (numeroDaCasa(c.old_value) === null || numeroDaCasa(c.new_value) === null) {
      erros.push(`${onde} história do valor: os valores escrevem-se na forma de número da casa.`);
    }
    if (numeroDaCasa(c.old_value) !== numeroDaCasa(anterior)) {
      erros.push(`${onde} história do valor: "old_value" é ${c.old_value}, mas antes vigorava ${anterior}.`);
    }
    anterior = c.new_value;
  }
  if (entradas.length && (numeroDaCasa(linha.value) === null || numeroDaCasa(linha.value) !== numeroDaCasa(anterior))) {
    erros.push(`${onde} história do valor: "value" é ${linha.value}, mas o último "new_value" é ${anterior}.`);
  }
}

/** No próprio dia, o livro já usa o valor novo; antes dele, o valor anterior.
 * @param {Record<string, any>} linha @param {string} dia */
export function valorEm(linha, dia) {
  const entradas = entradasDoValor(linha);
  let valor = entradas[0]?.old_value ?? linha.value;
  for (const c of entradas) if (c.date <= dia) valor = c.new_value;
  return valor;
}
