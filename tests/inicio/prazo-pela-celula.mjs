/** A E1 pela própria check:pais, sem escrever na construção (H2-c, M-A).
 * Uso: node tests/inicio/prazo-pela-celula.mjs. Corre uma vez no verify.
 * Só copia o carimbo: a data passada e a razão em branco são defeitos da ficha,
 * independentemente da sua marca no HTML. A retirada da chamada E1 numa cópia
 * do guião tem de fazer as mesmas plantas deixar de morder. */
import { inicioDoPasso, fimDoPasso } from '../../scripts/leituras/tempos.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { WORKS } from '../../src/data/studies.mjs';

const tempoDoAutoTeste = inicioDoPasso('auto-teste:pais');
process.once('exit', codigo => fimDoPasso(tempoDoAutoTeste, codigo));

const raiz = process.cwd();
const origem = path.resolve(process.env.OEDP_DIST ?? 'dist');
const guiao = path.join(raiz, 'scripts/check-pais.mjs');
const texto = fs.readFileSync(guiao, 'utf8');
const carimbo = fs.readFileSync(path.join(origem, 'version.json'), 'utf8');
const casos = [];
function conferirCadeiaDoPais(scripts) {
  return scripts['check:pais']?.includes('--so-a-celula-e1-no-autoteste')
    ? ['check:pais: a opção só da E1 não pode entrar na cadeia de produção.'] : [];
}
const scripts = JSON.parse(fs.readFileSync(path.join(raiz, 'package.json'), 'utf8')).scripts;
assert.deepEqual(conferirCadeiaDoPais(scripts), [], 'A cadeia check:pais ficou reduzida à célula E1.');
const cadeiaPlantada = conferirCadeiaDoPais({ ...scripts,
  'check:pais': scripts['check:pais'] + ' --so-a-celula-e1-no-autoteste' });
assert.deepEqual(cadeiaPlantada, ['check:pais: a opção só da E1 não pode entrar na cadeia de produção.']);
casos.push({ nome: 'planta: opção da E1 no package.json', queixas_e1: cadeiaPlantada });
// Os HTML reais só escolhem um estudo comum às duas edições. O ensaio copia
// o carimbo e avança o relógio; a célula E1 confere a ficha declarada, sem HTML.
const primeiras = ['index.html', 'en/index.html'].map(f => parse(fs.readFileSync(path.join(origem, f), 'utf8')));
const comuns = primeiras[0].querySelectorAll('#trabalhos [data-estudo]').map(e => e.getAttribute('data-estudo'))
  .filter(slug => primeiras[1].querySelector(`#trabalhos [data-estudo="${slug}"]`));
const w = WORKS.find(w => w.emCurso && comuns.includes(w.slug)) ?? WORKS.find(w => w.slug === comuns[0]);
assert(w, 'A construção de controlo tem de ter um estudo recente comum às duas edições.');
// A ficha de ensaio existe mesmo quando todas as fichas reais estiverem fechadas.
const estadoDeEnsaio = { razao: 'Ensaio sintético da chamada E1.',
  ate: w.emCurso?.ate ?? new Date(JSON.parse(carimbo).construido_em).toISOString().slice(0, 10) };
