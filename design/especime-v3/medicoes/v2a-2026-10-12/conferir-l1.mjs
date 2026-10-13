/** V2-a: a contagem integral vem da régua R4; as portas novas são uma lista fechada. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {routePath, LANGS} from '../../../../src/lib/routes.mjs';
const pasta='design/especime-v3/medicoes/v2a-2026-10-12';
const medido=JSON.parse(fs.readFileSync(`${pasta}/l1-destinos.json`,'utf8'));
const origem='design/especime-v3/medicoes/rp4n-2026-10-06/portoes-j/verify.log';
const historico=fs.readFileSync(origem,'utf8');
const anteriores=Number(historico.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/)[1]);
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json','utf8')).rows);
const novas=ids.flatMap(slug=>LANGS.map(lang=>routePath('linha',lang,{slug}))).sort();
const destinos=medido.repetidos_por_pagina;
const antigas=Object.fromEntries(Object.entries(destinos).filter(([url])=>!novas.includes(url)));
const mensagens={antigas:'V2A L1: uma página anterior mudou de destinos ou multiplicidade.',
  novas:'V2A L1: as páginas novas não são os recibos declarados.',
  portas:'V2A L1: um recibo novo não tem apenas as duas portas do Método.'};
function conferir(atual) {
  for(const [url,portas] of Object.entries(antigas)) assert.deepEqual(atual[url],portas,mensagens.antigas);
  assert.deepEqual(Object.keys(atual).filter(url=>!(url in antigas)).sort(),novas,mensagens.novas);
  for(const url of novas) assert.deepEqual(atual[url],{[routePath('metodo',url.startsWith('/en/')?'en':'pt')]:2},mensagens.portas);
}
conferir(destinos);
assert.equal(Object.keys(antigas).length,anteriores,'A contagem das páginas anteriores difere da RP4-n-j.');
assert.equal(medido.paginas,anteriores+novas.length);
// O livro anterior e a vista que rende os recibos mantêm os mesmos objetos Git.
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const tree=ref=>Object.fromEntries(git('ls-tree','-r',ref,'ledger/claims').split('\n').map(l=>{const [blob,file]=l.split('\t');return [file,blob];}));
const base=tree('98487940'),atual=tree('HEAD');
for(const [f,blob] of Object.entries(base)) assert.equal(atual[f],blob,`Linha anterior alterada: ${f}`);
assert.equal(git('rev-parse','98487940:src/views/LinhaView.astro'),git('rev-parse','HEAD:src/views/LinhaView.astro'));
const plantas=[];
for(const [nome,mensagem,altera] of [
  ['multiplicidade anterior',mensagens.antigas,c=>{const u=Object.keys(antigas)[0];c[u][Object.keys(c[u])[0]]++;}],
  ['porta nova extra',mensagens.portas,c=>{c[novas[0]][Object.keys(c[novas[0]])[0]]++;}],
  ['página alheia',mensagens.novas,c=>{c['/planta-v2a']={'/metodo':2};}],
  ['recibo ausente',mensagens.novas,c=>{delete c[novas[0]];}],
]) {
  const copia=structuredClone(destinos);altera(copia);let queixa;
  try {conferir(copia);} catch(e) {queixa=e.message;}
  assert(queixa?.includes(mensagem),nome);plantas.push({nome,mensagem,mordeu:true});
}
const registo={cabeca:git('rev-parse','HEAD'),construcao:JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,
  contagens:{estudos:medido.paginas,anteriores,novas:novas.length},contagem:`${pasta}/l1-destinos.json`,
  base:origem,novas:Object.fromEntries(novas.map(u=>[u,destinos[u]])),plantas,
  razao:'A RP4-n-j mediu as páginas anteriores abaixo do teto herdado do JD1. Entram os recibos V2-a nas duas edições, com duas portas do Método cada. A contagem integral foi refeita pela régua R4 e coincide com a L1. Os objetos Git das linhas anteriores e da vista dos recibos não mudaram.',
  limite:'O registo histórico da RP4-n-j prova o total anterior, não guarda os destinos por página. A comparação de multiplicidades usa a fotografia integral desta construção; não se apresenta como reconstrução do HTML da cabeça de partida.'};
if(process.argv.includes('--write')) {
  fs.writeFileSync(`${pasta}/l1-v2a.json`,JSON.stringify(registo,null,2)+'\n');
  fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:medido.paginas,medicao:`${pasta}/l1-v2a.json`},null,2)+'\n');
}
console.log(JSON.stringify({contagens:registo.contagens,plantas}));
