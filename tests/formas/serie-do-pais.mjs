/** RP4: F21 recompõe o desenho do livro, sobre cadeias em memória. */
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { serieDoPais, BASE_DO_INDICE, tabelaPorAnos, segmentoVisivel, LARGURA_DE_UM_ANO, PIXEIS_ATE_A_VIZINHA, ANOS_PARA_AS_DECADAS, MENOR_LARGURA_NO_ECRA } from '../../src/lib/formas/serie-do-pais.mjs';
import { tituloDaSerie, periodoEmPalavras, anoEmPalavras, legendasDasExclusoes } from '../../src/lib/formas/palavras-da-serie.mjs';
import { getSerie, allSeries } from '../../src/lib/series.mjs';
import { FIGURAS_INDEXADAS } from '../../src/data/series-no-tempo.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { unidadeDaLinha } from '../../src/i18n/unidades.mjs';

/** O valor de um ponto como a página o escreve: o espaço entre algarismos em U+00A0 (a regra de `PontoDaSerie`). */
const valorNaPagina = (/** @type {string} */ v) => String(v).replace(/(?<=\d)[ \u202f\u00a0](?=\d)/g, '\u00a0');

/**
 * A LEITURA DE CADA PONTO, COMO A F21 A ESPERA (bloco RP4-c, 05.10.2026, o ponto 4 do mandato): um grupo por zona,
 * pela ordem dos pontos, com a zona, a linha vertical, o ponto marcado e a etiqueta (o valor do ponto pela marca
 * `data-ponto`, o símbolo da unidade quando as marcas o levam, e o período pela marca `data-ponto-periodo`, na forma
 * da casa). Devolve, por grupo, a forma que a F21 compara carácter a carácter.
 * @param {ReturnType<typeof serieDoPais>} g @param {'pt'|'en'} lang @param {(id: string) => any} lerSerie
 */
export function leiturasEsperadas(g, lang, lerSerie = getSerie) {
  if (!g.leituras.length) return [];
  const id = g.linhas[0].id;
  const serie = lerSerie(id);
  const sufixo = g.simbolo ? `\u00a0${g.simbolo}` : '';
  return g.leituras.map((l) => {
    const ponto = (serie.pontos ?? []).find((/** @type {{periodo: string}} */ p) => p.periodo === l.periodo);
    return {
      zona: [l.zona.x, l.zona.y, l.zona.largura, l.zona.altura],
      mira: [l.mira.x, l.mira.x, l.mira.y1, l.mira.y2],
      marca: [l.marca.cx, l.marca.cy, l.marca.r],
      etiqueta: [l.etiqueta.x, l.etiqueta.y, l.etiqueta.ancora],
      valor: [`${id}#${l.periodo}`, ponto ? valorNaPagina(ponto.valor) : null],
      sufixo,
      periodo: [l.etiqueta.x, l.etiqueta.dy, `${id}#${l.periodo}`, dataDaCasa(l.periodo, lang)],
    };
  });
}

/** O HTML de um grupo de leitura, como o componente o escreve (para os desenhos de ensaio em memória). */
function grupoDeEnsaio(/** @type {ReturnType<typeof leiturasEsperadas>[number]} */ e) {
  return `<g><rect x="${e.zona[0]}" y="${e.zona[1]}" width="${e.zona[2]}" height="${e.zona[3]}"></rect><line x1="${e.mira[0]}" x2="${e.mira[1]}" y1="${e.mira[2]}" y2="${e.mira[3]}"></line><circle cx="${e.marca[0]}" cy="${e.marca[1]}" r="${e.marca[2]}"></circle><text x="${e.etiqueta[0]}" y="${e.etiqueta[1]}" text-anchor="${e.etiqueta[2]}"><tspan data-ponto="${e.valor[0]}">${e.valor[1]}</tspan>${e.sufixo}<tspan x="${e.periodo[0]}" dy="${e.periodo[1]}" data-ponto-periodo="${e.periodo[2]}">${e.periodo[3]}</tspan></text></g>`;
}

/** Os irmãos que seguem o desenho, dentro do mesmo pai (a legenda da unidade e a das linhas excluídas). */
function irmaosDepois(/** @type {import('node-html-parser').HTMLElement} */ svg) {
  const out = [];
  for (let e = svg.nextElementSibling; e; e = e.nextElementSibling) out.push(e);
  return out;
}

/** As marcas incluem texto, posição, âncora e traço, carácter a carácter. */
/**
 * ONDE A LEITURA VIVE (a passagem RP4-c-b, 05.10.2026, a decisão do lugar de direção sobre o peso, a I208): um desenho
 * leva as zonas da leitura de cada ponto quando não está dentro da porta de um cartão (`[data-cartao-serie]`): a
 * primeira página e os recibos sim, os cartões não, porque o cartão é a porta para o recibo. A regra lê-se do sítio do
 * desenho na página, e não de uma marca dele: o componente pede as zonas com `comLeitura`, e as duas declarações têm de
 * bater.
 * @param {import('node-html-parser').HTMLElement} svg
 */
export function leituraDoSitio(svg) {
  return !svg.closest?.('[data-cartao-serie]');
}

