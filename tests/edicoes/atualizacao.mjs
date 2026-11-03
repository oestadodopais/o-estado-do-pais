import {marcaDeLinguaEv3Valida} from '../../scripts/ev3-lingua-conferir.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {conferirHistoria} from '../../scripts/historia-edicoes-conferir.mjs';
import {contagemDasCorrecoesNoPortao} from '../../scripts/edicoes-conferir.mjs';
import {NOMES_EV3,marcarNomesEv3,retirarNomesEv3} from '../../src/lib/nomes-ev3.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const args={works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src'};
assert.deepEqual(conferirHistoria(args),[]);
const atualizacao=CORRECOES_TEXTO.find(e=>e.kind==='texto_atualizado');assert(atualizacao);
const sem=CORRECOES_TEXTO.filter(e=>e!==atualizacao);
assert.equal(contagemDasCorrecoesNoPortao(0,CORRECOES_TEXTO),contagemDasCorrecoesNoPortao(0,sem));
const contaComoCorrecao=structuredClone(CORRECOES_TEXTO);contaComoCorrecao.find(e=>e.kind==='texto_atualizado').kind='texto';
assert(conferirHistoria({...args,correcoes:contaComoCorrecao}).some(e=>e.startsWith('ED1 entrada:')));
const escondeCorrecao=structuredClone(CORRECOES_TEXTO);escondeCorrecao.find(e=>e.kind==='texto').kind='texto_atualizado';
assert(conferirHistoria({...args,correcoes:escondeCorrecao}).some(e=>e.startsWith('ED1 entrada:')));
const bruto='<p>'+NOMES_EV3.join('; ')+'</p>',servido=marcarNomesEv3(bruto);
assert.equal(retirarNomesEv3(servido),bruto);
assert.equal(parse(servido).querySelectorAll('[data-ev3-nome][lang="pt-PT"]').length,NOMES_EV3.length);
assert.notEqual(retirarNomesEv3(servido.replace('Câmara','Outra pessoa')),bruto);
assert.notEqual(retirarNomesEv3(servido.replace('lang="pt-PT"','lang="en"')),bruto);
console.log('EV3: 8 controlos e plantas da natureza, contagem, língua e integridade dos nomes.');

const edicao='evora-2027-capital-europeia-da-cultura/en';
const marcas=parse(servido).querySelectorAll('[data-ev3-nome]');
for(const el of marcas)assert(marcaDeLinguaEv3Valida(el,edicao));
const original=marcas[0].outerHTML;
const adulteradas=[
 original.replace('pt-PT','en'),
 original.replace('data-ev3-nome','data-outra-marca'),
 original.replace('data-ev3-nome','data-ev3-nome="outro"'),
 original.replace('<span','<span class="src-chip"'),
 original.replace('<span','<span hidden'),
 original.replace('<span','<span data-registo="inventado"'),
 original.replace('Laboratório Floresta Nómada','Outra pessoa'),
 original.replace('Laboratório Floresta Nómada','2027'),
 original.replace('Laboratório Floresta Nómada','<em>Laboratório Floresta Nómada</em>'),
 original.replaceAll('span','em'),
];
for(const html of adulteradas)assert(!marcaDeLinguaEv3Valida(parse(html).firstChild,edicao));
for(const outra of ['evora-2027-capital-europeia-da-cultura/pt','outro-estudo/en'])assert(!marcaDeLinguaEv3Valida(marcas[0],outra));
console.log(`EV3 língua: ${marcas.length} marcas válidas; ${adulteradas.length+2} adulterações recusadas.`);

const {edicoesGuardadas,primeiraEdicaoServida}=await import('../../src/lib/edicoes.mjs');
for(const e of edicoesGuardadas().filter(e=>e.slug==='evora-2027-capital-europeia-da-cultura'))assert.equal(parse(primeiraEdicaoServida(e.slug,e.lang,e.data)).querySelectorAll('[data-ev3-nome]').length,0);
console.log('EV3-I: edições guardadas sem marcas de nomes da atualização.');
