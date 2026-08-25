#!/usr/bin/env node
// Medição cega M3 — código próprio, do zero. Não importa nada de src/ nem scripts/ do sítio.
// Mede «antes» (site no ar) e «depois» (dist/ do ramo, servido localmente) com Playwright.
//
// Uso:
//   node correcoes-ux-M3-sonnet.mjs sweep        -> corre a medição geral (itens 1,3,4,5,6) em todas as rotas/larguras/builds
//   node correcoes-ux-M3-sonnet.mjs known-cases  -> corre só a prova dos detetores nos casos conhecidos (antes)
//   node correcoes-ux-M3-sonnet.mjs specific      -> corre os itens 7-13 (fluxos específicos por rota)
//   node correcoes-ux-M3-sonnet.mjs all           -> tudo, por esta ordem
//
// Os resultados são guardados em JSON no scratchpad (cache de trabalho); o relatório final
// em Markdown é escrito por gerar-relatorio.mjs a partir desse cache.

import { chromium, webkit, devices } from 'playwright';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const SCRATCH = '/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/m3';
if (!existsSync(SCRATCH)) mkdirSync(SCRATCH, { recursive: true });

const BUILDS = {
  antes: 'https://xn--oestadodopas-2fb.pt',
  depois: 'http://localhost:4310',
};

const ROUTES = [
  '/',
  '/municipios',
  '/municipios/evora',
  '/estudos',
  '/estudos/evora-prometido-pago-auditado-2026',
  '/estudos/evora-prometido-pago-auditado-2026/texto',
  '/livro-razao',
  '/livro-razao/divida-publica-2025',
  '/agenda',
  '/metodo',
  '/correcoes',
  '/en',
  '/estudos/evora-quinze-anos-cinco-mandatos/texto',
];

const IPHONE13 = devices['iPhone 13'];
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const BAND_HEIGHT_CAP = 50000; // px — acima disto o detetor de bandas não é válido (brief §1.5)
const OVERLAP_MIN_AREA = 0.5; // px² — abaixo disto ignora-se como ruído de arredondamento
const TOUCH_MIN = 44;
const TEXT_MIN = 12;
const BAND_MIN = 48;

// ---------------------------------------------------------------------------
// Funções injetadas na página (correm no contexto do browser via page.evaluate)
// ---------------------------------------------------------------------------

async function inPage_measureCore(page) {
  return page.evaluate(() => {
    const body = document.body;
    const scrollHeight = Math.max(
      body.scrollHeight, document.documentElement.scrollHeight,
      body.offsetHeight, document.documentElement.offsetHeight
    );
    const h1 = document.querySelector('h1');
    const h1Top = h1 ? (h1.getBoundingClientRect().top + window.scrollY) : null;

    // "primeiro valor com selo": procura um elemento curto cujo texto direto contenha
    // "fonte" (selo de proveniência), depois procura na sua vizinhança (até 6 antepassados)
    // o texto numérico de maior font-size — esse é "o valor". Toma o de menor Y no documento.
    function isNumericish(s) {
      return /\d/.test(s) && s.trim().length <= 20;
    }
    const seals = Array.from(document.querySelectorAll('a,span,button')).filter(el => {
      const t = (el.textContent || '').trim();
      return t.length > 0 && t.length <= 30 && /fonte/i.test(t) && el.children.length <= 3;
    });
    let bestValue = null;
    for (const seal of seals) {
      const r0 = seal.getBoundingClientRect();
      if (r0.width <= 0 || r0.height <= 0) continue; // selo não visível
      let container = seal;
      for (let level = 0; level < 6 && container.parentElement; level++) {
        container = container.parentElement;
        // candidatos: elementos folha com texto numérico curto dentro do container
        const candidates = Array.from(container.querySelectorAll('*')).filter(el => {
          if (el.children.length > 0) return false;
          const t = (el.textContent || '').trim();
          return isNumericish(t) && !/fonte/i.test(t);
        });
        if (candidates.length > 0) {
          let best = null, bestSize = -1;
          for (const c of candidates) {
            const cs = getComputedStyle(c);
            const fs = parseFloat(cs.fontSize) || 0;
            const r = c.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            if (fs > bestSize) { bestSize = fs; best = c; }
          }
          if (best) {
            const r = best.getBoundingClientRect();
            const docTop = r.top + window.scrollY;
            if (!bestValue || docTop < bestValue.docTop) {
              bestValue = { docTop, text: best.textContent.trim().slice(0, 30), fontSize: bestSize };
            }
          }
          break; // achou candidatos a este nível, não sobe mais
        }
      }
    }

    const scrollWidth = document.documentElement.scrollWidth;
    const innerWidth = window.innerWidth;

    return {
      height: scrollHeight,
      h1Top,
      h1Text: h1 ? h1.textContent.trim().slice(0, 60) : null,
      seloDistancia: bestValue ? bestValue.docTop : null,
      seloTexto: bestValue ? bestValue.text : null,
      scrollWidth,
      innerWidth,
      horizontalOverflow: scrollWidth > innerWidth,
      overflowPx: scrollWidth - innerWidth,
    };
  });
}

// Corta um retângulo (DOMRect-like) pela cadeia de antepassados com overflow não visível,
// devolvendo o retângulo final já recortado, ou null se ficar sem área ou se algum
// antepassado tiver display:none/visibility:hidden. Isto é essencial: um nó "visualmente
// escondido" ao estilo sr-only (width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0),
// usado neste sítio na classe .vh) continua a devolver a caixa NATURAL (não cortada) em
// Range.getClientRects() ou em getBoundingClientRect() — só recortando pela caixa de CADA
// antepassado com overflow≠visible é que a caixa efetiva fica correta. Sem isto, o detetor
// de sobreposições apanhou "colisões" com texto que na verdade nunca é pintado: na primeira
// versão, 20 das 21 "sobreposições" que encontrei em /municipios/evora (antes, 390) eram
// deste tipo — texto .vh escondido, ou linhas adjacentes tocando por arredondamento de
// sub-pixel — e não colisões reais. Fica repetida (não partilhada por import) em cada
// função porque cada uma corre isolada dentro de page.evaluate(), sem closures do Node.
//
// A função é idêntica nas três: inPage_measureTouchTargets, inPage_measureSmallText,
// inPage_measureOverlaps.

