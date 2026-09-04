/**
 * A PROVA DOS GUARDAS: cada um recusa o que promete recusar, e aceita o que
 * promete aceitar.
 *
 * Segunda passagem do bloco F0.4 (03.09.2026), leitura a frio do Codex, Major 7
 * a 15. O bloco fechou 526 erros de tipo; a leitura mostrou que uma parte deles
 * fechou com um MOLDE sobre dados que ninguém tinha conferido, e que um molde
 * assim esconde exactamente a classe de dados estragados que um portão de tipos
 * existe para expor. Os moldes saíram e entraram guardas de execução.
 *
 * Um guarda que ninguém experimenta é a mesma promessa noutra forma. Este
 * ficheiro é o conhecido-positivo de cada um: para cada guarda, um caso que TEM
 * de ser recusado e um que TEM de passar. Corre no `verify`, ao lado de
 * `provar-eyetext.mjs`, e pela mesma razão que ele: uma paridade que nada corre
 * é uma paridade que se perde na primeira reescrita.
 *
 * NÃO TOCA NO DISCO e não constrói nada: chama as funções com objetos escritos
 * aqui. O que ele prova é a forma da guarda, e não o conteúdo do livro-razão,
 * que é trabalho de `check-ledger.mjs`.
 */

import {
  CAMPOS,
  CAMPOS_DA_VERIFICACAO,
  MarcaDaExpressao,
  eLinha,
  eVerificacao,
  eCorrecao,
  evaluateCheck,
  correcoesDaLinha,
  listaDaLinha,
  documentoDaLinha,
} from '../src/lib/ledger.mjs';
import { eManifestoDosRegistos, eRegistoDeConteudo } from '../src/lib/registos.mjs';
import { ePaisDoMapa, eDistritoDoMapa, eManifestoDoMapa } from '../src/lib/mapa.mjs';
import { eNomeDeMedida, nomeDaMedida } from '../src/lib/nomes.mjs';
import { eSerieAtrasada } from '../src/data/frescura.mjs';
import { serieDaLinha, contagens } from '../src/lib/frescura.mjs';
import { numeralPorExtenso } from '../src/data/figuras.mjs';

/** @param {string} s */
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
/** @param {string} s */
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
/** @param {string} s */
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** @type {string[]} */
const falhas = [];
let casos = 0;

/**
 * Um caso: o que se espera, o que se obteve, e a razão por que a pergunta se faz.
 *
 * @param {string} nome
 * @param {boolean} esperado
 * @param {boolean} obtido
 * @param {string} porque
 */
function caso(nome, esperado, obtido, porque) {
  casos++;
  if (esperado === obtido) return;
  falhas.push(
    `${nome}: esperava ${esperado ? 'ACEITE' : 'RECUSADO'} e foi ` +
      `${obtido ? 'ACEITE' : 'RECUSADO'}.\n        ${porque}`,
  );
}

/**
 * Um caso que tem de atirar, com a frase que se espera lá dentro.
 *
 * @param {string} nome
 * @param {() => unknown} corre
 * @param {string} pedaco
 * @param {string} porque
 */
function atira(nome, corre, pedaco, porque) {
  casos++;
  /** @type {string | null} */
  let mensagem = null;
  try {
    corre();
  } catch (erro) {
    mensagem = erro instanceof Error ? erro.message : String(erro);
  }
  if (mensagem === null) {
    falhas.push(`${nome}: não atirou, e tinha de atirar.\n        ${porque}`);
  } else if (!mensagem.includes(pedaco)) {
    falhas.push(
      `${nome}: atirou pela razão errada, «${mensagem}».\n        Esperava uma frase com ` +
        `«${pedaco}». ${porque}`,
    );
  }
}

/* ------------------------------------------------------------------ eLinha */

