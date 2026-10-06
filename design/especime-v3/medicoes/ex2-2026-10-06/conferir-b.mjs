/** Conferências da passagem, com comando, cabeça, saída sem caminhos locais e código. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync,execFileSync} from 'node:child_process';
const pasta='design/especime-v3/medicoes/ex2-2026-10-06',saida=path.join(pasta,'conferencias-b');
const tarefas={
 semana:['tests/explicacoes/semana.mjs','--prova','--json',`${pasta}/semana-b.json`],
 titulos:['tests/pais/pais.mjs','--json',`${pasta}/titulos-plantas-b.json`],
 html:['scripts/gate-html.mjs'],voz:['scripts/check-voz.mjs'],lingua:['scripts/check-lingua.mjs'],
 indice:['tests/indice/indice.mjs','--prova'],css:['scripts/check-css.mjs','--prova'],
 tipos:['node_modules/typescript/bin/tsc','-p','tsconfig.check.json'],
 frases:['tests/explicacoes/frases-compostas.mjs','--json',`${pasta}/frases-compostas-b.json`],
 lugar:['scripts/check-lugar.mjs'],
};
fs.mkdirSync(saida,{recursive:true});
const limpa=s=>s.replaceAll(process.cwd(),'<worktree>').replaceAll(os.homedir(),'<casa>').replaceAll(os.userInfo().username,'<utilizador>');
const resultados=[];
for(const nome of process.argv.slice(2).length?process.argv.slice(2):Object.keys(tarefas)) {
 const args=tarefas[nome];if(!args)throw Error('Conferência desconhecida');
 const inicio=new Date().toISOString(),r=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:128*1024*1024});
 fs.writeFileSync(path.join(saida,`${nome}.log`),limpa((r.stdout??'')+(r.stderr??'')));
 fs.writeFileSync(path.join(saida,`${nome}.codigo`),`${r.status}\n`);
 resultados.push({nome,comando:`node ${args.join(' ')}`,cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),inicio,fim:new Date().toISOString(),codigo:r.status});
 console.log(`${nome}: ${r.status}`);
}
fs.writeFileSync(path.join(saida,`corrida-${process.argv.slice(2).join('-')||'todas'}.json`),JSON.stringify(resultados,null,2)+'\n');
if(resultados.some(r=>r.codigo!==0))process.exitCode=1;