// Alvos de toque < 44x44 efetivos (elemento + ::before/::after posicionados absolutamente)
async function inPage_measureTouchTargets(page) {
  return page.evaluate((MIN) => {
    function computeVisibleRect(rect, el) {
      if (!rect || rect.width <= 0 || rect.height <= 0) return null;
      let cur = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      let anc = el;
      while (anc && anc !== document.documentElement) {
        const cs = getComputedStyle(anc);
        if (cs.display === 'none' || cs.visibility === 'hidden') return null;
        // um <details> fechado não pinta o seu conteúdo (exceto o <summary>), mesmo que
        // display/overflow pareçam normais em getComputedStyle — confirmado com
        // document.elementFromPoint() a devolver null no centro do texto. É um mecanismo
        // nativo do browser (não CSS), por isso precisa de um teste à parte do resto do
        // corte por overflow. Achado ao investigar por que a régua de convergência de um
        // cartão do painel (dentro de <details class="peca-mais"> fechado) entrava na
        // contagem de texto pequeno como se estivesse à vista.
        if (anc.tagName === 'DETAILS' && !anc.open) {
          const summary = anc.querySelector(':scope > summary');
          if (!summary || !summary.contains(el)) return null;
        }
        const clips = cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
        if (clips) {
          const ar = anc.getBoundingClientRect();
          const left = Math.max(cur.left, ar.left);
          const top = Math.max(cur.top, ar.top);
          const right = Math.min(cur.right, ar.right);
          const bottom = Math.min(cur.bottom, ar.bottom);
          if (right <= left || bottom <= top) return null;
          cur = { left, top, right, bottom };
        }
        anc = anc.parentElement;
      }
      // limiar de "visível com significado": o padrão sr-only deste sítio (classe .vh)
      // usa width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0) — a caixa cortada
      // acima fica exatamente 1×1px nesse caso, o que é geometricamente "visível" mas
      // não é percetível a olho nenhum. Um mínimo de 4px² (~2×2px) separa isto de texto
      // real sem excluir nada que uma pessoa possa realmente ler.
      const area = (cur.right - cur.left) * (cur.bottom - cur.top);
      if (area < 4) return null;
      return cur;
    }

    function pseudoBox(el, pseudo, ownRect) {
      const cs = getComputedStyle(el, pseudo);
      if (cs.content === 'none' || cs.content === '' || cs.display === 'none' || cs.visibility === 'hidden') return null;
      const w = parseFloat(cs.width);
      const h = parseFloat(cs.height);
      if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return null;
      const position = cs.position;
      if (position === 'absolute' || position === 'fixed') {
        // encontra o bloco de referência: antepassado posicionado mais próximo (incl. o próprio elemento)
        let ref = el;
        if (getComputedStyle(el).position === 'static') {
          ref = el.parentElement;
          while (ref && getComputedStyle(ref).position === 'static') ref = ref.parentElement;
        }
        const refRect = ref ? ref.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        const top = cs.top, left = cs.left, right = cs.right, bottom = cs.bottom;
        let x, y;
        if (left !== 'auto') x = refRect.left + parseFloat(left);
        else if (right !== 'auto') x = refRect.right - parseFloat(right) - w;
        else x = ownRect.left; // aproximação: sem left/right explícitos, assume alinhado ao próprio elemento
        if (top !== 'auto') y = refRect.top + parseFloat(top);
        else if (bottom !== 'auto') y = refRect.bottom - parseFloat(bottom) - h;
        else y = ownRect.top;
        return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h };
      }
      // estático/relativo: já contado na caixa do próprio elemento (participa do fluxo normal);
      // não soma outra vez para não duplicar área.
      return null;
    }

    function isVisible(el) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      // corta pela cadeia de antepassados (ex.: dentro de um <details> fechado, ou de uma
      // dobra grid-template-rows:0fr com overflow:hidden) — se o elemento não tem antepassado
      // próprio (é o body), usa a própria caixa.
      const clipped = el.parentElement ? computeVisibleRect(r, el.parentElement) : r;
      return !!clipped;
    }

    const selector = 'a[href], button, input, select, textarea, [role="button"], [onclick], [tabindex]:not([tabindex="-1"])';
    const els = Array.from(document.querySelectorAll(selector)).filter(isVisible);
    const out = [];
    for (const el of els) {
      const own = el.getBoundingClientRect();
      let left = own.left, top = own.top, right = own.right, bottom = own.bottom;
      for (const pseudo of ['::before', '::after']) {
        const pb = pseudoBox(el, pseudo, own);
        if (pb) {
          left = Math.min(left, pb.left);
          top = Math.min(top, pb.top);
          right = Math.max(right, pb.right);
          bottom = Math.max(bottom, pb.bottom);
        }
      }
      const w = right - left, h = bottom - top;
      if (w < MIN || h < MIN) {
        out.push({
          tag: el.tagName,
          cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
          text: (el.textContent || '').trim().slice(0, 30),
          href: el.getAttribute ? el.getAttribute('href') : null,
          w: Math.round(w * 100) / 100,
          h: Math.round(h * 100) / 100,
          ownW: Math.round(own.width * 100) / 100,
          ownH: Math.round(own.height * 100) / 100,
          top: Math.round(top + window.scrollY),
        });
      }
    }
    return out;
  }, TOUCH_MIN);
}

