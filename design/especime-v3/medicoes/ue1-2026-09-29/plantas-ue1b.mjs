/** UE1b: as plantas da passagem de correção, sobre a construção e sobre as palavras declaradas.
 *
 * A mesma convenção de `plantas-ue1.mjs`: cada planta estraga UM ficheiro (uma página de `dist/`, a
 * declaração das palavras, o registo dos acertos ou o inventário das frases), corre UM portão sozinho,
 * exige um código diferente de zero COM A QUEIXA ESPERADA, repõe os bytes e confere que o sha256 voltou
 * a ser o de antes. A seguir corre cada portão outra vez, limpo, e exige zero. As saídas vão para
 * `plantas/ue1b/`, sem caminhos da máquina.
 *
 * Os grupos: o ordinal inglês (uma planta de cada sufixo na declaração, e duas na página, uma delas a
 * exceção dos 11 a 13), as ressalvas da fonte nas pontas, o que quer dizer cada marca no recibo da série,
 * a porta do recibo da linha portuguesa, o acerto F4 e a linha do inventário da forma com «nd».
 *
 * Uso (da raiz do sítio, com `dist/` construído desta cabeça):
 *   node design/especime-v3/medicoes/ue1-2026-09-29/plantas-ue1b.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const SAIDA = path.join(RAIZ, PASTA, 'plantas', 'ue1b');
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

/** Troca uma cadeia que tem de existir exactamente uma vez. */
const uma = (texto, de, para) => {
  const n = texto.split(de).length - 1;
  if (n !== 1) throw new Error(`a planta esperava uma ocorrência de «${de.slice(0, 80)}» e achou ${n}`);
  return texto.replace(de, para);
};

