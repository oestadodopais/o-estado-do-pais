/** A cabeça de cada página interior do mandato B2, no navegador.
 * A célula é a mesma do captor. A planta devolve o título europeu ao clamp
 * anterior, conserva a marca e exige a mordida nas duas edições.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import { falhasDaCaptura } from '../../design/especime-v3/medicoes/b2-2026-09-23/conferir-captura-b2.mjs';

const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const bloco = 'design/especime-v3/medicoes/b2-2026-09-23';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
const inicio = new Date().toISOString();
const servidor = http.createServer(async (req, res) => {
  try {
    let p = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!p.startsWith(dist + path.sep)) throw Error('Caminho inválido');
    if ((await fs.stat(p)).isDirectory()) p = path.join(p, 'index.html');
    res.setHeader('Content-Type', { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] ?? 'application/octet-stream');
    res.end(await fs.readFile(p));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const limpas = [], estragadas = [], repostas = [];
let navegador;
try {
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of [
    ['temas', 'pt', '/temas/'], ['temas', 'en', '/en/themes/'],
    ['europeia', 'pt', '/uniao-europeia/'], ['europeia', 'en', '/en/european-union/'],
    ['mourao', 'pt', '/municipios/mourao/'], ['mourao', 'en', '/en/municipalities/mourao/'],
  ]) for (const largura of [390, 768, 1024, 1280, 1600]) {
    const pagina = await navegador.newPage({ viewport: { width: largura, height: 900 }, reducedMotion: 'reduce' });
    await pagina.route('**/*', r => new URL(r.request().url()).origin === origem ? r.continue() : r.abort());
    const resposta = await pagina.goto(origem + rota);
    if (resposta?.status() !== 200) throw Error(`${rota}: não abriu`);
    await pagina.evaluate(() => document.fonts.ready);
    const medir = async () => {
      const r = await pagina.evaluate(() => {
        const marca = document.querySelector('.wordmark'), titulo = document.querySelector('h1');
        return { wordmark: { elemento: marca.tagName.toLowerCase(), tamanho: parseFloat(getComputedStyle(marca).fontSize) },
          h1: { quantidade: document.querySelectorAll('h1').length, tamanho: parseFloat(getComputedStyle(titulo).fontSize) } };
      });
      const falhas = falhasDaCaptura({ ...r, familia, lingua, largura, ficheiro: rota, cartoes: [], faixa: [] });
      return { familia, lingua, largura, ...r, falhas };
    };
    const antes = await medir();
    limpas.push(antes);
    if (antes.falhas.length) throw Error(`Base com falhas: ${JSON.stringify(antes)}`);
    if (familia === 'europeia') {
      const folha = await pagina.addStyleTag({ content: 'h1 { font-size: clamp(26px, 3.2vw, 40px) !important; }' });
      const estrago = await medir();
      estragadas.push(estrago);
      if (estrago.wordmark.tamanho !== antes.wordmark.tamanho) throw Error('A planta mudou a marca');
      await folha.evaluate(e => e.remove());
      const depois = await medir();
      repostas.push(depois);
      if (JSON.stringify(antes) !== JSON.stringify(depois)) throw Error('A reposição não devolveu a medida limpa');
    }
    await pagina.close();
  }
  const mordidas = estragadas.filter(r => r.falhas.length);
  const passou = mordidas.length === 4 && mordidas.every(r => [768, 1024].includes(r.largura)) &&
    ['pt', 'en'].every(l => mordidas.filter(r => r.lingua === l).length === 2);
  const registo = { cabeca: versao.commit, inicio, fim: new Date().toISOString(), limpas, estragadas, repostas,
    plantas: [{ nome: 'b2-titulo-europeu-anterior', comando: 'node tests/inicio/hierarquia-b2.mjs', codigo: mordidas.length ? 1 : 0,
      mordida: 'wordmark maior ou igual ao H1 nas duas edições a 768 e 1024', passou, casos: mordidas }] };
  await fs.writeFile(`${bloco}/plantas-titulos-b2.json`, JSON.stringify(registo, null, 2) + '\n');
  console.log(`${limpas.length} cabeças limpas; ${mordidas.length} mordidas; ${repostas.length} reposições: ${passou ? 'PASS' : 'FAIL'}`);
  if (!passou) process.exitCode = 1;
} finally {
  await navegador?.close();
  await new Promise(r => servidor.close(r));
}
