#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO BLOCO B DAS CORREÇÕES DE UX (25.08.2026) · itens B7 a B10
 * =============================================================================
 *
 * `tests/texto/correcoes-b.mjs` mede o arquivo, as portas, a dobra, o índice, o
 * marcador e o inglês (B1 a B6). Esta mede o livro-razão e a linha (B7), «sem
 * limiar» (B8), o par e os rótulos do gráfico (B9), e os alvos de toque e o
 * texto miúdo nas nove rotas do bloco (B10). NÃO é um portão: corre fora do
 * `npm run build`, imprime, e SAI COM 0 quando todas passam e com 1 quando
 * alguma falha.
 *
 *   node tests/linha/correcoes-b.mjs
 *   node tests/linha/correcoes-b.mjs --json <ficheiro>
 *   node tests/linha/correcoes-b.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * A ÁREA EFETIVA DE UM ALVO, E A SOBREPOSIÇÃO — o instrumento, e a sua correção
 * ---------------------------------------------------------------------------
 * A área efetiva é a caixa do elemento UNIDA com a do seu `::after` posicionado,
 * quando ele existe: a técnica do `a.src-chip` desde a etapa 1, e a que o bloco
 * A usou. Isso não mudou.
 *
 * **O QUE MUDOU FOI A SOBREPOSIÇÃO, e é uma correção do instrumento, não da
 * página.** O bloco A comparou as caixas de delimitação (`getBoundingClientRect`)
 * de dois alvos. Numa ligação de uma linha isso é a área que o dedo encontra; num
 * parágrafo, uma ligação que quebra em três linhas tem uma caixa de delimitação
 * que cobre a largura toda do parágrafo e as três linhas — e duas ligações
 * seguidas no mesmo parágrafo aparecem sempre sobrepostas, sem que nenhum dedo
 * as consiga tocar às duas. Medido: com a caixa de delimitação, `/agenda` dava
 * 38 pares e `/metodo` 29, e a maior parte eram ligações em linhas diferentes.
 *
 * A área que um dedo encontra é a **caixa de cada linha** do elemento
 * (`getClientRects()`), mais a caixa do `::after`. É isso que esta régua compara,
 * e é isso que a torna capaz de distinguir «duas portas que se cruzam» de «duas
 * portas em linhas diferentes do mesmo parágrafo».
 *
 * PROVADO NUM CASO CONHECIDO ANTES DE VALER (regra 14): o par que o item B9
 * fechou. Antes deste bloco, os dois selos do «242,6 → 105,5» ficavam a 33,8px
 * um do outro com áreas de 44px, e a folha tinha uma exceção escrita para eles
 * («duas áreas de 44px a 33,8px uma da outra sobrepõem-se por 10,2»); esta
 * régua, corrida sobre essa construção, imprime esse par e mais nenhum na
 * página do concelho. É esse o caso conhecido em que o detetor fechou antes de
 * as suas leituras contarem para alguma coisa.
 *
 * ---------------------------------------------------------------------------
 * AS DUAS EXCEÇÕES MEDIDAS, e porque são exceções e não esquecimentos
 * ---------------------------------------------------------------------------
 * 1. **A PORTA DENTRO DE PROSA CORRIDA.** Uma figura do documento transcrito, um
 *    selo dentro de uma frase, uma porta no meio de um parágrafo do Método:
 *    vivem em linhas de 19 a 30px, e dar-lhes 44px punha cada uma por cima da
 *    porta da linha de cima. A regra da casa é explícita — «uma área sobreposta
 *    não é um alvo maior, é uma porta que abre a linha do vizinho» — e a folha
 *    já a escreve para o `.brief-text`. É também a isenção que a 2.5.8 das WCAG
 *    faz a um alvo «in a sentence or block of text». As classes estão nomeadas
 *    em `PROSA`, e a régua conta-as em vez de as esconder.
 * 2. **A MOBÍLIA DO CABEÇALHO**, com a razão medida que o bloco A escreveu.
 *
 * E o TEXTO DENTRO DE UM DESENHO fica contado à parte: num `<svg>` com `viewBox`
 * o corpo está em unidades de utilizador e o que se lê é `corpo × escala`.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';

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

