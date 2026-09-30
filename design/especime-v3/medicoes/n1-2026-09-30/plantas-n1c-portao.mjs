/** N1c: a porta estreita das unidades mantém a conferência literal e de contexto. */
import fs from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
const pasta = 'design/especime-v3/medicoes/n1-2026-09-30';
const n1d = process.argv.includes('--n1d');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const construcao = JSON.parse(fs.readFileSync('dist/version.json', 'utf8'));
if (n1d && construcao.commit !== cabeca) throw new Error('As plantas exigem a construção da cabeça atual.');
const ficheiro = 'dist/lugares/index.html';
const antes = fs.readFileSync(ficheiro, 'utf8');
const sha = (s) => createHash('sha256').update(s).digest('hex');
const resultados = [];
const casos = [
  ['limpo', null, null],
  ['unidade municipal trocada', (r) => r.querySelector('thead [data-linha-campo="unit"]').set_content('euros'), /campo "unit"|campo unit|unit.*difere|unit.*transcri/],
  ['campo municipal fora do mapa', (r) => { const n = r.querySelector('thead [data-linha-campo="unit"]'); r.querySelector('main').insertAdjacentHTML('afterbegin', n.outerHTML); }, /numa página que não é do livro-razão/],
  ['unidade de linha alheia à tabela', (r) => r.querySelector('thead [data-linha-campo="unit"]').setAttribute('data-linha-claim', 'ganho-medio-mensal-2024'), /numa página que não é do livro-razão/],
];
try {
  for (const [nome, muda, mordida] of casos) {
    const root = parse(antes);
    if (muda) muda(root);
    fs.writeFileSync(ficheiro, muda ? root.toString() : antes);
    const r = spawnSync(process.execPath, ['scripts/gate-html.mjs'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const saida = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const queixa = mordida ? saida.split('\n').find((l) => mordida.test(l))?.trim() : null;
    const passou = r.status === (mordida ? 1 : 0) && (!mordida || !!queixa);
    resultados.push({ nome, codigo: r.status, passou, queixa: queixa ?? null });
    if (!passou) console.log(saida.slice(-3500));
    assert.ok(passou, nome);
  }
} finally {
  fs.writeFileSync(ficheiro, antes);
  const reposto = sha(fs.readFileSync(ficheiro)) === sha(antes);
  fs.writeFileSync(`${pasta}/plantas-${n1d ? 'n1d' : 'n1c'}-portao.json`, JSON.stringify({ cabeca, construcao, resultados, reposto }, null, 2) + '\n');
}
console.log(`N1c: ${resultados.length} provas do portão de HTML.`);
