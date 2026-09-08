// U7 — a página do concelho (/municipios/evora/): o que o cartão do mapa mostra.
import fs from 'node:fs';
import { abrePagina, BASE } from './lib.mjs';

const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 } });
const resp = await page.goto(BASE + '/municipios/evora/', { waitUntil: 'networkidle' });

const estado = await page.evaluate(() => {
  const fig = document.querySelector('[data-mapa-raiz]');
  const svgAreas = document.querySelector('[data-mapa-areas], [data-mapa-concelhos]');
  const svgPontos = document.querySelector('svg[data-mapa]:not([data-mapa-areas]):not([data-mapa-concelhos])');
  const pontos = document.querySelectorAll('g.mapa-pontos[data-pontos] circle.mun');
  const areasDeConcelho = document.querySelectorAll('g.mapa-areas[data-areas] path.uni');
  const escolhido = document.querySelector('circle.mun-escolhido, path.uni-escolhida');
  return {
    postura: fig ? fig.getAttribute('data-postura') : null,
    nivel: fig ? fig.getAttribute('data-nivel') : null,
    temSvgDeAreas: !!svgAreas,
    temSvgDePontos: !!svgPontos,
    numCirculosDePonto: pontos.length,
    numAreasDeConcelho: areasDeConcelho.length,
    temElementoEscolhido: !!escolhido,
    escolhidoTag: escolhido ? escolhido.tagName : null,
    escolhidoDataM: escolhido ? escolhido.getAttribute('data-m') : null,
    cartaoNome: document.querySelector('.mapa-cartao-nome')?.textContent?.trim() ?? null,
    figureClass: fig ? fig.className : null,
  };
});

console.log('status HTTP:', resp.status());
console.log(JSON.stringify(estado, null, 2));

fs.writeFileSync(new URL('./u7-resultado.json', import.meta.url), JSON.stringify({ status: resp.status(), ...estado }, null, 2));

await browser.close();
