#!/usr/bin/env node
/**
 * A PROVA BYTE A BYTE DO BLOCO CI1 (28.09.2026). Compara duas construções do
 * sítio, ficheiro a ficheiro, pelo sha256 de cada um, e sai com 1 se houver
 * uma diferença fora do carimbo.
 *
 * O CARIMBO compara-se à parte e diz-se. A construção escreve de propósito a
 * hora e o commit em dois ficheiros: `version.json` (scripts/stamp-version.mjs)
 * e `prova.json` (scripts/gate-html.mjs, que os lê do primeiro). Nesses dois,
 * e só neles, os campos `commit`, `ref` e `construido_em` saem da comparação
 * de bytes e comparam-se um a um, com o valor de cada lado escrito na saída;
 * o resto de cada um compara-se campo a campo, e uma diferença nesse resto é
 * uma diferença como outra qualquer.
 *
 * O DIA. A construção conta dias até hoje (src/lib/prova.mjs,
 * `estadoDaVerificacao` e `estadoDasFontes`, em UTC): duas construções de dias
 * diferentes podem diferir sem nenhuma mudança de código. O guião lê o dia de
 * cada uma no `construido_em` e recusa a comparação se não for o mesmo.
 *
 * O CONHECIDO-POSITIVO corre primeiro, sobre uma cópia pequena feita aqui:
 * um byte trocado num ficheiro, um ficheiro a mais e um a menos têm de ser
 * vistos, e o carimbo trocado não pode contar como diferença. Se não forem, o
 * guião sai com 2 antes de comparar o que interessa.
 *
 * Uso: node comparar-dist.mjs <dist-antes> <dist-depois> [--json <ficheiro>]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export const CARIMBO = { 'version.json': ['commit', 'ref', 'construido_em'], 'prova.json': ['commit', 'construido_em'] };

/** @param {string} raiz @returns {Map<string, string>} caminho relativo → sha256 */
export function resumos(raiz) {
  const mapa = new Map();
  /** @param {string} dir */
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.isFile()) {
        mapa.set(path.relative(raiz, p).split(path.sep).join('/'), crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
      } else if (e.isSymbolicLink()) {
        mapa.set(path.relative(raiz, p).split(path.sep).join('/'), `ligacao:${fs.readlinkSync(p)}`);
      }
    }
  };
  anda(raiz);
  return mapa;
}

/** @param {string} a @param {string} b */
export function compara(a, b) {
  const ra = resumos(a);
  const rb = resumos(b);
  const soAntes = [...ra.keys()].filter((k) => !rb.has(k)).sort();
  const soDepois = [...rb.keys()].filter((k) => !ra.has(k)).sort();
  const diferentes = [];
  const carimbo = [];
  for (const [k, h] of ra) {
    if (!rb.has(k) || rb.get(k) === h) continue;
    const campos = CARIMBO[k];
    if (!campos) {
      diferentes.push(k);
      continue;
    }
    const ja = JSON.parse(fs.readFileSync(path.join(a, k), 'utf8'));
    const jb = JSON.parse(fs.readFileSync(path.join(b, k), 'utf8'));
    for (const c of campos) {
      if (JSON.stringify(ja[c]) !== JSON.stringify(jb[c])) carimbo.push({ ficheiro: k, campo: c, antes: ja[c] ?? null, depois: jb[c] ?? null });
      delete ja[c];
      delete jb[c];
    }
    if (JSON.stringify(ja) !== JSON.stringify(jb)) diferentes.push(`${k} (fora do carimbo)`);
  }
  /* O carimbo que é igual dos dois lados também se diz, para a saída mostrar o que se comparou. */
  return { ficheiros_antes: ra.size, ficheiros_depois: rb.size, soAntes, soDepois, diferentes, carimbo };
}

/** O dia UTC da construção, lido do carimbo. */
function diaDe(dist) {
  try {
    return String(JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).construido_em).slice(0, 10);
  } catch {
    return null;
  }
}

