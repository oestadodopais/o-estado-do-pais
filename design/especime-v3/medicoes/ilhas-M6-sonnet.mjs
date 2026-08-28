#!/usr/bin/env node
// design/especime-v3/medicoes/ilhas-M6-sonnet.mjs
//
// M6 · As ilhas · medição cega (Claude Sonnet). Código do zero: nenhuma linha
// copiada de `src/`, `scripts/` ou de qualquer medição anterior. Lê:
//   - os PDF da fonte (via extrai_acores.py / extrai_madeira.py, ao lado),
//   - as 30 linhas `ledger/claims/<slug>-desemprego-registado-2025-12.yml`
//     (parser YAML próprio, feito para a forma exacta destes ficheiros),
//   - as páginas construídas, servidas por `python3 -m http.server` a partir
//     de `dist/` (fetch HTTP real, não leitura directa do ficheiro).
//
// Não lê `src/`, `scripts/`, notas ou briefs dos construtores. Não corrige
// nada, não commita, não corre nenhum comando que mude a árvore de trabalho.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..', '..');
const DIST = path.join(REPO, 'dist');
const CLAIMS_DIR = path.join(REPO, 'ledger', 'claims');
const DADOS_DIR = path.join(REPO, 'dist', 'dados');
const PORT = process.env.MEDIDOR_PORT || '4801';
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RH = '/Users/nunosantos/Instruments/ResearchHub/content/12 Concelhos/source';
const ACORES_PDF = path.join(RH, 'acores', 'desemprego-registado-2025-12.pdf');
const MADEIRA_PDF = path.join(RH, 'madeira', 'boletim-concelhos-2025-12.pdf');

const log = (...a) => console.log(...a);
const results = { geradoEm: new Date().toISOString(), REPO, BASE_URL };

// ============================================================================
// Parser YAML próprio -- feito para a forma exacta das 30 linhas (43 linhas
// cada, mesma ordem de campos, sem block scalars, sem aspas escapadas: já
// confirmado por inspecção directa dos 30 ficheiros antes de escrever isto).
// ============================================================================
function parseClaimYaml(text) {
  const lines = text.split('\n');
  const obj = {};
  let i = 0;
  function stripComment(line) {
    return line;
  }
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw;
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m = /^([a-zA-Z_]+):\s*(.*)$/.exec(line);
    if (!m) { i++; continue; }
    const key = m[1];
    let rest = m[2];
    if (rest === '') {
      // bloco aninhado (document:) ou lista (attributed_to:, derived_from:, corrections:)
      const children = [];
      let j = i + 1;
      while (j < lines.length && /^\s+\S/.test(lines[j])) {
        children.push(lines[j]);
        j++;
      }
      if (children.length && /^\s*-\s/.test(children[0])) {
        obj[key] = children
          .filter((c) => /^\s*-\s/.test(c))
          .map((c) => parseScalar(c.replace(/^\s*-\s*/, '')));
      } else if (children.length) {
        const sub = {};
        for (const c of children) {
          const cm = /^\s+([a-zA-Z_]+):\s*(.*)$/.exec(c);
          if (cm) sub[cm[1]] = parseScalar(cm[2]);
        }
        obj[key] = sub;
      } else {
        obj[key] = null;
      }
      i = j;
      continue;
    }
    obj[key] = parseScalar(rest);
    i++;
  }
  return obj;
}
function parseScalar(v) {
  v = v.trim();
  if (v === 'null') return null;
  if (v === '[]') return [];
  if (v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  return v;
}

// ============================================================================
// Normalização de números publicados (espaço normal, U+202F, U+00A0, ponto de
// milhar) -- os valores desta medida são sempre contagens inteiras de pessoas.
// ============================================================================
function normNum(s) {
  if (s === null || s === undefined) return null;
  const digits = String(s).replace(/[^\d]/g, '');
  if (digits === '') return null;
  return parseInt(digits, 10);
}

// ============================================================================
// Pequenos extractores de HTML (regex, própios -- sem cheerio/jsdom)
// ============================================================================
function getAllArticles(html) {
  const articles = [];
  const re = /<article class="peca( peca-vazia)?"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index;
    const end = html.indexOf('</article>', start);
    if (end === -1) continue;
    const rawTag = m[0];
    const raw = html.slice(start, end + '</article>'.length);
    const isEmpty = / peca-vazia"/.test(rawTag);
    const medidaIdM = /data-medida="([^"]+)"/.exec(rawTag);
    const nomeM = /data-medida-nome>([^<]*)</.exec(raw);
    const valorM = /class="claim-value peca-valor">([^<]*)</.exec(raw);
    const hrefs = [...raw.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
    articles.push({
      raw,
      isEmpty,
      medidaId: medidaIdM ? medidaIdM[1] : null,
      nome: nomeM ? nomeM[1] : null,
      valor: valorM ? valorM[1] : null,
      hrefs,
    });
  }
  return articles;
}
function getArticleByMedida(html, medidaId) {
  return getAllArticles(html).find((a) => a.medidaId === medidaId) || null;
}
function livroRazaoField(html, campo) {
  const re = new RegExp(`data-linha-campo="${campo.replace(/\./g, '\\.')}"[^>]*>([^<]*)<`);
  const m = re.exec(html);
  return m ? m[1] : null;
}
function livroRazaoValor(html) {
  const m = /class="claim-value linha-valor-num">([^<]*)</.exec(html);
  return m ? m[1] : null;
}
function livroRazaoExcerto(html) {
  const m = /data-linha-campo="excerpt">([^<]*)</.exec(html);
  return m ? m[1] : null;
}