const FORMAS = ['node', 'scripts/check-formas.mjs'];
const HTML = ['node', 'scripts/gate-html.mjs'];
const DECL = 'src/data/faixa-da-uniao.mjs';
const TEMAS = 'dist/temas/index.html';
const THEMES = 'dist/en/themes/index.html';
const HAB = 'precos-da-habitacao-2025-paises';
const RECIBO_HAB = `dist/livro-razao/series/${HAB}/index.html`;
const plantas = [
  /* O ordinal inglês: um de cada sufixo na declaração, e dois na página. */
  ...[['st', 'th', 1], ['nd', 'th', 2], ['rd', 'th', 3], ['th', 'st', 4]].map(([sufixo, outro, n]) => ({
    grupo: 'ordinal', nome: `o sufixo «${sufixo}» declarado como «${outro}»`, ficheiro: DECL, comando: FORMAS,
    mordida: new RegExp(`F19g · o lugar ${n} diz-se «${n}${outro}» na edição inglesa e o ordinal é «${n}${sufixo}»`),
    estraga: (t) => uma(t, `${sufixo}: '${sufixo}'`, `${sufixo}: '${outro}'`),
  })),
  {
    grupo: 'ordinal', nome: 'o «2nd» da página trocado por «2th»', ficheiro: THEMES, comando: FORMAS,
    mordida: /F19e · \/en\/themes\/index\.html · precos-da-habitacao-2025: a frase diz «[^»]*ranks 2th from the highest\.» e a recomposição dá «[^»]*ranks 2nd from the highest\.»/,
    estraga: (t) => uma(t, `data-ponto-lugar="${HAB}">2</span>nd from the highest`, `data-ponto-lugar="${HAB}">2</span>th from the highest`),
  },
  {
    grupo: 'ordinal', nome: 'o «12th» da página pela regra sem a exceção dos 11 a 13 («12nd»)', ficheiro: THEMES, comando: FORMAS,
    mordida: /F19e · \/en\/themes\/index\.html · taxa-de-emprego-2025: a frase diz «[^»]*ranks 12nd from the highest\.» e a recomposição dá «[^»]*ranks 12th from the highest\.»/,
    estraga: (t) => uma(t, 'data-ponto-lugar="taxa-de-emprego-2025-paises">12</span>th from the highest', 'data-ponto-lugar="taxa-de-emprego-2025-paises">12</span>nd from the highest'),
  },
  /* As ressalvas da fonte nas pontas. */
  {
    grupo: 'ressalva', nome: 'a ressalva de uma ponta trocada pela letra crua', ficheiro: TEMAS, comando: FORMAS,
    mordida: /F19d · \/temas\/index\.html · precos-da-habitacao-2025: a ponta «alto» mostra a letra crua da marca da fonte/,
    estraga: (t) => uma(t, `<span class="faixa-ue-ressalva" data-faixa-ressalva="${HAB}#HU" data-bandeira="p"> (dado provisório)</span>`, ` <span class="faixa-ue-bandeira" data-ponto-bandeira="${HAB}#HU">p</span>`),
  },
  {
    grupo: 'ressalva', nome: 'a ressalva de uma ponta com as palavras de outra marca', ficheiro: THEMES, comando: FORMAS,
    mordida: /F19d · \/en\/themes\/index\.html · taxa-de-desemprego-mip-2025: a ressalva da ponta «alto» diz «\(provisional data\)» e as palavras declaradas da marca «d» são «\(definition differs\)»/,
    estraga: (t) => uma(t, 'data-bandeira="d"> (definition differs)</span>', 'data-bandeira="d"> (provisional data)</span>'),
  },
  {
    grupo: 'ressalva', nome: 'a marca «d» sem palavras na declaração inglesa', ficheiro: DECL, comando: FORMAS,
    mordida: /F19h · a marca «d», que um ponto de uma série leva, não tem palavras declaradas na edição «en»/,
    estraga: (t) => uma(t, "      d: 'definition differs',\n", ''),
  },
  /* O que quer dizer cada marca, no recibo da série. */
  {
    grupo: 'legenda', nome: 'a definição de uma marca trocada na legenda', ficheiro: RECIBO_HAB, comando: HTML,
    mordida: /o campo «bandeiras\.p» da série «precos-da-habitacao-2025-paises» foi renderizado como «preliminary» e a série diz «provisional»/,
    estraga: (t) => uma(t, 'data-serie-campo="bandeiras.p" lang="en" class="campo-da-serie serie-marca-rotulo">provisional</span>', 'data-serie-campo="bandeiras.p" lang="en" class="campo-da-serie serie-marca-rotulo">preliminary</span>'),
  },
  {
    grupo: 'legenda', nome: 'uma marca tirada da legenda', ficheiro: RECIBO_HAB, comando: HTML,
    mordida: /a legenda do recibo da série «precos-da-habitacao-2025-paises» diz as marcas p; a tabela mostra/,
    estraga: (t) => t.replace(new RegExp(`<div class="serie-marca-entrada"><dt><span data-serie-marca="${HAB}#ep">ep</span>[\\s\\S]*?</dd></div>`), ''),
  },
  {
    grupo: 'legenda', nome: 'as palavras de uma marca trocadas na legenda', ficheiro: RECIBO_HAB, comando: HTML,
    mordida: /as palavras da marca «p» são «dado definitivo» e as declaradas são «dado provisório»/,
    estraga: (t) => uma(t, `data-serie-marca-palavras="${HAB}#p">dado provisório</span>`, `data-serie-marca-palavras="${HAB}#p">dado definitivo</span>`),
  },
  /* A porta do recibo da linha portuguesa para a sua série. */
  {
    grupo: 'porta', nome: 'a porta tirada do recibo da linha portuguesa', ficheiro: 'dist/livro-razao/precos-da-habitacao-2025/index.html', comando: HTML,
    mordida: /o recibo da linha «precos-da-habitacao-2025» tem 0 porta\(s\) para uma série, e tem de ter uma/,
    estraga: (t) => uma(t, `<a href="/livro-razao/series/${HAB}" data-porta-da-serie="${HAB}">Todos os países</a>`, ''),
  },
  {
    grupo: 'porta', nome: 'a porta para outra série', ficheiro: 'dist/en/ledger/precos-da-habitacao-2025/index.html', comando: HTML,
    mordida: /o recibo da linha «precos-da-habitacao-2025» tem 1 porta\(s\) para uma série, e tem de ter uma, no bloco «O enquadramento», para «\/en\/ledger\/series\/precos-da-habitacao-2025-paises»/,
    estraga: (t) => uma(t, `<a href="/en/ledger/series/${HAB}" data-porta-da-serie="${HAB}">`, '<a href="/en/ledger/series/divida-publica-2025-paises" data-porta-da-serie="divida-publica-2025-paises">'),
  },
  {
    grupo: 'porta', nome: 'uma porta no recibo de uma linha sem série', ficheiro: 'dist/livro-razao/precos-da-habitacao-2024/index.html', comando: HTML,
    mordida: /o recibo da linha «precos-da-habitacao-2024» tem uma porta para a série «precos-da-habitacao-2025-paises», e a linha não é a portuguesa de série nenhuma/,
    estraga: (t) => uma(t, '</main>', `<p><a href="/livro-razao/series/${HAB}" data-porta-da-serie="${HAB}">Todos os países</a></p></main>`),
  },
  /* O acerto F4 e o inventário das frases. */
  {
    grupo: 'palavras', nome: 'o acerto F4 tirado do registo dos acertos', ficheiro: `${PASTA}/acertos-ue1.json`, comando: ['python3', `${PASTA}/acertos-ue1.py`],
    mordida: /DIFERE  en · sem empate/,
    estraga: (t) => {
      const sem = t.replace(/,\n    \{"id": "F4"[\s\S]*?\}\n  \]/, '\n  ]');
      if (sem === t) throw new Error('a planta não achou o acerto F4');
      return sem;
    },
  },
  {
    grupo: 'inventario', nome: 'a linha inglesa da forma com «nd» escrita com outro sufixo', ficheiro: 'design/especime-v3/INVENTARIO-FRASES.md', comando: ['node', 'scripts/check-voz.mjs'],
    mordida: /linha «viva» que não se rende em rota nenhuma/,
    estraga: (t) => uma(t, '( ) ranks nd from the highest. | ue1b |', '( ) ranks rd from the highest. | ue1b |'),
  },
];

