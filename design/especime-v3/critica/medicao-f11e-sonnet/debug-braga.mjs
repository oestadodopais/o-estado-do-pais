import { abrePagina, BASE, pontosEmEcraNoNavegador } from './lib.mjs';

const { browser, page } = await abrePagina({ viewport: { width: 390, height: 1600 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const info = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('path.uni[data-unidade]')).map((p) =>
    p.getAttribute('data-unidade'),
  );
  return { total: els.length, temBraga: els.includes('braga'), amostra: els.slice(0, 5), els };
});
console.log(JSON.stringify(info, null, 2));
const r = await page.evaluate(pontosEmEcraNoNavegador, [
  { chave: 'braga', selector: 'path.uni[data-unidade="braga"]', x: 4050, y: 1257 },
]);
console.log(JSON.stringify(r));
await browser.close();