// Texto < 12px visível
async function inPage_measureSmallText(page) {
  return page.evaluate((MIN) => {
    function computeVisibleRect(rect, el) {
      if (!rect || rect.width <= 0 || rect.height <= 0) return null;
      let cur = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      let anc = el;
      while (anc && anc !== document.documentElement) {
        const cs = getComputedStyle(anc);
        if (cs.display === 'none' || cs.visibility === 'hidden') return null;
        // um <details> fechado não pinta o seu conteúdo (exceto o <summary>), mesmo que
        // display/overflow pareçam normais em getComputedStyle — confirmado com
        // document.elementFromPoint() a devolver null no centro do texto. É um mecanismo
        // nativo do browser (não CSS), por isso precisa de um teste à parte do resto do
        // corte por overflow. Achado ao investigar por que a régua de convergência de um
        // cartão do painel (dentro de <details class="peca-mais"> fechado) entrava na
        // contagem de texto pequeno como se estivesse à vista.
        if (anc.tagName === 'DETAILS' && !anc.open) {
          const summary = anc.querySelector(':scope > summary');
          if (!summary || !summary.contains(el)) return null;
        }
        const clips = cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
        if (clips) {
          const ar = anc.getBoundingClientRect();
          const left = Math.max(cur.left, ar.left);
          const top = Math.max(cur.top, ar.top);
          const right = Math.min(cur.right, ar.right);
          const bottom = Math.min(cur.bottom, ar.bottom);
          if (right <= left || bottom <= top) return null;
          cur = { left, top, right, bottom };
        }
        anc = anc.parentElement;
      }
      // limiar de "visível com significado": o padrão sr-only deste sítio (classe .vh)
      // usa width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0) — a caixa cortada
      // acima fica exatamente 1×1px nesse caso, o que é geometricamente "visível" mas
      // não é percetível a olho nenhum. Um mínimo de 4px² (~2×2px) separa isto de texto
      // real sem excluir nada que uma pessoa possa realmente ler.
      const area = (cur.right - cur.left) * (cur.bottom - cur.top);
      if (area < 4) return null;
      return cur;
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement ? node.parentElement.tagName : '';
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const seen = new Map(); // dedupe by (text+fontSize) to keep report compact but keep true count
    let count = 0;
    let node;
    const examples = [];
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = Array.from(range.getClientRects());
      if (rects.length === 0) continue;
      // pelo menos uma caixa de linha deve sobreviver ao corte por antepassados
      const anyVisible = rects.some(rr => !!computeVisibleRect(rr, parent));
      if (!anyVisible) continue;
      const fs = parseFloat(getComputedStyle(parent).fontSize);
      if (fs < MIN) {
        count++;
        const key = node.textContent.trim().slice(0, 30) + '|' + fs;
        if (!seen.has(key)) {
          seen.set(key, true);
          if (examples.length < 60) {
            examples.push({ text: node.textContent.trim().slice(0, 40), fontSize: Math.round(fs * 100) / 100, tag: parent.tagName, cls: (parent.className && typeof parent.className === 'string') ? parent.className.slice(0, 40) : '' });
          }
        }
      }
    }
    return { count, examples };
  }, TEXT_MIN);
}

// Sobreposições de texto: pares de nós de texto DIFERENTES cujas caixas de linha (já
// recortadas pelos antepassados com overflow não visível) se cruzam. Exige uma espessura
// mínima de 1px em AMBAS as direções para não contar como "sobreposição" o toque de
// arredondamento de sub-pixel entre duas caixas de linha adjacentes (ex.: 232 × 0,29 px —
// duas linhas empilhadas sem espaço nenhum, não uma colisão).
async function inPage_measureOverlaps(page) {
  return page.evaluate(({ MIN_AREA, MIN_THICKNESS }) => {
    function computeVisibleRect(rect, el) {
      if (!rect || rect.width <= 0 || rect.height <= 0) return null;
      let cur = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      let anc = el;
      while (anc && anc !== document.documentElement) {
        const cs = getComputedStyle(anc);
        if (cs.display === 'none' || cs.visibility === 'hidden') return null;
        // um <details> fechado não pinta o seu conteúdo (exceto o <summary>), mesmo que
        // display/overflow pareçam normais em getComputedStyle — confirmado com
        // document.elementFromPoint() a devolver null no centro do texto. É um mecanismo
        // nativo do browser (não CSS), por isso precisa de um teste à parte do resto do
        // corte por overflow. Achado ao investigar por que a régua de convergência de um
        // cartão do painel (dentro de <details class="peca-mais"> fechado) entrava na
        // contagem de texto pequeno como se estivesse à vista.
        if (anc.tagName === 'DETAILS' && !anc.open) {
          const summary = anc.querySelector(':scope > summary');
          if (!summary || !summary.contains(el)) return null;
        }
        const clips = cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
        if (clips) {
          const ar = anc.getBoundingClientRect();
          const left = Math.max(cur.left, ar.left);
          const top = Math.max(cur.top, ar.top);
          const right = Math.min(cur.right, ar.right);
          const bottom = Math.min(cur.bottom, ar.bottom);
          if (right <= left || bottom <= top) return null;
          cur = { left, top, right, bottom };
        }
        anc = anc.parentElement;
      }
      // limiar de "visível com significado": o padrão sr-only deste sítio (classe .vh)
      // usa width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0) — a caixa cortada
      // acima fica exatamente 1×1px nesse caso, o que é geometricamente "visível" mas
      // não é percetível a olho nenhum. Um mínimo de 4px² (~2×2px) separa isto de texto
      // real sem excluir nada que uma pessoa possa realmente ler.
      const area = (cur.right - cur.left) * (cur.bottom - cur.top);
      if (area < 4) return null;
      return cur;
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement ? node.parentElement.tagName : '';
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const boxes = [];
    let node, idx = 0;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = Array.from(range.getClientRects());
      for (const r of rects) {
        const clipped = computeVisibleRect(r, parent); // já recortado pelos antepassados
        if (!clipped) continue;
        boxes.push({
          nodeIdx: idx,
          text: node.textContent.trim().slice(0, 30),
          top: clipped.top + window.scrollY, bottom: clipped.bottom + window.scrollY,
          left: clipped.left, right: clipped.right,
        });
      }
      idx++;
    }
    // varrimento por Y (sweep-line): ordena por top, mantém janela de ativos
    boxes.sort((a, b) => a.top - b.top);
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        if (boxes[j].top >= boxes[i].bottom) break; // já não pode haver sobreposição em Y
        if (boxes[j].nodeIdx === boxes[i].nodeIdx) continue; // mesmo nó de texto
        const a = boxes[i], b = boxes[j];
        const ix = Math.max(a.left, b.left);
        const iy = Math.max(a.top, b.top);
        const ir = Math.min(a.right, b.right);
        const ib = Math.min(a.bottom, b.bottom);
        const w = ir - ix, h = ib - iy;
        if (w >= MIN_THICKNESS && h >= MIN_THICKNESS && w * h >= MIN_AREA) {
          overlaps.push({
            textA: a.text, textB: b.text,
            w: Math.round(w * 100) / 100, h: Math.round(h * 100) / 100,
            top: Math.round(a.top - window.scrollY),
          });
        }
      }
    }
    return overlaps;
  }, { MIN_AREA: OVERLAP_MIN_AREA, MIN_THICKNESS: 1 });
}

