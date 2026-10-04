import json,subprocess,sys,time
from pathlib import Path
p=Path(sys.argv[1])
while not (p/'corrida.codigo').exists():time.sleep(2)
assert (p/'corrida.codigo').read_text().strip()=='0','As provas da cabeça limpa falharam.'
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
status=subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],text=True)
assert status=='','A árvore seguida deixou de estar limpa.'
for nome in ['pais-trabalho','html-trabalho','lugar-trabalho','mapa','areas-trabalho','voz-trabalho','em-curso-trabalho','pacote-planta']:
 r=json.loads((p/(nome+'.json')).read_text());assert r['cabeca']==head and r['estado']=='' and r['estado_fim']=='' and r['codigo']==0
for nome in ['plantas-portoes-h2.json','plantas-portoes-h2b.json']:
 r=json.loads((p/nome).read_text());assert all(x['cabeca']==head and x['estado']=='' and x['passou'] for x in r)
(p/'portoes-estado-inicial.json').write_text(json.dumps({'cabeca':head,'estado':status,'comando':'git status --porcelain --untracked-files=no'},indent=2)+'\n')
print('As provas da cabeça limpa passaram; começam os portões completos pela tranca.',flush=True)
r=subprocess.run(['sh','scripts/leituras/portoes.sh',str(Path.cwd()),'design/especime-v3/medicoes/h2-2026-10-04/portoes'])
sys.exit(r.returncode)
