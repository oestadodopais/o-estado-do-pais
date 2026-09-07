#!/usr/bin/env node
/**
 * =============================================================================
 * A MEDIDA DO BLOCO F1.1c · a altura da primeira página e os nomes à vista por
 * baixo da faixa, antes e depois
 * =============================================================================
 *
 * NÃO É UM PORTÃO E NÃO É UMA RÉGUA: não recusa nada, não tem células e não sai
 * com 1. Imprime o que mediu e escreve-o num ficheiro, para que a tabela do
 * relatório do bloco tenha um comando por trás de cada número. Quem recusa é
 * `tests/inicio/leitura.mjs` (as células J13 e J14) e `tests/inicio/porta.mjs`
 * (a célula A2, a altura).
 *
 * O QUE MEDE, sobre um `dist/` já construído, em Chromium e em WebKit sem
 * cabeça, a 390 × 664 e depois de `document.fonts.ready`:
 *
 *   · A ALTURA de `/` e de `/en`, com guião e sem guião. Sem guião é a metade que
 *     não pode mudar: a folha só esconde as dobras fechadas quando o guião
 *     escreve `data-toque="sim"` na área, e por isso uma página sem guião tem de
 *     medir ao píxel o que media antes do bloco.
 *   · OS NOMES DE MEDIDA À VISTA na área de leitura, nos QUATRO estados: em
 *     repouso, depois de um toque num cartão, depois do botão «voltar» do
 *     navegador e depois de um Enter no mesmo cartão. A contagem é de nomes
 *     VISÍVEIS e não de `<details>` abertos, porque o que o diretor viu a 04.09
 *     foi uma lista de nomes: «the names are still there».
 *   · QUANTOS DOS CARTÕES DA FAIXA DA CABEÇA LEVAM PARA FORA desta página. Desde
 *     a segunda passagem do bloco (07.09.2026, decisão (7) da §1.99) são zero: os
 *     21 abrem a leitura daquele cartão, e a porta para o domínio vive dentro da
 *     leitura e na secção dos domínios. O número entra na medição porque é o que
 *     separa a construção de antes da de depois.
 *
 * «VISÍVEL» É O QUE O MOTOR DIZ, e não uma conta deste guião: `checkVisibility()`
 * onde ele existe, e as caixas do elemento onde não existe. Uma dobra que a
 * folha tira da página não tem caixa nenhuma.
 *
 * A ÁREA DE LEITURA PROCURA-SE POR DUAS MARCAS, e não por uma: `data-area-leitura`
 * é a marca que o F1.1c pôs, e `#painel` é o `id` que a área já tinha antes dele.
 * Assim o mesmo guião mede uma construção anterior ao bloco e a deste ramo, que é
 * a única maneira de as duas colunas da tabela serem comparáveis.
 *
 * O CARTÃO QUE SE TOCA é o primeiro da faixa da cabeça cujo destino seja uma
 * âncora DESTA página. Na construção deste ramo são os 21; numa construção
 * anterior à segunda passagem eram 18, e os outros três mudavam de página. O id
 * do cartão tocado fica escrito na medição, para que se saiba qual foi.
 *
 *   node scripts/medir-toque.mjs [dist] [ficheiro.json] [--sobre=<a árvore medida>]
 *
 * Exemplo (o que escreveu as medidas de 07.09.2026):
 *
 *   node scripts/medir-toque.mjs dist \
 *     design/especime-v3/medicoes/toque-medidas-depois.json --sobre=toque-2026-09-04
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
/* `--sobre=<texto>` DIZ DE QUE ÁRVORE VEIO O `dist`, e vai para dentro do
   ficheiro. Um caminho de pasta não diz que construção foi medida, e uma medida
   sem a árvore de onde saiu não se refaz. */
const SOBRE = (argv.find((a) => a.startsWith('--sobre=')) ?? '').slice(8) || null;
const soltos = argv.filter((a) => !a.startsWith('--'));
const DIST = path.resolve(soltos[0] ?? path.join(RAIZ, 'dist'));
const SAIDA = soltos[1] ?? null;

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho(`\n  não existe ${DIST}. Corra o build primeiro.\n`));
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const chrome = await chromium.launch({ headless: true });
const safari = await webkit.launch({ headless: true });

async function pagina(nav, rota, comGuiao) {
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 664 },
    javaScriptEnabled: comGuiao,
  });
  const p = await ctx.newPage();
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  p.__ctx = ctx;
  return p;
}

/* Os nomes de medida VISÍVEIS na área de leitura, a linha do estado vazio, a
   altura da página e o que os cartões da faixa da cabeça prometem. */
