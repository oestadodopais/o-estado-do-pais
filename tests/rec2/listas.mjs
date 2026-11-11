/** REC2: só a retirada permite saltar entradas históricas, com conta exata. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {WORKS} from '../../src/data/studies.mjs';
import {separarRetirados, conferirSaltadas, lerDocumentos, conferir, recusas, conferirPresenca} from '../../scripts/leituras/conferir-frases.mjs';

const retirados = WORKS.filter(w => w.estado === 'retirado');
assert.equal(retirados.length, 6, 'o mandato retira seis trabalhos');
const slugs = new Set(retirados.map(w => w.slug));
const listas = [
  ['voz2a-2026-11-07/FRASES-VOZ-2A.json', 85],
  ['voz2b-2026-11-07/FRASES-VOZ-2B.json', 53],
  ['coragua-2026-11-08/FRASES-COR-AGUA.json', 32],
  ...['d','g','i','j','prr'].map(s => [`coragua-2026-11-08/FRASES-COR-AGUA-${s}.json`, 0]),
];
let plantas = 0;
for (const [nome, medida] of listas) {
  const historica = JSON.parse(fs.readFileSync('design/especime-v3/medicoes/' + nome, 'utf8'));
  const antes = JSON.stringify(historica);
  const {ativas, saltadas} = separarRetirados(historica);
  assert.equal(saltadas.length, medida);
  assert.equal(saltadas.length, historica.filter(f => slugs.has(f.estudo)).length);
  assert.equal(ativas.length + saltadas.length, historica.length);
  assert(ativas.every(f => !slugs.has(f.estudo)));
  assert.equal(JSON.stringify(historica), antes, 'a lista histórica não se altera');
  assert.throws(() => conferirSaltadas(historica, [...saltadas, {id:'entrada-inventada'}]), /não correspondem/); plantas++;
  if (saltadas.length) { assert.throws(() => conferirSaltadas(historica, saltadas.slice(1)), /não correspondem/); plantas++; }
  console.log(`${nome}: ${saltadas.length} de ${historica.length} entradas saltadas, conta conferida`);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rec2-listas-'));
try {
  const slug = retirados[0].slug, vivo = WORKS.find(w => w.estado !== 'retirado').slug;
  const entrada = (estudo, id) => ({id, estudo, lingua:'pt', paginas:[`/estudos/${estudo}/documento`], classe:'FICA', frase:'A fonte publicou o relatório.'});
  const retirada = entrada(slug, 'retirada'), publicada = entrada(vivo, 'publicada');
  const ficheiroLista = path.join(tmp, 'lista.json');
  const pares = lista => {
    fs.writeFileSync(ficheiroLista, JSON.stringify(lista));
    return spawnSync('node', ['scripts/leituras/conferir-pares.mjs', tmp, ficheiroLista, '2026-11-08'], {encoding:'utf8'});
  };
  assert.equal(pares([retirada]).status, 0, 'pares saltam retirado sem documentos');
  const faltaVivo = pares([publicada]);
  assert.equal(faltaVivo.status, 1); assert.match(faltaVivo.stderr, /não retirado sem documento/); plantas++;
  const semPaginas = lerDocumentos([retirada], tmp);
  assert.deepEqual(semPaginas.documentos, []);
  assert.equal(semPaginas.saltadas.length, 1);
  const r = conferir([retirada], [], new Set());
  assert.equal(r.saltadas.length, 1); assert.equal(recusas(r), 0);
  assert.throws(() => lerDocumentos([publicada], tmp), /estudo sem páginas/); plantas++;
  assert.throws(() => lerDocumentos([retirada, publicada], tmp), /estudo sem páginas/); plantas++;
  const pagina = path.join(tmp, publicada.paginas[0], 'index.html');
  fs.mkdirSync(path.dirname(pagina), {recursive:true});
  fs.writeFileSync(pagina, `<main><p>${publicada.frase}</p></main>`);
  const lista = [retirada, {...publicada, paginas:[...publicada.paginas, ...retirada.paginas]}];
  const antes = JSON.stringify(lista);
  const lidos = lerDocumentos(lista, tmp), selecao = separarRetirados(lista);
  assert.equal(lidos.documentos.length, 1); assert.equal(lidos.saltadas.length, 1);
  assert.deepEqual(selecao.ativas[0].paginas, publicada.paginas);
  assert.deepEqual(conferirPresenca(selecao.ativas, lidos.documentos), []);
  assert.equal(JSON.stringify(lista), antes);
  assert.throws(() => separarRetirados([{...publicada, paginas:retirada.paginas}]), /não retirado sem páginas/); plantas++;
  // Ter sucessor sem estar retirado não dispensa a entrada nem a página.
  const semRetirada = [{slug, sucedidoPor:[{slug:vivo}]}];
  assert.equal(separarRetirados([retirada], semRetirada).saltadas.length, 0);
  assert.throws(() => conferirSaltadas([retirada], [{id:retirada.id}], semRetirada), /não correspondem/); plantas++;
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
console.log(`REC2 listas: ${plantas} plantas recusadas; retirados sem páginas aceites e publicados sem páginas recusados.`);
