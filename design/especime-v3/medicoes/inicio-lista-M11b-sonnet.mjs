#!/usr/bin/env node
/**
 * M11b · a segunda medição do mesmo bloco, depois dos seis consertos.
 * Reaproveita nucleo.mjs (novaPagina, vaiA, medePar, pontoDeEcra, dprDe,
 * arrancaServidor). Compara m11-dist (a cópia antiga, «M11») com m11b-dist
 * (a cópia nova). Nenhuma medição desta ronda pede o sítio no ar.
 *
 *   node medir-b.mjs                    corre tudo
 *   node medir-b.mjs positivos          só os positivos
 *   node medir-b.mjs medicoes           só as medições
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/nunosantos/Instruments/OEstadoDoPais/node_modules/playwright/index.mjs';
import {
  AQUI, LARGURAS, LARGURAS_TELEMOVEL, dprDe, novaPagina, vaiA, medePar, arrancaServidor,
} from './nucleo.mjs';

const PORTA_A = 5057; // m11-dist (a cópia antiga)
const PORTA_B = 5058; // m11b-dist (a cópia nova)
const BASE_A = `http://127.0.0.1:${PORTA_A}`;
const BASE_B = `http://127.0.0.1:${PORTA_B}`;
const ROTA_PREFIXO = { pt: '/distritos/', en: '/en/districts/' };

const SECOES = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const correTudo = SECOES.length === 0;
const corre = (nome) => correTudo || SECOES.includes(nome);

function log(...args) { console.log(...args); }

const resultadosB = {
  gerado_em: new Date().toISOString(),
  positivos_conhecidos: {},
  medicoes: {},
};
{
  const anterior = path.join(AQUI, 'resultados-b.json');
  if (fs.existsSync(anterior)) {
    try {
      const a = JSON.parse(fs.readFileSync(anterior, 'utf8'));
      if (a.positivos_conhecidos) Object.assign(resultadosB.positivos_conhecidos, a.positivos_conhecidos);
      if (a.medicoes) Object.assign(resultadosB.medicoes, a.medicoes);
    } catch (erro) {
      console.error('aviso: não juntei resultados-b.json anterior —', erro.message);
    }
  }
}
function grava() {
  fs.writeFileSync(path.join(AQUI, 'resultados-b.json'), JSON.stringify(resultadosB, null, 2));
}
function registaPositivo(id, passou, esperado, obtido, descricao) {
  resultadosB.positivos_conhecidos[id] = { descricao, esperado, obtido, passou };
  log(`  [${passou ? 'PASSOU' : 'FALHOU'}] ${id} — ${descricao}`);
  log(`           esperado: ${JSON.stringify(esperado)}`);
  log(`           obtido:   ${JSON.stringify(obtido)}`);
}

/* ===========================================================================
 * A COLHEITA PRINCIPAL, por largura
 * ======================================================================== */
