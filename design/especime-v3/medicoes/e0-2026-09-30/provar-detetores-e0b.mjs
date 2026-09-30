/** As três medidas revistas exercitam os seus próprios detetores. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { load } from 'js-yaml';
import { decimalDoExcerto, anatomiaDoDiff, lerCodigoDaCorrida } from './detetores-e0b.mjs';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
export function provarDetetores() {
  const decimais = ['taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025'].map(id => {
    const c = load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
    const lido = decimalDoExcerto(c.excerpt);
    const plantado = decimalDoExcerto(c.excerpt.replace('6.0', '6'));
    assert.equal(lido, '6.0'); assert.equal(plantado, null);
    return { id, campo_lido: 'excerpt', lido, valor_da_casa: c.value, planta_mordeu: plantado === null };
  });
  const diff = execFileSync('git', ['diff', '--name-only', '07549ee1e9ec2b39186f9e9f13eeac4914bf5e76', '--', 'src/components', 'src/views', 'src/styles'], { encoding: 'utf8' });
  const anatomia = anatomiaDoDiff(diff);
  assert.ok(anatomia.includes('src/components/RegistoCorrecoes.astro'));
  const plantaDoCartao = anatomiaDoDiff(diff + 'src/components/CartaoDaMedida.astro\n').includes('src/components/CartaoDaMedida.astro');
  assert.ok(plantaDoCartao);
  const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'e0b-codigos-'));
  const codigos = [];
  try {
    for (const esperado of [0, 1]) {
      const inicio = Date.now();
      const processo = spawnSync(process.execPath, ['-e', `process.exitCode=${esperado}`]);
      const ficheiro = path.join(temporaria, `${esperado}.codigo`);
      fs.writeFileSync(ficheiro, `${processo.status}\n`);
      const atual = lerCodigoDaCorrida(ficheiro, inicio, Date.now() + 1);
      assert.equal(atual.medido, true); assert.equal(atual.codigo, esperado);
      fs.utimesSync(ficheiro, new Date(0), new Date(0));
      const antigo = lerCodigoDaCorrida(ficheiro, inicio, Date.now() + 1);
      assert.equal(antigo.medido, false);
      codigos.push({ esperado, lido: atual.codigo, escrito_nesta_corrida: atual.medido, planta_antiga_recusada: !antigo.medido });
    }
    const vazio = path.join(temporaria, 'vazio.codigo');
    const inicio = Date.now();
    fs.writeFileSync(vazio, '');
    const lido = lerCodigoDaCorrida(vazio, inicio, Date.now() + 1);
    assert.equal(lido.medido, false); assert.equal(lido.codigo, null);
    codigos.push({ esperado: null, lido: lido.codigo, planta_vazia_recusada: !lido.medido });
  } finally { fs.rmSync(temporaria, { recursive: true }); }
  return { decimais, anatomia: { diff_lido: anatomia, planta_do_cartao_mordeu: plantaDoCartao }, codigos,
    conhecidos_positivos: { desemprego_com_decimal: decimais.every(d => d.lido === '6.0'), anatomia_mudada: anatomia.length > 0,
      portoes: codigos.some(c => c.lido === 1 && c.escrito_nesta_corrida) }, passou: true };
}
if (process.argv[1]?.endsWith('/provar-detetores-e0b.mjs') || process.argv[1] === `${pasta}/provar-detetores-e0b.mjs`) {
  const r = { cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), medido_em: new Date().toISOString(), ...provarDetetores() };
  fs.writeFileSync(`${pasta}/detetores-e0b.json`, JSON.stringify(r, null, 2) + '\n');
  console.log('E0b: os três detetores encontram os positivos e recusam as plantas.');
}
