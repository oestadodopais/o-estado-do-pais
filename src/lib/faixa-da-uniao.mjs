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
 *
 * A PASSAGEM UE1b (29.09.2026): o ordinal inglês do lugar (`sufixoOrdinal`, o
 * acerto F4) e as ressalvas da fonte nas pontas, pelas palavras declaradas; uma
 * marca sem palavras fecha a construção aqui, com o nome da marca.
 *
 * A PASSAGEM UE1c (29.09.2026, o achado 5 da leitura a frio): num extremo
 * empatado, cada país da ponta leva o seu valor e a sua ressalva, e não só o
 * primeiro; as palavras da lista (`lista`) vão com a faixa para o componente as
 * pôr entre eles.
 *
 * O BLOCO UE2 (02.10.2026): a página da União mostra as dez faixas à largura
 * inteira, uma por baixo da outra, e cada uma leva duas coisas que a faixa do
 * cartão não leva, as duas feitas aqui e não na vista:
 *   · `ordem`, os 27 países e a média da União pela ordem dos valores, do mais
 *     alto para o mais baixo (o sentido do lugar de Portugal na frase), com os
 *     valores iguais pela ordem da série, que é a protocolar com a União no fim;
 *     é a lista dobrada «Os 27 por ordem», o caminho sem guião;
 *   · `toques`, uma etiqueta por marca, na posição da marca, com o grupo dos
 *     pontos que têm o valor dela (um país só, salvo num empate) e a ressalva de
 *     cada um: o nome e o valor vão no documento, escondidos, e o guião do toque
 *     (`public/js/paises.js`) só mostra o que já lá está.
 * E `faixasDaPaginaDaUniao()` diz que faixas são e por que ordem: a dos dois
 * quadros, com as medidas de fora deles no lugar que a tabela declarada lhes dá.
 *
 * A PASSAGEM DE HIGIENE H3 (05.10.2026, o §3, ponto 4, do brief H3): os países com
 * o mesmo valor caíam no mesmo ponto do desenho e escondiam-se uns aos outros (o
 * leitor contou «17 ou 25» pontos numa faixa de 27). Duas coisas, as duas feitas
 * aqui e não na vista:
 *   · OS PONTOS IGUAIS AFASTAM-SE NA VERTICAL, pela regra de `alturaNoGrupo()`: os
 *     países com o mesmo valor ficam na mesma posição horizontal, e, pela ordem da
 *     tabela (a da série, a protocolar), de cima para baixo, os centros distribuem-se
 *     por igual de seis píxeis acima a seis abaixo do eixo; um país sozinho fica no
 *     eixo. Os doze píxeis cabem entre o rótulo de Portugal, por cima, e o da média
 *     da União, por baixo, nas duas faixas (a do cartão e a da página da União), e
 *     por isso a regra não tira lugar a nenhum dos dois. A média da União não entra
 *     no grupo: é um traço e não um ponto, e vê-se por cima de qualquer ponto;
 *   · A ETIQUETA DE UM PONTO DIZ O GRUPO INTEIRO COM O VALOR UMA VEZ: os nomes pela
 *     ordem da tabela, cada um com a ressalva do seu ponto logo a seguir ao nome, e o
 *     valor no fim («Estónia, França (definição diferente), Croácia e Suécia 1,8»).
 *     Na página da União é a etiqueta do toque; na faixa do cartão, que não tem
 *     toque, é o `title` de cada marca (`etiqueta`), que o portão de HTML confere
 *     contra a série, porque é um valor num atributo.
 */

import { parsePtNumber } from './ledger.mjs';
import { serieDaLinha, pontosDaSerie, allSeries, nomeDoPais, AGREGADO_DA_UNIAO } from './series.mjs';
import { routePath } from './routes.mjs';
import { PALAVRAS_DA_FAIXA, MEDIDAS_FORA_DOS_QUADROS } from '../data/faixa-da-uniao.mjs';
import { FIGURAS } from '../data/figuras.mjs';

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

