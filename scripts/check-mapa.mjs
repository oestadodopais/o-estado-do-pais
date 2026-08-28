#!/usr/bin/env node
/**
 * =============================================================================
 * O PORTÃO DO MAPA · `check:mapa`
 * =============================================================================
 *
 * Corre na cadeia do `build`, depois do `gate:html`, sobre o `dist/` construído
 * e sobre os artefactos que o motor atravessou para `mapa/`. É o D5 do
 * `design/especime-v3/briefs/BRIEF-mapa-distritos.md`, e são sete regras:
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
 *   R6  a atribuição da DGT presente onde o mapa está;
 *   R7  a ordem dos caminhos de cada `svg`, a das unidades do manifesto, e a
 *       das listas de `/municipios` e de cada página de distrito, na colação
 *       portuguesa (I84).
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
 *   node scripts/check-mapa.mjs                as sete regras
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
    /* O ÍNDICE DOS CONCELHOS ENTRA COM A R7 (28.08.2026). É a página onde os 29
       nomes das unidades e os 308 dos concelhos aparecem todos seguidos, e por
       isso é onde uma ordem errada se lê de uma vez. */
    const indice = lePagina(routePath('municipios', lang));
    if (indice) paginas.push({ ...indice, lang, tipo: 'municipios' });
  }
  return { ficheiros, manifesto, pais, distritos, paginas };
}

/* ===========================================================================
 * AS SETE REGRAS
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

/** R6 · a atribuição da DGT onde o mapa está.
 *
 * ---------------------------------------------------------------------------
 * A MENÇÃO É ESCRITA, E NÃO APENAS ALCANÇÁVEL (Emenda 20e, 27.08.2026)
 * ---------------------------------------------------------------------------
 * A primeira forma desta regra pedia duas coisas: um selo na figura do mapa, e a
 * linha do livro-razão que ele abre a nomear a entidade proprietária. A cadeia
 * fechava, mas a menção ficava a um clique do mapa mais visto do sítio, e uma
 * obrigação de licença não se cumpre por hiperligação: a Emenda 20e diz que a
 * atribuição é escrita, e que é escrita onde o mapa está.
 *
 * São por isso três conferências, e a do meio é a nova: onde há um mapa há um
 * bloco de fonte com as três cadeias do manifesto (a entidade proprietária, o
 * nome e a edição da Carta, e a licença), palavra por palavra. A da licença é a
 * forma exacta do manifesto, «CC BY 4.0» e não «CC-BY»: uma licença
 * identifica-se pela versão. */
