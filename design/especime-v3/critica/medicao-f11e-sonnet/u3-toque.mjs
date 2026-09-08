// U3 — o primeiro toque nunca navega.
import fs from 'node:fs';
import { abrePagina, BASE, pontosEmEcraNoNavegador } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));
const evora = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/evora.json`, 'utf8'));

async function pontoEcra(page, selector, x, y) {
  const [r] = await page.evaluate(pontosEmEcraNoNavegador, [{ chave: 'x', selector, x, y }]);
  if (r.erro) throw new Error(`pontoEcra: ${r.erro} (${selector})`);
  return { x: r.screenX, y: r.screenY };
}

const resultados = {};

// -------------------------------------------------------------------------
// 1) um toque numa unidade não muda location.pathname
// -------------------------------------------------------------------------
{
  const { browser, page } = await abrePagina({ viewport: { width: 390, height: 1200 }, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const antes = await page.evaluate(() => location.pathname);
  const u = pais.unidades.find((x) => x.slug === 'aveiro');
  const p = await pontoEcra(page, 'path.uni[data-unidade="aveiro"]', u.ponto[0], u.ponto[1]);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const depois = await page.evaluate(() => ({ pathname: location.pathname, hash: location.hash }));
  resultados.toqueNaUnidade = { antes, depois, ok: antes === depois.pathname };
  await browser.close();
}

// -------------------------------------------------------------------------
// 2) um toque num concelho de Évora crescida diz o nome e não navega
// 3) o segundo toque no MESMO concelho navega para a página dele
// -------------------------------------------------------------------------
{
  const { browser, page } = await abrePagina({ viewport: { width: 390, height: 1200 }, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const p0 = await pontoEcra(page, 'path.uni[data-unidade="evora"]', 4385, 4993);
  await page.touchscreen.tap(p0.x, p0.y);
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');

  const c = evora.concelhos.find((x) => x.slug === 'evora'); // o concelho de Évora dentro do distrito
  const antesPathnameSel = 'path.uni[data-unidade="evora"]';
  const alvoSel = `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`;
  const p1 = await pontoEcra(page, alvoSel, c.ponto[0], c.ponto[1]);

  const antes1 = await page.evaluate(() => location.pathname);
  await page.touchscreen.tap(p1.x, p1.y);
  const nomeApos1Toque = await page.locator('[data-mapa-nome-texto]').textContent();
  const depois1 = await page.evaluate(() => location.pathname);

  // segundo toque no MESMO concelho: deve navegar
  await Promise.all([
    page.waitForURL(/\/municipios\/evora/, { timeout: 5000 }).catch(() => null),
    page.touchscreen.tap(p1.x, p1.y),
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
  const depois2 = await page.evaluate(() => location.pathname);

  resultados.toqueDuploNoConcelho = {
    antesDoPrimeiroToque: antes1,
    depoisDoPrimeiroToque: { pathname: depois1, nome: nomeApos1Toque },
    primeiroTequeNaoNavegou: antes1 === depois1,
    nomeCorreto: nomeApos1Toque === c.nome,
    depoisDoSegundoToque: depois2,
    segundoToqueNavegou: depois2 !== depois1 && /\/municipios\/evora/.test(depois2),
  };
  await browser.close();
}

// -------------------------------------------------------------------------
// 4) a porta «Abrir →» navega para a página da unidade
// -------------------------------------------------------------------------
{
  const { browser, page } = await abrePagina({ viewport: { width: 390, height: 1200 }, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const u = pais.unidades.find((x) => x.slug === 'evora');
  const p = await pontoEcra(page, 'path.uni[data-unidade="evora"]', u.ponto[0], u.ponto[1]);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');
  const antes = await page.evaluate(() => location.pathname);
  const portaHref = await page.locator('[data-mapa-porta]').getAttribute('href');
  const box = await page.locator('[data-mapa-porta]').boundingBox();
  await Promise.all([
    page.waitForURL(/\/distritos\/evora/, { timeout: 5000 }).catch(() => null),
    page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2),
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
  const depois = await page.evaluate(() => location.pathname);
  resultados.portaAbrir = {
    antes,
    hrefDaPorta: portaHref,
    depois,
    navegouParaDistritoEvora: /\/distritos\/evora/.test(depois),
  };
  await browser.close();
}

console.log(JSON.stringify(resultados, null, 2));
fs.writeFileSync(new URL('./u3-resultado.json', import.meta.url), JSON.stringify(resultados, null, 2));
