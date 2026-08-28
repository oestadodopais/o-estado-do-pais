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
 *   A4  uma peça em duas áreas traz, em cada uma, a matéria por que lá entrou,
 *       e as matérias são diferentes: sem isso é uma arrumação e não uma razão;
 *   A5  o nome de cada área é o da lista verificada, e cada matéria tem o artigo
 *       da lei, a transcrição do número e pelo menos uma regra com a razão
 *       escrita;
 *   A6  a contagem de cada área, recontada de três pontos de observação: o mapa,
 *       as peças que a página rendeu, e os algarismos do índice;
 *   A7  a cobertura: cada uma das linhas do livro-razão é coberta por uma
 *       matéria de uma área OU por uma entrada da lista das que ficam fora, e
 *       nunca pelas duas. É a regra que faz a lista das exclusões valer alguma
 *       coisa: uma linha nova sem assunto declarado fecha a construção.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 * Não importa `src/lib/areas.mjs`: é o leitor que as páginas usam, e uma
 * conferência que usasse o código das páginas confirmava-se a si própria. Lê a
 * lista de dados (`src/data/areas.mjs`), o livro-razão e o arquivo, e aplica
 * AQUI a regra do que é «ser peça de uma área», que é a matéria da lei a cobrir
 * o assunto da linha, e é precisamente a regra que se está a provar.
 * `src/lib/routes.mjs` entra porque é a tabela de endereços da casa, e não é a
 * coisa que aqui se prova. É a mesma disciplina de
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
 *   node scripts/check-areas.mjs                as sete regras
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
import { loadClaims } from '../src/lib/ledger.mjs';

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

/**
 * A REGRA, escrita AQUI e não importada: a área de uma linha é a do ministério
 * cujas matérias cobrem o assunto dela.
 */
function casaComARegra(regra, id, claim) {
  if (regra.estudos && !regra.estudos.includes(claim.study)) return false;
  return regra.id.test(id);
}

function materiaDaLinha(area, id, claim) {
  for (const m of area.materias) {
    for (const r of m.regras) {
      if (casaComARegra(r, id, claim)) return { materia: m.materia, artigo: m.artigo };
    }
  }
  return null;
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
    const m = materiaDaLinha(area, id, c);
    if (!m) continue;
    if (ESTUDOS_DE_DADOS.has(c.study)) {
      const p = conjuntos.get(c.study) ?? { id: c.study, materias: new Set() };
      p.materias.add(m.materia);
      conjuntos.set(c.study, p);
      continue;
    }
    medidas.push({ id, materia: m.materia });
    const w = WORKS.find((x) => x.id === c.study);
    if (w) {
      const p = trabalhos.get(w.id) ?? { id: w.id, slug: w.slug, materias: new Set() };
      p.materias.add(m.materia);
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
      materias: a.materias.map((m) => ({ ...m, regras: m.regras.map((r) => ({ ...r })) })),
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

  /* O LIVRO-RAZÃO INTEIRO, para a A7. A cobertura mede-se sobre as linhas e não
     sobre as fontes: a regra da matéria não olha para quem publica, e uma linha
     nova de uma fonte já conhecida é tão capaz de ficar sem assunto declarado
     como uma linha de uma fonte nova.

     A FONTE POR CONFIRMAR DEIXOU DE SER UM PROBLEMA, e é a diferença mais limpa
     entre as duas regras. Com a regra antiga, uma linha cuja fonte é o marcador
     `[a verificar]` não podia ter área nem exclusão escrita, porque as duas
     dependiam de saber quem publicava; a régua tinha de a excluir da conta. Com
     a regra da matéria o assunto da linha não depende de quem a publica, e as
     três linhas do marcador entram na cobertura como todas as outras. */
  const linhas = [...claims].map(([id, c]) => ({ id, study: c.study }));

  /* A LISTA DAS EXCLUSÕES ENTRA NO MUNDO, e não é preciosismo: é o que deixa
     `--vermelhos` plantar nela uma entrada a mais sem escrever no ficheiro de
     dados. Uma régua que lesse a constante do módulo não podia ser posta à
     prova sem editar o módulo. */
  const fora = SEM_AREA.map((x) => ({ ...x }));

  return { entradas, paginas, indices, pastas, linhas, fora, ids: new Set(claims.keys()) };
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
          `Ou alguma linha do livro-razão tem por assunto uma matéria dela, ou ela não existe ` +
          `no sítio.`,
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
      ...e.pecas.trabalhos.map((p) => ['trabalho', p.id, p.materias]),
      ...e.pecas.conjuntos.map((p) => ['conjunto', p.id, p.materias]),
      ...e.pecas.medidas.map((p) => ['medida', p.id, new Set([p.materia])]),
    ];
    for (const [tipo, id, mats] of todas) {
      const chave = `${tipo}:${id}`;
      const lista = onde.get(chave) ?? [];
      lista.push({ area: e.slug, materias: [...mats] });
      onde.set(chave, lista);
    }
  }
  for (const [chave, lista] of onde) {
    if (lista.length < 2) continue;
    for (const x of lista) {
      if (x.materias.length === 0) {
        erros.push(`a peça "${chave}" está na área "${x.area}" sem matéria escrita.`);
      }
    }
    const assinaturas = lista.map((x) => [...x.materias].sort().join('|'));
    if (new Set(assinaturas).size !== assinaturas.length) {
      erros.push(
        `a peça "${chave}" está em ${lista.length} áreas (${lista
          .map((x) => x.area)
          .join(', ')}) e duas delas dão a mesma matéria como razão.`,
      );
    }
  }
  return erros;
}

