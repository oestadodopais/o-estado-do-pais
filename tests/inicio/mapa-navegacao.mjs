#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA EMENDA 19 · o mapa da primeira página é navegação
 * =============================================================================
 *
 * Uma régua por item do `design/especime-v3/briefs/BRIEF-mapa-navegacao.md` §3,
 * com a prova que o brief escreve para cada um. NÃO é um portão: não entra no
 * `npm run build` e não constrói nada. Corre sobre `dist/`, imprime uma linha por
 * régua e SAI COM 0 quando todas passam e com 1 quando alguma falha, como
 * `tests/inicio/correcoes-a.mjs` e ao contrário de `matriz.mjs`, que só imprime.
 * O código de saída é o que faz um estrago plantado ser visível (regra 14).
 *
 *   node tests/inicio/mapa-navegacao.mjs
 *   node tests/inicio/mapa-navegacao.mjs --json <ficheiro>
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA RÉGUA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * N1 · os endereços antigos. `?ambito=municipio:<slug>` era um estado
 * partilhável, e a Emenda 7 diz que o que era partilhável continua a abrir
 * alguma coisa. Mede-se o ENDEREÇO onde a página acaba, e não o que o script
 * escreveu: `location.replace` muda de página, e é isso que se lê.
 *
 * N2 · o mapa não cresce, e a roda é da página. As duas medem-se com números e
 * não com uma captura: a largura da tela nos dois estados, e o `scrollY` depois
 * de cinco entalhes da roda com o cursor DENTRO do mapa. A segunda parte da
 * prova é que nenhum nó do mapa tem `transform`, que é o que a lente escrevia.
 *
 * N3 · «Concelho» abre a pesquisa nas duas larguras. O que se mede é o que o
 * leitor recebe: o bloco da pesquisa dentro do ecrã, o foco no campo, o anúncio
 * na região viva e o endereço. E o que ele recebe sem script: duas ligações para
 * duas páginas que existem.
 *
 * N4 · o mapa é navegação. Clica-se no CENTRO do ponto, que é onde a mão vai:
 * um `<circle>` com `fill: none` só recebe eventos onde está pintado, e sem a
 * regra da folha o clique atravessava o miolo e não abria nada. Clica-se também
 * num ponto sem página, para provar que nada acontece, e conta-se quantos pontos
 * são ligação contra quantos o servidor declara com página.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

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

const nav = await chromium.launch({ headless: true });
async function pagina({ largura = 1280, js = true } = {}) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 800 },
    javaScriptEnabled: js,
  });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  return p;
}

/**
 * A COBERTURA LÊ-SE DO `dist/`, E NÃO SE ASSUME (bloco dos 308, P2).
 *
 * Cinco células desta régua estavam escritas contra o estado do dia em que
 * nasceram — um concelho com página e 307 sem —, e mediam Bragança como «o que
 * não tem página». Isso não é uma invariante da Emenda 19: é a cobertura de uma
 * tarde. O que a emenda fixa é a REGRA — um ponto com página é ligação, um ponto
 * sem página não responde a nada, e um endereço antigo abre a página quando ela
 * existe e o índice quando não existe —, e uma régua que meça a regra tem de
 * saber, primeiro, quem tem página. Sabe-o lendo as páginas construídas.
 */
const COM_PAGINA = fs.existsSync(path.join(DIST, 'municipios'))
  ? fs
      .readdirSync(path.join(DIST, 'municipios'))
      .filter((d) => fs.existsSync(path.join(DIST, 'municipios', d, 'index.html')))
  : [];
const TODOS_OS_PONTOS = [
  ...fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').matchAll(/data-caop="([^"]+)"/g),
].map((m) => m[1]);
const SEM_PAGINA = TODOS_OS_PONTOS.filter((slug) => !COM_PAGINA.includes(slug));
/** O nome de cada ponto, pela mesma ordem: é o que a leitura em voz alta diz. */
const NOMES_DOS_PONTOS = [
  ...fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').matchAll(/data-m="([^"]+)"/g),
].map((m) => m[1]);
/** Um concelho com página, e um sem — quando ainda há algum sem. */
const UM_COM_PAGINA = COM_PAGINA.includes('evora') ? 'evora' : COM_PAGINA[0];
const UM_SEM_PAGINA = SEM_PAGINA[0] ?? null;

