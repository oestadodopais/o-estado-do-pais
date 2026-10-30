/** DO2-C: um dossiê ocupa o lugar da sua primeira peça, pela ordem das secções.
 * As listas candidatas conservam os seus limites; não se preenchem os lugares suprimidos. */
import { entradasDasNovidades } from './novidades.mjs';
import { dossieDaPeca } from './dossies.mjs';
import { dossiesDaLista } from './dossies-conteudo.mjs';
import { itensResolvidos, itensSobreLinhas } from './discussao.mjs';
import { estudosRecentes } from './pais.mjs';
import { explicacaoMaisRecente, explicacaoResolvida } from './explicacoes.mjs';
import { BLOCO_PARA_PERCEBER } from '../data/primeira-pagina.mjs';
import { FIGURAS_PDM } from '../data/figuras.mjs';
/** @param {'pt'|'en'} lang @returns {Record<string, any[]>} */
export function candidatasDoInicio(lang) {
  const recente=explicacaoMaisRecente();
  return {
    novidades:entradasDasNovidades(lang),
    discussao:itensResolvidos(lang).map(peca=>({tipo:'discussao',slug:peca.slug,peca})),
    perceber:BLOCO_PARA_PERCEBER.portas.flatMap((/** @type {string} */ porta) => /** @type {any[]} */ (porta==='explicacao-mais-recente'
      ? recente?[{tipo:'explicacao',slug:recente.slug,peca:explicacaoResolvida(recente.slug,lang)}]:[]
      : [{tipo:'semana',slug:'semana',peca:null}])),
    estudos:estudosRecentes(lang).slice(0,3).map(peca=>({tipo:'estudo',slug:peca.work.slug,peca})),
    integracao:itensSobreLinhas(FIGURAS_PDM.map(m=>m.claim),lang).map(peca=>({tipo:'discussao',slug:peca.slug,peca})),
  };
}
/** A cópia das candidatas permite provar a ausência do dossiê nas novidades.
 * @param {'pt'|'en'} lang @param {ReturnType<typeof candidatasDoInicio>} [candidatas] */
export function listagensDoInicio(lang, candidatas=candidatasDoInicio(lang)) {
  const vistos=new Set(), dossies=dossiesDaLista(lang);
  /** @type {Record<string, any[]>} */
  const seccoes={};
  /** @type {{seccao:string,slug:string,dossie:string}[]} */
  const suprimidas=[];
  for(const seccao of ['novidades','discussao','perceber','estudos','integracao']) {
    seccoes[seccao]=candidatas[seccao].flatMap(entrada=>{
      const slug=entrada.slug??entrada.id?.split(':')[1];
      const d=entrada.tipo==='dossie'?entrada.dossie:dossieDaPeca(entrada.tipo,slug);
      if(!d)return [entrada];
      if(vistos.has(d.slug)){suprimidas.push({seccao,slug,dossie:d.slug});return [];}
      vistos.add(d.slug);
      return [{...entrada,tipo:'dossie',slug:d.slug,dossie:dossies.find(x=>x.slug===d.slug)}];
    });
  }
  return {...seccoes, dossies:[...vistos], suprimidas};
}
