#!/usr/bin/env node
// mapa-distritos-M3-sonnet.mjs
//
// Medição cega do bloco "O mapa por distritos" (M3), por Claude Sonnet (o medidor).
// Código escrito do zero, sem ler src/, scripts/ (excepto a corrida autorizada de
// scripts/medir-defeitos.mjs), notas dos construtores ou briefs deles. As únicas
// fontes lidas: Emenda 20 de design/especime-v3/direcao.md, mapa/manifest.json,
// mapa/pais.json, mapa/distritos/*.json, e o BRIEF-mapa-distritos-M3.md.
//
// Corre com:
//   NODE_PATH=/Users/nunosantos/Instruments/OEstadoDoPais/node_modules node design/especime-v3/medicoes/mapa-distritos-M3-sonnet.mjs
// a partir da raiz da cópia (o git worktree), com o dist/ servido em AFTER_BASE.

import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../../');
const AFTER_BASE = process.env.AFTER_BASE || 'http://127.0.0.1:4771';
const BEFORE_BASE = process.env.BEFORE_BASE || 'https://xn--oestadodopas-2fb.pt';
const OUT_JSON = path.join(__dirname, 'mapa-distritos-M3-sonnet.resultados.json');

const results = {
  meta: { geradoEm: new Date().toISOString(), AFTER_BASE, BEFORE_BASE },
  autoTestes: [],
  m1_juncao: {},
  m2_primeiraPagina: {},
  m3_cliques: {},
  m4_distritos: {},
  m5_pesos: {},
  m6_neutralidade: {},
  m7_municipios: {},
  m8_localizador: {},
  m9_regua: {},
};

// ---------------------------------------------------------------------------
// Utilidades gerais
// ---------------------------------------------------------------------------

function log(...args) {
  console.log(...args);
}
function section(title) {
  console.log('\n' + '='.repeat(78));
  console.log(title);
  console.log('='.repeat(78));
}

function recordAutoTeste(nome, passou, detalhe) {
  results.autoTestes.push({ nome, passou, detalhe });
  log(`  [auto-teste] ${passou ? 'PASSOU (vermelho visto, depois corrigido)' : 'FALHOU — o detetor não se prova'} · ${nome}`);
  log(`      ${detalhe}`);
  if (!passou) {
    throw new Error(`Auto-teste falhou, detetor não provado: ${nome} — ${detalhe}`);
  }
}

// ---- fetch educado (limita a cadência para o "antes", ao vivo) ----
let lastBeforeFetch = 0;
const MIN_GAP_MS = 1200;
const fetchCache = new Map();

async function politeFetch(url) {
  if (fetchCache.has(url)) return fetchCache.get(url);
  if (url.startsWith(BEFORE_BASE)) {
    const now = Date.now();
    const wait = Math.max(0, lastBeforeFetch + MIN_GAP_MS - now);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastBeforeFetch = Date.now();
  }
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  const record = { status: res.status, text, bytes: Buffer.byteLength(text, 'utf8'), url };
  fetchCache.set(url, record);
  return record;
}

// ---------------------------------------------------------------------------
// Descodificador do caminho ("M x y l dx dy,… Z", inteiros, l relativo)
// ---------------------------------------------------------------------------

function parsePathToRings(d) {
  const tokenRe = /([MLZmlz])|(-?\d+(?:\.\d+)?)/g;
  const toks = [];
  let m;
  while ((m = tokenRe.exec(d))) {
    toks.push(m[1] !== undefined ? m[1] : Number(m[2]));
  }
  const rings = [];
  let ring = [];
  let cx = 0;
  let cy = 0;
  let cmd = null;
  let i = 0;
  while (i < toks.length) {
    const t = toks[i];
    if (typeof t === 'string') {
      if ((t === 'Z' || t === 'z') && ring.length) {
        rings.push(ring);
        ring = [];
      }
      cmd = t;
      i++;
      continue;
    }
    if (cmd === 'M') {
      if (ring.length) rings.push(ring);
      cx = t;
      cy = toks[i + 1];
      i += 2;
      ring = [[cx, cy]];
      cmd = 'L'; // pares soltos a seguir a M são lineto absoluto implícito
    } else if (cmd === 'm') {
      if (ring.length) rings.push(ring);
      cx += t;
      cy += toks[i + 1];
      i += 2;
      ring = [[cx, cy]];
      cmd = 'l';
    } else if (cmd === 'L') {
      cx = t;
      cy = toks[i + 1];
      i += 2;
      ring.push([cx, cy]);
    } else if (cmd === 'l') {
      cx += t;
      cy += toks[i + 1];
      i += 2;
      ring.push([cx, cy]);
    } else {
      i++; // número inesperado fora de um comando conhecido; ignora defensivamente
    }
  }
  if (ring.length) rings.push(ring);
  return rings;
}

function isLeft(p0, p1, p2) {
  return (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]);
}

function windingNumberRing(pt, ring) {
  let wn = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % n];
    if (a[1] <= pt[1]) {
      if (b[1] > pt[1] && isLeft(a, b, pt) > 0) wn++;
    } else if (b[1] <= pt[1] && isLeft(a, b, pt) < 0) {
      wn--;
    }
  }
  return wn;
}

function isInsideNonzero(pt, rings) {
  let total = 0;
  for (const ring of rings) total += windingNumberRing(pt, ring);
  return total !== 0;
}

function bboxOfRings(rings) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ring of rings) for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX - minX, maxY - minY];
}

// ---------------------------------------------------------------------------
// Carregamento dos JSON permitidos (mapa/)
// ---------------------------------------------------------------------------

function loadMapaData() {
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'mapa/manifest.json'), 'utf8'));
  const pais = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'mapa/pais.json'), 'utf8'));
  const distritosDir = path.join(REPO_ROOT, 'mapa/distritos');
  const files = fs.readdirSync(distritosDir).filter((f) => f.endsWith('.json')).sort();
  const distritos = files.map((f) => ({
    ficheiro: f,
    slugEsperado: f.replace(/\.json$/, ''),
    dados: JSON.parse(fs.readFileSync(path.join(distritosDir, f), 'utf8')),
  }));
  return { manifest, pais, distritos, distritosDir };
}

// ---------------------------------------------------------------------------
// Auto-testes (cada detetor provado num caso conhecido antes de dar um zero)
// ---------------------------------------------------------------------------

function autoTestePathParserEPIP() {
  // quadrado sintético simples [0,0]-[10,10], em "M x y l dx dy,… Z"
  const d = 'M0 0l10 0,0 10,-10 0Z';
  const rings = parsePathToRings(d);
  const okStructure = rings.length === 1 && rings[0].length === 4;
  const inside = isInsideNonzero([5, 5], rings);
  const outside = isInsideNonzero([100, 100], rings);
  const onEdgeInsideish = isInsideNonzero([0.001, 5], rings);
  const pass = okStructure && inside === true && outside === false && onEdgeInsideish === true;
  recordAutoTeste(
    'descodificador do caminho + ray casting (quadrado sintético)',
    pass,
    `rings=${JSON.stringify(rings)} · dentro(5,5)=${inside} (esperado true) · fora(100,100)=${outside} (esperado false) · quase-borda(0.001,5)=${onEdgeInsideish} (esperado true)`
  );

  // caso vermelho conhecido: um buraco (anel interior invertido) deve furar o preenchimento nonzero
  const dComBuraco = 'M0 0l20 0,0 20,-20 0Z M5 5l0 10,10 0,0 -10Z';
  const ringsBuraco = parsePathToRings(dComBuraco);
  const dentroDoBuraco = isInsideNonzero([10, 10], ringsBuraco); // deve ficar False (é o buraco)
  const forsDoBuracoMasDentroDaArea = isInsideNonzero([2, 2], ringsBuraco); // deve ficar True
  const passBuraco = ringsBuraco.length === 2 && dentroDoBuraco === false && forsDoBuracoMasDentroDaArea === true;
  recordAutoTeste(
    'regra nonzero com buraco (anel interior invertido fura o preenchimento)',
    passBuraco,
    `dentroDoBuraco(10,10)=${dentroDoBuraco} (esperado false) · dentroDaArea(2,2)=${forsDoBuracoMasDentroDaArea} (esperado true)`
  );
}

