/** O quadro mantém a transcrição, as duas colunas e o realce da parcela e do total. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { getClaim } from '../../src/lib/ledger.mjs';
import { quadroFinanciamentoJd1 } from '../../src/lib/quadro-financiamento-jd1.mjs';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
for (const id of ['necessidades-brutas-de-financiamento-2025', 'amortizacoes-e-anulacoes-de-divida-fundada-2025']) {
const linha = getClaim(id);
const norm = s => s.replace(/\s+/g, ' ').trim();
const q = quadroFinanciamentoJd1(linha.excerpt);
assert.equal(norm([q.cabecalho, ...q.linhas.map(l => l.celulas)].flat().join(' ')), norm(linha.excerpt));
assert.throws(() => quadroFinanciamentoJd1(linha.excerpt.replace('2024', '2023')), /os anos/);
assert.throws(() => quadroFinanciamentoJd1(linha.excerpt.split('\n').slice(1).join('\n')), /dez linhas/);
assert.throws(() => quadroFinanciamentoJd1(linha.excerpt.replace('2. AMORTIZAÇÕES', '4. AMORTIZAÇÕES')), /parcela ou o total/);
function conferir(tabela) {
  assert(tabela, 'Falta a tabela.');
  assert.equal(tabela.getAttribute('data-linha-claim'), id);
  assert.equal(tabela.getAttribute('data-linha-campo'), 'excerpt');
  assert.equal(norm(tabela.text), norm(linha.excerpt), 'A tabela alterou a transcrição.');
  assert.equal(tabela.getAttribute('lang'), 'pt-PT');
  assert.deepEqual(tabela.querySelectorAll('thead th').map(e => norm(e.text)), ['(milhões de euros)', '2024', '2025']);
  const linhas = tabela.querySelectorAll('tbody tr');
  assert.equal(linhas.length, 10);
  for (const tr of linhas) {
    assert.equal(tr.querySelectorAll('th, td').length, 3);
    assert.equal(tr.querySelector('th').getAttribute('scope'), 'row');
  }
  const destaques = tabela.querySelectorAll('[data-quadro-jd1-celula]');
  assert.equal(destaques.length, 2);
  for (const [marca, rotulo, valor] of [['parcela', '2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)', '56 976'], ['total', '3. NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)', '67 601']]) {
    const celula = tabela.querySelector(`[data-quadro-jd1-celula="${marca}"]`);
    assert(celula);
    assert.equal(norm(celula.text), valor);
    assert.equal(norm(celula.parentNode.querySelector('th').text), rotulo);
    assert.equal(celula.parentNode.querySelectorAll('th, td').indexOf(celula), 2, 'Realce fora de 2025.');
  }
}
if (!process.argv.includes('--sem-dist')) for (const rota of ['livro-razao', 'en/ledger']) {
  const html = fs.readFileSync(path.join(raiz, 'dist', rota, id, 'index.html'), 'utf8');
  const tabela = parse(html).querySelector('table.linha-quadro-financiamento');
  conferir(tabela);
  for (const [nome, estragar] of [
    ['valor alterado', t => t.querySelector('[data-quadro-jd1-celula="parcela"] strong').set_content('56 975')],
    ['colunas trocadas', t => t.querySelectorAll('thead th')[1].set_content('2025 ')],
    ['realce retirado', t => t.querySelector('[data-quadro-jd1-celula="parcela"]').removeAttribute('data-quadro-jd1-celula')],
    ['proveniência retirada', t => t.removeAttribute('data-linha-campo')],
  ]) {
    const copia = parse(tabela.outerHTML).querySelector('table'); estragar(copia);
    assert.throws(() => conferir(copia), assert.AssertionError, nome);
  }
}
}
console.log('JD1 quadro: transcrição integral, anos, parcela/total de 2025 e plantas conferidos.');
