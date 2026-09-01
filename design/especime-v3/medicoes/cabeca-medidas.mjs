#!/usr/bin/env node
/**
 * AS MEDIDAS DO BLOCO DA CABEÇA (01.09.2026) · o «antes» e o «depois».
 *
 * Não é uma régua: não tem células nem estragos, e não sai com 1. Mede, escreve
 * um JSON e imprime uma tabela. A régua deste bloco é `tests/inicio/faixa.mjs`.
 *
 *   node design/especime-v3/medicoes/cabeca-medidas.mjs --json <ficheiro>
 *
 * O que mede, e porquê cada coisa se mede assim:
 *
 *   · A ALTURA DA PÁGINA, às sete larguras da casa e nas duas edições. É
 *     `document.documentElement.scrollHeight` depois de `document.fonts.ready`,
 *     que é a mesma leitura de `medicoes/inicio-lista-construtor.md` §1.1, para
 *     que os dois números se possam comparar.
 *   · A DISTÂNCIA DA MANCHETE AO PRIMEIRO NÚMERO SELADO, a 390. O primeiro
 *     número selado é o primeiro `[data-claim]` do documento que tenha um
 *     `.src-chip` no seu invólucro; a distância é do FUNDO da manchete ao TOPO
 *     desse número, em píxeis de documento, e também em ecrãs de 844 px, que é
 *     a altura do telemóvel de referência.
 *   · O PRIMEIRO ECRÃ a 390 × 844: que blocos da cabeça têm alguma parte dentro
 *     dos primeiros 844 px, e quais estão lá INTEIROS.
 *   · OS ALVOS: a caixa de cada elemento tocável (`a[href]`, `button`,
 *     `summary`, `input`) que esteja à vista, e os que ficam abaixo do mínimo
 *     da largura (44 px abaixo de 1024, 32 px a partir de 1024).
 *   · O CORPO DOS NÚMEROS: o `font-size` computado do primeiro valor selado da
 *     faixa (ou do painel, antes de a faixa existir) a 390 e a 1280.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
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
};

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO = opcao('--json');
/* `--capturas <dir>` fotografa as três rotas às sete larguras da casa e nas duas
   edições, no tema claro, que é o defeito da Emenda 12. É o que a ordem de
   construção pede para o relatório, e fica ao lado das medidas para que a
   fotografia e o número venham da mesma corrida sobre o mesmo `dist/`. */
const CAPTURAS = opcao('--capturas');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let f;
  try {
    f = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    f = path.resolve(DIST, '.' + semQuery);
  }
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const ROTAS = {
  pt: { home: '/', regiao: '/regioes/alentejo', concelho: '/municipios/evora' },
  en: { home: '/en', regiao: '/en/regions/alentejo', concelho: '/en/municipalities/evora' },
};

const nav = await chromium.launch({ headless: true });
const abre = async (rota, largura, altura = 900) => {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
};

const out = { alturas: {}, distancia: {}, primeiroEcra: {}, alvos: {}, corpos: {}, faixa: {} };

/* ------------------------------------------------------------- as alturas */
for (const [ed, rotas] of Object.entries(ROTAS)) {
  for (const [qual, rota] of Object.entries(rotas)) {
    for (const w of LARGURAS) {
      const p = await abre(rota, w);
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      out.alturas[`${qual}·${ed}·${w}`] = h;
      await p.__ctx.close();
    }
  }
}

/* ------------------------- a distância da manchete ao primeiro número selado */
for (const [ed, rotas] of Object.entries(ROTAS)) {
  for (const w of [390, 1280]) {
    const p = await abre(rotas.home, w, 844);
    out.distancia[`${ed}·${w}`] = await p.evaluate(() => {
      /* A MANCHETE DA PÁGINA, E NÃO O NOME DO SÍTIO. `document.querySelector('h1')`
         devolvia o `<h1 class="wordmark">` do cabeçalho, que é a marca: a
         distância saía medida do nome do sítio e não da afirmação com números.
         A manchete é a da vista, e vive dentro de `<main>`. */
      const h1 = document.querySelector('main h1') ?? document.querySelector('h1');
      if (!h1) return null;
      const a = h1.getBoundingClientRect();
      const y = window.scrollY;
      /* Um número SELADO é um `[data-claim]` que tem, no seu invólucro, o selo
         que abre a linha dele. É a mesma relação que `auditaSelo()` confere no
         portão: o selo está no PAI do elemento do valor. */
      const selados = [...document.querySelectorAll('[data-claim]')].filter((el) => {
        const pai = el.parentElement;
        return !!(pai && pai.querySelector('.src-chip'));
      });
      const conta = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          id: el.getAttribute('data-claim'),
          topo: Math.round((b.top + y) * 10) / 10,
          px: Math.round((b.top - a.bottom) * 10) / 10,
          ecras: Math.round(((b.top - a.bottom) / 844) * 100) / 100,
        };
      };
      /* DOIS NÚMEROS, E NÃO UM. O primeiro selado do documento é hoje a contagem
         dos 308 da legenda do mapa, que é uma medida da Carta e não uma medida
         de Portugal; o que a promessa do brief mede é a primeira MEDIDA. Os dois
         ficam escritos, para que o de que se fala seja o que se mediu. */
      const medida = selados.find((el) => el.closest('#painel, #painel-social, [data-faixa]'));
      return {
        manchete: { topo: Math.round((a.top + y) * 10) / 10, fundo: Math.round((a.bottom + y) * 10) / 10 },
        qualquer: conta(selados[0]),
        medida: conta(medida),
      };
    });
    await p.__ctx.close();
  }
}

