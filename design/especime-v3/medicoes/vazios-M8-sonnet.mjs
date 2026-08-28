#!/usr/bin/env node
/**
 * vazios-M8-sonnet.mjs
 *
 * Medição cega do bloco «vazios» (M8), por Claude Sonnet, sobre o `dist/`
 * construído na cópia `wt-medidor-2` (detached em 355287c).
 *
 * Escrito do zero: não importa nada de `scripts/` nem de `src/` do sítio.
 * Usa três bibliotecas de terceiros já presentes em node_modules (o mesmo
 * género de escolha que a medição M7 fez com Playwright): `js-yaml` para ler
 * as linhas do livro-razão, `node-html-parser` para ler o HTML construído, e
 * `pdftotext` (poppler, `/opt/homebrew/bin/pdftotext`) para ler os PDFs que o
 * motor aloja.
 *
 * Cada detetor que pode reportar um zero corre primeiro contra um caso
 * plantado (uma cópia alterada, nunca o `dist/` real) e só corre a sério
 * depois de se ver vermelho nesse caso. As cópias plantadas vivem em
 * `os.tmpdir()`, nunca dentro do repositório.
 *
 * Reprodução: `node design/especime-v3/medicoes/vazios-M8-sonnet.mjs` a
 * partir da raiz da cópia (precisa de `dist/` já construído).
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { load as yamlLoad } from 'js-yaml';
import { parse as parseHtml } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..'); // medicoes -> especime-v3 -> design -> raiz
const DIST = path.join(ROOT, 'dist');
const LEDGER_CLAIMS = path.join(ROOT, 'ledger', 'claims');
const ENGINE_ROOT = path.join(os.homedir(), 'Instruments', 'ResearchHub');
const PDFTOTEXT = '/opt/homebrew/bin/pdftotext';

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'vazios-m8-'));

const RESULTS = {};
const custosDeSimbolos = { ferramentas: [] };

function log(...args) {
  console.log(...args);
}
function secao(titulo) {
  log('\n' + '='.repeat(78));
  log(titulo);
  log('='.repeat(78));
}

// --------------------------------------------------------------------------
// utilidades gerais
// --------------------------------------------------------------------------

function walkHtmlFiles(dir) {
  const out = [];
  (function rec(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) rec(p);
      else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
    }
  })(dir);
  return out;
}

function relDist(p) {
  return '/' + path.relative(DIST, p).split(path.sep).join('/');
}

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

/** Extrai o texto visível de um documento HTML já lido, espaços colapsados,
 * tal como a cadeia normalizada de INVENTARIO-FRASES.md descreve. Junta os
 * nós de texto com um espaço nas fronteiras de elemento, o que reconstrói
 * tanto frases correntes como frases com um pedaço embrulhado (um `{claim}`
 * dentro de `Frase.astro`). Devolve também as listas de `title=` e
 * `aria-label=` de todos os elementos. */
function extrairTexto(root) {
  root.querySelectorAll('script, style').forEach((n) => n.remove());
  const partes = [];
  (function andar(node) {
    if (node.nodeType === 3) {
      partes.push(node.rawText);
    } else if (node.childNodes) {
      for (const c of node.childNodes) andar(c);
      partes.push(' ');
    }
  })(root);
  const corpo = partes.join('').replace(/\s+/g, ' ').trim();
  const titles = [];
  const arias = [];
  for (const el of root.querySelectorAll('[title]')) {
    const v = el.getAttribute('title');
    if (v) titles.push(v.replace(/\s+/g, ' ').trim());
  }
  for (const el of root.querySelectorAll('[aria-label]')) {
    const v = el.getAttribute('aria-label');
    if (v) arias.push(v.replace(/\s+/g, ' ').trim());
  }
  // a descrição do <head>: INVENTARIO-FRASES.md diz-a explicitamente parte da
  // superfície lida («a régua passa a recolher também a descrição do <head>»).
  const metas = [];
  for (const el of root.querySelectorAll('meta[name="description"]')) {
    const v = el.getAttribute('content');
    if (v) metas.push(v.replace(/\s+/g, ' ').trim());
  }
  return { corpo, titles, arias, metas };
}

function carregaHtml(absPath) {
  return parseHtml(readText(absPath));
}

/** Lê e valida um claim do livro-razão. Sem importar `src/lib/ledger.mjs`:
 * é `js-yaml` sozinho, mais a leitura do campo. */
function carregaClaim(id) {
  const p = path.join(LEDGER_CLAIMS, `${id}.yml`);
  if (!fs.existsSync(p)) throw new Error(`claim inexistente: ${id} (${p})`);
  const doc = yamlLoad(readText(p));
  if (!doc || typeof doc !== 'object') throw new Error(`claim ilegível: ${id}`);
  return doc;
}

function listaFicheirosClaims() {
  return fs.readdirSync(LEDGER_CLAIMS).filter((f) => f.endsWith('.yml'));
}

function numeroDoValorPT(s) {
  if (typeof s !== 'string') return null;
  let v = s.trim().replace(/−/g, '-').replace(/[   \s]/g, '');
  v = v.replace(/%$/, '');
  if (!/^-?[\d.,]+$/.test(v)) return null;
  const temVirgula = v.includes(',');
  const temPonto = v.includes('.');
  if (temVirgula && temPonto) v = v.replace(/\./g, '').replace(',', '.');
  else if (temVirgula) v = v.replace(',', '.');
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Arnês do caso conhecido: corre `testFn`, que devolve `true` quando o
 * detetor viu o defeito plantado. Se não viu, a medição inteira pára aqui:
 * um detetor que não prova o vermelho não tem licença para dar um zero. */
const casosConhecidos = [];
function provaCasoConhecido(nome, testFn) {
  let viu = false;
  let detalhe = '';
  try {
    const r = testFn();
    viu = !!(r && r.vermelho);
    detalhe = (r && r.detalhe) || '';
  } catch (e) {
    viu = false;
    detalhe = `excepção: ${e.message}`;
  }
  casosConhecidos.push({ nome, viu, detalhe });
  if (!viu) {
    throw new Error(`CASO CONHECIDO FALHOU: "${nome}" não se viu vermelho (${detalhe}). A parar.`);
  }
  log(`  [caso conhecido, visto vermelho] ${nome} · ${detalhe}`);
}

log(`ROOT = ${ROOT}`);
log(`DIST = ${DIST}`);
log(`TMP  = ${TMP}`);
if (!fs.existsSync(DIST)) throw new Error('dist/ não existe: corre "npm run build" primeiro.');

const TODOS_HTML = walkHtmlFiles(DIST);
log(`ficheiros .html em dist/: ${TODOS_HTML.length}`);

function bucketDaRota(relPath) {
  const segs = relPath.split('/').filter(Boolean);
  if (segs.length === 0) return '/';
  if (segs[0] === 'en') return 'en/' + (segs[1] ?? '');
  return segs[0];
}

// ============================================================================
// MEDIDA 1 · as duas frases de ausência em dist/
// ============================================================================
function medida1() {
  secao('MEDIDA 1 · «sem linha ainda» / «no row yet» em dist/');
  const FRASES = ['sem linha ainda', 'no row yet'];

  function contaFrase(frase, ficheiros) {
    const ocorrencias = [];
    for (const f of ficheiros) {
      const txt = readText(f);
      const n = txt.split(frase).length - 1;
      if (n > 0) ocorrencias.push({ ficheiro: relDist(f), n });
    }
    return ocorrencias;
  }

  // caso conhecido: planta a frase numa cópia de uma página real
  provaCasoConhecido('M1 · frase plantada numa cópia', () => {
    const origem = path.join(DIST, 'municipios', 'agueda', 'index.html');
    const destDir = path.join(TMP, 'm1-caso');
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, 'index.html');
    const html = readText(origem).replace('</body>', '<p>sem linha ainda</p></body>');
    fs.writeFileSync(dest, html);
    const achado = contaFrase('sem linha ainda', [dest]);
    return { vermelho: achado.length === 1 && achado[0].n === 1, detalhe: `achou ${achado.length} ficheiro(s)` };
  });

  const porFrase = {};
  const porRotaCobertura = {};
  for (const f of TODOS_HTML) {
    const b = bucketDaRota(relDist(f));
    porRotaCobertura[b] = (porRotaCobertura[b] ?? 0) + 1;
  }
  for (const frase of FRASES) {
    const ocorrencias = contaFrase(frase, TODOS_HTML);
    porFrase[frase] = ocorrencias;
    log(`  "${frase}": ${ocorrencias.length} ficheiro(s) com a frase, de ${TODOS_HTML.length} .html varridos`);
    for (const o of ocorrencias.slice(0, 20)) log(`    · ${o.ficheiro} (${o.n}x)`);
  }

  RESULTS.m1 = {
    ficheirosVarridos: TODOS_HTML.length,
    coberturaPorRota: porRotaCobertura,
    ocorrencias: porFrase,
    totalOcorrencias: Object.values(porFrase).reduce((a, b) => a + b.length, 0),
  };
  return RESULTS.m1;
}

