/** V2-e-b: o recibo identifica a medida, o intervalo e a origem do cálculo. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {NOMES_V2E} from '../../src/data/nomes-v2e.mjs';
import {dataDaCasa} from '../../src/lib/datas.mjs';
import {dadosDaIncorporacao,codigoDaIncorporacao} from '../../src/lib/incorporar.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {conferirValorUnidade} from '../../scripts/valor-unidade.mjs';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
const calculadas=['der-prr-saude-marcos-completos','der-prr-saude-marcos-total','der-prr-saude-contratado-numerico','der-prr-saude-pago-numerico','der-prr-saude-taxa-numerico'];
const painel=['contratado','pago','taxa'].map(x=>`prr-monitorizacao-20261014-p2-c01-${x}`);
function conferir(root,c,lang){
 const erros=[];
 if(NOMES_V2E[c.id]&&!c.name&&c.document?.title){
  const nome=root.querySelector('.linha-nome-da-fonte');
  if(normal(nome?.querySelector('[data-nome="projeto"]')?.text)!==normal(NOMES_V2E[c.id][lang])||
     nome?.querySelector('[data-linha-campo="document.title"]')?.text!==c.document.title)
   erros.push('V2E recibo: nome da medida ausente junto do título do conjunto');
 }
 if(c.period?.includes('/')){
  const esperado=dataDaCasa(c.period,lang);
  if(root.querySelector('.aparelho-ficha [data-de-campo="period"]')?.text!==esperado)
   erros.push('V2E recibo: intervalo dos dados ausente ou diferente');
  const codigo=root.querySelector('[data-incorporar-codigo]')?.text;
  if(!codigo?.includes(esperado))erros.push('V2E recibo: incorporação omite o intervalo dos dados');
 }
 if(calculadas.includes(c.id)){
  // Estas linhas sem excerto imprimem a ressalva da linha no cabeçalho.
  const nota=lang==='pt'?'Valor calculado sobre as linhas do documento.':'Value calculated from the document rows.';
  if(!root.querySelectorAll('.linha-nota').some(n=>normal(n.text)===nota)||
     root.querySelectorAll('.linha-nota').some(n=>/^(Transcrito da fonte|Transcribed from the source)/.test(n.text)))
   erros.push('V2E recibo: cálculo apresentado como transcrição');
  const origens=root.querySelectorAll('[data-linha-campo="derived_from"] a');
  if(!c.derived_from?.length||JSON.stringify(origens.map(n=>n.text.trim()))!==JSON.stringify(c.derived_from)||
     origens.some((n,i)=>!n.getAttribute('href')?.endsWith('/'+c.derived_from[i]))||
     normal(root.querySelector('[data-linha-campo="check"]')?.text)!==normal(c.check))
   erros.push('V2E recibo: expressão ou componentes do cálculo ausentes');
 }
 if(painel.includes(c.id))erros.push(...conferirValorUnidade(root,new Map([[c.id,c]])).erros);
 return erros;
}
export function conferirRecibosV2eb(dist,linhas){
 const erros=[],plantas=[];
 for(const [id,c] of linhas){
  if(!NOMES_V2E[id]&&!calculadas.includes(id)&&!c.period?.includes('/')&&!painel.includes(id))continue;
  for(const lang of ['pt','en']){
   const file=path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html');
   if(!fs.existsSync(file)){erros.push(`V2E recibo ausente: ${id} (${lang})`);continue;}
   const html=fs.readFileSync(file,'utf8'),root=parse(html);
   erros.push(...conferir(root,c,lang).map(e=>`${e}: ${id} (${lang})`));
   for(const [nome,seletor,muda] of [
    ['nome da medida retirado','.linha-nome-da-fonte [data-nome="projeto"]',n=>n.remove()],
    ['período acumulado trocado pelo mês final','.aparelho-ficha [data-de-campo="period"]',n=>n.set_content(c.reference_date)],
    ['componentes do cálculo retiradas','[data-linha-campo="derived_from"]',n=>n.remove()],
    ['cálculo apresentado como transcrição','.linha-nota [data-linha-campo="ressalva"]',n=>n.set_content(lang==='pt'?'Transcrito da fonte, palavra por palavra.':'Transcribed from the source, word for word.')],
   ]){
    if(nome.startsWith('período')&&!c.period?.includes('/'))continue;
    if(nome.startsWith('componentes')&&!calculadas.includes(id))continue;
    if(nome.startsWith('cálculo')&&!calculadas.includes(id))continue;
    const copia=parse(html),n=copia.querySelector(seletor);
    if(n){muda(n);plantas.push({nome,lang,item:id,mordeu:conferir(root,c,lang).length===0&&conferir(copia,c,lang).length>0});}
   }
  }
 }
 return {erros,plantas};
}
export function ensaiarRecibosV2eb(){
 const linhas=loadClaims(),c=linhas.get('sns-cirurgias-2026-07');
 assert.ok(c?.period,'O ensaio exige a linha real com período em intervalo.');
 for(const [lang,esperado] of [['pt','janeiro a julho de 2026'],['en','January to July 2026']]){
  assert.equal(dataDaCasa(c.period,lang),esperado);
  assert.equal(dadosDaIncorporacao(c,lang).periodo,esperado);
  assert.ok(codigoDaIncorporacao(c,lang).includes(esperado));
  for(const id of painel){
   const l=linhas.get(id),certo=parse(`<p class="linha-valor"><span data-claim="${id}">${l.value}</span></p>`);
   assert.deepEqual(conferirValorUnidade(certo,linhas).erros,[]);
   certo.querySelector('p').insertAdjacentHTML('beforeend',` <span data-linha-campo="unit">${l.unit}</span>`);
   assert.ok(conferirValorUnidade(certo,linhas).erros.some(e=>e.includes('repetida')));
   assert.equal(dadosDaIncorporacao(l,lang).unidade,'');
  }
 }
 return {periodo:c.period,edicoes:['pt','en'],plantasUnidadeRepetida:painel};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 console.log(JSON.stringify(ensaiarRecibosV2eb()));
}
