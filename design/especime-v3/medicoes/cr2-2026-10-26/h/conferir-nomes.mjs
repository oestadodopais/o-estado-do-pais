/** Compara as tabelas com git show e lê os nomes no HTML das duas construções. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import * as atual from '../../../../../src/data/nomes-das-medidas.mjs';
import { nomeNoRecibo } from '../../../../../src/lib/o-que-e-o-numero.mjs';
const pasta=path.dirname(fileURLToPath(import.meta.url));
const raiz=process.cwd();
const saida=(nome,dados)=>fs.writeFileSync(path.join(pasta,nome),JSON.stringify(dados,null,2)+'\n');
const base='71420a8f4';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'cr2h-nomes-'));
try {
 const origem='src/data/nomes-das-medidas.mjs';
 const original=execFileSync('git',['show',`${base}:${origem}`],{encoding:'utf8'});
 const codigo=original.replace(/from (['"])(\.[^'"]+)\1/g,(_,aspas,rel)=>`from ${aspas}${pathToFileURL(path.resolve(path.dirname(path.join(raiz,origem)),rel)).href}${aspas}`);
 const ficheiro=path.join(tmp,'nomes.mjs');fs.writeFileSync(ficheiro,codigo);
 const anterior=await import(pathToFileURL(ficheiro).href);
 const tabelas=[];
 for(const chave of ['NOMES_DO_PROJETO','NOMES_DAS_LINHAS_DERIVADAS']) {
  assert.deepEqual(atual[chave],anterior[chave],chave);
  tabelas.push({tabela:chave,chaves:Object.keys(atual[chave]).length,igual:true});
 }
 saida('tabelas-nomes.json',{base,tabelas});
 console.log('Duas tabelas iguais a main, chave a chave e texto a texto.');
} finally { fs.rmSync(tmp,{recursive:true}); }
if(process.argv.includes('--so-tabelas'))process.exit(0);
const distMain=process.argv[2];assert(distMain,'Indique o dist construído de main.');
const ids=JSON.parse(fs.readFileSync(path.join(pasta,'razoes.json'),'utf8')).map(e=>e.id);
const uniao=ids.filter(id=>id.endsWith('-ue'));
const ler=(dist,rel)=>parse(fs.readFileSync(path.join(dist,rel,'index.html'),'utf8'));
const norm=t=>t.replace(/\s+/gu,' ').trim();
const recibos=[],mudancas=[],historico=[];
for(const [lang,rota,livro] of [['pt','correcoes','livro-razao'],['en','en/corrections','en/ledger']]) {
 for(const id of uniao) {
  const antes=norm(ler(distMain,`${livro}/${id}`).querySelector('h1').textContent);
  const depois=norm(ler('dist',`${livro}/${id}`).querySelector('h1').textContent);
  assert.equal(depois,antes,`${lang}: título ${id}`);
  assert(depois.includes(lang==='pt'?'na União Europeia':'in the European Union'));
  recibos.push({lang,id,main:antes,atual:depois,igual:true});
 }
 const extrair=dist=>ler(dist,rota).querySelectorAll('li.registo-mudanca[data-correcao-entrada]').map(e=>({id:e.getAttribute('data-correcao-entrada'),data:e.querySelector('time').getAttribute('datetime'),nome:norm(e.querySelector('.registo-mudanca-nome').textContent),fonte:e.querySelector('.registo-mudanca-nome').getAttribute('data-nome'),familia:e.querySelector('.registo-mudanca-nome').getAttribute('data-de-familia')}));
 const antes=extrair(distMain),depois=extrair('dist');
 const antigasAntes=antes.filter(e=>e.data<'2026-10-26');
 const antigasDepois=depois.filter(e=>e.data<'2026-10-26');
 // A ordem dentro da mesma linha e dia mantém a identidade das entradas repetidas.
 const nomes=lista=>lista.map(({id,data,nome})=>({id,data,nome}));
 const divergencias=antigasAntes.flatMap((e,i)=>JSON.stringify(nomes([e])[0])===JSON.stringify(nomes(antigasDepois.slice(i,i+1))[0])?[]:[{antes:e,depois:antigasDepois[i]??null}]);
 historico.push({lang,entradas_main:antes.length,entradas_anteriores:antigasAntes.length,entradas_anteriores_atual:antigasDepois.length,divergencias});
 saida('historico-nomes.json',{base,historico});
 // Recolhe ambas as edições antes de comunicar a paragem, sem aceitar divergências.
 const outras26=lista=>nomes(lista.filter(e=>e.data==='2026-10-26'&&!ids.includes(e.id)));
 assert.deepEqual(outras26(depois),outras26(antes),'Outras entradas de 26.10 mudaram');
 historico.at(-1).outras_26_iguais=outras26(antes).length;
 const novas=depois.filter(e=>e.data==='2026-10-26'&&ids.includes(e.id));
 assert.equal(novas.length,ids.length);
 assert.deepEqual(novas.map(e=>e.id).sort(),[...ids].sort());
 for(const e of novas) {
  const recibo=norm(ler('dist',`${livro}/${e.id}`).querySelector('h1').textContent);
  assert.equal(e.nome,recibo,`${lang}: nome da entrada ${e.id}`);
  const declarado=nomeNoRecibo(e.id,lang);
  assert.equal(e.nome,norm(declarado.texto));
  if(e.fonte==='familia')assert.equal(e.familia,declarado.familia);
  mudancas.push({lang,...e,recibo,igual:true,main:antes.filter(x=>x.id===e.id&&x.data===e.data).map(x=>x.nome)});
 }
}
saida('historico-nomes.json',{base,historico});
saida('recibos.json',{base,recibos});saida('mudancas.json',{base,mudancas});
console.log(`${recibos.length} títulos iguais a main; ${mudancas.length} entradas de 26.10 iguais aos recibos.`);
assert(historico.every(e=>e.divergencias.length===0 && e.entradas_anteriores===e.entradas_anteriores_atual), 'PARAGEM: há nomes de entradas anteriores a 26.10 que mudaram; ver historico-nomes.json');
