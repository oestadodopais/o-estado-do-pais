#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PACOTE DE CADEIAS DO LEITOR · o que o bloco P3 compara, antes e depois
 * ---------------------------------------------------------------------------
 * A regra 3 do §0 do brief: «a tabela das cadeias é completa por construção,
 * como no P1 (a comparação por código entre os dois pacotes de cadeias)». Uma
 * tabela lida de um `diff` é uma tabela que esquece o que o leitor do `diff` não
 * viu; uma tabela lida de dois pacotes é completa porque a comparação é de
 * conjuntos.
 *
 * O PACOTE É TODA A PROSA QUE UM GABARITO PODE RENDER, com a chave por onde ela
 * se chama: `src/i18n/strings.mjs` (as duas edições), os textos decididos
 * (`sobre.mjs`, `politica-ia.mjs`), o Método (`metodo.mjs`), as definições e os
 * nomes das medidas (`figuras.mjs`), os nomes das áreas, das regiões e dos
 * domínios, e os nomes do projeto que este bloco escreveu
 * (`nomes-das-medidas.mjs`). Não entra o livro-razão: os campos de uma linha são
 * transcrições da fonte, e este bloco não lhes toca.
 *
 * ---------------------------------------------------------------------------
 * E OS LITERAIS DAS VISTAS E DOS COMPONENTES (achado 12, 16.09.2026)
 * ---------------------------------------------------------------------------
 * A primeira redação deste guião lia só os módulos `.mjs` da lista acima, e o
 * brief punha os literais dos componentes e das vistas no âmbito do bloco. A
 * leitura a frio do Codex apanhou-o com um exemplo que existe: a manchete da
 * página do domínio é escrita em `src/views/DominioView.astro`, pedaço a pedaço
 * («A dívida pública é », « do PIB, »), e não em `strings.mjs`. Um pedaço desses
 * mudado não entrava no pacote nem na tabela, e a palavra «completa por
 * construção» era falsa dentro daquele grafo mais estreito.
 *
 * O ÂMBITO, DITO POR EXTENSO, porque é ele que a tabela declara:
 *
 *   · TODOS os ficheiros `.astro` debaixo de `src/`, andados por ordem de
 *     caminho, sem lista escrita à mão (hoje são 127);
 *   · de cada um: as cadeias literais da FRENTE (o bloco entre `---`), sem os
 *     comentários, com pelo menos um espaço e pelo menos uma letra; o TEXTO do
 *     gabarito que não está dentro de uma expressão `{…}`; e os quatro
 *     ATRIBUTOS à vista com valor literal (`title`, `aria-label`, `alt`,
 *     `placeholder`).
 *
 * O QUE O FILTRO DEIXA ENTRAR A MAIS, e é de propósito: as mensagens das
 * guardas («<Manchete> sem "lang"») têm espaço e letras e entram. Não são texto
 * do leitor, e ficam no pacote na mesma: um pacote que decidisse o que é prosa
 * do leitor por adivinhação deixava de fora o que não reconhecesse, e é
 * exactamente esse o defeito que isto veio fechar. Quem lê a tabela vê a chave,
 * que diz o ficheiro e a origem, e sabe o que está a ler.
 *
 * O QUE NÃO ENTRA, e fica dito: um literal do leitor que viva num módulo de
 * `src/lib/` (a manchete do país, em `src/lib/inicio.mjs`) continua fora, porque
 * a lista dos módulos é declarada e este bloco não a alargou. É dívida escrita,
 * e não uma omissão calada.
 *
 * Uso:
 *   node design/especime-v3/medicoes/p3-2026-09-16/pacote-de-cadeias.mjs <raiz> > pacote.json
 *   node .../pacote-de-cadeias.mjs --compara antes.json depois.json
 *
 * `<raiz>` é a pasta que contém `src/`: a do repositório, ou uma cópia da cabeça
 * antiga tirada com `git archive`.
 */
import fs from 'node:fs';
import path from 'node:path';

const FICHEIROS = [
  'src/i18n/strings.mjs',
  'src/data/sobre.mjs',
  'src/data/politica-ia.mjs',
  'src/data/metodo.mjs',
  'src/data/figuras.mjs',
  'src/data/areas.mjs',
  'src/data/regioes.mjs',
  'src/data/dominios.mjs',
  'src/data/concelhos.mjs',
  'src/data/marcador.mjs',
  'src/data/correcoes.mjs',
  'src/data/nomes-das-medidas.mjs',
];

/** Os quatro atributos à vista com valor literal. */
const ATRIBUTOS_A_VISTA = ['title', 'aria-label', 'alt', 'placeholder'];

/** A marca que separa dois pedaços de texto onde estava uma etiqueta ou uma expressão. */
const SEPARADOR = '\u0000';

