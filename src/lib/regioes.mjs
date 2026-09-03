/**
 * ===========================================================================
 * A LISTA DAS REGIÕES QUE A RÉGUA DESENHA, LIDA E NUNCA ESCRITA
 * ===========================================================================
 *
 * Emenda 21e: «as regiões que faltam entram pelo motor, com as linhas de origem
 * …; a régua nunca se completa com um número escrito à mão». Este ficheiro é o
 * lado do sítio dessa frase, e tem uma regra só:
 *
 *   **uma região existe no sítio quando tem linhas no livro-razão.**
 *
 * A lista das regiões é `src/data/regioes.mjs`, que o motor estende: uma entrada
 * nova ali, com as suas linhas atravessadas para `ledger/claims`, ganha barra na
 * régua, página, endereço nas duas edições e chave da prova sem que uma linha
 * deste ficheiro mude. Uma entrada sem linhas não ganha nada: nem página, nem
 * barra, nem contagem. Não há aqui uma segunda lista, e por isso não há uma
 * segunda lista para divergir.
 *
 * O QUE É «TER LINHAS»: a entrada declara duas afirmações, o valor do índice e a
 * distância à referência, e as duas estão publicadas. Meia região — o índice sem
 * a distância — não se desenha, porque a gramática da Emenda 4 é «barra =
 * distância à referência» e sem a distância a barra seria uma conta feita aqui.
 *
 * PORTUGAL NÃO É UMA REGIÃO, e o campo que o diz é o mesmo desde a etapa 2i:
 * `referencia: true`. Está na régua porque é a marca contra a qual as regiões se
 * leem, e sai de todas as contagens de regiões e de todas as listas de páginas.
 *
 * Vive em `src/lib/` e não em `src/data/` pela razão de `inicio.mjs`: não
 * acrescenta um facto ao sítio, lê os que já existem na forma de que as páginas
 * precisam.
 */

import { REGIOES } from '../data/regioes.mjs';
import { loadClaims } from './ledger.mjs';

/**
 * As afirmações que uma entrada precisa de ter publicadas para se desenhar.
 *
 * @param {Record<string, any>} r
 * @param {Map<string, Linha>} claims
 */
function temLinhas(r, claims) {
  return claims.has(r.valor) && claims.has(r.distancia);
}

/**
 * As leituras que a régua desenha: as regiões com linhas E a referência, pela
 * ordem do ficheiro de dados. É esta a lista que o instrumento percorre.
 */
export function leiturasDaRegua() {
  const claims = loadClaims();
  return REGIOES.filter((r) => temLinhas(r, claims));
}

/**
 * As regiões com página: as leituras menos a referência.
 *
 * É a lista de `getStaticPaths()` das duas edições e a lista de portas do
 * índice. Uma região sem linhas não está aqui, e por isso não tem endereço.
 */
export function regioesComPagina() {
  return leiturasDaRegua().filter((r) => !r.referencia);
}

/** Os nomes das regiões no endereço, para os caminhos estáticos. */
export function slugsDasRegioes() {
  return regioesComPagina().map((r) => r.slug);
}

/**
 * Uma região pelo seu nome no endereço, ou `null` se não tiver página.
 *
 * @param {string} slug
 */
export function regiaoDoSlug(slug) {
  return regioesComPagina().find((r) => r.slug === slug) ?? null;
}

/**
 * AS DUAS CONTAGENS DA PROVA (RG4 do brief).
 *
 * `declaradas` são as regiões que o ficheiro de dados declara; `comLinha` são as
 * que têm linhas publicadas. Hoje são iguais, e é por isso que as duas existem:
 * no dia em que o motor declarar uma região antes de a linha atravessar, a
 * diferença entre os dois números é a resposta certa, e vê-se.
 */
export function contagensDasRegioes() {
  const claims = loadClaims();
  const semReferencia = REGIOES.filter((r) => !r.referencia);
  return {
    declaradas: semReferencia.length,
    comLinha: semReferencia.filter((r) => temLinhas(r, claims)).length,
  };
}
