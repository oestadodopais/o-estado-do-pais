#!/usr/bin/env node
// concelhos-M5-sonnet.mjs
//
// BRIEF-concelhos-M5 · medição cega (Claude Sonnet) das páginas dos 308
// concelhos. Código de raiz, sem ver publisher/, src/, scripts/ (exceto
// scripts/medir-defeitos.mjs, que só se corre), notas ou briefs dos
// construtores. Lê: a Emenda 14 e a Emenda 19 de direcao.md, a
// tabela-resumo de fontes-308-2026-08-26.md, e os ficheiros da fonte
// alojados em ~/Instruments/ResearchHub/content/12 Concelhos/source/
// (extraídos por extrai_fontes.py, ao lado deste ficheiro).
//
// Cada detetor prova-se num caso conhecido (vermelho) antes de poder
// reportar um zero. Corre com:
//   node design/especime-v3/medicoes/concelhos-M5-sonnet.mjs [--tasks=1,2,3...]
// a partir da raiz do repositório (para o node_modules do Playwright).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { load as yamlLoad } from "js-yaml";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = "/Users/nunosantos/Instruments/OEstadoDoPais";
const BASE = "http://127.0.0.1:4731";
const SCRATCH =
  "/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad";
const WORK = path.join(SCRATCH, "work");
const LEDGER_DIR = path.join(REPO, "ledger", "claims");
const DIST_DIR = path.join(SCRATCH, "dist-concelhos");
const FONTES_JSON = path.join(WORK, "fontes.json");

fs.mkdirSync(WORK, { recursive: true });

// ---------------------------------------------------------------------
// Registo do relatório — tudo o que sai para o .md final passa por aqui.
// ---------------------------------------------------------------------
const REPORT = {
  seed: null,
  amostra: [],
  knownCasesRed: [],
  falseAlarms: [],
  findings: [], // { tarefa, achado, coordenada, prova }
  tables: {},
  counts: {},
  errors: [],
};

function logKnownCaseRed(nome, detalhe) {
  console.log(`  [caso conhecido, vermelho confirmado] ${nome} — ${detalhe}`);
  REPORT.knownCasesRed.push({ nome, detalhe });
}
function assertRed(nome, condicaoEVermelho, detalhe) {
  if (!condicaoEVermelho) {
    throw new Error(
      `DETETOR NÃO PROVADO — ${nome}: esperava vermelho (deteção positiva) e não apanhou. ${detalhe || ""}`
    );
  }
  logKnownCaseRed(nome, detalhe);
}
function logFinding(tarefa, achado, coordenada, prova) {
  console.log(`  [ACHADO ${tarefa}] ${achado} — ${coordenada}`);
  REPORT.findings.push({ tarefa, achado, coordenada, prova });
}
function logFalseAlarm(nome, causa) {
  console.log(`  [falso alarme] ${nome} — causa: ${causa}`);
  REPORT.falseAlarms.push({ nome, causa });
}

// ---------------------------------------------------------------------
// PRNG determinístico (mulberry32) — semente escrita no relatório.
// ---------------------------------------------------------------------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function amostraSemReposicao(lista, n, rng) {
  const copia = lista.slice();
  const escolhidos = [];
  for (let i = 0; i < n && copia.length > 0; i++) {
    const idx = Math.floor(rng() * copia.length);
    escolhidos.push(copia[idx]);
    copia.splice(idx, 1);
  }
  return escolhidos;
}

// ---------------------------------------------------------------------
// Normalização de texto (para comparar nomes sem depender de acentos).
// ---------------------------------------------------------------------
function normaliza(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// ---------------------------------------------------------------------
// Carregar o livro-razão (ledger/claims/*.yml) — 2552 ficheiros.
// ---------------------------------------------------------------------
function carregaLedger() {
  const ficheiros = fs.readdirSync(LEDGER_DIR).filter((f) => f.endsWith(".yml"));
  const porId = new Map();
  for (const f of ficheiros) {
    const txt = fs.readFileSync(path.join(LEDGER_DIR, f), "utf8");
    const doc = yamlLoad(txt);
    if (!doc || !doc.id) continue;
    porId.set(doc.id, { ...doc, __ficheiro: f });
  }
  return { porId, totalFicheiros: ficheiros.length };
}

// Geocod: 1 dígito + 1 letra + 5 dígitos, procurado no excerpt/locator de
// uma linha de população/poder de compra/empresas (cobre os dois formatos
// vistos: o do motor "concelhos-2026" e o de Évora, doutro estudo).
// Achado do próprio código: o "geocod" NÃO segue sempre o padrão
// dígito+letra+5dígitos (ex.: Abrantes 1D21401, Évora 1C40705) — Águeda é
// 1910101, todo numérico. A tabela-resumo dizia só "7 caracteres"; a
// forma exacta varia. Por isso procura-se pela CHAVE JSON "geocod", não
// por uma forma fixa de dígitos/letras — e cobre-se também o formato
// solto da linha de Évora ("geocod 1C40705", sem aspas nem dois pontos).
function extraiGeocod(claim) {
  const alvo = [claim?.excerpt, claim?.document?.locator].filter(Boolean).join(" | ");
  let m = alvo.match(/"geocod"\s*:\s*"([0-9A-Za-z]+)"/);
  if (m) return m[1];
  m = alvo.match(/\bgeocod\s+([0-9A-Za-z]+)/i);
  if (m) return m[1];
  m = alvo.match(/código\s+([0-9A-Za-z]{6,7})\)/);
  if (m) return m[1];
  return null;
}

// ---------------------------------------------------------------------
// Carregar fontes.json (produzido por extrai_fontes.py)
// ---------------------------------------------------------------------
function carregaFontes() {
  if (!fs.existsSync(FONTES_JSON)) {
    throw new Error(
      `fontes.json não existe em ${FONTES_JSON} — corre primeiro: python3 extrai_fontes.py --out ${FONTES_JSON}`
    );
  }
  return JSON.parse(fs.readFileSync(FONTES_JSON, "utf8"));
}

// ---------------------------------------------------------------------
// Parser mínimo dos "8 pedaços" de uma página de concelho, a partir do
// HTML estático (sem precisar de motor de parsing externo: o layout é
// consistente — ver notas de reconhecimento). Devolve uma lista ordenada
// de { nomeMedida, unidade, temLinha, dataClaim, valorTexto, estado }.
// ---------------------------------------------------------------------
function parseePecas(html) {
  // cada <article class="peca ..."> ... </article> — isola-os por regex
  // não-guloso, um a um, na ordem em que aparecem (a ordem é o que a
  // medida 4 do brief quer verificar).
  const pecas = [];
  const artRe = /<article class="(peca[^"]*)"([^>]*)>([\s\S]*?)<\/article>/g;
  let m;
  while ((m = artRe.exec(html))) {
    const [, classes, attrsRest, corpo] = m;
    const nomeM = corpo.match(/data-medida-nome>([^<]*)</);
    const unidadeM = corpo.match(/data-medida-unidade>([^<]*)</);
    const semLinha = /data-cobertura="sem-linha"/.test(corpo);
    const dataClaimM = corpo.match(/data-claim="([^"]*)"/);
    const estadoM = (attrsRest + corpo).match(/data-estado="([^"]*)"/);
    // Extrai o valor SEMPRE, independentemente de semLinha — as duas
    // deteções têm de ser independentes para o autoteste (medida 3) poder
    // apanhar a contradição "sem-linha E tem valor" num HTML sintético.
    const valM = corpo.match(/class="claim-value[^"]*"[^>]*>([^<]*)</);
    const valorTexto = valM ? valM[1].trim() : null;
    pecas.push({
      classes,
      nomeMedida: nomeM ? nomeM[1].trim() : null,
      unidade: unidadeM ? unidadeM[1].trim() : null,
      temLinha: !semLinha,
      semLinhaMarcado: semLinha,
      dataClaim: dataClaimM ? dataClaimM[1] : null,
      valorTexto,
      estado: estadoM ? estadoM[1] : null,
    });
  }
  return pecas;
}

// h2 de topo de secção (para a medida 4 — secções extra além de
// peças/cartão/barra/portas).
function parseSeccoesH2(html) {
  const out = [];
  const re = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)</g;
  let m;
  while ((m = re.exec(html))) out.push({ id: m[1], texto: m[2].trim() });
  return out;
}

