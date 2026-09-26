/** RP1: capturas das páginas do país e dos temas nas duas edições.
 * Adaptado do captor do L1, com as mesmas verificações de forma.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { DOMINIOS_RP1 } from '../../../../src/data/medidas-rp1.mjs';

const rp1b = process.argv[2] === 'rp1b';
const estado = rp1b ? 'depois' : process.argv[2];
const prefixo = rp1b ? 'rp1b-' : '';
if (!['antes', 'depois'].includes(estado)) throw new Error('uso: captar-rp1.mjs antes|depois|rp1b [dist] [commit-esperado]');
const raiz = process.cwd();
const dist = path.resolve(process.argv[3] ?? process.env.OEDP_DIST ?? 'dist');
const bloco = path.join(raiz, 'design/especime-v3/medicoes/rp1-2026-09-26');
const pasta = path.join(bloco, 'capturas');
const manifesto = path.join(bloco, `capturas-${prefixo}${estado}.json`);
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
];
/* [nome do ficheiro, id da medida, seletor do cartão] */
const CARTOES_RECORTADOS = estado === 'depois' ? (rp1b ? ['ipc-energia-em-casa-variacao-homologa', 'ipc-combustiveis-variacao-homologa', 'ipc-rendas-variacao-homologa', 'ihpc-variacao-homologa', 'remuneracao-bruta-mensal-media'] : Object.keys(DOMINIOS_RP1)).map(id => [id, id, `article[data-cartao-medida="${id}"]`]) : [];
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
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const resultados = [], recortes = [], falhas = [];

/** A medida de uma página aberta: os cartões, as leituras e o transbordo. */
const MEDIR = () => {
  const texto = (e) => e?.textContent.replace(/\s+/g, ' ').trim() ?? null;
  const px = (e) => e ? parseFloat(getComputedStyle(e).fontSize) : null;
  const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height, direita: r.right, fundo: r.bottom }; };
  const segue = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
  /* A MEDIDA DE LINHA EM «ch», que é a unidade em que a folha a declara. O
     navegador devolve a medida máxima em px, e um «ch» vale mais px a 14 px do
     que a 12 px: comparar os px da leitura com os da pergunta dava duas medidas
     diferentes para a mesma declaração. Mede-se o «ch» de cada elemento com uma
     sonda de largura 1ch posta dentro dele, e divide-se. */
  const emCh = (e) => {
    if (!e) return null;
    const m = getComputedStyle(e).maxWidth;
    if (!m || m === 'none') return null;
    const sonda = document.createElement('span');
    sonda.style.cssText = 'position:absolute;visibility:hidden;width:1ch;height:0;margin:0;padding:0;border:0';
    e.appendChild(sonda);
    const ch = sonda.getBoundingClientRect().width;
    sonda.remove();
    return ch > 0 ? Math.round((parseFloat(m) / ch) * 10) / 10 : null;
  };
  /* A tinta da página, resolvida pelo navegador: um elemento de prova com
     `color: var(--ink)`, lido e retirado. */
  const prova = document.createElement('span');
  prova.style.color = 'var(--ink)';
  document.body.appendChild(prova);
  const tinta = getComputedStyle(prova).color;
  prova.remove();
  const cartoes = [...document.querySelectorAll('article.cartao-medida')].map((c) => {
    const id = c.dataset.cartaoMedida ?? (c.hasAttribute('data-cartao-camaras') ? 'camaras' : null);
    const valor = c.querySelector('.cartao-medida-valor');
    const leituras = c.querySelectorAll('.cartao-medida-leitura');
    const leitura = leituras[0] ?? null;
    const regua = c.querySelector('.cartao-medida-regua');
    const pergunta = c.querySelector('.cartao-medida-frase');
    const cl = caixa(c), ll = caixa(leitura);
    const estilo = leitura ? getComputedStyle(leitura) : null;
    return {
      id,
      leituras: leituras.length,
      leitura: texto(leitura),
      leitura_px: px(leitura),
      leitura_cor: estilo?.color ?? null,
      leitura_cor_e_a_tinta: estilo ? estilo.color === tinta : null,
      leitura_medida_max: estilo?.maxWidth ?? null,
      pergunta_medida_max: pergunta ? getComputedStyle(pergunta).maxWidth : null,
      leitura_medida_ch: emCh(leitura),
      pergunta_medida_ch: emCh(pergunta),
      leitura_depois_do_valor: leitura ? segue(valor, leitura) : null,
      leitura_antes_da_regua: leitura && regua ? segue(leitura, regua) : null,
      leitura_antes_da_pergunta: leitura && pergunta ? segue(leitura, pergunta) : null,
      numero_px: px(c.querySelector('.cartao-medida-num')),
      regua_px: px(regua),
      pergunta_px: px(pergunta),
      marcas: c.querySelectorAll('.src-chip').length,
      caixa: cl,
      caixa_da_leitura: ll,
      transborda: c.scrollWidth > c.clientWidth + 0.5 || (ll && cl ? ll.direita > cl.direita + 0.5 || ll.x < cl.x - 0.5 : false),
    };
  });
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    corpo: document.body.scrollWidth,
    altura: document.documentElement.scrollHeight,
    tinta,
    cartoes,
  };
};

