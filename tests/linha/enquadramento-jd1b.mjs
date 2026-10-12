/** JD1-b: as três comparações prometidas chegam ao recibo, com origens compatíveis. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { conferirReguaJd1b, reguaDaMedida, temRegua } from '../../src/lib/enquadramento.mjs';

const linhas = loadClaims();
const pt = 'juros-das-administracoes-publicas-pib-2025';
const ue = 'juros-das-administracoes-publicas-2025-ue';
const caixa = 'juros-e-outros-encargos-execucao-2026-08';
// Lista independente da seleção: perder uma ligação no seletor não reduz a prova.
const esperadas = new Map([
  [pt, ['juros-das-administracoes-publicas-pib-2024', ue]],
  [ue, [pt]],
  [caixa, ['juros-e-outros-encargos-execucao-2025-08']],
]);

export function conferirHtml(id, html) {
  const bloco = parse(html).querySelector('#enquadramento');
  const referencias = new Set(bloco?.querySelectorAll('[data-claim]').map(n => n.getAttribute('data-claim')) || []);
  const erros = [];
  for (const ref of esperadas.get(id) || []) {
    if (!referencias.has(ref)) erros.push(`JD1-b enquadramento: comparação ausente ${ref}`);
  }
  if ([pt, ue].includes(id) && bloco?.getAttribute('data-enquadramento-edicoes-distintas') !== 'true') {
    erros.push('JD1-b enquadramento: edições distintas não identificadas');
  }
  return erros;
}

for (const [id, refs] of esperadas) {
  const r = reguaDaMedida(id);
  assert.ok(temRegua(r), id);
  assert.deepEqual([r.anterior?.id, r.ue?.id, r.portugal?.id].filter(Boolean), refs);
}
// Não inventar comparação entre euros e percentagens, nem perder réguas antigas.
assert.equal(reguaDaMedida('juros-das-administracoes-publicas-2025').ue, null);
assert.equal(reguaDaMedida('precos-da-habitacao-2025').ue?.id, 'precos-da-habitacao-2025-ue');
assert.equal(conferirReguaJd1b('precos-da-habitacao-2025'), null);

let plantas = 0;
if (process.argv.includes('--prova')) {
  const plantar = (id, chave, alterar, mensagem) => {
    const copia = structuredClone(linhas);
    alterar(copia.get(chave));
    assert.throws(() => conferirReguaJd1b(id, copia), mensagem);
    plantas++;
  };
  plantar(pt, ue, c => { c.unit = 'milhões de euros'; }, /unidade divergente/);
  plantar(pt, ue, c => { c.reference_date = '2024'; }, /período divergente/);
  plantar(pt, 'pib-nominal-notificacao-setembro-2025', c => { c.reference_date = '2024'; }, /período divergente/);
  plantar(pt, 'pib-nominal-notificacao-setembro-2025', c => { c.document.edition = 'Abril de 2026'; }, /edições divergentes/);
  plantar(pt, 'juros-das-administracoes-publicas-2024', c => { c.document.edition = 'Abril de 2026'; }, /edições divergentes/);
  plantar(pt, 'pib-nominal-notificacao-setembro-2025', c => { c.source_url = 'https://www.ine.pt/outro-documento'; }, /fontes, documentos/);
  plantar(pt, pt, c => { c.derived_from.reverse(); }, /derivação divergente/);
  plantar(pt, pt, c => { c.check = c.check.replace('* 100', '* 10'); }, /derivação divergente/);
  plantar(pt, ue, c => { c.source_url = c.source_url.replace('S13', 'S1311'); }, /coordenadas/);
  plantar(caixa, 'juros-e-outros-encargos-execucao-2025-08', c => { c.reference_date = '2025-07'; }, /período divergente/);
  plantar(caixa, 'juros-e-outros-encargos-execucao-2025-08', c => { c.unit = '% do PIB'; }, /unidade divergente/);
  plantar(caixa, 'juros-e-outros-encargos-execucao-2025-08', c => { c.document.edition = 'agosto 2025'; }, /edições divergentes/);
  for (const [id, refs] of esperadas) {
    const html = `<section id="enquadramento" data-enquadramento-edicoes-distintas="true">${refs.map(ref => `<span data-claim="${ref}"></span>`).join('')}</section>`;
    assert.deepEqual(conferirHtml(id, html), []);
    for (const ref of refs) {
      assert.deepEqual(conferirHtml(id, html.replace(`data-claim="${ref}"`, 'data-ligacao-perdida="true"')),
        [`JD1-b enquadramento: comparação ausente ${ref}`]);
      plantas++;
    }
    if (id !== caixa) {
      assert.deepEqual(conferirHtml(id, html.replace('data-enquadramento-edicoes-distintas="true"', '')),
        ['JD1-b enquadramento: edições distintas não identificadas']);
      plantas++;
    }
  }
}

let recibos = 0;
if (!process.argv.includes('--declaracoes')) {
  for (const id of esperadas.keys()) for (const prefixo of ['livro-razao', 'en/ledger']) {
    const file = `dist/${prefixo}/${id}/index.html`;
    assert.deepEqual(conferirHtml(id, fs.readFileSync(file, 'utf8')), [], file);
    recibos++;
  }
}
console.log(`JD1-b enquadramento: três réguas conferidas; ${recibos} recibos; ${plantas} plantas morderam.`);
