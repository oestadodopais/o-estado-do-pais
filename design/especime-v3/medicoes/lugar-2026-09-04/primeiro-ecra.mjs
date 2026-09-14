#!/usr/bin/env node
/**
 * O PRIMEIRO ECRÃ A 390 × 664, MEDIDO · a régua do item 8.11 do F1.10.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, E PORQUE É QUE A DEFINIÇÃO ESTÁ AQUI ESCRITA
 * ---------------------------------------------------------------------------
 * O item 8.11 do brief vem do tropeço R5 da ronda de leitores: «a lot of
 * explanations, a lot of text everywhere, that distracts from what really
 * matters … keep reading and reading just to find out what they want». A
 * decisão do lugar de direção é que a prosa de contexto, as definições e as
 * ressalvas saem do PRIMEIRO ECRÃ das páginas do leitor e ficam a um toque, e a
 * medida é «os caracteres de prosa no primeiro ecrã a 390 × 664, medidos antes e
 * depois».
 *
 * «Caracteres de prosa» não é uma coisa que um navegador saiba, e por isso a
 * definição escreve-se aqui, mecânica, para que o «antes» e o «depois» sejam a
 * mesma conta:
 *
 *   · **o primeiro ecrã** é a janela de 390 × 664 px sem rolar, e um bloco conta
 *     quando a sua caixa COMEÇA acima dos 664 px. Um parágrafo que começa no
 *     ecrã e continua abaixo conta inteiro: o que o leitor vê é o princípio
 *     dele, e é o princípio que o faz começar a ler;
 *   · **um bloco de prosa** é um `p`, `li`, `dd`, `dt`, `blockquote` ou
 *     `figcaption` — a mesma lista que o portão da voz usa para achar as frases
 *     da casa, menos os títulos e as legendas de tabela, que são rótulos;
 *   · **não conta** o que está dentro de `nav`, de `header` ou de `footer`
 *     quando a medição é da PROSA (é mobília, e tem a sua própria conta ao
 *     lado), nem o que está escondido (`hidden`, `display:none`, dentro de um
 *     `<details>` fechado), porque o leitor não o lê;
 *   · **conta em separado** o texto todo do primeiro ecrã, seja ele prosa ou
 *     não, para que uma prosa que desça e uma mobília que suba não se anulem uma
 *     à outra na mesma linha do relatório.
 *
 * Nada aqui é um teto: é uma medição. O teto, se houver, escreve-se no
 * relatório do bloco, com a data e o número que esta régua imprimiu.
 *
 * ---------------------------------------------------------------------------
 * COMO SE CORRE
 * ---------------------------------------------------------------------------
 *     node design/especime-v3/medicoes/lugar-2026-09-04/primeiro-ecra.mjs
 *     node …/primeiro-ecra.mjs --json antes.json
 *     OEDP_DIST=/outro/dist node …/primeiro-ecra.mjs
 *
 * Abre um navegador, e por isso NÃO está no `verify` nem na CI: corre-se à mão,
 * como as outras medições de 390 px deste bloco.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/* AS QUATRO PÁGINAS QUE O ITEM NOMEIA, nas duas edições. «uma de estudo» é a
   página de conjunto de um estudo, que é a que o leitor abre do arquivo. */
const PAGINAS = [
  { nome: 'inicio', pt: '/', en: '/en/' },
  { nome: 'concelho', pt: '/municipios/evora', en: '/en/municipalities/evora' },
  { nome: 'estudo', pt: '/estudos/onde-esta-a-agua', en: '/en/studies/onde-esta-a-agua' },
  { nome: 'numeros', pt: '/livro-razao', en: '/en/ledger' },
  /* E AS DUAS QUE O §9.2 E O §9.6 NOMEIAM (quinta sessão, 08.09.2026). A quarta
     sessão mediu-as à parte, com esta mesma conta escrita duas vezes; medidas
     aqui, o «antes» e o «depois» delas são a mesma conta das outras quatro, e a
     medição do §9.2 refaz-se com um comando só. */
  {
    nome: 'dominio',
    pt: '/dominios/economia-e-financas-publicas',
    en: '/en/domains/economia-e-financas-publicas',
  },
  { nome: 'regiao', pt: '/regioes/alentejo', en: '/en/regions/alentejo' },
];

const LARGURA = 390;
const ALTURA = 664;

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const argv = process.argv.slice(2);
const iJson = argv.indexOf('--json');
const FICHEIRO_JSON = iJson >= 0 ? argv[iJson + 1] : null;

if (!fs.existsSync(DIST)) {
  console.error(`não existe ${DIST}. Corra o build primeiro.`);
  process.exit(2);
}

