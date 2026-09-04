#!/usr/bin/env node
/**
 * =============================================================================
 * AS RÉGUAS DO BLOCO A DAS CORREÇÕES DE UX (25.08.2026)
 * =============================================================================
 *
 * Uma régua por item do `design/especime-v3/briefs/BRIEF-correcoes-ux-A.md` §2,
 * com o objetivo medido que o brief escreve para cada um. NÃO é um portão: não
 * entra no `npm run build` e não constrói nada. Corre sobre `dist/`, imprime uma
 * linha por régua e SAI COM 0 quando todas passam e com 1 quando alguma falha —
 * ao contrário de `matriz.mjs`, que só imprime, porque estas existem para que um
 * estrago plantado se veja no código de saída.
 *
 *   node tests/inicio/correcoes-a.mjs
 *   node tests/inicio/correcoes-a.mjs --json <ficheiro>
 *   node tests/inicio/correcoes-a.mjs --capturas <dir>   (JPEG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * OS DOIS APARELHOS, E PORQUÊ DOIS
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` e toque a sério (`page.tap`),
 * que é o aparelho com que a auditoria de 25.08 mediu os achados B1, B2, D3,
 * D4, D6 e D7. Um clique de rato num viewport estreito não é a mesma coisa: o
 * defeito B1 nasce do que o navegador faz com o foco a seguir a um toque.
 * Computador: Chromium a 1280 × 800, rato e teclado, que é onde vivem B3 e C3.
 *
 * As duas medições de PIXÉIS (o vazio do item A8) correm com
 * `deviceScaleFactor: 1`, para que um pixel da imagem seja um pixel de CSS e os
 * números se leiam contra os da auditoria sem conversão nenhuma.
 *
 * ---------------------------------------------------------------------------
 * O DETETOR DE BANDAS VAZIAS, E A SUA PROVA
 * ---------------------------------------------------------------------------
 * O item A8 pede o vazio medido «nos pixéis como o leitor-utilizador mediu». O
 * detetor é o dele, reescrito aqui: fotografa a página inteira, desenha-a numa
 * tela, e procura corridas de linhas horizontais em que TODOS os pixéis têm a
 * mesma cor; uma corrida acaba quando a cor muda, e por isso um filete de 1px
 * parte a banda em duas, como parte no ecrã. Conta-se a corrida que tem tinta
 * acima E abaixo, que é o «entre dois blocos de conteúdo» do brief.
 *
 * **Provado num caso conhecido antes de valer como medição** (regra 14): sobre a
 * construção anterior a este bloco, o detetor devolvia 97px em y = 824 a 390 e
 * 125px em y = 1043 a 1280, que são o vazio que o diretor fotografou e os dois
 * números que a auditoria publicou (96 e 125). A régua imprime o valor medido
 * ao lado do limiar, para que ninguém tenha de acreditar nela.
 *
 * O ÂMBITO DA MEDIÇÃO É `<main>`, e é uma escolha dita: a mobília do cabeçalho
 * e o ar antes do rodapé são composição — as goteiras da marca e a separação do
 * pé —, e não bandas entre dois blocos de conteúdo. Ficam medidas e impressas ao
 * lado, sem entrar no juízo, para que a decisão de as mudar seja de quem tem de
 * a tomar e não um efeito colateral desta ronda.
 *
 * ---------------------------------------------------------------------------
 * A ÁREA EFETIVA DE UM ALVO (item A10)
 * ---------------------------------------------------------------------------
 * A caixa do elemento UNIDA com a do seu `::after` posicionado, quando ele
 * existe: é a técnica que `a.src-chip` já usa desde a etapa 1 — um
 * pseudo-elemento absoluto e centrado, que alarga o que se toca sem alargar o
 * que se compõe. Medir só a caixa do elemento conta 52 × 14px onde o dedo
 * encontra 52 × 44, que foi o que aconteceu na auditoria.
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

/* ========================================================================== */
/* As sondas que correm dentro da página. Escritas uma vez, usadas nas duas     */
/* larguras e nas duas edições.                                                */
/* ========================================================================== */

