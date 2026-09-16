#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A RÉGUA DAS TABELAS LARGAS · bloco E1, item 4 do brief
 * ---------------------------------------------------------------------------
 * O item 4 manda conferir, nas cinco larguras e nas duas edições, que as tabelas
 * largas deste estudo (a das promessas, com cinco colunas de citações; a das
 * fontes, com endereços) ficam DENTRO do seu contentor, com deslocação
 * horizontal própria, e que a PÁGINA não desloca de lado.
 *
 * Mede-se em píxeis do motor e não em caixas do código: a pergunta é o que o
 * leitor vê, e uma folha de estilos que promete `overflow-x: auto` não prova
 * que a caixa coube.
 *
 * As três medidas, por largura e por edição:
 *
 *   pagina_desloca      `documentElement.scrollWidth` maior do que o
 *                       `clientWidth`. Tem de ser falso: nenhuma página deste
 *                       sítio rola de lado.
 *   fora_do_contentor   quantas `.texto-tabela` têm a borda direita além da
 *                       borda direita do seu pai. Tem de ser zero.
 *   com_deslocacao      quantas `.texto-tabela` têm conteúdo mais largo do que
 *                       a sua própria caixa, que é a deslocação própria a
 *                       funcionar. É informação, não veredicto: numa largura
 *                       grande as tabelas cabem e o número desce.
 *
 *   node design/especime-v3/medicoes/e1-2026-09-16/medir-tabelas.mjs
 *
 * Devolve 1 se alguma das duas primeiras falhar em alguma largura.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST
  ? path.resolve(RAIZ, process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');

const SLUG = 'evora-2027-prometido-painel-dinheiro';
const ROTAS = { pt: `/estudos/${SLUG}/texto`, en: `/en/studies/${SLUG}/text` };
const LARGURAS = [390, 768, 1024, 1280, 1600];
const ALTURA = 664;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const servidor = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, u);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const nav = await chromium.launch({ headless: true });
let vermelhos = 0;
console.log('');
console.log('  edição  largura  tabelas  fora do contentor  com deslocação  a página desloca');
for (const [edicao, rota] of Object.entries(ROTAS)) {
  for (const largura of LARGURAS) {
    const ctx = await nav.newContext({ viewport: { width: largura, height: ALTURA } });
    const p = await ctx.newPage();
    const r = await p.goto(base + rota, { waitUntil: 'networkidle' });
    if (!r || r.status() !== 200) {
      console.error(`  ${edicao} ${largura}: ${r?.status() ?? 'sem resposta'} em ${rota}`);
      vermelhos += 1;
      await ctx.close();
      continue;
    }
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const raiz = document.documentElement;
      const caixas = [...document.querySelectorAll('.texto-tabela')];
      let fora = 0;
      let desloca = 0;
      for (const c of caixas) {
        const pai = c.parentElement;
        const a = c.getBoundingClientRect();
        const b = pai.getBoundingClientRect();
        /* Meio pixel de folga: o motor arredonda as bordas de uma caixa com
           margem percentual, e um veredicto que reprovasse 0,2px reprovava o
           arredondamento e não a disposição. */
        if (a.right > b.right + 0.5 || a.left < b.left - 0.5) fora += 1;
        if (c.scrollWidth > c.clientWidth) desloca += 1;
      }
      return {
        tabelas: caixas.length,
        fora,
        desloca,
        paginaDesloca: raiz.scrollWidth > raiz.clientWidth,
      };
    });
    const mau = m.fora > 0 || m.paginaDesloca;
    if (mau) vermelhos += 1;
    console.log(
      `  ${edicao.padEnd(6)}  ${String(largura).padStart(7)}  ${String(m.tabelas).padStart(7)}  ` +
        `${String(m.fora).padStart(17)}  ${String(m.desloca).padStart(14)}  ` +
        `${(m.paginaDesloca ? 'SIM' : 'não').padStart(16)}${mau ? '   <<< VERMELHO' : ''}`,
    );
    await ctx.close();
  }
}
await nav.close();
servidor.close();
console.log('');
if (vermelhos) {
  console.error(`  ${vermelhos} largura(s) vermelha(s).`);
  process.exit(1);
}
console.log('  cada tabela larga fica dentro do seu contentor, e nenhuma página desloca de lado.');
console.log('');
