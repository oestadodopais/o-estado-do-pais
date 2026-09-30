/** UE1d: as plantas da passagem da §1.140 e das definições, sobre a construção e sobre a declaração.
 *
 * A mesma convenção de `plantas-ue1.mjs`, `plantas-ue1b.mjs` e `plantas-ue1c.mjs`: cada planta estraga UM
 * ficheiro, corre UM portão sozinho, exige um código diferente de zero COM A QUEIXA ESPERADA, repõe os bytes e
 * confere o sha256. A seguir corre cada portão outra vez, limpo, e exige zero. As saídas vão para
 * `plantas/ue1d/`, sem caminhos da máquina.
 *
 * Os grupos: a ressalva da comparação com a União (tirada de um cartão, do recibo da série e do recibo da
 * linha, posta no cartão de outra medida, e a medida tirada da declaração), que a K14 e a K1 do `check:cartao`
 * têm de apanhar; a definição declarada no recibo da série (uma palavra mudada e a definição tirada), que o
 * portão de HTML tem de apanhar; e um tipo errado na fonte única das ressalvas, que o typecheck tem de apanhar
 * (o conhecido-positivo do typecheck, que corre em menos de um segundo e não escreve nada quando passa).
 *
 * Uso (da raiz do sítio, com `dist/` construído desta cabeça):
 *   node design/especime-v3/medicoes/ue1-2026-09-29/plantas-ue1d.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const SAIDA = path.join(RAIZ, PASTA, 'plantas', 'ue1d');
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
const CARTAO = ['node', 'tests/cartao/cartao.mjs', '--prova'];
const TIPOS = ['node_modules/.bin/tsc', '-p', 'tsconfig.check.json'];
const ID = 'sobrecarga-do-custo-da-habitacao-2025';
const semRessalva = (classe) => (t) => {
  const re = new RegExp(`<p class="${classe}" data-ressalva-da-uniao="${ID}"[^>]*>[^<]*</p>`);
  const sem = t.replace(re, '');
  if (sem === t) throw new Error(`a planta não achou a ressalva «${classe}»`);
  return sem;
};
const plantas = [
  {
    grupo: 'ressalva', nome: 'a ressalva tirada do cartão da sobrecarga na página portuguesa dos temas', ficheiro: 'dist/temas/index.html', comando: CARTAO,
    mordida: new RegExp(`K14 · /temas/ · ${ID}: o cartão mostra a União e sem a ressalva da Comissão`),
    estraga: semRessalva('cartao-medida-ressalva'),
  },
  {
    grupo: 'ressalva', nome: 'a ressalva tirada do recibo inglês da série', ficheiro: `dist/en/ledger/series/${ID}-paises/index.html`, comando: CARTAO,
    mordida: new RegExp(`K14 · /en/ledger/series/${ID}-paises/ · ${ID}: o recibo mostra a União e sem a ressalva da Comissão`),
    estraga: semRessalva('serie-ressalva'),
  },
  {
    grupo: 'ressalva', nome: 'a ressalva tirada do recibo português da linha', ficheiro: `dist/livro-razao/${ID}/index.html`, comando: CARTAO,
    mordida: new RegExp(`K14 · /livro-razao/${ID}/ · ${ID}: o recibo mostra a União e sem a ressalva da Comissão`),
    estraga: semRessalva('linha-nota'),
  },
  {
    grupo: 'ressalva', nome: 'a ressalva posta no cartão da dívida, que não está na lista', ficheiro: 'dist/temas/index.html', comando: CARTAO,
    mordida: /K1 · \/temas\/ · divida-publica-2025: o cartão tem a ressalva da comparação com a União e a medida não está na lista da K14/,
    estraga: (t) => {
      const i = t.indexOf('data-cartao-medida="divida-publica-2025"');
      const j = t.indexOf('</article>', i);
      if (i === -1 || j === -1) throw new Error('a planta não achou o cartão da dívida');
      return `${t.slice(0, j)}<p class="cartao-medida-ressalva" data-ressalva-da-uniao="divida-publica-2025">Uma ressalva que a decisão não pede.</p>${t.slice(j)}`;
    },
  },
  {
    grupo: 'ressalva', nome: 'a medida tirada da declaração das ressalvas', ficheiro: 'src/data/ressalvas-da-uniao.mjs', comando: CARTAO,
    /* Com --prova, a prova corre antes da conferência da declaração e o controlo dela dá vermelho com a razão;
       na primeira corrida desta passagem o construtor da prova rebentava aqui com um TypeError (plantas-ue1d-primeira.json). */
    mordida: new RegExp(`o controlo da K14 deu \\d+ vermelho\\(s\\): K14 · \\S+ · ${ID}: o (cartão|recibo) mostra a União e a declaração não tem o texto da ressalva desta medida`),
    estraga: (t) => uma(t, `  '${ID}': {`, `  '${ID}-plantada': {`),
  },
  {
    grupo: 'definicao', nome: 'uma palavra mudada na definição do recibo dos preços da habitação', ficheiro: 'dist/livro-razao/series/precos-da-habitacao-2025-paises/index.html', comando: HTML,
    mordida: /UE1d: o recibo da série «precos-da-habitacao-2025-paises» diz «[^»]*» e a definição declarada é/,
    estraga: (t) => uma(t, 'preços de transação das casas', 'preços de venda das casas'),
  },
  {
    grupo: 'definicao', nome: 'a definição tirada do recibo inglês do índice harmonizado', ficheiro: 'dist/en/ledger/series/ihpc-variacao-homologa-paises/index.html', comando: HTML,
    mordida: /UE1d: o recibo da série «ihpc-variacao-homologa-paises» tem 0 definição\(ões\) da medida/,
    estraga: (t) => {
      const sem = t.replace(/<p class="serie-o-que-conta" data-serie-o-que-conta="[^"]+"[^>]*>[\s\S]*?<\/p>/, '');
      if (sem === t) throw new Error('a planta não achou a definição');
      return sem;
    },
  },
  {
    grupo: 'tipos', nome: 'um número onde a fonte única das ressalvas promete um texto', ficheiro: 'src/data/ressalvas-da-uniao.mjs', comando: TIPOS,
    mordida: /src\/data\/ressalvas-da-uniao\.mjs\(\d+,\d+\): error TS2322/,
    estraga: (t) => uma(t, 'return r ? r[lang] : null;', 'return r ? r[lang].length : null;'),
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
    segundos: Math.round((Date.now() - inicio) / 100) / 10, saida: `${PASTA}/plantas/ue1d/${nomeDoFicheiro}`,
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
  limpas.push({ comando, codigo: r.status, saida: `${PASTA}/plantas/ue1d/${nome}` });
  console.log(`limpa   ${comando} (código ${r.status})`);
}

const porGrupo = {};
for (const r of resultados) porGrupo[r.grupo] = (porGrupo[r.grupo] ?? 0) + 1;
const resumo = {
  bloco: 'UE1d', cabeca, construcao: construcao.commit,
  plantas: resultados.length, mordidas: resultados.filter((r) => r.passou).length,
  repostas_com_o_mesmo_sha256: resultados.filter((r) => r.antes === r.reposto).length,
  plantas_por_grupo: porGrupo,
  corridas_limpas: limpas.length, corridas_limpas_a_zero: limpas.filter((l) => l.codigo === 0).length,
  resultados, limpas,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'plantas-ue1d.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1d plantas: ${resumo.mordidas} de ${resumo.plantas} morderam e foram repostas; ${resumo.corridas_limpas_a_zero} de ${resumo.corridas_limpas} corridas limpas a zero`);
process.exit(resumo.mordidas === resumo.plantas && resumo.corridas_limpas_a_zero === resumo.corridas_limpas ? 0 : 1);
