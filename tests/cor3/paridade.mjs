/** COR3 C: a base conserva as duas duplicações; a glosa não pode repetir o ano. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {assinatura, conferirParidade} from '../../scripts/check-paridade.mjs';
import {blocosDe, compara} from '../../scripts/paridade-numeros.mjs';

const estudo = 'a-casa-em-portugal-e-na-europa';
const base = JSON.parse(fs.readFileSync('scripts/paridade-excecoes.json', 'utf8'));
const excecoes = {...base, diferencas: base.diferencas.filter(e => e.estudo === estudo)};
assert.equal(excecoes.diferencas.length, 2);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cor3-paridade-'));
const pares = [];
for (const file of [`estudos/${estudo}/index.html`, `estudos/${estudo}/documento/index.html`, `en/studies/${estudo}/index.html`, `en/studies/${estudo}/document/index.html`]) {
  const alvo = path.join(temp, file);
  fs.mkdirSync(path.dirname(alvo), {recursive: true});
  fs.copyFileSync(path.join('dist', file), alvo);
}
const glosa = 'though decided in previous years, still producing additional effects in that year';
try {
  for (const [tipo, pt, en] of [
    ['documento', `estudos/${estudo}/documento/index.html`, `en/studies/${estudo}/document/index.html`],
    ['página', `estudos/${estudo}/index.html`, `en/studies/${estudo}/index.html`],
  ]) {
    const textos = [pt, en].map(file => fs.readFileSync(path.join('dist', file), 'utf8'));
    for (const [i, file] of [pt, en].entries()) {
      const alvo = path.join(temp, file);
      fs.mkdirSync(path.dirname(alvo), {recursive: true});
      fs.writeFileSync(alvo, textos[i]);
    }
    const blocos = textos.map(blocosDe);
    const medida = assinatura(compara(...blocos));
    const prevista = excecoes.diferencas.find(e => e.tipo === tipo).numeros;
    assert.deepEqual(medida, prevista);
    assert.deepEqual(medida.total, {soPt: [], soEn: ['250', '250', '375', '375']});
    assert.equal(medida.blocos.length, 2);
    for (const b of medida.blocos) assert.deepEqual([b.soPt, b.soEn], [[], ['250', '375']]);
    pares.push(medida.blocos.map(b => blocos.map(bs => bs[b.i])));
    assert.equal(textos[1].split(glosa).length - 1, 1);
    const alvo = path.join(temp, en);
    fs.writeFileSync(alvo, textos[1].replace(glosa, glosa.replace('that year', '2027')));
    const recusas = conferirParidade(temp, excecoes).erros.filter(e => e.startsWith(`${estudo}|${tipo}:`));
    assert.equal(recusas.length, 1, `Ano repetido não recusado: ${tipo}`);
    fs.writeFileSync(alvo, textos[1]);
    console.log(`COR3: ano repetido recusado no ${tipo}.`);
  }
  assert.deepEqual(pares[0], pares[1], 'As duplicações têm de ficar nos mesmos pares de blocos.');
  assert.equal(conferirParidade(temp, excecoes).erros.length, 0);
  console.log('COR3: duas duplicações, mesmos pares de blocos, controlo verde e duas plantas recusadas.');
} finally {
  fs.rmSync(temp, {recursive: true, force: true});
}
