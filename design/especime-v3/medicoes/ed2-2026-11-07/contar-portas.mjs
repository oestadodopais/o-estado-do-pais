import fs from 'node:fs';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const declaradas=manifesto.edicoes.filter(e=>e.edicoes.length>1),estudos=[...new Set(declaradas.map(e=>e.slug))];
const resultado=estudos.map(slug=>({slug,edicoes:declaradas.filter(e=>e.slug===slug).map(e=>{
 const base=`${e.lang==='pt'?'/estudos':'/en/studies'}/${slug}`,documento=`${base}/${e.lang==='pt'?'documento':'document'}`;
 const ler=rota=>parse(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
 return {lang:e.lang,manifesto:e.edicoes.length,cabecalho:ler(base).querySelectorAll('[data-edicoes-linha] a[href]').length,faixas:e.edicoes.map((v,i)=>({data:v.data,portas:ler(documento+(i===e.edicoes.length-1?'':'/'+v.data)).querySelectorAll('[data-edicoes-linha] a[href]').length}))};
})}));
fs.writeFileSync(new URL('contagem.json',import.meta.url),JSON.stringify({estudos:estudos.length,resultado},null,2)+'\n');
console.log(`Estudos com mais de uma edição: ${estudos.length}`);
for(const e of resultado)console.log(`${e.slug}: ${e.edicoes.map(l=>`${l.lang}: manifesto ${l.manifesto}, cabeçalho ${l.cabecalho}, faixas ${l.faixas.map(f=>`${f.data}=${f.portas}`).join(', ')}`).join('; ')}`);
