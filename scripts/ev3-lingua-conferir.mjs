/** EV3: prova independente dos invólucros de língua da edição inglesa. */
import {NodeType} from 'node-html-parser';
const nomes=new Set(['Câmara','Assembleia Municipal','Tribunal de Contas','Fundo Ambiental','Laboratório Floresta Nómada','Floresta Nómada']);
/** @param {any} el @param {string} edicao */
export function marcaDeLinguaEv3Valida(el,edicao){
 if(edicao!=='evora-2027-capital-europeia-da-cultura/en'||el.rawTagName!=='span')return false;
 const atributos=el.attributes;
 if(Object.keys(atributos).sort().join(',')!=='data-ev3-nome,lang'||atributos['data-ev3-nome']!==''||atributos.lang!=='pt-PT')return false;
 return el.childNodes.length===1&&el.childNodes[0].nodeType===NodeType.TEXT_NODE&&nomes.has(el.childNodes[0].rawText);
}
