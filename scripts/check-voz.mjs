#!/usr/bin/env node
/**
 * O PORTÃO DA VOZ · «o sítio a explicar-se» deixa de depender de um leitor.
 *
 * A Emenda 15 manda a autorreferência a zero fora do Método, do Sobre e do
 * recibo; a Emenda 18 acrescenta que «nada existe para mostrar diligência».
 * Até 26.08.2026 as duas regras eram medidas por uma régua que não fecha nada
 * (`scripts/medir-defeitos.mjs`) e conferidas por uma célula de matriz que corre
 * fora da construção (`tests/inicio/matriz.mjs`). Uma frase de autorreferência
 * DECLARADA numa página de concelho passava pelas duas peneiras: foi assim que
 * «É a lei que o define, não este sítio.» viveu em 616 páginas.
 *
 * Este passo entra na cadeia do `build` e do `verify`, e fecha a construção em
 * quatro casos:
 *
 *   1. **o tripwire** · uma frase da casa com um marcador de
 *      `design/especime-v3/VOZ-MARCADORES.md` que não está declarada como
 *      autorreferência nem consta das exceções daquele ficheiro;
 *   2. **a contagem** · autorreferência acima de zero em qualquer rota medida;
 *   3. **o por classificar** · um bloco de texto de uma rota inventariada que
 *      não está no `INVENTARIO-FRASES.md`;
 *   4. **o ficheiro dos marcadores** · um marcador ou uma exceção sem razão
 *      escrita, ou um modo ou tipo que não existe.
 *
 * A varredura não é feita aqui: é a da régua, corrida com `--json`, que é a
 * mesma que a matriz já usa. Duas implementações da mesma definição diriam a
 * mesma coisa por construção, e a régua é onde a definição está escrita.
 *
 * Uso:  node scripts/check-voz.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DA VOZ · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const saida = execFileSync(process.execPath, [path.join(RAIZ, 'scripts', 'medir-defeitos.mjs'), '--json'], {
  encoding: 'utf8',
  maxBuffer: 128 * 1024 * 1024,
});
const medicao = JSON.parse(saida);
const voz = medicao.voz;
const casa = medicao.frases_da_casa;
const rotas = Object.entries(casa.por_rota);

const erros = [];

/* 4 · o ficheiro dos marcadores */
for (const e of voz.erros) erros.push(`${voz.ficheiro}: ${e}`);

/* 1 · o tripwire */
for (const a of voz.achados) {
  erros.push(
    `frase com marcador da voz e sem declaração de autorreferência\n` +
      `      marcador(es): ${a.marcadores.join(' · ')}\n` +
      `      rota: ${a.rota}${a.rotas > 1 ? ` (e mais ${a.rotas - 1})` : ''}\n` +
      `      classe declarada: ${a.classe ?? '(por classificar)'}\n` +
      `      «${a.texto}»`,
  );
}

/* 2 · a contagem */
for (const [rota, r] of rotas) {
  if (r.por_classe.autorreferencia > 0) {
    erros.push(
      `autorreferência ${r.por_classe.autorreferencia} na rota ${rota} (a Emenda 15 exige zero em todas as rotas medidas)`,
    );
  }
}

/* 3 · o por classificar */
for (const [rota, r] of rotas) {
  for (const t of r.nao_classificados) {
    erros.push(`bloco por classificar em ${rota}: «${t}»`);
  }
}

if (!casa.inventario_existe) erros.push(`não existe ${casa.inventario}`);

console.log('');
if (erros.length) {
  console.error(vermelho(`  PORTÃO DA VOZ · ${erros.length} problema(s)\n`));
  for (const e of erros.slice(0, 40)) console.error(vermelho('    · ') + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}`));
  console.error('');
  process.exit(1);
}

console.log(
  verde('  voz ✓ ') +
    `${voz.marcadores} marcadores · ${voz.excecoes} exceções (${voz.excecoes_de_registo} de registo) · ` +
    `${voz.frases_varridas} frases distintas, ${voz.ocorrencias_varridas} ocorrências em ${rotas.length} rotas · ` +
    `autorreferência 0 · nada por classificar`,
);
if (voz.excecoes_por_usar.length) {
  console.log(cinza(`        ${voz.excecoes_por_usar.length} exceção(ões) por exercer, e o ficheiro di-lo:`));
  for (const e of voz.excecoes_por_usar) console.log(cinza(`        · «${e.slice(0, 90)}»`));
}
console.log('');
