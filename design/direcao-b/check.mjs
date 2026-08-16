/* Direção B · a conferência dos protótipos
   Corre com `node design/direcao-b/check.mjs`. Imprime a tabela e sai com
   código 1 à primeira falha. O que confere, ficheiro a ficheiro:

     1. a primeira linha é um comentário que nomeia a direção;
     2. não existe nenhum `<script>`;
     3. não existe nenhum pedido para fora: nem folha, nem imagem, nem
        `@import`, nem `url(http…)`, nem `iframe` que não seja `srcdoc` ou
        `data:`. As ligações (`href`) são navegação e não pedido, e podem
        apontar para o sítio vivo e para as fontes que a página cita;
     4. o ficheiro fica abaixo de 400 KiB;
     5. os algarismos: toda a corrida de algarismos do texto visível existe,
        tal e qual, no texto visível da página construída correspondente em
        `dist/`. Exceções declaradas, e só duas:
          · `data-exemplo`  o lugar de um dado que ainda não existe. Não pode
                            ter algarismo nenhum lá dentro;
          · `data-desenho`  um algarismo que é do desenho e não da medição (a
                            largura de um ecrã, o número de um protótipo).
                            Fica listado no fim, um a um.

   A comparação é sobre TEXTO: o que o leitor vê. Os atributos de geometria
   (larguras de barra, coordenadas de SVG) não são texto e não entram, pela
   mesma razão por que o portão do sítio confere o que rende e não o que o
   gabarito escreve. */
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..', '..');
const DIST = join(RAIZ, 'dist');
const LIMITE = 400 * 1024;
const MARCA = 'Direção B';

const FONTES = {
  '01-primeira.html': ['index.html', 'estudos/index.html'],
  '02-linha.html': [
    'livro-razao/precos-da-habitacao-2025/index.html',
    'livro-razao/evora-divida-total-2025/index.html',
  ],
  '03-municipio.html': ['municipios/evora/index.html'],
  '04-metodo.html': ['metodo/index.html'],
  '05-agenda.html': ['agenda/index.html', 'metodo/index.html'],
  '06-mobile.html': [
    'index.html',
    'estudos/index.html',
    'livro-razao/precos-da-habitacao-2025/index.html',
    'livro-razao/evora-divida-total-2025/index.html',
  ],
  'board.html': [
    'index.html',
    'estudos/index.html',
    'livro-razao/precos-da-habitacao-2025/index.html',
    'livro-razao/evora-divida-total-2025/index.html',
    'municipios/evora/index.html',
    'metodo/index.html',
    'agenda/index.html',
  ],
};

/* --- texto visível ------------------------------------------------------- */
/* `<head\b` e não `<head`: sem a fronteira de palavra, o padrão apanha
   `<header>` e engole a página até ao `</head>` seguinte. */
const semCabeca = (h) => h.replace(/<head\b[\s\S]*?<\/head>/gi, ' ');
const semFolhas = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

/* Um protótipo pode trazer outro dentro, por `srcdoc` (escapado) ou por
   `data:…;base64`. Os dois são desdobrados para que o texto de dentro seja
   conferido pelas mesmas regras. `documentos()` devolve o de fora e todos os
   de dentro, cada um por inteiro: as regras dos pedidos correm sobre cada um
   deles, e os algarismos correm sobre todos juntos. */
function documentos(html) {
  const saida = [html];
  for (const m of html.matchAll(/srcdoc="([^"]*)"/g)) {
    const dentro = m[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&');
    saida.push(...documentos(dentro));
  }
  for (const m of html.matchAll(
    /src="data:text\/html;charset=utf-8;base64,([A-Za-z0-9+/=]+)"/g
  )) {
    saida.push(...documentos(Buffer.from(m[1], 'base64').toString('utf8')));
  }
  return saida;
}

/* Um `<iframe …>` cujo atributo traz HTML dentro tem `>` no meio do valor.
   O padrão anda por aspas para não parar no primeiro `>` que encontra. */
const ETIQUETA_IFRAME = /<iframe\b(?:[^>"]|"[^"]*")*>/gi;
const ATRIBUTO_SRC = /\ssrc="([^"]*)"/gi;

/* O corpo de um documento, sem os `<iframe>` (que são contados à parte, como
   documentos próprios). */
function semQuadros(html) {
  return html.replace(ETIQUETA_IFRAME, ' ');
}

/* Remove os elementos marcados, devolvendo o que sobra e o que foi removido. */
function extrair(html, atributo) {
  const removidos = [];
  const re = new RegExp(`<([a-z]+)([^>]*\\s${atributo}(?:=[^>]*)?)>`, 'gi');
  let saida = '';
  let i = 0;
  let m;
  while ((m = re.exec(html))) {
    const etiqueta = m[1];
    const inicio = m.index;
    saida += html.slice(i, inicio);
    /* encontra o fecho correspondente, contando aninhamento da mesma etiqueta */
    const abre = new RegExp(`<${etiqueta}\\b`, 'gi');
    const fecha = new RegExp(`</${etiqueta}>`, 'gi');
    let pos = re.lastIndex;
    let nivel = 1;
    while (nivel > 0) {
      abre.lastIndex = pos;
      fecha.lastIndex = pos;
      const a = abre.exec(html);
      const f = fecha.exec(html);
      if (!f) {
        pos = html.length;
        break;
      }
      if (a && a.index < f.index) {
        nivel++;
        pos = a.index + 1;
      } else {
        nivel--;
        pos = f.index + f[0].length;
      }
    }
    removidos.push(html.slice(inicio, pos));
    i = pos;
    re.lastIndex = pos;
  }
  saida += html.slice(i);
  return { resto: saida, removidos };
}

