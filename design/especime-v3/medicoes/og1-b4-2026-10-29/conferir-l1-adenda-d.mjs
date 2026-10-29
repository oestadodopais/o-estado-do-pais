/** Adendas D e E: a correção das atribuições conserva as páginas da L1. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const pasta='design/especime-v3/medicoes/og1-b4-2026-10-29';
const base=JSON.parse(fs.readFileSync(pasta+'/l1-og1b4.json'));
const texto=fs.readFileSync(pasta+'/l1-adenda-e.log','utf8').replace(/\x1b\[[0-9;]*m/g,'');
const total=Number(texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
const paginas=Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
assert.equal(Object.keys(paginas).length,total,'Recolha completa');
assert.equal(total,base.contagens.estudos);
assert.deepEqual(paginas,base.paginas,'Contagens e exemplos da L1 conservados em todas as páginas');
const esperadas=structuredClone(base.portas),atuais={},mudancas=[];
for(const[rota,livro,menos]of [['/o-que-se-discute','/livro-razao/',1],['/en/under-discussion','/en/ledger/',2]]){
 esperadas[rota][livro+'og1-votacao-generalidade-oficial']-=menos;
 esperadas[rota][livro+'og1-votacao-generalidade']++;
 esperadas[rota][livro+'og1-votacao-generalidade-rtp']--;
}
for(const [rota,antes]of Object.entries(base.portas)){
 const root=parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8')),mapa={};
 for(const a of root.querySelectorAll('main a[href]')){const h=a.getAttribute('href');mapa[h]=(mapa[h]??0)+1;}
 atuais[rota]=mapa;
 for(const h of new Set([...Object.keys(antes),...Object.keys(mapa)]))if(antes[h]!==mapa[h])mudancas.push({rota,destino:h,antes:antes[h]??0,depois:mapa[h]??0});
}
assert.deepEqual(atuais,esperadas,'Só mudam a data da comparação, o recibo da RTP na abertura e a glosa inglesa');
const resultado={base:pasta+'/l1-og1b4.json',registo:pasta+'/l1-adenda-e.log',antes:base.contagens.estudos,depois:total,paginasConferidas:Object.keys(paginas).length,paginasIdenticas:true,mudancasDePortas:mudancas,razao:'As duas datas da comparação voltam ao ECO, o recibo contextual da RTP sai da abertura e a glosa inglesa perde o selo numérico. As contagens, exemplos e multiplicidades da L1 ficam iguais em todas as páginas; apenas as portas descritas mudam nas duas páginas da discussão.'};
fs.writeFileSync(pasta+'/l1-adenda-d-comparacao.json',JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({antes:resultado.antes,depois:total,paginasConferidas:resultado.paginasConferidas,mudancasDePortas:mudancas.length}));
