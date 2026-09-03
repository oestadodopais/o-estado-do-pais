#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO ÍNDICE, DO PROGRESSO E DA SUBIDA (bloco F1.9a, 03.09.2026)
 * =============================================================================
 *
 * Uma célula por medida de aceitação de
 * `design/observatorio/BRIEF-F1.9a-indice-das-paginas-de-leitura.md` §4. NÃO é
 * um portão: não entra no `npm run build` e não constrói nada. Corre sobre
 * `dist/`, imprime uma linha por célula e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, como as réguas dos blocos A, B e C, e pela mesma razão:
 * existem para que um estrago plantado se veja no código de saída.
 *
 *   node tests/texto/indice.mjs
 *   node tests/texto/indice.mjs --json <ficheiro>
 *   node tests/texto/indice.mjs --capturas <dir>    (PNG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, E COM QUE APARELHO
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664) e apontador grosso.
 * Computador: Chromium a 1280 × 800. As duas famílias contam, e o progresso
 * mede-se nas duas porque a linha do tempo do deslocamento é recente nas duas.
 *
 * D1 · o índice: uma entrada por título de nível 2 e 3 do registo, na ordem do
 *      documento, cada uma a abrir um `id` que existe na página. A régua LÊ O
 *      REGISTO ela própria e não pede a ninguém a lista: é a mesma comparação
 *      que o L8 do portão faz, feita outra vez por outro caminho, que é o que
 *      distingue uma régua de um eco.
 * D2 · o progresso sem uma linha de guião: o total declarado contra o registo,
 *      o contador da posição em cada título de nível 2, a tinta que ele
 *      desenha (por píxeis, comparando a mesma banda com a regra e sem ela) e
 *      a barra que mede 0 no topo e a largura da janela no fim.
 * D3 · a subida: à vista nas duas larguras, alvo ≥ 44px nos dois eixos, e zero
 *      caixas de linha do artigo debaixo dela.
 * D4 · os alvos da mobília da página de leitura, a 390 e com toque: zero
 *      abaixo de 44px. O que fica no corpo transcrito é medido e dito, não
 *      corrigido: são alvos dentro de uma frase, e a distância entre portas
 *      seguidas (mediana medida) é a razão pela qual uma área de 44px ali seria
 *      uma porta que abre a linha do vizinho.
 * D6 · a altura de cada página a 390, e a banda que o índice ocupa.
 *
 * ---------------------------------------------------------------------------
 * A ÁREA DE UM ALVO MEDE-SE POR DUAS VIAS, E AS DUAS CONTAM
 * ---------------------------------------------------------------------------
 * Ou a caixa do próprio elemento mede 44px nos dois eixos, que é como a folha
 * da casa escreve a regra; ou o acerto (`elementFromPoint`) alcança 43,8px nos
 * dois eixos a partir do meio da primeira caixa de linha, que é a única maneira
 * de ver a área que um `::after` posicionado acrescenta sem mudar a composição.
 * A folga de 0,2px é do próprio acerto: o ponto que cai na aresta de uma caixa
 * pertence já à caixa seguinte, e por isso uma caixa de 44 × 44 mede 42 × 43,8
 * por acerto. Está medido e escrito para que ninguém leia 43,8 como um defeito.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const REGISTOS = path.join(RAIZ, 'registos');

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
const DIR_CAPTURAS = opcao('--capturas');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

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
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const reguas = [];
const medidas = {};
const conta = (nome, passa, prova) => reguas.push({ nome, passa: !!passa, prova: String(prova) });

/* ========================================================================== */
/* AS OITO PÁGINAS DE LEITURA, e o registo de cada uma                         */
/* ========================================================================== */

/** O leitor próprio desta régua: o manifesto e os registos, do disco. */
const manifesto = JSON.parse(fs.readFileSync(path.join(REGISTOS, 'manifest.json'), 'utf8'));
const PAGINAS = Object.keys(manifesto.registos)
  .sort()
  .map((chave) => {
    const [slug, lang] = chave.split('/');
    const registo = JSON.parse(
      fs.readFileSync(path.join(REGISTOS, slug, `${lang}.record.json`), 'utf8'),
    );
    const titulos = registo.blocks.filter(
      (b) => b.kind === 'heading' && (Number(b.level) === 2 || Number(b.level) === 3),
    );
    return {
      chave,
      slug,
      lang,
      rota: lang === 'pt' ? `/estudos/${slug}/texto` : `/en/studies/${slug}/text`,
      titulos,
      deNivel2: titulos.filter((b) => Number(b.level) === 2).length,
    };
  });

