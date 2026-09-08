/**
 * A GEOMETRIA DAS NOVE REGIÕES, LIDA DO FICHEIRO QUE A CONSTRUÇÃO ESCREVE.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO É, E O QUE NÃO É
 * ---------------------------------------------------------------------------
 * É a única porta do sítio para `src/data/mapa-regioes.gerado.json`, que
 * `scripts/mapa-regioes.mjs` escreve no primeiro passo do `build` a partir dos
 * artefactos de `mapa/` e da coluna `nuts2` dos três ficheiros da Carta. Aqui
 * não se calcula geometria nenhuma e não se escreve um número: lê-se o ficheiro,
 * confere-se a forma, e devolve-se.
 *
 * LÊ-SE DO DISCO E NÃO SE IMPORTA COMO MÓDULO, pela lição que
 * `src/data/concelhos.mjs` tem escrita no seu cabeçalho: na construção este
 * módulo é empacotado para dentro de `dist/`, e um caminho relativo ao ficheiro
 * passaria a apontar para lá. A raiz procura-se a subir, pela marca do próprio
 * ficheiro que se quer ler.
 *
 * A AUSÊNCIA NÃO É UM ESTADO NORMAL, ao contrário do que acontece com os 308: o
 * mapa da primeira página desenha-se destas nove áreas, e sem elas não há mapa.
 * Quem não encontra o ficheiro fecha a construção com a frase do que falta e o
 * comando que o escreve.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REL = path.join('src', 'data', 'mapa-regioes.gerado.json');

function encontraRaiz() {
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, REL))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ?? subir(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd()
  );
}

/** Uma caixa de quatro números. @param {unknown} c @returns {c is CaixaDoMapa} */
function eCaixa(c) {
  return Array.isArray(c) && c.length === 4 && c.every((n) => typeof n === 'number');
}

/** O campo de um desenho. @param {unknown} c @returns {c is CampoDoMapa} */
function eCampo(c) {
  if (typeof c !== 'object' || c === null) return false;
  const x = /** @type {Record<string, unknown>} */ (c);
  return typeof x.largura === 'number' && typeof x.altura === 'number';
}

/**
 * Uma região do mapa: o slug, o código, a parcela, o caminho e as duas caixas.
 *
 * @param {unknown} r
 * @returns {r is RegiaoDoMapa}
 */
function eRegiao(r) {
  if (typeof r !== 'object' || r === null || Array.isArray(r)) return false;
  const x = /** @type {Record<string, unknown>} */ (r);
  return (
    typeof x.slug === 'string' &&
    typeof x.codigo === 'string' &&
    typeof x.parcela === 'string' &&
    typeof x.d === 'string' &&
    typeof x.concelhos === 'number' &&
    typeof x.ficheiro === 'string' &&
    Array.isArray(x.ponto) &&
    x.ponto.length === 2 &&
    x.ponto.every((n) => typeof n === 'number') &&
    eCaixa(x.caixa) &&
    eCampo(x.campo)
  );
}

/** @type {MapaDasRegioes | null} */
let cache = null;

/**
 * As nove regiões, o campo do país e as duas molduras.
 *
 * @returns {MapaDasRegioes}
 */
export function regioesDoMapa() {
  if (cache) return cache;
  const ficheiro = path.join(encontraRaiz(), REL);
  if (!fs.existsSync(ficheiro)) {
    throw new Error(
      `mapa das regiões: falta ${REL}. Escreve-se com \`npm run mapa:regioes\`, ` +
        'que é o primeiro passo da cadeia do `build`.',
    );
  }
  const lido = JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
  if (
    typeof lido !== 'object' ||
    lido === null ||
    !eCampo(lido.campo) ||
    !Array.isArray(lido.molduras) ||
    !Array.isArray(lido.regioes) ||
    !lido.regioes.every(eRegiao)
  ) {
    throw new Error(`mapa das regiões: ${REL} não traz o campo, as molduras e as nove regiões.`);
  }
  cache = /** @type {MapaDasRegioes} */ (lido);
  return cache;
}

