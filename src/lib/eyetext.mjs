/**
 * A leitura do olho, do lado do sítio: o texto que o leitor vê, bloco a bloco.
 *
 * É o porte de `ResearchHub/core/eyetext.py`, que é a casa onde vive o modo de
 * ler o texto de um bloco, sobre `node-html-parser`, que este repositório já
 * tem. Existe por uma razão só: o portão precisa de ler a página de leitura
 * construída e devolver, unidade a unidade, exatamente os mesmos caracteres que
 * o registo de conteúdo guarda. Se lesse de outra maneira, a comparação da
 * origem 9 não provava nada.
 *
 * AS QUATRO REGRAS (`publisher/REGISTOS.md`, e são as do motor):
 *
 *   1. os pedaços de texto **dentro de um bloco** juntam-se sem nada pelo meio,
 *      porque as fronteiras dentro de um bloco são de elementos de linha e o
 *      leitor não vê ali espaço nenhum: `<em>(inferência)</em>.` lê-se
 *      «(inferência).» e não «(inferência) .»;
 *   2. um espaço existe onde a fonte tem espaço, e uma corrida de espaço em
 *      branco vale um espaço;
 *   3. os blocos separam-se uns dos outros, e nunca se colam;
 *   4. o texto de um bloco não leva espaço à cabeça nem à cauda.
 *
 * A EXTENSÃO DECLARADA, UMA E UMA SÓ. Os elementos `.src-chip` (o selo de
 * proveniência) são saltados inteiros, sem deixar sequer a fronteira de
 * elemento. É a única mobília da casa que entra dentro de uma unidade da página
 * de leitura, e entra porque a `IDENTIDADE.md` §5.3 não abre exceção de página:
 * onde aparece um valor com linha, aparece o selo. Tudo o resto que apareça
 * dentro de uma unidade é texto do documento, e por isso é comparado.
 *
 * O QUE ESTE MÓDULO NÃO É: não é o `visible_text` da casa do motor, que junta os
 * pedaços com um espaço, e não é um extrator de texto genérico. Devolve blocos
 * na forma do registo, para se poderem comparar campo a campo.
 *
 * A PROVA de que o porte lê como o motor está em `scripts/provar-eyetext.mjs`:
 * corre sobre as cinco edições cujos bytes alojados são os do motor e cuja prova
 * é `edicao-html`, e compara unidade a unidade com o registo fixado. É a mesma
 * guarda que o `core/eyetext_test.py` faz do lado de lá, feita contra o árbitro
 * que os dois lados partilham.
 */

import { parse, NodeType } from 'node-html-parser';

/**
 * Elementos vazios: abrem e fecham no mesmo sítio.
 * A lista é a do motor, carácter a carácter.
 */
export const VAZIOS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Elementos de linha: não abrem bloco nenhum, e o seu texto continua o bloco
 * onde estão. É a família que o `inline()` de cada renderizador escreve.
 */
export const LINHA = new Set([
  'span', 'strong', 'em', 'code', 'a', 'b', 'i', 'sup', 'sub',
  'u', 's', 'small', 'abbr', 'mark', 'time', 'q', 'cite',
  'kbd', 'samp', 'var', 'del', 'ins', 'big', 'font', 'nobr',
]);

/** O género de ênfase de cada etiqueta de linha que o registo grava. */
export const GENERO_DE_ENFASE = { strong: 'strong', b: 'strong', em: 'em', i: 'em', code: 'code' };

