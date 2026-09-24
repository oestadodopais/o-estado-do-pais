/**
 * A AUDITORIA DAS LEITURAS (bloco L1, item 4), escrita a partir da leitura que
 * está neste ficheiro e validada antes de se gravar.
 *
 *   node design/especime-v3/medicoes/l1-2026-09-24/escrever-auditoria-l1.mjs
 *
 * Escreve `tests/cartao/leituras-provadas.json`, que a célula K17 do
 * `check:cartao` lê. A leitura é a do construtor (Claude Opus 5.5, 24.09.2026):
 * para cada folha de texto de cada leitura declarada, as partes em que ela se
 * divide, com a classe de cada uma e, onde a parte diz o que a medida é, o
 * literal que a apoia e o campo onde ele está. Três classes:
 *
 *   diz    diz o que a medida é, o que o seu sinal quer dizer, ou de quem é o
 *          valor de referência e o que ele é; tem de ter apoio
 *   conta  as palavras de uma comparação ou de um veredicto que a máquina
 *          escolhe sobre valores selados; não precisa de origem (é uma conta),
 *          e a K17 só a aceita dentro de um ramo calculado, à porta dele, ou a
 *          seguir a uma chave da prova
 *   liga   pontuação, espaços e palavras de ligação de uma lista fechada
 *
 * O guião não decide nada que a K17 não confira outra vez: junta as partes e
 * compara-as com a folha, procura cada literal no seu campo, e recusa-se a
 * escrever se alguma coisa falhar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const { LEITURAS_DAS_MEDIDAS } = await import(path.join(RAIZ, 'src/data/leituras-das-medidas.mjs'));
const { ORIGENS_DAS_DEFINICOES } = await import(path.join(RAIZ, 'src/data/figuras.mjs'));
const { loadClaims } = await import(path.join(RAIZ, 'src/lib/ledger.mjs'));
const { folhasDaLeitura, conferirAuditoriaDasLeituras } = await import(path.join(RAIZ, 'tests/cartao/leituras.mjs'));

/* ------------------------------------------------------------ as formas */
/** @param {string} origem @param {string} literal @param {string} [campo] */
const O = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
/** @param {string} campo @param {string} literal @param {string} [linha] */
const L = (campo, literal, linha = 'propria') => ({ linha, campo, literal });
const ANO = { linha: 'propria', campo: 'reference_date', forma: 'ano' };
/** @param {string} pt @param {string} en @param {...object} apoios */
const diz = (pt, en, ...apoios) => ({ pt, en, classe: 'diz', apoios });
/** @param {string} pt @param {string} en */
const conta = (pt, en) => ({ pt, en, classe: 'conta' });
/** @param {string} pt @param {string} en */
const liga = (pt, en) => ({ pt, en, classe: 'liga' });
/** Uma folha inteira numa parte só. @param {object} parte */
const inteira = (parte) => ({ pt: parte.pt, en: parte.en, partes: [parte] });
/** Uma folha em várias partes. @param {...object} partes */
const folha = (...partes) => ({ pt: partes.map((p) => p.pt).join(''), en: partes.map((p) => p.en).join(''), partes });

const PIB = O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy');
const PERIODO_DO_PIB = O('eurostat-tipsna40-descricao', 'within a certain period of time');
const COMISSAO = O('painel-pdm', 'Comissão Europeia', 'publicador');
const DESEQUILIBRIO = O('painel-pdm', 'indicative thresholds, covering the major sources of macroeconomic imbalances');

/* ------------------------------------------------ as folhas partilhadas */
const COMUNS = [
  inteira(liga(' ', ' ')),
  inteira(liga('.', '.')),
  inteira(liga('Em ', 'In ')),
  inteira(liga(' aos ', ' to ')),
  inteira(liga(' %', ' %')),
  ...[['Subiu face a', 'Up from'], ['Desceu face a', 'Down from'], ['Ficou igual a', 'Unchanged from'],
    ['Está acima da média da União Europeia.', 'Above the European Union average.'],
    ['Está abaixo da média da União Europeia.', 'Below the European Union average.'],
    ['Está ao nível da média da União Europeia.', 'Level with the European Union average.'],
    ['Pesa mais do que em', 'It weighs more than in'], ['Pesa menos do que em', 'It weighs less than in'],
    ['Pesa o mesmo que em', 'It weighs the same as in'],
    ['A diferença cresceu face a', 'The gap widened from'], ['A diferença encolheu face a', 'The gap narrowed from'],
    ['A diferença ficou igual à de', 'The gap was unchanged from'],
    ['É maior do que na média da União Europeia.', 'It is wider than the European Union average.'],
    ['É menor do que na média da União Europeia.', 'It is narrower than the European Union average.'],
    ['É igual à da média da União Europeia.', 'It is the same as the European Union average.'],
    ['A variação é maior do que a da União Europeia.', 'The change is larger than the European Union’s.'],
    ['A variação é menor do que a da União Europeia.', 'The change is smaller than the European Union’s.'],
    ['A variação é igual à da União Europeia.', 'The change is the same as the European Union’s.'],
    ['acima.', 'above it.'], ['abaixo ou no limite.', 'at or below it.'], ['no limite.', 'at the limit.'],
    ['abaixo.', 'below it.'], ['abaixo desse valor.', 'below that value.'], ['acima desse valor.', 'above that value.'],
  ].map(([pt, en]) => inteira(conta(pt, en))),
  ...[[' é maior do que a medida em', ' is larger than the one measured in'],
    [' é menor do que a medida em', ' is smaller than the one measured in'],
    [' é igual à medida em', ' is the same as the one measured in']].map(([pt, en]) =>
    folha(diz('A variação em três anos', 'The three-year change', L('unit', 'variação em três anos')), conta(pt, en))),
  folha(
    diz('em percentagem do PIB', 'as a percentage of GDP', L('unit', '% do PIB')),
    diz(', o valor de tudo o que o país produz', ', the value of everything the country produces', PIB),
    diz(' num ano', ' in a year', PERIODO_DO_PIB, ANO),
    liga('.', '.'),
  ),
  inteira(diz(' Para a Comissão Europeia, ', ' For the European Commission, ', COMISSAO)),
  folha(diz(' é sinal de possível desequilíbrio', ' is a sign of a possible imbalance', DESEQUILIBRIO), conta(': Portugal está ', ': Portugal is ')),
  folha(liga(' %', ' %'), diz(' é sinal de possível desequilíbrio', ' is a sign of a possible imbalance', DESEQUILIBRIO), conta(': Portugal está ', ': Portugal is ')),
  inteira(diz(' anos que está sem emprego, entre as que trabalham ou procuram trabalho.', ' who are out of work, among those who work or are looking for work.',
    O('glossario-desemprego', 'The unemployment rate is the number of people unemployed as a percentage of the labour force.'),
    O('glossario-atividade', 'The economically active population comprises employed and unemployed persons.'))),
  inteira(diz(' Zero quer dizer que não mudou.', ' Zero means it did not change.', L('unit', 'variação em três anos'))),
  inteira(diz(' % do rendimento disponível com a habitação.', ' % of its disposable income on housing.',
    O('glossario-sobrecarga', 'represent more than 40 % of disposable income'))),
];