function deepCloneDistritos(distritos) {
  return distritos.map((u) => ({ ...u, dados: JSON.parse(JSON.stringify(u.dados)) }));
}

function collectConcelhos(distritos) {
  // devolve [{slug, nome, ponto, d, caixa, unidadeSlug, unidadeFicheiro}]
  const out = [];
  for (const u of distritos) {
    for (const c of u.dados.concelhos) {
      out.push({
        slug: c.slug,
        nome: c.nome,
        ponto: c.ponto,
        d: c.d,
        caixa: c.caixa,
        unidadeSlug: u.dados.unidade.slug,
        unidadeFicheiro: u.ficheiro,
      });
    }
  }
  return out;
}

function checkJoin(distritos, builtSlugs) {
  const concelhos = collectConcelhos(distritos);
  const contagem = new Map();
  for (const c of concelhos) contagem.set(c.slug, (contagem.get(c.slug) || 0) + 1);
  const duplicadosReal = [...contagem.entries()].filter(([, n]) => n > 1).map(([s]) => s);

  const slugsJSON = new Set(concelhos.map((c) => c.slug));
  const slugsBuilt = new Set(builtSlugs);
  const emJSONnaoConstruidas = [...slugsJSON].filter((s) => !slugsBuilt.has(s));
  const construidasNaoEmJSON = [...slugsBuilt].filter((s) => !slugsJSON.has(s));

  return {
    total: concelhos.length,
    unidades: distritos.length,
    duplicados: duplicadosReal,
    emJSONnaoConstruidas,
    construidasNaoEmJSON,
    ok: concelhos.length === 308 && duplicadosReal.length === 0 && emJSONnaoConstruidas.length === 0 && construidasNaoEmJSON.length === 0,
  };
}

function autoTesteJuncaoTrocaSlug(distritosOriginais, builtSlugs) {
  // Prova 1: o caso limpo (dados reais) dá zero
  const limpo = checkJoin(distritosOriginais, builtSlugs);
  // Prova 2: caso vermelho — troca o slug de duas entradas (mantém nome/d/caixa/ponto ligados
  // à posição original), tal como o brief pede: "troca um slug numa cópia do JSON".
  const copia = deepCloneDistritos(distritosOriginais);
  const c0 = copia[0].dados.concelhos[0];
  const uAlvo = copia.find((u) => u.dados.concelhos.length > 1) || copia[1];
  const c1 = uAlvo.dados.concelhos[uAlvo.dados.concelhos.length - 1];
  const slugA = c0.slug, slugB = c1.slug;
  c0.slug = slugB;
  c1.slug = slugA;
  const sujo = checkJoin(copia, builtSlugs);

  // depois da troca, os DOIS registos têm um slug que aponta para uma página com outro nome:
  // isto não quebra o conjunto de slugs (é uma troca, o conjunto fica igual), mas quebra a
  // correspondência nome<->slug<->página, que é um sub-detetor à parte (checkNomes). Prova-se aqui
  // que o conjunto de slugs continua correcto (era suposto) e que o detetor de nomes acusa a troca.
  const nomesSujo = checkNomesConcelhosWrapper(distritosOriginais, copia);
  const passou =
    limpo.ok === true &&
    sujo.duplicados.length === 0 && // é uma troca, não uma duplicação
    nomesSujo.discrepancias.some((d) => d.slug === slugA || d.slug === slugB);

  recordAutoTeste(
    'junção: troca de slug numa cópia do JSON (caso vermelho pedido no brief)',
    passou,
    `dados reais: ok=${limpo.ok} (esperado true) · depois de trocar slug entre "${slugA}" e "${slugB}": ` +
      `discrepâncias de nome encontradas=${JSON.stringify(nomesSujo.discrepancias.filter((d) => d.slug === slugA || d.slug === slugB))}`
  );
}

function autoTesteJuncaoDuplicado(distritosOriginais, builtSlugs) {
  const copia = deepCloneDistritos(distritosOriginais);
  const c0 = copia[0].dados.concelhos[0];
  const outraUnidade = copia[1];
  outraUnidade.dados.concelhos.push({ ...c0 }); // injeta um duplicado noutra unidade
  const sujo = checkJoin(copia, builtSlugs);
  const passou = sujo.duplicados.includes(c0.slug) && sujo.total === 309;
  recordAutoTeste(
    'junção: duplicado injectado noutra unidade (caso vermelho)',
    passou,
    `slug duplicado "${c0.slug}" detectado=${sujo.duplicados.includes(c0.slug)} · total=${sujo.total} (esperado 309)`
  );
}

function autoTesteJuncaoFaltaPagina(distritosOriginais, builtSlugs) {
  const copia = deepCloneDistritos(distritosOriginais);
  copia[0].dados.concelhos[0].slug = 'zzz-slug-inventado-para-o-auto-teste';
  const sujo = checkJoin(copia, builtSlugs);
  const passou =
    sujo.emJSONnaoConstruidas.includes('zzz-slug-inventado-para-o-auto-teste') &&
    sujo.construidasNaoEmJSON.length === 1;
  recordAutoTeste(
    'junção: slug inventado sem página construída (caso vermelho)',
    passou,
    `emJSONnaoConstruidas inclui o inventado=${sujo.emJSONnaoConstruidas.includes('zzz-slug-inventado-para-o-auto-teste')} · construidasNaoEmJSON=${JSON.stringify(sujo.construidasNaoEmJSON)}`
  );
}

function checkNomesConcelhos(concelhos, nomesConstruidos) {
  const discrepancias = [];
  if (!nomesConstruidos) return { discrepancias: [], naoTestado: true };
  for (const c of concelhos) {
    const nomeConstruido = nomesConstruidos.get(c.slug);
    if (nomeConstruido === undefined) continue; // apanhado pelo checkJoin
    if (nomeConstruido !== c.nome) {
      discrepancias.push({ slug: c.slug, nomeJSON: c.nome, nomeConstruido });
    }
  }
  return { discrepancias };
}
// variante síncrona usada só dentro do auto-teste (nomesConstruidos ainda não existe nesse ponto;
// simulamos a comparação nome-a-nome directamente a partir da cópia trocada, contra os nomes
// ORIGINAIS não trocados, que é o que a página construída (imutável) mostraria)
function checkNomesConcelhosAutoTeste(concelhosOriginais, concelhosTrocados) {
  const nomesOriginais = new Map(concelhosOriginais.map((c) => [c.slug, c.nome]));
  const discrepancias = [];
  for (const c of concelhosTrocados) {
    // a página construída para c.slug continua a mostrar o nome ORIGINAL desse slug
    const nomePagina = nomesOriginais.get(c.slug);
    if (nomePagina !== undefined && nomePagina !== c.nome) {
      discrepancias.push({ slug: c.slug, nomeJSON: c.nome, nomeConstruido: nomePagina });
    }
  }
  return { discrepancias };
}
// substitui a função usada acima por esta, mais correcta, redefinindo a referência:
function checkNomesConcelhosWrapper(distritosOriginais, distritosTrocados) {
  return checkNomesConcelhosAutoTeste(collectConcelhos(distritosOriginais), collectConcelhos(distritosTrocados));
}

