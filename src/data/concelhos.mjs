/**
 * AS OITO MEDIDAS DE UM CONCELHO, ESCRITAS UMA VEZ, E AS 308 ENTRADAS.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * `src/data/municipios.mjs` guardava a entrada de Évora inteira, com os rótulos,
 * as unidades e os períodos das oito medidas escritos dentro dela. Com 308
 * páginas, escrever esses rótulos 308 vezes seria 308 sítios para divergirem, e
 * corrigir o nome de uma medida passaria a ser uma operação de 308 linhas. Os
 * rótulos passam a estar aqui, num só sítio, e valem para os 308 e para Évora.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO NÃO TEM
 * ---------------------------------------------------------------------------
 * Nenhum algarismo. Uma medida declara o seu nome, a sua unidade, o prefixo do
 * período e a linha curta que diz de onde vem; o VALOR vive no livro-razão e
 * chega por um id, e o id de cada concelho vem do ficheiro que o motor escreve.
 * O período de cada medida é uma data de referência, e entra como `{ ref: … }`,
 * que é o motivo `data-de-referencia` da casa e não uma medição.
 *
 * ---------------------------------------------------------------------------
 * O FICHEIRO DOS 308 É ESCRITO PELO MOTOR, E NÃO EXISTE AINDA
 * ---------------------------------------------------------------------------
 * O exportador do motor escreve `src/data/concelhos.gerado.json`: uma lista de
 * 308 objectos com o slug, o nome, o distrito ou ilha, o código, a posição na
 * Carta e, em `linhas`, o id da linha de cada medida ou `null`. Enquanto ele não
 * existir, este módulo devolve lista vazia e o sítio constrói-se com o concelho
 * que tem entrada escrita à mão — que é o estado honesto: **o repositório não
 * leva um ficheiro gerado sem dados**.
 *
 * `CONCELHOS_GERADO` na chamada aponta para outro ficheiro, e é assim que as
 * réguas e as medições constroem as 308 páginas antes de haver linhas: o
 * ficheiro de teste tem os 308 com todas as `linhas` a `null`, vive fora de
 * `src/data/`, e o que ele prova é a ESTRUTURA (Emenda 14: a página declara o
 * que lhe falta). Ver `tests/municipio/gerar-teste-308.mjs`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MUNICIPIOS, DISTRITOS, eIlha } from './caop-centroids.mjs';

/**
 * AS OITO MEDIDAS, PELA ORDEM DA EMENDA 14.
 *
 * `chave`   — o nome do campo em `linhas` do ficheiro do motor.
 * `nome`    — o nome da medida, nas duas línguas.
 * `unidade` — a unidade sozinha, sem período e sem figura. É o que uma peça
 *             vazia mostra, e é por isso que é um campo declarado e não um
 *             recorte da linha «unidade · período».
 * `prefixo` — as palavras entre a unidade e a data de referência, quando as há
 *             («dezembro de »). Vazio na maior parte.
 * `ref`     — a data de referência da medida nos 308, tal como o contrato com o
 *             motor a fixa. Uma entrada pode dar outra (Évora dá, na medida do
 *             desemprego, o ano que a sua linha mede).
 * `tecto`   — só o índice de dívida: a linha do limite legal, que entra na
 *             própria linha da unidade, como já entrava.
 * `nota`    — a linha curta que diz de onde vem a medida. `null` onde nenhuma
 *             fonte central publica: uma peça vazia não leva frase, e uma nota
 *             sobre uma medida que ninguém publica seria a página a falar de si.
 */
