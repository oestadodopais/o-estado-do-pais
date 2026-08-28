// medicoes/m6-cabecalho-com-a-marca.mjs — medição 6.
//
// NOTA DE MÉTODO (fica escrita aqui porque o programa é parte do relatório):
// a primeira versão desta medição comparava o topo da CAIXA DO SVG
// (`getBoundingClientRect`, que a folha já corta à tinta, por `viewBox`) com
// o topo da CAIXA DE TEXTO do nome, lida com um `Range` do DOM
// (`range.getBoundingClientRect()`). Isso deu diferenças de 9 a 27 px em
// TODAS as larguras e rotas — um alarme demasiado uniforme para ser a marca
// fora do sítio, e que cresce com o tamanho da letra. A causa: a caixa de um
// `Range` de texto é a caixa de LINHA da fonte (ascensor a descensor, pela
// métrica do ficheiro), não a caixa de TINTA do glifo — mesmo selecionando só
// o "O", a caixa devolvida continua a ser a caixa de linha inteira. Por isso
// esta medição lê os píxeis a sério: tira um recorte da página (`clip`,
// `deviceScaleFactor:1`), descodifica-o com o mesmo leitor de PNG das outras
// medições, e procura a primeira linha de píxeis que difere do papel dentro
// da coluna do «e» e dentro da coluna do "O". A diferença entre essas duas
// linhas é a que o BRIEF pede («o mesmo topo ± 2 px»), e é isso que decide a
// conformidade; a leitura por `Range` fica no relatório só como nota do falso
// alarme.
import { chromium } from 'playwright';
import { servirEstatico } from './lib/servidor.mjs';
import { lerTokens } from './lib/tokens.mjs';
import { decodificarPNG } from './lib/png.mjs';

const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const ROTAS = ['/', '/municipios/evora', '/estudos', '/en'];
const LIMIAR_TINTA = 30; // por canal, em 0..255; separa antialiasing residual de tinta a sério

