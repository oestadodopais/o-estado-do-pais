/** RP4-n: as listas e os apoios medidos antes e depois, sem rede.
 * Uso: node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs antes|depois
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { LINHAS_POR_CONFIRMAR_NA_FONTE } from '../../../../src/data/o-que-e-das-familias.mjs';
import { SERIES_POR_CONFIRMAR_NA_FONTE } from '../../../../src/data/o-que-e-das-series.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';
import { parse } from 'node-html-parser';

const fase = process.argv[2];
if (!['antes', 'depois'].includes(fase)) throw Error('Indique antes ou depois.');
const pasta = path.dirname(new URL(import.meta.url).pathname);
const auditoria = JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
const apoios = (a) => [a, ...(a.ou ?? []).flatMap(apoios)];
const entradas = Object.fromEntries(['familias', 'series'].map((chave) => [chave,
  auditoria[chave].filter(e => e.folhas).map(e => ({
    chave: e.chaves ?? e.concelho ?? e.serie,
    por_confirmar_na_fonte: e.por_confirmar_na_fonte ?? null,
    folhas: e.folhas,
    partes_pelo_nome: e.folhas.flatMap(f => f.partes).filter(p => (p.apoios ?? []).flatMap(apoios).some(a => a.declaracao === 'nome')).length,
  })),
]));
const html = [];
function visitar(dir) {
  for (const f of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) visitar(p);
    else if (p.endsWith('.html')) {
      const bytes = fs.readFileSync(p);
      const root = parse(bytes.toString());
      root.querySelectorAll('script,style').forEach(e => e.remove());
      const texto = root.textContent;
      const marcas = [...texto.matchAll(/\[(?:a verificar|to verify)\]/gi)].length;
      if (marcas || root.querySelector('.marcador')) html.push({ficheiro:p, marcas,
        frases:root.querySelectorAll('[data-por-confirmar-na-fonte]').length,
        contextos:root.querySelectorAll('.marcador').map(e => e.parentNode?.textContent.trim().slice(0,300)),
        sha256:createHash('sha256').update(bytes).digest('hex')});
    }
  }
}
if (fs.existsSync('dist/version.json')) visitar('dist');
const resultado = {
  comando: `node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs ${fase}`,
  cabeca: execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  construcao: fs.existsSync('dist/version.json') ? JSON.parse(fs.readFileSync('dist/version.json')) : null,
  linhas: [...LINHAS_POR_CONFIRMAR_NA_FONTE], series: [...SERIES_POR_CONFIRMAR_NA_FONTE],
  contagens: {linhas:LINHAS_POR_CONFIRMAR_NA_FONTE.length, series:SERIES_POR_CONFIRMAR_NA_FONTE.length,
    partes_pelo_nome_familias:entradas.familias.reduce((s,e)=>s+e.partes_pelo_nome,0),
    partes_pelo_nome_series:entradas.series.reduce((s,e)=>s+e.partes_pelo_nome,0),
    paginas_com_marcadores:html.length, marcas_nas_paginas:html.reduce((s,e)=>s+e.marcas,0)},
  entradas, origens:ORIGENS_DAS_DEFINICOES, paginas_com_marcadores:html,
};
fs.mkdirSync(path.join(pasta,fase),{recursive:true});
fs.writeFileSync(path.join(pasta,fase,'medidas.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify(resultado.contagens));
