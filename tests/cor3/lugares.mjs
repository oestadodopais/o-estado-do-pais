import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'js-yaml';
import {lugarDaHabitacao} from '../../scripts/lugar-habitacao.mjs';
const casos = {
  'hab-tipsho10-a-i15-a-avg-pt-2025':'portugal',
  'hab-tipsho10-a-i15-a-avg-eu27_2020-2025':'uniao-europeia',
  'hab-tipsho60-a-ptir-lt-avg-ro-2024':'romenia',
  'hab-bpstat-12533724':'portugal',
  'hab-bpstat-12533735':'portugal',
  'der-hab-precos-reais-pt-vs-eu-2025':'portugal',
  'der-hab-sobrecarga-inquilinos-pt-vs-eu-2025':'portugal',
  'der-hab-preco-rendimento-lt-pt-2024':'portugal',
  'der-hab-preco-rendimento-lt-eu-2024':'uniao-europeia',
};
let plantas=0;
for (const [id,lugar] of Object.entries(casos)) {
  const c=load(fs.readFileSync(`ledger/claims/${id}.yml`,'utf8'));
  assert.equal(lugarDaHabitacao(c),lugar,id);
  for (const campo of ['value','excerpt','source_url','check']) {
    const copia=structuredClone(c); copia[campo]=String(copia[campo])+' adulterado';
    assert.equal(lugarDaHabitacao(copia),null,`${id}: ${campo}`); plantas++;
  }
}
console.log(`COR3 lugares: ${Object.keys(casos).length} positivos e ${plantas} plantas recusadas.`);
