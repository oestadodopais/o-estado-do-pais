/** UE1c: as plantas da passagem de correção, sobre a célula da faixa e sobre os recibos construídos.
 *
 * A mesma convenção de `plantas-ue1.mjs` e `plantas-ue1b.mjs`: cada planta estraga UM ficheiro, corre UM
 * portão sozinho, exige um código diferente de zero COM A QUEIXA ESPERADA, repõe os bytes e confere o
 * sha256. A seguir corre cada portão outra vez, limpo, e exige zero. As saídas vão para `plantas/ue1c/`,
 * sem caminhos da máquina.
 *
 * Os grupos: os empates (a F19d estragada para ver só o primeiro país da ponta, e as plantas dos empates
 * têm de dar por isso) e o que a medida conta no recibo da série (a frase mudada, a frase tirada, e uma
 * frase posta num recibo cuja leitura do cartão não a tem).
 *
 * Uso (da raiz do sítio, com `dist/` construído desta cabeça):
 *   node design/especime-v3/medicoes/ue1-2026-09-29/plantas-ue1c.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const SAIDA = path.join(RAIZ, PASTA, 'plantas', 'ue1c');
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
const plantas = [
  {
    grupo: 'empates', nome: 'a F19d a ver só o primeiro país da ponta', ficheiro: 'tests/cartao/faixa.mjs', comando: ['node', 'scripts/check-formas.mjs'],
    mordida: /a planta «a marca só no segundo país empatado, e a ponta sem ela» \(pt\) não mordeu/,
    estraga: (t) => uma(t, '  geos.forEach((geo, i) => {', '  geos.slice(0, 1).forEach((geo, i) => {'),
  },
  {
    grupo: 'o que conta', nome: 'a frase do recibo da pobreza com uma palavra a menos', ficheiro: 'dist/livro-razao/series/risco-de-pobreza-ou-exclusao-2025-paises/index.html', comando: HTML,
    mordida: /UE1c: o recibo da série «risco-de-pobreza-ou-exclusao-2025-paises» diz «[^»]*» e a leitura do cartão diz/,
    estraga: (t) => uma(t, 'privação material e social grave', 'privação material grave'),
  },
  {
    grupo: 'o que conta', nome: 'a frase tirada do recibo inglês dos inquilinos', ficheiro: 'dist/en/ledger/series/sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises/index.html', comando: HTML,
    mordida: /UE1c: o recibo da série «sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises» tem 0 frase\(s\) do que a medida conta/,
    estraga: (t) => {
      const sem = t.replace(/<p class="serie-o-que-conta" data-serie-o-que-conta="[^"]+">[\s\S]*?<\/p>/, '');
      if (sem === t) throw new Error('a planta não achou a frase');
      return sem;
    },
  },
  {
    grupo: 'o que conta', nome: 'uma frase posta no recibo do rácio S80/S20, cuja leitura não a tem', ficheiro: 'dist/livro-razao/series/racio-s80-s20-2025-paises/index.html', comando: HTML,
    mordida: /UE1c: o recibo da série «racio-s80-s20-2025-paises» diz o que a medida conta, e a leitura do cartão não abre com essa frase/,
    estraga: (t) => uma(t, '</h1>', '</h1><p class="serie-o-que-conta" data-serie-o-que-conta="racio-s80-s20-2025-paises">Uma frase que o cartão não diz.</p>'),
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
    segundos: Math.round((Date.now() - inicio) / 100) / 10, saida: `${PASTA}/plantas/ue1c/${nomeDoFicheiro}`,
    ...(erroDaPlanta ? { erro_da_planta: erroDaPlanta } : {}),
  });
  console.log(`${mordeu && antes === reposto ? 'mordeu ' : 'FALHOU '} ${p.grupo} · ${p.nome} (código ${codigo})`);
}

const limpas = [];
for (const comando of [...new Set(plantas.map((p) => p.comando.join(' ')))]) {
  const partes = comando.split(' ');
  const r = spawnSync(partes[0], partes.slice(1), { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const nome = `limpa-${partes.at(-1).split('/').at(-1).replace(/\.[a-z]+$/, '')}.txt`;
  fs.writeFileSync(path.join(SAIDA, nome), `# ${comando}\n# código: ${r.status}\n\n${limpa((r.stdout ?? '') + (r.stderr ?? ''))}`);
  limpas.push({ comando, codigo: r.status, saida: `${PASTA}/plantas/ue1c/${nome}` });
  console.log(`limpa   ${comando} (código ${r.status})`);
}

const porGrupo = {};
for (const r of resultados) porGrupo[r.grupo] = (porGrupo[r.grupo] ?? 0) + 1;
const resumo = {
  bloco: 'UE1c', cabeca, construcao: construcao.commit,
  plantas: resultados.length, mordidas: resultados.filter((r) => r.passou).length,
  repostas_com_o_mesmo_sha256: resultados.filter((r) => r.antes === r.reposto).length,
  plantas_por_grupo: porGrupo,
  corridas_limpas: limpas.length, corridas_limpas_a_zero: limpas.filter((l) => l.codigo === 0).length,
  resultados, limpas,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'plantas-ue1c.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1c plantas: ${resumo.mordidas} de ${resumo.plantas} morderam e foram repostas; ${resumo.corridas_limpas_a_zero} de ${resumo.corridas_limpas} corridas limpas a zero`);
process.exit(resumo.mordidas === resumo.plantas && resumo.corridas_limpas_a_zero === resumo.corridas_limpas ? 0 : 1);
