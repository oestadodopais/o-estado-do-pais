/** RP4-n-d: mede a célula em vigor e conserva o inventário por página. */
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
const base=path.dirname(new URL(import.meta.url).pathname);
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
assert.equal(totais.recusadas,0,'a cabeça final não aceita marcas fora dos tipos');
const resultado={comando:`node design/especime-v3/medicoes/rp4n-2026-10-06/medir-d.mjs`,cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),totais,tipos:resumirMarcadores(paginas),paginas};
const destino=path.join(base,'d');fs.mkdirSync(destino,{recursive:true});
fs.writeFileSync(path.join(destino,'medidas.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({totais,recusadas:paginas.flatMap(p=>p.recusadas.map(m=>({pagina:p.pagina,...m})))},null,2));
