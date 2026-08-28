#!/usr/bin/env node
/**
 * A RÉGUA DOS VAZIOS — as três regras do diretor de 28.08.2026, medidas.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE
 * ---------------------------------------------------------------------------
 *   1. **uma medida que nenhuma fonte publica para ninguém não tem peça** · as
 *      308 páginas rendem sete peças, nas duas edições;
 *   2. **quando a fonte imprime «N.d.», a página mostra «N.d.», com selo** · a
 *      marca atravessa o validador, a receita de uma linha calculada e a peça,
 *      sem nunca virar zero nem virar ausência;
 *   3. **«sem linha ainda» e «no row yet» não rendem em lado nenhum** · a
 *      varredura de `dist/` conta zero, e conta-o depois de ter visto vermelha
 *      uma cópia com a frase plantada.
 *
 * NÃO É UM PORTÃO: imprime, e sai sempre com 0. Corre fora do `npm run build`,
 * como as outras réguas de `tests/`, e pela mesma razão.
 *
 *   node tests/municipio/vazios.mjs
 *
 * ---------------------------------------------------------------------------
 * A LINHA DE ENSAIO VIVE EM MEMÓRIA, E NUNCA EM `ledger/claims/`
 * ---------------------------------------------------------------------------
 * A regra 2 tem de ser medida antes de o motor escrever as onze linhas, e
 * escrever uma linha à mão para a medir seria pôr no livro-razão uma afirmação
 * que ninguém leu de fonte nenhuma. A régua injecta as suas linhas no MAPA que
 * `loadClaims()` guarda em memória, depois de ele estar carregado: nenhum
 * ficheiro é escrito, nenhum ficheiro é lido a mais, e ao fim de cada bloco as
 * linhas de ensaio saem do mapa. Os ids começam por `ensaio-`, que não é o slug
 * de nenhum concelho da Carta.
 *
 * ---------------------------------------------------------------------------
 * CADA CONFERÊNCIA VÊ UM ESTRAGO ANTES DE VALER (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Uma saída vazia não prova ausência. As três conferências que dizem «zero» ou
 * «passa» correm primeiro sobre um estrago plantado: a frase da ausência
 * plantada numa cópia do HTML, uma linha de ensaio com um valor que não é marca
 * nenhuma, e uma linha calculada que publica um número onde a receita dá a
 * marca. Onde o estrago não fecha, a célula falha e di-lo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadClaims,
  validateLedger,
  evaluateCheck,
  parsePtNumber,
  marcaDoValor,
  eValorTextual,
  MarcaDaExpressao,
  VALORES_NAO_NUMERICOS,
} from '../../src/lib/ledger.mjs';
import { pecasDoConcelho } from '../../src/lib/inicio.mjs';
import { relanceDoConcelho } from '../../src/data/concelhos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

let passam = 0;
let total = 0;
let saltadas = 0;
function conta(nome, bem, prova) {
  total += 1;
  if (bem) passam += 1;
  console.log(`  ${bem ? verde('passa') : vermelho('falha')}  ${nome}`);
  if (prova) console.log(cinza(`         ${prova}`));
}
function salta(nome, porque) {
  saltadas += 1;
  console.log(`  ${cinza('salta')}  ${nome}`);
  console.log(cinza(`         ${porque}`));
}

/** A MARCA que esta régua exercita, lida da lista e nunca escrita duas vezes. */
const MARCA = VALORES_NAO_NUMERICOS[0].marca;

/* =========================================================================
 * A · A MARCA, NAS FUNÇÕES QUE A LEEM
 * ========================================================================= */

console.log('');
console.log(cinza('  A · a marca da fonte, nas funções da casa'));

/* A1 · a marca é a cadeia inteira, e mais nada é marca. */
{
  const bem =
    parsePtNumber(MARCA) === null &&
    marcaDoValor(MARCA) === MARCA &&
    marcaDoValor(` ${MARCA} `) === MARCA &&
    marcaDoValor(`${MARCA} (2024)`) === null &&
    marcaDoValor('não disponível') === null &&
    eValorTextual(MARCA) === true &&
    eValorTextual('12') === false;
  conta(
    'A1 · a marca é a cadeia inteira, e uma frase parecida não é marca',
    bem,
    `«${MARCA}» é marca; «${MARCA} (2024)» e «não disponível» não são; «12» é número`,
  );
}

