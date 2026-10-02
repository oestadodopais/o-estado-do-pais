/** K2: a folga entre o alvo da dobra e a área de toque do selo que fica por cima dele. Para cada linha «O que é este
 * número» das páginas onde a célula H2 do `check:alvos` a mediu (a ficha de Évora e a página dos lugares) e da página do
 * emprego, nas duas edições e nas larguras da régua dos alvos, põe a linha a meio da janela e pergunta ao navegador
 * quem responde nos oito pontos do quadrado de 44 px centrado nela (os quatro meios das arestas e os quatro cantos, a
 * 21,5 px do centro, como em `tests/acessibilidade/alvos.mjs`). Um ponto que responda outro elemento é uma falha, e o
 * guião diz qual. O conhecido-positivo é a mesma medida com a margem antiga da dobra (2 px) posta por uma folha
 * acrescentada à página: tem de achar falhas, todas num selo.
 * Uso, da raiz da worktree, sobre uma construção acabada:
 *   node design/especime-v3/medicoes/k2-2026-10-02/alvos-da-dobra.mjs <saída.json> */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const saida = process.argv[2];
if (!saida) throw new Error('Uso: alvos-da-dobra.mjs <saída.json>');
const dist = path.resolve('dist');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
const rotas = ['/municipios/evora/', '/en/municipalities/evora/', '/lugares/', '/en/places/', '/emprego/', '/en/employment/'];
const larguras = [390, 641, 768, 1023, 1280];
const MARGEM_ANTIGA = '.cartao-medida-dobra{margin-top:2px !important}';
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let f = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!f.startsWith(dist + path.sep) && f !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(f));
  } catch { resposta.writeHead(404).end(); }
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();

/** Os oito pontos de cada linha da dobra, no navegador. */
const medir = () => [...document.querySelectorAll('summary.cartao-medida-dobra-abrir')].map((el) => {
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  const cx = (r.left + r.right) / 2;
  const cy = (r.top + r.bottom) / 2;
  const m = 21.5;
  const falhas = [];
  for (const [x, y] of [[cx - m, cy], [cx + m, cy], [cx, cy - m], [cx, cy + m], [cx - m, cy - m], [cx + m, cy - m], [cx - m, cy + m], [cx + m, cy + m]]) {
    const q = document.elementFromPoint(x, y);
    if (!(q && (q === el || el.contains(q)))) falhas.push(q ? `${q.tagName.toLowerCase()}.${[...q.classList].join('.')}` : 'nada');
  }
  const dobra = el.parentElement;
  return { cartao: dobra.getAttribute('data-cartao-dobra'), caixa: { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }, margem: getComputedStyle(dobra).marginTop, falhas };
});

const corridas = { construcao: [], margem_antiga: [] };
try {
  for (const [nome, folha] of [['construcao', null], ['margem_antiga', MARGEM_ANTIGA]]) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : rota.abort()));
    const page = await contexto.newPage();
    for (const rota of rotas) {
      await page.goto(origem + rota, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      if (folha) await page.addStyleTag({ content: folha });
      const linhas = await page.evaluate(medir);
      corridas[nome].push({ rota, largura, linhas: linhas.length, com_falha: linhas.filter((l) => l.falhas.length).length, falhas: linhas.filter((l) => l.falhas.length) });
    }
    await contexto.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const soma = (lista, k) => lista.reduce((n, x) => n + x[k], 0);
const resumo = {
  o_que: 'os oito pontos do quadrado de 44 px de cada linha «O que é este número», na construção e com a margem antiga da dobra',
  construcao: { commit: versao.commit, construido_em: versao.construido_em },
  rotas, larguras,
  linhas_medidas: soma(corridas.construcao, 'linhas'),
  linhas_com_falha: soma(corridas.construcao, 'com_falha'),
  conhecido_positivo: {
    o_que: `a mesma medida com a folha «${MARGEM_ANTIGA}» acrescentada à página`,
    linhas_medidas: soma(corridas.margem_antiga, 'linhas'),
    linhas_com_falha: soma(corridas.margem_antiga, 'com_falha'),
    todas_num_selo: corridas.margem_antiga.every((c) => c.falhas.every((l) => l.falhas.every((f) => f.startsWith('a.src-chip')))),
  },
  corridas,
};
await fs.writeFile(saida, JSON.stringify(resumo, null, 2) + '\n');
console.log(`construção: ${resumo.linhas_com_falha} de ${resumo.linhas_medidas} linhas com um ponto de outro elemento · margem antiga: ${resumo.conhecido_positivo.linhas_com_falha} de ${resumo.conhecido_positivo.linhas_medidas} (todas num selo: ${resumo.conhecido_positivo.todas_num_selo})`);
process.exitCode = resumo.linhas_com_falha === 0 && resumo.conhecido_positivo.linhas_com_falha > 0 && resumo.conhecido_positivo.todas_num_selo ? 0 : 1;
