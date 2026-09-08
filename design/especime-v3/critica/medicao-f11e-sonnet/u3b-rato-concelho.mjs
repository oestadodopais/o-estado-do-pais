// U3 (bónus) — um clique de RATO (não toque) num concelho: o código sugere
// que navega logo ao primeiro clique, sem o passo intermédio "diz o nome" que
// o toque tem (o hover já mostrou o nome antes do clique).
import fs from 'node:fs';
import { abrePagina, BASE, pontosEmEcraNoNavegador } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const evora = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/evora.json`, 'utf8'));

const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1200 }, hasTouch: false });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const p0 = await page.evaluate(pontosEmEcraNoNavegador, [
  { chave: 'evora', selector: 'path.uni[data-unidade="evora"]', x: 4385, y: 4993 },
]);
await page.mouse.click(p0[0].screenX, p0[0].screenY);
await page.waitForSelector('[data-areas-concelhos] path.uni[data-unidade]');

const c = evora.concelhos.find((x) => x.slug === 'evora');
const [pt] = await page.evaluate(pontosEmEcraNoNavegador, [
  { chave: 'evora-concelho', selector: `[data-areas-concelhos] path.uni[data-unidade="evora"]`, x: c.ponto[0], y: c.ponto[1] },
]);

const antes = await page.evaluate(() => location.pathname);
await page.mouse.move(pt.screenX, pt.screenY); // hover primeiro, como um rato real faria
const nomeAoPassar = await page.locator('[data-mapa-nome-texto]').textContent();
await Promise.all([
  page.waitForURL(/\/municipios\/evora/, { timeout: 5000 }).catch(() => null),
  page.mouse.click(pt.screenX, pt.screenY),
]);
await page.waitForLoadState('networkidle').catch(() => {});
const depois = await page.evaluate(() => location.pathname);

const resultado = {
  antes,
  nomeAoPassarORato: nomeAoPassar,
  depoisDoPrimeiroClique: depois,
  navegouNoPrimeiroClique: depois !== antes && /\/municipios\/evora/.test(depois),
};
console.log(JSON.stringify(resultado, null, 2));
fs.writeFileSync(new URL('./u3b-resultado.json', import.meta.url), JSON.stringify(resultado, null, 2));
await browser.close();
