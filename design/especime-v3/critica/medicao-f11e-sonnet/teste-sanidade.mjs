import { abrePagina, BASE, medirAlvosNoNavegador } from './lib.mjs';

const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

const info = await page.evaluate(() => {
  const svg = document.querySelector('svg[data-mapa-areas]');
  const paths = svg ? svg.querySelectorAll('path.uni[data-unidade]') : [];
  return {
    temSvg: !!svg,
    viewBox: svg ? svg.getAttribute('viewBox') : null,
    numPaths: paths.length,
    primeiros: Array.from(paths).slice(0, 3).map((p) => p.getAttribute('data-unidade')),
  };
});
console.log('info:', JSON.stringify(info, null, 2));

// Testa a medição em 3 unidades: uma grande (Beja), uma média (Évora) e uma minúscula (Corvo)
const alvos = [
  { chave: 'beja', selector: 'path.uni[data-unidade="beja"]', x: 4637, y: 5622 },
  { chave: 'evora', selector: 'path.uni[data-unidade="evora"]', x: 4385, y: 4993 },
  { chave: 'ilha-do-corvo', selector: 'path.uni[data-unidade="ilha-do-corvo"]', x: 320, y: 6108 },
];

const resultado = await page.evaluate(medirAlvosNoNavegador, alvos);
console.log('resultado:', JSON.stringify(resultado, null, 2));

await browser.close();
