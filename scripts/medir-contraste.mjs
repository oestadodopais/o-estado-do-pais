#!/usr/bin/env node
/**
 * A régua do contraste. Mede, par a par e nos dois temas, o que a folha de
 * estilos de facto usa.
 *
 * NÃO é um portão: não falha nada e não entra no `npm run build`. É uma fita
 * métrica, como `medir-defeitos.mjs`. `IDENTIDADE.md` §2 diz que os neutros só
 * podem aquecer se cada par usado passar AA em claro e em escuro, «medido por
 * um script no passo de construção, e não a olho nem por um número copiado de
 * um racional»: este é o script, e o número que ele imprime é o que conta.
 *
 * O QUE MEDE. Contraste WCAG 2.x (luminância relativa, sRGB), com os limiares
 * da 2.1:
 *
 *   texto ................. 4,5:1  (AA)
 *   texto grande .......... 3,0:1  (AA; >= 24px, ou >= 18,66px a negrito)
 *   objeto de interface ... 3,0:1  (AA 1.4.11: fronteiras que o leitor tem de
 *                                   ver para perceber um estado)
 *   decoração ............. sem limiar (separadores, fios de arrumação: o que
 *                                   não desaparece com eles é informação)
 *
 * A LISTA DOS PARES é a da folha, e não a do gosto: cada entrada diz onde é
 * usada em `src/styles/site.css`, para que se possa conferir que a régua mede
 * a página e não uma ideia da página.
 *
 * Uso:
 *   node scripts/medir-contraste.mjs
 *       mede `src/styles/tokens.css`.
 *   node scripts/medir-contraste.mjs a.css b.css
 *       mede cada ficheiro e imprime a tabela lado a lado (antes e depois).
 *   node scripts/medir-contraste.mjs --json
 *       imprime os números, para guardar uma medição.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

/* ============================================================ os três estados
 *
 * O padrão de tema tem três blocos e o ficheiro declara-os por esta ordem:
 * `:root` nu é a paleta clara; o bloco dentro de `@media (prefers-color-scheme:
 * dark)` é o escuro do sistema; `:root[data-theme='dark']` é a escolha
 * explícita. Os dois últimos têm de ter os mesmos valores, e a régua diz-o se
 * não tiverem: um tema que muda conforme a porta por onde se entra não é um
 * tema.
 */
