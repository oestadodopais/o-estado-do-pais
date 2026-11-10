import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {corridaQueDispensa} from '../../scripts/portao-dispensa.mjs';
const cabeca='a'.repeat(40), repositorio='ensaio/sitio';
const verde={id:123,name:'portão',path:'.github/workflows/portao.yml',event:'push',head_sha:cabeca,
  head_branch:'ramo',status:'completed',conclusion:'success',repository:{full_name:repositorio},
  head_repository:{full_name:repositorio},html_url:'https://github.com/ensaio/sitio/actions/runs/123'};
const decidir = runs => corridaQueDispensa({workflow_runs:runs},cabeca,repositorio);
assert.equal(decidir([verde]),verde);
for (const alteracao of [{head_branch:'main'},{head_sha:'b'.repeat(40)},{conclusion:'failure'},
  {conclusion:'cancelled'},{status:'in_progress'},{status:'queued'}, {name:'outro'},
  {path:'.github/workflows/outro.yml'}, {event:'pull_request'}, {event:'schedule'},
  {repository:{full_name:'outro/sitio'}},{head_repository:{full_name:'outro/sitio'}},
  {head_repository:null},{head_branch:null},{html_url:'https://example.invalid/123'}]) {
  assert.equal(decidir([{...verde,...alteracao}]),null,JSON.stringify(alteracao));
}
assert.equal(decidir([]),null);
assert.equal(corridaQueDispensa([{workflow_runs:[]},{workflow_runs:[verde]}],cabeca,repositorio),verde);
console.log('VEL1 dispensa: ramo verde aceite; main, outra cabeça, vermelho, cancelado, pendente, outro fluxo, evento e repositório recusados');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'vel1-dispensa-'));
try {
  const resposta=path.join(tmp,'resposta.json'), saida=path.join(tmp,'output');
  for (const texto of ['isto não é JSON', JSON.stringify({workflow_runs:{}}), 'null',
    JSON.stringify([{workflow_runs:[verde]}, {runs:[]}]), JSON.stringify({workflow_runs:[verde]})]) {
    fs.writeFileSync(resposta,texto);
    fs.writeFileSync(saida,'');
    const r=spawnSync('node',['scripts/portao-dispensa.mjs',resposta,cabeca,repositorio,saida],{encoding:'utf8'});
    const sim=texto===JSON.stringify({workflow_runs:[verde]});
    assert.equal(r.status,0,r.stderr);
    assert.equal(r.stdout,sim?'sim\n':'nao\n');
    assert.equal(fs.readFileSync(saida,'utf8'),`dispensar=${sim?'sim':'nao'}\nurl=${sim?verde.html_url:''}\n`);
  }
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
console.log('VEL1 API ilegível ou com forma errada: corrida inteira; resposta válida mantém a dispensa');