function conhecidoPositivo() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-ci1-comparar-'));
  try {
    const a = path.join(base, 'a');
    const b = path.join(base, 'b');
    for (const d of [a, b]) {
      fs.mkdirSync(path.join(d, 'x'), { recursive: true });
      fs.writeFileSync(path.join(d, 'x', 'index.html'), '<p>1 234</p>\n');
      fs.writeFileSync(path.join(d, 'igual.css'), 'p{}\n');
    }
    fs.writeFileSync(path.join(a, 'version.json'), JSON.stringify({ commit: 'a', ref: 'r', env: 'local', construido_em: '2026-09-28T10:00:00Z' }));
    fs.writeFileSync(path.join(b, 'version.json'), JSON.stringify({ commit: 'b', ref: 'r', env: 'local', construido_em: '2026-09-28T11:00:00Z' }));
    fs.writeFileSync(path.join(a, 'so-antes.txt'), 'a');
    fs.writeFileSync(path.join(b, 'so-depois.txt'), 'b');
    fs.writeFileSync(path.join(b, 'x', 'index.html'), '<p>1 235</p>\n');
    const r = compara(a, b);
    const ok =
      r.diferentes.length === 1 && r.diferentes[0] === 'x/index.html' &&
      r.soAntes.join() === 'so-antes.txt' && r.soDepois.join() === 'so-depois.txt' &&
      r.carimbo.length === 2 && r.carimbo.every((c) => c.ficheiro === 'version.json');
    /* E o carimbo não esconde o resto do ficheiro: um campo fora do carimbo trocado conta. */
    fs.writeFileSync(path.join(b, 'version.json'), JSON.stringify({ commit: 'b', ref: 'r', env: 'OUTRO', construido_em: '2026-09-28T11:00:00Z' }));
    const r2 = compara(a, b);
    const ok2 = r2.diferentes.includes('version.json (fora do carimbo)');
    return { ok: ok && ok2, visto: { byte_trocado: r.diferentes, so_antes: r.soAntes, so_depois: r.soDepois, carimbo: r.carimbo.length, fora_do_carimbo: r2.diferentes } };
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
}

const principal = path.resolve(process.argv[1] ?? '') === path.resolve(new URL(import.meta.url).pathname);
if (principal) {
  const args = process.argv.slice(2);
  const j = args.indexOf('--json');
  const saida = j >= 0 ? args[j + 1] : null;
  const [antes, depois] = args.filter((x, i) => x !== '--json' && i !== j + 1);
  if (!antes || !depois) {
    console.error('uso: node comparar-dist.mjs <dist-antes> <dist-depois> [--json <ficheiro>]');
    process.exit(2);
  }
  const cp = conhecidoPositivo();
  if (!cp.ok) {
    console.error('o conhecido-positivo da comparação falhou:', JSON.stringify(cp.visto));
    process.exit(2);
  }
  const dias = { antes: diaDe(antes), depois: diaDe(depois) };
  if (!dias.antes || dias.antes !== dias.depois) {
    console.error(`as duas construções não são do mesmo dia UTC (${dias.antes} e ${dias.depois}): a construção conta dias até hoje, e a comparação não prova nada.`);
    process.exit(2);
  }
  const r = compara(antes, depois);
  const diferencas = r.soAntes.length + r.soDepois.length + r.diferentes.length;
  const relatorio = {
    conhecido_positivo: cp,
    dia_utc: dias.antes,
    ficheiros_antes: r.ficheiros_antes,
    ficheiros_depois: r.ficheiros_depois,
    so_antes: r.soAntes,
    so_depois: r.soDepois,
    diferentes: r.diferentes,
    diferencas,
    carimbo: r.carimbo,
  };
  if (saida) fs.writeFileSync(saida, JSON.stringify(relatorio, null, 1) + '\n');
  console.log(`conhecido-positivo: visto (um byte trocado, um ficheiro a mais, um a menos, um campo fora do carimbo)`);
  console.log(`dia UTC das duas construções: ${dias.antes}`);
  console.log(`ficheiros: ${r.ficheiros_antes} antes, ${r.ficheiros_depois} depois`);
  console.log(`diferenças fora do carimbo: ${diferencas}`);
  for (const k of [...r.soAntes.map((x) => `só antes: ${x}`), ...r.soDepois.map((x) => `só depois: ${x}`), ...r.diferentes.map((x) => `diferente: ${x}`)].slice(0, 40)) console.log(`  ${k}`);
  for (const c of r.carimbo) console.log(`  carimbo · ${c.ficheiro} · ${c.campo}: ${JSON.stringify(c.antes)} → ${JSON.stringify(c.depois)}`);
  process.exit(diferencas === 0 ? 0 : 1);
}
