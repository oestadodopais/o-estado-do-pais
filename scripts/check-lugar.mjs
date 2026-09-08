#!/usr/bin/env node
/**
 * A RÉGUA DO BLOCO F1.10 · «uma coisa, um lugar».
 *
 * Corre DEPOIS do `astro build`, sobre `dist/`, no `verify`.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, E PORQUE É QUE NENHUMA DAS OUTRAS O MEDE
 * ---------------------------------------------------------------------------
 * O `BRIEF-F1.10-uma-coisa-um-lugar.md` fixa uma regra («cada conteúdo tem um
 * lugar de apresentação inteira; em todo o outro sítio aparece como uma porta ou
 * não aparece»), um vocabulário fechado e um caminho no cabeçalho. Nenhuma das
 * outras réguas do sítio sabe nada disto: o portão de HTML confere origens, o da
 * voz confere que cada frase está declarada, o das formas confere o que um
 * desenho pode desenhar. Uma repetição de conteúdo é HTML válido, com origem
 * declarada e frase inventariada, e passa nas três.
 *
 * Sem esta régua, o que o bloco arruma fica guardado pela leitura de quem revê o
 * diff, e volta ao primeiro descuido.
 *
 * ---------------------------------------------------------------------------
 * OS TETOS, E PORQUE É QUE ELES EXISTEM EM VEZ DE UM ZERO
 * ---------------------------------------------------------------------------
 * O bloco é longo e entra por itens: cada item baixa um teto, e o teto é o
 * número MEDIDO no dia em que o item entrou, escrito aqui com a data. Um teto
 * NUNCA sobe sem uma decisão escrita ao lado, e a régua falha quando a medição
 * passa dele — que é o que a torna uma régua e não um relatório.
 *
 * A régua também falha quando a medição fica ABAIXO de um teto que já devia ter
 * descido: `TETO_FROUXO` diz quantas unidades de folga um teto pode ter antes de
 * ser um teto que já não mede nada. Um teto frouxo é uma régua a dormir.
 *
 * ---------------------------------------------------------------------------
 * AS EXCEÇÕES, ESCRITAS POR NOME
 * ---------------------------------------------------------------------------
 * O §3 do brief põe DUAS FAMÍLIAS DE PÁGINAS inteiras fora do bloco: os
 * documentos alojados (rota `documento`) e as páginas de leitura (rota `texto`).
 * São transcrição — o texto de outra pessoa, publicado como ela o escreveu — e a
 * regra da casa é que o que se copia de uma fonte fica como a fonte o escreveu.
 * Saem por NOME DE ROTA, e não por um salto silencioso.
 *
 * As outras três exceções são CADEIAS, e estão em `EXCECOES_DO_VOCABULARIO`,
 * cada uma com a razão e com a origem. A régua exige que cada uma seja ENCONTRADA
 * pelo menos uma vez no `dist/`: uma exceção que já não é precisa é uma porta
 * aberta esquecida, e fecha a construção como uma violação fecharia.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

import { matchPath, routePath, normalizePath, LANGS } from '../src/lib/routes.mjs';
import { loadClaims } from '../src/lib/ledger.mjs';
import { t } from '../src/i18n/strings.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

/* ---------------------------------------------------------------------------
 * AS DUAS FAMÍLIAS DE FORA (§3 do brief)
 * --------------------------------------------------------------------------- */
const ROTAS_DE_TRANSCRICAO = new Set(['documento', 'texto']);

/* A página de erro não tem caminho na tabela de rotas e não é uma página do
   leitor: é o que o servidor devolve quando não há página nenhuma. */
const FICHEIROS_SEM_ROTA = new Set(['404.html', 'en/404.html']);

/* ---------------------------------------------------------------------------
 * OS TETOS
 * ---------------------------------------------------------------------------
 * Cada linha diz: a medida, o teto, e a data em que o número foi medido. O
 * número é sempre o que a própria régua imprime, e nunca um palpite.
 */
