/**
 * ===========================================================================
 * AS PEÇAS DE CADA ÁREA, LIDAS E NUNCA ESCRITAS
 * ===========================================================================
 *
 * É o lado do sítio da regra que `src/data/areas.mjs` declara, e tem uma regra
 * só:
 *
 *   **uma área existe no sítio quando alguma linha do livro-razão tem por
 *   assunto uma das matérias que a lei orgânica dá àquele ministério.**
 *
 * Uma entrada nova em `src/data/areas.mjs`, com a sua matéria e as suas regras,
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
 * «Évora, Quinze Anos, Cinco Mandatos» tem linhas de resultados eleitorais,
 * linhas das contas do município e linhas de desemprego, que são matérias de
 * três ministérios: o trabalho está nas três áreas, e em cada uma traz a
 * matéria por que lá entrou. Uma peça que estivesse em duas áreas sem essa
 * razão seria uma arrumação, e `scripts/check-areas.mjs` fecha a construção
 * nesse caso.
 *
 * UMA LINHA, PORÉM, ESTÁ NUMA ÁREA SÓ. O portão prova-o sobre as 2 602 linhas
 * do livro-razão: cada uma é coberta por uma matéria, ou por uma entrada da
 * lista das que ficam fora, e nunca pelas duas.
 */

import { AREAS } from '../data/areas.mjs';
import { loadClaims } from './ledger.mjs';
import { WORKS, ESTUDOS_DE_DADOS, INTERNAL_SOURCES, studyTitle } from '../data/studies.mjs';
import { temRegisto } from './registos.mjs';

/**
 * A REGRA, aplicada a uma linha: a matéria desta área que cobre o assunto dela,
 * com a regra que o diz, ou `null`.
 *
 * `estudos` limita uma regra a um ou mais estudos; sem ele, a regra vale para
 * todos. A expressão corre sobre o IDENTIFICADOR da linha, que é o nome do
 * assunto dela.
 *
 * @param {Record<string, any>} area
 * @param {string} id
 * @param {Linha} claim
 */
function materiaDaLinha(area, id, claim) {
  for (const m of area.materias) {
    for (const r of m.regras) {
      if (r.estudos && !r.estudos.includes(claim.study)) continue;
      if (r.id.test(id)) return { materia: m.materia, artigo: m.artigo, razao: r.razao };
    }
  }
  return null;
}

/**
 * O nome legível de um estudo de dados, que não está em `WORKS`.
 *
 * @param {string} id
 */
function conjuntoInterno(id) {
  return INTERNAL_SOURCES.find((s) => s.id === id && s.conjunto) ?? null;
}

/**
 * As peças de uma área, agrupadas por espécie e pela ordem em que o livro-razão
 * as dá (que é a ordem alfabética dos identificadores, porque é o nome do
 * ficheiro de cada linha). Nada se reordena aqui: uma ordem editorial seria uma
 * decisão sem quem a confira.
 *
 * Cada peça traz `materias`, que são as matérias desta área por que ela lá
 * entrou. Numa medida é sempre uma; num trabalho ou num conjunto podem ser mais
 * do que uma, porque as linhas dele tratam de assuntos diferentes.
 *
 * @param {Record<string, any>} area
 * @param {Map<string, Linha>} claims
 */
function pecasDaArea(area, claims) {
  const trabalhos = new Map();
  const conjuntos = new Map();
  const medidas = [];

  for (const [id, c] of claims) {
    const m = materiaDaLinha(area, id, c);
    if (!m) continue;

    if (ESTUDOS_DE_DADOS.has(c.study)) {
      const p = conjuntos.get(c.study) ?? { id: c.study, linhas: [], materias: new Set() };
      p.linhas.push(id);
      p.materias.add(m.materia);
      conjuntos.set(c.study, p);
      continue;
    }

    medidas.push({ id, estudo: c.study, materia: m.materia, artigo: m.artigo, razao: m.razao });

    const w = WORKS.find((x) => x.id === c.study);
    if (w) {
      const p = trabalhos.get(w.id) ?? { id: w.id, slug: w.slug, linhas: [], materias: new Set() };
      p.linhas.push(id);
      p.materias.add(m.materia);
      trabalhos.set(w.id, p);
    }
  }

  /* AS MEDIDAS AGRUPAM-SE PELA MATÉRIA QUE AS PÔS AQUI (decisão do lugar de
     direção, 28.08.2026). A ordem dos grupos é a das matérias declaradas, e a
     ordem dentro de cada grupo é a do livro-razão. Um grupo sem medidas não
     aparece: a matéria pode ter posto aqui só linhas de um conjunto.

     A LISTA PLANA CONTINUA A EXISTIR, e é ela que conta: as contagens, o portão
     e as réguas leem `medidas`, e `gruposDeMedidas` é a mesma lista partida.
     Duas listas que divergissem seriam dois números para a mesma coisa. */
  const grupos = [];
  for (const m of area.materias) {
    const dentro = medidas.filter((x) => x.materia === m.materia);
    if (dentro.length > 0) grupos.push({ materia: m.materia, artigo: m.artigo, medidas: dentro });
  }

  /* OS NÚMEROS DA LEI EM QUE ESTA PÁGINA ASSENTA, pela ordem das matérias e sem
     repetir: é o que o selo da porta legal rende, uma vez por página. */
  /** @type {string[]} */
  const artigos = [];
  for (const m of area.materias) {
    const tem =
      medidas.some((x) => x.materia === m.materia) ||
      [...trabalhos.values()].some((p) => p.materias.has(m.materia)) ||
      [...conjuntos.values()].some((p) => p.materias.has(m.materia));
    if (tem && !artigos.includes(m.artigo)) artigos.push(m.artigo);
  }

  return {
    trabalhos: [...trabalhos.values()].map((p) => ({ ...p, materias: [...p.materias] })),
    conjuntos: [...conjuntos.values()].map((p) => ({
      ...p,
      materias: [...p.materias],
      conjunto: conjuntoInterno(p.id)?.conjunto ?? null,
    })),
    medidas,
    gruposDeMedidas: grupos,
    artigos,
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

/**
 * Uma área pelo seu nome no endereço, ou `null` se não tiver página.
 *
 * @param {string} slug
 */
export function areaDoSlug(slug) {
  return areasComPagina().find((a) => a.slug === slug) ?? null;
}

/**
 * O nome de um trabalho ou de um conjunto, na edição da página.
 *
 * É a mesma função que o resto do sítio usa para nomear um estudo: um título não
 * se traduz, e quem diz em que língua a cadeia está é `TituloDeTrabalho`, que a
 * rende. Devolve a cadeia, que é o que aquele componente recebe.
 *
 * @param {string} id
 * @param {string} lang
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
 *
 * @param {string} slug
 * @param {string} lang
 */
export function temTexto(slug, lang) {
  return temRegisto(slug, lang);
}