/** Todos os `.astro` debaixo de `src/`, por ordem de caminho. */
function ficheirosAstro(raiz) {
  const out = [];
  const base = path.join(raiz, 'src');
  if (!fs.existsSync(base)) return out;
  /** @param {string} d */
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name.endsWith('.astro')) out.push(path.relative(raiz, p).split(path.sep).join('/'));
    }
  };
  anda(base);
  return out;
}

/** Os comentários de um bloco de código, fora. */
function semComentarios(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/**
 * Os literais de um ficheiro `.astro`, pelo âmbito declarado no cabeçalho.
 *
 * @param {string} cru
 * @returns {[string, string][]}
 */
function literaisDoAstro(cru) {
  /** @type {[string, string][]} */
  const saida = [];
  let frente = '';
  let gabarito = cru;
  if (cru.startsWith('---')) {
    const fim = cru.indexOf('\n---', 3);
    if (fim >= 0) {
      frente = cru.slice(3, fim);
      gabarito = cru.slice(fim + 4);
    }
  }
  /* A FRENTE: as cadeias literais, sem os comentários. */
  const limpo = semComentarios(frente);
  let i = 0;
  for (const m of limpo.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g)) {
    const t = (m[1] ?? m[2] ?? '').trim();
    if (!t.includes(' ') || !/[\p{L}]/u.test(t)) continue;
    saida.push([`frente[${i++}]`, t]);
  }
  /* O GABARITO: sem estilo, sem guião e sem comentários. */
  let g = gabarito
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const a of ATRIBUTOS_A_VISTA) {
    let j = 0;
    for (const m of g.matchAll(new RegExp(`\\s${a}="([^"{}]+)"`, 'g'))) {
      const t = m[1].trim();
      if (t) saida.push([`${a}[${j++}]`, t]);
    }
  }
  /* O texto que não está dentro de uma expressão. */
  let fora = '';
  let nivel = 0;
  for (const c of g) {
    if (c === '{') {
      nivel++;
      fora += SEPARADOR;
      continue;
    }
    if (c === '}') {
      if (nivel > 0) nivel--;
      fora += SEPARADOR;
      continue;
    }
    if (nivel === 0) fora += c;
  }
  let k = 0;
  for (const pedaco of fora.replace(/<[^>]*>/g, SEPARADOR).split(SEPARADOR)) {
    const t = pedaco.replace(/\s+/g, ' ').trim();
    if (!t || !/[\p{L}]/u.test(t)) continue;
    saida.push([`texto[${k++}]`, t]);
  }
  return saida;
}

/** Percorre um objeto e devolve [caminho, texto] para cada cadeia. */
function achata(o, prefixo, visto, saida) {
  if (typeof o === 'string') {
    saida.push([prefixo, o]);
    return;
  }
  if (typeof o === 'function' || o === null || typeof o !== 'object') return;
  if (visto.has(o)) return;
  visto.add(o);
  if (Array.isArray(o)) {
    o.forEach((v, i) => achata(v, `${prefixo}[${i}]`, visto, saida));
    return;
  }
  for (const k of Object.keys(o)) achata(o[k], prefixo ? `${prefixo}.${k}` : k, visto, saida);
}

async function pacote(raiz) {
  const saida = [];
  for (const f of FICHEIROS) {
    const caminho = path.resolve(raiz, f);
    if (!fs.existsSync(caminho)) continue;
    const mod = await import(`file://${caminho}`);
    achata(mod, path.basename(f, '.mjs'), new Set(), saida);
  }
  for (const f of ficheirosAstro(raiz)) {
    for (const [origem, texto] of literaisDoAstro(fs.readFileSync(path.resolve(raiz, f), 'utf8'))) {
      saida.push([`astro.${f}#${origem}`, texto]);
    }
  }
  /* A ORDEM É A DA CHAVE, para que dois pacotes se comparem sem depender da
     ordem por que os ficheiros os declararam. */
  saida.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return Object.fromEntries(saida);
}

const argv = process.argv.slice(2);
if (argv[0] === '--compara') {
  const antes = JSON.parse(fs.readFileSync(argv[1], 'utf8'));
  const depois = JSON.parse(fs.readFileSync(argv[2], 'utf8'));
  const chaves = [...new Set([...Object.keys(antes), ...Object.keys(depois)])].sort();
  const mudadas = [];
  for (const k of chaves) {
    const a = antes[k];
    const d = depois[k];
    if (a === d) continue;
    mudadas.push({ chave: k, antes: a ?? null, depois: d ?? null });
  }
  console.log(JSON.stringify({ antes: Object.keys(antes).length, depois: Object.keys(depois).length, mudadas }, null, 1));
} else {
  const raiz = argv[0] ?? process.cwd();
  console.log(JSON.stringify(await pacote(raiz), null, 1));
}
