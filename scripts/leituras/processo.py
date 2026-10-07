#!/usr/bin/env python3
"""Corre um portão num grupo próprio, para uma interrupção alcançar os filhos.

O dono da tranca espera por este supervisor antes de a soltar. TERM e INT
atingem o grupo inteiro do portão e têm prazo de saída
para que um filho que ignore o sinal não conserve a construção em andamento.
"""
import os
import signal
import subprocess
import sys


def principal():
    filho = subprocess.Popen(sys.argv[1:], start_new_session=True)
    interrompido = None

    def interromper(sinal, _frame):
        nonlocal interrompido
        interrompido = sinal
        try:
            os.killpg(filho.pid, sinal)
        except ProcessLookupError:
            pass

    for sinal in (signal.SIGINT, signal.SIGTERM):
        signal.signal(sinal, interromper)
    while True:
        try:
            codigo = filho.wait(timeout=0.2)
            break
        except subprocess.TimeoutExpired:
            if interrompido is not None:
                try:
                    filho.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    pass
                break
    if interrompido is not None:
        # O processo principal pode já ter saído e ter deixado descendentes.
        try:
            os.killpg(filho.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        filho.wait()
        return 128 + interrompido
    return codigo if codigo >= 0 else 128 - codigo


if __name__ == '__main__':
    raise SystemExit(principal())
