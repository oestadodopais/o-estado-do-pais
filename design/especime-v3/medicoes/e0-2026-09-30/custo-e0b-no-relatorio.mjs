/** Conserva a amostra E0b e acrescenta o custo dos seus dois revisores. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const inteiro = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export function corrigirCustoE0b(texto, custo, modelo) {
  const inicio = texto.indexOf('Nesta passagem, o início foi lido da mensagem de retoma da sessão:', texto.indexOf('\n## E0b'));
  assert.ok(inicio >= 0);
  const fim = texto.indexOf('\n', inicio);
  const paragrafo = `Nesta passagem, o início foi lido da mensagem de retoma da sessão: ${custo.inicio}. A amostra de ${custo.medido_em} mede ${String(custo.segundos_decorridos).replace('.', ',')} segundos desde a retoma e ${inteiro(custo.construtor_simbolos)} símbolos do construtor desde o contador final E0. As duas sessões do revisor automático acrescentam ${custo.revisores_automaticos.map(s => inteiro(s.simbolos_sem_cache_mais_saida)).join(' e ')}, somando ${inteiro(custo.revisores_simbolos)} símbolos. O total cobrado da passagem nesta amostra é ${inteiro(custo.total_cobrado_simbolos)}, ao lado dos ${inteiro(custo.construtor_simbolos)} do construtor. A amostra conserva-se em custo-e0b.json e no campo e0b de custo.json; a E0c não prolonga esse contador. Modelo lido do contexto da sessão: \`${modelo}\`. É uma amostra antes do fecho, não uma linha final do terminal.`;
  return texto.slice(0, inicio) + paragrafo + texto.slice(fim);
}
if (process.argv[1]?.endsWith('/custo-e0b-no-relatorio.mjs')) {
  const custo = JSON.parse(fs.readFileSync(`${pasta}/custo.json`, 'utf8'));
  const f = `${pasta}/LEIA-ME.md`;
  fs.writeFileSync(f, corrigirCustoE0b(fs.readFileSync(f, 'utf8'), custo.e0b, custo.construtor.modelo));
  const e0b = JSON.parse(fs.readFileSync(`${pasta}/e0b.json`, 'utf8'));
  e0b.custo = custo.e0b;
  fs.writeFileSync(`${pasta}/e0b.json`, JSON.stringify(e0b, null, 2) + '\n');
  console.log(`E0b: construtor ${custo.e0b.construtor_simbolos}, revisores ${custo.e0b.revisores_simbolos}, total ${custo.e0b.total_cobrado_simbolos}.`);
}