export function conferirSerie(svg, lang, lerSerie = getSerie, leitura = leituraDoSitio(svg)) {
  const erros = [];
  const falha = (m) => erros.push(`F21 · ${m}`);
  if (svg.rawTagName !== 'svg' || svg.getAttribute('role') !== 'img') falha('a forma não é um SVG com papel de imagem');
  if (svg.querySelector('script, animate, animateTransform, animateMotion, set, foreignObject')) falha('guião ou animação no desenho estático');
  let g;
  try {
    const ids = (svg.getAttribute('data-series') ?? '').split(',');
    const modo = svg.getAttribute('data-modo');
    const v = (svg.getAttribute('viewBox') ?? '').split(' ');
    if (v.length !== 4 || v[0] !== '0' || v[1] !== '0') throw Error('viewBox inválido');
    g = serieDoPais(ids, modo, Number(v[2]), Number(v[3]), lerSerie, { leitura });
  } catch (e) { falha(`não recompõe: ${e.message}`); return erros; }
  const esperado = g.linhas.flatMap(l => l.segmentos.map(points => points.includes(' ') ? [l.id, 'polyline', points] : [l.id, 'circle', ...points.split(','), '2']));
  /* Os traços da série são os filhos diretos do desenho; os pontos marcados da leitura vivem dentro dos seus grupos
     (RP4-c) e conferem-se à parte. */
  const tracos = svg.childNodes.filter((n) => n.rawTagName === 'polyline' || n.rawTagName === 'circle');
  const vistos = tracos.map(p => p.rawTagName === 'polyline' ? [p.getAttribute('data-serie-linha'), 'polyline', p.getAttribute('points')] : [p.getAttribute('data-serie-linha'), 'circle', ...['cx','cy','r'].map(a=>p.getAttribute(a))]);
  if (JSON.stringify(vistos) !== JSON.stringify(esperado)) falha('coordenadas ou identidade dos segmentos diferem do livro');
  for (const [eixo, marcas] of [['valor', g.marcasY], ['tempo', g.marcasX]]) {
    const nos = svg.querySelectorAll(`[data-eixo="${eixo}"]`);
    const esperados = marcas.map((m) => [m.texto, m.x, m.y, eixo === 'valor' ? 'end' : m.ancora,
      eixo === 'valor' ? [String(g.campo.esquerda), m.y, String(g.campo.direita), m.y] : [m.x, String(g.campo.fundo), m.x, String(g.campo.fundo + 4)]]);
    const lidos = nos.map((no) => {
      const t = no.querySelector('text'); const linha = no.querySelector('line');
      if (no.querySelectorAll('text').length !== 1 || no.querySelectorAll('line').length !== 1 || t?.getAttribute('data-nonledger') !== 'escala-de-instrumento') falha('marca sem texto, traço ou origem de escala');
      return [t?.textContent, t?.getAttribute('x'), t?.getAttribute('y'), t?.getAttribute('text-anchor'), ['x1', 'y1', 'x2', 'y2'].map((a) => linha?.getAttribute(a))];
    });
    if (JSON.stringify(lidos) !== JSON.stringify(esperados)) falha(`marcas do eixo ${eixo} diferem da recomposição`);
  }
  if (svg.getAttribute('style') !== `max-width: ${g.largura}px;`) falha('largura máxima diferente da largura do viewBox');
  if (!['nome-periodo','periodo-unidade'].includes(svg.getAttribute('data-titulo'))) falha('forma do título desconhecida');
  const excluidas = legendasDasExclusoes(g.excluidas, lang);
  const irmaos = irmaosDepois(svg);
  const legenda = irmaos.find((e) => e.getAttribute('data-serie-exclusoes') !== undefined);
  const lidas = legenda?.getAttribute('data-serie-exclusoes') === svg.getAttribute('data-series') ? legenda.querySelectorAll('[data-serie-excluida]').map(l => ({id:l.getAttribute('data-serie-excluida'),texto:l.textContent.trim()})) : [];
  if (JSON.stringify(lidas) !== JSON.stringify(excluidas)) falha('legenda das linhas excluídas não é a declarada');
  /* A LEGENDA DA UNIDADE (RP4-c, o ponto 1): um desenho no modo da unidade sem símbolo nas marcas diz a unidade por
     extenso logo a seguir, uma vez, pelo campo da série; um desenho com o símbolo nas marcas, ou indexado, não a tem. */
  const unidades = irmaos.filter((e) => e.getAttribute('data-serie-unidade-legenda') !== undefined);
  if (g.legenda) {
    const id = g.linhas[0]?.id;
    const campo = unidades[0]?.querySelector('[data-serie-campo="unit"]');
    let esperada = null;
    try { esperada = unidadeDaLinha(String(lerSerie(String(id)).unit), lang).texto; } catch { esperada = null; }
    if (unidades.length !== 1 || unidades[0].getAttribute('data-serie-unidade-legenda') !== id || campo?.getAttribute('data-serie') !== id || campo?.textContent !== esperada) falha('legenda da unidade por extenso ausente, repetida ou diferente da unidade da série');
  } else if (unidades.length) falha('legenda da unidade num desenho com o símbolo nas marcas ou indexado');
  const titulos = svg.querySelectorAll('title');
  try {
    if (titulos.length !== 1 || titulos[0].textContent !== tituloDaSerie(g.linhas, lang, svg.getAttribute('data-titulo') === 'periodo-unidade') || /\d/.test(titulos[0]?.textContent ?? '')) falha('título não é o nome e os períodos por extenso');
  } catch (e) { falha(`título não recompõe: ${e.message}`); }
  const permitidos = {
    svg: ['class', 'data-forma', 'data-series', 'data-modo', 'viewBox', 'role', 'style', 'data-titulo'],
    title: [], g: ['data-eixo'],
    line: ['class', 'x1', 'x2', 'y1', 'y2'],
    text: ['data-nonledger', 'x', 'y', 'text-anchor', 'dominant-baseline'],
    polyline: ['class', 'data-serie-linha', 'points'],
    circle: ['class','data-serie-linha','cx','cy','r'],
    /* RP4-c: a zona e as duas peças da etiqueta da leitura de cada ponto. */
    rect: ['x', 'y', 'width', 'height'],
    tspan: ['data-ponto', 'data-ponto-periodo', 'x', 'dy'],
  };
  for (const el of [svg, ...svg.querySelectorAll('*')]) {
    const attrs = permitidos[el.rawTagName];
    if (!attrs || Object.keys(el.attributes).some((a) => !attrs.includes(a))) falha('elemento ou atributo que altera a forma estática');
  }
  if (svg.getAttribute('class') !== 'serie-do-pais') falha('classe do desenho alterada');
  for (const p of tracos) if (p.getAttribute('class') !== 'serie-do-pais-linha') falha('classe do traço alterada');
  /* A LEITURA DE CADA PONTO (RP4-c, o ponto 4): os grupos sem `data-eixo`, um por zona e pela ordem dos pontos, cada
     um com a zona, a linha vertical, o ponto marcado e a etiqueta, carácter a carácter, e nada mais; sem classes nem
     outros atributos (a lista dos permitidos, acima), porque a folha os acende pela estrutura do desenho. */
  const grupos = svg.childNodes.filter((n) => n.rawTagName === 'g' && n.getAttribute('data-eixo') === undefined);
  /* RP4-c-b: as zonas só onde a leitura vive. */
  if (!leitura && grupos.length) falha('zonas de leitura num desenho que não as leva (o desenho de um cartão é a porta para o recibo)');
  if (leitura && g.leituras.length && !grupos.length) falha('desenho sem as zonas de leitura fora da porta de um cartão');
  let esperadas = [];
  try { esperadas = leiturasEsperadas(g, lang, lerSerie); } catch (e) { falha(`a leitura não recompõe: ${e.message}`); }
  const lidasDaLeitura = grupos.map((grupo) => {
    const filhos = grupo.childNodes.filter((n) => n.rawTagName);
    const [rect, line, circle, text] = filhos;
    const tspans = text?.childNodes.filter((n) => n.rawTagName === 'tspan') ?? [];
    const soltos = text?.childNodes.filter((n) => !n.rawTagName).map((n) => n.text).join('') ?? null;
    if (filhos.map((f) => f.rawTagName).join(',') !== 'rect,line,circle,text' || tspans.length !== 2 || text.childNodes.filter((n) => n.rawTagName).length !== 2) return null;
    return {
      zona: ['x', 'y', 'width', 'height'].map((a) => rect.getAttribute(a)),
      mira: ['x1', 'x2', 'y1', 'y2'].map((a) => line.getAttribute(a)),
      marca: ['cx', 'cy', 'r'].map((a) => circle.getAttribute(a)),
      etiqueta: ['x', 'y', 'text-anchor'].map((a) => text.getAttribute(a)),
      valor: [tspans[0].getAttribute('data-ponto'), tspans[0].textContent],
      sufixo: soltos,
      periodo: [tspans[1].getAttribute('x'), tspans[1].getAttribute('dy'), tspans[1].getAttribute('data-ponto-periodo'), tspans[1].textContent],
    };
  });
  if (lidasDaLeitura.some((l) => l === null)) falha('leitura de um ponto sem a zona, a linha, o ponto e a etiqueta, por esta ordem');
  else if (JSON.stringify(lidasDaLeitura) !== JSON.stringify(esperadas)) {
    const i = lidasDaLeitura.findIndex((l, k) => JSON.stringify(l) !== JSON.stringify(esperadas[k]));
    falha(`leitura dos pontos difere da recomposição (${lidasDaLeitura.length} zonas, ${esperadas.length} pontos; a primeira diferença na zona ${i + 1})`);
  }
  for (const no of svg.querySelectorAll('[data-eixo]')) {
    const t = no.querySelector('text'); const l = no.querySelector('line');
    const valor = no.getAttribute('data-eixo') === 'valor';
    if (t?.getAttribute('dominant-baseline') !== (valor ? 'middle' : undefined)) falha('alinhamento da marca alterado');
    const zero = valor && t?.textContent === '0';
    if (l?.getAttribute('class') !== (zero ? 'serie-do-pais-guia serie-do-pais-zero' : 'serie-do-pais-guia')) falha('classe da escala alterada');
  }
  const marcas = g.marcasX.length + g.marcasY.length;
  const zonas = g.leituras.length;
  if (svg.querySelectorAll('line').length !== marcas + zonas || svg.querySelectorAll('text').length !== marcas + zonas || svg.querySelectorAll('g').length !== marcas + zonas
    || svg.querySelectorAll('rect').length !== zonas || svg.querySelectorAll('tspan').length !== 2 * zonas
    || svg.querySelectorAll('circle').length !== tracos.filter((t) => t.rawTagName === 'circle').length + zonas) falha('geometria ou texto acrescentado fora da escala e da leitura');
  return erros;
}

