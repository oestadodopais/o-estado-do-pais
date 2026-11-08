/** COR-AGUA C: repetir a medição da L1 sem alterar a régua nem as exclusões. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const origem='design/especime-v3/medicoes/voz2a-adenda-f-2026-11-07/l1.json';
const pasta='design/especime-v3/medicoes/coragua-2026-11-08';
const antiga=JSON.parse(fs.readFileSync(origem));
const texto=fs.readFileSync(process.argv[2],'utf8').replace(/\x1b\[[0-9;]*m/g,'');
const paginas=Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
const novas=Object.keys(paginas).filter(r=>!Object.hasOwn(antiga.paginas,r)).sort();
const retiradas=Object.keys(antiga.paginas).filter(r=>!Object.hasOwn(paginas,r)).sort();
const recibos=fs.readdirSync('ledger/claims').filter(f=>f.startsWith('coragua-')&&f.endsWith('.yml')).flatMap(f=>['/livro-razao/','/en/ledger/'].map(p=>p+f.slice(0,-4)));
const arquivos=['/estudos/agua-nao-faturada/documento/2026-08-12','/en/studies/agua-nao-faturada/document/2026-08-12','/en/studies/onde-esta-a-agua/document/2026-08-12','/en/studies/alentejo-algarve/document/2026-08-12','/estudos/evora-quinze-anos-cinco-mandatos/documento/2026-08-20'];
assert.equal(recibos.length,34);assert.deepEqual(novas,[...recibos,...arquivos].sort());assert.deepEqual(retiradas,[]);
const alteradas=[];
for(const [rota,antes] of Object.entries(antiga.paginas)){
 const depois=paginas[rota];
 if(['/correcoes','/en/corrections'].includes(rota)){
  assert.equal(antes.destinos,46);assert.equal(depois.destinos,49);alteradas.push({rota,antes,depois});
 }else assert.deepEqual(depois,antes,rota);
}
const parte=s=>s.slice(s.indexOf('  /* -------------------------------------------------------------------- L1 */'),s.indexOf('  /* ------------------------------------------------------------------ §7.10 */'));
const atual=parte(fs.readFileSync('scripts/check-lugar.mjs','utf8'));
const base=parte(execFileSync('git',['show','d2c65af9d:scripts/check-lugar.mjs'],{encoding:'utf8',maxBuffer:4*1024*1024}));
assert(atual.length>0);assert.equal(atual,base);
const total=Object.keys(paginas).length;assert.equal(total,3518);
const resultado={origem,contagens:{base:antiga.contagens.estudos,novas:novas.length,retiradas:retiradas.length,estudos:total},novas,retiradas,alteradas,comparacao:'Nas restantes páginas, quantidade de destinos repetidos, destino de exemplo e multiplicidade iguais à medição VOZ-2A F.',regua:{cabeca:'d2c65af9d',sha256:createHash('sha256').update(atual).digest('hex'),igual:true},paginas};
fs.writeFileSync(pasta+'/l1-c.json',JSON.stringify(resultado,null,2)+'\n');
if(process.argv.includes('--escrever'))fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:total,medicao:pasta+'/l1-c.json',razao:'COR-AGUA C: 3479 páginas anteriores, mais os 34 recibos das 17 linhas novas e cinco edições arquivadas, sem retiradas. As duas páginas de correções passam de 46 a 49 destinos repetidos e já pertenciam à conta. Régua e exclusões L1 iguais à cabeça d2c65af9d.'},null,2)+'\n');
console.log(JSON.stringify({contagens:resultado.contagens,regua:resultado.regua}));
