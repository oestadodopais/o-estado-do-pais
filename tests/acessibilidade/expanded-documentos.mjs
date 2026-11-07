/** H10: só o corpo da obra citada declarada fica fora; a faixa fica medida. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {seletorDosComandos,avaliaExpanded} from './expanded.mjs';
import {manifestoDasEdicoes,versoesDaEdicao} from '../../src/lib/edicoes.mjs';
const rotas=manifestoDasEdicoes().edicoes.flatMap(e=>versoesDaEdicao(e.slug,e.lang).map(v=>v.rota));
let plantas=0;
for(const rota of [...rotas,'/metodo','/en/method','/estudos/inventado/documento/1900-01-01']) {
 const declarada=rotas.includes(rota);
 const root=parse('<aside><nav aria-expanded="true">Comando da casa sem destino</nav></aside><main data-oedp-moldura><span aria-expanded="false">Comando do documento</span></main>');
 const nos=root.querySelectorAll(seletorDosComandos(rota));
 assert.equal(nos.length,declarada?1:2);
 assert.equal(nos[0].tagName,'NAV');
 assert.equal(avaliaExpanded({expanded:nos.length,paginasExpanded:[{rota,n:nos.length}]},[{rota,comandos:nos.map(()=>({mudou:false}))}],{ocorrencias:1,aceite:false}),false);
 plantas++;
}
console.log(`H10: ${rotas.length} rotas documentais declaradas; ${plantas} plantas da casa recusadas, incluindo o Método e uma rota inventada.`);