/**
 * A MARCA DO ÚLTIMO ANO, LIDA PELOS PONTOS (bloco RP4-m, 05.10.2026, o ponto 5 do mandato). Com leitura própria, e
 * não pela escala do módulo: numa série com um ponto em janeiro do último ano, a marca desse ano está no x desse
 * ponto, com a âncora das marcas intermédias; numa série trimestral, no x do primeiro trimestre. Devolve as queixas.
 * @param {ReturnType<typeof serieDoPais>} g @param {{ pontos: {periodo: string}[], periodicidade: string, ultimo_periodo: string }} s
 */
export function marcaDoUltimoAno(g, s) {
  const queixas = [];
  const ano = String(s.ultimo_periodo).slice(0, 4);
  const primeiro = s.periodicidade === 'mensal' ? `${ano}-01` : s.periodicidade === 'trimestral' ? `${ano}-T1` : s.periodicidade === 'semestral' ? `${ano}-S1` : ano;
  const pos = s.pontos.findIndex((p) => p.periodo === primeiro);
  if (pos < 0) return [`a série não tem o ponto ${primeiro}, e a marca do último ano não se lê por ele`];
  const xDoPrimeiro = g.linhas[0].segmentos.join(' ').split(' ')[pos].split(',')[0];
  const ultima = g.marcasX[g.marcasX.length - 1];
  if (ultima.texto !== ano) queixas.push(`a última marca do eixo do tempo diz ${ultima.texto} e o último ano é ${ano}`);
  if (ultima.x !== xDoPrimeiro) queixas.push(`a marca de ${ano} está em x=${ultima.x} e o primeiro ponto desse ano em x=${xDoPrimeiro}`);
  const intermedias = g.marcasX.slice(1, -1).map((m) => m.ancora);
  const ancora = intermedias.length ? intermedias[0] : 'middle';
  if (ultima.ancora !== ancora || intermedias.some((a) => a !== ancora)) queixas.push(`a marca de ${ano} ancora-se em «${ultima.ancora}» e as intermédias em «${ancora}»`);
  return queixas;
}

/**
 * O SÍMBOLO NAS MARCAS, LIDO PELA UNIDADE DA SÉRIE (bloco RP4-c, 05.10.2026, o ponto 1 do mandato), com leitura própria
 * e não pela regra do módulo: numa série em «%», cada marca do eixo dos valores acaba no espaço inquebrável e no «%»,
 * menos a do zero, que é «0»; numa série com outra unidade nenhuma marca tem «%» nem «€», e o desenho no modo da
 * unidade tem a legenda da unidade por extenso. Devolve as queixas.
 * @param {ReturnType<typeof serieDoPais>} g @param {string} unidade
 */
export function simboloNasMarcas(g, unidade) {
  const queixas = [];
  for (const m of g.marcasY) {
    const numero = m.texto.replace(/\u00a0%$/, '');
    if (unidade === '%') {
      if (numero === '0' ? m.texto !== '0' : m.texto === numero) queixas.push(`a marca «${m.texto}» de uma série em «%» ${numero === '0' ? 'é o zero com o símbolo' : 'não acaba no símbolo da unidade'}`);
    } else if (/[%€]/.test(m.texto)) queixas.push(`a marca «${m.texto}» de uma série em «${unidade}» escreve um símbolo`);
  }
  if (g.modo === 'unidade' && unidade !== '%' && !g.legenda) queixas.push(`o desenho de uma série em «${unidade}» não diz a unidade por extenso`);
  if (unidade === '%' && g.legenda) queixas.push('o desenho de uma série em «%» repete a unidade numa legenda');
  return queixas;
}

/**
 * AS DÉCADAS DO EIXO DO TEMPO, LIDAS PELOS PONTOS (bloco RP4-c, 05.10.2026, o ponto 2 do mandato), com leitura própria:
 * numa série que cobre vinte anos ou mais, cada marca intermédia é uma década, centrada no x do primeiro período desse
 * ano (lido nas coordenadas do traço); e cada década da série está marcada se e só se fica a 64 píxeis ou mais da ponta
 * de fora da etiqueta vizinha à esquerda (a primeira marca, ou a última década marcada) e da ponta de fora da última
 * marca, contadas com a largura de um ano medida. Devolve as queixas.
 * @param {ReturnType<typeof serieDoPais>} g @param {{ pontos: {periodo: string}[], periodicidade: string, primeiro_periodo: string, ultimo_periodo: string }} s
 */
export function decadasDoEixo(g, s) {
  const queixas = [];
  const primeiroAno = Number(String(s.primeiro_periodo).slice(0, 4));
  const ultimoAno = Number(String(s.ultimo_periodo).slice(0, 4));
  if (ultimoAno - primeiroAno + 1 < ANOS_PARA_AS_DECADAS) return [`a série cobre ${ultimoAno - primeiroAno + 1} anos, e as décadas são das que cobrem ${ANOS_PARA_AS_DECADAS} ou mais`];
  /* A escala do tempo, lida no traço: o mês de cada período por uma conta desta célula, e as posições do primeiro e do
     último ponto. Uma década pode cair num ano sem ponto (uma lacuna), e a marca dela está na mesma escala. */
  const periodos = s.pontos.map((p) => p.periodo);
  const xs = g.linhas[0].segmentos.join(' ').split(' ').map((par) => Number(par.split(',')[0]));
  const mes = (/** @type {string} */ per) => {
    const m = /^(\d{4})(?:-(\d{2})|-T([1-4])|-S([12]))?$/.exec(per);
    if (!m) throw Error(`período que esta célula não lê: ${per}`);
    return Number(m[1]) * 12 + (m[2] ? Number(m[2]) - 1 : m[3] ? (Number(m[3]) - 1) * 3 : m[4] ? (Number(m[4]) - 1) * 6 : 0);
  };
  const m0 = mes(periodos[0]); const mN = mes(periodos[periodos.length - 1]);
  const x0 = xs[0]; const xN = xs[xs.length - 1];
  const xDoAno = (/** @type {number} */ ano) => (mN === m0 ? x0 : x0 + (ano * 12 - m0) * (xN - x0) / (mN - m0));
  const meio = g.marcasX.slice(1, -1);
  for (const m of meio) {
    const ano = Number(m.texto);
    const xa = xDoAno(ano);
    if (!Number.isInteger(ano) || ano % 10) queixas.push(`a marca intermédia ${m.texto} não é uma década`);
    else if (Math.abs(Number(m.x) - xa) > 0.002) queixas.push(`a década ${m.texto} está em x=${m.x} e o começo desse ano em x=${xa.toFixed(3)}`);
    if (m.ancora !== 'middle') queixas.push(`a década ${m.texto} não está centrada`);
  }
  const metade = LARGURA_DE_UM_ANO / 2;
  const foraDaUltima = Number(g.marcasX[g.marcasX.length - 1].x) + metade;
  let fora = Number(g.marcasX[0].x);
  const marcadas = new Set(meio.map((m) => Number(m.texto)));
  for (let a = (Math.floor(primeiroAno / 10) + 1) * 10; a < ultimoAno; a += 10) {
    const xa = xDoAno(a);
    const cabe = xa - fora >= PIXEIS_ATE_A_VIZINHA && foraDaUltima - xa >= PIXEIS_ATE_A_VIZINHA;
    if (marcadas.has(a) && !cabe) queixas.push(`a década ${a} está marcada a menos de ${PIXEIS_ATE_A_VIZINHA} píxeis da etiqueta vizinha`);
    if (!marcadas.has(a) && cabe) queixas.push(`a década ${a} cabe e não está marcada`);
    if (marcadas.has(a)) fora = xa - metade;
  }
  return queixas;
}

