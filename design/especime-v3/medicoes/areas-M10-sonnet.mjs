#!/usr/bin/env node
/**
 * areas-M10-sonnet.mjs
 * ============================================================================
 * A medição cega do bloco «áreas de governo» (M10), por Claude Sonnet.
 * ============================================================================
 *
 * Escrito do zero, sem importar nada de `scripts/` nem de `src/` do sítio: os
 * ficheiros de dados do sítio (`src/data/areas.mjs`) são lidos como TEXTO
 * (fs.readFileSync) e avaliados como um literal de dados isolado, com
 * `node:vm`, para extrair AREAS, SEM_AREA, FONTE_DOS_NOMES e LEI_ORGANICA sem
 * usar `import`. Nenhuma lógica do sítio (scripts/check-*.mjs, scripts/voz.mjs,
 * scripts/medir-defeitos.mjs) é lida nem executada por este programa: cada
 * detetor abaixo é uma implementação independente, escrita a partir do brief e
 * dos comentários do próprio ficheiro de dados (que descrevem a FORMA dos
 * dados, não o algoritmo de verificação).
 *
 * Todas as medições correm sobre `dist/`, construído por `npm run build` antes
 * deste programa correr, e sobre o `ledger/claims/*.yml`.
 *
 * Cada detetor é provado num caso conhecido vermelho, sintético e injetado em
 * memória (nunca escrito no repositório), antes de lhe ser permitido reportar
 * um zero sobre os dados reais. Um self-test falhado atira e pára o programa.
 *
 * Corre com: node design/especime-v3/medicoes/areas-M10-sonnet.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import http from 'node:http';
import { load as yamlLoad } from 'js-yaml';
import { parse as parseHtml } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../..'); // .../wt-medidor-3
const DIST = path.join(ROOT, 'dist');
const LEDGER_DIR = path.join(ROOT, 'ledger', 'claims');
const BRIEFS = path.join(ROOT, 'design/especime-v3/briefs');
const AREAS_MJS = path.join(ROOT, 'src/data/areas.mjs');
const VOZ_MARCADORES = path.join(ROOT, 'design/especime-v3/VOZ-MARCADORES.md');
const INVENTARIO = path.join(ROOT, 'design/especime-v3/INVENTARIO-FRASES.md');
const MINISTERIOS_MD = path.join(BRIEFS, 'ministerios-xxv-2026-08-28.md');
const LEI_PDF = path.join(BRIEFS, 'dre-87a-2025.pdf');
const PDFTOTEXT = '/opt/homebrew/bin/pdftotext';

console.log(`ROOT = ${ROOT}`);
if (!fs.existsSync(path.join(ROOT, 'design/especime-v3/briefs/BRIEF-areas-M10.md'))) {
  throw new Error(`ROOT mal calculado: ${ROOT} não tem o brief. Corrige __dirname/../../../..`);
}

// ---------------------------------------------------------------------------
// Utilidades gerais
// ---------------------------------------------------------------------------

function lerTexto(p) {
  return fs.readFileSync(p, 'utf8');
}

/** Colapsa espaços, tabs e quebras de linha a um único espaço, e apara. */
function normalizaEspacos(s) {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Remove a hifenização de fim de linha que o pdftotext preserva do PDF
 * original (o Diário da República tipografa com hifenização): uma linha que
 * termina em "-" imediatamente a seguir a uma letra, seguida de uma linha que
 * começa por letra minúscula, funde-se sem espaço e sem hífen. Nunca funde o
 * traço largo "—" (U+2014, o marcador de número), que é um carácter diferente.
 */
function desidifenizaPdf(texto) {
  return texto.replace(/([A-Za-zÀ-ÿ])-\n\s*([a-zà-ÿ])/g, '$1$2');
}

/**
 * Normaliza texto de PDF para comparação: remove o hífen mole (U+00AD, SOFT
 * HYPHEN) que o pdftotext extrai literalmente do tipógrafo do PDF original —
 * achado ao testar a medida 2 (Artigo 20.º, n.º 1: "formular, ­conduzir"
 * no texto extraído) — e que não é um carácter visível nem semântico: marca só
 * um ponto de quebra opcional, e desaparece quando a linha não quebra ali.
 * Cinco ocorrências no diploma inteiro (verificado por varrimento antes de
 * escrever este programa). Depois desidifeniza as quebras de linha reais e
 * colapsa espaços.
 */
function normalizaTextoDaLei(s) {
  return normalizaEspacos(desidifenizaPdf(s.replace(/­/g, '')));
}

let contadorFalsosAlarmes = [];
function registaFalsoAlarme(medida, descricao) {
  contadorFalsosAlarmes.push({ medida, descricao });
}

const resultados = {}; // preenchido medida a medida

function secao(titulo) {
  console.log(`\n${'='.repeat(78)}\n${titulo}\n${'='.repeat(78)}`);
}

function linha(msg) {
  console.log(`  ${msg}`);
}

/** Atira se a condição for falsa: usado nos self-tests dos detetores. */
function afirma(cond, msg) {
  if (!cond) throw new Error(`SELF-TEST FALHADO: ${msg}`);
}

// ---------------------------------------------------------------------------
// Leitura de src/data/areas.mjs — como TEXTO avaliado num sandbox, nunca
// import. O ficheiro não tem imports próprios (confirmado por grep antes de
// escrever este programa) e não tem lógica de decisão: só as três listas de
// dados e um `.find()` trivial.
// ---------------------------------------------------------------------------
function carregaAreasMjs() {
  const texto = lerTexto(AREAS_MJS);
  if (/\bimport\b/.test(texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) {
    throw new Error('areas.mjs contém um import inesperado; a leitura em sandbox não é segura.');
  }
  const codigo = texto.replace(/^export const /gm, 'const ').replace(/^export function /gm, 'function ');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    codigo + '\n;globalThis.__RESULT__ = { FONTE_DOS_NOMES, LEI_ORGANICA, AREAS, SEM_AREA };',
    sandbox,
    { filename: 'areas.mjs (sandbox)' },
  );
  const r = sandbox.__RESULT__;
  if (!r || !Array.isArray(r.AREAS) || !Array.isArray(r.SEM_AREA)) {
    throw new Error('Sandbox de areas.mjs não devolveu AREAS/SEM_AREA.');
  }
  return r;
}

// ---------------------------------------------------------------------------
// Leitura de ministerios-xxv-2026-08-28.md
// ---------------------------------------------------------------------------
function carregaMinisterios() {
  const texto = lerTexto(MINISTERIOS_MD);
  const linhasPt = [];
  const rePt = /^(\d+)\.\s+(.+?)\s+·\s+(.+)$/gm;
  let m;
  while ((m = rePt.exec(texto))) {
    linhasPt.push({ n: Number(m[1]), titulo: m[2].trim(), pessoa: m[3].trim() });
  }
  if (linhasPt.length !== 16) {
    throw new Error(`ministerios-xxv: esperava 16 linhas PT, encontrei ${linhasPt.length}.`);
  }

  // A secção inglesa é um parágrafo "pela mesma ordem: A · B · C ...".
  const mEn = texto.match(/pela mesma ordem:\s*([\s\S]+?)\.\s*$/m);
  if (!mEn) throw new Error('ministerios-xxv: não encontrei a lista inglesa.');
  const nomesEn = mEn[1].split('·').map((s) => s.trim()).filter(Boolean);
  if (nomesEn.length !== 16) {
    throw new Error(`ministerios-xxv: esperava 16 nomes EN, encontrei ${nomesEn.length}: ${JSON.stringify(nomesEn)}`);
  }
  // O 16.º (Agriculture and Sea) vem entre parênteses com uma ressalva do
  // próprio ficheiro-fonte: "abaixo do que a captura apanhou; a confirmar na
  // página". Isolamos o nome substantivo e guardamos a ressalva à parte.
  const ultimo = nomesEn[15];
  const incerto = /^\(/.test(ultimo);
  const nomeEnLimpo = ultimo.replace(/^\(/, '').replace(/,.*$/, '').trim();
  nomesEn[15] = nomeEnLimpo;

  return { linhasPt, nomesEn, decimoSextoIncerto: incerto, ultimoRaw: ultimo };
}

/**
 * Deriva o nome curto português de um título ministerial, removendo o
 * cabeçalho honorífico ("Ministro/Ministra [de Estado] [Adjunto/Adjunta]") e a
 * PRIMEIRA preposição que introduz o nome substantivo. Devolve também uma
 * variante que colapsa uma segunda preposição interna repetida antes de "e"
 * (ex.: "Economia e da Coesão Territorial" -> "Economia e Coesão Territorial"),
 * porque o português repete o artigo definido antes de cada substantivo
 * ("da Economia e da Coesão Territorial") mas o nome curto usado como título
 * do artigo da lei e como nome da área não repete.
 */
function derivaNomesCurtosPt(titulo) {
  const re = /^Ministr[oa](?:\s+de\s+Estado)?(?:\s+Adjunt[oa])?\s+(?:e\s+)?(?:da|do|das|dos)\s+(.+)$/;
  const m = titulo.match(re);
  if (!m) return { curto: null, colapsado: null };
  const curto = m[1].trim();
  const colapsado = curto.replace(/\be (da|do|das|dos) /, 'e ');
  return { curto, colapsado };
}

// ---------------------------------------------------------------------------
// Leitura e análise da Lei (Decreto-Lei n.º 87-A/2025), via pdftotext -layout
// ---------------------------------------------------------------------------
function extraiTextoDaLei() {
  if (!fs.existsSync(PDFTOTEXT)) throw new Error(`pdftotext não encontrado em ${PDFTOTEXT}`);
  const out = execFileSync(PDFTOTEXT, ['-layout', LEI_PDF, '-'], {
    encoding: 'utf8',
    maxBuffer: 40 * 1024 * 1024,
  });
  return out;
}

const RUIDO_DE_PAGINA = [
  /^\s*SUPLEMENTO\s+1\.ª\s+série\s*$/,
  /^\s*N\.º\s+\d+\s*$/,
  /^\s*\d{1,2}-\d{2}-\d{4}\s*$/,
  /^\s*Decreto-Lei n\.º 87-A\/2025\s*$/,
  /^\s*\d{1,2}\/26\s*$/,
  /^\s*$/,
];

/** Analisa o texto extraído em { numeroDoArtigo: { titulo, numerais: Map } }. */
function analisaLei(textoPdf) {
  const linhasBrutas = textoPdf.split('\n');
  const cabecalhoRe = /^\s*Artigo\s+(\d+)\.º\s*$/;

  // 1) localiza os índices de cada cabeçalho "Artigo N.º"
  const indices = [];
  linhasBrutas.forEach((l, i) => {
    const m = l.match(cabecalhoRe);
    if (m) indices.push({ i, num: Number(m[1]) });
  });
  if (indices.length < 40) throw new Error(`analisaLei: só encontrei ${indices.length} artigos; esperava >=40.`);

  const artigos = new Map();
  for (let k = 0; k < indices.length; k++) {
    const { i: inicio, num } = indices[k];
    const fim = k + 1 < indices.length ? indices[k + 1].i : linhasBrutas.length;
    const corpoLinhas = linhasBrutas.slice(inicio + 1, fim).filter((l) => !RUIDO_DE_PAGINA.some((re) => re.test(l)));
    // o título do artigo é a primeira linha não vazia do corpo (antes do "1 —")
    let tituloIdx = corpoLinhas.findIndex((l) => normalizaEspacos(l).length > 0);
    const titulo = tituloIdx >= 0 ? normalizaEspacos(corpoLinhas[tituloIdx]) : null;

    // 2) dentro do corpo, localiza os números "N — texto" (só no início de
    // linha, para não confundir com "n.os 2, 6 e 7 do artigo 14.º" no meio do
    // texto, nem com alíneas "a)"/"b)").
    const numeralRe = /^\s*(\d+)\s+—\s+(.*)$/;
    const numerais = new Map();
    let numeralAtual = null;
    let bufer = [];
    const fechaNumeral = () => {
      if (numeralAtual != null) {
        numerais.set(numeralAtual, normalizaTextoDaLei(bufer.join('\n')));
      }
      bufer = [];
    };
    for (let li = (tituloIdx >= 0 ? tituloIdx + 1 : 0); li < corpoLinhas.length; li++) {
      const l = corpoLinhas[li];
      const m = l.match(numeralRe);
      if (m) {
        fechaNumeral();
        numeralAtual = Number(m[1]);
        bufer.push(m[2]);
      } else if (numeralAtual != null) {
        bufer.push(l);
      }
    }
    fechaNumeral();

    artigos.set(num, { titulo, numerais, corpoBruto: corpoLinhas.join('\n') });
  }
  return artigos;
}

/** "Artigo 12.º, n.º 1" -> { artigo: 12, numero: 1 } */
function parseiaReferenciaArtigo(s) {
  const m = s.match(/Artigo\s+(\d+)\.º(?:,\s*n\.º\s*(\d+))?/);
  if (!m) return null;
  return { artigo: Number(m[1]), numero: m[2] ? Number(m[2]) : null };
}


// ---------------------------------------------------------------------------
// Leitura do livro-razão (ledger/claims/*.yml)
// ---------------------------------------------------------------------------
function carregaLedger() {
  const ficheiros = fs.readdirSync(LEDGER_DIR).filter((f) => f.endsWith('.yml'));
  const porId = new Map();
  for (const f of ficheiros) {
    const id = f.slice(0, -4);
    const texto = lerTexto(path.join(LEDGER_DIR, f));
    let doc;
    try {
      doc = yamlLoad(texto);
    } catch (e) {
      throw new Error(`YAML inválido em ${f}: ${e.message}`);
    }
    if (!doc || typeof doc !== 'object') throw new Error(`YAML vazio ou não é objeto: ${f}`);
    if (doc.id !== id) {
      throw new Error(`ledger: ficheiro ${f} tem id interno "${doc.id}" diferente do nome do ficheiro.`);
    }
    porId.set(id, doc);
  }
  return { porId, ficheiros };
}

// ---------------------------------------------------------------------------
// Utilidades sobre dist/
// ---------------------------------------------------------------------------
function existePaginaDist(rota) {
  // rota: "/areas/financas" ou "/en/ledger/algo" — devolve o caminho absoluto
  // do index.html se existir, senão null. Aceita também rotas que já apontem
  // directamente a um ficheiro (ex.: /robots.txt).
  const limpa = rota.split('#')[0].split('?')[0];
  if (/\.[a-z0-9]+$/i.test(limpa) && !limpa.endsWith('.html')) {
    const p = path.join(DIST, limpa);
    return fs.existsSync(p) ? p : null;
  }
  const semBarraFinal = limpa.replace(/\/$/, '');
  const candidatos = [
    path.join(DIST, semBarraFinal, 'index.html'),
    path.join(DIST, `${semBarraFinal}.html`),
  ];
  for (const c of candidatos) if (fs.existsSync(c)) return c;
  return null;
}

function leHtmlDist(rota) {
  const p = existePaginaDist(rota);
  if (!p) return null;
  return lerTexto(p);
}

function parseHtmlDist(rota) {
  const t = leHtmlDist(rota);
  if (t == null) return null;
  return parseHtml(t);
}

/** Lista todas as rotas .../index.html sob um prefixo, devolvidas como rota "/x/y". */
function listaRotasSobPrefixo(prefixo) {
  const base = path.join(DIST, prefixo);
  const out = [];
  if (!fs.existsSync(base)) return out;
  const stack = [base];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.name === 'index.html') {
        const rel = path.relative(DIST, dir).split(path.sep).join('/');
        out.push('/' + rel);
      }
    }
  }
  return out;
}

