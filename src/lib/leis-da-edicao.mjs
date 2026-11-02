/** ED1-D: marcas de língua reversíveis, sem mudar os bytes guardados. */
import {parse, NodeType} from 'node-html-parser';
import {partesProvadas} from '../i18n/nomes-de-lei.mjs';
import {provaDosBytes} from './documentos.mjs';
const abre = '<span data-edicao-lei lang="pt-PT">';
/** @param {string} html @param {string} lang */
export function marcarLeisDaEdicao(html, lang) {
  if (html.includes('data-edicao-lei')) throw new Error('ED1: marca de língua já presente no original');
  if (lang !== 'en') return html;
  /** @type {{inicio:number,fim:number,texto:string}[]} */
  const mudancas=[];
  /** @param {any} n */
  function visitar(n) {
    if (n.nodeType===NodeType.TEXT_NODE) {
      for(let a=n.parentNode;a;a=a.parentNode) {
        if(['script','style'].includes(a.rawTagName?.toLowerCase()))return;
        const lingua=a.getAttribute?.('lang');
        if(lingua){if(lingua==='pt-PT')return;break;}
      }
      const partes=partesProvadas(n.rawText,'primeira edição');
      if(partes.some(p=>p.lei))mudancas.push({inicio:n.range[0],fim:n.range[1],texto:partes.map(p=>p.lei?abre+p.texto+'</span>':p.texto).join('')});
      return;
    }
    for(const c of n.childNodes??[])visitar(c);
  }
  const corpo=parse(html).querySelector('body');
  if(!corpo)throw new Error('ED1: documento sem corpo');
  visitar(corpo);
  for(const m of mudancas.reverse())html=html.slice(0,m.inicio)+m.texto+html.slice(m.fim);
  return html;
}
/** Prova independente: só retira invólucros exatos de nomes de diploma, depois compara todos os bytes.
 * @param {string} bruto @param {string} servido @param {string} lang */
export function provaDosBytesDaEdicao(bruto, servido, lang) {
  if(bruto.includes('data-edicao-lei'))return 'ED1: original com marca reservada';
  let erro=null;
  const semMarcas=servido.replace(/<span data-edicao-lei lang="pt-PT">([^<>]*)<\/span>/g,(_marca,texto)=>{
    const partes=partesProvadas(texto,'prova da primeira edição');
    if(lang!=='en'||partes.length!==1||!partes[0].lei)erro='ED1: marca fora de um nome português de diploma';
    return texto;
  });
  if(erro)return erro;
  return provaDosBytes(bruto,semMarcas);
}
