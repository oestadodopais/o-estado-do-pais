/** H3: as capturas e as medidas no navegador (o brief H3, §3, ponto 5), sobre a construção da cabeça atual.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/h3-2026-10-05/captar-h3.mjs <antes|depois>
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual; o guião confere o `version.json`)
 *
 * O QUE TIRA, nas cinco larguras da casa (390, 768, 1 024, 1 280 e 1 600 px) e nas duas edições, páginas inteiras:
 * a página das sugestões, a página «Privacidade» (só depois: antes não existe), a primeira página (o menu) e a página
 * da União (as faixas dos 27). E de perto, a 390 px: o cabeçalho com o menu publicado e com o nome inteiro da página da
 * União posto no lugar do rótulo curto, só nesta medição e só no navegador (a decisão 4 do §5 do brief: a largura
 * decide); e, depois, a etiqueta do toque de um grupo de países com o mesmo valor, aberta por um rato pousado no ponto, a 390 e a
 * 1 280 px.
 *
 * O QUE MEDE, e escreve em `capturas-h3-<modo>.json`:
 *   · em cada página: a janela contra a largura do documento (o transbordo), a altura, o `<h1>`;
 *   · o MENU A 390 PX, pela forma da medida do P4 (`design/especime-v3/medicoes/p4-2026-10-02/menu-a-390.mjs`): a largura
 *     natural da fila das seis portas, sem dobrar, contra a largura da coluna, e quantas linhas a fila ocupa, com o
 *     rótulo publicado e com o nome inteiro («União Europeia» / «European Union»);
 *   · AS FAIXAS DOS 27 na página da União: por faixa, quantas marcas, quantas posições distintas no ecrã (o centro de cada
 *     marca, arredondado ao meio píxel), quantas marcas de país escondidas por outra (o mesmo centro), e o desvio vertical
 *     de cada marca; e as dos cartões nas sete páginas de assunto, a 390 e a 1 280 px;
 *   · OS COOKIES E OS PEDIDOS PARA FORA, em cada página aberta: os cookies que o contexto do navegador guardou depois de a
 *     página carregar (pela API do Playwright, que vê também os que o JavaScript não vê), `document.cookie`, e cada pedido
 *     a uma origem que não é o servidor local (recusado e contado). É a metade dinâmica da medida da frase «Este sítio
 *     não usa cookies nem segue quem o lê»; a metade estática é a célula do portão de HTML
 *     (`scripts/privacidade-do-portao.mjs`). O conhecido-positivo corre primeiro, numa página em branco do mesmo servidor:
 *     um cookie posto por guião e um pedido para fora têm de ser vistos pelo mesmo leitor.
 *
 * Um transbordo, uma página que não responde 200, um erro na página, um cookie ou um pedido para fora numa página do
 * sítio fecham a corrida com 1. Os caminhos que o manifesto guarda são relativos à raiz da worktree.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const modo = process.argv[2];
if (!['antes', 'depois'].includes(modo)) throw new Error('uso: captar-h3.mjs <antes|depois>');
const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
const pasta = 'design/especime-v3/medicoes/h3-2026-10-05';
const saida = 'design/especime-v3/capturas/h3-2026-10-05';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const larguras = [390, 768, 1024, 1280, 1600];
const familias = {
  sugestoes: { pt: '/sugestoes/', en: '/en/suggestions/' },
  privacidade: { pt: '/privacidade/', en: '/en/privacy/' },
  inicio: { pt: '/', en: '/en/' },
  uniao: { pt: '/uniao-europeia/', en: '/en/european-union/' },
};
const assuntos = {
  pt: ['/precos/', '/salarios-pensoes-e-apoios/', '/pobreza-e-desigualdade/', '/emprego/', '/habitacao/', '/educacao-e-saude/', '/estado-e-economia/'],
  en: ['/en/prices/', '/en/pay-pensions-and-benefits/', '/en/poverty-and-inequality/', '/en/employment/', '/en/housing/', '/en/education-and-health/', '/en/state-and-economy/'],
};
const NOME_INTEIRO = { pt: 'União Europeia', en: 'European Union' };
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.xml': 'application/xml' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    const url = new URL(pedido.url, 'http://localhost');
    /* O conhecido-positivo dos cookies: uma página em branco que põe um cookie por guião e pede uma imagem lá fora. */
    if (url.pathname === '/__positivo__') {
      resposta.setHeader('Content-Type', 'text/html; charset=utf-8');
      resposta.setHeader('Set-Cookie', 'positivo-do-servidor=1; Path=/');
      resposta.end('<!doctype html><title>positivo</title><script>document.cookie="positivo-do-guiao=1; path=/";</script><img src="https://exemplo.invalid/pixel.gif" alt="">');
      return;
    }
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end();
  }
});
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const resultados = [];
const problemas = [];
const inicio = new Date().toISOString();
/** Os pedidos para fora, por página: cada um é recusado e contado. */
let pedidosParaFora = [];
const cookiesVistos = [];

