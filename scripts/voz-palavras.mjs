#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PORTÃO DAS PALAVRAS PROIBIDAS · a lista da norma §1.3, sobre o dist/
 * ---------------------------------------------------------------------------
 * Bloco P3, 16.09.2026, item 5 do brief. A norma
 * (`design/observatorio/NORMA-como-se-escreve-se-mostra-e-se-organiza.md`, §5.4)
 * diz porque é que ele existe, e diz-o melhor do que este comentário: «é o que
 * impede a mesma palavra de voltar num bloco distraído». Todas as palavras da
 * lista já foram tiradas do sítio uma vez, por um bloco que as leu uma a uma; o
 * que faltava era a rede que as apanha da segunda.
 *
 * A DEFINIÇÃO VIVE AQUI E MAIS EM LADO NENHUM. `scripts/check-voz.mjs` chama
 * esta função e fecha a construção com o que ela devolver; a planta
 * (`tests/voz/palavras-proibidas.mjs`) chama a MESMA função sobre uma cópia de
 * `dist/` com uma palavra plantada, e exige que ela a veja. Duas cópias da lista
 * divergiriam na primeira correção, e a que fechasse a construção seria a que
 * ninguém tinha lido.
 *
 * ---------------------------------------------------------------------------
 * O QUE É «À VISTA», QUE É A PALAVRA DA NORMA
 * ---------------------------------------------------------------------------
 * A norma proíbe estas palavras NA SUPERFÍCIE. A superfície de uma página é o
 * que ela mostra sem o leitor abrir nada, e este portão define-a por mecanismo e
 * não por gosto:
 *
 *   · sai o que não é texto do leitor: `<script>` e `<style>`;
 *   · sai o que é TRANSCRITO e não escrito por este projeto: os campos do
 *     livro-razão (`data-linha-campo`), as citações verbatim (`data-verbatim`),
 *     o registo de um estudo (`data-registo`), o registo da agenda
 *     (`data-agenda`) e o nome oficial de uma medida
 *     (`data-nonledger="nome-oficial-da-medida"`). O que se copia de uma fonte
 *     fica como a fonte o escreveu, e uma palavra da lista lá dentro não é este
 *     projeto a escrevê-la;
 *   · do registo das correções sai só o que é transcrito, e não a entrada
 *     inteira (leitura a frio do Codex de 16.09.2026, achado 4). Até essa
 *     leitura o portão tirava todo o elemento marcado com `data-correcao-campo`,
 *     e com ele a RAZÃO da correção, que é prosa escrita por este projeto: era
 *     por aí que «no motor de investigação desta casa» vivia na página das
 *     correções com o portão verde. Ficam de fora os quatro campos de terceiros
 *     (o valor antigo e o novo, como a fonte os escreveu; o nome do campo do
 *     livro-razão; o identificador da linha) e entram na superfície os três que
 *     este projeto escreve: a razão, o rótulo do tipo e a data;
 *   · sai o que está DENTRO DE UMA DOBRA e não no seu rótulo: o corpo de um
 *     `<details>`, que é exactamente o «atrás de um toque» da norma §2.1. O
 *     `<summary>` fica, porque é o que se lê com a dobra fechada.
 *
 * E há duas exceções por ROTA, cada uma com a sua razão escrita, em `EXCECOES`.
 *
 * NÃO SE ENFRAQUECE: uma exceção nova entra nesta lista, com o motivo por
 * extenso e a data, e não por um `continue` escondido num laço.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

/**
 * As palavras, e o que se escreve em vez de cada uma.
 *
 * O `marca` é o que fecha a construção; o `em_vez` é o que o relatório diz a
 * quem a apanhar, para que a mensagem do portão seja uma instrução e não uma
 * recusa. A ordem é a da norma §1.3.
 *
 * @type {{ chave: string, marca: RegExp, em_vez: string, porque: string }[]}
 */