/**
 * ===========================================================================
 * O ESPAÇO EM BRANCO DA LEITURA DO OLHO, ESCRITO POR EXTENSO (F0.5, 02.09.2026)
 * ===========================================================================
 *
 * Este módulo dizia `\s` e o seu par do motor (`core/eyetext.py`) dizia
 * `str.isspace()`, e as duas classes não são a mesma classe: medidas nos 69 632
 * primeiros pontos de código, o Python tem 29 caracteres e o JavaScript 25, e
 * discordam em seis.
 *
 *   · U+001C, U+001D, U+001E, U+001F e U+0085 são espaço para o Python e não
 *     são para o JavaScript;
 *   · U+FEFF é espaço para o JavaScript e não é para o Python.
 *
 * Uma classe herdada de uma linguagem não é uma decisão da casa, e duas classes
 * herdadas de duas linguagens é a mesma leitura a dar duas respostas. Aqui está
 * escrita a decisão, e é a mesma cadeia dos dois lados: **um caractere que o
 * olho vê como um espaço, e mais nenhum**.
 *
 *   · entram os cinco espaços do HTML (tabulação, mudança de linha, tabulação
 *     vertical, avanço de página, retorno) e o espaço;
 *   · entram os separadores de espaço do Unicode (Zs: U+00A0, U+1680,
 *     U+2000 a U+200A, U+202F, U+205F, U+3000), que um navegador desenha como
 *     espaço;
 *   · entram os dois separadores de linha e de parágrafo (U+2028, U+2029);
 *   · NÃO entra o U+FEFF, que tem largura zero: apertá-lo a um espaço punha na
 *     leitura um espaço que a página não imprime, que é exatamente o defeito
 *     que o `juntas()` deste módulo existe para medir;
 *   · NÃO entram os U+001C a U+001F nem o U+0085, que nenhum navegador aperta e
 *     que o olho não vê como espaço nenhum.
 *
 * A classe é, portanto, a que as duas linguagens já partilham: 24 caracteres.
 *
 * ESCRITA POR CÓDIGO E NÃO POR CARACTERE, dos dois lados: um U+00A0 ou um U+2007
 * escrito à letra dentro do ficheiro é invisível em qualquer revisão, e uma
 * lista de espaços em branco escrita com espaços em branco é a única lista que
 * ninguém consegue ler.
 */
export const ESPACOS = new Set(
  [
    0x0009, 0x000a, 0x000b, 0x000c, 0x000d, 0x0020,
    0x00a0, 0x1680,
    0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
    0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
    0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
  ].map((c) => String.fromCodePoint(c)),
);

/** Este caractere é espaço em branco para a leitura do olho? */
export function eEspaco(c) {
  return ESPACOS.has(c);
}

/** O texto sem espaço em branco nas duas pontas, pela classe da casa. */
export function apara(s) {
  let i = 0;
  let j = s.length;
  while (i < j && eEspaco(s[i])) i++;
  while (j > i && eEspaco(s[j - 1])) j--;
  return s.slice(i, j);
}

/** Quantos caracteres de espaço em branco há à cabeça, pela classe da casa. */
export function cabecaDeEspaco(s) {
  let i = 0;
  while (i < s.length && eEspaco(s[i])) i++;
  return i;
}

/** Cada corrida de espaço em branco reduzida a um espaço, pela classe da casa. */
export function apertaEspacos(s) {
  let saida = '';
  let i = 0;
  while (i < s.length) {
    if (eEspaco(s[i])) {
      while (i < s.length && eEspaco(s[i])) i++;
      saida += ' ';
    } else {
      saida += s[i];
      i++;
    }
  }
  return saida;
}

/**
 * Onde o texto não é texto do documento.
 *
 * `script`, `style`, `noscript` e `template` são o `_SKIP_TAGS` do
 * `core.reconcile`; `title` é saltado pelo `_Walk` do motor e devolvido à parte,
 * porque é a única corrida de texto visível de um ficheiro que não é um bloco do
 * documento. Em todos eles a fronteira de elemento continua a existir: o que se
 * salta é o texto, e não o elemento.
 */
const SALTA_TEXTO = new Set(['script', 'style', 'noscript', 'template', 'title']);

const TITULO = /<title[^>]*>([\s\S]*?)<\/title>/i;
const CABECALHO = /^h([1-6])$/;

/**
 * A DECLARAÇÃO DE TIPO NÃO É TEXTO, e o analisador desta casa não o sabe.
 *
 * O `html.parser` do motor entrega `<!doctype html>` ao `handle_decl`, que não
 * produz texto nenhum; o `node-html-parser` entrega-o como um nó de texto, e
 * sem esta linha um documento inteiro abria com um parágrafo solto cujo texto
 * era «<!doctype html>». Corta-se só a declaração à cabeça, que é o único sítio
 * onde ela é válida, e uma marca de ordem de bytes à frente dela.
 */
const DECLARACAO = /^﻿?\s*<!DOCTYPE[^>]*>/i;

/** Uma estrutura que a leitura recusa em vez de adivinhar onde pôr o texto. */
export class Falha extends Error {}

/**
 * Tem esta classe? (o atributo pode trazer várias, separadas por espaço)
 *
 * O `\s` aqui é deliberado e não entra na classe de espaço da casa (`ESPACOS`):
 * isto lê um atributo `class` do HTML, que o motor não lê de todo (não há função
 * nenhuma do lado de lá com que isto tenha de concordar), e a norma do HTML
 * separa os nomes de classe pelos cinco espaços ASCII, que o `\s` cobre.
 */
