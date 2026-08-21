#!/usr/bin/env node
/**
 * A RÉGUA DO RECIBO — o que a página de linha tem de ser, medido no motor.
 *
 * ---------------------------------------------------------------------------
 * NÃO É UM PORTÃO. Imprime, e sai sempre com 0.
 * ---------------------------------------------------------------------------
 * Corre fora do `npm run build`, como `tests/inicio/matriz.mjs`, e pela mesma
 * razão: o que tem de fechar a construção é uma extensão de um portão que já
 * existe, provada num estrago plantado. O que se mede aqui é FORMA — que letra
 * cada coisa tem, que largura, que alvo, que transbordo —, e a forma julga-se
 * lendo, não obedecendo.
 *
 * O que mede, célula a célula:
 *   1. a ordem do recibo (`IDENTIDADE.md` §11), pela ordem em que os blocos
 *      aparecem no documento;
 *   2. a letra: Spectral SC nos rótulos, Bitter no que é transcrito e nos
 *      identificadores, Spectral na prosa da casa;
 *   3. a marca de água: quantas, onde, com que desenho, e se está fora da
 *      árvore de acessibilidade;
 *   4. as portas do aparelho, uma a uma;
 *   5. o alvo do selo do valor de cabeça;
 *   6. o telemóvel a 390: o valor, o título e o selo num só grupo visível, e o
 *      recorte dentro da sua caixa;
 *   7. o transbordo horizontal a 320, 390, 768, 1024 e 1280, nas duas edições.
 *
 *   node tests/linha/recibo.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.png': 'image/png',
};

const servidor = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, p);
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch();

let passam = 0;
let total = 0;
function conta(nome, bem, prova) {
  total += 1;
  if (bem) passam += 1;
  console.log(`  ${bem ? verde('passa') : vermelho('falha')}  ${nome}`);
  if (prova) console.log(cinza(`         ${prova}`));
}

async function pagina(largura = 1280) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 1000 } });
  const p = await ctx.newPage();
  p.__contexto = ctx;
  return p;
}

/** A linha completa, a linha com o marcador, e a linha derivada. */
const COMPLETA = '/livro-razao/divida-publica-2025';
const MARCADOR = '/livro-razao/avisos-pt2030-abertos';
const DERIVADA = '/livro-razao/evora-indice-de-divida-2024';

console.log('');
console.log(cinza('  a régua do recibo · a página de linha, medida no motor'));
console.log('');

/* 1 · A ORDEM DO RECIBO (IDENTIDADE.md §11). */
{
  const p = await pagina();
  await p.goto(base + COMPLETA, { waitUntil: 'networkidle' });
  const ordem = await p.evaluate(() => {
    const corpo = document.querySelector('.linha-corpo');
    const cabeca = document.querySelector('.linha-cabeca');
    const marcas = [];
    if (cabeca?.querySelector('[data-claim]')) marcas.push('valor');
    if (cabeca?.querySelector('.src-chip')) marcas.push('selo');
    if (cabeca?.querySelector('.linha-id')) marcas.push('id');
    for (const el of corpo.children) {
      if (el.classList.contains('linha-atribuicao')) marcas.push('atribuicao');
      else if (el.querySelector?.('#serie')) marcas.push('serie');
      else if (el.id === 'prova') marcas.push('prova');
      else if (el.querySelector?.('#aritmetica')) marcas.push('derivacao');
      else if (el.querySelector?.('#pedido')) marcas.push('pedido');
      else if (el.querySelector?.('#verificacoes')) marcas.push('verificacoes');
      else if (el.querySelector?.('#historico')) marcas.push('historico');
    }
    return marcas;
  });
  const esperada = ['valor', 'selo', 'id', 'atribuicao', 'serie', 'prova', 'pedido', 'verificacoes', 'historico'];
  conta(
    '3a · a ordem do recibo é a da §11',
    ordem.join(',') === esperada.join(','),
    ordem.join(' → '),
  );
  await p.__contexto.close();
}