async function colheB(page, { prefixoRota }) {
  return page.evaluate(({ prefixoRota }) => {
    function norm(href) {
      try {
        const u = new URL(href, location.href);
        let p = u.pathname;
        if (p.endsWith('/')) p = p.slice(0, -1);
        return p;
      } catch {
        return href;
      }
    }

    // 1 · alvos em duas dimensões + sobreposição
    const nomes = [...document.querySelectorAll('a[data-lista-porta]')].map((a) => {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      const visivel = cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      return { slug: a.getAttribute('data-lista-porta'), w: r.width, h: r.height, visivel, rect: { top: r.top, right: r.right, bottom: r.bottom, left: r.left } };
    });
    const visiveis = nomes.filter((n) => n.visivel);
    let sobrepostos = [];
    for (let i = 0; i < visiveis.length; i++) {
      for (let j = i + 1; j < visiveis.length; j++) {
        const a = visiveis[i].rect, b = visiveis[j].rect;
        const intersecta = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
        if (intersecta) sobrepostos.push([visiveis[i].slug, visiveis[j].slug]);
      }
    }

    // 2 · pontuação (::before/::after) e column-gap por grupo
    const itens = [...document.querySelectorAll('.mapa-ilhas-lista li, .mapa-ilhas-lista a')];
    const pontuacao = itens.map((el) => {
      const antes = getComputedStyle(el, '::before').content;
      const depois = getComputedStyle(el, '::after').content;
      return { tag: el.tagName, antes, depois };
    }).filter((p) => p.antes !== 'none' && p.antes !== '""' && p.antes !== 'normal'
      || p.depois !== 'none' && p.depois !== '""' && p.depois !== 'normal');
    const gaps = [...document.querySelectorAll('.mapa-ilhas-grupo')].map((g) => {
      const ul = g.querySelector('.mapa-ilhas-lista');
      return { parcela: g.getAttribute('data-parcela-lista'), columnGap: ul ? getComputedStyle(ul).columnGap : null };
    });

    // 3 · ordem do documento e visual
    const listaEl = document.querySelector('[data-mapa-ilhas]');
    const figuraEl = document.querySelector('.cabeca-inst') || document.querySelector('figure');
    let ordemDom = null;
    if (listaEl && figuraEl) {
      const rel = listaEl.compareDocumentPosition(figuraEl);
      // Node.DOCUMENT_POSITION_FOLLOWING = 4: figuraEl vem DEPOIS de listaEl
      ordemDom = (rel & 4) ? 'lista_antes_do_mapa' : 'mapa_antes_da_lista';
    }
    const listaRect = listaEl ? listaEl.getBoundingClientRect().toJSON() : null;
    const figuraRect = figuraEl ? figuraEl.getBoundingClientRect().toJSON() : null;
    const ordemCss = {
      lista: listaEl ? getComputedStyle(listaEl).order : null,
      instrumento: figuraEl ? getComputedStyle(figuraEl).order : null,
      col: (() => { const c = document.querySelector('.cabeca-col'); return c ? getComputedStyle(c).order : null; })(),
    };

    // 4 · uma forma só + o atributo velho
    const numListas = document.querySelectorAll('.mapa-ilhas-lista').length;
    const alvoAbaixoDeContagem = document.querySelectorAll('[data-alvo-abaixo-de]').length;

    // familias (reaproveitado do M11, sem o quadrado inscrito)
    const mapa = [...document.querySelectorAll('svg a[href]')]
      .filter((a) => norm(a.getAttribute('href')).startsWith(prefixoRota.slice(0, -1)))
      .map((a) => a.getAttribute('data-uni-porta') || norm(a.getAttribute('href')));
    const lista = [...document.querySelectorAll('a[data-lista-porta]')].map((a) => a.getAttribute('data-lista-porta'));

    return {
      altura: document.documentElement.scrollHeight,
      janela: window.innerWidth,
      nomes,
      minW: visiveis.length ? Math.min(...visiveis.map((n) => n.w)) : null,
      minH: visiveis.length ? Math.min(...visiveis.map((n) => n.h)) : null,
      sobrepostos,
      pontuacao,
      gaps,
      ordemDom,
      listaRect,
      figuraRect,
      ordemCss,
      numListas,
      alvoAbaixoDeContagem,
      familiasTotal: { mapa: mapa.length, lista: lista.length },
    };
  }, { prefixoRota });
}

/* ===========================================================================
 * SECÇÃO A · POSITIVOS CONHECIDOS
 * ======================================================================== */