const depois = new Date(Date.parse(estadoDeEnsaio.ate) + 86400000).toISOString();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-e1-h2c-'));
const dist = path.join(tmp, 'dist');
const queixas = {
  prazo: `E1: prazo emCurso passado em ${w.slug}`,
  razao: `E1: declaração emCurso incompleta em ${w.slug}: exige razão e data de fim válida.`,
};
function correr(nome, entrada, construidoEm, razaoEmBranco = false) {
  const versao = JSON.parse(carimbo);
  if (construidoEm) versao.construido_em = construidoEm;
  fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify(versao));
  const programa = `import { WORKS } from ${JSON.stringify(pathToFileURL(path.join(raiz, 'src/data/studies.mjs')).href)};
    const w = WORKS.find(w => w.slug === ${JSON.stringify(w.slug)});
    w.emCurso = ${JSON.stringify(estadoDeEnsaio)};
    if (${razaoEmBranco}) w.emCurso.razao = ' \\t ';
    await import(${JSON.stringify(pathToFileURL(entrada).href)});`;
  const r = spawnSync(process.execPath, ['--input-type=module', '--eval', programa, '--', '--so-a-celula-e1-no-autoteste'], {
    cwd: raiz, env: { ...process.env, OEDP_DIST: dist }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  assert.ifError(r.error);
  const saida = r.stdout + r.stderr;
  const e1 = saida.split('\n').filter(l => l.startsWith('E1:'));
  const resultado = { nome, codigo: r.status, queixas_e1: e1 };
  casos.push(resultado);
  return { ...resultado, saida: saida.replaceAll(tmp, '<ensaio>') };
}
try {
  fs.mkdirSync(dist);
  const limpo = correr('controlo: a chamada E1 aceita a ficha limpa', guiao);
  assert.equal(limpo.codigo, 0, limpo.saida);
  assert(limpo.queixas_e1.includes('E1: prazo e razão conferidos pela chamada da check:pais.'), limpo.saida);
  const prazo = correr('planta: prazo passado pela check:pais', guiao, depois);
  assert.equal(prazo.codigo, 1, prazo.saida);
  assert(prazo.queixas_e1.some(l => l.startsWith(queixas.prazo)
    && l.includes('a ficha tem de ser decidida: prolongar a data ou tirar o campo emCurso.')), prazo.saida);
  const razao = correr('planta: razão em branco pela check:pais', guiao, null, true);
  assert.equal(razao.codigo, 1, razao.saida);
  assert(razao.queixas_e1.includes(queixas.razao), razao.saida);

  // Conhecido-positivo da ligação: apagar a chamada numa cópia do guião faz
  // estas mesmas plantas deixarem de morder. A régua deteta precisamente isso.
  const chamada = 'conferirE1();';
  assert.equal(texto.split(chamada).length, 2, 'A chamada E1 desapareceu ou mudou; rever a planta.');
  const semChamada = texto.replace(chamada, '').replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g,
    (_, aspas, rel) => `from ${JSON.stringify(pathToFileURL(path.resolve(path.dirname(guiao), rel)).href)}`);
  const mutante = path.join(tmp, 'check-pais-sem-chamada.mjs');
  fs.writeFileSync(mutante, semChamada);
  fs.symlinkSync(path.join(raiz, 'node_modules'), path.join(tmp, 'node_modules'), 'dir');
  for (const [nome, data, branca] of [['prazo', depois, false], ['razão', null, true]]) {
    const r = correr(`controlo da planta: sem a chamada E1, ${nome} deixa de ser recusado`, mutante, data, branca);
    assert.equal(r.codigo, 0, r.saida);
    assert.equal(r.queixas_e1.length, 0, r.saida);
  }
  const resultado = { comando: 'node tests/inicio/prazo-pela-celula.mjs',
    dist_de_ensaio: 'cópia temporária independente de version.json; só a célula E1',
    casos, conhecido_positivo: { o_que: 'a mesma data passada e a mesma razão em branco passam se a chamada E1 for retirada da cópia do guião', encontrado: true } };
  if (process.env.OEDP_MEDICOES) fs.writeFileSync(path.join(process.env.OEDP_MEDICOES, 'e1-h2c.json'), JSON.stringify(resultado, null, 2) + '\n');
  const corridas = casos.filter(c => Object.hasOwn(c, 'codigo')).length;
  console.log(`H2-c: ${corridas} corridas da célula E1 em cópias temporárias; prazo e razão mordem pela E1; a retirada da chamada é detetada.`);
  for (const r of [prazo, razao]) console.log(`mordeu · ${r.queixas_e1.join(' ')}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
  assert.equal(fs.readFileSync(guiao, 'utf8'), texto);
  assert.equal(fs.readFileSync(path.join(origem, 'version.json'), 'utf8'), carimbo);
}
