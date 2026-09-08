// U1 (bónus) — o mesmo alvo do quadrado inscrito para os concelhos de Braga e
// do Porto, crescidos a partir do mapa do país, a 390px.
import fs from 'node:fs';
import { abrePagina, BASE, medirAlvosNoNavegador, pontosEmEcraNoNavegador, mediana } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));

async function medirUnidadeCrescida(slugUnidade, width) {
  const dados = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/${slugUnidade}.json`, 'utf8'));
  const { browser, page } = await abrePagina({ viewport: { width, height: 1600 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // clica no PONTO REPRESENTATIVO da unidade (não no centro do bbox: a mesma
  // razão do U2 — o centro do bbox pode cair fora do preenchimento em formas
  // irregulares, e o próprio <svg> intercepta o ponteiro aí).
  const u = pais.unidades.find((x) => x.slug === slugUnidade);
  const [pt] = await page.evaluate(pontosEmEcraNoNavegador, [
    { chave: slugUnidade, selector: `path.uni[data-unidade="${slugUnidade}"]`, x: u.ponto[0], y: u.ponto[1] },
  ]);
  await page.mouse.click(pt.screenX, pt.screenY);
  await page.waitForFunction(
    () => {
      const g = document.querySelector('[data-areas-concelhos]');
      return g && !g.hasAttribute('hidden') && g.querySelector('path.uni[data-unidade]');
    },
    null,
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
  return { unidade: slugDados(dados), numConcelhos: dados.concelhos.length, resultado };
}

function slugDados(dados) {
  return dados.unidade;
}

function resumo(rs) {
  const validos = rs.filter((r) => typeof r.lado === 'number');
  const lados = validos.map((r) => r.lado);
  const abaixo44 = lados.filter((l) => l < 44).length;
  return { n: lados.length, abaixo44, mediana: mediana(lados), min: Math.min(...lados), max: Math.max(...lados) };
}

const t0 = Date.now();
const braga = await medirUnidadeCrescida('braga', 390);
const porto = await medirUnidadeCrescida('porto', 390);
console.log('tempo:', ((Date.now() - t0) / 1000).toFixed(1), 's');
console.log('BRAGA', braga.unidade, 'n concelhos:', braga.numConcelhos, JSON.stringify(resumo(braga.resultado)));
console.log('PORTO', porto.unidade, 'n concelhos:', porto.numConcelhos, JSON.stringify(resumo(porto.resultado)));

fs.writeFileSync(new URL('./u1b-resultado.json', import.meta.url), JSON.stringify({ braga, porto }, null, 2));
