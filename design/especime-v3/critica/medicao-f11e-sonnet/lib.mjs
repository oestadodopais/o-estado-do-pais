// Biblioteca partilhada da medição cega do F1.1e (Sonnet, código próprio).
import { chromium } from 'playwright';

export const BASE = 'http://127.0.0.1:4390';

export async function abrePagina(opts = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: opts.viewport ?? { width: 1280, height: 900 },
    hasTouch: opts.hasTouch ?? false,
    isMobile: opts.isMobile ?? false,
    javaScriptEnabled: opts.javaScriptEnabled ?? true,
    locale: opts.locale ?? 'pt-PT',
  });
  const page = await context.newPage();
  return { browser, context, page };
}

/** Espera pelas fontes e por 'networkidle', devolve o estado de document.fonts. */
export async function assentar(page) {
  await page.waitForLoadState('networkidle');
  const fontes = await page.evaluate(async () => {
    try {
      await document.fonts.ready;
    } catch (e) {
      /* ignora */
    }
    return { status: document.fonts.status, size: document.fonts.size };
  });
  return fontes;
}

/**
 * A função injectada no navegador: para cada alvo (um selector de <path> e o
 * ponto representativo em unidades locais do SVG), calcula o lado do maior
 * quadrado alinhado a uma grelha de 2px, testado em 9 posições-âncora
 * (cantos, meios dos lados, centro) relativas ao ponto, que cabe inteiro
 * dentro do preenchimento do caminho (SVGGeometryElement#isPointInFill) e
 * contém o ponto. O perímetro de cada quadrado candidato é amostrado a uma
 * resolução que cresce com o lado (até um tecto), e não a pixel exacto: é uma
 * aproximação, documentada no relatório.
 */
export function medirAlvosNoNavegador(alvos) {
  function squareFits(path, inv, cx, cy, S, anchor) {
    let x0, y0;
    if (anchor === 'tl') { x0 = cx; y0 = cy; }
    else if (anchor === 'tr') { x0 = cx - S; y0 = cy; }
    else if (anchor === 'bl') { x0 = cx; y0 = cy - S; }
    else if (anchor === 'br') { x0 = cx - S; y0 = cy - S; }
    else if (anchor === 'tc') { x0 = cx - S / 2; y0 = cy; }
    else if (anchor === 'bc') { x0 = cx - S / 2; y0 = cy - S; }
    else if (anchor === 'lc') { x0 = cx; y0 = cy - S / 2; }
    else if (anchor === 'rc') { x0 = cx - S; y0 = cy - S / 2; }
    else { x0 = cx - S / 2; y0 = cy - S / 2; } // cc
    const nSamples = Math.max(3, Math.min(10, Math.ceil(S / 8)));
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < nSamples; i++) {
        const t = i / (nSamples - 1);
        let sx, sy;
        if (side === 0) { sx = x0 + t * S; sy = y0; }
        else if (side === 1) { sx = x0 + S; sy = y0 + t * S; }
        else if (side === 2) { sx = x0 + (1 - t) * S; sy = y0 + S; }
        else { sx = x0; sy = y0 + (1 - t) * S; }
        const local = new DOMPoint(sx, sy).matrixTransform(inv);
        if (!path.isPointInFill(local)) return false;
      }
    }
    return true;
  }

  function maiorQuadrado(path, inv, cx, cy, sMaxScreen) {
    const anchors = ['tl', 'tr', 'bl', 'br', 'tc', 'bc', 'lc', 'rc', 'cc'];
    const kMax = Math.floor(sMaxScreen / 2);
    let lo = 0, hi = kMax;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const S = mid * 2;
      let feasible = false;
      for (const a of anchors) {
        if (squareFits(path, inv, cx, cy, S, a)) { feasible = true; break; }
      }
      if (feasible) lo = mid; else hi = mid - 1;
    }
    return lo * 2;
  }

  return alvos.map(({ chave, selector, x, y }) => {
    const path = document.querySelector(selector);
    if (!path) return { chave, erro: 'seletor nao encontrado: ' + selector };
    const bbox = path.getBoundingClientRect();
    const ctm = path.getScreenCTM();
    if (!ctm) return { chave, erro: 'sem CTM (nao visivel?)' };
    const inv = ctm.inverse();
    const screenPt = new DOMPoint(x, y).matrixTransform(ctm);
    const sMax = Math.min(bbox.width, bbox.height);
    const lado = maiorQuadrado(path, inv, screenPt.x, screenPt.y, sMax);
    return {
      chave,
      lado,
      bboxW: bbox.width,
      bboxH: bbox.height,
      screenX: screenPt.x,
      screenY: screenPt.y,
    };
  });
}

/**
 * Só a transformação do ponto representativo para coordenadas de ecrã (px,
 * relativas ao viewport), sem o cálculo do quadrado — mais rápida, para o
 * rato, o teclado e o toque, que só precisam de um ponto para apontar.
 */
export function pontosEmEcraNoNavegador(alvos) {
  return alvos.map(({ chave, selector, x, y }) => {
    const path = document.querySelector(selector);
    if (!path) return { chave, erro: 'seletor nao encontrado: ' + selector };
    const ctm = path.getScreenCTM();
    if (!ctm) return { chave, erro: 'sem CTM (nao visivel?)' };
    const screenPt = new DOMPoint(x, y).matrixTransform(ctm);
    return { chave, screenX: screenPt.x, screenY: screenPt.y };
  });
}

export function mediana(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const n = s.length;
  if (n === 0) return null;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}