const SONDA_ALVOS = () => {
  const areaEfetiva = (el) => {
    const r = el.getBoundingClientRect();
    let x1 = r.left;
    let y1 = r.top;
    let x2 = r.right;
    let y2 = r.bottom;
    const cs = getComputedStyle(el, '::after');
    if (cs && cs.content !== 'none' && cs.position === 'absolute') {
      const W = Math.max(parseFloat(cs.width) || 0, parseFloat(cs.minWidth) || 0);
      const H = Math.max(parseFloat(cs.height) || 0, parseFloat(cs.minHeight) || 0);
      if (W > 0 && H > 0) {
        const cx = (r.left + r.right) / 2;
        const cy = (r.top + r.bottom) / 2;
        x1 = Math.min(x1, cx - W / 2);
        x2 = Math.max(x2, cx + W / 2);
        y1 = Math.min(y1, cy - H / 2);
        y2 = Math.max(y2, cy + H / 2);
      }
    }
    return { x: x1, y: y1 + scrollY, w: x2 - x1, h: y2 - y1 };
  };
  /* -------------------------------------------------------------------------
     UMA GAVETA FECHADA É O NAVEGADOR A ESCONDER (01.09.2026)
     -------------------------------------------------------------------------
     Um `<details>` fechado esconde o que tem dentro com `content-visibility:
     hidden`: o conteúdo não se vê, não recebe o foco e não está na árvore de
     acessibilidade. MEDIDO neste Chromium, e é o que obriga esta linha:
     `getBoundingClientRect()` sobre um descendente de uma gaveta fechada devolve
     na mesma uma caixa, com coordenadas de um arranjo que não está no ecrã. Sem
     este teste, os 308 resultados da busca, que vivem numa gaveta fechada desde
     a afinação 1 do brief da forma dos domínios, entravam nesta medição como
     alvos e davam dezenas de pares sobrepostos que ninguém pode tocar.
     `checkVisibility` é a pergunta certa e é a do navegador; a caixa fica como
     defeito para os motores que não a tenham.
     ------------------------------------------------------------------------- */
  const seVe = (el) =>
    typeof el.checkVisibility === 'function'
      ? el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
      : true;
  const seletor = 'a[href], button, input, select, textarea, summary, [role="button"]';
  const alvos = [];
  /* Os elementos, na mesma ordem de `alvos`, para as perguntas que só se fazem
     dentro da página: um nó do DOM não atravessa a serialização de `evaluate`. */
  const nos = [];
  for (const el of document.querySelectorAll(seletor)) {
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    if (!seVe(el)) continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const a = areaEfetiva(el);
    nos.push(el);
    alvos.push({
      nome:
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
          : ''),
      txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 26),
      naMobilia: !!el.closest('header'),
      noMain: !!el.closest('main'),
      /* O DESENHO DO MAPA É OUTRO OBJECTO, E MEDE-SE COM OUTRA RÉGUA (I82,
         27.08.2026). Uma área da Carta é uma forma côncava dentro de um
         rectângulo, e a sua caixa não é o seu alvo: a medição cega M3 achou que
         o centro da caixa da Ilha da Madeira cai FORA da Ilha da Madeira, e a
         casa decidiu que o alvo de uma área é o maior quadrado inscrito à volta
         do seu ponto representativo. É `tests/inicio/mapa-distritos.mjs` M1 e M2
         que o medem, e a rede da Emenda 20c — a lista dos nomes por baixo do
         mapa, com 44 px de altura cada — que responde por quem não chega.

         As caixas das áreas também se sobrepõem por natureza: a caixa de um
         distrito de costa contém as dos vizinhos, e isso não é uma porta em cima
         de outra, é o desenho de um território. Marcam-se aqui, e a célula A10
         deixa-as de fora do juízo com a razão escrita. */
      noMapa: !!el.closest('[data-areas]'),
      w: +a.w.toFixed(1),
      h: +a.h.toFixed(1),
      x1: a.x,
      x2: a.x + a.w,
      y1: a.y,
      y2: a.y + a.h,
    });
  }
  /* Os pares que se sobrepõem: a regra da casa é que uma área sobreposta não é
     um alvo maior, é uma porta que abre a linha do vizinho.

     UMA ÁREA DENTRO DE OUTRA, COM A DE DENTRO A GANHAR O TOQUE, NÃO É ESSE CASO
     (01.09.2026). O cartão da faixa é uma porta que cobre o cartão inteiro, e os
     selos ficam por cima dela: o selo está inteiramente DENTRO da porta, e quem
     apanha o dedo é o selo, porque está pintado acima. O defeito que esta lista
     existe para apanhar é outro, e a razão dela di-lo: «a de baixo, que vem
     depois no documento, apanha o clique da de cima», ou seja duas áreas que se
     cruzam em parte, no mesmo degrau, sem nada que decida qual delas responde.

     A EXCEPÇÃO NÃO SE AFIRMA, MEDE-SE. Um par só sai da lista quando as duas
     condições se verificam ao mesmo tempo: uma das caixas contém a outra por
     inteiro, e `document.elementFromPoint` no centro da caixa de dentro devolve
     a de dentro. Um selo por baixo da porta não passa por aqui: a segunda
     condição responde «a porta», e o par fica. É a mesma pergunta que
     `tests/inicio/faixa.mjs` F3 faz aos 21 cartões, feita aqui sobre a página
     inteira. */
  const contem = (a, b) =>
    a.x1 <= b.x1 + 0.5 && a.y1 <= b.y1 + 0.5 && a.x2 >= b.x2 - 0.5 && a.y2 >= b.y2 - 0.5;
  const ganhaOToque = (i) => {
    /* O ALVO É TRAZIDO À VISTA ANTES DE SE PERGUNTAR. `elementFromPoint` lê
       coordenadas do ECRÃ, e a faixa da cabeça corre de lado: os cartões a
       seguir ao primeiro estão fora da parte visível dela, e perguntar por eles
       sem os trazer devolveria o que estiver naquele ponto, que é outra coisa.
       O rolamento acontece DEPOIS de as caixas de todos os alvos estarem lidas,
       e cada pergunta relê a caixa do seu alvo: a lista dos pares vem de um
       retrato coerente, e cada resposta é coerente consigo mesma. */
    nos[i].scrollIntoView({ block: 'nearest', inline: 'center' });
    const r = nos[i].getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) return false;
    const em = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!em && em.closest('a[href], button, [role="button"]') === nos[i];
  };
  const pares = [];
  for (let i = 0; i < alvos.length; i++) {
    for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i];
      const b = alvos[j];
      /* Um par em que entra uma área do mapa não é um par de portas sobrepostas:
         ver a nota de `noMapa`, acima. */
      if (a.noMapa || b.noMapa) continue;
      const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
      const oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
      if (!(ox > 0.5 && oy > 0.5)) continue;
      /* A excepção medida: um dentro do outro, e o de dentro a ganhar o toque. */
      if (contem(a, b) && ganhaOToque(j)) continue;
      if (contem(b, a) && ganhaOToque(i)) continue;
      pares.push(`${a.nome}«${a.txt}» × ${b.nome}«${b.txt}»`);
    }
  }
  return { alvos, pares };
};

const SONDA_TEXTO = () => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length) continue;
    if (el.matches('script, style, template')) continue;
    if (el.closest('[hidden]') || el.closest('.vh')) continue;
    if (!(el.textContent || '').replace(/\s+/g, ' ').trim()) continue;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 12) {
      out.push(
        `${px}px ${el.tagName.toLowerCase()}.${
          typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : ''
        } «${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24)}»`,
      );
    }
  }
  return out;
};

/**
 * As bandas de cor uniforme, medidas nos pixéis da captura de página inteira.
 * Devolve, por banda, o topo, a altura, se ela cai dentro de `<main>` e se ela
 * toca a caixa do desenho do mapa.
 *
 * ---------------------------------------------------------------------------
 * A CAIXA DO MAPA MEDE-SE E IMPRIME-SE, E NÃO ENTRA NO JUÍZO (Emenda 20c)
 * ---------------------------------------------------------------------------
 * É a mesma decisão, e as mesmas palavras, que a cabeça deste ficheiro já
 * escreve para a mobília e para o pé: «ficam medidas e impressas ao lado, sem
 * entrar no juízo, para que a decisão de as mudar seja de quem tem de a tomar».
 *
 * A razão é que o detetor conta corridas de linhas de UMA cor, e um mapa é uma
 * forma dentro de um rectângulo: o mar a norte de Portugal, dentro do `viewBox`,
 * é uma corrida de linhas de uma cor com tinta acima e abaixo, e lê-se como uma
 * banda de composição sem o ser. A 390, com o mapa que a Emenda 20c pôs no
 * telemóvel, essa corrida mede 58 px e é a maior da página; fora da caixa do
 * mapa, a maior banda de `<main>` mede 43 px, abaixo do limiar de 48.
 *
 * O que isto NÃO faz: dispensar a página do juízo onde o mapa não está. As 188
 * bandas de fora da caixa continuam todas medidas e julgadas, e o vazio que o
 * diretor fotografou a 25.08 — 97 px em y = 824 a 390 — cairia na mesma.
 */
