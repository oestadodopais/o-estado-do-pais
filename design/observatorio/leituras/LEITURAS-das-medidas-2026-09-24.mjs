/**
 * ===========================================================================
 * A LEITURA DE CADA MEDIDA NACIONAL · as 36 leituras, escritas pelo lugar de
 * direção (Claude Fable 5.1) a 24.09.2026 para o bloco L1 (a regra do diretor
 * de 23.09.2026, I150, §1.129: cada conteúdo diz o que significa para uma
 * pessoa sem conhecimento do assunto, ou não está acabado)
 * ===========================================================================
 *
 * ESTE FICHEIRO É O TEXTO DO LUGAR DE DIREÇÃO, E O CONSTRUTOR LEVA-O PARA
 * `src/data/leituras-das-medidas.mjs` sem lhe mudar uma palavra fixa, salvo
 * onde a auditoria das origens (a célula K17, pela forma da K16) mostrar que um
 * literal de origem diz a coisa por outras palavras: aí o construtor acerta as
 * palavras pelo literal, e o relatório diz cada acerto, palavra a palavra.
 *
 * A GRAMÁTICA DE UMA LEITURA. Uma leitura é uma lista de pedaços, na gramática
 * de `Frase.astro` mais cinco pedaços calculados, que o resolvedor
 * (`src/lib/leitura-da-medida.mjs`) achata numa lista plana antes de render:
 *
 *   'palavras'                          as palavras fixas do lugar de direção; nunca um algarismo
 *   { claim: 'proprio'|'anterior'|'ue', sufixo? }
 *                                       um valor selado: a linha do cartão, a do período
 *                                       anterior ou a da União, as mesmas que a régua cita
 *                                       (`reguaDaMedida()`, com a União calada onde
 *                                       `semMediaEuropeia` a cala); rende por `<Claim>` sem
 *                                       marca própria, dentro do invólucro `data-selo-em`
 *   { periodo: 'proprio'|'anterior' }   o `reference_date` dessa linha, pela `DataDaLinha`
 *   { referencia: 'unico'|'inferior'|'superior', semSinal? }
 *                                       o algarismo declarado do valor de referência
 *                                       (`REFERENCIAS_DAS_MEDIDAS`), com
 *                                       `data-nonledger="limiar-do-quadro"`; `semSinal`
 *                                       escreve o módulo, porque a frase já diz o lado
 *   { prova: 'chave' }                  uma chave da prova (o cartão das câmaras)
 *   { nl: '40', motivo: '…' }           outro algarismo declarado, com o literal de origem na
 *                                       auditoria (a K17), como nas perguntas
 *   { sinal: { positivo: [...], negativo: [...], zero: [...] } }
 *                                       o ramo pelo sinal do valor da linha do cartão
 *   { compara: 'anterior'|'ue', maior: [...], menor: [...], igual: [...] }
 *                                       o ramo pela comparação numérica do valor do cartão
 *                                       com a linha da régua; NADA quando a linha não existe
 *   { estado: { fora: [...], dentro: [...] } }
 *                                       o ramo por `estadoDaMedida()` contra a referência
 *                                       declarada; NADA sem referência
 *   { comparacao: { acima: [...], abaixo: [...], entre: [...], igual: [...] } }
 *                                       o ramo por `comparacaoComOLimiar()`; `entre` é o valor
 *                                       dentro de uma banda, `igual` é o valor no limite
 *
 * Os ramos aninham-se. Cada comparação é uma frase inteira, para que a ausência
 * de uma linha não deixe uma frase a meio. As palavras que dizem o que a
 * medida é apoiam-se num literal de origem selada (a auditoria da K17); as
 * comparações e os veredictos são calculados dos valores selados e nunca
 * escritos; a leitura não julga o que nenhuma fonte julgou: onde não há valor
 * de referência, compara e não diz «bem» nem «mal».
 *
 * O vocabulário é o do §6 da estrutura: «valor de referência» e nunca «limiar»
 * fora da citação da linha de pobreza, que a fonte chama assim; «habitação» e
 * «casa» só como habitação; nada sobre o projeto. Sem travessões.
 */

/** «Subiu face a 2024.» / «Desceu face a 2024.» / «Ficou igual a 2024.» */
const anterior = (maior, menor, igual) => ({
  compara: 'anterior',
  maior: [' ', maior, ' ', { periodo: 'anterior' }, '.'],
  menor: [' ', menor, ' ', { periodo: 'anterior' }, '.'],
  igual: [' ', igual, ' ', { periodo: 'anterior' }, '.'],
});
/** Uma frase inteira por ramo, contra a média da União. */
const uniao = (maior, menor, igual) => ({ compara: 'ue', maior: [' ', maior], menor: [' ', menor], igual: [' ', igual] });

