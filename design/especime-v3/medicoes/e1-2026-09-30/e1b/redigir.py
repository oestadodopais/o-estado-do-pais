#!/usr/bin/env python3
"""Tira de um registo os caminhos da máquina e o nome do utilizador, no próprio ficheiro.

    python3 design/especime-v3/medicoes/e1-2026-09-30/e1b/redigir.py <motor> <ficheiro>...

Corre da raiz do sítio. A árvore do sítio passa a «[repositorio]», a do motor a «[motor]»,
a pasta pessoal a «[pasta-pessoal]» e o nome do utilizador a «[utilizador]», pela ordem do
caminho mais comprido para o mais curto; as sequências de cor do terminal saem. Sai 1 se,
depois disso, ainda houver num ficheiro um dos quatro.
"""
import getpass
import os
import re
import sys
from pathlib import Path

COR = re.compile(r"\x1b\[[0-9;]*m")


def main(argv):
    motor = os.path.realpath(argv[0])
    trocas = sorted({os.path.realpath(os.getcwd()): "[repositorio]", os.getcwd(): "[repositorio]",
                     motor: "[motor]", argv[0]: "[motor]",
                     os.path.expanduser("~"): "[pasta-pessoal]"}.items(), key=lambda t: -len(t[0]))
    utilizador = getpass.getuser()
    codigo = 0
    for nome in argv[1:]:
        p = Path(nome)
        t = COR.sub("", p.read_text(encoding="utf-8", errors="replace"))
        for velho, novo in trocas:
            t = t.replace(velho, novo)
        t = re.sub(r"\b" + re.escape(utilizador) + r"\b", "[utilizador]", t)
        p.write_text(t, encoding="utf-8")
        restos = [x for x in (os.path.expanduser("~"), utilizador) if x in t]
        if restos:
            codigo = 1
            print(f"{nome}: ainda tem {len(restos)} marca(s) da máquina")
    return codigo


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
