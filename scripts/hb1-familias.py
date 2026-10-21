import json,re,sys
from pathlib import Path
root=Path(sys.argv[1]);site=Path.cwd();report=site/'design/especime-v3/medicoes/hb1-2026-10-21'
b=json.loads((root/'content/28 Habitacao Estudo/ledger.json').read_text())['claims'];manifest=json.loads((root/'publisher/manifest.hb1.json').read_text());ids={r['site_id'] for r in manifest['rows']}
pairs={}
def pairs_add(text):
 for line in text.strip().splitlines():
  k,pt,en=line.split('|');pairs[k]=(pt,en)
pairs_add('''hab-arrendamento-exposicao-vagos|Estimativa do Governo de alojamentos vagos em boas condições|Government estimate of vacant dwellings in good condition
hab-eurostat-privacao-severa-definicao|Definição de privação severa da habitação|Definition of severe housing deprivation
hab-oe-legenda-invariante|Legenda das medidas invariantes do Orçamento|Budget table legend for unchanged measures
hab-imprensa-manif-lusa|Manifestantes em Lisboa, pela notícia que cita a Lusa|Demonstrators in Lisbon, reported in an article citing Lusa
hab-imprensa-manif-lusa-organizacoes|Organizações da plataforma, pela notícia que cita a Lusa|Platform organisations, reported in an article citing Lusa
hab-votacao-arrendamento|Votação da reforma do arrendamento|Vote on rental reform
hab-governo-feh|Anúncio do fundo de emergência para a habitação|Announcement of the housing emergency fund
hab-imprensa-manif-euronews|Organizações da plataforma, pela Euronews|Platform organisations, reported by Euronews
hab-imprensa-feridos37|Feridos segundo o movimento, pela imprensa|Injured people according to the movement, reported by the press
hab-imprensa-feridos39|Feridos segundo a organização, pela imprensa|Injured people according to the organisation, reported by the press
hab-imprensa-feridos35|Feridos segundo um dirigente do BE, pela imprensa|Injured according to a BE leader, via the press
hab-governo-arrendamento|Anúncio da reforma do arrendamento|Announcement of rental reform
hab-imprensa-igai|Processo da inspeção, pela imprensa|Inspectorate case, reported by the press
hab-imprensa-psp-ferido|Polícia ferido, segundo a PSP, pela imprensa|Police officer injured, according to the PSP, reported by the press
hab-be-despejos|Afirmação do Bloco sobre os despejos|Left Bloc statement on evictions
hab-governo-construir|Anúncio dos incentivos à construção|Announcement of construction incentives
hab-ps-vazias|Afirmação do PS sobre casas vazias habitáveis|PS statement on habitable vacant homes
hab-oe-apoios-jovens|Apoios à habitação dos jovens no Orçamento|Budget support for young people's housing
hab-oe-fiscal|Medidas fiscais da habitação no Orçamento|Housing tax measures in the Budget
hab-oe-oferta|Oferta de habitação no Orçamento|Housing supply in the Budget
hab-dl97-irs|Taxa de IRS das rendas|Income tax rate on rents
hab-dl97-deducao|Norma transitória da dedução das rendas|Transitional rule for the rent deduction
hab-dl97-deducao-2027|Limite da dedução das rendas|Limit on the rent deduction
posicao-ps-rendas|Proposta do PS para a dedução das rendas|PS proposal for the rent deduction
hab-arrendamento-exposicao|Exposição de motivos da reforma do arrendamento|Explanatory memorandum of rental reform
hab-ps-mais-valias|Proposta do PS sobre mais-valias|PS proposal on capital gains
hab-ps-rendas|Proposta do PS sobre rendas|PS proposal on rents
hab-pcp-rendas|Proposta do PCP sobre rendas|PCP proposal on rents
hab-pan-controlo|Proposta do PAN sobre controlo de rendas|PAN proposal on rent control
hab-pan-caucoes|Proposta do PAN sobre cauções|PAN proposal on deposits
hab-pan-tetos|Proposta do PAN sobre limites às rendas|PAN proposal on rent limits
hab-votacao-pan|Votação da proposta do PAN|Vote on the PAN proposal
hab-livre-reinvestimento|Proposta do Livre sobre reinvestimento|Livre proposal on reinvestment
hab-votacao-livre|Votação da proposta do Livre|Vote on the Livre proposal
hab-chega-reinvestimento|Proposta do Chega sobre reinvestimento|Chega proposal on reinvestment
hab-votacao-chega|Votação da proposta do Chega|Vote on the Chega proposal
posicao-chega-habitacao|Pacote do Chega para a habitação, pela imprensa|Chega housing package, reported by the press
hab-il-proposta|Proposta da Iniciativa Liberal sobre habitação|Iniciativa Liberal housing proposal
hab-imprensa-manif-rtp|Manifestantes no Porto, pela RTP|Demonstrators in Porto, reported by RTP
hab-cgtp-convocatoria|Convocatória divulgada pelo sindicato|Call circulated by the union
hab-plataforma-reivindicacoes|Reivindicações da plataforma|Platform demands
hab-imprensa-renda-metade|Afirmação da plataforma sobre renda e salário, pela imprensa|Platform statement on rent and pay, reported by the press
hab-imprensa-tendas|Retirada das tendas, pela RTP|Removal of tents, reported by RTP
hab-imprensa-acampados|Comunicado dos acampados, pela imprensa|Campers' statement, reported by the press
hab-imprensa-assistidos|Pessoas assistidas, pela imprensa|People assisted, reported by the press
hab-imprensa-hospital|Pessoas encaminhadas para o hospital, pela imprensa|People referred to hospital, reported by the press
hab-imprensa-pm-15|Declaração do primeiro-ministro após a intervenção, pela imprensa|Prime Minister's statement after the intervention, reported by the press
hab-imprensa-pm-16|Declaração posterior do primeiro-ministro, pela imprensa|Prime Minister's subsequent statement, reported by the press
hab-imprensa-mai|Declaração do ministro da Administração Interna, pela imprensa|Statement by the Minister of Home Affairs, reported by the press
hab-imprensa-amorim|Declaração do ministro dos Assuntos Parlamentares, pela imprensa|Statement by the Minister for Parliamentary Affairs, reported by the press
hab-imprensa-debate-custos|Afirmação do primeiro-ministro sobre os preços, pela imprensa|Prime Minister's statement on prices, reported by the press
hab-imprensa-debate-protecao|Afirmação do primeiro-ministro sobre a proteção dos inquilinos, pela imprensa|Prime Minister's statement on tenant protection, reported by the press
hab-ine-preco-mediano|Preço mediano das vendas em Portugal|Median sale price in Portugal
hab-ine-preco-lisboa|Preço mediano das vendas em Lisboa|Median sale price in Lisbon
hab-ine-preco-porto|Preço mediano das vendas no Porto|Median sale price in Porto
hab-ine-renda-portugal|Renda mediana dos novos contratos em Portugal|Median rent of new contracts in Portugal
hab-ine-renda-lisboa|Renda mediana dos novos contratos em Lisboa|Median rent of new contracts in Lisbon
hab-ine-renda-porto|Renda mediana dos novos contratos no Porto|Median rent of new contracts in Porto
hab-oe-habitacao-orcamento|Orçamento do programa Habitação|Housing programme budget
hab-oe-iva-impacto|Impacto na receita da redução do IVA na construção|Revenue impact of reduced VAT on construction
hab-oe-irs-rendas-impacto|Impacto na receita da redução do IRS nas rendas|Revenue impact of reduced income tax on rents
hab-ine-vagos-total|Alojamentos vagos nos Censos|Vacant dwellings in the Census
hab-ine-censos-0012517-0|Proporção de alojamentos vagos nos Censos|Share of vacant dwellings in the Census
hab-ine-iphab-homologa|Variação homóloga dos preços da habitação|Annual change in house prices
hab-ine-censos-0012501-40|Alojamentos vagos para venda ou arrendamento|Dwellings vacant for sale or rent
hab-ine-censos-0012501-41|Alojamentos vagos por outros motivos|Dwellings vacant for other reasons
hab-ine-juro-implicito|Taxa de juro implícita no crédito à habitação|Implicit interest rate on housing loans
hab-oe-oferta-publica|Orçamento da oferta e reabilitação habitacional|Budget for housing supply and rehabilitation
hab-oe-apoio-arrendamento|Orçamento do acesso à habitação e apoio ao arrendamento|Budget for housing access and rental support
hab-oe-licenciamento|Orçamento da gestão urbanística e qualidade do edificado|Budget for urban management and building quality
hab-ine-calendario-precos-locais|Divulgação dos preços locais da habitação|Release of local house prices
hab-ine-calendario-juro|Divulgação do juro implícito na habitação|Release of the implicit housing interest rate
oe-2027-calendario-generalidade|Votação do Orçamento na generalidade|Budget first-reading vote
hab-bpstat-12533724|Novas operações de crédito à habitação|New housing loans
hab-bpstat-12533735|Taxa de juro das novas operações de crédito à habitação|Interest rate on new housing loans
hab-bpstat-12557378|Crédito à habitação das famílias em dívida|Outstanding household housing loans''')
geo={'PT':('Portugal','Portugal'),'EU27_2020':('União Europeia','European Union'),'FI':('Finlândia','Finland'),'HU':('Hungria','Hungary'),'RO':('Roménia','Romania'),'NL':('Países Baixos','Netherlands'),'HR':('Croácia','Croatia'),'DE':('Alemanha','Germany'),'CY':('Chipre','Cyprus'),'EL':('Grécia','Greece'),'MT':('Malta','Malta'),'LV':('Letónia','Latvia'),'DK':('Dinamarca','Denmark')}
stat={
 'prc-hpi-q':('Preços da habitação','House prices'),
 'tipsho10':('Preços da habitação descontada a inflação','House prices net of inflation'),
 'tipsho60':('Preços das casas em relação ao rendimento','House prices relative to income'),
 'tespm140':('Sobrecarga do custo da habitação','Housing cost overburden'),
 'prc-hicp':('Variação das rendas pagas','Change in rents paid'),
 'ilc-lvho02':('População por regime de ocupação','Population by tenure status'),
 'ilc-mded01':('Parte do rendimento gasta na habitação','Share of income spent on housing'),
 'ilc-lvho07':('Sobrecarga do custo da habitação','Housing cost overburden'),
 'ilc-lvho05a':('População em habitações sobrelotadas','Population in overcrowded homes'),
 'ilc-mdho06a':('Privação severa da habitação','Severe housing deprivation'),
 'yth-demo-030':('Idade média de saída de casa dos pais','Average age of leaving the parental home'),
 'ilc-lvps08':('Jovens que vivem com os pais ou partilham o rendimento do agregado','Young people living with parents or sharing household income'),
 'sts-cobp':('Alojamentos licenciados','Dwellings permitted'),
 'cens-21dwob':('Alojamentos nos Censos','Dwellings in the Census'),
 'demo-pjan':('População no início do ano','Population at the start of the year')}
