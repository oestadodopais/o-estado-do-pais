/** Prova a leitura dos estados do Git e a planta que reproduz o corte errado. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { lerEstadoDaArvore } from './estado-da-arvore.mjs';
const artefacto = ' M design/especime-v3/medicoes/e0-2026-09-30/capturas-e0.json\n';
const casos = [
  { nome: 'árvore limpa', saida: '', esperado: false },
  { nome: 'artefacto modificado com espaço inicial', saida: artefacto, esperado: false },
  { nome: 'captura nova', saida: '?? design/especime-v3/capturas/e0-2026-09-30/primeira-pt-390.png\n', esperado: false },
  { nome: 'código modificado', saida: ' M src/lib/mudancas.mjs\n', esperado: true },
  { nome: 'guião do bloco modificado', saida: ' M design/especime-v3/medicoes/e0-2026-09-30/correr.mjs\n', esperado: true },
  { nome: 'linha do livro modificada', saida: ' M ledger/claims/correcoes-publicadas.yml\n', esperado: true },
  { nome: 'ficheiro preparado', saida: 'M  src/lib/mudancas.mjs\n', esperado: true }
].map(c => {
  const lido = lerEstadoDaArvore(c.saida).codigoPorRegistar;
  assert.equal(lido, c.esperado, c.nome);
  return { nome: c.nome, esperado: c.esperado, lido, passou: true };
});
const planta = { nome: 'cortar os espaços antes de ler as colunas',
  correto: lerEstadoDaArvore(artefacto).codigoPorRegistar,
  plantado: lerEstadoDaArvore(artefacto.trim()).codigoPorRegistar };
planta.mordeu = planta.correto === false && planta.plantado === true;
assert.ok(planta.mordeu);
fs.writeFileSync('design/especime-v3/medicoes/e0-2026-09-30/estado-da-arvore.json',
  JSON.stringify({ casos, planta, conhecido_positivo: casos.some(c => c.nome === 'código modificado' && c.lido), passou: true }, null, 2) + '\n');
console.log('E0: leitura do estado da árvore provada; a planta do espaço inicial mordeu.');
