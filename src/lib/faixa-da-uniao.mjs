/**
 * A FAIXA DA UNIÃO · o resolvedor (bloco UE1, 29.09.2026).
 *
 * `faixaDaMedida(id, lang)` devolve o que a faixa de um cartão rende: a frase do
 * lugar de Portugal, em pedaços, as marcas do desenho com a posição de cada uma,
 * os rótulos de Portugal e da União, e os países das pontas. As palavras são as
 * declaradas em `src/data/faixa-da-uniao.mjs`; os números, os nomes e as posições
 * saem dos pontos da série (`ledger/series/<linha>-paises.yml`), e mais nada.
 * Uma linha sem série de países não tem faixa, e devolve `null`.
 *
 * AS REGRAS DA CONTA, as mesmas que os portões recontam por conta própria em
 * `scripts/series-do-portao.mjs` (e não importam daqui):
 *   · o lugar de Portugal é 1 mais o número de países com valor maior, e os
 *     países com o mesmo valor ficam «a par» (o brief, §3, ponto 5);
 *   · o mais baixo e o mais alto são os países do menor e do maior valor, pela
 *     ordem da série quando são mais do que um (o acerto F3);
 *   · a posição de uma marca é (valor − mínimo) ÷ (máximo − mínimo), em
 *     percentagem com quatro casas.
 * Os valores comparam-se como números (`parsePtNumber`).
 */

import { parsePtNumber } from './ledger.mjs';
import { serieDaLinha, pontosDaSerie, AGREGADO_DA_UNIAO } from './series.mjs';
import { routePath } from './routes.mjs';
import { PALAVRAS_DA_FAIXA } from '../data/faixa-da-uniao.mjs';

/**
 * @typedef {string
 *   | { ponto: string }
 *   | { pais: string }
 *   | { conta: number }
 *   | { lugar: number }
 *   | { periodo: string }} PedacoDaFaixaResolvido
 */

/**
 * @param {number} v @param {number} min @param {number} max
 */
function posicao(v, min, max) {
  if (!(max > min)) throw new Error('faixa da União: o mais alto e o mais baixo são o mesmo valor, e a faixa não tem largura');
  return Number((Math.min(1, Math.max(0, (v - min) / (max - min))) * 100).toFixed(4));
}

/** Como se ancora um rótulo: pela ponta mais perto, quando está junto a uma. @param {number} p */
function ancora(p) {
  return p < 15 ? 'inicio' : p > 85 ? 'fim' : 'meio';
}

/**
 * @param {string} idDaLinha
 * @param {Lingua} lang
 */
export function faixaDaMedida(idDaLinha, lang) {
  const serie = serieDaLinha(idDaLinha);
  if (!serie) return null;
  const palavras = PALAVRAS_DA_FAIXA[lang];
  const pontos = pontosDaSerie(serie);
  const numero = (/** @type {unknown} */ v) => {
    const n = parsePtNumber(v);
    if (n === null) throw new Error(`faixa da União: um valor de «${serie.id}» não é um número da casa`);
    return n;
  };
  const paises = pontos
    .filter((p) => p.geo !== AGREGADO_DA_UNIAO)
    .map((p) => ({ geo: String(p.geo), n: numero(p.valor), bandeira: p.bandeira ? String(p.bandeira) : null }));
  const ue = pontos.find((p) => p.geo === AGREGADO_DA_UNIAO);
  const pt = paises.find((p) => p.geo === 'PT');
  if (!ue || !pt) throw new Error(`faixa da União: «${serie.id}» não tem o ponto da União ou o de Portugal`);
  const nUe = numero(ue.valor);
  const min = Math.min(...paises.map((p) => p.n));
  const max = Math.max(...paises.map((p) => p.n));
  const papeis = {
    baixo: paises.filter((p) => p.n === min).map((p) => p.geo),
    alto: paises.filter((p) => p.n === max).map((p) => p.geo),
    aPar: paises.filter((p) => p.geo !== 'PT' && p.n === pt.n).map((p) => p.geo),
  };
  const lugar = 1 + paises.filter((p) => p.n > pt.n).length;
  const valorDe = { baixo: papeis.baixo[0], alto: papeis.alto[0], uniao: AGREGADO_DA_UNIAO, portugal: 'PT' };

  /** @param {string[]} geos @returns {PedacoDaFaixaResolvido[]} */
  const lista = (geos) =>
    geos.flatMap((geo, i) => [
      ...(i === 0 ? [] : [i === geos.length - 1 ? palavras.lista.ultimo : palavras.lista.entre]),
      { pais: geo },
    ]);

  /** @param {import('../data/faixa-da-uniao.mjs').PedacoDaFaixa[]} partes @returns {PedacoDaFaixaResolvido[]} */
  const resolve = (partes) =>
    partes.flatMap((p) => {
      if (typeof p === 'string') return [p];
      if ('conta' in p) return [{ conta: paises.length }];
      if ('periodo' in p) return [{ periodo: String(serie.periodo) }];
      if ('valor' in p) return [{ ponto: valorDe[p.valor] }];
      if ('paises' in p) return lista(papeis[p.paises]);
      if ('pais' in p) return [{ pais: p.pais }];
      if ('lugar' in p) return [{ lugar }];
      if ('aPar' in p) {
        if (!papeis.aPar.length) return [];
        return resolve(papeis.aPar.length === 1 ? palavras.aPar.um : palavras.aPar.varios);
      }
      throw new Error('faixa da União: um pedaço da frase que a gramática não conhece');
    });

  /* Os pedaços de texto seguidos juntam-se, para que a frase se leia inteira. */
  /** @type {PedacoDaFaixaResolvido[]} */
  const pedacos = [];
  for (const p of resolve(palavras.frase)) {
    const ultimo = pedacos[pedacos.length - 1];
    if (typeof p === 'string' && typeof ultimo === 'string') pedacos[pedacos.length - 1] = ultimo + p;
    else pedacos.push(p);
  }

  const esquerdaPt = posicao(pt.n, min, max);
  const esquerdaUe = posicao(nUe, min, max);
  return {
    serie: serie.id,
    pedacos,
    marcas: [
      ...paises.map((p) => ({ geo: p.geo, esquerda: posicao(p.n, min, max), papel: p.geo === 'PT' ? 'portugal' : 'pais' })),
      { geo: AGREGADO_DA_UNIAO, esquerda: esquerdaUe, papel: 'uniao' },
    ],
    rotulos: {
      portugal: { esquerda: esquerdaPt, ancora: ancora(esquerdaPt) },
      uniao: { esquerda: esquerdaUe, ancora: ancora(esquerdaUe) },
    },
    pontas: {
      baixo: papeis.baixo.map((geo) => ({ geo, bandeira: paises.find((p) => p.geo === geo)?.bandeira ?? null })),
      alto: papeis.alto.map((geo) => ({ geo, bandeira: paises.find((p) => p.geo === geo)?.bandeira ?? null })),
    },
    porta: routePath('serie', lang, { slug: serie.id }),
    palavras: { uniao: palavras.uniao, porta: palavras.porta },
  };
}