/**
 * O sufixo do ordinal inglês de um lugar (o acerto F4): `st`, `nd` e `rd` para
 * os números acabados em 1, 2 e 3, `th` para os outros e para os acabados em
 * 11, 12 e 13. As palavras são as declaradas; a regra é a do inglês.
 *
 * @param {number} n
 * @param {{ st: string, nd: string, rd: string, th: string } | undefined} sufixos
 */
function sufixoOrdinal(n, sufixos) {
  if (!sufixos) throw new Error('faixa da União: a frase pede um ordinal e a língua não declara os sufixos');
  const dezena = n % 100;
  if (dezena >= 11 && dezena <= 13) return sufixos.th;
  return [sufixos.th, sufixos.st, sufixos.nd, sufixos.rd][n % 10] ?? sufixos.th;
}

/** Como se ancora um rótulo: pela ponta mais perto, quando está junto a uma. @param {number} p */
function ancora(p) {
  return p < 15 ? 'inicio' : p > 85 ? 'fim' : 'meio';
}

/** Quantos píxeis cabem acima e abaixo do eixo para os pontos iguais, entre o rótulo de Portugal e o da União. */
export const DESVIO_MAXIMO_DOS_PONTOS_IGUAIS = 6;

/**
 * OS PONTOS IGUAIS AFASTAM-SE NA VERTICAL (bloco H3): o desvio, em píxeis a partir do
 * eixo (negativo para cima), do país `i` de um grupo de `n` países com o mesmo valor,
 * contado pela ordem da tabela. Os centros distribuem-se por igual entre
 * `-DESVIO_MAXIMO_DOS_PONTOS_IGUAIS` e `+DESVIO_MAXIMO_DOS_PONTOS_IGUAIS`; um país
 * sozinho fica no eixo. Dois: −6 e 6; três: −6, 0 e 6; quatro: −6, −2, 2 e 6.
 * @param {number} i @param {number} n
 */