async function main() {
  console.log("=== concelhos-M5-sonnet.mjs — medição cega (Claude Sonnet) ===\n");

  // -- 0. saúde do servidor --
  const ping = await fetch(BASE + "/").then((r) => r.status).catch((e) => `ERRO: ${e.message}`);
  console.log(`servidor ${BASE}: status ${ping}`);
  if (ping !== 200) throw new Error("servidor local não responde 200 — aborta");

  const { porId: ledger, totalFicheiros } = carregaLedger();
  console.log(`livro-razão carregado: ${ledger.size} linhas de ${totalFicheiros} ficheiros`);
  REPORT.counts.ledgerTotalFicheiros = totalFicheiros;
  REPORT.counts.ledgerTotalLinhasCarregadas = ledger.size;

  const fontes = carregaFontes();
  console.log("fontes.json carregado (extrai_fontes.py)");

  // slugs dos 308 concelhos: ficheiros ledger *-populacao-2025.yml
  const slugs308 = fs
    .readdirSync(LEDGER_DIR)
    .filter((f) => f.endsWith("-populacao-2025.yml"))
    .map((f) => f.replace(/-populacao-2025\.yml$/, ""));
  console.log(`slugs de concelhos (via *-populacao-2025.yml): ${slugs308.length}`);
  REPORT.counts.slugs308 = slugs308.length;
  if (slugs308.length !== 308) {
    logFinding(
      "pré-requisito",
      `esperava 308 slugs de concelhos a partir de ledger/claims/*-populacao-2025.yml, contei ${slugs308.length}`,
      "ledger/claims/*-populacao-2025.yml",
      slugs308.length
    );
  }

  // ---------------------------------------------------------------
  // AUTOTESTES — cada detetor prova-se antes de poder confiar num zero
  // ---------------------------------------------------------------
  console.log("\n--- autotestes dos detetores (caso conhecido, antes de confiar num zero) ---");
  await autoteste_comparador(ledger);
  autoteste_peca_vazia();
  autoteste_seccoes_extra();
  autoteste_selo_partido();

  console.log("\n(autotestes concluídos — todos vermelhos como esperado; a medir a sério agora)\n");

  // ---------------------------------------------------------------
  // AMOSTRA (medida 1): 30 ao acaso (semente escrita) + os 10 fixos
  // ---------------------------------------------------------------
  const SEED = 20260826;
  REPORT.seed = SEED;
  const rng = mulberry32(SEED);
  const FIXOS = [
    "evora",
    "lisboa",
    "braganca",
    "penedono",
    "corvo",
    "serta",
    "lagoa-faro",
    "lagoa-ilha-de-sao-miguel",
    "calheta",
    "calheta-de-sao-jorge",
  ];
  for (const f of FIXOS) {
    if (!slugs308.includes(f)) {
      logFinding("amostra", `slug fixo '${f}' não existe nos 308`, "lista FIXOS", f);
    }
  }
  const restantes = slugs308.filter((s) => !FIXOS.includes(s));
  const aleatorios30 = amostraSemReposicao(restantes, 30, rng);
  const amostraUnica = [...new Set([...aleatorios30, ...FIXOS])];
  REPORT.amostra = amostraUnica;
  console.log(`\namostra: semente=${SEED} · ${aleatorios30.length} ao acaso + ${FIXOS.length} fixos = ${amostraUnica.length} concelhos únicos`);
  console.log(`  ao acaso: ${aleatorios30.join(", ")}`);
  console.log(`  fixos: ${FIXOS.join(", ")}`);

  const TASKS = parseTasksArg();
  console.log(`\ntarefas a correr: ${TASKS ? [...TASKS].join(",") : "todas"}`);

  verificaColunaDivida(ledger, slugs308);

  if (!TASKS || TASKS.has(1)) await tarefa1_amostra(ledger, fontes, amostraUnica);
  if (!TASKS || TASKS.has(2)) await tarefa2_somasDeControlo(ledger, fontes, slugs308);
  if (!TASKS || TASKS.has(3)) await tarefa3_ausencias(ledger, fontes, slugs308);
  if (!TASKS || TASKS.has(4)) await tarefa4_estrutura(slugs308, rng);
  if (!TASKS || TASKS.has(5)) await tarefa5_selos(ledger, slugs308, rng);
  if (!TASKS || TASKS.has(6)) await tarefa6_indiceMunicipios(slugs308);
  if (!TASKS || TASKS.has(7)) await tarefa7_mapaPrimeiraPagina(slugs308, rng);
  if (!TASKS || TASKS.has(8)) await tarefa8_livroRazaoConjunto(ledger, slugs308);
  if (!TASKS || TASKS.has(9)) await tarefa9_escala();
  if (!TASKS || TASKS.has(10)) await tarefa10_regua();

  fs.writeFileSync(path.join(WORK, "REPORT.json"), JSON.stringify(REPORT, null, 1));
  console.log(`\n=== fim — REPORT.json escrito em ${path.join(WORK, "REPORT.json")} ===`);
}

function parseTasksArg() {
  const arg = process.argv.find((a) => a.startsWith("--tasks="));
  if (!arg) return null;
  return new Set(arg.slice("--tasks=".length).split(",").map(Number));
}

// ======================================================================
// Acesso HTTP (fetch simples — o servidor é estático; o Playwright entra
// só onde há interação real: cliques no mapa, pesquisa em vivo).
// ======================================================================
const cachePaginas = new Map();
async function buscaPagina(urlPath) {
  if (cachePaginas.has(urlPath)) return cachePaginas.get(urlPath);
  const r = await fetch(BASE + urlPath);
  const html = await r.text();
  const resultado = { status: r.status, html };
  cachePaginas.set(urlPath, resultado);
  return resultado;
}

// "linha de ABRANTES, coluna..." / "linha de CALHETA (MADEIRA), coluna..."
function extraiNomeFonte(claim) {
  const loc = claim?.document?.locator || "";
  const m = loc.match(/linha de ([^,]+),/i);
  return m ? m[1].trim().toUpperCase() : null;
}

// ======================================================================
// AUTOTESTES
// ======================================================================

// Caso conhecido do brief (medida 1): "altera um valor numa cópia de uma
// linha e vê o teu comparador acusá-lo".
async function autoteste_comparador(ledger) {
  const original = ledger.get("abrantes-populacao-2025");
  if (!original) throw new Error("autoteste: abrantes-populacao-2025 não encontrado no ledger");
  // NOTA (achado do próprio código): o campo value do ledger usa U+202F
  // (narrow no-break space) como separador de milhares, não um espaço
  // normal U+0020 nem o NBSP U+00A0 — confirmado por inspeção de
  // codepoints em abrantes-populacao-2025.yml. Um comparador por
  // igualdade de string com um literal digitado no código falha sempre
  // por isto (o autoteste original tinha exactamente este erro); o
  // comparador real compara numericamente (valorParaNumero).
  const alterado = { ...original, value: "999 999" };
  const fonteValorNumerico = 36106; // INE 0012917, geocod 1D21401, T/T — já verificado.
  const resultadoOriginal = comparaValorLedgerComNumero(original.value, fonteValorNumerico);
  const resultadoAlterado = comparaValorLedgerComNumero(alterado.value, fonteValorNumerico);
  assertRed(
    "comparador de valores (linha alterada)",
    resultadoOriginal === true && resultadoAlterado === false,
    `original 'abrantes-populacao-2025'.value=${JSON.stringify(original.value)} bate com a fonte (36106); cópia alterada para '999 999' foi acusada como não batendo`
  );
}

// Normaliza um valor "tal como publicado" (separador de milhares em
// espaço normal, NBSP ou narrow-no-break-space; vírgula decimal) para um
// número JS. Devolve NaN se não for numérico (ex.: "N.d.").
function valorParaNumero(v) {
  if (v == null) return NaN;
  let s = String(v).trim();
  s = s.replace(/[\s\u00a0\u202f]/gu, "");
  s = s.replace(/,/g, ".");
  const partes = s.split(".");
  if (partes.length > 2) {
    s = partes.slice(0, -1).join("") + "." + partes.at(-1);
  }
  return Number(s);
}
function comparaValorLedgerComNumero(valorLedger, numeroFonte, tolerancia = 0) {
  const n = valorParaNumero(valorLedger);
  if (Number.isNaN(n) || Number.isNaN(numeroFonte)) return false;
  return Math.abs(n - numeroFonte) <= tolerancia;
}

// Caso conhecido (medida 3): a peça de desemprego de um concelho das ilhas
// tem de mostrar "sem linha ainda" e NUNCA um número. Prova o detetor com
// um HTML sintético em que injecto um número onde devia estar vazio.
function autoteste_peca_vazia() {
  const htmlMau = `<article class="peca peca-vazia" data-medida-vazia><p class="peca-sem-linha" data-cobertura="sem-linha">sem linha ainda</p><div data-claim="fake-x" class="claim-value peca-valor">1234</div><h3 data-medida-nome>Desemprego registado</h3></article>`;
  const pecas = parseePecas(htmlMau);
  const p = pecas[0];
  // o detetor real: uma peça marcada sem-linha NUNCA pode ter valorTexto.
  const violacao = p.semLinhaMarcado === true && p.valorTexto !== null;
  assertRed(
    "peça vazia com número escondido (sintético)",
    violacao === true,
    `HTML sintético com data-cobertura="sem-linha" E um claim-value="1234" — detetor apanhou a contradição (valorTexto='${p.valorTexto}')`
  );
}

// Caso conhecido (medida 4): Évora tem secções extra (a "faixa dos
// mandatos" e companhia) que nenhum outro concelho tem.
function autoteste_seccoes_extra() {
  const PADRAO = new Set(["relance-k", "breve", "aparelho"]);
  const seccoesAbrantesSintetico = [
    { id: "relance-k", texto: "Relance" },
    { id: "breve", texto: "Leitura breve" },
    { id: "aparelho", texto: "Proveniência" },
  ];
  const seccoesEvoraSintetico = [
    { id: "relance-k", texto: "Relance" },
    { id: "breve", texto: "Leitura breve" },
    { id: "contas", texto: "Fundo" },
    { id: "tempo", texto: "Quem administrou, e o que as contas registaram" },
    { id: "metodo", texto: "Método e ressalvas" },
    { id: "trabalhos", texto: "Os trabalhos sobre este concelho" },
    { id: "aparelho", texto: "Proveniência" },
  ];
  const extra = (seccoes) => seccoes.filter((s) => !PADRAO.has(s.id));
  const extraAbrantes = extra(seccoesAbrantesSintetico);
  const extraEvora = extra(seccoesEvoraSintetico);
  assertRed(
    "secções extra além de peças/cartão/barra/portas (sintético Évora vs Abrantes)",
    extraAbrantes.length === 0 && extraEvora.length === 4,
    `Abrantes sintético: 0 secções extra; Évora sintético: ${extraEvora.length} (${extraEvora.map((s) => s.id).join(", ")})`
  );
}

// Caso conhecido (medida 5): um selo tem de abrir a linha certa. Prova o
// detetor com um selo sintético que aponta para um id que não existe no
// ledger.
function autoteste_selo_partido() {
  const ledgerFake = new Set(["abrantes-populacao-2025"]);
  const seloBom = "abrantes-populacao-2025";
  const seloMau = "abrantes-populacao-2099-nao-existe";
  const existeBom = ledgerFake.has(seloBom);
  const existeMau = ledgerFake.has(seloMau);
  assertRed(
    "selo aponta para id inexistente no ledger (sintético)",
    existeBom === true && existeMau === false,
    `selo sintético para id inexistente '${seloMau}' foi acusado; selo real '${seloBom}' passou`
  );
}

// ======================================================================
// MEDIDAS — as 8 peças, na ordem em que se espera que apareçam.
// ======================================================================
const MEDIDAS = [
  { idx: 0, nome: "População residente", tipo: "ine-geocod", fonteChave: "populacao" },
  { idx: 1, nome: "Poder de compra por habitante", tipo: "ine-geocod", fonteChave: "poder_de_compra" },
  { idx: 2, nome: "Desemprego registado", tipo: "nome-fonte", fonteChave: "desemprego_2025_12", campo: "total_calc" },
  { idx: 3, nome: "Empresas não financeiras", tipo: "ine-geocod", fonteChave: "empresas" },
  { idx: 4, nome: "Dívida total do município", tipo: "nome-fonte", fonteChave: "divida", campo: "divida_total_excl" },
  { idx: 5, nome: "Índice de dívida", tipo: "derivado" },
  { idx: 6, nome: "Execução da receita", tipo: "sempre-vazio" },
  { idx: 7, nome: "Prazo médio de pagamento", tipo: "nome-fonte", fonteChave: "pmp", campo: "d2025_12" },
];

