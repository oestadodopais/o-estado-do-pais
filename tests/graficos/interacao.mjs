#!/usr/bin/env node
/**
 * check:graficos, a régua da interação dos gráficos (bloco G1, 21.10.2026, o §2 do mandato dos gráficos; a I230).
 *
 * Sobre o `dist/` construído (ou `OEDP_DIST`), em cada página das duas edições:
 *   G1 · cada desenho com valores escondidos (toda a série no tempo, com zonas de leitura ou sem elas; a faixa dos
 *        países de um cartão) tem `data-grafico`; um desenho de um componente que não está na dívida declarada abaixo e
 *        não tem a marca é um erro, com o caminho da página e o componente. A única isenção é a marca decorativa
 *        explícita (`data-grafico-decorativo` com `aria-hidden="true"`; uma sem a outra é erro), nunca os algarismos
 *        (a correção G1-b, o achado 5 da leitura do Codex);
 *   G2 · cada ponto (`data-grafico-ponto`) tem os quatro atributos (`data-grafico-periodo`, `data-grafico-valor`,
 *        `data-grafico-unidade`, `data-grafico-nome`; o período e o valor não vazios), `role="img"`, um `tabindex`, e
 *        um só ponto de cada gráfico na ordem do tabulador;
 *   G3 · o valor e o período de cada ponto são o texto que o portão de HTML confere: o `[data-ponto]` e o
 *        `[data-ponto-periodo]` dentro do ponto, ou o `title` da marca («nomes valor»); e o `aria-label` diz o mesmo
 *        período e o mesmo valor, e a `data-grafico-leitura` (o texto que o guião põe na etiqueta) é essa mesma cadeia;
 *   G4 · a página que tem um gráfico marcado carrega o guião comum uma vez.
 * É portão: sai com 1 ao primeiro erro de qualquer célula.
 *
 * As plantas (`--plantar <nome>`): troca, em memória, a primeira página da edição portuguesa por uma cópia estragada e
 * corre a régua inteira; a planta morde quando a régua sai com 1 pela célula certa. `sem-marca` tira o `data-grafico`
 * do gráfico da inflação; `aria-label` troca o valor no `aria-label` de um ponto; `sem-guiao` tira o guião da página;
 * `serie-sem-camada` tira a marca e os pontos do gráfico da inflação (a série sem leitura que a primeira forma não via);
 * `decorativo-sem-aria` troca a marca pela decorativa sem `aria-hidden`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';
import { componente, zonasDeLeitura, decorativo, estado, valoresEmFalta } from '../../scripts/graficos-inventario.mjs';
import { getSerie, pontoDaSerie } from '../../src/lib/series.mjs';
import { parsePtNumber } from '../../src/lib/ledger.mjs';
import { valorDoIndice, unidadeDoIndice } from '../../src/lib/formas/serie-do-pais.mjs';
import { nomeDaSerie } from '../../src/lib/formas/palavras-da-serie.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';

const DIST = process.env.OEDP_DIST || join(process.cwd(), 'dist');
const GUIAO = '/js/interacao-dos-graficos.js';

/** Os componentes que desenham sem a camada comum, cada um com a razão (a dívida do G1, no relatório do bloco). */
export const DIVIDA = new Map([
  ['FaixaDosPaises', 'a página dos países tem os seus toques (paises.js), ao rato e ao toque, e a lista dobrada para o teclado'],
  /* A correção G1-c (o achado 8): os três desenhos que o mandato mandava marcar decorativos com os valores escritos ao
     lado; a G5 mediu, com a marca posta, que cada um traça valores que a página não escreve fora dele (o eixo da agenda,
     uma data; a banda dos mandatos, «em funções»; a régua da convergência, os nomes das regiões). Ficam como estavam,
     com o papel de imagem e o nome, até as frases que faltam serem escritas pelo lugar de direção. */
  ['svg.agenda-eixo-svg', 'G1-c: traça uma data de janela que a página não escreve fora do desenho (a G5 com a marca posta)'],
  ['svg.mun-banda-svg', 'G1-c: traça «em funções» sem o escrever fora do desenho (a G5 com a marca posta)'],
  ['svg.rule-svg', 'G1-c: traça os nomes das regiões, que a lista ao lado não escreve na mesma forma (a G5 com a marca posta)'],
]);

function* paginas(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) yield* paginas(p);
    else if (n.endsWith('.html')) yield p;
  }
}

