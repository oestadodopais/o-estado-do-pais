/** C1c: plantas contra a perda ou a invenção da história de uma releitura. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { load, dump } from 'js-yaml';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';

const raiz = process.cwd();
const linhas = loadClaims();
const uniao = 'divida-das-familias-2025-ue';
const dgal = 'indice-de-divida-limite-legal';
const plantas = [], controlos = [];
assert.deepEqual(validateLedger().errors, []);
controlos.push({ nome: 'livro completo com as duas histórias repostas', passou: true });
/* 05.10.2026 (§1.162): a história de a677770f é o PREFIXO da história em vigor, e não a lista exata, porque o
   painel semanal acrescenta uma releitura por semana a estas linhas e a lista exata recusava cada uma (a primeira,
   a de 05.10, fechou os portões dos registos). O que a célula protege não muda: nenhuma entrada antiga se perde
   nem se reescreve (o prefixo tem de bater carácter a carácter), e nenhuma entrada nova pode ser anterior à
   última antiga (uma releitura é depois da leitura). A planta da perda de uma entrada antiga morde. */
const prefixoDe = (id) => {
  const antigas = JSON.parse(fs.readFileSync('tests/linha/historias-c1c.json', 'utf8')).linhas[id];
  const atuais = linhas.get(id).verifications;
  assert.deepEqual(atuais.slice(0, antigas.length), antigas, `${id}: a história de a677770f já não é o prefixo da história em vigor`);
  for (const nova of atuais.slice(antigas.length)) {
    assert.ok(nova.date > antigas[antigas.length - 1].date, `${id}: a releitura ${nova.date} não é posterior à última antiga ${antigas[antigas.length - 1].date}`);
  }
  return { antigas, atuais };
};
for (const id of [uniao, dgal]) {
  const { antigas, atuais } = prefixoDe(id);
  controlos.push({ nome: `${id}: a história de a677770f é o prefixo das ${atuais.length} entradas em vigor (${antigas.length} antigas)`, passou: true });
}
{
  const original = linhas.get(uniao);
  const copia = structuredClone(original);
  copia.verifications = copia.verifications.filter((_, i) => i !== 0);
  linhas.set(uniao, copia);
  let mordeu = false;
  try { prefixoDe(uniao); } catch (e) { mordeu = /já não é o prefixo/.test(String(e.message)); } finally { linhas.set(uniao, original); }
  assert.ok(mordeu, 'a planta da perda de uma entrada antiga não mordeu');
  plantas.push({ nome: 'perda de uma entrada antiga da história', mordeu: true, falha: 'a história de a677770f já não é o prefixo' });
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
  c => {
    const antigo = c.source_url;
    c.source_url = 'https://fonte.invalid/novo';
    c.corrections.push({ date: '2026-09-28', kind: 'proveniencia', field: 'source_url', old_value: antigo, new_value: c.source_url, reason: 'Ensaio de endereço.', reason_en: 'Address test.' });
    c.verifications[0].path = c.source_url;
  },
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
  for (const f of ['check-cruzamento.mjs', 'contagem-do-cruzamento.mjs']) fs.copyFileSync(`scripts/${f}`, path.join(tmp, 'scripts', f));
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
  const limpa = correr();
  assert.equal(limpa.status, 0, limpa.stderr);
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
// C1d: as cadeias dos instantâneos são explícitas e conferidas mesmo sem releitura anterior.
const idsPrr = [...linhas.values()].filter(c => c.document?.kind === 'ficheiro' &&
  (c.corrections ?? []).some(x => x.kind === 'proveniencia' && x.field === 'source_url' && String(x.old_value).includes('/s/resources/dataset-estrutura-de-missao-prr-entidades-1/20260817'))).map(c => c.id);
assert.equal(idsPrr.length, 5);
for (const id of idsPrr) {
  const avisos = validateLedger().warnings.filter(x => x.startsWith(`[${id}.yml] história do endereço:`));
  assert.equal(avisos.length, 2);
  controlos.push({ nome: `${id}: dois instantâneos do mesmo conjunto anunciados`, passou: true, avisos });
}
const prr = idsPrr[0];
const antesPrr = linhas.get(prr);
for (const [nome, mudar] of [
  ['instantâneo de outro conjunto', c => { c.corrections.find(x => x.old_value?.includes('/20260817-')).old_value = 'https://dados.gov.pt/s/resources/outro/20260817-203527-exemplo/listagem-20260817.xlsx'; }],
  ['instantâneo sem identificação na razão', c => { c.corrections.find(x => x.old_value?.includes('/20260817-')).reason = 'O mesmo conjunto.'; }],
  ['cadeia contraditória sem releitura anterior', c => { c.corrections.find(x => x.field === 'source_url').new_value = 'https://fonte.invalid/errado'; }],
]) {
  const copia = structuredClone(antesPrr); mudar(copia); linhas.set(prr, copia);
  try {
    const erros = validateLedger().errors;
    assert.ok(erros.some(x => x.includes('cadeia contraditória')), nome);
    plantas.push({ nome, mordeu: true, falha: erros.find(x => x.includes('cadeia contraditória')) });
  } finally { linhas.set(prr, antesPrr); }
}
const resultado = { controlos, plantas, contagens: { controlos: controlos.length, plantas: plantas.length, controlos_integros: controlos.filter(x => x.passou).length, plantas_mordidas: plantas.filter(x => x.mordeu).length } };
const i = process.argv.indexOf('--json');
if (i >= 0) fs.writeFileSync(process.argv[i + 1], JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify(resultado.contagens));
