#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PACOTE DE CADEIAS DO LEITOR · o que o bloco P3 compara, antes e depois
 * ---------------------------------------------------------------------------
 * A regra 3 do §0 do brief: «a tabela das cadeias é completa por construção,
 * como no P1 (a comparação por código entre os dois pacotes de cadeias)». Uma
 * tabela lida de um `diff` é uma tabela que esquece o que o leitor do `diff` não
 * viu; uma tabela lida de dois pacotes é completa porque a comparação é de
 * conjuntos.
 *
 * O PACOTE É TODA A PROSA QUE UM GABARITO PODE RENDER, com a chave por onde ela
 * se chama: `src/i18n/strings.mjs` (as duas edições), os textos decididos
 * (`sobre.mjs`, `politica-ia.mjs`), o Método (`metodo.mjs`), as definições e os
 * nomes das medidas (`figuras.mjs`), os nomes das áreas, das regiões e dos
 * domínios, e os nomes do projeto que este bloco escreveu
 * (`nomes-das-medidas.mjs`). Não entra o livro-razão: os campos de uma linha são
 * transcrições da fonte, e este bloco não lhes toca.
 *
 * Uso:
 *   node design/especime-v3/medicoes/p3-2026-09-16/pacote-de-cadeias.mjs <raiz> > pacote.json
 *   node .../pacote-de-cadeias.mjs --compara antes.json depois.json
 *
 * `<raiz>` é a pasta que contém `src/`: a do repositório, ou uma cópia da cabeça
 * antiga tirada com `git archive`.
 */
import fs from 'node:fs';
import path from 'node:path';

const FICHEIROS = [
  'src/i18n/strings.mjs',
  'src/data/sobre.mjs',
  'src/data/politica-ia.mjs',
  'src/data/metodo.mjs',
  'src/data/figuras.mjs',
  'src/data/areas.mjs',
  'src/data/regioes.mjs',
  'src/data/dominios.mjs',
  'src/data/concelhos.mjs',
  'src/data/marcador.mjs',
  'src/data/correcoes.mjs',
  'src/data/nomes-das-medidas.mjs',
];

/** Percorre um objeto e devolve [caminho, texto] para cada cadeia. */
function achata(o, prefixo, visto, saida) {
  if (typeof o === 'string') {
    saida.push([prefixo, o]);
    return;
  }
  if (typeof o === 'function' || o === null || typeof o !== 'object') return;
  if (visto.has(o)) return;
  visto.add(o);
  if (Array.isArray(o)) {
    o.forEach((v, i) => achata(v, `${prefixo}[${i}]`, visto, saida));
    return;
  }
  for (const k of Object.keys(o)) achata(o[k], prefixo ? `${prefixo}.${k}` : k, visto, saida);
}

async function pacote(raiz) {
  const saida = [];
  for (const f of FICHEIROS) {
    const caminho = path.resolve(raiz, f);
    if (!fs.existsSync(caminho)) continue;
    const mod = await import(`file://${caminho}`);
    achata(mod, path.basename(f, '.mjs'), new Set(), saida);
  }
  /* A ORDEM É A DA CHAVE, para que dois pacotes se comparem sem depender da
     ordem por que os ficheiros os declararam. */
  saida.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return Object.fromEntries(saida);
}

const argv = process.argv.slice(2);
if (argv[0] === '--compara') {
  const antes = JSON.parse(fs.readFileSync(argv[1], 'utf8'));
  const depois = JSON.parse(fs.readFileSync(argv[2], 'utf8'));
  const chaves = [...new Set([...Object.keys(antes), ...Object.keys(depois)])].sort();
  const mudadas = [];
  for (const k of chaves) {
    const a = antes[k];
    const d = depois[k];
    if (a === d) continue;
    mudadas.push({ chave: k, antes: a ?? null, depois: d ?? null });
  }
  console.log(JSON.stringify({ antes: Object.keys(antes).length, depois: Object.keys(depois).length, mudadas }, null, 1));
} else {
  const raiz = argv[0] ?? process.cwd();
  console.log(JSON.stringify(await pacote(raiz), null, 1));
}
