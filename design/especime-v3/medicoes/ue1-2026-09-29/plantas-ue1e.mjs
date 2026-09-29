/** UE1e: as plantas da passagem da forma do recibo da série, sobre a construção e sobre a declaração.
 *
 * A mesma convenção das plantas da UE1 à UE1d: cada planta estraga UM ficheiro, corre UM portão sozinho, exige
 * um código diferente de zero COM A QUEIXA ESPERADA, repõe os bytes e confere o sha256. A seguir corre o portão
 * outra vez, limpo, e exige zero (o controlo). As saídas vão para `plantas/ue1e/`, sem caminhos da máquina.
 *
 * Os grupos: a regra nova do portão de HTML, a definição de nenhum recibo de série nomeia Portugal (o lugar
 * posto de volta no recibo português do índice harmonizado, o nome posto no recibo inglês da dívida, um
 * gentílico posto no recibo português dos preços da habitação); e a forma que cada recibo deve usar (a forma
 * do recibo da série tirada da declaração, e uma palavra mudada nela).
 *
 * Uso (da raiz do sítio, com `dist/` construído desta cabeça):
 *   node design/especime-v3/medicoes/ue1-2026-09-29/plantas-ue1e.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const SAIDA = path.join(RAIZ, PASTA, 'plantas', 'ue1e');
fs.mkdirSync(SAIDA, { recursive: true });
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const construcao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8'));
if (construcao.commit !== cabeca) throw new Error(`dist/ é de ${construcao.commit} e a cabeça é ${cabeca}: construa primeiro.`);

const sha = (f) => (fs.existsSync(f) ? crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') : 'ausente');
const trocas = [
  [RAIZ, '<worktree do sítio>'],
  [fs.realpathSync(os.tmpdir()), '<pasta temporária>'],
  [os.tmpdir(), '<pasta temporária>'],
  [os.homedir(), '<pasta pessoal>'],
  [os.userInfo().username, '<utilizador>'],
].sort((a, b) => b[0].length - a[0].length);
const limpa = (s) => trocas.reduce((t, [de, para]) => t.split(de).join(para), String(s).replace(/\x1b\[[0-9;]*m/g, ''));
const uma = (texto, de, para) => {
  const n = texto.split(de).length - 1;
  if (n !== 1) throw new Error(`a planta esperava uma ocorrência de «${de.slice(0, 80)}» e achou ${n}`);
  return texto.replace(de, para);
};

const HTML = ['node', 'scripts/gate-html.mjs'];
const IHPC = 'ihpc-variacao-homologa-paises';
const plantas = [
  {
    grupo: 'portugal', nome: 'o lugar posto de volta na definição do recibo português do índice harmonizado', ficheiro: `dist/livro-razao/series/${IHPC}/index.html`, comando: HTML,
    mordida: new RegExp(`UE1e: a definição do recibo da série «${IHPC}» nomeia Portugal \\(«Portugal»\\)`),
    estraga: (t) => uma(t, 'Quanto mudaram os preços no consumidor face ao mesmo mês', 'Quanto mudaram os preços no consumidor em Portugal face ao mesmo mês'),
  },
  {
    grupo: 'portugal', nome: 'o nome posto na definição do recibo inglês da dívida', ficheiro: 'dist/en/ledger/series/divida-publica-2025-paises/index.html', comando: HTML,
    mordida: /UE1e: a definição do recibo da série «divida-publica-2025-paises» nomeia Portugal \(«Portugal»\)/,
    estraga: (t) => uma(t, 'How much does general government owe, as a percentage of GDP?', 'How much does general government in Portugal owe, as a percentage of GDP?'),
  },
  {
    grupo: 'portugal', nome: 'um gentílico posto na definição do recibo português dos preços da habitação', ficheiro: 'dist/livro-razao/series/precos-da-habitacao-2025-paises/index.html', comando: HTML,
    mordida: /UE1e: a definição do recibo da série «precos-da-habitacao-2025-paises» nomeia Portugal \(«portuguesas»\)/,
    estraga: (t) => uma(t, 'compradas pelas famílias?', 'compradas pelas famílias portuguesas?'),
  },
  {
    grupo: 'forma', nome: 'a forma do recibo da série tirada da declaração', ficheiro: 'src/data/medidas-rp1.mjs', comando: HTML,
    /* Sem a forma, o portão espera a do cartão, que diz «em Portugal», e o recibo construído não a diz. */
    mordida: new RegExp(`UE1d: o recibo da série «${IHPC}» diz «Quanto mudaram os preços no consumidor face ao mesmo mês[^»]*» e a definição declarada é «Quanto mudaram os preços no consumidor em Portugal`),
    estraga: (t) => uma(t, '"serie": {', '"serie_plantada": {'),
  },
  {
    grupo: 'forma', nome: 'uma palavra mudada na forma do recibo da série', ficheiro: 'src/data/medidas-rp1.mjs', comando: HTML,
    mordida: /UE1e: a forma do recibo da série de «ihpc-variacao-homologa» \(pt\) não é a pergunta do cartão sem o lugar/,
    estraga: (t) => uma(t, '"Quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior, na medida', '"Quanto mudaram os preços no consumidor face ao mês do ano anterior, na medida'),
  },
];

