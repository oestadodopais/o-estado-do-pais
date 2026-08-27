#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO BLOCO B DAS CORREÇÕES DE UX (25.08.2026) · itens B1 a B6
 * =============================================================================
 *
 * Uma régua por item de `design/especime-v3/briefs/BRIEF-correcoes-ux-B.md` §2,
 * com o objetivo medido que o brief escreve para cada um. NÃO é um portão: não
 * entra no `npm run build` e não constrói nada. Corre sobre `dist/`, imprime uma
 * linha por régua e SAI COM 0 quando todas passam e com 1 quando alguma falha —
 * como `tests/inicio/correcoes-a.mjs`, e pela mesma razão: estas existem para
 * que um estrago plantado se veja no código de saída.
 *
 *   node tests/texto/correcoes-b.mjs
 *   node tests/texto/correcoes-b.mjs --json <ficheiro>
 *   node tests/texto/correcoes-b.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * OS DOIS APARELHOS, E PORQUÊ DOIS
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664) e toque a sério, que
 * é o aparelho com que a auditoria de 25.08 mediu os achados C4, C9, C10 e D1.
 * Computador: Chromium a 1280 × 800. A prova do B3 pede as duas famílias, e é
 * por isso que a dobra se mede nas duas: o algoritmo que revela os antepassados
 * `<details>` ao navegar para um fragmento é recente, e uma promessa sobre ele
 * não se acredita, mede-se.
 *
 * O que cada item mede está escrito ao lado da sua régua.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';
import { parse } from 'node-html-parser';

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

const O04 = { pt: '/estudos/evora-prometido-pago-auditado-2026', en: '/en/studies/evora-prometido-pago-auditado-2026' };
const TEXTO = { pt: `${O04.pt}/texto`, en: `${O04.en}/text` };
const DOC = { pt: `${O04.pt}/documento`, en: `${O04.en}/document` };
const ESTUDOS = { pt: '/estudos', en: '/en/studies' };

/* ========================================================================== */
/* O que se lê do disco, sem navegador: o HTML construído.                     */
/* ========================================================================== */

function ficheirosHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) ficheirosHtml(f, out);
    else if (e.name.endsWith('.html')) out.push(f);
  }
  return out;
}

/* ---------------------------------------------------------------- B5 · o marcador
   `IDENTIDADE.md` §6: um marcador, uma classe, uma página que o explica. O que
   este bloco acrescenta é a PORTA, e a conferência é sobre as 342 páginas
   construídas e não sobre uma amostra: cada `.marcador` ou é ele próprio a
   âncora da página do marcador, ou é o marcador DENTRO do selo, que é um só
   `<a>` por decisão da §5.4 e da Emenda 2. Não há terceiro caso.

   E A MESMA VARREDURA CONTA AS ÂNCORAS ANINHADAS, que é o defeito que esta
   mudança podia ter criado: uma `<a>` dentro de outra `<a>` não é markup
   válido, e o navegador desfá-la — a porta do selo passaria a abrir a página do
   marcador. Zero é a única leitura aceitável. */
{
  const ficheiros = ficheirosHtml(DIST);
  let marcadores = 0;
  let comPorta = 0;
  let dentroDoSelo = 0;
  let semPorta = 0;
  let aninhadas = 0;
  const exemplos = [];
  const PORTAS = new Set(['/a-verificar', '/en/to-verify']);
  for (const f of ficheiros) {
    const root = parse(fs.readFileSync(f, 'utf8'));
    for (const a of root.querySelectorAll('a a')) {
      aninhadas++;
      if (exemplos.length < 3) {
        exemplos.push(`${path.relative(DIST, f)}: <a class="${a.getAttribute('class') ?? ''}">`);
      }
    }
    for (const m of root.querySelectorAll('.marcador')) {
      marcadores++;
      const tag = String(m.rawTagName ?? '').toLowerCase();
      if (tag === 'a' && PORTAS.has(m.getAttribute('href') ?? '')) comPorta++;
      else if (m.closest('a.src-chip')) dentroDoSelo++;
      else {
        semPorta++;
        if (exemplos.length < 6) {
          exemplos.push(`${path.relative(DIST, f)}: <${tag} class="marcador"> sem porta`);
        }
      }
    }
  }
  medidas.marcador = { ficheiros: ficheiros.length, marcadores, comPorta, dentroDoSelo, semPorta, aninhadas };
  conta(
    'B5 · todo o marcador leva a porta de `/a-verificar`, menos o que vive dentro do selo',
    semPorta === 0 && comPorta > 0,
    `${marcadores} marcadores em ${ficheiros.length} páginas · ${comPorta} com porta · ${dentroDoSelo} dentro do selo (um só <a>, §5.4) · ${semPorta} sem porta${exemplos.length ? ` · ${exemplos.join(' | ')}` : ''}`,
  );
  conta(
    'B5 · nenhuma âncora aninhada dentro de outra âncora, nas 342 páginas',
    aninhadas === 0,
    `${aninhadas} <a> dentro de <a>${exemplos.length ? ` · ${exemplos.slice(0, 3).join(' | ')}` : ''}`,
  );
}