function autoTesteRayCastingCruzado(distritos) {
  // controlo negativo: o ponto de um concelho testado contra o CAMINHO de outro concelho da
  // MESMA unidade (mesma grelha local), escolhendo os dois com caixas mais afastadas em x.
  const unidade = distritos.find((u) => u.dados.concelhos.length >= 4) || distritos[0];
  const cs = unidade.dados.concelhos;
  let a = cs[0], b = cs[0];
  for (const c of cs) {
    if (c.caixa[0] < a.caixa[0]) a = c;
    if (c.caixa[0] + c.caixa[2] > b.caixa[0] + b.caixa[2]) b = c;
  }
  if (a.slug === b.slug) { a = cs[0]; b = cs[cs.length - 1]; }
  const overlapX = a.caixa[0] < b.caixa[0] + b.caixa[2] && b.caixa[0] < a.caixa[0] + a.caixa[2];
  const overlapY = a.caixa[1] < b.caixa[1] + b.caixa[3] && b.caixa[1] < a.caixa[1] + a.caixa[3];
  const caixasSemSobreposicao = !(overlapX && overlapY);

  const ringsB = parsePathToRings(b.d);
  const aPontoDentroDeB = isInsideNonzero(a.ponto, ringsB);
  const passou = caixasSemSobreposicao && aPontoDentroDeB === false;
  recordAutoTeste(
    `ray casting: controlo negativo cruzado dentro de "${unidade.dados.unidade.nome}" (caso vermelho)`,
    passou,
    `caixas de "${a.nome}" e "${b.nome}" sem sobreposição=${caixasSemSobreposicao} · ponto de "${a.nome}" dentro do caminho de "${b.nome}"=${aPontoDentroDeB} (esperado false)`
  );
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 1 · A junção
// ---------------------------------------------------------------------------

function medicao1_juncao(mapaData) {
  section('MEDIÇÃO 1 · A junção (código próprio, sem confiar no manifest)');
  const { distritos, pais } = mapaData;

  autoTestePathParserEPIP();

  const municipiosDir = path.join(REPO_ROOT, 'dist/municipios');
  const enMunicipiosDir = path.join(REPO_ROOT, 'dist/en/municipalities');
  const builtSlugs = fs.readdirSync(municipiosDir).filter((f) => f !== 'index.html' && fs.statSync(path.join(municipiosDir, f)).isDirectory());
  const builtSlugsEN = fs.readdirSync(enMunicipiosDir).filter((f) => f !== 'index.html' && fs.statSync(path.join(enMunicipiosDir, f)).isDirectory());

  autoTesteJuncaoTrocaSlug(distritos, builtSlugs);
  autoTesteJuncaoDuplicado(distritos, builtSlugs);
  autoTesteJuncaoFaltaPagina(distritos, builtSlugs);
  autoTesteRayCastingCruzado(distritos);

  // --- checagem real ---
  const join = checkJoin(distritos, builtSlugs);
  log(`  308 concelhos, uma vez cada, nas 29 unidades: total=${join.total}, unidades=${join.unidades}, duplicados=${join.duplicados.length}`);
  log(`  slugs no JSON sem página construída: ${join.emJSONnaoConstruidas.length} ${JSON.stringify(join.emJSONnaoConstruidas)}`);
  log(`  páginas construídas sem entrada no JSON: ${join.construidasNaoEmJSON.length} ${JSON.stringify(join.construidasNaoEmJSON)}`);

  // slugs EN devem corresponder ao mesmo conjunto de 308
  const setPT = new Set(builtSlugs);
  const setEN = new Set(builtSlugsEN);
  const soPT = [...setPT].filter((s) => !setEN.has(s));
  const soEN = [...setEN].filter((s) => !setPT.has(s));
  log(`  308 páginas PT vs EN: PT=${builtSlugs.length} EN=${builtSlugsEN.length} · só em PT=${soPT.length} · só em EN=${soEN.length}`);

  // manifest declara os seus próprios 308 slugs: comparação a três (não confiar cegamente)
  const slugsManifest = new Set(mapaData.manifest.concelhos.slugs);
  const slugsMeus = new Set(collectConcelhos(distritos).map((c) => c.slug));
  const manifestVsMeus_soManifest = [...slugsManifest].filter((s) => !slugsMeus.has(s));
  const manifestVsMeus_soMeus = [...slugsMeus].filter((s) => !slugsManifest.has(s));
  log(`  manifest.concelhos.slugs (n=${mapaData.manifest.concelhos.n}) vs a minha soma directa dos ficheiros: só no manifest=${manifestVsMeus_soManifest.length} · só na minha soma=${manifestVsMeus_soMeus.length}`);

  // nomes: extrai o <h1> de cada página PT construída
  const nomesConstruidos = new Map();
  for (const slug of builtSlugs) {
    const html = fs.readFileSync(path.join(municipiosDir, slug, 'index.html'), 'utf8');
    const m = html.match(/<h1[^>]*>([^<]*)<\/h1>/);
    nomesConstruidos.set(slug, m ? m[1].trim() : null);
  }
  const concelhos = collectConcelhos(distritos);
  const { discrepancias: discrepanciasNomes } = checkNomesConcelhos(concelhos, nomesConstruidos);
  log(`  nomes JSON vs <h1> da página construída: discrepâncias=${discrepanciasNomes.length}`);
  if (discrepanciasNomes.length) log('    ' + JSON.stringify(discrepanciasNomes, null, 2));

  // ray casting real: os 308 pontos representativos, mais os 29 pontos de pais.json
  const foraDoCaminho = [];
  for (const c of concelhos) {
    const rings = parsePathToRings(c.d);
    const dentro = isInsideNonzero(c.ponto, rings);
    if (!dentro) foraDoCaminho.push({ slug: c.slug, nome: c.nome, ponto: c.ponto, unidade: c.unidadeSlug });
  }
  log(`  ray casting (nonzero) dos 308 pontos representativos dos concelhos: fora do próprio caminho=${foraDoCaminho.length}`);
  if (foraDoCaminho.length) log('    ' + JSON.stringify(foraDoCaminho, null, 2));

  const casosMar = ['funchal', 'santa-cruz', 'peso-da-regua', 'vila-real-de-santo-antonio'];
  const casosMarResultado = casosMar.map((slug) => {
    const c = concelhos.find((x) => x.slug === slug);
    if (!c) return { slug, encontrado: false };
    const rings = parsePathToRings(c.d);
    return { slug, encontrado: true, dentro: isInsideNonzero(c.ponto, rings) };
  });
  log(`  Emenda 20e, os 4 concelhos cujo centróide caía no mar (ponto representativo deve ficar dentro da área):`);
  log('    ' + JSON.stringify(casosMarResultado));

  const foraDoCaminhoPais = [];
  for (const u of pais.unidades) {
    const rings = parsePathToRings(u.d);
    const dentro = isInsideNonzero(u.ponto, rings);
    if (!dentro) foraDoCaminhoPais.push({ slug: u.slug, nome: u.nome });
  }
  log(`  ray casting dos 29 pontos das unidades em pais.json: fora do próprio caminho=${foraDoCaminhoPais.length}`);
  if (foraDoCaminhoPais.length) log('    ' + JSON.stringify(foraDoCaminhoPais));

  results.m1_juncao = {
    join,
    soPT, soEN,
    manifestVsMeus_soManifest, manifestVsMeus_soMeus,
    discrepanciasNomes,
    foraDoCaminho,
    casosMarResultado,
    foraDoCaminhoPais,
    builtSlugsCount: builtSlugs.length,
    builtSlugsENCount: builtSlugsEN.length,
  };
}

// ---------------------------------------------------------------------------
// Utilidades Playwright
// ---------------------------------------------------------------------------

async function computedStyleSnapshot(locator) {
  return locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    const out = {};
    for (let i = 0; i < cs.length; i++) {
      const n = cs[i];
      out[n] = cs.getPropertyValue(n);
    }
    return out;
  });
}

function diffStyle(a, b) {
  const diffs = [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if (a[k] !== b[k]) diffs.push([k, a[k], b[k]]);
  return diffs;
}

async function ariaLinksOf(locator) {
  // devolve [{role, name, href}] a partir do ariaSnapshot (cálculo real do Chromium)
  const snap = await locator.ariaSnapshot();
  const out = [];
  const re = /- (\w+) "([^"]*)":\n\s*- \/url: (\S+)/g;
  let m;
  while ((m = re.exec(snap))) out.push({ role: m[1], name: m[2], href: m[3] });
  return out;
}

