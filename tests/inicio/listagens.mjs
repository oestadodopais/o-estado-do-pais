import { estadoDoInventario } from '../../scripts/voz.mjs';
/** DO2-C: a seleção declarada e a superfície inteira concordam, sem dispensas por ausência. */
import { listagensDoInicio, candidatasDoInicio } from '../../src/lib/listagens-do-inicio.mjs';
import { dossieDaPeca } from '../../src/lib/dossies.mjs';
import { DOSSIES } from '../../src/data/dossies.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { conferirSuperficieDossies } from '../../scripts/dossies-superficie.mjs';
import { parse } from 'node-html-parser';
export function conferirListagens(root,lang,listas=listagensDoInicio(lang)) {
 const erros=[], main=root.querySelector('main')??root;
 const compara=(seccao,selector,atributo,tipo)=>{
  const esperados=listas[seccao].filter(e=>e.tipo===tipo).map(e=>e.slug);
  const encontrados=main.querySelectorAll(selector).map(e=>e.getAttribute(atributo));
  if(JSON.stringify(encontrados)!==JSON.stringify(esperados))erros.push(`DO2 início: seleção de ${seccao} diferente: ${encontrados.join(',')} / ${esperados.join(',')}`);
 };
 compara('estudos','#trabalhos [data-estudo]','data-estudo','estudo');
 compara('perceber','[data-para-perceber] [data-explicacao-porta]','data-explicacao-porta','explicacao');
 compara('perceber','[data-para-perceber-porta="semana"]','data-para-perceber-porta','semana');
 compara('discussao','[data-discussao-inicio] [data-discussao-porta]','data-discussao-porta','discussao');
 compara('integracao','[data-discussao-integracao]','data-discussao-integracao','discussao');
 for(const [seccao,selector] of [['estudos','#trabalhos'],['perceber','[data-para-perceber]'],['discussao','[data-discussao-inicio]']]) {
  const caixas=main.querySelectorAll(selector);
  if(caixas.length!==Number(listas[seccao].length>0))erros.push(`DO2 início: presença de ${seccao} diferente`);
 }
 const seletores={novidades:'[data-novidades]',discussao:'[data-discussao-inicio]',perceber:'[data-para-perceber]',estudos:'#trabalhos',integracao:'[data-integracao-do-inicio]'};
 for(const [seccao,selector] of Object.entries(seletores)) {
  const esperado=listas[seccao].filter(e=>e.tipo==='dossie').map(e=>e.dossie.slug);
  const encontrado=main.querySelectorAll(`${selector} [data-novidade-dossie],${selector} [data-dossie-lista]`).map(e=>e.getAttribute('data-novidade-dossie')??e.getAttribute('data-dossie-lista'));
  if(JSON.stringify(encontrado)!==JSON.stringify(esperado))erros.push(`DO2 início: lugar do dossiê em ${seccao} diferente`);
 }
 for(const d of DOSSIES) {
  const links=main.querySelectorAll('a').filter(a=>a.getAttribute('href')===routePath('dossie',lang,{slug:d.slug}));
  if(links.length!==Number(listas.dossies.includes(d.slug)))erros.push(`DO2 início: dossiê ${d.slug} repetido ou ausente`);
  for(const [camada,tipo] of [['estudos','estudo'],['explicacoes','explicacao'],['itens','discussao']])for(const slug of d.pecas[camada]) {
   const href=tipo==='discussao'?routePath('discussao',lang)+'#'+slug:routePath(tipo,lang,{slug});
   if(dossieDaPeca(tipo,slug)&&main.querySelectorAll('a').some(a=>a.getAttribute('href')===href))erros.push(`DO2 início: peça do dossiê repetida: ${tipo}:${slug}`);
  }
 }
 erros.push(...conferirSuperficieDossies(root,lang,lang==='pt'?'index.html':'en/index.html').erros);
 return erros;
}
export function plantasDasListagens(html,lang,dossieHtml) {
 const provas=[];
 provas.push({nome:'estado condicional restrito aos dois títulos conferidos',lang,mordeu:estadoDoInventario('condicional-do2','v2b','O que se discute →')==='condicional-do2'&&estadoDoInventario('condicional-do2','v2b','Under discussion →')==='condicional-do2'&&estadoDoInventario('condicional-do2','do2','O que se discute →')===null&&estadoDoInventario('condicional-do2','v2b','palavra inventada')===null});
 const planta=(nome,mudar,padrao)=>{const r=parse(html);mudar(r);const erros=conferirListagens(r,lang);provas.push({nome,lang,mordeu:erros.some(e=>padrao.test(e)),queixa:erros.find(e=>padrao.test(e))??null});};
 const d=DOSSIES[0];
 planta('peça do dossiê repetida depois das novidades',r=>r.querySelector('#trabalhos').insertAdjacentHTML('beforeend',`<a href="${routePath('estudo',lang,{slug:d.pecas.estudos[0]})}">peça repetida</a>`),/peça do dossiê repetida/);
 planta('estudo avulso retirado',r=>r.querySelector('#trabalhos [data-estudo]').remove(),/seleção de estudos/);
 planta('peça avulsa retirada de Para perceber',r=>r.querySelector('[data-para-perceber-porta]').remove(),/seleção de perceber/);
 // Uma cópia dos dados retira o dossiê das novidades; a discussão recebe a mesma forma da lista.
 const candidatas=candidatasDoInicio(lang);candidatas.novidades=candidatas.novidades.filter(e=>e.dossie?.slug!==d.slug);
 const listas=listagensDoInicio(lang,candidatas),r=parse(html),lista=parse(dossieHtml).querySelector(`[data-dossie-lista="${d.slug}"]`);
 r.querySelector(`[data-novidade="dossie:${d.slug}"]`).remove();
 r.querySelector('[data-novidades]').insertAdjacentHTML('afterend',`<section data-discussao-inicio><ul>${lista.outerHTML}</ul></section>`);
 const erros=conferirListagens(r,lang,listas);
 provas.push({nome:'dossiê fora das novidades ocupa a primeira secção seguinte',lang,mordeu:!erros.length&&listas.discussao[0]?.dossie?.slug===d.slug&&listas.estudos.every(e=>e.dossie?.slug!==d.slug),queixa:erros.join('; ')||null});
 return provas;
}
