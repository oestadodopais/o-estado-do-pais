#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA PORTA DA FRENTE · o bloco F1.1 de 03.09.2026
 * =============================================================================
 *
 * Uma célula por medida de aceitação do `BRIEF-F1.1-porta-da-frente.md` §4, em
 * Chromium sem cabeça sobre `dist/` servido em local, e em leitura direta do
 * HTML construído onde a medida é uma contagem. NÃO é um portão: não entra no
 * `npm run build` nem no `npm run verify`, e não constrói nada. Imprime uma
 * linha por célula, sai a 0 quando todas passam e a 1 quando alguma falha, como
 * `tests/inicio/faixa.mjs` e `tests/inicio/lista.mjs`.
 *
 *   node tests/inicio/porta.mjs
 *   node tests/inicio/porta.mjs --json <ficheiro>
 *   node tests/inicio/porta.mjs --vermelhos
 *   OEDP_DIST=/caminho/para/outra/dist node tests/inicio/porta.mjs
 *
 * `OEDP_DIST` existe por uma razão do próprio bloco: as medidas de aceitação
 * exigem o valor de PARTIDA e o de CHEGADA, e o de partida mede-se na
 * construção da árvore de origem, que fica guardada noutra pasta. A régua é a
 * mesma nas duas leituras; o que muda é a pasta que ela lê, e o relatório diz
 * qual foi.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * A1 · O PRIMEIRO ECRÃ DO TELEMÓVEL PEQUENO (390 × 664), nas duas edições.
 * Cinco coisas dentro do primeiro ecrã, sem gesto: o nome da publicação, a
 * manchete INTEIRA (o fundo da caixa, e não o topo), o primeiro cartão INTEIRO,
 * o selo desse cartão e a porta do concelho. Mede-se a caixa de cada um contra
 * a altura da janela, com a página no cimo: `rect.bottom <= 664` e
 * `rect.top >= 0`. Uma coisa que começa dentro do ecrã e acaba fora não está
 * visível; é a diferença entre «vê-se» e «vê-se o princípio».
 *
 * A2 · A ALTURA DE `/` A 390. `document.documentElement.scrollHeight`, a mesma
 * definição de `tests/inicio/lista.mjs`. A célula não guarda um teto escrito:
 * o teto é o «hoje» medido na árvore de partida, e o relatório imprime os dois.
 * Aqui a célula só imprime o número; quem o compara é o relatório, que é onde a
 * comparação tem os dois lados.
 *
 * A3 · OS VINTE E UM VALORES UMA SÓ VEZ. Conta-se, no HTML construído das duas
 * edições, quantos elementos levam `data-claim="<id>"` para cada uma das 21
 * medidas dos dois quadros. A conta é sobre a MARCA e não sobre o texto do
 * valor: dois valores podem ser iguais por acaso (duas medidas a 6,0) e a marca
 * é a única coisa que diz de que linha é cada algarismo.
 *
 * A4 · «Comissão Europeia» EM `/` E «European Commission» EM `/en`. Contagem de
 * ocorrências, e não de linhas: o HTML construído é quase todo uma linha só, e
 * `grep -c` contaria 1 onde há dez.
 *
 * A5 · AS 29 UNIDADES COM NOME VISÍVEL E ALVO. Abaixo de 1024, cada uma das 29
 * unidades da Carta tem de ter um nome com caixa (visível, e não apenas
 * presente) e alvo de 44 × 44 px. A lista mede-se COMO ELA CHEGA AO LEITOR:
 * sem abrir gaveta nenhuma, porque o item 4 do brief manda a lista aberta.
 *
 * A6 · «Âmbito» E «Densidade» FORA DA PÁGINA. Contagem de ocorrências a 0 nas
 * duas edições, com as palavras de cada edição.
 *
 * A7 · AS DUAS LAGOAS COM DISTRITOS DISTINTOS. Nas fichas da busca de `/`,
 * as duas entradas cujo nome é «Lagoa» têm de trazer, cada uma, um texto
 * distinto do da outra. Não basta que exista um texto: dois textos iguais não
 * distinguem nada.
 *
 * A8 · A BUSCA COMO `<form>` COM DESTINO. Um `<form>` em `/`, com `action` para
 * um caminho que existe no `dist/` (pede-se ao servidor e espera-se 200) e com
 * `method="get"`, que é o que a torna uma busca e não uma escrita.
 *
 * A9 · ENCONTRAR O CONCELHO EM ≤ 2 TOQUES E ≤ 1 ECRÃ, a 390 × 664. O percurso
 * corre-se: toque 1 no campo, escreve-se o nome, toque 2 no resultado, e a
 * página que chega é a do concelho. Cada toque é um `click` a sério, e a régua
 * confere que o alvo do toque estava dentro do primeiro ecrã quando o toque
 * aconteceu.
 *
 * A10 · «sem limiar» FORA DOS CARTÕES. Contagem a 0 dentro dos cartões da faixa
 * e dentro das peças do painel de `/`, nas duas edições.
 *
 * A11 · A MOBÍLIA NUMA LINHA A 390. Do topo do documento ao topo do nome da
 * publicação: 64 px, que é o teto do brief.
 *
 * A12 · REGIÕES, DISTRITOS E ÁREAS NO MENU, nas duas edições. Procura-se pelo
 * `href` das rotas e não pelo texto: o texto é a etiqueta e pode mudar de
 * palavra sem que a porta mude de sítio.
 *
 * ---------------------------------------------------------------------------
 * O QUE `--vermelhos` EXIGE DE CADA ESTRAGO
 * ---------------------------------------------------------------------------
 * Três coisas, e não uma, como em `faixa.mjs` e em `lista.mjs`. **Verde antes**:
 * as células que o estrago nomeia passam sem ele, porque uma célula que já
 * estava vermelha não prova nada. **O HTML mudou**: a transformação dá bytes
 * diferentes, porque um estrago que não muda nada nunca podia ser apanhado.
 * **Vermelho depois**: TODAS as células nomeadas caem, e não só uma. É a
 * exigência que a segunda passagem de `faixa.mjs` ganhou depois da leitura a
 * frio de 01.09.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST
  ? path.resolve(process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');

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
const VERMELHOS = argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error(`não existe ${DIST}. Corra o build primeiro.`);
  process.exit(2);
}

