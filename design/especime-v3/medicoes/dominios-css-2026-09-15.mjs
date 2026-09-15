#!/usr/bin/env node
/**
 * A RÉGUA DA FATIA DE 15.09.2026 · o índice dos domínios e a linha da busca.
 *
 * ---------------------------------------------------------------------------
 * O QUE MEDE, E PORQUÊ CADA COISA
 * ---------------------------------------------------------------------------
 * O diretor leu duas coisas na primeira página, no telemóvel, na cabeça
 * 44f0d838: «2. Trabalhoas medidas estão em Economia e finanças públicas», e um
 * campo de busca do tamanho de quatro caracteres ao lado de um botão grande.
 *
 *   · O ÍNDICE DOS DOMÍNIOS, em `/`, `/en/`, `/dominios` e `/en/domains`: o
 *     `display` e o `gap` do item, o marcador do `<ol>`, o corpo e o tipo do
 *     estado, e a FOLGA entre a caixa do nome e a caixa do estado, que é o
 *     número que diz se as duas palavras se tocam. Mais a altura da página e o
 *     topo da secção, para provar que o primeiro ecrã a 390 não muda.
 *   · A LINHA DA BUSCA, em `/` e em `/municipios`: a largura do campo, a da
 *     linha e a do botão, e o `scrollWidth` do documento contra a largura da
 *     janela, que é o transbordo horizontal.
 *
 * As larguras da busca são 320, 390, 768 e 1 280: 320 porque é onde o campo
 * empurrava a página em 09.09 e é a razão de o `size` ter descido a 4.
 *
 * ---------------------------------------------------------------------------
 * COMO SE CORRE
 * ---------------------------------------------------------------------------
 *     OEDP_DIST=/caminho/dist node design/especime-v3/medicoes/dominios-css-2026-09-15.mjs \
 *       --json saida.json --capturas <directório> --momento antes|depois
 *
 * Abre um navegador, e por isso NÃO está no `verify` nem na CI: corre-se à mão,
 * como as outras medições de 390 px destes blocos.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.resolve(process.env.OEDP_DIST ?? 'dist');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.csv': 'text/csv; charset=utf-8',
};

const arg = (nome) => {
  const i = process.argv.indexOf(nome);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
};
const CAPTURAS = arg('--capturas');
const MOMENTO = arg('--momento') ?? 'agora';

const servidor = http.createServer((req, res) => {
  const so = req.url.split('?')[0];
  let rel;
  try {
    rel = decodeURIComponent(so);
  } catch {
    rel = so;
  }
  let f = path.resolve(DIST, '.' + rel);
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ headless: true });
const saida = { dominios: {}, busca: {} };

/* ===================================================== o índice dos domínios */

const ROTAS_DOM = ['/', '/en/', '/dominios/', '/en/domains/'];
for (const rota of ROTAS_DOM) {
  saida.dominios[rota] = {};
  for (const largura of [390, 1280]) {
    const p = await navegador.newPage({ viewport: { width: largura, height: 664 } });
    await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    saida.dominios[rota][largura] = await p.evaluate(() => {
      const css = (el, ...props) => {
        if (!el) return null;
        const c = getComputedStyle(el);
        const o = {};
        for (const pr of props) o[pr] = c[pr];
        return o;
      };
      const lista = document.querySelector('ol.dominios-lista');
      const item = document.querySelector('li.dominios-item');
      const nome = item ? item.querySelector('.dominios-nome') : null;
      const estado = item ? item.querySelector('.dominios-estado') : null;
      const seccao = document.querySelector('.dominios-secao');
      let folga = null;
      if (nome && estado) {
        const a = nome.getBoundingClientRect();
        const b = estado.getBoundingClientRect();
        folga = Math.round((b.left - a.right) * 10) / 10;
      }
      return {
        folhas: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) =>
          l.getAttribute('href'),
        ),
        altura_pagina: document.documentElement.scrollHeight,
        seccao_topo: seccao
          ? Math.round((seccao.getBoundingClientRect().top + window.scrollY) * 10) / 10
          : null,
        lista: css(lista, 'listStyleType'),
        item: css(item, 'display', 'columnGap', 'rowGap', 'minHeight'),
        nome: css(nome, 'fontFamily', 'fontSize'),
        estado: css(estado, 'fontFamily', 'fontSize', 'color'),
        item_texto: item ? item.textContent.replace(/\s+/g, ' ').trim() : null,
        item_texto_cru: item ? item.textContent : null,
        ultimo_item_texto: (() => {
          const todos = document.querySelectorAll('li.dominios-item');
          const u = todos[todos.length - 1];
          return u ? u.textContent.replace(/\s+/g, ' ').trim() : null;
        })(),
        n_itens: document.querySelectorAll('li.dominios-item').length,
        folga_nome_estado: folga,
      };
    });
    if (CAPTURAS && rota === '/') {
      fs.mkdirSync(CAPTURAS, { recursive: true });
      const el = await p.$('.dominios-secao');
      if (el) await el.screenshot({ path: path.join(CAPTURAS, `dominios-${largura}-${MOMENTO}.png`) });
    }
    await p.close();
  }
}