const SUBIU = anterior('Subiu face a', 'Desceu face a', 'Ficou igual a');
const ROSE = anterior('Up from', 'Down from', 'Unchanged from');
const PESA = anterior('Pesa mais do que em', 'Pesa menos do que em', 'Pesa o mesmo que em');
const WEIGHS = anterior('It weighs more than in', 'It weighs less than in', 'It weighs the same as in');
const VARIACAO = anterior('A variação em três anos é maior do que a medida em', 'A variação em três anos é menor do que a medida em', 'A variação em três anos é igual à medida em');
const CHANGE = anterior('The three-year change is larger than the one measured in', 'The three-year change is smaller than the one measured in', 'The three-year change is the same as the one measured in');
const DIFERENCA = anterior('A diferença cresceu face a', 'A diferença encolheu face a', 'A diferença ficou igual à de');
const GAP = anterior('The gap widened from', 'The gap narrowed from', 'The gap was unchanged from');
const MEDIA_UE = uniao('Está acima da média da União Europeia.', 'Está abaixo da média da União Europeia.', 'Está ao nível da média da União Europeia.');
const EU_AVERAGE = uniao('Above the European Union average.', 'Below the European Union average.', 'Level with the European Union average.');
const VARIACAO_UE = uniao('A variação é maior do que a da União Europeia.', 'A variação é menor do que a da União Europeia.', 'A variação é igual à da União Europeia.');
const CHANGE_EU = uniao('The change is larger than the European Union’s.', 'The change is smaller than the European Union’s.', 'The change is the same as the European Union’s.');
const DIFERENCA_UE = uniao('É maior do que na média da União Europeia.', 'É menor do que na média da União Europeia.', 'É igual à da média da União Europeia.');
const GAP_EU = uniao('It is wider than the European Union average.', 'It is narrower than the European Union average.', 'It is the same as the European Union average.');

/** «Para a Comissão Europeia, … é sinal de possível desequilíbrio: Portugal está …» */
const TETO_PT = (antes, dentro = 'abaixo ou no limite.') => [' Para a Comissão Europeia, ', ...antes, ' é sinal de possível desequilíbrio: Portugal está ', { estado: { fora: ['acima.'], dentro: [dentro] } }];
const TETO_EN = (antes, dentro = 'at or below it.') => [' For the European Commission, ', ...antes, ' is a sign of a possible imbalance: Portugal is ', { estado: { fora: ['above it.'], dentro: [dentro] } }];
const CHAO_PT = (antes) => [' Para a Comissão Europeia, ', ...antes, ' é sinal de possível desequilíbrio: Portugal está ', { estado: { fora: ['abaixo desse valor.'], dentro: ['acima desse valor.'] } }];
const CHAO_EN = (antes) => [' For the European Commission, ', ...antes, ' is a sign of a possible imbalance: Portugal is ', { estado: { fora: ['below that value.'], dentro: ['above that value.'] } }];
const PIB_PT = ' % do PIB, o valor de tudo o que o país produz num ano.';
const PIB_EN = ' % of GDP, the value of everything the country produces in a year.';
const PERCENTAGEM_DO_PIB_PT = 'em percentagem do PIB, o valor de tudo o que o país produz num ano.';
const PERCENTAGEM_DO_PIB_EN = 'as a percentage of GDP, the value of everything the country produces in a year.';

