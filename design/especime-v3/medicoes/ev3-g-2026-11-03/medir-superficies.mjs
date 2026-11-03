import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
const raiz='dist',pasta='design/especime-v3/medicoes/ev3-g-2026-11-03';
const normal=s=>s.replace(/\s+/g,' ').trim();
function arquivos(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?arquivos(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
const paginas=arquivos(raiz),ledes=[],correcoes=[],inicio=[];
for(const f of paginas){
 const rota='/'+path.relative(raiz,f).replace(/index\.html$/,'').replace(/\/$/,'');
 const root=parse(fs.readFileSync(f,'utf8'));
 for(const h of root.querySelectorAll('h1')){let n=h.nextSibling;while(n&&n.nodeType!==1)n=n.nextSibling;if(n&&/\blede\b/.test(n.getAttribute('class')??''))ledes.push({rota,texto:normal(n.textContent),classe:n.getAttribute('class')});}
 if(['/correcoes','/en/corrections'].includes(rota))correcoes.push({rota,lede:root.querySelectorAll('.lede').length,politica:normal(root.querySelector('#politica')?.textContent??''),naturezas:root.querySelectorAll('#politica .metodo-lista li').length,meta:root.querySelector('meta[name="description"]')?.getAttribute('content')});
 if(['/','/en'].includes(rota)){
  const caixa=root.querySelector('[data-novidades]'),registo=rota==='/en'?'/en/corrections':'/correcoes';
  const entradas=caixa.querySelectorAll('[data-novidade]').map(n=>({id:n.getAttribute('data-novidade'),texto:normal(n.textContent)}));
  inicio.push({rota,entradas,entradas_do_registo:entradas.filter(e=>e.id.startsWith('atualizacao:')||e.id.startsWith('correcao:')).length,marcas_do_registo:root.querySelectorAll('[data-correcao-entrada],[data-correcao-campo]').map(n=>({marca:n.getAttribute('data-correcao-campo')??n.getAttribute('data-correcao-entrada'),na_caixa:!!n.closest('[data-novidades]')})),portas_registo_fora_da_caixa:root.querySelectorAll('a[href]').filter(n=>n.getAttribute('href')===registo&&!n.closest('[data-novidades]')).length});
 }
}
const resultado={fase:process.argv[2],criterio_ledes:'Elemento seguinte ao h1 com lede como palavra na classe, segundo o DOM lido por node-html-parser.',paginas:paginas.length,ledes,correcoes,inicio};
fs.writeFileSync(`${pasta}/${process.argv[2]}.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({paginas:paginas.length,ledes:ledes.length,ledes_das_correcoes:ledes.filter(e=>['/correcoes','/en/corrections'].includes(e.rota)).length,naturezas:correcoes.map(e=>[e.rota,e.naturezas]),inicio:inicio.map(e=>({rota:e.rota,pecas:e.entradas.length,registo:e.entradas_do_registo,marcas_fora:e.marcas_do_registo.filter(m=>!m.na_caixa).length,portas:e.portas_registo_fora_da_caixa}))}));
