#!/usr/bin/env node
/**
 * A régua do contraste. Mede, par a par e nos dois temas, o que a folha de
 * estilos de facto usa.
 *
 * NÃO é um portão: não falha nada e não entra no `npm run build`. É uma fita
 * métrica, como `medir-defeitos.mjs`. `IDENTIDADE.md` §2 diz que cada par usado
 * passa AA em claro e em escuro, medido por um script e não a olho nem por um
 * número copiado de um racional: este é o script, e o número que ele imprime é
 * o que conta. A v2 dizia «no passo de construção» e não era verdade, porque
 * esta régua nunca esteve dentro do `npm run build`; a v3 corrigiu a frase da
 * constituição em vez de deixar a régua a citar uma promessa que ninguém
 * cumpria.
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

/* ============================================================= as duas paletas
 *
 * O ficheiro declara duas, por esta ordem: `:root` nu é a paleta clara, que é a
 * de toda a gente; `:root[data-theme='dark']` é a escura, que é a escolha do
 * leitor.
 *
 * ERAM TRÊS BLOCOS ATÉ 21.08.2026, e a régua tinha uma conferência a mais: o
 * escuro vinha por duas portas — a preferência do sistema e a escolha explícita
 * — e os dois blocos tinham de ser iguais ficha a ficha, porque um tema que muda
 * conforme a porta por onde se entra não é um tema. A Emenda 12 fechou uma das
 * portas: claro por defeito para todos, independentemente da preferência do
 * sistema, e o escuro só pelo controlo do cabeçalho. Com uma porta só, não há
 * dois blocos para comparar; o que a régua mede continua a ser o que a folha de
 * facto usa, nos dois temas que existem.
 */