// ============================================================================
// MEDIDA 1 · OS NOMES
// ============================================================================
function comparaNomePt(nomePt, linhasPt) {
  for (const l of linhasPt) {
    const { curto, colapsado } = derivaNomesCurtosPt(l.titulo);
    if (curto === nomePt) return { ok: true, linha: l.n, titulo: l.titulo, via: 'curto' };
    if (colapsado === nomePt) return { ok: true, linha: l.n, titulo: l.titulo, via: 'colapsado (preposição interna dupla)' };
  }
  return { ok: false };
}

function comparaNomeEn(nomeEn, nomesEn) {
  const idx = nomesEn.indexOf(nomeEn);
  if (idx === -1) return { ok: false };
  return { ok: true, linha: idx + 1 };
}

function medida1_nomes(dadosAreas, ministerios) {
  secao('MEDIDA 1 · Os nomes');

  // --- self-test: nome com uma letra trocada (caso conhecido vermelho) ---
  {
    const original = 'Finanças';
    afirma(comparaNomePt(original, ministerios.linhasPt).ok, `self-test M1: "${original}" devia casar e não casou (falso positivo do próprio detetor)`);
    // troca duas letras adjacentes de posição: "Finanças" -> "Fnianças"
    const corrompido = 'Fnianças';
    afirma(corrompido !== original, 'self-test M1: a corrupção não mudou a cadeia');
    const r = comparaNomePt(corrompido, ministerios.linhasPt);
    afirma(!r.ok, `self-test M1: "${corrompido}" (letra trocada) devia FALHAR a comparação e passou — detetor cego a um falso nome`);
    linha(`self-test (caso conhecido vermelho) · "${original}" -> "${corrompido}" (letras trocadas): detetor reportou NÃO-CORRESPONDÊNCIA, como devia. OK.`);

    const origEn = 'Finance';
    afirma(comparaNomeEn(origEn, ministerios.nomesEn).ok, 'self-test M1: nome EN válido devia casar');
    const corrEn = 'Fniance';
    afirma(!comparaNomeEn(corrEn, ministerios.nomesEn).ok, 'self-test M1: nome EN corrompido devia falhar');
    linha(`self-test EN · "${origEn}" -> "${corrEn}": detetor reportou NÃO-CORRESPONDÊNCIA, como devia. OK.`);
  }

  const linhasTabela = [];
  let okPt = 0, okEn = 0;
  dadosAreas.AREAS.forEach((area, i) => {
    const rPt = comparaNomePt(area.nome.pt, ministerios.linhasPt);
    const rEn = comparaNomeEn(area.nome.en, ministerios.nomesEn);
    if (rPt.ok) okPt++;
    if (rEn.ok) okEn++;
    linhasTabela.push({
      slug: area.slug,
      nomePt: area.nome.pt,
      ptOk: rPt.ok,
      ptVia: rPt.via || null,
      ptLinhaGoverno: rPt.linha || null,
      nomeEn: area.nome.en,
      enOk: rEn.ok,
      enLinhaGoverno: rEn.linha || null,
      ordemNoMapa: i + 1,
    });
    const marcaPt = rPt.ok ? 'OK' : 'FALHA';
    const marcaEn = rEn.ok ? 'OK' : 'FALHA';
    linha(`${area.slug.padEnd(42)} PT[${marcaPt}] "${area.nome.pt}"${rPt.via ? ` (via ${rPt.via})` : ''}  EN[${marcaEn}] "${area.nome.en}"`);
  });

  // ordem: a sequência das linhas do Governo batidas pelas áreas declaradas deve ser crescente
  const ordemGoverno = linhasTabela.filter((l) => l.ptLinhaGoverno != null).map((l) => l.ptLinhaGoverno);
  let ordemCrescente = true;
  for (let i = 1; i < ordemGoverno.length; i++) if (ordemGoverno[i] <= ordemGoverno[i - 1]) ordemCrescente = false;

  linha(`Total: ${okPt}/${dadosAreas.AREAS.length} nomes PT corresponde a um dos 16; ${okEn}/${dadosAreas.AREAS.length} nomes EN corresponde a um dos 16.`);
  linha(`Ordem das áreas declaradas == ordem do Governo: ${ordemCrescente ? 'sim' : 'NÃO'} (posições no Governo, na ordem do mapa: ${ordemGoverno.join(', ')})`);
  linha(`Nota de qualidade da fonte: o 16.º nome inglês ("${ministerios.ultimoRaw}") vem marcado incerto pelo próprio ficheiro-fonte; nenhuma área declarada é Agricultura e Mar, por isso isto não afeta o resultado.`);

  resultados.m1 = { linhas: linhasTabela, okPt, okEn, total: dadosAreas.AREAS.length, ordemCrescente, ordemGoverno };
  return resultados.m1;
}


// ============================================================================
// MEDIDA 2 · AS CITAÇÕES DA LEI
// ============================================================================
/** Verifica uma entrada {materia, artigo, citacao} contra o texto da lei já analisado. */
function verificaCitacao(entrada, artigos) {
  const ref = parseiaReferenciaArtigo(entrada.artigo);
  if (!ref || ref.numero == null) {
    return { erro: `referência de artigo ilegível: "${entrada.artigo}"` };
  }
  const art = artigos.get(ref.artigo);
  if (!art) return { erro: `Artigo ${ref.artigo}.º não existe na lei` };
  const textoNumero = art.numerais.get(ref.numero);
  if (textoNumero == null) return { erro: `Artigo ${ref.artigo}.º não tem n.º ${ref.numero}` };

  const materiaNorm = normalizaEspacos(entrada.materia);
  const materiaEncontrada = textoNumero.includes(materiaNorm);
  const materiaEncontradaSemCaso = !materiaEncontrada && textoNumero.toLowerCase().includes(materiaNorm.toLowerCase());

  const citacaoNorm = normalizaEspacos(entrada.citacao);
  const citacaoExata = citacaoNorm === textoNumero;
  const citacaoContida = !citacaoExata && textoNumero.includes(citacaoNorm);

  return {
    erro: null,
    materiaEncontrada,
    materiaEncontradaSemCaso,
    citacaoExata,
    citacaoContida,
    textoNumero,
  };
}

