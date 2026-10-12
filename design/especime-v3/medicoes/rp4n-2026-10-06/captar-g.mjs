/** RP4-n-g: recibos e área nas duas edições, a 390 e a 1280 px.
 * Uso: node design/especime-v3/medicoes/rp4n-2026-10-06/captar-g.mjs g-antes|g
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const fase = process.argv[2];
if (!['g-antes', 'g'].includes(fase)) throw Error('Indique g-antes ou g.');
const base = 'design/especime-v3/medicoes/rp4n-2026-10-06';
const saida = `design/especime-v3/capturas/rp4n-2026-10-06/${fase}`;
const dist = path.resolve('dist');
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
const amostra = fase === 'g-antes' ? {area:'@areas/economia-e-coesao-territorial'} : {agua:'agua-nao-faturada-portugal-2024', corte:'penalizacao-antecipacao-um-ano-neutra', area:'@areas/economia-e-coesao-territorial'};
const tipos = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.js':'text/javascript'};
const servidor = http.createServer(async (req, res) => {
  try {
    let p = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!p.startsWith(dist + path.sep)) throw Error('fora');
    if ((await fs.stat(p)).isDirectory()) p = path.join(p, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(p)] ?? 'application/octet-stream');
    res.end(await fs.readFile(p));
  } catch { res.writeHead(404).end(); }
});
await fs.mkdir(saida, {recursive:true});
await fs.mkdir(`${base}/${fase}/recibos`, {recursive:true});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const browser = await chromium.launch({headless:true});
const capturas = [], problemas = [];
try {
  for (const [nome, id] of Object.entries(amostra)) for (const lang of ['pt','en']) {
    const rota = id.startsWith('@') ? `/${lang === 'en' ? 'en/' : ''}${id.slice(1)}/` : `/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/`;
    await fs.copyFile(path.join(dist, rota, 'index.html'), `${base}/${fase}/recibos/${nome}-${lang}.html`);
    for (const largura of [390,1280]) {
      const ctx = await browser.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:'light'});
      await ctx.route('**/*', r => r.request().url().startsWith(origem) ? r.continue() : r.abort());
      const p = await ctx.newPage();
      p.on('pageerror', e => problemas.push(`${nome}/${lang}: ${String(e)}`));
      const resposta = await p.goto(origem + rota, {waitUntil:'networkidle'});
      if (resposta.status() !== 200) throw Error(`Recibo não encontrado: ${rota}`);
      await p.evaluate(() => document.fonts.ready);
      const imagens = await p.evaluate(async () => {
        return Promise.all([...document.images].map(async img => {
          img.loading = 'eager';
          try { await img.decode(); } catch {}
          return {src:img.getAttribute('src'),carregada:img.complete && img.naturalWidth>0};
        }));
      });
      for (const img of imagens) if (!img.carregada) problemas.push(`${nome}/${lang}/${largura}: imagem não carregada ${img.src}`);
      const m = await p.evaluate(() => ({largura_documento:document.documentElement.scrollWidth,
        frase:(document.querySelector('[data-o-que-e]') ?? document.querySelector('[data-o-que-e-da-serie]'))?.textContent.trim(),
        marcadores:document.querySelectorAll('[data-por-confirmar-na-fonte]').length}));
      const ficheiro = `${saida}/${nome}-${lang}-${largura}.png`;
      const bytes = await p.screenshot({path:ficheiro,fullPage:true});
      if (m.largura_documento > largura) problemas.push(`${nome}/${lang}/${largura}: transbordo ${m.largura_documento}`);
      capturas.push({ficheiro,rota,lang,largura,...m,imagens,sha256:createHash('sha256').update(bytes).digest('hex')});
      await ctx.close();
    }
  }
} finally { await browser.close(); servidor.close(); }
await fs.writeFile(`${base}/${fase}/capturas.json`, JSON.stringify({cabeca_da_captura:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),versao,capturas,problemas},null,2)+'\n');
console.log(JSON.stringify({capturas:capturas.length,problemas}));
if (problemas.length) process.exitCode = 1;