/* ------------------------------------------------------------- B6 · «concelho»
   A interface inglesa não usa uma palavra portuguesa para uma coisa que tem
   nome em inglês. A varredura é sobre o TEXTO VISÍVEL das páginas inglesas, e
   não sobre `strings.mjs`: o que importa é o que o leitor lê. Ficam de fora as
   citações — o título de um trabalho, um campo de uma linha, um excerto, o nome
   próprio «Carta Administrativa Oficial de Portugal» —, que são as mesmas
   isenções que o portão já escreve. */
{
  /**
   * O QUE NÃO É CADEIA DA INTERFACE, e por isso sai desta contagem: tudo o que
   * é campo de uma linha do livro-razão ou de um registo, conferido carácter a
   * carácter noutro sítio. É a mesma lista de isenções que o portão escreve
   * (`eCitado`), mais as marcas do registo de correções: a prosa de uma
   * correção é um campo da linha (`reason_en`), vem do motor com ela, e
   * reescrevê-la deste lado era o sítio a escrever o que o motor declara
   * (`DECISIONS.md` §1.31). São essas as ocorrências que ficam, e a nota do
   * bloco di-las por extenso.
   */
  const CITADO = [
    'data-verbatim',
    'data-linha-campo',
    'data-linha-claim',
    'data-correcao-campo',
    'data-correcao-claim',
    'data-correcao-entrada',
    'data-registo-unidade',
    'data-registo-indice',
    'data-agenda',
  ];
  const NONLEDGER_CITADO = new Set(['titulo-de-estudo', 'proveniencia', 'identificador-tecnico']);
  const eCitado = (n) => {
    for (let el = n; el; el = el.parentNode) {
      if (el.nodeType !== 1) continue;
      const tag = String(el.rawTagName ?? '').toLowerCase();
      if (['blockquote', 'q', 'cite', 'script', 'style', 'template'].includes(tag)) return true;
      const attrs = el.attributes ?? {};
      /* Um bloco declarado em português numa página inglesa não é a interface
         inglesa: é a frase da outra edição, que a página do trabalho mostra de
         propósito e marca com `lang`. */
      if ((attrs.lang ?? '').startsWith('pt')) return true;
      if (CITADO.some((a) => a in attrs)) return true;
      if (NONLEDGER_CITADO.has(attrs['data-nonledger'] ?? '')) return true;
    }
    return false;
  };
  /* As páginas de DOCUMENTO ficam de fora inteiras: abaixo da faixa está obra
     citada, alojada byte a byte, e o portão já a dispensa do varrimento pela
     mesma razão. O que é nosso nessas páginas é a faixa, e a faixa não escreve
     a palavra. */
  const paginasEn = ficheirosHtml(DIST).filter((f) => {
    const rel = path.relative(DIST, f);
    if (!(rel === 'en.html' || rel.startsWith('en/'))) return false;
    return !/(^|\/)document(\/index)?\.html$/.test(rel) && !rel.endsWith('/document/index.html');
  });
  const achados = [];
  for (const f of paginasEn) {
    const root = parse(fs.readFileSync(f, 'utf8'));
    const corpo = root.querySelector('body');
    if (!corpo) continue;
    const anda = (n) => {
      if (!n) return;
      if (n.nodeType === 3) {
        if (/\bconcelho/i.test(n.rawText) && !eCitado(n.parentNode)) {
          achados.push(`${path.relative(DIST, f)}: «${n.rawText.replace(/\s+/g, ' ').trim().slice(0, 60)}»`);
        }
        return;
      }
      if (n.nodeType !== 1) return;
      for (const filho of n.childNodes ?? []) anda(filho);
    };
    anda(corpo);
  }
  medidas.concelhoEmIngles = { paginas: paginasEn.length, achados: achados.length };
  conta(
    'B6 · a interface inglesa não diz «concelho» fora de uma citação',
    achados.length === 0,
    `${paginasEn.length} páginas inglesas · ${achados.length} ocorrência(s)${achados.length ? ` · ${achados.slice(0, 3).join(' | ')}` : ''}`,
  );
}

