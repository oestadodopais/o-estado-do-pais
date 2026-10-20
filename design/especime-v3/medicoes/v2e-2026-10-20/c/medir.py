import json,sys,subprocess
from pathlib import Path
out=Path(sys.argv[1])
with out.open('w') as f:r=subprocess.run(['node','scripts/medir-defeitos.mjs','--json'],stdout=f)
r.check_returncode()
d=json.loads(out.read_text());d['cabeca']=json.loads(Path('dist/version.json').read_text())['commit'];out.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
unknown=sum(len(v['nao_classificados']) for v in d['frases_da_casa']['por_rota'].values());missing=len(d['frases_da_casa']['declaracoes']['vivas_que_nao_rendem']);assert unknown==missing==0
print(json.dumps(dict(cabeca=d['cabeca'],nao_classificados=unknown,vivas_ausentes=missing)))
