/** V2-a-d: provas independentes do HTML e do acesso ao motor. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {MESES_PT,conferirAfirmacoes} from '../../scripts/afirmacoes.mjs';
import {continuacaoDoNomeV2a,resolverPeriodosV2a,contaV2a} from '../../src/lib/v2a-palavras.mjs';
const claims=loadClaims();
for(const motor of [undefined,process.env.RESEARCHHUB_DIR].filter((x,i)=>i===0||x)) {
  assert.deepEqual(conferirAfirmacoes(claims,{motor:motor??''}).errors,[]);
  const guardados=[...MESES_PT];
  try {
    [MESES_PT[9],MESES_PT[10]]=[MESES_PT[10],MESES_PT[9]];
    let erro;
    try {conferirAfirmacoes(claims,{motor:motor??''});}catch(e){erro=e;}
    assert(erro?.message.includes('2026-11-09')&&erro.message.includes('2026-10-09'));
    console.log(`PLANTA meses trocados ${motor?'com':'sem'} motor: ${erro.message.replace(/\n/g,' ')}`);
  }finally{MESES_PT.splice(0,12,...guardados);}
}
for(const id of Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json')).rows)) {
  for(const lang of ['pt','en']) {
    const partes=continuacaoDoNomeV2a(id,lang),resolvidas=resolverPeriodosV2a(partes);
    for(const p of resolvidas)if(typeof p==='object')assert.equal(p.data.valor,claims.get(p.data.id).reference_date);
    for(const p of contaV2a(id,lang))if(p.claim)assert(claims.has(p.claim));
  }
}
const numero=id=>Number(claims.get(id).value.replace(/\s/g,'').replace(',','.'));
assert.equal(Math.round((numero('oe-2027-saude-despesa-total-consolidada-2026')-numero('oe-2027-saude-despesa-total-consolidada-2027'))*10),2675);
assert.equal(numero('oe-2027-ppp-rodoviario-encargos-brutos-2027')-numero('oe-2027-ppp-rodoviario-receitas-2027'),numero('oe-2027-ppp-rodoviario-encargos-liquidos-2027'));
console.log('V2AD: tokens e contas conferidos nas linhas; meses com expectativas independentes.');

// V2-a-e: a extensão das famílias exige auditoria e conserva os campos de origem.
const {resolverComplemento}=await import('../../src/lib/o-que-e-o-numero.mjs');
const {conferirAuditoriaDasFamilias}=await import('../cartao/familias.mjs');
const {FAMILIAS_DAS_LINHAS}=await import('../../src/data/o-que-e-das-familias.mjs');
const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
assert.deepEqual(conferirAuditoriaDasFamilias().erros,[]);
for(const [nome,partes,mensagem] of [
 ['algarismo fixo',['Ano 2027'],'V2AE complemento: algarismo fixo'],
 ['linha inexistente',[{periodo:'linha-do-ensaio'}],'a afirmação'],
 ['citação sem afirmação',[{excerto:'oe-2027-saude-despesa-total-consolidada-2027'}],'V2AE complemento: citação sem afirmação'],
]) {
 assert.throws(()=>resolverComplemento(partes),e=>{console.log(`PLANTA V2AE resolvedor ${nome}: ${e.message.replace(/\n/g,' ')}`);return e.message.includes(mensagem);});
}
for(const lang of ['pt','en'])for(const [nome,altera,mensagem] of [
 ['auditoria diferente',f=>f.complemento[lang].push(' Outra frase.'),'complemento diferente da auditoria'],
]) {
 const familias=structuredClone(FAMILIAS_DAS_LINHAS),id='oe-2027-saude-despesa-total-consolidada-2027';altera(familias[id]);
 const erro=conferirAuditoriaDasFamilias({familias}).erros.find(x=>x.includes(mensagem));assert(erro);console.log(`PLANTA ${lang} K17 ${nome}: ${erro}`);
}
for(const [nome,parte,mensagem] of [['algarismo','Ano 2027','complemento com algarismo fixo'],['token sem origem',{periodo:'linha-do-ensaio'},'complemento com token sem origem']]) {
 const a=structuredClone(auditoria),familias=structuredClone(FAMILIAS_DAS_LINHAS),id='oe-2027-saude-despesa-total-consolidada-2027';
 a.familias.find(f=>f.chaves?.includes(id)).complemento.pt.push(parte);familias[id].complemento.pt.push(parte);
 const erro=conferirAuditoriaDasFamilias({auditoria:a,familias}).erros.find(x=>x.includes(mensagem));assert(erro);console.log(`PLANTA K17 ${nome}: ${erro}`);
}
const apoios=JSON.parse(fs.readFileSync('ledger/provas/v2a/provas.json')).apoios;
const origens=JSON.parse(fs.readFileSync('src/data/origens-v2a.json'));
for(const [key,a] of Object.entries(apoios)) {
 assert.equal(origens[key].excerto,a.excerto);assert.equal(origens[key].selo.sha256,a.sha256);assert(origens[key].url.endsWith('#page='+a.pagina_pdf));
}
for(const id of ['oe-2027-ppp-total-encargos-liquidos-2027'])for(const lang of ['pt','en'])assert.deepEqual(contaV2a(id,lang),[]);
console.log('V2AE: complementos auditados, origens seladas e total sem conta rodoviária.');
const {conferirOrigemV2A}=await import('../cartao/origens-v2a.mjs');
for(const key of Object.keys(apoios))assert.equal(conferirOrigemV2A(key,origens[key]),null);
for(const [nome,altera,mensagem] of [
 ['excerto fechado',o=>o.excertoAberto=false,'V2AF origem: passagem da Saúde fechada'],
 ['tipo retirado',o=>delete o.tipo,'V2AF origem: apoio sem tipo de passagem'],
 ['selo retirado',o=>delete o.selo,'V2AE origem: selo documental ausente'],
 ['SHA trocado',o=>o.selo.sha256='a'.repeat(64),'V2AE origem: selo diferente do recibo exportado'],
 ['hora trocada',o=>o.selo.hora='2026-10-14T00:00:00Z','V2AE origem: selo diferente do recibo exportado'],
 ['página trocada',o=>o.extracao.pagina++,'V2AE origem: excerto ou localizador diferente da prova'],
 ['excerto trocado',o=>o.excerto='Texto do ensaio','V2AE origem: excerto ou localizador diferente da prova'],
 ['porta trocada',o=>o.url='https://example.invalid/ensaio','V2AE origem: excerto ou localizador diferente da prova'],
]) {
 const o=structuredClone(origens['v2a-prr-saude']);altera(o);assert.equal(conferirOrigemV2A('v2a-prr-saude',o),mensagem);console.log(`PLANTA K16 ${nome}: ${mensagem}`);
}