/* As duas edições, com os destinos de cada uma: a régua mede as duas, porque o
   reencaminhamento lê o `href` que o servidor escreveu e esse muda com a rota. */
const EDICOES = [
  { edicao: 'pt', rota: '/', evora: '/municipios/evora', indice: '/municipios' },
  { edicao: 'en', rota: '/en', evora: '/en/municipalities/evora', indice: '/en/municipalities' },
];

/* ========================================================================== */
/* N1 · os estados `municipio:<slug>` saem do esquema                         */
/* ========================================================================== */

for (const { edicao, rota, evora, indice } of EDICOES) {
  const p = await pagina();
  const foi = async (q) => {
    await p.goto(`${base}${rota}${q}`, { waitUntil: 'networkidle' });
    /* O reencaminhamento é uma navegação, e uma navegação leva tempo: espera-se
       por ela em vez de se dormir um número inventado de milissegundos. */
    await p
      .waitForURL((u) => !u.search.includes('municipio%3A') && !u.search.includes('municipio:'), {
        timeout: 3000,
      })
      .catch(() => {});
    return p.evaluate(() => location.pathname + location.search);
  };
  const comPagina = await foi(`?ambito=municipio:${UM_COM_PAGINA}`);
  const semPagina = UM_SEM_PAGINA ? await foi(`?ambito=municipio:${UM_SEM_PAGINA}`) : null;
  const inexistente = await foi('?ambito=municipio:atlantida');
  const prefixoNu = await foi('?ambito=municipio:');
  const destinoComPagina =
    edicao === 'pt' ? `/municipios/${UM_COM_PAGINA}` : `/en/municipalities/${UM_COM_PAGINA}`;
  conta(
    `N1 · um endereço antigo abre a página do concelho, ou o índice dos 308 · ${edicao}`,
    comPagina === destinoComPagina &&
      (UM_SEM_PAGINA === null || semPagina === indice) &&
      inexistente === rota &&
      prefixoNu === rota,
    `municipio:${UM_COM_PAGINA} → «${comPagina}» · ` +
      (UM_SEM_PAGINA
        ? `municipio:${UM_SEM_PAGINA} (sem página) → «${semPagina}»`
        : `sem concelho sem página construído: os ${COM_PAGINA.length} têm-na`) +
      ` · um slug que não existe → «${inexistente}» · o prefixo nu → «${prefixoNu}»`,
  );
  if (edicao === 'pt') medidas.n1 = { comPagina, semPagina, inexistente, prefixoNu };
  await p.__ctx.close();
}

{
  const html = {
    pt: fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'),
    en: fs.readFileSync(path.join(DIST, 'en', 'index.html'), 'utf8'),
  };
  const MARCAS = [
    'data-cabeca="vazio"',
    'data-painel="vazio"',
    'data-slot',
    'data-escolher',
    'data-trocar',
    'data-fechar-mapa',
    'mapa-fechar',
    'data-alvos',
    'mun-alvo',
    'data-campo',
    'data-hint-escolher',
    'data-so-evora',
  ];
  const achadas = [];
  for (const [edicao, s] of Object.entries(html)) {
    for (const m of MARCAS) if (s.includes(m)) achadas.push(`${edicao}:${m}`);
  }
  conta(
    'N1 · a primeira página construída não tem uma marca da vista de escolha',
    achadas.length === 0,
    achadas.length === 0
      ? `nenhuma das ${MARCAS.length} marcas em nenhuma das duas edições: ${MARCAS.join(', ')}`
      : `ainda presentes: ${achadas.join(' · ')}`,
  );
}

/* ========================================================================== */
/* N2 · nem crescimento, nem lente, nem «fechar»                              */
/* ========================================================================== */

