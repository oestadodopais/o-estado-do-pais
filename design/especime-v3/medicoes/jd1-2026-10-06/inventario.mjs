/** Relê as contagens no HTML do livro e conserva a classificação da voz. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';

const ficheiro = 'design/especime-v3/INVENTARIO-FRASES.md';
const pasta = 'design/especime-v3/medicoes/jd1-2026-10-06';
let inventario = fs.readFileSync(ficheiro, 'utf8');
const leituras = [];
for (const [html, palavra] of [['dist/livro-razao/index.html', 'afirmações'], ['dist/en/ledger/index.html', 'claims']]) {
  const bytes = fs.readFileSync(html);
  const texto = parse(bytes.toString()).querySelector('p.livro-contas').textContent.trim().replace(/\s+/g, ' ');
  const padrao = new RegExp(`^\\| conteudo \\| [\\d ]+ ${palavra} · .* \\| k2 \\| viva \\|.*$`, 'gm');
  const linhas = [...inventario.matchAll(padrao)];
  assert.equal(linhas.length, 1, 'JD1 inventário: contagem ausente ou ambígua');
  const antes = linhas[0][0];
  const depois = `| conteudo | ${texto} | k2 | viva | JD1: contagem relida no HTML do livro. Mantêm-se a classificação e o formato do K2; mudam apenas as contagens. |`;
  if (process.argv.includes('--write')) inventario = inventario.replace(antes, depois);
  else assert.ok(antes.includes(`| ${texto} |`), 'JD1 inventário: a contagem diverge do HTML');
  leituras.push({ html, sha256: createHash('sha256').update(bytes).digest('hex'), antes, depois });
}
if (process.argv.includes('--write')) {
  fs.writeFileSync(ficheiro, inventario);
  fs.writeFileSync(`${pasta}/inventario.json`, JSON.stringify({ comando: `node ${pasta}/inventario.mjs --write`, leituras }, null, 2) + '\n');
}
const out = process.argv.indexOf('--out');
if (out >= 0) fs.writeFileSync(process.argv[out + 1], JSON.stringify({ leituras }, null, 2) + '\n');
console.log(`JD1 inventário: ${leituras.length} contagens ${process.argv.includes('--write') ? 'escritas' : 'conferidas'}.`);
