/** R4: as capturas e as medidas no navegador (o brief R4, §3, ponto 6), sobre a construção da cabeça atual.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r4-2026-10-05/captar-r4.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual; o guião confere o `version.json`)
 *
 * O QUE TIRA, páginas inteiras, nas cinco larguras da casa (390, 768, 1 024, 1 280 e 1 600 px) e nas duas edições: o
 * recibo de uma linha nacional (a posição de investimento internacional de 2025), o de uma linha de um concelho (a
 * população de Abrantes), o de uma linha da União (a despesa em I&D), o de uma série (as rendas) e a primeira página;
 * e, a 390 px, a primeira página com a porta dos valores de referência de dentro aberta, nas duas edições.
 *
 * O QUE MEDE, e escreve em `capturas-r4.json`: em cada página, a janela contra a largura do documento (o transbordo),
 * a altura e o texto da frase nova (o título e a frase «O que é este número» dos recibos, as duas frases da série, o
 * número de explicações dos valores de referência à vista e na porta); e o resumo de cada ficheiro. Um transbordo, uma
 * página que não responde 200 ou um erro na página fecham a corrida com 1. Os caminhos são relativos à raiz.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
/* `--r4b` (passagem R4-b, 06.10.2026): as capturas regeneradas vão para `capturas/r4-2026-10-05/r4b/`, o registo para
   `r4b/capturas-r4b.json`, e entra o recibo de uma linha com o marcador «por confirmar na fonte». */
const R4B = process.argv.includes('--r4b');
const pasta = R4B ? 'design/especime-v3/medicoes/r4-2026-10-05/r4b' : 'design/especime-v3/medicoes/r4-2026-10-05';
const saida = R4B ? 'design/especime-v3/capturas/r4-2026-10-05/r4b' : 'design/especime-v3/capturas/r4-2026-10-05';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
/* A construção é a da cabeça do código; por cima dela a cabeça só pode ter commits nas duas pastas das provas. */
const porCima = versao.commit === cabeca ? [] : execFileSync('git', ['diff', '--name-only', `${versao.commit}..${cabeca}`], { encoding: 'utf8' }).split('\n').filter(Boolean);
if (porCima.some((f) => !f.startsWith('design/especime-v3/medicoes/r4-2026-10-05/') && !f.startsWith('design/especime-v3/capturas/r4-2026-10-05/'))) {
  throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}), e a diferença não é só de provas.`);
}
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = {
  'linha-pii-2025': { pt: '/livro-razao/posicao-de-investimento-internacional-2025/', en: '/en/ledger/posicao-de-investimento-internacional-2025/' },
  'linha-abrantes-populacao': { pt: '/livro-razao/abrantes-populacao-2025/', en: '/en/ledger/abrantes-populacao-2025/' },
  'linha-despesa-em-id-ue': { pt: '/livro-razao/despesa-em-id-2024-ue/', en: '/en/ledger/despesa-em-id-2024-ue/' },
  'serie-rendas': { pt: '/livro-razao/series/serie-ipc-rendas-variacao-homologa/', en: '/en/ledger/series/serie-ipc-rendas-variacao-homologa/' },
  'primeira-pagina': { pt: '/', en: '/en/' },
  ...(R4B ? { 'linha-com-marcador': { pt: '/livro-razao/funchal-desemprego-registado-2025-12/', en: '/en/ledger/funchal-desemprego-registado-2025-12/' } } : {}),
};
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.xml': 'application/xml' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    const url = new URL(pedido.url, 'http://localhost');
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end();
  }
});
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const capturas = [];
const problemas = [];
const inicio = new Date().toISOString();

/** As medidas de uma página, lidas no navegador. */
const medir = () => {
  const texto = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const semSelos = (el) => {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('a.src-chip').forEach((a) => a.remove());
    return texto(c);
  };
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    titulo: texto(document.querySelector('.linha-cabeca h1')),
    frase_o_que_e: semSelos(document.querySelector('[data-o-que-e] [data-o-que-e-parte="o-que-e"]') ?? document.querySelector('[data-o-que-e-da-serie] .linha-o-que-e-frase')),
    frase_que_compara: semSelos(document.querySelector('[data-o-que-e] [data-o-que-e-parte="comparacao"]')),
    frase_do_ultimo_ponto: texto(document.querySelector('[data-serie-ultimo]')),
    explicacoes_a_vista: document.querySelectorAll('[data-veredicto-fora] [data-veredicto-explica]').length,
    explicacoes_na_porta: document.querySelectorAll('details[data-veredicto-dentro] [data-veredicto-explica]').length,
    marcador_por_confirmar: document.querySelectorAll('[data-por-confirmar-na-fonte] a.marcador-da-frase').length,
    partes_do_sinal: document.querySelectorAll('[data-veredicto-sinal], [data-o-que-e-parte="sinal"]').length,
  };
};

const tirar = async (nome, lang, url, largura, { abrirPorta = false } = {}) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  const p = await c.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(String(e)));
  const r = await p.goto(origem + url, { waitUntil: 'networkidle' });
  if (r?.status() !== 200) problemas.push(`${url} a ${largura} px respondeu ${r?.status()}`);
  if (abrirPorta) await p.evaluate(() => { const d = document.querySelector('details[data-veredicto-dentro]'); if (d) d.open = true; });
  const m = await p.evaluate(medir);
  const sufixo = abrirPorta ? '-porta-aberta' : '';
  const ficheiro = path.join(saida, `${nome}${sufixo}-${lang}-${largura}.png`);
  const bytes = await p.screenshot({ path: ficheiro, fullPage: true });
  if (m.documento > m.janela) problemas.push(`${url} a ${largura} px rola para o lado: documento ${m.documento} px, janela ${m.janela} px`);
  if (erros.length) problemas.push(`${url} a ${largura} px: ${erros.join(' | ')}`);
  capturas.push({ ficheiro, pagina: nome + sufixo, lang, url, largura, largura_do_documento: m.documento, altura: m.altura, medidas: m, sha256: createHash('sha256').update(bytes).digest('hex') });
  await c.close();
};

for (const [nome, urls] of Object.entries(paginas)) {
  for (const lang of ['pt', 'en']) for (const largura of larguras) await tirar(nome, lang, urls[lang], largura);
}
for (const lang of ['pt', 'en']) await tirar('primeira-pagina', lang, paginas['primeira-pagina'][lang], 390, { abrirPorta: true });
await navegador.close();
servidor.close();

const registo = {
  bloco: R4B ? 'R4-b' : 'R4',
  guiao: 'design/especime-v3/medicoes/r4-2026-10-05/captar-r4.mjs' + (R4B ? ' --r4b' : ''),
  cabeca,
  estado_seguido: estado,
  construcao: versao.commit,
  por_cima_da_construcao: porCima,
  inicio,
  fim: new Date().toISOString(),
  navegador: 'chromium (playwright), escala 1, tema claro, movimento reduzido',
  larguras,
  capturas,
  problemas,
};
await fs.mkdir(pasta, { recursive: true });
await fs.writeFile(path.join(pasta, R4B ? 'capturas-r4b.json' : 'capturas-r4.json'), `${JSON.stringify(registo, null, 2)}\n`);
console.log(`capturas ${capturas.length} · problemas ${problemas.length}${problemas.length ? `\n  ${problemas.join('\n  ')}` : ''}`);
process.exit(problemas.length ? 1 : 0);
