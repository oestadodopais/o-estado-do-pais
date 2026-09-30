/** N1: mede a precisão do excerto. O ensaio de correção fica parado pelo contador publicado. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';

const ids = ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-2025'];
for (const id of ids) {
  const ficheiro = `ledger/claims/${id}.yml`;
  const texto = fs.readFileSync(ficheiro, 'utf8');
  const linha = load(texto);
  const literal = linha.excerpt.match(/2025: (\d+\.\d+)$/)?.[1];
  assert.ok(literal, `${id}: o excerto tem de terminar no valor decimal do período.`);
  const valor = literal.replace('.', ',');
  if (linha.value === valor) {
    assert.equal(linha.corrections.at(-1)?.new_value, valor);
    console.log(`${id}: a apresentação decimal já está registada.`);
    continue;
  }
  assert.equal(Number(linha.value.replace(',', '.')), Number(literal), 'A quantidade não pode mudar.');
  assert.deepEqual(linha.corrections, [], 'A operação parte da história lida no início do N1.');
  if (!process.argv.includes('--aplicar-correcao')) {
    console.log(`${id}: ${linha.value} → ${valor}; aplicação parada, consultar LEIA-ME.md.`);
    continue;
  }
  const historia = `corrections:\n  - date: "2026-09-30"\n    kind: correcao\n    old_value: "${linha.value}"\n    new_value: "${valor}"\n    reason: "A apresentação portuguesa omitira a casa decimal que o excerto da fonte já guardava. Repõe-se essa casa decimal, sem alterar a quantidade nem declarar uma revisão da fonte."\n    reason_en: "The Portuguese number format omitted the decimal place already preserved in the source excerpt. That decimal place is restored without changing the quantity or claiming a source revision."`;
  fs.writeFileSync(ficheiro, texto.replace(/^value: .*$/m, `value: "${valor}"`).replace('corrections: []', historia));
  execFileSync('node', ['scripts/selar-historia-valores.mjs', id], { stdio: 'inherit' });
}
