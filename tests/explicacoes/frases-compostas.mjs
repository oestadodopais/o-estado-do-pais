#!/usr/bin/env node
/**
 * =============================================================================
 * FC · AS FRASES COMPOSTAS NO ECRÃ (bloco EX1-b, 06.10.2026, a decisão do lugar de direção sobre a régua das frases)
 * =============================================================================
 *
 * PORQUE EXISTE. Na primeira corrida do bloco EX1, os três portões passaram e as capturas acharam o que nenhum media: as
 * portas do bloco «Para perceber» e da lista das explicações eram contentores flexíveis, e cada pedaço marcado das frases
 * (o ano do título, as datas e as contagens da semana) virava um item, com os espaços das pontas apagados («em2026») e a
 * primeira página a transbordar a 390 px. A C2 do `check:css` lê o HTML, e o HTML estava certo: o defeito era do desenho.
 * Esta célula lê o desenho, no Chromium sem cabeça, sobre a construção.
 *
 * O QUE CONFERE, nas páginas onde as frases compostas da casa se rendem (a primeira página, o índice, a lista das
 * explicações, a leitura da semana, a página de cada explicação e os cartões dos preços com as definições abertas, nas duas edições), a 390 e a 1280 px:
 *   · FC1 · nenhum pedaço marcado (`data-semana`, `data-de-linha`, `data-explicacao-nome`, a caixa de um valor) de uma
 *     frase composta (dentro de uma marca
 *     `data-explicacao-declarado`, `data-semana-declarado`, de uma porta de explicação ou de uma frase da semana) tem por
 *     pai um contentor flexível ou de grelha: numa frase, as peças são texto corrido;
 *   · FC2 · nas duas larguras, nenhuma destas páginas tem um documento mais largo do que a janela.
 *
 * AS PLANTAS, no navegador e nunca no ficheiro: a porta das explicações, a frase de um bloco e as duas leituras dos
 * cartões, cada uma num contentor flexível (FC1) ou mais largo do que a janela (FC2). Uma planta que não morda fecha a célula. Não escreve
 * no `dist/`: serve-o por um servidor local efémero e recusa tudo o que não venha da origem.
 *
 * Uso (na raiz, depois do build): node tests/explicacoes/frases-compostas.mjs [--json <ficheiro>]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { EXPLICACOES } from '../../src/data/explicacoes/index.mjs';
import { routePath } from '../../src/lib/routes.mjs';

/* EX2 (06.10.2026): a página dos preços acrescenta as duas metades das leituras dos cartões; os blocos da primeira página entram na seleção de frases. */
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const i = process.argv.indexOf('--json');
const SAIDA = i > 1 ? process.argv[i + 1] : process.env.OEDP_FRASES_JSON ?? null;
const barra = (/** @type {string} */ p) => (p.endsWith('/') ? p : `${p}/`);
const ROTAS = /** @type {const} */ (['pt', 'en']).flatMap((lang) => [
  routePath('home', lang), routePath('entradaDinheiro', lang), routePath('indice', lang), routePath('explicacoes', lang), routePath('leituraDaSemana', lang),
  ...EXPLICACOES.map((e) => routePath('explicacao', lang, { slug: e.slug })),
].map(barra));
const LARGURAS = [390, 1280];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[/** @type {keyof typeof tipos} */ (path.extname(f))] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', () => ok(null)));
const origem = `http://127.0.0.1:${/** @type {any} */ (servidor.address()).port}`;
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
const navegador = await chromium.launch({ headless: true });

/** @param {string} rota @param {number} largura */
async function abre(rota, largura) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const pagina = await ctx.newPage();
  const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
  if (!resposta || resposta.status() !== 200) throw Error(`FC · a página ${rota} não foi construída (${resposta?.status()})`);
  await pagina.evaluate(() => {
    document.querySelectorAll('details[data-cartao-dobra]').forEach(el => { el.open=true; });
    return document.fonts.ready;
  });
  return { ctx, pagina };
}

/* A medida, no navegador. Com o movimento reduzido, a folha da casa põe a duração das transições em 0,01 ms em todos os
   elementos, e uma planta mede-se depois de dois fotogramas. */
const medir = () => {
  /* O selo dentro de um Claim não é outro pedaço da frase: todos os seus descendentes sobem à mesma caixa que o valor.
     Os pedaços marcados de uma frase: as contagens e as datas da semana, os períodos, os nomes declarados e os valores
     (de um valor conta a caixa do `<Claim>`, que leva o selo: o que tem de ser texto corrido é o pai dessa caixa). */
  const marcados = [...new Set([...document.querySelectorAll('main [data-semana], main [data-de-linha], main [data-explicacao-nome], main [data-claim], main [data-nonledger], main [data-correcao-campo], main [data-linha-campo]')]
    .map((x) => x.closest('.claim') ?? x))]
    .filter((x) => x.closest('[data-explicacao-declarado], [data-semana-declarado], [data-explicacao-porta], [data-semana-frase], [data-bloco-frase], [data-bloco-ressalva], [data-bloco-titulo], [data-bloco] p[data-bloco-declarado], [data-bloco-serie-unidade], [data-cartao-leitura], [data-o-que-e]'));
  const pais = new Set(marcados.map((x) => /** @type {HTMLElement} */ (x.parentElement)));
  const flex = [...pais].filter((el) => /flex|grid/.test(getComputedStyle(el).display))
    .map((el) => ({ tag: el.tagName.toLowerCase(), classe: String(el.className), display: getComputedStyle(el).display, texto: (el.textContent ?? '').trim().slice(0, 70) }));
  return { pedacos: marcados.length, blocos: marcados.filter(x => x.closest('[data-bloco]')).length, cartoes: marcados.filter(x => x.closest('[data-cartao-leitura]')).length, flex, largura_do_documento: document.documentElement.scrollWidth, janela: window.innerWidth };
};
/* EX2: as plantas afirmam a mensagem da mesma função que julga a página intacta. */
const defeitos = (m, rota, largura) => [
  ...m.flex.map(f => `FC1 · ${rota} a ${largura} px: uma frase composta dentro de um contentor ${f.display} (${f.tag}${f.classe ? `.${f.classe.split(/\s+/).join('.')}` : ''}): «${f.texto}»`),
  ...(m.largura_do_documento > m.janela + 1 ? [`FC2 · ${rota} a ${largura} px: o documento tem ${m.largura_do_documento} px numa janela de ${m.janela}`] : []),
];
const doisFotogramas = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok(null))));

