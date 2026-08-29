#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DOS NOMES AO LADO DO MAPA · o bloco de 29.08.2026
 * =============================================================================
 *
 * Uma célula por coisa que o brief manda medir, em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e sai com 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/mapa-distritos.mjs`.
 *
 *   node tests/inicio/lista.mjs
 *   node tests/inicio/lista.mjs --json <ficheiro>
 *   node tests/inicio/lista.mjs --vermelhos
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * L1 · UMA LISTA SÓ, E É A DO MAPA. O brief escreve que a colocação na coluna
 * esquerda é da folha e não uma segunda rendição. Não basta contar 29: o
 * conjunto dos slugs da lista tem de ser, elemento a elemento, o conjunto dos
 * slugs das áreas do desenho. Uma lista com 29 nomes certos e um errado passava
 * numa contagem e não passa numa comparação de conjuntos.
 *
 * L2 · A COLOCAÇÃO, nas duas edições. A lista na banda da coluna esquerda (a
 * mesma abcissa e a mesma largura da cabeça), a começar por baixo da manchete e
 * a acabar antes do fim da coluna do instrumento: é isso, e não uma ordem no
 * documento, que a põe AO LADO do mapa e não por baixo dele.
 *
 * L3 · A PÁGINA DEIXA DE CRESCER, nas duas edições. A altura da grelha da cabeça
 * contra a da sua coluna mais alta: antes deste bloco a lista estava dentro da
 * coluna do instrumento e a grelha media 1 552 px a 1280, com 1 260 px de papel
 * vazio à esquerda. A célula não guarda o número de antes (ele envelheceria):
 * guarda a relação que o torna impossível.
 *
 * L4 · NENHUMA UNIDADE SEM ALVO TOCÁVEL, que é o que a Emenda 20c protege. Em
 * cada largura, cada nome VISÍVEL, e não apenas presente no documento: a régua do
 * mapa (M1b e M2b) pergunta ao DOM, e um grupo escondido pela folha passaria por
 * ela. E o número de grupos é o número de parcelas que o desenho tem, para que
 * zero grupos não passe por «nenhum escondido».
 *
 * L5 · O ALVO DE CADA NOME, NAS DUAS DIMENSÕES. 44 px de altura E 44 px de
 * largura, e nenhum par de alvos que se intersete. A primeira forma desta folha
 * media 44 px de altura e 32 de largura em «Beja», e um alvo que é 44 num sentido
 * só é 44 no papel e menos no dedo. A interseção mede-se entre rectângulos, e não
 * por colunas de abcissa igual: dois alvos podem sobrepor-se sem partilharem a
 * abcissa. E não passa com uma ligação visível: exige as 29.
 *
 * L6 · O PAR DE ESTADO, NOS 29 PARES, NOS DOIS SENTIDOS E PELAS DUAS PORTAS.
 * Quatro células: o rato num nome contra a área daquela unidade; o rato numa área
 * contra o nome; o foco do teclado num nome contra a área; o foco do teclado numa
 * área contra o nome. Cada uma percorre as 29 e exige que a marca apareça na
 * unidade apontada e em nenhuma outra. O rato do lado do mapa vai ao PONTO
 * REPRESENTATIVO do artefacto e não ao centro da caixa: numa forma côncava o
 * centro da caixa cai fora da forma (I82), e o `:hover` não acenderia.
 *
 * L7 · A MARCA NÃO É SÓ COR, nas duas edições. Dos dois lados, o que muda entre o
 * repouso e a marca tem de incluir uma grandeza que não é cor.
 *
 * L8 · O NOME DE CADA PAINEL CONTA O QUE ESTÁ NA PÁGINA. O algarismo tem de estar
 * dentro de um `data-prova` com a chave certa, e o número que ele mostra tem de
 * ser o número de peças de `#painel` e de linhas de `#painel-social` contadas no
 * documento. Um número certo com a marca certa que não conta o que está por
 * baixo dele continua a ser um número errado. Nas duas edições.
 *
 * L9 · UMA FORMA DE CADA VEZ, ÀS SETE LARGURAS. A regra, depois da decisão do
 * lugar de direção sobre a I101: abaixo de 1024 a rede mostra-se sempre, em
 * linha; a partir de 1024 mostra-se a lista da coluna esquerda. Nenhuma largura
 * mostra as duas, e nenhuma esconde a lista. A forma lê-se em dois sítios que não
 * podem divergir: a `display` da `<ul>` (a folha) e o número de linhas que os 18
 * nomes do continente ocupam (o ecrã) — dezoito em fila dão menos de nove linhas,
 * duas colunas de nove dão exactamente nove.
 *
 * L10 · SEM PONTUAÇÃO ENTRE OS NOMES. Nenhum `::before` nem `::after` com
 * conteúdo em nenhum item nem em nenhuma ligação da lista, a nenhuma largura. Um
 * ponto de separação num item inquebrável fica pendurado no fim da linha, e o que
 * separa os nomes passa a ser o intervalo e o sublinhado que cada um já tem.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, e não uma. **Verde antes**: as células que o estrago nomeia
 * passam sem ele, porque uma célula que já estava vermelha não prova nada.
 * **O HTML mudou**: a transformação aplicada às páginas dá bytes diferentes,
 * porque um estrago que não muda nada nunca podia ser apanhado e um `replace`
 * que falha em silêncio é o modo mais comum de isso acontecer. **Vermelho
 * depois**: pelo menos uma das células nomeadas cai. Falhar qualquer das três é
 * vermelho do próprio corredor.
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
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const VERMELHOS = argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/* O estrago plantado não toca em disco: é uma transformação do HTML no caminho
   entre o ficheiro e o navegador, como na régua do mapa. */
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
    const html = ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery);
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(html);
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
async function pagina(rota, largura) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

