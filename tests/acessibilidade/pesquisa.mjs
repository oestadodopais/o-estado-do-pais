#!/usr/bin/env node
/**
 * =============================================================================
 * A BUSCA DOS LUGARES, ESCRITA E NÃO OLHADA · bloco R1, 23.09.2026 (I137)
 * =============================================================================
 *
 * A leitura de fora de 23.09.2026 escreveu «mour» no campo da página dos lugares
 * e não apareceu nada: o guião tirava o `hidden` aos itens que casavam e nunca à
 * lista, que nasce escondida. Duas leituras a frio e uma leitura de editor sobre
 * capturas não o viram, porque nenhuma escreveu no campo. A lição ficou escrita
 * na §1.124: o que é interativo prova-se a interagir.
 *
 * Por isso isto ESCREVE. Abre a página dos lugares de uma edição num Chromium sem
 * cabeça e faz o que um leitor faz, medindo o que ele vê (`isVisible()`, que é a
 * caixa desenhada e não o atributo):
 *
 *   1. com o campo vazio, nenhum resultado à vista;
 *   2. escreve «mour» (o conhecido-positivo da M18: dois concelhos casam, Moura e
 *      Mourão) e exige uma ligação VISÍVEL para a página de Mourão, no máximo
 *      oito resultados à vista, todos a casar com o que se escreveu;
 *   3. o `Enter` com dois resultados não sai da página e não apaga o campo;
 *   4. escreve «xyzq», que não casa com nada: nenhum resultado à vista, a frase
 *      de que nada casou à vista, e o `Enter` não sai da página;
 *   5. escreve «mourao», que casa com um só, e o `Enter` abre a página de Mourão.
 *
 * É O MESMO GUIÃO PARA O ANTES E PARA O DEPOIS. A célula H15 de
 * `tests/acessibilidade/alvos.mjs` chama `medePesquisa()` sobre a construção que
 * está a medir, e este ficheiro corre sozinho sobre qualquer construção:
 *
 *   OEDP_DIST=<dist> node tests/acessibilidade/pesquisa.mjs [--json <ficheiro>]
 *
 * sai com 0 quando as duas edições cumprem os cinco passos, e com 1 quando não.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { routePath, LANGS } from '../../src/lib/routes.mjs';

/** O que se escreve, e porquê cada um: o conhecido-positivo, o vazio e o único. */
export const ESCRITAS = { conhecido: 'mour', nenhum: 'xyzq', unico: 'mourao' };
/** O concelho que a escrita conhecida tem de mostrar, e que a única tem de abrir. */
export const ALVO = 'mourao';

const semBarra = (s) => String(s ?? '').replace(/\/+$/, '');

/**
 * Os cinco passos numa edição, sobre uma página já aberta num contexto novo.
 *
 * @param {import('playwright').Browser} nav
 * @param {string} base  a origem do servidor local (`http://127.0.0.1:<porta>`)
 * @param {'pt'|'en'} lang
 * @param {number} largura
 */