/** @type {{ rota: string, largura: number, pedacos: number, flex: any[], largura_do_documento: number, janela: number }[]} */
const resultados = [];
/** @type {string[]} */
const erros = [];
/** @type {{ nome: string, mordeu: boolean, mensagem: string, queixas: string[] }[]} */
const plantas = [];
try {
  for (const largura of LARGURAS) for (const rota of ROTAS) {
    const { ctx, pagina } = await abre(rota, largura);
    const m = await pagina.evaluate(medir);
    resultados.push({ rota, largura, ...m });
    erros.push(...defeitos(m, rota, largura));
    if ([barra(routePath('home','pt')), barra(routePath('home','en'))].includes(rota) && !m.blocos) erros.push(`FC · ${rota}: os blocos da primeira página não foram medidos`);
    if ([barra(routePath('entradaDinheiro','pt')), barra(routePath('entradaDinheiro','en'))].includes(rota) && !m.cartoes) erros.push(`FC · ${rota}: as leituras dos cartões não foram medidas`);
    await ctx.close();
  }
  /* EX2: as duas falhas em cada superfície nova, nas duas edições e larguras, sem tocar nos ficheiros. */
  for (const lang of ['pt','en']) for (const largura of LARGURAS) {
    for (const [superficie, key, selector] of [
      ['explicações','explicacoes','.explicacoes-item a'],
      ['primeira página','home','[data-bloco-frase]'],
      ['comparação dos cartões','entradaDinheiro','[data-cartao-leitura][data-leitura-parte="comparacao"]'],
      ['definição dos cartões aberta','entradaDinheiro','[data-cartao-leitura][data-leitura-parte="o-que-e"]'],
    ]) for (const tipo of ['flex','largura']) {
      const rota=barra(routePath(key,lang));
      const {ctx,pagina}=await abre(rota,largura);
      const controlo=defeitos(await pagina.evaluate(medir),rota,largura);
      await pagina.evaluate(({selector,tipo}) => {
        const el=[...document.querySelectorAll(selector)].find(e=>e.querySelector('[data-claim], [data-nonledger], [data-de-linha], [data-semana]'));
        if(!el) throw Error('a planta não encontrou uma frase com pedaços marcados');
        if(tipo==='flex') el.style.display='flex';
        else el.style.width='2000px';
        if(tipo==='largura') el.style.maxWidth='none';
      }, {selector,tipo});
      await pagina.evaluate(doisFotogramas);
      const queixas=defeitos(await pagina.evaluate(medir),rota,largura);
      const mensagem=tipo==='flex'?'FC1 ·':'FC2 ·';
      plantas.push({nome:`${superficie}, ${tipo}, ${lang}, ${largura}`, mensagem, queixas,
        mordeu:controlo.length===0&&queixas.some(q=>q.startsWith(mensagem))});
      await ctx.close();
    }
  }
  for (const p of plantas) if (!p.mordeu) erros.push(`FC · a planta «${p.nome}» não mordeu`);
  if (!resultados.some((r) => r.pedacos > 0)) erros.push('FC · nenhuma página teve um pedaço marcado: a célula não mediu nada');
  const resumo = { o_que_e: 'FC · as frases compostas da casa dentro de contentores flexíveis e os documentos mais largos do que a janela nas duas larguras, nas páginas onde as frases compostas se rendem.', construcao: versao.commit, construido_em: versao.construido_em, resultados, plantas, erros };
  if (SAIDA) await fs.writeFile(SAIDA, JSON.stringify(resumo, null, 2) + '\n');
  console.log(`FC · ${resultados.length} passagem(ns) em ${ROTAS.length} páginas, ${resultados.reduce((s, x) => s + x.pedacos, 0)} pedaços marcados vistos, ${resultados.reduce((s, x) => s + x.flex.length, 0)} dentro de um contentor flexível, ${resultados.filter((r) => r.largura_do_documento > r.janela + 1).length} documento(s) mais largos do que a janela; ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas no navegador.`);
} finally {
  await navegador.close();
  servidor.close();
}
if (erros.length) {
  console.error(`\n  FRASES COMPOSTAS · ${erros.length} problema(s):\n${erros.map((x) => `  · ${x}`).join('\n')}`);
  process.exit(1);
}
