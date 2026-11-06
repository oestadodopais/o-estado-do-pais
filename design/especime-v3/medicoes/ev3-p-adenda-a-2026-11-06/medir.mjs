import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
import {contagensDoRegisto} from '../../../../src/lib/ledger.mjs';
import {portasDaCorrecao} from '../../../../src/lib/edicoes.mjs';
import {dataDaCasa} from '../../../../src/lib/datas.mjs';

const slug='evora-2027-capital-europeia-da-cultura';
const anterior=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/ev3-p-2026-11-06/dist.json'));
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const normal=s=>s.replace(/\s+/g,' ').trim();
const resultados=[];
for(const lang of ['pt','en']) {
 const antes=anterior.textos.find(t=>t.lang===lang);
 const pagina=parse(fs.readFileSync('dist'+antes.rota+'/index.html','utf8'));
 const inicio=lang==='pt'?'Na nota em que anunciou':'In the notice announcing';
 const p=pagina.querySelectorAll('p').find(p=>p.text.includes(inicio));
 assert(p);
 const frase=normal(p.text.slice(p.text.indexOf(inicio)));
 assert.equal(frase,antes.frase);
 const registo=parse(fs.readFileSync(lang==='pt'?'dist/correcoes/index.html':'dist/en/corrections/index.html','utf8'));
 const entrada=registo.querySelector(`[data-texto-estudo="${slug}"][data-texto-data="2026-11-06"]`);
 assert(entrada);
 const texto=normal(entrada.querySelector('[data-texto-campo="frase"]').text);
 assert.equal(texto,antes.entrada);
 assert.equal(entrada.querySelector('[data-texto-campo="kind"]').text,antes.natureza);
 const portas=[];
 for(const e of registo.querySelectorAll(`[data-texto-estudo="${slug}"]`)) {
  const par=portasDaCorrecao(slug,lang,e.getAttribute('data-texto-data'));
  for(const [nome,v,rotulo] of [['primeira',par.antes,par.rotuloAntes],['atual',par.depois,par.rotuloDepois]]) {
   const a=e.querySelector(`[data-texto-porta="${nome}"]`);
   assert.equal(a.getAttribute('href'),v.rota);
   assert.equal(normal(a.text),rotulo);
   const datas=a.querySelectorAll('time');
   assert.equal(datas.length,v.indice>0&&!v.atual?1:0);
   if(datas.length) {
    assert.equal(datas[0].getAttribute('data-nonledger'),'data-do-repositorio');
    assert.equal(datas[0].getAttribute('datetime'),v.data);
    assert.equal(datas[0].text,dataDaCasa(v.data));
   }
   portas.push({rota:v.rota,rotulo,datas_marcadas:datas.length});
  }
 }
 const edicao=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang);
 assert(edicao.origin_ref.endsWith(' @ 983b19eee29d4653730a62e9ee1d9674345db308'));
 assert.equal(sha(fs.readFileSync(`studies-src/_edicoes/${slug}.${lang}.2026-11-03.html`)),antes.arquivo_sha256);
 assert.equal(sha(fs.readFileSync(`studies-src/${slug}/${lang}.html`)),edicao.sha256_normalized);
 const guardada=parse(fs.readFileSync('dist'+antes.rota+'/2026-11-03/index.html','utf8'));
 assert(guardada.text.includes(lang==='pt'?'nenhuma das duas diz como os dois financiamentos se relacionam':'neither says how the two sources of funding relate'));
 resultados.push({lang,frase,entrada:texto,natureza:antes.natureza,portas,arquivo_sha256:antes.arquivo_sha256,origin_ref:edicao.origin_ref});
}
const correcoes=contagensDoRegisto().correcoes_publicadas;
assert.equal(correcoes,anterior.contagem);
fs.writeFileSync(new URL('./dist.json',import.meta.url),JSON.stringify({correcoes,resultados},null,2)+'\n');
console.log(`EV3-p A: ${resultados.length} línguas, ${resultados.flatMap(r=>r.portas).length} portas, frases, entradas, arquivos e origem conferidos; ${correcoes} correções.`);