const ALVO = 44;
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280, 1440];
const LIMIAR_DA_COLUNA = 1024;
/* O ALVO NO ECRÃ COM RATO (29.08.2026, a emenda do alinhamento à §1.84): a
   partir de 1024 a lista é o índice do mapa e não a rede dele, e a linha de um
   nome mede 32 px; os 44 px são a regra do toque e ficam abaixo de 1024. */
const ALVO_PONTEIRO = 32;
const alvoEm = (w) => (w >= LIMIAR_DA_COLUNA ? ALVO_PONTEIRO : ALVO);
const EDICOES = [
  { rota: '/', chave: 'pt' },
  { rota: '/en', chave: 'en' },
];

/* Os pontos representativos, lidos do artefacto uma vez. É o mesmo ficheiro e o
   mesmo ponto que a régua do mapa usa para clicar: o que aqui se mede é a marca
   à volta do sítio onde o rato de verdade pousa. */
const PONTOS = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8')).unidades.map((u) => [
    u.slug,
    u.ponto,
  ]),
);

/** Tudo o que uma página diz sobre a lista, a uma largura. */
const LEITURA = () => {
  const visivel = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  };
  const cx = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: +b.x.toFixed(1),
      y: +(b.y + window.scrollY).toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      fundo: +(b.y + b.height + window.scrollY).toFixed(1),
    };
  };
  const conteudoDe = (el, onde) => {
    const c = getComputedStyle(el, onde).content;
    return c === 'none' || c === 'normal' || c === '' ? null : c;
  };
  const lista = document.querySelector('[data-mapa-ilhas]');
  const grupos = [...document.querySelectorAll('[data-parcela-lista]')].map((g) => ({
    parcela: g.getAttribute('data-parcela-lista'),
    visivel: visivel(g),
    caixa: cx(g),
    formaDaFila: getComputedStyle(g.querySelector('ul')).display,
  }));
  const nomes = [...document.querySelectorAll('[data-lista-porta]')].map((a) => ({
    slug: a.getAttribute('data-lista-porta'),
    parcela: a.closest('[data-parcela-lista]')?.getAttribute('data-parcela-lista') ?? null,
    visivel: visivel(a),
    caixa: cx(a),
    destino: a.getAttribute('href'),
  }));
  /* A pontuação decorativa, dos dois lados de cada item e de cada ligação. */
  const pontuacao = [];
  for (const el of document.querySelectorAll('[data-mapa-ilhas] li, [data-lista-porta]')) {
    for (const onde of ['::before', '::after']) {
      const c = conteudoDe(el, onde);
      if (c) pontuacao.push(`${el.tagName.toLowerCase()}${onde} = ${c}`);
    }
  }
  const areas = [...document.querySelectorAll('[data-areas] .uni')].map((el) => ({
    slug: el.getAttribute('data-unidade'),
    parcela: el.getAttribute('data-parcela'),
  }));
  /* A ORDEM DO DOCUMENTO entre a lista e o mapa, lida na árvore e não na folha:
     `compareDocumentPosition` diz qual vem primeiro, e é isso que o teclado e o
     leitor de ecrã seguem. */
  const primeiroNome = document.querySelector('[data-lista-porta]');
  const primeiraArea = document.querySelector('a.uni-porta');
  const ordemDoDocumento =
    primeiroNome && primeiraArea
      ? primeiroNome.compareDocumentPosition(primeiraArea) & Node.DOCUMENT_POSITION_FOLLOWING
        ? 'nomes antes do mapa'
        : 'mapa antes dos nomes'
      : 'sem um dos dois';
  const painel = [...document.querySelectorAll('.painel-nome, .social-titulo')].map((h) => {
    const marcado = h.querySelector('[data-prova]');
    return {
      classe: h.className,
      texto: h.textContent.replace(/\s+/g, ' ').trim(),
      chave: marcado?.getAttribute('data-prova') ?? null,
      algarismo: marcado ? Number(marcado.textContent.trim()) : null,
      soltos: [...h.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join(' ')
        .match(/\d+/g),
    };
  });
  return {
    janela: window.innerWidth,
    pagina: +document.documentElement.scrollHeight.toFixed(1),
    cabeca: cx(document.querySelector('.cabeca-col')),
    instrumento: cx(document.querySelector('.cabeca-inst')),
    grelha: cx(document.querySelector('.cabeca-grelha')),
    tela: cx(document.querySelector('.mapa-tela')),
    svg: cx(document.querySelector('.cabeca-inst .mapa-svg')),
    legenda: cx(document.querySelector('.mapa-legenda')),
    legendaAlinhamento: (() => {
      const e = document.querySelector('.mapa-legenda .mapa-linha-fonte');
      return e ? getComputedStyle(e).textAlign : null;
    })(),
    lista: cx(lista),
    grupos,
    nomes,
    pontuacao,
    areas,
    ordemDoDocumento,
    painel,
    pecasDoPainel: document.querySelectorAll('#painel .peca').length,
    linhasDoSocial: document.querySelectorAll('#painel-social .social-linha').length,
  };
};