async function bandas(paginaEmBranco, buf, limites) {
  const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
  return paginaEmBranco.evaluate(
    async ({ dataUrl, limites }) => {
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = dataUrl;
      });
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const W = c.width;
      const H = c.height;
      /* A guarda que o leitor-utilizador escreveu: acima de ~50 000px a tela
         aceita a imagem e desenha-a vazia, e a página inteira lê-se como uma
         banda só. Sem esta leitura, um zero seria um achado falso. */
      const telaVazia = H > 40000;
      const linhas = new Array(H);
      for (let y = 0; y < H; y++) {
        const o = y * W * 4;
        const r = d[o];
        const gg = d[o + 1];
        const b = d[o + 2];
        let uniforme = true;
        for (let x = 1; x < W; x++) {
          const q = o + x * 4;
          if (d[q] !== r || d[q + 1] !== gg || d[q + 2] !== b) {
            uniforme = false;
            break;
          }
        }
        linhas[y] = uniforme ? `${r},${gg},${b}` : null;
      }
      const out = [];
      let i = 0;
      while (i < H) {
        if (linhas[i] === null) {
          i++;
          continue;
        }
        let j = i;
        while (j < H && linhas[j] === linhas[i]) j++;
        /* Tinta acima e abaixo: é o «entre dois blocos de conteúdo». */
        let a = i - 1;
        while (a >= 0 && linhas[a] !== null) a--;
        let b2 = j;
        while (b2 < H && linhas[b2] !== null) b2++;
        if (a >= 0 && b2 < H) {
          out.push({
            y: i,
            alt: j - i,
            noMain: i >= limites.topo && j <= limites.fundo,
            /* Toca a caixa do desenho: basta cruzá-la, porque a corrida que
               entra no mapa começa no ar que o precede e é a mesma corrida. */
            noMapa:
              limites.mapaTopo !== null &&
              limites.mapaTopo !== undefined &&
              j > limites.mapaTopo &&
              i < limites.mapaFundo,
          });
        }
        i = j;
      }
      return { telaVazia, altura: H, bandas: out.sort((x, y) => y.alt - x.alt) };
    },
    { dataUrl, limites },
  );
}

/* ========================================================================== */
/* 390 · WebKit, iPhone 13, toque a sério                                      */
/* ========================================================================== */

const navMovel = await webkit.launch({ headless: true });