/* ------------------------------------------------------ as medidas */
const TETO = (pt, en, ...apoios) => inteira(diz(pt, en, ...apoios));
const M = {};
const medida = (id, origens, folhas, algarismos = []) => { M[id] = { id, origens, folhas, algarismos }; };
const ALG = (nl, ...apoios) => ({ nl, apoios });

medida('pib-real-per-capita-2025', ['eurostat-tipsna40-descricao'], [
  folha(
    diz('É o valor de tudo o que o país produziu', 'It is the value of everything the country produced', PIB),
    diz(' no ano', ' in the year', O('eurostat-tipsna40-descricao', 'the average population of a specific year'), ANO),
    diz(', por habitante', ', per inhabitant', L('unit', 'euros por habitante'), O('eurostat-tipsna40-descricao', 'ratio of real gross domestic product to the average population')),
    diz(', em termos reais', ', in real terms', O('eurostat-tipsna40-descricao', 'real gross domestic product')),
    liga('.', '.'),
  ),
]);

const PARENTESES = [
  diz(' (o Estado', ' (the State', O('ine-pde-subsetores', 'Administração Central')),
  diz(', as regiões autónomas', ', the autonomous regions', O('ine-pde-regional-e-local', 'Administração Regional da Madeira'), O('ine-pde-regional-e-local', 'Administração Regional dos Açores')),
  diz(', as autarquias', ', local authorities', O('ine-pde-subsetores', 'Administração Local')),
  diz(' e a segurança social)', ' and social security)', O('ine-pde-subsetores', 'Fundos de Segurança Social')),
];
const ADMINISTRACOES = diz(' as administrações públicas', ' general government', L('excerpt', 'General government'));
medida('saldo-das-administracoes-publicas-2025', ['ine-pde-subsetores', 'ine-pde-regional-e-local', 'eurostat-gfs-saldo', 'eurostat-gfs-pacto', 'eurostat-tipsna40-descricao'], [
  folha(ADMINISTRACOES, ...PARENTESES,
    diz(' receberam mais do que gastaram', ' took in more than it spent', O('eurostat-gfs-saldo', 'The difference between total revenue and total expenditure'), L('excerpt', 'Net lending (+)')),
    diz(': um excedente de ', ': a surplus of ', L('document.title', 'deficit/surplus'))),
  folha(ADMINISTRACOES, ...PARENTESES,
    diz(' gastaram mais do que receberam', ' spent more than it took in', O('eurostat-gfs-saldo', 'The difference between total revenue and total expenditure'), L('excerpt', 'net borrowing (-)')),
    diz(': o saldo foi de ', ': the balance was ', L('excerpt', 'Net lending (+)/net borrowing (-)'))),
  folha(ADMINISTRACOES, ...PARENTESES,
    diz(' gastaram tanto quanto receberam', ' spent exactly what it took in', O('eurostat-gfs-saldo', 'The difference between total revenue and total expenditure')),
    liga('.', '.')),
  folha(
    diz(' % do PIB', ' % of GDP', L('unit', '% do PIB')),
    diz(', o valor de tudo o que o país produz', ', the value of everything the country produces', PIB),
    diz(' num ano', ' in a year', PERIODO_DO_PIB, ANO),
    liga('.', '.')),
  inteira(conta('O saldo subiu face a', 'The balance rose from')),
  inteira(conta('O saldo desceu face a', 'The balance fell from')),
  inteira(conta('O saldo ficou igual ao de', 'The balance was unchanged from')),
  inteira(diz(' O Pacto de Estabilidade e Crescimento não deixa o défice passar de ', ' The Stability and Growth Pact does not allow the deficit to exceed ',
    O('eurostat-gfs-pacto', 'Stability and Growth Pact'), O('eurostat-gfs-pacto', "a Member State's government deficit may not exceed 3% of its gross domestic product (GDP)"))),
  folha(diz(' % do PIB', ' % of GDP', O('eurostat-gfs-pacto', 'of its gross domestic product (GDP)')), conta(': Portugal ', ': Portugal ')),
  inteira(conta('cumpre.', 'complies.')),
  inteira(conta('não cumpre.', 'does not comply.')),
]);

medida('divida-publica-2025', ['eurostat-tipsgo10-descricao', 'pdm-divida-publica', 'painel-pdm', 'eurostat-tipsna40-descricao'], [
  inteira(diz('É tudo o que as administrações públicas devem, ', 'It is everything general government owes, ',
    O('eurostat-tipsgo10-descricao', 'debt means total gross debt'), O('pdm-divida-publica', 'general government sector debt'))),
  TETO('uma dívida acima de ', 'debt above ', O('pdm-divida-publica', 'general government sector debt in % of GDP with a threshold of 60%')),
  TETO(' % do PIB', ' % of GDP', O('pdm-divida-publica', 'in % of GDP')),
]);

