/**
 * RP4-c: o peso de cada página com desenhos das séries, medido sobre um `dist/` construído (o ponto 4 do mandato: «o
 * peso de cada página com desenhos medido antes e depois»). Não escreve no `dist/`.
 *
 * Lê todas as páginas HTML do `dist/` e, para cada uma que tenha pelo menos um `svg[data-forma="serie-do-pais"]`,
 * escreve o tamanho em bytes do ficheiro, comprimido com gzip (o nível por omissão do Node, 6) e com brotli (a
 * qualidade por omissão do Node, 11), o número de desenhos, o número de zonas de leitura (uma por marca
 * `data-ponto-periodo`, que cada zona leva uma vez) e o resumo sha256 dos bytes lidos. A contagem das páginas é o conhecido-positivo: a primeira página tem de estar
 * entre elas, e o recibo da inflação também.
 *
 * Uso: node design/especime-v3/medicoes/rp4c-2026-10-05/medir-peso.mjs --dist <pasta do dist> --json <saída>
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createHash } from 'node:crypto';

const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const DIST = path.resolve(argumento('--dist') ?? 'dist');
const SAIDA = argumento('--json');
if (!SAIDA) throw Error('falta --json <saída>');
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const paginas = [];
let lidas = 0;
const anda = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) anda(f);
    else if (e.name.endsWith('.html')) {
      lidas++;
      const bytes = fs.readFileSync(f);
      const html = bytes.toString('utf8');
      const desenhos = (html.match(/data-forma="serie-do-pais"/g) ?? []).length;
      if (!desenhos) continue;
      paginas.push({
        pagina: path.relative(DIST, f).split(path.sep).join('/'),
        bytes: bytes.length,
        gzip: zlib.gzipSync(bytes).length,
        brotli: zlib.brotliCompressSync(bytes).length,
        desenhos,
        zonas_de_leitura: (html.match(/data-ponto-periodo="/g) ?? []).length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    }
  }
};
anda(DIST);
paginas.sort((a, b) => a.pagina.localeCompare(b.pagina));
const total = (k) => paginas.reduce((n, p) => n + p[k], 0);
const saida = {
  dist_commit: versao.commit,
  construido_em: versao.construido_em,
  paginas_lidas: lidas,
  paginas_com_desenhos: paginas.length,
  conhecido_positivo_primeira_pagina: paginas.some((p) => p.pagina === 'index.html'),
  conhecido_positivo_recibo_da_inflacao: paginas.some((p) => p.pagina === 'livro-razao/series/serie-ipc-variacao-homologa/index.html'),
  desenhos: total('desenhos'),
  zonas_de_leitura: total('zonas_de_leitura'),
  bytes: total('bytes'),
  gzip: total('gzip'),
  brotli: total('brotli'),
  paginas,
};
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 2) + '\n');
console.log(`${lidas} páginas lidas · ${paginas.length} com desenhos · ${saida.desenhos} desenhos · ${saida.zonas_de_leitura} zonas · ${saida.bytes} bytes · gzip ${saida.gzip} · brotli ${saida.brotli}`);
