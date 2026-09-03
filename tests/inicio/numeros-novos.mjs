#!/usr/bin/env node
/**
 * =============================================================================
 * O INVENTÁRIO DOS ALGARISMOS DE UMA CONSTRUÇÃO · a medida A13 do F1.1
 * =============================================================================
 *
 * «Nenhum número novo: o inventário de valores selados do sítio (`dist/` inteiro)
 * antes e depois, igual em conjunto; o livro-razão intacto.»
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ISTO NÃO CONTA SÓ `data-claim`
 * ---------------------------------------------------------------------------
 * A primeira passagem do F1.1 contou os identificadores do livro-razão e mais
 * nada, e a leitura a frio do Codex apanhou o buraco (Blocking 4): o bloco
 * acrescentou algarismos visíveis que NÃO são linhas do livro-razão — a posição
 * de cada cartão na faixa («1 de 21») e a designação e o identificador do
 * documento da Comissão nas duas frases de contexto. São legítimos, cada um com
 * a sua origem declarada, mas uma prova de «nenhum número novo» que não os vê
 * não podia tê-los apanhado se fossem ilegítimos.
 *
 * A casa tem três maneiras de um algarismo entrar numa página, e esta régua
 * conta as três, uma coluna por cada:
 *
 *   `data-claim="<id>"`        o valor de uma linha do livro-razão;
 *   `data-prova="<chave>"`     uma contagem do próprio sítio, que o portão reconta;
 *   `data-nonledger="<motivo>"` contexto estrutural, com o motivo em `ledger/allowlist.yml`;
 *   `data-verbatim="<chave>"`  uma citação transcrita, conferida carácter a carácter.
 *
 * O que a régua imprime é o conjunto e a contagem de cada classe. Comparados o
 * «antes» e o «depois», o relatório diz o que entrou, o que saiu, e com que
 * razão declarada.
 *
 *   node tests/inicio/numeros-novos.mjs
 *   node tests/inicio/numeros-novos.mjs --json <ficheiro>
 *   OEDP_DIST=<outra construção> node tests/inicio/numeros-novos.mjs
 *
 * NÃO É UM PORTÃO: não entra no `build` nem no `verify`, e sai sempre a 0 quando
 * consegue ler a construção. Quem compara os dois lados é o relatório, que é
 * onde a comparação tem os dois.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');

const argv = process.argv.slice(2);
const i = argv.indexOf('--json');
const FICHEIRO = i >= 0 ? argv[i + 1] : null;
/* `--so <padrão>` restringe a varredura aos ficheiros cujo caminho, relativo à
   construção, começa por um dos padrões separados por vírgulas. Existe por uma
   razão medida: quando duas famílias de páginas entram no `main` no mesmo dia, a
   contagem do sítio inteiro mistura os dois blocos, e a prova de «nenhum número
   novo» de um bloco tem de poder olhar para as páginas DELE. O relatório imprime
   as duas leituras: a do sítio inteiro e a das rotas do bloco. */
const j = argv.indexOf('--so');
const SO = j >= 0 ? String(argv[j + 1]).split(',').map((x) => x.trim()).filter(Boolean) : null;

if (!fs.existsSync(DIST)) {
  console.error(`não existe ${DIST}. Corra o build primeiro.`);
  process.exit(2);
}

const MARCAS = ['data-claim', 'data-prova', 'data-nonledger', 'data-verbatim'];

/** Todos os `.html` da construção, sem seguir ligações simbólicas. */
function paginas(raiz) {
  const fora = [];
  const pilha = [raiz];
  while (pilha.length) {
    const d = pilha.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const c = path.join(d, e.name);
      if (e.isDirectory()) pilha.push(c);
      else if (e.isFile() && c.endsWith('.html')) {
        const rel = path.relative(raiz, c);
        if (!SO || SO.some((x) => rel === x || rel.startsWith(x))) fora.push(c);
      }
    }
  }
  return fora.sort();
}

const contas = Object.fromEntries(MARCAS.map((m) => [m, new Map()]));
const fs_paginas = paginas(DIST);
for (const f of fs_paginas) {
  const h = fs.readFileSync(f, 'utf8');
  for (const marca of MARCAS) {
    const re = new RegExp(`${marca}="([^"]*)"`, 'g');
    for (const m of h.matchAll(re)) {
      const c = contas[marca];
      c.set(m[1], (c.get(m[1]) ?? 0) + 1);
    }
  }
}

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const saida = { dist: DIST, so: SO, paginas: fs_paginas.length, classes: {} };
console.log('');
console.log(
  `  ${verde('inventário')} ${fs_paginas.length} página(s) em ${DIST}` +
    (SO ? cinza(`  (só ${SO.join(', ')})`) : ''),
);
for (const marca of MARCAS) {
  const c = contas[marca];
  const total = [...c.values()].reduce((a, b) => a + b, 0);
  saida.classes[marca] = {
    distintos: c.size,
    ocorrencias: total,
    valores: Object.fromEntries([...c.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  };
  const lista = [...c.keys()].sort();
  console.log(
    `  ${marca.padEnd(16)} ${String(c.size).padStart(5)} distinto(s) · ${String(total).padStart(7)} ocorrência(s)` +
      (c.size && c.size <= 24 ? cinza(`  ${lista.join(', ')}`) : ''),
  );
}
console.log('');

if (FICHEIRO) fs.writeFileSync(FICHEIRO, JSON.stringify(saida, null, 2));
