#!/usr/bin/env python3
"""H4: corre um comando, limpa os caminhos e escreve o código depois de acabar.

Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/executar.py <nome> <comando...>
"""
import getpass
from contextlib import contextmanager
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


@contextmanager
def tranca(ativa):
    if not ativa:
        yield
        return
    comum = subprocess.check_output(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'], text=True).strip()
    ficheiro = Path(comum) / 'oedp-construcao.lock'
    # A construção parcial usa a mesma tranca dos portões inteiros.
    # Nunca apaga uma tranca de outro processo.
    avisou = False
    while True:
        try:
            with ficheiro.open('x') as f:
                f.write(f'H4-b construção parcial pid={os.getpid()}\n')
            break
        except FileExistsError:
            if not avisou:
                print('À espera da tranca da máquina.', flush=True)
                avisou = True
            time.sleep(10)
    try:
        yield
    finally:
        ficheiro.unlink()


if __name__ == '__main__':
    nome, *comando = sys.argv[1:]
    tomar_tranca = comando[0] == '--tranca'
    if tomar_tranca:
        comando = comando[1:]
    inicio = time.time()
    ambiente = dict(os.environ, ASTRO_TELEMETRY_DISABLED='1', npm_config_cache=str(RAIZ / '.claude/h4/npm-cache'))
    with tranca(tomar_tranca), (AQUI / f'{nome}.log').open('w') as registo:
        p = subprocess.Popen(comando, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=ambiente)
        for linha in p.stdout:
            registo.write(limpar(linha))
            registo.flush()
        codigo = p.wait()
    (AQUI / f'{nome}.codigo').write_text(f'{codigo}\n')
    r = {'comando': limpar(' '.join(comando)), 'codigo': codigo,
         'tranca_da_maquina': tomar_tranca,
         'duracao_segundos': round(time.time() - inicio, 3),
         'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()}
    (AQUI / f'{nome}.json').write_text(json.dumps(r, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(r, ensure_ascii=False))
    sys.exit(codigo)