/* O estrago plantado não toca em disco: é uma transformação do HTML no caminho
   entre o ficheiro e o navegador, como nas outras réguas da casa. */
let ESTRAGO = null;

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
  const tipo = MIME[path.extname(ficheiro)] ?? 'application/octet-stream';
  if (ESTRAGO && path.extname(ficheiro) === '.html') {
    const html = ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery);
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(html);
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

const nav = await chromium.launch({ headless: true });

async function pagina(rota, largura, altura = 844) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

/* O HTML como o servidor o entrega, com o estrago aplicado quando há um: é o
   mesmo texto que o navegador lê, e por isso as contagens e a geometria falam
   da mesma página. */
async function html(rota) {
  const r = await fetch(base + rota);
  return await r.text();
}

const ocorrencias = (texto, agulha) => texto.split(agulha).length - 1;

const ALTURA_PEQUENA = 664;
const ALVO_TOQUE = 44;
const TETO_DA_MOBILIA = 64;

const EDICOES = [
  {
    chave: 'pt',
    rota: '/',
    comissao: 'Comissão Europeia',
    casa: ['Âmbito', 'Densidade'],
    semLimiar: 'sem limiar',
    menu: ['/regioes', '/distritos', '/areas'],
    concelho: 'Évora',
    destinoDoConcelho: '/municipios/evora',
  },
  {
    chave: 'en',
    rota: '/en',
    comissao: 'European Commission',
    casa: ['Scope', 'Density'],
    semLimiar: 'no threshold',
    menu: ['/en/regions', '/en/districts', '/en/areas'],
    concelho: 'Évora',
    destinoDoConcelho: '/en/municipalities/evora',
  },
];

/* As 21 medidas dos dois quadros, lidas da própria fonte de dados do sítio e
   não de uma segunda lista escrita aqui: uma cópia da lista seria uma régua a
   medir o que ela própria escreveu. */
