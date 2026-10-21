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
 if r.get('unit') in ['texto','afirmação']:
  pt='O excerto reproduz o documento indicado sobre '+pair[0][0].lower()+pair[0][1:]+'.';en='The excerpt reproduces the indicated document about '+pair[1][0].lower()+pair[1][1:]+'.'
 elif r.get('derivation'):
  pt='A conta calcula '+pair[0][0].lower()+pair[0][1:]+' pelas componentes identificadas';en='The calculation gives '+pair[1][0].lower()+pair[1][1:]+' from the identified components'
 else:
  pt='A medida mostra '+pair[0][0].lower()+pair[0][1:];en='The measure shows '+pair[1][0].lower()+pair[1][1:]
 if r.get('derivation'):field='derivation';literal=r.get('derivation_text',r['check'])
 elif r.get('unit') in ['texto','afirmação'] or (len(r.get('excerpt',''))>15 and any(c.isalpha() for c in r['excerpt'])):field='excerpt';literal=r[field]
 elif len(r.get('name',''))>=4:field='name';literal=r[field]
 else:field='document.title';literal=r['document']['title']
 complemento={}
 if r.get('unit') not in ['texto','afirmação']:
  pre=' no ' if '-Q' in str(r.get('reference_date','')) else ' em '
  complemento={'complemento':{'pt':[pre,{'periodo':id},'.'],'en':[' in ',{'periodo':id},'.']}}
 families.append(dict(**complemento,chaves=[id],nome=names[id],origens=[],partes=[dict(classe='diz',pt=pt,en=en,apoios=[dict(linha='propria',campo=field,literal=literal)])]))
(site/'src/data/nomes-hb1.mjs').write_text('/** Nomes correntes das medidas e documentos do estudo HB1. */\nexport const NOMES_HB1 = '+json.dumps(names,ensure_ascii=False,indent=2)+';\n')
(report/'familias.mjs').write_text('/** HB1: frases apoiadas nos excertos e contas das linhas. */\nexport const FAMILIAS_HB1 = '+json.dumps(families,ensure_ascii=False,indent=2)+';\n')
print(len(names),'nomes e famílias preparados')