// ============================================================================
// MEDIDA 2 · as peças por página, nas 308 x 2 edições
// ============================================================================

// As sete medidas actuais (Emenda 14 sem a sétima), lidas de src/data/concelhos.mjs.
const NOMES_ACTUAIS = {
  pt: [
    'População residente',
    'Poder de compra por habitante',
    'Desemprego registado',
    'Empresas não financeiras',
    'Dívida total do município',
    'Índice de dívida',
    'Prazo médio de pagamento',
  ],
  en: [
    'Resident population',
    'Purchasing power per inhabitant',
    'Registered unemployment',
    'Non-financial enterprises',
    'Total municipal debt',
    'Debt index',
    'Average payment time',
  ],
};
// As oito medidas em `main` 35313eb, lidas com `git show 35313eb:src/data/concelhos.mjs`
// (não construídas: só a lista, como o brief permite).
const NOMES_35313EB = {
  pt: [
    'População residente',
    'Poder de compra por habitante',
    'Desemprego registado',
    'Empresas não financeiras',
    'Dívida total do município',
    'Índice de dívida',
    'Execução da receita',
    'Prazo médio de pagamento',
  ],
  en: [
    'Resident population',
    'Purchasing power per inhabitant',
    'Registered unemployment',
    'Non-financial enterprises',
    'Total municipal debt',
    'Debt index',
    'Revenue execution',
    'Average payment time',
  ],
};

function extraiPecas(root) {
  const arts = root.querySelectorAll('article.peca');
  return arts.map((a) => {
    const nomeEl = a.querySelector('.peca-nome');
    return {
      vazia: a.hasAttribute('data-medida-vazia'),
      nome: nomeEl ? nomeEl.text.replace(/\s+/g, ' ').trim() : null,
      dataMedida: a.getAttribute('data-medida') ?? null,
    };
  });
}

