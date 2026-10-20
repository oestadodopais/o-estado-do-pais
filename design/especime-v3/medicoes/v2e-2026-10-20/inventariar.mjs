/** Recolhe as cadeias V2-e que a régua encontrou no HTML construído. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.cwd(),'package.json'));
const {parse}=require('node-html-parser');
const medicao=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const frases=new Map(),nav=new Set();
const norm=s=>s.replace(/\s+/g,' ').trim();
const texto=n=>n.nodeType===3?n.rawText:(n.childNodes??[]).map(texto).join(' ');
const conhecidas=new Set(fs.readFileSync('design/especime-v3/INVENTARIO-FRASES.md','utf8').split('\n').filter(l=>l.startsWith('|')).map(l=>l.split('|')[2]?.trim()));
for(const rota of ['/','/en','/o-que-se-discute','/en/under-discussion','/explicacoes/dinheiro-do-estado-2026','/en/explainers/dinheiro-do-estado-2026','/livro-razao','/en/ledger']) {
 const p=path.join('dist',rota,'index.html');
 const root=parse(fs.readFileSync(p,'utf8'));
 for(const n of root.querySelectorAll('[data-discussao-inicio] a,[data-discussao-porta],[data-discussao-integracao] a,footer a'))nav.add(norm(texto(n)));
 for(const n of root.querySelectorAll('[data-discussao-integracao] a,[data-discussao-inicio] h2 a')) {
  const t=norm(texto(n));if(!conhecidas.has(t)){const f=frases.get(t)??{texto:t,classe:'navegacao',rotas:[]};f.rotas.push(rota);frases.set(t,f);}
 }
 for(const texto of medicao.frases_da_casa.por_rota[rota]?.nao_classificados??[]) {
  const f=frases.get(texto)??{texto,classe:nav.has(texto)?'navegacao':'conteudo',rotas:[]};f.rotas.push(rota);frases.set(texto,f);
 }
}
for(const f of frases.values()) if(nav.has(f.texto))f.classe='navegacao';
const outros=Object.entries(medicao.frases_da_casa.por_rota).flatMap(([rota,d])=>d.nao_classificados.filter(t=>!frases.has(t)).map(texto=>({rota,texto})));
if(outros.length)throw new Error('Há cadeias fora do âmbito V2-e: '+JSON.stringify(outros.slice(0,8)));
const file='design/especime-v3/INVENTARIO-FRASES.md';
let original=fs.readFileSync(file,'utf8');
const retiradas=medicao.frases_da_casa.declaracoes.vivas_que_nao_rendem;
const linhas=original.split('\n');
for(const r of retiradas){
 if(!['v2b','v2d','v2e','ex3'].includes(r.bloco))throw new Error('Retirada fora do âmbito: '+r.bloco);
 if(!linhas[r.n-1]?.includes('| viva |'))throw new Error('Estado alterado desde a medição');
 if([...frases.values()].some(f=>f.texto.includes(r.texto))){linhas[r.n-1]='';continue;}
 linhas[r.n-1]=linhas[r.n-1].replace('| viva |','| retirada |').replace(/\|\s*$/, 'Substituída no V2-e pela análise ou pela contagem atual do livro. |');
}
original=linhas.join('\n');
for(const f of frases.values()) {
 if(f.texto.includes('|')||f.texto.includes('\n'))throw new Error('Cadeia exige escape');
 original+=`\n| ${f.classe} | ${f.texto} | v2e | viva | Recolhida do HTML construído. Tokens conferidos pela célula dos itens e pela auditoria das palavras. Leitura cruzada pendente. |`;
}
if(frases.size||retiradas.length){
 fs.writeFileSync(file,original.replace(/\n+$/,'')+'\n');
 const r='design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';
 fs.appendFileSync(r,`\n## V2-e: os dois itens e as portas\n\n| bloco | mudança | estado | nota |\n|---|---|---|---|\n| v2e | ${frases.size} cadeias novas recolhidas do HTML nas duas edições; ${retiradas.length} declarações anteriores retiradas | por ler | Codex gpt-6-astra, 20.10.2026: títulos, rótulos, prosa e navegação conferidos na construção; os valores, as citações e as atribuições continuam presos aos tokens. A leitura cruzada pertence à direção. |\n`);
}
fs.writeFileSync(process.argv[3],JSON.stringify({cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,total:frases.size,frases:[...frases.values()]},null,2)+'\n');
console.log(JSON.stringify({cadeias:frases.size,por_classe:Object.fromEntries(['conteudo','navegacao'].map(c=>[c,[...frases.values()].filter(f=>f.classe===c).length]))}));
