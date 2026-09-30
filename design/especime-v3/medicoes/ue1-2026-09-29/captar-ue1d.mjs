/** UE1d: as capturas da passagem da §1.140 e das definições, nas duas edições e nas cinco larguras.
 *
 * Adaptado de `captar-ue1c.mjs`. Serve `dist/` por um servidor local efémero, recusa todo o pedido que não
 * seja da origem local e confere que a construção é da cabeça. Captura, em cada edição e largura:
 *   · o cartão da sobrecarga do custo da habitação no total onde ele aparece (a página dos temas, a da
 *     entrada da casa e a da área das infraestruturas e da habitação), com a União na régua e a ressalva;
 *   · o bloco «O enquadramento» do recibo da linha dessa medida, com a União e a ressalva;
 *   · a cabeça do recibo de cada uma das dez séries, com a definição declarada (e a ressalva, na da
 *     sobrecarga no total).
 * E mede: no cartão e nos recibos da sobrecarga, se a União aparece e se a ressalva está, com o texto da
 * fonte única; nas cabeças das séries, se a definição está; e, em todas, o transbordo da página.
 *
 * O CONHECIDO-POSITIVO corre antes, na largura mais estreita de cada edição: a ressalva tirada do cartão, a
 * definição tirada de um recibo e um elemento mais largo do que a janela têm de ser vistos pelo mesmo
 * detetor.
 *
 * Uso: node design/especime-v3/medicoes/ue1-2026-09-29/captar-ue1d.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { RESSALVAS_DA_UNIAO } from '../../../../src/data/ressalvas-da-uniao.mjs';

const raiz = process.cwd();
const dist = path.resolve('dist');
const pastaRelativa = 'design/especime-v3/medicoes/ue1-2026-09-29';
const saidaRelativa = 'design/especime-v3/capturas/ue1-2026-09-29/ue1d';
const saida = path.join(raiz, saidaRelativa);
const esperado = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const ID = 'sobrecarga-do-custo-da-habitacao-2025';
const paginasDoCartao = {
  pt: [['temas', '/temas/'], ['casa', '/a-minha-casa/'], ['area', '/areas/infraestruturas-e-habitacao/']],
  en: [['temas', '/en/themes/'], ['casa', '/en/my-home/'], ['area', '/en/areas/infraestruturas-e-habitacao/']],
};
const recibos = { pt: { linha: '/livro-razao/', serie: '/livro-razao/series/' }, en: { linha: '/en/ledger/', serie: '/en/ledger/series/' } };
const series = (await fs.readdir(path.join(dist, 'livro-razao', 'series'))).filter((x) => !x.startsWith('.')).sort();
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

/** No cartão da sobrecarga, ou num recibo: a União à vista, e a ressalva. */
const MEDIR_RESSALVA = ([seletor, id]) => {
  const onde = document.querySelector(seletor);
  const texto = (e) => (e ? e.textContent.replace(/\s+/g, ' ').trim() : null);
  const uniao = onde ? onde.querySelectorAll('[data-regua="ue"], [data-faixa-ue], [data-claim$="-ue"], [data-serie-tabela]').length > 0 : false;
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    existe: Boolean(onde), mostra_uniao: uniao,
    ressalva: texto(onde?.querySelector(`[data-ressalva-da-uniao="${id}"]`) ?? null),
  };
};
/** Na cabeça do recibo de uma série: a definição declarada. */
const MEDIR_DEFINICAO = () => {
  const d = document.querySelector('[data-serie-o-que-conta]');
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    definicao: d ? d.textContent.replace(/\s+/g, ' ').trim() : null,
    ressalva: document.querySelector('[data-ressalva-da-uniao]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  };
};

const navegador = await chromium.launch();
const resultados = [];
const plantas = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    const ressalvaEsperada = RESSALVAS_DA_UNIAO[ID][lang];
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      const carrega = async (url) => { await pagina.goto(`${origem}${url}`, { waitUntil: 'networkidle' }); await pagina.evaluate(() => document.fonts.ready); };
      const seletorDoCartao = `[data-cartao-medida="${ID}"]`;
      if (largura === larguras[0]) {
        await carrega(paginasDoCartao[lang][0][1]);
        await pagina.evaluate(([s, id]) => document.querySelector(`${s} [data-ressalva-da-uniao="${id}"]`)?.remove(), [seletorDoCartao, ID]);
        const m1 = await pagina.evaluate(MEDIR_RESSALVA, [seletorDoCartao, ID]);
        plantas.push({ lang, largura, nome: 'a ressalva tirada do cartão', visto: m1.mostra_uniao && m1.ressalva === null });
        await carrega(`${recibos[lang].serie}divida-publica-2025-paises/`);
        await pagina.evaluate(() => document.querySelector('[data-serie-o-que-conta]')?.remove());
        const m2 = await pagina.evaluate(MEDIR_DEFINICAO);
        plantas.push({ lang, largura, nome: 'a definição tirada de um recibo', visto: m2.definicao === null });
        await carrega(`${recibos[lang].linha}${ID}/`);
        await pagina.evaluate(() => { const d = document.createElement('div'); Object.assign(d.style, { width: `${innerWidth + 200}px`, height: '1px' }); document.body.appendChild(d); });
        const m3 = await pagina.evaluate(MEDIR_RESSALVA, ['#enquadramento', ID]);
        plantas.push({ lang, largura, nome: 'um elemento mais largo do que a janela', visto: m3.documento > m3.janela + 0.5 });
      }
      for (const [nome, url] of paginasDoCartao[lang]) {
        await carrega(url);
        const alvo = pagina.locator(seletorDoCartao).first();
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `cartao-sobrecarga-${nome}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'cartao', pagina: url, lang, largura, ressalva_esperada: ressalvaEsperada, medidas: await pagina.evaluate(MEDIR_RESSALVA, [seletorDoCartao, ID]) });
      }
      await carrega(`${recibos[lang].linha}${ID}/`);
      {
        const alvo = pagina.locator('#enquadramento');
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `recibo-da-linha-sobrecarga-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'recibo-da-linha', lang, largura, ressalva_esperada: ressalvaEsperada, medidas: await pagina.evaluate(MEDIR_RESSALVA, ['#enquadramento', ID]) });
      }
      for (const s of series) {
        await carrega(`${recibos[lang].serie}${s}/`);
        const alvo = pagina.locator('.serie-cabeca');
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${s}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'cabeca-da-serie', serie: s, lang, largura, ressalva_esperada: s === `${ID}-paises` ? ressalvaEsperada : null, medidas: await pagina.evaluate(MEDIR_DEFINICAO) });
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
  if (r.tipo === 'cartao' || r.tipo === 'recibo-da-linha') {
    if (!m.mostra_uniao) p.push('a União não aparece');
    if (m.ressalva !== r.ressalva_esperada) p.push(`a ressalva é «${m.ressalva}»`);
  } else {
    if (!m.definicao) p.push('o recibo não tem a definição');
    if ((m.ressalva ?? null) !== r.ressalva_esperada) p.push(`a ressalva do recibo é «${m.ressalva}» e esperava-se «${r.ressalva_esperada}»`);
  }
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  bloco: 'UE1d', construcao: versao, cabeca_esperada: esperado, larguras,
  capturas: resultados.length,
  capturas_por_tipo: Object.fromEntries(['cartao', 'recibo-da-linha', 'cabeca-da-serie'].map((t) => [t, resultados.filter((r) => r.tipo === t).length])),
  plantas, plantas_vistas: plantas.filter((p) => p.visto).length,
  pedidos_recusados_para_fora: recusados.length, problemas, resultados,
};
await fs.writeFile(path.join(raiz, pastaRelativa, 'capturas-ue1d.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1d capturas: ${resultados.length} imagens, ${problemas.length} problema(s), plantas vistas ${manifesto.plantas_vistas} de ${plantas.length}, ${recusados.length} pedido(s) para fora`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length || manifesto.plantas_vistas !== plantas.length ? 1 : 0);