function hexParaRgb(hex) {
  const m = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(hex);
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

async function primeiraLinhaDeTinta(page, xEsq, xDir, yTopo, yFundo, corFundoRgb) {
  const clip = {
    x: Math.max(0, Math.floor(xEsq) - 2),
    y: Math.max(0, Math.floor(yTopo)),
    width: Math.max(1, Math.ceil(xDir - xEsq) + 4),
    height: Math.max(1, Math.ceil(yFundo - yTopo)),
  };
  const buf = await page.screenshot({ clip });
  const img = decodificarPNG(buf);
  const [cr, cg, cb] = corFundoRgb;
  for (let y = 0; y < img.altura; y++) {
    for (let x = 0; x < img.largura; x++) {
      const i = (y * img.largura + x) * 4;
      if (Math.abs(img.rgba[i] - cr) > LIMIAR_TINTA || Math.abs(img.rgba[i + 1] - cg) > LIMIAR_TINTA || Math.abs(img.rgba[i + 2] - cb) > LIMIAR_TINTA) {
        return clip.y + y;
      }
    }
  }
  return null;
}

async function lerCaixasDom(page) {
  return page.evaluate(() => {
    const header = document.querySelector('header');
    const wordmark = document.querySelector('header .wordmark, .wordmark');
    if (!header || !wordmark) return null;
    const headerRect = header.getBoundingClientRect();
    const wordmarkRect = wordmark.getBoundingClientRect();
    const svg = wordmark.querySelector('svg.wordmark-e');
    let svgRect = null;
    let rangeRect = null; // a caixa de LINHA da fonte, lida por Range (guardada só para o registo do falso alarme)
    let corWordmark = null;
    if (svg) {
      const sr = svg.getBoundingClientRect();
      svgRect = { top: sr.top, bottom: sr.bottom, left: sr.left, right: sr.right, width: sr.width, height: sr.height };
      let textoNode = null;
      for (const n of wordmark.childNodes) if (n.nodeType === 3 && n.textContent.trim()) textoNode = n;
      const a = wordmark.querySelector('a');
      if (!textoNode && a) for (const n of a.childNodes) if (n.nodeType === 3 && n.textContent.trim()) textoNode = n;
      if (textoNode) {
        const rangeTudo = document.createRange();
        rangeTudo.selectNode(textoNode);
        const rt = rangeTudo.getBoundingClientRect();
        rangeRect = { top: rt.top, bottom: rt.bottom };
        const rangeUmaLetra = document.createRange();
        rangeUmaLetra.setStart(textoNode, 0);
        rangeUmaLetra.setEnd(textoNode, 1);
        const ru = rangeUmaLetra.getBoundingClientRect();
        rangeRect.primeiraLetra = { top: ru.top, bottom: ru.bottom, left: ru.left, right: ru.right };
      }
      corWordmark = getComputedStyle(wordmark).color;
    }
    return {
      headerHeight: headerRect.height,
      wordmarkHeight: wordmarkRect.height,
      wordmarkTop: wordmarkRect.top,
      svgPresente: !!svg,
      svgRect,
      rangeRect,
      corWordmark,
    };
  });
}

async function medirAlinhamentoDeTinta(page, caixas, corFundoRgb) {
  if (!caixas?.svgPresente || !caixas.rangeRect?.primeiraLetra) return null;
  const { svgRect } = caixas;
  const letra = caixas.rangeRect.primeiraLetra;
  const yTopoSvg = await primeiraLinhaDeTinta(page, svgRect.left, svgRect.right, svgRect.top - 6, svgRect.bottom + 2, corFundoRgb);
  const yTopoBusca = Math.min(svgRect.top, caixas.wordmarkTop) - 6;
  const yTopoLetra = await primeiraLinhaDeTinta(page, letra.left, letra.right, yTopoBusca, letra.bottom, corFundoRgb);
  if (yTopoSvg === null || yTopoLetra === null) return { yTopoSvg, yTopoLetra, diffPx: null };
  return { yTopoSvg, yTopoLetra, diffPx: yTopoSvg - yTopoLetra };
}

async function medirNumaPagina(navegador, base, rota, largura, corFundoRgb) {
  const context = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(base + rota, { waitUntil: 'load' });
  const caixas = await lerCaixasDom(page);
  const alinhamento = await medirAlinhamentoDeTinta(page, caixas, corFundoRgb);
  await context.close();
  return { caixas, alinhamento };
}

async function medirTemaEscuro(navegador, base, rota) {
  const context = await navegador.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(base + rota, { waitUntil: 'load' });
  await page.locator('.masthead-furniture [data-tema-controlo] button[data-tema="dark"]').click();
  await page.waitForTimeout(80);
  const caixas = await lerCaixasDom(page);
  await context.close();
  return caixas;
}

export async function medir({ distRootDepois, distRootAntes, tokensCssPath }) {
  const tokens = lerTokens(tokensCssPath);
  const corFundoClaroRgb = hexParaRgb(tokens.claro.paper);
  const servidorDepois = await servirEstatico(distRootDepois);
  const servidorAntes = distRootAntes ? await servirEstatico(distRootAntes) : null;
  const navegador = await chromium.launch();

  const matriz = [];
  for (const rota of ROTAS) {
    for (const largura of LARGURAS) {
      const { caixas: depois, alinhamento } = await medirNumaPagina(navegador, servidorDepois.base, rota, largura, corFundoClaroRgb);
      const antesResultado = servidorAntes ? await medirNumaPagina(navegador, servidorAntes.base, rota, largura, corFundoClaroRgb) : null;
      const antes = antesResultado?.caixas ?? null;
      matriz.push({
        rota,
        largura,
        alturaHeaderAntes: antes?.headerHeight ?? null,
        alturaHeaderDepois: depois?.headerHeight ?? null,
        diffAlturaHeaderPx: antes && depois ? Number((depois.headerHeight - antes.headerHeight).toFixed(2)) : null,
        alturaWordmarkAntes: antes?.wordmarkHeight ?? null,
        alturaWordmarkDepois: depois?.wordmarkHeight ?? null,
        diffAlturaWordmarkPx: antes && depois ? Number((depois.wordmarkHeight - antes.wordmarkHeight).toFixed(2)) : null,
        svgPresenteDepois: depois?.svgPresente ?? false,
        alinhamentoPorRangeTopoPx:
          depois?.svgRect && depois?.rangeRect ? Number((depois.svgRect.top - depois.rangeRect.top).toFixed(2)) : null,
        alinhamentoPorTintaPx: alinhamento?.diffPx ?? null,
        alinhamentoConforme: alinhamento?.diffPx !== null && alinhamento?.diffPx !== undefined ? Math.abs(alinhamento.diffPx) <= 2 : null,
      });
    }
  }

  // ---- tema escuro: o «e» claro, uma largura de mobília por rota --------
  const corEscuroEsperadaHex = tokens.escuro.ink;
  const corEscuroEsperadaRgb = `rgb(${hexParaRgb(corEscuroEsperadaHex).join(', ')})`;
  const temaEscuro = [];
  for (const rota of ROTAS) {
    const d = await medirTemaEscuro(navegador, servidorDepois.base, rota);
    temaEscuro.push({ rota, corResolvida: d?.corWordmark ?? null, corEsperada: corEscuroEsperadaRgb, conforme: d?.corWordmark === corEscuroEsperadaRgb });
  }

  // ---- casos vermelhos plantados -----------------------------------------
  // (a) alinhamento: a MESMA página real de '/', com o «e» empurrado 15px por
  // uma folha injetada, medido pelo MESMO detetor de tinta que mede o real.
  const contextMutado = await navegador.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const pageMutado = await contextMutado.newPage();
  await pageMutado.goto(servidorDepois.base + '/', { waitUntil: 'load' });
  await pageMutado.addStyleTag({ content: '.wordmark-e{ position:relative; top:15px; }' });
  const caixasMutadas = await lerCaixasDom(pageMutado);
  const alinhamentoMutado = await medirAlinhamentoDeTinta(pageMutado, caixasMutadas, corFundoClaroRgb);
  await contextMutado.close();

  // (b) diferença de altura de cabeçalho: duas fixtures isoladas, 80 vs 95px
  const contextFixture = await navegador.newContext();
  const pageFixture = await contextFixture.newPage();
  await pageFixture.setContent(`<!doctype html><html><body><header style="height:80px;margin:0"><p class="wordmark">x</p></header></body></html>`);
  const alturaFixtureA = await pageFixture.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
  await pageFixture.setContent(`<!doctype html><html><body><header style="height:95px;margin:0"><p class="wordmark">x</p></header></body></html>`);
  const alturaFixtureB = await pageFixture.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
  await contextFixture.close();

  // (c) cor errada em escuro: a mesma página real, mas com a cor do wordmark presa
  const contextCor = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
  const pageCor = await contextCor.newPage();
  await pageCor.goto(servidorDepois.base + '/', { waitUntil: 'load' });
  await pageCor.addStyleTag({ content: ':root[data-theme="dark"] .wordmark, .wordmark { color:#111111 !important; }' });
  await pageCor.locator('.masthead-furniture [data-tema-controlo] button[data-tema="dark"]').click();
  await pageCor.waitForTimeout(80);
  const corPresaEmEscuro = await pageCor.evaluate(() => getComputedStyle(document.querySelector('header .wordmark')).color);
  await contextCor.close();

  await navegador.close();
  await servidorDepois.fechar();
  if (servidorAntes) await servidorAntes.fechar();

  return {
    medicao: 6,
    larguras: LARGURAS,
    rotas: ROTAS,
    limiarDeTintaPorCanal: LIMIAR_TINTA,
    matriz,
    temaEscuro,
    casoConhecido: {
      descricao:
        'a mesma página real de "/", com uma folha de estilo injetada que empurra .wordmark-e 15px para baixo, medida pelo mesmo detetor de tinta por píxel usado no real; duas fixtures isoladas com a altura do cabeçalho forçada a 80px e a 95px; e a mesma página real com a cor do .wordmark presa a #111111 mesmo depois de se escolher o tema escuro.',
      alinhamentoMutadoPx: alinhamentoMutado?.diffPx ?? null,
      viuVermelhoNoAlinhamento: alinhamentoMutado?.diffPx !== null && Math.abs(alinhamentoMutado.diffPx) > 2,
      alturaFixtureA,
      alturaFixtureB,
      diffFixturesPx: Number((alturaFixtureB - alturaFixtureA).toFixed(2)),
      viuVermelhoNaDiferencaDeAltura: Math.abs(alturaFixtureB - alturaFixtureA - 15) < 0.5,
      corPresaEmEscuro,
      corEscuroEsperadaRgb,
      viuVermelhoNaCorEscura: corPresaEmEscuro !== corEscuroEsperadaRgb,
    },
  };
}
