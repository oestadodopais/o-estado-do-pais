/**
 * OS NOMES OFICIAIS NAS PÁGINAS CONSTRUÍDAS (bloco M3b, 22.09.2026).
 *
 * Conta no `dist/` o que o bloco promete medir: quantos recibos rendem um nome
 * oficial e de que fonte, quantos títulos de cartão vêm do degrau 2 da escada
 * dos nomes, e que linhas são. Não é um portão: o portão é o `check:nomes`, que
 * confere carácter a carácter. Isto é a medição do relatório, e existe para que
 * nenhum número do relatório seja escrito de cabeça.
 *
 * Uso:  node design/especime-v3/medicoes/m3b-2026-09-22/medir-nomes.mjs
 *       OEDP_DIST=<dir> mede outra construção.
 * Escreve `nomes-no-dist.json` ao lado, e imprime o resumo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const { temAviso } = await import(path.join(RAIZ, 'src', 'lib', 'aviso-do-motor.mjs'));
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const FICHEIRO = path.join(RAIZ, 'src', 'data', 'enquadramento', 'nomes.json');

/* O FICHEIRO DO MOTOR, LIDO AQUI PELA MARCA POR FONTE, e não importado de
   `src/lib/enquadramento.mjs`: uma medição que chamasse a função que compõe a
   página media a função e não o ficheiro. */
const j = JSON.parse(fs.readFileSync(FICHEIRO, 'utf8'));
/** @type {Map<string, {nome: string, endereco: string, fonte: string}[]>} */
const confirmados = new Map();
for (const i of j.indicadores ?? []) {
  const c = i?.correspondencia;
  if (c === null || typeof c !== 'object' || Array.isArray(c)) continue;
  for (const [campo, fonte, chave] of [
    ['nome_ine', 'INE', 'ine'],
    ['nome_pordata', 'PORDATA', 'pordata'],
  ]) {
    const o = i?.[campo];
    if (!o || typeof o !== 'object') continue;
    if (c[chave] !== 'exata' || o.estado !== 'lido' || o.mesma_medida !== true) continue;
    /* AS MESMAS SEIS CONDIÇÕES DOS LEITORES, e não cinco (leitura a frio do M3b,
       achado 10): faltava a hora de leitura, e uma medição que contasse como
       confirmado um nome que `nomeOficial()` recusa dava um número que a página
       não podia mostrar. O aviso lê-se a qualquer profundidade, pela função que
       os três leitores usam. */
    if (temAviso(o)) continue;
    if (typeof o.nome !== 'string' || o.nome === '' || typeof o.endereco !== 'string' || o.endereco === '') continue;
    if (typeof o.lido_em !== 'string' || o.lido_em === '') continue;
    if (!confirmados.has(i.id_da_linha)) confirmados.set(i.id_da_linha, []);
    confirmados.get(i.id_da_linha).push({ nome: o.nome, endereco: o.endereco, fonte });
  }
}

/** Todas as páginas de `dist/`, em caminhos relativos com barras. */
function* paginas(dir, base = dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* paginas(p, base);
    else if (e.name.endsWith('.html')) yield path.relative(base, p).split(path.sep).join('/');
  }
}

const porNome = new Map();
for (const [id, lista] of confirmados) for (const x of lista) porNome.set(x.nome, { id, fonte: x.fonte });

