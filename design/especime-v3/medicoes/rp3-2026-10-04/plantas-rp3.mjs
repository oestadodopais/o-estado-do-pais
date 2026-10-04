/** RP3: as plantas sobre dist/ dos portões que mudaram de forma com este bloco, em plantas-portoes-rp3.json.
 *
 * O molde é o de `tests/pais/portoes.mjs`: cada planta muda uma ou mais páginas de `dist/`, corre o portão inteiro,
 * exige que ele saia com 1 e que a saída diga cada mordida prevista, e repõe as páginas byte a byte num `finally`,
 * com o sha256 de antes e de depois no registo. Correr sem outra leitura de `dist/` em paralelo (com a tranca da
 * máquina), sobre a construção da cabeça do código.
 *
 *   · o portão de HTML: um valor trocado num `data-ponto` de uma série no tempo, uma linha tirada da tabela de um
 *     recibo (a tabela inteira e o recibo inteiro nas duas edições), e um algarismo solto no recibo da derivada;
 *   · o `check:formas` (F1): o período de um ponto escrito fora da regra da casa;
 *   · a check:lugar (8.5): «limiar» na conta em palavras da derivada e, desde a passagem RP3-b, no motivo de uma
 *     correção, que são prosa deste projeto e ficam no texto da casa; e o controlo, a mesma palavra num literal
 *     transcrito da fonte, que não conta (passa com 0);
 *   · o portão de HTML, desde a RP3-b: um campo de série fora da lista fechada de `scripts/campos-da-serie.mjs`;
 *   · a régua das frases (`check:voz`): o nome declarado de outra série na folha do caminho do recibo da derivada,
 *     e a mesma troca com a folha sem a marca da série, que até à passagem RP3-b era o controlo que passava e desde
 *     ela morde, porque a marca é obrigatória.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/rp3-2026-10-04/plantas-rp3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';

const PASTA = 'design/especime-v3/medicoes/rp3-2026-10-04';
const REGISTOS = path.join(PASTA, 'plantas');
fs.mkdirSync(REGISTOS, { recursive: true });
const sha = (s) => createHash('sha256').update(s).digest('hex');
const versao = JSON.parse(fs.readFileSync('dist/version.json', 'utf8'));
const registos = [];

function planta(nome, script, alteracoes, mordidas, { controlo = false } = {}) {
  const originais = new Map(alteracoes.map(([f]) => [f, fs.readFileSync(path.join('dist', f), 'utf8')]));
  let r;
  const inicio = Date.now();
  try {
    for (const [f, fn] of alteracoes) {
      const raiz = parse(originais.get(f));
      fn(raiz);
      const texto = raiz.toString();
      if (texto === originais.get(f)) throw new Error(`${nome}: a planta não mudou ${f}`);
      fs.writeFileSync(path.join('dist', f), texto);
    }
    r = spawnSync(process.execPath, [script], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } finally {
    for (const [f, s] of originais) fs.writeFileSync(path.join('dist', f), s);
  }
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(REGISTOS, `planta-${nome}.log`), saida);
  const ficheiros = [...originais].map(([f, s]) => ({ ficheiro: `dist/${f}`, antes: sha(s), reposto: sha(fs.readFileSync(path.join('dist', f), 'utf8')) }));
  const vistas = mordidas.map((re) => ({ mordida: re.source, vista: re.test(saida) }));
  /* Um CONTROLO é o contrário de uma planta: a mesma troca na forma antiga da página, que o portão deixava passar;
     passa quando o portão sai com 0 e nenhuma das mordidas aparece. */
  const passou = controlo
    ? r.status === 0 && vistas.every((v) => !v.vista) && ficheiros.every((f) => f.antes === f.reposto)
    : r.status === 1 && vistas.every((v) => v.vista) && ficheiros.every((f) => f.antes === f.reposto);
  registos.push({ nome, controlo, comando: `node ${script}`, codigo: r.status, segundos: Math.round((Date.now() - inicio) / 100) / 10, mordidas: vistas, passou, ficheiros });
  fs.writeFileSync(path.join(PASTA, 'plantas-portoes-rp3.json'), JSON.stringify({ bloco: 'RP3', construcao: versao.commit, plantas: registos }, null, 2) + '\n');
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}: código ${r.status}${passou ? '' : ` · ${vistas.filter((v) => !v.vista).map((v) => v.mordida).join(' · ')}`}`);
}

const REMUNERACAO = 'serie-remuneracao-bruta-mensal-media';
const D1 = 'serie-cem-euros-de-2015-01';
const reciboPt = (id) => `livro-razao/series/${id}/index.html`;
const reciboEn = (id) => `en/ledger/series/${id}/index.html`;

planta('rp3-html-ponto-trocado', 'scripts/gate-html.mjs', [
  [reciboPt(REMUNERACAO), (r) => r.querySelector(`[data-serie-tabela] [data-ponto="${REMUNERACAO}#2026-T2"]`).set_content('1 836')],
], [new RegExp(`o ponto «2026-T2» da série «${REMUNERACAO}» foi renderizado como`)]);

planta('rp3-html-linha-tirada', 'scripts/gate-html.mjs', [
  [reciboEn(REMUNERACAO), (r) => r.querySelector('[data-serie-tabela] tbody tr').remove()],
], [
  new RegExp(`RP3: a tabela do recibo da série «${REMUNERACAO}» não é a dos pontos da série`),
  new RegExp(`RP3: o recibo da série no tempo "${REMUNERACAO}" não mostrou os 6 pontos da série na edição "en"`),
]);

planta('rp3-html-algarismo-solto', 'scripts/gate-html.mjs', [
  [reciboPt(D1), (r) => r.querySelector('main').insertAdjacentHTML('beforeend', '<p>Subiu 7 pontos.</p>')],
], [/algarismos fora do livro-razão: "7"/]);

planta('rp3-formas-data-do-ponto', 'scripts/check-formas.mjs', [
  [reciboPt(REMUNERACAO), (r) => r.querySelector(`[data-linha-de-serie="${REMUNERACAO}"][data-de-campo="pontos.0.periodo"]`).set_content('primeiro trimestre de 2025')],
], [new RegExp(`a data do campo "pontos\\.0\\.periodo" da série "${REMUNERACAO}" não é a da série`)]);

planta('rp3-lugar-limiar-na-conta', 'scripts/check-lugar.mjs', [
  [reciboPt(D1), (r) => r.querySelector('[data-serie-campo="derivation"]').insertAdjacentHTML('beforeend', ' O valor passa o limiar.')],
], [/8\.5 .*ACIMA DO TETO/]);

planta('rp3-voz-nome-de-outra-serie', 'scripts/check-voz.mjs', [
  [reciboPt(D1), (r) => r.querySelector(`.caminho-aqui[data-da-serie="${D1}"]`).set_content('Preços dos combustíveis na comparação europeia, variação num ano')],
], [new RegExp(`não é o nome da série "${D1}"`)]);

/* A LISTA FECHADA DOS CAMPOS TRANSCRITOS (passagem RP3-b, o achado 8 da leitura a frio). «limiar» dentro do motivo
   de uma correção de uma série é prosa deste projeto e a 8.5 da check:lugar fecha a construção; dentro de um literal
   transcrito da fonte não conta (o controlo passa com 0). E um campo fora da lista fecha o portão de HTML. */
const motivoNoFim = (campo) => (r) => r.querySelector('main').insertAdjacentHTML('beforeend',
  `<p><span class="campo-da-serie" data-serie="${D1}" data-serie-campo="${campo}">O valor passa o limiar.</span></p>`);
planta('rp3-lugar-limiar-num-motivo', 'scripts/check-lugar.mjs', [
  [reciboPt(D1), motivoNoFim('corrections.0.reason')],
], [/8\.5 .*ACIMA DO TETO/]);
planta('rp3-lugar-limiar-num-literal', 'scripts/check-lugar.mjs', [
  [reciboPt(D1), motivoNoFim('excerpt')],
], [/8\.5 .*ACIMA DO TETO/], { controlo: true });
planta('rp3-html-campo-fora-da-lista', 'scripts/gate-html.mjs', [
  [reciboPt(REMUNERACAO), (r) => r.querySelector(`[data-serie="${REMUNERACAO}"][data-serie-campo="name"]`).setAttribute('data-serie-campo', 'document.label')],
], [/o campo «document\.label» da série «serie-remuneracao-bruta-mensal-media» não é um campo que o recibo possa render/]);

/* A MESMA TROCA SEM A MARCA DA SÉRIE (passagem RP3-b, o achado 7 da leitura a frio): era o controlo da planta
   anterior, e passava, porque o nome trocado também é um nome declarado; desde a RP3-b a marca é obrigatória e a sua
   falta é um erro da régua das frases, e por isso deixa de ser controlo e passa a planta que morde. */
planta('rp3-voz-nome-de-outra-serie-sem-a-marca', 'scripts/check-voz.mjs', [
  [reciboPt(D1), (r) => {
    const folha = r.querySelector(`.caminho-aqui[data-da-serie="${D1}"]`);
    folha.removeAttribute('data-da-serie');
    folha.set_content('Preços dos combustíveis na comparação europeia, variação num ano');
  }],
], [/falta «data-da-serie»/]);

const falharam = registos.filter((r) => !r.passou);
console.log(`RP3 plantas sobre dist/: ${registos.filter((r) => !r.controlo && r.passou).length} de ${registos.filter((r) => !r.controlo).length} morderam, ` +
  `${registos.filter((r) => r.controlo && r.passou).length} de ${registos.filter((r) => r.controlo).length} controlo(s) sem mordida, com as páginas repostas`);
process.exit(falharam.length ? 1 : 0);
