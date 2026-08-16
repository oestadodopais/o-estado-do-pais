#!/usr/bin/env node
/**
 * A régua deste bloco — mede o que o BRIEF-confianca.md mediu, para se poder
 * dizer «antes» e «depois» com o mesmo instrumento.
 *
 * NÃO é um portão: não falha nada, não entra no `npm run build`. É uma fita
 * métrica. Corre sobre `dist/` e sobre `ledger/claims/`, e imprime seis
 * contagens:
 *
 *   1. porta de correcções — quantas páginas construídas trazem a caixa
 *      «Encontrou um erro», e quantas não trazem;
 *   2. selos na primeira página — valores (`data-claim`) sem selo ao lado, e
 *      selos que apontam para outra linha que não a do valor;
 *   3. frases de moldura — blocos de texto com 30 ou mais carácteres que
 *      aparecem em mais do que uma página;
 *   4. o marcador retirado `[descrição em preparação]`;
 *   5. `#page=` nas linhas do livro-razão;
 *   6. localizadores que nomeiam um artefacto interno (ficheiro, chave JSON).
 *
 * Uso:  node scripts/medir-defeitos.mjs            (imprime)
 *       node scripts/medir-defeitos.mjs --json     (para guardar uma medição)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

import { loadClaims } from '../src/lib/ledger.mjs';
import { matchPath, routePath } from '../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

function ficheirosHtml(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...ficheirosHtml(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out.sort();
}

function texto(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

const SECCIONADORES = new Set(['section', 'article', 'aside', 'details', 'main', 'header', 'footer', 'body', 'html']);

/**
 * Uma «frase de moldura», definida como programa.
 *
 * É prosa da casa — as palavras que embrulham os números, não os números nem os
 * campos do livro-razão. Definição mecânica, para que «antes» e «depois» sejam
 * medidos com a mesma régua e por qualquer pessoa:
 *
 *   · um bloco de texto (um elemento que não contém outro elemento de bloco);
 *   · com 30 ou mais carácteres;
 *   · que não seja, nem contenha, conteúdo com origem declarada — `data-claim`,
 *     `data-linha-*`, `data-correcao-*`, `data-verbatim`, `data-nonledger`,
 *     `data-agenda`. Esses são o livro-razão, ou o registo da agenda, a falar,
 *     e não a casa. (`data-agenda` entrou a 16.08.2026 com a origem 8, pela
 *     mesma razão das outras: um excerto do calendário das fontes é a fonte a
 *     falar, e contá-lo como moldura da casa mediria a coisa errada. Quem
 *     comparar duas construções tem de correr esta régua nas duas.);
 *   · e que apareça em MAIS DO QUE UMA página construída.
 *
 * A última condição é a do BRIEF §3.2 («todas as 43 aparecem em mais de uma
 * página»): uma frase escrita uma vez, num sítio, é conteúdo; a mesma frase
 * repetida em 264 páginas é moldura.
 *
 * **Esta régua NÃO reproduz os números do BRIEF, e é honesto dizê-lo.** As 43
 * frases do §3.2 foram identificadas à mão, uma a uma; esta definição é
 * mecânica e apanha mais coisas — rótulos, cabeçalhos de secção, estados vazios
 * — pelo que dá 86 onde o BRIEF deu 43. O que a régua serve é **comparar duas
 * construções com o mesmo instrumento**: um número absoluto desta saída não é
 * comparável com um número do BRIEF, e um «antes» e um «depois» medidos aqui
 * são comparáveis entre si e com mais nada.
 */
const BLOCOS = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption';
const ORIGEM_DECLARADA =
  '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],[data-agenda]';

