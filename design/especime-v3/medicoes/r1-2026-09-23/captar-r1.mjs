/** R1, 23.09.2026. As capturas das páginas que o bloco toca, antes e depois,
 * nas cinco larguras da casa (390, 768, 1 024, 1 280 e 1 600 px), e o topo da
 * primeira página e de um concelho a 390 px no primeiro ecrã (o rótulo de IA).
 * O guião é o de `design/especime-v3/medicoes/b1c-2026-09-22/captar-b1c.mjs`:
 * Chromium sem cabeça, `deviceScaleFactor: 1`, tema claro, movimento reduzido,
 * um servidor local efémero e todos os pedidos para fora abortados.
 *
 *   node design/especime-v3/medicoes/r1-2026-09-23/captar-r1.mjs antes <dist>
 *   node design/especime-v3/medicoes/r1-2026-09-23/captar-r1.mjs depois [dist]
 *
 * Na página dos lugares escreve «mour» no campo da busca antes de fotografar,
 * e mede o que o leitor vê: quantos resultados estão visíveis e se a ligação
 * para Mourão é um deles. O MANIFESTO ESCREVE-SE DEPOIS DAS ASSERÇÕES: uma
 * corrida que falhe uma asserção não deixa ficheiro de capturas nenhum. */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const estado = process.argv[2];
