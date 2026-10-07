/** Uso: node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs antes|depois [pasta do HTML]
 * Antes: a cópia do HTML construído na primeira passagem; depois: dist.
 */
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
const fase=process.argv[2];
assert(['antes','depois'].includes(fase));
const origem=process.argv[3]??'dist';
const claims=loadClaims(), paginas=[];
function visitar(pasta){for(const f of fs.readdirSync(pasta,{withFileTypes:true})){
 const p=path.join(pasta,f.name);if(f.isDirectory()){visitar(p);continue;}if(!p.endsWith('.html'))continue;
 const rel=path.relative(origem,p), bytes=fs.readFileSync(p);
 const rota=matchPath('/'+rel.replace(/index\.html$/,'').replace(/\.html$/,'').replace(/\/$/,''));
 const marcas=inventariarMarcadores(parse(bytes.toString()),{rota,claims,municipios:MUNICIPIOS_COM_PAGINA});
 if(marcas.aceites.length+marcas.recusadas.length)paginas.push({pagina:`dist/${rel}`,sha256:createHash('sha256').update(bytes).digest('hex'),...marcas});
}}
visitar(origem);
paginas.sort((a,b)=>a.pagina.localeCompare(b.pagina));
const tipos=resumirMarcadores(paginas);
const totais={paginas:paginas.length,aceites:paginas.reduce((n,p)=>n+p.aceites.length,0),recusadas:paginas.reduce((n,p)=>n+p.recusadas.length,0)};
if(fase==='antes'){
 const primeira=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/depois/medidas.json'));
 assert.equal(totais.paginas,primeira.contagens.paginas_com_marcadores);
 assert.equal(totais.aceites+totais.recusadas,primeira.contagens.marcas_nas_paginas);
 for(const p of paginas)assert.equal(p.sha256,primeira.paginas_com_marcadores.find(a=>a.ficheiro===p.pagina)?.sha256);
}
const naoAbrangidas={};
for(const p of paginas)for(const m of p.recusadas.filter(m=>m.tipo==='fora-dos-tipos'))naoAbrangidas[m.superficie]=(naoAbrangidas[m.superficie]??0)+1;
const resultado={naoAbrangidas,comando:`node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs ${fase}${fase==='antes'?' <copia-do-HTML-anterior>':''}`,cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),totais,tipos,paginas};
const destino=`design/especime-v3/medicoes/rp4n-2026-10-06/${fase}-b`;
fs.mkdirSync(destino,{recursive:true});fs.writeFileSync(`${destino}/medidas.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({totais,tipos:Object.fromEntries(Object.entries(tipos).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).map(([t,d])=>[t,d.ocorrencias]))]))},null,2));
