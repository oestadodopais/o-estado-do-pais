/** Compara todas as edições únicas com uma construção anterior, só para leitura. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {WORKS, PUBLISHED_WORKS} from '../../src/data/studies.mjs';
import {versoesNoManifesto,manifestoEd2,rotasNoManifesto} from '../../scripts/edicoes-linha-conferir.mjs';
const anterior=process.argv[2];assert(anterior,'indicar o dist anterior');
const dist=process.env.OEDP_DIST??'dist';
const ler=(raiz,rota,seletor)=>{
 const el=parse(fs.readFileSync(`${raiz}${rota}/index.html`,'utf8')).querySelector(seletor);
 assert(el,`${rota}: falta ${seletor}`);return el.textContent.replace(/\s+/g,' ').trim();
};
let paginas=0,atualizadas=0;
for(const w of PUBLISHED_WORKS)for(const lang of ['pt','en']){
 const principal=w.editions.find(e=>e.lang===lang)??w.editions[0];
 if(versoesNoManifesto(w.slug,principal.lang).length!==1)continue;
 const rota=`${lang==='pt'?'/estudos':'/en/studies'}/${w.slug}`;
 assert.equal(ler(dist,rota,'[data-estudo-edicao]'),ler(anterior,rota,'[data-estudo-edicao]'),rota);
 paginas++;if(principal.updated)atualizadas++;
}
const linhas=[];
for(const slug of ['evora-2027-capital-europeia-da-cultura','orcamento-2027-o-que-muda-e-para-quem'])for(const lang of ['pt','en']){
 const e=manifestoEd2.edicoes.find(e=>e.slug===slug&&e.lang===lang);assert(e,slug);
 const rota=`${lang==='pt'?'/estudos':'/en/studies'}/${slug}`;
 linhas.push({slug,lang,cabecalho:ler(dist,rota,'[data-estudo-edicao]'),faixas:rotasNoManifesto(slug,lang).map((r,i)=>({edicao:e.edicoes[i].data,texto:ler(dist,r,'[data-documento-edicao]')}))});
}
console.log(JSON.stringify({codigo:0,paginas_de_edicao_unica:paginas,paginas_de_edicao_unica_atualizadas:atualizadas,cabecalhos_iguais:true,linhas},null,2));
