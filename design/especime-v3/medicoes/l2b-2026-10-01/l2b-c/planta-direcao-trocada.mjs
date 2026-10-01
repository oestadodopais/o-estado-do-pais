/** L2b-c: a planta de fora a fora do achado 4 da leitura a frio. Troca a direção do índice de dívida na tabela da vista
 * (`src/data/faixa-do-concelho.mjs`: «do-mais-baixo» passa a «do-mais-alto»), reconstrói as páginas e os cartões de
 * partilha, corre o portão de HTML, e exige o código 1 com as duas mordidas esperadas: a tabela da vista contra a
 * autoridade do portão, e os lugares do índice que a página rende contra a recontagem das linhas. Repõe os bytes do
 * ficheiro e confere o sha256, e reconstrói outra vez com o ficheiro reposto. Corre-se da raiz da worktree, com a tranca
 * da máquina tomada por quem o chama, porque reconstrói o `dist/`:
 *   node design/especime-v3/medicoes/l2b-2026-10-01/l2b-c/planta-direcao-trocada.mjs
 * Escreve `planta-direcao-trocada.json` e o registo do portão ao lado, sem caminhos da máquina. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/l2b-2026-10-01/l2b-c';
const FICHEIRO = 'src/data/faixa-do-concelho.mjs';
const sha = (s) => createHash('sha256').update(s).digest('hex');
const corre = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  return { codigo: r.status, saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
};
const constroi = () => {
  for (const [cmd, args] of [['npx', ['astro', 'build']], ['node', ['scripts/stamp-version.mjs']], ['node', ['scripts/cartoes.mjs']]]) {
    const r = corre(cmd, args);
    if (r.codigo !== 0) throw new Error(`${cmd} ${args.join(' ')} saiu com ${r.codigo}`);
  }
};
const semCaminhos = (t) => t.replaceAll(process.cwd(), '<worktree>').replace(/\/Users\/[^/\s"']+/g, '<casa>').replace(/\x1b\[[0-9;]*m/g, '');

const original = fs.readFileSync(FICHEIRO, 'utf8');
const antes = sha(original);
const bloco = /( {2}indice: \{\n {4}faixa: true,\n[\s\S]*?\n {4}ordem: )'do-mais-baixo'/;
if (!bloco.test(original)) throw new Error('a planta não achou a ordem do índice de dívida na tabela da vista');
const plantado = original.replace(bloco, "$1'do-mais-alto'");
const mordidas = [
  /L2b-c: a tabela da vista conta «indice» do-mais-alto e o portão do-mais-baixo/,
  /L2b: «data-concelho-lugar» de «indice#[a-z-]+» diz «\d+» e a recontagem das linhas dá «\d+»/,
];
let portao;
try {
  fs.writeFileSync(FICHEIRO, plantado);
  constroi();
  portao = corre('node', ['scripts/gate-html.mjs']);
} finally {
  fs.writeFileSync(FICHEIRO, original);
}
const reposto = sha(fs.readFileSync(FICHEIRO, 'utf8'));
constroi();
const saida = semCaminhos(portao.saida);
fs.writeFileSync(`${PASTA}/planta-direcao-trocada-portao.log`, saida);
const registo = {
  nome: 'l2b-c-portao-direcao-trocada-na-tabela-da-vista',
  ficheiro: FICHEIRO,
  plantado: "a ordem do índice de dívida na tabela da vista, «do-mais-baixo» trocada por «do-mais-alto»",
  comando: 'node scripts/gate-html.mjs, depois de npx astro build, scripts/stamp-version.mjs e scripts/cartoes.mjs com a tabela plantada',
  codigo: portao.codigo,
  mordidas: mordidas.map((re) => ({ re: re.source, viu: re.test(saida) })),
  lugares_do_indice_recusados: (saida.match(/L2b: «data-concelho-lugar» de «indice#/g) ?? []).length,
  antes,
  sha_plantado: sha(plantado),
  reposto,
  passou: portao.codigo === 1 && mordidas.every((re) => re.test(saida)) && antes === reposto,
};
fs.writeFileSync(`${PASTA}/planta-direcao-trocada.json`, JSON.stringify(registo, null, 2) + '\n');
console.log(`${registo.passou ? 'OK' : 'FALHA'} ${registo.nome}: código ${registo.codigo}, ${registo.lugares_do_indice_recusados} lugares do índice recusados, sha256 reposto ${antes === reposto}`);
process.exitCode = registo.passou ? 0 : 1;
