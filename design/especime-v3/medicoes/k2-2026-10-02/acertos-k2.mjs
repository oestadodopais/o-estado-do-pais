/** K2: a prova de que as palavras das leituras e das perguntas mudaram só onde o brief manda (items 3 e 4), e as das
 * leituras dos estudos só onde o item 7 manda. Compara, folha a folha, a declaração na cabeça de partida (por `git show`,
 * numa pasta temporária com os mesmos nomes de ficheiro) com a declaração na árvore de trabalho, e escreve cada folha
 * mudada com o caminho, o antes e o depois. Fecha (código 1) se mudar uma folha fora da lista declarada abaixo.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/k2-2026-10-02/acertos-k2.mjs <cabeça de partida> <saída.json> */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [base, saida] = process.argv.slice(2);
if (!base || !saida) throw new Error('Uso: acertos-k2.mjs <cabeça de partida> <saída.json>');

/** O que o brief manda mudar, por ficheiro e por medida (ou estudo), e mais nada. */
const PERMITIDAS = {
  'leituras-das-medidas': ['pib-real-per-capita-2025', 'desempenho-das-exportacoes-2025', 'disparidade-de-emprego-entre-sexos-2025'],
  'definicoes-das-medidas': ['disparidade-de-emprego-entre-sexos-2025'],
  'leituras-dos-estudos': ['evora-economia-e-dinheiro-publico-de-fora-da-camara', 'evora-prometido-pago-auditado-2026', 'evora-quem-governou-a-camara-2009-2025', 'evora-os-pelouros-quem-os-teve-o-que-fizeram', 'penalizacoes-por-reforma-antecipada-2026'],
};

const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'k2-acertos-'));
const mostrar = (f) => execFileSync('git', ['show', `${base}:${f}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** As folhas de texto de uma estrutura, com o caminho de cada uma. */
function folhas(x, c = '', out = []) {
  if (typeof x === 'string') out.push([c, x]);
  else if (Array.isArray(x)) x.forEach((y, i) => folhas(y, `${c}[${i}]`, out));
  else if (x && typeof x === 'object') for (const k of Object.keys(x)) folhas(x[k], `${c}.${k}`, out);
  return out;
}
function diferencas(antes, depois, familia) {
  const out = [];
  const chaves = new Set([...Object.keys(antes ?? {}), ...Object.keys(depois ?? {})]);
  for (const k of chaves) {
    const a = new Map(folhas(antes?.[k])), d = new Map(folhas(depois?.[k]));
    for (const c of new Set([...a.keys(), ...d.keys()])) {
      if (a.get(c) === d.get(c)) continue;
      out.push({ familia, id: k, caminho: c, antes: a.get(c) ?? null, depois: d.get(c) ?? null, permitida: (PERMITIDAS[familia] ?? []).includes(k) });
    }
  }
  return out;
}

try {
  /* As leituras das medidas e as perguntas vivem em módulos que se importam uns aos outros pelo nome: copiam-se os
     ficheiros de `src/data/` da cabeça de partida que a cadeia de importação pede, e os outros vêm da árvore atual. */
  const dados = path.join(pasta, 'src', 'data');
  const lib = path.join(pasta, 'src', 'lib');
  fs.mkdirSync(dados, { recursive: true });
  fs.mkdirSync(lib, { recursive: true });
  for (const f of fs.readdirSync('src/data')) {
    if (!/\.(mjs|json)$/.test(f)) continue;
    try { fs.writeFileSync(path.join(dados, f), mostrar(`src/data/${f}`)); } catch { fs.copyFileSync(path.join('src/data', f), path.join(dados, f)); }
  }
  for (const d of fs.readdirSync('src/data', { withFileTypes: true })) if (d.isDirectory()) fs.cpSync(path.join('src/data', d.name), path.join(dados, d.name), { recursive: true });
  for (const f of fs.readdirSync('src/lib')) if (f.endsWith('.mjs')) fs.copyFileSync(path.join('src/lib', f), path.join(lib, f));
  fs.cpSync('src/i18n', path.join(pasta, 'src', 'i18n'), { recursive: true });
  fs.symlinkSync(path.resolve('ledger'), path.join(pasta, 'ledger'));
  fs.symlinkSync(path.resolve('node_modules'), path.join(pasta, 'node_modules'));
  const ant = (f) => import(pathToFileURL(path.join(dados, f)).href);
  const atu = (f) => import(pathToFileURL(path.resolve('src/data', f)).href);
  const cwd = process.cwd();
  process.chdir(pasta);
  const [la, fa, ea] = [await ant('leituras-das-medidas.mjs'), await ant('figuras.mjs'), await ant('leituras.mjs')];
  process.chdir(cwd);
  const [ld, fd, ed] = [await atu('leituras-das-medidas.mjs'), await atu('figuras.mjs'), await atu('leituras.mjs')];
  const mudancas = [
    ...diferencas(la.LEITURAS_DAS_MEDIDAS, ld.LEITURAS_DAS_MEDIDAS, 'leituras-das-medidas'),
    ...diferencas(fa.DEFINICOES_DAS_MEDIDAS, fd.DEFINICOES_DAS_MEDIDAS, 'definicoes-das-medidas'),
    ...diferencas(ea.LEITURAS, ed.LEITURAS, 'leituras-dos-estudos'),
  ];
  const fora = mudancas.filter((m) => !m.permitida);
  const r = { o_que: 'as folhas das leituras, das perguntas e das leituras dos estudos que mudaram desde a cabeça de partida', base, mudancas: mudancas.length, fora_da_lista: fora.length, lista: mudancas };
  fs.writeFileSync(saida, JSON.stringify(r, null, 2) + '\n');
  console.log(`${mudancas.length} folha(s) mudada(s), ${fora.length} fora da lista do brief`);
  for (const m of mudancas) console.log(`  ${m.permitida ? '·' : '✗'} ${m.familia} · ${m.id} ${m.caminho}`);
  process.exitCode = fora.length ? 1 : 0;
} finally {
  fs.rmSync(pasta, { recursive: true, force: true });
}