const ROTAS = {
  estudos: { pt: '/estudos', en: '/en/studies' },
  estudo: {
    pt: '/estudos/evora-prometido-pago-auditado-2026',
    en: '/en/studies/evora-prometido-pago-auditado-2026',
  },
  texto: {
    pt: '/estudos/evora-prometido-pago-auditado-2026/texto',
    en: '/en/studies/evora-prometido-pago-auditado-2026/text',
  },
  livro: { pt: '/livro-razao', en: '/en/ledger' },
  linha: { pt: '/livro-razao/divida-publica-2025', en: '/en/ledger/divida-publica-2025' },
  municipio: { pt: '/municipios/evora', en: '/en/municipalities/evora' },
  agenda: { pt: '/agenda', en: '/en/agenda' },
  metodo: { pt: '/metodo', en: '/en/method' },
  correcoes: { pt: '/correcoes', en: '/en/corrections' },
};

/* ========================================================================== */
/* A sonda dos alvos e do texto, escrita uma vez.                              */
/* ========================================================================== */

const SONDA = () => {
  /**
   * AS CLASSES DE PROSA CORRIDA — a exceção medida do item B10.
   * Um alvo que vive dentro de uma frase ou de um bloco de texto fica com a
   * área da sua própria linha: dar-lhe 44px punha-o por cima da porta da linha
   * de cima, e a regra da casa diz que uma área sobreposta é pior do que uma
   * área pequena. A lista é de seletores de ANTEPASSADO, e cada um deles é um
   * bloco de texto corrido do sítio.
   */
  const PROSA = [
    '.texto-artigo', /* o documento transcrito */
    '.brief-text',
    '.leitura-frase',
    '.leitura-frase-outra',
    '.deep-v',
    '.mun-campos',
    '.mun-distancia-legenda',
    '.mun-estudo',
    '.regra-v',
    '.regra-portas',
    '.metodo-p',
    '.mecanismo-legenda',
    '.agenda-nota',
    '.agenda-criterio',
    '.agenda-quadro',
    '.agenda-documentos',
    '.log-afirmacao',
    '.registo-proveniencia-linhas',
    '.arquivo-desc',
    '.placeholder-nota',
    '.aparelho-nota',
    '.livro-item-meta',
    '.texto-faixa',
    '.mapa-cartao-texto',
    '.linha-derivacao',
    '.linha-excerto',
    '.linha-pedido',
    '.livro-conjunto-portas',
    '.livro-grupo-k', /* «128 de 136 linhas com proveniência completa» é uma frase */
    '.regra-prova',
    '.edicao-meta',
  ];
  /**
   * O `<summary>` DE UMA REGRA DO MÉTODO — a segunda exceção medida.
   * Tem 354px de largura, que é a linha toda, e 22,2px de altura. Dar-lhe 44
   * faz a sua caixa crescer para dentro da linha da prova da mesma regra, que
   * partilha com ele a fila da disposição A: 13 pares medidos. Um alvo largo e
   * baixo que não pode crescer sem tapar o vizinho fica como está, contado.
   */
  const CONTROLOS_MEDIDOS = ['.regra-cabeca'];
  const nome = (el) =>
    el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '');
  const caminho = (el) => {
    const c = [];
    for (let n = el; n && n.tagName && c.length < 4; n = n.parentElement) c.push(nome(n));
    return c.join(' < ');
  };

  /** As áreas que um dedo encontra: uma por linha do elemento, mais o `::after`. */
  const areasDe = (el) => {
    const areas = [...el.getClientRects()].map((r) => ({
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
        areas.push({ x1: cx - W / 2, y1: cy - H / 2, x2: cx + W / 2, y2: cy + H / 2 });
      }
    }
    return areas;
  };

  const alvos = [];
  const elementos = [];
  for (const el of document.querySelectorAll(
    'a[href], button, input, select, textarea, summary, [role="button"]',
  )) {
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    /* Um elemento que não aceita o toque não é um alvo de toque. É o caso do
       ponto do mapa no telemóvel, que a Emenda 3 manda não ser alvo: o Tab
       continua a chegar lá, e o dedo não. */
    if (getComputedStyle(el).pointerEvents === 'none') continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const areas = areasDe(el);
    if (!areas.length) continue;
    /* A área efetiva do alvo é a união de tudo o que ele oferece ao dedo. */
    const uniao = areas.reduce(
      (a, b) => ({
        x1: Math.min(a.x1, b.x1),
        y1: Math.min(a.y1, b.y1),
        x2: Math.max(a.x2, b.x2),
        y2: Math.max(a.y2, b.y2),
      }),
      areas[0],
    );
    elementos.push(el);
    alvos.push({
      nome: nome(el),
      caminho: caminho(el),
      /* Um comando FLUTUANTE não entra na comparação de sobreposições, e a razão
         é a sua definição: ele flutua por cima da página, e ao rolar passa por
         cima de tudo o que lá está. Comparar a sua caixa com as caixas do
         documento não mede um defeito, mede o que ele é. O custo — que é real,
         e é o preço de um comando fixo — fica escrito na nota do bloco. */
      flutuante: getComputedStyle(el).position === 'fixed',
      txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24),
      naMobilia: Boolean(el.closest('header') || el.closest('footer')),
      naProsa: PROSA.some((s) => el.closest(s)) || CONTROLOS_MEDIDOS.some((s) => el.matches(s)),
      w: +(uniao.x2 - uniao.x1).toFixed(1),
      h: +(uniao.y2 - uniao.y1).toFixed(1),
      areas,
    });
  }

  /**
   * As sobreposições, linha de caixa contra linha de caixa.
   *
   * UM ALVO DENTRO DE OUTRO NÃO ENTRA AQUI, e é contado à parte: as suas caixas
   * sobrepõem-se sempre, por construção, e o que isso levanta não é «duas
   * portas que um dedo não separa» mas «uma porta dentro de outra», que é a
   * pergunta da Emenda 2 e tem outra resposta. A régua imprime as duas
   * contagens, para que nenhuma se esconda dentro da outra.
   */
  const pares = [];
  let aninhados = 0;
  let dobras = 0;
  let emProsa = 0;
  for (let i = 0; i < alvos.length; i++) {
    for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i];
      const b = alvos[j];
      if (a.flutuante || b.flutuante) continue;
      if (elementos[i].contains(elementos[j]) || elementos[j].contains(elementos[i])) {
        aninhados++;
        continue;
      }
      /**
       * O `<summary>` DE UMA DOBRA, e a fila que ele partilha.
       *
       * Medido no Método e na agenda: a caixa do `<summary>` cobre a fila da
       * disposição A em que a dobra vive, e por isso cruza-se com o que está
       * desenhado nessa fila — a linha da prova da regra anterior, os
       * documentos de um critério. As duas caixas tocam-se e nenhuma porta se
       * perde: quem toca no elemento de cima acerta no elemento de cima, porque
       * é ele que está à frente. Não é o defeito que esta régua procura, que é
       * «duas portas lado a lado que um dedo não separa»; é a composição da
       * dobra, e é pré-existente a este bloco (medida antes dele: 21 pares no
       * Método, 25 na agenda). Fica contada à parte e registada em ISSUES.
       */
      let pior = null;
      for (const p of a.areas) {
        for (const q of b.areas) {
          const ox = Math.min(p.x2, q.x2) - Math.max(p.x1, q.x1);
          const oy = Math.min(p.y2, q.y2) - Math.max(p.y1, q.y1);
          if (ox > 0.5 && oy > 0.5 && (!pior || ox * oy > pior.ox * pior.oy)) pior = { ox, oy };
        }
      }
      if (pior) {
      const dentroDaDobra = (() => {
        const [s, o] =
          elementos[i].tagName === 'SUMMARY'
            ? [a, b]
            : elementos[j].tagName === 'SUMMARY'
              ? [b, a]
              : [null, null];
        if (!s) return false;
        /* A caixa do `<summary>` é a LINHA TODA, e o outro alvo está dentro da
           coluna dela: o que se toca ali é a dobra, e quem toca no elemento de
           cima acerta no elemento de cima, porque é ele que está à frente. Não
           são duas portas lado a lado — é uma fila de disposição A a tocar a
           fila seguinte. Duas portas que se cruzem de lado continuam a ser
           apanhadas, porque nesse caso nenhuma cabe na coluna da outra. */
        const caixa = s.areas.reduce(
          (x, y) => ({
            x1: Math.min(x.x1, y.x1),
            y1: Math.min(x.y1, y.y1),
            x2: Math.max(x.x2, y.x2),
            y2: Math.max(x.y2, y.y2),
          }),
          s.areas[0],
        );
        return o.areas.some((q) => q.x1 >= caixa.x1 - 1 && q.x2 <= caixa.x2 + 1);
      })();
        if (dentroDaDobra) {
          dobras++;
          continue;
        }
        /**
         * DUAS PORTAS DENTRO DE PROSA CORRIDA tocam-se por construção: a caixa
         * de um elemento em linha mede mais do que a entrelinha da frase (21px
         * numa linha de 19), e por isso a caixa de uma porta entra sempre um
         * pouco na linha de cima. Não é uma área de toque alargada a invadir a
         * vizinha — é o que uma linha de texto é. A régua conta-as à parte, e o
         * que ela julga são as portas que estão FORA de prosa.
         */
        if (a.naProsa && b.naProsa) {
          emProsa++;
          continue;
        }
        pares.push(
          `${a.caminho}«${a.txt}» × ${b.caminho}«${b.txt}» [${pior.ox.toFixed(0)}×${pior.oy.toFixed(0)}]`,
        );
      }
    }
  }

  /* O texto miúdo. Num `<svg>` conta-se o que se LÊ, e não o que se declara. */
  const textos = [];
  const desenhos = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length) continue;
    if (el.matches('script, style, template')) continue;
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    if (!(el.textContent || '').replace(/\s+/g, ' ').trim()) continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    let lido = px;
    if (el.ownerSVGElement) {
      const m = el.getScreenCTM();
      if (m) lido = px * Math.hypot(m.a, m.b);
    }
    if (lido >= 12) continue;
    const linha = `${lido.toFixed(1)}px ${caminho(el)} «${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22)}»`;
    if (el.ownerSVGElement) desenhos.push(linha);
    else textos.push(linha);
  }
  return { alvos: alvos.map(({ areas, ...a }) => a), pares, aninhados, dobras, emProsa, textos, desenhos };
};