const ESTADOS = [
  { chave: 'claro', titulo: 'claro (:root)', bloco: /:root\s*\{([\s\S]*?)\n\}/ },
  {
    chave: 'escuro',
    titulo: "escuro, à escolha do leitor (:root[data-theme='dark'])",
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

/**
 * Resolve `var(--x)` dentro da própria paleta, até chegar a uma cor.
 *
 * Existe desde a v3, e é a régua a seguir a folha: os tokens de papel
 * (`--rule`, `--muted`, `--axis`, `--focus`, `--onamber`) passaram a ser
 * DERIVADOS dos três cinzentos e das duas superfícies, para que a folha nomeie
 * a função e não a cor. Sem isto a régua mediria a cadeia «var(--g3)» e
 * atirava; com isto mede o que o navegador vai calcular, que é o que interessa.
 * O escuro resolve contra o escuro, porque a herança já foi feita acima.
 */
function resolveVar(fichas) {
  const out = {};
  for (const k of Object.keys(fichas)) {
    let v = fichas[k];
    for (let i = 0; i < 8; i++) {
      const m = String(v).trim().match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i);
      if (!m) break;
      if (!(m[1] in fichas)) break;
      v = fichas[m[1]];
    }
    out[k] = v;
  }
  return out;
}

/** A paleta de um ficheiro, nos três estados. O escuro herda o claro. */
function paleta(caminho) {
  const css = fs.readFileSync(caminho, 'utf8');
  const claro = lerFichas(css, ESTADOS[0].bloco);
  if (!claro) throw new Error(`não encontrei o bloco :root em ${caminho}`);
  const out = { claro: resolveVar(claro) };
  for (const e of ESTADOS.slice(1)) {
    const f = lerFichas(css, e.bloco);
    out[e.chave] = f ? resolveVar({ ...claro, ...f }) : null;
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
  /* ---------------------------------------------------------------- texto */
  { frente: '--ink', fundo: '--paper', tipo: 'texto', onde: 'body, e a marca' },
  { frente: '--muted', fundo: '--paper', tipo: 'texto', onde: '99 regras, o aparelho todo' },
  { frente: '--paper', fundo: '--ink', tipo: 'texto', onde: ".botao-correcao, .chip.is-read[aria-pressed='true'], a.src-chip:hover" },
  { frente: '--ink', fundo: '--g3', tipo: 'texto', onde: '.deep > summary:hover' },

  /* A palavra do estado, os dois lados do par. Ainda não há regra que a
     escreva: o marcador e a palavra são a régua da etapa 2. Estão aqui porque
     `IDENTIDADE.md` §2 as fixa como as duas únicas cores do sítio, e um par
     que não está nesta lista é um par que ninguém mediu. */
  { frente: '--ochre', fundo: '--paper', tipo: 'texto', onde: 'a palavra «fora do limiar» (IDENTIDADE §2; etapa 2)' },
  { frente: '--cobalt-palavra', fundo: '--paper', tipo: 'texto', onde: 'a palavra «dentro do limiar» (IDENTIDADE §2; etapa 2)' },

  /* ----------------------------------------------------------- interface */
  { frente: '--rule-strong', fundo: '--paper', tipo: 'interface', onde: '15 fronteiras de caixa, .mecanismo-caixa, .linha-excerto' },
  { frente: '--axis', fundo: '--paper', tipo: 'interface', onde: 'eixos dos instrumentos; o quadrado do selo, cheio e a tracejado' },
  { frente: '--g2', fundo: '--paper', tipo: 'interface', onde: '.ld-off i, .map-svg .mun, a janela de publicação da agenda' },
  { frente: '--focus', fundo: '--paper', tipo: 'interface', onde: 'outline: 2px solid var(--focus)' },
  { frente: '--ink', fundo: '--g3', tipo: 'interface', onde: '.compo-bar i sobre a calha' },
  { frente: '--muted', fundo: '--g3', tipo: 'interface', onde: '.mun-banda-seg, a aresta que separa um mandato do seguinte' },
  { frente: '--paper', fundo: '--ink', tipo: 'interface', onde: '.ld-on i, o anel de papel que separa o ponto aceso dos vizinhos' },

  /* O par de estados como objeto de interface. O âmbar sobre papel NÃO passa,
     e é a medição que obriga ao contorno: é ela que está escrita na
     `IDENTIDADE.md` §2 e na `DECISIONS.md` §1.50. */
  { frente: '--amber', fundo: '--paper', tipo: 'interface', onde: 'o marcador «fora do limiar», e é por isto que leva contorno (etapa 2)' },
  { frente: '--onamber', fundo: '--amber', tipo: 'interface', onde: 'o contorno de tinta do marcador âmbar (etapa 2)' },
  { frente: '--cobalt', fundo: '--paper', tipo: 'interface', onde: 'o marcador «dentro do limiar» (etapa 2)' },
  { frente: '--ink', fundo: '--cobalt', tipo: 'interface', onde: 'o contorno do marcador cobalto, que em escuro é o que o segura (etapa 2)' },
  { frente: '--amber', fundo: '--cobalt', tipo: 'interface', onde: 'a distinção entre os dois marcadores, um ao lado do outro' },

  /* --------------------------------------------------------- decoração */
  { frente: '--rule', fundo: '--paper', tipo: 'decoracao', onde: '51 fios de arrumação e molduras de peça' },
  { frente: '--g3', fundo: '--paper', tipo: 'decoracao', onde: '.compo-bar (a calha), .placeholder (as riscas)' },
  { frente: '--rule-strong', fundo: '--paper', tipo: 'decoracao', onde: '.layer-tag::before, .mun-nao-sabe li::before, o «·» da mobília' },
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

for (const estado of ['claro', 'escuro']) {
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
        if (!c) return cinza('n/d'.padEnd(22));
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

/* Há UM escuro, e ele tem de existir. A conferência de que os dois escuros eram
   iguais saiu com o segundo bloco (Emenda 12); o que fica é a pergunta que ainda
   faz sentido, que é se a paleta escura está lá para ser medida. Uma régua que
   imprimisse «n/d» em vinte e uma linhas e não dissesse porquê seria pior do que
   não medir. */
if (!comoJson) {
  console.log('');
  for (const m of medicoes) {
    const escuro = m.paleta['escuro'];
    if (!escuro) {
      console.log(vermelho(`  ${m.nome}: não há bloco :root[data-theme='dark'] para medir.`));
      falhas += 1;
      continue;
    }
    console.log(
      cinza(`  ${m.nome}: uma paleta escura, à escolha do leitor, com ${Object.keys(escuro).length} fichas.`),
    );
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