caso(
  'eLinha/completa',
  true,
  eLinha({ id: 'uma-linha', value: '1', unit: '%' }),
  'um mapa com id de cadeia não vazia é uma linha.',
);
caso(
  'eLinha/sem-id',
  false,
  eLinha({ value: '1' }),
  'o id é a chave do mapa do livro-razão: sem ele o carregador não sabe onde a pôr.',
);
caso('eLinha/id-vazio', false, eLinha({ id: '   ', value: '1' }), 'um id em branco não é um id.');
caso(
  'eLinha/lista',
  false,
  eLinha([{ id: 'x' }]),
  'uma lista de YAML não é uma linha, e o molde antigo aceitava-a.',
);
caso('eLinha/nulo', false, eLinha(null), 'um ficheiro vazio dá null, e null não é um mapa.');
caso('eLinha/cadeia', false, eLinha('uma-linha'), 'um escalar de YAML não é uma linha.');

/* ------------------------------------------------------------ eVerificacao */

caso(
  'eVerificacao/completa',
  true,
  eVerificacao({
    date: '2026-09-01',
    path: 'https://exemplo.pt',
    result: 'igual',
    by: 'painel-semanal',
  }),
  'as quatro chaves obrigatórias.',
);
caso(
  'eVerificacao/sem-by',
  false,
  eVerificacao({ date: '2026-09-01', path: null, result: 'igual' }),
  'quem releu faz parte do que uma reconferência vale.',
);
caso(
  'eVerificacao/path-nulo',
  true,
  eVerificacao({ date: '2026-09-01', path: null, result: 'igual', by: 'revisao-cruzada' }),
  'uma linha derivada não tem endereço para reler, e `path: null` é legítimo.',
);
caso(
  'eVerificacao/data-numero',
  false,
  eVerificacao({ date: 20260901, path: null, result: 'igual', by: 'revisao-cruzada' }),
  'uma data que o YAML leu como número não é a cadeia AAAA-MM-DD que a página mostra.',
);

/* ---------------------------------------------------------------- eCorrecao */

caso(
  'eCorrecao/completa',
  true,
  eCorrecao({ date: '2026-08-12', kind: 'correcao', reason: 'porquê', reason_en: 'why' }),
  'a data e a natureza são o que a página do registo lê.',
);
caso(
  'eCorrecao/sem-kind',
  false,
  eCorrecao({ date: '2026-08-12', reason: 'porquê' }),
  'sem natureza, o registo não sabe se foi correção, atualização ou revisão.',
);

/* O `fields` PLURAL, que o tipo declarava e que ninguém escreve nem lê (Major 9). */
caso(
  'eCorrecao/fields-plural-passa-o-guarda',
  true,
  eCorrecao({ date: '2026-08-12', kind: 'proveniencia', fields: ['source'] }),
  'o guarda confere a data e a natureza; quem recusa a chave a mais é o validador.',
);
{
  casos++;
  const lidas = correcoesDaLinha({
    id: 'x',
    corrections: [{ date: '2026-08-12', kind: 'proveniencia', fields: ['source'] }],
  });
  if (lidas.length !== 1 || 'field' in lidas[0]) {
    falhas.push(
      'eCorrecao/fields-plural: uma correção com `fields` plural não pode trazer um `field` ' +
        'singular do nada.\n        O tipo declara `field` porque é o que o validador exige e ' +
        'lê; o `fields` plural não existe em lado nenhum.',
    );
  }
}

/* ------------------------------------------------------ listas e documentos */

caso(
  'listaDaLinha/cadeia',
  true,
  listaDaLinha('abc').length === 0,
  'uma cadeia tem `.length` e não é uma lista: contá-la era publicar a contagem de outra coisa.',
);
caso('listaDaLinha/lista', true, listaDaLinha(['a', 'b']).length === 2, 'uma lista conta-se.');
caso(
  'documentoDaLinha/lista',
  true,
  documentoDaLinha({ id: 'x', document: ['a'] }) === null,
  'uma lista no lugar do bloco `document` não é um bloco `document`.',
);
caso(
  'documentoDaLinha/mapa',
  true,
  documentoDaLinha({ id: 'x', document: { title: 'T' } })?.title === 'T',
  'um mapa é um mapa, e os seus valores continuam por conferir.',
);