const ESTADOS = [
  { chave: 'claro', titulo: 'claro (:root)', bloco: /:root\s*\{([\s\S]*?)\n\}/ },
  {
    chave: 'escuro-sistema',
    titulo: 'escuro do sistema (@media)',
    bloco: /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme=['"]light['"]\]\)\s*\{([\s\S]*?)\n\s*\}/,
  },
  {
    chave: 'escuro-escolhido',
    titulo: "escuro escolhido (:root[data-theme='dark'])",
    bloco: /:root\[data-theme=['"]dark['"]\]\s*\{([\s\S]*?)\n\}/,
  },
];

function lerFichas(css, bloco) {
  const m = css.match(bloco);
  if (!m) return null;
  const fichas = {};
  for (const linha of m[1].split('\n')) {
    const f = linha.match(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
    if (f) fichas[f[1]] = f[2].trim();
  }
  return fichas;
}

/** A paleta de um ficheiro, nos três estados. O escuro herda o claro. */
function paleta(caminho) {
  const css = fs.readFileSync(caminho, 'utf8');
  const claro = lerFichas(css, ESTADOS[0].bloco);
  if (!claro) throw new Error(`não encontrei o bloco :root em ${caminho}`);
  const out = { claro };
  for (const e of ESTADOS.slice(1)) {
    const f = lerFichas(css, e.bloco);
    out[e.chave] = f ? { ...claro, ...f } : null;
  }
  return out;
}

/* ================================================================ a aritmética
 *
 * WCAG 2.x: canal para linear, luminância relativa, e a razão com o 0,05 de
 * reflexão. Só cores opacas: nenhum par desta lista usa transparência, e uma
 * cor com alfa não tem contraste sem se saber o que está por baixo.
 */
function rgb(valor) {
  const v = valor.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const fn = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (fn) return [Number(fn[1]), Number(fn[2]), Number(fn[3])];
  throw new Error(`não sei ler a cor "${valor}"`);
}

function luminancia([r, g, b]) {
  const c = [r, g, b].map((n) => {
    const s = n / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function razao(a, b) {
  const [la, lb] = [luminancia(rgb(a)), luminancia(rgb(b))];
  const [claro, escuro] = la > lb ? [la, lb] : [lb, la];
  return (claro + 0.05) / (escuro + 0.05);
}

/* ==================================================================== os pares
 *
 * `frente` sobre `fundo`. `tipo` diz que limiar se aplica. `onde` é a prova de
 * que o par existe na folha: uma regra de `src/styles/site.css`.
 */
const TIPOS = {
  texto: { limiar: 4.5, nome: 'texto' },
  'texto-grande': { limiar: 3, nome: 'texto grande' },
  interface: { limiar: 3, nome: 'interface' },
  decoracao: { limiar: 0, nome: 'decoração' },
};

const PARES = [
  { frente: '--ink', fundo: '--paper', tipo: 'texto', onde: 'body' },
  { frente: '--ink', fundo: '--paper-2', tipo: 'texto', onde: '.aparelho, .caixa-*' },
  { frente: '--ink', fundo: '--paper-3', tipo: 'texto', onde: ".chip[aria-pressed='true']" },
  { frente: '--muted', fundo: '--paper', tipo: 'texto', onde: '90 regras, o aparelho todo' },
  { frente: '--muted', fundo: '--paper-2', tipo: 'texto', onde: '.prov-campo, .aparelho' },
  { frente: '--muted', fundo: '--paper-3', tipo: 'texto', onde: '.compo-n sobre .compo-bar' },
  { frente: '--oxblood', fundo: '--paper', tipo: 'texto', onde: '.registo-titulo, .registo-conta' },
  { frente: '--oxblood', fundo: '--paper-2', tipo: 'texto', onde: '.etiqueta-correcao no aparelho' },
  { frente: '--oxblood', fundo: '--paper-3', tipo: 'texto', onde: '.etiqueta-correcao em fundo 3' },
  { frente: '--paper', fundo: '--ink', tipo: 'texto', onde: '.botao-correcao' },
  { frente: '--onyellow', fundo: '--yellow', tipo: 'texto', onde: ".chip.is-read[aria-pressed='true']" },
  { frente: '--rule-strong', fundo: '--paper', tipo: 'decoracao', onde: '.regra-sep, o «·» da mobília' },
  { frente: '--rule', fundo: '--paper', tipo: 'decoracao', onde: '45 fios de arrumação' },
  { frente: '--rule-strong', fundo: '--paper', tipo: 'interface', onde: '19 fronteiras de caixa' },
  { frente: '--axis', fundo: '--paper', tipo: 'interface', onde: 'eixos dos instrumentos; o quadrado a tracejado do selo' },
  { frente: '--dotcol', fundo: '--paper', tipo: 'interface', onde: '.ld-off i, a legenda de portas' },
  { frente: '--yellow', fundo: '--paper', tipo: 'interface', onde: '.ld-on i, as barras de medição' },
  { frente: '--yellow', fundo: '--paper-3', tipo: 'interface', onde: '.compo-bar i sobre a calha' },
  { frente: '--focus', fundo: '--paper', tipo: 'interface', onde: 'outline: 2px solid var(--focus)' },
  { frente: '--focus', fundo: '--paper-2', tipo: 'interface', onde: 'foco dentro do aparelho' },
];

const args = process.argv.slice(2);
const comoJson = args.includes('--json');
const ficheiros = args.filter((a) => !a.startsWith('--'));
if (ficheiros.length === 0) ficheiros.push('src/styles/tokens.css');

const medicoes = ficheiros.map((f) => {
  const caminho = path.isAbsolute(f) ? f : path.join(RAIZ, f);
  return { nome: f, paleta: paleta(caminho) };
});

/** Uma linha da tabela: um par, num estado, em cada ficheiro. */
function medir(par, estado, p) {
  const fichas = p[estado];
  if (!fichas) return null;
  const a = fichas[par.frente];
  const b = fichas[par.fundo];
  if (!a || !b) return null;
  const r = razao(a, b);
  const limiar = TIPOS[par.tipo].limiar;
  return { r, passa: r >= limiar, a, b };
}

const relatorio = { ficheiros: ficheiros, estados: {} };
let falhas = 0;
let avisos = 0;

for (const estado of ['claro', 'escuro-sistema']) {
  const titulo = ESTADOS.find((e) => e.chave === estado).titulo;
  if (!comoJson) {
    console.log('');
    console.log(cinza(`  ${titulo}`));
    console.log(
      cinza('  ' + 'par'.padEnd(30) + 'limiar  ') +
        medicoes.map((m) => cinza(m.nome.split('/').pop().padEnd(22))).join(''),
    );
  }
  relatorio.estados[estado] = [];

  for (const par of PARES) {
    const nome = `${par.frente.replace('--', '')} / ${par.fundo.replace('--', '')}`;
    const tipo = TIPOS[par.tipo];
    const celulas = medicoes.map((m) => medir(par, estado, m.paleta));
    relatorio.estados[estado].push({
      par: nome,
      tipo: par.tipo,
      limiar: tipo.limiar,
      onde: par.onde,
      valores: celulas.map((c) => (c ? Number(c.r.toFixed(2)) : null)),
    });
    if (comoJson) continue;

    const etiqueta = `${nome} ${cinza('(' + tipo.nome + ')')}`;
    const largura = 30 + (etiqueta.length - nome.length - tipo.nome.length - 3);
    const cols = celulas
      .map((c) => {
        if (!c) return cinza('—'.padEnd(22));
        const n = c.r.toFixed(2).replace('.', ',') + ':1';
        if (tipo.limiar === 0) return cinza((n + '  ·').padEnd(22));
        const marca = c.passa ? '✓' : '✗';
        const texto = (n + '  ' + marca).padEnd(22);
        return c.passa ? verde(texto) : vermelho(texto);
      })
      .join('');
    console.log('  ' + etiqueta.padEnd(largura) + String(tipo.limiar).replace('.', ',').padEnd(8) + cols);

    /* Só o último ficheiro medido é o candidato: é sobre ele que se decide. */
    const ultimo = celulas[celulas.length - 1];
    if (ultimo && !ultimo.passa && tipo.limiar > 0) {
      if (par.tipo === 'texto' || par.tipo === 'texto-grande') falhas += 1;
      else avisos += 1;
    }
  }
}

/* Os dois escuros têm de ser o mesmo escuro. */
if (!comoJson) {
  console.log('');
  for (const m of medicoes) {
    const a = m.paleta['escuro-sistema'];
    const b = m.paleta['escuro-escolhido'];
    if (!a || !b) {
      console.log(amarelo(`  ${m.nome}: falta um dos dois blocos escuros.`));
      continue;
    }
    const diferentes = Object.keys(a).filter((k) => a[k] !== b[k]);
    if (diferentes.length) {
      console.log(vermelho(`  ${m.nome}: os dois escuros divergem em ${diferentes.join(', ')}.`));
      falhas += 1;
    } else {
      console.log(cinza(`  ${m.nome}: os dois blocos escuros são iguais, ficha a ficha.`));
    }
  }

  console.log('');
  const alvo = medicoes[medicoes.length - 1].nome;
  if (falhas === 0 && avisos === 0) {
    console.log(verde(`  ✓ ${alvo}: todos os pares usados passam o seu limiar, nos dois temas.`));
  } else {
    console.log(
      `  ${alvo}: ` +
        (falhas ? vermelho(`${falhas} falha(s) de texto`) : verde('0 falhas de texto')) +
        ' · ' +
        (avisos ? amarelo(`${avisos} objeto(s) de interface abaixo de 3:1`) : verde('0 avisos')),
    );
  }
  console.log(cinza('  A régua não falha a construção. O que ela diz decide-se por escrito.'));
  console.log('');
} else {
  console.log(JSON.stringify(relatorio, null, 2));
}
