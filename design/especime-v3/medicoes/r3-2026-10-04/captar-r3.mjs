/** R3: as capturas do índice (o brief R3, §3, ponto 6), sobre a construção da cabeça atual: a página «Índice» e
 * «Index» inteiras nas cinco larguras da casa (390, 768, 1 024, 1 280 e 1 600 px); de perto, a gaveta dos concelhos de
 * Évora aberta (um toque no resumo, sem guião) a 390 e a 1 280 px; e o rodapé de uma página com a sétima porta, a 390
 * px, nas duas edições. O servidor efémero e o bloqueio dos pedidos de fora são os do captor do UE2
 * (`design/especime-v3/medicoes/ue2-2026-10-02/captar-ue2-b.mjs`): uma pasta serve o seu `index.html`, como a Vercel, e
 * por isso `/en/index/` é o índice e não a primeira página inglesa. O manifesto guarda a cabeça da construção, o resumo
 * de cada imagem e as medidas de cada página: a largura do documento contra a janela (o transbordo), a altura, o `<h1>`,
 * as secções, as portas, as gavetas e quantas chegam fechadas, a porta mais baixa à vista e as portas abaixo de 44 px.
 * Um transbordo, uma página que não responde 200, uma gaveta que chega aberta ou um erro na página fecham a corrida.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r3-2026-10-04/captar-r3.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/r3-2026-10-04';
const saida = 'design/especime-v3/capturas/r3-2026-10-04';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const larguras = [390, 768, 1024, 1280, 1600];
const rotas = { indice: { pt: '/indice/', en: '/en/index/' }, rodape: { pt: '/temas/', en: '/en/themes/' } };
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
const navegador = await chromium.launch();
const resultados = [];
const problemas = [];
const pedidosRecusados = [];
const inicio = new Date().toISOString();

/** As medidas da página do índice, lidas no navegador.
 * À VISTA quer dizer fora de uma gaveta fechada: o Chromium dá caixa às ligações de um `<details>` fechado, e por isso a
 * caixa sozinha não diz se o leitor vê a ligação. AS PORTAS DAS LISTAS são as do índice (`a.indice-porta`); as outras
 * ligações do corpo (a marca da fonte de cada linha de «O que mudou», a porta do rótulo de IA e o marcador de um título
 * por confirmar) contam-se à parte, pela classe, porque a régua dos alvos mede-as pelo toque, com as suas regras. */
const medir = () => {
  const fechada = (el) => el.closest('details:not([open])') !== null;
  const altura = (el) => el.getBoundingClientRect().height;
  const arredonda = (n) => Math.round(n * 10) / 10;
  const todas = [...document.querySelectorAll('main a[href]')];
  const aVista = todas.filter((a) => !fechada(a));
  const dasListas = aVista.filter((a) => a.classList.contains('indice-porta'));
  const outras = aVista.filter((a) => !a.classList.contains('indice-porta'));
  const classeDe = (a) => (a.classList.contains('src-chip') ? 'marca da fonte' : a.closest('[data-rotulo-ia="topo"]') ? 'rótulo de IA' : a.classList.contains('marcador') ? 'marcador' : 'outra');
  const outrasAbaixo = {};
  for (const a of outras) if (altura(a) < 44) outrasAbaixo[classeDe(a)] = (outrasAbaixo[classeDe(a)] ?? 0) + 1;
  const resumos = [...document.querySelectorAll('main details > summary')].map(altura);
  /* UMA PORTA FLEXÍVEL COM MAIS DE UM ITEM EM FILA põe as partes do nome lado a lado e perde o espaço entre elas (o
     defeito das portas das séries na primeira corrida, «Dívida públicanos países da União»). As portas dos temas são
     uma coluna de propósito (o nome por cima da linha) e não contam. O conhecido-positivo é uma porta plantada na página
     com dois itens, medida pela mesma função e tirada a seguir. */
  const itensEmFila = (a) => {
    const estilo = getComputedStyle(a);
    if (!/flex/.test(estilo.display) || estilo.flexDirection === 'column') return false;
    return [...a.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())).length > 1;
  };
  const plantada = document.createElement('a');
  plantada.className = 'indice-porta';
  plantada.setAttribute('href', '/');
  plantada.innerHTML = '<span>uma parte</span> e outra';
  document.querySelector('main')?.appendChild(plantada);
  const positivoDosItens = itensEmFila(plantada);
  plantada.remove();
  return {
    portas_com_itens_em_fila: dasListas.filter(itensEmFila).length,
    conhecido_positivo_dos_itens_em_fila: positivoDosItens,
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    seccoes: [...document.querySelectorAll('main [data-indice-seccao]')].map((s) => s.getAttribute('data-indice-seccao')),
    portas: todas.length,
    portas_a_vista: aVista.length,
    portas_dentro_das_gavetas: todas.length - aVista.length,
    portas_das_listas_a_vista: dasListas.length,
    porta_das_listas_mais_baixa_px: dasListas.length ? arredonda(Math.min(...dasListas.map(altura))) : null,
    portas_das_listas_abaixo_de_44: dasListas.filter((a) => altura(a) < 44).length,
    outras_ligacoes_a_vista: outras.length,
    outras_ligacoes_abaixo_de_44_por_classe: outrasAbaixo,
    gavetas: document.querySelectorAll('main details').length,
    gavetas_fechadas: [...document.querySelectorAll('main details')].filter((d) => !d.open).length,
    resumo_mais_baixo_px: resumos.length ? arredonda(Math.min(...resumos)) : null,
    descricao: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
  };
};

