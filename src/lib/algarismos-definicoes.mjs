/** EO1-e: só anos e números de escalão podem entrar como algarismos na prosa livre. */
/** @param {string} texto */
export function temAlgarismoLivre(texto) {
  return /\d/u.test(texto.replace(/(?<![\p{L}\p{N}.,])(?:19|20)\d{2}(?![\p{L}\p{N}]|[.,]\d|\s*(?:euros?\b|€|%))|\b(?:escalão|bracket) [1-9](?![\p{L}\p{N}]|[.,]\d)/giu, ''));
}
