#!/usr/bin/env node
/**
 * =============================================================================
 * AS MEDIDAS DA PÁGINA DO DOMÍNIO · geometria, contraste e capturas
 * =============================================================================
 *
 * NÃO É UM PORTÃO: não entra no `npm run build` e não fecha nada. É a fita
 * métrica do bloco F1.2, e o que ela imprime é o que vai para o relatório.
 *
 * Serve `dist/` num servidor local e abre-o em Chromium sem cabeça, como as
 * réguas da primeira página. Mede três coisas e fotografa uma quarta:
 *
 *   B11 · O PRIMEIRO ECRÃ a 390 × 664. O brief pede que ele contenha o nome do
 *         domínio, a manchete INTEIRA, o primeiro cartão INTEIRO e o selo desse
 *         cartão. Mede-se pela caixa de cada um contra a altura da janela, e não
 *         por uma leitura da captura: uma caixa que acaba a 663 px está dentro e
 *         uma que acaba a 665 não está, e nenhum olho distingue os dois.
 *
 *   B12 · O CONTRASTE das peças novas, nos dois temas, LIDO DO QUE O NAVEGADOR
 *         PINTA (`getComputedStyle`) e não das cadeias da folha: é a diferença
 *         entre medir a página e medir uma ideia da página. Mede o texto contra
 *         o fundo em que ele assenta (limiar 4,5:1), e cada classe do mapa
 *         contra o papel e contra a classe vizinha (limiar 3:1, que é o de um
 *         objeto de interface: duas classes que não se distinguem são uma
 *         classe).
 *
 *   B12b · O TEXTO ALTERNATIVO de cada `<svg>` das formas: um `role="img"` com
 *         `aria-label` ou com `aria-labelledby` a apontar para o elemento que
 *         escreve o nome da medida, ou um `<title>`. Um desenho sem nome não se
 *         lê, e o nome que se mede aqui é o TEXTO que o leitor de ecrã ouve.
 *
 *   As CAPTURAS às sete larguras da casa, nas duas edições, no tema claro, mais
 *   o par a 390 no tema escuro. Só PNG.
 *
 * Uso:  node tests/dominio/medidas.mjs [--para=<dir>] [--json <ficheiro>]
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const PARA = (argv.find((a) => a.startsWith('--para=')) ?? '').slice(7);
const DESTINO = PARA
  ? path.resolve(RAIZ, PARA)
  : path.join(RAIZ, 'design', 'especime-v3', 'capturas', 'dominio-2026-09-03');

/** As sete larguras da casa, as mesmas de `tests/inicio/app.mjs`. */
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];

const ROTAS = [
  { nome: 'dominios-indice', pt: '/dominios', en: '/en/domains' },
  {
    nome: 'dominio-economia',
    pt: '/dominios/economia-e-financas-publicas',
    en: '/en/domains/economia-e-financas-publicas',
  },
];

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}
fs.mkdirSync(DESTINO, { recursive: true });

/* ------------------------------------------------------------- o servidor */

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let f = path.join(DIST, url);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) f = path.join(DIST, `${url.replace(/\/$/, '')}.html`);
  if (!fs.existsSync(f)) {
    res.writeHead(404);
    res.end('nao ha');
    return;
  }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});

/** O contraste WCAG entre duas cores `rgb(...)`. */
function contraste(a, b) {
  const canal = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb) => 0.2126 * canal(rgb[0]) + 0.7152 * canal(rgb[1]) + 0.0722 * canal(rgb[2]);
  const [la, lb] = [lum(a), lum(b)];
  const [alto, baixo] = la > lb ? [la, lb] : [lb, la];
  return (alto + 0.05) / (baixo + 0.05);
}
const rgb = (s) => {
  const m = /rgba?\(([^)]+)\)/.exec(String(s));
  if (!m) return null;
  const p = m[1].split(',').map((x) => Number.parseFloat(x));
  return [p[0], p[1], p[2]];
};

const medicao = { primeiroEcra: {}, contraste: {}, alternativas: {}, capturas: [] };
let falhas = 0;

await new Promise((r) => servidor.listen(0, r));
const porta = servidor.address().port;
const base = `http://127.0.0.1:${porta}`;
const browser = await chromium.launch();

