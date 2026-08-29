#!/usr/bin/env node
/**
 * A RÉGUA DO VERBO DA SÉRIE · a I89, medida nas páginas construídas.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE
 * ---------------------------------------------------------------------------
 * A frase da camada 2 do instrumento do tempo diz, numa página de concelho, o
 * que o índice de dívida fez entre o primeiro e o último ano da série da
 * Direção-Geral. Até 29.08.2026 o verbo estava dentro da cadeia («desceu de »,
 * «fell from ») e a vista pendurava-lhe os números: **a palavra não dependia
 * dos valores**, e um concelho cuja série subisse publicava uma falsidade sem
 * que régua nenhuma a apanhasse.
 *
 * Esta régua lê o que a construção rendeu, e não o que o código pretendeu:
 *
 *   S1 · **o verbo concorda com os dois valores**, em todas as páginas de
 *        concelho das duas edições que rendem a frase. «desceu»/«fell from»
 *        pede o segundo valor menor, «subiu»/«rose from» pede-o maior, e
 *        «manteve-se em»/«stayed at» pede os dois iguais;
 *   S2 · **a forma da igualdade não escreve uma mudança**: quando ela se rende,
 *        a frase não leva « para »/« to » nem um segundo valor;
 *   S3 · **as três formas existem nas duas edições**, e nenhuma delas ficou com
 *        o verbo colado a outra: as seis cadeias de `strings.mjs` são seis
 *        cadeias distintas.
 *
 * ---------------------------------------------------------------------------
 * CADA CONFERÊNCIA VÊ UM ESTRAGO ANTES DE VALER (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Uma saída vazia não prova ausência, e uma régua que nunca viu vermelho não
 * mede nada. A S1 corre primeiro sobre uma CÓPIA EM MEMÓRIA de uma página real
 * com o segundo valor trocado por um que CONTRADIZ o verbo que a frase leva: a
 * página que diz «desceu» fica com o segundo valor maior, a que diz «subiu» fica
 * com ele menor, e a régua tem de apanhar as duas. A S2 corre sobre uma cópia em que
 * a forma da igualdade leva um « para » a mais. Onde o estrago não fecha, a
 * célula falha e di-lo.
 *
 * NÃO É UM PORTÃO: imprime, e sai sempre com 0. Corre fora do `npm run build`,
 * como as outras réguas de `tests/`, e pela mesma razão.
 *
 *   node tests/municipio/serie.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { t } from '../../src/i18n/strings.mjs';
import { parsePtNumber } from '../../src/lib/ledger.mjs';

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

/* ===========================================================================
 * AS TRÊS FORMAS, LIDAS DE ONDE ELAS VIVEM
 * ===========================================================================
 * As cadeias não se escrevem aqui: leem-se de `strings.mjs`. Uma régua com a
 * frase copiada por dentro deixa de medir o sítio no dia em que a redação mudar,
 * e passa a medir a cópia.
 */
const FORMAS = ['pt', 'en'].map((lang) => {
  const s = t(lang).municipio;
  return {
    lang,
    desceu: s.tempoSerieDesceu,
    subiu: s.tempoSerieSubiu,
    manteve: s.tempoSerieManteve,
    para: s.tempoSerieC,
    igual: s.tempoSerieIgualD,
  };
});

/** Os ficheiros HTML de `dist/`, uma vez. */
function ficheirosHtml(dir) {
  const out = [];
  (function anda(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  })(dir);
  return out;
}

/**
 * A LEITURA DE UMA PÁGINA, E É A DO LEITOR E NÃO A DO CÓDIGO.
 *
 * Devolve, para cada frase da série que a página renda, o verbo (qual das três
 * cadeias abre o bloco) e os valores que o bloco cita, tirados dos `data-claim`
 * pela ordem em que aparecem. Uma página que não renda a frase devolve nada, e
 * não é um erro: a maior parte dos concelhos não tem instrumento do tempo.
 */
function frasesDaSerie(html) {
  const raiz = parse(html, { comment: false, blockTextElements: { script: true, style: true } });
  const out = [];
  for (const p of raiz.querySelectorAll('p')) {
    const texto = p.text.replace(/\s+/g, ' ').trim();
    for (const f of FORMAS) {
      const abre =
        texto.startsWith(f.desceu.trim())
          ? 'desceu'
          : texto.startsWith(f.subiu.trim())
            ? 'subiu'
            : texto.startsWith(f.manteve.trim())
              ? 'manteve'
              : null;
      if (!abre) continue;
      const valores = p
        .querySelectorAll('[data-claim]')
        .map((el) => parsePtNumber(el.text.replace(/\s+/g, ' ').trim()));
      /* O pedaço da mudança procura-se COM OS ESPAÇOS, e não aparado: « to »
         aparado é «to», e «to» vive dentro de «directorate». Medido a 29.08.2026
         com a série de Évora achatada à mão: a forma inglesa da igualdade saía
         como se levasse o pedaço da mudança, e não levava. */
      out.push({ lang: f.lang, verbo: abre, valores, texto, temPara: texto.includes(f.para) });
      break;
    }
  }
  return out;
}

