import fs from 'node:fs';import path from 'node:path';
const {createRequire}=await import('node:module');const {parse}=createRequire(path.resolve('package.json'))('node-html-parser');
const {matchPath}=await import(path.resolve('src/lib/routes.mjs'));
const modos={integral:[],global:[],estudos:[]};const familias={integral:{},global:{},estudos:{}};const paginas=[];
function* files(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())yield*files(p);else if(e.name.endsWith('.html'))yield p;}}
for(const f of files('dist')){const url='/'+f.slice(5).replace(/index\.html$/,'').replace(/\/$/,'');const rota=matchPath(url);if(rota?.key==='texto'||['/404.html','/en/404'].includes(url))continue;const doc=parse(fs.readFileSync(f,'utf8'));const body=doc.querySelector('body');if(!body)continue;const fora=new Set();for(const el of [doc.querySelector('header'),doc.querySelector('footer')]){if(el){fora.add(el);for(const n of el.querySelectorAll('*'))fora.add(n);}}
const links=body.querySelectorAll('a[href]').filter(a=>!fora.has(a)).map(a=>({href:(a.getAttribute('href')??'').split('#')[0],transcrito:!!a.closest('[data-registo-unidade]')})).filter(a=>a.href&&!a.href.startsWith('mailto:'));
const row={url,familia:rota?.key??'?',resultados:{}};
for(const modo of Object.keys(modos)){const counts=new Map();for(const a of links){if(a.transcrito&&(modo==='global'||modo==='estudos'&&rota?.key==='estudo'))continue;counts.set(a.href,(counts.get(a.href)??0)+1);}const reps=[...counts].filter(([,n])=>n>1);row.resultados[modo]=reps;if(reps.length){modos[modo].push(url);familias[modo][row.familia]=(familias[modo][row.familia]??0)+1;}}
if(Object.values(row.resultados).some(a=>a.length))paginas.push(row);
}
const resultado={cabeca:(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),contagens:Object.fromEntries(Object.entries(modos).map(([k,v])=>[k,v.length])),familias,paginas};fs.writeFileSync(process.argv[2],JSON.stringify(resultado,null,2)+'\n');console.log(resultado.contagens);console.log(familias);
