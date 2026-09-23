/** B2, peça 1. Capturas e medidas do navegador, sem pedidos externos.
 * node design/especime-v3/medicoes/b2-2026-09-23/captar-b2.mjs antes|depois [dist] [commit-esperado]
 * O manifesto e as cópias guardam também as falhas de aceitação. Uma captura
 * com falhas sai a um e não se apresenta como verde. As cópias próprias
 * ficam em paginas-antes-peca1/ ou paginas-depois-peca1/. Nunca toca em paginas/.
 * As regras que o B2 corrige medem-se também no antes, mas só fecham o depois.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const estado = process.argv[2];
if (!['antes', 'depois'].includes(estado)) throw new Error('uso: captar-b2.mjs antes|depois [dist] [commit-esperado]');
const raiz = process.cwd();
const dist = path.resolve(process.argv[3] ?? process.env.OEDP_DIST ?? 'dist');
const bloco = path.join(raiz, 'design/especime-v3/medicoes/b2-2026-09-23');
const pasta = path.join(bloco, 'capturas');
const manifesto = path.join(bloco, `capturas-${estado}-peca1.json`);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[4] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`dist/version.json declara ${versao.commit}; esperava ${esperado}`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const inicio = new Date();
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = [
  ['pais', 'pt', '/'], ['pais', 'en', '/en/'],
  ['temas', 'pt', '/temas/'], ['temas', 'en', '/en/themes/'],
  ['europeia', 'pt', '/uniao-europeia/'], ['europeia', 'en', '/en/european-union/'],
  ['mourao', 'pt', '/municipios/mourao/'], ['mourao', 'en', '/en/municipalities/mourao/'],
];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch { resposta.writeHead(404).end(); }
});
await fs.mkdir(pasta, { recursive: true });
await fs.rm(manifesto, { force: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const resultados = [], falhas = [];
let navegador;
try {
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of paginas) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: largura === 390 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const externos = [], erros = [];
    await contexto.route('**/*', (r) => {
      if (new URL(r.request().url()).origin === origem) return r.continue();
      externos.push(r.request().url());
      return r.abort();
    });
    const pagina = await contexto.newPage();
    pagina.on('pageerror', (e) => erros.push(e.message));
    const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
    await pagina.evaluate(() => document.fonts.ready);
    const medida = await pagina.evaluate(() => {
      const texto = (e) => e?.textContent.replace(/\s+/g, ' ').trim() ?? null;
      const px = (e) => e ? parseFloat(getComputedStyle(e).fontSize) : null;
      const antes = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
      const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height }; };
      // As caixas do primeiro e último carácter evitam confundir uma unidade
      // que mudou de linha com a caixa inteira de um invólucro de várias linhas.
      const letra = (el, ultima = false) => {
        if (!el) return null;
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nos = [];
        while (w.nextNode()) if (/\S/.test(w.currentNode.textContent)) nos.push(w.currentNode);
        const no = ultima ? nos.at(-1) : nos[0];
        if (!no) return null;
        const s = no.textContent;
        const i = ultima ? s.search(/\S\s*$/) : s.search(/\S/);
        const r = document.createRange(); r.setStart(no, i); r.setEnd(no, i + 1);
        const c = r.getBoundingClientRect();
        return { x: c.x, y: c.y, direita: c.right, fundo: c.bottom, altura: c.height };
      };
      const marca = document.querySelector('.wordmark'), titulo = document.querySelector('h1');
      const cartoes = [...document.querySelectorAll('article.cartao-medida')].map((c) => {
        const valor = c.querySelector('.cartao-medida-num'), unidade = c.querySelector('.cartao-medida-unidade');
        const selo = c.querySelector('.src-chip'), periodo = c.querySelector('.cartao-medida-periodo');
        const regua = c.querySelector('.cartao-medida-regua'), pergunta = c.querySelector('[data-cartao-definicao]');
        const v = letra(valor, true), u = letra(unidade);
        const referencias = [...c.querySelectorAll('[data-regua="referencia"]')].map((r) => ({ estado: r.dataset.estado, texto: texto(r), cor: getComputedStyle(r).color }));
        return { id: c.dataset.cartaoMedida ?? (c.hasAttribute('data-cartao-camaras') ? 'camaras' : null), contagem: c.hasAttribute('data-cartao-camaras'), valor: texto(valor), unidade: texto(unidade), pergunta: texto(pergunta), regua: texto(regua),
          perguntaPx: px(pergunta), reguaPx: px(regua), reguaAntesDaPergunta: pergunta && regua ? antes(regua, pergunta) : null,
          valorAntesDaUnidade: unidade ? antes(valor, unidade) : null, unidadeAntesDoSelo: unidade ? antes(unidade, selo) : null,
          periodoAntesDoSelo: periodo ? antes(periodo, selo) : null,
          valorEUnidadeMesmaLinha: v && u ? Math.min(v.fundo, u.fundo) > Math.max(v.y, u.y) : null,
          caixaValor: v, caixaUnidade: u, referencias,
        };
      });
      const faixa = [...document.querySelectorAll('li.cartao[data-cartao]')].map((c) => ({
        id: c.dataset.cartao, estado: c.dataset.estado,
        texto: texto(c.querySelector('.cartao-palavra')),
        cor: c.querySelector('.sq') ? getComputedStyle(c.querySelector('.sq')).backgroundColor : null,
      }));
      return { janela: innerWidth, documento: document.documentElement.scrollWidth, corpo: document.body.scrollWidth, altura: document.documentElement.scrollHeight,
        wordmark: { elemento: marca?.tagName.toLowerCase() ?? null, texto: texto(marca), tamanho: px(marca), caixa: caixa(marca) },
        h1: { quantidade: document.querySelectorAll('h1').length, texto: texto(titulo), tamanho: px(titulo), caixa: caixa(titulo) },
        cartoes, faixa, veredicto: texto(document.querySelector('[data-veredicto-pais], [data-pais-veredicto], .pais-veredicto')),
      };
    });
    const ficheiro = `${estado}-${familia}-${lingua}-${largura}.png`;
    const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
    const r = { ficheiro, rota, familia, lingua, largura, inteira: true, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, pedidosExternosAbortados: externos, errosDoNavegador: erros, sha256: sha(bytes) };
    resultados.push(r);
    if (r.deslocamento > 0) falhas.push(`${ficheiro}: transbordo de ${r.deslocamento} px`);
    if (erros.length) falhas.push(`${ficheiro}: erros no navegador: ${erros.join('; ')}`);
    if (estado === 'depois') {
      if (r.h1.quantidade !== 1) falhas.push(`${ficheiro}: ${r.h1.quantidade} H1`);
      if (familia === 'pais') {
        if (r.wordmark.elemento !== 'h1') falhas.push(`${ficheiro}: o nome do projeto deixou de ser H1`);
      } else if (r.wordmark.elemento !== 'p' || !(r.wordmark.tamanho < r.h1.tamanho)) falhas.push(`${ficheiro}: wordmark ${r.wordmark.tamanho} px, H1 ${r.h1.tamanho} px`);
      for (const c of r.cartoes) {
        if (!c.contagem && c.unidade && (!c.valorAntesDaUnidade || !c.unidadeAntesDoSelo)) falhas.push(`${ficheiro}: ${c.id}, ordem do valor/unidade/fonte`);
        if (largura === 390 && c.valorEUnidadeMesmaLinha === false) falhas.push(`${ficheiro}: ${c.id}, unidade separada do valor`);
        if (c.pergunta && !c.pergunta.endsWith('?')) falhas.push(`${ficheiro}: ${c.id}, definição sem pergunta`);
        if (c.pergunta && c.regua && (!c.reguaAntesDaPergunta || !(c.reguaPx > c.perguntaPx))) falhas.push(`${ficheiro}: ${c.id}, ordem/tamanhos da régua e da pergunta`);
        for (const ref of c.referencias) {
          const palavra = lingua === 'pt' ? (ref.estado === 'fora' ? /\bfora d[oa]s? valores? de referência/ : /\bdentro d[oa]s? valores? de referência/) : (ref.estado === 'fora' ? /\boutside (?:the )?reference values?/i : /\bwithin (?:the )?reference values?/i);
          if (['fora', 'dentro'].includes(ref.estado) && !palavra.test(ref.texto)) falhas.push(`${ficheiro}: ${c.id}, cor sem veredicto`);
        }
      }
      for (const c of r.faixa) {
        const palavra = lingua === 'pt' ? (c.estado === 'fora' ? /\bfora d[oa]s? valores? de referência/ : /\bdentro d[oa]s? valores? de referência/) : (c.estado === 'fora' ? /\boutside (?:the )?reference values?/i : /\bwithin (?:the )?reference values?/i);
        if (['fora', 'dentro'].includes(c.estado) && !palavra.test(c.texto ?? '')) falhas.push(`${ficheiro}: faixa ${c.id}, cor sem veredicto`);
      }
    }
    await contexto.close();
    console.log(`${ficheiro}: ${r.documento} × ${r.altura}; wordmark ${r.wordmark.tamanho} px; H1 ${r.h1.tamanho} px`);
  }
  if (falhas.length) {
    await fs.writeFile(path.join(bloco, `capturas-${estado}-peca1-falhas.json`), JSON.stringify({ estado, dist_construido_de: versao.commit, falhas, resultados }, null, 2) + '\n');
    console.error(`Capturas com defeito, conservadas como evidência:\n${falhas.join('\n')}`);
    process.exitCode = 1;
  }
  const destino = path.join(bloco, `paginas-${estado}-peca1`);
  await fs.mkdir(destino, { recursive: true });
  const copias = {};
  for (const [familia, lingua, rota] of paginas) {
    const relativo = rota.replace(/^\//, '') + 'index.html';
    const nome = relativo.replaceAll('/', '_');
    const bytes = await fs.readFile(path.join(dist, relativo));
    await fs.writeFile(path.join(destino, nome), bytes);
    copias[nome] = { rota, familia, lingua, sha256: sha(bytes) };
  }
  // A folha usada no leitor de clamp() é a do commit construído, nunca uma
  // edição posterior que entretanto esteja aberta na árvore de trabalho.
  const css = execFileSync('git', ['show', `${esperado}:src/styles/site.css`], { cwd: raiz });
  await fs.writeFile(path.join(destino, 'site.css'), css);
  copias['site.css'] = { origem: `src/styles/site.css@${esperado}`, sha256: sha(css) };
  const fim = new Date();
  const comum = { estado, aceitacao: { passou: falhas.length === 0, falhas }, cabeca_da_arvore: git('rev-parse', 'HEAD'), dist_construido_de: versao.commit, dist_construido_em: versao.construido_em, inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: (fim - inicio) / 1000 };
  await fs.writeFile(path.join(destino, 'INDICE.json'), JSON.stringify({ ...comum, copias }, null, 2) + '\n');
  await fs.writeFile(manifesto, JSON.stringify({ ...comum, navegador: navegador.version(), larguras, resultados }, null, 2) + '\n');
  console.log(`${resultados.length} capturas e ${Object.keys(copias).length} cópias guardadas; ${falhas.length} falhas de aceitação, dist de ${versao.commit}.`);
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
