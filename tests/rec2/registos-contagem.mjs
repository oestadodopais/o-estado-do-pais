/** Plantas pela entrada real do portão, com uma travessia temporária. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {WORKS, PUBLISHED_EDITIONS} from '../../src/data/studies.mjs';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rec2-registos-'));
const origem = path.resolve('registos');
const manifesto = JSON.parse(fs.readFileSync(path.join(origem, 'manifest.json'), 'utf8'));
const retirado = WORKS.find(w => w.estado === 'retirado' && manifesto.registos[`${w.slug}/pt`]);
const semEdicao = WORKS.filter(w => w.estado !== 'retirado').flatMap(w =>
  ['pt','en'].filter(lang => !PUBLISHED_EDITIONS.some(e => e.slug === w.slug && e.lang === lang))
    .map(lang => ({slug:w.slug, lang})))[0];
assert(retirado && semEdicao);
function correr(nome, codigo, padrao) {
  fs.writeFileSync(path.join(tmp, 'manifest.json'), JSON.stringify(manifesto));
  const r = spawnSync(process.execPath, ['scripts/gate-html.mjs'], {
    env:{...process.env, OEDP_REGISTOS_DIR:tmp}, encoding:'utf8', maxBuffer:16 * 1024 * 1024,
  });
  assert.equal(r.status, codigo, `${nome}: ${r.stderr.slice(-1500)} ${r.stdout.slice(-1500)}`);
  if(padrao)assert.match(r.stderr + r.stdout, padrao, nome);
  console.log(`REC2 registos: ${nome}: código ${r.status}.`);
}
try {
  for(const d of fs.readdirSync(origem, {withFileTypes:true}))if(d.isDirectory()) {
    if(d.name === retirado.slug)fs.cpSync(path.join(origem, d.name), path.join(tmp, d.name), {recursive:true});
    else fs.symlinkSync(path.join(origem, d.name), path.join(tmp, d.name), 'dir');
  }
  correr('controlo intacto, incluindo os registos retirados', 0);
  // Acrescentar uma figura contável ao retirado não pode mexer nas contagens.
  const ficheiro = path.join(tmp, retirado.slug, 'pt.record.json');
  const bytes = fs.readFileSync(ficheiro);
  const record = JSON.parse(bytes);
  const bloco = record.blocks.find(b => b.kind === 'paragraph');
  assert(bloco);
  bloco.figures ??= [];
  bloco.figures.push({source_sha256:'0'.repeat(64)});
  fs.writeFileSync(ficheiro, JSON.stringify(record));
  correr('figura adicional do retirado continua dispensada', 0);
  fs.writeFileSync(ficheiro, bytes);
  // Usa uma língua real, ausente das edições publicadas deste trabalho.
  const chave = `${semEdicao.slug}/${semEdicao.lang}`;
  const original = Object.keys(manifesto.registos).find(k => PUBLISHED_EDITIONS.some(e => `${e.slug}/${e.lang}` === k));
  manifesto.registos[chave] = structuredClone(manifesto.registos[original]);
  correr(`não retirado sem edição publicada recusado (${chave})`, 1, /REC2 contagem dos registos: .*: trabalho não retirado sem edição publicada/);
} finally {
  fs.rmSync(tmp, {recursive:true, force:true});
}
