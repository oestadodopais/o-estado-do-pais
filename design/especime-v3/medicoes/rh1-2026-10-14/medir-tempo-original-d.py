import json
from pathlib import Path
import subprocess
import sys
import time
try:
    pasta = Path('design/especime-v3/medicoes/rh1-2026-10-14')
    inicio = time.perf_counter()
    r = subprocess.run(['python3', 'scripts/check-privacidade.py', '--prova'], capture_output=True)
    segundos = time.perf_counter() - inicio
    if r.returncode:
        raise RuntimeError('Conferência recusada.')
    dados = json.loads(r.stdout)
    resultado = {'comando': 'python3 scripts/check-privacidade.py --prova',
                 'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip(),
                 'versao_dist': json.loads(Path('dist/version.json').read_text()),
                 'segundos': segundos, 'codigo': r.returncode, 'passou': dados['passou'],
                 'ficheiros_dist': dados['ficheiros'], 'ficheiros_seguidos': dados['rastreado']['ficheiros']}
    (pasta / ('tempo-' + sys.argv[1] + '-d.json')).write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(resultado, ensure_ascii=False))
except Exception:
    print('RH1-d: medição de tempo recusada sem publicar dados privados.', file=sys.stderr)
    raise SystemExit(1)
