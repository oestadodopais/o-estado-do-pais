/**
 * direção C · Editorial generoso · a conferência.
 *
 * Corre sobre os ficheiros desta pasta e escreve `CHECK.txt`.
 * Sai a 1 se alguma regra falhar.
 *
 *   node design/direcao-c/check.mjs
 *
 * O que confere, ficheiro a ficheiro:
 *
 *   1. nenhum <script>;
 *   2. nenhum pedido para fora: nada de `src=`, `<link>`, `@import` ou
 *      `url(` que não seja `data:`. As ligações (`href`) não são pedidos:
 *      são portas, e as portas para as fontes são o produto;
 *   3. menos de 400 KiB;
 *   4. a primeira linha é um comentário que nomeia a direção;
 *   5. nenhum travessão nem meio-traço no texto que a direção escreveu
 *      (o que é transcrito de uma fonte fica como está: IDENTIDADE §9).
 *
 * E a conferência dos algarismos, que é a que interessa:
 *
 *   6. todo o corrido de algarismos no texto de um protótipo existe,
 *      igual, no texto da página construída correspondente. Um número
 *      nestes protótipos é cópia, nunca invenção;
 *   7. um elemento marcado `data-exemplo` é um lugar desenhado e vazio:
 *      não pode ter um único algarismo;
 *   8. o quadro e o ficheiro de 390px não são páginas: o que embebem é
 *      conferido contra os protótipos, e o texto próprio deles contra
 *      uma lista curta, impressa aqui, de medidas de moldura.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(AQUI, '..', '..', 'dist');
const DIRECAO = 'direção C · Editorial generoso';

const PAGINAS = {
  '01-primeira.html': 'index.html',
  '02-linha.html': 'livro-razao/precos-da-habitacao-2025/index.html',
  '03-municipio.html': 'municipios/evora/index.html',
  '04-metodo.html': 'metodo/index.html',
  '05-agenda.html': 'agenda/index.html',
};
const MOLDURAS = ['06-mobile.html', 'board.html'];

/* As medidas que a moldura escreve sobre si própria. Não são do sítio, e
   por isso vão declaradas à mão, aqui, à vista. */
const MEDIDAS_DE_MOLDURA = ['390', '400', '06', '01', '02', '03', '04', '05', '2', '3'];

const TECTO = 400 * 1024;
const CORRIDO = /\d+(?:[.,   ]\d+)*/g;

const linhas = [];
const diz = (s) => linhas.push(s);
let falhas = 0;
const falha = (f, r) => {
  falhas += 1;
  diz(`FALHA  ${f}: ${r}`);
};

/* ------------------------------------------------------- texto de uma página */

/* Os corridos são colhidos NÓ A NÓ, e não do texto todo colado. Uma
   página construída vem sem espaços entre marcas e um protótipo escrito
   à mão vem com eles: colar tudo faria «2026-08-12» seguido de «7»
   virar um corrido só de um lado e dois do outro, e a conferência
   acusaria uma invenção que não existe. */
function textosDe(html, { semExemplos = false } = {}) {
  const raiz = parse(html);
  for (const n of raiz.querySelectorAll('script, style')) n.remove();
  if (semExemplos) for (const n of raiz.querySelectorAll('[data-exemplo]')) n.remove();
  const fora = [];
  const anda = (no) => {
    if (no.nodeType === 3) {
      const t = no.text;
      if (t && t.trim()) fora.push(t);
      return;
    }
    for (const f of no.childNodes || []) anda(f);
  };
  anda(raiz);
  return fora;
}

function corridos(textos) {
  const fora = new Set();
  for (const t of textos) for (const m of t.match(CORRIDO) || []) fora.add(m);
  return fora;
}

/* --------------------------------------------------------------- conferências */

const ficheiros = fs.readdirSync(AQUI).filter((f) => f.endsWith('.html')).sort();

diz(`CONFERÊNCIA · ${DIRECAO}`);
diz(`corrida a partir de design/direcao-c, contra dist/ do mesmo repositório`);
diz('');
diz('ficheiro              tamanho   script  pedidos  1.ª linha  travessões  algarismos');
diz('--------------------  --------  ------  -------  ---------  ----------  ----------');