function blocosDe(root) {
  const out = [];
  const marcados = new Set();
  for (const el of root.querySelectorAll(ORIGEM_DECLARADA)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  for (const el of root.querySelectorAll(BLOCOS)) {
    if (el.querySelector(BLOCOS)) continue;
    if (marcados.has(el)) continue;
    if (el.querySelector(ORIGEM_DECLARADA)) continue;
    const t = norm(texto(el));
    if (t.length >= 30) out.push(t);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const claims = loadClaims();
const ficheiros = ficheirosHtml(DIST);

let paginas = 0;
let comPorta = 0;
const semPorta = [];
const ocorrenciasPorBloco = new Map(); // bloco → total
const paginasPorBloco = new Map(); // bloco → nº de páginas
let marcadorRetirado = 0;
const paginasComMarcadorRetirado = new Set();

let frontSemSelo = [];
let frontSeloErrado = [];
const blocosDaPorta = new Set();

for (const file of ficheiros) {
  const rel = path.relative(DIST, file);
  const caminho = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const rota = matchPath(caminho);
  if (rota?.key === 'documento') continue; // obra citada: fora da conta, como no BRIEF
  paginas++;

  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true } });

  /* 1 — a porta de correcções */
  const portas = root.querySelectorAll('[data-porta-correccoes]');
  if (portas.length) comPorta++;
  else semPorta.push(caminho || '/');

  /* 3 — blocos repetidos */
  const vistosNestaPagina = new Set();
  for (const b of blocosDe(root)) {
    ocorrenciasPorBloco.set(b, (ocorrenciasPorBloco.get(b) ?? 0) + 1);
    vistosNestaPagina.add(b);
  }
  for (const porta of portas) for (const b of blocosDe(porta)) blocosDaPorta.add(b);
  for (const b of vistosNestaPagina) {
    paginasPorBloco.set(b, (paginasPorBloco.get(b) ?? 0) + 1);
  }

  /* 4 — o marcador retirado */
  const n = (html.match(/\[descrição em preparação\]/g) ?? []).length;
  if (n) {
    marcadorRetirado += n;
    paginasComMarcadorRetirado.add(caminho || '/');
  }

  /* 2 — selos na primeira página. A mesma regra que o portão impõe: procura-se
     a subir, e a procura pára ao atravessar um elemento de secção. */
  if (rota?.key === 'home') {
    const body = root.querySelector('body') ?? root;
    for (const el of body.querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim');
      const alvo = routePath('linha', rota.lang, { slug: id });
      let no = el.parentNode;
      let ok = false;
      let outro = null;
      while (no && !ok) {
        for (const a of no.querySelectorAll?.('.src-chip') ?? []) {
          if (String(a.rawTagName ?? '').toLowerCase() !== 'a') continue;
          const href = a.getAttribute('href') ?? '';
          if (href === alvo) { ok = true; break; }
          if (!outro) outro = href;
        }
        if (SECCIONADORES.has(String(no.rawTagName ?? '').toLowerCase())) break;
        no = no.parentNode;
      }
      if (ok) continue;
      if (outro) frontSeloErrado.push(`${caminho || '/'} ${id} → ${outro}`);
      else frontSemSelo.push(`${caminho || '/'} ${id}`);
    }
  }
}

/**
 * 5 e 6 — o livro-razão.
 *
 * «Localizador interno» tem aqui uma definição, e não um julgamento: um
 * localizador é interno quando manda o leitor a uma coisa que ele não tem —
 *
 *   · um ficheiro `.json` ou um caminho `raw/` do repositório do motor;
 *   · uma chave de estrutura de dados (`Dados["2024"]`, `cm_lists`,
 *     `executive_2025.seats[…]`, `mandates[…]`, `final_recipients`,
 *     `total_mandates`, ou uma seta `→` para dentro de um objecto);
 *   · o nome de um ficheiro `.pdf` que NÃO aparece no endereço da própria linha
 *     (o caso da DGAL: o localizador diz `dgal_divida_2024.pdf` e o endereço é
 *     uma cadeia de interrogação sem nome de ficheiro nenhum).
 *
 * Um localizador que diga «p. 119» sobre um PDF cujo nome está no endereço não
 * é interno: é exactamente o que o campo serve para dizer.
 */
