import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import{loadClaims}from'../../../../src/lib/ledger.mjs';
const id='ciclo-substituicao-condutas',linha=loadClaims({includeWithdrawn:true}).get(id);
const html=[];
function andar(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())andar(f);else if(f.endsWith('.html'))html.push(f);}}
andar('dist');
const referencias=[],digest=crypto.createHash('sha256');
for(const p of html.sort()){const b=fs.readFileSync(p);digest.update(p);digest.update(b);if(b.includes(id))referencias.push(p);}
const paginas=['livro-razao','en/ledger'].map(p=>({caminho:`dist/${p}/${id}/index.html`,existe:fs.existsSync(`dist/${p}/${id}/index.html`)}));
const resultado={versao:JSON.parse(fs.readFileSync('dist/version.json')),linha:{id,publication:linha.publication,value:linha.value,conservada_no_livro:true,no_carregador_publico:loadClaims().has(id)},paginas,html_conferidos:html.length,sha256_do_conjunto:digest.digest('hex'),referencias};
const base='design/especime-v3/medicoes/rp4n-2026-10-06/e';fs.mkdirSync(base,{recursive:true});fs.writeFileSync(base+'/retirada.json',JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify(resultado));if(paginas.some(p=>p.existe)||referencias.length||resultado.linha.no_carregador_publico)process.exitCode=1;
