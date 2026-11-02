import {unidadeDaMedida} from './unidade-da-medida.mjs';

/** SEL1: move só o ponto de inserção, mantendo os bytes do HTML documental.
 * @param {Array<{html:string}|{selo:string}>} pecas
 */
export function selosDepoisDaMedida(pecas) {
  const copia=pecas.map(p=>({...p}));
  for(let i=0;i<copia.length-1;i++) {
    if(!('selo' in copia[i]) || !('html' in copia[i+1])) continue;
    const seguinte=/** @type {{html:string}} */(copia[i+1]);
    // Só fechos em linha; nunca se atravessa um bloco ou outro nó de texto.
    const fechar=seguinte.html.match(/^(?:<\/(?:span|strong|em|code|a)>)*/u)?.[0]??'';
    const unidade=unidadeDaMedida(seguinte.html.slice(fechar.length).split('<',1)[0]);
    if(!unidade)continue;
    const mover=fechar+unidade.texto;
    seguinte.html=seguinte.html.slice(mover.length);
    copia.splice(i,0,{html:mover});i++;
  }
  return copia;
}

/** Consome a unidade do texto seguinte sem mudar a ordem das palavras ou notas.
 * @param {any[]} partes
 */
export function partesComMedida(partes) {
  const copia=partes.map(p=>typeof p==='string'?p:{...p});
  for(let i=0;i<copia.length-1;i++) {
    const p=copia[i], seguinte=copia[i+1];
    if(!p?.claim || typeof seguinte!=='string')continue;
    const prefixo=p.sufixo??'';
    const inteira=prefixo?unidadeDaMedida(prefixo+seguinte):null;
    const unidade=unidadeDaMedida(seguinte);
    const cauda=inteira && inteira.texto.length>prefixo.length ? inteira.texto.slice(prefixo.length) : unidade?.texto;
    if(!cauda)continue;
    p.cauda=(p.cauda??'')+cauda;
    copia[i+1]=seguinte.slice(cauda.length);
  }
  return copia;
}

/** O próximo nó, atravessando apenas fechos de elementos em linha.
 * @param {any} el
 * @returns {any}
 */
export function proximoEmLinha(el) {
  while(el?.parentNode) {
    const irmaos=el.parentNode.childNodes, i=irmaos.indexOf(el);
    for(let j=i+1;j<irmaos.length;j++)if(irmaos[j].nodeType!==3 || irmaos[j].text!=='')return irmaos[j];
    el=el.parentNode;
    if(!/^(span|strong|em|code|a)$/i.test(el.rawTagName??el.tagName??''))return null;
  }
  return null;
}

/** O selo só pode seguir a figura ou a unidade exata, nunca prosa arbitrária.
 * @param {any} el
 * @returns {{irmao:any,texto:string|null}}
 */
export function irmaoDepoisDaMedida(el) {
  let no=proximoEmLinha(el);
  if(no?.nodeType===1 && no.classList?.contains('claim-sufixo')) {
    const texto=no.text??no.textContent;
    if(unidadeDaMedida(texto)?.texto!==texto)return {irmao:null,texto};
    no=proximoEmLinha(no);
  }
  if(no?.nodeType===3) {
    const texto=no.text??no.textContent;
    const unidade=unidadeDaMedida(texto);
    if(!unidade || unidade.texto!==texto)return {irmao:null,texto};
    no=proximoEmLinha(no);
  }
  return {irmao:no?.nodeType===1?no:null,texto:no?.nodeType===3?(no.text??no.textContent):null};
}

/** SEL1: os apoios de prosa ficam junto da passagem que já sustentavam.
 * As âncoras são excertos das declarações, nunca palavras acrescentadas à página.
 */
const ANCORAS = {
  'og1-votacao-generalidade': {pt:'o ECO tinha noticiado',en:'ECO had reported'},
  'og1-mf-despesa-total-efetiva-nota': {pt:'inclui os ativos e passivos financeiros',en:'includes financial assets and liabilities'},
  'oe-2027-saude-dotacao-reforco-contratos-programa': {pt:'a dotação para reforçar os contratos-programa ainda por fechar',en:'the provision to reinforce the contract-programmes still to be closed'},
  'oe-2027-saude-contrato-programa-acss': {pt:'os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde',en:"the agreements between the Central Administration of the Health System and the National Health Service's entities"},
  'og1-mf-ppp-encargos-receitas': {pt:'receitas que lhe cabem',en:'revenue that falls to it'},
  'og1-mf-ppp-receitas-portagem': {pt:'vias portajadas',en:'tolled roads'},
  'pe-oe-beira-abolicao': {pt:'eliminação das portagens',en:'toll abolition'},
};
/** @param {any[]} partes @param {string[]} ids @param {'pt'|'en'} lang */
export function partesComRecibos(partes,ids,lang) {
  let copia=partes.map(p=>typeof p==='string'?p:{...p});
  for(const id of ids) {
    if(copia.some(p=>p?.literal?.id===id||p?.claim===id||p?.selo===id))continue;
    const data=copia.find(p=>p?.data?.id===id);
    if(data){data.selarData=true;continue;}
    const ancora=/** @type {Record<string,{pt:string,en:string}>} */(ANCORAS)[id]?.[lang];
    const i=ancora?copia.findIndex(p=>typeof p==='string'&&p.includes(ancora)):-1;
    if(i<0)throw new Error('SEL1: apoio sem passagem declarada: '+id);
    const texto=copia[i], fim=texto.indexOf(ancora)+ancora.length;
    copia.splice(i,1,texto.slice(0,fim),{fonte:id},texto.slice(fim));
  }
  return copia;
}
