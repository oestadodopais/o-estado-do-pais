"""As citações portuguesas deixam os quantificadores cobertos pela régua declarados."""
from pathlib import Path
import contextlib,io,json,sys,tempfile
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from core.assertions import run,normalised,_tight
for n,quote in [('04','nenhuma das fontes afirma que são a mesma entidade'),('14','nenhum deles é uma conta de execução'),('18','nenhuma das fontes afirma que são a mesma entidade'),('19','nenhum deles é uma conta de execução')]:
 pasta=next(motor.glob('content/'+n+' *'));livro=pasta/'ledger.json';d=json.loads(livro.read_text());doc=next(p for p in pasta.glob('*.md') if _tight(quote) in normalised(p));buf=io.StringIO()
 with contextlib.redirect_stdout(buf):assert run(doc,livro)==0
 for a in d['assertions']:a['quotes']=[q for q in a['quotes'] if q!=quote]
 d['assertions']=[a for a in d['assertions'] if a['quotes']]
 with tempfile.TemporaryDirectory() as tmp:
  p=Path(tmp)/'ledger.json';p.write_text(json.dumps(d));buf=io.StringIO()
  with contextlib.redirect_stdout(buf):codigo=run(doc,p)
  assert codigo==1 and 'UNDECLARED' in buf.getvalue(),n
  print(n,': controlo 0; citação retirada 1; quantificador descoberto')
print('Quatro plantas recusadas, sem modificar os livros publicados.')
