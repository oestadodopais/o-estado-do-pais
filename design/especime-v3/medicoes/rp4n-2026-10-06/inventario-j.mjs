/** RP4-n-j: pelo padrão do inventario.mjs do JD1, lê a contagem no HTML. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';

const ficheiro = 'design/especime-v3/INVENTARIO-FRASES.md';
const revisoes = 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';
const pasta = 'design/especime-v3/medicoes/rp4n-2026-10-06/j';
const razao = 'a fusão do JD1 e do RP4-n mudou a contagem';
const escrever = process.argv.includes('--write');
let inventario = fs.readFileSync(ficheiro, 'utf8');
const retiradas = [];
inventario = inventario.split('\n').map((linha, i) => {
  const c = linha.split(' | ');
  if (c.length < 5 || !['k2', 'rp4ne'].includes(c[2]) ||
      !/^[\d\s]+ (afirmações|claims) · /.test(c[1])) return linha;
  if (c[3] === 'retirada' && !c[4].includes(razao)) return linha;
  assert.ok(['viva', 'retirada'].includes(c[3]));
  if (c[3] === 'retirada') assert.ok(c[4].includes(razao));
  retiradas.push({linha: i + 1, texto: c[1], bloco: c[2], estado: 'retirada', razao});
  if (!escrever) assert.equal(c[3], 'retirada');
  return `${c[0]} | ${c[1]} | ${c[2]} | retirada | ${razao}. |`;
}).join('\n');
assert.equal(retiradas.length, 4, 'As quatro contagens anteriores têm de existir.');
const novas = [];
for (const html of ['dist/livro-razao/index.html', 'dist/en/ledger/index.html']) {
  const bytes = fs.readFileSync(html);
  const elementos = parse(bytes.toString()).querySelectorAll('p.livro-contas');
  assert.equal(elementos.length, 1);
  const texto = elementos[0].textContent.trim().replace(/\s+/g, ' ');
  assert.ok(!retiradas.some(r => r.texto.replace(/\s+/g, ' ') === texto));
  const linha = `| conteudo | ${texto} | rp4nj | viva | Contagem lida do HTML construído após a fusão do JD1 e do RP4-n. |`;
  novas.push({html, sha256: createHash('sha256').update(bytes).digest('hex'), texto, declaracao: linha});
}
if (!inventario.includes('\n## RP4-n-j: contagem após a integração\n')) {
  assert.ok(escrever, 'Falta a secção RP4-n-j.');
  inventario += '\n## RP4-n-j: contagem após a integração\n\n| classe | texto | bloco | estado | razão |\n|---|---|---|---|---|\n' + novas.map(n => n.declaracao).join('\n') + '\n';
}
for (const n of novas) assert.ok(inventario.includes(n.declaracao), 'A contagem nova diverge do HTML.');
if (escrever) {
  fs.writeFileSync(ficheiro, inventario);
  const rev = fs.readFileSync(revisoes, 'utf8');
  const linha = `| rp4nj | ${novas.length} cadeias novas, ${retiradas.length} retiradas | por ler | Contagens lidas do HTML pelo inventario-j.mjs; ${razao}. |`;
  if (!rev.includes('| rp4nj |')) fs.appendFileSync(revisoes, '\n' + linha + '\n');
  fs.mkdirSync(pasta, {recursive: true});
  fs.writeFileSync(`${pasta}/inventario.json`, JSON.stringify({versao: JSON.parse(fs.readFileSync('dist/version.json')), retiradas, novas}, null, 2) + '\n');
}
console.log(`RP4-n-j: ${retiradas.length} contagens retiradas e ${novas.length} novas, lidas no HTML.`);
