import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {recusaVoz, conferirNumeros, conferirBlocos, conferir, recusas, validarLista, blocos, conferirLista} from '../../scripts/leituras/conferir-frases.mjs';
const f = {id:'P1', estudo:'planta', lingua:'pt', classe:'REESCREVE', frase:'Este estudo não lê 12 nem sha256.', nova:'A fonte publicou 12.'};
const g = {...f, id:'E1', lingua:'en', frase:'This study does not read 12 or sha256.', nova:'The source published 12.'};
let provas = 0;
for (const t of ['and then that money does not come in (inference).', 'Os três moveram-se com as marés nacionais e nada do que aqui foi lido fornece o contrafactual (inferência).', 'Iniciativa Liberal, updated on 8 June 2026 (the page does not say when it was published).']) { assert(recusaVoz(t).length); provas++; }
assert.equal(recusaVoz('A fonte publicou 12.').length, 0); provas++;
assert.equal(conferirNumeros([f, g], new Set(['planta'])).length, 0); provas++;
assert.equal(conferirNumeros([f, {...g, nova:'The source published 12 and sha256.'}], new Set(['planta'])).length, 1); provas++;
assert.equal(conferirNumeros([{...g, nova:'The source published 13.'}], new Set(['planta'])).length, 1); provas++;
assert.equal(conferirNumeros([{...f, frase:'1 234,5', nova:'1 234,5'}, {...g, frase:'1,234.5', nova:'1,234.5'}], new Set(['planta'])).length, 0); provas++;
assert.equal(conferirNumeros([{...f, frase:'1,2', nova:'12'}, {...g, frase:'1.2', nova:'1.2'}], new Set(['planta'])).length, 1); provas++;
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
assert.deepEqual(blocos('<main><p data-registo-unidade="x">This study does not read it.</p><section class="texto-artigo estudo-leitura"><p data-registo-unidade="x">This study does not read it.</p></section></main>', 'página'), ['This study does not read it.']); provas++;
assert.deepEqual(blocos('<p>Há 12<a class="src-chip">fonte</a> casos.</p>'), ['Há 12 casos.']); provas++;
assert.equal(conferirBlocos([], [{...doc('pt', ['Fonte.']), textosVoz:['Nada nesta página está no ficheiro.']}]).semEntrada.length, 1); provas++;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-cabeca-'));
try {
  const ficheiro = path.join(tmp, 'lista.json'), dist = path.join(tmp, 'dist');
  fs.mkdirSync(dist); fs.writeFileSync(ficheiro, JSON.stringify([f]));
  fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({commit:'outra-cabeca'}));
  assert.throws(() => conferirLista(ficheiro, dist), /dist não corresponde/); provas++;
  fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({commit:execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim()}));
  assert.throws(() => conferirLista(ficheiro, dist), /estudo sem páginas/); provas++;
  const pagina = path.join(dist, 'estudos/planta/documento'); fs.mkdirSync(pagina, {recursive:true});
  fs.writeFileSync(path.join(pagina, 'index.html'), '<p>Fonte.</p>');
  const env = {...process.env}; delete env.RESEARCHHUB_DIR;
  const r = spawnSync('node', ['scripts/leituras/conferir-frases.mjs', ficheiro, dist], {env, encoding:'utf8'});
  assert.equal(r.status, 9); assert.match(r.stderr, /falta RESEARCHHUB_DIR/); provas++;
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
console.log(`camada 0: ${provas} plantas e controlos em memória`);
