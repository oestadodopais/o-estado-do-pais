/** UE1c: as capturas dos recibos das séries que a passagem mudou, nas duas edições e nas cinco larguras.
 *
 * Adaptado de `captar-ue1b.mjs`. A passagem muda a cabeça do recibo de cada série cuja leitura do cartão
 * abre com o que a medida conta (a frase por baixo do título); nenhum cartão muda à vista (os extremos
 * empatados não se rendem hoje, e a comparação com a União do cartão da sobrecarga no total ficou por
 * fazer, com a razão no relatório). Captura a cabeça (`.serie-cabeca`) desses recibos e mede, nos vinte
 * recibos, se a frase está, e, nos capturados, se a página ou a frase transbordam.
 *
 * O CONHECIDO-POSITIVO corre antes, na largura mais estreita de cada edição: um elemento mais largo do que
 * a janela, e uma frase alargada para lá da sua caixa, têm de ser vistos pelo mesmo detetor.
 *
 * Uso: node design/especime-v3/medicoes/ue1-2026-09-29/captar-ue1c.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.resolve('dist');
const pastaRelativa = 'design/especime-v3/medicoes/ue1-2026-09-29';
const saidaRelativa = 'design/especime-v3/capturas/ue1-2026-09-29/ue1c';
const saida = path.join(raiz, saidaRelativa);
const esperado = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const series = (await fs.readdir(path.join(dist, 'livro-razao', 'series'))).filter((x) => !x.startsWith('.')).sort();
const edicoes = { pt: '/livro-razao/series/', en: '/en/ledger/series/' };
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch { resposta.writeHead(404).end(); }
});
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;

const MEDIR = () => {
  const f = document.querySelector('[data-serie-o-que-conta]');
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    frase: f ? f.textContent.replace(/\s+/g, ' ').trim() : null,
    frase_transborda: f ? f.scrollWidth > f.clientWidth + 0.5 : null,
  };
};

const navegador = await chromium.launch();
const resultados = [];
const presencas = [];
const plantas = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      const carrega = async (url) => { await pagina.goto(`${origem}${url}`, { waitUntil: 'networkidle' }); await pagina.evaluate(() => document.fonts.ready); };
      if (largura === larguras[0]) {
        await carrega(`${edicoes[lang]}risco-de-pobreza-ou-exclusao-2025-paises/`);
        await pagina.evaluate(() => { const d = document.createElement('div'); Object.assign(d.style, { width: `${innerWidth + 200}px`, height: '1px' }); document.body.appendChild(d); });
        const m1 = await pagina.evaluate(MEDIR);
        plantas.push({ lang, largura, nome: 'um elemento mais largo do que a janela', visto: m1.documento > m1.janela + 0.5 });
        await carrega(`${edicoes[lang]}risco-de-pobreza-ou-exclusao-2025-paises/`);
        await pagina.evaluate(() => { const f = document.querySelector('[data-serie-o-que-conta]'); f.style.transition = 'none'; f.style.whiteSpace = 'nowrap'; f.style.overflow = 'hidden'; });
        const m2 = await pagina.evaluate(MEDIR);
        plantas.push({ lang, largura, nome: 'a frase alargada para lá da sua caixa', visto: m2.frase_transborda === true });
      }
      for (const id of series) {
        await carrega(`${edicoes[lang]}${id}/`);
        const m = await pagina.evaluate(MEDIR);
        if (largura === larguras[0]) presencas.push({ lang, serie: id, com_frase: m.frase !== null });
        if (m.frase === null) continue;
        const alvo = pagina.locator('.serie-cabeca');
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${id}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), serie: id, lang, largura, medidas: m });
      }
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const problemas = resultados.flatMap((r) => {
  const p = [];
  if (r.medidas.documento > r.medidas.janela + 0.5) p.push('a página transborda na horizontal');
  if (r.medidas.frase_transborda) p.push('a frase do que a medida conta transborda');
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  bloco: 'UE1c', construcao: versao, cabeca_esperada: esperado, larguras,
  recibos_lidos_por_edicao: series.length,
  recibos_com_frase: presencas.filter((p) => p.com_frase).length,
  recibos_sem_frase: presencas.filter((p) => !p.com_frase).map((p) => `${p.lang}:${p.serie}`),
  capturas: resultados.length,
  plantas, plantas_vistas: plantas.filter((p) => p.visto).length,
  pedidos_recusados_para_fora: recusados.length, problemas, resultados, presencas,
};
await fs.writeFile(path.join(raiz, pastaRelativa, 'capturas-ue1c.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1c capturas: ${resultados.length} imagens, ${manifesto.recibos_com_frase} recibos com a frase, ${problemas.length} problema(s), plantas vistas ${manifesto.plantas_vistas} de ${plantas.length}, ${recusados.length} pedido(s) para fora`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length || manifesto.plantas_vistas !== plantas.length ? 1 : 0);