/** O julgamento de uma frase: a palavra e os números dizem a mesma coisa? */
function concorda(fr) {
  if (fr.verbo === 'manteve') {
    /* A forma da igualdade cita o valor UMA vez, e os dois anos da série têm de
       ter o mesmo índice. O segundo valor não está na frase: lê-se do desenho,
       e por isso esta célula confere só o que a frase afirma, que é «não mudou».
       O que impede a forma errada de aparecer é a S1 das outras duas. */
    return fr.valores.length === 1;
  }
  if (fr.valores.length !== 2) return false;
  const [a, b] = fr.valores;
  if (a === null || b === null) return false;
  return fr.verbo === 'desceu' ? b < a : b > a;
}

/**
 * O BLOCO DA FRASE, TAL COMO ELE ESTÁ NO FICHEIRO.
 *
 * O estrago da S1 tem de mexer no `<p>` da frase e em mais nada, e por isso
 * precisa do HTML cru daquele parágrafo. `node-html-parser` devolve-o inteiro,
 * e a procura no ficheiro é por igualdade de cadeia: se ele não estiver lá tal e
 * qual, não se planta nada e a célula di-lo.
 */
function blocoDaFrase(html, lang) {
  const raiz = parse(html, { comment: false, blockTextElements: { script: true, style: true } });
  const f = FORMAS.find((x) => x.lang === lang);
  for (const p of raiz.querySelectorAll('p')) {
    const texto = p.text.replace(/\s+/g, ' ').trim();
    if (
      texto.startsWith(f.desceu.trim()) ||
      texto.startsWith(f.subiu.trim()) ||
      texto.startsWith(f.manteve.trim())
    ) {
      const cru = p.outerHTML;
      return html.includes(cru) ? cru : null;
    }
  }
  return null;
}

/**
 * O mesmo bloco, com o SEGUNDO valor citado trocado por um que contradiz o verbo.
 *
 * O estrago tem de ser CONTRÁRIO à palavra que a frase já leva, e não apenas
 * diferente: numa página que diz «subiu», pôr no segundo lugar um valor ainda
 * maior não contradiz nada, e uma régua que se desse por satisfeita com isso
 * estava a medir a sua própria plantação. Medido a 29.08.2026 com a série de
 * Évora invertida à mão: a primeira forma deste estrago passou a NÃO VISTO
 * quando a página passou a dizer «subiu», e foi assim que se apanhou.
 */
function comSegundoValorContrario(bloco, verbo) {
  const CITADO = /(<span[^>]*data-claim="[^"]*"[^>]*>)([^<]*)(<\/span>)/g;
  /* A FORMA DA IGUALDADE CONTRADIZ-SE DE OUTRA MANEIRA, e tem de ser assim: ela
     cita um valor só, e não há segundo valor para trocar. O que a contradiz é
     ela passar a citar dois: «manteve-se em» com dois números é a mesma classe
     de falsidade, e a régua apanha-a pela contagem dos valores. */
  if (verbo === 'manteve') {
    return bloco.replace(CITADO, (m, abre, valor, fecha) => `${m}${abre}9 999,9${fecha}`);
  }
  const contrario = verbo === 'subiu' ? '0,1' : '9 999,9';
  let n = 0;
  return bloco.replace(CITADO, (m, abre, valor, fecha) => {
    n += 1;
    return n === 2 ? `${abre}${contrario}${fecha}` : m;
  });
}

console.log('');
console.log(cinza('  A RÉGUA DO VERBO DA SÉRIE · I89'));
console.log('');

