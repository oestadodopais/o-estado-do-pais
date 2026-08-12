/**
 * Tabela de rotas — uma só, partilhada por:
 *   - as páginas (navegação, ligação para a outra língua)
 *   - o <head> (canonical + hreflang)
 *   - o sitemap (astro.config.mjs)
 *
 * PT é primário em / ; EN espelha em /en/.
 * Nunca duas edições mantidas à mão: um caminho PT tem sempre um par EN.
 */

export const LANGS = /** @type {const} */ (['pt', 'en']);

/** Valores usados no atributo hreflang. */
export const HREFLANG = { pt: 'pt-PT', en: 'en' };

/** A língua primária: recebe também o x-default. */
export const PRIMARY_LANG = 'pt';

/**
 * Cada chave é uma página lógica. `:slug` é o único parâmetro suportado.
 * Rotas futuras reservadas: municipio -> /municipios/:slug , /en/municipalities/:slug
 */
export const ROUTES = {
  home: { pt: '/', en: '/en' },
  metodo: { pt: '/metodo', en: '/en/method' },
  estudos: { pt: '/estudos', en: '/en/studies' },
  estudo: { pt: '/estudos/:slug', en: '/en/studies/:slug' },
};

/** Normaliza um caminho: sem barra final, excepto a raiz. */
export function normalizePath(path) {
  if (!path) return '/';
  const p = path.split('?')[0].split('#')[0];
  const stripped = p.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

/** Extrai o caminho normalizado de um URL absoluto (usado pelo sitemap). */
export function pathFromUrl(url) {
  try {
    return normalizePath(new URL(url).pathname);
  } catch {
    return normalizePath(url);
  }
}

/** Caminho de uma rota, numa língua. `params.slug` quando a rota o pede. */
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
 * Descobre a que rota lógica pertence um caminho.
 * Devolve { key, lang, params } ou null.
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
          const prefix = template.replace(':slug', '');
          if (target.startsWith(prefix)) {
            const slug = target.slice(prefix.length);
            if (slug && !slug.includes('/')) return { key, lang, params: { slug } };
          }
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

/** O caminho equivalente na outra língua (para o botão PT/EN). */
export function otherLanguagePath(path, currentLang) {
  const hit = matchPath(path);
  if (!hit) return currentLang === 'pt' ? ROUTES.home.en : ROUTES.home.pt;
  const other = LANGS.find((l) => l !== currentLang);
  return routePath(hit.key, other, hit.params);
}
