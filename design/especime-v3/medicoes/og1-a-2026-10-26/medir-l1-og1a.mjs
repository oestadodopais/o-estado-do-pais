/** OG1-A: o teto da L1 sobe do número da base para o número medido, sem mudar a regra. As páginas novas têm de ser
 * exatamente os recibos das linhas do item nas duas edições e as duas páginas do item; nenhuma página antiga entra,
 * sai ou piora. Oito plantas provam que cada recusa morde. Escreve l1-og1a.json ao lado com --escrever.
 * Uso: node design/especime-v3/medicoes/og1-a-2026-10-26/medir-l1-og1a.mjs base <worktree de main com dist/>   (grava l1-base.json)
 *      node design/especime-v3/medicoes/og1-a-2026-10-26/medir-l1-og1a.mjs [--escrever]                          (mede o dist/ presente e compara) */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
const AQUI = 'design/especime-v3/medicoes/og1-a-2026-10-26';
const COMANDO = 'AMOSTRA=5000 node scripts/check-lugar.mjs';
function medir(cwd) {
  const s = spawnSync('node', ['scripts/check-lugar.mjs'], { cwd, encoding: 'utf8', env: { ...process.env, AMOSTRA: '5000' }, maxBuffer: 1 << 28 });
  const texto = (s.stdout + s.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  const m = texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+) +\(teto (\d+)\)/m);
  if (!m) throw new Error('OG1-A L1: a régua não imprimiu a medição L1');
  const paginas = Object.fromEntries([...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map((x) => [x[1], { destinos: Number(x[2]), exemplo: x[3], vezes: Number(x[4]) }]));
  assert.equal(Object.keys(paginas).length, Number(m[1]), 'OG1-A L1: amostra incompleta');
  return { regua: Number(m[1]), teto: Number(m[2]), paginas };
}
if (process.argv[2] === 'base') {
  const wt = process.argv[3];
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: wt, encoding: 'utf8' }).trim();
  const versao = JSON.parse(fs.readFileSync(path.join(wt, 'dist/version.json'), 'utf8')).commit;
  assert.equal(versao, commit, 'OG1-A L1: o dist/ da base não é a cabeça da worktree');
  const r = medir(wt);
  fs.writeFileSync(`${AQUI}/l1-base.json`, JSON.stringify({ comando: COMANDO, worktree_commit: commit, ...r }, null, 2) + '\n');
  console.log(`OG1-A L1 base ${commit.slice(0, 9)}: ${r.regua} páginas (teto ${r.teto})`);
  process.exit(0);
}
const base = JSON.parse(fs.readFileSync(`${AQUI}/l1-base.json`, 'utf8'));
const ids = Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/og1a.json', 'utf8')).rows);
/* As duas páginas do índice entram porque «O que mudou» lista pela primeira vez linhas de um item e a porta da
   discussão («O que se discute sobre isto →») aparece abaixo da lista: para a L1 é uma segunda porta para a página
   do item (a entrada de «O país» é a primeira); a I7 do índice não a conta como entrada. As páginas do item já
   estavam na lista da base. */
const INDICE = ['/indice', '/en/index'];
const ITEM = ['/o-que-se-discute', '/en/under-discussion'];
const NOVAS = [...ids.flatMap((id) => [`/livro-razao/${id}`, `/en/ledger/${id}`]), ...INDICE].sort();
const agora = medir('.');
/* Uma página antiga pode piorar sem mudar o total: a comparação regista o agravamento e só o aceita com razão (a
   forma da B2). A única razão aceite aqui é a segunda porta da discussão: uma página que já tinha a porta do item
   da Saúde e ganha a do item do Orçamento tem duas portas para duas âncoras da mesma página, que a L1 conta como
   um destino repetido a mais. A razão lê-se na própria página construída (a marca da porta do item), e o
   agravamento tem de ser de um destino só. */
