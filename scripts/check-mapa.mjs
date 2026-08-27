#!/usr/bin/env node
/**
 * =============================================================================
 * O PORTÃO DO MAPA · `check:mapa`
 * =============================================================================
 *
 * Corre na cadeia do `build`, depois do `gate:html`, sobre o `dist/` construído
 * e sobre os artefactos que o motor atravessou para `mapa/`. É o D5 do
 * `design/especime-v3/briefs/BRIEF-mapa-distritos.md`, e são seis regras:
 *
 *   R1  os resumos dos ficheiros de `mapa/` iguais aos do manifesto, e nenhum
 *       ficheiro a mais nem a menos;
 *   R2  a junção reconferida NO SÍTIO: os 308 concelhos aparecem uma vez cada
 *       nas 29 páginas de distrito construídas, e os seus slugs são exactamente
 *       os que `slugsDaCarta()` devolve;
 *   R3  cada página de distrito com tantas ligações de área quantos concelhos o
 *       seu ficheiro tem, e a lista com as mesmas;
 *   R4  a primeira página com 29 ligações de área, uma por unidade;
 *   R5  nenhum `<a>` debaixo de um `role="img"`;
 *   R6  a atribuição da DGT presente onde o mapa está.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 * Não importa `src/lib/mapa.mjs`: é o leitor que as páginas usam, e uma
 * conferência que usasse o código das páginas confirmava-se a si própria. Lê os
 * ficheiros com o seu próprio leitor. O que importa é `src/lib/routes.mjs` (a
 * tabela de endereços da casa, que não é a coisa que aqui se prova) e
 * `slugsDaCarta()` de `src/lib/inicio.mjs`, que é precisamente a régua contra a
 * qual os slugs do artefacto se medem: importá-la é o ponto todo da R2. É a
 * mesma disciplina de `check-cadeia.mjs` e de `check-dados.mjs`.
 *
 * ---------------------------------------------------------------------------
 * OS ESTRAGOS PLANTADOS (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Uma régua só conta depois de apanhar um estrago plantado, vista vermelha e
 * depois verde. `--vermelhos` planta um estrago por regra numa CÓPIA em memória
 * do mundo que as regras leem, e exige que a regra correspondente falhe. Nada é
 * escrito em disco, e por isso o estrago não pode sobreviver à corrida:
 *
 *   node scripts/check-mapa.mjs                as seis regras
 *   node scripts/check-mapa.mjs --vermelhos    e a linha de cada estrago
 *
 * Uso: `npm run check:mapa`, e é o que a cadeia do `build` corre.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { routePath, LANGS } from '../src/lib/routes.mjs';
import { slugsDaCarta } from '../src/lib/inicio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const MAPA = path.join(RAIZ, 'mapa');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const VERMELHOS = process.argv.includes('--vermelhos');

/** A linha do livro-razão que o selo do mapa abre, e a fonte da atribuição. */
const LINHA_DA_CARTA = 'municipios-portugal-caop-2025';

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DO MAPA · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}
if (!fs.existsSync(path.join(MAPA, 'manifest.json'))) {
  console.error(
    vermelho('\n  PORTÃO DO MAPA · não existe mapa/manifest.json.\n') +
      cinza('  Os artefactos vêm do motor (python3 publisher/mapa_distritos.py --write).\n'),
  );
  process.exit(1);
}

/* ===========================================================================
 * O MUNDO QUE AS REGRAS LEEM
 * ===========================================================================
 * Um objecto só, com tudo lido uma vez: os bytes de cada ficheiro de `mapa/`, o
 * manifesto, o país, os 29 distritos, e as páginas construídas que desenham um
 * mapa. As regras são funções puras sobre ele, e é isso que deixa `--vermelhos`
 * plantar um estrago numa cópia sem tocar em disco.
 */
function ficheirosDoMapa() {
  const out = [];
  const anda = (dir) => {
    for (const nome of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, nome);
      if (fs.statSync(abs).isDirectory()) anda(abs);
      else out.push(path.relative(RAIZ, abs).split(path.sep).join('/'));
    }
  };
  anda(MAPA);
  return out;
}