/**
 * AS ZONAS DA LEITURA, LIDAS PELOS PONTOS (bloco RP4-c, 05.10.2026, o ponto 4 do mandato; por colunas desde a passagem
 * RP4-c-b), com leitura própria. Num desenho que leva a leitura (uma série no modo da unidade, fora da porta de um
 * cartão): o campo parte-se em colunas contadas na menor largura no ecrã, uma conta desta célula; as zonas partem o
 * campo de ponta a ponta sem buracos nem sobreposições, cada uma sobre colunas inteiras; o ponto de cada zona (o do x da
 * sua linha vertical) é o ponto mais próximo do meio de cada coluna dela, lidos os pontos nas coordenadas do traço; duas
 * zonas vizinhas não leem o mesmo ponto; cada zona tem pelo menos um píxel na menor largura no ecrã; a linha vertical e o
 * ponto marcado estão no ponto; a etiqueta está no canto de cima do lado de lá. Noutro desenho não há zonas. Devolve as
 * queixas.
 * @param {ReturnType<typeof serieDoPais>} g @param {boolean} [leitura]
 */
export function zonasDaLeitura(g, leitura = true) {
  if (!leitura || g.modo !== 'unidade' || g.linhas.length !== 1) return g.leituras.length ? ['há zonas de leitura num desenho que não as leva'] : [];
  const queixas = [];
  const pontos = g.linhas[0].segmentos.join(' ').split(' ').map((par) => par.split(',').map(Number));
  const { esquerda, direita, cima, fundo } = g.campo;
  const escala = Math.min(g.largura, MENOR_LARGURA_NO_ECRA) / g.largura;
  const n = Math.max(1, Math.floor((direita - esquerda) * escala));
  const passo = (direita - esquerda) / n;
  /* A distância mínima do meio de uma coluna a um ponto, por procura inteira. As coordenadas do traço estão escritas a três
     casas, e por isso um ponto que fique à distância mínima até dois milésimos é um dos mais próximos (um empate). */
  const minima = (/** @type {number} */ k) => {
    const c = esquerda + (k + 0.5) * passo;
    return Math.min(...pontos.map((pt) => Math.abs(pt[0] - c)));
  };
  if (!g.leituras.length) return ['o desenho leva a leitura e não tem zonas'];
  let antes = esquerda;
  let anterior = -1;
  g.leituras.forEach((l, z) => {
    const zx = Number(l.zona.x); const fim = zx + Number(l.zona.largura);
    const k0 = Math.round((zx - esquerda) / passo); const k1 = Math.round((fim - esquerda) / passo) - 1;
    if (Math.abs(zx - antes) > 0.002) queixas.push(`a zona ${z + 1} começa em ${zx} e a anterior acaba em ${antes}`);
    if (Math.abs(zx - (esquerda + k0 * passo)) > 0.002 || Math.abs(fim - (esquerda + (k1 + 1) * passo)) > 0.002 || k1 < k0) queixas.push(`a zona ${z + 1} não está sobre colunas inteiras`);
    if (Number(l.zona.largura) * escala < 1 - 1e-6) queixas.push(`a zona ${z + 1} tem menos de um píxel na menor largura no ecrã`);
    const i = pontos.findIndex((pt) => Math.abs(pt[0] - Number(l.mira.x)) <= 0.0015);
    if (i < 0) queixas.push(`a linha vertical da zona ${z + 1} não está num ponto`);
    else {
      for (let k = Math.max(k0, 0); k <= Math.min(k1, n - 1); k++) {
        const c = esquerda + (k + 0.5) * passo;
        if (Math.abs(pontos[i][0] - c) > minima(k) + 0.002) { queixas.push(`a coluna ${k + 1} da zona ${z + 1} lê um ponto que não é o mais próximo dela`); break; }
      }
      if (i === anterior) queixas.push(`as zonas ${z} e ${z + 1}, vizinhas, leem o mesmo ponto`);
      if (Number(l.marca.cx) !== pontos[i][0] || Number(l.marca.cy) !== pontos[i][1]) queixas.push(`o ponto marcado da zona ${z + 1} não está no ponto`);
      const doLadoDeLa = pontos[i][0] <= (esquerda + direita) / 2;
      if (l.etiqueta.ancora !== (doLadoDeLa ? 'end' : 'start') || Number(l.etiqueta.x) !== (doLadoDeLa ? direita : esquerda + 6)) queixas.push(`a etiqueta da zona ${z + 1} não está no canto do lado de lá`);
      anterior = i;
    }
    if (Number(l.zona.y) !== cima || Number(l.zona.altura) !== fundo - cima || Number(l.mira.y1) !== cima || Number(l.mira.y2) !== fundo) queixas.push(`a zona ${z + 1} ou a sua linha não vão de cima a baixo do campo`);
    antes = fim;
  });
  if (Math.abs(antes - direita) > 0.002) queixas.push(`as zonas acabam em ${antes} e o campo em ${direita}`);
  return queixas;
}

/**
 * AS PLANTAS DA LEITURA E DO SÍMBOLO (bloco RP4-c, 05.10.2026, os pontos 1 e 4 do mandato), em memória e nunca no
 * `dist/`: sobre o HTML de um desenho construído com zonas (com o seu pai, onde vivem as legendas), cada estrago tem de
 * ser recusado pela F21 com a queixa que lhe corresponde, e o controlo íntegro tem de passar primeiro.
 * @param {string} html @param {'pt'|'en'} lang
 */
