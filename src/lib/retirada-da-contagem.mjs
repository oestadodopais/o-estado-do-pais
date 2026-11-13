import {entradasDoValor} from './historia-do-valor.mjs';

/** Só a última entrada do valor pode explicar a contagem atual.
 * @param {Record<string, any>} linha */
export function retiradaDaContagem(linha) {
  const ultima = entradasDoValor(linha).at(-1);
  if (ultima?.event !== 'retirada-de-estudos') return null;
  return {entrada:ultima, indice:linha.corrections.indexOf(ultima)};
}

/** A data só precisa de prefixo quando a razão ainda não a escreve. */
export function razaoContemData(entrada, lang) {
  const data = entrada.date.split('-').reverse().join('.');
  return (entrada[lang === 'pt' ? 'reason' : 'reason_en'] ?? '').includes(data);
}
