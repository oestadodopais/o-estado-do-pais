/** UE2-b: o inventário das frases depois da passagem, escrito a partir das declarações e não à mão.
 *
 * A passagem muda 18 perguntas (a forma em palavras comuns passa a ser a única, com os termos que a leitura a frio do
 * UE2 apontou explicados), põe a definição declarada por baixo do nome de cada faixa da secção dos países (a da
 * inflação entra na página da União na forma do recibo da série) e muda a descrição da página da União. Este guião:
 *
 *   · lê as perguntas de antes na cabeça de base (`git show <base>:src/data/figuras.mjs`, escrita por um momento ao
 *     lado do módulo, para que os imports relativos resolvam, e apagada logo a seguir) e as de agora no módulo;
 *   · tira-lhes os algarismos declarados (`{ nl }`) como a régua das frases os tira, e junta os espaços;
 *   · passa a «retirada», com a razão e o bloco `ue2-b`, cada linha «viva» cujo texto era uma pergunta de antes e não é
 *     nenhuma de agora, e as duas da descrição de antes;
 *   · acrescenta, numa secção nova no fim, as frases de agora que o inventário ainda não declara (as perguntas, a da
 *     inflação na forma do recibo da série, e a descrição), e escreve a entrada da passagem no registo das revisões.
 *
 * Corre outra vez sem duplicar nada: uma linha já retirada pela passagem, ou uma frase já declarada, fica como está.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/ue2-2026-10-02/inventario-ue2-b.mjs <cabeça de base>
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEFINICOES_DAS_MEDIDAS } from '../../../../src/data/figuras.mjs';
import { t } from '../../../../src/i18n/strings.mjs';

const BASE = process.argv[2];
if (!BASE) throw new Error('uso: inventario-ue2-b.mjs <cabeça de base>');
const INVENTARIO = 'design/especime-v3/INVENTARIO-FRASES.md';
const REVISOES = 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';
const BLOCO = 'ue2-b';

const MUDADAS = [
  'divida-publica-2025', 'posicao-de-investimento-internacional-2025', 'custo-unitario-do-trabalho-2025',
  'precos-da-habitacao-2025', 'desempenho-das-exportacoes-2025', 'divida-das-empresas-2025', 'divida-das-familias-2025',
  'fluxo-de-credito-as-empresas-2025', 'fluxo-de-credito-as-familias-2025', 'saldo-da-balanca-corrente-2025',
  'taxa-de-actividade-2025', 'taxa-de-cambio-efectiva-real-2025', 'taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-2025',
  'desemprego-de-longa-duracao-2025', 'risco-de-pobreza-ou-exclusao-2025', 'sobrecarga-do-custo-da-habitacao-2025',
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025',
];

/** O texto como a régua das frases o recolhe: sem os algarismos declarados, com os espaços juntos. */
const recolhido = (partes) =>
  partes
    .map((p) => (typeof p === 'string' ? p : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

/* AS PERGUNTAS DE ANTES, da cabeça de base. */
const temporario = 'src/data/.figuras-base-ue2-b.mjs';
fs.writeFileSync(temporario, execFileSync('git', ['show', `${BASE}:src/data/figuras.mjs`], { encoding: 'utf8' }));
let ANTES;
try {
  ANTES = (await import(`../../../../${temporario}`)).DEFINICOES_DAS_MEDIDAS;
} finally {
  fs.rmSync(temporario);
}

const antes = new Set();
const agora = new Map();
for (const id of MUDADAS) {
  const a = ANTES[id];
  const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[id];
  for (const lang of ['pt', 'en']) {
    antes.add(recolhido(a[lang]));
    if (a.uniao) antes.add(recolhido(a.uniao[lang]));
    agora.set(recolhido(d[lang]), { id, lang, tipo: 'pergunta' });
  }
}
const ihpc = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)['ihpc-variacao-homologa'];
for (const lang of ['pt', 'en']) agora.set(recolhido(ihpc.serie[lang]), { id: 'ihpc-variacao-homologa', lang, tipo: 'serie' });
const DESCRICOES_DE_ANTES = [
  'Os dois quadros da União Europeia que medem Portugal: as medidas do Procedimento dos Desequilíbrios Macroeconómicos e as do Painel Social Europeu.',
  'The two European Union frameworks that measure Portugal: the measures of the Macroeconomic Imbalance Procedure and those of the European Social Scoreboard.',
];
for (const lang of ['pt', 'en']) agora.set(t(lang).uniaoEuropeia.metaDescription, { id: 'descricao', lang, tipo: 'descricao' });

const RAZAO_DA_RETIRADA =
  'Passagem UE2-b (02.10.2026): a forma em palavras comuns passa a ser a única forma das definições, em todo o sítio (a ' +
  'decisão do lugar de direção sobre o achado 14 da leitura a frio do UE2); esta pergunta deixa de se render, e a que a ' +
  'substitui está declarada na secção do bloco ue2-b.';
const RAZAO_DA_DESCRICAO_RETIRADA =
  'Passagem UE2-b (02.10.2026), ponto 5: a descrição da página da União passa a dizer também os países, porque a página ' +
  'abre com a secção dos países desde o UE2; a nova está declarada na secção do bloco ue2-b.';

const linhas = fs.readFileSync(INVENTARIO, 'utf8').split('\n');
const celulas = (l) => l.trim().slice(1, -1).split('|').map((c) => c.trim());
const ehLinha = (l) => l.trim().startsWith('|') && l.trim().endsWith('|') && celulas(l).length >= 5 && !['classe', '---'].includes(celulas(l)[0]);
const declaradas = new Set();
const retiradas = [];
for (let i = 0; i < linhas.length; i++) {
  if (!ehLinha(linhas[i])) continue;
  const [classe, texto, , estado] = celulas(linhas[i]);
  declaradas.add(texto);
  const pergunta = antes.has(texto) && !agora.has(texto);
  const descricao = DESCRICOES_DE_ANTES.includes(texto);
  if (estado === 'viva' && (pergunta || descricao)) {
    linhas[i] = `| ${classe} | ${texto} | ${BLOCO} | retirada | ${descricao ? RAZAO_DA_DESCRICAO_RETIRADA : RAZAO_DA_RETIRADA} |`;
    retiradas.push(i + 1);
  }
}

/* AS LINHAS DO UE2 QUE FICAM: o texto é o mesmo, e passam a render-se também nas páginas de assunto. */
const NOTA_DO_UE2 = ' Desde a passagem UE2-b é a forma única, e rende-se também nas páginas de assunto.';
let notadas = 0;
for (let i = 0; i < linhas.length; i++) {
  if (!ehLinha(linhas[i])) continue;
  const c = celulas(linhas[i]);
  if (c[2] === 'ue2' && c[3] === 'viva' && agora.has(c[1]) && !c[4].includes('UE2-b')) {
    linhas[i] = `| ${c[0]} | ${c[1]} | ${c[2]} | ${c[3]} | ${c[4]}${NOTA_DO_UE2} |`;
    notadas++;
  }
}

const RAZOES = {
  pergunta: {
    pt: 'A pergunta do leitor em palavras comuns, com o termo da fonte entre parênteses: a forma única desde a passagem UE2-b, declarada em figuras.mjs e rendida em cada página onde a medida aparece; cada pedaço tem o apoio que a K16 confere em tests/cartao/perguntas-provadas.json.',
    en: 'A mesma pergunta na edição inglesa.',
  },
  serie: {
    pt: 'A definição da inflação na forma do recibo da série (sem o lugar), por baixo do nome da sua faixa na secção dos países da página da União (passagem UE2-b, achado 7 da leitura a frio do UE2): diz a base da comparação, o mesmo mês do ano anterior.',
    en: 'A mesma definição na edição inglesa.',
  },
  descricao: {
    pt: 'A descrição da página da União no <head> e no cartão de partilha, que desde a passagem UE2-b (ponto 5) diz também os países, pela ordem da página; sem algarismos, porque o <head> não tem onde os provar.',
    en: 'A mesma descrição na edição inglesa.',
  },
};
const novas = [...agora.entries()].filter(([texto]) => !declaradas.has(texto));
const CABECA = '## UE2-b · as palavras comuns como forma única, 02.10.2026';
if (novas.length) {
  const jaTemSeccao = linhas.some((l) => l.trim() === CABECA);
  if (jaTemSeccao) throw new Error('a secção do UE2-b já existe e há frases por declarar: corra a partir da cabeça de base');
  /* Uma nota no fim da secção do UE2, que dizia as perguntas do cartão vivas nas páginas de assunto. */
  const iUe2 = linhas.findIndex((l) => l.trim() === '## UE2 · a página dos países, 02.10.2026');
  const iFimDoTexto = linhas.findIndex((l, i) => i > iUe2 && l.startsWith('| classe |')) - 1;
  if (iUe2 < 0 || iFimDoTexto < 0) throw new Error('não achei a secção do UE2');
  linhas.splice(iFimDoTexto, 0, '', '*Desde a passagem UE2-b (02.10.2026) a forma em palavras comuns é a única forma das definições, em todo o sítio: ver a secção desse bloco, no fim.*');
  while (linhas.length && linhas[linhas.length - 1] === '') linhas.pop();
  linhas.push(
    '',
    CABECA,
    '',
    'A passagem UE2-b, pela decisão do lugar de direção sobre o achado 14 da leitura a frio do UE2: a forma em palavras',
    'comuns passa a ser a única forma das definições, nas páginas de assunto também, porque uma definição é uma coisa e vive',
    'num lugar (§1.143). Mudam 18 perguntas, e os termos que a leitura apontou ganham a explicação na primeira vez (o PIB, os',
    'ativos e os passivos, a balança corrente e a média móvel, a OCDE, a população ativa, os pontos percentuais, a privação',
    'material e social grave, o rendimento disponível e os apoios à habitação). As perguntas que levam algarismos declarados',
    '(as idades, os limites de 40 e 60 por cento, os 41 países) entram como a régua as recolhe, sem eles. As perguntas de',
    'antes passam a retiradas, com a razão. Entram também a definição da inflação na forma do recibo da série, que a faixa',
    'dela na secção dos países passou a dizer por baixo do nome (as outras nove faixas dizem as perguntas dos seus cartões,',
    'já declaradas aqui), e a descrição nova da página da União, que diz também os países. Escrito por',
    '`design/especime-v3/medicoes/ue2-2026-10-02/inventario-ue2-b.mjs` a partir das declarações.',
    '',
    '| classe | texto | bloco | estado | razão |',
    '| --- | --- | --- | --- | --- |',
    ...novas.map(([texto, { lang, tipo }]) => `| ${tipo === 'descricao' ? 'navegacao' : 'conteudo'} | ${texto} | ${BLOCO} | viva | ${RAZOES[tipo][lang]} |`),
  );
}
fs.writeFileSync(INVENTARIO, linhas.join('\n') + '\n');

/* A ENTRADA NO REGISTO DAS REVISÕES, por ler até à leitura cruzada do diff. */
const revisoes = fs.readFileSync(REVISOES, 'utf8');
if (!revisoes.includes(`| ${BLOCO} |`)) {
  const entrada = [
    '',
    '## UE2-b · as palavras comuns como forma única, 02.10.2026',
    '',
    '| bloco | mudança | estado | nota |',
    '| --- | --- | --- | --- |',
    `| ${BLOCO} | ${novas.length} cadeias novas, ${retiradas.length} retiradas | por ler | Claude Opus 5.5, construtor da passagem UE2-b: as perguntas de 18 medidas na forma em palavras comuns, a única desde a passagem, com os termos da leitura a frio do UE2 explicados, nas duas línguas; as perguntas de antes e as formas da página da União que mudaram de texto passam a retiradas; a definição da inflação na forma do recibo da série, por baixo do nome da sua faixa na secção dos países; e a descrição nova da página da União, que diz também os países. As linhas do UE2 cujo texto ficou ganham uma nota. Escrito por \`design/especime-v3/medicoes/ue2-2026-10-02/inventario-ue2-b.mjs\`. A leitura cruzada do diff faz-se antes da fusão. |`,
  ].join('\n');
  fs.writeFileSync(REVISOES, revisoes.replace(/\n*$/, '\n') + entrada + '\n');
}
console.log(`UE2-b: ${novas.length} frase(s) nova(s), ${retiradas.length} linha(s) retirada(s) (${retiradas.join(', ')}), ${notadas} linha(s) do UE2 com nota.`);
