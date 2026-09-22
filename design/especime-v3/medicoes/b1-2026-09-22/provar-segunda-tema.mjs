/** A planta regressa à Base; Astro rende-a e a N3 recusa o HTML servido. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
const pasta = path.dirname(new URL(import.meta.url).pathname);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const resultados = [];
const tokens = 'src/styles/tokens.css', tokensAntes = fs.readFileSync(tokens);
try {
  fs.writeFileSync(tokens, tokensAntes.toString().replace('@media (prefers-color-scheme: dark)', '@media (prefers-color-scheme: light)'));
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', "import { documentoServido } from './src/lib/documentos.mjs'; documentoServido('agua-nao-faturada', 'pt');"], { encoding: 'utf8' });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, 'segunda-paleta-ausente.log'), saida);
  resultados.push({ nome: 'moldura sem paleta escura', codigo: r.status, passou: r.status === 1 && saida.includes('não encontrei a paleta escura do sistema') });
} finally {
  fs.writeFileSync(tokens, tokensAntes);
  resultados.push({ nome: 'reposição da paleta', antes: sha(tokensAntes), depois: sha(fs.readFileSync(tokens)), passou: sha(tokensAntes) === sha(fs.readFileSync(tokens)) });
}
const pastaPlantada = fs.mkdtempSync(path.join(os.tmpdir(), 'b1-n3-'));
for (const rel of ['index.html', 'en/index.html', 'temas/index.html', 'en/themes/index.html']) {
  fs.mkdirSync(path.dirname(path.join(pastaPlantada, rel)), { recursive: true });
  fs.copyFileSync(path.join('dist', rel), path.join(pastaPlantada, rel));
}
const base = 'src/layouts/Base.astro', pagina = path.join(pastaPlantada, 'index.html');
const antes = fs.readFileSync(base), htmlAntes = fs.readFileSync(pagina);
const guiao = "<script is:inline>(function(){try{if(localStorage.getItem('tema')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()</script>";
let dev;
try {
  fs.writeFileSync(base, antes.toString().replace('</head>', guiao + '</head>'));
  dev = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', '45327'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const log = fs.createWriteStream(path.join(pasta, 'segunda-N3-astro.log'));
  dev.stdout.pipe(log); dev.stderr.pipe(log);
  let html;
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch('http://127.0.0.1:45327/'); if (r.ok) { html = await r.text(); break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  if (!html?.includes("localStorage.getItem('tema')")) throw Error('Astro não rendeu a planta da Base.');
  fs.writeFileSync(pagina, html);
  const r = spawnSync(process.execPath, ['scripts/check-pais.mjs'], { encoding: 'utf8', env: { ...process.env, OEDP_DIST: pastaPlantada }, maxBuffer: 128 * 1024 * 1024 });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, 'segunda-N3.log'), saida);
  resultados.push({ nome: 'N3, guião reposto na Base', codigo: r.status, mordidas: saida.split('\n').filter(l => l.startsWith('N3:')), passou: r.status === 1 && saida.includes('N3: guião ou atributo do tema em index.html.') });
} finally {
  dev?.kill('SIGTERM');
  if (dev && dev.exitCode === null) await new Promise(r => dev.once('exit', r));
  fs.writeFileSync(base, antes); fs.writeFileSync(pagina, htmlAntes);
  resultados.push({ nome: 'reposição da Base e do HTML', baseAntes: sha(antes), baseDepois: sha(fs.readFileSync(base)), htmlAntes: sha(htmlAntes), htmlDepois: sha(fs.readFileSync(pagina)), passou: sha(antes) === sha(fs.readFileSync(base)) && sha(htmlAntes) === sha(fs.readFileSync(pagina)) });
  fs.writeFileSync(path.join(pasta, 'plantas-segunda-tema.json'), JSON.stringify(resultados, null, 2) + '\n');
  fs.rmSync(pastaPlantada, { recursive: true });
}

const dist = path.resolve('dist');
const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const servidor = http.createServer((req, res) => {
  try {
    let f = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!f.startsWith(dist + path.sep) && f !== dist) throw Error('Caminho inválido');
    if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(fs.readFileSync(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch({ headless: true });
try {
  for (const rota of ['/', '/en/', '/temas/', '/en/themes/']) {
    const ctx = await nav.newContext({ colorScheme: 'light' });
    await ctx.route('**/*', r => r.request().url().startsWith(origem) ? r.continue() : r.abort());
    await ctx.addInitScript(() => {
      localStorage.setItem('tema', 'dark');
      window.leiturasDoTema = [];
      for (const nome of ['getItem', 'setItem']) {
        const original = Storage.prototype[nome];
        Storage.prototype[nome] = function (chave, ...args) {
          if (chave === 'tema') window.leiturasDoTema.push(nome);
          return original.call(this, chave, ...args);
        };
      }
    });
    const pg = await ctx.newPage();
    await pg.goto(origem + rota, { waitUntil: 'networkidle' });
    for (const esquema of ['light', 'dark', 'light']) {
      await pg.emulateMedia({ colorScheme: esquema });
      const m = await pg.evaluate(() => ({ papel: getComputedStyle(document.body).backgroundColor, atributo: document.documentElement.hasAttribute('data-theme'), armazenamento: window.leiturasDoTema }));
      resultados.push({ nome: 'tema do sistema', rota, esquema, ...m, passou: m.papel === (esquema === 'dark' ? 'rgb(21, 23, 26)' : 'rgb(246, 247, 244)') && !m.atributo && m.armazenamento.length === 0 });
    }
    await ctx.close();
  }
} finally {
  await nav.close(); await new Promise(r => servidor.close(r));
  fs.writeFileSync(path.join(pasta, 'plantas-segunda-tema.json'), JSON.stringify(resultados, null, 2) + '\n');
}
if (resultados.some(r => !r.passou)) throw Error('Falhou uma conferência do tema.');
console.log(`${resultados.length} conferências do tema, todas verdes.`);
