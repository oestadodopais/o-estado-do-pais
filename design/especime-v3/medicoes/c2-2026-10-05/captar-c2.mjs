/** C2 (05.10.2026): as capturas do bloco, nas cinco larguras da casa (390, 768, 1 024, 1 280 e 1 600 px) e nas duas
 * edições.
 *
 * O brief pede os recibos de duas linhas e a primeira página. Os dois recibos são o do PIB real por habitante de 2025
 * (a linha de um cartão, que conserva a marca «p») e o do custo unitário do trabalho de 2024 (uma linha do período
 * anterior, que perdeu a marca e tinha já a cadeia do excerto). A primeira página não rende o valor de nenhuma das nove
 * linhas: nomeia uma, a posição de investimento internacional, entre as medidas fora do valor de referência no veredicto,
 * e a captura mede a frase do veredicto; ao lado capta-se a página de «Estado e economia», que é onde os três cartões das
 * nove linhas e as suas réguas se leem.
 *
 * `antes` capta a construção da base (o `astro build` de uma exportação do commit da base, sem `version.json`, por isso
 * o commit passa-se como argumento e escreve-se no manifesto) e não tem critério de aceitação: os defeitos ficam como
 * observações. `depois` capta o `dist/` da cabeça do código, confere `version.json` contra a cabeça esperada, e fecha
 * com 1 se uma página transbordar, se o título de um recibo não tiver o valor novo da linha, se a releitura divergente
 * de 05.10 não abrir a atualização, ou se a página ainda disser que usa outro valor.
 *
 * Adaptado do captor do RP3. Serve a construção por um servidor local efémero, recusa todo o pedido que não seja da
 * origem local e guarda, por captura, o sha256 da imagem e as medidas. Nenhum caminho da máquina entra no manifesto.
 *
 * Uso (da raiz do sítio):
 *   node design/especime-v3/medicoes/c2-2026-10-05/captar-c2.mjs antes <dist da base> <commit da base>
 *   node design/especime-v3/medicoes/c2-2026-10-05/captar-c2.mjs depois dist <cabeça esperada>
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { chromium } from 'playwright';

const [modo, distArg, commitArg] = process.argv.slice(2);
if (!['antes', 'depois'].includes(modo) || !distArg || !commitArg) throw new Error('uso: captar-c2.mjs antes|depois <dist> <commit>');
const raiz = process.cwd();
const dist = path.resolve(distArg);
const pastaRelativa = 'design/especime-v3/medicoes/c2-2026-10-05';
const saidaRelativa = 'design/especime-v3/capturas/c2-2026-10-05';
const saida = path.join(raiz, saidaRelativa);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const commit = git('rev-parse', commitArg);
let versao = null;
if (modo === 'depois') {
  versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
  if (versao.commit !== commit) throw new Error(`A construção declara ${versao.commit}; esperava ${commit}.`);
}
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const RECIBOS = ['pib-real-per-capita-2025', 'custo-unitario-do-trabalho-2024'];
/* O que cada recibo tem de mostrar depois: o valor da linha no título, lido do livro da cabeça (e não escrito aqui). */
const linhas = {};
for (const id of RECIBOS) {
  const texto = modo === 'depois'
    ? await fs.readFile(path.join(raiz, 'ledger', 'claims', `${id}.yml`), 'utf8')
    : git('show', `${commit}:ledger/claims/${id}.yml`);
  const c = load(texto);
  linhas[id] = { valor: c.value, atualizacoes: (c.corrections ?? []).filter((x) => x.kind === 'atualizacao').length };
}
const paginas = [
  ...RECIBOS.map((id) => ({ nome: `recibo-${id}`, tipo: 'recibo', id, pt: `/livro-razao/${id}/`, en: `/en/ledger/${id}/` })),
  { nome: 'primeira-pagina', tipo: 'primeira', pt: '/', en: '/en/' },
  { nome: 'estado-e-economia', tipo: 'entrada', pt: '/estado-e-economia/', en: '/en/state-and-economy/' },
];
const CARTOES = ['pib-real-per-capita-2025', 'formacao-bruta-de-capital-fixo-2025', 'posicao-de-investimento-internacional-2025'];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.xml': 'application/xml' };
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

