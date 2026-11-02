/** A prova protege todos os bytes fora de verifications, nos dois leitores. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { confereFicheirosNaOrigem } from '../../scripts/check-cruzamento.mjs';
import { projecaoLinha } from '../../src/lib/projecao-linha.mjs';

const raiz = fileURLToPath(new URL('../../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const prova = JSON.parse(fs.readFileSync(new URL('../../ledger/provas/hb1/series.json', import.meta.url)));
const python = raw => {
  const r = spawnSync('python3', ['-c',
    'import sys; sys.path.insert(0,"scripts"); from projecao_linha import projecao_linha; sys.stdout.buffer.write(projecao_linha(sys.stdin.buffer.read()))'],
  { cwd: raiz, input: raw, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  assert.equal(r.status, 0, r.stderr?.toString());
  return r.stdout;
};

// Oráculos literais: o campo seguinte, os comentários anteriores, CRLF e o
// último byte são protegidos. Uma chave aninhada não inicia nem termina o bloco.
for (const [entrada, esperado] of [
  ['value: "1"\n', 'value: "1"\n'],
  ['value: "1"\n# história\nverifications:\n  - result: igual\n', 'value: "1"\n# história\n'],
  ['verifications: []\nsource_url: "https://example.invalid"\n', 'source_url: "https://example.invalid"\n'],
  ['value: "1"\r\nverifications:\r\n  - found: "2"\r\nsource_url: "a"', 'value: "1"\r\nsource_url: "a"'],
  ['document:\n  verifications: []\nvalue: "1"', 'document:\n  verifications: []\nvalue: "1"'],
  ['verifications:\n- result: igual\n"source_url": "a"\n', '"source_url": "a"\n'],
]) {
  const raw = Buffer.from(entrada);
  assert.deepEqual(projecaoLinha(raw), Buffer.from(esperado));
  assert.deepEqual(python(raw), Buffer.from(esperado));
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pai1-projecao-'));
try {
  const ledger = path.join(tmp, 'ledger');
  for (const dir of ['claims', 'cruzamentos', 'provas/hb1']) fs.mkdirSync(path.join(ledger, dir), { recursive: true });
  fs.writeFileSync(path.join(ledger, 'provas/hb1/series.json'), JSON.stringify(prova));
  for (const [id, r] of Object.entries(prova.rows)) {
    const raw = fs.readFileSync(path.join(raiz, r.file));
    assert.deepEqual(python(raw), projecaoLinha(raw), id + ': Python e JavaScript');
    assert.equal(sha(projecaoLinha(raw)), r.sha256, id + ': prova');
    fs.writeFileSync(path.join(ledger, 'claims', id + '.yml'), raw);
  }
  const resolver = new URL('../../src/lib/cruzamento.mjs', import.meta.url).href;
  const conferir = () => spawnSync(process.execPath, ['--input-type=module', '-e',
    `import {linhaDoSitioDoEstudo} from ${JSON.stringify(resolver)};
     import assert from 'node:assert/strict';
     const resolver=linhaDoSitioDoEstudo(${JSON.stringify(prova.rh_study)});
     for (const id of ${JSON.stringify(Object.keys(prova.rows))}) assert.equal(resolver(id),id);`],
  { cwd: tmp, encoding: 'utf8', env: { ...process.env, OEDP_CRUZAMENTOS_DIR: path.join(ledger, 'cruzamentos') } });
  assert.equal(conferir().status, 0, 'controlo original');
  for (const id of Object.keys(prova.rows)) {
    const ficheiro = path.join(ledger, 'claims', id + '.yml');
    const original = fs.readFileSync(ficheiro, 'utf8');
    const entrada = '  - date: "2026-11-02"\n    path: "https://example.invalid/planta"\n    result: "igual"\n    by: "painel-semanal"\n';
    const comReleitura = /^verifications:/m.test(original)
      ? original.replace(/^verifications:[^\n]*\n/m, '$&' + entrada)
      : original + 'verifications:\n' + entrada;
    for (const [nome, alterada, codigo] of [
      ['valor', original.replace(/^value:.*$/m, 'value: "0"'), 1],
      ['fonte', original.replace(/^source_url:.*$/m, 'source_url: "https://example.invalid/planta"'), 1],
      ['releitura', comReleitura, 0],
    ]) {
      assert.notEqual(alterada, original, nome + ': a planta tem de mudar a cópia');
      fs.writeFileSync(ficheiro, alterada);
      const r = conferir();
      assert.equal(r.status, codigo, id + ': ' + nome + '\n' + r.stderr);
      if (codigo) assert.match(r.stderr, /HB1: recompor a série alterada/);
      console.log(`PLANTA ${id}: ${nome}, código ${r.status}`);
      fs.writeFileSync(ficheiro, original);
    }
    // Cada campo de topo fora do histórico continua a afetar o selo.
    for (const m of original.matchAll(/^(?!verifications:)[a-z_]+:.*$/gm)) {
      const alterada = original.slice(0, m.index) + m[0] + ' ' + original.slice(m.index + m[0].length);
      assert.notEqual(sha(projecaoLinha(Buffer.from(alterada))), prova.rows[id].sha256, id + ': ' + m[0].split(':')[0]);
    }
  }
  assert.equal(conferir().status, 0, 'cópias repostas');
  // As duas linhas RP4-n atravessam como ficheiros completos. Executar a
  // conferência real numa árvore isolada também protege esse caminho.
  const copia = path.join(tmp, 'travessia');
  fs.mkdirSync(copia);
  for (const e of fs.readdirSync(raiz)) {
    if (['ledger', 'scripts', '.git'].includes(e)) continue;
    fs.symlinkSync(path.join(raiz, e), path.join(copia, e));
  }
  fs.mkdirSync(path.join(copia, 'scripts'));
  for (const f of ['check-cruzamento.mjs', 'contagem-do-cruzamento.mjs'])
    fs.copyFileSync(path.join(raiz, 'scripts', f), path.join(copia, 'scripts', f));
  fs.mkdirSync(path.join(copia, 'ledger/claims'), { recursive: true });
  for (const e of fs.readdirSync(path.join(raiz, 'ledger'))) {
    if (e === 'claims' || e === 'cruzamentos') continue;
    fs.symlinkSync(path.join(raiz, 'ledger', e), path.join(copia, 'ledger', e));
  }
  fs.cpSync(path.join(raiz,'ledger/cruzamentos'),path.join(copia,'ledger/cruzamentos'),{recursive:true});
  const rp4n = JSON.parse(fs.readFileSync(path.join(raiz, 'ledger/cruzamentos/pensao-rp4n.json')));
  const nomes = Object.entries(rp4n.files).filter(([, r]) => r.destino === 'ledger/claims').map(([nome]) => nome);
  for (const f of fs.readdirSync(path.join(raiz, 'ledger/claims'))) {
    const de = path.join(raiz, 'ledger/claims', f), para = path.join(copia, 'ledger/claims', f);
    if (nomes.includes(f)) fs.copyFileSync(de, para);
    else fs.symlinkSync(de, para);
  }
  const conferirTravessia = () => spawnSync(process.execPath, ['scripts/check-cruzamento.mjs'], { cwd: copia, encoding: 'utf8' });
  const controlo = conferirTravessia();
  assert.equal(controlo.status, 0, controlo.stdout + controlo.stderr);
  for (const nome of nomes) {
    const ficheiro = path.join(copia, 'ledger/claims', nome);
    const original = fs.readFileSync(ficheiro, 'utf8');
    const releitura = 'verifications:\n  - date: "2026-11-02"\n    path: "https://example.invalid/planta"\n    result: "igual"\n    by: "painel-semanal"\n';
    for (const [planta, alterada, codigo] of [
      ['valor', original.replace(/^value:.*$/m, 'value: "0"'), 1],
      ['fonte', original.replace(/^source_url:.*$/m, 'source_url: "https://example.invalid/planta"'), 1],
      ['rótulo', original.replace(/^name:(.*)$/m, 'name:$1 alterado'), 1],
      ['releitura', original.replace(/^verifications:[^\n]*\n(?:[ \t]+[^\n]*\n)*/m, releitura), 0],
    ]) {
      assert.notEqual(alterada, original, nome + ': ' + planta);
      fs.writeFileSync(ficheiro, alterada);
      const r = conferirTravessia();
      assert.equal(r.status, codigo, nome + ': ' + planta + '\n' + r.stdout + r.stderr);
      if (codigo) assert.ok(r.stderr.includes(`[pensao-rp4n.json] ${nome}: os bytes em disco`));
      console.log(`PLANTA ${nome}: ${planta}, código ${r.status}`);
      fs.writeFileSync(ficheiro, original);
    }
  }
  const ficheiroRegisto=path.join(copia,'ledger/cruzamentos/pensao-rp4n.json');
  const integral=structuredClone(rp4n);
  for(const nome of nomes) integral.files[nome].origin_sha256=integral.files[nome].exported_sha256=sha(fs.readFileSync(path.join(copia,'ledger/claims',nome)));
  fs.writeFileSync(ficheiroRegisto,JSON.stringify(integral));
  const legado=conferirTravessia();assert.equal(legado.status,0,legado.stdout+legado.stderr);
  const fIntegral=path.join(copia,'ledger/claims',nomes[0]), bytesIntegrais=fs.readFileSync(fIntegral);
  fs.writeFileSync(fIntegral,bytesIntegrais.toString().replace(/^value:.*$/m,'value: "0"'));
  const legadoAlterado=conferirTravessia();assert.equal(legadoAlterado.status,1);assert.match(legadoAlterado.stderr,/os bytes em disco já não são os que atravessaram/);
  fs.writeFileSync(fIntegral,bytesIntegrais);fs.writeFileSync(ficheiroRegisto,JSON.stringify(rp4n));
  const divergente=structuredClone(rp4n);
  divergente.files[nomes[0]].origin_sha256='0'.repeat(64);
  fs.writeFileSync(ficheiroRegisto,JSON.stringify(divergente));
  const recusada=conferirTravessia();
  assert.equal(recusada.status,1);assert.match(recusada.stderr,/as projeções do motor e do sítio divergem/);
  fs.writeFileSync(ficheiroRegisto,JSON.stringify(rp4n));
  const motor=path.join(tmp,'motor');
  const regs=[{ficheiro:'pensao-rp4n.json',dados:{files:{}}}];
  for(const nome of nomes) {
    const e=rp4n.files[nome], bytes=fs.readFileSync(path.join(raiz,'ledger/claims',nome));
    const f=path.join(motor,e.origin_path);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,bytes);
    for(const digest of [sha(bytes),sha(projecaoLinha(bytes))]) {
      regs[0].dados.files={[nome]:{...e,origin_sha256:digest}};
      const erros=[];confereFicheirosNaOrigem(regs,motor,erros);assert.deepEqual(erros,[]);
    }
    fs.writeFileSync(f,Buffer.from(bytes.toString().replace(/^value:.*$/m,'value: "0"')));
    const erros=[];confereFicheirosNaOrigem(regs,motor,erros);assert.ok(erros.length);
  }
  console.log('RP4-n: rótulo e projeções divergentes recusados; travessia integral e projetada conferidas.');

} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log('HB1: projeção única em Python e JavaScript, quatro linhas e plantas conferidas.');
