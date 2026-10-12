/** Mede as novas páginas sem dar folga às anteriores; prova a catraca em memória. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { routePath, LANGS } from '../../../../src/lib/routes.mjs';

const pasta = 'design/especime-v3/medicoes/jd1-2026-10-06';
const basePath = 'design/especime-v3/medicoes/ex1-2026-10-05/fusao/l1-destinos-e0ad595d.json';
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const ids = Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/jd1.json', 'utf8')).rows);
const esperadas = ids.flatMap(slug => LANGS.map(lang => routePath('linha', lang, { slug }))).sort();
const limpa = s => s.replace(/\x1b\[[0-9;]*m/g, '').replaceAll(process.cwd(), '<worktree>');
const corre = args => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
const regua = corre(['scripts/check-lugar.mjs']);
assert([0, 1].includes(regua.status));
const log = limpa(regua.stdout + regua.stderr);
fs.writeFileSync(`${pasta}/l1-check-lugar.log`, log);
const total = Number(log.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/)?.[1]);
assert(Number.isInteger(total));
const urls = [...log.matchAll(/^\s+· (\S+) · \d+ destinos repetidos/gm)].map(m => m[1]).sort();
assert.equal(urls.length, total, 'JD1 L1: a amostra não contém todas as páginas.');
const contagem = corre(['design/especime-v3/medicoes/r4-2026-10-05/contar-destinos-l1.mjs', '.', `${pasta}/l1-destinos.json`, String(total)]);
assert.equal(contagem.status, 0, limpa(contagem.stdout + contagem.stderr));
const agora = JSON.parse(fs.readFileSync(`${pasta}/l1-destinos.json`, 'utf8'));
assert.deepEqual(Object.keys(agora.repetidos_por_pagina).sort(), urls);

const mensagens = {
  antigas: 'JD1 L1: uma página anterior mudou de destinos ou de multiplicidade.',
  novas: 'JD1 L1: as páginas novas não são exatamente os recibos declarados.',
  portas: 'JD1 L1: o recibo novo não conserva apenas as duas portas do Método.',
};
function confere(atual) {
  for (const [url, destinos] of Object.entries(base.repetidos_por_pagina)) {
    if (JSON.stringify(atual[url]) !== JSON.stringify(destinos)) throw new Error(mensagens.antigas);
  }
  const novas = Object.keys(atual).filter(url => !(url in base.repetidos_por_pagina)).sort();
  if (JSON.stringify(novas) !== JSON.stringify(esperadas)) throw new Error(mensagens.novas);
  for (const url of novas) {
    const lang = url.startsWith('/en/') ? 'en' : 'pt';
    if (JSON.stringify(atual[url]) !== JSON.stringify({ [routePath('metodo', lang)]: 2 })) throw new Error(mensagens.portas);
  }
  return novas;
}
const novas = confere(agora.repetidos_por_pagina);
const plantas = [];
function planta(nome, mensagem, altera) {
  const copia = structuredClone(agora.repetidos_por_pagina);
  altera(copia);
  let queixa = null;
  try { confere(copia); } catch (e) { queixa = e.message; }
  assert.equal(queixa, mensagem, nome);
  plantas.push({ nome, mensagem, queixa, planta: true, passou: true });
}
planta('Uma porta a mais numa página anterior', mensagens.antigas, copia => {
  const url = Object.keys(base.repetidos_por_pagina)[0];
  const destino = Object.keys(copia[url])[0];
  copia[url][destino]++;
});
planta('Um recibo novo com mais uma porta do Método', mensagens.portas, copia => {
  const destino = Object.keys(copia[novas[0]])[0];
  copia[novas[0]][destino]++;
});
planta('Uma página nova fora dos recibos declarados', mensagens.novas, copia => { copia['/planta-jd1'] = { '/metodo': 2 }; });
planta('Um recibo declarado em falta', mensagens.novas, copia => { delete copia[novas[0]]; });
const medicao = {
  comando: `node ${pasta}/medir-l1.mjs --write`,
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  construcao: JSON.parse(fs.readFileSync('dist/version.json', 'utf8')).commit,
  base: basePath,
  contagem: `${pasta}/l1-destinos.json`,
  contagens: { estudos: total, anteriores: base.paginas, novas: novas.length, antigas_alteradas: 0 },
  novas: Object.fromEntries(novas.map(url => [url, agora.repetidos_por_pagina[url]])),
  razao: 'Só entram os recibos declarados no cruzamento JD1, nas duas edições. Cada um repete apenas a porta do Método, como os recibos anteriores. Todas as páginas anteriores conservam os destinos e a multiplicidade.',
};
if (process.argv.includes('--write')) {
  fs.writeFileSync(`${pasta}/l1-jd1.json`, JSON.stringify(medicao, null, 2) + '\n');
  fs.writeFileSync('scripts/lugar-tetos-b1.json', JSON.stringify({ l1_paginas: total, medicao: `${pasta}/l1-jd1.json` }, null, 2) + '\n');
} else {
  const teto = JSON.parse(fs.readFileSync('scripts/lugar-tetos-b1.json', 'utf8'));
  assert.equal(teto.l1_paginas, total);
}

// As plantas seguintes atravessam o portão real. Só a leitura em memória muda.
const limpaRegua = corre(['scripts/check-lugar.mjs']);
assert.equal(limpaRegua.status, 0, limpa(limpaRegua.stdout + limpaRegua.stderr));
const ficheiroSerie = path.resolve('dist/livro-razao/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade/index.html');
assert(!agora.repetidos_por_pagina['/livro-razao/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade']);
for (const caso of [
  { nome: 'O teto diverge da contagem guardada', mensagem: 'B1 L1: o teto tem de ser o número inteiro medido no registo.',
    alvo: path.resolve(`${pasta}/l1-jd1.json`), expressao: 'const j = JSON.parse(s); j.contagens.estudos++; s = JSON.stringify(j);' },
  { nome: 'Duas portas novas na página da série', mensagem: `L1 · páginas com dois destinos iguais fora da mobília: ${total + 1}, acima do teto ${total}.`,
    alvo: ficheiroSerie, expressao: 's = s.replace("</main>", \'<p><a href="https://example.invalid/planta-jd1">planta</a><a href="https://example.invalid/planta-jd1">planta</a></p></main>\');' },
]) {
  const codigo = `import fs from 'node:fs'; const ler = fs.readFileSync; fs.readFileSync = function(f, ...args) { const corpo = ler.call(this, f, ...args); if (String(f) !== ${JSON.stringify(caso.alvo)}) return corpo; let s = String(corpo); ${caso.expressao} return typeof corpo === 'string' ? s : Buffer.from(s); }; await import('./scripts/check-lugar.mjs');`;
  const r = corre(['--input-type=module', '-e', codigo]);
  const passou = r.status === 1 && (r.stdout + r.stderr).includes(caso.mensagem);
  assert(passou, caso.nome);
  plantas.push({ nome: caso.nome, mensagem: caso.mensagem, planta: true, passou, codigo: r.status });
}
fs.writeFileSync(`${pasta}/plantas-l1.json`, JSON.stringify(plantas, null, 2) + '\n');
console.log(JSON.stringify({ contagens: medicao.contagens, plantas }, null, 2));
