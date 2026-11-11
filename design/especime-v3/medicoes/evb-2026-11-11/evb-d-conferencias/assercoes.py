import json
from pathlib import Path
from core import assertions as A, compor as C
study=Path('content/19 Évora 2027 Capital Europeia da Cultura')
tech=study/'Technical Source'
book=json.loads((study/'ledger.json').read_text())
assert not {'evb-revisao-c016','evb-revisao-c041'} & {r['id'] for r in book['assertions']}
assert 'fiscal único' in book['assertion_ignores']
for lang in ('pt','en'):
 name=next(l.removeprefix('@@edicao ') for l in (tech/f'documento.{lang}.md.tmpl').read_text().splitlines() if l.startswith('@@edicao '))
 for ext in ('.md','.html'):
  path=(study/name).with_suffix(ext)
  assert A.run(path,study/'ledger.json')==0,path.name
sources={}
compositions=[C.compor(g,sources) for g in sorted(tech.glob('documento.??.md.tmpl'))]
rebuilt,_=C.construir_livro(study,compositions,sources)
assert rebuilt==book,'Livro instalado diferente da composição'
print('EVB_D_ASSERCOES: PASS, quatro edições e livro reproduzido; falso positivo do cargo declarado')
