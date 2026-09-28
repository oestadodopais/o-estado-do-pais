/** C1c: plantas contra a perda ou a invenção da história de uma releitura. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { load, dump } from 'js-yaml';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';

const raiz = process.cwd();
const linhas = loadClaims();
const uniao = 'divida-das-familias-2025-ue';
const dgal = 'indice-de-divida-limite-legal';
const plantas = [], controlos = [];
assert.deepEqual(validateLedger().errors, []);
controlos.push({ nome: 'livro completo com as duas histórias repostas', passou: true });
for (const id of [uniao, dgal]) {
  const antiga = load(execFileSync('git', ['show', `a677770f:ledger/claims/${id}.yml`], { encoding: 'utf8' }));
  assert.deepEqual(linhas.get(id).verifications, antiga.verifications);
  controlos.push({ nome: `${id}: lista exata de a677770f`, passou: true });
}
function plantar(nome, id, mudar, falha) {
  const original = linhas.get(id);
  const copia = structuredClone(original);
  mudar(copia);
  linhas.set(id, copia);
  try {
    const erros = validateLedger().errors;
    assert.deepEqual(erros, [falha], nome);
    plantas.push({ nome, mordeu: true, falha });
  } finally { linhas.set(id, original); }
}
const rot = `[${uniao}.yml] verificação #1`;
plantar('antes do acesso atual sem história', uniao,
  c => { c.corrections = c.corrections.filter(x => x.field !== 'access_date'); },
  `${rot}: "date" é 2026-09-21 e o acesso em vigor nesse dia é 2026-09-28. Uma releitura é depois da leitura.`);
plantar('endereço antigo errado', dgal,
  c => { c.verifications[0].path = c.source_url; },
  `[${dgal}.yml] verificação #1: "path" não é o endereço em vigor a 2026-09-01: https://www.occ.pt/sites/default/files/public/2025-11/Anu%C3%A1rio%202024_OCC.pdf#page=22.`);
plantar('antes do primeiro acesso da história', uniao,
  c => { c.verifications[0].date = '2026-09-14'; },
  `${rot}: "date" é 2026-09-14 e o acesso em vigor nesse dia é 2026-09-15. Uma releitura é depois da leitura.`);
const primeiro = { date: '2026-09-20', kind: 'proveniencia', field: 'access_date', old_value: '2026-09-15', new_value: '2026-09-20', reason: 'Ensaio da história.', reason_en: 'History test.' };
const original = linhas.get(uniao);
const cadeia = structuredClone(original);
cadeia.corrections.unshift(primeiro);
cadeia.corrections.find(c => c.field === 'access_date' && c.date === '2026-09-28').old_value = '2026-09-20';
linhas.set(uniao, cadeia);
try {
  assert.deepEqual(validateLedger().errors, []);
  controlos.push({ nome: 'cadeia com dois acessos coerentes', passou: true });
  plantar('cadeia contraditória', uniao,
    c => { c.corrections.find(x => x.field === 'access_date' && x.date === '2026-09-28').old_value = '2026-09-19'; },
    `[${uniao}.yml] história de "access_date" a 2026-09-28: cadeia contraditória; "old_value" é 2026-09-19, mas antes vigorava 2026-09-20.`);
  cadeia.verifications[0].date = '2026-09-20';
  assert.deepEqual(validateLedger().errors, []);
  controlos.push({ nome: 'o dia da mudança usa o acesso novo', passou: true });
} finally { linhas.set(uniao, original); }
// A travessia real corre numa cópia isolada. O guião e a guarda não são alterados.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'c1c-historia-'));
try {
  for (const e of fs.readdirSync(raiz)) {
    if (['ledger', 'scripts'].includes(e)) continue;
    fs.symlinkSync(path.join(raiz, e), path.join(tmp, e));
  }
  fs.mkdirSync(path.join(tmp, 'scripts'));
  fs.copyFileSync('scripts/check-cruzamento.mjs', path.join(tmp, 'scripts/check-cruzamento.mjs'));
  fs.mkdirSync(path.join(tmp, 'ledger'));
  for (const e of fs.readdirSync('ledger')) {
    if (e === 'claims') continue;
    if (e === 'cruzamentos') fs.cpSync(path.join(raiz, 'ledger', e), path.join(tmp, 'ledger', e), { recursive: true });
    else fs.symlinkSync(path.join(raiz, 'ledger', e), path.join(tmp, 'ledger', e));
  }
  fs.mkdirSync(path.join(tmp, 'ledger/claims'));
  for (const f of fs.readdirSync('ledger/claims')) {
    if (f === `${dgal}.yml`) fs.copyFileSync(path.join('ledger/claims', f), path.join(tmp, 'ledger/claims', f));
    else fs.symlinkSync(path.join(raiz, 'ledger/claims', f), path.join(tmp, 'ledger/claims', f));
  }
  const correr = () => spawnSync(process.execPath, ['scripts/check-cruzamento.mjs'], { cwd: tmp, encoding: 'utf8' });
  assert.equal(correr().status, 0);
  controlos.push({ nome: 'travessia real com a lista completa', passou: true });
  const p = path.join(tmp, 'ledger/claims', `${dgal}.yml`);
  const linha = load(fs.readFileSync(p, 'utf8'));
  linha.verifications = [];
  fs.writeFileSync(p, dump(linha));
  // Mesmo com os bytes aceites, a contagem anterior continua a prender a lista.
  const regPath = path.join(tmp, 'ledger/cruzamentos/evora.json');
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  reg.rows[dgal].exported_row_sha256 = createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  fs.writeFileSync(regPath, JSON.stringify(reg));
  const r = correr();
  const falha = `[evora.json] ${dgal}: a linha tem 0 reconferência(s) e o registo diz 1. A lista encolheu: uma reconferência escrita não se apaga.`;
  assert.equal(r.status, 1);
  assert.ok((r.stdout + r.stderr).includes(falha), r.stdout + r.stderr);
  plantas.push({ nome: 'lista que encolhe na travessia real', mordeu: true, codigo: r.status, falha });
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
const resultado = { controlos, plantas, contagens: { controlos: controlos.length, plantas: plantas.length, controlos_integros: controlos.filter(x => x.passou).length, plantas_mordidas: plantas.filter(x => x.mordeu).length } };
const i = process.argv.indexOf('--json');
if (i >= 0) fs.writeFileSync(process.argv[i + 1], JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify(resultado.contagens));
