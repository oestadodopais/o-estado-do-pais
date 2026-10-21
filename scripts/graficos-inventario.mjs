#!/usr/bin/env node
/**
 * O INVENTÁRIO DOS GRÁFICOS (bloco G1, 21.10.2026, o §0 do mandato dos gráficos).
 *
 * Percorre o `dist/` construído (ou `OEDP_DIST`) e lista cada gráfico: cada `<svg>` que não seja só geometria
 * declarada (`width="0"`) nem um ícone sem dados, e cada desenho de uma faixa dos países (`[data-faixa-desenho]`),
 * que é feito de marcas e não de um `<svg>`. Para cada um diz o componente que o rende (pela classe ou pela marca
 * que o componente lhe põe), as páginas e as edições onde aparece, e o que tem hoje:
 *   · `rato`: uma leitura ao passar o rato (as zonas de leitura das séries, o `title` das marcas, os toques dos países);
 *   · `toque`: uma leitura ao toque (a camada comum `data-grafico`, ou os toques próprios da página dos países);
 *   · `teclado`: um ponto focável dentro do desenho;
 *   · `escrito`: os valores escritos no próprio desenho, à vista, sem interação nenhuma (um `[data-claim]` ou um
 *     `[data-ponto]` fora de uma zona de leitura), que é o caso em que o desenho não esconde número nenhum.
 * E põe cada desenho numa categoria, pela primeira que lhe sirva:
 *   · `documento`: dentro do corpo de um documento de estudo alojado, que é obra publicada e não um desenho do sítio;
 *   · `decorativo`: com a marca explícita `data-grafico-decorativo` e `aria-hidden="true"`, um desenho cujos valores
 *     estão escritos ao lado na página (a correção G1-b: a única isenção, e nunca adivinhada);
 *   · `valores-escondidos`: uma série no tempo (`svg.serie-do-pais`, que mostra os seus pontos), ou um desenho com zonas
 *     de leitura ou marcas de faixa, cujos valores só se leem ao interagir;
 *   · `escondido`: com `aria-hidden` nele ou num antepassado, um desenho que acompanha valores ditos no texto ao lado;
 *   · `valores-escritos`: com os valores escritos como valores no próprio desenho (`[data-claim]` ou `[data-ponto]` fora
 *     de uma zona de leitura), à vista; um algarismo de eixo (a escala) não conta (a correção G1-b, o achado 5 da
 *     leitura do Codex: a primeira forma contava qualquer `text` com algarismos e escondia as 34 séries sem leitura);
 *   · `com-camada`: com a camada comum (`data-grafico`) e sem valores escondidos fora dela;
 *   · `erro`: com algarismos e sem camada, sem marca decorativa confirmada e sem valores escritos (a correção G1-c, o
 *     achado 8: a categoria `algarismos-de-escala` saiu; um desenho assim é um erro da régua), ou com a marca
 *     decorativa e um valor desenhado que a página não escreve fora dele;
 *   · `sem-algarismos`: o resto (um mapa pintado com a legenda fora, o sinal do país).
 * Duas contagens de «sem toque»: a estrita (todo o desenho sem leitura ao toque, como o mandato a pede) e a que o
 * leitor sente (`semToqueComValoresEscondidos`: um desenho que esconde valores e não os mostra ao toque, a I230).
 *
 * Escreve um JSON curto (`--json <ficheiro>`, por omissão na saída): as contagens por componente e a lista dos
 * gráficos sem toque, uma linha por componente e página-exemplo. Não é portão: é a medida do bloco.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = process.env.OEDP_DIST || join(process.cwd(), 'dist');
const args = process.argv.slice(2);
const saida = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

function* paginas(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) yield* paginas(p);
    else if (n.endsWith('.html')) yield p;
  }
}

/** O componente que rende um desenho, pela marca que o componente lhe põe. */
export function componente(el) {
  const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean);
  if (el.hasAttribute('data-faixa-desenho')) return el.hasAttribute('data-toques') ? 'FaixaDosPaises' : 'FaixaDaUniao';
  if (cls.includes('serie-do-pais')) {
    const onde = el.closest?.('[data-cartao-serie]') ? 'cartão' : 'página';
    if (decorativo(el)) return `SerieDoPais (${onde}, decorativo)`;
    return zonasDeLeitura(el) ? `SerieDoPais (${onde}, com leitura)` : `SerieDoPais (${onde}, sem leitura)`;
  }
  const forma = el.getAttribute('data-forma');
  if (forma) return `data-forma=${forma}`;
  if (cls.length) return `svg.${cls[0]}`;
  let p = el.parentNode;
  for (let i = 0; p && i < 4; i++, p = p.parentNode) {
    const c = (p.getAttribute?.('class') ?? '').split(/\s+/).filter(Boolean)[0];
    if (c) return `svg em .${c}`;
  }
  return 'svg sem classe';
}

