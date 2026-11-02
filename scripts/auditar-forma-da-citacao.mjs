/** OG1-E: mede todas as rotas construídas com a mesma régua do portão. */
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {loadClaims} from '../src/lib/ledger.mjs';
import {matchPath} from '../src/lib/routes.mjs';
import {conferirFormaDasCitacoes,conferirEdicaoGuardada,unidadesDaForma,errosDaFormaNoTexto} from './forma-da-citacao.mjs';
const dist=process.env.OEDP_DIST??'dist', rows=loadClaims();
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
const result={paginas:0,recusas:[],linhas:[],por_pagina:[],edicoes_guardadas:[]};
for(const file of files(dist)) {
 const rel=path.relative(dist,file).split(path.sep).join('/');
 const route='/'+rel.replace(/(?:^|\/)index\.html$/,'/').replace(/\/$/,'');
 const rota=matchPath(route||'/');result.paginas++;
 const html=fs.readFileSync(file,'utf8'),root=parse(html);
 const errors=conferirFormaDasCitacoes(root,rota,rows,{html});
 const archive=conferirEdicaoGuardada(rota,html);
 if(archive&&!archive.erro)result.edicoes_guardadas.push({rota:route,sha256:archive.sha256,recusas_conservadas:unidadesDaForma(root).flatMap(t=>errosDaFormaNoTexto(t,rows,rota.lang)).length});
 result.por_pagina.push({rota:route||'/',recusas:errors.length});
 if(errors.length)result.recusas.push({rota:route,erros:errors});
}
result.linhas=[...new Set(result.recusas.flatMap(r=>r.erros.map(e=>e.split(' ')[1].replace(/:$/,''))))];
const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(`OG1-E: ${result.paginas} páginas lidas; ${result.linhas.length} linhas recusadas em ${result.recusas.length} rotas.`);
for(const r of result.recusas)console.log(r.rota+': '+r.erros.join('; '));
process.exitCode=result.recusas.length?1:0;
