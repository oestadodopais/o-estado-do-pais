/**
 * ===========================================================================
 * AS PEÇAS DE CADA ÁREA, LIDAS E NUNCA ESCRITAS
 * ===========================================================================
 *
 * É o lado do sítio da regra que `src/data/areas.mjs` declara, e tem uma regra
 * só:
 *
 *   **uma área existe no sítio quando alguma linha do livro-razão é publicada
 *   por um dos organismos que a lei orgânica lhe dá.**
 *
 * Uma entrada nova em `src/data/areas.mjs`, com o seu organismo e o seu artigo,
 * ganha página, endereço nas duas edições e contagem sem que uma linha deste
 * ficheiro mude. Uma entrada sem linhas não ganha nada: nem página, nem porta,
 * nem contagem. Não há aqui uma segunda lista, e por isso não há uma segunda
 * lista para divergir.
 *
 * Vive em `src/lib/` e não em `src/data/` pela razão de `regioes.mjs`: não
 * acrescenta um facto ao sítio, lê os que já existem na forma de que as páginas
 * precisam.
 *
 * ---------------------------------------------------------------------------
 * AS TRÊS ESPÉCIES DE PEÇA, E PORQUE SÃO ESTAS TRÊS
 * ---------------------------------------------------------------------------
 *   · `trabalho`  um estudo do arquivo, quando uma das suas linhas é da área.
 *                 A porta é a página do estudo, e a página da leitura entra ao
 *                 lado dela quando existe na edição.
 *   · `conjunto`  um estudo de dados, que tem centenas de linhas e uma página
 *                 onde elas se leem juntas (`ESTUDOS_DE_DADOS`). Entra como uma
 *                 peça e não como novecentas: novecentas linhas numa página não
 *                 são uma lista, são um ficheiro, e a decisão D6 de 26.08.2026
 *                 já tratou disso uma vez.
 *   · `medida`    uma linha do livro-razão que não pertence a um estudo de
 *                 dados. A porta é a sua própria página, e o que se rende é o
 *                 valor com o selo, na disposição de `/livro-razao/concelhos/…`.
 *
 * NÃO HÁ UMA ESPÉCIE «LEITURA», e é uma escolha de vocabulário e não um
 * esquecimento: a rota do texto de um trabalho chama-se `texto` e não `leitura`
 * por decisão do diretor de 24.08.2026 (DECISIONS §1.64), porque «Leitura»
 * colide com «Leitura breve», que é uma das duas densidades da Emenda 2. A
 * leitura de um trabalho é uma camada da página dele, e entra aqui como a porta
 * que ela é, ao lado do trabalho.
 *
 * ---------------------------------------------------------------------------
 * UMA PEÇA PODE ESTAR EM DUAS ÁREAS, E A RAZÃO VEM COM ELA
 * ---------------------------------------------------------------------------
 * «Évora, Quinze Anos, Cinco Mandatos» tem linhas do serviço de emprego e linhas
 * da secretaria-geral da administração interna, que são de áreas diferentes: o
 * trabalho está nas duas, e em cada uma a peça traz as linhas por que lá entrou.
 * Uma peça que estivesse em duas áreas sem essa razão seria uma arrumação, e
 * `scripts/check-areas.mjs` fecha a construção nesse caso.
 */

import { AREAS } from '../data/areas.mjs';
import { loadClaims } from './ledger.mjs';
import { WORKS, ESTUDOS_DE_DADOS, INTERNAL_SOURCES, studyTitle } from '../data/studies.mjs';
import { temRegisto } from './registos.mjs';

/** O organismo de uma área que publica esta linha, ou `null`. */
function organismoDaLinha(area, claim) {
  return area.organismos.find((o) => o.fonte === claim.source) ?? null;
}

/** O nome legível de um estudo de dados, que não está em `WORKS`. */
function conjuntoInterno(id) {
  return INTERNAL_SOURCES.find((s) => s.id === id && s.conjunto) ?? null;
}

/**
 * As peças de uma área, agrupadas por espécie e pela ordem em que o livro-razão
 * as dá (que é a ordem alfabética dos identificadores, porque é o nome do
 * ficheiro de cada linha). Nada se reordena aqui: uma ordem editorial seria uma
 * decisão sem quem a confira.
 */
function pecasDaArea(area, claims) {
  const trabalhos = new Map();
  const conjuntos = new Map();
  const medidas = [];

  for (const [id, c] of claims) {
    const org = organismoDaLinha(area, c);
    if (!org) continue;

    if (ESTUDOS_DE_DADOS.has(c.study)) {
      const p = conjuntos.get(c.study) ?? { id: c.study, linhas: [], organismos: new Set() };
      p.linhas.push(id);
      p.organismos.add(org.fonte);
      conjuntos.set(c.study, p);
      continue;
    }

    medidas.push({ id, estudo: c.study, organismo: org.fonte });

    const w = WORKS.find((x) => x.id === c.study);
    if (w) {
      const p = trabalhos.get(w.id) ?? { id: w.id, slug: w.slug, linhas: [], organismos: new Set() };
      p.linhas.push(id);
      p.organismos.add(org.fonte);
      trabalhos.set(w.id, p);
    }
  }

  return {
    trabalhos: [...trabalhos.values()].map((p) => ({ ...p, organismos: [...p.organismos] })),
    conjuntos: [...conjuntos.values()].map((p) => ({
      ...p,
      organismos: [...p.organismos],
      conjunto: conjuntoInterno(p.id)?.conjunto ?? null,
    })),
    medidas,
  };
}

/** Todas as áreas declaradas, cada uma com as suas peças. */
export function areasComPecas() {
  const claims = loadClaims();
  return AREAS.map((a) => {
    const pecas = pecasDaArea(a, claims);
    return {
      ...a,
      pecas,
      total: pecas.trabalhos.length + pecas.conjuntos.length + pecas.medidas.length,
    };
  });
}

/**
 * As áreas com página: as declaradas que têm pelo menos uma peça.
 *
 * É a lista de `getStaticPaths()` das duas edições e a lista de portas do
 * índice. Uma área sem peças não está aqui, e por isso não tem endereço.
 */
export function areasComPagina() {
  return areasComPecas().filter((a) => a.total > 0);
}

/** Os nomes das áreas no endereço, para os caminhos estáticos. */
export function slugsDasAreas() {
  return areasComPagina().map((a) => a.slug);
}

/** Uma área pelo seu nome no endereço, ou `null` se não tiver página. */
export function areaDoSlug(slug) {
  return areasComPagina().find((a) => a.slug === slug) ?? null;
}

/**
 * O nome de um trabalho ou de um conjunto, na edição da página.
 *
 * É a mesma função que o resto do sítio usa para nomear um estudo: um título não
 * se traduz, e quem diz em que língua a cadeia está é `TituloDeTrabalho`, que a
 * rende. Devolve a cadeia, que é o que aquele componente recebe.
 */
export function nomeDoEstudo(id, lang) {
  return studyTitle(id, lang).titulo;
}

/**
 * A página do texto de um trabalho, quando ela existe NA EDIÇÃO da página.
 *
 * Dos oito registos de conteúdo, seis são portugueses e dois ingleses: uma porta
 * para uma página que não foi construída é uma porta que não abre, e o portão
 * apanha-a. Devolve `true` quando há registo naquela língua.
 */
export function temTexto(slug, lang) {
  return temRegisto(slug, lang);
}
