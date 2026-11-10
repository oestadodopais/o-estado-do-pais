import assert from 'node:assert/strict';
import fs from 'node:fs';
import {conferirAuditoriaDasFamilias} from '../cartao/familias.mjs';
import {FAMILIAS_DAS_LINHAS} from '../../src/data/o-que-e-das-familias.mjs';
const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json','utf8'));
assert.deepEqual(conferirAuditoriaDasFamilias({auditoria}).erros,[]);
const copia=structuredClone(auditoria);
copia.familias.find(f=>f.chaves?.includes('estudos-publicados')).folhas[0].partes[0].apoios[0].literal='Contagem das entradas do registo de correções classificadas como «correcao», em todas as linhas do livro-razão.';
assert(conferirAuditoriaDasFamilias({auditoria:copia}).erros.some(e=>e.includes('estudos-publicados')&&e.includes('não está no campo')));
for(const lang of ['pt','en']) {
 const familias=structuredClone(FAMILIAS_DAS_LINHAS);
 familias['estudos-publicados'].frase[lang][0]+=' Outra frase.';
 assert(conferirAuditoriaDasFamilias({familias}).erros.some(e=>e.includes('estudos-publicados')));
}
console.log('ED1-A contagem: controlo e três plantas da definição e do apoio literal conferidos.');
