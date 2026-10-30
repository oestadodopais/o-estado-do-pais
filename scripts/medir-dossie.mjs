/** DO3: medição reproduzível do HTML construído, sem os rótulos dos selos. */
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {DOSSIES} from '../src/data/dossies.mjs';
import {routePath} from '../src/lib/routes.mjs';
const saida=[];
function medir(n,lang,grupo='secção') {
 const copia=parse(n.outerHTML);
 const figuras=n.querySelectorAll('[data-registo]').filter(f=> {
  const base=f.closest('a')??f;
  return base.parentNode.childNodes.slice(base.parentNode.childNodes.indexOf(base)+1).some(x=>x.rawTagName==='a'&&x.classList.contains('src-chip'));
 }).length;
 const valores=n.querySelectorAll('[data-claim]').filter(f=>{const id=f.getAttribute('data-claim');return (f.closest('.claim')??f.closest('[data-instrumento]'))?.querySelector(`a.src-chip[href="${routePath('linha',lang,{slug:id})}"]`);}).length;
 copia.querySelectorAll('.src-chip, .vh, script, style').forEach(x=>x.remove());
 const titulo=n.querySelector('h2,h3')?.textContent.trim()??grupo;
 const texto=copia.textContent.trim();
 return {lang,grupo,titulo,palavras:texto.split(/\s+/u).filter(Boolean).length,figuras_com_selo:figuras,valores_com_selo:valores,valores:n.querySelectorAll('[data-claim]').length,selos:n.querySelectorAll('a.src-chip').length};
}
for(const lang of ['pt','en'])for(const d of DOSSIES) {
 const rota=routePath('dossie',lang,{slug:d.slug});
 const root=parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8'));
 for(const n of root.querySelectorAll('[data-dossie-seccao], [data-dossie-explicacao], [data-dossie-discussao], section[aria-labelledby="dossie-calendario"]')) {
  saida.push(medir(n,lang));
  if(n.hasAttribute('data-dossie-explicacao'))for(const sub of n.querySelectorAll('[data-explicacao-secao]'))saida.push(medir(sub,lang,'subsecção da explicação'));
 }
}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(saida,null,2)+'\n');
console.log('edição | secção | palavras | figuras com selo | valores com selo');
for(const r of saida)console.log(`${r.lang} | ${r.grupo==='secção'?'':'  '}${r.titulo} | ${r.palavras} | ${r.figuras_com_selo} | ${r.valores_com_selo}`);
