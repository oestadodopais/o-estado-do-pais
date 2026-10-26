"""Reconstitui a medição anterior com notas, na cabeça anterior à aplicação CR2.
Não muda o retrato histórico frases-antes.json nem a worktree.
"""
import os,subprocess,tempfile,tarfile,io,shutil
from pathlib import Path
raiz=Path.cwd();p=Path(__file__).resolve().parent
with tempfile.TemporaryDirectory(prefix='cr2g-') as t:
 base=Path(t)
 dados=subprocess.check_output(['git','archive','442b284e229408018e8c97c59dadd285a526bf3c','src','ledger','package.json'])
 with tarfile.open(fileobj=io.BytesIO(dados)) as ar:ar.extractall(base,filter='data')
 (base/'node_modules').symlink_to(raiz/'node_modules',target_is_directory=True)
 destino=base/'design/especime-v3/medicoes/cr2-2026-10-26';destino.mkdir(parents=True)
 for f in ['frases-cr2.mjs','ids.json']:shutil.copy(p.parent/f,destino/f)
 amb=dict(os.environ,RESEARCHHUB_DIR=str(raiz.parents[1]/'ResearchHub-worktrees/cr2-2026-10-26'))
 subprocess.run(['node',str(destino/'frases-cr2.mjs'),'antes',str(p)],cwd=base,env=amb,check=True)
 (p/'frases-antes-com-notas.json').write_bytes((p/'frases-antes.json').read_bytes());(p/'frases-antes.json').unlink()
print('Base 442b284e: frases anteriores reconstituídas com as notas visíveis.')
