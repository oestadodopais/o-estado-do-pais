import fs from 'node:fs';
import assert from 'node:assert/strict';
import {WORKS} from '../../src/data/studies.mjs';
const antigo='evora-2027-prometido-painel-dinheiro',atual='evora-2027-capital-europeia-da-cultura';
const w=WORKS.find(w=>w.slug===antigo);
assert.equal(w.estado,'retirado');assert.deepEqual(w.sucedidoPor,[{slug:atual}]);
const rotas=JSON.parse(fs.readFileSync('vercel.json')).routes.filter(r=>r.src?.includes('/'+antigo+'/'));
assert.equal(rotas.length,8);
for(const lang of ['pt','en']){
 const base=lang==='pt'?'/estudos':'/en/studies',grupo=rotas.filter(r=>r.src.startsWith(base+'/'));
 assert.equal(grupo.length,4);
 for(const r of grupo){assert.equal(r.status,301);assert.equal(r.headers.Location,`${base}/${atual}/`);}
 assert(fs.existsSync(`dist${base}/${atual}/index.html`));assert(!fs.existsSync(`dist${base}/${antigo}/index.html`));
}
console.log('EVB sucessor: oito redirecionamentos, quatro por língua, levam ao estudo publicado; dados de sucessão intactos.');