try {
  /* ------------------------------------------------------------- B11 --- */
  for (const [lang, rota] of [
    ['pt', ROTAS[1].pt],
    ['en', ROTAS[1].en],
  ]) {
    const pagina = await browser.newPage({ viewport: { width: 390, height: 664 } });
    await pagina.goto(`${base}${rota}`, { waitUntil: 'load' });
    await pagina.evaluate(() => document.fonts.ready);
    const r = await pagina.evaluate(() => {
      const caixa = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { topo: b.top, fundo: b.bottom, altura: b.height };
      };
      const cartao = document.querySelector('.faixa .cartao');
      const selo = cartao?.querySelector('.src-chip');
      return {
        rotulo: caixa('.cabeca-rotulo'),
        manchete: caixa('.cabeca-h1'),
        cartao: cartao ? { topo: cartao.getBoundingClientRect().top, fundo: cartao.getBoundingClientRect().bottom } : null,
        selo: selo ? { topo: selo.getBoundingClientRect().top, fundo: selo.getBoundingClientRect().bottom } : null,
        altura: window.innerHeight,
        alturaDaPagina: document.documentElement.scrollHeight,
      };
    });
    const cabe = (c) => c !== null && c.fundo <= r.altura + 0.5;
    const tudo = cabe(r.rotulo) && cabe(r.manchete) && cabe(r.cartao) && cabe(r.selo);
    medicao.primeiroEcra[lang] = { ...r, cabeTudo: tudo };
    if (!tudo) falhas++;
    console.log(
      `${tudo ? verde('B11 ✓') : vermelho('B11 ✗')} ${lang} · 390×664 · rótulo ${r.rotulo?.fundo.toFixed(0)}px · ` +
        `manchete ${r.manchete?.fundo.toFixed(0)}px · cartão ${r.cartao?.fundo.toFixed(0)}px · ` +
        `selo ${r.selo?.fundo.toFixed(0)}px` + cinza(` · altura da página ${r.alturaDaPagina}px`),
    );
    await pagina.close();
  }

  /* ------------------------------------------------------ B12 e B12b --- */
  for (const tema of ['claro', 'escuro']) {
    const contexto = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    if (tema === 'escuro') {
      await contexto.addInitScript(() => {
        try {
          localStorage.setItem('tema', 'dark');
        } catch {
          /* um aparelho sem armazenamento é um estado normal */
        }
      });
    }
    const pagina = await contexto.newPage();
    await pagina.goto(`${base}${ROTAS[1].pt}`, { waitUntil: 'load' });
    if (tema === 'escuro') {
      await pagina.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    }
    await pagina.evaluate(() => document.fonts.ready);
    const lido = await pagina.evaluate(() => {
      const cor = (sel, prop) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el)[prop] : null;
      };
      const fundo = getComputedStyle(document.body).backgroundColor;
      const classes = [];
      for (let i = 0; i < 5; i++) {
        const el = document.querySelector(`.forma-mapa-c.cl-escala-${i}`);
        classes.push(el ? getComputedStyle(el).fill : null);
      }
      const limiar = [0, 1].map((i) => {
        const el = document.querySelector(`.forma-mapa-c.cl-limiar-${i}`);
        return el ? getComputedStyle(el).fill : null;
      });
      return {
        fundo,
        texto: {
          pergunta: cor('.dominio-pergunta', 'color'),
          nome: cor('.dominio-nome', 'color'),
          datas: cor('.dominio-datas', 'color'),
          fronteira: cor('.dominio-fronteira', 'color'),
          legenda: cor('.forma-mapa-legenda', 'color'),
          classeK: cor('.forma-mapa-classe-k', 'color'),
        },
        classes,
        limiar,
        alternativas: [...document.querySelectorAll('[data-forma] svg')].map((s) => {
          const porId = s.getAttribute('aria-labelledby');
          return {
            role: s.getAttribute('role'),
            label: s.getAttribute('aria-label'),
            /* O nome vem do elemento que já escreve o nome da medida: lê-se
               daqui o TEXTO desse elemento, que é o que um leitor de ecrã ouve,
               e não o id, que não diz nada a ninguém. */
            porId: porId ? (document.getElementById(porId)?.textContent ?? '').trim() : null,
            titulo: s.querySelector('title')?.textContent ?? null,
          };
        }),
      };
    });

    const fundo = rgb(lido.fundo);
    const t = {};
    for (const [k, v] of Object.entries(lido.texto)) {
      const c = rgb(v);
      t[k] = c && fundo ? Number(contraste(c, fundo).toFixed(2)) : null;
      if (t[k] !== null && t[k] < 4.5) falhas++;
    }
    const classes = lido.classes.map((c) => (c && fundo ? Number(contraste(rgb(c), fundo).toFixed(2)) : null));
    const vizinhas = [];
    for (let i = 0; i < lido.classes.length - 1; i++) {
      const a = rgb(lido.classes[i]);
      const b = rgb(lido.classes[i + 1]);
      const v = a && b ? Number(contraste(a, b).toFixed(2)) : null;
      vizinhas.push(v);
      if (v !== null && v < 1.2) falhas++;
    }
    const doLimiar = lido.limiar.map((c) => (c && fundo ? Number(contraste(rgb(c), fundo).toFixed(2)) : null));
    const entreLimiares =
      lido.limiar[0] && lido.limiar[1]
        ? Number(contraste(rgb(lido.limiar[0]), rgb(lido.limiar[1])).toFixed(2))
        : null;
    if (entreLimiares !== null && entreLimiares < 3) falhas++;

    medicao.contraste[tema] = { fundo: lido.fundo, texto: t, classes, vizinhas, limiar: doLimiar, entreLimiares };
    medicao.alternativas[tema] = lido.alternativas;
    for (const a of lido.alternativas) {
      const nomeado = a.role === 'img' && (a.label || a.porId);
      if (!nomeado && !a.titulo) falhas++;
    }

    console.log(
      `${verde('B12')} ${tema} · texto: ` +
        Object.entries(t)
          .map(([k, v]) => `${k} ${v}:1`)
          .join(' · '),
    );
    console.log(
      cinza(`      escala contra o papel: ${classes.join(', ')} · entre vizinhas: ${vizinhas.join(', ')}`),
    );
    console.log(
      cinza(`      limiar contra o papel: ${doLimiar.join(', ')} · entre as duas: ${entreLimiares}`),
    );
    console.log(
      cinza(
        `      alternativas: ${lido.alternativas.map((a) => `${a.role ?? '?'}/${a.label ?? a.porId ?? a.titulo ?? '?'}`).join(' | ')}`,
      ),
    );
    await contexto.close();
  }

  /* --------------------------------------------------------- as capturas */
  for (const rota of ROTAS) {
    for (const lang of ['pt', 'en']) {
      for (const largura of LARGURAS) {
        const pagina = await browser.newPage({ viewport: { width: largura, height: 900 } });
        await pagina.goto(`${base}${rota[lang]}`, { waitUntil: 'load' });
        await pagina.evaluate(() => document.fonts.ready);
        const ficheiro = path.join(DESTINO, `${rota.nome}-${largura}-${lang}-claro.png`);
        await pagina.screenshot({ path: ficheiro, fullPage: true });
        medicao.capturas.push(path.relative(RAIZ, ficheiro));
        await pagina.close();
      }
    }
    /* O tema escuro a 390, nas duas edições: é onde a escala do mapa muda. */
    for (const lang of ['pt', 'en']) {
      const contexto = await browser.newContext({ viewport: { width: 390, height: 900 } });
      const pagina = await contexto.newPage();
      await pagina.goto(`${base}${rota[lang]}`, { waitUntil: 'load' });
      await pagina.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await pagina.evaluate(() => document.fonts.ready);
      const ficheiro = path.join(DESTINO, `${rota.nome}-390-${lang}-escuro.png`);
      await pagina.screenshot({ path: ficheiro, fullPage: true });
      medicao.capturas.push(path.relative(RAIZ, ficheiro));
      await contexto.close();
    }
  }
  console.log(cinza(`  ${medicao.capturas.length} capturas em ${path.relative(RAIZ, DESTINO)}`));
} finally {
  await browser.close();
  servidor.close();
}

const json = argv.indexOf('--json');
if (json !== -1 && argv[json + 1]) {
  fs.writeFileSync(argv[json + 1], JSON.stringify(medicao, null, 2));
}

if (falhas > 0) {
  console.error(vermelho(`\n  ${falhas} medida(s) fora do que o brief pede.\n`));
  process.exit(1);
}
console.log(verde('\n  as medidas do domínio passam\n'));