for (const edicao of ['pt', 'en']) {
  const rota = edicao === 'pt' ? '/' : '/en';
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  /* ---------------------------------------------------------------- A2 · o âmbito
     ---------------------------------------------------------------------------
     A CÉLULA MUDOU DE OBJECTO COM O BLOCO F1.1 (03.09.2026), e não foi desligada.
     Media «um comando com "País", "Região" e "Concelho", e nenhum destino de
     telemóvel à parte»: o item A2 das correções de 25.08 juntava num comando só
     as duas caras que o mesmo mecanismo tinha, a do telemóvel e a do computador.
     O comando saiu da página inteira no F1.1, com a palavra «Âmbito» que o
     nomeava (achado C6 e decisão 3.4 da auditoria de UX; o brief §1, item 6: «os
     dois comandos saem e o que fica é o menu e o cabeçalho»).

     O QUE O ITEM A2 PROTEGIA CONTINUA A MEDIR-SE, e é isso que esta célula
     passa a fazer: as quatro camadas do território alcançam-se de UM SÓ SÍTIO,
     que agora é o menu, e continua a não haver um segundo caminho só para o
     telemóvel. As quatro portas conferem-se pelo `href` e não pelo texto, porque
     o texto é a etiqueta e a porta é o destino. */
  const comando = await p.evaluate(() => {
    const menu = [...document.querySelectorAll('.nav-principal a')].map((a) =>
      a.getAttribute('href'),
    );
    return {
      menu,
      comandos: document.querySelectorAll('[data-comando]').length,
      moveis: document.querySelectorAll('.movel-destino, .movel-selo').length,
    };
  });
  const PORTAS_DO_AMBITO =
    edicao === 'pt'
      ? ['/municipios', '/regioes', '/distritos', '/areas']
      : ['/en/municipalities', '/en/regions', '/en/districts', '/en/areas'];
  const emFaltaNoMenu = PORTAS_DO_AMBITO.filter((h) => !comando.menu.includes(h));
  /* «REGIÃO» VOLTOU AO COMANDO, E VOLTOU COMO PORTA (Emenda 21b, 27.08.2026).
     Eram duas posições desde 25.08, quando a terceira saiu com a régua da
     convergência «até haver a página das regiões»; a página existe, e a posição
     voltou. O item A2 não muda: um comando SÓ, nas duas larguras, sem destinos de
     telemóvel à parte. O que muda é quantas posições ele tem e o que cada uma é.

     DUAS SÃO ESTADO E LEVAM PAPEL DE BOTÃO; a terceira é uma LIGAÇÃO para
     `/regioes` e não leva papel nenhum, porque uma ligação activa-se com Enter e
     um botão promete também o espaço. Exigir papel de botão às três era pedir a
     uma porta que se comportasse como um interruptor — é a mesma correcção que a
     célula 2i·5 da matriz levou no mesmo dia. */
  conta(
    `A2 · as quatro camadas do território no menu, um só caminho, e nenhum destino de telemóvel à parte · 390 ${edicao}`,
    emFaltaNoMenu.length === 0 && comando.comandos === 0 && comando.moveis === 0,
    `menu com ${comando.menu.length} porta(s)` +
      (emFaltaNoMenu.length ? ` · faltam ${emFaltaNoMenu.join(', ')}` : ' · as quatro lá estão') +
      ` · ${comando.comandos} linha(s) de comando na página (o F1.1 tirou-a)` +
      ` · ${comando.moveis} destino(s) do telemóvel`,
  );

  /* ---------------------------------------------------------------- A4 · o mapa */
  const mapa = await p.evaluate(() => {
    const svg = document.querySelector('.mapa-svg');
    const r = svg ? svg.getBoundingClientRect() : null;
    const pontos = [...document.querySelectorAll('circle.mun')].filter(
      (c) => c.getBoundingClientRect().width > 0,
    ).length;
    const pesquisa = document.querySelector('#pesquisa');
    const rp = pesquisa ? pesquisa.getBoundingClientRect() : null;
    const lede = document.querySelector('[data-cabeca]:not([hidden]) .cabeca-lede');
    const linha = document.querySelector('.mapa-linha');
    const rl = linha ? linha.getBoundingClientRect() : null;
    return {
      svg: r ? +r.width.toFixed(1) : null,
      pontos,
      pesquisaVisivel: !!rp && rp.width > 0 && !pesquisa.closest('[hidden]'),
      pesquisaDepoisDaLede: !!lede && !!rp && rp.top + scrollY > lede.getBoundingClientRect().top + scrollY,
      rotulo: document.querySelector('.pesquisa-rotulo')?.textContent.trim() ?? null,
      linhaVisivel: !!rl && rl.width > 0,
      distanciaDaLinha: rl && rp ? +(rl.top - rp.bottom).toFixed(1) : null,
    };
  });
  /* METADE DESTA CÉLULA FOI REVOGADA POR UMA EMENDA POSTERIOR, E DIZ-SE AQUI.
     O item A4 de 25.08 tirou o mapa do telemóvel, e a razão estava escrita na
     Emenda 18: era um mapa em que nada se tocava, com os 308 pontos a servirem de
     imagem da cobertura. A Emenda 20c reverteu-o com todas as letras — «o mapa
     rende-se também no telemóvel, ao contrário da forma provisória da Emenda 18:
     a razão daquela forma era um mapa em que nada se tocava; neste, cada distrito
     é alvo» —, e desde então esta célula exigia a ausência de uma coisa que a
     constituição manda estar lá.

     A METADE QUE FICA é a que o item A4 tem de seu e nenhuma emenda tocou: a
     pesquisa está à VISTA, em qualquer estado, logo por baixo da lede, porque é
     o caminho para um concelho no telemóvel. Junta-se-lhe o que a Emenda 20c pôs
     no lugar da metade revogada: o mapa rende-se e toma a largura da janela
     (I81), que é a decisão medida de 27.08. Os alvos das 29 áreas não se medem
     aqui — são `tests/inicio/mapa-distritos.mjs` M2, pela área inscrita. */
  conta(
    `A4 · REVOGADA em parte (Emenda 20c) · o mapa rende-se a 390 e a pesquisa fica à vista · 390 ${edicao}`,
    mapa.svg !== null &&
      mapa.svg >= 390 &&
      mapa.pontos === 0 &&
      mapa.pesquisaVisivel &&
      mapa.pesquisaDepoisDaLede &&
      mapa.linhaVisivel,
    `svg ${mapa.svg}px (a Emenda 20c manda rendê-lo; a 18 mandava-o fora) · ${mapa.pontos} ponto(s) com caixa, que é o que saiu com a Emenda 20a · pesquisa à vista ${mapa.pesquisaVisivel} · depois da lede ${mapa.pesquisaDepoisDaLede} · rótulo «${mapa.rotulo}» · linha dos 308 à vista ${mapa.linhaVisivel}, a ${mapa.distanciaDaLinha}px da pesquisa`,
  );

  /* --------------------------------------------- A1 · a busca sem gesto nenhum
     ---------------------------------------------------------------------------
     A CÉLULA MUDOU DE OBJECTO COM O BLOCO F1.1 (03.09.2026), e não foi desligada.
     Media «"Concelho" revela a pesquisa dentro do ecrã, com o foco no campo»: o
     item A1 das correções de 25.08 exigia que o comando pusesse a busca à vista
     sem a mandar procurar. O comando saiu, e a busca deixou de precisar de ser
     revelada: subiu para debaixo da manchete e está no primeiro ecrã sem gesto
     nenhum, que é mais do que a célula pedia (brief F1.1, item 3).

     A EXIGÊNCIA SOBE COM A FORMA: já não é «dentro do ecrã depois de um toque»,
     é «inteira dentro do ecrã do telemóvel pequeno, sem toque», e o campo tem de
     receber o foco pelo teclado, que era a segunda metade da célula antiga. O
     anúncio vivo deixou de ser exigido aqui porque nada muda de estado: um
     `aria-live` que anuncia a chegada de uma coisa que já estava na página é
     ruído, e a região continua a existir para o que a página ainda muda. */
  const a1 = await p.evaluate(() => {
    const el = document.querySelector('#pesquisa');
    const r = el.getBoundingClientRect();
    const campo = document.querySelector('#pesquisa-concelho');
    if (campo) campo.focus();
    return {
      topo: +r.top.toFixed(1),
      fundo: +r.bottom.toFixed(1),
      ecra: innerHeight,
      dentro: r.top >= 0 && r.bottom <= innerHeight,
      foco: document.activeElement ? document.activeElement.id || document.activeElement.tagName : null,
      forma: document.querySelectorAll('#pesquisa form[action]').length,
      endereco: location.search,
    };
  });
  conta(
    `A1 · a busca do concelho inteira no primeiro ecrã, sem gesto, e o campo recebe o foco · 390 ${edicao}`,
    a1.dentro && a1.foco === 'pesquisa-concelho' && a1.forma === 1,
    `topo ${a1.topo}, fundo ${a1.fundo} de ${a1.ecra} (dentro: ${a1.dentro}) · foco «${a1.foco}» · ${a1.forma} formulário(s) com destino · endereço «${a1.endereco}»`,
  );
  if (edicao === 'pt') medidas.a1 = a1;

  /* ------------------------------------------------------- A9 e A10, no estado de entrada */
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  const texto = await p.evaluate(SONDA_TEXTO);
  conta(
    `A9 · nenhum texto abaixo de 12px na rota home · 390 ${edicao}`,
    texto.length === 0,
    texto.length === 0 ? 'zero elementos com font-size < 12px' : texto.slice(0, 6).join(' · '),
  );

  const { alvos, pares } = await p.evaluate(SONDA_ALVOS);
  const pequenos = alvos.filter((a) => a.w < 44 || a.h < 44);
  /* As áreas do mapa saem do juízo e ficam contadas ao lado: a caixa de uma
     forma côncava não é o seu alvo, e quem o mede é `mapa-distritos.mjs` M1 e M2,
     pela área inscrita (I82). A nota inteira está em `SONDA_ALVOS`. */
  const pequenosNoCorpo = pequenos.filter((a) => !a.naMobilia && !a.noMapa);
  const pequenosDoMapa = pequenos.filter((a) => a.noMapa);
  const selos = alvos.filter((a) => a.nome.startsWith('a.src-chip'));
  conta(
    `A10 · a área efetiva do selo já é 44px, e não se mexeu · 390 ${edicao}`,
    selos.length > 0 && selos.every((a) => a.w >= 44 && a.h >= 44),
    `${selos.length} selos · mínimo ${Math.min(...selos.map((a) => a.w)).toFixed(1)}×${Math.min(
      ...selos.map((a) => a.h),
    ).toFixed(1)} de área efetiva (a caixa do elemento mede 52×14)`,
  );
  conta(
    `A10 · zero alvos efetivos abaixo de 44px fora da mobília e do mapa, e zero áreas sobrepostas · 390 ${edicao}`,
    pequenosNoCorpo.length === 0 && pares.length === 0,
    `${alvos.length} alvos · ${pequenosNoCorpo.length} abaixo de 44 fora da mobília e do mapa · ${pares.length} pares sobrepostos${pares.length ? ` (${pares.slice(0, 3).join(' | ')})` : ''} · exceção medida na mobília: ${pequenos
      .filter((a) => a.naMobilia)
      .map((a) => `${a.nome} ${a.w}×${a.h}`)
      .join(', ') || 'nenhuma'} · medidas ao lado, no mapa: ${pequenosDoMapa.length} de ${alvos.filter((a) => a.noMapa).length} áreas abaixo de 44 pela caixa, que é a medida errada para uma forma côncava (I82; os alvos das 29 são mapa-distritos.mjs M1 e M2)`,
  );

  /* ------------------------------------------------------------------- A7 · a cabeça */
  const cabeca = await p.evaluate(() => {
    const h = document.querySelector('header').getBoundingClientRect();
    const h1 = document.querySelector('[data-cabeca]:not([hidden]) h1');
    const temaNoMenu = document.querySelector('#nav-principal .tema-no-menu');
    const temaNaMobilia = document.querySelector('.masthead-furniture > .tema');
    return {
      cabecaAlt: +h.height.toFixed(1),
      manchete: h1 ? +h1.getBoundingClientRect().top.toFixed(1) : null,
      ecra: innerHeight,
      temaNoMenu: !!temaNoMenu,
      temaNaMobiliaVisivel: !!temaNaMobilia && temaNaMobilia.getBoundingClientRect().width > 0,
      leituras: [...document.querySelectorAll('.masthead-furniture .mob-leitura')].length,
      /* AS LEITURAS VISÍVEIS, E NÃO AS DO DOCUMENTO (F1.1, item 10, 03.09.2026).
         A mobília tem três leituras desde o bloco do corredor (01.09.2026) e a
         célula exigia duas: estava vermelha desde esse dia, e a leitura de
         partida deste bloco mediu-a vermelha na árvore de origem. O achado D6 de
         25.08 pede a mobília numa linha no telemóvel, e a folha passa a mostrar
         ali UMA das três; as outras duas voltam a partir de 641 px, com as
         mesmas cadeias e as mesmas portas, e nenhuma sai do documento. A célula
         mede as duas coisas: quantas o documento tem, e quantas o ecrã pequeno
         mostra. */
      leiturasVisiveis: [...document.querySelectorAll('.masthead-furniture .mob-leitura')].filter(
        (e) => e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }),
      ).length,
      marcaLinhas: (() => {
        const m = document.querySelector('.wordmark');
        if (!m) return null;
        const r = m.getBoundingClientRect();
        const lh = parseFloat(getComputedStyle(m).lineHeight);
        return Math.round(r.height / lh);
      })(),
    };
  });
  const limiar40 = cabeca.ecra * 0.4;
  conta(
    `A7 · a cabeça e a manchete começam antes de 40% do ecrã · 390 ${edicao}`,
    cabeca.cabecaAlt < limiar40 &&
      cabeca.manchete !== null &&
      cabeca.manchete < limiar40 &&
      cabeca.leituras === 3 &&
      cabeca.leiturasVisiveis === 1 &&
      cabeca.marcaLinhas === 1 &&
      cabeca.temaNoMenu &&
      !cabeca.temaNaMobiliaVisivel,
    `cabeça ${cabeca.cabecaAlt}px · manchete a ${cabeca.manchete}px · 40% = ${limiar40.toFixed(
      1,
    )}px · marca em ${cabeca.marcaLinhas} linha(s) · ${cabeca.leituras} leituras no documento, ${cabeca.leiturasVisiveis} à vista · tema dentro do menu ${cabeca.temaNoMenu}, fora da mobília ${!cabeca.temaNaMobiliaVisivel}`,
  );
  if (edicao === 'pt') medidas.cabeca390 = cabeca;

  /* ------------------------------------------------------------------ A11 · a identidade */
  const identidade = await p.evaluate(() => {
    const els = [...document.querySelectorAll('.masthead-identidade')];
    return {
      n: els.length,
      texto: els[0] ? els[0].textContent.trim() : null,
      familia: els[0] ? getComputedStyle(els[0]).fontFamily.split(',')[0].replace(/["']/g, '') : null,
      corpo: els[0] ? getComputedStyle(els[0]).fontSize : null,
      linhas: els[0]
        ? Math.round(
            els[0].getBoundingClientRect().height / parseFloat(getComputedStyle(els[0]).lineHeight),
          )
        : null,
      ligacoes: els[0] ? els[0].querySelectorAll('a').length : null,
      algarismos: els[0] ? /\d/.test(els[0].textContent) : null,
    };
  });
  /* A FRASE CRESCEU E A CÉLULA MUDA COM ELA (bloco F1.10, 04.09.2026). A frase
     de identidade passou a ser a frase de DEFINIÇÃO do sítio, por decisão do
     lugar de direção (`DECISIONS.md` §1.98, segunda emenda, item 3): diz as três
     maneiras de ler o sítio e a origem de cada número. O que a célula media
     continua a valer todo — uma vez, na letra da prosa, sem porta, sem algarismo
     — menos a contagem de linhas: uma frase de dezasseis palavras não cabe numa
     linha a 390 px, e exigir que coubesse era exigir que a frase não mudasse. Em
     vez do «uma linha» fica um TECTO medido, que é o que a composição promete:
     não mais de três linhas a 390 px. */
  const esperada =
    edicao === 'pt'
      ? 'Um observatório de Portugal: cada número com a sua fonte, lido por território, por domínio e em estudos.'
      : 'An observatory of Portugal: every number with its source, read by territory, by domain and in studies.';
  conta(
    `A11 · a frase de definição, uma vez, na letra da prosa e sem porta · 390 ${edicao}`,
    identidade.n === 1 &&
      identidade.texto === esperada &&
      identidade.linhas !== null &&
      identidade.linhas <= 3 &&
      identidade.ligacoes === 0 &&
      identidade.algarismos === false,
    `«${identidade.texto}» · ${identidade.n} ocorrência(s) · ${identidade.familia} ${identidade.corpo} · ${identidade.linhas} linha · ${identidade.ligacoes} ligações · algarismos ${identidade.algarismos}`,
  );

  /* ------------------------------------------------------------------- A8 · o vazio */
  const limites = await p.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    /* A caixa do desenho do mapa, quando a página tem um: ver a nota de
       `bandas()`. Numa página sem mapa vem `null` e nada é dispensado. */
    const f = document.querySelector('[data-mapa-raiz]');
    const b = f ? f.getBoundingClientRect() : null;
    return {
      topo: Math.round(m.top + scrollY),
      fundo: Math.round(m.bottom + scrollY),
      mapaTopo: b ? Math.round(b.top + scrollY) : null,
      mapaFundo: b ? Math.round(b.bottom + scrollY) : null,
    };
  });
  const buf = await p.screenshot({ fullPage: true, type: 'png' });
  const branco = await ctx.newPage();
  await branco.goto('about:blank');
  const b390 = await bandas(branco, buf, limites);
  const noMain390 = b390.bandas.filter((x) => x.noMain && !x.noMapa);
  const noMapa390 = b390.bandas.filter((x) => x.noMain && x.noMapa);
  const foraDoMain390 = b390.bandas.filter((x) => !x.noMain && x.alt > 48);
  conta(
    `A8 · nenhuma banda de cor uniforme acima de 48px dentro do <main>, fora do desenho do mapa · 390 ${edicao}`,
    !b390.telaVazia && noMain390.length > 0 && noMain390[0].alt <= 48,
    `maior banda no main: ${noMain390[0]?.alt ?? 0}px em y=${noMain390[0]?.y ?? '—'} (era 97px em y=824) · ${
      noMain390.length
    } bandas julgadas · dentro da caixa do mapa, medida e não julgada (o mar dentro do viewBox): ${
      noMapa390.slice(0, 2).map((x) => `${x.alt}px@${x.y}`).join(', ') || 'nenhuma'
    } · fora do main, na composição da mobília e do pé: ${
      foraDoMain390.map((x) => `${x.alt}px@${x.y}`).join(', ') || 'nenhuma'
    } · página ${b390.altura}px`,
  );
  if (edicao === 'pt') medidas.bandas390 = { noMain: noMain390.slice(0, 4), fora: foraDoMain390 };

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    const p2 = await ctx2.newPage();
    await p2.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-390-${edicao}-cima.jpg`),
      type: 'jpeg',
      quality: 72,
    });
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-390-${edicao}-inteira.jpg`),
      type: 'jpeg',
      quality: 72,
      fullPage: true,
    });
    await ctx2.close();
  }

  await ctx.close();
}
await navMovel.close();

