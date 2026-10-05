/**
 * RP4-m: as capturas e as medidas da construção local, nas duas edições e nas cinco larguras. Não pertence à
 * cadeia do `verify` e não escreve no `dist/`: serve o `dist/` por um servidor local efémero, com o Chromium sem
 * cabeça, e recusa tudo o que não venha da origem local.
 *
 * As rotas: a página dos preços (três dos cinco cartões que passaram a desenhar a sua série, e o cartão da comparação
 * europeia, recortado à parte), a página da habitação (os outros dois, as rendas e a média sem habitação), o recibo do índice (a frase do que o valor quer dizer em relação à base e a unidade
 * inglesa), o recibo do salário real (a figura indexada), o recibo da remuneração (a marca do último ano no eixo) e o
 * recibo de uma das cinco séries novas. Escreve `capturas.json` ao lado, com o resumo e as medidas de cada captura.
 *
 * Uso: node design/especime-v3/medicoes/rp4m-2026-10-05/capturar.mjs (na raiz, depois do build)
 *
 * A PASSAGEM RP4-m-b (05.10.2026) refaz só o recibo do salário real, com três argumentos opcionais (sem eles, o
 * guião corre as seis rotas e escreve `capturas.json`, como antes): `--rotas salario-real` (os nomes das rotas,
 * separados por vírgulas), `--prefixo rp4mb-` (o começo do nome de cada captura, para as do bloco ficarem como
 * estavam) e `--json capturas-rp4mb.json` (o ficheiro do registo). Desde a passagem, cada captura mede também a
 * frase da conta de uma série derivada, que no recibo do salário real tem de ser, carácter a carácter, a cadeia de
 * `src/i18n/strings.mjs` da sua edição, com a planta de um texto acrescentado no navegador; e a hora da construção
 * lê-se do campo que o `version.json` tem (`construido_em`).
 *
 *   node design/especime-v3/medicoes/rp4m-2026-10-05/capturar.mjs --rotas salario-real --prefixo rp4mb- --json capturas-rp4mb.json
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { STRINGS } from '../../../../src/i18n/strings.mjs';

const DIST = path.resolve('dist');
const AQUI = path.dirname(new URL(import.meta.url).pathname);
const CAP = 'design/especime-v3/capturas/rp4m-2026-10-05';
const versao = JSON.parse(await fs.readFile(path.join(DIST, 'version.json'), 'utf8'));
await fs.mkdir(CAP, { recursive: true });
const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const SO = argumento('--rotas')?.split(',') ?? null;
const PREFIXO = argumento('--prefixo') ?? '';
const SAIDA = argumento('--json') ?? 'capturas.json';
const TODAS = [
  ['precos', '/precos/', '/en/prices/'],
  ['habitacao', '/habitacao/', '/en/housing/'],
  ['indice', '/livro-razao/series/serie-ipc-indice/', '/en/ledger/series/serie-ipc-indice/'],
  ['salario-real', '/livro-razao/series/serie-remuneracao-bruta-mensal-media-real/', '/en/ledger/series/serie-remuneracao-bruta-mensal-media-real/'],
  ['remuneracao', '/livro-razao/series/serie-remuneracao-bruta-mensal-media/', '/en/ledger/series/serie-remuneracao-bruta-mensal-media/'],
  ['combustiveis', '/livro-razao/series/serie-ipc-combustiveis-variacao-homologa/', '/en/ledger/series/serie-ipc-combustiveis-variacao-homologa/'],
];
const desconhecidas = (SO ?? []).filter((n) => !TODAS.some(([r]) => r === n));
if (desconhecidas.length) throw Error(`rotas que o guião não conhece: ${desconhecidas.join(', ')}`);
const ROTAS = TODAS.filter(([n]) => !SO || SO.includes(n));
/* A FRASE DA CONTA DE UMA SÉRIE DERIVADA, pela cadeia da edição (a passagem RP4-m-b tirou-lhe a segunda metade). */
const FRASE_DA_CONTA = { pt: STRINGS.pt.livro.serieNoTempo.derivadaFraseVarias, en: STRINGS.en.livro.serieNoTempo.derivadaFraseVarias };
const LARGURAS = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (req, res) => {
  try {
    let f = path.resolve(DIST, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!f.startsWith(DIST + path.sep) && f !== DIST) throw Error('fora');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.setHeader('Content-Type', tipos[path.extname(f)] ?? 'application/octet-stream');
    res.end(await fs.readFile(f));
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ headless: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
const capturas = []; const erros = []; const plantas = [];

async function abre(rota, largura) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origem) ? r.continue() : r.abort()));
  const pagina = await ctx.newPage();
  const resposta = await pagina.goto(origem + rota, { waitUntil: 'networkidle' });
  if (resposta.status() !== 200) throw Error(`página não encontrada: ${rota}`);
  await pagina.evaluate(() => document.fonts.ready);
  return { ctx, pagina };
}