function temClasse(no, classe) {
  const bruto = no.getAttribute?.('class');
  if (!bruto) return false;
  return String(bruto).split(/\s+/).includes(classe);
}

/**
 * O fluxo de etiquetas e de texto, em ordem de documento.
 *
 * O motor lê com um analisador de eventos; aqui a árvore já está construída, e
 * percorrê-la em ordem de documento dá a mesma sequência para um HTML
 * bem-formado, que é o que as duas pontas desta comparação produzem. O endereço
 * de uma âncora é entregue ANTES da abertura da âncora que o traz, como o motor
 * o entrega desde 24.08.2026: entregue depois, ficava a pairar para o elemento
 * de linha seguinte, e as ligações do documento perdiam-se todas.
 */
function eventos(raiz) {
  const saida = [];
  let saltadas = 0;

  const anda = (no) => {
    if (!no) return;
    if (no.nodeType === NodeType.TEXT_NODE) {
      if (!saltadas) saida.push(['texto', no.text]);
      return;
    }
    if (no.nodeType !== NodeType.ELEMENT_NODE) return;
    const tag = String(no.rawTagName ?? '').toLowerCase();
    if (!tag) {
      for (const filho of no.childNodes ?? []) anda(filho);
      return;
    }
    /* A extensão declarada: o selo sai inteiro, sem deixar fronteira. */
    if (temClasse(no, 'src-chip')) return;

    if (tag === 'a') {
      const href = no.getAttribute('href');
      if (href) saida.push(['endereco', href]);
    }
    saida.push(['abre', tag]);
    if (VAZIOS.has(tag)) {
      saida.push(['fecha', tag]);
      return;
    }
    if (SALTA_TEXTO.has(tag)) saltadas++;
    for (const filho of no.childNodes ?? []) anda(filho);
    if (SALTA_TEXTO.has(tag)) saltadas--;
    saida.push(['fecha', tag]);
  };

  for (const filho of raiz.childNodes ?? []) anda(filho);
  return saida;
}

const unidadeNova = () => ({ pedacos: [], intervalos: [] });

/**
 * Os blocos de um HTML, em ordem de documento.
 *
 * Um bloco é aberto por `h1`..`h6`, `p`, `figcaption`, `blockquote`, `hr`, `ul`,
 * `ol` ou `table`. Texto que não caia dentro de nenhum deles forma um parágrafo
 * solto, cortado em cada fronteira de elemento que não seja de linha, porque é
 * assim que o leitor o vê: cada `div` na sua linha.
 *
 * @param {string} html
 * @returns {{kind: string, level?: number, ordered?: boolean, unidade?: object, items?: object[], rows?: object[][]}[]}
 */
