/** UE1: as plantas do bloco, sobre a construção e sobre as fontes do livro-razão.
 *
 * Cada planta estraga UM ficheiro (uma página de `dist/`, um ficheiro de uma série ou a declaração das
 * palavras), corre UM portão sozinho, exige um código diferente de zero COM A QUEIXA ESPERADA (e não
 * qualquer queixa), repõe os bytes e confere que o sha256 voltou a ser o de antes. A seguir corre cada
 * portão outra vez, limpo, e exige zero. É a convenção de `design/especime-v3/medicoes/b1-2026-09-17/`.
 * As saídas guardam-se sem caminhos da máquina: a raiz do sítio, a do motor, a pasta pessoal, a pasta
 * temporária e o nome do utilizador saem trocados por marcas.
 *
 * Uso (da raiz do sítio, com `dist/` construído desta cabeça):
 *   node design/especime-v3/medicoes/ue1-2026-09-29/plantas-ue1.mjs
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

const TEMAS = 'dist/temas/index.html';
const S = 'divida-publica-2025-paises';
const plantas = [
  {
    grupo: 'faixa', nome: 'um algarismo da faixa sem origem', ficheiro: TEMAS, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /algarismos fora do livro-razão: "81,7"/,
    estraga: (t) => uma(t, `<span class="ponto-da-serie faixa-ue-valor" data-ponto="${S}#EU27_2020">81,7</span>`, '<span class="ponto-da-serie faixa-ue-valor">81,7</span>'),
  },
  {
    grupo: 'faixa', nome: 'um país em falta no desenho', ficheiro: TEMAS, comando: ['node', 'scripts/check-formas.mjs'],
    mordida: /F19b · \/temas\/index\.html · divida-publica-2025: falta no desenho a marca de MT/,
    estraga: (t) => t.replace(new RegExp(`<span class="faixa-ue-marca faixa-ue-pais" data-faixa-marca="${S}#MT" style="left:[\\d.]+%"></span>`), ''),
  },
  {
    grupo: 'faixa', nome: 'uma posição trocada', ficheiro: TEMAS, comando: ['node', 'scripts/check-formas.mjs'],
    mordida: /F19c · \/temas\/index\.html · divida-publica-2025: a marca de PT está em 12\.5 %/,
    estraga: (t) => t.replace(new RegExp(`(data-faixa-marca="${S}#PT" style="left:)[\\d.]+%`), '$112.5%'),
  },
  {
    grupo: 'faixa', nome: 'o ponto da União da faixa a divergir da série', ficheiro: TEMAS, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /o ponto «EU27_2020» da série «divida-publica-2025-paises» foi renderizado como «81,8»/,
    estraga: (t) => uma(t, `data-ponto="${S}#EU27_2020">81,7</span>`, `data-ponto="${S}#EU27_2020">81,8</span>`),
  },
  {
    grupo: 'faixa', nome: 'o empate tirado da frase', ficheiro: TEMAS, comando: ['node', 'scripts/check-formas.mjs'],
    mordida: /F19e · \/temas\/index\.html · risco-de-pobreza-ou-exclusao-2025: a frase diz/,
    estraga: (t) => {
      const i = t.indexOf('data-faixa-frase="risco-de-pobreza-ou-exclusao-2025-paises"');
      const j = t.indexOf('</p>', i);
      const frase = t.slice(i, j);
      const sem = frase.replace(/, a par de outros países com o mesmo valor \([\s\S]*\)\.$/, '.');
      if (sem === frase) throw new Error('a planta do empate não achou a oração do empate');
      return t.slice(0, i) + sem + t.slice(j);
    },
  },
  {
    grupo: 'faixa', nome: 'um nome de país escrito à mão', ficheiro: TEMAS, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /o nome do país «EL» foi renderizado como «Grecia»/,
    estraga: (t) => uma(t, `<span class="faixa-ue-ponta faixa-ue-ponta-alto" data-faixa-ponta="alto"><span class="nome-do-pais" data-pais="EL">Grécia</span> <span class="ponto-da-serie faixa-ue-valor" data-ponto="${S}#EL">`, `<span class="faixa-ue-ponta faixa-ue-ponta-alto" data-faixa-ponta="alto"><span class="nome-do-pais" data-pais="EL">Grecia</span> <span class="ponto-da-serie faixa-ue-valor" data-ponto="${S}#EL">`),
  },
  {
    grupo: 'faixa', nome: 'o lugar de Portugal trocado', ficheiro: TEMAS, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /«data-ponto-lugar» da série «divida-publica-2025-paises» diz «7» e a recontagem dos pontos dá «6»/,
    estraga: (t) => uma(t, `data-ponto-lugar="${S}">6</span>`, `data-ponto-lugar="${S}">7</span>`),
  },
  {
    grupo: 'faixa', nome: 'a contagem dos países trocada', ficheiro: TEMAS, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /«data-ponto-conta» da série «divida-publica-2025-paises» diz «26» e a recontagem dos pontos dá «27»/,
    estraga: (t) => uma(t, `data-ponto-conta="${S}">27</span>`, `data-ponto-conta="${S}">26</span>`),
  },
  {
    grupo: 'recibo', nome: 'um valor da tabela do recibo trocado', ficheiro: `dist/livro-razao/series/${S}/index.html`, comando: ['node', 'scripts/gate-html.mjs'],
    mordida: /o ponto «BE» da série «divida-publica-2025-paises» foi renderizado como «107,0»/,
    estraga: (t) => uma(t, `data-ponto="${S}#BE">107,9</span>`, `data-ponto="${S}#BE">107,0</span>`),
  },
  {
    grupo: 'livro', nome: 'o ponto da União da série a divergir da linha -ue', ficheiro: `ledger/series/${S}.yml`, comando: ['node', 'scripts/check-ledger.mjs'],
    mordida: /S6: o ponto EU27_2020 \(«81,8»\) não é, como número, a linha «divida-publica-2025-ue» \(«81,7»\)/,
    estraga: (t) => uma(uma(t, '    valor: "81,7"\n', '    valor: "81,8"\n'), 'European Union - 27 countries (from 2020) — 2025: 81.7"', 'European Union - 27 countries (from 2020) — 2025: 81.8"'),
  },
  {
    grupo: 'livro', nome: 'o ponto de Portugal da série a divergir da linha portuguesa', ficheiro: `ledger/series/${S}.yml`, comando: ['node', 'scripts/check-ledger.mjs'],
    mordida: /S6: o ponto PT \(«89,6»\) não é, como número, a linha «divida-publica-2025» \(«89,7»\)/,
    estraga: (t) => uma(uma(t, '    valor: "89,7"\n', '    valor: "89,6"\n'), '— Portugal — 2025: 89.7"', '— Portugal — 2025: 89.6"'),
  },
  {
    grupo: 'livro', nome: 'um país em falta na série', ficheiro: `ledger/series/${S}.yml`, comando: ['node', 'scripts/check-ledger.mjs'],
    mordida: /S3: país em falta: MT/,
    estraga: (t) => t.replace(/  - geo: "MT"\n    valor: "[^"]+"\n    excerto: "[^"]+"\n    bandeira: null\n/, ''),
  },
  {
    grupo: 'livro', nome: 'uma série editada à mão', ficheiro: `ledger/series/${S}.yml`, comando: ['node', 'scripts/check-cruzamento.mjs'],
    mordida: /\[series\.json\] divida-publica-2025-paises: os bytes em disco já não são os que atravessaram/,
    estraga: (t) => uma(t, 'study: "dominios-2026"\n', 'study: "dominios-2026"\n# uma linha escrita à mão\n'),
  },
  {
    grupo: 'livro', nome: 'uma série escrita à mão, sem travessia', ficheiro: 'ledger/series/uma-serie-a-mao-paises.yml', comando: ['node', 'scripts/check-cruzamento.mjs'],
    mordida: /série\(s\) em ledger\/series\/ que nenhum registo de travessia nomeia: uma-serie-a-mao-paises/,
    novo: () => fs.readFileSync(path.join(RAIZ, `ledger/series/${S}.yml`), 'utf8').replace(`id: "${S}"`, 'id: "uma-serie-a-mao-paises"'),
  },
  {
    grupo: 'palavras', nome: 'uma palavra da frase mudada na declaração', ficheiro: 'src/data/faixa-da-uniao.mjs', comando: ['python3', `${PASTA}/acertos-ue1.py`],
    mordida: /DIFERE  pt · sem empate/,
    estraga: (t) => uma(t, "'); a média da União é '", "'); a média da Europa é '"),
  },
];

const resultados = [];
for (const p of plantas) {
  const alvo = path.join(RAIZ, p.ficheiro);
  const antes = sha(alvo);
  const original = fs.existsSync(alvo) ? fs.readFileSync(alvo) : null;
  let erroDaPlanta = null;
  try {
    const novo = p.novo ? p.novo() : p.estraga(original.toString('utf8'));
    if (original && novo === original.toString('utf8')) throw new Error('a planta não mudou o ficheiro');
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
  if (original) fs.writeFileSync(alvo, original);
  else if (fs.existsSync(alvo)) fs.rmSync(alvo);
  const reposto = sha(alvo);
  const nomeDoFicheiro = `planta-${p.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}.txt`;
  fs.writeFileSync(path.join(SAIDA, nomeDoFicheiro), `# ${p.nome}\n# comando: ${p.comando.join(' ')}\n# código: ${codigo}\n\n${erroDaPlanta ? `A PLANTA NÃO SE PLANTOU: ${erroDaPlanta}\n` : saida}`);
  const mordeu = !erroDaPlanta && codigo !== 0 && p.mordida.test(saida);
  resultados.push({
    grupo: p.grupo, nome: p.nome, ficheiro: p.ficheiro, comando: p.comando.join(' '), codigo,
    mordida: String(p.mordida), passou: mordeu && antes === reposto, antes, reposto,
    segundos: Math.round((Date.now() - inicio) / 100) / 10, saida: `${PASTA}/plantas/${nomeDoFicheiro}`,
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
  limpas.push({ comando, codigo: r.status, saida: `${PASTA}/plantas/${nome}` });
  console.log(`limpa   ${comando} (código ${r.status})`);
}

const resumo = {
  bloco: 'UE1', cabeca, construcao: construcao.commit,
  plantas: resultados.length, mordidas: resultados.filter((r) => r.passou).length,
  repostas_com_o_mesmo_sha256: resultados.filter((r) => r.antes === r.reposto).length,
  corridas_limpas: limpas.length, corridas_limpas_a_zero: limpas.filter((l) => l.codigo === 0).length,
  resultados, limpas,
};
fs.writeFileSync(path.join(RAIZ, PASTA, 'plantas-ue1.json'), JSON.stringify(resumo, null, 2) + '\n');
console.log(`UE1 plantas: ${resumo.mordidas} de ${resumo.plantas} morderam e foram repostas; ${resumo.corridas_limpas_a_zero} de ${resumo.corridas_limpas} corridas limpas a zero`);
process.exit(resumo.mordidas === resumo.plantas && resumo.corridas_limpas_a_zero === resumo.corridas_limpas ? 0 : 1);
