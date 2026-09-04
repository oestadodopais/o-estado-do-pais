#!/usr/bin/env node
/**
 * O PORTÃO DAS DATAS DE PUBLICAÇÃO · três contas, e nenhuma confia na anterior.
 *
 * Bloco F1.4b (04.09.2026), correção urgente do F1.4.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE PASSO EXISTE PARA APANHAR
 * ---------------------------------------------------------------------------
 * O F1.4 lia a data de cada edição do `git`, a cada construção. Na CI, com
 * `fetch-depth: 0`, saía certa; na Vercel, que constrói de uma cópia RASA, o
 * commit de agosto não existe e o `git log --diff-filter=A` respondeu com o
 * commit mais antigo que a cópia tinha. As dezasseis edições ficaram com a data
 * do dia, e o sítio publicado disse «PUBLICADO A 04.09.2026» nos doze trabalhos.
 *
 * O defeito nasceu de um comando que RESPONDEU, depressa, outra coisa. Nenhuma
 * régua da casa o viu, porque a única régua que refazia a conta (I9) corre onde
 * a história está completa: media o mesmo ambiente em que o defeito não
 * acontece. Este passo corre na CADEIA DA CONSTRUÇÃO, e por isso corre TAMBÉM na
 * Vercel, que é onde o defeito nasceu.
 *
 * ---------------------------------------------------------------------------
 * AS TRÊS CONTAS
 * ---------------------------------------------------------------------------
 * 1. **as páginas contra o ficheiro** (sempre, com ou sem história). Cada data
 *    impressa com `data-nonledger="data-do-repositorio"` em `dist/` tem de ser
 *    uma data que `src/data/datas-de-publicacao.json` declara; e cada edição
 *    declarada no ficheiro tem de ter a sua data impressa na página dessa
 *    edição. É esta conta que teria fechado a construção da Vercel a 04.09: as
 *    páginas diziam 04.09.2026 e o ficheiro diz 12.08.2026.
 *
 * 2. **a caixa que conta** (sempre). A caixa «Datas de publicação por confirmar
 *    em N edições» de `/estudos` rende-se se e só se alguma edição declarada em
 *    `src/data/studies.mjs` não tem linha no ficheiro, e o N é o número dessas
 *    edições, recontado aqui.
 *
 * 3. **o ficheiro contra o `git`** (só com história completa). Data e commit de
 *    cada edição, refeitos do `git log --diff-filter=A`; e nenhuma edição da
 *    árvore com commit de adição pode faltar ao ficheiro. NUMA CÓPIA RASA ESTA
 *    CONTA NÃO SE FAZ, e o passo escreve no registo da construção que confiou no
 *    ficheiro, dizendo porquê. É a diferença entre uma conta que não se pôde
 *    fazer e uma conta que passou.
 *
 * Uso:  node scripts/check-datas.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { WORKS } from '../src/data/studies.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const FICHEIRO = path.join('src', 'data', 'datas-de-publicacao.json');
const MARCA = 'data-nonledger="data-do-repositorio"';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** @type {string[]} */
const falhas = [];

/**
 * A FORMA DA DATA ESTÁ ESCRITA AQUI, e não importada de `src/lib/datas.mjs`.
 * É a disciplina que `scripts/gate-html.mjs` escreve por extenso: uma régua que
 * leia a regra pela mesma função que a escreve confirma a função, não o sítio.
 *
 * @param {string} iso  `AAAA-MM-DD`
 */
const naFormaDaCasa = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;

/* ============================================================ o ficheiro */

const caminhoDoFicheiro = path.join(RAIZ, FICHEIRO);
if (!fs.existsSync(caminhoDoFicheiro)) {
  console.error(
    vermelho(`check-datas: falta ${FICHEIRO}.`) +
      `\n  Escreve-se com \`node scripts/datas-de-publicacao.mjs\` numa árvore com a história` +
      `\n  completa, e entra no commit.`,
  );
  process.exit(1);
}

const bruto = JSON.parse(fs.readFileSync(caminhoDoFicheiro, 'utf8'));
/** @type {{slug: string, lang: string, data: string, commit: string, ficheiro: string}[]} */
const edicoes = Array.isArray(bruto?.edicoes) ? bruto.edicoes : [];
if (edicoes.length === 0) {
  console.error(vermelho(`check-datas: ${FICHEIRO} não declara nenhuma edição.`));
  process.exit(1);
}
const chave = (slug, lang) => `${slug}/${lang}`;
const porEdicao = new Map(edicoes.map((e) => [chave(e.slug, e.lang), e]));
const datasDeclaradas = new Set(edicoes.map((e) => naFormaDaCasa(e.data)));

/* ================================================= as páginas construídas */

