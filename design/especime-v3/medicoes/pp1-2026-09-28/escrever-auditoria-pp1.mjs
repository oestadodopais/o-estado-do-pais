/** PP1: escreve a auditoria das palavras dos cinco blocos, `tests/inicio/blocos-provados.json`.
 *
 * É uma leitura, e é de quem a assina (o construtor do PP1, Claude Opus 5.5, 28.09.2026): cada folha
 * de palavras fixas de cada bloco, nas duas edições, partida em partes com uma classe:
 *   · «diz» · diz o que uma medida é, de quem é o valor de referência, o que um grupo é; leva o literal
 *     que a sustenta, num campo de uma origem de `ORIGENS_DAS_DEFINICOES` (excerto, documento) ou num
 *     campo selado de uma linha que o bloco nomeia (excerpt, unit, document.title);
 *   · «conta» · as palavras de uma comparação que a máquina decide: dentro de um ramo que os valores
 *     escolhem, ou guardadas por condições declaradas do bloco ou da peça (os índices em `guarda`),
 *     que tiram o bloco da página quando deixam de ser verdadeiras;
 *   · «liga» · pontuação e as palavras de ligação da lista fechada da célula.
 * Cada algarismo declarado com `nl` leva o literal que o traz. A célula da primeira página
 * (`tests/inicio/blocos.mjs`) confere que as partes juntas são cada folha, que cada literal está mesmo
 * no campo que cita, que cada guarda existe e é uma comparação, e que cada origem listada apoia alguma
 * parte. Não infere que o literal quer dizer o que a parte diz: isso é esta leitura.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/escrever-auditoria-pp1.mjs [--confere]
 * Com --confere não escreve: compara o que escreveria com o ficheiro e sai com 1 se diferirem.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const ALVO = path.join(RAIZ, 'tests/inicio/blocos-provados.json');

/* Os apoios, escritos uma vez. */
const O = (origem, literal, campo = 'excerto') => ({ origem, campo, literal });
const L = (linha, campo, literal) => ({ linha, campo, literal });
const diz = (pt, en, ...apoios) => ({ pt, en, classe: 'diz', apoios });
const conta = (pt, en, guarda = null) => ({ pt, en, classe: 'conta', ...(guarda ? { guarda } : {}) });
const liga = (pt, en) => ({ pt, en, classe: 'liga' });
const folha = (caminho, ...partes) => ({ caminho, pt: partes.map((p) => p.pt).join(''), en: partes.map((p) => p.en).join(''), partes });
const algarismo = (caminho, nl, ...apoios) => ({ caminho, nl, apoios });

const IPC_METODO = O('rp1-ipc-metodo', 'medir a evolução dos preços de um conjunto de bens e serviços considerados representativos da estrutura de despesa monetária de consumo final das famílias residentes em Portugal');
const SOBRECARGA = O('eurostat-tespm140-populacao', 'Percentage of the population living in a household where total housing costs (net of housing allowances) represent more than 40% of the total disposable household income');
const INQUILINOS = O('eurostat-tessi164-inquilinos', 'Tenant, rent at market price');
const IDADES_EMPREGO = (id) => L(id, 'excerpt', 'Age class: From 20 to 64 years');
const IDADES_DESEMPREGO = L('taxa-de-desemprego-mip-2025', 'excerpt', 'Age class: From 15 to 74 years');
const UE = (id) => L(id, 'excerpt', 'European Union - 27 countries (from 2020)');
const DESEQUILIBRIO = O('painel-pdm', 'indicative thresholds, covering the major sources of macroeconomic imbalances');
const S80 = O('glossario-s80s20', 'It is calculated as the ratio of total income received by the 20 % of the population with the highest income (the top quintile) to that received by the 20 % of the population with the lowest income (the bottom quintile).');

