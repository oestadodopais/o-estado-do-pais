// U2 — o nome no lugar fixo: rato, teclado (foco) e toque, nas 29 áreas do
// país e nos 14 concelhos de Évora crescida.
//
// O RATO E O TOQUE APONTAM AO PONTO REPRESENTATIVO, E NÃO AO CENTRO DO BBOX:
// medido a tentar primeiro `locator.hover()` (que mira o centro do
// bounding-box), a Madeira (caixa alta por causa das Selvagens) falhou por
// timeout — o centro geométrico da caixa cai fora do preenchimento do
// caminho, e é o próprio `<svg>` que intercepta o ponteiro ali. Corrigido
// apontando `page.mouse.move`/`page.touchscreen.tap` exactamente ao ponto
// `ponto` do artefacto, transformado para px de ecrã pela CTM do caminho
// (a mesma técnica do U1).
import fs from 'node:fs';
import { abrePagina, BASE, pontosEmEcraNoNavegador } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));
const evora = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/evora.json`, 'utf8'));

async function lerNome(page) {
  return page.locator('[data-mapa-nome-texto]').textContent();
}

async function pontoEcra(page, selector, x, y) {
  const [r] = await page.evaluate(pontosEmEcraNoNavegador, [{ chave: 'x', selector, x, y }]);
  if (r.erro) throw new Error(`pontoEcra: ${r.erro} (${selector})`);
  return { x: r.screenX, y: r.screenY };
}

// ---------------------------------------------------------------- RATO

async function ratoPais(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const out = [];
  for (const u of pais.unidades) {
    const p = await pontoEcra(page, `path.uni[data-unidade="${u.slug}"]`, u.ponto[0], u.ponto[1]);
    await page.mouse.move(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: u.slug, esperado: u.nome, obtido, ok: obtido === u.nome });
  }
  await browser.close();
  return out;
}

async function ratoEvora(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.click('a[data-uni-porta="evora"]');
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const out = [];
  for (const c of evora.concelhos) {
    const p = await pontoEcra(
      page,
      `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`,
      c.ponto[0],
      c.ponto[1],
    );
    await page.mouse.move(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: c.slug, esperado: c.nome, obtido, ok: obtido === c.nome });
  }
  await browser.close();
  return out;
}

// ------------------------------------------------------------- TECLADO

async function teclaPais(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const out = [];
  for (const u of pais.unidades) {
    await page.locator(`a[data-uni-porta="${u.slug}"]`).focus();
    const obtido = await lerNome(page);
    out.push({ slug: u.slug, esperado: u.nome, obtido, ok: obtido === u.nome });
  }
  await browser.close();

  // amostra: 3 primeiras por Tab real (sequência de teclado verdadeira, não .focus() por guião)
  const { browser: b2, page: p2 } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await p2.goto(BASE + '/', { waitUntil: 'networkidle' });
  const porTab = [];
  let achou = false;
  const trilho = [];
  for (let i = 0; i < 250 && !achou; i++) {
    await p2.keyboard.press('Tab');
    const info = await p2.evaluate(() => {
      const a = document.activeElement;
      return a
        ? { tag: a.tagName, cls: a.className || null, texto: (a.textContent || '').trim().slice(0, 40) }
        : null;
    });
    trilho.push(info);
    achou = await p2.evaluate(() => {
      const a = document.activeElement;
      return !!(a && a.matches && a.matches('[data-uni-porta]'));
    });
  }
  if (!achou) console.log('  [teclaPais] Tab real nao chegou ao mapa em 250 tabs; ultimos 10:', JSON.stringify(trilho.slice(-10)));
  for (let i = 0; i < 3 && achou; i++) {
    const slug = await p2.evaluate(() => document.activeElement.getAttribute('data-uni-porta'));
    const obtido = await lerNome(p2);
    const esperado = pais.unidades.find((u) => u.slug === slug)?.nome ?? null;
    porTab.push({ slug, esperado, obtido, ok: obtido === esperado });
    await p2.keyboard.press('Tab');
  }
  await b2.close();
  return { porFoco: out, porTabReal: porTab, achouPorTab: achou };
}

async function teclaEvora(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.click('a[data-uni-porta="evora"]');
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const out = [];
  for (const c of evora.concelhos) {
    await page.locator(`[data-areas-concelhos] a[data-concelho-porta="${c.slug}"]`).focus();
    const obtido = await lerNome(page);
    out.push({ slug: c.slug, esperado: c.nome, obtido, ok: obtido === c.nome });
  }
  await browser.close();
  return out;
}

// --------------------------------------------------------------- TOQUE

async function toquePais(width = 390) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const out = [];
  for (const u of pais.unidades) {
    const p = await pontoEcra(page, `path.uni[data-unidade="${u.slug}"]`, u.ponto[0], u.ponto[1]);
    await page.touchscreen.tap(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: u.slug, esperado: u.nome, obtido, ok: obtido === u.nome });
    // volta ao país para a próxima unidade poder ser tocada: recarrega a
    // página (mais lento que tocar «voltar», mas sem depender do bounding
    // box desse botão nem do estado do histórico entre iterações).
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  }
  await browser.close();
  return out;
}

async function toqueEvora(width = 390) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const p0 = await pontoEcra(page, 'path.uni[data-unidade="evora"]', 4385, 4993);
  await page.touchscreen.tap(p0.x, p0.y);
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const out = [];
  for (const c of evora.concelhos) {
    const p = await pontoEcra(
      page,
      `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`,
      c.ponto[0],
      c.ponto[1],
    );
    await page.touchscreen.tap(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: c.slug, esperado: c.nome, obtido, ok: obtido === c.nome });
  }
  await browser.close();
  return out;
}

function conta(lista) {
  return { total: lista.length, ok: lista.filter((r) => r.ok).length };
}

const t0 = Date.now();
console.log('[U2] rato/pais...');
const rPais = await ratoPais();
console.log('[U2] rato/evora...');
const rEvora = await ratoEvora();
console.log('[U2] teclado/pais...');
const kPais = await teclaPais();
console.log('[U2] teclado/evora...');
const kEvora = await teclaEvora();
console.log('[U2] toque/pais (390, com reset por voltar)...');
const tPais = await toquePais();
console.log('[U2] toque/evora (390)...');
const tEvora = await toqueEvora();
console.log('[U2] tempo total:', ((Date.now() - t0) / 1000).toFixed(1), 's');

console.log('RATO pais  :', JSON.stringify(conta(rPais)));
console.log('RATO evora :', JSON.stringify(conta(rEvora)));
console.log('TECLA pais (foco):', JSON.stringify(conta(kPais.porFoco)));
console.log(
  'TECLA pais (Tab real, amostra 3):',
  JSON.stringify(conta(kPais.porTabReal)),
  JSON.stringify(kPais.porTabReal),
);
console.log('TECLA evora:', JSON.stringify(conta(kEvora)));
console.log('TOQUE pais :', JSON.stringify(conta(tPais)));
console.log('TOQUE evora:', JSON.stringify(conta(tEvora)));

const falhas = [
  ...rPais.filter((r) => !r.ok).map((r) => ({ modo: 'rato-pais', ...r })),
  ...rEvora.filter((r) => !r.ok).map((r) => ({ modo: 'rato-evora', ...r })),
  ...kPais.porFoco.filter((r) => !r.ok).map((r) => ({ modo: 'tecla-pais', ...r })),
  ...kEvora.filter((r) => !r.ok).map((r) => ({ modo: 'tecla-evora', ...r })),
  ...tPais.filter((r) => !r.ok).map((r) => ({ modo: 'toque-pais', ...r })),
  ...tEvora.filter((r) => !r.ok).map((r) => ({ modo: 'toque-evora', ...r })),
];
if (falhas.length) console.log('FALHAS:', JSON.stringify(falhas, null, 2));

fs.writeFileSync(
  new URL('./u2-resultado.json', import.meta.url),
  JSON.stringify({ rPais, rEvora, kPais, kEvora, tPais, tEvora }, null, 2),
);
