/* O recibo recusado só pelo excerto, nas edições e larguras do mandato ER1-d. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { t } from '../../../../src/i18n/strings.mjs';
import { chromium } from 'playwright';
const pasta='design/especime-v3/medicoes/er1-2026-10-06';
const destino='design/especime-v3/capturas/er1-2026-10-06/er1-d';
const m=JSON.parse(fs.readFileSync(`${pasta}/contagens-d.json`));
const carimbo=JSON.parse(fs.readFileSync('dist/version.json'));
assert.equal(carimbo.commit,m.cabecaCodigo);
const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const servidor=http.createServer((req,res)=>{
  try{
    let f=path.resolve('dist','.'+new URL(req.url,'http://local.invalid').pathname);
    assert(f.startsWith(path.resolve('dist')+path.sep));
    if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
    res.setHeader('Content-Type',tipos[path.extname(f)]??'application/octet-stream');res.end(fs.readFileSync(f));
  }catch{res.writeHead(404).end();}
});
await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));
const origem=`http://127.0.0.1:${servidor.address().port}`;
const browser=await chromium.launch({headless:true});
const resultado={cabecaCodigo:m.cabecaCodigo,carimbo,comando:`node ${pasta}/capturar-d.mjs`,capturas:[]};
fs.mkdirSync(destino,{recursive:true});
try{
 for(const lang of ['pt','en'])for(const [estado,rota] of Object.entries({recusadoExcerto:m.edicoes[lang].rotas.recusadoExcerto}))for(const largura of [390,1280]){
  const ctx=await browser.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
  const externos=[];
  await ctx.route('**/*',q=>{if(new URL(q.request().url()).origin!==origem){externos.push(new URL(q.request().url()).pathname);return q.abort();}return q.continue();});
  const page=await ctx.newPage();await page.goto(origem+rota,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const bloco=page.locator('[data-incorporar-bloco]');
  assert.equal(await bloco.count(),1);
  assert.equal(await bloco.locator('textarea, button').count(),0);
  assert.equal(await bloco.locator('[data-incorporar-aviso]').textContent(),t(lang).incorporar.indisponivel);
  const dimensoes=await page.evaluate(()=>({janela:innerWidth,documento:document.documentElement.scrollWidth}));
  assert(dimensoes.documento<=dimensoes.janela);assert.deepEqual(externos,[]);
  for(const recorte of ['pagina','incorporar']){
   const ficheiro=`${destino}/${estado}-${lang}-${largura}-${recorte}.png`;
   if(recorte==='pagina')await page.screenshot({path:ficheiro,fullPage:true});
   else await bloco.screenshot({path:ficheiro});
   resultado.capturas.push({ficheiro,estado,lang,rota,largura,recorte,dimensoes,externos,sha256:createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex')});
  }
  await ctx.close();
 }
}finally{await browser.close();servidor.close();}
fs.writeFileSync(`${destino}/capturas.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({cabecaCodigo:resultado.cabecaCodigo,capturas:resultado.capturas.length}));
