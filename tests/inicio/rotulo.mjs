#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO RÓTULO DE IA · a divulgação do artigo 50.º, medida na página
 * =============================================================================
 *
 * Uma célula por alvo da ordem de construção de 01.09.2026 §4, medida em
 * Chromium sem cabeça sobre `dist/`. NÃO é um portão: não entra no `npm run
 * build` e não constrói nada. Imprime uma linha por célula e SAI COM 0 quando
 * todas passam e com 1 quando alguma falha, como `tests/inicio/regioes.mjs`. O
 * código de saída é o que faz um estrago plantado ser visível (regra 14 da
 * casa).
 *
 *   node tests/inicio/rotulo.mjs
 *   node tests/inicio/rotulo.mjs --json <ficheiro>
 *   node tests/inicio/rotulo.mjs --vermelhos
 *
 * O servidor toma uma porta livre (`listen(0)`), como as outras réguas da casa.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA RÉGUA MEDE, E O QUE ELA NÃO MEDE
 * ---------------------------------------------------------------------------
 * O `gate:html` conta o rótulo em cada uma das páginas construídas e compara o
 * texto dele, carácter a carácter, com o aprovado: essa é a conta do sítio
 * inteiro e não se repete aqui. O que aqui se mede é o que só um navegador
 * sabe: se o bloco tem área, que cor é que a folha lhe dá de facto, se a porta
 * abre onde diz, e se o alvo de toque tem tamanho.
 *
 * M1 · o rótulo tem ÁREA e o texto certo em oito páginas, quatro por edição: a
 *      primeira, uma linha do livro-razão, uma página de concelho e uma página
 *      de leitura. Um bloco com altura zero, `display:none` ou `visibility:
 *      hidden` passa por qualquer contagem de marcas e não é uma divulgação.
 *
 * M2 · o CONTRASTE, medido no navegador e nos dois temas: a cor computada do
 *      texto do rótulo contra o fundo efectivo (o primeiro antepassado com
 *      fundo opaco), e a da porta da política contra o mesmo fundo. O limiar é
 *      o do texto, 4,5:1 (WCAG 2.1 AA). É a mesma aritmética de
 *      `scripts/medir-contraste.mjs`, aplicada às cores que a página tem em vez
 *      de às fichas que a folha declara.
 *
 * M3 · a PORTA abre a política: o `href` da linha aponta para a secção da
 *      política do Método da sua edição, e essa secção existe na página de
 *      destino, com área.
 *
 * M4 · o ALVO DE TOQUE a 390: a porta da política mede pelo menos 44px de
 *      altura, e a linha não transborda a página.
 *
 * M5 · a FICHA DA PRIMEIRA PÁGINA está nas duas primeiras páginas, e em mais
 *      lado nenhum das oito medidas. É o artigo 15.º, n.º 1 da Lei de Imprensa,
 *      que a pede na primeira página de cada edição.
 *
 * M6 · nas páginas de leitura, o rótulo do topo está ACIMA do corpo do
 *      documento, medido em píxeis. É a razão de ele existir: num texto longo o
 *      rodapé chega tarde para o «momento da primeira exposição» do n.º 5.
 *
 * M7 · sem JavaScript: o rótulo está completo no HTML servido. A divulgação não
 *      pode depender de um ficheiro que pode não chegar.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

/**
 * O ORÁCULO É O DO PORTÃO, e não o ficheiro que rende (segunda passagem).
 * `scripts/textos-aprovados.json` é copiado da ordem de construção §3 e nenhum
 * ficheiro de `src/` o importa: comparar a página com ele é comparar duas coisas
 * independentes, que é o que uma conferência tem de ser.
 */
const APROVADOS = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'scripts', 'textos-aprovados.json'),
    'utf8',
  ),
);
const textoDoRotulo = (lang) => APROVADOS.rotulo[lang];
const ANCORA_DA_POLITICA = APROVADOS.ancora_da_politica;

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const VERMELHOS = argv.includes('--vermelhos');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/* O ESTRAGO NÃO TOCA EM DISCO: é uma transformação do HTML no caminho entre o
   ficheiro e o navegador, como em `regioes.mjs` e em `mapa-distritos.mjs`. */