/* ========================================================================== */
/* 1280 · Chromium, rato e teclado                                             */
/* ========================================================================== */

const navMesa = await chromium.launch({ headless: true });

for (const edicao of ['pt', 'en']) {
  const rota = edicao === 'pt' ? '/' : '/en';
  const destino = edicao === 'pt' ? '/municipios/evora' : '/en/municipalities/evora';
  const ctx = await navMesa.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  /* ------------------------------------- A5 · as portas do mapa da primeira página
   *
   * A CÉLULA MUDA DE OBJECTO E NÃO DE REGRA (Emenda 20a, 27.08.2026; ISSUES I86).
   *
   * O item A5 do bloco de 25.08 é uma regra sobre a NAVEGAÇÃO do mapa da
   * primeira página: o que tem página é uma porta com nome, o que não tem não é
   * porta nenhuma, e a neutralidade da Emenda 10 fica inteira. A célula media-a
   * nos 308 pontos, porque eram eles o mapa; a Emenda 20a pôs no lugar deles as
   * 29 unidades da Carta como áreas, e os pontos saíram de `/`. A célula procurava
   * `circle.mun` e `.mun-porta`, encontrava zero, e falhava sem que nada estivesse
   * mal na página: media um objecto que já não existe.
   *
   * A REGRA CONTINUA A APLICAR-SE, e aplica-se à mesma superfície: `/`. O que
   * mudou foi o glifo. A célula passa a medi-la nas 29 áreas — cada uma dentro de
   * uma `<a>` da família de endereços daquela edição, com nome acessível e cursor
   * de ponteiro, e nenhuma área fora de uma porta.
   *
   * A METADE «SEM PÁGINA» DA REGRA DEIXOU DE SEPARAR ALGUMA COISA, e diz-se aqui
   * em vez de se fingir que ainda se mede: as 29 unidades têm todas página, como
   * os 308 concelhos têm todos página desde 26.08. É a regra do item E8 (uma
   * palavra de estado só diz alguma coisa se houver outro estado), aplicada a uma
   * régua: a célula conta as áreas que ficam fora de uma porta, que é o que
   * continua a poder acontecer, e não pede um estado que a cobertura já não tem.
   *
   * O QUE NÃO SE MEDE AQUI, E ONDE SE MEDE: a neutralidade do desenho (um só
   * traço, um só enchimento, e o contorno como única mudança ao passar o rato ou
   * ao chegar pelo teclado) é `tests/inicio/mapa-distritos.mjs` M5; a contagem das
   * 29 ligações é a regra R4 de `npm run check:mapa`, que corre na construção.
   * Repeti-las aqui era a mesma conta em três sítios.
   */
  const familiaDoDistrito = edicao === 'pt' ? '/distritos/' : '/en/districts/';
  const a5 = await p.evaluate((familia) => {
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    const portas = [...document.querySelectorAll('[data-areas] a.uni-porta')];
    const nomes = portas.map((a) => (a.querySelector('title')?.textContent ?? '').trim());
    const destinos = portas.map((a) => a.getAttribute('href'));
    const padrao = new RegExp('^' + familia + '[a-z0-9-]+$');
    return {
      areas: areas.length,
      portas: portas.length,
      foraDePorta: areas.filter((a) => !a.closest('a')).length,
      semNome: nomes.filter((n) => !n).length,
      forasteiros: destinos.filter((h) => !padrao.test(String(h))).length,
      primeiro: destinos[0] ?? null,
      primeiroNome: nomes[0] ?? null,
      cursorDaPorta: portas[0] ? getComputedStyle(portas[0]).cursor : null,
    };
  }, familiaDoDistrito);
  conta(
    `A5 · uma unidade com página é uma porta com nome, e nenhuma área fica fora de uma porta · 1280 ${edicao}`,
    a5.areas > 0 &&
      a5.portas === a5.areas &&
      a5.foraDePorta === 0 &&
      a5.semNome === 0 &&
      a5.forasteiros === 0 &&
      a5.cursorDaPorta === 'pointer',
    `${a5.areas} áreas · ${a5.portas} portas, ${a5.foraDePorta} área(s) fora de uma porta · ${a5.semNome} sem nome acessível · ${a5.forasteiros} destino(s) fora de «${familiaDoDistrito}» · a primeira: «${a5.primeiroNome}» → ${a5.primeiro} · cursor ${a5.cursorDaPorta}`,
  );

  /* O teclado chega lá, e é a outra metade do item A5.
   *
   * MUDA O OBJECTO, PELA MESMA RAZÃO: era `.mun-porta`, o ponto do concelho, e é
   * `a.uni-porta`, a área da unidade. O que a célula mede é o que sempre mediu —
   * que a porta do mapa está na ORDEM DO DOCUMENTO e recebe foco, sem que ninguém
   * tenha de a ir procurar —, e mede-o nas duas edições.
   *
   * NÃO É A M6c DE `mapa-distritos.mjs`, e a diferença é dita para que ninguém a
   * apague por parecer repetida: aquela chama `focus()` numa área e carrega em
   * Enter, e o que prova é que a porta abre a página certa; esta conta em que
   * posição da fila de alvos focáveis a porta está, que é o que diz se o Tab lá
   * chega. Uma porta que abre e que ninguém alcança pelo teclado passa a primeira
   * e falha a segunda.
   */
  const tab = await p.evaluate(() => {
    const foco = [...document.querySelectorAll('a[href], button, input, summary')].filter(
      (e) => !e.closest('[hidden]'),
    );
    const porta = document.querySelector('[data-areas] a.uni-porta');
    return { indice: porta ? foco.indexOf(porta) : -1, total: foco.length };
  });
  /* A porta pode não existir — é isso que um estrago plantado faz —, e a régua
     tem de dizer o que mediu em vez de rebentar. */
  const focado = await p.evaluate(() => {
    const porta = document.querySelector('[data-areas] a.uni-porta');
    if (!porta) return { classe: null, href: null, existe: false };
    porta.focus();
    return {
      classe: document.activeElement ? document.activeElement.getAttribute('class') : null,
      href: document.activeElement ? document.activeElement.getAttribute('href') : null,
      existe: true,
    };
  });
  conta(
    `A5 · o leitor de teclado chega à porta do mapa · 1280 ${edicao}`,
    tab.indice >= 0 &&
      focado.classe === 'uni-porta' &&
      /* O DESTINO É O DA PORTA QUE O FOCO APANHOU, e não um slug escrito à mão: a
         primeira porta do mapa é a da primeira unidade na ordem do artefacto, e
         qual é ela é do desenho. O que se mede é que ela é uma porta de unidade
         da edição certa. */
      new RegExp(`^${familiaDoDistrito}[a-z0-9-]+$`).test(String(focado.href)),
    `posição ${tab.indice} de ${tab.total} alvos focáveis · foco em «${focado.classe}» → ${focado.href}`,
  );

  /* ------------------------------- A6 · RETIRADA (Emenda 20a) · o nome ao passar o rato
   *
   * A célula media o achado C3, que era um separador em falta: a leitura do mapa
   * escrevia «Évoradistrito de Évora» num `[data-readout]` que se preenchia ao
   * passar o rato por um ponto, e a célula exigia lá as três partes — o nome, o
   * separador da casa e a etiqueta da Carta.
   *
   * O OBJECTO SAIU INTEIRO, e não mudou de sítio: com os 308 pontos saiu o
   * `[data-readout]` (Emenda 20a), e a etiqueta composta saiu com ele — a cadeia
   * `inicio.cabeca.distritoDe` não se rende em superfície nenhuma do sítio, e a
   * forma «nome · distrito de X» não existe em página nenhuma. O cartão
   * localizador de `/municipios/evora`, que é onde os 308 pontos foram viver
   * (Emenda 20d), é um `role="img"` sem portas e sem leitura: os pontos guardam o
   * nome e o distrito em `data-m` e `data-d`, e nada os compõe.
   *
   * NÃO HÁ SEPARADOR PARA PERDER ONDE NÃO HÁ COMPOSIÇÃO, e é isso que a célula
   * passa a medir, em vez de medir um objecto que não existe: o nome de uma área
   * do mapa é UMA cadeia transcrita da Carta, e as 29 têm-na. No dia em que uma
   * leitura composta voltar ao mapa, volta com ela uma célula da forma da antiga
   * — e volta para a superfície onde essa leitura viver.
   */
  const a6 = await p.evaluate(() => {
    const titulos = [...document.querySelectorAll('[data-areas] a.uni-porta title')].map((t) =>
      t.textContent.replace(/\s+/g, ' ').trim(),
    );
    return {
      readouts: document.querySelectorAll('[data-readout]').length,
      pontos: document.querySelectorAll('circle.mun').length,
      titulos: titulos.length,
      vazios: titulos.filter((t) => !t).length,
      compostos: titulos.filter((t) => t.includes('·')).length,
      exemplo: titulos[0] ?? null,
    };
  });
  conta(
    `A6 · RETIRADA (Emenda 20a) · o nome de uma área é uma cadeia da Carta, sem composição · 1280 ${edicao}`,
    a6.readouts === 0 &&
      a6.pontos === 0 &&
      a6.titulos > 0 &&
      a6.vazios === 0 &&
      a6.compostos === 0,
    `${a6.readouts} leituras e ${a6.pontos} pontos na primeira página · ${a6.titulos} nomes de área, ${a6.vazios} vazios, ${a6.compostos} compostos · o primeiro: «${a6.exemplo}»`,
  );

  /* ------------------------------------------------------------- C1 · o mapa não some */
  const c1 = await p.evaluate(async () => {
    const antes = getComputedStyle(document.querySelector('#mapa')).display;
    const estados = [];
    /* `?ambito=municipio:evora` SAIU DESTA LISTA (Emenda 19a, 26.08.2026). Era o
       quarto estado, e deixou de ser um estado: um endereço antigo com um
       concelho reencaminha para a página dele, e uma navegação a meio deste
       `evaluate` destruía o contexto de execução em vez de medir alguma coisa.
       O reencaminhamento é medido onde ele vive, em
       `tests/inicio/mapa-navegacao.mjs`; o que esta célula continua a medir é o
       que o achado C1 fechou, nos estados que ficaram. */
    /* `?ambito=regiao:algarve` SAIU DESTA LISTA (Emenda 21b, 27.08.2026), pela
       mesma razão que o concelho saiu a 26.08: deixou de ser um estado, e um
       endereço antigo com uma região reencaminha para a página dela — uma
       navegação a meio deste `evaluate` destrói o contexto de execução em vez de
       medir alguma coisa. Ficam os dois estados que a página tem. */
    for (const q of ['?ambito=municipio', '']) {
      history.pushState({}, '', location.pathname + q);
      window.dispatchEvent(new PopStateEvent('popstate'));
      await new Promise((r) => setTimeout(r, 60));
      const f = document.querySelector('#mapa');
      estados.push(`${q || '(defeito)'}: ${getComputedStyle(f).display}, hidden=${f.hidden}`);
    }
    return { antes, estados };
  });
  conta(
    `C1 · o mapa nunca desaparece ao mudar de estado · 1280 ${edicao}`,
    !c1.estados.some((e) => e.includes('display: none') || e.includes('hidden=true')),
    c1.estados.join(' · '),
  );

  /* --------------------------------------------------------- A3 · a régua saiu de `/` */
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const a3 = await p.evaluate(() => ({
    seccao: !!document.querySelector('#convergencia'),
    banda: !!document.querySelector('[data-instrumento="banda"]'),
    escala: document.querySelectorAll('[data-nonledger="escala-de-instrumento"]').length,
    portaDoTelemovel: !!document.querySelector('.conv-porta'),
  }));
  /* `dist/prova.json` é o ficheiro que o portão escreve no fim de um varrimento
     sem erros; as chaves estão em `.prova`, cada uma com o valor e a vista de
     onde ele a recontou. Contá-las aqui é a prova de que a régua saiu da página
     sem levar consigo nenhuma chave da prova. */
  const prova = JSON.parse(fs.readFileSync(path.join(DIST, 'prova.json'), 'utf8')).prova;
  conta(
    `A3 · a régua da convergência não se rende em / e as chaves da prova ficam · 1280 ${edicao}`,
    !a3.seccao && !a3.banda && !a3.portaDoTelemovel && Object.keys(prova).length >= 41,
    `#convergencia ${a3.seccao} · banda ${a3.banda} · porta do telemóvel ${a3.portaDoTelemovel} · ${
      Object.keys(prova).length
    } chaves da prova reconferidas pelo portão`,
  );

  /* ---------------------------------------------------------------- A8 · o vazio a 1280 */
  const limites = await p.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    /* A caixa do desenho do mapa, quando a página tem um: ver a nota de
       `bandas()`. Numa página sem mapa vem `null` e nada é dispensado. */
    const f = document.querySelector('[data-mapa-raiz]');
    const b = f ? f.getBoundingClientRect() : null;
    return {
      topo: Math.round(m.top + scrollY),
      fundo: Math.round(m.bottom + scrollY),
      mapaTopo: b ? Math.round(b.top + scrollY) : null,
      mapaFundo: b ? Math.round(b.bottom + scrollY) : null,
    };
  });
  const buf = await p.screenshot({ fullPage: true, type: 'png' });
  const branco = await ctx.newPage();
  await branco.goto('about:blank');
  const b1280 = await bandas(branco, buf, limites);
  /* A mesma dispensa do desenho do mapa que a 390, e pela mesma razão: a regra é
     uma só, e não uma excepção de telemóvel. */
  const noMain = b1280.bandas.filter((x) => x.noMain && !x.noMapa);
  const fora = b1280.bandas.filter((x) => !x.noMain && x.alt > 48);
  conta(
    `A8 · nenhuma banda de cor uniforme acima de 48px dentro do <main>, fora do desenho do mapa · 1280 ${edicao}`,
    !b1280.telaVazia && noMain.length > 0 && noMain[0].alt <= 48,
    `maior banda no main: ${noMain[0]?.alt ?? 0}px em y=${noMain[0]?.y ?? '—'} (era 125px em y=1043) · fora do main: ${
      fora.map((x) => `${x.alt}px@${x.y}`).join(', ') || 'nenhuma'
    } · página ${b1280.altura}px`,
  );
  if (edicao === 'pt') medidas.bandas1280 = { noMain: noMain.slice(0, 4), fora };

  /* A mesma medida na página do concelho, que é a segunda metade do item A8. */
  const pe = await ctx.newPage();
  await pe.goto(`${base}${destino}`, { waitUntil: 'networkidle' });
  await pe.evaluate(() => document.fonts.ready);
  const limitesE = await pe.evaluate(() => {
    const m = document.querySelector('main').getBoundingClientRect();
    /* A caixa do desenho do mapa, quando a página tem um: ver a nota de
       `bandas()`. Numa página sem mapa vem `null` e nada é dispensado. */
    const f = document.querySelector('[data-mapa-raiz]');
    const b = f ? f.getBoundingClientRect() : null;
    return {
      topo: Math.round(m.top + scrollY),
      fundo: Math.round(m.bottom + scrollY),
      mapaTopo: b ? Math.round(b.top + scrollY) : null,
      mapaFundo: b ? Math.round(b.bottom + scrollY) : null,
    };
  });
  /* «Quatro valores cortados pela margem inferior depois de uma área vazia»: os
     quatro são os primeiros do RELANCE do concelho, e o que se mede é se cabem
     no primeiro ecrã de 800 px e onde começa o primeiro.

     O RELANCE MUDOU DE FORMA A 01.09.2026, e por isso a fonte dos quatro muda
     com ele. A camada 1 do concelho era a primeira fila da grelha de peças; com
     o bloco «a cabeça nova como contentor» passou a ser a FAIXA de cartões, que
     fica entre a manchete e o resto da página, e as peças passaram a ser a
     leitura de cada medida por baixo dela. A célula continua a medir a mesma
     coisa — os quatro primeiros valores do relance dentro do primeiro ecrã —, e
     mede-a onde ela agora vive; se um dia não houver faixa, cai para as peças,
     que é onde a medida estava. Medido nesta construção: com as peças, o
     primeiro valor ficava a 744 px e só dois dos quatro cabiam; com a faixa fica
     a 496 e cabem os quatro. */
  const dobra = await pe.evaluate(() => {
    const daFaixa = [...document.querySelectorAll('[data-faixa] [data-cartao] .cartao-valor')];
    const vals = (daFaixa.length
      ? daFaixa
      : [...document.querySelectorAll('#relance .peca .peca-valor')]
    ).slice(0, 4);
    const c = daFaixa.length
      ? document.querySelector('[data-faixa] [data-cartao]')
      : document.querySelector('#relance .peca');
    const rc = c ? c.getBoundingClientRect() : null;
    return {
      onde: daFaixa.length ? 'faixa' : 'peças',
      valores: vals.length,
      dentro: vals.filter((v) => v.getBoundingClientRect().bottom <= innerHeight).length,
      primeiro: vals[0] ? +vals[0].getBoundingClientRect().top.toFixed(0) : null,
      cartao: rc ? +rc.top.toFixed(0) : null,
      pedDoCartao: rc ? +rc.bottom.toFixed(0) : null,
    };
  });
  const bufE = await pe.screenshot({ fullPage: true, type: 'png' });
  const bE = await bandas(branco, bufE, limitesE);
  const noMainE = bE.bandas.filter((x) => x.noMain && !x.noMapa);
  conta(
    `A8 · o mesmo no concelho, fora do desenho do cartão localizador, e os quatro valores dentro do primeiro ecrã · 1280 ${edicao}`,
    !bE.telaVazia &&
      noMainE.length > 0 &&
      noMainE[0].alt <= 48 &&
      dobra.valores === 4 &&
      dobra.dentro === 4,
    `maior banda no main: ${noMainE[0]?.alt ?? 0}px em y=${noMainE[0]?.y ?? '—'} (era 86px, o ar da secção) · ${
      dobra.dentro
    } de ${dobra.valores} valores do relance (na ${dobra.onde}) dentro dos 800px, o primeiro a ${
      dobra.primeiro
    }px (era 582 nas peças) · cartão ${dobra.cartao}..${dobra.pedDoCartao}px (era 545..908)`,
  );
  if (edicao === 'pt') medidas.evora1280 = { dobra, maiorBanda: noMainE[0] ?? null };

  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMesa.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const p2 = await ctx2.newPage();
    await p2.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-1280-${edicao}-cima.jpg`),
      type: 'jpeg',
      quality: 72,
    });
    await p2.screenshot({
      path: path.join(DIR_CAPTURAS, `depois-inicio-1280-${edicao}-inteira.jpg`),
      type: 'jpeg',
      quality: 72,
      fullPage: true,
    });
    await ctx2.close();
  }

  await ctx.close();
}
await navMesa.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  correções de UX · bloco A · ${reguas.length} réguas`));
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
