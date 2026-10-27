/** FP1: compara a construção com a base limpa; só a caixa pode agravar as duas primeiras páginas. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';
const AQUI='design/especime-v3/medicoes/fp1-2026-10-27';
const base=JSON.parse(fs.readFileSync(`${AQUI}/l1-base.json`,'utf8'));
const corrida=spawnSync('node',['scripts/check-lugar.mjs'],{encoding:'utf8',env:{...process.env,AMOSTRA:'5000'},maxBuffer:1<<28});
if (corrida.status !== 0) { console.error('FP1: check:lugar recusou, código', corrida.status); process.exit(corrida.status ?? 1); }
const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
const git=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
assert.equal(versao.commit,git.stdout.trim(),'FP1: a construção não pertence à cabeça medida');
const texto=(corrida.stdout+corrida.stderr).replace(/\x1b\[[0-9;]*m/g,'');
const m=texto.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)/);
assert(m,'FP1: falta a medida L1');
const paginas=Object.fromEntries([...texto.matchAll(/^      · (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(x=>[x[1],{destinos:Number(x[2]),exemplo:x[3],vezes:Number(x[4])}]));
const agora={regua:Number(m[1]),paginas};
const destino=h=>decodeURIComponent(h.split('#')[0].split('?')[0]).replace(/\/+$/,'')||'/';
const repetidos=as=>{const c=new Map();for(const a of as){const d=destino(a.getAttribute('href'));c.set(d,(c.get(d)??0)+1);}return [...c].filter(([,n])=>n>1).map(([d])=>d);};
const acrescimos={};
for(const p of ['/','/en']) {
 const r=parse(fs.readFileSync(path.join('dist',p,'index.html'),'utf8')).querySelector('main');
 const as=r.querySelectorAll('a[href]').filter(a=>!a.closest('[data-rotulo-ia="topo"]')&&!/^(?:#|mailto:)/.test(a.getAttribute('href')));
 const sem=repetidos(as.filter(a=>!a.closest('[data-novidades]')));
 acrescimos[p]=repetidos(as).filter(d=>!sem.includes(d));
 const destinos=new Set(as.filter(a=>a.closest('[data-novidades]')).map(a=>destino(a.getAttribute('href'))));
 assert(acrescimos[p].every(d=>destinos.has(d)));
}
function conferir(r) {
 assert.equal(Object.keys(r.paginas).length,r.regua,'contagem diferente da régua');
 assert.deepEqual(Object.keys(r.paginas).sort(),Object.keys(base.paginas).sort(),'página acrescentada ou retirada');
 for(const [p,antes] of Object.entries(base.paginas)) assert.equal(r.paginas[p].destinos,antes.destinos+(acrescimos[p]?.length??0),`agravamento não explicado pela caixa em ${p}`);
}
conferir(agora);
const alheia=Object.keys(base.paginas).find(p=>!['/','/en'].includes(p));
const plantas=[
 ['página alheia acrescentada',r=>{r.paginas['/planta-alheia']={destinos:1};r.regua++;}],
 ['página antiga retirada',r=>{delete r.paginas[alheia];r.regua--;}],
 ['página alheia agravada',r=>r.paginas[alheia].destinos++],
 ['primeira página agravada além da caixa',r=>r.paginas['/'].destinos++],
 ['contagem trocada',r=>r.regua++],
].map(([nome,mudar])=>{const r=structuredClone(agora);mudar(r);assert.throws(()=>conferir(r));return {nome,mordeu:true};});
const agravadas=Object.fromEntries(Object.entries(acrescimos).map(([p,destinos])=>[p,{antes:base.paginas[p].destinos,agora:agora.paginas[p].destinos,destinos,razao:'A caixa repete destinos de secções existentes; conserva as cinco peças mais recentes e a lista dos estudos.'}]));
const registo={comando:'AMOSTRA=5000 node scripts/check-lugar.mjs',base:{commit:base.commit,paginas:base.regua},cabeca:JSON.parse(fs.readFileSync('dist/version.json','utf8')),contagens:{estudos:agora.regua,novas:0,agravadas:Object.values(acrescimos).filter(a=>a.length).length},agravadas,plantas,razao:'As duas primeiras páginas já eram contadas na L1. O teto não sobe; a diferença em destinos é inteiramente a caixa.'};
if(process.argv.includes('--escrever')) fs.writeFileSync(`${AQUI}/l1-fp1.json`,JSON.stringify(registo,null,2)+'\n');
console.log(JSON.stringify({l1:agora.regua,base:base.regua,agravadas,plantas}));