const medir = () => {
  const desenhos = [...document.querySelectorAll('svg[data-forma="serie-do-pais"]')];
  const letras = desenhos.flatMap((s) => [...s.querySelectorAll('text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM().a));
  const indexada = document.querySelector('.serie-grafico-indexado svg');
  const tracos = indexada ? [...indexada.querySelectorAll('polyline')].map((p) => ({ serie: p.getAttribute('data-serie-linha'), tracejado: getComputedStyle(p).strokeDasharray })) : [];
  const eixo = document.querySelector('.serie-grafico svg [data-eixo="tempo"]:last-of-type text');
  return {
    largura: innerWidth, pagina: document.documentElement.scrollWidth,
    desenhos: desenhos.length, letraMinima: letras.length ? Math.min(...letras) : null, letraMaxima: letras.length ? Math.max(...letras) : null,
    cartoesComSerie: [...document.querySelectorAll('[data-cartao-serie]')].map((a) => a.getAttribute('data-cartao-serie')),
    fraseDoIndice: document.querySelector('[data-serie-indice]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    unidade: document.querySelector('[data-serie-campo="unit"]')?.textContent.trim() ?? null,
    tracos, legenda: [...document.querySelectorAll('[data-serie-indexada-linha]')].map((l) => l.getAttribute('data-serie-indexada-linha')),
    ultimaMarcaDoEixo: eixo ? { texto: eixo.textContent, x: eixo.getAttribute('x'), ancora: eixo.getAttribute('text-anchor') } : null,
    fraseDaConta: document.querySelector('.serie-conta > p')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  };
};

try {
  for (const [nome, pt, en] of ROTAS) {
    for (const [lang, rota] of [['pt', pt], ['en', en]]) {
      for (const largura of LARGURAS) {
        const { ctx, pagina } = await abre(rota, largura);
        const m = await pagina.evaluate(medir);
        if (m.pagina > largura) erros.push(`${lang}/${nome}/${largura}: a página transborda (${m.pagina} px)`);
        if (m.desenhos && (m.letraMinima < 11 || m.letraMaxima > 16)) erros.push(`${lang}/${nome}/${largura}: letras dos eixos fora dos limites`);
        if (nome === 'salario-real' && (m.tracos.length !== 2 || m.tracos[1].tracejado === 'none' || m.tracos[0].tracejado !== 'none' || m.legenda.length !== 2)) erros.push(`${lang}/${nome}/${largura}: a figura indexada não tem os dois traços distintos e a legenda`);
        if (nome === 'indice' && (!m.fraseDoIndice || (lang === 'en' && !/^index/.test(m.unidade ?? '')))) erros.push(`${lang}/${nome}/${largura}: falta a frase do índice ou a unidade inglesa`);
        if (nome === 'salario-real' && m.fraseDaConta !== FRASE_DA_CONTA[lang]) erros.push(`${lang}/${nome}/${largura}: a frase da conta não é a cadeia da edição: «${m.fraseDaConta}»`);
        const ficheiro = `${CAP}/${PREFIXO}${lang}-${nome}-${largura}.png`;
        await pagina.screenshot({ path: ficheiro, fullPage: true });
        const bytes = await fs.readFile(ficheiro);
        capturas.push({ lang, nome, rota, largura, ficheiro: path.basename(ficheiro), bytes: bytes.length, sha256: sha(bytes), ...m });
        if (nome === 'precos') {
          const cartao = pagina.locator('[data-cartao-medida="ihpc-variacao-homologa"]').first();
          if (await cartao.count()) {
            const fc = `${CAP}/${PREFIXO}${lang}-cartao-da-comparacao-${largura}.png`;
            await cartao.screenshot({ path: fc });
            const bc = await fs.readFile(fc);
            capturas.push({ lang, nome: 'cartao-da-comparacao', rota, largura, ficheiro: path.basename(fc), bytes: bc.length, sha256: sha(bc) });
          } else erros.push(`${lang}/${largura}: o cartão da comparação europeia não está na página dos preços`);
        }
        /* AS PLANTAS, a 1024 px: o mesmo critério tem de ver um estrago feito só no navegador. */
        if (largura === 1024 && nome === 'salario-real') {
          const estilo = await pagina.addStyleTag({ content: '.serie-grafico-indexado polyline.serie-do-pais-linha { stroke-dasharray: none !important; }' });
          const t2 = await pagina.evaluate(() => [...document.querySelectorAll('.serie-grafico-indexado polyline')].map((p) => getComputedStyle(p).strokeDasharray));
          await estilo.evaluate((e) => e.remove());
          const mordeu = t2.length === 2 && t2[1] === 'none';
          plantas.push({ nome: 'o traço da série do recibo sem tracejado', lang, mordeu });
          if (!mordeu) erros.push('a planta do tracejado não mordeu');
          /* A PLANTA DA FRASE DA CONTA (RP4-m-b): uma metade acrescentada no navegador tem de ser apanhada pelo mesmo critério. */
          const antes = await pagina.evaluate(() => document.querySelector('.serie-conta > p').textContent);
          await pagina.evaluate(() => { document.querySelector('.serie-conta > p').textContent += ' e mais uma metade'; });
          const lida = (await pagina.evaluate(medir)).fraseDaConta;
          await pagina.evaluate((t) => { document.querySelector('.serie-conta > p').textContent = t; }, antes);
          const mordeuFrase = lida !== FRASE_DA_CONTA[lang] && (await pagina.evaluate(medir)).fraseDaConta === FRASE_DA_CONTA[lang];
          plantas.push({ nome: 'a frase da conta com uma metade acrescentada', lang, mordeu: mordeuFrase });
          if (!mordeuFrase) erros.push('a planta da frase da conta não mordeu');
        }
        if (largura === 1024 && nome === 'precos') {
          const estilo = await pagina.addStyleTag({ content: '.cartao-medida { width: 1400px !important; }' });
          const larga = await pagina.evaluate(() => document.documentElement.scrollWidth);
          await estilo.evaluate((e) => e.remove());
          const mordeu = larga > largura;
          plantas.push({ nome: 'um cartão mais largo do que o ecrã', lang, larga, mordeu });
          if (!mordeu) erros.push('a planta do transbordo não mordeu');
        }
        await ctx.close();
        console.log(`${lang} ${nome} ${largura}: ${m.desenhos} desenho(s), ${m.pagina} px`);
      }
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
const saida = { o_que: PREFIXO ? `RP4-m: as capturas da construção local (${PREFIXO.replace(/-$/, '')}: ${ROTAS.map(([n]) => n).join(', ')})` : 'RP4-m: as capturas da construção local', cabeca: versao.commit ?? null, construida: versao.construido_em ?? versao.builtAt ?? versao.built_at ?? null,
  capturas: capturas.length, larguras: LARGURAS, rotas: ROTAS.map(([n]) => n), erros, plantas, lista: capturas };
await fs.writeFile(path.join(AQUI, SAIDA), JSON.stringify(saida, null, 2) + '\n');
console.log(`${capturas.length} captura(s), ${erros.length} erro(s), ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} planta(s) morderam`);
process.exit(erros.length || plantas.some((p) => !p.mordeu) ? 1 : 0);
