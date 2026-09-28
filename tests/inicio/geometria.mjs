#!/usr/bin/env node
/**
 * A GEOMETRIA DOS DESENHOS DA PRIMEIRA PÁGINA, MEDIDA NO NAVEGADOR (bloco PP1, 28.09.2026).
 *
 * O §2, ponto 2, do brief: «A célula da geometria confere na página construída o que a maqueta
 * conferia». É a verificação da maqueta que o diretor viu (`design/especime-v3/medicoes/pp1-2026-09-28/
 * maqueta/verificar.mjs`), trazida para a marcação do sítio, e mede em Chromium sem cabeça, sobre
 * `dist/` servido numa porta livre, com todo o pedido para fora recusado:
 *
 *   G1 · cada barra mede o seu valor na escala do seu desenho, dentro de 0,75 px (a tolerância
 *        declarada): numa escala, a barra de maior valor dá os píxeis por unidade, e cada outra tem de
 *        medir o seu valor nessa conta. As barras de uma escala são as dos painéis que declaram a mesma
 *        (`data-escala`), e por isso dois painéis com uma só escala têm a mesma escala;
 *   G2 · as faixas dos painéis de uma escala têm o mesmo comprimento, dentro de 0,5 px;
 *   G3 · as barras de um painel partem da mesma origem, e as colunas dos dois painéis assentam na mesma
 *        base, dentro de 0,5 px;
 *   G4 · a linha do valor de referência está no seu valor na escala das colunas, dentro de 1 px, e não
 *        entra no painel da União;
 *   G5 · as cores dos blocos são só as fichas do sítio no tema da página (o papel, a tinta, os três
 *        cinzentos e o âmbar), e o âmbar só na linha do valor de referência.
 *
 * O valor de cada barra lê-se do número desenhado ao lado dela (o `data-claim` do seu `<svg>`), que a
 * célula dos blocos (`tests/inicio/blocos.mjs`) já confere contra a linha: esta célula não confere o
 * número, confere o desenho dele. A primeira página corre nas duas edições a 390 e a 1 280 px e nos
 * dois temas; as páginas das entradas com blocos correm na edição portuguesa a 1 280 px, e a da
 * habitação também a 390.
 *
 * `--prova` corre as catorze plantas da maqueta (um número solto, um valor trocado, o identificador de
 * outra linha, uma linha retirada, um número das palavras fixas mudado, a unidade dentro do elemento do
 * valor, um travessão, um painel da habitação com outra escala escrita, um painel da habitação mais
 * estreito, uma barra fora da origem, a linha do limiar nos 50, a linha a entrar no painel da União,
 * uma cor numa coluna e o âmbar no rótulo), cada uma numa cópia da primeira página servida no lugar da
 * construída, e exige a falha exata que lhe corresponde, desta célula ou da célula dos blocos corrida
 * sobre a mesma cópia. Nenhum ficheiro de `dist/` é tocado.
 *
 * Uso: node tests/inicio/geometria.mjs [--prova] [--json saída]   (OEDP_DIST aponta outra construção)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';
import { conferirBlocosDaPagina, idsDosBlocos } from './blocos.mjs';
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
/** As fichas das cores, nos dois temas, como `src/styles/tokens.css` as declara. */
const FICHAS = {
  light: { papel: '#f6f7f4', tinta: '#17191b', g1: '#585d5b', g2: '#7f8681', g3: '#d9ddd8', 'âmbar': '#e0a21a' },
  dark: { papel: '#15171a', tinta: '#eceeea', g1: '#b9beba', g2: '#8e948f', g3: '#3a3f3c', 'âmbar': '#e0a21a' },
};
/* As fichas conferem-se contra a folha antes de medir: uma folha que mude uma cor e esta tabela não
   acompanhe fecha a célula, em vez de ela aceitar a cor antiga. */
{
  const tokens = await fs.readFile(path.join(RAIZ, 'src', 'styles', 'tokens.css'), 'utf8');
  const claro = tokens.slice(tokens.indexOf(':root {'), tokens.indexOf('@media (prefers-color-scheme: dark)'));
  const escuro = tokens.slice(tokens.indexOf('@media (prefers-color-scheme: dark)'));
  for (const [tema, bloco] of [['light', claro], ['dark', escuro]]) {
    for (const [nome, ficha] of [['papel', 'paper'], ['tinta', 'ink'], ['g1', 'g1'], ['g2', 'g2'], ['g3', 'g3'], ['âmbar', 'amber']]) {
      const m = new RegExp(`--${ficha}:\\s*(#[0-9a-fA-F]{6})`).exec(bloco);
      if (!m || m[1].toLowerCase() !== FICHAS[tema][nome]) {
        console.error(`geometria: a ficha --${ficha} do tema ${tema} é ${m?.[1] ?? 'nada'} em tokens.css e ${FICHAS[tema][nome]} aqui.`);
        process.exit(2);
      }
    }
  }
}

