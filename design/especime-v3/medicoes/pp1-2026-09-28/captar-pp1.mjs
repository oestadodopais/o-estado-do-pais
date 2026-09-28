/** PP1: as capturas da primeira página e das cinco páginas das entradas.
 * Adaptado do captor do C1 (`design/especime-v3/medicoes/c1-2026-09-28/captar-c1.mjs`).
 * Serve a construção por um servidor local numa porta livre escolhida pelo sistema,
 * recusa todo o pedido que não seja da origem local, confere que a construção é da
 * cabeça esperada, e congela o HTML e as folhas servidas por sha256. Nenhum caminho da
 * máquina entra no manifesto: só caminhos relativos ao repositório.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/captar-pp1.mjs antes|depois [construção] [cabeça esperada]
 *
 * O que mede, além das imagens: a altura de cada página, o transbordo horizontal, e na
 * primeira página, a 390 × 844, onde acaba cada parte dos dois primeiros blocos (o título,
 * a frase, o desenho e a linha da fonte). É a medida do teste de aceitação do §1 do brief:
 * os dois primeiros blocos inteiros cabem nos dois primeiros ecrãs (até 1 688 px).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';

const estado = process.argv[2];
if (!['antes', 'depois'].includes(estado)) throw new Error('Uso: captar-pp1.mjs antes|depois [construção] [cabeça esperada]');
const raiz = process.cwd();
const dist = path.resolve(process.argv[3] ?? process.env.OEDP_DIST ?? 'dist');
const pastaRelativa = 'design/especime-v3/medicoes/pp1-2026-09-28';
const bloco = path.join(raiz, pastaRelativa);
const pasta = path.join(bloco, 'capturas');
const destino = path.join(bloco, `paginas-${estado}`);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[4] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const inicio = new Date();
const larguras = [390, 768, 1024, 1280, 1600];
const ECRA = 844;
const entradas = [
  ['dinheiro', '/o-meu-dinheiro/', '/en/my-money/'],
  ['trabalho', '/o-meu-trabalho/', '/en/my-work/'],
  ['casa', '/a-minha-casa/', '/en/my-home/'],
  ['escola-e-saude', '/a-escola-e-a-saude/', '/en/school-and-health/'],
  ['estado', '/o-estado-e-a-economia/', '/en/state-and-economy/'],
];
const paginas = [
  ['pais', 'pt', '/'], ['pais', 'en', '/en/'],
  ...(estado === 'depois' ? entradas.flatMap(([nome, pt, en]) => [[`entrada-${nome}`, 'pt', pt], [`entrada-${nome}`, 'en', en]]) : []),
];
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
const resultados = [], falhas = [], observacoes = [], copias = {};

/** As caixas em coordenadas do documento. */
const MEDIR = () => {
  const texto = (e) => e?.textContent.replace(/\s+/g, ' ').trim() ?? null;
  const caixa = (e) => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.y + scrollY), fundo: Math.round(r.bottom + scrollY), x: Math.round(r.x + scrollX), largura: Math.round(r.width), altura: Math.round(r.height) };
  };
  const blocos = [...document.querySelectorAll('[data-bloco]')].map((b) => ({
    id: b.getAttribute('data-bloco'),
    caixa: caixa(b),
    titulo: caixa(b.querySelector('[data-bloco-titulo]')),
    frase: caixa(b.querySelector('[data-bloco-frase]')),
    desenho: caixa(b.querySelector('[data-bloco-desenho]')),
    fonte: caixa(b.querySelector('[data-bloco-fonte]')),
    numeros: caixa(b.querySelector('[data-legenda-selos]')),
  }));
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    corpo: document.body.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: { texto: texto(document.querySelector('h1')), caixa: caixa(document.querySelector('h1')) },
    o_que_se_passa: caixa(document.querySelector('[data-o-que-se-passa]')),
    data_dos_numeros: { texto: texto(document.querySelector('[data-numeros-mais-recentes]')), caixa: caixa(document.querySelector('[data-numeros-mais-recentes]')) },
    blocos,
    entradas: caixa(document.querySelector('[data-entradas]')),
  };
};

/** Congela os bytes servidos: cada página e as folhas que ela liga. */
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

