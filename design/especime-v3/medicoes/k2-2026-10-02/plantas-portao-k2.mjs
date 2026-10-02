/** K2: as plantas do portão de HTML para o que o bloco mudou nele e à volta dele. Cada planta estraga um ficheiro de
 * `dist/`, corre `node scripts/gate-html.mjs` sozinho, exige o código 1 com a queixa esperada, repõe os bytes originais
 * e confere o sha256 (a convenção das plantas do mapa do repositório, §4). O portão só escreve `dist/prova.json` quando
 * passa, e por isso uma planta que morde não escreve nada.
 *   G1 · uma contagem da prova sem o separador de milhares («3009» em vez de «3 009»): a cópia da regra do portão
 *        escreve-a agrupada e compara carácter a carácter;
 *   G2 · uma contagem agrupada com outro valor («3 010»): o valor continua a ser o que o portão conta;
 *   G3 · a metade da leitura dentro da dobra sem o invólucro `data-selo-em`, com o valor da linha do cartão lá dentro:
 *        o valor fica sem porta, e o portão recusa-o como recusava na leitura inteira.
 * Uso, da raiz da worktree, sobre uma construção acabada: node design/especime-v3/medicoes/k2-2026-10-02/plantas-portao-k2.mjs <saída.json> */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const saida = process.argv[2];
if (!saida) throw new Error('Uso: plantas-portao-k2.mjs <saída.json>');
const resumo = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const limpa = (s) => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]').replace(/\x1b\[[0-9;]*m/g, '');
const NBSP = String.fromCharCode(0xa0);
const plantas = [
  { nome: 'G1 · uma contagem da prova sem o separador de milhares', ficheiro: 'dist/livro-razao/index.html',
    estraga: (h) => h.replace(new RegExp(`(data-prova="afirmacoes"[^>]*>)3${NBSP}009<`), '$13009<'),
    mordida: /o número da prova "afirmacoes" foi renderizado como "3009" e o portão escreve-o "3 009"/ },
  { nome: 'G2 · uma contagem agrupada com outro valor', ficheiro: 'dist/livro-razao/index.html',
    estraga: (h) => h.replace(new RegExp(`(data-prova="afirmacoes"[^>]*>)3${NBSP}009<`), `$13${NBSP}010<`),
    mordida: /o número da prova "afirmacoes" foi renderizado como "3 010" e o portão escreve-o "3 009"/ },
  { nome: 'G3 · a metade da leitura na dobra sem o invólucro data-selo-em', ficheiro: 'dist/estado-e-economia/index.html',
    estraga: (h) => h.replace(/(data-cartao-leitura="saldo-das-administracoes-publicas-2025") data-selo-em="saldo-das-administracoes-publicas-2025"( data-leitura-parte="o-que-e")/, '$1$2'),
    mordida: /o valor da afirmação "saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha/ },
];
const resultados = [];
for (const p of plantas) {
  const antes = resumo(p.ficheiro);
  const original = fs.readFileSync(p.ficheiro);
  const estragado = p.estraga(original.toString('utf8'));
  const aplicado = estragado !== original.toString('utf8');
  let r = null;
  try {
    /* Escreve-se num ficheiro novo e troca-se, para não mexer nos bytes de uma ligação dura partilhada. */
    fs.writeFileSync(p.ficheiro + '.k2-planta', estragado);
    fs.renameSync(p.ficheiro + '.k2-planta', p.ficheiro);
    r = spawnSync(process.execPath, ['scripts/gate-html.mjs'], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' }, maxBuffer: 64 * 1024 * 1024 });
  } finally {
    fs.writeFileSync(p.ficheiro + '.k2-planta', original);
    fs.renameSync(p.ficheiro + '.k2-planta', p.ficheiro);
  }
  const texto = limpa(`${r?.stdout ?? ''}\n${r?.stderr ?? ''}`);
  const queixa = texto.split('\n').find((l) => p.mordida.test(l))?.trim() ?? null;
  const depois = resumo(p.ficheiro);
  resultados.push({ nome: p.nome, ficheiro: p.ficheiro.replace(/^dist\//, ''), estrago_aplicado: aplicado, codigo: r?.status ?? null, mordida: p.mordida.source, queixa, mordeu: aplicado && r?.status === 1 && Boolean(queixa), antes, reposto: depois, bytes_repostos: antes === depois });
}
fs.writeFileSync(saida, JSON.stringify({ o_que: 'as plantas do portão de HTML do bloco K2, cada uma sobre um ficheiro de dist/ com os bytes repostos', plantas: resultados }, null, 2) + '\n');
console.log(resultados.map((r) => `${r.mordeu && r.bytes_repostos ? 'mordeu' : 'NÃO MORDEU'} · ${r.nome} (código ${r.codigo})`).join('\n'));
process.exitCode = resultados.every((r) => r.mordeu && r.bytes_repostos) ? 0 : 1;
