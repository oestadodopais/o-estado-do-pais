/**
 * ===========================================================================
 * AS LEITURAS DOS CARTÕES DOS RENDIMENTOS E DOS PREÇOS (RP1, 26.09.2026),
 * escritas pelo lugar de direção (Claude Fable 5.1) na gramática do L1
 * (`design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs`, o cabeçalho)
 * ===========================================================================
 *
 * O CONSTRUTOR LEVA ESTAS ENTRADAS PARA `src/data/leituras-das-medidas.mjs` sem
 * lhes mudar uma palavra fixa, salvo onde a auditoria das origens (a K17) mostrar
 * que um literal de origem diz a coisa por outras palavras; cada acerto vai no
 * relatório, palavra a palavra. As chaves são os identificadores das linhas que o
 * construtor sela: as medidas mensais e trimestrais têm identificador ESTÁVEL,
 * sem o período (o período é o `reference_date` da linha), e o período anterior é
 * a segunda linha estável que a tabela das réguas declaradas nomeia (o brief, §2,
 * item 2); as anuais seguem a convenção `<medida>-<ano>`. Onde o construtor
 * fixar outro identificador, muda a chave e diz.
 *
 * A regra do L1 fica: as palavras são do lugar de direção; os algarismos são os
 * da linha do cartão, das linhas da régua e dos `nl` com literal de origem; as
 * comparações são ramos escolhidos pela máquina; a leitura não julga o que
 * nenhuma fonte julgou. Sem travessões; «valor de referência» e nunca «limiar».
 */

const anterior = (maior, menor, igual) => ({
  compara: 'anterior',
  maior: [' ', maior, ' ', { periodo: 'anterior' }, '.'],
  menor: [' ', menor, ' ', { periodo: 'anterior' }, '.'],
  igual: [' ', igual, ' ', { periodo: 'anterior' }, '.'],
});
const anteriorSemPeriodo = (maior, menor, igual) => ({ compara: 'anterior', maior: [' ', maior], menor: [' ', menor], igual: [' ', igual] });
const uniao = (maior, menor, igual) => ({ compara: 'ue', maior: [' ', maior], menor: [' ', menor], igual: [' ', igual] });

/* As subidas de preços: «acima» ou «abaixo» de há um ano, pelo sinal; a comparação
   com o mês anterior fala da «variação», que vale para os dois sinais, sem um algarismo. */
const SUBIDA_MES_PT = anteriorSemPeriodo('A variação é maior do que a do mês anterior.', 'A variação é menor do que a do mês anterior.', 'A variação é igual à do mês anterior.');
const SUBIDA_MES_EN = anteriorSemPeriodo('The change is larger than the previous month’s.', 'The change is smaller than the previous month’s.', 'The change is the same as the previous month’s.');
const HA_UM_ANO_PT = (o_que) => ({ sinal: {
  positivo: ['Em ', { periodo: 'proprio' }, ' ', o_que, ' ', { claim: 'proprio', sufixo: ' %' }, ' acima dos de há um ano.'],
  negativo: ['Em ', { periodo: 'proprio' }, ' ', o_que, ' ', { claim: 'proprio', sufixo: ' %' }, ' face aos de há um ano, ou seja, abaixo deles.'],
  zero: ['Em ', { periodo: 'proprio' }, ' ', o_que, ' ao mesmo nível de há um ano.'],
} });
const HA_UM_ANO_EN = (o_que) => ({ sinal: {
  positivo: ['In ', { periodo: 'proprio' }, ' ', o_que, ' ', { claim: 'proprio', sufixo: ' %' }, ' above a year earlier.'],
  negativo: ['In ', { periodo: 'proprio' }, ' ', o_que, ' ', { claim: 'proprio', sufixo: ' %' }, ' compared with a year earlier, that is, below.'],
  zero: ['In ', { periodo: 'proprio' }, ' ', o_que, ' at the same level as a year earlier.'],
} });

