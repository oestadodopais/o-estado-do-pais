import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(path.join(process.cwd(),'package.json')), {parse}=require('node-html-parser');
const {loadClaims}=await import(pathToFileURL(path.join(process.cwd(),'src/lib/ledger.mjs')));
const claims=loadClaims(),ids=[...claims.keys()].filter(id=>/^(sns-(cirurgias|consultas-hospitalares|urgencias)-202[56]-07|der-sns-cirurgias-variacao-pct|sns-(lista-cirurgia-2026-07|consultas-csp-2026-08)|dgo-atraso-45-p|eurostat-(pt|be|el)-phys|pe-(oe-beira-abolicao|dl87a-apoio-retificado|dl87a-descontos)|prr-marcos-metas-2025-p2-1-(29|4|13|20|6)-estado|infarmed-.*-encargo)/.test(id));
const norm=s=>s.replace(/\s+/g,' ').trim(),out={cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,recibos:[]};
for(const lang of ['pt','en'])for(const id of ids){
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 const nota=root.querySelector('#ressalva [data-linha-campo="ressalva"]'),c=claims.get(id),expected=lang==='pt'?c.ressalva:c.ressalva_en;
 if(expected)assert.equal(norm(nota.text),norm(expected));
 out.recibos.push({id,lang,nome:norm(root.querySelector('h1').text),ressalva:nota?norm(nota.text):null});
}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({recibos:out.recibos.length}));