const contexto = async (largura) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  return c;
};
const guarda = (bytes, ficheiro, registo) => {
  resultados.push({ ficheiro, ...registo, sha256: createHash('sha256').update(bytes).digest('hex') });
};

try {
  /* AS DUAS PÁGINAS INTEIRAS, NAS CINCO LARGURAS */
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`indice/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + rotas.indice[lang], { waitUntil: 'networkidle' });
    if (resposta?.status() !== 200) problemas.push(`indice/${lang}/${largura}: HTTP ${resposta?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.documento > largura + 1) problemas.push(`indice/${lang}/${largura}: transbordo horizontal (${medidas.documento} px numa janela de ${largura})`);
    if (medidas.gavetas !== medidas.gavetas_fechadas) problemas.push(`indice/${lang}/${largura}: ${medidas.gavetas - medidas.gavetas_fechadas} gaveta(s) chegaram abertas`);
    if (medidas.portas_das_listas_abaixo_de_44) problemas.push(`indice/${lang}/${largura}: ${medidas.portas_das_listas_abaixo_de_44} porta(s) das listas abaixo de 44 px`);
    if (medidas.resumo_mais_baixo_px < 44) problemas.push(`indice/${lang}/${largura}: o resumo de uma gaveta com ${medidas.resumo_mais_baixo_px} px`);
    if (!medidas.conhecido_positivo_dos_itens_em_fila) problemas.push(`indice/${lang}/${largura}: o detetor dos itens em fila não viu a porta plantada`);
    if (medidas.portas_com_itens_em_fila) problemas.push(`indice/${lang}/${largura}: ${medidas.portas_com_itens_em_fila} porta(s) com as partes do nome lado a lado`);
    const ficheiro = `${saida}/depois-indice-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    guarda(bytes, ficheiro, { tipo: 'pagina', rota: rotas.indice[lang], lang, largura, medidas });
    await c.close();
    console.log(`R3: índice, ${lang}, ${largura} px.`);
  }
  /* DE PERTO: a gaveta dos concelhos de Évora, aberta por um toque no resumo, sem guião */
  for (const lang of ['pt', 'en']) for (const largura of [390, 1280]) {
    const c = await contexto(largura);
    const page = await c.newPage();
    await page.goto(origem + rotas.indice[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const gaveta = page.locator('main details[data-gaveta="concelhos-evora"]');
    await gaveta.locator('summary').click();
    await page.mouse.move(0, 0);
    const aberta = await gaveta.evaluate((d) => d.open);
    const concelhos = await gaveta.locator('a[href]').count();
    const porta_mais_baixa_px = await gaveta.evaluate((d) => Math.round(Math.min(...[...d.querySelectorAll('a[href]')].map((a) => a.getBoundingClientRect().height)) * 10) / 10);
    if (!aberta) problemas.push(`gaveta/evora/${lang}/${largura}: não abriu`);
    if (porta_mais_baixa_px < 44) problemas.push(`gaveta/evora/${lang}/${largura}: uma porta de concelho com ${porta_mais_baixa_px} px de altura`);
    const documento = await page.evaluate(() => document.documentElement.scrollWidth);
    if (documento > largura + 1) problemas.push(`gaveta/evora/${lang}/${largura}: transbordo horizontal com a gaveta aberta`);
    const ficheiro = `${saida}/depois-indice-gaveta-evora-${lang}-${largura}.png`;
    const bytes = await gaveta.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'gaveta', distrito: 'evora', lang, largura, aberta, concelhos, porta_mais_baixa_px, documento });
    await c.close();
  }
  /* DE PERTO: o rodapé com a sétima porta, a 390 px */
  for (const lang of ['pt', 'en']) {
    const c = await contexto(390);
    const page = await c.newPage();
    await page.goto(origem + rotas.rodape[lang], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const rodape = page.locator('footer.rodape');
    const portas = await rodape.locator('nav.rodape-nav a[href]').evaluateAll((as) => as.map((a) => [a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').trim()]));
    const ficheiro = `${saida}/depois-rodape-${lang}-390.png`;
    const bytes = await rodape.screenshot({ path: ficheiro });
    guarda(bytes, ficheiro, { tipo: 'rodape', rota: rotas.rodape[lang], lang, largura: 390, portas });
    await c.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'R3', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-r3.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`R3: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
