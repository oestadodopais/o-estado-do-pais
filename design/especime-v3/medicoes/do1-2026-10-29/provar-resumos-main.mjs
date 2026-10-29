/** DO1-D: comparação literal com uma construção da cabeça main indicada no mandato. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const [base,saida]=process.argv.slice(2);
assert(base&&saida,'Uso: provar-resumos-main.mjs <dist da base> <pasta temporária>');
fs.mkdirSync(saida,{recursive:true});
const resultados=[];
for(const [nome,rota,seletor] of [
 ['inicio-pt','index.html','[data-discussao-resumo]'],
 ['inicio-en','en/index.html','[data-discussao-resumo]'],
 ['discussao-pt','o-que-se-discute/index.html','.discussao-sumario, .discussao-abertura'],
 ['discussao-en','en/under-discussion/index.html','.discussao-sumario, .discussao-abertura'],
]) {
 const extrair=p=>parse(fs.readFileSync(`${p}/${rota}`,'utf8')).querySelectorAll(seletor).map(n=>n.outerHTML);
 const a=extrair(base),b=extrair('dist');assert(a.length&&b.length);
 const antes=`${saida}/${nome}-antes.html`,depois=`${saida}/${nome}-depois.html`;
 fs.writeFileSync(antes,a.join('\n')+'\n');fs.writeFileSync(depois,b.join('\n')+'\n');
 const diff=spawnSync('diff',['-u',antes,depois],{encoding:'utf8'});
 fs.writeFileSync(`${saida}/${nome}.diff`,diff.stdout??'');
 assert.equal(diff.status,0,`Resumos diferentes: ${nome}`);
 resultados.push({pagina:rota,seletor,blocos:a.length,diff:diff.status,sha256:createHash('sha256').update(a.join('\n')+'\n').digest('hex')});
}
fs.writeFileSync('design/especime-v3/medicoes/do1-2026-10-29/resumos-main-do1-d.json',JSON.stringify({base:'71d85e4ce',comando:'git archive 71d85e4ce; astro build na cópia temporária; extração dos blocos; diff -u',resultados},null,2)+'\n');
console.log(JSON.stringify(resultados.map(({pagina,blocos,diff})=>({pagina,blocos,diff}))));
