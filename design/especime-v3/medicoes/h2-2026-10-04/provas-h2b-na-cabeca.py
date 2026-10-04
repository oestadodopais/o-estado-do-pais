import os,subprocess,sys
from pathlib import Path
p=Path(sys.argv[1]);p.mkdir(exist_ok=True)
env=os.environ.copy();env.update(OEDP_MEDICOES=str(p),OEDP_CAPTURAS=str(p/'capturas'),OEDP_EXIGIR_ARVORE_LIMPA='1')
r='design/especime-v3/medicoes/h2-2026-10-04/correr.py'
passos=[
('astro-trabalho',['npm','run','astro','--','build']),('stamp-trabalho',['npm','run','stamp:version']),('cartoes-trabalho',['npm','run','cartoes']),
('html-trabalho',['npm','run','gate:html']),('pais-trabalho',['npm','run','check:pais']),('lugar-trabalho',['npm','run','check:lugar']),('areas-trabalho',['npm','run','check:areas']),('voz-trabalho',['npm','run','check:voz']),
('em-curso-trabalho',['node','tests/inicio/estudos-em-curso.mjs']),('mapa',['python3','scripts/leituras/conferir-mapa.py','design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md']),
('pacote-planta',['python3','tests/leituras/pacote.py','--json',str(p/'pacote-plantas.json')]),
('plantas-portoes-trabalho',['node','tests/pais/portoes.mjs','--prefixo','h2-']),('plantas-h2b-trabalho',['node','tests/pais/portoes.mjs','--prefixo','h2b-']),
('capturas-trabalho',['node','design/especime-v3/medicoes/h2-2026-10-04/captar-h2.mjs'])]
for nome,cmd in passos:
 subprocess.run(['python3',r,nome,*cmd],env=env,check=True)
print('Todas as provas da cabeça limpa acabaram.')
