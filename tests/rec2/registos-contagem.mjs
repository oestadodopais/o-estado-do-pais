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
const publicado = PUBLISHED_EDITIONS.find(e => manifesto.registos[`${e.slug}/${e.lang}`]);
assert(retirado && publicado);
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
  for(const d of fs.readdirSync(origem, {withFileTypes:true}))if(d.isDirectory())fs.symlinkSync(path.join(origem, d.name), path.join(tmp, d.name), 'dir');
  correr('controlo intacto', 0);
  // Uma entrada sem edição publicada só se dispensa pelo estado do trabalho.
  const chaveRetirada = `${retirado.slug}/zz`;
  manifesto.registos[chaveRetirada] = structuredClone(manifesto.registos[`${retirado.slug}/pt`]);
  correr('retirado sem edição publicada continua dispensado', 0);
  delete manifesto.registos[chaveRetirada];
  const chavePublicada = `${publicado.slug}/zz`;
  manifesto.registos[chavePublicada] = structuredClone(manifesto.registos[`${publicado.slug}/${publicado.lang}`]);
  correr('não retirado sem edição publicada recusado', 1, /REC2 contagem dos registos: .*\/zz: trabalho não retirado sem edição publicada/);
  delete manifesto.registos[chavePublicada];
  manifesto.registos['rec2-trabalho-desconhecido/pt'] = structuredClone(manifesto.registos[`${publicado.slug}/${publicado.lang}`]);
  correr('trabalho desconhecido não ganha dispensa', 1, /REC2 contagem dos registos: rec2-trabalho-desconhecido\/pt: trabalho não retirado sem edição publicada/);
} finally {
  fs.rmSync(tmp, {recursive:true, force:true});
}