const contexto = async (largura, altura = 900) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosParaFora.push(rota.request().url()), rota.abort())));
  return c;
};
const guarda = (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};

/** As medidas comuns de uma página e as da família, lidas no navegador. */
const medir = (familia) => {
  const texto = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const r = {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: texto(document.querySelector('main h1')),
    cookie_do_documento: document.cookie,
    porta_da_privacidade_no_rodape: document.querySelectorAll('footer [data-porta-privacidade] a[href]').length,
  };
  if (familia === 'sugestoes') {
    const nota = document.querySelector('[data-sugestoes-nota]');
    r.nota = texto(nota);
    r.ligacoes_da_nota = [...(nota?.querySelectorAll('a[href]') ?? [])].map((a) => ({ href: a.getAttribute('href'), texto: texto(a) }));
    r.caixas_de_marcar = document.querySelectorAll('form input[type="checkbox"]').length;
    r.campos = [...document.querySelectorAll('form [name]')].map((c) => c.getAttribute('name'));
  }
  if (familia === 'privacidade') {
    const bloco = document.querySelector('[data-privacidade-texto]');
    r.texto = texto(bloco);
    r.ligacoes_do_texto = [...(bloco?.querySelectorAll('a[href]') ?? [])].map((a) => ({ href: a.getAttribute('href'), texto: texto(a) }));
  }
  if (familia === 'uniao') {
    r.faixas = [...document.querySelectorAll('[data-faixa-paises] [data-faixa-desenho]')].map((d) => {
      const marcas = [...d.querySelectorAll('[data-faixa-marca]')];
      const centro = (m) => {
        const b = m.getBoundingClientRect();
        return { x: Math.round((b.left + b.width / 2) * 2) / 2, y: Math.round((b.top + b.height / 2) * 2) / 2 };
      };
      const dePais = marcas.filter((m) => !m.classList.contains('faixa-ue-uniao'));
      const centros = dePais.map(centro);
      const chaves = centros.map((c) => `${c.x}|${c.y}`);
      const repetidas = chaves.filter((k, i) => chaves.indexOf(k) !== i).length;
      const eixo = d.querySelector('.faixa-ue-eixo')?.getBoundingClientRect().top ?? 0;
      return {
        serie: d.getAttribute('data-faixa-desenho'),
        marcas: marcas.length,
        marcas_de_pais: dePais.length,
        posicoes_distintas_dos_paises: new Set(chaves).size,
        posicoes_horizontais_distintas_dos_paises: new Set(centros.map((c) => c.x)).size,
        paises_escondidos_por_outro: repetidas,
        desvios_verticais: [...new Set(centros.map((c) => Math.round((c.y - eixo) * 2) / 2))].sort((a, b) => a - b),
        etiquetas_do_toque: d.querySelectorAll('[data-toque-de]').length,
      };
    });
  }
  return r;
};

