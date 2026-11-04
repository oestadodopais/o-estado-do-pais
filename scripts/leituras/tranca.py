#!/usr/bin/env python3
"""Retira uma tranca caducada, serializando a decisão entre worktrees.

O ficheiro auxiliar fica ao lado da tranca comum. O bloqueio do sistema solta-se mesmo se
este processo morrer; apagar esse ficheiro criaria dois bloqueios distintos.
"""
import fcntl
import os
import re
from pathlib import Path
import sys
import time


def expirar(tranca):
    with Path(str(tranca) + '.expirar').open('a') as guarda:
        fcntl.flock(guarda, fcntl.LOCK_EX)
        try:
            # Relê sob exclusão, para não retirar a tranca nova de um concorrente.
            if time.time() - tranca.stat().st_mtime > 2400:
                pid = re.search(r'\bpid=(\d+)\b', tranca.read_text())
                if pid:
                    try:
                        os.kill(int(pid.group(1)), 0)
                        return  # Nunca expira uma corrida ainda viva.
                    except ProcessLookupError:
                        pass
                    except PermissionError:
                        return
                print(f'tranca com mais de quarenta minutos ({tranca.read_text().strip()}); ignora-se', file=sys.stderr)
                tranca.unlink()
        except FileNotFoundError:
            pass


if __name__ == '__main__':
    expirar(Path(sys.argv[1]))