function lePagina(rota) {
  const rel = path.join(rota.replace(/^\//, ''), 'index.html');
  const abs = path.join(DIST, rel);
  if (!fs.existsSync(abs)) return null;
  const html = fs.readFileSync(abs, 'utf8');
  return { rota, rel, html, root: parse(html) };
}

function leMundo() {
  const ficheiros = {};
  for (const rel of ficheirosDoMapa()) ficheiros[rel] = fs.readFileSync(path.join(RAIZ, rel));

  const manifesto = JSON.parse(ficheiros['mapa/manifest.json'].toString('utf8'));
  const pais = JSON.parse(ficheiros['mapa/pais.json'].toString('utf8'));
  const distritos = {};
  for (const u of pais.unidades) {
    distritos[u.slug] = JSON.parse(ficheiros[`mapa/distritos/${u.slug}.json`].toString('utf8'));
  }

  /* As páginas: as duas primeiras páginas, as 29 × 2 de distrito, e a página da
     linha da Carta, que é onde o selo do mapa desemboca. */
  const paginas = [];
  for (const lang of LANGS) {
    const inicio = lePagina(routePath('home', lang));
    if (inicio) paginas.push({ ...inicio, lang, tipo: 'inicio' });
    for (const u of pais.unidades) {
      const pg = lePagina(routePath('distrito', lang, { slug: u.slug }));
      if (pg) paginas.push({ ...pg, lang, tipo: 'distrito', slug: u.slug });
    }
    const linha = lePagina(routePath('linha', lang, { slug: LINHA_DA_CARTA }));
    if (linha) paginas.push({ ...linha, lang, tipo: 'linha' });
  }
  return { ficheiros, manifesto, pais, distritos, paginas };
}

/* ===========================================================================
 * AS SEIS REGRAS
 * ===========================================================================
 * Cada uma devolve uma lista de queixas. Uma lista vazia é uma regra verde.
 */

/** R1 · os resumos, e a lista de ficheiros. */
function r1(m) {
  const erros = [];
  const declarados = new Set(Object.keys(m.manifesto.ficheiros));
  const emDisco = new Set(Object.keys(m.ficheiros).filter((f) => f !== 'mapa/manifest.json'));

  for (const rel of declarados) {
    if (!emDisco.has(rel)) {
      erros.push(`o manifesto declara ${rel} e o ficheiro não está em disco.`);
      continue;
    }
    const meu = crypto.createHash('sha256').update(m.ficheiros[rel]).digest('hex');
    const dele = m.manifesto.ficheiros[rel].sha256;
    if (meu !== dele) {
      erros.push(
        `${rel}: o resumo dos bytes é ${meu.slice(0, 12)} e o manifesto diz ${String(dele).slice(0, 12)}.`,
      );
    }
    const bytes = m.manifesto.ficheiros[rel].bytes;
    if (typeof bytes === 'number' && bytes !== m.ficheiros[rel].length) {
      erros.push(`${rel}: tem ${m.ficheiros[rel].length} bytes e o manifesto diz ${bytes}.`);
    }
  }
  for (const rel of emDisco) {
    if (!declarados.has(rel)) erros.push(`${rel} está em mapa/ e o manifesto não o declara.`);
  }
  return erros;
}

/** Os slugs das áreas de uma página construída. */
function areasDaPagina(pg, atributo) {
  return pg.root.querySelectorAll(`[${atributo}]`).map((a) => a.getAttribute(atributo));
}

/** R2 · a junção, reconferida nas páginas construídas. */
function r2(m) {
  const erros = [];
  const daCarta = slugsDaCarta();
  const vistos = new Map();

  for (const pg of m.paginas.filter((p) => p.tipo === 'distrito' && p.lang === 'pt')) {
    for (const slug of areasDaPagina(pg, 'data-concelho-porta')) {
      vistos.set(slug, (vistos.get(slug) ?? 0) + 1);
    }
  }

  const repetidos = [...vistos.entries()].filter(([, n]) => n > 1);
  for (const [slug, n] of repetidos) {
    erros.push(`o concelho "${slug}" aparece ${n} vezes nas 29 páginas de distrito, e é uma.`);
  }
  const emFalta = daCarta.filter((s) => !vistos.has(s));
  for (const slug of emFalta) {
    erros.push(`o concelho "${slug}" está na Carta e não aparece em nenhuma página de distrito.`);
  }
  const aMais = [...vistos.keys()].filter((s) => !daCarta.includes(s));
  for (const slug of aMais) {
    erros.push(`a área "${slug}" aparece numa página de distrito e não é um slug de slugsDaCarta().`);
  }
  if (vistos.size !== daCarta.length && emFalta.length === 0 && aMais.length === 0) {
    erros.push(`as páginas de distrito têm ${vistos.size} concelhos e a Carta tem ${daCarta.length}.`);
  }
  return erros;
}

/** R3 · cada página de distrito com tantas ligações quantos concelhos. */
function r3(m) {
  const erros = [];
  for (const pg of m.paginas.filter((p) => p.tipo === 'distrito')) {
    const esperado = m.distritos[pg.slug].concelhos.length;
    const areas = areasDaPagina(pg, 'data-concelho-porta').length;
    const lista = pg.root.querySelectorAll('#concelhos li a').length;
    if (areas !== esperado) {
      erros.push(`${pg.rota}: ${areas} ligações de área para ${esperado} concelhos no ficheiro.`);
    }
    if (lista !== esperado) {
      erros.push(`${pg.rota}: ${lista} nomes na lista para ${esperado} concelhos no ficheiro.`);
    }
  }
  return erros;
}

/** R4 · a primeira página com 29 ligações de área, uma por unidade. */
function r4(m) {
  const erros = [];
  const esperado = m.pais.unidades.map((u) => u.slug).sort();
  for (const pg of m.paginas.filter((p) => p.tipo === 'inicio')) {
    const areas = areasDaPagina(pg, 'data-uni-porta').sort();
    if (areas.length !== esperado.length) {
      erros.push(`${pg.rota}: ${areas.length} ligações de área para ${esperado.length} unidades.`);
      continue;
    }
    const diferentes = areas.filter((s, i) => s !== esperado[i]);
    if (diferentes.length) {
      erros.push(`${pg.rota}: as áreas não são as 29 unidades (${diferentes.join(', ')}).`);
    }
  }
  return erros;
}

/** R5 · nenhum `<a>` debaixo de um `role="img"`. */
function r5(m) {
  const erros = [];
  for (const pg of m.paginas) {
    for (const el of pg.root.querySelectorAll('[role="img"]')) {
      const dentro = el.querySelectorAll('a').length;
      if (dentro > 0) {
        erros.push(
          `${pg.rota}: ${dentro} ligação(ões) dentro de um role="img". ` +
            `Uma imagem pode achatar o que tem dentro, e uma porta achatada desaparece.`,
        );
      }
    }
  }
  return erros;
}

/** R6 · a atribuição da DGT onde o mapa está. */
function r6(m) {
  const erros = [];
  const atribuicao = m.manifesto.fonte.atribuicao;
  const portaDaLinha = (lang) => routePath('linha', lang, { slug: LINHA_DA_CARTA });

  /* Onde há um mapa há um selo, e o selo abre a linha da Carta. */
  for (const pg of m.paginas.filter((p) => p.tipo === 'inicio' || p.tipo === 'distrito')) {
    const figura = pg.root.querySelector('[data-mapa-areas]')
      ? pg.root.querySelector('[data-mapa-raiz]')
      : pg.root.querySelector('[data-instrumento="mapa-do-distrito"]');
    if (!figura) {
      erros.push(`${pg.rota}: a página não tem a figura do mapa.`);
      continue;
    }
    const selos = figura
      .querySelectorAll('a.src-chip')
      .map((a) => (a.getAttribute('href') ?? '').split('#')[0]);
    if (!selos.includes(portaDaLinha(pg.lang))) {
      erros.push(
        `${pg.rota}: o mapa não tem, na sua figura, o selo que abre ${portaDaLinha(pg.lang)}. ` +
          `A menção da entidade proprietária é a única obrigação da licença da Carta.`,
      );
    }
  }

  /* E a linha que o selo abre nomeia a entidade proprietária. */
  for (const pg of m.paginas.filter((p) => p.tipo === 'linha')) {
    if (!pg.root.text.includes(atribuicao)) {
      erros.push(
        `${pg.rota}: a página da linha da Carta não nomeia «${atribuicao}», que é a ` +
          `atribuição que o manifesto do motor traz da fonte.`,
      );
    }
  }
  return erros;
}

const REGRAS = [
  { id: 'R1', nome: 'os resumos de mapa/ batem com o manifesto', fn: r1 },
  { id: 'R2', nome: 'a junção: 308 concelhos, uma vez cada, com os slugs da Carta', fn: r2 },
  { id: 'R3', nome: 'cada página de distrito com tantas ligações quantos concelhos', fn: r3 },
  { id: 'R4', nome: 'a primeira página com 29 ligações de área', fn: r4 },
  { id: 'R5', nome: 'nenhuma ligação debaixo de role="img"', fn: r5 },
  { id: 'R6', nome: 'a atribuição da DGT onde o mapa está', fn: r6 },
];

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * ===========================================================================
 * Um por regra, numa cópia em memória. Cada um é a coisa que a regra existe para
 * apanhar, e nenhum é apanhado pela contabilidade de outra: o estrago da R1 muda
 * um byte de um ficheiro e mais nada, o da R2 apaga um concelho de uma página
 * construída sem tocar no artefacto, e assim por diante.
 */
function copia(m) {
  return {
    ficheiros: Object.fromEntries(Object.entries(m.ficheiros).map(([k, v]) => [k, Buffer.from(v)])),
    manifesto: JSON.parse(JSON.stringify(m.manifesto)),
    pais: JSON.parse(JSON.stringify(m.pais)),
    distritos: JSON.parse(JSON.stringify(m.distritos)),
    paginas: m.paginas.map((p) => ({ ...p, root: parse(p.html) })),
  };
}

const ESTRAGOS = {
  R1: (m) => {
    const rel = 'mapa/pais.json';
    const b = Buffer.from(m.ficheiros[rel]);
    b[b.length - 2] = b[b.length - 2] === 32 ? 10 : 32;
    m.ficheiros[rel] = b;
    return 'um byte trocado em mapa/pais.json';
  },
  R2: (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'distrito' && p.lang === 'pt');
    const alvo = pg.root.querySelector('[data-concelho-porta]');
    const slug = alvo.getAttribute('data-concelho-porta');
    alvo.removeAttribute('data-concelho-porta');
    return `o concelho "${slug}" apagado da página de ${pg.slug}`;
  },
  R3: (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'distrito' && p.lang === 'pt');
    const item = pg.root.querySelector('#concelhos li');
    item.remove();
    return `um nome a menos na lista de ${pg.slug}`;
  },
  R4: (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'inicio');
    pg.root.querySelector('[data-uni-porta]').removeAttribute('data-uni-porta');
    return 'uma unidade a menos nas áreas da primeira página';
  },
  R5: (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'inicio');
    pg.root.querySelector('[data-mapa-areas]').setAttribute('role', 'img');
    return 'o mapa da primeira página declarado role="img" por cima das 29 ligações';
  },
  R6: (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'inicio');
    for (const a of pg.root.querySelector('[data-mapa-raiz]').querySelectorAll('a.src-chip')) {
      a.remove();
    }
    return 'o selo da Carta retirado da figura do mapa da primeira página';
  },
  /* A R6 TEM DUAS METADES E POR ISSO TEM DOIS ESTRAGOS: o selo que abre a linha,
     e a linha que nomeia a entidade proprietária. Um estrago só provava metade
     da regra, e a metade que ficasse por provar era exactamente a que a licença
     obriga. */
  'R6 (a linha)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'linha');
    const nome = m.manifesto.fonte.atribuicao;
    pg.root = parse(pg.html.split(nome).join('Instituto Geográfico Nacional'));
    return 'a entidade proprietária trocada na página da linha da Carta';
  },
};