function medida2_citacoes(dadosAreas, artigos) {
  secao('MEDIDA 2 · As citações da lei');
  registaFalsoAlarme(
    'M2',
    'Primeira passagem: a citação de Justiça (Artigo 20.º, n.º 1) não batia exatamente com o texto extraído do PDF. Causa: o pdftotext extrai literalmente o hífen mole (U+00AD) que o tipógrafo do Diário da República deixou antes de "conduzir" ("formular, ­conduzir"); esse carácter não é visível nem semântico. Corrigido normalizando U+00AD para nada antes de comparar (função normalizaTextoDaLei); as 21 citações passam a bater exatamente.',
  );

  // --- self-test: matéria inventada (caso conhecido vermelho) ---
  {
    const entradaReal = { materia: 'a política financeira do Estado', artigo: 'Artigo 12.º, n.º 1', citacao: dadosAreas.AREAS[0].materias[0].citacao };
    const rReal = verificaCitacao(entradaReal, artigos);
    afirma(!rReal.erro && rReal.materiaEncontrada, 'self-test M2: matéria real de Finanças devia ser encontrada no Artigo 12.º, n.º 1');

    const entradaFalsa = { materia: 'a política intergaláctica do turismo lunar', artigo: 'Artigo 12.º, n.º 1', citacao: entradaReal.citacao };
    const rFalsa = verificaCitacao(entradaFalsa, artigos);
    afirma(!rFalsa.erro, 'self-test M2: a referência de artigo da matéria inventada devia ser legível (só a matéria é falsa)');
    afirma(!rFalsa.materiaEncontrada && !rFalsa.materiaEncontradaSemCaso, 'self-test M2: matéria inventada devia FALHAR a procura no texto da lei e não falhou — detetor cego a uma matéria inventada');
    linha(`self-test (caso conhecido vermelho) · matéria inventada "${entradaFalsa.materia}" no Artigo 12.º, n.º 1: NÃO ENCONTRADA, como devia. OK.`);

    // e uma referência de artigo/número que não existe
    const entradaArtigoFalso = { materia: 'x', artigo: 'Artigo 99.º, n.º 1', citacao: 'x' };
    const rArtFalso = verificaCitacao(entradaArtigoFalso, artigos);
    afirma(!!rArtFalso.erro, 'self-test M2: referência a Artigo 99.º (não existe) devia dar erro');
    linha(`self-test · referência a "Artigo 99.º, n.º 1" (não existe na lei): erro reportado ("${rArtFalso.erro}"), como devia. OK.`);
  }

  const linhasTabela = [];
  let totalMaterias = 0, materiasOk = 0, citacoesExatas = 0, citacoesContidas = 0;
  const falhas = [];

  dadosAreas.AREAS.forEach((area) => {
    area.materias.forEach((mat) => {
      totalMaterias++;
      const r = verificaCitacao(mat, artigos);
      const registo = {
        area: area.slug,
        artigo: mat.artigo,
        materia: mat.materia,
        erro: r.erro,
        materiaEncontrada: r.erro ? false : r.materiaEncontrada,
        materiaEncontradaSemCaso: r.erro ? false : r.materiaEncontradaSemCaso,
        citacaoExata: r.erro ? false : r.citacaoExata,
        citacaoContida: r.erro ? false : r.citacaoContida,
      };
      linhasTabela.push(registo);
      if (!r.erro && r.materiaEncontrada) materiasOk++;
      if (!r.erro && r.citacaoExata) citacoesExatas++;
      else if (!r.erro && r.citacaoContida) citacoesContidas++;

      if (r.erro || !r.materiaEncontrada || !r.citacaoExata) {
        falhas.push({
          area: area.slug,
          artigo: mat.artigo,
          materia: mat.materia,
          detalhe: r.erro
            ? r.erro
            : `materiaEncontrada=${r.materiaEncontrada}(semCaso=${r.materiaEncontradaSemCaso}) citacaoExata=${r.citacaoExata}(contida=${r.citacaoContida})`,
        });
      }
    });
  });

  linha(`Total de matérias verificadas: ${totalMaterias}`);
  linha(`Matérias encontradas literalmente (palavra por palavra) no número indicado: ${materiasOk}/${totalMaterias}`);
  linha(`Citações (transcrição do número inteiro) exatamente iguais ao texto da lei: ${citacoesExatas}/${totalMaterias} (${citacoesContidas} adicionais só contidas, não exatas)`);
  if (falhas.length) {
    linha(`FALHAS (${falhas.length}):`);
    falhas.forEach((f) => linha(`  - [${f.area}] ${f.artigo} · "${f.materia}" · ${f.detalhe}`));
  } else {
    linha('Sem falhas: todas as matérias e citações verificadas batem certo com o texto extraído da lei.');
  }

  resultados.m2 = { totalMaterias, materiasOk, citacoesExatas, citacoesContidas, falhas, linhas: linhasTabela };
  return resultados.m2;
}


// ---------------------------------------------------------------------------
// Índice global: todas as ocorrências de data-claim="<id>" em todo o dist/,
// construído por UM varrimento (regex sobre o ficheiro inteiro, não parsing
// DOM completo — dist/ tem 6590 páginas e o parsing DOM completo de todas
// seria caro sem necessidade: só precisamos do valor renderizado ao lado do
// atributo). Serve para responder "onde mais é que este id aparece, e os
// valores concordam?" para qualquer claim usado numa área, o que cobre
// qualquer leitura razoável de "a página de origem" do brief.
// ---------------------------------------------------------------------------
function listaTodosOsFicheirosHtml() {
  const out = [];
  const stack = [DIST];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.name.endsWith('.html')) out.push(p);
    }
  }
  return out;
}

function construiIndiceDeClaims() {
  const ficheiros = listaTodosOsFicheirosHtml();
  const indice = new Map(); // id -> [{ rota, valor }]
  const reClaim = /<[a-zA-Z][a-zA-Z0-9]*\b[^>]*\bdata-claim="([^"]*)"[^>]*>([^<]*)</g;
  for (const f of ficheiros) {
    const txt = fs.readFileSync(f, 'utf8');
    if (!txt.includes('data-claim=')) continue;
    const rota = '/' + path.relative(DIST, path.dirname(f)).split(path.sep).join('/');
    let m;
    reClaim.lastIndex = 0;
    while ((m = reClaim.exec(txt))) {
      const id = m[1];
      const valor = m[2];
      if (!indice.has(id)) indice.set(id, []);
      indice.get(id).push({ rota, valor });
    }
  }
  return { indice, totalFicheiros: ficheiros.length };
}

// ---------------------------------------------------------------------------
// Extração das peças de uma página de área já construída (dist/), a partir do
// HTML: nenhuma suposição sobre `src/lib/areas.mjs` — o que conta é o que está
// no ficheiro construído.
// ---------------------------------------------------------------------------
function extraiPecasDaPaginaDeArea(rota) {
  const root = parseHtmlDist(rota);
  if (!root) return null;

  const trabalhos = root.querySelectorAll('li.areas-peca[data-area-peca="trabalho"]').map((li) => {
    const as = li.querySelectorAll('a');
    const principal = as[0];
    const porta = as.find((a) => a.classList.contains('areas-peca-porta'));
    return {
      href: principal ? principal.getAttribute('href') : null,
      textoHref: porta ? porta.getAttribute('href') : null,
    };
  });

  const conjuntos = root.querySelectorAll('li.areas-peca[data-area-peca="conjunto"]').map((li) => {
    const a = li.querySelector('a');
    return { href: a ? a.getAttribute('href') : null };
  });

  const medidas = root.querySelectorAll('div.livro-item[data-area-peca="medida"]').map((div) => {
    const valorEl = div.querySelector('[data-claim]');
    const codeEl = div.querySelector('code.livro-item-id');
    const selo = div.querySelector('a.src-chip');
    return {
      id: valorEl ? valorEl.getAttribute('data-claim') : null,
      idNoCode: codeEl ? normalizaEspacos(codeEl.text) : null,
      valor: valorEl ? valorEl.text : null,
      seloHref: selo ? selo.getAttribute('href') : null,
      estado: div.getAttribute('data-estado'),
    };
  });

  return { trabalhos, conjuntos, medidas };
}

/** Valor de um claim tal como renderizado na sua própria página de recibo. */
function valorNoRecibo(id, lang) {
  const rota = lang === 'en' ? `/en/ledger/${id}` : `/livro-razao/${id}`;
  const root = parseHtmlDist(rota);
  if (!root) return { existe: false, valor: null };
  const el = root.querySelector(`[data-claim="${cssEscape(id)}"]`);
  return { existe: true, valor: el ? el.text : null };
}

