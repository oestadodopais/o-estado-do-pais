"""Portão inteiro do motor sob a mesma tranca da construção do sítio."""
from pathlib import Path
import json
import os
import subprocess
import sys
import time
from datetime import datetime,timezone
site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR'])
saida=Path(sys.argv[1]);saida.mkdir(parents=True,exist_ok=True)
tranca=Path(subprocess.check_output(['git','rev-parse','--path-format=absolute','--git-common-dir'],text=True).strip())/'oedp-construcao.lock'
while True:
 try:
  fd=os.open(tranca,os.O_CREAT|os.O_EXCL|os.O_WRONLY);os.write(fd,f'RP4N-h motor pid={os.getpid()}'.encode());os.close(fd);break
 except FileExistsError:
  print('À espera da tranca da construção.',flush=True);time.sleep(10)
try:
 assert not (saida/'motor.codigo').exists()
 estado=subprocess.check_output(['git','status','--porcelain'],cwd=motor,text=True)
 assert not estado.strip(), 'M62: a árvore do motor não está limpa'
 (saida/'motor.estado.inicio').write_text(estado)
 for nome in ['motor.cabeca','motor.inicio']:
  texto=subprocess.check_output(['git','rev-parse','HEAD'],cwd=motor,text=True) if nome.endswith('cabeca') else datetime.now(timezone.utc).isoformat()+'\n'
  (saida/nome).write_text(texto)
 with (saida/'motor.log').open('w') as f:r=subprocess.run(['python3','-m','core.gate'],cwd=motor,stdout=f,stderr=subprocess.STDOUT)
 (saida/'motor.codigo').write_text(str(r.returncode)+'\n')
 (saida/'motor.cabeca.fim').write_text(subprocess.check_output(['git','rev-parse','HEAD'],cwd=motor,text=True))
 estado=subprocess.check_output(['git','status','--porcelain'],cwd=motor,text=True)
 (saida/'motor.estado.fim').write_text(estado)
 if estado.strip() or (saida/'motor.cabeca').read_text()!=(saida/'motor.cabeca.fim').read_text():
  (saida/'motor.codigo').write_text('99\n')
  raise RuntimeError('M62: a cabeça ou a árvore do motor mudou durante o portão')
 (saida/'motor.fim').write_text(datetime.now(timezone.utc).isoformat()+'\n')
 subprocess.run(['python3','scripts/leituras/limpar-caminhos.py',str(saida),'--worktree',str(site),'--motor',str(motor)],check=True)
 print('Portão do motor:',r.returncode,flush=True)
finally:tranca.unlink()
sys.exit(r.returncode)
