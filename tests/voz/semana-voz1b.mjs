/** VOZ-1 B: frases inteiras, independentes da composição, para os ramos escolhidos. */
import assert from 'node:assert/strict';
import {primeiraFraseDaSemana} from '../../src/lib/leitura-da-semana.mjs';
import {t} from '../../src/i18n/strings.mjs';
import {dataDaCasa} from '../../src/lib/datas.mjs';
let casos=0;
for(const lang of ['pt','en'])for(const [proveniencia,revisoes] of [[0,1],[0,3],[1,1],[2,3]]){
 const leitura={janela:{inicio:'2026-10-29',fim:'2026-11-04'},contagens:{relidas:91,valor:0,forma:0,proveniencia,revisoes}};
 const partes=primeiraFraseDaSemana(leitura,t(lang).semana,dataDaCasa,String);
 const frase=partes.map(p=>typeof p==='string'?p:p.texto).join('');
 const prov=proveniencia===0?'':lang==='pt'?` e ${proveniencia} ${proveniencia===1?'mudou':'mudaram'} de proveniência`:` and ${proveniencia} changed provenance`;
 const esperada=lang==='pt'?`Entre 29.10.2026 e 04.11.2026, 91 números foram relidos na fonte: nenhum valor publicado mudou${prov}, e a fonte reviu ${revisoes}, ainda com o valor de antes da revisão.`:`Between 29.10.2026 and 04.11.2026, 91 figures were re-read at the source: no published value changed${prov}, and the source revised ${revisoes}, still showing the value from before the revision.`;
 assert.equal(frase,esperada);assert(partes.some(p=>typeof p!=='string'&&p.semana==='revisoes'));casos++;
}
console.log(`VOZ-1 B: ${casos} frases inteiras conferidas, incluindo uma revisão e mudanças de proveniência.`);