export const PALAVRAS_PROIBIDAS = [
  {
    chave: 'a casa',
    /* «casa» depois de artigo ou de preposição contraída, que é a forma em que o
       sítio falava de si. Não apanha «casas» (a habitação, que o sítio mede) nem
       «casa decimal» (a posição de um algarismo), e as duas estão medidas: a
       página da área da habitação diz «casas compradas pelas famílias» e a das
       correções diz «uma casa decimal que a fonte não sustenta». */
    marca: /\b(?:a|da|à|na|pela|desta|nesta|esta)\s+casa\b(?!\s+decimal)/i,
    em_vez: '«este projeto» ou «O Estado do País»',
    porque:
      'em português «casa» é a habitação, que é uma das coisas que este projeto mede ' +
      '(decisão do diretor de 15.09.2026 às 16:35 UTC; norma §1.3)',
  },
  {
    chave: 'the house',
    marca: /\bthe house(?:’s|'s)?\b|\bhouse (?:rules|policy|values)\b/i,
    em_vez: '«this project» or «O Estado do País»',
    porque: 'a gémea inglesa de «a casa»: é a tradução de uma palavra que saiu do português',
  },
  {
    chave: 'política da casa',
    marca: /pol[íi]tica da casa|house policy/i,
    em_vez: '«o Método», pelo nome da página onde as regras vivem',
    porque: '«policy» não é «política»: a política é a dos partidos (norma §1.3)',
  },
  {
    chave: 'página inteira',
    marca: /p[áa]gina inteira|full page/i,
    em_vez: 'nada: a porta é o nome da página do outro lado',
    porque: 'decalque de «full page», e diz o mecanismo em vez do destino',
  },
  {
    chave: 'passe o rato',
    marca: /passe o rato|hover over/i,
    em_vez: 'nada: o mapa e a busca explicam-se ao funcionar (norma §1.4)',
    porque: 'decalque de «mouse over», e é uma frase de instrução',
  },
  {
    chave: 'toque em',
    marca: /\btoque n(?:o|a|os|as|um|uma)\b|\btoque em\b|\btap (?:a|an|the)\b/i,
    em_vez: 'nada, ou «escolha»',
    porque: 'decalque de «tap», e é uma frase de instrução numa página de conteúdo',
  },
  {
    chave: 'limiar',
    marca: /\blimiar(?:es)?\b|\bthreshold(?:s)?\b/i,
    em_vez: '«valor de referência»',
    porque: 'decisão do diretor de 15.09.2026 de manhã, aplicada pelo bloco P1',
  },
  {
    chave: 'responsável editorial',
    marca: /respons[áa]vel editorial|editorial responsibility/i,
    em_vez: 'a frase da regra 9 do Método, que diz o que a direção faz sem a nomear',
    porque: 'decalque de «editorial responsibility» (leitura do diretor de 15.09.2026)',
  },
  {
    chave: 'e mais N',
    marca: /\be mais (?:\d|um|dois|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez)\b|\band \d+ more\b/i,
    em_vez: 'a lista inteira, ou nenhuma',
    porque: '«e mais cinco» não é frase de jornal (leitura do diretor de 15.09.2026)',
  },
  {
    chave: 'incluído em',
    marca: /inclu[íi]do em|included in/i,
    em_vez: 'uma linha só, com o nome do lugar',
    porque: 'é uma frase sobre a arrumação do sítio («I don’t even know what that means»)',
  },
  {
    chave: 'sem guião',
    marca: /sem gui[ãa]o|without scripting/i,
    em_vez: '«sem JavaScript», que é o nome da coisa',
    porque: 'o plano das palavras, §4: a tecnologia de apoio ouve o nome da tecnologia',
  },
  {
    chave: 'conferido a',
    marca: /(?<![a-zà-ú-])conferido a\b|(?<![a-zà-ú-])checked on\b/i,
    em_vez: 'nada à vista: a data vive no recibo da linha',
    porque: 'é um rótulo de recibo, e o recibo está atrás da marca da fonte (norma §2.1)',
  },
  {
    chave: 'lido na fonte a',
    marca: /lido na fonte a\b|read at the source on\b/i,
    em_vez: 'nada à vista: a data vive no recibo da linha',
    porque: 'idem: é um rótulo de recibo (plano das palavras, §4)',
  },
  {
    chave: 'os dois estados do selo',
    marca: /os dois estados do selo|the two seal states/i,
    em_vez: '«a marca da fonte»',
    porque: 'decisão de 15.09.2026 de manhã: o leitor não aprende os estados de um selo',
  },
];

/**
 * As rotas que a lista não mede, cada uma com a sua razão.
 *
 * SÃO DUAS, E SÃO A MESMA COISA: o documento de um estudo é o estudo original,
 * alojado tal como foi publicado, com uma faixa deste projeto no topo e mais
 * nada (`src/lib/routes.mjs`, a rota `documento`). Não é uma página deste sítio
 * e não é prosa que este bloco possa reescrever: é um documento fixado, e
 * reescrevê-lo depois de publicado era o contrário da regra da casa sobre o que
 * se transcreve. Medido a 16.09.2026: as palavras da lista que lá estão são
 * «limiar» (a convenção da Agência Europeia do Ambiente, citada pelo estudo da
 * água) e «passe o rato» (as legendas dos desenhos interativos do estudo «Onde
 * está a água»).
 *
 * @type {{ marca: RegExp, porque: string }[]}
 */
export const EXCECOES = [
  {
    marca: /(^|\/)estudos\/[^/]+\/documento\//,
    so: null,
    porque:
      'o documento de um estudo é o estudo original, alojado como foi publicado; ' +
      'não é prosa de interface e não se reescreve depois de publicado',
  },
  {
    marca: /(^|\/)en\/studies\/[^/]+\/document\//,
    so: null,
    porque: 'a gémea inglesa da rota acima',
  },
  {
    marca: /(^|\/)estudos\/[^/]+\/texto\//,
    so: null,
    porque:
      'a página `texto` de um estudo é a transcrição de um documento fixado, composta no ' +
      'gabarito deste projeto a partir do registo que o motor escreve (`src/lib/routes.mjs`): ' +
      'a prosa é do estudo e não da interface, e as figuras dela entram por `data-registo`. ' +
      'Medido a 16.09.2026: uma ocorrência, «o limiar em que todo este período assenta», na ' +
      'transcrição de «Évora — Quinze Anos, Cinco Mandatos»',
  },
  {
    marca: /(^|\/)en\/studies\/[^/]+\/text\//,
    so: null,
    porque: 'a gémea inglesa da rota acima',
  },
  {
    /* O RECIBO É O QUE ESTÁ ATRÁS DA MARCA, e é isso que o plano das palavras
       manda: «conferido a, lido na fonte a → (atrás da marca)». A marca da fonte
       de um valor leva à página da sua linha, e o índice do livro-razão é a
       porta dessa família. É aí que os dois rótulos são o nome de um campo do
       recibo, e não uma legenda na superfície de uma página de conteúdo. A
       exceção é só para esses DOIS, e não para a lista: «limiar» ou «a casa»
       numa página do livro-razão continuam a fechar a construção. */
    marca: /^(livro-razao|en\/ledger)(\/|$)/,
    so: ['conferido a', 'lido na fonte a'],
    porque:
      'o livro-razão é o recibo, que é o lugar que a norma §2.1 dá a estas duas datas: ' +
      'chega-se lá pela marca da fonte, e o rótulo é o nome do campo que o recibo mostra',
  },
];

/**
 * Os campos do registo das correções que são de terceiros, e por isso não são
 * superfície deste projeto.
 *
 * O valor antigo e o novo são o número como a fonte o escreveu; `field` é o nome
 * de um campo do livro-razão; `id` é o identificador da linha. Os outros três
 * campos que o registo marca (`reason`, `kind`, `date`) são escritos por este
 * projeto, e por isso medem-se como qualquer outra frase sua.
 *
 * @type {string[]}
 */
export const CAMPOS_DE_CORRECAO_TRANSCRITOS = ['old_value', 'new_value', 'field', 'id'];

/**
 * O texto do leitor de uma página, tal como ele o vê sem abrir nada.
 *
 * @param {string} html
 * @returns {string}
 */
export function superficieDe(html) {
  const root = parse(html);
  for (const fora of root.querySelectorAll('script, style')) fora.remove();
  for (const campo of root.querySelectorAll(
    `[data-linha-campo], [data-verbatim], [data-registo], [data-agenda], [data-nonledger="nome-oficial-da-medida"], ${CAMPOS_DE_CORRECAO_TRANSCRITOS.map(
      (c) => `[data-correcao-campo="${c}"]`,
    ).join(', ')}`,
  )) {
    campo.remove();
  }
  /* A DOBRA FECHADA NÃO É SUPERFÍCIE, e o rótulo dela é. */
  for (const dobra of root.querySelectorAll('details')) {
    for (const filho of dobra.childNodes.slice()) {
      if (filho.rawTagName?.toLowerCase?.() !== 'summary') filho.remove();
    }
  }
  return (root.querySelector('body')?.textContent ?? '').replace(/\s+/g, ' ');
}

/**
 * Os achados da lista sobre uma árvore construída.
 *
 * @param {string} dist
 * @returns {{ achados: { caminho: string, chave: string, trecho: string, em_vez: string, porque: string }[], paginas: number, excecoes: number }}
 */
export function palavrasProibidasEm(dist) {
  const achados = [];
  let paginas = 0;
  let excecoes = 0;
  /** @param {string} dir */
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name.endsWith('.html')) le(p);
    }
  };
  /** @param {string} ficheiro */
  const le = (ficheiro) => {
    const rel = path.relative(dist, ficheiro).split(path.sep).join('/');
    const isentas = new Set();
    let inteira = false;
    for (const x of EXCECOES) {
      if (!x.marca.test(rel)) continue;
      if (x.so === null || x.so === undefined) inteira = true;
      else for (const chave of x.so) isentas.add(chave);
    }
    if (inteira) {
      excecoes++;
      return;
    }
    paginas++;
    const texto = superficieDe(fs.readFileSync(ficheiro, 'utf8'));
    for (const p of PALAVRAS_PROIBIDAS) {
      if (isentas.has(p.chave)) continue;
      const m = p.marca.exec(texto);
      if (!m) continue;
      const i = m.index;
      achados.push({
        caminho: rel,
        chave: p.chave,
        trecho: texto.slice(Math.max(0, i - 60), i + m[0].length + 60).trim(),
        em_vez: p.em_vez,
        porque: p.porque,
      });
    }
  };
  anda(dist);
  return { achados, paginas, excecoes };
}