if (!fs.existsSync(DIST)) {
  console.error(
    vermelho('check-datas: não existe `dist/`.') +
      `\n  Este passo lê as páginas construídas e corre depois do \`astro build\`.`,
  );
  process.exit(1);
}

/** @param {string} dir @returns {string[]} */
function html(dir) {
  /** @type {string[]} */
  const saida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...html(p));
    else if (e.name.endsWith('.html')) saida.push(p);
  }
  return saida;
}

const paginas = html(DIST);
/** A rota de um ficheiro de `dist/`: `dist/estudos/x/index.html` → `/estudos/x`. */
const rotaDe = (f) =>
  '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/\/?index\.html$/, '').replace(/\.html$/, '');

/* --- 1a. nenhuma data impressa fora do que o ficheiro declara ------------- */

let impressas = 0;
/** @type {Map<string, Set<string>>} */
const porRota = new Map();

for (const f of paginas) {
  const cru = fs.readFileSync(f, 'utf8');
  /* A prova barata primeiro: a marca é uma cadeia, e a esmagadora maioria das
     páginas do sítio não a tem. Só as que a têm se analisam. */
  if (!cru.includes(MARCA)) continue;
  const rota = rotaDe(f);
  const doc = parse(cru);
  /** @type {Set<string>} */
  const nesta = new Set();
  for (const el of doc.querySelectorAll('[data-nonledger="data-do-repositorio"]')) {
    const texto = el.textContent.trim();
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(texto)) continue;
    impressas++;
    nesta.add(texto);
    if (!datasDeclaradas.has(texto)) {
      falhas.push(
        `${rota}: a página imprime «${texto}» como data de repositório e ${FICHEIRO} não a ` +
          `declara em edição nenhuma. É exactamente a forma do defeito de 04.09: uma data que ` +
          `saiu do ambiente da construção e não do facto medido.`,
      );
    }
  }
  porRota.set(rota, nesta);
}

if (impressas === 0) {
  falhas.push(
    `nenhuma das ${paginas.length} páginas de \`dist/\` imprimiu uma data com a marca ` +
      `\`${MARCA}\`. Sem um positivo conhecido este passo não mede nada (regra 14 da casa).`,
  );
}

/* --- 1b. cada edição declarada tem a sua data na sua página --------------- */

for (const e of edicoes) {
  const rota = e.lang === 'pt' ? `/estudos/${e.slug}` : `/en/studies/${e.slug}`;
  const nesta = porRota.get(rota);
  if (!nesta) {
    /* Uma edição sem página construída não é uma falha deste passo: o arquivo
       decide que páginas existem, e `check-registo` mede isso. O que este passo
       exige é que a página que EXISTA diga a data certa. */
    continue;
  }
  const esperada = naFormaDaCasa(e.data);
  if (!nesta.has(esperada)) {
    falhas.push(
      `${rota}: ${FICHEIRO} diz que esta edição entrou no repositório a ${esperada} ` +
        `(commit ${e.commit.slice(0, 8)}) e a página não imprime essa data. ` +
        `Imprime ${nesta.size ? [...nesta].map((d) => `«${d}»`).join(', ') : 'nenhuma'}.`,
    );
  }
}

/* --- 2. a caixa que conta ------------------------------------------------- */

/**
 * O NÚMERO RECONTA-SE AQUI, do arquivo e do ficheiro, e não se pergunta à vista
 * quantas ela achou que eram. Uma caixa que se rende com todas as edições
 * datadas é a ressalva a mentir sobre a página que tem por baixo, e foi o que
 * esteve no ar a 04.09.
 */
let semData = 0;
for (const w of WORKS) {
  for (const ed of w.editions) {
    if (!porEdicao.has(chave(w.slug, ed.lang))) semData++;
  }
}

for (const rota of ['/estudos', '/en/studies']) {
  const f = path.join(DIST, rota.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) {
    falhas.push(`${rota}: não foi construída, e este passo mede a caixa das datas nela.`);
    continue;
  }
  const doc = parse(fs.readFileSync(f, 'utf8'));
  const caixas = doc.querySelectorAll('p.aviso-editorial');
  if (semData === 0) {
    if (caixas.length > 0) {
      falhas.push(
        `${rota}: todas as ${WORKS.reduce((n, w) => n + w.editions.length, 0)} edições têm data ` +
          `em ${FICHEIRO} e a página ainda mostra a caixa «${caixas[0].textContent.trim()}». ` +
          `Uma ressalva que não é verdade sobre nada do que está por baixo dela é ruído, e a ` +
          `04.09 foi ruído a tapar um defeito.`,
      );
    }
    continue;
  }
  if (caixas.length !== 1) {
    falhas.push(
      `${rota}: ${semData} edição(ões) sem data em ${FICHEIRO} e a página mostra ` +
        `${caixas.length} caixa(s) de aviso. Tinha de mostrar uma.`,
    );
    continue;
  }
  const dito = caixas[0].querySelector('[data-nonledger="data-do-repositorio"]');
  const n = dito ? Number(dito.textContent.trim()) : NaN;
  if (n !== semData) {
    falhas.push(
      `${rota}: a caixa diz «${dito ? dito.textContent.trim() : 'nada'}» e as edições sem data ` +
        `em ${FICHEIRO} são ${semData}.`,
    );
  }
}

