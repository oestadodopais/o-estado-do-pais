#!/usr/bin/env node
/**
 * Portão dos identificadores mortos: o que se declara e não se usa.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * A auditoria de 02.09.2026 (§4) contou «12 identificadores mortos (os dois
 * conhecidos e mais dez)» e a varredura deste bloco removeu vinte: dezanove na
 * primeira passagem, e mais um (`lang` em `SinalDasFontes.astro`, uma propriedade
 * desestruturada que nada lia) que só a cobertura da desestruturação desta
 * segunda passagem podia ver. Nenhum deles fazia mal a uma página. O que eles fazem é pior de outra maneira: um
 * `import { provenienciaIncompleta }` num ficheiro que já não chama a função diz
 * a quem o lê que aquela vista ainda decide alguma coisa sobre proveniência, e
 * não decide. Cinco dos dezanove eram exactamente isso, e foi preciso ler o
 * `git log -p` de cinco ficheiros para saber que nenhuma conferência se tinha
 * perdido com eles. Uma varredura barata poupa essa leitura da próxima vez.
 *
 * ---------------------------------------------------------------------------
 * O QUE SE CONTA COMO USO, E PORQUE É SÓ O CÓDIGO (segunda passagem, 03.09.2026)
 * ---------------------------------------------------------------------------
 * A primeira passagem contava sobre o TEXTO CRU, com comentários e cadeias
 * dentro, por medo de um falso positivo. A leitura a frio mostrou o preço: «any
 * second occurrence in a comment, string, fixture text, or another declaration
 * counts as use by design». Um nome citado num comentário, ou que por acaso
 * apareça dentro de uma cadeia, ficava vivo para a régua e morto para o
 * programa. Era a régua a ser generosa com exactamente a classe de coisa que
 * existe para apanhar.
 *
 * Passa a contar sobre o CÓDIGO, e só. `soCodigo()` é uma máquina de estados que
 * apaga comentários de linha e de bloco, o conteúdo das cadeias («'», «"» e
 * «`») e os literais de expressão regular, e que PRESERVA o que está dentro de
 * `${…}` num literal de gabarito, porque isso é código. É o que resolve, sem
 * heurística, o falso positivo que fez a primeira passagem recuar: em
 * `` `https://${SITE_HOST_DISPLAY}/metodo` `` o `//` já não é um comentário
 * porque está dentro de uma cadeia, e o `${…}` continua a contar como uso.
 *
 * ---------------------------------------------------------------------------
 * O QUE SE LÊ
 * ---------------------------------------------------------------------------
 * `src/**` (`.mjs` e `.astro`) e `scripts/**` (`.mjs`). De cada ficheiro saem as
 * ligações e as declarações não exportadas, em todas as formas que a leitura a
 * frio listou como cegas na primeira passagem:
 *
 *   importações   `X`, `* as N`, `{ a }`, `{ a as b }`, e as misturas;
 *   variáveis     `const`, `let` e `var`, a qualquer indentação, incluindo a
 *                 desestruturação (`{ a, b: c, d = 1, ...resto }`, `[a, , b]`);
 *   funções       `function N`, `async function N`, `function* N`;
 *   classes       `class N`.
 *
 * Não se lê o que é EXPORTADO: um `export const` sem uso neste ficheiro pode ter
 * dez noutro, e esta régua lê um ficheiro de cada vez, de propósito. Não se leem
 * parâmetros de função nem ligações de `catch`: um parâmetro por usar é uma
 * assinatura, não um esquecimento.
 *
 * Num `.astro`, o frontmatter passa pela máquina de estados e o gabarito leva um
 * tratamento próprio: fora os comentários de HTML e os valores de atributo entre
 * aspas (que são literais e não podem nomear nada), fica tudo, porque
 * `<Componente …>` e `{expressão}` são usos.
 *
 * ---------------------------------------------------------------------------
 * OS CONHECIDOS-POSITIVOS, QUE CORREM SEMPRE
 * ---------------------------------------------------------------------------
 * `--prova` monta um DIRECTÓRIO TEMPORÁRIO fora da árvore do sítio, escreve lá
 * um ficheiro por cada forma que a leitura a frio apontou como cega, e exige que
 * a régua veja todas. Fora da árvore porque a primeira passagem plantava o
 * estrago num ficheiro do repositório e repunha-o num `finally`: funciona, e
 * deixa uma janela em que um ficheiro do sítio tem código que ninguém escreveu.
 * O `verify` corre-o sempre; uma régua que nunca viu um vermelho não é conhecida
 * por funcionar.
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

function ficheiros(dirs = [['src', ['.mjs', '.astro']], ['scripts', ['.mjs']]]) {
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
  for (const [d, exts] of dirs) {
    const raiz = path.join(RAIZ, d);
    if (fs.existsSync(raiz)) desce(raiz, exts);
  }
  return out;
}

/* -------------------------------------------------- o código, e só o código */

