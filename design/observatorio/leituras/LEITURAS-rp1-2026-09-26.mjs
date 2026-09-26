/**
 * ===========================================================================
 * AS LEITURAS DOS CARTÕES DOS RENDIMENTOS E DOS PREÇOS (RP1, 26.09.2026),
 * escritas pelo lugar de direção (Claude Fable 5.1) na gramática do L1
 * (`design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs`, o cabeçalho)
 * ===========================================================================
 *
 * A TERCEIRA REDAÇÃO (26.09.2026 ao fim da tarde, a peça RP1c), depois da leitura a
 * frio do Claude Opus 5.5 (`design/especime-v3/critica/LEITURA-rp1-2026-09-26.md`):
 * a leitura do RSI volta a dizer a quem é o apoio e o que é a idade ativa, e a das
 * pensões apoia os três tipos nas categorias da própria resposta do INE; o acerto
 * dos lubrificantes da peça RP1b (a categoria do INE é «Combustível e lubrificantes»)
 * fica fundido. A SEGUNDA
 * REDAÇÃO (26.09.2026 à tarde, a peça RP1b) tinha dito: A primeira entrega do
 * construtor (o Codex gpt-6-astra, oito medidas seladas) trouxe vinte e duas
 * trocas de palavras, cada uma com o seu literal, em
 * `design/especime-v3/medicoes/rp1-2026-09-26/acertos-rp1.json`; o lugar de
 * direção leu-as e fundiu aqui as que aceitou (as médias dos doze meses sem
 * pressuposto de subida, a unidade dentro do valor selado da remuneração, o
 * denominador das pensões, o RSI pelo conceito publicado, o ano do inquérito
 * na linha de pobreza), com duas emendas suas: as médias dos doze meses ganham
 * um ramo pelo sinal («subiram» quando o valor é positivo, «variaram» quando é
 * negativo), e a leitura da linha de pobreza volta a frases curtas. A medida
 * `remuneracao-bruta-mensal-media-variacao-real` sai: a API do INE não publica
 * um indicador da variação real (as pesquisas do catálogo estão nos pedidos
 * 022 e 023 do motor), e o projeto não a calcula neste bloco (o brief, §5).
 *
 * O CONSTRUTOR LEVA ESTAS ENTRADAS PARA `src/data/leituras-rp1.mjs` sem lhes
 * mudar uma palavra fixa, salvo onde a auditoria das origens (a K17) mostrar
 * que um literal de origem diz a coisa por outras palavras; cada acerto vai no
 * relatório, palavra a palavra, e `acertos-rp1.py` prova a igualdade fora dos
 * acertos. As chaves são os identificadores das linhas seladas: as medidas
 * mensais e trimestrais têm identificador ESTÁVEL, sem o período (o período é
 * o `reference_date` da linha), e o período anterior é a segunda linha estável
 * que a tabela das réguas declaradas nomeia (`…-periodo-anterior`); a linha da
 * União do IHPC é `ihpc-variacao-homologa-ue`; as anuais seguem a convenção
 * `<medida>-<ano>`.
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
/* As médias dos doze meses: o verbo pelo sinal, sem pressupor uma subida. */
const MEDIA_PT = { sinal: { positivo: ['subiram ', { claim: 'proprio', sufixo: ' %' }], negativo: ['variaram ', { claim: 'proprio', sufixo: ' %' }], zero: ['não variaram'] } };
const MEDIA_EN = { sinal: { positivo: ['rose ', { claim: 'proprio', sufixo: ' %' }], negativo: ['changed by ', { claim: 'proprio', sufixo: ' %' }], zero: ['did not change'] } };