export const LEITURAS_RP1 = {
  /* ------------------------------------------------- 1 · Economia e finanças públicas: os preços no consumidor */
  'ipc-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços no consumidor estavam, em média,'), ' É a inflação: o INE mede-a num cabaz de bens e serviços que representa o que as famílias compram.', SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('consumer prices were, on average,'), ' That is inflation: the INE measures it on a basket of goods and services that represents what households buy.', SUBIDA_MES_EN],
  },
  'ipc-variacao-media-12-meses': {
    pt: ['Na média dos doze meses até ', { periodo: 'proprio' }, ', os preços no consumidor subiram ', { claim: 'proprio', sufixo: ' %' }, ' face aos doze meses anteriores: é a inflação média de um ano, que amortece as subidas e descidas de cada mês.', SUBIDA_MES_PT],
    en: ['On average over the twelve months to ', { periodo: 'proprio' }, ', consumer prices rose ', { claim: 'proprio', sufixo: ' %' }, ' compared with the previous twelve months: that is the average inflation of a year, which smooths out each month’s rises and falls.', SUBIDA_MES_EN],
  },
  'ipc-alimentacao-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços dos alimentos e das bebidas não alcoólicas estavam'), SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('the prices of food and non-alcoholic beverages were'), SUBIDA_MES_EN],
  },
  'ipc-energia-em-casa-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços da eletricidade, do gás e dos outros combustíveis usados em casa estavam'), SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('the prices of electricity, gas and other fuels used at home were'), SUBIDA_MES_EN],
  },
  'ipc-combustiveis-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços dos combustíveis para os veículos estavam'), SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('the prices of fuels for vehicles were'), SUBIDA_MES_EN],
  },
  'ihpc-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços em Portugal estavam, na medida harmonizada que serve para comparar os países da União Europeia,'), uniao('A subida é maior do que a da média da União Europeia.', 'A subida é menor do que a da média da União Europeia.', 'A subida é igual à da média da União Europeia.')],
    en: [HA_UM_ANO_EN('prices in Portugal were, on the harmonised measure used to compare the countries of the European Union,'), uniao('The rise is larger than the European Union average.', 'The rise is smaller than the European Union average.', 'The rise is the same as the European Union average.')],
  },

  /* ------------------------------------------------- 9 · Habitação: as rendas e a referência da sua atualização */
  'ipc-rendas-variacao-homologa': {
    pt: [HA_UM_ANO_PT('as rendas pagas pelos inquilinos estavam, na medida do índice de preços no consumidor,'), SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('the rents paid by tenants were, on the consumer price index measure,'), SUBIDA_MES_EN],
  },
  'ipc-sem-habitacao-variacao-media-12-meses': {
    pt: ['Na média dos doze meses até ', { periodo: 'proprio' }, ', os preços no consumidor sem a habitação subiram ', { claim: 'proprio', sufixo: ' %' }, ' face aos doze meses anteriores: é o número que serve de referência para a atualização das rendas no ano seguinte.', SUBIDA_MES_PT],
    en: ['On average over the twelve months to ', { periodo: 'proprio' }, ', consumer prices excluding housing rose ', { claim: 'proprio', sufixo: ' %' }, ' compared with the previous twelve months: that is the reference figure for updating rents in the following year.', SUBIDA_MES_EN],
  },

  /* ------------------------------------------------- 2 · Trabalho: a remuneração média */
  'remuneracao-bruta-mensal-media': {
    pt: ['No ', { periodo: 'proprio' }, ', quem trabalha por conta de outrem ganhou em média ', { claim: 'proprio' }, ' euros por mês, antes de descontos e contando os subsídios, nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações; cada pessoa conta tantas vezes quantos os empregos que tem.', anteriorSemPeriodo('Mais do que no mesmo trimestre de há um ano.', 'Menos do que no mesmo trimestre de há um ano.', 'O mesmo que no mesmo trimestre de há um ano.')],
    en: ['In the ', { periodo: 'proprio' }, ', employees earned on average ', { claim: 'proprio' }, ' euros a month, before deductions and including holiday and Christmas pay, in the jobs declared to Social Security and to the civil-service pension fund; each person counts as many times as the jobs they hold.', anteriorSemPeriodo('More than in the same quarter a year earlier.', 'Less than in the same quarter a year earlier.', 'The same as in the same quarter a year earlier.')],
  },
  'remuneracao-bruta-mensal-media-variacao-real': {
    pt: ['Descontada a subida dos preços, a remuneração média ', { sinal: { positivo: ['subiu ', { claim: 'proprio', sufixo: ' %' }], negativo: ['variou ', { claim: 'proprio', sufixo: ' %' }], zero: ['não variou'] } }, ' face ao mesmo trimestre de há um ano: é o INE que faz esta conta, com o índice de preços no consumidor.'],
    en: ['With the rise in prices taken out, average pay ', { sinal: { positivo: ['rose ', { claim: 'proprio', sufixo: ' %' }], negativo: ['changed by ', { claim: 'proprio', sufixo: ' %' }], zero: ['did not change'] } }, ' compared with the same quarter a year earlier: the INE does this calculation, with the consumer price index.'],
  },

  /* ------------------------------------------------- 5 · Segurança social e pensões */
  'pensao-media-anual-2025': {
    pt: ['Em ', { periodo: 'proprio' }, ' uma pensão da Segurança Social valeu em média ', { claim: 'proprio' }, ' euros no ano inteiro, contando todas as pensões pagas, de velhice, de invalidez e de sobrevivência; é uma média entre pensões muito diferentes, e não a pensão de ninguém.', anterior('Subiu face a', 'Desceu face a', 'Ficou igual a')],
    en: ['In ', { periodo: 'proprio' }, ' a Social Security pension was worth on average ', { claim: 'proprio' }, ' euros over the whole year, counting all pensions paid, for old age, invalidity and survivors; it is an average of very different pensions, and nobody’s pension.', anterior('Up from', 'Down from', 'Unchanged from')],
  },
  'beneficiarios-do-rsi-por-mil-2024': {
    pt: ['Em ', { periodo: 'proprio' }, ', por cada mil pessoas em idade ativa, ', { claim: 'proprio' }, ' recebiam o rendimento social de inserção, o apoio do Estado a quem não tem rendimentos que cheguem para as necessidades mínimas.', anterior('Mais do que em', 'Menos do que em', 'O mesmo que em')],
    en: ['In ', { periodo: 'proprio' }, ', for every thousand people of working age, ', { claim: 'proprio' }, ' received the social insertion income, the State’s support for those whose income does not cover minimum needs.', anterior('More than in', 'Fewer than in', 'The same as in')],
  },
  'linha-de-risco-de-pobreza-2025': {
    pt: ['Em ', { periodo: 'proprio' }, ', uma pessoa que vivesse sozinha estava em risco de pobreza se tivesse menos de ', { claim: 'proprio' }, ' euros por ano para viver, depois dos impostos e contando as prestações sociais: é a linha que o Eurostat traça a ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % do rendimento mediano do país, o do meio, em que metade da população tem mais e metade tem menos.', anterior('Subiu face a', 'Desceu face a', 'Ficou igual a')],
    en: ['In ', { periodo: 'proprio' }, ', a person living alone was at risk of poverty with less than ', { claim: 'proprio' }, ' euros a year to live on, after taxes and including social benefits: that is the line Eurostat draws at ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % of the country’s median income, the one in the middle, where half the population has more and half has less.', anterior('Up from', 'Down from', 'Unchanged from')],
  },
};
