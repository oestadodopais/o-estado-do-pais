/** RP4: F21 recompõe o desenho do livro, sobre cadeias em memória. */
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { serieDoPais, BASE_DO_INDICE, tabelaPorAnos, segmentoVisivel } from '../../src/lib/formas/serie-do-pais.mjs';
import { tituloDaSerie, periodoEmPalavras, anoEmPalavras, legendasDasExclusoes } from '../../src/lib/formas/palavras-da-serie.mjs';
import { getSerie, allSeries } from '../../src/lib/series.mjs';
import { FIGURAS_INDEXADAS } from '../../src/data/series-no-tempo.mjs';

/** As marcas incluem texto, posição, âncora e traço, carácter a carácter. */
export function conferirSerie(svg, lang, lerSerie = getSerie) {
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
    g = serieDoPais(ids, modo, Number(v[2]), Number(v[3]), lerSerie);
  } catch (e) { falha(`não recompõe: ${e.message}`); return erros; }
  const esperado = g.linhas.flatMap(l => l.segmentos.map(points => points.includes(' ') ? [l.id, 'polyline', points] : [l.id, 'circle', ...points.split(','), '2']));
  const vistos = svg.querySelectorAll('polyline, circle').map(p => p.rawTagName === 'polyline' ? [p.getAttribute('data-serie-linha'), 'polyline', p.getAttribute('points')] : [p.getAttribute('data-serie-linha'), 'circle', ...['cx','cy','r'].map(a=>p.getAttribute(a))]);
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
  const legenda = svg.nextElementSibling;
  const lidas = legenda?.getAttribute('data-serie-exclusoes') === svg.getAttribute('data-series') ? legenda.querySelectorAll('[data-serie-excluida]').map(l => ({id:l.getAttribute('data-serie-excluida'),texto:l.textContent.trim()})) : [];
  if (JSON.stringify(lidas) !== JSON.stringify(excluidas)) falha('legenda das linhas excluídas não é a declarada');
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
  };
  for (const el of [svg, ...svg.querySelectorAll('*')]) {
    const attrs = permitidos[el.rawTagName];
    if (!attrs || Object.keys(el.attributes).some((a) => !attrs.includes(a))) falha('elemento ou atributo que altera a forma estática');
  }
  if (svg.getAttribute('class') !== 'serie-do-pais') falha('classe do desenho alterada');
  for (const p of svg.querySelectorAll('polyline, circle')) if (p.getAttribute('class') !== 'serie-do-pais-linha') falha('classe do traço alterada');
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
function desenhoDeEnsaio(ids, g, lang) {
  const marcas = (eixo, ms) => ms.map(m => `<g data-eixo="${eixo}"><line class="serie-do-pais-guia${eixo==='valor' && m.valor===0?' serie-do-pais-zero':''}" x1="${eixo==='valor'?g.campo.esquerda:m.x}" x2="${eixo==='valor'?g.campo.direita:m.x}" y1="${eixo==='valor'?m.y:g.campo.fundo}" y2="${eixo==='valor'?m.y:g.campo.fundo+4}"></line><text data-nonledger="escala-de-instrumento" x="${m.x}" y="${m.y}" text-anchor="${eixo==='valor'?'end':m.ancora}"${eixo==='valor'?' dominant-baseline="middle"':''}>${m.texto}</text></g>`).join('');
  const segmentos = g.linhas.flatMap(l=>l.segmentos.map(p=>{
    const forma=segmentoVisivel(p);
    return forma.tipo==='ponto'?`<circle class="serie-do-pais-linha" data-serie-linha="${l.id}" cx="${forma.cx}" cy="${forma.cy}" r="${forma.r}"></circle>`:`<polyline class="serie-do-pais-linha" data-serie-linha="${l.id}" points="${p}"></polyline>`;
  })).join('');
  const legendas=legendasDasExclusoes(g.excluidas,lang);
  const legenda=legendas.length?`<ul data-serie-exclusoes="${ids.join(',')}">${legendas.map(l=>`<li data-serie-excluida="${l.id}">${l.texto}</li>`).join('')}</ul>`:'';
  return parse(`<svg class="serie-do-pais" style="max-width: ${g.largura}px;" data-titulo="nome-periodo" data-forma="serie-do-pais" data-series="${ids.join(',')}" data-modo="${g.modo}" viewBox="0 0 ${g.largura} ${g.altura}" role="img"><title>${tituloDaSerie(g.linhas,lang)}</title>${marcas('valor',g.marcasY)}${marcas('tempo',g.marcasX)}${segmentos}</svg>${legenda}`).querySelector('svg');
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
    const g = serieDoPais([id],'unidade',360,200,()=>s);
    const segmentos = g.linhas[0].segmentos.map(segmentoVisivel);
    assert.deepEqual(segmentos.map(s=>s.tipo),['linha','ponto','linha']);
    assert.deepEqual(segmentos[1],{tipo:'ponto',cx:'195',cy:'91',r:'2'});
    const svg=desenhoDeEnsaio([id],g,'pt'); assert.deepEqual(conferirSerie(svg,'pt',()=>s),[]);
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
