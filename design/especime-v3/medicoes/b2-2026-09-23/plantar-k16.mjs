#!/usr/bin/env node
/** B2, segunda passagem de correção: as plantas da K16 ao nível do portão.
 *
 *   node design/especime-v3/medicoes/b2-2026-09-23/plantar-k16.mjs
 *
 * As dez plantas da K16 dentro do `check:cartao --prova` correm em memória. Estas
 * três estragam um ficheiro verdadeiro (a declaração das perguntas ou a
 * auditoria), correm o portão sozinho (`node tests/cartao/cartao.mjs`, a corrida
 * normal, sobre o `dist/` construído), exigem o código 1 com a falha esperada, e
 * repõem os bytes num `finally`, conferidos por sha256. Uma corrida limpa antes e
 * outra depois exigem o código 0. Escreve `plantas-k16.json` e um registo por
 * planta. Não se corre com outro portão a ler o `dist/`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const sha = (s) => createHash('sha256').update(s).digest('hex');
const COMANDO = ['tests/cartao/cartao.mjs'];

function corre() {
  const r = spawnSync(process.execPath, COMANDO, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { codigo: r.status, saida: r.stdout + r.stderr };
}

const registos = [];
function limpa(nome) {
  const r = corre();
  fs.writeFileSync(path.join(AQUI, `planta-${nome}.log`), r.saida);
  registos.push({ grupo: 'k16', nome, comando: `node ${COMANDO.join(' ')}`, codigo: r.codigo, passou: r.codigo === 0 });
  if (r.codigo !== 0) throw Error(`${nome}: a corrida limpa saiu com ${r.codigo}; ver planta-${nome}.log`);
}

function planta(nome, relativo, velho, novo, mordida) {
  const ficheiro = path.join(RAIZ, relativo);
  const original = fs.readFileSync(ficheiro, 'utf8');
  if (original.split(velho).length !== 2) throw Error(`${nome}: o trecho a estragar não aparece uma vez só em ${relativo}`);
  let r;
  try {
    fs.writeFileSync(ficheiro, original.replace(velho, novo));
    r = corre();
  } finally {
    fs.writeFileSync(ficheiro, original);
  }
  fs.writeFileSync(path.join(AQUI, `planta-${nome}.log`), r.saida);
  const reposto = sha(fs.readFileSync(ficheiro, 'utf8'));
  const passou = r.codigo === 1 && mordida.test(r.saida) && reposto === sha(original);
  registos.push({ grupo: 'k16', nome, ficheiro: relativo, comando: `node ${COMANDO.join(' ')}`, codigo: r.codigo,
    mordida: mordida.source, passou, antes: sha(original), reposto });
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}: código ${r.codigo}`);
  if (!passou) throw Error(`${nome}: a planta não mordeu como devia; ver planta-${nome}.log`);
}

try {
  limpa('k16-limpa-antes');
  planta('k16-origem-selada-tirada', 'src/data/figuras.mjs',
    "origens: ['glossario-longa-duracao', 'eurostat-tesem130-denominador'],",
    "origens: ['glossario-longa-duracao'],",
    /K16 · desemprego-de-longa-duracao-2025: .*que a pergunta não declara como origem/);
  planta('k16-pedaco-sem-apoio', 'tests/cartao/perguntas-provadas.json',
    '"literal": "People are included only once even if they are in more than one of the situations mentioned above."',
    '"literal": "People are counted twice."',
    /K16 · risco-de-pobreza-ou-exclusao-2025: o pedaço 5 .*que não está no campo «excerto» da origem «glossario-arope»/);
  planta('k16-selo-sem-sha256', 'src/data/figuras.mjs',
    "sha256: '9725aedecbf8e88ebb529e092ca78be2369f3d138eec2c0f2fa251a109ac221b',",
    "sha256: '',",
    /K16 · origem «eurostat-tesem130-denominador»: o selo não diz o sha256/);
  limpa('k16-limpa-depois');
} finally {
  fs.writeFileSync(path.join(AQUI, 'plantas-k16.json'), JSON.stringify(registos, null, 2) + '\n');
}
console.log(`${registos.filter((x) => x.codigo !== 0).length} plantas da K16 mordidas; os bytes repostos conferidos.`);