export function plantasDaLeitura(html, lang) {
  const limpo = parse(html).querySelector('svg[data-forma="serie-do-pais"]');
  if (!limpo) return [{ nome: 'controlo', controlo: 1, mordeu: false, queixa: 'nenhum desenho no controlo' }];
  const controlo = conferirSerie(limpo, lang);
  const grupos = (/** @type {import('node-html-parser').HTMLElement} */ s) => s.childNodes.filter((n) => n.rawTagName === 'g' && n.getAttribute('data-eixo') === undefined);
  /** @type {[string, RegExp, (s: import('node-html-parser').HTMLElement) => void][]} */
  const casos = [
    ['uma zona deslocada', /leitura dos pontos difere/, (s) => { const r = grupos(s)[0].querySelector('rect'); r.setAttribute('x', String(Number(r.getAttribute('x')) + 1)); }],
    ['o valor de outro ponto na etiqueta', /leitura dos pontos difere/, (s) => { const [a, b] = grupos(s).map((x) => x.querySelector('[data-ponto]')); a.set_content(b.textContent === a.textContent ? `${a.textContent}1` : b.textContent); }],
    ['o período de outro ponto na etiqueta', /leitura dos pontos difere/, (s) => { const [a, b] = grupos(s).map((x) => x.querySelector('[data-ponto-periodo]')); a.set_content(b.textContent); }],
    ['a etiqueta acesa por um atributo', /atributo/, (s) => grupos(s)[0].querySelector('text').setAttribute('visibility', 'visible')],
    ['uma zona a menos', /leitura dos pontos difere|acrescentado/, (s) => grupos(s).at(-1).remove()],
    /* RP4-c-b: uma zona a mais (a primeira, repetida a seguir a si própria) e uma leitura trocada (a zona da segunda coluna
       com o valor e o período do ponto da primeira, com as marcas certas desse ponto). */
    ['uma zona a mais', /leitura dos pontos difere|acrescentado/, (s) => { const g0 = grupos(s)[0]; g0.insertAdjacentHTML('afterend', g0.outerHTML); }],
    ['uma leitura trocada', /leitura dos pontos difere/, (s) => {
      const [a, b] = grupos(s);
      for (const sel of ['[data-ponto]', '[data-ponto-periodo]']) {
        const de = a.querySelector(sel); const para = b.querySelector(sel);
        const marca = sel.slice(1, -1);
        para.setAttribute(marca, String(de.getAttribute(marca))); para.set_content(de.textContent);
      }
    }],
  ];
  if (limpo.querySelector('[data-eixo="valor"] text')?.textContent?.endsWith(' %')) {
    casos.push(['uma marca sem o símbolo numa série em «%»', /marcas do eixo valor/, (s) => {
      const t = s.querySelectorAll('[data-eixo="valor"] text').find((x) => x.textContent.endsWith(' %'));
      t.set_content(t.textContent.replace(/ %$/, ''));
    }]);
  }
  return casos.map(([nome, mordida, muda]) => {
    const raiz = parse(html); const svg = raiz.querySelector('svg[data-forma="serie-do-pais"]'); muda(svg);
    const queixa = conferirSerie(svg, lang).find((e) => mordida.test(e));
    return { nome, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null };
  });
}

/**
 * A PLANTA DA LEGENDA DA UNIDADE (bloco RP4-c, o ponto 1), em memória: sobre um desenho construído sem símbolo nas
 * marcas (com o seu pai), a legenda tirada e a legenda com outra unidade têm de ser recusadas.
 * @param {string} html @param {'pt'|'en'} lang
 */
export function plantasDaLegenda(html, lang) {
  const limpo = parse(html).querySelector('svg[data-forma="serie-do-pais"]');
  const controlo = limpo ? conferirSerie(limpo, lang) : ['nenhum desenho'];
  /** @type {[string, (r: import('node-html-parser').HTMLElement) => void][]} */
  const casos = [
    ['a legenda da unidade tirada', (r) => r.querySelector('[data-serie-unidade-legenda]')?.remove()],
    ['a legenda com outra unidade', (r) => r.querySelector('[data-serie-unidade-legenda] [data-serie-campo="unit"]')?.set_content('%')],
  ];
  return casos.map(([nome, muda]) => {
    const raiz = parse(html); muda(raiz);
    const svg = raiz.querySelector('svg[data-forma="serie-do-pais"]');
    const queixa = svg ? conferirSerie(svg, lang).find((e) => /legenda da unidade/.test(e)) : null;
    return { nome, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null };
  });
}

/**
 * F21 · A REGRA DA PÁGINA (RP4; mudou de forma no bloco RP4-m, 05.10.2026, o ponto 4 do mandato).
 *
 * No RP4 nenhuma página usava o modo indexado e o gráfico de um recibo era só a sua série, e a regra dizia isso
 * mesmo («nenhuma página usa o modo indexado neste bloco»). O ponto 4 do RP4-m pede a primeira figura indexada do
 * sítio, no recibo da série derivada do salário real, declarada em `FIGURAS_INDEXADAS`. A regra muda de forma e
 * conserva o que protege: o modo indexado só no recibo de uma série com figura declarada, e aí só as séries da
 * declaração, pela ordem dela (a última é a série do recibo, as outras são origens dela, o que a vista confere);
 * o recibo de uma série declarada desenha a figura e não outra coisa; o gráfico de qualquer outro recibo continua
 * a ser só a sua série, no modo da unidade. A geometria de cada desenho continua recomposta por `conferirSerie`, no
 * modo que o desenho declara, e esta regra não toca nela. Devolve as queixas.
 * @param {import('node-html-parser').HTMLElement} svg
 * @param {{ key?: string, params?: { slug?: string } } | null | undefined} rota
 * @param {Record<string, string[]>} [figuras]
 */
export function regraDaPagina(svg, rota, figuras = FIGURAS_INDEXADAS) {
  const erros = [];
  const modo = svg.getAttribute('data-modo');
  const series = svg.getAttribute('data-series');
  const slug = rota?.key === 'serie' ? String(rota.params?.slug ?? '') : null;
  const declarada = slug !== null ? figuras[slug] ?? null : null;
  if (modo === 'indice') {
    if (!declarada) erros.push('F21 · o modo indexado só no recibo de uma série com figura indexada declarada');
    else if (series !== declarada.join(',')) erros.push('F21 · a figura indexada do recibo não é a declarada');
  } else if (modo !== 'unidade') {
    erros.push('F21 · modo do desenho desconhecido');
  } else if (slug !== null) {
    if (declarada) erros.push('F21 · o recibo com figura indexada declarada desenha-a no modo indexado');
    else if (series !== slug) erros.push('F21 · o gráfico do recibo não é da sua série');
  }
  return erros;
}

/**
 * As plantas da regra da página, em memória (nunca no `dist/`), com os dois controlos íntegros a passar primeiro:
 * o desenho da figura declarada no seu recibo e o desenho de um recibo comum no seu.
 * @param {import('node-html-parser').HTMLElement} svgDaFigura @param {string} slugDaFigura
 * @param {import('node-html-parser').HTMLElement} svgComum @param {string} slugComum
 */
