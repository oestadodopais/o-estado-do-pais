#!/usr/bin/env node
/**
 * Portão dos identificadores mortos: o que se importa e não se usa.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * A auditoria de 02.09.2026 (§4) contou «12 identificadores mortos (os dois
 * conhecidos e mais dez)» e a varredura deste bloco encontrou dezoito: os doze
 * mais seis importações de componente em ficheiros `.astro` que a contagem da
 * auditoria não olhava. Nenhum deles fazia mal a uma página. O que eles fazem é
 * pior de outra maneira: um `import { provenienciaIncompleta }` num ficheiro que
 * já não chama a função diz a quem o lê que aquela vista ainda decide alguma
 * coisa sobre proveniência, e não decide. Cinco dos dezoito eram exactamente
 * isso, e foi preciso ler o `git log -p` de cinco ficheiros para saber que
 * nenhuma conferência se tinha perdido com eles.
 *
 * Uma varredura barata poupa essa leitura da próxima vez.
 *
 * ---------------------------------------------------------------------------
 * O QUE SE LÊ, E O QUE NÃO SE LÊ
 * ---------------------------------------------------------------------------
 * Lê-se `src/**` (`.mjs` e `.astro`) e `scripts/**` (`.mjs`). De cada ficheiro
 * saem duas classes de nome:
 *
 *   · as LIGAÇÕES DE IMPORTAÇÃO, nas quatro formas (`X`, `* as N`, `{ a }`,
 *     `{ a as b }`);
 *   · as CONSTANTES DE TOPO não exportadas, declaradas à margem zero (no
 *     `.astro`, à margem zero do frontmatter).
 *
 * Não se lê o que é exportado: um `export const` sem uso NESTE ficheiro pode ter
 * dez noutro, e esta régua lê um ficheiro de cada vez, de propósito. Não se leem
 * variáveis de dentro de funções: isso é trabalho de um analisador a sério, e é
 * o `checkJs` do bloco F0.4 que o há de fazer.
 *
 * ---------------------------------------------------------------------------
 * UMA SEVERIDADE SÓ, SOBRE O TEXTO CRU
 * ---------------------------------------------------------------------------
 * VERMELHO quando o nome não aparece mais nenhuma vez no ficheiro, seja em
 * código ou em comentário. Não há leitura possível em que ele sirva.
 *
 * A CONTAGEM É SOBRE O TEXTO TAL COMO ESTÁ, e é essa a precaução que impede um
 * falso positivo. Se o nome lá está uma segunda vez, seja onde for, esta régua
 * não fecha nada: prefere calar-se sobre um morto a fechar a construção sobre
 * código vivo.
 *
 * O ESCALÃO DE AVISO QUE ESTA RÉGUA TEVE, E PORQUE SAIU (03.09.2026). A primeira
 * forma tinha um segundo escalão: o nome que só reaparecia DENTRO DE UM
 * COMENTÁRIO estava morto como código e vivo como explicação, e valia um aviso.
 * Para o separar era preciso tirar os comentários, e tirá-los sem um analisador
 * a sério engana-se em duas coisas correntes: uma URL num literal
 * (`https://${X}`, em que o `//` come o resto da linha) e um `/*` dentro de uma
 * cadeia. Medido sobre estes 173 ficheiros, o escalão de aviso apontou oito
 * nomes e OS OITO ERAM FALSOS: `SITE_HOST_DISPLAY` está vivo em
 * `src/lib/conjunto.mjs:142`, `WORKS` em `scripts/check-registo.mjs:300`, e
 * assim os outros seis. Um aviso que se engana oito vezes em oito ensina a não
 * o ler, que é como um portão morre. Saiu, e fica escrito que saiu.
 *
 * O CONHECIDO-POSITIVO corre com `--prova`: planta uma importação morta num
 * ficheiro real, confere que a régua a vê, e repõe o ficheiro. Uma régua que
 * nunca viu um vermelho não é conhecida por funcionar.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/* ------------------------------------------------------------- os ficheiros */

/** Os ficheiros de código das duas pastas, por ordem. */
function ficheiros() {
  const out = [];
  const desce = (dir, exts) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
        desce(p, exts);
      } else if (exts.includes(path.extname(e.name))) {
        out.push(p);
      }
    }
  };
  desce(path.join(RAIZ, 'src'), ['.mjs', '.astro']);
  desce(path.join(RAIZ, 'scripts'), ['.mjs']);
  return out;
}

/* ---------------------------------------------------------- as declarações */

/**
 * O frontmatter de um `.astro`: entre o primeiro `---` e o `---` que o fecha.
 * Devolve `[inicio, fim)` em índices do ficheiro, ou null.
 */
function frontmatter(texto) {
  if (!texto.startsWith('---')) return null;
  const fim = texto.indexOf('\n---', 3);
  if (fim < 0) return null;
  return [texto.indexOf('\n', 0) + 1, fim + 1];
}