const soTexto = (h) =>
  h
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');

const corridas = (t) => (t.match(/\d+/g) || []);

/* --- as fontes em dist --------------------------------------------------- */
const cacheDist = new Map();
function digitosDeDist(rota) {
  if (!cacheDist.has(rota)) {
    const bruto = readFileSync(join(DIST, rota), 'utf8');
    const texto = soTexto(semFolhas(semCabeca(bruto)));
    cacheDist.set(rota, new Set(corridas(texto)));
  }
  return cacheDist.get(rota);
}

/* --- a corrida ------------------------------------------------------------ */
const ficheiros = readdirSync(AQUI)
  .filter((f) => f.endsWith('.html'))
  .sort();

let falhas = 0;
const linhas = [];
const desenho = [];

for (const f of ficheiros) {
  const caminho = join(AQUI, f);
  const bruto = readFileSync(caminho, 'utf8');
  const bytes = statSync(caminho).size;
  const problemas = [];

  /* 1 · a marca da direção na primeira linha */
  const primeira = bruto.split('\n', 1)[0];
  if (!(primeira.startsWith('<!--') && primeira.includes(MARCA))) {
    problemas.push('sem a marca da direção na primeira linha');
  }

  /* 2 · sem JavaScript */
  if (/<script[\s>]/i.test(bruto)) problemas.push('tem <script>');
  if (/\son[a-z]+\s*=/i.test(bruto.replace(/&quot;/g, '"')))
    problemas.push('tem atributo de evento');

  /* 3 · sem pedidos para fora, documento a documento */
  const docs = documentos(bruto);
  for (const doc of docs) {
    if (/<link\b/i.test(doc)) problemas.push('tem <link>');
    if (/<img\b/i.test(doc)) problemas.push('tem <img>');
    if (/@import/i.test(doc)) problemas.push('tem @import');
    if (/url\(\s*['"]?https?:/i.test(doc)) problemas.push('tem url(http…)');
    for (const m of doc.matchAll(ETIQUETA_IFRAME)) {
      if (!/\ssrcdoc="/.test(m[0]) && !/\ssrc="data:/.test(m[0]))
        problemas.push('iframe com pedido para fora');
    }
    for (const m of semQuadros(doc).matchAll(ATRIBUTO_SRC)) {
      if (!/^data:/.test(m[1])) problemas.push(`src externo: ${m[1].slice(0, 40)}`);
    }
  }

  /* 4 · tamanho */
  if (bytes > LIMITE) problemas.push(`acima de 400 KiB (${(bytes / 1024).toFixed(1)})`);

  /* 5 · algarismos, sobre todos os documentos juntos */
  const corpo = docs.map((d) => semFolhas(semCabeca(semQuadros(d)))).join('\n');
  const { resto: semExemplo, removidos: exemplos } = extrair(corpo, 'data-exemplo');
  for (const e of exemplos) {
    const d = corridas(soTexto(e));
    if (d.length) problemas.push(`data-exemplo com algarismos: ${d.join(' ')}`);
  }
  const { resto: semDesenho, removidos: desenhos } = extrair(semExemplo, 'data-desenho');
  for (const d of desenhos) {
    for (const n of corridas(soTexto(d))) desenho.push([f, n]);
  }

  const permitidos = new Set();
  for (const rota of FONTES[f] || []) {
    for (const n of digitosDeDist(rota)) permitidos.add(n);
  }
  const inventados = [];
  for (const n of corridas(soTexto(semDesenho))) {
    if (!permitidos.has(n) && !inventados.includes(n)) inventados.push(n);
  }
  if (!FONTES[f]) problemas.push('sem página construída correspondente declarada');
  if (inventados.length)
    problemas.push(`algarismos sem origem em dist: ${inventados.join(' ')}`);

  if (problemas.length) falhas++;
  linhas.push({
    ficheiro: f,
    kib: (bytes / 1024).toFixed(1),
    script: /<script[\s>]/i.test(bruto) ? 'SIM' : 'não',
    fora: problemas.some((p) => /pedido|src externo|<link>|<img>|@import|url\(/.test(p))
      ? 'SIM'
      : "não",
    exemplos: exemplos.length,
    estado: problemas.length ? 'FALHA' : 'passa',
    problemas,
  });
}

const col = (s, n) => String(s).padEnd(n);
console.log('DIREÇÃO B · INSTRUMENTO À FRENTE · conferência dos protótipos');
console.log(`origem dos algarismos: ${DIST}`);
console.log('');
console.log(
  col('ficheiro', 20) + col('KiB', 9) + col('<script>', 10) + col('pedidos', 9) +
    col('exemplos', 10) + 'estado'
);
console.log('-'.repeat(66));
for (const l of linhas) {
  console.log(
    col(l.ficheiro, 20) + col(l.kib, 9) + col(l.script, 10) + col(l.fora, 9) +
      col(l.exemplos, 10) + l.estado
  );
  for (const p of l.problemas) console.log('    · ' + p);
}
console.log('-'.repeat(66));
console.log(`ficheiros: ${linhas.length} · falhas: ${falhas} · limite: 400 KiB`);
console.log('');
console.log('Algarismos do desenho (marcados `data-desenho`), um a um:');
const porFicheiro = new Map();
for (const [f, n] of desenho) {
  if (!porFicheiro.has(f)) porFicheiro.set(f, []);
  porFicheiro.get(f).push(n);
}
if (!porFicheiro.size) console.log('  nenhum');
for (const [f, ns] of porFicheiro) console.log(`  ${col(f, 20)} ${ns.join(' ')}`);
console.log('');
console.log(falhas ? 'RESULTADO: FALHA' : 'RESULTADO: PASSA');
process.exit(falhas ? 1 : 0);
