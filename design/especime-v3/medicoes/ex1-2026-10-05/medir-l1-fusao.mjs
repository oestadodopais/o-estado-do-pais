#!/usr/bin/env node
/**
 * A L1 DEPOIS DA FUSÃO COM O MAIN DE 06.10.2026 (o R4, em 42c7ed7e), contada destino a destino e vez a vez como a
 * passagem R4-b a mede (`design/especime-v3/medicoes/r4-2026-10-05/medir-l1-r4b.mjs`).
 *
 * O QUE COMPARA. A contagem da construção da cabeça do main (42c7ed7e, construída numa worktree à parte, cujo caminho
 * é o primeiro argumento) contra a da construção da cabeça da fusão, as duas pela mesma cópia da regra da régua
 * (`design/especime-v3/medicoes/r4-2026-10-05/contar-destinos-l1.mjs`, que lê os módulos da árvore que mede e recusa
 * escrever se o seu número de páginas não for o da régua dessa árvore), com a régua de cada árvore corrida sobre a sua
 * construção com a amostra aberta. Exige: as páginas novas são exatamente as das explicações declaradas, nas duas
 * edições; nenhuma página do main fica agravada (um destino que se repete mais vezes, ou um destino que passou a
 * repetir-se); e cada destino repetido de uma página nova é o recibo de uma linha que uma figura da explicação desenha e
 * que o texto cita, duas vezes e só duas: o selo do valor no texto e o selo do mesmo valor na legenda dos selos do
 * instrumento que o desenha. As duas portas são obrigatórias pela regra do portão de HTML («onde aparece um valor,
 * aparece o selo», `scripts/gate-html.mjs:3458`): fora de um desenho, o selo vai ao pé do valor; dentro de um `<svg>`,
 * vai na legenda do próprio instrumento. Tirar uma delas era tirar o valor do texto do lugar de direção ou o texto do
 * valor desenhado da legenda.
 *
 * OS CONHECIDOS-POSITIVOS, em memória: a omissão das vezes (um destino de uma página do main a repetir-se mais uma vez é
 * agravado pela comparação com as vezes e passa calado na comparação sem elas); uma página a mais fora das explicações;
 * uma página das explicações em falta; uma página do main com um destino novo repetido; um destino repetido numa página
 * nova que não é um recibo desenhado e citado; um recibo desenhado e citado com três portas; e uma entrada tirada à
 * lista da régua, que deixa de reconciliar com a contagem dela.
 *
 * Escreve, em `fusao/`: `l1-fusao.json` (com `contagens.estudos`, o nome histórico do campo que a régua lê; conta
 * páginas), as duas contagens (`l1-destinos-<cabeça>.json`) e os dois registos da régua, com os caminhos da máquina
 * tirados.
 *
 * Uso, a partir da raiz do sítio, com a construção desta cabeça em `dist/` e a do main em `<worktree do main>/dist/`:
 *   node design/especime-v3/medicoes/ex1-2026-10-05/medir-l1-fusao.mjs <worktree do main>
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../../../../src/data/explicacoes/index.mjs';
import { routePath, LANGS } from '../../../../src/lib/routes.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, 'fusao');
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const MAIN = path.resolve(process.argv[2] ?? '');
assert(process.argv[2] && fs.existsSync(path.join(MAIN, 'dist', 'version.json')), 'uso: medir-l1-fusao.mjs <worktree do main, construída>');
const CONTAR = path.join(RAIZ, 'design', 'especime-v3', 'medicoes', 'r4-2026-10-05', 'contar-destinos-l1.mjs');
const limpa = (/** @type {string} */ s) => s
  .replace(/\x1b\[[0-9;]*m/g, '')
  .replaceAll(MAIN, '<main>')
  .replaceAll(RAIZ, '<sitio>')
  /* As pastas temporárias compõem-se por partes, para que este ficheiro não as traga escritas (o limpador dos registos
     trocava-as, e a expressão partia-se). */
  .replace(new RegExp('/' + 'private' + '/' + 'tmp' + '/[^\\s\'"]+', 'g'), '<rascunho>')
  .replace(new RegExp('/' + 'Users' + '/[^/\\s]+', 'g'), '<pasta-local>');
const git = (/** @type {string} */ cwd, /** @type {string[]} */ a) => execFileSync('git', a, { cwd, encoding: 'utf8' });

/* AS DUAS ÁRVORES: cada construção é a da sua cabeça, e cada árvore está sem mudanças seguidas. */
const cabeca = git(RAIZ, ['rev-parse', 'HEAD']).trim();
const estado = git(RAIZ, ['status', '--porcelain', '--untracked-files=no']);
const construcao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8')).commit;
assert.equal(construcao, cabeca, 'a L1 mede-se na construção da cabeça que está a ser medida');
const cabecaMain = git(MAIN, ['rev-parse', 'HEAD']).trim();
const estadoMain = git(MAIN, ['status', '--porcelain', '--untracked-files=no']);
const construcaoMain = JSON.parse(fs.readFileSync(path.join(MAIN, 'dist', 'version.json'), 'utf8')).commit;
assert.equal(construcaoMain, cabecaMain, 'a construção do main é a da sua cabeça');
assert.equal(estadoMain, '', 'a worktree do main está sem mudanças seguidas');
/* A cabeça do main é antepassada da fusão: o `git merge-base --is-ancestor` sai com 1 se não for, e a chamada falha. */
git(RAIZ, ['merge-base', '--is-ancestor', cabecaMain, cabeca]);

/** A lista inteira das páginas no registo da régua (a função da R4-b). @param {string} texto */
const listaDaRegua = (texto) => {
  const urls = [];
  for (const l of texto.split('\n')) { const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos/); if (m) urls.push(m[1]); }
  const t = texto.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
  assert(t && urls.length === Number(t[1]), 'a amostra tem de conter a lista inteira');
  return urls;
};