{
  const linhas = [];
  let bem = true;
  for (const largura of [1280, 1512, 2000]) {
    for (const { edicao, rota } of EDICOES) {
      const p = await pagina({ largura });
      const mede = async (q) => {
        await p.goto(`${base}${rota}${q}`, { waitUntil: 'networkidle' });
        return p.evaluate(() => {
          const t = document.querySelector('.mapa-tela').getBoundingClientRect();
          return {
            w: +t.width.toFixed(1),
            h: +t.height.toFixed(1),
            ambito: document.querySelector('[data-inicio]').getAttribute('data-ambito'),
            /* Nenhum nó do mapa pode ter uma transformação: era o que a lente
               escrevia, e é a marca que ela deixava. */
            transformados: [...document.querySelectorAll('[data-mapa] *')].filter((e) =>
              e.hasAttribute('transform'),
            ).length,
          };
        });
      };
      const pais = await mede('');
      const pesquisa = await mede('?ambito=municipio');
      const ok =
        Math.abs(pais.w - pesquisa.w) < 0.5 &&
        Math.abs(pais.h - pesquisa.h) < 0.5 &&
        pesquisa.ambito === 'municipio' &&
        pais.transformados === 0 &&
        pesquisa.transformados === 0;
      if (!ok) bem = false;
      linhas.push(
        `${largura} ${edicao}: país ${pais.w}×${pais.h} · pesquisa aberta ${pesquisa.w}×${pesquisa.h} (${pesquisa.ambito}) · nós com transform ${pais.transformados}/${pesquisa.transformados}`,
      );
      if (largura === 1280 && edicao === 'pt') medidas.n2Tamanho = { pais, pesquisa };
      await p.__ctx.close();
    }
  }
  conta(
    'N2 · o mapa mede o mesmo no país e com a pesquisa aberta, em três larguras',
    bem,
    linhas.join(' · '),
  );
}

{
  const linhas = [];
  let bem = true;
  for (const q of ['', '?ambito=municipio']) {
    const p = await pagina({ largura: 1280 });
    await p.goto(`${base}/${q}`, { waitUntil: 'networkidle' });
    /* O cursor tem de estar DENTRO da caixa do mapa: era ali que a lente
       apanhava a roda, e uma medição com o cursor ao lado não media nada. */
    const sitio = await p.evaluate(() => {
      document.querySelector('.mapa-tela').scrollIntoView({ block: 'center' });
      const r = document.querySelector('.mapa-tela').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, dentro: r.height > 0 };
    });
    await p.mouse.move(sitio.x, sitio.y);
    const antes = await p.evaluate(() => window.scrollY);
    for (let i = 0; i < 5; i++) await p.mouse.wheel(0, 100);
    await p.waitForTimeout(150);
    const depois = await p.evaluate(() => window.scrollY);
    const t = await p.evaluate(
      () =>
        [...document.querySelectorAll('[data-mapa] *')].filter((e) => e.hasAttribute('transform'))
          .length,
    );
    const ok = sitio.dentro && depois > antes && t === 0;
    if (!ok) bem = false;
    linhas.push(
      `«/${q}»: o cursor no meio do mapa, cinco entalhes para baixo, scrollY ${antes} → ${depois}, ${t} nós com transform`,
    );
    if (q === '?ambito=municipio') medidas.n2Roda = { antes, depois, transformados: t };
    await p.__ctx.close();
  }
  conta('N2 · a roda do rato sobre o mapa rola a página, nos dois estados', bem, linhas.join(' · '));
}

/* ========================================================================== */
/* N3 · «Concelho» abre a pesquisa nas duas larguras                          */
/* ========================================================================== */