tenure={'OWN_L':('proprietários com empréstimo','owners with a loan'),'OWN_NL':('proprietários sem empréstimo','owners without a loan'),'RENT_MKT':('inquilinos a preços de mercado','tenants at market rents'),'RENT_FR':('inquilinos a renda reduzida ou gratuita','tenants at reduced or free rent')}
der={
 'proprietarios':('População em casa própria','Population in owner-occupied homes'),
 'inquilinos':('População em casa arrendada','Population in rented homes'),
 'fiscal':('Impacto conjunto das medidas fiscais da habitação','Combined impact of housing tax measures'),
 'sobrecarga-inquilinos-pt-2020-2025':('Variação da sobrecarga dos inquilinos em Portugal desde o início da década','Change in tenant overburden in Portugal since the start of the decade'),
 'jovens-com-pais':('Diferença face à União nos jovens que vivem com os pais','Gap from the Union in young people living with parents'),
 'licencas-por-mil':('Alojamentos licenciados por mil habitantes','Dwellings permitted per thousand inhabitants'),
 'precos-reais':('Diferença face à União no índice dos preços reais','Gap from the Union in the real price index'),
 'preco-rendimento-acima-2015':('Aumento dos preços face ao rendimento desde o ano base','Increase in prices relative to income since the base year'),
 'preco-rendimento-lt':('Distância do rácio preço-rendimento à média de longo prazo','Distance of the price-to-income ratio from the long-term average'),
 'preco-rendimento':('Diferença face à União no índice preço-rendimento','Gap from the Union in the price-to-income index'),
 'preco-lisboa':('Preço mediano em Lisboa em relação ao país','Median price in Lisbon relative to the country'),
 'renda-lisboa':('Renda mediana em Lisboa em relação ao país','Median rent in Lisbon relative to the country'),
 'sobrecarga-inquilinos':('Diferença face à União na sobrecarga dos inquilinos','Gap from the Union in tenant overburden'),
 'saida':('Diferença face à União na idade de saída de casa dos pais','Gap from the Union in the age of leaving the parental home'),
 'vagos':('Proporção calculada de alojamentos vagos','Calculated share of vacant dwellings')}
