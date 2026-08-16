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

/**
 * A linha de autoria SAIU daqui a 16.08.2026 (DECISIONS §1.39).
 *
 * Estava no rodapé de todas as páginas e o portão exigia-a. A autoria passou a
 * ter casa própria — o Sobre, nas palavras da direção — e o que todas as
 * páginas levam é a porta para lá, que é o que o portão passou a contar. Uma
 * declaração dita de passagem no rodapé não é o mesmo que uma página que a diz.
 *
 * O que continua a levar a linha, e é outra coisa, é a faixa do observatório
 * por cima de um documento de estudo alojado: aí ela identifica quem alojou o
 * documento, e vive em `src/lib/documentos.mjs`.
 *
 * A DATA DE EDIÇÃO também saiu. `EDITION` era escrita à mão aqui e rendia no
 * cabeçalho e no rodapé de todas as páginas: dizia quando alguém decidiu
 * chamar-lhe uma edição, não quando alguma coisa foi conferida. O sinal de
 * tempo do sítio é agora a data da última reconferência do painel, gerada pelo
 * motor em `src/data/verificacao.mjs`.
 */

/**
 * URL canónico de um caminho interno.
 * Regra: sem barra final, excepto a raiz.
 */
export function canonicalUrl(path) {
  const clean = path === '/' ? '/' : '/' + path.replace(/^\/+/, '').replace(/\/+$/, '');
  return new URL(clean, SITE_URL).href;
}
