/** Confere as frases do relatório e os recibos da quarta correção no HTML. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {textoSemSelos} from '../../../../tests/explicacoes/explicacao.mjs';
const pasta=new URL('./',import.meta.url);
const final=JSON.parse(fs.readFileSync(new URL('frases-e-portas.json',pasta)));
const norm=s=>s.replace(/\s+/g,' ').trim();
const sha=s=>createHash('sha256').update(s).digest('hex');
const linhas=loadClaims();
const ids=['oe-2027-outras-despesas-dotacoes-execucao','oe-2027-saude-dotacao-reforco-contratos-programa','der-saude-outras-correntes-variacao-abs','oe-2027-saude-contrato-programa-acss'];
const antigos=['oe-2027-outras-despesas-correntes-reserva','oe-2027-saude-acao-reserva-orcamental'];
const result={ok:true,cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,paragrafos:0,paginas:[],recibos:[],textuais_do_relatorio:[]};
for(const lang of ['pt','en']){
 const ficheiro=(lang==='pt'?'o-que-se-discute':'en/under-discussion')+'/index.html';
 const body=fs.readFileSync('dist/'+ficheiro),root=parse(body.toString());
 for(const item of final.edicoes[lang]){
  const artigo=root.querySelector('#'+item.slug);
  for(const sec of item.seccoes){
   const textos=artigo.querySelector(`[data-discussao-parte="${sec.id}"]`).querySelectorAll('[data-discussao-paragrafo]').map(n=>norm(textoSemSelos(n)));
   assert.deepEqual(textos,sec.paragrafos.map(norm));
   result.paragrafos+=textos.length;
  }
 }
 for(const id of antigos){assert(!body.includes(id));assert(!fs.existsSync('dist/'+(lang==='pt'?'livro-razao':'en/ledger')+'/'+id+'/index.html'));}
 const comparacao=norm(textoSemSelos(root.querySelector('#saude-no-orcamento [data-discussao-parte="comparacao"]').querySelectorAll('[data-discussao-paragrafo]')[2]));
 const opiniao=norm(textoSemSelos(root.querySelector('#saude-no-orcamento [data-discussao-parte="opiniao"]')));
 assert(comparacao.includes(lang==='pt'?'sem dizer quanto.':'without saying how much.'));
 assert(opiniao.includes(lang==='pt'?'que guarda em outras despesas correntes mais 271,3 milhões, onde o relatório diz estar a dotação para reforçar contratos-programa ainda por fechar, sem dizer quanto':'that holds 271,3 million more in other current expenditure, where the report says the provision to reinforce contract-programmes still to be closed sits, without saying how much'));
 assert(!comparacao.includes('Defesa')&&!comparacao.includes('Defence'));
 for(const id of ['oe-2027-saude-dotacao-reforco-contratos-programa','oe-2027-saude-contrato-programa-acss']){
  assert(root.querySelectorAll('a').some(a=>a.getAttribute('href')?.replace(/\/$/,'')===(lang==='pt'?'/livro-razao/':'/en/ledger/')+id));
 }
 result.paginas.push({lang,ficheiro,sha256:sha(body)});
 for(const id of ids){
  const l=linhas.get(id),file=(lang==='pt'?'livro-razao':'en/ledger')+'/'+id+'/index.html';
  const bytes=fs.readFileSync('dist/'+file),doc=parse(bytes.toString());
  const cabecalho=norm(doc.querySelector('h1').text);
  if(l.afirmacao){
   assert(cabecalho.includes(lang==='pt'?'orçamento para 2027':'budget for 2027'));
   assert(!cabecalho.includes('08.10.2026'));
   assert(doc.querySelectorAll('[data-linha-campo="excerpt"]').some(n=>norm(n.text)===norm(l.excerpt)));
   assert(doc.querySelectorAll('[data-de-campo="published_at"]').some(n=>n.text.includes('08.10.2026')));
  }
  result.recibos.push({id,lang,ficheiro:file,sha256:sha(bytes),cabecalho,reference_date:l.reference_date,published_at:l.published_at??null,excerto_ou_derivacao:l.derivation??l.excerpt});
 }
}
for(const l of linhas.values())if(l.afirmacao&&l.document?.title==='Orçamento do Estado 2027 · Relatório'){
 assert.equal(l.reference_date,'2027');assert.equal(l.published_at,'2026-10-08');
 result.textuais_do_relatorio.push(l.id);
}
assert.equal(linhas.get(ids[2]).value,'271,3');
for(const id of antigos)assert(!linhas.has(id));
fs.writeFileSync(new URL('render-conferido-v2de.json',pasta),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({ok:result.ok,paragrafos:result.paragrafos,recibos:result.recibos.length,textuais_do_relatorio:result.textuais_do_relatorio.length}));