/* ---------------------------------------------------------------------------
 * A N3 MUDOU DE OBJECTO COM O F1.1 (03.09.2026), E NÃO FOI DESLIGADA
 * ---------------------------------------------------------------------------
 * Media «"Concelho" abre a pesquisa com o foco no campo, e "País" fecha-a»: a
 * busca vivia atrás de um comando, primeiro como bloco governado pelo estado do
 * endereço, depois (01.09) como gaveta ao lado do mapa. A fila do âmbito saiu da
 * página inteira com o bloco da porta da frente (achado C6 e decisão 3.4 da
 * auditoria de UX de 25.08; brief F1.1 §1, item 6), e a busca subiu para debaixo
 * da manchete como `<form>` com destino (itens 3 e 12).
 *
 * A EXIGÊNCIA SOBE COM A FORMA. Já não é «um toque revela a busca dentro do
 * ecrã»: é «a busca está à vista, dentro do ecrã, SEM GESTO NENHUM, nas duas
 * larguras», que é mais do que a célula pedia. O foco no campo continua a
 * medir-se, porque é a segunda metade da promessa antiga: o campo tem de ser
 * alcançável. O anúncio vivo deixa de ser exigido porque nada muda de estado.
 * ------------------------------------------------------------------------- */
for (const largura of [1280, 390]) {
  const linhas = [];
  let bem = true;
  for (const { edicao, rota } of EDICOES) {
    const p = await pagina({ largura });
    await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(200);
    const abriu = await p.evaluate(() => {
      const campo = document.querySelector('#pesquisa-concelho');
      if (campo) campo.focus();
      const bloco = document.querySelector('#pesquisa');
      const r = bloco.getBoundingClientRect();
      /* «À VISTA» PERGUNTA-SE AO NAVEGADOR, E NÃO À CAIXA (01.09.2026). Com a
         busca dentro de uma gaveta, `getBoundingClientRect()` devolve na mesma
         uma caixa quando a gaveta está fechada: o `<details>` esconde o
         conteúdo com `content-visibility: hidden`, e o que responde a «isto
         vê-se?» é `checkVisibility`. */
      const seVe = (el) =>
        typeof el.checkVisibility === 'function'
          ? el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
          : r.width > 0 && r.height > 0;
      return {
        visivel: seVe(bloco),
        dentro: r.top >= 0 && r.top < innerHeight,
        foco: document.activeElement ? document.activeElement.id : null,
        anuncio: (document.querySelector('[data-anuncio]')?.textContent ?? '').trim(),
        url: location.pathname + location.search,
        cabeca: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca'),
        /* A ÁREA DE LEITURA ENTROU NO LUGAR DO PAINEL (F1.1b, 04.09.2026): a
           grelha das treze peças saiu da primeira página e o que está por baixo
           da cabeça são dois blocos `[data-leituras]`, um por quadro. O que esta
           célula lê é «o corpo da página está lá», e lê-o na coisa que agora lá
           está; o seletor antigo devolvia `undefined` e a célula caía por uma
           razão que não é a dela. O primeiro bloco é o do Procedimento. */
        painel: document.querySelector('[data-leituras]')?.getAttribute('data-leituras'),
      };
    });
    const fechou = await p.evaluate(() => {
      const bloco = document.querySelector('#pesquisa');
      const r = bloco.getBoundingClientRect();
      const seVe = (el) =>
        typeof el.checkVisibility === 'function'
          ? el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
          : r.width > 0 && r.height > 0;
      return {
        url: location.pathname + location.search,
        /* A REGRA PASSOU A SER UMA SÓ NAS DUAS LARGURAS (01.09.2026). Dizia
           aqui: «abaixo de 640 a pesquisa fica À VISTA em qualquer estado (item
           A4), e acima de 640 só com a pesquisa aberta». A busca era um bloco
           que a folha mostrava pelo `data-modo` da raiz; com a afinação 1 do
           brief da forma dos domínios passou a ser uma gaveta ao lado do mapa,
           fechada a todas as larguras, e uma gaveta fecha-se em qualquer
           largura. O que o comando «País» faz é fechá-la, e é isso que se mede.
           O `<details>` continua a ser do navegador: o guião só troca `open`. */
        visivel: seVe(bloco),
        /* A GAVETA DA BUSCA DEIXOU DE EXISTIR (F1.1): a busca não está atrás de
           nada, e é isso que a célula passa a exigir. */
        gaveta: document.querySelector('[data-gaveta="busca"]')?.hasAttribute('open') ?? null,
        forma: document.querySelectorAll('#pesquisa form[action]').length,
      };
    });
    const ok =
      abriu.visivel &&
      abriu.dentro &&
      abriu.foco === 'pesquisa-concelho' &&
      abriu.url === rota &&
      abriu.cabeca === 'pais' &&
      abriu.painel === 'pdm' &&
      fechou.gaveta === null &&
      fechou.forma === 1;
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: «${abriu.url}» · pesquisa à vista ${abriu.visivel}, dentro do ecrã ${abriu.dentro} · foco «${abriu.foco}» · cabeça ${abriu.cabeca}, painel ${abriu.painel} · gaveta da busca ${fechou.gaveta === null ? 'não existe' : fechou.gaveta} · ${fechou.forma} formulário(s) com destino`,
    );
    if (edicao === 'pt') medidas[`n3_${largura}`] = { abriu, fechou };
    await p.__ctx.close();
  }
  conta(
    `N3 · a busca do concelho à vista sem gesto, com o campo alcançável e o formulário com destino · ${largura}`,
    bem,
    linhas.join(' · '),
  );
}

{
  const linhas = [];
  let bem = true;
  for (const { edicao, rota, indice } of EDICOES) {
    const p = await pagina({ js: false });
    await p.goto(`${base}${rota}`, { waitUntil: 'load' });
    /* SEM GUIÃO, O QUE LEVA A ALGUM LADO É O FORMULÁRIO (F1.1, item 12).
       Eram os comandos do âmbito, que sem guião continuavam a ser ligações para
       páginas que existiam; o comando saiu, e o que fica a fazer a mesma
       promessa é a busca, que passou a ser um `<form action method="get">` para
       o índice dos 308. A célula mede a mesma coisa: que a primeira página, sem
       guião nenhum, tem um caminho para o concelho e que esse caminho existe. */
    const forma = await p.evaluate(() => {
      const f = document.querySelector('#pesquisa form');
      const menu = [...document.querySelectorAll('.nav-principal a[href]')].map((a) =>
        a.getAttribute('href'),
      );
      return {
        etiqueta: f ? f.tagName.toLowerCase() : null,
        action: f ? f.getAttribute('action') : null,
        method: f ? (f.getAttribute('method') || '').toLowerCase() : null,
        campo: !!document.querySelector('#pesquisa [data-pesquisa]'),
        menu,
      };
    });
    const r = await fetch(`${base}${forma.action ?? '/nao-existe'}`);
    const ok =
      forma.etiqueta === 'form' &&
      forma.action === indice &&
      forma.method === 'get' &&
      forma.campo &&
      r.status === 200 &&
      forma.menu.includes(indice);
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: <${forma.etiqueta}> action «${forma.action}» method «${forma.method}» (${r.status}) · campo ${forma.campo} · o índice também está no menu: ${forma.menu.includes(indice)}`,
    );
    await p.__ctx.close();
  }
  conta(
    'N3 · sem script a busca é um formulário com destino, e o destino existe',
    bem,
    linhas.join(' · '),
  );
}

