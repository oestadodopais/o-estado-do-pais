/** UE2: a auditoria das formas da página da União, pedaço a pedaço (o item 3 do brief; a K16 do `check:cartao`).
 *
 * As sete perguntas que usavam um dos quatro termos técnicos do §0 do brief (o índice nominal do custo unitário do
 * trabalho, os deflatores, as economias avançadas e a dívida ou o fluxo de crédito consolidado) ganharam a forma
 * `uniao` em `src/data/figuras.mjs`: as palavras comuns primeiro, e o termo da fonte entre parênteses. Cada pedaço de
 * cada forma apoia-se num literal de uma origem que a forma declara, e este guião escreve essas entradas na auditoria
 * (`tests/cartao/perguntas-provadas.json`), depois de conferir, antes de escrever, que os pedaços juntos são a forma
 * declarada nas duas edições e que cada literal está mesmo no campo que cita. As palavras que explicam vêm, onde as
 * há, das leituras dos cartões nacionais que a K17 já audita, com os mesmos literais.
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-formas.mjs            (confere e escreve)
 *   node design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-formas.mjs --confere  (só confere o ficheiro)
 * Sai 0 quando tudo bate; 1 com a lista do que não bate.
 */
import fs from 'node:fs';
import { DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES, textoDaDefinicao } from '../../../../src/data/figuras.mjs';

const FICHEIRO = 'tests/cartao/perguntas-provadas.json';
const so = process.argv.includes('--confere');

const o = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
const pedaco = (pt, en, ...apoios) => ({ pt, en, apoios });

