#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO PASSO C DAS CORREÇÕES DE UX (25.08.2026) · itens C1 e C3
 * =============================================================================
 *
 * Uma régua por prova de `design/especime-v3/briefs/BRIEF-correcoes-ux-C.md` §1.
 * NÃO é um portão: não entra no `npm run build` e não constrói nada. Corre sobre
 * `dist/`, imprime uma linha por régua e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, como as réguas dos blocos A e B, e pela mesma razão:
 * existem para que um estrago plantado se veja no código de saída.
 *
 *   node tests/texto/correcoes-c.mjs
 *   node tests/texto/correcoes-c.mjs --json <ficheiro>
 *   node tests/texto/correcoes-c.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * OS DOIS ITENS QUE VIVEM AQUI
 * ---------------------------------------------------------------------------
 * C1 · O ÍNDICE DA PÁGINA DE LEITURA NÃO ESCONDE O TÍTULO. A 390, o `<h1>` do
 *      documento começa antes de 45% do ecrã; a 1280, o índice está na coluna
 *      do aparelho e o `<h1>` no topo do corpo. O índice continua fora do
 *      `<article>` e com uma entrada por título de nível 2, que é o que o L8 do
 *      portão e a régua B4 já exigiam, e que esta não repete.
 *
 * C3 · OS MILHARES DE UM VALOR DE CABEÇA. A cadeia rendida traz U+00A0 e não
 *      U+202F, nas 342 páginas, e o separador MEDE-SE no navegador: a régua
 *      compara a largura do separador que a página imprime com a do espaço fino
 *      que ela imprimia, com a letra e o corpo que a página lhes dá. Uma
 *      conferência de cadeias sozinha não provava nada sobre o que se lê.
 *
 * ---------------------------------------------------------------------------
 * OS DOIS APARELHOS, E PORQUÊ DOIS
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664) e toque a sério.
 * Computador: Chromium a 1280 × 800. No C3 as duas famílias medem coisas
 * diferentes e as duas contam: Bitter não desenha U+202F, e é o RECURSO de cada
 * motor que decide a largura do carácter: no WebKit o espaço fino mede 1,64px
 * a 28px de corpo, e no Chromium mede 6,53px a 40px. Uma medição de um motor só
 * teria dito que não havia defeito nenhum.
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

const O04 = {
  pt: '/estudos/evora-prometido-pago-auditado-2026',
  en: '/en/studies/evora-prometido-pago-auditado-2026',
};
const TEXTO = { pt: `${O04.pt}/texto`, en: `${O04.en}/text` };

/* ========================================================================== */
/* C3, a parte que se lê do disco: as 342 páginas construídas.                 */
/* ========================================================================== */

function ficheirosHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) ficheirosHtml(f, out);
    else if (e.name.endsWith('.html')) out.push(f);
  }
  return out;
}

/* ------------------------------------------------ C3 · a cadeia em `dist/`
   O separador dos milhares de um `[data-claim]` é U+00A0 em todas as páginas
   construídas, e U+202F em nenhuma. O controlo positivo está na própria
   contagem: se a varredura não encontrasse `[data-claim]` nenhum, o zero de
   U+202F não provava nada, e por isso a régua exige também que os valores com
   separador existam. */
{
  const ficheiros = ficheirosHtml(DIST);
  let paginas = 0;
  let valores = 0;
  let comFino = 0;
  let comInsep = 0;
  const exemplos = [];
  for (const f of ficheiros) {
    paginas++;
    const root = parse(fs.readFileSync(f, 'utf8'));
    for (const el of root.querySelectorAll('[data-claim]')) {
      valores++;
      const t = el.textContent;
      if (t.includes('\u202F')) {
        comFino++;
        if (exemplos.length < 3) {
          exemplos.push(`${path.relative(DIST, f)} «${t}» ${el.getAttribute('data-claim')}`);
        }
      }
      if (t.includes('\u00A0')) comInsep++;
    }
  }
  medidas.c3_dist = { paginas, valores, comFino, comInsep };
  conta(
    'C3 · o separador dos milhares é U+00A0 em `dist/`, e U+202F em página nenhuma',
    comFino === 0 && comInsep > 0 && valores > 0,
    `${paginas} páginas · ${valores} valores com data-claim · ${comInsep} com U+00A0 · ${comFino} com U+202F` +
      (exemplos.length ? ` · ${exemplos.join(' | ')}` : ''),
  );
}