/* --------------------------------------------------- o primeiro ecrã a 390 */
for (const ed of ['pt', 'en']) {
  const p = await abre(ROTAS[ed].home, 390, 844);
  out.primeiroEcra[ed] = await p.evaluate(() => {
    const alvos = {
      nome: 'header .wordmark',
      manchete: 'main h1',
      faixa: '[data-faixa]',
      primeiroCartao: '[data-faixa] > li:first-child, [data-faixa] [data-cartao]:first-child',
      mapa: '.mapa-svg',
      painel: '#painel',
      comando: '[data-comando]',
      pesquisa: '.pesquisa',
      nomes: '[data-mapa-ilhas]',
    };
    const r = {};
    for (const [k, sel] of Object.entries(alvos)) {
      const el = document.querySelector(sel);
      if (!el) {
        r[k] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      r[k] = {
        topo: Math.round(b.top * 10) / 10,
        fundo: Math.round(b.bottom * 10) / 10,
        comecaNoEcra: b.top < 844,
        inteiroNoEcra: b.top >= 0 && b.bottom <= 844 && b.height > 0,
      };
    }
    return r;
  });
  await p.__ctx.close();
}

/* -------------------------------------------------------------- os alvos */
for (const ed of ['pt', 'en']) {
  for (const w of LARGURAS) {
    const p = await abre(ROTAS[ed].home, w);
    /* A ÁREA EFETIVA É A DE `tests/inicio/correcoes-a.mjs` (item A10), copiada
       para aqui sem uma vírgula de diferença: a caixa do elemento unida com a do
       seu `::after` posicionado, que é a técnica que o selo usa para alargar o
       que se toca sem alargar o que se compõe. Medir só a caixa conta 52 × 14 px
       onde o dedo encontra 52 × 44, e foi isso que a auditoria de 25.08 apanhou.
       As áreas do mapa ficam de fora do juízo pela razão da I82: o alvo de uma
       forma côncava é o quadrado inscrito, e quem o mede é `mapa-distritos.mjs`. */
    out.alvos[`${ed}·${w}`] = await p.evaluate((largura) => {
      const min = largura >= 1024 ? 32 : 44;
      const areaEfetiva = (el) => {
        const r = el.getBoundingClientRect();
        let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
        const cs = getComputedStyle(el, '::after');
        if (cs && cs.content !== 'none' && cs.position === 'absolute') {
          const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
          const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
          if (W > 0 && H > 0) {
            const cx = (r.left + r.right) / 2;
            const cy = (r.top + r.bottom) / 2;
            x1 = Math.min(x1, cx - W / 2); x2 = Math.max(x2, cx + W / 2);
            y1 = Math.min(y1, cy - H / 2); y2 = Math.max(y2, cy + H / 2);
          }
        }
        return { w: x2 - x1, h: y2 - y1 };
      };
      const els = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"]')];
      const maus = [];
      let vistos = 0;
      let naMobilia = 0;
      const seVe = (el) =>
        typeof el.checkVisibility === 'function'
          ? el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
          : true;
      for (const el of els) {
        if (el.closest('[hidden]') || el.closest('.vh') || el.closest('[data-areas]')) continue;
        /* Uma gaveta fechada é o navegador a esconder: ver a nota de
           `tests/inicio/correcoes-a.mjs`. */
        if (!seVe(el)) continue;
        const b = el.getBoundingClientRect();
        if (!(b.width > 0) || !(b.height > 0)) continue;
        vistos++;
        const a = areaEfetiva(el);
        if (a.w + 0.5 < min || a.h + 0.5 < min) {
          const mobilia = !!el.closest('header, footer');
          if (mobilia) naMobilia++;
          maus.push({
            tag: el.tagName.toLowerCase(),
            classe: String(el.className?.baseVal ?? el.className ?? '').trim().split(/\s+/).slice(0, 2).join('.'),
            texto: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 26),
            mobilia,
            w: Math.round(a.w * 10) / 10,
            h: Math.round(a.h * 10) / 10,
          });
        }
      }
      const noCorpo = maus.filter((m) => !m.mobilia);
      return { min, vistos, maus: maus.length, naMobilia, noCorpo: noCorpo.length, exemplos: noCorpo.slice(0, 12) };
    }, w);
    await p.__ctx.close();
  }
}

/* -------------------------------------------------- o corpo dos números */
for (const w of [390, 1280]) {
  const p = await abre(ROTAS.pt.home, w);
  out.corpos[w] = await p.evaluate(() => {
    const leia = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100 : null;
    };
    return {
      faixa: leia('[data-faixa] .claim-value'),
      peca: leia('.peca-valor .claim-value, .peca-valor'),
      social: leia('.social-valor .claim-value'),
      manchete: leia('main h1'),
    };
  });
  await p.__ctx.close();
}

