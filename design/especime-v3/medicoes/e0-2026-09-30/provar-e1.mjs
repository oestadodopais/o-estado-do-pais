/** E0: o selador conserva o passado e aceita a futura atualização de Évora.
 * A linha real de Évora conserva o seu valor; a prova usa uma cópia temporária. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const id = 'estudos-evora-publicados';
const original = fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8');
const linha = load(original);
const historias = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
const seladas = historias[id];
const entrada = { date: '2026-09-30', kind: 'atualizacao', old_value: linha.value, new_value: '4',
  reason: 'Ensaio isolado da reorganização dos estudos de Évora.',
  reason_en: 'Isolated rehearsal of the reorganisation of the Évora studies.' };
assert.equal(linha.value, '6');
linha.value = entrada.new_value;
linha.corrections.push(entrada);
const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'e0-e1-'));
try {
  fs.mkdirSync(path.join(temporaria, 'ledger/claims'), { recursive: true });
  fs.writeFileSync(path.join(temporaria, `ledger/claims/${id}.yml`), JSON.stringify(linha));
  fs.writeFileSync(path.join(temporaria, 'ledger/historias-valores.json'), JSON.stringify({ [id]: seladas }));
  const saida = execFileSync('node', [path.resolve('scripts/selar-historia-valores.mjs'), id], {
    cwd: temporaria, env: { ...process.env, OEDP_LEDGER_DIR: path.join(temporaria, 'ledger/claims') }, encoding: 'utf8' });
  const depois = JSON.parse(fs.readFileSync(path.join(temporaria, 'ledger/historias-valores.json'), 'utf8'))[id];
  assert.deepEqual(depois.slice(0, seladas.length), seladas);
  assert.equal(depois.length, seladas.length + 1);
  assert.equal(depois.at(-1).new_value, '4');
  const r = { cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    medido_em: new Date().toISOString(), codigo: 0, antes: seladas.length, depois: depois.length, passado_conservado: true,
    source_url: linha.source_url, derivation: linha.derivation, saida: saida.trim(),
    linha_real_conservada: fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8') === original };
  assert.ok(r.linha_real_conservada);
  fs.writeFileSync(`${pasta}/prova-e1.json`, JSON.stringify(r, null, 2) + '\n');
  console.log(JSON.stringify(r, null, 2));
} finally { fs.rmSync(temporaria, { recursive: true, force: true }); }
