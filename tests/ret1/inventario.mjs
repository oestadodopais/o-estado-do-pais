import assert from 'node:assert/strict';
import lista from '../../scripts/voz-inventario-ret1.json' with {type:'json'};
import {entradaRetiradaRet1} from '../../scripts/voz-inventario-ret1.mjs';
import {leInventario} from '../../scripts/voz.mjs';
import {separarDescricoesRetiradas} from '../../scripts/voz-inventario-retirados.mjs';
import {WORKS} from '../../src/data/studies.mjs';
const inventario=leInventario(process.cwd()).linhas;
let plantas=0;
for(const d of lista){
 const original=inventario.find(l=>l.n===d.n);assert(original);assert(entradaRetiradaRet1(original));
 assert.equal(separarDescricoesRetiradas([d],inventario).saltadas.length,1);
 for(const campo of ['texto','classe','bloco','n']){assert(!entradaRetiradaRet1({...original,[campo]:'alterado'}));plantas++;}
 assert(!entradaRetiradaRet1({...original,estado:'retirada'}));plantas++;
 const contexto=d.condicao.tipo==='estudos'?{trabalhos:WORKS.map(w=>d.condicao.estudos.includes(w.slug)?{...w,estado:undefined}:w)}:
  d.condicao.tipo==='entrada'?{avulsos:()=>[{}]}:{novidades:()=>[{tipo:'estudo-atualizado'}]};
 assert(!entradaRetiradaRet1(original,contexto));plantas++;
}
assert.equal(lista.length,14);
assert(!entradaRetiradaRet1({estado:'viva',n:0,classe:'conteudo',texto:'Frase de estudo vivo',bloco:'outro'}));plantas++;
console.log(`RET1 inventário: 14 entradas condicionadas; ${plantas} adulterações recusadas, incluindo estudo republicado, entrada com estudo e novidade atualizada.`);
