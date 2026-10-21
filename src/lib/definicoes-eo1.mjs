/** Trechos documentais separados da prosa livre, com a origem exata conservada. */
import {NOMES_EO1} from '../data/nomes-eo1.mjs';
import {getClaim} from './ledger.mjs';
import {temAlgarismoLivre} from './algarismos-definicoes.mjs';
/** @param {string} id @returns {string[]} */
function componentes(id) {
  const c=/** @type {any} */(getClaim(id));
  if(!c)throw new Error('EO1 definição: linha ausente '+id);
  return c.derivation ? c.derived_from.flatMap(componentes) : [id];
}
/** @param {string} texto @param {string} id @param {string} lang */
export function partesDaDefinicaoEo1(texto,id,lang) {
  const nome=/** @type {Record<string, Record<string,string>>} */(NOMES_EO1)[id]?.[lang];
  /** @type {Array<{texto:string,tipo?:string,linha?:string}>} */
  let partes=[{texto}];
  /** @param {string} literal @param {string} tipo @param {string} linha */
  const separar=(literal,tipo,linha)=>{
    partes=partes.flatMap(p=>{
      if(p.tipo||!p.texto.includes(literal))return [p];
      return p.texto.split(literal).flatMap((t,i)=>[...(i?[{texto:literal,tipo,linha}]:[]),{texto:t}]);
    });
  };
  if(nome && texto.includes('«'+nome+'»'))separar(nome,'nome',id);
  if(id.startsWith('der-oe2027-medidas-anteriores-') && texto.includes('3.2')){
    const ids=componentes(id);
    if(!ids.length||!ids.every(k=>/Quadro 3\.2(?:\D|$)/.test((/** @type {any} */(getClaim(k)))?.document?.locator??'')))throw new Error('EO1 definição: quadro sem localizador nas componentes');
    separar(lang==='pt'?'quadro 3.2':'table 3.2','quadro',ids[0]);
  }
  return partes;
}
/** @param {string} texto @param {string} id @param {string} lang */
export function temAlgarismoLivreEo1(texto,id,lang) {
  return partesDaDefinicaoEo1(texto,id,lang).some(p=>!p.tipo&&temAlgarismoLivre(p.texto));
}
/** Confere a marca contra a linha, sem aceitar texto arbitrário dentro dela.
 * @param {any} el @param {string} id @param {string} lang */
export function origemDaDefinicaoConfere(el,id,lang) {
  if(!el)return false;
  const tipo=el.getAttribute('data-eo1-origem'),linha=el.getAttribute('data-de-linha'),texto=el.textContent;
  if(tipo==='nome')return linha===id&&texto===/** @type {Record<string,Record<string,string>>} */(NOMES_EO1)[id]?.[lang];
  return tipo==='quadro'&&id.startsWith('der-oe2027-medidas-anteriores-')&&componentes(id).includes(linha)&&texto===(lang==='pt'?'quadro 3.2':'table 3.2')&&/Quadro 3\.2(?:\D|$)/.test((/** @type {any} */(getClaim(linha)))?.document?.locator??'');
}
/** @param {any} el @param {string} id @param {string} lang */
export function errosDaDefinicaoEo1(el,id,lang) {
  /** @type {string[]} */
  const erros=[];
  /** @param {any} n */
  const andar=n=>{
    if(n.nodeType===3){
      if(!temAlgarismoLivre(n.text))return;
      for(let p=n.parentNode;p&&p!==el.parentNode;p=p.parentNode){
        if(p.hasAttribute?.('data-eo1-origem')){
          if(!origemDaDefinicaoConfere(p,id,lang))erros.push('origem textual divergente');
          return;
        }
        if(p.getAttribute?.('data-nonledger')==='data-da-linha'&&p.getAttribute('data-de-linha')===id&&p.getAttribute('data-de-campo')==='reference_date')return;
      }
      erros.push('algarismo livre na definição: '+n.text);
    }
    for(const c of n.childNodes??[])andar(c);
  };
  for(const n of el.querySelectorAll('[data-eo1-origem]'))if(!origemDaDefinicaoConfere(n,id,lang))erros.push('marca sem origem exata');
  andar(el);return erros;
}