const resultados = [];
for (const p of plantas) {
  const alvo = path.join(RAIZ, p.ficheiro);
  const antes = sha(alvo);
  const original = fs.readFileSync(alvo);
  let erroDaPlanta = null;
  try {
    const novo = p.estraga(original.toString('utf8'));
    if (novo === original.toString('utf8')) throw new Error('a planta não mudou o ficheiro');
    fs.writeFileSync(alvo, novo);
  } catch (e) {
    erroDaPlanta = e.message;
  }
  let codigo = null;
  let saida = '';
  const inicio = Date.now();
  if (!erroDaPlanta) {
    const r = spawnSync(p.comando[0], p.comando.slice(1), { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    codigo = r.status;
    saida = limpa((r.stdout ?? '') + (r.stderr ?? ''));
  }
  fs.writeFileSync(alvo, original);
  const reposto = sha(alvo);
  const nomeDoFicheiro = `planta-${p.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}.txt`;
  fs.writeFileSync(path.join(SAIDA, nomeDoFicheiro), `# ${p.nome}\n# comando: ${p.comando.join(' ')}\n# código: ${codigo}\n\n${erroDaPlanta ? `A PLANTA NÃO SE PLANTOU: ${erroDaPlanta}\n` : saida}`);
  const mordeu = !erroDaPlanta && codigo !== 0 && p.mordida.test(saida);
  resultados.push({
    grupo: p.grupo, nome: p.nome, ficheiro: p.ficheiro, comando: p.comando.join(' '), codigo,
    mordida: String(p.mordida), passou: mordeu && antes === reposto, antes, reposto,
    segundos: Math.round((Date.now() - inicio) / 100) / 10, saida: `${PASTA}/plantas/ue1e/${nomeDoFicheiro}`,
    ...(erroDaPlanta ? { erro_da_planta: erroDaPlanta } : {}),
  });
  console.log(`${mordeu && antes === reposto ? 'mordeu ' : 'FALHOU '} ${p.grupo} · ${p.nome} (código ${codigo})`);
}

const limpas = [];
for (const comando of [...new Set(plantas.map((p) => p.comando.join(' ')))]) {
  const partes = comando.split(' ');
  const r = spawnSync(partes[0], partes.slice(1), { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const guiao = partes.find((x) => /\.(mjs|py)$/.test(x)) ?? partes.at(-1);
  const nome = `limpa-${guiao.split('/').at(-1).replace(/\.[a-z]+$/, '')}.txt`;
  fs.writeFileSync(path.join(SAIDA, nome), `# ${comando}\n# código: ${r.status}\n\n${limpa((r.stdout ?? '') + (r.stderr ?? ''))}`);
  limpas.push({ comando, codigo: r.status, saida: `${PASTA}/plantas/ue1e/${nome}` });
  console.log(`limpa   ${comando} (código ${r.status})`);
}

const porGrupo = {};
for (const r of resultados) porGrupo[r.grupo] = (porGrupo[r.grupo] ?? 0) + 1;
const resumo = {
  bloco: 'UE1e', cabeca, construcao: construcao.commit,
  plantas: resultados.length, mordidas: resultados.filter((r) => r.passou).length,
  repostas_com_o_mesmo_sha256: resultados.filter((r) => r.antes === r.reposto).length,
  plantas_por_grupo: porGrupo,
  corridas_limpas: limpas.length, corridas_limpas_a_zero: limpas.filter((l) => l.codigo === 0).length,
  resultados, limpas,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'plantas-ue1e.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1e plantas: ${resumo.mordidas} de ${resumo.plantas} morderam e foram repostas; ${resumo.corridas_limpas_a_zero} de ${resumo.corridas_limpas} corridas limpas a zero`);
process.exit(resumo.mordidas === resumo.plantas && resumo.corridas_limpas_a_zero === resumo.corridas_limpas ? 0 : 1);
