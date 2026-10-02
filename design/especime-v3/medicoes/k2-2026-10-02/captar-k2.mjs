/** K2: as capturas do bloco «o cartão para o telemóvel». Uma página de assunto (o emprego), a página da União, a ficha
 * de Évora e o índice dos estudos, nas duas edições; nas cinco larguras depois do bloco, e a 390 e a 1 280 px antes
 * dele, a partir de uma construção da cabeça de base. O servidor efémero e o bloqueio dos pedidos de fora seguem o
 * captor do L2b (`design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs`). O manifesto guarda a cabeça da
 * construção, o resumo de cada imagem e as medidas de cada página: a altura, o transbordo, e, para cada cartão, as
 * peças pela ordem do documento e pela ordem em que se veem (de cima para baixo), e se a definição está dobrada.
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/k2-2026-10-02/captar-k2.mjs depois
 *     (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 *   node design/especime-v3/medicoes/k2-2026-10-02/captar-k2.mjs antes <pasta da construção de base> <cabeça de base>
 *     (a pasta fica fora do repositório, e o manifesto não a nomeia: guarda só a cabeça que o `version.json` dela diz)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const fase = process.argv[2];
if (!['antes', 'depois'].includes(fase)) throw new Error('Uso: captar-k2.mjs antes <dist> <cabeça> | depois');
const dist = path.resolve(fase === 'antes' ? process.argv[3] : 'dist');
const cabeca = fase === 'antes' ? process.argv[4] : execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/k2-2026-10-02';
const saida = 'design/especime-v3/capturas/k2-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (!cabeca || versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça pedida (${cabeca}).`);
const larguras = fase === 'antes' ? [390, 1280] : [390, 768, 1024, 1280, 1600];
const paginas = [
  { id: 'emprego', rota: { pt: '/emprego/', en: '/en/employment/' } },
  { id: 'uniao', rota: { pt: '/uniao-europeia/', en: '/en/european-union/' } },
  { id: 'evora', rota: { pt: '/municipios/evora/', en: '/en/municipalities/evora/' } },
  { id: 'estudos', rota: { pt: '/estudos/', en: '/en/studies/' } },
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

/** As medidas que o relatório cita, lidas no navegador: a ordem das peças de cada cartão, no documento e no ecrã. */
const medir = () => {
  /* AS PEÇAS DE UM CARTÃO, pelo nome que o relatório lhes dá. Uma peça que não seja nenhuma destas fica com a classe. */
  const nomeDaPeca = (el) => {
    const c = el.classList;
    if (c.contains('cartao-medida-nome') || c.contains('cartao-nome')) return 'nome';
    if (c.contains('cartao-medida-valor') || c.contains('cartao-valor') || c.contains('claim-com-chip')) return 'valor';
    if (c.contains('cartao-unidade')) return 'unidade';
    if (c.contains('cartao-medida-leitura')) return el.getAttribute('data-leitura-parte') === 'o-que-e' ? 'leitura-o-que-e' : 'leitura';
    if (c.contains('cartao-medida-regua') || c.contains('cartao-topo')) return 'comparacao';
    if (c.contains('cartao-medida-faixa') || c.contains('cartao-medida-faixa-concelho')) return 'faixa';
    if (c.contains('cartao-medida-ressalva')) return 'ressalva';
    if (c.contains('cartao-medida-frase')) return 'definicao';
    if (c.contains('cartao-medida-dobra')) return 'dobra';
    if (c.contains('cartao-porta')) return null;
    if (c.contains('src-chip')) return 'selo';
    return el.className || el.tagName.toLowerCase();
  };
  const cartoes = [...document.querySelectorAll('article.cartao-medida, [data-faixa] li.cartao')].map((cartao) => {
    const filhos = [...cartao.children].flatMap((f) => (getComputedStyle(f).display === 'contents' ? [...f.children] : [f]));
    const pecas = filhos.map((f) => ({ peca: nomeDaPeca(f), y: Math.round(f.getBoundingClientRect().y), altura: Math.round(f.getBoundingClientRect().height) }))
      .filter((p) => p.peca && p.altura > 0);
    const dobra = cartao.querySelector('details.cartao-medida-dobra');
    return {
      id: cartao.getAttribute('data-cartao-medida') ?? cartao.getAttribute('data-cartao') ?? (cartao.hasAttribute('data-cartao-camaras') ? 'camaras' : null),
      documento: pecas.map((p) => p.peca),
      ecra: [...pecas].sort((a, b) => a.y - b.y).map((p) => p.peca),
      definicao_dobrada: Boolean(dobra && !dobra.open),
      resumo_da_dobra: dobra?.querySelector('summary')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      definicao_fora_da_dobra: [...cartao.querySelectorAll('[data-cartao-definicao], [data-leitura-parte="o-que-e"]')].some((d) => !d.closest('details.cartao-medida-dobra')),
      altura: Math.round(cartao.getBoundingClientRect().height),
    };
  });
  /* A FAIXA DA PÁGINA DA UNIÃO: as alturas distintas a que fica o valor de cada cartão, relativas ao topo do cartão
     (a §1.108: os números não saltam de cartão para cartão). Uma só altura quer dizer valores alinhados. */
  const relativa = (seletor) => [...document.querySelectorAll('[data-faixa] li.cartao')].map((c) => {
    const v = c.querySelector(seletor);
    return v ? Math.round(v.getBoundingClientRect().top - c.getBoundingClientRect().top) : null;
  }).filter((x) => x !== null);
  const faixa = relativa('.cartao-valor');
  /* O conhecido-positivo do mesmo detetor: o topo da primeira linha do texto de cada nome, que muda com o número de
     linhas do nome (a caixa do nome tem a mesma altura em todos os cartões, e o texto encosta-se ao fundo dela). */
  const topos = [...document.querySelectorAll('[data-faixa] li.cartao')].map((c) => {
    const n = c.querySelector('.cartao-nome');
    if (!n) return null;
    const r = document.createRange();
    r.selectNodeContents(n);
    const primeira = r.getClientRects()[0];
    return primeira ? Math.round(primeira.top - c.getBoundingClientRect().top) : null;
  }).filter((x) => x !== null);
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    cartoes,
    alturas_do_valor_na_faixa: [...new Set(faixa)],
    alturas_do_topo_do_nome_na_faixa: [...new Set(topos)],
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
      const ficheiro = `${saida}/${fase}-${p.id}-${lang}-${largura}.png`;
      const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      resultados.push({ ficheiro, pagina: p.id, rota: p.rota[lang], lang, largura, sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    }
    await contexto.close();
    console.log(`K2 ${fase}: ${lang}, ${largura} px.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'K2', fase, cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-${fase}.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`K2 ${fase}: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
