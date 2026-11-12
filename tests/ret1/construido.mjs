import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {WORKS,PUBLISHED_WORKS} from '../../src/data/studies.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {t} from '../../src/i18n/strings.mjs';
const dist=process.env.OEDP_DIST??'dist';
const retirados=new Set(WORKS.filter(w=>w.estado==='retirado').map(w=>w.id));
const linhas=[...loadClaims().values()].filter(c=>retirados.has(c.study));
assert(linhas.length>0);
let recibos=0;
for(const lang of ['pt','en']) for(const c of linhas){
 const rota=`${lang==='pt'?'livro-razao':'en/ledger'}/${c.id}/index.html`;
 const root=parse(fs.readFileSync(`${dist}/${rota}`,'utf8'));
 assert(!root.querySelectorAll('dt').some(el=>el.textContent.trim()===t(lang).prov.estudo),`${rota}: estudo retirado ainda visível`);
 assert(root.querySelector('.linha-valor [data-claim]'),`${rota}: valor ausente`);
 recibos++;
}
assert.equal(PUBLISHED_WORKS.length,5);
for(const w of PUBLISHED_WORKS)for(const base of ['estudos','en/studies'])assert(fs.existsSync(`${dist}/${base}/${w.slug}/index.html`));
console.log(`RET1: ${recibos} recibos preservam o valor e omitem o campo do estudo retirado; os cinco estudos vivos têm páginas nas duas línguas.`);
