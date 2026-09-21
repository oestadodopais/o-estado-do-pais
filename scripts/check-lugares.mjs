#!/usr/bin/env node
/**
 * O PORTÃO DAS DUAS TABELAS DECLARADAS DA PEÇA 2 DO B1 (21.09.2026)
 *
 * A página de um lugar assenta em duas tabelas que este bloco declarou, e um
 * portão existe para cada uma. Nenhuma das duas é escrita à mão: a primeira sai
 * dos três extratos da Carta que o projeto aloja, a segunda é uma lista de nove
 * pares chave-tema. O que este passo confere é que elas cobrem o que a
 * superfície rende, e que o que a superfície rende sai delas.
 *
 * ---------------------------------------------------------------------------
 * AS CÉLULAS
 * ---------------------------------------------------------------------------
 *   **C1** · a Carta dá 308 concelhos, 29 distritos e ilhas e 9 regiões. As três
 *        contagens leem-se dos ficheiros, e um desacordo fecha a construção.
 *   **C2** · cada um dos 308 tem região e distrito, e o slug de cada um resolve
 *        numa página construída: a linha de um lugar é quatro portas, e uma
 *        porta que não abre é pior do que não haver porta.
 *   **C3** · cada região da Carta tem entrada em `src/data/regioes.mjs`, pelo
 *        nome ou pela correspondência declarada. Uma região sem entrada era um
 *        concelho sem linha.
 *   **C4** · a base do índice do poder de compra lê-se da unidade de cada linha,
 *        e as 308 declaram-na. É de lá que a leitura de um lugar tira a
 *        comparação com a média do país; sem ela, a comparação não se faz.
 *   **T1** · toda a chave de medida que o ficheiro do motor traz, e toda a que
 *        `MEDIDAS_DO_CONCELHO` declara, tem tema; todo o tema declarado é um dos
 *        dezoito da carta dos conteúdos.
 *   **P1** · **as palavras da leitura e da régua contra as linhas, recalculadas**.
 *        Para cada uma das 616 páginas, este passo lê do livro-razão se o índice
 *        de dívida está dentro ou fora do limite legal (contra a linha
 *        `indice-de-divida-limite-legal`, e não contra o limite em euros da
 *        câmara) e se o poder de compra está acima ou abaixo da base do índice, e
 *        compara com as palavras rendidas NA LEITURA e NA RÉGUA do cartão.
 *        Confere também que um lugar cujo índice a fonte não publica não tem essa
 *        metade da leitura. **É P**: uma palavra trocada aqui é uma afirmação
 *        falsa sobre uma câmara, e a leitura a frio de 21.09 leu uma.
 *   **T2** · toda a medida rendida numa página de concelho de `dist/` diz a sua
 *        chave, e o tema debaixo do qual ela se rende é o que a tabela dá àquela
 *        chave. É a célula que o mandato pede à letra: «o portão falha se uma
 *        medida rendida numa página de concelho ficar sem tema».
 *
 * A T2 lê `dist/`; as outras cinco não precisam dele e correm sozinhas.
 *
 * Uso:  node scripts/check-lugares.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { MEDIDAS_DO_CONCELHO, caminhoDoFicheiroGerado } from '../src/data/concelhos.mjs';
import { TEMA_DA_MEDIDA_DE_CONCELHO } from '../src/data/temas-das-medidas.mjs';
import {
  lugaresDaCarta,
  regiaoDaCarta,
  regioesDaCarta,
  distritosDaCarta,
  baseDoIndice,
} from '../src/data/carta-dos-lugares.mjs';
import { DOMINIOS } from '../src/data/dominios.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { getClaim, parsePtNumber, eValorTextual } from '../src/lib/ledger.mjs';
import { t as cadeias } from '../src/i18n/strings.mjs';
import { routePath, LANGS } from '../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** As contagens que a Carta dá, e que não se escrevem em lado nenhum. */
const ESPERADAS = { concelhos: 308, distritos: 29, regioes: 9 };

const falhas = [];
const medidas = {};