export function leBlocos(html) {
  const raiz = parse(String(html).replace(DECLARACAO, ''), {
    comment: false,
    blockTextElements: { script: true, style: true, noscript: false },
  });
  const fluxo = eventos(raiz);

  const blocos = [];
  /** @type {{tag: string, unidade: object|null, hospedeiro: object|null}[]} */
  const molduras = [];
  let solto = null;
  /** @type {{tag: string, href: string|null, unidade: object|null, inicio: number}[]} */
  const pilhaDeLinha = [];
  let enderecoPendente = null;

  const hospedeiroDe = (genero) => {
    for (let i = molduras.length - 1; i >= 0; i--) {
      const h = molduras[i].hospedeiro;
      if (h !== null && h.kind === genero) return h;
    }
    return null;
  };

  const unidadeCorrente = () => {
    for (let i = molduras.length - 1; i >= 0; i--) {
      if (molduras[i].unidade !== null) return molduras[i].unidade;
    }
    return solto;
  };

  const despejaSolto = () => {
    if (solto !== null) {
      if (solto.pedacos.some((c) => apara(c) !== '')) blocos.push({ kind: 'paragraph', unidade: solto });
      solto = null;
    }
  };

  for (const [genero, carga] of fluxo) {
    if (genero === 'texto') {
      let unidade = unidadeCorrente();
      if (unidade === null) {
        solto = unidadeNova();
        unidade = solto;
      }
      unidade.pedacos.push(carga);
      continue;
    }
    if (genero === 'endereco') {
      enderecoPendente = carga;
      continue;
    }
    const tag = carga;
    if (LINHA.has(tag)) {
      if (genero === 'abre') {
        const unidade = unidadeCorrente();
        pilhaDeLinha.push({
          tag,
          href: enderecoPendente,
          unidade,
          inicio: (unidade ?? { pedacos: [] }).pedacos.length,
        });
        enderecoPendente = null;
      } else {
        for (let i = pilhaDeLinha.length - 1; i >= 0; i--) {
          if (pilhaDeLinha[i].tag !== tag) continue;
          const { href, unidade, inicio } = pilhaDeLinha[i];
          pilhaDeLinha.splice(i, 1);
          if (unidade !== null && unidade === unidadeCorrente() && unidade.pedacos.length > inicio) {
            unidade.intervalos.push({ tag, href, inicio, fim: unidade.pedacos.length });
          }
          break;
        }
      }
      continue;
    }
    if (genero === 'abre') {
      despejaSolto();
      const cabecalho = CABECALHO.exec(tag);
      if (cabecalho) {
        const unidade = unidadeNova();
        blocos.push({ kind: 'heading', level: Number(cabecalho[1]), unidade });
        molduras.push({ tag, unidade, hospedeiro: null });
      } else if (tag === 'p' || tag === 'figcaption' || tag === 'blockquote') {
        const unidade = unidadeNova();
        blocos.push({ kind: 'paragraph', unidade });
        molduras.push({ tag, unidade, hospedeiro: null });
      } else if (tag === 'hr') {
        blocos.push({ kind: 'rule' });
        molduras.push({ tag, unidade: null, hospedeiro: null });
      } else if (tag === 'ul' || tag === 'ol') {
        const bloco = { kind: 'list', ordered: tag === 'ol', items: [] };
        blocos.push(bloco);
        molduras.push({ tag, unidade: null, hospedeiro: bloco });
      } else if (tag === 'li') {
        const hospedeiro = hospedeiroDe('list');
        if (hospedeiro === null) {
          throw new Falha('um <li> fora de qualquer lista: o passeio de blocos não sabe onde pôr o seu texto');
        }
        const unidade = unidadeNova();
        hospedeiro.items.push(unidade);
        molduras.push({ tag, unidade, hospedeiro: null });
      } else if (tag === 'table') {
        const bloco = { kind: 'table', rows: [] };
        blocos.push(bloco);
        molduras.push({ tag, unidade: null, hospedeiro: bloco });
      } else if (tag === 'tr') {
        const hospedeiro = hospedeiroDe('table');
        if (hospedeiro === null) {
          throw new Falha('um <tr> fora de qualquer tabela: o passeio de blocos não sabe onde pôr as suas células');
        }
        hospedeiro.rows.push([]);
        molduras.push({ tag, unidade: null, hospedeiro: null });
      } else if (tag === 'td' || tag === 'th') {
        const hospedeiro = hospedeiroDe('table');
        if (hospedeiro === null || hospedeiro.rows.length === 0) {
          throw new Falha('uma célula fora de qualquer linha: o passeio de blocos não sabe onde pôr o seu texto');
        }
        const unidade = unidadeNova();
        unidade.header = tag === 'th';
        hospedeiro.rows[hospedeiro.rows.length - 1].push(unidade);
        molduras.push({ tag, unidade, hospedeiro: null });
      } else {
        molduras.push({ tag, unidade: null, hospedeiro: null });
      }
      enderecoPendente = null;
    } else {
      despejaSolto();
      for (let i = molduras.length - 1; i >= 0; i--) {
        if (molduras[i].tag === tag) {
          molduras.splice(i);
          break;
        }
      }
    }
  }
  despejaSolto();
  return blocos;
}

/**
 * Aperta cada corrida de espaço em branco a um espaço; devolve `{texto, indice}`.
 *
 * O índice leva cada posição do texto de origem à sua posição no texto apertado,
 * para que as coordenadas de uma referência ou de uma ênfase sobrevivam ao
 * aperto sem serem recalculadas por semelhança.
 *
 * @param {string} s
 */
export function apertaComMapa(s) {
  const saida = [];
  const indice = new Array(s.length + 1).fill(0);
  let i = 0;
  while (i < s.length) {
    if (eEspaco(s[i])) {
      let j = i;
      while (j < s.length && eEspaco(s[j])) {
        indice[j] = saida.length;
        j++;
      }
      saida.push(' ');
      i = j;
    } else {
      indice[i] = saida.length;
      saida.push(s[i]);
      i++;
    }
  }
  indice[s.length] = saida.length;
  return { texto: saida.join(''), indice };
}

