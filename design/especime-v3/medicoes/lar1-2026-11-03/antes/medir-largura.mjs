// LAR1: mede a largura de cada página-modelo do dist/ nas cinco larguras; por página, o scrollWidth e as classes dos elementos folha que passam o ecrã.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const { chromium } = await import(process.env.PW);
const raiz = path.resolve(process.argv[2]); const saida = process.argv[3];
const tipos = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json'};
// a amostra: por família (os dois primeiros segmentos do caminho, com os nomes trocados por *), até duas páginas
const familias = new Map();
const andar = (d, rel) => { for (const e of fs.readdirSync(d,{withFileTypes:true})) { if (!e.isDirectory()) continue; if (['_astro','pagefind','registos'].includes(e.name)) continue;
  const r = rel + '/' + e.name; const f = path.join(d, e.name, 'index.html');
  if (fs.existsSync(f)) { const seg = r.split('/').filter(Boolean); const k = seg.map((s,i)=> i===0 || (seg[0]==='en' && i===1) ? s : '*').join('/'); const l = familias.get(k)||[]; if (l.length<2) l.push(r+'/'); familias.set(k,l); }
  andar(path.join(d,e.name), r); } };
familias.set('/', ['/']); familias.set('/en', ['/en/']); andar(raiz, '');
const paginas = process.env.LISTA ? fs.readFileSync(process.env.LISTA,"utf8").split("\n").filter(Boolean) : [...familias.values()].flat();
const srv = http.createServer((q,r)=>{ let p=decodeURIComponent(q.url.split('?')[0]); let f=path.join(raiz,p); if(fs.existsSync(f)&&fs.statSync(f).isDirectory()) f=path.join(f,'index.html'); if(!fs.existsSync(f)){r.statusCode=404;return r.end();} r.setHeader('content-type',tipos[path.extname(f)]||'application/octet-stream'); fs.createReadStream(f).pipe(r); }).listen(0);
const porta = srv.address().port; const b = await chromium.launch(); const res = [];
for (const w of [390,768,1024,1280,1600]) { const ctx = await b.newContext({viewport:{width:w,height:900}});
  for (const pg of paginas) { const page = await ctx.newPage();
    try { await page.goto(`http://127.0.0.1:${porta}${pg}`,{waitUntil:'load',timeout:30000});
      const r = await page.evaluate((w)=>{ const sw=document.documentElement.scrollWidth; const cls=new Map();
        if (sw>w+1) for (const el of document.querySelectorAll('body *')) { const bb=el.getBoundingClientRect(); if (bb.right>w+1 && el.children.length===0 && bb.width>0) { const k=(el.tagName.toLowerCase()+'.'+(el.className?.toString()||'').split(' ')[0]+' < '+(el.parentElement?.className?.toString()||'').split(' ')[0]+' ['+getComputedStyle(el).whiteSpace+']'); cls.set(k,(cls.get(k)||0)+1); } }
        return {sw, causas:[...cls].sort((a,b)=>b[1]-a[1]).slice(0,5)}; }, w);
      res.push({pagina:pg,largura:w,...r}); } catch(e) { res.push({pagina:pg,largura:w,erro:String(e).slice(0,120)}); }
    await page.close(); }
  await ctx.close(); }
await b.close(); srv.close();
fs.writeFileSync(saida, JSON.stringify({paginas:paginas.length, familias:familias.size, resultados:res},null,1));
const largas = res.filter(r=>r.sw>r.largura+1);
console.log('famílias', familias.size, 'páginas', paginas.length, 'medidas', res.length, 'mais largas do que o ecrã', largas.length, 'erros', res.filter(r=>r.erro).length);