// ---------------------------------------------------------------------------
// Bandas vazias — via pixéis da captura de página inteira, analisados em canvas no browser
// ---------------------------------------------------------------------------
async function measureEmptyBands(page, viewportWidth) {
  const heightPx = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  if (heightPx > BAND_HEIGHT_CAP) {
    return { measured: false, reason: `altura ${heightPx}px > ${BAND_HEIGHT_CAP}px (limiar do brief)`, bands: [] };
  }
  // scale:'css' força a imagem a vir em pixéis CSS (não pixéis de dispositivo), para bater
  // certo com scrollHeight/getBoundingClientRect usados no resto do programa — sem isto, no
  // WebKit móvel (deviceScaleFactor 3) a imagem sairia 3× maior e todas as bandas errariam por 3×.
  const buf = await page.screenshot({ fullPage: true, scale: 'css' });
  const b64 = buf.toString('base64');
  // Analisa a imagem numa página em branco própria (canvas), não a página medida.
  const analyzer = await page.context().newPage();
  await analyzer.setContent('<canvas id="c"></canvas>');
  const bands = await analyzer.evaluate(async (b64png) => {
    const img = new Image();
    const loaded = new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    img.src = 'data:image/png;base64,' + b64png;
    await loaded;
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const W = img.naturalWidth, H = img.naturalHeight;
    if (W === 0 || H === 0) return { error: 'imagem vazia', W, H };
    // amostra cada linha (ou a cada 2px se muito alta) em passos de 4px em X
    const rowStep = H > 20000 ? 3 : 1;
    const colStep = Math.max(1, Math.floor(W / 120));
    const rowUniform = [];
    let firstPixel = null;
    for (let y = 0; y < H; y += rowStep) {
      const data = ctx.getImageData(0, y, W, 1).data;
      if (firstPixel === null) firstPixel = [data[0], data[1], data[2]];
      let uniform = true;
      let r0 = data[0], g0 = data[1], bl0 = data[2];
      for (let x = 0; x < W; x += colStep) {
        const i = x * 4;
        const dr = Math.abs(data[i] - r0), dg = Math.abs(data[i + 1] - g0), db = Math.abs(data[i + 2] - bl0);
        if (dr > 6 || dg > 6 || db > 6) { uniform = false; break; }
      }
      rowUniform.push(uniform);
    }
    // agrupa linhas uniformes consecutivas em bandas
    const bands = [];
    let start = null;
    for (let i = 0; i <= rowUniform.length; i++) {
      const isU = i < rowUniform.length ? rowUniform[i] : false;
      if (isU && start === null) start = i;
      if (!isU && start !== null) {
        const yStart = start * rowStep;
        const yEnd = i * rowStep;
        bands.push({ yStart, yEnd, height: yEnd - yStart });
        start = null;
      }
    }
    return { bands, W, H, firstPixel };
  }, b64);
  await analyzer.close();
  if (bands.error) return { measured: false, reason: bands.error, bands: [] };
  // só bandas interiores (com conteúdo acima e abaixo), altura >= BAND_MIN
  const H = bands.H;
  const interior = bands.bands.filter(b => b.yStart > 0 && b.yEnd < H && b.height >= 48);
  return { measured: true, bands: interior, imgW: bands.W, imgH: bands.H, firstPixel: bands.firstPixel };
}

// ---------------------------------------------------------------------------
// Orquestração: uma visita por (build, rota, largura)
// ---------------------------------------------------------------------------
async function visitAndMeasure(browserCtx, buildLabel, baseUrl, route, widthLabel) {
  const page = await browserCtx.newPage();
  const url = baseUrl + route;
  const result = { build: buildLabel, route, width: widthLabel, url };
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    result.httpStatus = resp ? resp.status() : null;
    await page.waitForTimeout(150);

    const core = await inPage_measureCore(page);
    Object.assign(result, core);

    const viewportH = widthLabel === 'mobile' ? IPHONE13.viewport.height : DESKTOP_VIEWPORT.height;
    result.screens = Math.round((core.height / viewportH) * 100) / 100;
    result.h1DistanciaScreens = core.h1Top != null ? Math.round((core.h1Top / viewportH) * 100) / 100 : null;
    result.seloDistanciaScreens = core.seloDistancia != null ? Math.round((core.seloDistancia / viewportH) * 100) / 100 : null;

    const overlaps = await inPage_measureOverlaps(page);
    result.overlapsCount = overlaps.length;
    result.overlapsExamples = overlaps.slice(0, 15);

    if (widthLabel === 'mobile') {
      const touch = await inPage_measureTouchTargets(page);
      result.touchTargetsCount = touch.length;
      result.touchTargetsExamples = touch.slice(0, 20);
      const smallText = await inPage_measureSmallText(page);
      result.smallTextCount = smallText.count;
      result.smallTextExamples = smallText.examples.slice(0, 20);
    }

    const bands = await measureEmptyBands(page, widthLabel === 'mobile' ? IPHONE13.viewport.width : DESKTOP_VIEWPORT.width);
    result.emptyBands = bands;
  } catch (err) {
    result.error = String(err && err.message ? err.message : err);
  } finally {
    await page.close();
  }
  return result;
}

async function runSweep() {
  const results = [];
  const bMobile = await webkit.launch();
  const bDesktop = await chromium.launch();
  try {
    for (const [buildLabel, baseUrl] of Object.entries(BUILDS)) {
      const mobileCtx = await bMobile.newContext({ ...IPHONE13 });
      const desktopCtx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      for (const route of ROUTES) {
        process.stderr.write(`[sweep] ${buildLabel} ${route} mobile...\n`);
        results.push(await visitAndMeasure(mobileCtx, buildLabel, baseUrl, route, 'mobile'));
        process.stderr.write(`[sweep] ${buildLabel} ${route} desktop...\n`);
        results.push(await visitAndMeasure(desktopCtx, buildLabel, baseUrl, route, 'desktop'));
        // guarda incrementalmente para resiliência
        writeFileSync(path.join(SCRATCH, 'sweep-results.json'), JSON.stringify(results, null, 1));
      }
      await mobileCtx.close();
      await desktopCtx.close();
    }
  } finally {
    await bMobile.close();
    await bDesktop.close();
  }
  writeFileSync(path.join(SCRATCH, 'sweep-results.json'), JSON.stringify(results, null, 1));
  console.log(`Sweep completo: ${results.length} visitas. Guardado em ${SCRATCH}/sweep-results.json`);
}

