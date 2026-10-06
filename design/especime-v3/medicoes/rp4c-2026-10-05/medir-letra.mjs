/**
 * RP4-c: a letra dos eixos do desenho das séries, medida no Chromium sem cabeça sobre um `dist/` construído. Não
 * pertence à cadeia do `verify` e não escreve no `dist/`: serve-o por um servidor local efémero e recusa tudo o que
 * não venha da origem local.
 *
 * Mede, em cada desenho `serie-do-pais` das páginas que o bloco toca (a primeira página, a página dos preços e o
 * recibo da inflação, nas duas edições), a largura de cada etiqueta do eixo do tempo e do eixo dos valores em
 * unidades do desenho (`getComputedTextLength()`, que não depende da largura do ecrã), as caixas das etiquetas do
 * tempo e o espaço entre cada duas vizinhas (`getBBox()`), e se a letra da casa estava carregada quando mediu. É daqui
 * que sai a largura de um ano escrito que a regra das décadas usa (`LARGURA_DE_UM_ANO`, no módulo do desenho): a maior
 * largura medida de uma etiqueta de quatro algarismos.
 *
 * O conhecido-positivo: a mesma leitura mede uma etiqueta com oito algarismos posta no desenho em memória (no
 * navegador, nunca no ficheiro), que tem de medir mais do que a maior de quatro.
 *
 * Uso: node design/especime-v3/medicoes/rp4c-2026-10-05/medir-letra.mjs --dist <pasta do dist> --json <saída> [--rotulo <o que é a construção>]
 *
 * O registo diz a construção pelo rótulo (por omissão, «o dist/ da worktree do bloco») e pelo commit do `version.json`,
 * e nunca pelo caminho da pasta, que é da máquina.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const DIST = path.resolve(argumento('--dist') ?? 'dist');
const SAIDA = argumento('--json');
if (!SAIDA) throw Error('falta --json <saída>');
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
const ROTAS = [
  ['primeira', '/', '/en/'],
  ['precos', '/precos/', '/en/prices/'],
  ['recibo-da-inflacao', '/livro-razao/series/serie-ipc-variacao-homologa/', '/en/ledger/series/serie-ipc-variacao-homologa/'],
];
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
const paginas = [];
try {
  for (const [nome, pt, en] of ROTAS) {
    for (const [lang, rota] of [['pt', pt], ['en', en]]) {
      const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
      await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
      const p = await ctx.newPage();
      const resposta = await p.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) throw Error(`página não encontrada: ${rota}`);
      await p.evaluate(() => document.fonts.ready);
      const medida = await p.evaluate(() => {
        const letra = document.fonts.check('12px Bitter');
        const desenhos = [...document.querySelectorAll('svg[data-forma="serie-do-pais"]')].map((svg) => {
          const marcas = (eixo) => [...svg.querySelectorAll(`[data-eixo="${eixo}"] text`)].map((t) => {
            const b = t.getBBox();
            return { texto: t.textContent, largura: t.getComputedTextLength(), esquerda: b.x, direita: b.x + b.width };
          });
          const tempo = marcas('tempo');
          const espacos = tempo.slice(1).map((m, i) => m.esquerda - tempo[i].direita);
          /* O CONHECIDO-POSITIVO, em memória: uma etiqueta de oito algarismos no mesmo desenho, medida e tirada. */
          const prova = svg.querySelector('[data-eixo="tempo"] text').cloneNode(true);
          prova.textContent = '19921992';
          svg.appendChild(prova);
          const oito = prova.getComputedTextLength();
          prova.remove();
          return { series: svg.getAttribute('data-series'), viewBox: svg.getAttribute('viewBox'), tempo, valor: marcas('valor'), espacos, oito };
        });
        return { letra, desenhos };
      });
      paginas.push({ nome, lang, rota, ...medida });
      await ctx.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const anos = paginas.flatMap((p) => p.desenhos.flatMap((d) => d.tempo)).filter((m) => /^\d{4}$/.test(m.texto));
const maior = Math.max(...anos.map((m) => m.largura));
const menor = Math.min(...anos.map((m) => m.largura));
const oito = Math.min(...paginas.flatMap((p) => p.desenhos.map((d) => d.oito)));
const espacos = paginas.flatMap((p) => p.desenhos.flatMap((d) => d.espacos));
const saida = {
  construcao: argumento('--rotulo') ?? 'o dist/ da worktree do bloco',
  commit: versao.commit,
  construido_em: versao.construido_em,
  letra_carregada_em_todas: paginas.every((p) => p.letra),
  desenhos: paginas.reduce((n, p) => n + p.desenhos.length, 0),
  etiquetas_de_ano_medidas: anos.length,
  largura_maior_de_um_ano: Number(maior.toFixed(3)),
  largura_menor_de_um_ano: Number(menor.toFixed(3)),
  conhecido_positivo_oito_algarismos: Number(oito.toFixed(3)),
  conhecido_positivo_mede_mais: oito > maior,
  menor_espaco_entre_etiquetas_do_tempo: Number(Math.min(...espacos).toFixed(3)),
  paginas,
};
await fs.writeFile(SAIDA, JSON.stringify(saida, null, 2) + '\n');
console.log(`letra carregada: ${saida.letra_carregada_em_todas} · ${saida.desenhos} desenhos · ${anos.length} anos · largura de um ano ${saida.largura_menor_de_um_ano} a ${saida.largura_maior_de_um_ano} · oito algarismos ${saida.conhecido_positivo_oito_algarismos} · menor espaço ${saida.menor_espaco_entre_etiquetas_do_tempo}`);
