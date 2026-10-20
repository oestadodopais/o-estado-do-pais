/** V2D: o título conserva cada origem no HTML, incluindo dentro de portas. */
import {parse} from 'node-html-parser';
import {ITENS} from '../../src/data/discussao.mjs';
import {portaDoTituloDaDiscussao} from '../../scripts/porta-do-titulo-discussao.mjs';
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
export function conferirMarcasDoTitulo(el,e,lang,linhas){
 const erros=[],tokens=e.titulo[lang].filter(x=>typeof x!=='string');
 const marcas=el?.querySelectorAll('[data-claim],[data-de-linha]')??[];
 if(marcas.length!==tokens.length)return ['V2D título: falta uma origem de valor ou período'];
 tokens.forEach((t,i)=>{
  const m=marcas[i],id=t.claim??t.periodo;
  if(t.claim){if(m.getAttribute('data-claim')!==id||normal(m.text)!==normal(linhas.get(id)?.value))erros.push('V2D título: valor fora da linha ou da ordem declarada');}
  else if(m.getAttribute('data-nonledger')!=='data-da-linha'||m.getAttribute('data-de-linha')!==id||m.getAttribute('data-de-campo')!=='reference_date'||normal(m.text)!==String(linhas.get(id)?.reference_date))erros.push('V2D título: período fora da linha ou da ordem declarada');
 });
 return erros;
}
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
export function tituloDeEnsaio(e,lang,linhas,selos=false){
 return e.titulo[lang].map(t=>{
  if(typeof t==='string')return esc(t);
  if(t.periodo)return `<span data-nonledger="data-da-linha" data-de-linha="${t.periodo}" data-de-campo="reference_date">${esc(linhas.get(t.periodo)?.reference_date)}</span>`;
  const href=(lang==='pt'?'/livro-razao/':'/en/ledger/')+t.claim;
  return `<span class="claim"><span data-claim="${t.claim}">${esc(linhas.get(t.claim)?.value)}</span>${esc(t.sufixo??'')}${selos?`<a class="src-chip" href="${href}">fonte</a>`:''}</span>`;
 }).join('');
}
export function plantasDosTitulos(linhas){
 const e=ITENS[0],out=[];
 for(const lang of ['pt','en']){
  const href=(lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/')+'#'+e.slug;
  const html=`<a data-discussao-porta="${e.slug}" href="${href}">${tituloDeEnsaio(e,lang,linhas)}</a><article data-discussao="${e.slug}"><h2 data-discussao-titulo>${tituloDeEnsaio(e,lang,linhas,true)}</h2></article>`;
  const julga=r=>portaDoTituloDaDiscussao(r.querySelector('[data-claim]'),e.titulo[lang].find(x=>x?.claim).claim,lang,linhas,{destino:r.querySelector('h2')});
  out.push({nome:'título completo com destino selado aceite',lang,mordeu:julga(parse(html))});
  for(const [nome,estraga] of [
   ['percentagem do título sem origem',r=>r.querySelector('a [data-claim]').removeAttribute('data-claim')],
   ['ano do título sem origem',r=>r.querySelector('a [data-de-linha]').removeAttribute('data-de-linha')],
   ['linha da percentagem do título trocada',r=>r.querySelector('a [data-claim]').setAttribute('data-claim','oe-2027-saude-despesa-total-consolidada-2027')],
   ['valor do título alterado',r=>r.querySelector('a [data-claim]').set_content('42')],
   ['destino do título trocado',r=>r.querySelector('a').setAttribute('href','#outro')],
   ['ano sem origem no título de destino',r=>r.querySelector('h2 [data-de-linha]').removeAttribute('data-de-linha')],
   ['selo ausente no título de destino',r=>r.querySelector('h2 .src-chip').remove()],
  ]){const r=parse(html);estraga(r);out.push({nome,lang,mordeu:!julga(r)});}
 }
 return out;
}