medida('crescimento-da-despesa-liquida-2025', ['cfp-despesa-liquida', 'cfp-quem', 'cfp-compromisso', 'cfp-trajetoria'], [
  folha(
    diz('É quanto cresceu num ano a despesa pública líquida', 'It is how much net public expenditure grew in a year',
      L('excerpt', 'crescimento da despesa líquida'), O('cfp-despesa-liquida', 'Despesa Total'), ANO),
    diz(': a que não conta os juros da dívida', ': the expenditure that leaves out interest on the debt',
      O('cfp-despesa-liquida', '(da qual se ex clui)'), O('cfp-despesa-liquida', 'Encargos com Juros (2)')),
    diz(', a despesa financiada por fundos europeus', ', spending financed by European funds', O('cfp-despesa-liquida', 'Despesa financiada por fundos da UE (4)')),
    diz(' nem a que sobe e desce com o desemprego', ' and the spending that rises and falls with unemployment', O('cfp-despesa-liquida', 'Despesa cíclica com subsídio de desemprego (3)')),
    diz(', apurada pelo Conselho das Finanças Públicas.', ', as computed by the Public Finance Council.',
      L('excerpt', 'O CFP apurou um crescimento da despesa líquida'), O('cfp-quem', 'Conselho das Finanças Públicas (CFP)')),
  ),
  inteira(conta('Cresceu mais do que em', 'It grew more than in')),
  inteira(conta('Cresceu menos do que em', 'It grew less than in')),
  inteira(conta('Cresceu o mesmo que em', 'It grew the same as in')),
  inteira(diz(' Portugal comprometeu-se, num compromisso endossado pelo Conselho da União Europeia, a não a deixar crescer mais de ',
    ' Portugal committed, in a commitment endorsed by the Council of the European Union, not to let it grow by more than ',
    O('cfp-compromisso', 'compromisso assumido por Portugal e endossado pelo Conselho da UE'),
    O('cfp-trajetoria', 'comprometeu-se com uma determinada trajetória de crescimento da despesa líquida'),
    L('excerpt', 'a taxa de crescimento de 5% recomendada'))),
  inteira(liga(' % em ', ' % in ')),
  folha(conta(': ', ': it ')),
  inteira(conta('cresceu mais do que isso.', 'grew more than that.')),
  inteira(conta('ficou dentro desse limite.', 'stayed within that limit.')),
]);

medida('saldo-da-balanca-corrente-2025', ['eurostat-tipsbp10-descricao', 'pdm-balanca-corrente', 'painel-pdm', 'eurostat-tipsna40-descricao'], [
  folha(
    diz('É a diferença entre o que Portugal recebeu do resto do mundo e o que lhe pagou', 'It is the difference between what Portugal received from the rest of the world and what it paid to it',
      O('eurostat-tipsbp10-descricao', 'the transactions of a country with the rest of the world'), O('eurostat-tipsbp10-descricao', 'marked as a credit, a debit or a balance')),
    diz(', em bens, serviços e rendimentos', ', in goods, services and income', O('eurostat-tipsbp10-descricao', 'in goods, services, primary income and secondary income')),
    diz(', na média dos últimos três anos', ', averaged over the last three years', O('pdm-balanca-corrente', '3-year backward moving average'), L('unit', 'média de três anos')),
    liga(' e ', ' and '),
  ),
  inteira(diz(' Positivo quer dizer que o país recebeu mais do que pagou.', ' Positive means the country received more than it paid.', O('eurostat-tipsbp10-descricao', 'marked as a credit, a debit or a balance'))),
  inteira(diz(' Negativo quer dizer que o país pagou mais do que recebeu.', ' Negative means the country paid more than it received.', O('eurostat-tipsbp10-descricao', 'marked as a credit, a debit or a balance'))),
  inteira(diz(' Zero quer dizer que recebeu tanto quanto pagou.', ' Zero means it received exactly what it paid.', O('eurostat-tipsbp10-descricao', 'marked as a credit, a debit or a balance'))),
  folha(diz(' Para a Comissão Europeia, ', ' For the European Commission, ', COMISSAO), diz('um saldo abaixo de −', 'a balance below −', O('pdm-balanca-corrente', 'with thresholds of +6% and -4%'))),
  inteira(diz(' % ou acima de ', ' % or above ', O('pdm-balanca-corrente', 'with thresholds of +6% and -4%'))),
  inteira(conta('entre os dois.', 'between the two.')),
  inteira(conta('acima.', 'above.')),
  inteira(conta('abaixo.', 'below.')),
]);

const RESPONSABILIDADE = diz('A responsabilidade líquida perante o exterior', 'The net external liability',
  O('bdp-pii-sinal', 'representando uma responsabilidade perante o exterior'), O('bdp-pii-sinal', 'there is a net external liability', 'excertoEn'));
medida('posicao-de-investimento-internacional-2025', ['bdp-pii', 'bdp-pii-sinal', 'pdm-posicao-de-investimento', 'painel-pdm', 'eurostat-tipsna40-descricao'], [
  inteira(diz('É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, ',
    'It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, ',
    O('bdp-pii', 'o saldo entre os ativos financeiros e os passivos que os residentes de uma economia têm relativamente ao resto do mundo'),
    O('bdp-pii', 'the difference between financial assets and liabilities that residents of an economy have vis-à-vis the rest of the world', 'excertoEn'))),
  inteira(diz(' Negativa quer dizer que o país deve ao exterior mais do que tem lá.', ' Negative means the country owes abroad more than it owns there.',
    O('bdp-pii-sinal', 'se for negativo significa que existe uma responsabilidade líquida face ao exterior'),
    O('bdp-pii-sinal', 'if it is negative, it means that there is a net external liability', 'excertoEn'))),
  folha(RESPONSABILIDADE, conta(' encolheu face a', ' shrank from')),
  folha(RESPONSABILIDADE, conta(' cresceu face a', ' grew from')),
  folha(RESPONSABILIDADE, conta(' ficou igual à de', ' was unchanged from')),
  inteira(diz(' Positiva quer dizer que o país tem no exterior mais do que lhe deve.', ' Positive means the country owns abroad more than it owes.',
    O('bdp-pii-sinal', 'Se este saldo for positivo, isso significa que o país tem um ativo líquido sobre o exterior'),
    O('bdp-pii-sinal', 'If it is positive, it means that the country has a net foreign asset', 'excertoEn'))),
  inteira(diz(' Zero quer dizer que tem no exterior tanto quanto lhe deve.', ' Zero means it owns abroad exactly what it owes.',
    O('bdp-pii-sinal', 'que pode assumir valores positivos ou negativos'), O('bdp-pii', 'A diferença entre os ativos financeiros e os passivos corresponde ao valor líquido'))),
  folha(diz(' Para a Comissão Europeia, ', ' For the European Commission, ', COMISSAO), diz('uma posição abaixo de −', 'a position below −', O('pdm-posicao-de-investimento', 'with a threshold of -35%'))),
  folha(diz(' % do PIB', ' % of GDP', O('pdm-posicao-de-investimento', 'as percent of GDP')),
    diz(' é sinal de possível desequilíbrio', ' is a sign of a possible imbalance', DESEQUILIBRIO), conta(': Portugal está ', ': Portugal is ')),
  inteira(conta('acima ou no limite.', 'at or above it.')),
]);

