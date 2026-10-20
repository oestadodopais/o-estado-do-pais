/** Compara as frases resolvidas com o HTML e sela os recibos nas duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {textoSemSelos} from '../../../../tests/explicacoes/explicacao.mjs';
import {conferirRecibosDosEfeitos} from '../../../../tests/discussao/efeitos.mjs';
import {unidadesDepoisDoSelo,conferirSelosInline} from '../../../../tests/discussao/itens.mjs';
import {ITENS} from '../../../../src/data/discussao.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
const pasta=new URL(process.env.OEDP_MEDICAO ?? './b/',import.meta.url);
const esperado=JSON.parse(fs.readFileSync(new URL('frases-e-portas.json',pasta)));
const norm=s=>s.replace(/\s+/g,' ').trim();
const sha=s=>createHash('sha256').update(s).digest('hex');
const result={cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,paragrafos:0,edicoes:{},paginas:[],recibos:[],unidadesDepoisDoSelo:{},selosInline:{}};
for(const lang of ['pt','en']){
 const file=(lang==='pt'?'o-que-se-discute':'en/under-discussion')+'/index.html';
 const body=fs.readFileSync('dist/'+file),root=parse(body.toString());
 result.unidadesDepoisDoSelo[lang]=unidadesDepoisDoSelo(root);
 result.selosInline[lang]=conferirSelosInline(root,lang);
 assert.deepEqual(result.unidadesDepoisDoSelo[lang],[]);
 assert.deepEqual(result.selosInline[lang],[]);
 result.edicoes[lang]=[];
 for(const item of esperado.edicoes[lang]){
  const artigo=root.querySelector('#'+item.slug),seccoes=[];
  assert(artigo);
  for(const sec of item.seccoes){
   const textos=artigo.querySelector(`[data-discussao-parte="${sec.id}"]`).querySelectorAll('[data-discussao-paragrafo]').map(n=>norm(textoSemSelos(n)));
   assert.deepEqual(textos,sec.paragrafos.map(norm));
   result.paragrafos+=textos.length;
   seccoes.push({...sec,paragrafos:textos});
  }
  result.edicoes[lang].push({slug:item.slug,titulo:item.titulo,seccoes});
 }
 result.paginas.push({lang,ficheiro:file,sha256:sha(body)});
 for(const id of esperado.portas.novas){
  const file=(lang==='pt'?'livro-razao':'en/ledger')+'/'+id+'/index.html';
  const bytes=fs.readFileSync('dist/'+file),doc=parse(bytes.toString());
  assert(doc.querySelector('[data-discussao-integracao]'));
  result.recibos.push({id,lang,ficheiro:file,sha256:sha(bytes),cabecalho:norm(doc.querySelector('h1').text)});
 }
}
const conf=conferirRecibosDosEfeitos('dist',ITENS,loadClaims());
assert.deepEqual(conf.erros,[]);
assert(conf.plantas.every(p=>p.mordeu));
result.plantas=conf.plantas;
fs.writeFileSync(new URL('render-conferido.json',pasta),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({paragrafos:result.paragrafos,recibos:result.recibos.length,plantas:conf.plantas.length}));
