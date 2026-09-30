/** N1: a porta de cada cartão resolve numa única página de assunto. */
import { ENTRADAS } from '../data/primeira-pagina.mjs';
/** A linha curta do índice conserva o assunto da linha completa da porta. */
export function linhaDoIndice(entrada, lang = 'pt') {
  const prefixo = lang === 'pt' ? 'Os números de Portugal sobre ' : 'Portugal’s figures on ';
  const linha = entrada.linha[lang];
  if (!linha.startsWith(prefixo)) throw new Error(`O âmbito de ${entrada.id} não nomeia Portugal.`);
  const assunto = linha.slice(prefixo.length);
  return assunto.charAt(0).toUpperCase() + assunto.slice(1);
}
/** @param {string} id @param {'pt'|'en'} lang */
export function portaDoCartao(id, lang = 'pt') {
  const reunido = id === 'taxa-de-desemprego-2025' ? 'taxa-de-desemprego-mip-2025' : id;
  const entradas = ENTRADAS.filter((e) => e.seccoes.some((s) => s.cartoes.includes(reunido)));
  if (entradas.length !== 1) throw new Error(`O cartão ${id} tem ${entradas.length} páginas de assunto.`);
  return `${entradas[0].rota[lang]}#m-${reunido}`;
}
export const PORTAS_DOS_BLOCOS = {
  precos: { entrada: 'precos', pt: 'Ver os números dos preços', en: 'See the price figures' },
  casa: { entrada: 'habitacao', pt: 'Ver os números da habitação', en: 'See the housing figures' },
  trabalho: { entrada: 'emprego', pt: 'Ver os números do emprego', en: 'See the employment figures' },
  estado: { entrada: 'estado-e-economia', pt: 'Ver os números do Estado e da economia', en: 'See the state and economy figures' },
  pobreza: { entrada: 'pobreza-e-desigualdade', pt: 'Ver os números da pobreza e da desigualdade', en: 'See the poverty and inequality figures' },
};
