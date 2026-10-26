/** HB1-m: o teto da L1 depois da fusão dos ramos da habitação e de main, medido de novo sem mudar a regra.
 * Corre `check:lugar` com AMOSTRA=5000 sobre o dist/ presente, lê as páginas que a L1 enumera e exige que
 * sejam exatamente a união das páginas do EX4 (as 2782 do V2-b, as 83 linhas do PF1 nas duas edições e as
 * duas edições da explicação de 2027) e das páginas do HB1 (l1-destinos.json da habitação). Três plantas
 * provam que cada recusa morde. Escreve l1-hb1m.json ao lado com --escrever.
 * Uso: node design/especime-v3/medicoes/hb1-2026-10-21/fusao-m/medir-l1-hb1m.mjs [--escrever] */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const M = 'design/especime-v3/medicoes';
const ler = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const saida = spawnSync('node', ['scripts/check-lugar.mjs'], { encoding: 'utf8', env: { ...process.env, AMOSTRA: '5000' }, maxBuffer: 1 << 28 });
const texto = saida.stdout + saida.stderr;
const regua = Number(texto.match(/^ {2}L1 · páginas com dois destinos iguais fora da mobília +(\d+) /m)[1]);
const paginas = [...texto.matchAll(/^ {6}· (\/\S*) · (\d+) destinos repetidos/gm)].map((m) => m[1]);
const v2b = Object.keys(ler(`${M}/v2b-2026-10-12/retoma2/l1-destinos.json`).repetidos_por_pagina);
const ex4 = ler(`${M}/ex4-2026-10-21/l1-ex4.json`).novas;
const doEx4 = [...v2b, ...ex4.explicacoes, ...ex4.linhas.flatMap((id) => [`/livro-razao/${id}`, `/en/ledger/${id}`])];
const doHb1 = Object.keys(ler(`${M}/hb1-2026-10-21/l1-destinos.json`).repetidos_por_pagina);
/* Dez páginas do HB1 mudaram depois da medição do HB1 na cabeça 7cc354391 (as passagens HB1-c): entram as quatro
   páginas de linha das duas linhas hab-tespm140 de 2025 (a porta do Método duas vezes, como as outras linhas do
   estudo) e saem as seis das três linhas que o contrato da L1 do HB1 contava (oe-2027-calendario-generalidade,
   posicao-chega-habitacao, posicao-ps-rendas). Nenhuma é página do EX4; declaram-se aqui por nome. */
const ENTRAM_HB1 = ['hab-tespm140-a-pc-eu27_2020-2025', 'hab-tespm140-a-pc-pt-2025'].flatMap((id) => [`/livro-razao/${id}`, `/en/ledger/${id}`]);
const SAEM_HB1 = ['oe-2027-calendario-generalidade', 'posicao-chega-habitacao', 'posicao-ps-rendas'].flatMap((id) => [`/livro-razao/${id}`, `/en/ledger/${id}`]);
assert.ok(SAEM_HB1.every((p) => doHb1.includes(p) && !doEx4.includes(p)) && ENTRAM_HB1.every((p) => !doHb1.includes(p) && !doEx4.includes(p)), 'HB1-m L1: declaração das mudanças do HB1 inválida');
const uniao = [...new Set([...doEx4, ...doHb1, ...ENTRAM_HB1])].filter((p) => !SAEM_HB1.includes(p)).sort();
function conferir(r) {
  assert.equal(r.paginas.length, r.regua, 'HB1-m L1: contagem diferente da régua');
  const lista = [...new Set(r.paginas)].sort();
  assert.deepEqual(uniao.filter((p) => !lista.includes(p)), [], 'HB1-m L1: saiu uma página de um dos lados');
  assert.deepEqual(lista.filter((p) => !uniao.includes(p)), [], 'HB1-m L1: entrou uma página que nenhum dos lados tinha');
}
conferir({ regua, paginas });
const plantas = [
  ['página de um dos lados retirada', { regua: regua - 1, paginas: paginas.filter((p) => p !== uniao.at(-1)) }],
  ['página declarada como saída de volta', { regua: regua + 1, paginas: [...paginas, SAEM_HB1[0]] }],
  ['página alheia acrescentada', { regua: regua + 1, paginas: [...paginas, '/planta-alheia'] }],
  ['contagem diferente da régua', { regua: regua + 1, paginas }],
].map(([nome, r]) => { let mordeu = false; try { conferir(r); } catch { mordeu = true; } return { nome, mordeu }; });
assert.ok(plantas.every((p) => p.mordeu), 'HB1-m L1: uma planta não mordeu');
const registo = {
  comando: 'AMOSTRA=5000 node scripts/check-lugar.mjs',
  contagens: { estudos: regua, do_ex4: doEx4.length, do_hb1: doHb1.length, em_comum: doEx4.length + doHb1.length + ENTRAM_HB1.length - SAEM_HB1.length - uniao.length, entram_hb1: ENTRAM_HB1, saem_hb1: SAEM_HB1 },
  plantas,
  razao: 'A L1 da cabeça fundida enumera exatamente a união das páginas medidas pelo EX4 e pelo HB1, cada uma sobre o seu ramo, com as dez mudanças do HB1 posteriores à medição dele declaradas por nome (quatro entram, seis saem); nenhuma página do EX4 muda; a regra da contagem não muda.',
};
if (process.argv.includes('--escrever')) fs.writeFileSync(`${M}/hb1-2026-10-21/fusao-m/l1-hb1m.json`, JSON.stringify(registo, null, 2) + '\n');
console.log(`HB1-m L1: ${regua} páginas (EX4 ${doEx4.length}, HB1 ${doHb1.length}, em comum ${registo.contagens.em_comum}); ${plantas.length} plantas morderam.`);
