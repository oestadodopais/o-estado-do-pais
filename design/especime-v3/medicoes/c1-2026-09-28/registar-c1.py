#!/usr/bin/env python3
"""Regista cada comando e o seu código, sem caminhos locais na saída guardada."""
import datetime
import hashlib
import json
import importlib.util
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
spec = importlib.util.spec_from_file_location('detetor_c1', AQUI/'medir-c1.py')
detetor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(detetor)


def publico(texto):
    for origem, destino in (
        (str(RAIZ), '<worktree do sítio>'),
        (str(Path.home() / 'Instruments' / 'ResearchHub'), '~/Instruments/ResearchHub'),
    ):
        texto = texto.replace(origem, destino)
    for prefixo in (str(Path.home().parent), tempfile.gettempdir(), '/private' + '/tmp', '/' + 'tmp'):
        texto = re.sub(re.escape(prefixo) + r'/[^\s"<>`\x1b]+', '<caminho local omitido>', texto)
    texto = re.sub(r'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b', '<anfitrião local>', texto, flags=re.I)
    texto = detetor.ABSOLUTO.sub(b'<caminho local omitido>', texto.encode()).decode()
    for nome in detetor.nomes_dos_autores():
        texto = re.sub(re.escape(nome.decode()), 'o diretor', texto, flags=re.I)
    return re.sub(re.escape(Path.home().name), '<utilizador local>', texto, flags=re.I)


def estado_da_arvore(cwd):
    def git(*args): return subprocess.check_output(['git', *args], cwd=cwd)
    nomes = set(git('diff', '--name-only', 'HEAD').decode().splitlines())
    nomes.update(git('ls-files', '--others', '--exclude-standard').decode().splitlines())
    return {'cabeca': git('rev-parse', 'HEAD').decode().strip(),
            'limpa': not nomes,
            'diferenca_sha256': hashlib.sha256(git('diff', 'HEAD', '--binary')).hexdigest(),
            'ficheiros': [{'ficheiro': n, 'sha256': hashlib.sha256((cwd/n).read_bytes()).hexdigest() if (cwd/n).is_file() else None} for n in sorted(nomes)]}


def main():
    args = sys.argv[1:]
    cwd = Path(os.environ.get('C1_CWD', RAIZ))
    nome = args.pop(0)
    p = AQUI / nome
    p.parent.mkdir(parents=True, exist_ok=True)
    agora = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    cabeca = subprocess.check_output(
        ['git', 'rev-parse', 'HEAD'], cwd=cwd, text=True).strip()
    for ext, valor in [('cabeca', cabeca), ('inicio', agora())]:
        Path(str(p) + '.' + ext).write_text(valor + '\n')
    Path(str(p) + '.arvore.json').write_text(publico(json.dumps(estado_da_arvore(cwd), ensure_ascii=False, indent=2)) + '\n')
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