export async function medePesquisa(nav, base, lang, largura = 390) {
  const rota = routePath('lugares', lang);
  const destino = semBarra(routePath('municipio', lang, { slug: ALVO }));
  const contexto = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const pagina = await contexto.newPage();
  const espera = (ms) => pagina.evaluate((t) => new Promise((r) => setTimeout(r, t)), ms);
  /** As ligações de resultado que o leitor vê agora, com o destino e a chave de cada uma. */
  const vistos = async () => {
    const out = [];
    for (const a of await pagina.locator('.pesquisa-res .pesquisa-item a[href]').all()) {
      if (!(await a.isVisible())) continue;
      out.push({
        href: semBarra(await a.getAttribute('href')),
        normal: await a.evaluate((el) => el.closest('[data-normal]')?.getAttribute('data-normal') ?? ''),
      });
    }
    return out;
  };
  const r = { lang, largura, rota };
  try {
    await pagina.goto(base + rota, { waitUntil: 'networkidle' });
    await espera(80);
    const campo = pagina.locator('[data-pesquisa]');
    r.campo = await campo.count();

    // 1 · o campo vazio
    r.vazioVisiveis = (await vistos()).length;

    // 2 · o conhecido-positivo
    await campo.fill(ESCRITAS.conhecido);
    await espera(120);
    const conhecidos = await vistos();
    r.conhecidoVisiveis = conhecidos.length;
    r.mouraoVisivel = conhecidos.some((v) => v.href === destino);
    r.conhecidoTodosCasam = conhecidos.every((v) => v.normal.includes(ESCRITAS.conhecido));

    // 3 · o Enter com mais do que um
    const antes = pagina.url();
    await campo.press('Enter');
    await espera(400);
    r.enterComVariosFica = pagina.url() === antes && (await campo.inputValue()) === ESCRITAS.conhecido;

    // 4 · nada casa
    await campo.fill(ESCRITAS.nenhum);
    await espera(120);
    r.nenhumVisiveis = (await vistos()).length;
    r.fraseDoNadaVisivel = await pagina.locator('[data-sem-resultado]').isVisible();
    await campo.press('Enter');
    await espera(400);
    r.enterComNenhumFica = pagina.url() === antes && (await campo.inputValue()) === ESCRITAS.nenhum;

    // 5 · um só, e o Enter abre-o
    await campo.fill(ESCRITAS.unico);
    await espera(120);
    r.unicoVisiveis = (await vistos()).length;
    await Promise.all([
      pagina.waitForURL((u) => semBarra(new URL(u).pathname) === destino, { timeout: 4000 }).catch(() => null),
      campo.press('Enter'),
    ]);
    r.enterComUmAbre = semBarra(new URL(pagina.url()).pathname) === destino;
  } finally {
    await contexto.close();
  }
  r.passa =
    r.campo === 1 &&
    r.vazioVisiveis === 0 &&
    r.mouraoVisivel &&
    r.conhecidoVisiveis >= 1 &&
    r.conhecidoVisiveis <= 8 &&
    r.conhecidoTodosCasam &&
    r.enterComVariosFica &&
    r.nenhumVisiveis === 0 &&
    r.fraseDoNadaVisivel &&
    r.enterComNenhumFica &&
    r.unicoVisiveis === 1 &&
    r.enterComUmAbre;
  return r;
}

/** Uma linha que diz o que se mediu, para a prova de uma célula. */
export function resumoDaPesquisa(r) {
  return (
    `${r.lang}@${r.largura}: vazio ${r.vazioVisiveis} · «${ESCRITAS.conhecido}» ${r.conhecidoVisiveis} à vista, ` +
    `Mourão ${r.mouraoVisivel ? 'à vista' : 'NÃO'} · Enter com vários ${r.enterComVariosFica ? 'fica' : 'SAI'} · ` +
    `«${ESCRITAS.nenhum}» ${r.nenhumVisiveis} à vista, frase ${r.fraseDoNadaVisivel ? 'à vista' : 'NÃO'}, Enter ` +
    `${r.enterComNenhumFica ? 'fica' : 'SAI'} · «${ESCRITAS.unico}» ${r.unicoVisiveis} à vista, Enter ` +
    `${r.enterComUmAbre ? 'abre Mourão' : 'NÃO abre'}`
  );
}

/* ----------------------------------------------------------- sozinho */

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
  if (!fs.existsSync(DIST)) {
    console.error(`não existe ${DIST}. Corra o build primeiro.`);
    process.exit(2);
  }
  const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const servidor = http.createServer((req, res) => {
    const semQuery = req.url.split('?')[0];
    let f;
    try { f = path.resolve(DIST, '.' + decodeURIComponent(semQuery)); } catch { f = path.resolve(DIST, '.' + semQuery); }
    if (!f.startsWith(DIST)) return void res.writeHead(403).end();
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const nav = await chromium.launch({ headless: true });
  const medidas = [];
  try {
    for (const lang of LANGS) for (const largura of [390, 1280]) medidas.push(await medePesquisa(nav, base, lang, largura));
  } finally {
    await nav.close();
    servidor.close();
  }
  let versao = null;
  try { versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8')).commit; } catch { versao = null; }
  for (const m of medidas) console.log(`${m.passa ? '✓' : '✗'} ${resumoDaPesquisa(m)}`);
  const i = process.argv.indexOf('--json');
  if (i !== -1) fs.writeFileSync(process.argv[i + 1], JSON.stringify({ dist_construido_de: versao, medidas }, null, 2) + '\n');
  process.exit(medidas.every((m) => m.passa) ? 0 : 1);
}
