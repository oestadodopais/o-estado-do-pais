/** V2-d: uma porta para o Método em cada recibo novo, além do rótulo obrigatório. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {routePath} from '../../src/lib/routes.mjs';
import {loadClaims, verificacoesDaLinha} from '../../src/lib/ledger.mjs';

const travessia=JSON.parse(fs.readFileSync(new URL('../../ledger/cruzamentos/v2d.json',import.meta.url),'utf8'));
function conferir(root,lang,alvo){
 const portas=root.querySelectorAll('main a[href]').filter(a=>!a.closest('[data-rotulo-ia]')&&a.getAttribute('href').split('#')[0].replace(/\/$/,'')===routePath('metodo',lang));
 return portas.length===1&&portas[0].getAttribute('href')===alvo?[]:['V2D Método: falta a porta única ou o destino está errado'];
}
export function conferirPortasDoMetodo(dist){
 const erros=[],plantas=[],linhas=loadClaims(),ids=Object.keys(travessia.rows);
 if(ids.length!==126||ids.some(id=>!linhas.has(id)))erros.push('V2D Método: o inventário dos recibos não contém as cento e vinte e seis linhas atravessadas');
 for(const lang of ['pt','en']){
  const metodo=routePath('metodo',lang);
  for(const id of ids){
   const ficheiro=path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html');
   if(!fs.existsSync(ficheiro)){erros.push(`V2D Método: recibo ausente ${id} (${lang})`);continue;}
   const alvo=metodo+(verificacoesDaLinha(linhas.get(id)).length?'#livro-razao':'#releitura');
   erros.push(...conferir(parse(fs.readFileSync(ficheiro,'utf8')),lang,alvo).map(e=>e+`: ${id} (${lang})`));
  }
  const alvo=metodo+'#releitura',intacto=`<main><p data-rotulo-ia="topo"><a href="${metodo}">Método</a></p><a href="${alvo}">Regra</a></main>`;
  if(conferir(parse(intacto),lang,alvo).length)erros.push('V2D Método: conhecido positivo recusado');
  for(const [nome,html] of [
   ['segunda porta para o Método',intacto.replace('</main>',`<a href="${metodo}#livro-razao">Outra porta</a></main>`)],
   ['porta da releitura removida',intacto.replace(`<a href="${alvo}">Regra</a>`,'')],
   ['destino da releitura alterado',intacto.replace(alvo,metodo+'#outra')],
  ])plantas.push({nome,lang,mordeu:conferir(parse(html),lang,alvo).length>0});
 }
 return{erros,plantas};
}
