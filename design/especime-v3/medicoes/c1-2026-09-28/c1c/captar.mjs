/** C1c: capturas, recortes e cópias das páginas nas duas edições.
 * Adaptado do captor do RP1. Os defeitos do antes são medidos e conservados.
 * Nenhum destino local entra nos manifestos, apenas caminhos do repositório.
 * Uso: node c1c/captar.mjs [cabeça construída]; OEDP_DIST escolhe a construção.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';

const estado = 'depois';
const raiz = process.cwd();
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const pastaRelativa = 'design/especime-v3/medicoes/c1-2026-09-28/c1c';
const bloco = path.join(raiz, pastaRelativa);
const pasta = path.join(bloco, 'capturas');
const destino = path.join(bloco, `paginas-${estado}`);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[2] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const inicio = new Date();
const larguras = [390, 768, 1024, 1280, 1600];
const idsAlterados = git('diff', '--name-only', 'b7f352ce253effe7d21dc97bacc1d9b67665e592', '--', 'ledger/claims').split('\n').filter(Boolean).map(f=>path.basename(f,'.yml'));
const idsDeRecibos = [...new Set([...idsAlterados, 'ipc-variacao-homologa', 'ihpc-variacao-homologa', 'taxa-de-cambio-efectiva-real-2025', 'evora-indice-de-divida-2024', 'evora-prazo-medio-de-pagamento-2025-12'])].sort();
const paginas = [
  ['temas','pt','/temas/'], ['temas','en','/en/themes/'],
  ['evora','pt','/municipios/evora/'], ['evora','en','/en/municipalities/evora/'],
  ...idsDeRecibos.flatMap(id=>[[`recibo-${id}`,'pt',`/livro-razao/${id}/`],[`recibo-${id}`,'en',`/en/ledger/${id}/`]]),
];
const tema = parse(await fs.readFile(path.join(dist,'temas/index.html'),'utf8'));
const idsDiretos = new Set([...idsDeRecibos]);
const cartoes = tema.querySelectorAll('article[data-cartao-medida]').filter(c=>
  idsDiretos.has(c.getAttribute('data-cartao-medida')) || c.querySelectorAll('[data-claim]').some(e=>idsDiretos.has(e.getAttribute('data-claim')))
).map(c=>c.getAttribute('data-cartao-medida'));
if(!cartoes.length || idsAlterados.length!==20) throw new Error('A matriz de cartões ou de linhas alteradas ficou vazia ou mudou.');
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
await fs.mkdir(pasta, { recursive: true });
await fs.mkdir(destino, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const resultados = [], recortes = [], falhas = [], observacoes = [], copias = {};

/** Caixas em coordenadas do documento, e separação textual sem depender do CSS. */
const MEDIR = () => {
  const texto = (e) => e?.textContent.replace(/\s+/g, ' ').trim() ?? null;
  const caixa = (e) => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, largura: r.width, altura: r.height, direita: r.right + scrollX, fundo: r.bottom + scrollY };
  };
  const fonte = (e) => e ? parseFloat(getComputedStyle(e).fontSize) : null;
  const separacao = (valor, unidade) => {
    if (!valor || !unidade) return null;
    const intervalo = document.createRange();
    intervalo.setStartAfter(valor); intervalo.setEndBefore(unidade);
    const entre = intervalo.toString();
    return { entre, separados: /^\s+$/.test(entre), distancia_px: unidade.getBoundingClientRect().left - valor.getBoundingClientRect().right };
  };
  const cartoes = [...document.querySelectorAll('article.cartao-medida')].map((c) => {
    const valor = c.querySelector('.cartao-medida-valor [data-claim]');
    const unidade = c.querySelector('.cartao-medida-unidade');
    const leitura = c.querySelector('.cartao-medida-leitura');
    const cl = caixa(c), ll = caixa(leitura);
    return {
      id: c.getAttribute('data-cartao-medida') ?? (c.hasAttribute('data-cartao-camaras') ? 'camaras' : null),
      nome: texto(c.querySelector('.cartao-medida-nome')), texto: texto(c),
      valor: texto(valor), unidade: texto(unidade), leitura: texto(leitura),
      separacao: separacao(valor, unidade), marcas: c.querySelectorAll('.src-chip').length,
      caixa: cl, caixa_valor: caixa(valor), caixa_unidade: caixa(unidade), caixa_leitura: ll,
      fonte_valor_px: fonte(valor), fonte_unidade_px: fonte(unidade), fonte_leitura_px: fonte(leitura),
      transborda: c.scrollWidth > c.clientWidth + 0.5 || (ll && cl ? ll.direita > cl.direita + 0.5 || ll.x < cl.x - 0.5 : false),
    };
  });
  const titulo = document.querySelector('h1.linha-valor');
  const tituloValor = titulo?.querySelector('[data-claim]');
  const tituloUnidade = titulo?.querySelector('[data-linha-campo="unit"]');
  const verificacoes = document.querySelector('[aria-labelledby="verificacoes"]');
  const historico = document.querySelector('[aria-labelledby="historico"]');
  const serie = document.querySelector('.mun-serie-svg');
  const banda = document.querySelector('.mun-banda-svg');
  const svgTexto = (svg, seletor) => [...(svg?.querySelectorAll(seletor) ?? [])].map((e) => ({ texto: texto(e), x: e.getAttribute('x'), y: e.getAttribute('y'), caixa: caixa(e) }));
  const pontos = [...(serie?.querySelectorAll('.mun-serie-val') ?? [])].map((e) => ({
    id: e.getAttribute('data-claim'), x: e.getAttribute('x'), y: e.getAttribute('y'),
    ano: texto(e.closest('g')?.querySelector('[data-nonledger="escala-de-instrumento"]')), caixa: caixa(e),
  }));
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    corpo: document.body.scrollWidth, altura: document.documentElement.scrollHeight,
    h1: { texto: texto(document.querySelector('h1')), caixa: caixa(document.querySelector('h1')), fonte_px: fonte(document.querySelector('h1')) },
    cartoes, valores_colados_a_unidade: cartoes.filter((c) => c.separacao && !c.separacao.separados).length,
    valores_separados_da_unidade: cartoes.filter((c) => c.separacao?.separados).length,
    recibo: titulo ? { titulo: texto(titulo), separacao: separacao(tituloValor, tituloUnidade),
      verificacoes: { texto: texto(verificacoes), caixa: caixa(verificacoes) },
      historico: { texto: texto(historico), caixa: caixa(historico) } } : null,
    descargas: [...document.querySelectorAll('a[download]')].map((e) => ({ texto: texto(e), destino: e.getAttribute('href'), caixa: caixa(e) })),
    calendario: serie ? { serie: caixa(serie), banda: caixa(banda), pontos,
      anos_da_banda: svgTexto(banda, '[data-nonledger="escala-de-instrumento"]'),
      rotulo_em_curso: texto(banda?.querySelector('.mun-banda-estado')),
      segmentos: [...(banda?.querySelectorAll('.mun-banda-seg') ?? [])].map((e) => ({ x: e.getAttribute('x'), largura: e.getAttribute('width'), aberto: e.classList.contains('is-aberto'), caixa: caixa(e) })) } : null,
  };
};

