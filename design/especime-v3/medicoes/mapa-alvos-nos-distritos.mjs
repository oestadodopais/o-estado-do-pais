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
 * `tests/inicio/mapa-unidades.mjs`, com o mesmo passo de 2 px. Não é um portão e
 * não é uma régua: imprime, e sai com 0.
 *
 * O QUE ELE MEDIU A 08.09.2026: 84 de 308 concelhos chegam aos 44 px, a mediana
 * é 34 px e o menor é Câmara de Lobos com 4 px, num desenho de 354 px de largura.
 * No nível da região da primeira página, à mesma largura, são 20 de 308 com uma
 * mediana de 16 px. Um nível intermédio por distrito subiria a conta de 20 para
 * 84 e continuaria longe dos 308; e o desenho desse nível já existe como página.
 *
 * ---------------------------------------------------------------------------
 * ELE EXIGE AS 29 E OS 308, E ESCREVE O QUE MEDIU
 * ---------------------------------------------------------------------------
 * A primeira forma deste ficheiro saltava um distrito cujo `svg` não respondesse,
 * imprimia um total mais pequeno e saía com 0: uma medida parcial com cara de
 * medida inteira, e o número só existia em prosa no relatório (leitura a frio do
 * Codex de 08.09.2026, achado 16). Agora conta as unidades e os concelhos, SAI
 * COM 1 se não forem 29 e 308, e grava
 * `design/especime-v3/medicoes/mapa-alvos-nos-distritos.json` com a conta por
 * unidade, para que o número do relatório se leia de um ficheiro e não de uma
 * frase.
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
const porUnidade = []; const falhas = [];
const esperados = pais.unidades.reduce((s,u)=>s+JSON.parse(fs.readFileSync(path.join(RAIZ,'mapa/distritos',u.slug+'.json'),'utf8')).concelhos.length, 0);
for (const u of pais.unidades) {
  const art = JSON.parse(fs.readFileSync(path.join(RAIZ,'mapa/distritos',u.slug+'.json'),'utf8'));
  const pts = Object.fromEntries(art.concelhos.map(c=>[c.slug,c.ponto]));
  await p.goto(`${base}/distritos/${u.slug}`,{waitUntil:'domcontentloaded'});
  const seletor = '[data-mapa-concelhos]';
  const r = await p.evaluate(INSCRITO, { pontos: pts, PASSO: 2, seletor });
  if (r.erro) { falhas.push(`${u.slug}: ${r.erro}`); console.log(u.slug, r.erro); continue; }
  svgW = await p.evaluate((sel)=>Math.round(document.querySelector(sel).getBoundingClientRect().width), seletor);
  const es = Object.entries(r); total+=es.length; ok+=es.filter(([,v])=>v.inscrito>=44).length;
  if (es.length !== art.concelhos.length) falhas.push(`${u.slug}: mediu ${es.length} concelhos e o artefacto tem ${art.concelhos.length}`);
  todos.push(...es.map(([s,v])=>[s,v.inscrito]));
  const menor = es.reduce((a,b)=>b[1].inscrito<a[1].inscrito?b:a);
  porUnidade.push({ unidade: u.slug, concelhos: es.length, chegam: es.filter(([,v])=>v.inscrito>=44).length, menor: { slug: menor[0], inscrito: menor[1].inscrito }, desenhoPx: svgW });
  console.log(u.slug.padEnd(22), es.length, 'concelhos ·', es.filter(([,v])=>v.inscrito>=44).length, 'com 44 px · pior', Math.min(...es.map(([,v])=>v.inscrito)), 'px · desenho', svgW, 'px');
}
todos.sort((a,b)=>a[1]-b[1]);
/* A MEDIANA COM `n` PAR É A MÉDIA DOS DOIS DO MEIO (F1.1e, segunda passagem,
   08.09.2026). Este guião devolvia o observado de cima, `todos[floor(n/2)]`, que
   é um quantil e não a mediana: com 308 concelhos o número saía do lugar 154 e a
   mediana é a média dos lugares 153 e 154 (leitura a frio do Codex, achado 15).
   É a mesma emenda que a régua do bloco levou, e as duas dizem-no. */
const mediana = (ns) => {
  if (ns.length === 0) return null;
  const meio = Math.floor(ns.length / 2);
  return ns.length % 2 === 1 ? ns[meio] : (ns[meio - 1] + ns[meio]) / 2;
};
const MEDIANA = mediana(todos.map((t) => t[1]));
if (porUnidade.length !== pais.unidades.length) falhas.push(`mediu ${porUnidade.length} unidades e a Carta tem ${pais.unidades.length}`);
if (total !== esperados) falhas.push(`mediu ${total} concelhos e os artefactos têm ${esperados}`);
if (esperados !== 308) falhas.push(`os artefactos somam ${esperados} concelhos, e não 308`);
const artefacto = {
  sobre: 'F1.1d · o alvo de cada concelho na página do seu distrito, a 390 px',
  comando: 'node design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs',
  medido: new Date().toISOString(),
  passoPx: 2,
  alvoPx: 44,
  larguraDaJanelaPx: 390,
  unidades: porUnidade.length,
  concelhos: total,
  chegamA44: ok,
  mediana: MEDIANA,
  menor: todos.length ? { slug: todos[0][0], inscrito: todos[0][1] } : null,
  porUnidade,
};
const SAIDA = path.join(RAIZ,'design/especime-v3/medicoes/mapa-alvos-nos-distritos.json');
fs.writeFileSync(SAIDA, `${JSON.stringify(artefacto,null,2)}\n`);
console.log(`TOTAL nas páginas de distrito a 390: ${ok} de ${total} com 44 px · mediana ${MEDIANA} px · pior ${todos[0][0]} ${todos[0][1]} px`);
console.log(`escrito ${path.relative(RAIZ,SAIDA)} · ${porUnidade.length} unidades, ${total} concelhos`);
await nav.close(); servidor.close();
if (falhas.length) { console.error('\n  MEDIDA INCOMPLETA:'); for (const f of falhas) console.error('    · '+f); process.exit(1); }
