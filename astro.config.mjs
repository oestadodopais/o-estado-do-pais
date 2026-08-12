// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './site.config.mjs';
import { alternatesFor, pathFromUrl, matchPath } from './src/lib/routes.mjs';

// https://astro.build/config
export default defineConfig({
  // O domínio canónico vem de site.config.mjs e de mais lado nenhum.
  site: SITE_URL,

  output: 'static',

  // Saída em directório (/metodo/index.html). Os URLs canónicos e o sitemap
  // são normalizados sem barra final — ver canonicalUrl() e o serialize abaixo.
  build: { format: 'directory' },
  trailingSlash: 'ignore',

  // Zero JS de framework. O pouco que existe é vanilla, servido como ficheiro
  // estático e carregado com defer.
  devToolbar: { enabled: false },

  integrations: [
    sitemap({
      /**
       * As páginas de destino de estudo estão fora do sitemap enquanto não
       * tiverem conteúdo. Não se convida um motor de busca a indexar dezoito
       * páginas que dizem, elas próprias, que ainda não têm nada.
       * O índice do arquivo (/estudos, /en/studies) continua no sitemap.
       * Levantar isto na migração: apagar este filter e o noindex do stub.
       */
      filter: (page) => matchPath(pathFromUrl(page))?.key !== 'estudo',

      namespaces: { xhtml: true },
      serialize(item) {
        const path = pathFromUrl(item.url);
        // Sem barra final, excepto a raiz — igual ao canónico da página.
        item.url = new URL(path === '/' ? '/' : path, SITE_URL).href;
        // Pares hreflang PT<->EN, a partir da mesma tabela de rotas que as páginas usam.
        const alts = alternatesFor(path);
        if (alts) {
          item.links = alts.map((a) => ({
            lang: a.hreflang,
            url: new URL(a.path === '/' ? '/' : a.path, SITE_URL).href,
          }));
        }
        return item;
      },
    }),
  ],
});
