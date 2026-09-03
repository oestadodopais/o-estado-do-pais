#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DAS ÁREAS DE GOVERNO · decisão 6 da auditoria de 25.08.2026, forma A
 * =============================================================================
 *
 * Uma célula por alvo que o brief escreve, medida em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e SAI COM 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/regioes.mjs`. O código de saída é o que faz
 * um estrago plantado ser visível (regra 14 da casa).
 *
 *   node tests/inicio/areas.mjs
 *   node tests/inicio/areas.mjs --json <ficheiro>
 *   node tests/inicio/areas.mjs --vermelhos
 *
 * O servidor toma uma porta livre (`listen(0)`), como as outras réguas da casa.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE
 * ---------------------------------------------------------------------------
 * M1 · o índice, a 1280. Uma linha por área construída, cada uma com a sua
 *      contagem marcada `data-prova` e com a porta a ter os 44 px de alvo da
 *      casa. Zero transbordo.
 *
 * M2 · as peças de cada área. Cada peça rendida tem porta, e cada porta abre um
 *      ficheiro que existe no `dist/`; cada medida tem selo. Uma página de área
 *      sem peça nenhuma é uma página vazia, que é o que o brief proíbe.
 *
 * M3 · o nome. O `<h1>` de cada página de área é, carácter a carácter, o texto
 *      da porta que leva a ela no índice. Um nome trocado numa das duas pontas
 *      vê-se aqui.
 *
 * M4 · a voz. Nenhum bloco de prosa das duas rotas fora do
 *      `INVENTARIO-FRASES.md`, e nenhum classificado como autorreferência. É a
 *      segunda implementação da definição da medida 8 de `medir-defeitos.mjs`,
 *      feita no navegador e sobre o que o leitor vê: duas contas da mesma coisa,
 *      de sítios diferentes. As marcas que dispensam um texto do inventário são
 *      LIDAS daquela régua e não copiadas para aqui (I100).
 *
 * M5 · o telemóvel, a 320, 360, 390 e 430, as quatro larguras que a casa serve.
 *      Transbordo zero no índice e na maior página de área.
 *
 * M6 · a navegação. «Áreas» está no comando da primeira página e no rodapé, nas
 *      duas edições, e leva ao índice das áreas. Dois cliques reais.
 *
 * M7 · sem JavaScript. As duas páginas estão completas no HTML servido.
 *
 * M8 · a palavra do provisório. Onde a fonte marca um valor como provisório, a
 *      página di-lo por palavras, na palavra da EDIÇÃO e não na do componente, e
 *      di-lo exactamente nas medidas cuja linha traz a bandeira. É a mesma
 *      definição da célula 2i·2 de `tests/inicio/matriz.mjs`, aplicada às
 *      páginas das áreas, e existe porque a medição cega de 28.08.2026
 *      encontrou a palavra rendida e sem régua nenhuma nesta rota.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { leInventario } from '../../scripts/voz.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';

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

/* As áreas com página, lidas das pastas construídas e não de uma lista escrita
   aqui: uma lista escrita divergia do `dist/` na primeira área que entrasse. */
const SLUGS = fs
  .readdirSync(path.join(DIST, 'areas'))
  .filter((n) => fs.existsSync(path.join(DIST, 'areas', n, 'index.html')))
  .sort();

const EDICOES = [
  { edicao: 'pt', home: '/', indice: '/areas', area: (s) => `/areas/${s}` },
  { edicao: 'en', home: '/en', indice: '/en/areas', area: (s) => `/en/areas/${s}` },
];

/** O ficheiro construído de um caminho interno, ou `null` quando não existe. */
function ficheiroDe(href) {
  if (!href || !href.startsWith('/')) return null;
  const limpo = href.split('#')[0].split('?')[0].replace(/\/$/, '');
  const alvo = path.join(DIST, limpo.replace(/^\//, ''), 'index.html');
  return fs.existsSync(alvo) ? alvo : null;
}

/* =========================================================================== */
/* M1 · o índice a 1280                                                       */
/* =========================================================================== */

async function mediuOIndice() {
  for (const { edicao, indice } of EDICOES) {
    const p = await pagina(indice, 1280);
    const lido = await p.evaluate((alvo) => {
      const caixa = (el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      };
      const itens = [...document.querySelectorAll('.areas-item')];
      return {
        itens: itens.length,
        portas: itens.map((li) => {
          const a = li.querySelector('a');
          return { texto: (a?.textContent ?? '').replace(/\s+/g, ' ').trim(), h: a ? caixa(a).h : 0 };
        }),
        contagens: itens.map((li) => {
          const el = li.querySelector('[data-prova]');
          return el ? { chave: el.getAttribute('data-prova'), texto: el.textContent.trim() } : null;
        }),
        pequenas: itens.filter((li) => {
          const a = li.querySelector('a');
          return !a || caixa(a).h < alvo;
        }).length,
        transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, ALVO);
    medidas[`M1·${edicao}`] = lido;
    conta(
      `M1 · o índice tem uma linha por área, com contagem e alvo de ${ALVO} px · 1280 ${edicao}`,
      lido.itens === SLUGS.length &&
        lido.pequenas === 0 &&
        lido.contagens.every((c) => c && /^\d+$/.test(c.texto)) &&
        lido.transbordo === 0,
      `${lido.itens} linha(s) para ${SLUGS.length} área(s) construída(s) · ${lido.pequenas} abaixo do alvo · ` +
        `contagens ${lido.contagens.map((c) => (c ? c.texto : 'sem')).join(', ')} · transbordo ${lido.transbordo}`,
    );
    await p.__ctx.close();
  }
}

/* =========================================================================== */
/* M2 · as peças de cada área, e as portas delas                              */
/* =========================================================================== */

async function mediuAsPecas() {
  for (const { edicao, area } of EDICOES) {
    let pecas = 0;
    let semPorta = 0;
    let medidasSemSelo = 0;
    let vazias = 0;
    const portasPartidas = [];
    for (const slug of SLUGS) {
      const p = await pagina(area(slug), 1280);
      const lido = await p.evaluate(() => {
        const itens = [...document.querySelectorAll('[data-area-peca]')];
        return {
          n: itens.length,
          detalhe: itens.map((el) => ({
            tipo: el.getAttribute('data-area-peca'),
            hrefs: [...el.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
            selo: [...el.querySelectorAll('a.src-chip[href]')].map((a) => a.getAttribute('href')),
          })),
        };
      });
      if (lido.n === 0) vazias++;
      pecas += lido.n;
      for (const d of lido.detalhe) {
        if (d.hrefs.length === 0) semPorta++;
        if (d.tipo === 'medida' && d.selo.length === 0) medidasSemSelo++;
        for (const h of d.hrefs) {
          if (h.startsWith('/') && !ficheiroDe(h)) portasPartidas.push(`${slug}:${h}`);
        }
      }
      await p.__ctx.close();
    }
    medidas[`M2·${edicao}`] = { pecas, semPorta, medidasSemSelo, vazias, portasPartidas };
    conta(
      `M2 · cada peça tem porta que abre, cada medida tem selo, nenhuma área vazia · ${edicao}`,
      pecas > 0 && semPorta === 0 && medidasSemSelo === 0 && vazias === 0 && portasPartidas.length === 0,
      `${pecas} peça(s) em ${SLUGS.length} área(s) · ${semPorta} sem porta · ${medidasSemSelo} medida(s) sem selo · ` +
        `${vazias} área(s) vazia(s) · ${portasPartidas.length} porta(s) que não abrem` +
        (portasPartidas.length ? ` (${portasPartidas.slice(0, 3).join(', ')})` : ''),
    );
  }
}

/* =========================================================================== */
/* M3 · o nome, nas duas pontas                                               */
/* =========================================================================== */

async function mediuOsNomes() {
  for (const { edicao, indice, area } of EDICOES) {
    const p = await pagina(indice, 1280);
    const doIndice = await p.evaluate(() =>
      [...document.querySelectorAll('.areas-item')].map((li) => {
        const a = li.querySelector('a[href]');
        /* O NOME É O SEU PRÓPRIO ELEMENTO, e não o texto da ligação: a linha
           inteira é uma ligação e leva também a contagem das peças. A seta é
           mobília da porta e sai antes de comparar, como sai no índice das 29
           unidades. */
        const n = li.querySelector('.areas-nome');
        return {
          href: a?.getAttribute('href') ?? null,
          nome: (n?.textContent ?? '').replace(/\s+/g, ' ').replace(/\s*→\s*$/, '').trim(),
        };
      }),
    );
    await p.__ctx.close();

    const maus = [];
    for (const slug of SLUGS) {
      const q = await pagina(area(slug), 1280);
      const h1 = await q.evaluate(
        () => (document.querySelector('h1')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
      );
      await q.__ctx.close();
      const linha = doIndice.find((x) => x.href && x.href.replace(/\/$/, '').endsWith(`/${slug}`));
      if (!linha) maus.push(`${slug}: sem porta no índice`);
      else if (linha.nome !== h1) maus.push(`${slug}: índice «${linha.nome}» e página «${h1}»`);
    }
    medidas[`M3·${edicao}`] = { doIndice, maus };
    conta(
      `M3 · o nome de cada área é o mesmo no índice e na sua página · ${edicao}`,
      maus.length === 0 && doIndice.length === SLUGS.length,
      maus.length ? maus.join(' · ') : `${doIndice.length} nome(s), todos iguais nas duas pontas`,
    );
  }
}

/* =========================================================================== */
/* M4 · a voz das duas rotas                                                  */
/* =========================================================================== */

/**
 * A DEFINIÇÃO DE «BLOCO DE PROSA DA CASA», ESCRITA OUTRA VEZ E NO NAVEGADOR.
 *
 * É a da medida 8 de `scripts/medir-defeitos.mjs`, e está aqui de propósito: a
 * régua da voz lê o `dist/` com um analisador de HTML, esta lê o DOM que o
 * navegador construiu. Duas implementações da mesma definição, de dois sítios,
 * que têm de dizer a mesma coisa. Um bloco é um elemento de bloco que não contém
 * outro, que não é nem contém uma origem declarada, nem o nome ou a unidade de
 * uma medida, nem uma marca de cobertura, de lugar ou de nome, e cujo texto não
 * está todo dentro de um `<a>` ou de um `<button>`.
 *
 * ---------------------------------------------------------------------------
 * AS MARCAS LEEM-SE DA RÉGUA DA CASA, E NÃO SE COPIAM PARA AQUI (I100)
 * ---------------------------------------------------------------------------
 * A lista das marcas estava escrita à mão nas duas pontas, e a segunda ficou
 * para trás: `data-nome` entrou em `medir-defeitos.mjs` a 29.08.2026 e esta
 * célula não soube dela, o que pôs a M4 vermelha com dezoito blocos que eram os
 * nove nomes das áreas, duas vezes, enquanto `npm run check:voz` dizia «nada por
 * classificar» na mesma construção. Não é a primeira marca a entrar nesta lista
 * e não será a última, e uma lista que cresce num sítio e não no outro volta a
 * partir-se. Passa a ser LIDA do ficheiro que a declara, e esta corrida pára com
 * o nome da constante que não encontrou, em vez de medir com meia definição.
 *
 * PORQUE É QUE A CÉLULA NÃO CHAMA `medir-defeitos.mjs` COMO A M7 DA RÉGUA DO
 * MAPA. Porque perdia o estrago plantado, que é o que faz o verde valer alguma
 * coisa (regra 14 da casa). Os estragos desta régua são uma transformação do
 * HTML no caminho entre o ficheiro e o navegador, e nunca em disco; a outra
 * régua lê o `dist/` do disco, e um bloco de prosa plantado à saída do servidor
 * nunca lhe chegaria. Ficaria uma célula com o número certo e sem controlo
 * positivo nenhum.
 *
 * A SUBSTITUIÇÃO NA DESCRIÇÃO É PARTE DA MARCA, E NÃO UM EXTRA. A régua da casa
 * troca na `<meta name="description">` o texto de cada elemento marcado pelo
 * lugar que ele ocupa (`<lugar>` e `<nome>`), para que uma descrição composta
 * com o nome de uma área se conte uma vez e não uma por área. Sem essa troca a
 * marca ficava meio aprendida: metade dos dezoito blocos por classificar era o
 * `<h1>` marcado, e a outra metade era a descrição composta com o mesmo nome.
 *
 * O QUE CONTINUA DIFERENTE, E ESTÁ MEDIDO. A lista dos ELEMENTOS de bloco não se
 * lê de lá: aqui traz `div` e não traz `span.eyebrow`. A diferença nas vinte
 * rotas desta célula é de zero blocos, medida a 29.08.2026 nas duas formas (103
 * blocos por edição em ambas), e por isso fica como está em vez de mudar sem
 * efeito. O que cresce é a lista das marcas, e é essa que passa a ter uma fonte
 * só.
 */
const INVENTARIO = leInventario(RAIZ);

/** O ficheiro que declara as marcas, lido como texto e não importado: um
    `import` corria a régua inteira, que varre os 6 606 ficheiros de `dist/`. */
const REGUA_DA_VOZ = path.join(RAIZ, 'scripts', 'medir-defeitos.mjs');
const FONTE_DA_REGUA = fs.readFileSync(REGUA_DA_VOZ, 'utf8');

/**
 * Um seletor declarado em `scripts/medir-defeitos.mjs`, pelo nome da constante.
 *
 * A constante pode estar escrita em várias cadeias somadas, e o que se devolve é
 * a soma. Se ela mudar de nome ou de forma, isto morre com o nome dela: uma
 * definição partilhada não pode envelhecer calada.
 */
function seletorDaRegua(nome) {
  const m = new RegExp(`\\bconst ${nome} =([\\s\\S]*?);\\n`).exec(FONTE_DA_REGUA);
  if (!m) {
    console.error(
      `não encontrei \`const ${nome}\` em scripts/medir-defeitos.mjs. ` +
        `A M4 mede com as marcas que essa régua declara, e não as pode adivinhar.`,
    );
    process.exit(2);
  }
  const partes = [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
  if (!partes.length) {
    console.error(`\`const ${nome}\` de scripts/medir-defeitos.mjs não traz nenhum seletor.`);
    process.exit(2);
  }
  return partes.join('');
}