/** A página de cada edição, escolhida para as capturas e para as medidas caras. */
const AMOSTRA = {
  pt: PAGINAS.find((p) => p.chave === 'evora-prometido-pago-auditado-2026/pt'),
  en: PAGINAS.find((p) => p.chave === 'evora-prometido-pago-auditado-2026/en'),
};

/* ========================================================================== */
/* I1 e I2 · O ÍNDICE, lido do HTML construído contra o registo                */
/* ========================================================================== */
{
  const falhas = [];
  const contagens = [];
  for (const p of PAGINAS) {
    const ficheiro = path.join(DIST, p.rota.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(ficheiro)) {
      falhas.push(`${p.chave}: não há página construída em ${p.rota}`);
      continue;
    }
    const root = parse(fs.readFileSync(ficheiro, 'utf8'));
    const nav = root.querySelector('#texto-indice');
    if (!nav) {
      falhas.push(`${p.chave}: não há índice`);
      continue;
    }
    const entradas = nav.querySelectorAll('[data-registo-indice]');
    contagens.push(`${p.chave} ${entradas.length}/${p.titulos.length}`);
    if (entradas.length !== p.titulos.length) {
      falhas.push(
        `${p.chave}: o índice tem ${entradas.length} entradas e o registo tem ` +
          `${p.titulos.length} títulos de nível 2 e 3`,
      );
      continue;
    }
    p.titulos.forEach((bloco, i) => {
      const el = entradas[i];
      const texto = el.textContent.replace(/\s+/g, ' ').trim();
      const esperado = String(bloco.text ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (texto !== esperado) {
        falhas.push(
          `${p.chave} entrada ${i}: a página escreve ${JSON.stringify(texto.slice(0, 60))} e o ` +
            `registo diz ${JSON.stringify(esperado.slice(0, 60))}`,
        );
      }
      const href = el.getAttribute('href') ?? '';
      if (href !== `#bloco-${bloco.i}`) {
        falhas.push(`${p.chave} entrada ${i}: abre "${href}" e o bloco é "#bloco-${bloco.i}"`);
        return;
      }
      const destino = root.querySelector(`#bloco-${bloco.i}`);
      if (!destino) {
        falhas.push(`${p.chave} entrada ${i}: abre "${href}" e não há esse id na página`);
      }
    });
  }
  medidas.indice = { paginas: PAGINAS.length, contagens, falhas };
  conta(
    'I1 · o índice das 8 páginas de leitura: uma entrada por título de nível 2 e 3 do registo, com o texto do registo e um destino que existe',
    falhas.length === 0 && PAGINAS.length === 8,
    `${PAGINAS.length} páginas · ${contagens.join(' · ')}${falhas.length ? ` · FALHAS: ${falhas.slice(0, 3).join(' | ')}` : ''}`,
  );
}

/* ========================================================================== */
/* O QUE SE MEDE NO NAVEGADOR                                                  */
/* ========================================================================== */

/**
 * A área de um alvo, pelas duas vias. Devolve a lista dos que não chegam a
 * 44px, com a zona onde vivem.
 */
const SONDA_ALVOS = () => {
  const SEL = 'a[href], button, summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const D = 21.9;
  const dentro = (el, alvo) => {
    for (let n = el; n; n = n.parentElement) if (n === alvo) return true;
    return false;
  };
  const acerta = (alvo, x, y) => {
    const el = document.elementFromPoint(x, y);
    return !!el && dentro(el, alvo);
  };
  const artigo = document.querySelector('#documento');
  const cabeca = document.querySelector('header');
  const rodape = document.querySelector('footer');
  const pequenos = [];
  let rendidos = 0;
  for (const alvo of document.querySelectorAll(SEL)) {
    const rects = [...alvo.getClientRects()];
    if (!rects.length || rects[0].width <= 0 || rects[0].height <= 0) continue;
    /* Dentro de uma dobra fechada há caixa e não há alvo: os motores dispõem o
       conteúdo escondido para a busca da página o encontrar. */
    if (alvo.closest('details:not([open])')) continue;
    rendidos++;
    alvo.scrollIntoView({ block: 'center', inline: 'center' });
    const r = alvo.getClientRects()[0];
    if (!r) continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (r.width >= 44 && r.height >= 44) continue;
    if (
      acerta(alvo, cx, cy) &&
      acerta(alvo, cx - D, cy) &&
      acerta(alvo, cx + D, cy) &&
      acerta(alvo, cx, cy - D) &&
      acerta(alvo, cx, cy + D)
    ) {
      continue;
    }
    const zona =
      artigo && artigo.contains(alvo)
        ? 'artigo'
        : cabeca && cabeca.contains(alvo)
          ? 'cabeca'
          : rodape && rodape.contains(alvo)
            ? 'rodape'
            : 'pagina';
    pequenos.push({
      zona,
      nome:
        alvo.tagName.toLowerCase() +
        (typeof alvo.className === 'string' && alvo.className.trim()
          ? '.' + alvo.className.trim().split(/\s+/).join('.')
          : ''),
      caixa: [+r.width.toFixed(1), +r.height.toFixed(1)],
    });
  }
  window.scrollTo(0, 0);
  const porZona = {};
  for (const x of pequenos) porZona[x.zona] = (porZona[x.zona] ?? 0) + 1;
  return { rendidos, pequenos: pequenos.length, porZona, daPagina: pequenos.filter((x) => x.zona === 'pagina' || x.zona === 'rodape' && false) };
};

/** As peças da página: índice, contador, barra, subida, altura. */
const SONDA_PECAS = () => {
  const nav = document.querySelector('#texto-indice');
  const dobra = nav ? nav.querySelector('details') : null;
  const porta = nav ? nav.querySelector('summary') : null;
  const corpo = document.querySelector('.texto-corpo');
  const art = document.querySelector('#documento');
  const h2 = art ? [...art.querySelectorAll('h2[data-registo-bloco]')] : [];
  const subir = document.querySelector('.texto-subir');
  const barra = document.querySelector('.texto-barra');
  const rp = porta ? porta.getBoundingClientRect() : null;
  const rn = nav ? nav.getBoundingClientRect() : null;
  const rs = subir ? subir.getBoundingClientRect() : null;
  const rb = barra ? barra.getBoundingClientRect() : null;
  const entradas = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  return {
    indice: !!nav,
    entradas: entradas.length,
    entradasAbaixoDe44: entradas.filter((a) => {
      const r = a.getBoundingClientRect();
      return r.width < 44 || r.height < 44;
    }).length,
    fechada: dobra ? !dobra.open : null,
    porta: rp ? { l: +rp.width.toFixed(1), a: +rp.height.toFixed(1) } : null,
    banda: rn ? +rn.height.toFixed(1) : null,
    seccoesDeclaradas: corpo ? corpo.getAttribute('data-seccoes') : null,
    seccoesNaFolha: corpo ? getComputedStyle(corpo).getPropertyValue('--seccoes').trim() : null,
    h2: h2.length,
    contadores: h2.filter((h) => {
      const c = getComputedStyle(h, '::before').content;
      return c && c !== 'none' && c.includes('counter(seccao)') && c.includes('counter(deQuantas)');
    }).length,
    subir: rs
      ? {
          l: +rs.width.toFixed(1),
          a: +rs.height.toFixed(1),
          pos: getComputedStyle(subir).position,
          display: getComputedStyle(subir).display,
          dentroDoEcra: rs.bottom <= innerHeight + 1 && rs.top >= 0 && rs.right <= innerWidth + 1,
        }
      : null,
    barra: rb ? { l: +rb.width.toFixed(1), a: +rb.height.toFixed(1), display: getComputedStyle(barra).display } : null,
    altura: document.documentElement.scrollHeight,
    ecra: innerHeight,
  };
};

/**
 * A subida tapa texto? Caixas de linha do artigo debaixo da caixa dela, em DEZ
 * posições da página e não só no fim.
 *
 * A primeira versão desta sonda media com a página no fundo, onde por baixo da
 * subida está o rodapé e nunca o artigo, e devolvia zero em toda a parte. A
 * captura de 390 mostrou o contrário no meio do documento, e a régua passou a
 * varrer a página de dez em dez por cento. É a mesma lição do detetor de
 * sobreposições da auditoria de 25.08: a caixa de cada nó de texto, com
 * `Range`, e não a caixa do elemento.
 */
const SONDA_TAPA = () => {
  const subir = document.querySelector('.texto-subir');
  if (!subir || getComputedStyle(subir).display === 'none') return { cruzamentos: -1, posicoes: 0 };
  const art = document.querySelector('#documento');
  const alturaTotal = document.documentElement.scrollHeight;
  let cruzamentos = 0;
  let posicoesComTexto = 0;
  let pior = null;
  const mede = () => {
    const rs = subir.getBoundingClientRect();
    let aqui = 0;
    const anda = (n) => {
      if (n.nodeType === 3) {
        if (!n.nodeValue.trim()) return;
        const r = document.createRange();
        r.selectNodeContents(n);
        for (const c of r.getClientRects()) {
          if (c.width <= 0 || c.height <= 0) continue;
          if (c.bottom < 0 || c.top > innerHeight) continue;
          const x = Math.min(rs.right, c.right) - Math.max(rs.left, c.left);
          const y = Math.min(rs.bottom, c.bottom) - Math.max(rs.top, c.top);
          if (x > 0 && y > 0) {
            aqui++;
            if (!pior || x * y > pior.x * pior.y) {
              pior = { x: +x.toFixed(1), y: +y.toFixed(1), texto: n.nodeValue.trim().slice(0, 40) };
            }
          }
        }
        return;
      }
      for (const f of n.childNodes) anda(f);
    };
    if (art) anda(art);
    cruzamentos += aqui;
    if (aqui > 0) posicoesComTexto++;
  };
  for (let i = 0; i <= 9; i++) {
    window.scrollTo(0, Math.round((alturaTotal - innerHeight) * (i / 9)));
    mede();
  }
  window.scrollTo(0, 0);
  return { cruzamentos, posicoes: 10, posicoesComTexto, pior };
};

/** A distância entre portas de figura seguidas: a razão da isenção do corpo. */
const SONDA_DISTANCIAS = () => {
  const portas = [
    ...document.querySelectorAll(
      '#documento a.texto-figura-porta, #documento a.texto-figura-porta-apos, #documento a.src-chip, #documento a.texto-ligacao',
    ),
  ];
  const caixas = portas
    .map((p) => {
      const r = p.getClientRects()[0];
      return r ? r.top + scrollY : null;
    })
    .filter((x) => x !== null)
    .sort((a, b) => a - b);
  const d = [];
  for (let i = 1; i < caixas.length; i++) d.push(caixas[i] - caixas[i - 1]);
  const abaixo = d.filter((x) => x < 44).length;
  /* Duas portas na mesma linha distam 0px, e a mediana de todas as distâncias
     seria 0 nas páginas com tabelas. A mediana que diz alguma coisa é a das
     portas em linhas DIFERENTES: é essa distância que uma área de 44px teria
     de caber, e é essa que se compara com 44. */
  const entreLinhas = d.filter((x) => x > 0).sort((a, b) => a - b);
  return {
    portas: caixas.length,
    pares: d.length,
    paresNaMesmaLinha: d.length - entreLinhas.length,
    paresAbaixoDe44: abaixo,
    mediana: entreLinhas.length ? +entreLinhas[Math.floor(entreLinhas.length / 2)].toFixed(1) : null,
  };
};

/* ========================================================================== */
/* 390 × 664 · WebKit, apontador grosso                                        */
/* ========================================================================== */
const navMovel = await webkit.launch({ headless: true });
{
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  const porPagina = {};
  const alvosDaPagina = [];
  const alturas = [];
  const tapadas = [];
  for (const p of PAGINAS) {
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const pecas = await pag.evaluate(SONDA_PECAS);
    const alvos = await pag.evaluate(SONDA_ALVOS);
    await pag.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const tapa = await pag.evaluate(SONDA_TAPA);
    porPagina[p.chave] = { ...pecas, alvos, tapa };
    alvosDaPagina.push(
      `${p.chave} ${(alvos.porZona.pagina ?? 0) + (alvos.porZona.rodape ?? 0)}`,
    );
    alturas.push(`${p.chave} ${pecas.altura}px (banda do índice ${pecas.banda}px)`);
    tapadas.push(`${p.chave} ${tapa.cruzamentos}`);
    await pag.close();
  }
  medidas.m390 = porPagina;
  const todas = Object.values(porPagina);

  conta(
    'I2 · a dobra do índice fechada, a porta com alvo ≥ 44px e nenhuma entrada abaixo de 44px · 390 (WebKit)',
    todas.every((m) => m.fechada === true && m.porta?.l >= 44 && m.porta?.a >= 44 && m.entradasAbaixoDe44 === 0),
    todas
      .map((m, i) => `${PAGINAS[i].chave.split('/')[0].slice(0, 12)} porta ${m.porta?.l}×${m.porta?.a}, ${m.entradas} entradas, ${m.entradasAbaixoDe44} pequenas`)
      .join(' · '),
  );

  conta(
    'I3 · o total de secções que a página declara é o número de títulos de nível 2 do registo, e cada um deles traz o contador da posição · 390',
    PAGINAS.every((p, i) => {
      const m = todas[i];
      return (
        m.seccoesDeclaradas === String(p.deNivel2) &&
        m.seccoesNaFolha === String(p.deNivel2) &&
        m.h2 === p.deNivel2 &&
        m.contadores === p.deNivel2
      );
    }),
    PAGINAS.map((p, i) => `${p.chave} declara ${todas[i].seccoesDeclaradas}/folha ${todas[i].seccoesNaFolha}, registo ${p.deNivel2}, contadores ${todas[i].contadores}`).join(' · '),
  );

  conta(
    'I8 · zero alvos abaixo de 44px na mobília da própria página de leitura, nas 8 · 390 (WebKit, toque)',
    todas.every((m) => (m.alvos.porZona.pagina ?? 0) === 0 && (m.alvos.porZona.rodape ?? 0) === 0),
    `por página (mobília da página + rodapé): ${alvosDaPagina.join(' · ')} · no corpo transcrito, que é a isenção medida: ${todas.map((m) => m.alvos.porZona.artigo ?? 0).join('/')} · na cabeça, que é do bloco F1.7: ${todas.map((m) => m.alvos.porZona.cabeca ?? 0).join('/')}`,
  );

  conta(
    'I7a · a subida à vista a 390, com alvo ≥ 44px nos dois eixos e dentro do ecrã',
    todas.every(
      (m) =>
        m.subir &&
        m.subir.display !== 'none' &&
        m.subir.pos === 'fixed' &&
        m.subir.l >= 44 &&
        m.subir.a >= 44 &&
        m.subir.dentroDoEcra,
    ),
    `${todas[0].subir?.l}×${todas[0].subir?.a}px (pt) e ${todas[6].subir?.l}×${todas[6].subir?.a}px (en), ${todas[0].subir?.pos}`,
  );

  /* O QUE ELA TAPA A 390, MEDIDO E NÃO ESCONDIDO. Numa janela de 390 a coluna
     de leitura é a janela menos duas goteiras de 18px, e um comando fixo de
     44px de lado não tem margem onde caber: tapa. A saída que não tapava era o
     comando no fim de cada secção, e essa está barrada pela transcrição (a
     mobília não entra no corpo). A célula mede-o em dez posições da página, e
     o número vai para o relatório em vez de ir para debaixo do tapete. */
  conta(
    'I10a · o que a subida tapa a 390, medido em dez posições de cada página (não é uma exigência: é a conta do que custa)',
    todas.every((m) => m.tapa.posicoes === 10),
    `caixas de linha do artigo debaixo da subida, em 10 posições: ${PAGINAS.map((p, i) => `${p.chave.split('/')[0].slice(0, 12)} ${todas[i].tapa.cruzamentos} (em ${todas[i].tapa.posicoesComTexto} das 10)`).join(' · ')} · a maior sobreposição: ${JSON.stringify(todas[4].tapa.pior)}`,
  );

  medidas.alturas390 = alturas;

  /* ---------------------------------------------- I4 · o contador tem tinta
     A prova é por píxeis e não por declaração: a mesma banda por cima do
     primeiro título de nível 2, com a regra e sem ela. Se os dois ficheiros
     forem iguais, o contador não desenha nada. */
  {
    const p = AMOSTRA.pt;
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const caixa = await pag.evaluate(() => {
      const h = document.querySelector('#documento h2[data-registo-bloco]');
      h.scrollIntoView({ block: 'center' });
      const r = h.getBoundingClientRect();
      return { x: Math.max(0, r.left - 2), y: Math.max(0, r.top - 22), width: 120, height: 20 };
    });
    const com = await pag.screenshot({ clip: caixa, type: 'png' });
    await pag.addStyleTag({ content: '.texto-artigo h2::before { content: none !important; }' });
    await pag.waitForTimeout(80);
    const sem = await pag.screenshot({ clip: caixa, type: 'png' });
    conta(
      'I4 · o contador da posição desenha tinta por cima do título (as duas capturas da mesma banda diferem quando a regra sai)',
      Buffer.compare(com, sem) !== 0,
      `banda de ${caixa.width}×${caixa.height}px em x=${Math.round(caixa.x)} y=${Math.round(caixa.y)} · com a regra ${com.length} B, sem ela ${sem.length} B, iguais: ${Buffer.compare(com, sem) === 0}`,
    );
    medidas.tintaDoContador = { com: com.length, sem: sem.length };
    await pag.close();
  }

  /* --------------------------------- I5a · a barra move-se, e sem guião nenhum */
  {
    const semGuiao = await navMovel.newContext({
      ...devices['iPhone 13'],
      deviceScaleFactor: 1,
      javaScriptEnabled: false,
    });
    const pag = await semGuiao.newPage();
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'load' });
    const barra = pag.locator('.texto-barra');
    const topo = await barra.boundingBox();
    /* O deslocamento faz-se pelo próprio navegador, sem uma linha de guião da
       página: a roda do rato não existe no WebKit de telemóvel, e o que rola
       aqui é o mecanismo do Playwright a trazer o rodapé à vista. */
    await pag.locator('footer').scrollIntoViewIfNeeded();
    await pag.waitForTimeout(300);
    const fim = await barra.boundingBox();
    conta(
      'I5a · a barra do progresso cresce com o deslocamento COM O GUIÃO DESLIGADO · 390 (WebKit)',
      topo !== null && fim !== null && topo.width < 2 && fim.width > 195,
      `sem JavaScript nenhum: no topo ${topo ? topo.width.toFixed(1) : 'não há'}px, com o rodapé à vista ${fim ? fim.width.toFixed(1) : 'não há'}px, numa janela de 390`,
    );
    medidas.barra390 = { topo: topo?.width ?? null, fim: fim?.width ?? null };
    await pag.close();
    await semGuiao.close();
  }

  /* -------------------------------------------------------------- capturas */
  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    for (const edicao of ['pt', 'en']) {
      const pag = await ctx2.newPage();
      await pag.goto(base + AMOSTRA[edicao].rota, { waitUntil: 'networkidle' });
      await pag.evaluate(() => document.fonts.ready);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-cima.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = true;
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-indice-aberto.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = false;
        const h = document.querySelectorAll('#documento h2[data-registo-bloco]')[2];
        if (h) h.scrollIntoView({ block: 'center' });
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-contador.png`), type: 'png' });
      await pag.close();
    }
    await ctx2.close();
  }
  await ctx.close();
}
await navMovel.close();

/* ========================================================================== */
/* 1280 × 800 · Chromium                                                       */
/* ========================================================================== */
const navMesa = await chromium.launch({ headless: true });
{
  const ctx = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const porPagina = {};
  for (const p of PAGINAS) {
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const pecas = await pag.evaluate(SONDA_PECAS);
    await pag.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const tapa = await pag.evaluate(SONDA_TAPA);
    const dist = await pag.evaluate(SONDA_DISTANCIAS);
    porPagina[p.chave] = { ...pecas, tapa, dist };
    await pag.close();
  }
  medidas.m1280 = porPagina;
  const todas = Object.values(porPagina);

  conta(
    'I7b · a subida à vista a 1280, com alvo ≥ 44px nos dois eixos e sem apanhar uma caixa de linha do artigo em dez posições da página',
    todas.every(
      (m) =>
        m.subir &&
        m.subir.display !== 'none' &&
        m.subir.l >= 44 &&
        m.subir.a >= 44 &&
        m.subir.dentroDoEcra &&
        m.tapa.cruzamentos === 0 &&
        m.tapa.posicoes === 10,
    ),
    `${todas[0].subir?.l}×${todas[0].subir?.a}px, ${todas[0].subir?.pos} · caixas de linha tapadas em 10 posições: ${todas.map((m) => m.tapa.cruzamentos).join('/')} · a 1280 o comando fica na goteira, à direita da coluna do aparelho`,
  );

  conta(
    'I3b · o contador da posição também a 1280, em cada título de nível 2 das 8',
    PAGINAS.every((p, i) => todas[i].contadores === p.deNivel2 && todas[i].seccoesDeclaradas === String(p.deNivel2)),
    PAGINAS.map((p, i) => `${p.chave.split('/')[0].slice(0, 12)} ${todas[i].contadores}/${p.deNivel2}`).join(' · '),
  );

  /* I5b · a barra, na outra família de motores, e também sem guião. */
  {
    const semGuiao = await navMesa.newContext({
      viewport: { width: 1280, height: 800 },
      javaScriptEnabled: false,
    });
    const pag = await semGuiao.newPage();
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'load' });
    const barra = pag.locator('.texto-barra');
    const topo = await barra.boundingBox();
    await pag.locator('footer').scrollIntoViewIfNeeded();
    await pag.waitForTimeout(300);
    const fim = await barra.boundingBox();
    conta(
      'I5b · a barra do progresso cresce com o deslocamento COM O GUIÃO DESLIGADO · 1280 (Chromium)',
      topo !== null && fim !== null && topo.width < 2 && fim.width > 640,
      `sem JavaScript nenhum: no topo ${topo ? topo.width.toFixed(1) : 'não há'}px, com o rodapé à vista ${fim ? fim.width.toFixed(1) : 'não há'}px, numa janela de 1280`,
    );
    medidas.barra1280 = { topo: topo?.width ?? null, fim: fim?.width ?? null };
    await pag.close();
    await semGuiao.close();
  }

  /* I6 · o que a página serve sem guião nenhum, lido do HTML. */
  {
    const html = fs.readFileSync(
      path.join(DIST, AMOSTRA.pt.rota.replace(/^\//, ''), 'index.html'),
      'utf8',
    );
    const conta_ = (re) => (html.match(re) ?? []).length;
    const pecas = {
      indice: conta_(/id="texto-indice"/g),
      entradas: conta_(/data-registo-indice=/g),
      seccoes: conta_(/data-seccoes="\d+"/g),
      barra: conta_(/class="texto-barra"/g),
      subir: conta_(/class="texto-subir"/g),
    };
    conta(
      'I6 · o índice, o total das secções, a barra e a subida estão no HTML servido, sem depender de guião nenhum',
      pecas.indice === 1 &&
        pecas.entradas === AMOSTRA.pt.titulos.length &&
        pecas.seccoes === 1 &&
        pecas.barra === 1 &&
        pecas.subir === 1,
      `no ficheiro construído: índice ${pecas.indice}, entradas ${pecas.entradas} (registo ${AMOSTRA.pt.titulos.length}), data-seccoes ${pecas.seccoes}, barra ${pecas.barra}, subida ${pecas.subir}`,
    );
    medidas.semGuiao = pecas;
  }

  /* I9 · a razão da isenção do corpo, medida. */
  {
    const d = todas.map((m) => m.dist);
    medidas.distancias = d;
    conta(
      'I9 · as portas do corpo transcrito estão mais perto umas das outras do que 44px, e é isso que as isenta (medida, não regra)',
      d.every((x) => x.pares > 0),
      PAGINAS.map(
        (p, i) =>
          `${p.chave.split('/')[0].slice(0, 12)}: ${d[i].portas} portas, ${d[i].paresAbaixoDe44}/${d[i].pares} pares a menos de 44px (${d[i].paresNaMesmaLinha} na mesma linha), mediana entre linhas ${d[i].mediana}px`,
      ).join(' · '),
    );
  }

  /* -------------------------------------------------------------- capturas */
  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    for (const edicao of ['pt', 'en']) {
      const pag = await ctx2.newPage();
      await pag.goto(base + AMOSTRA[edicao].rota, { waitUntil: 'networkidle' });
      await pag.evaluate(() => document.fonts.ready);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-cima.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = true;
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-indice-aberto.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = false;
        window.scrollTo(0, document.documentElement.scrollHeight / 2);
      });
      await pag.waitForTimeout(160);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-meio.png`), type: 'png' });
      await pag.close();
    }
    await ctx2.close();
  }
  await ctx.close();
}
await navMesa.close();

servidor.close();

/* ========================================================================== */
/* A saída                                                                     */
/* ========================================================================== */
let falhou = 0;
for (const r of reguas) {
  if (!r.passa) falhou++;
  console.log(`${r.passa ? verde('  ✓') : vermelho('  ✗')} ${r.nome}`);
  console.log(cinza(`      ${r.prova}`));
}
console.log(
  falhou === 0
    ? verde(`\n  índice ✓ ${reguas.length} de ${reguas.length}`)
    : vermelho(`\n  índice ✗ ${falhou} de ${reguas.length} falharam`),
);
if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 1));
  console.log(cinza(`      medidas em ${FICHEIRO_JSON}`));
}
process.exit(falhou === 0 ? 0 : 1);
