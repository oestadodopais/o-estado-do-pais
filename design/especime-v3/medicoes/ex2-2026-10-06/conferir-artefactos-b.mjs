/** Confere os bytes das capturas, a cabeça das provas e a regeneração integral do relatório. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const le=f=>JSON.parse(fs.readFileSync(path.join(pasta,f),'utf8'));
const sha=x=>createHash('sha256').update(x).digest('hex');
const e=le('entrega-b.json'), erros=[], capturas=[];
for(const manifesto of ['capturas-b.json','capturas-antes.json']) {
 const m=le(manifesto);
 for(const c of m.capturas) {
  const lido=sha(fs.readFileSync(c.ficheiro));
  if(lido!==c.sha256) erros.push(`Bytes diferentes: ${c.ficheiro}`);
  capturas.push({ficheiro:c.ficheiro,sha256:lido,igual:lido===c.sha256});
 }
}
if(e.cabeca_codigo!==e.cabeca_portoes||e.cabeca_codigo!==e.cabeca_fim)erros.push('Cabeças divergentes');
for(const [g,c] of Object.entries(e.portoes)) if(c!==0)erros.push(`Portão ${g}: ${c}`);
const anterior=sha(fs.readFileSync(path.join(pasta,'LEIA-ME.md')));
execFileSync(process.execPath,[path.join(pasta,'escrever-relatorio.mjs')]);
const regenerado=sha(fs.readFileSync(path.join(pasta,'LEIA-ME.md')));
if(anterior!==regenerado)erros.push('O relatório não era a saída do guião');
const mudados=execFileSync('git',['diff','--name-only','167d86b8','--'],{encoding:'utf8'}).trim().split('\n');
const novos=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n');
for(const f of new Set([...mudados,...novos].filter(Boolean))) {
 if(!fs.existsSync(f)||f.endsWith('.png'))continue;
 const texto=fs.readFileSync(f,'utf8');
 if(texto.includes(os.homedir())||texto.includes(process.cwd())||texto.includes(os.userInfo().username))erros.push(`Caminho ou nome local: ${f}`);
}
const out={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/conferir-artefactos-b.mjs',cabeca_codigo:e.cabeca_codigo,portoes:e.portoes,capturas,relatorio:{antes:anterior,regenerado,identico:anterior===regenerado},erros};
fs.writeFileSync(path.join(pasta,'artefactos-b.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({capturas:capturas.length,relatorio_identico:anterior===regenerado,erros}));
if(erros.length)process.exitCode=1;
