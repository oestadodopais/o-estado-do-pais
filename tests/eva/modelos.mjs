import assert from 'node:assert/strict';
import {STRINGS} from '../../src/i18n/strings.mjs';
import {modeloDaFrase,conferirModelos} from '../../scripts/frases-modelos.mjs';
assert.deepEqual(conferirModelos(),[]);
for(const lingua of ['pt','en']){
 const frase=STRINGS[lingua].semana.primeiraNenhuma;
 assert.equal(modeloDaFrase(frase,lingua,'leituraDaSemana'),'primeira-sem-mudanca-'+lingua);
 assert.equal(modeloDaFrase(frase,lingua,'estudo'),null);
 assert.equal(modeloDaFrase(frase+' Texto inventado.',lingua,'leituraDaSemana'),null);
}
console.log('EVA modelo da semana: literal aceite só na sua superfície; página e palavras trocadas recusadas.');