export const MEDIDAS_DO_CONCELHO = [
  {
    chave: 'populacao',
    nome: { pt: 'População residente', en: 'Resident population' },
    unidade: { pt: 'Pessoas', en: 'People' },
    prefixo: { pt: '', en: '' },
    ref: '2025',
    nota: {
      pt: ['Estimativa anual do INE para o concelho.'],
      en: ['The statistics institute’s annual estimate for the municipality.'],
    },
  },
  {
    chave: 'poderDeCompra',
    nome: { pt: 'Poder de compra por habitante', en: 'Purchasing power per inhabitant' },
    unidade: { pt: 'Índice · média nacional = base', en: 'Index · national average = base' },
    prefixo: { pt: '', en: '' },
    ref: '2023',
    nota: {
      pt: ['Poder de compra per capita, publicado pelo INE para todos os concelhos.'],
      en: ['Purchasing power per capita, published for every municipality.'],
    },
  },
  {
    chave: 'desempregoRegistado',
    nome: { pt: 'Desemprego registado', en: 'Registered unemployment' },
    unidade: { pt: 'Pessoas', en: 'People' },
    prefixo: { pt: 'dezembro de ', en: 'December ' },
    ref: '2025',
    nota: {
      pt: ['Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho.'],
      en: ['Registered with the employment service at month end, monthly file by municipality.'],
    },
  },
  {
    /* O RÓTULO CORRIGIDO (decisão D5 do diretor, 26.08.2026). Dizia «Empresas
       sediadas», e a série do INE chama-se «empresas não financeiras»: os 308
       valores somam 1 576 606, que é a linha «empresas não financeiras» do
       destaque do INE de 11.12.2025, e não o total. «Sediadas» não é vocabulário
       do INE. O que está provado, e continua dito na nota, é que cada empresa
       conta num único concelho, o da sede. */
    chave: 'empresas',
    nome: { pt: 'Empresas não financeiras', en: 'Non-financial enterprises' },
    unidade: { pt: 'Empresas', en: 'Enterprises' },
    prefixo: { pt: '', en: '' },
    ref: '2024',
    nota: {
      pt: ['Sistema de contas integradas das empresas, por concelho da sede.'],
      en: ['Integrated business accounts, by municipality of the registered office.'],
    },
  },
  {
    /* A COLUNA DITA (decisão D3 do diretor, 26.08.2026). O ficheiro do regulador
       publica duas colunas de dívida total: uma que inclui as dívidas não
       orçamentais, as exceções e o FAM, e outra que as exclui. É a segunda que a
       lei compara com o limite, e é a que esta medida usa nos 308 e em Évora. A
       diferença entre as duas é de 1,6 % em Évora e de 21 % em Lisboa: sem o
       dizer, dois leitores liam duas medidas com o mesmo nome. */
    chave: 'divida',
    nome: { pt: 'Dívida total do município', en: 'Total municipal debt' },
    unidade: { pt: 'Euros', en: 'Euros' },
    prefixo: { pt: '', en: '' },
    ref: '2024',
    nota: {
      pt: [
        'Série anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais. Exclui dívidas não orçamentais e exceções legais.',
      ],
      en: [
        'The annual series of the local-government directorate, the regulator of municipal accounts. Excludes non-budgetary debt and legal exceptions.',
      ],
    },
  },
  {
    chave: 'indice',
    nome: { pt: 'Índice de dívida', en: 'Debt index' },
    /* Sem «teto legal = 150»: o teto é uma linha do livro-razão, e numa peça
       vazia um valor com selo diria que ali há prova de alguma coisa sobre este
       concelho. A unidade é «Percentagem»; o teto entra na linha da medida. */
    unidade: { pt: 'Percentagem', en: 'Percentage' },
    prefixo: { pt: '', en: '' },
    ref: '2024',
    tecto: 'indice-de-divida-limite-legal',
    tectoTexto: { pt: ', teto legal = ', en: ', legal cap = ' },
    nota: {
      pt: ['Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na linha.'],
      en: ['Computed from two columns of the same regulator file. The arithmetic is on the row.'],
    },
  },
  {
    /* A PEÇA SEM FONTE CENTRAL (decisão D2 do diretor, 26.08.2026). Nenhum
       organismo publica a execução da receita por concelho desde 2019: a DGAL
       deixou de publicar o lado do orçamento. A peça rende-se vazia nos 308,
       Évora incluída, e o que Évora lê da sua própria prestação de contas está
       na camada das contas da página dela, com o seu selo. Sem nota: uma peça
       vazia não leva frase. */
    chave: 'execucaoDaReceita',
    nome: { pt: 'Execução da receita', en: 'Revenue execution' },
    unidade: { pt: 'Percentagem do orçamento', en: 'Percentage of the budget' },
    prefixo: { pt: '', en: '' },
    ref: '2025',
    nota: null,
  },
  {
    chave: 'pmp',
    nome: { pt: 'Prazo médio de pagamento', en: 'Average payment time' },
    unidade: { pt: 'Dias', en: 'Days' },
    prefixo: { pt: 'dezembro de ', en: 'December ' },
    ref: '2025',
    nota: {
      pt: ['Lista anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais.'],
      en: ['The annual list of the local-government directorate, the regulator of municipal accounts.'],
    },
  },
];

