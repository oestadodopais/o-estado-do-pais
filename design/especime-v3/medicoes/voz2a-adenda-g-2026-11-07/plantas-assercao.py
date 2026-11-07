"""A remoção de cada citação da adenda G tem de deixar o quantificador descoberto."""
from pathlib import Path
import contextlib,io,json,sys,tempfile
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from core.assertions import run
for n,quote in [('04','nenhuma das fontes afirma que são a mesma entidade'),('14','none of them is an execution account'),('18','nenhuma das fontes afirma que são a mesma entidade'),('19','none of them is an execution account')]:
 pasta=next(motor.glob('content/'+n+' *'));livro=pasta/'ledger.json';d=json.loads(livro.read_text());doc=next(p for p in pasta.glob('*.md') if quote in p.read_text());buf=io.StringIO()
 with contextlib.redirect_stdout(buf):assert run(doc,livro)==0
 for a in d['assertions']:a['quotes']=[q for q in a['quotes'] if q!=quote]
 d['assertions']=[a for a in d['assertions'] if a['quotes']]
 with tempfile.TemporaryDirectory() as tmp:
  p=Path(tmp)/'ledger.json';p.write_text(json.dumps(d));buf=io.StringIO()
  with contextlib.redirect_stdout(buf):codigo=run(doc,p)
  assert codigo==1 and 'UNDECLARED' in buf.getvalue(),n
  print(n,': controlo 0; citação retirada 1; quantificador descoberto')
print('Quatro plantas recusadas, sem modificar os livros publicados.')