/** O estado de um par, e o máximo das outras 28, numa chamada só. */
const ESTADO = (slug) => {
  const n = (v) => Number.parseFloat(String(v)) || 0;
  const uni = document.querySelector(`.uni[data-unidade="${slug}"]`);
  const nome = document.querySelector(`[data-lista-porta="${slug}"]`);
  let outroTraco = 0;
  for (const el of document.querySelectorAll('[data-areas] .uni')) {
    if (el === uni) continue;
    outroTraco = Math.max(outroTraco, n(getComputedStyle(el).strokeWidth));
  }
  let outroSublinhado = 0;
  for (const el of document.querySelectorAll('[data-lista-porta]')) {
    if (el === nome) continue;
    outroSublinhado = Math.max(outroSublinhado, n(getComputedStyle(el).textDecorationThickness));
  }
  return {
    traco: uni ? n(getComputedStyle(uni).strokeWidth) : null,
    corDoTraco: uni ? getComputedStyle(uni).stroke : null,
    sublinhado: nome ? n(getComputedStyle(nome).textDecorationThickness) : null,
    corDoNome: nome ? getComputedStyle(nome).color : null,
    outroTraco,
    outroSublinhado,
  };
};

/* ===========================================================================
 * A CORRIDA
 * ===========================================================================
 * `soEstas` limita a corrida às células que um estrago nomeia: uma régua inteira
 * por planta seria dez corridas de tudo para provar dez linhas.
 */
const intersecta = (a, b) =>
  a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;

