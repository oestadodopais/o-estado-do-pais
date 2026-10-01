/** E0c: retirar uma correção e alterar um selo exercita os detetores das medidas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { recontarCorrecoes, conferirPrefixosDaHistoria } from './detetores-e0b.mjs';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const base = '07549ee1e9ec2b39186f9e9f13eeac4914bf5e76';
export function provarDetetoresE0c() {
  const livros = loadClaims();
  const antes = recontarCorrecoes(livros);
  const copia = structuredClone(livros);
  const alentejo = copia.get('pib-pc-alentejo-2024');
  const indice = alentejo.corrections.findIndex(e => e.kind === 'correcao');
  assert.ok(indice >= 0);
  const [retirada] = alentejo.corrections.splice(indice, 1);
  const depois = recontarCorrecoes(copia);
  assert.equal(depois, antes - 1);
  assert.equal(recontarCorrecoes(livros), antes);
  const historiaAntes = JSON.parse(execFileSync('git', ['show', `${base}:ledger/historias-valores.json`], { encoding: 'utf8' }));
  const historia = JSON.parse(fs.readFileSync('ledger/historias-valores.json', 'utf8'));
  const errosLimpos = conferirPrefixosDaHistoria(historiaAntes, historia);
  assert.deepEqual(errosLimpos, []);
  const plantada = structuredClone(historia);
  const id = 'estudos-evora-publicados';
  const original = plantada[id][0].new_value;
  plantada[id][0].new_value = `${original}9`;
  const queixas = conferirPrefixosDaHistoria(historiaAntes, plantada);
  assert.equal(queixas.length, 1);
  assert.ok(queixas[0].includes(id));
  assert.deepEqual(conferirPrefixosDaHistoria(historiaAntes, historia), []);
  return {
    correcoes_publicadas: { antes, depois, linha_retirada: alentejo.id, indice, entrada_retirada: retirada,
      baixou_uma: depois === antes - 1, livro_real_conservado: recontarCorrecoes(livros) === antes },
    historia_anterior_conservada: { base, linhas_anteriores: Object.keys(historiaAntes).length,
      linha_plantada: id, indice: 0, campo: 'new_value', antes: original, plantado: plantada[id][0].new_value,
      erros_limpos: errosLimpos, queixas, historia_real_conservada: conferirPrefixosDaHistoria(historiaAntes, historia).length === 0 },
    conhecidos_positivos: { correcoes_publicadas: depois === antes - 1, historia_anterior_conservada: queixas.length === 1 },
    passou: true,
  };
}
if (process.argv[1]?.endsWith('/provar-detetores-e0c.mjs')) {
  const r = { cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), medido_em: new Date().toISOString(), ...provarDetetoresE0c() };
  fs.writeFileSync(`${pasta}/detetores-e0c.json`, JSON.stringify(r, null, 2) + '\n');
  console.log(`E0c: contagem ${r.correcoes_publicadas.antes} para ${r.correcoes_publicadas.depois}; ${r.historia_anterior_conservada.queixas[0]}`);
}
