/** UE1: o que o `npm run typecheck` lê, medido para a nota do lugar de direção sobre os tipos.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/tipos-ue1.mjs
 *
 * A nota: o editor mostrava avisos de tipos em `src/lib/series.mjs` (os nomes `Serie` e
 * `PontoDaSerie` das anotações, a começar perto da linha 70, «não se encontram») e em
 * `tests/cartao/faixa.mjs` (`numeroDoPortao` declarado e nunca lido, na linha 30), e pedia que
 * se conferisse se o `npm run typecheck` (`tsconfig.check.json`) cobre os dois ficheiros.
 *
 * O guião mede, na cabeça do código, e deixa tudo como estava:
 *   1. o programa do typecheck (`tsc -p tsconfig.check.json --listFilesOnly`), em caminhos
 *      relativos, e se cada ficheiro novo ou mudado do bloco está nele;
 *   2. a corrida limpa do `npm run typecheck`;
 *   3. uma planta em `src/lib/series.mjs`, na linha que o editor apontava
 *      (`@returns {x is Serie}`), com um nome de tipo que não existe: tem de fechar o
 *      typecheck com TS2304 nessa linha, e é o conhecido-positivo das duas seguintes;
 *   4. a mesma anotação, acrescentada no fim de `tests/cartao/faixa.mjs` e de
 *      `scripts/series-do-portao.mjs`: o typecheck fica a 0, porque os dois não estão no programa;
 *   5. o `checkJs` do `tsconfig.json` (o programa que um editor costuma ler) e do
 *      `tsconfig.check.json`, e se o `src/lib/series.mjs` leva `// @ts-check`.
 * Cada planta repõe os bytes e confere o sha256. Escreve `plantas/tipos-<nome>.txt` e
 * `tipos-ue1.json`; o guião das medidas (`medir-ue1.mjs`) lê este JSON.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const SAIDA = path.join(RAIZ, PASTA, 'plantas');
fs.mkdirSync(SAIDA, { recursive: true });
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(RAIZ, f))).digest('hex');
const trocas = [
  [RAIZ, '<worktree do sítio>'],
  [fs.realpathSync(os.tmpdir()), '<pasta temporária>'],
  [os.tmpdir(), '<pasta temporária>'],
  [os.homedir(), '<pasta pessoal>'],
  [os.userInfo().username, '<utilizador>'],
].sort((a, b) => b[0].length - a[0].length);
const limpa = (s) => trocas.reduce((t, [de, para]) => t.split(de).join(para), String(s).replace(/\x1b\[[0-9;]*m/g, ''));
const corre = (comando, args) => {
  const r = spawnSync(comando, args, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { codigo: r.status, saida: limpa((r.stdout ?? '') + (r.stderr ?? '')) };
};
const TIPO = 'TipoQueNaoExiste';

/* 1. O programa do typecheck. */
const lista = spawnSync(path.join(RAIZ, 'node_modules', '.bin', 'tsc'), ['-p', 'tsconfig.check.json', '--listFilesOnly'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
if (lista.status !== 0) throw new Error(`tsc --listFilesOnly saiu com ${lista.status}`);
const programa = lista.stdout.split('\n').map((s) => s.trim()).filter(Boolean).map((f) => path.relative(RAIZ, f).split(path.sep).join('/'));
const doSitio = programa.filter((f) => !f.startsWith('node_modules/') && !f.startsWith('../')).sort();
const DENTRO = ['src/tipos.d.ts', 'src/lib/series.mjs', 'src/lib/faixa-da-uniao.mjs', 'src/data/faixa-da-uniao.mjs', 'src/lib/caminho.mjs', 'src/lib/routes.mjs', 'src/i18n/strings.mjs'];
const FORA = ['tests/cartao/faixa.mjs', 'tests/cartao/cartao.mjs', 'scripts/series-do-portao.mjs', 'scripts/gate-html.mjs', 'scripts/check-formas.mjs', 'scripts/check-ledger.mjs', 'scripts/check-cruzamento.mjs', 'scripts/medir-defeitos.mjs'];
const noPrograma = Object.fromEntries([...DENTRO, ...FORA].map((f) => [f, doSitio.includes(f)]));

/* 2. A corrida limpa. */
const limpaDoTypecheck = corre('npm', ['run', 'typecheck']);
fs.writeFileSync(path.join(SAIDA, 'tipos-limpa.txt'), `# npm run typecheck\n# código: ${limpaDoTypecheck.codigo}\n\n${limpaDoTypecheck.saida}`);

/* 3 e 4. As plantas: uma que tem de morder, duas que não podem. */
function planta({ nome, ficheiro, troca, espera }) {
  const alvo = path.join(RAIZ, ficheiro);
  const original = fs.readFileSync(alvo);
  const antes = sha(ficheiro);
  const { texto, linha } = troca(original.toString('utf8'));
  let r;
  try {
    fs.writeFileSync(alvo, texto);
    r = corre('npm', ['run', 'typecheck']);
  } finally {
    fs.writeFileSync(alvo, original);
  }
  const reposto = sha(ficheiro);
  fs.writeFileSync(path.join(SAIDA, `tipos-${nome}.txt`), `# ${nome}\n# ficheiro: ${ficheiro}, linha ${linha}\n# comando: npm run typecheck\n# código: ${r.codigo}\n\n${r.saida}`);
  const naLinha = new RegExp(`${ficheiro.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\(${linha},\\d+\\): error TS2304: Cannot find name '${TIPO}'`).test(r.saida);
  const comoEsperado = espera === 'morde' ? r.codigo !== 0 && naLinha : r.codigo === 0 && !r.saida.includes(TIPO);
  console.log(`${comoEsperado && antes === reposto ? 'como esperado' : 'NÃO'} · ${nome} (código ${r.codigo}, ${espera})`);
  return { nome, ficheiro, linha, espera, codigo: r.codigo, ts2304_na_linha: naLinha, como_esperado: comoEsperado, antes, reposto, saida: `${PASTA}/plantas/tipos-${nome}.txt` };
}
const naLinhaSetenta = (texto) => {
  const de = ' * @returns {x is Serie}\n */\nexport function eSerie(x)';
  if (texto.split(de).length !== 2) throw new Error('a linha da planta não está onde se esperava');
  const linha = texto.slice(0, texto.indexOf(de)).split('\n').length;
  return { texto: texto.replace(de, de.replace('{x is Serie}', `{x is ${TIPO}}`)), linha };
};
const noFim = (texto) => {
  const acrescento = `\n/** @type {${TIPO} | null} */\nexport const plantaDoTipo = null;\n`;
  const base = texto.endsWith('\n') ? texto : `${texto}\n`;
  return { texto: base + acrescento, linha: base.split('\n').length + 1 };
};
const plantas = [
  planta({ nome: 'um-tipo-desconhecido-em-series', ficheiro: 'src/lib/series.mjs', troca: naLinhaSetenta, espera: 'morde' }),
  planta({ nome: 'um-tipo-desconhecido-em-tests-cartao-faixa', ficheiro: 'tests/cartao/faixa.mjs', troca: noFim, espera: 'não morde' }),
  planta({ nome: 'um-tipo-desconhecido-em-series-do-portao', ficheiro: 'scripts/series-do-portao.mjs', troca: noFim, espera: 'não morde' }),
];

/* 5. A configuração. */
// O TypeScript desta árvore é o 7 (o compilador nativo), sem a API de JavaScript que lia um
// tsconfig com comentários: os comentários tiram-se aqui, por uma máquina de estados que não
// toca no que está dentro de uma cadeia.
const semComentarios = (texto) => {
  let saida = '';
  let emCadeia = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (emCadeia) {
      saida += c;
      if (c === '\\') { saida += texto[i + 1] ?? ''; i++; } else if (c === '"') emCadeia = false;
    } else if (c === '"') { emCadeia = true; saida += c; }
    else if (c === '/' && texto[i + 1] === '/') { while (i < texto.length && texto[i] !== '\n') i++; saida += '\n'; }
    else if (c === '/' && texto[i + 1] === '*') { i += 2; while (i < texto.length && !(texto[i] === '*' && texto[i + 1] === '/')) i++; i++; }
    else saida += c;
  }
  return saida.replace(/,(\s*[}\]])/g, '$1');
};
const opcoes = (f) => JSON.parse(semComentarios(fs.readFileSync(path.join(RAIZ, f), 'utf8'))).compilerOptions ?? {};
const configuracao = {
  tsconfig_json_checkJs: opcoes('tsconfig.json').checkJs ?? null,
  tsconfig_check_json_checkJs: opcoes('tsconfig.check.json').checkJs ?? null,
  series_mjs_com_ts_check: /@ts-check/.test(fs.readFileSync(path.join(RAIZ, 'src/lib/series.mjs'), 'utf8')),
};

