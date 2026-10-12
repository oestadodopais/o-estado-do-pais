/** RP4-n-i: a cópia sem leitura própria não herda uma observação do endereço. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {estadoDaFonte} from '../../src/lib/prova.mjs';
import {estadoDaCopia} from '../../src/lib/estado-da-copia.mjs';
const id='penalizacao-legal-um-ano-antecipacao-2026';
const c=loadClaims().get(id),plantas=[];
const endereco=estadoDaFonte(c.source_url);
assert(endereco, 'O conhecido-positivo precisa do estado real do endereço');
assert.equal(estadoDaCopia(c,endereco),null);
assert.equal(estadoDaCopia({...c,verifications:[{date:'2026-10-12'}]},endereco),endereco);
export function conferirCopia(root,lang) {
 const erros=[];
 if(root.querySelector('.linha-sem-resposta'))erros.push('RP4N-i: a cópia sem verificação própria herdou o estado do endereço ('+lang+')');
 const texto=root.querySelector('#verificacoes')?.closest('section')?.textContent??'';
 if(!texto.includes(lang==='pt'?'Não há leitura na fonte registada para esta linha.':'No reading at the source is recorded for this row.'))erros.push('RP4N-i: falta a ausência de leitura própria ('+lang+')');
 return erros;
}
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 assert.deepEqual(conferirCopia(root,lang),[]);
 // O estrago percorre o mesmo estado real que antes contaminava o recibo.
 root.querySelector('#verificacoes').closest('section').insertAdjacentHTML('beforeend',`<dl><dd class="linha-sem-resposta">${endereco.desde}</dd></dl>`);
 const mensagem=conferirCopia(root,lang).find(x=>x.includes('herdou o estado'));
 assert(mensagem);plantas.push({nome:'estado do endereço sem verificação da linha ('+lang+')',mensagem});
}
if(process.argv.includes('--registo-i'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/i/plantas-copia.json',JSON.stringify({plantas},null,2)+'\n');
for(const p of plantas)console.log(`PLANTA ${p.nome}: ${p.mensagem}`);