async function grabAreaMap(page, svgSelector) {
  return page.evaluate((svgSelector) => {
    const svg = document.querySelector(svgSelector);
    if (!svg) return { svgExists: false };
    const svgRect = svg.getBoundingClientRect();
    const anchors = Array.from(svg.querySelectorAll('a'));
    const areas = anchors.map((a) => {
      const r = a.getBoundingClientRect();
      const title = a.querySelector('title');
      // hit-teste geométrico, independente de scroll/viewport: o centro da caixa delimitadora
      // (o ponto que um clique "no meio da área" atinge por omissão) só activa a forma se cair
      // dentro do preenchimento real do polígono (SVGGeometryElement.isPointInFill, no espaço
      // do utilizador do próprio <path>, via path.getBBox()). Para uma forma alongada, estreita
      // ou côncava, o centro da caixa (rectangular) pode cair fora do polígono (irregular) mesmo
      // que a caixa meça >=44x44 — a caixa não é a forma.
      const path = a.querySelector('path');
      let centroClicavel = null;
      let centroSvg = null;
      if (path && path.getBBox && path.isPointInFill) {
        const bbox = path.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        centroSvg = { x: cx, y: cy };
        try {
          centroClicavel = path.isPointInFill(new DOMPoint(cx, cy));
        } catch {
          centroClicavel = null;
        }
      }
      return {
        href: a.getAttribute('href'),
        titleText: title ? title.textContent : null,
        box: { x: r.x, y: r.y, width: r.width, height: r.height },
        centroSvg,
        centroClicavel,
      };
    });
    const outsideLinks = Array.from(document.querySelectorAll('a'))
      .filter((a) => !a.closest('svg'))
      .map((a) => {
        const r = a.getBoundingClientRect();
        return { href: a.getAttribute('href'), text: a.textContent.trim(), box: { x: r.x, y: r.y, width: r.width, height: r.height } };
      });
    return {
      svgExists: true,
      svgRole: svg.getAttribute('role'),
      svgBox: { x: svgRect.x, y: svgRect.y, width: svgRect.width, height: svgRect.height },
      areasCount: areas.length,
      areas,
      outsideLinks,
    };
  }, svgSelector);
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 2 · A primeira página, a 1280 e a 390
// ---------------------------------------------------------------------------

async function medicao2_primeiraPagina(browser, mapaData) {
  section('MEDIÇÃO 2 · A primeira página, a 1280 e a 390');

  // --- caso conhecido: no ar (main), a primeira página tem o mapa dos pontos e nenhuma área ---
  const beforeCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const beforePage = await beforeCtx.newPage();
  await beforePage.goto(BEFORE_BASE + '/', { waitUntil: 'domcontentloaded' });
  const beforeSnapshot = await beforePage.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    const mapaSvg = svgs.find((s) => (s.getAttribute('class') || '').includes('mapa-svg'));
    return {
      svgCount: svgs.length,
      mapaSvgClass: mapaSvg ? mapaSvg.getAttribute('class') : null,
      circlesInMapaSvg: mapaSvg ? mapaSvg.querySelectorAll('circle').length : 0,
      pathsInMapaSvg: mapaSvg ? mapaSvg.querySelectorAll('path').length : 0,
      areaLinksInMapaSvg: mapaSvg ? mapaSvg.querySelectorAll('a').length : 0,
      distritosLinksOnPage: document.querySelectorAll('a[href*="/distritos/"]').length,
    };
  });
  await beforeCtx.close();
  // Nota: no ar, cada ponto do mapa é uma ligação directa a /municipios/<slug> (Emenda 19b:
  // "no computador, os pontos do mapa com página são ligações"), por isso o número de <a>
  // dentro do mapa-svg não é o sinal certo de "há áreas por distrito"; o sinal certo é a
  // ausência de ligações a /distritos/ (nenhuma área de distrito existe) com o mapa de pontos
  // (círculos) presente. A primeira tentativa deste auto-teste exigia também 0 <a>, e isso
  // deu vermelho por engano meu (falso alarme do meu próprio detector, corrigido antes de
  // qualquer medição real): documento-o no relatório.
  const casoConhecidoPassou =
    beforeSnapshot.distritosLinksOnPage === 0 &&
    beforeSnapshot.pathsInMapaSvg === 0 &&
    beforeSnapshot.circlesInMapaSvg > 0;
  recordAutoTeste(
    'caso conhecido: no ar (main), a primeira página mostra o mapa de pontos e nenhuma área por distrito',
    casoConhecidoPassou,
    `círculos no mapa-svg=${beforeSnapshot.circlesInMapaSvg} (>0 esperado) · <path> no mapa-svg=${beforeSnapshot.pathsInMapaSvg} (esperado 0, não há áreas poligonais) · <a> dentro do mapa-svg=${beforeSnapshot.areaLinksInMapaSvg} (são ligações por ponto a /municipios/, não áreas) · ligações a /distritos/ na página=${beforeSnapshot.distritosLinksOnPage} (esperado 0)`
  );

  const viewports = [
    { nome: '1280', width: 1280, height: 800, device: null },
    { nome: '390', width: 390, height: 800, device: devices['iPhone 13'] },
  ];

  const ilhas = mapaData.pais.unidades.filter((u) => u.tipo === 'ilha').map((u) => u.nome);
  const ilhasPorMoldura = {
    Madeira: mapaData.pais.molduras.find((m) => m.nome === 'Madeira'),
    Açores: mapaData.pais.molduras.find((m) => m.nome === 'Açores'),
  };

  const porViewport = {};
  for (const vp of viewports) {
    log(`\n  --- viewport ${vp.nome} ---`);
    const ctxOpts = vp.device ? { ...vp.device } : { viewport: { width: vp.width, height: vp.height } };
    const ctx = await browser.newContext(ctxOpts);
    const page = await ctx.newPage();
    await page.goto(AFTER_BASE + '/', { waitUntil: 'networkidle' });

    const snap = await grabAreaMap(page, 'svg[data-mapa-areas]');
    log(`  svg do mapa existe: ${snap.svgExists} · role="${snap.svgRole}" (não deve ser "img")`);
    log(`  áreas encontradas: ${snap.areasCount} (esperado 29)`);

    const ariaLinks = await ariaLinksOf(page.locator('svg[data-mapa-areas] .mapa-areas'));
    const semNomeAcessivel = ariaLinks.filter((l) => !l.name || !l.name.trim());
    const naoSaoLink = ariaLinks.filter((l) => l.role !== 'link');
    log(`  nomes acessíveis (ariaSnapshot real do Chromium): ${ariaLinks.length} ligações lidas · sem nome=${semNomeAcessivel.length} · role diferente de "link"=${naoSaoLink.length}`);

    // caixas e 44x44
    const caixas = snap.areas.map((a) => ({
      href: a.href,
      nome: a.titleText,
      box: a.box,
      chega44: a.box.width >= 44 && a.box.height >= 44,
      centroClicavel: a.centroClicavel,
    }));
    const abaixo44 = caixas.filter((c) => !c.chega44);
    log(`  áreas abaixo de 44×44 px: ${abaixo44.length} de ${caixas.length}`);

    // achado: o centro geométrico da caixa delimitadora nem sempre cai dentro da forma real
    // (caixa != forma, para um polígono alongado/côncavo); prova-se com o caso conhecido antes
    // de contar. Só faz sentido a 1280 (área grande o suficiente); mede-se nas duas.
    const centroForaDaForma = caixas.filter((c) => c.centroClicavel === false);
    log(`  centro da caixa delimitadora fora da forma real (isPointInFill): ${centroForaDaForma.length} de ${caixas.length}`);
    if (centroForaDaForma.length) log('    ' + JSON.stringify(centroForaDaForma.map((c) => c.nome)));

    if (vp.nome === '1280') {
      const madeira = caixas.find((c) => c.href === '/distritos/ilha-da-madeira');
      const aveiroC = caixas.find((c) => c.href === '/distritos/aveiro');
      const passouCentro = madeira && madeira.centroClicavel === false && aveiroC && aveiroC.centroClicavel === true;
      recordAutoTeste(
        'centro da caixa fora da forma: caso vermelho conhecido (Ilha da Madeira, achado ao vivo num clique real da medição 3)',
        passouCentro,
        `Ilha da Madeira centroClicavel=${madeira && madeira.centroClicavel} (esperado false) · Aveiro centroClicavel=${aveiroC && aveiroC.centroClicavel} (esperado true, controlo positivo)`
      );
    }

    // neutralidade de cor: fill/stroke computados de TODAS as áreas (path.uni)
    const pathLocators = page.locator('svg[data-mapa-areas] .mapa-areas path.uni');
    const nPaths = await pathLocators.count();
    const fillsStrokes = [];
    for (let i = 0; i < nPaths; i++) {
      const cs = await pathLocators.nth(i).evaluate((el) => {
        const s = getComputedStyle(el);
        return { fill: s.fill, stroke: s.stroke, strokeWidth: s.strokeWidth };
      });
      fillsStrokes.push(cs);
    }
    const fillsDistintos = new Set(fillsStrokes.map((f) => f.fill));
    const strokesDistintos = new Set(fillsStrokes.map((f) => f.stroke));
    log(`  fill distintos entre as ${nPaths} áreas: ${fillsDistintos.size} (esperado 1) · valor=${[...fillsDistintos].join(', ')}`);
    log(`  stroke distinto entre as ${nPaths} áreas: ${strokesDistintos.size} (esperado 1) · valor=${[...strokesDistintos].join(', ')}`);

    // listas por baixo de cada moldura de ilhas
    // "parcela" (acores/madeira/continente) vem de manifest.json (dado, não código);
    // é a forma independente de saber que ilha pertence a que moldura sem depender do
    // desenho renderizado nem de o adivinhar.
    const parcelaParaMoldura = { madeira: 'Madeira', acores: 'Açores' };
    const listaIlhasInfo = {};
    for (const nomeMoldura of ['Madeira', 'Açores']) {
      const ilhasDestaMoldura = mapaData.manifest.unidades.filter((u) => u.tipo === 'ilha' && parcelaParaMoldura[u.parcela] === nomeMoldura);
      // caixas svg destas ilhas (medidas, não calculadas a partir do viewBox)
      const boxesDestasIlhas = caixas.filter((c) => ilhasDestaMoldura.some((u) => c.href === `/distritos/${u.slug}`));
      const clusterBottom = boxesDestasIlhas.length ? Math.max(...boxesDestasIlhas.map((b) => b.box.y + b.box.height)) : null;
      const clusterXMin = boxesDestasIlhas.length ? Math.min(...boxesDestasIlhas.map((b) => b.box.x)) : null;
      const clusterXMax = boxesDestasIlhas.length ? Math.max(...boxesDestasIlhas.map((b) => b.box.x + b.box.width)) : null;
      const ilhasAbaixo44 = boxesDestasIlhas.filter((b) => !b.chega44).map((b) => b.nome);

      const linksForaDoSvg = snap.outsideLinks.filter((l) => ilhasDestaMoldura.some((u) => l.href === `/distritos/${u.slug}`));
      const listados = linksForaDoSvg.map((l) => l.text);
      const emListaAbaixoDoCluster = linksForaDoSvg.filter((l) => clusterBottom === null || l.box.y >= clusterBottom - 1);

      listaIlhasInfo[nomeMoldura] = {
        ilhasNestaMoldura: ilhasDestaMoldura.map((u) => u.nome),
        ilhasAbaixo44,
        linksNaListaForaDoSvg: listados,
        todosOsLinksEstaoAbaixoDoCluster: emListaAbaixoDoCluster.length === linksForaDoSvg.length,
        umPorLinha: null, // calculado abaixo com boundingBox por <li>
      };
    }

    // "uma por linha": mede se os <li>/links da lista de ilhas têm y distintos crescentes (uma linha cada)
    const listaIlhasLayout = await page.evaluate(() => {
      const grupos = Array.from(document.querySelectorAll('[data-moldura-lista]'));
      return grupos.map((g) => {
        const moldura = g.getAttribute('data-moldura-lista');
        const items = Array.from(g.querySelectorAll('li')).map((li) => {
          const r = li.getBoundingClientRect();
          const a = li.querySelector('a');
          return { text: a ? a.textContent.trim() : li.textContent.trim(), href: a ? a.getAttribute('href') : null, y: r.y, height: r.height };
        });
        return { moldura, items };
      });
    });
    for (const g of listaIlhasLayout) {
      const ys = g.items.map((i) => i.y);
      const ysUnicos = new Set(ys.map((y) => Math.round(y)));
      const cadaItemEhLink = g.items.every((i) => !!i.href);
      if (listaIlhasInfo[g.moldura]) {
        listaIlhasInfo[g.moldura].numeroDeItens = g.items.length;
        listaIlhasInfo[g.moldura].linhasDistintas = ysUnicos.size;
        listaIlhasInfo[g.moldura].umaPorLinha = ysUnicos.size === g.items.length;
        listaIlhasInfo[g.moldura].cadaItemEhLink = cadaItemEhLink;
        listaIlhasInfo[g.moldura].itens = g.items.map((i) => i.text);
      }
    }
    log(`  listas por baixo das molduras de ilhas: ${JSON.stringify(listaIlhasInfo, null, 2)}`);

    porViewport[vp.nome] = {
      svgExists: snap.svgExists,
      svgRole: snap.svgRole,
      areasCount: snap.areasCount,
      ariaLinksCount: ariaLinks.length,
      semNomeAcessivel,
      naoSaoLink,
      abaixo44: abaixo44.map((c) => ({ nome: c.nome, href: c.href, box: c.box })),
      abaixo44Count: abaixo44.length,
      centroForaDaForma: centroForaDaForma.map((c) => ({ nome: c.nome, href: c.href, box: c.box, chega44: c.chega44 })),
      centroForaDaFormaCount: centroForaDaForma.length,
      fillsDistintosCount: fillsDistintos.size,
      fillsDistintos: [...fillsDistintos],
      strokesDistintosCount: strokesDistintos.size,
      strokesDistintos: [...strokesDistintos],
      listaIlhasInfo,
      caixasCompletas: caixas,
    };

    await ctx.close();
  }

  results.m2_primeiraPagina = { casoConhecido: beforeSnapshot, porViewport };
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 3 · Dez cliques reais na primeira página
// ---------------------------------------------------------------------------