medida('taxa-de-cambio-efectiva-real-2025', ['eurostat-tipser10-descricao', 'pdm-cambio-efectivo-real', 'painel-pdm'], [
  folha(
    diz('Mede a competitividade dos preços portugueses face aos principais concorrentes', 'It measures the price competitiveness of Portugal against its main competitors',
      O('eurostat-tipser10-descricao', 'price or cost competitiveness relative to its principal competitors')),
    diz(', contando a inflação e as taxas de câmbio', ', allowing for inflation and exchange rates',
      O('eurostat-tipser10-descricao', 'depend not only on exchange rate movements but also on cost and price trends'),
      O('eurostat-tipser10-descricao', 'deflated by the consumer price indices')),
    diz(', em três anos', ', over three years', O('pdm-cambio-efectivo-real', '3-year percentage change'), L('unit', 'variação em três anos')),
    liga('.', '.'),
  ),
  folha(diz(' Para a Comissão Europeia, ', ' For the European Commission, ', COMISSAO),
    diz('uma variação fora do intervalo entre −', 'a change outside the range from −', O('pdm-cambio-efectivo-real', 'with thresholds of -/+3% for euro area countries'))),
  inteira(liga(' e ', ' to ')),
  inteira(conta('dentro do intervalo.', 'within the range.')),
]);

medida('desempenho-das-exportacoes-2025', ['eurostat-tipsbp60-descricao', 'pdm-exportacoes', 'painel-pdm'], [
  inteira(diz('É quanto mudou em três anos a quota de Portugal nas exportações das economias avançadas.',
    'It is how much Portugal’s share of the exports of advanced economies changed over three years.',
    L('document.title', 'Share of exports of advanced economies'),
    O('eurostat-tipsbp60-descricao', 'developments in shares of exports of goods and services'),
    O('eurostat-tipsbp60-descricao', 'calculated as the 3 year % change'))),
  ...[[' Positiva quer dizer que Portugal ganhou quota.', ' Positive means Portugal gained share.'],
    [' Negativa quer dizer que Portugal perdeu quota.', ' Negative means Portugal lost share.'],
    [' Zero quer dizer que a quota não mudou.', ' Zero means the share did not change.']].map(([pt, en]) =>
    inteira(diz(pt, en, O('eurostat-tipsbp60-descricao', 'developments in shares of exports'), L('unit', 'variação em três anos')))),
  TETO('uma perda de mais de ', 'a loss of more than ', O('pdm-exportacoes', 'with a threshold of -3%')),
  TETO(' % em três anos', ' % over three years', O('pdm-exportacoes', '(3-year percentage change)')),
]);

medida('divida-das-empresas-2025', ['eurostat-tipspd30-descricao', 'eurostat-tipspd30', 'pdm-divida-das-empresas', 'painel-pdm', 'eurostat-tipsna40-descricao'], [
  folha(
    diz('É o que as empresas devem', 'It is what companies owe', O('eurostat-tipspd30-descricao', 'the stock of debt of the sector non-financial corporations')),
    diz(' em empréstimos e títulos de dívida', ' in loans and debt securities', O('eurostat-tipspd30-descricao', 'Debt securities (F.3) and Loans (F.4)')),
    diz(', fora as financeiras, ', ', excluding financial companies, ', O('eurostat-tipspd30', 'Non-financial corporations debt')),
  ),
  TETO('uma dívida acima de ', 'debt above ', O('pdm-divida-das-empresas', 'NFC consolidated debt in % of GDP with a threshold of 85%')),
  TETO(' % do PIB', ' % of GDP', O('pdm-divida-das-empresas', 'in % of GDP')),
]);

medida('divida-das-familias-2025', ['eurostat-tipspd22-descricao', 'glossario-npish', 'pdm-divida-das-familias', 'painel-pdm', 'eurostat-tipsna40-descricao'], [
  folha(
    diz('É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem', 'It is what households and non-profit institutions serving them owe',
      O('eurostat-tipspd22-descricao', 'the stock of liabilities held by the sector Households and Non-Profit institutions serving households'),
      O('glossario-npish', 'Non-profit institutions serving households')),
    diz(' em empréstimos e títulos de dívida, ', ' in loans and debt securities, ', O('eurostat-tipspd22-descricao', 'Debt securities (F.3) and Loans (F.4)')),
  ),
  TETO('uma dívida acima de ', 'debt above ', O('pdm-divida-das-familias', 'household (incl. NPISH) consolidated debt in % of GDP with a threshold of 55%')),
  TETO(' % do PIB', ' % of GDP', O('pdm-divida-das-familias', 'in % of GDP')),
]);

medida('fluxo-de-credito-as-empresas-2025', ['eurostat-tipspc30-descricao', 'pdm-credito-as-empresas', 'painel-pdm'], [
  folha(
    diz('É quanto crédito as empresas contraíram num ano', 'It is how much credit companies took on in a year', O('eurostat-tipspc30-descricao', 'the net amount of liabilities incurred during the year')),
    diz(', em termos líquidos', ', net', O('eurostat-tipspc30-descricao', 'the net amount of liabilities')),
    diz(', fora as financeiras', ', excluding financial companies', O('eurostat-tipspc30-descricao', 'non-financial corporations sector (S.11)')),
    diz(' e sem contar o investimento direto estrangeiro', ' and foreign direct investment', O('eurostat-tipspc30-descricao', 'excluding foreign direct investment (FDI)')),
    diz(', em percentagem da dívida que já tinham no fim do ano anterior.', ', as a percentage of the debt they already had at the end of the previous year.',
      O('eurostat-tipspc30-descricao', 'expressed as a percentage of the corresponding stocks (excluding FDI) at the end of the previous year')),
  ),
  TETO('um fluxo acima de ', 'a flow above ', O('pdm-credito-as-empresas', 'with a threshold of 13%')),
]);