/** A linha «unidade · período» de uma medida, nas duas línguas. */
function linhaDaMedida(medida, ref) {
  const parte = (lang) => {
    const cabeca = `${medida.unidade[lang]}${medida.tecto ? medida.tectoTexto[lang] : ''}`;
    const cauda = ` · ${medida.prefixo[lang]}`;
    return medida.tecto
      ? [cabeca, { claim: medida.tecto }, cauda, { ref }]
      : [`${cabeca}${cauda}`, { ref }];
  };
  return { pt: parte('pt'), en: parte('en') };
}

/**
 * O relance de um concelho: as oito medidas, sempre as oito e sempre pela mesma
 * ordem, com o id da linha onde ela existe e `null` onde não existe.
 *
 * @param {Record<string, string|null>} linhas  o mapa `linhas` do ficheiro do motor
 * @param {Record<string, string>} [refs]  a data de referência de uma medida, quando
 *   este concelho a mede noutro período (Évora, no desemprego)
 */
export function relanceDoConcelho(linhas = {}, refs = {}) {
  return MEDIDAS_DO_CONCELHO.map((medida) => {
    const ref = refs[medida.chave] ?? medida.ref;
    return {
      claim: linhas?.[medida.chave] ?? null,
      chave: medida.chave,
      nome: medida.nome,
      unidade: medida.unidade,
      medida: linhaDaMedida(medida, ref),
      nota: medida.nota,
    };
  });
}

/** O rótulo do distrito ou da ilha, pela regra dos 308 (`eIlha`). */
export function rotuloDoDistrito(distritoOuIlha) {
  if (eIlha(distritoOuIlha)) return { pt: distritoOuIlha, en: distritoOuIlha };
  return { pt: `distrito de ${distritoOuIlha}`, en: `district of ${distritoOuIlha}` };
}

/**
 * O ficheiro dos 308, se existir.
 *
 * Nunca se edita à mão, e por isso não se importa como módulo: lê-se do disco,
 * e a sua ausência é um estado normal e não um erro. `CONCELHOS_GERADO` no
 * ambiente aponta para outro caminho, que é como as réguas e as medições
 * constroem as 308 páginas com o ficheiro de teste.
 */
export function caminhoDoFicheiroGerado() {
  if (process.env.CONCELHOS_GERADO) return process.env.CONCELHOS_GERADO;
  return path.join(encontraRaiz(), 'src', 'data', 'concelhos.gerado.json');
}

