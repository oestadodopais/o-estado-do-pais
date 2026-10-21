/** Recolhe a prosa e o inventário da cabeça construída, sem reescrever dist/. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const importar=p=>import(pathToFileURL(path.resolve(p)));
import {parse} from 'node-html-parser';
const {textoSemSelos}=await importar('tests/explicacoes/explicacao.mjs');
const {unidadesDepoisDoSelo}=await importar('tests/discussao/itens.mjs');
const pasta=process.argv[2],sha=s=>createHash('sha256').update(s).digest('hex');
const cabeca=JSON.parse(fs.readFileSync('dist/version.json')).commit;
assert.equal(cabeca,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
const alterados=execFileSync('git',['diff','--name-only','HEAD'],{encoding:'utf8'}).trim().split('\n').filter(f=>f&&!f.startsWith('design/especime-v3/medicoes/v2e-2026-10-20/'));
assert.deepEqual(alterados,[], 'Há alterações por registar fora do relatório');
const r={cabeca,edicoes:{}};
for(const lang of ['pt','en']){
 const rota=lang==='pt'?'o-que-se-discute':'en/under-discussion';
 const html=fs.readFileSync(`dist/${rota}/index.html`,'utf8'),root=parse(html);
 const p=root.querySelector('#saude-no-orcamento [data-discussao-paragrafo="seccoes[1].conteudo[6].paragrafo"]');
 const texto=textoSemSelos(p),frase=texto.slice(texto.lastIndexOf(' Portugal'));
 const exigido=lang==='pt'?'nos vinte e seis Estados-membros com dados de 2024; a Eslováquia não os tem.':'among the twenty-six member states with 2024 data; Slovakia has none.';
 assert(frase.includes(exigido));assert.deepEqual(unidadesDepoisDoSelo(root),[]);
 const pedidos=root.querySelector('#parcerias-rodoviarias [data-discussao-paragrafo="seccoes[1].conteudo[5].paragrafo"]');
 assert(pedidos,'Falta o parágrafo dos pedidos');
 const textoPedidos=textoSemSelos(pedidos);
 assert(textoPedidos.includes(lang==='pt'?'com dados reportados a':'with data referenced to'));
 assert(pedidos.querySelector('[data-claim="ppp-oe2027-riscos-pedidos-rodoviarios"]'));
 assert(pedidos.querySelector('a[data-discussao-periodo="ppp-oe2027-riscos-pedidos-rodoviarios"][href$="/ppp-oe2027-riscos-pedidos-rodoviarios"]'));
 r.edicoes[lang]={rota,frase:frase.trim(),pedidos:textoPedidos,html:p.innerHTML,html_pedidos:pedidos.innerHTML,sha256:sha(html),recibos:[]};
 for(const pais of ['pt','be','el']){
  const id=`eurostat-${pais}-phys`,pagina=`${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`;
  const corpo=fs.readFileSync('dist/'+pagina,'utf8'),recibo=parse(corpo),nota=lang==='pt'?'O conjunto alojado inclui também países que não são Estados-membros.':'The hosted dataset also includes countries that are not member states.';
  assert(recibo.text.includes(nota));
  r.edicoes[lang].recibos.push({id,pagina,nota,sha256:sha(corpo)});
 }
}
fs.writeFileSync(pasta+'/frases-renderizadas.json',JSON.stringify(r,null,2)+'\n');
const bruto=execFileSync(process.execPath,['scripts/medir-defeitos.mjs','--json'],{encoding:'utf8',maxBuffer:128*1024*1024});
fs.writeFileSync(pasta+'/inventario-completo.json',bruto);
const m=JSON.parse(bruto.slice(bruto.indexOf('{'))),d=m.frases_da_casa;
const nao_classificados=Object.values(d.por_rota).reduce((s,r)=>s+r.nao_classificados.length,0);
assert.equal(nao_classificados,0);assert.deepEqual(d.declaracoes.vivas_que_nao_rendem,[]);
fs.writeFileSync(pasta+'/inventario.json',JSON.stringify({cabeca,nao_classificados,declaracoes:d.declaracoes,sha256_medicao:sha(bruto)},null,2)+'\n');
console.log(JSON.stringify({cabeca,nao_classificados,vivas_que_nao_rendem:d.declaracoes.vivas_que_nao_rendem.length}));
