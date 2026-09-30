/** E0: acrescenta as entradas datadas e chama o selador, sem reescrever o passado. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
const ids = ['taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025'];
const antes = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
const aplicar = (id, entrada) => {
  const ficheiro = `ledger/claims/${id}.yml`;
  const texto = fs.readFileSync(ficheiro, 'utf8');
  const linha = load(texto);
  if (linha.value === entrada.new_value) {
    assert.deepEqual(linha.corrections.at(-1), entrada);
    console.log(`${id}: entrada já aplicada.`);
    return;
  }
  assert.equal(linha.value, entrada.old_value);
  assert.deepEqual(linha.corrections, []);
  const campos = Object.entries(entrada).map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`).join('\n').replace(/^    /, '  - ');
  const novo = texto.replace(/^value: .*$/m, `value: ${JSON.stringify(entrada.new_value)}`)
    .replace('corrections: []', `corrections:\n${campos}`);
  const conferida = load(novo);
  assert.deepEqual(conferida.corrections, [entrada]);
  fs.writeFileSync(ficheiro, novo);
  execFileSync('node', ['scripts/selar-historia-valores.mjs', id], { stdio: 'inherit' });
};
for (const id of ids) {
  const linha = load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
  const literal = linha.excerpt.match(/2025: (\d+\.\d+)$/)?.[1];
  assert.equal(literal, '6.0');
  aplicar(id, { date: '2026-09-30', kind: 'correcao', old_value: '6', new_value: literal.replace('.', ','),
    reason: 'A apresentação omitira a casa decimal que o excerto da fonte já guardava: «6.0». Repõe-se essa casa decimal na forma portuguesa, sem alterar a quantidade nem declarar uma revisão da fonte.',
    reason_en: 'The presentation omitted the decimal place already preserved in the source excerpt: «6.0». That decimal place is restored in the Portuguese number format, without changing the quantity or claiming a source revision.' });
}
const correcoes = fs.readdirSync('ledger/claims').filter(f => f.endsWith('.yml')).reduce((n, f) =>
  n + load(fs.readFileSync(`ledger/claims/${f}`, 'utf8')).corrections.filter(e => e.kind === 'correcao').length, 0);
assert.equal(correcoes, 5);
const contador = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
assert.equal(contador.check, 'correcoes_publicadas');
aplicar(contador.id, { date: '2026-09-30', kind: 'atualizacao', old_value: '3', new_value: String(correcoes),
  reason: 'A contagem passou a incluir as duas correções da apresentação decimal do desemprego de Portugal publicadas a 30.09.2026. O valor anterior contava as correções existentes antes dessas publicações; a recontagem não é uma correção adicional.',
  reason_en: 'The count now includes the two corrections to the decimal presentation of unemployment in Portugal published on 30.09.2026. The previous value counted the corrections present before those publications; the recount is not an additional correction.' });
const depois = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
for (const [id, entradas] of Object.entries(antes)) assert.deepEqual(depois[id].slice(0, entradas.length), entradas);
console.log('E0: as três entradas foram aplicadas pelo mecanismo; as entradas anteriores conservam-se.');
