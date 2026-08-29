#!/usr/bin/env node
/**
 * =============================================================================
 * M11 · nucleo.mjs — as funções partilhadas da medição cega do bloco «os
 * nomes do mapa ao lado, e os dois painéis com nome». O ponto de entrada é
 * `medir.mjs`, na mesma pasta; este ficheiro não corre sozinho.
 * =============================================================================
 * Código da medidora (Claude Sonnet), independente do construtor. Lê
 * BRIEF-M11.md e RELATORIO-CONSTRUTOR.md na pasta ao lado; não corre nada no
 * repositório principal nem em nenhum worktree; só IMPORTA o Playwright de lá.
 *
 * O algoritmo QUADRADO_INSCRITO (medição 6) é uma cópia literal, creditada, de
 * `tests/inicio/mapa-distritos.mjs` do repositório principal (I82), lida em
 * 29.08.2026 no commit `5b4fc7f` (idêntica ao que está em HEAD, `a76f829`: 0
 * linhas de diferença, confirmado com `diff` antes de escrever este ficheiro).
 * Os pontos representativos vêm de `mapa/pais.json`, também idêntico nos dois
 * commits (confirmado com `diff`).
 * ---------------------------------------------------------------------------
 */
import { chromium } from '/Users/nunosantos/Instruments/OEstadoDoPais/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { arrancaServidor } from './servidor.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PORTA = 5057;
const BASE = `http://127.0.0.1:${PORTA}`;
const ANTES_URL = { pt: 'https://xn--oestadodopas-2fb.pt/', en: 'https://xn--oestadodopas-2fb.pt/en/' };
const ROTA_PREFIXO = { pt: '/distritos/', en: '/en/districts/' };

const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const LARGURAS_TELEMOVEL = [320, 360, 390, 430];
function dprDe(largura) {
  return LARGURAS_TELEMOVEL.includes(largura) ? 3 : 2;
}

/* ---------------------------------------------------------------------------
 * NOTA METODOLÓGICA, MEDIDA E NÃO SUPOSTA: o «como telemóvel» do brief.
 * Testei três receitas contra o número do construtor para a altura da página
 * pt a 320 depois (7 697 px): com `isMobile:true,hasTouch:true` e DPR 3 saem
 * 7 787 px; sem `isMobile`/`hasTouch`, só com a largura e o DPR, saem 7 697 —
 * bate certo. A causa está na folha: `grep` a `_astro/Base.*.css` mostra três
 * regras `@media (pointer:coarse)`, que é exactamente o que `hasTouch` liga, e
 * que acrescentam espaço alheio a este bloco. Por isso todas as larguras desta
 * medição usam `deviceScaleFactor` conforme o brief (3 nas quatro primeiras, 2
 * nas outras) mas SEM `isMobile`/`hasTouch`, para não confundir o bloco medido
 * com uma regra de outro sítio da folha. Fica registado nos resultados.
 * ------------------------------------------------------------------------- */

const resultados = {
  gerado_em: new Date().toISOString(),
  metodo: {
    larguras: LARGURAS,
    dpr_por_largura: Object.fromEntries(LARGURAS.map((l) => [l, dprDe(l)])),
    nota_ismobile: 'sem isMobile/hasTouch do Playwright — ver comentário no código; confirmado por grep que a folha base tem @media(pointer:coarse) que acrescenta ~90px alheios ao bloco a 320px quando hasTouch:true',
    servidor_local: BASE,
    antes_url: ANTES_URL,
    rota_prefixo: ROTA_PREFIXO,
  },
  positivos_conhecidos: {},
  medicoes: {},
  custo: {},
};