/* --- 3. o ficheiro contra o `git`, quando há história --------------------- */

let raso = 'sem git';
try {
  raso = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
    cwd: RAIZ,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
} catch {
  raso = 'sem git';
}

const comHistoria = raso === 'false';

if (comHistoria) {
  const dir = path.join(RAIZ, 'studies-src');
  const slugs = fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
        .map((e) => e.name)
        .sort()
    : [];
  let conferidas = 0;
  for (const slug of slugs) {
    for (const lang of ['pt', 'en']) {
      const rel = `studies-src/${slug}/${lang}.html`;
      if (!fs.existsSync(path.join(RAIZ, rel))) continue;
      let linhas = [];
      try {
        linhas = execFileSync(
          'git',
          ['log', '--diff-filter=A', '--format=%ad %H', '--date=short', '--', rel],
          { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        )
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => /^\d{4}-\d{2}-\d{2} [0-9a-f]{40}$/.test(l));
      } catch {
        linhas = [];
      }
      const ultima = linhas.length > 0 ? linhas[linhas.length - 1] : null;
      const declarada = porEdicao.get(chave(slug, lang)) ?? null;
      if (ultima === null) {
        if (declarada) {
          falhas.push(
            `${rel}: ${FICHEIRO} declara ${declarada.data} (${declarada.commit.slice(0, 8)}) e o ` +
              `\`git\` desta árvore, que tem história completa, não encontra commit de adição.`,
          );
        }
        continue;
      }
      const [data, commit] = ultima.split(' ');
      if (!declarada) {
        falhas.push(
          `${rel}: o \`git\` diz que esta edição entrou a ${data} (${commit.slice(0, 8)}) e ` +
            `${FICHEIRO} não a declara. Refaça o ficheiro com ` +
            `\`node scripts/datas-de-publicacao.mjs\`.`,
        );
        continue;
      }
      conferidas++;
      if (declarada.data !== data || declarada.commit !== commit) {
        falhas.push(
          `${rel}: ${FICHEIRO} declara ${declarada.data} (${declarada.commit.slice(0, 8)}) e o ` +
            `\`git\` diz ${data} (${commit.slice(0, 8)}).`,
        );
      }
    }
  }
  if (conferidas === 0) {
    falhas.push(
      `a árvore diz ter história completa e nenhuma das ${edicoes.length} edições do ficheiro ` +
        `foi conferida contra o \`git\`. Sem um positivo conhecido a terceira conta não mede nada.`,
    );
  }
  console.log(
    cinza(
      `check-datas: história completa · ${conferidas} edição(ões) do ficheiro refeitas do \`git\`.`,
    ),
  );
} else {
  /* A LINHA QUE O REGISTO DA CONSTRUÇÃO TEM DE LEVAR. É aqui que a construção da
     Vercel cai, e quem lê o registo tem de saber que a terceira conta não se
     fez, e porquê. */
  console.log(
    cinza(
      `check-datas: a história desta cópia é ${raso === 'sem git' ? 'inacessível (sem `git`)' : 'RASA'} · ` +
        `o ficheiro ${FICHEIRO} é a fonte e não se confere contra o \`git\` aqui. ` +
        `Foi medido e commitado numa árvore com história completa ` +
        `(scripts/datas-de-publicacao.mjs, que se recusa a correr numa cópia rasa). ` +
        `As contas 1 e 2 (as páginas contra o ficheiro, e a caixa que conta) fizeram-se.`,
    ),
  );
}

/* ================================================================= o fecho */

if (falhas.length > 0) {
  console.error(vermelho(`check-datas: ${falhas.length} falha(s).`));
  for (const f of falhas) console.error(`  ${vermelho('·')} ${f}`);
  process.exit(1);
}

console.log(
  `${verde('check-datas')} · ${edicoes.length} edição(ões) datadas, ${impressas} data(s) ` +
    `impressa(s) em ${porRota.size} página(s), ${semData} edição(ões) sem data` +
    `${semData === 0 ? ' e nenhuma caixa de aviso' : ''}.`,
);
