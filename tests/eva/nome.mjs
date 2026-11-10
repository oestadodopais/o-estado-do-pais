import assert from 'node:assert/strict';
import fs from 'node:fs';
import {WORKS} from '../../src/data/studies.mjs';
import {nomeDoEstudoNoDocumento} from '../../scripts/nome-do-estudo.mjs';
const w=WORKS.find(w=>w.slug==='evora-contas-da-camara-2010-2025');
for(const e of w.editions){
 const html=fs.readFileSync(`studies-src/${w.slug}/${e.lang}.html`,'utf8');
 assert(nomeDoEstudoNoDocumento(html,e.title));
 assert(!nomeDoEstudoNoDocumento(html,e.title+' nome inventado'));
 assert(!nomeDoEstudoNoDocumento(html.replace('<em>','<strong>').replace('</em>','</strong>'),e.title));
}
assert(nomeDoEstudoNoDocumento('<h1>Nome</h1><p>Resposta.</p>','Nome'));
assert(!nomeDoEstudoNoDocumento('<h1>Manchete</h1><p>Outra frase.</p><p><em>Nome</em></p>','Nome'));
console.log('EVA nome: as duas edições e o H1 passam; nome inventado, linha sem itálico e linha afastada recusados.');