SOB=('A taxa de sobrecarga dos custos da habitação é a parte da população que vive em agregados onde a despesa total com a casa, descontados os subsídios, passa de quarenta por cento do rendimento disponível','The housing cost overburden rate is the share of the population living in households where total housing costs, net of housing allowances, exceed forty percent of disposable income',['is the percentage of the population living in households where the total housing costs (\'net\' of housing allowances) represent more than 40 % of disposable income'])
HPI=['measures the changes in the transaction prices of dwellings purchased by households']
REAL=['is the ratio between the house price index (HPI) and the national accounts deflator for private final consumption expenditure']
# HB1-c2 (o achado 16): o que cada número é, traduzido da definição alojada (a origem) ou,
# onde o Eurostat não publica uma página de definição, do rótulo do corpo na linha própria.
DEFS=[
 ('prc-hpi-q',['RCH_A'],'hb1c-eurostat-ipH','A variação num ano do índice dos preços das transações de casas compradas pelas famílias','The change over one year in the index of the transaction prices of dwellings purchased by households',HPI),
 ('prc-hpi-q',None,'hb1c-eurostat-ipH','O índice dos preços das transações de casas compradas pelas famílias, com o ano base igual a cem','The index of the transaction prices of dwellings purchased by households, with the base year equal to one hundred',HPI),
 ('tipsho10',['RCH_A','RCH_A_AVG'],'hb1c-eurostat-precos-reais','A variação num ano do índice dos preços das casas descontada a inflação, que é o índice dos preços da habitação dividido pelo deflator do consumo privado das contas nacionais','The change over one year in the house price index net of inflation, which is the house price index divided by the national accounts deflator for private consumption',REAL),
 ('tipsho10',None,'hb1c-eurostat-precos-reais','O índice dos preços das casas descontada a inflação, que é o índice dos preços da habitação dividido pelo deflator do consumo privado das contas nacionais, com o ano base igual a cem','The house price index net of inflation, which is the house price index divided by the national accounts deflator for private consumption, with the base year equal to one hundred',REAL),
 ('tipsho60',['PTIR_LT_AVG'],'hb1c-eurostat-preco-rendimento','O rácio entre os preços das casas e o rendimento das famílias face à sua média de longo prazo, que vale cem quando o rácio está nessa média','The ratio of house prices to household income relative to its long-term average, which equals one hundred when the ratio is at that average',['is defined as the ratio of the current price to income ratio relative to the long-term average price-to-income ratio','If the ratio equals 100']),
 ('tipsho60',None,'hb1c-eurostat-preco-rendimento','O rácio entre os preços das casas e o rendimento disponível bruto ajustado das famílias por habitante, em índice com o ano base igual a cem','The ratio of house prices to adjusted gross disposable household income per head, as an index with the base year equal to one hundred',['income is calculated as adjusted household gross disposable income (B7G) per head of population']),
 ('tespm140',None,'hb1c-eurostat-sobrecarga')+SOB,
 ('ilc-lvho07',None,'hb1c-eurostat-sobrecarga')+SOB,
 ('prc-hicp',None,'hb1c-eurostat-ihpc','A variação dos preços das rendas pagas pelos inquilinos no índice harmonizado de preços no consumidor, o índice de preços no consumidor calculado na União Europeia com um método e definições comuns','The change in the prices of rents paid by tenants in the harmonised index of consumer prices, the consumer price index calculated in the European Union with a common method and definitions',['is the consumer price index as it is calculated in the European Union (EU), according to a harmonised approach and a single set of definitions']),
 ('ilc-mded01',None,'hb1c-eurostat-custos-habitacao','A parte do rendimento disponível do agregado que vai para a despesa com a casa, que o Eurostat define como os gastos mensais ligados ao direito de viver numa casa','The share of disposable household income that goes on housing costs, which Eurostat defines as the monthly expenses associated with the right to live in a dwelling',['Housing costs refer to the monthly expenses associated with the right to live in a dwelling.']),
 ('ilc-lvho05a',None,'hb1c-eurostat-sobrelotacao','A taxa de sobrelotação é a parte da população que vive num agregado sobrelotado, que não tem o número mínimo de divisões que o Eurostat fixa para a sua composição','The overcrowding rate is the share of the population living in an overcrowded household, one without the minimum number of rooms Eurostat sets for its composition',['is defined as the percentage of the population living in an overcrowded household','does not have at its disposal a minimum number of rooms']),
 ('ilc-mdho06a',None,'hb1c-eurostat-privacao-severa','A parte da população que vive numa casa sobrelotada e, ao mesmo tempo, com pelo menos um destes problemas: um telhado que mete água, sem banheira ou duche e sem retrete dentro de casa, ou uma casa considerada demasiado escura','The share of the population living in an overcrowded dwelling that also has at least one of these problems: a leaking roof, no bath or shower and no indoor toilet, or a dwelling considered too dark',['is considered as overcrowded, while also exhibiting at least one of the housing deprivation measures','with a leaking roof, no bath/shower and no indoor toilet, or a dwelling considered too dark']),
 ('yth-demo-030',None,'hb1c-eurostat-saida','A idade em que metade da população já não vive num agregado com os pais, estimada pelo inquérito ao emprego','The age at which half of the population no longer lives in a household with their parents, estimated from the Labour Force Survey',['represents the age at which 50 % of the population no longer live in a household with their parent(s)','(Source: EU-LFS)']),
 ('ilc-lvps08',None,None,'A parte das pessoas desta idade que vivem com os pais ou contribuem para o rendimento do agregado ou dele beneficiam','The share of people of this age who live with their parents or contribute to or benefit from the household income',['Persons living with their parents or contributing/benefiting from the household income']),
 ('ilc-lvho02',None,None,'A parte da população que vive neste regime de ocupação da casa','The share of the population living under this tenure status',['Distribution of population by tenure status']),
 ('sts-cobp',None,'hb1c-eurostat-licenca','O número de alojamentos com licença de construção, a autorização final para começar a obra','The number of dwellings with a building permit, the final authorisation to start work',['A building permit is the final authorisation to start work on a building project.']),
 ('cens-21dwob',None,'hb1c-eurostat-censos-ocupacao','O número de alojamentos familiares clássicos recenseados, os ocupados, que são a residência habitual de uma ou mais pessoas à data dos Censos, e os não ocupados','The number of conventional dwellings counted, the occupied ones, which are the usual residence of one or more persons at the time of the census, and the unoccupied ones',['are conventional dwellings which are the usual residence of one or more persons at the time of the census','are conventional dwellings which are not the usual residence of any person']),
 ('demo-pjan',None,None,'O número de pessoas que residem no território a um de janeiro do ano','The number of people resident in the territory on the first of January of the year',['Population on 1 January'])]
