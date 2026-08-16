/* Direção A · Refinamento · conferência dos protótipos.

   node design/direcao-a/check.mjs > design/direcao-a/CHECK.txt

   Sete conferências, por ficheiro HTML:
     1 sem script
     2 sem pedido para fora (nada que o navegador vá buscar sozinho)
     3 endereços: só o sítio, o correio das correções, âncoras da própria
       página, e endereços que a página construída correspondente já publica
     4 abaixo de 400 KiB
     5 primeira linha é um comentário que nomeia a direção
     6 algarismos: cada número do texto rendido existe, tal e qual, na página
       construída correspondente; uma caixa marcada data-exemplo não tem
       nenhum algarismo; um número marcado data-design é medida do desenho e
       vai listado, para se poder conferir à mão
     7 cada classe usada tem regra na folha que a página leva consigo
     8 travessões: só dentro de texto que a página construída já publica     */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..', '..');
const DIRECAO = 'Direção A · Refinamento';
const LIMITE = 400 * 1024;
const SITIO = ['oestadodopaís.pt', 'xn--oestadodopas-2fb.pt'];

const CONSTRUIDAS = {
  primeira: 'dist/index.html',
  linha: 'dist/livro-razao/precos-da-habitacao-2025/index.html',
  municipio: 'dist/municipios/evora/index.html',
  metodo: 'dist/metodo/index.html',
  agenda: 'dist/agenda/index.html',
};
const REFERENCIA = {
  '01-primeira.html': ['primeira'],
  '02-linha.html': ['linha'],
  '03-municipio.html': ['municipio'],
  '04-metodo.html': ['metodo'],
  '05-agenda.html': ['agenda'],
  '06-mobile.html': ['primeira', 'linha'],
  'board.html': ['primeira', 'linha', 'municipio', 'metodo', 'agenda'],
};

/* ------------------------------------------------------------------ leitura */
const entidades = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodificar = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (_, n) => (n.toLowerCase() in entidades ? entidades[n.toLowerCase()] : `&${n};`));

/* O texto que o leitor vê, incluindo o das páginas embebidas em srcdoc. Sai o
   que não é texto: estilo, comentários, e os atributos, que morrem com as
   etiquetas. Cada etiqueta vira um espaço, para que dois números colados por
   marcação não se leiam como um número só. */