/* Persistência entre corridas: uma secção (positivos/depois/antes) corre em
 * separado do resto, mas o ficheiro final tem de ter as três juntas. Em vez
 * de as juntar à mão, o resultados.json que já existe é lido aqui e usado
 * como base — cada secção só reescreve a SUA própria chave de primeiro nível
 * dentro de `medicoes`, por isso uma corrida de «depois» nunca apaga o
 * «antes» já medido ao vivo. Isto é o que evita bater outra vez no sítio no
 * ar só para juntar ficheiros. */
{
  const ficheiroAnterior = path.join(AQUI, 'resultados.json');
  if (fs.existsSync(ficheiroAnterior)) {
    try {
      const anterior = JSON.parse(fs.readFileSync(ficheiroAnterior, 'utf8'));
      if (anterior.positivos_conhecidos) Object.assign(resultados.positivos_conhecidos, anterior.positivos_conhecidos);
      if (anterior.medicoes) Object.assign(resultados.medicoes, anterior.medicoes);
      if (anterior.custo) Object.assign(resultados.custo, anterior.custo);
    } catch (erro) {
      console.error('aviso: não consegui juntar o resultados.json anterior —', erro.message);
    }
  }
}

let TOKENS_INICIO = null;

function log(...args) {
  console.log(...args);
}

function registaPositivo(id, passou, esperado, obtido, descricao) {
  resultados.positivos_conhecidos[id] = { descricao, esperado, obtido, passou };
  log(`  [${passou ? 'PASSOU' : 'FALHOU'}] ${id} — ${descricao}`);
  log(`           esperado: ${JSON.stringify(esperado)}`);
  log(`           obtido:   ${JSON.stringify(obtido)}`);
}

function grava() {
  fs.writeFileSync(path.join(AQUI, 'resultados.json'), JSON.stringify(resultados, null, 2));
}

/* ===========================================================================
 * FUNÇÕES PARTILHADAS — as mesmas usadas nos positivos conhecidos e nas
 * medições verdadeiras. Nenhuma lógica separada para «testar» e para «medir».
 * ======================================================================== */

/** Cópia literal de QUADRADO_INSCRITO em tests/inicio/mapa-distritos.mjs (I82). */
const QUADRADO_INSCRITO = ({ pontos, PASSO }) => {
  const svg = document.querySelector('[data-mapa-areas]');
  const inv = svg.getScreenCTM().inverse();
  const p0 = new DOMPoint(0, 0).matrixTransform(inv);
  const p1 = new DOMPoint(1, 0).matrixTransform(inv);
  const u = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const passo = PASSO * u;
  return Object.fromEntries(
    [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
      const slug = el.getAttribute('data-unidade');
      const bb = el.getBBox();
      const [px, py] = pontos[slug];
      const x0 = px - Math.ceil((px - bb.x) / passo) * passo;
      const y0 = py - Math.ceil((py - bb.y) / passo) * passo;
      const cols = Math.ceil((bb.x + bb.width - x0) / passo) + 1;
      const rows = Math.ceil((bb.y + bb.height - y0) / passo) + 1;
      const dentro = [];
      for (let r = 0; r < rows; r++) {
        const linha = new Uint8Array(cols);
        for (let c = 0; c < cols; c++) {
          linha[c] = el.isPointInFill(new DOMPoint(x0 + c * passo, y0 + r * passo)) ? 1 : 0;
        }
        dentro.push(linha);
      }
      const ic = Math.round((px - x0) / passo);
      const ir = Math.round((py - y0) / passo);
      const dp = dentro.map((l) => new Int32Array(l.length));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!dentro[r][c]) { dp[r][c] = 0; continue; }
          dp[r][c] = r === 0 || c === 0 ? 1 : 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
        }
      }
      let contem = 0;
      for (let r = ir; r < rows; r++) {
        for (let c = ic; c < cols; c++) {
          const k = dp[r][c];
          if (k <= contem) continue;
          if (r - k + 1 <= ir && c - k + 1 <= ic) contem = k;
        }
      }
      return [slug, { dentro: !!dentro[ir]?.[ic], inscrito: Math.max(0, (contem - 1) * PASSO) }];
    }),
  );
};