const { FIGURAS_PDM, FIGURAS_SOCIAL } = await import(
  path.join(RAIZ, 'src', 'data', 'figuras.mjs')
);
const AS_VINTE_E_UMA = [...FIGURAS_PDM, ...FIGURAS_SOCIAL].map((f) => f.claim);

/* ===========================================================================
 * A SONDA DO PRIMEIRO ECRÃ · corre dentro da página
 * ======================================================================== */
const SONDA_A1 = (alturaDoEcra) => {
  const cx = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return {
      topo: +r.top.toFixed(1),
      fundo: +r.bottom.toFixed(1),
      largura: +r.width.toFixed(1),
      altura: +r.height.toFixed(1),
    };
  };
  const cartao = document.querySelector('[data-faixa] .cartao');
  return {
    nome: cx(document.querySelector('.wordmark')),
    manchete: cx(document.querySelector('.cabeca-h1')),
    cartao: cx(cartao),
    selo: cx(cartao ? cartao.querySelector('.src-chip') : null),
    porta: cx(document.querySelector('[data-porta-concelho]')),
    ecra: alturaDoEcra,
    altura: document.documentElement.scrollHeight,
    mobilia: cx(document.querySelector('.wordmark'))
      ? +document.querySelector('.wordmark').getBoundingClientRect().top.toFixed(1)
      : null,
  };
};