/**
 * Um `/` abre uma expressão regular, ou divide?
 *
 * A regra é a que os analisadores usam: depende do que vem ANTES. Depois de um
 * valor (um nome, um número, `)`, `]`, `}`) é divisão; depois de pontuação de
 * operador ou de uma palavra-chave é uma expressão regular. As palavras-chave
 * têm de estar aqui: sem elas, o `return /[",\r\n]/.test(s)` de
 * `src/lib/conjunto.mjs:188` era lido como divisão, a aspa de dentro da classe
 * abria uma cadeia, e o resto do ficheiro desaparecia. Foi assim que a primeira
 * forma desta máquina apontou 56 mortos de que 54 estavam vivos.
 */
const PALAVRAS_ANTES_DE_REGEX = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'case', 'do', 'else', 'yield',
  'await', 'new', 'delete', 'void', 'throw',
]);

function abreRegex(saida) {
  let i = saida.length - 1;
  while (i >= 0 && ' \n\t\r'.includes(saida[i])) i--;
  if (i < 0) return true;
  const c = saida[i];
  if (/[\w$]/.test(c)) {
    let j = i;
    while (j >= 0 && /[\w$]/.test(saida[j])) j--;
    return PALAVRAS_ANTES_DE_REGEX.has(saida.slice(j + 1, i + 1));
  }
  return '(,=:[!&|?{};+-*%~^<>'.includes(c);
}

/**
 * Apaga comentários, o conteúdo das cadeias e as expressões regulares, e
 * preserva o que está dentro de `${…}`. Devolve uma cadeia do MESMO comprimento
 * (o que sai é substituído por espaços), para que os índices continuem a valer.
 */
export function soCodigo(texto) {
  const fora = Array.from(texto);
  const apaga = (de, ate) => {
    for (let i = de; i < ate && i < fora.length; i++) if (fora[i] !== '\n') fora[i] = ' ';
  };
  const pilha = []; // os `${` abertos dentro de gabaritos
  let emClasse = false; // dentro de um `[…]` de uma expressão regular
  let i = 0;
  let estado = 'codigo';
  let inicio = 0;
  let saida = '';

  while (i < texto.length) {
    const c = texto[i];
    const d = texto[i + 1];
    if (estado === 'codigo') {
      if (c === '/' && d === '/') { estado = 'linha'; inicio = i; i += 2; continue; }
      if (c === '/' && d === '*') { estado = 'bloco'; inicio = i; i += 2; continue; }
      if (c === "'" || c === '"') { estado = c; inicio = i; i++; continue; }
      if (c === '`') { estado = '`'; inicio = i; i++; continue; }
      if (c === '/' && abreRegex(saida)) {
        estado = 'regex'; inicio = i; emClasse = false; i++; continue;
      }
      if (c === '}' && pilha.length) { estado = '`'; inicio = i; pilha.pop(); i++; continue; }
      saida += c;
      i++;
      continue;
    }
    if (estado === 'linha') {
      if (c === '\n') { apaga(inicio, i); estado = 'codigo'; saida += '\n'; }
      i++;
      continue;
    }
    if (estado === 'bloco') {
      if (c === '*' && d === '/') { apaga(inicio, i + 2); estado = 'codigo'; i += 2; continue; }
      if (c === '\n') saida += '\n';
      i++;
      continue;
    }
    if (estado === "'" || estado === '"') {
      if (c === '\\') { i += 2; continue; }
      if (c === estado) { apaga(inicio, i + 1); estado = 'codigo'; }
      i++;
      continue;
    }
    if (estado === 'regex') {
      /* UM `/` DENTRO DE UM `[…]` NÃO FECHA A EXPRESSÃO. Sem isto, o
         `const PONTUACAO_FORA = /^[\s"'…/|·]+…/g` de `gate-html.mjs:663`
         terminava na barra de dentro da classe, e as aspas que vinham a seguir
         abriam uma cadeia que engolia o corpo de `limpaToken()` e com ele o uso
         da própria constante. Era a razão de a régua apontar como mortos sete
         nomes de `gate-html.mjs` que estão vivos. */
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') { estado = 'codigo'; emClasse = false; i++; continue; }
      if (c === '[') emClasse = true;
      else if (c === ']') emClasse = false;
      else if (c === '/' && !emClasse) { apaga(inicio, i + 1); estado = 'codigo'; }
      i++;
      continue;
    }
    if (estado === '`') {
      if (c === '\\') { i += 2; continue; }
      if (c === '$' && d === '{') {
        apaga(inicio, i + 2);
        pilha.push(true);
        estado = 'codigo';
        saida += ' ';
        i += 2;
        continue;
      }
      if (c === '`') { apaga(inicio, i + 1); estado = 'codigo'; }
      if (c === '\n') saida += '\n';
      i++;
      continue;
    }
  }
  if (estado !== 'codigo') apaga(inicio, texto.length);
  return fora.join('');
}

