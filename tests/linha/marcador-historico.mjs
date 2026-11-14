import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {inventariarMarcadores} from '../../scripts/sem-marcadores.mjs';
import {conferirValorDeProveniencia} from '../../scripts/verificacao-legivel.mjs';
for (const lang of ['pt','en']) {
 const entry={kind:'proveniencia',field:'excerpt',new_value:'[a verificar]'};
 const claims=new Map([['sintetica',{corrections:[entry]}]]);
 const rota={key:'linha',lang,params:{slug:'sintetica'}};
 const marker=lang==='pt'?'por confirmar na fonte':'to be confirmed at the source';
 const html=`<div class="historico-entrada"><span data-correcao-claim="sintetica" data-correcao-n="0" data-correcao-campo="new_value"><a class="marcador">${marker}</a></span></div>`;
 const check=(h=html)=>inventariarMarcadores(parse(h),{rota,claims}).recusadas;
 assert.equal(check().length,0);
 for (const [from,to] of [['sintetica','outra'],['data-correcao-n="0"','data-correcao-n="1"'],['new_value','old_value'],['historico-entrada','fora']]) assert.equal(check(html.replace(from,to)).length,1);
 entry.new_value='excerto literal';assert.equal(check().length,1);entry.new_value='[a verificar]';
 assert(conferirValorDeProveniencia(entry,'new_value',marker,lang).confere);
 assert(!conferirValorDeProveniencia(entry,'new_value',lang==='pt'?'to be confirmed at the source':'por confirmar na fonte',lang).confere);
}
console.log('ZER0: marcador histórico conferido nas duas línguas; identidade, índice, campo, contexto, valor e língua adulterados recusados.');