/* ------------------------------------------------------------ evaluateCheck */

atira(
  'evaluateCheck/sem-claims',
  () => evaluateCheck('1 + 1', {}),
  'falta o mapa das linhas',
  'a versão anterior declarava `claims` opcional e punha-lhe um molde por cima.',
);
{
  casos++;
  const r = evaluateCheck('1 + 1', { claims: new Map(), env: {} });
  if (r.toString() !== '2') {
    falhas.push(`evaluateCheck/com-claims: 1 + 1 deu «${r}» e tinha de dar 2.`);
  }
}

/* --------------------------------------------------------- MarcaDaExpressao */

/* A MARCA VAZIA (Major 14). `operaComMarca` reconhecia a marca pela verdade da
   cadeia: uma marca de cadeia vazia é falsa, caía no ramo dos números e a
   operação entregava à aritmética um objeto que não é um `Decimal`. Nenhuma das
   marcas declaradas é vazia, por isso nada do que hoje se publica muda; o que
   muda é que a pergunta passa a ser `instanceof`. */
{
  casos++;
  const claims = new Map([
    ['marca-vazia', { id: 'marca-vazia', value: '' }],
    ['um', { id: 'um', value: '1' }],
  ]);
  /** @type {unknown} */
  let resultado = null;
  /** @type {string | null} */
  let mensagem = null;
  try {
    resultado = evaluateCheck('marca-vazia + um', { claims, env: {} });
  } catch (erro) {
    mensagem = erro instanceof Error ? erro.message : String(erro);
  }
  /* O valor `''` não é número nem marca declarada: o avaliador recusa-o ANTES de
     chegar à operação, e é essa a recusa certa. O que este caso prova é que ele
     não passa em silêncio para a aritmética. */
  if (resultado !== null || mensagem === null) {
    falhas.push(
      'MarcaDaExpressao/vazia: um valor vazio chegou à aritmética em vez de ser recusado.',
    );
  }
}
{
  casos++;
  const a = new MarcaDaExpressao('');
  if (!(a instanceof MarcaDaExpressao) || a.toString() !== '') {
    falhas.push('MarcaDaExpressao/vazia: uma marca vazia tem de continuar a ser uma marca.');
  }
}

/* -------------------------------------------------------- os guardas do JSON */

caso(
  'eManifestoDosRegistos/completo',
  true,
  eManifestoDosRegistos({ exporter: 'x', origin: 'y', registos: {} }),
  'as três chaves que o tipo promete.',
);
caso(
  'eManifestoDosRegistos/sem-origin',
  false,
  eManifestoDosRegistos({ exporter: 'x', registos: {} }),
  'o tipo prometia `exporter` e `origin` e só `registos` era conferido.',
);
caso(
  'eRegistoDeConteudo/completo',
  true,
  eRegistoDeConteudo({ blocks: [{ i: 0, kind: 'paragraph', text: 'olá' }] }),
  'uma lista de blocos, cada um com o seu índice e o seu género.',
);
caso(
  'eRegistoDeConteudo/bloco-sem-genero',
  false,
  eRegistoDeConteudo({ blocks: [{ i: 0, text: 'olá' }] }),
  'um bloco sem género é um bloco que o renderizador não sabe compor.',
);
caso(
  'eRegistoDeConteudo/sem-blocks',
  false,
  eRegistoDeConteudo({ title: 'um título' }),
  'um registo sem blocos não é um registo de conteúdo.',
);

