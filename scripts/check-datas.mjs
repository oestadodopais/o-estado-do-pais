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
 * 1. **as páginas contra o ficheiro** (sempre, com ou sem história). Em duas
 *    metades. (1a) Cada data impressa com `data-nonledger="data-do-repositorio"`
 *    em `dist/` tem de ser uma data que `src/data/datas-de-publicacao.json`
 *    declara. É esta que teria fechado a construção da Vercel a 04.09: as
 *    páginas diziam 04.09.2026 e o ficheiro diz 12.08.2026. (1b) E cada data
 *    impressa vai PRESA À SUA EDIÇÃO, nas linhas dos dois índices e nas páginas
 *    dos trabalhos, nas duas edições do sítio: uma data trocada por outra data
 *    já declarada passava a 1a, e passava a 1b antiga, que só olhava à página da
 *    edição e saltava em silêncio o resto (leitura a frio de 07.09, Major 3).
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
/** A mesma marca, como seletor: escreve-se uma vez e lê-se nos dois sítios. */
const SELETOR = `[${MARCA}]`;

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

/* --- as rotas que imprimem datas de edição -------------------------------- */

const INDICES = new Set(['/estudos', '/en/studies']);
/**
 * AS ROTAS QUE IMPRIMEM UM BLOCO POR EDIÇÃO.
 *
 * Eram duas, a página do trabalho nas duas edições; passam a quatro com o §7.4
 * do bloco F1.10 (09.09.2026), que manda «o que ela tem, as edições, as
 * descrições, "ler o documento", vai para o painel lateral da página do texto».
 * A página de leitura passou a render o MESMO componente
 * (`src/components/EdicoesDoEstudo.astro`) no seu painel lateral, e com ele as
 * mesmas datas de repositório: sem esta rota aqui, oito páginas imprimiam uma
 * data que este passo não sabia prender, e a conta fecha a construção quando isso
 * acontece, que é exactamente o que ela fez.
 *
 * A MARCAÇÃO É A MESMA E POR ISSO A CONTA É A MESMA: um `.edicao` por edição do
 * trabalho, com o `.badge` a dizer a língua; a rota diz o slug nos quatro casos.
 */
const ROTA_DA_EDICAO = /^\/(?:estudos|en\/studies)\/([^/]+)(?:\/(?:texto|text))?$/;

/* --- 1a. nenhuma data impressa fora do que o ficheiro declara ------------- */

let impressas = 0;
/** @type {Map<string, Set<string>>} */
const porRota = new Map();
/**
 * AS PÁGINAS QUE A CONTA 1b PRENDE, GUARDADAS JÁ ANALISADAS.
 *
 * Entram aqui as que trazem a marca E TAMBÉM os dois índices e as páginas dos
 * trabalhos que NÃO a trazem. A primeira passagem saltava em silêncio uma página
 * sem marca (leitura a frio de 07.09, Major 3), e é exactamente aí que mora o
 * modo de falhar que este bloco veio fechar: uma página que DEIXA de imprimir a
 * data não é uma página conferida, é uma página que ninguém olhou.
 *
 * @type {{rota: string, doc: ReturnType<typeof parse>, slug: string|null}[]}
 */
const paraPrender = [];

