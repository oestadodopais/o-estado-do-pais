/** As plantas e a repetição real não podem desaparecer da cadeia da aterragem. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'js-yaml';
const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts;
const workflow = load(fs.readFileSync('.github/workflows/portao.yml', 'utf8'));
function conferir(s, w) {
  const passos = s.verify.split(/\s*&&\s*/);
  for (const nome of ['check:pre-mandato', 'check:frases-reais', 'check:repositorio']) {
    assert.equal(passos.filter(p => p === 'npm run ' + nome).length, 1, nome + ' fora do verify');
  }
  assert(s['check:pre-mandato'].includes('node tests/leituras/frases-ligacao.mjs'));
  assert(s['check:pre-mandato'].includes('node tests/leituras/camada-cadeia.mjs'));
  assert.equal(s['check:frases-reais'], 'node tests/leituras/frases-reais.mjs');
  assert.equal(s['check:repositorio'], 'node tests/metodo/repositorio.mjs');
  const steps = w.jobs.conferir.steps;
  const i = steps.findIndex(p => p.with?.repository === 'oestadodopais/motor');
  assert(i >= 0, 'motor ausente da CI');
  assert.match(steps[i].with.ref, /^[a-f0-9]{40}$/);
  assert(steps[i].with['sparse-checkout'].includes('/core/assertions.py'));
  assert(steps[i].with['sparse-checkout'].includes('/content/*/ledger.json'));
  assert(steps[i].with['sparse-checkout'].includes('/content/*/Technical Source/documento.*.md.tmpl'));
  const j = steps.findIndex(p => p.run?.includes('RESEARCHHUB_DIR='));
  const k = steps.findIndex(p => p.run?.includes('scripts/verify-partes.mjs parte'));
  assert(j > i && k > j, 'motor não disponibilizado antes das partes');
}
conferir(scripts, workflow);
let plantas = 0;
for (const nome of ['check:pre-mandato', 'check:frases-reais', 'check:repositorio']) {
  assert.throws(() => conferir({...scripts, verify:scripts.verify.replace(' && npm run ' + nome, '')}, workflow)); plantas++;
}
for (const alterar of [w => { w.jobs.conferir.steps = w.jobs.conferir.steps.filter(p => !p.with?.repository); },
  w => { w.jobs.conferir.steps.find(p => p.with?.repository).with.ref = 'master'; },
  w => { w.jobs.conferir.steps = w.jobs.conferir.steps.filter(p => !p.run?.includes('RESEARCHHUB_DIR=')); }]) {
  const w = structuredClone(workflow); alterar(w);
  assert.throws(() => conferir(scripts, w)); plantas++;
}
console.log(`camada 0 na cadeia: controlo verde e ${plantas} desligamentos recusados`);