/* As cinco constantes que `frasesDaCasa()` soma, pela mesma ordem. `[data-prova]`
   NÃO está lá, e é de propósito: um bloco com um número da prova continua a ser
   prosa da casa, e a régua declara-o. */
const ORIGEM_DECLARADA_DA_CASA = [
  'ORIGEM_DECLARADA',
  'MEDIDA_DECLARADA',
  'COBERTURA_DECLARADA',
  'LUGAR_DECLARADO',
  'NOME_DECLARADO',
]
  .map(seletorDaRegua)
  .join(',');

/* As duas marcas cujo texto sai da descrição e deixa lá o lugar que ocupava. São
   as marcas de NOME: um lugar e uma coisa de um ficheiro de dados. Uma marca
   nova que nomeie alguma coisa entra aqui com o seu lugar; as outras não. */
const MARCAS_NA_DESCRICAO = [
  [seletorDaRegua('LUGAR_DECLARADO'), '<lugar>'],
  [seletorDaRegua('NOME_DECLARADO'), '<nome>'],
];

async function mediuAVoz() {
  for (const { edicao, indice, area } of EDICOES) {
    const rotas = [indice, ...SLUGS.map((s) => area(s))];
    const foraDoInventario = [];
    const autorreferencia = [];
    let blocos = 0;
    for (const rota of rotas) {
      const p = await pagina(rota, 1280);
      const lidos = await p.evaluate(([ORIGEM, MARCAS]) => {
        const BLOCOS = 'p,li,h1,h2,h3,h4,dt,dd,figcaption,caption,td,th,summary,blockquote,div';
        const marcados = new Set();
        for (const el of document.querySelectorAll(ORIGEM)) {
          marcados.add(el);
          for (const d of el.querySelectorAll('*')) marcados.add(d);
          for (let a = el.parentElement; a; a = a.parentElement) marcados.add(a);
        }
        const semComandos = (no) => {
          const partes = [];
          const anda = (n) => {
            if (n.nodeType === Node.TEXT_NODE) return void partes.push(n.textContent);
            if (n.nodeType !== Node.ELEMENT_NODE) return;
            const tag = n.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style' || tag === 'a' || tag === 'button') return;
            for (const f of n.childNodes) anda(f);
          };
          anda(no);
          return partes.join(' ').replace(/\s+/g, ' ').trim();
        };
        /* A CADEIA QUE SE DECLARA É A INTEIRA, e o texto fora das ligações é só o
           crivo. É assim na régua: `frasesDaCasa()` empurra `norm(texto(el))` e
           usa `textoForaDeComandos(el)` para decidir se o bloco entra. Empurrar
           a versão sem ligações mediria outra cadeia, e o inventário nunca
           bateria certo. */
        const inteiro = (el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim();
        const out = [];
        for (const el of document.querySelectorAll(BLOCOS)) {
          if (el.querySelector(BLOCOS)) continue;
          if (marcados.has(el)) continue;
          if (el.tagName.toLowerCase() === 'summary') continue;
          if (!inteiro(el)) continue;
          if (!semComandos(el)) continue;
          out.push(inteiro(el));
        }
        /* A DESCRIÇÃO DO `<head>` É SUPERFÍCIE PÚBLICA E CONTA COMO UM BLOCO, com
           o texto de cada elemento marcado trocado pelo lugar que ele ocupa. É a
           mesma troca da régua da casa, e sem ela a descrição de uma página de
           área contava-se uma vez por área em vez de uma vez. */
        const d = document.querySelector('head meta[name="description"]');
        let descricao = (d?.getAttribute('content') ?? '').replace(/\s+/g, ' ').trim();
        for (const [seletor, marca] of MARCAS) {
          for (const el of document.querySelectorAll(seletor)) {
            const nome = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
            if (nome) descricao = descricao.split(nome).join(marca).replace(/\s+/g, ' ').trim();
          }
        }
        if (descricao) out.push(descricao);
        return out;
      }, [ORIGEM_DECLARADA_DA_CASA, MARCAS_NA_DESCRICAO]);
      await p.__ctx.close();
      for (const texto of lidos) {
        blocos++;
        const classe = INVENTARIO.mapa.get(texto) ?? null;
        if (classe === null) foraDoInventario.push(`${rota}: «${texto.slice(0, 80)}»`);
        else if (classe === 'autorreferencia') autorreferencia.push(`${rota}: «${texto.slice(0, 80)}»`);
      }
    }
    medidas[`M4·${edicao}`] = { blocos, foraDoInventario, autorreferencia };
    conta(
      `M4 · nenhum bloco fora do inventário e nenhum de autorreferência · ${edicao}`,
      foraDoInventario.length === 0 && autorreferencia.length === 0,
      `${blocos} bloco(s) medido(s) · ${foraDoInventario.length} por classificar · ` +
        `${autorreferencia.length} de autorreferência` +
        (foraDoInventario.length ? ` (${foraDoInventario.slice(0, 2).join(' · ')})` : '') +
        (autorreferencia.length ? ` (${autorreferencia.slice(0, 2).join(' · ')})` : ''),
    );
  }
}

/* =========================================================================== */
/* M5 · o telemóvel                                                           */
/* =========================================================================== */

async function mediuOTelemovel(largura) {
  for (const { edicao, indice, area } of EDICOES) {
    const rotas = [indice, area(SLUGS[0])];
    const transbordos = [];
    for (const rota of rotas) {
      const p = await pagina(rota, largura);
      transbordos.push(
        await p.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      );
      await p.__ctx.close();
    }
    medidas[`M5·${largura}·${edicao}`] = transbordos;
    conta(
      `M5·${largura} · zero transbordo no índice e numa página de área · ${edicao}`,
      transbordos.every((t) => t <= 0),
      `transbordo ${transbordos.join(' e ')} px`,
    );
  }
}

/* =========================================================================== */
/* M6 · a navegação                                                           */
/* =========================================================================== */

async function mediuANavegacao() {
  for (const { edicao, home, indice } of EDICOES) {
    const p = await pagina(home, 1280);
    /* ---------------------------------------------------------------------
       «ÁREAS» MUDOU DE SÍTIO COM O F1.1 (03.09.2026), e a célula segue-a.
       Estava na quarta posição da fila do âmbito da primeira página, que era uma
       porta e não um estado (decisão 6 da auditoria de 25.08). A fila inteira
       saiu com o bloco da porta da frente, e com ela a palavra «Âmbito» que a
       nomeava (achado C6, decisão 3.4; brief F1.1 §1, item 6). As páginas das
       áreas passam a ter porta no MENU, que é o índice do sítio que está sempre
       à vista, ao lado das regiões e dos distritos, que também não a tinham
       (item 11 do mesmo brief).

       A CÉLULA MEDE A MESMA COISA NOUTRO SÍTIO: que «Áreas» tem porta, que a
       porta leva ao índice, e que o rodapé continua a ter a sua e leva ao mesmo
       lado. O que muda é qual é o primeiro dos dois caminhos. */
    const lido = await p.evaluate(() => ({
      comando:
        [...document.querySelectorAll('.nav-principal a[href]')]
          .map((a) => a.getAttribute('href'))
          .find((h) => /\/areas$/.test(h)) ?? null,
      rodape: [...document.querySelectorAll('footer.rodape a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => /\/areas$/.test(h)),
    }));
    await p.locator('.nav-principal a[href$="/areas"]:visible').first().click();
    await p.waitForLoadState('networkidle');
    const chegou = new URL(p.url()).pathname;
    await p.__ctx.close();

    const q = await pagina(home, 1280);
    await q.locator('footer.rodape a[href$="/areas"], footer.rodape a[href="/areas"]').first().click();
    await q.waitForLoadState('networkidle');
    const chegouRodape = new URL(q.url()).pathname;
    await q.__ctx.close();

    medidas[`M6·${edicao}`] = { ...lido, chegou, chegouRodape };
    conta(
      `M6 · «Áreas» no menu e no rodapé leva ao índice das áreas · ${edicao}`,
      lido.comando === indice &&
        lido.rodape.length === 1 &&
        chegou === indice &&
        chegouRodape === indice,
      `menu ${lido.comando} · rodapé ${lido.rodape.join(', ') || 'sem'} · ` +
        `cliques → ${chegou} e ${chegouRodape}`,
    );
  }
}

/* =========================================================================== */
/* M7 · sem JavaScript                                                        */
/* =========================================================================== */

async function mediuSemJs() {
  for (const { edicao, indice, area } of EDICOES) {
    const p = await pagina(indice, 1280, false);
    const noIndice = await p.evaluate(() => document.querySelectorAll('.areas-item').length);
    await p.__ctx.close();
    const q = await pagina(area(SLUGS[0]), 1280, false);
    const naArea = await q.evaluate(() => document.querySelectorAll('[data-area-peca]').length);
    await q.__ctx.close();
    medidas[`M7·${edicao}`] = { noIndice, naArea };
    conta(
      `M7 · sem script o índice e a página de uma área estão completos · ${edicao}`,
      noIndice === SLUGS.length && naArea > 0,
      `${noIndice} linha(s) no índice para ${SLUGS.length} área(s) · ${naArea} peça(s) em ${SLUGS[0]}`,
    );
  }
}

/* =========================================================================== */
/* M8 · a palavra do provisório                                               */
/* =========================================================================== */

/**
 * A PALAVRA VEM DA LINHA E NÃO DA PÁGINA, e por isso não está no inventário.
 *
 * `provisório` é a bandeira `source_flag: "p"` da linha do livro-razão dita por
 * palavras: é a palavra da FONTE sobre o número dela (o Eurostat marca assim os
 * valores regionais do primeiro ano), e não o sítio a falar do estado dos seus
 * próprios dados. Por isso fica, e por isso não é uma frase da casa: a régua da
 * voz deixa cair o bloco inteiro que a contém, porque ele contém uma origem
 * declarada, que é a mesma razão por que o valor também não entra no inventário.
 *
 * O QUE A GUARDA, ENTÃO, É ESTA CÉLULA. Duas contas, e as duas contam: a palavra
 * segue a edição, e o conjunto das medidas que a levam é exactamente o conjunto
 * das linhas com a bandeira.
 */
const LINHAS = loadClaims();

async function mediuOProvisorio() {
  for (const { edicao, area } of EDICOES) {
    const palavra = edicao === 'pt' ? 'provisório' : 'provisional';
    const outras = new Set();
    const comPalavra = new Set();
    const daBandeira = new Set();
    for (const slug of SLUGS) {
      const p = await pagina(area(slug), 1280);
      const lido = await p.evaluate(() => {
        const marcados = [];
        for (const el of document.querySelectorAll('.claim-provisorio')) {
          const caixa = el.closest('.claim');
          marcados.push({
            texto: el.textContent.trim(),
            id: caixa?.querySelector('[data-claim]')?.getAttribute('data-claim') ?? null,
          });
        }
        return {
          marcados,
          citados: [...document.querySelectorAll('[data-claim]')].map((el) =>
            el.getAttribute('data-claim'),
          ),
        };
      });
      await p.__ctx.close();
      for (const m of lido.marcados) {
        if (m.texto !== palavra) outras.add(m.texto);
        if (m.id) comPalavra.add(m.id);
      }
      for (const id of lido.citados) {
        if (LINHAS.get(id)?.source_flag === 'p') daBandeira.add(id);
      }
    }
    const aMais = [...comPalavra].filter((id) => !daBandeira.has(id));
    const aMenos = [...daBandeira].filter((id) => !comPalavra.has(id));
    medidas[`M8·${edicao}`] = {
      palavra,
      comPalavra: comPalavra.size,
      daBandeira: daBandeira.size,
      outras: [...outras],
      aMais,
      aMenos,
    };
    conta(
      `M8 · a palavra do provisório segue a edição e é a das linhas com bandeira · ${edicao}`,
      outras.size === 0 && aMais.length === 0 && aMenos.length === 0 && daBandeira.size > 0,
      `${comPalavra.size} medida(s) com «${palavra}» para ${daBandeira.size} linha(s) com bandeira · ` +
        `${aMais.length} a mais · ${aMenos.length} a menos` +
        (outras.size ? ` · outra(s) palavra(s): ${[...outras].join(', ')}` : ''),
    );
  }
}

/* =========================================================================== */
/* OS ESTRAGOS PLANTADOS                                                      */
/* =========================================================================== */
/* Os quatro que o brief nomeia: uma área sem peças, uma peça fantasma, um nome
   trocado e uma frase de cobertura. Cada um é uma transformação do HTML no
   caminho entre o ficheiro e o navegador, e nada é escrito em disco.

   CADA ESTRAGO DIZ QUE CÉLULAS TEM DE PÔR VERMELHAS, E POR EDIÇÃO (leitura
   cruzada do Codex, 29.08.2026). O corredor aceitava deteção parcial: bastava
   uma das células tocadas ficar vermelha para o estrago contar como apanhado, e
   por isso o estrago do `data-nome`, que estraga as duas edições, passava com
   uma delas por detetar. `celulas` continua a dizer que medições correr;
   `vermelhas` diz o resultado exigido, e é a lista exacta: as que lá estão têm
   de ficar vermelhas, e as outras que a medição produziu têm de ficar verdes.
   Um estrago que estrague mais do que declara é uma declaração errada, e uma
   declaração errada esconde o que o estrago não está a provar. */

const PRIMEIRA = () => `/areas/${SLUGS[0]}`;

const PLANTAS = [
  {
    nome: 'uma área sem peças',
    celulas: ['M2'],
    /* Só a edição portuguesa: o estrago cai na primeira área de `/areas/`. */
    vermelhas: ['M2·pt'],
    estrago: (html, rota) =>
      rota.replace(/\/index\.html$/, '') === PRIMEIRA()
        ? html.replace(/data-area-peca="[a-z]+"/g, 'data-peca-apagada="sim"')
        : html,
  },
  {
    nome: 'uma peça fantasma, com porta para uma página que não existe',
    celulas: ['M2'],
    vermelhas: ['M2·pt'],
    estrago: (html, rota) =>
      rota.replace(/\/index\.html$/, '') === PRIMEIRA()
        ? html.replace(
            '<div class="linha-corpo">',
            '<div class="linha-corpo"><ul><li data-area-peca="trabalho">' +
              '<a href="/estudos/atlantida">Atlântida</a></li></ul>',
          )
        : html,
  },
  {
    nome: 'um nome trocado na página de uma área',
    celulas: ['M3'],
    vermelhas: ['M3·pt'],
    estrago: (html, rota) =>
      rota.replace(/\/index\.html$/, '') === PRIMEIRA()
        ? html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/, '<h1$1>Atlântida</h1>')
        : html,
  },
  {
    nome: 'a palavra do provisório apagada de uma medida que a devia ter',
    celulas: ['M8'],
    /* Este cai nas duas edições, e as duas têm de o ver. */
    vermelhas: ['M8·pt', 'M8·en'],
    estrago: (html, rota) =>
      rota.startsWith('/areas/economia') || rota.startsWith('/en/areas/economia')
        ? html.replace('<span class="claim-provisorio">', '<span class="claim-apagada">')
        : html,
  },
  {
    nome: 'uma frase de cobertura no índice das áreas',
    celulas: ['M4'],
    vermelhas: ['M4·pt'],
    estrago: (html, rota) =>
      rota.replace(/\/index\.html$/, '') === '/areas'
        ? html.replace(
            '<ul class="areas-lista"',
            '<p>Verificámos todas as fontes destas áreas, uma a uma.</p><ul class="areas-lista"',
          )
        : html,
  },
  {
    /* O ESTRAGO DA I100. A marca que dispensa o nome de uma área do inventário
       é retirada da página, e o nome volta a ser prosa por classificar: no
       `<h1>`, no selo da referência legal e na descrição composta com ele. É o
       vermelho que a célula não sabia ver enquanto a lista das marcas estava
       escrita à mão aqui dentro. */
    nome: 'a marca `data-nome` retirada da página de uma área',
    celulas: ['M4'],
    /* As nove páginas de área das DUAS edições, e é este que apanhava o
       corredor antigo com uma edição por detetar. */
    vermelhas: ['M4·pt', 'M4·en'],
    estrago: (html, rota) =>
      rota.startsWith('/areas/') || rota.startsWith('/en/areas/')
        ? html.replace(/data-nome="/g, 'data-marca-apagada="')
        : html,
  },
];

/* =========================================================================== */

async function corridaInteira() {
  await mediuOIndice();
  await mediuAsPecas();
  await mediuOsNomes();
  await mediuAVoz();
  for (const w of TELEMOVEL) await mediuOTelemovel(w);
  await mediuANavegacao();
  await mediuSemJs();
  await mediuOProvisorio();
}

if (!VERMELHOS) {
  await corridaInteira();
  const falhadas = celulas.filter((c) => !c.passa);
  console.log('');
  for (const c of celulas) {
    console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}\n    ${cinza(c.prova)}`);
  }
  console.log(
    `\n  ${
      falhadas.length
        ? vermelho(`${celulas.length - falhadas.length} de ${celulas.length}`)
        : verde(`${celulas.length} de ${celulas.length}`)
    } célula(s)\n`,
  );
  if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
    fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, medidas }, null, 2));
  }
  await nav.close();
  servidor.close();
  process.exit(falhadas.length ? 1 : 0);
}

console.log('');
/**
 * Um alvo é «M4» (as duas edições) ou «M4·pt» (uma só). O nome de uma célula
 * abre pelo prefixo e fecha pela edição, e é assim que os dois se casam.
 */
function casaComOAlvo(nomeDaCelula, alvo) {
  const [prefixo, edicao] = alvo.split('·');
  if (!nomeDaCelula.startsWith(prefixo)) return false;
  return edicao ? nomeDaCelula.endsWith(`· ${edicao}`) : true;
}

let todosVermelhos = true;
for (const planta of PLANTAS) {
  celulas = [];
  ESTRAGO = planta.estrago;
  if (planta.celulas.includes('M2')) await mediuAsPecas();
  if (planta.celulas.includes('M3')) await mediuOsNomes();
  if (planta.celulas.includes('M4')) await mediuAVoz();
  if (planta.celulas.includes('M8')) await mediuOProvisorio();
  const tocadas = celulas.filter((c) => planta.celulas.some((n) => c.nome.startsWith(n)));

  /* TODAS AS DECLARADAS TÊM DE FICAR VERMELHAS, e cada alvo tem de casar com
     alguma célula: um alvo escrito à mão que não case com nada era um alvo que
     ninguém verificava. */
  const queixas = [];
  for (const alvo of planta.vermelhas) {
    const casadas = tocadas.filter((c) => casaComOAlvo(c.nome, alvo));
    if (!casadas.length) queixas.push(`o alvo «${alvo}» não casa com nenhuma célula corrida`);
    else for (const c of casadas.filter((x) => x.passa)) queixas.push(`${c.nome} ficou VERDE`);
  }
  /* E AS OUTRAS TÊM DE FICAR VERDES: um estrago que estrague mais do que declara
     está a ser creditado por um vermelho que não é o dele. */
  for (const c of tocadas) {
    if (planta.vermelhas.some((alvo) => casaComOAlvo(c.nome, alvo))) continue;
    if (!c.passa) queixas.push(`${c.nome} ficou vermelha e o estrago não a declara`);
  }

  const apanhou = queixas.length === 0;
  if (!apanhou) todosVermelhos = false;
  console.log(
    `  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}` +
      cinza(`  [${planta.vermelhas.join(', ')}]`),
  );
  for (const c of tocadas.filter((x) => !x.passa)) console.log(cinza(`      ${c.nome} · ${c.prova}`));
  for (const q of queixas) console.log(vermelho(`      ${q}`));
}
ESTRAGO = null;
console.log('');
await nav.close();
servidor.close();
process.exit(todosVermelhos ? 0 : 1);