const resumo = {
  bloco: 'UE1',
  cabeca,
  comando_do_programa: 'node_modules/.bin/tsc -p tsconfig.check.json --listFilesOnly',
  ficheiros_do_sitio_no_programa: doSitio.length,
  conhecido_positivo_da_lista: { o_que: 'astro.config.mjs, que o include nomeia, está na lista', encontrado: doSitio.includes('astro.config.mjs') },
  no_programa: noPrograma,
  corrida_limpa: { comando: 'npm run typecheck', codigo: limpaDoTypecheck.codigo, saida: `${PASTA}/plantas/tipos-limpa.txt` },
  plantas,
  plantas_como_esperado: plantas.filter((p) => p.como_esperado).length,
  plantas_repostas_pelo_sha256: plantas.filter((p) => p.antes === p.reposto).length,
  configuracao,
  programa_do_sitio: doSitio,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'tipos-ue1.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1 tipos: ${resumo.ficheiros_do_sitio_no_programa} ficheiros do sítio no programa; limpa ${limpaDoTypecheck.codigo}; ${resumo.plantas_como_esperado} de ${plantas.length} plantas como esperado, ${resumo.plantas_repostas_pelo_sha256} repostas`);
process.exit(resumo.conhecido_positivo_da_lista.encontrado && limpaDoTypecheck.codigo === 0 && resumo.plantas_como_esperado === plantas.length && resumo.plantas_repostas_pelo_sha256 === plantas.length ? 0 : 1);