for (const f of ficheiros) {
  const bruto = fs.readFileSync(path.join(AQUI, f), 'utf8');
  const tamanho = Buffer.byteLength(bruto);

  const temScript = /<script[\s>]/i.test(bruto);
  const pedidos = [];
  if (/<link\s/i.test(bruto)) pedidos.push('<link>');
  if (/@import/i.test(bruto)) pedidos.push('@import');
  if (/url\((?!\s*['"]?(?:data:|#))/i.test(bruto)) pedidos.push('url(');
  for (const m of bruto.matchAll(/\ssrc=(?!doc)["'][^"']*["']/gi)) pedidos.push(m[0].trim());

  const primeira = bruto.split('\n')[0];
  const primeiraOk = primeira.startsWith('<!--') && primeira.includes('direção C');

  /* Travessões: só no que esta direção escreveu. O que é transcrito de
     uma fonte (excertos, títulos de trabalhos, citações) fica como está,
     e por isso a conferência olha só para fora desses elementos. A regra
     da casa é «nem travessão nem meio-traço ENTRE ESPAÇOS»: um intervalo
     de anos colado passa, tal como passa na página construída. */
  const raiz = parse(bruto);
  for (const n of raiz.querySelectorAll('script, style, blockquote, .verbatim, .mun-estudo-titulo, .src-chip-texto, .agenda-criterio-nota, .agenda-nota, iframe')) n.remove();
  const travessoes = (raiz.text.match(/\s[—–]\s/g) || []).length;

  if (temScript) falha(f, 'tem <script>');
  if (pedidos.length) falha(f, `pede para fora: ${pedidos.slice(0, 3).join(' ')}`);
  if (tamanho > TECTO) falha(f, `${(tamanho / 1024).toFixed(1)} KiB, acima do tecto de 400 KiB`);
  if (!primeiraOk) falha(f, 'a primeira linha não é um comentário que nomeia a direção');
  if (travessoes) falha(f, `${travessoes} travessão(ões) em texto da casa`);

  /* ---------------------------------------------------------- algarismos */
  let veredicto = '';
  if (PAGINAS[f]) {
    const construida = fs.readFileSync(path.join(DIST, PAGINAS[f]), 'utf8');
    const permitidos = corridos(textosDe(construida));
    const usados = corridos(textosDe(bruto, { semExemplos: true }));
    const inventados = [...usados].filter((n) => !permitidos.has(n));

    const comExemplo = parse(bruto).querySelectorAll('[data-exemplo]');
    const exemplosComAlgarismo = comExemplo.filter((n) => /\d/.test(n.text));

    if (inventados.length) falha(f, `algarismos sem origem em dist/${PAGINAS[f]}: ${inventados.join(' · ')}`);
    if (exemplosComAlgarismo.length) falha(f, `${exemplosComAlgarismo.length} elemento(s) data-exemplo com algarismos`);
    veredicto = inventados.length ? 'inventados' : `${usados.size} corridos, todos de dist`;
  } else if (MOLDURAS.includes(f)) {
    /* O que a moldura embebe tem de vir dos protótipos. */
    const dentro = [...bruto.matchAll(/srcdoc="([^"]*)"/g)].map((m) =>
      m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    );
    const permitidos = new Set();
    for (const p of Object.keys(PAGINAS)) {
      for (const n of corridos(textosDe(fs.readFileSync(path.join(AQUI, p), 'utf8')))) permitidos.add(n);
    }
    const embebidos = new Set();
    for (const d of dentro) for (const n of corridos(textosDe(d))) embebidos.add(n);
    const estranhos = [...embebidos].filter((n) => !permitidos.has(n));

    const semMolduras = parse(bruto);
    for (const n of semMolduras.querySelectorAll('script, style, iframe')) n.remove();
    const textosProprios = [];
    const andaMoldura = (no) => {
      if (no.nodeType === 3) { if (no.text && no.text.trim()) textosProprios.push(no.text); return; }
      for (const f of no.childNodes || []) andaMoldura(f);
    };
    andaMoldura(semMolduras);
    const proprios = [...corridos(textosProprios)].filter((n) => !MEDIDAS_DE_MOLDURA.includes(n));

    if (estranhos.length) falha(f, `embebe algarismos que não estão em nenhum protótipo: ${estranhos.join(' · ')}`);
    if (proprios.length) falha(f, `texto de moldura com algarismos fora da lista declarada: ${proprios.join(' · ')}`);
    veredicto = `${embebidos.size} corridos embebidos, todos dos protótipos`;
  } else {
    veredicto = 'sem página correspondente';
  }

  diz(
    [
      f.padEnd(20),
      `${(tamanho / 1024).toFixed(1)} KiB`.padStart(8),
      (temScript ? 'SIM' : 'não').padStart(6),
      (pedidos.length ? String(pedidos.length) : 'nenhum').padStart(7),
      (primeiraOk ? 'ok' : 'FALHA').padStart(9),
      String(travessoes).padStart(10),
      '  ' + veredicto,
    ].join('  ')
  );
}

diz('');
diz('Algarismos que a moldura escreve sobre si própria, declarados à mão:');
diz('  390 e 400 são larguras e o tecto de tamanho; 01 a 06 numeram as peças;');
diz('  2 e 3 são os nomes das fichas paper-2 e paper-3 na amostra da paleta.');
diz('Lista:');
diz('  ' + MEDIDAS_DE_MOLDURA.join(' · '));
diz('');
diz('Ligações para fora: são portas, não pedidos. As páginas construídas citam');
diz('as suas fontes por endereço, e esses endereços atravessaram tal como estão.');
diz('');
diz(falhas === 0 ? 'PASSA. Nenhuma falha.' : `FALHA. ${falhas} problema(s).`);

const saida = linhas.join('\n') + '\n';
fs.writeFileSync(path.join(AQUI, 'CHECK.txt'), saida);
process.stdout.write(saida);
process.exit(falhas === 0 ? 0 : 1);
