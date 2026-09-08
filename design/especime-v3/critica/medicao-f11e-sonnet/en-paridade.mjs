// Paridade da edição inglesa (/en/): o bloco cobre as duas edições, e as
// medidas U1-U7 foram feitas na edição portuguesa; este é um confronto por
// amostragem da inglesa, e não uma segunda varredura completa.
import fs from 'node:fs';
import { abrePagina, BASE, pontosEmEcraNoNavegador } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));
const evora = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/distritos/evora.json`, 'utf8'));

const resultados = {};

// 1) /en/ com guião: 29 áreas, aria-label, nomes iguais aos da Carta (não traduzidos)
{
  const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 } });
  await page.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const svg = document.querySelector('svg[data-mapa-areas]');
    const paths = svg ? Array.from(svg.querySelectorAll('path.uni[data-unidade]')) : [];
    return {
      numAreas: paths.length,
      ariaLabel: svg ? svg.getAttribute('aria-label') : null,
      nomes: paths.slice(0, 5).map((p) => ({ slug: p.getAttribute('data-unidade'), nome: p.getAttribute('data-u') })),
    };
  });
  resultados.homeEn = info;

  // hover num par de unidades, incluindo uma ilha
  const out = [];
  for (const slug of ['evora', 'faro', 'ilha-de-sao-miguel']) {
    const u = pais.unidades.find((x) => x.slug === slug);
    const [pt] = await page.evaluate(pontosEmEcraNoNavegador, [
      { chave: slug, selector: `path.uni[data-unidade="${slug}"]`, x: u.ponto[0], y: u.ponto[1] },
    ]);
    await page.mouse.move(pt.screenX, pt.screenY);
    const texto = await page.locator('[data-mapa-nome-texto]').textContent();
    out.push({ slug, esperado: u.nome, obtido: texto, ok: texto === u.nome });
  }
  resultados.hoverAmostraEn = out;

  // cresce Évora em EN, confirma nomes dos concelhos e o href da porta «Open»
  const uEvora = pais.unidades.find((x) => x.slug === 'evora');
  const [ptEvora] = await page.evaluate(pontosEmEcraNoNavegador, [
    { chave: 'evora', selector: 'path.uni[data-unidade="evora"]', x: uEvora.ponto[0], y: uEvora.ponto[1] },
  ]);
  await page.mouse.click(ptEvora.screenX, ptEvora.screenY);
  await page.waitForFunction(() => {
    const g = document.querySelector('[data-areas-concelhos]');
    return g && !g.hasAttribute('hidden') && g.querySelector('path.uni[data-unidade]');
  });
  const portaHref = await page.locator('[data-mapa-porta]').getAttribute('href');
  const portaTexto = await page.locator('[data-mapa-porta]').textContent();
  const concelhosEn = await page.evaluate(() => {
    const g = document.querySelector('[data-areas-concelhos]');
    return Array.from(g.querySelectorAll('path.uni[data-unidade]')).map((p) => ({
      slug: p.getAttribute('data-unidade'),
      nome: p.getAttribute('data-u'),
    }));
  });
  resultados.evoraCrescidaEn = {
    numConcelhos: concelhosEn.length,
    portaHref,
    portaTexto,
    hrefEsperadoComecaCom: '/en/districts/evora',
    hrefOk: (portaHref || '').startsWith('/en/districts/evora'),
    amostraNomes: concelhosEn.slice(0, 3),
    nomesBatemComPt: concelhosEn.every((c) => {
      const cPt = evora.concelhos.find((x) => x.slug === c.slug);
      return cPt && cPt.nome === c.nome;
    }),
  };
  await browser.close();
}

// 2) /en/ sem guião: contagem de ligações e destinos
{
  const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 }, javaScriptEnabled: false });
  await page.goto(BASE + '/en/', { waitUntil: 'load' });
  const links = await page.evaluate(() => {
    const fig = document.querySelector('#mapa[data-mapa-raiz]');
    return fig
      ? Array.from(fig.querySelectorAll('a[data-uni-porta]')).map((a) => a.getAttribute('href'))
      : [];
  });
  const estados = [];
  for (const href of links) {
    const resp = await fetch(BASE + href, { redirect: 'manual' });
    estados.push({ href, status: resp.status });
  }
  const gaveta = await page.evaluate(() => {
    const div = document.querySelector('[data-mapa-ilhas]');
    return div ? div.querySelectorAll('a[data-lista-porta]').length : 0;
  });
  resultados.semGuiaoEn = {
    numLinks: links.length,
    contagem200: estados.filter((e) => e.status === 200).length,
    naoOk: estados.filter((e) => e.status !== 200),
    numNaGaveta: gaveta,
  };
  await browser.close();
}

// 3) página do concelho em inglês
{
  const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 } });
  const resp = await page.goto(BASE + '/en/municipalities/evora/', { waitUntil: 'networkidle' });
  const estado = await page.evaluate(() => {
    const fig = document.querySelector('[data-mapa-raiz]');
    const pontos = document.querySelectorAll('g.mapa-pontos[data-pontos] circle.mun');
    return {
      postura: fig ? fig.getAttribute('data-postura') : null,
      numCirculos: pontos.length,
      cartaoNome: document.querySelector('.mapa-cartao-nome')?.textContent?.trim() ?? null,
    };
  });
  resultados.paginaConcelhoEn = { status: resp.status(), ...estado };
  await browser.close();
}

console.log(JSON.stringify(resultados, null, 2));
fs.writeFileSync(new URL('./en-paridade-resultado.json', import.meta.url), JSON.stringify(resultados, null, 2));
