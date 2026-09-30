/** Ensaio N1b em memória: as correções, a recontagem e a exigência de lugar.
 * Nenhuma linha nem história selada em disco é alterada por este guião.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { loadClaims, contagensDoRegisto } from '../../../../src/lib/ledger.mjs';
import { mudancasDoRegisto } from '../../../../src/lib/mudancas.mjs';
import { assinaturaDoValor, conferirHistoriaDoValor } from '../../../../src/lib/historia-do-valor.mjs';
const claims = loadClaims();
const ids = ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-2025', 'correcoes-publicadas'];
const originais = new Map(ids.map((id) => [id, claims.get(id)]));
const r = { cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), limpo: {}, correcoes_sem_historia_derivada: {}, historia_derivada: {}, erros_da_cadeia: [] };
try {
  assert.equal(contagensDoRegisto(claims).correcoes_publicadas, 3, 'Este ensaio parte do estado anterior à N1b.');
  for (const lang of ['pt', 'en']) r.limpo[lang] = mudancasDoRegisto(lang).filter((e) => e.kind === 'correcao').length;
  for (const id of ids.slice(0, 2)) {
    const c = structuredClone(claims.get(id));
    const valor = c.excerpt.match(/2025: (\d+\.\d+)$/)[1].replace('.', ',');
    assert.equal(c.value, '6');
    c.corrections.push({ date: '2026-09-30', kind: 'correcao', old_value: c.value, new_value: valor,
      reason: 'A apresentação portuguesa omitira a casa decimal que o excerto da fonte já guardava. Repõe-se essa casa decimal, sem alterar a quantidade nem declarar uma revisão da fonte.',
      reason_en: 'The Portuguese number format omitted the decimal place already preserved in the source excerpt. That decimal place is restored without changing the quantity or claiming a source revision.' });
    c.value = valor;
    claims.set(id, c);
  }
  const c = structuredClone(claims.get('correcoes-publicadas'));
  const anterior = c.value;
  c.value = String(contagensDoRegisto(claims).correcoes_publicadas);
  claims.set(c.id, c);
  for (const lang of ['pt', 'en']) r.correcoes_sem_historia_derivada[lang] = mudancasDoRegisto(lang).filter((e) => e.kind === 'correcao').length;
  c.corrections.push({ date: '2026-09-30', kind: 'atualizacao', old_value: anterior, new_value: c.value,
    reason: 'A contagem passou a incluir as duas correções da apresentação decimal do desemprego de Portugal. O valor anterior contava as correções existentes antes dessas publicações; a recontagem não é uma correção adicional.',
    reason_en: 'The count now includes the two corrections to the decimal presentation of unemployment in Portugal. The previous value counted the corrections present before those publications; the recount is not an additional correction.' });
  const assinaturas = c.corrections.map(assinaturaDoValor);
  conferirHistoriaDoValor(c, assinaturas, c.id, r.erros_da_cadeia);
  r.contador = { anterior, calculado: c.value, historia: assinaturas };
  for (const lang of ['pt', 'en']) {
    try { mudancasDoRegisto(lang); r.historia_derivada[lang] = null; }
    catch (e) { r.historia_derivada[lang] = e.message; }
  }
} finally {
  for (const [id, c] of originais) claims.set(id, c);
}
r.conhecido_positivo = Object.values(r.limpo).every((n) => n === 3) && Object.values(r.correcoes_sem_historia_derivada).every((n) => n === 5);
r.impedimento_confirmado = r.erros_da_cadeia.length === 0 && Object.values(r.historia_derivada).every((e) => e?.includes('correcoes-publicadas') && e.includes('nenhuma declaração diz de que lugar é'));
r.reposto = contagensDoRegisto(claims).correcoes_publicadas === 3;
fs.writeFileSync('design/especime-v3/medicoes/n1-2026-09-30/prova-contador-n1b.json', JSON.stringify(r, null, 2) + '\n');
console.log(JSON.stringify(r, null, 2));
process.exitCode = r.conhecido_positivo && r.impedimento_confirmado && r.reposto ? 0 : 1;