/* A LINHA DE ENSAIO, na forma de uma linha do motor. */
function linhaDeEnsaio(id, extra = {}) {
  return {
    __file: `${id}.yml`,
    id,
    value: MARCA,
    unit: 'dias',
    source: 'Ensaio da régua dos vazios',
    document: { title: 'Ensaio', edition: 'dezembro de 2025', kind: 'pdf', locator: 'ensaio', page: 1 },
    source_url: 'https://exemplo.invalid/ensaio',
    access_date: '2026-08-28',
    reference_date: '2025-12',
    excerpt: `ENSAIO ${MARCA}`,
    derivation: null,
    derivation_en: null,
    derived_from: [],
    check: null,
    study: 'concelhos-2026',
    note: 'Linha de ensaio da régua dos vazios: vive em memória e nunca em disco.',
    corrections: [],
    ...extra,
  };
}

/** Corre `validateLedger()` com um conjunto de linhas de ensaio no mapa. */
function comEnsaio(linhas, fn) {
  const claims = loadClaims();
  const ids = linhas.map((l) => l.id);
  for (const l of linhas) {
    if (claims.has(l.id)) throw new Error(`o id de ensaio "${l.id}" já existe no livro-razão`);
    claims.set(l.id, l);
  }
  try {
    return fn(claims);
  } finally {
    for (const id of ids) claims.delete(id);
  }
}

/** Os erros do validador que nomeiam um destes ficheiros. */
function errosDe(resultado, ids) {
  return resultado.errors.filter((e) => ids.some((id) => e.includes(`[${id}.yml]`)));
}

/* A2 · o validador aceita a marca, e continua a recusar tudo o resto sem
   algarismos. O estrago vem primeiro. */
{
  const estrago = comEnsaio([linhaDeEnsaio('ensaio-vazios-prosa', { value: 'não disponível' })], (c) =>
    errosDe(validateLedger(), ['ensaio-vazios-prosa']),
  );
  const bom = comEnsaio([linhaDeEnsaio('ensaio-vazios-marca')], () =>
    errosDe(validateLedger(), ['ensaio-vazios-marca']),
  );
  conta(
    'A2 · o validador recusa prosa no lugar do valor e aceita a marca publicada',
    estrago.length > 0 && bom.length === 0,
    `estrago plantado («não disponível»): ${estrago.length} erro(s) · ` +
      `linha com «${MARCA}»: ${bom.length} erro(s)`,
  );
}

/* A3 · a receita leva a marca consigo, e duas marcas diferentes param a conta. */
{
  const claims = new Map([
    ['ensaio-a', { id: 'ensaio-a', value: MARCA }],
    ['ensaio-b', { id: 'ensaio-b', value: MARCA }],
    ['ensaio-n', { id: 'ensaio-n', value: '150' }],
    ['ensaio-outra', { id: 'ensaio-outra', value: 'n.a.' }],
  ]);
  const r = (expr) => evaluateCheck(expr, { claims, env: {} });
  const duasMarcas = r('round ( ensaio-a / ensaio-b * ensaio-n , 1 )');
  const marcaENumero = r('ensaio-a * 2 + 5');
  const soNumeros = r('round ( 3 / 4 * 150 , 1 )');
  let atirou = false;
  try {
    /* «n.a.» não é marca declarada: a expressão tem de atirar, como sempre
       atirou para um valor que não é um número simples. */
    r('ensaio-a + ensaio-outra');
  } catch {
    atirou = true;
  }
  const bem =
    duasMarcas instanceof MarcaDaExpressao &&
    duasMarcas.marca === MARCA &&
    marcaENumero instanceof MarcaDaExpressao &&
    soNumeros === 112.5 &&
    atirou;
  conta(
    'A3 · a receita dá a marca quando uma entrada é marca, e a aritmética normal não muda',
    bem,
    `duas marcas → «${duasMarcas}» · marca × número → «${marcaENumero}» · ` +
      `3/4×150 → ${soNumeros} · valor não declarado → ${atirou ? 'atira' : 'passa'}`,
  );
}

