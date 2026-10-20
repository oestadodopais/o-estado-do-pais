"""Declara a língua das cadeias das fontes HB1, sem traduzir as citações."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
b=json.loads((a.motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims']
titles={};labels={};sources={};editions={};locators={}
for r in b:
 if r.get('derivation'):continue
 d=r.get('document') or {};en='ec.europa.eu/eurostat/' in r.get('source_url','')
 if d.get('title'):titles[d['title']]='en' if en else 'pt'
 if r.get('name'):labels[r['name']]='en' if en else 'pt'
 if d.get('edition'):editions[d['edition']]=None
 if d.get('locator'):locators[d['locator']]='en' if en else 'pt'
 for name in r.get('attributed_to') or []:sources[name]=None if name=='Eurostat' else 'pt'
p=Path('src/i18n/lingua-dos-titulos.mjs');t=p.read_text().split('\n// HB1: cadeias lidas')[0]
for key,obj in [('LINGUA_DOS_TITULOS',titles),('LINGUA_DOS_ROTULOS',labels),('LINGUA_DAS_FONTES',sources),('LINGUA_DAS_EDICOES',editions),('LINGUA_DOS_LOCALIZADORES',locators)]:
 t+='\n// HB1: cadeias lidas nos documentos e linhas de origem.\nObject.assign('+key+', '+json.dumps(obj,ensure_ascii=False,indent=2)+');\n'
p.write_text(t)
print(len(titles),'títulos e',len(labels),'rótulos declarados')