/** O frontmatter de um `.astro`, e o gabarito, cada um tratado à sua maneira. */
function codigoDeAstro(texto) {
  let fm = [0, 0];
  if (texto.startsWith('---')) {
    const fim = texto.indexOf('\n---', 3);
    if (fim >= 0) fm = [texto.indexOf('\n') + 1, fim + 1];
  }
  const gabarito = texto
    .slice(fm[1])
    .replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
    /* O VALOR DE UM ATRIBUTO NÃO ATRAVESSA UMA LINHA, e a classe negada tem de
       o dizer. Com `[^"]*` a apanhar `\n`, uma aspa desirmanada no gabarito
       apagava tudo até à seguinte: em `BandaDaRegiao.astro` comia 180 símbolos e
       com eles o único uso de `rotulados`, que a régua passou a dar como morto.
       Limitado à linha, o pior que acontece é não apagar um literal, e isso só
       custa uma detecção a menos. */
    .replace(/=\s*"[^"\n]*"/g, (m) => ' '.repeat(m.length))
    .replace(/=\s*'[^'\n]*'/g, (m) => ' '.repeat(m.length));
  return texto.slice(0, fm[0]).replace(/[^\n]/g, ' ') + soCodigo(texto.slice(fm[0], fm[1])) + gabarito;
}

/**
 * Devolve `{ paraDeclaracoes, paraUsos }`.
 *
 * Num `.astro` o gabarito NÃO declara nada: `class="chip"` é um atributo de HTML
 * e não uma classe de JavaScript, e lê-lo como declaração dava «classe "chip"»,
 * «classe "href"», «classe "aria"» e mais uma dúzia de nomes que são atributos.
 * O gabarito conta para os USOS, porque `<Componente …>` e `{expressão}` são
 * usos, e não conta para as declarações.
 */
function codigoDe(texto, ext) {
  if (ext !== '.astro') {
    const c = soCodigo(texto);
    return { paraDeclaracoes: c, paraUsos: c };
  }
  let fm = [0, 0];
  if (texto.startsWith('---')) {
    const fim = texto.indexOf('\n---', 3);
    if (fim >= 0) fm = [texto.indexOf('\n') + 1, fim + 1];
  }
  const cabeca = soCodigo(texto.slice(fm[0], fm[1]));
  /* O ENCHIMENTO GUARDA AS MUDANÇAS DE LINHA, senão o número que a régua imprime
     vem uma linha acima do sítio onde a declaração está. */
  const enchimento = texto.slice(0, fm[0]).replace(/[^\n]/g, ' ');
  return { paraDeclaracoes: enchimento + cabeca, paraUsos: codigoDeAstro(texto) };
}

/* ---------------------------------------------------------- as declarações */