if (!['antes', 'depois'].includes(estado)) throw new Error('uso: captar-r1.mjs antes|depois [dist]');
const raiz = process.cwd();
const dist = path.resolve(process.argv[3] ?? path.join(raiz, 'dist'));
const bloco = path.join(raiz, 'design/especime-v3/medicoes/r1-2026-09-23');
const pasta = path.join(bloco, 'capturas');
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = [
  ['pais', 'pt', '/'],
  ['temas', 'pt', '/temas/'],
  ['lugares-mour', 'pt', '/lugares/'],
  ['concelho', 'pt', '/municipios/mourao/'],
  ['recibo', 'pt', '/livro-razao/mourao-desemprego-registado-2025-12/'],
  ['estudos', 'pt', '/estudos/'],
  ['pais', 'en', '/en/'],
];
const topos = [['topo-pais', 'pt', '/'], ['topo-concelho', 'pt', '/municipios/mourao/']];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end();
  }
});
await fs.mkdir(pasta, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
let navegador;
const resultados = [];
const bytesPorFicheiro = new Map();
try {
  navegador = await chromium.launch({ headless: true });
  const fotografa = async (familia, lingua, rota, largura, { inteira }) => {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: largura <= 390 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', (p) => (p.request().url().startsWith(origem) ? p.continue() : p.abort()));
    const pagina = await contexto.newPage();
    const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) throw new Error(`${rota}: HTTP ${resposta.status()}`);
    await pagina.evaluate(() => document.fonts.ready);
    if (familia === 'lugares-mour') {
      await pagina.fill('[data-pesquisa]', 'mour');
      await pagina.evaluate(() => new Promise((r) => setTimeout(r, 150)));
    }
    const medida = await pagina.evaluate(() => {
      const visivel = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
      const res = [...document.querySelectorAll('.pesquisa-res a[href]')].filter(visivel);
      const topo = document.querySelector('[data-rotulo-ia="topo"]');
      const h1 = document.querySelector('h1');
      /* Na primeira página o título da página está no cabeçalho, antes do
         <main>; a regra do portão (gate:html) é a do conteúdo: o rótulo é o
         primeiro filho do <main> e vem antes do título que o <main> tiver. A
         medida do documento inteiro fica, com o nome que tinha na corrida do
         antes, e a asserção do depois usa as duas do conteúdo. */
      const principal = document.querySelector('main');
      const h1DoConteudo = principal ? principal.querySelector('h1') : null;
      return {
        janela: innerWidth,
        documento: document.documentElement.scrollWidth,
        corpo: document.body.scrollWidth,
        altura: document.documentElement.scrollHeight,
        resultadosVisiveis: res.length,
        mouraoVisivel: res.some((a) => /\/municipios\/mourao\/?$/.test(a.getAttribute('href'))),
        rotuloTopo: document.querySelectorAll('[data-rotulo-ia="topo"]').length,
        rotuloRodape: document.querySelectorAll('[data-rotulo-ia="rodape"]').length,
        rotuloTopoAntesDoTitulo: !!(topo && h1 && (topo.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING)),
        rotuloTopoPrimeiroDoMain: !!(topo && principal && principal.firstElementChild === topo),
        rotuloTopoAntesDoTituloDoMain: !!(topo && principal && principal.contains(topo) && (!h1DoConteudo || (topo.compareDocumentPosition(h1DoConteudo) & Node.DOCUMENT_POSITION_FOLLOWING))),
        rotuloTopoVisivelNoPrimeiroEcra: !!(topo && topo.getBoundingClientRect().top < innerHeight && topo.getBoundingClientRect().bottom > 0),
        coresDeEstado: document.querySelectorAll('.sq-fora, .sq-dentro, .est-fora, .est-dentro').length,
        textoDoTitulo: h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : null,
      };
    });
    const nome = `${estado}-${familia}-${lingua}-${largura}.png`;
    const bytes = await pagina.screenshot({ path: path.join(pasta, nome), fullPage: inteira, animations: 'disabled' });
    bytesPorFicheiro.set(nome, bytes);
    resultados.push({ ficheiro: nome, rota, familia, lingua, largura, inteira, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, sha256: createHash('sha256').update(bytes).digest('hex') });
    await contexto.close();
  };
  for (const [familia, lingua, rota] of paginas) {
    const ls = lingua === 'en' ? [390, 1280] : larguras;
    for (const largura of ls) await fotografa(familia, lingua, rota, largura, { inteira: true });
  }
  for (const [familia, lingua, rota] of topos) await fotografa(familia, lingua, rota, 390, { inteira: false });

  /* AS ASSERÇÕES, ANTES DO MANIFESTO. Nas duas corridas: nenhuma página com
     deslocamento lateral. Na do depois, o que o bloco promete ao leitor: a
     busca mostra Mourão com «mour» escrito, o rótulo de IA está no topo uma
     vez e antes do título, e não está no rodapé. */
  const falhas = [];
  for (const r of resultados) {
    if (r.deslocamento > 0) falhas.push(`${r.ficheiro}: deslocamento lateral de ${r.deslocamento} px`);
    if (estado === 'depois') {
      if (r.familia === 'lugares-mour' && (!r.mouraoVisivel || r.resultadosVisiveis < 1 || r.resultadosVisiveis > 8)) falhas.push(`${r.ficheiro}: a busca não mostra Mourão (${r.resultadosVisiveis} resultados visíveis)`);
      if (r.rotuloTopo !== 1 || r.rotuloRodape !== 0 || !r.rotuloTopoPrimeiroDoMain || !r.rotuloTopoAntesDoTituloDoMain) falhas.push(`${r.ficheiro}: rótulo de IA topo=${r.rotuloTopo} rodapé=${r.rotuloRodape} primeiro do main=${r.rotuloTopoPrimeiroDoMain} antes do título do main=${r.rotuloTopoAntesDoTituloDoMain}`);
      if (r.familia.startsWith('topo-') && !r.rotuloTopoVisivelNoPrimeiroEcra) falhas.push(`${r.ficheiro}: o rótulo não está no primeiro ecrã`);
    }
  }
  if (falhas.length) throw new Error(`Capturas com defeito:\n  ${falhas.join('\n  ')}`);
  const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  await fs.writeFile(path.join(bloco, `capturas-${estado}.json`), JSON.stringify({
    estado, cabeca_da_arvore: cabeca, dist_construido_de: versao.commit, dist_construido_em: versao.construido_em,
    navegador: navegador.version(), larguras, resultados,
  }, null, 2) + '\n');
  console.log(`${resultados.length} capturas (${estado}), dist do commit ${versao.commit.slice(0, 8)}; lugares com «mour»: ${resultados.filter((r) => r.familia === 'lugares-mour').map((r) => r.resultadosVisiveis).join(', ')} resultado(s) visível(eis); rótulo no topo: ${resultados.map((r) => r.rotuloTopo).join('')}.`);
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
