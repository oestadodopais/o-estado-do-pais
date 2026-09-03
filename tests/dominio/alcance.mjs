#!/usr/bin/env node
/**
 * =============================================================================
 * O ALCANCE · quantas das 314 linhas da §1.90 se apanham a partir da página do
 * domínio, e a quantas portas de distância
 * =============================================================================
 *
 * NÃO É UM PORTÃO: é a régua da medida B3 do brief F1.2, «um guião que segue as
 * ligações a partir da página e conta os ids».
 *
 * ---------------------------------------------------------------------------
 * O QUE ELE SEGUE, E O QUE CONTA
 * ---------------------------------------------------------------------------
 * Parte de `/dominios/economia-e-financas-publicas`, lê o HTML construído, junta
 * as linhas que a página cita (`data-claim`, `data-linha-claim`) e as ligações
 * internas que ela abre. Depois abre essas, e as delas, até à profundidade que
 * lhe pedirem. Em cada nível diz quantas das 314 já apanhou.
 *
 * AS 314 SÃO AS DA §1.90, E LEEM-SE DO LIVRO-RAZÃO E NÃO DE UMA LISTA ESCRITA:
 * são as seis linhas do estudo `dominios-2026` mais as 308 linhas do ganho médio
 * mensal por concelho, que a §1.90 pôs em `concelhos-2026` «por decisão do lugar
 * de direção, porque são medidas de concelho como as outras sete». As 308
 * reconhecem-se pelo localizador da fonte (o indicador 0012656 do INE), que é o
 * mesmo facto por que `src/data/concelhos.mjs` as liga a cada concelho.
 *
 * NÃO SEGUE PARA FORA. Uma ligação para outro sítio não é uma porta desta casa;
 * uma âncora (`#…`) é a mesma página.
 *
 * Uso:  node tests/dominio/alcance.mjs [--profundidade=3] [--json <ficheiro>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { loadClaims } from '../../src/lib/ledger.mjs';
import { routePath } from '../../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const PROFUNDIDADE = Number((argv.find((a) => a.startsWith('--profundidade=')) ?? '').slice(15) || 3);

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/* ------------------------------------------------- as 314 linhas da §1.90 */

const LOCALIZADOR_DO_GANHO = /^INE, indicador 0012656, .+ \(código \w+\), dados de 2024$/;
const claims = loadClaims();
/** @type {Set<string>} */
const AS_314 = new Set();
for (const [id, linha] of claims) {
  if (linha.study === 'dominios-2026') {
    AS_314.add(id);
    continue;
  }
  const documento = /** @type {{ locator?: unknown }|null} */ (
    typeof linha.document === 'object' ? linha.document : null
  );
  const localizador = typeof documento?.locator === 'string' ? documento.locator : '';
  if (LOCALIZADOR_DO_GANHO.test(localizador)) AS_314.add(id);
}

/* ------------------------------------------------------------ a travessia */

/** @param {string} caminho */
function ficheiroDe(caminho) {
  const limpo = caminho.split('#')[0].split('?')[0];
  const f = path.join(DIST, limpo.replace(/^\//, ''));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) return path.join(f, 'index.html');
  if (fs.existsSync(f) && f.endsWith('.html')) return f;
  const comIndex = path.join(f, 'index.html');
  if (fs.existsSync(comIndex)) return comIndex;
  const comHtml = `${f}.html`;
  return fs.existsSync(comHtml) ? comHtml : null;
}

const partida = routePath('dominio', 'pt', { slug: 'economia-e-financas-publicas' });
/** @type {Set<string>} */
const vistas = new Set();
/** @type {Set<string>} */
const apanhadas = new Set();
/** @type {{ porta: number, paginas: number, linhas: number, das314: number }[]} */
const niveis = [];

let fronteira = [partida];
for (let porta = 0; porta <= PROFUNDIDADE && fronteira.length > 0; porta++) {
  /** @type {string[]} */
  const seguinte = [];
  let paginas = 0;
  for (const caminho of fronteira) {
    const limpo = caminho.split('#')[0];
    if (vistas.has(limpo)) continue;
    vistas.add(limpo);
    const ficheiro = ficheiroDe(limpo);
    if (ficheiro === null) continue;
    paginas++;
    const root = parse(fs.readFileSync(ficheiro, 'utf8'));
    for (const el of root.querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim');
      if (id) apanhadas.add(id);
    }
    for (const el of root.querySelectorAll('[data-linha-claim]')) {
      const id = el.getAttribute('data-linha-claim');
      if (id) apanhadas.add(id);
    }
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href') ?? '';
      if (!href.startsWith('/')) continue;
      const alvo = href.split('#')[0];
      if (alvo === '' || vistas.has(alvo)) continue;
      seguinte.push(alvo);
    }
  }
  const das314 = [...AS_314].filter((id) => apanhadas.has(id)).length;
  niveis.push({ porta, paginas, linhas: apanhadas.size, das314 });
  console.log(
    `  ${porta} porta(s) · ${paginas} página(s) nova(s) · ${apanhadas.size} linhas citadas · ` +
      `${das314} das ${AS_314.size} da §1.90`,
  );
  fronteira = seguinte;
}

const faltam = [...AS_314].filter((id) => !apanhadas.has(id));
const json = argv.indexOf('--json');
if (json !== -1 && argv[json + 1]) {
  fs.writeFileSync(
    argv[json + 1],
    JSON.stringify({ partida, profundidade: PROFUNDIDADE, total: AS_314.size, niveis, faltam }, null, 2),
  );
}

if (faltam.length > 0) {
  console.error(
    vermelho(`\n  ${faltam.length} das ${AS_314.size} linhas não se alcançam em ${PROFUNDIDADE} portas:`),
  );
  console.error(cinza(`  ${faltam.slice(0, 10).join(', ')}${faltam.length > 10 ? ' …' : ''}\n`));
  process.exit(1);
}
console.log(
  verde(`\n  as ${AS_314.size} linhas da §1.90 alcançam-se a partir de ${partida}`) +
    cinza(` em ${PROFUNDIDADE} porta(s)\n`),
);