DER_WHAT={
 'proprietarios':('O resultado é a parte da população que vive em casa própria, com ou sem empréstimo','The result is the share of the population living in an owner-occupied home, with or without a loan'),
 'inquilinos':('O resultado é a parte da população que vive em casa arrendada, a preços de mercado ou a renda reduzida ou gratuita','The result is the share of the population living in a rented home, at market rent or at reduced or free rent'),
 'fiscal':('O resultado é o impacto conjunto na receita, em milhões de euros, das duas medidas fiscais da habitação do Orçamento','The result is the combined impact on revenue, in million euros, of the two housing tax measures in the Budget'),
 'sobrecarga-inquilinos-pt-2020-2025':('O resultado é quanto mudou, em pontos percentuais, a parte dos inquilinos a preços de mercado em sobrecarga em Portugal','The result is how much the share of tenants at market rents in overburden changed in Portugal, in percentage points'),
 'jovens-com-pais':('O resultado é a diferença, em pontos percentuais, entre Portugal e a União na parte dos jovens que vivem com os pais ou partilham o rendimento do agregado','The result is the gap, in percentage points, between Portugal and the Union in the share of young people living with their parents or sharing household income'),
 'licencas-por-mil':('O resultado é o número de alojamentos licenciados por cada mil habitantes','The result is the number of dwellings permitted per thousand inhabitants'),
 'precos-reais':('O resultado é a diferença, em pontos do índice, entre Portugal e a União no índice dos preços das casas descontada a inflação','The result is the gap, in index points, between Portugal and the Union in the house price index net of inflation'),
 'preco-rendimento-acima-2015':('O resultado é quanto o rácio preço-rendimento está acima do valor do ano base, em pontos do índice, que é a subida em percentagem desde esse ano','The result is how far the price-to-income ratio is above its base-year value, in index points, which is the rise in percent since that year'),
 'preco-rendimento-lt':('O resultado é a distância, em pontos do índice, entre o rácio preço-rendimento e a sua média de longo prazo, positiva quando o rácio está acima dela','The result is the distance, in index points, between the price-to-income ratio and its long-term average, positive when the ratio is above it'),
 'preco-rendimento':('O resultado é a diferença, em pontos do índice, entre Portugal e a União no índice do rácio preço-rendimento','The result is the gap, in index points, between Portugal and the Union in the price-to-income ratio index'),
 'preco-lisboa':('O resultado é quantas vezes o preço mediano das vendas em Lisboa é o do país','The result is how many times the median sale price in Lisbon is that of the country'),
 'renda-lisboa':('O resultado é quantas vezes a renda mediana dos novos contratos em Lisboa é a do país','The result is how many times the median rent of new contracts in Lisbon is that of the country'),
 'sobrecarga-inquilinos':('O resultado é a diferença, em pontos percentuais, entre Portugal e a União na parte dos inquilinos a preços de mercado em sobrecarga','The result is the gap, in percentage points, between Portugal and the Union in the share of tenants at market rents in overburden'),
 'saida':('O resultado é a diferença, em anos, entre Portugal e a União na idade média de saída de casa dos pais','The result is the gap, in years, between Portugal and the Union in the average age of leaving the parental home'),
 'vagos':('O resultado é a parte, em percentagem, dos alojamentos do parque que estavam vagos nos Censos','The result is the share, in percent, of the dwellings in the stock that were vacant in the Census')}
