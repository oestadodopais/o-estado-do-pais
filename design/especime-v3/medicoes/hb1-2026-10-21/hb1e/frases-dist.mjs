/** HB1-e: a frase «O que é este número» das vinte e três famílias, como o dist/ a imprime nas duas edições. */
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {FAMILIAS_HB1E} from '../../../../../tests/cartao/familias.mjs';
const n=s=>s.replace(/\s+/g,' ').trim();const out={};
for(const id of FAMILIAS_HB1E){out[id]={};
 for(const [ed,f] of [['pt',`dist/livro-razao/${id}/index.html`],['en',`dist/en/ledger/${id}/index.html`]]){
  const h=parse(fs.readFileSync(f,'utf8'));const e=h.querySelector('[data-o-que-e-parte="o-que-e"]');out[id][ed]=e?n(e.textContent):null;}}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,2)+'\n');
console.log(Object.values(out).filter(x=>x.pt&&x.en).length,'de',FAMILIAS_HB1E.length,'com a frase nas duas edições');
