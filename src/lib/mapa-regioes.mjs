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