/**
 * A RAIZ DO REPOSITÓRIO, PROCURADA A SUBIR, E NUNCA RELATIVA A ESTE FICHEIRO.
 *
 * A primeira redação escrevia `new URL('./concelhos.gerado.json', import.meta.url)`,
 * e isso está errado pela mesma razão que `src/lib/prova.mjs` tem escrita no seu
 * cabeçalho desde a primeira corrida dele: **na construção, este módulo é
 * empacotado**, e um caminho relativo ao módulo passa a apontar para o pacote e
 * não para `src/data/`. O ficheiro existia e a construção não o via.
 *
 * O modo de falhar era silencioso, e é o pior que há: `entradasGeradas()`
 * devolvia lista vazia, o `getStaticPaths` construía UMA página de concelho, e
 * nada fechava a construção do lado do Astro. Quem o apanhou foi o portão, com
 * duas contas do mesmo número feitas de sítios diferentes: a prova, que corre em
 * Node e via o ficheiro, dizia 308 concelhos com página e 307 no livro-razão; a
 * vista `dist`, que conta o que foi construído, dizia 1 e 0. É exactamente para
 * isto que as chaves da prova têm duas contas.
 *
 * **Não foi apanhado no P2 (estrutura) porque a cobertura dos 308 foi sempre
 * construída com `CONCELHOS_GERADO`,** que é um caminho absoluto e não passa por
 * aqui: o caminho por omissão nunca foi exercido com um ficheiro a existir. A
 * régua `tests/municipio/concelhos.mjs` passa a exercê-lo.
 *
 * A procura é a de `encontraLivroRazao()` e a de `prova.mjs`: do directório de
 * trabalho primeiro, do próprio ficheiro depois, a subir até encontrar
 * `ledger/claims`.
 */
function encontraRaiz() {
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, 'ledger', 'claims'))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ?? subir(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd()
  );
}

function carregaGerados() {
  const caminho = caminhoDoFicheiroGerado();
  if (!fs.existsSync(caminho)) return [];
  const lista = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  if (!Array.isArray(lista)) {
    throw new Error(`concelhos: "${caminho}" tem de ser uma lista de objetos, um por concelho.`);
  }
  return lista;
}

/**
 * As entradas dos concelhos que o motor exportou, na forma que a vista lê.
 *
 * Uma entrada gerada NÃO tem `leitura`, `contas`, `tempo`, `metodo`, `naoSabe`
 * nem `estudos`: um concelho sem trabalho publicado não tem nada disso, e a
 * vista rende só o que existe. O que ela tem são as oito peças, a distância
 * desenhada quando as duas linhas existem, e o cartão localizador.
 *
 * @param {string[]} excluir  slugs que já têm entrada escrita à mão
 */
export function entradasGeradas(excluir = []) {
  const fora = new Set(excluir);
  return carregaGerados()
    .filter((c) => !fora.has(c.slug))
    .map((c) => {
      const nomeDaCarta = MUNICIPIOS[c.caopIndex]?.[0];
      if (nomeDaCarta === undefined) {
        throw new Error(
          `concelhos: "${c.slug}" declara caopIndex ${c.caopIndex}, que não existe na Carta.`,
        );
      }
      if (nomeDaCarta !== c.nome) {
        throw new Error(
          `concelhos: "${c.slug}" diz chamar-se "${c.nome}" e a Carta chama-lhe "${nomeDaCarta}".`,
        );
      }
      const distritoDaCarta = DISTRITOS[MUNICIPIOS[c.caopIndex][1]];
      if (distritoDaCarta !== c.distritoOuIlha) {
        throw new Error(
          `concelhos: "${c.slug}" diz "${c.distritoOuIlha}" e a Carta diz "${distritoDaCarta}".`,
        );
      }
      const linhas = c.linhas ?? {};
      return {
        slug: c.slug,
        nome: { pt: c.nome, en: c.nome },
        distrito: rotuloDoDistrito(distritoDaCarta),
        caopIndex: c.caopIndex,
        relance: relanceDoConcelho(linhas),
        distancia: {
          valor: linhas.divida ?? null,
          limite: linhas.limite ?? null,
          indice: linhas.indice ?? null,
          tecto: 'indice-de-divida-limite-legal',
          ref: '2024',
        },
      };
    });
}