/** Congela bytes realmente servidos, incluindo todas as folhas ligadas. */
async function congelar() {
  const folhas = new Set();
  for (const [familia, lingua, rota] of paginas) {
    const relativo = rota.replace(/^\//, '') + 'index.html';
    const nome = relativo.replaceAll('/', '_');
    const bytes = await fs.readFile(path.join(dist, relativo));
    await fs.writeFile(path.join(destino, nome), bytes);
    copias[nome] = { rota, familia, lingua, sha256: sha(bytes) };
    const doc = parse(bytes.toString('utf8'));
    for (const link of doc.querySelectorAll('link[rel="stylesheet"]')) {
      const url = new URL(link.getAttribute('href'), origem + rota);
      if (url.origin !== origem) throw new Error(`${rota}: folha externa.`);
      folhas.add(decodeURIComponent(url.pathname).replace(/^\//, ''));
    }
  }
  for (const relativo of folhas) {
    const ficheiro = path.resolve(dist, relativo);
    if (!ficheiro.startsWith(dist + path.sep)) throw new Error('Folha fora da construção.');
    const bytes = await fs.readFile(ficheiro);
    await fs.mkdir(path.dirname(path.join(destino, relativo)), { recursive: true });
    await fs.writeFile(path.join(destino, relativo), bytes);
    copias[relativo] = { origem: '/' + relativo, tipo: 'folha construída', sha256: sha(bytes) };
  }
}

let navegador;
try {
  await congelar();
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of paginas) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: largura === 390 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const externos = [], erros = [];
    try {
      await contexto.route('**/*', (r) => {
        if (new URL(r.request().url()).origin === origem) return r.continue();
        externos.push(r.request().url()); return r.abort();
      });
      const pagina = await contexto.newPage();
      pagina.on('pageerror', (e) => erros.push(e.message));
      const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}.`);
      await pagina.evaluate(() => document.fonts.ready);
      const medida = await pagina.evaluate(MEDIR);
      const ficheiro = `${estado}-${familia}-${lingua}-${largura}.png`;
      const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
      const r = { ficheiro, rota, familia, lingua, largura, ...medida,
        deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela,
        pedidosExternosAbortados: externos, errosDoNavegador: erros, sha256: sha(bytes) };
      resultados.push(r);
      if (r.deslocamento > 0) observacoes.push(`${ficheiro}: a página transborda ${r.deslocamento} px.`);
      for (const c of r.cartoes) if (c.transborda) observacoes.push(`${ficheiro}: o cartão «${c.id}» transborda.`);
      if (r.valores_colados_a_unidade) observacoes.push(`${ficheiro}: ${r.valores_colados_a_unidade} valores sem espaço antes da unidade.`);
      if (erros.length) falhas.push(`${ficheiro}: ${erros.length} erros do navegador.`);
      if (estado === 'depois') {
        if (r.valores_colados_a_unidade) falhas.push(`${ficheiro}: persistem valores colados à unidade.`);
        if (r.deslocamento > 0) falhas.push(`${ficheiro}: transbordo da página.`);
      }
      if (familia === 'temas' || familia === 'evora') for (const id of (familia === 'temas' ? cartoes : ['evora-indice-de-divida-2024','evora-prazo-medio-de-pagamento-2025-12'])) {
        const nome = id;
        const cartao = pagina.locator(`article[data-cartao-medida="${id}"]`);
        if (await cartao.count() !== 1) throw new Error(`${rota}: o cartão «${id}» não aparece uma vez.`);
        const nomeDoRecorte = `${estado}-cartao-${nome}-${lingua}-${largura}.png`;
        const imagem = await cartao.screenshot({ path: path.join(pasta, nomeDoRecorte), animations: 'disabled' });
        recortes.push({ ficheiro: nomeDoRecorte, rota, id, nome, lingua, largura,
          medida: medida.cartoes.find((c) => c.id === id), sha256: sha(imagem) });
      }
      console.log(`${ficheiro}: ${r.documento} × ${r.altura}, ${r.valores_colados_a_unidade} valores colados à unidade.`);
    } finally { await contexto.close(); }
  }
  /* Confere que as páginas e folhas não mudaram enquanto eram fotografadas. */
  for (const [nome, copia] of Object.entries(copias)) {
    const relativo = copia.rota ? copia.rota.replace(/^\//, '') + 'index.html' : copia.origem.replace(/^\//, '');
    if (sha(await fs.readFile(path.join(dist, relativo))) !== copia.sha256) falhas.push(`${nome}: os bytes mudaram durante as capturas.`);
  }
  const fim = new Date();
  const comum = { estado, aceitacao: { passou: falhas.length === 0, falhas }, observacoes,
    cabeca_da_arvore: git('rev-parse', 'HEAD'), dist_construido_de: versao.commit,
    dist_construido_em: versao.construido_em, inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: (fim - inicio) / 1000 };
  await fs.writeFile(path.join(destino, 'INDICE.json'), JSON.stringify({ ...comum, copias }, null, 2) + '\n');
  await fs.writeFile(path.join(bloco, `capturas-${estado}.json`), JSON.stringify({ ...comum, navegador: navegador.version(), larguras, idsDeRecibos, cartoes, resultados, recortes }, null, 2) + '\n');
  console.log(`${resultados.length} capturas de página, ${recortes.length} recortes e ${Object.keys(copias).length} cópias; ${falhas.length} falhas de aceitação.`);
  if (falhas.length) { console.error(falhas.join('\n')); process.exitCode = 1; }
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