/* ========================================================================== */
/* N4 · o mapa é navegação                                                    */
/* ========================================================================== */
/* ---------------------------------------------------------------------------
 * A N4 MEDE UM MAPA QUE A PRIMEIRA PÁGINA JÁ NÃO TEM (Emenda 20, 27.08.2026)
 * ---------------------------------------------------------------------------
 * Esta secção mede os 308 pontos da primeira página: o clique no meio de um
 * ponto, o nome que o rato lê, as setas que percorrem os vizinhos e o Home que
 * volta ao arranque. A Emenda 20 tirou os pontos da primeira página e pôs lá as
 * 29 unidades da Carta como áreas; o mapa de pontos continua a existir, no
 * cartão localizador da página do concelho, onde a Emenda 20d o deixou, e ali
 * não há ligação nenhuma nem leitura em voz alta.
 *
 * A SECÇÃO NÃO SE APAGA E NÃO SE FINGE PASSADA. Corre quando a primeira página
 * ainda tiver pontos, e quando não tiver regista uma régua que diz onde é que o
 * que ela media passou a ser medido: `tests/inicio/mapa-distritos.mjs`, células
 * M5 e M6. As N1, N2 e N3 continuam a medir o que medem, porque o que elas
 * medem não mudou: os endereços antigos, o mapa que não cresce e não toma a roda
 * do rato, e o comando «Concelho».
 *
 * Reescrevê-la para as áreas seria escrever a régua do mapa novo dentro da régua
 * do mapa velho, e essa régua já existe e tem os seus estragos plantados.
 * --------------------------------------------------------------------------- */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  var HA_PONTOS = await p.evaluate(
    () => document.querySelectorAll('[data-pontos] [data-caop]').length > 0,
  );
  await p.__ctx.close();
}

