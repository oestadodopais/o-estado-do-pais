/** UE1: as capturas da faixa da União e dos recibos das séries, nas duas edições e nas cinco larguras.
 *
 * Adaptado do captor do C1. Serve `dist/` por um servidor local efémero, recusa todo o pedido que não
 * seja da origem local, confere que a construção é da cabeça esperada, e guarda, por captura, o
 * resumo sha256 da imagem e as medidas que dizem se a faixa cabe: a caixa do cartão e da faixa, o
 * transbordo, as caixas dos rótulos de Portugal e da União e das pontas, e se algum se sobrepõe a
 * outro ou sai do cartão. Nenhum caminho da máquina entra no manifesto.
 *
 * Uso: node design/especime-v3/medicoes/ue1-2026-09-29/captar-ue1.mjs [pasta de saída] [cabeça esperada]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const pastaRelativa = 'design/especime-v3/medicoes/ue1-2026-09-29';
const saidaRelativa = process.argv[2] ?? 'design/especime-v3/capturas/ue1-2026-09-29';
const saida = path.isAbsolute(saidaRelativa) ? saidaRelativa : path.join(raiz, saidaRelativa);
const git = (...args) => execFileSync('git', args, { cwd: raiz, encoding: 'utf8' }).trim();
const esperado = git('rev-parse', process.argv[3] ?? 'HEAD');
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const cartoes = [
  ['cartao-pobreza', 'risco-de-pobreza-ou-exclusao-2025'],
  ['cartao-habitacao', 'precos-da-habitacao-2025'],
];
const recibos = [
  ['recibo-habitacao', 'precos-da-habitacao-2025-paises'],
  ['recibo-ihpc', 'ihpc-variacao-homologa-paises'],
];
const edicoes = { pt: { temas: '/temas/', serie: '/livro-razao/series/' }, en: { temas: '/en/themes/', serie: '/en/ledger/series/' } };
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

/** As medidas da faixa de um cartão, em coordenadas do documento. */
const MEDIR_CARTAO = (id) => {
  const c = document.querySelector(`#m-${CSS.escape(id)}`);
  const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height, direita: r.right, fundo: r.bottom }; };
  const f = c?.querySelector('[data-faixa-ue]');
  const cc = caixa(c);
  const rot = [...(f?.querySelectorAll('[data-faixa-rotulo], [data-faixa-ponta]') ?? [])].map((e) => ({ nome: e.getAttribute('data-faixa-rotulo') ?? `ponta-${e.getAttribute('data-faixa-ponta')}`, caixa: caixa(e), texto: e.textContent.replace(/\s+/g, ' ').trim() }));
  const sobrepoe = (a, b) => a && b && a.x < b.direita - 0.5 && b.x < a.direita - 0.5 && a.y < b.fundo - 0.5 && b.y < a.fundo - 0.5;
  const pares = [];
  for (let i = 0; i < rot.length; i++) for (let j = i + 1; j < rot.length; j++) if (sobrepoe(rot[i].caixa, rot[j].caixa)) pares.push(`${rot[i].nome}×${rot[j].nome}`);
  const fora = rot.filter((r) => cc && r.caixa && (r.caixa.x < cc.x - 0.5 || r.caixa.direita > cc.direita + 0.5)).map((r) => r.nome);
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    cartao: cc, faixa: caixa(f), frase: f?.querySelector('[data-faixa-frase]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    marcas: f?.querySelectorAll('[data-faixa-marca]').length ?? 0,
    rotulos: rot, sobreposicoes: pares, fora_do_cartao: fora,
    transborda: c ? c.scrollWidth > c.clientWidth + 0.5 : null,
  };
};
const MEDIR_RECIBO = () => ({
  janela: innerWidth, documento: document.documentElement.scrollWidth, corpo: document.body.scrollWidth,
  altura: document.documentElement.scrollHeight,
  h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  linhas_da_tabela: document.querySelectorAll('[data-serie-tabela] tbody tr').length,
  pontos: document.querySelectorAll('[data-serie-tabela] [data-ponto]').length,
  transborda: document.documentElement.scrollWidth > innerWidth + 0.5,
});

const navegador = await chromium.launch();
const resultados = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      await pagina.goto(`${origem}${edicoes[lang].temas}`, { waitUntil: 'networkidle' });
      await pagina.evaluate(() => document.fonts.ready);
      for (const [nome, id] of cartoes) {
        const alvo = pagina.locator(`#m-${id}`);
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'cartao', linha: id, lang, largura, medidas: await pagina.evaluate(MEDIR_CARTAO, id) });
      }
      for (const [nome, id] of recibos) {
        await pagina.goto(`${origem}${edicoes[lang].serie}${id}/`, { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await pagina.screenshot({ path: path.join(saida, ficheiro), fullPage: true });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'recibo', serie: id, lang, largura, medidas: await pagina.evaluate(MEDIR_RECIBO) });
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
  if (m.documento > m.janela + 0.5) p.push('a página transborda na horizontal');
  if (r.tipo === 'cartao') {
    if (m.marcas !== 28) p.push(`a faixa tem ${m.marcas} marcas`);
    if (m.sobreposicoes.length) p.push(`rótulos sobrepostos: ${m.sobreposicoes.join(', ')}`);
    if (m.fora_do_cartao.length) p.push(`rótulos fora do cartão: ${m.fora_do_cartao.join(', ')}`);
    if (m.transborda) p.push('o cartão transborda');
  } else {
    if (m.linhas_da_tabela !== 28 || m.pontos !== 28) p.push(`a tabela tem ${m.linhas_da_tabela} linhas e ${m.pontos} pontos`);
  }
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  bloco: 'UE1', construcao: versao, cabeca_esperada: esperado, larguras, capturas: resultados.length,
  pedidos_recusados_para_fora: recusados.length, problemas, resultados,
};
await fs.writeFile(path.join(raiz, pastaRelativa, 'capturas-ue1.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1 capturas: ${resultados.length} imagens, ${problemas.length} problema(s), ${recusados.length} pedido(s) para fora recusados`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length ? 1 : 0);
