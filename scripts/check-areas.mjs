#!/usr/bin/env node
/**
 * =============================================================================
 * O PORTÃO DAS ÁREAS DE GOVERNO · `check:areas`
 * =============================================================================
 *
 * Corre na cadeia do `build`, depois do `check:regioes`, sobre o `dist/`
 * construído. É o item 3 do `design/especime-v3/briefs/BRIEF-areas-de-governo.md`,
 * e são seis regras:
 *
 *   A1  cada área com peças tem página nas duas edições, e nenhuma área sem
 *       peças tem página nenhuma;
 *   A2  cada peça do mapa tem a sua página construída, e a página da área abre a
 *       porta dela: cada medida citada, com selo para a sua linha na edição da
 *       página;
 *   A3  cada área declarada tem pelo menos uma peça, e cada página construída
 *       rende pelo menos uma;
 *   A4  uma peça em duas áreas traz, em cada uma, o organismo por que lá entrou,
 *       e os organismos são diferentes: sem isso é uma arrumação e não uma razão;
 *   A5  o nome de cada área é o da lista verificada, cada organismo tem artigo
 *       escrito, e nenhuma fonte do livro-razão fica sem decisão: ou está numa
 *       área, ou está na lista das que não têm área, com a razão ao lado;
 *   A6  a contagem de cada área, recontada de três pontos de observação: o mapa,
 *       as peças que a página rendeu, e os algarismos do índice.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 * Não importa `src/lib/areas.mjs`: é o leitor que as páginas usam, e uma
 * conferência que usasse o código das páginas confirmava-se a si própria. Lê a
 * lista de dados (`src/data/areas.mjs`), o livro-razão e o arquivo, e aplica
 * AQUI a regra do que é «ser peça de uma área», que é precisamente a regra que
 * se está a provar. `src/lib/routes.mjs` entra porque é a tabela de endereços da
 * casa, e não é a coisa que aqui se prova. É a mesma disciplina de
 * `check-regioes.mjs`, de `check-mapa.mjs` e de `check-dados.mjs`.
 *
 * ---------------------------------------------------------------------------
 * OS ESTRAGOS PLANTADOS (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Uma régua só conta depois de apanhar um estrago plantado, vista vermelha e
 * depois verde. `--vermelhos` planta um estrago por regra numa CÓPIA em memória
 * do mundo que as regras leem, e exige que a regra correspondente falhe. Nada é
 * escrito em disco, e por isso o estrago não pode sobreviver à corrida:
 *
 *   node scripts/check-areas.mjs                as seis regras
 *   node scripts/check-areas.mjs --vermelhos    e a linha de cada estrago
 *
 * Uso: `npm run check:areas`, e é o que a cadeia do `build` corre.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { routePath, LANGS } from '../src/lib/routes.mjs';
import { AREAS, SEM_AREA } from '../src/data/areas.mjs';
import { WORKS, ESTUDOS_DE_DADOS, INTERNAL_SOURCES } from '../src/data/studies.mjs';
import { loadClaims, POR_VERIFICAR } from '../src/lib/ledger.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const VERMELHOS = process.argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DAS ÁREAS · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/* ===========================================================================
 * O MUNDO QUE AS REGRAS LEEM
 * ===========================================================================
 * Um objecto só, com tudo lido uma vez: a lista de dados, o livro-razão, o
 * arquivo, as páginas construídas e as pastas que existem debaixo do índice. As
 * regras são funções puras sobre ele, e é isso que deixa `--vermelhos` plantar
 * um estrago numa cópia sem tocar em disco.
 */

