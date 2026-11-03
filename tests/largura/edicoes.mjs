// LAR1: compara originais, texto e HTML servido, sem alterar a prova existente.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {edicoesGuardadas, sha256} from '../../src/lib/edicoes.mjs';
import {provaDosBytesDaEdicao} from '../../src/lib/leis-da-edicao.mjs';
const [modo, ficheiro, base] = process.argv.slice(2);
assert(['antes','depois'].includes(modo) && ficheiro);
const edicoes = edicoesGuardadas().map(e => {
  const original = fs.readFileSync(e.ficheiro);
  const servido = fs.readFileSync(`dist${e.rota}/index.html`, 'utf8');
  const doc = parse(servido);
  doc.querySelectorAll('script,style').forEach(n => n.remove());
  const prova = provaDosBytesDaEdicao(original.toString('utf8'), servido, e.lang);
  assert.equal(prova, null, e.rota);
  return {rota:e.rota, original:path.basename(e.ficheiro), original_sha256:sha256(original), html_sha256:sha256(servido), texto_sha256:sha256(doc.querySelector('body').text), prova_dos_bytes:prova};
});
const pasta = path.dirname(edicoesGuardadas()[0].ficheiro);
const originais = Object.fromEntries(fs.readdirSync(pasta).filter(f=>f.endsWith('.html')).sort().map(f=>[f,sha256(fs.readFileSync(path.join(pasta,f)))]));
const resultado = {edicoes, originais};
if (modo === 'depois') {
  const anterior = JSON.parse(fs.readFileSync(base,'utf8'));
  assert.deepEqual(originais, anterior.originais, 'Os originais mudaram');
  assert.deepEqual(edicoes.map(e=>e.rota), anterior.edicoes.map(e=>e.rota), 'Mudou a lista de edições');
  resultado.comparacao = edicoes.map(e => {
    const a = anterior.edicoes.find(x=>x.rota===e.rota);
    assert.equal(e.original_sha256,a.original_sha256,e.rota);
    assert.equal(e.texto_sha256,a.texto_sha256,e.rota);
    assert.equal(e.prova_dos_bytes,a.prova_dos_bytes,e.rota);
    return {rota:e.rota, html_antes:a.html_sha256, html_depois:e.html_sha256, html_mudou:e.html_sha256!==a.html_sha256, original_sha256:e.original_sha256, original_igual:true, texto_sha256:e.texto_sha256, texto_igual:true, prova_igual:true};
  });
}
fs.mkdirSync(path.dirname(ficheiro),{recursive:true});
fs.writeFileSync(ficheiro,JSON.stringify(resultado,null,2)+'\n');
console.log(`${modo}: ${edicoes.length} edições e ${Object.keys(originais).length} originais conferidos; prova dos bytes válida.`);
