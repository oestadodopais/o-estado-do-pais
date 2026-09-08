// U4 — sem guião (JavaScript desligado).
import fs from 'node:fs';
import { abrePagina, BASE } from './lib.mjs';

const RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos';
const pais = JSON.parse(fs.readFileSync(`${RAIZ}/mapa/pais.json`, 'utf8'));

// As nove regiões (a lista dita "NUTS II" pela casa), de src/data/regioes.mjs,
// slugs != 'portugal' (que é só a referência, sem página de região).
const SLUGS_REGIOES = [
  'grande-lisboa',
  'peninsula-de-setubal',
  'algarve',
  'madeira',
  'alentejo',
  'norte',
  'centro',
  'oeste-e-vale-do-tejo',
  'acores',
];

const resultados = {};

{
  const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 }, javaScriptEnabled: false });
  await page.goto(BASE + '/', { waitUntil: 'load' });

  const dentroDoMapa = await page.evaluate(() => {
    const fig = document.querySelector('#mapa[data-mapa-raiz]');
    if (!fig) return null;
    const todos = Array.from(fig.querySelectorAll('a[href]')).map((a) => ({
      href: a.getAttribute('href'),
      uniPorta: a.getAttribute('data-uni-porta'),
      concelhoPorta: a.getAttribute('data-concelho-porta'),
      mapaPorta: a.hasAttribute('data-mapa-porta'),
      mapaVoltar: a.hasAttribute('data-mapa-voltar'),
    }));
    return todos;
  });
  resultados.linksDentroDoMapa = dentroDoMapa;

  const portasDeUnidade = dentroDoMapa.filter((a) => a.uniPorta);
  resultados.contagemPortasDeUnidade = portasDeUnidade.length;
  resultados.contagemTotalLinksNoMapa = dentroDoMapa.length;
  resultados.outrosLinksNoMapa = dentroDoMapa.filter((a) => !a.uniPorta);

  // pede cada destino ao servidor local, conta os 200
  const estados = [];
  for (const a of portasDeUnidade) {
    const resp = await fetch(BASE + a.href, { redirect: 'manual' });
    estados.push({ href: a.href, status: resp.status });
  }
  resultados.estadosDosDestinos = estados;
  resultados.contagem200 = estados.filter((e) => e.status === 200).length;

  // a gaveta dos nomes
  const gaveta = await page.evaluate(() => {
    const div = document.querySelector('[data-mapa-ilhas]');
    if (!div) return null;
    const detalhes = div.closest('details');
    const links = Array.from(div.querySelectorAll('a[data-lista-porta]')).map((a) => ({
      slug: a.getAttribute('data-lista-porta'),
      href: a.getAttribute('href'),
      texto: a.textContent.trim(),
    }));
    return {
      dentroDeDetails: !!detalhes,
      detailsAberta: detalhes ? detalhes.open : null,
      numLinks: links.length,
      links,
    };
  });
  resultados.gavetaDosNomes = gaveta;

  // NUTS II: procurar os 9 slugs entre as portas de unidade e a gaveta
  const slugsNoMapa = new Set(portasDeUnidade.map((a) => a.uniPorta));
  const slugsNaGaveta = new Set((gaveta?.links ?? []).map((l) => l.slug));
  const regioesNoMapa = SLUGS_REGIOES.filter((s) => slugsNoMapa.has(s));
  const regioesNaGaveta = SLUGS_REGIOES.filter((s) => slugsNaGaveta.has(s));
  const hrefsParaRegioes = dentroDoMapa
    .concat(gaveta?.links ?? [])
    .filter((a) => a.href && a.href.includes('/regioes/'));
  resultados.nuts2 = {
    slugsProcurados: SLUGS_REGIOES,
    encontradosNoMapa: regioesNoMapa,
    encontradosNaGaveta: regioesNaGaveta,
    hrefsParaRegioes,
  };

  await browser.close();
}

// -------------------------------------------------------------------------
// /#unidade=evora sem guião
// -------------------------------------------------------------------------
{
  const { browser, page } = await abrePagina({ viewport: { width: 1280, height: 1600 }, javaScriptEnabled: false });
  await page.goto(BASE + '/#unidade=evora', { waitUntil: 'load' });
  const estado = await page.evaluate(() => {
    const fig = document.querySelector('#mapa[data-mapa-raiz]');
    const areasPais = document.querySelectorAll('[data-areas] path.uni[data-unidade]');
    const grupoConcelhos = document.querySelector('[data-areas-concelhos]');
    return {
      nivelDoDataset: fig ? fig.getAttribute('data-nivel') : null,
      numAreasPaisVisiveisNoDom: areasPais.length,
      grupoConcelhosExiste: !!grupoConcelhos,
      grupoConcelhosHidden: grupoConcelhos ? grupoConcelhos.hasAttribute('hidden') : null,
      grupoConcelhosFilhos: grupoConcelhos ? grupoConcelhos.children.length : null,
      hash: location.hash,
      pathname: location.pathname,
    };
  });
  resultados.fragmentoUnidadeEvoraSemGuiao = estado;
  await browser.close();
}

console.log(JSON.stringify(resultados, null, 2));
fs.writeFileSync(new URL('./u4-resultado.json', import.meta.url), JSON.stringify(resultados, null, 2));
