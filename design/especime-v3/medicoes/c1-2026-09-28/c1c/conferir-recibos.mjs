/** Confere os recibos finais da retoma e a bandeira nas duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
const pasta = 'design/especime-v3/medicoes/c1-2026-09-28/c1c';
const casos = [];
const texto = e => e.text.replace(/\s+/g, ' ').trim();
for (const lang of ['pt', 'en']) {
  const rota = lang === 'pt' ? 'livro-razao' : 'en/ledger';
  for (const [id, datas] of [
    ['divida-das-familias-2025-ue', ['28.09.2026','21.09.2026']],
    ['indice-de-divida-limite-legal', ['01.09.2026']],
    ['pib-real-per-capita-2024', ['28.09.2026','28.09.2026']],
    ['pib-real-per-capita-2025', ['28.09.2026','28.09.2026']],
    ['pib-real-per-capita-2025-ue', ['28.09.2026','28.09.2026']],
  ]) {
    const doc = parse(fs.readFileSync(`dist/${rota}/${id}/index.html`, 'utf8'));
    const releituras = doc.querySelectorAll('.linha-verificacao');
    const lidas = releituras.map(e => texto(e.querySelector('[data-de-campo$=".date"]')));
    assert.deepEqual(lidas, datas);
    const resultados = releituras.map(e => e.getAttribute('data-resultado'));
    if (id.startsWith('pib-')) {
      assert.deepEqual(resultados, ['igual','inacessivel']);
      assert.ok(texto(releituras[1]).includes(lang === 'pt' ? 'não foi possível reler o número nesse dia' : 'the number could not be re-read that day'));
    }
    if (id === 'divida-das-familias-2025-ue') {
      assert.deepEqual(resultados, ['diverge','igual']);
      assert.equal(texto(releituras[0].querySelector('[data-linha-campo$=".found"]')), lang === 'pt' ? '49,2' : '49.2');
      assert.equal(releituras[0].querySelector('[data-atualizacao-da-releitura]').getAttribute('href'), '#alteracao-0');
      assert.equal(texto(doc.querySelector('#alteracao-0 [data-correcao-campo="kind"]')), lang === 'pt' ? 'atualização' : 'update');
      assert.equal(texto(doc.querySelector('#alteracao-1 [data-correcao-campo="field"]')), 'access_date');
      assert.equal(texto(doc.querySelector('#alteracao-1 [data-correcao-campo="old_value"]')), '15.09.2026');
      assert.equal(texto(doc.querySelector('#alteracao-1 [data-correcao-campo="new_value"]')), '28.09.2026');
    }
    if (id === 'indice-de-divida-limite-legal') {
      assert.ok(releituras[0].querySelector('a').getAttribute('href').endsWith('Anu%C3%A1rio%202024_OCC.pdf#page=22'));
    }
    if (id === 'pib-real-per-capita-2024' || id === 'pib-real-per-capita-2025') {
      assert.ok(texto(doc.querySelector('h1.linha-valor')).includes(lang === 'pt' ? '(dado provisório)' : '(provisional data)'));
    }
    casos.push({ id, lingua: lang, datas: lidas, resultados, texto: texto(doc.querySelector('[aria-labelledby="verificacoes"]')), passou: true });
  }
  const temas = parse(fs.readFileSync(`dist/${lang === 'pt' ? 'temas' : 'en/themes'}/index.html`, 'utf8'));
  const pib = temas.querySelector('article[data-cartao-medida="pib-real-per-capita-2025"]');
  assert.ok(texto(pib).includes(lang === 'pt' ? '(dado provisório)' : '(provisional data)'));
  const ihpc = temas.querySelector('article[data-cartao-medida="ihpc-variacao-homologa"]');
  assert.ok(!/\b(dentro|fora|within|outside)\b/i.test(texto(ihpc)));
  casos.push({ id: 'cartoes-pib-e-ihpc', lingua: lang, bandeira: texto(pib), objetivo_sem_veredicto: texto(ihpc), passou: true });
}
const resultado = { cabeca: JSON.parse(fs.readFileSync('dist/version.json', 'utf8')).commit, casos, contagem: casos.length, erros: [] };
fs.writeFileSync(`${pasta}/recibos-finais.json`, JSON.stringify(resultado, null, 2) + '\n');
console.log(`${casos.length} casos finais nas duas edições, sem falhas.`);