/* ========================================================================== */
/* 390 · WebKit, iPhone 13                                                     */
/* ========================================================================== */

const navMovel = await webkit.launch({ headless: true });

for (const edicao of ['pt', 'en']) {
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });

  /* -------------------------------------------------- B1 · o índice dos estudos */
  {
    const p = await ctx.newPage();
    await p.goto(base + ESTUDOS[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => ({
      itens: document.querySelectorAll('.arquivo-item').length,
      titulos: [...document.querySelectorAll('.arquivo-titulo a')].map((a) => a.textContent.trim()),
      /* Uma edição é uma PORTA dentro da linha, e não uma linha repetida. */
      portas: [...document.querySelectorAll('.arquivo-edicoes a.badge-porta')].length,
      semPorta: [...document.querySelectorAll('.arquivo-meta .badge:not(a)')].length,
      /* O rótulo da descrição não se rende. */
      rotulos: [...document.querySelectorAll('.arquivo-item')].filter((a) =>
        /Descri[çc]|Description:/.test(a.textContent),
      ).length,
      /* «Publicação: …» diz-se uma vez por trabalho. */
      datas: [...document.querySelectorAll('.arquivo-item')].map(
        (a) => a.querySelectorAll('[data-nonledger="data-de-publicacao"]').length,
      ),
      contagens: [...document.querySelectorAll('.estudos-contagens [data-claim]')].map((e) =>
        e.textContent.trim(),
      ),
      altura: document.documentElement.scrollHeight,
    }));
    const duplicados = m.titulos.length - new Set(m.titulos).size;
    conta(
      `B1 · uma linha por trabalho, com as edições como portas · 390 ${edicao}`,
      m.itens === 12 &&
        duplicados === 0 &&
        m.portas === 16 &&
        m.semPorta === 0 &&
        m.rotulos === 0 &&
        m.datas.every((n) => n === 1),
      `${m.itens} linhas (eram 16) · ${duplicados} títulos repetidos · ${m.portas} edições como portas · ${m.rotulos} rótulos de descrição à vista · datas por linha: ${[...new Set(m.datas)].join(',')} · contagens da prova: ${m.contagens.join(' · ')} · altura ${m.altura}px`,
    );
    if (edicao === 'pt') medidas.estudos = m;
    await p.close();
  }

  /* --------------------------------------- B2 · a leitura no sítio vem primeiro */
  {
    const p = await ctx.newPage();
    await p.goto(base + O04[edicao], { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => ({
      accoes: [...document.querySelectorAll('.estudo-accoes a')].map((a) => a.getAttribute('href')),
      rotulos: [...document.querySelectorAll('.estudo-accoes a')].map((a) =>
        a.textContent.replace(/\s+/g, ' ').trim(),
      ),
      nota: document.querySelector('.estudo-accao-nota')?.textContent.trim() ?? null,
      fichas: [...document.querySelectorAll('.edicao-meta')].map((d) =>
        [...d.querySelectorAll('a')].map((a) => a.getAttribute('href')).filter((h) => /texto|text|documento|document/.test(h)),
      ),
    }));
    const primeiroETexto = /\/(texto|text)$/.test(m.accoes[0] ?? '');
    const fichasEmOrdem = m.fichas.every(
      (hs) => hs.length < 2 || /\/(texto|text)$/.test(hs[0]),
    );
    conta(
      `B2 · «Ler no sítio →» é a porta principal, e a edição de registo vem a seguir sem legenda (a legenda saiu no G6 da grelha da voz, 27.08) · 390 ${edicao}`,
      primeiroETexto && fichasEmOrdem && m.nota === null,
      `${m.rotulos.join(' | ')} → ${m.accoes.join(' ')} · nota «${m.nota}» · fichas ${JSON.stringify(m.fichas)}`,
    );
    await p.close();
  }

  /* ------------------------------------- B2 · a faixa da edição arquivada */
  {
    const p = await ctx.newPage();
    await p.goto(base + DOC[edicao], { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const faixa = document.querySelector('[data-oedp-faixa]');
      const texto = faixa?.querySelector('[data-oedp-texto]') ?? null;
      return {
        faixa: !!faixa,
        porta: texto ? texto.getAttribute('href') : null,
        rotulo: texto ? texto.textContent.replace(/\s+/g, ' ').trim() : null,
        ordem: faixa ? [...faixa.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [],
      };
    });
    const esperada = TEXTO[edicao];
    conta(
      `B2 · a faixa da edição arquivada abre a leitura no sítio · 390 ${edicao}`,
      m.faixa && m.porta === esperada,
      `porta «${m.rotulo}» → ${m.porta} (esperado ${esperada}) · a faixa leva ${m.ordem.length} portas`,
    );
    await p.close();
  }

  /* ------------------------------------------------- B3 · a dobra, e as três provas */
  {
    const p = await ctx.newPage();
    await p.goto(base + TEXTO[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const entrada = await p.evaluate(() => {
      const d = document.querySelector('#linhas-do-documento-dobra');
      const sec = document.querySelector('#linhas-do-documento');
      const art = document.querySelector('#documento');
      return {
        dobra: !!d,
        aberta: d ? d.open : null,
        entradas: sec ? sec.querySelectorAll('[id^="linha-"]').length : 0,
        alturaPagina: document.documentElement.scrollHeight,
        alturaArtigo: art ? Math.round(art.getBoundingClientRect().height) : 0,
        /* o aparelho técnico do registo saiu da coluna do aparelho */
        noAparelho: document.querySelectorAll('.aparelho .texto-origem').length,
        naDobra: document.querySelectorAll('#linhas-do-documento-dobra .texto-origem').length,
        /* a faixa das contagens fica no aparelho, com as portas para #documento */
        contas: [...document.querySelectorAll('.aparelho [data-registo-conta]')].map((a) =>
          a.getAttribute('href'),
        ),
      };
    });
    conta(
      `B3 · a dobra fecha por defeito e o artigo acaba onde acaba · 390 ${edicao}`,
      entrada.dobra &&
        entrada.aberta === false &&
        entrada.noAparelho === 0 &&
        entrada.naDobra === 2 &&
        entrada.contas.length === 3 &&
        entrada.contas.every((h) => h === '#documento'),
      `dobra fechada ${entrada.aberta === false} · ${entrada.entradas} entradas lá dentro · página ${entrada.alturaPagina}px (o artigo mede ${entrada.alturaArtigo}) · aparelho do registo: ${entrada.noAparelho} no aparelho, ${entrada.naDobra} na dobra · faixa das contagens: ${entrada.contas.join(' ')}`,
    );
    if (edicao === 'pt') medidas.texto390 = entrada;

    /* a porta de uma figura abre a dobra E a entrada */
    const alvo = await p.evaluate(() => {
      const a = document.querySelector('.texto-artigo a.texto-figura-porta');
      return a ? a.getAttribute('href') : null;
    });
    if (alvo) {
      await p.evaluate((h) => document.querySelector(`.texto-artigo a[href="${h}"]`).click(), alvo);
      await p.waitForTimeout(400);
      const dep = await p.evaluate((h) => {
        const d = document.querySelector('#linhas-do-documento-dobra');
        const e = document.getElementById(h.slice(1));
        const r = e ? e.getBoundingClientRect() : null;
        return {
          hash: location.hash,
          aberta: d.open,
          altura: r ? Math.round(r.height) : 0,
          topo: r ? Math.round(r.top) : null,
          dentro: r ? r.top > -60 && r.top < innerHeight : false,
        };
      }, alvo);
      conta(
        `B3 · a porta de uma figura abre a dobra e leva à entrada · 390 ${edicao} (WebKit)`,
        dep.aberta === true && dep.altura > 0 && dep.dentro,
        `${alvo} · dobra aberta ${dep.aberta} · entrada de ${dep.altura}px, topo a ${dep.topo}px de ${664}`,
      );
    } else {
      conta(`B3 · a porta de uma figura abre a dobra · 390 ${edicao}`, false, 'não há figura com porta nesta edição');
    }

    /* a navegação por fragmento, em carga direta */
    const fragmento = await p.evaluate(
      () => document.querySelector('#linhas-do-documento [id^="linha-"]').id,
    );
    await p.goto(`${base}${TEXTO[edicao]}#${fragmento}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const carga = await p.evaluate((id) => {
      const d = document.querySelector('#linhas-do-documento-dobra');
      const e = document.getElementById(id);
      const r = e ? e.getBoundingClientRect() : null;
      return { aberta: d.open, dentro: r ? r.height > 0 && r.top > -60 && r.top < innerHeight : false, topo: r ? Math.round(r.top) : null };
    }, fragmento);
    conta(
      `B3 · o endereço com fragmento abre a dobra em carga direta · 390 ${edicao} (WebKit)`,
      carga.aberta === true && carga.dentro,
      `#${fragmento} · dobra aberta ${carga.aberta} · entrada a ${carga.topo}px do topo do ecrã`,
    );
    await p.close();
  }

  /* ------------------------------------------------- B4 · o índice e o «subir» */
  {
    const p = await ctx.newPage();
    await p.goto(base + TEXTO[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const nav = document.querySelector('#texto-indice');
      const art = document.querySelector('#documento');
      const subir = document.querySelector('.texto-subir');
      const rs = subir ? subir.getBoundingClientRect() : null;
      const entradas = nav ? [...nav.querySelectorAll('a')] : [];
      return {
        indice: !!nav,
        foraDoArtigo: nav ? !art.contains(nav) : false,
        entradas: entradas.length,
        hrefs: entradas.map((a) => a.getAttribute('href')),
        destinos: entradas.filter((a) => document.querySelector(a.getAttribute('href'))).length,
        h2: art ? art.querySelectorAll('h2[data-registo-bloco]').length : 0,
        subirForaDoArtigo: subir ? !art.contains(subir) : false,
        subir: rs ? { w: +rs.width.toFixed(1), h: +rs.height.toFixed(1), fixo: getComputedStyle(subir).position } : null,
        subirDentroDoEcra: rs ? rs.bottom <= innerHeight + 1 && rs.top >= 0 : false,
      };
    });
    conta(
      `B4 · «Nesta página» com os títulos de nível 2, fora do artigo, e o comando «subir» fixo · 390 ${edicao}`,
      m.indice &&
        m.foraDoArtigo &&
        m.entradas > 0 &&
        m.entradas === m.h2 &&
        m.destinos === m.entradas &&
        m.subirForaDoArtigo &&
        m.subir?.fixo === 'fixed' &&
        m.subir.w >= 44 &&
        m.subir.h >= 44 &&
        m.subirDentroDoEcra,
      `${m.entradas} entradas para ${m.h2} títulos de nível 2, ${m.destinos} com destino na página · índice fora do <article>: ${m.foraDoArtigo} · subir ${m.subir?.w}×${m.subir?.h}px, ${m.subir?.fixo}, dentro do ecrã ${m.subirDentroDoEcra}`,
    );
    if (edicao === 'pt') medidas.indice = m;

    if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string' && edicao === 'pt') {
      fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
      const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
      for (const [nome, rota] of [
        ['estudos', ESTUDOS.pt],
        ['estudo', O04.pt],
        ['texto', TEXTO.pt],
      ]) {
        const p2 = await ctx2.newPage();
        await p2.goto(base + rota, { waitUntil: 'networkidle' });
        await p2.evaluate(() => document.fonts.ready);
        await p2.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-390-cima.jpg`), type: 'jpeg', quality: 72 });
        if (nome !== 'texto') {
          await p2.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-390-inteira.jpg`), type: 'jpeg', quality: 72, fullPage: true });
        }
        await p2.close();
      }
      await ctx2.close();
    }
    await p.close();
  }

  await ctx.close();
}
await navMovel.close();