const normaliza = (t) => String(t ?? '').replace(/[\s\u00a0\u202f\u2009]+/g, ' ').trim();
const raiz = (el) => { let r = el; while (r.parentNode) r = r.parentNode; return r; };
const escapa = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function textosDe(no, dentroDaEscala, saida) {
  for (const c of no.childNodes) {
    if (c.nodeType === 3) { const t = normaliza(c.text); if (t && !dentroDaEscala) saida.push(t); continue; }
    if (!c.rawTagName || ['title', 'desc'].includes(c.rawTagName)) continue;
    textosDe(c, dentroDaEscala || c.getAttribute('data-nonledger') === 'escala-de-instrumento', saida);
  }
  return saida;
}
/**
 * A correção G1-c (o achado 4): os valores que um desenho decorativo traça e a página não escreve fora dele. Cada texto
 * do desenho (fora da escala, `data-nonledger="escala-de-instrumento"`, e fora do título) tem de estar escrito no texto
 * da página fora do desenho, com os algarismos inteiros (nenhum algarismo antes nem depois); e cada `[data-claim]` do
 * desenho tem de estar escrito fora dele, com o mesmo id e o mesmo texto. Uma lista vazia confirma a marca.
 * @returns {string[]}
 */
export function valoresEmFalta(el) {
  const r = raiz(el);
  let fora = r.textContent;
  for (const s of r.querySelectorAll('script, style')) fora = fora.replace(s.textContent, ' ');
  fora = normaliza(fora.replace(el.textContent, ' '));
  const falta = [];
  for (const t of new Set(textosDe(el, el.getAttribute('data-nonledger') === 'escala-de-instrumento', []))) {
    if (!new RegExp(`(?<!\\d)${escapa(t)}(?!\\d)`).test(fora)) falta.push(t);
  }
  for (const c of el.querySelectorAll('[data-claim]')) {
    const id = c.getAttribute('data-claim');
    const pares = r.querySelectorAll(`[data-claim="${id}"]`).filter((o) => !el.querySelectorAll('[data-claim]').includes(o));
    if (!pares.some((o) => normaliza(o.text) === normaliza(c.text))) falta.push(`${id} (${normaliza(c.text)})`);
  }
  return falta;
}

/** A marca decorativa explícita: as duas marcas juntas, nunca uma só. */
export const decorativo = (el) => el.hasAttribute('data-grafico-decorativo') && el.getAttribute('aria-hidden') === 'true';

export const zonasDeLeitura = (el) => el.querySelectorAll('g:not([data-eixo])').filter((g) => g.querySelector('rect') && g.querySelector('[data-ponto]')).length;