async function medicao3_cliques(browser) {
  section('MEDIÇÃO 3 · Dez cliques reais na primeira página, a 1280 e a 390');
  const viewports = [
    { nome: '1280', ctxOpts: { viewport: { width: 1280, height: 800 } } },
    { nome: '390', ctxOpts: { ...devices['iPhone 13'] } },
  ];
  const porViewport = {};
  for (const vp of viewports) {
    const cliques = [];
    for (let i = 0; i < 10; i++) {
      const ctx = await browser.newContext(vp.ctxOpts);
      const page = await ctx.newPage();
      await page.goto(AFTER_BASE + '/', { waitUntil: 'networkidle' });
      const areaLocators = page.locator('svg[data-mapa-areas] .mapa-areas a.uni-porta');
      const n = await areaLocators.count();
      const idx = Math.floor(Math.random() * n);
      const alvo = areaLocators.nth(idx);
      const href = await alvo.getAttribute('href');
      const titleText = await alvo.locator('title').textContent().catch(() => null);
      await alvo.scrollIntoViewIfNeeded();
      // clique real, mas robusto: se o clique nunca se regista (p.ex. o centro geométrico da
      // caixa cai fora da forma real, ver medição 2), regista-se a falha em vez de rebentar a
      // medição inteira — é, ela própria, um resultado, não um acidente do meu programa.
      let bateCerto = false;
      let urlFinal = null;
      let erro = null;
      try {
        await alvo.click({ timeout: 4000 });
        await page.waitForLoadState('domcontentloaded');
        const pathFinal = new URL(page.url()).pathname.replace(/\/$/, '') + '/';
        const esperado = href.endsWith('/') ? href : href + '/';
        bateCerto = pathFinal === esperado;
        urlFinal = page.url();
      } catch (e) {
        erro = String(e.message || e).split('\n')[0];
        urlFinal = page.url();
      }
      cliques.push({ indice: idx, nome: titleText, hrefEsperado: href, urlFinal, bateCerto, erro });
      await ctx.close();
    }
    const falhas = cliques.filter((c) => !c.bateCerto);
    log(`  ${vp.nome}: ${cliques.length} cliques, falhas=${falhas.length}`);
    for (const c of cliques) log(`    [${vp.nome}] "${c.nome}" -> esperado ${c.hrefEsperado} · obteve ${c.urlFinal}${c.erro ? ' · ERRO: ' + c.erro : ''} · ${c.bateCerto ? 'OK' : 'FALHA'}`);
    porViewport[vp.nome] = { cliques, falhas: falhas.length };
  }
  results.m3_cliques = porViewport;
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 4 · Duas páginas de distrito (Lisboa, Ilha de São Miguel), as duas edições
// ---------------------------------------------------------------------------

async function medicao4_distritos(browser, mapaData) {
  section('MEDIÇÃO 4 · Lisboa e Ilha de São Miguel, PT e EN');
  const alvos = [
    { slug: 'lisboa', nome: 'Lisboa', pt: '/distritos/lisboa', en: '/en/districts/lisboa', municipiosBase_pt: '/municipios/', municipiosBase_en: '/en/municipalities/' },
    { slug: 'ilha-de-sao-miguel', nome: 'Ilha de São Miguel', pt: '/distritos/ilha-de-sao-miguel', en: '/en/districts/ilha-de-sao-miguel', municipiosBase_pt: '/municipios/', municipiosBase_en: '/en/municipalities/' },
  ];
  const jsonPorUnidade = new Map(mapaData.distritos.map((u) => [u.dados.unidade.slug, u.dados]));

  const viewports = [
    { nome: '1280', ctxOpts: { viewport: { width: 1280, height: 800 } } },
    { nome: '390', ctxOpts: { ...devices['iPhone 13'] } },
  ];

  const porAlvo = {};
  const cliquesTotais = [];
  for (const alvo of alvos) {
    const jsonUnidade = jsonPorUnidade.get(alvo.slug);
    const slugsJSON = jsonUnidade.concelhos.map((c) => c.slug);
    porAlvo[alvo.nome] = {};

    for (const edicao of ['pt', 'en']) {
      const urlPath = edicao === 'pt' ? alvo.pt : alvo.en;
      const municipiosBase = edicao === 'pt' ? alvo.municipiosBase_pt : alvo.municipiosBase_en;
      const porViewport = {};
      for (const vp of viewports) {
        const ctx = await browser.newContext(vp.ctxOpts);
        const page = await ctx.newPage();
        await page.goto(AFTER_BASE + urlPath + '/', { waitUntil: 'networkidle' });

        const snap = await grabAreaMap(page, 'svg[data-mapa-concelhos]');
        const ariaLinks = await ariaLinksOf(page.locator('svg[data-mapa-concelhos] .mapa-areas'));

        // lista textual
        const listaInfo = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('.concelhos-lista li a')).map((a) => ({
            href: a.getAttribute('href'),
            texto: a.textContent.trim(),
          }));
          return items;
        });

        const caixas = snap.areas.map((a) => ({ href: a.href, nome: a.titleText, box: a.box, chega44: a.box.width >= 44 && a.box.height >= 44, centroClicavel: a.centroClicavel }));
        const abaixo44 = caixas.filter((c) => !c.chega44);
        const centroForaDaForma = caixas.filter((c) => c.centroClicavel === false);

        const hrefsEsperados = slugsJSON.map((s) => `${municipiosBase}${s}`);
        const hrefsAreas = caixas.map((c) => c.href);
        const areasHrefOk = hrefsAreas.length === hrefsEsperados.length && hrefsAreas.every((h) => hrefsEsperados.includes(h));

        const hrefsLista = listaInfo.map((i) => i.href);
        const listaMesmoConjunto = hrefsLista.length === hrefsEsperados.length && [...hrefsLista].sort().join(',') === [...hrefsEsperados].sort().join(',');
        const listaMesmaOrdemQueJSON = JSON.stringify(hrefsLista) === JSON.stringify(hrefsEsperados);
        const hrefsAreasDOMOrder = snap.areas.map((a) => a.href); // ordem tal como aparecem no DOM/SVG
        const listaMesmaOrdemQueSVG = JSON.stringify(hrefsLista) === JSON.stringify(hrefsAreasDOMOrder);

        porViewport[vp.nome] = {
          areasCount: snap.areasCount,
          esperadoConcelhos: slugsJSON.length,
          areasHrefOk,
          ariaLinksSemNome: ariaLinks.filter((l) => !l.name || !l.name.trim()).length,
          ariaLinksNaoLink: ariaLinks.filter((l) => l.role !== 'link').length,
          listaCount: listaInfo.length,
          listaMesmoConjunto,
          listaMesmaOrdemQueJSON,
          listaMesmaOrdemQueSVG,
          abaixo44Count: abaixo44.length,
          abaixo44: abaixo44.map((c) => ({ nome: c.nome, href: c.href, box: c.box })),
          centroForaDaFormaCount: centroForaDaForma.length,
          centroForaDaForma: centroForaDaForma.map((c) => ({ nome: c.nome, href: c.href, box: c.box, chega44: c.chega44 })),
          svgRole: snap.svgRole,
        };
        if (vp.nome === '1280') {
          porViewport[vp.nome].listaOrdem = listaInfo.map((i) => i.texto);
          porViewport[vp.nome].jsonOrdem = jsonUnidade.concelhos.map((c) => c.nome);
        }
        await ctx.close();
      }
      porAlvo[alvo.nome][edicao] = porViewport;
    }
  }

  // dez cliques reais, distribuídos pelas duas páginas de distrito (PT, 1280 e 390)
  for (let i = 0; i < 10; i++) {
    const alvo = alvos[i % 2];
    const vp = i % 4 < 2 ? { nome: '1280', ctxOpts: { viewport: { width: 1280, height: 800 } } } : { nome: '390', ctxOpts: { ...devices['iPhone 13'] } };
    const ctx = await browser.newContext(vp.ctxOpts);
    const page = await ctx.newPage();
    await page.goto(AFTER_BASE + alvo.pt + '/', { waitUntil: 'networkidle' });
    const areaLocators = page.locator('svg[data-mapa-concelhos] .mapa-areas a.uni-porta');
    const n = await areaLocators.count();
    const idx = Math.floor(Math.random() * n);
    const alvoEl = areaLocators.nth(idx);
    const href = await alvoEl.getAttribute('href');
    const titleText = await alvoEl.locator('title').textContent().catch(() => null);
    await alvoEl.scrollIntoViewIfNeeded();
    let bateCerto = false, urlFinal = null, erro = null;
    try {
      await alvoEl.click({ timeout: 4000 });
      await page.waitForLoadState('domcontentloaded');
      const esperado = href.endsWith('/') ? href : href + '/';
      const pathFinal = new URL(page.url()).pathname.replace(/\/$/, '') + '/';
      bateCerto = pathFinal === esperado;
      urlFinal = page.url();
    } catch (e) {
      erro = String(e.message || e).split('\n')[0];
      urlFinal = page.url();
    }
    cliquesTotais.push({ distrito: alvo.nome, viewport: vp.nome, nome: titleText, hrefEsperado: href, urlFinal, bateCerto, erro });
    await ctx.close();
  }
  const falhasCliques = cliquesTotais.filter((c) => !c.bateCerto);
  log(`  dez cliques reais nas páginas de distrito: falhas=${falhasCliques.length}`);
  for (const c of cliquesTotais) log(`    [${c.distrito} @ ${c.viewport}] "${c.nome}" -> esperado ${c.hrefEsperado} · obteve ${c.urlFinal}${c.erro ? ' · ERRO: ' + c.erro : ''} · ${c.bateCerto ? 'OK' : 'FALHA'}`);

  log('\n  ' + JSON.stringify(porAlvo, null, 2));

  results.m4_distritos = { porAlvo, cliques: cliquesTotais, falhasCliques: falhasCliques.length };
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 5 · Os pesos
// ---------------------------------------------------------------------------