/* ========================================================================== */
/* 390 · WebKit, iPhone 13                                                     */
/* ========================================================================== */

const navMovel = await webkit.launch({ headless: true });

/**
 * A SONDA DO SEPARADOR (C3).
 *
 * Mede a largura de um carácter como a página o desenha: escreve «8x8» e «88»
 * com a letra, o corpo, o peso e o espaçamento do elemento do valor, e subtrai.
 * É a mesma técnica com que se mediu o defeito, e devolve o que se lê, não o que
 * o ficheiro da letra declara.
 */
const SONDA_SEPARADOR = () => {
  const alvo = document.querySelector('[data-claim="evora-prr-aprovado-2026"]');
  if (!alvo) return null;
  const cs = getComputedStyle(alvo);
  const mede = (txt) => {
    const s = document.createElement('span');
    s.style.fontFamily = cs.fontFamily;
    s.style.fontSize = cs.fontSize;
    s.style.fontWeight = cs.fontWeight;
    s.style.fontVariantNumeric = cs.fontVariantNumeric;
    s.style.letterSpacing = cs.letterSpacing;
    s.style.whiteSpace = 'pre';
    s.style.position = 'absolute';
    s.textContent = txt;
    document.body.appendChild(s);
    const w = s.getBoundingClientRect().width;
    s.remove();
    return w;
  };
  const base = mede('88');
  const pontos = [...alvo.textContent].map((c) => c.codePointAt(0));
  return {
    corpo: cs.fontSize,
    familia: cs.fontFamily.split(',')[0],
    texto: alvo.textContent,
    temInsep: pontos.includes(0x00a0),
    temFino: pontos.includes(0x202f),
    larguraInsep: +(mede('8\u00A08') - base).toFixed(2),
    larguraFino: +(mede('8\u202F8') - base).toFixed(2),
    larguraAlgarismo: +(mede('888') - base).toFixed(2),
  };
};

