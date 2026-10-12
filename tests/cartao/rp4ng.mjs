/** RP4-n-g: réguas rendidas e plantas nas cópias de cada edição. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {t} from '../../src/i18n/strings.mjs';
const plantas=[];
function morde(nome,erros,mensagem) {
 const erro=erros.find(e=>e.includes(mensagem));assert(erro,`${nome}: a planta passou`);
 plantas.push({nome,mensagem:erro});console.log(`PLANTA ${nome}: ${erro}`);
}
function selos(root,lang) {
 return root.querySelectorAll('.src-chip .marcador').flatMap(el=>el.textContent===t(lang).prov.marcadorDoSelo?[]:[`RP4N-g: o selo não está na língua da edição ${lang}`]);
}
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='en'?'en/':''}areas/economia-e-coesao-territorial/index.html`,'utf8'));
 assert.deepEqual(selos(root,lang),[]);
 const el=root.querySelector('.src-chip .marcador');assert(el);
 el.set_content(t(lang==='pt'?'en':'pt').prov.marcadorDoSelo);
 morde(`selo na outra língua (${lang})`,selos(root,lang),'o selo não está na língua');
}
// O denominador tem de concordar com a coluna da computação e com a unidade.
const {loadClaims}=await import('../../src/lib/ledger.mjs');
function denominador(linhas) {
 const l=linhas.get('evora-prr-execucao-2026'),d=linhas.get(l.derived_from[1]);
 return d.document.computed_over.column==='valor_contratado' && l.derivation.includes('verbas contratadas') && l.unit==='% do valor contratado' ? [] : ['RP4N-g: o rótulo da quota não corresponde ao denominador contratado'];
}
assert.deepEqual(denominador(loadClaims()),[]);
{
 const copia=structuredClone(loadClaims());copia.get('evora-prr-execucao-2026').unit='% do valor aprovado';
 morde('quota contratada rotulada como aprovada',denominador(copia),'o rótulo da quota não corresponde');
}
function paginas(root,lang) {
 return root.querySelectorAll('.def-origem-pagina').flatMap(el=>el.textContent.trim().startsWith(', '+t(lang).prov.paginaDaDefinicao+' ')?[]:[`RP4N-g: a coordenada da definição não diz página na língua ${lang}`]);
}
for(const lang of ['pt','en'])for(const id of ['agua-nao-faturada-portugal-2024','penalizacao-antecipacao-um-ano-neutra']) {
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 assert.deepEqual(paginas(root,lang),[]);
 const el=root.querySelector('.def-origem-pagina');assert(el);
 el.set_content(', '+t(lang==='pt'?'en':'pt').prov.paginaDaDefinicao+' '+el.textContent.match(/\d+/)[0]);
 morde(`página na outra língua (${id}, ${lang})`,paginas(root,lang),'a coordenada da definição');
}
if(process.argv.includes('--registo-g'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/g/plantas-novas.json',JSON.stringify({plantas},null,2)+'\n');
console.log(`RP4N-g: PASS, ${plantas.length} plantas`);
