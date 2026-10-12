/** JD1-c: plantas e conferência das frases nas duas edições. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { oQueEDaLinha } from '../../src/lib/o-que-e-o-numero.mjs';
import { reguaDaMedida } from '../../src/lib/enquadramento.mjs';
export const plantas = [];
function recusa(nome, erros, mensagem) {
  assert.ok(erros.includes(mensagem), nome + ': a planta não mordeu');
  plantas.push({nome, mensagem, passou: true});
}
export function conferirNotas(id, texto, lang, regua = reguaDaMedida(id)) {
  const erros = [];
  if (id.endsWith('2024') && /provis/.test(texto)) erros.push('JD1-c: linha final de 2024 apresentada como provisória');
  if (/A comparação|The comparison/.test(texto) && !(regua.ue || regua.portugal)) erros.push('JD1-c: frase de comparação sem a linha da União');
  return erros;
}
for (const base of ['juros-das-administracoes-publicas', 'pib-nominal-notificacao-setembro', 'juros-das-administracoes-publicas-pib']) for (const year of ['2024','2025']) for (const lang of ['pt','en']) {
  const id = `${base}-${year}`;
  const frase = oQueEDaLinha(id, lang).pedacos.join('');
  assert.deepEqual(conferirNotas(id, frase, lang), []);
  assert.match(frase, year === '2024' ? /final/ : /provis/);
  if (!process.argv.includes('--declaracoes')) {
    const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${id}/index.html`, 'utf8'));
    const texto = root.querySelector('[data-o-que-e-parte="o-que-e"]').textContent;
    assert.deepEqual(conferirNotas(id, texto, lang), []);
    assert.match(texto, year === '2024' ? /final/ : /provis/);
  }
  if (year === '2024') {
    recusa(`Estado trocado ${id}/${lang}`, conferirNotas(id, frase.replace(lang === 'pt' ? 'O valor é final' : 'The value is final', lang === 'pt' ? 'O valor é provisório' : 'The value is provisional'), lang), 'JD1-c: linha final de 2024 apresentada como provisória');
    recusa(`Comparação sem União ${id}/${lang}`, conferirNotas(id, frase + (lang === 'pt' ? ' A comparação' : ' The comparison'), lang), 'JD1-c: frase de comparação sem a linha da União');
  }
}
const { parcelaDoFinanciamento, FINANCIAMENTO_JD1, AMORTIZACOES_JD1 } = await import('../../src/lib/frases-jd1.mjs');
function confereParcela(partes) {
  return JSON.stringify(partes.filter(p => typeof p !== 'string').map(p => p.claim)) === JSON.stringify([FINANCIAMENTO_JD1, AMORTIZACOES_JD1])
    ? [] : ['JD1-c: parcela sem os dois montantes por token'];
}
for (const lang of ['pt','en']) {
  const frase = parcelaDoFinanciamento(FINANCIAMENTO_JD1, lang);
  assert.deepEqual(confereParcela(frase), []);
  recusa(`Parcela literal/${lang}`, confereParcela(frase.map(p => p.claim === AMORTIZACOES_JD1 ? '56 976' : p)), 'JD1-c: parcela sem os dois montantes por token');
  if (!process.argv.includes('--declaracoes')) {
    const root = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${FINANCIAMENTO_JD1}/index.html`, 'utf8'));
    assert.deepEqual(root.querySelector('[data-jd1-parcela]').querySelectorAll('[data-claim]').map(n => n.getAttribute('data-claim')), [FINANCIAMENTO_JD1, AMORTIZACOES_JD1]);
  }
}
console.log(JSON.stringify({passou: true, plantas}, null, 2));
