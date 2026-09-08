// U2 em inglês (/en/) — o brief pede "conta quantas dão o nome certo, nas
// duas edições": isto completa a varredura completa (29 país + 14 Évora, nos
// três modos) que u2-nome.mjs já fez em português.
import fs from 'node:fs';
import { abrePagina, BASE } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));
const evora = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/evora.json`, 'utf8'));

async function lerNome(page) {
  return page.locator('[data-mapa-nome-texto]').textContent();
}
async function pontoEcra(page, selector, x, y) {
  const [r] = await page.evaluate(
    (alvos) => {
      const path = document.querySelector(alvos[0].selector);
      if (!path) return [{ erro: 'nao encontrado' }];
      const ctm = path.getScreenCTM();
      const p = new DOMPoint(alvos[0].x, alvos[0].y).matrixTransform(ctm);
      return [{ screenX: p.x, screenY: p.y }];
    },
    [{ selector, x, y }],
  );
  if (r.erro) throw new Error(`pontoEcra: ${r.erro} (${selector})`);
  return { x: r.screenX, y: r.screenY };
}

async function ratoPaisEn(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
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

async function ratoEvoraEn(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  await page.click('a[data-uni-porta="evora"]');
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const out = [];
  for (const c of evora.concelhos) {
    const p = await pontoEcra(page, `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`, c.ponto[0], c.ponto[1]);
    await page.mouse.move(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: c.slug, esperado: c.nome, obtido, ok: obtido === c.nome });
  }
  await browser.close();
  return out;
}

async function teclaPaisEn(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  const out = [];
  for (const u of pais.unidades) {
    await page.locator(`a[data-uni-porta="${u.slug}"]`).focus();
    const obtido = await lerNome(page);
    out.push({ slug: u.slug, esperado: u.nome, obtido, ok: obtido === u.nome });
  }
  await browser.close();
  return out;
}

async function teclaEvoraEn(width = 1280) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: false });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
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

async function toquePaisEn(width = 390) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: true });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  const out = [];
  for (const u of pais.unidades) {
    const p = await pontoEcra(page, `path.uni[data-unidade="${u.slug}"]`, u.ponto[0], u.ponto[1]);
    await page.touchscreen.tap(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: u.slug, esperado: u.nome, obtido, ok: obtido === u.nome });
    await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  }
  await browser.close();
  return out;
}

async function toqueEvoraEn(width = 390) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 }, hasTouch: true });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  const p0 = await pontoEcra(page, 'path.uni[data-unidade="evora"]', 4385, 4993);
  await page.touchscreen.tap(p0.x, p0.y);
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const out = [];
  for (const c of evora.concelhos) {
    const p = await pontoEcra(page, `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`, c.ponto[0], c.ponto[1]);
    await page.touchscreen.tap(p.x, p.y);
    const obtido = await lerNome(page);
    out.push({ slug: c.slug, esperado: c.nome, obtido, ok: obtido === c.nome });
  }
  await browser.close();
  return out;
}

function conta(l) {
  return { total: l.length, ok: l.filter((r) => r.ok).length };
}

const t0 = Date.now();
console.log('[U2-en] rato/pais...');
const rPais = await ratoPaisEn();
console.log('[U2-en] rato/evora...');
const rEvora = await ratoEvoraEn();
console.log('[U2-en] teclado/pais...');
const kPais = await teclaPaisEn();
console.log('[U2-en] teclado/evora...');
const kEvora = await teclaEvoraEn();
console.log('[U2-en] toque/pais...');
const tPais = await toquePaisEn();
console.log('[U2-en] toque/evora...');
const tEvora = await toqueEvoraEn();
console.log('[U2-en] tempo total:', ((Date.now() - t0) / 1000).toFixed(1), 's');

console.log('RATO pais(en)  :', JSON.stringify(conta(rPais)));
console.log('RATO evora(en) :', JSON.stringify(conta(rEvora)));
console.log('TECLA pais(en) :', JSON.stringify(conta(kPais)));
console.log('TECLA evora(en):', JSON.stringify(conta(kEvora)));
console.log('TOQUE pais(en) :', JSON.stringify(conta(tPais)));
console.log('TOQUE evora(en):', JSON.stringify(conta(tEvora)));

const falhas = [
  ...rPais.filter((r) => !r.ok).map((r) => ({ modo: 'rato-pais-en', ...r })),
  ...rEvora.filter((r) => !r.ok).map((r) => ({ modo: 'rato-evora-en', ...r })),
  ...kPais.filter((r) => !r.ok).map((r) => ({ modo: 'tecla-pais-en', ...r })),
  ...kEvora.filter((r) => !r.ok).map((r) => ({ modo: 'tecla-evora-en', ...r })),
  ...tPais.filter((r) => !r.ok).map((r) => ({ modo: 'toque-pais-en', ...r })),
  ...tEvora.filter((r) => !r.ok).map((r) => ({ modo: 'toque-evora-en', ...r })),
];
if (falhas.length) console.log('FALHAS:', JSON.stringify(falhas, null, 2));

fs.writeFileSync(
  new URL('./u2-en-resultado.json', import.meta.url),
  JSON.stringify({ rPais, rEvora, kPais, kEvora, tPais, tEvora }, null, 2),
);
