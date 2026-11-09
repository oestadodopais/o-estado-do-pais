import assert from 'node:assert/strict';
import {chave,blocosDaPagina,inventario} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirRegisto,conferirCobertura} from '../../scripts/check-frases-afirmacao.mjs';
import {MODELOS,conferirModelos,expressaoDoModelo,modeloDaFrase,catalogoDosModelos} from '../../scripts/frases-modelos.mjs';
import {STRINGS} from '../../src/i18n/strings.mjs';
const k=frase=>chave({estudo:'planta',lingua:'pt',frase});
assert.notEqual(k('Morreram 8 pessoas.'),k('Morreram 8 crianças.'));
assert.notEqual(k('A fonte diz 8 mil.'),k('A fonte diz 8 milhões.'));
const f={id:'planta',estudo:'planta',tipos:['atribuicao'],origem:'semente',juizo:'por julgar',pt:'Segundo a fonte, «A variação foi de 8,0».',en:'According to the source, “The change was 8.0”.',linhas:['linha']};
const pags=['pt','en'].map(lingua=>({estudo:'planta',lingua,rota:'/'+lingua,par:lingua==='pt'?'/en':'/pt',blocos:blocosDaPagina(`<main><p>${f[lingua]}<a class="src-chip" data-claim="linha">selo</a></p></main>`)}));
const livro=new Map([['linha',{id:'linha',afirmacao:true,excerpt:'A variação foi de 8,0',document:{source_sha256:'a'.repeat(64)}}]]);
assert.deepEqual(conferirRegisto([f],pags,livro,{sementes:[f]}).erros,[]);
for(const lingua of ['pt','en']) {
 const ps=structuredClone(pags),p=ps.find(p=>p.lingua===lingua);p.blocos[0].frases[0]=p.blocos[0].frases[0].replace('8,0','9,0').replace('8.0','9.0');
 assert(conferirRegisto([f],ps,livro,{sementes:[f]}).erros.some(e=>e.includes('citação impressa diferente')));
 // Uma ocorrência certa não esconde outra errada com a mesma chave.
 p.blocos.push(structuredClone(pags.find(p=>p.lingua===lingua).blocos[0]));
 assert(conferirRegisto([f],ps,livro,{sementes:[f]}).erros.some(e=>e.includes('citação impressa diferente')));
}
assert.deepEqual(conferirModelos(),[]);
const strings=structuredClone(STRINGS);strings.pt.semana.fonteAgora+='texto novo';assert(conferirModelos(MODELOS,strings).length);
const alterados=structuredClone(MODELOS);alterados[0].modelo+=' oração';assert(conferirModelos(alterados).length);
for(const m of MODELOS) {
 const re=expressaoDoModelo(m);
 assert(!re.test('Segundo o ministro, o país melhorou.'));
 if(m.id.startsWith('revisao')) {
  const c=catalogoDosModelos()[m.lingua],campos={indicador:[...c.indicador][0],periodo:[...c.periodo][0],unidade:[...c.unidade][0],valor:'23',data:'16.11.2026'};
  const frase=m.modelo.replace(/\{(\w+)\}/g,(_,k)=>campos[k]);assert(re.test(frase));assert(!re.test(frase+' O ministro disse que melhorou.'));assert(!re.test(frase.replace(campos.indicador,'Segundo o ministro, melhorou')));
 }
 if(m.id.startsWith('painel')){const frase=m.modelo.replace('{data}','16.11.2026');assert(re.test(frase));assert(!re.test(frase+' O ministro disse que melhorou.'));}
}
const manual='Segundo o ministro, o país melhorou.';
assert.equal(modeloDaFrase(manual,'pt','leituraDaSemana'),null);
const p=[{estudo:'planta',lingua:'pt',tipo:'leituraDaSemana',rota:'/pt',par:'/en',blocos:blocosDaPagina(`<main><p>${manual}</p></main>`)}];
assert(conferirCobertura(inventario(p),new Set(),[]).some(e=>e.includes('sem registo')));
console.log('adenda F: citações impressas PT e EN sem máscara, todas as ocorrências, palavras após números, prosa manual e modelos diferentes da fonte recusados');