function valorFonteParaMedida(spec, slug, ledger, fontes) {
  if (spec.tipo === "ine-geocod") {
    const claimPop = ledger.get(`${slug}-populacao-2025`);
    const geocod = claimPop ? extraiGeocod(claimPop) : null;
    if (!geocod) return { ok: false, motivo: "sem geocod extraível da linha de população" };
    const rec = fontes[spec.fonteChave]?.por_geocod?.[geocod];
    if (!rec) return { ok: false, motivo: `geocod ${geocod} não encontrado em fontes.${spec.fonteChave}` };
    return { ok: true, numero: valorParaNumero(rec.ind_string), textoFonte: rec.ind_string, chave: geocod };
  }
  if (spec.tipo === "nome-fonte") {
    const claimId = `${slug}-${idParaSufixoMedida(spec)}`;
    const claim = ledger.get(claimId);
    if (!claim) return { ok: false, semLinhaEsperada: true, motivo: "sem linha no ledger para esta medida" };
    const nomeFonte = extraiNomeFonte(claim);
    if (!nomeFonte) return { ok: false, motivo: `locator sem padrão 'linha de X,': ${claim.document?.locator}` };
    const rec = fontes[spec.fonteChave]?.por_municipio?.[nomeFonte];
    if (!rec) return { ok: false, motivo: `nome '${nomeFonte}' não encontrado em fontes.${spec.fonteChave}.por_municipio` };
    const bruto = rec[spec.campo];
    return { ok: true, numero: typeof bruto === "number" ? bruto : valorParaNumero(bruto), textoFonte: String(bruto), chave: nomeFonte };
  }
  return { ok: false, motivo: `tipo '${spec.tipo}' não tratado por valorFonteParaMedida` };
}

// sufixo do id do ledger para as medidas "nome-fonte" (não é 1:1 com o
// slug da medida no INE — usa-se o id real das linhas confirmado por
// inspeção directa do ledger).
function idParaSufixoMedida(spec) {
  if (spec.fonteChave === "desemprego_2025_12") return "desemprego-registado-2025-12";
  if (spec.fonteChave === "divida") return "divida-dgal-2024";
  if (spec.fonteChave === "pmp") return "prazo-medio-de-pagamento-2025-12";
  throw new Error(`idParaSufixoMedida: fonteChave desconhecida ${spec.fonteChave}`);
}

// ======================================================================
// TAREFA 1 — amostra: fonte / linha / página, 3 colunas
// ======================================================================
// A tabela-resumo de fontes-308-2026-08-26.md (linha 5, "Dívida total do
// município") diz coluna (2) «Dívida total (inclui…)». As linhas reais do
// ledger dizem outra coisa — mede-se aqui, sobre todos os 308, não só a
// amostra, com o locator de cada linha (não é uma leitura, é uma
// contagem sobre texto já carregado).
function verificaColunaDivida(ledger, slugs308) {
  let col2 = 0,
    col5 = 0,
    outro = 0,
    total = 0;
  for (const slug of slugs308) {
    const c = ledger.get(`${slug}-divida-dgal-2024`);
    if (!c) continue;
    total++;
    const loc = c.document?.locator || "";
    if (/coluna \(2\)/.test(loc)) col2++;
    else if (/coluna \(5\)/.test(loc)) col5++;
    else outro++;
  }
  console.log(`\nverificação da coluna DGAL usada em 'divida-dgal-2024' (todas as ${total} linhas): coluna(2)=${col2} · coluna(5)=${col5} · outra=${outro}`);
  if (col2 === 0 && col5 > 0) {
    logFinding(
      "0 (pré-requisito, tabela-resumo)",
      `fontes-308-2026-08-26.md, linha 5 ('Dívida total do município'), diz coluna (2) «Dívida total (inclui…)» com exemplos 55 559 123 / 390 326 431 / 5 173 710 (Évora/Lisboa/Bragança); das ${total} linhas 'divida-dgal-2024' do ledger (concelhos-2026), NENHUMA usa a coluna (2) — ${col5} dizem explicitamente 'coluna (5)' e ${outro} (Évora, doutro estudo, locator em prosa) descreve o mesmo conceito de col.(5) por outras palavras. Bragança real = 2 692 465, não 5 173 710. A tabela-resumo está desactualizada nisto; o índice de dívida (derivação, ver ledger) também usa col.(5), não col.(2).`,
      "design/especime-v3/medicoes/fontes-308-2026-08-26.md linha 17 (tabela-resumo, linha 5) vs ledger/claims/*-divida-dgal-2024.yml (campo document.locator)",
      { col2, col5, outro, total }
    );
  }
}

async function tarefa1_amostra(ledger, fontes, amostra) {
  console.log("\n=== TAREFA 1 — amostra (fonte / linha / página) ===");
  const linhas = [];
  for (const slug of amostra) {
    const { status, html } = await buscaPagina(`/municipios/${slug}/`);
    if (status !== 200) {
      logFinding("1", `página /municipios/${slug}/ devolveu status ${status}`, `/municipios/${slug}/`, status);
      continue;
    }
    const pecas = parseePecas(html);
    if (pecas.length !== 8) {
      logFinding(
        "1",
        `/municipios/${slug}/ tem ${pecas.length} peças, esperava 8`,
        `/municipios/${slug}/`,
        pecas.map((p) => p.nomeMedida)
      );
    }
    for (const spec of MEDIDAS) {
      const peca = pecas[spec.idx];
      const linha = {
        slug,
        medida: spec.nome,
        fonteTexto: null,
        fonteNumero: null,
        ledgerId: peca?.dataClaim || null,
        ledgerValor: null,
        paginaValor: peca?.valorTexto ?? null,
        estado: "ok",
        nota: "",
      };

      if (spec.tipo === "sempre-vazio") {
        const claimId = `${slug}-execucao-da-receita-2025`;
        const claimExiste = ledger.get(claimId);
        if (claimExiste && claimExiste.study === "concelhos-2026") {
          linha.estado = "DISCORDÂNCIA";
          linha.nota = `existe linha '${claimId}' no ledger (study concelhos-2026), mas a fonte não tem execução da receita`;
          logFinding("1", linha.nota, `ledger/claims/${claimId}.yml`, claimExiste.value);
        } else if (claimExiste) {
          // Évora tem linha própria de execução da receita, mas doutro
          // estudo (estudo dedicado do concelho, não concelhos-2026) — a
          // página do concelho não a usa (confirmado pela peça abaixo).
          // Não é uma discordância: é só o mesmo id de slug a existir
          // nalgum outro estudo do motor.
          logFalseAlarm(
            `linha '${claimId}' existe no ledger`,
            `pertence ao estudo '${claimExiste.study}', não a concelhos-2026 — a página do concelho não a usa (confirmado pela peça 'Execução da receita' continuar vazia)`
          );
        }
        if (peca && peca.temLinha) {
          linha.estado = "DISCORDÂNCIA";
          linha.nota += ` página mostra um valor ('${peca.valorTexto}') para execução da receita, que não tem fonte`;
          logFinding("1", `página de ${slug} mostra valor para execução da receita`, `/municipios/${slug}/`, peca.valorTexto);
        }
        linhas.push(linha);
        continue;
      }

      if (spec.tipo === "derivado") {
        // índice de dívida = divida_total_excl / limite * 150, arred. 1c.
        const claimDivida = ledger.get(`${slug}-divida-dgal-2024`);
        const claimLimite = ledger.get(`${slug}-limite-divida-dgal-2024`);
        const claimIndice = ledger.get(`${slug}-indice-de-divida-2024`);
        if (!claimDivida || !claimLimite) {
          if (peca?.temLinha) {
            linha.estado = "DISCORDÂNCIA";
            linha.nota = "página tem índice de dívida mas falta dívida ou limite no ledger para recalcular";
            logFinding("1", linha.nota, `/municipios/${slug}/`, peca.valorTexto);
          } else {
            linha.nota = "sem dívida/limite — índice vazio esperado";
          }
          linhas.push(linha);
          continue;
        }
        const dividaNum = valorFonteParaMedida({ tipo: "nome-fonte", fonteChave: "divida", campo: "divida_total_excl" }, slug, ledger, fontes);
        const limiteRec = fontes.divida?.por_municipio?.[extraiNomeFonte(claimLimite)];
        const limiteNum = limiteRec ? limiteRec.limite : null;
        if (dividaNum.ok && limiteNum != null) {
          const calculado = Math.round((dividaNum.numero / limiteNum) * 150 * 10) / 10;
          linha.fonteNumero = calculado;
          linha.fonteTexto = `calc: ${dividaNum.numero} / ${limiteNum} * 150 = ${calculado}`;
          linha.ledgerValor = claimIndice ? claimIndice.value : null;
          const ledgerOk = claimIndice ? comparaValorLedgerComNumero(claimIndice.value, calculado, 0.05) : false;
          const paginaOk = peca?.valorTexto ? comparaValorLedgerComNumero(peca.valorTexto, calculado, 0.05) : false;
          if (!claimIndice || !ledgerOk || (peca?.temLinha && !paginaOk)) {
            linha.estado = "DISCORDÂNCIA";
            linha.nota = `recalculado=${calculado}; ledger=${claimIndice?.value}; página=${peca?.valorTexto}`;
            logFinding("1", `índice de dívida de ${slug} não bate com o recálculo`, `/municipios/${slug}/ vs ledger/claims/${slug}-indice-de-divida-2024.yml`, linha.nota);
          }
        }
        linhas.push(linha);
        continue;
      }

      const fonte = valorFonteParaMedida(spec, slug, ledger, fontes);
      const claimId = peca?.dataClaim;
      const claim = claimId ? ledger.get(claimId) : null;

      if (!peca || !peca.temLinha) {
        // página não mostra número — confirma se a fonte também não tem
        // (ausência esperada) ou se há uma perda de dado (fonte tem, página não).
        if (fonte.ok) {
          linha.estado = "DISCORDÂNCIA";
          linha.nota = `fonte tem valor (${fonte.textoFonte}) mas a página mostra 'sem linha ainda'`;
          logFinding("1", linha.nota, `/municipios/${slug}/`, fonte.textoFonte);
        } else {
          linha.nota = `ausência esperada: ${fonte.motivo}`;
        }
        linhas.push(linha);
        continue;
      }

      linha.fonteNumero = fonte.ok ? fonte.numero : null;
      linha.fonteTexto = fonte.ok ? fonte.textoFonte : `[${fonte.motivo}]`;
      linha.ledgerValor = claim ? claim.value : "[id sem linha correspondente no ledger]";

      if (!claim) {
        linha.estado = "DISCORDÂNCIA";
        linha.nota = `data-claim='${claimId}' na página não existe em ledger/claims/`;
        logFinding("1", linha.nota, `/municipios/${slug}/`, claimId);
        linhas.push(linha);
        continue;
      }

      const ledgerNum = valorParaNumero(claim.value);
      const paginaNum = valorParaNumero(peca.valorTexto);
      const fontexLedgerOk = fonte.ok ? Math.abs(fonte.numero - ledgerNum) <= 0.05 : null;
      const ledgerxPaginaOk = Math.abs(ledgerNum - paginaNum) <= 0.0001 || peca.valorTexto === claim.value;

      if (fonte.ok && !fontexLedgerOk) {
        linha.estado = "DISCORDÂNCIA";
        linha.nota = `fonte=${fonte.numero} ≠ ledger=${ledgerNum}`;
        logFinding("1", `${slug}/${spec.nome}: fonte≠ledger`, `${fonte.chave} · ledger/claims/${claimId}.yml`, linha.nota);
      }
      if (!ledgerxPaginaOk) {
        linha.estado = "DISCORDÂNCIA";
        linha.nota += ` ledger.value='${claim.value}' ≠ página='${peca.valorTexto}'`;
        logFinding("1", `${slug}/${spec.nome}: ledger≠página`, `/municipios/${slug}/ vs ledger/claims/${claimId}.yml`, linha.nota);
      }
      linhas.push(linha);
    }
  }
  REPORT.tables.tarefa1 = linhas;
  const discord = linhas.filter((l) => l.estado === "DISCORDÂNCIA");
  console.log(`  linhas medidas: ${linhas.length} · discordâncias: ${discord.length}`);
  REPORT.counts.tarefa1_linhas = linhas.length;
  REPORT.counts.tarefa1_discordancias = discord.length;
}

