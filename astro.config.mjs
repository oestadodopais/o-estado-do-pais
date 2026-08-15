// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './site.config.mjs';
import { alternatesFor, pathFromUrl, matchPath } from './src/lib/routes.mjs';
import { loadClaims, provenienciaIncompleta } from './src/lib/ledger.mjs';
import { WORKS } from './src/data/studies.mjs';
import { temLeitura } from './src/data/leituras.mjs';

/**
 * Uma alternativa de língua, tal como routes.mjs a devolve.
 * Anotada aqui, e não só inferida, para que este ficheiro continue a
 * type-checkar mesmo quando o editor não resolve os módulos .mjs vizinhos.
 * @typedef {{ lang: string, hreflang: string, path: string }} Alternativa
 */

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
       *
       * Um trabalho com leitura escrita (src/data/leituras.mjs) já tem
       * conteúdo, e entra — pela MESMA lista que levanta o noindex na página e
       * que o portão de HTML confere. Não é «apagar o filter na migração»: é a
       * migração acontecer trabalho a trabalho, e o filtro seguir cada um.
       *
       * Os documentos originais (/estudos/:slug/documento) também não entram:
       * são obra já publicada, alojada aqui, e quem os encontra chega pela
       * página do estudo. Estão fora por serem endpoints, e ficam fora por
       * escrito — para não passarem a estar dentro sem ninguém decidir.
       *
       * As páginas de LINHA do livro-razão entram — são o registo citável, e é
       * para elas que aponta cada selo de proveniência. Menos as que têm um
       * campo por confirmar: essas ficam fora do sitemap e levam noindex, pela
       * mesma leitura do livro-razão que o portão de HTML confere. Uma linha
       * incompleta não se oferece como registo; volta a entrar sozinha no dia
       * em que o campo for preenchido.
       *
       * @param {string} page URL absoluto da página, como o sitemap o vê.
       * @returns {boolean} true se a página entra no sitemap.
       */
      filter: (page) => {
        const hit = matchPath(pathFromUrl(page));
        if (hit?.key === 'documento') return false;
        if (hit?.key === 'estudo') {
          const work = WORKS.find((w) => w.slug === hit.params.slug);
          return work ? temLeitura(work.id) : false;
        }
        if (hit?.key === 'linha') {
          const claim = loadClaims().get(hit.params.slug ?? '');
          return Boolean(claim) && !provenienciaIncompleta(claim);
        }
        return true;
      },

      namespaces: { xhtml: true },

      /**
       * @param {import('@astrojs/sitemap').SitemapItem} item
       * @returns {import('@astrojs/sitemap').SitemapItem}
       */
      serialize(item) {
        const path = pathFromUrl(item.url);
        // Sem barra final, excepto a raiz — igual ao canónico da página.
        item.url = new URL(path === '/' ? '/' : path, SITE_URL).href;
        // Pares hreflang PT<->EN, a partir da mesma tabela de rotas que as páginas usam.
        const alts = alternatesFor(path);
        if (alts) {
          item.links = alts.map(
            /** @param {Alternativa} a */
            (a) => ({
              lang: a.hreflang,
              url: new URL(a.path === '/' ? '/' : a.path, SITE_URL).href,
            }),
          );
        }
        return item;
      },
    }),
  ],
});
