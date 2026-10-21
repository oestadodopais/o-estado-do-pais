/** EO1-b: plantas em memória e conferência das portas e aberturas do HTML. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {getClaim,loadClaims} from '../../src/lib/ledger.mjs';
import {valorNaLingua} from '../../src/lib/valor-na-lingua.mjs';
import {SEM_AREA} from '../../src/data/areas.mjs';
import {WORKS} from '../../src/data/studies.mjs';
import {sinopseEsperada,conferirSinopse} from '../../scripts/voz-pais.mjs';
import {conferirAberturaB1} from '../../scripts/abertura-b1-do-portao.mjs';
import {conferirPortasDeEntradaEo1} from '../../scripts/portas-eo1-do-portao.mjs';
import {literalInteiroEo1, retirarAnosIsoladosEo1} from '../../scripts/literais-eo1-do-portao.mjs';
const slug='orcamento-2027-o-que-muda-e-para-quem';
const dist=process.env.OEDP_DIST??'dist';
const fixtures=process.argv.includes('--fixtures');
let plantas=0;
for(const fonte of ['Artigo 18.º; pp. 15, 16 PDF','Artigo 68.º','x8.º','8.ºx']) {
 assert(!literalInteiroEo1(fonte,'8.º'),'literal por subcadeia aceite');plantas++;
}
assert(literalInteiroEo1('Artigo «8.º».','8.º'));
for(const texto of ['2000 milhões','2000 million','2000 %','12000','x2000','2000x','2000.º','-2000','2000,5','20/2000']) {
 assert(/\d/.test(retirarAnosIsoladosEo1(texto)),'valor confundido com ano: '+texto);plantas++;
}
assert(!/\d/.test(retirarAnosIsoladosEo1('em 2026 e 2027.')));
const regra=SEM_AREA.find(e=>e.estudos?.includes(slug));
assert(regra&&!regra.id.test('linha-inventada'),'áreas dispensam identificador novo');plantas++;

// A planta atravessa validateLedger num processo novo, pela mesma entrada do build.
const pasta=fs.mkdtempSync(path.join(os.tmpdir(),'eo1-prosa-'));
try {
 const base=[...loadClaims().values()].find(c=>c.study===slug&&c.unit==='texto');
 assert(base,'linha textual de controlo ausente');
 for(const [id,unit,valor,sha] of [
  ['planta-texto','texto','A fonte diz estas palavras.',base.document.source_sha256],
  ['planta-numerica','milhões de euros','A despesa cresce 10 milhões.',base.document.source_sha256],
  ['planta-sem-corpo','texto','A fonte diz estas palavras.',null],
 ]) {
  const c=structuredClone(base);delete c.__file;c.id=id;c.unit=unit;c.value=valor;c.excerpt=valor;c.document.source_sha256=sha;
  fs.writeFileSync(path.join(pasta,id+'.yml'),JSON.stringify(c));
 }
 const programa="import {validateLedger} from './src/lib/ledger.mjs';process.stdout.write(JSON.stringify(validateLedger().errors));";
 const erros=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',programa],{env:{...process.env,OEDP_LEDGER_DIR:pasta},encoding:'utf8'}));
 assert(!erros.some(e=>e.includes('planta-texto')&&e.includes('prosa')),'texto selado recusado');
 for(const id of ['planta-numerica','planta-sem-corpo']) {
  assert(erros.some(e=>e.includes(id)&&e.includes('prosa')),'prosa sem recusa: '+id);plantas++;
 }
} finally {fs.rmSync(pasta,{recursive:true,force:true});}

for(const lang of ['pt','en']) {
 const work=WORKS.find(w=>w.slug===slug);
 const assinado=valorNaLingua(getClaim('der-oe2027-medidas-anteriores-saldo'),lang).replace(/\s+/g,' ');
 assert(/^[−-]/.test(assinado));
 const absoluto=assinado.slice(1),sinopse=sinopseEsperada(work,lang);
 assert(sinopse.includes(absoluto)&&!sinopse.includes(assinado),'sinopse não aplicou abs');
 assert.deepEqual(conferirSinopse(parse('<p>'+sinopse+'</p>'),work,lang),[]);
 assert(conferirSinopse(parse('<p>'+sinopse.replace(absoluto,assinado)+'</p>'),work,lang).length,'sinopse aceitou o sinal retirado por abs');plantas++;
 if(lang==='en') {
  const formaDivergente=absoluto.replace(/ /g,',');
  assert.notEqual(absoluto,formaDivergente);
  assert(conferirSinopse(parse('<p>'+sinopse.replace(absoluto,formaDivergente)+'</p>'),work,lang).length,'sinopse inglesa aceitou um separador diferente do recibo de origem');plantas++;
 }
 const rota={key:'discussao',lang,params:{}};
 const titulo=WORKS.find(w=>w.slug===slug).editions.find(e=>e.lang===lang).title;
 const destino=lang==='pt'?`/estudos/${slug}`:`/en/studies/${slug}`;
 const porta=`<p data-eo1-porta><a href="${destino}">${lang==='pt'?'O estudo: ':'The study: '}${titulo} →</a></p>`;
 const controlo=parse(['saude-no-orcamento','parcerias-rodoviarias','outro'].map(id=>`<article data-discussao="${id}">${id==='outro'?'':porta}</article>`).join(''));
 assert.deepEqual(conferirPortasDeEntradaEo1(controlo,rota).erros,[]);
 for(const alterar of [r=>r.querySelector('[data-eo1-porta]').remove(),r=>r.querySelector('[data-discussao="outro"]').insertAdjacentHTML('beforeend',porta),r=>r.querySelector('[data-eo1-porta] a').setAttribute('href','/errado/')]) {
  const r=parse(controlo.outerHTML);alterar(r);assert(conferirPortasDeEntradaEo1(r,rota).erros.length);plantas++;
 }
 const explicacao={key:'explicacao',lang,params:{slug:'dinheiro-do-estado-2026'}};
 assert.deepEqual(conferirPortasDeEntradaEo1(parse(porta),explicacao).erros,[]);
 assert(conferirPortasDeEntradaEo1(parse(porta+porta),explicacao).erros.length);plantas++;
 if(!fixtures) for(const [rota,ficheiro] of [[{key:'discussao',lang,params:{}},lang==='pt'?'o-que-se-discute':'en/under-discussion'],[explicacao,lang==='pt'?'explicacoes/dinheiro-do-estado-2026':'en/explainers/dinheiro-do-estado-2026']]) {
  const r=conferirPortasDeEntradaEo1(parse(fs.readFileSync(`${dist}/${ficheiro}/index.html`,'utf8')),rota);
  assert.deepEqual(r.erros,[],ficheiro);console.log(`EO1 portas ${ficheiro}: ${r.encontradas}/${r.esperadas}`);
 }
 const nomes=lang==='pt'?['Em resumo','O que este projeto conclui','O que podia funcionar melhor']:['In brief','What this project concludes','What could work better'];
 const blocks=[{i:0,kind:'heading',level:1,text:'Título'},{i:1,kind:'paragraph',text:'Nota antes da abertura.'},...nomes.map((text,i)=>({i:i+2,kind:'heading',level:2,text})),{i:5,kind:'heading',level:2,text:'Texto'}];
 const html=`<section class="estudo-leitura"><p data-registo-bloco="1"></p>${nomes.map((n,i)=>`<div data-registo-bloco="${i+2}"><h2 data-registo-unidade>${n}</h2></div>`).join('')}</section><section class="estudo-texto"><div data-registo-bloco="5"></div></section>`;
 assert.deepEqual(conferirAberturaB1(parse(html),{blocks},'planta',lang),[]);
 const r=parse(html);r.querySelector('h2').set_content('Título trocado');assert(conferirAberturaB1(r,{blocks},'planta',lang).length);plantas++;
}
if(!fixtures) for(const work of WORKS) for(const edition of work.editions) {
 const lang=edition.lang;if(!['pt','en'].includes(lang))continue;
 const file=`registos/${work.slug}/${lang}.record.json`;if(!fs.existsSync(file))continue;
 const record=JSON.parse(fs.readFileSync(file,'utf8'));
 const primeiro=record.blocks.find(b=>b.kind==='heading'&&Number(b.level)===2);
 if(primeiro?.text!==(lang==='pt'?'Em resumo':'In brief'))continue;
 const rota=lang==='pt'?`estudos/${work.slug}`:`en/studies/${work.slug}`;
 const root=parse(fs.readFileSync(`${dist}/${rota}/index.html`,'utf8'));
 assert.deepEqual(conferirAberturaB1(root,record,rota,lang),[],rota);
 const planta=parse(root.outerHTML);planta.querySelector('.estudo-leitura h2').set_content('Título trocado');
 assert(conferirAberturaB1(planta,record,rota,lang).length,'B1 não recusa abertura de '+rota);plantas++;
 console.log(`B1 ${rota}: primeiro H2 conferido e planta recusada.`);
}
console.log(`EO1-b maquinaria: PASS; ${plantas} plantas recusadas.`);
