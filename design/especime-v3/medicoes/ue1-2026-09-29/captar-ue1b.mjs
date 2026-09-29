/** UE1b: as capturas dos cartões e dos recibos que a passagem de correção mudou, nas duas edições e nas cinco larguras.
 *
 * Adaptado de `captar-ue1.mjs`. Serve `dist/` por um servidor local efémero, recusa todo o pedido que não
 * seja da origem local e confere que a construção é da cabeça. Captura, em cada edição e largura:
 *   · três cartões da página dos temas: os preços da habitação (a ressalva «p» na ponta mais alta e, na
 *     edição inglesa, o «2nd»), a taxa de desemprego (a ressalva «d») e a pobreza ou exclusão (o «15th»
 *     com o empate);
 *   · a secção dos pontos de dois recibos de série, com a legenda das marcas ao lado da tabela: os preços
 *     da habitação («ep» e «p») e o desemprego de longa duração («d» e «u»);
 *   · o bloco «O enquadramento» de dois recibos de linhas portuguesas, com a porta para a série: os
 *     preços da habitação e a pobreza ou exclusão.
 * E mede o que diz se cabe: nos cartões, as caixas dos rótulos da faixa e se algum se sobrepõe a outro ou
 * sai do cartão; nos recibos das séries, se a legenda fica ao lado da tabela (a partir dos 768 px) ou por
 * baixo dela, sem se sobrepor; nos recibos das linhas, a porta; e, em todas, o transbordo da página.
 *
 * O CONHECIDO-POSITIVO corre antes, na largura mais estreita de cada edição: o rótulo de Portugal no lugar
 * do da União, a legenda posta por cima da tabela e um elemento mais largo do que a janela têm de ser
 * vistos pelo mesmo detetor. Cada elemento plantado leva `transition: none` (a razão está em
 * `faixas-ue1.mjs`). Nenhum caminho da máquina entra no manifesto.
 *
 * Uso: node design/especime-v3/medicoes/ue1-2026-09-29/captar-ue1b.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.resolve('dist');
const pastaRelativa = 'design/especime-v3/medicoes/ue1-2026-09-29';
const saidaRelativa = 'design/especime-v3/capturas/ue1-2026-09-29/ue1b';
const saida = path.join(raiz, saidaRelativa);
const esperado = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const larguras = [390, 768, 1024, 1280, 1600];
const cartoes = [
  ['cartao-habitacao', 'precos-da-habitacao-2025'],
  ['cartao-desemprego', 'taxa-de-desemprego-mip-2025'],
  ['cartao-pobreza', 'risco-de-pobreza-ou-exclusao-2025'],
];
const recibosDeSerie = [
  ['serie-habitacao', 'precos-da-habitacao-2025-paises'],
  ['serie-longa-duracao', 'desemprego-de-longa-duracao-2025-paises'],
];
const recibosDeLinha = [
  ['linha-habitacao', 'precos-da-habitacao-2025'],
  ['linha-pobreza', 'risco-de-pobreza-ou-exclusao-2025'],
];
const edicoes = {
  pt: { temas: '/temas/', serie: '/livro-razao/series/', linha: '/livro-razao/' },
  en: { temas: '/en/themes/', serie: '/en/ledger/series/', linha: '/en/ledger/' },
};
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

/** As medidas da faixa de um cartão (as de `captar-ue1.mjs`, mais a ressalva e a frase). */
const MEDIR_CARTAO = (id) => {
  const c = document.querySelector(`#m-${CSS.escape(id)}`);
  const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height, direita: r.right, fundo: r.bottom }; };
  const f = c?.querySelector('[data-faixa-ue]');
  const cc = caixa(c);
  const rot = [...(f?.querySelectorAll('[data-faixa-rotulo], [data-faixa-ponta]') ?? [])].map((e) => ({ nome: e.getAttribute('data-faixa-rotulo') ?? `ponta-${e.getAttribute('data-faixa-ponta')}`, caixa: caixa(e) }));
  const sobrepoe = (a, b) => a && b && a.x < b.direita - 0.5 && b.x < a.direita - 0.5 && a.y < b.fundo - 0.5 && b.y < a.fundo - 0.5;
  const pares = [];
  for (let i = 0; i < rot.length; i++) for (let j = i + 1; j < rot.length; j++) if (sobrepoe(rot[i].caixa, rot[j].caixa)) pares.push(`${rot[i].nome}×${rot[j].nome}`);
  const fora = rot.filter((r) => cc && r.caixa && (r.caixa.x < cc.x - 0.5 || r.caixa.direita > cc.direita + 0.5)).map((r) => r.nome);
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    cartao: cc, faixa: caixa(f), marcas: f?.querySelectorAll('[data-faixa-marca]').length ?? 0,
    pontas: f?.querySelector('.faixa-ue-pontas')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    ressalvas: [...(f?.querySelectorAll('[data-faixa-ressalva]') ?? [])].map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
    frase: f?.querySelector('[data-faixa-frase]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    sobreposicoes: pares, fora_do_cartao: fora, transborda: c ? c.scrollWidth > c.clientWidth + 0.5 : null,
  };
};
/** As medidas da secção dos pontos de um recibo de série: a tabela, a legenda e a relação entre as duas. */
const MEDIR_SERIE = () => {
  const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height, direita: r.right, fundo: r.bottom }; };
  const t = caixa(document.querySelector('[data-serie-tabela]'));
  const l = caixa(document.querySelector('[data-serie-marcas]'));
  const sobrepoe = t && l && t.x < l.direita - 0.5 && l.x < t.direita - 0.5 && t.y < l.fundo - 0.5 && l.y < t.fundo - 0.5;
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth, tabela: t, legenda: l,
    ao_lado: Boolean(t && l && l.x >= t.direita - 0.5), por_baixo: Boolean(t && l && l.y >= t.fundo - 0.5),
    sobreposta: Boolean(sobrepoe),
    entradas: [...document.querySelectorAll('[data-serie-marcas] .serie-marca-entrada')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
    linhas_da_tabela: document.querySelectorAll('[data-serie-tabela] tbody tr').length,
  };
};
/** As medidas do bloco «O enquadramento» de um recibo de linha: a porta para a série. */
const MEDIR_LINHA = () => {
  const bloco = document.querySelector('#enquadramento');
  const porta = bloco?.querySelector('[data-porta-da-serie]');
  const r = porta?.getBoundingClientRect();
  return {
    janela: innerWidth, documento: document.documentElement.scrollWidth,
    enquadramento: bloco?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    porta: porta ? { texto: porta.textContent.trim(), href: porta.getAttribute('href'), serie: porta.getAttribute('data-porta-da-serie'), visivel: Boolean(r && r.width > 0 && r.height > 0) } : null,
  };
};

