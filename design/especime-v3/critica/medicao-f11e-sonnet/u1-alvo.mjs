// U1 — o alvo de cada área: o lado do maior quadrado (grelha de 2px, 9 âncoras
// em torno do ponto representativo) que cabe dentro da área e contém o ponto.
// Ponto usado: o campo `ponto` do artefacto (mapa/pais.json e
// mapa/distritos/<slug>.json) — o ponto representativo que o motor escreveu,
// e não o centróide do bbox (que pode cair fora de uma forma côncava).
import fs from 'node:fs';
import { abrePagina, BASE, medirAlvosNoNavegador, mediana } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));

async function medirPais(width) {
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const alvos = pais.unidades.map((u) => ({
    chave: u.slug,
    selector: `path.uni[data-unidade="${u.slug}"]`,
    x: u.ponto[0],
    y: u.ponto[1],
  }));
  const resultado = await page.evaluate(medirAlvosNoNavegador, alvos);
  await browser.close();
  return resultado;
}

async function medirUnidadeCrescida(slugUnidade, width) {
  const dados = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/${slugUnidade}.json`, 'utf8'));
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.click(`a[data-uni-porta="${slugUnidade}"]`);
  await page.waitForFunction(
    (slug) => {
      const g = document.querySelector('[data-areas-concelhos]');
      return g && !g.hasAttribute('hidden') && g.querySelector('path.uni[data-unidade]');
    },
    slugUnidade,
    { timeout: 10000 },
  );
  const alvos = dados.concelhos.map((c) => ({
    chave: c.slug,
    selector: `[data-areas-concelhos] path.uni[data-unidade="${c.slug}"]`,
    x: c.ponto[0],
    y: c.ponto[1],
  }));
  const resultado = await page.evaluate(medirAlvosNoNavegador, alvos);
  await browser.close();
  return resultado;
}

function resumo(rs) {
  const validos = rs.filter((r) => typeof r.lado === 'number');
  const erros = rs.filter((r) => typeof r.lado !== 'number');
  const lados = validos.map((r) => r.lado);
  const abaixo44 = lados.filter((l) => l < 44).length;
  return { n: lados.length, abaixo44, mediana: mediana(lados), erros: erros.length };
}

const t0 = Date.now();
console.log('[U1] a medir pais a 390...');
const pais390 = await medirPais(390);
console.log('[U1] a medir pais a 1280...');
const pais1280 = await medirPais(1280);
console.log('[U1] a crescer Évora e medir os 14 concelhos a 390...');
const evora390 = await medirUnidadeCrescida('evora', 390);

console.log('[U1] tempo:', ((Date.now() - t0) / 1000).toFixed(1), 's');
console.log('PAIS 390  :', JSON.stringify(resumo(pais390)));
console.log('PAIS 1280 :', JSON.stringify(resumo(pais1280)));
console.log('EVORA 390 :', JSON.stringify(resumo(evora390)));

fs.writeFileSync(
  new URL('./u1-resultado.json', import.meta.url),
  JSON.stringify({ pais390, pais1280, evora390 }, null, 2),
);
