#!/usr/bin/env node
/**
 * =============================================================================
 * A CÉLULA DO SUBCONJUNTO: nenhum glifo que o sítio usa se perdeu no corte
 * =============================================================================
 *
 * `scripts/subconjunto-tipos.py` corta os oito ficheiros de `public/tipos/` ao
 * que o sítio precisa. Um corte é uma operação que tira coisas, e a maneira de
 * ele correr mal é silenciosa: o ficheiro fica mais pequeno, a página continua a
 * construir-se, e um leitor vê uma caixa no lugar de uma letra. Esta célula é o
 * que impede que isso passe.
 *
 * NÃO é um portão: não entra no `npm run build`. Corre sobre `dist/` e sobre
 * `public/tipos/`, imprime uma linha por família e SAI COM 0 quando nenhuma
 * perdeu nada e com 1 quando alguma perdeu — como as outras células do
 * `tests/`, para que um estrago plantado se veja no código de saída.
 *
 *   node tests/tipos/subconjunto.mjs
 *   node tests/tipos/subconjunto.mjs --tipos <pasta>       (contra outro corte)
 *   node tests/tipos/subconjunto.mjs --caracteres <ficheiro.json>
 *   node tests/tipos/subconjunto.mjs --plantar U+2192      (ver o vermelho)
 *
 * ---------------------------------------------------------------------------
 * O QUE É «UM CARÁCTER QUE O SÍTIO USA»
 * ---------------------------------------------------------------------------
 * Tudo o que `dist/` põe à frente de alguém, nas duas edições: o `<title>` de
 * cada página, a descrição do `<head>`, o texto do corpo, e os atributos que se
 * rendem com letra (`title`, `aria-label`, `alt`, `placeholder`) — mais a cópia
 * de cada cartão de partilha, que é texto desenhado nos píxeis e que nenhuma
 * varredura de HTML apanharia. O `<script>`, o `<style>` e o `<template>` saem:
 * o que lá está não é lido por ninguém com uma letra deste sítio.
 *
 * O espaço, a mudança de linha e a tabulação não entram: um ficheiro de tipos
 * não desenha uma mudança de linha.
 *
 * ---------------------------------------------------------------------------
 * O QUE SE COMPARA, E PORQUE NÃO É «TEM GLIFO»
 * ---------------------------------------------------------------------------
 * A pergunta não é se cada carácter tem glifo em cada ficheiro: **oito dos 160
 * já não tinham antes do corte** — o espaço fino de milhares (U+202F), o «⇄», o
 * «∈», o «⌘», o «⏎», o «┴», o «⚠» e o «✕», que vivem em documentos alojados e
 * que o navegador já ia buscar a uma letra do sistema. Exigir-lhes glifo era
 * exigir ao corte que acrescentasse o que a letra nunca teve.
 *
 * A pergunta é se o corte TIROU alguma coisa: para cada ficheiro e para cada
 * carácter do sítio, se havia glifo antes tem de haver glifo depois. É uma
 * comparação contra o estado de referência escrito em
 * `tests/tipos/COBERTURA-DE-REFERENCIA.json`, medido nos ficheiros inteiros
 * antes de qualquer corte, e é por isso que essa ficha existe: sem ela a célula
 * compararia o corte com ele próprio. Fica em `tests/` e não em `public/tipos/`
 * porque `public/tipos/` é servida ao leitor e cada ficheiro dela tem de ter
 * resumo declarado em `design/especime-v3/TIPOS.md`: uma ficha de prova ali era
 * um ficheiro a mais no feixe de desenho e um endereço público que ninguém
 * pediu.
 *
 * ---------------------------------------------------------------------------
 * A PLANTA
 * ---------------------------------------------------------------------------
 * `--plantar U+XXXX` finge que aquele ponto de código deixou de ter glifo nos
 * ficheiros cortados, e a célula tem de o dizer e sair a 1. É o vermelho que dá
 * sentido ao verde: um detetor que nunca viu um vermelho não provou nada. A
 * planta natural é `U+2192`, a seta que o sítio rende 30 505 vezes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? argv[i + 1] : null;
};
const TIPOS = path.resolve(opcao('--tipos') ?? path.join(RAIZ, 'public', 'tipos'));
const PLANTA = opcao('--plantar');
const ESCREVER = opcao('--caracteres');

/** Os oito ficheiros que o sítio serve, na ordem das fichas de `tokens.css`. */
const FICHEIROS = [
  'spectral/Spectral-Regular.woff2',
  'spectral/Spectral-Italic.woff2',
  'spectral/Spectral-Medium.woff2',
  'spectral/Spectral-SemiBold.woff2',
  'spectral/Spectral-Bold.woff2',
  'spectral-sc/SpectralSC-Regular.woff2',
  'spectral-sc/SpectralSC-SemiBold.woff2',
  'bitter/Bitter[wght].woff2',
];