export function alturaNoGrupo(i, n) {
  if (n <= 1) return 0;
  const d = DESVIO_MAXIMO_DOS_PONTOS_IGUAIS;
  return Number((-d + (2 * d * i) / (n - 1)).toFixed(2)) || 0;
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
      if ('ordinal' in p) return [sufixoOrdinal(lugar, palavras.ordinal)];
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

  /* Uma ponta: o país, a marca que a fonte põe ao ponto, e as palavras
     declaradas dessa marca, que é o que a faixa mostra (UE1b). Desde o UE2 vale
     para qualquer ponto, também o da União: a lista dobrada e as etiquetas do
     toque mostram a ressalva de cada um como as pontas a mostram. */
  /** @param {string} geo */
  const ponta = (geo) => {
    const bandeira = pontos.find((p) => p.geo === geo)?.bandeira ?? null;
    if (!bandeira) return { geo, bandeira: null, ressalva: null };
    const ressalva = palavras.ressalvas[String(bandeira)];
    if (!ressalva) {
      throw new Error(
        `faixa da União: o ponto de ${geo} em «${serie.id}» leva a marca «${bandeira}», que não tem palavras ` +
          `declaradas em src/data/faixa-da-uniao.mjs (${lang}). Nenhuma letra crua chega a uma página.`,
      );
    }
    return { geo, bandeira: String(bandeira), ressalva };
  };

  const esquerdaPt = posicao(pt.n, min, max);
  const esquerdaUe = posicao(nUe, min, max);
  /* A ALTURA DE CADA MARCA (H3): o desvio do país dentro do grupo dos países com o seu valor, pela ordem da série, que
     é a da tabela. `noGrupo` diz quantos são, para a vista escrever o desvio só onde há grupo. */
  /** @param {{ geo: string, n: number }} p */
  const grupoDoPais = (p) => paises.filter((q) => q.n === p.n);
  const marcas = [
    ...paises.map((p) => {
      const grupo = grupoDoPais(p);
      return {
        geo: p.geo,
        esquerda: posicao(p.n, min, max),
        papel: p.geo === 'PT' ? 'portugal' : 'pais',
        altura: alturaNoGrupo(grupo.findIndex((q) => q.geo === p.geo), grupo.length),
        noGrupo: grupo.length,
      };
    }),
    { geo: AGREGADO_DA_UNIAO, esquerda: esquerdaUe, papel: 'uniao', altura: 0, noGrupo: 1 },
  ];

  /* A ORDEM DOS 27 E DA MÉDIA DA UNIÃO (UE2): do valor mais alto para o mais
     baixo, que é o sentido em que a frase conta o lugar de Portugal, e os valores
     iguais pela ordem da série (a protocolar, com a União no fim). A ordenação é
     estável, e por isso a ordem da série desempata sem uma segunda regra. */
  const naSerie = [...paises.map((p) => ({ geo: p.geo, n: p.n })), { geo: AGREGADO_DA_UNIAO, n: nUe }];
  const ordem = [...naSerie]
    .sort((a, b) => b.n - a.n)
    .map((p) => ({
      ...ponta(p.geo),
      papel: p.geo === AGREGADO_DA_UNIAO ? 'uniao' : p.geo === 'PT' ? 'portugal' : 'pais',
    }));

  return {
    serie: serie.id,
    /* Quantos países a série tem (UE2: o resumo da lista dobrada di-lo); o portão reconta-o dos pontos. */
    conta: paises.length,
    pedacos,
    marcas,
    rotulos: {
      portugal: { esquerda: esquerdaPt, ancora: ancora(esquerdaPt) },
      uniao: { esquerda: esquerdaUe, ancora: ancora(esquerdaUe) },
    },
    pontas: {
      baixo: papeis.baixo.map((geo) => ponta(geo)),
      alto: papeis.alto.map((geo) => ponta(geo)),
    },
    ordem,
    /* AS ETIQUETAS DO TOQUE (UE2): uma por marca, na posição dela e ancorada
       pela ponta mais perto, como os rótulos; o nome e o valor saem na vista
       pelos componentes da série, e a ressalva vem daqui. UMA MARCA COM O MESMO
       VALOR DE OUTRAS diz o grupo inteiro dos pontos com esse valor, pela ordem
       da série, com as palavras da lista entre eles; desde o H3, com o valor uma
       vez, no fim, e a ressalva de cada ponto a seguir ao nome dele («Áustria,
       Portugal e Suécia 18,6»), e as marcas do grupo afastadas na vertical. */
    toques: marcas.map((m) => {
      const n = m.geo === AGREGADO_DA_UNIAO ? nUe : /** @type {{ n: number }} */ (paises.find((p) => p.geo === m.geo)).n;
      const grupo = naSerie.filter((p) => p.n === n).map((p) => ({
        ...ponta(p.geo),
        papel: p.geo === AGREGADO_DA_UNIAO ? 'uniao' : p.geo === 'PT' ? 'portugal' : 'pais',
      }));
      /* O TEXTO DA ETIQUETA, PARA O `title` DA MARCA NA FAIXA DO CARTÃO (H3): os nomes da tabela, cada um com a
         ressalva do seu ponto, as palavras da lista entre eles, e o valor do primeiro ponto do grupo, uma vez, como
         `PontoDaSerie` o escreve. O portão de HTML recompõe-no pela sua conta e compara-o carácter a carácter. */
      const valor = String(pontos.find((p) => p.geo === grupo[0].geo)?.valor ?? '').replace(/(?<=\d)[\u00a0\u2009\u202f](?=\d)/g, ' ');
      const nomes = grupo
        .map((p, i) => {
          const entre = i === 0 ? '' : i === grupo.length - 1 ? palavras.lista.ultimo : palavras.lista.entre;
          const nome = p.geo === AGREGADO_DA_UNIAO ? palavras.uniao : nomeDoPais(p.geo, lang);
          return `${entre}${nome}${p.ressalva ? ` (${p.ressalva})` : ''}`;
        })
        .join('');
      return { geo: m.geo, papel: m.papel, esquerda: m.esquerda, ancora: ancora(m.esquerda), grupo, etiqueta: `${nomes} ${valor}` };
    }),
    porta: routePath('serie', lang, { slug: serie.id }),
    palavras: { uniao: palavras.uniao, porta: palavras.porta, lista: palavras.lista },
  };
}

