/** EO1: frases dos recibos a partir das medidas e dos perímetros conferidos. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {NOMES_EO1} from '../../../../src/data/nomes-eo1.mjs';
const claims=loadClaims(),cross=JSON.parse(fs.readFileSync('ledger/cruzamentos/eo1.json','utf8'));
const especiais={
 'pm-q3-2-r13-c0':['Atualização do mínimo de existência','Updating the income below which no personal income tax is due'],
 'diploma-irc-artigo3':['Percurso legal da taxa geral do IRC','Statutory path of the corporate income tax rate'],
 'diploma-habitacao-preambulo':['IVA reduzido na construção e tributação das rendas','Reduced construction VAT and taxation of rents'],
 'pm-q3-2-r7-c0':['Redução do IVA na construção','Construction VAT reduction'],
 'pm-q3-2-r10-c0':['Redução do IRS nas rendas moderadas','Income tax reduction on moderate rents'],
 'posicao-governo-divida85':['Objetivo do Governo para a dívida pública','Government target for public debt'],
 'posicao-livre-iva':['Proposta do Livre para a taxa normal do IVA','Livre proposal for the standard VAT rate'],
 'pm-pensoes-capitulo3':['Pensões e Complemento Solidário para Idosos','Pensions and the Solidarity Supplement for the Elderly'],
};
function nome(id,lang){
 let n=especiais[id]?.[lang==='pt'?0:1]??NOMES_EO1[id][lang];
 return n.replace(/\s+/g,' ').trim();
}
export const FAMILIAS_EO1=Object.keys(cross.rows).sort().map(id=>{
 const c=claims.get(id),pt=nome(id,'pt'),en=nome(id,'en');let frase,phrase,complemento;
 if(c.derivation){frase=`É o resultado da conta para «${pt}», feita com as componentes identificadas neste recibo.`;phrase=`It is the result of the calculation for «${en}», using the components identified in this receipt.`;}
 else if(c.afirmacao){frase=`É a posição atribuída no documento sobre «${pt}», transcrita no excerto.`;phrase=`It is the position attributed in the document on «${en}», transcribed in the excerpt.`;}
 else if(['texto','afirmação'].includes(c.unit)){frase=`É a passagem do documento sobre «${pt}», conservada no excerto.`;phrase=`It is the document's passage on «${en}», preserved in the excerpt.`;}
 else {
  let context=['no documento citado','in the cited document'];
  if(id.startsWith('pm-q4-1-'))context=['no quadro das administrações públicas em contabilidade pública','in the general government table in public accounting'];
  if(id.startsWith('pm-q3-1-'))context=['no quadro das administrações públicas em contabilidade nacional','in the general government table in national accounts'];
  if(id.startsWith('pm-q3-2-'))context=['no quadro das medidas com impacto orçamental','in the table of measures with a budgetary impact'];
  if(id.startsWith('pm-q3-3-'))context=['na passagem entre contabilidade pública e contabilidade nacional','in the passage between public accounting and national accounts'];
  if(id.startsWith('pm-q3-6-'))context=['na decomposição da trajetória da dívida pública','in the breakdown of the public debt trajectory'];
  frase=`É o valor de «${pt}» ${context[0]}, para o período e na unidade indicados.`;phrase=`It is the value of «${en}» ${context[1]}, for the stated period and unit.`;
 }
 if(id.startsWith('der-oe2027-medidas-anteriores-')) {
  const k=id.split('-').at(-1),termos={saldo:['dez linhas','ten lines'],receita:['sete linhas de receita','seven revenue lines'],despesa:['três linhas de despesa','three expenditure lines']};
  frase=`É a soma, no impacto no saldo de 2027, das ${termos[k][0]} que o quadro 3.2 do relatório marca com (i), invariante.`;
  phrase=`It is the sum, in the 2027 balance impact, of the ${termos[k][1]} that table 3.2 of the report marks with (i), invariante.`;
 }
 const textosLegais={
  'rmmg-2026':['É a retribuição mínima mensal garantida em ','It is the guaranteed minimum monthly wage in ',' pelo decreto-lei que a fixou.',' under the decree-law that set it.'],
  'irc-taxa-2026':['É a taxa geral do IRC em ','It is the general corporate income tax rate in ',' pela lei de novembro de 2025.',' under the law of November 2025.'],
  'irc-taxa-2027':['É a taxa geral do IRC em ','It is the general corporate income tax rate in ',' pela lei de novembro de 2025.',' under the law of November 2025.'],
  'smi-espanha-2026':['É o salário mínimo mensal de Espanha em ','It is Spain’s monthly minimum wage in ',' pelo real decreto.',' under the royal decree.'],
 };
 const legal=textosLegais[id];
 if(legal){frase=legal[0];phrase=legal[1];complemento={pt:[{periodo:id},','+legal[2]],en:[{periodo:id},','+legal[3]]};}
 else {frase+=' Referência: ';phrase+=' Reference: ';complemento={pt:[{periodo:id},'.'],en:[{periodo:id},'.']};}
 const campo=c.derivation?'derivation':'excerpt';assert(typeof c[campo]==='string'&&c[campo].length>=4);
 return {chaves:[id],complemento,nome:{pt,en},origens:[],partes:[{pt:frase,en:phrase,classe:'diz',apoios:[{linha:'propria',campo,literal:c[campo]}]}]};
});