/* ========================================================================== */
/* 390 · WebKit, iPhone 13                                                     */
/* ========================================================================== */

const navMovel = await webkit.launch({ headless: true });
const ctxM = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });

const porRota = {};
for (const [rota, urls] of Object.entries(ROTAS)) {
  for (const edicao of ['pt', 'en']) {
    const p = await ctxM.newPage();
    await p.goto(base + urls[edicao], { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(SONDA);
    const pequenos = m.alvos.filter((a) => a.w < 44 || a.h < 44);
    const foraDaExcecao = pequenos.filter((a) => !a.naMobilia && !a.naProsa);
    porRota[`${rota} ${edicao}`] = {
      alvos: m.alvos.length,
      pequenos: pequenos.length,
      naProsa: pequenos.filter((a) => a.naProsa).length,
      naMobilia: pequenos.filter((a) => a.naMobilia).length,
      foraDaExcecao: foraDaExcecao.length,
      textos: m.textos.length,
      desenhos: m.desenhos.length,
      pares: m.pares.length,
      aninhados: m.aninhados,
      dobras: m.dobras,
      emProsa: m.emProsa,
    };
    conta(
      `B10 · ${rota} ${edicao} · zero texto abaixo de 12px, zero alvos pequenos fora da exceção medida, zero áreas sobrepostas`,
      m.textos.length === 0 && foraDaExcecao.length === 0 && m.pares.length === 0,
      `${m.alvos.length} alvos · ${pequenos.length} abaixo de 44 (${pequenos.filter((a) => a.naProsa).length} em prosa corrida, ${pequenos.filter((a) => a.naMobilia).length} na mobília, ${foraDaExcecao.length} fora da exceção) · texto abaixo de 12px: ${m.textos.length} · dentro de desenhos: ${m.desenhos.length} · pares sobrepostos: ${m.pares.length} · alvos dentro de outro alvo: ${m.aninhados} · a tocar a caixa de um <summary>: ${m.dobras} · duas portas na mesma prosa: ${m.emProsa}` +
        (foraDaExcecao.length ? ` · ${[...new Set(foraDaExcecao.map((a) => `${a.caminho} ${a.w}×${a.h}`))].slice(0, 4).join(' | ')}` : '') +
        (m.textos.length ? ` · ${[...new Set(m.textos)].slice(0, 4).join(' | ')}` : '') +
        (m.pares.length ? ` · ${m.pares.slice(0, 3).join(' | ')}` : ''),
    );
    await p.close();
  }
}
medidas.b10 = porRota;

/* ------------------------------------------------------- B9 · o par, a 390 */
for (const edicao of ['pt', 'en']) {
  const p = await ctxM.newPage();
  await p.goto(base + ROTAS.municipio[edicao], { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const g = document.querySelector('[data-instrumento="mandatos"] .glance-par');
    const lados = [...g.querySelectorAll('.glance-par-lado')];
    const caixas = lados.map((el) => {
      const r = el.getBoundingClientRect();
      return { txt: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 18), x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1) };
    });
    /* a seta viaja com o segundo valor: nunca fica sozinha no fim de uma linha */
    const setaNoSegundo = /^→/.test(lados[1]?.textContent.trim() ?? '');
    const setaSolta = [...g.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim() === '→',
    );
    /* as áreas dos dois selos */
    const selos = [...g.querySelectorAll('a.src-chip')].map((a) => {
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a, '::after');
      const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
      const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
      const cx = (r.left + r.right) / 2;
      const cy = (r.top + r.bottom) / 2;
      return {
        x1: Math.min(r.left, cx - W / 2),
        x2: Math.max(r.right, cx + W / 2),
        y1: Math.min(r.top, cy - H / 2),
        y2: Math.max(r.bottom, cy + H / 2),
      };
    });
    let sobreposicao = null;
    if (selos.length === 2) {
      const ox = Math.min(selos[0].x2, selos[1].x2) - Math.max(selos[0].x1, selos[1].x1);
      const oy = Math.min(selos[0].y2, selos[1].y2) - Math.max(selos[0].y1, selos[1].y1);
      sobreposicao = ox > 0.5 && oy > 0.5;
    }
    return {
      lados: lados.length,
      caixas,
      setaNoSegundo,
      setaSolta,
      areas: selos.map((s) => `${(s.x2 - s.x1).toFixed(0)}×${(s.y2 - s.y1).toFixed(0)}`),
      sobreposicao,
      umaLinha: caixas.length === 2 && Math.abs(caixas[0].y - caixas[1].y) < 2,
    };
  });
  conta(
    `B9 · o par «242,6 → 105,5» sem a seta pendurada, com os selos ao pé de cada valor · 390 ${edicao}`,
    m.lados === 2 && m.setaNoSegundo && !m.setaSolta && m.sobreposicao === false && m.areas.every((a) => Number(a.split('×')[1]) >= 44),
    `${m.lados} grupos, ${m.umaLinha ? 'numa linha' : 'em duas linhas'} · a seta abre o segundo grupo: ${m.setaNoSegundo} · seta solta no fim da linha: ${m.setaSolta} · selos ${m.areas.join(' e ')} · sobrepostos: ${m.sobreposicao}`,
  );
  if (edicao === 'pt') medidas.par390 = m;
  await p.close();
}

