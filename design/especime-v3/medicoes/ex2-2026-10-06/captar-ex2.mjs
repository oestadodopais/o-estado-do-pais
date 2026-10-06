/** EX2: capturas das duas páginas nas cinco larguras, com recortes, texto lido e resumos dos bytes. */
import fs from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const AQUI=path.dirname(new URL(import.meta.url).pathname);
const DIST=path.resolve('dist'), CAP='design/especime-v3/capturas/ex2-2026-10-06';
const versao=JSON.parse(await fs.readFile(path.join(DIST,'version.json'),'utf8'));
const cabeca=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(versao.commit!==cabeca) throw Error('as capturas exigem a construção da cabeça');
const tipos={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const servidor=http.createServer(async(req,res)=>{try{let f=path.resolve(DIST,'.'+new URL(req.url,'http://x').pathname);if(!f.startsWith(DIST+path.sep)&&f!==DIST)throw Error('fora');if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',tipos[path.extname(f)]??'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404).end();}});
await new Promise(ok=>servidor.listen(0,'127.0.0.1',ok));
const origem=`http://127.0.0.1:${servidor.address().port}`;
const browser=await chromium.launch({headless:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const capturas=[],erros=[];
const rotas=[['semana','pt','/explicacoes/leitura-da-semana/'],['semana','en','/en/explainers/weekly-reading/'],['indice','pt','/indice/'],['indice','en','/en/index/']];
await fs.mkdir(CAP,{recursive:true});
try{
 for(const [nome,lang,rota] of rotas)for(const largura of [390,768,1024,1280,1600]){
  const ctx=await browser.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:'light'});
  await ctx.route('**/*',r=>r.request().url().startsWith(origem)?r.continue():r.abort());
  const p=await ctx.newPage();const resp=await p.goto(origem+rota,{waitUntil:'load'});if(resp.status()!==200)throw Error('página em falta');await p.evaluate(()=>document.fonts.ready);
  const medidas=await p.evaluate(()=>({largura:document.documentElement.scrollWidth,janela:innerWidth,frases:[...document.querySelectorAll('main [data-o-que-e],main [data-o-que-e-por-confirmar]')].map(e=>({linha:e.dataset.oQueE??e.dataset.oQueEPorConfirmar,por_confirmar:e.hasAttribute('data-o-que-e-por-confirmar'),texto:e.textContent.trim(),display:getComputedStyle(e).display}))}));
  if(medidas.largura>largura+1)erros.push(`${rota}: transbordo a ${largura}`);
  for(const [sufixo,alvo] of [['inteira',null],['mudancas',nome==='semana'?'[data-semana-seccao="mudancas"]':'[data-indice-seccao="mudou"]']]){
   const ficheiro=`${CAP}/${nome}-${lang}-${largura}-${sufixo}.png`;
   const anterior=ficheiro.replace(/\.png$/, '-antes.png');
   try { await fs.copyFile(ficheiro,anterior,constants.COPYFILE_EXCL); } catch(e) { if(!['EEXIST','ENOENT'].includes(e.code)) throw e; }
   const bytes=alvo?await p.locator(alvo).screenshot({path:ficheiro}):await p.screenshot({path:ficheiro,fullPage:true});
   capturas.push({nome,lang,rota,largura,sufixo,ficheiro,sha256:sha(bytes),medidas});
  }
  await ctx.close();
 }
}finally{await browser.close();servidor.close();}
const anterior=JSON.parse(await fs.readFile(path.join(AQUI,'capturas.json'),'utf8'));
const arquivo={...anterior,comando:'node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs',origem:'capturas.json',capturas:anterior.capturas.map(c=>({...c,ficheiro:c.ficheiro.replace(/\.png$/, '-antes.png')}))};
try { await fs.writeFile(path.join(AQUI,'capturas-antes.json'),JSON.stringify(arquivo,null,2)+'\n',{flag:'wx'}); } catch(e) { if(e.code!=='EEXIST') throw e; }
const manifesto={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs',cabeca,versao,capturas,erros};
await fs.writeFile(path.join(AQUI,'capturas-b.json'),JSON.stringify(manifesto,null,2)+'\n');
console.log(JSON.stringify({capturas:capturas.length,erros}));
if(erros.length)process.exitCode=1;
