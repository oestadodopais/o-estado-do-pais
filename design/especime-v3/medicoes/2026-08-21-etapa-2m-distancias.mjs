#!/usr/bin/env node
/**
 * A DISTÂNCIA ENTRE CENTRÓIDES DA CARTA, medida e não suposta (etapa 2m).
 *
 * `src/components/inicio/MapaRespira.astro` dizia, desde a etapa 2b, que «os
 * vizinhos mais próximos estão a 1,41 unidades um do outro (a área de Lisboa)».
 * As duas metades da frase estavam erradas: 1,41 é a METADE da distância (o
 * `alvo` que `src/lib/inicio.mjs` calcula para cada ponto), e o par mais próximo
 * é nos Açores. Este guião imprime a conta, para que a correção do comentário
 * tenha de onde vir.
 *
 *   node design/especime-v3/medicoes/2026-08-21-etapa-2m-distancias.mjs
 *
 * Não constrói nada, não falha nada e não escreve no repositório: é uma régua.
 */
import { MUNICIPIOS, FIELD_W, FIELD_H, FRAMES } from '../../../src/data/caop-centroids.mjs';

const pts = MUNICIPIOS.map((m) => ({ nome: m[0], x: m[2], y: m[3] }));

/* O vizinho mais próximo de cada um dos 308, por força bruta: 308×308 é uma
   conta de milissegundos e uma estrutura de aceleração seria uma segunda
   implementação para conferir depois. */
const vizinhos = pts.map((a) => {
  let d2 = Infinity;
  let quem = null;
  for (const b of pts) {
    if (b === a) continue;
    const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    if (d < d2) {
      d2 = d;
      quem = b;
    }
  }
  return { nome: a.nome, viz: quem.nome, d: Math.sqrt(d2) };
});
vizinhos.sort((a, b) => a.d - b.d);

const minimo = vizinhos[0];
const q = (p) => vizinhos[Math.floor(p * (vizinhos.length - 1))].d;
const pt = (n) => n.toFixed(3).replace('.', ',');

console.log('');
console.log(`  campo ${FIELD_W}×${FIELD_H} · ${pts.length} centróides`);
console.log('');
console.log(`  distância mínima centro-a-centro: ${pt(minimo.d)} unidades`);
console.log(`    o par: ${minimo.nome} / ${minimo.viz}`);
console.log(`    metade dela (o «alvo» de cada um dos dois): ${pt(minimo.d / 2)}`);
console.log('');
console.log('  o vizinho mais próximo, por percentis:');
for (const p of [0.1, 0.25, 0.5, 0.75, 0.9]) {
  console.log(`    p${String(Math.round(p * 100)).padStart(2)} ${pt(q(p))}`);
}
console.log(`    máximo ${pt(vizinhos[vizinhos.length - 1].d)} (${vizinhos[vizinhos.length - 1].nome})`);
console.log('');
console.log('  quantos concelhos têm o vizinho mais próximo a menos de um diâmetro de ponto:');
for (const [rotulo, diametro] of [
  ['raio 4,5 unidades (a coluna da cabeça)', 9],
  ['raio 2 unidades (a vista de escolha)', 4],
]) {
  console.log(`    ${rotulo}: ${vizinhos.filter((v) => v.d < diametro).length} de ${pts.length}`);
}
console.log('');
console.log('  a distância mínima em CSS px, por largura de mapa:');
for (const largura of [84, 170, 281, 340, 490, 942, 1092]) {
  const escala = largura / FIELD_W;
  console.log(`    mapa ${String(largura).padStart(5)}px → ${pt(minimo.d * escala)} px`);
}
console.log('');
const xAcores = FRAMES.aco[0] + FRAMES.aco[2];
const aDireita = pts.filter((p) => p.x > xAcores);
console.log('  o canto que as ilhas deixam:');
console.log(`    a moldura dos Açores acaba em x=${xAcores}`);
console.log(`    o ponto mais a sul à direita dela: y=${Math.max(...aDireita.map((p) => p.y))}`);
console.log(`    sobra ${(FIELD_W - xAcores).toFixed(0)}×${(FIELD_H - Math.max(...aDireita.map((p) => p.y))).toFixed(0)} unidades`);
console.log('');