export function plantasDaRegraDaPagina(svgDaFigura, slugDaFigura, svgComum, slugComum) {
  const naFigura = { key: 'serie', params: { slug: slugDaFigura } };
  const noComum = { key: 'serie', params: { slug: slugComum } };
  const controlo = [...regraDaPagina(svgDaFigura, naFigura), ...regraDaPagina(svgComum, noComum)];
  const copia = (/** @type {import('node-html-parser').HTMLElement} */ s) => /** @type {import('node-html-parser').HTMLElement} */ (parse(s.outerHTML).querySelector('svg'));
  /** @type {[string, RegExp, () => string[]][]} */
  const casos = [
    ['o desenho indexado no recibo de uma série sem figura declarada', /só no recibo de uma série com figura indexada declarada/, () => regraDaPagina(copia(svgDaFigura), noComum)],
    ['o desenho indexado numa página que não é um recibo', /só no recibo de uma série com figura indexada declarada/, () => regraDaPagina(copia(svgDaFigura), { key: 'entrada', params: {} })],
    ['a figura declarada com as séries por outra ordem', /não é a declarada/, () => {
      const s = copia(svgDaFigura);
      s.setAttribute('data-series', String(s.getAttribute('data-series')).split(',').reverse().join(','));
      return regraDaPagina(s, naFigura);
    }],
    ['o recibo declarado só com a sua série, no modo da unidade', /desenha-a no modo indexado/, () => {
      const s = copia(svgComum);
      s.setAttribute('data-series', slugDaFigura);
      return regraDaPagina(s, naFigura);
    }],
    ['o recibo com o gráfico de outra série', /não é da sua série/, () => {
      const s = copia(svgComum);
      s.setAttribute('data-series', slugDaFigura);
      return regraDaPagina(s, noComum);
    }],
  ];
  return casos.map(([nome, mordida, f]) => {
    const queixa = f().find((e) => mordida.test(e));
    return { nome, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null };
  });
}

/** Cada planta corre o mesmo detetor, com o controlo íntegro a passar primeiro. */
export function plantasDaSerie(html, lang) {
  const limpo = parse(html).querySelector('svg[data-forma="serie-do-pais"]');
  if (!limpo) return [{ nome: 'controlo', mordeu: false, queixa: 'nenhum desenho no controlo' }];
  const controlo = conferirSerie(limpo, lang);
  const casos = [
    ['ponto deslocado', /coordenadas/, (s) => { const p = s.querySelector('polyline'); p.setAttribute('points', p.getAttribute('points').replace(/^[\d.-]+/, (n) => String(Number(n) + 1))); }],
    ['largura máxima retirada', /largura máxima/, s => s.removeAttribute('style')],
    ['marca trocada', /marcas do eixo/, (s) => s.querySelector('[data-eixo] text').set_content('999')],
    ['série trocada', /coordenadas/, (s) => s.setAttribute('data-series', s.getAttribute('data-series') === 'serie-ipc-indice' ? 'serie-pensao-media-anual' : 'serie-ipc-indice')],
    ['guião no desenho', /guião/, (s) => s.insertAdjacentHTML('beforeend', '<script>void 0</script>')],
    ['traço transformado', /atributo/, (s) => s.querySelector('polyline').setAttribute('transform', 'translate(4 0)')],
    ['traço escondido por classe', /classe do traço/, (s) => s.querySelector('polyline').setAttribute('class', 'vh')],
    ['algarismo fora da escala', /acrescentado/, (s) => s.insertAdjacentHTML('beforeend', '<text>99</text>')],
  ];
  return casos.map(([nome, mordida, muda]) => {
    const svg = parse(limpo.outerHTML).querySelector('svg'); muda(svg);
    const erros = conferirSerie(svg, lang); const queixa = erros.find((e) => mordida.test(e));
    return { nome, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null };
  });
}

/** HTML sintético em memória para exercer a F21 em formas que o livro ainda não tem. */
function desenhoDeEnsaio(ids, g, lang, lerSerie = getSerie) {
  const marcas = (eixo, ms) => ms.map(m => `<g data-eixo="${eixo}"><line class="serie-do-pais-guia${eixo==='valor' && m.valor===0?' serie-do-pais-zero':''}" x1="${eixo==='valor'?g.campo.esquerda:m.x}" x2="${eixo==='valor'?g.campo.direita:m.x}" y1="${eixo==='valor'?m.y:g.campo.fundo}" y2="${eixo==='valor'?m.y:g.campo.fundo+4}"></line><text data-nonledger="escala-de-instrumento" x="${m.x}" y="${m.y}" text-anchor="${eixo==='valor'?'end':m.ancora}"${eixo==='valor'?' dominant-baseline="middle"':''}>${m.texto}</text></g>`).join('');
  const segmentos = g.linhas.flatMap(l=>l.segmentos.map(p=>{
    const forma=segmentoVisivel(p);
    return forma.tipo==='ponto'?`<circle class="serie-do-pais-linha" data-serie-linha="${l.id}" cx="${forma.cx}" cy="${forma.cy}" r="${forma.r}"></circle>`:`<polyline class="serie-do-pais-linha" data-serie-linha="${l.id}" points="${p}"></polyline>`;
  })).join('');
  const legendas=legendasDasExclusoes(g.excluidas,lang);
  const legenda=legendas.length?`<ul data-serie-exclusoes="${ids.join(',')}">${legendas.map(l=>`<li data-serie-excluida="${l.id}">${l.texto}</li>`).join('')}</ul>`:'';
  /* RP4-c: as zonas da leitura e a legenda da unidade, como o componente as escreve. */
  const leituras=leiturasEsperadas(g,lang,lerSerie).map(grupoDeEnsaio).join('');
  const unidade=g.legenda?`<span class="serie-do-pais-unidade" data-serie-unidade-legenda="${ids[0]}"><span class="campo-da-serie" data-serie="${ids[0]}" data-serie-campo="unit">${unidadeDaLinha(String(lerSerie(ids[0]).unit),lang).texto}</span></span>`:'';
  return parse(`<div><svg class="serie-do-pais" style="max-width: ${g.largura}px;" data-titulo="nome-periodo" data-forma="serie-do-pais" data-series="${ids.join(',')}" data-modo="${g.modo}" viewBox="0 0 ${g.largura} ${g.altura}" role="img"><title>${tituloDaSerie(g.linhas,lang)}</title>${marcas('valor',g.marcasY)}${marcas('tempo',g.marcasX)}${segmentos}${leituras}</svg>${unidade}${legenda}</div>`).querySelector('svg');
}

