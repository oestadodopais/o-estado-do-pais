#!/usr/bin/env node
/**
 * =============================================================================
 * A RECONTA DOS NOMES OFICIAIS · achado 5 da leitura a frio do Codex, 16.09.2026
 * =============================================================================
 *
 * O relatório do bloco dizia «14 com o do INE e o da PORDATA, três com um só»,
 * que dá 31 nomes por edição, e no parágrafo seguinte dizia 26. As duas contas
 * não podiam estar as duas certas, e a leitura a frio apanhou-o sem poder
 * decidir qual, porque o `src/data/enquadramento/nomes.json` não ia no pacote.
 *
 * ESTA RÉGUA NÃO DECIDE NADA E NÃO FECHA NENHUMA CONSTRUÇÃO: conta sobre o
 * `dist/` e sobre o `nomes.json`, e imprime a conta com a origem de cada nome.
 * O que ela responde, e são três perguntas:
 *
 *   1. quantos nomes oficiais é que cada edição rende, e onde (no recibo de uma
 *      linha, ou no título de um cartão que não tem nome do projeto);
 *   2. quantas LINHAS os rendem, e quantas rendem dois nomes e quantas um só;
 *   3. se cada nome rendido vem de uma linha marcada `exata` no `nomes.json` e
 *      é, carácter a carácter, um dos nomes que essa linha declara. Um nome de
 *      uma linha `proxima` no recibo era este projeto a dizer que duas medidas
 *      são a mesma sem o motor o ter confirmado.
 *
 * Uso:  node design/especime-v3/medicoes/p3-2026-09-16/nomes-oficiais.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const NOMES = path.join(RAIZ, 'src', 'data', 'enquadramento', 'nomes.json');

const fora = JSON.parse(fs.readFileSync(NOMES, 'utf8'));
/** @type {Map<string, { estado: string, nomes: [string, string][] }>} */
const porLinha = new Map();
for (const i of fora.indicadores) {
  /** @type {[string, string][]} */
  const nomes = [];
  if (i.nome_ine && typeof i.nome_ine === 'object' && i.nome_ine.nome) nomes.push(['INE', i.nome_ine.nome]);
  if (i.nome_pordata && i.nome_pordata.nome) nomes.push(['PORDATA', i.nome_pordata.nome]);
  porLinha.set(i.id_da_linha, { estado: i.correspondencia, nomes });
}

const contas = { pt: { recibo: 0, cartao: 0 }, en: { recibo: 0, cartao: 0 } };
const porFonte = { INE: 0, PORDATA: 0 };
/** @type {Map<string, number>} */
const linhasDoRecibo = new Map();
/** @type {string[]} */
const problemas = [];

/** @param {string} dir */
const anda = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name.endsWith('.html')) le(p);
  }
};

/** @param {string} ficheiro */
const le = (ficheiro) => {
  const cru = fs.readFileSync(ficheiro, 'utf8');
  if (!cru.includes('nome-oficial-da-medida')) return;
  const rel = path.relative(DIST, ficheiro).split(path.sep).join('/');
  const lang = rel.startsWith('en/') ? 'en' : 'pt';
  const recibo = rel.match(/^(?:en\/ledger|livro-razao)\/([^/]+)\/index\.html$/);
  for (const el of parse(cru).querySelectorAll('[data-nonledger="nome-oficial-da-medida"]')) {
    const texto = el.textContent.replace(/\s+/g, ' ').trim();
    if (!recibo) {
      contas[lang].cartao++;
      continue;
    }
    const slug = recibo[1];
    contas[lang].recibo++;
    if (lang === 'pt') linhasDoRecibo.set(slug, (linhasDoRecibo.get(slug) ?? 0) + 1);
    const info = porLinha.get(slug);
    if (!info) {
      problemas.push(`${rel}: a linha não está em nomes.json`);
      continue;
    }
    if (info.estado !== 'exata') {
      problemas.push(`${rel}: a linha está marcada «${info.estado}» e não «exata»`);
      continue;
    }
    /* O TEXTO RENDIDO É O NOME MAIS A DATA DE LEITURA, e é por isso que se
       compara pelo princípio: o nome tem de estar lá inteiro, do primeiro
       carácter ao último, e a data vem a seguir dele. */
    const bate = info.nomes.find(([, n]) => texto.startsWith(n));
    if (!bate) problemas.push(`${rel}: «${texto.slice(0, 70)}…» não é nenhum dos nomes declarados`);
    else if (lang === 'pt') porFonte[bate[0]]++;
  }
};

anda(DIST);

const comDois = [...linhasDoRecibo.values()].filter((v) => v === 2).length;
const comUm = [...linhasDoRecibo.values()].filter((v) => v === 1).length;
const exatas = [...porLinha.values()].filter((i) => i.estado === 'exata').length;

console.log('');
console.log('  OS NOMES OFICIAIS, CONTADOS SOBRE O dist/ E O nomes.json');
console.log('');
console.log(`  no nomes.json · ${porLinha.size} indicador(es), ${exatas} marcados «exata»`);
console.log(
  `  no recibo     · ${contas.pt.recibo} por edição (${contas.pt.recibo + contas.en.recibo} nas duas), ` +
    `de ${linhasDoRecibo.size} linha(s): ${comDois} com os dois nomes e ${comUm} com um só`,
);
console.log(`                  por fonte: INE ${porFonte.INE} · PORDATA ${porFonte.PORDATA}`);
console.log(
  `  no cartão     · ${contas.pt.cartao} por edição (${contas.pt.cartao + contas.en.cartao} nas duas): ` +
    `os cartões sem nome do projeto encabeçam-se com o nome oficial`,
);
console.log(
  `  o total       · ${contas.pt.recibo + contas.pt.cartao} por edição, ` +
    `${contas.pt.recibo + contas.pt.cartao + contas.en.recibo + contas.en.cartao} nas duas`,
);
console.log('');
if (problemas.length === 0) {
  console.log('  ✓ cada nome oficial rendido vem de uma linha «exata» e é, carácter a carácter, um dos nomes dela.');
} else {
  console.log(`  ✗ ${problemas.length} problema(s):`);
  for (const x of problemas) console.log(`    · ${x}`);
}
console.log('');
process.exit(problemas.length === 0 ? 0 : 1);
