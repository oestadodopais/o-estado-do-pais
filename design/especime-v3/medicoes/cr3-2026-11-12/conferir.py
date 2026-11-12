"""Corre uma conferência, conserva o código e uma cauda sem caminhos locais."""
import os
import tempfile
import subprocess
import sys
from pathlib import Path

pasta = Path(__file__).resolve().parent / 'cr3-conferencias'
pasta.mkdir(exist_ok=True)
nome, *comando = sys.argv[1:]
registo = pasta / (nome + '.log')
resultado = subprocess.run(['sh', 'scripts/leituras/curto.sh', str(registo.relative_to(Path.cwd())), *comando], capture_output=True, text=True)
def limpar(texto):
    for valor, nome_local in sorted(((str(Path.cwd()), '<worktree>'), (os.environ.get('RESEARCHHUB_DIR', ''), '<motor>'), (str(Path.home()), '<utilizador>'), (tempfile.gettempdir(), '<temporario>')), key=lambda x: -len(x[0])):
        if valor:
            texto = texto.replace(valor, nome_local)
    return texto
if registo.exists():
    limpo = limpar(registo.read_text())
    registo.write_text(limpo)
    (pasta / (nome + '.cauda.txt')).write_text('\n'.join(limpo.splitlines()[-20:]) + '\n')
(pasta / (nome + '.codigo')).write_text(str(resultado.returncode) + '\n')
print(limpar(resultado.stdout + resultado.stderr), end='')
sys.exit(resultado.returncode)