if (!HA_PONTOS) {
  conta(
    'N4 · retirada pela Emenda 20: a primeira página deixou de ter os 308 pontos',
    true,
    'o mapa da primeira página são as 29 unidades da Carta como áreas; o que esta secção media passou a ser medido em tests/inicio/mapa-distritos.mjs, células M5 e M6',
  );
} else {

/* N4 · o mapa é navegação                                                    */
/* ========================================================================== */

for (const { edicao, rota, evora } of EDICOES) {
  const p = await pagina();
  await p.goto(`${base}${rota}`, { waitUntil: 'networkidle' });

  const contagem = await p.evaluate(() => {
    const pontos = [...document.querySelectorAll('[data-pontos] [data-caop]')];
    return {
      total: pontos.length,
      declarados: pontos.filter((c) => c.getAttribute('data-pagina') === 'sim').length,
      ligacoes: pontos.filter((c) => c.closest('a[href]')).length,
      semPaginaEmLigacao: pontos.filter(
        (c) => c.getAttribute('data-pagina') !== 'sim' && c.closest('a[href]'),
      ).length,
      titulos: pontos.filter((c) => c.closest('a[href]')?.querySelector('title')).length,
    };
  });

  /* O clique no CENTRO do ponto, que é onde a mão vai. */
  const sitioDe = (slug) =>
    p.evaluate((s) => {
      const c = document.querySelector(`[data-pontos] [data-caop="${s}"]`);
      if (!c) return null;
      c.scrollIntoView({ block: 'center' });
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: +r.width.toFixed(2) };
    }, slug);

  /* O ponto SEM página só se mede onde ainda há algum: com os 308 construídos
     não há nenhum, e a metade negativa da célula fica sem objecto — o que se
     diz, em vez de se dar por passada. */
  let depoisDoSemPagina = null;
  if (UM_SEM_PAGINA) {
    const semPagina = await sitioDe(UM_SEM_PAGINA);
    await p.mouse.click(semPagina.x, semPagina.y);
    await p.waitForTimeout(300);
    depoisDoSemPagina = await p.evaluate(() => ({
      url: location.pathname + location.search,
      ambito: document.querySelector('[data-inicio]')?.getAttribute('data-ambito'),
    }));
  }

  const destino =
    edicao === 'pt' ? `/municipios/${UM_COM_PAGINA}` : `/en/municipalities/${UM_COM_PAGINA}`;
  const comPagina = await sitioDe(UM_COM_PAGINA);
  await p.mouse.click(comPagina.x, comPagina.y);
  await p.waitForURL(`**${destino}`, { timeout: 3000 }).catch(() => {});
  const depoisDoComPagina = await p.evaluate(() => location.pathname + location.search);

  conta(
    `N4 · o clique no meio de um ponto com página abre-a, e um sem página não faz nada · ${edicao}`,
    depoisDoComPagina === destino &&
      (depoisDoSemPagina === null ||
        (depoisDoSemPagina.url === rota && depoisDoSemPagina.ambito === 'pais')) &&
      contagem.total === 308 &&
      contagem.declarados === contagem.ligacoes &&
      contagem.semPaginaEmLigacao === 0 &&
      contagem.titulos === contagem.ligacoes,
    `${UM_COM_PAGINA} → «${depoisDoComPagina}» (alvo de ${comPagina.w}px) · ` +
      (depoisDoSemPagina
        ? `${UM_SEM_PAGINA} → «${depoisDoSemPagina.url}», âmbito ${depoisDoSemPagina.ambito}`
        : `sem ponto sem página: os ${COM_PAGINA.length} têm-na`) +
      ` · ${contagem.ligacoes} de ${contagem.total} pontos são ligação, ${contagem.declarados} declarados com página, ${contagem.titulos} com nome, ${contagem.semPaginaEmLigacao} sem página dentro de uma ligação`,
  );
  if (edicao === 'pt') medidas.n4 = { contagem, alvo: comPagina.w };
  await p.__ctx.close();
}