/** As ligações que uma cláusula de importação introduz. */
function ligacoesDaClausula(clausula) {
  const nomes = [];
  const chavetas = clausula.match(/\{([\s\S]*)\}/);
  const fora = clausula.replace(/\{[\s\S]*\}/, '').trim();

  for (const pedaco of fora.split(',')) {
    const p = pedaco.trim().replace(/,$/, '');
    if (!p) continue;
    const ns = p.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
    if (ns) {
      nomes.push(ns[1]);
      continue;
    }
    if (/^[A-Za-z_$][\w$]*$/.test(p)) nomes.push(p);
  }

  if (chavetas) {
    for (const pedaco of chavetas[1].split(',')) {
      const p = pedaco.trim();
      if (!p) continue;
      const comAs = p.match(/^[\w$]+\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (comAs) nomes.push(comAs[1]);
      else if (/^[A-Za-z_$][\w$]*$/.test(p)) nomes.push(p);
    }
  }
  return nomes;
}

/**
 * As declarações de um ficheiro: importações e constantes de topo.
 * @returns {{ nome: string, classe: 'importacao'|'constante', linha: number }[]}
 */
function declaracoes(texto, ext) {
  const out = [];
  const linhaDe = (i) => texto.slice(0, i).split('\n').length;

  /* As importações, em qualquer parte do ficheiro (num `.astro` vivem no
     frontmatter; num `.mjs` no topo). `import 'x'` sem cláusula não liga nada. */
  for (const m of texto.matchAll(/\bimport\s+([\s\S]*?)\s+from\s*['"][^'"]+['"]/g)) {
    for (const nome of ligacoesDaClausula(m[1])) {
      out.push({ nome, classe: 'importacao', linha: linhaDe(m.index) });
    }
  }

  /* As constantes de topo, à margem zero e sem `export`. Num `.astro` só as do
     frontmatter: um `const` à margem zero dentro do template não existe. */
  const fm = ext === '.astro' ? frontmatter(texto) : null;
  const [de, ate] = ext === '.astro' ? (fm ?? [0, 0]) : [0, texto.length];
  const regiao = texto.slice(de, ate);
  for (const m of regiao.matchAll(/^const\s+([A-Za-z_$][\w$]*)\s*=/gm)) {
    out.push({ nome: m[1], classe: 'constante', linha: linhaDe(de + m.index) });
  }

  return out;
}

/* --------------------------------------------------------------- a contagem */

/** Quantas vezes o nome aparece como palavra inteira. */
function conta(texto, nome) {
  const re = new RegExp(`(?<![\\w$])${nome.replace(/\$/g, '\\$')}(?![\\w$])`, 'g');
  return (texto.match(re) ?? []).length;
}

/* ------------------------------------------------------------------ a régua */

/** Lê um ficheiro e devolve os identificadores que nunca lá reaparecem. */
export function mortosDe(caminho) {
  const texto = fs.readFileSync(caminho, 'utf8');
  const ext = path.extname(caminho);
  const mortos = [];

  for (const d of declaracoes(texto, ext)) {
    /* Exportado: pode viver noutro ficheiro, e esta régua lê um de cada vez. */
    if (new RegExp(`export\\s+(const|function|class)\\s+${d.nome}(?![\\w$])`).test(texto)) continue;
    if (new RegExp(`export\\s*\\{[^}]*(?<![\\w$])${d.nome}(?![\\w$])`).test(texto)) continue;

    /* A própria declaração conta uma vez; o resto são usos. */
    if (conta(texto, d.nome) - 1 > 0) continue;
    mortos.push(d);
  }
  return { mortos };
}

/* ------------------------------------------------------ o conhecido-positivo */

/**
 * Planta uma importação morta num ficheiro real, confere que a régua a vê, e
 * repõe o ficheiro. Corre com `--prova`.
 */
function prova() {
  /* O ESTRAGO PLANTA-SE FORA DA ÁRVORE, e não num ficheiro do sítio. A primeira
     forma escrevia a importação morta em `src/lib/jsonld.mjs` e repunha-o num
     `finally`: funciona, e deixa uma janela em que um ficheiro do repositório
     tem código que ninguém escreveu. Uma construção a correr ao lado leria essa
     janela. O ficheiro temporário prova o mesmo e não toca em nada. */
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-mortos-'));
  const alvo = path.join(dir, 'plantado.mjs');
  let visto = false;
  try {
    fs.writeFileSync(
      alvo,
      `import { POR_VERIFICAR as ESTRAGO_PLANTADO } from '../src/lib/ledger.mjs';\n` +
        `export const vivo = 1;\n`,
    );
    visto = mortosDe(alvo).mortos.some((d) => d.nome === 'ESTRAGO_PLANTADO');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (!visto) {
    console.error(
      vermelho('\n  IDENTIFICADORES MORTOS · a prova falhou: a régua não viu a importação plantada.\n') +
        cinza('  Uma régua que não vê um estrago não prova nada sobre os que não encontra.\n'),
    );
    process.exit(1);
  }
  console.log(cinza('  prova ✓ a importação plantada foi vista, fora da árvore do sítio.'));
}

/* ---------------------------------------------------------------- a corrida */

if (process.argv.includes('--prova')) prova();

const todos = ficheiros();
const mortos = [];
for (const f of todos) {
  for (const d of mortosDe(f).mortos) mortos.push({ f, ...d });
}

console.log('');
if (mortos.length) {
  console.error(vermelho(`  IDENTIFICADORES MORTOS · ${mortos.length} em ${todos.length} ficheiros`));
  console.error('');
  for (const m of mortos) {
    console.error(
      `    ${vermelho('✗')} ${path.relative(RAIZ, m.f)}:${m.linha} · ${m.classe} "${m.nome}" ` +
        `declarada e nunca usada, nem em comentário.`,
    );
  }
  console.error('');
  console.error(
    cinza(
      '    Uma importação que ninguém chama diz a quem lê que o ficheiro faz uma coisa que ele\n' +
        '    já não faz. Tire-a, ou volte a usá-la.',
    ),
  );
  console.error('');
  process.exit(1);
}

console.log(
  '  ' +
    verde('✓') +
    ` identificadores · ${todos.length} ficheiro(s) lidos, nenhuma importação nem constante de topo morta`,
);
console.log('');