let ESTRAGO = null;

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  const tipo = MIME[path.extname(ficheiro)] ?? 'application/octet-stream';
  if (ESTRAGO && path.extname(ficheiro) === '.html') {
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery));
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

const nav = await chromium.launch({ headless: true });

/**
 * AS OITO PÁGINAS, QUATRO POR EDIÇÃO, E NENHUMA ESCRITA À MÃO.
 *
 * Os caminhos saem de `dist/`: a primeira página existe sempre, e as outras
 * três escolhem-se pela primeira pasta de cada família que estiver construída,
 * por ordem alfabética. Um caminho datilografado apodrece no dia em que o
 * concelho ou o estudo mudarem de nome, e a régua ficaria verde sobre uma
 * página que não existe (dava 404, e um 404 não tem rótulo nenhum: seria
 * vermelho, mas pela razão errada).
 */
function primeiraPastaDe(rel) {
  const dir = path.join(DIST, rel);
  if (!fs.existsSync(dir)) return null;
  const nomes = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, 'index.html')))
    .map((e) => e.name)
    .sort();
  return nomes.length ? `/${rel}/${nomes[0]}` : null;
}

/** A primeira página de leitura construída de cada edição, se houver. */
function primeiroTexto(prefixo, pastaDosEstudos, nomeDaRota) {
  const dir = path.join(DIST, pastaDosEstudos);
  if (!fs.existsSync(dir)) return null;
  const slugs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  for (const slug of slugs) {
    if (fs.existsSync(path.join(dir, slug, nomeDaRota, 'index.html'))) {
      return `${prefixo}/${slug}/${nomeDaRota}`;
    }
  }
  return null;
}

const PAGINAS = [
  { lang: 'pt', tipo: 'primeira', caminho: '/' },
  { lang: 'pt', tipo: 'linha', caminho: primeiraPastaDe('livro-razao') },
  { lang: 'pt', tipo: 'concelho', caminho: primeiraPastaDe('municipios') },
  { lang: 'pt', tipo: 'leitura', caminho: primeiroTexto('/estudos', 'estudos', 'texto') },
  { lang: 'en', tipo: 'primeira', caminho: '/en' },
  { lang: 'en', tipo: 'linha', caminho: primeiraPastaDe('en/ledger') },
  { lang: 'en', tipo: 'concelho', caminho: primeiraPastaDe('en/municipalities') },
  { lang: 'en', tipo: 'leitura', caminho: primeiroTexto('/en/studies', 'en/studies', 'text') },
].filter((p) => p.caminho);

const POLITICA = {
  pt: `/metodo#${ANCORA_DA_POLITICA}`,
  en: `/en/method#${ANCORA_DA_POLITICA}`,
};

/* --------------------------------------------------------------- a aritmética
 * WCAG 2.x, a mesma de `scripts/medir-contraste.mjs`: canal para linear,
 * luminância relativa, e a razão com o 0,05 de reflexão. */