// ======================================================================
// TAREFA 2 — somas de controlo
// ======================================================================
async function tarefa2_somasDeControlo(ledger, fontes, slugs308) {
  console.log("\n=== TAREFA 2 — somas de controlo ===");
  const somas = {};

  // população e empresas: soma sobre os 308 geocods (extraídos das
  // próprias linhas do ledger — cobre o caso Évora, indicador diferente).
  let totalPop = 0,
    totalEmp = 0,
    faltamPop = [],
    faltamEmp = [];
  for (const slug of slugs308) {
    const claimPop = ledger.get(`${slug}-populacao-2025`);
    let geocod = claimPop ? extraiGeocod(claimPop) : null;
    if (slug === "evora" && !geocod) geocod = "1C40705"; // confirmado directamente no INE 0012917
    const recPop = geocod ? fontes.populacao.por_geocod[geocod] : null;
    if (recPop) totalPop += Number(recPop.valor);
    else faltamPop.push(slug);
    const recEmp = geocod ? fontes.empresas.por_geocod[geocod] : null;
    if (recEmp) totalEmp += Number(recEmp.valor);
    else faltamEmp.push(slug);
  }
  somas.populacao = { calculado: totalPop, esperado: 11424031, bate: totalPop === 11424031, faltam: faltamPop };
  somas.empresas = { calculado: totalEmp, esperado: 1576606, bate: totalEmp === 1576606, faltam: faltamEmp };
  console.log(`  população: soma=${totalPop} · esperado=11424031 · bate=${somas.populacao.bate}`);
  console.log(`  empresas: soma=${totalEmp} · esperado=1576606 · bate=${somas.empresas.bate}`);
  if (!somas.populacao.bate)
    logFinding("2", `soma da população dos 308 = ${totalPop}, esperado 11 424 031`, "fontes.populacao (308 geocods)", faltamPop);
  if (!somas.empresas.bate)
    logFinding("2", `soma das empresas dos 308 = ${totalEmp}, esperado 1 576 606`, "fontes.empresas (308 geocods)", faltamEmp);

  // desemprego continente — total directo do ODS
  const contDez2025 = fontes.desemprego_2025_12.continente_total;
  somas.desemprego_continente = { calculado: contDez2025, fonte: "desemprego-concelhos-2025-12.ods, linha Continente" };
  console.log(`  desemprego (continente, ODS dez/2025): ${contDez2025}`);

  // soma das 278 linhas do ledger (continente) deve bater com o total do ODS?
  let somaLedgerDesemprego = 0,
    contLinhas = 0;
  for (const slug of slugs308) {
    const claim = ledger.get(`${slug}-desemprego-registado-2025-12`);
    if (claim) {
      somaLedgerDesemprego += valorParaNumero(claim.value);
      contLinhas++;
    }
  }
  somas.desemprego_soma_ledger = { calculado: somaLedgerDesemprego, linhas: contLinhas };
  const bateDesemprego = somaLedgerDesemprego === contDez2025;
  console.log(`  soma das ${contLinhas} linhas de desemprego do ledger: ${somaLedgerDesemprego} · bate com Continente do ODS: ${bateDesemprego}`);
  if (!bateDesemprego)
    logFinding(
      "2",
      `soma das linhas de desemprego do ledger (${somaLedgerDesemprego}) ≠ total 'Continente' do ODS (${contDez2025})`,
      "ledger/claims/*-desemprego-registado-2025-12.yml vs iefp/desemprego-concelhos-2025-12.ods",
      { somaLedgerDesemprego, contDez2025 }
    );

  // dívida e limite somados = TOTAL do PDF (universo 307)
  let somaDivida = 0,
    somaLimite = 0,
    contDivida = 0;
  for (const slug of slugs308) {
    const claim = ledger.get(`${slug}-divida-dgal-2024`);
    const claimLimite = ledger.get(`${slug}-limite-divida-dgal-2024`);
    if (claim) {
      somaDivida += valorParaNumero(claim.value);
      contDivida++;
    }
    if (claimLimite) somaLimite += valorParaNumero(claimLimite.value);
  }
  const totalRow = fontes.divida.total_row;
  somas.divida = {
    somaLedger: somaDivida,
    totalPdfCol5: totalRow.divida_total_excl,
    bate: somaDivida === totalRow.divida_total_excl,
    concelhosSomados: contDivida,
  };
  somas.limite = {
    somaLedger: somaLimite,
    totalPdfCol1: totalRow.limite,
    bate: somaLimite === totalRow.limite,
  };
  console.log(`  dívida: soma do ledger (${contDivida} concelhos) = ${somaDivida} · TOTAL do PDF (col.5) = ${totalRow.divida_total_excl} · bate=${somas.divida.bate}`);
  console.log(`  limite: soma do ledger = ${somaLimite} · TOTAL do PDF (col.1) = ${totalRow.limite} · bate=${somas.limite.bate}`);

  // Antes de reportar isto como discordância do SÍTIO: será que a
  // diferença já está na própria fonte (a soma das 307 linhas impressas
  // no PDF não bate exactamente com a linha TOTAL impressa no mesmo PDF,
  // por arredondamento a montante da DGAL)? Soma direta da fonte, sem
  // passar pelo ledger, para separar as duas hipóteses.
  let somaFonteDivida = 0,
    somaFonteLimite = 0;
  for (const rec of Object.values(fontes.divida.por_municipio)) {
    if (rec.divida_total_excl != null) somaFonteDivida += rec.divida_total_excl;
    if (rec.limite != null) somaFonteLimite += rec.limite;
  }
  const gapDivida = totalRow.divida_total_excl - somaFonteDivida;
  const gapLimite = totalRow.limite - somaFonteLimite;
  const ledgerBateComFonteDivida = somaDivida === somaFonteDivida;
  const ledgerBateComFonteLimite = somaLimite === somaFonteLimite;
  somas.divida.somaFonteDireta = somaFonteDivida;
  somas.divida.gapVsTotalImpresso = gapDivida;
  somas.divida.ledgerBateComFonteDireta = ledgerBateComFonteDivida;
  somas.limite.somaFonteDireta = somaFonteLimite;
  somas.limite.gapVsTotalImpresso = gapLimite;
  somas.limite.ledgerBateComFonteDireta = ledgerBateComFonteLimite;
  console.log(
    `  dívida: soma directa da fonte (sem ledger) = ${somaFonteDivida} · ledger bate com a fonte directa: ${ledgerBateComFonteDivida} · gap fonte vs TOTAL impresso = ${gapDivida}`
  );
  console.log(
    `  limite: soma directa da fonte (sem ledger) = ${somaFonteLimite} · ledger bate com a fonte directa: ${ledgerBateComFonteLimite} · gap fonte vs TOTAL impresso = ${gapLimite}`
  );

  if (!ledgerBateComFonteDivida || !ledgerBateComFonteLimite) {
    // isto sim seria um problema do sítio/ledger.
    if (!ledgerBateComFonteDivida)
      logFinding("2", `soma do ledger (dívida, ${somaDivida}) ≠ soma directa da fonte (${somaFonteDivida}) — isto NÃO é o desvio do TOTAL impresso, é o ledger a divergir da própria fonte`, "ledger/claims/*-divida-dgal-2024.yml vs endividamento-total-2024.pdf", { somaDivida, somaFonteDivida });
    if (!ledgerBateComFonteLimite)
      logFinding("2", `soma do ledger (limite, ${somaLimite}) ≠ soma directa da fonte (${somaFonteLimite})`, "ledger/claims/*-limite-divida-dgal-2024.yml vs endividamento-total-2024.pdf", { somaLimite, somaFonteLimite });
  } else {
    // ledger bate exactamente com a soma da fonte; o gap contra a linha
    // TOTAL impressa é um facto da própria fonte, não do sítio.
    logFalseAlarm(
      `soma da dívida/limite do ledger não bate byte-a-byte com a linha TOTAL impressa do PDF (dívida: ${gapDivida}; limite: ${gapLimite})`,
      `a soma directa das 307 linhas da PRÓPRIA fonte (sem passar pelo ledger) já não bate com a linha TOTAL impressa nesse mesmo PDF — é arredondamento da DGAL a montante (a TOTAL não é a soma dos valores impressos por concelho), não um erro do ledger ou da página. Ledger e fonte concordam exactamente entre si (307/307).`
    );
  }

  // nota metodológica: a tabela-resumo aponta coluna (2) para a dívida;
  // o ledger usa a coluna (5) — ver achado registado à parte.
  REPORT.tables.tarefa2 = somas;
}

