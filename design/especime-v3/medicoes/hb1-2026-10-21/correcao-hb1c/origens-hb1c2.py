"""HB1-c2: as origens das definições, lidas dos corpos alojados no motor (texto exato)."""
import json,re,html,hashlib,sys
from pathlib import Path
M=Path(sys.argv[1]);S=M/'content/23 Habitacao/source/eurostat'
def texto_html(f):
    t=(S/f).read_text(encoding='utf-8');i=t.find('mw-parser-output');t=t[i:] if i>=0 else t
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',t)))
def texto_json(f):
    d=json.loads((S/f).read_text());return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',d['extension']['description'])))
def frase(t,a,b):
    i=t.index(a);j=t.index(b,i)+len(b);return t[i:j]
O={}
def add(k,f,doc,campo,a,b,js=False):
    t=texto_json(f) if js else texto_html(f)
    rec=json.loads((S/(f+'.pedido.json')).read_text()) if (S/(f+'.pedido.json')).exists() else None
    if rec is None:
        rec=json.loads((S/(f+'.pedido.json')).read_text())
    raw=(S/f).read_bytes();assert hashlib.sha256(raw).hexdigest()==rec['sha256'],f
    O[k]=dict(publicador='Eurostat',documento=doc,url=rec['endereco_final'],lido=rec['acedido_em'][:10],excerto=frase(t,a,b),selo=dict(motor='content/23 Habitacao/source/eurostat/'+f,campo=campo,hora=rec['acedido_em'][:19]+'Z',cliente=rec['cliente'],sha256=rec['sha256']))
G='Glossário, primeiro parágrafo da definição'
add('hb1c-eurostat-sobrecarga','hb1c-glossario-housing-cost-overburden-rate.html','Glossary:Housing cost overburden rate',G,'The housing cost overburden rate is','disposable income (\'net\' of housing allowances).')
add('hb1c-eurostat-custos-habitacao','hb1c-glossario-housing-cost-overburden-rate.html','Glossary:Housing cost overburden rate','Glossário, segundo parágrafo da definição','Housing costs refer to','right to live in a dwelling.')
add('hb1c-eurostat-sobrelotacao','hb1c-glossario-overcrowding-rate.html','Glossary:Overcrowding rate',G,'The overcrowding rate is defined as','a minimum number of rooms equal to:')
add('hb1c-eurostat-licenca','hb1c-glossario-building-permit.html','Glossary:Building permit',G,'A building permit is','building project.')
add('hb1c-eurostat-ipH','hb1c-glossario-house-price-index.html','Glossary:House price index (HPI)',G,'The house price index','purchased by households.')
add('hb1c-eurostat-ihpc','hb1c-glossario-hicp.html','Glossary:Harmonised index of consumer prices (HICP)',G,'The harmonised index of consumer prices','single set of definitions.')
add('hb1c-eurostat-privacao-severa','hb1b-severe-housing-deprivation.html','Glossary:Severe housing deprivation rate','Glossário, dois parágrafos da definição','Severe housing deprivation rate is defined as','or a dwelling considered too dark.')
add('hb1c-eurostat-censos-ocupacao','hb1c-cens-21-esms2.html','Census 2021 round (cens_21)','Metainformação ESMS, conceitos e definições, estado de ocupação dos alojamentos clássicos','‘Occupied conventional dwellings’ are','are not the usual residence of any person at the time of the census.')
add('hb1c-eurostat-precos-reais','tipsho10.json','House price index, deflated - annual data','extension.description','The deflated house price index','serving households (NPISHs) ).',js=True)
add('hb1c-eurostat-preco-rendimento','tipsho60.json','Standardised house price-to-income ratio - annual data','extension.description','The standardised house price-to-income ratio is defined as','based on Eurostat data.',js=True)
add('hb1c-eurostat-saida','yth_demo_030.json','Estimated average age of young persons leaving the parental household','extension.description','The indicator represents','(Source: EU-LFS).',js=True)
for k,v in O.items(): print(k,'|',v['excerto'][:260])
Path(sys.argv[2]).write_text(json.dumps(O,ensure_ascii=False,indent=2))