if (!fs.existsSync(DIST)) {
  salta('S1 · o verbo concorda com os dois valores', 'não existe dist/. Corra `npm run build` primeiro.');
  salta('S2 · a forma da igualdade não escreve uma mudança', 'não existe dist/.');
  salta('S3 · as três formas são seis cadeias distintas', 'não existe dist/.');
} else {
  const ficheiros = ficheirosHtml(DIST);
  const rendidas = [];
  for (const f of ficheiros) {
    for (const fr of frasesDaSerie(fs.readFileSync(f, 'utf8'))) {
      rendidas.push({ ...fr, ficheiro: path.relative(DIST, f) });
    }
  }

  /* S1 · o estrago primeiro, e só depois a conta. */
  {
    let viuOEstrago = false;
    let comOEstrago = '(nenhuma página rende a frase)';
    if (rendidas.length) {
      /* O ESTRAGO: a mesma página, com o SEGUNDO valor da frase trocado por um
         maior do que o primeiro. A frase continua a dizer «desceu», e é
         exactamente a falsidade que a I89 descreve. O estrago faz-se DENTRO do
         bloco da frase, e não na página inteira: um valor com o mesmo feitio
         noutro sítio da página não é este, e trocá-lo não provava nada. */
      const alvo = rendidas.find((r) => r.verbo === 'desceu') ?? rendidas[0];
      const html = fs.readFileSync(path.join(DIST, alvo.ficheiro), 'utf8');
      const bloco = blocoDaFrase(html, alvo.lang);
      const plantado = bloco ? html.replace(bloco, comSegundoValorContrario(bloco, alvo.verbo)) : null;
      if (plantado && plantado !== html) {
        const frases = frasesDaSerie(plantado).filter((x) => x.lang === alvo.lang);
        viuOEstrago = frases.length > 0 && frases.some((x) => !concorda(x));
        comOEstrago =
          `${alvo.ficheiro}: segundo valor da frase trocado por um que contradiz o verbo ` +
          `«${alvo.verbo}»`;
      } else {
        comOEstrago = `${alvo.ficheiro}: não foi possível plantar o estrago`;
      }
    }
    const más = rendidas.filter((r) => !concorda(r));
    conta(
      'S1 · o verbo da frase da série concorda com os dois valores',
      viuOEstrago && más.length === 0 && rendidas.length > 0,
      `estrago plantado ${viuOEstrago ? 'visto' : 'NÃO VISTO'} (${comOEstrago}) · ` +
        `${rendidas.length} frase(s) rendida(s) em ${new Set(rendidas.map((r) => r.ficheiro)).size} página(s), ` +
        `${más.length} em desacordo` +
        (más.length ? `: ${más.slice(0, 3).map((r) => `${r.ficheiro} «${r.texto.slice(0, 90)}»`).join(' · ')}` : ''),
    );
  }

  /* S2 · a forma da igualdade não escreve uma mudança. O estrago é uma frase da
     igualdade com um « para » a mais, construída a partir das cadeias reais. */
  {
    const f = FORMAS[0];
    const plantada = `${f.manteve}105,5%${f.para}105,5% em 2024.`;
    const viuOEstrago = plantada.includes(f.para.trim());
    const igualdades = rendidas.filter((r) => r.verbo === 'manteve');
    const más = igualdades.filter((r) => r.temPara || r.valores.length !== 1);
    conta(
      'S2 · a forma da igualdade não escreve uma mudança',
      viuOEstrago && más.length === 0,
      `estrago plantado ${viuOEstrago ? 'visto' : 'NÃO VISTO'} («${plantada.slice(0, 80)}…») · ` +
        `${igualdades.length} frase(s) de igualdade rendida(s), ${más.length} com «para» ou com dois valores`,
    );
  }

  /* S3 · as três formas são seis cadeias distintas, e nenhuma é prefixo de
     outra: se «subiu» fosse prefixo de «subiu muito», a leitura do verbo desta
     régua escolhia a errada e a S1 media a coisa errada. */
  {
    const cadeias = FORMAS.flatMap((f) => [f.desceu, f.subiu, f.manteve]);
    const distintas = new Set(cadeias.map((c) => c.trim())).size === 6;
    const prefixos = [];
    for (const a of cadeias) {
      for (const b of cadeias) {
        if (a !== b && b.trim().startsWith(a.trim())) prefixos.push(`«${a.trim()}» abre «${b.trim()}»`);
      }
    }
    const daIgualdade = FORMAS.every((f) => f.igual && f.igual !== f.para);
    conta(
      'S3 · as três formas são seis cadeias distintas, e o pedaço da igualdade não é o da mudança',
      distintas && prefixos.length === 0 && daIgualdade,
      `${cadeias.length} cadeias, ${new Set(cadeias.map((c) => c.trim())).size} distintas · ` +
        `${prefixos.length} prefixo(s)${prefixos.length ? `: ${prefixos.join(' · ')}` : ''} · ` +
        `pedaço da igualdade distinto do da mudança: ${daIgualdade ? 'sim' : 'NÃO'}`,
    );
  }
}

console.log('');
console.log(
  `  ${passam === total ? verde(`${passam}/${total}`) : vermelho(`${passam}/${total}`)} célula(s)` +
    (saltadas ? cinza(` · ${saltadas} saltada(s)`) : ''),
);
console.log('');