medida('fluxo-de-credito-as-familias-2025', ['eurostat-tipspc40-descricao', 'pdm-credito-as-familias', 'painel-pdm'], [
  folha(
    diz('É quanto crédito as famílias e as instituições sem fim lucrativo ao seu serviço contraíram num ano',
      'It is how much credit households and non-profit institutions serving them took on in a year',
      O('eurostat-tipspc40-descricao', 'the net amount of liabilities which the sectors Households and Non-Profit institutions serving households (S.14_S.15) have incurred during the year')),
    diz(', em termos líquidos', ', net', O('eurostat-tipspc40-descricao', 'the net amount of liabilities')),
    diz(', em percentagem da dívida que já tinham no fim do ano anterior.', ', as a percentage of the debt they already had at the end of the previous year.',
      O('eurostat-tipspc40-descricao', 'in percentage of the related stocks at the end of the previous year')),
  ),
  TETO('um fluxo acima de ', 'a flow above ', O('pdm-credito-as-familias', 'with a threshold of 14%')),
]);

const LIMITE = 'indice-de-divida-limite-legal';
medida('camaras', [], [
  folha(
    diz('Uma câmara acima do limite legal deve mais do que a lei lhe permite dever.', 'A council above the legal limit owes more than the law allows it to owe.',
      L('excerpt', 'Índice de divida total (Índice permitido <= 150%)', LIMITE), L('document.locator', 'LIMITE À DÍVIDA TOTAL — LEI 73/2013 (ART. 52º)', LIMITE)),
    liga(' Em ', ' In '),
  ),
  inteira(liga(' eram ', ' there were ')),
  inteira(liga(' em ', ' in ')),
  inteira(liga('; ', '; ')),
  inteira(conta(' não tem valor publicado.', ' has no published value.')),
]);

medida('taxa-de-emprego-2025', ['glossario-emprego'], [
  inteira(diz('É a parte das pessoas dos ', 'It is the share of people aged ',
    O('glossario-emprego', 'The employment rate is the percentage of employed persons in relation to the comparable total population.'), L('unit', '% da população'))),
  inteira(diz(' anos que tem emprego.', ' who are employed.', O('glossario-emprego', 'percentage of employed persons'), L('excerpt', 'Age class: From 20 to 64 years'))),
], [ALG('20', L('excerpt', 'From 20 to 64 years')), ALG('64', L('excerpt', 'From 20 to 64 years'))]);

medida('taxa-de-desemprego-mip-2025', ['eurostat-tipsun20-descricao', 'glossario-desemprego', 'glossario-atividade', 'painel-pdm'], [
  inteira(diz('É a parte das pessoas dos ', 'It is the share of people aged ',
    O('eurostat-tipsun20-descricao', 'the number of unemployed persons as a percentage of the labour force'), L('unit', '% da população ativa'))),
  TETO('uma taxa acima de ', 'a rate above ', O('eurostat-tipsun20-descricao', 'The indicative threshold of the indicator is 10%.')),
], [ALG('15', L('excerpt', 'From 15 to 74 years')), ALG('74', L('excerpt', 'From 15 to 74 years'))]);

medida('taxa-de-desemprego-2025', ['glossario-desemprego', 'glossario-atividade'], [
  inteira(diz('É a parte das pessoas dos ', 'It is the share of people aged ',
    O('glossario-desemprego', 'the number of people unemployed as a percentage of the labour force'), L('unit', '% da população ativa'))),
], [ALG('15', L('excerpt', 'From 15 to 74 years')), ALG('74', L('excerpt', 'From 15 to 74 years'))]);

medida('ganho-medio-mensal-2024', ['ine-ganho-nota', 'ine-ganho-conceito'], [
  folha(
    diz('É o que um trabalhador por conta de outrem a tempo completo', 'It is what a full-time employee', O('ine-ganho-nota', 'trabalhadores por conta de outrem a tempo completo')),
    diz(' ganhou por mês, em média', ' earned per month, on average', L('document.title', 'Ganho médio mensal')),
    liga(', em ', ', in '),
  ),
  folha(
    diz(', com o que lhe é pago com caráter regular pelas horas normais e extraordinárias', ', including what is paid on a regular basis for normal and overtime hours',
      O('ine-ganho-conceito', 'pago ao trabalhador com caráter regular'), O('ine-ganho-conceito', 'no período normal e extraordinário')),
    diz(', antes de descontos.', ', before deductions.', O('ine-ganho-conceito', 'Montante ilíquido')),
  ),
]);

const GPG = 'eurostat-earn-grgpg2-definicao';
const GPG_COBERTURA = 'eurostat-earn-grgpg2-cobertura';
medida('disparidade-salarial-entre-sexos-2024', [GPG, GPG_COBERTURA], [
  folha(
    diz('Por cada hora de trabalho', 'Per hour worked', O(GPG, 'average gross hourly earnings')),
    diz(', as mulheres ganharam em média menos do que os homens', ', women earned on average less than men',
      O(GPG, 'the difference between average gross hourly earnings of male paid employees and of female paid employees')),
    diz(': a diferença foi de ', ': the gap was ', O(GPG, 'represents the difference between')),
  ),
  folha(diz(' do ganho dos homens', ' of men’s earnings', O(GPG, 'as a percentage of average gross hourly earnings of male paid employees')), liga(', em ', ', in ')),
  inteira(diz(', nas empresas com ', ', in enterprises with ', O(GPG_COBERTURA, 'only enterprises with 10 employees or more'))),
  inteira(diz(' ou mais trabalhadores.', ' or more employees.', O(GPG_COBERTURA, '10 employees or more'))),
], [ALG('10', O(GPG_COBERTURA, 'only enterprises with 10 employees or more'))]);

medida('retribuicao-minima-mensal-garantida-continente-2026', ['dl-139-2025-preambulo', 'dre-dlr-37-2023-a', 'dl-139-2025-ambito', 'dl-139-2025-vigor'], [
  folha(
    diz('É o salário mínimo nacional', 'It is the national minimum wage', O('dl-139-2025-preambulo', 'aumento do salário mínimo'), O('dre-dlr-37-2023-a', 'estabelecido ao nível nacional')),
    diz(': o valor mensal mínimo que a lei garante', ': the lowest monthly pay the law guarantees', O('dl-139-2025-preambulo', 'retribuição mínima mensal garantida (RMMG)')),
    diz(' a quem trabalha por conta de outrem', ' to employees', O('dre-dlr-37-2023-a', 'para os trabalhadores por conta de outrem')),
    diz(', em vigor no continente', ', in force on the mainland', O('dl-139-2025-ambito', 'aplicável a todo o território continental'), O('dl-139-2025-vigor', 'produz efeitos no dia 1 de janeiro de 2026')),
    liga(' em ', ' in '),
  ),
]);