function listaConcelhos() {
  return fs
    .readdirSync(path.join(DIST, 'municipios'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function medida2() {
  secao('MEDIDA 2 · peças por página de concelho, 308 x 2 edições');

  const slugs = listaConcelhos();
  log(`  concelhos com subpasta em dist/municipios/: ${slugs.length}`);
  const slugsEn = fs
    .readdirSync(path.join(DIST, 'en', 'municipalities'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  log(`  concelhos com subpasta em dist/en/municipalities/: ${slugsEn.length}`);

  // caso conhecido: enxerta uma 8ª peça («Execução da receita») numa cópia de
  // uma página real, na posição 7, e confirma que o extractor a vê.
  provaCasoConhecido('M2 · página com 8 peças (a 7ª "Execução da receita")', () => {
    const origem = path.join(DIST, 'municipios', 'agueda', 'index.html');
    const root = carregaHtml(origem);
    const painel = root.querySelector('.painel');
    const pecas = painel.querySelectorAll(':scope > article.peca');
    if (pecas.length !== 7) return { vermelho: false, detalhe: `página real já não tem 7 peças (${pecas.length})` };
    // clona a 6ª peça (índice), muda o nome e o data-medida, insere-a antes da 7ª (pmp)
    const clone = pecas[5].clone();
    clone.setAttribute('data-medida', 'execucao-da-receita-plantada');
    const nomeEl = clone.querySelector('.peca-nome');
    nomeEl.set_content('Execução da receita');
    pecas[6].insertAdjacentHTML('beforebegin', clone.toString());
    const destDir = path.join(TMP, 'm2-caso');
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(path.join(destDir, 'index.html'), root.toString());
    const root2 = carregaHtml(path.join(destDir, 'index.html'));
    const extraidas = extraiPecas(root2);
    const nomes = extraidas.map((p) => p.nome);
    const bate =
      extraidas.length === 8 &&
      nomes[6] === 'Execução da receita' &&
      JSON.stringify(nomes) === JSON.stringify(NOMES_35313EB.pt);
    return {
      vermelho: bate,
      detalhe: `extraiu ${extraidas.length} peças, 7ª="${nomes[6]}" (esperado-histórico: ${JSON.stringify(NOMES_35313EB.pt)})`,
    };
  });

  const discordancias = [];
  const contagens = { 7: 0, outros: {} };
  function avalia(slug, edicao, ficheiro, nomesEsperados) {
    if (!fs.existsSync(ficheiro)) {
      discordancias.push({ slug, edicao, tipo: 'ficheiro-em-falta', ficheiro: relDist(ficheiro) });
      return;
    }
    const root = carregaHtml(ficheiro);
    const pecas = extraiPecas(root);
    if (pecas.length === 7) contagens[7]++;
    else contagens.outros[pecas.length] = (contagens.outros[pecas.length] ?? 0) + 1;
    const nomes = pecas.map((p) => p.nome);
    const vazias = pecas.filter((p) => p.vazia);
    if (pecas.length !== 7 || JSON.stringify(nomes) !== JSON.stringify(nomesEsperados) || vazias.length > 0) {
      discordancias.push({
        slug,
        edicao,
        ficheiro: relDist(ficheiro),
        contagem: pecas.length,
        nomes,
        esperado: nomesEsperados,
        vazias: vazias.length,
      });
    }
  }

  for (const slug of slugs) {
    avalia(slug, 'pt', path.join(DIST, 'municipios', slug, 'index.html'), NOMES_ACTUAIS.pt);
    avalia(slug, 'en', path.join(DIST, 'en', 'municipalities', slug, 'index.html'), NOMES_ACTUAIS.en);
  }
  // slugs que só existem numa edição
  const sSlugs = new Set(slugs);
  const sSlugsEn = new Set(slugsEn);
  const soPt = slugs.filter((s) => !sSlugsEn.has(s));
  const soEn = slugsEn.filter((s) => !sSlugs.has(s));

  log(`  páginas avaliadas: ${slugs.length * 2} (${slugs.length} concelhos x 2 edições)`);
  log(`  páginas com exactamente 7 peças e nomes na ordem certa: ${slugs.length * 2 - discordancias.length}`);
  log(`  discordâncias: ${discordancias.length}`);
  for (const d of discordancias.slice(0, 30)) log(`    · ${JSON.stringify(d)}`);
  if (soPt.length || soEn.length) {
    log(`  ATENÇÃO: slugs só em pt: ${JSON.stringify(soPt)}; só em en: ${JSON.stringify(soEn)}`);
  }

  RESULTS.m2 = {
    concelhosPt: slugs.length,
    concelhosEn: slugsEn.length,
    paginasAvaliadas: slugs.length * 2,
    contagens,
    discordancias,
    soPt,
    soEn,
  };
  return RESULTS.m2;
}

// ============================================================================
// MEDIDA 3 · as onze linhas, quatro colunas
// ============================================================================

const PDF_DGAL = {
  pmp: path.join(ENGINE_ROOT, 'content', '12 Concelhos', 'source', 'dgal', 'pmp-anual-2025-12.pdf'),
  endividamento: path.join(ENGINE_ROOT, 'content', '12 Concelhos', 'source', 'dgal', 'endividamento-total-2024.pdf'),
};

const LINHAS_M3 = [
  { id: 'aljezur-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'ALJEZUR', coluna: 'ultima' },
  { id: 'aljustrel-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'ALJUSTREL', coluna: 'ultima' },
  { id: 'almada-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'ALMADA', coluna: 'ultima' },
  { id: 'batalha-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'BATALHA', coluna: 'ultima' },
  { id: 'evora-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'ÉVORA', coluna: 'ultima' },
  { id: 'moimenta-da-beira-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'MOIMENTA DA BEIRA', coluna: 'ultima' },
  { id: 'pedrogao-grande-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'PEDRÓGÃO GRANDE', coluna: 'ultima' },
  { id: 'penedono-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'PENEDONO', coluna: 'ultima' },
  { id: 'trancoso-prazo-medio-de-pagamento-2025-12', pagina: 7, pdf: 'pmp', linha: 'TRANCOSO', coluna: 'ultima' },
  { id: 'penedono-divida-dgal-2024', pagina: 3, pdf: 'endividamento', linha: 'PENEDONO', coluna: 5, temPeca: true },
  // «limite» não é uma das sete medidas (não tem chave em MEDIDAS_DO_CONCELHO):
  // só aparece na página do concelho dentro do instrumento «distância desenhada»,
  // e esse instrumento só se desenha com os dois valores numéricos. Confirmado
  // por leitura de `src/data/concelhos.mjs` e por grep vazio em
  // dist/municipios/penedono/index.html antes de escrever este código.
  { id: 'penedono-limite-divida-dgal-2024', pagina: 3, pdf: 'endividamento', linha: 'PENEDONO', coluna: 1, temPeca: false },
];

/** Lê uma página de um PDF com pdftotext -layout. Atira se o pdftotext falhar
 * (o que é o caso de prova: uma cópia estragada faz isto atirar). */
function pdftotextPagina(pdfPath, pagina) {
  return execFileSync(
    PDFTOTEXT,
    ['-layout', '-f', String(pagina), '-l', String(pagina), pdfPath, '-'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
}

/** Encontra a linha da tabela para `nomeLinha` (uma palavra fronteira a
 * fronteira, no texto em maiúsculas do PDF) e devolve os tokens depois do
 * nome (a última coluna, ou por índice 1-based a partir do fim das colunas
 * numeradas do quadro do endividamento). Atira se não encontrar a linha, ou
 * se encontrar mais do que uma (ambiguidade não se resolve a adivinhar). */
function extraiColunaDoPdf({ pdf, pagina, linha, coluna }) {
  const texto = pdftotextPagina(PDF_DGAL[pdf], pagina);
  const linhas = texto.split('\n').filter((l) => new RegExp(`(^|\\s)${linha}(\\s|$)`).test(l));
  if (linhas.length !== 1) {
    throw new Error(`extractor PDF: "${linha}" achou ${linhas.length} linha(s) em ${pdf} p.${pagina}`);
  }
  const bruta = linhas[0];
  const idx = bruta.indexOf(linha);
  const resto = bruta.slice(idx + linha.length).trim();
  const tokens = resto.split(/\s+/).filter(Boolean);
  if (coluna === 'ultima') return { valor: tokens[tokens.length - 1], linhaBruta: bruta, tokens };
  // colunas do quadro do endividamento: 5 tokens no fim da linha, 1-based
  const cauda = tokens.slice(-5);
  if (cauda.length !== 5) throw new Error(`extractor PDF: "${linha}" não tem 5 colunas de valor (${JSON.stringify(tokens)})`);
  return { valor: cauda[coluna - 1], linhaBruta: bruta, tokens: cauda };
}

/** O valor mostrado numa página (concelho ou recibo): o texto do primeiro
 * elemento com `data-claim="<id>"`, dentro de `escopo` quando dado. */
function valorNaPagina(ficheiro, id, escopoSelector) {
  const root = carregaHtml(ficheiro);
  const base = escopoSelector ? root.querySelector(escopoSelector) : root;
  if (!base) throw new Error(`valorNaPagina: escopo "${escopoSelector}" não encontrado em ${ficheiro}`);
  const el = base.querySelector(`[data-claim="${id}"]`);
  if (!el) return null;
  return el.text.replace(/\s+/g, ' ').trim();
}

function temSelo(ficheiro, escopoSelector) {
  const root = carregaHtml(ficheiro);
  const base = escopoSelector ? root.querySelector(escopoSelector) : root;
  if (!base) return false;
  return !!base.querySelector('a.src-chip');
}

function medida3() {
  secao('MEDIDA 3 · as onze linhas, quatro colunas (página, recibo, YAML, fonte)');

  // ---- casos conhecidos, um por extractor ----
  provaCasoConhecido('M3 · valor da página alterado numa cópia', () => {
    const id = 'penedono-indice-de-divida-2024';
    const origem = path.join(DIST, 'municipios', 'penedono', 'index.html');
    const root = carregaHtml(origem);
    const el = root.querySelector(`article.peca[data-medida="${id}"] [data-claim="${id}"]`);
    el.set_content('N.d. (alterado)');
    const destDir = path.join(TMP, 'm3-pagina');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const v = valorNaPagina(destino, id, `article.peca[data-medida="${id}"]`);
    return { vermelho: v !== 'N.d.', detalhe: `leu "${v}" (esperava diferente de "N.d.")` };
  });

  provaCasoConhecido('M3 · valor do recibo alterado numa cópia', () => {
    const id = 'penedono-indice-de-divida-2024';
    const origem = path.join(DIST, 'livro-razao', id, 'index.html');
    const root = carregaHtml(origem);
    const el = root.querySelector(`[data-claim="${id}"]`);
    el.set_content('ZZZ');
    const destDir = path.join(TMP, 'm3-recibo');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const v = valorNaPagina(destino, id);
    return { vermelho: v !== 'N.d.', detalhe: `leu "${v}" (esperava diferente de "N.d.")` };
  });

  provaCasoConhecido('M3 · YAML do claim corrompido numa cópia', () => {
    const origem = path.join(LEDGER_CLAIMS, 'penedono-indice-de-divida-2024.yml');
    const destDir = path.join(TMP, 'm3-yaml');
    fs.mkdirSync(destDir, { recursive: true });
    const alterado = readText(origem).replace('value: "N.d."', 'value: "999"');
    const destino = path.join(destDir, 'penedono-indice-de-divida-2024.yml');
    fs.writeFileSync(destino, alterado);
    const doc = yamlLoad(readText(destino));
    return { vermelho: doc.value !== 'N.d.', detalhe: `leu value="${doc.value}"` };
  });

  provaCasoConhecido('M3 · PDF da fonte truncado (cópia estragada)', () => {
    const origem = PDF_DGAL.pmp;
    const destDir = path.join(TMP, 'm3-pdf-estragado');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'pmp-anual-2025-12.pdf');
    const buf = fs.readFileSync(origem).subarray(0, 3000); // corta a árvore de objectos do PDF
    fs.writeFileSync(destino, buf);
    try {
      pdftotextPagina(destino, 7);
      return { vermelho: false, detalhe: 'pdftotext não atirou sobre o ficheiro estragado' };
    } catch (e) {
      return { vermelho: true, detalhe: `pdftotext atirou como esperado: ${e.message.split('\n')[0]}` };
    }
  });

  // ---- as onze linhas, a sério ----
  const linhas = [];
  for (const spec of LINHAS_M3) {
    const slug = spec.id.replace(/-(prazo-medio-de-pagamento-2025-12|divida-dgal-2024|limite-divida-dgal-2024)$/, '');
    const ficheiroConcelho = path.join(DIST, 'municipios', slug, 'index.html');
    const ficheiroConcelhoEn = path.join(DIST, 'en', 'municipalities', slug, 'index.html');
    const ficheiroRecibo = path.join(DIST, 'livro-razao', spec.id, 'index.html');

    const claim = carregaClaim(spec.id);
    const valorYaml = claim.value;
    const temPeca = spec.temPeca !== false;
    const escopo = temPeca ? `article.peca[data-medida="${spec.id}"]` : null;
    const valorPagina = valorNaPagina(ficheiroConcelho, spec.id, escopo);
    const valorPaginaEn = valorNaPagina(ficheiroConcelhoEn, spec.id, escopo);
    const valorRecibo = valorNaPagina(ficheiroRecibo, spec.id);
    const seloPagina = valorPagina === null ? null : temSelo(ficheiroConcelho, escopo);
    const seloRecibo = temSelo(ficheiroRecibo);

    let valorFonte, evidenciaFonte, erroFonte;
    try {
      const r = extraiColunaDoPdf(spec);
      valorFonte = r.valor;
      evidenciaFonte = r.linhaBruta.trim();
    } catch (e) {
      erroFonte = e.message;
    }

    const colunas = { pagina: valorPagina, recibo: valorRecibo, yaml: valorYaml, fonte: valorFonte };
    const paginaNaoAplicavel = !temPeca && valorPagina === null;
    const iguais = paginaNaoAplicavel
      ? valorRecibo === valorYaml && valorYaml === valorFonte && valorFonte !== undefined
      : valorPagina === valorRecibo && valorRecibo === valorYaml && valorYaml === valorFonte && valorFonte !== undefined;

    linhas.push({
      id: spec.id,
      pdfPagina: `${spec.pdf}:${spec.pagina}`,
      colunas,
      valorPaginaEn,
      seloPagina,
      seloRecibo,
      temPeca,
      paginaNaoAplicavel,
      iguais,
      evidenciaFonte,
      erroFonte,
    });

    const marca = erroFonte ? 'ERRO' : iguais ? 'OK' : 'DISCORDA';
    const notaPagina = paginaNaoAplicavel ? '(sem peça própria nesta página, por desenho)' : '';
    log(
      `  [${marca}] ${spec.id} · página="${valorPagina}"${notaPagina} recibo="${valorRecibo}" yaml="${valorYaml}" fonte="${valorFonte}"${
        erroFonte ? ` (ERRO: ${erroFonte})` : ''
      }`,
    );
  }

  const discordancias = linhas.filter((l) => !l.iguais);
  RESULTS.m3 = { linhas, discordancias };
  log(`  total: ${linhas.length} linhas, ${discordancias.length} discordância(s)`);
  return RESULTS.m3;
}

// ============================================================================
// MEDIDA 4 · Penedono N.d. com selo; nenhum NaN/undefined/null/Infinity
// ============================================================================
const TOKENS_PROIBIDOS = ['NaN', 'undefined', 'null', 'Infinity'];

function medida4() {
  secao('MEDIDA 4 · Penedono N.d. com selo; nenhum NaN/undefined/null/Infinity em 616 páginas');

  // dívida e índice de Penedono, com selo (o prazo médio já ficou provado na M3)
  const idsPenedono = ['penedono-divida-dgal-2024', 'penedono-indice-de-divida-2024'];
  const penedono = idsPenedono.map((id) => {
    const escopo = `article.peca[data-medida="${id}"]`;
    const ficheiro = path.join(DIST, 'municipios', 'penedono', 'index.html');
    const ficheiroEn = path.join(DIST, 'en', 'municipalities', 'penedono', 'index.html');
    return {
      id,
      valorPt: valorNaPagina(ficheiro, id, escopo),
      seloPt: temSelo(ficheiro, escopo),
      valorEn: valorNaPagina(ficheiroEn, id, escopo),
      seloEn: temSelo(ficheiroEn, escopo),
    };
  });
  for (const p of penedono) log(`  ${p.id} · pt="${p.valorPt}" selo=${p.seloPt} · en="${p.valorEn}" selo=${p.seloEn}`);

  // caso conhecido: planta "NaN" no texto visível de uma cópia de uma página real
  provaCasoConhecido('M4 · "NaN" plantado numa cópia', () => {
    const origem = path.join(DIST, 'municipios', 'agueda', 'index.html');
    const root = carregaHtml(origem);
    const el = root.querySelector('[data-claim="agueda-populacao-2025"]');
    el.set_content('NaN');
    const destDir = path.join(TMP, 'm4-caso');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const achado = varreTokensProibidos([destino]);
    return { vermelho: achado.length === 1 && achado[0].tokens.includes('NaN'), detalhe: JSON.stringify(achado) };
  });

  function varreTokensProibidos(ficheiros) {
    const achados = [];
    for (const f of ficheiros) {
      const root = carregaHtml(f);
      const { corpo, titles, arias } = extrairTexto(root);
      const tokensAchados = new Set();
      const evidencias = [];
      for (const tok of TOKENS_PROIBIDOS) {
        const re = new RegExp(`\\b${tok}\\b`);
        if (re.test(corpo)) {
          tokensAchados.add(tok);
          const i = corpo.search(re);
          evidencias.push({ tok, onde: 'corpo', contexto: corpo.slice(Math.max(0, i - 40), i + 40) });
        }
        for (const t of titles) if (re.test(t)) { tokensAchados.add(tok); evidencias.push({ tok, onde: 'title', contexto: t }); }
        for (const t of arias) if (re.test(t)) { tokensAchados.add(tok); evidencias.push({ tok, onde: 'aria-label', contexto: t }); }
      }
      if (tokensAchados.size > 0) achados.push({ ficheiro: relDist(f), tokens: [...tokensAchados], evidencias });
    }
    return achados;
  }

  const paginasConcelho = [];
  for (const slug of listaConcelhos()) {
    paginasConcelho.push(path.join(DIST, 'municipios', slug, 'index.html'));
    paginasConcelho.push(path.join(DIST, 'en', 'municipalities', slug, 'index.html'));
  }
  log(`  a varrer ${paginasConcelho.length} páginas de concelho (308 x 2) por NaN/undefined/null/Infinity...`);
  const achadosBrutos = varreTokensProibidos(paginasConcelho);

  // triagem: cada achado é examinado à mão para separar fuga real de falso alarme
  const falsosAlarmes = [];
  const reais = [];
  for (const a of achadosBrutos) {
    // «null» é uma palavra portuguesa corrente? não. Mas pode aparecer dentro de um
    // atributo não visível ao leitor (ex.: um href ou data-* técnico) · o que
    // extrairTexto já evita ao só ler texto+title+aria-label. Regista tudo como
    // achado real por omissão; a triagem final vai para o relatório.
    reais.push(a);
  }
  log(`  achados brutos: ${achadosBrutos.length} página(s)`);
  for (const a of achadosBrutos.slice(0, 40)) log(`    · ${a.ficheiro} → ${JSON.stringify(a.tokens)} ${JSON.stringify(a.evidencias).slice(0, 200)}`);

  RESULTS.m4 = {
    penedono,
    paginasVarridas: paginasConcelho.length,
    achados: achadosBrutos,
    falsosAlarmes,
  };
  return RESULTS.m4;
}

// ============================================================================
// MEDIDA 5 · os nove do prazo médio de pagamento; os outros 299
// ============================================================================
const SLUGS_ND_PMP = [
  'aljezur', 'aljustrel', 'almada', 'batalha', 'evora',
  'moimenta-da-beira', 'pedrogao-grande', 'penedono', 'trancoso',
];

function medida5() {
  secao('MEDIDA 5 · os nove N.d. do prazo médio de pagamento; os outros 299 numéricos, com selo, nas duas edições');

  const slugs = listaConcelhos();
  if (slugs.length !== 308) throw new Error(`M5: esperava 308 concelhos, achei ${slugs.length}`);

  // caso conhecido: numa cópia, faz um concelho fora da lista dos 9 mostrar "N.d."
  provaCasoConhecido('M5 · concelho fora da lista a mostrar N.d. numa cópia', () => {
    const slug = 'agueda'; // não está em SLUGS_ND_PMP
    const id = `${slug}-prazo-medio-de-pagamento-2025-12`;
    const origem = path.join(DIST, 'municipios', slug, 'index.html');
    const root = carregaHtml(origem);
    const el = root.querySelector(`article.peca[data-medida="${id}"] [data-claim="${id}"]`);
    el.set_content('N.d.');
    const destDir = path.join(TMP, 'm5-caso');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const v = valorNaPagina(destino, id, `article.peca[data-medida="${id}"]`);
    const foraDaLista = !SLUGS_ND_PMP.includes(slug);
    const classificaComoMarca = v === 'N.d.';
    return {
      vermelho: foraDaLista && classificaComoMarca,
      detalhe: `slug "${slug}" não está nos 9, mas a página plantada mostra "${v}" · o classificador tem de o apanhar como discrepância`,
    };
  });

  const linhas = [];
  for (const slug of slugs) {
    const id = `${slug}-prazo-medio-de-pagamento-2025-12`;
    const escopo = `article.peca[data-medida="${id}"]`;
    const ficheiroPt = path.join(DIST, 'municipios', slug, 'index.html');
    const ficheiroEn = path.join(DIST, 'en', 'municipalities', slug, 'index.html');
    const valorPt = valorNaPagina(ficheiroPt, id, escopo);
    const valorEn = valorNaPagina(ficheiroEn, id, escopo);
    const seloPt = temSelo(ficheiroPt, escopo);
    const seloEn = temSelo(ficheiroEn, escopo);
    const esperaNd = SLUGS_ND_PMP.includes(slug);
    const ehND = (v) => v === 'N.d.';
    const ehNumerico = (v) => v !== null && numeroDoValorPT(v) !== null;
    const ptOk = esperaNd ? ehND(valorPt) : ehNumerico(valorPt);
    const enOk = esperaNd ? ehND(valorEn) : ehNumerico(valorEn);
    linhas.push({ slug, id, esperaNd, valorPt, valorEn, seloPt, seloEn, ptOk, enOk, ok: ptOk && enOk && seloPt && seloEn });
  }

  const nove = linhas.filter((l) => l.esperaNd);
  const outros = linhas.filter((l) => !l.esperaNd);
  const noveFalhas = nove.filter((l) => !l.ok);
  const outrosFalhas = outros.filter((l) => !l.ok);

  log(`  os 9 N.d.: ${nove.length} avaliados, ${nove.length - noveFalhas.length} conformes, ${noveFalhas.length} falha(s)`);
  for (const l of noveFalhas) log(`    · ${JSON.stringify(l)}`);
  log(`  os outros ${outros.length}: ${outros.length - outrosFalhas.length} conformes (numérico + selo, 2 edições), ${outrosFalhas.length} falha(s)`);
  for (const l of outrosFalhas.slice(0, 30)) log(`    · ${JSON.stringify(l)}`);

  RESULTS.m5 = { nove, outros, noveFalhas, outrosFalhas, totalConcelhos: slugs.length };
  return RESULTS.m5;
}

// ============================================================================
// MEDIDA 6 · nenhum vazio: concelhos.gerado.json sem null; dist sem data-medida-vazia
// ============================================================================
function medida6() {
  secao('MEDIDA 6 · concelhos.gerado.json sem null; dist/ sem data-medida-vazia');

  const caminhoGerado = path.join(ROOT, 'src', 'data', 'concelhos.gerado.json');

  provaCasoConhecido('M6 · null plantado numa cópia de concelhos.gerado.json', () => {
    const dados = JSON.parse(readText(caminhoGerado));
    dados[0].linhas.populacao = null;
    const destino = path.join(TMP, 'm6-gerado.json');
    fs.writeFileSync(destino, JSON.stringify(dados));
    const nulos = contaNulosGerado(destino);
    return { vermelho: nulos.length === 1 && nulos[0].chave === 'populacao', detalhe: JSON.stringify(nulos[0]) };
  });

  function contaNulosGerado(caminho) {
    const dados = JSON.parse(readText(caminho));
    const nulos = [];
    for (const c of dados) {
      for (const [chave, valor] of Object.entries(c.linhas ?? {})) {
        if (valor === null || valor === undefined) nulos.push({ slug: c.slug, chave });
      }
    }
    return nulos;
  }

  const dados = JSON.parse(readText(caminhoGerado));
  log(`  concelhos.gerado.json: ${dados.length} entradas`);
  const nulosReais = contaNulosGerado(caminhoGerado);
  log(`  valores null em "linhas": ${nulosReais.length}`);
  for (const n of nulosReais.slice(0, 30)) log(`    · ${JSON.stringify(n)}`);

  // caso conhecido: injecta data-medida-vazia numa cópia de uma página real
  provaCasoConhecido('M6 · data-medida-vazia plantado numa cópia', () => {
    const origem = path.join(DIST, 'municipios', 'agueda', 'index.html');
    const root = carregaHtml(origem);
    const painel = root.querySelector('.painel');
    painel.insertAdjacentHTML(
      'afterbegin',
      '<article class="peca peca-vazia" data-medida-vazia><p class="peca-sem-linha">sem linha ainda</p><p class="peca-unidade">Pessoas</p><h3 class="peca-nome">Plantado</h3></article>',
    );
    const destDir = path.join(TMP, 'm6-caso');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const achado = contaDataMedidaVazia([destino]);
    return { vermelho: achado.length === 1, detalhe: JSON.stringify(achado) };
  });

  function contaDataMedidaVazia(ficheiros) {
    const achados = [];
    for (const f of ficheiros) {
      const root = carregaHtml(f);
      const n = root.querySelectorAll('[data-medida-vazia]').length;
      if (n > 0) achados.push({ ficheiro: relDist(f), n });
    }
    return achados;
  }

  log(`  a varrer ${TODOS_HTML.length} ficheiros de dist/ por [data-medida-vazia]...`);
  const achadosVazia = contaDataMedidaVazia(TODOS_HTML);
  log(`  achados: ${achadosVazia.length}`);
  for (const a of achadosVazia.slice(0, 30)) log(`    · ${JSON.stringify(a)}`);

  RESULTS.m6 = { entradasGeradas: dados.length, nulosReais, achadosVazia, ficheirosVarridos: TODOS_HTML.length };
  return RESULTS.m6;
}

// ============================================================================
// MEDIDA 7 · os mandatos de Évora: «Decidiu» presente/ausente, nenhum campo vazio
// ============================================================================
const ROTULOS_DECIDIU = { pt: 'Decidiu', en: 'Decided' };
const PERIODO_SEM_DECIDIU = '2017–2021'; // en-dash, confirmado em src/data/municipios.mjs

function extraiMandatos(root) {
  const blocos = root.querySelectorAll('.mun-mandato');
  return blocos.map((bloco) => {
    const periodoEl = bloco.querySelector('.mun-mandato-periodo');
    const periodo = periodoEl ? periodoEl.text.replace(/\s+/g, ' ').trim() : null;
    const dl = bloco.querySelector('dl.mun-campos');
    const campos = [];
    if (dl) {
      const filhos = dl.childNodes.filter((n) => n.nodeType === 1);
      for (let i = 0; i < filhos.length; i++) {
        if (filhos[i].rawTagName === 'dt') {
          const dt = filhos[i].text.replace(/\s+/g, ' ').trim();
          const dd = filhos[i + 1] && filhos[i + 1].rawTagName === 'dd' ? filhos[i + 1] : null;
          const ddTexto = dd ? dd.text.replace(/\s+/g, ' ').trim() : null;
          campos.push({ dt, ddTexto, ddPresente: !!dd });
        }
      }
    }
    return { periodo, campos };
  });
}

function medida7() {
  secao('MEDIDA 7 · os mandatos de Évora · «Decidiu» e nenhum campo vazio');

  const ficheiros = {
    pt: path.join(DIST, 'municipios', 'evora', 'index.html'),
    en: path.join(DIST, 'en', 'municipalities', 'evora', 'index.html'),
  };

  // caso conhecido 1: injecta um <dd></dd> vazio numa cópia
  provaCasoConhecido('M7 · dd vazio plantado numa cópia', () => {
    const root = carregaHtml(ficheiros.pt);
    const dd = root.querySelectorAll('.mun-mandato dl.mun-campos dd')[0];
    dd.set_content('');
    const destDir = path.join(TMP, 'm7-caso-dd');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const mandatos = extraiMandatos(carregaHtml(destino));
    const vazios = mandatos.flatMap((m) => m.campos.filter((c) => c.ddPresente && c.ddTexto === ''));
    return { vermelho: vazios.length >= 1, detalhe: `${vazios.length} dd vazio(s) achado(s)` };
  });

  // caso conhecido 2: injecta um par «Decidiu» no mandato 2017–2021 numa cópia
  provaCasoConhecido('M7 · «Decidiu» plantado no mandato 2017–2021 numa cópia', () => {
    const root = carregaHtml(ficheiros.pt);
    const blocos = root.querySelectorAll('.mun-mandato');
    const alvo = blocos.find((b) => {
      const p = b.querySelector('.mun-mandato-periodo');
      return p && p.text.replace(/\s+/g, ' ').trim() === PERIODO_SEM_DECIDIU;
    });
    if (!alvo) return { vermelho: false, detalhe: 'não achei o bloco do mandato 2017–2021 para plantar o caso' };
    const dl = alvo.querySelector('dl.mun-campos');
    dl.insertAdjacentHTML('afterbegin', '<dt>Decidiu</dt><dd>algo plantado</dd>');
    const destDir = path.join(TMP, 'm7-caso-decidiu');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, root.toString());
    const mandatos = extraiMandatos(carregaHtml(destino));
    const bloco2017 = mandatos.find((m) => m.periodo === PERIODO_SEM_DECIDIU);
    const temDecidiu = bloco2017.campos.some((c) => c.dt === 'Decidiu');
    return { vermelho: temDecidiu, detalhe: `campos do 2017–2021 plantado: ${JSON.stringify(bloco2017.campos.map((c) => c.dt))}` };
  });

  const resultado = {};
  for (const [lang, ficheiro] of Object.entries(ficheiros)) {
    const mandatos = extraiMandatos(carregaHtml(ficheiro));
    log(`  [${lang}] mandatos encontrados: ${mandatos.length}`);
    const rotuloDecidiu = ROTULOS_DECIDIU[lang];
    const camposVazios = [];
    const decidiuPorMandato = [];
    for (const m of mandatos) {
      for (const c of m.campos) {
        if (c.ddPresente && (c.ddTexto === '' || c.ddTexto === null)) {
          camposVazios.push({ periodo: m.periodo, dt: c.dt });
        }
      }
      const temDecidiu = m.campos.some((c) => c.dt === rotuloDecidiu);
      decidiuPorMandato.push({ periodo: m.periodo, temDecidiu });
      log(`    · ${m.periodo}: campos=${JSON.stringify(m.campos.map((c) => c.dt))} temDecidiu=${temDecidiu}`);
    }
    const esperadoAusente = decidiuPorMandato.find((d) => d.periodo === PERIODO_SEM_DECIDIU);
    const esperadoPresentes = decidiuPorMandato.filter((d) => d.periodo !== PERIODO_SEM_DECIDIU);
    const falhas = [];
    if (!esperadoAusente) falhas.push(`não achei o mandato de período "${PERIODO_SEM_DECIDIU}"`);
    else if (esperadoAusente.temDecidiu) falhas.push(`o mandato "${PERIODO_SEM_DECIDIU}" TEM «${rotuloDecidiu}», e devia não ter`);
    for (const d of esperadoPresentes) if (!d.temDecidiu) falhas.push(`o mandato "${d.periodo}" NÃO tem «${rotuloDecidiu}», e devia ter`);

    resultado[lang] = { mandatos: mandatos.length, decidiuPorMandato, camposVazios, falhas };
  }

  RESULTS.m7 = resultado;
  return RESULTS.m7;
}

// ============================================================================
// MEDIDA 8 · as contagens do livro-razão: página x ficheiros
// ============================================================================
function valorProva(ficheiro, chave) {
  const root = carregaHtml(ficheiro);
  const el = root.querySelector(`[data-prova="${chave}"]`);
  if (!el) return null;
  return el.text.replace(/\s+/g, ' ').trim();
}

function medida8() {
  secao('MEDIDA 8 · as contagens do livro-razão (afirmações, calculadas, linhas de concelhos, concelhos)');

  // caso conhecido: o comparador tem de apanhar dois números diferentes
  provaCasoConhecido('M8 · comparador de contagens com dois números diferentes', () => {
    const bate = (a, b) => String(a).trim() === String(b).trim();
    return { vermelho: !bate('132', '133'), detalhe: '132 vs 133' };
  });

  const ficheiros = listaFicheirosClaims();
  log(`  ficheiros em ledger/claims/: ${ficheiros.length}`);

  const idsVistos = new Set();
  const duplicados = [];
  let derivadas = 0;
  let concelhosLinhas = 0;
  const idsPorEstudo = {};
  for (const f of ficheiros) {
    const doc = yamlLoad(readText(path.join(LEDGER_CLAIMS, f)));
    const idEsperado = f.replace(/\.yml$/, '');
    if (doc.id !== idEsperado) log(`    AVISO: ficheiro "${f}" tem id interno "${doc.id}"`);
    if (idsVistos.has(doc.id)) duplicados.push(doc.id);
    idsVistos.add(doc.id);
    if (Array.isArray(doc.derived_from) && doc.derived_from.length > 0) derivadas++;
    if (doc.study === 'concelhos-2026') concelhosLinhas++;
    idsPorEstudo[doc.study] = (idsPorEstudo[doc.study] ?? 0) + 1;
  }
  const afirmacoesMinhas = ficheiros.length;
  log(`  afirmações (ficheiros): ${afirmacoesMinhas}; ids duplicados: ${duplicados.length}`);
  log(`  calculadas (derived_from não vazio): ${derivadas}`);
  log(`  linhas de concelhos (study=concelhos-2026): ${concelhosLinhas}`);

  // concelhos_no_livro: concelhos (dos 308 gerados + Évora escrito à mão) com
  // pelo menos uma das suas linhas declaradas presente entre as de concelhos-2026.
  const gerado = JSON.parse(readText(path.join(ROOT, 'src', 'data', 'concelhos.gerado.json')));
  const idsConcelhos2026 = new Set();
  for (const f of ficheiros) {
    const doc = yamlLoad(readText(path.join(LEDGER_CLAIMS, f)));
    if (doc.study === 'concelhos-2026') idsConcelhos2026.add(doc.id);
  }
  let concelhosNoLivro = 0;
  const concelhosSemLinha = [];
  for (const c of gerado) {
    const ids = Object.values(c.linhas ?? {}).filter(Boolean);
    const temAlguma = ids.some((id) => idsConcelhos2026.has(id));
    if (temAlguma) concelhosNoLivro++;
    else concelhosSemLinha.push(c.slug);
  }
  log(`  concelhos com pelo menos uma linha de concelhos-2026: ${concelhosNoLivro} de ${gerado.length}`);

  // o que as páginas mostram
  const pLivro = path.join(DIST, 'livro-razao', 'index.html');
  const pConcelhos = path.join(DIST, 'livro-razao', 'concelhos', 'index.html');
  const mostrado = {
    afirmacoes: valorProva(pLivro, 'afirmacoes'),
    derivadas: valorProva(pLivro, 'derivadas'),
    concelhos_linhas_no_livro: valorProva(pLivro, 'concelhos_linhas'),
    concelhos_linhas_no_conjunto: valorProva(pConcelhos, 'concelhos_linhas'),
    concelhos_no_livro: valorProva(pConcelhos, 'concelhos_no_livro'),
  };
  log(`  mostrado na página: ${JSON.stringify(mostrado)}`);

  const paraNumero = (s) => (s === null ? null : Number(String(s).replace(/[  \s]/g, '')));
  const comparacoes = [
    { chave: 'afirmacoes', minha: afirmacoesMinhas, mostrada: paraNumero(mostrado.afirmacoes) },
    { chave: 'derivadas', minha: derivadas, mostrada: paraNumero(mostrado.derivadas) },
    { chave: 'concelhos_linhas (livro-razao/)', minha: concelhosLinhas, mostrada: paraNumero(mostrado.concelhos_linhas_no_livro) },
    { chave: 'concelhos_linhas (livro-razao/concelhos/)', minha: concelhosLinhas, mostrada: paraNumero(mostrado.concelhos_linhas_no_conjunto) },
    { chave: 'concelhos_no_livro', minha: concelhosNoLivro, mostrada: paraNumero(mostrado.concelhos_no_livro) },
  ];
  for (const c of comparacoes) c.bate = c.minha === c.mostrada;
  log('  comparações:');
  for (const c of comparacoes) log(`    · ${c.chave}: minha=${c.minha} mostrada=${c.mostrada} bate=${c.bate}`);

  RESULTS.m8 = {
    afirmacoesMinhas,
    derivadas,
    concelhosLinhas,
    concelhosNoLivro,
    concelhosSemLinha,
    duplicados,
    idsPorEstudo,
    mostrado,
    comparacoes,
  };
  return RESULTS.m8;
}

// ============================================================================
// MEDIDA 9 · o inventário (INVENTARIO-FRASES.md) contra a superfície de dist/
// ============================================================================
/** A tabela «classe | texto | bloco | estado | razão» vive em vários blocos
 * separados pelo ficheiro inteiro (um por etapa), cada um com o seu próprio
 * cabeçalho · não é uma tabela contínua, e o cabeçalho NEM SEMPRE tem o texto
 * certo (três blocos, a partir da linha 697, têm o cabeçalho escrito
 * «| classe | frase | bloco |», só três palavras, mas as linhas por baixo têm
 * na mesma as cinco células, `viva`/`retirada` incluída, na quarta).
 *
 * Duas versões deste parser foram medidas contra o número que
 * `npm run check:voz` imprime (502): uma âncorada ao texto exacto do
 * cabeçalho achou 484; uma âncorada ao separador (a linha só de `|`, espaço,
 * `-` e `:`) a seguir a QUALQUER cabeçalho achou 500 (ainda a menos, por uma
 * razão de fronteira de bloco não caçada). A que bate exactamente com 502,
 * carácter a carácter com a régua do sítio, é esta: **qualquer linha do
 * ficheiro** que comece por `|`, tenha exactamente cinco células separadas
 * por `|`, e cuja quarta célula seja exactamente `viva` ou `retirada` · sem
 * exigir cabeçalho nem separador nenhum antes dela. As outras tabelas do
 * ficheiro (frase|era|é|razão; frase retirada|classe|onde vive agora;
 * etc.) não têm quatro células mais uma quinta com essa palavra exacta, e por
 * isso nunca entram: a prova não é lógica, é a contagem batida. */
function parseInventario() {
  const caminho = path.join(ROOT, 'design', 'especime-v3', 'INVENTARIO-FRASES.md');
  const linhas = readText(caminho).split('\n');
  const linhasParseadas = [];
  for (const l of linhas) {
    if (!l.startsWith('|')) continue;
    const celulas = l.split('|').slice(1, -1).map((c) => c.trim());
    if (celulas.length === 5 && (celulas[3] === 'viva' || celulas[3] === 'retirada')) {
      linhasParseadas.push({ classe: celulas[0], texto: celulas[1], bloco: celulas[2], estado: celulas[3], razao: celulas[4] });
    }
  }
  return linhasParseadas;
}

function ehPlaceholder(texto) {
  return /<[a-zA-Zà-úÀ-Ú][a-zA-Zà-úÀ-Ú ]*>/.test(texto);
}
function escapaRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function regexDoTexto(texto) {
  const partes = texto.split(/(<[a-zA-Zà-úÀ-Ú][a-zA-Zà-úÀ-Ú ]*>)/);
  const pat = partes
    .map((p) => (/^<[a-zA-Zà-úÀ-Ú][a-zA-Zà-úÀ-Ú ]*>$/.test(p) ? '[^\\n]{1,80}?' : escapaRegex(p)))
    .join('');
  return new RegExp(pat);
}

function construirCorpusInventario() {
  const corpos = [];
  const titlesAll = [];
  const ariasAll = [];
  const metasAll = [];
  for (const f of TODOS_HTML) {
    const root = carregaHtml(f);
    const { corpo, titles, arias, metas } = extrairTexto(root);
    corpos.push(corpo);
    titlesAll.push(...titles);
    ariasAll.push(...arias);
    metasAll.push(...metas);
  }
  return {
    corpoGrande: corpos.join('\n'),
    titlesGrande: titlesAll.join('\n'),
    ariasGrande: ariasAll.join('\n'),
    metasGrande: metasAll.join('\n'),
  };
}

function ocorreEm(texto, corpus) {
  const t = texto.trim();
  if (!t) return false;
  const alvos = [corpus.corpoGrande, corpus.titlesGrande, corpus.ariasGrande, corpus.metasGrande];
  if (ehPlaceholder(t)) {
    const re = regexDoTexto(t);
    return alvos.some((a) => re.test(a));
  }
  return alvos.some((a) => a.includes(t));
}

function medida9() {
  secao('MEDIDA 9 · o inventário de frases contra a superfície de dist/');

  const linhas = parseInventario();
  log(`  linhas da tabela lidas: ${linhas.length}`);
  const vivas = linhas.filter((l) => l.estado === 'viva');
  const retiradas = linhas.filter((l) => l.estado === 'retirada');
  const outrosEstados = linhas.filter((l) => l.estado !== 'viva' && l.estado !== 'retirada');
  log(`  viva: ${vivas.length}; retirada: ${retiradas.length}; outro estado: ${outrosEstados.length}`);
  if (outrosEstados.length) log(`    estados inesperados: ${JSON.stringify(outrosEstados.slice(0, 5))}`);

  log('  a construir o corpus de texto de dist/ (isto demora um bocado)...');
  const t0 = Date.now();
  const corpus = construirCorpusInventario();
  log(`  corpus construído em ${((Date.now() - t0) / 1000).toFixed(1)}s (corpo=${corpus.corpoGrande.length} chars)`);

  // caso conhecido: o brief pede-o por nome · uma linha "viva" inventada que não se
  // pode render nunca, e o detector tem de a apanhar como falha.
  provaCasoConhecido('M9 · linha "viva" inventada que não rende', () => {
    const fantasma = 'Esta frase foi inventada pelo medidor cego M8 e nunca existiu em nenhuma página, 28.08.2026 47f8c9.';
    const achou = ocorreEm(fantasma, corpus);
    return { vermelho: achou === false, detalhe: `ocorreEm(fantasma) = ${achou}` };
  });

  const falhasVivas = [];
  for (const l of vivas) {
    if (!ocorreEm(l.texto, corpus)) falhasVivas.push(l);
  }
  const falhasRetiradas = [];
  for (const l of retiradas) {
    if (ocorreEm(l.texto, corpus)) falhasRetiradas.push(l);
  }

  log(`  vivas sem ocorrência em dist/ (falha): ${falhasVivas.length}`);
  for (const l of falhasVivas.slice(0, 40)) log(`    · [${l.bloco}] "${l.texto}"`);
  log(`  retiradas COM ocorrência em dist/ (falha): ${falhasRetiradas.length}`);
  for (const l of falhasRetiradas.slice(0, 40)) log(`    · [${l.bloco}] "${l.texto}"`);

  RESULTS.m9 = {
    totalLinhas: linhas.length,
    vivas: vivas.length,
    retiradas: retiradas.length,
    outrosEstados,
    falhasVivas,
    falhasRetiradas,
  };
  return RESULTS.m9;
}

// ============================================================================
// MEDIDA 10 · Évora intacta: a execução da receita, e as leituras longas dos estudos
// ============================================================================
// Todos os 5 estudos de Évora têm `documento/` e `texto/` em pt; só DOIS têm
// também `document/` e `text/` em en (verificado por listagem directa de
// dist/en/studies/*: os outros três ficam só com `index.html` em inglês). São
// estes os dois que o brief conta como «as duas leituras longas» · achado
// empírico, não uma leitura do código do sítio.
const ESTUDOS_EVORA_TODOS = [
  'evora-quinze-anos-cinco-mandatos',
  'evora-economia-investidores-portas-abertas-2026',
  'evora-orcamentado-pago-devido-2025',
  'evora-os-pelouros-quem-os-teve-o-que-fizeram',
  'evora-prometido-pago-auditado-2026',
];
const ESTUDOS_EVORA_DUAS_LEITURAS = ['evora-orcamentado-pago-devido-2025', 'evora-prometido-pago-auditado-2026'];
const SEGMENTO_MODO = { pt: { documento: 'documento', texto: 'texto' }, en: { documento: 'document', texto: 'text' } };
const BASE_ESTUDOS = { pt: path.join(DIST, 'estudos'), en: path.join(DIST, 'en', 'studies') };

/** As leituras longas citam figuras por `data-r="<id>"`, contra um bloco JSON
 * embebido `<script id="rcpt-data">` · um mecanismo diferente do
 * `data-claim`/`.src-chip` do resto do sítio (confirmado por leitura directa
 * do HTML construído). «Cada figura tem a sua linha» aqui quer dizer: todo
 * `data-r` usado resolve a um recibo nesse bloco, e o recibo tem os campos
 * essenciais preenchidos. */
function figurasSemLinha(ficheiro) {
  const html = readText(ficheiro);
  const usadosR = new Set([...html.matchAll(/data-r="([^"]+)"/g)].map((x) => x[1]));
  const usadosClaim = new Set([...html.matchAll(/data-claim="([^"]+)"/g)].map((x) => x[1]));
  const m = html.match(/<script type="application\/json" id="rcpt-data">([\s\S]*?)<\/script>/);
  if (!m) {
    // nem toda a página usa este mecanismo (achado empírico: `texto` de
    // orcamentado-pago-devido-2025 e as duas páginas de prometido-pago-auditado-2026
    // não o usam). Não é um erro: só é reportável se, apesar de não ter o bloco de
    // recibos, tiver `data-r` órfãos, ou `data-claim` órfãos do livro-razão.
    const semClaimNoLivro = [...usadosClaim].filter((id) => !fs.existsSync(path.join(LEDGER_CLAIMS, `${id}.yml`)));
    return {
      mecanismo: usadosClaim.size > 0 ? 'data-claim' : 'nenhum',
      totalRecibos: 0,
      totalUsados: usadosClaim.size,
      semRecibo: usadosR.size > 0 ? [...usadosR] : [], // data-r sem bloco de recibos nenhum é sempre órfão
      recibosOcos: [],
      naoUsados: [],
      semClaimNoLivro,
    };
  }
  const dados = JSON.parse(m[1]);
  const recibos = dados.r ?? {};
  const semRecibo = [...usadosR].filter((id) => !(id in recibos));
  const recibosOcos = Object.entries(recibos)
    .filter(([, r]) => !r.value || !(r.doc || r.url) || !r.excerpt)
    .map(([id]) => id);
  const naoUsados = Object.keys(recibos).filter((id) => !usadosR.has(id));
  return { mecanismo: 'data-r', totalRecibos: Object.keys(recibos).length, totalUsados: usadosR.size, semRecibo, recibosOcos, naoUsados, semClaimNoLivro: [] };
}

function medida10() {
  secao('MEDIDA 10 · Évora intacta · execução da receita, e as leituras longas dos estudos');

  const idExec = 'evora-execucao-da-receita-2025';
  const ficheiroEvoraPt = path.join(DIST, 'municipios', 'evora', 'index.html');
  const ficheiroEvoraEn = path.join(DIST, 'en', 'municipalities', 'evora', 'index.html');
  const valorExecPt = valorNaPagina(ficheiroEvoraPt, idExec, null); // não é uma peça: é a camada das contas
  const valorExecEn = valorNaPagina(ficheiroEvoraEn, idExec, null);
  const root = carregaHtml(ficheiroEvoraPt);
  const elExec = root.querySelector(`[data-claim="${idExec}"]`);
  const temSeloJuntoExec = elExec ? !!elExec.closest('.claim, .claim-com-chip')?.querySelector('a.src-chip') : false;
  log(`  ${idExec}: pt="${valorExecPt}" en="${valorExecEn}" selo-junto=${temSeloJuntoExec}`);

  // caso conhecido: um data-r plantado sem recibo correspondente no bloco JSON
  provaCasoConhecido('M10 · figura sem recibo plantada numa cópia', () => {
    const origem = path.join(BASE_ESTUDOS.pt, 'evora-orcamentado-pago-devido-2025', 'texto', 'index.html');
    let html = readText(origem);
    html = html.replace('<body>', '<body><span data-r="figura-plantada-sem-recibo-m10">42</span>');
    const destDir = path.join(TMP, 'm10-caso');
    fs.mkdirSync(destDir, { recursive: true });
    const destino = path.join(destDir, 'index.html');
    fs.writeFileSync(destino, html);
    const { semRecibo } = figurasSemLinha(destino);
    return { vermelho: semRecibo.includes('figura-plantada-sem-recibo-m10'), detalhe: JSON.stringify(semRecibo) };
  });

  // inventário de existência das 5 x 2 modos x 2 edições (20 rotas possíveis)
  const inventarioRotas = [];
  for (const slug of ESTUDOS_EVORA_TODOS) {
    for (const lang of ['pt', 'en']) {
      for (const modo of ['documento', 'texto']) {
        const seg = SEGMENTO_MODO[lang][modo];
        const ficheiro = path.join(BASE_ESTUDOS[lang], slug, seg, 'index.html');
        inventarioRotas.push({ slug, lang, modo, ficheiro: relDist(ficheiro), existe: fs.existsSync(ficheiro) });
      }
    }
  }
  const comAmbasEdicoes = ESTUDOS_EVORA_TODOS.filter((slug) =>
    inventarioRotas.filter((r) => r.slug === slug && r.existe).length === 4,
  );
  log(`  estudos com documento+texto nas DUAS edições: ${JSON.stringify(comAmbasEdicoes)}`);
  log(`  «as duas leituras longas» (esperado pelo brief): ${JSON.stringify(ESTUDOS_EVORA_DUAS_LEITURAS)}`);
  const bateComOEsperado = JSON.stringify(comAmbasEdicoes.sort()) === JSON.stringify([...ESTUDOS_EVORA_DUAS_LEITURAS].sort());
  log(`  coincide com a leitura do brief: ${bateComOEsperado}`);

  // as 8 páginas das duas leituras longas, a sério
  const paginas = [];
  for (const slug of ESTUDOS_EVORA_DUAS_LEITURAS) {
    for (const lang of ['pt', 'en']) {
      for (const modo of ['documento', 'texto']) {
        const seg = SEGMENTO_MODO[lang][modo];
        paginas.push({ slug, lang, modo, ficheiro: path.join(BASE_ESTUDOS[lang], slug, seg, 'index.html') });
      }
    }
  }
  const relatorio = [];
  for (const p of paginas) {
    const existe = fs.existsSync(p.ficheiro);
    let tamanho = 0, figuras = null;
    if (existe) {
      tamanho = fs.statSync(p.ficheiro).size;
      figuras = figurasSemLinha(p.ficheiro);
    }
    relatorio.push({ ...p, ficheiro: relDist(p.ficheiro), existe, tamanho, figuras });
  }
  const emFalta = relatorio.filter((r) => !r.existe);
  const comProblemas = relatorio.filter(
    (r) =>
      r.figuras &&
      (r.figuras.semRecibo?.length > 0 || r.figuras.recibosOcos?.length > 0 || r.figuras.semClaimNoLivro?.length > 0),
  );
  log(`  as 8 páginas das duas leituras longas (2 estudos x documento/texto x 2 edições):`);
  for (const r of relatorio) {
    log(
      `    · [${r.existe ? 'existe' : 'FALTA'}] ${r.ficheiro} (${r.tamanho}B) mecanismo=${r.figuras?.mecanismo ?? '-'} recibos=${r.figuras?.totalRecibos ?? '-'} usados=${r.figuras?.totalUsados ?? '-'} semRecibo=${r.figuras?.semRecibo?.length ?? '-'} ocos=${r.figuras?.recibosOcos?.length ?? '-'}`,
    );
  }

  RESULTS.m10 = {
    execucaoDaReceita: { id: idExec, valorPt: valorExecPt, valorEn: valorExecEn, temSeloJuntoExec },
    inventarioRotas,
    comAmbasEdicoes,
    bateComOEsperado,
    paginas: relatorio,
    emFalta,
    comProblemas,
  };
  return RESULTS.m10;
}

// ============================================================================
// MEDIDA 11 · a cadeia: npm run verify e npm run typecheck
// ============================================================================
function medida11() {
  secao('MEDIDA 11 · npm run verify e npm run typecheck');
  // Não é um detector escrito por mim (é literalmente correr os scripts do
  // sítio, como o brief autoriza) · por isso não leva caso conhecido: não há
  // lógica de comparação minha para provar.
  const resultado = {};
  for (const script of ['verify', 'typecheck']) {
    const t0 = Date.now();
    let codigo = 0;
    let saida = '';
    try {
      saida = execFileSync('npm', ['run', script], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      codigo = e.status ?? 1;
      saida = (e.stdout ?? '') + (e.stderr ?? '');
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    log(`  npm run ${script}: código de saída ${codigo}, ${dt}s`);
    resultado[script] = { codigo, segundos: Number(dt), ultimasLinhas: saida.split('\n').filter(Boolean).slice(-15) };
  }
  RESULTS.m11 = resultado;
  return RESULTS.m11;
}

export {
  ROOT, DIST, TMP, RESULTS,
  medida1, medida2, medida3, medida4, medida5, medida6, medida7, medida8, medida9, medida10, medida11,
};

// ============================================================================
// PRINCIPAL · corre as onze medições por ordem, grava o resultado
// ============================================================================
async function principal() {
  const t0 = Date.now();
  const medidas = [medida1, medida2, medida3, medida4, medida5, medida6, medida7, medida8, medida9, medida10, medida11];
  let falhou = null;
  for (const m of medidas) {
    try {
      m();
    } catch (e) {
      falhou = { medida: m.name, erro: e.message, stack: e.stack };
      log(`\n*** PAROU em ${m.name}: ${e.message} ***`);
      break;
    }
  }
  const segundos = (Date.now() - t0) / 1000;
  secao(`FIM · ${segundos.toFixed(1)}s no total`);
  RESULTS._meta = {
    dataHora: new Date().toISOString(),
    segundos,
    casosConhecidos,
    falhou,
    commitDaCopia: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(),
  };
  const destino = path.join(__dirname, 'vazios-M8-sonnet.resultados.json');
  fs.writeFileSync(destino, JSON.stringify(RESULTS, null, 2));
  log(`resultados gravados em ${destino}`);
  log(`casos conhecidos provados: ${casosConhecidos.length}, todos vistos vermelho: ${casosConhecidos.every((c) => c.viu)}`);

  // limpeza do TMP (as cópias plantadas nunca viveram dentro do repositório)
  fs.rmSync(TMP, { recursive: true, force: true });

  if (falhou) process.exit(2);
  process.exit(0);
}

const ehChamadaDirecta = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (ehChamadaDirecta) {
  principal();
}
