import assert from 'node:assert/strict';
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
