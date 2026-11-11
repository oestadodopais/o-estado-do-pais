import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {routePath} from '../../src/lib/routes.mjs';
import {conferirVerificacaoLegivel} from '../../scripts/verificacao-legivel.mjs';
import {conferirFontesAnteriores, fontesAnteriores, fraseDaReconferencia} from '../../src/lib/fontes-anteriores.mjs';
const linhas=[...loadClaims({includeWithdrawn:true}).values()];
const exemplo=linhas.find(r=>r.id==='evora-execucao-da-receita-2021');
const porId=new Map(linhas.map(r=>[r.id,r]));
const declaracao=fontesAnteriores.find(d=>d.linha===exemplo.id);
assert(declaracao);
assert.deepEqual(conferirFontesAnteriores(porId),[]);
let plantas=0,recibos=0;
const anteriores=[];
for(const [declaracoes,erro] of [
 [[{...declaracao,endereco_anterior:exemplo.source_url}], 'fonte de hoje'],
 [[{...declaracao,endereco_anterior:declaracao.endereco_anterior+'x'}], 'não há reconferência'],
 [[{...declaracao,data_da_correcao:'2026-11-10'}], 'não há correção'],
 [[{...declaracao,linha:'linha-inexistente'}], 'linha inexistente'],
 [[declaracao,declaracao], 'linha repetida'],
 [[{...declaracao,razao:''}], 'campos obrigatórios'],
 [{}, 'tem de ser uma lista'],
]){
 assert(conferirFontesAnteriores(porId,declaracoes).some(e=>e.includes(erro)),erro);plantas++;
}
const soPosterior=structuredClone(exemplo);
soPosterior.verifications.forEach(v=>v.date='2026-11-12');
assert(conferirFontesAnteriores(new Map([[exemplo.id,soPosterior]]),[declaracao]).some(e=>e.includes('não há reconferência')));plantas++;
for(const lang of ['pt','en']){
 const atual=lang==='pt'?'Ficheiro da fonte relido a':'Source file read again on';
 const anterior=lang==='pt'?'Ficheiro da fonte anterior relido a':'Previous source file read again on';
 const frase=lang==='pt'?'confirmou o valor anterior:':'confirmed the previous value:';
 const html=rotulo=>parse(`<dl><dt>${rotulo}</dt><dd data-linha-verificacao="0">01.09.2026, <span data-linha-verificacao-resultado>${frase} <span data-valor-anterior-confirmado>96</span></span></dd></dl>`);
 const mesma=structuredClone(exemplo);mesma.verifications[0].path=mesma.source_url;
 assert.deepEqual(conferirVerificacaoLegivel(html(atual),mesma,lang),[]);
 assert.deepEqual(conferirVerificacaoLegivel(html(anterior),exemplo,lang),[]);
 const semDeclaracao={...exemplo,id:'linha-sem-declaracao'};
 assert.notEqual(semDeclaracao.verifications[0].path,semDeclaracao.source_url);
 assert.deepEqual(conferirVerificacaoLegivel(html(atual),semDeclaracao,lang),[]);
 const v=exemplo.verifications[0];
 assert.equal(fraseDaReconferencia(exemplo,{...v,date:'2026-11-11'},lang),anterior);
 assert.equal(fraseDaReconferencia(exemplo,{...v,date:'2026-11-12'},lang),atual);
 assert.equal(fraseDaReconferencia(exemplo,{...v,result:'inacessivel'},lang),lang==='pt'?'Releitura tentada a':'Re-read attempted on');
 assert.equal(fraseDaReconferencia(semDeclaracao,{...v,by:'painel-semanal'},lang),lang==='pt'?'Releitura a':'Re-read on');
 const posterior={...exemplo,verifications:[{...v,date:'2026-11-12'}]};
 const htmlPosterior=parse(`<dl><dt>${atual}</dt><dd data-linha-verificacao="0">12.11.2026</dd></dl>`);
 assert.deepEqual(conferirVerificacaoLegivel(htmlPosterior,posterior,lang),[]);
 htmlPosterior.querySelector('dt').set_content(anterior);
 assert(conferirVerificacaoLegivel(htmlPosterior,posterior,lang).some(e=>e.startsWith('C1: o recibo não distingue')));plantas++;
 for(const [rotulo,linha] of [[atual,exemplo],[anterior,mesma],[anterior,semDeclaracao]]){
  assert(conferirVerificacaoLegivel(html(rotulo),linha,lang).some(e=>e.startsWith('C1: o recibo não distingue')));plantas++;
 }
 if(process.argv.includes('--so-plantas'))continue;
 for(const linha of linhas.filter(r=>(r.verifications??[]).length)){
  const rota=routePath('linha',lang,{slug:linha.id});
  const root=parse(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
  assert.deepEqual(conferirVerificacaoLegivel(root,linha,lang),[],`${lang}/${linha.id}`);recibos++;
  for(const el of root.querySelectorAll('[data-linha-verificacao]')){
   const v=linha.verifications[Number(el.getAttribute('data-linha-verificacao'))];
   const declarada=fontesAnteriores.some(d=>d.linha===linha.id&&d.endereco_anterior===v.path&&v.date<=d.data_da_correcao);
   if(declarada&&v.result!=='inacessivel'){
    assert.equal(el.previousElementSibling.textContent,anterior);
    anteriores.push(`${lang}/${linha.id}`);
    el.previousElementSibling.set_content(atual);
    assert(conferirVerificacaoLegivel(root,linha,lang).some(e=>e.startsWith('C1: o recibo não distingue')));plantas++;
    el.previousElementSibling.set_content(anterior);
   }else{
    const original=v.result==='inacessivel'?(lang==='pt'?'Releitura tentada a':'Re-read attempted on'):v.by==='corredor-diario'?atual:(lang==='pt'?'Releitura a':'Re-read on');
    assert.equal(el.previousElementSibling.textContent,original,`${lang}/${linha.id}`);
   }
  }
 }
}
if(!process.argv.includes('--so-plantas')){
 assert.deepEqual(anteriores,['pt/evora-execucao-da-receita-2021','en/evora-execucao-da-receita-2021']);
 console.log(`Fonte anterior no HTML: ${anteriores.length} recibos, ${anteriores.join(', ')}.`);
}
console.log(`EVA reconferências: ${plantas} plantas recusadas; frases originais e limite da correção conferidos; ${recibos} recibos construídos conferidos.`);