/** A REGRA, escrita AQUI e não importada: a área de uma linha é a de quem a publica. */
function organismoDaLinha(area, claim) {
  return area.organismos.find((o) => o.fonte === claim.source) ?? null;
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

/** As peças de uma área, pela regra desta régua. */
function pecasDaArea(area, claims) {
  const trabalhos = new Map();
  const conjuntos = new Map();
  const medidas = [];
  for (const [id, c] of claims) {
    const org = organismoDaLinha(area, c);
    if (!org) continue;
    if (ESTUDOS_DE_DADOS.has(c.study)) {
      const p = conjuntos.get(c.study) ?? { id: c.study, organismos: new Set() };
      p.organismos.add(org.fonte);
      conjuntos.set(c.study, p);
      continue;
    }
    medidas.push({ id, organismo: org.fonte });
    const w = WORKS.find((x) => x.id === c.study);
    if (w) {
      const p = trabalhos.get(w.id) ?? { id: w.id, slug: w.slug, organismos: new Set() };
      p.organismos.add(org.fonte);
      trabalhos.set(w.id, p);
    }
  }
  return {
    trabalhos: [...trabalhos.values()],
    conjuntos: [...conjuntos.values()],
    medidas,
  };
}

function leMundo() {
  const claims = loadClaims();
  const entradas = AREAS.map((a) => {
    const pecas = pecasDaArea(a, claims);
    return {
      slug: a.slug,
      nome: { ...a.nome },
      organismos: a.organismos.map((o) => ({ ...o })),
      pecas,
      total: pecas.trabalhos.length + pecas.conjuntos.length + pecas.medidas.length,
    };
  });

  const paginas = {};
  const indices = {};
  const pastas = {};
  for (const lang of LANGS) {
    indices[lang] = lePagina(routePath('areas', lang));
    pastas[lang] = pastasDe(routePath('areas', lang));
    for (const e of entradas) {
      const p = lePagina(routePath('area', lang, { slug: e.slug }));
      if (p) paginas[`${lang}:${e.slug}`] = p;
    }
  }

  /* As fontes que o livro-razão tem, para a A5. É a lista que obriga a decidir
     sobre um organismo novo em vez de o deixar cair em silêncio.

     O MARCADOR NÃO É UM ORGANISMO, e por isso não entra. `[a verificar]` no campo
     da fonte é a linguagem de incerteza do sítio a dizer que a fonte daquela
     linha está por confirmar (IDENTIDADE §6), e uma coisa por confirmar não pode
     ter área nem exclusão escrita: teria de ser um dos dois, e não se sabe qual.
     O texto vem do módulo do marcador e nunca se escreve à mão (§1.40); é a mesma
     regra que `contasDoPortao()` aplica à chave `fontes`. No dia em que a fonte
     for confirmada, ela aparece nesta lista e a A5 obriga a decidir. */
  const fontes = new Set();
  for (const c of claims.values()) if (c.source && c.source !== POR_VERIFICAR) fontes.add(c.source);

  return { entradas, paginas, indices, pastas, fontes, ids: new Set(claims.keys()) };
}

/* ===========================================================================
 * AS REGRAS
 * ===========================================================================
 */

/** A1 · cada área com peças tem página nas duas edições, e mais nenhuma. */
function A1(m) {
  const erros = [];
  const esperadas = m.entradas.filter((e) => e.total > 0).map((e) => e.slug);
  for (const lang of LANGS) {
    if (!m.indices[lang]) erros.push(`falta o índice ${routePath('areas', lang)}.`);
    for (const slug of esperadas) {
      if (!m.paginas[`${lang}:${slug}`]) {
        erros.push(`falta a página ${routePath('area', lang, { slug })}.`);
      }
    }
    for (const n of m.pastas[lang].filter((x) => !esperadas.includes(x))) {
      erros.push(
        `${routePath('areas', lang)}/${n} existe e não é uma área com peças. ` +
          `Uma página que só tivesse o nome de um ministério não é conteúdo.`,
      );
    }
  }
  return erros;
}

/** A2 · a porta de cada peça abre, e cada medida vai citada com selo. */
function A2(m) {
  const erros = [];
  const existe = (rota) => fs.existsSync(path.join(DIST, rota.replace(/^\//, ''), 'index.html'));
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
    const portas = new Set(
      raiz
        .querySelectorAll('a[href]')
        .map((el) => el.getAttribute('href'))
        .filter(Boolean),
    );

    for (const t of e.pecas.trabalhos) {
      const porta = routePath('estudo', lang, { slug: t.slug });
      if (!existe(porta)) erros.push(`${p.rota}: o trabalho "${t.id}" não tem página em ${porta}.`);
      if (!portas.has(porta)) erros.push(`${p.rota}: não abre a porta do trabalho "${t.id}".`);
    }
    for (const c of e.pecas.conjuntos) {
      const chaveDaRota = INTERNAL_SOURCES.find((s) => s.id === c.id)?.conjunto ?? null;
      if (!chaveDaRota) {
        erros.push(`${p.rota}: o conjunto "${c.id}" não declara a rota da sua página.`);
        continue;
      }
      const porta = routePath(chaveDaRota, lang);
      if (!existe(porta)) erros.push(`${p.rota}: o conjunto "${c.id}" não tem página em ${porta}.`);
      if (!portas.has(porta)) erros.push(`${p.rota}: não abre a porta do conjunto "${c.id}".`);
    }
    for (const md of e.pecas.medidas) {
      if (!m.ids.has(md.id)) {
        erros.push(`${p.rota}: a medida "${md.id}" não é uma afirmação do livro-razão.`);
        continue;
      }
      if (!citados.has(md.id)) erros.push(`${p.rota}: não cita a medida "${md.id}".`);
      const porta = routePath('linha', lang, { slug: md.id });
      if (!selos.has(porta)) erros.push(`${p.rota}: a medida "${md.id}" não tem selo para ${porta}.`);
    }
  }
  return erros;
}

/** A3 · nenhuma área vazia, nem no mapa nem na página construída. */
function A3(m) {
  const erros = [];
  for (const e of m.entradas) {
    if (e.total === 0) {
      erros.push(
        `a área "${e.slug}" está declarada e não tem peça nenhuma. ` +
          `Ou a lei lhe dá um organismo que publica alguma linha, ou ela não existe no sítio.`,
      );
    }
  }
  for (const [chave, p] of Object.entries(m.paginas)) {
    const rendidas = parse(p.html).querySelectorAll('[data-area-peca]').length;
    if (rendidas === 0) erros.push(`${p.rota}: a página não rende peça nenhuma (${chave}).`);
  }
  return erros;
}

/** A4 · uma peça em duas áreas traz a razão de cada uma, e as razões diferem. */
function A4(m) {
  const erros = [];
  const onde = new Map();
  for (const e of m.entradas) {
    const todas = [
      ...e.pecas.trabalhos.map((p) => ['trabalho', p.id, p.organismos]),
      ...e.pecas.conjuntos.map((p) => ['conjunto', p.id, p.organismos]),
      ...e.pecas.medidas.map((p) => ['medida', p.id, new Set([p.organismo])]),
    ];
    for (const [tipo, id, orgs] of todas) {
      const chave = `${tipo}:${id}`;
      const lista = onde.get(chave) ?? [];
      lista.push({ area: e.slug, organismos: [...orgs] });
      onde.set(chave, lista);
    }
  }
  for (const [chave, lista] of onde) {
    if (lista.length < 2) continue;
    for (const x of lista) {
      if (x.organismos.length === 0) {
        erros.push(`a peça "${chave}" está na área "${x.area}" sem organismo escrito.`);
      }
    }
    const assinaturas = lista.map((x) => [...x.organismos].sort().join('|'));
    if (new Set(assinaturas).size !== assinaturas.length) {
      erros.push(
        `a peça "${chave}" está em ${lista.length} áreas (${lista
          .map((x) => x.area)
          .join(', ')}) e duas delas dão o mesmo organismo como razão.`,
      );
    }
  }
  return erros;
}

/** A5 · os nomes e os artigos declarados, e nenhuma fonte por decidir. */
function A5(m) {
  const erros = [];
  const slugs = new Set();
  for (const e of m.entradas) {
    if (slugs.has(e.slug)) erros.push(`a área "${e.slug}" está declarada duas vezes.`);
    slugs.add(e.slug);
    for (const lang of LANGS) {
      const nome = e.nome[lang];
      if (typeof nome !== 'string' || nome.trim() === '') {
        erros.push(`a área "${e.slug}" não tem nome publicado na edição "${lang}".`);
      }
    }
    if (e.organismos.length === 0) {
      erros.push(`a área "${e.slug}" não declara organismo nenhum.`);
    }
    for (const o of e.organismos) {
      if (!o.artigo || !/^Artigo \d+\.º/.test(o.artigo)) {
        erros.push(
          `o organismo "${o.fonte}" da área "${e.slug}" não nomeia o artigo da lei orgânica ` +
            `que o põe lá.`,
        );
      }
      if (!o.citacao || o.citacao.trim() === '') {
        erros.push(`o organismo "${o.fonte}" da área "${e.slug}" não transcreve a frase da lei.`);
      }
    }
    /* E as páginas construídas rendem o nome declarado, e não outro. */
    for (const lang of LANGS) {
      const p = m.paginas[`${lang}:${e.slug}`];
      if (!p) continue;
      const h1 = parse(p.html).querySelector('h1');
      const rendido = (h1?.text ?? '').replace(/\s+/g, ' ').trim();
      if (rendido !== e.nome[lang]) {
        erros.push(`${p.rota}: rende o nome "${rendido}" e a lista verificada diz "${e.nome[lang]}".`);
      }
    }
  }
  /* Nenhuma fonte do livro-razão sem decisão escrita. */
  const comArea = new Set(m.entradas.flatMap((e) => e.organismos.map((o) => o.fonte)));
  const semArea = new Set(SEM_AREA.map((x) => x.fonte));
  for (const f of m.fontes) {
    if (comArea.has(f) || semArea.has(f)) continue;
    erros.push(
      `a fonte "${f}" tem linhas no livro-razão e não está nem numa área nem na lista das que ` +
        `não têm área. Uma fonte nova precisa de uma decisão escrita, não de um silêncio.`,
    );
  }
  for (const x of SEM_AREA) {
    if (!x.motivo || x.motivo.trim() === '') {
      erros.push(`a fonte "${x.fonte}" está fora das áreas sem razão escrita.`);
    }
  }
  return erros;
}

/** A6 · a contagem de cada área, de três pontos de observação. */
function A6(m) {
  const erros = [];
  for (const e of m.entradas) {
    if (e.total === 0) continue;
    for (const lang of LANGS) {
      const p = m.paginas[`${lang}:${e.slug}`];
      if (!p) continue;
      const rendidas = parse(p.html).querySelectorAll('[data-area-peca]').length;
      if (rendidas !== e.total) {
        erros.push(`${p.rota}: rende ${rendidas} peça(s) e o mapa dá ${e.total}.`);
      }
    }
    const chave = `areas_pecas_${e.slug.replace(/-/g, '_')}`;
    for (const lang of LANGS) {
      const idx = m.indices[lang];
      if (!idx) continue;
      const el = parse(idx.html).querySelector(`[data-prova="${chave}"]`);
      if (!el) {
        erros.push(`${idx.rota}: não rende a contagem "${chave}".`);
        continue;
      }
      const rendido = el.text.replace(/\s+/g, ' ').trim();
      if (rendido !== String(e.total)) {
        erros.push(`${idx.rota}: rende "${rendido}" para "${e.slug}" e o mapa dá ${e.total}.`);
      }
    }
  }
  return erros;
}

const REGRAS = [
  ['A1', 'cada área com peças tem página, e nenhuma outra tem', A1],
  ['A2', 'a porta de cada peça abre, e cada medida vai com selo', A2],
  ['A3', 'nenhuma área vazia, no mapa nem na página', A3],
  ['A4', 'uma peça em duas áreas traz a razão de cada uma', A4],
  ['A5', 'os nomes e os artigos, e nenhuma fonte por decidir', A5],
  ['A6', 'a contagem de cada área, de três pontos de observação', A6],
];

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * ===========================================================================
 * Cada um mexe numa CÓPIA do mundo, e a regra correspondente tem de o ver.
 */
const ESTRAGOS = {
  A1: (m) => {
    /* Uma página de área apagada: o índice leva a uma porta que não abre. */
    const chave = Object.keys(m.paginas)[0];
    delete m.paginas[chave];
    const [lang, slug] = chave.split(':');
    m.pastas[lang] = m.pastas[lang].filter((n) => n !== slug);
    return `a página ${lang}:${slug} apagada`;
  },
  A2: (m) => {
    /* O selo de uma medida retirado: o valor fica sem porta para a sua linha. */
    const chave = Object.keys(m.paginas).find((k) => {
      const e = m.entradas.find((x) => x.slug === k.split(':')[1]);
      return e && e.pecas.medidas.length > 0;
    });
    const [lang, slug] = chave.split(':');
    const e = m.entradas.find((x) => x.slug === slug);
    const porta = routePath('linha', lang, { slug: e.pecas.medidas[0].id });
    m.paginas[chave] = {
      ...m.paginas[chave],
      html: m.paginas[chave].html.split(`href="${porta}"`).join('href="#"'),
    };
    return `o selo de "${e.pecas.medidas[0].id}" retirado de ${lang}:${slug}`;
  },
  A3: (m) => {
    /* Uma área declarada sem organismo que publique linha nenhuma. */
    m.entradas.push({
      slug: 'atlantida',
      nome: { pt: 'Atlântida', en: 'Atlantis' },
      organismos: [
        {
          fonte: 'Direção-Geral da Atlântida',
          artigo: 'Artigo 99.º',
          poder: 'direção',
          citacao: 'não existe',
        },
      ],
      pecas: { trabalhos: [], conjuntos: [], medidas: [] },
      total: 0,
    });
    return 'uma área "atlantida" declarada, sem peça nenhuma por baixo';
  },
  A4: (m) => {
    /* A mesma medida em duas áreas pelo mesmo organismo: uma arrumação. */
    const a = m.entradas.find((x) => x.pecas.medidas.length > 0);
    const b = m.entradas.find((x) => x !== a);
    b.pecas.medidas = [...b.pecas.medidas, { ...a.pecas.medidas[0] }];
    b.total += 1;
    return `a medida "${a.pecas.medidas[0].id}" posta também em "${b.slug}", com o mesmo organismo`;
  },
  A5: (m) => {
    /* Uma fonte nova no livro-razão, sem decisão escrita em lado nenhum. */
    m.fontes.add('Instituto Hidrográfico');
    return 'uma linha da "Instituto Hidrográfico" no livro-razão, sem área e sem exclusão';
  },
  A6: (m) => {
    /* Uma peça a mais no mapa que a página não rende: as contas divergem. */
    const e = m.entradas.find((x) => x.total > 0);
    e.total += 1;
    return `o mapa da área "${e.slug}" com uma peça a mais do que a página rende`;
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
  const comPecas = mundo.entradas.filter((e) => e.total > 0);
  console.log(
    cinza(
      `\n  áreas · ${mundo.entradas.length} declarada(s), ${comPecas.length} com peças · ` +
        `${Object.keys(mundo.paginas).length} página(s) de área construída(s)\n` +
        comPecas
          .map(
            (e) =>
              `      ${e.slug} · ${e.total} peça(s): ${e.pecas.trabalhos.length} trabalho(s), ` +
              `${e.pecas.conjuntos.length} conjunto(s), ${e.pecas.medidas.length} medida(s)`,
          )
          .join('\n') +
        '\n',
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