/* ------------------------------------------------------------------ a medição, dentro da página */
function medirBlocos({ fichas }) {
  /** @type {[string, string][]} */
  const falhas = [];
  /** @type {string[]} */
  const geometria = [];
  const numero = (t) => parseFloat(String(t).replace(/[\s   ]/g, '').replace('−', '-').replace(',', '.'));
  for (const bloco of document.querySelectorAll('[data-bloco]')) {
    const id = bloco.getAttribute('data-bloco');
    const desenho = bloco.querySelector('[data-bloco-desenho]');
    if (!desenho) { falhas.push(['desenho', `${id}: o bloco não tem desenho`]); continue; }
    const vertical = desenho.getAttribute('data-forma') === 'colunas';
    const barras = [...desenho.querySelectorAll('[data-barra]')].map((dono) => {
      const b = dono.querySelector(vertical ? '.pp-col-barra' : '.pp-barra');
      const v = dono.querySelector('svg [data-claim]');
      const painel = dono.closest('[data-painel]');
      const faixa = vertical ? painel?.querySelector('.pp-plot') : dono.querySelector('.pp-traco');
      const r = b?.getBoundingClientRect();
      const f = faixa?.getBoundingClientRect();
      return {
        id: dono.getAttribute('data-barra'), painel, escala: painel?.getAttribute('data-escala') ?? '?',
        valor: v ? numero(v.textContent) : NaN,
        comprimento: r ? (vertical ? r.height : r.width) : NaN,
        inicio: r ? (vertical ? r.bottom : r.left) : NaN,
        faixa: f ? (vertical ? f.height : f.width) : NaN,
      };
    });
    /** @type {Map<string, any[]>} */
    const porEscala = new Map();
    for (const x of barras) { if (!porEscala.has(x.escala)) porEscala.set(x.escala, []); porEscala.get(x.escala).push(x); }
    for (const [escala, xs] of porEscala) {
      const maior = xs.reduce((a, x) => (Math.abs(x.valor) > Math.abs(a.valor) ? x : a));
      const k = maior.comprimento / Math.abs(maior.valor);
      for (const x of xs) {
        const esperado = k * Math.abs(x.valor);
        if (!(Math.abs(x.comprimento - esperado) <= 0.75)) falhas.push(['desenho', `G1 · na escala «${escala}», ${x.id} mede ${x.comprimento.toFixed(2)} px; na escala dos outros mediria ${esperado.toFixed(2)} px`]);
      }
      const faixas = xs.map((x) => x.faixa);
      if (Math.max(...faixas) - Math.min(...faixas) > 0.5) falhas.push(['desenho', `G2 · na escala «${escala}», as faixas não têm o mesmo comprimento (${[...new Set(faixas.map((f) => f.toFixed(2)))].join(' e ')} px)`]);
      geometria.push(`${escala}: ${xs.length} barras, ${k.toFixed(3)} px por unidade, faixa de ${faixas[0].toFixed(1)} px`);
    }
    for (const painel of desenho.querySelectorAll('[data-painel]')) {
      const xs = barras.filter((x) => x.painel === painel && x.valor >= 0);
      const inicios = xs.map((x) => x.inicio);
      if (xs.length && Math.max(...inicios) - Math.min(...inicios) > 0.5) falhas.push(['desenho', `G3 · as barras de ${xs.map((x) => x.id).join(', ')} não partem da mesma origem`]);
    }
    if (vertical) {
      const bases = barras.map((x) => x.inicio);
      if (Math.max(...bases) - Math.min(...bases) > 0.5) falhas.push(['desenho', `G3 · as colunas dos dois painéis de ${id} não assentam na mesma base`]);
      const linha = desenho.querySelector('.pp-ref');
      const numeroDaLinha = desenho.querySelector('[data-referencia]');
      if (!linha || !numeroDaLinha) falhas.push(['desenho', `G4 · ${id}: falta a linha do valor de referência ou o seu número`]);
      else {
        const r = linha.getBoundingClientRect();
        const col = barras.reduce((a, x) => (x.valor > a.valor ? x : a));
        const k = col.comprimento / col.valor;
        const ref = numero(numeroDaLinha.textContent);
        const alvo = col.inicio - k * ref;
        const centro = (r.top + r.bottom) / 2;
        if (Math.abs(centro - alvo) > 1) falhas.push(['desenho', `G4 · a linha de referência está a ${(col.inicio - centro).toFixed(1)} px da base; os ${ref} da escala estão a ${(col.inicio - alvo).toFixed(1)} px`]);
        for (const p of desenho.querySelectorAll('[data-painel]')) {
          if (!p.contains(linha) && p.getBoundingClientRect().left < r.right - 0.5) falhas.push(['desenho', 'G4 · a linha do valor de referência entra no painel da União, onde a Comissão não aplica o limiar']);
        }
        geometria.push(`${id} · referência: a linha a ${(col.inicio - centro).toFixed(1)} px da base, os ${ref} a ${(col.inicio - alvo).toFixed(1)} px`);
      }
    }
  }
  /* G5 · as cores, dentro dos blocos. */
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');
  const paleta = new Map(Object.entries(fichas).map(([n, h]) => [rgb(h), n]));
  const props = ['color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'text-decoration-color', 'outline-color'];
  const pintam = new Set(['text', 'tspan', 'rect', 'line', 'path', 'circle', 'polygon', 'polyline', 'ellipse']);
  const fora = new Set();
  let ambar = 0;
  const ver = (el, cs, pseudo) => {
    const valores = props.map((p) => cs.getPropertyValue(p));
    if (el instanceof SVGElement && !pseudo && pintam.has(el.tagName.toLowerCase())) valores.push(cs.getPropertyValue('fill'), cs.getPropertyValue('stroke'));
    const img = cs.getPropertyValue('background-image');
    if (img && img !== 'none') valores.push(...(img.match(/rgba?\([^)]*\)/g) || []));
    for (const v of valores) {
      for (const c of v.match(/rgba?\([^)]*\)/g) || []) {
        const n = c.match(/[\d.]+/g).map(Number);
        if (n.length === 4 && n[3] === 0) continue;
        const nome = paleta.get(n.slice(0, 3).join(','));
        const quem = `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : ''}${pseudo || ''}`;
        if (!nome) fora.add(`${c} em ${quem}`);
        else if (nome === 'âmbar') { if (el.matches('.pp-ref') && !pseudo) ambar++; else fora.add(`âmbar fora da linha de referência, em ${quem}`); }
      }
    }
  };
  for (const bloco of document.querySelectorAll('[data-bloco]')) {
    for (const el of [bloco, ...bloco.querySelectorAll('*')]) {
      ver(el, getComputedStyle(el));
      for (const p of ['::before', '::after']) {
        const cs = getComputedStyle(el, p);
        if (cs.getPropertyValue('content') !== 'none' && cs.getPropertyValue('content') !== 'normal') ver(el, cs, p);
      }
    }
  }
  for (const f of fora) falhas.push(['cor', `G5 · ${f}`]);
  if (document.querySelector('[data-bloco] .pp-ref') && !ambar) falhas.push(['cor', 'G5 · a linha do valor de referência não tem cor']);
  return { falhas, geometria, blocos: document.querySelectorAll('[data-bloco]').length };
}

