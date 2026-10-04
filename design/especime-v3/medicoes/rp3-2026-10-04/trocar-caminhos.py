#!/usr/bin/env python3
"""RP3: troca os caminhos da máquina nos registos desta pasta por marcas, e diz quantos trocou, em caminhos-trocados.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/trocar-caminhos.py <raiz do sítio> <raiz do motor> <ficheiro>...

Os registos dos portões e das corridas do motor escrevem caminhos absolutos (a worktree,
a pasta temporária, a casa do utilizador), e nenhum ficheiro deste repositório público leva
um caminho da máquina nem o nome do utilizador dela. A troca é por marcas fixas, pela ordem
do mais comprido para o mais curto, e o ficheiro de saída diz, por registo, quantas trocas
de cada marca fez, sem escrever o caminho que trocou.
"""
import json
import os
import pathlib
import re
import sys
import tempfile

sitio, motor, *ficheiros = sys.argv[1:]
casa = str(pathlib.Path.home())
marcas = [
    (os.path.realpath(sitio), "<worktree do sítio>"),
    (sitio.rstrip("/"), "<worktree do sítio>"),
    (os.path.realpath(motor), "<worktree do motor>"),
    (motor.rstrip("/"), "<worktree do motor>"),
    (os.path.realpath("/tmp"), "<pasta temporária>"),
    (os.path.realpath(tempfile.gettempdir()), "<pasta temporária>"),
    (tempfile.gettempdir().rstrip("/"), "<pasta temporária>"),
    (casa, "<casa>"),
    (os.path.basename(casa), "<utilizador>"),
]
marcas.sort(key=lambda m: -len(m[0]))
saida_json = pathlib.Path(__file__).resolve().parent / "caminhos-trocados.json"
registo = json.loads(saida_json.read_text(encoding="utf-8")) if saida_json.is_file() else {}
for f in ficheiros:
    p = pathlib.Path(f)
    t = p.read_text(encoding="utf-8", errors="replace")
    contas = {}
    for de, para in marcas:
        if not de:
            continue
        n = t.count(de)
        if n:
            t = t.replace(de, para)
            contas[para] = contas.get(para, 0) + n
    p.write_text(t, encoding="utf-8")
    resto = len(re.findall(re.escape(os.path.basename(casa)), t))
    rel = os.path.relpath(p.resolve(), os.path.realpath(sitio))
    registo[rel] = {"trocas": contas, "restos_do_utilizador": resto}
saida_json.write_text(json.dumps(registo, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"trocar-caminhos: {len(ficheiros)} registo(s), {sum(sum(v['trocas'].values()) for v in registo.values())} troca(s) no total")
