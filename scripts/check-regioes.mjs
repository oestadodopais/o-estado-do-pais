#!/usr/bin/env node
/**
 * =============================================================================
 * O PORTÃO DAS REGIÕES · `check:regioes`
 * =============================================================================
 *
 * Corre na cadeia do `build`, depois do `gate:html`, sobre o `dist/` construído.
 * É o RG4 do `design/especime-v3/briefs/BRIEF-regioes.md`, e são cinco regras:
 *
 *   R1  cada região com linhas tem página nas duas edições, e nenhuma região sem
 *       linhas tem página nenhuma;
 *   R2  cada página de região cita as afirmações que a sua entrada declara, cada
 *       uma com selo para a sua linha, na edição da página;
 *   R3  a régua imprime só valores com linha: uma linha da lista por leitura com
 *       linhas e nenhuma a mais, em todas as páginas que a rendem, e cada valor
 *       desenhado dentro do `<svg>` com selo na legenda do instrumento;
 *   R4  a neutralidade da Emenda 21c: um só estilo de barra em todas as linhas
 *       de todas as páginas, e o contorno só na região da própria página;
 *   R5  as duas contagens da prova, recontadas de três pontos de observação: a
 *       lista de dados, o livro-razão e as páginas construídas.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 * Não importa `src/lib/regioes.mjs`: é o leitor que as páginas usam, e uma
 * conferência que usasse o código das páginas confirmava-se a si própria. Lê a
 * lista de dados (`src/data/regioes.mjs`) e o livro-razão (`loadClaims()`) e
 * aplica AQUI a regra do que é «ter linhas» — as duas afirmações publicadas —,
 * que é precisamente a regra que se está a provar. `src/lib/routes.mjs` entra
 * porque é a tabela de endereços da casa, e não é a coisa que aqui se prova. É a
 * mesma disciplina de `check-mapa.mjs` e de `check-dados.mjs`.
 *
 * ---------------------------------------------------------------------------
 * OS ESTRAGOS PLANTADOS (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Uma régua só conta depois de apanhar um estrago plantado, vista vermelha e
 * depois verde. `--vermelhos` planta um estrago por regra numa CÓPIA em memória
 * do mundo que as regras leem, e exige que a regra correspondente falhe. Nada é
 * escrito em disco, e por isso o estrago não pode sobreviver à corrida:
 *
 *   node scripts/check-regioes.mjs                as cinco regras
 *   node scripts/check-regioes.mjs --vermelhos    e a linha de cada estrago
 *
 * Uso: `npm run check:regioes`, e é o que a cadeia do `build` corre.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { routePath, LANGS } from '../src/lib/routes.mjs';
import { REGIOES } from '../src/data/regioes.mjs';
import { loadClaims } from '../src/lib/ledger.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const VERMELHOS = process.argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DAS REGIÕES · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/* ===========================================================================
 * O MUNDO QUE AS REGRAS LEEM
 * ===========================================================================
 * Um objecto só, com tudo lido uma vez: a lista de dados, o livro-razão, as
 * páginas construídas e as pastas que existem debaixo de cada índice. As regras
 * são funções puras sobre ele, e é isso que deixa `--vermelhos` plantar um
 * estrago numa cópia sem tocar em disco.
 */

/** A regra do que é «ter linhas», escrita AQUI e não importada. */
function comLinhas(r, claims) {
  return claims.has(r.valor) && claims.has(r.distancia);
}