export function provasDoModulo() {
  const provas = [];
  const prova = (nome, f) => { f(); provas.push({ nome, passou: true }); };
  const id = 'serie-ipc-indice';
  const original = serieDoPais([id]);
  prova('determinismo, todos os pontos e todas as séries da casa', () => {
    assert.deepEqual(serieDoPais([id]), original);
    for (const s of allSeries().filter((s) => s.eixo === 'periodo')) {
      const g = serieDoPais([s.id]);
      assert.equal(g.linhas[0].segmentos.reduce((n, p) => n + p.split(' ').length, 0), s.pontos.length);
      assert.equal(tabelaPorAnos(s).flatMap((a) => a.celulas).filter((c) => c.ponto).length, s.pontos.length);
    }
  });
  prova('escala conhecida: zero e dez nas pontas do campo', () => {
    const s = { ...getSerie(id), periodicidade: 'anual', pontos: [{ periodo: '2015', valor: '0' }, { periodo: '2016', valor: '10' }], lacunas: [] };
    const g = serieDoPais([id], 'unidade', 360, 200, () => s);
    assert.equal(g.linhas[0].segmentos[0], '48,170 342,12');
    assert.deepEqual(g.marcasY.map((m) => [m.texto, m.y]), [['0', '170'], ['5', '91'], ['10', '12']]);
  });
  prova('um ponto a menos muda as coordenadas', () => {
    const s = structuredClone(getSerie(id)); s.pontos.shift();
    assert.notDeepEqual(serieDoPais([id], 'unidade', 360, 200, () => s).linhas[0].segmentos, original.linhas[0].segmentos);
  });
  prova('uma lacuna declarada quebra a linha sem interpolar', () => {
    const s = structuredClone(getSerie(id)); const [p] = s.pontos.splice(10, 1); s.lacunas = [{ periodo: p.periodo, razao: null }];
    const g = serieDoPais([id], 'unidade', 360, 200, () => s);
    assert.equal(g.linhas[0].segmentos.length, 2);
    assert.equal(g.linhas[0].segmentos[0].split(' ').length, 10);
    s.lacunas = []; assert.throws(() => serieDoPais([id], 'unidade', 360, 200, () => s), /lacuna por declarar/);
  });
  const par = ['serie-salario-minimo-mensal', id];
  prova('unidades diferentes recusadas no modo unidade', () => assert.throws(() => serieDoPais(par), /unidades diferentes/));
  prova('duas cadências e unidades indexadas a cem em janeiro de dois mil e quinze', () => {
    const g = serieDoPais(par, 'indice');
    const bases = g.linhas.map((l) => {
      const s = getSerie(l.id); assert.equal(l.base, BASE_DO_INDICE[s.periodicidade]);
      const pos = s.pontos.findIndex((p) => p.periodo === l.base);
      return l.segmentos.join(' ').split(' ')[pos];
    });
    assert.equal(bases[0], bases[1]);
    assert.equal(bases[0].split(',')[1], g.marcasY.find((m) => m.valor === 100).y);
  });
  prova('linha sem o período de base excluída com razão, sem perder as outras', () => {
    const s = structuredClone(getSerie(id)); s.pontos = s.pontos.filter((p) => p.periodo !== '2015-01');
    const ler = chave => chave === id ? s : getSerie(chave);
    const g = serieDoPais(par, 'indice', 360, 200, ler);
    assert.deepEqual(g.linhas.map(l=>l.id), [par[0]]);
    assert.deepEqual(g.excluidas, [{id, base:'2015-01',motivo:'ausente'}]);
    for (const lang of ['pt','en']) {
      const legenda = legendasDasExclusoes(g.excluidas, lang); assert.equal(legenda.length,1);
      assert(legenda[0].texto.includes(periodoEmPalavras('2015-01',lang))); assert(!/\d/.test(legenda[0].texto));
      const svg = desenhoDeEnsaio(par,g,lang); assert.deepEqual(conferirSerie(svg,lang,ler),[]);
      svg.nextElementSibling.remove(); assert(conferirSerie(svg,lang,ler).some(e=>/legenda das linhas excluídas/.test(e)));
    }
    assert.throws(() => serieDoPais([id], 'indice', 360, 200, ler), /nenhuma linha.*2015-01/);
  });
  prova('base nula recusada', () => {
    const s = structuredClone(getSerie(id)); s.pontos.find((p) => p.periodo === '2015-01').valor = '0';
    const g=serieDoPais(par,'indice',360,200,chave=>chave===id?s:getSerie(chave));
    assert.deepEqual(g.excluidas,[{id,base:'2015-01',motivo:'nula'}]);
    assert(legendasDasExclusoes(g.excluidas,'pt')[0].texto.endsWith('é zero.'));
    assert.throws(() => serieDoPais([id], 'indice', 360, 200, () => s), /base não nulo/);
  });
  prova('períodos por extenso nas duas edições', () => {
    assert.equal(periodoEmPalavras('2015-01', 'pt'), 'janeiro de dois mil e quinze');
    assert.equal(periodoEmPalavras('2015-S1', 'en'), 'first half of twenty fifteen');
    assert.equal(periodoEmPalavras('1948', 'pt'), 'mil novecentos e quarenta e oito');
  });
  prova('um ponto isolado entre lacunas é um círculo visível', () => {
    const s = {...getSerie(id), periodicidade:'anual', pontos:[
      {periodo:'2011',valor:'0'},{periodo:'2012',valor:'2'},{periodo:'2014',valor:'5'},{periodo:'2016',valor:'8'},{periodo:'2017',valor:'10'}
    ],lacunas:[{periodo:'2013'},{periodo:'2015'}]};
    const g = serieDoPais([id],'unidade',360,200,()=>s,{leitura:true});
    const segmentos = g.linhas[0].segmentos.map(segmentoVisivel);
    assert.deepEqual(segmentos.map(s=>s.tipo),['linha','ponto','linha']);
    assert.deepEqual(segmentos[1],{tipo:'ponto',cx:'195',cy:'91',r:'2'});
    const svg=desenhoDeEnsaio([id],g,'pt',()=>s); assert.deepEqual(conferirSerie(svg,'pt',()=>s),[]);
    const ponto=svg.querySelector('circle'); assert(ponto);
    ponto.replaceWith(`<polyline class="serie-do-pais-linha" data-serie-linha="${id}" points="195,91"></polyline>`);
    assert(conferirSerie(svg,'pt',()=>s).some(e=>/coordenadas/.test(e)));
    // A forma antiga, sem área visível, é o conhecido-positivo da exigência.
    const visiveis = segmentos => segmentos.filter(s=>s.tipo==='ponto' ? Number(s.r)>0 : s.pontos.includes(' ')).length;
    assert.equal(visiveis(segmentos),3);
    assert.equal(visiveis(g.linhas[0].segmentos.map(pontos=>({tipo:'linha',pontos}))),2);
  });
  prova('a marca do último ano ancora-se no primeiro período desse ano, como as intermédias (RP4-m)', () => {
    for (const sid of ['serie-ipc-indice', 'serie-remuneracao-bruta-mensal-media']) {
      const s = getSerie(sid);
      const g = serieDoPais([sid]);
      assert.deepEqual(marcaDoUltimoAno(g, s), [], sid);
      // O CONHECIDO-POSITIVO: a forma antiga, no último ponto e encostada à direita, é recusada pela mesma leitura.
      const fim = g.linhas[0].segmentos.join(' ').split(' ').at(-1).split(',')[0];
      const antiga = { ...g, marcasX: [...g.marcasX.slice(0, -1), { ...g.marcasX.at(-1), x: fim, ancora: 'end' }] };
      assert(marcaDoUltimoAno(antiga, s).length >= 1, `${sid}: a forma antiga não foi recusada`);
    }
    // No recibo da remuneração, «2026» fica no primeiro trimestre (x=283.2, como a leitura mediu), e não no segundo.
    const r = serieDoPais(['serie-remuneracao-bruta-mensal-media']);
    assert.equal(r.marcasX.at(-1).x, '283.2');
  });
  prova('o símbolo da unidade nas marcas, nas duas formas (RP4-c)', () => {
    const pct = 'serie-ipc-variacao-homologa';
    assert.deepEqual(serieDoPais([pct]).marcasY.map((m) => m.texto), ['−5\u00a0%', '0', '5\u00a0%', '10\u00a0%', '15\u00a0%']);
    for (const s of allSeries().filter((x) => x.eixo === 'periodo')) {
      for (const [l, h] of [[360, 200], [240, 160]]) assert.deepEqual(simboloNasMarcas(serieDoPais([s.id], 'unidade', l, h), String(s.unit)), [], `${s.id} ${l}`);
    }
    // A PLANTA DO MANDATO: uma marca sem o símbolo numa série em «%».
    const g = serieDoPais([pct]);
    const sem = { ...g, marcasY: g.marcasY.map((m, i) => (i === g.marcasY.length - 1 ? { ...m, texto: m.texto.replace('\u00a0%', '') } : m)) };
    assert(simboloNasMarcas(sem, '%').some((q) => /não acaba no símbolo/.test(q)));
    // O euro com o símbolo é recusado pela mesma leitura (a paragem do ponto 1: a §1.127, decisão 4, e a F5).
    const ge = serieDoPais(['serie-linha-de-risco-de-pobreza']);
    const comEuro = { ...ge, marcasY: ge.marcasY.map((m) => ({ ...m, texto: m.valor ? `${m.texto}\u00a0€` : m.texto })) };
    assert(simboloNasMarcas(comEuro, '€ por ano').some((q) => /escreve um símbolo/.test(q)));
    // E um desenho sem símbolo e sem a legenda da unidade.
    assert(simboloNasMarcas({ ...ge, legenda: false }, '€ por ano').some((q) => /não diz a unidade por extenso/.test(q)));
  });
  prova('as décadas da inflação a 360 e a 240 de largura (RP4-c)', () => {
    const s = getSerie('serie-ipc-variacao-homologa');
    const larga = serieDoPais([s.id], 'unidade', 360, 200);
    const estreita = serieDoPais([s.id], 'unidade', 240, 160);
    assert.deepEqual(larga.marcasX.map((m) => m.texto), ['1992', '2000', '2010', '2020', '2026']);
    assert.deepEqual(estreita.marcasX.map((m) => m.texto), ['1992', '2010', '2026']);
    assert.deepEqual(decadasDoEixo(larga, s), []);
    assert.deepEqual(decadasDoEixo(estreita, s), []);
    // A PLANTA DO MANDATO: uma década fora do sítio (a de 2010 no janeiro de 2009).
    const i2009 = s.pontos.findIndex((p) => p.periodo === '2009-01');
    const x2009 = larga.linhas[0].segmentos.join(' ').split(' ')[i2009].split(',')[0];
    assert(decadasDoEixo({ ...larga, marcasX: larga.marcasX.map((m) => (m.texto === '2010' ? { ...m, x: x2009 } : m)) }, s).some((q) => /a década 2010 está em/.test(q)));
    // E uma década que cabe e não está marcada.
    assert(decadasDoEixo({ ...larga, marcasX: larga.marcasX.filter((m) => m.texto !== '2020') }, s).some((q) => /a década 2020 cabe e não está marcada/.test(q)));
    // Todas as séries da casa que cobrem vinte anos ou mais, nas duas larguras dos desenhos.
    for (const x of allSeries().filter((y) => y.eixo === 'periodo')) {
      if (Number(String(x.ultimo_periodo).slice(0, 4)) - Number(String(x.primeiro_periodo).slice(0, 4)) + 1 < ANOS_PARA_AS_DECADAS) continue;
      for (const [l, h] of [[360, 200], [240, 160]]) assert.deepEqual(decadasDoEixo(serieDoPais([x.id], 'unidade', l, h), x), [], `${x.id} ${l}`);
    }
  });
  prova('as zonas da leitura por colunas, só onde a leitura vive (RP4-c-b)', () => {
    for (const x of allSeries().filter((y) => y.eixo === 'periodo')) {
      assert.deepEqual(zonasDaLeitura(serieDoPais([x.id], 'unidade', 360, 200, getSerie, { leitura: true })), [], x.id);
      // Um cartão (240), sem a leitura, não tem zonas.
      assert.equal(serieDoPais([x.id], 'unidade', 240, 160).leituras.length, 0, `${x.id} 240`);
    }
    assert.equal(serieDoPais(['serie-salario-minimo-mensal', 'serie-ipc-indice'], 'indice', 360, 200, getSerie, { leitura: true }).leituras.length, 0);
    const g = serieDoPais(['serie-ipc-variacao-homologa'], 'unidade', 360, 200, getSerie, { leitura: true });
    // As colunas contam-se na menor largura no ecrã: cada zona tem pelo menos um píxel também aí.
    assert.equal(g.colunas, Math.floor(294 * MENOR_LARGURA_NO_ECRA / 360));
    assert(g.leituras.every((l) => Number(l.zona.largura) * MENOR_LARGURA_NO_ECRA / 360 >= 1 - 1e-6));
    // Uma série curta junta as colunas de cada ponto numa zona: uma zona por ponto.
    const pensao = getSerie('serie-pensao-media-anual');
    assert.equal(serieDoPais([pensao.id], 'unidade', 360, 200, getSerie, { leitura: true }).leituras.length, pensao.pontos.length);
    // AS PLANTAS: uma zona mais larga do que as suas colunas; uma zona com a leitura de outro ponto; uma zona partida em
    // duas que leem o mesmo ponto; e zonas num desenho que não as leva.
    const larga = { ...g, leituras: g.leituras.map((l, i) => (i === 10 ? { ...l, zona: { ...l.zona, largura: String(Number(l.zona.largura) + 0.5) } } : l)) };
    assert(zonasDaLeitura(larga).some((q) => /a zona 11 não está sobre colunas inteiras|a zona 12 começa em/.test(q)));
    const outra = { ...g, leituras: g.leituras.map((l, i) => (i === 10 ? { ...l, mira: { ...g.leituras[11].mira }, marca: { ...g.leituras[11].marca } } : l)) };
    assert(zonasDaLeitura(outra).some((q) => /da zona 11 lê um ponto que não é o mais próximo dela/.test(q)));
    const s = serieDoPais([pensao.id], 'unidade', 360, 200, getSerie, { leitura: true });
    const z = s.leituras[0]; const meioDaZona = String(Number(z.zona.x) + Math.round(Number(z.zona.largura) / 2 / (294 / s.colunas)) * (294 / s.colunas));
    const partida = { ...s, leituras: [{ ...z, zona: { ...z.zona, largura: String(Number(meioDaZona) - Number(z.zona.x)) } }, { ...z, zona: { ...z.zona, x: meioDaZona, largura: String(Number(z.zona.x) + Number(z.zona.largura) - Number(meioDaZona)) } }, ...s.leituras.slice(1)] };
    assert(zonasDaLeitura(partida).some((q) => /as zonas 1 e 2, vizinhas, leem o mesmo ponto/.test(q)));
    assert(zonasDaLeitura(g, false).some((q) => /não as leva/.test(q)));
  });
  prova('anos ingleses e artigos dos títulos', () => {
    for (const [ano,texto] of [[1900,'nineteen hundred'],[1901,'nineteen oh one'],[1948,'nineteen forty-eight'],[1992,'nineteen ninety-two'],[2000,'two thousand'],[2001,'two thousand and one'],[2009,'two thousand and nine'],[2010,'twenty ten'],[2026,'twenty twenty-six']]) assert.equal(anoEmPalavras(ano,'en'),texto);
    assert.throws(()=>anoEmPalavras(99,'en'),/ano fora/);
    const linhas=[{id:'serie-remuneracao-bruta-mensal-media',primeiro:'2025-T1',ultimo:'2025-T2'}];
    assert(tituloDaSerie(linhas,'pt').endsWith('do primeiro trimestre de dois mil e vinte e cinco ao segundo trimestre de dois mil e vinte e cinco'));
    const meses=[{id:'serie-ipc-variacao-homologa',primeiro:'1992-01',ultimo:'2026-08'}];
    assert(tituloDaSerie(meses,'pt',true).startsWith('de janeiro de mil novecentos e noventa e dois a agosto de dois mil e vinte e seis'));
    assert.equal(tituloDaSerie(meses,'en',true),'from January nineteen ninety-two to August twenty twenty-six, % change over twelve months');
  });
  return provas;
}