{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  /* O nome ao passar o rato, num ponto qualquer dos 308. */
  const sitio = await p.evaluate(() => {
    const c = document.querySelector('[data-pontos] [data-caop="braganca"]');
    c.scrollIntoView({ block: 'center' });
    const r = c.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, nome: c.getAttribute('data-m') };
  });
  await p.mouse.move(sitio.x - 30, sitio.y - 30);
  await p.mouse.move(sitio.x, sitio.y);
  await p.waitForTimeout(150);
  const rato = await p.evaluate(
    () => document.querySelector('[data-readout-nome]')?.textContent.trim() ?? '',
  );

  /* E O TECLADO. O foco no mapa começa no PRIMEIRO ponto com página, e o `Home`
     volta a ele: qual é esse ponto é cobertura, não regra, e a régua lê-o do
     `dist/` em vez de o escrever. O que ela mede é a regra: o foco arranca num
     ponto com página, a seta muda de ponto, o `Home` volta ao arranque, e o
     `Enter` abre a página do ponto onde está — e só abre onde há página. */
  const abreOPonto = (nome) => {
    const slug = TODOS_OS_PONTOS.find((sl, i) => NOMES_DOS_PONTOS[i] === nome);
    return slug && COM_PAGINA.includes(slug) ? `/municipios/${slug}` : '/';
  };
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.focus('[data-mapa-wrap]');
  const noArranque = await p.evaluate(
    () => document.querySelector('[data-readout-nome]')?.textContent.trim() ?? '',
  );
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(80);
  const depoisDaSeta = await p.evaluate(
    () => document.querySelector('[data-readout-nome]')?.textContent.trim() ?? '',
  );
  const alvoDaSeta = abreOPonto(depoisDaSeta);
  await p.keyboard.press('Enter');
  await p.waitForURL(`**${alvoDaSeta}`, { timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(300);
  const naSeta = await p.evaluate(() => location.pathname + location.search);

  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.focus('[data-mapa-wrap]');
  await p.keyboard.press('Home');
  await p.waitForTimeout(80);
  const noHome = await p.evaluate(
    () => document.querySelector('[data-readout-nome]')?.textContent.trim() ?? '',
  );
  const alvoDoHome = abreOPonto(noHome);
  await p.keyboard.press('Enter');
  await p.waitForURL(`**${alvoDoHome}`, { timeout: 3000 }).catch(() => {});
  const noInicio = await p.evaluate(() => location.pathname + location.search);

  conta(
    'N4 · o rato lê o nome, as setas percorrem, e o Enter abre só o ponto que tem página',
    rato === sitio.nome &&
      noArranque === noHome &&
      COM_PAGINA.includes(TODOS_OS_PONTOS[NOMES_DOS_PONTOS.indexOf(noArranque)]) &&
      depoisDaSeta.length > 0 &&
      depoisDaSeta !== noArranque &&
      naSeta === alvoDaSeta &&
      noInicio === alvoDoHome,
    `rato sobre Bragança lê «${rato}» · o foco no mapa lê «${noArranque}», a seta leva a «${depoisDaSeta}», e o Enter aí deixa o endereço em «${naSeta}» (esperado «${alvoDaSeta}») · Home volta a «${noHome}», e o Enter abre «${noInicio}» (esperado «${alvoDoHome}»)`,
  );
  medidas.n4Teclado = { rato, noArranque, depoisDaSeta, naSeta, noHome, noInicio };
  await p.__ctx.close();
}

}

/* --------------------------------------------------------------- o relatório */
await nav.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 2));
}

console.log('');
console.log(cinza(`  Emenda 19 · o mapa é navegação · ${reguas.length} réguas`));
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