async function medicao5_pesos(mapaData) {
  section('MEDIÇÃO 5 · Os pesos (bytes)');

  const homeBefore = await politeFetch(BEFORE_BASE + '/');
  const homeAfter = await politeFetch(AFTER_BASE + '/');
  const distritoBefore = await politeFetch(BEFORE_BASE + '/distritos/lisboa');
  const distritoAfter = await politeFetch(AFTER_BASE + '/distritos/lisboa/');

  log(`  primeira página: antes=${homeBefore.bytes} bytes (status ${homeBefore.status}) · depois=${homeAfter.bytes} bytes (status ${homeAfter.status}) · diferença=${homeAfter.bytes - homeBefore.bytes}`);
  log(`  página de distrito (Lisboa): antes=${distritoBefore.status === 200 ? distritoBefore.bytes + ' bytes' : 'rota não existe no ar, status ' + distritoBefore.status} · depois=${distritoAfter.bytes} bytes (status ${distritoAfter.status})`);

  const paisJsonBytes = fs.statSync(path.join(REPO_ROOT, 'mapa/pais.json')).size;
  const distritosStats = mapaData.distritos.map((u) => ({
    slug: u.slugEsperado,
    nome: u.dados.unidade.nome,
    concelhos: u.dados.concelhos.length,
    bytes: fs.statSync(path.join(REPO_ROOT, 'mapa/distritos', u.ficheiro)).size,
  }));
  const maiorPorBytes = [...distritosStats].sort((a, b) => b.bytes - a.bytes)[0];
  const maiorPorConcelhos = [...distritosStats].sort((a, b) => b.concelhos - a.concelhos)[0];
  log(`  mapa/pais.json: ${paisJsonBytes} bytes`);
  log(`  maior distrito por bytes do ficheiro: ${maiorPorBytes.nome} (${maiorPorBytes.slug}) = ${maiorPorBytes.bytes} bytes, ${maiorPorBytes.concelhos} concelhos`);
  log(`  maior distrito por número de concelhos: ${maiorPorConcelhos.nome} (${maiorPorConcelhos.slug}) = ${maiorPorConcelhos.concelhos} concelhos, ${maiorPorConcelhos.bytes} bytes`);
  log('  todos os 29: ' + JSON.stringify(distritosStats.sort((a, b) => b.bytes - a.bytes)));

  results.m5_pesos = {
    primeiraPagina: { antesBytes: homeBefore.bytes, antesStatus: homeBefore.status, depoisBytes: homeAfter.bytes, depoisStatus: homeAfter.status },
    paginaDistrito: { antesBytes: distritoBefore.status === 200 ? distritoBefore.bytes : null, antesStatus: distritoBefore.status, depoisBytes: distritoAfter.bytes, depoisStatus: distritoAfter.status },
    paisJsonBytes,
    maiorPorBytes,
    maiorPorConcelhos,
    todos: distritosStats,
  };
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 6 · Neutralidade ao passar o rato e ao focar
// ---------------------------------------------------------------------------

async function medicao6_neutralidade(browser) {
  section('MEDIÇÃO 6 · Neutralidade a hover e a focus (getComputedStyle completo)');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(AFTER_BASE + '/', { waitUntil: 'networkidle' });

  const areaLocators = page.locator('svg[data-mapa-areas] .mapa-areas a.uni-porta');
  const n = await areaLocators.count();
  const amostraIdx = [0, Math.floor(n / 2), n - 1];
  const amostras = {};
  for (const idx of amostraIdx) {
    const a = areaLocators.nth(idx);
    const nome = await a.locator('title').textContent();
    const path = a.locator('path.uni');

    const baseA = await computedStyleSnapshot(a);
    const basePath = await computedStyleSnapshot(path);

    await a.hover();
    const hoverA = await computedStyleSnapshot(a);
    const hoverPath = await computedStyleSnapshot(path);
    const diffHoverA = diffStyle(baseA, hoverA);
    const diffHoverPath = diffStyle(basePath, hoverPath);

    // sai do hover antes de focar
    await page.mouse.move(0, 0);

    await a.focus();
    const focusA = await computedStyleSnapshot(a);
    const focusPath = await computedStyleSnapshot(path);
    const diffFocusA = diffStyle(baseA, focusA);
    const diffFocusPath = diffStyle(basePath, focusPath);
    await a.evaluate((el) => el.blur());

    const contornoPalavras = ['outline', 'border-radius', 'stroke-width', 'stroke', 'box-shadow'];
    const soContorno = (diffs) => diffs.every(([k]) => contornoPalavras.some((w) => k.includes(w)));

    amostras[nome] = {
      totalPropriedades: Object.keys(baseA).length,
      diffHoverA,
      diffHoverPath,
      diffFocusA,
      diffFocusPath,
      hoverSoContorno: soContorno(diffHoverA) && soContorno(diffHoverPath),
      focusSoContorno: soContorno(diffFocusA) && soContorno(diffFocusPath),
    };
    log(`  área "${nome}": hover muda ${diffHoverA.length + diffHoverPath.length} propriedades (de ${Object.keys(baseA).length * 2}) · só-contorno=${amostras[nome].hoverSoContorno}`);
    log(`    hover <a>: ${JSON.stringify(diffHoverA)}`);
    log(`    hover path: ${JSON.stringify(diffHoverPath)}`);
    log(`  área "${nome}": focus muda ${diffFocusA.length + diffFocusPath.length} propriedades · só-contorno=${amostras[nome].focusSoContorno}`);
    log(`    focus <a>: ${JSON.stringify(diffFocusA)}`);
    log(`    focus path: ${JSON.stringify(diffFocusPath)}`);
  }
  await ctx.close();
  results.m6_neutralidade = amostras;
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 7 e 8 · Diffs de bytes (/municipios e o cartão localizador)
// ---------------------------------------------------------------------------

function systemDiff(beforeHtml, afterHtml, tmpPrefix) {
  // diff verdadeiro (Myers, via o utilitário `diff` do sistema) sobre HTML pretty-printed
  // (uma tag/texto por linha), para um diff mínimo e legível, não um simples aparo de
  // prefixo/sufixo comum.
  const pretty = (h) => h.replace(/></g, '>\n<');
  const beforeFile = path.join(os.tmpdir(), `${tmpPrefix}.before.${process.pid}.txt`);
  const afterFile = path.join(os.tmpdir(), `${tmpPrefix}.after.${process.pid}.txt`);
  fs.writeFileSync(beforeFile, pretty(beforeHtml));
  fs.writeFileSync(afterFile, pretty(afterHtml));
  let out = '';
  try {
    out = execFileSync('diff', [beforeFile, afterFile], { encoding: 'utf8' });
  } catch (e) {
    out = e.stdout || ''; // diff sai com código 1 quando os ficheiros diferem; stdout tem o diff
  } finally {
    fs.unlinkSync(beforeFile);
    fs.unlinkSync(afterFile);
  }
  const lines = out.split('\n');
  const hunks = [];
  let cur = null;
  for (const line of lines) {
    if (/^\d+(,\d+)?[acd]\d+(,\d+)?$/.test(line)) {
      if (cur) hunks.push(cur);
      cur = { header: line, before: [], after: [] };
    } else if (line === '---') {
      // separador do formato "normal" do diff, ignora
    } else if (line.startsWith('< ')) {
      cur.before.push(line.slice(2));
    } else if (line.startsWith('> ')) {
      cur.after.push(line.slice(2));
    }
  }
  if (cur) hunks.push(cur);
  return hunks;
}

function classifyLine(line) {
  return line.replace(/"[^"]*"/g, '"X"').replace(/>[^<>]*</g, '>X<');
}

function groupHunks(hunks) {
  const grupos = new Map();
  for (const h of hunks) {
    const key = h.before.map(classifyLine).join('\\n') + ' => ' + h.after.map(classifyLine).join('\\n');
    if (!grupos.has(key)) grupos.set(key, { count: 0, exemploAntes: h.before, exemploDepois: h.after });
    grupos.get(key).count++;
  }
  return [...grupos.entries()].map(([k, v]) => ({ padrao: k, ocorrencias: v.count, exemploAntes: v.exemploAntes, exemploDepois: v.exemploDepois }));
}

async function medicao7_municipios() {
  section('MEDIÇÃO 7 · /municipios: cabeçalhos dos grupos por distrito');
  const before = await politeFetch(BEFORE_BASE + '/municipios');
  const after = await politeFetch(AFTER_BASE + '/municipios/');
  const hunks = systemDiff(before.text, after.text, 'municipios');
  const gruposArr = groupHunks(hunks);

  log(`  bytes: antes=${before.bytes} depois=${after.bytes} diferença=${after.bytes - before.bytes}`);
  log(`  hunks do diff (Myers, via \`diff\` do sistema): ${hunks.length}`);
  log(`  padrões distintos de mudança (depois de generalizar valores entre aspas e texto): ${gruposArr.length}`);
  for (const g of gruposArr) log(`    x${g.ocorrencias} :: ${JSON.stringify(g.exemploAntes)}  =>  ${JSON.stringify(g.exemploDepois)}`);

  const padraoLigacaoHeader = gruposArr.filter((g) => g.exemploDepois.some((l) => /concelhos-grupo-k/.test(l)) || g.exemploAntes.some((l) => /concelhos-grupo-k/.test(l)));
  const padraoDataCaop = gruposArr.filter((g) => g.exemploDepois.some((l) => /data-caop/.test(l)));
  const outrosPadroes = gruposArr.filter((g) => !padraoLigacaoHeader.includes(g) && !padraoDataCaop.includes(g));

  results.m7_municipios = {
    antesBytes: before.bytes, depoisBytes: after.bytes, diferenca: after.bytes - before.bytes,
    totalHunks: hunks.length,
    padroes: gruposArr,
    padraoLigacaoHeaderOcorrencias: padraoLigacaoHeader.reduce((s, g) => s + g.ocorrencias, 0),
    padraoDataCaopOcorrencias: padraoDataCaop.reduce((s, g) => s + g.ocorrencias, 0),
    outrosPadroes,
  };
  log(`  fora dos dois padrões esperados (ligação do cabeçalho, data-caop): ${outrosPadroes.length} padrões distintos, ${outrosPadroes.reduce((s, g) => s + g.ocorrencias, 0)} ocorrências`);
}

async function medicao8_localizador() {
  section('MEDIÇÃO 8 · O cartão localizador numa página de concelho');
  const slug = 'evora';
  const before = await politeFetch(BEFORE_BASE + '/municipios/' + slug);
  const after = await politeFetch(AFTER_BASE + '/municipios/' + slug + '/');
  const hunks = systemDiff(before.text, after.text, 'evora');

  log(`  bytes (${slug}): antes=${before.bytes} depois=${after.bytes} diferença=${after.bytes - before.bytes}`);
  log(`  hunks do diff (Myers, via \`diff\` do sistema): ${hunks.length}`);
  for (const h of hunks) {
    log(`    @@ ${h.header}`);
    for (const l of h.before) log(`    - ${l}`);
    for (const l of h.after) log(`    + ${l}`);
  }

  // confirma a extensão do defeito do atributo duplicado em todo o dist/
  const patternDup = 'class="mapa-svg" viewBox="0 0 600 790" class="mapa-svg" viewBox="0 0 600 790"';
  const distDir = path.join(REPO_ROOT, 'dist');
  let arquivosComDefeito = [];
  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(p);
      else if (entry.name === 'index.html') {
        const html = fs.readFileSync(p, 'utf8');
        if (html.includes(patternDup)) arquivosComDefeito.push(path.relative(REPO_ROOT, p));
      }
    }
  }
  scan(path.join(distDir, 'municipios'));
  scan(path.join(distDir, 'en/municipalities'));

  log(`  atributo duplicado ('${patternDup.slice(0, 40)}...') encontrado em ${arquivosComDefeito.length} páginas de concelho (PT+EN, de 616 possíveis)`);

  results.m8_localizador = {
    antesBytes: before.bytes, depoisBytes: after.bytes, diferenca: after.bytes - before.bytes,
    hunks,
    defeitoAtributoDuplicado: { totalPaginasAfectadas: arquivosComDefeito.length, amostra: arquivosComDefeito.slice(0, 5) },
  };
}