function rgbDe(cor) {
  const m = String(cor).match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function luminancia([r, g, b]) {
  const c = [r, g, b].map((n) => {
    const s = n / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function razao(a, b) {
  const [la, lb] = [luminancia(a), luminancia(b)];
  const [claro, escuro] = la > lb ? [la, lb] : [lb, la];
  return (claro + 0.05) / (escuro + 0.05);
}

/**
 * A sonda que corre dentro da página. Devolve tudo o que as células precisam,
 * numa passagem só: uma segunda visita à mesma página seria uma segunda medição
 * de uma coisa que não muda.
 */
const SONDA = () => {
  const fundoDe = (el) => {
    let n = el;
    while (n && n.nodeType === 1) {
      const c = getComputedStyle(n).backgroundColor;
      const m = String(c).match(/rgba?\(\s*[\d.]+[\s,]+[\d.]+[\s,]+[\d.]+(?:[\s,]+([\d.]+))?/);
      const alfa = m && m[1] !== undefined ? Number(m[1]) : 1;
      if (m && alfa > 0.999) return c;
      n = n.parentElement;
    }
    return getComputedStyle(document.documentElement).backgroundColor;
  };
  const caixa = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
  };
  const rodape = document.querySelector('[data-rotulo-ia="rodape"]');
  const topo = document.querySelector('[data-rotulo-ia="topo"]');
  const linha = rodape ? rodape.querySelector('.rotulo-ia-linha') : null;
  const porta = linha ? linha.querySelector('a[href]') : null;
  const ficha = document.querySelector('[data-ficha-primeira-pagina]');
  const artigo = document.querySelector('[data-registo-edicao]');
  return {
    temRodape: Boolean(rodape),
    caixaDoRodape: rodape ? caixa(rodape) : null,
    texto: linha ? linha.textContent.replace(/\s+/g, ' ').trim() : null,
    corDoTexto: linha ? getComputedStyle(linha).color : null,
    corDaPorta: porta ? getComputedStyle(porta).color : null,
    fundo: linha ? fundoDe(linha) : null,
    href: porta ? porta.getAttribute('href') : null,
    alturaDaPorta: porta ? porta.getBoundingClientRect().height : null,
    larguraDaLinha: linha ? linha.getBoundingClientRect().right : null,
    larguraDoEcra: document.documentElement.clientWidth,
    temFicha: Boolean(ficha),
    textoDaFicha: ficha ? ficha.textContent.replace(/\s+/g, ' ').trim() : null,
    caixaDoTopo: topo ? caixa(topo) : null,
    caixaDoArtigo: artigo ? caixa(artigo) : null,
  };
};

async function abre(caminho, { largura = 1280, tema = null, semJs = false } = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: !semJs,
  });
  if (tema === 'dark') {
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('tema', 'dark');
      } catch {
        /* um separador que recuse o armazenamento mede o tema claro */
      }
    });
  }
  const p = await ctx.newPage();
  await p.goto(`${base}${caminho}`, { waitUntil: 'load' });
  p.__ctx = ctx;
  return p;
}

/* ===========================================================================
 * M1 · o rótulo tem área e o texto certo, nas oito páginas
 * ========================================================================== */
async function mediuAsOitoPaginas() {
  const maus = [];
  const vistas = [];
  for (const pag of PAGINAS) {
    const p = await abre(pag.caminho);
    const s = await p.evaluate(SONDA);
    await p.__ctx.close();
    vistas.push({ ...pag, texto: s.texto, altura: s.caixaDoRodape?.h ?? 0 });
    if (!s.temRodape) maus.push(`${pag.caminho}: sem rótulo no rodapé`);
    else if (!(s.caixaDoRodape.w > 0 && s.caixaDoRodape.h > 0)) {
      maus.push(`${pag.caminho}: o rótulo mede ${s.caixaDoRodape.w}×${s.caixaDoRodape.h}px`);
    } else if (s.texto !== textoDoRotulo(pag.lang)) {
      maus.push(`${pag.caminho}: «${String(s.texto).slice(0, 90)}»`);
    }
  }
  medidas.M1 = vistas;
  conta(
    'M1 · o rótulo tem área e o texto aprovado nas oito páginas medidas',
    PAGINAS.length === 8 && maus.length === 0,
    `${PAGINAS.length} página(s) medidas · ${maus.length} má(s)${maus.length ? ': ' + maus.slice(0, 3).join(' · ') : ''}`,
  );
}

/* ===========================================================================
 * M2 · o contraste, nos dois temas
 * ========================================================================== */
