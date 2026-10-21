/** HB1: reconcilia a L1 com os recibos da integração e as portas mandatadas. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {loadClaims} from '../../../../src/lib/ledger.mjs';
const pasta='design/especime-v3/medicoes/hb1-2026-10-21';
const base=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/v2b-2026-10-12/retoma2/l1-destinos.json')).repetidos_por_pagina;
const contrato=JSON.parse(fs.readFileSync(pasta+'/l1-contrato.json'));
const cruzamento=JSON.parse(fs.readFileSync('ledger/cruzamentos/hb1.json'));
function conferirIds(c){assert.deepEqual([...c.ids_novos].sort(),Object.keys(cruzamento.rows).sort(),'recibos declarados diferentes do cruzamento HB1');}
conferirIds(contrato);
const atual=JSON.parse(fs.readFileSync(process.argv[2]??pasta+'/l1-destinos.json'));
const linhas=loadClaims(),esperados={...base};
for(const [p,v] of Object.entries(contrato.paginas_anteriores_com_multiplicidade_alterada)){assert.deepEqual(v.antes,base[p]);esperados[p]=v.depois;}
for(const id of contrato.ids_novos)for(const l of ['pt','en']){
 const linha=linhas.get(id);assert(linha);const p=(l==='pt'?'/livro-razao/':'/en/ledger/')+id;
 assert(!base[p]);const d={[(l==='pt'?'/metodo':'/en/method')]:2};
 if(linha.reference_date==='[a verificar]')d[l==='pt'?'/a-verificar':'/en/to-verify']=3;
 esperados[p]=d;
}
for(const [p,d] of Object.entries(contrato.outras_paginas)){assert(!base[p]);esperados[p]=d;}
function conferir(r){
 assert.equal(r.paginas,r.regua,'contagem diferente da régua');
 assert.equal(r.paginas,Object.keys(esperados).length,'contagem diferente do conjunto declarado');
 assert.deepEqual(r.repetidos_por_pagina,esperados,'destino, multiplicidade ou página fora do contrato');
}
conferir(atual);const plantas=[];
function planta(nome,mudar){const c=structuredClone(atual);mudar(c);assert.throws(()=>conferir(c));plantas.push({nome,mordeu:true});}
for(const [nome,mudar] of [['recibo do cruzamento omitido',c=>c.ids_novos.pop()],['recibo fora do cruzamento',c=>c.ids_novos.push('planta-hb1b')]]){const c=structuredClone(contrato);mudar(c);assert.throws(()=>conferirIds(c));plantas.push({nome,mordeu:true});}
const antigo=Object.keys(base)[0],novo='/livro-razao/'+contrato.ids_novos[0];
planta('multiplicidade nova numa página anterior',c=>c.repetidos_por_pagina[antigo][Object.keys(base[antigo])[0]]++);
planta('porta adicional num recibo novo',c=>c.repetidos_por_pagina[novo]['/metodo']++);
planta('página fora da integração',c=>{c.repetidos_por_pagina['/planta-hb1']={'/metodo':2};c.paginas++;c.regua++;});
planta('recibo da integração em falta',c=>{delete c.repetidos_por_pagina[novo];c.paginas--;c.regua--;});
planta('contagem que diverge da régua',c=>c.regua++);
const resultado={construcao:JSON.parse(fs.readFileSync('dist/version.json')).commit,codigo:0,contagens:{estudos:atual.paginas,anteriores:Object.keys(base).length,novas:Object.keys(esperados).length-Object.keys(base).length,recibos_novos:contrato.ids_novos.length*2,outras_paginas:Object.keys(contrato.outras_paginas).length},contrato:'l1-contrato.json',medicao:'l1-destinos.json',plantas,limite:'A fotografia de partida antecede HB1. As páginas antigas cujas multiplicidades diferem estão enumeradas. A lista de recibos corresponde exatamente ao cruzamento HB1; as portas de datas por confirmar são derivadas dos campos atuais das linhas. A regra de contagem não mudou.'};
fs.writeFileSync(pasta+'/l1-hb1.json',JSON.stringify(resultado,null,2)+'\n');
if(process.argv.includes('--teto'))fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:atual.paginas,medicao:pasta+'/l1-hb1.json'},null,2)+'\n');
console.log(JSON.stringify({codigo:0,contagens:resultado.contagens,plantas}));