const resultados = [];
for (const p of plantas) {
  const alvo = path.join(RAIZ, p.ficheiro);
  const antes = sha(alvo);
  const original = fs.existsSync(alvo) ? fs.readFileSync(alvo) : null;
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
    segundos: Math.round((Date.now() - inicio) / 100) / 10, saida: `${PASTA}/plantas/ue1b/${nomeDoFicheiro}`,
    ...(erroDaPlanta ? { erro_da_planta: erroDaPlanta } : {}),
  });
  console.log(`${mordeu && antes === reposto ? 'mordeu ' : 'FALHOU '} ${p.grupo} · ${p.nome} (código ${codigo})`);
}

/* E AS CORRIDAS LIMPAS, depois de todas as reposições: cada portão a zero. */
const limpas = [];
for (const comando of [...new Set(plantas.map((p) => p.comando.join(' ')))]) {
  const partes = comando.split(' ');
  const r = spawnSync(partes[0], partes.slice(1), { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const nome = `limpa-${partes.at(-1).split('/').at(-1).replace(/\.[a-z]+$/, '')}.txt`;
  fs.writeFileSync(path.join(SAIDA, nome), `# ${comando}\n# código: ${r.status}\n\n${limpa((r.stdout ?? '') + (r.stderr ?? ''))}`);
  limpas.push({ comando, codigo: r.status, saida: `${PASTA}/plantas/ue1b/${nome}` });
  console.log(`limpa   ${comando} (código ${r.status})`);
}

const porGrupo = {};
for (const r of resultados) porGrupo[r.grupo] = (porGrupo[r.grupo] ?? 0) + 1;
const resumo = {
  bloco: 'UE1b', cabeca, construcao: construcao.commit,
  plantas: resultados.length, mordidas: resultados.filter((r) => r.passou).length,
  repostas_com_o_mesmo_sha256: resultados.filter((r) => r.antes === r.reposto).length,
  plantas_por_grupo: porGrupo,
  corridas_limpas: limpas.length, corridas_limpas_a_zero: limpas.filter((l) => l.codigo === 0).length,
  resultados, limpas,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'plantas-ue1b.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1b plantas: ${resumo.mordidas} de ${resumo.plantas} morderam e foram repostas; ${resumo.corridas_limpas_a_zero} de ${resumo.corridas_limpas} corridas limpas a zero`);
process.exit(resumo.mordidas === resumo.plantas && resumo.corridas_limpas_a_zero === resumo.corridas_limpas ? 0 : 1);
