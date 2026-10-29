"""Declara as unidades dos cartões HB1 com apoio nos campos exportados."""
import json,re,yaml
from pathlib import Path
unidades={}
simples={
 'afirmação':('citação','quotation'),'texto':('texto da fonte','source text'),'data':('data anunciada','announced date'),
 'Thousand':('mil alojamentos licenciados','thousand permitted dwellings'),
 'Annual average rate of change':('% de variação média anual','% annual average change'),
 'Annual average index, 2015=100':('índice médio anual, 2015 igual a 100','annual average index, 2015 equals 100'),
 'Quarterly index, 2015=100':('índice trimestral, 2015 igual a 100','quarterly index, 2015 equals 100'),
 'Price-to-income ratio, index 2015=100':('índice do rácio preços/rendimento, 2015 igual a 100','price-to-income ratio index, 2015 equals 100'),
 'Price-to-income ratio relative to long-term average':('rácio preços/rendimento face à média de longo prazo','price-to-income ratio relative to its long-term average'),
 'Average':('idade média em anos','average age in years'),'Annual rate of change':('% de variação anual','% annual change'),
 'pontos percentuais do índice':('pontos percentuais do índice','percentage points of the index'),
 'pontos de índice':('pontos de índice','index points'),'milhões de euros':('milhões de euros','million euros'),'Milhões de euros':('milhões de euros','million euros'),
 '€/m2':('euros por metro quadrado','euros per square metre'),'pontos percentuais':('pontos percentuais','percentage points'),
 'por mil habitantes':('alojamentos licenciados por mil habitantes','permitted dwellings per thousand inhabitants'),
 'vezes':('vezes','times'),'anos':('anos','years'),'alojamentos':('alojamentos','dwellings'),'N.º':('alojamentos','dwellings'),
 'Percentagem':('% de juro','% interest'),
}
tenures={
 'OWN_L':('% de quem tem casa própria com empréstimo','% of owners with a mortgage'),
 'OWN_NL':('% de quem tem casa própria sem empréstimo','% of owners without a mortgage'),
 'RENT_MKT':('% de quem arrenda a preços de mercado','% of tenants at market rents'),
 'RENT_FR':('% de quem ocupa a renda reduzida ou sem renda','% of tenants at reduced rent or rent-free'),
 'TOTAL':('% da população','% of the population'),
}
def pedacos(s):
 return [({'nl':x,'motivo':'escala-de-instrumento'} if x.isdigit() else x) for x in re.split(r'(\d+)',s) if x]
for f in sorted(Path('ledger/claims').glob('*.yml')):
 r=yaml.safe_load(f.read_text())
 if r.get('study')!='a-casa-em-portugal-e-na-europa':continue
 id,u=r['id'],r['unit'];coords={}
 try:coords=json.loads(r.get('excerpt',''))['coordinates']
 except (ValueError,KeyError,TypeError):pass
 if u=='Percentage':
  if id.startswith('hab-ilc-mded01-'):par=('% do rendimento disponível das famílias','% of household disposable income')
  elif id.startswith('hab-ilc-lvho07c-'):par=tenures[coords['tenure']]
  elif (age:=re.fullmatch(r'Y(\d+)-(\d+)',coords.get('age',''))):
   a,b=age.groups();par=(f'% das pessoas dos {a} aos {b} anos',f'% of people aged {a} to {b}')
  else:par=('% da população','% of the population')
 elif u=='Number':par=('pessoas','people') if id.startswith('hab-demo-') else ('alojamentos','dwellings')
 elif u=='%':
  if id=='hab-ine-censos-0012517-0':par=('% dos alojamentos familiares clássicos','% of conventional family dwellings')
  elif id in {'hab-ine-iphab-homologa','hab-ine-avaliacao-homologa'}:par=('% de variação homóloga','% year-on-year change')
  elif id=='hab-ine-juro-implicito':par=('% de juro','% interest')
  elif id.startswith(('der-hab-inquilinos-','der-hab-proprietarios-')):par=('% da população','% of the population')
  else:raise ValueError(id)
 else:par=simples[u]
 apoio=[]
 for campo in ['unit','name','excerpt','derivation']:
  valor=r.get(campo)
  if isinstance(valor,str) and len(valor.strip())>=4:apoio.append({'campo':campo,'literal':valor})
 assert apoio,id
 unidades[id]={'pt':pedacos(par[0]),'en':pedacos(par[1]),'apoio':apoio,'achado':'HB1: unidade declarada com o objeto, denominador ou base que os campos da linha identificam; o recibo conserva a unidade original.'}
p=Path('src/data/unidades-hb1.mjs');p.write_text('/** Unidades HB1, geradas por scripts/hb1-unidades.py a partir das linhas exportadas. */\nexport const UNIDADES_HB1 = '+json.dumps(unidades,ensure_ascii=False,indent=2)+';\n')
p=Path('src/data/unidades-dos-cartoes.mjs');s=p.read_text();s=s.replace("import { UNIDADES_HB1 } from './unidades-hb1.mjs';\n",'');s="import { UNIDADES_HB1 } from './unidades-hb1.mjs';\n"+s;s=s.replace('export const UNIDADES_DOS_CARTOES = {\n','export const UNIDADES_DOS_CARTOES = {\n  ...UNIDADES_HB1,\n') if '  ...UNIDADES_HB1,' not in s else s;p.write_text(s)
print(len(unidades),'unidades declaradas')