const recibos = [];
const cartoes = [];
let lidas = 0;
for (const rel of paginas(DIST)) {
  lidas += 1;
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  if (!html.includes('nome-oficial-da-medida') && !html.includes('data-nome="oficial"')) continue;
  const root = parse(html);
  const m = /^(livro-razao|en\/ledger)\/([^/]+)\/index\.html$/.exec(rel);
  const edicao = rel.startsWith('en/') ? 'en' : 'pt';
  for (const el of root.querySelectorAll('[data-nonledger="nome-oficial-da-medida"], [data-nome="oficial"]')) {
    const eCartao = m === null && el.getAttribute('data-nome') === 'oficial';
    if (eCartao) {
      const id = el.getAttribute('data-de-linha') ?? '';
      const texto = el.text.trim();
      cartoes.push({ pagina: rel, edicao, id, texto, fonte: porNome.get(texto)?.fonte ?? null });
      continue;
    }
    const a = el.querySelector('a');
    const texto = (a ?? el).text.trim();
    recibos.push({
      pagina: rel,
      edicao,
      id: m ? m[2] : null,
      texto,
      href: a?.getAttribute('href') ?? null,
      fonte: porNome.get(texto)?.fonte ?? null,
    });
  }
}

const conta = (lista, f) => lista.filter((x) => x.fonte === f).length;
const linhasComNome = new Set(recibos.map((r) => r.id));
const resumo = {
  cabeca: null,
  dist: path.relative(RAIZ, DIST),
  ficheiro_sha256: null,
  confirmados_no_ficheiro: {
    total: [...confirmados.values()].flat().length,
    ine: [...confirmados.values()].flat().filter((x) => x.fonte === 'INE').length,
    pordata: [...confirmados.values()].flat().filter((x) => x.fonte === 'PORDATA').length,
    linhas: confirmados.size,
  },
  paginas_lidas: lidas,
  recibos: {
    total: recibos.length,
    ine: conta(recibos, 'INE'),
    pordata: conta(recibos, 'PORDATA'),
    fora_dos_confirmados: recibos.filter((x) => x.fonte === null).length,
    pt: recibos.filter((x) => x.edicao === 'pt').length,
    en: recibos.filter((x) => x.edicao === 'en').length,
    linhas: [...linhasComNome].sort(),
  },
  cartoes: {
    total: cartoes.length,
    ine: conta(cartoes, 'INE'),
    pordata: conta(cartoes, 'PORDATA'),
    fora_dos_confirmados: cartoes.filter((x) => x.fonte === null).length,
    pt: cartoes.filter((x) => x.edicao === 'pt').length,
    en: cartoes.filter((x) => x.edicao === 'en').length,
    linhas: [...new Set(cartoes.map((c) => c.id))].sort(),
    paginas: [...new Set(cartoes.map((c) => c.pagina))].sort(),
  },
};
resumo.ficheiro_sha256 = (await import('node:crypto')).createHash('sha256').update(fs.readFileSync(FICHEIRO)).digest('hex');
try {
  resumo.cabeca = (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
} catch {
  resumo.cabeca = null;
}
fs.writeFileSync(path.join(AQUI, 'nomes-no-dist.json'), `${JSON.stringify({ resumo, recibos, cartoes }, null, 2)}\n`);
console.log(
  `${lidas} páginas lidas · ${resumo.confirmados_no_ficheiro.total} nomes confirmados no ficheiro ` +
    `(${resumo.confirmados_no_ficheiro.ine} do INE, ${resumo.confirmados_no_ficheiro.pordata} da PORDATA, em ${resumo.confirmados_no_ficheiro.linhas} linhas)\n` +
    `recibos com nome oficial: ${resumo.recibos.total} (${resumo.recibos.ine} do INE, ${resumo.recibos.pordata} da PORDATA; ` +
    `${resumo.recibos.pt} na edição portuguesa, ${resumo.recibos.en} na inglesa; ${linhasComNome.size} linhas)\n` +
    `títulos de cartão do degrau 2: ${resumo.cartoes.total} (${resumo.cartoes.ine} do INE, ${resumo.cartoes.pordata} da PORDATA; ` +
    `${resumo.cartoes.pt} na edição portuguesa, ${resumo.cartoes.en} na inglesa)\n` +
    `fora dos confirmados: ${resumo.recibos.fora_dos_confirmados} em recibo, ${resumo.cartoes.fora_dos_confirmados} em cartão`,
);
