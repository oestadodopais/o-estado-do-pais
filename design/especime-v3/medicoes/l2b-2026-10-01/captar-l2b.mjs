/** L2b: a página de Évora e a de Penedono (um concelho pequeno, com o ganho médio abaixo do de Portugal e quatro
 * cartões sem valor publicado), nas duas edições e nas cinco larguras, depois do bloco; e as mesmas a 390 e a
 * 1 280 px antes dele, a partir de uma construção da cabeça de base. O servidor efémero e o bloqueio dos pedidos de
 * fora seguem o captor do L2a (`design/especime-v3/medicoes/l2a-2026-10-01/captar-l2a.mjs`). O manifesto guarda a
 * cabeça da construção, o resumo de cada imagem e as medidas de cada página: a altura, o transbordo, quantas faixas
 * do concelho a página tem e quantas cabem na largura do seu cartão, e o texto da leitura do lugar.
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs depois
 *     (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 *   node design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs antes <pasta da construção de base> <cabeça de base>
 *     (a pasta fica fora do repositório, e o manifesto não a nomeia: guarda só a cabeça que o `version.json` dela diz)
 *   node design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs l2b-b
 *     (a passagem L2b-b: as mesmas páginas nas cinco larguras sobre `dist/`, com as imagens `l2b-b-*.png` e o
 *     manifesto em `l2b-b/capturas.json`, para não tocar nas capturas do L2b nem no seu manifesto)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const fase = process.argv[2];
if (!['antes', 'depois', 'l2b-b'].includes(fase)) throw new Error('Uso: captar-l2b.mjs antes <dist> <cabeça> | depois | l2b-b');
const dist = path.resolve(fase === 'antes' ? process.argv[3] : 'dist');
const cabeca = fase === 'antes' ? process.argv[4] : execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/l2b-2026-10-01';
const saida = 'design/especime-v3/capturas/l2b-2026-10-01';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (!cabeca || versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça pedida (${cabeca}).`);
const larguras = fase === 'antes' ? [390, 1280] : [390, 768, 1024, 1280, 1600];
const paginas = [
  { id: 'evora', rota: { pt: '/municipios/evora/', en: '/en/municipalities/evora/' } },
  { id: 'penedono', rota: { pt: '/municipios/penedono/', en: '/en/municipalities/penedono/' } },
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
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const resultados = [];
const problemas = [];
const pedidosRecusados = [];
const inicio = new Date().toISOString();

/** As medidas que o relatório cita, lidas no navegador. */
const medir = () => {
  const faixas = [...document.querySelectorAll('[data-faixa-concelho]')];
  /* UMA FAIXA CABE QUANDO NÃO PASSA DA CAIXA DO SEU CARTÃO: o desenho, as frases e os rótulos das pontas. */
  const cabe = faixas.filter((f) => {
    const c = f.closest('[data-cartao-medida]').getBoundingClientRect();
    return [...f.querySelectorAll('*')].every((e) => {
      const r = e.getBoundingClientRect();
      return r.width === 0 || (r.left >= c.left - 1 && r.right <= c.right + 1);
    });
  }).length;
  const leitura = document.querySelector('.lugar-leitura');
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.trim() ?? null,
    cartoes: document.querySelectorAll('[data-cartao-medida]').length,
    faixas: faixas.length,
    /* L2b-b: as faixas nas quatro contagens, que não as têm. */
    faixas_em_contagens: document.querySelectorAll('[data-medida-chave="populacao"] [data-faixa-concelho], [data-medida-chave="desempregoRegistado"] [data-faixa-concelho], [data-medida-chave="empresas"] [data-faixa-concelho], [data-medida-chave="divida"] [data-faixa-concelho]').length,
    faixas_que_cabem_no_cartao: cabe,
    primeira_faixa_y: faixas[0] ? Math.round(faixas[0].getBoundingClientRect().y + scrollY) : null,
    leitura: leitura ? leitura.textContent.replace(/\s+/g, ' ').trim() : null,
  };
};

try {
  for (const lang of ['pt', 'en']) for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', (rota) => rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort()));
    const page = await contexto.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    for (const p of paginas) {
      const resposta = await page.goto(origem + p.rota[lang], { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) problemas.push(`${p.id}/${lang}/${largura}: HTTP ${resposta.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const medidas = await page.evaluate(medir);
      if (medidas.documento > largura + 1) problemas.push(`${p.id}/${lang}/${largura}: transbordo horizontal`);
      if (fase !== 'antes' && medidas.faixas_que_cabem_no_cartao !== medidas.faixas) problemas.push(`${p.id}/${lang}/${largura}: ${medidas.faixas - medidas.faixas_que_cabem_no_cartao} faixa(s) a sair do cartão`);
      const ficheiro = `${saida}/${fase}-${p.id}-${lang}-${largura}.png`;
      const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      resultados.push({ ficheiro, pagina: p.id, rota: p.rota[lang], lang, largura, sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    }
    await contexto.close();
    console.log(`L2b ${fase}: ${lang}, ${largura} px.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'L2b', fase, cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(fase === 'l2b-b' ? `${pasta}/l2b-b/capturas.json` : `${pasta}/capturas-${fase}.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`L2b ${fase}: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