function r6(m) {
  const erros = [];
  const { atribuicao, carta, licenca } = m.manifesto.fonte;
  const portaDaLinha = (lang) => routePath('linha', lang, { slug: LINHA_DA_CARTA });

  for (const pg of m.paginas.filter((p) => p.tipo === 'inicio' || p.tipo === 'distrito')) {
    const figura = pg.root.querySelector('[data-mapa-areas]')
      ? pg.root.querySelector('[data-mapa-raiz]')
      : pg.root.querySelector('[data-instrumento="mapa-do-distrito"]');
    if (!figura) {
      erros.push(`${pg.rota}: a página não tem a figura do mapa.`);
      continue;
    }

    /* (a) o selo, que abre a linha da Carta. */
    const selos = figura
      .querySelectorAll('a.src-chip')
      .map((a) => (a.getAttribute('href') ?? '').split('#')[0]);
    if (!selos.includes(portaDaLinha(pg.lang))) {
      erros.push(
        `${pg.rota}: o mapa não tem, na sua figura, o selo que abre ${portaDaLinha(pg.lang)}.`,
      );
    }

    /* (b) a menção escrita, com as três cadeias do manifesto. */
    const blocos = pg.root.querySelectorAll('[data-fonte-da-carta]');
    if (blocos.length === 0) {
      erros.push(
        `${pg.rota}: a página desenha um mapa e não escreve a menção da fonte. ` +
          `A menção de que a entidade proprietária é «${atribuicao}» é a única ` +
          `obrigação da licença da Carta, e a Emenda 20e põe-na onde o mapa está.`,
      );
      continue;
    }
    const texto = blocos.map((b) => b.text.replace(/\s+/g, ' ').trim()).join(' | ');
    for (const [nome, cadeia] of [
      ['a entidade proprietária', atribuicao],
      ['o nome e a edição da Carta', carta],
      ['a licença', licenca],
    ]) {
      if (!texto.includes(cadeia)) {
        erros.push(
          `${pg.rota}: a menção da fonte não escreve ${nome}, «${cadeia}», ` +
            `tal como o manifesto do motor a traz. Está lá: «${texto}».`,
        );
      }
    }
  }

  /* (c) e a linha que o selo abre nomeia a entidade proprietária. */
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

/* ---------------------------------------------------------------------------
 * A COLAÇÃO PORTUGUESA, E O QUE ELA MEDE AQUI (R7, I84)
 * ---------------------------------------------------------------------------
 * `Intl.Collator('pt')` põe «Évora» entre «Coimbra» e «Faro», e «Ilha da
 * Graciosa» antes de «Ilha Terceira». A comparação de cadeias põe a primeira
 * depois de «Viseu», porque É cai depois de Z nos pontos de código, e a segunda
 * depois da terceira, porque T maiúsculo vem antes de d minúsculo. A lista por
 * baixo do mapa já se ordena assim desde o X2 de 27.08.2026; o que faltava era o
 * ARTEFACTO, e é ele que esta regra mede.
 *
 * A ORDEM DOS CAMINHOS NÃO É UMA QUESTÃO DE ARRUMAÇÃO. Um caminho por unidade
 * dentro do `svg` é uma ligação, e a ordem em que eles são escritos é a ordem em
 * que o teclado os visita: quem navega o mapa por tabulação percorre as 29
 * unidades ou os concelhos de um distrito pela ordem do ficheiro, e nenhuma
 * folha de estilos a muda. O sítio não reordena o desenho, porque a fronteira
 * diz que o artefacto do motor é do motor; o que este portão faz é recusar um
 * artefacto que chegue fora da ordem da língua.
 *
 * O MANIFESTO ENTRA PELA MESMA RAZÃO: é ele que a primeira página lê para saber
 * que unidades existem, e uma ordem que divergisse do país seria a mesma lista
 * contada de duas maneiras.
 *
 * E AS PÁGINAS CONSTRUÍDAS ENTRAM PORQUE O ARTEFACTO CERTO NÃO CHEGA
 * (28.08.2026, leitura do Codex sobre a primeira volta desta correção). A
 * primeira forma desta regra media só os ficheiros de `mapa/`, e o índice dos
 * concelhos compõe a sua lista de outra fonte, o ficheiro de coordenadas da
 * Carta: os 29 cabeçalhos saíram na ordem da língua e os 308 nomes por baixo
 * deles continuaram na ordem do código oficial de cada concelho, em quatro dos
 * 29 grupos, nas duas edições. Os outros 25 estavam em ordem por acaso, e uma
 * lista que parece alfabética em 25 casos de 29 é pior do que uma que não
 * parece. O que a regra mede passa a ser o que a página IMPRIME.
 */
const COLACAO = new Intl.Collator('pt');

/**
 * O NOME QUE A PÁGINA IMPRIME, e não o que o gabarito tencionava imprimir.
 *
 * Um nome de concelho vive numa ligação, quando o concelho tem página, ou num
 * `span.concelho-nome`, quando não tem; e uma ligação leva a seta do destino
 * dentro dela, que não é nome nenhum. A seta sai, e o resto lê-se como está.
 */
const semSeta = (t) => t.replace(/\s+/g, ' ').replace(/\s*→\s*$/, '').trim();
const nomeDoGrupo = (sec) => semSeta(sec.querySelector('.concelhos-grupo-k a')?.text ?? '');
const nomesDaLista = (raiz, seletor) =>
  raiz.querySelectorAll(seletor).map((li) => {
    const alvo = li.querySelector('a') ?? li.querySelector('.concelho-nome') ?? li;
    return semSeta(alvo.text);
  });

/** O primeiro par fora da ordem da colação, ou `null` se a lista estiver ordenada. */
function primeiroParForaDaOrdem(nomes) {
  for (let i = 1; i < nomes.length; i++) {
    if (COLACAO.compare(nomes[i - 1], nomes[i]) > 0) {
      return { antes: nomes[i - 1], depois: nomes[i], posicao: i };
    }
  }
  return null;
}

/** R7 · a ordem dos caminhos de cada `svg`, e a das unidades do manifesto. */
function r7(m) {
  const erros = [];
  const confere = (onde, nomes) => {
    const par = primeiroParForaDaOrdem(nomes);
    if (!par) return;
    erros.push(
      `${onde}: «${par.antes}» está na posição ${par.posicao} e «${par.depois}» na ${par.posicao + 1}, ` +
        `e a colação portuguesa põe-nos ao contrário.`,
    );
  };

  confere('mapa/pais.json, os caminhos das unidades', m.pais.unidades.map((u) => u.nome));
  for (const u of m.pais.unidades) {
    confere(
      `mapa/distritos/${u.slug}.json, os caminhos dos concelhos`,
      m.distritos[u.slug].concelhos.map((c) => c.nome),
    );
  }
  confere('mapa/manifest.json, as unidades', m.manifesto.unidades.map((u) => u.nome));

  for (const pg of m.paginas.filter((p) => p.tipo === 'municipios')) {
    const grupos = pg.root.querySelectorAll('section.concelhos-grupo');
    confere(`${pg.rota}, os cabeçalhos dos grupos`, grupos.map(nomeDoGrupo));
    for (const g of grupos) {
      confere(`${pg.rota}, os concelhos de «${nomeDoGrupo(g)}»`, nomesDaLista(g, 'ul.concelhos-lista li'));
    }
  }
  for (const pg of m.paginas.filter((p) => p.tipo === 'distrito')) {
    confere(`${pg.rota}, a lista dos concelhos`, nomesDaLista(pg.root, '#concelhos li'));
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
  { id: 'R7', nome: 'a colação portuguesa nos artefactos e nas listas construídas', fn: r7 },
];

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * ===========================================================================
 * Um por regra, numa cópia em memória. Cada um é a coisa que a regra existe para
 * apanhar, e nenhum é apanhado pela contabilidade de outra: o estrago da R1 muda
 * um byte de um ficheiro e mais nada, o da R2 apaga um concelho de uma página
 * construída sem tocar no artefacto, e assim por diante.
 */
/**
 * Dois irmãos trocados de lugar dentro do pai, na cópia em memória de uma página.
 *
 * Faz-se sobre o HTML do pai e não com `exchangeChild`, porque o que se quer é
 * uma TROCA: pôr um por cima do outro deixa duas entradas iguais, e duas
 * entradas iguais estão em ordem para qualquer colação.
 */
function trocaIrmaos(pai, a, b) {
  const marca = '\u0000@\u0000';
  const html = pai.innerHTML.replace(a.outerHTML, marca).replace(b.outerHTML, a.outerHTML);
  pai.set_content(html.replace(marca, b.outerHTML));
}

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
  /* A MENÇÃO ESCRITA NA PRIMEIRA PÁGINA (Emenda 20e). É a metade nova da regra e
     é a que a licença obriga: o nome da entidade proprietária, ao pé do mapa
     mais visto do sítio. Retira-se do bloco da fonte e mais nada, para que o que
     apanhe o estrago seja a conferência da menção e não a do selo. */
  'R6 (a menção)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'inicio');
    const nome = m.manifesto.fonte.atribuicao;
    const bloco = pg.root.querySelector('[data-fonte-da-carta]');
    bloco.set_content(bloco.innerHTML.split(nome).join(''));
    return 'o nome da entidade proprietária retirado da menção da primeira página';
  },
  /* A R6 TEM TRÊS METADES E POR ISSO TEM TRÊS ESTRAGOS: o selo que abre a linha,
     a menção escrita ao pé do mapa, e a linha que nomeia a entidade
     proprietária. Um estrago só provava um terço da regra, e o que ficasse por
     provar era exactamente o que a licença obriga. */
  'R6 (a linha)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'linha');
    const nome = m.manifesto.fonte.atribuicao;
    pg.root = parse(pg.html.split(nome).join('Instituto Geográfico Nacional'));
    return 'a entidade proprietária trocada na página da linha da Carta';
  },
  /* A R7 LÊ TRÊS SÍTIOS E POR ISSO TEM TRÊS ESTRAGOS: os caminhos do país, os
     caminhos de um distrito, e as unidades do manifesto. Trocar duas unidades
     do país não desarruma o manifesto nem os distritos, e é essa a razão de os
     estragos serem três: cada um prova sozinho a metade que lhe toca, e um
     estrago só deixaria duas por provar. */
  R7: (m) => {
    const u = m.pais.unidades;
    [u[0], u[1]] = [u[1], u[0]];
    return `«${u[1].nome}» e «${u[0].nome}» trocadas nos caminhos de mapa/pais.json`;
  },
  'R7 (um distrito)': (m) => {
    const slug = m.pais.unidades[0].slug;
    const c = m.distritos[slug].concelhos;
    [c[0], c[1]] = [c[1], c[0]];
    return `«${c[1].nome}» e «${c[0].nome}» trocados nos caminhos de mapa/distritos/${slug}.json`;
  },
  'R7 (o manifesto)': (m) => {
    const u = m.manifesto.unidades;
    [u[0], u[1]] = [u[1], u[0]];
    return `«${u[1].nome}» e «${u[0].nome}» trocadas nas unidades do manifesto`;
  },
  /* E TRÊS ESTRAGOS NAS PÁGINAS, porque foi ali que a primeira volta falhou: o
     artefacto certo e a página com a sua própria ordem. Cada um troca dois
     irmãos numa cópia em memória da página construída, e nenhum toca no
     ficheiro que os outros leem.

     TROCAM-SE OS DOIS, E NÃO SE COPIA UM POR CIMA DO OUTRO. A primeira forma
     destes três punha o segundo irmão no lugar do primeiro, e a regra não os
     apanhava: duas linhas iguais estão em ordem, porque a colação as compara a
     zero. Um estrago que a regra não apanha é uma régua que se declara verde
     sem ter olhado, e por isso ele foi corrido antes de ser dado como bom. */
  'R7 (os cabeçalhos do índice)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'municipios');
    const g = pg.root.querySelectorAll('section.concelhos-grupo');
    const [a, b] = [nomeDoGrupo(g[0]), nomeDoGrupo(g[1])];
    trocaIrmaos(g[0].parentNode, g[0], g[1]);
    return `os grupos «${a}» e «${b}» trocados em ${pg.rota}`;
  },
  'R7 (os concelhos de um grupo)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'municipios');
    const lista = pg.root.querySelector('section.concelhos-grupo ul.concelhos-lista');
    const itens = lista.querySelectorAll('li');
    const [a, b] = [semSeta(itens[0].text), semSeta(itens[1].text)];
    trocaIrmaos(lista, itens[0], itens[1]);
    return `«${a}» e «${b}» trocados no primeiro grupo de ${pg.rota}`;
  },
  'R7 (a lista de um distrito)': (m) => {
    const pg = m.paginas.find((p) => p.tipo === 'distrito');
    const lista = pg.root.querySelector('#concelhos');
    const itens = lista.querySelectorAll('li');
    const [a, b] = [semSeta(itens[0].text), semSeta(itens[1].text)];
    trocaIrmaos(lista, itens[0], itens[1]);
    return `«${a}» e «${b}» trocados na lista de ${pg.rota}`;
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