{
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });

  for (const edicao of ['pt', 'en']) {
    /* ------------------------------------------------- C1 · o título primeiro */
    const p = await ctx.newPage();
    await p.goto(base + TEXTO[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const art = document.querySelector('#documento');
      const h1 = art?.querySelector('h1');
      const nav = document.querySelector('#texto-indice');
      const dobra = nav?.querySelector('details');
      const porta = nav?.querySelector('summary');
      const rp = porta?.getBoundingClientRect();
      const rh = h1?.getBoundingClientRect();
      const rn = nav?.getBoundingClientRect();
      /* «acima do artigo» lê-se no documento, e não numa coordenada: é a ordem
         em que os dois nós aparecem. `compareDocumentPosition` diz-o. */
      const antesDoArtigo = Boolean(
        nav && art && nav.compareDocumentPosition(art) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      return {
        ecra: innerHeight,
        h1: rh ? +(rh.top + scrollY).toFixed(1) : null,
        pct: rh ? +(((rh.top + scrollY) / innerHeight) * 100).toFixed(1) : null,
        indiceTopo: rn ? +(rn.top + scrollY).toFixed(1) : null,
        indiceAltura: rn ? +rn.height.toFixed(1) : null,
        antesDoArtigo,
        foraDoArtigo: nav && art ? !art.contains(nav) : false,
        fechada: dobra ? !dobra.open : null,
        porta: rp ? { w: +rp.width.toFixed(1), h: +rp.height.toFixed(1) } : null,
        entradas: nav ? nav.querySelectorAll('a').length : 0,
      };
    });
    const alvo = 0.45 * m.ecra;
    conta(
      `C1 · o título do documento começa antes de 45% do ecrã, com o índice dobrado por cima · 390 ${edicao}`,
      m.h1 !== null &&
        m.h1 < alvo &&
        m.antesDoArtigo &&
        m.foraDoArtigo &&
        m.fechada === true &&
        m.porta?.w >= 44 &&
        m.porta?.h >= 44,
      `h1 a ${m.h1}px de ${m.ecra} (${m.pct}%; o alvo é 45% = ${alvo.toFixed(1)}px) · índice a ${m.indiceTopo}px, ${m.indiceAltura}px de banda, antes do artigo ${m.antesDoArtigo}, fora do <article> ${m.foraDoArtigo} · dobra fechada ${m.fechada} · porta ${m.porta?.w}×${m.porta?.h}px · ${m.entradas} entradas`,
    );
    if (edicao === 'pt') medidas.c1_390 = m;

    /* ------------------------------------------------- C3 · o separador, a 390 */
    const pe = await ctx.newPage();
    await pe.goto(base + O04[edicao], { waitUntil: 'networkidle' });
    await pe.evaluate(() => document.fonts.ready);
    const sep = await pe.evaluate(SONDA_SEPARADOR);
    conta(
      `C3 · o separador que a página imprime é mais largo do que o espaço fino que imprimia · 390 ${edicao} (WebKit)`,
      sep !== null &&
        sep.temInsep &&
        !sep.temFino &&
        sep.larguraInsep >= 3 &&
        sep.larguraInsep > sep.larguraFino,
      sep === null
        ? 'não há o valor de cabeça nesta página'
        : `«${sep.texto}» em ${sep.familia} a ${sep.corpo} · U+00A0 = ${sep.larguraInsep}px · U+202F = ${sep.larguraFino}px · um algarismo = ${sep.larguraAlgarismo}px`,
    );
    if (edicao === 'pt') medidas.c3_390 = sep;
    await pe.close();

    if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string' && edicao === 'pt') {
      fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
      const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
      for (const [nome, rota] of [
        ['texto', TEXTO.pt],
        ['estudo', O04.pt],
      ]) {
        const p2 = await ctx2.newPage();
        await p2.goto(base + rota, { waitUntil: 'networkidle' });
        await p2.evaluate(() => document.fonts.ready);
        await p2.screenshot({
          path: path.join(DIR_CAPTURAS, `depois-${nome}-390-cima.jpg`),
          type: 'jpeg',
          quality: 72,
        });
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
{
  const ctx = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  for (const edicao of ['pt', 'en']) {
    const p = await ctx.newPage();
    await p.goto(base + TEXTO[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const nav = document.querySelector('#texto-indice');
      const ap = document.querySelector('.aparelho');
      const corpo = document.querySelector('.texto-corpo');
      const art = document.querySelector('#documento');
      const h1 = art?.querySelector('h1');
      const cx = (el) => (el ? el.getBoundingClientRect() : null);
      const rn = cx(nav);
      const ra = cx(ap);
      const rc = cx(corpo);
      const rh = cx(h1);
      return {
        indice: rn ? { esq: +rn.left.toFixed(1), topo: +(rn.top + scrollY).toFixed(1) } : null,
        aparelho: ra ? { esq: +ra.left.toFixed(1), topo: +(ra.top + scrollY).toFixed(1) } : null,
        corpo: rc ? { esq: +rc.left.toFixed(1), topo: +(rc.top + scrollY).toFixed(1) } : null,
        h1: rh ? { esq: +rh.left.toFixed(1), topo: +(rh.top + scrollY).toFixed(1) } : null,
        /* Na coluna do aparelho: a mesma esquerda, com um píxel de folga.
           NÃO CHEGA, e o estrago plantado do C1b provou-o: sem a colocação na
           grelha, o índice e o aparelho continuavam a ter a mesma esquerda,
           só que a coluna deles passou a ser a PRIMEIRA, com o corpo na
           segunda, e o aparelho foi parar a 38 510px do topo. Uma medida
           relativa entre duas peças que se mexem juntas não mede nada. As
           três linhas seguintes dizem onde é a segunda coluna e a que
           distância o aparelho fica. */
        naColunaDoAparelho: rn && ra ? Math.abs(rn.left - ra.left) <= 1 : false,
        aDireitaDoCorpo: rn && rc ? rn.left > rc.left + 100 : false,
        acimaDoAparelho: rn && ra ? rn.top + scrollY < ra.top + scrollY : false,
        /* O aparelho vem LOGO a seguir ao índice, e não no fim da página. */
        distanciaAoAparelho: rn && ra ? +(ra.top - (rn.top + rn.height)).toFixed(1) : null,
        aparelhoLogoAbaixo:
          rn && ra ? ra.top - (rn.top + rn.height) >= 0 && ra.top - (rn.top + rn.height) <= 60 : false,
        /* No topo do corpo: o `<h1>` a menos de 16px do topo da sua coluna. */
        h1NoTopoDoCorpo: rh && rc ? rh.top - rc.top <= 16 : false,
      };
    });
    conta(
      `C1 · o índice está na coluna do aparelho e o título no topo do corpo · 1280 ${edicao} (Chromium)`,
      m.naColunaDoAparelho &&
        m.aDireitaDoCorpo &&
        m.acimaDoAparelho &&
        m.aparelhoLogoAbaixo &&
        m.h1NoTopoDoCorpo,
      `índice em x=${m.indice?.esq} y=${m.indice?.topo} · aparelho em x=${m.aparelho?.esq} y=${m.aparelho?.topo} · corpo em x=${m.corpo?.esq} y=${m.corpo?.topo} · h1 em x=${m.h1?.esq} y=${m.h1?.topo} · na coluna do aparelho ${m.naColunaDoAparelho} · à direita do corpo ${m.aDireitaDoCorpo} · acima do aparelho ${m.acimaDoAparelho} · aparelho a ${m.distanciaAoAparelho}px do fim do índice (${m.aparelhoLogoAbaixo}) · h1 no topo do corpo ${m.h1NoTopoDoCorpo}`,
    );
    if (edicao === 'pt') medidas.c1_1280 = m;
    await p.close();

    const pe = await ctx.newPage();
    await pe.goto(base + O04[edicao], { waitUntil: 'networkidle' });
    await pe.evaluate(() => document.fonts.ready);
    const sep = await pe.evaluate(SONDA_SEPARADOR);
    conta(
      `C3 · a cadeia do valor de cabeça traz U+00A0 e nenhum U+202F · 1280 ${edicao} (Chromium)`,
      sep !== null && sep.temInsep && !sep.temFino,
      sep === null
        ? 'não há o valor de cabeça nesta página'
        : `«${sep.texto}» em ${sep.familia} a ${sep.corpo} · U+00A0 = ${sep.larguraInsep}px · U+202F = ${sep.larguraFino}px · um algarismo = ${sep.larguraAlgarismo}px`,
    );
    if (edicao === 'pt') medidas.c3_1280 = sep;
    await pe.close();

    if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string' && edicao === 'pt') {
      fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
      const ctx2 = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
      for (const [nome, rota] of [
        ['texto', TEXTO.pt],
        ['estudo', O04.pt],
      ]) {
        const p2 = await ctx2.newPage();
        await p2.goto(base + rota, { waitUntil: 'networkidle' });
        await p2.evaluate(() => document.fonts.ready);
        await p2.screenshot({
          path: path.join(DIR_CAPTURAS, `depois-${nome}-1280-cima.jpg`),
          type: 'jpeg',
          quality: 72,
        });
        await p2.close();
      }
      await ctx2.close();
    }
  }
  await ctx.close();
}
await navMesa.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · passo C · itens C1 e C3 · ${reguas.length} réguas`));
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
