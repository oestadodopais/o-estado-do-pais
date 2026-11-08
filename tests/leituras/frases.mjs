import assert from 'node:assert/strict';
import {recusaVoz, conferirNumeros, conferirBlocos, conferir, recusas, validarLista} from '../../scripts/leituras/conferir-frases.mjs';
const f = {id:'P1', estudo:'planta', lingua:'pt', classe:'REESCREVE', frase:'Este estudo não lê 12 nem sha256.', nova:'A fonte publicou 12.'};
const g = {...f, id:'E1', lingua:'en', frase:'This study does not read 12 or sha256.', nova:'The source published 12.'};
let provas = 0;
for (const t of ['and then that money does not come in (inference).', 'Os três moveram-se com as marés nacionais e nada do que aqui foi lido fornece o contrafactual (inferência).', 'Iniciativa Liberal, updated on 8 June 2026 (the page does not say when it was published).']) { assert(recusaVoz(t).length); provas++; }
assert.equal(recusaVoz('A fonte publicou 12.').length, 0); provas++;
assert.equal(conferirNumeros([f, g], new Set(['planta'])).length, 0); provas++;
assert.equal(conferirNumeros([f, {...g, nova:'The source published 12 and sha256.'}], new Set(['planta'])).length, 1); provas++;
assert.equal(conferirNumeros([{...g, nova:'The source published 13.'}], new Set(['planta'])).length, 1); provas++;
assert.equal(conferirNumeros([{...f, frase:'1 234,5', nova:'1 234,5'}, {...g, frase:'1,234.5', nova:'1,234.5'}], new Set(['planta'])).length, 0); provas++;
const doc = (lingua, blocos) => ({estudo:'planta', tipo:'documento', lingua, blocos});
let docs = [doc('pt', [f.frase]), doc('en', [g.frase])];
assert.equal(conferirBlocos([f], docs).semPar.length, 1); provas++;
assert.equal(conferirBlocos([f], docs).semEntrada.length, 1); provas++;
assert.equal(conferirBlocos([f,g], docs).semPar.length, 0); provas++;
assert.equal(conferirBlocos([f], [docs[0], doc('en', ['A source.'])]).semPar.length, 0); provas++;
docs = [doc('pt', ['Fonte.', f.frase]), doc('en', ['Source.', 'Source.', g.frase])];
assert.equal(conferirBlocos([f,g], docs).semPar.length, 0); provas++;
assert.equal(conferirBlocos([f], docs).semPar.length, 1); provas++;
// Com alinhamento, um par próximo não pode esconder o bloco gémeo sem entrada.
docs = [doc('pt', [f.frase, 'Fonte.']), doc('en', ['This document does not say it.', g.frase])];
assert.equal(conferirBlocos([f,g], docs).semPar.length, 1); provas++;
assert(recusas(conferir([f,g], [], new Set(['planta']), [{id:'P1'}]))); provas++;
for (const lista of [[], [f,f], [{...f, nova:null}], [{...f, lingua:'xx'}]]) { assert.throws(() => validarLista(lista)); provas++; }
console.log(`camada 0: ${provas} plantas e controlos em memória`);