/* ========================================================================== */
/* 1280 · Chromium                                                             */
/* ========================================================================== */

const navMesa = await chromium.launch({ headless: true });
for (const edicao of ['pt', 'en']) {
  const ctx = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();

  /* B3, a terceira prova: a mesma coisa noutra família de motores. */
  await p.goto(base + TEXTO[edicao], { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const entrada = await p.evaluate(() => {
    const d = document.querySelector('#linhas-do-documento-dobra');
    return {
      aberta: d ? d.open : null,
      alturaPagina: document.documentElement.scrollHeight,
      subir: getComputedStyle(document.querySelector('.texto-subir')).display,
    };
  });
  const fragmento = await p.evaluate(
    () => document.querySelector('#linhas-do-documento [id^="linha-"]').id,
  );
  await p.goto(`${base}${TEXTO[edicao]}#${fragmento}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const carga = await p.evaluate((id) => {
    const d = document.querySelector('#linhas-do-documento-dobra');
    const e = document.getElementById(id);
    const r = e ? e.getBoundingClientRect() : null;
    return { aberta: d.open, dentro: r ? r.height > 0 && r.top > -60 && r.top < innerHeight : false, topo: r ? Math.round(r.top) : null };
  }, fragmento);
  conta(
    `B3 · a dobra fechada e o fragmento a abri-la no computador · 1280 ${edicao} (Chromium)`,
    entrada.aberta === false && carga.aberta === true && carga.dentro,
    `entrada: dobra fechada ${entrada.aberta === false}, página ${entrada.alturaPagina}px · #${fragmento}: dobra aberta ${carga.aberta}, entrada a ${carga.topo}px · o comando «subir» no computador: ${entrada.subir}`,
  );
  if (edicao === 'pt') medidas.texto1280 = entrada;

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string' && edicao === 'pt') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    for (const [nome, rota] of [
      ['estudos', ESTUDOS.pt],
      ['estudo', O04.pt],
      ['texto', TEXTO.pt],
    ]) {
      const p2 = await ctx2.newPage();
      await p2.goto(base + rota, { waitUntil: 'networkidle' });
      await p2.evaluate(() => document.fonts.ready);
      await p2.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-1280-cima.jpg`), type: 'jpeg', quality: 72 });
      if (nome !== 'texto') {
        await p2.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-1280-inteira.jpg`), type: 'jpeg', quality: 72, fullPage: true });
      }
      await p2.close();
    }
    await ctx2.close();
  }
  await p.close();
  await ctx.close();
}
await navMesa.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · bloco B · itens B1 a B6 · ${reguas.length} réguas`));
console.log('');
let falhas = 0;
for (const r of reguas) {
  if (!r.passa) falhas++;
  console.log(`  ${r.passa ? verde('passa') : vermelho('falha')}  ${r.nome}`);
  console.log(cinza(`         ${r.prova}`));
}
console.log('');
console.log(
  falhas === 0
    ? verde(`  ${reguas.length} de ${reguas.length} réguas passam.`)
    : vermelho(`  ${falhas} de ${reguas.length} réguas falham.`),
);
console.log('');
process.exit(falhas === 0 ? 0 : 1);
