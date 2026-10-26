/** A porta mandatada do estudo, só nos três cartões e dentro da dobra. */
import {parse} from 'node-html-parser';
const IDS=['precos-da-habitacao-2025','sobrecarga-do-custo-da-habitacao-2025','sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'];
/** @param {any} p @param {string} id @param {string} lang */
export function portaHb1Valida(p,id,lang){
 const a=p?.querySelector('a'),c=p?.closest('[data-cartao-medida]');
 const titulo=lang==='en'?'Housing in Portugal and in Europe':'A casa em Portugal e na Europa';
 return Boolean(IDS.includes(id)&&c?.getAttribute('data-cartao-medida')===id&&
  c.querySelectorAll('[data-hb1-porta]').length===1&&p.getAttribute('data-hb1-porta')===id&&
  p.closest('[data-cartao-dobra]')?.getAttribute('data-cartao-dobra')===id&&
  p.children.length===1&&a&&a.getAttribute('href')===`/${lang==='en'?'en/studies':'estudos'}/a-casa-em-portugal-e-na-europa`&&
  a.getAttribute('data-verbatim')===`estudo-hb1-titulo-${lang}`&&p.textContent.trim()===titulo);
}
/** @param {(p:string)=>string} ler */
export function plantasDasPortasHb1(ler){
 const erros=[];let controlos=0,plantas=0;
 for(const [lang,rotas] of [['pt',['habitacao','areas/infraestruturas-e-habitacao']],['en',['en/housing','en/areas/infraestruturas-e-habitacao']]])for(const rota of rotas){
  const html=ler(rota+'/index.html'),root=parse(html);
  for(const id of IDS){
   const cartao=root.querySelector(`[data-cartao-medida="${id}"]`),p=cartao?.querySelector('[data-hb1-porta]');controlos++;
   if(!portaHb1Valida(p,id,lang)){erros.push(`HB1: porta ausente ou divergente em ${rota}, ${id}`);continue;}
   for(const mudar of [c=>c.querySelector('[data-hb1-porta] a').setAttribute('href','/outra'),c=>c.querySelector('[data-hb1-porta] a').set_content('Outro estudo'),c=>c.querySelector('[data-hb1-porta]').remove(),c=>c.appendChild(parse(c.querySelector('[data-hb1-porta]').outerHTML).firstChild),c=>{const n=c.querySelector('[data-hb1-porta]');n.remove();c.appendChild(n);}]){
    const c=parse(cartao.outerHTML).firstChild;mudar(c);plantas++;
    if(portaHb1Valida(c.querySelector('[data-hb1-porta]'),id,lang))erros.push(`HB1: porta alterada passou em ${rota}, ${id}`);
   }
  }
 }
 return {erros,controlos,plantas};
}