for (const f of paginas) {
  const cru = fs.readFileSync(f, 'utf8');
  const rota = rotaDe(f);
  const eIndice = INDICES.has(rota);
  const daEdicao = ROTA_DA_EDICAO.exec(rota);
  /* A prova barata primeiro: a marca é uma cadeia, e a esmagadora maioria das
     páginas do sítio não a tem nem é uma das rotas que imprimem datas. */
  const temMarca = cru.includes(MARCA);
  if (!temMarca && !eIndice && !daEdicao) continue;
  const doc = parse(cru);
  if (eIndice || daEdicao) paraPrender.push({ rota, doc, slug: daEdicao ? daEdicao[1] : null });
  else paraPrender.push({ rota, doc, slug: null });
  if (!temMarca) continue;
  /** @type {Set<string>} */
  const nesta = new Set();
  for (const el of doc.querySelectorAll(SELETOR)) {
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

/* --- 1b. cada data impressa presa à SUA edição, em todas as páginas ------- */

/**
 * O QUE A PRIMEIRA PASSAGEM DEIXAVA PASSAR (leitura a frio do Codex de
 * 07.09.2026, Major 3).
 *
 * A conta 1a pergunta se a data impressa PERTENCE AO CONJUNTO das datas
 * declaradas; e a 1b antiga só olhava à página da edição, saltando EM SILÊNCIO
 * qualquer página que não trouxesse a marca. As linhas dos dois índices
 * (`/estudos` e `/en/studies`) imprimem a data de cada trabalho e nenhuma das
 * duas contas as prendia à edição certa: trocar, numa linha do índice, a data de
 * um trabalho pela data JÁ DECLARADA de outro ficava verde. Foi plantado e
 * confirmado a 07.09.
 *
 * Agora cada data impressa vai presa à SUA edição, em TODAS as páginas que a
 * imprimem e nas duas edições do sítio: nos índices pela porta de cada edição
 * (`a.badge-porta`, cujo `href` dá o slug e a língua), nas páginas de edição pelo
 * bloco `.edicao` (cujo `.badge` dá a língua e cuja rota dá o slug). Uma data
 * impressa que nenhuma edição prenda é uma falha, e uma página com a marca cuja
 * rota este passo não conhece é outra: o silêncio era o defeito.
 */

/**
 * As marcas cujo texto É uma data. A mesma marca serve a contagem da caixa das
 * datas por confirmar, que é um número e não se prende a edição nenhuma.
 *
 * @param {{querySelectorAll: (s: string) => {textContent: string}[]}} no
 */
const marcasDeData = (no) =>
  no.querySelectorAll(SELETOR).filter((el) => /^\d{2}\.\d{2}\.\d{4}$/.test(el.textContent.trim()));

/** As edições que o arquivo declara: são as que têm de ter página. */
const noArquivo = new Set(WORKS.flatMap((w) => w.editions.map((e) => chave(w.slug, e.lang))));

let paginasPrendidas = 0;
let lacos = 0;
/** Quantas vezes cada edição ficou presa a uma data impressa. @type {Map<string, number>} */
const presas = new Map();

/**
 * UM LAÇO: uma data impressa (ou a ausência dela) presa a uma edição.
 *
 * @param {string} rota    a página onde a data está impressa
 * @param {string} slug    o trabalho da edição a que ela pertence
 * @param {string} lang    a língua dessa edição
 * @param {string|null} impressa  a data impressa, na forma da casa, ou `null`
 * @param {string} onde    o sítio da página, por palavras, para a mensagem
 */
function prende(rota, slug, lang, impressa, onde) {
  lacos++;
  const k = chave(slug, lang);
  presas.set(k, (presas.get(k) ?? 0) + 1);
  const declarada = porEdicao.get(k) ?? null;
  const esperada = declarada ? naFormaDaCasa(declarada.data) : null;
  if (esperada === null) {
    if (impressa !== null) {
      falhas.push(
        `${rota}: ${onde} imprime «${impressa}» e ${FICHEIRO} não declara data nenhuma para ` +
          `${slug} (${lang}). Uma data sem linha no ficheiro é uma data sem origem.`,
      );
    }
    return;
  }
  if (impressa === null) {
    falhas.push(
      `${rota}: ${onde} não imprime data nenhuma e ${FICHEIRO} declara ${esperada} ` +
        `(commit ${declarada.commit.slice(0, 8)}) para ${slug} (${lang}).`,
    );
    return;
  }
  if (impressa !== esperada) {
    falhas.push(
      `${rota}: ${onde} imprime «${impressa}» e ${FICHEIRO} diz que ${slug} (${lang}) entrou a ` +
        `${esperada} (commit ${declarada.commit.slice(0, 8)}). Uma data que pertence ao conjunto ` +
        `das declaradas mas NÃO a esta edição é o que a conta 1a sozinha deixava passar.`,
    );
  }
}

/**
 * As marcas de data que sobraram por prender numa página.
 *
 * @param {string} rota
 * @param {{querySelectorAll: (s: string) => {textContent: string}[]}} doc
 * @param {Set<unknown>} presasAqui
 */
function orfas(rota, doc, presasAqui) {
  for (const el of marcasDeData(doc)) {
    if (presasAqui.has(el)) continue;
    falhas.push(
      `${rota}: a data «${el.textContent.trim()}» está impressa fora de qualquer edição que esta ` +
        `página nomeie. Uma data sem dono não se confere contra ${FICHEIRO}.`,
    );
  }
}

/**
 * UM ÍNDICE: uma linha por trabalho, uma porta por edição.
 *
 * @param {string} rota
 * @param {any} doc
 */
function prendeNoIndice(rota, doc) {
  const artigos = doc.querySelectorAll('article.arquivo-item');
  if (artigos.length === 0) {
    falhas.push(
      `${rota}: traz a marca das datas e não tem uma única linha \`article.arquivo-item\`. ` +
        `Sem as linhas não há a que prender as datas.`,
    );
    return;
  }
  /** @type {Set<unknown>} */
  const presasAqui = new Set();
  for (const artigo of artigos) {
    /* A DATA ÚNICA DA LINHA: quando as edições do trabalho têm todas a mesma
       data, a vista imprime-a uma vez em `.arquivo-data` e cada edição da linha
       responde por ela. */
    const caixaUnica = artigo.querySelector('.arquivo-data');
    const unicas = caixaUnica ? marcasDeData(caixaUnica) : [];
    if (unicas.length > 1) {
      falhas.push(`${rota}: uma linha do índice imprime ${unicas.length} datas em \`.arquivo-data\`.`);
    }
    const marcaUnica = unicas[0] ?? null;

    const portas = artigo.querySelectorAll('a.badge-porta');
    if (portas.length === 0) {
      falhas.push(
        `${rota}: uma linha do índice não tem porta de edição nenhuma (\`a.badge-porta\`), e por ` +
          `isso a data dela não se prende a edição nenhuma.`,
      );
      continue;
    }
    for (const porta of portas) {
      const href = porta.getAttribute('href') ?? '';
      const m = ROTA_DA_EDICAO.exec(href);
      if (!m) {
        falhas.push(`${rota}: a porta de uma edição aponta «${href}», que não é a rota de uma edição.`);
        continue;
      }
      const slug = m[1];
      const lang = href.startsWith('/en/') ? 'en' : 'pt';
      /* A data da PRÓPRIA porta, quando as edições do trabalho têm datas
         diferentes; senão, a data única da linha. */
      const proprias = marcasDeData(porta);
      if (proprias.length > 1) {
        falhas.push(`${rota}: a porta de ${slug} (${lang}) imprime ${proprias.length} datas.`);
      }
      const marca = proprias[0] ?? marcaUnica;
      if (marca) presasAqui.add(marca);
      prende(
        rota,
        slug,
        lang,
        marca ? marca.textContent.trim() : null,
        `a linha de ${slug}, na porta ${lang.toUpperCase()}`,
      );
    }
  }
  orfas(rota, doc, presasAqui);
}

/**
 * UMA PÁGINA DE EDIÇÃO: um bloco `.edicao` por edição do trabalho, nas duas
 * línguas, e a rota diz o slug.
 *
 * @param {string} rota
 * @param {string} slug
 * @param {any} doc
 */
function prendeNaPaginaDoTrabalho(rota, slug, doc) {
  const blocos = doc.querySelectorAll('.edicao');
  if (blocos.length === 0) {
    falhas.push(
      `${rota}: traz a marca das datas e não tem um único bloco \`.edicao\`. Sem os blocos não ` +
        `há a que prender as datas.`,
    );
    return;
  }
  /** @type {Set<unknown>} */
  const presasAqui = new Set();
  for (const bloco of blocos) {
    const badge = bloco.querySelector('.edicao-cabeca .badge');
    const lang = badge ? badge.textContent.trim().toLowerCase() : '';
    if (lang !== 'pt' && lang !== 'en') {
      falhas.push(
        `${rota}: um bloco \`.edicao\` sem língua legível (` +
          `«${badge ? badge.textContent.trim() : 'sem badge'}»).`,
      );
      continue;
    }
    const marcas = marcasDeData(bloco);
    if (marcas.length > 1) {
      falhas.push(`${rota}: o bloco da edição ${lang.toUpperCase()} imprime ${marcas.length} datas.`);
    }
    const marca = marcas[0] ?? null;
    if (marca) presasAqui.add(marca);
    prende(
      rota,
      slug,
      lang,
      marca ? marca.textContent.trim() : null,
      `o bloco da edição ${lang.toUpperCase()}`,
    );
  }
  orfas(rota, doc, presasAqui);
}

for (const { rota, doc, slug } of paraPrender) {
  if (INDICES.has(rota)) {
    paginasPrendidas++;
    prendeNoIndice(rota, doc);
    continue;
  }
  if (slug !== null) {
    paginasPrendidas++;
    prendeNaPaginaDoTrabalho(rota, slug, doc);
    continue;
  }
  /* Uma página com a marca e sem uma data impressa é a caixa das datas por
     confirmar, que traz a mesma marca sobre um NÚMERO: essa é da conta 2. */
  if (marcasDeData(doc).length === 0) continue;
  falhas.push(
    `${rota}: imprime uma data com a marca \`${MARCA}\` e este passo não sabe a que edição a ` +
      `prender. A primeira passagem saltava em silêncio as páginas que não conhecia, e uma data ` +
      `que ninguém prende é uma data que ninguém confere.`,
  );
}

/* AS DUAS CONTAGENS DA PRÓPRIA CONTA (regra 14 da casa): uma conta que não
   conferiu nada tem de o dizer, e não passar por verde. */
if (paginasPrendidas === 0) {
  falhas.push(
    `de ${paginas.length} página(s) de \`dist/\`, nenhuma foi conferida edição a edição: não há ` +
      `índice (${[...INDICES].join(', ')}) nem página de trabalho. Sem um positivo conhecido a ` +
      `conta 1b não mede nada.`,
  );
}
if (lacos === 0) {
  falhas.push(
    `${paginasPrendidas} página(s) conferida(s) e nenhuma data presa a uma edição: a conta 1b ` +
      `percorreu-as e não prendeu nada.`,
  );
}

/* E NENHUMA EDIÇÃO DO ARQUIVO PODE FICAR SEM PÁGINA QUE A IMPRIMA. Uma linha do
   ficheiro que não seja edição do arquivo não tem página, e isso mede-se em
   `check-registo`, não aqui. */
for (const e of edicoes) {
  const k = chave(e.slug, e.lang);
  if (presas.has(k) || !noArquivo.has(k)) continue;
  falhas.push(
    `${e.ficheiro}: ${FICHEIRO} declara ${naFormaDaCasa(e.data)} ` +
      `(commit ${e.commit.slice(0, 8)}) e nenhuma página construída imprime essa data presa a ` +
      `esta edição.`,
  );
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
  const dito = caixas[0].querySelector(SELETOR);
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
    `impressa(s) em ${porRota.size} página(s), ${lacos} laço(s) data-edição em ` +
    `${paginasPrendidas} página(s) conferida(s), ${semData} edição(ões) sem data` +
    `${semData === 0 ? ' e nenhuma caixa de aviso' : ''}.`,
);
