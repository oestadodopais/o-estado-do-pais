/**
 * Acrescenta só as famílias PF1 (a correção EX4-b, 21.10.2026): a frase «o que é cada número» das 83 linhas do Mapa 2 da
 * proposta de Orçamento para 2027 e da Lei do Orçamento para 2026, exportadas do motor pelo manifesto pf1, preservando as
 * declarações das outras corridas (no padrão de `compor-familias-v2a.mjs` e `compor-familias-v2d.mjs`).
 *
 * As frases são as do mandato da correção EX4-b, §2, à letra. Cada uma apoia-se nos campos selados da própria linha (o
 * título do documento, o localizador, o nome da fonte, a unidade, a conta declarada das derivadas); o complemento «; aqui,
 * …» diz a função, o documento e o ano: a função pelo código que o excerpt da linha lida imprime (nas derivadas, a linha
 * lida de onde derivam, por `derived_from`), com o nome do projeto dessa função nas linhas de 2026 (`NOMES_OE1`), conferido
 * contra o nome que a fonte imprime; o documento pela edição selada (`document.edition`, «Proposta de Lei» ou «Lei»); e o
 * ano por `{ periodo }` da linha, nunca escrito à mão. Corre-se da raiz: `node scripts/compor-familias-pf1.mjs`.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../src/lib/ledger.mjs';
import {NOMES_OE1} from '../src/data/medidas-oe1.mjs';
const claims=loadClaims({includeWithdrawn:true});
const MARCA='\n// PF1: declarações acrescentadas pelo compositor próprio.';
const file='src/data/o-que-e-das-familias.mjs';
const original=fs.readFileSync(file,'utf8').split(MARCA)[0];
const match=original.match(/export const FAMILIAS_DAS_LINHAS = ([\s\S]*?);\n\nexport const FAMILIAS_DOS_CONCELHOS/);
assert(match,'declaração das famílias não encontrada');
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile,'utf8'));
const manifesto=JSON.parse(fs.readFileSync('ledger/cruzamentos/pf1.json','utf8'));
const ids=Object.keys(manifesto.rows).sort();
assert.equal(ids.length,83,`o registo pf1 tem ${ids.length} linhas, e o mandato diz 83`);
const L=(campo,literal)=>({linha:'propria',campo,literal});
const linha=id=>{const c=claims.get(id);assert(c,`a linha ${id} não está no livro`);return c;};
/** A função de uma linha: o código que o excerpt da linha lida imprime, e o nome do projeto da função de 2026. */
const funcao=id=>{
  let c=linha(id);
  while(!/^oe-20\d\d-despesa-funcao-\d\d-mapa$/.test(c.id)) {
    const lida=(c.derived_from??[]).find(x=>/despesa-funcao-\d\d-mapa$|cem-euros-funcao-\d\d-mapa$|despesa-funcao-01-sem-divida-mapa$/.test(x)&&x!==c.id);
    assert(lida,`${id}: nenhuma linha da função em derived_from`);c=linha(lida);
  }
  const m=/^(\d\d) (.+?) [\d ]+$/.exec(c.excerpt);assert(m,`${c.id}: o excerpt não imprime o código da função`);
  const n=NOMES_OE1[`oe-2026-cem-euros-funcao-${m[1]}`];assert(n,`a função ${m[1]} não tem nome do projeto em 2026`);
  const nome={pt:n.pt.slice(n.pt.indexOf(' que vai para ')+' que vai para '.length).replace(/^(?:o|a|os|as) /,''),en:n.en.slice(n.en.indexOf(' going to ')+' going to '.length).replace(/^the /,'')};
  assert.equal(m[2].toLocaleLowerCase('pt-PT'),nome.pt,`${c.id}: o nome que a fonte imprime («${m[2]}») não é o nome do projeto da função («${nome.pt}»)`);
  return nome;
};
const documento=id=>{const e=linha(id).document?.edition??'';if(/^Proposta de Lei /.test(e))return {pt:'a proposta de Orçamento',en:'the Budget proposal'};if(/^Lei n\.º /.test(e))return {pt:'a Lei do Orçamento',en:'the Budget Law'};throw new Error(`${id}: edição «${e}» sem documento`);};
const familias=[];
const familia=(id,nome,pt,en,apoios,complemento)=>familias.push({chaves:[id],nome,origens:[],partes:[{pt,en,classe:'diz',apoios}],complemento});
const TITULO=L('document.title','classificação funcional das despesas do subsetor da Administração Central');
for(const id of ids) {
  const c=linha(id),ano={periodo:id};
  let m;
  if((m=/^oe-20\d\d-despesa-funcao-(\d\d)-mapa$/.exec(id))) {
    const f=funcao(id),d=documento(id);
    familia(id,{pt:'Despesa da Administração Central por função, não consolidada',en:'Central administration expenditure by function, unconsolidated'},
      'A despesa do subsetor da Administração Central nesta função, como o mapa da classificação funcional a imprime, em euros, não consolidada',
      'Central administration subsector expenditure in this function, as the functional classification map prints it, in euros, unconsolidated',
      [TITULO,L('document.locator','coluna «POR FUNÇÕES»'),L('unit','euros')],
      {pt:['; aqui, '+f.pt+', '+d.pt+', ',ano],en:['; here, '+f.en+', '+d.en+', ',ano]});
  } else if(/^oe-20\d\d-despesa-subfuncao-01-7-mapa$/.test(id)) {
    const d=documento(id);
    familia(id,{pt:'Despesa da Administração Central nas operações relacionadas com a dívida pública, não consolidada',en:'Central administration expenditure on operations related to public debt, unconsolidated'},
      'A despesa do subsetor da Administração Central na subfunção das operações relacionadas com a dívida pública, como o mapa a imprime, em euros, não consolidada',
      'Central administration subsector expenditure in the subfunction of the operations related to public debt, as the map prints it, in euros, unconsolidated',
      [TITULO,L('name','OPERAÇÕES RELACIONADAS COM A DÍVIDA PÚBLICA'),L('document.locator','coluna «POR SUBFUNÇÕES»'),L('unit','euros')],
      {pt:['; aqui, '+d.pt+', ',ano],en:['; here, '+d.en+', ',ano]});
  } else if(/^oe-20\d\d-despesa-total-mapa$/.test(id)) {
    const d=documento(id);
    familia(id,{pt:'Despesa total do mapa da classificação funcional, não consolidada',en:'Total expenditure of the functional classification map, unconsolidated'},
      'A despesa total do mapa da classificação funcional, a soma das dez funções, como o mapa a imprime, em euros, não consolidada',
      'The total expenditure of the functional classification map, the sum of the ten functions, as the map prints it, in euros, unconsolidated',
      [TITULO,L('name','DESPESA TOTAL'),L('unit','euros')],
      {pt:['; aqui, '+d.pt+', ',ano],en:['; here, '+d.en+', ',ano]});
  } else if(/^oe-20\d\d-despesa-total-consolidada-mapa$/.test(id)) {
    const d=documento(id);
    familia(id,{pt:'Despesa total consolidada do mapa da classificação funcional',en:'Consolidated total expenditure of the functional classification map'},
      'A despesa total consolidada, como o mapa da classificação funcional a imprime, em euros',
      'Consolidated total expenditure, as the functional classification map prints it, in euros',
      [TITULO,L('name','DESPESA TOTAL CONSOLIDADA'),L('unit','euros')],
      {pt:['; aqui, '+d.pt+', ',ano],en:['; here, '+d.en+', ',ano]});
  } else if(/^oe-20\d\d-cem-euros-funcao-\d\d-mapa$/.test(id)) {
    const f=funcao(id);
    familia(id,{pt:'Parte de cada cem euros da despesa total do mapa funcional',en:'Share of every hundred euros of the functional map’s total expenditure'},
      'O resultado é a parte desta função em cada cem euros da despesa total do mapa, com duas casas decimais',
      'The result is this function’s share of every hundred euros of the map’s total expenditure, to two decimal places',
      [L('derivation','pela DESPESA TOTAL do mesmo Mapa 2'),L('derivation','multiplicar por cem'),L('derivation','duas casas decimais')],
      {pt:['; aqui, '+f.pt+', ',ano],en:['; here, '+f.en+', ',ano]});
  } else if(/^oe-20\d\d-cem-euros-funcao-\d\d-sem-divida-mapa$/.test(id)) {
    const f=funcao(id);
    familia(id,{pt:'Parte de cada cem euros da despesa do mapa funcional sem as operações relacionadas com a dívida pública',en:'Share of every hundred euros of the functional map’s expenditure without the operations related to public debt'},
      'O resultado é a parte desta função em cada cem euros da despesa do mapa sem a subfunção das operações relacionadas com a dívida pública, com duas casas decimais',
      'The result is this function’s share of every hundred euros of the map’s expenditure without the subfunction of the operations related to public debt, to two decimal places',
      [L('derivation','menos a subfunção 01.7'),L('derivation','multiplicar por cem'),L('derivation','duas casas decimais')],
      {pt:['; aqui, '+f.pt+', ',ano],en:['; here, '+f.en+', ',ano]});
  } else if(/^oe-20\d\d-despesa-sem-divida-mapa$/.test(id)) {
    familia(id,{pt:'Despesa do mapa funcional sem as operações relacionadas com a dívida pública',en:'Functional map expenditure without the operations related to public debt'},
      'O resultado é a despesa total do mapa menos a subfunção das operações relacionadas com a dívida pública, em euros',
      'The result is the map’s total expenditure minus the subfunction of the operations related to public debt, in euros',
      [L('derivation','A despesa total do Mapa 2 menos a subfunção 01.7'),L('unit','euros')],
      {pt:['; aqui, ',ano],en:['; here, ',ano]});
  } else if(/^oe-20\d\d-despesa-funcao-01-sem-divida-mapa$/.test(id)) {
    familia(id,{pt:'Serviços gerais das administrações públicas sem as operações relacionadas com a dívida pública',en:'General public services without the operations related to public debt'},
      'O resultado é a função dos serviços gerais das administrações públicas menos a subfunção das operações relacionadas com a dívida pública, em euros',
      'The result is the general public services function minus the subfunction of the operations related to public debt, in euros',
      [L('derivation','A função 01 do Mapa 2 menos a subfunção 01.7'),L('unit','euros')],
      {pt:['; aqui, ',ano],en:['; here, ',ano]});
  } else if(/^der-oe2027-.+-variacao-pct$/.test(id)) {
    const de=c.derived_from??[];assert.equal(de.length,2,`${id}: a variação deriva de duas linhas`);
    const antes=de.find(x=>linha(x).reference_date==='2026'),depois=de.find(x=>linha(x).reference_date==='2027');
    assert(antes&&depois&&c.reference_date==='2027',`${id}: a derivação não tem uma linha de 2026 e uma de 2027`);
    let o;
    if((m=/^der-oe2027-funcao-(\d\d)-variacao-pct$/.exec(id))) {const f=funcao(depois);o={pt:f.pt,en:f.en};}
    else if(id==='der-oe2027-despesa-total-mapa-variacao-pct') o={pt:'a despesa total do mapa',en:'the map’s total expenditure'};
    else if(id==='der-oe2027-despesa-total-consolidada-mapa-variacao-pct') o={pt:'a despesa total consolidada',en:'consolidated total expenditure'};
    else if(id==='der-oe2027-despesa-sem-divida-variacao-pct') o={pt:'a despesa do mapa sem a subfunção das operações relacionadas com a dívida pública',en:'the map’s expenditure without the subfunction of the operations related to public debt'};
    else throw new Error(`${id}: variação sem o que varia`);
    familia(id,{pt:'Variação da lei para a proposta, no mapa funcional',en:'Change from the law to the proposal, in the functional map'},
      'O resultado é a variação, em percentagem, da Lei do Orçamento para',
      'The result is the change, in percent, from the Budget Law for',
      [L('derivation','sobre a lei aprovada de'),L('derivation','vezes cem'),L('derivation','uma casa decimal')],
      {pt:[' ',{periodo:antes},' para a proposta de Orçamento para ',{periodo:depois},', com uma casa decimal; aqui, '+o.pt],en:[' ',{periodo:antes},' to the Budget proposal for ',{periodo:depois},', to one decimal place; here, '+o.en]});
  } else throw new Error(`${id}: linha do pf1 sem família`);
}
assert.equal(familias.length,83);
const declared={};
for(const e of familias) {
  const c=linha(e.chaves[0]);
  for(const p of e.partes) {
    assert(!/\d/.test(p.pt+p.en),'frase com algarismos');
    for(const a of p.apoios) {const v=a.campo.split('.').reduce((o,k)=>o?.[k],c);assert(a.literal.trim().length>=4&&typeof v==='string'&&v.includes(a.literal),`${c.id}: apoio ausente ${a.campo} ${a.literal}`);}
  }
  for(const lang of ['pt','en'])for(const x of e.complemento[lang])assert(typeof x!=='string'||!/\d/.test(x),'complemento com algarismos');
  declared[e.chaves[0]]={nome:e.nome,frase:{pt:[e.partes.map(p=>p.pt).join('')],en:[e.partes.map(p=>p.en).join('')]},complemento:e.complemento};
}
const keys=new Set(Object.keys(declared));
fs.writeFileSync(file,original+MARCA+'\nObject.assign(FAMILIAS_DAS_LINHAS, '+JSON.stringify(Object.fromEntries([...keys].sort().map(k=>[k,declared[k]])),null,2)+');\n');
aud.familias=aud.familias.filter(e=>!e.chaves?.some(k=>keys.has(k)));
for(const e of familias) aud.familias.push({chaves:e.chaves,nome:e.nome,origens:e.origens,complemento:e.complemento,folhas:[{pt:e.partes.map(p=>p.pt).join(''),en:e.partes.map(p=>p.en).join(''),partes:e.partes}]});
aud.leituras=aud.leituras.filter(l=>!l.o_que.startsWith('Construção EX4-b:'));
aud.leituras.push({quem:'Claude Opus 5.5',quando:'2026-10-21',o_que:'Construção EX4-b: as frases das 83 famílias do pf1 conferidas nos campos selados de cada linha pelo compositor scripts/compor-familias-pf1.mjs. A leitura a frio pertence à entrega seguinte.'});
fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
console.log(`PF1: ${keys.size} famílias compostas e conferidas.`);
