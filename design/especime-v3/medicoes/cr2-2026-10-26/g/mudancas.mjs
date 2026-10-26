/** Confere as quinze atualizações no HTML das duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {routePath} from '../../../../../src/lib/routes.mjs';
import {getClaim} from '../../../../../src/lib/ledger.mjs';
import {nomeDoCartao} from '../../../../../src/lib/nomes.mjs';
const pasta='design/especime-v3/medicoes/cr2-2026-10-26/g';
const ids=JSON.parse(fs.readFileSync(`${pasta}/razoes.json`)).map(r=>r.id);
const entradas=[];
for(const lang of ['pt','en']) {
 const rota=routePath('correcoes',lang),d=parse(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
 for(const id of ids) {
  const itens=d.querySelectorAll(`[data-correcao-entrada="${id}"]`).filter(e=>e.querySelector('time')?.getAttribute('datetime')==='2026-10-26' && e.querySelector('.registo-mudanca-nome'));
  assert.equal(itens.length,1,`${lang}: ${id}`);
  const el=itens[0],nome=el.querySelector('.registo-mudanca-nome').textContent.trim();
  assert.equal(nome,nomeDoCartao(getClaim(id),lang).texto);
  assert(!el.querySelector('.registo-mudanca-nome').hasAttribute('data-linha-campo'));
  entradas.push({id,lang,rota,nome,texto:el.querySelector('.registo-mudanca-o-que').textContent.replace(/\s+/g,' ').trim()});
 }
}
fs.writeFileSync(`${pasta}/mudancas.json`,JSON.stringify(entradas,null,2)+'\n');
console.log(`${entradas.length} entradas conferidas: quinze por edição, com os nomes da casa.`);
