// As molduras das ilhas: caixas (bbox em px de ecrã) da Madeira e dos Açores,
// no nível do país, a 390 e a 1280, e se se sobrepõem.
import fs from 'node:fs';
import { abrePagina, BASE } from './lib.mjs';

async function medir(width) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const caixas = await page.evaluate(() => {
    const madeira = document.querySelector('rect.mapa-moldura[data-moldura="Madeira"]');
    const acores = document.querySelector('rect.mapa-moldura[data-moldura="Açores"]');
    const bb = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    return { madeira: bb(madeira), acores: bb(acores) };
  });
  await browser.close();
  return caixas;
}

function sobreposicao(a, b) {
  if (!a || !b) return null;
  const x0 = Math.max(a.x, b.x);
  const y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.right, b.right);
  const y1 = Math.min(a.bottom, b.bottom);
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  return { sobrepoe: w > 0 && h > 0, largura: w, altura: h, area: w * h };
}

const r390 = await medir(390);
const r1280 = await medir(1280);

const resultado = {
  390: { ...r390, sobreposicao: sobreposicao(r390.madeira, r390.acores) },
  1280: { ...r1280, sobreposicao: sobreposicao(r1280.madeira, r1280.acores) },
};

console.log(JSON.stringify(resultado, null, 2));
fs.writeFileSync(new URL('./u-molduras-resultado.json', import.meta.url), JSON.stringify(resultado, null, 2));