async function corre() {
  celulas = [];
  medidas = {};

  for (const ed of EDICOES) {
    /* -------------------------------------------------------------- A1, A2, A11 */
    const p = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    const g = await p.evaluate(SONDA_A1, ALTURA_PEQUENA);
    medidas[`A1.${ed.chave}`] = g;

    const dentro = (c) => c !== null && c.topo >= 0 && c.fundo <= ALTURA_PEQUENA;
    const partes = { nome: g.nome, manchete: g.manchete, cartao: g.cartao, selo: g.selo, porta: g.porta };
    const falhas = Object.entries(partes)
      .filter(([, c]) => !dentro(c))
      .map(([k, c]) => (c === null ? `${k}: não existe` : `${k}: fundo ${c.fundo}`));
    conta(
      `A1.${ed.chave}`,
      falhas.length === 0,
      falhas.length === 0
        ? `390×${ALTURA_PEQUENA}: nome, manchete, cartão, selo e porta do concelho dentro do ecrã ` +
          `(fundo máximo ${Math.max(...Object.values(partes).map((c) => c.fundo)).toFixed(1)} px)`
        : `fora do primeiro ecrã: ${falhas.join('; ')}`,
    );

    medidas[`A2.${ed.chave}`] = g.altura;
    conta(`A2.${ed.chave}`, Number.isFinite(g.altura), `altura de ${ed.rota} a 390: ${g.altura} px`);

    medidas[`A11.${ed.chave}`] = g.mobilia;
    conta(
      `A11.${ed.chave}`,
      g.mobilia !== null && g.mobilia <= TETO_DA_MOBILIA,
      `mobília acima do nome a 390: ${g.mobilia} px (teto ${TETO_DA_MOBILIA})`,
    );

    /* ------------------------------------------------------------------- A5 */
    /* A VISIBILIDADE PERGUNTA-SE AO NAVEGADOR, E NÃO À CAIXA. Medido na árvore
       de partida: num Chromium 148 o conteúdo de um `<details>` FECHADO continua
       a ter caixa — `getBoundingClientRect()` devolve 54,1 × 44 nos 29 nomes de
       uma gaveta fechada —, porque a implementação nova esconde-o por
       `content-visibility` e não por `display`. Uma célula que contasse caixas
       dava verde com a lista fechada, que é exactamente o estado que este bloco
       veio abrir. `checkVisibility({ contentVisibilityAuto: true })` responde
       pelo que o leitor vê. */
    const nomes = await p.evaluate((alvo) => {
      const ls = [...document.querySelectorAll('[data-lista-porta]')];
      const caixas = ls.map((a) => {
        const r = a.getBoundingClientRect();
        return {
          slug: a.getAttribute('data-lista-porta'),
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          vis: a.checkVisibility({
            contentVisibilityAuto: true,
            opacityProperty: true,
            visibilityProperty: true,
          }),
        };
      });
      return {
        total: caixas.length,
        pequenos: caixas.filter((c) => !c.vis || c.w < alvo || c.h < alvo),
        invisiveis: caixas.filter((c) => !c.vis).length,
      };
    }, ALVO_TOQUE);
    medidas[`A5.${ed.chave}`] = nomes;
    conta(
      `A5.${ed.chave}`,
      nomes.total === 29 && nomes.pequenos.length === 0,
      `29 nomes com alvo ≥ ${ALVO_TOQUE} px a 390, sem gesto: ${nomes.total} nome(s), ` +
        `${nomes.invisiveis} invisível(eis), ${nomes.pequenos.length} abaixo do alvo ou escondido(s)` +
        (nomes.pequenos.length
          ? ` (${nomes.pequenos
              .slice(0, 3)
              .map((c) => `${c.slug} ${c.w}×${c.h}`)
              .join(', ')}…)`
          : ''),
    );
    await p.__ctx.close();

    /* -------------------------------------------------------- A3, A4, A6, A10 */
    const doc = await html(ed.rota === '/' ? '/index.html' : `${ed.rota}/index.html`);

    const repetidos = AS_VINTE_E_UMA.map((id) => ({
      id,
      n: ocorrencias(doc, `data-claim="${id}"`),
    })).filter((c) => c.n !== 1);
    medidas[`A3.${ed.chave}`] = {
      total: AS_VINTE_E_UMA.length,
      repetidos: repetidos.map((c) => `${c.id}×${c.n}`),
    };
    conta(
      `A3.${ed.chave}`,
      repetidos.length === 0,
      `os 21 valores selados uma só vez em ${ed.rota}: ${repetidos.length} fora da conta` +
        (repetidos.length ? ` (${repetidos.map((c) => `${c.id}×${c.n}`).join(', ')})` : ''),
    );

    const nComissao = ocorrencias(doc, ed.comissao);
    medidas[`A4.${ed.chave}`] = nComissao;
    conta(`A4.${ed.chave}`, nComissao >= 1, `«${ed.comissao}» em ${ed.rota}: ${nComissao}`);

    const nCasa = ed.casa.map((w) => `${w}=${ocorrencias(doc, w)}`);
    const somaCasa = ed.casa.reduce((a, w) => a + ocorrencias(doc, w), 0);
    medidas[`A6.${ed.chave}`] = somaCasa;
    conta(`A6.${ed.chave}`, somaCasa === 0, `vocabulário da casa em ${ed.rota}: ${nCasa.join(' · ')}`);

    /* A10 mede DENTRO dos cartões e das peças, e não na página inteira: a
       palavra é legítima onde ela é a leitura de uma ausência escrita por
       extenso, e é ilegítima como estado de um cartão. */
    const p2 = await pagina(ed.rota, 390, 844);
    const semLimiar = await p2.evaluate((palavra) => {
      const conta = (sel) =>
        [...document.querySelectorAll(sel)].filter((el) =>
          (el.textContent ?? '').toLowerCase().includes(palavra.toLowerCase()),
        ).length;
      return { cartoes: conta('[data-faixa] .cartao'), pecas: conta('#painel .peca') };
    }, ed.semLimiar);
    medidas[`A10.${ed.chave}`] = semLimiar;
    conta(
      `A10.${ed.chave}`,
      semLimiar.cartoes === 0 && semLimiar.pecas === 0,
      `«${ed.semLimiar}» nos cartões e nas peças de ${ed.rota}: ` +
        `${semLimiar.cartoes} cartão(ões), ${semLimiar.pecas} peça(s)`,
    );

    /* ------------------------------------------------------------------- A7 */
    const lagoas = await p2.evaluate(() =>
      [...document.querySelectorAll('.pesquisa-item')]
        .filter((li) => (li.querySelector('.pesquisa-nome')?.textContent ?? '').trim() === 'Lagoa')
        .map((li) => (li.textContent ?? '').replace(/\s+/g, ' ').trim()),
    );
    const distintas = new Set(lagoas);
    medidas[`A7.${ed.chave}`] = lagoas;
    conta(
      `A7.${ed.chave}`,
      lagoas.length === 2 && distintas.size === 2,
      `as duas fichas de «Lagoa» em ${ed.rota}: ${lagoas.length} ficha(s), ` +
        `${distintas.size} texto(s) distinto(s) [${lagoas.join(' | ')}]`,
    );

    /* ------------------------------------------------------------------- A12 */
    const menu = await p2.evaluate(() =>
      [...document.querySelectorAll('.nav-principal a')].map((a) => a.getAttribute('href')),
    );
    const emFalta = ed.menu.filter((h) => !menu.includes(h));
    medidas[`A12.${ed.chave}`] = { menu, emFalta };
    conta(
      `A12.${ed.chave}`,
      emFalta.length === 0,
      `regiões, distritos e áreas no menu de ${ed.rota}: ` +
        (emFalta.length ? `faltam ${emFalta.join(', ')}` : 'as três lá estão'),
    );
    await p2.__ctx.close();

    /* ------------------------------------------------------------------- A8 */
    const forms = [...doc.matchAll(/<form\b[^>]*>/g)].map((m) => m[0]);
    let destinoVivo = false;
    let action = null;
    let metodo = null;
    if (forms.length === 1) {
      action = /action="([^"]*)"/.exec(forms[0])?.[1] ?? null;
      metodo = /method="([^"]*)"/.exec(forms[0])?.[1] ?? null;
      if (action) {
        const r = await fetch(base + action);
        destinoVivo = r.status === 200;
      }
    }
    medidas[`A8.${ed.chave}`] = { formularios: forms.length, action, metodo, destinoVivo };
    conta(
      `A8.${ed.chave}`,
      forms.length === 1 && destinoVivo && String(metodo).toLowerCase() === 'get',
      `<form> em ${ed.rota}: ${forms.length}; action «${action}» ` +
        `(${destinoVivo ? '200' : 'não responde 200'}); method «${metodo}»`,
    );

    /* ------------------------------------------------------------------- A9 */
    const p3 = await pagina(ed.rota, 390, ALTURA_PEQUENA);
    let toques = 0;
    let dentroDoEcra = true;
    let chegou = null;
    try {
      const campo = await p3.$('[data-pesquisa]');
      if (campo) {
        const c1 = await campo.boundingBox();
        dentroDoEcra = dentroDoEcra && c1 !== null && c1.y >= 0 && c1.y + c1.height <= ALTURA_PEQUENA;
        await campo.click();
        toques += 1;
        await campo.type(ed.concelho);
        await p3.waitForTimeout(120);
        const res = await p3.$(
          `.pesquisa-item:not([hidden]) a[href="${ed.destinoDoConcelho}"]`,
        );
        if (res) {
          const c2 = await res.boundingBox();
          dentroDoEcra =
            dentroDoEcra && c2 !== null && c2.y >= 0 && c2.y + c2.height <= ALTURA_PEQUENA;
          await Promise.all([p3.waitForNavigation({ waitUntil: 'load' }), res.click()]);
          toques += 1;
          chegou = new URL(p3.url()).pathname.replace(/\/$/, '');
        }
      }
    } catch (e) {
      chegou = `erro: ${e.message}`;
    }
    const alvo = ed.destinoDoConcelho.replace(/\/$/, '');
    medidas[`A9.${ed.chave}`] = { toques, dentroDoEcra, chegou };
    conta(
      `A9.${ed.chave}`,
      toques <= 2 && chegou === alvo && dentroDoEcra,
      `encontrar o concelho a partir de ${ed.rota}: ${toques} toque(s), ` +
        `${dentroDoEcra ? 'sem rolar' : 'com rolar'}, chegou a «${chegou ?? 'lado nenhum'}»`,
    );
    await p3.__ctx.close();
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS (A17 do brief)
 * ======================================================================== */