async function mediuOContraste() {
  const LIMIAR = 4.5;
  const linhas = [];
  const maus = [];
  for (const tema of ['claro', 'escuro']) {
    for (const lang of ['pt', 'en']) {
      const caminho = lang === 'pt' ? '/' : '/en';
      const p = await abre(caminho, { tema: tema === 'escuro' ? 'dark' : null });
      const s = await p.evaluate(SONDA);
      await p.__ctx.close();
      const fundo = rgbDe(s.fundo);
      const texto = rgbDe(s.corDoTexto);
      const portaCor = rgbDe(s.corDaPorta);
      if (!fundo || !texto || !portaCor) {
        maus.push(`${tema}/${lang}: não li as cores (${s.corDoTexto} sobre ${s.fundo})`);
        continue;
      }
      const rTexto = razao(texto, fundo);
      const rPorta = razao(portaCor, fundo);
      linhas.push({ tema, lang, texto: Number(rTexto.toFixed(2)), porta: Number(rPorta.toFixed(2)) });
      if (rTexto < LIMIAR) maus.push(`${tema}/${lang}: o texto do rótulo dá ${rTexto.toFixed(2)}:1`);
      if (rPorta < LIMIAR) maus.push(`${tema}/${lang}: a porta da política dá ${rPorta.toFixed(2)}:1`);
    }
  }
  medidas.M2 = linhas;
  conta(
    'M2 · o contraste do rótulo e da sua porta passa 4,5:1 nos dois temas',
    linhas.length === 4 && maus.length === 0,
    linhas
      .map((l) => `${l.tema}/${l.lang} texto ${l.texto}:1 · porta ${l.porta}:1`)
      .join(' · ') + (maus.length ? ` · ${maus.join(' · ')}` : ''),
  );
}

/* ===========================================================================
 * M3 · a porta abre a política
 * ========================================================================== */
async function mediuAPorta() {
  const maus = [];
  const vistos = [];
  for (const lang of ['pt', 'en']) {
    const caminho = lang === 'pt' ? '/' : '/en';
    const p = await abre(caminho);
    const s = await p.evaluate(SONDA);
    await p.__ctx.close();
    vistos.push({ lang, href: s.href });
    if (s.href !== POLITICA[lang]) {
      maus.push(`${lang}: a porta abre «${s.href}» e devia abrir «${POLITICA[lang]}»`);
      continue;
    }
    const destino = await abre(s.href);
    const chegou = await destino.evaluate((id) => {
      const alvo = document.getElementById(id);
      if (!alvo) return null;
      const r = alvo.getBoundingClientRect();
      return { w: r.width, h: r.height };
    }, ANCORA_DA_POLITICA);
    await destino.__ctx.close();
    if (!chegou) maus.push(`${lang}: a secção «${ANCORA_DA_POLITICA}» não existe no destino`);
    else if (!(chegou.w > 0 && chegou.h > 0)) {
      maus.push(`${lang}: a secção da política mede ${chegou.w}×${chegou.h}px`);
    }
  }
  medidas.M3 = vistos;
  conta(
    'M3 · a porta do rótulo abre a secção da política, nas duas edições',
    maus.length === 0,
    `${vistos.map((v) => `${v.lang} → ${v.href}`).join(' · ')}${maus.length ? ' · ' + maus.join(' · ') : ''}`,
  );
}

/* ===========================================================================
 * M4 · o alvo de toque, a 390
 * ========================================================================== */
async function mediuOAlvo() {
  const maus = [];
  const vistos = [];
  for (const lang of ['pt', 'en']) {
    const caminho = lang === 'pt' ? '/' : '/en';
    const p = await abre(caminho, { largura: 390 });
    const s = await p.evaluate(SONDA);
    await p.__ctx.close();
    vistos.push({ lang, altura: s.alturaDaPorta, direita: s.larguraDaLinha, ecra: s.larguraDoEcra });
    /* Uma sonda que não achou a porta devolve `null`, e um `null` é vermelho e
       não uma excepção: quando o corredor corre a suite inteira sobre uma planta
       que tira o rótulo, esta célula tem de dizer «não há porta» e continuar. */
    if (!(s.alturaDaPorta >= 44)) {
      maus.push(
        `${lang}: a porta mede ${s.alturaDaPorta === null ? 'nada, porque não há porta' : `${Number(s.alturaDaPorta).toFixed(1)}px`} de altura`,
      );
    }
    if (s.larguraDaLinha !== null && s.larguraDaLinha > s.larguraDoEcra + 0.5) {
      maus.push(
        `${lang}: a linha do rótulo acaba em ${s.larguraDaLinha.toFixed(1)}px e o ecrã tem ${s.larguraDoEcra}px`,
      );
    }
  }
  medidas.M4 = vistos;
  conta(
    'M4 · a 390, a porta da política tem 44px de alvo e a linha não transborda',
    maus.length === 0,
    vistos
      .map(
        (v) =>
          `${v.lang} ${v.altura === null ? 'sem porta' : `${Number(v.altura).toFixed(1)}px de alvo`}, ` +
          `acaba em ${v.direita === null ? 'lado nenhum' : v.direita.toFixed(1)} de ${v.ecra}`,
      )
      .join(' · ') + (maus.length ? ` · ${maus.join(' · ')}` : ''),
  );
}

