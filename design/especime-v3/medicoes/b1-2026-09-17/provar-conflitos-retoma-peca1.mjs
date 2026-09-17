import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

// Provas da forma exigida por células que a retoma não autorizou a mudar.
// Só muda uma peça de HTML de cada vez. Repõe os bytes mesmo se a prova falhar.
const pasta = path.dirname(fileURLToPath(import.meta.url));
const alvo = 'dist/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html';
const portao = 'scripts/gate-html.mjs';
const original = fs.readFileSync(alvo);
const resumo = bytes => createHash('sha256').update(bytes).digest('hex');
const html = original.toString();
const raiz = parse(html);
const artigo = raiz.querySelector('[data-registo-edicao]');
assert.ok(artigo, 'O corpo de referência existe.');
const corpoSha256 = resumo(artigo.toString());
const portaoSha256Antes = resumo(fs.readFileSync(portao));
const casos = [
  {
    nome: 'faixa', celula: 'L5', seletor: '.texto-faixa',
    esperado: 'a página tem 0 marcas data-registo-conta',
    protege: 'As contagens de blocos, figuras e selos são recontadas contra o registo; cada contagem impressa abre o corpo que conta.',
  },
  {
    nome: 'indice', celula: 'L8', seletor: 'nav.texto-indice',
    esperado: 'o índice «Nesta página» tem 0 entradas',
    protege: 'Os títulos do índice, a ordem e os destinos correspondem aos blocos do registo; a posição de cada secção é conferida.',
  },
  {
    nome: 'linhas', celula: 'L6', seletor: '#linhas-do-documento-dobra',
    esperado: 'a página não tem a secção "As linhas deste documento"',
    protege: 'Cada figura sem linha no livro do projeto abre a linha do motor, com valor, impresso e origem conferidos contra o registo.',
  },
];
const correr = nome => {
  const r = spawnSync(process.execPath, [portao], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  assert.equal(r.error, undefined);
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, `retoma-${nome}-peca1.txt`), saida);
  console.log(`${nome}: ${r.status}`);
  return { codigo: r.status, saida };
};
const prova = {
  inicioUTC: new Date().toISOString(), alvo, portao,
  sha256Antes: resumo(original), corpoSha256, portaoSha256Antes,
  limpa: correr('limpa').codigo, casos: [],
};
assert.equal(prova.limpa, 0, 'A referência passa antes das plantas.');
try {
  for (const caso of casos) {
    const nos = raiz.querySelectorAll(caso.seletor);
    assert.equal(nos.length, 1, `${caso.nome}: um único alvo na referência.`);
    const retirado = nos[0].toString();
    assert.equal(html.split(retirado).length, 2);
    const alterado = html.replace(retirado, '');
    const corpoDepois = parse(alterado).querySelector('[data-registo-edicao]');
    assert.equal(resumo(corpoDepois.toString()), corpoSha256, 'O corpo transcrito não muda.');
    fs.writeFileSync(alvo, alterado);
    const corrida = correr(caso.nome);
    const resultado = {
      ...caso, antes: prova.limpa, depois: corrida.codigo,
      sha256Planta: resumo(fs.readFileSync(alvo)),
      corpoSha256Depois: resumo(corpoDepois.toString()),
      alvoRetirado: retirado.slice(0, 700),
      diagnosticos: corrida.saida.split('\n').filter(l => l.includes(caso.esperado)),
    };
    prova.casos.push(resultado);
    assert.equal(corrida.codigo, 1, `${caso.nome}: a retirada tem de ser recusada.`);
    assert.ok(resultado.diagnosticos.length, `${caso.nome}: a célula esperada tem de explicar a recusa.`);
    fs.writeFileSync(alvo, original);
    resultado.sha256Reposto = resumo(fs.readFileSync(alvo));
    assert.equal(resultado.sha256Reposto, prova.sha256Antes);
  }
} finally {
  fs.writeFileSync(alvo, original);
  prova.sha256Reposto = resumo(fs.readFileSync(alvo));
  prova.portaoSha256Depois = resumo(fs.readFileSync(portao));
  prova.fimUTC = new Date().toISOString();
  fs.writeFileSync(path.join(pasta, 'conflitos-retoma-peca1.json'), JSON.stringify(prova, null, 2) + '\n');
}
assert.equal(prova.sha256Reposto, prova.sha256Antes);
assert.equal(prova.portaoSha256Depois, prova.portaoSha256Antes);
console.log('Três conflitos exercidos; HTML reposto; corpo e portão intactos.');
