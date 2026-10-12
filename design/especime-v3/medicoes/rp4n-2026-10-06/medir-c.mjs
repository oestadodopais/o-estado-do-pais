/** RP4-n-c: mede a célula em vigor e conserva o inventário por página. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {matchPath} from '../../../../src/lib/routes.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {MUNICIPIOS_COM_PAGINA} from '../../../../src/data/municipios.mjs';
import {inventariarMarcadores,resumirMarcadores} from '../../../../scripts/sem-marcadores.mjs';
const base=path.dirname(new URL(import.meta.url).pathname), fase=process.argv[2];
assert(['antes','depois'].includes(fase));
const claims=loadClaims(), paginas=[];
function visitar(pasta){for(const f of fs.readdirSync(pasta,{withFileTypes:true})){
 const p=path.join(pasta,f.name);if(f.isDirectory()){visitar(p);continue;}if(!p.endsWith('.html'))continue;
 const bytes=fs.readFileSync(p), rel=path.relative('dist',p);
 const rota=matchPath('/'+rel.replace(/index\.html$/,'').replace(/\.html$/,'').replace(/\/$/,''));
 const marcas=inventariarMarcadores(parse(bytes.toString()),{rota,claims,municipios:MUNICIPIOS_COM_PAGINA});
 if(marcas.aceites.length+marcas.recusadas.length)paginas.push({pagina:p,sha256:createHash('sha256').update(bytes).digest('hex'),...marcas});
}}
visitar('dist');paginas.sort((a,b)=>a.pagina.localeCompare(b.pagina));
const totais={paginas:paginas.length,aceites:paginas.reduce((s,p)=>s+p.aceites.length,0),recusadas:paginas.reduce((s,p)=>s+p.recusadas.length,0)};
if(fase==='antes'){
 const anterior=JSON.parse(fs.readFileSync(path.join(base,'depois-b/medidas.json')));
 assert.deepEqual(totais,anterior.totais);
 assert.deepEqual(paginas,anterior.paginas,'o HTML anterior tem de ser o medido na RP4-n-b');
}else{
 const anterior=JSON.parse(fs.readFileSync(path.join(base,'antes-c/medidas.json')));
 const ocorrencias=ps=>ps.map(p=>({pagina:p.pagina,contextos:[...p.aceites,...p.recusadas].map(m=>m.contexto).sort()}));
 assert.deepEqual(ocorrencias(paginas),ocorrencias(anterior.paginas),'a passagem só muda a classificação das mesmas marcas');
}
const resultado={comando:`node design/especime-v3/medicoes/rp4n-2026-10-06/medir-c.mjs ${fase}`,cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),totais,tipos:resumirMarcadores(paginas),paginas};
const destino=path.join(base,`${fase}-c`);fs.mkdirSync(destino,{recursive:true});
fs.writeFileSync(path.join(destino,'medidas.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({totais,recusadas:paginas.flatMap(p=>p.recusadas.map(m=>({pagina:p.pagina,...m})))},null,2));
