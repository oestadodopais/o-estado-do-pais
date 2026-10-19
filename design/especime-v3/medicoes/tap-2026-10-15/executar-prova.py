import subprocess,sys,time,json,datetime,os,re
from pathlib import Path
meta=Path(sys.argv[1]);command=sys.argv[2:]
start=time.monotonic();begin=datetime.datetime.now(datetime.timezone.utc).isoformat()
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
assert not subprocess.check_output(['git','status','--porcelain'],text=True).strip(),'Árvore do motor não está limpa antes da prova final'
print('cabeça motor: '+head,flush=True)
print('comando: '+' '.join(command),flush=True)
process=subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
for line in process.stdout:
 line=line.replace(str(Path.cwd()),'<motor>').replace(str(Path.home()),'<utilizador>').replace('/private/tmp/','<temporario>/').replace('/tmp/','<temporario>/')
 line=re.sub(r'/(?:Library|private|var|opt)/[^\s\"\']+', '<temporario>', line)
 print(line,end='',flush=True)
code=process.wait();end=datetime.datetime.now(datetime.timezone.utc).isoformat()
assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()==head
assert not subprocess.check_output(['git','status','--porcelain'],text=True).strip(),'Prova final alterou a árvore'
result={'cabeca':head,'comando':' '.join(command),'codigo':code,'inicio':begin,'fim':end,'duracao_s':round(time.monotonic()-start,3),'arvore_limpa_antes_e_depois':True}
meta.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('resultado: '+json.dumps(result,ensure_ascii=False),flush=True)
sys.exit(code)