const unidadeDeMapa = {
  slug: 'evora',
  nome: 'Évora',
  d: 'M0 0',
  caixa: [0, 0, 1, 1],
  ponto: [0, 0],
  parcela: 'continente',
};
caso(
  'ePaisDoMapa/completo',
  true,
  ePaisDoMapa({
    campo: { largura: 1, altura: 1 },
    molduras: [{ nome: 'Madeira', caixa: [0, 0, 1, 1], escala: 1 }],
    unidades: [unidadeDeMapa],
  }),
  'o campo, as molduras e as unidades com a sua parcela.',
);
caso(
  'ePaisDoMapa/unidade-sem-parcela',
  false,
  ePaisDoMapa({
    campo: { largura: 1, altura: 1 },
    molduras: [],
    unidades: [{ ...unidadeDeMapa, parcela: undefined }],
  }),
  'as 29 unidades do país declaram-na todas (medido a 03.09.2026), e a lista das parcelas ' +
    'sai delas.',
);
caso(
  'ePaisDoMapa/caixa-de-tres',
  false,
  ePaisDoMapa({
    campo: { largura: 1, altura: 1 },
    molduras: [],
    unidades: [{ ...unidadeDeMapa, caixa: [0, 0, 1] }],
  }),
  'uma caixa é x, y, largura e altura: com três números o desenho sai errado em silêncio.',
);
caso(
  'eDistritoDoMapa/completo',
  true,
  eDistritoDoMapa({
    unidade: { slug: 'aveiro', nome: 'Aveiro', tipo: 'distrito' },
    campo: { largura: 1, altura: 1 },
    concelhos: [{ slug: 'a', nome: 'A', d: 'M0 0', caixa: [0, 0, 1, 1], ponto: [0, 0] }],
  }),
  'os concelhos não trazem parcela, e é por isso que ela não se exige aqui.',
);
/* O `unidade` de um ficheiro de distrito É a identidade e não uma unidade
   desenhável: slug, nome e tipo, medidos nos 29 ficheiros. A primeira versão do
   tipo prometia lá um desenho e uma caixa, e foi este guarda que a desmentiu na
   primeira construção. */
caso(
  'eDistritoDoMapa/identidade-sem-desenho',
  true,
  eDistritoDoMapa({
    unidade: { slug: 'aveiro', nome: 'Aveiro', tipo: 'distrito' },
    campo: { largura: 1, altura: 1 },
    concelhos: [{ slug: 'a', nome: 'A', d: 'M0 0', caixa: [0, 0, 1, 1], ponto: [0, 0] }],
  }),
  'o `unidade` de um distrito não tem `d` nem `caixa`, e exigi-los recusava os 29 ficheiros.',
);
caso(
  'eDistritoDoMapa/sem-concelhos',
  false,
  eDistritoDoMapa({
    unidade: { slug: 'aveiro', nome: 'Aveiro' },
    campo: { largura: 1, altura: 1 },
    concelhos: [],
  }),
  'um distrito sem concelhos é um ficheiro que não desenha nada.',
);
caso(
  'eManifestoDoMapa/completo',
  true,
  eManifestoDoMapa({ fonte: { atribuicao: 'DGT', licenca: 'CC BY 4.0', carta: 'CAOP 2025' } }),
  'a menção que a licença obriga.',
);
caso(
  'eManifestoDoMapa/sem-atribuicao',
  false,
  eManifestoDoMapa({ fonte: { licenca: 'CC BY 4.0', carta: 'CAOP 2025' } }),
  'sem a menção da entidade proprietária o mapa não pode ser servido.',
);

/* ---------------------------------------------------- o nome de uma medida */

/* `eNomeDeMedida` decide MARKUP: um nome de cartão leva `data-nome`, que a régua
   da voz confere contra o ficheiro de dados, e um campo do livro-razão leva
   `data-linha-campo`, que o portão confere contra a linha. Um objecto meio
   construído escolhia a marca errada em silêncio, que é a classe de defeito que
   nenhum dos dois portões apanharia: a marca estaria bem formada e a apontar
   para o sítio errado. */