/* ------------------------------------------- a faixa: o que ela tem dentro */
{
  const p = await abre(ROTAS.pt.home, 390);
  out.faixa.pt = await p.evaluate(() => {
    const f = document.querySelector('[data-faixa]');
    if (!f) return null;
    const cartoes = [...f.querySelectorAll('[data-cartao]')];
    return {
      etiqueta: f.tagName.toLowerCase(),
      cartoes: cartoes.length,
      comSelo: cartoes.filter((c) => c.querySelector('.src-chip')).length,
      comClaim: cartoes.filter((c) => c.querySelector('[data-claim]')).length,
    };
  });
  await p.__ctx.close();
}

/* ------------------------------------------------------------- as capturas */
if (CAPTURAS && typeof CAPTURAS === 'string') {
  const destino = path.resolve(RAIZ, CAPTURAS);
  fs.mkdirSync(destino, { recursive: true });
  let feitas = 0;
  for (const [ed, rotas] of Object.entries(ROTAS)) {
    for (const [qual, rota] of Object.entries(rotas)) {
      for (const w of LARGURAS) {
        const ctx = await nav.newContext({ viewport: { width: w, height: 844 } });
        /* Claro por escolha guardada, que é o único caminho para o tema desde a
           Emenda 12: pôr `data-theme` à mão fotografaria a folha e não o
           mecanismo. */
        await ctx.addInitScript(() => {
          try {
            localStorage.setItem('tema', 'light');
          } catch (e) {
            /* sem armazenamento a página sai clara à mesma */
          }
        });
        const p = await ctx.newPage();
        await p.goto(base + rota, { waitUntil: 'networkidle' });
        await p.evaluate(() => document.fonts.ready);
        await p.screenshot({ path: path.join(destino, `${qual}-${w}-${ed}-claro.png`), fullPage: true });
        feitas++;
        await ctx.close();
      }
    }
  }
  out.capturas = { pasta: path.relative(RAIZ, destino), ficheiros: feitas };
}

await nav.close();
servidor.close();

if (FICHEIRO && typeof FICHEIRO === 'string') {
  fs.writeFileSync(path.resolve(RAIZ, FICHEIRO), JSON.stringify(out, null, 2) + '\n');
}

console.log('\n  ALTURAS (px)');
for (const qual of ['home', 'regiao', 'concelho']) {
  console.log(`   ${qual}`);
  for (const w of LARGURAS) {
    console.log(`     ${String(w).padStart(4)}   pt ${String(out.alturas[`${qual}·pt·${w}`]).padStart(6)}   en ${String(out.alturas[`${qual}·en·${w}`]).padStart(6)}`);
  }
}
console.log('\n  DA MANCHETE AO PRIMEIRO NÚMERO SELADO (ecrã de 844 px)');
for (const k of Object.keys(out.distancia)) {
  const d = out.distancia[k];
  if (!d) { console.log(`   ${k.padEnd(9)} não medido`); continue; }
  const l = (x) => (x ? `${String(x.px).padStart(8)} px · ${String(x.ecras).padStart(5)} ecrãs · ${x.id}` : 'nenhum');
  console.log(`   ${k.padEnd(9)} qualquer ${l(d.qualquer)}`);
  console.log(`   ${''.padEnd(9)} medida   ${l(d.medida)}`);
}
console.log('\n  O PRIMEIRO ECRÃ A 390 × 844 (pt)');
for (const [k, v] of Object.entries(out.primeiroEcra.pt)) {
  console.log(`   ${k.padEnd(16)} ${v ? `${String(v.topo).padStart(8)} → ${String(v.fundo).padStart(8)}  ${v.inteiroNoEcra ? 'inteiro' : v.comecaNoEcra ? 'começa' : 'fora'}` : 'não existe'}`);
}
console.log('\n  ALVOS ABAIXO DO MÍNIMO (área efetiva; fora do desenho do mapa)');
for (const w of LARGURAS) {
  const a = out.alvos[`pt·${w}`];
  const b = out.alvos[`en·${w}`];
  console.log(
    `   ${String(w).padStart(4)} (mín ${a.min})  pt ${a.noCorpo} no corpo + ${a.naMobilia} na mobília de ${a.vistos}   en ${b.noCorpo} + ${b.naMobilia} de ${b.vistos}`,
  );
}
console.log('\n  OS ALVOS PEQUENOS DO CORPO, a 390 (pt)');
for (const m of out.alvos['pt·390'].exemplos) {
  console.log(`   ${String(m.w).padStart(6)} × ${String(m.h).padStart(5)}  ${m.tag}.${m.classe}  «${m.texto}»`);
}
console.log('\n  CORPO DOS NÚMEROS');
for (const w of [390, 1280]) console.log(`   ${w}  ${JSON.stringify(out.corpos[w])}`);
console.log('\n  A FAIXA');
console.log(`   ${JSON.stringify(out.faixa.pt)}\n`);
