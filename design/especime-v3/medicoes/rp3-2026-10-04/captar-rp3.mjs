/** RP3: as capturas dos recibos de duas séries no tempo (uma mensal, uma anual), nas duas edições, nas cinco larguras da casa
 * (390, 768, 1 024, 1 280 e 1 600 px): o mandato pede a 390 e a 1 280, e o ponto 9 do brief e a regra das capturas para o
 * diretor pedem as cinco.
 *
 * E o «antes» do ponto 9 do brief, que é a página de linha existente mais próxima: o recibo da linha do cartão de cada
 * uma das duas medidas, nas mesmas larguras e edições. As páginas de linha não mudam com este bloco
 * (`paginas-rp3.json` prova-o contra a construção da base), e por isso a captura da cabeça é a da base.
 *
 * Adaptado do captor do UE1. Serve `dist/` por um servidor local efémero, recusa todo o pedido que não seja da
 * origem local, confere que a construção é da cabeça esperada, e guarda, por captura, o resumo sha256 da imagem
 * e as medidas que dizem se o recibo está inteiro e cabe: a largura do documento contra a da janela, o título,
 * as linhas da tabela e os pontos marcados contra os pontos da série (lidos do ficheiro dela), as marcas da
 * tabela, as lacunas e a lista dos pedidos fechada. Nenhum caminho da máquina entra no manifesto.
 *
 * Uso: node design/especime-v3/medicoes/rp3-2026-10-04/captar-rp3.mjs [pasta de saída] [cabeça esperada]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const pastaRelativa = 'design/especime-v3/medicoes/rp3-2026-10-04';
const saidaRelativa = process.argv[2] ?? 'design/especime-v3/capturas/rp3-2026-10-04';
const saida = path.isAbsolute(saidaRelativa) ? saidaRelativa : path.join(raiz, saidaRelativa);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[3] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
/* As duas séries: uma mensal com a marca de um ponto estimado, e uma anual com lacunas e quebras de série. */
const recibos = [
  ['recibo-mensal', 'serie-ihpc-variacao-homologa'],
  ['recibo-anual', 'serie-linha-de-risco-de-pobreza'],
];
const pontosDaSerie = {};
for (const [, id] of recibos) {
  const s = load(await fs.readFile(path.join(raiz, 'ledger', 'series', `${id}.yml`), 'utf8'));
  pontosDaSerie[id] = { pontos: s.pontos.length, marcas: s.pontos.filter((p) => p.bandeira).length, lacunas: s.lacunas.length };
}
const edicoes = { pt: '/livro-razao/series/', en: '/en/ledger/series/' };
/* O «antes»: o recibo da linha do cartão de cada medida (a linha parada do índice harmonizado e a da linha de pobreza). */
const antes = [
  ['antes-mensal', 'ihpc-variacao-homologa'],
  ['antes-anual', 'linha-de-risco-de-pobreza-2025'],
];
const edicoesDaLinha = { pt: '/livro-razao/', en: '/en/ledger/' };
const resultadosAntes = [];
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

const MEDIR_RECIBO = () => ({
  janela: innerWidth, documento: document.documentElement.scrollWidth, corpo: document.body.scrollWidth,
  altura: document.documentElement.scrollHeight,
  h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  linhas_da_tabela: document.querySelectorAll('[data-serie-tabela] tbody tr').length,
  pontos: document.querySelectorAll('[data-serie-tabela] [data-ponto]').length,
  marcas_na_tabela: document.querySelectorAll('[data-serie-tabela] [data-ponto-bandeira]').length,
  lacunas: document.querySelectorAll('[data-serie-lacuna]').length,
  pedidos_fechados: [...document.querySelectorAll('details.serie-pedidos')].every((d) => !d.open),
  transborda: document.documentElement.scrollWidth > innerWidth + 0.5,
});

const navegador = await chromium.launch();
const resultados = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      for (const [nome, id] of recibos) {
        await pagina.goto(`${origem}${edicoes[lang]}${id}/`, { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await pagina.screenshot({ path: path.join(saida, ficheiro), fullPage: true });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), serie: id, lang, largura, medidas: await pagina.evaluate(MEDIR_RECIBO) });
      }
      for (const [nome, id] of antes) {
        await pagina.goto(`${origem}${edicoesDaLinha[lang]}${id}/`, { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await pagina.screenshot({ path: path.join(saida, ficheiro), fullPage: true });
        const m = await pagina.evaluate(() => ({ janela: innerWidth, documento: document.documentElement.scrollWidth, altura: document.documentElement.scrollHeight, h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null }));
        resultadosAntes.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), linha: id, lang, largura, medidas: m, transborda: m.documento > m.janela + 0.5 });
      }
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const problemas = resultados.flatMap((r) => {
  const m = r.medidas;
  const e = pontosDaSerie[r.serie];
  const p = [];
  if (m.transborda) p.push('a página transborda na horizontal');
  if (m.linhas_da_tabela !== e.pontos || m.pontos !== e.pontos) p.push(`a tabela tem ${m.linhas_da_tabela} linhas e ${m.pontos} pontos, e a série ${e.pontos}`);
  if (m.marcas_na_tabela !== e.marcas) p.push(`a tabela tem ${m.marcas_na_tabela} marcas e a série ${e.marcas}`);
  if (m.lacunas !== e.lacunas) p.push(`o recibo diz ${m.lacunas} lacunas e a série ${e.lacunas}`);
  if (!m.pedidos_fechados) p.push('a lista dos pedidos abre-se sozinha');
  return p.map((x) => `${r.ficheiro}: ${x}`);
}).concat(resultadosAntes.filter((r) => r.transborda).map((r) => `${r.ficheiro}: a página transborda na horizontal`));
const manifesto = {
  bloco: 'RP3', construcao: versao, cabeca_esperada: esperado, larguras, series: pontosDaSerie, capturas: resultados.length,
  capturas_antes: resultadosAntes.length, pedidos_recusados_para_fora: recusados.length, problemas, resultados, antes: resultadosAntes,
};
/* A passagem RP3-b capta outra vez na cabeça rebaseada para comparar imagem a imagem com as da primeira entrega, e escreve o
   manifesto noutro ficheiro da pasta (`RP3_CAPTURAS_MANIFESTO`), para que o da primeira entrega fique como estava. */
await fs.writeFile(path.join(raiz, pastaRelativa, process.env.RP3_CAPTURAS_MANIFESTO ?? 'capturas-rp3.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`RP3 capturas: ${resultados.length} imagens dos recibos e ${resultadosAntes.length} do antes, ${problemas.length} problema(s), ${recusados.length} pedido(s) para fora recusados`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length ? 1 : 0);
