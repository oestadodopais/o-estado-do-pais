#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO PASSO C DAS CORREÇÕES DE UX (25.08.2026) · itens C2 e C4
 * =============================================================================
 *
 * Uma régua por prova de `design/especime-v3/briefs/BRIEF-correcoes-ux-C.md` §1.
 * NÃO é um portão: não entra no `npm run build`. Corre sobre `dist/`, imprime
 * uma linha por régua e SAI COM 0 quando todas passam e com 1 quando alguma
 * falha, como as réguas dos blocos A e B, e pela mesma razão.
 *
 *   node tests/municipio/correcoes-c.mjs
 *   node tests/municipio/correcoes-c.mjs --json <ficheiro>
 *   node tests/municipio/correcoes-c.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * PORQUE ESTÃO OS DOIS NA MESMA PASTA, E É UMA ESCOLHA E NÃO UM DESCUIDO
 * ---------------------------------------------------------------------------
 * O C4 é do índice dos concelhos, que é a rota desta pasta. O C2 é dos índices
 * do Método e da agenda, e vive aqui por ser a MESMA MEDIÇÃO: quantas entradas
 * de um índice cabem no primeiro ecrã de um telemóvel, e a que custo em alvos.
 * Uma pasta nova vale menos do que uma linha escrita a dizer isto. As
 * pastas de `tests/` são por rota, e esta é a exceção, com o seu nome.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA ITEM MEDE
 * ---------------------------------------------------------------------------
 * C2 · O ÍNDICE DO MÉTODO E O DA AGENDA VOLTAM A CABER. A 390, as entradas
 *      dentro do primeiro ecrã são pelo menos as que cabiam ANTES do bloco B:
 *      dez no Método e cinco na agenda, medidas na construção de `main`. E sem
 *      um único alvo abaixo de 44px e sem um único par de áreas sobrepostas. A
 *      régua conta as três coisas ao mesmo tempo de propósito: qualquer uma
 *      delas sozinha compra-se à custa das outras duas.
 *
 * C4 · A PESQUISA NO TOPO DO ÍNDICE DOS 308. A 390, o campo está dentro do
 *      primeiro ecrã; escrever um nome acende o concelho certo; o que tem
 *      página abre-a e o que não tem não é porta nenhuma; e a secção «Com
 *      página» vem antes da lista por distritos.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webkit, devices } from 'playwright';
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

/**
 * AS CONTAGENS DE ANTES DO BLOCO B, medidas na construção de `main` (`cb133d5`)
 * com este mesmo aparelho, e escritas aqui porque é contra elas que o item C2 se
 * julga: «volta a caber dez entradas onde cabiam dez».
 *
 *   Método   11 entradas · passo 28,5px · índice 349,5px · 10 no primeiro ecrã
 *   Agenda    5 entradas · passo 28,5px · índice 190,0px ·  5 no primeiro ecrã
 */
const INDICES = {
  metodo: { pt: '/metodo', en: '/en/method', antesDoBlocoB: 10, indiceAntes: 349.5 },
  agenda: { pt: '/agenda', en: '/en/agenda', antesDoBlocoB: 5, indiceAntes: 190.0 },
};
const MUNICIPIOS = { pt: '/municipios', en: '/en/municipalities' };

/* ========================================================================== */
/* C4, a parte que se lê do disco: a página construída, sem navegador.         */
/* ========================================================================== */

/* SEM SCRIPT A CAIXA NÃO APARECE, e é a regra da peça: «uma caixa de pesquisa
   que não pesquisa é pior do que nenhuma». O bloco sai do servidor com `hidden`,
   e quem o acende é `public/js/municipios.js`. A régua confere as duas metades:
   o `hidden` no HTML e a página a citar o ficheiro que o tira. */
