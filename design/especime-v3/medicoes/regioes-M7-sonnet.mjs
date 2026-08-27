#!/usr/bin/env node
/**
 * regioes-M7-sonnet.mjs
 * Medidor cego (Claude Sonnet) do bloco «As regiões» — O Estado do País.
 *
 * Âmbito lido: Emenda 21 (design/especime-v3/direcao.md) e as linhas do
 * livro-razão ledger/claims/{pib-pc,distancia}-*.yml. Nada de src/, nada de
 * scripts/, nenhuma nota ou briefing dos construtores — só a Emenda, os
 * dados, e o sítio construído (dist/), servido por HTTP e lido como um
 * leitor o lê (Playwright, com um motor real).
 *
 * Método: cada comparador é primeiro provado num caso conhecido, avariado de
 * propósito, antes de se confiar em qualquer "zero" que ele devolva sobre o
 * sítio real. Ver a secção AUTOTESTE, que corre primeiro e aborta o resto da
 * medição se um comparador não acender a vermelho quando deve.
 *
 * Uso:
 *   NODE_PATH=<node_modules do repo principal> node regioes-M7-sonnet.mjs
 * Espera dist/ servido em BASE_URL (default http://127.0.0.1:4791).
 */

import { chromium, webkit, devices } from 'playwright';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const LEDGER_DIR = path.join(ROOT, 'ledger/claims');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4791';
const T0 = Date.now();

// ---------------------------------------------------------------------------
// Registo
// ---------------------------------------------------------------------------
const rows = [];
let anyFail = false;
let selfTestFailed = false;

function log(area, id, status, detail = '') {
  rows.push({ area, id, status, detail });
  const mark = { PASS: 'OK  ', FAIL: 'FAIL', RED: 'RED ', INFO: 'INFO' }[status] || status;
  if (status === 'FAIL') anyFail = true;
  console.log(`[${mark}] ${area} :: ${id}${detail ? ' — ' + detail : ''}`);
}
function heading(s) {
  console.log('\n' + '='.repeat(78));
  console.log(s);
  console.log('='.repeat(78));
}
function must(cond, msg) {
  // usado só no AUTOTESTE: se um comparador não reage como esperado a um
  // caso avariado, a medição inteira pára — um detector não provado não
  // produz zeros de confiança.
  if (!cond) {
    console.error(`\n!!! AUTOTESTE FALHOU: ${msg}\n!!! Um comparador não acendeu a vermelho no seu caso conhecido.`);
    console.error('!!! A medição pára aqui: nenhum "zero" a seguir seria de confiança.\n');
    selfTestFailed = true;
    process.exitCode = 2;
    throw new Error('AUTOTESTE FALHOU: ' + msg);
  }
}

