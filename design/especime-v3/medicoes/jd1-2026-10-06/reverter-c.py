"""JD1-c, achado 8: repõe a base fora do bloco, com inventário verificável.

--aplicar escreve; sem a opção apenas confere o resultado. Caminhos absolutos
antigos passam a referências à casa, mantendo o destino e o comportamento.
"""
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).with_name('reversoes-c.json')
BASE, ANTES = '64d81b21', '744a80eb'
spec = importlib.util.spec_from_file_location('limpador', ROOT/'scripts/leituras/limpar-caminhos.py')
limpador = importlib.util.module_from_spec(spec)
spec.loader.exec_module(limpador)
PROPRIOS = {'package.json', 'scripts/check-lugar.mjs', 'scripts/inventario-rotulos.mjs',
 'scripts/check-privacidade.py', 'scripts/leituras/limpar-caminhos.py',
 'design/observatorio/mandatos/MANDATO-JD1-b-2026-10-06.md'}
PROPRIOS.update('design/especime-v3/medicoes/r4-2026-10-05/'+n for n in
 ['compor-familias-r4.mjs','compor-series-r4.mjs','series-r4.mjs','registar-leitura.mjs'])

def git(*args): return subprocess.check_output(['git', *args], cwd=ROOT)
def sha(b): return hashlib.sha256(b).hexdigest()
def texto(b,n): return (gzip.decompress(b) if n.endswith('.gz') else b).decode()
def bytes_de(t,n): return gzip.compress(t.encode(),mtime=0) if n.endswith('.gz') else t.encode()
def registo(n):
 return n.startswith(('design/especime-v3/medicoes/','design/especime-v3/critica/')) and n.endswith(('.log','.json','.md','.txt','.json.gz'))
def privado(t,n):
 # Os destinos originais mantêm-se; nenhuma raiz pessoal é gravada.
 absoluto = '/'+'Users'+r'/[^/\s\"\']+'
 if n.endswith('.mjs') and re.search(absoluto,t):
  extra="import { homedir as jd1Casa } from 'node:os';\n"
  t=t.split("\n",1)[0]+"\n"+extra+t.split("\n",1)[1] if t.startswith("#!") else extra+t
  t=re.sub(r"import \{ chromium \} from ['\"]"+absoluto+r"([^'\"]+)['\"];",r"const { chromium } = await import(jd1Casa() + '\1');",t)
  t=re.sub(r"(['\"])"+absoluto+r"([^'\"]*)\1",r"(jd1Casa() + '\2')",t)
 elif n.endswith('.py'):
  t=re.sub(r"Path\(['\"]"+absoluto+r"([^'\"]*)['\"]\)",r"(Path.home() / '\1'.lstrip('/'))",t)
  t=re.sub(r"(['\"])"+absoluto+r"([^'\"]*)\1",r"(__import__('os').path.expanduser('~') + '\2')",t)
 return re.sub(absoluto,'<casa>',t).replace(Path.home().name,'<utilizador>')

rows=[]
for n in git('diff','--name-only',BASE,ANTES).decode().splitlines():
 p=ROOT/n
 old=git('show',ANTES+':'+n)
 if n in PROPRIOS or n.startswith(('src/','ledger/','tests/','public/',
     'design/especime-v3/medicoes/jd1-2026-10-06/','design/especime-v3/capturas/jd1-2026-10-06/')):
  rows.append(dict(ficheiro=n,decisao='conservado',razao='Ficheiro tocado de propósito pelo bloco.'))
  continue
 b=git('show',BASE+':'+n)
 base_text=texto(b,n)
 if registo(n) and limpador.retirar_estrutura(base_text)==texto(old,n):
  target=old; reason='Só substituição de caminhos num registo; conferida por igualdade de bytes do texto.'; decision='conservado'
 else:
  target=bytes_de(privado(base_text,n),n)
  reason='Conteúdo de '+BASE+'.'; decision='revertido'
  if target != b: reason+=' Exceção da regra 9: só raízes pessoais substituídas; o destino executável é relativo à casa.'
 if n == 'design/observatorio/medidas/isentos.json':
  entries=json.loads(target)
  for entry in entries['isentos']:
   if entry['brief']=='design/observatorio/BRIEF-P2-o-numero-e-o-seu-sentido.md':
    entry['sha256']=sha((ROOT/entry['brief']).read_bytes())
  target=(json.dumps(entries,ensure_ascii=False,indent=2)+'\n').encode()
  reason+=' O resumo do brief P2 acompanha a retirada da raiz pessoal.'
 if '--aplicar' in sys.argv: p.write_bytes(target)
 else: assert p.read_bytes()==target,n
 rows.append(dict(ficheiro=n,decisao=decision,razao=reason,sha256_base=sha(b),sha256_antes=sha(old),sha256_depois=sha(target),igual_a_base=target==b))
if '--aplicar' in sys.argv: OUT.write_text(json.dumps(dict(base=BASE,antes=ANTES,ficheiros=rows),ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:sum(r['decisao']==k for r in rows) for k in ('revertido','conservado')}))
