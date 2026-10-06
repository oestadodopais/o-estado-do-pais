/**
 * =============================================================================
 * F22 · AS BARRAS DAS LINHAS DO LIVRO, RECOMPOSTAS DAS LINHAS (bloco EX1, 05.10.2026)
 * =============================================================================
 *
 * A forma `barras-do-livro` das figuras das explicações (`src/components/formas/BarrasDoLivro.astro`), conferida
 * no HTML construído como a F21 confere a `serie-do-pais`: a célula não chama o modelo nem a vista, e refaz tudo a
 * partir da declaração da figura (`src/data/explicacoes/`) e das linhas do livro-razão.
 *
 *   · as barras são as linhas declaradas da figura, uma vez cada, da maior para a menor (dois valores iguais pela
 *     ordem declarada), e mais nenhuma;
 *   · a fração de cada barra é o valor dividido pelo maior, com seis casas (`data-fracao`), e o comprimento escrito
 *     na folha (`width`) é essa fração escrita (as seis casas) vezes a faixa de 72 %, com quatro casas;
 *   · o valor desenhado é o `<tspan data-claim>` da própria linha, com o valor dela, dentro do `<svg>` da fila;
 *   · o rótulo é o nome declarado da função ou do ministério da linha, tirado pela regra desta célula do nome do
 *     projeto (o pedaço depois de «que vai para » ou «going to », sem o artigo);
 *   · a lista «Os números desta figura» (`data-legenda-selos`) tem as mesmas linhas pela mesma ordem, cada uma com o
 *     seu selo, dentro do mesmo instrumento.
 *
 * AS PLANTAS correm em memória, sobre a figura com o seu instrumento, e cada uma tem de morder com a queixa dela:
 * uma barra fora de escala, um valor trocado entre duas barras, duas barras fora de ordem, uma barra a menos e um
 * rótulo de outra linha. Nenhuma toca no `dist/`.
 *
 * EX1-c (06.10.2026, o achado 15 da leitura a frio): A F22 PERCORRE AS FIGURAS DECLARADAS, e não só as que a página
 * tem. Cada figura que uma explicação declara tem de estar na página dela, no instrumento dela
 * (`figurasDeclaradasEmFalta`), com a planta de uma figura tirada da página.
 */
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../../src/data/explicacoes/index.mjs';
import { NOMES_OE1 } from '../../src/data/medidas-oe1.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';

const FAIXA = 72;
const PREFIXO = { pt: ' que vai para ', en: ' going to ' };
const ARTIGO = { pt: /^(?:o|a|os|as) /, en: /^the / };

/** O número de um valor do livro, pela conta desta célula. @param {unknown} v */
const numero = (v) => {
  const s = String(v ?? '').replace(/[\s  ]/g, '').replace(/−/g, '-').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
const seis = (/** @type {number} */ f) => String(Number(f.toFixed(6)));
/** O comprimento escrito de uma fração: a fração com seis casas, vezes a faixa, com quatro. @param {number} f */
const quatro = (f) => `${Number((Number(f.toFixed(6)) * FAIXA).toFixed(4))}%`;

/** A declaração de uma figura, pelo slug da explicação e pelo id da figura. @param {string} slug @param {string} id */
export function figuraDeclarada(slug, id) {
  const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === slug));
  for (const s of e?.seccoes ?? []) for (const b of s.conteudo ?? []) if (b.figura?.id === id) return b.figura;
  return null;
}

/**
 * AS FIGURAS DECLARADAS QUE A PÁGINA NÃO TEM (EX1-c): cada figura de cada secção da explicação tem de estar no seu
 * instrumento (`explicacao-<slug>-<id>`), com a figura `barras-do-livro` dela dentro.
 * @param {any} root a raiz da página da explicação @param {string} slug @returns {string[]}
 */
export function figurasDeclaradasEmFalta(root, slug) {
  const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === slug));
  if (!e) return [`F22 · a página da explicação «${slug}» não tem declaração`];
  /** @type {string[]} */
  const erros = [];
  for (const s of e.seccoes ?? []) for (const b of s.conteudo ?? []) {
    if (!b.figura) continue;
    const id = String(b.figura.id);
    const instrumento = root.querySelector(`[data-instrumento="explicacao-${slug}-${id}"]`);
    if (!instrumento || !instrumento.querySelector(`figure[data-forma="barras-do-livro"][data-barras-do-livro="${id}"]`)) erros.push(`F22 · a figura declarada «${id}» da explicação «${slug}» não está na página`);
  }
  return erros;
}