medida('desemprego-de-longa-duracao-2025', ['eurostat-tesem130-denominador', 'glossario-atividade', 'glossario-longa-duracao'], [
  inteira(diz('É a parte das pessoas dos ', 'It is the share of people aged ',
    O('eurostat-tesem130-denominador', 'as a percentage of the active population of the same age'), L('unit', '% da população ativa'))),
  folha(
    diz(' anos, entre as que trabalham ou procuram trabalho', ', among those who work or are looking for work',
      O('eurostat-tesem130-denominador', 'the active population of the same age'), O('glossario-atividade', 'comprises employed and unemployed persons')),
    diz(', que está sem emprego e o procura há um ano ou mais.', ', who are out of work and have been looking for a year or more.',
      O('glossario-longa-duracao', 'out of work and have been actively seeking employment for at least a year')),
  ),
], [ALG('15', O('eurostat-tesem130-denominador', 'aged 15-74')), ALG('74', O('eurostat-tesem130-denominador', 'aged 15-74'))]);

medida('jovens-nem-2025', ['glossario-nem'], [
  inteira(diz('É a parte dos jovens dos ', 'It is the share of young people aged ',
    O('glossario-nem', 'the percentage of the population of a given age group and sex'), L('unit', '% da população'))),
  inteira(diz(' anos que não trabalha, não estuda nem está em formação.', ' who are not working, not studying and not in training.',
    O('glossario-nem', 'who is not employed and not involved in further education or training'))),
], [ALG('15', L('excerpt', 'From 15 to 29 years')), ALG('29', L('excerpt', 'From 15 to 29 years'))]);

medida('disparidade-de-emprego-entre-sexos-2025', ['eurostat-tesem060-descricao'], [
  inteira(diz('É a diferença entre a percentagem de homens dos ', 'It is the difference between the percentage of men aged ',
    O('eurostat-tesem060-descricao', 'the difference between the employment rates of men and women'))),
  inteira(diz(' anos com emprego e a percentagem de mulheres com emprego.', ' in employment and the percentage of women in employment.',
    O('eurostat-tesem060-descricao', 'the employment rates of men and women aged 20-64'))),
], [ALG('20', O('eurostat-tesem060-descricao', 'aged 20-64')), ALG('64', O('eurostat-tesem060-descricao', 'aged 20-64'))]);

medida('taxa-de-actividade-2025', ['glossario-atividade', 'pdm-taxa-de-actividade', 'eurostat-tipslm60-descricao', 'painel-pdm'], [
  inteira(diz('É quanto mudou em três anos, em pontos percentuais, a parte da população que está ativa: a trabalhar ou à procura de trabalho.',
    'It is how much the share of the population that is active, working or looking for work, changed over three years, in percentage points.',
    O('glossario-atividade', 'Activity rate is the percentage of active persons in relation to the comparable total population.'),
    O('glossario-atividade', 'The economically active population comprises employed and unemployed persons.'),
    O('pdm-taxa-de-actividade', '3-year change in pps'), L('unit', 'variação em três anos, pontos percentuais'))),
  inteira(diz(' Positiva quer dizer que a parte ativa cresceu.', ' Positive means the active share grew.', L('unit', 'variação em três anos, pontos percentuais'))),
  inteira(diz(' Negativa quer dizer que a parte ativa encolheu.', ' Negative means the active share shrank.', L('unit', 'variação em três anos, pontos percentuais'))),
  TETO('uma descida de mais de ', 'a fall of more than ', O('eurostat-tipslm60-descricao', 'with an indicative threshold of -0.2 pp'), O('pdm-taxa-de-actividade', 'with a threshold of -0.2%')),
  TETO(' pontos em três anos', ' points over three years', O('eurostat-tipslm60-descricao', 'The MIP Scoreboard indicator is the three-year change in percentage points')),
]);

const NULC = 'eurostat-tipslm10-descricao';
medida('custo-unitario-do-trabalho-2025', [NULC, 'pdm-custo-do-trabalho', 'painel-pdm'], [
  folha(
    diz('É quanto subiu em três anos o custo do trabalho por cada unidade produzida', 'It is how much the cost of labour per unit produced rose over three years',
      O(NULC, 'the ratio of labour cost to labour productivity'), O(NULC, 'The MIP Scoreboard indicator is the 3-year percentage change.')),
    diz(': o que se paga pelo trabalho a dividir pelo que ele produz.', ': what is paid for labour divided by what it produces.',
      O(NULC, 'labour cost is the ratio of compensation of employees'), O(NULC, 'labour productivity is the ratio of gross domestic product')),
  ),
  inteira(diz(' Negativo quer dizer que desceu.', ' Negative means it fell.', O(NULC, 'The MIP Scoreboard indicator is the 3-year percentage change.'))),
  TETO('uma subida acima de ', 'a rise above ', O('pdm-custo-do-trabalho', 'with thresholds of +9% for euro area countries')),
  TETO(' % em três anos', ' % over three years', O('pdm-custo-do-trabalho', '(3-year percentage change)')),
]);

medida('risco-de-pobreza-ou-exclusao-2025', ['glossario-arope', 'eurostat-tipslc10-descricao'], [
  inteira(diz('É a parte da população que está em pelo menos uma de três situações: rendimento abaixo de ',
    'It is the share of the population in at least one of three situations: income below ',
    O('glossario-arope', 'The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.'),
    O('glossario-arope', 'the sum of persons who are either at risk of poverty, or severely materially and socially deprived or living in a household with a very low work intensity'),
    O('eurostat-tipslc10-descricao', 'with an equalised disposable income below the risk-of-poverty threshold'))),
  folha(
    diz(' % do rendimento mediano do país', ' % of the country’s median income', O('eurostat-tipslc10-descricao', 'of the national median equalised disposable income')),
    diz(', privação material e social grave', ', severe material and social deprivation', O('glossario-arope', 'severely materially and socially deprived')),
    diz(', ou viver num agregado onde quase ninguém trabalha', ', or living in a household where almost no one works', O('glossario-arope', '(quasi-)jobless households')),
    diz('; cada pessoa conta uma só vez.', '; each person counts only once.', O('glossario-arope', 'People are included only once')),
  ),
], [ALG('60', O('eurostat-tipslc10-descricao', 'set at 60 % of the national median'))]);

