#!/usr/bin/env node
/** OE1-b: mede o crescimento dos recibos na L1, sem alterar a régua.
 * Compara a lista completa com a medição que sustenta o teto anterior e exige
 * apenas as duas edições das linhas exportadas, sem agravamento de páginas.
 * Confere ainda os padrões de links no HTML das linhas novas e antigas.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { routePath, LANGS } from '../../../../src/lib/routes.mjs';
import { ANCORA_DA_POLITICA } from '../../../../src/data/politica-ia.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const passagem = process.argv.includes('--oe1e') ? 'oe1e' : 'oe1d';
const passagemD = process.argv.includes('--oe1d') || process.argv.includes('--oe1e');
const original = 'design/especime-v3/medicoes/oe1-2026-10-04/oe1b-base/l1-check-lugar.log';
const receipt = JSON.parse(fs.readFileSync(path.join(AQUI, 'base-l1.json'), 'utf8'));
assert(receipt.reposicao_conferida && receipt.cabeca_conservada && receipt.codigo_da_medicao === 0, 'A comparação exige a base medida e os ficheiros repostos.');
const limpa = s => s.replace(/\x1b\[[0-9;]*m/g, '').replaceAll(RAIZ, '<sitio>');
function lista(texto) {
  const result = new Map();
  for (const l of limpa(texto).split('\n')) {
    const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (m) { assert(!result.has(m[1])); result.set(m[1], { destinos: Number(m[2]), exemplo: m[3], vezes: Number(m[4]) }); }
  }
  const total = limpa(texto).match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
  assert(total && result.size === Number(total[1]), 'A amostra tem de conter a lista inteira.');
  return result;
}
const antes = lista(fs.readFileSync(path.join(RAIZ, original), 'utf8'));
const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
assert([0, 1].includes(r.status));
const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/lugar-tetos-b1.json'), 'utf8'));
if (teto.medicao === 'design/especime-v3/medicoes/oe1-2026-10-04/l1-oe1b.json') assert.equal(r.status, 0, 'A régua tem de passar com a medição atualizada.');
const log = limpa(r.stdout + r.stderr);
fs.writeFileSync(path.join(AQUI, passagemD ? `${passagem}-l1-check-lugar.log` : 'oe1b-l1-check-lugar.log'), log);
const depois = lista(log);
const crossing = JSON.parse(fs.readFileSync(path.join(RAIZ, 'ledger/cruzamentos/oe1.json'), 'utf8'));
const novas = new Set(Object.keys(crossing.rows).flatMap(slug => LANGS.map(lang => routePath('linha', lang, { slug }))));
if (passagemD) {
  // O R2 mudou a regra L1 e o RP3 acrescentou recibos. A comparação antiga
  // permanece como prova histórica; a cabeça integrada tem uma medição própria.
  assert.equal(r.status, 0, 'A régua da cabeça integrada tem de estar verde.');
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: RAIZ, encoding: 'utf8'}).trim();
  const stamp = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
  assert.equal(stamp.commit, head, 'A L1 exige a construção da cabeça que está a ser medida.');
  assert(depois.size <= teto.l1_paginas, 'A medição não autoriza aumentar o teto.');
  const recibos = [...novas].filter(url => fs.existsSync(path.join(RAIZ, 'dist', url.slice(1), 'index.html')));
  assert.equal(recibos.length, novas.size, 'Todos os recibos têm de estar construídos.');
  const linhas = log.split('\n');
  const indice = linhas.findIndex(l => /^\s+· \S+ · \d+ destinos repetidos/.test(l));
  assert(indice >= 0, 'O conhecido positivo exige uma entrada contada.');
  const adulterado = linhas.filter((_, i) => i !== indice).join('\n');
  assert.throws(() => lista(adulterado), /lista inteira/);
  const data = {
    o_que_e: `${passagem === 'oe1e' ? 'OE1-e' : 'OE1-d'}: medição integral da L1 na construção da cabeça integrada. Nenhuma alteração da régua ou aumento do teto.`,
    data: new Date().toISOString(),
    cabeca: head,
    construcao: stamp.commit,
    origem: `design/especime-v3/medicoes/oe1-2026-10-04/${passagem}-l1-check-lugar.log`,
    codigo_da_regua: r.status,
    // «estudos» é o nome histórico do campo que check-lugar lê; conta páginas.
    contagens: {estudos: depois.size, l1_paginas: depois.size, teto_lido: teto.l1_paginas, recibos_oe1: recibos.length},
    conhecidos_positivos: [{nome: 'Uma entrada retirada da lista deixa de reconciliar com a contagem da régua', mordeu: true}],
    paginas: Object.fromEntries(depois),
  };
  fs.writeFileSync(path.join(AQUI, `l1-${passagem}.json`), JSON.stringify(data, null, 2) + '\n');
  const plantCode = `import fs from 'node:fs';
const read = fs.readFileSync;
fs.readFileSync = function(file, ...args) {
  const body = read.call(this, file, ...args);
  if (String(file).endsWith('/${teto.medicao}')) {
    const copy = JSON.parse(String(body)); copy.contagens.estudos += 1;
    return JSON.stringify(copy);
  }
  return body;
};
await import('./scripts/check-lugar.mjs');`;
  const planted = spawnSync(process.execPath, ['--input-type=module', '-e', plantCode], {cwd: RAIZ, encoding: 'utf8'});
  assert.equal(planted.status, 1, 'A contagem adulterada tem de ser recusada pela régua.');
  assert((planted.stdout + planted.stderr).includes('B1 L1: o teto tem de ser o número inteiro medido no registo.'), 'A planta exige a queixa do teto e do registo.');
  data.conhecidos_positivos.push({nome: 'Uma contagem do registo trocada em memória é recusada pela régua do teto', mordeu: true});
  fs.writeFileSync(path.join(AQUI, `l1-${passagem}.json`), JSON.stringify(data, null, 2) + '\n');
  console.log(JSON.stringify({cabeca: data.cabeca, contagens: data.contagens, conhecidos_positivos: data.conhecidos_positivos}, null, 2));
  process.exit(0);
}
function confere(a, d, esperadas) {
  for (const [url, v] of a) assert.deepEqual(d.get(url), v, `Página antiga alterada: ${url}`);
  const entradas = [...d.keys()].filter(u => !a.has(u));
  assert.deepEqual(entradas.sort(), [...esperadas].sort(), 'As entradas têm de ser exatamente os recibos OE1.');
  return entradas;
}
const entradas = confere(antes, depois, novas);
const cadeia = el => {
  const partes = [];
  for (let n = el; n?.tagName && partes.length < 3; n = n.parentNode) {
    const cls = (n.getAttribute('class') ?? '').trim().split(/\s+/).filter(Boolean);
    const dados = Object.keys(n.attributes).filter(a => a.startsWith('data-'));
    partes.push(`${n.tagName.toLowerCase()}${cls.length ? '.' + cls[0] : ''}${dados.length ? '[' + dados[0] + ']' : ''}`);
  }
  return partes.join('<');
};
function padroes(url) {
  const lang = url.startsWith('/en/') ? 'en' : 'pt';
  const root = parse(fs.readFileSync(path.join(RAIZ, 'dist', url.slice(1), 'index.html'), 'utf8'));
  const body = root.querySelector('body');
  const furniture = new Set();
  for (const el of [root.querySelector('header'), root.querySelector('footer')].filter(Boolean)) { furniture.add(el); for (const d of el.querySelectorAll('*')) furniture.add(d); }
  const by = new Map();
  for (const a of body.querySelectorAll('a[href]')) {
    if (furniture.has(a)) continue;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (a.closest('[data-rotulo-ia="topo"]') && href === `${routePath('metodo', lang)}#${ANCORA_DA_POLITICA}`) continue;
    if (a.matches('a.marcador') && a.closest('[data-cartao-definicao]') && href === routePath('marcador', lang)) continue;
    if (a.matches('a.marcador.marcador-de-titulo') && href === routePath('marcador', lang)) continue;
    const key = href.split('#')[0].replace(/\/$/, '') || (href.startsWith('/') ? '/' : '');
    if (!key) continue;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(a);
  }
  const reps = [...by].filter(([, els]) => els.length > 1);
  assert.equal(reps.length, depois.get(url).destinos, `A composição diverge da régua: ${url}`);
  return reps.map(([destino, els]) => ({ destino, vezes: els.length, padrao: [...new Set(els.map(cadeia))].sort().join(' || ') }));
}
const antigos = [...antes.keys()].filter(u => u.startsWith('/livro-razao/') || u.startsWith('/en/ledger/'));
const conhecidos = new Set(antigos.flatMap(u => padroes(u).map(p => p.padrao)));
const novos = entradas.map(url => ({ url, ...depois.get(url), pares: padroes(url) }));
const conferePadroes = ps => { for (const p of ps) assert(conhecidos.has(p.padrao), `Padrão novo: ${p.padrao}`); };
conferePadroes(novos.flatMap(p => p.pares));
const plantas = [];
function planta(nome, fn) { let mordeu = false; try { fn(); } catch { mordeu = true; } assert(mordeu, nome); plantas.push({ nome, mordeu }); }
planta('Um recibo OE1 em falta é recusado', () => { const d = new Map(depois); d.delete(entradas[0]); confere(antes, d, novas); });
planta('Um destino repetido a mais numa página antiga é recusado', () => { const d = new Map(depois); const u = antigos[0]; d.set(u, { ...d.get(u), destinos: d.get(u).destinos + 1 }); confere(antes, d, novas); });
planta('Uma página extra fora do OE1 é recusada', () => { const d = new Map(depois); d.set('/planta-oe1-fora-do-conjunto', { destinos: 1 }); confere(antes, d, novas); });
planta('Um padrão desconhecido é recusado', () => conferePadroes([{ padrao: 'planta-oe1-padrao-desconhecido' }]));
const data = {
  o_que_e: 'OE1-b: a contagem L1 cresce apenas pelos recibos das 186 linhas nas duas línguas. A lista anterior permanece igual, incluindo os destinos repetidos e o exemplo contado. Os pares das linhas novas usam padrões presentes nas linhas antigas. Atualiza-se a medição do teto, sem alterar a régua, as páginas ou as suas palavras.',
  data: new Date().toISOString(),
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  origem_anterior: original,
  commit_da_base: receipt.commit_dos_ficheiros,
  origem: 'design/especime-v3/medicoes/oe1-2026-10-04/oe1b-l1-check-lugar.log',
  comando: 'AMOSTRA=100000 node scripts/check-lugar.mjs',
  codigo_da_regua: r.status,
  contagens: { estudos: depois.size, antes: antes.size, entradas: entradas.length, saidas: 0, antigas_alteradas: 0, linhas_antigas_conferidas_no_html: antigos.length, padroes_antigos: conhecidos.size },
  conhecidos_positivos: plantas,
  entradas: novos,
};
fs.writeFileSync(path.join(AQUI, 'l1-oe1b.json'), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ contagens: data.contagens, conhecidos_positivos: plantas }, null, 2));
