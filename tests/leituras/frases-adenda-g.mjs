import assert from 'node:assert/strict';
import {MODELOS,conferirModelos,construirCatalogo,linhaDoCatalogo,modeloDaFrase} from '../../scripts/frases-modelos.mjs';
import {tiposDaFrase,blocosDaPagina,inventario} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirCobertura,conferirHistorico} from '../../scripts/check-frases-afirmacao.mjs';
import fs from 'node:fs';
const frases={pt:'Feridos segundo o movimento, pela imprensa, 2025: publicado 7,7 %; a fonte escreve agora 7,6, na releitura de 09.11.2026.',en:'Pensions and income tax: the 2026 measures (the extraordinary supplement and the rate reduction), according to the CFP, 2025: published 7.7 %; the source now writes 7.6, in the re-reading of 09.11.2026.'};
for(const [lingua,frase] of Object.entries(frases)) {
 assert(tiposDaFrase(frase,lingua).includes('atribuicao'));
 assert.equal(modeloDaFrase(frase,lingua,'leituraDaSemana'),null);
 const paginas=[{rota:'/'+lingua,par:'/ausente',tipo:'leituraDaSemana',estudo:'planta',lingua,blocos:blocosDaPagina(`<main><p>${frase}</p></main>`)}];
 assert(conferirCobertura(inventario(paginas),new Set(),[]).some(e=>e.includes('sem registo')));
}
const linha={id:'planta-relida',study:'planta',unit:'%',verifications:[{date:'2026-11-09',result:'igual'}]};
assert(linhaDoCatalogo(linha));
for(const extra of [{verifications:[]},{afirmacao:true},{unit:'afirmação'}])assert(!linhaDoCatalogo({...linha,...extra}));
for(const campo of ['indicador','unidade','periodo']) {
 const dados=construirCatalogo([linha],(_,lingua)=>({indicador:'Indicador',unidade:'%',periodo:'2025',[campo]:lingua==='pt'?'Segundo a fonte':'According to the source'}));
 const erros=conferirModelos(MODELOS,undefined,undefined,dados);
 for(const lingua of ['pt','en'])assert(erros.some(e=>e.includes(linha.id)&&e.includes(lingua)&&e.includes(campo)));
}
assert.deepEqual(conferirHistorico(JSON.parse(fs.readFileSync('ledger/frases/por-registar.json','utf8'))),[]);
console.log('adenda G: atribuições da leitura curta exigem registo; alternativas tipadas recusam e nomeiam a linha nos três campos e nas duas línguas; histórico E e F conferido');
