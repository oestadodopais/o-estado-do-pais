import assert from 'node:assert/strict';
import {FAMILIAS_DAS_LINHAS} from '../../src/data/o-que-e-das-familias.mjs';
import {conferirAuditoriaDasFamilias} from '../cartao/familias.mjs';
assert.deepEqual(conferirAuditoriaDasFamilias().erros, []);
for (const id of ['hab-tipsho60-a-ptir-i15-pt-2024', 'hab-tipsho60-a-ptir-i25-pt-2025', 'hab-tipsho60-a-ptir-lt-avg-pt-2024']) {
  const familias = structuredClone(FAMILIAS_DAS_LINHAS);
  familias[id].origens = [id.includes('-lt-avg-') ? 'hb1c-eurostat-preco-rendimento-rendimento' : 'hb1c-eurostat-preco-rendimento'];
  assert(conferirAuditoriaDasFamilias({familias}).erros.some(e => e.includes(id + ': a definição citada tem de ser a da unidade da linha')));
}
console.log('COR3: definições dos índices de ano base e da média de longo prazo; três trocas recusadas pela unidade.');