/* ------------------------------------------------------------------ C1 */
const lugares = lugaresDaCarta();
const distritos = distritosDaCarta();
const regioes = regioesDaCarta();
medidas.concelhos = lugares.length;
medidas.distritos = distritos.length;
medidas.regioes = regioes.length;
if (lugares.length !== ESPERADAS.concelhos) {
  falhas.push(
    `C1 · os três extratos da Carta dão ${lugares.length} concelhos, e a Carta de 2025 tem ` +
      `${ESPERADAS.concelhos}. Ou um extrato mudou, ou um ficheiro foi lido a meio.`,
  );
}
if (distritos.length !== ESPERADAS.distritos) {
  falhas.push(
    `C1 · os extratos dão ${distritos.length} distritos e ilhas, e são ${ESPERADAS.distritos}.`,
  );
}
if (regioes.length !== ESPERADAS.regioes) {
  falhas.push(`C1 · os extratos dão ${regioes.length} regiões, e são ${ESPERADAS.regioes}.`);
}

/* ------------------------------------------------------------------ C2/C3 */
const comPagina = new Set(MUNICIPIOS_COM_PAGINA.map((m) => m.slug));
let semRegiao = 0;
let semDistrito = 0;
for (const l of lugares) {
  const r = regiaoDaCarta(l.regiaoNaCarta);
  if (!r) {
    semRegiao++;
    falhas.push(
      `C3 · o concelho "${l.nome}" está na região "${l.regiaoNaCarta}" da Carta, e essa região ` +
        `não tem entrada em src/data/regioes.mjs nem correspondência de nome declarada.`,
    );
    continue;
  }
  if (!l.distritoSlug) {
    semDistrito++;
    falhas.push(`C2 · o concelho "${l.nome}" ficou sem distrito ou ilha.`);
    continue;
  }
  if (!comPagina.has(l.slug)) {
    falhas.push(`C2 · o concelho "${l.nome}" (${l.slug}) não tem entrada com página.`);
  }
}
medidas.sem_regiao = semRegiao;
medidas.sem_distrito = semDistrito;

/* ------------------------------------------------------------------ C4 */
let semBase = 0;
for (const m of MUNICIPIOS_COM_PAGINA) {
  const peca = (m.relance ?? []).find((x) => x.chave === 'poderDeCompra' && x.claim);
  if (!peca) continue;
  if (baseDoIndice(getClaim(peca.claim)) === null) {
    semBase++;
    if (semBase <= 6) {
      falhas.push(
        `C4 · a linha "${peca.claim}" não declara na sua unidade a base do índice ` +
          `(«índice (Portugal = 100)»), e é de lá que a leitura de um lugar tira a comparação ` +
          `com a média do país.`,
      );
    }
  }
}
medidas.sem_base = semBase;

/* ------------------------------------------------------------------ T1 */
const temasDaCarta = new Set(DOMINIOS.map((d) => d.slug));
const chavesDoMotor = new Set();
{
  const caminho = caminhoDoFicheiroGerado();
  if (fs.existsSync(caminho)) {
    for (const c of JSON.parse(fs.readFileSync(caminho, 'utf8'))) {
      for (const k of Object.keys(c.linhas ?? {})) chavesDoMotor.add(k);
    }
  }
}
for (const k of [...chavesDoMotor, ...MEDIDAS_DO_CONCELHO.map((m) => m.chave)]) {
  if (!TEMA_DA_MEDIDA_DE_CONCELHO[k]) {
    falhas.push(
      `T1 · a medida "${k}" não tem tema em src/data/temas-das-medidas.mjs. Cada número de um ` +
        `lugar vive debaixo de um dos dezoito temas da carta dos conteúdos.`,
    );
  }
}
for (const [k, tema] of Object.entries(TEMA_DA_MEDIDA_DE_CONCELHO)) {
  if (!temasDaCarta.has(tema)) {
    falhas.push(`T1 · a medida "${k}" declara o tema "${tema}", que não é um dos dezoito.`);
  }
}
medidas.chaves_com_tema = Object.keys(TEMA_DA_MEDIDA_DE_CONCELHO).length;