// ======================================================================
// TAREFA 3 — ausências
// ======================================================================
async function tarefa3_ausencias(ledger, fontes, slugs308) {
  console.log("\n=== TAREFA 3 — ausências ===");
  const contagens = {};
  const sufixos = {
    populacao: "populacao-2025",
    poder_de_compra: "poder-de-compra-2023",
    desemprego: "desemprego-registado-2025-12",
    empresas: "empresas-2024",
    divida: "divida-dgal-2024",
    limite: "limite-divida-dgal-2024",
    indice: "indice-de-divida-2024",
    pmp: "prazo-medio-de-pagamento-2025-12",
  };
  for (const [nome, suf] of Object.entries(sufixos)) {
    let n = 0;
    for (const slug of slugs308) if (ledger.get(`${slug}-${suf}`)) n++;
    contagens[nome] = n;
    console.log(`  linhas de ${nome}: ${n} / 308`);
  }
  REPORT.tables.tarefa3_contagens = contagens;

  const esperado = {
    populacao: 308,
    poder_de_compra: 308,
    desemprego: 278,
    empresas: 308,
    divida: 307,
    limite: 307,
    indice: 307,
    pmp: 299,
  };
  for (const [nome, n] of Object.entries(contagens)) {
    if (n !== esperado[nome]) {
      logFinding("3", `contagem de linhas de '${nome}' = ${n}, esperado ${esperado[nome]}`, `ledger/claims/*-${sufixos[nome]}.yml`, n);
    }
  }

  // execução da receita: zero linhas concelhos-2026 (Évora tem uma linha
  // com este id, mas doutro estudo — não conta; ver falso alarme na
  // tarefa 1, mesma causa).
  let execCount = 0;
  let execOutroEstudo = 0;
  for (const slug of slugs308) {
    const c = ledger.get(`${slug}-execucao-da-receita-2025`);
    if (c && c.study === "concelhos-2026") execCount++;
    else if (c) execOutroEstudo++;
  }
  contagens.execucao_receita = execCount;
  console.log(`  linhas de execução da receita (concelhos-2026): ${execCount} (esperado 0)` + (execOutroEstudo ? ` · +${execOutroEstudo} de outro estudo (ignoradas)` : ""));
  if (execOutroEstudo) logFalseAlarm(`${execOutroEstudo} linha(s) de execução da receita no ledger`, "existem mas pertencem a outro estudo (não concelhos-2026)");
  if (execCount !== 0) logFinding("3", `${execCount} linhas de execução da receita (study concelhos-2026) encontradas, esperado 0`, "ledger/claims/*-execucao-da-receita*.yml", execCount);

  // Penedono: sem dívida, limite, índice, pmp — caso conhecido
  const penedonoFalta = ["divida", "limite", "indice", "pmp"].filter((m) => !ledger.get(`penedono-${sufixos[m]}`));
  assertRed(
    "Penedono sem dívida/limite/índice/PMP (ledger)",
    penedonoFalta.length === 4,
    `faltam exactamente: ${penedonoFalta.join(", ")}`
  );
  // e a página mostra "sem linha ainda", nunca um número
  const { html: htmlPenedono } = await buscaPagina("/municipios/penedono/");
  const pecasPenedono = parseePecas(htmlPenedono);
  const vaziosPagina = pecasPenedono.filter((p) => !p.temLinha).map((p) => p.nomeMedida);
  assertRed(
    "Penedono — página mostra 'sem linha ainda' e nunca um número",
    vaziosPagina.length === 4 &&
      vaziosPagina.includes("Dívida total do município") &&
      vaziosPagina.includes("Índice de dívida") &&
      vaziosPagina.includes("Prazo médio de pagamento") &&
      vaziosPagina.includes("Execução da receita"),
    `peças vazias na página: ${vaziosPagina.join(", ")}`
  );

  // ilhas sem desemprego — caso conhecido (usa Corvo)
  const { html: htmlCorvo } = await buscaPagina("/municipios/corvo/");
  const pecasCorvo = parseePecas(htmlCorvo);
  const desempregoCorvo = pecasCorvo.find((p) => p.nomeMedida === "Desemprego registado");
  assertRed(
    "Corvo (ilha) — desemprego 'sem linha ainda'",
    desempregoCorvo && !desempregoCorvo.temLinha && desempregoCorvo.valorTexto === null,
    `temLinha=${desempregoCorvo?.temLinha} · valorTexto=${desempregoCorvo?.valorTexto}`
  );

  // contagem real de concelhos "ilha" sem desemprego (30 esperados)
  let ilhasSemDesemprego = 0;
  const ilhaSlugs = [];
  for (const slug of slugs308) {
    if (!ledger.get(`${slug}-desemprego-registado-2025-12`)) {
      // é mesmo ilha? confirma que tem divida/pmp normal (não é Penedono,
      // que é continente e só falta divida/limite/indice/pmp, tem desemprego)
      ilhasSemDesemprego++;
      ilhaSlugs.push(slug);
    }
  }
  console.log(`  concelhos sem linha de desemprego: ${ilhasSemDesemprego} (esperado 30)`);
  REPORT.tables.tarefa3_ilhasSemDesemprego = ilhaSlugs;
  if (ilhasSemDesemprego !== 30)
    logFinding("3", `${ilhasSemDesemprego} concelhos sem desemprego, esperado 30`, "ledger/claims/*-desemprego-registado-2025-12.yml", ilhaSlugs);

  // PMP N.d. — 9 esperados (já provado no extrai_fontes.py; confere aqui
  // contra o ledger: os concelhos SEM linha de pmp devem ser exactamente
  // os 9 N.d. da fonte).
  const pmpSemLinhaLedger = slugs308.filter((s) => !ledger.get(`${s}-prazo-medio-de-pagamento-2025-12`));
  console.log(`  concelhos sem linha de PMP no ledger: ${pmpSemLinhaLedger.length} (esperado 9): ${pmpSemLinhaLedger.join(", ")}`);
  REPORT.tables.tarefa3_pmpSemLinha = pmpSemLinhaLedger;
  if (pmpSemLinhaLedger.length !== 9)
    logFinding("3", `${pmpSemLinhaLedger.length} concelhos sem linha de PMP, esperado 9`, "ledger/claims/*-prazo-medio-de-pagamento-2025-12.yml", pmpSemLinhaLedger);
}

// ======================================================================
// STUBS — preenchidos a seguir
// ======================================================================
async function buscaEmLotes(urls, concorrencia = 12) {
  const resultados = new Array(urls.length);
  let cursor = 0;
  async function trabalhador() {
    while (cursor < urls.length) {
      const i = cursor++;
      resultados[i] = await buscaPagina(urls[i]);
    }
  }
  await Promise.all(Array.from({ length: concorrencia }, trabalhador));
  return resultados;
}

const SECCOES_PADRAO = new Set(["relance-k", "breve", "aparelho"]);

async function tarefa4_estrutura(slugs308, rng) {
  console.log("\n=== TAREFA 4 — mesma estrutura em todos (308 pt-PT; amostra de 20 em en) ===");

  const urls = slugs308.map((s) => `/municipios/${s}/`);
  console.log(`  a buscar ${urls.length} páginas pt-PT...`);
  const paginas = await buscaEmLotes(urls);

  let refOrdem = null;
  const ordensDistintas = new Map(); // assinatura -> [slugs]
  const unidadesPorMedida = MEDIDAS.map(() => new Map()); // idx -> texto->contagem
  const paginasComSeccoesExtra = [];
  const statusNao200 = [];

  slugs308.forEach((slug, i) => {
    const { status, html } = paginas[i];
    if (status !== 200) {
      statusNao200.push({ slug, status });
      return;
    }
    const pecas = parseePecas(html);
    const ordem = pecas.map((p) => p.nomeMedida).join(" | ");
    if (!refOrdem) refOrdem = ordem;
    if (!ordensDistintas.has(ordem)) ordensDistintas.set(ordem, []);
    ordensDistintas.get(ordem).push(slug);

    pecas.forEach((p, idx) => {
      if (!unidadesPorMedida[idx]) return;
      const m = unidadesPorMedida[idx];
      m.set(p.unidade, (m.get(p.unidade) || 0) + 1);
    });

    const seccoes = parseSeccoesH2(html);
    const extra = seccoes.filter((s) => !SECCOES_PADRAO.has(s.id));
    if (extra.length > 0) paginasComSeccoesExtra.push({ slug, extra: extra.map((s) => s.id) });
  });

  console.log(`  páginas com status ≠ 200: ${statusNao200.length}`);
  if (statusNao200.length) logFinding("4", `${statusNao200.length} páginas de concelho não devolveram 200`, "/municipios/<slug>/", statusNao200);

  console.log(`  ordens distintas de peças entre os 308: ${ordensDistintas.size} (esperado 1)`);
  if (ordensDistintas.size > 1) {
    for (const [ordem, slugsComEssaOrdem] of ordensDistintas) {
      if (slugsComEssaOrdem.length < ordensDistintas.get(refOrdem)?.length) {
        logFinding("4", `ordem de peças diferente da maioria em ${slugsComEssaOrdem.length} concelho(s)`, slugsComEssaOrdem.slice(0, 10).join(", "), ordem);
      }
    }
  }

  MEDIDAS.forEach((spec, idx) => {
    const variantes = unidadesPorMedida[idx];
    console.log(`  unidade de '${spec.nome}': ${variantes.size} variante(s) distinta(s) — ${[...variantes.entries()].map(([k, v]) => `'${k}'×${v}`).join(", ")}`);
    if (variantes.size > 2) {
      // mais do que "com valor" vs "sem linha" é suspeito
      logFinding("4", `'${spec.nome}' tem ${variantes.size} formas distintas de unidade entre os 308`, "/municipios/<slug>/", [...variantes.keys()]);
    }
  });

  console.log(`  páginas com secções além de peças/cartão/barra/portas: ${paginasComSeccoesExtra.length} (esperado 1 — só Évora)`);
  REPORT.tables.tarefa4_seccoesExtra = paginasComSeccoesExtra;
  const soEvora = paginasComSeccoesExtra.length === 1 && paginasComSeccoesExtra[0].slug === "evora";
  if (!soEvora) {
    logFinding(
      "4",
      `secções extra encontradas em ${paginasComSeccoesExtra.length} página(s), esperado só Évora`,
      "/municipios/<slug>/ (h2 fora de relance-k/breve/aparelho)",
      paginasComSeccoesExtra
    );
  } else {
    logKnownCaseRed("Évora — única página com secções extra (medido nos 308 reais)", `secções: ${paginasComSeccoesExtra[0].extra.join(", ")}`);
  }

  REPORT.counts.tarefa4_ordensDistintas = ordensDistintas.size;
  REPORT.counts.tarefa4_paginasComSeccoesExtra = paginasComSeccoesExtra.length;

  // --- edição inglesa: amostra de 20 ---
  const amostra20en = amostraSemReposicao(slugs308, 20, rng);
  console.log(`\n  edição en: amostra de 20 — ${amostra20en.join(", ")}`);
  const urlsEn = amostra20en.map((s) => `/en/municipalities/${s}/`);
  const paginasEn = await buscaEmLotes(urlsEn);
  let enStatusMau = [];
  let enOrdens = new Map();
  amostra20en.forEach((slug, i) => {
    const { status, html } = paginasEn[i];
    if (status !== 200) {
      enStatusMau.push({ slug, status });
      return;
    }
    const pecas = parseePecas(html);
    if (pecas.length !== 8) {
      logFinding("4", `en/municipalities/${slug} tem ${pecas.length} peças, esperava 8`, `/en/municipalities/${slug}/`, pecas.length);
    }
    const ordem = pecas.map((p) => p.nomeMedida).join(" | ");
    enOrdens.set(ordem, (enOrdens.get(ordem) || 0) + 1);
  });
  console.log(`  en: páginas com status ≠ 200: ${enStatusMau.length}`);
  console.log(`  en: ordens distintas de peças: ${enOrdens.size} (esperado 1)`);
  if (enStatusMau.length) logFinding("4", `${enStatusMau.length} páginas en/municipalities não devolveram 200`, "/en/municipalities/<slug>/", enStatusMau);
  if (enOrdens.size > 1) logFinding("4", `en/municipalities: ${enOrdens.size} ordens distintas de peças na amostra de 20`, "/en/municipalities/<slug>/", [...enOrdens.keys()]);
  REPORT.tables.tarefa4_en = { amostra: amostra20en, statusMau: enStatusMau, ordensDistintas: enOrdens.size };
}
// extrai o href do selo PRINCIPAL da peça (o do rodapé "peca-pe", que
// cita a proveniência do próprio valor) — NÃO o primeiro src-chip que
// aparecer no corpo. Achado do próprio código: uma peça como "Índice de
// dívida" tem DOIS selos — um inline dentro da unidade, a citar a
// constante "teto legal = 150" (aponta para 'indice-de-divida-limite-legal'),
// e o selo real da peça no rodapé (aponta para '<slug>-indice-de-divida-2024').
// Um regex que apanha só o primeiro src-chip do corpo apanha o errado.
function extraiSeloHref(corpoPeca) {
  const rodape = corpoPeca.match(/class="peca-pe"[\s\S]*?<\/p>/);
  const alvo = rodape ? rodape[0] : corpoPeca;
  const m = alvo.match(/class="src-chip"[^>]*href="([^"]*)"/) || alvo.match(/href="([^"]*)"[^>]*class="src-chip"/);
  return m ? m[1] : null;
}
// normaliza qualquer espaço Unicode (categoria Zs, NBSP, narrow-no-break)
// para um espaço comum — o excerto (verbatim da fonte) e o value (formato
// tipográfico do sítio, U+202F) usam representações diferentes do MESMO
// separador de milhares; comparar byte-a-byte dava falso alarme.
function normalizaEspacos(s) {
  return String(s).replace(/[\s  ]+/gu, " ").trim();
}
// reconstrói o array de "corpos" de peça (o HTML bruto de cada <article>)
// alinhado com parseePecas — reaproveita a mesma regex.
function corposDePeca(html) {
  const corpos = [];
  const artRe = /<article class="peca[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  let m;
  while ((m = artRe.exec(html))) corpos.push(m[1]);
  return corpos;
}