function expandir(html) {
  let t = html;
  while (/srcdoc='/.test(t)) t = t.replace(/srcdoc='([\s\S]*?)'>/g, (_, doc) => `>
${decodificar(doc)}
`);
  return t;
}

function textoRendido(html) {
  let t = expandir(html);
  t = t.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  t = t.replace(/<!--[\s\S]*?-->/g, ' ');
  t = t.replace(/<[^>]*>/g, ' ');
  return normalizar(decodificar(t));
}
const normalizar = (s) => s.replace(/[   ]/g, ' ').replace(/\s+/g, ' ');

/* Texto de um elemento marcado com um atributo, com o seu conteúdo. */
function elementosCom(html, atributo) {
  const achados = [];
  const re = new RegExp(`<([a-z0-9]+)([^>]*\\s${atributo}(?=[\\s=>])[^>]*)>`, 'gi');
  let m;
  while ((m = re.exec(html))) {
    const etiqueta = m[1];
    const fim = html.indexOf(`</${etiqueta}>`, re.lastIndex);
    achados.push(normalizar(decodificar((fim === -1 ? '' : html.slice(re.lastIndex, fim)).replace(/<[^>]*>/g, ' '))));
  }
  return achados;
}

/* Classes que são só apoio de marcação, sem desenho próprio: declaradas aqui
   para que a conferência não as confunda com uma regra em falta. */
const SEM_ESTILO = new Set(['mecanismo-no', 'agenda-historico-entrada', 'claim-value']);

/* Cada documento do ficheiro: o próprio, e os que vão embebidos com srcdoc,
   até ao fundo. De cada um sai a sua folha e o seu corpo sem os embebidos. */
function documentos(html) {
  const folha = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
  const corpo = html.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/srcdoc='[\s\S]*?'>/g, '>');
  const dentro = [...html.matchAll(/srcdoc='([\s\S]*?)'>/g)].flatMap((m) => documentos(decodificar(m[1])));
  return [{ folha, corpo }, ...dentro];
}

const TOKEN = /[0-9][0-9.,/ -]*[0-9]|[0-9]/g;
const numeros = (texto) => (texto.match(TOKEN) || []).map((n) => n.trim()).filter(Boolean);

/* ------------------------------------------------------------- conferências */
const ficheiros = readdirSync(AQUI).filter((f) => f.endsWith('.html')).sort();
const refCache = {};
for (const [k, v] of Object.entries(CONSTRUIDAS)) refCache[k] = textoRendido(readFileSync(join(RAIZ, v), 'utf8'));
const refBruta = {};
for (const [k, v] of Object.entries(CONSTRUIDAS)) refBruta[k] = readFileSync(join(RAIZ, v), 'utf8');

const linhas = [];
let falhas = 0;
const total = { design: [], exemplo: 0 };

for (const f of ficheiros) {
  const bruto = readFileSync(join(AQUI, f), 'utf8');
  /* As páginas embebidas com srcdoc são documentos inteiros: para as conferir
     abrem-se aqui, e cada conferência corre sobre o documento aberto. */
  const aberto = expandir(bruto);
  const bytes = Buffer.byteLength(bruto);
  const refs = REFERENCIA[f];
  if (!refs) throw new Error(`sem página construída correspondente: ${f}`);
  const alvo = refs.map((r) => refCache[r]).join(' ');
  const alvoBruto = refs.map((r) => refBruta[r]).join(' ');
  const problemas = [];

  /* 1 · sem script */
  const scripts = (aberto.match(/<script/gi) || []).length;
  if (scripts) problemas.push(`${scripts} <script>`);

  /* 2 · sem pedido para fora */
  const pedidos = [];
  for (const re of [/\ssrc\s*=/gi, /\ssrcset\s*=/gi, /<link\b/gi, /@import/gi, /url\(\s*['"]?https?:/gi]) {
    const n = (aberto.match(re) || []).length;
    if (n) pedidos.push(`${re.source}:${n}`);
  }
  if (pedidos.length) problemas.push(`pedidos automáticos: ${pedidos.join(' ')}`);

  /* 3 · endereços */
  const foraDeCasa = new Set();
  for (const m of aberto.matchAll(/href=["']([^"']+)["']/g)) {
    const u = decodificar(m[1]);
    if (u.startsWith('#') || u.startsWith('mailto:correcoes@oestadodopais.pt')) continue;
    if (SITIO.some((d) => u.includes(`://${d}`))) continue;
    if (alvoBruto.includes(u) || alvoBruto.includes(u.replace(/&/g, '&amp;'))) continue;
    foraDeCasa.add(u);
  }
  if (foraDeCasa.size) problemas.push(`endereços não publicados na página construída: ${[...foraDeCasa].join(' ')}`);

  /* 4 · tamanho */
  if (bytes > LIMITE) problemas.push(`${bytes} B acima de ${LIMITE} B`);

  /* 5 · primeira linha */
  const primeira = bruto.split('\n')[0];
  if (!(primeira.startsWith('<!--') && primeira.includes(DIRECAO))) problemas.push('primeira linha não nomeia a direção');

  /* 6 · algarismos */
  const exemplos = elementosCom(aberto, 'data-exemplo');
  const comAlgarismos = exemplos.filter((e) => /[0-9]/.test(e));
  total.exemplo += exemplos.length;
  if (comAlgarismos.length) problemas.push(`caixa de exemplo com algarismos: ${comAlgarismos.join(' | ')}`);

  const desenho = elementosCom(aberto, 'data-design');
  const numsDesenho = new Set(desenho.flatMap(numeros));
  for (const n of numsDesenho) total.design.push(`${f}: ${n}`);

  const texto = textoRendido(bruto);
  const inventados = [];
  for (const n of new Set(numeros(texto))) {
    if (alvo.includes(n)) continue;
    if (numsDesenho.has(n)) continue;
    if (n.split(' ').every((p) => alvo.includes(p) || numsDesenho.has(p))) continue;
    inventados.push(n);
  }
  if (inventados.length) problemas.push(`números sem origem na página construída: ${inventados.join(' | ')}`);

  /* 7 · cada classe usada tem regra na folha que a página carrega.
     Uma página embebida com srcdoc é um documento com folha própria, e as suas
     classes conferem-se contra essa folha, não contra a de quem a embebe. */
  const semRegra = new Set();
  for (const { folha, corpo } of documentos(bruto)) {
    for (const m of corpo.matchAll(/class=["']([^"']+)["']/g)) {
      for (const cl of m[1].split(/\s+/).filter(Boolean)) {
        if (!folha.includes(`.${cl}`) && !SEM_ESTILO.has(cl)) semRegra.add(cl);
      }
    }
  }
  if (semRegra.size) problemas.push(`classes sem regra na folha da página: ${[...semRegra].join(' ')}`);

  /* 8 · travessões */
  const travessoes = [];
  for (const m of texto.matchAll(/(\S+)\s[\u2014\u2013]\s(\S+(\s\S+)?)/g)) {
    if (!alvo.includes(m[0])) travessoes.push(m[0]);
  }
  if (travessoes.length) problemas.push(`travessão fora de texto transcrito: ${travessoes.slice(0, 3).join(' | ')}`);

  const passa = problemas.length === 0;
  if (!passa) falhas += 1;
  linhas.push({
    f,
    bytes,
    scripts,
    numeros: new Set(numeros(texto)).size,
    exemplos: exemplos.length,
    desenho: numsDesenho.size,
    estado: passa ? 'passa' : 'FALHA',
    problemas,
  });
}

/* ------------------------------------------------------------------ relatório */
const col = (s, n) => String(s).padEnd(n);
const colD = (s, n) => String(s).padStart(n);
const saida = [];
saida.push(`${DIRECAO} · conferência dos protótipos`);
saida.push(`corrida a partir de ${AQUI.replace(RAIZ + '/', '')}, contra dist/ em ${Object.values(CONSTRUIDAS).length} páginas construídas`);
saida.push('');
saida.push(
  `${col('ficheiro', 20)}${colD('bytes', 8)}${colD('script', 8)}${colD('números', 9)}${colD('exemplo', 9)}${colD('desenho', 9)}  estado`
);
saida.push('-'.repeat(72));
for (const l of linhas) {
  saida.push(
    `${col(l.f, 20)}${colD(l.bytes, 8)}${colD(l.scripts, 8)}${colD(l.numeros, 9)}${colD(l.exemplos, 9)}${colD(l.desenho, 9)}  ${l.estado}`
  );
  for (const p of l.problemas) saida.push(`    ${p}`);
}
saida.push('-'.repeat(72));
saida.push(`limite de tamanho: ${LIMITE} B por ficheiro`);
saida.push(`caixas de exemplo (sem algarismos, por regra): ${total.exemplo}`);
saida.push('');
saida.push('Números marcados data-design, medidas do próprio desenho e não de Portugal:');
for (const d of total.design) saida.push(`  ${d}`);
saida.push('');
saida.push(falhas === 0 ? 'RESULTADO: passa em todos os ficheiros.' : `RESULTADO: ${falhas} ficheiro(s) com defeito.`);
console.log(saida.join('\n'));
process.exit(falhas === 0 ? 0 : 1);
