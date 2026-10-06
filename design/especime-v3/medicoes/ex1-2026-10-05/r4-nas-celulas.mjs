#!/usr/bin/env node
/**
 * A FUSÃO COM O MAIN DE 06.10.2026: AS PÁGINAS DO R4 QUE AS CÉLULAS DO EX1 LEEM. As células do EX1 que leem páginas
 * construídas são a FC (`tests/explicacoes/frases-compostas.mjs`: a primeira página, o índice, a lista das explicações,
 * a leitura da semana e a página de cada explicação, nas duas edições, a 390 e a 1280 px), a X (a página de cada
 * explicação), a W (a página da semana e, para as frases citadas e para a porta, a primeira página de cada edição) e as
 * marcas do EX1 no inventário do `check:voz` (as mesmas rotas). Este guião conta, em cada uma dessas páginas da
 * construção da fusão, as peças que o R4 trouxe (a explicação de cada valor de referência por baixo do veredicto, a
 * frase «o que é» dela, a parte do sinal, a frase «o que é» de um recibo, o marcador «por confirmar na fonte» e o último
 * ponto de uma série), e quantas delas caem dentro de uma marca das frases compostas do EX1, que é onde a FC1 e as
 * marcas do inventário as leriam como peças de uma frase da casa.
 *
 * OS CONHECIDOS-POSITIVOS: (1) os seletores acham as peças na primeira página da construção do main (a cabeça do R4 sem o
 * EX1), cujo caminho é o primeiro argumento; (2) uma explicação do R4 posta, em memória, dentro de uma marca do EX1 é
 * contada como dentro.
 *
 * Uso (da raiz do sítio, depois da construção): node design/especime-v3/medicoes/ex1-2026-10-05/r4-nas-celulas.mjs <worktree do main, construída> <saída.json>
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../../../../src/data/explicacoes/index.mjs';
import { routePath } from '../../../../src/lib/routes.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const [mainArg, saidaArg] = process.argv.slice(2);
assert(mainArg && saidaArg, 'uso: r4-nas-celulas.mjs <worktree do main, construída> <saída.json>');
const MAIN = path.resolve(mainArg);
const PECAS_DO_R4 = {
  explicacao_de_um_valor_de_referencia: '[data-veredicto-explica]',
  frase_o_que_e_da_explicacao: '[data-veredicto-o-que-e]',
  parte_do_sinal: '[data-veredicto-sinal]',
  frase_o_que_e_de_um_recibo: '[data-o-que-e]',
  marcador_por_confirmar_na_fonte: '[data-por-confirmar-na-fonte], a.marcador-da-frase',
  ultimo_ponto_de_uma_serie: '[data-serie-ultimo]',
};
const MARCAS_DO_EX1 = '[data-explicacao-declarado], [data-semana-declarado], [data-explicacao-porta], [data-semana-frase]';
const ROTAS = /** @type {const} */ (['pt', 'en']).flatMap((lang) => [
  ['home', routePath('home', lang)], ['indice', routePath('indice', lang)], ['explicacoes', routePath('explicacoes', lang)],
  ['leituraDaSemana', routePath('leituraDaSemana', lang)],
  ...EXPLICACOES.map((e) => ['explicacao', routePath('explicacao', lang, { slug: e.slug })]),
]);
const CELULAS = {
  home: ['FC', 'W', 'voz'], indice: ['FC', 'voz'], explicacoes: ['FC', 'voz'], leituraDaSemana: ['FC', 'W', 'voz'], explicacao: ['FC', 'X', 'voz'],
};
const ficheiroDe = (/** @type {string} */ dist, /** @type {string} */ url) => path.join(dist, url.replace(/^\//, ''), 'index.html');

/** As peças do R4 numa página, e as que caem dentro de uma marca do EX1. @param {any} raiz */
function conta(raiz) {
  /** @type {Record<string, { total: number, dentro_de_uma_marca_do_ex1: number }>} */
  const out = {};
  for (const [nome, seletor] of Object.entries(PECAS_DO_R4)) {
    const pecas = raiz.querySelectorAll(seletor);
    out[nome] = { total: pecas.length, dentro_de_uma_marca_do_ex1: pecas.filter((p) => p.closest(MARCAS_DO_EX1)).length };
  }
  return out;
}

const paginas = [];
for (const [rota, url] of ROTAS) {
  const f = ficheiroDe(path.join(RAIZ, 'dist'), url);
  assert(fs.existsSync(f), `a página ${url} não foi construída`);
  const pecas = conta(parse(fs.readFileSync(f, 'utf8')));
  const total = Object.values(pecas).reduce((s, x) => s + x.total, 0);
  const dentro = Object.values(pecas).reduce((s, x) => s + x.dentro_de_uma_marca_do_ex1, 0);
  paginas.push({ url, rota, celulas: CELULAS[/** @type {keyof typeof CELULAS} */ (rota)], pecas_do_r4: total, dentro_de_uma_marca_do_ex1: dentro, pecas });
}

/* (1) Os seletores acham as peças do R4 na primeira página da construção do main. */
const cabecaMain = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: MAIN, encoding: 'utf8' }).trim();
const naMain = Object.fromEntries(['pt', 'en'].map((lang) => [lang, conta(parse(fs.readFileSync(ficheiroDe(path.join(MAIN, 'dist'), routePath('home', lang)), 'utf8')))]));
const achaNoMain = ['pt', 'en'].every((lang) => naMain[lang].explicacao_de_um_valor_de_referencia.total > 0 && naMain[lang].parte_do_sinal.total > 0);
/* (2) Uma explicação do R4 posta dentro de uma marca do EX1, em memória, conta-se como dentro. */
const casa = parse(fs.readFileSync(ficheiroDe(path.join(RAIZ, 'dist'), routePath('home', 'pt')), 'utf8'));
const item = casa.querySelector(PECAS_DO_R4.explicacao_de_um_valor_de_referencia);
assert(item, 'a planta precisa de uma explicação do R4 na primeira página');
item.setAttribute('data-explicacao-declarado', '');
const plantada = conta(casa).explicacao_de_um_valor_de_referencia.dentro_de_uma_marca_do_ex1;

