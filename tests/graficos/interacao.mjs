#!/usr/bin/env node
/**
 * check:graficos, a régua da interação dos gráficos (bloco G1, 21.10.2026, o §2 do mandato dos gráficos; a I230).
 *
 * Sobre o `dist/` construído (ou `OEDP_DIST`), em cada página das duas edições:
 *   G1 · cada desenho com valores escondidos (uma série no tempo com zonas de leitura, a faixa dos países de um
 *        cartão) tem `data-grafico`; um desenho de um componente que não está na dívida declarada abaixo e não tem a
 *        marca é um erro, com o caminho da página e o componente;
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
 * do gráfico da inflação; `aria-label` troca o valor no `aria-label` de um ponto; `sem-guiao` tira o guião da página.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';
import { componente, zonasDeLeitura } from '../../scripts/graficos-inventario.mjs';

const DIST = process.env.OEDP_DIST || join(process.cwd(), 'dist');
const GUIAO = '/js/interacao-dos-graficos.js';

/** Os componentes que desenham sem a camada comum, cada um com a razão (a dívida do G1, no relatório do bloco). */
export const DIVIDA = new Map([
  ['FaixaDosPaises', 'a página dos países tem os seus toques (paises.js), ao rato e ao toque, e a lista dobrada para o teclado'],
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

/** Um desenho tem valores escondidos quando tem zonas de leitura ou marcas de faixa. */
const escondeValores = (el) => zonasDeLeitura(el) > 0 || el.querySelectorAll('[data-faixa-marca]').length > 0;

export function conferePagina(html, rota) {
  const erros = [];
  if (!html.includes('<svg') && !html.includes('data-faixa-desenho') && !html.includes('data-grafico')) return { erros, marcados: 0, pontos: 0, divida: {} };
  const root = parse(html);
  const divida = {};
  for (const el of desenhos(root)) {
    if (el.hasAttribute('data-grafico')) continue;
    const c = componente(el);
    if (DIVIDA.has(c)) { divida[c] = (divida[c] ?? 0) + 1; continue; }
    if (escondeValores(el)) erros.push(`G1 ${rota}: um desenho de «${c}» esconde valores e não tem data-grafico.`);
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
      if (vp) {
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
      const esperado = `${nome ? `${nome}, ` : ''}${periodo}: ${valor}${unidade ? `\u00a0${unidade}` : ''}`;
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
};

export function corre(dist = DIST, planta = null) {
  const alvo = join(dist, 'index.html');
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
