/** Confere a quarta redação e escreve o inventário do ensaio com os valores selados. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { LEITURAS_RP1 as fonte } from '../../../observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs';
import { LEITURAS_RP1 as atual } from '../../../../src/data/leituras-rp1.mjs';
import { LEITURAS_DAS_MEDIDAS as todas } from '../../../../src/data/leituras-das-medidas.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';
import { getClaim, loadClaims } from '../../../../src/lib/ledger.mjs';
import { chavesDoEnquadramento } from '../../../../src/lib/enquadramento.mjs';
import { leituraDaMedida, textoDaLeitura } from '../../../../src/lib/leitura-da-medida.mjs';
import { conferirAuditoriaDasLeituras } from '../../../../tests/cartao/leituras.mjs';

const pasta = new URL('./', import.meta.url);
const registo = JSON.parse(fs.readFileSync(new URL('acertos-c1.json', pasta), 'utf8'));
const esperado = structuredClone(fonte);
for (const a of registo.acertos) {
  let alvo = esperado[a.id][a.lang];
  for (const k of a.caminho.slice(0, -1)) alvo = alvo[k];
  const k = a.caminho.at(-1);
  assert.equal(alvo[k], a.antes);
  alvo[k] = a.depois;
  for (const apoio of a.apoios) {
    const origem = ORIGENS_DAS_DEFINICOES[apoio.origem];
    assert.ok(origem, `Origem em falta: ${apoio.origem}`);
    assert.ok(origem[apoio.campo].includes(apoio.literal));
  }
}
assert.deepEqual(atual, esperado);
const antigoTexto = execFileSync('git', ['show', '48a5a1c1:src/data/leituras-das-medidas.mjs'], { encoding: 'utf8' });
// A importação do RP1 só junta as entradas que a igualdade acima já confere.
const semImportacao = antigoTexto.replace(/^import .*leituras-rp1.*;$/m, '').replace(/\.\.\.LEITURAS_RP1,?/, '');
const { LEITURAS_DAS_MEDIDAS: antigas } = await import('data:text/javascript;base64,' + Buffer.from(semImportacao).toString('base64'));
for (const [id, valor] of Object.entries(antigas)) assert.deepEqual(todas[id], valor);
const k17 = conferirAuditoriaDasLeituras();
assert.deepEqual(k17.erros, []);
const linha = id => {
  const c = getClaim(id);
  return { id, valor: c.value, unidade: c.unit, periodo: c.reference_date, publicado: c.published_at ?? null, fonte: c.source, excerto: c.excerpt };
};
const inventario = Object.keys(atual).map(id => {
  const r = chavesDoEnquadramento(id);
  return { ...linha(id), anterior: loadClaims().has(r.anterior) ? linha(r.anterior) : null, ue: loadClaims().has(r.ue) ? linha(r.ue) : null };
});
const seladas = Object.fromEntries(Object.keys(atual).map(id => [id, Object.fromEntries(['pt', 'en'].map(lang => [lang, textoDaLeitura(leituraDaMedida(id, lang).pedacos, lang)]))]));
for (const [nome, valor] of Object.entries({
  'acertos-provados.json': { redacao: 'quarta', acertos: registo.acertos.length, diferencas_fora_dos_acertos: 0, leituras_anteriores_intactas: Object.keys(antigas).length, k17 },
  'inventario-c1.json': { medidas: [{ nome: 'inventario_das_medidas', valor: inventario }] },
  'leituras-seladas.json': seladas,
})) fs.writeFileSync(new URL(nome, pasta), JSON.stringify(valor, null, 2) + '\n');
console.log(`C1: quarta redação conferida; ${registo.acertos.length} acertos e ${Object.keys(antigas).length} leituras anteriores intactas.`);
