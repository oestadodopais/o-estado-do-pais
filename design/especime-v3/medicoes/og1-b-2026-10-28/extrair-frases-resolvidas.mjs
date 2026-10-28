/** Diagnóstico da passagem interrompida: texto dos dados, sem alegar construção do HTML. */
import fs from 'node:fs';
import {ITENS} from '../../../../src/data/discussao.mjs';
import {resolverExplicacao,textoDosPedacosDaExplicacao} from '../../../../src/lib/explicacoes.mjs';
const frases=[];
for(const lang of ['pt','en'])for(const item of ITENS){
  const e=resolverExplicacao(item,lang);
  frases.push({slug:item.slug,lang,caminho:'titulo',texto:textoDosPedacosDaExplicacao(e.titulo,lang)});
  for(const p of [...e.abertura,...e.seccoes.flatMap(s=>s.blocos).filter(b=>b.tipo==='paragrafo')])
    frases.push({slug:item.slug,lang,caminho:p.caminho,texto:textoDosPedacosDaExplicacao(p.pedacos,lang)});
}
fs.writeFileSync(new URL('./frases-resolvidas.json',import.meta.url),JSON.stringify({estado:'Resolvidas dos dados; não extraídas de HTML construído.',frases},null,2)+'\n');
console.log(`${frases.length} títulos e parágrafos resolvidos, sem construção do HTML.`);