/* ===========================================================================
 * M5 · a ficha da primeira página, e só ali
 * ========================================================================== */
async function mediuAFicha() {
  const maus = [];
  const vistos = [];
  for (const pag of PAGINAS) {
    const p = await abre(pag.caminho);
    const s = await p.evaluate(SONDA);
    await p.__ctx.close();
    const devia = pag.tipo === 'primeira';
    vistos.push({ caminho: pag.caminho, tem: s.temFicha, texto: s.textoDaFicha });
    if (s.temFicha !== devia) {
      maus.push(`${pag.caminho}: ${s.temFicha ? 'tem' : 'não tem'} ficha e ${devia ? 'devia ter' : 'não devia'}`);
      continue;
    }
    if (devia && !String(s.textoDaFicha).includes('Nuno dos Santos')) {
      maus.push(`${pag.caminho}: a ficha não nomeia quem dirige («${s.textoDaFicha}»)`);
    }
  }
  medidas.M5 = vistos;
  const nasPrimeiras = vistos.filter((v) => v.tem).length;
  conta(
    'M5 · a ficha do artigo 15.º está nas duas primeiras páginas, e em mais lado nenhum',
    maus.length === 0 && nasPrimeiras === 2,
    `${nasPrimeiras} ficha(s) em ${vistos.length} páginas${maus.length ? ' · ' + maus.join(' · ') : ''}`,
  );
}

/* ===========================================================================
 * M6 · nas páginas de leitura, o rótulo do topo vem antes do documento
 * ========================================================================== */
async function mediuOTopo() {
  const maus = [];
  const vistos = [];
  const leituras = PAGINAS.filter((p) => p.tipo === 'leitura');
  for (const pag of leituras) {
    const p = await abre(pag.caminho);
    const s = await p.evaluate(SONDA);
    await p.__ctx.close();
    vistos.push({
      caminho: pag.caminho,
      topo: s.caixaDoTopo ? Math.round(s.caixaDoTopo.y) : null,
      artigo: s.caixaDoArtigo ? Math.round(s.caixaDoArtigo.y) : null,
    });
    if (!s.caixaDoTopo) {
      maus.push(`${pag.caminho}: sem rótulo no topo`);
      continue;
    }
    if (!(s.caixaDoTopo.w > 0 && s.caixaDoTopo.h > 0)) {
      maus.push(`${pag.caminho}: o rótulo do topo mede ${s.caixaDoTopo.w}×${s.caixaDoTopo.h}px`);
      continue;
    }
    if (!s.caixaDoArtigo) {
      maus.push(`${pag.caminho}: não encontrei o corpo do documento`);
      continue;
    }
    if (!(s.caixaDoTopo.y + s.caixaDoTopo.h <= s.caixaDoArtigo.y)) {
      maus.push(
        `${pag.caminho}: o rótulo acaba em ${Math.round(s.caixaDoTopo.y + s.caixaDoTopo.h)}px e o ` +
          `documento começa em ${Math.round(s.caixaDoArtigo.y)}px`,
      );
    }
  }
  medidas.M6 = vistos;
  /* AS DUAS EDIÇÕES, E NÃO «pelo menos uma» (segunda passagem). `length > 0`
     dava verde a uma régua que só tivesse encontrado a página portuguesa, e o
     rótulo do topo é das duas edições: um mínimo positivo que não distingue os
     dois lados não é um mínimo positivo. */
  const linguas = new Set(leituras.map((p) => p.lang));
  conta(
    'M6 · nas páginas de leitura o rótulo do topo vem inteiro antes do documento',
    linguas.has('pt') && linguas.has('en') && maus.length === 0,
    `${leituras.length} página(s) de leitura em ${linguas.size} edição(ões) ` +
      `(${[...linguas].sort().join(', ') || 'nenhuma'})${maus.length ? ' · ' + maus.join(' · ') : ''}`,
  );
}