const PLANTAS = [
  {
    nome: 'um cartão sem selo',
    celulas: ['A1.pt'],
    /* Tira o selo do PRIMEIRO cartão, que é o que a A1 exige ver. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(/(<li class="cartao"[\s\S]*?)<a class="src-chip"[\s\S]*?<\/a>/, '$1'),
  },
  {
    nome: 'um segundo cartão com o mesmo valor (a cópia)',
    celulas: ['A3.pt'],
    /* Repõe uma segunda rendição do valor da dívida pública dentro do painel,
       que é exactamente a cópia que o bloco veio tirar. */
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h
        : h.replace(
            /<div class="painel"/,
            '<p class="peca-valor claim-value" data-claim="divida-publica-2025">96,4</p><div class="painel"',
          ),
  },
  {
    nome: 'a frase de contexto sem «Comissão Europeia»',
    celulas: ['A4.pt', 'A4.en'],
    f: (h, rota) =>
      rota.startsWith('/en')
        ? h.split('European Commission').join('European Board')
        : h.split('Comissão Europeia').join('Junta Europeia'),
  },
  {
    nome: 'a busca sem `action`',
    celulas: ['A8.pt', 'A8.en'],
    f: (h) => h.replace(/(<form\b[^>]*?)\saction="[^"]*"/g, '$1'),
  },
  {
    nome: 'uma unidade do mapa sem nome',
    celulas: ['A5.pt', 'A5.en'],
    /* Tira a ligação de UMA unidade da lista dos nomes: fica com 28. */
    f: (h) => h.replace(/<li><a href="[^"]*" data-lista-porta="[^"]*">[^<]*<\/a><\/li>/, ''),
  },
];