function lePagina(rota) {
  const rel = path.join(rota.replace(/^\//, ''), 'index.html');
  const abs = path.join(DIST, rel);
  if (!fs.existsSync(abs)) return null;
  return { rota, html: fs.readFileSync(abs, 'utf8') };
}

/** As pastas que existem debaixo do índice de uma edição. */
function pastasDe(rotaDoIndice) {
  const dir = path.join(DIST, rotaDoIndice.replace(/^\//, ''));
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => fs.statSync(path.join(dir, n)).isDirectory())
    .sort();
}

function leMundo() {
  const claims = loadClaims();
  const entradas = REGIOES.map((r) => ({
    id: r.id,
    slug: r.slug,
    referencia: Boolean(r.referencia),
    valor: r.valor,
    distancia: r.distancia,
    temLinhas: comLinhas(r, claims),
    valorPublicado: claims.get(r.valor)?.value ?? null,
  }));

  const paginas = {};
  const indices = {};
  const pastas = {};
  for (const lang of LANGS) {
    indices[lang] = lePagina(routePath('regioes', lang));
    pastas[lang] = pastasDe(routePath('regioes', lang));
    for (const e of entradas) {
      if (e.referencia) continue;
      const rota = routePath('regiao', lang, { slug: e.slug });
      const p = lePagina(rota);
      if (p) paginas[`${lang}:${e.slug}`] = p;
    }
  }
  return { entradas, paginas, indices, pastas, ids: new Set(claims.keys()) };
}

/** Todas as páginas que rendem o instrumento: os dois índices e as de região. */
function paginasComRegua(m) {
  const out = [];
  for (const lang of LANGS) if (m.indices[lang]) out.push({ lang, slug: null, ...m.indices[lang] });
  for (const [chave, p] of Object.entries(m.paginas)) {
    const [lang, slug] = chave.split(':');
    out.push({ lang, slug, ...p });
  }
  return out;
}

/* ===========================================================================
 * AS REGRAS
 * ===========================================================================
 */

/** R1 · cada região com linhas tem página nas duas edições, e mais nenhuma. */
function R1(m) {
  const erros = [];
  const esperadas = m.entradas.filter((e) => !e.referencia && e.temLinhas).map((e) => e.slug);
  for (const lang of LANGS) {
    if (!m.indices[lang]) erros.push(`falta o índice ${routePath('regioes', lang)}.`);
    for (const slug of esperadas) {
      if (!m.paginas[`${lang}:${slug}`]) {
        erros.push(`falta a página ${routePath('regiao', lang, { slug })}.`);
      }
    }
    const aMais = m.pastas[lang].filter((n) => !esperadas.includes(n));
    for (const n of aMais) {
      erros.push(
        `${routePath('regioes', lang)}/${n} existe e não é uma região com linhas ` +
          `(Emenda 21e: a régua nunca se completa com um número escrito à mão).`,
      );
    }
  }
  /* E a referência não tem página: Portugal não é uma região. */
  for (const e of m.entradas.filter((x) => x.referencia)) {
    for (const lang of LANGS) {
      if (m.paginas[`${lang}:${e.slug}`]) {
        erros.push(`a referência "${e.slug}" tem página em ${lang}, e não é uma região.`);
      }
    }
  }
  return erros;
}

/** R2 · cada página de região cita as suas afirmações, com selo para a sua linha. */
function R2(m) {
  const erros = [];
  for (const [chave, p] of Object.entries(m.paginas)) {
    const [lang, slug] = chave.split(':');
    const e = m.entradas.find((x) => x.slug === slug);
    const raiz = parse(p.html);
    const citados = new Set(
      raiz.querySelectorAll('[data-claim]').map((el) => el.getAttribute('data-claim')),
    );
    const selos = new Set(
      raiz
        .querySelectorAll('a.src-chip')
        .map((el) => el.getAttribute('href'))
        .filter(Boolean),
    );
    for (const id of [e.valor, e.distancia]) {
      if (!citados.has(id)) erros.push(`${p.rota}: não cita a afirmação "${id}".`);
      const porta = routePath('linha', lang, { slug: id });
      if (!selos.has(porta)) erros.push(`${p.rota}: a afirmação "${id}" não tem selo para ${porta}.`);
    }
  }
  return erros;
}

/** R3 · a régua imprime só valores com linha, e uma linha por leitura. */
function R3(m) {
  const erros = [];
  const leituras = m.entradas.filter((e) => e.temLinhas);
  const idsEsperados = new Set(leituras.map((e) => e.id));
  for (const p of paginasComRegua(m)) {
    const raiz = parse(p.html);
    const linhas = raiz.querySelectorAll('[data-conv-linha]');
    const ids = linhas.map((el) => el.getAttribute('data-conv-linha'));
    if (ids.length !== leituras.length) {
      erros.push(
        `${p.rota}: a régua tem ${ids.length} linha(s) e as leituras com linhas são ` +
          `${leituras.length}.`,
      );
    }
    for (const id of ids) {
      if (!idsEsperados.has(id)) {
        erros.push(`${p.rota}: a régua tem a linha "${id}", que não é uma leitura com linhas.`);
      }
    }
    /* Cada valor desenhado dentro do `<svg>` tem selo na legenda do instrumento
       (a convenção do §1.34), e a sua afirmação existe no livro-razão. */
    const svg = raiz.querySelector('svg.rule-svg');
    const legenda = raiz.querySelector('[data-legenda-selos]');
    const portasDaLegenda = new Set(
      legenda ? legenda.querySelectorAll('a.src-chip').map((el) => el.getAttribute('href')) : [],
    );
    const desenhados = svg ? svg.querySelectorAll('[data-claim]') : [];
    if (desenhados.length !== leituras.length) {
      erros.push(
        `${p.rota}: o desenho tem ${desenhados.length} valor(es) e as leituras com linhas são ` +
          `${leituras.length}.`,
      );
    }
    for (const el of desenhados) {
      const id = el.getAttribute('data-claim');
      if (!m.ids.has(id)) erros.push(`${p.rota}: a régua desenha "${id}", que não está no livro-razão.`);
      const porta = routePath('linha', p.lang, { slug: id });
      if (!portasDaLegenda.has(porta)) {
        erros.push(`${p.rota}: o valor desenhado "${id}" não tem selo na legenda do instrumento.`);
      }
    }
  }
  return erros;
}

/**
 * R4 · a neutralidade (Emenda 21c).
 *
 * Duas coisas, e as duas são a mesma frase da constituição: «nenhuma região
 * destacada por estatuto; na página de uma região o que a distingue na régua é o
 * contorno, e só ele».
 *
 *   · UM SÓ ESTILO DE BARRA. Todas as barras de todas as páginas têm exactamente
 *     a mesma lista de classes. Uma cor de estado (`barra-fora`, `barra-dentro`)
 *     é o que a régua das peças usa onde HÁ limiar publicado; numa média não há
 *     limiar (Emenda 1), e uma barra pintada aqui seria um juízo desenhado.
 *   · O CONTORNO SÓ NA REGIÃO DA PÁGINA. Zero no índice; na página de uma região,
 *     só os elementos daquela região o levam.
 */
function R4(m) {
  const erros = [];
  const classes = new Set();
  for (const p of paginasComRegua(m)) {
    const raiz = parse(p.html);
    for (const barra of raiz.querySelectorAll('.conv-b')) {
      classes.add((barra.getAttribute('class') ?? '').trim());
    }
    const contornos = raiz.querySelectorAll('[data-contorno="sim"]');
    if (!p.slug) {
      if (contornos.length) {
        erros.push(
          `${p.rota}: o índice tem ${contornos.length} marca(s) de contorno, e nenhuma região ` +
            `é a região desta página.`,
        );
      }
      continue;
    }
    if (!contornos.length) {
      erros.push(`${p.rota}: a região da página não está distinguida pelo contorno.`);
    }
    for (const el of contornos) {
      const linha = el.closest ? el.closest('[data-conv-linha]') : null;
      const marca = el.getAttribute('data-mk') ?? (linha ? linha.getAttribute('data-conv-linha') : null);
      const daPagina = m.entradas.find((e) => e.slug === p.slug);
      const id = el.getAttribute('data-conv-linha') ?? marca;
      if (id && daPagina && id !== daPagina.id) {
        erros.push(`${p.rota}: o contorno está em "${id}" e a região da página é "${daPagina.id}".`);
      }
    }
  }
  if (classes.size > 1) {
    erros.push(
      `as barras da régua têm ${classes.size} estilos diferentes: ${[...classes]
        .map((c) => `"${c}"`)
        .join(', ')}. A Emenda 21c pede um só.`,
    );
  }
  return erros;
}

/** R5 · as duas contagens, de três pontos de observação. */
function R5(m) {
  const erros = [];
  const declaradas = m.entradas.filter((e) => !e.referencia).length;
  const comLinha = m.entradas.filter((e) => !e.referencia && e.temLinhas).length;
  const paginasPt = m.pastas.pt.length;
  const paginasEn = m.pastas.en.length;
  if (comLinha !== paginasPt || comLinha !== paginasEn) {
    erros.push(
      `as regiões com linhas são ${comLinha} e as páginas construídas são ${paginasPt} (pt) e ` +
        `${paginasEn} (en).`,
    );
  }
  if (comLinha > declaradas) {
    erros.push(`há ${comLinha} regiões com linhas e só ${declaradas} declaradas.`);
  }
  /* E o que o índice rende, que é o terceiro ponto de observação: a contagem
     marcada `data-prova="regioes_com_linha"` na página, lida do HTML. */
  for (const lang of LANGS) {
    const p = m.indices[lang];
    if (!p) continue;
    const el = parse(p.html).querySelector('[data-prova="regioes_com_linha"]');
    if (!el) {
      erros.push(`${p.rota}: não rende a contagem "regioes_com_linha".`);
      continue;
    }
    const rendido = el.text.replace(/\s+/g, ' ').trim();
    if (rendido !== String(comLinha)) {
      erros.push(`${p.rota}: rende "${rendido}" e as regiões com linhas são ${comLinha}.`);
    }
  }
  return erros;
}

const REGRAS = [
  ['R1', 'cada região com linhas tem página, e nenhuma outra tem', R1],
  ['R2', 'cada página de região cita as suas linhas, com selo', R2],
  ['R3', 'a régua imprime só valores com linha, e um por leitura', R3],
  ['R4', 'a neutralidade: um só estilo de barra, e o contorno da página', R4],
  ['R5', 'as duas contagens, de três pontos de observação', R5],
];

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * ===========================================================================
 * Cada um mexe numa CÓPIA do mundo, e a regra correspondente tem de o ver.
 */
const ESTRAGOS = {
  R1: (m) => {
    /* Uma página de região apagada: a régua desenha a barra e a porta não abre. */
    const chave = Object.keys(m.paginas)[0];
    delete m.paginas[chave];
    const [lang, slug] = chave.split(':');
    m.pastas[lang] = m.pastas[lang].filter((n) => n !== slug);
    return `a página ${lang}:${slug} apagada`;
  },
  R2: (m) => {
    /* O selo da distância retirado de uma página: o valor fica sem porta. */
    const chave = Object.keys(m.paginas)[0];
    const [lang, slug] = chave.split(':');
    const e = m.entradas.find((x) => x.slug === slug);
    const porta = routePath('linha', lang, { slug: e.distancia });
    m.paginas[chave] = {
      ...m.paginas[chave],
      html: m.paginas[chave].html.split(`href="${porta}"`).join('href="#"'),
    };
    return `o selo de "${e.distancia}" retirado de ${lang}:${slug}`;
  },
  R3: (m) => {
    /* Uma região a mais na régua do índice, sem linha nenhuma por baixo. */
    const p = m.indices.pt;
    m.indices.pt = {
      ...p,
      html: p.html.replace(
        '<ul class="conv-lista"',
        '<ul class="conv-lista"><li class="conv-linha" data-conv-linha="nor"></li>'.replace(
          '<ul class="conv-lista">',
          '<ul class="conv-lista"',
        ),
      ),
    };
    return 'uma linha "nor" (o Norte, sem linhas) acrescentada à régua do índice';
  },
  R4: (m) => {
    /* Uma barra com cor de estatuto, que é a planta que o brief nomeia. */
    const p = m.indices.pt;
    m.indices.pt = { ...p, html: p.html.replace('class="conv-b"', 'class="conv-b barra-fora"') };
    return 'uma barra do índice com a classe de estado "barra-fora"';
  },
  R5: (m) => {
    /* Uma região sem linhas com página construída: as contagens divergem. */
    m.pastas.pt = [...m.pastas.pt, 'norte'];
    return 'uma pasta "norte" no índice português, sem linhas por baixo';
  },
};

/* =========================================================================== */

const mundo = leMundo();

if (!VERMELHOS) {
  let falhou = false;
  const linhas = [];
  for (const [nome, titulo, fn] of REGRAS) {
    const erros = fn(mundo);
    if (erros.length) {
      falhou = true;
      linhas.push(`  ${vermelho('✗')} ${nome} · ${titulo}`);
      for (const e of erros.slice(0, 12)) linhas.push(`      ${vermelho(e)}`);
      if (erros.length > 12) linhas.push(cinza(`      … e mais ${erros.length - 12}`));
    } else {
      linhas.push(`  ${verde('✓')} ${nome} · ${titulo}`);
    }
  }
  console.log('\n' + linhas.join('\n'));
  const comLinha = mundo.entradas.filter((e) => !e.referencia && e.temLinhas).length;
  const declaradas = mundo.entradas.filter((e) => !e.referencia).length;
  console.log(
    cinza(
      `\n  regiões · ${declaradas} declarada(s), ${comLinha} com linhas · ` +
        `${Object.keys(mundo.paginas).length} página(s) de região construída(s) · ` +
        `${mundo.entradas.filter((e) => e.temLinhas).length} leitura(s) na régua\n`,
    ),
  );
  process.exit(falhou ? 1 : 0);
}

/* --vermelhos: um estrago por regra, numa cópia, e a regra tem de o ver. */
let todosVermelhos = true;
const saida = [];
for (const [nome, , fn] of REGRAS) {
  const copia = leMundo();
  const descricao = ESTRAGOS[nome](copia);
  const erros = fn(copia);
  const viu = erros.length > 0;
  if (!viu) todosVermelhos = false;
  saida.push(
    `  ${viu ? verde('✓ vermelho') : vermelho('✗ passou')} ${nome} · ${descricao}` +
      (viu ? cinza(`\n      ${erros[0]}`) : ''),
  );
}
console.log('\n' + saida.join('\n') + '\n');
process.exit(todosVermelhos ? 0 : 1);
