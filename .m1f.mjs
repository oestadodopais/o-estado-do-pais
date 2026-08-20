import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright';
const DIST='/Users/nunosantos/Instruments/OEstadoDoPais/dist';
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.txt':'text/plain','.png':'image/png','.csv':'text/csv','.xml':'application/xml'};
const srv=http.createServer((q,r)=>{let u=q.url.split('?')[0];let f=path.resolve(DIST,'.'+decodeURIComponent(u));
 if(!f.startsWith(DIST))return r.writeHead(403).end();
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
 if(!fs.existsSync(f))return r.writeHead(404).end();
 r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const base=`http://127.0.0.1:${srv.address().port}`;
const b=await chromium.launch({headless:true});
for (const rota of ['/','/en/','/correcoes/'])
 for (const w of [320,390,1280]) {
  const p=await b.newPage({viewport:{width:w,height:w===1280?900:844}});
  await p.goto(base+rota,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{await document.fonts.ready;});
  const r=await p.evaluate(()=>{
    const nav=document.querySelector('.nav-principal');
    const itens=[...nav.querySelectorAll('a')];
    const menu=document.querySelector('.nav-menu');
    const menuVis=menu&&getComputedStyle(menu).display!=='none';
    const navVis=getComputedStyle(nav).display!=='none';
    const linhas=navVis? new Set(itens.map(a=>Math.round(a.getBoundingClientRect().top))).size : null;
    const doc=document.documentElement;
    return {n:itens.length, rotulos:itens.map(a=>a.textContent.trim()).join(' · '),
      navVis, menuVis, linhas,
      alturaBarra:+document.querySelector('.topbar').getBoundingClientRect().height.toFixed(1),
      alturaCabecalho:+document.querySelector('header').getBoundingClientRect().height.toFixed(1),
      topoMain:+(document.getElementById('conteudo').getBoundingClientRect().top+scrollY).toFixed(1),
      transbordo: doc.scrollWidth>doc.clientWidth? doc.scrollWidth-doc.clientWidth : 0,
      atual:[...nav.querySelectorAll('a[aria-current="page"]')].map(a=>a.textContent.trim()).join(',')||'(nenhum)'};
  });
  console.log(`${rota} @${w}: ${r.n} itens · nav visível=${r.navVis} menu visível=${r.menuVis} · linhas=${r.linhas} · barra ${r.alturaBarra}px · cabeçalho ${r.alturaCabecalho}px · <main> a ${r.topoMain}px · transbordo ${r.transbordo}px · aria-current=${r.atual}`);
  if(w===1280) console.log(`     ${r.rotulos}`);
  await p.close();
 }
await b.close(); srv.close();