caso(
  'eNomeDeMedida/cartao',
  true,
  eNomeDeMedida({ texto: 'Dívida pública', fonte: 'figuras', campo: null }),
  'um nome de cartão: a fonte é o ficheiro de dados e não há campo.',
);
caso(
  'eNomeDeMedida/campo',
  true,
  eNomeDeMedida({ texto: 'PMP (N.º dias)', fonte: null, campo: 'name' }),
  'um rótulo da fonte: é um campo do livro-razão e não tem ficheiro de dados.',
);
caso(
  'eNomeDeMedida/os-dois',
  false,
  eNomeDeMedida({ texto: 'Dívida pública', fonte: 'figuras', campo: 'name' }),
  'as duas marcas ao mesmo tempo: o texto não pode ser conferido contra as duas.',
);
caso(
  'eNomeDeMedida/nenhum',
  false,
  eNomeDeMedida({ texto: 'Dívida pública', fonte: null, campo: null }),
  'um texto sem origem nenhuma é prosa da casa por classificar, não um nome.',
);
caso(
  'eNomeDeMedida/fonte-desconhecida',
  false,
  eNomeDeMedida({ texto: 'Dívida pública', fonte: 'inventado', campo: null }),
  'uma fonte que a régua da voz não sabe abrir não sustenta a marca.',
);
caso(
  'eNomeDeMedida/vazio',
  false,
  eNomeDeMedida({ texto: '', fonte: 'figuras', campo: null }),
  'um nome vazio é um elemento vazio na cabeça da linha.',
);
caso('eNomeDeMedida/nulo', false, eNomeDeMedida(null), 'null não é um nome.');

/* E a escada, sobre linhas escritas aqui: a ordem dos degraus é o que decide o
   que o leitor lê, e uma troca silenciosa entre eles não se vê em página
   nenhuma. */
const LINHA_BASE = {
  id: 'x-1',
  value: '1',
  unit: '%',
  source: null,
  document: null,
  source_url: null,
  access_date: null,
  reference_date: null,
  excerpt: null,
  derivation: null,
  derived_from: [],
  check: null,
  study: 'x',
  corrections: [],
};
caso(
  'nomeDaMedida/degrau-do-rotulo',
  true,
  nomeDaMedida({ ...LINHA_BASE, name: 'Total' }, 'pt')?.campo === 'name',
  'sem cartão, o rótulo que a fonte imprime.',
);
caso(
  'nomeDaMedida/degrau-do-documento',
  true,
  nomeDaMedida({ ...LINHA_BASE, document: { title: 'Prestação de Contas 2025' } }, 'pt')?.campo ===
    'document.title',
  'sem cartão e sem rótulo, o título do documento de onde a linha foi lida.',
);
caso(
  'nomeDaMedida/marcador-nao-e-nome',
  true,
  nomeDaMedida({ ...LINHA_BASE, document: { title: '[a verificar]' } }, 'pt') === null,
  'quatro linhas têm o marcador por título de documento: o marcador não é um nome.',
);
caso(
  'nomeDaMedida/derivada-sem-nome',
  true,
  nomeDaMedida(LINHA_BASE, 'pt') === null,
  'uma linha derivada sem fonte e sem documento não ganha um nome inventado.',
);
caso(
  'nomeDaMedida/cartao-ganha',
  true,
  nomeDaMedida({ ...LINHA_BASE, id: 'divida-publica-2025', name: 'Total' }, 'pt')?.fonte ===
    'figuras',
  'o nome do cartão ganha ao rótulo da fonte: é o nome que o leitor já viu na primeira página.',
);

/* --------------------------------- eSerieAtrasada (bloco F1.6, 04.09.2026) --- */

/* Uma série atrasada é um dado de ficheiro, como uma linha do livro-razão: o
   tipo diz o que a casa espera e o guarda é quem o exige. O que ele tem de
   recusar é a entrada meia escrita, porque o que sai dela não é um erro é uma
   frase incompleta na página de 278 linhas. */