def definicao(id,r):
 u=(r.get('coords') or {}).get('unit')
 for pref,units,orig,pt,en,lits in DEFS:
  if id.startswith('hab-'+pref) and (units is None or u in units):
   return pt,en,[dict(origem=orig,campo='excerto',literal=l) if orig else dict(linha='propria',campo='document.title',literal=l) for l in lits],([orig] if orig else [])
 return None
names={};families=[]
for r in b:
 id=r['id']
 if id not in ids:continue
 coords=r.get('coords') or {};pair=pairs.get(id)
 if not pair and r.get('derivation'):
  pair=next((v for k,v in der.items() if id.startswith('der-hab-'+k)),None)
  if id.startswith(('der-hab-proprietarios-','der-hab-inquilinos-','der-hab-licencas-por-mil-')):
   g='PT' if '-pt-' in id else 'EU27_2020';pair=tuple(pair[i]+', '+geo[g][i] for i in range(2))
 if not pair:
  pair=next((v for k,v in stat.items() if id.startswith('hab-'+k)),None)
  assert pair,id
  unit=coords.get('unit')
  if id.startswith(('hab-prc-hpi-q','hab-tipsho10')):
   if unit in ['RCH_A','RCH_A_AVG']:pair=('Variação anual dos '+pair[0][0].lower()+pair[0][1:], 'Annual change in '+pair[1][0].lower()+pair[1][1:])
   else:pair=('Índice dos '+pair[0][0].lower()+pair[0][1:], 'Index of '+pair[1][0].lower()+pair[1][1:])
  if id.startswith('hab-tipsho60') and unit=='PTIR_LT_AVG':pair=('Rácio preço-rendimento face à média de longo prazo','Price-to-income ratio relative to the long-term average')
  if coords.get('tenure') in tenure:pair=tuple(pair[i]+', '+tenure[coords['tenure']][i] for i in range(2))
  age=coords.get('age')
  if age and age!='TOTAL':
   ages={'Y16-29':('dezasseis a vinte e nove anos','sixteen to twenty-nine years'),'Y25-34':('vinte e cinco a trinta e quatro anos','twenty-five to thirty-four years'),'Y18-34':('dezoito a trinta e quatro anos','eighteen to thirty-four years')}
   pair=tuple(pair[i]+', '+ages[age][i] for i in range(2))
  if coords.get('geo'):pair=tuple(pair[i]+', '+geo[coords['geo']][i] for i in range(2))
 assert pair and not re.search(r'\d',''.join(pair)),id
 names[id]=dict(zip(['pt','en'],pair))
 origens=[];d=None
 if r.get('unit') in ['texto','afirmação']:
  pt='O excerto reproduz o documento indicado sobre '+pair[0][0].lower()+pair[0][1:]+'.';en='The excerpt reproduces the indicated document about '+pair[1][0].lower()+pair[1][1:]+'.'
 elif r.get('derivation'):
  what=next((v for k,v in DER_WHAT.items() if id.startswith('der-hab-'+k)),None);assert what,id
  pt,en=what
 elif (d:=definicao(id,r)):
  pt,en,apoios_def,origens=d
 else:
  pt='A medida mostra '+pair[0][0].lower()+pair[0][1:];en='The measure shows '+pair[1][0].lower()+pair[1][1:]
 if r.get('derivation'):field='derivation';literal=r.get('derivation_text',r['check'])
 elif r.get('unit') in ['texto','afirmação'] or (len(r.get('excerpt',''))>15 and any(c.isalpha() for c in r['excerpt'])):field='excerpt';literal=r[field]
 elif len(r.get('name',''))>=4:field='name';literal=r[field]
 else:field='document.title';literal=r['document']['title']
 complemento={}
 if r.get('unit') not in ['texto','afirmação']:
  pre=' no ' if '-Q' in str(r.get('reference_date','')) else ' em '
  qual=[x.split(', ',1)[1] if ', ' in x else '' for x in pair]
  if d or r.get('derivation'):complemento={'complemento':{'pt':[('; aqui, '+qual[0]+',' if qual[0] else '')+pre,{'periodo':id},'.'],'en':[('; here, '+qual[1]+',' if qual[1] else '')+' in ',{'periodo':id},'.']}}
  else:complemento={'complemento':{'pt':[pre,{'periodo':id},'.'],'en':[' in ',{'periodo':id},'.']}}
 apoios=apoios_def if d else [dict(linha='propria',campo=field,literal=literal)]
 families.append(dict(**complemento,chaves=[id],nome=names[id],origens=origens,partes=[dict(classe='diz',pt=pt,en=en,apoios=apoios)]))
(site/'src/data/nomes-hb1.mjs').write_text('/** Nomes correntes das medidas e documentos do estudo HB1. */\nexport const NOMES_HB1 = '+json.dumps(names,ensure_ascii=False,indent=2)+';\n')
(report/'familias.mjs').write_text('/** HB1: frases apoiadas nos excertos e contas das linhas. */\nexport const FAMILIAS_HB1 = '+json.dumps(families,ensure_ascii=False,indent=2)+';\n')
print(len(names),'nomes e famílias preparados')
