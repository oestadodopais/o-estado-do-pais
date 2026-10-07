/** JD1-b: as ressalvas da fonte não podem desaparecer numa nova redação. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { oQueEDaLinha } from '../../src/lib/o-que-e-o-numero.mjs';

const provisórias = ['juros-das-administracoes-publicas-2025', 'pib-nominal-notificacao-setembro-2025', 'juros-das-administracoes-publicas-pib-2025'];
export function estadoDaFonte(frase, lang) {
  const periodo = lang === 'pt' ? 'dois mil e vinte e cinco' : 'two thousand and twenty-five';
  const estado = lang === 'pt' ? 'provisório' : 'provisional';
  return frase.includes(periodo) && frase.includes(estado) ? [] : ['JD1-b: falta o estado provisório de 2025'];
}
let plantas = 0;
for (const id of provisórias) for (const lang of ['pt', 'en']) {
  const frase = oQueEDaLinha(id, lang).pedacos.join('');
  assert.deepEqual(estadoDaFonte(frase, lang), [], `${id}/${lang}`);
  if (process.argv.includes('--prova')) {
    const danificada = frase.replace(lang === 'pt' ? 'provisório' : 'provisional', 'final');
    assert.deepEqual(estadoDaFonte(danificada, lang), ['JD1-b: falta o estado provisório de 2025']);
    plantas++;
  }
  if (!process.argv.includes('--declaracoes')) {
    const prefixo = lang === 'pt' ? 'livro-razao' : 'en/ledger';
    const html = parse(fs.readFileSync(`dist/${prefixo}/${id}/index.html`, 'utf8'));
    assert.deepEqual(estadoDaFonte(html.querySelector('[data-o-que-e-parte="o-que-e"]').textContent, lang), [], `recibo ${id}/${lang}`);
  }
}
// A marca do INE não se estende ao agregado europeu, cujo corpo não tem status.
for (const lang of ['pt', 'en']) assert.ok(!/provis[oó]ri/.test(oQueEDaLinha('juros-das-administracoes-publicas-2025-ue', lang).pedacos.join('')));
console.log(`JD1-b: estado provisório nas três linhas INE nas duas edições; ${plantas} plantas morderam.`);
