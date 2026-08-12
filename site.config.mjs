/**
 * A ÚNICA fonte de verdade sobre o domínio, o nome e a edição.
 *
 * Importado por astro.config.mjs, pelos componentes e pelos scripts do portão.
 * Não repetir o domínio em mais lado nenhum.
 */

/** O domínio canónico, na forma acentuada legível. */
export const SITE_HOST_DISPLAY = 'oestadodopaís.pt';

/**
 * O mesmo domínio em punycode. Derivado, nunca escrito à mão:
 * a WHATWG URL aplica IDNA e devolve xn--oestadodopas-2fb.pt.
 */
export const SITE_URL = new URL(`https://${SITE_HOST_DISPLAY}/`).href;
export const SITE_HOST = new URL(SITE_URL).host;

/** Domínio sem acento. Faz 301 para o canónico (DNS/Vercel, não código). Ver README. */
export const SITE_HOST_UNACCENTED = 'oestadodopais.pt';

export const SITE_NAME = 'O Estado do País';

/** Linha de método. Elemento de identidade: não é traduzida. */
export const METHOD_LINE = 'Portugal, medido. Cada número tem fonte.';

/** Linha de autoria, obrigatória no rodapé de todas as páginas. */
export const AUTHORSHIP_LINE = 'Escrito por IA, dirigido por uma pessoa.';

/**
 * A edição corrente. Deliberada e editorial: muda quando o director decide,
 * não a cada build. É uma data de cabeçalho, não um número do livro-razão.
 */
export const EDITION = {
  iso: '2026-08-12',
  display: '12.08.2026',
};

/**
 * URL canónico de um caminho interno.
 * Regra: sem barra final, excepto a raiz.
 */
export function canonicalUrl(path) {
  const clean = path === '/' ? '/' : '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');
  return new URL(clean, SITE_URL).href;
}
