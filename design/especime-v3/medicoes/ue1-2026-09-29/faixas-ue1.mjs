/** UE1: a faixa da União medida em cada cartão que a leva, nas duas edições e nas cinco larguras.
 *
 * O teste de aceitação do §2 do brief pede a faixa «no cartão de cada uma das dez medidas, nas duas
 * edições e nas cinco larguras», e as capturas do ponto 6 do §3 são de dois cartões e de dois recibos.
 * Este guião mede os outros, sem guardar imagens: em cada página com faixas (a dos temas e as cinco
 * das entradas, em português e em inglês) e em cada largura, para cada faixa, as caixas dos rótulos
 * (Portugal, a União e as duas pontas), se algum se sobrepõe a outro ou sai do cartão, se o cartão
 * transborda, se a página transborda na horizontal, e quantas marcas a faixa tem. As medidas são as
 * do captor (`captar-ue1.mjs`), escritas outra vez aqui para não o mudar depois das capturas; o
 * cartão de cada faixa é o `[data-cartao-medida]` que a contém, e cada faixa é trazida à janela antes
 * de se medir, como o captor faz com cada cartão.
 *
 * O CONHECIDO-POSITIVO corre na página dos temas de cada edição, na largura mais estreita, antes de
 * se medir: o rótulo de Portugal posto no lugar do da União (com a classe, a âncora e a posição do
 * rótulo da União), a ponta mais alta empurrada para fora do cartão e um elemento mais largo do que a
 * janela têm de ser vistos pelo mesmo detetor. Cada planta vive só no navegador, e a página volta a
 * carregar-se antes da planta seguinte e da medição. Cada elemento plantado leva `transition: none`:
 * com o movimento reduzido (o contexto do captor, `reducedMotion: 'reduce'`), a folha da casa dá a
 * tudo uma transição de 0,01 ms (`src/styles/site.css`, a regra de `prefers-reduced-motion`), e uma
 * leitura logo a seguir a uma troca de `left` ou de `top` ainda via a posição antiga: a primeira
 * corrida deste guião deu por isso, com a planta do rótulo por ver nas duas edições. A medição a
 * sério não muda estilo nenhum e não depende disto.
 *
 * Serve `dist/` por um servidor local efémero, recusa todo o pedido que não seja da origem local e
 * confere que a construção é da cabeça. Escreve `faixas-ue1.json`, sem caminhos da máquina.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/faixas-ue1.mjs [manifesto]
 *
 * O manifesto é `faixas-ue1.json` por omissão; a passagem UE1b (29.09.2026) corre-o outra vez com
 * `faixas-ue1b.json`, porque as pontas passaram a levar as ressalvas da fonte por extenso.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const raiz = process.cwd();
const dist = path.resolve('dist');
const pasta = 'design/especime-v3/medicoes/ue1-2026-09-29';
const manifestoDeSaida = process.argv[2] ?? 'faixas-ue1.json';
if (!/^faixas-ue1b?\.json$/.test(manifestoDeSaida)) throw new Error(`o manifesto é faixas-ue1.json ou faixas-ue1b.json, e não «${manifestoDeSaida}»`);
const esperado = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: raiz, encoding: 'utf8' }).trim();
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== esperado) throw new Error(`A construção declara ${versao.commit}; esperava ${esperado}.`);
const larguras = [390, 768, 1024, 1280, 1600];
const paginas = {
  pt: ['/temas/', '/o-meu-dinheiro/', '/o-meu-trabalho/', '/a-minha-casa/', '/o-estado-e-a-economia/', '/a-escola-e-a-saude/'],
  en: ['/en/themes/', '/en/my-money/', '/en/my-work/', '/en/my-home/', '/en/state-and-economy/', '/en/school-and-health/'],
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
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;

/** As medidas das faixas da página (ou só da faixa de índice `so`), em coordenadas da janela. */
const MEDIR = (so = null) => {
  const caixa = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, largura: r.width, altura: r.height, direita: r.right, fundo: r.bottom }; };
  const sobrepoe = (a, b) => a && b && a.x < b.direita - 0.5 && b.x < a.direita - 0.5 && a.y < b.fundo - 0.5 && b.y < a.fundo - 0.5;
  const todas = [...document.querySelectorAll('[data-faixa-ue]')];
  const faixas = (so === null ? todas : [todas[so]]).map((f) => {
    const c = f.closest('[data-cartao-medida]');
    const cc = caixa(c);
    const rot = [...f.querySelectorAll('[data-faixa-rotulo], [data-faixa-ponta]')].map((e) => ({ nome: e.getAttribute('data-faixa-rotulo') ?? `ponta-${e.getAttribute('data-faixa-ponta')}`, caixa: caixa(e) }));
    const pares = [];
    for (let i = 0; i < rot.length; i++) for (let j = i + 1; j < rot.length; j++) if (sobrepoe(rot[i].caixa, rot[j].caixa)) pares.push(`${rot[i].nome}×${rot[j].nome}`);
    const fora = rot.filter((r) => cc && r.caixa && (r.caixa.x < cc.x - 0.5 || r.caixa.direita > cc.direita + 0.5)).map((r) => r.nome);
    return {
      serie: f.getAttribute('data-faixa-ue'), cartao: c?.getAttribute('data-cartao-medida') ?? null,
      marcas: f.querySelectorAll('[data-faixa-marca]').length, rotulos: rot.map((r) => r.nome),
      sobreposicoes: pares, fora_do_cartao: fora, transborda: c ? c.scrollWidth > c.clientWidth + 0.5 : null,
      com_tamanho: Boolean(cc && cc.largura > 0 && cc.altura > 0 && f.getBoundingClientRect().height > 0),
    };
  });
  return { janela: innerWidth, documento: document.documentElement.scrollWidth, faixas };
};