/** A cobertura dos ficheiros inteiros, medida antes do corte. */
const REFERENCIA = path.join(RAIZ, 'tests', 'tipos', 'COBERTURA-DE-REFERENCIA.json');

/* ------------------------------------------- os caracteres que o sítio usa */

const ATRIBUTOS = ['title', 'aria-label', 'alt', 'placeholder'];
const BRANCOS = new Set([' ', '\n', '\r', '\t']);
const contagem = new Map();
const exemplo = new Map();

function conta(texto, onde) {
  if (!texto) return;
  for (const ch of String(texto)) {
    if (BRANCOS.has(ch)) continue;
    contagem.set(ch, (contagem.get(ch) ?? 0) + 1);
    if (!exemplo.has(ch)) exemplo.set(ch, onde);
  }
}

function ficheirosCom(dir, ext) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const cheio = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...ficheirosCom(cheio, ext));
    else if (e.name.endsWith(ext)) out.push(cheio);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

let paginas = 0;
for (const f of ficheirosCom(DIST, '.html')) {
  paginas++;
  const rel = path.relative(DIST, f);
  const root = parse(fs.readFileSync(f, 'utf8'));
  for (const el of root.querySelectorAll('script,style,template')) el.remove();
  conta(root.querySelector('title')?.text ?? '', rel);
  for (const m of root.querySelectorAll('meta[name],meta[property]')) {
    const nome = m.getAttribute('name') ?? m.getAttribute('property') ?? '';
    if (/description|title|image:alt/.test(nome)) conta(m.getAttribute('content') ?? '', rel);
  }
  const body = root.querySelector('body');
  if (!body) continue;
  conta(body.text, rel);
  for (const el of body.querySelectorAll('*')) {
    for (const a of ATRIBUTOS) {
      const v = el.getAttribute(a);
      if (v) conta(v, rel);
    }
  }
}

let cartoes = 0;
const dirCartoes = path.join(DIST, 'cartoes');
if (fs.existsSync(dirCartoes)) {
  for (const f of fs.readdirSync(dirCartoes)) {
    if (!f.endsWith('.json')) continue;
    cartoes++;
    const j = JSON.parse(fs.readFileSync(path.join(dirCartoes, f), 'utf8'));
    for (const linha of j.copia ?? []) conta(linha, 'cartoes/' + f);
  }
}

const caracteres = [...contagem.entries()]
  .map(([ch, n]) => ({
    ch,
    cp: ch.codePointAt(0),
    hex: 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'),
    n,
    onde: exemplo.get(ch),
  }))
  .sort((a, b) => a.cp - b.cp);

if (ESCREVER) {
  fs.writeFileSync(
    ESCREVER,
    JSON.stringify({ paginas, cartoes, distintos: caracteres.length, caracteres }, null, 1) + '\n',
  );
}

/* ----------------------------------------------- os glifos de cada ficheiro */

