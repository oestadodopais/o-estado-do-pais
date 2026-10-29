/** OG1-B4: compara a L1 com a medição DO1 e planta alterações alheias. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const pasta='design/especime-v3/medicoes/og1-b4-2026-10-29';
const origem='design/especime-v3/medicoes/do1-2026-10-29/l1-do1.json';
const base=JSON.parse(fs.readFileSync(origem));
const texto=fs.readFileSync(process.argv[2],'utf8').replace(/\x1b\[[0-9;]*m/g,'');
const total=Number(texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
const paginas=Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
const novas=['/en/ledger/og1-votacao-generalidade-oficial','/livro-razao/og1-votacao-generalidade-oficial'];
function portas(rota){const root=parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8')),mapa={};for(const a of root.querySelectorAll('main a[href]')){const h=a.getAttribute('href');mapa[h]=(mapa[h]??0)+1;}return mapa;}
const atuais=Object.fromEntries(Object.keys(base.portas).map(r=>[r,portas(r)]));
const esperadas=structuredClone(base.portas);
for(const [rota,livro,oficiais]of [['/o-que-se-discute','/livro-razao/',10],['/en/under-discussion','/en/ledger/',11]]){
 // Diferenças medidas no HTML: três datas do ECO, uma data do guião,
 // o recibo contextual da RTP e os tokens e recibos da linha oficial.
 esperadas[rota][livro+'og1-votacao-generalidade']-=3;
 esperadas[rota][livro+'og1-guiao-votacoes-28']-=1;
 esperadas[rota][livro+'og1-votacao-generalidade-rtp']+=1;
 esperadas[rota][livro+'og1-votacao-generalidade-oficial']=oficiais;
}
function conferir(m,links){
 assert.equal(Object.keys(m.paginas).length,m.total,'Amostra completa');
 assert.equal(m.total,base.contagens.estudos+novas.length);
 assert.deepEqual(Object.keys(m.paginas).filter(r=>!base.paginas[r]).sort(),novas);
 for(const [r,p]of Object.entries(base.paginas))assert.deepEqual(m.paginas[r],{...p,destinos:p.destinos+(['/o-que-se-discute','/en/under-discussion'].includes(r)?1:0)},r);
 for(const r of novas)assert.deepEqual(m.paginas[r],{destinos:1,exemplo:r.startsWith('/en/')?'/en/method':'/metodo',vezes:2});
 assert.deepEqual(links,esperadas,'Só mudam as portas do item autorizadas no mandato');
}
const medida={total,paginas};conferir(medida,atuais);
const plantas=[];
for(const [nome,mudar]of [
 ['recibo novo omitido',m=>{delete m.paginas[novas[0]];}],
 ['multiplicidade do recibo alterada',m=>{m.paginas[novas[0]].vezes++;}],
 ['repetição anterior alterada',m=>{m.paginas['/'].destinos++;}],
 ['destino oficial trocado',m=>{m.paginas[novas[1]].exemplo='/destino-alheio';}],
 ['página indevida',m=>{m.paginas['/planta-og1b4']={destinos:1,exemplo:'/',vezes:2};m.total++;}],
 ['contagem diferente',m=>{m.total++;}],
]){const m=structuredClone(medida);mudar(m);assert.throws(()=>conferir(m,atuais));plantas.push(nome);}
const falsas=structuredClone(atuais);falsas['/o-que-se-discute']['/destino-alheio']=2;assert.throws(()=>conferir(medida,falsas));plantas.push('porta alheia no item');
const resultado={comando:'AMOSTRA=5000 npm run check:lugar',base:origem,contagens:{estudos:total,antes:base.contagens.estudos,novas:novas.length},paginas,portas:atuais,plantas,razao:'Entram apenas os dois recibos da linha oficial, cada um com duas portas para o Método. Nas duas páginas da discussão entra um destino repetido, a linha oficial; as restantes páginas conservam a contagem e o exemplo da L1. As portas das páginas amostradas no DO1 só mudam no item: as datas e os recibos prescritos pelo mandato, incluindo o fragmento numérico da glosa inglesa. A regra da L1 não muda.'};
if(process.argv.includes('--escrever')){fs.writeFileSync(pasta+'/l1-og1b4.json',JSON.stringify(resultado,null,2)+'\n');fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:total,medicao:pasta+'/l1-og1b4.json'},null,2)+'\n');}
console.log(JSON.stringify({antes:base.contagens.estudos,depois:total,novas,plantas:plantas.length}));
