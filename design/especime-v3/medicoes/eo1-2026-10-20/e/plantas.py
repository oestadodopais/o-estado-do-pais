"""Plantas nas conferências reais, com códigos, diagnóstico e reposição dos bytes."""
import hashlib,json,subprocess,sys,time
from pathlib import Path
out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=False)
root=Path.cwd()
files=['src/data/o-que-e-das-familias.mjs','tests/cartao/leituras-provadas.json','dist/livro-razao/der-csi-referencia-2026/index.html']
def hashes():return {f:hashlib.sha256(Path(f).read_bytes()).hexdigest() for f in files}
checks=[('controlo-antes',['tests/eo1/definicoes.mjs'],0),('metades-planta',['tests/eo1/metades.mjs','--planta'],1),('definicoes-compositor-planta',['tests/eo1/definicoes.mjs','compositor'],1),('definicoes-cartao-planta',['tests/eo1/definicoes.mjs','cartao'],1),('definicoes-html-planta',['tests/eo1/definicoes.mjs','html',str(out/'html-diagnostico.log')],1),('html-reposto',['scripts/gate-html.mjs'],0),('controlo-reposto',['tests/eo1/definicoes.mjs'],0)]
results=[]
for name,args,expected in checks:
 before=hashes();start=time.monotonic()
 with (out/(name+'.log')).open('w') as f:r=subprocess.run(['node',*args],stdout=f,stderr=subprocess.STDOUT)
 after=hashes();(out/(name+'.codigo')).write_text(str(r.returncode)+'\n')
 results.append({'nome':name,'codigo':r.returncode,'esperado':expected,'duracao_s':round(time.monotonic()-start,3),'antes':before,'reposto':after,'passou':r.returncode==expected and before==after})
 print(name,r.returncode,flush=True)
for p in out.glob('*.log'):
 t=p.read_text().replace(str(root),'<worktree>').replace(str(out),'<temporario>')
 p.write_text(t)
record={'cabeca':json.loads(Path('dist/version.json').read_text())['commit'],'plantas':results,'passou':all(r['passou'] for r in results)}
(out/'plantas.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
assert record['passou']