async function fotografar(navegador, familia, lingua, rota, largura, tema) {
  const contexto = await navegador.newContext({ viewport: { width: largura, height: largura === 390 ? ECRA : 900 }, deviceScaleFactor: 1, colorScheme: tema, reducedMotion: 'reduce' });
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
    const sufixo = tema === 'dark' ? '-escuro' : '';
    const ficheiro = `${estado}-${familia}-${lingua}-${largura}${sufixo}.png`;
    const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
    const r = { ficheiro, rota, familia, lingua, largura, tema, ...medida,
      deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela,
      pedidosExternosAbortados: externos, errosDoNavegador: erros, sha256: sha(bytes), ecras: [] };
    /* O primeiro ecrã e os dois primeiros, só na primeira página a 390 px e no claro. */
    if (familia === 'pais' && largura === 390 && tema === 'light') {
      for (const [nome, altura] of [['primeiro-ecra', ECRA], ['dois-ecras', 2 * ECRA]]) {
        const f = `${estado}-${familia}-${lingua}-390-${nome}.png`;
        const b = await pagina.screenshot({ path: path.join(pasta, f), clip: { x: 0, y: 0, width: 390, height: Math.min(altura, medida.altura) }, fullPage: true, animations: 'disabled' });
        r.ecras.push({ ficheiro: f, altura, sha256: sha(b) });
      }
      /* O teste de aceitação: os dois primeiros blocos inteiros nos dois primeiros ecrãs. */
      if (estado === 'depois') {
        const [b1, b2] = medida.blocos;
        const dentro = (b) => b && ['titulo', 'frase', 'desenho', 'fonte'].every((k) => b[k] && b[k].fundo <= 2 * ECRA);
        r.aceitacao = {
          o_que_se_passa_no_primeiro_ecra: Boolean(medida.o_que_se_passa && medida.o_que_se_passa.fundo <= ECRA),
          data_no_primeiro_ecra: Boolean(medida.data_dos_numeros.caixa && medida.data_dos_numeros.caixa.fundo <= ECRA),
          primeiro_bloco_inteiro: dentro(b1),
          segundo_bloco_inteiro: dentro(b2),
          fundo_da_fonte_do_segundo_bloco_px: b2?.fonte?.fundo ?? null,
        };
        for (const [k, v] of Object.entries(r.aceitacao)) if (v === false) falhas.push(`${f(r)}: ${k} falhou.`);
      }
    }
    resultados.push(r);
    if (r.deslocamento > 0) (estado === 'depois' ? falhas : observacoes).push(`${ficheiro}: a página transborda ${r.deslocamento} px.`);
    if (erros.length) falhas.push(`${ficheiro}: ${erros.length} erros do navegador.`);
    if (externos.length) falhas.push(`${ficheiro}: ${externos.length} pedidos para fora.`);
    console.log(`${ficheiro}: ${r.documento} × ${r.altura}${r.aceitacao ? ` · aceitação ${JSON.stringify(r.aceitacao)}` : ''}`);
  } finally { await contexto.close(); }
}
const f = (r) => r.ficheiro;

let navegador;
try {
  await congelar();
  navegador = await chromium.launch({ headless: true });
  for (const [familia, lingua, rota] of paginas) {
    for (const largura of larguras) await fotografar(navegador, familia, lingua, rota, largura, 'light');
    for (const largura of [390, 1280]) await fotografar(navegador, familia, lingua, rota, largura, 'dark');
  }
  /* As páginas e as folhas não mudaram enquanto eram fotografadas. */
  for (const [nome, copia] of Object.entries(copias)) {
    const relativo = copia.rota ? copia.rota.replace(/^\//, '') + 'index.html' : copia.origem.replace(/^\//, '');
    if (sha(await fs.readFile(path.join(dist, relativo))) !== copia.sha256) falhas.push(`${nome}: os bytes mudaram durante as capturas.`);
  }
  const fim = new Date();
  const manifesto = {
    estado, aceitacao: { passou: falhas.length === 0, falhas }, observacoes,
    cabeca_da_arvore: git('rev-parse', 'HEAD'), dist_construido_de: versao.commit,
    construido_em: versao.construido_em ?? null,
    pasta_das_capturas: `${pastaRelativa}/capturas`, pasta_das_paginas: `${pastaRelativa}/paginas-${estado}`,
    inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: Math.round((fim - inicio) / 1000),
    larguras, ecra_390: ECRA, copias, resultados,
  };
  await fs.writeFile(path.join(bloco, `capturas-${estado}.json`), JSON.stringify(manifesto, null, 2) + '\n');
  console.log(`${resultados.length} capturas; ${falhas.length} falhas; ${observacoes.length} observações.`);
  if (falhas.length) { for (const x of falhas) console.error(`FALHA ${x}`); process.exitCode = 1; }
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