medida('racio-s80-s20-2025', ['glossario-s80s20'], [
  inteira(liga('Os ', 'The ')),
  inteira(diz(' % da população com mais rendimento recebem, no total, ', ' % of the population with the highest income receive, in total, ',
    O('glossario-s80s20', 'the ratio of total income received by the 20 % of the population with the highest income'))),
  inteira(diz(' vezes o que recebem os ', ' times what the ', O('glossario-s80s20', 'calculated as the ratio of total income'))),
  inteira(diz(' % com menos rendimento.', ' % with the lowest income receive.', O('glossario-s80s20', 'to that received by the 20 % of the population with the lowest income'))),
], [ALG('20', O('glossario-s80s20', 'the 20 % of the population with the highest income')), ALG('20', O('glossario-s80s20', 'the 20 % of the population with the lowest income'))]);

medida('abandono-escolar-precoce-2025', ['glossario-abandono'], [
  inteira(diz('É a parte das pessoas dos ', 'It is the share of people aged ', O('glossario-abandono', 'expressed as a percentage of the people aged 18 to 24'))),
  inteira(diz(' anos que não foi além do ensino básico e já não estuda nem está em formação.',
    ' who went no further than lower secondary education and are no longer studying or in training.',
    O('glossario-abandono', 'has completed at most lower secondary education and is not involved in further education or training'))),
], [ALG('18', O('glossario-abandono', 'a person aged 18 to 24')), ALG('24', O('glossario-abandono', 'a person aged 18 to 24'))]);

const DSI = 'eurostat-tepsr_sp410-descricao';
medida('competencias-digitais-2025', [DSI], [
  folha(
    diz('É a parte das pessoas com pelo menos competências digitais básicas', 'It is the share of people with at least basic digital skills',
      L('document.title', 'Individuals who have basic or above basic overall digital skills'), L('unit', '% dos indivíduos')),
    diz(': saber procurar informação, comunicar, criar conteúdos, proteger-se e resolver problemas',
      ': knowing how to find information, communicate, create content, stay safe and solve problems',
      O(DSI, 'five specific areas (Information and data literacy, Communication and collaboration, Digital content creation, Safety, and Problem solving)')),
    diz(' no uso da internet e de programas informáticos.', ' when using the internet or software.', O(DSI, 'activities related to internet or software use')),
  ),
]);

medida('criancas-em-creche-2025', ['eurostat-tepsr_sp210-descricao', 'eurostat-cuidado-formal'], [
  inteira(diz('É a parte das crianças com menos de ', 'It is the share of children under ', O('eurostat-tepsr_sp210-descricao', 'the percentage of children (under 3 years old)'))),
  inteira(diz(' anos que está numa creche ou noutro cuidado formal.', ' who are in a nursery or other formal childcare.',
    O('eurostat-tepsr_sp210-descricao', 'cared for by formal arrangements other than by the family'),
    O('eurostat-cuidado-formal', 'Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies'),
    L('document.title', 'in formal childcare'))),
], [ALG('3', L('document.title', 'Children aged less than 3 years'))]);

const UNMET = 'eurostat-tespm110-descricao';
medida('necessidades-medicas-nao-satisfeitas-2025', [UNMET], [
  folha(
    diz('É a parte das pessoas que diz ter precisado de um médico e não o ter tido', 'It is the share of people who say they needed medical care and did not get it',
      O(UNMET, 'own assessment of whether he or she needed examination or treatment'), O(UNMET, 'did not have it or did not seek it'),
      O(UNMET, 'provided by or under direct supervision of medical doctors')),
    diz(', por ser caro, por a espera ser longa ou por ficar longe.', ', because it was too expensive, the wait too long or too far away.',
      O(UNMET, '‘Financial reasons’, ‘Waiting list’ and ‘Too far to travel’')),
  ),
]);

medida('sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', ['eurostat-tessi164-inquilinos', 'glossario-sobrecarga'], [
  folha(
    diz('Entre as pessoas que vivem em casa arrendada a preço de mercado', 'Among people living in a home rented at market price', O('eurostat-tessi164-inquilinos', 'Tenant, rent at market price')),
    diz(', é a parte cujo agregado gasta mais de ', ', it is the share whose household spends more than ',
      O('glossario-sobrecarga', 'the percentage of the population living in households where the total housing costs')),
  ),
], [ALG('40', O('glossario-sobrecarga', 'more than 40 % of disposable income'))]);

medida('sobrecarga-do-custo-da-habitacao-2025', ['eurostat-tespm140-populacao', 'eurostat-tessi164-regimes', 'glossario-sobrecarga', 'ce-swd-2026-222-habitacao'], [
  folha(
    diz('No total de todos os regimes de ocupação', 'Across all tenure statuses', O('eurostat-tespm140-populacao', 'Percentage of the population living in a household')),
    diz(' (casa própria com ou sem crédito, arrendada a preço de mercado ou a renda reduzida ou gratuita)',
      ' (owned with or without a mortgage, rented at market price or at a reduced rent or free)',
      O('eurostat-tessi164-regimes', '"OWN_L":"Owner, with mortgage or loan","OWN_NL":"Owner, no outstanding mortgage or housing loan","RENT_MKT":"Tenant, rent at market price","RENT_FR":"Tenant, rent at reduced price or free"')),
    diz(', é a parte das pessoas cujo agregado gasta mais de ', ', it is the share of people whose household spends more than ',
      O('glossario-sobrecarga', 'the percentage of the population living in households where the total housing costs')),
  ),
  inteira(diz(' Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.',
    ' This total mixes very different situations, and the European Commission says it should be read together with the tenure structure.',
    O('ce-swd-2026-222-habitacao', 'The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.'))),
], [ALG('40', O('glossario-sobrecarga', 'more than 40 % of disposable income'))]);

