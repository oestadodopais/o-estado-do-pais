#!/usr/bin/env python3
"""H4: corre um comando, limpa os caminhos e escreve o código depois de acabar.

Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/executar.py <nome> <comando...>
"""
import getpass
import json
import os
from pathlib import Path
import subprocess
import sys
import time

AQUI = Path(__file__).resolve().parent
RAIZ = Path.cwd()


def limpar(s):
    return s.replace(str(RAIZ), '<worktree>').replace(str(Path.home()), '<casa>').replace(getpass.getuser(), '<utilizador>')


if __name__ == '__main__':
    nome, *comando = sys.argv[1:]
    inicio = time.time()
    ambiente = dict(os.environ, ASTRO_TELEMETRY_DISABLED='1', npm_config_cache=str(RAIZ / '.claude/h4/npm-cache'))
    with (AQUI / f'{nome}.log').open('w') as registo:
        p = subprocess.Popen(comando, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=ambiente)
        for linha in p.stdout:
            registo.write(limpar(linha))
            registo.flush()
        codigo = p.wait()
    (AQUI / f'{nome}.codigo').write_text(f'{codigo}\n')
    r = {'comando': limpar(' '.join(comando)), 'codigo': codigo,
         'duracao_segundos': round(time.time() - inicio, 3),
         'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()}
    (AQUI / f'{nome}.json').write_text(json.dumps(r, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(r, ensure_ascii=False))
    sys.exit(codigo)