/* A4 · uma linha calculada sobre marcas publica a marca, e um número no lugar
   dela fecha a construção. Os dois estragos vêm antes do caso bom. */
{
  const receita = 'round ( ensaio-vazios-d / ensaio-vazios-l * 150 , 1 )';
  const base = () => [
    linhaDeEnsaio('ensaio-vazios-d', { unit: 'euros' }),
    linhaDeEnsaio('ensaio-vazios-l', { unit: 'euros' }),
  ];
  const calculada = (value) =>
    linhaDeEnsaio('ensaio-vazios-i', {
      value,
      unit: '%',
      source: null,
      document: null,
      source_url: null,
      access_date: null,
      excerpt: null,
      derivation: 'Ensaio: a receita do índice sobre duas entradas com marca.',
      derivation_en: 'Trial: the index recipe over two marked entries.',
      derived_from: ['ensaio-vazios-d', 'ensaio-vazios-l'],
      check: receita,
    });
  const ids = ['ensaio-vazios-i'];
  const estragoZero = comEnsaio([...base(), calculada('0')], () => errosDe(validateLedger(), ids));
  const estragoNumero = comEnsaio([...base(), calculada('7,5')], () => errosDe(validateLedger(), ids));
  const bom = comEnsaio([...base(), calculada(MARCA)], () => errosDe(validateLedger(), ids));
  conta(
    'A4 · a linha calculada sobre marcas publica a marca, e um número no lugar dela fecha',
    estragoZero.length > 0 && estragoNumero.length > 0 && bom.length === 0,
    `publicar «0»: ${estragoZero.length} erro(s) · publicar «7,5»: ${estragoNumero.length} erro(s) · ` +
      `publicar «${MARCA}»: ${bom.length} erro(s)`,
  );
}

/* A5 · a peça de uma medida com marca: valor sim, estado não, régua não, e não
   é uma peça vazia. O controlo é a mesma peça com um número. */
{
  const municipio = (valorDoIndice) => ({
    slug: 'ensaio',
    relance: relanceDoConcelho({
      divida: 'ensaio-vazios-d',
      indice: 'ensaio-vazios-i',
      pmp: 'ensaio-vazios-p',
    }),
    distancia: {
      valor: 'ensaio-vazios-d',
      limite: 'ensaio-vazios-l',
      indice: 'ensaio-vazios-i',
      tecto: 'indice-de-divida-limite-legal',
      ref: '2024',
    },
  });
  const linhas = (valorDoIndice) => [
    linhaDeEnsaio('ensaio-vazios-d', { unit: 'euros' }),
    linhaDeEnsaio('ensaio-vazios-l', { unit: 'euros' }),
    linhaDeEnsaio('ensaio-vazios-i', { value: valorDoIndice, unit: '%' }),
    linhaDeEnsaio('ensaio-vazios-p'),
  ];
  const daMarca = comEnsaio(linhas(MARCA), () => pecasDoConcelho(municipio()));
  const doNumero = comEnsaio(linhas('7,5'), () => pecasDoConcelho(municipio()));
  const idx = (pecas) => pecas.find((p) => p.chave === 'indice');
  const pmp = (pecas) => pecas.find((p) => p.chave === 'pmp');
  const m = idx(daMarca);
  const n = idx(doNumero);
  const bem =
    m.vazia === false &&
    m.estado === null &&
    m.colore === false &&
    m.regua === null &&
    pmp(daMarca).vazia === false &&
    /* O controlo: com um número, a peça volta a ter estado, cor e régua. */
    n.vazia === false &&
    n.estado === 'dentro' &&
    n.regua !== null &&
    n.regua.valor === 7.5;
  conta(
    'A5 · a peça de uma marca tem valor e não tem estado nem barra; com um número, tem os dois',
    bem,
    `marca: vazia=${m.vazia} estado=${String(m.estado)} régua=${m.regua === null ? 'nenhuma' : 'sim'} · ` +
      `número: vazia=${n.vazia} estado=${String(n.estado)} régua=${n.regua ? n.regua.valor : 'nenhuma'}`,
  );
}