/** Os três estragos do conhecido-positivo, cada um só no navegador. */
const ESTRAGOS = {
  'o rótulo de Portugal no lugar do da União': () => {
    const f = document.querySelector('[data-faixa-ue]');
    const pt = f.querySelector('[data-faixa-rotulo="portugal"]');
    const ue = f.querySelector('[data-faixa-rotulo="uniao"]');
    pt.style.transition = 'none';
    pt.className = ue.className;
    pt.setAttribute('data-ancora', ue.getAttribute('data-ancora') ?? '');
    pt.style.left = ue.style.left;
    return f.getAttribute('data-faixa-ue');
  },
  'a ponta mais alta fora do cartão': () => {
    const f = document.querySelector('[data-faixa-ue]');
    const c = f.closest('[data-cartao-medida]').getBoundingClientRect();
    Object.assign(f.querySelector('[data-faixa-ponta="alto"]').style, { transition: 'none', position: 'fixed', left: `${c.right + 20}px`, top: `${c.y}px` });
    return f.getAttribute('data-faixa-ue');
  },
  'um elemento mais largo do que a janela': () => {
    const d = document.createElement('div');
    Object.assign(d.style, { width: `${innerWidth + 200}px`, height: '1px' });
    document.body.appendChild(d);
    return null;
  },
};
const viu = (nome, serie, m) => {
  const f = m.faixas.find((x) => x.serie === serie);
  if (nome === 'o rótulo de Portugal no lugar do da União') return Boolean(f?.sobreposicoes.some((p) => p.includes('portugal') && p.includes('uniao')));
  if (nome === 'a ponta mais alta fora do cartão') return Boolean(f?.fora_do_cartao.includes('ponta-alto'));
  return m.documento > m.janela + 0.5;
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
        for (const nome of Object.keys(ESTRAGOS)) {
          await carrega(paginas[lang][0]);
          await pagina.locator('[data-faixa-ue]').first().scrollIntoViewIfNeeded();
          const serie = await pagina.evaluate(ESTRAGOS[nome]);
          const m = await pagina.evaluate(MEDIR);
          const f = m.faixas.find((x) => x.serie === serie);
          plantas.push({ lang, largura, pagina: paginas[lang][0], nome, serie, visto: viu(nome, serie, m), detetor: { sobreposicoes: f?.sobreposicoes ?? null, fora_do_cartao: f?.fora_do_cartao ?? null, janela: m.janela, documento: m.documento } });
        }
      }
      for (const url of paginas[lang]) {
        await carrega(url);
        const n = await pagina.locator('[data-faixa-ue]').count();
        const faixas = [];
        for (let i = 0; i < n; i++) {
          await pagina.locator('[data-faixa-ue]').nth(i).scrollIntoViewIfNeeded();
          faixas.push(...(await pagina.evaluate(MEDIR, i)).faixas);
        }
        const { janela, documento } = await pagina.evaluate(MEDIR);
        resultados.push({ lang, largura, pagina: url, janela, documento, faixas });
      }
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}

const problemas = resultados.flatMap((r) => {
  const p = [];
  if (r.documento > r.janela + 0.5) p.push(`${r.pagina} a ${r.largura}: a página transborda na horizontal`);
  for (const f of r.faixas) {
    const onde = `${r.pagina} a ${r.largura}, ${f.serie}`;
    if (f.marcas !== 28) p.push(`${onde}: a faixa tem ${f.marcas} marcas`);
    if (!f.com_tamanho) p.push(`${onde}: a faixa não tem tamanho`);
    if (f.sobreposicoes.length) p.push(`${onde}: rótulos sobrepostos (${f.sobreposicoes.join(', ')})`);
    if (f.fora_do_cartao.length) p.push(`${onde}: rótulos fora do cartão (${f.fora_do_cartao.join(', ')})`);
    if (f.transborda) p.push(`${onde}: o cartão transborda`);
  }
  return p;
});
const medicoes = resultados.flatMap((r) => r.faixas.map((f) => ({ ...f, lang: r.lang, largura: r.largura, pagina: r.pagina })));
const porEdicao = Object.fromEntries(['pt', 'en'].map((l) => [l, [...new Set(medicoes.filter((m) => m.lang === l).map((m) => m.serie))].sort()]));
const manifesto = {
  bloco: manifestoDeSaida === 'faixas-ue1b.json' ? 'UE1b' : 'UE1', construcao: versao, cabeca_esperada: esperado, larguras, paginas,
  paginas_medidas: resultados.length,
  medicoes_de_faixa: medicoes.length,
  series_com_faixa_por_edicao: Object.fromEntries(Object.entries(porEdicao).map(([l, s]) => [l, s.length])),
  medicoes_por_serie_e_edicao: Object.fromEntries(['pt', 'en'].map((l) => [l, Object.fromEntries(porEdicao[l].map((s) => [s, medicoes.filter((m) => m.lang === l && m.serie === s).length]))])),
  rotulos_por_faixa: [...new Set(medicoes.map((m) => m.rotulos.length))],
  plantas, plantas_vistas: plantas.filter((p) => p.visto).length,
  pedidos_recusados_para_fora: recusados.length,
  problemas, resultados,
};
await fs.writeFile(path.join(raiz, pasta, manifestoDeSaida), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`UE1 faixas: ${medicoes.length} medições em ${resultados.length} páginas, ${problemas.length} problema(s); plantas vistas ${manifesto.plantas_vistas} de ${plantas.length}; ${recusados.length} pedido(s) para fora recusados`);
for (const p of problemas) console.log(`  · ${p}`);
process.exit(problemas.length || manifesto.plantas_vistas !== plantas.length ? 1 : 0);
