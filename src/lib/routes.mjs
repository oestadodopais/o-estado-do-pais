/**
 * Tabela de rotas — uma só, partilhada por:
 *   - as páginas (navegação, ligação para a outra língua)
 *   - o <head> (canonical + hreflang)
 *   - o sitemap (astro.config.mjs)
 *
 * PT é primário em / ; EN espelha em /en/.
 * Nunca duas edições mantidas à mão: um caminho PT tem sempre um par EN.
 */

/**
 * @typedef {'pt'|'en'} Lingua
 * @typedef {{ lang: string, hreflang: string, path: string }} Alternativa
 * @typedef {{ key: string, lang: string, params: { slug?: string } }} Rota
 */

export const LANGS = /** @type {const} */ (['pt', 'en']);

/** Valores usados no atributo hreflang. */
export const HREFLANG = { pt: 'pt-PT', en: 'en' };

/** A língua primária: recebe também o x-default. */
export const PRIMARY_LANG = 'pt';

/**
 * Cada chave é uma página lógica. `:slug` é o único parâmetro suportado.
 * Rotas futuras reservadas: municipio -> /municipios/:slug , /en/municipalities/:slug
 *
 * `documento` não é uma página deste sítio: é o estudo original, alojado tal
 * como foi publicado, com uma faixa nossa no topo e mais nada. Vive debaixo do
 * endereço do estudo porque é do estudo que ele é — ver src/lib/documentos.mjs.
 *
 * `linha` é o endereço de uma afirmação do livro-razão, e o slug é o id da
 * própria afirmação — que o validador já obriga a ser minúsculas, algarismos e
 * hífenes. É para aqui que aponta cada selo de proveniência: o Método promete,
 * nas duas línguas, que o selo é a porta para a linha, e sem esta rota a
 * promessa era falsa (auditoria de 13.08.2026, F1).
 */
export const ROUTES = {
  home: { pt: '/', en: '/en' },
  metodo: { pt: '/metodo', en: '/en/method' },
  estudos: { pt: '/estudos', en: '/en/studies' },
  estudo: { pt: '/estudos/:slug', en: '/en/studies/:slug' },
  documento: { pt: '/estudos/:slug/documento', en: '/en/studies/:slug/document' },
  livro: { pt: '/livro-razao', en: '/en/ledger' },
  linha: { pt: '/livro-razao/:slug', en: '/en/ledger/:slug' },
};

/**
 * Normaliza um caminho: sem barra final, excepto a raiz.
 * @param {string|undefined|null} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (!path) return '/';
  const p = path.split('?')[0].split('#')[0];
  const stripped = p.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

/**
 * Extrai o caminho normalizado de um URL absoluto (usado pelo sitemap).
 * @param {string} url
 * @returns {string}
 */
export function pathFromUrl(url) {
  try {
    return normalizePath(new URL(url).pathname);
  } catch {
    return normalizePath(url);
  }
}

/**
 * Caminho de uma rota, numa língua. `params.slug` quando a rota o pede.
 * @param {string} key
 * @param {string} lang
 * @param {{ slug?: string }} [params]
 * @returns {string}
 */
export function routePath(key, lang, params = {}) {
  const entry = ROUTES[key];
  if (!entry) throw new Error(`routes: rota desconhecida "${key}"`);
  const template = entry[lang];
  if (!template) throw new Error(`routes: a rota "${key}" não tem caminho em "${lang}"`);
  if (template.includes(':slug')) {
    if (!params.slug) throw new Error(`routes: a rota "${key}" exige um slug`);
    return template.replace(':slug', params.slug);
  }
  return template;
}

/**
 * O padrão de um gabarito de rota, ancorado.
 *
 * `:slug` casa com um segmento e mais nada (`[^/]+`) — é o que faz
 * `/estudos/x/documento` NÃO casar com `/estudos/:slug`, e casar só com a rota
 * cujo gabarito tem o sufixo certo. Sem isto, uma rota com segmentos depois do
 * parâmetro seria ambígua.
 *
 * @param {string} template
 * @returns {RegExp}
 */
function padraoDe(template) {
  const alvo = normalizePath(template);
  const escapado = alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escapado.replace(':slug', '([^/]+)') + '$');
}

/**
 * Descobre a que rota lógica pertence um caminho.
 * @param {string} path
 * @returns {Rota|null}
 */
export function matchPath(path) {
  const target = normalizePath(path);
  // Primeiro os caminhos literais, depois os que têm parâmetro:
  // /estudos tem de ganhar a /estudos/:slug.
  for (const pass of [0, 1]) {
    for (const [key, byLang] of Object.entries(ROUTES)) {
      for (const lang of LANGS) {
        const template = byLang[lang];
        if (!template) continue;
        const hasParam = template.includes(':slug');
        if ((pass === 0) === hasParam) continue;
        if (!hasParam) {
          if (normalizePath(template) === target) return { key, lang, params: {} };
        } else {
          const m = target.match(padraoDe(template));
          if (m) return { key, lang, params: { slug: m[1] } };
        }
      }
    }
  }
  return null;
}

/**
 * Alternativas de língua de um caminho, prontas para <link rel="alternate">
 * e para o sitemap. Inclui x-default a apontar para a língua primária.
 * Devolve null para caminhos fora da tabela (ex.: /404).
 * @param {string} path
 * @returns {Alternativa[]|null}
 */
export function alternatesFor(path) {
  const hit = matchPath(path);
  if (!hit) return null;
  const list = LANGS.map((lang) => ({
    lang,
    hreflang: HREFLANG[lang],
    path: routePath(hit.key, lang, hit.params),
  }));
  const primary = list.find((l) => l.lang === PRIMARY_LANG);
  if (primary) list.push({ lang: PRIMARY_LANG, hreflang: 'x-default', path: primary.path });
  return list;
}

/**
 * O caminho equivalente na outra língua (para o botão PT/EN).
 * @param {string} path
 * @param {string} currentLang
 * @returns {string}
 */
export function otherLanguagePath(path, currentLang) {
  const hit = matchPath(path);
  if (!hit) return currentLang === 'pt' ? ROUTES.home.en : ROUTES.home.pt;
  const other = LANGS.find((l) => l !== currentLang);
  return routePath(hit.key, other, hit.params);
}