/** As plantas da presença das figuras declaradas, em memória, sobre a página inteira. @param {string} html @param {string} slug */
export function plantasDasFigurasDeclaradas(html, slug) {
  const controlo = figurasDeclaradasEmFalta(parse(html), slug);
  const r = parse(html);
  const instrumentos = r.querySelectorAll('[data-instrumento]').filter((x) => x.querySelector('figure[data-forma="barras-do-livro"]'));
  instrumentos.at(-1)?.remove();
  const q = figurasDeclaradasEmFalta(r, slug);
  return [{ nome: 'uma figura declarada tirada da página', mordeu: controlo.length === 0 && instrumentos.length > 0 && q.some((x) => /F22 · a figura declarada/.test(x)), queixa: q.join(' | ') || 'nenhuma queixa' }];
}

/** O rótulo de uma linha, pela regra desta célula. @param {string} id @param {'pt'|'en'} lang */
export function rotuloPelaCelula(id, lang) {
  const nome = /** @type {Record<string, { pt: string, en: string }>} */ (NOMES_OE1)[id]?.[lang];
  if (typeof nome !== 'string' || !nome.includes(PREFIXO[lang])) return null;
  return nome.slice(nome.indexOf(PREFIXO[lang]) + PREFIXO[lang].length).replace(ARTIGO[lang], '');
}

/**
 * Uma figura `barras-do-livro`, conferida no seu instrumento.
 * @param {any} instrumento o elemento `[data-instrumento]` que tem a figura e a lista
 * @param {'pt'|'en'} lang @param {string} slug @param {Map<string, any>} [linhas]
 * @returns {string[]}
 */
export function conferirBarrasDoLivro(instrumento, lang, slug, linhas = loadClaims()) {
  /** @type {string[]} */
  const erros = [];
  const figura = instrumento.querySelector('figure[data-forma="barras-do-livro"]');
  if (!figura) return ['F22 · o instrumento não tem figura `barras-do-livro`'];
  const id = figura.getAttribute('data-barras-do-livro') ?? '';
  const decl = figuraDeclarada(slug, id);
  if (!decl) return [`F22 · a figura «${id}» da explicação «${slug}» não está declarada`];
  if (instrumento.getAttribute('data-instrumento') !== `explicacao-${slug}-${id}`) erros.push(`F22 · ${id}: o instrumento não é o desta figura`);
  if (figura.querySelector('figcaption')?.text.trim() !== decl.titulo[lang]) erros.push(`F22 · ${id}: o título da figura não é o declarado`);
  const lidas = decl.linhas.map((/** @type {string} */ l, /** @type {number} */ ordem) => ({ l, ordem, v: numero(linhas.get(l)?.value) }));
  if (lidas.some((/** @type {any} */ x) => x.v === null)) return [...erros, `F22 · ${id}: uma linha declarada não tem valor legível`];
  const maior = Math.max(...lidas.map((/** @type {any} */ x) => x.v));
  const esperadas = [...lidas].sort((a, b) => b.v - a.v || a.ordem - b.ordem);
  const filas = figura.querySelectorAll('li[data-barra]');
  if (filas.length !== esperadas.length) erros.push(`F22 · ${id}: ${filas.length} barras desenhadas e ${esperadas.length} linhas declaradas`);
  esperadas.forEach((x, i) => {
    const fila = filas[i];
    if (!fila) return;
    const linha = fila.getAttribute('data-barra');
    if (linha !== x.l) { erros.push(`F22 · ${id}: a barra ${i + 1} é «${linha}» e devia ser «${x.l}» (da maior para a menor)`); return; }
    const fracao = seis(x.v / maior);
    if (fila.getAttribute('data-fracao') !== fracao) erros.push(`F22 · ${id}: a fração de «${x.l}» é ${fila.getAttribute('data-fracao')} e a conta dá ${fracao}`);
    const largura = /width:\s*([\d.]+%)/.exec(fila.querySelector('.exp-barra')?.getAttribute('style') ?? '')?.[1];
    if (largura !== quatro(x.v / maior)) erros.push(`F22 · ${id}: a barra de «${x.l}» tem ${largura ?? 'nenhuma largura'} e a escala dá ${quatro(x.v / maior)} (fora de escala)`);
    const tspans = fila.querySelectorAll('svg [data-claim]');
    if (tspans.length !== 1 || tspans[0].getAttribute('data-claim') !== x.l || tspans[0].text.trim() !== String(linhas.get(x.l)?.value)) {
      erros.push(`F22 · ${id}: o valor desenhado na barra de «${x.l}» não é o valor dela («${tspans.map((t) => `${t.getAttribute('data-claim')}=${t.text.trim()}`).join(', ')}»; o valor trocado)`);
    }
    const rotulo = fila.querySelector('[data-barra-rotulo]');
    if (rotulo?.getAttribute('data-barra-rotulo') !== x.l || rotulo?.text.trim() !== rotuloPelaCelula(x.l, lang)) erros.push(`F22 · ${id}: o rótulo da barra de «${x.l}» não é o nome declarado («${rotulo?.text.trim()}»)`);
  });
  const legenda = instrumento.querySelector('[data-legenda-selos]');
  const itens = legenda ? legenda.querySelectorAll('[data-figura-numero]') : [];
  if (!legenda) erros.push(`F22 · ${id}: falta a lista dos números da figura (data-legenda-selos)`);
  else if (JSON.stringify(itens.map((x) => x.getAttribute('data-figura-numero'))) !== JSON.stringify(esperadas.map((x) => x.l))) erros.push(`F22 · ${id}: a lista dos números não tem as linhas da figura pela ordem das barras`);
  for (const it of itens) {
    const l = it.getAttribute('data-figura-numero');
    const chip = it.querySelectorAll('a.src-chip').map((a) => a.getAttribute('href') ?? '');
    if (!chip.some((h) => h.endsWith(`/${l}`))) erros.push(`F22 · ${id}: a linha «${l}» da lista dos números não tem o seu selo`);
  }
  return erros;
}