/* ============================================================= a busca */

/* AS QUATRO ROTAS QUE RENDEM A CAIXA, e não só as duas que o diretor leu: a
   caixa é uma só (F1.10, §2.6), e uma correção na folha dela chega às quatro.
   `/livro-razao/concelhos` é a que rende a variante sem formulário. */
const ROTAS_BUSCA = ['/', '/municipios/', '/livro-razao/', '/livro-razao/concelhos/'];
for (const rota of ROTAS_BUSCA) {
  saida.busca[rota] = {};
  for (const largura of [320, 390, 768, 1280]) {
    const p = await navegador.newPage({ viewport: { width: largura, height: 664 } });
    await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    saida.busca[rota][largura] = await p.evaluate(() => {
      const larg = (el) => (el ? Math.round(el.getBoundingClientRect().width * 10) / 10 : null);
      const linha = document.querySelector('.busca-linha');
      const campo = document.querySelector('.busca-campo');
      const botao = document.querySelector('.busca-submeter');
      return {
        linha: larg(linha),
        campo: larg(campo),
        botao: larg(botao),
        campo_size: campo ? campo.getAttribute('size') : null,
        campo_width_css: campo ? getComputedStyle(campo).width : null,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    if (CAPTURAS && [390, 1280].includes(largura)) {
      fs.mkdirSync(CAPTURAS, { recursive: true });
      const el = await p.$('.busca');
      const nome = 'busca' + (rota === '/' ? '-inicio' : rota.replace(/\/$/, '').replace(/\//g, '-'));
      if (el) await el.screenshot({ path: path.join(CAPTURAS, `${nome}-${largura}-${MOMENTO}.png`) });
    }
    await p.close();
  }
}

await navegador.close();
servidor.close();

const saidaJson = arg('--json');
if (saidaJson) {
  fs.writeFileSync(saidaJson, JSON.stringify(saida, null, 2));
  console.log(`escrito: ${saidaJson}`);
}

console.log('\n== o índice dos domínios ==');
for (const rota of ROTAS_DOM) {
  for (const largura of [390, 1280]) {
    const m = saida.dominios[rota][largura];
    console.log(
      `${rota} @${largura}  itens=${m.n_itens}  altura=${m.altura_pagina}  ` +
        `topo=${m.seccao_topo}  gap=${m.item?.columnGap}/${m.item?.rowGap}  ` +
        `display=${m.item?.display}  marcador=${m.lista?.listStyleType}  ` +
        `estado=${m.estado?.fontSize} ${String(m.estado?.fontFamily).split(',')[0]}  ` +
        `folga=${m.folga_nome_estado}`,
    );
    if (largura === 390) {
      console.log(`         1.ª: «${String(m.item_texto).slice(0, 64)}»`);
      console.log(`         2.ª: «${String(m.ultimo_item_texto).slice(0, 64)}»`);
    }
  }
}
console.log('\n== a linha da busca ==');
for (const rota of ROTAS_BUSCA) {
  for (const largura of [320, 390, 768, 1280]) {
    const m = saida.busca[rota][largura];
    console.log(
      `${rota} @${largura}  linha=${m.linha}  campo=${m.campo}  botao=${m.botao}  ` +
        `size=${m.campo_size}  width(css)=${m.campo_width_css}  transbordo=${m.transbordo}`,
    );
  }
}
console.log('\nfolhas ligadas:');
for (const rota of ROTAS_DOM) console.log(`  ${rota} -> ${saida.dominios[rota][390].folhas.join(' ')}`);
console.log('');
