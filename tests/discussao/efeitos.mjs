/** Conferência independente dos efeitos, incluindo textos e períodos selados. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {tituloDaLinha,descricaoDaLinha} from '../../src/lib/livro.mjs';
import {modeloDoCartao} from '../../src/lib/cartoes.mjs';
import {codigoDaIncorporacao} from '../../src/lib/incorporar.mjs';
import {FAMILIAS_DAS_LINHAS} from '../../src/data/o-que-e-das-familias.mjs';
import {NOMES_V2E} from '../../src/data/nomes-v2e.mjs';
import {textoDocumentalConferido,acumuladoConferido,nomeDoEfeitoConferido} from '../../src/lib/prova-efeitos.mjs';
import {lugarDaIncorporacao} from '../../src/lib/lugar-da-incorporacao.mjs';
import {conferirFormatoDaPagina} from '../inicio/formato-dos-numeros.mjs';
import {analisa,leMarcadores} from '../../scripts/voz.mjs';
const proofFile=new URL('../../ledger/provas/v2e/provas.json',import.meta.url);
const proofs=JSON.parse(fs.readFileSync(proofFile,'utf8')).rows;
const auditoria=JSON.parse(fs.readFileSync(new URL('./palavras.json',import.meta.url),'utf8'));
const idSite=id=>id.startsWith('eurostat-')?id:id.replaceAll('_','-').replaceAll('.','-').toLowerCase();
function n(value){
 let s=String(value).replaceAll('−','-').replace(/[\s  ]/g,'').replace(/M€|%/g,'');
 if(s.includes(','))s=s.replaceAll('.','').replace(',','.');
 else if(/^\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replaceAll('.','');
 return Number(s);
}
/** As portas seguem os tokens e os recibos declarados, nunca a lista ampla de apoios. */
export function linhasImpressasOuDerivadas(item,linhas){
 const ids=new Set();
 const anda=x=>{
  if(Array.isArray(x))x.forEach(anda);
  else if(x&&typeof x==='object')for(const [k,v] of Object.entries(x)){
   if(k==='linhas')continue;
   if(['claim','literal','fragmento','data','periodo','nome','sinal','selo'].includes(k)&&typeof v==='string')ids.add(v);
   else if(k==='recibos')Object.values(v).flat().forEach(id=>ids.add(id));
   else anda(v);
  }
 };
 anda(item);
 const palavras=auditoria.explicacoes.find(e=>e.slug===item?.slug);
 for(const folha of palavras?.folhas??[])for(const parte of folha.partes??[])for(const apoio of parte.apoios??[])if(apoio.linha)ids.add(apoio.linha);
 for(const id of ids)for(const componente of linhas.get(id)?.derived_from??[])ids.add(componente);
 for(const id of item.apenasDatas??[]){
  const usos=[];const percorre=x=>{if(Array.isArray(x))x.forEach(percorre);else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x)){if(['claim','literal','fragmento','nome','selo'].includes(k)&&v===id)usos.push(k);else if(k!=='apenasDatas')percorre(v);}};percorre(item);
  if(usos.length)throw new Error('OG1: uma medida não pode ser escondida como data de contexto');
  ids.delete(id);
 }
 return ids;
}
export function conferirEfeitos(linhas,itens,nomes=NOMES_V2E){
 const erros=[];
 for(const [id,p] of Object.entries(proofs)){
  const c=linhas.get(id);
  if(!c){erros.push(`V2E inventário: falta ${id}`);continue;}
  if(p.unit==='texto'&&!textoDocumentalConferido(c))erros.push(`V2E texto: ${id}`);
  if(/^\d{4}-\d{2}\/\d{4}-\d{2}$/.test(p.period)){
   if(!acumuladoConferido(c))erros.push(`V2E acumulado: ${id}`);
  }else{
   const referencia=/^\d{4}\/\d{4}$/.test(p.period)?p.period.split('/').at(-1):p.period;
   if(c.reference_date!==referencia||(c.period!==undefined&&c.period!==p.period))erros.push(`V2E período: ${id}`);
  }
  if(p.unit!=='texto'){
   if(Number.isFinite(n(p.value))){
    if(!Number.isFinite(n(c.value))||n(c.value)!==n(p.value)||c.unit!==p.unit)erros.push(`V2E número selado: ${id}`);
   }else if(c.value!==p.value||c.unit!==p.unit)erros.push(`V2E estado selado: ${id}`);
  }
  for(const lang of ['pt','en'])if(typeof nomes[id]?.[lang]!=='string'||!nomes[id][lang].trim())erros.push(`V2E nome: ${id} ${lang}`);
  if(c.texto_documental) for(const lang of ['pt','en']){
   const nome=FAMILIAS_DAS_LINHAS[id]?.nome?.[lang],cartao=modeloDoCartao({tipo:'linha',id,lang});
   if(!nome||!tituloDaLinha(c,lang).startsWith(nome+' · ')||!descricaoDaLinha(c,lang).includes(' · '+nome+' · '))erros.push(`V2E cabeçalho documental: ${id} ${lang}`);
   if(cartao.manchete!==nome||cartao.valores.some(v=>v.campo==='unit'))erros.push(`V2E cartão documental: ${id} ${lang}`);
   const valor=parse(codigoDaIncorporacao(c,lang)).querySelector('a > span');
   if(valor?.getAttribute('lang')!=='pt-PT'||valor.textContent!==c.value)erros.push(`V2E língua da incorporação: ${id} ${lang}`);
  }

  if(id.startsWith('der-')){
   const ds=p.derivation,ids=ds.components.map(idSite),rs=ids.map(k=>linhas.get(k));
   if(rs.some(r=>!r)){erros.push(`V2E componentes: ${id}`);continue;}
   const values=rs.map(r=>n(r.value));let result;
   if(ds.operation==='change_pct')result=(values[0]/values[1]-1)*100;
   else if(ds.operation==='sum')result=values.reduce((a,b)=>a+b,0);
   else if(ds.operation==='subtract')result=values[0]-values[1];
   else if(ds.operation==='percent')result=values[0]/values[1]*100;
   else if(ds.operation==='millions')result=values.reduce((a,b)=>a+b,0)/1e6;
   else if(ds.operation==='number')result=values[0];
   else if(ds.operation==='count')result=rs.length;
   else if(ds.operation==='count_complete')result=rs.filter(r=>r.value==='Completo').length;
   const rounded=Number(result?.toFixed(ds.rounding_places));
   if(!Number.isFinite(rounded)||rounded!==n(c.value))erros.push(`V2E conta: ${id}`);
   if(!c.check||JSON.stringify([...(c.derived_from??[])].sort())!==JSON.stringify([...ids].sort()))erros.push(`V2E componentes: ${id}`);
   if(!c.derivation||!c.derivation_en)erros.push(`V2E derivação: ${id}`);
   if(ds.components.some(component=>component!==idSite(component)&&[c.derivation,c.derivation_en].some(s=>s?.includes(component))))erros.push(`V2E identificador da derivação: ${id}`);
  }
 }
 for(const item of itens){
  const usadas=linhasImpressasOuDerivadas(item,linhas);
  for(const id of item.linhas??[])if(!usadas.has(id))erros.push(`V2E integração sem uso: ${id}`);
 }
 const milestones=Object.keys(proofs).filter(id=>/^(prr-complemento|prr-marcos-metas)-/.test(id)&&id.endsWith('-estado'));
 if(milestones.length!==37)erros.push('V2E marcos: universo diferente');
 for(const id of ['prr-complemento-p4-1-40-estado']){
  if(linhas.get(id)?.value!=='Completo')erros.push(`V2E exemplo: ${id} não está completo`);
 }
 const countries={'eurostat-be-phys':'Bélgica','eurostat-el-phys':'Grécia','eurostat-ro-nrs':'Roménia','eurostat-lu-nrs':'Luxemburgo'};
 for(const [id,country] of Object.entries(countries))if(lugarDaIncorporacao(linhas.get(id),'pt').nome!==country)erros.push(`V2E país: ${id}`);
 if(itens[0].seccoes[1].conteudo.length!==10||itens[0].seccoes[2].conteudo.length!==6||itens[1].seccoes[1].conteudo.length!==8)erros.push('V2E parágrafos: número diferente');
 return erros;
}
export function plantasDosEfeitos(linhas,itens){
 const results=[];
 for(const texto of [
  'estão completos, entre eles o contrato de gestão para o Hospital de Lisboa Oriental .',
  'are complete, including the management contract for Hospital de Lisboa Oriental .',
 ]){
  const regras=leMarcadores(process.cwd());
  if(analisa(texto,'/o-que-se-discute',regras,'discussao').includes('complet'))throw new Error('Estado do PRR recusado');
  results.push({nome:'estado completo fora da rota declarada',mordeu:analisa(texto,'/',regras,'home').includes('complet')});
  results.push({nome:'afirmação de completude acrescentada',mordeu:analisa(texto+' O sítio está completo.','/o-que-se-discute',regras,'discussao').includes('complet')});
 }
 const painel='prr-monitorizacao-20261014-p2-c01-taxa';
 const html=(id,v)=>`<span data-claim="${id}">${v}</span>`;
 if(conferirFormatoDaPagina(html(painel,'47%'),'planta').desvios.length)throw new Error('Painel íntegro recusado');
 for(const [nome,id,v] of [['valor do painel alterado',painel,'48%'],['valor com identidade diferente','taxa-de-emprego-2025','47%']])
  results.push({nome,mordeu:conferirFormatoDaPagina(html(id,v),'planta').desvios.some(d=>d.regra==='F4')});
 const nomeId='prr-complemento-p4-1-40-estado';
 for(const lang of ['pt','en']){
  const correto=proofs[nomeId][lang==='pt'?'label':'label_en'];
  for(const [nome,id,texto,edicao] of [
   ['nome alterado',nomeId,correto+' alterado',lang],
   ['código alterado',nomeId,correto.replace('1.40','9.99'),lang],
   ['nome de outra edição',nomeId,correto,lang==='pt'?'en':'pt'],
   ['nome sem prova','linha-inexistente',correto,lang],
  ])results.push({nome:nome+' '+lang,mordeu:!nomeDoEfeitoConferido(id,texto,edicao)});
 }
 const text=linhas.get('pe-despacho-braga');
 for(const [field,value] of [['value','Texto diferente'],['excerpt','Excerto diferente'],['unit','euros'],['source_url','https://example.invalid/'],['access_date','2000-01-01']]){
  const bad=structuredClone(text);bad[field]=value;
  results.push({nome:'texto documental com '+field+' alterado',mordeu:!textoDocumentalConferido(bad)});
 }
 for(const field of ['source_sha256','title','locator','page']){
  const bad=structuredClone(text);bad.document[field]=field==='page'?999:'Outra prova';
  results.push({nome:'texto documental com documento '+field+' alterado',mordeu:!textoDocumentalConferido(bad)});
 }
 for(const change of [c=>{delete c.period;},c=>{c.period='2026-07';},c=>{c.period='2026-02/2026-07';},c=>{c.reference_date='2025-07';}]){
  const c=structuredClone(linhas.get('sns-cirurgias-2026-07'));change(c);
  const bad=new Map(linhas);bad.set(c.id,c);
  results.push({nome:'período acumulado alterado ou ausente',mordeu:conferirEfeitos(bad,itens).includes(`V2E acumulado: ${c.id}`)});
 }
 for(const id of Object.keys(proofs).filter(id=>proofs[id].unit!=='texto'&&Number.isFinite(n(proofs[id].value)))){
  const bad=new Map(linhas),row=structuredClone(bad.get(id));row.value='999999';bad.set(id,row);
  results.push({nome:'número diferente da prova '+id,mordeu:conferirEfeitos(bad,itens).includes(`V2E número selado: ${id}`)});
 }
 for(const lang of ['pt','en']){
  const nomes=structuredClone(NOMES_V2E),id='sns-lista-cirurgia-2026-07';
  delete nomes[id]?.[lang];
  results.push({nome:'nome ausente no registo '+lang,mordeu:conferirEfeitos(linhas,itens,nomes).includes(`V2E nome: ${id} ${lang}`)});
 }
 const semUsoItens=structuredClone(itens),semUso='linha-sem-utilizacao-na-planta';
 semUsoItens[0].linhas.push(semUso);
 results.push({nome:'porta de linha sem utilização',mordeu:conferirEfeitos(linhas,semUsoItens).includes(`V2E integração sem uso: ${semUso}`)});
 const cadeia=new Map([['a',{derived_from:['b']}],['b',{derived_from:['c']}],['c',{derived_from:['a']}]]);
 results.push({nome:'porta de componente transitiva',mordeu:[...linhasImpressasOuDerivadas({paragrafo:[{claim:'a'}]},cadeia)].join('|')==='a|b|c'});
 for(const id of Object.keys(proofs).filter(id=>id.startsWith('der-'))){
  const bad=new Map(linhas),row=structuredClone(bad.get(id));row.value='999999';bad.set(id,row);
  results.push({nome:'conta alterada '+id,mordeu:conferirEfeitos(bad,itens).some(e=>e===`V2E conta: ${id}`)});
 }
 const bad=new Map(linhas),row=structuredClone(bad.get('prr-complemento-p4-1-40-estado'));
 row.value='Dentro do Prazo';bad.set(row.id,row);
 results.push({nome:'exemplo PRR incompleto',mordeu:conferirEfeitos(bad,itens).some(e=>e.startsWith('V2E exemplo:'))});
 return results;
}
export function conferirRecibosDosEfeitos(dist,itens,linhas){
 const erros=[],plantas=[];
 for(const lang of ['pt','en'])for(const id of Object.keys(proofs)){
  const file=path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html');
  if(!fs.existsSync(file)){erros.push(`V2E recibo ausente: ${id} ${lang}`);continue;}
  const root=parse(fs.readFileSync(file,'utf8'));
  const slug=id.startsWith('pe-')?'parcerias-rodoviarias':'saude-no-orcamento';
  const usada=linhasImpressasOuDerivadas(itens.find(i=>i.slug===slug),linhas).has(id);
  const url=(lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/')+'#'+slug;
  const check=r=>r.querySelectorAll('a[href]').some(a=>a.closest('[data-discussao-integracao]')&&a.getAttribute('href')===url);
  if(check(root)!==usada)erros.push(`V2E porta do recibo: ${id} ${lang}`);
  if(id==='pe-despacho-braga'){
   const broken=parse(root.toString());broken.querySelector('[data-discussao-integracao]')?.remove();
   plantas.push({nome:'recibo V2E sem porta '+lang,mordeu:!check(broken)});
  }
 }
 return {erros,plantas};
}
