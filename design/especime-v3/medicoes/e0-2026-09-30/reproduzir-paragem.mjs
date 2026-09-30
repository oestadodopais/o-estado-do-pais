/** E0: mede o bloqueio anterior e exerce o selador numa cópia isolada. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { mudancasDoRegisto } from '../../../../src/lib/mudancas.mjs';
import { assinaturaDoValor } from '../../../../src/lib/historia-do-valor.mjs';
import { LUGAR_DECLARADO_DAS_LINHAS } from '../../../../src/data/lugar-das-linhas.mjs';

const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const id = 'correcoes-publicadas';
const base = '07549ee1e9ec2b39186f9e9f13eeac4914bf5e76';
const linhas = loadClaims();
const ids = [id, 'taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025'];
const originais = new Map(ids.map(i => [i, linhas.get(i)]));
const lugarOriginal = LUGAR_DECLARADO_DAS_LINHAS[id];
const original = load(execFileSync('git', ['show', `${base}:ledger/claims/${id}.yml`], { encoding: 'utf8' }));
const copia = structuredClone(original);
const entrada = { date: '2026-09-30', kind: 'atualizacao', old_value: '3', new_value: '5',
  reason: 'A contagem acompanha duas correções publicadas.',
  reason_en: 'The count follows two published corrections.' };
copia.value = entrada.new_value;
copia.corrections.push(entrada);
const r = { cabeca: base, executado_na_cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  registo_limpo: {}, bloqueio_sem_lugar: {}, selador_derivado: {} };
try {
  /* A prova continua reproduzível na cabeça final, sem checkout: recompõe
     as linhas anteriores em memória, a partir da base declarada. */
  for (const i of ids) linhas.set(i, load(execFileSync('git', ['show', `${base}:ledger/claims/${i}.yml`], { encoding: 'utf8' })));
  delete LUGAR_DECLARADO_DAS_LINHAS[id];
  for (const lang of ['pt', 'en']) r.registo_limpo[lang] = mudancasDoRegisto(lang).filter(e => e.kind === 'correcao').length;
  linhas.set(id, copia);
  for (const lang of ['pt', 'en']) {
    try { mudancasDoRegisto(lang); r.bloqueio_sem_lugar[lang] = null; }
    catch (e) { r.bloqueio_sem_lugar[lang] = e.message; }
  }
} finally {
  for (const [i, c] of originais) linhas.set(i, c);
  if (lugarOriginal === undefined) delete LUGAR_DECLARADO_DAS_LINHAS[id];
  else LUGAR_DECLARADO_DAS_LINHAS[id] = lugarOriginal;
}
const selador = 'scripts/selar-historia-valores.mjs';
r.selador_original_conservado = fs.readFileSync(selador, 'utf8') === execFileSync('git', ['show', `${base}:${selador}`], { encoding: 'utf8' });
const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'e0-selador-'));
try {
  fs.mkdirSync(path.join(temporaria, 'ledger/claims'), { recursive: true });
  const texto = execFileSync('git', ['show', `${base}:ledger/claims/${id}.yml`], { encoding: 'utf8' })
    .replace(/^value: .*$/m, 'value: "5"')
    .replace('corrections: []', 'corrections: ' + JSON.stringify([entrada]));
  fs.writeFileSync(path.join(temporaria, `ledger/claims/${id}.yml`), texto);
  fs.writeFileSync(path.join(temporaria, 'ledger/historias-valores.json'), '{}\n');
  const saida = execFileSync('node', [path.resolve('scripts/selar-historia-valores.mjs'), id], {
    cwd: temporaria, env: { ...process.env, OEDP_LEDGER_DIR: path.join(temporaria, 'ledger/claims') }, encoding: 'utf8' });
  const historia = JSON.parse(fs.readFileSync(path.join(temporaria, 'ledger/historias-valores.json'), 'utf8'));
  assert.deepEqual(historia[id], [assinaturaDoValor(entrada)]);
  r.selador_derivado = { codigo: 0, saida: saida.trim(), historia: historia[id], source_url: copia.source_url, derivation: copia.derivation };
} finally { fs.rmSync(temporaria, { recursive: true, force: true }); }
r.conhecido_positivo = Object.values(r.registo_limpo).every(n => n === 3);
r.bloqueio_confirmado = Object.values(r.bloqueio_sem_lugar).every(e => e?.includes(id) && e.includes('nenhuma declaração diz de que lugar é'));
r.selador_ja_aceita_derivadas = r.selador_derivado.codigo === 0 && copia.source_url === null;
r.reposto = [...originais].every(([i, c]) => linhas.get(i) === c) && LUGAR_DECLARADO_DAS_LINHAS[id] === lugarOriginal;
assert.ok(r.conhecido_positivo && r.bloqueio_confirmado && r.selador_ja_aceita_derivadas && r.reposto && r.selador_original_conservado);
fs.writeFileSync(`${pasta}/estado-anterior.json`, JSON.stringify(r, null, 2) + '\n');
console.log(JSON.stringify(r, null, 2));