let navegador;
try {
  navegador = await chromium.launch({ headless: true });
  const abre = async (largura) => {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: largura === 390 ? 844 : 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    const externos = [], erros = [];
    await contexto.route('**/*', (r) => {
      if (new URL(r.request().url()).origin === origem) return r.continue();
      externos.push(r.request().url());
      return r.abort();
    });
    const pagina = await contexto.newPage();
    pagina.on('pageerror', (e) => erros.push(e.message));
    return { contexto, pagina, externos, erros };
  };
  for (const [familia, lingua, rota] of paginas) for (const largura of larguras) {
    const { contexto, pagina, externos, erros } = await abre(largura);
    const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
    await pagina.evaluate(() => document.fonts.ready);
    const medida = await pagina.evaluate(MEDIR);
    const ficheiro = `${prefixo}${estado}-${familia}-${lingua}-${largura}.png`;
    const bytes = await pagina.screenshot({ path: path.join(pasta, ficheiro), fullPage: true, animations: 'disabled' });
    const r = { ficheiro, rota, familia, lingua, largura, ...medida, deslocamento: Math.max(medida.documento, medida.corpo) - medida.janela, pedidosExternosAbortados: externos, errosDoNavegador: erros, sha256: sha(bytes) };
    resultados.push(r);
    /* A ACEITAÇÃO. Nada transborda em lado nenhum, antes e depois; as regras da
       leitura só fecham o depois. */
    if (r.deslocamento > 0) falhas.push(`${ficheiro}: a página transborda ${r.deslocamento} px`);
    if (erros.length) falhas.push(`${ficheiro}: ${erros.length} erro(s) do navegador`);
    for (const c of r.cartoes) {
      if (c.transborda) falhas.push(`${ficheiro}: o cartão «${c.id}» transborda`);
      if (estado !== 'depois') continue;
      if (c.leituras !== 1) falhas.push(`${ficheiro}: o cartão «${c.id}» tem ${c.leituras} leitura(s)`);
      if (c.leitura_px !== 14) falhas.push(`${ficheiro}: a leitura de «${c.id}» está a ${c.leitura_px} px`);
      if (c.leitura_cor_e_a_tinta !== true) falhas.push(`${ficheiro}: a leitura de «${c.id}» não está na tinta (${c.leitura_cor} contra ${r.tinta})`);
      if (c.leitura_depois_do_valor !== true) falhas.push(`${ficheiro}: a leitura de «${c.id}» não vem depois da linha do valor`);
      if (c.leitura_antes_da_regua === false) falhas.push(`${ficheiro}: a leitura de «${c.id}» vem depois da régua`);
      if (c.leitura_antes_da_pergunta === false) falhas.push(`${ficheiro}: a leitura de «${c.id}» vem depois da pergunta`);
      if (c.leitura_medida_ch === null || Math.abs(c.leitura_medida_ch - 58) > 0.2) falhas.push(`${ficheiro}: a medida de linha da leitura de «${c.id}» é ${c.leitura_medida_ch}ch, e a folha declara 58ch`);
      if (c.pergunta_medida_ch !== null && c.leitura_medida_ch !== c.pergunta_medida_ch) falhas.push(`${ficheiro}: a medida de linha da leitura de «${c.id}» (${c.leitura_medida_ch}ch) não é a da pergunta (${c.pergunta_medida_ch}ch)`);
      if (c.marcas !== 1) falhas.push(`${ficheiro}: o cartão «${c.id}» tem ${c.marcas} marca(s)`);
    }
    await contexto.close();
    console.log(`${ficheiro}: ${r.documento} × ${r.altura}; ${r.cartoes.length} cartões, ${r.cartoes.filter((c) => c.leituras === 1).length} com leitura`);
  }
  /* OS CARTÕES RECORTADOS da página dos temas. */
  for (const [nome, id, seletor] of CARTOES_RECORTADOS) for (const [lingua, rota] of [['pt', '/temas/'], ['en', '/en/themes/']]) for (const largura of (rp1b ? larguras : [390, 1280])) {
    const { contexto, pagina, erros } = await abre(largura);
    const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) throw new Error(`${rota}: HTTP ${resposta?.status()}`);
    await pagina.evaluate(() => document.fonts.ready);
    const cartao = pagina.locator(seletor);
    if (await cartao.count() !== 1) throw new Error(`${rota}: o cartão «${id}» não está uma vez`);
    const ficheiro = `${prefixo}${estado}-cartao-${nome}-${lingua}-${largura}.png`;
    const bytes = await cartao.screenshot({ path: path.join(pasta, ficheiro), animations: 'disabled' });
    const texto = await cartao.evaluate((c) => ({
      cartao: c.textContent.replace(/\s+/g, ' ').trim(),
      leitura: c.querySelector('.cartao-medida-leitura')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      ressalvas: [...c.querySelectorAll('.claim-provisorio')].map(m => {
        const espaco = document.createRange();
        espaco.setStart(m.firstChild, 0); espaco.setEnd(m.firstChild, 1);
        return { texto: m.textContent, espaco_px: espaco.getBoundingClientRect().width, margem_px: parseFloat(getComputedStyle(m).marginLeft), forma: getComputedStyle(m).display };
      }),
    }));
    recortes.push({ ficheiro, id, lingua, largura, rota, ...texto, errosDoNavegador: erros, sha256: sha(bytes) });
    if (estado === 'depois' && !texto.leitura) falhas.push(`${ficheiro}: o cartão recortado não tem leitura`);
    if (rp1b && id === 'remuneracao-bruta-mensal-media' && (texto.ressalvas.length !== 2 || texto.ressalvas.some(m => m.texto !== (lingua === 'pt' ? ' provisório' : ' provisional') || m.espaco_px !== 0))) falhas.push(`${ficheiro}: a ressalva não separa o texto ou duplica o espaço visual`);
    await contexto.close();
    console.log(`${ficheiro}: ${texto.leitura ?? '(sem leitura)'}`);
  }
  if (falhas.length) {
    console.error(`Capturas com defeito, conservadas como evidência:\n${falhas.join('\n')}`);
    process.exitCode = 1;
  }
  /* AS CÓPIAS DAS DUAS PÁGINAS, NAS DUAS EDIÇÕES, PRESAS POR SHA256. */
  const destino = path.join(bloco, `paginas-${estado}`);
  await fs.mkdir(destino, { recursive: true });
  const copias = {};
  for (const [familia, lingua, rota] of paginas) {
    const relativo = rota.replace(/^\//, '') + 'index.html';
    const nome = relativo.replaceAll('/', '_');
    const bytes = await fs.readFile(path.join(dist, relativo));
    await fs.writeFile(path.join(destino, nome), bytes);
    copias[nome] = { rota, familia, lingua, sha256: sha(bytes) };
  }
  for (const folha of ['src/styles/cartao-medida.css', 'src/styles/site.css']) {
    const css = execFileSync('git', ['show', `${esperado}:${folha}`], { cwd: raiz });
    const nome = path.basename(folha);
    await fs.writeFile(path.join(destino, nome), css);
    copias[nome] = { origem: `${folha}@${esperado}`, sha256: sha(css) };
  }
  const fim = new Date();
  const comum = { estado, peca: rp1b ? 'rp1b' : 'rp1', aceitacao: { passou: falhas.length === 0, falhas }, cabeca_da_arvore: git('rev-parse', 'HEAD'), dist_construido_de: versao.commit, dist_construido_em: versao.construido_em, inicio: inicio.toISOString(), fim: fim.toISOString(), segundos: (fim - inicio) / 1000 };
  await fs.writeFile(path.join(destino, 'INDICE.json'), JSON.stringify({ ...comum, copias }, null, 2) + '\n');
  await fs.writeFile(manifesto, JSON.stringify({ ...comum, navegador: navegador.version(), larguras, resultados, recortes }, null, 2) + '\n');
  console.log(`${resultados.length} capturas de página, ${recortes.length} recortes e ${Object.keys(copias).length} cópias guardadas; ${falhas.length} falhas de aceitação, dist de ${versao.commit}.`);
} finally {
  await navegador?.close();
  await new Promise((resolve) => servidor.close(resolve));
}
