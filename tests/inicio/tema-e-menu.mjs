#!/usr/bin/env node
/**
 * =============================================================================
 * O TEMA E O MENU, NO NAVEGADOR (bloco P4, 02.10.2026, itens 00 e 0 do brief
 * `design/observatorio/BRIEF-P4-os-pequenos-do-sitio.md`)
 * =============================================================================
 *
 * O diretor viu, a 02.10.2026, o sítio escuro no portátil e claro no telemóvel, sem comando para escolher, e não
 * encontrou a página da União, que o menu não nomeava. O brief P4 repôs a Emenda 12 de 21.08.2026 (§1.52): claro
 * para toda a gente, o escuro só pela escolha do leitor, num comando à vista no cabeçalho, lembrado no aparelho e
 * aplicado antes da primeira pintura; e pôs a página da União no menu, como sexta porta.
 *
 * A N3 e a N1 do `check:pais` conferem o HTML servido de todas as páginas (a raiz sem `data-theme`, a guarda, o
 * guião, o comando, as seis portas). Esta régua confere o que só o navegador sabe, nas três páginas que o diretor
 * leu (a primeira página, «Lugares» e a página da União), nas duas edições:
 *
 *   TM1 · sem escolha, o sítio é claro em qualquer aparelho: com o aparelho em escuro e nada guardado, a raiz não
 *         leva `data-theme` e o fundo é o papel claro dos tokens; e sem guião também, com o comando escondido;
 *   TM2 · o comando à vista no cabeçalho em todas as larguras (390, 768, 1 024, 1 280 e 1 600 px): dentro do
 *         `<header>`, visível, dentro da janela, cada botão com o alvo de 44 px por 44, e os dois a dizer o estado;
 *   TM3 · o caminho inteiro do leitor (passagem P4-c, 02.10.2026, achado 5 da leitura a frio do P4: a forma de antes
 *         guardava «dark» antes de a página correr e só carregava no «claro», e um manipulador que aplicasse o claro a
 *         todos os cliques passava). Sem nada guardado, a página abre clara, com a cor da mobília do papel claro; um
 *         toque em «escuro» põe o atributo na raiz, guarda «dark», pinta o papel escuro, troca a cor da mobília e
 *         diz-se escolhido; uma recarga continua escura, com o atributo da raiz a mudar ANTES de o `<body>` entrar no
 *         documento (um observador posto antes de a página correr regista a ordem das duas mudanças); um toque em
 *         «claro» tira o atributo, guarda «light» e devolve a cor da mobília; e uma recarga fica clara;
 *   TM4 · o menu com seis portas numa linha, sem empurrar a página: nas cinco larguras, seis ligações em
 *         `#nav-principal`, todas no mesmo topo e dentro da caixa do menu, e o menu sem conteúdo para além da sua
 *         caixa nem da janela; a 320 e a 360 px, onde as portas não cabem numa linha, o menu dobra, sem passar da
 *         janela. A célula mede o menu e não a página inteira: a largura do documento fica no relatório, e a 320 px a
 *         primeira página passa da janela por um valor com selo que não quebra, que é anterior a este bloco e não é
 *         do menu (o relatório do P4 di-lo).
 *
 * As cores esperadas leem-se de `src/styles/tokens.css` (o `--paper` do `:root` e o do `:root[data-theme='dark']`),
 * por esta régua e não pela folha construída que ela mede.
 *
 * AS PLANTAS (`--prova`) servem a mesma construção com um estrago, pelo servidor desta régua e sem tocar no `dist/`,
 * e cada uma tem de fazer a sua célula falhar com a queixa esperada: a paleta escura pela preferência do sistema
 * (TM1), a guarda tirada do `<head>`, a guarda no fim do `<body>` e, desde a P4-c, um manipulador que aplica o claro
 * a todos os cliques (TM3), o comando tirado do cabeçalho e um botão com 30 px (TM2), uma sétima porta e a letra do
 * menu de antes do P4 (TM4), e o menu sem dobrar a 320 px (TM4).
 *
 *   node tests/inicio/tema-e-menu.mjs [--prova] [--json <ficheiro>]      (OEDP_DIST mede outra construção)
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
const LARGURAS = [390, 768, 1024, 1280, 1600];
const ESTREITAS = [320, 360];
const PAGINAS = [
  ['/', 'pt'], ['/en/', 'en'],
  ['/lugares/', 'pt'], ['/en/places/', 'en'],
  ['/uniao-europeia/', 'pt'], ['/en/european-union/', 'en'],
];

/* --------------------------------------------------------------- os papéis, lidos dos tokens por esta régua */
const tokens = await fs.readFile(path.join(RAIZ, 'src', 'styles', 'tokens.css'), 'utf8');
const papelDe = (bloco) => /--paper:\s*(#[0-9a-fA-F]{6})/.exec(bloco ?? '')?.[1]?.toLowerCase() ?? null;
const PAPEL_CLARO = papelDe(/(?:^|\})\s*:root\s*\{([^{}]*)\}/.exec(tokens.replace(/\/\*[\s\S]*?\*\//g, ''))?.[1]);
const PAPEL_ESCURO = papelDe(/:root\[data-theme='dark'\]\s*\{([^{}]*)\}/.exec(tokens.replace(/\/\*[\s\S]*?\*\//g, ''))?.[1]);
if (!PAPEL_CLARO || !PAPEL_ESCURO) {
  console.error(`tema-e-menu: não li os dois papéis em tokens.css (claro ${PAPEL_CLARO}, escuro ${PAPEL_ESCURO}).`);
  process.exit(2);
}
const rgb = (hex) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;

/* --------------------------------------------------------------- o servidor, com o estrago da planta ativa */
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
/** @type {{ html?: (s: string) => string, css?: (s: string) => string, js?: (s: string) => string } | null} */
let estrago = null;
const servidor = http.createServer(async (q, r) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(q.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw new Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    const ext = path.extname(f);
    r.setHeader('Content-Type', tipos[ext] ?? 'application/octet-stream');
    if (estrago?.html && ext === '.html') return r.end(estrago.html(await fs.readFile(f, 'utf8')));
    if (estrago?.css && ext === '.css') return r.end(estrago.css(await fs.readFile(f, 'utf8')));
    if (estrago?.js && ext === '.js') return r.end(estrago.js(await fs.readFile(f, 'utf8')));
    r.end(await fs.readFile(f));
  } catch { r.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ headless: true });

/**
 * Uma página num contexto novo. `guardado` é o que fica em `localStorage.tema` antes de a página correr, uma vez
 * por separador (a recarga já não o repõe); `ordem` liga o observador da ordem do atributo e do `<body>`.
 */
async function abre(rota, largura, { esquema = 'light', guiao = true, guardado = null } = {}) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: esquema,
    reducedMotion: 'reduce', javaScriptEnabled: guiao });
  const externos = [];
  await ctx.route('**/*', (rq) => (rq.request().url().startsWith(origem) ? rq.continue() : (externos.push(rq.request().url()), rq.abort())));
  if (guiao) {
    await ctx.addInitScript((valor) => {
      /* A ORDEM DAS DUAS MUDANÇAS. Um observador do documento inteiro, posto antes de qualquer guião da página, regista
         pela ordem em que acontecem a mudança do atributo da raiz e a entrada do <body>. Os registos de um observador
         chegam na ordem das mutações, e por isso a ordem lida é a do documento. */
      const marcas = [];
      Object.defineProperty(window, '__ordemDoTema', { value: marcas });
      new MutationObserver((registos) => {
        for (const r of registos) {
          if (r.type === 'attributes' && r.attributeName === 'data-theme' && r.target === document.documentElement) marcas.push('tema');
          if (r.type === 'childList') for (const n of r.addedNodes) if (n.nodeName === 'BODY') marcas.push('corpo');
        }
      }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-theme'] });
      try {
        if (valor !== null && !sessionStorage.getItem('p4-tema-posto')) { localStorage.setItem('tema', valor); sessionStorage.setItem('p4-tema-posto', '1'); }
      } catch { /* sem armazenamento, sem escolha */ }
    }, guardado);
  }
  const p = await ctx.newPage();
  const resposta = await p.goto(origem + rota, { waitUntil: 'networkidle' });
  if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p, externos };
}

const estadoDaPagina = (p) => p.evaluate(() => {
  const g = document.querySelector('header [data-tema-controlo]');
  const caixa = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, d: b.right }; };
  return {
    atributo: document.documentElement.getAttribute('data-theme'),
    fundo: getComputedStyle(document.body).backgroundColor,
    cor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content')?.toLowerCase() ?? null,
    guardado: (() => { try { return localStorage.getItem('tema'); } catch { return 'recusado'; } })(),
    comando: g ? { hidden: g.hidden, caixa: caixa(g), noCabecalho: !!g.closest('header'),
      botoes: [...g.querySelectorAll('button[data-tema]')].map((b) => ({ tema: b.getAttribute('data-tema'), premido: b.getAttribute('aria-pressed'), caixa: caixa(b), texto: b.textContent.trim() })) } : null,
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    ordem: window.__ordemDoTema ? [...window.__ordemDoTema] : null,
    menu: (() => {
      const n = document.querySelector('#nav-principal');
      const as = n ? [...n.querySelectorAll('a')].map((a) => a.getBoundingClientRect()) : [];
      const c = n?.getBoundingClientRect();
      return { portas: as.length, topos: [...new Set(as.map((a) => Math.round(a.top)))].length,
        dentro: !!c && as.every((a) => a.left >= c.left - 0.5 && a.right <= c.right + 0.5),
        direita: as.length ? Math.max(...as.map((a) => a.right)) : 0, transborda: n ? n.scrollWidth > n.clientWidth : false };
    })(),
  };
});

/* ------------------------------------------------------------------------------------------------- as células */
async function tm1(rota, largura) {
  const falhas = [];
  for (const guiao of [true, false]) {
    const { ctx, p, externos } = await abre(rota, largura, { esquema: 'dark', guiao });
    try {
      const e = await estadoDaPagina(p);
      const onde = `${rota} a ${largura} px, aparelho escuro, ${guiao ? 'com' : 'sem'} guião`;
      if (e.atributo !== null) falhas.push(`TM1 · ${onde}: a raiz leva data-theme="${e.atributo}" sem escolha nenhuma.`);
      if (e.fundo !== rgb(PAPEL_CLARO)) falhas.push(`TM1 · ${onde}: o fundo é ${e.fundo} e o papel claro é ${rgb(PAPEL_CLARO)}.`);
      if (!guiao && e.comando && (!e.comando.hidden || e.comando.caixa.w > 0)) falhas.push(`TM1 · ${onde}: o comando aparece sem guião, a comandar nada.`);
      if (externos.length) falhas.push(`TM1 · ${onde}: ${externos.length} pedido(s) para fora.`);
    } finally { await ctx.close(); }
  }
  return falhas;
}

async function tm2(rota, largura) {
  const { ctx, p } = await abre(rota, largura);
  try {
    const e = await estadoDaPagina(p);
    const onde = `${rota} a ${largura} px`;
    const c = e.comando;
    if (!c) return [`TM2 · ${onde}: não há comando do tema no cabeçalho.`];
    const f = [];
    if (c.hidden || !c.caixa || c.caixa.w <= 0 || c.caixa.h <= 0) f.push(`TM2 · ${onde}: o comando não está à vista.`);
    else if (c.caixa.x < 0 || c.caixa.d > e.janela + 0.5) f.push(`TM2 · ${onde}: o comando sai da janela (${Math.round(c.caixa.x)} a ${Math.round(c.caixa.d)} numa janela de ${e.janela}).`);
    if (c.botoes.length !== 2) f.push(`TM2 · ${onde}: o comando tem ${c.botoes.length} botões.`);
    for (const b of c.botoes) {
      if (!b.caixa || b.caixa.w < 44 - 0.01 || b.caixa.h < 44 - 0.01) f.push(`TM2 · ${onde}: o botão «${b.texto}» mede ${b.caixa ? `${b.caixa.w.toFixed(1)} por ${b.caixa.h.toFixed(1)}` : 'nada'} px, e o alvo é de 44 por 44.`);
    }
    const premidos = c.botoes.map((b) => `${b.tema}:${b.premido}`).join(' ');
    if (premidos !== 'light:true dark:false') f.push(`TM2 · ${onde}: os botões dizem ${premidos} sem escolha nenhuma.`);
    return f;
  } finally { await ctx.close(); }
}

async function tm3(rota, largura) {
  const { ctx, p } = await abre(rota, largura);
  const onde = `${rota} a ${largura} px, sem nada guardado`;
  const f = [];
  /* Dois quadros depois de um toque: a mudança das fichas faz uma transição de 0,01 ms (a folha encurta-as com o
     movimento reduzido), e uma transição só acaba quando o navegador pinta; lido no mesmo quadro, o fundo ainda é o de
     partida. */
  const pinta = () => p.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  const premidos = (e) => e.comando?.botoes.map((b) => `${b.tema}:${b.premido}`).join(' ');
  try {
    const inicio = await estadoDaPagina(p);
    if (inicio.atributo !== null || inicio.fundo !== rgb(PAPEL_CLARO) || inicio.guardado !== null || inicio.cor !== PAPEL_CLARO) {
      f.push(`TM3 · ${onde}: a página não abriu clara (raiz «${inicio.atributo}», fundo ${inicio.fundo}, chave «${inicio.guardado}», cor da mobília ${inicio.cor}).`);
    }
    /* O LEITOR ESCOLHE O ESCURO PELO BOTÃO. */
    await p.click('header [data-tema-controlo] button[data-tema="dark"]');
    await pinta();
    const escuro = await estadoDaPagina(p);
    if (escuro.atributo !== 'dark' || escuro.guardado !== 'dark' || escuro.fundo !== rgb(PAPEL_ESCURO) || escuro.cor !== PAPEL_ESCURO || premidos(escuro) !== 'light:false dark:true') {
      f.push(`TM3 · ${onde}: o toque em «escuro» deixou a raiz «${escuro.atributo}», a chave «${escuro.guardado}», o fundo ${escuro.fundo}, a cor da mobília ${escuro.cor} e os botões ${premidos(escuro)}; o escuro é a raiz «dark», a chave «dark», o fundo ${rgb(PAPEL_ESCURO)} e a cor ${PAPEL_ESCURO}.`);
    }
    /* A RECARGA CONTINUA ESCURA, E O ESCURO APLICA-SE ANTES DA PRIMEIRA PINTURA. */
    await p.reload({ waitUntil: 'networkidle' });
    const recargaEscura = await estadoDaPagina(p);
    const iTema = recargaEscura.ordem?.indexOf('tema') ?? -1;
    const iCorpo = recargaEscura.ordem?.indexOf('corpo') ?? -1;
    if (iTema < 0 || iCorpo < 0 || iTema > iCorpo) f.push(`TM3 · ${onde}: depois de escolher o escuro, a escolha não se aplicou antes da primeira pintura (ordem lida: ${JSON.stringify(recargaEscura.ordem)}).`);
    if (recargaEscura.atributo !== 'dark' || recargaEscura.fundo !== rgb(PAPEL_ESCURO) || recargaEscura.cor !== PAPEL_ESCURO || premidos(recargaEscura) !== 'light:false dark:true') {
      f.push(`TM3 · ${onde}: depois de escolher o escuro, a recarga deu a raiz «${recargaEscura.atributo}», o fundo ${recargaEscura.fundo}, a cor da mobília ${recargaEscura.cor} e os botões ${premidos(recargaEscura)}.`);
    }
    /* E VOLTA AO CLARO PELO OUTRO BOTÃO. */
    await p.click('header [data-tema-controlo] button[data-tema="light"]');
    await pinta();
    const claro = await estadoDaPagina(p);
    if (claro.atributo !== null || claro.guardado !== 'light' || claro.fundo !== rgb(PAPEL_CLARO) || claro.cor !== PAPEL_CLARO || premidos(claro) !== 'light:true dark:false') {
      f.push(`TM3 · ${onde}: o toque em «claro» deixou a raiz «${claro.atributo}», a chave «${claro.guardado}», o fundo ${claro.fundo}, a cor da mobília ${claro.cor} e os botões ${premidos(claro)}.`);
    }
    await p.reload({ waitUntil: 'networkidle' });
    const recargaClara = await estadoDaPagina(p);
    if (recargaClara.atributo !== null || recargaClara.fundo !== rgb(PAPEL_CLARO) || recargaClara.cor !== PAPEL_CLARO) f.push(`TM3 · ${onde}: depois de escolher o claro, a recarga voltou a «${recargaClara.atributo}» (${recargaClara.fundo}, cor ${recargaClara.cor}).`);
  } finally { await ctx.close(); }
  return f;
}

async function tm4(rota, largura) {
  const { ctx, p } = await abre(rota, largura);
  try {
    const e = await estadoDaPagina(p);
    const onde = `${rota} a ${largura} px`;
    const f = [];
    if (e.menu.portas !== 6) f.push(`TM4 · ${onde}: o menu tem ${e.menu.portas} portas, e são seis.`);
    if (e.menu.transborda || e.menu.direita > e.janela + 0.5) f.push(`TM4 · ${onde}: o menu empurra a página para o lado (a última porta acaba a ${Math.round(e.menu.direita)} px numa janela de ${e.janela}).`);
    if (!estrago) larguraDoDocumento.push({ rota, largura, documento: e.documento, janela: e.janela });
    if (LARGURAS.includes(largura)) {
      if (e.menu.topos !== 1 || !e.menu.dentro) f.push(`TM4 · ${onde}: as portas não estão numa linha dentro do menu (${e.menu.topos} linha(s)).`);
    } else if (e.menu.topos < 2) f.push(`TM4 · ${onde}: a ${largura} px as seis portas não cabem numa linha e o menu não dobrou.`);
    return f;
  } finally { await ctx.close(); }
}

/* ----------------------------------------------------------------------------------------------- a corrida */
const prova = process.argv.includes('--prova');
const falhas = [];
/** A largura do documento em cada medida do menu, para o relatório; não é célula. */
const larguraDoDocumento = [];
const contas = { tm1: 0, tm2: 0, tm3: 0, tm4: 0 };
const plantas = [];
try {
  for (const [rota] of PAGINAS) {
    for (const largura of [390, 1280]) { falhas.push(...await tm1(rota, largura)); contas.tm1 += 2; }
    for (const largura of LARGURAS) { falhas.push(...await tm2(rota, largura)); contas.tm2++; }
    falhas.push(...await tm3(rota, 390)); contas.tm3++;
    for (const largura of [...ESTREITAS, ...LARGURAS]) { falhas.push(...await tm4(rota, largura)); contas.tm4++; }
  }

  if (prova) {
    const guarda = /<script>\(function\(\)\{try\{if\(localStorage\.getItem\('tema'\)==='dark'\)[\s\S]*?<\/script>/;
    const MANIPULADOR = "aplica(botao.getAttribute('data-tema') === ESCURO ? ESCURO : CLARO, true);";
    const tema = await fs.readFile(path.join(DIST, 'js', 'tema.js'), 'utf8');
    if (!tema.includes(MANIPULADOR)) falhas.push('A planta do manipulador não se planta: o guião do tema já não tem a linha que ela troca.');
    const PLANTAS = [
      ['a paleta escura pela preferência do sistema', { css: (s) => `${s}@media (prefers-color-scheme:dark){:root{--paper:${PAPEL_ESCURO}}}` }, () => tm1('/', 390), /TM1 · .*o fundo é rgb/],
      ['a guarda tirada do <head>', { html: (s) => s.replace(guarda, '') }, () => tm3('/lugares/', 390), /TM3 · .*não se aplicou antes da primeira pintura/],
      /* P4-c (achado 5): o manipulador do comando passa a aplicar o claro a todos os cliques. A troca tem de acontecer no
         guião servido, e a planta di-lo se o texto do manipulador mudar e a troca não se fizer. */
      ['um manipulador que aplica o claro a todos os cliques', { js: (s) => s.replace(MANIPULADOR, 'aplica(CLARO, true);') }, () => tm3('/', 390), /TM3 · .*o toque em «escuro» deixou a raiz «null»/],
      ['a guarda no fim do <body>', { html: (s) => { const m = guarda.exec(s); return m ? s.replace(m[0], '').replace('</body>', `${m[0]}</body>`) : s; } }, () => tm3('/en/', 390), /TM3 · .*não se aplicou antes da primeira pintura/],
      ['o comando tirado do cabeçalho', { html: (s) => s.replace(/<div class="tema"[^>]*data-tema-controlo[^>]*>[\s\S]*?<\/div>/, '') }, () => tm2('/uniao-europeia/', 1024), /TM2 · .*não há comando do tema/],
      ['um botão do tema com 30 px', { html: (s) => s.replace('</head>', '<style>.tema-b{min-height:30px!important;min-width:30px!important;height:30px!important}</style></head>') }, () => tm2('/en/places/', 390), /TM2 · .*mede .* px, e o alvo é de 44 por 44/],
      ['uma sétima porta no menu', { html: (s) => s.replace(/(<nav class="menu-cinco"[^>]*>[\s\S]*?)(<\/nav>)/, '$1<a href="/agenda">Agenda</a>$2') }, () => tm4('/', 1280), /TM4 · .*o menu tem 7 portas/],
      ['a letra do menu de antes do P4', { html: (s) => s.replace('</head>', '<style>@media (width<=430px){.menu-cinco{gap:0 12px!important}.menu-cinco a{font-size:13.5px!important;letter-spacing:.03em!important}}</style></head>') }, () => tm4('/', 390), /TM4 · .*não estão numa linha/],
      ['o menu sem dobrar a 320 px', { html: (s) => s.replace('</head>', '<style>.menu-cinco{flex-wrap:nowrap!important}</style></head>') }, () => tm4('/en/', 320), /TM4 · .*(empurra a página para o lado|não dobrou)/],
    ];
    for (const [nome, e, cel, mordida] of PLANTAS) {
      estrago = e;
      let queixas;
      try { queixas = await cel(); } finally { estrago = null; }
      const mordeu = queixas.some((q) => mordida.test(q));
      plantas.push({ nome, mordeu, queixa: queixas.find((q) => mordida.test(q)) ?? queixas[0] ?? null });
      if (!mordeu) falhas.push(`A planta não mordeu: ${nome}${queixas.length ? ` (queixou-se de outra coisa: ${queixas[0]})` : ''}`);
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}

const relatorio = { papeis: { claro: PAPEL_CLARO, escuro: PAPEL_ESCURO }, contas, falhas, plantas,
  documentos_mais_largos_do_que_a_janela: larguraDoDocumento.filter((d) => d.documento > d.janela) };
const j = process.argv.indexOf('--json');
if (j >= 0) await fs.writeFile(process.argv[j + 1], JSON.stringify(relatorio, null, 2) + '\n');
console.log(`tema e menu · TM1 ${contas.tm1} corrida(s), TM2 ${contas.tm2}, TM3 ${contas.tm3}, TM4 ${contas.tm4}` +
  (prova ? ` · ${plantas.length} planta(s), ${plantas.filter((p) => p.mordeu).length} a morder` : ''));
for (const p of plantas) console.log(`  ${p.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome}`);
if (falhas.length) { console.error(falhas.join('\n')); process.exitCode = 1; }
else console.log('tema e menu · todas as células a 0.');