// ---------------------------------------------------------------------------
// Leitor mínimo do livro-razão — só os campos escalares simples usados aqui.
// ---------------------------------------------------------------------------
function readClaimRaw(id) {
  const p = path.join(LEDGER_DIR, `${id}.yml`);
  if (!existsSync(p)) return null;
  const txt = readFileSync(p, 'utf8');
  const get = (key) => {
    const m = txt.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*$`, 'm'));
    if (m) return m[1].replace(/\\"/g, '"');
    return undefined;
  };
  return { id, value: get('value'), unit: get('unit'), check: get('check') };
}
function listLedgerIds(prefix) {
  return readdirSync(LEDGER_DIR)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.yml'))
    .map((f) => f.slice(0, -4))
    .sort();
}
function slugFromPibId(id) {
  const m = id.match(/^pib-pc-(.+)-2024$/);
  return m ? m[1] : null;
}

const PIB_2024_IDS = listLedgerIds('pib-pc-').filter((id) => id.endsWith('-2024'));
const PIB_REGIOES_2024 = PIB_2024_IDS.filter((id) => id !== 'pib-pc-portugal-2024');
const EXPECTED_REGION_SLUGS = PIB_REGIOES_2024.map(slugFromPibId).filter(Boolean).sort();
const ALL_LEDGER_IDS_USED = [...listLedgerIds('pib-pc-'), ...listLedgerIds('distancia-')];

console.log(`livro-razão: ${PIB_2024_IDS.length} linhas pib-pc-*-2024 (${PIB_REGIOES_2024.length} regiões + Portugal)`);
console.log(`regiões esperadas na régua: ${EXPECTED_REGION_SLUGS.join(', ')}`);

// ---------------------------------------------------------------------------
// Comparadores puros (testados no AUTOTESTE antes de se usarem a sério)
// ---------------------------------------------------------------------------
function compareClaimTexts(domClaims, oracleFn) {
  const problems = [];
  for (const { id, text } of domClaims) {
    const oracle = oracleFn(id);
    if (!oracle) { problems.push({ id, kind: 'sem-linha-no-livro-razao', got: text }); continue; }
    if (String(oracle.value).trim() !== String(text).trim()) {
      problems.push({ id, kind: 'valor-diferente', expected: oracle.value, got: text });
    }
  }
  return problems;
}
function compareSlugSets(drawnSlugs, expectedSlugs) {
  const drawn = new Set(drawnSlugs);
  const expected = new Set(expectedSlugs);
  const emFalta = [...expected].filter((s) => !drawn.has(s));
  const orfaos = [...drawn].filter((s) => !expected.has(s));
  return { emFalta, orfaos };
}
function assertEqual(label, got, expected) {
  return { label, ok: got === expected, got, expected };
}
function assertGE(label, got, min) {
  return { label, ok: got >= min, got, min };
}
function withinEps(a, b, eps) {
  return Math.abs(a - b) <= eps;
}
function diffByRole(entries, props) {
  // entries: [{key, role, contorno, ...cssProps}]
  // devolve, por papel (role) e por propriedade, o conjunto de valores distintos
  const byRole = new Map();
  for (const e of entries) {
    if (!byRole.has(e.role)) byRole.set(e.role, []);
    byRole.get(e.role).push(e);
  }
  const out = {};
  for (const [role, ents] of byRole) {
    out[role] = {};
    for (const prop of props) {
      const byValue = new Map();
      for (const e of ents) {
        const v = e[prop];
        if (!byValue.has(v)) byValue.set(v, []);
        byValue.get(v).push(e.key);
      }
      out[role][prop] = byValue;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// AUTOTESTE — prova cada comparador num caso vermelho conhecido
// ---------------------------------------------------------------------------
heading('0 · AUTOTESTE — provar os comparadores antes de confiar em qualquer zero');

{
  // 1) compareClaimTexts: avaria uma cópia do valor de alentejo e confirma
  //    que o comparador o apanha, ANTES de correr contra o livro-razão real.
  const domFake = [{ id: 'pib-pc-alentejo-2024', text: '77' }];
  const oracleReal = readClaimRaw('pib-pc-alentejo-2024');
  must(oracleReal && oracleReal.value === '77', 'pré-condição: pib-pc-alentejo-2024 devia valer "77" no livro-razão');
  const brokenOracle = (id) => (id === 'pib-pc-alentejo-2024' ? { id, value: '999' } : readClaimRaw(id));
  const red = compareClaimTexts(domFake, brokenOracle);
  must(red.length === 1 && red[0].kind === 'valor-diferente' && red[0].expected === '999' && red[0].got === '77',
    'compareClaimTexts devia apanhar o valor "999" (cópia avariada) contra o "77" do DOM');
  log('autoteste', 'compareClaimTexts em cópia avariada (999≠77)', 'RED', 'apanhado: ' + JSON.stringify(red[0]));
  const green = compareClaimTexts(domFake, readClaimRaw);
  must(green.length === 0, 'compareClaimTexts devia dar zero contra o livro-razão real não alterado');
  log('autoteste', 'compareClaimTexts contra o livro-razão real', 'PASS', 'zero problemas — detector agora de confiança');
}
{
  // 2) compareSlugSets: injeta uma região órfã e omite uma região existente,
  //    confirma que ambos os lados do comparador acendem a vermelho.
  const comOrfao = compareSlugSets([...EXPECTED_REGION_SLUGS, 'faroeste-fictício'], EXPECTED_REGION_SLUGS);
  must(comOrfao.orfaos.length === 1 && comOrfao.orfaos[0] === 'faroeste-fictício' && comOrfao.emFalta.length === 0,
    'compareSlugSets devia apanhar "faroeste-fictício" como órfã');
  log('autoteste', 'compareSlugSets com região órfã injectada', 'RED', 'apanhado: órfã=' + comOrfao.orfaos.join(','));
  const comFalta = compareSlugSets(EXPECTED_REGION_SLUGS.slice(1), EXPECTED_REGION_SLUGS);
  must(comFalta.emFalta.length === 1 && comFalta.emFalta[0] === EXPECTED_REGION_SLUGS[0] && comFalta.orfaos.length === 0,
    'compareSlugSets devia apanhar a primeira região como em falta quando omitida do desenho');
  log('autoteste', 'compareSlugSets com região em falta (omitida)', 'RED', 'apanhado: em falta=' + comFalta.emFalta.join(','));
  const limpo = compareSlugSets(EXPECTED_REGION_SLUGS, EXPECTED_REGION_SLUGS);
  must(limpo.emFalta.length === 0 && limpo.orfaos.length === 0, 'compareSlugSets devia dar zero quando os conjuntos coincidem');
  log('autoteste', 'compareSlugSets com os dois conjuntos iguais', 'PASS', 'zero em falta, zero órfãs — detector de confiança');
}
{
  // 3) assertEqual — usado nos redireccionamentos e nas ligações
  const red = assertEqual('teste', '/regioes/algarve/', '/regioes/alentejo/');
  must(red.ok === false, 'assertEqual devia dar false para strings diferentes');
  log('autoteste', 'assertEqual("algarve" vs "alentejo")', 'RED', 'ok=false como esperado');
  const green = assertEqual('teste', '/regioes/alentejo/', '/regioes/alentejo/');
  must(green.ok === true, 'assertEqual devia dar true para strings iguais');
  log('autoteste', 'assertEqual com strings iguais', 'PASS', 'ok=true — detector de confiança');
}
{
  // 4) assertGE — usado no alvo de toque de 44px e no overflow horizontal 0
  const red = assertGE('teste', 43.9, 44);
  must(red.ok === false, 'assertGE devia dar false para 43.9 < 44');
  log('autoteste', 'assertGE(43.9, mín 44)', 'RED', 'ok=false como esperado');
  const green = assertGE('teste', 44, 44);
  must(green.ok === true, 'assertGE devia dar true para 44 >= 44');
  log('autoteste', 'assertGE(44, mín 44)', 'PASS', 'ok=true — detector de confiança');
}
{
  // 5) geometria — withinEps aplicado a uma marca deslocada de propósito
  const esperado = 334.635;
  const errado = esperado + 20; // 20px de erro injectado
  must(!withinEps(errado, esperado, 0.5), 'withinEps devia rejeitar um erro de 20px com tolerância de 0.5px');
  log('autoteste', 'geometria: marca deslocada 20px', 'RED', `${errado.toFixed(3)} vs ${esperado} fora da tolerância 0.5px`);
  must(withinEps(esperado, esperado, 0.5), 'withinEps devia aceitar o mesmo valor');
  log('autoteste', 'geometria: marca no lugar certo', 'PASS', 'dentro da tolerância — detector de confiança');
}
{
  // 6) diffByRole — injecta uma diferença de propriedade a propósito
  const entries = [
    { key: 'a', role: 'x', color: 'rgb(0,0,0)' },
    { key: 'b', role: 'x', color: 'rgb(0,0,0)' },
    { key: 'c', role: 'x', color: 'rgb(255,0,0)' }, // diferente de propósito
  ];
  const d = diffByRole(entries, ['color']);
  must(d.x.color.size === 2, 'diffByRole devia ver 2 valores distintos de color quando um deles foi mudado de propósito');
  log('autoteste', 'diffByRole com uma cor trocada', 'RED', `2 valores distintos vistos: ${[...d.x.color.keys()].join(' / ')}`);
  const entriesUniform = entries.map((e) => ({ ...e, color: 'rgb(0,0,0)' }));
  const d2 = diffByRole(entriesUniform, ['color']);
  must(d2.x.color.size === 1, 'diffByRole devia ver 1 valor quando todas as cores são iguais');
  log('autoteste', 'diffByRole com cores uniformes', 'PASS', '1 valor distinto — detector de confiança');
}

console.log('\nAUTOTESTE: todos os comparadores provados no seu caso vermelho. A medição real começa a seguir.\n');

// ---------------------------------------------------------------------------
// Extracções de página (correm dentro do browser)
// ---------------------------------------------------------------------------
async function extractAllClaims(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-claim]')).map((el) => ({
      id: el.getAttribute('data-claim'),
      text: el.textContent.trim(),
    }))
  );
}

async function extractConvergencia(page) {
  return page.evaluate(() => {
    const marks = Array.from(document.querySelectorAll('g.mk[data-mk]')).map((g) => {
      const nameEl = g.querySelector('.mk-name');
      const valEl = g.querySelector('.claim-value');
      const circle = g.querySelector('circle');
      return {
        mk: g.getAttribute('data-mk'),
        contorno: g.getAttribute('data-contorno'),
        name: nameEl ? nameEl.textContent.trim() : null,
        value: valEl ? valEl.textContent.trim() : null,
        claim: valEl ? valEl.getAttribute('data-claim') : null,
        cx: circle ? parseFloat(circle.getAttribute('cx')) : null,
      };
    });
    const listRows = Array.from(document.querySelectorAll('li.conv-linha[data-conv-linha]')).map((li) => {
      const nomeSpan = li.querySelector('.conv-nome');
      const a = li.querySelector('.conv-nome a');
      const valEl = li.querySelector('.claim-value');
      const bar = li.querySelector('.conv-b');
      const ref = li.querySelector('.conv-ref');
      return {
        linha: li.getAttribute('data-conv-linha'),
        contorno: li.getAttribute('data-contorno'),
        href: a ? a.getAttribute('href') : null,
        name: nomeSpan ? nomeSpan.textContent.trim() : null,
        value: valEl ? valEl.textContent.trim() : null,
        claim: valEl ? valEl.getAttribute('data-claim') : null,
        barX: bar ? parseFloat(bar.getAttribute('x')) : null,
        barW: bar ? parseFloat(bar.getAttribute('width')) : null,
        refX: ref ? parseFloat(ref.getAttribute('x1')) : null,
      };
    });
    const estrEl = document.querySelector('script[data-dados="convergencia"]');
    let estrutura = null;
    try { estrutura = estrEl ? JSON.parse(estrEl.textContent).estrutura : null; } catch { estrutura = null; }
    return {
      marks, listRows, estrutura,
      ruleSvgPresent: !!document.querySelector('.rule-svg'),
      listPresent: !!document.querySelector('.conv-lista'),
    };
  });
}

async function extractStyles(page) {
  return page.evaluate(() => {
    function css(el) {
      const cs = getComputedStyle(el);
      return {
        fill: cs.fill, stroke: cs.stroke, color: cs.color, fontWeight: cs.fontWeight,
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      };
    }
    const out = [];
    document.querySelectorAll('g.mk[data-mk]').forEach((g) => {
      const key = g.getAttribute('data-mk');
      const contorno = g.getAttribute('data-contorno') === 'sim';
      const chapa = g.querySelector('.mk-chapa');
      const name = g.querySelector('.mk-name');
      const val = g.querySelector('.claim-value');
      const dot = g.querySelector('circle');
      if (chapa) out.push({ key, contorno, role: 'placa-marca(svg)', ...css(chapa) });
      if (name) out.push({ key, contorno, role: 'rotulo-nome(svg)', ...css(name) });
      if (val) out.push({ key, contorno, role: 'rotulo-valor(svg)', ...css(val) });
      if (dot) out.push({ key, contorno, role: 'ponto-marca(svg)', ...css(dot) });
    });
    document.querySelectorAll('li.conv-linha[data-conv-linha]').forEach((li) => {
      const key = li.getAttribute('data-conv-linha');
      const contorno = li.getAttribute('data-contorno') === 'sim';
      const nome = li.querySelector('.conv-nome');
      const val = li.querySelector('.claim-value');
      const bar = li.querySelector('.conv-b');
      out.push({ key, contorno, role: 'linha(lista)', ...css(li) });
      if (nome) out.push({ key, contorno, role: 'rotulo-nome(lista)', ...css(nome) });
      if (val) out.push({ key, contorno, role: 'rotulo-valor(lista)', ...css(val) });
      if (bar) out.push({ key, contorno, role: 'barra(lista)', ...css(bar) });
    });
    return out;
  });
}

function reportStyleDiff(entries, props, expectAllSame) {
  const diff = diffByRole(entries, props);
  let problems = [];
  for (const role of Object.keys(diff)) {
    for (const prop of props) {
      const byValue = diff[role][prop];
      if (byValue.size > 1) {
        problems.push({ role, prop, valores: [...byValue.entries()].map(([v, keys]) => `${v} → [${keys.join(',')}]`) });
      }
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const chromiumBrowser = await chromium.launch();
  const webkitBrowser = await webkit.launch();

  const desktopCtx = await chromiumBrowser.newContext({ viewport: { width: 1280, height: 800 } });
  const phoneCtx = await webkitBrowser.newContext({ ...devices['iPhone 13'] });

  // =========================================================================
  heading('1 · Conjunto de regiões, valores e distâncias — /regioes e /en/regions');
  // =========================================================================
  // gerado do conjunto de regiões lido do livro-razão (EXPECTED_REGION_SLUGS) —
  // nunca uma lista de nomes escrita à mão, para que cresça sozinho com a régua.
  const ROUTES_1 = [
    ['pt', '/regioes/'],
    ...EXPECTED_REGION_SLUGS.map((slug) => ['pt', '/regioes/' + slug + '/']),
    ['en', '/en/regions/'],
    ...EXPECTED_REGION_SLUGS.map((slug) => ['en', '/en/regions/' + slug + '/']),
  ];
  const VIEWPORTS = [
    ['1280x800', desktopCtx],
    ['iPhone13', phoneCtx],
  ];

  for (const [vpName, ctx] of VIEWPORTS) {
    for (const [lang, route] of ROUTES_1) {
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: 'networkidle' });

      // (a) todo o data-claim da página == livro-razão
      const allClaims = await extractAllClaims(page);
      const probs = compareClaimTexts(allClaims, readClaimRaw);
      if (probs.length === 0) {
        log(`1.valores [${vpName}]`, `${route}`, 'PASS', `${allClaims.length} claim(s) — todos batem com o livro-razão`);
      } else {
        for (const p of probs) log(`1.valores [${vpName}]`, `${route} :: ${p.id}`, 'FAIL', JSON.stringify(p));
      }

      // (b) conjunto de regiões na régua/lista == linhas pib-pc-*-2024 (exceto Portugal)
      const conv = await extractConvergencia(page);
      const drawnFromMarks = conv.marks.filter((m) => m.mk !== 'pt').map((m) => {
        const s = m.claim ? slugFromPibId(m.claim) : null;
        return s;
      }).filter(Boolean);
      const drawnFromList = conv.listRows.filter((r) => r.linha !== 'pt').map((r) => {
        const s = r.claim ? slugFromPibId(r.claim) : null;
        return s;
      }).filter(Boolean);
      const { emFalta: efM, orfaos: orM } = compareSlugSets(drawnFromMarks, EXPECTED_REGION_SLUGS);
      const { emFalta: efL, orfaos: orL } = compareSlugSets(drawnFromList, EXPECTED_REGION_SLUGS);
      const ptMarkPresent = conv.marks.some((m) => m.mk === 'pt');
      const ptListPresent = conv.listRows.some((r) => r.linha === 'pt');
      if (efM.length === 0 && orM.length === 0 && ptMarkPresent) {
        log(`1.conjunto-régua [${vpName}]`, route, 'PASS', `${drawnFromMarks.length} regiões + Portugal, igual ao livro-razão`);
      } else {
        log(`1.conjunto-régua [${vpName}]`, route, 'FAIL', `em falta=[${efM}] órfãs=[${orM}] Portugal presente=${ptMarkPresent}`);
      }
      if (efL.length === 0 && orL.length === 0 && ptListPresent) {
        log(`1.conjunto-lista [${vpName}]`, route, 'PASS', `${drawnFromList.length} regiões + Portugal, igual ao livro-razão`);
      } else {
        log(`1.conjunto-lista [${vpName}]`, route, 'FAIL', `em falta=[${efL}] órfãs=[${orL}] Portugal presente=${ptListPresent}`);
      }

      // (c) geometria da régua: cx de cada marca == posição(valor) segundo a escala publicada
      if (conv.estrutura && conv.marks.length) {
        const { min, max, RL, RR } = conv.estrutura;
        const scale = (RR - RL) / (max - min);
        let geomProblems = [];
        for (const m of conv.marks) {
          if (m.cx == null || m.value == null) continue;
          const v = parseFloat(m.value);
          const expectedCx = RL + (v - min) * scale;
          if (!withinEps(m.cx, expectedCx, 0.5)) {
            geomProblems.push(`${m.mk}: cx=${m.cx.toFixed(2)} esperado=${expectedCx.toFixed(2)}`);
          }
        }
        if (geomProblems.length === 0) {
          log(`1.geometria-régua [${vpName}]`, route, 'PASS', `${conv.marks.length} marcas na posição exacta do seu valor (±0.5px)`);
        } else {
          log(`1.geometria-régua [${vpName}]`, route, 'FAIL', geomProblems.join('; '));
        }
      }

      // (d) geometria da lista: largura da barra == |valor-100| × escala (distância geométrica)
      if (conv.estrutura && conv.listRows.length) {
        const { min, max } = conv.estrutura;
        const scale = 600 / (max - min); // viewBox da barra é 0..600
        let barProblems = [];
        for (const r of conv.listRows) {
          if (r.barW == null || r.value == null) continue;
          const v = parseFloat(r.value);
          const expectedW = Math.abs(100 - v) * scale;
          if (!withinEps(r.barW, expectedW, 0.5)) {
            barProblems.push(`${r.linha}: largura=${r.barW.toFixed(2)} esperada=${expectedW.toFixed(2)}`);
          }
        }
        if (barProblems.length === 0) {
          log(`1.distância-geom [${vpName}]`, route, 'PASS', `${conv.listRows.length} barra(s) com o comprimento exacto de |valor−100| (±0.5px)`);
        } else {
          log(`1.distância-geom [${vpName}]`, route, 'FAIL', barProblems.join('; '));
        }
      }

      await page.close();
    }
  }

  // (e) as claims "distancia-*" impressas em texto, onde existirem, batem com o livro-razão
  //     (já cobertas pela varredura genérica 1.valores acima, que apanha qualquer
  //     [data-claim] na página — incluindo os "distancia-*" nas páginas de região).
  const distanciaUsadas = new Set();
  for (const [, route] of ROUTES_1) {
    const page = await desktopCtx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const claims = await extractAllClaims(page);
    claims.filter((c) => c.id.startsWith('distancia-')).forEach((c) => distanciaUsadas.add(c.id));
    await page.close();
  }
  log('1.distância-cobertura', '/regioes + /en/regions (índice e sub-páginas)', 'INFO',
    `linhas "distancia-*" impressas nalguma destas páginas: ${[...distanciaUsadas].sort().join(', ') || '(nenhuma)'}`);
  const distNaoUsadas = listLedgerIds('distancia-').filter((id) => !distanciaUsadas.has(id));
  if (distNaoUsadas.length) {
    log('1.distância-cobertura', 'linhas do livro-razão não impressas nas páginas de região', 'INFO', distNaoUsadas.join(', '));
  }

  // =========================================================================
  heading('2 · Neutralidade — getComputedStyle (fill, stroke, colour, font-weight)');
  // =========================================================================
  const PROPS_NEUTRAL = ['fill', 'stroke', 'color', 'fontWeight'];

  // 2a. /regioes — página neutra, nenhuma região destacada
  {
    const page = await desktopCtx.newPage();
    await page.goto(BASE + '/regioes/', { waitUntil: 'networkidle' });
    const styles = await extractStyles(page);
    const anyContorno = styles.some((s) => s.contorno);
    log('2.neutralidade-índice', '/regioes — nenhum data-contorno=sim esperado', anyContorno ? 'FAIL' : 'PASS',
      anyContorno ? 'encontrado contorno numa página que devia ser neutra' : 'confirmado: nenhuma região destacada');
    const probs = reportStyleDiff(styles, PROPS_NEUTRAL, true);
    if (probs.length === 0) {
      log('2.neutralidade-índice', '/regioes — fill/stroke/colour/font-weight', 'PASS',
        `${styles.length} elemento(s) medidos (barras, marcas, rótulos) — um único estilo em todas as regiões`);
    } else {
      for (const p of probs) log('2.neutralidade-índice', `/regioes :: ${p.role}.${p.prop}`, 'FAIL', p.valores.join(' | '));
    }
    await page.close();
  }

  // 2b. /regioes/alentejo — o que difere para a Alentejo vs as outras
  {
    const page = await desktopCtx.newPage();
    await page.goto(BASE + '/regioes/alentejo/', { waitUntil: 'networkidle' });
    const styles = await extractStyles(page);
    const aleEntries = styles.filter((s) => s.key === 'ale');
    must(aleEntries.some((e) => e.contorno === true), 'pré-condição: a página /regioes/alentejo devia marcar "ale" com data-contorno=sim');

    // fill/color/font-weight: têm de continuar iguais, mesmo incluindo a própria Alentejo
    const probsCore = reportStyleDiff(styles, ['fill', 'color', 'fontWeight'], true);
    if (probsCore.length === 0) {
      log('2.neutralidade-alentejo', '/regioes/alentejo — fill/colour/font-weight (incl. a própria)', 'PASS',
        'idênticos em todas as regiões, incluindo a região da própria página');
    } else {
      for (const p of probsCore) log('2.neutralidade-alentejo', `/regioes/alentejo :: ${p.role}.${p.prop}`, 'FAIL', p.valores.join(' | '));
    }

    // stroke + outline: é aqui que se espera A ÚNICA diferença (o contorno)
    const probsOutline = reportStyleDiff(styles, ['stroke', 'outline'], false);
    const rolesComDiferenca = [...new Set(probsOutline.map((p) => p.role))];
    log('2.neutralidade-alentejo', '/regioes/alentejo — únicos papéis com stroke/outline diferente', 'INFO',
      rolesComDiferenca.length ? rolesComDiferenca.join(', ') : '(nenhum)');
    for (const p of probsOutline) {
      log('2.neutralidade-alentejo', `contorno :: ${p.role}.${p.prop}`, 'INFO', p.valores.join(' | '));
    }
    // confirma que NENHUM outro papel (fora do mecanismo de contorno) tem stroke/outline diferente
    // por região que não seja a própria alentejo
    const inesperados = probsOutline.filter((p) => {
      // para cada propriedade diferente, confirma que só "ale" está isolada
      // (i.e., o grupo minoritário de valores é exactamente {ale})
      const byVal = p.valores.map((v) => v.match(/\[(.*)\]/)[1].split(','));
      const minoria = byVal.reduce((a, b) => (a.length <= b.length ? a : b));
      return !(minoria.length === 1 && minoria[0] === 'ale');
    });
    if (inesperados.length === 0) {
      log('2.neutralidade-alentejo', 'a diferença de contorno isola exactamente "ale", e nada mais', 'PASS',
        'confirmado: só o contorno distingue Alentejo — em stroke (SVG) e/ou outline (lista)');
    } else {
      for (const p of inesperados) log('2.neutralidade-alentejo', `contorno inesperado :: ${p.role}.${p.prop}`, 'FAIL', p.valores.join(' | '));
    }
    await page.close();
  }

  // =========================================================================
  heading('3 · Forma de telemóvel (iPhone 13)');
  // =========================================================================
  {
    const page = await phoneCtx.newPage();
    await page.goto(BASE + '/regioes/', { waitUntil: 'networkidle' });

    // eixo (régua com rótulos) tem de estar oculto; a lista é a forma do telemóvel
    const eixoVisible = await page.locator('.conv-eixo').isVisible().catch(() => false);
    log('3.telemóvel', 'régua com eixo — deve estar oculta', eixoVisible ? 'FAIL' : 'PASS', `visível=${eixoVisible}`);
    const listaVisible = await page.locator('.conv-lista').isVisible().catch(() => false);
    log('3.telemóvel', 'lista — deve ser a forma visível', listaVisible ? 'PASS' : 'FAIL', `visível=${listaVisible}`);

    // "visível" para elementos SVG finos (linhas verticais têm largura
    // geométrica 0 por definição, mesmo bem pintadas) — em vez do bounding
    // box de Playwright, sobe-se a cadeia de antepassados e olha-se ao
    // estilo computado: display, visibility, opacity. Provado a seguir num
    // caso conhecido antes de se usar a sério (o próprio "eixo", que se
    // sabe ficar display:none no telemóvel).
    const isRenderedCheck = await page.evaluate(() => {
      function isRendered(el) {
        let node = el;
        while (node && node.nodeType === 1) {
          const cs = getComputedStyle(node);
          if (cs.display === 'none') return false;
          if (node === el && (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0)) return false;
          node = node.parentElement;
        }
        return true;
      }
      const umTk = document.querySelector('.tk');
      const eixo = document.querySelector('.conv-eixo');
      return {
        // caso vermelho conhecido: um .tk está dentro de .conv-eixo, que é display:none no telemóvel
        tkDentroDeEixoOculto: umTk ? isRendered(umTk) : null,
        eixoDisplay: eixo ? getComputedStyle(eixo).display : null,
      };
    });
    must(isRenderedCheck.eixoDisplay === 'none', 'pré-condição: .conv-eixo devia estar display:none no telemóvel');
    must(isRenderedCheck.tkDentroDeEixoOculto === false, 'isRendered devia dar false para um .tk dentro do eixo oculto (caso vermelho conhecido)');
    log('autoteste', 'isRendered() num .tk dentro do eixo oculto', 'RED', 'false, como esperado — a função apanha o ocultamento por antepassado');

    const visibilidade = await page.evaluate(() => {
      function isRendered(el) {
        let node = el;
        while (node && node.nodeType === 1) {
          const cs = getComputedStyle(node);
          if (cs.display === 'none') return false;
          if (node === el && (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0)) return false;
          node = node.parentElement;
        }
        return true;
      }
      const tks = Array.from(document.querySelectorAll('.tk'));
      const tkVisible = tks.filter(isRendered).length;
      const linhas = Array.from(document.querySelectorAll('li.conv-linha'));
      const refs = linhas.map((li) => {
        const ref = li.querySelector('.conv-ref');
        return { slug: li.getAttribute('data-conv-linha'), presente: !!ref, visivel: ref ? isRendered(ref) : false };
      });
      return { tkCount: tks.length, tkVisible, refs };
    });
    log('3.telemóvel', `rótulos do eixo (.tk, ${visibilidade.tkCount} no DOM) — nenhum visível`, visibilidade.tkVisible === 0 ? 'PASS' : 'FAIL',
      `${visibilidade.tkVisible} visível(is) (estilo computado, não bounding-box — uma linha vertical tem largura geométrica 0)`);

    const refOk = visibilidade.refs.filter((r) => r.presente && r.visivel).length;
    log('3.telemóvel', `o "100" marcado em cada linha (${visibilidade.refs.length} linha(s))`, refOk === visibilidade.refs.length ? 'PASS' : 'FAIL',
      `${refOk}/${visibilidade.refs.length} com a referência 100 presente e visível — ${JSON.stringify(visibilidade.refs)}`);

    // uma região por linha: uma linha visível por data-conv-linha, uma abaixo da outra, sem sobreposição
    const rowBoxes = await page.evaluate(() =>
      Array.from(document.querySelectorAll('li.conv-linha')).map((li) => {
        const r = li.getBoundingClientRect();
        return { slug: li.getAttribute('data-conv-linha'), top: r.top, bottom: r.bottom, height: r.height };
      })
    );
    let sobreposicao = [];
    for (let i = 1; i < rowBoxes.length; i++) {
      if (rowBoxes[i].top < rowBoxes[i - 1].bottom - 0.5) sobreposicao.push(`${rowBoxes[i - 1].slug}/${rowBoxes[i].slug}`);
    }
    log('3.telemóvel', `${rowBoxes.length} linha(s), uma por região — sem sobreposição vertical`, sobreposicao.length === 0 ? 'PASS' : 'FAIL',
      sobreposicao.length ? `sobrepostas: ${sobreposicao.join(', ')}` : `alturas: ${rowBoxes.map((r) => r.height.toFixed(1)).join(', ')}`);

    // altura da linha (reportada) e alvo de toque da porta (.conv-nome a) ≥44px
    const portas = await page.evaluate(() =>
      Array.from(document.querySelectorAll('li.conv-linha')).map((li) => {
        const rowR = li.getBoundingClientRect();
        const a = li.querySelector('.conv-nome a');
        const ar = a ? a.getBoundingClientRect() : null;
        return { slug: li.getAttribute('data-conv-linha'), rowH: rowR.height, doorH: ar ? ar.height : null, doorW: ar ? ar.width : null };
      })
    );
    for (const p of portas) {
      if (p.doorH == null) {
        log('3.telemóvel-porta', `${p.slug} — sem porta própria (Portugal não tem página de região)`, 'INFO', `altura da linha=${p.rowH.toFixed(1)}px`);
        const gRow = assertGE(`linha ${p.slug}`, p.rowH, 44);
        log('3.telemóvel-linha', `altura da linha ${p.slug} ≥44px`, gRow.ok ? 'PASS' : 'FAIL', `${p.rowH.toFixed(1)}px`);
        continue;
      }
      const gDoor = assertGE(`porta ${p.slug}`, p.doorH, 44);
      const gRow = assertGE(`linha ${p.slug}`, p.rowH, 44);
      log('3.telemóvel-porta', `alvo de toque da porta ${p.slug} ≥44px`, gDoor.ok ? 'PASS' : 'FAIL', `altura=${p.doorH.toFixed(2)}px largura=${p.doorW.toFixed(2)}px`);
      log('3.telemóvel-linha', `altura da linha ${p.slug} ≥44px`, gRow.ok ? 'PASS' : 'FAIL', `${p.rowH.toFixed(1)}px`);
    }

    // overflow horizontal 0
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const gOverflow = assertEqual('overflow horizontal', overflow, 0);
    log('3.telemóvel', 'overflow horizontal', gOverflow.ok ? 'PASS' : 'FAIL', `scrollWidth−clientWidth = ${overflow}px`);

    await page.close();
  }

  // =========================================================================
  heading('4 · Endereços antigos → páginas novas');
  // =========================================================================
  const REDIRECTS = [
    ['/?ambito=regiao:alentejo', '/regioes/alentejo/'],
    ['/?ambito=regiao:portugal', '/regioes/'],
    ['/?ambito=regiao:nao-existe-xyz', '/regioes/'],
    ['/en/?ambito=regiao:alentejo', '/en/regions/alentejo/'],
    // caso novo na corrida 2: uma das quatro regiões que entraram agora —
    // prova que a lista-permissão do redireccionamento cresceu com a régua,
    // não ficou presa às cinco da corrida 1.
    ['/?ambito=regiao:norte', '/regioes/norte/'],
  ];
  for (const [from, to] of REDIRECTS) {
    const page = await desktopCtx.newPage();
    const resp = await page.goto(BASE + from, { waitUntil: 'load' });
    await page.waitForTimeout(700); // tempo para o redireccionamento no cliente
    const finalPath = new URL(page.url()).pathname;
    const expectedPath = to;
    const eq = assertEqual(from, finalPath, expectedPath);
    log('4.redireccionamento', `${from} → ${expectedPath}`, eq.ok ? 'PASS' : 'FAIL', `chegou a ${finalPath} (estado HTTP inicial ${resp.status()})`);
    await page.close();
  }

  // =========================================================================
  heading('5 · Primeira página — sem bloco de região, comando País·Região·Concelho');
  // =========================================================================
  for (const [lang, route, labels] of [
    ['pt', '/', { pais: 'País', regiao: 'Região', concelho: 'Concelho', portaRegiao: '/regioes' }],
    ['en', '/en/', { pais: 'Country', regiao: 'Region', concelho: 'Municipality', portaRegiao: '/en/regions' }],
  ]) {
    const page = await desktopCtx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const cabecas = await page.evaluate(() => Array.from(document.querySelectorAll('[data-cabeca]')).map((el) => el.getAttribute('data-cabeca')));
    const soPais = cabecas.length > 0 && cabecas.every((c) => c === 'pais');
    log('5.primeira-página', `${route} — data-cabeca só "pais", nenhum bloco de região`, soPais ? 'PASS' : 'FAIL',
      `valores encontrados: [${cabecas.join(', ')}]`);

    const comando = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[data-modo]')).map((a) => ({
        modo: a.getAttribute('data-modo'), texto: a.textContent.trim(), href: a.getAttribute('href'),
      }))
    );
    const ordemOk = comando.length === 3 && comando[0].modo === 'pais' && comando[1].modo === 'regiao' && comando[2].modo === 'municipio';
    log('5.primeira-página', `${route} — comando na ordem País·Região·Concelho`, ordemOk ? 'PASS' : 'FAIL', JSON.stringify(comando));
    if (ordemOk) {
      const regiaoEntry = comando[1];
      const textoOk = assertEqual('texto Região', regiaoEntry.texto, labels.regiao);
      const hrefOk = assertEqual('href Região', regiaoEntry.href, labels.portaRegiao);
      log('5.primeira-página', `${route} — «${labels.regiao}» é uma ligação para ${labels.portaRegiao}`, textoOk.ok && hrefOk.ok ? 'PASS' : 'FAIL',
        `texto="${regiaoEntry.texto}" href="${regiaoEntry.href}"`);
    }
    await page.close();
  }

  // =========================================================================
  heading(`6 · ${EXPECTED_REGION_SLUGS.length + 5} cliques reais (${EXPECTED_REGION_SLUGS.length} portas + 5 «Região»/voltar) — era "dez" na corrida 1, com cinco regiões`);
  // =========================================================================
  // Grupo A — uma porta por região (dinâmico: 5 na corrida 1, 9 na corrida 2), na página índice das regiões
  {
    const page = await desktopCtx.newPage();
    for (const slug of EXPECTED_REGION_SLUGS) {
      await page.goto(BASE + '/regioes/', { waitUntil: 'networkidle' });
      const porta = page.locator(`li.conv-linha[data-conv-linha] .conv-nome a[href="/regioes/${slug}"]`).first();
      await porta.click();
      await page.waitForLoadState('networkidle');
      const finalPath = new URL(page.url()).pathname;
      const eq = assertEqual(`porta ${slug}`, finalPath, `/regioes/${slug}/`);
      log('6.clique-porta', `/regioes → clique em "${slug}"`, eq.ok ? 'PASS' : 'FAIL', `chegou a ${finalPath}`);
    }
    await page.close();
  }
  // Grupo B — cinco cliques alternando «Região» (primeira página → /regioes) e "voltar" (wordmark)
  {
    const page = await desktopCtx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const passos = ['Região', 'voltar', 'Região', 'voltar', 'Região'];
    for (let i = 0; i < passos.length; i++) {
      const passo = passos[i];
      if (passo === 'Região') {
        await page.locator('a[data-modo="regiao"]').first().click();
        await page.waitForLoadState('networkidle');
        const finalPath = new URL(page.url()).pathname;
        const eq = assertEqual(`clique ${i + 1}`, finalPath, '/regioes/');
        log('6.clique-região-volta', `clique ${i + 1}/5 — «Região»`, eq.ok ? 'PASS' : 'FAIL', `chegou a ${finalPath}`);
      } else {
        await page.locator('p.wordmark a[href="/"]').first().click();
        await page.waitForLoadState('networkidle');
        const finalPath = new URL(page.url()).pathname;
        const eq = assertEqual(`clique ${i + 1}`, finalPath, '/');
        log('6.clique-região-volta', `clique ${i + 1}/5 — voltar (wordmark)`, eq.ok ? 'PASS' : 'FAIL', `chegou a ${finalPath}`);
      }
    }
    await page.close();
  }

  await desktopCtx.close();
  await phoneCtx.close();
  await chromiumBrowser.close();
  await webkitBrowser.close();

  // =========================================================================
  heading('7 · node scripts/medir-defeitos.mjs — autorreferência e classificação nas rotas de regiões');
  // =========================================================================
  {
    let out = '';
    let exitCode = 0;
    try {
      out = execFileSync('node', ['scripts/medir-defeitos.mjs'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      out = (e.stdout || '') + (e.stderr || '');
      exitCode = e.status ?? 1;
    }
    const plain = out.replace(/\x1b\[[0-9;]*m/g, '');
    const linhas = plain.split('\n');
    const linhasRegioes = linhas.filter((l) => /frases da casa · \/(regioes|en\/regions)\b/.test(l));
    const comAutorreferenciaNaoZero = linhasRegioes.filter((l) => !/autorreferência 0\b/.test(l));
    log('7.medir-defeitos', 'processo terminou', exitCode === 0 ? 'PASS' : 'FAIL', `código de saída ${exitCode}`);
    log('7.medir-defeitos', `linhas "frases da casa" para rotas de regiões encontradas`, linhasRegioes.length > 0 ? 'PASS' : 'FAIL',
      `${linhasRegioes.length} rota(s): ${linhasRegioes.map((l) => l.match(/frases da casa · (\S+)/)?.[1]).join(', ')}`);
    log('7.medir-defeitos', 'autorreferência 0 em todas as rotas de regiões', comAutorreferenciaNaoZero.length === 0 ? 'PASS' : 'FAIL',
      comAutorreferenciaNaoZero.length ? comAutorreferenciaNaoZero.join(' | ') : 'confirmado em todas');
    const falhas = linhas.filter((l) => /✗|FALHA|\bERRO\b/.test(l));
    log('7.medir-defeitos', 'zero marcas de falha (✗/FALHA/ERRO) em todo o relatório', falhas.length === 0 ? 'PASS' : 'FAIL',
      falhas.length ? `${falhas.length} linha(s)` : 'nenhuma');
    const tripwireMatch = plain.match(/tripwire da voz[^\n]*?(\d+)\s*achado\(s\)/);
    log('7.medir-defeitos', 'tripwire da voz — achados não classificados', tripwireMatch && tripwireMatch[1] === '0' ? 'PASS' : 'FAIL',
      tripwireMatch ? tripwireMatch[0].trim() : '(linha "tripwire da voz" não encontrada)');
  }

  // =========================================================================
  heading('RESUMO');
  // =========================================================================
  const total = rows.length;
  const fails = rows.filter((r) => r.status === 'FAIL');
  const passes = rows.filter((r) => r.status === 'PASS');
  console.log(`${total} medições registadas — ${passes.length} OK, ${fails.length} FAIL, autoteste ${selfTestFailed ? 'FALHOU' : 'provado em todos os comparadores'}.`);
  if (fails.length) {
    console.log('\nDesacordos:');
    for (const f of fails) console.log(` - [${f.area}] ${f.id} — ${f.detail}`);
  }
  console.log(`\ntempo total: ${((Date.now() - T0) / 1000).toFixed(1)}s`);

  if (anyFail) process.exitCode = 1;
}

main().catch((e) => {
  if (!selfTestFailed) {
    console.error('ERRO NÃO TRATADO:', e);
    process.exitCode = 3;
  }
});