const servidor = http.createServer((req, res) => {
  const semQuery = (req.url ?? '/').split('?')[0];
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
  res.end(fs.readFileSync(ficheiro));
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', () => r(undefined)));
const { port } = /** @type {import('node:net').AddressInfo} */ (servidor.address());
const base = `http://127.0.0.1:${port}`;

const navegador = await chromium.launch();
const medidas = {};

/** A conta, dentro da página. A definição está no cabeçalho deste ficheiro. */
const conta = (altura) => {
  const BLOCOS = 'p,li,dd,dt,blockquote,figcaption';
  const visivel = (el) => {
    const e = window.getComputedStyle(el);
    if (e.display === 'none' || e.visibility === 'hidden' || Number(e.opacity) === 0) return false;
    if (el.closest('[hidden]')) return false;
    const fechado = el.closest('details:not([open])');
    if (fechado && fechado.querySelector('summary') !== el) return false;
    return true;
  };
  const noEcra = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    return r.top + window.scrollY < altura;
  };
  const texto = (el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim();

  /* A prosa: os blocos da lista, fora da mobília, visíveis e a começar no ecrã.
     Um bloco que esteja dentro de outro bloco da lista conta uma vez só, no de
     dentro, para que um `li` com um `p` não conte duas vezes o mesmo texto. */
  const todos = [...document.querySelectorAll(BLOCOS)];
  const prosa = todos.filter(
    (el) =>
      !el.closest('nav,header,footer') &&
      visivel(el) &&
      noEcra(el) &&
      !todos.some((o) => o !== el && el.contains(o)),
  );
  const caracteresDeProsa = prosa.reduce((a, el) => a + texto(el).length, 0);

  /* A PROSA DA CASA, que é a que o item 8.11 manda sair do primeiro ecrã. A
     conta de cima apanha também os nomes e as unidades dos cartões, que são
     blocos `p` e são o INSTRUMENTO e não uma explicação; esses levam uma marca
     de origem declarada, a mesma que o portão da voz e a régua do bloco já
     usam, e saem daqui por ela. O que fica é o texto que a casa escreveu para
     explicar. */
  const ORIGEM_DECLARADA =
    '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],' +
    '[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta],' +
    '[data-lugar],[data-nome],[data-medida-nome],[data-medida-unidade],[data-prova]';
  const daCasa = prosa.filter(
    (el) => !el.closest(ORIGEM_DECLARADA) && !el.querySelector(ORIGEM_DECLARADA),
  );
  const caracteresDaCasa = daCasa.reduce((a, el) => a + texto(el).length, 0);

  /* O texto todo do primeiro ecrã, mobília incluída: um andar por nós de texto,
     com o intervalo de cada um medido pelo próprio navegador. */
  const andador = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let caracteres = 0;
  let n;
  while ((n = andador.nextNode())) {
    const t = (n.nodeValue ?? '').replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const pai = n.parentElement;
    if (!pai || !visivel(pai)) continue;
    const alcance = document.createRange();
    alcance.selectNodeContents(n);
    const r = alcance.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.top + window.scrollY >= altura) continue;
    caracteres += t.length;
  }
  return {
    caracteresDaCasa,
    blocosDaCasa: daCasa.length,
    caracteresDeProsa,
    blocosDeProsa: prosa.length,
    caracteres,
    prosaVisivel: daCasa.map((el) => texto(el).slice(0, 90)),
  };
};

for (const pagina of PAGINAS) {
  for (const lang of ['pt', 'en']) {
    const rota = pagina[lang];
    const ctx = await navegador.newContext({ viewport: { width: LARGURA, height: ALTURA } });
    const p = await ctx.newPage();
    const resposta = await p.goto(base + rota, { waitUntil: 'networkidle' });
    if (!resposta || resposta.status() !== 200) {
      console.error(`${rota}: HTTP ${resposta ? resposta.status() : 'sem resposta'}`);
      await ctx.close();
      continue;
    }
    medidas[`${pagina.nome}.${lang}`] = { rota, ...(await p.evaluate(conta, ALTURA)) };
    await ctx.close();
  }
}

await navegador.close();
servidor.close();

console.log(cinza(`  o primeiro ecrã a ${LARGURA} × ${ALTURA} · dist: ${DIST}`));
console.log('');
console.log(
  '  | página | prosa da casa | blocos da casa | prosa (com os cartões) | caracteres no ecrã |',
);
console.log('  |---|---|---|---|---|');
for (const [chave, m] of Object.entries(medidas)) {
  console.log(
    `  | ${chave} (${m.rota}) | ${m.caracteresDaCasa} | ${m.blocosDaCasa} | ` +
      `${m.caracteresDeProsa} | ${m.caracteres} |`,
  );
}
console.log('');
for (const [chave, m] of Object.entries(medidas)) {
  if (!m.prosaVisivel.length) continue;
  console.log(cinza(`  ${chave}, a prosa da casa que começa no primeiro ecrã:`));
  for (const t of m.prosaVisivel) console.log(cinza(`      · ${t}`));
}

if (FICHEIRO_JSON) {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify(medidas, null, 2) + '\n');
  console.log(cinza(`  escrito em ${FICHEIRO_JSON}`));
}