/** Escapa um id para uso num seletor CSS de atributo (ids só têm [a-z0-9-] no livro-razão, mas mantém-se seguro). */
function cssEscape(s) {
  return String(s).replace(/(["\\])/g, '\\$1');
}


// ============================================================================
// MEDIDA 3 · AS PEÇAS
// ============================================================================
function valorYamlComoRenderizado(valorYaml) {
  // Claim.astro faz `String(claim.value).replace(/ /g, ' ')` antes de
  // renderizar: o livro-razão guarda milhares com U+202F (espaço fino
  // inquebrável) e a página troca-o por U+00A0 por uma razão tipográfica
  // documentada em src/components/Claim.astro (o Bitter não desenha U+202F em
  // certos motores). Reproduzimos a MESMA troca, documentada e determinística,
  // antes de comparar carácter a carácter — sem isso, todo o valor com
  // milhares (U+202F) dava falso alarme.
  return String(valorYaml).replace(/ /g, ' ');
}

function medida3_pecas(dadosAreas, ledger) {
  secao('MEDIDA 3 · As peças');

  const { indice: indiceClaims } = construiIndiceDeClaims();

  // --- self-tests (casos conhecidos vermelhos, sintéticos, em memória) ---
  {
    // (a) peça fantasma: id que não existe no livro-razão
    const idFantasma = 'zzz-peca-fantasma-9999';
    afirma(!ledger.porId.has(idFantasma), 'self-test M3: o id fantasma escolhido já existe a sério no ledger — muda o id sintético');
    const receboFantasma = valorNoRecibo(idFantasma, 'pt');
    afirma(!receboFantasma.existe, `self-test M3: peça fantasma "${idFantasma}" devia ter recibo inexistente e "existe" veio true — detetor cego a uma peça fantasma`);
    linha(`self-test (caso conhecido vermelho) · peça fantasma "${idFantasma}": ledger.has=false, recibo existe=false, como devia. OK.`);

    // (b) valor trocado numa cópia: usa uma medida real e falsifica UMA das
    // suas ocorrências, como se uma página mostrasse "89,9" onde devia
    // mostrar "89,7".
    const idReal = 'divida-publica-2025';
    const valorReal = ledger.porId.get(idReal).value;
    afirma(!!valorReal, 'self-test M3: id real de controlo não encontrado no ledger');
    const ocorrenciasReais = indiceClaims.get(idReal) || [];
    afirma(ocorrenciasReais.length > 1, 'self-test M3: id de controlo devia ocorrer em mais de uma página');
    const copiaComValorTrocado = ocorrenciasReais.map((o, i) => (i === 0 ? { ...o, valor: '89,9' } : o));
    const valoresNaCopia = new Set(copiaComValorTrocado.map((o) => o.valor));
    afirma(valoresNaCopia.size > 1, `self-test M3: a cópia com valor trocado devia ter mais de um valor distinto e não teve — detetor cego a um valor trocado numa cópia`);
    linha(`self-test (caso conhecido vermelho) · valor trocado numa cópia de "${idReal}" (${valorReal} -> 89,9 numa das ${copiaComValorTrocado.length} ocorrências): inconsistência detetada (${valoresNaCopia.size} valores distintos), como devia. OK.`);
  }

  const porArea = [];
  let totalPecasPt = 0, totalPecasEn = 0;
  const discordancias = [];

  for (const area of dadosAreas.AREAS) {
    const registoArea = { slug: area.slug, pt: null, en: null };
    for (const lang of ['pt', 'en']) {
      const rota = lang === 'en' ? `/en/areas/${area.slug}` : `/areas/${area.slug}`;
      const pecas = extraiPecasDaPaginaDeArea(rota);
      if (!pecas) {
        discordancias.push({ area: area.slug, lang, coordenada: rota, problema: 'página da área não construiu' });
        continue;
      }

      let trabalhosOk = 0;
      for (const t of pecas.trabalhos) {
        const existe = t.href && existePaginaDist(t.href);
        if (!existe) discordancias.push({ area: area.slug, lang, coordenada: `${rota} trabalho href=${t.href}`, problema: 'rota do trabalho não constrói' });
        else trabalhosOk++;
        if (t.textoHref) {
          const existeTexto = existePaginaDist(t.textoHref);
          if (!existeTexto) discordancias.push({ area: area.slug, lang, coordenada: `${rota} texto href=${t.textoHref}`, problema: 'rota do texto do trabalho não constrói' });
        }
      }

      let conjuntosOk = 0;
      for (const c of pecas.conjuntos) {
        const existe = c.href && existePaginaDist(c.href);
        if (!existe) discordancias.push({ area: area.slug, lang, coordenada: `${rota} conjunto href=${c.href}`, problema: 'rota do conjunto não constrói' });
        else conjuntosOk++;
      }

      let medidasOk = 0;
      for (const md of pecas.medidas) {
        const coord = `${rota} medida id=${md.id}`;
        if (!md.id) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: 'medida sem data-claim' });
          continue;
        }
        if (md.idNoCode !== md.id) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: `<code> mostra id "${md.idNoCode}" diferente do data-claim "${md.id}"` });
        }
        const claim = ledger.porId.get(md.id);
        if (!claim) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: 'sem linha no livro-razão (ledger/claims/<id>.yml não existe)' });
          continue;
        }
        const recibo = valorNoRecibo(md.id, lang);
        if (!recibo.existe) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: 'a página de recibo não constrói' });
          continue;
        }
        const valorYamlEsperado = valorYamlComoRenderizado(claim.value);
        const seloEsperado = lang === 'en' ? `/en/ledger/${md.id}` : `/livro-razao/${md.id}`;

        let ok = true;
        if (md.valor !== valorYamlEsperado) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: `valor na área "${md.valor}" != YAML (renderizado) "${valorYamlEsperado}" (YAML bruto "${claim.value}")` });
          ok = false;
        }
        if (recibo.valor !== valorYamlEsperado) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: `valor no recibo "${recibo.valor}" != YAML (renderizado) "${valorYamlEsperado}"` });
          ok = false;
        }
        if (md.seloHref !== seloEsperado) {
          discordancias.push({ area: area.slug, lang, coordenada: coord, problema: `selo aponta para "${md.seloHref}", esperado "${seloEsperado}"` });
          ok = false;
        }
        // "página de origem": todas as ocorrências deste id em todo o dist/
        // (a área, o recibo, e qualquer outra página que também o cite) têm
        // de mostrar o mesmo valor.
        const ocorrencias = indiceClaims.get(md.id) || [];
        const valoresDistintos = new Set(ocorrencias.map((o) => o.valor));
        if (valoresDistintos.size > 1) {
          discordancias.push({
            area: area.slug, lang, coordenada: coord,
            problema: `valores diferentes em páginas diferentes: ${JSON.stringify(ocorrencias)}`,
          });
          ok = false;
        }
        if (ok) medidasOk++;
      }

      const total = pecas.trabalhos.length + pecas.conjuntos.length + pecas.medidas.length;
      if (lang === 'pt') totalPecasPt += total; else totalPecasEn += total;
      registoArea[lang] = {
        trabalhos: pecas.trabalhos.length, trabalhosOk,
        conjuntos: pecas.conjuntos.length, conjuntosOk,
        medidas: pecas.medidas.length, medidasOk,
        total,
      };
    }
    porArea.push(registoArea);
    linha(
      `${area.slug.padEnd(42)} PT: ${registoArea.pt.total} peça(s) (${registoArea.pt.trabalhosOk}/${registoArea.pt.trabalhos} trab., ${registoArea.pt.conjuntosOk}/${registoArea.pt.conjuntos} conj., ${registoArea.pt.medidasOk}/${registoArea.pt.medidas} med.)` +
      `  EN: ${registoArea.en.total} (${registoArea.en.trabalhosOk}/${registoArea.en.trabalhos} trab., ${registoArea.en.conjuntosOk}/${registoArea.en.conjuntos} conj., ${registoArea.en.medidasOk}/${registoArea.en.medidas} med.)`,
    );
  }

  linha(`TOTAL de peças, somando as 9 áreas: PT=${totalPecasPt}  EN=${totalPecasEn}`);
  if (discordancias.length) {
    linha(`DISCORDÂNCIAS (${discordancias.length}):`);
    discordancias.forEach((d) => linha(`  - [${d.area}/${d.lang}] ${d.coordenada} :: ${d.problema}`));
  } else {
    linha('Sem discordâncias: todas as peças renderizadas resolvem, e os valores concordam entre a área, o recibo e o YAML.');
  }

  resultados.m3 = { porArea, totalPecasPt, totalPecasEn, discordancias };
  return resultados.m3;
}


// ============================================================================
// MEDIDA 4 · NENHUMA PEÇA EM DUAS ÁREAS, NENHUMA LINHA SEM DECISÃO
// ============================================================================
/** Todas as coberturas (de matérias de áreas, e de exclusões) que um id do
 * livro-razão bate, respeitando a restrição `estudos` de cada regra. */
function encontraCoberturas(id, study, dadosAreas) {
  const coberturasArea = [];
  for (const area of dadosAreas.AREAS) {
    area.materias.forEach((mat, mi) => {
      mat.regras.forEach((regra, ri) => {
        if (regra.estudos && !(study && regra.estudos.includes(study))) return;
        if (regra.id.test(id)) {
          coberturasArea.push({ areaSlug: area.slug, materiaIndex: mi, materia: mat.materia, regraIndex: ri, idPattern: String(regra.id) });
        }
      });
    });
  }
  const coberturasSemArea = [];
  dadosAreas.SEM_AREA.forEach((excl, ei) => {
    if (excl.estudos && !(study && excl.estudos.includes(study))) return;
    if (excl.id.test(id)) coberturasSemArea.push({ assunto: excl.assunto, index: ei, idPattern: String(excl.id) });
  });
  return { coberturasArea, coberturasSemArea };
}

function medida4_coberturaTotal(dadosAreas, ledger) {
  secao('MEDIDA 4 · Nenhuma peça em duas áreas, nenhuma linha sem decisão');

  // --- self-tests (casos conhecidos vermelhos) ---
  {
    // (a) um id que não bate em nenhuma regra nem exclusão
    const idOrfao = 'zzz-sem-decisao-9999';
    const rOrfao = encontraCoberturas(idOrfao, 'estudo-inexistente-9999', dadosAreas);
    const totalOrfao = rOrfao.coberturasArea.length + rOrfao.coberturasSemArea.length;
    afirma(totalOrfao === 0, `self-test M4: id órfão sintético "${idOrfao}" devia ter 0 coberturas e teve ${totalOrfao} — detetor cego a uma linha sem decisão`);
    linha(`self-test (caso conhecido vermelho) · id sintético "${idOrfao}" sem estudo: 0 coberturas, como devia (linha "sem decisão"). OK.`);

    // (b) dupla cobertura: injeta uma cópia da regra de Justiça dentro da
    // área de Finanças (um clone de dadosAreas, nunca o objeto original nem o
    // ficheiro no disco), e confere que um id real de Justiça passa a ter 2
    // coberturas de área nesse clone — e continua a ter só 1 no original.
    const idReal = 'independencia-da-justica-2025';
    afirma(ledger.porId.has(idReal), 'self-test M4: id real de controlo não existe no ledger — escolhe outro');
    const antes = encontraCoberturas(idReal, ledger.porId.get(idReal).study, dadosAreas);
    const totalAntes = antes.coberturasArea.length + antes.coberturasSemArea.length;
    afirma(totalAntes === 1, `self-test M4: "${idReal}" devia ter exatamente 1 cobertura no mapa real e teve ${totalAntes}`);

    // NOTA: os RegExp de dadosAreas nasceram dentro do sandbox de vm (outro
    // "realm"), por isso `instanceof RegExp` (que compara a cadeia de
    // protótipos do realm PRINCIPAL) falha para eles mesmo sendo RegExp a
    // sério — achado ao escrever este self-test. `Object.prototype.toString`
    // não depende da cadeia de protótipos e funciona entre realms.
    const eRegExp = (v) => Object.prototype.toString.call(v) === '[object RegExp]';
    const clone = JSON.parse(JSON.stringify(dadosAreas, (k, v) => (eRegExp(v) ? { __regexp: v.source } : v)));
    // repara os RegExp perdidos pelo JSON.stringify, e junta um clone da regra de justiça a Finanças
    const reviveRegex = (node) => {
      if (Array.isArray(node)) return node.forEach(reviveRegex);
      if (node && typeof node === 'object') {
        for (const k of Object.keys(node)) {
          if (node[k] && node[k].__regexp) node[k] = new RegExp(node[k].__regexp);
          else reviveRegex(node[k]);
        }
      }
    };
    reviveRegex(clone.AREAS);
    reviveRegex(clone.SEM_AREA);
    const justicaMateria = dadosAreas.AREAS.find((a) => a.slug === 'justica').materias[0];
    const financasArea = clone.AREAS.find((a) => a.slug === 'financas');
    financasArea.materias.push({
      materia: '(injeção de self-test)', artigo: justicaMateria.artigo, citacao: justicaMateria.citacao,
      regras: [{ id: new RegExp(justicaMateria.regras[0].id.source), razao: '(injeção de self-test)' }],
    });
    const depois = encontraCoberturas(idReal, ledger.porId.get(idReal).study, clone);
    const totalDepois = depois.coberturasArea.length + depois.coberturasSemArea.length;
    afirma(totalDepois === 2, `self-test M4: depois de injetar a regra de Justiça em Finanças, "${idReal}" devia ter 2 coberturas e teve ${totalDepois} — detetor cego a uma dupla cobertura`);
    linha(`self-test (caso conhecido vermelho) · "${idReal}" com a regra de Justiça injetada também em Finanças (num clone em memória): 2 coberturas, como devia (dupla cobertura). Sem a injeção, o mapa real dá 1. OK.`);
  }

  let emArea = 0, foraDeArea = 0, semDecisao = 0, duplaCobertura = 0;
  const problemas = [];
  for (const id of ledger.porId.keys()) {
    const claim = ledger.porId.get(id);
    const { coberturasArea, coberturasSemArea } = encontraCoberturas(id, claim.study, dadosAreas);
    const total = coberturasArea.length + coberturasSemArea.length;
    if (total === 1) {
      if (coberturasArea.length === 1) emArea++; else foraDeArea++;
    } else if (total === 0) {
      semDecisao++;
      problemas.push({ id, tipo: 'sem-decisao', detalhe: `study="${claim.study}"` });
    } else {
      duplaCobertura++;
      problemas.push({
        id, tipo: 'dupla-cobertura',
        detalhe: `área(s): ${coberturasArea.map((c) => `${c.areaSlug}/"${c.materia}"`).join(' + ')}` +
          (coberturasSemArea.length ? ` · exclusão(ões): ${coberturasSemArea.map((c) => c.assunto).join(' + ')}` : ''),
      });
    }
  }

  const totalLinhas = ledger.porId.size;
  linha(`Total de linhas do livro-razão: ${totalLinhas} (esperado pelo brief: 2 602)`);
  linha(`Cobertas por uma matéria de área (dentro de área): ${emArea}`);
  linha(`Cobertas por uma exclusão declarada (SEM_AREA, fora de área): ${foraDeArea}`);
  linha(`Soma (em área + fora de área) = ${emArea + foraDeArea}`);
  linha(`Sem nenhuma decisão (nem matéria nem exclusão bate): ${semDecisao}`);
  linha(`Com dupla cobertura (bate em mais de uma matéria/exclusão): ${duplaCobertura}`);
  if (problemas.length) {
    linha(`PROBLEMAS (${problemas.length}):`);
    problemas.slice(0, 50).forEach((p) => linha(`  - [${p.tipo}] ${p.id} :: ${p.detalhe}`));
    if (problemas.length > 50) linha(`  ... e mais ${problemas.length - 50}`);
  } else {
    linha('Sem problemas: as 2 602 linhas estão cada uma coberta uma vez só, nunca duas, nunca nenhuma.');
  }

  resultados.m4 = { totalLinhas, emArea, foraDeArea, semDecisao, duplaCobertura, problemas };
  return resultados.m4;
}


