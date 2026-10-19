import json,sys
from pathlib import Path
r=json.loads(Path(sys.argv[1]).read_text())
paginas=[dict(nome='discussao',pt='/o-que-se-discute/',en='/en/under-discussion/',recortes=[dict(nome=i['slug'],seletor='[data-discussao="'+i['slug']+'"]') for i in r['edicoes']['pt']['itens']]),dict(nome='primeira',pt='/',en='/en/',recortes=[dict(nome='bloco',seletor='[data-discussao-inicio]')]),dict(nome='orcamento',pt='/explicacoes/dinheiro-do-estado-2026/',en='/en/explainers/dinheiro-do-estado-2026/',recortes=[dict(nome='por-funcao',seletor='[data-explicacao-secao="por-funcao"]')])]
for p in sorted({i['pagina'] for i in r['integracoes'] if i['lang']=='pt' and i['condicao']=='linhas'}):
 en=next(i['pagina'] for i in r['integracoes'] if i['lang']=='en' and i['item']==next(j['item'] for j in r['integracoes'] if j['pagina']==p) and i['pagina'].split('/')[-2]==p.split('/')[-2]) if p!='livro-razao/index.html' else 'en/ledger/index.html'
 name=p.split('/')[-2]
 sel='[data-livro-lista]' if p=='livro-razao/index.html' else '#prova' if p.startswith('livro-razao/') else 'main'
 paginas.append(dict(nome=name,pt='/'+p.removesuffix('index.html'),en='/'+en.removesuffix('index.html'),recortes=[dict(nome='integracao',seletor=sel)]))
Path(sys.argv[2]).write_text(json.dumps(dict(cabeca=r['cabeca'],paginas=paginas),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(paginas=len(paginas),capturas_previstas=sum(10*(1+len(p['recortes'])) for p in paginas))))