export function estado(el) {
  const marcado = el.hasAttribute('data-grafico') || Boolean(el.closest?.('[data-grafico]'));
  /* Uma zona de leitura é um grupo com a sua zona (`rect`) e o valor de um ponto (`[data-ponto]`) escondido até à leitura. */
  const zonas = zonasDeLeitura(el);
  const titulos = el.querySelectorAll('[title], title').length;
  const toquesProprios = el.hasAttribute('data-toques');
  const focaveis = el.querySelectorAll('[tabindex]').filter((n) => n.getAttribute('tabindex') !== '-1' || n.hasAttribute('data-grafico-ponto')).length;
  const escritos = el.querySelectorAll('[data-claim], [data-ponto]').filter((n) => !n.closest('g:not([data-eixo])') || n.closest('g[data-eixo]')).length;
  const serie = (el.getAttribute('class') ?? '').split(/\s+/).includes('serie-do-pais');
  const escondidos = decorativo(el) ? 0 : zonas + el.querySelectorAll('[data-faixa-marca]').length + (serie && !zonas ? 1 : 0);
  const algarismos = el.querySelectorAll('text, tspan').some((n) => /\d/.test(n.textContent));
  const categoria = decorativo(el) ? (valoresEmFalta(el).length ? 'erro' : 'decorativo-confirmado')
    : escondidos > 0 ? 'valores-escondidos'
    : el.hasAttribute('data-grafico') ? 'com-camada'
    : el.getAttribute('aria-hidden') === 'true' || el.closest?.('[aria-hidden="true"]') ? 'escondido'
    : escritos > 0 ? 'valores-escritos'
    : algarismos ? 'erro' : 'sem-algarismos';
  return {
    categoria,
    rato: marcado || zonas > 0 || titulos > 1 || toquesProprios,
    toque: marcado || toquesProprios,
    teclado: focaveis > 0,
    escrito: escritos > 0 && escondidos === 0,
    escondidos,
  };
}

export function inventario(dist = DIST) {
  const porComponente = {};
  const semToque = {};
  let paginasComGraficos = 0;
  let semToqueComValoresEscondidos = 0;
  const porCategoria = {};
  for (const f of paginas(dist)) {
    const html = readFileSync(f, 'utf8');
    if (!html.includes('<svg') && !html.includes('data-faixa-desenho')) continue;
    const root = parse(html);
    const desenhos = root.querySelectorAll('svg, [data-faixa-desenho]').filter((el) => {
      if (el.tagName === 'SVG' && el.closest('[data-faixa-desenho]')) return false;
      if (el.tagName === 'SVG' && el.getAttribute('width') === '0') return false;
      if (el.tagName === 'SVG' && el.parentNode?.closest?.('svg')) return false;
      return true;
    });
    if (!desenhos.length) continue;
    paginasComGraficos++;
    const rota = '/' + relative(dist, f).replace(/index\.html$/, '').replace(/\.html$/, '');
    const edicao = rota.startsWith('/en/') ? 'en' : 'pt';
    for (const el of desenhos) {
      const c = componente(el);
      const e = estado(el);
      if (/\/(documento|document)\/$/.test(rota)) e.categoria = 'documento';
      porCategoria[e.categoria] = (porCategoria[e.categoria] ?? 0) + 1;
      const k = (porComponente[c] ??= { categorias: {}, graficos: 0, paginas: new Set(), edicoes: new Set(), rato: 0, toque: 0, teclado: 0, escrito: 0, semToque: 0 });
      k.categorias[e.categoria] = (k.categorias[e.categoria] ?? 0) + 1;
      if (e.categoria === 'valores-escondidos' && !e.toque) semToqueComValoresEscondidos++;
      k.graficos++; k.paginas.add(rota); k.edicoes.add(edicao);
      for (const x of ['rato', 'toque', 'teclado', 'escrito']) if (e[x]) k[x]++;
      if (!e.toque && e.categoria !== 'valores-escritos') {
        k.semToque++;
        (semToque[c] ??= { graficos: 0, exemplo: rota }).graficos++;
      }
    }
  }
  const componentes = Object.fromEntries(Object.entries(porComponente).sort((a, b) => b[1].graficos - a[1].graficos).map(([c, k]) => [c, { ...k, paginas: k.paginas.size, edicoes: [...k.edicoes].sort() }]));
  const total = Object.values(componentes).reduce((s, k) => s + k.graficos, 0);
  const totalSemToque = Object.values(componentes).reduce((s, k) => s + k.semToque, 0);
  return { dist: relative(process.cwd(), dist) || '.', paginasComGraficos, graficos: total, semToque: totalSemToque, semToqueComValoresEscondidos, porCategoria, componentes, semToquePorComponente: semToque };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = inventario();
  const texto = JSON.stringify(r, null, 1) + '\n';
  if (saida) writeFileSync(saida, texto); else process.stdout.write(texto);
}