/* ===========================================================================
 * M7 · sem JavaScript
 * ========================================================================== */
async function mediuSemJs() {
  const maus = [];
  for (const lang of ['pt', 'en']) {
    const caminho = lang === 'pt' ? '/' : '/en';
    const p = await abre(caminho, { semJs: true });
    const s = await p.evaluate(SONDA).catch(() => null);
    /* `evaluate` continua a correr com `javaScriptEnabled:false` porque o
       Playwright o injecta pelo protocolo; o que não corre é o script da
       página, que é o que aqui se quer provar. */
    await p.__ctx.close();
    if (!s || !s.temRodape || s.texto !== textoDoRotulo(lang)) {
      maus.push(`${lang}: «${s ? String(s.texto).slice(0, 80) : 'sem sonda'}»`);
    }
  }
  conta(
    'M7 · o rótulo está completo no HTML servido, sem uma linha de JavaScript',
    maus.length === 0,
    maus.length ? maus.join(' · ') : 'as duas edições rendem a linha inteira sem script',
  );
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (regra 14)
 * ========================================================================== */
const PLANTAS = [
  {
    nome: 'o rótulo do rodapé retirado',
    /* Tira a linha, a porta, o nome e a ficha de uma vez: a leitura a frio
       notou que a declaração antiga só dizia M1. */
    celulas: ['M1', 'M2', 'M3', 'M4', 'M5', 'M7'],
    estrago: (html) => html.replace(/<div class="rotulo-ia rotulo-ia-rodape"[\s\S]*?<\/div>/, ''),
  },
  {
    nome: 'o rótulo escondido por uma folha',
    /* `display:none` põe a caixa a zero, e com ela o alvo de toque e o rótulo do
       topo. A cor computada não muda, e por isso M2 fica verde. */
    celulas: ['M1', 'M4', 'M6'],
    estrago: (html) =>
      html.replace('</head>', '<style>.rotulo-ia{display:none !important}</style></head>'),
  },
  {
    nome: 'a cor do rótulo posta no fio de arrumação',
    celulas: ['M2'],
    estrago: (html) =>
      html.replace(
        '</head>',
        '<style>.rotulo-ia-linha,.rotulo-ia-linha a{color:var(--rule) !important}</style></head>',
      ),
  },
  {
    nome: 'a porta da política a abrir o Método sem a âncora',
    celulas: ['M3'],
    estrago: (html) =>
      html
        .replace(`/metodo#${ANCORA_DA_POLITICA}`, '/metodo')
        .replace(`/en/method#${ANCORA_DA_POLITICA}`, '/en/method'),
  },
  {
    nome: 'o alvo de toque da porta reduzido a uma linha de texto',
    celulas: ['M4'],
    estrago: (html) =>
      html.replace(
        '</head>',
        '<style>@media (max-width:640px){.rotulo-ia-linha a{display:inline !important;' +
          'min-height:0 !important}}</style></head>',
      ),
  },
  {
    nome: 'a ficha da primeira página injectada numa página que não é a primeira',
    celulas: ['M5'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/en' || rota === '/index.html' || rota === '/en/index.html'
        ? html
        : html.replace(
            '<div class="rotulo-ia rotulo-ia-rodape"',
            '<p data-ficha-primeira-pagina>Diretor: Nuno dos Santos · Publicação gratuita</p>' +
              '<div class="rotulo-ia rotulo-ia-rodape"',
          ),
  },
  {
    nome: 'o rótulo do topo empurrado para depois do documento',
    celulas: ['M6'],
    estrago: (html) =>
      html.replace(
        '</head>',
        '<style>.rotulo-ia-topo{position:absolute !important;top:100000px !important}</style></head>',
      ),
  },
];

/* =========================================================================== */

async function corridaInteira() {
  await mediuAsOitoPaginas();
  await mediuOContraste();
  await mediuAPorta();
  await mediuOAlvo();
  await mediuAFicha();
  await mediuOTopo();
  await mediuSemJs();
}

if (!VERMELHOS) {
  await corridaInteira();
  const falhadas = celulas.filter((c) => !c.passa);
  console.log('');
  for (const c of celulas) {
    console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}\n    ${cinza(c.prova)}`);
  }
  console.log(
    `\n  ${falhadas.length ? vermelho(`${celulas.length - falhadas.length} de ${celulas.length}`) : verde(`${celulas.length} de ${celulas.length}`)} célula(s)\n`,
  );
  if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
    fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, medidas }, null, 2));
  }
  await nav.close();
  servidor.close();
  process.exit(falhadas.length ? 1 : 0);
}

/**
 * O CORREDOR DOS ESTRAGOS CORRE A SUITE INTEIRA (segunda passagem, 01.09.2026).
 *
 * A primeira forma corria só as células que a planta declarava, e é uma peneira
 * furada nos dois sentidos: um estrago que estrague uma célula que ele não
 * declara nunca é apanhado, porque a célula não chega a correr. A leitura a frio
 * apanhou-o com dois casos reais: tirar o rodapé estraga M2 a M5 e M7, e esconder
 * `.rotulo-ia` estraga M4 e M6, e nenhuma das duas plantas o dizia.
 *
 * Passa a correr a suite INTEIRA por planta, e a exigir as três coisas:
 *
 *   1. cada alvo declarado casa com uma célula corrida;
 *   2. todas as células que a planta nomeia ficam VERMELHAS;
 *   3. todas as outras ficam VERDES.
 *
 * A terceira é o par da primeira: um estrago que estrague mais do que declara
 * está a ser creditado por um vermelho que não é o dele, e a declaração
 * corrige-se para dizer a verdade em vez de se calar.
 */
const CORRIDAS = {
  M1: mediuAsOitoPaginas,
  M2: mediuOContraste,
  M3: mediuAPorta,
  M4: mediuOAlvo,
  M5: mediuAFicha,
  M6: mediuOTopo,
  M7: mediuSemJs,
};

console.log('');
/* Verde antes: sem a corrida limpa, um vermelho de planta não prova nada. */
ESTRAGO = null;
celulas = [];
await corridaInteira();
const verdesAntes = celulas.filter((c) => !c.passa);
console.log(
  `  ${verdesAntes.length ? vermelho('a suite JÁ ESTAVA VERMELHA ✗') : verde('verde antes ✓')}  ` +
    `${celulas.length} célula(s)`,
);
for (const c of verdesAntes) console.log(vermelho(`      ${c.nome} · ${c.prova.slice(0, 160)}`));

let todosVermelhos = verdesAntes.length === 0;
for (const planta of PLANTAS) {
  celulas = [];
  ESTRAGO = planta.estrago;
  for (const chave of Object.keys(CORRIDAS)) await CORRIDAS[chave]();
  const problemas = [];
  for (const alvo of planta.celulas) {
    const tocadas = celulas.filter((c) => c.nome.startsWith(alvo));
    if (!tocadas.length) problemas.push(`${alvo} não casou com nenhuma célula corrida`);
    else if (tocadas.every((c) => c.passa)) problemas.push(`${alvo} ficou VERDE`);
  }
  for (const c of celulas) {
    if (planta.celulas.some((alvo) => c.nome.startsWith(alvo))) continue;
    if (!c.passa) problemas.push(`${c.nome.split(' ')[0]} ficou vermelha sem ser declarada`);
  }
  if (problemas.length) todosVermelhos = false;
  console.log(
    `  ${problemas.length ? vermelho('NÃO APANHOU ✗') : verde('vermelho ✓')}  ${planta.nome}\n` +
      `      declara ${planta.celulas.join(', ')} · vermelhas ` +
      `${celulas.filter((c) => !c.passa).map((c) => c.nome.split(' ')[0]).join(', ') || 'nenhuma'}`,
  );
  for (const p of problemas) console.log(vermelho(`      ${p}`));
}
ESTRAGO = null;
console.log('');
await nav.close();
servidor.close();
process.exit(todosVermelhos ? 0 : 1);