/* ===========================================================================
 * A CORRIDA
 * ========================================================================= */
const mundo = leMundo();

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  for (const rotulo of Object.keys(ESTRAGOS)) {
    const regra = REGRAS.find((r) => rotulo.startsWith(r.id));
    const m = copia(mundo);
    const oQue = ESTRAGOS[rotulo](m);
    const queixas = regra.fn(m);
    const apanhou = queixas.length > 0;
    if (!apanhou) falhou = true;
    console.log(
      `  ${apanhou ? verde("vermelho ✓") : vermelho("NÃO APANHOU ✗")}  ${rotulo} · ${oQue}`,
    );
    if (apanhou) console.log(cinza(`              ${queixas[0]}`));
  }
  console.log('');
  process.exit(falhou ? 1 : 0);
}

const erros = [];
const linhas = [];
for (const regra of REGRAS) {
  const queixas = regra.fn(mundo);
  linhas.push(`  ${queixas.length === 0 ? verde('✓') : vermelho('✗')} ${regra.id} · ${regra.nome}`);
  for (const q of queixas) erros.push(`${regra.id}: ${q}`);
}

console.log('');
for (const l of linhas) console.log(l);

if (erros.length) {
  console.error(vermelho(`\n  PORTÃO DO MAPA · ${erros.length} problema(s):\n`));
  for (const e of erros.slice(0, 40)) console.error(`    · ${e}`);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}.`));
  console.error('');
  process.exit(1);
}

const nDistritos = mundo.paginas.filter((p) => p.tipo === 'distrito').length;
console.log(
  cinza(
    `\n  mapa · ${Object.keys(mundo.manifesto.ficheiros).length} ficheiros conferidos · ` +
      `${mundo.pais.unidades.length} unidades · ${slugsDaCarta().length} concelhos, uma vez cada · ` +
      `${nDistritos} páginas de distrito construídas\n`,
  ),
);