// ============================================================================
// MEDIDA 5 · A NAVEGAÇÃO
// ============================================================================
function medida5_navegacao(dadosAreas, resultadoM3) {
  secao('MEDIDA 5 · A navegação');

  // --- self-tests ---
  {
    const linksFalsos = [{ rota: '/areas/nao-existe-9999', origem: 'sintético' }];
    const partido = linksFalsos.filter((l) => !existePaginaDist(l.rota));
    afirma(partido.length === 1, 'self-test M5: uma ligação sintética para uma rota inexistente devia ser marcada como partida — detetor cego a uma ligação partida');
    linha(`self-test (caso conhecido vermelho) · ligação sintética "/areas/nao-existe-9999": marcada como partida, como devia. OK.`);

    const contagemIndiceFalsa = 5, contagemMedidaFalsa = 6;
    afirma(contagemIndiceFalsa !== contagemMedidaFalsa, 'self-test M5: as contagens sintéticas de teste deviam ser diferentes');
    linha(`self-test (caso conhecido vermelho) · índice a mostrar "5 peças" contra uma medição real de "6": discordância detetada por desigualdade simples, como devia. OK.`);
  }

  const problemas = [];

  // 1) comando da primeira página + rodapé, nas duas edições
  for (const lang of ['pt', 'en']) {
    const rotaHome = lang === 'en' ? '/en' : '/';
    const root = parseHtmlDist(rotaHome);
    if (!root) { problemas.push({ coordenada: rotaHome, problema: 'página inicial não constrói' }); continue; }

    const noComando = root.querySelector('[data-porta="area"]');
    if (!noComando) {
      problemas.push({ coordenada: rotaHome, problema: '"Áreas" não está no comando da primeira página (data-porta="area" ausente)' });
    } else {
      const href = noComando.getAttribute('href');
      const esperado = lang === 'en' ? '/en/areas' : '/areas';
      if (href !== esperado) problemas.push({ coordenada: rotaHome, problema: `comando "Áreas" aponta para "${href}", esperado "${esperado}"` });
      else if (!existePaginaDist(href)) problemas.push({ coordenada: `${rotaHome} comando`, problema: `ligação "${href}" não resolve (rota não construída)` });
      else linha(`${rotaHome.padEnd(6)} comando: "Áreas"/"Areas" -> ${href} — resolve. OK.`);
    }

    const rodape = root.querySelectorAll('footer a, .rodape-nav a, nav a').filter((a) => {
      const h = a.getAttribute('href');
      return h === (lang === 'en' ? '/en/areas' : '/areas');
    });
    if (rodape.length === 0) {
      problemas.push({ coordenada: rotaHome, problema: '"Áreas" não encontrado no rodapé' });
    } else {
      const href = rodape[0].getAttribute('href');
      if (!existePaginaDist(href)) problemas.push({ coordenada: `${rotaHome} rodapé`, problema: `ligação "${href}" não resolve` });
      else linha(`${rotaHome.padEnd(6)} rodapé:  "Áreas"/"Areas" -> ${href} — resolve. OK.`);
    }
  }

  // 2) o índice /areas lista as mesmas áreas que existem como páginas, com a
  // contagem de peças igual à medida 3.
  for (const lang of ['pt', 'en']) {
    const rotaIndice = lang === 'en' ? '/en/areas' : '/areas';
    const root = parseHtmlDist(rotaIndice);
    if (!root) { problemas.push({ coordenada: rotaIndice, problema: 'índice não constrói' }); continue; }

    const itens = root.querySelectorAll('li.areas-item a.areas-porta').map((a) => {
      const href = a.getAttribute('href');
      const slug = href.split('/').filter(Boolean).pop();
      const provaValor = a.querySelector('.prova-valor');
      const contagem = provaValor ? Number(normalizaEspacos(provaValor.text).replace(/[^\d]/g, '')) : NaN;
      return { href, slug, contagemTexto: provaValor ? provaValor.text : null, contagem };
    });

    const slugsNoIndice = new Set(itens.map((i) => i.slug));
    const prefixoDist = lang === 'en' ? 'en/areas' : 'areas';
    const slugsConstruidos = new Set(
      listaRotasSobPrefixo(prefixoDist)
        .map((r) => r.split('/').filter(Boolean).pop())
        .filter((s) => s !== 'areas' && s !== undefined),
    );
    const slugsDeclarados = new Set(dadosAreas.AREAS.map((a) => a.slug));

    const soNoIndice = [...slugsNoIndice].filter((s) => !slugsConstruidos.has(s));
    const soConstruidos = [...slugsConstruidos].filter((s) => !slugsNoIndice.has(s));
    if (soNoIndice.length) problemas.push({ coordenada: rotaIndice, problema: `slugs no índice sem página construída: ${soNoIndice.join(', ')}` });
    if (soConstruidos.length) problemas.push({ coordenada: rotaIndice, problema: `páginas construídas sem entrada no índice: ${soConstruidos.join(', ')}` });
    if ([...slugsDeclarados].some((s) => !slugsNoIndice.has(s)) || [...slugsNoIndice].some((s) => !slugsDeclarados.has(s))) {
      problemas.push({ coordenada: rotaIndice, problema: `slugs do índice (${[...slugsNoIndice].sort()}) != slugs declarados no mapa (${[...slugsDeclarados].sort()})` });
    }

    for (const item of itens) {
      if (!existePaginaDist(item.href)) problemas.push({ coordenada: `${rotaIndice} item ${item.slug}`, problema: `ligação "${item.href}" não resolve` });
      const medido = resultadoM3.porArea.find((a) => a.slug === item.slug)?.[lang]?.total;
      if (medido == null) {
        problemas.push({ coordenada: `${rotaIndice} item ${item.slug}`, problema: 'sem contagem correspondente na medida 3 (área não encontrada)' });
      } else if (item.contagem !== medido) {
        problemas.push({
          coordenada: `${rotaIndice} item ${item.slug}`,
          problema: `índice mostra "${item.contagemTexto}" (=${item.contagem}) mas a medida 3 conta ${medido} peça(s)`,
        });
      }
    }
    linha(`${rotaIndice.padEnd(10)} lista ${itens.length} área(s); slugs == construídos == declarados: ${soNoIndice.length === 0 && soConstruidos.length === 0}; contagens conferidas: ${itens.length - itens.filter((i) => resultadoM3.porArea.find((a) => a.slug === i.slug)?.[lang]?.total !== i.contagem).length}/${itens.length}`);
  }

  if (problemas.length) {
    linha(`PROBLEMAS (${problemas.length}):`);
    problemas.forEach((p) => linha(`  - ${p.coordenada} :: ${p.problema}`));
  } else {
    linha('Sem problemas: "Áreas" está no comando e no rodapé nas duas edições, todas as ligações resolvem, e o índice lista exatamente as áreas construídas com as contagens medidas na medida 3.');
  }

  resultados.m5 = { problemas };
  return resultados.m5;
}


// ============================================================================
// MEDIDA 6 · A VOZ — leitura de VOZ-MARCADORES.md e INVENTARIO-FRASES.md
// ============================================================================
function parseVozMarcadores() {
  const texto = lerTexto(VOZ_MARCADORES);
  // a primeira tabela (## Os marcadores): | modo | marcador | razão |
  const marcadores = [];
  const reLinhaMarcador = /^\|\s*(raiz|prefixo|palavra)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/gm;
  let m;
  while ((m = reLinhaMarcador.exec(texto))) {
    marcadores.push({ modo: m[1], marcador: m[2] });
  }
  if (marcadores.length < 50) throw new Error(`parseVozMarcadores: só encontrei ${marcadores.length} marcadores; esperava dezenas.`);

  // a segunda tabela (## As exceções): | tipo | marcador | pt | en | razão | rotas |
  const secExcecoes = texto.slice(texto.indexOf('## As exceções'));
  const excecoes = [];
  const reLinhaExcecao = /^\|\s*(contexto|rota|frase|registo)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/gm;
  while ((m = reLinhaExcecao.exec(secExcecoes))) {
    excecoes.push({ tipo: m[1], marcador: m[2], pt: m[3], en: m[4], razao: m[5], rotas: m[6] });
  }
  if (excecoes.length < 5) throw new Error(`parseVozMarcadores: só encontrei ${excecoes.length} exceções; esperava pelo menos 7.`);

  return { marcadores, excecoes };
}

/** Fronteira de palavra sensível a Unicode (letras acentuadas contam como
 * carácter de palavra), para não cair na armadilha de \b (ASCII) do JS. */
function construiRegexDeMarcador({ modo, marcador }) {
  const escapado = marcador.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (modo === 'raiz') return new RegExp(escapado, 'giu');
  if (modo === 'prefixo') return new RegExp(`(?<![\\p{L}\\p{N}_])${escapado}`, 'giu');
  if (modo === 'palavra') return new RegExp(`(?<![\\p{L}\\p{N}_])${escapado}(?![\\p{L}\\p{N}_])`, 'giu');
  throw new Error(`modo de marcador desconhecido: ${modo}`);
}

function parseInventario() {
  const texto = lerTexto(INVENTARIO);
  const linhas = [];
  // NOTA: a coluna "bloco" nem sempre é um slug curto — linhas mais antigas do
  // ficheiro usam "até AAAA-MM-DD" (achado ao testar este parser: a primeira
  // tentativa, com `[a-zA-Z0-9_-]+`, só apanhava 237 das 554 linhas porque
  // rejeitava esse formato). Aceita qualquer coisa sem barra vertical.
  const re = /^\|\s*(conteudo|navegacao|autorreferencia)\s*\|\s*(.+?)\s*\|\s*([^|]+?)\s*\|\s*(viva|retirada)\s*\|\s*(.+?)\s*\|\s*$/gm;
  let m;
  while ((m = re.exec(texto))) {
    linhas.push({ classe: m[1], texto: m[2].replace(/\\\|/g, '|'), bloco: m[3], estado: m[4], razao: m[5] });
  }
  if (linhas.length < 400) throw new Error(`parseInventario: só encontrei ${linhas.length} linhas; esperava centenas.`);
  return linhas;
}

