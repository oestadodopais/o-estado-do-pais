import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { todosOsRegistos } from '../../../../src/lib/registos.mjs';
import { routePath } from '../../../../src/lib/routes.mjs';
const dist = path.join(process.cwd(), 'dist');
const pasta = path.join(process.cwd(), 'design/especime-v3/medicoes/b1-2026-09-17');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(dist, '.' + new URL(req.url, 'http://local').pathname);
    if (!f.startsWith(dist + path.sep) && f !== dist) throw Error('Caminho');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const browser = await chromium.launch();
const resultados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width: largura, height: 900 }, reducedMotion: 'reduce' });
      await context.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
      const page = await context.newPage();
      const rota = routePath('estudo', lang, { slug: 'evora-2027-prometido-painel-dinheiro' });
      await page.goto(base + rota, { waitUntil: 'networkidle' });
      const medida = await page.evaluate(() => {
        const seletores = ['h1', '.texto-indice', '.estudo-leitura', '.estudo-texto', '.texto-dobra', '.estudo-publicado'];
        const nos = seletores.map(s => document.querySelector(s));
        return { ordem: nos.map(n => n?.getBoundingClientRect().top),
          ordemDom: nos.every((n, i) => i === 0 || !!(nos[i - 1].compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING)),
          indiceFechado: !document.querySelector('.texto-indice-dobra').open,
          fontesFechadas: !document.querySelector('.texto-dobra').open,
          indice: document.querySelectorAll('[data-registo-indice]').length,
          destinos: [...document.querySelectorAll('[data-registo-indice]')].every(a => document.querySelector(a.getAttribute('href'))),
          faixa: document.querySelectorAll('.texto-faixa,[data-registo-conta]').length,
          edicoes: document.querySelectorAll('.edicoes-frase,.edicao').length,
          largura: document.documentElement.scrollWidth, janela: innerWidth };
      });
      assert(medida.ordemDom && medida.ordem.every((x, i) => i === 0 || x > medida.ordem[i - 1]));
      assert(medida.indiceFechado && medida.fontesFechadas && medida.destinos && medida.indice > 0);
      assert.equal(medida.faixa, 0); assert.equal(medida.edicoes, 0); assert(medida.largura <= medida.janela);
      await page.locator('.texto-figura[href^="#linha-"]').first().click();
      await page.waitForFunction(() => document.querySelector('.texto-dobra').open);
      const fontesAbrem = await page.locator('.texto-dobra').evaluate(n => n.open);
      resultados.push({ rota, lang, largura, ...medida, fontesAbrem });
      await page.goto(base + routePath('estudos', lang), { waitUntil: 'networkidle' });
      const lista = await page.evaluate(() => {
        const artigo = document.querySelector('.estudo-item');
        const titulo = artigo.querySelector('h2').getBoundingClientRect();
        const meta = artigo.querySelector('.estudo-meta').getBoundingClientRect();
        const resumo = artigo.querySelector('.estudo-resumo').getBoundingClientRect();
        return { artigos: document.querySelectorAll('.estudo-item').length,
          lugares: [...document.querySelectorAll('.estudos-lugares a')].map(a => a.getAttribute('href')),
          ordem: meta.top >= titulo.bottom && resumo.top >= meta.bottom,
          percentagens: [...artigo.querySelectorAll('.claim-sufixo')].map(n => n.textContent),
          largura: document.documentElement.scrollWidth, janela: innerWidth };
      });
      assert.equal(lista.artigos, 6); assert.equal(lista.lugares.length, 2); assert(lista.ordem);
      assert.deepEqual(lista.percentagens, ['%', '%', '%']); assert(lista.largura <= lista.janela);
      resultados.push({ rota: routePath('estudos', lang), lang, largura, ...lista });
      await context.close();
    }
  }
  const page = await browser.newPage();
  for (const r of todosOsRegistos()) {
    const antiga = routePath('texto', r.lang, { slug: r.slug });
    const nova = routePath('estudo', r.lang, { slug: r.slug });
    await page.goto(base + antiga + '/', { waitUntil: 'networkidle' });
    await page.waitForURL(base + nova + '/');
    assert.equal(await page.locator('[data-registo-edicao]').getAttribute('data-registo-edicao'), `${r.slug}/${r.lang}`);
    resultados.push({ antiga, nova, destino: new URL(page.url()).pathname, corpo: true });
  }
  await fs.writeFile(path.join(pasta, 'navegacao-peca1.json'), JSON.stringify({ navegador: browser.version(), resultados }, null, 2) + '\n');
  console.log(`${resultados.length} verificações no navegador, todas cumpridas.`);
} finally { await browser.close(); await new Promise(r => servidor.close(r)); }