async function correPositivosB(browser) {
  log('\n=== M11b · POSITIVOS CONHECIDOS ===\n');

  // B-KP1a · largura estreita
  {
    const { ctx, page } = await novaPagina(browser, 768);
    await vaiA(page, `${BASE_B}/__estragos__/alvo-estreito/`);
    const d = await colheB(page, { prefixoRota: ROTA_PREFIXO.pt });
    const beja = d.nomes.find((n) => n.slug === 'beja');
    const passou = !!beja && beja.w < 44 && d.minW < 44;
    registaPositivo('B-KP1a_alvo_estreito', passou, 'Beja com largura < 44px, mínimo da largura da janela < 44', { larguraBeja: beja?.w, minimoW: d.minW }, 'alvo com largura insuficiente (a dimensão que a M11 não testava)');
    await ctx.close();
  }

  // B-KP1b · sobreposição
  {
    const { ctx, page } = await novaPagina(browser, 768);
    await vaiA(page, `${BASE_B}/__estragos__/alvos-sobrepostos/`);
    const d = await colheB(page, { prefixoRota: ROTA_PREFIXO.pt });
    const par = d.sobrepostos.find((p) => p.includes('beja') && p.includes('braga'));
    registaPositivo('B-KP1b_alvos_sobrepostos', !!par, 'o par [beja,braga] aparece na lista de sobreposições', d.sobrepostos, 'dois alvos deslocados para a mesma caixa de ecrã');
    await ctx.close();
  }

  // B-KP2 · pontuação
  {
    const { ctx, page } = await novaPagina(browser, 768);
    await vaiA(page, `${BASE_B}/__estragos__/pontuacao-nos-itens/`);
    const d = await colheB(page, { prefixoRota: ROTA_PREFIXO.pt });
    const passou = d.pontuacao.length > 0;
    registaPositivo('B-KP2_pontuacao', passou, 'pelo menos um item com ::before/::after de conteúdo real', d.pontuacao.slice(0, 3), '::after{content:"."} injectado nos itens da lista');
    await ctx.close();
  }

  // B-KP4 · data-alvo-abaixo-de presente
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE_B}/__estragos__/data-alvo-presente/`);
    const d = await colheB(page, { prefixoRota: ROTA_PREFIXO.pt });
    registaPositivo('B-KP4_atributo_presente', d.alvoAbaixoDeContagem === 1, 1, d.alvoAbaixoDeContagem, 'data-alvo-abaixo-de injectado num grupo (a régua conta 1, não 0)');
    await ctx.close();
  }

  // B-KP5 · ordem do documento, sintético, nos dois sentidos
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE_B}/__estragos__/ordem-lista-primeiro/`);
    const r1 = await page.evaluate(() => {
      const lista = document.querySelector('#lista'), mapa = document.querySelector('#mapa');
      const rel = lista.compareDocumentPosition(mapa);
      return (rel & 4) ? 'lista_antes_do_mapa' : 'mapa_antes_da_lista';
    });
    await ctx.close();
    const { ctx: ctx2, page: page2 } = await novaPagina(browser, 1280);
    await vaiA(page2, `${BASE_B}/__estragos__/ordem-mapa-primeiro/`);
    const r2 = await page2.evaluate(() => {
      const lista = document.querySelector('#lista'), mapa = document.querySelector('#mapa');
      const rel = lista.compareDocumentPosition(mapa);
      return (rel & 4) ? 'lista_antes_do_mapa' : 'mapa_antes_da_lista';
    });
    await ctx2.close();
    const passou = r1 === 'lista_antes_do_mapa' && r2 === 'mapa_antes_da_lista';
    registaPositivo('B-KP5_ordem_documento', passou, ['lista_antes_do_mapa', 'mapa_antes_da_lista'], [r1, r2], 'compareDocumentPosition, testado nos dois sentidos com marcação sintética');
  }

  grava();
}

/* ===========================================================================
 * SECÇÃO B · AS MEDIÇÕES
 * ======================================================================== */
