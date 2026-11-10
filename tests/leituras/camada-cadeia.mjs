/** A camada 0 fica na corrida inteira e na aterragem, sem motor no GitHub. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'js-yaml';
import {dividir, conferirPartes} from '../../scripts/verify-partes.mjs';
const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts;
const workflow = load(fs.readFileSync('.github/workflows/portao.yml', 'utf8'));
const aterragem = fs.readFileSync('scripts/leituras/aterrar.py', 'utf8');
const motor = ['npm run check:pre-mandato', 'npm run check:frases-reais'];
const chamada = "            self.correr('camada-0', ['npm', 'run', 'verify:com-motor'])";
function conferir(s, w, a, partes = dividir(s, {}).partes) {
  const passos = s.verify.split(/\s*&&\s*/);
  for (const nome of ['check:pre-mandato', 'check:frases-reais', 'check:repositorio'])
    assert.equal(passos.filter(p => p === 'npm run ' + nome).length, 1, nome + ' fora do verify');
  assert.deepEqual(s['verify:com-motor']?.split(/\s*&&\s*/), motor, 'reserva do motor alterada');
  assert(s['check:pre-mandato'].includes('node tests/leituras/frases-ligacao.mjs'));
  assert(s['check:pre-mandato'].includes('node tests/leituras/camada-cadeia.mjs'));
  assert.equal(s['check:frases-reais'], 'node tests/leituras/frases-reais.mjs');
  assert.equal(s['check:repositorio'], 'node tests/metodo/repositorio.mjs');
  conferirPartes(s, partes);
  const build = (s['build:escrever'] ?? s['build:conteudo']).split(/\s*&&\s*/);
  assert.deepEqual([...passos.filter(p => build.includes(p) && !motor.includes(p)), ...partes.flat()].sort(),
    passos.filter(p => !motor.includes(p)).sort(), 'GitHub omite um terceiro passo');
  const linhas = a.split('\n'), i = linhas.indexOf(chamada);
  assert.equal(linhas.filter(l => l === chamada).length, 1, 'camada 0 ausente ou repetida na aterragem');
  const preparar = linhas.indexOf('            self.preparar()');
  const cruzamento = linhas.indexOf("            self.correr('cruzamento', ['npm', 'run', 'check:cruzamento', '--', '--with-origin'])");
  const fundir = linhas.findIndex(l => l.startsWith("            self.correr('fundir-main',"));
  assert(preparar >= 0 && preparar < cruzamento && cruzamento < i && i < fundir, 'camada 0 fora da ordem da aterragem');
  assert(!/oestadodopais\/motor|RESEARCHHUB_READ_TOKEN|RESEARCHHUB_DIR/.test(JSON.stringify(w)), 'motor ainda referido no GitHub');
}
conferir(scripts, workflow, aterragem);
let plantas = 0;
for (const nome of ['check:pre-mandato', 'check:frases-reais', 'check:repositorio']) {
  assert.throws(() => conferir({...scripts, verify:scripts.verify.replace(' && npm run ' + nome, '')}, workflow, aterragem)); plantas++;
}
for (const p of motor) {
  assert.throws(() => conferir({...scripts, 'verify:com-motor':p}, workflow, aterragem)); plantas++;
}
assert.throws(() => conferir(scripts, workflow, aterragem.replace(chamada + '\n', ''))); plantas++;
const depois = aterragem.replace(chamada + '\n', '').replace(/(            self\.correr\('fundir-main'.*\n)/, '$1' + chamada + '\n');
assert.throws(() => conferir(scripts, workflow, depois)); plantas++;
const partes = dividir(scripts, {}).partes;
const terceiro = partes.flat().find(p => !motor.includes(p));
assert.throws(() => conferir(scripts, workflow, aterragem, partes.map(ps => ps.filter(p => p !== terceiro)))); plantas++;
assert.throws(() => conferir({...scripts, 'verify:com-motor':scripts['verify:com-motor'] + ' && ' + terceiro}, workflow, aterragem)); plantas++;
for (const referencia of ['oestadodopais/motor', 'RESEARCHHUB_READ_TOKEN', 'RESEARCHHUB_DIR']) {
  const w = structuredClone(workflow); w.jobs.conferir.steps.push({run:'echo ' + referencia});
  assert.throws(() => conferir(scripts, w, aterragem)); plantas++;
}
console.log(`camada 0 na cadeia: controlo verde e ${plantas} desligamentos recusados`);