/** Os nomes que um padrão de ligação introduz. */
function nomesDoPadrao(p) {
  const nomes = [];
  /* `{ a, b: c, d = 1, ...resto }` e `[a, , b]`, sem os nomes de chave. */
  for (const m of p.matchAll(/(?:^|[,{[])\s*(?:\.\.\.)?\s*([A-Za-z_$][\w$]*)\s*(?::\s*(?:\.\.\.)?\s*([A-Za-z_$][\w$]*))?/g)) {
    nomes.push(m[2] ?? m[1]);
  }
  return nomes;
}

/** Onde acaba um padrão que abre em `{` ou `[`. */
function fechaPadrao(texto, i) {
  const pares = { '{': '}', '[': ']' };
  const abre = texto[i];
  let n = 0;
  for (let j = i; j < texto.length; j++) {
    if (texto[j] === abre) n++;
    else if (texto[j] === pares[abre]) {
      n--;
      if (n === 0) return j + 1;
    }
  }
  return -1;
}

/**
 * As declarações de um ficheiro.
 * @returns {{ nome: string, classe: string, linha: number, ligacao: string }[]}
 */
function declaracoes(codigo) {
  const out = [];
  const linhaDe = (i) => codigo.slice(0, i).split('\n').length;
  const exportado = (i) => /\bexport\s+(?:default\s+)?$/.test(codigo.slice(Math.max(0, i - 30), i));

  /* importações */
  for (const m of codigo.matchAll(/\bimport\s+([\s\S]*?)\s+from\s+/g)) {
    const clausula = m[1];
    const chavetas = clausula.match(/\{([\s\S]*)\}/);
    for (const pedaco of clausula.replace(/\{[\s\S]*\}/, '').split(',')) {
      const p = pedaco.trim();
      if (!p) continue;
      const ns = p.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (ns) out.push({ nome: ns[1], classe: 'importação', linha: linhaDe(m.index), ligacao: p });
      else if (/^[A-Za-z_$][\w$]*$/.test(p)) out.push({ nome: p, classe: 'importação', linha: linhaDe(m.index), ligacao: p });
    }
    if (chavetas) {
      for (const pedaco of chavetas[1].split(',')) {
        const p = pedaco.trim();
        if (!p) continue;
        const comAs = p.match(/^[\w$]+\s+as\s+([A-Za-z_$][\w$]*)$/);
        if (comAs) out.push({ nome: comAs[1], classe: 'importação', linha: linhaDe(m.index), ligacao: p });
        else if (/^[A-Za-z_$][\w$]*$/.test(p)) out.push({ nome: p, classe: 'importação', linha: linhaDe(m.index), ligacao: p });
      }
    }
  }

  /* const / let / var, com nome ou com padrão */
  for (const m of codigo.matchAll(/\b(const|let|var)\s+/g)) {
    const i = m.index + m[0].length;
    if (exportado(m.index)) continue;
    if (/\bfor\s*\($/.test(codigo.slice(Math.max(0, m.index - 8), m.index))) continue;
    const c = codigo[i];
    if (c === '{' || c === '[') {
      const fim = fechaPadrao(codigo, i);
      if (fim < 0) continue;
      const padrao = codigo.slice(i, fim);
      for (const nome of nomesDoPadrao(padrao)) {
        out.push({ nome, classe: m[1], linha: linhaDe(i), ligacao: padrao });
      }
    } else {
      const nome = codigo.slice(i).match(/^([A-Za-z_$][\w$]*)/);
      if (nome) out.push({ nome: nome[1], classe: m[1], linha: linhaDe(i), ligacao: nome[1] });
    }
  }

  /* function / class */
  for (const m of codigo.matchAll(/\b(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/g)) {
    if (exportado(m.index)) continue;
    out.push({ nome: m[1], classe: 'função', linha: linhaDe(m.index), ligacao: m[1] });
  }
  for (const m of codigo.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)) {
    if (exportado(m.index)) continue;
    out.push({ nome: m[1], classe: 'classe', linha: linhaDe(m.index), ligacao: m[1] });
  }

  return out;
}

const conta = (texto, nome) =>
  (texto.match(new RegExp(`(?<![\\w$])${nome.replace(/\$/g, '\\$')}(?![\\w$])`, 'g')) ?? []).length;

/* ------------------------------------------------------------------ a régua */

/** Os identificadores de um ficheiro que nunca reaparecem no seu código. */
export function mortosDe(caminho) {
  const texto = fs.readFileSync(caminho, 'utf8');
  const { paraDeclaracoes, paraUsos } = codigoDe(texto, path.extname(caminho));
  const mortos = [];
  const vistos = new Set();

  for (const d of declaracoes(paraDeclaracoes)) {
    if (vistos.has(d.nome)) continue;
    vistos.add(d.nome);
    if (new RegExp(`export\\s*\\{[^}]*(?<![\\w$])${d.nome}(?![\\w$])`).test(paraUsos)) continue;
    /* a própria ligação conta as vezes que lá aparece; o resto são usos */
    if (conta(paraUsos, d.nome) - conta(d.ligacao, d.nome) > 0) continue;
    mortos.push(d);
  }
  return { mortos };
}

/* ------------------------------------------------------ o conhecido-positivo */

/** Um ficheiro por forma cega, num directório temporário fora da árvore. */
const CASOS = [
  ['importacao.mjs', "import { POR_VERIFICAR as MORTO } from './x.mjs';\nexport const vivo = 1;\n", 'MORTO'],
  ['importacao-omissao.mjs', "import MORTO from './x.mjs';\nexport const vivo = 1;\n", 'MORTO'],
  ['let.mjs', 'export function f() {\n  let MORTO = 1;\n  return 2;\n}\n', 'MORTO'],
  ['var.mjs', 'export function f() {\n  var MORTO = 1;\n  return 2;\n}\n', 'MORTO'],
  ['funcao.mjs', 'function MORTO() { return 1; }\nexport const vivo = 2;\n', 'MORTO'],
  ['classe.mjs', 'class MORTO {}\nexport const vivo = 2;\n', 'MORTO'],
  ['desestruturado.mjs', 'export function f(o) {\n  const { a: MORTO } = o;\n  return 1;\n}\n', 'MORTO'],
  ['indentado.mjs', 'export function f() {\n    const MORTO = 1;\n    return 2;\n}\n', 'MORTO'],
  ['so-comentario.mjs', "import { x as MORTO } from './x.mjs';\n// o MORTO só aqui\nexport const vivo = 1;\n", 'MORTO'],
  ['so-cadeia.mjs', "import { x as MORTO } from './x.mjs';\nexport const vivo = 'MORTO';\n", 'MORTO'],
];

/** E os que NÃO se podem ver: o vivo dentro de `${…}`, e o exportado. */
const CALADOS = [
  ['gabarito.mjs', "import { H as VIVO } from './x.mjs';\nexport const u = `https://${VIVO}/metodo`;\n", 'VIVO'],
  ['exportado.mjs', 'export const VIVO = 1;\n', 'VIVO'],
];

function prova() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-mortos-'));
  const falhas = [];
  try {
    for (const [nome, corpo, alvo] of CASOS) {
      const f = path.join(dir, nome);
      fs.writeFileSync(f, corpo);
      if (!mortosDe(f).mortos.some((d) => d.nome === alvo)) falhas.push(`${nome}: não viu o «${alvo}» morto`);
    }
    for (const [nome, corpo, alvo] of CALADOS) {
      const f = path.join(dir, nome);
      fs.writeFileSync(f, corpo);
      if (mortosDe(f).mortos.some((d) => d.nome === alvo)) falhas.push(`${nome}: apontou o «${alvo}», que está vivo`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (falhas.length) {
    console.error(vermelho('\n  IDENTIFICADORES MORTOS · a prova falhou:'));
    for (const f of falhas) console.error(`    ${f}`);
    console.error(cinza('\n  Uma régua que não vê um estrago não prova nada sobre os que não encontra.\n'));
    process.exit(1);
  }
  console.log(
    cinza(`  prova ✓ ${CASOS.length} forma(s) mortas vistas e ${CALADOS.length} viva(s) deixadas em paz, num directório temporário.`),
  );
}

/* ---------------------------------------------------------------- a corrida */

/* A VARREDURA SÓ CORRE QUANDO ESTE FICHEIRO É O PROGRAMA. Sem esta guarda,
   importar `soCodigo()` para o conferir corria a varredura inteira e saía do
   processo: a máquina de estados desta régua não podia ser examinada sem ela
   decidir por si. */
const ESTE = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1] ?? '') !== ESTE) {
  /* importado: não corre nada */
} else {

if (process.argv.includes('--prova')) prova();

const todos = ficheiros();
const mortos = [];
for (const f of todos) for (const d of mortosDe(f).mortos) mortos.push({ f, ...d });

console.log('');
if (mortos.length) {
  console.error(vermelho(`  IDENTIFICADORES MORTOS · ${mortos.length} em ${todos.length} ficheiros`));
  console.error('');
  for (const m of mortos) {
    console.error(
      `    ${vermelho('✗')} ${path.relative(RAIZ, m.f)}:${m.linha} · ${m.classe} "${m.nome}" ` +
        `declarada e nunca usada no código.`,
    );
  }
  console.error('');
  console.error(
    cinza(
      '    Uma declaração que ninguém usa diz a quem lê que o ficheiro faz uma coisa que ele\n' +
        '    já não faz. Tire-a, ou volte a usá-la. Um nome citado só num comentário ou dentro\n' +
        '    de uma cadeia não conta como uso: o que conta é o código.',
    ),
  );
  console.error('');
  process.exit(1);
}

console.log(
  '  ' + verde('✓') + ` identificadores · ${todos.length} ficheiro(s) lidos, nenhuma declaração morta`,
);
console.log('');

}
