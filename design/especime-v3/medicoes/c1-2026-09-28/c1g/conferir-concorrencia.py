"""Pergunta ao pgrep sem guardar argumentos, nomes de máquina ou ambiente."""
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import sys
r=subprocess.run(['pgrep','-fl','astro build|npm run verify'],capture_output=True,text=True)
if r.returncode not in (0,1):raise RuntimeError('Não foi possível conferir os processos.')
linhas=r.stdout.splitlines()
ativos=[x.split()[0] for x in linhas if not any(t in x for t in ('zsh -c','python3 -c','pgrep -fl'))]
prova={'quando':datetime.now(timezone.utc).isoformat(),'comando':'pgrep -fl "astro build|npm run verify"','processos_ativos':ativos,'invólucros_de_shell':len(linhas)-len(ativos),'livre':not ativos}
if len(sys.argv)>1 and not ativos:Path(sys.argv[1]).write_text(json.dumps(prova,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(prova,ensure_ascii=False));raise SystemExit(bool(ativos))