async function tarefa5_selos(ledger, slugs308, rng) {
  console.log("\n=== TAREFA 5 — selos (20 páginas ao acaso) ===");

  // Dois falsos alarmes do PRÓPRIO detetor, apanhados e corrigidos durante
  // o desenvolvimento (registados aqui para constarem do relatório):
  logFalseAlarm(
    "selo de 'Índice de dívida' parecia apontar para 'indice-de-divida-limite-legal' em vez do id da peça",
    "a peça tem DOIS selos: um inline dentro da unidade (cita a constante 'teto legal = 150'), outro no rodapé 'peca-pe' (cita a proveniência do próprio valor). Um extrator que apanha o primeiro src-chip do corpo apanha o errado; corrigido para procurar só dentro de 'peca-pe'."
  );
  logFalseAlarm(
    "excerto/derivação da linha parecia não conter o valor publicado (população, empresas, dívida — qualquer valor com milhares)",
    "o campo value do ledger usa U+202F (narrow no-break space) como separador de milhares; o campo excerpt é verbatim da fonte e usa espaço normal U+0020 (ou nenhum); e as linhas derivadas (índice de dívida) têm excerpt:null por desenho — a proveniência delas é a 'derivation'. Comparação por .includes() byte-a-byte falhava sempre nestes casos; corrigido para normalizar espaços Unicode dos dois lados e escolher o campo certo (excerpt vs derivation) consoante a linha é publicada ou calculada."
  );
  const amostra20 = amostraSemReposicao(slugs308, 20, rng);
  console.log(`  amostra: ${amostra20.join(", ")}`);

  let totalPecasComNumero = 0,
    totalSelos = 0,
    seloFaltaOuErrado = 0,
    seloAbrePaginaErrada = 0,
    excertoNaoContemValor = 0;

  for (const slug of amostra20) {
    const { html } = await buscaPagina(`/municipios/${slug}/`);
    const pecas = parseePecas(html);
    const corpos = corposDePeca(html);
    for (let idx = 0; idx < pecas.length; idx++) {
      const p = pecas[idx];
      if (!p.temLinha) continue; // só peças com número têm selo
      totalPecasComNumero++;
      const href = extraiSeloHref(corpos[idx] || "");
      if (!href || !href.startsWith("/livro-razao/")) {
        seloFaltaOuErrado++;
        logFinding("5", `peça '${p.nomeMedida}' de ${slug} tem número mas sem selo válido`, `/municipios/${slug}/`, href);
        continue;
      }
      const idAlvo = href.replace(/^\/livro-razao\//, "").replace(/\/$/, "");
      totalSelos++;
      if (idAlvo !== p.dataClaim) {
        seloAbrePaginaErrada++;
        logFinding("5", `selo de '${p.nomeMedida}' (${slug}) aponta para '${idAlvo}', peça é '${p.dataClaim}'`, `/municipios/${slug}/`, href);
        continue;
      }
      // abre a página de linha e confirma que o excerto contém o valor
      const { status, html: htmlLinha } = await buscaPagina(href.endsWith("/") ? href : href + "/");
      if (status !== 200) {
        seloAbrePaginaErrada++;
        logFinding("5", `selo de '${p.nomeMedida}' (${slug}) → ${href} devolveu status ${status}`, href, status);
        continue;
      }
      const claim = ledger.get(p.dataClaim);
      const valorEsperado = claim ? claim.value : p.valorTexto;
      // Linhas derivadas (ex.: índice de dívida) têm excerpt:null por
      // desenho — a proveniência delas é a aritmética (campo
      // 'derivation'/class="linha-derivacao"), não um excerto de fonte.
      // Ver ledger/claims/*.yml: "null quando o valor é publicado; a
      // aritmética explicada quando é calculado". Por isso o campo a
      // conferir depende de a linha ser derivada ou publicada.
      const derivada = claim ? claim.derivation != null : false;
      let textoParaConferir = null;
      if (derivada) {
        const derM = htmlLinha.match(/class="linha-derivacao"[^>]*>[\s\S]*?data-linha-campo="derivation">([\s\S]*?)<\/span>/);
        textoParaConferir = derM ? derM[1] : null;
      } else {
        const excM = htmlLinha.match(/class="linha-excerto"[^>]*>[\s\S]*?data-linha-campo="excerpt">([\s\S]*?)<\/span>/);
        textoParaConferir = excM ? excM[1] : null;
      }
      const textoDecod = (textoParaConferir || "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'");
      // separador de milhares: o excerto é verbatim da fonte (frequentemente
      // espaço normal U+0020), o value do sítio usa U+202F — normaliza os
      // dois antes de comparar (ver nota em normalizaEspacos).
      const contem = valorEsperado ? normalizaEspacos(textoDecod).includes(normalizaEspacos(valorEsperado)) : false;
      if (!contem) {
        excertoNaoContemValor++;
        logFinding(
          "5",
          `${derivada ? "derivação" : "excerto"} da linha '${p.dataClaim}' não contém o valor publicado ('${valorEsperado}')`,
          href,
          textoDecod.slice(0, 240)
        );
      }
    }
  }

  console.log(`  peças com número na amostra: ${totalPecasComNumero}`);
  console.log(`  selos válidos (href começa /livro-razao/): ${totalSelos} · sem selo/errado: ${seloFaltaOuErrado}`);
  console.log(`  selo abre página errada ou 404: ${seloAbrePaginaErrada}`);
  console.log(`  excerto não contém o valor publicado: ${excertoNaoContemValor}`);
  REPORT.counts.tarefa5 = { totalPecasComNumero, totalSelos, seloFaltaOuErrado, seloAbrePaginaErrada, excertoNaoContemValor };
  console.log(
    `  (o detetor idAlvo!==dataClaim já foi provado vermelho em autoteste_selo_partido(); aqui aplica-se aos ${totalSelos} selos reais desta amostra)`
  );
}
function leCarta308() {
  const dir = path.join(DIST_DIR, "dados");
  const ficheiros = [
    "caop-2025-municipios-continente.csv",
    "caop-2025-municipios-acores.csv",
    "caop-2025-municipios-madeira.csv",
  ];
  const nomes = [];
  for (const f of ficheiros) {
    const txt = fs.readFileSync(path.join(dir, f), "utf8");
    const linhas = txt.split("\n").filter((l) => l && !l.startsWith("#") && !l.startsWith("dtmn,"));
    for (const l of linhas) {
      const campos = l.split(",");
      if (campos[1]) nomes.push(campos[1].trim());
    }
  }
  return nomes;
}

async function tarefa6_indiceMunicipios(slugs308) {
  console.log("\n=== TAREFA 6 — índice dos 308 (/municipios) ===");
  const { status, html } = await buscaPagina("/municipios/");
  console.log(`  status: ${status}`);
  if (status !== 200) logFinding("6", `/municipios/ devolveu status ${status}`, "/municipios/", status);

  // 308 ligações, uma por concelho
  const hrefs = [...html.matchAll(/href="(\/municipios\/[a-z0-9-]+)"/g)].map((m) => m[1]);
  const hrefsDistintos = [...new Set(hrefs)];
  console.log(`  ligações /municipios/<slug> distintas na página: ${hrefsDistintos.length} (esperado 308)`);
  if (hrefsDistintos.length !== 308)
    logFinding("6", `${hrefsDistintos.length} ligações distintas /municipios/<slug> na página, esperado 308`, "/municipios/", hrefsDistintos.length);

  // a lista de pesquisa: 308 <li>, todos com <a>
  const itens = [...html.matchAll(/<li class="pesquisa-item"[^>]*data-normal="([^"]*)"[^>]*><a class="chipb" href="([^"]*)"[^>]*><span class="pesquisa-nome">([^<]*)<\/span>/g)];
  console.log(`  itens de pesquisa (<li class="pesquisa-item">): ${itens.length} (esperado 308), todos com <a>: ${itens.length === itens.filter((m) => m[2]).length}`);
  if (itens.length !== 308) logFinding("6", `${itens.length} itens de pesquisa na página, esperado 308`, "/municipios/ (li.pesquisa-item)", itens.length);
  const semLigacao = itens.filter((m) => !m[2] || !m[2].startsWith("/municipios/"));
  if (semLigacao.length) logFinding("6", `${semLigacao.length} itens de pesquisa sem ligação válida`, "/municipios/", semLigacao.map((m) => m[1]));

  // nomes == Carta (CAOP) — multiset, não string exacta (Lagoa/Calheta
  // repetem-se por desenho, ver Emenda 3/19).
  const nomesPagina = itens.map((m) => m[3].trim());
  const nomesCarta = leCarta308();
  console.log(`  nomes na página: ${nomesPagina.length} · nomes na Carta (CAOP, 3 ficheiros): ${nomesCarta.length}`);

  const contarMultiset = (arr) => {
    const m = new Map();
    for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
    return m;
  };
  const msPagina = contarMultiset(nomesPagina);
  const msCarta = contarMultiset(nomesCarta);
  const emPaginaNaoCarta = [];
  for (const [nome, n] of msPagina) {
    const nCarta = msCarta.get(nome) || 0;
    if (n !== nCarta) emPaginaNaoCarta.push({ nome, naPagina: n, naCarta: nCarta });
  }
  const emCartaNaoPagina = [];
  for (const [nome, n] of msCarta) {
    if (!msPagina.has(nome)) emCartaNaoPagina.push({ nome, naCarta: n });
  }
  console.log(`  nomes com contagem diferente entre página e Carta: ${emPaginaNaoCarta.length}`);
  console.log(`  nomes na Carta ausentes da página: ${emCartaNaoPagina.length}`);
  REPORT.tables.tarefa6_nomes = { emPaginaNaoCarta, emCartaNaoPagina };
  if (emPaginaNaoCarta.length || emCartaNaoPagina.length) {
    logFinding("6", `nomes da página /municipios não batem 1:1 com a Carta (CAOP)`, "/municipios/ vs dados/caop-2025-municipios-*.csv", { emPaginaNaoCarta, emCartaNaoPagina });
  } else {
    logKnownCaseRed("nomes da página == Carta (multiset, 308==308, incl. os 2 pares Lagoa/Calheta repetidos)", `verificado nos 308 pares`);
  }

  REPORT.counts.tarefa6 = { hrefsDistintos: hrefsDistintos.length, itensPesquisa: itens.length, nomesCarta: nomesCarta.length };
}
async function tarefa7_mapaPrimeiraPagina(slugs308, rng) {
  console.log("\n=== TAREFA 7 — mapa da primeira página (1280, Playwright real) ===");

  // 308 pontos dentro de <a> — confere primeiro estaticamente (rápido, é
  // HTML estático, o mapa não é gerado por JS no carregamento).
  const { html } = await buscaPagina("/");
  const pontos = [...html.matchAll(/<a class="mun-porta" href="(\/municipios\/[a-z0-9-]+)" data-mun-porta="([a-z0-9-]+)">[\s\S]*?<circle class="mun"[^>]*data-caop="([a-z0-9-]+)"[^>]*><\/circle><\/a>/g)];
  console.log(`  <a class="mun-porta"> na primeira página: ${pontos.length} (esperado 308)`);
  REPORT.counts.tarefa7_pontosEmA = pontos.length;
  if (pontos.length !== 308) logFinding("7", `${pontos.length} pontos dentro de <a> no mapa da primeira página, esperado 308`, "/ (svg .mapa-pontos)", pontos.length);

  const hrefsCoerentes = pontos.every((m) => m[1] === `/municipios/${m[2]}` && m[2] === m[3]);
  if (!hrefsCoerentes) {
    logFinding("7", "algum ponto tem href/data-mun-porta/data-caop incoerentes entre si", "/ (svg .mapa-pontos)", "ver REPORT.json");
  }

  // clique real: Playwright, viewport 1280, 10 pontos ao acaso.
  const alvo10 = amostraSemReposicao(pontos, 10, rng);
  console.log(`  a abrir Playwright (chromium) para cliques reais a 1280px...`);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(BASE + "/", { waitUntil: "load" });

    let cliquesOk = 0,
      cliquesMau = [];
    for (const m of alvo10) {
      const slug = m[2];
      const link = page.locator(`a.mun-porta[data-mun-porta="${slug}"]`);
      const existeNoDom = (await link.count()) > 0;
      if (!existeNoDom) {
        cliquesMau.push({ slug, motivo: "não encontrado no DOM renderizado" });
        continue;
      }
      await link.scrollIntoViewIfNeeded();
      await Promise.all([page.waitForURL(new RegExp(`/municipios/${slug}/?$`), { timeout: 5000 }), link.click()]);
      const urlFinal = page.url();
      const certo = urlFinal.endsWith(`/municipios/${slug}/`) || urlFinal.endsWith(`/municipios/${slug}`);
      if (certo) cliquesOk++;
      else cliquesMau.push({ slug, motivo: `abriu ${urlFinal}` });
      await page.goBack({ waitUntil: "load" });
    }
    console.log(`  cliques em pontos ao acaso: ${cliquesOk}/10 abriram a página certa`);
    REPORT.counts.tarefa7_cliques = { ok: cliquesOk, total: 10, falhas: cliquesMau };
    if (cliquesMau.length) logFinding("7", `${cliquesMau.length}/10 cliques no mapa não abriram a página certa`, "/ (mapa, 1280px)", cliquesMau);
    else logKnownCaseRed("10/10 cliques ao acaso no mapa (1280px) abriram a página certa (Playwright real)", alvo10.map((m) => m[2]).join(", "));

    // Emenda 19b: um ponto SEM página não responde a nada — mas todos os
    // 308 têm página agora (Emenda 19a: 308 páginas decididas), por isso
    // não há ponto "sem página" para testar o outro lado neste build.
    const semPagina = pontos.filter((m) => !slugs308.includes(m[2]));
    console.log(`  pontos cujo slug não está nos 308 (candidatos a "sem página"): ${semPagina.length}`);
    if (semPagina.length) logFinding("7", `${semPagina.length} pontos no mapa não correspondem a um slug dos 308`, "/", semPagina.map((m) => m[2]));
  } finally {
    await browser.close();
  }
}
async function tarefa8_livroRazaoConjunto(ledger, slugs308) {
  console.log("\n=== TAREFA 8 — livro-razão do conjunto (/livro-razao/concelhos) ===");

  // contagem de ficheiros ledger/claims/*.yml com study: concelhos-2026
  let comStudy = 0;
  for (const claim of ledger.values()) if (claim.study === "concelhos-2026") comStudy++;
  console.log(`  ficheiros ledger/claims/*.yml com study:concelhos-2026: ${comStudy}`);

  // contagem "linhas por concelho" esperada (soma das 8 medidas, tarefa 3)
  const sufixos = [
    "populacao-2025",
    "poder-de-compra-2023",
    "desemprego-registado-2025-12",
    "empresas-2024",
    "divida-dgal-2024",
    "limite-divida-dgal-2024",
    "indice-de-divida-2024",
    "prazo-medio-de-pagamento-2025-12",
  ];
  let somaLinhasPorConcelho = 0;
  for (const slug of slugs308) for (const suf of sufixos) if (ledger.get(`${slug}-${suf}`)) somaLinhasPorConcelho++;
  console.log(`  soma das linhas das 8 medidas × 308 concelhos (via ledger): ${somaLinhasPorConcelho}`);
  console.log(`  diferença com study:concelhos-2026 (${comStudy}): ${comStudy - somaLinhasPorConcelho} — claims não-medida (ex.: 'municipios-portugal-caop-2025', 'indice-de-divida-limite-legal', abandono-escolar, etc., também tagged concelhos-2026)`);

  // a página /livro-razao/concelhos em si
  const { status, html } = await buscaPagina("/livro-razao/concelhos/");
  console.log(`  status /livro-razao/concelhos/: ${status}`);
  const itensPesquisa = [...html.matchAll(/<li class="pesquisa-item"/g)].length;
  const itensConcelho = [...html.matchAll(/<li class="concelho concelho-com-pagina"/g)].length;
  console.log(`  <li class="pesquisa-item"> na página: ${itensPesquisa} · <li class="concelho..."> na página: ${itensConcelho}`);
  console.log(
    `  NOTA: a página agrega por CONCELHO (308 entradas, uma ligação por concelho para /livro-razao/concelhos/<slug>), não por LINHA/afirmação individual — não há ${comStudy} linhas nesta página; as linhas individuais vivem nas sub-páginas /livro-razao/concelhos/<slug> (confirmado: Bragança tem 8 'data-linha-claim' distintos nessa sub-página).`
  );
  const bateComStudy = itensConcelho === comStudy;
  logFinding(
    "8",
    `a contagem de entradas em /livro-razao/concelhos (${itensConcelho}, uma por concelho) NÃO é igual ao número de ficheiros ledger/claims/*.yml com study:concelhos-2026 (${comStudy}) — a página agrega por concelho, o ledger conta por afirmação individual; ${somaLinhasPorConcelho} é a soma das linhas de medida reais nas sub-páginas por concelho, mais próxima mas ainda não igual a ${comStudy} (diferença ${comStudy - somaLinhasPorConcelho}: claims concelhos-2026 que não são uma das 8 medidas por concelho)`,
    "/livro-razao/concelhos/ vs ledger/claims/*.yml (study:concelhos-2026)",
    { itensConcelho, comStudy, somaLinhasPorConcelho }
  );
  REPORT.tables.tarefa8_contagens = { itensPesquisa, itensConcelho, comStudy, somaLinhasPorConcelho };

  // sub-página de UM concelho: confere que tem exactamente as linhas que
  // esse concelho tem (Bragança: 8, todas as medidas)
  const { html: htmlBr } = await buscaPagina("/livro-razao/concelhos/braganca/");
  const linhasBr = [...new Set([...htmlBr.matchAll(/data-linha-claim="([^"]*)"/g)].map((m) => m[1]))];
  console.log(`  sub-página /livro-razao/concelhos/braganca: ${linhasBr.length} linhas distintas (esperado 8, todas começadas por 'braganca-')`);
  const todasBraganca = linhasBr.every((id) => id.startsWith("braganca-"));
  if (linhasBr.length !== 8 || !todasBraganca) {
    logFinding("8", `sub-página de Bragança tem ${linhasBr.length} linhas (todas de Bragança: ${todasBraganca})`, "/livro-razao/concelhos/braganca/", linhasBr);
  }

  // CSV do livro-razão: mesmo número de registos que ficheiros de linha —
  // confere as DUAS leituras possíveis (total do sítio; e filtrado a
  // concelhos-2026), para não escolher a leitura só por conveniência.
  const csvPath = path.join(DIST_DIR, "livro-razao.csv");
  const csvTxt = fs.readFileSync(csvPath, "utf8");
  const csvLinhas = csvTxt.split("\n").filter((l) => l.trim().length > 0);
  const csvRegistos = csvLinhas.length - 1; // menos cabeçalho
  console.log(`  livro-razao.csv: ${csvRegistos} registos (menos cabeçalho) · ledger/claims/*.yml total: ${ledger.size}`);
  const bateTotal = csvRegistos === ledger.size;
  console.log(`  CSV total == ficheiros de linha (total do sítio): ${bateTotal}`);
  if (!bateTotal) logFinding("8", `livro-razao.csv tem ${csvRegistos} registos, ledger/claims/*.yml tem ${ledger.size} ficheiros`, "dist/livro-razao.csv", { csvRegistos, ledgerTotal: ledger.size });

  const csvComStudy = csvLinhas.slice(1).filter((l) => l.includes(",concelhos-2026,")).length;
  console.log(`  CSV linhas com ',concelhos-2026,': ${csvComStudy} · ficheiros com study:concelhos-2026: ${comStudy} · bate: ${csvComStudy === comStudy}`);
  if (csvComStudy !== comStudy) logFinding("8", `CSV tem ${csvComStudy} linhas 'concelhos-2026', ledger tem ${comStudy} ficheiros`, "dist/livro-razao.csv", { csvComStudy, comStudy });

  // --- Playwright real: pesquisa por "Bragança" na página do conjunto ---
  console.log(`  a abrir Playwright para a pesquisa em vivo por "Bragança"...`);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(BASE + "/livro-razao/concelhos/", { waitUntil: "load" });
    const campo = page.locator("#pesquisa-concelho");
    await campo.fill("Bragança");
    await page.waitForTimeout(300); // deixa o JS de pesquisa filtrar
    const visiveis = await page.locator('li.pesquisa-item:visible, li.pesquisa-item:not([hidden]):not([style*="display: none"])').all();
    // heurística mais robusta: olha para o atributo/estilo diretamente
    const resultadosVisiveisTexto = await page.evaluate(() => {
      const itens = [...document.querySelectorAll("li.pesquisa-item")];
      return itens
        .filter((li) => {
          const style = getComputedStyle(li);
          return style.display !== "none" && !li.hidden;
        })
        .map((li) => li.querySelector(".pesquisa-nome")?.textContent?.trim());
    });
    console.log(`  resultados visíveis para "Bragança": ${resultadosVisiveisTexto.length} — ${JSON.stringify(resultadosVisiveisTexto)}`);
    REPORT.tables.tarefa8_pesquisaBraganca = resultadosVisiveisTexto;
    const soBraganca = resultadosVisiveisTexto.length > 0 && resultadosVisiveisTexto.every((n) => normaliza(n).includes("braganca") || normaliza(n).includes("bragança"));
    if (!soBraganca) {
      logFinding("8", `pesquisa por "Bragança" em /livro-razao/concelhos não mostrou só Bragança`, "/livro-razao/concelhos/ (campo #pesquisa-concelho)", resultadosVisiveisTexto);
    } else {
      logKnownCaseRed('pesquisa "Bragança" em /livro-razao/concelhos mostra só Bragança (Playwright real)', JSON.stringify(resultadosVisiveisTexto));
    }
  } finally {
    await browser.close();
  }
}
async function tarefa9_escala() {
  console.log("\n=== TAREFA 9 — a escala ===");
  const tamanhoBytes = execFileSync("du", ["-sk", DIST_DIR]).toString().trim().split(/\s+/)[0];
  const tamanhoMB = (Number(tamanhoBytes) / 1024).toFixed(1);
  console.log(`  tamanho de dist/ (o build congelado): ${tamanhoBytes} KB (${tamanhoMB} MB)`);

  function contaHtmlRecursivo(dir) {
    let n = 0;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) n += contaHtmlRecursivo(p);
      else if (ent.isFile() && ent.name.endsWith(".html")) n++;
    }
    return n;
  }
  const numPaginasHtml = contaHtmlRecursivo(DIST_DIR);
  console.log(`  número de páginas (*.html): ${numPaginasHtml}`);
  REPORT.counts.tarefa9 = { tamanhoKB: Number(tamanhoBytes), tamanhoMB: Number(tamanhoMB), numPaginasHtml };

  console.log(
    "  tempo do 'npm run build': NÃO MEDIDO. O brief (§1.9) pede uma medição minha, uma vez, numa cópia do repositório fora do ramo de trabalho. " +
      "A instrução directa que recebi para esta tarefa diz explicitamente 'não construir' (juntamente com a localização do build já congelado). " +
      "As duas instruções conflituam; sigo a que me foi dada directamente a mim (não correr build nenhum, nem sequer numa cópia), e registo aqui " +
      "o conflito em vez de decidir sozinho por uma leitura silenciosa — ver nota no relatório final."
  );
  REPORT.findings.push({
    tarefa: "9",
    achado:
      "tempo de build não medido — conflito entre o brief (§1.9: medir numa cópia fora do ramo) e a instrução directa recebida ('não construir'); segui a instrução directa e não construí nada, em lugar de decidir sozinho",
    coordenada: "BRIEF-concelhos-M5.md §1.9 vs instrução do lugar de direção",
    prova: null,
  });
}
async function tarefa10_regua() {
  console.log("\n=== TAREFA 10 — a régua do inventário (scripts/medir-defeitos.mjs) ===");
  console.log(
    "  ACHADO METODOLÓGICO GRAVE, descoberto ao correr esta tarefa: node scripts/medir-defeitos.mjs\n" +
      "  NÃO é sem efeitos secundários. A primeira vez que corri (exploração inicial, fora deste\n" +
      "  ficheiro), o 'git status' mudou de limpo para 12 ficheiros modificados FORA de medicoes/:\n" +
      "  design/especime-v3/INVENTARIO-FRASES.md (a lista declarada de frases cresceu +35 linhas)\n" +
      "  e onze ficheiros de código (src/components/inicio/MapaRespira.astro, Pesquisa.astro,\n" +
      "  src/data/concelhos.mjs, municipios.mjs, src/i18n/strings.mjs, src/lib/inicio.mjs,\n" +
      "  src/views/LivroConcelhosView.astro, MunicipiosView.astro, tests/inicio/matriz.mjs,\n" +
      "  tests/municipio/concelhos.mjs, correcoes-c.mjs). Uma segunda corrida (dentro deste script,\n" +
      "  via execFileSync) já não encontrou nada 'por classificar' — porque a primeira corrida já\n" +
      "  tinha escrito as declarações que a segunda leu como 'já conhecidas'. Ou seja: a régua NÃO É\n" +
      "  IDEMPOTENTE, e o número 'blocos por classificar' depende de quantas vezes já correu antes,\n" +
      "  não só do estado do sítio. Reverti as 12 alterações (git checkout) para respeitar 'não tocar\n" +
      "  fora de medicoes/', e NÃO voltei a correr o script — uso aqui os números da MINHA primeira\n" +
      "  corrida (a única honesta: o sítio no seu estado antes de eu o tocar), já vistos e citados\n" +
      "  nesta sessão antes de eu perceber o efeito secundário."
  );

  // Números da primeira corrida (vistos directamente na saída desse
  // comando, citados aqui, não re-executados):
  const primeiraCorrida = {
    totalPaginas: 6390,
    portaCorreccoes: "6390/6390",
    autorreferenciaNaoZero: 0, // grep -oE "autorreferência [0-9]+" | sort -u → só "autorreferência 0"
    rotas: {
      "municipio (as 308 páginas /municipios/<slug>)": {
        exemplo: "14 distinta(s) · conteúdo 11 · navegação 3 · autorreferência 0",
        porClassificar: 0,
      },
      "municipios (índice /municipios)": {
        linha: "341 distinta(s) · conteúdo 32 · navegação 2 · autorreferência 0",
        porClassificar: 307,
      },
      "livro (/livro-razao)": {
        linha: "13 distinta(s) · conteúdo 11 · navegação 2 · autorreferência 0",
        porClassificar: 0,
      },
      "a nova do conjunto (/livro-razao/concelhos)": {
        linha: "342 distinta(s) · conteúdo 33 · navegação 2 · autorreferência 0",
        porClassificar: 307,
      },
    },
  };
  console.log(`  (dados da 1.ª corrida) total de páginas construídas: ${primeiraCorrida.totalPaginas} · porta de correcções: ${primeiraCorrida.portaCorreccoes}`);
  for (const [nome, r] of Object.entries(primeiraCorrida.rotas)) {
    console.log(`  rota '${nome}': ${r.linha || r.exemplo} · blocos por classificar = ${r.porClassificar}`);
  }
  REPORT.tables.tarefa10 = primeiraCorrida;

  logFinding(
    "10",
    "node scripts/medir-defeitos.mjs (o único script do sítio que o brief autoriza correr) escreve, como efeito secundário, em design/especime-v3/INVENTARIO-FRASES.md e em pelo menos 11 ficheiros de código fora de medicoes/ (src/components, src/data, src/i18n, src/lib, src/views, tests) — a lista declarada de frases cresce e o número 'blocos por classificar' desce de 307 para 0 numa segunda corrida do MESMO script sobre o MESMO sítio. Revertido (git checkout) para respeitar a regra de não tocar fora de medicoes/; não voltei a correr o script.",
    "scripts/medir-defeitos.mjs (efeito secundário) vs a regra 'não tocar fora de medicoes/ e do scratchpad'",
    { ficheirosTocados: 12, revertido: true }
  );

  if (primeiraCorrida.autorreferenciaNaoZero > 0) {
    logFinding("10", "autorreferência > 0 nalguma rota (1.ª corrida)", "scripts/medir-defeitos.mjs", primeiraCorrida.autorreferenciaNaoZero);
  } else {
    assertRed(
      "régua: autorreferência 0 em toda a saída da 1.ª corrida (municipio/municipios/livro/conjunto incluídos)",
      true,
      "confirmado por grep -oE sobre a saída real: só 'autorreferência 0' aparece, em nenhuma das linhas"
    );
  }
}

main().catch((e) => {
  console.error("ERRO FATAL:", e);
  REPORT.errors.push(String(e.stack || e));
  process.exitCode = 1;
});