/* ------------------------------------------------------------------ o servidor e as corridas */
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (q, r) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw new Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    r.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    r.end(await fs.readFile(f));
  } catch { r.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ headless: true });
/** @param {string} rota @param {number} largura @param {'light'|'dark'} tema @param {string|null} [html] */
async function correr(rota, largura, tema, html = null) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: tema, reducedMotion: 'reduce' });
  const externos = [];
  try {
    await ctx.route('**/*', (r) => {
      const u = r.request().url();
      if (!u.startsWith(origem)) { externos.push(u); return r.abort(); }
      if (html !== null && new URL(u).pathname === rota) return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      return r.continue();
    });
    const p = await ctx.newPage();
    const resposta = await p.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(medirBlocos, { fichas: FICHAS[tema] });
    if (externos.length) r.falhas.push(['rede', `${externos.length} pedidos para fora`]);
    return r;
  } finally { await ctx.close(); }
}

const corridas = [];
const falhas = [];
try {
  const limpas = [
    ['/', 390, 'light'], ['/', 1280, 'light'], ['/', 390, 'dark'], ['/', 1280, 'dark'], ['/en/', 390, 'light'], ['/en/', 1280, 'light'],
    ...ENTRADAS.filter((e) => e.blocos.length && !('existente' in e && e.existente)).map((e) => [e.rota.pt, 1280, 'light']),
    ['/a-minha-casa/', 390, 'light'],
  ];
  for (const [rota, largura, tema] of limpas) {
    const r = await correr(rota, largura, tema);
    corridas.push({ rota, largura, tema, blocos: r.blocos, falhas: r.falhas, geometria: r.geometria });
    for (const [k, m] of r.falhas) falhas.push(`${rota} a ${largura} px (${tema}): [${k}] ${m}`);
    if (!r.blocos) falhas.push(`${rota} a ${largura} px (${tema}): nenhum bloco medido; a célula não mediu nada`);
  }

  /* ------------------------------------------------------------ as catorze plantas da maqueta */
  const plantas = [];
  if (process.argv.includes('--prova')) {
    const original = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
    const bloco = (r, id) => r.querySelector(`[data-bloco="${id}"]`);
    const estilo = (el, f) => el.setAttribute('style', f(String(el.getAttribute('style') ?? '')));
    const PLANTAS = [
      ['um número solto', (r) => bloco(r, 'precos').querySelector('[data-bloco-ressalva]').insertAdjacentHTML('beforeend', ' Em 12 meses.'), /precos: o bloco escreve um algarismo sem marca de origem/],
      ['um valor trocado', (r) => bloco(r, 'precos').querySelector('[data-barra="ipc-combustiveis-variacao-homologa"] svg [data-claim]').set_content('23,87'), /o valor desenhado de ipc-combustiveis-variacao-homologa é «23,87»/],
      ['o identificador de outra linha', (r) => bloco(r, 'precos').querySelector('[data-barra="ipc-rendas-variacao-homologa"] svg [data-claim]').setAttribute('data-claim', 'ipc-alimentacao-variacao-homologa'), /o valor desenhado de ipc-alimentacao-variacao-homologa é «5,22»/],
      ['uma linha retirada', (r) => bloco(r, 'pobreza').querySelector('[data-barra="racio-s80-s20-2025-ue"]').remove(), /o desenho não tem a linha racio-s80-s20-2025-ue/],
      ['um número das palavras fixas mudado', (r) => bloco(r, 'casa').querySelector('[data-bloco-frase] [data-nonledger="escala-de-instrumento"]').set_content('45'), /casa: o texto rendido da frase difere do que o resolvedor dá/],
      ['a unidade dentro do elemento do valor', (r) => { const t = bloco(r, 'precos').querySelector('[data-barra="ipc-combustiveis-variacao-homologa"] svg text'); t.querySelector('.pp-unidade').remove(); t.querySelector('[data-claim]').set_content('23,78 %'); }, /o valor desenhado de ipc-combustiveis-variacao-homologa é «23,78 %»/],
      ['um travessão', (r) => { const f = bloco(r, 'estado').querySelector('[data-bloco-frase]'); f.set_content(f.innerHTML.replace(' e está acima', ' — e está acima')); }, /estado: da frase tem um travessão/],
      ['um painel da habitação com outra escala escrita', (r) => estilo(bloco(r, 'casa').querySelector('[data-barra="sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025"] .pp-barra'), (s) => s.replace(/width:[\d.]+%/, 'width:50%')), /G1 · na escala «casa:unica», .* mede .* px; na escala dos outros mediria/],
      ['um painel da habitação mais estreito', (r) => bloco(r, 'casa').querySelector('[data-painel="painel-1"]').setAttribute('style', 'max-width:200px'), /G1 · na escala «casa:unica», .* mede|G2 · na escala «casa:unica», as faixas não têm o mesmo comprimento/],
      ['uma barra fora da origem', (r) => estilo(bloco(r, 'precos').querySelector('[data-barra="ipc-alimentacao-variacao-homologa"] .pp-barra'), (s) => s.replace(/margin-left:[\d.]+%/, 'margin-left:3%')), /G3 · as barras de .*ipc-alimentacao-variacao-homologa.* não partem da mesma origem/],
      ['a linha do limiar nos 50', (r) => { const x = bloco(r, 'estado').querySelector('.pp-ref'); estilo(x, (s) => s.replace(/bottom:[\d.]+%/, `bottom:${(50 / 93.5 * 100).toFixed(4)}%`)); }, /G4 · a linha de referência está a/],
      ['a linha a entrar no painel da União', (r) => estilo(bloco(r, 'estado').querySelector('.pp-ref'), (s) => `${s};right:-160px`), /G4 · a linha do valor de referência entra no painel da União/],
      ['uma cor numa coluna', (r) => estilo(bloco(r, 'estado').querySelector('[data-barra="divida-publica-2025-ue"] .pp-col-barra'), (s) => `${s};background:var(--cobalt)`), /G5 · rgb\(31, 78, 140\) em span\.pp-col-barra/],
      ['o âmbar no rótulo', (r) => bloco(r, 'estado').querySelector('.pp-ref-rotulo').setAttribute('style', `${bloco(r, 'estado').querySelector('.pp-ref-rotulo').getAttribute('style')};color:var(--amber)`), /G5 · âmbar fora da linha de referência, em p\.pp-ref-rotulo/],
    ];
    for (const [nome, estraga, espera] of PLANTAS) {
      const r = parse(original);
      estraga(r);
      const html = r.toString();
      if (html === original) { plantas.push({ nome, mordeu: false, queixa: 'a planta não mudou o HTML' }); continue; }
      const estatica = conferirBlocosDaPagina(parse(html), 'pt', '/ (planta)', { ids: idsDosBlocos(), primeira: true }).erros;
      const medida = await correr('/', 390, 'light', html);
      const todas = [...estatica, ...medida.falhas.map(([k, m]) => `[${k}] ${m}`)];
      const certa = todas.find((m) => espera.test(m)) ?? null;
      plantas.push({ nome, mordeu: certa !== null, queixa: certa ?? todas[0] ?? null, falhas_vistas: todas.length });
      if (!certa) falhas.push(`a planta «${nome}» não produziu a falha esperada (${espera.source}); viu: ${todas.slice(0, 2).join(' | ') || 'nada'}`);
    }
  }

  const j = process.argv.indexOf('--json');
  if (j !== -1) await fs.writeFile(process.argv[j + 1], JSON.stringify({ corridas, plantas, falhas }, null, 2) + '\n');
  for (const c of corridas) console.log(`${c.rota} a ${c.largura} px (${c.tema}): ${c.blocos} blocos, ${c.falhas.length} falhas · ${c.geometria.join(' · ')}`);
  for (const p of plantas) console.log(`  ${p.mordeu ? 'apanhada' : 'FALHOU  '} · ${p.nome} → ${p.queixa}`);
  if (falhas.length) { for (const f of falhas) console.error(`FALHA ${f}`); process.exitCode = 1; }
  else console.log(`geometria · ${corridas.length} corridas sem falhas${plantas.length ? ` · ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas apanhadas` : ''}.`);
} finally {
  await navegador.close();
  await new Promise((ok) => servidor.close(ok));
}