/* 2 · A LETRA. Spectral SC nos rótulos, Bitter no transcrito, Spectral na prosa. */
{
  const p = await pagina();
  await p.goto(base + COMPLETA, { waitUntil: 'networkidle' });
  const l = await p.evaluate(() => {
    const familia = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '') : null;
    };
    return {
      rotuloBloco: familia('.linha-bloco-titulo'),
      rotuloCampo: familia('.linha-campo-k'),
      rotuloFicha: familia('.aparelho-ficha dt'),
      rotuloVerif: familia('.linha-verificacoes dt'),
      excerto: familia('.linha-excerto'),
      pedido: familia('.linha-pedido'),
      fichaValor: familia('.aparelho-ficha dd'),
      atribuicao: familia('.linha-atribuicao'),
      nota: familia('.linha-nota'),
      id: familia('.linha-id code'),
      caixaAlta: [...document.querySelectorAll('.linha-corpo *, .aparelho *')].filter((e) => {
        const c = getComputedStyle(e);
        return c.textTransform === 'uppercase' && c.fontFamily.includes('Bitter');
      }).length,
    };
  });
  const rotulos = [l.rotuloBloco, l.rotuloCampo, l.rotuloFicha, l.rotuloVerif];
  const transcrito = [l.excerto, l.pedido, l.fichaValor, l.id];
  const prosa = [l.atribuicao, l.nota];
  conta(
    '3a · a letra: versaletes nos rótulos, Bitter no transcrito, Spectral na prosa',
    rotulos.every((f) => f === 'Spectral SC') &&
      transcrito.every((f) => f === 'Bitter') &&
      prosa.every((f) => f === 'Spectral') &&
      l.caixaAlta === 0,
    `rótulos ${rotulos.join('/')} · transcrito ${transcrito.join('/')} · prosa ${prosa.join('/')} · ` +
      `Bitter em caixa alta fora de instrumento: ${l.caixaAlta}`,
  );
  await p.__contexto.close();
}

/* 3 · A MARCA DE ÁGUA. Só onde falta um campo, `aria-hidden`, e o marcador
   continua rendido em texto onde estava. */
{
  for (const [rota, esperadas] of [[MARCADOR, 3], [COMPLETA, 0]]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const marcas = [...document.querySelectorAll('.marca-agua')];
      /* O desenho está no pseudo-elemento: é ele que roda, dentro da caixa que
         corta, e é a ele que se pergunta o traço e o preenchimento. */
      const cs = marcas[0] ? getComputedStyle(marcas[0], '::before') : null;
      return {
        n: marcas.length,
        texto: [...new Set(marcas.map((e) => e.getAttribute('data-marca')))],
        ariaHidden: marcas.every((e) => e.getAttribute('aria-hidden') === 'true'),
        traco: cs?.webkitTextStrokeColor ?? null,
        preenchimento: cs?.color ?? null,
        rodado: cs ? cs.transform !== 'none' : null,
        atras: marcas.every((e) => Number(getComputedStyle(e).zIndex) === 0),
        corta: marcas.every((e) => getComputedStyle(e).overflow === 'hidden'),
        /* O marcador em texto, que é a palavra: continua onde estava. */
        marcadores: document.querySelectorAll('.marcador').length,
      };
    });
    conta(
      `3a · a marca de água em ${rota.split('/').pop()}`,
      m.n === esperadas &&
        (esperadas === 0 ||
          (m.texto.length === 1 &&
            m.texto[0] === '[a verificar]' &&
            m.ariaHidden &&
            m.rodado &&
            m.atras &&
            m.corta &&
            m.preenchimento === 'rgba(0, 0, 0, 0)')),
      `${m.n} marca(s) · texto ${JSON.stringify(m.texto)} · aria-hidden ${m.ariaHidden} · ` +
        `traço ${m.traco} · preenchimento ${m.preenchimento} · rodada ${m.rodado} · ` +
        `caixa a cortar ${m.corta} · marcadores em texto: ${m.marcadores}`,
    );
    await p.__contexto.close();
  }
}

/* 4 · AS PORTAS DO APARELHO (IDENTIDADE.md §11). */
{
  const p = await pagina();
  await p.goto(base + COMPLETA, { waitUntil: 'networkidle' });
  const portas = await p.evaluate(() =>
    [...document.querySelectorAll('.aparelho a[href]')].map((a) => a.getAttribute('href')),
  );
  const tem = (s) => portas.some((h) => h === s || h.startsWith(s));
  conta(
    '3a · o aparelho leva o JSON da linha, o conjunto, esta linha na outra edição e a porta das correções',
    tem('/livro-razao/divida-publica-2025.json') &&
      tem('/livro-razao.csv') &&
      tem('/livro-razao.json') &&
      tem('/en/ledger/divida-publica-2025') &&
      tem('mailto:') &&
      tem('/correcoes'),
    portas.join(' · '),
  );
  await p.__contexto.close();
}