async function correTudo(soEstas) {
  const precisa = (c) => !soEstas || soEstas.includes(c);
  const daPagina = ['L1', 'L2', 'L3', 'L4', 'L5', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13'].filter(precisa);
  const daMao = ['L6', 'L7'].filter(precisa);

  const lido = {};
  if (daPagina.length) {
    const larguras = new Set();
    for (const c of daPagina) {
      if (['L4', 'L5', 'L9', 'L10'].includes(c)) for (const w of LARGURAS) larguras.add(w);
      if (c === 'L2') larguras.add(1024);
      if (['L11', 'L12', 'L13'].includes(c)) for (const w of [1024, 1280, 1440]) larguras.add(w);
      if (['L1', 'L2', 'L3', 'L8'].includes(c)) larguras.add(1280);
    }
    for (const e of EDICOES) {
      for (const w of [...larguras].sort((a, b) => a - b)) {
        const p = await pagina(e.rota, w);
        lido[`${e.chave}_${w}`] = await p.evaluate(LEITURA);
        await p.__ctx.close();
      }
    }
    medidas.larguras = lido;
  }

  /* --------------------------------------------------------------------- L1 */
  if (precisa('L1')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      const daLista = new Set(r.nomes.map((n) => n.slug));
      const doMapa = new Set(r.areas.map((a) => a.slug));
      const soNaLista = [...daLista].filter((s) => !doMapa.has(s));
      const soNoMapa = [...doMapa].filter((s) => !daLista.has(s));
      const destinos = new Set(r.nomes.map((n) => n.destino));
      conta(
        `L1·${e.chave} · uma lista só, e os seus slugs são exactamente os das áreas do mapa`,
        r.nomes.length === 29 &&
          daLista.size === 29 &&
          doMapa.size === 29 &&
          soNaLista.length === 0 &&
          soNoMapa.length === 0 &&
          destinos.size === 29 &&
          r.ordemDoDocumento === 'nomes antes do mapa',
        `${r.nomes.length} ligações, ${daLista.size} slugs na lista e ${doMapa.size} no mapa, ${destinos.size} destinos distintos` +
          `${soNaLista.length || soNoMapa.length ? ` · só na lista: ${soNaLista.join(', ') || 'nenhum'} · só no mapa: ${soNoMapa.join(', ') || 'nenhum'}` : ' · os dois conjuntos são o mesmo'}` +
          ` · ordem do documento: ${r.ordemDoDocumento}`,
      );
    }
  }

  /* --------------------------------------------------------------------- L2 */
  if (precisa('L2')) {
    for (const e of EDICOES) {
      for (const w of [1024, 1280]) {
        const r = lido[`${e.chave}_${w}`];
        const naBanda = Math.abs(r.lista.x - r.cabeca.x) < 1 && Math.abs(r.lista.w - r.cabeca.w) < 1;
        const porBaixoDaManchete = r.lista.y >= r.cabeca.fundo;
        const aoLadoDoMapa = r.lista.y < r.instrumento.fundo;
        conta(
          `L2·${e.chave}·${w} · a lista na coluna esquerda, por baixo da manchete e ao lado do mapa`,
          naBanda && porBaixoDaManchete && aoLadoDoMapa,
          `lista x ${r.lista.x} w ${r.lista.w} (cabeça x ${r.cabeca.x} w ${r.cabeca.w}) · topo ${r.lista.y} contra o fim da manchete ${r.cabeca.fundo} e o fim do mapa ${r.instrumento.fundo}`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- L3 */
  if (precisa('L3')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      const colunaDoInstrumento = r.instrumento.fundo - r.grelha.y;
      const folga = r.grelha.h - colunaDoInstrumento;
      conta(
        `L3·${e.chave}·1280 · a página deixa de crescer: a grelha não passa muito da coluna do mapa`,
        folga <= 60,
        `grelha ${r.grelha.h} px · coluna do instrumento ${colunaDoInstrumento.toFixed(1)} px · folga ${folga.toFixed(1)} px (limite 60) · página ${r.pagina} px`,
      );
    }
  }

  /* --------------------------------------------------------------------- L4 */
  if (precisa('L4')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const parcelas = new Set(r.areas.map((a) => a.parcela));
        const escondidos = r.grupos.filter((g) => !g.visivel);
        const nomesEscondidos = r.nomes.filter((n) => !n.visivel);
        conta(
          `L4·${e.chave}·${w} · nenhuma unidade sem alvo tocável: os ${parcelas.size} grupos e os 29 nomes à vista`,
          r.grupos.length === parcelas.size &&
            parcelas.size > 0 &&
            escondidos.length === 0 &&
            nomesEscondidos.length === 0 &&
            r.nomes.length === 29,
          `${r.grupos.length} grupo(s) para ${parcelas.size} parcela(s) do desenho, ${escondidos.length} escondido(s)` +
            `${escondidos.length ? ` (${escondidos.map((g) => g.parcela).join(', ')})` : ''} · ` +
            `${r.nomes.length} nome(s), ${nomesEscondidos.length} escondido(s)`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- L5 */
  if (precisa('L5')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const vistos = r.nomes.filter((n) => n.visivel);
        const alvo = alvoEm(w);
        const baixos = vistos.filter((n) => n.caixa.h < alvo);
        /* No ecrã com rato a altura é a declarada (32 px), e não «pelo menos»: uma
           linha de 44 px ali seria a forma antiga a passar por nova. */
        const altos = w >= LIMIAR_DA_COLUNA ? vistos.filter((n) => n.caixa.h > alvo + 2) : [];
        const estreitos = vistos.filter((n) => n.caixa.w < alvo);
        let colisoes = 0;
        for (let i = 0; i < vistos.length; i++) {
          for (let j = i + 1; j < vistos.length; j++) {
            if (intersecta(vistos[i].caixa, vistos[j].caixa)) colisoes++;
          }
        }
        const menorAlto = vistos.length ? Math.min(...vistos.map((n) => n.caixa.h)) : 0;
        const menorLargo = vistos.length ? Math.min(...vistos.map((n) => n.caixa.w)) : 0;
        conta(
          `L5·${e.chave}·${w} · cada nome é um alvo de ${alvo} × ${alvo} px, e nenhum se interseta`,
          vistos.length === 29 && baixos.length === 0 && altos.length === 0 && estreitos.length === 0 && colisoes === 0,
          `${vistos.length}/29 à vista · o mais baixo ${menorAlto.toFixed(1)} px, o mais estreito ${menorLargo.toFixed(1)} px · ` +
            `${baixos.length} sob ${alvo} de altura, ${altos.length} acima de ${alvo + 2}, ${estreitos.length} sob ${alvo} de largura, ${colisoes} interseção(ões)`,
        );
      }
    }
  }

  /* ------------------------------------------------------------ L11 a L13 */
  /* A CABEÇA ALINHADA (29.08.2026, a emenda do alinhamento à §1.84): a partir de
     1280 o mapa começa no topo da manchete e acaba no fundo da legenda, a legenda
     fica por baixo dos nomes e alinhada à esquerda com eles, e o mapa cabe na
     coluna e enche-a em altura; a 1024 a legenda fica por baixo do mapa, na
     coluna dele. As três medem caixas do navegador, não a folha. */
  if (precisa('L11') || precisa('L12') || precisa('L13')) {
    for (const e of EDICOES) {
      for (const w of [1024, 1280, 1440]) {
        const r = lido[`${e.chave}_${w}`];
        if (!r || !r.svg || !r.legenda) {
          for (const c of ['L11', 'L12', 'L13']) if (precisa(c)) conta(`${c}·${e.chave}·${w} · o mapa e a legenda existem na página`, false, 'sem svg ou sem legenda');
          continue;
        }
        if (w >= 1280) {
          if (precisa('L11')) {
            conta(
              `L11·${e.chave}·${w} · o mapa começa no topo da manchete e acaba no fundo da legenda`,
              Math.abs(r.svg.y - r.cabeca.y) <= 2 && Math.abs(r.svg.fundo - r.legenda.fundo) <= 4,
              `mapa de ${r.svg.y} a ${r.svg.fundo} · manchete desde ${r.cabeca.y} · legenda até ${r.legenda.fundo}`,
            );
          }
          if (precisa('L12')) {
            conta(
              `L12·${e.chave}·${w} · a legenda por baixo dos nomes, alinhada à esquerda com eles`,
              Math.abs(r.legenda.x - r.lista.x) <= 1 && r.legenda.y >= r.lista.fundo - 0.5 && r.legendaAlinhamento === 'left',
              `legenda x ${r.legenda.x} y ${r.legenda.y} · lista x ${r.lista.x} fundo ${r.lista.fundo} · text-align ${r.legendaAlinhamento}`,
            );
          }
          if (precisa('L13')) {
            /* O desenho enche a caixa: a razão da caixa do `svg` é a do `viewBox`
               (6090/8030) a menos de 1,5 px, senão o navegador centra o desenho
               com ar em cima e em baixo e o fundo «partilhado» é o da caixa e não
               o do mapa (leitura cruzada de 29.08). E a caixa não sai da coluna
               por nenhum dos lados, fica a menos de 8 px da largura dela, e não
               passa a altura da grelha. */
            const arVertical = Math.abs(r.svg.h - r.svg.w * (8030 / 6090));
            conta(
              `L13·${e.chave}·${w} · o mapa cabe na coluna, enche-a em altura e o desenho enche a caixa`,
              r.svg.x >= r.instrumento.x - 1 &&
                r.svg.x + r.svg.w <= r.instrumento.x + r.instrumento.w + 1 &&
                r.instrumento.w - r.svg.w <= 8 &&
                r.svg.h >= r.grelha.h - 12 &&
                r.svg.h <= r.grelha.h + 1 &&
                arVertical <= 1.5,
              `mapa ${r.svg.w} × ${r.svg.h} px em x ${r.svg.x} · coluna x ${r.instrumento.x} w ${r.instrumento.w} · grelha h ${r.grelha.h} · ar vertical ${arVertical.toFixed(1)} px`,
            );
          }
        } else if (precisa('L12')) {
          conta(
            `L12·${e.chave}·${w} · a legenda por baixo do mapa, na coluna dele, a menos de 16 px`,
            r.legenda.y >= r.svg.fundo - 1 && r.legenda.y - r.svg.fundo <= 16 && Math.abs(r.legenda.x - r.instrumento.x) <= 1,
            `legenda x ${r.legenda.x} y ${r.legenda.y} · mapa fundo ${r.svg.fundo} · coluna x ${r.instrumento.x}`,
          );
        }
      }
    }
  }

  /* --------------------------------------------------------------------- L9 */
  if (precisa('L9')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        const formas = new Set(r.grupos.map((g) => g.formaDaFila));
        const continente = r.nomes.filter((n) => n.parcela === 'continente' && n.visivel);
        const linhas = new Set(continente.map((n) => Math.round(n.caixa.y))).size;
        const emColuna = w >= LIMIAR_DA_COLUNA;
        const formaCerta = formas.size === 1 && [...formas][0] === (emColuna ? 'block' : 'flex');
        const linhasCertas = emColuna ? linhas === 9 : linhas < 9;
        const naBanda =
          !emColuna || (Math.abs(r.lista.x - r.cabeca.x) < 1 && Math.abs(r.lista.w - r.cabeca.w) < 1);
        conta(
          `L9·${e.chave}·${w} · uma forma de cada vez: ${emColuna ? 'a lista da coluna esquerda' : 'a rede em linha'}`,
          r.nomes.every((n) => n.visivel) && formaCerta && linhasCertas && naBanda,
          `fila em «${[...formas].join(', ')}» (${formas.size} forma no bloco) · os 18 do continente em ${linhas} linha(s) · ` +
            `${r.nomes.filter((n) => n.visivel).length}/29 à vista${emColuna ? ` · na banda da cabeça: ${naBanda}` : ''}`,
        );
      }
    }
  }

  /* -------------------------------------------------------------------- L10 */
  if (precisa('L10')) {
    for (const e of EDICOES) {
      for (const w of LARGURAS) {
        const r = lido[`${e.chave}_${w}`];
        conta(
          `L10·${e.chave}·${w} · sem pontuação entre os nomes: nenhum «::before» nem «::after» com conteúdo`,
          r.pontuacao.length === 0,
          r.pontuacao.length === 0
            ? '0 pseudo-elementos com conteúdo em 29 ligações e 29 itens'
            : `${r.pontuacao.length}: ${[...new Set(r.pontuacao)].join(' · ')}`,
        );
      }
    }
  }

  /* --------------------------------------------------------------------- L8 */
  if (precisa('L8')) {
    for (const e of EDICOES) {
      const r = lido[`${e.chave}_1280`];
      medidas[`painel_${e.chave}`] = r.painel;
      const porChave = Object.fromEntries(r.painel.map((h) => [h.chave, h]));
      const pdm = porChave.painel_com_limiar ?? null;
      const social = porChave.painel_social_total ?? null;
      const semMarca = r.painel.filter((h) => !h.chave);
      const comNumeroSolto = r.painel.filter((h) => h.soltos && h.soltos.length);
      conta(
        `L8·${e.chave} · o nome de cada painel conta o que está na página, e o algarismo vem da prova`,
        r.painel.length === 2 &&
          pdm &&
          social &&
          semMarca.length === 0 &&
          comNumeroSolto.length === 0 &&
          pdm.algarismo === r.pecasDoPainel &&
          social.algarismo === r.linhasDoSocial,
        `«${pdm?.texto ?? '(sem linha)'}» diz ${pdm?.algarismo} e o painel tem ${r.pecasDoPainel} peça(s) · ` +
          `«${social?.texto ?? '(sem linha)'}» diz ${social?.algarismo} e a lista tem ${r.linhasDoSocial} linha(s)` +
          `${semMarca.length ? ` · ${semMarca.length} linha(s) SEM data-prova` : ''}` +
          `${comNumeroSolto.length ? ` · algarismo à mão: ${comNumeroSolto.map((h) => h.soltos.join(',')).join(' ')}` : ''}`,
      );
    }
  }

  /* ----------------------------------------------------------------- L6 e L7 */
  if (daMao.length) {
    for (const e of EDICOES) {
      const p = await pagina(e.rota, 1280);
      const repouso = await p.evaluate(ESTADO, 'lisboa');

      /* O rato do lado do mapa vai ao ponto representativo, e por isso o desenho
         entra em vista uma vez e os pontos leem-se DEPOIS disso: um rolamento a
         meio invalidaria as coordenadas de ecrã já calculadas. */
      await p.evaluate(() => document.querySelector('[data-mapa-areas]').scrollIntoView({ block: 'center' }));
      const noEcra = await p.evaluate((pontos) => {
        const svg = document.querySelector('[data-mapa-areas]');
        const m = svg.getScreenCTM();
        const out = {};
        for (const [slug, xy] of Object.entries(pontos)) {
          const pt = svg.createSVGPoint();
          pt.x = xy[0];
          pt.y = xy[1];
          const s = pt.matrixTransform(m);
          out[slug] = { x: s.x, y: s.y };
        }
        return out;
      }, PONTOS);

      const slugs = await p.evaluate(() =>
        [...document.querySelectorAll('a.uni-porta')].map((a) => a.getAttribute('data-uni-porta')),
      );

      if (precisa('L6') && e.chave === 'pt') {
        /* ENTRE DUAS VARREDURAS, A PÁGINA VOLTA AO REPOUSO. Medido na primeira
           corrida: a varredura do teclado deixava uma área focada, e a varredura
           do rato que vinha a seguir lia «traço 3 nas outras 28» em 28 das 29
           unidades. Não era o par a marcar de mais: era o foco de antes, ainda
           aceso. O rato afasta-se e o foco larga antes de cada uma das quatro. */
        const repousa = async () => {
          await p.mouse.move(0, 0);
          await p.evaluate(() => document.activeElement?.blur?.());
        };

        /* o rato numa área → o nome daquela unidade */
        await repousa();
        const falhasRatoNaArea = [];
        for (const slug of slugs) {
          await p.mouse.move(noEcra[slug].x, noEcra[slug].y);
          const s = await p.evaluate(ESTADO, slug);
          if (!(s.sublinhado > repouso.sublinhado && s.outroSublinhado === repouso.sublinhado)) {
            falhasRatoNaArea.push(`${slug} (${s.sublinhado}, outros ${s.outroSublinhado})`);
          }
        }
        await p.mouse.move(0, 0);
        conta(
          'L6b · o rato em cada uma das 29 áreas marca o nome daquela unidade, e só dele',
          falhasRatoNaArea.length === 0,
          falhasRatoNaArea.length === 0
            ? `29/29 · sublinhado ${repouso.sublinhado} px → 3 px no nome apontado, ${repouso.sublinhado} px nos outros 28`
            : `${falhasRatoNaArea.length} falha(s): ${falhasRatoNaArea.slice(0, 4).join(', ')}`,
        );

        /* o foco do teclado numa área → o nome daquela unidade */
        await repousa();
        const falhasFocoNaArea = [];
        for (let i = 0; i < slugs.length; i++) {
          await p.evaluate(
            ({ lista, i }) => {
              const as = [...document.querySelectorAll('a.uni-porta')];
              as[i === 0 ? 1 : i - 1].focus();
            },
            { lista: slugs, i },
          );
          await p.keyboard.press(i === 0 ? 'Shift+Tab' : 'Tab');
          const s = await p.evaluate(ESTADO, slugs[i]);
          if (!(s.sublinhado > repouso.sublinhado && s.outroSublinhado === repouso.sublinhado)) {
            falhasFocoNaArea.push(`${slugs[i]} (${s.sublinhado}, outros ${s.outroSublinhado})`);
          }
        }
        conta(
          'L6d · o foco do teclado em cada uma das 29 áreas marca o nome daquela unidade',
          falhasFocoNaArea.length === 0,
          falhasFocoNaArea.length === 0
            ? '29/29 pelo Tab'
            : `${falhasFocoNaArea.length} falha(s): ${falhasFocoNaArea.slice(0, 4).join(', ')}`,
        );

        /* o rato em cada nome → a área daquela unidade */
        await repousa();
        const falhasRatoNoNome = [];
        for (const slug of slugs) {
          const el = await p.$(`[data-lista-porta="${slug}"]`);
          let chegou = false;
          try {
            if (el) {
              await el.hover({ timeout: 2000 });
              chegou = true;
            }
          } catch {
            chegou = false;
          }
          const s = await p.evaluate(ESTADO, slug);
          if (!(chegou && s.traco > repouso.traco && s.outroTraco === repouso.traco)) {
            falhasRatoNoNome.push(`${slug} (rato ${chegou}, traço ${s.traco}, outros ${s.outroTraco})`);
          }
        }
        await p.mouse.move(0, 0);
        conta(
          'L6a · o rato em cada um dos 29 nomes contorna a área daquela unidade, e só dela',
          falhasRatoNoNome.length === 0,
          falhasRatoNoNome.length === 0
            ? `29/29 · contorno ${repouso.traco} px → 3 px na área apontada, ${repouso.traco} px nas outras 28`
            : `${falhasRatoNoNome.length} falha(s): ${falhasRatoNoNome.slice(0, 4).join(', ')}`,
        );

        /* o foco do teclado em cada nome → a área daquela unidade */
        await repousa();
        const ordemDosNomes = await p.evaluate(() =>
          [...document.querySelectorAll('[data-lista-porta]')].map((a) =>
            a.getAttribute('data-lista-porta'),
          ),
        );
        const falhasFocoNoNome = [];
        for (let i = 0; i < ordemDosNomes.length; i++) {
          await p.evaluate((i) => {
            const as = [...document.querySelectorAll('[data-lista-porta]')];
            as[i === 0 ? 1 : i - 1].focus();
          }, i);
          await p.keyboard.press(i === 0 ? 'Shift+Tab' : 'Tab');
          const pousou = await p.evaluate(
            (slug) => document.activeElement?.getAttribute('data-lista-porta') === slug,
            ordemDosNomes[i],
          );
          const s = await p.evaluate(ESTADO, ordemDosNomes[i]);
          if (!(pousou && s.traco > repouso.traco && s.outroTraco === repouso.traco)) {
            falhasFocoNoNome.push(`${ordemDosNomes[i]} (foco ${pousou}, traço ${s.traco})`);
          }
        }
        conta(
          'L6c · o foco do teclado em cada um dos 29 nomes contorna a área daquela unidade',
          falhasFocoNoNome.length === 0,
          falhasFocoNoNome.length === 0
            ? '29/29 pelo Tab'
            : `${falhasFocoNoNome.length} falha(s): ${falhasFocoNoNome.slice(0, 4).join(', ')}`,
        );
      }

      if (precisa('L7')) {
        await p.mouse.move(0, 0);
        await p.evaluate(() => document.activeElement?.blur?.());
        const alvo = 'lisboa';
        let chegouAoNome = false;
        try {
          const el = await p.$(`[data-lista-porta="${alvo}"]`);
          if (el) {
            await el.hover({ timeout: 2000 });
            chegouAoNome = true;
          }
        } catch {
          chegouAoNome = false;
        }
        const comRatoNoNome = await p.evaluate(ESTADO, alvo);
        await p.mouse.move(0, 0);
        await p.evaluate(() => document.querySelector('[data-mapa-areas]').scrollIntoView({ block: 'center' }));
        const ponto = await p.evaluate((xy) => {
          const svg = document.querySelector('[data-mapa-areas]');
          const pt = svg.createSVGPoint();
          pt.x = xy[0];
          pt.y = xy[1];
          const s = pt.matrixTransform(svg.getScreenCTM());
          return { x: s.x, y: s.y };
        }, PONTOS[alvo]);
        await p.mouse.move(ponto.x, ponto.y);
        const comRatoNaArea = await p.evaluate(ESTADO, alvo);
        medidas[`par_${e.chave}`] = { repouso, comRatoNoNome, comRatoNaArea };
        conta(
          `L7·${e.chave} · a marca não é só cor: os dois lados mudam uma grandeza que não é cor`,
          chegouAoNome &&
            comRatoNoNome.traco !== repouso.traco &&
            comRatoNaArea.sublinhado !== repouso.sublinhado,
          `contorno ${repouso.traco} → ${comRatoNoNome.traco} px · sublinhado ${repouso.sublinhado} → ${comRatoNaArea.sublinhado} px · ` +
            `tinta do traço ${repouso.corDoTraco} nos dois estados`,
        );
      }
      await p.__ctx.close();
    }
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * =========================================================================== */
const soNaPrimeira = (rota) =>
  rota === '/' || rota === '/index.html' || rota === '/en' || rota === '/en/index.html';
const comFolha = (css) => (html, rota) =>
  soNaPrimeira(rota) ? html.replace('</head>', `<style>${css}</style></head>`) : html;

const PLANTAS = [
  {
    nome: 'uma ligação duplicada: o mesmo nome duas vezes na lista',
    celulas: ['L1'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const m = html.match(/<li><a href="[^"]*\/(?:distritos|districts)\/aveiro"[^>]*>[^<]*<\/a><\/li>/);
      return m ? html.replace(m[0], m[0] + m[0]) : html;
    },
  },
  {
    nome: 'o mapa antes dos nomes no documento',
    celulas: ['L1'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const i = html.indexOf('<div class="mapa-ilhas"');
      const f = html.indexOf('<div class="cabeca-inst"');
      if (i < 0 || f < 0 || f < i) return html;
      const lista = html.slice(i, f);
      const resto = html.slice(0, i) + html.slice(f);
      const j = resto.indexOf('</div>', resto.indexOf('<div class="cabeca-inst"'));
      return resto.slice(0, j + 6) + lista + resto.slice(j + 6);
    },
  },
  {
    nome: 'a lista de volta para baixo do mapa, a 1280',
    celulas: ['L2', 'L3'],
    estrago: comFolha(
      '@media (min-width:1024px){.mapa-ilhas{grid-column:2 !important;grid-row:3 !important}.cabeca-inst{grid-row:1 !important}}',
    ),
  },
  {
    nome: 'um grupo escondido numa largura em que uma unidade fica abaixo dos 44 px',
    celulas: ['L4', 'L9'],
    estrago: comFolha('[data-parcela-lista="continente"]{display:none}'),
  },
  {
    nome: 'um alvo com 40 px de altura',
    celulas: ['L5'],
    estrago: comFolha(
      '.mapa-ilhas-lista a{padding-block:10px !important;line-height:20px !important;min-height:0 !important}',
    ),
  },
  {
    nome: 'um alvo com menos de 44 px de largura (a largura mínima retirada)',
    celulas: ['L5'],
    estrago: comFolha('.mapa-ilhas-lista a{min-width:0 !important;padding-inline:0 !important}'),
  },
  {
    nome: 'o mapa solto do fundo da legenda, a 1280 (o item deixa de esticar)',
    celulas: ['L11'],
    estrago: comFolha(
      '@media (min-width:1280px){.cabeca-inst{align-self:start !important;height:auto !important;min-height:0 !important}.cabeca-inst .mapa-tela{height:auto !important;width:100% !important}}',
    ),
  },
  {
    nome: 'a legenda de volta para a coluna do mapa, a 1280',
    celulas: ['L12'],
    estrago: comFolha('@media (min-width:1280px){.mapa-legenda{grid-column:2 !important}}'),
  },
  {
    nome: 'o mapa mais largo do que a coluna, a 1280',
    celulas: ['L13'],
    estrago: comFolha(
      '@media (min-width:1280px){.cabeca-inst .mapa-tela{max-width:none !important;width:900px !important;height:auto !important}.cabeca-inst .mapa-svg{width:100% !important;height:auto !important}}',
    ),
  },
  {
    nome: 'o rato num nome sem resposta do mapa (a folha do par retirada)',
    celulas: ['L6', 'L7'],
    estrago: (html, rota) =>
      soNaPrimeira(rota) ? html.replace(/<style>\.cabeca-grelha:has[\s\S]*?<\/style>/, '') : html,
  },
  {
    nome: 'a marca só por cor',
    celulas: ['L6', 'L7'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const sem = html.replace(/<style>\.cabeca-grelha:has[\s\S]*?<\/style>/, '');
      return sem.replace(
        '</head>',
        '<style>.cabeca-grelha:has([data-lista-porta="lisboa"]:hover) .uni[data-unidade="lisboa"]{stroke:#c00}' +
          '.cabeca-grelha:has([data-uni-porta="lisboa"]:hover) [data-lista-porta="lisboa"]{color:#c00}' +
          '.mapa-ilhas-lista a:hover{text-decoration-thickness:1px !important}</style></head>',
      );
    },
  },
  {
    nome: 'o nome de um painel com uma contagem escrita à mão',
    celulas: ['L8'],
    estrago: (html, rota) =>
      soNaPrimeira(rota)
        ? html.replace(
            /<a class="prova-valor" href="[^"]*" data-prova="painel_com_limiar"[^>]*>\d+<\/a>/,
            '14',
          )
        : html,
  },
  {
    nome: 'o nome de um painel com a contagem certa e a marca certa a contar outra coisa',
    celulas: ['L8'],
    estrago: (html, rota) =>
      soNaPrimeira(rota)
        ? html.replace(/(data-prova="painel_social_total"[^>]*>)\d+(<\/a>)/, '$17$2')
        : html,
  },
  {
    nome: 'a forma em linha a 1024 e a 1280 (as duas formas na mesma largura)',
    celulas: ['L9'],
    estrago: comFolha(
      '@media (min-width:1024px){.mapa-ilhas-lista{display:flex !important;column-gap:0.75em !important;columns:auto !important}' +
        '.mapa-ilhas-lista a{min-height:44px !important;line-height:20px !important;padding-block:12px !important}}',
    ),
  },
  {
    nome: 'um ponto de separação de volta entre os nomes',
    celulas: ['L10'],
    estrago: comFolha('.mapa-ilhas-lista li:not(:last-child)::after{content:"·";color:#888}'),
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  const tocada = (c, planta) => planta.celulas.some((n) => c.nome.startsWith(n + '·') || c.nome.startsWith(n + ' ') || c.nome.startsWith(n));
  for (const planta of PLANTAS) {
    /* 1 · verde antes */
    ESTRAGO = null;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const antes = celulas.filter((c) => tocada(c, planta));
    const verdesAntes = antes.length > 0 && antes.every((c) => c.passa);

    /* 2 · a transformação muda o HTML */
    let mudou = false;
    for (const [rota, rel] of [
      ['/', 'index.html'],
      ['/en', path.join('en', 'index.html')],
    ]) {
      const cru = fs.readFileSync(path.join(DIST, rel), 'utf8');
      if (planta.estrago(cru, rota) !== cru) mudou = true;
    }

    /* 3 · vermelho depois */
    ESTRAGO = planta.estrago;
    celulas = [];
    medidas = {};
    await correTudo(planta.celulas);
    const depois = celulas.filter((c) => tocada(c, planta));
    const apanhou = depois.some((c) => !c.passa);

    const ok = verdesAntes && mudou && apanhou;
    if (!ok) falhou = true;
    console.log(
      `  ${ok ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}` +
        cinza(
          `  [${antes.length} célula(s) · verde antes: ${verdesAntes} · o HTML mudou: ${mudou} · vermelho depois: ${apanhou}]`,
        ),
    );
    for (const c of depois.filter((c) => !c.passa).slice(0, 2)) {
      console.log(cinza(`              ${c.nome} · ${c.prova}`));
    }
    if (!verdesAntes) {
      for (const c of antes.filter((c) => !c.passa).slice(0, 2)) {
        console.log(vermelho(`              já estava vermelha ANTES: ${c.nome} · ${c.prova}`));
      }
    }
  }
  ESTRAGO = null;
  console.log('');
  await nav.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

await correTudo(null);
await nav.close();
servidor.close();

console.log('');
for (const c of celulas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}`);
  console.log(cinza(`      ${c.prova}`));
}
const falhadas = celulas.filter((c) => !c.passa);
console.log('');
console.log(
  falhadas.length === 0
    ? verde(`  ${celulas.length} células, todas verdes.\n`)
    : vermelho(`  ${falhadas.length} de ${celulas.length} células vermelhas.\n`),
);

if (FICHEIRO_JSON) {
  fs.writeFileSync(
    path.resolve(RAIZ, String(FICHEIRO_JSON)),
    JSON.stringify({ celulas, medidas }, null, 2),
  );
}
process.exit(falhadas.length === 0 ? 0 : 1);
