import json,os,subprocess,sys
from pathlib import Path
p=Path(sys.argv[1]);p.mkdir(exist_ok=True)
env=os.environ.copy();env.update(OEDP_MEDICOES=str(p),OEDP_EXIGIR_ARVORE_LIMPA='1')
if len(sys.argv)>2 and sys.argv[2]=='conferencias':
    r='design/especime-v3/medicoes/h2-2026-10-04/correr.py'
    for nome,cmd in [
        ('pacote-h2c',['python3','tests/leituras/pacote.py','--json',str(p/'pacote-casos-h2c.json')]),
        ('e1-trabalho-h2c',['node','tests/inicio/estudos-em-curso.mjs']),
        ('mapa-h2c',['python3','scripts/leituras/conferir-mapa.py','design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'])]:
        subprocess.run(['python3',r,nome,*cmd],env=env,check=True)
else:
    assert subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],text=True)==''
    head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    subprocess.run(['sh','design/especime-v3/medicoes/p4-2026-10-02/com-tranca.sh',str(Path.cwd()),str(p/'corrida-h2c.log'),str(p/'corrida-h2c.codigo'),'python3',__file__,str(p),'conferencias'],check=True)
    assert (p/'corrida-h2c.codigo').read_text().strip()=='0'
    for nome in ['pacote-h2c','e1-trabalho-h2c','mapa-h2c']:
        r=json.loads((p/(nome+'.json')).read_text())
        assert r['cabeca']==head and r['estado']=='' and r['estado_fim']=='' and r['codigo']==0
    status=subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],text=True)
    assert status==''
    (p/'portoes-estado-inicial-h2c.json').write_text(json.dumps({'cabeca':head,'estado':status,'comando':'git status --porcelain --untracked-files=no'},indent=2)+'\n')
    print('Provas H2-c na cabeça limpa passaram; começam os portões inteiros.',flush=True)
    subprocess.run(['sh','scripts/leituras/portoes.sh',str(Path.cwd()),'design/especime-v3/medicoes/h2-2026-10-04/portoes'],check=True)
