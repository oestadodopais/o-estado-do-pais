/** EX2: conferências que a mudança toca, com códigos lidos da execução e registos sem caminhos locais. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync,execFileSync} from 'node:child_process';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const nomes=process.argv.slice(2);
const tarefas={
  explicacao:['tests/explicacoes/explicacao.mjs','--prova','--json',`${pasta}/explicacao.json`],
  semana:['tests/explicacoes/semana.mjs','--prova','--json',`${pasta}/semana.json`],
  frases:['tests/explicacoes/frases-compostas.mjs','--json',`${pasta}/frases-compostas.json`],
  html:['scripts/gate-html.mjs'],
  voz:['scripts/check-voz.mjs'],
  lingua:['scripts/check-lingua.mjs'],
  css:['scripts/check-css.mjs','--prova'],
  indice:['tests/indice/indice.mjs','--prova'],
  lugar:['scripts/check-lugar.mjs'],
  tipos:['node_modules/typescript/bin/tsc','-p','tsconfig.check.json'],
};
const limpa=s=>s.replaceAll(process.cwd(),'<worktree>').replaceAll(os.homedir(),'<casa>');
const resultados=[];
fs.mkdirSync(path.join(pasta,'conferencias'),{recursive:true});
for(const nome of nomes.length?nomes:Object.keys(tarefas)) {
 const args=tarefas[nome];if(!args)throw Error('conferência desconhecida');
 const inicio=new Date().toISOString();
 const r=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:64*1024*1024});
 fs.writeFileSync(path.join(pasta,'conferencias',`${nome}.log`),limpa((r.stdout??'')+(r.stderr??'')));
 fs.writeFileSync(path.join(pasta,'conferencias',`${nome}.codigo`),`${r.status}\n`);
 resultados.push({nome,comando:limpa(`node ${args.join(' ')}`),cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),inicio,fim:new Date().toISOString(),codigo:r.status});
 console.log(`${nome}: ${r.status}`);
}
fs.writeFileSync(path.join(pasta,'conferencias',`corrida-${nomes.join('-')||'todas'}.json`),JSON.stringify(resultados,null,2)+'\n');
if(resultados.some(r=>r.codigo!==0))process.exitCode=1;
