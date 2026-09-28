/** Recortes para inspeção visual do calendário e das verificações nos recibos. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
const [fase, pasta] = process.argv.slice(2);
if (!['antes', 'depois'].includes(fase) || !pasta) throw new Error('Uso: pormenores-c1.mjs antes|depois <construção>');
const dist = path.resolve(pasta), base = new URL('./', import.meta.url);
const servidor = http.createServer(async (req, res) => {
  try {
    let p = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!p.startsWith(dist + path.sep)) throw new Error('Caminho inválido');
    if ((await fs.stat(p)).isDirectory()) p = path.join(p, 'index.html');
    res.setHeader('Content-Type', {'.css': 'text/css', '.html':'text/html', '.woff2':'font/woff2', '.js':'text/javascript'}[path.extname(p)] ?? 'application/octet-stream');
    res.end(await fs.readFile(p));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`, imagens = [];
const browser = await chromium.launch();
try {
  for (const lang of ['pt','en']) for (const largura of [390,1280]) {
    const ctx = await browser.newContext({ viewport:{width:largura,height:900}, reducedMotion:'reduce' });
    await ctx.route('**/*', r => new URL(r.request().url()).origin === origem ? r.continue() : r.abort());
    const page = await ctx.newPage();
    for (const [nome, rota, seletor] of [
      ['calendario', lang === 'pt' ? '/municipios/evora/' : '/en/municipalities/evora/', '[data-instrumento="mandatos"] > .instr-top'],
      ['pib', lang === 'pt' ? '/livro-razao/pib-real-per-capita-2025/' : '/en/ledger/pib-real-per-capita-2025/', '[aria-labelledby="verificacoes"]'],
      ['divida-ue', lang === 'pt' ? '/livro-razao/divida-das-familias-2025-ue/' : '/en/ledger/divida-das-familias-2025-ue/', '[aria-labelledby="verificacoes"]'],
    ]) {
      await page.goto(origem+rota, {waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
      const ficheiro=`capturas/pormenor-${fase}-${nome}-${lang}-${largura}.png`;
      let bytes;
      if (nome === 'calendario') {
        const a = await page.locator('.mun-serie-svg').boundingBox();
        const b = await page.locator('.mun-banda-svg').boundingBox();
        bytes = await page.screenshot({path:new URL(ficheiro,base).pathname, fullPage:true, clip:{x:a.x,y:a.y,width:a.width,height:b.y+b.height-a.y}});
      } else bytes=await page.locator(seletor).screenshot({path:new URL(ficheiro,base).pathname});
      imagens.push({ficheiro, rota, seletor, lang, largura, sha256:createHash('sha256').update(bytes).digest('hex')});
    }
    await ctx.close();
  }
  await fs.writeFile(new URL(`pormenores-${fase}.json`,base), JSON.stringify({fase,imagens},null,2)+'\n');
  console.log(`${imagens.length} recortes de inspeção.`);
} finally { await browser.close(); await new Promise(resolve=>servidor.close(resolve)); }