const PORTA_DO_ITEM = 'data-discussao-integracao="orcamento-2027-generalidade"';
const PORTA_DA_SAUDE = 'data-discussao-integracao="saude-no-orcamento"';
const html = (p) => fs.readFileSync(path.join('dist', p.replace(/^\//, ''), 'index.html'), 'utf8');
const distDaCabeca = JSON.parse(fs.readFileSync('dist/version.json', 'utf8')).commit;
const paginaDoItem = (p) => (p === '/en' || p.startsWith('/en/') ? '/en/under-discussion' : '/o-que-se-discute');
/* O que a porta do item acrescenta a uma página: os destinos repetidos da página (o corpo sem o rótulo de IA)
   menos os mesmos sem as ligações dentro da porta do item. Para as páginas antigas que já tinham a porta da
   Saúde, e para as duas páginas do índice, tem de ser exatamente a página do item, e mais nada. */
const semAncora = (h) => decodeURIComponent(h.split('#')[0].split('?')[0]).replace(/\/+$/, '') || '/';
const ligacoesDe = (p) => parse(html(p)).querySelector('main').querySelectorAll('a[href]').filter((a) => a.closest('[data-rotulo-ia="topo"]') === null && !/^(?:#|mailto:)/.test(a.getAttribute('href')));
const repetidosDe = (as) => { const c = new Map(); for (const a of as) { const d = semAncora(a.getAttribute('href')); c.set(d, (c.get(d) ?? 0) + 1); } return [...c].filter(([, n]) => n >= 2).map(([d]) => d); };
const cache = new Map();
function oQueAPortaAcrescenta(p) {
  if (!cache.has(p)) { const as = ligacoesDe(p); const sem = repetidosDe(as.filter((a) => a.closest(`[${PORTA_DO_ITEM}]`) === null)); cache.set(p, repetidosDe(as).filter((d) => !sem.includes(d))); }
  return cache.get(p);
}
const pelaSegundaPorta = (p) => !ITEM.includes(p) && html(p).includes(PORTA_DO_ITEM) && html(p).includes(PORTA_DA_SAUDE) && oQueAPortaAcrescenta(p).join() === paginaDoItem(p);
const comPorta = new Set(Object.keys(base.paginas).filter(pelaSegundaPorta));
/* As duas páginas do item crescem pelo artigo novo: o número de destinos repetidos da página menos o mesmo número
   contado sem as ligações do artigo do item, com o mesmo corte dos dois lados (o corpo sem o rótulo de IA), é o
   que o artigo acrescenta; tem de ser exatamente o crescimento que a régua mediu. */
function crescimentoDoArtigo(p) {
  const main = parse(html(p)).querySelector('main');
  const ligacoes = main.querySelectorAll('a[href]').filter((a) => a.closest('[data-rotulo-ia="topo"]') === null && !/^(?:#|mailto:)/.test(a.getAttribute('href')));
  const repetidos = (as) => { const c = new Map(); for (const a of as) { const d = semAncora(a.getAttribute('href')); c.set(d, (c.get(d) ?? 0) + 1); } return [...c.values()].filter((n) => n >= 2).length; };
  return repetidos(ligacoes) - repetidos(ligacoes.filter((a) => a.closest('article.discussao-item[id="orcamento-2027-generalidade"]') === null));
}
const CRESCIMENTO_DO_ITEM = Object.fromEntries(ITEM.map((p) => [p, crescimentoDoArtigo(p)]));
function conferir(r) {
  const lista = Object.keys(r.paginas).sort();
  assert.equal(lista.length, r.regua, 'OG1-A L1: contagem diferente da régua');
  const antes = Object.keys(base.paginas);
  assert.deepEqual(antes.filter((p) => !lista.includes(p)), [], 'OG1-A L1: saiu uma página antiga');
  assert.deepEqual(lista.filter((p) => !antes.includes(p) && !NOVAS.includes(p)), [], 'OG1-A L1: entrou uma página que não é do item');
  assert.deepEqual([...NOVAS, ...ITEM].filter((p) => !lista.includes(p)), [], 'OG1-A L1: falta uma página do item');
  const parDeRecibo = (p) => r.paginas[p].destinos === 1 && ['/metodo', '/en/method'].includes(r.paginas[p].exemplo);
  const parDoIndice = (p) => oQueAPortaAcrescenta(p).join() === paginaDoItem(p) && r.paginas[p].destinos === oQueAPortaAcrescenta(p).length;
  assert.deepEqual(NOVAS.filter((p) => (INDICE.includes(p) ? !parDoIndice(p) : !parDeRecibo(p))), [], 'OG1-A L1: uma página nova entra por outro par que não o declarado');
  const agravadas = antes.filter((p) => r.paginas[p].destinos > base.paginas[p].destinos);
  const explicada = (p) => ITEM.includes(p)
    ? r.paginas[p].destinos - base.paginas[p].destinos === CRESCIMENTO_DO_ITEM[p]
    : comPorta.has(p) && r.paginas[p].destinos === base.paginas[p].destinos + 1;
  assert.deepEqual(agravadas.filter((p) => !explicada(p)), [], 'OG1-A L1: uma página antiga piorou sem ser pela segunda porta da discussão nem pelo artigo do item');
  return agravadas;
}
const agravadas = conferir(agora);
const semPorta = Object.keys(base.paginas).find((p) => !comPorta.has(p));
const variar = (f) => { const c = structuredClone(agora); f(c); return c; };
const plantas = [
  ['página do item retirada', variar((c) => { delete c.paginas[NOVAS[0]]; c.regua -= 1; })],
  ['página antiga retirada', variar((c) => { delete c.paginas[semPorta]; c.regua -= 1; })],
  ['página alheia acrescentada', variar((c) => { c.paginas['/planta-alheia'] = { destinos: 1, exemplo: '/x', vezes: 2 }; c.regua += 1; })],
  ['página antiga sem a porta do item agravada', variar((c) => { c.paginas[semPorta].destinos += 1; })],
  ['página com a porta agravada em dois destinos', variar((c) => { c.paginas[agravadas.find((p) => !ITEM.includes(p))].destinos += 1; })],
  ['página do item agravada além do seu artigo', variar((c) => { c.paginas[ITEM[0]].destinos += 1; })],
  ['contagem diferente da régua', variar((c) => { c.regua += 1; })],
  ['recibo novo com outro par', variar((c) => { c.paginas[NOVAS.find((p) => !INDICE.includes(p))].exemplo = '/x'; })],
].map(([nome, r]) => { let mordeu = false; try { conferir(r); } catch { mordeu = true; } return { nome, mordeu }; });
assert.ok(plantas.every((p) => p.mordeu), 'OG1-A L1: uma planta não mordeu');
const registo = {
  comando: COMANDO,
  cabeca: { dist_commit: distDaCabeca },
  base: { worktree_commit: base.worktree_commit, paginas: base.regua, teto: base.teto },
  contagens: { estudos: agora.regua, antigas: Object.keys(base.paginas).length, novas: NOVAS.length, recibos: ids.length * 2, indice: INDICE.length, agravadas: agravadas.length },
  agravadas: Object.fromEntries(agravadas.map((p) => [p, { antes: base.paginas[p].destinos, agora: agora.paginas[p].destinos, razao: ITEM.includes(p) ? `o artigo do item acrescenta ${CRESCIMENTO_DO_ITEM[p]} destinos repetidos` : `a segunda porta da discussão (a da Saúde já lá estava; o destino repetido a mais é ${paginaDoItem(p)})` }])),
  novas: Object.fromEntries(NOVAS.map((p) => [p, agora.paginas[p]])),
  plantas,
  razao: `A L1 da cabeça da fase A enumera exatamente as ${base.regua} páginas da base (main ${base.worktree_commit.slice(0, 9)}, o dist/ da aterragem dos registos de 26.10.2026) mais ${NOVAS.length} páginas novas: os ${ids.length * 2} recibos das ${ids.length} linhas do item do Orçamento de 2027 nas duas edições (o par que todos os recibos trazem, a porta do Método no rótulo e no recibo, conferido no exemplo da régua) e as duas páginas do índice, onde «O que mudou» lista pela primeira vez linhas de um item e a porta da discussão abaixo da lista é a segunda porta para a página do item (conferido na própria página, com e sem a porta). As duas páginas do item já estavam na base. Nenhuma página antiga entrou ou saiu; as ${agravadas.length} páginas antigas que passaram a ter um destino repetido a mais («agravadas») são as que já tinham a porta do item da Saúde e ganharam a do item do Orçamento (duas portas para duas âncoras da mesma página; o destino repetido a mais é a página do item, conferido na própria página com e sem a porta) e as duas páginas do item, que crescem exatamente pelo que o artigo novo repete; nenhuma piorou por outra razão. O horizonte continua a zero.`,
};
if (process.argv.includes('--escrever')) fs.writeFileSync(`${AQUI}/l1-og1a.json`, JSON.stringify(registo, null, 2) + '\n');
console.log(`OG1-A L1: ${agora.regua} páginas (${base.regua} da base ${base.worktree_commit.slice(0, 9)} + ${NOVAS.length} do item); ${plantas.length} plantas morderam.`);