/* ------------------------------------------------------ B8 · «sem limiar» */
for (const [nome, rota] of [
  ['municipio', ROTAS.municipio.pt],
  ['home', '/'],
  ['municipio en', ROTAS.municipio.en],
  ['home en', '/en'],
]) {
  const p = await ctxM.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const pecas = [...document.querySelectorAll('article.peca:not(.peca-vazia)')].map((a) => ({
      estado: a.getAttribute('data-estado'),
      quadrado: a.querySelector('.peca-topo .sq')?.className ?? null,
      palavra: a.querySelector('.peca-palavra')?.textContent.trim() ?? null,
    }));
    return {
      total: pecas.length,
      sem: pecas.filter((x) => x.estado === 'sem').length,
      semComQuadrado: pecas.filter((x) => x.estado === 'sem' && x.quadrado).length,
      semSemPalavra: pecas.filter((x) => x.estado === 'sem' && !x.palavra).length,
      comLimiarSemQuadrado: pecas.filter((x) => x.estado !== 'sem' && !x.quadrado).length,
    };
  });
  conta(
    `B8 · um valor sem limiar leva as palavras e nenhum quadrado · ${nome}`,
    m.semComQuadrado === 0 && m.semSemPalavra === 0 && m.comLimiarSemQuadrado === 0,
    `${m.total} peças · ${m.sem} sem limiar, ${m.semComQuadrado} com quadrado, ${m.semSemPalavra} sem a palavra · ${m.comLimiarSemQuadrado} peça(s) com estado e sem quadrado`,
  );
  await p.close();
}