async function medicoesB(browser) {
  log('\n=== M11b · MEDIÇÕES (m11b-dist) ===\n');
  resultadosB.medicoes.novo = { pt: {}, en: {} };

  for (const edicao of ['pt', 'en']) {
    const url = edicao === 'pt' ? `${BASE_B}/` : `${BASE_B}/en/`;
    log(`-- ${edicao} --`);
    for (const largura of LARGURAS) {
      const { ctx, page } = await novaPagina(browser, largura);
      await vaiA(page, url);
      const d = await colheB(page, { prefixoRota: ROTA_PREFIXO[edicao] });
      resultadosB.medicoes.novo[edicao][largura] = d;
      log(`   ${largura}: altura=${d.altura} minW=${d.minW?.toFixed(1)} minH=${d.minH?.toFixed(1)} sobrepostos=${d.sobrepostos.length} pontuacao=${d.pontuacao.length} ordemDom=${d.ordemDom} ordemCss=${JSON.stringify(d.ordemCss)} numListas=${d.numListas} alvoAbaixoDe=${d.alvoAbaixoDeContagem}`);
      await ctx.close();
    }
  }

  // Beja/Faro na cópia ANTIGA (m11-dist, porta A), nas larguras abaixo de 1024
  log('\n-- Beja/Faro na cópia antiga (m11-dist) --');
  resultadosB.medicoes.antigo_beja_faro = {};
  for (const largura of [320, 360, 390, 430, 768]) {
    const { ctx, page } = await novaPagina(browser, largura);
    await vaiA(page, `${BASE_A}/`);
    const d = await page.evaluate(() => {
      const beja = document.querySelector('a[data-lista-porta="beja"]')?.getBoundingClientRect();
      const faro = document.querySelector('a[data-lista-porta="faro"]')?.getBoundingClientRect();
      return {
        beja: beja ? { w: beja.width, h: beja.height } : null,
        faro: faro ? { w: faro.width, h: faro.height } : null,
      };
    });
    resultadosB.medicoes.antigo_beja_faro[largura] = d;
    log(`   ${largura}: beja=${JSON.stringify(d.beja)} faro=${JSON.stringify(d.faro)}`);
    await ctx.close();
  }

  // O par nos 29 pares completos, x2 sentidos x2 modos = 116 casos, pt, a 1280
  log('\n-- o par, as 29 unidades, a 1280, pt --');
  const { ctx, page } = await novaPagina(browser, 1280);
  await vaiA(page, `${BASE_B}/`);
  const slugs = await page.evaluate(() => [...document.querySelectorAll('a[data-lista-porta]')].map((a) => a.getAttribute('data-lista-porta')));
  const pares = {};
  let passaram = 0, total = 0;
  for (const slug of slugs) {
    const r = await medePar(page, slug);
    pares[slug] = r;
    const casos = [
      ['hoverNome', r.hoverNome.areasQueMudaram.length === 1 && r.hoverNome.areasQueMudaram[0] === slug],
      ['focoNome', r.focoNome.areasQueMudaram.length === 1 && r.focoNome.areasQueMudaram[0] === slug],
      ['hoverArea', r.hoverArea && r.hoverArea.nomesQueMudaram.length === 1 && r.hoverArea.nomesQueMudaram[0] === slug],
      ['focoArea', r.focoArea && r.focoArea.nomesQueMudaram.length === 1 && r.focoArea.nomesQueMudaram[0] === slug],
    ];
    for (const [, ok] of casos) { total++; if (ok) passaram++; }
  }
  resultadosB.medicoes.par29 = { totalUnidades: slugs.length, totalCasos: total, casosCertos: passaram, detalhe: pares };
  log(`   ${slugs.length} unidades × 4 casos = ${total} casos; certos: ${passaram}`);
  await ctx.close();

  grava();
}

/* ===========================================================================
 * MAIN
 * ======================================================================== */
(async () => {
  await arrancaServidor(PORTA_A); // m11-dist + estragos (M11), para Beja/Faro na cópia antiga
  await arrancaServidor(PORTA_B, { raizDist: 'm11b-dist', raizEstragos: 'estragos-b' });
  log(`servidores em ${BASE_A} (antigo) e ${BASE_B} (novo)`);

  const browser = await chromium.launch();
  try {
    if (corre('positivos')) await correPositivosB(browser);
    if (corre('medicoes')) await medicoesB(browser);
  } finally {
    await browser.close();
  }
  grava();
  log('\nresultados-b.json escrito.');
  process.exit(0);
})();
