import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {ficheirosDeTexto,conferirPublicacaoRetirada} from '../../../../scripts/linhas-retiradas.mjs';
const base='design/especime-v3/medicoes/rp4n-2026-10-06/f';fs.mkdirSync(base,{recursive:true});
const todas=loadClaims({includeWithdrawn:true}),publicadas=loadClaims();
const texto=ficheirosDeTexto('dist');const referencias=conferirPublicacaoRetirada('dist',todas);
const retiradas=[...todas.values()].filter(l=>l.source==='[a verificar]').map(l=>({id:l.id,publication:l.publication}));
const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
const anuais=auditoria.familias.filter(e=>JSON.stringify(e).includes('rp4n-ac-ss-orcamento')).flatMap(e=>e.chaves);
const mensais=auditoria.familias.filter(e=>JSON.stringify(e).includes('"rp4n-ac-ss"')).flatMap(e=>e.chaves);
const r={cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),versao:JSON.parse(fs.readFileSync('dist/version.json')),linhas_livro:todas.size,linhas_publicadas:publicadas.size,linhas_sem_publicador:retiradas,anuais,mensais,ficheiros_texto:texto.length,por_extensao:{},referencias};
for(const f of texto)r.por_extensao[path.extname(f)]=(r.por_extensao[path.extname(f)]??0)+1;
r.paginas_com_marcas=[];
for(const f of texto.filter(f=>f.endsWith('.html'))) {const s=fs.readFileSync(f,'utf8');if(/\[a verificar\]|\[to verify\]/.test(s))r.paginas_com_marcas.push(f.replace(/^dist/,''));}
fs.writeFileSync(base+'/medidas.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r));
if(referencias.length||retiradas.some(l=>l.publication!=='withdrawn'))process.exitCode=1;