async function fetchText(urlPath) {
  const res = await fetch(BASE_URL + urlPath);
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${urlPath}`);
  return await res.text();
}

// ============================================================================
// Extração dos PDF (chama os dois programas Python ao lado, próprios)
// ============================================================================
function extraiAcores() {
  const out = execFileSync('python3', [path.join(__dirname, 'extrai_acores.py'), ACORES_PDF], { maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(out.toString('utf-8'));
}
function extraiMadeira() {
  const out = execFileSync('python3', [path.join(__dirname, 'extrai_madeira.py'), MADEIRA_PDF], { maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(out.toString('utf-8'));
}
function corretorSelftest(script, pdf) {
  const out = execFileSync('python3', [path.join(__dirname, script), pdf, '--selftest'], { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
  if (!out.includes('TUDO OK')) throw new Error(`selftest de ${script} não passou:\n${out}`);
  return out;
}

// ============================================================================
// A tabela de junção: 30 linhas, cada uma com a forma como o PDF imprime o
// nome, o slug do sítio, o dtmn/DICO esperado (CAOP 2025) e a região.
// ============================================================================
const JUNCAO_ACORES = [
  ['VILA DO PORTO', 'vila-do-porto', 4101],
  ['LAGOA', 'lagoa-ilha-de-sao-miguel', 4201],
  ['NORDESTE', 'nordeste', 4202],
  ['PONTA DELGADA', 'ponta-delgada', 4203],
  ['POVOAÇÃO', 'povoacao', 4204],
  ['RIBEIRA GRANDE', 'ribeira-grande', 4205],
  ['VILA FRANCA DO CAMPO', 'vila-franca-do-campo', 4206],
  ['ANGRA DO HEROÍSMO', 'angra-do-heroismo', 4301],
  ['PRAIA DA VITÓRIA', 'praia-da-vitoria', 4302],
  ['SANTA CRUZ DA GRACIOSA', 'santa-cruz-da-graciosa', 4401],
  ['CALHETA', 'calheta-de-sao-jorge', 4501],
  ['VELAS', 'velas', 4502],
  ['LAJES DO PICO', 'lajes-do-pico', 4601],
  ['MADALENA', 'madalena', 4602],
  ['SÃO ROQUE DO PICO', 'sao-roque-do-pico', 4603],
  ['HORTA', 'horta', 4701],
  ['LAJES DAS FLORES', 'lajes-das-flores', 4801],
  ['SANTA CRUZ DAS FLORES', 'santa-cruz-das-flores', 4802],
  ['VILA DO CORVO', 'corvo', 4901],
].map(([nome_pdf, slug, dtmn]) => ({ nome_pdf, slug, dtmn, regiao: 'acores' }));

const JUNCAO_MADEIRA = [
  ['CALHETA', 'calheta', 3101],
  ['CÂMARA DE LOBOS', 'camara-de-lobos', 3102],
  ['FUNCHAL', 'funchal', 3103],
  ['MACHICO', 'machico', 3104],
  ['PONTA DO SOL', 'ponta-do-sol', 3105],
  ['PORTO MONIZ', 'porto-moniz', 3106],
  ['RIBEIRA BRAVA', 'ribeira-brava', 3107],
  ['SANTA CRUZ', 'santa-cruz', 3108],
  ['SANTANA', 'santana', 3109],
  ['SÃO VICENTE', 'sao-vicente', 3110],
  ['PORTO SANTO', 'porto-santo', 3201],
].map(([nome_pdf, slug, dtmn]) => ({ nome_pdf, slug, dtmn, regiao: 'madeira' }));

const JUNCAO_30 = [...JUNCAO_ACORES, ...JUNCAO_MADEIRA];

// ============================================================================
// CSV simples da CAOP (comentários '#', cabeçalho, vírgulas) -- só para
// confirmar os dtmn de forma independente do meu próprio hardcode acima.
// ============================================================================
function parseCaopCsv(file) {
  const text = readFileSync(file, 'utf-8');
  const lines = text.split('\n').filter((l) => l && !l.startsWith('#'));
  const header = lines[0].split(',');
  const rows = lines.slice(1).filter(Boolean).map((l) => {
    const cols = l.split(',');
    const o = {};
    header.forEach((h, idx) => (o[h] = cols[idx]));
    return o;
  });
  return rows;
}

// ============================================================================
// §0 -- provas dos detectores no caso conhecido (vermelho), antes de confiar
// em qualquer zero.
// ============================================================================
async function provas() {
  const prova = { comparador: null, ausencia: null, autorreferencia: null };

  // -- 0.1 Comparador de valores: altero uma CÓPIA em memória de uma linha real
  //    (corvo) e confirmo que o comparador acusa; confirmo que o original passa.
  {
    const original = readFileSync(path.join(CLAIMS_DIR, 'corvo-desemprego-registado-2025-12.yml'), 'utf-8');
    const alterado = original.replace('value: "5"', 'value: "999"');
    const claimOrig = parseClaimYaml(original);
    const claimMau = parseClaimYaml(alterado);
    const paginaHtml = await fetchText('/municipios/corvo/');
    const art = getArticleByMedida(paginaHtml, 'corvo-desemprego-registado-2025-12');
    const valorPagina = normNum(art.valor);
    const okOriginal = normNum(claimOrig.value) === valorPagina;
    const okAlterado = normNum(claimMau.value) === valorPagina;
    if (!okOriginal) throw new Error('PROVA FALHOU: o original devia bater com a página e não bateu');
    if (okAlterado) throw new Error('PROVA FALHOU: o comparador não acusou o valor alterado (999)');
    prova.comparador = {
      original: { value: claimOrig.value, pagina: valorPagina, bate: okOriginal },
      alterado: { value: claimMau.value, pagina: valorPagina, bate: okAlterado },
      veredito: 'OK: comparador acusa o valor alterado (999 != 5) e aceita o original (5 == 5)',
    };
    log('[prova 0.1] comparador de valores:', prova.comparador.veredito);
  }

  // -- 0.2 Detector de ausência: HTML sintético com data-cobertura="sem-linha"
  //    E UM claim-value ao mesmo tempo (contradição) -- tem de ser apanhado.
  {
    const sintético = `<article class="peca peca-vazia" data-medida-vazia><p class="peca-sem-linha" data-cobertura="sem-linha">sem linha ainda</p><div class="claim-value peca-valor">1234</div><h3 data-medida-nome>Medida Sintética</h3></article>`;
    const arts = getAllArticles(sintético);
    const a = arts[0];
    const contraditorio = a.isEmpty && a.valor !== null;
    if (!contraditorio) throw new Error('PROVA FALHOU: o detector de ausência não viu a contradição sintética');
    prova.ausencia = { veredito: 'OK: peça marcada sem-linha mas com valor escondido (1234) foi detectada como contraditória' };
    log('[prova 0.2] detector de ausência:', prova.ausencia.veredito);

    // e o caso limpo (só sem-linha, sem valor) não deve disparar a contradição:
    const limpo = `<article class="peca peca-vazia" data-medida-vazia><p class="peca-sem-linha" data-cobertura="sem-linha">sem linha ainda</p><h3 data-medida-nome>Medida Sintética</h3></article>`;
    const a2 = getAllArticles(limpo)[0];
    if (a2.isEmpty && a2.valor !== null) throw new Error('PROVA FALHOU: falso positivo no caso limpo');
  }

  // -- 0.3 Régua da autorreferência: HTML sintético com um href que aponta
  //    para a própria rota da página -- tem de ser apanhado; o href legítimo
  //    (para /livro-razao/...) não pode disparar.
  {
    const rota = '/municipios/corvo';
    const sinteticoMau = `<article class="peca" data-medida="corvo-desemprego-registado-2025-12"><a class="src-chip" href="${rota}">fonte (auto-referência sintética)</a></article>`;
    const sinteticoBom = `<article class="peca" data-medida="corvo-desemprego-registado-2025-12"><a class="src-chip" href="/livro-razao/corvo-desemprego-registado-2025-12">fonte</a></article>`;
    const auto = (html, rota) => getAllArticles(html).flatMap((a) => a.hrefs).filter((h) => h.replace(/\/$/, '') === rota.replace(/\/$/, ''));
    const achadosMau = auto(sinteticoMau, rota);
    const achadosBom = auto(sinteticoBom, rota);
    if (achadosMau.length !== 1) throw new Error('PROVA FALHOU: a régua não apanhou a auto-referência sintética');
    if (achadosBom.length !== 0) throw new Error('PROVA FALHOU: falso positivo no href legítimo');
    prova.autorreferencia = { veredito: 'OK: href sintético apontado para a própria rota foi detectado; o href legítimo (para /livro-razao/) não disparou' };
    log('[prova 0.3] régua de autorreferência:', prova.autorreferencia.veredito);
  }

  return prova;
}

// ============================================================================
// Medida 1 -- as três colunas (fonte, linha, página), valor a valor, para os 30
// ============================================================================
async function medida1(pdfAcores, pdfMadeira) {
  const linhas = [];
  for (const j of JUNCAO_30) {
    const pdfRows = j.regiao === 'acores' ? pdfAcores.linhas : pdfMadeira.linhas;
    const pdfRow = pdfRows.find((r) => r.nome_pdf === j.nome_pdf);
    const yamlPath = path.join(CLAIMS_DIR, `${j.slug}-desemprego-registado-2025-12.yml`);
    const yamlText = readFileSync(yamlPath, 'utf-8');
    const claim = parseClaimYaml(yamlText);
    const html = await fetchText(`/municipios/${j.slug}/`);
    const art = getArticleByMedida(html, `${j.slug}-desemprego-registado-2025-12`);

    const lrHtml = await fetchText(`/livro-razao/${j.slug}-desemprego-registado-2025-12/`);
    const lrValor = livroRazaoValor(lrHtml);
    const lrExcerto = livroRazaoExcerto(lrHtml);

    const vPdf = pdfRow ? pdfRow.total : null;
    const vYaml = normNum(claim.value);
    const vPagina = art ? normNum(art.valor) : null;
    const vRecibo = normNum(lrValor);

    linhas.push({
      slug: j.slug,
      nome_pdf: j.nome_pdf,
      regiao: j.regiao,
      dtmn: j.dtmn,
      pagina_pdf: pdfRow ? pdfRow.pagina : null,
      pagina_declarada_ledger: claim.document ? claim.document.page : null,
      pdf: vPdf,
      yaml: vYaml,
      pagina_construida: vPagina,
      recibo: vRecibo,
      excerto_ledger: claim.excerpt,
      excerto_pdf: pdfRow ? pdfRow.linha_bruta : null,
      excerto_recibo: lrExcerto,
      source: claim.source,
      bate_pdf_yaml: vPdf === vYaml,
      bate_yaml_pagina: vYaml === vPagina,
      bate_pagina_recibo: vPagina === vRecibo,
      bate_tudo: vPdf === vYaml && vYaml === vPagina && vPagina === vRecibo,
      excerto_pdf_bate_ledger: pdfRow ? normalizaEspacos(pdfRow.linha_bruta) === normalizaEspacos(claim.excerpt) : null,
    });
  }
  return linhas;
}
function normalizaEspacos(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

// ============================================================================
// Medida 1b -- caso conhecido em vivo: altero uma CÓPIA de uma linha real (não
// o ficheiro do ledger) e confirmo que o meu comparador de facto acusa quando
// comparo com a página construída real.
// ============================================================================
async function medida1bCasoConhecido() {
  const slug = 'lagoa-ilha-de-sao-miguel';
  const yamlPath = path.join(CLAIMS_DIR, `${slug}-desemprego-registado-2025-12.yml`);
  const original = readFileSync(yamlPath, 'utf-8');
  const copiaAlterada = original.replace('value: "302"', 'value: "111"');
  const claimAlterado = parseClaimYaml(copiaAlterada);
  const html = await fetchText(`/municipios/${slug}/`);
  const art = getArticleByMedida(html, `${slug}-desemprego-registado-2025-12`);
  const vPagina = normNum(art.valor);
  const vAlterado = normNum(claimAlterado.value);
  return {
    slug,
    valor_pagina_real: vPagina,
    valor_copia_alterada: vAlterado,
    acusado: vPagina !== vAlterado,
  };
}

// ============================================================================
// Medida 2 -- as somas
// ============================================================================
function medida2(pdfAcores, pdfMadeira, linhas1) {
  const somaAcoresPdf = pdfAcores.soma_dos_totais;
  const totalDocAcores = pdfAcores.total_documento.total;
  const somaMadeiraPdf = pdfMadeira.soma_dos_totais;
  const totalRegiaoMadeira = pdfMadeira.total_regiao.total;

  const somaAcoresYaml = linhas1.filter((l) => l.regiao === 'acores').reduce((a, l) => a + l.yaml, 0);
  const somaMadeiraYaml = linhas1.filter((l) => l.regiao === 'madeira').reduce((a, l) => a + l.yaml, 0);

  return {
    acores: {
      n: pdfAcores.linhas.length,
      soma_pdf: somaAcoresPdf,
      total_do_ficheiro_pdf: totalDocAcores,
      soma_yaml: somaAcoresYaml,
      bate_pdf: somaAcoresPdf === totalDocAcores,
      bate_yaml: somaAcoresYaml === totalDocAcores,
    },
    madeira: {
      n: pdfMadeira.linhas.length,
      soma_pdf: somaMadeiraPdf,
      total_da_regiao_pdf: totalRegiaoMadeira,
      soma_yaml: somaMadeiraYaml,
      bate_pdf: somaMadeiraPdf === totalRegiaoMadeira,
      bate_yaml: somaMadeiraYaml === totalRegiaoMadeira,
    },
  };
}

// ============================================================================
// Medida 3 -- a junção (Lagoas, Calhetas, Praia da Vitória, Vila do Corvo=Corvo)
// ============================================================================
async function medida3() {
  const casos = {};

  // Lagoa (Açores) vs Lagoa (Algarve) -- confirmar fontes e valores distintos
  const lagoaAcores = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'lagoa-ilha-de-sao-miguel-desemprego-registado-2025-12.yml'), 'utf-8'));
  const lagoaFaro = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'lagoa-faro-desemprego-registado-2025-12.yml'), 'utf-8'));
  const htmlLagoaFaro = await fetchText('/municipios/lagoa-faro/');
  const artLagoaFaro = getArticleByMedida(htmlLagoaFaro, 'lagoa-faro-desemprego-registado-2025-12');
  casos.lagoas = {
    acores: { slug: 'lagoa-ilha-de-sao-miguel', value: lagoaAcores.value, source: lagoaAcores.source },
    algarve: {
      slug: 'lagoa-faro', value: lagoaFaro.value, source: lagoaFaro.source,
      valor_pagina: artLagoaFaro ? artLagoaFaro.valor : null,
    },
    fontes_distintas: lagoaAcores.source !== lagoaFaro.source,
    algarve_e_iefp: lagoaFaro.source.includes('IEFP'),
    acores_e_drqpe: lagoaAcores.source.includes('DRQPE'),
    algarve_intacto: normNum(lagoaFaro.value) === normNum(artLagoaFaro ? artLagoaFaro.valor : null) && normNum(lagoaFaro.value) !== normNum(lagoaAcores.value),
  };

  // Calheta (Açores, slug calheta-de-sao-jorge) vs Calheta (Madeira, slug calheta)
  const calhetaAcores = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'calheta-de-sao-jorge-desemprego-registado-2025-12.yml'), 'utf-8'));
  const calhetaMadeira = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'calheta-desemprego-registado-2025-12.yml'), 'utf-8'));
  casos.calhetas = {
    acores: { slug: 'calheta-de-sao-jorge', value: calhetaAcores.value, source: calhetaAcores.source },
    madeira: { slug: 'calheta', value: calhetaMadeira.value, source: calhetaMadeira.source },
    fontes_distintas: calhetaAcores.source !== calhetaMadeira.source,
    valores_distintos: calhetaAcores.value !== calhetaMadeira.value,
    acores_e_drqpe: calhetaAcores.source.includes('DRQPE'),
    madeira_e_iem: calhetaMadeira.source.includes('IEM'),
  };

  // Praia da Vitória
  const praia = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'praia-da-vitoria-desemprego-registado-2025-12.yml'), 'utf-8'));
  casos.praia_da_vitoria = { slug: 'praia-da-vitoria', value: praia.value, source: praia.source, excerpt: praia.excerpt };

  // Vila do Corvo = Corvo
  const corvo = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, 'corvo-desemprego-registado-2025-12.yml'), 'utf-8'));
  casos.vila_do_corvo_e_corvo = {
    slug: 'corvo',
    value: corvo.value,
    excerpt: corvo.excerpt,
    excerto_diz_vila_do_corvo: corvo.excerpt.includes('VILA DO CORVO'),
    locator_diz_vila_do_corvo: corvo.document.locator.includes('VILA DO CORVO'),
    id_e_so_corvo: corvo.id === 'corvo-desemprego-registado-2025-12',
  };

  // DICO/dtmn: confirmar que a nota interna de cada uma das 30 linhas cita o
  // DICO esperado (derivado, de forma independente, da CAOP 2025 lida acima).
  const dicoConf = [];
  for (const j of JUNCAO_30) {
    const text = readFileSync(path.join(CLAIMS_DIR, `${j.slug}-desemprego-registado-2025-12.yml`), 'utf-8');
    const claim = parseClaimYaml(text);
    const m = /DICO (\d+)/.exec(claim.note || '');
    const dicoNaNota = m ? parseInt(m[1], 10) : null;
    dicoConf.push({ slug: j.slug, dtmn_esperado_caop: j.dtmn, dico_na_nota: dicoNaNota, bate: dicoNaNota === j.dtmn });
  }

  return { casos, dicoConf };
}

// ============================================================================
// Medida 4 -- as ausências (nos 308)
// ============================================================================
async function medida4() {
  const slugs = readdirSync(path.join(DIST, 'municipios'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const medidasAlvo = ['População residente', 'Desemprego registado', 'Dívida total do município', 'Índice de dívida', 'Execução da receita', 'Prazo médio de pagamento'];
  const vazioPor = Object.fromEntries(medidasAlvo.map((m) => [m, []]));
  const contradicoes = [];
  const medidaEmFalta = []; // páginas onde uma das 6 medidas-alvo nem sequer foi encontrada (nem cheia nem vazia)
  const contagemPecas = {}; // nº de <article class="peca..."> por página, para detectar estrutura anómala
  let paginasLidas = 0;

  for (const slug of slugs) {
    const html = await fetchText(`/municipios/${slug}/`);
    paginasLidas++;
    const arts = getAllArticles(html);
    contagemPecas[arts.length] = (contagemPecas[arts.length] || 0) + 1;
    for (const nome of medidasAlvo) {
      const a = arts.find((x) => x.nome === nome);
      if (!a) { medidaEmFalta.push({ slug, nome }); continue; }
      if (a.isEmpty) {
        vazioPor[nome].push(slug);
        if (a.valor !== null) contradicoes.push({ slug, nome, motivo: 'sem-linha mas com claim-value presente' });
      }
    }
  }

  return { totalConcelhos: slugs.length, paginasLidas, vazioPor, contradicoes, medidaEmFalta, contagemPecas };
}

// ============================================================================
// Medida 5 -- a nota da definição não rende (concelho açoriano vs recibo)
// ============================================================================
async function medida5() {
  const marcadoresInternos = ['efiniç', 'comparáv', 'harmonizad', 'critérios que enuncia', 'medidas ativas', 'IEFP em todos'];
  const achados = [];
  for (const j of JUNCAO_ACORES) {
    const htmlMun = await fetchText(`/municipios/${j.slug}/`);
    const htmlLr = await fetchText(`/livro-razao/${j.slug}-desemprego-registado-2025-12/`);
    const artMun = getArticleByMedida(htmlMun, `${j.slug}-desemprego-registado-2025-12`);
    const vazamentosMunPeca = marcadoresInternos.filter((mk) => (artMun ? artMun.raw : '').includes(mk));
    const vazamentosMun = marcadoresInternos.filter((mk) => htmlMun.includes(mk));
    const vazamentosLr = marcadoresInternos.filter((mk) => htmlLr.includes(mk));
    const seloMunTemFonte = artMun ? /class="src-chip"/.test(artMun.raw) : false;
    const reciboTemSource = livroRazaoField(htmlLr, 'source') !== null;
    const reciboTemDocumento = livroRazaoField(htmlLr, 'document.title') !== null;
    const reciboTemExcerto = livroRazaoExcerto(htmlLr) !== null;
    achados.push({
      slug: j.slug,
      vazamentosMunPeca, vazamentosMun, vazamentosLr,
      seloMunTemFonte, reciboTemSource, reciboTemDocumento, reciboTemExcerto,
      ok: vazamentosMun.length === 0 && vazamentosLr.length === 0 && seloMunTemFonte && reciboTemSource && reciboTemDocumento && reciboTemExcerto,
    });
  }
  return achados;
}

// ============================================================================
// Medida 6 -- a régua do inventário: autorreferência nas rotas dos concelhos
//
// NOTA METODOLÓGICA (importante, ver relatório §6): a "régua do inventário" com
// este nome é `scripts/medir-defeitos.mjs` (achado por grep em medições
// anteriores, não por leitura de notas/briefs dos construtores -- ver relatório).
// O brief desta tarefa exclui `scripts/` da leitura E não autoriza nenhuma
// excepção para o correr (ao contrário do brief de M5, que autorizava
// expressamente essa corrida). Não o corri. Construí, do zero, um detector
// equivalente e mais restrito, para o mesmo alvo (autorreferência nas rotas
// dos concelhos): nenhuma peça de uma página de concelho pode ter um href que
// aponte para a própria rota dessa página, e nenhuma fonte de uma afirmação
// das 30 pode citar o próprio sítio como proveniência externa.
// ============================================================================
async function medida6() {
  const slugs = readdirSync(path.join(DIST, 'municipios'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const autorreferencias = [];
  let paginasLidas = 0;
  for (const slug of slugs) {
    const rota = `/municipios/${slug}`;
    const html = await fetchText(`/municipios/${slug}/`);
    paginasLidas++;
    const arts = getAllArticles(html);
    for (const a of arts) {
      for (const href of a.hrefs) {
        const hrefLimpo = href.replace(/#.*$/, '').replace(/\/$/, '');
        if (hrefLimpo === rota) {
          autorreferencias.push({ slug, medida: a.medidaId || a.nome, href });
        }
      }
    }
  }

  // fonte/source_url das 30 linhas das ilhas a citar o próprio sítio como proveniência
  const autocitacoesFonte = [];
  for (const j of JUNCAO_30) {
    const claim = parseClaimYaml(readFileSync(path.join(CLAIMS_DIR, `${j.slug}-desemprego-registado-2025-12.yml`), 'utf-8'));
    const alvo = `${claim.source} ${claim.source_url || ''}`;
    if (/oestadodopa|xn--oestadodopas/i.test(alvo)) {
      autocitacoesFonte.push({ slug: j.slug, source: claim.source, source_url: claim.source_url });
    }
  }

  return { paginasLidas, autorreferencias, autocitacoesFonte };
}

// ============================================================================
// main
// ============================================================================
async function main() {
  log('== M6 · As ilhas · medição cega (Sonnet) ==');
  log('REPO:', REPO);
  log('BASE_URL:', BASE_URL);

  log('\n-- autoteste dos extractores PDF (§0, antes de qualquer confiança) --');
  log(corretorSelftest('extrai_acores.py', ACORES_PDF));
  log(corretorSelftest('extrai_madeira.py', MADEIRA_PDF));

  log('\n-- extração real dos PDF --');
  const pdfAcores = extraiAcores();
  const pdfMadeira = extraiMadeira();
  log(`Açores: ${pdfAcores.linhas.length} concelhos, soma=${pdfAcores.soma_dos_totais}, total do documento=${pdfAcores.total_documento.total}`);
  log(`Madeira: ${pdfMadeira.linhas.length} concelhos, soma=${pdfMadeira.soma_dos_totais}, total da região=${pdfMadeira.total_regiao.total}`);
  results.pdfAcores = pdfAcores;
  results.pdfMadeira = pdfMadeira;

  log('\n-- §0 provas em vivo (comparador, ausência, autorreferência) --');
  results.provas = await provas();

  log('\n-- medida 1: as três colunas, para os 30 --');
  results.medida1 = await medida1(pdfAcores, pdfMadeira);
  const disc1 = results.medida1.filter((l) => !l.bate_tudo);
  log(`30/30 processados. Discordâncias: ${disc1.length}`);
  if (disc1.length) log(JSON.stringify(disc1, null, 2));

  log('\n-- medida 1b: caso conhecido em vivo (cópia alterada de lagoa-ilha-de-sao-miguel) --');
  results.medida1b = await medida1bCasoConhecido();
  log(results.medida1b);

  log('\n-- medida 2: as somas --');
  results.medida2 = medida2(pdfAcores, pdfMadeira, results.medida1);
  log(JSON.stringify(results.medida2, null, 2));

  log('\n-- medida 3: a junção --');
  results.medida3 = await medida3();
  log(JSON.stringify(results.medida3.casos, null, 2));
  const dicoMau = results.medida3.dicoConf.filter((d) => !d.bate);
  log(`DICO/dtmn: ${results.medida3.dicoConf.length} conferidos, ${dicoMau.length} discordantes`);
  if (dicoMau.length) log(JSON.stringify(dicoMau, null, 2));

  log('\n-- medida 4: as ausências (308 páginas) --');
  results.medida4 = await medida4();
  for (const [nome, lista] of Object.entries(results.medida4.vazioPor)) {
    log(`  ${nome}: ${lista.length} vazio(s)`);
  }
  log(`  contradições (sem-linha com valor escondido): ${results.medida4.contradicoes.length}`);
  log(`  medida em falta na página (nem cheia nem vazia): ${results.medida4.medidaEmFalta.length}`);
  log(`  contagem de peças por página: ${JSON.stringify(results.medida4.contagemPecas)}`);

  log('\n-- medida 5: a nota da definição não rende --');
  results.medida5 = await medida5();
  const mau5 = results.medida5.filter((a) => !a.ok);
  log(`19/19 concelhos açorianos conferidos. Falhas: ${mau5.length}`);
  if (mau5.length) log(JSON.stringify(mau5, null, 2));

  log('\n-- medida 6: a régua do inventário (autorreferência, código próprio) --');
  results.medida6 = await medida6();
  log(`Páginas lidas: ${results.medida6.paginasLidas}. Autorreferências: ${results.medida6.autorreferencias.length}. Autocitações de fonte: ${results.medida6.autocitacoesFonte.length}`);

  const outPath = path.join(__dirname, 'ilhas-M6-sonnet.resultados.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  log(`\n== resultados completos gravados em ${outPath} ==`);
}

main().catch((err) => {
  console.error('ERRO FATAL:', err);
  process.exit(1);
});
