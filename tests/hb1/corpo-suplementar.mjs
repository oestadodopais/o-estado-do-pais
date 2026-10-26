import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {conferirCorpoReferencia,ficheiroDaReferencia} from '../../scripts/afirmacoes-hb1.mjs';
const motor=process.env.RESEARCHHUB_DIR;
assert.ok(motor,'RESEARCHHUB_DIR necessário para conferir o corpo real');
const rows=JSON.parse(fs.readFileSync(path.join(motor,'content/28 Habitacao Estudo/ledger.json'))).claims;
const row=rows.find(r=>r.id==='hab-arrendamento-exposicao-vagos');
const ref=row.document_checks.reference_date;
const file=ficheiroDaReferencia(ref);
const raw=fs.readFileSync(path.join(motor,file));
const proof={file,sha256:ref.sha256,receipt:JSON.parse(fs.readFileSync(path.join(motor,file+'.pedido.json')))};
assert.deepEqual(conferirCorpoReferencia(ref,proof,raw,undefined,row.reference_date),[]);
for(const [nome,change]of[
 ['recibo',x=>x.proof.receipt.sha256='0'.repeat(64)],
 ['caminho',x=>x.ref.file='source/../fora.html'],
 ['corpo',x=>x.raw=Buffer.concat([x.raw,Buffer.from(' Alterado')])],
 ['data',x=>x.ref.date='2000-01-01'],
 ['data e referência',x=>{x.ref.date='2000-01-01';x.referenceDate='2000-01-01';}],
 ['âncora',x=>x.ref.text='Âncora deliberadamente alterada na planta HB1'],
]){
 const x={ref:structuredClone(ref),proof:structuredClone(proof),raw,referenceDate:row.reference_date};change(x);
 const errors=conferirCorpoReferencia(x.ref,x.proof,x.raw,undefined,x.referenceDate);
 assert.ok(errors.length,nome);
 if(nome==='data e referência')assert.ok(errors.includes('HB1 referência: data não provada pela âncora suplementar'));
 console.log('PLANTA referência suplementar: '+nome+', recusada: '+errors[0]);
}
console.log('HB1: corpo real da página parlamentar, recibo, caminho, data e âncora conferidos.');
