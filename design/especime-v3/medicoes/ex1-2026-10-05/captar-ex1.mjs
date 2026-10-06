/**
 * EX1: as capturas da lista das explicações, da explicação, da leitura da semana e da primeira página, nas cinco larguras
 * e nas duas edições (o ponto 6 do mandato), sobre a construção local, e as medidas que o relatório cita. Não pertence à
 * cadeia do `verify` e não escreve no `dist/`: serve-o por um servidor local efémero, com o Chromium sem cabeça, e recusa
 * tudo o que não venha da origem.
 *
 * AS MEDIDAS, em cada captura: se a página transborda na horizontal e a altura dela. Na primeira página, o bloco «Para
 * perceber» (o ponto 4 do mandato, «medido a 390 px»): se está dentro de «O que se passa» e depois do último bloco, a
 * altura dele, a altura de cada porta como alvo de toque e as linhas que cada porta ocupa. Na explicação, as barras das
 * duas figuras: quantas, a mais curta e a mais longa no ecrã, e se o valor escrito de cada barra fica dentro da figura. Na
 * leitura da semana, quantas mudanças se rendem.
 *
 * AS PLANTAS, no navegador e nunca no ficheiro: uma página mais larga do que o ecrã (o transbordo tem de ser visto), uma
 * porta do bloco com 20 px de altura (o alvo curto tem de ser visto) e o valor de uma barra empurrado para fora da figura
 * (tem de ser visto fora).
 *
 * Uso: node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1.mjs [--json capturas.json]   (na raiz, depois do build)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const AQUI = path.dirname(new URL(import.meta.url).pathname);
const CAP = 'design/especime-v3/capturas/ex1-2026-10-05';
const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const SAIDA = argumento('--json') ?? 'capturas.json';
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
await fs.mkdir(CAP, { recursive: true });
const ROTAS = [
  ['lista', '/explicacoes/', '/en/explainers/'],
  ['explicacao', '/explicacoes/dinheiro-do-estado-2026/', '/en/explainers/dinheiro-do-estado-2026/'],
  ['semana', '/explicacoes/leitura-da-semana/', '/en/explainers/weekly-reading/'],
  ['primeira', '/', '/en/'],
];
const LARGURAS = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ headless: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
const capturas = []; const erros = []; const plantas = [];

async function abre(rota, largura) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const pagina = await ctx.newPage();
  const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
  if (resposta.status() !== 200) throw Error(`página não encontrada: ${rota}`);
  await pagina.evaluate(() => document.fonts.ready);
  return { ctx, pagina };
}

/** As medidas da página, no ecrã. */
const medir = () => {
  const transborda = document.documentElement.scrollWidth > window.innerWidth + 1;
  const altura = document.documentElement.scrollHeight;
  const out = { transborda, largura_do_documento: document.documentElement.scrollWidth, altura };
  const bloco = document.querySelector('[data-para-perceber]');
  if (bloco) {
    const secao = document.querySelector('[data-o-que-se-passa]');
    const blocos = secao ? [...secao.querySelectorAll('[data-bloco]')] : [];
    const ultimo = blocos[blocos.length - 1];
    const depoisDoUltimo = Boolean(ultimo) && Boolean(ultimo.compareDocumentPosition(bloco) & Node.DOCUMENT_POSITION_FOLLOWING);
    const portas = [...bloco.querySelectorAll('li a')].map((a) => {
      const r = a.getBoundingClientRect();
      const linhas = new Set([...a.getClientRects()].map((x) => Math.round(x.top))).size;
      return { porta: a.closest('li').getAttribute('data-para-perceber-porta'), altura_px: +r.height.toFixed(1), largura_px: +r.width.toFixed(1), linhas };
    });
    const r = bloco.getBoundingClientRect();
    out.para_perceber = { dentro_de_o_que_se_passa: Boolean(secao?.contains(bloco)), depois_do_ultimo_bloco: depoisDoUltimo, altura_px: +r.height.toFixed(1), portas, menor_porta_px: Math.min(...portas.map((p) => p.altura_px)) };
  }
  const figuras = [...document.querySelectorAll('figure[data-forma="barras-do-livro"]')].map((f) => {
    const caixa = f.getBoundingClientRect();
    const barras = [...f.querySelectorAll('.exp-barra')].map((b) => b.getBoundingClientRect().width);
    const valores = [...f.querySelectorAll('svg.exp-valor text')].map((t) => t.getBoundingClientRect());
    const valoresFora = valores.filter((v) => v.right > caixa.right + 0.5 || v.left < caixa.left - 0.5).length;
    return { figura: f.getAttribute('data-barras-do-livro'), barras: barras.length, barra_mais_curta_px: +Math.min(...barras).toFixed(1), barra_mais_longa_px: +Math.max(...barras).toFixed(1), valores_fora_da_figura: valoresFora };
  });
  if (figuras.length) out.figuras = figuras;
  const semana = document.querySelector('[data-semana-pagina]');
  if (semana) out.mudancas_rendidas = semana.querySelectorAll('[data-semana-mudanca]').length;
  return out;
};

