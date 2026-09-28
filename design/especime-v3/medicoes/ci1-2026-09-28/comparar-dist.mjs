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
 * OS MANIFESTOS (passagem CI1b, 28.09.2026, achado 8 da leitura a frio). Uma
 * construção cabe num manifesto: o caminho e o sha256 de cada ficheiro, e os
 * dois ficheiros do carimbo por inteiro, num JSON comprimido. O guião compara
 * tanto duas pastas como dois manifestos (ou uma de cada), pela mesma função,
 * e é assim que outra pessoa refaz a conta sem esta máquina: os manifestos das
 * construções comparadas ficam nas provas do bloco. Ao ler um manifesto, o
 * guião confere que o sha256 de cada ficheiro do carimbo guardado é o que o
 * próprio manifesto diz dele, e recusa um manifesto que não bata consigo.
 *
 * Uso: node comparar-dist.mjs <dist ou manifesto antes> <dist ou manifesto depois> [--json <ficheiro>]
 *      node comparar-dist.mjs --manifesto <dist> <saida.json.gz>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

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
/**
 * O manifesto de uma construção: o caminho e o sha256 de cada ficheiro, e os
 * ficheiros do carimbo por inteiro.
 * @param {string} dist
 */
export function manifestoDe(dist) {
  const r = resumos(dist);
  const carimbo = {};
  for (const k of Object.keys(CARIMBO)) if (r.has(k)) carimbo[k] = fs.readFileSync(path.join(dist, k), 'utf8');
  const versao = carimbo['version.json'] ? JSON.parse(carimbo['version.json']) : {};
  return {
    formato: 1,
    o_que: 'o manifesto de uma construção do sítio: o caminho e o sha256 de cada ficheiro de dist/, e os ficheiros do carimbo por inteiro (bloco CI1)',
    commit: versao.commit ?? null,
    construido_em: versao.construido_em ?? null,
    ficheiros: [...r.entries()].sort((x, y) => (x[0] < y[0] ? -1 : 1)),
    carimbo,
  };
}

/** Lê um manifesto guardado e confere que o carimbo guardado é o que ele diz. @param {string} f */
export function leManifesto(f) {
  const m = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)).toString('utf8'));
  const r = new Map(m.ficheiros);
  for (const [k, texto] of Object.entries(m.carimbo ?? {})) {
    const h = crypto.createHash('sha256').update(Buffer.from(texto, 'utf8')).digest('hex');
    if (r.get(k) !== h) throw new Error(`o manifesto ${path.basename(f)} não bate consigo: o ${k} guardado tem outro sha256`);
  }
  return m;
}

/** Uma construção, de uma pasta ou de um manifesto: os resumos e o texto do carimbo. @param {string} x */
function construcao(x) {
  if (fs.statSync(x).isDirectory()) {
    return { resumos: resumos(x), carimbo: (k) => fs.readFileSync(path.join(x, k), 'utf8') };
  }
  const m = leManifesto(x);
  return { resumos: new Map(m.ficheiros), carimbo: (k) => m.carimbo[k] };
}

export function compara(a, b) {
  const ca = construcao(a);
  const cb = construcao(b);
  const ra = ca.resumos;
  const rb = cb.resumos;
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
    const ja = JSON.parse(ca.carimbo(k));
    const jb = JSON.parse(cb.carimbo(k));
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

/** O dia UTC da construção, lido do carimbo, numa pasta ou num manifesto. */
function diaDe(x) {
  try {
    return String(JSON.parse(construcao(x).carimbo('version.json')).construido_em).slice(0, 10);
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
    /* E pelos manifestos: a mesma conta, lida de dois manifestos guardados, dá o mesmo. */
    const ma = path.join(base, 'a.manifesto.json.gz');
    const mb = path.join(base, 'b.manifesto.json.gz');
    fs.writeFileSync(ma, zlib.gzipSync(JSON.stringify(manifestoDe(a))));
    fs.writeFileSync(mb, zlib.gzipSync(JSON.stringify(manifestoDe(b))));
    const r3 = compara(ma, mb);
    const ok3 = JSON.stringify(r3) === JSON.stringify(r2);
    /* E um manifesto que não bate consigo é recusado. */
    const estragado = JSON.parse(zlib.gunzipSync(fs.readFileSync(mb)).toString('utf8'));
    estragado.carimbo['version.json'] = estragado.carimbo['version.json'].replace('OUTRO', 'OUTRA');
    fs.writeFileSync(mb, zlib.gzipSync(JSON.stringify(estragado)));
    let recusado = false;
    try {
      compara(ma, mb);
    } catch (e) {
      recusado = /não bate consigo/.test(String(e.message));
    }
    return { ok: ok && ok2 && ok3 && recusado, visto: { byte_trocado: r.diferentes, so_antes: r.soAntes, so_depois: r.soDepois, carimbo: r.carimbo.length, fora_do_carimbo: r2.diferentes, pelos_manifestos_igual: ok3, manifesto_incoerente_recusado: recusado } };
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
}

const principal = path.resolve(process.argv[1] ?? '') === path.resolve(new URL(import.meta.url).pathname);
if (principal) {
  const args = process.argv.slice(2);
  if (args[0] === '--manifesto') {
    const [, dist, destino] = args;
    if (!dist || !destino) {
      console.error('uso: node comparar-dist.mjs --manifesto <dist> <saida.json.gz>');
      process.exit(2);
    }
    const m = manifestoDe(dist);
    const bytes = zlib.gzipSync(Buffer.from(JSON.stringify(m) + '\n'), { level: 9 });
    fs.writeFileSync(destino, bytes);
    leManifesto(destino);
    console.log(`manifesto de ${m.ficheiros.length} ficheiros (commit ${m.commit}, ${m.construido_em}) · ${bytes.length} bytes · sha256 ${crypto.createHash('sha256').update(bytes).digest('hex')}`);
    process.exit(0);
  }
  const j = args.indexOf('--json');
  const saida = j >= 0 ? args[j + 1] : null;
  const [antes, depois] = args.filter((x, i) => j < 0 || (i !== j && i !== j + 1));
  if (!antes || !depois) {
    console.error('uso: node comparar-dist.mjs <dist ou manifesto antes> <dist ou manifesto depois> [--json <ficheiro>]');
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
  console.log(`conhecido-positivo: visto (um byte trocado, um ficheiro a mais, um a menos, um campo fora do carimbo, a mesma conta pelos manifestos, e um manifesto que não bate consigo recusado)`);
  console.log(`dia UTC das duas construções: ${dias.antes}`);
  console.log(`ficheiros: ${r.ficheiros_antes} antes, ${r.ficheiros_depois} depois`);
  console.log(`diferenças fora do carimbo: ${diferencas}`);
  for (const k of [...r.soAntes.map((x) => `só antes: ${x}`), ...r.soDepois.map((x) => `só depois: ${x}`), ...r.diferentes.map((x) => `diferente: ${x}`)].slice(0, 40)) console.log(`  ${k}`);
  for (const c of r.carimbo) console.log(`  carimbo · ${c.ficheiro} · ${c.campo}: ${JSON.stringify(c.antes)} → ${JSON.stringify(c.depois)}`);
  process.exit(diferencas === 0 ? 0 : 1);
}
