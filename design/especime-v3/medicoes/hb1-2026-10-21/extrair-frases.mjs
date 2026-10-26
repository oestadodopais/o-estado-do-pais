/** HB1-b: extrai a prosa das páginas construídas e localiza o primeiro uso das siglas. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {conferirSiglasHb1} from '../../../../scripts/siglas-hb1.mjs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {parse} = createRequire(path.resolve('package.json'))('node-html-parser');
const destino = process.argv[2];
assert(destino, 'indique o ficheiro de saída');
const slug = 'a-casa-em-portugal-e-na-europa';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const normalizar = s => s.replace(/\s+/g, ' ').trim();
const argumentoCabeca = process.argv.indexOf('--cabeca');
const cabecaEsperada = argumentoCabeca < 0 ? null : process.argv[argumentoCabeca + 1];
const resultado = {
  codigo: 0,
  cabeca: JSON.parse(fs.readFileSync('dist/version.json')).commit,
  criterio: 'Prosa extraída por textContent; apenas .src-chip e .vh excluídos da comparação. Espaços normalizados só na comparação, nunca nos textos guardados. Blocos numerados como data-registo-bloco, a partir de zero.',
  edicoes: {},
};
if (cabecaEsperada) assert.equal(resultado.cabeca, cabecaEsperada, 'dist de outra cabeça');
for (const lingua of ['pt', 'en']) {
  const base = lingua === 'pt' ? `/estudos/${slug}` : `/en/studies/${slug}`;
  const rota = base + (lingua === 'pt' ? '/documento' : '/document');
  const documentoBytes = fs.readFileSync(`dist${rota}/index.html`);
  const estudoBytes = fs.readFileSync(`dist${base}/index.html`);
  const documento = parse(documentoBytes.toString()), estudo = parse(estudoBytes.toString());
  const elementos = documento.querySelector('main').childNodes.filter(n => n.tagName);
  const frases = elementos.map(n => n.textContent);
  const blocos = estudo.querySelectorAll('[data-registo-bloco]').map(n => {
    const copia = parse(n.outerHTML);
    for (const elemento of copia.querySelectorAll('.src-chip,.vh')) elemento.remove();
    return {bloco: Number(n.getAttribute('data-registo-bloco')), texto: copia.textContent, texto_com_selos: n.textContent};
  });
  assert(frases.length > 0);
  assert.equal(blocos.length, frases.length);
  assert.equal(new Set(blocos.map(b => b.bloco)).size, frases.length);
  for (const b of blocos) assert.equal(normalizar(b.texto), normalizar(frases[b.bloco]), `${lingua}: bloco ${b.bloco}`);
  assert.equal(frases[2], lingua === 'pt' ? 'Em resumo' : 'In brief', 'abertura divergente');
  const inicioConclusoes = frases.indexOf(lingua === 'pt' ? 'O que este projeto conclui' : 'What this project concludes');
  assert(inicioConclusoes >= 0, 'cabeçalho das conclusões ausente');
  const conclusoes = Array.from({length: 7}, (_, i) => {
    const numero = i + 1, bloco = inicioConclusoes + numero, elemento = elementos[bloco];
    assert.equal(elemento.tagName, 'P', `${lingua}: conclusão ${numero} não é parágrafo`);
    assert(elemento.textContent.startsWith(`${numero}. `), `${lingua}: falta o número da conclusão ${numero}`);
    const forte = elemento.querySelector('strong');
    assert(forte?.textContent, `${lingua}: falta a cabeça a negrito da conclusão ${numero}`);
    return {numero, bloco, cabeca: forte.textContent};
  });
  const siglas = conferirSiglasHb1(frases, lingua);
  resultado.edicoes[lingua] = {
    estudo: base, documento: rota,
    estudo_sha256: sha(estudoBytes), documento_sha256: sha(documentoBytes),
    documento_blocos: frases, estudo_blocos: blocos, siglas, conclusoes,
    comparacao: {blocos: frases.length, diferencas: 0},
  };
}
fs.writeFileSync(destino, JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify({codigo: resultado.codigo, cabeca: resultado.cabeca, edicoes: Object.fromEntries(Object.entries(resultado.edicoes).map(([l,e]) => [l,{...e.comparacao,siglas:e.siglas.length}]))}));