// ---------------------------------------------------------------------------
// MEDIÇÃO 9 · A régua do inventário
// ---------------------------------------------------------------------------

function medicao9_regua() {
  section('MEDIÇÃO 9 · node scripts/medir-defeitos.mjs (o único script do sítio que corro)');
  const nodePath = process.env.NODE_PATH || '';
  let stdout;
  let exitCode = 0;
  try {
    stdout = execFileSync('node', ['scripts/medir-defeitos.mjs'], {
      cwd: REPO_ROOT,
      env: { ...process.env, NODE_PATH: nodePath },
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (e) {
    stdout = (e.stdout || '') + (e.stderr || '');
    exitCode = e.status ?? 1;
  }
  const semCores = stdout.replace(/\x1b\[[0-9;]*m/g, '');
  const re = /frases da casa · (\/(?:en\/)?(?:distritos|districts)[^\s]*) \.\.\. (\d+) distinta\(s\) · conteúdo (\d+) · navegação (\d+) · autorreferência (\d+)/g;
  let m;
  const linhas = [];
  while ((m = re.exec(semCores))) {
    linhas.push({ rota: m[1], distinta: +m[2], conteudo: +m[3], navegacao: +m[4], autorreferencia: +m[5] });
  }
  const semClassificar = linhas.filter((l) => l.conteudo + l.navegacao + l.autorreferencia !== l.distinta);
  const comAutorreferencia = linhas.filter((l) => l.autorreferencia !== 0);
  const semMarcadoresDeFalha = !/✗|FALHA/.test(semCores);

  log(`  exit code: ${exitCode}`);
  log(`  linhas "frases da casa" para /distritos* e /*districts* (PT+EN): ${linhas.length}`);
  log(`  com blocos por classificar (conteúdo+navegação+autorreferência != distinta): ${semClassificar.length}`);
  log(`  com autorreferência != 0: ${comAutorreferencia.length}`);
  log(`  sem marcadores de falha (✗/FALHA) na saída inteira: ${semMarcadoresDeFalha}`);

  results.m9_regua = {
    exitCode,
    totalLinhasRotasNovas: linhas.length,
    semClassificar,
    comAutorreferencia,
    semMarcadoresDeFalha,
    outputBytes: Buffer.byteLength(stdout, 'utf8'),
  };
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  const mapaData = loadMapaData();

  medicao1_juncao(mapaData);

  const browser = await chromium.launch();
  try {
    await medicao2_primeiraPagina(browser, mapaData);
    await medicao3_cliques(browser);
    await medicao4_distritos(browser, mapaData);
    await medicao6_neutralidade(browser);
  } finally {
    await browser.close();
  }

  await medicao5_pesos(mapaData);
  await medicao7_municipios();
  await medicao8_localizador();
  medicao9_regua();

  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  section('FIM · resultados escritos em ' + OUT_JSON);
}

main().catch((e) => {
  console.error('ERRO FATAL:', e);
  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  process.exit(1);
});