try {
  /* O CONHECIDO-POSITIVO DOS COOKIES E DOS PEDIDOS PARA FORA, ANTES DE TUDO: o mesmo leitor tem de ver um cookie posto
     pelo servidor, um posto por guião e um pedido a outra origem. Se não os vir, um zero nas páginas não vale. */
  {
    pedidosParaFora = [];
    const c = await contexto(390);
    const page = await c.newPage();
    await page.goto(origem + '/__positivo__', { waitUntil: 'networkidle' });
    const nomes = (await c.cookies()).map((k) => k.name).sort();
    const positivo = { cookies: nomes, pedidos_para_fora: pedidosParaFora.length };
    resultados.push({ tipo: 'conhecido-positivo dos cookies', ...positivo, visto: nomes.includes('positivo-do-servidor') && nomes.includes('positivo-do-guiao') && pedidosParaFora.length >= 1 });
    if (!(nomes.includes('positivo-do-servidor') && nomes.includes('positivo-do-guiao') && pedidosParaFora.length >= 1)) problemas.push('o conhecido-positivo dos cookies e dos pedidos para fora não foi visto');
    await c.close();
  }

  /* AS PÁGINAS INTEIRAS, NAS CINCO LARGURAS E NAS DUAS EDIÇÕES */
  for (const [familia, rotas] of Object.entries(familias)) {
    if (familia === 'privacidade' && modo === 'antes') continue;
    for (const lang of ['pt', 'en']) for (const largura of larguras) {
      pedidosParaFora = [];
      const c = await contexto(largura);
      const page = await c.newPage();
      page.on('pageerror', (e) => problemas.push(`${familia}/${lang}/${largura}: ${e.message}`));
      const resposta = await page.goto(origem + rotas[lang], { waitUntil: 'networkidle' });
      if (resposta?.status() !== 200) problemas.push(`${familia}/${lang}/${largura}: HTTP ${resposta?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const medidas = await page.evaluate(medir, familia);
      const cookies = await c.cookies();
      medidas.cookies_do_contexto = cookies.map((k) => k.name);
      medidas.pedidos_para_fora = [...pedidosParaFora];
      cookiesVistos.push(...cookies.map((k) => `${rotas[lang]} ${k.name}`));
      if (cookies.length || medidas.cookie_do_documento) problemas.push(`${familia}/${lang}/${largura}: a página guardou cookies (${cookies.map((k) => k.name).join(', ')})`);
      if (pedidosParaFora.length) problemas.push(`${familia}/${lang}/${largura}: ${pedidosParaFora.length} pedido(s) para fora (${pedidosParaFora.join(', ')})`);
      if (medidas.documento > largura + 1) problemas.push(`${familia}/${lang}/${largura}: transbordo horizontal (${medidas.documento} px numa janela de ${largura})`);
      const ficheiro = `${saida}/${modo}-${familia}-${lang}-${largura}.png`;
      const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      guarda(bytes, ficheiro, { tipo: 'pagina', familia, rota: rotas[lang], lang, largura, medidas });
      await c.close();
      console.log(`H3 ${modo}: ${familia}, ${lang}, ${largura} px.`);
    }
  }

  /* O MENU A 390 PX: o publicado e o nome inteiro posto no lugar do rótulo curto, só no navegador */
  for (const lang of ['pt', 'en']) for (const forma of ['publicado', 'nome-inteiro']) {
    pedidosParaFora = [];
    const c = await contexto(390, 800);
    const page = await c.newPage();
    await page.goto(origem + familias.inicio[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(({ forma, inteiro }) => {
      const nav = document.querySelector('#nav-principal');
      const portas = [...nav.querySelectorAll('a')];
      const daUniao = portas.find((a) => /uniao-europeia|european-union/.test(a.getAttribute('href') ?? ''));
      if (forma === 'nome-inteiro' && daUniao) daUniao.textContent = inteiro;
      const coluna = nav.clientWidth;
      nav.style.flexWrap = 'nowrap';
      const intervalo = parseFloat(getComputedStyle(nav).columnGap) || 0;
      const larguras = portas.map((a) => a.getBoundingClientRect().width);
      const natural = larguras.reduce((s, w) => s + w, 0) + intervalo * (portas.length - 1);
      nav.style.flexWrap = '';
      const linhas = new Set(portas.map((a) => Math.round(a.getBoundingClientRect().top))).size;
      const letra = getComputedStyle(portas[0]).fontSize;
      return {
        coluna, natural: Math.round(natural * 10) / 10, falta: Math.round(Math.max(0, natural - coluna) * 10) / 10, linhas,
        intervalo, letra, rotulos: portas.map((a) => a.textContent.trim()),
        rotulo_da_uniao: daUniao?.textContent.trim() ?? null,
      };
    }, { forma, inteiro: NOME_INTEIRO[lang] });
    const cabecalho = page.locator('header').first();
    const ficheiro = `${saida}/${modo}-menu-${forma}-${lang}-390.png`;
    const bytes = await cabecalho.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'menu a 390 px', forma, lang, largura: 390, medidas: m });
    await c.close();
    console.log(`H3 ${modo}: menu ${forma}, ${lang}: ${m.natural} px de portas numa coluna de ${m.coluna}, ${m.linhas} linha(s).`);
  }

  /* AS FAIXAS DOS CARTÕES NAS SETE PÁGINAS DE ASSUNTO, a 390 e a 1 280 px: as mesmas contas das da página da União, e o
     `title` de cada marca (o que o rato mostra ao pousar num ponto do cartão). */
  for (const lang of ['pt', 'en']) for (const largura of [390, 1280]) {
    pedidosParaFora = [];
    const c = await contexto(largura);
    const page = await c.newPage();
    const faixas = [];
    for (const rota of assuntos[lang]) {
      const resposta = await page.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta?.status() !== 200) problemas.push(`assunto ${rota}/${largura}: HTTP ${resposta?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const destas = await page.evaluate(() => [...document.querySelectorAll('[data-faixa-ue] [data-faixa-desenho]')].map((d) => {
        const marcas = [...d.querySelectorAll('[data-faixa-marca]')].filter((m) => !m.classList.contains('faixa-ue-uniao'));
        const centros = marcas.map((m) => { const b = m.getBoundingClientRect(); return `${Math.round((b.left + b.width / 2) * 2) / 2}|${Math.round((b.top + b.height / 2) * 2) / 2}`; });
        return {
          serie: d.getAttribute('data-faixa-desenho'),
          marcas_de_pais: marcas.length,
          posicoes_distintas_dos_paises: new Set(centros).size,
          paises_escondidos_por_outro: centros.filter((k, i) => centros.indexOf(k) !== i).length,
          marcas_com_title: [...d.querySelectorAll('[data-faixa-marca][title]')].length,
        };
      }));
      for (const f of destas) faixas.push({ rota, ...f });
      const cookies = await c.cookies();
      if (cookies.length) problemas.push(`assunto ${rota}/${largura}: a página guardou cookies`);
    }
    if (pedidosParaFora.length) problemas.push(`assuntos ${lang}/${largura}: ${pedidosParaFora.length} pedido(s) para fora`);
    resultados.push({ tipo: 'faixas dos cartões', lang, largura, faixas, pedidos_para_fora: pedidosParaFora.length });
    await c.close();
    console.log(`H3 ${modo}: as faixas dos cartões, ${lang}, ${largura} px: ${faixas.length} faixa(s).`);
  }

  /* DEPOIS: A ETIQUETA DE UM GRUPO, ABERTA POR UM RATO POUSADO NO PONTO (a 390 e a 1 280 px, a página da União), o que
     ela diz e onde fica: a caixa da etiqueta contra a janela (a emenda das etiquetas do H3 mantém-nas dentro do desenho) */
  if (modo === 'depois') {
    for (const largura of [390, 1280]) for (const lang of ['pt', 'en']) {
      pedidosParaFora = [];
      const c = await contexto(largura);
      const page = await c.newPage();
      await page.goto(origem + familias.uniao[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const alvo = 'desemprego-de-longa-duracao-2025-paises';
      const marca = page.locator(`[data-faixa-desenho="${alvo}"] [data-faixa-marca="${alvo}#FR"]`);
      await marca.scrollIntoViewIfNeeded();
      const caixa = await marca.boundingBox();
      await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      await page.waitForTimeout(150);
      const lido = await page.evaluate((alvo) => {
        const visiveis = [...document.querySelectorAll(`[data-faixa-desenho="${alvo}"] [data-toque-de]`)].filter((e) => !e.hidden);
        const janela = document.documentElement.clientWidth;
        return visiveis.map((e) => { const r = e.getBoundingClientRect(); return { de: e.getAttribute('data-toque-de'), texto: e.textContent.replace(/\s+/g, ' ').trim(), paises: [...e.querySelectorAll('[data-pais]')].map((p) => p.getAttribute('data-pais')), valores: e.querySelectorAll('[data-ponto]').length, caixa: { esquerda: Math.round(r.left * 10) / 10, direita: Math.round(r.right * 10) / 10, altura: Math.round(r.height * 10) / 10 }, fora_da_janela: Math.round(Math.max(0, -r.left, r.right - janela) * 10) / 10 }; });
      }, alvo);
      const desenho = page.locator(`[data-faixa-paises="${alvo}"]`);
      const ficheiro = `${saida}/depois-etiqueta-do-grupo-${lang}-${largura}.png`;
      const bytes = await desenho.screenshot({ path: ficheiro });
      guarda(bytes, ficheiro, { tipo: 'etiqueta de um grupo ao passar o rato', lang, largura, serie: alvo, ponto: 'FR', etiquetas_visiveis: lido });
      if (lido.length !== 1 || lido[0].paises.length !== 4 || lido[0].valores !== 1) problemas.push(`etiqueta do grupo ${lang}/${largura}: esperava-se uma etiqueta com quatro países e um valor, e leu-se ${JSON.stringify(lido)}`);
      else if (lido[0].fora_da_janela > 0) problemas.push(`etiqueta do grupo ${lang}/${largura}: passa a margem da janela em ${lido[0].fora_da_janela} px`);
      await c.close();
      console.log(`H3 depois: a etiqueta do grupo, ${lang}, ${largura} px: ${lido.map((x) => `${x.texto} (fora da janela: ${x.fora_da_janela} px)`).join(' | ')}`);
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}

const manifesto = {
  guiao: `${pasta}/captar-h3.mjs`,
  modo,
  cabeca,
  arvore_limpa: estado === '',
  construcao: versao.commit,
  inicio,
  fim: new Date().toISOString(),
  larguras,
  cookies_vistos_nas_paginas: cookiesVistos,
  problemas,
  capturas: resultados,
};
await fs.writeFile(`${pasta}/capturas-h3-${modo}.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`H3 ${modo}: ${resultados.filter((r) => r.ficheiro).length} imagem(ns), ${problemas.length} problema(s).`);
for (const p of problemas) console.log(`  problema: ${p}`);
process.exit(problemas.length ? 1 : 0);
