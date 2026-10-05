/** RP4: fotografia e medição da construção local. Não pertence à cadeia verify. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { parse } from 'node-html-parser';
const DIST = path.resolve('dist');
const O = path.dirname(new URL(import.meta.url).pathname);
const CAP = 'design/especime-v3/capturas/rp4-2026-10-04';
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
await fs.mkdir(CAP, { recursive: true });
const familias = ['/', '/precos/', '/salarios-pensoes-e-apoios/', '/areas/trabalho-solidariedade-e-seguranca-social/', '/livro-razao/series/serie-ipc-indice/', '/livro-razao/series/serie-pensao-media-anual/'];
const english = ['/en/', '/en/prices/', '/en/pay-pensions-and-benefits/', '/en/areas/trabalho-solidariedade-e-seguranca-social/', '/en/ledger/series/serie-ipc-indice/', '/en/ledger/series/serie-pensao-media-anual/'];
const larguras = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
const navegador = await chromium.launch({ headless: true });
const capturas = []; const erros = []; const plantas = [];
try {
  for (const [lang, rotas] of [['pt', familias], ['en', english]]) {
    for (const rota of rotas) for (const largura of larguras) {
      const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
      await ctx.addInitScript(() => localStorage.setItem('tema', 'light'));
      const pagina = await ctx.newPage();
      const resposta = await pagina.goto(`http://127.0.0.1:${servidor.address().port}${rota}`, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw Error(`página não encontrada: ${rota}`);
      await pagina.evaluate(() => document.fonts.ready);
      const medida = await pagina.evaluate(() => {
        const desenhos = [...document.querySelectorAll('svg[data-forma="serie-do-pais"]')];
        const letras = desenhos.flatMap(s => [...s.querySelectorAll('text')].map(t => parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM().a));
        const letraMinima = Math.min(...letras);
        const letraMaxima = Math.max(...letras);
        const rect = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, largura: r.width, altura: r.height }; };
        const bloco = document.querySelector('[data-bloco="precos"]');
        const barras = bloco?.querySelector('[data-forma="barras"]');
        const serie = bloco?.querySelector('[data-bloco-serie]');
        const posicaoNoBloco = barras && serie ? { barras: rect(barras), serie: rect(serie) } : null;
        const marcasFora = desenhos.flatMap(s => [...s.querySelectorAll('text')].filter(t => { const b = t.getBBox(); const v = s.viewBox.baseVal; return b.x < -1 || b.y < -1 || b.x + b.width > v.width + 1 || b.y + b.height > v.height + 1; }).map(t => t.textContent));
        return { largura: innerWidth, pagina: document.documentElement.scrollWidth, altura: document.documentElement.scrollHeight,
          letraMinima, letraMaxima, posicaoNoBloco, desenhos: desenhos.map(s => ({ serie: s.dataset.series, ...rect(s), titulo: s.querySelector('title')?.textContent })), marcasFora,
          tabelas: [...document.querySelectorAll('[data-serie-tabela]')].map(t => ({ serie: t.dataset.serieTabela, anos: t.querySelectorAll('tbody tr').length, pontos: t.querySelectorAll('[data-ponto]').length, largura: t.scrollWidth, janela: t.parentElement.clientWidth })),
          cartoes: [...document.querySelectorAll('[data-cartao-serie]')].map(a => ({ cartao: a.closest('[data-cartao-medida]')?.dataset.cartaoMedida, linha: a.dataset.cartaoSerieLinha, serie: a.dataset.cartaoSerie, porta: a.getAttribute('href') })) };
      });
      if (medida.letraMinima < 11 || medida.letraMaxima > 16) erros.push(`letras dos eixos fora dos limites: ${lang}/${rota}/${largura}`);
      if (medida.pagina > largura || medida.marcasFora.length || !medida.desenhos.length) erros.push({ rota, largura, medida });
      if (largura === 390 && rota.includes('serie-ipc-indice')) {
        const estilo = await pagina.addStyleTag({ content: '.serie-tabela-janela { position: static !important; }' });
        const larguraEstragada = await pagina.evaluate(() => document.documentElement.scrollWidth);
        await estilo.evaluate(e => e.remove());
        const mordeu = medida.pagina === largura && larguraEstragada > largura;
        plantas.push({ nome: 'datas acessíveis fora do contentor da tabela', lang, controlo: medida.pagina, larguraEstragada, mordeu });
        if (!mordeu) erros.push('a planta do contentor da tabela não mordeu');
        const janela = pagina.locator('.serie-tabela-janela');
        await janela.focus(); await pagina.keyboard.press('ArrowRight');
        await pagina.waitForTimeout(250);
        const deslocada = await janela.evaluate(e => e.scrollLeft > 0);
        if (!deslocada) erros.push(`tabela mensal sem deslocação ao teclado: ${lang}`);
        await janela.evaluate(e => { e.scrollLeft = 0; e.blur(); }); await pagina.evaluate(() => scrollTo(0,0));
      }
      if (largura === 1280 && (rota === '/precos/' || rota === '/en/prices/')) {
        const vistas = await pagina.evaluate(() => [...document.querySelectorAll('.serie-do-pais')].map(s => {
          const v=s.getAttribute('viewBox'); const n=v.split(' ').map(Number);
          s.setAttribute('viewBox', `0 0 ${n[2]*2} ${n[3]*2}`); return v;
        }));
        const minimo = await pagina.evaluate(() => Math.min(...[...document.querySelectorAll('.serie-do-pais text')].map(t => parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM().a)));
        await pagina.evaluate(vistas => [...document.querySelectorAll('.serie-do-pais')].forEach((s,i)=>s.setAttribute('viewBox',vistas[i])), vistas);
        const mordeu = medida.letraMinima >= 11.5 && minimo < 11.5;
        plantas.push({ nome: 'letras dos eixos reduzidas', lang, controlo: medida.letraMinima, minimo, mordeu });
        if (!mordeu) erros.push('a planta das letras dos eixos não mordeu');
      }
      if (largura === 768 && rota.includes('/areas/')) {
        const estilo = await pagina.addStyleTag({content: '.serie-do-pais { max-width: none !important; }'});
        const maximo = await pagina.evaluate(() => Math.max(...[...document.querySelectorAll('.serie-do-pais text')].map(t => parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM().a)));
        await estilo.evaluate(e => e.remove());
        const mordeu = medida.letraMaxima <= 16 && maximo > 16;
        plantas.push({nome:'gráfico sem largura máxima',lang,controlo:medida.letraMaxima,maximo,mordeu});
        if (!mordeu) erros.push('a planta da largura máxima não mordeu');
      }
      if (medida.posicaoNoBloco) {
        const { barras, serie } = medida.posicaoNoBloco;
        if (serie.y < barras.y + barras.altura || Math.abs(serie.x - barras.x) > 1) erros.push(`a série não fica na coluna e depois das barras: ${lang}/${largura}`);
        if (largura === 1024) {
          const estilo = await pagina.addStyleTag({ content: '.pp-ilustracao { display: contents !important; }' });
          const deslocado = await pagina.evaluate(() => {
            const b=document.querySelector('[data-bloco="precos"] [data-forma="barras"]').getBoundingClientRect();
            const s=document.querySelector('[data-bloco="precos"] [data-bloco-serie]').getBoundingClientRect();
            return Math.abs(b.x-s.x)>1 || s.y<b.bottom;
          });
          await estilo.evaluate(e=>e.remove());
          plantas.push({ nome: 'série fora da coluna das barras', lang, mordeu: deslocado });
          if (!deslocado) erros.push('a planta da coluna do gráfico não mordeu');
        }
      }
      const nome = `${lang}-${familias[rotas.indexOf(rota)].split('/').filter(Boolean).join('_') || 'inicio'}-${largura}.png`;
      const ficheiro = `${CAP}/${nome}`;
      await pagina.screenshot({ path: ficheiro, fullPage: true });
      const bytes = await fs.readFile(ficheiro);
      capturas.push({ lang, rota, ficheiro, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), ...medida });
      if (largura === 390 || largura === 1280) {
        const alvo = pagina.locator(rota === '/' || rota === '/en/' ? '[data-bloco="precos"]' : rota.includes('series/') ? '.serie-pontos' : '[data-cartao-serie]').first();
        await alvo.screenshot({ path: path.join(tmpdir(), `rp4-${lang}-${familias[rotas.indexOf(rota)].split('/').filter(Boolean).join('_') || 'inicio'}-${largura}.png`) });
      }
      await ctx.close();
      console.log(`${lang} ${rota} ${largura}: ${medida.desenhos.length} desenhos, ${medida.pagina} px de página`);
    }
  }
  // Controlo conhecido: uma caixa que sai do ecrã é detetada pelo mesmo critério.
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 900 } });
  const pagina = await ctx.newPage(); await pagina.setContent('<div style="width:900px;height:10px"></div>');
  const controlo = await pagina.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await ctx.close();
  if (!controlo) erros.push('o conhecido-positivo do transbordo não mordeu');
  const ids = [...loadClaims().values()].filter(c => c.serie).map(c => c.id);
  const paginasDosCartoes = Object.fromEntries(ids.map(id => [id, []]));
  for (const f of (await fs.readdir(DIST, { recursive: true })).filter(f => f.endsWith('/index.html'))) {
    const html = await fs.readFile(path.join(DIST, f), 'utf8');
    if (!html.includes('data-cartao-serie')) continue;
    for (const c of parse(html).querySelectorAll('[data-cartao-serie-linha]')) {
      const id = c.getAttribute('data-cartao-serie-linha');
      if (paginasDosCartoes[id]) paginasDosCartoes[id].push('/' + f.replace(/index.html$/, ''));
    }
  }
  const versaoFinal = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
  if (versaoFinal.commit !== versao.commit || versaoFinal.construido_em !== versao.construido_em) erros.push('a construção mudou durante as capturas');
  const out = { comando: 'node design/especime-v3/medicoes/rp4-2026-10-04/capturar.mjs', cabeca: versao.commit, construido_em: versao.construido_em, conhecido_positivo: { transbordo_detetado: controlo }, larguras, plantas, capturas, paginasDosCartoes, erros };
  await fs.writeFile(path.join(O, 'capturas.json'), JSON.stringify(out, null, 2) + '\n');
  if (erros.length) process.exitCode = 1;
} finally { await navegador.close(); servidor.close(); }