/* =========================================================================
 * B · O QUE A CONSTRUÇÃO RENDEU
 * ========================================================================= */

console.log('');
console.log(cinza('  B · as páginas construídas'));

const EDICOES = [
  { chave: 'pt', dir: path.join(DIST, 'municipios'), frase: 'sem linha ainda' },
  { chave: 'en', dir: path.join(DIST, 'en', 'municipalities'), frase: 'no row yet' },
];

if (!fs.existsSync(DIST)) {
  salta('B · as páginas construídas', 'não existe dist/. Corra `npm run build` primeiro.');
} else {
  /** Todos os ficheiros de `dist/`, uma vez. */
  const ficheiros = [];
  (function anda(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) ficheiros.push(f);
    }
  })(DIST);

  /** O detector: quantas vezes a frase aparece num texto. */
  const conteFrase = (texto, frase) => texto.split(frase).length - 1;

  /* B1 · o detector vê o estrago plantado, e só depois conta zero. */
  {
    const linhas = [];
    let bem = true;
    for (const { chave, frase } of EDICOES) {
      /* O ESTRAGO: uma cópia em memória de uma página construída, com a frase
         metida onde a peça a punha. Se o detector não a vir, ele não vê nada, e
         a contagem de zero das páginas a sério não vale nada. */
      const modelo = ficheiros[0];
      const plantado = fs
        .readFileSync(modelo, 'utf8')
        .replace('</body>', `<p class="peca-sem-linha" data-cobertura="sem-linha">${frase}</p></body>`);
      const viuOEstrago = conteFrase(plantado, frase) === 1;
      let noSitio = 0;
      const paginas = [];
      for (const f of ficheiros) {
        const n = conteFrase(fs.readFileSync(f, 'utf8'), frase);
        if (n > 0) {
          noSitio += n;
          if (paginas.length < 5) paginas.push(`${path.relative(DIST, f)} (${n})`);
        }
      }
      if (!viuOEstrago || noSitio !== 0) bem = false;
      linhas.push(
        `${chave}: estrago plantado ${viuOEstrago ? 'visto' : 'NÃO VISTO'} · ` +
          `${noSitio} ocorrência(s) em dist/${paginas.length ? ` (${paginas.join(', ')})` : ''}`,
      );
    }
    conta(
      'B1 · «sem linha ainda» e «no row yet» não rendem em lado nenhum',
      bem,
      linhas.join(' · '),
    );
  }

  /* B2 · sete peças em cada página de concelho, nas duas edições. */
  {
    const linhas = [];
    let bem = true;
    for (const { chave, dir } of EDICOES) {
      if (!fs.existsSync(dir)) {
        bem = false;
        linhas.push(`${chave}: não existe ${path.relative(RAIZ, dir)}`);
        continue;
      }
      const contagens = new Map();
      let paginas = 0;
      for (const d of fs.readdirSync(dir)) {
        const f = path.join(dir, d, 'index.html');
        if (!fs.existsSync(f)) continue;
        paginas += 1;
        const n = (fs.readFileSync(f, 'utf8').match(/<article class="peca[^"]*"/g) ?? []).length;
        contagens.set(n, (contagens.get(n) ?? 0) + 1);
      }
      const so7 = contagens.size === 1 && contagens.get(7) === paginas;
      if (!so7 || paginas !== 308) bem = false;
      linhas.push(
        `${chave}: ${paginas} páginas · ` +
          [...contagens.entries()].map(([k, v]) => `${v} com ${k} peças`).join(', '),
      );
    }
    conta('B2 · as 308 páginas com sete peças, nas duas edições', bem, linhas.join(' · '));
  }

  /* B3 · a marca rendida: onde ela existe, aparece dentro do elemento da linha,
     com selo ao lado, e NUNCA com uma comparação.
     ------------------------------------------------------------------------
     A REGRA É «SEM COMPARAÇÃO», E NÃO «SEM PALAVRA». A primeira redação desta
     célula pedia que uma peça com marca não tivesse palavra de estado nenhuma,
     e as 20 peças construídas mostraram-lhe o erro: o prazo médio de pagamento
     e a dívida total não têm limiar publicado NENHUM, e por isso dizem «sem
     limiar» nas 308 páginas, com valor ou com marca. Tirar a palavra só às
     nove com marca era dizer daquelas nove uma coisa diferente do que se diz
     das outras 299, e falsa: o que lhes falta não é o limiar, é o valor.
     O que a marca não pode produzir é uma COMPARAÇÃO: nunca «fora do limiar»,
     nunca «dentro do limiar», nunca um quadrado pintado, nunca uma barra. Onde
     há limiar publicado e o valor é marca — o índice de dívida —, a peça fica
     sem estado nenhum, e é a célula A5 que o mede. */
  {
    const comMarca = [];
    for (const { chave, dir } of EDICOES) {
      if (!fs.existsSync(dir)) continue;
      for (const d of fs.readdirSync(dir)) {
        const f = path.join(dir, d, 'index.html');
        if (!fs.existsSync(f)) continue;
        const html = fs.readFileSync(f, 'utf8');
        for (const peca of html.split('<article class="peca').slice(1)) {
          const corpo = peca.split('</article>')[0];
          if (!corpo.includes(`>${MARCA}<`)) continue;
          const medida = corpo.match(/data-medida="([^"]+)"/)?.[1] ?? '(sem id)';
          const nome = corpo.match(/data-medida-nome>([^<]*)</)?.[1] ?? '(sem nome)';
          comMarca.push({
            edicao: chave,
            concelho: d,
            medida,
            nome,
            /* O valor está DENTRO do elemento da linha, e não em prosa ao lado. */
            noElemento: new RegExp(`data-claim="${medida}"[^>]*>${MARCA.replace(/\./g, '\\.')}<`).test(corpo),
            comSelo: corpo.includes('class="src-chip'),
            /* O estado da peça, tal como o atributo o declara: «sem» é «não há
               limiar publicado para esta medida», e é o único que uma marca
               pode ter. */
            estado: corpo.match(/data-estado="([^"]*)"/)?.[1] ?? null,
            comQuadrado: /class="sq sq-(fora|dentro)"/.test(corpo),
            comRegua: corpo.includes('class="regua"'),
          });
        }
      }
    }
    if (comMarca.length === 0) {
      salta(
        'B3 · a marca rendida com selo, sem estado e sem barra',
        `nenhuma peça construída mostra «${MARCA}»: as onze linhas do motor ainda não chegaram. ` +
          'A regra 2 está medida em memória nas células A2 a A5.',
      );
    } else {
      const maus = comMarca.filter(
        (p) =>
          !p.noElemento ||
          !p.comSelo ||
          p.estado === 'fora' ||
          p.estado === 'dentro' ||
          p.comQuadrado ||
          p.comRegua,
      );
      const concelhos = new Set(comMarca.map((p) => p.concelho));
      const medidas = new Set(comMarca.map((p) => p.nome));
      const estados = new Set(comMarca.map((p) => p.estado ?? '(nenhum)'));
      conta(
        'B3 · a marca rendida com selo, e sem comparação nenhuma, nas duas edições',
        maus.length === 0,
        maus.length === 0
          ? `${comMarca.length} peça(s) com «${MARCA}» em ${concelhos.size} concelho(s) ` +
            `(${[...medidas].join(', ')}), todas dentro do elemento da linha e com selo · ` +
            `estados: ${[...estados].join(', ')} · nenhum quadrado pintado, nenhuma barra`
          : `${maus.length} de ${comMarca.length}: ` +
            maus
              .slice(0, 4)
              .map(
                (p) =>
                  `${p.edicao}/${p.concelho}/${p.medida} (no elemento ${p.noElemento}, ` +
                  `selo ${p.comSelo}, estado ${p.estado}, quadrado ${p.comQuadrado}, ` +
                  `barra ${p.comRegua})`,
              )
              .join(' | '),
      );
    }
  }
}

console.log('');
console.log(
  `  ${passam === total ? verde(`${passam} de ${total}`) : vermelho(`${passam} de ${total}`)}` +
    (saltadas ? cinza(` · ${saltadas} saltada(s)`) : ''),
);
console.log('');