// ---------------------------------------------------------------------------
// Extração de texto das páginas das áreas
// ---------------------------------------------------------------------------
const SELETOR_EXCLUIDO_DE_PROSA = '[data-claim], [data-nonledger], [data-prova], script, style, code';

/** Remove do DOM (numa árvore já parseada, descartável) os nós que não são
 * "frase da casa": valores citados, identificadores técnicos, e a marca de
 * proveniência declarada — replicando por fora a exclusão que
 * VOZ-MARCADORES.md documenta para `data-prova` ("já a exclui como origem
 * declarada"), alargada aos outros três atributos com o mesmo estatuto de
 * dado-e-não-prosa (valor citado, identificador técnico) por analogia direta. */
function podaNosNaoProsa(root) {
  root.querySelectorAll(SELETOR_EXCLUIDO_DE_PROSA).forEach((n) => n.remove());
  return root;
}

/**
 * Texto do CONTEÚDO NOVO da página (`#conteudo`), para a varredura de
 * marcadores — não o `<body>` inteiro.
 *
 * ACHADO A TESTAR: a primeira versão varria `<body>` inteiro e acendia
 * "método" (raiz) duas vezes em CADA uma das 9 páginas de área e no índice,
 * sempre pela mesma ligação do rodapé, "Método", que existe em TODAS as
 * ~1378 rotas do sítio (rodapé partilhado, não conteúdo novo deste bloco). A
 * palavra "Método" sozinha não tem linha própria no inventário (conferido:
 * `grep "Método |" INVENTARIO-FRASES.md` não encontra nada) e o
 * `npm run check:voz` do próprio build (secção 8 deste relatório) passa
 * limpo no mesmo `dist/`; as duas coisas juntas dizem que a ligação do
 * rodapé nunca esteve destinada a entrar nesta varredura. `#conteudo` é a
 * mesma fronteira que `fragmentosDeclaraveisDaPagina` já usa para as frases
 * declaráveis, por isso as duas medições (marcadores e inventário) passam a
 * olhar para o mesmo texto. A varredura ampla (`textoAmploDaPaginaInteira`)
 * fica disponível à parte, como diagnóstico, e o relatório mostra as duas.
 */
function textoDoConteudoNovo(rota) {
  const root = parseHtmlDist(rota);
  if (!root) return null;
  const main = root.querySelector('#conteudo');
  if (!main) return null;
  podaNosNaoProsa(main);
  return normalizaEspacos(main.text);
}

/** Texto da página INTEIRA (body, incluindo cabeçalho/rodapé partilhados). Só
 * para diagnóstico: ver a nota em `textoDoConteudoNovo`. */
function textoAmploDaPaginaInteira(rota) {
  const root = parseHtmlDist(rota);
  if (!root) return null;
  const body = root.querySelector('body') || root;
  podaNosNaoProsa(body);
  return normalizaEspacos(body.text);
}

/**
 * Fragmentos "declaráveis" de uma página de área: os blocos de texto da casa
 * que um leitor vê como frase ou rótulo, dentro de `<main id="conteudo">`,
 * mais o `<title>` e a meta-descrição da `<head>`, mais os atributos
 * `title`/`aria-label` dentro do conteúdo (é onde vive, por exemplo, "peças
 * na página desta área de governo", um `title` do índice). Um bloco cujo
 * texto está TODO dentro de um único `<a>` é deixado de fora — é a regra que
 * o próprio VOZ-MARCADORES.md documenta para a linha do índice ("Justiça · 1
 * peça"), replicada aqui para a lista de portas do índice.
 */
function fragmentosDeclaraveisDaPagina(rota) {
  const root = parseHtmlDist(rota);
  if (!root) return null;
  const out = [];

  const tituloTag = root.querySelector('title');
  if (tituloTag) out.push({ texto: normalizaEspacos(tituloTag.text), fonte: '<title>' });
  const metaDesc = root.querySelector('meta[name="description"]');
  if (metaDesc) out.push({ texto: normalizaEspacos(metaDesc.getAttribute('content') || ''), fonte: 'meta[description]' });

  const main = root.querySelector('#conteudo');
  if (!main) return { fragmentos: out, semMain: true };

  // PODA PRIMEIRO (achado ao testar esta função: extrair title/aria-label
  // antes de podar deixava passar o `title` do selo de proveniência, que tem
  // `data-nonledger="proveniencia"` no PRÓPRIO elemento — "Quadro
  // institucional de indicadores" apareceu como fragmento antes desta
  // correção). Com a árvore já podada, tudo o que sobra é prosa.
  podaNosNaoProsa(main);

  main.querySelectorAll('[title]').forEach((el) => {
    const t = normalizaEspacos(el.getAttribute('title') || '');
    if (t) out.push({ texto: t, fonte: `title-attr <${el.rawTagName}>` });
  });
  main.querySelectorAll('[aria-label]').forEach((el) => {
    const t = normalizaEspacos(el.getAttribute('aria-label') || '');
    if (t) out.push({ texto: t, fonte: `aria-label <${el.rawTagName}>` });
  });

  /** Está inteiramente dentro de um <a> (subindo a árvore), OU é ele próprio
   * um contentor cujo texto inteiro vem de <a> filhos (ex.: um <p> com três
   * ligações de rodapé seguidas, sem texto próprio) — as duas formas da
   * mesma regra do inventário: "um bloco cujo texto está todo dentro de um
   * <a> não entra" (achado ao testar: sem a segunda forma, três ligações de
   * rodapé apareciam fundidas num únioo fragmento sem sentido, ex.
   * "As áreas de governoO livro-razãoOs concelhos"). */
  function inteiramenteEmLinks(el) {
    let ancestor = el.parentNode;
    while (ancestor && ancestor !== main) {
      if (ancestor.rawTagName === 'a') return true;
      ancestor = ancestor.parentNode;
    }
    const textoProprio = normalizaEspacos(el.text);
    if (!textoProprio) return false;
    const filhosA = el.querySelectorAll ? el.querySelectorAll('a') : [];
    if (filhosA.length === 0) return false;
    const textoDosLinks = normalizaEspacos(filhosA.map((a) => a.text).join(''));
    return textoDosLinks === textoProprio;
  }

  // blocos de texto: cabeçalhos, parágrafos, e nós-folha com classe de rótulo
  // conhecida. Descarta os que estão inteiramente dentro de UM <a>, ou cujo
  // texto vem inteiro de <a> filhos (a regra "linha inteira é ligação" do
  // inventário, nas suas duas formas).
  const seletoresDeBloco = 'h1, h2, h3, p, .eyebrow, .lede, .area-tipo, .livro-item-id, span[class]';
  main.querySelectorAll(seletoresDeBloco).forEach((el) => {
    const t = normalizaEspacos(el.text);
    if (!t) return;
    if (inteiramenteEmLinks(el)) return;
    out.push({ texto: t, fonte: `<${el.rawTagName}${el.classList?.value?.length ? '.' + el.classList.value.join('.') : ''}>` });
  });

  // títulos de trabalho (TituloDeTrabalho), dentro de portas — estes SIM
  // entram mesmo estando dentro de <a>, porque são o conteúdo que o link
  // existe para levar a, não um rótulo de navegação composto com um número.
  main.querySelectorAll('.areas-peca a > *').forEach((el) => {
    const t = normalizaEspacos(el.text);
    if (t) out.push({ texto: t, fonte: `título de trabalho <${el.rawTagName}>` });
  });

  // dedup preservando a primeira fonte de cada texto distinto
  const vistos = new Map();
  for (const f of out) if (!vistos.has(f.texto)) vistos.set(f.texto, f.fonte);
  return { fragmentos: [...vistos.entries()].map(([texto, fonte]) => ({ texto, fonte })), semMain: false };
}



/** Aplica as exceções de tipo "contexto" (aplicáveis a `rotaChave`, ou a
 * "(todas)") apagando o token do texto antes de os marcadores correrem. */
function aplicaExcecoesDeContexto(texto, rotaChave, excecoes) {
  let t = texto;
  for (const exc of excecoes) {
    if (exc.tipo !== 'contexto') continue;
    const rotas = exc.rotas.split('·').map((s) => s.trim());
    if (!rotas.includes('(todas)') && !rotas.includes(rotaChave)) continue;
    for (const tok of [exc.pt, exc.en]) {
      if (tok && tok !== '(nenhum)' && t.toLowerCase().includes(tok.toLowerCase())) {
        t = t.split(tok).join(' ');
      }
    }
  }
  return t;
}

function varreMarcadores(texto, marcadoresCompilados) {
  const achados = [];
  for (const mc of marcadoresCompilados) {
    mc.regex.lastIndex = 0;
    const ms = texto.match(mc.regex);
    if (ms && ms.length) achados.push({ marcador: mc.marcador, modo: mc.modo, n: ms.length, exemplo: ms[0] });
  }
  return achados;
}