const SERIE_BOA = {
  id: 'serie-de-prova',
  fonte: 'Um organismo',
  documento: 'Um ficheiro mensal',
  periodoDaCasa: '2025-12',
  periodoDaFonte: '2026-07',
  origem: {
    ficheiro: 'design/observatorio/inventario/INVENTARIO-DAS-FONTES.json',
    registo: 'T2',
    campo: 'ultimo_periodo',
    lidoEm: '2026-09-01',
    url: 'https://exemplo.invalido/ficheiro.ods',
  },
};
caso('eSerieAtrasada/boa', true, eSerieAtrasada(SERIE_BOA), 'a forma inteira passa.');
caso(
  'eSerieAtrasada/sem-origem',
  false,
  eSerieAtrasada({ ...SERIE_BOA, origem: undefined }),
  'um período sem origem é um número escrito à mão: a origem é a metade que conta.',
);
caso(
  'eSerieAtrasada/periodo-com-dia',
  false,
  eSerieAtrasada({ ...SERIE_BOA, periodoDaFonte: '2026-07-20' }),
  'o período de uma série mensal é AAAA-MM; inventar-lhe um dia é inventar um facto.',
);
caso(
  'eSerieAtrasada/origem-sem-data',
  false,
  eSerieAtrasada({ ...SERIE_BOA, origem: { ...SERIE_BOA.origem, lidoEm: 'ontem' } }),
  'a data em que a origem foi lida escreve-se AAAA-MM-DD, ou não se sabe quando foi.',
);
caso(
  'eSerieAtrasada/nao-e-objeto',
  false,
  eSerieAtrasada([SERIE_BOA]),
  'uma lista não é uma série, e um molde sobre ela escondia isso.',
);

/* ------------- o casamento das linhas e o contador (F1.6, segunda passagem) --- */

/* A LEITURA A FRIO PEDIU ESTES CASOS (Major 11, 04.09.2026): «os casos provam só
   a forma de `eSerieAtrasada`, e não o casamento das linhas, os contadores, os
   períodos rendidos ou os carimbos». Os períodos rendidos e o carimbo têm as
   suas réguas sobre o `dist/` e o `DECISIONS.md` (F13 a F15 do `check:formas` e
   a amarra do `check-ledger`), e as plantas guardadas provam que elas mordem. O
   que faltava provar aqui era a conta, e a conta é isto.

   AS LINHAS SÃO ESCRITAS À MÃO e não lidas do disco, porque este ficheiro não
   toca no disco: o que se prova é a REGRA, e não o conteúdo do livro-razão. */
const SERIE_DA_PROVA = {
  id: 'serie-da-prova',
  fonte: 'Organismo A',
  documento: 'Ficheiro mensal',
  periodoDaCasa: '2025-12',
  periodoDaFonte: '2026-07',
  origem: SERIE_BOA.origem,
};
/** @type {any} */
const LINHA_DA_SERIE = {
  id: 'x-2025-12',
  source: 'Organismo A',
  document: { title: 'Ficheiro mensal' },
  reference_date: '2025-12',
};
const SERIES = [SERIE_DA_PROVA];

caso(
  'serieDaLinha/com-periodo',
  true,
  serieDaLinha(LINHA_DA_SERIE, SERIES)?.id === 'serie-da-prova',
  'uma linha com os três campos certos pertence à série, e é ela que rende a frase do atraso.',
);
caso(
  'serieDaLinha/sem-periodo',
  false,
  serieDaLinha({ ...LINHA_DA_SERIE, reference_date: null }, SERIES) !== null,
  'uma linha sem período não se pode dizer atrasada: não há com que comparar o período da fonte. ' +
    'É a planta que a leitura a frio pôs no casamento das linhas, ao contrário.',
);
caso(
  'serieDaLinha/outro-periodo',
  false,
  serieDaLinha({ ...LINHA_DA_SERIE, reference_date: '2013-12' }, SERIES) !== null,
  'um ponto histórico de uma série não está atrasado por a fonte ter publicado 2026: ' +
    'é o caso das duas linhas de Évora, de 2013 e de 2024.',
);
caso(
  'serieDaLinha/outra-fonte',
  false,
  serieDaLinha({ ...LINHA_DA_SERIE, source: 'Organismo B' }, SERIES) !== null,
  'as trinta linhas das ilhas têm outra fonte, que publica o seu próprio ficheiro: ' +
    'o atraso deste publicador não é o daquele.',
);
caso(
  'serieDaLinha/outro-documento',
  false,
  serieDaLinha({ ...LINHA_DA_SERIE, document: { title: 'Outro ficheiro' } }, SERIES) !== null,
  'o mesmo organismo publica mais do que um ficheiro, e o atraso é de um deles.',
);
caso(
  'serieDaLinha/sem-documento',
  false,
  serieDaLinha({ ...LINHA_DA_SERIE, document: null }, SERIES) !== null,
  'sem título de documento não há como saber de que ficheiro a linha veio.',
);