/** As sete formas, pela ordem de `DEFINICOES_DAS_MEDIDAS`. */
const FORMAS = [
  {
    id: 'custo-unitario-do-trabalho-2025',
    mudanca:
      'UE2: a forma da página da União. O índice nominal do custo unitário do trabalho diz-se em palavras comuns (a remuneração por hora de trabalho, aos preços de cada ano, a dividir pelo que se produz numa hora de trabalho), pela descrição do Eurostat que a leitura do cartão nacional já cita, e o termo da Comissão fica entre parênteses.',
    pedacos: [
      pedaco('Quanto mudou em três anos ', 'How much has ', o('pdm-custo-do-trabalho', '3-year percentage change')),
      pedaco('a remuneração por hora de trabalho', 'pay per hour of work',
        o('eurostat-tipslm10-descricao', 'labour cost is the ratio of compensation of employees (current prices) to hours worked by employees')),
      pedaco(', aos preços de cada ano', ', at each year’s prices', o('eurostat-tipslm10-descricao', 'compensation of employees (current prices)')),
      pedaco(', a dividir pelo que se produz numa hora de trabalho ', ', divided by what an hour of work produces, changed over three years ',
        o('eurostat-tipslm10-descricao', 'the ratio of labour cost to labour productivity'),
        o('eurostat-tipslm10-descricao', 'labour productivity is the ratio of gross domestic product'),
        o('eurostat-tipslm10-descricao', 'to total hours worked'),
        o('pdm-custo-do-trabalho', '3-year percentage change')),
      pedaco('(o índice nominal do custo unitário do trabalho, por hora trabalhada)?', '(the nominal unit labour cost index, per hour worked)?',
        o('pdm-custo-do-trabalho', 'nominal unit labour cost index, per hour worked')),
    ],
  },
  {
    id: 'desempenho-das-exportacoes-2025',
    mudanca:
      'UE2: a forma da página da União. As economias avançadas dizem-se pelo que a descrição do Eurostat conta (os países da OCDE e os países da União que não são da OCDE), com as palavras da leitura do cartão nacional, e o termo da Comissão fica entre parênteses.',
    pedacos: [
      pedaco('Quanto mudou em três anos ', 'How much has ', o('pdm-exportacoes', '3-year percentage change')),
      pedaco(
        'a parte que as exportações de bens e serviços do país têm no total das exportações dos países da OCDE e dos países da União que não são da OCDE ',
        'the part that the country’s exports of goods and services make up of the total exports of OECD countries and of EU countries outside the OECD changed over three years ',
        o('eurostat-tipsbp60-descricao', 'shares of exports of goods and services of EU Member States in relation to total exports of goods and services of OECD countries and non-OECD EU Member States'),
        o('pdm-exportacoes', '3-year percentage change')),
      pedaco('(o desempenho das exportações face às economias avançadas)?', '(export performance against advanced economies)?',
        o('pdm-exportacoes', 'export performance against advanced economies')),
    ],
  },
  {
    id: 'divida-das-empresas-2025',
    mudanca:
      'UE2: a forma da página da União. As sociedades não financeiras dizem-se como as empresas que não são financeiras, a dívida pelos instrumentos que a descrição do Eurostat conta (empréstimos e títulos de dívida), e «consolidada» pelo que a descrição do Eurostat do mesmo setor diz dos dados consolidados (sem as operações dentro do setor); o termo fica entre parênteses.',
    pedacos: [
      pedaco('Quanto devem as empresas que não são financeiras', 'How much do companies other than financial companies owe',
        o('eurostat-tipspd30', 'Non-financial corporations debt')),
      pedaco(', em empréstimos e títulos de dívida', ' in loans and debt securities', o('eurostat-tipspd30-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      pedaco(', sem contar o que devem umas às outras ', ', leaving out what they owe one another ',
        o('eurostat-tipspc30-descricao', 'Data are presented in consolidated terms (i.e. excluding intra-sector transactions)')),
      pedaco('(a dívida consolidada das sociedades não financeiras)', '(the consolidated debt of non-financial corporations)',
        o('pdm-divida-das-empresas', 'NFC consolidated debt'),
        o('eurostat-tipspd30', 'Non-financial corporations debt, consolidated')),
      pedaco(', em percentagem do PIB?', ', as a percentage of GDP?', o('pdm-divida-das-empresas', 'in % of GDP')),
    ],
  },
  {
    id: 'divida-das-familias-2025',
    mudanca:
      'UE2: a forma da página da União. A dívida diz-se pelos instrumentos que a descrição do Eurostat conta (empréstimos e títulos de dívida), e «consolidada» pelo que a descrição do Eurostat do mesmo setor diz dos dados consolidados (sem as operações dentro do setor); o termo fica entre parênteses.',
    pedacos: [
      pedaco('Quanto devem as famílias e as instituições sem fim lucrativo ao seu serviço', 'How much do households and non-profit institutions serving them owe',
        o('pdm-divida-das-familias', 'household (incl. NPISH) consolidated debt'),
        o('glossario-npish', 'Non-profit institutions serving households')),
      pedaco(', em empréstimos e títulos de dívida', ' in loans and debt securities', o('eurostat-tipspd22-descricao', 'Debt securities (F.3) and Loans (F.4)')),
      pedaco(', sem contar o que devem umas às outras ', ', leaving out what they owe one another ',
        o('eurostat-tipspc40-descricao', 'transactions within the same sector are not taken into account')),
      pedaco('(a dívida consolidada)', '(consolidated debt)', o('pdm-divida-das-familias', 'consolidated debt')),
      pedaco(', em percentagem do PIB?', ', as a percentage of GDP?', o('pdm-divida-das-familias', 'in % of GDP')),
    ],
  },
  {
    id: 'fluxo-de-credito-as-empresas-2025',
    mudanca:
      'UE2: a forma da página da União. O fluxo de crédito consolidado diz-se com as palavras da leitura do cartão nacional (o crédito contraído num ano, descontado o que se reembolsou), pela descrição do Eurostat e pelo SEC 2010, e «consolidado» pelo que a descrição diz dos dados consolidados; o termo fica entre parênteses, e a dívida do período anterior diz-se no fim do ano anterior, como a descrição a diz.',
    pedacos: [
      pedaco('Quanto crédito contraíram num ano ', 'How much credit did ', o('eurostat-tipspc30-descricao', 'the net amount of liabilities incurred during the year')),
      pedaco('as empresas que não são financeiras', 'companies other than financial companies take on in a year',
        o('eurostat-tipspd30', 'Non-financial corporations debt'),
        o('eurostat-tipspc30-descricao', 'non-financial corporations sector (S.11)'),
        o('eurostat-tipspc30-descricao', 'the net amount of liabilities incurred during the year')),
      pedaco(', descontado o que reembolsaram', ', minus what they repaid',
        o('eurostat-sec2010-registo-liquido', 'incurrences of liabilities are shown net of repayments of liabilities')),
      pedaco(' e sem contar as operações entre elas ', ' and leaving out operations among themselves ',
        o('eurostat-tipspc30-descricao', 'Data are presented in consolidated terms (i.e. excluding intra-sector transactions)')),
      pedaco('(o fluxo de crédito consolidado das sociedades não financeiras)', '(the consolidated credit flow of non-financial corporations)',
        o('pdm-credito-as-empresas', 'consolidated credit flow'),
        o('eurostat-tipspd30', 'Non-financial corporations')),
      pedaco(', em percentagem da dívida que tinham no fim do ano anterior', ', as a percentage of the debt they had at the end of the previous year',
        o('eurostat-tipspc30-descricao', 'expressed as a percentage of the corresponding stocks (excluding FDI) at the end of the previous year')),
      pedaco(', excluindo o investimento direto estrangeiro das duas parcelas?', ', excluding foreign direct investment from both amounts?',
        o('pdm-credito-as-empresas', 'NFC (excl. FDI) consolidated credit flow in % of NFC debt stock in t-1 (excl. FDI)'),
        o('glossario-fdi', 'Foreign direct investment, abbreviated as FDI')),
    ],
  },
  {
    id: 'fluxo-de-credito-as-familias-2025',
    mudanca:
      'UE2: a forma da página da União. O fluxo de crédito consolidado diz-se com as palavras da leitura do cartão nacional (o crédito contraído num ano, descontado o que se reembolsou), pela descrição do Eurostat e pelo SEC 2010, e «consolidado» pelo que a descrição diz dos dados consolidados; o termo fica entre parênteses, e a dívida do período anterior diz-se no fim do ano anterior, como a descrição a diz.',
    pedacos: [
      pedaco('Quanto crédito contraíram num ano ', 'How much credit did ', o('eurostat-tipspc40-descricao', 'have incurred during the year')),
      pedaco('as famílias e as instituições sem fim lucrativo ao seu serviço', 'households and non-profit institutions serving them take on in a year',
        o('pdm-credito-as-familias', 'household (incl. NPISH)'),
        o('glossario-npish', 'Non-profit institutions serving households'),
        o('eurostat-tipspc40-descricao', 'have incurred during the year')),
      pedaco(', descontado o que reembolsaram', ', minus what they repaid',
        o('eurostat-sec2010-registo-liquido', 'net of repayments of liabilities'),
        o('eurostat-tipspc40-descricao', 'the net amount of liabilities')),
      pedaco(' e sem contar as operações entre elas ', ' and leaving out operations among themselves ',
        o('eurostat-tipspc40-descricao', 'transactions within the same sector are not taken into account')),
      pedaco('(o fluxo de crédito consolidado)', '(the consolidated credit flow)', o('pdm-credito-as-familias', 'consolidated credit flow')),
      pedaco(', em percentagem da dívida que tinham no fim do ano anterior?', ', as a percentage of the debt they had at the end of the previous year?',
        o('eurostat-tipspc40-descricao', 'expressed in percentage of the related stocks at the end of the previous year')),
    ],
  },
  {
    id: 'taxa-de-cambio-efectiva-real-2025',
    mudanca:
      'UE2: a forma da página da União. A taxa de câmbio efetiva real diz-se pelo que mede (os preços do país face aos de outros países, contando as taxas de câmbio e os preços no consumidor), pela descrição do Eurostat que a leitura do cartão nacional já cita, e os deflatores ficam entre parênteses, com o termo.',
    pedacos: [
      pedaco('Quanto mudaram em três anos ', 'How much have ', o('pdm-cambio-efectivo-real', '3-year percentage change')),
      pedaco('os preços do país face aos de outros 41 países industriais, ', 'the country’s prices relative to those of 41 other industrial countries, ',
        o('eurostat-tipser10-descricao', 'price or cost competitiveness relative to its principal competitors'),
        o('pdm-cambio-efectivo-real', 'relative to 41 other industrial countries')),
      pedaco('contando as taxas de câmbio e os preços no consumidor de cada um ', 'allowing for exchange rates and each country’s consumer prices, changed over three years ',
        o('eurostat-tipser10-descricao', 'depend not only on exchange rate movements but also on cost and price trends'),
        o('eurostat-tipser10-descricao', 'deflated by the consumer price indices'),
        o('pdm-cambio-efectivo-real', '3-year percentage change')),
      pedaco('(a taxa de câmbio efetiva real, com base nos deflatores dos índices de preços no consumidor)?', '(the real effective exchange rate, based on consumer price index deflators)?',
        o('pdm-cambio-efectivo-real', 'real effective exchange rates'),
        o('pdm-cambio-efectivo-real', 'based on HICP/CPI deflators')),
    ],
  },
];

const LEITURA = {
  quem: 'Claude Opus 5.5',
  quando: '2026-10-02',
  o_que:
    'o UE2, item 3 do brief: as formas da página da União das sete perguntas com termos técnicos, pedaço a pedaço, escritas por design/especime-v3/medicoes/ue2-2026-10-02/auditoria-das-formas.mjs, com as origens já seladas que as leituras dos cartões nacionais citam',
};

const erros = [];
const entradas = FORMAS.map((f) => {
  const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[f.id];
  const forma = d?.uniao;
  if (!forma) {
    erros.push(`${f.id}: a declaração não tem a forma «uniao»`);
    return null;
  }
  const pergunta = { pt: textoDaDefinicao(forma.pt), en: textoDaDefinicao(forma.en) };
  for (const lang of ['pt', 'en']) {
    const junta = f.pedacos.map((p) => p[lang]).join('');
    if (junta !== pergunta[lang]) erros.push(`${f.id} (${lang}): os pedaços juntos dão «${junta}» e a forma é «${pergunta[lang]}»`);
  }
  const usadas = new Set();
  for (const p of f.pedacos) {
    for (const a of p.apoios) {
      const origem = /** @type {any} */ (ORIGENS_DAS_DEFINICOES)[a.origem];
      if (!forma.origens.includes(a.origem)) erros.push(`${f.id}: o apoio cita «${a.origem}», que a forma não declara`);
      if (typeof origem?.[a.campo] !== 'string' || !origem[a.campo].includes(a.literal)) {
        erros.push(`${f.id}: «${a.literal}» não está no campo «${a.campo}» de «${a.origem}»`);
      }
      usadas.add(a.origem);
    }
  }
  for (const k of forma.origens) if (!usadas.has(k)) erros.push(`${f.id}: a origem «${k}» da forma não apoia pedaço nenhum`);
  return { id: f.id, forma: 'uniao', origens: [...forma.origens], pergunta, mudanca: f.mudanca, pedacos: f.pedacos };
});
const formasDeclaradas = Object.entries(DEFINICOES_DAS_MEDIDAS).filter(([, d]) => /** @type {any} */ (d).uniao).map(([id]) => id);
if (formasDeclaradas.join(',') !== FORMAS.map((f) => f.id).join(',')) {
  erros.push(`a declaração tem as formas ${formasDeclaradas.join(', ')} e este guião audita ${FORMAS.map((f) => f.id).join(', ')}`);
}

const auditoria = JSON.parse(fs.readFileSync(FICHEIRO, 'utf8'));
if (so) {
  const noFicheiro = auditoria.perguntas.filter((q) => q.forma === 'uniao');
  if (JSON.stringify(noFicheiro) !== JSON.stringify(entradas)) erros.push('as entradas das formas no ficheiro não são as que este guião escreve');
  if (!auditoria.leituras.some((l) => JSON.stringify(l) === JSON.stringify(LEITURA))) erros.push('falta a leitura do UE2 no registo das leituras');
} else if (!erros.length) {
  auditoria.perguntas = [...auditoria.perguntas.filter((q) => q.forma !== 'uniao'), ...entradas];
  if (!auditoria.leituras.some((l) => JSON.stringify(l) === JSON.stringify(LEITURA))) auditoria.leituras.push(LEITURA);
  fs.writeFileSync(FICHEIRO, JSON.stringify(auditoria, null, 2) + '\n');
}
if (erros.length) {
  for (const e of erros) console.error(`  ${e}`);
  process.exit(1);
}
const pedacos = entradas.reduce((n, e) => n + e.pedacos.length, 0);
const apoios = entradas.reduce((n, e) => n + e.pedacos.reduce((m, p) => m + p.apoios.length, 0), 0);
console.log(`UE2: ${entradas.length} formas da página da União auditadas, ${pedacos} pedaços, ${apoios} apoios${so ? ' (só conferido)' : ' (escritas)'}.`);
