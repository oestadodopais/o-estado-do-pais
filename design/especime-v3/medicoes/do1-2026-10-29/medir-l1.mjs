/** DO1: a L1 ganha apenas as duas edições do dossiê do Orçamento.
 * Uso: node design/especime-v3/medicoes/do1-2026-10-29/medir-l1.mjs <registo da L1> [--escrever]
 * A base vem da construção da cabeça de partida, antes das alterações.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { DOSSIES } from '../../../../src/data/dossies.mjs';
import { pecasPublicadas } from '../../../../src/lib/novidades.mjs';
import { itensResolvidos } from '../../../../src/lib/discussao.mjs';
import { primeirasFrases } from '../../../../src/lib/estudos-b1.mjs';
import { routePath } from '../../../../src/lib/routes.mjs';
const pasta='design/especime-v3/medicoes/do1-2026-10-29';
const base=JSON.parse(fs.readFileSync(`${pasta}/l1-base.json`));
function ler(f) {
 const t=fs.readFileSync(f,'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 const total=Number(t.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
 const paginas=Object.fromEntries([...t.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
 assert.equal(Object.keys(paginas).length,total,'Amostra completa da L1');
 return {total,paginas};
}
const medida=ler(process.argv[2]);
const novas=['/dossies/orcamento-2027','/en/dossiers/orcamento-2027'];
function portas(rota) {
 const r=parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8')), mapa={};
 for(const a of r.querySelectorAll('main a[href]')){const h=a.getAttribute('href');mapa[h]=(mapa[h]??0)+1;}
 return mapa;
}
const atuais=Object.fromEntries(Object.keys(base.portas).map(r=>[r,portas(r)]));
const esperadas=structuredClone(base.portas);
function juntar(rota,destino) { if (!esperadas[rota]) rota=rota.replace(/\/$/,'') || '/'; assert(esperadas[rota],`Rota sem base: ${rota}`);esperadas[rota][destino]=(esperadas[rota][destino]??0)+1; }
for(const lang of ['pt','en']) {
 const home=lang==='pt'?'/':'/en', temas=routePath('temas',lang), indice=routePath('indice',lang), discussao=routePath('discussao',lang);
 for(const e of itensResolvidos(lang))for(const p of primeirasFrases(e.abertura[0].pedacos,1))if(p?.claim)juntar(home,routePath('linha',lang,{slug:p.claim}));
 for(const p of pecasPublicadas(lang).slice(0,5))if(p.dossie)juntar(home,routePath('dossie',lang,{slug:p.dossie.slug}));
 juntar(indice,routePath('dossies',lang));
 for(const d of DOSSIES) {
  const destino=routePath('dossie',lang,{slug:d.slug});
  juntar(temas,destino);juntar(indice,destino);
  for(const porta of d.portas)juntar(routePath(porta==='habitacao'?'entradaCasa':'entradaEstado',lang),destino);
  for(const slug of d.pecas.estudos)juntar(routePath('estudo',lang,{slug}),destino);
  for(const slug of d.pecas.explicacoes)juntar(routePath('explicacao',lang,{slug}),destino);
  for(const slug of d.pecas.itens)juntar(discussao,destino);
 }
}
function conferir(m,links) {
 assert.equal(Object.keys(m.paginas).length,m.total);
 assert.deepEqual(Object.keys(m.paginas).filter(k=>!base.paginas[k]).sort(),novas);
 assert.deepEqual(links,esperadas,'Só entram as ligações exigidas pelo mandato');
 for(const [r,p] of Object.entries(base.paginas)) {
  const incremento=['/','/en','/o-que-se-discute','/en/under-discussion'].includes(r)?1:0;
  assert.deepEqual(m.paginas[r],{...p,destinos:p.destinos+incremento},`Repetições anteriores: ${r}`);
 }
 for(const [i,r]of novas.entries())assert.deepEqual(m.paginas[r],{destinos:4,exemplo:`${i?'/en/ledger':'/livro-razao'}/pm-q3-3-r37-c3`,vezes:2});
}
conferir(medida,atuais);
const plantas=[];
for(const [nome,mudar]of [
 ['página nova omitida',m=>{delete m.paginas[novas[0]];}],
 ['repetição anterior alterada',m=>{m.paginas['/'].destinos++;}],
 ['multiplicidade nova alterada',m=>{m.paginas[novas[0]].vezes++;}],
 ['página indevida',m=>{m.paginas['/planta-do1']={destinos:1,exemplo:'/',vezes:2};m.total++;}],
 ['contagem diferente',m=>{m.total++;}],
]) {const m=structuredClone(medida);mudar(m);assert.throws(()=>conferir(m,atuais));plantas.push(nome);}
const links=structuredClone(atuais);links['/']['/planta-do1']=2;assert.throws(()=>conferir(medida,links));plantas.push('porta indevida numa página anterior');
const resultado={comando:'AMOSTRA=5000 npm run check:lugar',base:`${pasta}/l1-base.json`,contagens:{estudos:medida.total,antes:base.total,novas:novas.length},paginas:medida.paginas,portas:atuais,plantas,razao:'Duas edições novas do dossiê do Orçamento. O calendário tem recibo na abertura e na secção; os três itens abrem a discussão; as sete entradas do registo ligam ao país. A linha do saldo tem recibo na abertura e no resumo do item. Nas páginas anteriores, só entram as ligações de pertença e os selos locais dos resumos pedidos pelo mandato e pela adenda B. A regra da L1 não muda.'};
if(process.argv.includes('--escrever')){fs.writeFileSync(`${pasta}/l1-do1.json`,JSON.stringify(resultado,null,2)+'\n');fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:medida.total,medicao:`${pasta}/l1-do1.json`},null,2)+'\n');}
console.log(JSON.stringify({antes:base.total,depois:medida.total,plantas:plantas.length}));