/** A5 · os nomes, e cada matéria com o artigo, a transcrição e a razão. */
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
    if (e.materias.length === 0) {
      erros.push(`a área "${e.slug}" não declara matéria nenhuma.`);
    }
    for (const x of e.materias) {
      if (!x.materia || x.materia.trim() === '') {
        erros.push(`a área "${e.slug}" tem uma matéria sem nome.`);
      }
      if (!x.artigo || !/^Artigo \d+\.º, n\.º \d+$/.test(x.artigo)) {
        erros.push(
          `a matéria "${x.materia}" da área "${e.slug}" não nomeia o artigo e o número da lei ` +
            `orgânica que a listam.`,
        );
      }
      if (!x.citacao || x.citacao.trim() === '') {
        erros.push(`a matéria "${x.materia}" da área "${e.slug}" não transcreve o número da lei.`);
      }
      /* A MATÉRIA TEM DE ESTAR NA TRANSCRIÇÃO, palavra por palavra. Sem isto, o
         nome de uma matéria podia ser uma paráfrase nossa ao lado de uma citação
         que diz outra coisa, e a citação deixava de a provar. */
      if (x.citacao && x.materia && !x.citacao.includes(x.materia)) {
        erros.push(
          `a matéria "${x.materia}" da área "${e.slug}" não ocorre na transcrição do número ` +
            `"${x.artigo}": ou a matéria não é a palavra da lei, ou a transcrição não é a do número.`,
        );
      }
      if (!Array.isArray(x.regras) || x.regras.length === 0) {
        erros.push(`a matéria "${x.materia}" da área "${e.slug}" não tem regra nenhuma.`);
        continue;
      }
      for (const r of x.regras) {
        if (!(r.id instanceof RegExp)) {
          erros.push(`uma regra da matéria "${x.materia}" ("${e.slug}") não diz que linhas cobre.`);
        }
        if (!r.razao || r.razao.trim() === '') {
          erros.push(
            `uma regra da matéria "${x.materia}" ("${e.slug}") não escreve a razão: que assunto ` +
              `é o das linhas dela, e porque é que esta matéria o cobre.`,
          );
        }
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
  for (const x of m.fora) {
    if (!x.motivo || x.motivo.trim() === '') {
      erros.push(`o assunto "${x.assunto}" está fora das áreas sem razão escrita.`);
    }
    if (!x.assunto || x.assunto.trim() === '') {
      erros.push('uma entrada da lista das que ficam fora não diz de que assunto se trata.');
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

/**
 * A7 · a cobertura: cada linha do livro-razão coberta uma vez, e só uma.
 *
 * É a regra que substitui a antiga «nenhuma fonte por decidir», e mede mais do
 * que ela: não são as fontes que precisam de decisão, são as LINHAS. Uma linha
 * é coberta por uma matéria de uma área ou por uma entrada da lista das que
 * ficam fora; se não for coberta por nenhuma, alguém acrescentou um assunto ao
 * sítio sem dizer de quem ele é, e se for coberta por duas, duas declarações
 * dizem coisas diferentes sobre a mesma linha.
 */
function A7(m) {
  const erros = [];
  const regras = [];
  for (const e of m.entradas) {
    for (const x of e.materias) {
      for (const r of x.regras) regras.push({ onde: `${e.slug} · ${x.materia}`, regra: r });
    }
  }
  for (const x of m.fora) regras.push({ onde: `fora · ${x.assunto}`, regra: x });

  const semNada = [];
  const duasVezes = [];
  for (const l of m.linhas) {
    const casadas = regras.filter((x) => casaComARegra(x.regra, l.id, l));
    if (casadas.length === 0) semNada.push(`${l.id} (estudo "${l.study}")`);
    else if (casadas.length > 1) duasVezes.push(`${l.id}: ${casadas.map((x) => x.onde).join(' | ')}`);
  }
  for (const x of semNada.slice(0, 8)) {
    erros.push(
      `a linha ${x} não é coberta por matéria nenhuma nem está na lista das que ficam fora. ` +
        `Uma linha nova precisa de um assunto declarado, não de um silêncio.`,
    );
  }
  if (semNada.length > 8) erros.push(`… e mais ${semNada.length - 8} linha(s) sem assunto declarado.`);
  for (const x of duasVezes.slice(0, 8)) erros.push(`a linha ${x} está coberta duas vezes.`);
  if (duasVezes.length > 8) erros.push(`… e mais ${duasVezes.length - 8} linha(s) cobertas duas vezes.`);
  return erros;
}

const REGRAS = [
  ['A1', 'cada área com peças tem página, e nenhuma outra tem', A1],
  ['A2', 'a porta de cada peça abre, e cada medida vai com selo', A2],
  ['A3', 'nenhuma área vazia, no mapa nem na página', A3],
  ['A4', 'uma peça em duas áreas traz a razão de cada uma', A4],
  ['A5', 'os nomes, e cada matéria com artigo, transcrição e razão', A5],
  ['A6', 'a contagem de cada área, de três pontos de observação', A6],
  ['A7', 'cada linha do livro-razão coberta uma vez, e só uma', A7],
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
    /* Uma área declarada com uma matéria que não cobre linha nenhuma. */
    m.entradas.push({
      slug: 'atlantida',
      nome: { pt: 'Atlântida', en: 'Atlantis' },
      materias: [
        {
          materia: 'as políticas do mar interior',
          artigo: 'Artigo 99.º, n.º 1',
          citacao: 'as políticas do mar interior',
          regras: [{ id: /^nada-casa-com-isto$/, razao: 'não existe' }],
        },
      ],
      pecas: { trabalhos: [], conjuntos: [], medidas: [] },
      total: 0,
    });
    return 'uma área "atlantida" declarada, sem peça nenhuma por baixo';
  },
  A4: (m) => {
    /* A mesma medida em duas áreas pela mesma matéria: uma arrumação. */
    const a = m.entradas.find((x) => x.pecas.medidas.length > 0);
    const b = m.entradas.find((x) => x !== a);
    b.pecas.medidas = [...b.pecas.medidas, { ...a.pecas.medidas[0] }];
    b.total += 1;
    return `a medida "${a.pecas.medidas[0].id}" posta também em "${b.slug}", com a mesma matéria`;
  },
  A5: (m) => {
    /* Uma regra sem a razão escrita: a matéria fica sem dizer que assunto cobre. */
    const e = m.entradas.find((x) => x.materias.length > 0);
    e.materias[0].regras[0].razao = '';
    return `a razão da primeira regra de "${e.materias[0].materia}" ("${e.slug}") apagada`;
  },
  A6: (m) => {
    /* Uma peça a mais no mapa que a página não rende: as contas divergem. */
    const e = m.entradas.find((x) => x.total > 0);
    e.total += 1;
    return `o mapa da área "${e.slug}" com uma peça a mais do que a página rende`;
  },
  /* A A7 leva DOIS estragos, porque falha de duas maneiras e as duas contam. */
  A7: [
    (m) => {
      /* Uma linha nova no livro-razão, sem assunto declarado em lado nenhum. */
      m.linhas.push({ id: 'mares-territoriais-2026', study: 'quadro-institucional' });
      return 'uma linha "mares-territoriais-2026" no livro-razão, sem matéria e sem exclusão';
    },
    (m) => {
      /* Uma exclusão que cobre uma linha que já tem matéria: duas declarações
         sobre a mesma linha, e a lista deixa de dizer uma coisa só. */
      const e = m.entradas.find((x) => x.pecas.medidas.length > 0);
      const id = e.pecas.medidas[0].id;
      m.fora.push({
        assunto: 'uma exclusão que se sobrepõe a uma matéria',
        id: new RegExp(`^${id}$`),
        motivo: 'plantado',
      });
      return `a linha "${id}" posta também na lista das que ficam fora`;
    },
  ],
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
  /* Uma regra pode ter mais do que um estrago: falha de mais do que uma
     maneira, e cada maneira tem de ser vista. */
  const plantas = Array.isArray(ESTRAGOS[nome]) ? ESTRAGOS[nome] : [ESTRAGOS[nome]];
  for (const planta of plantas) {
    const copia = leMundo();
    const descricao = planta(copia);
    const erros = fn(copia);
    const viu = erros.length > 0;
    if (!viu) todosVermelhos = false;
    saida.push(
      `  ${viu ? verde('✓ vermelho') : vermelho('✗ passou')} ${nome} · ${descricao}` +
        (viu ? cinza(`\n      ${erros[0]}`) : ''),
    );
  }
}
console.log('\n' + saida.join('\n') + '\n');
process.exit(todosVermelhos ? 0 : 1);