/* 5 · O SELO DO VALOR DE CABEÇA, e o seu alvo. */
{
  const p = await pagina();
  await p.goto(base + COMPLETA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const selo = document.querySelector('.linha-selo .src-chip');
    if (!selo) return null;
    const r = selo.getBoundingClientRect();
    const depois = getComputedStyle(selo, '::after');
    let ancestral = selo.parentElement;
    let aninhado = false;
    while (ancestral) {
      const tag = ancestral.tagName.toLowerCase();
      if (tag === 'a' || tag === 'button') aninhado = true;
      ancestral = ancestral.parentElement;
    }
    return {
      href: selo.getAttribute('href'),
      largura: Math.round(r.width * 10) / 10,
      altura: Math.round(depois.height ? parseFloat(depois.height) : r.height),
      aninhado,
    };
  });
  conta(
    '3a · o selo do valor de cabeça: âncora para o bloco da prova, alvo de 44px, sem aninhamento',
    m && m.href === '/livro-razao/divida-publica-2025#prova' && m.altura >= 44 && !m.aninhado,
    m ? `href ${m.href} · ${m.largura}×${m.altura}px · aninhado ${m.aninhado}` : '(sem selo)',
  );
  await p.__contexto.close();
}

/* 6 · O TELEMÓVEL A 390 (IDENTIDADE.md §11, «Móvel»). */
{
  const p = await pagina(390);
  await p.goto(base + COMPLETA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const cabeca = document.querySelector('.linha-cabeca');
    const valor = document.querySelector('.linha-valor');
    const selo = document.querySelector('.linha-selo');
    const id = document.querySelector('.linha-id');
    const r = (e) => e.getBoundingClientRect();
    return {
      alturaDoGrupo: Math.round(r(id).bottom - r(valor).top),
      seloAbaixoDoValor: r(selo).top >= r(valor).bottom - 1,
      grupoNaJanela: r(id).bottom <= window.innerHeight,
      larguraDaCabeca: Math.round(r(cabeca).width),
    };
  });
  conta(
    '3a · 390: o valor, o selo e o id num só grupo visível',
    m.seloAbaixoDoValor && m.grupoNaJanela,
    `grupo de ${m.alturaDoGrupo}px · selo por baixo do valor ${m.seloAbaixoDoValor} · ` +
      `dentro da janela ${m.grupoNaJanela} · cabeça ${m.larguraDaCabeca}px`,
  );
  await p.__contexto.close();
}

/* 6b · O RECORTE DENTRO DA SUA CAIXA, a 390. */
{
  const p = await pagina(390);
  await p.goto(base + '/livro-razao/evora-despesa-paga-2025', { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const fig = document.querySelector('.linha-recorte');
    const img = document.querySelector('.linha-recorte img');
    if (!fig || !img) return null;
    return {
      caixa: Math.round(fig.getBoundingClientRect().width),
      imagem: Math.round(img.getBoundingClientRect().width),
      transbordoDaPagina:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  conta(
    '3a · 390: o recorte cabe na sua caixa e não empurra a página',
    m && m.imagem <= m.caixa && m.transbordoDaPagina === 0,
    m ? `caixa ${m.caixa}px · imagem ${m.imagem}px · transbordo ${m.transbordoDaPagina}px` : '(sem recorte)',
  );
  await p.__contexto.close();
}

/* 7 · O TRANSBORDO, cinco larguras, duas edições, três linhas. */
{
  const rotas = [
    COMPLETA,
    MARCADOR,
    DERIVADA,
    '/en/ledger/divida-publica-2025',
    '/en/ledger/avisos-pt2030-abertos',
    '/en/ledger/evora-indice-de-divida-2024',
  ];
  const larguras = [320, 390, 768, 1024, 1280];
  const linhas = [];
  let mau = 0;
  for (const largura of larguras) {
    const p = await pagina(largura);
    for (const rota of rotas) {
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const t = await p.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (t !== 0) {
        mau += 1;
        linhas.push(`${rota} @${largura}: ${t}px`);
      }
    }
    await p.__contexto.close();
  }
  conta(
    '3a · transbordo 0 em 3 linhas × 2 edições × 5 larguras',
    mau === 0,
    mau === 0 ? `30 de 30 combinações a zero` : linhas.join(' · '),
  );
}

await nav.close();
servidor.close();

console.log('');
console.log(`  ${passam === total ? verde(`${passam} de ${total} células passam.`) : vermelho(`${passam} de ${total} células passam.`)}`);
console.log('');
process.exit(0);
