/** N1d: o contador dos lugares e os controlos F1 a F3 sobrevivem sem domínios. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/n1-2026-09-30';
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const original = fs.readFileSync('scripts/check-formas.mjs', 'utf8');
const ancora = 'const dominios = slugsDosDominios();';
assert.equal(original.split(ancora).length, 2);
const semDominios = original.replace(ancora, 'const dominios = [];');
const temporario = `scripts/.n1d-formas-${process.pid}.mjs`;
const casos = [
  ['controlo sem domínios', semDominios, null],
  ['lugares ausentes sem domínios', semDominios.replace('contas.paginas_dos_lugares++;', 'contas.paginas_dos_lugares += 0;'), /encontrou 0 página/],
  ['datas ausentes sem domínios', semDominios.replace('if (contas.datas_de_linha === 0)', 'contas.datas_de_linha = 0; if (contas.datas_de_linha === 0)'), /conhecido-positivo da F1 falhou/],
  ['formas ausentes sem domínios', semDominios.replace('if (contas.formas === 0)', 'contas.formas = 0; if (contas.formas === 0)'), /conhecido-positivo da F2 e da F3 falhou/],
];
const resultados = [];
try {
  for (const [nome, codigo, mordida] of casos) {
    fs.writeFileSync(temporario, codigo);
    const r = spawnSync(process.execPath, [temporario], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    const saida = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const queixa = mordida ? saida.split('\n').find((l) => mordida.test(l))?.trim() : null;
    const passou = r.status === (mordida ? 1 : 0) && (!mordida || !!queixa);
    resultados.push({ nome, codigo: r.status, passou, queixa: queixa ?? null });
    if (!passou) console.log(saida.slice(-3500));
    assert.ok(passou, nome);
  }
} finally {
  fs.rmSync(temporario, { force: true });
  assert.equal(fs.readFileSync('scripts/check-formas.mjs', 'utf8'), original);
  fs.writeFileSync(`${pasta}/prova-formas-n1d.json`, JSON.stringify({ cabeca, original_intacto: true, resultados }, null, 2) + '\n');
}
console.log(`N1d: ${resultados.length} provas das formas, com a declaração de domínios vazia.`);