/**
 * AS PLANTAS DA F22, em memória, sobre o HTML do instrumento.
 * @param {string} html o `outerHTML` do instrumento @param {'pt'|'en'} lang @param {string} slug
 */
export function plantasDasBarrasDoLivro(html, lang, slug) {
  const linhas = loadClaims();
  const controlo = conferirBarrasDoLivro(parse(html).querySelector('[data-instrumento]'), lang, slug, linhas);
  /** @param {string} nome @param {(r: any) => void} estraga @param {RegExp} mordida */
  const planta = (nome, estraga, mordida) => {
    const r = parse(html);
    estraga(r);
    const queixas = conferirBarrasDoLivro(r.querySelector('[data-instrumento]'), lang, slug, linhas);
    return { nome, mordeu: controlo.length === 0 && queixas.some((q) => mordida.test(q)), queixa: queixas.join(' | ') || 'nenhuma queixa' };
  };
  return [
    planta('uma barra fora de escala', (r) => {
      const barra = r.querySelectorAll('li[data-barra] .exp-barra')[1];
      barra.setAttribute('style', 'width:72%');
    }, /fora de escala/),
    planta('um valor trocado entre duas barras', (r) => {
      const [a, b] = r.querySelectorAll('li[data-barra] svg [data-claim]');
      const ta = a.text, tb = b.text;
      a.set_content(tb); b.set_content(ta);
    }, /valor trocado/),
    planta('duas barras fora de ordem', (r) => {
      const ol = r.querySelector('ol');
      const [a, b] = ol.querySelectorAll('li[data-barra]');
      ol.insertAdjacentHTML('afterbegin', b.outerHTML);
      b.remove();
      void a;
    }, /da maior para a menor/),
    planta('uma barra a menos', (r) => { r.querySelectorAll('li[data-barra]').at(-1).remove(); }, /barras desenhadas/),
    planta('o rótulo de outra linha', (r) => {
      const [a, b] = r.querySelectorAll('li[data-barra] [data-barra-rotulo]');
      a.set_content(b.text);
    }, /não é o nome declarado/),
  ];
}