const BLOCOS = [
  {
    id: 'precos',
    origens: ['rp1-ipc-metodo', 'rp1-ipc-classes-homologa', 'rp1-ihpc-comparavel'],
    folhas: [
      folha('titulo',
        diz('Os preços:', 'Prices:', IPC_METODO),
        diz(' os combustíveis', ' fuel', L('ipc-combustiveis-variacao-homologa', 'excerpt', 'Combustível e lubrificantes para equipamento para transporte pessoal')),
        conta(' sobem mais do que o resto', ' is rising faster than the rest', [1, 2, 3, 4, 5])),
      folha('frase[0]', liga('Em ', 'In ')),
      folha('frase[2]',
        diz(', os combustíveis', ', fuel', L('ipc-combustiveis-variacao-homologa', 'excerpt', 'Combustível e lubrificantes para equipamento para transporte pessoal')),
        liga(' estavam ', ' was ')),
      folha('frase[4]',
        conta(' mais caros', ' more expensive', [4, 5]),
        diz(' do que um ano antes.', ' than a year earlier.', O('rp1-ipc-classes-homologa', 'A variação homóloga compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior.')),
        diz(' Os preços no seu conjunto', ' Prices as a whole', L('ipc-variacao-homologa', 'excerpt', '"dim_3_t" : "Total"'), IPC_METODO),
        conta(' subiram ', ' rose ', [5])),
      folha('frase[6]', liga('.', '.')),
      folha('pecas.uniao[0]',
        diz('Na medida harmonizada que compara os países da União,', 'On the harmonised measure that compares the countries of the Union,', O('rp1-ihpc-comparavel', 'gives comparable measures of inflation for the countries and country groups for which it is produced')),
        diz(' os preços', ' prices', O('rp1-ihpc-comparavel', 'measures the change over time of the prices of consumer goods and services acquired by households')),
        conta(' subiram ', ' rose ', [1, 2])),
      folha('pecas.uniao[2]',
        liga(' em ', ' in '),
        diz('Portugal', 'Portugal', L('ihpc-variacao-homologa', 'excerpt', '— Portugal —')),
        liga(' e ', ' and ')),
      folha('pecas.uniao[4]', diz(' na União.', ' in the Union.', UE('ihpc-variacao-homologa-ue'))),
      folha('ressalva', diz('Os preços no seu conjunto medem-se num cabaz de bens e serviços que representa o que as famílias compram.', 'Prices as a whole are measured on a basket of goods and services that represents what households buy.', IPC_METODO)),
    ],
    algarismos: [],
  },
  {
    id: 'casa',
    origens: ['eurostat-tespm140-populacao', 'eurostat-tessi164-inquilinos', 'glossario-hpi', 'eurostat-tipsho20-descricao', 'painel-pdm', 'rp1-rendas-referencia', 'ce-swd-2026-222-habitacao'],
    folhas: [
      folha('titulo',
        diz('A habitação:', 'Housing:', L('sobrecarga-do-custo-da-habitacao-2025', 'excerpt', 'Housing cost overburden rate')),
        conta(' a média engana quem arrenda', ' the average hides the renters', [1, 2])),
      folha('frase[0]',
        diz('Em Portugal,', 'In Portugal,', L('sobrecarga-do-custo-da-habitacao-2025', 'excerpt', '— Portugal —')),
        diz(' a parte das pessoas que gastam mais de ', ' the share of people spending more than ', SOBRECARGA)),
      folha('frase[2]',
        diz(' % do rendimento disponível com a habitação', ' % of their disposable income on housing', SOBRECARGA),
        conta(' é menor do que na União.', ' is smaller than in the Union.', [1]),
        diz(' Entre quem arrenda a preço de mercado,', ' Among people renting at market price,', INQUILINOS),
        conta(' é maior.', ' it is larger.', [2])),
      folha('desenho.legenda[0]', diz('% das pessoas, ', '% of people, ', SOBRECARGA)),
      folha('desenho.paineis[0].titulo', diz('Todas as pessoas', 'All people', SOBRECARGA)),
      folha('desenho.paineis[1].titulo', diz('Quem arrenda a preço de mercado', 'Renting at market price', INQUILINOS)),
      folha('pecas.precos-das-casas[0]',
        diz('Os preços das casas', 'House prices', O('glossario-hpi', 'an index that measures the changes in the transaction prices of dwellings purchased by households')),
        conta(' subiram ', ' rose ', [1])),
      folha('pecas.precos-das-casas[2]', liga(' em ', ' in ')),
      folha('pecas.precos-das-casas[4]',
        diz(', na média do ano,', ', on the year’s average,', L('precos-da-habitacao-2025', 'excerpt', 'Annual average rate of change')),
        liga(' contra ', ' against ')),
      folha('pecas.precos-das-casas[6]',
        diz(' na União.', ' in the Union.', UE('precos-da-habitacao-2025-ue')),
        diz(' Para a Comissão Europeia, uma subida acima de ', ' For the European Commission, a rise above ', O('eurostat-tipsho20-descricao', 'The MIP Scoreboard indicator is expressed as the 1-year percentage change of the HPI. The indicative threshold of the indicator is 9%.'))),
      folha('pecas.precos-das-casas[8]',
        diz(' % num ano', ' % in a year', O('eurostat-tipsho20-descricao', 'expressed as the 1-year percentage change of the HPI')),
        diz(' é sinal de possível desequilíbrio.', ' is a sign of a possible imbalance.', DESEQUILIBRIO)),
      folha('pecas.rendas[0]', diz('A referência para a atualização das rendas no próximo ano ficou em ', 'The reference for updating rents next year stood at ', O('rp1-rendas-referencia', 'referência para a atualização de rendas no próximo ano, fixou-se em'))),
      folha('pecas.rendas[2]', diz(': é a variação média de doze meses dos preços sem a habitação, em ', ': it is the twelve-month average change in prices excluding housing, in ', O('rp1-rendas-referencia', 'variação média dos últimos doze meses do IPC sem habitação'), L('ipc-sem-habitacao-variacao-media-12-meses', 'excerpt', '"dim_3_t" : "Total exceto habitação"'))),
      folha('pecas.rendas[4]', liga('.', '.')),
      folha('pecas.rendas.titulo', diz('As rendas no próximo ano', 'Rents next year', O('rp1-rendas-referencia', 'referência para a atualização de rendas no próximo ano'))),
      folha('ressalva', diz('Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.', 'This total mixes very different situations, and the European Commission says it should be read together with the breakdown by tenure status.', O('ce-swd-2026-222-habitacao', 'The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.'))),
    ],
    algarismos: [
      algarismo('frase[1]', '40', SOBRECARGA),
    ],
  },
  {
    id: 'trabalho',
    origens: ['glossario-emprego', 'glossario-desemprego', 'glossario-longa-duracao', 'eurostat-tipsun20-descricao', 'rp1-remuneracao-bruta', 'rp1-remuneracao-trabalhadores'],
    folhas: [
      folha('titulo',
        diz('O trabalho:', 'Work:', O('glossario-emprego', 'The employment rate is the percentage of employed persons')),
        conta(' mais emprego,', ' more employment,', [1]),
        liga(' e', ' and'),
        conta(' mais', ' more', [2]),
        diz(' desemprego de longa duração', ' long-term unemployment', O('glossario-longa-duracao', 'Long-term unemployment refers to the number of people who are out of work and have been actively seeking employment for at least a year.'))),
      folha('frase[0]', liga('Em ', 'In ')),
      folha('frase[2]', diz(', a parte das pessoas dos ', ', the share of people aged ', L('taxa-de-emprego-2025', 'excerpt', 'Percentage of total population'), O('glossario-emprego', 'the percentage of employed persons in relation to the comparable total population'))),
      folha('frase[4]', liga(' aos ', ' to ')),
      folha('frase[6]',
        diz(' anos com emprego', ' in work', IDADES_EMPREGO('taxa-de-emprego-2025'), O('glossario-emprego', 'employed persons')),
        conta(' era maior em Portugal do que na União,', ' was larger in Portugal than in the Union,', [1]),
        diz(' e o desemprego ', ' and unemployment ', O('glossario-desemprego', 'The unemployment rate is the number of people unemployed as a percentage of the labour force.'))),
      folha('frase[7].menor[0]', conta('era mais baixo', 'was lower')),
      folha('frase[7].maior[0]', conta('era mais alto', 'was higher')),
      folha('frase[7].igual[0]', conta('era o mesmo', 'was the same')),
      folha('frase[8]',
        liga('. Mas', '. But'),
        conta(' era maior', '', [2]),
        diz(' a parte de quem procura trabalho há um ano ou mais.', ' the share of people who had been looking for work for a year or more', O('glossario-longa-duracao', 'out of work and have been actively seeking employment for at least a year')),
        conta('', ' was larger.', [2])),
      folha('desenho.pares[0].titulo[0]', diz('Com emprego, dos ', 'In work, aged ', O('glossario-emprego', 'employed persons'), IDADES_EMPREGO('taxa-de-emprego-2025'))),
      folha('desenho.pares[0].titulo[2]', liga(' aos ', ' to ')),
      folha('desenho.pares[0].titulo[4]', diz(' anos', '', IDADES_EMPREGO('taxa-de-emprego-2025'))),
      folha('desenho.pares[1].titulo', diz('Desemprego', 'Unemployment', O('glossario-desemprego', 'The unemployment rate is the number of people unemployed as a percentage of the labour force.'))),
      folha('desenho.pares[2].titulo', diz('Desemprego de longa duração', 'Long-term unemployment', O('glossario-longa-duracao', 'Long-term unemployment refers to the number of people who are out of work'))),
      folha('pecas.salario[0]',
        diz('A remuneração média antes de descontos', 'Average pay before deductions', L('remuneracao-bruta-mensal-media', 'document.title', 'Remuneração bruta mensal média por trabalhador'), O('rp1-remuneracao-bruta', 'Remuneração ilíquida')),
        diz(' de quem trabalha por conta de outrem', ' for employees', O('rp1-remuneracao-trabalhadores', 'universo de trabalhadores por conta de outrem')),
        liga(' passou de ', ' went from ')),
      folha('pecas.salario[1].sufixo', diz(' euros por mês', ' euros a month', L('remuneracao-bruta-mensal-media', 'unit', '€ por mês'))),
      folha('pecas.salario[2]', liga(' no ', ' in the ')),
      folha('pecas.salario[4]', liga(' para ', ' to ')),
      folha('pecas.salario[5].sufixo', diz(' euros por mês', ' euros a month', L('remuneracao-bruta-mensal-media', 'unit', '€ por mês'))),
      folha('pecas.salario[6]', liga(' no ', ' in the ')),
      folha('pecas.salario[8]', liga('.', '.')),
      folha('ressalva[0]', diz('O emprego conta-se entre as pessoas dos ', 'Employment is counted among people aged ', O('glossario-emprego', 'the percentage of employed persons in relation to the comparable total population'), IDADES_EMPREGO('taxa-de-emprego-2025'))),
      folha('ressalva[2]', liga(' aos ', ' to ')),
      folha('ressalva[4]', diz(' anos; o desemprego, entre as que trabalham ou procuram trabalho, dos ', '; unemployment, among those working or looking for work, aged ', O('eurostat-tipsun20-descricao', 'The labour force is the total number of people employed and unemployed.'), IDADES_DESEMPREGO)),
      folha('ressalva[6]', liga(' aos ', ' to ')),
      folha('ressalva[8]', liga('.', '.')),
    ],
    algarismos: [
      algarismo('frase[3]', '20', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('frase[5]', '64', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('desenho.pares[0].titulo[1]', '20', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('desenho.pares[0].titulo[3]', '64', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('ressalva[1]', '20', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('ressalva[3]', '64', IDADES_EMPREGO('taxa-de-emprego-2025')),
      algarismo('ressalva[5]', '15', IDADES_DESEMPREGO),
      algarismo('ressalva[7]', '74', IDADES_DESEMPREGO),
    ],
  },
  {
    id: 'estado',
    origens: ['pdm-divida-publica', 'painel-pdm', 'eurostat-tipsgo10-descricao', 'eurostat-tipsna40-descricao'],
    folhas: [
      folha('titulo', diz('As contas do Estado', 'The state’s accounts', L('divida-publica-2025', 'document.title', 'General government gross debt'))),
      folha('frase[0]', diz('A dívida pública ', 'Public debt ', O('pdm-divida-publica', 'general government sector debt'))),
      folha('frase[1].menor[0]', conta('desceu', 'fell')),
      folha('frase[1].maior[0]', conta('subiu', 'rose')),
      folha('frase[1].igual[0]', conta('não mudou', 'did not change')),
      folha('frase[2]', liga(' de ', ' from ')),
      folha('frase[4]', liga(' para ', ' to ')),
      folha('frase[6]',
        conta(' e está acima da média da União.', ' and is above the Union average.', [1]),
        diz(' Para a Comissão Europeia, uma dívida acima de ', ' For the European Commission, debt above ', O('pdm-divida-publica', 'general government sector debt in % of GDP with a threshold of 60%.'))),
      folha('frase[8]',
        diz(' % do PIB', ' % of GDP', O('pdm-divida-publica', 'in % of GDP')),
        diz(' é sinal de possível desequilíbrio,', ' is a sign of a possible imbalance,', DESEQUILIBRIO),
        conta(' e a de Portugal está acima.', ' and Portugal’s is above it.', [2])),
      folha('desenho.legenda[0]', diz('% do PIB', '% of GDP', L('divida-publica-2025', 'unit', '% do PIB'))),
      folha('desenho.paineis[0].titulo', diz('Portugal', 'Portugal', L('divida-publica-2025', 'excerpt', '— Portugal —'))),
      folha('desenho.paineis[1].titulo', diz('A União', 'The Union', UE('divida-publica-2025-ue'))),
      folha('pecas.revisao-do-ine[0]', diz('A notificação do INE de ', 'INE’s notification of ', L('divida-publica-2025-notificacao-ine-2026-09', 'document.title', 'Procedimento dos Défices Excessivos 2ª Notificação'))),
      folha('pecas.revisao-do-ine[2]',
        conta(' já revê', ' already revises', [1]),
        diz(' a dívida de ', ' the ', L('divida-publica-2025-notificacao-ine-2026-09', 'excerpt', 'A dívida bruta das AP'))),
      folha('pecas.revisao-do-ine[4]',
        diz('', ' debt', L('divida-publica-2025-notificacao-ine-2026-09', 'excerpt', 'A dívida bruta das AP')),
        liga(' para ', ' to ')),
      folha('pecas.revisao-do-ine[6]', diz(' do PIB.', ' of GDP.', L('divida-publica-2025-notificacao-ine-2026-09', 'unit', '% do PIB'))),
      folha('ressalva',
        diz('É tudo o que as administrações públicas devem,', 'It is everything general government owes,', O('eurostat-tipsgo10-descricao', 'debt means total gross debt'), O('pdm-divida-publica', 'general government sector debt')),
        diz(' em percentagem do PIB,', ' as a percentage of GDP,', O('pdm-divida-publica', 'in % of GDP')),
        diz(' o valor de tudo o que o país produz num ano.', ' the value of everything the country produces in a year.', O('eurostat-tipsna40-descricao', 'GDP measures the value of total final output of goods and services produced by an economy within a certain period of time.'))),
    ],
    algarismos: [],
  },
  {
    id: 'pobreza',
    origens: ['glossario-arope', 'glossario-s80s20', 'eurostat-tipslc10-descricao', 'eurostat-glossario-mediana'],
    folhas: [
      folha('titulo',
        diz('Pobreza', 'Poverty', O('glossario-arope', 'At risk of poverty or social exclusion')),
        liga(' e ', ' and '),
        diz('desigualdade', 'inequality', O('glossario-s80s20', 'a measure of the inequality of income distribution')),
        conta(' não são a mesma coisa', ' are not the same thing', [1, 2])),
      folha('frase[0]', liga('Em ', 'In ')),
      folha('frase[2]',
        diz(', a parte das pessoas em risco de pobreza ou exclusão social', ', the share of people at risk of poverty or social exclusion', O('glossario-arope', 'The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.')),
        conta(' era menor em Portugal do que na União.', ' was smaller in Portugal than in the Union.', [1]),
        liga(' Mas os ', ' But the ')),
      folha('frase[4]', diz(' % com mais rendimento recebiam ', ' % with the highest income received ', S80)),
      folha('frase[6]', diz(' vezes o que recebiam os ', ' times what the ', S80)),
      folha('frase[8]',
        diz(' % com menos,', ' % with the lowest income received,', S80),
        liga(' contra ', ' against ')),
      folha('frase[10]', diz(' na União.', ' in the Union.', UE('racio-s80-s20-2025-ue'))),
      folha('desenho.paineis[0].titulo', diz('Em risco de pobreza ou exclusão social, % das pessoas', 'At risk of poverty or social exclusion, % of people', O('glossario-arope', 'The AROPE rate is the share of the total population which is at risk of poverty or social exclusion.'), L('risco-de-pobreza-ou-exclusao-2025', 'excerpt', 'Percentage'))),
      folha('desenho.paineis[1].titulo[0]', diz('Quantas vezes o rendimento dos ', 'How many times the income of the top ', S80)),
      folha('desenho.paineis[1].titulo[2]', diz(' % de cima é o dos ', ' % is that of the bottom ', S80)),
      folha('desenho.paineis[1].titulo[4]', diz(' % de baixo', ' %', S80)),
      folha('ressalva[0]', diz('O risco de pobreza mede-se contra o rendimento de cada país: é ter menos de ', 'The risk of poverty is measured against each country’s own income: it means having less than ', O('eurostat-tipslc10-descricao', 'At risk-of-poverty are persons with an equalised disposable income below the risk-of-poverty threshold, which is set at 60 % of the national median equalised disposable income'))),
      folha('ressalva[2]', diz(' % do rendimento mediano, o do meio.', ' % of the median income, the one in the middle.', O('eurostat-tipslc10-descricao', 'national median equalised disposable income'), O('eurostat-glossario-mediana', 'The median is the middle value in a group of numbers ranked in order of size.'))),
    ],
    algarismos: [
      algarismo('frase[3]', '20', S80),
      algarismo('frase[7]', '20', S80),
      algarismo('desenho.paineis[1].titulo[1]', '20', S80),
      algarismo('desenho.paineis[1].titulo[3]', '20', S80),
      algarismo('ressalva[1]', '60', O('eurostat-tipslc10-descricao', 'which is set at 60 % of the national median')),
    ],
  },
];

const auditoria = {
  schema: 1,
  o_que_e:
    'A auditoria das palavras dos cinco blocos de «O que se passa», folha a folha, nas duas edições (bloco PP1, item 1). ' +
    'Cada folha de palavras fixas de `src/data/primeira-pagina.mjs` divide-se em partes, e cada parte tem uma classe: «diz» (diz o que ' +
    'uma medida é, o que um grupo é, ou de quem é o valor de referência e o que ele é) com o literal que a apoia, num campo de uma origem ' +
    'declarada em ORIGENS_DAS_DEFINICOES (excerto, excertoEn, documento ou publicador) ou num campo selado de uma linha que o bloco nomeia ' +
    '(excerpt, unit, document.title, document.locator); «conta» (as palavras de uma comparação que a máquina decide: dentro de um ramo que ' +
    'os valores escolhem, ou guardadas pelas condições declaradas do bloco ou da peça que `guarda` indexa); «liga» (pontuação e as palavras ' +
    'da lista fechada da célula). Cada algarismo declarado com «nl» tem o seu literal em «algarismos». A célula da primeira página ' +
    '(`tests/inicio/blocos.mjs`) confere que as partes juntas são cada folha, que cada literal está mesmo no campo que cita, que cada guarda ' +
    'existe e é uma comparação, e que cada origem da lista de um bloco apoia uma parte dele. Não infere que o literal quer dizer o que a ' +
    'parte diz: isso é uma leitura, e é de quem a assina.',
  leituras: [
    { quem: 'Claude Opus 5.5', quando: '2026-09-28', o_que: 'primeira leitura, construtor do PP1, sobre as origens já declaradas e os campos das linhas que os blocos nomeiam; nenhuma origem nova; a auditoria não recusou palavra nenhuma; as quatro trocas de «casa» por «habitação» (A1 a A4 de ACERTOS_DAS_PALAVRAS) vêm da célula 11 da voz' },
  ],
  blocos: BLOCOS,
};

const texto = JSON.stringify(auditoria, null, 2) + '\n';
if (process.argv.includes('--confere')) {
  const atual = fs.existsSync(ALVO) ? fs.readFileSync(ALVO, 'utf8') : '';
  if (atual !== texto) { console.error(`${path.relative(RAIZ, ALVO)} difere do que este guião escreve.`); process.exit(1); }
  console.log(`${path.relative(RAIZ, ALVO)} é o que este guião escreve.`);
} else {
  fs.writeFileSync(ALVO, texto);
  const partes = BLOCOS.reduce((n, b) => n + b.folhas.reduce((m, f) => m + f.partes.length, 0), 0);
  console.log(`escrito ${path.relative(RAIZ, ALVO)}: ${BLOCOS.length} blocos, ${BLOCOS.reduce((n, b) => n + b.folhas.length, 0)} folhas, ${partes} partes, ${BLOCOS.reduce((n, b) => n + b.algarismos.length, 0)} algarismos.`);
}