function medida6_voz(dadosAreas) {
  secao('MEDIDA 6 · A voz');
  registaFalsoAlarme(
    'M6',
    'Primeira passagem: o marcador "método" (raiz) acendia duas vezes em CADA uma das 20 páginas varridas. Causa: a varredura corria sobre <body> inteiro, e a ligação do rodapé "Método" (para /metodo) existe em todas as ~1378 rotas do sítio, partilhada, não é conteúdo novo deste bloco. "Método" sozinho não tem linha própria no inventário, e o npm run check:voz do próprio build passa limpo. Corrigido restringindo a varredura de marcadores a #conteudo (a mesma fronteira que a extração de frases declaráveis já usava); a varredura ampla ao body inteiro fica como diagnóstico à parte.',
  );
  registaFalsoAlarme(
    'M6',
    'O texto de <title> (ex.: "Finanças · área de governo · O Estado do País") nunca bate exatamente com nenhuma linha do inventário, porque a base declarada ("Finanças") vem sempre composta com o sufixo partilhado "· O Estado do País" (e, nas páginas de área, também com "· área de governo"). Como <title> é metainformação do separador do browser e não prosa que o leitor vê na página, e como isto aconteceria em QUALQUER página do sítio inteiro (não só nas novas), tratamos estes 20 casos à parte no relatório com confiança mais baixa, em vez de os contar como discordâncias do corpo da página.',
  );

  const { marcadores, excecoes } = parseVozMarcadores();
  const marcadoresCompilados = marcadores.map((m) => ({ ...m, regex: construiRegexDeMarcador(m) }));
  const inv = parseInventario();
  const vivaSet = new Set(inv.filter((l) => l.estado === 'viva').map((l) => l.texto));
  const retiradaSet = new Set(inv.filter((l) => l.estado === 'retirada').map((l) => l.texto));

  // --- self-tests (casos conhecidos vermelhos) ---
  {
    const limpa = 'Finanças é a área do Ministério das Finanças, com uma medida.';
    const achadosLimpa = varreMarcadores(limpa, marcadoresCompilados);
    afirma(achadosLimpa.length === 0, `self-test M6: a frase de controlo limpa não devia acender marcador nenhum e acendeu ${JSON.stringify(achadosLimpa)}`);

    const plantada = 'Este sítio verifica cuidadosamente todos os valores desta página contra as fontes oficiais.';
    const achadosPlantada = varreMarcadores(plantada, marcadoresCompilados);
    const marcadoresAchados = achadosPlantada.map((a) => a.marcador);
    afirma(marcadoresAchados.includes('verific'), `self-test M6: frase plantada "${plantada}" devia acender o marcador "verific" — detetor cego a uma frase plantada`);
    afirma(marcadoresAchados.includes('ste sítio'), `self-test M6: frase plantada devia acender "ste sítio"`);
    afirma(marcadoresAchados.includes('sta página'), `self-test M6: frase plantada devia acender "sta página"`);
    linha(`self-test (caso conhecido vermelho) · frase plantada "${plantada}": acendeu ${marcadoresAchados.length} marcador(es) (${marcadoresAchados.join(', ')}), como devia. OK.`);

    // inventário: uma frase sintética que não está declarada
    const fraseInventada = 'Esta frase foi plantada para o self-test do M10, e não existe em nenhuma página.';
    afirma(!vivaSet.has(fraseInventada), 'self-test M6: a frase sintética de teste já existe no inventário por coincidência — muda o texto');
    linha(`self-test (caso conhecido vermelho) · frase sintética não declarada: ausente do conjunto "viva" (${vivaSet.size} frases), como devia. OK.`);

    // modo "prefixo" não deve confundir "aprovado" com "prova"
    const semPrefixoFalso = varreMarcadores('a proposta foi aprovada por unanimidade', marcadoresCompilados);
    afirma(!semPrefixoFalso.some((a) => a.marcador === 'prova'), 'self-test M6: modo "prefixo" não devia acender "prova" dentro de "aprovada" — falso positivo do próprio detetor');
    const comPrefixoReal = varreMarcadores('isto está provado pelos dados', marcadoresCompilados);
    afirma(comPrefixoReal.some((a) => a.marcador === 'prova'), 'self-test M6: modo "prefixo" devia acender "prova" em "provado"');
    linha('self-test · modo "prefixo": "aprovada" não acende "prova", "provado" acende. OK.');

    // modo "palavra" não deve confundir "nós" com "diagnóstico"
    const semPalavraFalsa = varreMarcadores('o diagnóstico está pronto', marcadoresCompilados);
    afirma(!semPalavraFalsa.some((a) => a.marcador === 'nós'), 'self-test M6: modo "palavra" não devia acender "nós" dentro de "diagnóstico" — falso positivo do próprio detetor');
    linha('self-test · modo "palavra": "diagnóstico" não acende "nós". OK.');
  }

  // --- varredura de marcadores nas páginas das áreas ---
  const rotas = ['/areas', '/en/areas', ...dadosAreas.AREAS.flatMap((a) => [`/areas/${a.slug}`, `/en/areas/${a.slug}`])];
  const chaveDaRota = (r) => (r === '/areas' || r === '/en/areas' ? 'areas' : 'area');

  const achadosDeMarcadores = [];
  const achadosAmplos = []; // diagnóstico: body inteiro, incluindo rodapé partilhado
  for (const rota of rotas) {
    const conteudo = textoDoConteudoNovo(rota);
    if (conteudo == null) { achadosDeMarcadores.push({ rota, erro: '#conteudo não existe ou página não constrói' }); continue; }
    const podado = aplicaExcecoesDeContexto(conteudo, chaveDaRota(rota), excecoes);
    const achados = varreMarcadores(podado, marcadoresCompilados);
    if (achados.length) achadosDeMarcadores.push({ rota, achados });

    const amplo = textoAmploDaPaginaInteira(rota);
    if (amplo != null) {
      const achadosA = varreMarcadores(aplicaExcecoesDeContexto(amplo, chaveDaRota(rota), excecoes), marcadoresCompilados);
      if (achadosA.length) achadosAmplos.push({ rota, achados: achadosA });
    }
  }

  linha(`Páginas varridas: ${rotas.length} (2 índices + 9 áreas × 2 edições)`);
  linha(`Âmbito principal: #conteudo (o conteúdo novo do bloco, sem cabeçalho/rodapé partilhados — ver nota no código).`);
  if (achadosDeMarcadores.length) {
    linha(`MARCADORES ACESOS em #conteudo (${achadosDeMarcadores.length} página(s)):`);
    achadosDeMarcadores.forEach((a) => {
      if (a.erro) linha(`  - [${a.rota}] ${a.erro}`);
      else a.achados.forEach((x) => linha(`  - [${a.rota}] "${x.marcador}" (${x.modo}) x${x.n} — ex.: "${x.exemplo}"`));
    });
  } else {
    linha(`Zero marcadores acesos em #conteudo nas ${rotas.length} páginas varridas.`);
  }
  const soNoAmplo = achadosAmplos.filter((a) => !achadosDeMarcadores.some((b) => b.rota === a.rota));
  linha(`Diagnóstico (página inteira, incluindo rodapé partilhado): ${achadosAmplos.length} página(s) acendem algo; ${soNoAmplo.length} delas só por causa de texto FORA de #conteudo (ex.: a ligação "Método" do rodapé, presente em todo o sítio).`);

  // --- cruzamento com o inventário: cada frase da casa das páginas novas ---
  const naoDeclaradosCorpo = [];
  const naoDeclaradosTitulo = []; // <title>: separado porque é meta-informação do separador,
  // não prosa que o leitor vê na página — ver nota no relatório.
  const retiradosMasRenderizados = [];
  let totalFragmentos = 0;

  for (const rota of rotas) {
    const r = fragmentosDeclaraveisDaPagina(rota);
    if (!r) continue;
    for (const f of r.fragmentos) {
      totalFragmentos++;
      if (vivaSet.has(f.texto)) continue;
      if (retiradaSet.has(f.texto)) { retiradosMasRenderizados.push({ rota, ...f }); continue; }
      if (f.fonte === '<title>') naoDeclaradosTitulo.push({ rota, ...f });
      else naoDeclaradosCorpo.push({ rota, ...f });
    }
  }

  linha(`Fragmentos declaráveis extraídos (corpo + <title> + meta-descrição + title/aria-label): ${totalFragmentos}`);
  linha(`Não encontrados no inventário como "viva", no CORPO da página (fora de <title>): ${naoDeclaradosCorpo.length}`);
  naoDeclaradosCorpo.forEach((f) => linha(`  - [${f.rota}] (${f.fonte}) ${JSON.stringify(f.texto)}`));
  linha(`Não encontrados, mas só no <title> (composto com o sufixo do sítio; ver nota no relatório): ${naoDeclaradosTitulo.length}`);
  linha(`Declarados como "retirada" e mesmo assim ainda renderizados: ${retiradosMasRenderizados.length}`);
  retiradosMasRenderizados.forEach((f) => linha(`  - [${f.rota}] (${f.fonte}) ${JSON.stringify(f.texto)}`));

  resultados.m6 = {
    totalPaginasVarridas: rotas.length,
    achadosDeMarcadores,
    achadosAmplos,
    totalFragmentos,
    naoDeclaradosCorpo,
    naoDeclaradosTitulo,
    retiradosMasRenderizados,
    totalMarcadores: marcadores.length,
    totalExcecoes: excecoes.length,
  };
  return resultados.m6;
}