/** Fórmula de contraste da WCAG 2.x, validada contra valores de manual (ver positivos). */
function relLum(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contraste(hexA, hexB) {
  const L1 = relLum(hexA), L2 = relLum(hexB);
  const [claro, escuro] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (claro + 0.05) / (escuro + 0.05);
}

/* A extração das duas famílias de ligações (mapa e lista) corre SÓ dentro do
 * navegador — vai inline dentro de `colhe()`, porque uma função passada a
 * `page.evaluate` tem de ser independente (sem fechar sobre nada de fora), e
 * por isso não há aqui uma cópia «de fora» dela: seria código morto, nunca
 * chamado, e um código morto que ninguém corre não é um positivo conhecido de
 * nada. */

/** A colheita de tudo o que depende só da largura, numa página já carregada. */
async function colhe(page, { largura, medirQuadrado, prefixoRota }) {
  const base = await page.evaluate(
    ({ prefixoRota }) => {
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
      const altura = document.documentElement.scrollHeight;
      const nomes = [...document.querySelectorAll('a[data-lista-porta]')].map((a) => {
        const r = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const visivel = cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
        return { slug: a.getAttribute('data-lista-porta'), altura: r.height, largura: r.width, visivel };
      });
      const grupos = [...document.querySelectorAll('.mapa-ilhas-grupo')].map((g) => {
        const cs = getComputedStyle(g);
        const r = g.getBoundingClientRect();
        return {
          parcela: g.getAttribute('data-parcela-lista'),
          alvoAbaixoDe: g.getAttribute('data-alvo-abaixo-de'),
          visivel: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0,
        };
      });
      let grelha = null;
      const g = document.querySelector('.cabeca-grelha');
      if (g) {
        const gr = g.getBoundingClientRect();
        const col = document.querySelector('.cabeca-col');
        const listaEl = document.querySelector('[data-mapa-ilhas]');
        const tela = document.querySelector('.mapa-tela');
        const figura = document.querySelector('.cabeca-inst figure, figure.mapa') || document.querySelector('.cabeca-inst');
        grelha = {
          alturaGrelha: gr.height,
          grelhaTop: gr.top,
          grelhaBottom: gr.bottom,
          cabecaColRect: col ? col.getBoundingClientRect().toJSON() : null,
          listaRect: listaEl ? listaEl.getBoundingClientRect().toJSON() : null,
          listaEhFilhaDiretaDaGrelha: listaEl ? listaEl.parentElement === g : null,
          telaRect: tela ? tela.getBoundingClientRect().toJSON() : null,
          figuraRect: figura ? figura.getBoundingClientRect().toJSON() : null,
        };
      }
      return {
        altura,
        familias: (function () {
          const mapa = [...document.querySelectorAll('svg a[href]')]
            .filter((a) => norm(a.getAttribute('href')).startsWith(prefixoRota.slice(0, -1)))
            .map((a) => a.getAttribute('data-uni-porta') || norm(a.getAttribute('href')));
          const lista = [...document.querySelectorAll('a[data-lista-porta]')].map((a) => a.getAttribute('data-lista-porta'));
          const conta = (arr) => {
            const contagem = new Map();
            for (const s of arr) contagem.set(s, (contagem.get(s) || 0) + 1);
            const duplicados = [...contagem.entries()].filter(([, n]) => n > 1).map(([s, n]) => ({ slug: s, vezes: n }));
            return { total: arr.length, distintos: contagem.size, duplicados };
          };
          return { mapa: conta(mapa), lista: conta(lista) };
        })(),
        nomes,
        grupos,
        grelha,
        temMapa: !!document.querySelector('[data-mapa-areas]'),
      };
    },
    { prefixoRota },
  );

  base.largura = largura;
  const visiveis = base.nomes.filter((n) => n.visivel);
  base.nomesVisiveis = visiveis.length;
  base.nomesTotal = base.nomes.length;
  base.alvoMinimo = visiveis.length ? Math.min(...visiveis.map((n) => n.altura)) : null;

  if (medirQuadrado && base.temMapa) {
    base.quadradoInscrito = await medeQuadradoInscrito(page);
  }
  return base;
}

let PONTOS_DAS_UNIDADES = null;
let UNIDADES_META = null;
function carregaPontos() {
  if (PONTOS_DAS_UNIDADES) return;
  const dados = JSON.parse(fs.readFileSync('/Users/nunosantos/Instruments/OEstadoDoPais/mapa/pais.json', 'utf8'));
  PONTOS_DAS_UNIDADES = Object.fromEntries(dados.unidades.map((u) => [u.slug, u.ponto]));
  UNIDADES_META = Object.fromEntries(dados.unidades.map((u) => [u.slug, { nome: u.nome, parcela: u.parcela }]));
}

/** O ponto representativo de uma unidade (unidades de campo), do mesmo
 *  `mapa/pais.json` que QUADRADO_INSCRITO usa. */
function pontoDaUnidade(slug) {
  carregaPontos();
  return PONTOS_DAS_UNIDADES[slug];
}

async function medeQuadradoInscrito(page) {
  carregaPontos();
  const inscritos = await page.evaluate(QUADRADO_INSCRITO, { pontos: PONTOS_DAS_UNIDADES, PASSO: 2 });
  const porParcela = { continente: [], madeira: [], acores: [] };
  for (const [slug, v] of Object.entries(inscritos)) {
    const meta = UNIDADES_META[slug];
    if (!meta) continue;
    porParcela[meta.parcela].push({ slug, nome: meta.nome, ...v });
  }
  const resumo = {};
  for (const [parcela, lista] of Object.entries(porParcela)) {
    const abaixo = lista.filter((u) => u.inscrito < 44);
    resumo[parcela] = {
      total: lista.length,
      abaixoDe44: abaixo.length,
      nomesAbaixo: abaixo.map((u) => `${u.nome} ${u.inscrito}px`),
      unidades: lista,
    };
  }
  return resumo;
}

async function novaPagina(browser, largura) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 2200 }, deviceScaleFactor: dprDe(largura) });
  const page = await ctx.newPage();
  return { ctx, page };
}