const TETO_FROUXO = 8;
const TETOS = {
  /* L1 · páginas com dois destinos iguais fora do cabeçalho e do rodapé.
     TODOS os tetos desta tabela foram medidos a 08.09.2026 sobre o `dist/` da
     fusão de `origin/main` (43f4b52a) na cabeça `47d957f6`, com
     `node scripts/check-lugar.mjs`, e nenhum foi escrito à mão. */
  l1_paginas: 6596,
  /* L2a · páginas, fora de `/municipios`, que ligam a mais de `L2_LIMITE_NOMES`
     concelhos fora de uma lista fechada. */
  l2_segundas_listas: 2,
  /* L2b · rendições da régua inteira da convergência fora de `/regioes`. */
  l2_reguas: 18,
  /* L2c · sinopses de estudo fora de `/estudos`. */
  l2_sinopses: 10,
  /* L3 · ocorrências do vocabulário fechado no texto da casa, fora das
     exceções e das duas famílias de transcrição. */
  l3_vocabulario: 51,
  /* L4 · falhas: uma frase de definição ou de hierarquia que não está a 1 onde
     o §2 do brief a manda estar. */
  l4_falhas: 10,
  /* L5 · páginas abaixo da primeira sem caminho no cabeçalho. */
  l5_sem_caminho: 7211,
  /* L6 · selos cuja etiqueta não é o publicador da linha. */
  l6_selos: 26168,
  /* 8.5 · blocos com «limiar» sem o qualificador nem a frase ao lado. */
  d85_limiar_sozinho: 706,
  /* 8.8 · «livro-razão» nos menus, nos rodapés e nos títulos das páginas. */
  d88_livro_razao: 24172,
  /* 8.13 · valores selados na secção dos domínios da primeira página. */
  d813_selos_nos_dominios: 4,
  /* 8.14 · «Relance» e «Leitura breve» nas páginas do leitor. */
  d814_densidades: 1304,
};

/* Quantos concelhos ligados fora de uma lista fechada fazem uma segunda lista.
   Um punhado de portas para concelhos vizinhos não é um índice; 30 é. */
const L2_LIMITE_NOMES = 30;

/* ---------------------------------------------------------------------------
 * AS PALAVRAS DO VOCABULÁRIO FECHADO (§2.3 do brief; `DECISIONS.md` §1.98)
 * ---------------------------------------------------------------------------
 * A palavra visível do território é «concelho»; o trabalho de autor é um
 * «estudo»; «indicador» e «peça» saem; «Relance» e «Leitura breve» ficam só
 * como os nomes das duas densidades de um cartão.
 *
 * A EDIÇÃO INGLESA NÃO ENTRA NA L3, e a razão está no relatório do bloco:
 * «municipality» é a tradução de «concelho» e não uma segunda palavra para a
 * mesma coisa. O defeito que o leitor de primeira vez mediu é do português. As
 * palavras inglesas que a L3 mede são as que a decisão também fecha em inglês.
 */
