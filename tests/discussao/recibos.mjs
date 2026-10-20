/** V2-d-b: o recibo distingue o período dos dados da edição do documento. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {LINGUA_DOS_TITULOS} from '../../src/i18n/lingua-dos-titulos.mjs';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
export function conferirHistoriaTextual(root,linha,lang){
 const erros=[],lingua=LINGUA_DOS_TITULOS[linha.document?.title];
 for(const [n,c] of (linha.corrections??[]).entries()){
  if(!['correcao','atualizacao'].includes(c.kind))continue;
  for(const campo of ['old_value','new_value']){
   const no=root.querySelector(`[data-correcao-claim="${linha.id}"][data-correcao-n="${n}"][data-correcao-campo="${campo}"]`);
   if(!no||no.text!==c[campo])erros.push('V2D história textual: correção ausente ou texto diferente do registo');
   if(lingua&&lingua!==lang&&no?.getAttribute('lang')!==(lingua==='pt'?'pt-PT':lingua))erros.push('V2D história textual: falta a língua declarada do documento');
  }
 }
 return erros;
}
function conferirPeriodo(root,linha,lang){
 const nos=root.querySelectorAll('.aparelho-ficha [data-de-campo="period"]'),n=nos[0];
 const m=/^(\d{4})-T([1-4])$/.exec(String(linha.period));
 if(!m)return ['V2D recibo: falta o período trimestral dos riscos'];
 const texto=lang==='pt'?`${m[2]}.º trimestre de ${m[1]}`:`${m[2]}${['st','nd','rd','th'][Number(m[2])-1]} quarter of ${m[1]}`;
 const dd=n?.closest('dd'),irmaos=dd?.parentNode.childNodes.filter(x=>x.tagName)??[],rotulo=irmaos[irmaos.indexOf(dd)-1];
 return nos.length===1&&n.getAttribute('data-de-linha')===linha.id&&normal(n.text)===texto&&(lang!=='pt'||normal(rotulo?.text)==='Dados do')?[]:['V2D recibo: período dos riscos ou preposição incorretos'];
}
export function conferirRecibosCorrigidos(dist,linhas){
 const erros=[],plantas=[];
 for(const lang of ['pt','en'])for(const [id,l] of linhas){
  const risco=id.startsWith('ppp-oe2027-riscos-'),serie=/^ppp-oe20\d\d-liquidos-\d{4}$/.test(id)||id.startsWith('saude-total-');
  const textual=l.afirmacao===true&&l.unit==='afirmação'&&(l.corrections??[]).some(c=>['correcao','atualizacao'].includes(c.kind));
  if(!risco&&!serie&&!textual)continue;
  const ficheiro=path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html');
  if(!fs.existsSync(ficheiro)){erros.push(`V2D recibo: recibo corrigido ausente ${id} (${lang})`);continue;}
  const root=parse(fs.readFileSync(ficheiro,'utf8'));
  if(textual){
   erros.push(...conferirHistoriaTextual(root,l,lang).map(e=>`${e}: ${id} (${lang})`));
   const registo=path.join(dist,lang==='pt'?'correcoes':'en/corrections','index.html');
   if(fs.existsSync(registo))erros.push(...conferirHistoriaTextual(parse(fs.readFileSync(registo,'utf8')),l,lang).map(e=>`${e}: registo ${id} (${lang})`));
   else erros.push(`V2D história textual: registo ausente (${lang})`);
   if(lang==='en'){
    const no=root.querySelector(`[data-correcao-claim="${id}"][data-correcao-campo="old_value"]`);
    if(no){no.removeAttribute('lang');plantas.push({nome:'correção textual sem língua da fonte',lang,item:id,mordeu:conferirHistoriaTextual(root,l,lang).some(e=>e.includes('língua'))});}
   }
  }
  if(risco){
   erros.push(...conferirPeriodo(root,l,lang).map(e=>`${e}: ${id} (${lang})`));
   const n=root.querySelector('.aparelho-ficha [data-de-campo="period"]');
   if(n){n.set_content(String(l.document?.edition));plantas.push({nome:'recibo troca trimestre dos riscos pelo ano do documento',lang,item:id,mordeu:conferirPeriodo(root,l,lang).length>0});}
  }
  if(serie){
   const frase=root.querySelector('.linha-atribuicao'),titulo=frase?.querySelector('[data-linha-campo="document.title"]');
   if(!titulo||titulo.text!==l.document?.title)erros.push(`V2D recibo: atribuição sem título documental ${id} (${lang})`);
   if(/^\d{4}$/.test(String(l.document?.edition))&&String(l.document?.title).split(/\D+/).includes(l.document.edition)&&frase?.querySelector('[data-linha-campo="document.edition"]'))erros.push(`V2D recibo: ano repetido na atribuição ${id} (${lang})`);
  }
 }
 return {erros,plantas};
}
