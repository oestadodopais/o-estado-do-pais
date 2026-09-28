"""Identifica a árvore usada nas corridas antigas, sem fingir um retrato da altura."""
import argparse, hashlib, json, subprocess
from pathlib import Path
AQUI=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--motor',type=Path,required=True);args=ap.parse_args()
commit='cf1082be38dda1bf044f1fbfb9b258357faeb98a'
r=[]
for nome,ficheiro in [('gerador-rede','indicators/enquadramento.py'),('painel','indicators/refresh.py')]:
    corpo=subprocess.check_output(['git','show',f'{commit}:{ficheiro}'],cwd=args.motor)
    base=AQUI.parent/'c1c'/nome
    estado={'reconstituido_na':'C1d','cabeca_na_corrida':Path(str(base)+'.cabeca').read_text().strip(),
      'inicio':Path(str(base)+'.inicio').read_text().strip(),'arvore_limpa':False,
      'codigo_em_trabalho_depois_guardado_em':commit,'ficheiro_executado':ficheiro,
      'sha256_do_ficheiro_no_commit':hashlib.sha256(corpo).hexdigest(),
      'fundamento':'Decisão do lugar de direção no mandato C1d, achado 24 da leitura a frio; os ficheiros tinham sido editados antes das corridas e foram guardados neste commit.',
      'limite':'O registo antigo guardou só a cabeça. Este complemento não afirma um resumo integral da árvore na hora da corrida.'}
    Path(str(base)+'.arvore.json').write_text(json.dumps(estado,ensure_ascii=False,indent=2)+'\n');r.append(estado)
(AQUI/'corridas-c1c.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
