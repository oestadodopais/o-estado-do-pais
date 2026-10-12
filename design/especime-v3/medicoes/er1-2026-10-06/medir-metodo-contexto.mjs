/* Confere a secção que o brief pressupõe, sem alterar o texto governado. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { routePath } from '../../../../src/lib/routes.mjs';
import { escrever } from './medir.mjs';
const base=JSON.parse(fs.readFileSync(new URL('./antes.json',import.meta.url),'utf8')).cabeca;
const ficheiros=['src/data/metodo.mjs','src/views/MetodoView.astro'];
const fontes=ficheiros.map(f=>{
  const antes=execFileSync('git',['show',`${base}:${f}`],{encoding:'utf8'});
  return {ficheiro:f,identicoABase:antes===fs.readFileSync(f,'utf8'),mencoesConjuntoOuLicenca:(antes.match(/conjunto de dados|dataset|LICENCA|CONJUNTO/g)??[]).length};
});
const paginas=['pt','en'].map(lang=>{
  const rota=routePath('metodo',lang),root=parse(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
  const titulos=root.querySelectorAll('h2').map(n=>n.textContent);
  return {lang,rota,titulos,seccoesConjuntoDeDados:titulos.filter(t=>/conjunto de dados|dataset/i.test(t)).length};
});
escrever('metodo-contexto',{comando:'node design/especime-v3/medicoes/er1-2026-10-06/medir-metodo-contexto.mjs',base,fontes,paginas});
console.log(JSON.stringify({fontes,paginas},null,2));
