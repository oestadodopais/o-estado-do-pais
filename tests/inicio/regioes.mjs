#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DAS REGIÕES · Emenda 21, RG4 do BRIEF-regioes
 * =============================================================================
 *
 * Uma célula por alvo que o brief escreve, medida em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e SAI COM 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/mapa-distritos.mjs`. O código de saída é o
 * que faz um estrago plantado ser visível (regra 14 da casa).
 *
 *   node tests/inicio/regioes.mjs
 *   node tests/inicio/regioes.mjs --json <ficheiro>
 *   node tests/inicio/regioes.mjs --vermelhos
 *
 * O servidor toma uma porta livre (`listen(0)`), como as outras réguas da casa.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE
 * ---------------------------------------------------------------------------
 * M1 · o computador, a 1280. O EIXO está à vista, com uma marca por leitura, e
 * duas chapas de rótulo nunca se cruzam. É a célula (4b) da matriz da primeira
 * página, que saiu a 25.08 com a régua e volta aqui: os rótulos sobrepunham-se, e
 * era esse o defeito medido (achado B4 da auditoria de UI e UX).
 *
 * M2 · o telemóvel, a 320, 360, 390 e 430 — as quatro larguras que a casa serve.
 * O EIXO SAI e a lista É a régua (Emenda 21a): uma linha por região, a barra em
 * cada uma, o 100 marcado, e NENHUM rótulo de escala à vista. É a célula (4) da
 * matriz, mudada porque o objecto mudou: a porta do telemóvel que ela media
 * deixou de existir, e o que o telemóvel tem é a lista.
 *
 * M3 · nada se sobrepõe na lista, a cada uma das quatro larguras: o nome e o
 * valor de uma linha não se cruzam, e a linha não transborda a página. É a outra
 * metade da célula (4b), à escala em que ela falhava.
 *
 * M4 · a neutralidade da Emenda 21c. Um só estilo de barra em todas as linhas de
 * todas as páginas medidas (enchimento, altura, traço), nenhuma cor de estado no
 * desenho, e na página de uma região o CONTORNO é a única diferença entre a
 * linha dela e as outras.
 *
 * M5 · os endereços antigos. `?ambito=regiao:<slug>` levava a um estado da
 * primeira página e leva agora à página da região; a referência e uma região que
 * não existe levam ao índice. Seis navegações reais, três por edição.
 *
 * M6 · sem JavaScript. A régua está completa no HTML servido: a página responde
 * à pergunta sem script nenhum, que é a condição de a régua completa viver aqui.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

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
   ficheiro e o navegador, como em `mapa-distritos.mjs`. */
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
async function pagina(rota, largura, comJs = true) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 }, javaScriptEnabled: comJs });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: comJs ? 'networkidle' : 'load' });
  if (comJs) await p.evaluate(() => document.fonts.ready);
  return p;
}

const ALVO = 44;
const TELEMOVEL = [320, 360, 390, 430];
/* As leituras que a régua tem de desenhar, lidas do `dist/` e não de uma lista
   escrita aqui: a régua do índice é a régua, e o que se mede é que as páginas
   concordam com ela. */
const LEITURAS = (() => {
  const html = fs.readFileSync(path.join(DIST, 'regioes', 'index.html'), 'utf8');
  return [...html.matchAll(/data-conv-linha="([^"]+)"/g)].map((m) => m[1]);
})();

/** As caixas que interessam de uma página com régua, medidas no navegador. */
async function leAsCaixas(p) {
  return p.evaluate(() => {
    const caixa = (el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    const visivel = (el) => el.getClientRects().length > 0;
    const eixo = document.querySelector('.conv-eixo');
    const svg = document.querySelector('svg.rule-svg');
    const linhas = [...document.querySelectorAll('[data-conv-linha]')];
    return {
      eixoVisivel: eixo ? visivel(eixo) : false,
      eixoCaixa: svg && visivel(svg) ? caixa(svg) : null,
      /* Os rótulos da escala do eixo: os números que o telemóvel não pode ter à
         vista. São `text.tk` dentro do desenho. */
      rotulosDoEixo: [...document.querySelectorAll('svg.rule-svg text.tk')].filter(visivel).length,
      /* AS CHAPAS NÃO SE MEDEM UMAS CONTRA AS OUTRAS, e a régua aprendeu-o na
         primeira corrida: a chapa de papel vai de `y-37` a `y+4` e os patamares
         estão a 30 unidades uns dos outros, pelo que duas chapas de patamares
         vizinhos cruzam-se SEMPRE em 11 unidades — é o desenho da casa, e a
         chapa existe para tapar as hastes por trás do rótulo. O que não pode
         acontecer é um RÓTULO cruzar outro, ou uma chapa TAPAR um rótulo de
         outra marca, que é o que se via a 390 antes de a régua sair da primeira
         página (achado B4). São essas duas as medições. */
      marcasCaixas: [...document.querySelectorAll('svg.rule-svg [data-mk]')].map((g) => ({
        id: g.getAttribute('data-mk'),
        chapa: g.querySelector('.mk-chapa') ? caixa(g.querySelector('.mk-chapa')) : null,
        nome: g.querySelector('.mk-name') ? caixa(g.querySelector('.mk-name')) : null,
        valor: g.querySelector('.mk-val') ? caixa(g.querySelector('.mk-val')) : null,
      })),
      marcas: document.querySelectorAll('svg.rule-svg [data-mk]').length,
      linhas: linhas.map((li) => ({
        id: li.getAttribute('data-conv-linha'),
        caixa: caixa(li),
        nome: li.querySelector('.conv-nome') ? caixa(li.querySelector('.conv-nome')) : null,
        valor: li.querySelector('.conv-valor') ? caixa(li.querySelector('.conv-valor')) : null,
        barra: li.querySelector('.conv-barra') ? caixa(li.querySelector('.conv-barra')) : null,
        /* A referência a tinta, à altura toda: é a linha do 100 (Emenda 4). */
        referencia: !!li.querySelector('.conv-ref'),
        /* A PORTA É O NOME, e não o primeiro `<a>` da linha: a linha da
           referência não tem porta (Portugal não é uma região) e o seu primeiro
           `<a>` é o selo, que é outro alvo e outra medida. */
        porta: li.querySelector('.conv-nome a') ? caixa(li.querySelector('.conv-nome a')) : null,
        contorno: li.getAttribute('data-contorno') === 'sim',
      })),
      /* O 100 dito uma vez, em cima da lista. */
      refDita: !!document.querySelector('.conv-lista-ref'),
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      /* O estilo de cada barra, computado: é assim que uma cor de estatuto se vê. */
      barras: [...document.querySelectorAll('.conv-b')].map((b) => {
        const cs = getComputedStyle(b);
        return `${cs.fill}|${b.getAttribute('height')}|${cs.stroke}`;
      }),
    };
  });
}

const cruzam = (a, b) =>
  a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/* ===========================================================================
 * M1 · o computador
 * ========================================================================== */
async function mediuOComputador(marca = 'M1') {
  const p = await pagina('/regioes', 1280);
  const r = await leAsCaixas(p);
  const ms = r.marcasCaixas;
  let sobrepostas = 0;
  let tapados = 0;
  const quem = [];
  for (let i = 0; i < ms.length; i++) {
    for (let j = 0; j < ms.length; j++) {
      if (i === j) continue;
      if (j > i && (cruzam(ms[i].nome, ms[j].nome) || cruzam(ms[i].valor, ms[j].valor) ||
          cruzam(ms[i].nome, ms[j].valor) || cruzam(ms[i].valor, ms[j].nome))) {
        sobrepostas++;
        quem.push(`${ms[i].id}×${ms[j].id}`);
      }
      /* A chapa da marca j é desenhada depois da marca i quando j > i, e por
         isso só uma chapa POSTERIOR pode tapar um rótulo anterior. */
      if (j > i && (cruzam(ms[j].chapa, ms[i].nome) || cruzam(ms[j].chapa, ms[i].valor))) {
        tapados++;
        quem.push(`${ms[j].id} tapa ${ms[i].id}`);
      }
    }
  }
  medidas[marca] = { eixo: r.eixoCaixa, linhas: r.linhas.length, sobrepostas, tapados };
  conta(
    `${marca}a · 1280 · o eixo está à vista, com uma marca por leitura`,
    r.eixoVisivel && r.marcas === LEITURAS.length && r.rotulosDoEixo > 0,
    `eixo ${r.eixoCaixa ? `${r.eixoCaixa.w}×${r.eixoCaixa.h}` : 'fora'} · ${r.marcas} marcas para ${LEITURAS.length} leituras · ${r.rotulosDoEixo} rótulos de escala`,
  );
  conta(
    `${marca}b · 1280 · nenhum rótulo cruza outro nem é tapado por uma chapa`,
    sobrepostas === 0 && tapados === 0 && ms.length === LEITURAS.length,
    `${ms.length} marcas · ${sobrepostas} par(es) de rótulos cruzados · ${tapados} rótulo(s) tapado(s)${quem.length ? ' · ' + quem.join(', ') : ''}`,
  );
  conta(
    `${marca}c · 1280 · a lista tem uma linha por leitura, e a página não transborda`,
    r.linhas.length === LEITURAS.length && r.transbordo <= 0,
    `${r.linhas.length} linhas · transbordo ${r.transbordo}`,
  );
  await p.__ctx.close();
}

/* ===========================================================================
 * M2 e M3 · o telemóvel
 * ========================================================================== */
async function mediuOTelemovel(largura, marca) {
  const p = await pagina('/regioes', largura);
  const r = await leAsCaixas(p);
  medidas[marca] = {
    linhas: r.linhas.length,
    caixaDaLinha: r.linhas[0]?.caixa ?? null,
    barra: r.linhas[0]?.barra ?? null,
    transbordo: r.transbordo,
  };
  conta(
    `${marca}a · ${largura} · o eixo sai e a lista é a régua`,
    !r.eixoVisivel && r.rotulosDoEixo === 0 && r.linhas.length === LEITURAS.length,
    `eixo à vista: ${r.eixoVisivel} · ${r.rotulosDoEixo} rótulos de escala · ${r.linhas.length} linhas`,
  );
  conta(
    `${marca}b · ${largura} · cada linha tem barra, com a referência do 100`,
    r.linhas.every((l) => l.barra && l.barra.w > 0 && l.referencia) && r.refDita,
    `${r.linhas.filter((l) => l.barra).length} barras de ${r.linhas.length} · referência em cada linha: ${r.linhas.every((l) => l.referencia)} · o 100 dito uma vez: ${r.refDita}`,
  );
  conta(
    `${marca}c · ${largura} · a página não transborda`,
    r.transbordo <= 0,
    `transbordo ${r.transbordo} px · barra ${r.linhas[0]?.barra?.w ?? '—'} px`,
  );
  /* M3 · nada se sobrepõe dentro de uma linha. */
  const cruzados = r.linhas.filter((l) => cruzam(l.nome, l.valor));
  conta(
    `${marca.replace('M2', 'M3')} · ${largura} · o nome e o valor não se cruzam`,
    cruzados.length === 0,
    cruzados.length ? cruzados.map((l) => l.id).join(', ') : `${r.linhas.length} linhas medidas`,
  );
  /* E as portas continuam a ser alvos: uma porta que não se toca não é porta. */
  const portas = r.linhas.filter((l) => l.porta);
  const curtas = portas.filter((l) => l.porta.h < ALVO);
  conta(
    `${marca.replace('M2', 'M3')}b · ${largura} · as portas têm ${ALVO} px de altura`,
    portas.length > 0 && curtas.length === 0,
    `${portas.length} portas · a mais curta ${Math.min(...portas.map((l) => l.porta.h))} px`,
  );
  await p.__ctx.close();
}

/* ===========================================================================
 * M4 · a neutralidade
 * ========================================================================== */
async function mediuANeutralidade(marca = 'M4') {
  const estilos = new Set();
  let contornosNoIndice = 0;
  for (const rota of ['/regioes', '/regioes/alentejo', '/regioes/grande-lisboa']) {
    const p = await pagina(rota, 1280);
    const r = await leAsCaixas(p);
    for (const b of r.barras) estilos.add(b);
    if (rota === '/regioes') contornosNoIndice = r.linhas.filter((l) => l.contorno).length;
    if (rota !== '/regioes') {
      const slug = rota.split('/').pop();
      const daPagina = r.linhas.filter((l) => l.contorno);
      /* O contorno é a ÚNICA diferença: a linha distinguida tem o mesmo tipo, o
         mesmo corpo e a mesma barra que as outras, e um `outline` a mais. */
      const iguais = await p.evaluate(() => {
        const linhas = [...document.querySelectorAll('[data-conv-linha]')];
        const assinatura = (li) => {
          const nome = li.querySelector('.conv-nome');
          const cs = getComputedStyle(nome);
          return `${cs.fontSize}|${cs.fontWeight}|${cs.color}`;
        };
        return new Set(linhas.map(assinatura)).size;
      });
      conta(
        `${marca}b · ${rota} · o contorno é a única distinção`,
        daPagina.length === 1 && iguais === 1,
        `${daPagina.length} linha(s) com contorno (${daPagina.map((l) => l.id).join(',') || '—'}) · ${iguais} assinatura(s) de tipo nas ${r.linhas.length} linhas · slug ${slug}`,
      );
    }
    await p.__ctx.close();
  }
  conta(
    `${marca}a · um só estilo de barra em todas as páginas`,
    estilos.size === 1,
    `${estilos.size} estilo(s): ${[...estilos].join(' / ')}`,
  );
  conta(
    `${marca}c · o índice não distingue região nenhuma`,
    contornosNoIndice === 0,
    `${contornosNoIndice} linha(s) com contorno no índice`,
  );
}

/* ===========================================================================
 * M5 · os endereços antigos
 * ========================================================================== */
async function mediuOsEnderecosAntigos(marca = 'M5') {
  const casos = [
    ['pt', '/', 'regiao:alentejo', '/regioes/alentejo'],
    ['pt', '/', 'regiao:portugal', '/regioes'],
    ['pt', '/', 'regiao:atlantida', '/regioes'],
    ['en', '/en', 'regiao:alentejo', '/en/regions/alentejo'],
    ['en', '/en', 'regiao:portugal', '/en/regions'],
    ['en', '/en', 'regiao:atlantida', '/en/regions'],
  ];
  const lidos = [];
  let bem = true;
  for (const [edicao, home, antigo, esperado] of casos) {
    const p = await pagina(`${home}?ambito=${antigo}`, 1280);
    await p.waitForURL((u) => !u.search.includes('ambito=regiao'), { timeout: 5000 }).catch(() => {});
    const destino = new URL(p.url()).pathname.replace(/\/$/, '') || '/';
    lidos.push(`${edicao} ${antigo} → ${destino}`);
    if (destino !== esperado) bem = false;
    await p.__ctx.close();
  }
  medidas[marca] = lidos;
  conta(`${marca} · um endereço antigo leva à página da região`, bem, lidos.join(' · '));
}

/* ===========================================================================
 * M6 · sem JavaScript
 * ========================================================================== */
async function mediuSemJs(marca = 'M6') {
  const p = await pagina('/regioes', 1280, false);
  const r = await p.evaluate(() => ({
    linhas: document.querySelectorAll('[data-conv-linha]').length,
    marcas: document.querySelectorAll('svg.rule-svg [data-mk]').length,
    barras: document.querySelectorAll('.conv-b').length,
    portas: document.querySelectorAll('.conv-nome a').length,
  }));
  medidas[marca] = r;
  conta(
    `${marca} · sem JavaScript a régua está completa`,
    r.linhas === LEITURAS.length && r.marcas === LEITURAS.length && r.barras === LEITURAS.length,
    `${r.linhas} linhas · ${r.marcas} marcas · ${r.barras} barras · ${r.portas} portas`,
  );
  await p.__ctx.close();
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (regra 14)
 * ========================================================================== */
const PLANTAS = [
  {
    nome: 'o eixo de volta ao telemóvel, com os rótulos da escala',
    celulas: ['M2·320'],
    estrago: (html, rota) =>
      rota.startsWith('/regioes')
        ? html.replace(
            '</head>',
            '<style>@media (max-width:639.98px){.instr-conv .conv-eixo{display:block !important}}</style></head>',
          )
        : html,
  },
  {
    nome: 'uma região retirada da lista da régua',
    celulas: ['M1', 'M2·390'],
    estrago: (html, rota) =>
      rota.startsWith('/regioes')
        ? html.replace(/<li class="conv-linha" data-conv-linha="alg"[\s\S]*?<\/li>/, '')
        : html,
  },
  {
    nome: 'uma barra com a cor de um estatuto',
    celulas: ['M4'],
    estrago: (html, rota) =>
      rota === '/regioes' || rota === '/regioes/index.html'
        ? html.replace(
            '</head>',
            '<style>.conv-linha:first-child .conv-b{fill:var(--amber) !important}</style></head>',
          )
        : html,
  },
  {
    nome: 'o destino de um endereço antigo trocado pelo índice',
    celulas: ['M5'],
    estrago: (html, rota) =>
      rota === '/' || rota === '/index.html' || rota === '/en' || rota === '/en/index.html'
        ? html.replace(/data-regioes="[^"]*"/, 'data-regioes=""')
        : html,
  },
];

/* =========================================================================== */

async function corridaInteira() {
  await mediuOComputador();
  for (const w of TELEMOVEL) await mediuOTelemovel(w, `M2·${w}`);
  await mediuANeutralidade();
  await mediuOsEnderecosAntigos();
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

console.log('');
let todosVermelhos = true;
for (const planta of PLANTAS) {
  celulas = [];
  ESTRAGO = planta.estrago;
  if (planta.celulas.some((c) => c.startsWith('M1'))) await mediuOComputador();
  for (const w of TELEMOVEL) {
    if (planta.celulas.includes(`M2·${w}`)) await mediuOTelemovel(w, `M2·${w}`);
  }
  if (planta.celulas.includes('M4')) await mediuANeutralidade();
  if (planta.celulas.includes('M5')) await mediuOsEnderecosAntigos();
  const tocadas = celulas.filter((c) => planta.celulas.some((n) => c.nome.startsWith(n)));
  const apanhou = tocadas.some((c) => !c.passa);
  if (!apanhou) todosVermelhos = false;
  console.log(`  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`);
  for (const c of tocadas.filter((x) => !x.passa)) console.log(cinza(`      ${c.nome} · ${c.prova}`));
}
ESTRAGO = null;
console.log('');
await nav.close();
servidor.close();
process.exit(todosVermelhos ? 0 : 1);