async function vaiA(page, url) {
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 25000 });
  await page.evaluate(async () => {
    try {
      await document.fonts.ready;
    } catch {
      /* segue sem tipo confirmado, em vez de nunca resolver */
    }
  });
  return resp;
}

/** O ponto de ecrã (px CSS) do ponto representativo de uma unidade, pela
 *  mesma CTM do svg que QUADRADO_INSCRITO usa. Existe porque `page.hover()`
 *  do Playwright mira o CENTRO DA CAIXA delimitadora, e a I82 já documentou
 *  que esse centro cai FORA do polígono em unidades côncavas (a Ilha da
 *  Madeira é o exemplo escrito em `tests/inicio/mapa-distritos.mjs`) — medido
 *  aqui outra vez, ao vivo: `page.hover('a[data-uni-porta="ilha-da-madeira"]')`
 *  esgota o tempo porque o próprio <svg> intercepta o ponteiro nesse pixel. */
async function pontoDeEcra(page, slug) {
  const [px, py] = pontoDaUnidade(slug);
  return page.evaluate(({ px, py }) => {
    const svg = document.querySelector('[data-mapa-areas]');
    const ctm = svg.getScreenCTM();
    const pt = new DOMPoint(px, py).matrixTransform(ctm);
    return { x: pt.x, y: pt.y };
  }, { px, py });
}