const dados = {
  o_que_e: 'As peças do R4 nas páginas que as células do EX1 leem, na construção da fusão, e quantas caem dentro de uma marca das frases compostas do EX1.',
  data: new Date().toISOString(),
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  construcao: JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8')).commit,
  main: cabecaMain,
  seletores: PECAS_DO_R4,
  marcas_do_ex1: MARCAS_DO_EX1,
  paginas_lidas: paginas.length,
  paginas_com_pecas_do_r4: paginas.filter((p) => p.pecas_do_r4 > 0).map((p) => p.url),
  pecas_dentro_de_uma_marca_do_ex1: paginas.reduce((s, p) => s + p.dentro_de_uma_marca_do_ex1, 0),
  paginas,
  primeira_pagina_do_main: naMain,
  conhecidos_positivos: [
    { nome: 'Os seletores acham a explicação de cada valor de referência e a parte do sinal na primeira página da construção do main, nas duas edições', mordeu: achaNoMain },
    { nome: 'Uma explicação do R4 posta, em memória, dentro de uma marca do EX1 conta-se como dentro', mordeu: plantada === 1 },
  ],
};
fs.writeFileSync(path.resolve(saidaArg), `${JSON.stringify(dados, null, 2)}\n`);
console.log(JSON.stringify({ paginas_lidas: dados.paginas_lidas, paginas_com_pecas_do_r4: dados.paginas_com_pecas_do_r4, pecas_dentro_de_uma_marca_do_ex1: dados.pecas_dentro_de_uma_marca_do_ex1, conhecidos_positivos: dados.conhecidos_positivos.map((x) => x.mordeu) }));
process.exit(dados.conhecidos_positivos.every((x) => x.mordeu) ? 0 : 1);