const HPI = 'eurostat-tipsho20-descricao';
medida('precos-da-habitacao-2025', [HPI, 'painel-pdm'], [
  inteira(diz(' os preços das casas compradas pelas famílias subiram ', ' the prices of homes bought by households rose ', O(HPI, 'price changes of all residential properties purchased by households'))),
  inteira(diz(' os preços das casas compradas pelas famílias desceram: ', ' the prices of homes bought by households fell: ', O(HPI, 'price changes of all residential properties purchased by households'))),
  inteira(diz(' em média.', ' on average.', L('unit', 'variação anual média'))),
  inteira(diz(' os preços das casas compradas pelas famílias não mudaram em média.', ' the prices of homes bought by households did not change on average.',
    O(HPI, 'price changes of all residential properties purchased by households'), L('unit', 'variação anual média'))),
  inteira(conta('A variação é maior do que a de', 'The change is larger than in')),
  inteira(conta('A variação é menor do que a de', 'The change is smaller than in')),
  inteira(conta('A variação é igual à de', 'The change is the same as in')),
  TETO('uma subida acima de ', 'a rise above ', O(HPI, 'The indicative threshold of the indicator is 9%.')),
  TETO(' % num ano', ' % in a year', O(HPI, 'the 1-year percentage change of the HPI')),
]);

const PERMITS = 'eurostat-tipsho50-descricao';
medida('licencas-de-construcao-2025', [PERMITS], [
  folha(
    diz('É a área de habitação nova licenciada num ano', 'It is the floor area of new housing permitted in a year',
      O(PERMITS, 'granted building permits in one year'), O(PERMITS, 'the creation of new residential buildings')),
    diz(', em metros quadrados por cada ', ', in square metres per ', O(PERMITS, 'expressed in square meters of usable floor area per 1000 inhabitants')),
  ),
  folha(
    diz(' habitantes', ' inhabitants', L('unit', 'por 1000 habitantes')),
    diz(': quanto mais alta, mais construção de casas foi autorizada.', ': the higher it is, the more housing construction was authorised.',
      O(PERMITS, 'Builders apply for building permits and local building administrations issue them')),
  ),
], [ALG('1000', L('unit', 'm² por 1000 habitantes'))]);

medida('formacao-bruta-de-capital-fixo-2025', ['eurostat-glossario-fbcf', 'eurostat-tipsna20-descricao', 'eurostat-tipsna40-descricao'], [
  folha(
    diz('É o que os produtores residentes compraram num ano, descontado o que venderam', 'It is what resident producers acquired in a year, less what they disposed of',
      O('eurostat-glossario-fbcf', 'consists of resident producers’ acquisitions, less disposals, of fixed assets during a given period'), ANO),
    diz(', em bens que duram mais de um ano', ', in assets that last more than a year', O('eurostat-glossario-fbcf', 'used repeatedly, or continuously, for more than one year')),
    diz(', como edifícios, máquinas e programas informáticos, ', ', such as buildings, machinery and software, ',
      O('eurostat-tipsna20-descricao', 'buildings, structures, machinery and equipment, mineral exploration, computer software')),
  ),
]);

medida('despesa-em-id-2024', ['eurostat-glossario-gerd', 'eurostat-tipsna40-descricao'], [
  folha(
    diz('É o que se gastou no país em investigação e desenvolvimento num ano', 'It is what was spent in the country on research and development in a year',
      L('document.title', 'Gross domestic expenditure on research and development (R&D)'), ANO),
    diz(', pelas empresas, pelo Estado, pelo ensino superior e pelas instituições sem fins lucrativos, ', ', by companies, the State, higher education and non-profit institutions, ',
      O('eurostat-glossario-gerd', 'by business enterprises, higher education institutions, as well as government and private non-profit organisations')),
  ),
]);

const SDG = 'eurostat-sdg_16_40-descricao';
medida('independencia-da-justica-2025', [SDG, 'eurostat-sdg_16_40-nivel'], [
  folha(
    diz('É a parte das pessoas que, num inquérito europeu,', 'It is the share of people who, in a European survey,', O(SDG, 'annual Flash Eurobarometer surveys'), O(SDG, 'respondents’ perceptions')),
    diz(' considera a independência dos tribunais e dos juízes do seu país', ' rate the independence of their country’s courts and judges',
      O(SDG, 'the perceived independence of the courts and judges in a country')),
    diz(' muito boa ou razoavelmente boa.', ' as very good or fairly good.', O('eurostat-sdg_16_40-nivel', 'Very good or fairly good')),
  ),
]);

/* ------------------------------------------------ escrever e conferir */
const auditoria = {
  schema: 1,
  o_que_e:
    'A auditoria das leituras dos cartões nacionais, folha a folha, nas duas edições (bloco L1, item 4). Cada folha de texto de cada leitura declarada em src/data/leituras-das-medidas.mjs divide-se em partes, e cada parte tem uma classe: «diz» (diz o que a medida é, o que o seu sinal quer dizer, ou de quem é o valor de referência e o que ele é) com o literal que a apoia, num campo de uma origem declarada em ORIGENS_DAS_DEFINICOES (excerto, excertoEn, documento ou publicador) ou num campo selado da linha da própria medida (excerpt, unit, document.title, document.locator; reference_date só para dizer que o período é um ano); «conta» (as palavras de uma comparação ou de um veredicto que a máquina escolhe sobre valores selados, que não precisam de origem); «liga» (pontuação e palavras de ligação de uma lista fechada). As folhas partilhadas por várias leituras estão em «comuns»; um apoio em «linha: propria» lê-se na linha de cada medida que usa a folha. Cada algarismo declarado com «nl» tem o seu literal em «algarismos». A célula K17 do check:cartao confere que as partes juntas são cada folha, que cada literal está mesmo no campo que cita, que cada «conta» está onde a máquina escolhe, e que cada origem da lista de uma medida apoia uma parte dela. Não infere que o literal quer dizer o que a parte diz: isso é uma leitura, e é de quem a assina.',
  leituras: [
    { quem: 'Claude Opus 5.5', quando: '2026-09-24', o_que: 'primeira leitura, sobre as origens pedidas neste bloco e as já declaradas, com os acertos A1 a A15 às palavras fixas' },
  ],
  comuns: COMUNS,
  medidas: Object.values(M),
};
const erros = conferirAuditoriaDasLeituras({ auditoria });
if (erros.erros.length) {
  console.error(`a auditoria não passa na K17 (${erros.erros.length}):\n  ${erros.erros.join('\n  ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(RAIZ, 'tests/cartao/leituras-provadas.json'), JSON.stringify(auditoria, null, 2) + '\n');
console.log(`escrita: ${Object.keys(M).length} medidas, ${COMUNS.length} folhas comuns; ${JSON.stringify(erros.contas)}`);