// ---------------------------------------------------------------------------
// Casos conhecidos — prova dos detetores no «antes» antes de confiar em zeros
// ---------------------------------------------------------------------------
async function runKnownCases() {
  const out = {};
  const bMobile = await webkit.launch();
  const bDesktop = await chromium.launch();
  const antes = BUILDS.antes;

  // --- Caso 2: alvos de toque < 44x44, manchete "4" e "9" ---
  {
    const ctx = await bMobile.newContext({ ...IPHONE13 });
    const page = await ctx.newPage();
    await page.goto(antes + '/', { waitUntil: 'networkidle', timeout: 45000 });
    const touch = await inPage_measureTouchTargets(page);
    const manchete = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('h1.cabeca-h1 a.prova-valor, a.prova-valor'));
      return els.map(el => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100, top: Math.round(r.top), inH1: !!el.closest('h1') };
      });
    });
    out.caso2_touchTargets = {
      descricaoBrief: 'os algarismos da manchete «4» e «9» (8 × 16 px)',
      totalAlvosAbaixo44: touch.length,
      todosOsProvaValor: manchete,
      mancheteH1_4e9: manchete.filter(m => m.inH1),
      menoresProvaValor: manchete.slice().sort((a, b) => (a.w * a.h) - (b.w * b.h)).slice(0, 3),
      detetorApanhaManchete4e9: touch.some(t => manchete.some(m => m.inH1 && m.text === t.text && Math.abs(m.w - t.ownW) < 1)),
    };
    await ctx.close();
  }

  // --- Caso 3: texto < 12px, "Painel europeu reconferido a" a 9,5px ---
  {
    const ctx = await bMobile.newContext({ ...IPHONE13 });
    const page = await ctx.newPage();
    await page.goto(antes + '/', { waitUntil: 'networkidle', timeout: 45000 });
    const smallText = await inPage_measureSmallText(page);
    const specific = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node, out = [];
      while ((node = walker.nextNode())) {
        if (/Painel europeu reconferido/i.test(node.textContent)) {
          const el = node.parentElement;
          const cs = getComputedStyle(el);
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = Array.from(range.getClientRects()).map(r => ({ w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 }));
          out.push({ text: node.textContent.trim(), fontSizeComputado: cs.fontSize, lineHeight: cs.lineHeight, lineBoxRects: rects });
        }
      }
      return out;
    });
    out.caso3_textoPequeno = {
      descricaoBrief: '«Painel europeu reconferido a» a 9,5 px',
      totalTextoAbaixo12: smallText.count,
      elementoEspecifico: specific,
      nota: 'getComputedStyle(...).fontSize devolve 12px para este elemento, não 9,5px. Caixa de linha (Range.getClientRects) dá ~14,4px de altura (consistente com line-height, não com 9,5). Não encontrei nenhuma outra ocorrência deste texto exato na página. 9,5/12 ≈ 0,79, próximo de um rácio de cap-height de tipo de letra — plausível que a auditoria tenha medido a tinta do glifo em pixel (canvas), não o font-size CSS. O meu detetor usa font-size computado (a métrica estándar de acessibilidade/UX); por essa métrica este elemento específico NÃO fica abaixo de 12px (fica exactamente em 12, não <12).',
    };
    await ctx.close();
  }

  // --- Caso 4: sobreposição "242,6 → 105,5" em /municipios/evora a 390 ---
  {
    const ctx = await bMobile.newContext({ ...IPHONE13 });
    const page = await ctx.newPage();
    await page.goto(antes + '/municipios/evora', { waitUntil: 'networkidle', timeout: 45000 });
    const overlaps = await inPage_measureOverlaps(page);
    const found = overlaps.filter(o => /242,6|105,5/.test(o.textA) || /242,6|105,5/.test(o.textB));
    out.caso4_sobreposicoes = {
      descricaoBrief: 'no ar, o par «242,6 → 105,5» em /municipios/evora a 390',
      totalSobreposicoes: overlaps.length,
      parEncontrado: found,
      detetorApanhaOCaso: found.length > 0,
    };
    await ctx.close();
  }

  // --- Caso 5: banda vazia de 96px entre "308 concelhos" e o painel, a 390 ---
  {
    const ctx = await bMobile.newContext({ ...IPHONE13 });
    const page = await ctx.newPage();
    await page.goto(antes + '/', { waitUntil: 'networkidle', timeout: 45000 });
    const bands = await measureEmptyBands(page, IPHONE13.viewport.width);
    out.caso5_bandasVazias = {
      descricaoBrief: 'no ar, a banda de 96 px entre «308 concelhos» e o painel a 390',
      resultado: bands,
      bandaProximaDe96: (bands.bands || []).filter(b => Math.abs(b.height - 96) <= 15),
    };
    await ctx.close();
  }

  await bMobile.close();
  await bDesktop.close();
  writeFileSync(path.join(SCRATCH, 'known-cases.json'), JSON.stringify(out, null, 1));
  console.log('Casos conhecidos gravados em', path.join(SCRATCH, 'known-cases.json'));
  console.log(JSON.stringify(out, null, 1));
}

