"""Executa o comando real pelo curto.sh e guarda o código sem expor caminhos locais."""
import os, re, subprocess, sys
from pathlib import Path
p = Path(__file__).resolve().parent
nome, *comando = sys.argv[1:]
log = p / f'{nome}-h.log'
r = subprocess.run(['sh', 'scripts/leituras/curto.sh', str(log), *comando], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
def limpar(s):
    for raiz, marca in [(os.environ.get('RESEARCHHUB_DIR'), '<motor>'), (str(Path.cwd()), '<worktree>'), (str(Path.home()), '<utilizador>')]:
        if raiz: s = s.replace(raiz, marca)
    return re.sub(r'/(?:private/)?tmp/[^\s\"\']+', '<temporario>', s)
log.write_text(limpar(log.read_text()))
(p / f'{nome}.codigo').write_text(str(r.returncode) + '\n')
print(limpar(r.stdout))
sys.exit(r.returncode)