/** As medidas de uma página, no navegador. */
const MEDIR = ({ tipo, cartoes }) => {
  const limpo = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : null);
  const m = {
    janela: innerWidth, documento: document.documentElement.scrollWidth, altura: document.documentElement.scrollHeight,
    h1: limpo(document.querySelector('h1')), transborda: document.documentElement.scrollWidth > innerWidth + 0.5,
  };
  if (tipo === 'recibo') {
    m.valor_no_titulo = limpo(document.querySelector('h1.linha-valor [data-claim]'));
    m.historico = document.querySelectorAll('.historico-entrada').length;
    m.releituras = [...document.querySelectorAll('[data-linha-verificacao]')].map((e) => ({
      n: Number(e.getAttribute('data-linha-verificacao')), texto: limpo(e),
      porta_da_atualizacao: e.querySelector('[data-atualizacao-da-releitura]')?.getAttribute('href') ?? null,
    }));
    m.portas_da_atualizacao_com_destino = m.releituras.filter((r) => r.porta_da_atualizacao && document.querySelector(r.porta_da_atualizacao)).length;
    m.valor_em_uso = document.querySelectorAll('[data-valor-em-uso]').length;
  }
  if (tipo === 'primeira') {
    m.veredicto_fora = limpo(document.querySelector('[data-veredicto-medidas]'));
    m.veredicto_medidas = [...document.querySelectorAll('[data-veredicto-medida]')].map((e) => e.getAttribute('data-veredicto-medida'));
  }
  if (tipo === 'entrada') {
    m.cartoes = Object.fromEntries(cartoes.map((id) => {
      const c = document.querySelector(`[data-cartao-medida="${id}"]`);
      return [id, c ? { valor: limpo(c.querySelector(`.cartao-medida-quantidade [data-claim="${id}"]`)),
        regua: [...c.querySelectorAll('[data-regua] [data-claim]')].map((x) => `${x.getAttribute('data-claim')}=${limpo(x)}`) } : null];
    }));
  }
  return m;
};

const navegador = await chromium.launch();
const resultados = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      for (const p of paginas) {
        const resposta = await pagina.goto(`${origem}${p[lang]}`, { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        const ficheiro = `${modo}-${p.nome}-${lang}-${largura}.png`;
        const bytes = await pagina.screenshot({ path: path.join(saida, ficheiro), fullPage: true });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), pagina: p.nome, lang, largura,
          http: resposta?.status() ?? null, medidas: await pagina.evaluate(MEDIR, { tipo: p.tipo, cartoes: CARTOES }) });
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
  const p = [];
  if (r.http !== 200) p.push(`a página respondeu ${r.http}`);
  if (m.transborda) p.push('a página transborda na horizontal');
  const id = r.pagina.replace(/^recibo-/, '');
  if (r.pagina.startsWith('recibo-')) {
    if (m.valor_no_titulo !== linhas[id].valor.replace(/ /g, ' ').replace(/\s+/g, ' ')) p.push(`o título diz ${m.valor_no_titulo} e a linha ${linhas[id].valor}`);
    if (modo === 'depois') {
      if (!m.releituras.some((x) => x.porta_da_atualizacao)) p.push('a releitura divergente não abre a atualização');
      if (m.portas_da_atualizacao_com_destino !== m.releituras.filter((x) => x.porta_da_atualizacao).length) p.push('uma porta da atualização não tem destino');
      if (m.valor_em_uso !== 0) p.push('a página ainda diz que usa um valor diferente do que a fonte publica');
    }
  }
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  _: 'Escrito por design/especime-v3/medicoes/c2-2026-10-05/captar-c2.mjs. Não se edita à mão.',
  bloco: 'C2', modo, commit, construcao: versao, larguras, paginas: paginas.map(({ nome, pt, en }) => ({ nome, pt, en })),
  linhas_dos_recibos: linhas, capturas: resultados.length, pedidos_recusados_para_fora: recusados.length,
  problemas, criterio: modo === 'depois' ? 'fecha com 1' : 'observações, sem critério', resultados,
};
await fs.writeFile(path.join(raiz, pastaRelativa, `capturas-${modo}.json`), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`C2 capturas ${modo}: ${resultados.length} imagens, ${problemas.length} problema(s), ${recusados.length} pedido(s) para fora recusados`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(modo === 'depois' && problemas.length ? 1 : 0);
