import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
import {AMOSTRA_CONTAS, AMOSTRA_LIGACAO} from './amostras-leitura.mjs';
assert.notEqual(AMOSTRA_CONTAS,AMOSTRA_LIGACAO);
const dist=path.resolve(process.env.OEDP_DIST??'dist');
const tipos={'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.svg':'image/svg+xml'};
const servidor=http.createServer((req,res)=>{
  let f=path.resolve(dist,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!f.startsWith(dist+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404).end();return;}
  res.writeHead(200,{'content-type':tipos[path.extname(f)]??'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r=>servidor.listen(0,'127.0.0.1',r));
let nav;
try {
  nav=await chromium.launch({headless:true});
  const p=await nav.newPage({viewport:{width:390,height:900}});
  for(const rota of [AMOSTRA_LIGACAO,AMOSTRA_LIGACAO.replace('/estudos/','/en/studies/')]) {
    await p.goto(`http://127.0.0.1:${servidor.address().port}${rota}`,{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    const medir=()=>p.evaluate(()=>{
      const a=[...document.querySelectorAll('.texto-artigo .texto-ligacao')].sort((a,b)=>b.textContent.length-a.textContent.length)[0];
      if(!a)return null;
      const r=a.getBoundingClientRect();
      return {caracteres:a.textContent.length,quebra:getComputedStyle(a).overflowWrap,linhas:a.getClientRects().length,cabe:r.right<=innerWidth+1};
    });
    const aceita=m=>m&&m.caracteres>=100&&m.quebra==='anywhere'&&m.linhas>1&&m.cabe;
    const antes=await medir();assert(aceita(antes),`${rota}: ${JSON.stringify(antes)}`);
    await p.addStyleTag({content:'.texto-artigo .texto-ligacao{overflow-wrap:normal!important;white-space:nowrap!important}'});
    assert(!aceita(await medir()),'a planta sem quebra passou');
    console.log(`RET1 amostra ${rota}: ${antes.caracteres} caracteres, ${antes.linhas} linhas a 390 px; retirar a quebra recusa.`);
  }
} finally {await nav?.close();await new Promise(r=>servidor.close(r));}
