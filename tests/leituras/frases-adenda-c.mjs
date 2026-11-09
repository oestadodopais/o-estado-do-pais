import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validarPino} from '../../scripts/frases-pino.mjs';
import {conferirOrigem, conferirSemente} from '../../scripts/frases-origem.mjs';
import {lerLista, compararListas, conferirRegisto} from '../../scripts/check-frases-afirmacao.mjs';
import {conferirAmbito, inventario, blocosDaPagina} from '../../scripts/frases-com-afirmacao.mjs';
import {semear} from '../../scripts/gerar-frases-afirmacao.mjs';
const pino=(marcas,razao='Razão documentada para esta mudança.')=>JSON.stringify({sha256:createHash('sha256').update(marcas).digest('hex'),data:'2026-11-09',razao});
assert.deepEqual(validarPino('a',pino('a')),[]);
assert(validarPino('b',pino('a')).length);
assert(validarPino('b',pino('b'),{marcas:'a',pino:pino('a')}).length);
assert.deepEqual(validarPino('b',pino('b','Outra razão explícita para a alteração.'),{marcas:'a',pino:pino('a')}),[]);
const nova={estudo:'planta',lingua:'pt',sha256:'f'.repeat(64)};
const indice=lerLista({indice:true,gitRun:(...args)=>{assert.deepEqual(args,['show',':ledger/frases/por-registar.json']);return JSON.stringify([nova]);}});
assert(compararListas([],indice).length,'o índice alterado não pode passar por uma árvore limpa');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'frases-origem-'));
try {
  const f={id:'planta',estudo:'planta',tipos:['atribuicao'],pt:'A fonte diz algo documentado.',en:'The source says something documented.',linhas:['linha'],origem:'mandato MANDATO-planta.md',juizo:'por julgar'};
  fs.writeFileSync(path.join(tmp,'MANDATO-planta.md'),'# Mandato de ensaio\n\nAcrescenta: frases\nFrases: frases.json\n\n## Trabalho\n');
  fs.writeFileSync(path.join(tmp,'frases.json'),JSON.stringify([f]));
  assert.deepEqual(conferirOrigem(f,tmp),[]);
  for(const campo of ['pt','en','linhas','tipos'])assert(conferirOrigem({...f,[campo]:campo==='linhas'?['outra']:campo==='tipos'?['causa']:'Alterada'},tmp).length,campo);
  for(const origem of [undefined,'manual','mandato ausente.md','mandato ../fora.md'])assert(conferirOrigem({...f,origem},tmp).length);
  const paginas=['pt','en'].map(lingua=>({estudo:'planta',rota:'/'+lingua,par:lingua==='pt'?'/en':'/pt',lingua,blocos:blocosDaPagina(`<main><p>${f[lingua]}</p></main>`)}));
  const livro=new Map([['linha',{id:'linha',excerpt:'Excerto documentado',document:{source_sha256:'a'.repeat(64)}}]]);
  assert.deepEqual(conferirRegisto([f],paginas,livro,{medidas:tmp}).erros,[]);
  for(const juizo of [undefined,'aprovado','limpo'])assert(conferirRegisto([{...f,juizo}],paginas,livro,{medidas:tmp}).erros.length);
  assert(conferirRegisto([{...f,origem:'semente'}],paginas,livro,{medidas:tmp}).erros.length);
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
const texto='Disse «Uma declaração longa.» Este número é diferente.';
const paginas=['pt','en'].map(lingua=>({estudo:'colecao-municipio',rota:'/'+lingua,par:lingua==='pt'?'/en':'/pt',lingua,blocos:blocosDaPagina(`<main><p>${lingua==='pt'?texto:'Said «Uma declaração longa.» Indicates a different value.'}<a class="src-chip" data-claim="linha">selo</a></p></main>`)}));
const livro=new Map([['linha',{id:'linha',afirmacao:true,excerpt:'Uma declaração longa.',document:{source_sha256:'a'.repeat(64)}}]]);
const r=semear(paginas,livro);assert.equal(r.registo.length,1);assert.equal(r.registo[0].pt,'Disse «Uma declaração longa.»');assert(r.pendentes.some(p=>p.lingua==='pt'));
assert.equal(inventario([...paginas,{...paginas[0],rota:'/outra'}]).length,inventario(paginas).length);
const causa=structuredClone(paginas);causa[0].blocos=blocosDaPagina('<main><p>Disse «Uma declaração longa.» porque aconteceu.<a class="src-chip" data-claim="linha">selo</a></p></main>');causa[1].blocos=blocosDaPagina('<main><p>Said «Uma declaração longa.» because it happened.<a class="src-chip" data-claim="linha">seal</a></p></main>');
assert.deepEqual(semear(causa,livro).registo[0].tipos,['atribuicao','causa']);
console.log('adenda C: pino, mandato, juízo, índice preparado, corte, coleção e tipos conferidos');

assert.deepEqual(conferirAmbito(['municipios/evora/index.html'],[]),['municipios/evora/index.html']);
assert.deepEqual(conferirAmbito(['livro-razao/ensaio/index.html'],[]),[]);

assert(conferirSemente({id:'inventada',origem:'semente'}).length);
for(const f of JSON.parse(fs.readFileSync('ledger/frases/pagina-o-que-se-discute.json','utf8'))) assert.deepEqual(conferirSemente(f),[]);