let comPage = 0;
const localizadoresInternos = [];
const CHAVES = /(\.json|raw\/|→|\[["']|\bcm_lists\b|\bexecutive_\d|\bmandates\[|\bfinal_recipients\b|\btotal_mandates\b)/;
for (const [id, c] of claims) {
  if (typeof c.source_url === 'string' && c.source_url.includes('#page=')) comPage++;
  const loc = c.document?.locator;
  if (typeof loc !== 'string') continue;
  const url = typeof c.source_url === 'string' ? c.source_url : '';
  const pdfsNoLocalizador = loc.match(/[^\s,/]+\.pdf/gi) ?? [];
  const pdfAusente = pdfsNoLocalizador.some((f) => !url.includes(f));
  if (CHAVES.test(loc) || pdfAusente) localizadoresInternos.push(`${id}: ${loc}`);
}

/* --- relatório --- */
const molduras = [...ocorrenciasPorBloco.entries()]
  .filter(([b]) => (paginasPorBloco.get(b) ?? 0) > 1)
  .sort((a, b) => b[1] - a[1]);
const totalOcorrencias = molduras.reduce((s, [, n]) => s + n, 0);
/* A porta das correções é uma função, não moldura — mas é prosa repetida em
   todas as páginas, e por isso conta. Diz-se à parte para que o «antes» e o
   «depois» não pareçam iguais por acaso. */
const ocorrenciasDaPorta = molduras
  .filter(([b]) => blocosDaPorta.has(b))
  .reduce((s, [, n]) => s + n, 0);

const medicao = {
  paginas,
  porta_correccoes: { com: comPorta, sem: semPorta.length },
  primeira_pagina: { sem_selo: frontSemSelo.length, selo_para_outra_linha: frontSeloErrado.length },
  frases_de_moldura: {
    distintas: molduras.length,
    ocorrencias: totalOcorrencias,
    na_porta_de_correccoes: ocorrenciasDaPorta,
    sem_a_porta: totalOcorrencias - ocorrenciasDaPorta,
  },
  primeira_pagina_distintas: {
    sem_selo: new Set(frontSemSelo.map((x) => x.split(' ').pop())).size,
    selo_para_outra_linha: new Set(frontSeloErrado.map((x) => x.split(' ')[1])).size,
  },
  marcador_retirado: { ocorrencias: marcadorRetirado, paginas: paginasComMarcadorRetirado.size },
  linhas_com_page: comPage,
  localizadores_internos: localizadoresInternos.length,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ...medicao, detalhe: {
    sem_porta: semPorta,
    front_sem_selo: frontSemSelo,
    front_selo_errado: frontSeloErrado,
    localizadores_internos: localizadoresInternos,
    molduras: molduras.map(([b, n]) => ({ n, paginas: paginasPorBloco.get(b), texto: b.slice(0, 150) })),
  } }, null, 2));
  process.exit(0);
}

console.log('');
console.log(cinza(`  medição · ${paginas} páginas construídas (sem os documentos de estudo)`));
console.log('');
console.log(`  porta de correcções ....... ${comPorta}/${paginas} páginas` + (semPorta.length ? amarelo(`  (${semPorta.length} sem)`) : verde('  ✓')));
console.log(`  primeira página ........... ${frontSemSelo.length} valores sem selo · ${frontSeloErrado.length} selos para outra linha`);
console.log(
  `  primeira página (distintas) ${new Set(frontSemSelo.map((x) => x.split(' ').pop())).size} sem selo · ` +
    `${new Set(frontSeloErrado.map((x) => x.split(' ')[1])).size} para outra linha`,
);
console.log(
  `  frases de moldura ......... ${molduras.length} distintas · ${totalOcorrencias} ocorrências ` +
    `(${ocorrenciasDaPorta} são a porta de correcções; sem ela, ${totalOcorrencias - ocorrenciasDaPorta})`,
);
console.log(`  [descrição em preparação] . ${marcadorRetirado} ocorrências em ${paginasComMarcadorRetirado.size} páginas`);
console.log(`  linhas com #page= ......... ${comPage} de ${claims.size}`);
console.log(`  localizadores internos .... ${localizadoresInternos.length}`);
console.log('');
if (semPorta.length) {
  console.log(cinza('  páginas sem porta de correcções (primeiras 10):'));
  for (const p of semPorta.slice(0, 10)) console.log(cinza('    · ' + p));
  console.log('');
}