/** A régua de uma árvore, corrida sobre a sua construção, e a contagem das vezes pela cópia da regra. */
function medeArvore(/** @type {string} */ raiz, /** @type {string} */ nomeDoRegisto, /** @type {string} */ cab) {
  const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: raiz, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
  assert([0, 1].includes(r.status ?? -1), `a régua não correu em ${nomeDoRegisto}`);
  const log = limpa(`${r.stdout}${r.stderr}`);
  fs.writeFileSync(path.join(SAIDA, nomeDoRegisto), log);
  const urls = listaDaRegua(log);
  const ficheiro = path.join(SAIDA, `l1-destinos-${cab.slice(0, 8)}.json`);
  const c = spawnSync(process.execPath, [CONTAR, raiz, ficheiro, String(urls.length)], { cwd: raiz, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  assert.equal(c.status, 0, `a contagem das vezes não bate com a régua: ${limpa(`${c.stdout}${c.stderr}`)}`);
  /** @type {Record<string, Record<string, number>>} */
  const repetidos = JSON.parse(fs.readFileSync(ficheiro, 'utf8')).repetidos_por_pagina;
  assert.deepEqual(Object.keys(repetidos).sort(), [...urls].sort(), 'as páginas da contagem são as da régua');
  return { codigo: r.status, log, urls, repetidos, ficheiro: path.relative(RAIZ, ficheiro) };
}

const doMain = medeArvore(MAIN, `l1-main-${cabecaMain.slice(0, 8)}-check-lugar.log`, cabecaMain);
assert.equal(doMain.codigo, 0, 'a régua do main passa na construção do main');
const daFusao = medeArvore(RAIZ, 'l1-fusao-check-lugar.log', cabeca);

/**
 * A comparação com as vezes (a da R4-b).
 * @param {Record<string, Record<string, number>>} a @param {Record<string, Record<string, number>>} b
 */
function comVezes(a, b) {
  const novas = Object.keys(b).filter((u) => !(u in a)).sort();
  const sairam = Object.keys(a).filter((u) => !(u in b)).sort();
  const agravadas = [];
  const aliviadas = [];
  let iguais = 0;
  for (const u of Object.keys(b)) {
    if (!(u in a)) continue;
    const pior = Object.entries(b[u]).some(([d, n]) => n > (a[u][d] ?? 0));
    const melhor = Object.entries(a[u]).some(([d, n]) => n > (b[u][d] ?? 0));
    if (pior) agravadas.push(u); else if (melhor) aliviadas.push(u); else iguais++;
  }
  return { novas, sairam, agravadas: agravadas.sort(), aliviadas: aliviadas.sort(), iguais };
}
/** A comparação sem as vezes (a do R4): o conjunto das páginas e o número de destinos repetidos de cada uma. */
function semVezes(/** @type {Record<string, Record<string, number>>} */ a, /** @type {Record<string, Record<string, number>>} */ b) {
  const novas = Object.keys(b).filter((u) => !(u in a));
  const agravadas = Object.keys(b).filter((u) => u in a && Object.keys(b[u]).length > Object.keys(a[u]).length);
  return { novas: novas.length, agravadas: agravadas.length };
}

const esperadas = EXPLICACOES.flatMap((e) => LANGS.map((lang) => routePath('explicacao', lang, { slug: e.slug }))).sort();

/**
 * As portas de um destino repetido numa página de explicação, lidas do HTML: as âncoras fora do cabeçalho e do rodapé,
 * com o mesmo destino, cada uma dita pelo lugar onde está.
 * @param {string} url @param {string} destino
 */
function portasDe(url, destino) {
  const raiz = parse(fs.readFileSync(path.join(RAIZ, 'dist', url.slice(1), 'index.html'), 'utf8'));
  const lang = url.startsWith('/en/') ? 'en' : 'pt';
  const mobilia = new Set();
  for (const el of [raiz.querySelector('header'), raiz.querySelector('footer')].filter(Boolean)) {
    mobilia.add(el);
    for (const d of /** @type {any} */ (el).querySelectorAll('*')) mobilia.add(d);
  }
  const desenhadas = new Set(raiz.querySelectorAll('figure[data-forma="barras-do-livro"] li[data-barra]').map((li) => li.getAttribute('data-barra')));
  const portas = [];
  for (const a of raiz.querySelector('body').querySelectorAll('a[href]')) {
    if (mobilia.has(a)) continue;
    const href = a.getAttribute('href') ?? '';
    const chave = href.split('#')[0].replace(/\/$/, '') || (href.startsWith('/') ? '/' : '');
    if (chave !== destino) continue;
    const linha = a.parentNode?.querySelector?.('[data-claim]')?.getAttribute('data-claim') ?? null;
    const recibo = linha ? routePath('linha', lang, { slug: linha }) : null;
    const selo = a.classList.contains('src-chip') && recibo === destino;
    const noTexto = Boolean(a.closest('[data-explicacao-paragrafo]'));
    const itemDaLegenda = a.closest('li[data-figura-numero]');
    const naLegenda = Boolean(itemDaLegenda?.closest('details[data-legenda-selos]')) && itemDaLegenda.getAttribute('data-figura-numero') === linha;
    portas.push({ linha, selo, onde: noTexto ? 'texto' : naLegenda ? 'legenda' : 'outro', desenhada: Boolean(linha && desenhadas.has(linha)) });
  }
  return portas;
}

/**
 * A conferência inteira, com a contagem do main e a da fusão.
 * @param {Record<string, Record<string, number>>} a @param {Record<string, Record<string, number>>} b
 * @param {(url: string, destino: string) => ReturnType<typeof portasDe>} [portas]
 */
function confere(a, b, portas = portasDe) {
  const cmp = comVezes(a, b);
  assert.deepEqual(cmp.novas, esperadas, 'as páginas novas têm de ser exatamente as das explicações declaradas');
  assert.deepEqual(cmp.agravadas, [], 'nenhuma página do main pode ficar agravada, destino a destino e vez a vez');
  /** @type {Record<string, { destinos: number, recibos: string[] }>} */
  const novas = {};
  for (const url of cmp.novas) {
    const recibos = [];
    for (const [destino, vezes] of Object.entries(b[url])) {
      assert.equal(vezes, 2, `${url}: ${destino} abre-se ${vezes} vezes; um recibo desenhado e citado abre-se duas`);
      const p = portas(url, destino);
      assert.equal(p.length, vezes, `${url}: a leitura das portas de ${destino} não bate com a contagem da régua`);
      const ondes = p.map((x) => x.onde).sort();
      assert.deepEqual(ondes, ['legenda', 'texto'], `${url}: ${destino} não é o selo do texto e o da legenda (${ondes.join(', ')})`);
      assert(p.every((x) => x.selo && x.desenhada), `${url}: ${destino} não é o recibo de uma linha desenhada e citada`);
      recibos.push(destino);
    }
    novas[url] = { destinos: recibos.length, recibos: recibos.sort() };
  }
  return { cmp, novas };
}

const { cmp, novas } = confere(doMain.repetidos, daFusao.repetidos);

/* OS CONHECIDOS-POSITIVOS, em memória. */
/** @type {{ nome: string, mordeu: boolean }[]} */
const plantas = [];
/** @param {string} nome @param {() => void} fn */
function planta(nome, fn) { let mordeu = false; try { fn(); } catch { mordeu = true; } assert(mordeu, `a planta não mordeu: ${nome}`); plantas.push({ nome, mordeu }); }
const doMainUmDestino = Object.keys(doMain.repetidos).find((u) => Object.keys(doMain.repetidos[u]).length === 1 && u in daFusao.repetidos);
assert(doMainUmDestino, 'as plantas precisam de uma página do main com um destino repetido');
{
  const plantada = structuredClone(daFusao.repetidos);
  const d = Object.keys(plantada[doMainUmDestino])[0];
  plantada[doMainUmDestino][d] += 1;
  const morde = comVezes(doMain.repetidos, plantada).agravadas.includes(doMainUmDestino);
  const sem = semVezes(doMain.repetidos, plantada);
  const semBase = semVezes(doMain.repetidos, daFusao.repetidos);
  const cala = sem.agravadas === semBase.agravadas && sem.novas === semBase.novas;
  assert(morde && cala, 'a planta da omissão das vezes tem de morder com as vezes e passar calada sem elas');
  plantas.push({ nome: `A omissão das vezes: um destino de ${doMainUmDestino} a repetir-se mais uma vez é agravado com as vezes e passa calado na comparação sem elas`, mordeu: true });
}
planta('Uma página a mais fora das explicações é recusada', () => {
  const b = structuredClone(daFusao.repetidos);
  b['/planta-fusao-fora-das-explicacoes'] = { '/sobre': 2 };
  confere(doMain.repetidos, b);
});
planta('Uma página das explicações em falta é recusada', () => {
  const b = structuredClone(daFusao.repetidos);
  delete b[esperadas[0]];
  confere(doMain.repetidos, b);
});
planta('Uma página do main com um destino novo repetido é recusada', () => {
  const b = structuredClone(daFusao.repetidos);
  b[doMainUmDestino]['/planta-fusao-destino-novo'] = 2;
  confere(doMain.repetidos, b);
});
planta('Um destino repetido numa página nova que não é um recibo desenhado e citado é recusado', () => {
  const b = structuredClone(daFusao.repetidos);
  b[esperadas[0]]['/sobre'] = 2;
  confere(doMain.repetidos, b, (url, destino) => (destino === '/sobre' ? [{ linha: null, selo: false, onde: 'outro', desenhada: false }, { linha: null, selo: false, onde: 'outro', desenhada: false }] : portasDe(url, destino)));
});
planta('Um recibo desenhado e citado com três portas é recusado', () => {
  const b = structuredClone(daFusao.repetidos);
  const d = Object.keys(b[esperadas[0]])[0];
  b[esperadas[0]][d] = 3;
  confere(doMain.repetidos, b);
});
planta('Uma entrada tirada à lista da régua deixa de reconciliar com a contagem dela', () => {
  const linhas = daFusao.log.split('\n');
  const i = linhas.findIndex((l) => /^\s+· \S+ · \d+ destinos repetidos/.test(l));
  listaDaRegua(linhas.filter((_, k) => k !== i).join('\n'));
});

const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'lugar-tetos-b1.json'), 'utf8'));
const dados = {
  o_que_e: 'A L1 depois da fusão com o main de 06.10.2026 (o R4, em 42c7ed7e), contada destino a destino e vez a vez como a passagem R4-b a mede: a construção da cabeça da fusão contra a da cabeça do main, pela mesma cópia da regra da régua. As páginas novas são as duas da primeira explicação, nas duas edições; nenhuma página do main ficou agravada; cada destino repetido de uma página nova é o recibo de uma linha que uma figura desenha e que o texto cita, aberto pelo selo do valor no texto e pelo selo do mesmo valor na legenda do instrumento, as duas portas obrigatórias pela regra do portão de HTML. A régua não muda; muda a medição que o teto aponta.',
  data: new Date().toISOString(),
  cabeca,
  estado_seguido: estado,
  construcao,
  main: { cabeca: cabecaMain, construcao: construcaoMain, estado_seguido: estadoMain, contagem: doMain.ficheiro, registo_da_regua: `design/especime-v3/medicoes/ex1-2026-10-05/fusao/l1-main-${cabecaMain.slice(0, 8)}-check-lugar.log`, codigo_da_regua: doMain.codigo },
  contagem: daFusao.ficheiro,
  origem: 'design/especime-v3/medicoes/ex1-2026-10-05/fusao/l1-fusao-check-lugar.log',
  comando: 'AMOSTRA=100000 node scripts/check-lugar.mjs, em cada árvore, e design/especime-v3/medicoes/r4-2026-10-05/contar-destinos-l1.mjs sobre cada construção',
  codigo_da_regua: daFusao.codigo,
  teto_lido: teto.l1_paginas,
  /* «estudos» é o nome histórico do campo que check-lugar lê; conta páginas. */
  contagens: {
    estudos: daFusao.urls.length,
    l1_paginas: daFusao.urls.length,
    main: doMain.urls.length,
    novas: cmp.novas.length,
    sairam: cmp.sairam.length,
    agravadas: cmp.agravadas.length,
    aliviadas: cmp.aliviadas.length,
    iguais: cmp.iguais,
  },
  novas,
  sairam: cmp.sairam,
  aliviadas: cmp.aliviadas,
  conhecidos_positivos: plantas,
};
fs.writeFileSync(path.join(SAIDA, 'l1-fusao.json'), `${JSON.stringify(dados, null, 2)}\n`);
console.log(JSON.stringify({ cabeca, main: cabecaMain, contagens: dados.contagens, novas: Object.fromEntries(Object.entries(novas).map(([u, v]) => [u, v.destinos])), conhecidos_positivos: plantas.map((p) => p.mordeu) }, null, 2));
