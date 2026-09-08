// U5 — a altura da página, em repouso, a 390px de largura.
import fs from 'node:fs';
import { abrePagina, BASE } from './lib.mjs';

const FAMILIAS = ['Spectral', 'Bitter', 'Spectral SC']; // src/styles/tokens.css: --f-prosa, --f-instr, --f-versal

const { browser, page } = await abrePagina({ viewport: { width: 390, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

// espera pelas fontes explicitamente (document.fonts.ready), e só depois mede
const fontesAntes = await page.evaluate(() => document.fonts.status);
await page.evaluate(async () => {
  try {
    await document.fonts.ready;
  } catch (e) {
    /* ignora */
  }
});
// uma segunda passagem por 'networkidle' para deixar qualquer reflow assentar
await page.waitForLoadState('networkidle');

const medidas = await page.evaluate((familias) => {
  const check = {};
  for (const f of familias) check[f] = document.fonts.check(`16px "${f}"`);
  return {
    scrollHeight: document.documentElement.scrollHeight,
    fontsStatus: document.fonts.status,
    fontsSize: document.fonts.size,
    checkPorFamilia: check,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
  };
}, FAMILIAS);

console.log('fontsStatus (antes de fonts.ready):', fontesAntes);
console.log(JSON.stringify(medidas, null, 2));

fs.writeFileSync(
  new URL('./u5-resultado.json', import.meta.url),
  JSON.stringify({ fontsStatusAntes: fontesAntes, ...medidas }, null, 2),
);

await browser.close();