/* Só o espaço comum se junta: o U+00A0 do separador dos milhares é parte do valor e compara-se carácter a carácter. */
const limpa = (t) => String(t ?? '').replace(/[ \t\n\r]+/g, ' ').replace(/^ | $/g, '');
const decode = (t) => String(t ?? '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const attr = (el, n) => (el.hasAttribute(n) ? decode(el.getAttribute(n)) : null);

/** Os desenhos de uma página, pela mesma regra do inventário. */
function desenhos(root) {
  return root.querySelectorAll('svg, [data-faixa-desenho]').filter((el) => {
    if (el.tagName === 'SVG' && el.closest('[data-faixa-desenho]')) return false;
    if (el.tagName === 'SVG' && el.getAttribute('width') === '0') return false;
    if (el.tagName === 'SVG' && el.parentNode?.closest?.('svg')) return false;
    return true;
  });
}

/** Um desenho tem valores escondidos quando é uma série no tempo ou tem zonas de leitura ou marcas de faixa. */
const escondeValores = (el) => (el.getAttribute('class') ?? '').split(/\s+/).includes('serie-do-pais') || zonasDeLeitura(el) > 0 || el.querySelectorAll('[data-faixa-marca]').length > 0;

export function conferePagina(html, rota) {
  const erros = [];
  if (!html.includes('<svg') && !html.includes('data-faixa-desenho') && !html.includes('data-grafico')) return { erros, marcados: 0, pontos: 0, divida: {} };
  const root = parse(html);
  const divida = {};
  for (const el of desenhos(root)) {
    /* A marca decorativa só isenta com `aria-hidden="true"` e sem `data-grafico`; um desenho escondido sem a marca cai
       na regra comum abaixo (a dívida declarada, ou erro). */
    if (el.hasAttribute('data-grafico-decorativo')) {
      if (!decorativo(el) || el.hasAttribute('data-grafico')) erros.push(`G1 ${rota}: um desenho de «${componente(el)}» com a marca decorativa sem aria-hidden, ou com data-grafico.`);
      else {
        /* G5 (a correção G1-c, o achado 4): a marca só vale com cada valor do desenho escrito na mesma página. */
        const falta = valoresEmFalta(el);
        if (falta.length) erros.push(`G5 ${rota}: um desenho decorativo de «${componente(el)}» traça ${falta.map((t) => `«${t}»`).join(', ')}, que a página não escreve fora dele.`);
        else divida.decorativos = (divida.decorativos ?? 0) + 1;
      }
      continue;
    }
    if (el.hasAttribute('data-grafico')) continue;
    const c = componente(el);
    if (DIVIDA.has(c)) { divida[c] = (divida[c] ?? 0) + 1; continue; }
    if (escondeValores(el)) erros.push(`G1 ${rota}: um desenho de «${c}» esconde valores e não tem data-grafico.`);
    /* A correção G1-c (o achado 8): um desenho com algarismos sem camada, sem marca decorativa e sem valores escritos é
       um erro; a categoria dos «algarismos de escala» saiu. */
    else if (estado(el).categoria === 'erro') erros.push(`G1 ${rota}: um desenho de «${c}» tem algarismos sem camada nem marca decorativa confirmada.`);
  }
  const graficos = root.querySelectorAll('[data-grafico]');
  let pontos = 0;
  for (const g of graficos) {
    const ps = g.querySelectorAll('[data-grafico-ponto]');
    if (!ps.length) erros.push(`G2 ${rota}: o gráfico «${g.getAttribute('data-grafico')}» não tem ponto nenhum.`);
    const naOrdem = ps.filter((p) => p.getAttribute('tabindex') === '0').length;
    if (ps.length && naOrdem !== 1) erros.push(`G2 ${rota}: o gráfico «${g.getAttribute('data-grafico')}» tem ${naOrdem} pontos na ordem do tabulador, e não um.`);
    for (const p of ps) {
      pontos++;
      const periodo = attr(p, 'data-grafico-periodo');
      const valor = attr(p, 'data-grafico-valor');
      const unidade = attr(p, 'data-grafico-unidade');
      const nome = attr(p, 'data-grafico-nome');
      if ([periodo, valor, unidade, nome].some((v) => v === null) || !periodo || !valor) {
        erros.push(`G2 ${rota}: um ponto sem os quatro atributos (período «${periodo}», valor «${valor}», unidade «${unidade}», nome «${nome}»).`);
        continue;
      }
      if (p.getAttribute('role') !== 'img' || !p.hasAttribute('tabindex')) erros.push(`G2 ${rota}: o ponto «${periodo} ${valor}» não é focável com role="img".`);
      const vp = p.querySelector('[data-ponto]');
      const lang = rota.startsWith('/en/') ? 'en' : 'pt';
      const indice = attr(p, 'data-grafico-indice');
      const claim = p.querySelector('[data-claim]');
      let esperado = `${nome ? `${nome}, ` : ''}${periodo}: ${valor}${unidade ? `\u00a0${unidade}` : ''}`;
      if (indice !== null) {
        /* G3 do índice (a correção G1-c, o achado 4): o valor indexado não é uma linha do livro, e a régua refá-lo das
           duas linhas do livro (o ponto e a base), com a unidade, o período e o nome da série. */
        const id = attr(p, 'data-grafico-serie'); const chave = attr(p, 'data-grafico-chave');
        let certo = null;
        try {
          const s = getSerie(String(id));
          certo = { valor: valorDoIndice(parsePtNumber(pontoDaSerie(s, chave).valor) / parsePtNumber(pontoDaSerie(s, indice).valor) * 100, lang), periodo: dataDaCasa(String(chave), lang), unidade: unidadeDoIndice(dataDaCasa(indice, lang), lang), nome: nomeDaSerie(String(id), lang) };
        } catch (e) { erros.push(`G3 ${rota}: o ponto do índice ${id}#${chave} não se refaz do livro (${e.message}).`); }
        if (certo && (certo.valor !== valor || certo.periodo !== periodo || certo.unidade !== unidade || certo.nome !== nome)) erros.push(`G3 ${rota}: o ponto do índice ${id}#${chave} diz «${nome}, ${periodo}: ${valor} (${unidade})» e o livro dá «${certo.nome}, ${certo.periodo}: ${certo.valor} (${certo.unidade})».`);
        esperado = `${nome}, ${periodo}: ${valor} (${unidade})`;
      } else if (claim && !vp) {
        /* G3 de um ponto com o valor escrito por um `Claim` (a série municipal, G1-c): o valor é o texto do `Claim`, que o
           portão de HTML confere, e o período o texto marcado `data-grafico-periodo-texto`. */
        const texto = decode(limpa(claim.textContent));
        if (texto !== valor) erros.push(`G3 ${rota}: o ponto diz «${valor}» e o texto do ponto diz «${texto}».`);
        const pp = p.querySelector('[data-grafico-periodo-texto]');
        if (!pp || decode(limpa(pp.textContent)) !== periodo) erros.push(`G3 ${rota}: o ponto diz o período «${periodo}» e o texto diz «${pp ? limpa(pp.textContent) : 'nada'}».`);
      } else if (vp) {
        const texto = decode(limpa(vp.textContent));
        if (texto !== valor) erros.push(`G3 ${rota}: o ponto diz «${valor}» e o texto do ponto diz «${texto}».`);
        const pp = p.querySelector('[data-ponto-periodo]');
        if (!pp || decode(limpa(pp.textContent)) !== periodo) erros.push(`G3 ${rota}: o ponto diz o período «${periodo}» e o texto diz «${pp ? limpa(pp.textContent) : 'nada'}».`);
      } else if (p.hasAttribute('title')) {
        const titulo = attr(p, 'title');
        if (titulo !== `${nome} ${valor}`) erros.push(`G3 ${rota}: a marca diz «${nome} ${valor}» e o title diz «${titulo}».`);
      } else {
        erros.push(`G3 ${rota}: o ponto «${periodo} ${valor}» não tem texto conferido com que se compare.`);
      }
      const aria = attr(p, 'aria-label');
      if (aria !== esperado) erros.push(`G3 ${rota}: o aria-label diz «${aria}» e o ponto diz «${esperado}».`);
      /* A leitura que o guião mostra é a mesma cadeia: a etiqueta e o leitor de ecrã dizem o mesmo, e o check:voz trata o
         `aria-label` como a repetição de um dado do próprio elemento, composto do período e do valor conferidos aqui. */
      if (attr(p, 'data-grafico-leitura') !== esperado) erros.push(`G3 ${rota}: a leitura do guião diz «${attr(p, 'data-grafico-leitura')}» e o ponto diz «${esperado}».`);
    }
  }
  if (graficos.length) {
    const guioes = root.querySelectorAll('script[src]').filter((s) => s.getAttribute('src') === GUIAO).length;
    if (guioes !== 1) erros.push(`G4 ${rota}: a página tem ${graficos.length} gráficos marcados e carrega o guião ${guioes} vezes.`);
  }
  return { erros, marcados: graficos.length, pontos, divida };
}

const PLANTAS = {
  'sem-marca': [(h) => h.replace(/ data-grafico="serie"/, ''), /^G1 /],
  'aria-label': [(h) => h.replace(/(data-grafico-ponto[^>]*?aria-label="[^"]*?)(\d)([^"\d]*")/, (m, a, d, b) => `${a}${(Number(d) + 1) % 10}${b}`), /^G3 .*aria-label/],
  'sem-guiao': [(h) => h.replace(/<script src="\/js\/interacao-dos-graficos\.js"[^>]*><\/script>/, ''), /^G4 /],
  'serie-sem-camada': [(h) => h.replace(/ data-grafico="serie"/, '').replace(/<g data-grafico-ponto[\s\S]*?<\/g>/g, ''), /^G1 .*SerieDoPais/],
  'decorativo-sem-aria': [(h) => h.replace(/ data-grafico="serie"/, ' data-grafico-decorativo'), /^G1 .*decorativa sem aria-hidden/],
  /* As plantas da correção G1-c, cada uma na página que a planta diz. */
  'decorativo-sem-valores': [(h) => h.replace(/ role="group" data-grafico="serie"/, ' aria-hidden="true" data-grafico-decorativo'), /^G5 /],
  'escala-sem-classe': [(h) => h.replace(/(class="mun-serie-svg"[^>]*?) data-grafico="serie"/, '$1'), /^G1 .*sem camada nem marca decorativa/, 'municipios/evora/index.html'],
  'indice-trocado': [(h) => h.replace(/(data-grafico-indice="[^"]*"[^>]*?data-grafico-valor=")(\d)/, (m, a, d) => `${a}${(Number(d) + 1) % 10}`), /^G3 .*ponto do índice/, 'livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html'],
  'claim-trocado': [(h) => h.replace(/(class="mun-serie-svg"[\s\S]*?data-grafico-valor=")(\d)/, (m, a, d) => `${a}${(Number(d) + 1) % 10}`), /^G3 /, 'municipios/evora/index.html'],
};

export function corre(dist = DIST, planta = null) {
  const alvo = join(dist, (planta && PLANTAS[planta][2]) || 'index.html');
  const todos = [];
  let paginasLidas = 0; let marcados = 0; let pontos = 0; const divida = {};
  for (const f of paginas(dist)) {
    let html = readFileSync(f, 'utf8');
    if (planta && f === alvo) {
      const mudado = PLANTAS[planta][0](html);
      if (mudado === html) throw new Error(`a planta «${planta}» não encontrou onde estragar.`);
      html = mudado;
    }
    const rota = '/' + relative(dist, f);
    const r = conferePagina(html, rota);
    paginasLidas++; marcados += r.marcados; pontos += r.pontos;
    for (const [c, n] of Object.entries(r.divida)) divida[c] = (divida[c] ?? 0) + n;
    todos.push(...r.erros);
  }
  return { paginasLidas, marcados, pontos, divida, erros: todos };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const planta = args.includes('--plantar') ? args[args.indexOf('--plantar') + 1] : null;
  if (planta && !PLANTAS[planta]) { console.error(`planta desconhecida: ${planta}`); process.exit(2); }
  const r = corre(DIST, planta);
  console.log(`check:graficos: ${r.paginasLidas} páginas, ${r.marcados} gráficos marcados, ${r.pontos} pontos; na dívida declarada: ${JSON.stringify(r.divida)}.`);
  for (const e of r.erros.slice(0, 20)) console.error(e);
  if (r.erros.length > 20) console.error(`... e mais ${r.erros.length - 20}.`);
  if (planta) {
    const mordeu = r.erros.some((e) => PLANTAS[planta][1].test(e));
    console.log(`planta «${planta}»: ${mordeu ? 'mordeu' : 'NÃO MORDEU'} (${r.erros.length} erros).`);
  }
  process.exit(r.erros.length ? 1 : 0);
}
