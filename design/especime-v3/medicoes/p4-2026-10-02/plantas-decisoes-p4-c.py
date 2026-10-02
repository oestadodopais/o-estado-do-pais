#!/usr/bin/env python3
"""P4-c (02.10.2026, achado 6 da leitura a frio): as provas do guião das decisões em vigor no modo dos ficheiros.

Corre o guião de hoje (`scripts/leituras/decisoes-em-vigor.py`) e o de antes da passagem (o da cabeça 4012a35c, lido
do Git), cada um em três casos: um ficheiro que existe; o mesmo e um nome que não existe; e, só no de hoje, o
conhecido-positivo com o nome «que não existe» trocado por um que existe (tem de sair com 2, porque o detetor deixa
de ver o caso que tem de recusar). O guião de antes corre com o mesmo caminho do de hoje, a partir de uma cópia ao
lado dele que se apaga no fim, para que a raiz do sítio que ele calcula seja a mesma.

Uso, da raiz da worktree: python3 design/especime-v3/medicoes/p4-2026-10-02/plantas-decisoes-p4-c.py
Sai 0 quando o de hoje dá 0, 1 e 2 nos três casos; 1 se não.
"""
import os
import runpy
import subprocess
import sys

GUIAO = "scripts/leituras/decisoes-em-vigor.py"
COPIA = "scripts/leituras/decisoes-em-vigor-antes-p4c.py"
ANTES = "4012a35c"
INEXISTENTE = "scripts/nao-existe-de-todo.mjs"


def corre(guiao, *args):
    r = subprocess.run(["python3", guiao, *args], capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr)


resultados = []
with open(COPIA, "w", encoding="utf-8") as f:
    f.write(subprocess.run(["git", "show", f"{ANTES}:{GUIAO}"], capture_output=True, text=True, check=True).stdout)
try:
    for nome, guiao in (("hoje", GUIAO), (f"antes ({ANTES})", COPIA)):
        c1, _ = corre(guiao, "scripts/check-lugar.mjs")
        c2, s2 = corre(guiao, "scripts/check-lugar.mjs", INEXISTENTE)
        diz = INEXISTENTE in s2
        resultados.append((nome, c1, c2, diz))
        print(f"{nome}: um ficheiro que existe → código {c1}; o mesmo e «{INEXISTENTE}» → código {c2}, e a saída {'diz' if diz else 'não diz'} o nome")
finally:
    os.remove(COPIA)

# O conhecido-positivo de hoje, com o nome «que não existe» trocado por um que existe: tem de deixar de ver, e sair com 2.
g = runpy.run_path(GUIAO, run_name="planta")
g["main"].__globals__["NOME_QUE_NAO_EXISTE"] = "scripts/check-lugar.mjs"
sys.argv = [GUIAO, "scripts/check-lugar.mjs"]
c3 = g["main"]()
print(f"hoje, com o nome que não existe trocado por um que existe: código {c3} (o conhecido-positivo tem de falhar com 2)")

hoje = resultados[0]
certo = hoje[1] == 0 and hoje[2] == 1 and hoje[3] and c3 == 2
print("as provas do modo dos ficheiros: " + ("certas" if certo else "ERRADAS"))
sys.exit(0 if certo else 1)
