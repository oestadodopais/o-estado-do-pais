import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';

// A planta muda apenas o HTML construído e repõe os mesmos bytes no fim.
// O portão e as fontes da página permanecem intactos.
const pasta = path.dirname(new URL(import.meta.url).pathname);
const alvo = 'dist/estudos/evora-2027-prometido-painel-dinheiro/index.html';
const original = fs.readFileSync(alvo);
const resumo = bytes => createHash('sha256').update(bytes).digest('hex');
const portao = 'scripts/check-lugar.mjs';
const portaoAntes = resumo(fs.readFileSync(portao));
const frase = parse(original.toString()).querySelector('.edicoes-frase');
assert.ok(frase, 'A página de referência tem a frase a retirar.');
const htmlDaFrase = frase.toString();
assert.equal(original.toString().split(htmlDaFrase).length, 2);
const correr = nome => {
  const r = spawnSync(process.execPath, [portao], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  fs.writeFileSync(path.join(pasta, `${nome}.txt`), (r.stdout ?? '') + (r.stderr ?? ''));
  return r.status;
};
const prova = { alvo, portao, frase: frase.textContent.trim(), sha256Antes: resumo(original), portaoSha256Antes: portaoAntes, limpa: correr('conflito-limpa-peca1') };
assert.equal(prova.limpa, 0, 'A referência tem de passar antes da planta.');
try {
  const alterado = original.toString().replace(htmlDaFrase, '');
  fs.writeFileSync(alvo, alterado);
  prova.sha256Planta = resumo(fs.readFileSync(alvo));
  prova.planta = correr('conflito-planta-peca1');
  assert.equal(prova.planta, 1, 'Retirar a frase exigida pelo B1 tem de expor o conflito.');
  assert.ok(fs.readFileSync(path.join(pasta, 'conflito-planta-peca1.txt'), 'utf8').includes('0 frase(s) das portas (esperada 1)'));
} finally {
  fs.writeFileSync(alvo, original);
  prova.sha256Reposto = resumo(fs.readFileSync(alvo));
  prova.portaoSha256Depois = resumo(fs.readFileSync(portao));
  fs.writeFileSync(path.join(pasta, 'conflito-peca1.json'), JSON.stringify(prova, null, 2) + '\n');
}
assert.equal(prova.sha256Reposto, prova.sha256Antes);
assert.equal(prova.portaoSha256Depois, portaoAntes);
console.log(JSON.stringify(prova, null, 2));