const VOCABULARIO = [
  { palavra: 'município', porque: 'o território diz-se «concelho» (§1.98)' },
  { palavra: 'Município', porque: 'o território diz-se «concelho» (§1.98)' },
  { palavra: 'municípios', porque: 'o território diz-se «concelhos» (§1.98)' },
  { palavra: 'Municípios', porque: 'o território diz-se «concelhos» (§1.98)' },
  { palavra: 'indicador', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'indicadores', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'Indicador', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'Indicadores', porque: 'o número interpretado é uma «medida» (§1.98)' },
  { palavra: 'peça', porque: '«peça» sai do vocabulário do sítio (§1.98)' },
  { palavra: 'peças', porque: '«peça» sai do vocabulário do sítio (§1.98)' },
  { palavra: 'trabalho', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
  { palavra: 'trabalhos', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
  { palavra: 'Trabalhos', porque: 'o trabalho de autor é um «estudo» (§1.98)' },
];

/* As duas palavras das densidades, que o item 8.14 tira das páginas do leitor. */
const DENSIDADES = ['Relance', 'Leitura breve', 'At a glance', 'Brief reading'];

/* ---------------------------------------------------------------------------
 * AS EXCEÇÕES DO VOCABULÁRIO, POR NOME
 * ---------------------------------------------------------------------------
 * Cada uma é um BLOCO DE TEXTO INTEIRO: a régua compara o bloco que leu com esta
 * lista, e só o dispensa quando ele é um deles por igual. Uma palavra proibida
 * num bloco parecido não passa por semelhança.
 */
const EXCECOES_DO_VOCABULARIO = [
  {
    /* A política de IA copia a `POLITICA-DA-AUTONOMIA.md`, que é o documento
       aprovado pelo diretor, e a regra da casa é que o que se copia de uma fonte
       fica como a fonte o escreveu. As três frases estão em
       `src/data/politica-ia.mjs`. */
    conta: 'peça',
    porque: 'a política de IA copia a POLITICA-DA-AUTONOMIA.md e fica como a fonte a escreveu',
    padrao: /peça a peça|revê cada peça antes de sair|Qualquer peça que nomeie uma pessoa/,
  },
  {
    /* «trabalho» no sentido de EMPREGO não é o nome de um estudo, e a L3 mede
       «trabalho(s)» como nome de estudo. */
    conta: 'trabalho',
    porque: '«trabalho» no sentido de emprego, que não é o nome de um estudo',
    padrao: /procuram trabalho|custo unitário do trabalho|Trabalho, Solidariedade e Segurança Social|mercado de trabalho|postos de trabalho/,
  },
];

/* ---------------------------------------------------------------------------
 * A LEITURA DO TEXTO DA CASA
 * ---------------------------------------------------------------------------
 * O mesmo corte que `medir-defeitos.mjs` e a medição do bloco fizeram: tudo o
 * que está debaixo de uma marca de origem declarada é da fonte e não da casa, e
 * a casa não edita o que transcreve.
 */
const ORIGEM_DECLARADA = [
  '[data-claim]',
  '[data-linha-claim]',
  '[data-correcao-claim]',
  '[data-verbatim]',
  '[data-nonledger]',
  '[data-agenda]',
  '[data-registo]',
  '[data-registo-unidade]',
  '[data-registo-linha]',
  '[data-registo-conta]',
  '[data-lugar]',
  '[data-nome]',
  '[data-medida-nome]',
  '[data-medida-unidade]',
].join(',');

/** @param {import('node-html-parser').HTMLElement} raiz */
function textoDaCasa(raiz) {
  const corpo = raiz.querySelector('body');
  if (!corpo) return '';
  const marcados = new Set();
  for (const el of raiz.querySelectorAll(ORIGEM_DECLARADA)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  /** @type {string[]} */
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(corpo);
  return partes.join(' ').replace(/\s+/g, ' ');
}

/**
 * O texto da casa, bloco a bloco, para as exceções e para a medida 8.5.
 * Um bloco é uma unidade de leitura: um parágrafo, um item, uma célula, um
 * título. É o mesmo corte de `BLOCOS_DA_VOZ` em `medir-defeitos.mjs`.
 */
const BLOCOS = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption';

/** @param {import('node-html-parser').HTMLElement} raiz */
function blocosDaCasa(raiz) {
  const corpo = raiz.querySelector('body');
  if (!corpo) return [];
  /** @type {string[]} */
  const out = [];
  for (const el of corpo.querySelectorAll(BLOCOS)) {
    const txt = el.text.replace(/\s+/g, ' ').trim();
    if (txt) out.push(txt);
  }
  return out;
}

/** @param {string} dir */
function paginasDe(dir) {
  /** @type {string[]} */
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  };
  anda(dir);
  return out.sort();
}

/** O caminho da rota de um ficheiro de `dist/`. @param {string} ficheiro */
function rotaDe(ficheiro) {
  const rel = path.relative(DIST, ficheiro).split(path.sep).join('/');
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  return { rel, url: normalizePath(url), rota: matchPath(normalizePath(url)) };
}

/* ---------------------------------------------------------------------------
 * A CONTAGEM
 * --------------------------------------------------------------------------- */
const falhas = [];
const medidas = {
  l1_paginas: 0,
  l2_segundas_listas: 0,
  l2_reguas: 0,
  l2_sinopses: 0,
  l3_vocabulario: 0,
  l4_falhas: 0,
  l5_sem_caminho: 0,
  l6_selos: 0,
  d85_limiar_sozinho: 0,
  d88_livro_razao: 0,
  d813_selos_nos_dominios: 0,
  d814_densidades: 0,
};
/** As amostras de cada medida, para que um número tenha sempre um sítio. */
const amostras = Object.fromEntries(Object.keys(medidas).map((k) => [k, []]));
/** Quantas vezes cada exceção foi usada: uma exceção a zero é uma porta esquecida. */
const usoDasExcecoes = new Map(EXCECOES_DO_VOCABULARIO.map((e, i) => [i, 0]));
/** As palavras do vocabulário, contadas uma a uma, para o relatório. */
const porPalavra = new Map(VOCABULARIO.map((v) => [v.palavra, 0]));
const porDensidade = new Map(DENSIDADES.map((d) => [d, 0]));

const claims = loadClaims();
const S = { pt: t('pt'), en: t('en') };

/** O caminho de cada índice em que a frase de hierarquia tem de estar (§2.2). */
const INDICES_DA_HIERARQUIA = [];
for (const lang of LANGS) {
  const s = S[lang];
  INDICES_DA_HIERARQUIA.push(
    { url: routePath('municipios', lang), frase: s.hierarquia?.territorio, nome: 'municipios' },
    { url: routePath('distritos', lang), frase: s.hierarquia?.territorio, nome: 'distritos' },
    { url: routePath('regioes', lang), frase: s.hierarquia?.territorio, nome: 'regioes' },
    { url: routePath('dominios', lang), frase: s.hierarquia?.dominio, nome: 'dominios' },
    { url: routePath('areas', lang), frase: s.hierarquia?.area, nome: 'areas' },
  );
}
/** A frase de definição, na primeira página e em mais lado nenhum (§2.1). */
const DEFINICAO = LANGS.map((lang) => ({ url: routePath('home', lang), frase: S[lang].identidade }));

const conta = (texto, agulha) => {
  let i = 0;
  let n = 0;
  while ((i = texto.indexOf(agulha, i)) >= 0) {
    n++;
    i += agulha.length;
  }
  return n;
};

const anota = (chave, linha) => {
  if (amostras[chave].length < 6) amostras[chave].push(linha);
};

const paginas = paginasDe(DIST);
/** O que cada índice viu, para as medidas que se conferem uma vez no fim. */
const vistoNoIndice = new Map();

for (const ficheiro of paginas) {
  const { rel, url, rota } = rotaDe(ficheiro);
  if (FICHEIROS_SEM_ROTA.has(rel)) continue;
  const chaveDaRota = rota?.key ?? null;
  const lang = rota?.lang ?? (rel.startsWith('en/') ? 'en' : 'pt');
  /* As duas famílias de transcrição saem por nome, com a razão no cabeçalho. */
  const transcricao = chaveDaRota !== null && ROTAS_DE_TRANSCRICAO.has(chaveDaRota);

  const cru = fs.readFileSync(ficheiro, 'utf8');
  const raiz = parse(cru);
  const corpo = raiz.querySelector('body');
  if (!corpo) continue;

  const cabecalho = raiz.querySelector('header');
  const rodape = raiz.querySelector('footer');
  const daMobilia = new Set();
  for (const marco of [cabecalho, rodape]) {
    if (!marco) continue;
    daMobilia.add(marco);
    for (const d of marco.querySelectorAll('*')) daMobilia.add(d);
  }

  /* -------------------------------------------------------------------- L1 */
  /* Dois destinos iguais no MESMO ecrã, fora do cabeçalho e do rodapé. O
     fragmento não conta: `#m-x` e `#m-y` são dois sítios da mesma página, e
     `/x#a` e `/x#b` são duas portas para dois sítios da mesma página. */
  const destinos = new Map();
  for (const a of corpo.querySelectorAll('a[href]')) {
    if (daMobilia.has(a)) continue;
    const href = a.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const chave = href.split('#')[0];
    if (!chave) continue;
    destinos.set(chave, (destinos.get(chave) ?? 0) + 1);
  }
  const repetidos = [...destinos.entries()].filter(([, n]) => n > 1);
  if (repetidos.length) {
    medidas.l1_paginas++;
    anota('l1_paginas', `${url} · ${repetidos.length} destinos repetidos (ex.: ${repetidos[0][0]} ×${repetidos[0][1]})`);
  }

  /* -------------------------------------------------------------------- L2 */
  if (chaveDaRota !== 'municipios') {
    /* Os 308 nomes ligados fora de `/municipios`, e fora de uma lista fechada:
       um `<details>` fechado é a alternativa em texto de um mapa, e o §1 do
       brief deixa-a lá de propósito. */
    const dentroDeLista = new Set();
    for (const d of corpo.querySelectorAll('details')) {
      for (const x of d.querySelectorAll('*')) dentroDeLista.add(x);
    }
    const nomes = new Set();
    for (const a of corpo.querySelectorAll('a[href]')) {
      if (daMobilia.has(a) || dentroDeLista.has(a)) continue;
      const href = (a.getAttribute('href') ?? '').split('#')[0];
      const m = href ? matchPath(href) : null;
      if (m?.key === 'municipio') nomes.add(href);
    }
    if (nomes.size > L2_LIMITE_NOMES) {
      medidas.l2_segundas_listas++;
      anota('l2_segundas_listas', `${url} · ${nomes.size} concelhos ligados fora de uma lista fechada`);
    }
  }
  if (chaveDaRota !== 'regioes') {
    const reguas = corpo.querySelectorAll('[data-instrumento="convergencia"]').length;
    if (reguas) {
      medidas.l2_reguas += reguas;
      anota('l2_reguas', `${url} · ${reguas} régua(s) da convergência`);
    }
  }
  if (chaveDaRota !== 'estudos') {
    const sinopses = corpo.querySelectorAll('.mun-estudo-frase').length;
    if (sinopses) {
      medidas.l2_sinopses += sinopses;
      anota('l2_sinopses', `${url} · ${sinopses} sinopse(s) de estudo`);
    }
  }

  /* --------------------------------------------------------------- L3, 8.14 */
  if (!transcricao) {
    const blocos = blocosDaCasa(raiz);
    const texto = textoDaCasa(raiz);
    for (const { palavra } of VOCABULARIO) {
      if (!texto.includes(palavra)) continue;
      /* Conta por bloco, para que uma exceção possa dispensar o bloco dela. */
      let n = 0;
      for (const b of blocos) {
        const nb = contaPalavra(b, palavra);
        if (!nb) continue;
        const i = EXCECOES_DO_VOCABULARIO.findIndex(
          (e) => palavraDaExcecao(e.conta, palavra) && e.padrao.test(b),
        );
        if (i >= 0) {
          usoDasExcecoes.set(i, (usoDasExcecoes.get(i) ?? 0) + nb);
          continue;
        }
        n += nb;
      }
      if (!n) continue;
      medidas.l3_vocabulario += n;
      porPalavra.set(palavra, (porPalavra.get(palavra) ?? 0) + n);
      anota('l3_vocabulario', `${url} · «${palavra}» ×${n}`);
    }
    for (const d of DENSIDADES) {
      const n = conta(texto, d);
      if (!n) continue;
      medidas.d814_densidades += n;
      porDensidade.set(d, (porDensidade.get(d) ?? 0) + n);
      anota('d814_densidades', `${url} · «${d}» ×${n}`);
    }

    /* --------------------------------------------------------------- 8.5 */
    /* «limiar» nunca sozinho: o bloco que o diz tem de dizer também de quem ele
       é, ou ser a frase que o define. */
    for (const b of blocos) {
      const temLimiar = /limiar|threshold/i.test(b);
      if (!temLimiar) continue;
      const qualificado =
        /limiar d[ao] Comissão|threshold of the Commission|Commission'?s threshold|limiar que a Comissão|limiar publicado|limiar fixado|sem limiar|no threshold|limiar é|threshold is/i.test(
          b,
        );
      if (qualificado) continue;
      medidas.d85_limiar_sozinho++;
      anota('d85_limiar_sozinho', `${url} · ${b.slice(0, 90)}`);
    }
  }

  /* -------------------------------------------------------------------- L5 */
  const primeira = chaveDaRota === 'home';
  if (!primeira && !transcricao) {
    const rotulo = S[lang].nav?.rotuloCaminho;
    const caminho = rotulo
      ? corpo.querySelectorAll('nav').find((n) => n.getAttribute('aria-label') === rotulo)
      : null;
    if (!caminho) {
      medidas.l5_sem_caminho++;
      anota('l5_sem_caminho', url);
    } else {
      for (const a of caminho.querySelectorAll('a[href]')) {
        const href = (a.getAttribute('href') ?? '').split('#')[0];
        if (!href.startsWith('/')) continue;
        const alvo = path.join(DIST, normalizePath(href).slice(1), 'index.html');
        const alvoRaiz = path.join(DIST, normalizePath(href) === '/' ? 'index.html' : '');
        if (!fs.existsSync(alvo) && !(normalizePath(href) === '/' && fs.existsSync(alvoRaiz))) {
          falhas.push(`L5 · ${url}: o caminho aponta para "${href}", que não existe em dist/.`);
        }
      }
    }
  }

  /* -------------------------------------------------------------------- L6 */
  for (const selo of corpo.querySelectorAll('[data-selo-etiqueta]')) {
    const etiqueta = selo.getAttribute('data-selo-etiqueta') ?? '';
    const href = (selo.getAttribute('href') ?? '').split('#')[0];
    const m = href ? matchPath(href) : null;
    const id = m?.key === 'linha' ? m.params.slug : null;
    const linha = id ? claims.get(id) : null;
    if (!linha) continue;
    const publicador = typeof linha.source === 'string' ? linha.source : null;
    if (!publicador) continue;
    if (etiqueta.includes(publicador)) continue;
    medidas.l6_selos++;
    anota('l6_selos', `${url} · ${id}: o selo diz «${etiqueta}» e o publicador é «${publicador}»`);
  }

  /* ------------------------------------------------------------------- 8.8 */
  /* «livro-razão» nos menus, nos rodapés e nos títulos das páginas do leitor.
     O termo técnico continua a valer no Método, no JSON e nos endereços. */
  if (!transcricao && chaveDaRota !== 'metodo') {
    const superficies = [];
    if (cabecalho) superficies.push(cabecalho.text);
    if (rodape) superficies.push(rodape.text);
    const titulo = raiz.querySelector('title');
    if (titulo) superficies.push(titulo.text);
    for (const h of corpo.querySelectorAll('h1')) superficies.push(h.text);
    const junto = superficies.join(' ');
    const n = conta(junto, 'Livro-razão') + conta(junto, 'livro-razão') + conta(junto, 'Ledger');
    if (n) {
      medidas.d88_livro_razao += n;
      anota('d88_livro_razao', `${url} · ×${n}`);
    }
  }

  /* ------------------------------------------------------------------ 8.13 */
  if (primeira) {
    const seccao = corpo.querySelector('#dominios');
    const selos = seccao ? seccao.querySelectorAll('[data-claim]').length : 0;
    if (selos) {
      medidas.d813_selos_nos_dominios += selos;
      anota('d813_selos_nos_dominios', `${url} · ${selos} valores selados na secção dos domínios`);
    }
    vistoNoIndice.set(`definicao:${url}`, conta(corpo.text, S[lang].identidade));
  }

  /* -------------------------------------------------------------------- L4 */
  for (const alvo of INDICES_DA_HIERARQUIA) {
    if (normalizePath(alvo.url) !== url) continue;
    vistoNoIndice.set(`hierarquia:${url}`, alvo.frase ? conta(corpo.text, alvo.frase) : 0);
  }
}

/**
 * A palavra que uma exceção cobre. `conta` é a raiz («peça», «trabalho») e a
 * palavra medida pode ser o plural ou a maiúscula.
 * @param {string} raizDaExcecao
 * @param {string} palavra
 */
function palavraDaExcecao(raizDaExcecao, palavra) {
  return palavra.toLowerCase().startsWith(raizDaExcecao.toLowerCase());
}

/**
 * Conta uma palavra INTEIRA num texto: «trabalho» não conta dentro de
 * «trabalhos», e «Município» não conta dentro de «Municípios».
 * @param {string} texto
 * @param {string} palavra
 */
function contaPalavra(texto, palavra) {
  const escapada = palavra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\p{L}])${escapada}(?![\\p{L}])`, 'gu');
  return (texto.match(re) ?? []).length;
}

/* -------------------------------------------------------------------- L4 */
for (const { url, frase } of DEFINICAO) {
  const visto = vistoNoIndice.get(`definicao:${normalizePath(url)}`) ?? 0;
  if (visto !== 1) {
    medidas.l4_falhas++;
    anota('l4_falhas', `a frase de definição em ${url}: ${visto} (esperado 1)`);
  }
}
for (const alvo of INDICES_DA_HIERARQUIA) {
  const visto = vistoNoIndice.get(`hierarquia:${normalizePath(alvo.url)}`) ?? 0;
  if (visto !== 1) {
    medidas.l4_falhas++;
    anota('l4_falhas', `a frase de hierarquia em ${alvo.url}: ${visto} (esperado 1)`);
  }
}

/* ---------------------------------------------------------------------------
 * O RELATÓRIO
 * --------------------------------------------------------------------------- */
const NOMES = {
  l1_paginas: 'L1 · páginas com dois destinos iguais fora da mobília',
  l2_segundas_listas: 'L2 · segundas listas dos concelhos',
  l2_reguas: 'L2 · réguas da convergência fora de /regioes',
  l2_sinopses: 'L2 · sinopses de estudo fora de /estudos',
  l3_vocabulario: 'L3 · palavras fora do vocabulário fechado',
  l4_falhas: 'L4 · frases de definição e de hierarquia em falta',
  l5_sem_caminho: 'L5 · páginas sem caminho no cabeçalho',
  l6_selos: 'L6 · selos que não dizem o publicador',
  d85_limiar_sozinho: '8.5 · «limiar» sozinho',
  d88_livro_razao: '8.8 · «livro-razão» nos menus e nos títulos',
  d813_selos_nos_dominios: '8.13 · valores selados na secção dos domínios de /',
  d814_densidades: '8.14 · «Relance» e «Leitura breve» nas páginas do leitor',
};

console.log(`check:lugar · ${paginas.length} páginas em dist/`);
for (const [chave, valor] of Object.entries(medidas)) {
  const teto = TETOS[chave];
  const estado = valor > teto ? 'ACIMA DO TETO' : valor + TETO_FROUXO < teto ? 'teto frouxo' : 'ok';
  console.log(`  ${NOMES[chave].padEnd(58)} ${String(valor).padStart(7)}  (teto ${teto}) ${estado}`);
  for (const a of amostras[chave]) console.log(`      · ${a}`);
  if (valor > teto) {
    falhas.push(`${NOMES[chave]}: ${valor}, acima do teto ${teto}.`);
  } else if (valor + TETO_FROUXO < teto) {
    falhas.push(
      `${NOMES[chave]}: ${valor}, e o teto está em ${teto}. Um teto com mais de ` +
        `${TETO_FROUXO} de folga já não mede nada: baixa-o para ${valor} com a data.`,
    );
  }
}

console.log('  as exceções, e quantas vezes cada uma foi precisa:');
for (const [i, e] of EXCECOES_DO_VOCABULARIO.entries()) {
  const n = usoDasExcecoes.get(i) ?? 0;
  console.log(`      · «${e.conta}» ${String(n).padStart(5)} · ${e.porque}`);
  if (n === 0) {
    falhas.push(
      `A exceção «${e.conta}» (${e.porque}) não foi precisa uma única vez: uma exceção ` +
        `que já não serve é uma porta aberta esquecida. Tira-a.`,
    );
  }
}

const palavras = [...porPalavra.entries()].filter(([, n]) => n > 0);
if (palavras.length) {
  console.log('  a L3, palavra a palavra:');
  for (const [p, n] of palavras.sort((a, b) => b[1] - a[1])) {
    console.log(`      · ${p.padEnd(14)} ${String(n).padStart(6)}`);
  }
}
const densidades = [...porDensidade.entries()].filter(([, n]) => n > 0);
if (densidades.length) {
  console.log('  a 8.14, palavra a palavra:');
  for (const [p, n] of densidades.sort((a, b) => b[1] - a[1])) {
    console.log(`      · ${p.padEnd(14)} ${String(n).padStart(6)}`);
  }
}

if (falhas.length) {
  console.error(`\ncheck:lugar · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('check:lugar · verde.');
