/** REC2: retirada das páginas conserva a conferência das fontes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {WORKS} from '../../src/data/studies.mjs';
import {todosOsDocumentos} from '../../src/lib/documentos.mjs';
const retirados = new Set(WORKS.filter(w => w.estado === 'retirado').map(w => w.slug));
assert.equal(todosOsDocumentos().filter(d => retirados.has(d.slug)).length, 20, 'os documentos retirados conservam-se no inventário físico');
const datas = spawnSync(process.execPath, ['scripts/datas-de-publicacao.mjs', '--ver'], {encoding:'utf8'});
assert.equal(datas.status, 0, datas.stderr);
const edicoes = JSON.parse(datas.stdout).edicoes;
assert(edicoes.length > 0);
assert(edicoes.every(e => !retirados.has(e.slug)), 'gerador não repõe datas retiradas');
const manifesto = JSON.parse(fs.readFileSync('registos/manifest.json', 'utf8'));
const chave = Object.keys(manifesto.registos).find(c => retirados.has(c.slice(0, c.lastIndexOf('/'))));
assert(chave);
const [slug, lang] = chave.split('/');
const original = JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`, 'utf8'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rec2-fontes-'));
let plantas = 0;
try {
  const registos = path.join(tmp, 'registos'), dist = path.join(tmp, 'dist');
  fs.mkdirSync(path.join(registos, slug), {recursive:true}); fs.mkdirSync(dist);
  const f = path.join(registos, slug, `${lang}.record.json`);
  fs.writeFileSync(path.join(registos, 'manifest.json'), JSON.stringify({registos:{[chave]:manifesto.registos[chave]}}));
  fs.writeFileSync(f, JSON.stringify(original));
  const correr = () => spawnSync(process.execPath, ['scripts/check-cadeia.mjs'], {encoding:'utf8', env:{...process.env, OEDP_DIST:dist, OEDP_REGISTOS_DIR:registos}});
  const controlo = correr(); assert.equal(controlo.status, 0, controlo.stdout + controlo.stderr);
  const conta = JSON.parse(fs.readFileSync(path.join(dist, 'cadeia.json'), 'utf8'));
  assert.equal(conta.totais.registos_edicoes, 0); assert.deepEqual(conta.por_edicao, {});
  const primeiraFigura = valor => {
    if (!valor || typeof valor !== 'object') return null;
    if (Array.isArray(valor.figures) && valor.figures.length) return valor.figures[0];
    for (const filho of Object.values(valor)) { const figura = primeiraFigura(filho); if (figura) return figura; }
    return null;
  };
  for (const [regra, mudar] of [
    ['C1', figura => { figura.source_sha256 = 'resumo-adulterado'; figura.source_digest_kind = null; }],
    ['C2', figura => { figura.row = null; }],
    ['C4', figura => { figura.printed = 'texto adulterado'; }],
  ]) {
    const alterado = structuredClone(original), figura = primeiraFigura(alterado); assert(figura);
    mudar(figura); fs.writeFileSync(f, JSON.stringify(alterado));
    const r = correr(); assert.equal(r.status, 1); assert.match(r.stdout + r.stderr, new RegExp(regra + ' ')); plantas++;
  }
  fs.writeFileSync(f, JSON.stringify(original));
  const pagina = path.join(dist, lang === 'pt' ? 'estudos' : 'en/studies', slug, 'index.html');
  fs.mkdirSync(path.dirname(pagina), {recursive:true}); fs.writeFileSync(pagina, '<main></main>');
  const reposta = correr(); assert.equal(reposta.status, 1); assert.match(reposta.stdout + reposta.stderr, /retirado com página construída/); plantas++;
  fs.rmSync(pagina);
  const viva = Object.keys(manifesto.registos).find(c => !retirados.has(c.slice(0, c.lastIndexOf('/'))));
  assert(viva);
  const [slugVivo, langVivo] = viva.split('/');
  fs.mkdirSync(path.join(registos, slugVivo), {recursive:true});
  fs.copyFileSync(`registos/${slugVivo}/${langVivo}.record.json`, path.join(registos, slugVivo, `${langVivo}.record.json`));
  fs.writeFileSync(path.join(registos, 'manifest.json'), JSON.stringify({registos:{[viva]:manifesto.registos[viva]}}));
  const ausente = correr(); assert.equal(ausente.status, 1); assert.match(ausente.stdout + ausente.stderr, /não há página de leitura/); plantas++;
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
console.log(`REC2 fontes: ${plantas} plantas recusadas; documentos guardados, datas retiradas e cadeia de fontes preservada.`);
