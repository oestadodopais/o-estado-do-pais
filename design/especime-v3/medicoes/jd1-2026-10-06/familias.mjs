/** JD1: cada parte lê a linha ou uma origem selada desta corrida. */
const L = (campo, literal) => ({ linha: 'propria', campo, literal });
const O = (origem, literal) => ({ origem, campo: 'excerto', literal });
const diz = (pt, en, ...apoios) => ({ pt, en, classe: 'diz', apoios });
const liga = (pt, en) => ({ pt, en, classe: 'liga' });
const ponto = liga('.', '.');

export const FAMILIAS_JD1 = [
  {
    chaves: ['juros-das-administracoes-publicas'],
    nome: { pt: 'Juros das administrações públicas', en: 'General government interest expenditure' },
    partes: [
      diz('É a despesa em juros', 'It is interest expenditure', L('name', 'Juros')),
      diz(' das administrações públicas', ' by general government', O('jd1-ine-ambito', 'Administrações Públicas')),
      diz(', nas contas nacionais', ', in national accounts', O('jd1-ine-ambito', 'Sistema Europeu de Contas Nacionais e Regionais 2010')),
      ponto,
    ],
  },
  {
    chaves: ['pib-nominal-notificacao-setembro'],
    nome: { pt: 'PIB a preços de mercado, notificação de setembro', en: 'GDP at market prices, September notification' },
    partes: [diz('É o produto interno bruto a preços de mercado', 'It is gross domestic product at market prices', L('name', 'Produto Interno Bruto, a preços de mercado')), ponto],
  },
  {
    chaves: ['juros-das-administracoes-publicas-pib'],
    nome: { pt: 'Juros das administrações públicas em percentagem do PIB', en: 'General government interest expenditure as a share of GDP' },
    partes: [
      diz('São os juros das administrações públicas em percentagem do produto interno bruto do mesmo ano', 'It is general government interest expenditure as a percentage of gross domestic product for the same year',
        L('derivation', 'Dividir os juros das administrações públicas pelo produto interno bruto a preços de mercado do mesmo ano'), L('derivation', 'multiplicar por cem')),
      diz(', calculados pela casa a partir dos dois montantes da mesma notificação do INE', ', calculated here from both amounts in the same INE notification', L('derivation', 'na mesma notificação do INE')),
      ponto,
    ],
  },
  {
    chaves: ['juros-das-administracoes-publicas-ue'],
    nome: { pt: 'Juros das administrações públicas na União Europeia, em percentagem do PIB', en: 'General government interest expenditure in the European Union, as a share of GDP' },
    partes: [
      diz('É a despesa das administrações públicas em juros', 'It is general government interest expenditure', L('excerpt', 'Interest, expenditure'), L('excerpt', 'General government')),
      diz(' no conjunto da União Europeia', ' across the European Union', L('excerpt', 'European Union - 27 countries (from 2020)')),
      diz(', em percentagem do PIB', ', as a percentage of GDP', L('excerpt', 'Percentage of gross domestic product (GDP)')),
      ponto,
    ],
  },
  {
    chaves: ['juros-e-outros-encargos-execucao'],
    nome: { pt: 'Juros e outros encargos pagos pelas administrações públicas, janeiro a agosto', en: 'Interest and other charges paid by general government, January to August' },
    partes: [
      diz('É a despesa consolidada das administrações públicas com juros e outros encargos', 'It is consolidated general government expenditure on interest and other charges',
        L('name', 'Juros e outros encargos'), O('jd1-eo-conta', 'Conta consolidada das Administrações Públicas')),
      diz(', acumulada de janeiro a agosto', ', accumulated from January to August', O('jd1-eo-conta', 'Período: janeiro a agosto')),
      diz(', na ótica dos pagamentos', ', on a payments basis', O('jd1-eo-caixa', 'pagamentos e recebimentos ocorridos em determinado período')),
      ponto,
    ],
  },
  {
    chaves: ['custo-do-stock-da-divida-direta'],
    nome: { pt: 'Custo da dívida direta do Estado em circulação', en: 'Cost of outstanding State direct debt' },
    partes: [
      diz('É a relação entre os juros do subsetor Estado nas contas nacionais', 'It is the ratio of State subsector interest costs in national accounts', O('jd1-igcp-custo', 'rácio entre juros do subsetor Estado na ótica de Contas Nacionais')),
      diz(' e o saldo médio da dívida direta do Estado no final de dois anos consecutivos', ' to average State direct debt outstanding at the end of two consecutive years', O('jd1-igcp-custo', 'saldo médio da dívida direta do Estado no final dos anos t e t-1')),
      ponto,
    ],
  },
  {
    chaves: ['custo-da-divida-emitida'],
    nome: { pt: 'Custo da dívida emitida pelo Estado, até agosto', en: 'Cost of State debt issued, through August' },
    partes: [
      diz('É o custo médio da dívida emitida no ano, nos instrumentos BT, OT, OTRV e MTN', 'It is the average cost of debt issued during the year through BT, OT, OTRV and MTN instruments', O('jd1-igcp-custo', 'custo médio dos BT, OT, OTRV e MTN emitidos no ano correspondente')),
      diz(', ponderado pelo montante e pelo prazo', ', weighted by amount and maturity', O('jd1-igcp-custo', 'ponderado pelo montante e maturidade')),
      ponto,
    ],
  },
  {
    chaves: ['divida-direta-do-estado'],
    nome: { pt: 'Dívida direta do Estado no fim de agosto', en: 'State direct debt at the end of August' },
    partes: [
      diz('É o total da dívida direta do Estado', 'It is total State direct debt', L('name', 'Dívida total'), O('jd1-igcp-divida', 'Dívida Direta do Estado')),
      diz(' no fim de agosto', ' at the end of August', L('document.locator', 'saldo em 31/ago/26')),
      liga('.', '.'),
    ],
  },
  {
    chaves: ['necessidades-brutas-de-financiamento'],
    nome: { pt: 'Necessidades brutas de financiamento do Estado', en: 'Gross State financing needs' },
    partes: [
      diz('É o financiamento de que o Estado precisou, somando as necessidades líquidas às amortizações e anulações de dívida fundada', 'It is the financing the State needed, adding net financing needs to redemptions and cancellations of funded debt',
        L('name', 'NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)'), O('jd1-igcp-financiamento', '1. NECESSIDADES LÍQUIDAS DE FINANCIAMENTO'), O('jd1-igcp-financiamento', '2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)')),
      diz(', em contabilidade orçamental pública', ', on a public budget accounting basis', O('jd1-igcp-financiamento', 'contabilidade orçamental pública')),
      ponto,
    ],
  },
  {
    chaves: ['emissoes-de-divida-fundada'],
    nome: { pt: 'Emissões de dívida fundada do Estado no ano civil', en: 'State funded debt issued during the calendar year' },
    partes: [
      diz('É o montante de dívida fundada que o Estado emitiu no ano civil', 'It is the amount of funded debt the State issued during the calendar year', L('name', 'EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)'), O('jd1-igcp-financiamento', 'financiamento do Estado')),
      diz(', em contabilidade orçamental pública', ', on a public budget accounting basis', O('jd1-igcp-financiamento', 'contabilidade orçamental pública')),
      ponto,
    ],
  },
];