/* ========================================================================= */
await corre();
const verdeInicial = celulas.every((c) => c.passa);
const linhas = celulas.map((c) => ({ ...c }));

for (const c of linhas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}  ${cinza(c.prova)}`);
}

let plantasOk = true;
if (VERMELHOS) {
  console.log('');
  console.log('  estragos plantados:');
  const porNome = new Map(linhas.map((c) => [c.nome, c]));
  for (const planta of PLANTAS) {
    const verdeAntes = planta.celulas.every((n) => porNome.get(n)?.passa);
    /* O HTML tem de mudar: um `replace` que falha em silêncio é o modo mais
       comum de um estrago não ser estrago nenhum. */
    let mudou = false;
    for (const ed of EDICOES) {
      const rota = ed.rota === '/' ? '/index.html' : `${ed.rota}/index.html`;
      const antes = fs.readFileSync(path.join(DIST, rota.replace(/^\//, '')), 'utf8');
      if (planta.f(antes, ed.rota) !== antes) mudou = true;
    }
    ESTRAGO = planta.f;
    await corre();
    ESTRAGO = null;
    const depois = new Map(celulas.map((c) => [c.nome, c]));
    const caiuTudo = planta.celulas.every((n) => depois.get(n) && !depois.get(n).passa);
    const ok = verdeAntes && mudou && caiuTudo;
    plantasOk = plantasOk && ok;
    console.log(
      `  ${ok ? verde('✓') : vermelho('✗')} ${planta.nome}  ` +
        cinza(
          `verde antes: ${verdeAntes ? 'sim' : 'NÃO'} · html mudou: ${mudou ? 'sim' : 'NÃO'} · ` +
            `vermelho depois: ${planta.celulas
              .map((n) => `${n}=${depois.get(n)?.passa ? 'verde' : 'vermelho'}`)
              .join(', ')}`,
        ),
    );
  }
  /* Repõe a leitura limpa para o ficheiro JSON e para o código de saída. */
  await corre();
}

const todas = celulas.every((c) => c.passa);
console.log('');
console.log(
  `  porta ${todas ? verde('✓') : vermelho('✗')} ${celulas.filter((c) => c.passa).length} de ${celulas.length} célula(s)` +
    (VERMELHOS ? ` · plantas ${plantasOk ? verde('✓') : vermelho('✗')}` : '') +
    cinza(`  ${DIST}`),
);

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(
    FICHEIRO_JSON,
    JSON.stringify({ dist: DIST, celulas, medidas, plantasOk: VERMELHOS ? plantasOk : null }, null, 2),
  );
}

await nav.close();
servidor.close();
process.exit(todas && (!VERMELHOS || plantasOk) ? 0 : 1);
