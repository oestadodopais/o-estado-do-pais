/** Diagnóstico das recusas da voz e K17, depois da correção da declaração. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {NOMES_DO_PROJETO,MEDIDA_DAS_LINHAS_IRMAS} from '../../../../../src/data/nomes-das-medidas.mjs';
import {conferirRecibosDasLinhas} from '../../../../../tests/cartao/familias.mjs';
const percorrer=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?percorrer(path.join(p,e.name)):[path.join(p,e.name)]);
let marcas=0;
for(const f of percorrer('dist').filter(f=>f.endsWith('.html'))) {
 const html=fs.readFileSync(f,'utf8');
 if(!Object.keys(MEDIDA_DAS_LINHAS_IRMAS).some(id=>html.includes(`data-de-linha="${id}"`)))continue;
 for(const el of parse(html).querySelectorAll('[data-nome][data-de-linha]')) {
  const id=el.getAttribute('data-de-linha');if(!(id in MEDIDA_DAS_LINHAS_IRMAS))continue;
  assert.equal(el.getAttribute('data-nome'),'projeto',`${f}: ${id}`);
  assert(Object.values(NOMES_DO_PROJETO[id]).includes(el.textContent.trim()),`${f}: ${id}`);marcas++;
 }
}
const recibos=conferirRecibosDasLinhas('dist');
fs.writeFileSync('design/especime-v3/medicoes/cr2-2026-10-26/g/marcas-conferidas.json',JSON.stringify({marcas,recibos},null,2)+'\n');
assert.equal(recibos.erros.length,0,JSON.stringify(recibos.erros));
console.log(`${marcas} marcas das irmãs conferidas; conferência dos recibos K17 com zero erros.`);
