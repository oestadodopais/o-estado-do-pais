"""Corre uma conferência pelo curto.sh e guarda apenas caminhos anonimizados."""
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

out = Path(__file__).resolve().parent
site = Path.cwd()
motor = Path(os.environ['RESEARCHHUB_DIR']).resolve()
nome, *cmd = sys.argv[1:]
cwd = motor if cmd[0] == '--motor' else site
if cmd[0] == '--motor':
    cmd.pop(0)

def limpar(s):
    for a, b in ((str(motor), '<motor>'), (str(site), '<worktree>'),
                 (str(Path.home()), '<utilizador>'), (tempfile.gettempdir(), '<temporario>')):
        s = s.replace(a, b)
    return s

inicio = time.monotonic()
with tempfile.TemporaryDirectory() as tmp:
    log = Path(tmp) / (nome + '.log')
    r = subprocess.run(['sh', str(site / 'scripts/leituras/curto.sh'), str(log), *cmd],
                       cwd=cwd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (out / (nome + '.log')).write_text(limpar(log.read_text()) if log.exists() else limpar(r.stdout))
    print(limpar(r.stdout))
(out / (nome + '.codigo')).write_text(str(r.returncode) + '\n')
(out / (nome + '.execucao.json')).write_text(json.dumps({'comando': [limpar(c) for c in cmd],
    'pasta': '<motor>' if cwd == motor else '<worktree>', 'codigo': r.returncode,
    'duracao_segundos': round(time.monotonic() - inicio, 3)}, ensure_ascii=False, indent=2) + '\n')
sys.exit(r.returncode)
