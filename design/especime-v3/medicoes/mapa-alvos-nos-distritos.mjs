#!/usr/bin/env node
/**
 * =============================================================================
 * O ALVO DE UM CONCELHO NA PÁGINA DO SEU DISTRITO · a medida que decidiu o
 * nível intermédio do F1.1d (08.09.2026)
 * =============================================================================
 *
 * O brief do F1.1d deixa uma decisão a medir: se o mapa da primeira página deve
 * ganhar um nível intermédio por distrito, entre as nove regiões e os concelhos.
 * Este ficheiro é a medida que a decidiu, e fica no repositório para que o
 * número do relatório se possa refazer:
 *
 *   node design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs
 *
 * Corre sobre `dist/` e mede, nas 29 páginas de distrito construídas e a 390 px,
 * o MAIOR QUADRADO INSCRITO à volta do ponto representativo de cada concelho
 * (I82), que é a mesma conta de `tests/inicio/mapa-distritos.mjs` e de
 * `tests/inicio/mapa-regioes.mjs`, com o mesmo passo de 2 px. Não é um portão e
 * não é uma régua: imprime, e sai com 0.
 *
 * O QUE ELE MEDIU A 08.09.2026: 84 de 308 concelhos chegam aos 44 px, a mediana
 * é 34 px e o menor é Câmara de Lobos com 4 px, num desenho de 354 px de largura.
 * No nível da região da primeira página, à mesma largura, são 20 de 308 com uma
 * mediana de 16 px. Um nível intermédio por distrito subiria a conta de 20 para
 * 84 e continuaria longe dos 308; e o desenho desse nível já existe como página.
 */
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const DIST = path.join(RAIZ,'dist');
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.csv':'text/csv','.xml':'application/xml','.ico':'image/x-icon','.txt':'text/plain' };
const servidor = http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);let abs=path.join(DIST,p);if(!path.extname(abs))abs=path.join(abs,'index.html');if(!fs.existsSync(abs)){res.writeHead(404);res.end('404');return;}res.writeHead(200,{'content-type':MIME[path.extname(abs)]??'application/octet-stream'});res.end(fs.readFileSync(abs));});
await new Promise(r=>servidor.listen(0,r));
const base=`http://127.0.0.1:${servidor.address().port}`;
const INSCRITO = ({ pontos, PASSO, seletor }) => {
  const svg = document.querySelector(seletor);
  if (!svg) return { erro: 'sem svg' };
  const inv = svg.getScreenCTM().inverse();
  const p0 = new DOMPoint(0,0).matrixTransform(inv); const p1 = new DOMPoint(1,0).matrixTransform(inv);
  const u = Math.hypot(p1.x-p0.x, p1.y-p0.y); const passo = PASSO*u;
  const out = {};
  for (const el of svg.querySelectorAll('.uni')) {
    const slug = el.getAttribute('data-unidade') || el.getAttribute('data-concelho') || (el.parentNode && el.parentNode.getAttribute ? el.parentNode.getAttribute('data-concelho-porta') : null);
    const pr = pontos[slug]; if (!pr) continue;
    const bb = el.getBBox(); const [px,py]=pr;
    const x0 = px - Math.ceil((px-bb.x)/passo)*passo; const y0 = py - Math.ceil((py-bb.y)/passo)*passo;
    const cols = Math.ceil((bb.x+bb.width-x0)/passo)+1; const rows = Math.ceil((bb.y+bb.height-y0)/passo)+1;
    const dentro=[]; for(let r=0;r<rows;r++){const l=new Uint8Array(cols);for(let c=0;c<cols;c++)l[c]=el.isPointInFill(new DOMPoint(x0+c*passo,y0+r*passo))?1:0;dentro.push(l);}
    const ic=Math.round((px-x0)/passo), ir=Math.round((py-y0)/passo);
    const dp=dentro.map(l=>new Int32Array(l.length));
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(!dentro[r][c]){dp[r][c]=0;continue;}dp[r][c]=r===0||c===0?1:1+Math.min(dp[r-1][c],dp[r][c-1],dp[r-1][c-1]);}
    let contem=0; for(let r=ir;r<rows;r++)for(let c=ic;c<cols;c++){const k=dp[r][c];if(k<=contem)continue;if(r-k+1<=ir&&c-k+1<=ic)contem=k;}
    out[slug]={inscrito:Math.max(0,(contem-1)*PASSO)};
  }
  return out;
};
const pais = JSON.parse(fs.readFileSync(path.join(RAIZ,'mapa/pais.json'),'utf8'));
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport:{width:390,height:664} });
const p = await ctx.newPage();
let total=0, ok=0; const todos=[];
let svgW = 0;
for (const u of pais.unidades) {
  const art = JSON.parse(fs.readFileSync(path.join(RAIZ,'mapa/distritos',u.slug+'.json'),'utf8'));
  const pts = Object.fromEntries(art.concelhos.map(c=>[c.slug,c.ponto]));
  await p.goto(`${base}/distritos/${u.slug}`,{waitUntil:'domcontentloaded'});
  const seletor = '[data-mapa-concelhos]';
  const r = await p.evaluate(INSCRITO, { pontos: pts, PASSO: 2, seletor });
  if (r.erro) { console.log(u.slug, r.erro); continue; }
  svgW = await p.evaluate((sel)=>Math.round(document.querySelector(sel).getBoundingClientRect().width), seletor);
  const es = Object.entries(r); total+=es.length; ok+=es.filter(([,v])=>v.inscrito>=44).length;
  todos.push(...es.map(([s,v])=>[s,v.inscrito]));
  console.log(u.slug.padEnd(22), es.length, 'concelhos ·', es.filter(([,v])=>v.inscrito>=44).length, 'com 44 px · pior', Math.min(...es.map(([,v])=>v.inscrito)), 'px · desenho', svgW, 'px');
}
todos.sort((a,b)=>a[1]-b[1]);
console.log(`TOTAL nas páginas de distrito a 390: ${ok} de ${total} com 44 px · mediana ${todos[Math.floor(todos.length/2)][1]} px · pior ${todos[0][0]} ${todos[0][1]} px`);
await nav.close(); servidor.close();