/** M7 · o par de estado, nos quatro sentidos, para uma unidade. */
async function medePar(page, slug) {
  const leTudo = () => ({
    areas: Object.fromEntries(
      [...document.querySelectorAll('[data-areas] .uni[data-unidade]')].map((el) => [
        el.getAttribute('data-unidade'),
        getComputedStyle(el).strokeWidth,
      ]),
    ),
    areasCor: Object.fromEntries(
      [...document.querySelectorAll('[data-areas] .uni[data-unidade]')].map((el) => [
        el.getAttribute('data-unidade'),
        getComputedStyle(el).stroke,
      ]),
    ),
    espessuras: Object.fromEntries(
      [...document.querySelectorAll('a[data-lista-porta]')].map((el) => [
        el.getAttribute('data-lista-porta'),
        getComputedStyle(el).textDecorationThickness,
      ]),
    ),
    cores: Object.fromEntries(
      [...document.querySelectorAll('a[data-lista-porta]')].map((el) => [
        el.getAttribute('data-lista-porta'),
        getComputedStyle(el).textDecorationColor,
      ]),
    ),
  });
  const mudaram = (antes, depois) => Object.keys(depois).filter((k) => antes[k] !== depois[k]);

  const repouso = await page.evaluate(leTudo);
  const resultado = { slug };

  // 1 · rato sobre o nome -> a área (largura E cor do contorno, o brief pede as duas)
  await page.hover(`a[data-lista-porta="${slug}"]`);
  let d = await page.evaluate(leTudo);
  resultado.hoverNome = {
    areaAntes: repouso.areas[slug], areaDepois: d.areas[slug],
    areaCorAntes: repouso.areasCor[slug], areaCorDepois: d.areasCor[slug],
    areasQueMudaram: mudaram(repouso.areas, d.areas),
    areasCorQueMudaram: mudaram(repouso.areasCor, d.areasCor),
  };
  await page.mouse.move(1, 1);

  // 2 · foco de teclado no nome -> a área
  await page.evaluate((s) => {
    if (document.activeElement) document.activeElement.blur();
    document.querySelector(`a[data-lista-porta="${s}"]`).focus();
  }, slug);
  d = await page.evaluate(leTudo);
  resultado.focoNome = {
    areaAntes: repouso.areas[slug], areaDepois: d.areas[slug],
    areaCorAntes: repouso.areasCor[slug], areaCorDepois: d.areasCor[slug],
    areasQueMudaram: mudaram(repouso.areas, d.areas),
    areasCorQueMudaram: mudaram(repouso.areasCor, d.areasCor),
  };
  await page.evaluate(() => document.activeElement && document.activeElement.blur());

  // 3 · rato sobre a área -> o nome (mouse.move ao ponto representativo, não
  // page.hover: ver a nota em pontoDeEcra sobre a caixa côncava da I82)
  const temArea = await page.evaluate((s) => !!document.querySelector(`a[data-uni-porta="${s}"]`), slug);
  if (temArea) {
    const p = await pontoDeEcra(page, slug);
    await page.mouse.move(p.x, p.y);
    d = await page.evaluate(leTudo);
    resultado.hoverArea = {
      espessuraAntes: repouso.espessuras[slug], espessuraDepois: d.espessuras[slug],
      corAntes: repouso.cores[slug], corDepois: d.cores[slug],
      nomesQueMudaram: mudaram(repouso.espessuras, d.espessuras),
    };
    await page.mouse.move(1, 1);

    // 4 · foco de teclado na área -> o nome
    await page.evaluate((s) => {
      if (document.activeElement) document.activeElement.blur();
      document.querySelector(`a[data-uni-porta="${s}"]`).focus();
    }, slug);
    d = await page.evaluate(leTudo);
    resultado.focoArea = {
      espessuraAntes: repouso.espessuras[slug], espessuraDepois: d.espessuras[slug],
      nomesQueMudaram: mudaram(repouso.espessuras, d.espessuras),
    };
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
  } else {
    resultado.hoverArea = null;
    resultado.focoArea = null;
    resultado.semAreaClicavel = true;
  }
  return resultado;
}

export {
  AQUI, PORTA, BASE, ANTES_URL, ROTA_PREFIXO, LARGURAS, LARGURAS_TELEMOVEL, dprDe,
  resultados, log, registaPositivo, grava, QUADRADO_INSCRITO, contraste, relLum,
  colhe, medeQuadradoInscrito, carregaPontos, pontoDaUnidade, novaPagina, vaiA,
  arrancaServidor, pontoDeEcra, medePar,
};