for (const [nome, pt, en] of ROTAS) {
  for (const [lang, rota] of [['pt', pt], ['en', en]]) {
    for (const largura of LARGURAS) {
      const { ctx, pagina } = await abre(rota, largura);
      const ficheiro = path.join(CAP, `${nome}-${lang}-${largura}.png`);
      const imagem = await pagina.screenshot({ path: ficheiro, fullPage: true });
      const m = await pagina.evaluate(medir);
      capturas.push({ rota, lang, largura, ficheiro, sha256: sha(imagem), ...m });
      if (m.transborda) erros.push(`${rota} a ${largura}: a página transborda (${m.largura_do_documento} px)`);
      for (const f of m.figuras ?? []) if (f.valores_fora_da_figura) erros.push(`${rota} a ${largura}: ${f.valores_fora_da_figura} valor(es) da figura «${f.figura}» fora dela`);
      if (nome === 'primeira') {
        if (!m.para_perceber) erros.push(`${rota} a ${largura}: sem o bloco «Para perceber»`);
        else if (!m.para_perceber.dentro_de_o_que_se_passa || !m.para_perceber.depois_do_ultimo_bloco) erros.push(`${rota} a ${largura}: o bloco «Para perceber» não fecha «O que se passa»`);
        /* O recorte do bloco, para o leitor ver a porta sem a página inteira. */
        const recorte = path.join(CAP, `para-perceber-${lang}-${largura}.png`);
        const img = await pagina.locator('[data-para-perceber]').screenshot({ path: recorte });
        capturas.push({ rota, lang, largura, ficheiro: recorte, sha256: sha(img), recorte: 'o bloco «Para perceber»' });
      }
      await ctx.close();
    }
  }
}

/* AS PLANTAS, no navegador. */
async function planta(nomeDaPlanta, rota, largura, estraga, mordeu) {
  const { ctx, pagina } = await abre(rota, largura);
  await pagina.evaluate(estraga);
  const m = await pagina.evaluate(medir);
  const ok = mordeu(m);
  plantas.push({ nome: nomeDaPlanta, rota, largura, mordeu: ok });
  if (!ok) erros.push(`a planta «${nomeDaPlanta}» não mordeu`);
  await ctx.close();
}
await planta('uma página mais larga do que o ecrã', '/explicacoes/dinheiro-do-estado-2026/', 390, () => { const d = document.createElement('div'); d.style.width = '2000px'; d.style.height = '1px'; document.querySelector('main').append(d); }, (m) => m.transborda === true);
await planta('uma porta do bloco com 20 px de altura', '/', 390, () => { const a = document.querySelector('[data-para-perceber] li a'); a.style.display = 'block'; a.style.height = '20px'; a.style.overflow = 'hidden'; a.style.minHeight = '0'; a.style.padding = '0'; }, (m) => m.para_perceber?.menor_porta_px < 44);
await planta('o valor de uma barra empurrado para fora da figura', '/en/explainers/dinheiro-do-estado-2026/', 390, () => { const t = document.querySelector('figure[data-forma="barras-do-livro"] svg.exp-valor'); t.style.transform = 'translateX(2000px)'; }, (m) => (m.figuras ?? []).some((f) => f.valores_fora_da_figura > 0));

await navegador.close();
servidor.close();
const resumo = { o_que_e: 'EX1: as capturas da lista, da explicação, da leitura da semana e da primeira página, nas cinco larguras e nas duas edições, com as medidas no ecrã e as plantas no navegador.', construcao: versao.commit, construido_em: versao.construido_em, comando: 'node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1.mjs --json capturas.json', capturas, plantas, erros };
await fs.writeFile(path.join(AQUI, SAIDA), JSON.stringify(resumo, null, 2) + '\n');
console.log(`EX1 · ${capturas.length} capturas, ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas, ${erros.length} erro(s)`);
for (const e of erros) console.log(`  · ${e}`);
process.exit(erros.length ? 1 : 0);
