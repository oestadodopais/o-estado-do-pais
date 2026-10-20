/** Constrói cópias dos itens pelo Astro e mede o HTML com a régua dos selos. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {build} from 'astro';
import {parse} from 'node-html-parser';
import {unidadesDepoisDoSelo} from './itens.mjs';

export async function plantasDosSelosConstruidos(saida) {
  const temporario = fs.mkdtempSync(path.join(os.tmpdir(), 'v2ed-selos-'));
  try {
    await build({configFile: false, srcDir: './tests/discussao/planta-selos',
      outDir: path.join(temporario, 'dist'), cacheDir: path.join(temporario, 'cache'),
      publicDir: path.join(temporario, 'public'), logLevel: 'silent'});
    const html = fs.readFileSync(path.join(temporario, 'dist/index.html'), 'utf8');
    const root = parse(html), plantas = [], controlos = [];
    for (const caso of root.querySelectorAll('[data-planta]')) {
      const desvios = unidadesDepoisDoSelo(caso);
      const plantada = caso.getAttribute('data-planta') === 'true';
      const linha = caso.getAttribute('data-linha');
      const codigo = desvios.length ? 1 : 0;
      const r = {lang: caso.getAttribute('data-lingua'), unidade: caso.getAttribute('data-unidade'), linha, codigo, desvios};
      if (plantada) {
        assert.equal(codigo, 1, 'A planta não pôs a régua do HTML vermelha');
        assert(desvios.some(d => d.recibo.endsWith('/' + linha)), 'A queixa não corresponde ao valor alterado');
        plantas.push({...r, nome: 'unidade depois do selo, construída dos dados', mordeu: true});
      } else {
        assert.equal(codigo, 0, 'O controlo com sufixo foi recusado');
        controlos.push(r);
      }
    }
    assert.equal(plantas.length, 22);
    assert.equal(controlos.length, 22);
    const r = {html_sha256: createHash('sha256').update(html).digest('hex'), controlos, plantas};
    if (saida) {
      fs.writeFileSync(saida, JSON.stringify(r, null, 2) + '\n');
      fs.writeFileSync(saida.replace(/\.json$/, '.html'), html);
    }
    return r;
  } finally {
    fs.rmSync(temporario, {recursive: true, force: true});
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === '--medir') {
    const desvios = process.argv.slice(3).flatMap(f => unidadesDepoisDoSelo(parse(fs.readFileSync(f, 'utf8'))));
    console.log(JSON.stringify({codigo: desvios.length ? 1 : 0, desvios}));
    process.exitCode = desvios.length ? 1 : 0;
  } else {
    const r = await plantasDosSelosConstruidos(process.argv[2]);
    console.log(`Selos construídos: ${r.plantas.length} plantas vermelhas; ${r.controlos.length} controlos verdes.`);
  }
}