/* ------------------------------------------------------------------ T2 */
let cartoes = 0;
let paginas = 0;
if (!fs.existsSync(DIST)) {
  falhas.push('T2 · não existe dist/. Corra o build primeiro: esta célula lê o que foi construído.');
} else {
  for (const lang of LANGS) {
    for (const m of MUNICIPIOS_COM_PAGINA) {
      const rota = routePath('municipio', lang, { slug: m.slug });
      const ficheiro = path.join(DIST, rota.replace(/^\//, ''), 'index.html');
      if (!fs.existsSync(ficheiro)) {
        falhas.push(`T2 · falta ${rota} em dist/.`);
        continue;
      }
      paginas++;
      const raiz = parse(fs.readFileSync(ficheiro, 'utf8'));
      for (const bloco of raiz.querySelectorAll('[data-lugar-tema]')) {
        const tema = bloco.getAttribute('data-lugar-tema');
        if (!temasDaCarta.has(tema)) {
          falhas.push(`T2 · ${rota}: rende o tema "${tema}", que não é um dos dezoito.`);
        }
        for (const cartao of bloco.querySelectorAll('[data-medida-chave]')) {
          cartoes++;
          const chave = cartao.getAttribute('data-medida-chave');
          const esperado = TEMA_DA_MEDIDA_DE_CONCELHO[chave] ?? null;
          if (esperado === null) {
            falhas.push(
              `T2 · ${rota}: a medida "${chave}" rende-se e não tem tema declarado.`,
            );
          } else if (esperado !== tema) {
            falhas.push(
              `T2 · ${rota}: a medida "${chave}" rende-se debaixo de "${tema}" e a tabela ` +
                `dá-lhe "${esperado}".`,
            );
          }
        }
      }
      /* Um cartão fora de um bloco de tema é um número sem tema, e é o que a
         célula existe para apanhar. */
      const todos = raiz.querySelectorAll('[data-medida-chave]').length;
      const dentro = raiz.querySelectorAll('[data-lugar-tema] [data-medida-chave]').length;
      if (todos !== dentro) {
        falhas.push(`T2 · ${rota}: ${todos - dentro} medida(s) rendidas fora de um tema.`);
      }

      /* ---------------------------------------------------------------- P1 */
      /* AS PALAVRAS CONTRA AS LINHAS, RECALCULADAS AQUI. Este passo não importa
         `src/lib/lugar.mjs`: uma conferência que usasse a função da página
         confirmava-se a si própria. Lê as linhas, faz as duas comparações por
         conta própria, e compara o resultado com o que a página escreveu. */
      const s = cadeias(lang);
      const peca = (chave) => (m.relance ?? []).find((x) => x.chave === chave && x.claim);
      const leitura = raiz.querySelector('.lugar-leitura');
      /* A LEITURA DE UM LUGAR TEM DUAS FORMAS, e a célula mede o que pode medir.
         A COMPOSTA é feita das duas comparações, e as suas palavras recalculam-se
         daqui: é ela que esta célula confere palavra a palavra. A ESCRITA é a do
         lugar de direção, com as palavras dele (hoje só Évora a tem), e o que se
         lhe confere é o que se confere a qualquer prosa da casa: os valores pelo
         portão de HTML, as cadeias pelo inventário. A RÉGUA DO CARTÃO confere-se
         nas duas, porque é composta nas 616. */
      const composta = leitura?.getAttribute('data-leitura-do-lugar') === 'composta';
      const textoDaLeitura = leitura && composta ? leitura.text.replace(/\s+/g, ' ') : '';

      const pIndice = peca('indice');
      const linhaDoIndice = pIndice ? getClaim(pIndice.claim) : null;
      const tecto = m.distancia?.tecto ? getClaim(m.distancia.tecto) : null;
      const vIndice = linhaDoIndice ? parsePtNumber(linhaDoIndice.value) : null;
      const vTecto = tecto ? parsePtNumber(tecto.value) : null;
      const comparavel =
        linhaDoIndice !== null && !eValorTextual(linhaDoIndice.value) && vIndice !== null && vTecto !== null;
      const esperada = comparavel ? (vIndice <= vTecto ? s.estado.lei.dentro : s.estado.lei.fora) : null;
      const contraria = comparavel ? (vIndice <= vTecto ? s.estado.lei.fora : s.estado.lei.dentro) : null;

      if (comparavel) {
        if (composta && !textoDaLeitura.includes(esperada)) {
          falhas.push(
            `P1 · ${rota}: o índice de dívida é ${linhaDoIndice.value} contra o limite ` +
              `${tecto.value}, e a leitura não diz «${esperada}».`,
          );
        }
        if (textoDaLeitura.includes(contraria)) {
          falhas.push(
            `P1 · ${rota}: o índice de dívida é ${linhaDoIndice.value} contra o limite ` +
              `${tecto.value}, e a leitura diz «${contraria}».`,
          );
        }
        const cartao = raiz.querySelector(`[data-cartao-medida="${pIndice.claim}"] .cartao-medida-regua`);
        const naRegua = cartao ? cartao.text.replace(/\s+/g, ' ') : '';
        if (!naRegua.includes(esperada) || naRegua.includes(contraria)) {
          falhas.push(
            `P1 · ${rota}: a régua do cartão do índice de dívida diz «${naRegua.trim()}» e ` +
              `devia dizer «${esperada}».`,
          );
        }
      } else if (linhaDoIndice) {
        /* SEM VALOR PUBLICADO NÃO HÁ COMPARAÇÃO: a metade da frase que a citava
           não se escreve, e nenhuma das duas palavras pode aparecer. */
        for (const palavra of [s.estado.lei.dentro, s.estado.lei.fora]) {
          if (textoDaLeitura.includes(palavra)) {
            falhas.push(
              `P1 · ${rota}: o índice de dívida é «${linhaDoIndice.value}», que não é um número, ` +
                `e a leitura diz «${palavra}».`,
            );
          }
        }
      }

      const pPoder = peca('poderDeCompra');
      const linhaDoPoder = pPoder ? getClaim(pPoder.claim) : null;
      const base = linhaDoPoder ? baseDoIndice(linhaDoPoder) : null;
      const vPoder = linhaDoPoder ? parsePtNumber(linhaDoPoder.value) : null;
      const vBase = base ? parsePtNumber(base) : null;
      if (composta && vPoder !== null && vBase !== null && vPoder !== vBase) {
        const L = s.municipio.leituraDoLugar;
        const certa = vPoder > vBase ? L.acima : L.abaixo;
        const errada = vPoder > vBase ? L.abaixo : L.acima;
        if (!textoDaLeitura.includes(certa) || textoDaLeitura.includes(errada)) {
          falhas.push(
            `P1 · ${rota}: o poder de compra é ${linhaDoPoder.value} contra a base ${base}, e a ` +
              `leitura não diz «${certa}».`,
          );
        }
      }
    }
  }
  if (cartoes === 0) {
    falhas.push(
      'T2 · nenhuma medida rendida encontrada nas páginas de concelho. Uma célula que não vê ' +
        'nada diz sempre que está tudo bem (regra 14 da casa).',
    );
  }
}
medidas.paginas = paginas;
medidas.cartoes = cartoes;

console.log('');
if (falhas.length) {
  console.error(vermelho(`  PORTÃO DOS LUGARES · ${falhas.length} problema(s)\n`));
  for (const f of falhas.slice(0, 40)) console.error(vermelho('    · ') + f);
  if (falhas.length > 40) console.error(cinza(`    … e mais ${falhas.length - 40}`));
  console.error('');
  process.exit(1);
}
console.log(
  verde('  lugares ✓ ') +
    `${medidas.concelhos} concelhos, ${medidas.distritos} distritos e ilhas, ${medidas.regioes} ` +
    `regiões lidos dos três extratos da Carta · 0 sem região, 0 sem distrito · ` +
    `${medidas.sem_base === 0 ? 'as 308 linhas do poder de compra declaram a base do índice' : ''} · ` +
    `${medidas.chaves_com_tema} chaves com tema · ${medidas.cartoes} medida(s) rendidas em ` +
    `${medidas.paginas} página(s), todas debaixo do tema que a tabela lhes dá · as palavras da ` +
    `leitura e da régua recalculadas do livro-razão em todas elas`,
);
console.log('');