const SONDA = () => {
  const visivel = (el) => {
    if (!el) return false;
    if (typeof el.checkVisibility === 'function') return el.checkVisibility();
    return el.getClientRects().length > 0;
  };
  const area = document.querySelector('[data-area-leitura]') ?? document.getElementById('painel');
  const nomes = area ? [...area.querySelectorAll('[data-leitura] [data-medida-nome]')] : [];
  const vazio = document.querySelector('[data-leituras-vazio]');
  const cartoes = [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].map(
    (c) => ({
      id: c.getAttribute('data-cartao'),
      href: c.querySelector('.cartao-porta')?.getAttribute('href') ?? '',
    }),
  );
  return {
    altura: document.documentElement.scrollHeight,
    nomes: nomes.length,
    nomesVisiveis: nomes.filter(visivel).length,
    detalhes: document.querySelectorAll('details[data-leitura]').length,
    abertas: [...document.querySelectorAll('details[data-leitura][open]')].map((d) => d.id),
    linhaVazia: vazio ? { existe: true, visivel: visivel(vazio) } : { existe: false },
    cartoes: cartoes.length,
    cartoesParaFora: cartoes.filter((c) => !c.href.startsWith('#')).map((c) => c.id),
    hash: location.hash,
    caminho: location.pathname,
  };
};

const medidas = {};
for (const [motor, nav] of [
  ['chromium', chrome],
  ['webkit', safari],
]) {
  for (const [ed, rota] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    for (const comGuiao of [true, false]) {
      const p = await pagina(nav, rota, comGuiao);
      const r = await p.evaluate(SONDA);
      medidas[`${motor}.${ed}.${comGuiao ? 'com-guiao' : 'sem-guiao'}.repouso`] = r;
      if (comGuiao) {
        /* O primeiro cartão cujo destino é uma âncora desta página, tocado como
           o leitor o toca. */
        const alvo = await p.evaluate(() => {
          const c = [...document.querySelectorAll('[data-grelha] [data-faixa] [data-cartao]')].find(
            (x) => (x.querySelector('.cartao-porta')?.getAttribute('href') ?? '').startsWith('#'),
          );
          if (c) c.scrollIntoView({ block: 'center', inline: 'center' });
          return c ? c.getAttribute('data-cartao') : null;
        });
        await p.click(`[data-cartao="${alvo}"] .cartao-porta`);
        await p.waitForTimeout(200);
        medidas[`${motor}.${ed}.com-guiao.apos-toque`] = { alvo, ...(await p.evaluate(SONDA)) };

        /* O botão «voltar» do navegador, que é a travessia que dispara o
           `hashchange` de que o guião vive. */
        await p.evaluate(() => history.back());
        await p.waitForTimeout(200);
        medidas[`${motor}.${ed}.com-guiao.apos-voltar`] = { alvo, ...(await p.evaluate(SONDA)) };

        /* E o mesmo cartão com Enter: a promessa do teclado é a do dedo. */
        await p.focus(`[data-cartao="${alvo}"] .cartao-porta`);
        await p.keyboard.press('Enter');
        await p.waitForTimeout(200);
        medidas[`${motor}.${ed}.com-guiao.apos-enter`] = { alvo, ...(await p.evaluate(SONDA)) };
      }
      await p.__ctx.close();
    }
  }
}

for (const [k, v] of Object.entries(medidas)) {
  console.log(
    `  ${k.padEnd(38)} altura ${String(v.altura).padStart(5)} px · ` +
      `${v.nomesVisiveis}/${v.nomes} nome(s) visível(eis) · ${v.detalhes} <details> · ` +
      `aberta(s): ${v.abertas.join(', ') || '—'} · ` +
      `linha vazia: ${
        v.linhaVazia.existe ? (v.linhaVazia.visivel ? 'visível' : 'escondida') : 'não existe'
      } · ${v.cartoesParaFora.length} de ${v.cartoes} cartão(ões) para fora · hash ${v.hash || '—'}`,
  );
}

if (SAIDA) {
  const destino = path.resolve(SAIDA);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(
    destino,
    JSON.stringify(
      {
        sobre: SOBRE,
        dist: DIST,
        medido: new Date().toISOString(),
        comando: `node scripts/medir-toque.mjs ${argv.join(' ')}`,
        medidas,
      },
      null,
      2,
    ) + '\n',
  );
  console.log('');
  console.log(`  ${verde('✓')} ${Object.keys(medidas).length} medida(s) ${cinza(destino)}`);
}

await chrome.close();
await safari.close();
servidor.close();