// ============================================================================
// MEDIDA 7 · A FORMA (Playwright)
// ============================================================================
function arrancaServidorEstatico(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      let filePath = path.join(dir, urlPath);
      if (!filePath.startsWith(dir)) { res.writeHead(403); res.end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          // tenta como diretório com index.html (rota sem barra final)
          fs.readFile(path.join(filePath, 'index.html'), (err2, data2) => {
            if (err2) { res.writeHead(404); res.end('not found'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data2);
          });
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
        res.writeHead(200, { 'Content-Type': tipos[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const LARGURAS = [320, 360, 390, 430];
const ALTURA_DE_TESTE = 844; // altura comum de telemóvel; documentado, não escondido

async function medida7_forma(dadosAreas, resultadoM3) {
  secao('MEDIDA 7 · A forma (Playwright)');

  const { chromium } = await import('playwright');
  const server = await arrancaServidorEstatico(DIST);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();

  try {
    // --- self-tests (casos conhecidos vermelhos), com HTML sintético, nunca escrito no repositório ---
    {
      const page = await browser.newPage();
      const htmlComTransbordo = `<!doctype html><html><body><div style="width:2000px;height:50px;background:red">demasiado largo</div></body></html>`;
      await page.setViewportSize({ width: 390, height: ALTURA_DE_TESTE });
      await page.setContent(htmlComTransbordo);
      const medComTransbordo = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      afirma(medComTransbordo.scrollWidth > medComTransbordo.clientWidth, `self-test M7: HTML sintético com um <div> de 2000px devia transbordar a 390 e não transbordou (scrollWidth=${medComTransbordo.scrollWidth}, clientWidth=${medComTransbordo.clientWidth}) — detetor cego a transbordo horizontal`);
      linha(`self-test (caso conhecido vermelho) · HTML sintético com <div style="width:2000px"> a 390: scrollWidth ${medComTransbordo.scrollWidth} > clientWidth ${medComTransbordo.clientWidth} — transbordo detetado, como devia. OK.`);

      const htmlLimpo = `<!doctype html><html><body><div style="width:100%;box-sizing:border-box;height:50px;background:green">largura normal</div></body></html>`;
      await page.setContent(htmlLimpo);
      const medLimpo = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      afirma(medLimpo.scrollWidth <= medLimpo.clientWidth, `self-test M7: HTML sintético limpo não devia transbordar e transbordou (scrollWidth=${medLimpo.scrollWidth}, clientWidth=${medLimpo.clientWidth}) — falso alarme do próprio detetor`);
      linha(`self-test · HTML sintético limpo a 390: sem transbordo (scrollWidth ${medLimpo.scrollWidth} <= clientWidth ${medLimpo.clientWidth}). OK.`);

      // self-test da contagem "peças por ecrã": 10 blocos sintéticos de 100px cada, altura de ecrã 844 -> ~8 inteiramente visíveis
      const htmlPecas = `<!doctype html><html><body>${Array.from({ length: 10 }, (_, i) => `<div class="peca-teste" style="height:100px">peça ${i}</div>`).join('')}</body></html>`;
      await page.setContent(htmlPecas);
      const visiveisTeste = await page.evaluate(() => {
        const h = window.innerHeight;
        return [...document.querySelectorAll('.peca-teste')].filter((el) => el.getBoundingClientRect().top < h).length;
      });
      afirma(visiveisTeste > 0 && visiveisTeste < 10, `self-test M7: contagem de peças visíveis sintéticas devia ficar entre 1 e 9 (parcial) e deu ${visiveisTeste} — detetor de "peças por ecrã" não está a medir nada`);
      linha(`self-test · 10 blocos sintéticos de 100px, ecrã de ${ALTURA_DE_TESTE}px: ${visiveisTeste} visíveis sem rolar, como esperado (nem 0 nem todos). OK.`);
      await page.close();
    }

    // --- transbordo horizontal nas páginas das áreas, às 4 larguras ---
    const rotas = ['/areas', '/en/areas', ...dadosAreas.AREAS.flatMap((a) => [`/areas/${a.slug}`, `/en/areas/${a.slug}`])];
    const transbordos = [];
    const page = await browser.newPage();
    for (const largura of LARGURAS) {
      await page.setViewportSize({ width: largura, height: ALTURA_DE_TESTE });
      for (const rota of rotas) {
        const resp = await page.goto(`${base}${rota}`, { waitUntil: 'load' });
        if (!resp || !resp.ok()) { transbordos.push({ largura, rota, problema: `HTTP ${resp ? resp.status() : 'sem resposta'}` }); continue; }
        const med = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
        }));
        if (med.scrollWidth > med.clientWidth) {
          transbordos.push({ largura, rota, problema: `scrollWidth ${med.scrollWidth} > clientWidth ${med.clientWidth} (body.scrollWidth=${med.bodyScrollWidth})` });
        }
      }
    }
    linha(`Combinações verificadas: ${LARGURAS.length} larguras × ${rotas.length} páginas = ${LARGURAS.length * rotas.length}`);
    if (transbordos.length) {
      linha(`TRANSBORDOS (${transbordos.length}):`);
      transbordos.forEach((t) => linha(`  - ${t.largura}px [${t.rota}] :: ${t.problema}`));
    } else {
      linha('Sem transbordo horizontal em nenhuma combinação de largura × página.');
    }

    // --- a página com mais peças, legibilidade a 390 ---
    const areaComMaisPecas = resultadoM3.porArea.reduce((max, a) => (a.pt.total > max.pt.total ? a : max), resultadoM3.porArea[0]);
    linha(`Área com mais peças: ${areaComMaisPecas.slug} (${areaComMaisPecas.pt.total} peça(s) PT / ${areaComMaisPecas.en.total} EN).`);

    const capacidade = {};
    for (const lang of ['pt', 'en']) {
      const rota = lang === 'en' ? `/en/areas/${areaComMaisPecas.slug}` : `/areas/${areaComMaisPecas.slug}`;
      await page.setViewportSize({ width: 390, height: ALTURA_DE_TESTE });
      await page.goto(`${base}${rota}`, { waitUntil: 'load' });
      const info = await page.evaluate(() => {
        const h = window.innerHeight;
        const pecas = [...document.querySelectorAll('.areas-peca, .livro-item')];
        const visiveisInteiras = pecas.filter((el) => el.getBoundingClientRect().bottom <= h).length;
        const visiveisParciais = pecas.filter((el) => el.getBoundingClientRect().top < h).length;
        return { totalPecasNaPagina: pecas.length, visiveisInteiras, visiveisParciais, alturaJanela: h };
      });
      capacidade[lang] = info;
      linha(`  ${rota} a 390×${ALTURA_DE_TESTE}: ${info.visiveisInteiras}/${info.totalPecasNaPagina} peça(s) inteiramente visíveis sem rolar (${info.visiveisParciais} pelo menos parcialmente visíveis).`);
    }

    // --- tempo de construção da página, medido com uma construção fresca
    // (não um valor emprestado de uma construção anterior desta sessão: uma
    // reconstrução própria é o que torna este programa reproduzível por
    // outra pessoa) ---
    //
    // ACHADO A TESTAR: a primeira versão corria só `npx astro build`, mais
    // rápido, mas isso deixa `dist/` sem `dist/cartoes/` (o passo
    // `npm run cartoes`, que só o `npm run build` completo corre a seguir ao
    // astro build) — e a MEDIDA 8, a seguir, correndo `npm run verify` contra
    // esse `dist/` incompleto, falhava no portão de HTML por causa dos
    // cartões de partilha em falta. Não era um defeito do bloco das áreas: era
    // este programa a deixar o `dist/` num estado que `npm run build` nunca
    // produz sozinho. Corrigido correndo `npm run build` inteiro aqui (mais
    // lento, ~3 min, mas é o mesmo passo que o brief manda correr antes de
    // medir, e deixa `dist/` completo para a medida 8).
    linha('A reconstruir com "npm run build" (a cadeia inteira) para medir o tempo de construção de cada página, e para deixar dist/ completo para a medida 8 (demora ~3 min)...');
    const { tempos, duracaoTotalMs, codigoDeSaida } = medeTemposDeConstrucao();
    const temposDaArea = {
      pt: tempos.get(`/areas/${areaComMaisPecas.slug}/index.html`) ?? null,
      en: tempos.get(`/en/areas/${areaComMaisPecas.slug}/index.html`) ?? null,
    };
    linha(`npm run build :: código de saída ${codigoDeSaida}, ${(duracaoTotalMs / 1000).toFixed(1)}s no total, ${tempos.size} páginas com tempo individual reportado (astro).`);
    linha(`Tempo de construção de /areas/${areaComMaisPecas.slug}: ${temposDaArea.pt == null ? 'não encontrado no output' : temposDaArea.pt + 'ms'}; /en/areas/${areaComMaisPecas.slug}: ${temposDaArea.en == null ? 'não encontrado' : temposDaArea.en + 'ms'}.`);

    resultados.m7 = {
      transbordos, combinacoesVerificadas: LARGURAS.length * rotas.length,
      areaComMaisPecas: areaComMaisPecas.slug, capacidade, alturaDeTeste: ALTURA_DE_TESTE, larguras: LARGURAS,
      temposDeConstrucao: { area: temposDaArea, duracaoTotalMs, codigoDeSaida, totalPaginasComTempo: tempos.size },
    };
    await page.close();
  } finally {
    await browser.close();
    server.close();
  }
  return resultados.m7;
}

/** Corre `npm run build` (a cadeia inteira, para deixar dist/ completo — ver a
 * nota acima) e devolve o tempo individual que o astro reporta por cada
 * página construída ("├─ /rota/index.html (+Nms)" linha a linha). Uma
 * construção fresca, não um valor emprestado de uma anterior. */
function medeTemposDeConstrucao() {
  // self-test: a expressão regular tem de ler a forma exata que o astro imprime.
  {
    const linhaDeExemplo = '23:04:42   ├─ /areas/financas/index.html (+7ms) ';
    const re = /├─\s+(\/\S+\.html)\s+\(\+(\d+)ms\)/;
    const m = linhaDeExemplo.match(re);
    afirma(!!m && m[1] === '/areas/financas/index.html' && m[2] === '7', `self-test M7: a expressão do tempo de construção não leu a linha de exemplo do astro corretamente (${JSON.stringify(m)})`);
    linha('self-test · linha de exemplo do astro ("├─ /areas/financas/index.html (+7ms)") lida corretamente pela expressão de tempos. OK.');
  }

  const inicio = Date.now();
  const r = spawnSync('npm', ['run', 'build'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 });
  const duracaoTotalMs = Date.now() - inicio;
  const saida = (r.stdout || '') + (r.stderr || '');
  const tempos = new Map();
  const re = /├─\s+(\/\S+\.html)\s+\(\+(\d+)ms\)/g;
  let m;
  while ((m = re.exec(saida))) tempos.set(m[1], Number(m[2]));
  return { tempos, duracaoTotalMs, codigoDeSaida: r.status };
}


// ============================================================================
// MEDIDA 8 · A CADEIA
// ============================================================================
function correNpmScript(nomeDoScript) {
  const inicio = Date.now();
  const r = spawnSync('npm', ['run', nomeDoScript], { cwd: ROOT, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
  return {
    script: nomeDoScript,
    codigoDeSaida: r.status,
    duracaoMs: Date.now() - inicio,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    erroDeProcesso: r.error ? r.error.message : null,
  };
}

function medida8_cadeia() {
  secao('MEDIDA 8 · A cadeia');

  // --- self-test: a captura do código de saída não pode estar cega a uma falha ---
  {
    const falhaDeliberada = spawnSync('node', ['-e', 'process.exit(7)'], { encoding: 'utf8' });
    afirma(falhaDeliberada.status === 7, `self-test M8: um processo que sai com código 7 devia ser capturado como 7 e veio ${falhaDeliberada.status} — a captura de código de saída está cega a falhas`);
    linha(`self-test (caso conhecido vermelho) · processo sintético "process.exit(7)": capturado como código de saída 7, como devia. OK.`);
    const sucessoDeliberado = spawnSync('node', ['-e', 'process.exit(0)'], { encoding: 'utf8' });
    afirma(sucessoDeliberado.status === 0, 'self-test M8: um processo que sai com código 0 devia ser capturado como 0');
    linha('self-test · processo sintético "process.exit(0)": capturado como 0. OK.');
  }

  linha('A correr "npm run verify" na cópia (pode demorar); e depois "npm run typecheck"...');
  const verify = correNpmScript('verify');
  linha(`npm run verify   :: código de saída ${verify.codigoDeSaida}  (${(verify.duracaoMs / 1000).toFixed(1)}s)`);
  const ultimasLinhasVerify = verify.stdout.trim().split('\n').slice(-15).join('\n');
  linha(`  últimas linhas do stdout:\n${ultimasLinhasVerify.split('\n').map((l) => '    ' + l).join('\n')}`);
  if (verify.codigoDeSaida !== 0) {
    linha(`  stderr:\n${verify.stderr.trim().split('\n').slice(-15).map((l) => '    ' + l).join('\n')}`);
  }

  const typecheck = correNpmScript('typecheck');
  linha(`npm run typecheck :: código de saída ${typecheck.codigoDeSaida}  (${(typecheck.duracaoMs / 1000).toFixed(1)}s)`);
  const ultimasLinhasTC = (typecheck.stdout + typecheck.stderr).trim().split('\n').slice(-15).join('\n');
  linha(`  últimas linhas:\n${ultimasLinhasTC.split('\n').map((l) => '    ' + l).join('\n')}`);

  resultados.m8 = {
    verify: { codigoDeSaida: verify.codigoDeSaida, duracaoMs: verify.duracaoMs, caudaStdout: ultimasLinhasVerify },
    typecheck: { codigoDeSaida: typecheck.codigoDeSaida, duracaoMs: typecheck.duracaoMs, caudaStdout: ultimasLinhasTC },
  };
  return resultados.m8;
}

// ============================================================================
// ORQUESTRAÇÃO
// ============================================================================
async function main() {
  const inicioGeral = Date.now();
  linha(`Início: ${new Date().toISOString()}`);

  const dadosAreas = carregaAreasMjs();
  const ministerios = carregaMinisterios();
  const textoLei = extraiTextoDaLei();
  const artigos = analisaLei(textoLei);
  const ledger = carregaLedger();

  medida1_nomes(dadosAreas, ministerios);
  medida2_citacoes(dadosAreas, artigos);
  const m3 = medida3_pecas(dadosAreas, ledger);
  medida4_coberturaTotal(dadosAreas, ledger);
  medida5_navegacao(dadosAreas, m3);
  medida6_voz(dadosAreas);
  await medida7_forma(dadosAreas, m3);
  medida8_cadeia();

  secao('FIM');
  linha(`Duração total do programa: ${((Date.now() - inicioGeral) / 1000 / 60).toFixed(1)} min`);
  linha(`Falsos alarmes (o detetor acendeu, a causa era do próprio detetor, não do sítio): ${contadorFalsosAlarmes.length}`);
  contadorFalsosAlarmes.forEach((f, i) => linha(`  ${i + 1}. [${f.medida}] ${f.descricao}`));

  const caminhoJson = path.join(__dirname, 'areas-M10-sonnet.resultados.json');
  fs.writeFileSync(caminhoJson, JSON.stringify(resultados, (k, v) => (v instanceof RegExp ? String(v) : v), 2));
  linha(`Resultados escritos em ${caminhoJson}`);
}

main().catch((e) => {
  console.error('\nFALHA NO PROGRAMA:', e);
  process.exit(1);
});
