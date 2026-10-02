/** P4 (02.10.2026): o nome que o leitor de ecrã diz dos dois botões do tema, com o «·» no grupo (a folha de hoje) e,
 * só nesta medição, com o «·» de volta dentro do segundo botão, como estava antes do P4 (`.tema-b + .tema-b::before`).
 * Lê a árvore de acessibilidade do Chromium (`ariaSnapshot`) na primeira página portuguesa, a 1 280 px, com o comando à
 * vista. Corre sobre `dist/`.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/p4-2026-10-02/nome-do-botao.mjs
 * Sai 0 depois de medir; 1 se não conseguir. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const DIST = path.resolve('dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': tipos[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const nav = await chromium.launch();
const ANTES = `.tema::before{content:none!important}.tema-b+.tema-b{order:0!important}.tema-b+.tema-b::before{content:'·';color:var(--rule-strong);margin-right:7px;margin-left:-7px}`;
for (const [nome, css] of [['hoje (o «·» no grupo)', null], ['antes do P4 (o «·» dentro do segundo botão)', ANTES]]) {
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  if (css) await p.addStyleTag({ content: css });
  const arvore = await p.locator('header [data-tema-controlo]').ariaSnapshot();
  console.log(`${nome}:\n${arvore.split('\n').map((l) => '  ' + l).join('\n')}`);
  await ctx.close();
}
await nav.close();
srv.close();
