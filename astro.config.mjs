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
        const caminho = pathFromUrl(page);
        /* As páginas de erro das duas edições ficam fora: a Vercel serve-as a
           quem pede um endereço que não existe, e um sitemap não oferece uma
           ausência. O @astrojs/sitemap só exclui por si o `/404` da raiz; o
           `/en/404` (ISSUES I53) passaria sem esta linha, e passou uma vez. */
        if (/(^|\/)404$/.test(caminho)) return false;
        const hit = matchPath(caminho);
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
        /* NÃO HÁ `lastmod`, e é decisão escrita, agora com o modelo medido.
           Carimbar a data da construção seria dizer que 264 páginas mudaram
           hoje porque o sítio foi reconstruído hoje. Mas as datas que o sítio
           tem também não servem: `access_date` é quando a FONTE foi lida e a
           data de publicação de um estudo é quando o TRABALHO saiu — nenhuma
           delas é «quando esta página mudou». Uma página muda quando muda
           qualquer uma das suas entradas, incluindo os componentes que
           partilha com as outras.

           O bloco T (T4) foi construir esse modelo e mediu-o antes de o
           escrever. Três coisas, e cada uma sozinha chegava:

           1. A CONSTRUÇÃO QUE PUBLICA NÃO TEM HISTÓRIA. O Vercel clona a
              `--depth=10` por omissão, não é configurável e não há remoto de
              onde puxar o resto (`git fetch --unshallow` não tem para onde
              ir). Medido neste repositório a 18.08.2026, no dia mais movimentado
              do bloco: dos 244 ficheiros de entrada versionados (src/,
              ledger/claims/, public/, este ficheiro e o site.config), os
              últimos 10 commits tocam em 66. Para os outros 178 o
              `git log -1 -- <ficheiro>` de um clone assim devolve vazio: não há
              data, e uma data que não há não se estima.
           2. O MODELO HONESTO DÁ UMA DATA SÓ. Toda a página construída depende
              de `src/i18n/strings.mjs`, de `src/styles/site.css` e do cabeçalho,
              que traz a data da última reconferência do painel
              (`src/data/verificacao.mjs`, reescrita a cada corrida semanal).
              O `lastmod` de qualquer página passa a ser o commit mais recente
              que tocou num desses — o mesmo para as 264. Um mapa do sítio com
              264 endereços a dizer a mesma data diz exactamente o que diz não
              ter campo nenhum.
           3. UM MAPA COMETIDO SERIA ESTADO ESCRITO. Calcular fora da construção
              e cometer um `src/data/lastmod.json` resolveria (1), e trocaria o
              problema por outro que esta casa já recusou noutro sítio: uma
              contagem escrita à mão fica errada no commit seguinte e ninguém dá
              por isso (IDENTIDADE.md §10). O primeiro commit depois do mapa
              deixa-o a mentir.

           O campo fica ausente: é o que o protocolo permite e é a verdade.
           Ver DECISIONS §1.36, item 10, §1.47 (T4) e §4.1. */
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