/**
 * O texto de uma unidade, com as coordenadas de origem ainda utilizáveis.
 *
 * `bruto` é a junção DIRETA dos pedaços: é aí que a leitura do olho difere da do
 * `visible_text`, e é a única diferença entre as duas.
 */
export class Texto {
  /** @param {{pedacos: string[], intervalos: object[], header?: boolean}} unidade */
  constructor(unidade) {
    this.pedacos = unidade.pedacos;
    this.bruto = this.pedacos.join('');
    const { texto, indice } = apertaComMapa(this.bruto);
    this.indice = indice;
    this.cabeca = cabecaDeEspaco(texto);
    this.texto = apara(texto);
    this.deslocamentos = [];
    let posicao = 0;
    for (const pedaco of this.pedacos) {
      this.deslocamentos.push(posicao);
      posicao += pedaco.length;
    }
  }

  /** A posição do texto apertado que corresponde a uma posição do texto bruto. */
  em(posicaoBruta) {
    return Math.min(Math.max(this.indice[posicaoBruta] - this.cabeca, 0), this.texto.length);
  }

  /** O intervalo, no texto apertado, coberto por uma corrida de pedaços. */
  intervaloDePedacos(inicio, fim) {
    const a = this.deslocamentos[inicio];
    const b = this.deslocamentos[fim - 1] + this.pedacos[fim - 1].length;
    return [this.em(a), this.em(b)];
  }

  /**
   * (fronteiras apertadas nesta unidade, quantas delas o texto imprime).
   *
   * Uma fronteira apertada é um sítio onde dois pedaços de texto se encostam sem
   * espaço nenhum de nenhum dos lados: é ali que o `visible_text` mete um espaço
   * que a página não imprime. O segundo número tem de ser zero.
   */
  juntas() {
    let apertadas = 0;
    let fantasmas = 0;
    for (let i = 0; i < this.pedacos.length - 1; i++) {
      const esquerda = this.pedacos[i];
      const direita = this.pedacos[i + 1];
      if (!esquerda || !direita) continue;
      if (eEspaco(esquerda[esquerda.length - 1]) || eEspaco(direita[0])) continue;
      apertadas++;
      const em = this.em(this.deslocamentos[i + 1]);
      if (em > 0 && em <= this.texto.length && this.texto[em - 1] === ' ') fantasmas++;
    }
    return [apertadas, fantasmas];
  }
}

/** Todas as unidades que carregam texto, em ordem de documento. */
export function* unidades(blocos) {
  for (const bloco of blocos) {
    if (bloco.kind === 'heading' || bloco.kind === 'paragraph') yield bloco.unidade;
    else if (bloco.kind === 'list') yield* bloco.items;
    else if (bloco.kind === 'table') for (const linha of bloco.rows) yield* linha;
  }
}

/** O texto do olho de cada unidade de um HTML, em ordem de documento. */
export function le(html) {
  return [...unidades(leBlocos(html))].map((u) => new Texto(u).texto);
}

/**
 * Os blocos de um HTML na forma do registo de conteúdo.
 *
 * É esta a saída que o portão compara com o `.record.json`: os mesmos campos,
 * com os mesmos nomes, para que a comparação seja campo a campo e não uma
 * tradução no meio.
 *
 * @param {string} html
 */
export function registoDoHtml(html) {
  return leBlocos(html).map((bloco) => {
    if (bloco.kind === 'rule') return { kind: 'rule' };
    if (bloco.kind === 'heading') {
      return { kind: 'heading', level: bloco.level, text: new Texto(bloco.unidade).texto };
    }
    if (bloco.kind === 'paragraph') return { kind: 'paragraph', text: new Texto(bloco.unidade).texto };
    if (bloco.kind === 'list') {
      return {
        kind: 'list',
        ordered: bloco.ordered,
        items: bloco.items.map((u) => ({ text: new Texto(u).texto })),
      };
    }
    return {
      kind: 'table',
      rows: bloco.rows.map((linha) =>
        linha.map((u) => ({ text: new Texto(u).texto, header: Boolean(u.header) })),
      ),
    };
  });
}

/** O `<title>` de um HTML, sem entidades e sem espaço a mais. */
export function tituloDoHtml(html) {
  const achado = TITULO.exec(String(html));
  if (!achado) return '';
  const fragmento = parse(`<span>${achado[1]}</span>`);
  return apara(apertaEspacos(fragmento.text));
}