const navegador = await chromium.launch();
const resultados = [];
const plantas = [];
const recusados = [];
try {
  for (const lang of ['pt', 'en']) {
    for (const largura of larguras) {
      const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await contexto.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (recusados.push(rota.request().url()), rota.abort())));
      const pagina = await contexto.newPage();
      const carrega = async (url) => { await pagina.goto(`${origem}${url}`, { waitUntil: 'networkidle' }); await pagina.evaluate(() => document.fonts.ready); };
      if (largura === larguras[0]) {
        /* O conhecido-positivo dos três detetores. */
        await carrega(edicoes[lang].temas);
        await pagina.locator(`#m-${cartoes[0][1]}`).scrollIntoViewIfNeeded();
        await pagina.evaluate((id) => {
          const f = document.querySelector(`#m-${CSS.escape(id)} [data-faixa-ue]`);
          const pt = f.querySelector('[data-faixa-rotulo="portugal"]');
          const ue = f.querySelector('[data-faixa-rotulo="uniao"]');
          pt.style.transition = 'none';
          pt.className = ue.className;
          pt.setAttribute('data-ancora', ue.getAttribute('data-ancora') ?? '');
          pt.style.left = ue.style.left;
        }, cartoes[0][1]);
        const m1 = await pagina.evaluate(MEDIR_CARTAO, cartoes[0][1]);
        plantas.push({ lang, largura, nome: 'o rótulo de Portugal no lugar do da União', visto: m1.sobreposicoes.some((p) => p.includes('portugal') && p.includes('uniao')) });
        await carrega(`${edicoes[lang].serie}${recibosDeSerie[0][1]}/`);
        await pagina.evaluate(() => {
          const t = document.querySelector('[data-serie-tabela]').getBoundingClientRect();
          const l = document.querySelector('[data-serie-marcas]');
          const r = l.getBoundingClientRect();
          l.style.transition = 'none';
          l.style.position = 'relative';
          l.style.top = `${t.y - r.y + 10}px`;
          l.style.left = `${t.x - r.x + 10}px`;
        });
        const m2 = await pagina.evaluate(MEDIR_SERIE);
        plantas.push({ lang, largura, nome: 'a legenda por cima da tabela', visto: m2.sobreposta });
        await carrega(`${edicoes[lang].linha}${recibosDeLinha[0][1]}/`);
        await pagina.evaluate(() => {
          const d = document.createElement('div');
          Object.assign(d.style, { width: `${innerWidth + 200}px`, height: '1px' });
          document.body.appendChild(d);
        });
        const m3 = await pagina.evaluate(MEDIR_LINHA);
        plantas.push({ lang, largura, nome: 'um elemento mais largo do que a janela', visto: m3.documento > m3.janela + 0.5 });
      }
      await carrega(edicoes[lang].temas);
      for (const [nome, id] of cartoes) {
        const alvo = pagina.locator(`#m-${id}`);
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'cartao', linha: id, lang, largura, medidas: await pagina.evaluate(MEDIR_CARTAO, id) });
      }
      for (const [nome, id] of recibosDeSerie) {
        await carrega(`${edicoes[lang].serie}${id}/`);
        const alvo = pagina.locator('section.serie-pontos');
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'recibo-de-serie', serie: id, lang, largura, medidas: await pagina.evaluate(MEDIR_SERIE) });
      }
      for (const [nome, id] of recibosDeLinha) {
        await carrega(`${edicoes[lang].linha}${id}/`);
        const alvo = pagina.locator('#enquadramento');
        await alvo.scrollIntoViewIfNeeded();
        const ficheiro = `${nome}-${lang}-${largura}.png`;
        const bytes = await alvo.screenshot({ path: path.join(saida, ficheiro) });
        resultados.push({ ficheiro: `${saidaRelativa}/${ficheiro}`, sha256: sha(bytes), tipo: 'recibo-de-linha', linha: id, lang, largura, medidas: await pagina.evaluate(MEDIR_LINHA) });
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
  } else if (r.tipo === 'recibo-de-serie') {
    if (!m.legenda) p.push('o recibo não tem legenda das marcas');
    if (m.sobreposta) p.push('a legenda sobrepõe-se à tabela');
    if (r.largura >= 768 && !m.ao_lado) p.push('a legenda não está ao lado da tabela');
    if (r.largura < 768 && !m.por_baixo) p.push('a legenda não está por baixo da tabela');
    if (m.linhas_da_tabela !== 28) p.push(`a tabela tem ${m.linhas_da_tabela} linhas`);
  } else {
    if (!m.porta || !m.porta.visivel) p.push('o enquadramento não tem a porta para a série à vista');
  }
  return p.map((x) => `${r.ficheiro}: ${x}`);
});
const manifesto = {
  bloco: 'UE1b', construcao: versao, cabeca_esperada: esperado, larguras,
  capturas: resultados.length,
  capturas_por_tipo: Object.fromEntries(['cartao', 'recibo-de-serie', 'recibo-de-linha'].map((t) => [t, resultados.filter((r) => r.tipo === t).length])),
  plantas, plantas_vistas: plantas.filter((p) => p.visto).length,
  pedidos_recusados_para_fora: recusados.length, problemas, resultados,
};
await fs.writeFile(path.join(raiz, pastaRelativa, 'capturas-ue1b.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1b capturas: ${resultados.length} imagens, ${problemas.length} problema(s), plantas vistas ${manifesto.plantas_vistas} de ${plantas.length}, ${recusados.length} pedido(s) para fora recusados`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length || manifesto.plantas_vistas !== plantas.length ? 1 : 0);
