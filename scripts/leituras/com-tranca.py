#!/usr/bin/env python3
"""A tranca comum envolve o comando inteiro; filhos reconhecem o dono herdado."""
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
from tranca import expirar


def main(args):
    tranca = Path(os.environ.get('OEDP_TRANCA', '/tmp/oedp-construcao.lock'))
    herdado = os.environ.get('OEDP_TRANCA_DONO')
    if herdado and tranca.exists() and tranca.read_text().strip() == herdado.strip():
        return subprocess.call(args)
    inicio = time.monotonic()
    dono = f'pid={os.getpid()} <worktree> comando\n'
    while True:
        try:
            with tranca.open('x') as f:
                f.write(dono)
            break
        except FileExistsError:
            expirar(tranca)
            if time.monotonic() - inicio > 3600:
                raise RuntimeError('esgotado o teto de espera pela tranca')
            time.sleep(0.1)
    espera = time.monotonic() - inicio
    filho = None
    codigo = 9
    def interromper(sig, _frame):
        raise KeyboardInterrupt
    for sig in (signal.SIGINT, signal.SIGTERM):
        signal.signal(sig, interromper)
    try:
        filho = subprocess.Popen(args, env={**os.environ, 'OEDP_TRANCA_DONO': dono.strip()}, start_new_session=True)
        while filho.poll() is None:
            os.utime(tranca, None)
            try:
                filho.wait(timeout=1)
            except subprocess.TimeoutExpired:
                pass
        codigo = filho.returncode
    except KeyboardInterrupt:
        codigo = 130
    finally:
        if filho is not None:
            # Também elimina descendentes que sobrevivam ao processo principal.
            try:
                os.killpg(filho.pid, signal.SIGTERM)
                filho.wait(timeout=5)
                try:
                    os.killpg(filho.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
            except subprocess.TimeoutExpired:
                os.killpg(filho.pid, signal.SIGKILL)
                filho.wait()
            except ProcessLookupError:
                pass
        if tranca.exists() and tranca.read_text() == dono:
            tranca.unlink()
        print(json.dumps({'tranca': 'libertada', 'espera_segundos': espera,
                          'execucao_segundos': time.monotonic() - inicio - espera, 'codigo': codigo}), flush=True)
    return codigo


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
