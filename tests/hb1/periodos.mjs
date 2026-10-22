import assert from 'node:assert/strict';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { periodoDoRecibo } from './periodo-do-recibo.mjs';
const casos = [
 ['2026-10-12','12.10.2026','12.10.2026'],
 ['2026-08','agosto de 2026','August 2026'],
 ['2026-T2','2.º trimestre de 2026','2nd quarter of 2026'],
 ['2026-S1','1.º semestre de 2026','1st half of 2026'],
 ['2025','2025','2025'],
];
for (const [periodo, pt, en] of casos) for (const [lang, esperado] of [['pt',pt],['en',en]]) {
 assert.equal(periodoDoRecibo(periodo,lang),esperado);
 assert.equal(dataDaCasa(periodo,lang),esperado);
}
const plantas = [
 ['mês trocado','2026-09','August 2026','en'],
 ['trimestre trocado','2026-T3','2.º trimestre de 2026','pt'],
 ['dia inventado num ano','2025','01.01.2025','pt'],
];
for (const [nome,periodo,impresso,lang] of plantas) {
 assert.notEqual(periodoDoRecibo(periodo,lang),impresso,nome);
 console.log(`PLANTA período: ${nome}, texto divergente recusado`);
}
console.log('HB1: períodos dos recibos conferidos nas duas línguas.');