/**
 * A `cmap` de um WOFF2, lida pelo `fontTools`. Node não sabe abrir um WOFF2
 * (é brotli por dentro), e escrever um leitor aqui era escrever um segundo
 * `fontTools` pior: chama-se o que corta, que é o mesmo que mede.
 */
function pontosDe(caminho) {
  const guiao =
    'import sys,json\n' +
    'from fontTools.ttLib import TTFont\n' +
    'f=TTFont(sys.argv[1],lazy=True)\n' +
    'p=set()\n' +
    'for t in f["cmap"].tables: p.update(t.cmap.keys())\n' +
    'json.dump(sorted(p), sys.stdout)\n';
  const bruto = execFileSync('python3', ['-c', guiao, caminho], {
    encoding: 'utf8',
    maxBuffer: 1 << 26,
  });
  return new Set(JSON.parse(bruto));
}

const referencia = fs.existsSync(REFERENCIA)
  ? JSON.parse(fs.readFileSync(REFERENCIA, 'utf8'))
  : null;

const linhas = [];
let perdidos = 0;
for (const rel of FICHEIROS) {
  const caminho = path.join(TIPOS, rel);
  if (!fs.existsSync(caminho)) {
    console.error(vermelho(`  ${rel}: não existe em ${TIPOS}`));
    perdidos++;
    continue;
  }
  const pontos = pontosDe(caminho);
  if (PLANTA) pontos.delete(Number.parseInt(PLANTA.replace(/^U\+/i, ''), 16));

  const listaAntes = referencia?.ficheiros?.[rel]?.pontos ?? null;
  const antes = listaAntes === null ? null : new Set(listaAntes);
  const semGlifoAgora = caracteres.filter((c) => !pontos.has(c.cp));
  const perdidosAqui =
    antes === null ? [] : caracteres.filter((c) => antes.has(c.cp) && !pontos.has(c.cp));
  perdidos += perdidosAqui.length;
  linhas.push({
    rel,
    bytes: fs.statSync(caminho).size,
    glifos: pontos.size,
    semGlifoAgora,
    perdidosAqui,
  });
}

console.log('');
console.log(
  cinza(
    `  ${paginas} página(s) e ${cartoes} cartão(ões) lidos · ` +
      `${caracteres.length} caractere(s) distinto(s) · tipos em ${path.relative(RAIZ, TIPOS) || '.'}`,
  ),
);
if (!referencia) {
  console.error(
    vermelho(
      `  não há ${path.relative(RAIZ, REFERENCIA)}: sem a cobertura dos ficheiros inteiros esta ` +
        `célula compararia o corte com ele próprio.`,
    ),
  );
  process.exit(1);
}
if (PLANTA) console.log(cinza(`  planta: ${PLANTA} sem glifo em todos os ficheiros`));
console.log('');
for (const l of linhas) {
  const marca = l.perdidosAqui.length ? vermelho('✗') : verde('✓');
  console.log(
    `  ${marca} ${l.rel.padEnd(38)} ${String(l.bytes).padStart(7)} bytes · ` +
      `${String(l.glifos).padStart(4)} glifos · ` +
      `${caracteres.length - l.semGlifoAgora.length}/${caracteres.length} dos usados` +
      (l.perdidosAqui.length
        ? vermelho(`  perdeu ${l.perdidosAqui.map((c) => c.hex).join(', ')}`)
        : ''),
  );
}
console.log('');

if (perdidos) {
  console.error(
    vermelho(`  O CORTE PERDEU ${perdidos} GLIFO(S) QUE O SÍTIO USA. Alargue o intervalo em ` +
      `scripts/subconjunto-tipos.py e volte a cortar.`),
  );
  console.log('');
  process.exit(1);
}
console.log(
  '  ' + verde('✓') + ' nenhum ficheiro perdeu um glifo que o sítio usa e que ele tinha.',
);
console.log('');
process.exit(0);