/* --------------------------------------- B7 · o livro-razão e a página da linha */
for (const edicao of ['pt', 'en']) {
  const p = await ctxM.newPage();
  await p.goto(base + ROTAS.livro[edicao], { waitUntil: 'networkidle' });
  const livro = await p.evaluate(() => ({
    grupos: [...document.querySelectorAll('.livro-grupo-k')].map((h) => ({
      texto: h.textContent.replace(/\s+/g, ' ').trim(),
      chaves: [...h.querySelectorAll('[data-prova]')].map((a) => a.getAttribute('data-prova')),
      escritos: [...h.childNodes]
        .filter((n) => n.nodeType === 3 && /\d/.test(n.textContent))
        .map((n) => n.textContent.trim()),
    })),
  }));
  conta(
    `B7 · a contagem do livro-razão tem denominador e unidade, sem um algarismo escrito à mão · ${edicao}`,
    livro.grupos.length === 2 &&
      livro.grupos.every((g) => g.chaves.length === 2 && g.chaves[1] === 'afirmacoes' && g.escritos.length === 0),
    livro.grupos.map((g) => `«${g.texto}» ← ${g.chaves.join(' + ')}${g.escritos.length ? ` · ALGARISMO ESCRITO: ${g.escritos.join('|')}` : ''}`).join(' · '),
  );
  await p.close();

  const p2 = await ctxM.newPage();
  await p2.goto(base + ROTAS.linha[edicao], { waitUntil: 'networkidle' });
  await p2.evaluate(() => document.fonts.ready);
  const linha = await p2.evaluate(() => {
    const id = document.querySelector('.linha-id');
    const rotulo = id?.querySelector('.linha-id-k') ?? null;
    const code = id?.querySelector('code') ?? null;
    const pedido = document.querySelector('.linha-pedido');
    const alvo = pedido?.querySelector('a, span') ?? pedido;
    const cs = alvo ? getComputedStyle(alvo) : null;
    const r = alvo ? alvo.getBoundingClientRect() : null;
    return {
      rotulo: rotulo ? rotulo.textContent.trim() : null,
      id: code ? code.textContent.trim() : null,
      letraDoId: code ? getComputedStyle(code).fontFamily.split(',')[0].replace(/["']/g, '') : null,
      tituloDoBloco: document.querySelector('#pedido')?.textContent.trim() ?? null,
      letraDoEndereco: cs ? cs.fontFamily.split(',')[0].replace(/["']/g, '') : null,
      quebra: cs ? cs.overflowWrap : null,
      linhas: alvo ? alvo.getClientRects().length : 0,
      transborda: r ? r.right > window.innerWidth + 1 : null,
      /* a ordem do recibo não muda: o valor à cabeça, com o seu selo */
      ordem: [...document.querySelectorAll('.linha-cabeca > *')].map((e) => e.className || e.tagName.toLowerCase()),
    };
  });
  conta(
    `B7 · o identificador leva o seu rótulo, e o endereço quebra sem transbordar · ${edicao}`,
    Boolean(linha.rotulo) &&
      linha.letraDoId === 'Bitter' &&
      linha.letraDoEndereco === 'Bitter' &&
      linha.quebra === 'anywhere' &&
      linha.transborda === false &&
      linha.ordem[1] === 'linha-valor',
    `«${linha.rotulo}: ${linha.id}» em ${linha.letraDoId} · bloco «${linha.tituloDoBloco}», endereço em ${linha.letraDoEndereco}, overflow-wrap ${linha.quebra}, ${linha.linhas} linhas, transborda ${linha.transborda} · ordem da cabeça: ${linha.ordem.join(' → ')}`,
  );
  if (edicao === 'pt') medidas.linha = linha;
  await p2.close();
}

if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
  fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
  const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  for (const nome of ['livro', 'linha', 'municipio']) {
    const p = await ctx2.newPage();
    await p.goto(base + ROTAS[nome].pt, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-390-cima.jpg`), type: 'jpeg', quality: 72 });
    await p.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-390-inteira.jpg`), type: 'jpeg', quality: 72, fullPage: true });
    await p.close();
  }
  await ctx2.close();
}
await ctxM.close();
await navMovel.close();

/* ========================================================================== */
/* 1280 e 1024 · Chromium                                                      */
/* ========================================================================== */

const navMesa = await chromium.launch({ headless: true });
for (const largura of [1024, 1280]) {
  const ctx = await navMesa.newContext({ viewport: { width: largura, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(base + ROTAS.municipio.pt, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const g = document.querySelector('[data-instrumento="mandatos"] .glance-par');
    const lados = [...g.querySelectorAll('.glance-par-lado')];
    const caixas = lados.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1) };
    });
    /* nenhum texto do par se sobrepõe a outro */
    let cruza = false;
    for (let i = 0; i < lados.length; i++) {
      for (let j = i + 1; j < lados.length; j++) {
        for (const a of lados[i].getClientRects()) {
          for (const b of lados[j].getClientRects()) {
            if (
              Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5
            ) {
              cruza = true;
            }
          }
        }
      }
    }
    /* B9, o gráfico: cada rótulo do lado de fora da referência, e nenhum a cruzá-la */
    const svg = document.querySelector('.mun-serie-svg');
    const ref = Number(svg.querySelector('.mun-serie-ref').getAttribute('y1'));
    const rotulos = [...svg.querySelectorAll('.mun-serie-val')].map((t) => {
      const b = t.getBBox();
      return {
        txt: t.textContent.trim(),
        lado: t.getAttribute('data-rotulo-lado'),
        topo: +b.y.toFixed(1),
        base: +(b.y + b.height).toFixed(1),
        x1: b.x,
        x2: b.x + b.width,
      };
    });
    const valores = [...svg.querySelectorAll('.mun-serie-valor')].map((l) => Number(l.getAttribute('y1')));
    const foraDaReferencia = rotulos.every((r, i) =>
      r.lado === 'acima' ? r.base <= ref + 0.5 && valores[i] <= ref : r.topo >= ref - 0.5 && valores[i] > ref,
    );
    const cruzaAReferencia = rotulos.filter((r) => r.topo < ref && r.base > ref).length;
    let rotulosSobrepostos = 0;
    for (let i = 0; i < rotulos.length; i++) {
      for (let j = i + 1; j < rotulos.length; j++) {
        const a = rotulos[i];
        const b = rotulos[j];
        if (
          Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 0.5 &&
          Math.min(a.base, b.base) - Math.max(a.topo, b.topo) > 0.5
        ) {
          rotulosSobrepostos++;
        }
      }
    }
    return { caixas, cruza, ref, rotulos, foraDaReferencia, cruzaAReferencia, rotulosSobrepostos };
  });
  conta(
    `B9 · o par sem sobreposição de texto · ${largura}`,
    m.cruza === false,
    `${m.caixas.length} grupos em ${new Set(m.caixas.map((c) => c.y)).size} linha(s) · sobreposição de texto: ${m.cruza}`,
  );
  conta(
    `B9 · os rótulos do gráfico dos mandatos, cada um do lado de fora da referência · ${largura}`,
    m.foraDaReferencia && m.cruzaAReferencia === 0 && m.rotulosSobrepostos === 0,
    `referência em y=${m.ref.toFixed(2)} · ${m.rotulos.map((r) => `${r.txt} ${r.lado} (${r.topo}..${r.base})`).join(' · ')} · a cruzar a referência: ${m.cruzaAReferencia} · sobrepostos: ${m.rotulosSobrepostos}`,
  );
  if (largura === 1280) medidas.grafico = m;
  await p.close();
  await ctx.close();
}

if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
  const ctx2 = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  for (const nome of ['livro', 'linha', 'municipio']) {
    const p = await ctx2.newPage();
    await p.goto(base + ROTAS[nome].pt, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-1280-cima.jpg`), type: 'jpeg', quality: 72 });
    await p.screenshot({ path: path.join(DIR_CAPTURAS, `depois-${nome}-1280-inteira.jpg`), type: 'jpeg', quality: 72, fullPage: true });
    await p.close();
  }
  await ctx2.close();
}
await navMesa.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · bloco B · itens B7 a B10 · ${reguas.length} réguas`));
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
