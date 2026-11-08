import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {compara} from '../../scripts/paridade-numeros.mjs';
import {assinatura} from '../../scripts/check-paridade.mjs';
import {recusaVoz, conferirNumeros, conferirBlocos, conferir, recusas, validarLista, blocos, conferirLista, emparelharBlocos} from '../../scripts/leituras/conferir-frases.mjs';
const f = {id:'P1', estudo:'planta', lingua:'pt', paginas:['/estudos/planta/documento'], classe:'REESCREVE', frase:'Este estudo não lê 12 nem sha256.', nova:'A fonte publicou 12.'};
const g = {...f, id:'E1', lingua:'en', paginas:['/en/studies/planta/document'], frase:'This study does not read 12 or sha256.', nova:'The source published 12.'};
let provas = 0;
for (const t of ['and then that money does not come in (inference).', 'Os três moveram-se com as marés nacionais e nada do que aqui foi lido fornece o contrafactual (inferência).', 'Iniciativa Liberal, updated on 8 June 2026 (the page does not say when it was published).']) { assert(recusaVoz(t).length); provas++; }
assert.equal(recusaVoz('A fonte publicou 12.').length, 0); provas++;
const doc = (lingua, blocos) => ({estudo:'planta', tipo:'documento', lingua, rota:lingua==='pt'?'/estudos/planta/documento':'/en/studies/planta/document', blocos});
const medirNumeros = (lista, docs, opcoes) => conferirNumeros(lista, docs, new Set(docs.map(d => d.estudo)), opcoes);
const originais = [doc('pt', [f.frase]), doc('en', [g.frase])];
assert.equal(medirNumeros([f, g], originais).length, 0); provas++;
assert.equal(medirNumeros([f, {...g, nova:'The source published 12 and sha256.'}], originais).length, 1); provas++;
// Uma assimetria corrigida passa, mesmo que só o português perca um número.
const assimetria = [doc('pt', ['A fonte publicou 12 e 99.']), doc('en', ['The source published 12.'])];
const corrige = {...f, frase:assimetria[0].blocos[0], nova:'A fonte publicou 12.'};
assert.equal(medirNumeros([corrige], assimetria).length, 0); provas++;
const iguais = [doc('pt', [f.nova]), doc('en', [g.nova])];
const muda = {...f, frase:f.nova, nova:'A fonte publicou 13.'};
assert.equal(medirNumeros([muda], iguais).length, 1); provas++;
// A diferença prévia que a lista deixa ficar também se recusa, sem exceção.
assert.equal(medirNumeros([{...corrige, classe:'FICA'}], assimetria).length, 1); provas++;
const estudo = 'onde-esta-a-agua';
const comExcecao = assimetria.map(d => ({...d, estudo}));
const ficaNumero = {...corrige, estudo, classe:'FICA'};
const excecoes = {data:'2026-11-08', retirar:'COR-AGUA', diferencas:[{estudo, tipo:'documento', numeros:assinatura(compara(...assimetria.map(d => d.blocos)))}]};
assert.equal(medirNumeros([ficaNumero], comExcecao, {excecoes}).length, 0); provas++;
assert.equal(medirNumeros([ficaNumero], comExcecao.map(d => ({...d, tipo:'página'})), {excecoes}).length, 1); provas++;
assert.equal(medirNumeros([{...ficaNumero, estudo:'planta'}], assimetria, {excecoes}).length, 1); provas++;
assert.equal(medirNumeros([ficaNumero], [comExcecao[0], {...comExcecao[1], blocos:['The source published 13.']}], {excecoes}).length, 1); provas++;
assert.throws(() => medirNumeros([ficaNumero], comExcecao, {excecoes:{...excecoes, retirar:''}})); provas++;
// A repetição aplicada compara o dist atual, sem voltar a executar a troca.
assert.equal(medirNumeros([muda], iguais, {aplicada:true}).length, 0); provas++;
// Uma troca entre blocos não desaparece por conservar o total.
assert.equal(medirNumeros([f], [doc('pt', ['12', '21']), doc('en', ['21', '12'])]).length, 1); provas++;
let docs = [doc('pt', [f.frase]), doc('en', [g.frase])];
assert.equal(conferirBlocos([f], docs).semPar.length, 1); provas++;
assert.equal(conferirBlocos([f], docs).semEntrada.length, 1); provas++;
assert.equal(conferirBlocos([f,g], docs).semPar.length, 0); provas++;
assert.equal(conferirBlocos([f], [docs[0], doc('en', ['A source.'])]).semPar.length, 1); provas++;
docs = [doc('pt', ['Fonte.', f.frase]), doc('en', ['Source.', 'Source.', g.frase])];
assert.equal(conferirBlocos([f,g], docs).semPar.length, 0); provas++;
assert.equal(conferirBlocos([f], docs).semPar.length, 1); provas++;
// Com alinhamento, um par próximo não pode esconder o bloco gémeo sem entrada.
docs = [doc('pt', [f.frase, 'Fonte.']), doc('en', ['This document does not say it.', g.frase])];
assert.equal(conferirBlocos([f,g], docs).semPar.length, 2); provas++;
// V228: o português sai e o inglês sem entrada não é apanhado pela régua.
const v228 = {...f, id:'V228', classe:'SAI', frase:'Estão aqui em vez de numa nota de rodapé.'};
const inglesV228 = 'They are here rather than in a footnote.';
assert.equal(recusaVoz(inglesV228).length, 0); provas++;
const docsV228 = [doc('pt', [v228.frase]), doc('en', [inglesV228])];
assert.deepEqual(conferirBlocos([v228], docsV228).semPar.map(e => e.id), ['V228']); provas++;
for (const extra of [{par:'nenhum'}, {par:'nenhum', razao_par:'curta'}, {par:'outro', razao_par:'Uma razão com mais de vinte carateres.'}, {razao_par:'Uma razão com mais de vinte carateres.'}]) {
  assert.throws(() => validarLista([{...v228, ...extra}]), /razao_par/); provas++;
}
const dispensada = {...v228, par:'nenhum', razao_par:'A outra edição já não contém esta frase.'};
validarLista([dispensada]);
assert.equal(conferirBlocos([dispensada], docsV228).semPar.length, 0); provas++;
const fica = {...g, classe:'FICA', frase:inglesV228};
assert.equal(conferirBlocos([v228, fica], docsV228).semPar.length, 0); provas++;
// Duas entradas no mesmo bloco partilham o seu par.
assert.equal(conferirBlocos([v228, {...v228, id:'V229'}, fica], docsV228).semPar.length, 0); provas++;
// Dois blocos distintos não podem reutilizar o único bloco inglês.
const segundo = {...v228, id:'V230', frase:'Outra frase retirada.'};
const reutilizado = [doc('pt', [v228.frase, segundo.frase]), doc('en', [inglesV228])];
assert.deepEqual(conferirBlocos([v228, segundo, fica], reutilizado).semPar.map(e => e.id), ['V230']); provas++;
// O aviso de indisponibilidade em inglês não torna o estudo bilingue.
const indisponivel = {...doc('en', [inglesV228]), tipo:'página'};
assert.equal(conferirBlocos([v228], [doc('pt', [v228.frase]), {...doc('pt', [v228.frase]), tipo:'página'}, indisponivel]).semPar.length, 0); provas++;
assert.deepEqual([...emparelharBlocos([0,2], [1], false)], [[2,1]]); provas++;
assert.deepEqual([...emparelharBlocos([0,2], [1,3], false)].reverse(), [[0,1],[2,3]]); provas++;
assert.equal(emparelharBlocos([0], [4], false).size, 0); provas++;
assert(recusas(conferir([f,g], [], new Set(['planta'])))); provas++;
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
