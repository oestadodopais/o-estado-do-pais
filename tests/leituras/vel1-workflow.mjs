import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {load} from 'js-yaml';
const workflow = load(fs.readFileSync('.github/workflows/portao.yml','utf8'));
const visitados = new Set();
function importar(f) {
  if (visitados.has(f)) return;
  visitados.add(f);
  const texto = fs.readFileSync(f,'utf8');
  for (const m of texto.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('node:')) continue;
    assert(m[1].startsWith('.'), `dependência externa em ${f}: ${m[1]}`);
    importar(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));
  }
}
importar('scripts/verify-partes.mjs');
assert([...visitados].every(f=>f.startsWith('scripts/')));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'vel1-esparsa-'));
try {
  for (const f of [...visitados,'package.json','.nvmrc','package-lock.json']) {
    fs.mkdirSync(path.dirname(path.join(tmp,f)),{recursive:true});fs.copyFileSync(f,path.join(tmp,f));
  }
  const ensaio=`import {juntar} from './scripts/verify-partes.mjs';
    import crypto from 'node:crypto';
    const scripts={build:'escreve',verify:'escreve && confere'};
    const base={cabeca:'ensaio',partes:[['confere']]};
    const manifesto=crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex');
    const p={parte:0,cabeca:'ensaio',manifesto,ok:true,celulas:{U:{ok:true},D:{ok:true},C:{ok:true}},corridos:[{passo:'confere',codigo:0}]};
    if(!juntar(scripts,base,[p]).ok)process.exit(1);`;
  execFileSync('node',['--input-type=module','-e',ensaio],{cwd:tmp,stdio:'pipe'});
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
console.log(JSON.stringify({juntar_importa:[...visitados],bytes:[...visitados].reduce((n,f)=>n+fs.statSync(f).size,0),arvore_esparsa:'união verde sem src, tests ou dependências instaladas'}));

function conferirWorkflow(w) {
  assert.equal(w.name,'portão');
  assert.equal(w.jobs.portao.if,'always()');
  assert.deepEqual(w.jobs.portao.needs,['antecedente','construir','conferir']);
  assert.equal(w.jobs.conferir.if,"needs.construir.result == 'success'");
  assert.equal(w.jobs.conferir.strategy.matrix.parte,'${{ fromJSON(needs.construir.outputs.partes) }}');
  assert.equal(w.jobs.construir.outputs.partes,'${{ steps.plano.outputs.partes }}');
  const planeamento=w.jobs.construir.steps.find(s=>s.id==='plano');
  assert(planeamento.run.includes('node scripts/verify-partes.mjs construir'));
  assert(planeamento.run.includes('node scripts/verify-partes.mjs planear'));
  assert(planeamento.run.includes('require("./at1-build.json").partes.map((_, i) => i)'));
  const uniao=w.jobs.portao.steps.find(s=>s.run?.includes('verify-partes.mjs juntar'));
  assert(uniao.run.includes("require('./at1-build.json').partes.map((_, i) => i)"));
  const arvore=w.jobs.portao.steps.find(s=>s.uses?.startsWith('actions/checkout@'));
  assert.equal(arvore.with['fetch-depth'],1);
  assert.equal(arvore.with['sparse-checkout-cone-mode'],false);
  assert.deepEqual(arvore.with['sparse-checkout'].trim().split('\n'),['/package.json','/.nvmrc','/package-lock.json','/scripts/']);
  for (const job of [w.jobs.construir,w.jobs.conferir]) {
    const cache=job.steps.find(s=>s.uses?.startsWith('actions/cache@'));
    assert(cache.with.key.includes('steps.playwright.outputs.versao'));
    assert.equal(cache.with.path,'~/.cache/ms-playwright');
    const versao=job.steps.find(s=>s.id==='playwright');
    assert(versao.run.includes('packages["node_modules/playwright"].version'));
    const instalar=job.steps.find(s=>s.name==='O Chromium do Playwright');
    assert.equal(instalar['timeout-minutes'],5);
    assert.equal(instalar.id,'chromium');
    assert.equal(instalar['continue-on-error'],true);
    assert.equal(instalar.run,'npx playwright install --with-deps chromium');
    const repetir=job.steps.find(s=>s.name==='Repetir a instalação do Chromium');
    assert.equal(repetir['timeout-minutes'],5);
    assert.equal(repetir.if,"${{ !cancelled() && steps.chromium.outcome == 'failure' }}");
    assert.equal(repetir.run,instalar.run);
    assert(!repetir['continue-on-error']);
    assert.equal(job.steps.indexOf(repetir),job.steps.indexOf(instalar)+1);
  }
  assert.equal(w.jobs.construir.needs,'antecedente');
  assert.equal(w.jobs.construir.if,"needs.antecedente.outputs.dispensar != 'sim'");
  assert.equal(w.on.schedule.length,1);
  const decisao=w.jobs.antecedente.steps.find(s=>s.id==='decisao');
  assert(decisao.run.includes('[ "$EVENTO" = push ] && [ "$REFERENCIA" = refs/heads/main ]'));
  for (const s of w.jobs.portao.steps.slice(1)) assert(s.if.includes("needs.antecedente.outputs.dispensar != 'sim'"));
}
conferirWorkflow(workflow);
for (const mudar of [w=>w.jobs.conferir.strategy.matrix.parte=[0,1,2],w=>w.jobs.construir.outputs.partes='[0,1]',
  w=>w.jobs.portao.steps.find(s=>s.run?.includes('verify-partes.mjs juntar')).run='for i in 0 1; do true; done',
  w=>w.jobs.portao.needs=['construir','conferir'],
  w=>delete w.jobs.construir.steps.find(s=>s.id==='chromium')['timeout-minutes'],
  w=>delete w.jobs.conferir.steps.find(s=>s.name==='Repetir a instalação do Chromium')['timeout-minutes'],
  w=>w.jobs.construir.steps.find(s=>s.name==='Repetir a instalação do Chromium').if='always()']) {
  const w=structuredClone(workflow);mudar(w);assert.throws(()=>conferirWorkflow(w));
}
// Executa a condição real do YAML com todas as combinações de resultados.
const gate=workflow.jobs.portao.steps[0].run;
let casos=0;
for (const dispensar of ['sim','nao','']) for (const antecedente of ['success','failure','skipped','cancelled'])
  for (const construir of ['success','failure','skipped','cancelled']) for (const conferir of ['success','failure','skipped','cancelled']) {
    const r=spawnSync('bash',['-e','-c',gate],{env:{...process.env,ANTECEDENTE:antecedente,DISPENSAR:dispensar,
      ENDERECO:'https://example.invalid/corrida',CONSTRUIR:construir,CONFERIR:conferir},encoding:'utf8'});
    const esperado=antecedente==='success' && (dispensar==='sim' || (dispensar==='nao' && construir==='success' && conferir==='success'));
    assert.equal(r.status===0,esperado,JSON.stringify({dispensar,antecedente,construir,conferir}));casos++;
  }
assert.notEqual(spawnSync('bash',['-e','-c',gate],{env:{ANTECEDENTE:'success',DISPENSAR:'sim',ENDERECO:''}}).status,0);
console.log(`VEL1 workflow: plano dinâmico, árvore esparsa e cache conferidos; ${casos} combinações do portao e dispensa sem endereço provadas`);