/**
 * AS FAIXAS DA SECÇÃO DOS PAÍSES, E A ORDEM DELAS (bloco UE2, 02.10.2026).
 *
 * Uma por série de países do livro-razão. A ordem é a dos dois quadros (o
 * Procedimento e depois o Painel Social, como `FIGURAS` os declara), e as
 * medidas com série que os quadros não têm entram no lugar que
 * `MEDIDAS_FORA_DOS_QUADROS` lhes dá: a seguir à medida dos quadros que a tabela
 * nomeia, ou no fim, pela ordem da tabela. Uma série que não seja de uma medida
 * dos quadros nem esteja na tabela fecha a construção, e uma entrada da tabela
 * sem série também: nenhuma faixa entra nem sai sem uma decisão escrita.
 *
 * @returns {{ serie: string, linha: string }[]}
 */
export function faixasDaPaginaDaUniao() {
  const quadros = FIGURAS.map((f) => f.claim);
  const series = allSeries().filter((s) => s.eixo === 'pais');
  /** @param {{ linha_de_portugal?: unknown }} s */
  const linhaDe = (s) => String(s.linha_de_portugal);
  const fora = series.filter((s) => !quadros.includes(linhaDe(s))).map(linhaDe);
  for (const linha of fora) {
    if (!(linha in MEDIDAS_FORA_DOS_QUADROS)) {
      throw new Error(
        `faixa da União: a série da linha «${linha}» não é de uma medida dos dois quadros e não tem lugar declarado ` +
          `em MEDIDAS_FORA_DOS_QUADROS (src/data/faixa-da-uniao.mjs). A secção dos países não a põe por adivinhação.`,
      );
    }
  }
  for (const linha of Object.keys(MEDIDAS_FORA_DOS_QUADROS)) {
    if (!fora.includes(linha)) {
      throw new Error(
        `faixa da União: MEDIDAS_FORA_DOS_QUADROS declara «${linha}», que não é a linha de uma série de países fora ` +
          `dos dois quadros. Uma entrada sem razão de existir tira-se da tabela.`,
      );
    }
  }
  const ordem = series
    .filter((s) => quadros.includes(linhaDe(s)))
    .map(linhaDe)
    .sort((a, b) => quadros.indexOf(a) - quadros.indexOf(b));
  /** @type {string[]} */
  const noFim = [];
  /** @type {Map<string, number>} as que já entraram a seguir a cada medida dos quadros */
  const seguidas = new Map();
  for (const [linha, regra] of Object.entries(MEDIDAS_FORA_DOS_QUADROS)) {
    if (regra.depoisDe === null) {
      noFim.push(linha);
      continue;
    }
    const i = ordem.indexOf(regra.depoisDe);
    if (i < 0) {
      throw new Error(
        `faixa da União: «${linha}» entra a seguir a «${regra.depoisDe}», que não é uma medida dos quadros com série.`,
      );
    }
    const ja = seguidas.get(regra.depoisDe) ?? 0;
    ordem.splice(i + 1 + ja, 0, linha);
    seguidas.set(regra.depoisDe, ja + 1);
  }
  ordem.push(...noFim);
  return ordem.map((linha) => {
    const s = series.find((x) => linhaDe(x) === linha);
    if (!s) throw new Error(`faixa da União: a linha «${linha}» não tem série de países.`);
    return { serie: s.id, linha };
  });
}
