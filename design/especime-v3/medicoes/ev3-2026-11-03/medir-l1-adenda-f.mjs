/** EV3-F: compara todas as rotas contadas pela L1 com a base anterior. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const pasta='design/especime-v3/medicoes/ev3-2026-11-03';
const base='design/especime-v3/medicoes/ed1-2026-11-02/l1-ed1.json';
const complemento='design/especime-v3/medicoes/og1-e-2026-11-02/l1-adenda-c.json';
const anterior=JSON.parse(fs.readFileSync(base));
const habitacao=JSON.parse(fs.readFileSync(complemento));
const bruto=fs.readFileSync(process.argv[2]);
const texto=bruto.toString().replace(/\x1b\[[0-9;]*m/g,'');
const total=Number(texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
const paginas=Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
const anteriores=new Set([...Object.keys(anterior.paginas),...habitacao.novas]);
const novas=Object.keys(paginas).filter(r=>!anteriores.has(r)).sort();
const retiradas=[...anteriores].filter(r=>!Object.hasOwn(paginas,r)).sort();
const esperadas=[
 '/en/studies/evora-2027-capital-europeia-da-cultura/document/2026-10-01',
 '/estudos/evora-2027-capital-europeia-da-cultura/documento/2026-10-01',
];
assert.equal(Object.keys(paginas).length,total,'A recolha tem de abranger todas as páginas contadas');
assert.equal(anteriores.size,habitacao.contagens.estudos,'A base tem de recompor o teto anterior');
assert.deepEqual(novas,esperadas,'As páginas acrescentadas têm de ser apenas as duas edições guardadas de Évora');
assert.deepEqual(retiradas,[],'Nenhuma página anterior pode desaparecer da contagem');
assert.equal(total,anteriores.size+esperadas.length);
const falhas=[...texto.matchAll(/^ {2}✗ (.+)$/gm)].map(m=>m[1]);
assert.deepEqual(falhas,[`L1 · páginas com dois destinos iguais fora da mobília: ${total}, acima do teto ${anteriores.size}.`]);
const razao='As duas páginas da primeira edição guardada da habitação, de 29.10.2026, e as duas da edição guardada do estudo de Évora 2027, de 01.10.2026, uma por língua.';
const resultado={comando:'AMOSTRA=5000 npm run check:lugar',cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),base,complemento,registo_sha256:crypto.createHash('sha256').update(bruto).digest('hex'),contagens:{antes:anteriores.size,estudos:total,novas:novas.length,retiradas:retiradas.length},novas,retiradas,paginas,razao};
if(process.argv.includes('--escrever')){
 fs.writeFileSync(pasta+'/l1-adenda-f.json',JSON.stringify(resultado,null,2)+'\n');
 fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:total,medicao:pasta+'/l1-adenda-f.json',razao},null,2)+'\n');
}
console.log(JSON.stringify({contagens:resultado.contagens,novas,retiradas}));
