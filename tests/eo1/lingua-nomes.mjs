/** A conferência real corre primeiro; as plantas alteram só cópias do HTML em memória. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {LINGUA_DOS_ROTULOS} from '../../src/i18n/lingua-dos-titulos.mjs';
import {conferirEdicaoDoNome} from '../../scripts/check-lingua.mjs';
const id='rmmg-2026', linha=loadClaims().get(id);
const bytes=fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/en/ledger/${id}/index.html`,'utf8');
const copia=()=>{const root=parse(bytes);return {root,el:root.querySelector('.linha-nome-da-fonte [data-linha-campo="name_en"]')};};
const bom=copia();assert(bom.el);assert.deepEqual(conferirEdicaoDoNome(bom.el,'en',linha),[]);
const plantas=[
 ['nome trocado',x=>x.el.set_content(x.el.text+' altered')],
 ['língua trocada',x=>x.el.setAttribute('lang','pt-PT')],
 ['edição trocada',x=>x.root.querySelector('html').setAttribute('lang','pt-PT')],
 ['campo português no lugar do inglês',x=>{x.el.setAttribute('data-linha-campo','name');x.el.set_content(linha.name);}],
];
for(const [nome,altera] of plantas){const x=copia();altera(x);const lang=x.root.querySelector('html').getAttribute('lang').startsWith('pt')?'pt':'en';assert(conferirEdicaoDoNome(x.el,lang,linha).length,nome+' aceite');}
const old=LINGUA_DOS_ROTULOS[linha.name_en];
try{delete LINGUA_DOS_ROTULOS[linha.name_en];assert(conferirEdicaoDoNome(bom.el,'en',linha).length,'nome sem declaração aceite');}
finally{LINGUA_DOS_ROTULOS[linha.name_en]=old;}
assert.deepEqual(conferirEdicaoDoNome(bom.el,'en',linha),[]);
console.log('EO1-b: positivo real e cinco plantas de nome, língua, edição, campo e declaração; todas recusadas e controlo reposto.');
