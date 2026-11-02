import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const {registoDoHtml}=await import(process.cwd()+'/src/lib/eyetext.mjs');
const slug='a-casa-em-portugal-e-na-europa';
const unidades=b=>b.kind==='heading'||b.kind==='paragraph'?[b]:b.kind==='list'?b.items:b.kind==='table'?b.rows.flat():[];
const projeta=bs=>bs.map(b=>({kind:b.kind,level:b.level??null,ordered:b.ordered??null,unidades:unidades(b).map(u=>({text:u.text,header:Boolean(u.header)}))}));
const resultados=[];
for(const lang of ['pt','en']) {
 const p=`registos/${slug}/${lang}.record.json`,h=`studies-src/${slug}/${lang}.html`;
 const antes=projeta(JSON.parse(execFileSync('git',['show',`main:${p}`],{encoding:'utf8'})).blocks),depois=projeta(JSON.parse(fs.readFileSync(p,'utf8')).blocks);
 const origemAntes=projeta(registoDoHtml(execFileSync('git',['show',`main:${h}`],{encoding:'utf8'}))),origemDepois=projeta(registoDoHtml(fs.readFileSync(h,'utf8')));
 assert.deepEqual(depois,antes,`${lang}: texto mudou`);assert.deepEqual(origemDepois,origemAntes,`${lang}: origem mudou`);assert.deepEqual(depois,origemDepois,`${lang}: texto e origem divergem`);
 const copia=structuredClone(depois);copia[0].unidades[0].text+='x';assert.notDeepEqual(copia,antes);
 resultados.push({lang,blocos:depois.length,unidades:depois.reduce((n,b)=>n+b.unidades.length,0),mudancas:0,sha256_texto:createHash('sha256').update(JSON.stringify(depois)).digest('hex'),planta:'um carácter alterado detetado'});
}
fs.writeFileSync('design/especime-v3/medicoes/ed1-2026-11-02/habitacao-main.json',JSON.stringify({comando:'node design/especime-v3/medicoes/ed1-2026-11-02/provar-habitacao-main.mjs',main:execFileSync('git',['rev-parse','main'],{encoding:'utf8'}).trim(),resultados},null,2)+'\n');console.log(JSON.stringify(resultados));