export const LEITURAS_DAS_MEDIDAS = {
  /* ------------------------------------------------- 1 · Economia e finanças públicas */
  'pib-real-per-capita-2025': {
    pt: ['É o valor de tudo o que o país produziu no ano, por habitante, medido a preços de um ano fixo para se poder comparar entre anos.', SUBIU, MEDIA_UE],
    en: ['It is the value of everything the country produced in the year, per inhabitant, measured at the prices of a fixed year so that years can be compared.', ROSE, EU_AVERAGE],
  },
  'saldo-das-administracoes-publicas-2025': {
    pt: [
      { sinal: {
        positivo: ['Em ', { periodo: 'proprio' }, ' as administrações públicas (o Estado, as regiões autónomas, as câmaras e a segurança social) receberam mais do que gastaram: um excedente de ', { claim: 'proprio' }, PIB_PT],
        negativo: ['Em ', { periodo: 'proprio' }, ' as administrações públicas (o Estado, as regiões autónomas, as câmaras e a segurança social) gastaram mais do que receberam: o saldo foi de ', { claim: 'proprio' }, PIB_PT],
        zero: ['Em ', { periodo: 'proprio' }, ' as administrações públicas (o Estado, as regiões autónomas, as câmaras e a segurança social) gastaram tanto quanto receberam.'],
      } },
      anterior('O saldo subiu face a', 'O saldo desceu face a', 'O saldo ficou igual ao de'),
      ' O Pacto de Estabilidade e Crescimento não deixa o défice passar de ', { referencia: 'unico', semSinal: true }, ' % do PIB: Portugal ', { estado: { dentro: ['cumpre.'], fora: ['não cumpre.'] } },
    ],
    en: [
      { sinal: {
        positivo: ['In ', { periodo: 'proprio' }, ' general government (the State, the autonomous regions, the municipalities and social security) took in more than it spent: a surplus of ', { claim: 'proprio' }, PIB_EN],
        negativo: ['In ', { periodo: 'proprio' }, ' general government (the State, the autonomous regions, the municipalities and social security) spent more than it took in: the balance was ', { claim: 'proprio' }, PIB_EN],
        zero: ['In ', { periodo: 'proprio' }, ' general government (the State, the autonomous regions, the municipalities and social security) spent exactly what it took in.'],
      } },
      anterior('The balance rose from', 'The balance fell from', 'The balance was unchanged from'),
      ' The Stability and Growth Pact does not allow the deficit to exceed ', { referencia: 'unico', semSinal: true }, ' % of GDP: Portugal ', { estado: { dentro: ['complies.'], fora: ['does not comply.'] } },
    ],
  },
  'divida-publica-2025': {
    pt: ['É tudo o que as administrações públicas devem, ', PERCENTAGEM_DO_PIB_PT, PESA, MEDIA_UE, ...TETO_PT(['uma dívida acima de ', { referencia: 'unico' }, ' % do PIB'])],
    en: ['It is everything general government owes, ', PERCENTAGEM_DO_PIB_EN, WEIGHS, EU_AVERAGE, ...TETO_EN(['debt above ', { referencia: 'unico' }, ' % of GDP'])],
  },
  'crescimento-da-despesa-liquida-2025': {
    pt: [
      'É quanto cresceu num ano a despesa pública que o Governo controla: a despesa líquida, que não conta os juros da dívida, a despesa paga por fundos europeus nem a que sobe e desce com o desemprego, apurada pelo Conselho das Finanças Públicas.',
      anterior('Cresceu mais do que em', 'Cresceu menos do que em', 'Cresceu o mesmo que em'),
      ' Portugal comprometeu-se com o Conselho da União Europeia a não a deixar crescer mais de ', { referencia: 'unico' }, ' % por ano: em ', { periodo: 'proprio' }, ' ', { estado: { fora: ['cresceu mais do que isso.'], dentro: ['ficou dentro desse limite.'] } },
    ],
    en: [
      'It is how much the public spending the Government controls grew in a year: net expenditure, which leaves out interest on the debt, spending paid by European funds and the spending that rises and falls with unemployment, as computed by the Public Finance Council.',
      anterior('It grew more than in', 'It grew less than in', 'It grew the same as in'),
      ' Portugal committed to the Council of the European Union not to let it grow by more than ', { referencia: 'unico' }, ' % a year: in ', { periodo: 'proprio' }, ' it ', { estado: { fora: ['grew more than that.'], dentro: ['stayed within that limit.'] } },
    ],
  },
  'saldo-da-balanca-corrente-2025': {
    pt: [
      'É a diferença entre o que Portugal recebeu do resto do mundo e o que lhe pagou, em bens, serviços e rendimentos, na média dos últimos três anos e ', PERCENTAGEM_DO_PIB_PT,
      { sinal: { positivo: [' Positivo quer dizer que o país recebeu mais do que pagou.'], negativo: [' Negativo quer dizer que o país pagou mais do que recebeu.'], zero: [' Zero quer dizer que recebeu tanto quanto pagou.'] } },
      SUBIU,
      ' Para a Comissão Europeia, um saldo abaixo de −', { referencia: 'inferior', semSinal: true }, ' % ou acima de ', { referencia: 'superior', semSinal: true }, ' % é sinal de possível desequilíbrio: Portugal está ', { comparacao: { entre: ['entre os dois.'], acima: ['acima.'], abaixo: ['abaixo.'], igual: ['no limite.'] } },
    ],
    en: [
      'It is the difference between what Portugal received from the rest of the world and what it paid to it, in goods, services and income, averaged over the last three years and ', PERCENTAGEM_DO_PIB_EN,
      { sinal: { positivo: [' Positive means the country received more than it paid.'], negativo: [' Negative means the country paid more than it received.'], zero: [' Zero means it received exactly what it paid.'] } },
      ROSE,
      ' For the European Commission, a balance below −', { referencia: 'inferior', semSinal: true }, ' % or above ', { referencia: 'superior', semSinal: true }, ' % is a sign of a possible imbalance: Portugal is ', { comparacao: { entre: ['between the two.'], acima: ['above.'], abaixo: ['below.'], igual: ['at the limit.'] } },
    ],
  },
  'posicao-de-investimento-internacional-2025': {
    pt: [
      'É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, ', PERCENTAGEM_DO_PIB_PT,
      { sinal: {
        negativo: [' Negativa quer dizer que o país deve ao exterior mais do que tem lá.', anterior('A dívida líquida ao exterior encolheu face a', 'A dívida líquida ao exterior cresceu face a', 'A dívida líquida ao exterior ficou igual à de')],
        positivo: [' Positiva quer dizer que o país tem no exterior mais do que lhe deve.', SUBIU],
        zero: [' Zero quer dizer que tem no exterior tanto quanto lhe deve.', SUBIU],
      } },
      ' Para a Comissão Europeia, uma posição abaixo de −', { referencia: 'unico', semSinal: true }, ' % do PIB é sinal de possível desequilíbrio: Portugal está ', { estado: { fora: ['abaixo.'], dentro: ['acima ou no limite.'] } },
    ],
    en: [
      'It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, ', PERCENTAGEM_DO_PIB_EN,
      { sinal: {
        negativo: [' Negative means the country owes abroad more than it owns there.', anterior('The net debt to the rest of the world shrank from', 'The net debt to the rest of the world grew from', 'The net debt to the rest of the world was unchanged from')],
        positivo: [' Positive means the country owns abroad more than it owes.', ROSE],
        zero: [' Zero means it owns abroad exactly what it owes.', ROSE],
      } },
      ' For the European Commission, a position below −', { referencia: 'unico', semSinal: true }, ' % of GDP is a sign of a possible imbalance: Portugal is ', { estado: { fora: ['below it.'], dentro: ['at or above it.'] } },
    ],
  },
  'taxa-de-cambio-efectiva-real-2025': {
    pt: [
      'Mede a competitividade dos preços portugueses face aos principais concorrentes, contando a inflação e as taxas de câmbio, em três anos: quando sobe, o país perde competitividade; quando desce, ganha.',
      VARIACAO, VARIACAO_UE,
      ' Para a Comissão Europeia, uma variação fora do intervalo entre −', { referencia: 'inferior', semSinal: true }, ' e ', { referencia: 'superior', semSinal: true }, ' % é sinal de possível desequilíbrio: Portugal está ', { comparacao: { entre: ['dentro do intervalo.'], acima: ['acima.'], abaixo: ['abaixo.'], igual: ['no limite.'] } },
    ],
    en: [
      'It measures the price competitiveness of Portugal against its main competitors, allowing for inflation and exchange rates, over three years: when it rises, the country loses competitiveness; when it falls, it gains.',
      CHANGE, CHANGE_EU,
      ' For the European Commission, a change outside the range from −', { referencia: 'inferior', semSinal: true }, ' to ', { referencia: 'superior', semSinal: true }, ' % is a sign of a possible imbalance: Portugal is ', { comparacao: { entre: ['within the range.'], acima: ['above it.'], abaixo: ['below it.'], igual: ['at the limit.'] } },
    ],
  },
  'desempenho-das-exportacoes-2025': {
    pt: [
      'É quanto mudou em três anos a quota de Portugal nas exportações das economias avançadas.',
      { sinal: { positivo: [' Positiva quer dizer que Portugal ganhou quota.'], negativo: [' Negativa quer dizer que Portugal perdeu quota.'], zero: [' Zero quer dizer que a quota não mudou.'] } },
      VARIACAO,
      ...CHAO_PT(['uma perda de mais de ', { referencia: 'unico', semSinal: true }, ' % em três anos']),
    ],
    en: [
      'It is how much Portugal’s share of the exports of advanced economies changed over three years.',
      { sinal: { positivo: [' Positive means Portugal gained share.'], negativo: [' Negative means Portugal lost share.'], zero: [' Zero means the share did not change.'] } },
      CHANGE,
      ...CHAO_EN(['a loss of more than ', { referencia: 'unico', semSinal: true }, ' % over three years']),
    ],
  },
  'divida-das-empresas-2025': {
    pt: ['É tudo o que as empresas devem, fora as financeiras, ', PERCENTAGEM_DO_PIB_PT, PESA, MEDIA_UE, ...TETO_PT(['uma dívida acima de ', { referencia: 'unico' }, ' % do PIB'])],
    en: ['It is everything companies owe, excluding financial companies, ', PERCENTAGEM_DO_PIB_EN, WEIGHS, EU_AVERAGE, ...TETO_EN(['debt above ', { referencia: 'unico' }, ' % of GDP'])],
  },
  'divida-das-familias-2025': {
    pt: ['É tudo o que as famílias devem, ', PERCENTAGEM_DO_PIB_PT, PESA, MEDIA_UE, ...TETO_PT(['uma dívida acima de ', { referencia: 'unico' }, ' % do PIB'])],
    en: ['It is everything households owe, ', PERCENTAGEM_DO_PIB_EN, WEIGHS, EU_AVERAGE, ...TETO_EN(['debt above ', { referencia: 'unico' }, ' % of GDP'])],
  },
  'fluxo-de-credito-as-empresas-2025': {
    pt: ['É quanto crédito novo as empresas receberam num ano, fora as financeiras e sem contar o investimento direto estrangeiro, em percentagem da dívida que já tinham no fim do ano anterior.', SUBIU, MEDIA_UE, ...TETO_PT(['um fluxo acima de ', { referencia: 'unico' }, ' %'])],
    en: ['It is how much new credit companies received in a year, excluding financial companies and foreign direct investment, as a percentage of the debt they already had at the end of the previous year.', ROSE, EU_AVERAGE, ...TETO_EN(['a flow above ', { referencia: 'unico' }, ' %'])],
  },
  'fluxo-de-credito-as-familias-2025': {
    pt: ['É quanto crédito novo as famílias receberam num ano, em percentagem da dívida que já tinham no fim do ano anterior.', SUBIU, MEDIA_UE, ...TETO_PT(['um fluxo acima de ', { referencia: 'unico' }, ' %'])],
    en: ['It is how much new credit households received in a year, as a percentage of the debt they already had at the end of the previous year.', ROSE, EU_AVERAGE, ...TETO_EN(['a flow above ', { referencia: 'unico' }, ' %'])],
  },
  /* O cartão das câmaras: uma chave da prova e não uma linha (§1.127, decisão 5). */
  camaras: {
    pt: ['Uma câmara acima do limite legal deve mais do que a lei lhe permite dever. Em ', { periodo: 'proprio' }, ' eram ', { prova: 'camaras_acima_do_limite' }, ' em ', { prova: 'municipios_com_pagina' }, '; ', { prova: 'camaras_sem_valor' }, ' não tem valor publicado.'],
    en: ['A council above the legal limit owes more than the law allows it to owe. In ', { periodo: 'proprio' }, ' there were ', { prova: 'camaras_acima_do_limite' }, ' in ', { prova: 'municipios_com_pagina' }, '; ', { prova: 'camaras_sem_valor' }, ' has no published value.'],
  },

  /* ------------------------------------------------- 2 · Trabalho */
  'taxa-de-emprego-2025': {
    pt: ['É a parte das pessoas dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos que tem emprego.', SUBIU, MEDIA_UE],
    en: ['It is the share of people aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' who are in employment.', ROSE, EU_AVERAGE],
  },
  'taxa-de-desemprego-mip-2025': {
    pt: ['É a parte das pessoas dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '74', motivo: 'escala-de-instrumento' }, ' anos que está sem emprego, entre as que trabalham ou procuram trabalho.', SUBIU, MEDIA_UE, ...TETO_PT(['uma taxa acima de ', { referencia: 'unico' }, ' %'])],
    en: ['It is the share of people aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '74', motivo: 'escala-de-instrumento' }, ' who are out of work, among those who work or are looking for work.', ROSE, EU_AVERAGE, ...TETO_EN(['a rate above ', { referencia: 'unico' }, ' %'])],
  },
  /* A mesma medida, reunida na do procedimento (`MEDIDA_REUNIDA`); a leitura é a mesma. */
  'taxa-de-desemprego-2025': {
    pt: ['É a parte das pessoas dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '74', motivo: 'escala-de-instrumento' }, ' anos que está sem emprego, entre as que trabalham ou procuram trabalho.', SUBIU, MEDIA_UE],
    en: ['It is the share of people aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '74', motivo: 'escala-de-instrumento' }, ' who are out of work, among those who work or are looking for work.', ROSE, EU_AVERAGE],
  },
  'ganho-medio-mensal-2024': {
    pt: ['É o que um trabalhador por conta de outrem ganhou por mês, em média, em ', { periodo: 'proprio' }, ', com o salário base, as horas extraordinárias e os subsídios regulares, antes de descontos.'],
    en: ['It is what an employee earned per month, on average, in ', { periodo: 'proprio' }, ', including base pay, overtime and regular allowances, before deductions.'],
  },
  'disparidade-salarial-entre-sexos-2024': {
    pt: ['Por cada hora de trabalho, as mulheres ganharam em média menos do que os homens: a diferença foi de ', { claim: 'proprio', sufixo: ' %' }, ' do ganho dos homens, em ', { periodo: 'proprio' }, ', nas empresas com ', { nl: '10', motivo: 'escala-de-instrumento' }, ' ou mais pessoas ao serviço.', DIFERENCA, DIFERENCA_UE],
    en: ['Per hour worked, women earned on average less than men: the gap was ', { claim: 'proprio', sufixo: ' %' }, ' of men’s earnings, in ', { periodo: 'proprio' }, ', in enterprises with ', { nl: '10', motivo: 'escala-de-instrumento' }, ' or more employees.', GAP, GAP_EU],
  },
  'retribuicao-minima-mensal-garantida-continente-2026': {
    pt: ['É o salário mínimo nacional: o valor mensal mínimo que a lei garante a quem trabalha por conta de outrem, em vigor no continente em ', { periodo: 'proprio' }, '.'],
    en: ['It is the national minimum wage: the lowest monthly pay the law guarantees to employees, in force on the mainland in ', { periodo: 'proprio' }, '.'],
  },
  'desemprego-de-longa-duracao-2025': {
    pt: ['É a parte das pessoas dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '74', motivo: 'escala-de-instrumento' }, ' anos, entre as que trabalham ou procuram trabalho, que está sem emprego e o procura há um ano ou mais.', SUBIU, MEDIA_UE],
    en: ['It is the share of people aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '74', motivo: 'escala-de-instrumento' }, ', among those who work or are looking for work, who are out of work and have been looking for a year or more.', ROSE, EU_AVERAGE],
  },
  'jovens-nem-2025': {
    pt: ['É a parte dos jovens dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '29', motivo: 'escala-de-instrumento' }, ' anos que não trabalha, não estuda nem está em formação.', SUBIU, MEDIA_UE],
    en: ['It is the share of young people aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '29', motivo: 'escala-de-instrumento' }, ' who are not working, not studying and not in training.', ROSE, EU_AVERAGE],
  },
  'disparidade-de-emprego-entre-sexos-2025': {
    pt: ['É a diferença entre a percentagem de homens dos ', { nl: '20', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos com emprego e a percentagem de mulheres com emprego.', DIFERENCA, DIFERENCA_UE],
    en: ['It is the difference between the percentage of men aged ', { nl: '20', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' in employment and the percentage of women in employment.', GAP, GAP_EU],
  },
  'taxa-de-actividade-2025': {
    pt: [
      'É quanto mudou em três anos, em pontos percentuais, a parte da população que está ativa: a trabalhar ou à procura de trabalho.',
      { sinal: { positivo: [' Positiva quer dizer que a parte ativa cresceu.'], negativo: [' Negativa quer dizer que a parte ativa encolheu.'], zero: [' Zero quer dizer que não mudou.'] } },
      VARIACAO, VARIACAO_UE,
      ...CHAO_PT(['uma descida de mais de ', { referencia: 'unico', semSinal: true }, ' pontos em três anos']),
    ],
    en: [
      'It is how much the share of the population that is active, working or looking for work, changed over three years, in percentage points.',
      { sinal: { positivo: [' Positive means the active share grew.'], negativo: [' Negative means the active share shrank.'], zero: [' Zero means it did not change.'] } },
      CHANGE, CHANGE_EU,
      ...CHAO_EN(['a fall of more than ', { referencia: 'unico', semSinal: true }, ' points over three years']),
    ],
  },
  'custo-unitario-do-trabalho-2025': {
    pt: [
      'É quanto subiu em três anos o custo do trabalho por cada unidade produzida: o que se paga pelo trabalho a dividir pelo que ele produz.',
      { sinal: { negativo: [' Negativo quer dizer que desceu.'], positivo: [], zero: [' Zero quer dizer que não mudou.'] } },
      VARIACAO, VARIACAO_UE,
      ...TETO_PT(['uma subida acima de ', { referencia: 'unico' }, ' % em três anos']),
    ],
    en: [
      'It is how much the cost of labour per unit produced rose over three years: what is paid for labour divided by what it produces.',
      { sinal: { negativo: [' Negative means it fell.'], positivo: [], zero: [' Zero means it did not change.'] } },
      CHANGE, CHANGE_EU,
      ...TETO_EN(['a rise above ', { referencia: 'unico' }, ' % over three years']),
    ],
  },

  /* ------------------------------------------------- 5 · Segurança social e pensões */
  'risco-de-pobreza-ou-exclusao-2025': {
    pt: ['É a parte da população que está em pelo menos uma de três situações: rendimento abaixo de ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % do rendimento mediano do país, privação material e social grave, ou viver num agregado onde quase ninguém trabalha; cada pessoa conta uma só vez.', SUBIU, MEDIA_UE],
    en: ['It is the share of the population in at least one of three situations: income below ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % of the country’s median income, severe material and social deprivation, or living in a household where almost no one works; each person counts only once.', ROSE, EU_AVERAGE],
  },
  'racio-s80-s20-2025': {
    pt: ['Os ', { nl: '20', motivo: 'escala-de-instrumento' }, ' % da população com mais rendimento recebem, no total, ', { claim: 'proprio' }, ' vezes o que recebem os ', { nl: '20', motivo: 'escala-de-instrumento' }, ' % com menos rendimento.', DIFERENCA, DIFERENCA_UE],
    en: ['The ', { nl: '20', motivo: 'escala-de-instrumento' }, ' % of the population with the highest income receive, in total, ', { claim: 'proprio' }, ' times what the ', { nl: '20', motivo: 'escala-de-instrumento' }, ' % with the lowest income receive.', GAP, GAP_EU],
  },

  /* ------------------------------------------------- 7 · Educação */
  'abandono-escolar-precoce-2025': {
    pt: ['É a parte das pessoas dos ', { nl: '18', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '24', motivo: 'escala-de-instrumento' }, ' anos que não foi além do ensino básico e já não estuda nem está em formação.', SUBIU, MEDIA_UE],
    en: ['It is the share of people aged ', { nl: '18', motivo: 'escala-de-instrumento' }, ' to ', { nl: '24', motivo: 'escala-de-instrumento' }, ' who went no further than lower secondary education and are no longer studying or in training.', ROSE, EU_AVERAGE],
  },
  'competencias-digitais-2025': {
    pt: ['É a parte das pessoas com pelo menos competências digitais básicas: saber procurar informação, comunicar, criar conteúdos, proteger-se e resolver problemas na internet.', SUBIU, MEDIA_UE],
    en: ['It is the share of people with at least basic digital skills: knowing how to find information, communicate, create content, stay safe and solve problems online.', ROSE, EU_AVERAGE],
  },
  'criancas-em-creche-2025': {
    pt: ['É a parte das crianças com menos de ', { nl: '3', motivo: 'escala-de-instrumento' }, ' anos que está numa creche ou noutro cuidado formal, como uma ama profissional.', SUBIU, MEDIA_UE],
    en: ['It is the share of children under ', { nl: '3', motivo: 'escala-de-instrumento' }, ' who are in a nursery or other formal childcare, such as a professional child-minder.', ROSE, EU_AVERAGE],
  },

  /* ------------------------------------------------- 8 · Saúde */
  'necessidades-medicas-nao-satisfeitas-2025': {
    pt: ['É a parte das pessoas que diz ter precisado de um médico e não o ter tido, por ser caro, por a espera ser longa ou por ficar longe.', SUBIU, MEDIA_UE],
    en: ['It is the share of people who say they needed medical care and did not get it, because it was too expensive, the wait too long or too far away.', ROSE, EU_AVERAGE],
  },

  /* ------------------------------------------------- 9 · Habitação */
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025': {
    pt: ['Entre as pessoas que vivem em casa arrendada a preço de mercado, é a parte cujo agregado gasta mais de ', { nl: '40', motivo: 'escala-de-instrumento' }, ' % do rendimento disponível com a habitação.', SUBIU, MEDIA_UE],
    en: ['Among people living in a home rented at market price, it is the share whose household spends more than ', { nl: '40', motivo: 'escala-de-instrumento' }, ' % of its disposable income on housing.', ROSE, EU_AVERAGE],
  },
  'sobrecarga-do-custo-da-habitacao-2025': {
    pt: ['No total de todos os regimes de ocupação (casa própria com ou sem crédito, arrendada a preço de mercado ou a renda reduzida), é a parte das pessoas cujo agregado gasta mais de ', { nl: '40', motivo: 'escala-de-instrumento' }, ' % do rendimento disponível com a habitação.', SUBIU, ' Este total mistura situações muito diferentes, e a Comissão Europeia manda lê-lo por regime de ocupação.'],
    en: ['Across all tenure statuses (owned with or without a mortgage, rented at market price or at a reduced rent), it is the share of people whose household spends more than ', { nl: '40', motivo: 'escala-de-instrumento' }, ' % of its disposable income on housing.', ROSE, ' This total mixes very different situations, and the European Commission says it should be read by tenure status.'],
  },
  'precos-da-habitacao-2025': {
    pt: [
      { sinal: {
        positivo: ['Em ', { periodo: 'proprio' }, ' os preços das casas compradas pelas famílias subiram ', { claim: 'proprio', sufixo: ' %' }, ' em média.'],
        negativo: ['Em ', { periodo: 'proprio' }, ' os preços das casas compradas pelas famílias desceram: ', { claim: 'proprio', sufixo: ' %' }, ' em média.'],
        zero: ['Em ', { periodo: 'proprio' }, ' os preços das casas compradas pelas famílias não mudaram em média.'],
      } },
      anterior('A variação é maior do que a de', 'A variação é menor do que a de', 'A variação é igual à de'), VARIACAO_UE,
      ...TETO_PT(['uma subida acima de ', { referencia: 'unico' }, ' % num ano']),
    ],
    en: [
      { sinal: {
        positivo: ['In ', { periodo: 'proprio' }, ' the prices of homes bought by households rose ', { claim: 'proprio', sufixo: ' %' }, ' on average.'],
        negativo: ['In ', { periodo: 'proprio' }, ' the prices of homes bought by households fell: ', { claim: 'proprio', sufixo: ' %' }, ' on average.'],
        zero: ['In ', { periodo: 'proprio' }, ' the prices of homes bought by households did not change on average.'],
      } },
      anterior('The change is larger than in', 'The change is smaller than in', 'The change is the same as in'), CHANGE_EU,
      ...TETO_EN(['a rise above ', { referencia: 'unico' }, ' % in a year']),
    ],
  },
  'licencas-de-construcao-2025': {
    pt: ['É a área de habitação nova licenciada num ano, em metros quadrados por cada ', { nl: '1000', motivo: 'escala-de-instrumento' }, ' habitantes: quanto mais alta, mais construção de casas foi autorizada.', SUBIU, MEDIA_UE],
    en: ['It is the floor area of new housing permitted in a year, in square metres per ', { nl: '1000', motivo: 'escala-de-instrumento' }, ' inhabitants: the higher it is, the more housing construction was authorised.', ROSE, EU_AVERAGE],
  },

  /* ------------------------------------------------- 10 · Investimento */
  'formacao-bruta-de-capital-fixo-2025': {
    pt: ['É o investimento feito no país num ano em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, ', PERCENTAGEM_DO_PIB_PT, SUBIU, MEDIA_UE],
    en: ['It is the investment made in the country in a year in assets that last more than a year, such as buildings, machinery and software, ', PERCENTAGEM_DO_PIB_EN, ROSE, EU_AVERAGE],
  },

  /* ------------------------------------------------- 11 · Ciência, tecnologia e inteligência artificial */
  'despesa-em-id-2024': {
    pt: ['É o que se gastou no país em investigação e desenvolvimento num ano, pelas empresas, pelo Estado, pelo ensino superior e pelas instituições sem fins lucrativos, ', PERCENTAGEM_DO_PIB_PT, SUBIU, MEDIA_UE],
    en: ['It is what was spent in the country on research and development in a year, by companies, the State, higher education and non-profit institutions, ', PERCENTAGEM_DO_PIB_EN, ROSE, EU_AVERAGE],
  },

  /* ------------------------------------------------- 17 · Justiça */
  'independencia-da-justica-2025': {
    pt: ['É a parte das pessoas que, num inquérito europeu, considera a independência dos tribunais e dos juízes do seu país muito boa ou razoavelmente boa.', SUBIU, MEDIA_UE],
    en: ['It is the share of people who, in a European survey, rate the independence of their country’s courts and judges as very good or fairly good.', ROSE, EU_AVERAGE],
  },
};