for (const edicao of ['pt', 'en']) {
  const f = path.join(DIST, MUNICIPIOS[edicao].replace(/^\//, ''), 'index.html');
  const html = fs.readFileSync(f, 'utf8');
  const root = parse(html);
  const bloco = root.querySelector('[data-pesquisa-bloco]');
  const itens = root.querySelectorAll('.pesquisa-item');
  const comPagina = root.querySelectorAll('.pesquisa-item[data-tem-pagina]');
  const escondidos = itens.filter((el) => el.hasAttribute('hidden'));
  const script = html.includes('/js/municipios.js');
  const secoes = root.querySelectorAll('.concelhos-grupo-k').map((el) => el.textContent.trim());
  conta(
    /* A COBERTURA NÃO SE FIXA (bloco dos 308, P2). A célula pedia «um com página
       e 307 escondidos», que era a cobertura da tarde em que nasceu. A regra é
       outra: são 308 resultados, um por concelho da Carta; os que TÊM página
       vêm à vista e são porta, e os que não têm vêm escondidos. As duas
       parcelas somam 308, e é isso que se mede. */
    `C4 · sem script a pesquisa não aparece, e os 308 resultados vêm do servidor · ${edicao}`,
    Boolean(bloco) &&
      bloco.hasAttribute('hidden') &&
      itens.length === 308 &&
      comPagina.length + escondidos.length === 308 &&
      escondidos.every((el) => !el.hasAttribute('data-tem-pagina')) &&
      script,
    `bloco com hidden: ${bloco ? bloco.hasAttribute('hidden') : 'não há bloco'} · ${itens.length} resultados, ${comPagina.length} com página, ${escondidos.length} escondidos · a página cita /js/municipios.js: ${script} · ${secoes.length} secções, a primeira «${secoes[0] ?? '(nenhuma)'}»`,
  );
  /* A CÉLULA DA SECÇÃO «COM PÁGINA» PERDEU O OBJECTO (bloco dos 308, P2). Media
     que os concelhos com página vinham numa secção antes da lista por distritos,
     e essa secção existia porque um em 308 tinha página: chegar a esse um era
     varrer 308 nomes. Com os 308 construídos, a secção era a lista inteira
     repetida por cima da lista inteira, e saiu. O que fica medido é o que passou
     a ser o índice: a pesquisa em cima, a cobertura pelas duas chaves da prova,
     e a lista por distrito — as três na régua `tests/municipio/concelhos.mjs`,
     que conta os 29 grupos da Carta e mais nenhum. */
  conta(
    `C4 · a lista é a dos distritos da Carta, sem secção repetida por cima · ${edicao}`,
    secoes.length === 29 && !secoes.includes(edicao === 'pt' ? 'Com página' : 'With a page'),
    `${secoes.length} secções · a primeira é «${secoes[0] ?? '(nenhuma)'}», a última «${secoes[secoes.length - 1] ?? '(nenhuma)'}»`,
  );
  if (edicao === 'pt') {
    medidas.c4_html = { itens: itens.length, comPagina: comPagina.length, escondidos: escondidos.length, secoes: secoes.slice(0, 3) };
  }
}

/* ========================================================================== */
/* 390 · WebKit, iPhone 13                                                     */
/* ========================================================================== */

/**
 * A SONDA DE UM ÍNDICE (C2).
 *
 * As áreas são as mesmas que a régua B10 compara: uma caixa por linha do
 * elemento, mais a caixa do `::after` quando ele é posicionado. A área efetiva
 * de um alvo é a união delas, e um par sobreposto é qualquer par de áreas que se
 * cruzem por mais de meio píxel nos dois eixos.
 */
const SONDA_INDICE = () => {
  const nav = document.querySelector('.metodo-sumario');
  if (!nav) return null;
  const as = [...nav.querySelectorAll('a')];
  const areasDe = (el) => {
    const rs = [...el.getClientRects()].map((r) => ({
      x1: r.left,
      y1: r.top + scrollY,
      x2: r.right,
      y2: r.bottom + scrollY,
    }));
    const cs = getComputedStyle(el, '::after');
    if (cs && cs.content !== 'none' && cs.position === 'absolute') {
      const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
      const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
      if (W > 0 && H > 0) {
        const r = el.getBoundingClientRect();
        const cx = (r.left + r.right) / 2;
        const cy = (r.top + r.bottom) / 2 + scrollY;
        rs.push({ x1: cx - W / 2, y1: cy - H / 2, x2: cx + W / 2, y2: cy + H / 2 });
      }
    }
    return rs;
  };
  const areas = as.map(areasDe);
  const uniao = areas.map((rs) =>
    rs.reduce((a, b) => ({
      x1: Math.min(a.x1, b.x1),
      y1: Math.min(a.y1, b.y1),
      x2: Math.max(a.x2, b.x2),
      y2: Math.max(a.y2, b.y2),
    })),
  );
  const pares = [];
  for (let i = 0; i < as.length; i++) {
    for (let j = i + 1; j < as.length; j++) {
      let pior = null;
      for (const p of areas[i]) {
        for (const q of areas[j]) {
          const ox = Math.min(p.x2, q.x2) - Math.max(p.x1, q.x1);
          const oy = Math.min(p.y2, q.y2) - Math.max(p.y1, q.y1);
          if (ox > 0.5 && oy > 0.5 && (!pior || ox * oy > pior.ox * pior.oy)) pior = { ox, oy };
        }
      }
      if (pior) {
        pares.push(
          `${as[i].textContent.trim().slice(0, 14)} × ${as[j].textContent.trim().slice(0, 14)} [${pior.ox.toFixed(0)}×${pior.oy.toFixed(0)}]`,
        );
      }
    }
  }
  const pequenos = uniao.filter((u) => u.x2 - u.x1 < 44 || u.y2 - u.y1 < 44);
  return {
    ecra: innerHeight,
    entradas: as.length,
    alturaDoIndice: +nav.getBoundingClientRect().height.toFixed(1),
    noPrimeiroEcra: uniao.filter((u) => u.y2 <= innerHeight).length,
    pequenos: pequenos.length,
    menor: uniao.length
      ? uniao
          .map((u) => `${(u.x2 - u.x1).toFixed(1)}×${(u.y2 - u.y1).toFixed(1)}`)
          .sort((a, b) => Number(a.split('×')[1]) - Number(b.split('×')[1]))[0]
      : null,
    pares: pares.length,
    quais: pares.slice(0, 3),
  };
};

const navMovel = await webkit.launch({ headless: true });
const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });

/* --------------------------------------------------------------- C2 · os índices */
for (const [nome, cfg] of Object.entries(INDICES)) {
  for (const edicao of ['pt', 'en']) {
    const p = await ctx.newPage();
    await p.goto(base + cfg[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(SONDA_INDICE);
    /**
     * A ALTURA CONTA TAMBÉM, e a razão é um estrago que não fechou.
     *
     * A primeira versão desta régua julgava só «quantas entradas cabem no
     * primeiro ecrã». Com o estrago plantado do C2, a lista de volta a uma
     * coluna, a célula do Método ficou vermelha (7 de 11) e a da AGENDA ficou
     * verde: cinco entradas cabem no ecrã numa coluna e em duas, e o índice
     * tinha crescido de 199,8px para 299,8px sem que a régua o dissesse. Uma
     * célula que não fecha sobre o estrago do seu item não prova o item.
     *
     * O tecto é o de antes do bloco B mais UMA FILA (50px, que é o passo que o
     * bloco B deixou): o índice pode crescer o que uma fila cresce, e não mais.
     */
    const tecto = cfg.indiceAntes + 50;
    conta(
      `C2 · o índice de ${nome} cabe no primeiro ecrã, com 44px de alvo e sem sobreposições · 390 ${edicao}`,
      m !== null &&
        m.noPrimeiroEcra >= cfg.antesDoBlocoB &&
        m.alturaDoIndice <= tecto &&
        m.pequenos === 0 &&
        m.pares === 0,
      m === null
        ? 'não há índice nesta página'
        : `${m.noPrimeiroEcra} de ${m.entradas} entradas dentro dos ${m.ecra}px (antes do bloco B: ${cfg.antesDoBlocoB}) · índice ${m.alturaDoIndice}px (antes do bloco B: ${cfg.indiceAntes}px; o tecto é ${tecto.toFixed(1)}px) · alvos abaixo de 44px: ${m.pequenos} (o menor mede ${m.menor}) · pares sobrepostos: ${m.pares}` +
          (m.quais.length ? ` · ${m.quais.join(' | ')}` : ''),
    );
    if (edicao === 'pt') medidas[`c2_${nome}`] = m;
    await p.close();
  }
}

/* ---------------------------------------------------------- C4 · a pesquisa, viva */
for (const edicao of ['pt', 'en']) {
  const p = await ctx.newPage();
  await p.goto(base + MUNICIPIOS[edicao], { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  const campo = await p.evaluate(() => {
    const c = document.querySelector('#pesquisa-concelho');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return {
      ecra: innerHeight,
      topo: +(r.top + scrollY).toFixed(1),
      largura: +r.width.toFixed(1),
      altura: +r.height.toFixed(1),
      dentroDoPrimeiroEcra: r.bottom + scrollY <= innerHeight,
    };
  });
  conta(
    `C4 · o campo de pesquisa está dentro do primeiro ecrã · 390 ${edicao}`,
    campo !== null && campo.dentroDoPrimeiroEcra && campo.altura >= 44,
    campo === null
      ? 'não há campo de pesquisa nesta página'
      : `campo a ${campo.topo}px de ${campo.ecra}, ${campo.largura}×${campo.altura}px, dentro ${campo.dentroDoPrimeiroEcra}`,
  );
  if (edicao === 'pt') medidas.c4_campo = campo;

  /* Escrever um nome acende o concelho certo, e o que ele faz depende de ter
     página: Évora abre a sua, Beja diz que ainda não tem e não é porta. */
  /* A ETIQUETA DE ESTADO SÓ SE RENDE SE A LISTA DISTINGUIR (item E8, P2). A
     régua lê da própria página se há dois estados, e exige a etiqueta
     exactamente quando há. */
  const distingue = await p.evaluate(() =>
    [...document.querySelectorAll('.pesquisa-item')].some((li) => !li.hasAttribute('data-tem-pagina')),
  );
  const escritos = {};
  for (const [chave, texto] of [['evora', 'evora'], ['beja', 'beja']]) {
    await p.fill('#pesquisa-concelho', '');
    await p.fill('#pesquisa-concelho', texto);
    escritos[chave] = await p.evaluate(() => {
      const vis = [...document.querySelectorAll('.pesquisa-item')].filter((li) => !li.hidden);
      return vis.map((li) => {
        const a = li.querySelector('a[href]');
        return {
          nome: li.querySelector('.pesquisa-nome')?.textContent.trim() ?? null,
          estado: li.querySelector('[data-cobertura]')?.getAttribute('data-cobertura') ?? null,
          porta: a ? a.getAttribute('href') : null,
        };
      });
    });
  }
  const evora = escritos.evora;
  const beja = escritos.beja;
  const destino = edicao === 'pt' ? '/municipios/evora' : '/en/municipalities/evora';
  /* A COBERTURA NÃO SE FIXA (bloco dos 308, P2). A célula pedia «Beja não tem
     página», que era a cobertura da tarde em que nasceu. A regra é a
     equivalência: um resultado é porta SE E SÓ SE o seu estado diz «com-pagina»,
     e o destino é a página do seu concelho. Vale nos dois casos escritos e vale
     para qualquer cobertura. */
  const daRota = (slug) => (edicao === 'pt' ? `/municipios/${slug}` : `/en/municipalities/${slug}`);
  const coerente = (r, slug) => {
    const temPagina = r.porta === daRota(slug);
    if (!temPagina && r.porta !== null) return false;
    if (!distingue) return r.estado === null;
    return r.estado === (temPagina ? 'com-pagina' : 'sem-pagina');
  };
  conta(
    `C4 · escrever um nome acende o concelho, e é porta se e só se tem página · 390 ${edicao}`,
    evora.length === 1 &&
      evora[0].porta === destino &&
      coerente(evora[0], 'evora') &&
      beja.length === 1 &&
      coerente(beja[0], 'beja'),
    `a lista distingue: ${distingue} · «evora» → ${evora.length} resultado(s): ${evora.map((r) => `${r.nome} [${r.estado ?? 'sem etiqueta'}] → ${r.porta ?? 'sem porta'}`).join(', ')} · «beja» → ${beja.length} resultado(s): ${beja.map((r) => `${r.nome} [${r.estado ?? 'sem etiqueta'}] → ${r.porta ?? 'sem porta'}`).join(', ')}`,
  );
  if (edicao === 'pt') medidas.c4_escritos = escritos;

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string' && edicao === 'pt') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    for (const [nome, rota] of [
      ['municipios', MUNICIPIOS.pt],
      ['metodo', INDICES.metodo.pt],
      ['agenda', INDICES.agenda.pt],
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
await navMovel.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · passo C · itens C2 e C4 · ${reguas.length} réguas`));
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
