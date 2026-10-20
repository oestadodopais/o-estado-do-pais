"""HB1: mede os livros presentes antes da composição, sem alterar fontes."""
import argparse, hashlib, json, subprocess
from decimal import Decimal
from pathlib import Path
import yaml
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
site=Path.cwd();out=Path(__file__).parent
books={c:json.loads((a.motor/'content'/folder/'ledger.json').read_text()) for c,folder in {'HB':'23 Habitacao','PM':'25 Orcamento 2027 Medidas','AN':'24 Orcamento 2027 Analise'}.items()}
rows={c:{r['id']:r for r in b['claims']} for c,b in books.items()}
def get(rid):
 assert rid in rows['HB'], 'identificador ausente: '+rid
 return rows['HB'][rid]
def number(rid):
 s=str(get(rid)['value']).replace(' ','').replace('\u00a0','')
 return Decimal(s.replace(',','.'))
mandatory='hab-ine-iphab-homologa hab-ine-preco-mediano hab-ine-preco-lisboa hab-ine-preco-porto hab-ine-renda-portugal hab-ine-renda-lisboa hab-ine-renda-porto hab-ine-vagos-total hab-ine-censos-0012517-0 hab-ine-censos-0012501-40 hab-ine-censos-0012501-41 hab-ine-juro-implicito hab-oe-habitacao-orcamento hab-oe-oferta-publica hab-oe-apoio-arrendamento hab-oe-licenciamento hab-oe-iva-impacto hab-oe-irs-rendas-impacto hab-oe-apoios-jovens hab-oe-fiscal hab-oe-oferta hab-oe-art70 hab-oe-art97-exclusao-divida hab-dl97-irs hab-dl97-deducao hab-governo-construir hab-governo-arrendamento hab-governo-feh hab-arrendamento-exposicao hab-votacao-arrendamento hab-votacao-pan hab-votacao-chega hab-votacao-livre hab-ps-vazias hab-ps-mais-valias hab-ps-rendas hab-pcp-rendas hab-be-despejos hab-pan-caucoes hab-pan-controlo hab-pan-tetos hab-livre-reinvestimento hab-chega-reinvestimento hab-il-proposta hab-cgtp-convocatoria hab-imprensa-debate-custos hab-imprensa-debate-protecao hab-imprensa-pm-15 hab-imprensa-pm-16 hab-imprensa-mai hab-imprensa-amorim hab-imprensa-igai hab-imprensa-acampados hab-imprensa-feridos37 hab-imprensa-feridos35 hab-imprensa-feridos39 hab-imprensa-psp-ferido hab-imprensa-assistidos hab-imprensa-hospital'.split()
for rid in mandatory:get(rid)
fields=['id','value','unit','reference_date','source_flag','dataset_updated_at','document','evidence','source_excerpt','attributed_to']
result={'cabeca_motor':subprocess.check_output(['git','rev-parse','HEAD'],cwd=a.motor,text=True).strip(),'livros':{c:[{k:r.get(k) for k in fields} for r in b['claims']] for c,b in books.items()},'series':{},'posicoes':{},'contas':{}}
for slug in ['sobrecarga-do-custo-da-habitacao-2025','sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025','precos-da-habitacao-2025']:
 s=yaml.safe_load((site/'ledger/series'/(slug+'-paises.yml')).read_text());r=yaml.safe_load((site/'ledger/claims'/(slug+'.yml')).read_text())
 result['series'][slug]={'study':r['study'],'serie':s,'linha':r}
for prefix,year in [('hab-tipsho10-a-i15-a-avg-','2025'),('hab-tipsho60-a-ptir-i15-','2024'),('hab-tipsho60-a-ptir-lt-avg-','2024'),('hab-ilc-lvps08-a-y25-34-t-pc-','2025'),('hab-prc-hpi-q-q-total-rch-a-','2026-Q2')]:
 selected=[r for r in rows['HB'].values() if r['id'].startswith(prefix) and r['reference_date']==year and r.get('coords',{}).get('geo')!='EU27_2020' and r['value'] is not None]
 result['posicoes'][prefix]=sorted([{'id':r['id'],'geo':r['coords']['geo'],'value':r['value']} for r in selected],key=lambda r:-Decimal(r['value']))
pairs={'precos-reais':['hab-tipsho10-a-i15-a-avg-pt-2025','hab-tipsho10-a-i15-a-avg-eu27_2020-2025'],'preco-rendimento':['hab-tipsho60-a-ptir-i15-pt-2024','hab-tipsho60-a-ptir-i15-eu27_2020-2024'],'jovens-com-pais':['hab-ilc-lvps08-a-y25-34-t-pc-pt-2025','hab-ilc-lvps08-a-y25-34-t-pc-eu27_2020-2025'],'saida':['hab-yth-demo-030-a-avg-t-pt-2025','hab-yth-demo-030-a-avg-t-eu27_2020-2025']}
for name,ids in pairs.items():result['contas'][name]={'componentes':ids,'diferenca':str(number(ids[0])-number(ids[1]))}
for geo in ['pt','eu27_2020']:
 for name,tenures in [('proprietarios',['own-l','own-nl']),('inquilinos',['rent-mkt','rent-fr'])]:
  ids=[f'hab-ilc-lvho02-a-total-total-{t}-pc-{geo}-2025' for t in tenures];result['contas'][name+'-'+geo]={'componentes':ids,'soma':str(sum(map(number,ids)))}
result['contas']['vagos-pct']=str(number('hab-ine-vagos-total')/number('hab-cens-21dwob-r3-a-dw-total-nr-pt-2021')*100)
result['contas']['fiscal']=str(number('hab-oe-iva-impacto')+number('hab-oe-irs-rendas-impacto'))
for name in ['renda','preco']:result['contas'][name+'-lisboa']=str(number('hab-ine-'+name+'-lisboa')/number('hab-ine-'+('preco-mediano' if name=='preco' else 'renda-portugal')))
result['pendentes_1b']=['RENT_MKT 2015 a 2025 e países 2025','demo_pjan 2025 PT e UE','estimativa orçamental 2026','dedução 2027','manifestações e reivindicações','calendário INE','retirada das tendas']
(out/'partida.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Livros medidos:',{c:len(b['claims']) for c,b in books.items()});print('Código: 0')