export const LEITURAS_RP1 = {
  /* ------------------------------------------------- 1 · Economia e finanças públicas: os preços no consumidor */
  'ipc-variacao-homologa': {
    pt: [HA_UM_ANO_PT('os preços no consumidor estavam, em média,'), ' É a inflação: o INE mede-a num cabaz de bens e serviços que representa o que as famílias compram.', SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('consumer prices were, on average,'), ' That is inflation: the INE measures it on a basket of goods and services that represents what households buy.', SUBIDA_MES_EN],
  },
  'ipc-variacao-media-12-meses': {
    pt: ['Na média dos doze meses até ', { periodo: 'proprio' }, ', os preços no consumidor ', MEDIA_PT, ' face aos doze meses anteriores: é a inflação média de um ano, que amortece as subidas e descidas de cada mês.', SUBIDA_MES_PT],
    en: ['On average over the twelve months to ', { periodo: 'proprio' }, ', consumer prices ', MEDIA_EN, ' compared with the previous twelve months: that is the average inflation of a year, which smooths out each month’s rises and falls.', SUBIDA_MES_EN],
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
    pt: [HA_UM_ANO_PT('os preços dos combustíveis e dos lubrificantes para os veículos estavam'), SUBIDA_MES_PT],
    en: [HA_UM_ANO_EN('the prices of fuels and lubricants for vehicles were'), SUBIDA_MES_EN],
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
    pt: ['Na média dos doze meses até ', { periodo: 'proprio' }, ', os preços no consumidor sem a habitação ', MEDIA_PT, ' face aos doze meses anteriores. O valor de agosto serve de referência para a atualização das rendas no ano seguinte.', SUBIDA_MES_PT],
    en: ['On average over the twelve months to ', { periodo: 'proprio' }, ', consumer prices excluding housing ', MEDIA_EN, ' compared with the previous twelve months. The August value is the reference figure for updating rents in the following year.', SUBIDA_MES_EN],
  },

  /* ------------------------------------------------- 2 · Trabalho: a remuneração média */
  'remuneracao-bruta-mensal-media': {
    pt: ['No ', { periodo: 'proprio' }, ', quem trabalha por conta de outrem ganhou em média ', { claim: 'proprio', sufixo: ' euros por mês' }, ', antes de descontos e contando os subsídios, nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações; cada pessoa conta tantas vezes quantos os empregos que tem.', anteriorSemPeriodo('Mais do que no mesmo trimestre de há um ano.', 'Menos do que no mesmo trimestre de há um ano.', 'O mesmo que no mesmo trimestre de há um ano.')],
    en: ['In the ', { periodo: 'proprio' }, ', employees earned on average ', { claim: 'proprio', sufixo: ' euros a month' }, ', before deductions and including holiday and Christmas pay, in the jobs declared to Social Security and to the civil-service pension fund; each person counts as many times as the jobs they hold.', anteriorSemPeriodo('More than in the same quarter a year earlier.', 'Less than in the same quarter a year earlier.', 'The same as in the same quarter a year earlier.')],
  },

  /* ------------------------------------------------- 5 · Segurança social e pensões */
  'pensao-media-anual-2025': {
    pt: ['Em ', { periodo: 'proprio' }, ' o valor das pensões pagas pela Segurança Social foi, em média, de ', { claim: 'proprio' }, ' euros por pensionista no ano inteiro, no total das pensões de velhice, de invalidez e de sobrevivência.', anterior('Subiu face a', 'Desceu face a', 'Ficou igual a')],
    en: ['In ', { periodo: 'proprio' }, ' the amount of pensions paid by Social Security was, on average, ', { claim: 'proprio' }, ' euros per pensioner over the whole year, in the total of old-age, invalidity and survivors’ pensions.', anterior('Up from', 'Down from', 'Unchanged from')],
  },
  'beneficiarios-do-rsi-por-mil-2024': {
    pt: ['Em ', { periodo: 'proprio' }, ' havia ', { claim: 'proprio' }, ' pessoas a receber o rendimento social de inserção por cada mil pessoas em idade ativa, dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos: é o apoio da Segurança Social a quem vive em carência económica grave, com um programa de inserção no trabalho e na comunidade.', anterior('Mais do que em', 'Menos do que em', 'O mesmo que em')],
    en: ['In ', { periodo: 'proprio' }, ' there were ', { claim: 'proprio' }, ' people receiving social insertion income for every thousand people of working age, from ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' years old: it is Social Security’s support for people living in severe economic hardship, with a programme of integration into work and the community.', anterior('More than in', 'Fewer than in', 'The same as in')],
  },
  'linha-de-risco-de-pobreza-2025': {
    pt: ['No inquérito de ', { periodo: 'proprio' }, ', uma pessoa que vivesse sozinha estava em risco de pobreza se, no ano anterior, tivesse tido menos de ', { claim: 'proprio' }, ' euros, depois dos impostos e das contribuições sociais e contando as prestações sociais. É a linha que o Eurostat traça a ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % do rendimento mediano do país, ajustado ao tamanho e à composição de cada família. Mediano é o do meio: metade da população tem mais e metade tem menos.', anterior('Subiu face a', 'Desceu face a', 'Ficou igual a')],
    en: ['In the survey for ', { periodo: 'proprio' }, ', a person living alone was at risk of poverty if, in the previous year, they had had less than ', { claim: 'proprio' }, ' euros, after taxes and social contributions and including social benefits. That is the line Eurostat draws at ', { nl: '60', motivo: 'escala-de-instrumento' }, ' % of the country’s median income, adjusted for each household’s size and composition. Median means the one in the middle: half the population has more and half has less.', anterior('Up from', 'Down from', 'Unchanged from')],
  },
};
