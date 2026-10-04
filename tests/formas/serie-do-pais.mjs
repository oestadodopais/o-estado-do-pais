/** RP4: F21 recompõe o desenho do livro, sobre cadeias em memória. */
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { serieDoPais, BASE_DO_INDICE, tabelaPorAnos } from '../../src/lib/formas/serie-do-pais.mjs';
import { tituloDaSerie, periodoEmPalavras } from '../../src/lib/formas/palavras-da-serie.mjs';
import { getSerie, allSeries } from '../../src/lib/series.mjs';

/** As marcas incluem texto, posição, âncora e traço, carácter a carácter. */
export function conferirSerie(svg, lang) {
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
    g = serieDoPais(ids, modo, Number(v[2]), Number(v[3]));
  } catch (e) { falha(`não recompõe: ${e.message}`); return erros; }
  const esperado = g.linhas.flatMap((l) => l.segmentos.map((points) => [l.id, points]));
  const vistos = svg.querySelectorAll('polyline').map((p) => [p.getAttribute('data-serie-linha'), p.getAttribute('points')]);
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
  const titulos = svg.querySelectorAll('title');
  if (titulos.length !== 1 || titulos[0].textContent !== tituloDaSerie(g.linhas, lang) || /\d/.test(titulos[0]?.textContent ?? '')) falha('título não é o nome e os períodos por extenso');
  const permitidos = {
    svg: ['class', 'data-forma', 'data-series', 'data-modo', 'viewBox', 'role'],
    title: [], g: ['data-eixo'],
    line: ['class', 'x1', 'x2', 'y1', 'y2'],
    text: ['data-nonledger', 'x', 'y', 'text-anchor', 'dominant-baseline'],
    polyline: ['class', 'data-serie-linha', 'points'],
  };
  for (const el of [svg, ...svg.querySelectorAll('*')]) {
    const attrs = permitidos[el.rawTagName];
    if (!attrs || Object.keys(el.attributes).some((a) => !attrs.includes(a))) falha('elemento ou atributo que altera a forma estática');
  }
  if (svg.getAttribute('class') !== 'serie-do-pais') falha('classe do desenho alterada');
  for (const p of svg.querySelectorAll('polyline')) if (p.getAttribute('class') !== 'serie-do-pais-linha') falha('classe do traço alterada');
  for (const no of svg.querySelectorAll('[data-eixo]')) {
    const t = no.querySelector('text'); const l = no.querySelector('line');
    const valor = no.getAttribute('data-eixo') === 'valor';
    if (t?.getAttribute('dominant-baseline') !== (valor ? 'middle' : undefined)) falha('alinhamento da marca alterado');
    const zero = valor && t?.textContent === '0';
    if (l?.getAttribute('class') !== (zero ? 'serie-do-pais-guia serie-do-pais-zero' : 'serie-do-pais-guia')) falha('classe da escala alterada');
  }
  const marcas = g.marcasX.length + g.marcasY.length;
  if (svg.querySelectorAll('line').length !== marcas || svg.querySelectorAll('text').length !== marcas || svg.querySelectorAll('g').length !== marcas) falha('geometria ou texto acrescentado fora da escala');
  return erros;
}

/** Cada planta corre o mesmo detetor, com o controlo íntegro a passar primeiro. */
export function plantasDaSerie(html, lang) {
  const limpo = parse(html).querySelector('svg[data-forma="serie-do-pais"]');
  if (!limpo) return [{ nome: 'controlo', mordeu: false, queixa: 'nenhum desenho no controlo' }];
  const controlo = conferirSerie(limpo, lang);
  const casos = [
    ['ponto deslocado', /coordenadas/, (s) => { const p = s.querySelector('polyline'); p.setAttribute('points', p.getAttribute('points').replace(/^[\d.-]+/, (n) => String(Number(n) + 1))); }],
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
  prova('linha sem o período de base recusada com razão', () => {
    const s = structuredClone(getSerie(id)); s.pontos = s.pontos.filter((p) => p.periodo !== '2015-01');
    assert.throws(() => serieDoPais([id], 'indice', 360, 200, () => s), /base.*2015-01/);
  });
  prova('base nula recusada', () => {
    const s = structuredClone(getSerie(id)); s.pontos.find((p) => p.periodo === '2015-01').valor = '0';
    assert.throws(() => serieDoPais([id], 'indice', 360, 200, () => s), /base não nulo/);
  });
  prova('períodos por extenso nas duas edições', () => {
    assert.equal(periodoEmPalavras('2015-01', 'pt'), 'janeiro de dois mil e quinze');
    assert.equal(periodoEmPalavras('2015-S1', 'en'), 'first half of two thousand and fifteen');
    assert.equal(periodoEmPalavras('1948', 'pt'), 'mil novecentos e quarenta e oito');
  });
  return provas;
}