/* O CONTADOR: as duas contagens contam coisas diferentes, e é essa a razão de
   serem duas. Três linhas da série e uma de fora dão «1 série · 3 linhas». */
const CONTA = contagens(
  [
    LINHA_DA_SERIE,
    { ...LINHA_DA_SERIE, id: 'y-2025-12' },
    { ...LINHA_DA_SERIE, id: 'z-2025-12' },
    { ...LINHA_DA_SERIE, id: 'w-2013-12', reference_date: '2013-12' },
  ],
  SERIES,
);
caso(
  'contagens/series',
  true,
  CONTA.series === 1,
  'três linhas da mesma série são UMA série atrasada, e não três.',
);
caso(
  'contagens/linhas',
  true,
  CONTA.linhas === 3,
  'e são três linhas: é o número que o cabeçalho rende ao lado do das séries.',
);
caso(
  'contagens/zero',
  true,
  contagens([{ ...LINHA_DA_SERIE, reference_date: '2013-12' }], SERIES).series === 0,
  'sem linha apanhada não há série atrasada, e o cabeçalho rende zero em vez de um lugar vazio.',
);
caso(
  'contagens/serie-sem-linhas',
  true,
  contagens([], SERIES).series === 0,
  'uma série declarada que não apanhe linha nenhuma não conta: um atraso sem linha não se vê ' +
    'em página nenhuma.',
);

/* Os numerais por extenso, que são a única maneira de um número entrar numa
   frase da casa sem ser algarismo. A régua F16 compõe as duas palavras destes. */
caso(
  'numeralPorExtenso/oito',
  true,
  numeralPorExtenso(8, 'pt', true) === 'Oito' && numeralPorExtenso(8, 'en', true) === 'Eight',
  'o numerador da frase do Painel Social, com maiúscula porque abre a frase.',
);
caso(
  'numeralPorExtenso/dezassete',
  true,
  numeralPorExtenso(17, 'pt') === 'dezassete' && numeralPorExtenso(17, 'en') === 'seventeen',
  'o denominador, que é o número que a Comissão publica.',
);
atira(
  'numeralPorExtenso/fora-da-lista',
  () => numeralPorExtenso(99, 'pt'),
  'não há numeral por extenso',
  'um número fora da lista fecha a construção em vez de render um algarismo dentro de uma frase.',
);

/* ------------------------------------------ as listas de que os tipos derivam */

/* As afirmações de compilação de `src/tipos.d.ts` prendem `Linha` a `CAMPOS` e
   `VerificacaoDaLinha` a `CAMPOS_DA_VERIFICACAO`. Aqui confere-se que as duas
   listas são o que se pensa que são, para que uma afirmação de compilação verde
   sobre uma lista encolhida não passe por prova. */
caso('CAMPOS/tamanho', true, CAMPOS.length === 24, 'os 24 campos do formato de uma linha.');
caso(
  'CAMPOS_DA_VERIFICACAO/tamanho',
  true,
  CAMPOS_DA_VERIFICACAO.length === 4,
  'date, path, result e by.',
);

/* ------------------------------------------------------------------- o fim */

console.log('');
console.log(cinza(`  guardas · ${casos} conferência(s) sobre os guardas de execução do bloco F0.4`));
if (falhas.length) {
  console.log(vermelho(`  OS GUARDAS NÃO PASSAM · ${falhas.length} caso(s):`));
  console.log('');
  for (const f of falhas) console.log(`    ${vermelho('✗')} ${f}`);
  console.log('');
  process.exit(1);
}
console.log(
  `  ${verde('✓')} cada guarda recusa o que promete recusar e aceita o que promete aceitar.`,
);
console.log('');
