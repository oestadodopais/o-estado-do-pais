import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {ITENS}=await import(pathToFileURL(path.join(process.cwd(),'src/data/discussao.mjs')));
const {conferirDeclaracoes}=await import(pathToFileURL(path.join(process.cwd(),'tests/discussao/itens.mjs')));
assert.deepEqual(conferirDeclaracoes(),[]);
const plantas=[];
for(const lang of ['pt','en'])for(const unidade of ['milhões de euros','mil milhões de euros','milhões','euros','%','pontos percentuais','p.p.','million euros','billion euros','million','percentage points']){
 const copia=structuredClone(ITENS),tokens=copia[0].seccoes.flatMap(s=>s.conteudo).map(b=>b.paragrafo[lang]).find(ts=>ts.some(t=>t?.claim&&t.sufixo));
 const i=tokens.findIndex(t=>t?.claim&&t.sufixo);delete tokens[i].sufixo;tokens.splice(i+1,0,' '+unidade+'; ');
 const erros=conferirDeclaracoes(copia),queixa=erros.find(e=>e===`V2E unidade fora do token: ${lang} ${tokens[i].claim}`);assert(queixa);
 plantas.push({lang,unidade,claim:tokens[i].claim,queixa,mordeu:true});
}
assert.deepEqual(conferirDeclaracoes(),[]);
fs.writeFileSync(process.argv[2],JSON.stringify({controlo:true,plantas},null,2)+'\n');console.log(JSON.stringify({plantas:plantas.length}));
