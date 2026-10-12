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
if(process.argv.includes('--registo-g'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/g/plantas-novas.json',JSON.stringify({plantas},null,2)+'\n');
console.log(`RP4N-g: PASS, ${plantas.length} plantas`);
