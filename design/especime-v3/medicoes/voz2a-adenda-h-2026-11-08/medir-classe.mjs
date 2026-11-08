// Medição da classe nos documentos atuais e nas leituras dos sete estudos.
// Da raiz: node <este ficheiro> <ficheiro de saída>
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
import {frasesDoTexto} from '../../../../scripts/voz-autorreferencia.mjs';
const lista=JSON.parse(fs.readFileSync(new URL('../voz2a-2026-11-07/FRASES-VOZ-2A.json',import.meta.url)));
// A V171 era FICA na forma anterior; a medição histórica conserva essa decisão exata.
const anteriores=process.argv.includes('--antes')?JSON.parse(execFileSync('git',['show','e28270820:design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json'],{encoding:'utf8'})).filter(f=>f.id==='V171'):[];
const ficam=[...lista,...anteriores];
const estudos=new Set(lista.map(f=>f.estudo));
const edicoes=load(fs.readFileSync('studies-src/manifest.yml','utf8')).edicoes.filter(e=>estudos.has(e.slug));
const tags='p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,div,section,article';
const ocorrencias=[];
let paginas=0;
for(const e of edicoes)for(const documento of [true,false]){
 const rota=(e.lang==='pt'?'/estudos/':'/en/studies/')+e.slug+(documento?(e.lang==='pt'?'/documento':'/document'):'');
 const root=parse(fs.readFileSync((process.argv[3]??'dist')+rota+'/index.html','utf8'));paginas++;
 root.querySelectorAll('script,style').forEach(n=>n.remove());
 const scopes=documento?[root]:root.querySelectorAll('.texto-artigo.estudo-leitura,.texto-sumario,.estudo-sumario');
 const frases=new Set();
 for(const scope of scopes)for(const n of scope.querySelectorAll(tags)){
  if(!n.querySelector(tags))for(const frase of frasesDoTexto(n.textContent))frases.add(frase);
 }
 for(const frase of frases)ocorrencias.push({rota,frase,fica:ficam.some(f=>f.classe==='FICA'&&f.paginas.includes(rota)&&f.frase===frase)});
}
const medida={paginas_lidas:paginas,paginas_com_ocorrencias:new Set(ocorrencias.map(f=>f.rota)).size,
 ocorrencias:ocorrencias.length,fora_fica:ocorrencias.filter(f=>!f.fica).length,frases:ocorrencias};
fs.writeFileSync(process.argv[2],JSON.stringify(medida,null,2)+'\n');
console.log(JSON.stringify({...medida,frases:undefined}));