// ---------------------------------------------------------------------------
// Itens 7-13 — fluxos e verificações específicas por rota
// ---------------------------------------------------------------------------
async function runSpecific() {
  const out = {};
  const bMobile = await webkit.launch();
  const bDesktop = await chromium.launch();
  const log = (...a) => process.stderr.write('[specific] ' + a.join(' ') + '\n');

  async function forEachBuild(fn) {
    const res = {};
    for (const [buildLabel, base] of Object.entries(BUILDS)) {
      res[buildLabel] = await fn(buildLabel, base);
    }
    return res;
  }

  // ================= Item 7: comandos da primeira página =================
  log('item 7...');
  out.item7 = await forEachBuild(async (buildLabel, base) => {
    const r = {};
    // --- mobile: mapa antes/depois do toque, e o fluxo "Concelho" com toque real ---
    {
      const ctx = await bMobile.newContext({ ...IPHONE13 });
      const page = await ctx.newPage();
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });

      const mapBefore = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg'));
        const mapSvg = svgs.find((s) => s.querySelectorAll('circle').length >= 100);
        if (!mapSvg) return { found: false };
        return { found: true, visivel: mapSvg.getClientRects().length > 0, circleCount: mapSvg.querySelectorAll('circle').length };
      });
      r.mapaMovelAntesDoToque = mapBefore;

      const locator = page.locator('a,button').filter({ hasText: /concelho/i });
      const count = await locator.count();
      let chosen = null, chosenIsExact = false, chosenText = null;
      for (let i = 0; i < count; i++) {
        const el = locator.nth(i);
        const box = await el.boundingBox();
        if (!box || box.width <= 0 || box.height <= 0) continue;
        const text = (await el.textContent() || '').trim();
        const isExact = /^concelho$/i.test(text);
        if (chosen === null || (isExact && !chosenIsExact)) { chosen = el; chosenIsExact = isExact; chosenText = text; }
        if (isExact) break;
      }
      if (chosen) {
        await chosen.scrollIntoViewIfNeeded();
        await chosen.tap();
        await page.waitForTimeout(700);
        const after = await page.evaluate(() => {
          const input = document.querySelector('input[type="search"], input');
          const active = document.activeElement;
          let inputInfo = null;
          if (input) {
            const rect = input.getBoundingClientRect();
            inputInfo = { top: Math.round(rect.top), bottom: Math.round(rect.bottom), innerHeight: window.innerHeight, dentroDoEcra: rect.top >= 0 && rect.bottom <= window.innerHeight, focado: active === input };
          }
          const svgs = Array.from(document.querySelectorAll('svg'));
          const mapSvg = svgs.find((s) => s.querySelectorAll('circle').length >= 100);
          return {
            url: location.href,
            inputFound: !!input,
            inputInfo,
            mapaVisivelDepoisDoToque: mapSvg ? mapSvg.getClientRects().length > 0 : null,
          };
        });
        r.fluxoConcelhoMovel = { controlFound: true, textoEscolhido: chosenText, eraExato: chosenIsExact, ...after };
      } else {
        r.fluxoConcelhoMovel = { controlFound: false };
      }
      await ctx.close();
    }

    // --- desktop: pontos do mapa, ligação de Évora ---
    {
      const ctx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      const page = await ctx.newPage();
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });
      const mapInfo = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg'));
        const mapSvg = svgs.find((s) => s.querySelectorAll('circle').length >= 100);
        if (!mapSvg) return { found: false };
        const circles = Array.from(mapSvg.querySelectorAll('circle'));
        const evora = circles.find((c) => Array.from(c.attributes).some((a) => /evora|évora/i.test(a.value || '')));
        function linkHref(el) {
          let n = el;
          for (let i = 0; i < 5 && n; i++) { if (n.tagName === 'A' && n.getAttribute('href')) return n.getAttribute('href'); n = n.parentElement; }
          return null;
        }
        const evoraHref = evora ? linkHref(evora) : null;
        let linkedCount = 0;
        for (const c of circles) if (linkHref(c)) linkedCount++;
        return {
          found: true,
          totalPoints: circles.length,
          evoraFound: !!evora,
          evoraHref,
          evoraLigaParaMunicipioEvora: evoraHref === '/municipios/evora',
          pontosComLigacao: linkedCount,
        };
      });
      r.mapaDesktop = mapInfo;
      await ctx.close();
    }

    // --- régua não existe em / (ambas as larguras; innerText=visível, textContent=tudo) ---
    for (const widthLabel of ['mobile', 'desktop']) {
      const ctx = widthLabel === 'mobile' ? await bMobile.newContext({ ...IPHONE13 }) : await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      const page = await ctx.newPage();
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });
      const regua = await page.evaluate(() => ({
        visivel: { convergencia: /converg[êe]ncia/i.test(document.body.innerText), regua: /r[ée]gua/i.test(document.body.innerText) },
        noDOM: { convergencia: /converg[êe]ncia/i.test(document.body.textContent), regua: /r[ée]gua/i.test(document.body.textContent) },
      }));
      r['regua_' + widthLabel] = regua;
      await ctx.close();
    }

    // --- estados País / Concelho, visíveis, ambas as larguras ---
    for (const widthLabel of ['mobile', 'desktop']) {
      const ctx = widthLabel === 'mobile' ? await bMobile.newContext({ ...IPHONE13 }) : await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      const page = await ctx.newPage();
      await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });
      const segs = await page.evaluate(() => Array.from(document.querySelectorAll('a.seg')).map((el) => {
        const rr = el.getBoundingClientRect();
        return { text: el.textContent.trim(), visivel: rr.width > 0 && rr.height > 0, w: Math.round(rr.width * 100) / 100, h: Math.round(rr.height * 100) / 100 };
      }));
      const paisState = segs.find((s) => /^pa[íi]s$/i.test(s.text));
      const concelhoState = segs.find((s) => /^concelho$/i.test(s.text));
      r['estados_' + widthLabel] = {
        todosOsSegs: segs,
        temPaisVisivel: !!(paisState && paisState.visivel),
        temConcelhoVisivel: !!(concelhoState && concelhoState.visivel),
      };
      await ctx.close();
    }

    return r;
  });

  // ================= Item 8: páginas de leitura =================
  const READING_ROUTES = [
    '/estudos/evora-prometido-pago-auditado-2026/texto',
    '/estudos/evora-quinze-anos-cinco-mandatos/texto',
  ];
  out.item8 = {};
  for (const route of READING_ROUTES) {
    log('item 8...', route);
    out.item8[route] = await forEachBuild(async (buildLabel, base) => {
      const r = {};
      for (const widthLabel of ['mobile', 'desktop']) {
        const ctx = widthLabel === 'mobile' ? await bMobile.newContext({ ...IPHONE13 }) : await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
        const page = await ctx.newPage();
        await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });

        const initial = await page.evaluate(() => {
          function computeVisibleRect(rect, el) {
            if (!rect || rect.width <= 0 || rect.height <= 0) return null;
            let cur = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
            let anc = el;
            while (anc && anc !== document.documentElement) {
              const cs = getComputedStyle(anc);
              if (cs.display === 'none' || cs.visibility === 'hidden') return null;
              if (anc.tagName === 'DETAILS' && !anc.open) {
                const summary = anc.querySelector(':scope > summary');
                if (!summary || !summary.contains(el)) return null;
              }
              const clips = cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
              if (clips) {
                const ar = anc.getBoundingClientRect();
                const left = Math.max(cur.left, ar.left), top = Math.max(cur.top, ar.top);
                const right = Math.min(cur.right, ar.right), bottom = Math.min(cur.bottom, ar.bottom);
                if (right <= left || bottom <= top) return null;
                cur = { left, top, right, bottom };
              }
              anc = anc.parentElement;
            }
            const area = (cur.right - cur.left) * (cur.bottom - cur.top);
            if (area < 4) return null;
            return cur;
          }
          function countVisible(re) {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node, hits = 0;
            while ((node = walker.nextNode())) {
              if (re.test(node.textContent)) {
                const parent = node.parentElement;
                const range = document.createRange();
                range.selectNodeContents(node);
                const rects = Array.from(range.getClientRects());
                if (rects.some((rr) => !!computeVisibleRect(rr, parent))) hits++;
              }
            }
            return hits;
          }
          const recordJsonVisivel = countVisible(/\.record\.json/);
          const hex64Visivel = countVisible(/\b[0-9a-f]{64}\b/i);

          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node, headingInfo = { found: false };
          while ((node = walker.nextNode())) {
            if (/As linhas deste documento/i.test(node.textContent)) {
              const details = node.parentElement.closest('details');
              headingInfo = { found: true, hasDetails: !!details, detailsOpenByDefault: details ? details.open : null, detailsId: details ? details.id : null };
              break;
            }
          }

          const npWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let npNode, npHeadingEl = null;
          while ((npNode = npWalker.nextNode())) {
            if (/Nesta p[áa]gina/i.test(npNode.textContent)) { npHeadingEl = npNode.parentElement; break; }
          }
          let nestaPagina = { found: false };
          if (npHeadingEl) {
            const nav = npHeadingEl.closest('nav') || npHeadingEl.parentElement;
            const links = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href')) : [];
            const resolved = links.map((href) => {
              const id = href.slice(1);
              try { return !!document.getElementById(id); } catch (e) { return false; }
            });
            nestaPagina = { found: true, totalLinks: links.length, resolvedCount: resolved.filter(Boolean).length, allResolve: links.length > 0 && resolved.every(Boolean), naoResolvidos: links.filter((_, i) => !resolved[i]).slice(0, 10) };
          }

          const doorLinks = Array.from(document.querySelectorAll('a[href^="#linha-"]')).map((a) => a.getAttribute('href'));

          return {
            recordJsonVisivelComDobraFechada: recordJsonVisivel,
            hex64VisivelComDobraFechada: hex64Visivel,
            linhasDoDocumento: headingInfo,
            nestaPagina,
            doorLinksCount: doorLinks.length,
            doorLinksSample: doorLinks.slice(0, 3),
          };
        });
        r['inicial_' + widthLabel] = initial;

        if (initial.doorLinksCount > 0) {
          const doorHref = initial.doorLinksSample[0];
          const door = page.locator(`a[href="${doorHref}"]`).first();
          await door.scrollIntoViewIfNeeded();
          if (widthLabel === 'mobile') await door.tap(); else await door.click();
          await page.waitForTimeout(600);
          const afterDoor = await page.evaluate((href) => {
            const targetId = href.slice(1);
            let target = null;
            try { target = document.getElementById(targetId); } catch (e) { target = null; }
            const detailsEl = target ? target.closest('details') : null;
            const rect = target ? target.getBoundingClientRect() : null;
            return {
              targetFound: !!target,
              detailsFoundForTarget: !!detailsEl,
              detailsOpenAgora: detailsEl ? detailsEl.open : null,
              dentroDoEcra: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : null,
              rectTop: rect ? Math.round(rect.top) : null,
              rectBottom: rect ? Math.round(rect.bottom) : null,
              innerHeight: window.innerHeight,
              url: location.href,
            };
          }, doorHref);
          r['aposPorta_' + widthLabel] = afterDoor;
        } else {
          r['aposPorta_' + widthLabel] = { skipped: true, reason: 'nenhuma porta a[href^="#linha-"] encontrada' };
        }
        await ctx.close();
      }
      return r;
    });
  }

  // ================= Item 9: índice dos estudos =================
  log('item 9...');
  out.item9 = await forEachBuild(async (buildLabel, base) => {
    const ctx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
    const page = await ctx.newPage();
    await page.goto(base + '/estudos', { waitUntil: 'networkidle', timeout: 45000 });
    const info = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('main *'));
      const byParent = new Map();
      for (const el of all) {
        if (!el.parentElement) continue;
        const key = el.tagName + '|' + (typeof el.className === 'string' ? el.className : '');
        if (!byParent.has(el.parentElement)) byParent.set(el.parentElement, new Map());
        const m = byParent.get(el.parentElement);
        if (!m.has(key)) m.set(key, []);
        m.get(key).push(el);
      }
      let bestKey = null, bestList = [];
      for (const [, m] of byParent.entries()) {
        for (const [key, list] of m.entries()) {
          if (list.length > bestList.length) { bestKey = key; bestList = list; }
        }
      }
      const rows = bestList;
      const editionsPerRow = rows.map((row) => Array.from(row.querySelectorAll('a[href]')).length);
      const bodyText = document.body.innerText;
      const descRef = /Descri[çc][ãa]o:\s*reformula[çc][ãa]o do t[íi]tulo/i.test(bodyText);
      return { rowCount: rows.length, rowSelectorGuess: bestKey, editionsPerRow, descricaoReformulacaoVisivel: descRef };
    });
    await ctx.close();
    return info;
  });

  // ================= Item 10: marcador [a verificar], todas as rotas =================
  log('item 10...');
  out.item10 = {};
  for (const [buildLabel, base] of Object.entries(BUILDS)) {
    const ctx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
    const perRoute = {};
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      try {
        await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
        const info = await page.evaluate(() => {
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node, total = 0, linked = 0, samples = [];
          while ((node = walker.nextNode())) {
            if (/\[a verificar\]/i.test(node.textContent)) {
              total++;
              const a = node.parentElement.closest('a');
              const isLink = !!(a && /\/a-verificar/.test(a.getAttribute('href') || ''));
              if (isLink) linked++;
              if (samples.length < 3) samples.push({ text: node.textContent.trim().slice(0, 30), isLink, href: a ? a.getAttribute('href') : null });
            }
          }
          return { total, linked, samples };
        });
        perRoute[route] = info;
      } catch (err) {
        perRoute[route] = { error: String(err && err.message ? err.message : err) };
      } finally {
        await page.close();
      }
    }
    await ctx.close();
    out.item10[buildLabel] = perRoute;
  }

  // ================= Item 11: inglês, /en =================
  log('item 11...');
  out.item11 = await forEachBuild(async (buildLabel, base) => {
    const ctx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
    const page = await ctx.newPage();
    await page.goto(base + '/en', { waitUntil: 'networkidle', timeout: 45000 });
    const info = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node, total = 0, interfaceCount = 0, samples = [];
      while ((node = walker.nextNode())) {
        if (/concelho/i.test(node.textContent)) {
          total++;
          const el = node.parentElement;
          const inTitleOrExcerpt = !!el.closest('h1,h2,h3,article,blockquote,[data-verbatim]');
          if (!inTitleOrExcerpt) {
            interfaceCount++;
            if (samples.length < 15) samples.push({ text: node.textContent.trim().slice(0, 60), tag: el.tagName, cls: typeof el.className === 'string' ? el.className.slice(0, 40) : '' });
          }
        }
      }
      return { totalOcorrencias: total, ocorrenciasDeInterface: interfaceCount, amostras: samples };
    });
    await ctx.close();
    return info;
  });

  // ================= Item 12: livro-razão =================
  log('item 12...');
  out.item12 = {};
  out.item12.proveniencia = await forEachBuild(async (buildLabel, base) => {
    const ctx = await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
    const page = await ctx.newPage();
    await page.goto(base + '/livro-razao', { waitUntil: 'networkidle', timeout: 45000 });
    const info = await page.evaluate(() => {
      const heading = document.getElementById('grupo-completas');
      if (!heading) return { found: false };
      const text = heading.textContent.replace(/\s+/g, ' ').trim();
      const hasDenominator = /\d+\s*(de|\/)\s*\d+/.test(text);
      return { found: true, headingText: text.slice(0, 100), hasDenominator };
    });
    await ctx.close();
    return info;
  });
  out.item12.enderecoOverflow = {};
  for (const [buildLabel, base] of Object.entries(BUILDS)) {
    const res = {};
    for (const widthLabel of ['mobile', 'desktop']) {
      const ctx = widthLabel === 'mobile' ? await bMobile.newContext({ ...IPHONE13 }) : await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      const page = await ctx.newPage();
      await page.goto(base + '/livro-razao/divida-publica-2025', { waitUntil: 'networkidle', timeout: 45000 });
      const info = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node, results = [];
        while ((node = walker.nextNode())) {
          if (/https?:\/\/\S+/.test(node.textContent)) {
            const el = node.parentElement;
            results.push({
              text: node.textContent.trim().slice(0, 60),
              elementScrollWidth: el.scrollWidth,
              elementClientWidth: el.clientWidth,
              transbordaNoProprioElemento: el.scrollWidth > el.clientWidth + 1,
            });
          }
        }
        return { enderecos: results, transbordoPagina: document.documentElement.scrollWidth > window.innerWidth };
      });
      res[widthLabel] = info;
      await ctx.close();
    }
    out.item12.enderecoOverflow[buildLabel] = res;
  }

  // ================= Item 13: Évora — sem limiar, gráfico dos mandatos =================
  log('item 13...');
  out.item13 = await forEachBuild(async (buildLabel, base) => {
    const r = {};
    for (const widthLabel of ['mobile', 'desktop']) {
      const ctx = widthLabel === 'mobile' ? await bMobile.newContext({ ...IPHONE13 }) : await bDesktop.newContext({ viewport: DESKTOP_VIEWPORT });
      const page = await ctx.newPage();
      await page.goto(base + '/municipios/evora', { waitUntil: 'networkidle', timeout: 45000 });
      const info = await page.evaluate(() => {
        const card = document.querySelector('[data-medida="evora-populacao-2025"]');
        let semLimiar = { cardFound: !!card };
        if (card) {
          const topo = card.querySelector('.peca-topo');
          let squareEl = null;
          if (topo) {
            squareEl = Array.from(topo.children).find((e) => !e.classList.contains('peca-palavra'));
          }
          const beforeCS = topo ? getComputedStyle(topo, '::before') : null;
          const afterCS = topo ? getComputedStyle(topo, '::after') : null;
          semLimiar = {
            cardFound: true,
            topoChildCount: topo ? topo.children.length : null,
            topoHTML: topo ? topo.outerHTML.slice(0, 200) : null,
            temElementoQuadradoIrmao: !!squareEl,
            quadradoHTML: squareEl ? squareEl.outerHTML.slice(0, 120) : null,
            pseudoBeforeContent: beforeCS ? beforeCS.content : null,
            pseudoAfterContent: afterCS ? afterCS.content : null,
          };
        }

        const svgs = Array.from(document.querySelectorAll('svg'));
        let chart = null;
        for (const svg of svgs) {
          const rects = Array.from(svg.querySelectorAll('rect'));
          const texts = Array.from(svg.querySelectorAll('text'));
          const years = texts.filter((t) => /^(19|20)\d{2}$/.test(t.textContent.trim()));
          const values = texts.filter((t) => /^\d+[,.]\d+$/.test(t.textContent.trim()));
          if (rects.length >= 3 && years.length >= 2 && values.length >= 2) { chart = { rects, values }; break; }
        }
        let mandatos = { found: false };
        if (chart) {
          const sides = chart.values.map((v) => {
            const vr = v.getBoundingClientRect();
            let best = null, bestDist = Infinity;
            for (const rc of chart.rects) {
              const rr = rc.getBoundingClientRect();
              const dist = Math.abs((vr.left + vr.right) / 2 - (rr.left + rr.right) / 2);
              if (dist < bestDist) { bestDist = dist; best = rr; }
            }
            const side = best ? ((vr.top + vr.bottom) / 2 < (best.top + best.bottom) / 2 ? 'acima' : 'abaixo') : 'desconhecido';
            return { text: v.textContent.trim(), side };
          });
          const distinctSides = new Set(sides.map((s) => s.side));
          mandatos = { found: true, labels: sides, mesmoLado: distinctSides.size === 1 };
        }

        return { semLimiar, mandatos };
      });
      r[widthLabel] = info;
      await ctx.close();
    }
    return r;
  });

  await bMobile.close();
  await bDesktop.close();
  writeFileSync(path.join(SCRATCH, 'specific-results.json'), JSON.stringify(out, null, 1));
  console.log('Medidas específicas (itens 7-13) gravadas em', path.join(SCRATCH, 'specific-results.json'));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const mode = process.argv[2] || 'all';
(async () => {
  if (mode === 'sweep' || mode === 'all') await runSweep();
  if (mode === 'known-cases' || mode === 'all') await runKnownCases();
  if (mode === 'specific' || mode === 'all') await runSpecific();
})().catch(err => { console.error(err); process.exit(1); });
