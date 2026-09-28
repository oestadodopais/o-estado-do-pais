#!/usr/bin/env python3
"""Regista cada comando e o seu código, sem caminhos locais na saída guardada."""
import datetime
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]


def publico(texto):
    for origem, destino in (
        (str(RAIZ), '<worktree do sítio>'),
        (str(Path.home() / 'Instruments' / 'ResearchHub'), '~/Instruments/ResearchHub'),
    ):
        texto = texto.replace(origem, destino)
    for prefixo in (str(Path.home().parent), tempfile.gettempdir(), '/private' + '/tmp', '/' + 'tmp'):
        texto = re.sub(re.escape(prefixo) + r'/[^\s"<>`\x1b]+', '<caminho local omitido>', texto)
    return re.sub(re.escape(Path.home().name), '<utilizador local>', texto, flags=re.I)


def main():
    args = sys.argv[1:]
    cwd = Path(os.environ.get('C1_CWD', RAIZ))
    nome = args.pop(0)
    p = AQUI / nome
    p.parent.mkdir(parents=True, exist_ok=True)
    agora = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    cabeca = os.environ.get('C1_CABECA') or subprocess.check_output(
        ['git', 'rev-parse', 'HEAD'], cwd=cwd, text=True).strip()
    for ext, valor in [('cabeca', cabeca), ('inicio', agora())]:
        Path(str(p) + '.' + ext).write_text(valor + '\n')
    Path(str(p) + '.codigo').unlink(missing_ok=True)
    with Path(str(p) + '.log').open('w') as log:
        processo = subprocess.Popen(args, cwd=cwd, stdout=subprocess.PIPE,
                                    stderr=subprocess.STDOUT, text=True)
        for linha in processo.stdout:
            log.write(publico(linha))
            log.flush()
        codigo = processo.wait()
    Path(str(p) + '.fim').write_text(agora() + '\n')
    Path(str(p) + '.codigo').write_text(str(codigo) + '\n')
    print(f'{nome}: código {codigo}; cabeça {cabeca}')
    return codigo


if __name__ == '__main__':
    raise SystemExit(main())