/**
 * ===========================================================================
 * O NÍVEL DA REGIÃO, LIDO DO SERVIDOR (F1.10, item 8.17, 08.09.2026)
 * ===========================================================================
 *
 * O F1.1d escreveu nove ficheiros em `public/dados/mapa/regiao-<slug>.json`,
 * um por região, com o campo daquela grelha e os seus concelhos. Quem os lia era
 * `public/js/mapa-regioes.js`, no cliente, quando o leitor faz crescer uma
 * região na primeira página: os nove pesam 237 KB, e pô-los no documento de cada
 * visita seria pagá-los sem ninguém os pedir.
 *
 * A PÁGINA DE UM CONCELHO É O CASO CONTRÁRIO, e é por isso que estas duas
 * funções existem. Ali não há escolha nenhuma a fazer: a página sabe o seu
 * concelho, sabe a região dele, e o mapa que ela mostra é sempre o mesmo. Ler o
 * ficheiro na construção e desenhar as áreas no documento é o que dá o mapa a
 * quem não tem guião, que é a promessa da Emenda 7.
 *
 * O ÍNDICE CONSTRÓI-SE UMA VEZ, e não nove vezes por página: 616 páginas de
 * concelho a abrir nove ficheiros cada seriam 5 544 leituras de disco para uma
 * pergunta que tem uma resposta só.
 */
/** @typedef {{ slug: string, nome: string, d: string }} ConcelhoDoDesenho */
/** @typedef {{ slug: string, campo: CampoDoMapa, concelhos: ConcelhoDoDesenho[] }} DesenhoDaRegiao */

/** @type {Map<string, DesenhoDaRegiao> | null} */
let desenhos = null;
/** @type {Map<string, string> | null} */
let regiaoPorConcelho = null;

/** @param {unknown} c @returns {c is ConcelhoDoDesenho} */
function eConcelhoDoDesenho(c) {
  if (typeof c !== 'object' || c === null || Array.isArray(c)) return false;
  const x = /** @type {Record<string, unknown>} */ (c);
  return typeof x.slug === 'string' && typeof x.nome === 'string' && typeof x.d === 'string';
}

function carrega() {
  if (desenhos && regiaoPorConcelho) return { desenhos, regiaoPorConcelho };
  const raiz = encontraRaiz();
  /** @type {Map<string, DesenhoDaRegiao>} */
  const porRegiao = new Map();
  /** @type {Map<string, string>} */
  const porConcelho = new Map();
  for (const r of regioesDoMapa().regioes) {
    const ficheiro = path.join(raiz, 'public', r.ficheiro);
    if (!fs.existsSync(ficheiro)) {
      throw new Error(
        `mapa das regiões: falta public/${r.ficheiro}. Escreve-se com \`npm run mapa:regioes\`, ` +
          'que é o primeiro passo da cadeia do `build`.',
      );
    }
    const lido = JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
    if (
      typeof lido !== 'object' ||
      lido === null ||
      !eCampo(lido.campo) ||
      !Array.isArray(lido.concelhos) ||
      !lido.concelhos.every(eConcelhoDoDesenho)
    ) {
      throw new Error(`mapa das regiões: public/${r.ficheiro} não traz o campo e os concelhos.`);
    }
    porRegiao.set(r.slug, { slug: r.slug, campo: lido.campo, concelhos: lido.concelhos });
    for (const c of lido.concelhos) {
      const jaHa = porConcelho.get(c.slug);
      if (jaHa !== undefined && jaHa !== r.slug) {
        throw new Error(
          `mapa das regiões: o concelho "${c.slug}" está em duas regiões ("${jaHa}" e "${r.slug}"). ` +
            'A Carta dá-lhe uma, e o portão `check:mapa` conta os 308 uma vez cada.',
        );
      }
      porConcelho.set(c.slug, r.slug);
    }
  }
  desenhos = porRegiao;
  regiaoPorConcelho = porConcelho;
  return { desenhos, regiaoPorConcelho };
}

/**
 * A região da Carta a que um concelho pertence, ou `null`.
 *
 * NÃO É UMA SEGUNDA TABELA: a resposta sai dos mesmos nove ficheiros que o
 * desenho usa, e por isso um concelho que mude de região muda nas duas pontas ao
 * mesmo tempo. `src/data/regioes.mjs` declara as nove sem lista de concelhos, e
 * `regiaoDe()` em `caop-centroids.mjs` devolve a PARCELA (continente, açores,
 * madeira), que é outra coisa.
 *
 * @param {string} slugDoConcelho
 * @returns {string | null}
 */
export function regiaoDoConcelho(slugDoConcelho) {
  return carrega().regiaoPorConcelho.get(slugDoConcelho) ?? null;
}

/**
 * O desenho de uma região: o campo daquela grelha e os seus concelhos.
 *
 * @param {string} slugDaRegiao
 * @returns {DesenhoDaRegiao | null}
 */
export function desenhoDaRegiao(slugDaRegiao) {
  return carrega().desenhos.get(slugDaRegiao) ?? null;
}
