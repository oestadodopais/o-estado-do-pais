"""Prova os trailers Git e a sua adjacência, sem alterar mensagens."""
from pathlib import Path
import subprocess,json,sys
out=Path(sys.argv[1] if len(sys.argv)>1 else 'design/especime-v3/medicoes/rp4n-2026-10-06/g');out.mkdir(parents=True,exist_ok=True)
def git(*a):return subprocess.check_output(['git',*a],text=True)
ss=git('log','--format=%(trailers:key=Claude-Session)','b84d21a3..HEAD');(out/'trailers-codigo.log').write_text(ss)
commits=git('rev-list','b84d21a3..HEAD').splitlines();problemas=[]
for c in commits:
 b=git('show','-s','--format=%B',c);p=subprocess.check_output(['git','interpret-trailers','--parse'],input=b,text=True)
 if 'Co-Authored-By:' not in p or 'Claude-Session:' not in p or not any(a.startswith('Co-Authored-By:') and z.startswith('Claude-Session:') for a,z in zip(b.splitlines(),b.splitlines()[1:])):problemas.append(c)
r={'cabeca':git('rev-parse','HEAD').strip(),'commits':len(commits),'trailers_claude_session':len([s for s in ss.splitlines() if s.startswith('Claude-Session:')]),'problemas':problemas,'referencias_originais':git('for-each-ref','--format=%(refname) %(objectname)','refs/original').splitlines()};(out/'trailers-codigo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r,ensure_ascii=False))
assert not problemas
